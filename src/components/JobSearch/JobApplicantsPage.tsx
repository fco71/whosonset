import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { JobApplication } from '../../types/JobApplication';
import { CrewProfile } from '../../types/CrewProfile';
import CrewProfileCard from '../CrewProfileCard';
import { toast } from 'react-hot-toast';

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
            {applicantProfiles.map(profile => (
              <CrewProfileCard key={profile.uid} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicantsPage; 