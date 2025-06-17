// src/components/EditCrewProfile.tsx
import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface FormData {
  name: string;
  role: string;
  location: string;
  skills: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
}

const EditCrewProfile: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    name: '',
    role: '',
    location: '',
    skills: '',
    bio: '',
    avatarUrl: '',
    resumeUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const currentUser = auth.currentUser;

  // Fetch existing profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, 'crewProfiles', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as FormData;
          setForm(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    loadProfile();
  }, [currentUser]);

  // Handles changes for all inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handles avatar image file selection and upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && currentUser) {
      const file = e.target.files[0];
      const avatarRef = ref(storage, `avatars/${currentUser.uid}`);
      try {
        await uploadBytes(avatarRef, file);
        const url = await getDownloadURL(avatarRef);
        setForm((prevForm) => ({
          ...prevForm,
          avatarUrl: url,
        }));
      } catch (error) {
        console.error('Avatar upload failed:', error);
      }
    }
  };

  // Handles resume PDF file selection and upload
  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && currentUser) {
      const file = e.target.files[0];
      const resumeRef = ref(storage, `resumes/${currentUser.uid}`);
      try {
        await uploadBytes(resumeRef, file);
        const url = await getDownloadURL(resumeRef);
        setForm((prevForm) => ({
          ...prevForm,
          resumeUrl: url,
        }));
      } catch (error) {
        console.error('Resume upload failed:', error);
      }
    }
  };

  // Save profile to Firestore
  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    setMessage(null);

    try {
      await setDoc(doc(db, 'crewProfiles', currentUser.uid), form);
      setMessage('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-bold mb-4">Edit Crew Profile</h2>

        {/* Input fields */}
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded"
        />
        <input
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded"
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded"
        />
        <input
          name="skills"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded"
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 bg-gray-700 rounded"
        />

        {/* Avatar Upload */}
        <div>
          <label className="block mb-1">Avatar Image:</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {form.avatarUrl && (
            <img
              src={form.avatarUrl}
              alt="avatar"
              className="mt-2 h-20 w-20 object-cover rounded-full"
            />
          )}
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block mb-1">Resume (PDF):</label>
          <input type="file" accept="application/pdf" onChange={handleResumeChange} />
          {form.resumeUrl && (
            <a
              href={form.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline mt-2 block"
            >
              View Uploaded Resume
            </a>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>

        {/* Status message */}
        {message && (
          <p className="mt-2 text-sm text-center text-gray-300">{message}</p>
        )}
      </div>
    </div>
  );
};

export default EditCrewProfile;
