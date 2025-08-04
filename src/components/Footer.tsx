import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-semibold mb-4">My Film Jobs</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Connecting film industry professionals with opportunities. Build your network, 
              showcase your work, and find your next project.
            </p>
            <div className="flex items-center space-x-4">
              <Link 
                to="/contact"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/jobs" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link 
                  to="/crew" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Find Crew
                </Link>
              </li>
              <li>
                <Link 
                  to="/projects" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Browse Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-of-service" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a 
                  href="https://myfilmjobs.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  Website
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} My Film Jobs. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link 
              to="/privacy-policy" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link 
              to="/terms-of-service" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 