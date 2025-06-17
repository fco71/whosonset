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

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, 'crewProfiles', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm({
            name: data.name || '',
            role: data.role || '',
            location: data.location || '',
            skills: data.skills || '',
            bio: data.bio || '',
            profileImageUrl: data.profileImageUrl || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.role.trim()) newErrors.role = 'Role is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.skills.trim()) newErrors.skills = 'Skills are required';
    if (!form.bio.trim()) newErrors.bio = 'Bio is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setForm((prevForm) => ({ ...prevForm, profileImageUrl: downloadURL }));
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!validateForm()) {
      setMessage('Please fix the errors before saving.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const docRef = doc(db, 'crewProfiles', currentUser.uid);
      await setDoc(docRef, { ...form, uid: currentUser.uid });
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

        {/* Profile Image Upload */}
        <div>
          <label className="block mb-1">Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleProfileImageChange} />
          {form.profileImageUrl && (
            <>
              <img
                src={form.profileImageUrl}
                alt="profile"
                className="mt-2 h-20 w-20 object-cover rounded-full"
              />
              <button
                onClick={() => setForm((prev) => ({ ...prev, profileImageUrl: '' }))}
                className="mt-2 text-red-400 underline text-sm"
              >
                Remove Profile Image
              </button>
            </>
          )}
        </div>

        {/* Resume Placeholder */}
        <div className="pt-4">
          <label className="block mb-1">Resume:</label>
          <p className="text-sm text-gray-300 mb-1">
            Your resume will be automatically generated based on your profile info.
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

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>

        {/* Public Profile Link */}
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

        {message && (
          <p className="mt-4 text-center text-sm text-yellow-400">{message}</p>
        )}
      </div>
    </div>
  );
};

export default EditCrewProfile;
