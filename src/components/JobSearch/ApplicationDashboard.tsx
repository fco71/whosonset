import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { JobApplicationService } from '../../services/jobApplicationService';
import { JobApplication } from '../../types/JobApplication';
import ApplicationStatusBadge, { ApplicationStatus } from './ApplicationStatusBadge';
import Card, { CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import Select from '../ui/Select';
import { 
  Filter, 
  Search, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowUpDown,
  Building,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

interface JobPostingSummary {
  id: string;
  title: string;
  companyName?: string;
  department?: string;
  location?: string;
  status?: string;
  postedAt?: any;
  postedById: string;
}

interface ApplicationWithJob {
  application: JobApplication;
  job: JobPostingSummary | null;
}

const ApplicationDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationWithJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter and sort state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('appliedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    interviewed: 0,
    hired: 0,
    rejected: 0,
    withdrawn: 0
  });

  useEffect(() => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    const unsubscribe = JobApplicationService.subscribeToUserApplications(currentUser.uid, async (applications) => {
      try {
        const jobs = await Promise.all(applications.map(async (app) => {
          if (!app.jobId) return { application: app, job: null };
          const jobDoc = await getDocs(query(
            collection(db, 'jobPostings'),
            where('__name__', '==', app.jobId)
          ));
          
          if (!jobDoc.empty) {
            const jobData = jobDoc.docs[0].data();
            return {
              application: app,
              job: {
                id: jobDoc.docs[0].id,
                title: jobData.title || 'Untitled Job',
                companyName: jobData.companyName || jobData.company || '',
                department: jobData.department || '',
                location: jobData.location || '',
                status: jobData.status || '',
                postedAt: jobData.postedAt || null,
                postedById: jobDoc.docs[0].id, // Assuming jobId is the document ID
              } as JobPostingSummary
            };
          }
          
          return { application: app, job: null };
        }));
        
        setApplications(jobs);
        
        // Calculate stats
        const newStats = {
          total: jobs.length,
          pending: jobs.filter(j => j.application.status === 'pending').length,
          reviewed: jobs.filter(j => j.application.status === 'reviewed').length,
          shortlisted: jobs.filter(j => j.application.status === 'shortlisted').length,
          interviewed: jobs.filter(j => j.application.status === 'interviewed').length,
          hired: jobs.filter(j => j.application.status === 'hired').length,
          rejected: jobs.filter(j => j.application.status === 'rejected').length,
          withdrawn: jobs.filter(j => j.application.status === 'withdrawn').length
        };
        setStats(newStats);
        
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setIsLoading(false);
      }
    });
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  // Filter and sort applications
  useEffect(() => {
    let filtered = applications;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.application.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'appliedAt':
          aValue = a.application.appliedAt?.toDate?.() || new Date(0);
          bValue = b.application.appliedAt?.toDate?.() || new Date(0);
          break;
        case 'company':
          aValue = a.job?.companyName || '';
          bValue = b.job?.companyName || '';
          break;
        case 'title':
          aValue = a.job?.title || '';
          bValue = b.job?.title || '';
          break;
        case 'status':
          aValue = a.application.status;
          bValue = b.application.status;
          break;
        default:
          aValue = a.application.appliedAt?.toDate?.() || new Date(0);
          bValue = b.application.appliedAt?.toDate?.() || new Date(0);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchTerm, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      interviewed: 'bg-indigo-100 text-indigo-800',
      hired: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">Application Dashboard</h1>
              <p className="text-gray-600">Track and manage your job applications</p>
            </div>
            <Link 
              to="/applications/analytics" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Analytics
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card variant="elevated" className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </Card>
          <Card variant="elevated" className="text-center p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </Card>
          <Card variant="elevated" className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.reviewed}</div>
            <div className="text-sm text-gray-600">Reviewed</div>
          </Card>
          <Card variant="elevated" className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.shortlisted}</div>
            <div className="text-sm text-gray-600">Shortlisted</div>
          </Card>
          <Card variant="elevated" className="text-center p-4">
            <div className="text-2xl font-bold text-indigo-600">{stats.interviewed}</div>
            <div className="text-sm text-gray-600">Interviewed</div>
          </Card>
          <Card variant="elevated" className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">{stats.hired}</div>
            <div className="text-sm text-gray-600">Hired</div>
          </Card>
          <Card variant="elevated" className="text-center p-4">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </Card>
          <Card variant="elevated" className="text-center p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.withdrawn}</div>
            <div className="text-sm text-gray-600">Withdrawn</div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card variant="elevated" className="mb-6">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-48">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'reviewed', label: 'Reviewed' },
                    { value: 'shortlisted', label: 'Shortlisted' },
                    { value: 'interviewed', label: 'Interviewed' },
                    { value: 'hired', label: 'Hired' },
                    { value: 'rejected', label: 'Rejected' },
                    { value: 'withdrawn', label: 'Withdrawn' }
                  ]}
                />
              </div>

              {/* Sort */}
              <div className="w-full md:w-48">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={[
                    { value: 'appliedAt', label: 'Applied Date' },
                    { value: 'company', label: 'Company' },
                    { value: 'title', label: 'Job Title' },
                    { value: 'status', label: 'Status' }
                  ]}
                />
              </div>

              {/* Sort Order */}
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full md:w-auto"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Applications List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg font-light text-gray-600">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-20">📝</div>
            <h3 className="text-xl font-light text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {applications.length === 0 
                ? "You haven't applied to any jobs yet." 
                : "No applications match your current filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredApplications.map(({ application, job }) => {
              const enhancedStatus: ApplicationStatus = {
                status: application.status || 'pending',
                lastUpdated: application.lastUpdated?.toDate(),
                timeline: {
                  applied: application.appliedAt?.toDate() || new Date(),
                  reviewed: application.reviewedAt?.toDate(),
                  shortlisted: application.reviewedAt?.toDate(),
                  interviewed: application.interviewScheduled?.toDate(),
                  decision: application.lastUpdated?.toDate(),
                },
                notes: application.notes,
                nextStep: application.interviewNotes
              };

              return (
                <Card key={application.id} variant="elevated" hoverable>
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-medium text-gray-900 mb-2">
                          <Link to={job ? `/jobs/${job.id}` : '#'} className="hover:text-blue-600 transition-colors">
                            {job?.title || 'Untitled Job'}
                          </Link>
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          {job?.companyName && (
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              <span>{job.companyName}</span>
                            </div>
                          )}
                          {job?.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Status Tracking */}
                    <ApplicationStatusBadge 
                      status={enhancedStatus} 
                      showProgress={true}
                      className="mb-4"
                    />

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <Link 
                        to={job ? `/jobs/${job.id}` : '#'} 
                        className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors text-center"
                      >
                        View Job
                      </Link>
                      <Link 
                        to={`/applications/${application.id}`} 
                        className="flex-1 px-3 py-2 text-sm bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors text-center"
                      >
                        View Application
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDashboard; 