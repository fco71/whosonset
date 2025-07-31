import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserPreferencesService, UserPreferences } from '../utilities/userPreferencesService';
import { Button } from './ui/Button';
import Card from './ui/Card';
import { Bell, Mail, Smartphone, Clock, Settings, X, Save, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadPreferences();
    }
  }, [isOpen, currentUser]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const prefs = await UserPreferencesService.getUserPreferences(currentUser!.uid);
      setPreferences(prefs);
    } catch (err) {
      setError('Failed to load notification preferences');
      console.error('Error loading preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser || !preferences) return;

    try {
      setSaving(true);
      setError(null);
      await UserPreferencesService.updateUserPreferences(preferences, currentUser.uid);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save notification preferences');
      console.error('Error saving preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof UserPreferences) => {
    try {
      if (!preferences) return;
      setPreferences(prev => prev ? ({
        ...prev,
        [key]: !prev[key]
      }) : null);
    } catch (error) {
      console.error('Error toggling preference:', error);
    }
  };

  const handleFrequencyChange = (frequency: 'immediate' | 'daily' | 'weekly') => {
    try {
      if (!preferences) return;
      setPreferences(prev => prev ? ({
        ...prev,
        notificationFrequency: frequency
      }) : null);
    } catch (error) {
      console.error('Error changing frequency:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {t('notificationSettings.title', 'Notification Settings')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading preferences...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">{error}</p>
              <button
                onClick={loadPreferences}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          ) : preferences ? (
            <div className="space-y-6">
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800">Settings saved successfully!</span>
                </div>
              )}

              {/* General Settings */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-blue-600" />
                  {t('notificationSettings.general', 'General Settings')}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle('emailNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-500">Receive browser push notifications</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle('pushNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Notification Frequency</p>
                        <p className="text-sm text-gray-500">How often to receive notifications</p>
                      </div>
                    </div>
                    <select
                      value={preferences.notificationFrequency}
                      onChange={(e) => handleFrequencyChange(e.target.value as any)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Specific Notification Types */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('notificationSettings.specific', 'Specific Notifications')}
                </h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'jobApplicationNotifications' as keyof UserPreferences, label: 'Job Applications', description: 'New job applications for your postings' },
                    { key: 'projectInvitationNotifications' as keyof UserPreferences, label: 'Project Invitations', description: 'Invitations to join projects' },
                    { key: 'taskAssignmentNotifications' as keyof UserPreferences, label: 'Task Assignments', description: 'New tasks assigned to you' },
                    { key: 'messageNotifications' as keyof UserPreferences, label: 'Messages', description: 'New messages from other users' },
                    { key: 'projectUpdateNotifications' as keyof UserPreferences, label: 'Project Updates', description: 'Updates to projects you\'re part of' },
                    { key: 'applicationStatusNotifications' as keyof UserPreferences, label: 'Application Status', description: 'Updates to your job applications' }
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-sm text-gray-500">{description}</p>
                      </div>
                      <button
                        onClick={() => handleToggle(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences[key] ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences[key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Settings</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 