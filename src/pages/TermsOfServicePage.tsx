import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Film Jobs
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using My Film Jobs, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please 
              do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              My Film Jobs is a professional networking platform for film industry professionals. 
              Our services include:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Professional profile creation and management</li>
              <li>Job posting and application services</li>
              <li>Networking and communication tools</li>
              <li>Portfolio and project showcase features</li>
              <li>Industry news and updates</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Conduct</h2>
            <p className="text-gray-700 mb-4">
              You agree not to use the service to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Upload malicious content or software</li>
              <li>Spam or harass other users</li>
              <li>Impersonate another person or entity</li>
              <li>Use the service for commercial purposes without authorization</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Content and Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              You retain ownership of content you upload, but grant us a license to use it for 
              service provision. You must have rights to any content you share.
            </p>
            <p className="text-gray-700 mb-6">
              Our platform and its original content are protected by copyright and other 
              intellectual property laws.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also 
              governs your use of the service, to understand our practices.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimers</h2>
            <p className="text-gray-700 mb-4">
              The service is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Uninterrupted or error-free service</li>
              <li>Accuracy of user-generated content</li>
              <li>Success of job applications or networking</li>
              <li>Compatibility with all devices or browsers</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              In no event shall My Film Jobs be liable for any indirect, incidental, special, 
              consequential, or punitive damages arising from your use of the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 mb-6">
              We may terminate or suspend your account at any time for violations of these terms. 
              You may also terminate your account at any time by contacting us.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to modify these terms at any time. We will notify users of 
              significant changes via email or through the platform.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 mb-6">
              These terms shall be governed by and construed in accordance with the laws of the 
              jurisdiction in which My Film Jobs operates.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:iam@myfilmjobs.com" className="text-indigo-600 hover:text-indigo-500">
                iam@myfilmjobs.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage; 