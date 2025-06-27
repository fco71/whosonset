import React, { useState, useEffect, useRef } from 'react';
// --- MODIFIED: Added onAuthStateChanged for robust user checking ---
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { ProjectEntry } from '../types/ProjectEntry';
import { JobTitleEntry } from '../types/JobTitleEntry';
import { JOB_SUBCATEGORIES } from '../types/JobSubcategories';
import { CrewProfileFormData, Residence, ContactInfo } from '../types/CrewProfile';
import ResumeView from './ResumeView';
import LocationSelector from './LocationSelector';

// Import html2pdf using require to bypass TypeScript issues
const html2pdf = require('html2pdf.js');

// Interfaces remain the same
interface JobDepartment {
  name: string;
  titles: string[];
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

  const [form, setForm] = useState<CrewProfileFormData>({
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
    isPublished: false,
    availability: 'available',
    languages: [],
  });

  const [departments, setDepartments] = useState<JobDepartment[]>([]);
  const [countryOptions, setCountryOptions] = useState<{ name: string; cities: string[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);

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
            isPublished: data.isPublished || false,
            availability: data.availability || 'available',
            languages: data.languages || [],
          });
          setIsPublished(data.isPublished || false);
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

  const updateLanguage = (i: number, value: string) => {
    setForm(f => {
      const newLangs = [...(f.languages || [])];
      newLangs[i] = value;
      return { ...f, languages: newLangs };
    });
  };

  const addLanguage = () => {
    setForm(f => ({ ...f, languages: [...(f.languages || []), ''] }));
  };

  const removeLanguage = (i: number) => {
    setForm(f => ({ ...f, languages: (f.languages || []).filter((_: string, idx: number) => idx !== i) }));
  };

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
        languages: form.languages || [],
        uid: user.uid,
        isPublished, // Save publish state
      }, { merge: true });
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
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-10">
      <div className="w-full max-w-xl mb-4 px-2">
        <div className="resume-builder-banner bg-white bg-opacity-95 shadow-md rounded-xl p-3 flex flex-col items-center text-center">
          <h1 className="text-xl font-medium text-gray-800 tracking-wide mb-1">Resume Builder</h1>
          <p className="text-gray-600 text-sm leading-snug">Easily create, update, and download your professional film industry resume. Showcase your experience, skills, and projects to producers and collaborators.</p>
        </div>
      </div>
      <div className="w-full max-w-xl px-2">
        <div className="bg-white">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
            <div className="max-w-3xl mx-auto px-4 py-8">
              <div className="text-center mb-6 animate-fade-in">
                <h1 className="text-3xl font-light text-gray-900 mb-2 tracking-tight animate-slide-up">
                  Edit
                </h1>
                <h2 className="text-xl font-light text-gray-600 mb-3 tracking-wide animate-slide-up-delay">
                  Crew Profile
                </h2>
                <p className="text-base font-light text-gray-500 max-w-xl mx-auto leading-normal animate-slide-up-delay-2">
                  Update your professional information and showcase your experience. Keep your profile current to attract the best opportunities.
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-gray-50">
            <div className="max-w-4xl mx-auto px-8 py-16">
              <div className="bg-white rounded-xl shadow-sm p-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-light text-gray-900 tracking-wide">Profile Information</h3>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium tracking-wider ${
                    isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isPublished ? '🌐 Published' : '🔒 Private'}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      placeholder="Enter your full name" 
                      className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                      Bio
                    </label>
                    <textarea 
                      name="bio" 
                      value={form.bio} 
                      onChange={handleChange} 
                      placeholder="Tell us about yourself and your experience" 
                      rows={4} 
                      className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] resize-none" 
                    />
                  </div>
                </div>

                {/* Job Titles Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-light text-gray-900 mb-4 tracking-wide">Job Titles</h3>
                  {form.jobTitles.map((entry, i) => (
                    <div key={i} className="mb-6 p-6 bg-gray-50 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                            Department
                          </label>
                          <select 
                            value={entry.department} 
                            onChange={e => updateJobEntry(i, 'department', e.target.value)} 
                            className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                          >
                            <option value="">Select Department</option>
                            {departments.map(d => (<option key={d.name} value={d.name}>{d.name}</option>))}
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                            Job Title
                          </label>
                          {entry.department === 'Other' ? (
                            <input 
                              value={entry.title} 
                              onChange={e => updateJobEntry(i, 'title', e.target.value)} 
                              placeholder="Enter job title" 
                              className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]" 
                            />
                          ) : (
                            <select 
                              value={entry.title} 
                              onChange={e => updateJobEntry(i, 'title', e.target.value)} 
                              className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]" 
                              disabled={!entry.department}
                            >
                              <option value="">Select Job Title</option>
                              {departments.find(d => d.name === entry.department)?.titles.map(title => (<option key={title} value={title}>{title}</option>))}
                            </select>
                          )}
                        </div>
                      </div>
                      
                      {form.jobTitles.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeJobEntry(i)} 
                          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          Remove Job Title
                        </button>
                      )}
                      
                      {/* Additional Job Titles */}
                      {entry.title && (
                        <div className="ml-4 space-y-4 border-l-2 border-gray-200 pl-4">
                          {entry.subcategories?.map((sub, idx) => (
                            <div key={idx} className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                                    Additional Department
                                  </label>
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
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
                                  >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                      <option key={dept.name} value={dept.name}>
                                        {dept.name}
                                      </option>
                                    ))}
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                                
                                {sub.department && (
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                                      Additional Job Title
                                    </label>
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
                                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
                                      />
                                    ) : (
                                      <select
                                        value={sub.title}
                                        onChange={(e) => {
                                          const newSubs = [...(entry.subcategories || [])];
                                          newSubs[idx] = { ...sub, title: e.target.value };
                                          updateJobEntry(i, 'subcategories', newSubs);
                                        }}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
                                      >
                                        <option value="">Select Job Title</option>
                                        {departments
                                          .find(d => d.name === sub.department)
                                          ?.titles.map(title => (
                                            <option key={title} value={title} className="truncate">
                                              {title}
                                            </option>
                                          ))}
                                      </select>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={addJobEntry} 
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
                  >
                    + Add Job Title
                  </button>
                </div>

                {/* Languages Section */}
                <section>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>Languages (up to 3, optional):</label>
                  {(form.languages || []).map((lang: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <input
                        type="text"
                        value={lang}
                        maxLength={40}
                        onChange={e => updateLanguage(idx, e.target.value)}
                        placeholder={`Language #${idx + 1}`}
                        style={{ marginRight: 8, flex: 1 }}
                      />
                      <button type="button" onClick={() => removeLanguage(idx)} style={{ color: 'red' }}>Remove</button>
                    </div>
                  ))}
                  {(form.languages?.length || 0) < 3 && (
                    <button type="button" onClick={addLanguage} style={{ marginTop: 4 }}>Add Language</button>
                  )}
                </section>

                {/* Residences Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-light text-gray-900 mb-4 tracking-wide">Residences</h3>
                  {form.residences.map((res, i) => (
                    <div key={i} className="mb-4 p-6 bg-gray-50 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                            Country
                          </label>
                          <LocationSelector
                            selectedCountry={res.country}
                            selectedCity={res.city}
                            onCountryChange={(value: string) => updateResidence(i, 'country', value)}
                            onCityChange={(value: string) => updateResidence(i, 'city', value)}
                          />
                        </div>
                      </div>
                      
                      {form.residences.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeResidence(i)} 
                          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          Remove Residence
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    onClick={addResidence} 
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
                  >
                    + Add Residence
                  </button>
                </div>

                {/* Projects Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-light text-gray-900 mb-4 tracking-wide">Projects</h3>
                  {form.projects.map((proj, i) => (
                    <div key={i} className="mb-4 p-6 bg-gray-50 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                            Project Name
                          </label>
                          <input
                            value={proj.projectName}
                            onChange={e => updateProject(i, 'projectName', e.target.value)}
                            placeholder="Enter project name"
                            className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                            Your Role
                          </label>
                          <input
                            value={proj.role}
                            onChange={e => updateProject(i, 'role', e.target.value)}
                            placeholder="Enter your role"
                            className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                          Description (Optional)
                        </label>
                        <input
                          value={proj.description}
                          onChange={e => updateProject(i, 'description', e.target.value)}
                          placeholder="Short description of your contribution"
                          maxLength={100}
                          className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
                        />
                      </div>
                      {form.projects.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeProject(i)} 
                          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          Remove Project
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={addProject} 
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
                  >
                    + Add Project
                  </button>
                </div>

                {/* Education Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-light text-gray-900 mb-4 tracking-wide">Education</h3>
                  {form.education.map((edu, i) => (
                    <div key={i} className="mb-3 flex items-center gap-3">
                      <input
                        value={edu}
                        onChange={e => updateEducation(i, e.target.value)}
                        placeholder="e.g., Bachelor of Arts in Film Studies, UCLA"
                        className="flex-1 p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
                        maxLength={80}
                      />
                      {form.education.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeEducation(i)} 
                          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={addEducation} 
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
                  >
                    + Add Education
                  </button>
                </div>

                {/* Profile Picture Section */}
                <div className="mb-8">
                  <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                    Profile Picture
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfileImageChange}
                    className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                  />
                  {form.profileImageUrl && (
                    <div className="mt-4 flex items-center gap-4">
                      <img src={form.profileImageUrl} className="h-20 w-20 rounded-full object-cover border-2 border-gray-200" />
                      <button 
                        onClick={() => setForm(f => ({ ...f, profileImageUrl: '' }))} 
                        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors" 
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Contact Info Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-light text-gray-900 mb-4 tracking-wide">Contact Information (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        value={form.contactInfo?.email || ''}
                        onChange={e =>
                          setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, email: e.target.value } }))
                        }
                        className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={form.contactInfo?.phone || ''}
                        onChange={e =>
                          setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, phone: e.target.value } }))
                        }
                        className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                        Website
                      </label>
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={form.contactInfo?.website || ''}
                        onChange={e =>
                          setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, website: e.target.value } }))
                        }
                        className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                        Instagram
                      </label>
                      <input
                        type="text"
                        placeholder="@yourusername"
                        value={form.contactInfo?.instagram || ''}
                        onChange={e =>
                          setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, instagram: e.target.value } }))
                        }
                        className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                      />
                    </div>
                  </div>
                </div>

                {/* Other Info Section */}
                <div className="mb-8">
                  <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                    Other Relevant Information (Optional)
                  </label>
                  <textarea
                    placeholder="Add any other skills, certifications, memberships, etc."
                    value={form.otherInfo || ''}
                    onChange={e =>
                      setForm(f => ({ ...f, otherInfo: e.target.value }))
                    }
                    rows={4}
                    className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] resize-none"
                  />
                </div>

                {/* Publish Toggle Section */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      id="publish-toggle"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-5 h-5 text-gray-600 bg-white border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
                    />
                    <label htmlFor="publish-toggle" className="font-medium text-gray-900">
                      Publish Resume Publicly
                    </label>
                  </div>
                  {isPublished ? (
                    <div className="text-sm text-green-600">
                      ✅ Your resume will be visible via a public link once saved.
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      🔒 Your resume is private and only visible to you.
                    </div>
                  )}
                  {isPublished && (
                    <p className="text-yellow-600 text-sm mt-2">
                      ⚠️ Once published, your resume will be accessible to anyone with the link.
                    </p>
                  )}
                </div>

                {/* Availability Section */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Availability Status</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="availability"
                        value="available"
                        checked={form.availability === 'available'}
                        onChange={(e) => setForm(f => ({ ...f, availability: e.target.value as 'available' | 'unavailable' | 'soon' }))}
                        className="w-4 h-4 text-green-600 bg-white border-gray-300 focus:ring-green-500 focus:ring-2"
                      />
                      <span className="text-green-700 font-medium">✅ Available for work</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="availability"
                        value="soon"
                        checked={form.availability === 'soon'}
                        onChange={(e) => setForm(f => ({ ...f, availability: e.target.value as 'available' | 'unavailable' | 'soon' }))}
                        className="w-4 h-4 text-yellow-600 bg-white border-gray-300 focus:ring-yellow-500 focus:ring-2"
                      />
                      <span className="text-yellow-700 font-medium">⏰ Available soon</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="availability"
                        value="unavailable"
                        checked={form.availability === 'unavailable'}
                        onChange={(e) => setForm(f => ({ ...f, availability: e.target.value as 'available' | 'unavailable' | 'soon' }))}
                        className="w-4 h-4 text-red-600 bg-white border-gray-300 focus:ring-red-500 focus:ring-2"
                      />
                      <span className="text-red-700 font-medium">❌ Currently unavailable</span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    This helps producers know when you're available for new projects
                  </p>
                </div>

                {/* Share Resume Section */}
                {isPublished && user && (
                  <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3">Share Your Resume</h4>
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="text"
                        value={`${window.location.origin}/resume/${user.uid}`}
                        readOnly
                        className="flex-1 p-3 bg-white border border-blue-200 rounded-lg text-sm text-gray-600"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/resume/${user.uid}`);
                          setMessage('Link copied to clipboard!');
                          setTimeout(() => setMessage(null), 3000);
                        }}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-xs text-blue-700">
                      Share this link with potential employers or collaborators
                    </p>
                  </div>
                )}

                {/* Save Button */}
                <button 
                  onClick={handleSave} 
                  disabled={loading} 
                  className="w-full bg-gray-900 text-white py-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 font-light tracking-wide transition-all duration-300 hover:scale-[1.02]"
                >
                  {loading ? 'Saving…' : 'Save Profile'}
                </button>
                
                {message && (
                  <p className="text-center text-green-600 mt-4 font-medium">{message}</p>
                )}

                {/* Resume Preview */}
                <hr className="my-8 border-gray-200" />
                <h3 className="text-xl font-light text-gray-900 mb-6 tracking-wide">Resume Preview</h3>
                <div ref={resumeRef} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <ResumeView profile={{
                    ...form,
                    projects: form.projects?.map(project => ({
                      projectName: project.projectName,
                      role: project.role,
                      description: project.description || '' // Ensure description is always a string
                    }))
                  }} />
                </div>
                <button
                  onClick={handleDownloadPDF}
                  className="mt-6 bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-light tracking-wide transition-all duration-300 hover:scale-105"
                >
                  Download as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCrewProfile;