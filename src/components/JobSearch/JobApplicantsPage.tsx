import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { JobApplication } from '../../types/JobApplication';
import { CrewProfile } from '../../types/CrewProfile';
import CrewProfileCard from '../CrewProfileCard';
import { toast } from 'react-hot-toast';
import Modal from '../ui/Modal'; // Assume you have a Modal component, or use a simple one
import { Button } from '../ui/Button';

interface ApplicantProfile {
  id: string;
  name: string;
  profileImageUrl?: string;
  jobTitles?: string[];
  location?: string;
  // ...other fields as needed
}

const JobApplicantsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [applicantProfiles, setApplicantProfiles] = useState<CrewProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<CrewProfile | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      setIsLoading(true);
      try {
        // Fetch job applications for this job
        const appsQuery = query(
          collection(db, 'jobApplications'),
          where('jobId', '==', jobId)
        );
        const appsSnapshot = await getDocs(appsQuery);
        const apps: JobApplication[] = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
        setApplications(apps);

        // Fetch applicant profiles
        const applicantIds = apps.map(app => app.applicantId);
        if (applicantIds.length === 0) {
          setApplicantProfiles([]);
          setIsLoading(false);
          return;
        }
        // Batch fetch profiles
        const profilesSnapshot = await Promise.all(
          applicantIds.map(async (uid) => {
            const snap = await getDocs(query(collection(db, 'crewProfiles'), where('uid', '==', uid)));
            if (snap.docs.length > 0) {
              const data = snap.docs[0].data();
              // Map to CrewProfile type, with fallbacks for required fields
              return {
                uid: data.uid || uid,
                name: data.name || 'Unknown',
                username: data.username || data.name?.toLowerCase().replace(/\s+/g, '') || 'unknown',
                bio: data.bio || '',
                profileImageUrl: data.profileImageUrl || '',
                jobTitles: data.jobTitles || [],
                residences: data.residences || [{ country: '', city: '' }],
                projects: data.projects || [],
                education: data.education || [],
                contactInfo: data.contactInfo || {},
                otherInfo: data.otherInfo || '',
                isPublished: data.isPublished ?? true,
                availability: data.availability || 'available',
                languages: data.languages || [],
              } as CrewProfile;
            } else {
              // Fallback for missing profile
              return {
                uid,
                name: 'Unknown',
                username: 'unknown',
                bio: '',
                profileImageUrl: '',
                jobTitles: [],
                residences: [{ country: '', city: '' }],
                projects: [],
                education: [],
                contactInfo: {},
                otherInfo: '',
                isPublished: false,
                availability: 'unavailable',
                languages: [],
              } as CrewProfile;
            }
          })
        );
        setApplicantProfiles(profilesSnapshot.filter(Boolean) as CrewProfile[]);
      } catch (error) {
        console.error('Error fetching applicants:', error);
        toast.error('Failed to load applicants');
      } finally {
        setIsLoading(false);
      }
    };
    if (jobId) fetchApplicants();
  }, [jobId]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-light text-gray-900">Applicants</h1>
          <Link to="/jobs/posted" className="text-blue-600 hover:underline text-sm">← Back to Dashboard</Link>
        </div>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg font-light text-gray-600">Loading applicants...</p>
          </div>
        ) : applicantProfiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-20">👤</div>
            <h3 className="text-xl font-light text-gray-900 mb-2">No applicants yet</h3>
            <p className="text-gray-600">Applicants for this job will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {applicantProfiles.map((profile, idx) => (
              <div
                key={profile.uid}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedApplicant(profile);
                  setSelectedApplication(applications[idx]);
                  setShowModal(true);
                }}
              >
                <CrewProfileCard profile={profile} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for applicant details */}
      {showModal && selectedApplicant && selectedApplication && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-1">{selectedApplicant.name}</h2>
                <p className="text-gray-500 text-sm">@{selectedApplicant.username}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Applied</div>
                <div className="text-sm font-medium text-gray-900">
                  {selectedApplication.appliedAt?.toDate ? 
                    selectedApplication.appliedAt.toDate().toLocaleDateString() : 
                    'Recently'
                  }
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Professional Info</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Job Titles:</span>
                                         <div className="flex flex-wrap gap-1 mt-1">
                       {selectedApplicant.jobTitles?.map((title, idx) => (
                         <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                           {typeof title === 'string' ? title : title.title || 'Unknown'}
                         </span>
                       ))}
                     </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Location:</span>
                    <p className="text-sm text-gray-900">
                      {selectedApplicant.residences?.map(r => `${r.city}, ${r.country}`).join(' / ') || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Availability:</span>
                    <p className="text-sm text-gray-900 capitalize">
                      {selectedApplicant.availability || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Application Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      selectedApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedApplication.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      selectedApplication.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                      selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedApplication.status.replace('_', ' ')}
                    </span>
                  </div>
                  {selectedApplication.expectedSalary && (
                    <div>
                      <span className="text-sm text-gray-500">Expected Salary:</span>
                      <p className="text-sm text-gray-900">${selectedApplication.expectedSalary.toLocaleString()}/year</p>
                    </div>
                  )}
                  {selectedApplication.availabilityDate && (
                    <div>
                      <span className="text-sm text-gray-500">Available From:</span>
                      <p className="text-sm text-gray-900">{selectedApplication.availabilityDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {selectedApplicant.bio && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">About</h3>
                <p className="text-sm text-gray-900 leading-relaxed">{selectedApplicant.bio}</p>
              </div>
            )}

            {/* Cover Letter */}
            {selectedApplication.coverLetter && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">
                    {selectedApplication.coverLetter}
                  </p>
                </div>
              </div>
            )}

            {/* Resume */}
            {selectedApplication.resumeId && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Resume</h3>
                <a 
                  href={`/resumes/${selectedApplication.resumeId}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📄 View Resume
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-100">
              <Button 
                variant="success" 
                onClick={() => {/* Accept logic */}}
                className="flex-1"
              >
                ✅ Accept Application
              </Button>
              <Button 
                variant="danger" 
                onClick={() => {/* Reject logic */}}
                className="flex-1"
              >
                ❌ Reject Application
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowModal(false);
                  navigate(`/applications/${selectedApplication.id}`);
                }}
                className="flex-1"
              >
                💬 Message Applicant
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default JobApplicantsPage; 