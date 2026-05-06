import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { PhotoConflictMonitor } from '../utilities/photoConflictMonitor';

interface PublicCrewProfile {
  uid: string;
  name: string;
  displayName: string;
  photoURL?: string;
  jobTitles: any[];
  residences: any[];
  bio?: string;
  availability?: string;
  profileType?: 'professional' | 'student' | 'teacher';
  studentInfo?: {
    institution?: string;
  };
  teacherInfo?: {
    institution?: string;
    classes?: string[];
  };
  isStudent?: boolean;
  isTeacher?: boolean;
  school?: string;
  teacherInstitution?: string;
  teacherClasses?: string[];
}

const PublicCrewPage: React.FC = () => {
  const { t } = useTranslation();
  const [crewProfiles, setCrewProfiles] = useState<PublicCrewProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPublicCrewProfiles = async () => {
      try {
        const crewQuery = query(
          collection(db, 'crewProfiles'),
          limit(12) // Limit for public demo
        );
        const snapshot = await getDocs(crewQuery);
        
        const profiles: PublicCrewProfile[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.isPublished !== false) { // Only show published profiles
            profiles.push({
              uid: doc.id,
              name: data.name || 'Unknown',
              displayName: data.displayName || data.name || 'Unknown',
              photoURL: data.photoURL || data.profileImageUrl,
              jobTitles: data.jobTitles || [],
              residences: data.residences || [],
              bio: data.bio,
              availability: data.availability,
              profileType: data.profileType || (data.isTeacher ? 'teacher' : data.isStudent ? 'student' : 'professional'),
              studentInfo: {
                institution: data.studentInfo?.institution || data.school || ''
              },
              teacherInfo: {
                institution: data.teacherInfo?.institution || data.teacherInstitution || '',
                classes: data.teacherInfo?.classes || data.teacherClasses || []
              },
              isStudent: data.isStudent,
              isTeacher: data.isTeacher,
              school: data.school,
              teacherInstitution: data.teacherInstitution,
              teacherClasses: data.teacherClasses
            });
          }
        });
        
        setCrewProfiles(profiles);
        
        // Enhanced Photo URL Conflict Detection using PhotoConflictMonitor
        // This runs in development to help identify potential issues
        if (process.env.NODE_ENV === 'development') {
          PhotoConflictMonitor.scanForConflicts().then(report => {
            if (report.totalConflicts > 0) {
              console.warn('🚨 PHOTO CONFLICTS IN PUBLIC CREW PAGE:', report.totalConflicts, 'conflicts found');
              report.conflicts.forEach(conflict => {
                console.warn('Conflict:', conflict.photoUrl, 'used by:', conflict.users.map(u => u.displayName).join(', '));
              });
            }
          });
        }
      } catch (error) {
        console.error('Error loading crew profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPublicCrewProfiles();
  }, []);

  const getAvailabilityColor = (availability?: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'soon':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (availability?: string) => {
    switch (availability) {
      case 'available':
        return 'Available';
      case 'soon':
        return 'Available Soon';
      default:
        return 'Contact for Availability';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Film Industry Professionals
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover talented crew members for your next production
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-8">
              <p className="text-blue-800">
                <strong>Demo:</strong> This is a sample of our crew directory. 
                <Link to="/register" className="text-blue-600 hover:underline ml-1">
                  Sign up to see the full directory and connect with professionals.
                </Link>
              </p>
            </div>
          </div>

          {/* Crew Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {crewProfiles.map((profile) => (
              <div key={profile.uid} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                {/* Profile Header */}
                <div className="flex items-start gap-4 mb-4">
                  {profile.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt={profile.displayName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-xl text-gray-500 font-light">
                        {profile.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {profile.displayName}
                    </h3>
                    {profile.jobTitles.length > 0 && (
                      <p className="text-sm text-gray-600 mb-2">
                        {typeof profile.jobTitles[0] === 'string' 
                          ? profile.jobTitles[0] 
                          : profile.jobTitles[0]?.title || 'Film Professional'}
                      </p>
                    )}
                    {profile.residences.length > 0 && (
                      <p className="text-sm text-gray-500">
                        📍 {typeof profile.residences[0] === 'string' 
                          ? profile.residences[0] 
                          : `${profile.residences[0]?.city || 'Unknown'}, ${profile.residences[0]?.country || 'Unknown'}`}
                      </p>
                    )}
                    {(() => {
                      const profileType = profile.profileType === 'teacher' || profile.isTeacher
                        ? 'teacher'
                        : profile.profileType === 'student' || profile.isStudent
                        ? 'student'
                        : 'professional';
                      const profileTypeLabel = profileType === 'teacher'
                        ? t('crew.profileTypes.teacher')
                        : profileType === 'student'
                        ? t('crew.profileTypes.student')
                        : '';
                      const institution = profileType === 'teacher'
                        ? profile.teacherInfo?.institution || profile.teacherInstitution || ''
                        : profile.studentInfo?.institution || profile.school || '';

                      return profileType !== 'professional' ? (
                        <span
                          className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                          title={institution || profileTypeLabel}
                        >
                          {profileTypeLabel}{institution ? ` - ${institution}` : ''}
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* Availability */}
                {profile.availability && (
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(profile.availability)}`}>
                      {getAvailabilityText(profile.availability)}
                    </span>
                  </div>
                )}

                {/* Bio */}
                {profile.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {profile.bio}
                  </p>
                )}

                {/* Action */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {profile.jobTitles.length} specialties
                  </span>
                  <Link
                    to="/register"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View Full Profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-3xl font-semibold mb-4">
              Need More Crew Members?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Access our full directory of thousands of film professionals
            </p>
            <div className="space-x-4">
              <Link
                to="/register"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign Up Free
              </Link>
              <Link
                to="/jobs"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCrewPage; 
