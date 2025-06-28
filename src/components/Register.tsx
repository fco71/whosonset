// src/components/Register.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ProjectEntry } from '../types/ProjectEntry';
import { JobTitleEntry } from '../types/JobTitleEntry';
import { JOB_SUBCATEGORIES } from '../types/JobSubcategories';
import { Residence, ContactInfo } from '../types/CrewProfile';
import LocationSelector from './LocationSelector';

// --- Interfaces to define the shape of your data ---
interface JobDepartment {
  name: string;
  titles: string[];
}

// --- Combined FormData for the entire registration & profile form ---
interface FormData {
  email: string;
  password: string;
  name: string; // This will be used for both displayName and the profile name
  username: string; // New username field for screen handle
  bio: string;
  profileImageUrl: string;
  jobTitles: JobTitleEntry[];
  residences: Residence[];
  projects: ProjectEntry[];
  education: string[]; // Array of education entries
  userType: 'Crew' | 'Producer';
  contactInfo?: ContactInfo;
  otherInfo?: string; // freeform text
  availability?: 'available' | 'unavailable' | 'soon'; // Availability status
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
    username: '',
    bio: '',
    profileImageUrl: '',
    jobTitles: [{ department: '', title: '', subcategories: [] }],
    residences: [{ country: 'Dominican Republic', city: '' }],
    projects: [{ projectName: '', role: '', description: '' }],
    education: [],
    userType: 'Crew',
    contactInfo: {
      email: '',
      phone: '',
      website: '',
      instagram: '',
    },
    otherInfo: '',
    availability: 'available',
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

  const updateJobEntry = (i: number, field: keyof JobTitleEntry, value: any) => {
    setForm(f => {
      const updated = [...f.jobTitles];
      const newEntry = { ...updated[i], [field]: value };

      if (field === 'department') {
        newEntry.title = '';
        newEntry.subcategories = [];
      }

      if (field === 'title') {
        newEntry.subcategories = [];
      }

      if (field === 'subcategories') {
        // Ensure subcategories are in correct format
        newEntry.subcategories = ensureSubcategoriesFormat(value);
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

  const updateEducation = (i: number, value: string) => {
    setForm(f => {
      const education = [...f.education];
      education[i] = value;
      return { ...f, education };
    });
  };

  const addEducation = () => setForm(f => ({ ...f, education: [...f.education, ''] }));
  const removeEducation = (i: number) => setForm(f => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));

  // --- The new handleSubmit that performs all registration steps ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.name || !form.username) {
      setError("Please fill out email, password, name, and username.");
      return;
    }
    
    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(form.username)) {
      setError("Username must be 3-20 characters long and contain only letters, numbers, and underscores.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      console.log('Starting registration process for:', form.email);
      
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const firebaseUser = userCredential.user;
      const userId = firebaseUser.uid;
      
      console.log('Firebase Auth user created with ID:', userId);
      
      // Step 2: Update Auth profile display name
      await updateProfile(firebaseUser, { displayName: form.name });
      console.log('Firebase Auth profile updated with display name');

      // Step 3: Upload profile image if selected
      let uploadedImageUrl = '';
      if (imageFile) {
        const storageRef = ref(storage, `profileImages/${userId}`);
        await uploadBytes(storageRef, imageFile);
        uploadedImageUrl = await getDownloadURL(storageRef);
        console.log('Profile image uploaded:', uploadedImageUrl);
      }

      // Step 4: Create document in 'users' collection
      const userData = {
        uid: userId,
        email: form.email, // Use form email to ensure consistency
        displayName: form.name,
        username: form.username,
        photoURL: uploadedImageUrl,
        roles: ['user'],
        user_type: form.userType,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'users', userId), userData);
      console.log('User document created in users collection');

      // Step 5: Create detailed profile in 'crewProfiles' collection
      const crewProfileData = {
        uid: userId,
        email: form.email, // Ensure email is saved in crew profile
        name: form.name,
        username: form.username,
        bio: form.bio || '',
        profileImageUrl: uploadedImageUrl,
        jobTitles: form.jobTitles.filter(j => j.department && j.title),
        residences: form.residences.filter(r => r.country && r.city),
        projects: form.projects.filter(p => p.projectName && p.role),
        education: form.education.filter(edu => edu.trim()),
        contactInfo: {
          email: form.email, // Set email in contact info
          phone: form.contactInfo?.phone || '',
          website: form.contactInfo?.website || '',
          instagram: form.contactInfo?.instagram || '',
        },
        otherInfo: form.otherInfo || '',
        availability: form.availability || 'available',
        isPublished: false, // Start as private
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, "crewProfiles", userId), crewProfileData);
      console.log('Crew profile document created');

      console.log('User registered and profile created successfully!');
      navigate('/'); // Redirect to homepage after successful registration

    } catch (err: any) {
      console.error('Error registering user:', err);
      
      // Provide more specific error messages
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message) {
        errorMessage = err.message.replace('Firebase: ', '');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- The new JSX with the full form ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight">
            whosonset
          </h1>
          <h2 className="text-2xl font-light text-gray-600 tracking-wide">
            Create Account
          </h2>
          <p className="text-base font-light text-gray-500 mt-2">
            Join the film industry community
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-slide-up-delay">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
              <p className="text-sm font-medium text-red-800">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                placeholder="Create a password"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                placeholder="Choose a username (3-20 characters)"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">This will be your screen handle (e.g., @franciscovaldez)</p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Location
              </label>
              <LocationSelector
                selectedCountry={form.residences[0]?.country || ''}
                selectedCity={form.residences[0]?.city || ''}
                onCountryChange={country => updateResidence(0, 'country', country)}
                onCityChange={city => updateResidence(0, 'city', city)}
              />
            </div>

            <button 
              type="submit" 
              className="w-full px-6 py-4 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm font-light text-gray-500">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-gray-900 font-medium hover:text-gray-700 transition-colors duration-300 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-slide-up-delay-2">
          <p className="text-xs font-light text-gray-400 tracking-wide">
            © 2024 whosonset. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;