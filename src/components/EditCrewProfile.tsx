// src/components/EditCrewProfile.tsx
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

interface Residence {
  country: string;
  city: string;
}

interface FormData {
  name: string;
  bio: string;
  profileImageUrl: string;
  jobTitles: string[];
  residences: Residence[];
}

const EditCrewProfile: React.FC = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [form, setForm] = useState<FormData>({
    name: '',
    bio: '',
    profileImageUrl: '',
    jobTitles: [''],
    residences: [{ country: '', city: '' }],
  });

  const [jobOptions, setJobOptions] = useState<string[]>([]);
  const [countryOptions, setCountryOptions] = useState<
    { name: string; cities: string[] }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 1) Fetch lookup data
  useEffect(() => {
    const fetchLookups = async () => {
      // jobTitles
      const jobSnap = await getDocs(collection(db, 'jobTitles'));
      setJobOptions(jobSnap.docs.map(doc => doc.data().name as string));

      // countries
      const countrySnap = await getDocs(collection(db, 'countries'));
      setCountryOptions(
        countrySnap.docs.map(doc => ({
          name: doc.data().name as string,
          cities: doc.data().cities as string[],
        }))
      );
    };
    fetchLookups().catch(console.error);
  }, []);

  // 2) Load existing profile
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'crewProfiles', currentUser.uid))
      .then(snap => {
        if (snap.exists()) {
          const data = snap.data() as Partial<FormData>;
          setForm(f => ({
            ...f,
            ...data,
            jobTitles: data.jobTitles?.length
              ? data.jobTitles
              : [''],
            residences: data.residences?.length
              ? data.residences
              : [{ country: '', city: '' }],
          }));
        }
      })
      .catch(console.error);
  }, [currentUser]);

  // Handlers (same as before)…
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!currentUser || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setForm(f => ({ ...f, profileImageUrl: url }));
  };

  // Job titles add/remove/update
  const updateJobTitle = (i: number, v: string) => {
    setForm(f => {
      const jt = [...f.jobTitles];
      jt[i] = v;
      return { ...f, jobTitles: jt };
    });
  };
  const addJobTitle = () =>
    setForm(f => ({ ...f, jobTitles: [...f.jobTitles, ''] }));
  const removeJobTitle = (i: number) =>
    setForm(f => ({
      ...f,
      jobTitles: f.jobTitles.filter((_, idx) => idx !== i),
    }));

  // Residences add/remove/update
  const updateResidence = (
    i: number,
    key: keyof Residence,
    value: string
  ) => {
    setForm(f => {
      const rs = [...f.residences];
      rs[i] = { ...rs[i], [key]: value };
      return { ...f, residences: rs };
    });
  };
  const addResidence = () =>
    setForm(f => ({
      ...f,
      residences: [...f.residences, { country: '', city: '' }],
    }));
  const removeResidence = (i: number) =>
    setForm(f => ({
      ...f,
      residences: f.residences.filter((_, idx) => idx !== i),
    }));

  // Save
  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'crewProfiles', currentUser.uid), {
        ...form,
        uid: currentUser.uid,
      });
      setMessage('Profile saved!');
    } catch {
      setMessage('Failed to save.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded space-y-6">
        <h2 className="text-2xl font-bold">Edit Crew Profile</h2>

        {/* Name & Bio */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 bg-gray-700 rounded"
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Short Bio"
          rows={3}
          className="w-full p-2 bg-gray-700 rounded"
        />

        {/* Job Titles */}
        <div>
          <h3 className="font-semibold mb-2">Job Titles</h3>
          {form.jobTitles.map((jt, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <select
                value={jt}
                onChange={e => updateJobTitle(i, e.target.value)}
                className="flex-1 p-2 bg-gray-700 rounded"
              >
                <option value="">— Select —</option>
                {jobOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {form.jobTitles.length > 1 && (
                <button
                  onClick={() => removeJobTitle(i)}
                  className="text-red-400"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addJobTitle}
            className="text-blue-400 underline text-sm"
          >
            + Add Title
          </button>
        </div>

        {/* Residences */}
        <div>
          <h3 className="font-semibold mb-2">Residences</h3>
          {form.residences.map((res, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <select
                value={res.country}
                onChange={e => updateResidence(i, 'country', e.target.value)}
                className="p-2 bg-gray-700 rounded"
              >
                <option value="">— Country —</option>
                {countryOptions.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={res.city}
                onChange={e => updateResidence(i, 'city', e.target.value)}
                disabled={!res.country}
                className="p-2 bg-gray-700 rounded flex-1"
              >
                <option value="">— City (opt.) —</option>
                {countryOptions
                  .find(c => c.name === res.country)
                  ?.cities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>

              {form.residences.length > 1 && (
                <button
                  onClick={() => removeResidence(i)}
                  className="text-red-400"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addResidence}
            className="text-blue-400 underline text-sm"
          >
            + Add Residence
          </button>
        </div>

        {/* Profile Image */}
        <div>
          <label className="block mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
          {form.profileImageUrl && (
            <div className="mt-2 flex items-center gap-4">
              <img
                src={form.profileImageUrl}
                className="h-20 w-20 rounded-full object-cover"
              />
              <button
                onClick={() =>
                  setForm(f => ({ ...f, profileImageUrl: '' }))
                }
                className="text-red-400 underline text-sm"
                type="button"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-green-600 py-2 rounded hover:bg-green-500 disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save Profile'}
        </button>

        {message && (
          <p className="text-center text-yellow-400">{message}</p>
        )}
      </div>
    </div>
  );
};

export default EditCrewProfile;
