import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Optional: for redirecting after registration
import { useAuth } from '../contexts/AuthContext';
import { auth, db, storage } from '../firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ProjectEntry } from '../types/ProjectEntry';
import { JobTitleEntry } from '../types/JobTitleEntry';
import { JOB_SUBCATEGORIES } from '../types/JobSubcategories';
import { Residence, ContactInfo } from '../types/CrewProfile';

// --- Interfaces (from EditCrewProfile) ---
interface JobDepartment {
  name: string;
  titles: string[];
}

// --- Modified FormData to include registration fields ---
interface FormData {
  email: string;
  password: string;
  name: string;
  bio: string;
  profileImageUrl: string;
  jobTitles: JobTitleEntry[];
  residences: Residence[];
  userType: 'Crew' | 'Producer';
}

// --- Data Fetching Function (from EditCrewProfile) ---
const fetchJobDepartments = async (): Promise<JobDepartment[]> => {
  const snapshot = await getDocs(collection(db, "jobDepartments"));
  return snapshot.docs.map((doc) => ({
    name: doc.data().name,
    titles: doc.data().titles || [],
  } as JobDepartment));
};


const RegisterForm: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate(); // Optional: for redirecting

  // --- State management now mirrors EditCrewProfile ---
  const [form, setForm] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    bio: '',
    profileImageUrl: '',
    jobTitles: [{ department: '', title: '' }],
    residences: [{ country: 'Dominican Republic', city: '' }],
    userType: 'Crew',
  });

  const [imageFile, setImageFile] = useState<File | null>(null); // To hold the image file for upload
  const [departments, setDepartments] = useState<JobDepartment[]>([]);
  const [countryOptions, setCountryOptions] = useState<{ name: string; cities: string[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- useEffect to load dropdown data (from EditCrewProfile) ---
  useEffect(() => {
    const loadLookups = async () => {
      try {
        const deptData = await fetchJobDepartments();
        setDepartments(deptData);

        const countrySnap = await getDocs(collection(db, 'countries'));
        setCountryOptions(
          countrySnap.docs.map(doc => ({
            name: doc.data().name as string,
            cities: doc.data().cities as string[],
          }))
        );
      } catch (err) {
        console.error("Failed to load lookup data", err);
        setError("Could not load necessary data. Please try again later.");
      }
    };
    loadLookups();
  }, []);

  // --- All handlers are brought over from EditCrewProfile ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const updateJobEntry = (i: number, field: keyof JobTitleEntry, value: string) => {
    setForm(f => {
      const updated = [...f.jobTitles];
      updated[i] = { ...updated[i], [field]: value };
      return { ...f, jobTitles: updated };
    });
  };

  const addJobEntry = () => setForm(f => ({ ...f, jobTitles: [...f.jobTitles, { department: '', title: '' }] }));
  const removeJobEntry = (i: number) => setForm(f => ({ ...f, jobTitles: f.jobTitles.filter((_, idx) => idx !== i) }));
  
  const updateResidence = (i: number, key: keyof Residence, value: string) => {
    setForm(f => {
      const rs = [...f.residences];
      rs[i] = { ...rs[i], [key]: value };
      return { ...f, residences: rs };
    });
  };
  const addResidence = () => setForm(f => ({ ...f, residences: [...f.residences, { country: '', city: '' }] }));
  const removeResidence = (i: number) => setForm(f => ({ ...f, residences: f.residences.filter((_, idx) => idx !== i) }));

  // --- The new, combined handleSubmit logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.name) {
      setError("Please fill out your email, password, and name.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // 1. Create user in Firebase Auth using AuthContext (creates basic crewProfiles document)
      await signup(form.email, form.password, form.name.split(' ')[0], form.name.split(' ').slice(1).join(' '));
      
      // 2. Upload profile image if one was selected
      let uploadedImageUrl = '';
      if (imageFile) {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error('Unable to upload profile image before sign-in completes.');
        }
        const storageRef = ref(storage, `profileImages/${userId}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        uploadedImageUrl = await getDownloadURL(storageRef);
      }

      // Always ensure name and image are set
      const safeName = form.name && form.name.trim() !== '' ? form.name : 'Unknown Crew';
              const safeProfileImageUrl = uploadedImageUrl && uploadedImageUrl.trim() !== '' ? uploadedImageUrl : '/bust-avatar.svg';

      // 3. Update the crewProfiles document with additional details
      // Note: We need to get the user ID from the current user context
      // For now, we'll create a more detailed profile after signup
      const detailedProfile = {
        name: safeName,
        bio: form.bio,
        profileImageUrl: safeProfileImageUrl,
        jobTitles: form.jobTitles.filter(j => j.department && j.title), // Only save completed entries
        residences: form.residences.filter(r => r.country && r.city),
        userType: form.userType,
        availability: 'available',
        isPublished: false,
        updatedAt: new Date()
      };

      // Note: This will need to be updated after the user is created
      // For now, we'll redirect and let them update their profile
      console.log('User registered successfully!');
      navigate('/verify-email');

    } catch (err: any) {
      console.error('Error registering user:', err);
      setError(err.message || 'An unknown error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-gray-800 p-6 rounded space-y-6">
        <h2 className="text-2xl font-bold">Create Your Account</h2>
        
        {/* --- Registration Fields --- */}
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address" required className="w-full p-2 bg-gray-700 rounded"/>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password (min. 6 characters)" required className="w-full p-2 bg-gray-700 rounded"/>
        
        <hr className="border-gray-600"/>
        
        <h2 className="text-xl font-bold">Build Your Profile</h2>
        
        {/* --- Profile Fields (from EditCrewProfile) --- */}
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="w-full p-2 bg-gray-700 rounded"/>
        <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Short Bio" rows={3} className="w-full p-2 bg-gray-700 rounded"/>
        
        <div>
          <label className="block mb-1">User Type</label>
          <select name="userType" value={form.userType} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded">
            <option value="Crew">Crew / Technical</option>
            <option value="Producer">Producer / Client</option>
          </select>
        </div>

        {form.userType === 'Crew' && (
          <>
            {/* --- Job Titles Section --- */}
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
                  {form.jobTitles.length > 1 && (<button type="button" onClick={() => removeJobEntry(i)} className="text-red-400">❌</button>)}
                </div>
              ))}
              <button type="button" onClick={addJobEntry} className="text-blue-400 underline text-sm">+ Add Job Title</button>
            </div>

            {/* --- Residences Section --- */}
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
                  {form.residences.length > 1 && (<button type="button" onClick={() => removeResidence(i)} className="text-red-400">❌</button>)}
                </div>
              ))}
              <button type="button" onClick={addResidence} className="text-blue-400 underline text-sm">+ Add Residence</button>
            </div>
            
            {/* --- Profile Picture Section --- */}
            <div>
              <label className="block mb-1">Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleImageFileChange} />
            </div>
          </>
        )}

        {/* --- Submission Button & Error Message --- */}
        <button type="submit" disabled={loading} className="w-full bg-green-600 py-2 rounded hover:bg-green-500 disabled:opacity-50">
          {loading ? 'Creating Account…' : 'Register'}
        </button>
        {error && <p className="text-center text-red-400">{error}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;
