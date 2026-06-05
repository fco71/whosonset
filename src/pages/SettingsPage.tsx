import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Camera, ExternalLink, Loader2, Save, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { imageErrorFallback } from '../utilities/imageErrorFallback';
import { JobTitleEntry } from '../types/JobTitleEntry';

type Availability = 'available' | 'soon' | 'unavailable';

interface QuickProfileForm {
  name: string;
  bio: string;
  profileImageUrl: string;
  primaryRole: string;
  availability: Availability;
  isPublished: boolean;
}

const defaultQuickProfile: QuickProfileForm = {
  name: '',
  bio: '',
  profileImageUrl: '/bust-avatar.svg',
  primaryRole: '',
  availability: 'available',
  isPublished: true
};

const getPrimaryRole = (jobTitles: unknown[]): string => {
  const firstJobTitle = jobTitles[0];
  if (typeof firstJobTitle === 'string') return firstJobTitle;
  if (firstJobTitle && typeof firstJobTitle === 'object' && 'title' in firstJobTitle) {
    return typeof firstJobTitle.title === 'string' ? firstJobTitle.title : '';
  }
  return '';
};

const normalizeAvailability = (value: unknown): Availability => {
  return value === 'soon' || value === 'unavailable' || value === 'available'
    ? value
    : 'available';
};

const normalizeJobTitle = (jobTitle: unknown): JobTitleEntry | null => {
  if (typeof jobTitle === 'string') {
    const title = jobTitle.trim();
    return title ? { department: '', title, subcategories: [] } : null;
  }

  if (jobTitle && typeof jobTitle === 'object' && 'title' in jobTitle) {
    const typedJobTitle = jobTitle as Partial<JobTitleEntry>;
    const title = typeof typedJobTitle.title === 'string' ? typedJobTitle.title.trim() : '';
    if (!title) return null;

    return {
      department: typedJobTitle.department || '',
      title,
      subcategories: Array.isArray(typedJobTitle.subcategories)
        ? typedJobTitle.subcategories
        : []
    };
  }

  return null;
};

