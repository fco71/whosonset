// src/components/Register.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ProjectEntry } from '../types/ProjectEntry';
import { JobTitleEntry } from '../types/JobTitleEntry';

// --- Interfaces to define the shape of your data ---
interface Residence {
  country: string;
  city: string;
}

interface JobDepartment {
  name: string;
  titles: string[];
}

// --- Combined FormData for the entire registration & profile form ---
interface FormData {
  email: string;
  password: string;
  name: string; // This will be used for both displayName and the profile name
  bio: string;
  profileImageUrl: string;
  jobTitles: JobTitleEntry[];
  residences: Residence[];
  projects: ProjectEntry[];
  userType: 'Crew' | 'Producer';
}

const fetchJobDepartments = async (): Promise<JobDepartment[]> => {
  const snapshot = await getDocs(collection(db, "jobDepartments"));
  return snapshot.docs.map((doc) => ({
    name: doc.data().name,
    titles: doc.data().titles || [],
  } as JobDepartment));
};

const Register: React.FC = () => {
  const navigate = useNavigate();

  // --- A single, comprehensive state object for the whole form ---
  const [form, setForm] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    bio: '',
    profileImageUrl: '',
    jobTitles: [{ department: '', title: '', subcategories: [] }],
    residences: [{ country: 'Dominican Republic', city: '' }],
    projects: [{ projectName: '', role: '', description: '' }],
    userType: 'Crew',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [departments, setDepartments] = useState<JobDepartment[]>([]);
  const [countryOptions, setCountryOptions] = useState<{ name: string; cities: string[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- useEffect to load dropdown data when the component mounts ---
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

  // --- Handlers for updating form state ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const updateJobEntry = (i: number, field: keyof JobTitleEntry, value: any) => {
    setForm(f => {
      const updated = [...f.jobTitles];
      const newEntry = { ...updated[i], [field]: value };

      if (field === 'department') {
        newEntry.title = '';
        newEntry.subcategories = [];
      }

      updated[i] = newEntry;
      return { ...f, jobTitles: updated };
    });
  };

  const addJobEntry = () => setForm(f => ({ ...f, jobTitles: [...f.jobTitles, { department: '', title: '', subcategories: [] }] }));
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

  const updateProject = (i: number, field: keyof ProjectEntry, value: string) => {
    setForm(f => {
      const updated = [...f.projects];
      updated[i] = { ...updated[i], [field]: value };
      return { ...f, projects: updated };
    });
  };

  const addProject = () => setForm(f => ({ ...f, projects: [...f.projects, { projectName: '', role: '', description: '' }] }));
  const removeProject = (i: number) => setForm(f => ({ ...f, projects: f.projects.filter((_, idx) => idx !== i) }));

  // --- The new handleSubmit that performs all registration steps ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.name) {
      setError("Please fill out email, password, and your name.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const firebaseUser = userCredential.user;
      const userId = firebaseUser.uid;
      
      // Step 2 (Optional but good): Update Auth profile display name
      await updateProfile(firebaseUser, { displayName: form.name });

      // Step 3: Upload profile image if selected
      let uploadedImageUrl = '';
      if (imageFile) {
        const storageRef = ref(storage, `profileImages/${userId}`);
        await uploadBytes(storageRef, imageFile);
        uploadedImageUrl = await getDownloadURL(storageRef);
      }

      // Step 4: Create document in 'users' collection
      await setDoc(doc(db, 'users', userId), {
        uid: userId,
        email: firebaseUser.email,
        displayName: form.name,
        photoURL: uploadedImageUrl,
        roles: ['user'],
        user_type: form.userType,
      });

      // Step 5: Create detailed profile in 'crewProfiles' if they are Crew
      if (form.userType === 'Crew') {
        await setDoc(doc(db, "crewProfiles", userId), {
          uid: userId,
          name: form.name,
          bio: form.bio,
          profileImageUrl: uploadedImageUrl,
          jobTitles: form.jobTitles.filter(j => j.department && j.title),
          residences: form.residences.filter(r => r.country && r.city),
          projects: form.projects.filter(p => p.projectName && p.role),
          availability: 'available', // Example default field
        });
      }

      console.log('User registered and profile created successfully!');
      navigate('/'); // Redirect to homepage after successful registration

    } catch (err: any) {
      console.error('Error registering user:', err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  // --- The new JSX with the full form ---
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-gray-800 p-6 rounded space-y-6">
        <h2 className="text-2xl font-bold">Create Your Account</h2>
        
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address*" required className="w-full p-2 bg-gray-700 rounded"/>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password (min. 6 characters)*" required className="w-full p-2 bg-gray-700 rounded"/>
        
        <hr className="border-gray-600"/>
        
        <h2 className="text-xl font-bold">Build Your Profile</h2>
        
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name*" required className="w-full p-2 bg-gray-700 rounded"/>
        <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Short Bio" rows={3} className="w-full p-2 bg-gray-700 rounded"/>
        
        <div>
          <label className="block mb-1 text-sm font-medium">I am a...</label>
          <select name="userType" value={form.userType} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded">
            <option value="Crew">Crew / Technical</option>
            <option value="Producer">Producer / Client</option>
          </select>
        </div>

        {form.userType === 'Crew' && (
          <>
            {/* Job Titles Section */}
            <div>
              <h3 className="font-semibold mb-2">My Job Titles</h3>
              {form.jobTitles.map((entry, i) => (
                <div key={i} className="mb-4 space-y-2">
                  <div className="flex gap-2 items-center">
                    <select value={entry.department} onChange={e => updateJobEntry(i, 'department', e.target.value)} className="p-2 bg-gray-700 rounded flex-1">
                      <option value="">— Department —</option>
                      {departments.map(d => (<option key={d.name} value={d.name}>{d.name}</option>))}
                      <option value="Other">Other</option>
                    </select>
                    {entry.department === 'Other' ? (
                      <input value={entry.title} onChange={e => updateJobEntry(i, 'title', e.target.value)} placeholder="Enter job title" className="p-2 bg-gray-700 rounded flex-1" />
                    ) : (
                      <select value={entry.title} onChange={e => updateJobEntry(i, 'title', e.target.value)} className="p-2 bg-gray-700 rounded flex-1" disabled={!entry.department}>
                        <option value="">— Title —</option>
                        {departments.find(d => d.name === entry.department)?.titles.map(title => (<option key={title} value={title}>{title}</option>))}
                      </select>
                    )}
                    {form.jobTitles.length > 1 && (<button type="button" onClick={() => removeJobEntry(i)} className="text-red-400">❌</button>)}
                  </div>
                  
                  {/* Subcategories */}
                  {entry.title && (
                    <div className="ml-4 space-y-1">
                      {entry.subcategories?.map((sub, idx) => (
                        <input
                          key={idx}
                          value={sub}
                          onChange={(e) => {
                            const newSubs = [...(entry.subcategories || [])];
                            newSubs[idx] = e.target.value;
                            updateJobEntry(i, 'subcategories', newSubs);
                          }}
                          placeholder={`Subcategory ${idx + 1}`}
                          className="p-2 bg-gray-700 rounded w-full text-sm"
                        />
                      ))}
                      
                      {(entry.subcategories?.length || 0) < 3 && (
                        <button
                          type="button"
                          onClick={() => updateJobEntry(i, 'subcategories', [...(entry.subcategories || []), ''])}
                          className="text-blue-400 underline text-sm"
                        >
                          + Add Subcategory
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={addJobEntry} className="text-blue-400 underline text-sm">+ Add Job Title</button>
            </div>

            {/* Residences Section */}
            <div>
              <h3 className="font-semibold mb-2">My Residences</h3>
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

            {/* Projects Section */}
            <div>
              <h3 className="font-semibold mb-2">My Projects</h3>
              {form.projects.map((proj, i) => (
                <div key={i} className="mb-4 space-y-1">
                  <input
                    value={proj.projectName}
                    onChange={e => updateProject(i, 'projectName', e.target.value)}
                    placeholder="Project Name"
                    className="w-full p-2 bg-gray-700 rounded"
                  />
                  <input
                    value={proj.role}
                    onChange={e => updateProject(i, 'role', e.target.value)}
                    placeholder="Your Role"
                    className="w-full p-2 bg-gray-700 rounded"
                  />
                  <input
                    value={proj.description}
                    onChange={e => updateProject(i, 'description', e.target.value)}
                    placeholder="Short description (optional)"
                    maxLength={100}
                    className="w-full p-2 bg-gray-700 rounded text-sm"
                  />
                  {form.projects.length > 1 && (
                    <button type="button" onClick={() => removeProject(i)} className="text-red-400 text-sm">❌ Remove</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addProject} className="text-blue-400 underline text-sm">+ Add Project</button>
            </div>
            
            {/* Profile Picture Section */}
            <div>
              <label className="block mb-1 font-semibold">Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleImageFileChange} className="text-sm" />
            </div>
          </>
        )}

        <button type="submit" disabled={loading} className="w-full bg-green-600 py-2 rounded hover:bg-green-500 disabled:opacity-50 font-bold">
          {loading ? 'Creating Account…' : 'Register'}
        </button>

        {error && <p className="text-center text-red-400">{error}</p>}
        
        <p className="text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;