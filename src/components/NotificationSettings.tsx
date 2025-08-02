import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface NotificationPreferences {
  emailNotifications: {
    chat: boolean;
    projects: boolean;
    jobs: boolean;
    general: boolean;
  };
  inAppNotifications: {
    chat: boolean;
    projects: boolean;
    jobs: boolean;
    general: boolean;
  };
}

interface NotificationSettingsProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ isOpen = false, onClose }) => {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: {
      chat: true,
      projects: true,
      jobs: true,
      general: true,
    },
    inAppNotifications: {
      chat: true,
      projects: true,
      jobs: true,
      general: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser && isOpen) {
      loadPreferences();
    }
  }, [currentUser, isOpen]);

  // Reset loading state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLoading(true);
    }
  }, [isOpen]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', currentUser!.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.notificationPreferences) {
          setPreferences(data.notificationPreferences);
        }
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (type: 'emailNotifications' | 'inAppNotifications', category: keyof NotificationPreferences['emailNotifications']) => {
    setPreferences(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: !prev[type][category],
      },
    }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    
    try {
      setSaving(true);
      await updateDoc(doc(db, 'users', currentUser.uid), {
        notificationPreferences: preferences,
      });
      setMessage('Notification preferences saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      setMessage('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // If not open, don't render anything
  if (!isOpen) {
    return null;
  }

  // If no current user, show a message
  if (!currentUser) {
    return (
      <>
        {/* Modal Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <h1 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h1>
              <p className="text-gray-600 mb-4">Please sign in to manage your notification preferences.</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        {/* Modal Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading preferences...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {message && (
              <div className={`mb-4 p-3 rounded-md ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Chat Messages</p>
                      <p className="text-sm text-gray-500">Get notified when you receive new messages</p>
                    </div>
                    <button
                      onClick={() => handleToggle('emailNotifications', 'chat')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.emailNotifications.chat ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.emailNotifications.chat ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Project Updates</p>
                      <p className="text-sm text-gray-500">Get notified about project changes and assignments</p>
                    </div>
                    <button
                      onClick={() => handleToggle('emailNotifications', 'projects')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.emailNotifications.projects ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.emailNotifications.projects ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Job Applications</p>
                      <p className="text-sm text-gray-500">Get notified about job application updates</p>
                    </div>
                    <button
                      onClick={() => handleToggle('emailNotifications', 'jobs')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.emailNotifications.jobs ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.emailNotifications.jobs ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">General Updates</p>
                      <p className="text-sm text-gray-500">Get notified about platform updates and announcements</p>
                    </div>
                    <button
                      onClick={() => handleToggle('emailNotifications', 'general')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.emailNotifications.general ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.emailNotifications.general ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* In-App Notifications */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">In-App Notifications</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Chat Messages</p>
                      <p className="text-sm text-gray-500">Show notifications for new messages</p>
                    </div>
                    <button
                      onClick={() => handleToggle('inAppNotifications', 'chat')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.inAppNotifications.chat ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.inAppNotifications.chat ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Project Updates</p>
                      <p className="text-sm text-gray-500">Show notifications for project changes</p>
                    </div>
                    <button
                      onClick={() => handleToggle('inAppNotifications', 'projects')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.inAppNotifications.projects ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.inAppNotifications.projects ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Job Applications</p>
                      <p className="text-sm text-gray-500">Show notifications for job updates</p>
                    </div>
                    <button
                      onClick={() => handleToggle('inAppNotifications', 'jobs')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.inAppNotifications.jobs ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.inAppNotifications.jobs ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">General Updates</p>
                      <p className="text-sm text-gray-500">Show notifications for platform updates</p>
                    </div>
                    <button
                      onClick={() => handleToggle('inAppNotifications', 'general')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.inAppNotifications.general ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.inAppNotifications.general ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationSettings; 