const SettingsPage: React.FC = () => {
  const { currentUser, deleteAccount } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [quickProfile, setQuickProfile] = useState<QuickProfileForm>(defaultQuickProfile);
  const [existingJobTitles, setExistingJobTitles] = useState<unknown[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadQuickProfile = async () => {
      if (!currentUser) {
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);
      setProfileError(null);

      try {
        const profileRef = doc(db, 'crewProfiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        const profileData = profileSnap.exists() ? profileSnap.data() : {};
        const jobTitles = Array.isArray(profileData.jobTitles) ? profileData.jobTitles : [];
        const fallbackName = currentUser.displayName || currentUser.email?.split('@')[0] || '';

        if (cancelled) return;

        setExistingJobTitles(jobTitles);
        setQuickProfile({
          name: profileData.name || profileData.displayName || fallbackName,
          bio: profileData.bio || '',
          profileImageUrl: profileData.profileImageUrl || profileData.photoURL || currentUser.photoURL || '/bust-avatar.svg',
          primaryRole: getPrimaryRole(jobTitles),
          availability: normalizeAvailability(profileData.availability),
          isPublished: profileData.isPublished !== false
        });
      } catch (error) {
        console.error('Error loading quick profile:', error);
        if (!cancelled) {
          setProfileError(t('settingsPage.profileLoadError'));
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    void loadQuickProfile();

    return () => {
      cancelled = true;
    };
  }, [currentUser, t]);

  const buildNextJobTitles = (primaryRole: string): JobTitleEntry[] => {
    const trimmedPrimaryRole = primaryRole.trim();
    const firstJobTitle = existingJobTitles[0];
    const firstJobTitleObject =
      firstJobTitle && typeof firstJobTitle === 'object'
        ? firstJobTitle as Partial<JobTitleEntry>
        : {};
    const remainingJobTitles = existingJobTitles
      .slice(1)
      .map(normalizeJobTitle)
      .filter((jobTitle): jobTitle is JobTitleEntry => Boolean(jobTitle));

    if (!trimmedPrimaryRole) {
      return remainingJobTitles;
    }

    return [
      {
        department: firstJobTitleObject.department || '',
        title: trimmedPrimaryRole,
        subcategories: Array.isArray(firstJobTitleObject.subcategories)
          ? firstJobTitleObject.subcategories
          : []
      },
      ...remainingJobTitles
    ];
  };

  const handleQuickProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser || !event.target.files?.[0]) return;

    const file = event.target.files[0];
    if (!file.type.startsWith('image/')) {
      setProfileError(t('settingsPage.imageTypeError'));
      event.target.value = '';
      return;
    }

    const previousProfileImageUrl = quickProfile.profileImageUrl;
    const previewUrl = URL.createObjectURL(file);

    setProfileUploading(true);
    setProfileMessage(null);
    setProfileError(null);
    setQuickProfile(profile => ({ ...profile, profileImageUrl: previewUrl }));

    try {
      const imageRef = ref(storage, `profileImages/${currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      const downloadUrl = await getDownloadURL(imageRef);

      await setDoc(
        doc(db, 'crewProfiles', currentUser.uid),
        {
          profileImageUrl: downloadUrl,
          photoURL: downloadUrl,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      await updateProfile(currentUser, { photoURL: downloadUrl });

      setQuickProfile(profile => ({ ...profile, profileImageUrl: downloadUrl }));
      setProfileMessage(t('settingsPage.imageAutoSaved'));
    } catch (error) {
      console.error('Error uploading quick profile image:', error);
      setQuickProfile(profile => ({ ...profile, profileImageUrl: previousProfileImageUrl }));
      setProfileError(t('settingsPage.imageUploadError'));
    } finally {
      URL.revokeObjectURL(previewUrl);
      setProfileUploading(false);
      event.target.value = '';
    }
  };

  const handleQuickProfileSave = async () => {
    if (!currentUser) {
      setProfileError(t('settingsPage.noCurrentUser'));
      return;
    }

    const fallbackName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    const nextName = quickProfile.name.trim() || fallbackName;
    const nextBio = quickProfile.bio.trim();
    const nextJobTitles = buildNextJobTitles(quickProfile.primaryRole);
    const persistedImageUrl = quickProfile.profileImageUrl?.startsWith('blob:')
      ? '/bust-avatar.svg'
      : quickProfile.profileImageUrl || '/bust-avatar.svg';

    setProfileSaving(true);
    setProfileMessage(null);
    setProfileError(null);

    try {
      await setDoc(
        doc(db, 'crewProfiles', currentUser.uid),
        {
          name: nextName,
          displayName: nextName,
          bio: nextBio,
          profileImageUrl: persistedImageUrl,
          photoURL: persistedImageUrl,
          jobTitles: nextJobTitles,
          availability: quickProfile.availability,
          isPublished: quickProfile.isPublished,
          email: currentUser.email || '',
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      await updateProfile(currentUser, {
        displayName: nextName,
        ...(persistedImageUrl.startsWith('http') ? { photoURL: persistedImageUrl } : {})
      });

      setExistingJobTitles(nextJobTitles);
      setQuickProfile(profile => ({
        ...profile,
        name: nextName,
        bio: nextBio,
        profileImageUrl: persistedImageUrl,
        primaryRole: getPrimaryRole(nextJobTitles)
      }));
      setProfileMessage(t('settingsPage.profileSaved'));
    } catch (error) {
      console.error('Error saving quick profile:', error);
      setProfileError(t('settingsPage.profileSaveError'));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) {
      setDeleteError(t('settingsPage.noCurrentUser'));
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteAccount(password);
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);

      if (error.message.includes('Re-authentication required')) {
        setShowPasswordInput(true);
        setDeleteError(t('settingsPage.reauthRequired'));
      } else {
        setDeleteError(error.message || t('settingsPage.deleteFailed'));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      setDeleteError(t('settingsPage.passwordRequired'));
      return;
    }

    await handleDeleteAccount();
  };

  const handleCancel = () => {
    setShowDeleteConfirm(false);
    setShowPasswordInput(false);
    setPassword('');
    setDeleteError(null);
  };

  const profileImageUrl = quickProfile.profileImageUrl || '/bust-avatar.svg';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('settingsPage.title')}</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {t('settingsPage.description')}
          </p>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-8">
            <section className="border-b border-gray-200 pb-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{t('settingsPage.quickProfileTitle')}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {t('settingsPage.quickProfileDescription')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentUser && (
                    <Link
                      to={`/resume/${currentUser.uid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      {t('settingsPage.viewPublicProfile')}
                    </Link>
                  )}
                  <Link
                    to="/edit-profile"
                    className="inline-flex items-center gap-2 rounded-md border border-transparent bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  >
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                    {t('settingsPage.fullResumeBuilder')}
                  </Link>
                </div>
              </div>

              {profileLoading ? (
                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {t('settingsPage.loadingProfile')}
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <span className="block text-sm font-medium text-gray-700">
                      {t('settingsPage.profilePhoto')}
                    </span>
                    <div className="mt-2 flex items-center gap-4">
                      <img
                        src={profileImageUrl}
                        alt={t('settingsPage.photoAlt')}
                        onError={event => imageErrorFallback(event)}
                        className="h-24 w-24 rounded-full border border-gray-200 bg-gray-50 object-cover"
                      />
                      <div>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                          {profileUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          ) : (
                            <Camera className="h-4 w-4" aria-hidden="true" />
                          )}
                          {profileUploading ? t('settingsPage.uploading') : t('settingsPage.replacePhoto')}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleQuickProfileImageChange}
                            className="sr-only"
                            disabled={profileUploading}
                          />
                        </label>
                        <p className="mt-2 text-xs text-gray-500">
                          {t('settingsPage.profilePhotoHelp')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 sm:col-span-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700">
                          {t('settingsPage.name')}
                        </label>
                        <input
                          type="text"
                          id="profile-name"
                          value={quickProfile.name}
                          onChange={event => setQuickProfile(profile => ({ ...profile, name: event.target.value }))}
                          placeholder={t('settingsPage.namePlaceholder')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="primary-role" className="block text-sm font-medium text-gray-700">
                          {t('settingsPage.primaryRole')}
                        </label>
                        <input
                          type="text"
                          id="primary-role"
                          value={quickProfile.primaryRole}
                          onChange={event => setQuickProfile(profile => ({ ...profile, primaryRole: event.target.value }))}
                          placeholder={t('settingsPage.primaryRolePlaceholder')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="profile-bio" className="block text-sm font-medium text-gray-700">
                        {t('settingsPage.bio')}
                      </label>
                      <textarea
                        id="profile-bio"
                        rows={3}
                        value={quickProfile.bio}
                        onChange={event => setQuickProfile(profile => ({ ...profile, bio: event.target.value }))}
                        placeholder={t('settingsPage.bioPlaceholder')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                          {t('settingsPage.availability')}
                        </label>
                        <select
                          id="availability"
                          value={quickProfile.availability}
                          onChange={event => setQuickProfile(profile => ({
                            ...profile,
                            availability: event.target.value as Availability
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="available">{t('settingsPage.availabilityAvailable')}</option>
                          <option value="soon">{t('settingsPage.availabilitySoon')}</option>
                          <option value="unavailable">{t('settingsPage.availabilityUnavailable')}</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          {t('settingsPage.emailAddress')}
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={currentUser?.email || ''}
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <label className="flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={quickProfile.isPublished}
                        onChange={event => setQuickProfile(profile => ({
                          ...profile,
                          isPublished: event.target.checked
                        }))}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>
                        <span className="block font-medium text-gray-900">{t('settingsPage.publicProfile')}</span>
                        <span className="block text-gray-500">{t('settingsPage.publicProfileHelp')}</span>
                      </span>
                    </label>

                    {(profileError || profileMessage) && (
                      <div
                        className={`rounded-md border p-3 text-sm ${
                          profileError
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-green-200 bg-green-50 text-green-700'
                        }`}
                      >
                        {profileError || profileMessage}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleQuickProfileSave}
                      disabled={profileSaving || profileUploading}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      {profileSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Save className="h-4 w-4" aria-hidden="true" />
                      )}
                      {profileSaving ? t('settingsPage.saving') : t('settingsPage.saveBasicProfile')}
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className="pt-2">
              <h2 className="text-lg font-medium text-gray-900">{t('settingsPage.accountManagementTitle')}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {t('settingsPage.accountManagementDescription')}
              </p>

              <div className="mt-6">
                {deleteError && (
                  <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-600">{deleteError}</p>
                  </div>
                )}

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    {t('settingsPage.deleteAccount')}
                  </button>
                ) : (
                  <div className="rounded-md border border-red-200 bg-red-50 p-4">
                    <h3 className="text-sm font-medium text-red-800">{t('settingsPage.confirmDeleteTitle')}</h3>
                    <p className="mt-2 text-sm text-red-700">
                      {t('settingsPage.confirmDeleteDescription')}
                    </p>
                    <div className="mt-4 flex space-x-3">
                      {showPasswordInput ? (
                        <div className="flex flex-col">
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            {t('settingsPage.password')}
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                          <button
                            type="button"
                            onClick={handlePasswordSubmit}
                            disabled={isDeleting}
                            className="mt-2 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting ? t('settingsPage.deleting') : t('settingsPage.confirmDeletion')}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isDeleting}
                            className="mt-2 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {t('settingsPage.cancel')}
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting ? t('settingsPage.deleting') : t('settingsPage.yesDelete')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={isDeleting}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {t('settingsPage.cancel')}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <p className="mt-2 text-sm text-gray-500">
                  {t('settingsPage.deleteAccountDescription')}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
