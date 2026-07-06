import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Film, 
  Users, 
  Briefcase, 
  Globe, 
  ArrowRight, 
  Play,
  Award,
  Zap,
  Heart,
  Clapperboard
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { trackConversion } from '../utilities/conversionTracking';
import { setPageSeo } from '../utilities/seo';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  // Self-referential canonical so http/https, www/non-www, ?lang variants and the
  // .web.app mirror all consolidate to one URL. The static index.html no longer carries
  // a hardcoded canonical (it was poisoning sub-pages), so the homepage sets its own here.
  useEffect(() => {
    setPageSeo({
      title: 'My Film Jobs | Film Industry Jobs and Crew Networking',
      description: 'Find film industry jobs, connect with crew members, and grow your production network on My Film Jobs.',
      canonicalUrl: 'https://myfilmjobs.com/',
    });
  }, []);

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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to={currentUser ? '/jobs' : '/register'}
                onClick={() => {
                  trackConversion(currentUser ? 'home_cta_click' : 'signup_cta_click', {
                    placement: 'home_hero_primary',
                    destination: currentUser ? '/jobs' : '/register',
                  });
                }}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center text-lg"
              >
                {currentUser ? t('home.hero.ctaSecondary') : t('home.hero.ctaPrimary')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/jobs"
                onClick={() => {
                  trackConversion('home_cta_click', {
                    placement: 'home_hero_secondary',
                    destination: '/jobs',
                  });
                }}
                className="group px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:border-gray-300 flex items-center text-lg"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                {t('home.hero.ctaSecondary')}
              </Link>
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
                onClick={() => {
                  trackConversion(currentUser ? 'home_cta_click' : 'signup_cta_click', {
                    placement: 'home_footer_primary',
                    destination: currentUser ? '/projects' : '/register',
                  });
                }}
                className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-lg"
              >
                <Heart className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                {currentUser ? t('home.cta.ctaSecondary') : t('home.cta.ctaPrimary')}
              </Link>
              <Link
                to={currentUser ? '/crew' : '/crew-public'}
                onClick={() => {
                  trackConversion('home_cta_click', {
                    placement: 'home_footer_secondary',
                    destination: currentUser ? '/crew' : '/crew-public',
                  });
                }}
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
