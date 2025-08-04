import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              complete your profile, or contact us. This may include:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Name, email address, and contact information</li>
              <li>Professional experience, skills, and portfolio information</li>
              <li>Profile photos and other media you upload</li>
              <li>Communication preferences and settings</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Provide, maintain, and improve our services</li>
              <li>Connect you with job opportunities and other professionals</li>
              <li>Send you important updates and notifications</li>
              <li>Respond to your questions and support requests</li>
              <li>Ensure the security and integrity of our platform</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy. We may share your information:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>With other users as part of our networking features (with your consent)</li>
              <li>With service providers who assist in operating our platform</li>
              <li>When required by law or to protect our rights and safety</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of certain communications</li>
              <li>Request a copy of your data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-6">
              We use cookies and similar technologies to enhance your experience, analyze usage, 
              and provide personalized content. You can control cookie settings through your browser.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700 mb-6">
              Our services are not intended for children under 13. We do not knowingly collect 
              personal information from children under 13.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-700 mb-6">
              We may update this privacy policy from time to time. We will notify you of any 
              material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about this privacy policy, please contact us at{' '}
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

export default PrivacyPolicyPage; 