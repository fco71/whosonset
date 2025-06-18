// src/components/EditCrewProfile.tsx
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

interface FormData {
  name: string;
  role: string;
  location: string;
  skills: string;
  bio: string;
  profileImageUrl: string;
}

const EditCrewProfile: React.FC = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [form, setForm] = useState<FormData>({
    name: '',
    role: '',
    location: '',
    skills: '',
    bio: '',
    profileImageUrl: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        const snap = await getDoc(doc(db, 'crewProfiles', currentUser.uid));
        if (snap.exists()) {
          const data = snap.data() as Partial<FormData>;
          setForm((f) => ({ ...f, ...data }));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };
    fetchProfile();
  }, [currentUser]);

  // Simple field‐by‐field validation
  const validateForm = () => {
    const newErr: Partial<FormData> = {};
    if (!form.name.trim()) newErr.name = 'Name is required';
    if (!form.role.trim()) newErr.role = 'Role is required';
    if (!form.location.trim()) newErr.location = 'Location is required';
    if (!form.skills.trim()) newErr.skills = 'Skills are required';
    if (!form.bio.trim()) newErr.bio = 'Bio is required';
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  // Generic input handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Upload profile image, store its download URL
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm((f) => ({ ...f, profileImageUrl: url }));
    } catch (err) {
      console.error('Error uploading profile image:', err);
      setMessage('Failed to upload image.');
    }
  };

  // Save to Firestore under crewProfiles/{uid}
  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!validateForm()) {
      setMessage('Please fix errors before saving.');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await setDoc(doc(db, 'crewProfiles', currentUser.uid), {
        ...form,
        uid: currentUser.uid,
      });
      setMessage('Profile saved successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      setMessage('Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-bold">Edit Crew Profile</h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded"
        />
        {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

        <input
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded"
        />
        {errors.role && <p className="text-red-400 text-sm">{errors.role}</p>}

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded"
        />
        {errors.location && <p className="text-red-400 text-sm">{errors.location}</p>}

        <input
          name="skills"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded"
        />
        {errors.skills && <p className="text-red-400 text-sm">{errors.skills}</p>}

        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 bg-gray-700 rounded"
        />
        {errors.bio && <p className="text-red-400 text-sm">{errors.bio}</p>}

        {/* Profile Image */}
        <div>
          <label className="block mb-1">Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleProfileImageChange} />
          {form.profileImageUrl && (
            <div className="mt-2 flex items-center gap-4">
              <img
                src={form.profileImageUrl}
                alt="profile"
                className="h-20 w-20 object-cover rounded-full"
              />
              <button
                onClick={() => setForm((f) => ({ ...f, profileImageUrl: '' }))}
                className="text-red-400 underline text-sm"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Resume link */}
        <div className="pt-4">
          <label className="block mb-1">Resume:</label>
          <p className="text-sm text-gray-300 mb-1">
            Your resume will be generated from this profile.
          </p>
          {currentUser && (
            <a
              href={`/resume/${currentUser.uid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline text-sm"
            >
              View Generated Resume
            </a>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save Profile'}
        </button>

        {message && <p className="mt-4 text-center text-sm text-yellow-400">{message}</p>}

        {currentUser && (
          <a
            href={`/crew/${currentUser.uid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 text-center underline mt-4"
          >
            View Public Profile
          </a>
        )}
      </div>
    </div>
  );
};

export default EditCrewProfile;
