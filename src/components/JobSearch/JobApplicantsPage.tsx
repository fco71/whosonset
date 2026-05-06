import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { JobApplication } from '../../types/JobApplication';
import { FileUploadService } from '../../utilities/fileUploadService';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';
import Card from '../ui/Card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import ApplicationMessaging from './ApplicationMessaging';
import ResumeDownloadButton from '../ResumeDownloadButton';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Star, 
  Heart, 
  Eye, 
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  Filter,
  Search,
  MoreHorizontal,
  Send,
  User,
  Award,
  TrendingUp,
  Download,
  FileText,
  Paperclip
} from 'lucide-react';
import EmailNotificationService from '../../utilities/emailNotificationService';

interface ApplicantProfile {
  uid: string;
  name: string;
  username: string;
  bio: string;
  jobTitles: string[];
  experience: string;
  location: string;
  skills: string[];
  availability: string;
  expectedSalary?: number;
  portfolio?: string;
  phone?: string;
  email?: string;
  profileImageUrl?: string;
}

interface JobApplicantsPageProps {
  jobId?: string;
}

type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected' | 'withdrawn';

const KANBAN_COLUMNS: Array<{
  id: ApplicationStatus;
  label: string;
  badgeClass: string;
}> = [
  { id: 'pending', label: 'New', badgeClass: 'bg-yellow-100 text-yellow-800' },
  { id: 'reviewed', label: 'Reviewing', badgeClass: 'bg-blue-100 text-blue-800' },
  { id: 'shortlisted', label: 'Shortlisted', badgeClass: 'bg-purple-100 text-purple-800' },
  { id: 'interviewed', label: 'Interviewing', badgeClass: 'bg-indigo-100 text-indigo-800' },
  { id: 'hired', label: 'Offer / Hired', badgeClass: 'bg-green-100 text-green-800' },
  { id: 'rejected', label: 'Rejected', badgeClass: 'bg-red-100 text-red-800' },
];

