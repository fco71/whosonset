import React, { useState, useEffect } from 'react';
// --- MODIFIED: Added onAuthStateChanged for robust user checking ---
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

// Interfaces remain the same
interface Residence {
  country: string;
  city: string;
}

interface JobDepartment {
  name: string;
  titles: string[];
}

interface JobTitleEntry {
  department: string;
  title: string;
}

interface FormData {
  name: string;
  bio: string;
  profileImageUrl: string;
  jobTitles: JobTitleEntry[];
  residences: Residence[];
}

const fetchJobDepartments = async (): Promise<JobDepartment[]> => {
  const snapshot = await getDocs(collection(db, "jobDepartments"));
  // This map assumes the data shape is correct in Firestore (i.e., has a 'titles' field)
  return snapshot.docs.map((doc) => ({
    name: doc.data().name,
    titles: doc.data().titles || [], // Fallback to empty array if titles is missing
  } as JobDepartment));
};

const EditCrewProfile: React.FC = () => {
  const auth = getAuth();

  // --- MODIFIED: Use state to track the user, which is more reliable on load ---
  const [user, setUser] = useState<User | null>(null);

  const [form, setForm] = useState<FormData>({
    name: '',
    bio: '',
    profileImageUrl: '',
    jobTitles: [{ department: '', title: '' }],
    residences: [{ country: '', city: '' }],
  });

  const [departments, setDepartments] = useState<JobDepartment[]>([]);
  const [countryOptions, setCountryOptions] = useState<{ name: string; cities: string[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // --- ADDED: Robust authentication check ---
  // This effect runs once to set up a listener that updates the 'user' state
  // whenever the user signs in or out.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        console.log("DEBUG: Auth state changed. User is logged in:", firebaseUser.uid);
      } else {
        setUser(null);
        console.log("DEBUG: Auth state changed. User is logged out.");
      }
    });
    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [auth]);

  // --- MODIFIED: All data fetching now depends on the 'user' state ---
  // This ensures we don't try to fetch data before we know who the user is.
  useEffect(() => {
    // Don't run if the user isn't logged in yet
    if (!user) return;

    console.log("DEBUG: User confirmed. Now loading lookup data...");
    const loadLookups = async () => {
      try {
        // Fetch departments
        const deptData = await fetchJobDepartments();
        // --- THIS IS THE KEY DEBUGGING LINE ---
        console.log("DEBUG: Fetched department data:", deptData);
        setDepartments(deptData);

        // Fetch countries
        const countrySnap = await getDocs(collection(db, 'countries'));
        setCountryOptions(
          countrySnap.docs.map(doc => ({
            name: doc.data().name as string,
            cities: doc.data().cities as string[],
          }))
        );
      } catch (error) {
        console.error("DEBUG: Failed to load lookup data (departments/countries). Check Firestore Rules.", error);
      }
    };

    // Fetch user-specific profile data
    const loadProfile = async () => {
        try {
            const docRef = doc(db, 'crewProfiles', user.uid);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                console.log("DEBUG: Profile document found. Loading into form.");
                const data = snap.data() as Partial<FormData>;
                setForm(f => ({
                    ...f,
                    ...data,
                    jobTitles: data.jobTitles?.length ? data.jobTitles : [{ department: '', title: '' }],
                    residences: data.residences?.length ? data.residences : [{ country: '', city: '' }],
                }));
            } else {
                console.log("DEBUG: No existing profile document found for this user.");
            }
        } catch (error) {
            console.error("DEBUG: Failed to load profile data. Check Firestore Rules.", error);
        }
    }

    loadLookups();
    loadProfile();
  }, [user]); // This entire block now runs only when 'user' changes

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // --- THIS IS THE CORRECTED LINE ---
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, `profileImages/${user.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setForm(f => ({ ...f, profileImageUrl: url }));
  };

  const updateJobEntry = (i: number, field: keyof JobTitleEntry, value: string) => {
    setForm(f => {
      const updated = [...f.jobTitles];
      updated[i] = { ...updated[i], [field]: value };
      return { ...f, jobTitles: updated };
    });
  };

  const addJobEntry = () =>
    setForm(f => ({ ...f, jobTitles: [...f.jobTitles, { department: '', title: '' }] }));

  const removeJobEntry = (i: number) =>
    setForm(f => ({ ...f, jobTitles: f.jobTitles.filter((_, idx) => idx !== i) }));

  const updateResidence = (i: number, key: keyof Residence, value: string) => {
    setForm(f => {
      const rs = [...f.residences];
      rs[i] = { ...rs[i], [key]: value };
      return { ...f, residences: rs };
    });
  };

  const addResidence = () =>
    setForm(f => ({ ...f, residences: [...f.residences, { country: '', city: '' }] }));

  const removeResidence = (i: number) =>
    setForm(f => ({ ...f, residences: f.residences.filter((_, idx) => idx !== i) }));

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'crewProfiles', user.uid), {
        ...form,
        uid: user.uid,
      });
      setMessage('Profile saved!');
    } catch(error) { // Added error logging
      setMessage('Failed to save.');
      console.error("DEBUG: Save failed.", error);
    } finally {
      setLoading(false);
    }
  };

  // --- JSX / HTML (no changes) ---
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded space-y-6">
        <h2 className="text-2xl font-bold">Edit Crew Profile</h2>
        { /* The rest of your JSX from your file goes here. It was omitted for brevity but is unchanged. */ }
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full p-2 bg-gray-700 rounded" />
        <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Short Bio" rows={3} className="w-full p-2 bg-gray-700 rounded" />
        <div>
          <h3 className="font-semibold mb-2">Job Titles</h3>
          {form.jobTitles.map((entry, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <select value={entry.department} onChange={e => { updateJobEntry(i, 'department', e.target.value); updateJobEntry(i, 'title', ''); }} className="p-2 bg-gray-700 rounded flex-1">
                <option value="">— Department —</option>
                {departments.map(d => (<option key={d.name} value={d.name}>{d.name}</option>))}
                <option value="Other">Other</option>
              </select>
              {entry.department === 'Other' ? (<input value={entry.title} onChange={e => updateJobEntry(i, 'title', e.target.value)} placeholder="Enter job title" className="p-2 bg-gray-700 rounded flex-1" />) : (<select value={entry.title} onChange={e => updateJobEntry(i, 'title', e.target.value)} className="p-2 bg-gray-700 rounded flex-1" disabled={!entry.department}>
                <option value="">— Title —</option>
                {departments.find(d => d.name === entry.department)?.titles.map(title => (<option key={title} value={title}>{title}</option>))}
              </select>)}
              {form.jobTitles.length > 1 && (<button onClick={() => removeJobEntry(i)} className="text-red-400">❌</button>)}
            </div>
          ))}
          <button onClick={addJobEntry} className="text-blue-400 underline text-sm">+ Add Job Title</button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Residences</h3>
          {form.residences.map((res, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <select value={res.country} onChange={e => updateResidence(i, 'country', e.target.value)} className="p-2 bg-gray-700 rounded">
                <option value="">— Country —</option>
                {countryOptions.map(c => (<option key={c.name} value={c.name}>{c.name}</option>))}
              </select>
              <select value={res.city} onChange={e => updateResidence(i, 'city', e.target.value)} disabled={!res.country} className="p-2 bg-gray-700 rounded flex-1">
                <option value="">— City —</option>
                {countryOptions.find(c => c.name === res.country)?.cities.map(city => (<option key={city} value={city}>{city}</option>))}
              </select>
              {form.residences.length > 1 && (<button onClick={() => removeResidence(i)} className="text-red-400">❌</button>)}
            </div>
          ))}
          <button onClick={addResidence} className="text-blue-400 underline text-sm">+ Add Residence</button>
        </div>
        <div>
          <label className="block mb-1">Profile Picture</label>
          <input type="file" accept="image/*" onChange={handleProfileImageChange} />
          {form.profileImageUrl && (<div className="mt-2 flex items-center gap-4"><img src={form.profileImageUrl} className="h-20 w-20 rounded-full object-cover" /><button onClick={() => setForm(f => ({ ...f, profileImageUrl: '' }))} className="text-red-400 underline text-sm" type="button">Remove</button></div>)}
        </div>
        <button onClick={handleSave} disabled={loading} className="w-full bg-green-600 py-2 rounded hover:bg-green-500 disabled:opacity-50">{loading ? 'Saving…' : 'Save Profile'}</button>
        {message && <p className="text-center text-yellow-400">{message}</p>}
      </div>
    </div>
  );
};

export default EditCrewProfile;