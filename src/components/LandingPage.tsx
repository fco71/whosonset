// src/components/LandingPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { 
  Film, 
  Users, 
  Briefcase, 
  Globe, 
  Star, 
  ArrowRight, 
  Play,
  CheckCircle,
  MessageCircle,
  Calendar,
  Award
} from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

const LandingPage: React.FC = () => {
  const [stats, setStats] = useState([
    { number: "Loading...", label: "Active Members" },
    { number: "Loading...", label: "Projects Posted" },
    { number: "Loading...", label: "Countries" },
    { number: "Loading...", label: "Success Rate" }
  ]);
  const [loading, setLoading] = useState(true);

  const features = [
    {
      icon: <Film className="w-8 h-8" />,
      title: "Project Showcase",
      description: "Showcase your film projects with professional portfolios and detailed information."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Crew Networking",
      description: "Connect with talented crew members and build your professional network."
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Job Opportunities",
      description: "Find exciting job opportunities in the film industry across the globe."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Access opportunities worldwide and connect with international productions."
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
          { number: `${crewCount}+`, label: "Active Members" },
          { number: `${projectsCount}+`, label: "Projects Posted" },
          { number: `${countries.size}+`, label: "Countries" },
          { number: `${successRate}%`, label: "Success Rate" }
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Show empty state instead of fake data
        setStats([
          { number: "—", label: "Active Members" },
          { number: "—", label: "Projects Posted" },
          { number: "—", label: "Countries" },
          { number: "—", label: "Success Rate" }
        ]);
      }
    };

    fetchStats();
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Connect with the
              <span className="text-blue-600 block">Film Industry</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The premier platform for film professionals to showcase projects, 
              connect with crew, and discover opportunities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-4">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="ghost" size="lg" className="text-lg px-8 py-4">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl lg:text-4xl font-bold mb-2 ${
                  stat.number === "Loading..." ? "text-gray-300 animate-pulse" : 
                  stat.number === "—" ? "text-gray-400" : "text-blue-600"
                }`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and connections 
              you need to thrive in the film industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-modern text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
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
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in three simple steps and unlock your potential in the film industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Create Your Profile
              </h3>
              <p className="text-gray-600">
                Build a professional profile showcasing your skills, experience, and portfolio.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Connect & Network
              </h3>
              <p className="text-gray-600">
                Connect with industry professionals and join the global film community.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Find Opportunities
              </h3>
              <p className="text-gray-600">
                Discover exciting projects and job opportunities that match your expertise.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to join the community?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start building your professional network and discover amazing opportunities today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="ghost" size="lg" className="text-lg px-8 py-4 text-white hover:bg-blue-700">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">whosonset</h3>
              <p className="text-gray-400">
                Connecting film professionals worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/projects" className="hover:text-white transition-colors">Projects</Link></li>
                <li><Link to="/crew" className="hover:text-white transition-colors">Crew</Link></li>
                <li><Link to="/jobs" className="hover:text-white transition-colors">Jobs</Link></li>
                <li><Link to="/social" className="hover:text-white transition-colors">Social</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/press" className="hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 whosonset. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;