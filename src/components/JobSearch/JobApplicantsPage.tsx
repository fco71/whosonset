import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
          <div className="p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-2">{selectedApplicant.name}</h2>
            <p className="text-gray-600 mb-2">{selectedApplicant.username}</p>
            <p className="mb-2">{selectedApplicant.bio}</p>
            <div className="mb-4">
              <strong>Job Titles:</strong> {selectedApplicant.jobTitles?.join(', ')}
            </div>
            <div className="mb-4">
              <strong>Location:</strong> {selectedApplicant.residences?.map(r => `${r.city}, ${r.country}`).join(' / ')}
            </div>
            {selectedApplication.coverLetter && (
              <div className="mb-4">
                <strong>Cover Letter:</strong>
                <p className="bg-gray-50 p-2 rounded mt-1 whitespace-pre-line">{selectedApplication.coverLetter}</p>
              </div>
            )}
            {selectedApplication.resumeId && (
              <div className="mb-4">
                <strong>Resume:</strong>
                <a href={`/resumes/${selectedApplication.resumeId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">View/Download</a>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <Button variant="success" onClick={() => {/* Accept logic */}}>Accept</Button>
              <Button variant="danger" onClick={() => {/* Reject logic */}}>Reject</Button>
              <Button variant="outline" onClick={() => {/* Message logic */}}>Message</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default JobApplicantsPage; 