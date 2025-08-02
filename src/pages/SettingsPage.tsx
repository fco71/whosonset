import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
              <p className="mt-1 text-sm text-gray-500">
                Update your account's profile information and email address.
              </p>
              
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={currentUser?.email || ''}
                      disabled
                      className="bg-gray-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <h2 className="text-lg font-medium text-gray-900">Account Management</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account settings and preferences.
              </p>
              
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Permanently delete your account and all of your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
