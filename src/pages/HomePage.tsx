import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Film, 
  Users, 
  Briefcase, 
  Globe, 
  Star, 
  ArrowRight, 
  Play,
  CheckCircle,
  TrendingUp,
  Award,
  Zap,
  Heart,
  Camera,
  Clapperboard
} from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [stats, setStats] = useState([
    { number: t('home.loading'), label: t('home.stats.activeProfessionals'), icon: <Users className="w-5 h-5" /> },
    { number: t('home.loading'), label: t('home.stats.projectsCompleted'), icon: <Film className="w-5 h-5" /> },
    { number: t('home.loading'), label: t('home.stats.countries'), icon: <Globe className="w-5 h-5" /> }
  ]);
  const [loading, setLoading] = useState(true);

  const features = [
    {
      icon: <Film className="w-6 h-6" />,
      title: t('home.features.projectShowcase.title'),
      description: t('home.features.projectShowcase.desc')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('home.features.crewNetworking.title'),
      description: t('home.features.crewNetworking.desc')
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: t('home.features.jobBoard.title'),
      description: t('home.features.jobBoard.desc')
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: t('home.features.globalReach.title'),
      description: t('home.features.globalReach.desc')
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: t('home.features.industryRecognition.title'),
      description: t('home.features.industryRecognition.desc')
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('home.features.realTimeCollab.title'),
      description: t('home.features.realTimeCollab.desc')
    }
  ];

  // Fetch real statistics from Firestore
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get crew profiles count
        const crewRef = collection(db, 'crewProfiles');
        const crewQuery = query(crewRef, where('isPublished', '==', true));
        const crewSnapshot = await getDocs(crewQuery);
        const crewCount = crewSnapshot.size;

        // Get projects count
        const projectsRef = collection(db, 'Projects');
        const projectsSnapshot = await getDocs(projectsRef);
        const projectsCount = projectsSnapshot.size;

        // Get unique countries from crew profiles
        const countries = new Set<string>();
        crewSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.residences && data.residences.length > 0) {
            data.residences.forEach((residence: any) => {
              if (residence.country) {
                countries.add(residence.country);
              }
            });
          }
        });

        // Calculate success rate based on completed projects
        const completedProjects = projectsSnapshot.docs.filter(doc => {
          const data = doc.data();
          return data.status === 'Completed' || data.status === 'Released';
        }).length;
        const successRate = projectsCount > 0 ? Math.round((completedProjects / projectsCount) * 100) : 0;

        setStats([
          { number: `${crewCount}+`, label: t('home.stats.activeProfessionals'), icon: <Users className="w-5 h-5" /> },
          { number: `${projectsCount}+`, label: t('home.stats.projectsCompleted'), icon: <Film className="w-5 h-5" /> },
          { number: `${countries.size}+`, label: t('home.stats.countries'), icon: <Globe className="w-5 h-5" /> }
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Show empty state instead of fake data
        setStats([
          { number: '—', label: t('home.stats.activeProfessionals'), icon: <Users className="w-5 h-5" /> },
          { number: '—', label: t('home.stats.projectsCompleted'), icon: <Film className="w-5 h-5" /> },
          { number: '—', label: t('home.stats.countries'), icon: <Globe className="w-5 h-5" /> }
        ]);
      }
    };

    fetchStats();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium border border-blue-200">
                <Users className="w-4 h-4 mr-2" />
                {t('home.hero.banner')}
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              {t('home.hero.title1')}
              <span className="relative inline-block ml-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('home.hero.title2')}
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-30"></div>
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to={currentUser ? '/jobs' : '/register'}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center text-lg"
              >
                {currentUser ? t('home.hero.ctaSecondary') : t('home.hero.ctaPrimary')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/jobs"
                className="group px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:border-gray-300 flex items-center text-lg"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                {t('home.hero.ctaSecondary')}
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 hover:bg-white/80 transition-all duration-300">
                  <div className="flex justify-center mb-2 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className={`text-2xl lg:text-3xl font-bold mb-1 ${
                    stat.number === t('home.loading') ? "text-gray-300 animate-pulse" : 
                    stat.number === "—" ? "text-gray-400" : "text-gray-900"
                  }`}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: t('home.howItWorks.step1.title'),
                description: t('home.howItWorks.step1.desc')
              },
              {
                step: "02",
                title: t('home.howItWorks.step2.title'),
                description: t('home.howItWorks.step2.desc')
              },
              {
                step: "03",
                title: t('home.howItWorks.step3.title'),
                description: t('home.howItWorks.step3.desc')
              }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-3/4 w-1/2 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t('home.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={currentUser ? '/projects' : '/register'}
                className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-lg"
              >
                <Heart className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                {currentUser ? t('home.cta.ctaSecondary') : t('home.cta.ctaPrimary')}
              </Link>
              <Link
                to={currentUser ? '/crew' : '/crew-public'}
                className="group px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center text-lg"
              >
                <Clapperboard className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                {t('home.cta.ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