const JobApplicantsPage: React.FC<JobApplicantsPageProps> = ({ jobId: propJobId }) => {
  const navigate = useNavigate();
  const { jobId: urlJobId } = useParams<{ jobId: string }>();
  const { currentUser } = useAuth();
  
  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [applicantProfiles, setApplicantProfiles] = useState<{[key: string]: ApplicantProfile}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('grid');

  const actualJobId = propJobId || urlJobId;

  useEffect(() => {
    if (actualJobId) {
      loadJobAndApplications();
    }
  }, [actualJobId]);

  const loadJobAndApplications = async () => {
    try {
      setIsLoading(true);
      
      // Load job details
      const jobDoc = await getDoc(doc(db, 'jobPostings', actualJobId!));
      if (jobDoc.exists()) {
        setJob({ id: jobDoc.id, ...jobDoc.data() });
      }

      // Load applications
      const applicationsQuery = query(
        collection(db, 'jobApplications'),
        where('jobId', '==', actualJobId)
      );
      const applicationsSnapshot = await getDocs(applicationsQuery);
      const applicationsData = applicationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JobApplication[];
      
      setApplications(applicationsData);

      // Load applicant profiles
      const applicantIds = applicationsData.map(app => app.applicantId);
      const profilesMap: {[key: string]: ApplicantProfile} = {};
      
      for (const applicantId of applicantIds) {
        try {
          const profileQuery = query(collection(db, 'crewProfiles'), where('uid', '==', applicantId));
          const profileSnapshot = await getDocs(profileQuery);
          
          if (!profileSnapshot.empty) {
            const profileData = profileSnapshot.docs[0].data();
            profilesMap[applicantId] = {
              uid: profileData.uid || applicantId,
              name: profileData.name || 'Unknown',
              username: profileData.username || profileData.name?.toLowerCase().replace(/\s+/g, '') || 'unknown',
              bio: profileData.bio || '',
              jobTitles: profileData.jobTitles || [],
              experience: profileData.experience || 'Not specified',
              location: profileData.location || 'Not specified',
              skills: profileData.skills || [],
              availability: profileData.availability || 'Not specified',
              expectedSalary: profileData.expectedSalary,
              portfolio: profileData.portfolio,
              phone: profileData.phone,
              email: profileData.email,
              profileImageUrl: profileData.profileImageUrl || profileData.photoURL || profileData.avatarUrl
            };
          } else {
            // Create a basic profile if none exists
            profilesMap[applicantId] = {
              uid: applicantId,
              name: 'Unknown Applicant',
              username: 'unknown',
              bio: 'Profile not available',
              jobTitles: [],
              experience: 'Not specified',
              location: 'Not specified',
              skills: [],
              availability: 'Not specified'
            };
          }
        } catch (error) {
          console.error('Error fetching profile for applicantId:', applicantId, error);
          profilesMap[applicantId] = {
            uid: applicantId,
            name: 'Unknown Applicant',
            username: 'unknown',
            bio: 'Profile not available',
            jobTitles: [],
            experience: 'Not specified',
            location: 'Not specified',
            skills: [],
            availability: 'Not specified'
          };
        }
      }
      
      setApplicantProfiles(profilesMap);
    } catch (error) {
      console.error('Error loading job and applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await updateDoc(doc(db, 'jobApplications', applicationId), {
        status: newStatus,
        lastUpdated: serverTimestamp()
      });
      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      // Fetch the application to get applicantId
      const applicationDoc = await getDoc(doc(db, 'jobApplications', applicationId));
      const applicationData = applicationDoc.data();
      if (applicationData && applicationData.applicantId) {
        // Cloud Function handles in-app status notifications. Keep email notification on client as backup.
        await EmailNotificationService.sendApplicationStatusUpdateEmail(applicationData.applicantId, newStatus, applicationId);
      }
      toast.success(`Application ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update status');
    }
  };



  const handleFavorite = async (applicationId: string) => {
    try {
      // Add to favorites collection
      await addDoc(collection(db, 'users', currentUser!.uid, 'favoriteApplicants'), {
        applicationId,
        addedAt: serverTimestamp()
      });
      toast.success('Applicant added to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add to favorites');
    }
  };

  const handleShortlist = async (applicationId: string) => {
    try {
      await updateDoc(doc(db, 'jobApplications', applicationId), {
        shortlisted: true,
        shortlistedAt: serverTimestamp()
      });
      toast.success('Applicant shortlisted');
    } catch (error) {
      console.error('Error shortlisting applicant:', error);
      toast.error('Failed to shortlist');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'interviewed': return 'bg-indigo-100 text-indigo-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewed': return <Eye className="w-4 h-4" />;
      case 'shortlisted': return <Star className="w-4 h-4" />;
      case 'interviewed': return <Calendar className="w-4 h-4" />;
      case 'hired': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString();
  };

  const formatSalary = (salary: number | undefined) => {
    if (!salary) return 'Not specified';
    return `$${salary.toLocaleString()}`;
  };

  const formatFileSize = (bytes: number): string => {
    return FileUploadService.formatFileSize(bytes);
  };

  const getFileIcon = (fileName: string): string => {
    return FileUploadService.getFileIcon(fileName);
  };

  const handleDownloadFile = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewFile = (url: string) => {
    window.open(url, '_blank');
  };

  const filteredAndSortedApplications = applications
    .filter(app => {
      const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
      const matchesSearch = searchQuery === '' || 
        applicantProfiles[app.applicantId]?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicantProfiles[app.applicantId]?.jobTitles.some(title => 
          title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return applicantProfiles[a.applicantId]?.name.localeCompare(applicantProfiles[b.applicantId]?.name || '');
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return (b.appliedAt?.toDate?.() || new Date(b.appliedAt)).getTime() - 
                 (a.appliedAt?.toDate?.() || new Date(a.appliedAt)).getTime();
      }
    });

  const kanbanApplications = applications
    .filter((app) => {
      if (!searchQuery.trim()) {
        return true;
      }

      const profile = applicantProfiles[app.applicantId];
      const normalizedSearch = searchQuery.toLowerCase();
      return (
        profile?.name?.toLowerCase().includes(normalizedSearch) ||
        profile?.jobTitles?.some((title) => title.toLowerCase().includes(normalizedSearch)) ||
        profile?.skills?.some((skill) => skill.toLowerCase().includes(normalizedSearch))
      );
    })
    .sort((a, b) => {
      return (b.appliedAt?.toDate?.() || new Date(b.appliedAt)).getTime() -
        (a.appliedAt?.toDate?.() || new Date(a.appliedAt)).getTime();
    });

  const kanbanByStatus = KANBAN_COLUMNS.reduce((acc, column) => {
    acc[column.id] = kanbanApplications.filter((application) => application.status === column.id);
    return acc;
  }, {} as Record<ApplicationStatus, JobApplication[]>);

  const onKanbanDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      return;
    }

    const destinationStatus = destination.droppableId as ApplicationStatus;
    const currentApplication = applications.find((application) => application.id === draggableId);
    if (!currentApplication || currentApplication.status === destinationStatus) {
      return;
    }

    await handleStatusUpdate(draggableId, destinationStatus);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg font-light text-gray-600">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">❌</div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/jobs')}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/jobs/${actualJobId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            ← Back to Job
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                Applicants for {job.title}
              </h1>
              <p className="text-gray-600">
                {applications.length} application{applications.length !== 1 ? 's' : ''} • {job.department} • {job.location}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate(`/jobs/${actualJobId}`)}>
                <Eye className="w-4 h-4 mr-2" />
                View Job
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search applicants by name or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewed">Interviewed</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="status">Sort by Status</option>
              </select>

              <div className="flex rounded-lg border border-gray-300 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                    viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('kanban')}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                    viewMode === 'kanban' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Kanban
                </button>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedApplications.map((application) => {
              const profile = applicantProfiles[application.applicantId];
              
              return (
                <Card key={application.id} className="p-6 hover:shadow-lg transition-shadow">
                  {/* Applicant Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage 
                          src={profile?.profileImageUrl || '/bust-avatar.svg'} 
                          alt={profile?.name || 'Applicant'} 
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{profile?.name}</h3>
                        <p className="text-sm text-gray-600">@{profile?.username}</p>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      {application.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Applicant Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{profile?.jobTitles?.slice(0, 2).join(', ') || 'No titles specified'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{profile?.location || 'Location not specified'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>Expected: {formatSalary(application.expectedSalary)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Applied {formatDate(application.appliedAt)}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  {profile?.skills && profile.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                        {profile.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{profile.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowApplicantModal(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowMessageModal(true);
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFavorite(application.id)}
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      Favorite
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(application.id, 'shortlisted')}
                        className="flex-1 text-xs"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Shortlist
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(application.id, 'interviewed')}
                        className="flex-1 text-xs"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Interview
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(application.id, 'hired')}
                        className="flex-1 text-xs"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Hire
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto pb-3">
            <DragDropContext onDragEnd={onKanbanDragEnd}>
              <div className="flex min-w-max gap-4">
                {KANBAN_COLUMNS.map((column) => (
                  <div key={column.id} className="w-72 rounded-xl border border-gray-200 bg-white">
                    <div className={`flex items-center justify-between rounded-t-xl px-4 py-3 ${column.badgeClass}`}>
                      <h3 className="text-sm font-semibold">{column.label}</h3>
                      <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold">
                        {kanbanByStatus[column.id]?.length || 0}
                      </span>
                    </div>
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[240px] space-y-3 p-3 transition ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
                        >
                          {(kanbanByStatus[column.id] || []).map((application, index) => {
                            const profile = applicantProfiles[application.applicantId];
                            return (
                              <Draggable key={application.id} draggableId={application.id} index={index}>
                                {(dragProvided) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                                  >
                                    <p className="font-semibold text-gray-900">{profile?.name || 'Unknown Applicant'}</p>
                                    <p className="mt-1 text-xs text-gray-600">
                                      {profile?.jobTitles?.slice(0, 1).join(', ') || 'No title listed'}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">Applied {formatDate(application.appliedAt)}</p>
                                    <div className="mt-3 flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedApplication(application);
                                          setShowApplicantModal(true);
                                        }}
                                        className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                      >
                                        Details
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedApplication(application);
                                          setShowMessageModal(true);
                                        }}
                                        className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                      >
                                        Message
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </div>
        )}

        {((viewMode === 'grid' && filteredAndSortedApplications.length === 0) ||
          (viewMode === 'kanban' && kanbanApplications.length === 0)) && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
            <p className="text-gray-600">
              {applications.length === 0 
                ? "No one has applied to this job yet." 
                : "No applicants match your current filters."
              }
            </p>
          </div>
        )}
      </div>

      {/* Applicant Details Modal */}
      {showApplicantModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowApplicantModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Applicant Details</h2>
                <button
                  onClick={() => setShowApplicantModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{applicantProfiles[selectedApplication.applicantId]?.email || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{applicantProfiles[selectedApplication.applicantId]?.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{applicantProfiles[selectedApplication.applicantId]?.location || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Professional Info</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Experience:</span>
                        <span className="ml-2">{applicantProfiles[selectedApplication.applicantId]?.experience}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Expected Salary:</span>
                        <span className="ml-2">{formatSalary(selectedApplication.expectedSalary)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Availability:</span>
                        <span className="ml-2">{applicantProfiles[selectedApplication.applicantId]?.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {applicantProfiles[selectedApplication.applicantId]?.bio && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Bio</h3>
                    <p className="text-sm text-gray-600">
                      {applicantProfiles[selectedApplication.applicantId]?.bio}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {applicantProfiles[selectedApplication.applicantId]?.skills && 
                 applicantProfiles[selectedApplication.applicantId]?.skills.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {applicantProfiles[selectedApplication.applicantId]?.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Portfolio */}
                {applicantProfiles[selectedApplication.applicantId]?.portfolio && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Portfolio</h3>
                    <a
                      href={applicantProfiles[selectedApplication.applicantId]?.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Portfolio
                    </a>
                  </div>
                )}

                {/* Application Details */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Application Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Applied:</span>
                      <span className="ml-2">{formatDate(selectedApplication.appliedAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status.replace('_', ' ')}
                      </span>
                    </div>
                    {selectedApplication.availabilityDate && (
                      <div>
                        <span className="text-gray-600">Available from:</span>
                        <span className="ml-2">{selectedApplication.availabilityDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Uploaded Documents */}
                {selectedApplication.attachments && selectedApplication.attachments.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Uploaded Documents</h3>
                    <div className="space-y-2">
                      {/* Resume */}
                      {selectedApplication.attachments.find(att => att.type === 'resume') && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">📄</span>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">Resume</p>
                                <p className="text-xs text-gray-600">Submitted with application</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {(() => {
                                const resumeAttachment = selectedApplication.attachments?.find(att => att.type === 'resume');
                                return resumeAttachment ? (
                                  <>
                                    <button
                                      onClick={() => handleViewFile(resumeAttachment.url)}
                                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                                      title="View Resume"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <ResumeDownloadButton
                                      resumeUrl={resumeAttachment.url}
                                      fileName={resumeAttachment.name}
                                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                                      variant="outline"
                                      size="small"
                                    />
                                  </>
                                ) : null;
                              })()}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Other Attachments */}
                      {selectedApplication.attachments.filter(att => att.type !== 'resume').length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 mb-2">Additional Documents ({selectedApplication.attachments.filter(att => att.type !== 'resume').length})</p>
                          {selectedApplication.attachments.filter(att => att.type !== 'resume').map((attachment, index) => (
                            <div key={attachment.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{getFileIcon(attachment.name)}</span>
                                  <div>
                                    <p className="font-medium text-gray-900 text-sm">{attachment.name}</p>
                                    <p className="text-xs text-gray-600">{formatFileSize(attachment.size)}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleViewFile(attachment.url)}
                                    className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="View Document"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDownloadFile(attachment.url, attachment.name)}
                                    className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Download Document"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(!selectedApplication.attachments || selectedApplication.attachments.length === 0) && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Uploaded Documents</h3>
                    <div className="text-center py-4 text-gray-500">
                      <Paperclip className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No documents uploaded</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      setShowApplicantModal(false);
                      setShowMessageModal(true);
                    }}
                    className="flex-1"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleShortlist(selectedApplication.id)}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Shortlist
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleFavorite(selectedApplication.id)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Favorite
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedApplication && (
        <ApplicationMessaging 
          applicationId={selectedApplication.id}
          isModal={true}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </div>
  );
};

export default JobApplicantsPage; 
