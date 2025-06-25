import React, { useState, useEffect, useRef } from 'react';
// --- MODIFIED: Added onAuthStateChanged for robust user checking ---
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { ProjectEntry } from '../types/ProjectEntry';
import { JobTitleEntry } from '../types/JobTitleEntry';
import { JOB_SUBCATEGORIES } from '../types/JobSubcategories';
import ResumeView from './ResumeView';

// Import html2pdf using require to bypass TypeScript issues
const html2pdf = require('html2pdf.js');

// Interfaces remain the same
interface Residence {
  country: string;
  city: string;
}

interface JobDepartment {
  name: string;
  titles: string[];
}

interface FormData {
  name: string;
  bio: string;
  profileImageUrl: string;
  jobTitles: JobTitleEntry[];
  residences: Residence[];
  projects: ProjectEntry[];
  education: string[]; // Array of education entries
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
    instagram?: string;
  };
  otherInfo?: string; // freeform text
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
    jobTitles: [{ department: '', title: '', subcategories: [] }],
    residences: [{ country: '', city: '' }],
    projects: [{ projectName: '', role: '', description: '' }],
    education: [],
    contactInfo: {
      email: '',
      phone: '',
      website: '',
      instagram: '',
    },
    otherInfo: '',
  });

  const [departments, setDepartments] = useState<JobDepartment[]>([]);
  const [countryOptions, setCountryOptions] = useState<{ name: string; cities: string[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // PDF download functionality
  const resumeRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPDF = () => {
    if (!resumeRef.current) return;

    html2pdf()
      .from(resumeRef.current)
      .set({
        margin: [0.2, 0.2, 0.2, 0.2], // Even smaller margins
        filename: `${form.name.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          letterRendering: true,
        },
        jsPDF: { 
          unit: 'mm', // Use millimeters for more precise control
          format: 'a4', // Use A4 instead of letter
          orientation: 'portrait',
          compress: true,
        },
        pagebreak: { mode: 'avoid-all' },
      })
      .save();
  };

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
      if (!user) {
        console.log("DEBUG: No user found, skipping profile load");
        return;
      }
      console.log("DEBUG: Loading profile for user:", user.uid);
      try {
        const docRef = doc(db, 'crewProfiles', user.uid);
        console.log("DEBUG: Document reference created:", docRef.path);
        const docSnap = await getDoc(docRef);
        console.log("DEBUG: Document snapshot retrieved, exists:", docSnap.exists());
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("DEBUG: Profile data loaded:", data);
          
          // Migrate old string-based subcategories to new JobTitleEntry format
          const migratedJobTitles = data.jobTitles?.map((jobTitle: any) => {
            if (jobTitle.subcategories && Array.isArray(jobTitle.subcategories)) {
              // Check if subcategories are strings (old format) or objects (new format)
              const migratedSubcategories = jobTitle.subcategories.map((sub: any) => {
                if (typeof sub === 'string') {
                  // Convert old string format to new object format
                  return { department: '', title: sub, subcategories: [] };
                } else {
                  // Already in new format, ensure it has the right structure
                  return {
                    department: sub.department || '',
                    title: sub.title || '',
                    subcategories: sub.subcategories || []
                  };
                }
              });
              return { ...jobTitle, subcategories: migratedSubcategories };
            } else {
              // No subcategories, initialize empty array
              return { ...jobTitle, subcategories: [] };
            }
          }) || [];

          setForm({
            name: data.name || '',
            bio: data.bio || '',
            profileImageUrl: data.profileImageUrl || '',
            jobTitles: migratedJobTitles,
            residences: data.residences || [{ country: '', city: '' }],
            projects: data.projects || [{ projectName: '', role: '', description: '' }],
            education: data.education || [],
            contactInfo: data.contactInfo || {
              email: '',
              phone: '',
              website: '',
              instagram: '',
            },
            otherInfo: data.otherInfo || '',
          });
          console.log("DEBUG: Form state updated with profile data");
        } else {
          console.log("DEBUG: No profile document found for user:", user.uid);
        }
      } catch (error) {
        console.error("DEBUG: Error loading profile:", error);
      }
    };

    loadLookups();
    loadProfile();
  }, [user]); // This entire block now runs only when 'user' changes

  // --- Helper function to ensure subcategories are in correct format ---
  const ensureSubcategoriesFormat = (subcategories: any[]): JobTitleEntry[] => {
    return subcategories.map((sub: any) => {
      if (typeof sub === 'string') {
        // Convert old string format to new object format
        return { department: '', title: sub, subcategories: [] };
      } else {
        // Already in new format, ensure it has the right structure
        return {
          department: sub.department || '',
          title: sub.title || '',
          subcategories: sub.subcategories || []
        };
      }
    });
  };

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

  const updateJobEntry = (i: number, field: 'department' | 'title' | 'subcategories', value: string | JobTitleEntry[]) => {
    setForm(f => {
      const updated = [...f.jobTitles];
      const newEntry = { ...updated[i] };

      if (field === 'department') {
        newEntry.department = value as string;
        newEntry.title = '';
        newEntry.subcategories = [];
      } else if (field === 'title') {
        newEntry.title = value as string;
        newEntry.subcategories = [];
      } else if (field === 'subcategories') {
        // Ensure subcategories are in correct format
        newEntry.subcategories = ensureSubcategoriesFormat(value as JobTitleEntry[]);
      }

      updated[i] = newEntry;
      return { ...f, jobTitles: updated };
    });
  };

  const addJobEntry = () =>
    setForm(f => ({ ...f, jobTitles: [...f.jobTitles, { department: '', title: '', subcategories: [] }] }));

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

  const updateProject = (i: number, field: keyof ProjectEntry, value: string) => {
    setForm(f => {
      const updated = [...f.projects];
      updated[i] = { ...updated[i], [field]: value };
      return { ...f, projects: updated };
    });
  };

  const addProject = () =>
    setForm(f => ({ ...f, projects: [...f.projects, { projectName: '', role: '', description: '' }] }));

  const removeProject = (i: number) =>
    setForm(f => ({ ...f, projects: f.projects.filter((_, idx) => idx !== i) }));

  const updateEducation = (i: number, value: string) => {
    setForm(f => {
      const education = [...f.education];
      education[i] = value;
      return { ...f, education };
    });
  };

  const addEducation = () =>
    setForm(f => ({ ...f, education: [...f.education, ''] }));

  const removeEducation = (i: number) =>
    setForm(f => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      console.log("DEBUG: No user found, cannot save");
      return;
    }
    console.log("DEBUG: Starting save process for user:", user.uid);
    console.log("DEBUG: Form data to save:", form);
    setLoading(true);
    try {
      const docRef = doc(db, 'crewProfiles', user.uid);
      console.log("DEBUG: Saving to document:", docRef.path);
      await setDoc(docRef, {
        ...form,
        uid: user.uid,
      });
      console.log("DEBUG: Save successful!");
      setMessage('Profile saved!');
    } catch(error) { // Added error logging
      console.error("DEBUG: Save failed with error:", error);
      setMessage('Failed to save.');
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
            <div key={i} className="mb-4 space-y-2">
              <div className="space-y-2">
                <select value={entry.department} onChange={e => updateJobEntry(i, 'department', e.target.value)} className="p-2 bg-gray-700 rounded w-full">
                  <option value="">— Department —</option>
                  {departments.map(d => (<option key={d.name} value={d.name}>{d.name}</option>))}
                  <option value="Other">Other</option>
                </select>
                {entry.department === 'Other' ? (
                  <input value={entry.title} onChange={e => updateJobEntry(i, 'title', e.target.value)} placeholder="Enter job title" className="p-2 bg-gray-700 rounded w-full" />
                ) : (
                  <select value={entry.title} onChange={e => updateJobEntry(i, 'title', e.target.value)} className="p-2 bg-gray-700 rounded w-full" disabled={!entry.department}>
                    <option value="">— Title —</option>
                    {departments.find(d => d.name === entry.department)?.titles.map(title => (<option key={title} value={title}>{title}</option>))}
                  </select>
                )}
                {form.jobTitles.length > 1 && (
                  <button type="button" onClick={() => removeJobEntry(i)} className="text-red-400 text-sm">❌ Remove</button>
                )}
              </div>
              
              {/* Additional Job Titles */}
              {entry.title && (
                <div className="ml-4 space-y-2">
                  {entry.subcategories?.map((sub, idx) => (
                    <div key={idx} className="space-y-1">
                      <select
                        value={sub.department || ''}
                        onChange={(e) => {
                          const newSubs = [...(entry.subcategories || [])];
                          newSubs[idx] = { 
                            department: e.target.value, 
                            title: '', 
                            subcategories: [] 
                          };
                          updateJobEntry(i, 'subcategories', newSubs);
                        }}
                        className="p-2 bg-gray-700 rounded w-full text-sm"
                      >
                        <option value="">— Select Department —</option>
                        {departments.map(dept => (
                          <option key={dept.name} value={dept.name}>
                            {dept.name}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                      
                      {sub.department && (
                        <>
                          {sub.department === 'Other' ? (
                            <input
                              type="text"
                              value={sub.title}
                              onChange={(e) => {
                                const newSubs = [...(entry.subcategories || [])];
                                newSubs[idx] = { ...sub, title: e.target.value };
                                updateJobEntry(i, 'subcategories', newSubs);
                              }}
                              placeholder="Enter job title"
                              className="p-2 bg-gray-700 rounded w-full text-sm"
                            />
                          ) : (
                            <select
                              value={sub.title}
                              onChange={(e) => {
                                const newSubs = [...(entry.subcategories || [])];
                                newSubs[idx] = { ...sub, title: e.target.value };
                                updateJobEntry(i, 'subcategories', newSubs);
                              }}
                              className="p-2 bg-gray-700 rounded w-full text-sm"
                            >
                              <option value="">— Select Job Title —</option>
                              {departments
                                .find(d => d.name === sub.department)
                                ?.titles.map(title => (
                                  <option key={title} value={title} className="truncate">
                                    {title}
                                  </option>
                                ))}
                            </select>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button type="button" onClick={addJobEntry} className="text-blue-400 underline text-sm">+ Add Job Title</button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Residences</h3>
          {form.residences.map((res, i) => (
            <div key={i} className="space-y-2 mb-4">
              <select value={res.country} onChange={e => updateResidence(i, 'country', e.target.value)} className="p-2 bg-gray-700 rounded w-full">
                <option value="">— Select Country —</option>
                {countryOptions.map(c => (<option key={c.name} value={c.name}>{c.name}</option>))}
              </select>
              
              <div className="relative">
                <input 
                  value={res.city} 
                  onChange={e => updateResidence(i, 'city', e.target.value)} 
                  placeholder="Enter city name"
                  className="p-2 bg-gray-700 rounded w-full"
                  list={`cities-${i}`}
                />
                {res.country && (
                  <datalist id={`cities-${i}`}>
                    {countryOptions.find(c => c.name === res.country)?.cities.map(city => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                )}
              </div>
              
              {form.residences.length > 1 && (
                <button type="button" onClick={() => removeResidence(i)} className="text-red-400 text-sm">❌ Remove</button>
              )}
            </div>
          ))}
          <button onClick={addResidence} className="text-blue-400 underline text-sm">+ Add Residence</button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Projects</h3>
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
        <div>
          <h3 className="font-semibold mb-2">Education</h3>
          {form.education.map((edu, i) => (
            <div key={i} className="mb-2 flex items-center gap-2">
              <input
                value={edu}
                onChange={e => updateEducation(i, e.target.value)}
                placeholder="e.g., Bachelor of Arts in Film Studies, UCLA"
                className="flex-1 p-2 bg-gray-700 rounded text-sm"
                maxLength={80}
              />
              {form.education.length > 1 && (
                <button type="button" onClick={() => removeEducation(i)} className="text-red-400 text-sm">❌</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addEducation} className="text-blue-400 underline text-sm">+ Add Education</button>
        </div>
        <div>
          <label className="block mb-1">Profile Picture</label>
          <input type="file" accept="image/*" onChange={handleProfileImageChange} />
          {form.profileImageUrl && (<div className="mt-2 flex items-center gap-4"><img src={form.profileImageUrl} className="h-20 w-20 rounded-full object-cover" /><button onClick={() => setForm(f => ({ ...f, profileImageUrl: '' }))} className="text-red-400 underline text-sm" type="button">Remove</button></div>)}
        </div>

        {/* Contact Info Section */}
        <div>
          <h3 className="font-semibold mb-2">Contact Info (optional)</h3>
          <input
            type="email"
            placeholder="Email"
            value={form.contactInfo?.email || ''}
            onChange={e =>
              setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, email: e.target.value } }))
            }
            className="w-full p-2 bg-gray-700 rounded mb-2"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={form.contactInfo?.phone || ''}
            onChange={e =>
              setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, phone: e.target.value } }))
            }
            className="w-full p-2 bg-gray-700 rounded mb-2"
          />
          <input
            type="url"
            placeholder="Website"
            value={form.contactInfo?.website || ''}
            onChange={e =>
              setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, website: e.target.value } }))
            }
            className="w-full p-2 bg-gray-700 rounded mb-2"
          />
          <input
            type="text"
            placeholder="Instagram Handle"
            value={form.contactInfo?.instagram || ''}
            onChange={e =>
              setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, instagram: e.target.value } }))
            }
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>

        {/* Other Info Section */}
        <div className="mt-6">
          <label className="block font-semibold mb-1">Other Relevant Info (optional)</label>
          <textarea
            placeholder="Add any other skills, certifications, memberships, etc."
            value={form.otherInfo || ''}
            onChange={e =>
              setForm(f => ({ ...f, otherInfo: e.target.value }))
            }
            rows={4}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>

        <button onClick={handleSave} disabled={loading} className="w-full bg-green-600 py-2 rounded hover:bg-green-500 disabled:opacity-50">{loading ? 'Saving…' : 'Save Profile'}</button>
        {message && <p className="text-center text-yellow-400">{message}</p>}

        {/* Resume Preview */}
        <hr className="my-6 border-gray-700" />
        <h3 className="text-xl font-bold mb-2">Resume Preview</h3>
        <div ref={resumeRef}>
          <ResumeView profile={form} />
        </div>
        <button
          onClick={handleDownloadPDF}
          className="mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default EditCrewProfile;