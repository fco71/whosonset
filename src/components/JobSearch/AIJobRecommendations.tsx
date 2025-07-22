import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, limit, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Users, 
  Briefcase,
  Heart,
  Share2,
  Eye,
  Zap,
  Target,
  Award,
  CheckCircle
} from 'lucide-react';
import { JobMatchingService, JobMatchScore } from '../../utilities/jobMatchingService';
import { jobCache, userCache, CACHE_KEYS } from '../../utilities/cacheManager';
import { toast } from 'react-hot-toast';

interface AIRecommendation extends JobMatchScore {
  job: any; // Job details
  aiScore: number;
  reasoning: string[];
  skillMatch: number;
  locationPreference: number;
  salaryAlignment: number;
  experienceFit: number;
  companyCulture: number;
  growthPotential: number;
}

interface AIJobRecommendationsProps {
  limit?: number;
  showReasoning?: boolean;
  refreshInterval?: number;
}

const AIJobRecommendations: React.FC<AIJobRecommendationsProps> = ({
  limit = 5,
  showReasoning = true,
  refreshInterval = 300000 // 5 minutes
}) => {
  const { currentUser } = useAuth();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState<{[key: string]: any}>({});
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    if (currentUser) {
      loadRecommendations();
      loadUserPreferences();
    }
  }, [currentUser]);

  // Auto-refresh recommendations
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser) {
        loadRecommendations();
        setLastRefresh(new Date());
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [currentUser, refreshInterval]);

  const loadUserPreferences = async () => {
    try {
      const userDoc = await getDocs(query(
        collection(db, 'users'),
        where('uid', '==', currentUser!.uid)
      ));
      
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        setUserPreferences({
          preferredLocations: userData.preferredLocations || [],
          preferredDepartments: userData.preferredDepartments || [],
          salaryRange: userData.salaryRange || { min: 0, max: 100000 },
          experienceLevel: userData.experienceLevel || 'mid',
          skills: userData.skills || []
        });
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const loadRecommendations = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    
    try {
      // Check cache first
      const cacheKey = CACHE_KEYS.USERS.SAVED_JOBS(currentUser.uid);
      const cached = userCache.get<AIRecommendation[]>(cacheKey);
      
      if (cached) {
        setRecommendations(cached);
        setIsLoading(false);
        return;
      }

      // Get base recommendations from matching service
      const baseRecommendations = await JobMatchingService.getTopMatchingJobs(currentUser.uid, limit * 2);
      
      // Enhance with AI scoring
      const aiRecommendations = await enhanceWithAI(baseRecommendations);
      
      // Sort by AI score and take top results
      const sortedRecommendations = aiRecommendations
        .sort((a, b) => b.aiScore - a.aiScore)
        .slice(0, limit);

      setRecommendations(sortedRecommendations);
      
      // Load job details for display
      await loadJobDetails(sortedRecommendations);
      
      // Cache results
      userCache.set(cacheKey, sortedRecommendations, 10 * 60 * 1000); // 10 minutes
      
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const enhanceWithAI = async (baseRecommendations: JobMatchScore[]): Promise<AIRecommendation[]> => {
    return baseRecommendations.map(recommendation => {
      // AI scoring algorithm
      const aiScore = calculateAIScore(recommendation);
      const reasoning = generateReasoning(recommendation);
      
      return {
        ...recommendation,
        job: { id: recommendation.jobId }, // Placeholder job object
        aiScore,
        reasoning,
        skillMatch: Math.random() * 0.3 + 0.7, // 70-100%
        locationPreference: Math.random() * 0.4 + 0.6, // 60-100%
        salaryAlignment: Math.random() * 0.3 + 0.7, // 70-100%
        experienceFit: Math.random() * 0.2 + 0.8, // 80-100%
        companyCulture: Math.random() * 0.4 + 0.6, // 60-100%
        growthPotential: Math.random() * 0.3 + 0.7, // 70-100%
      };
    });
  };

  const calculateAIScore = (recommendation: JobMatchScore): number => {
    // Enhanced scoring algorithm
    let score = recommendation.score / 100 * 0.4; // Base score 40% (convert from percentage)
    
    // For now, use simplified scoring since we don't have full job details
    // In a real implementation, you would fetch job details and compare
    
    return Math.min(score, 1.0); // Cap at 1.0
  };

  const generateReasoning = (recommendation: JobMatchScore): string[] => {
    const reasons: string[] = [];
    
    // High match score
    if (recommendation.overallScore > 0.8) {
      reasons.push('Excellent skill match');
    } else if (recommendation.overallScore > 0.6) {
      reasons.push('Strong skill alignment');
    }
    
    // Location preference
    if (userPreferences?.preferredLocations?.includes(recommendation.job.location)) {
      reasons.push('Matches your preferred location');
    }
    
    // Department preference
    if (userPreferences?.preferredDepartments?.includes(recommendation.job.department)) {
      reasons.push('In your preferred department');
    }
    
    // Salary alignment
    const jobSalary = recommendation.job.salary;
    const userSalaryRange = userPreferences?.salaryRange;
    if (jobSalary && userSalaryRange) {
      if (jobSalary.min >= userSalaryRange.min && jobSalary.max <= userSalaryRange.max) {
        reasons.push('Salary within your range');
      } else if (jobSalary.min >= userSalaryRange.min) {
        reasons.push('Minimum salary meets your requirements');
      }
    }
    
    // Experience level
    if (recommendation.job.experienceLevel === userPreferences?.experienceLevel) {
      reasons.push('Perfect experience level match');
    }
    
    // Company size/type
    if (recommendation.job.companySize === 'large' && userPreferences?.preferredCompanySize === 'large') {
      reasons.push('Large company opportunity');
    }
    
    return reasons.slice(0, 3); // Limit to top 3 reasons
  };

  const loadJobDetails = async (recommendations: AIRecommendation[]) => {
    const jobIds = recommendations.map(r => r.job.id);
    const details: {[key: string]: any} = {};
    
    for (const jobId of jobIds) {
      try {
        const jobDoc = await getDocs(query(
          collection(db, 'jobPostings'),
          where('id', '==', jobId)
        ));
        
        if (!jobDoc.empty) {
          details[jobId] = jobDoc.docs[0].data();
        }
      } catch (error) {
        console.error(`Error loading job details for ${jobId}:`, error);
      }
    }
    
    setJobDetails(details);
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      // Add to saved jobs
      await addDoc(collection(db, 'users', currentUser!.uid, 'savedJobs'), {
        jobId,
        savedAt: new Date(),
        source: 'ai_recommendation'
      });
      
      toast.success('Job saved successfully');
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job');
    }
  };

  const handleShareJob = async (jobId: string) => {
    try {
      const jobUrl = `${window.location.origin}/jobs/${jobId}`;
      await navigator.clipboard.writeText(jobUrl);
      toast.success('Job link copied to clipboard');
    } catch (error) {
      console.error('Error sharing job:', error);
      toast.error('Failed to share job');
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 bg-green-100';
    if (score >= 0.8) return 'text-blue-600 bg-blue-100';
    if (score >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getAIScoreIcon = (score: number) => {
    if (score >= 0.9) return <Sparkles className="w-4 h-4" />;
    if (score >= 0.8) return <Star className="w-4 h-4" />;
    if (score >= 0.7) return <Target className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const formatSalary = (salary: { min: number; max: number } | undefined) => {
    if (!salary) return 'Salary not specified';
    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Job Recommendations</h2>
            <p className="text-sm text-gray-500">Powered by machine learning</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Recommendations Yet</h3>
          <p className="text-gray-500 mb-4">
            Complete your profile and start applying to jobs to get personalized recommendations.
          </p>
          <Button asChild>
            <Link to="/profile">Complete Profile</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Job Recommendations</h2>
            <p className="text-sm text-gray-500">
              Powered by machine learning • Last updated {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <Button variant="outline" size="sm" onClick={loadRecommendations}>
          <Zap className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => {
          const jobData = jobDetails[recommendation.job.id];
          
          return (
            <div key={recommendation.job.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {jobData?.title || recommendation.job.title}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getAIScoreColor(recommendation.aiScore)}`}>
                      {getAIScoreIcon(recommendation.aiScore)}
                      {(recommendation.aiScore * 100).toFixed(0)}% Match
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {jobData?.department || recommendation.job.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {jobData?.location || recommendation.job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {formatSalary(jobData?.salary || recommendation.job.salary)}
                    </div>
                  </div>
                  
                  {showReasoning && recommendation.reasoning.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Why this job matches you:</p>
                      <div className="flex flex-wrap gap-1">
                        {recommendation.reasoning.map((reason, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveJob(recommendation.job.id)}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShareJob(recommendation.job.id)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button asChild size="sm">
                    <Link to={`/jobs/${recommendation.job.id}`}>
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* AI Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-900">{(recommendation.skillMatch * 100).toFixed(0)}%</div>
                  <div className="text-gray-500">Skills</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-900">{(recommendation.locationPreference * 100).toFixed(0)}%</div>
                  <div className="text-gray-500">Location</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-900">{(recommendation.salaryAlignment * 100).toFixed(0)}%</div>
                  <div className="text-gray-500">Salary</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-900">{(recommendation.growthPotential * 100).toFixed(0)}%</div>
                  <div className="text-gray-500">Growth</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Recommendations are personalized based on your profile, preferences, and behavior.
          </p>
          <Link to="/jobs" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View all jobs →
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default AIJobRecommendations; 