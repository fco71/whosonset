import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { JobMatchingService, JobMatchScore } from '../../services/jobMatchingService';
import Card, { CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { TrendingUp, MapPin, Clock, DollarSign, Star, Users, Briefcase } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SmartJobRecommendationsProps {
  limit?: number;
  showMatchDetails?: boolean;
}

const SmartJobRecommendations: React.FC<SmartJobRecommendationsProps> = ({ 
  limit = 5, 
  showMatchDetails = true 
}) => {
  const { currentUser } = useAuth();
  const [recommendations, setRecommendations] = useState<JobMatchScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState<{[key: string]: any}>({});

  useEffect(() => {
    if (!currentUser) return;
    
    loadRecommendations();
  }, [currentUser]);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      
      // Get job recommendations
      const matches = await JobMatchingService.getTopMatchingJobs(currentUser!.uid, limit);
      setRecommendations(matches);
      
      // Load job details for display
      const jobIds = matches.map(match => match.jobId);
      const detailsMap: {[key: string]: any} = {};
      
      for (const jobId of jobIds) {
        try {
          const response = await fetch(`/api/jobs/${jobId}`);
          if (response.ok) {
            const jobData = await response.json();
            detailsMap[jobId] = jobData;
          }
        } catch (error) {
          console.error('Error loading job details:', error);
        }
      }
      
      setJobDetails(detailsMap);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast.error('Failed to load job recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getMatchIcon = (score: number) => {
    if (score >= 80) return '⭐';
    if (score >= 60) return '👍';
    if (score >= 40) return '🤔';
    return '📋';
  };

  const formatSalary = (salary: { min: number; max: number } | undefined) => {
    if (!salary) return 'Salary not specified';
    if (salary.min === salary.max) return `$${salary.min.toLocaleString()}`;
    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8">
            <div className="text-4xl mb-4 opacity-20">🎯</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-gray-600 mb-4">
              Complete your profile to get personalized job recommendations
            </p>
            <Link to="/profile/edit">
              <Button variant="outline">Complete Profile</Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Smart Recommendations
          <span className="text-sm font-normal text-gray-500">
            Based on your profile
          </span>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {recommendations.map((match) => {
            const job = jobDetails[match.jobId];
            if (!job) return null;

            return (
              <div key={match.jobId} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Link 
                      to={`/jobs/${match.jobId}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.contractType}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(match.score)}`}>
                      {getMatchIcon(match.score)} {match.score}% Match
                    </span>
                  </div>
                </div>

                {showMatchDetails && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-2">Match Factors:</div>
                    <div className="flex flex-wrap gap-2">
                      {match.breakdown.departmentMatch && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          ✓ Department
                        </span>
                      )}
                      {match.breakdown.experienceMatch && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          ✓ Experience
                        </span>
                      )}
                      {match.breakdown.locationMatch && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          ✓ Location
                        </span>
                      )}
                      {match.breakdown.skillsMatch > 0.5 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          ✓ Skills ({Math.round(match.breakdown.skillsMatch * 100)}%)
                        </span>
                      )}
                      {match.breakdown.availabilityMatch && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          ✓ Availability
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatSalary(job.salary)}
                      </div>
                    )}
                    {job.applicationCount && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.applicationCount} applicants
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/jobs/${match.jobId}`}>
                      <Button variant="outline" size="sm">View Job</Button>
                    </Link>
                    <Link to={`/jobs/${match.jobId}/apply`}>
                      <Button size="sm">Apply Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link to="/jobs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all jobs →
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

export default SmartJobRecommendations; 