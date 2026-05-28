import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
// --- MODIFIED: Added onAuthStateChanged for robust user checking ---
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { ProjectEntry } from '../types/ProjectEntry';
import { JobTitleEntry } from '../types/JobTitleEntry';
import { 
  EducationEntry, 
  EducationLevel, 
  CrewProfileFormData, 
  Residence, 
  ContactInfo 
} from '../types/CrewProfile';
import { Eye, EyeOff } from 'lucide-react';

// Simplified default education entry
const getDefaultEducationEntry = (): EducationEntry => ({
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  isCurrent: false
});
import { JOB_SUBCATEGORIES } from '../types/JobSubcategories';
import ResumeView from './ResumeView';
import LocationSelector from './LocationSelector';
import ResumeDownloadButton from './ResumeDownloadButton';
import { getCleanInstagramHandle } from '../lib/utils';
import { PhotoConflictMonitor } from '../utilities/photoConflictMonitor';

// Import html2pdf using require to bypass TypeScript issues
const html2pdf = require('html2pdf.js');

// Interfaces remain the same
interface JobDepartment {
  name: string;
  titles: string[];
}

interface RegisteredTeacher {
  uid: string;
  name: string;
  institution: string;
  classes: string[];
}

type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

const fieldInputClassName = 'mfj-vv-field';
const compactFieldInputClassName = 'mfj-vv-field mfj-vv-field-compact';
const compactCardClassName = 'mfj-vv-card';
const actionLinkClassName = 'mfj-vv-action-link';
const dangerLinkClassName = 'mfj-vv-danger-link';
const primaryButtonClassName = 'mfj-vv-btn-primary';
const iconButtonClassName = 'mfj-vv-icon-button';

const RESUME_BUILDER_SECTIONS = [
  { id: 'profile-type', labelKey: 'profileType' },
  { id: 'basic-info', labelKey: 'basicInfo' },
  { id: 'job-titles', labelKey: 'jobTitles' },
  { id: 'languages', labelKey: 'languages' },
  { id: 'residences', labelKey: 'residences' },
  { id: 'projects', labelKey: 'projects' },
  { id: 'education', labelKey: 'education' },
  { id: 'contact', labelKey: 'contact' },
  { id: 'publish', labelKey: 'publish' },
] as const;

type ResumeBuilderSectionId = (typeof RESUME_BUILDER_SECTIONS)[number]['id'];

const fetchJobDepartments = async (): Promise<JobDepartment[]> => {
  const snapshot = await getDocs(collection(db, "jobDepartments"));
  // This map assumes the data shape is correct in Firestore (i.e., has a 'titles' field)
  return snapshot.docs.map((doc) => ({
    name: doc.data().name,
    titles: doc.data().titles || [], // Fallback to empty array if titles is missing
  } as JobDepartment));
};

const EditCrewProfile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const auth = getAuth();

  // --- MODIFIED: Use state to track the user, which is more reliable on load ---
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showResume, setShowResume] = useState(false);

  // Initialize form with default values that match CrewProfileFormData interface
  const getInitialFormData = (): CrewProfileFormData => ({
    name: '',
    bio: '',
    profileImageUrl: '',
    profileType: 'professional',
    studentInfo: {
      institution: ''
    },
    teacherInfo: {
      institution: '',
      classes: []
    },
    selectedTeacherIds: [],
    selectedTeachers: [],
    jobTitles: [{ department: '', title: '', subcategories: [] }],
    residences: [{ country: '', city: '' }],
    projects: [],
    education: [],
    contactInfo: { 
      email: '', 
      phone: '', 
      website: '',
      instagram: ''
    },
    languages: [],
    otherInfo: '',
    isPublished: true,
    availability: 'available'
  });

  const [form, setForm] = useState<CrewProfileFormData>(getInitialFormData());
  const [departments, setDepartments] = useState<JobDepartment[]>([]);
  const [countryOptions, setCountryOptions] = useState<{ name: string; cities: string[] }[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  const [photoConflict, setPhotoConflict] = useState<{hasConflict: boolean, conflictUsers: string[]}>({hasConflict: false, conflictUsers: []});
  const [registeredTeachers, setRegisteredTeachers] = useState<RegisteredTeacher[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<ResumeBuilderSectionId>('profile-type');

  const latestFormRef = useRef<CrewProfileFormData>(form);
  const latestPublishedRef = useRef(isPublished);
  const latestSnapshotRef = useRef('');
  const lastSavedSnapshotRef = useRef('');
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const pendingAutoSaveRef = useRef(false);

  const getSaveSnapshot = (formData: CrewProfileFormData, published: boolean) =>
    JSON.stringify({ formData, published });

  useEffect(() => {
    latestFormRef.current = form;
    latestPublishedRef.current = isPublished;
    latestSnapshotRef.current = getSaveSnapshot(form, isPublished);
  }, [form, isPublished]);

  // Helper function to ensure education entries have consistent structure
  const ensureEducationFields = (eduArray: any[] = []): EducationEntry[] => {
    if (!Array.isArray(eduArray) || eduArray.length === 0) {
      return [getDefaultEducationEntry()];
    }
    
    // Ensure all education entries have consistent structure
    return eduArray.map(edu => ({
      ...getDefaultEducationEntry(),
      ...edu,
      // Handle legacy data format
      institution: edu.institution || '',
      degree: edu.degree || '',
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      isCurrent: Boolean(edu.isCurrent)
    }));
  };

  // Clean up any blob URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any blob URLs in the form state
      if (form.profileImageUrl?.startsWith('blob:')) {
        console.log('[ProfileImage] Cleaning up blob URL on unmount:', form.profileImageUrl);
        URL.revokeObjectURL(form.profileImageUrl);
      }
    };
  }, [form.profileImageUrl]);

  // PDF download functionality
  const resumeRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPDF = () => {
    if (!resumeRef.current) return;

    // Get the element to be converted to PDF
    const element = resumeRef.current;
    
    // Set options for PDF generation
    // Margins are 0 because ResumeView already has its own A4 padding built in.
    // This ensures what you see in the preview is exactly what gets downloaded.
    const opt = {
      margin: [0, 0, 0, 0],
      filename: `${form.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        letterRendering: true,
        imageTimeout: 0,
        width: 794,   // A4 width in px at 96dpi (210mm)
        height: 1123,  // A4 height in px at 96dpi (297mm)
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      },
    };

    // Generate PDF
    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get('pdf')
      .then((pdf: any) => {
        // Get the number of pages
        const totalPages = pdf.internal.getNumberOfPages();
        // If there's a blank page at the end, remove it
        if (totalPages > 1 && pdf.internal.getCurrentPageInfo().pageNumber === totalPages) {
          pdf.deletePage(totalPages);
        }
        // Save the PDF
        pdf.save(opt.filename);
      });
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
    if (!user) {
      setProfileLoaded(false);
      setSaveStatus('idle');
      return;
    }

    console.log("DEBUG: User confirmed. Now loading lookup data...");
    setProfileLoaded(false);
    setSaveStatus('idle');
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

          // Ensure all required fields are present and properly formatted
          const formData: CrewProfileFormData = {
            // Required fields with defaults
            name: data.name || '',
            bio: data.bio || '',
            profileImageUrl: data.profileImageUrl || '',
            profileType: data.profileType || (data.isTeacher ? 'teacher' : data.isStudent ? 'student' : 'professional'),
            studentInfo: {
              institution: data.studentInfo?.institution || data.school || ''
            },
            teacherInfo: {
              institution: data.teacherInfo?.institution || data.teacherInstitution || '',
              classes: data.teacherInfo?.classes || data.teacherClasses || []
            },
            selectedTeacherIds: data.selectedTeacherIds || data.selectedTeachers?.map((teacher: any) => teacher.uid).filter(Boolean) || [],
            selectedTeachers: data.selectedTeachers || [],
            // Arrays with type safety
            jobTitles: data.jobTitles?.length ? migratedJobTitles : [{ department: '', title: '', subcategories: [] }],
            residences: data.residences?.length ? data.residences : [{ country: '', city: '' }],
            projects: data.projects?.length ? data.projects : [],
            education: data.education?.length ? ensureEducationFields(data.education) : [],
            // Optional fields with defaults
            contactInfo: data.contactInfo || { email: '', phone: '', website: '', instagram: '' },
            languages: data.languages?.length ? data.languages : [],
            otherInfo: data.otherInfo || '',
            isPublished: data.isPublished || false,
            availability: data.availability || 'available'
          };
          
          const loadedPublished = data.isPublished || false;
          const loadedSnapshot = getSaveSnapshot(formData, loadedPublished);
          lastSavedSnapshotRef.current = loadedSnapshot;
          latestSnapshotRef.current = loadedSnapshot;
          setForm(formData);
          setIsPublished(loadedPublished);
          setSaveStatus('saved');
          console.log("DEBUG: Form state updated with profile data");
        } else {
          console.log("DEBUG: No profile document found for user:", user.uid);
          const initialSnapshot = getSaveSnapshot(latestFormRef.current, latestPublishedRef.current);
          lastSavedSnapshotRef.current = initialSnapshot;
          latestSnapshotRef.current = initialSnapshot;
          setSaveStatus('idle');
        }
      } catch (error) {
        console.error("DEBUG: Error loading profile:", error);
        setSaveStatus('error');
      } finally {
        setProfileLoaded(true);
      }
    };

    const loadRegisteredTeachers = async () => {
      try {
        const teachersSnap = await getDocs(collection(db, 'crewProfiles'));
        const teachers = teachersSnap.docs
          .map(profileDoc => {
            const data = profileDoc.data();
            const isTeacher = data.profileType === 'teacher' || data.isTeacher === true;
            if (!isTeacher || data.isPublished === false) return null;

            return {
              uid: profileDoc.id,
              name: data.name || data.displayName || 'Teacher',
              institution: data.teacherInfo?.institution || data.teacherInstitution || '',
              classes: data.teacherInfo?.classes || data.teacherClasses || []
            };
          })
          .filter(Boolean) as RegisteredTeacher[];

        setRegisteredTeachers(teachers);
      } catch (error) {
        console.error("DEBUG: Error loading registered teachers:", error);
      }
    };

    loadLookups();
    loadProfile();
    loadRegisteredTeachers();
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

  // Get default education entry with enhanced fields
  const getDefaultEducationEntry = (): EducationEntry => ({
    institution: '',
    place: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    grade: '',
    description: '',
    isCurrent: false
  });

  // Education level options for the dropdown
  const educationLevels = [
    { value: 'high_school', label: 'High School' },
    { value: 'associate', label: 'Associate Degree' },
    { value: 'bachelor', label: "Bachelor's Degree" },
    { value: 'master', label: "Master's Degree" },
    { value: 'phd', label: 'PhD/Doctorate' },
    { value: 'professional_certification', label: 'Professional Certification' },
    { value: 'other', label: 'Other' }
  ];

  // Format date for display (YYYY-MM to Month YYYY)
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    if (dateString === 'Present') return 'Present';
    
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Validate education entry - simplified for our needs
  const validateEducation = (edu: EducationEntry): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    const currentYear = new Date().getFullYear();
    
    // No required fields - all are optional
    
    // Simple year validation if dates are provided
    if (edu.startDate && !/^\d{4}$/.test(edu.startDate)) {
      errors.startDate = `Please enter a valid year (e.g., ${currentYear - 6})`;
    }
    
    if (!edu.isCurrent && edu.endDate && !/^\d{4}$/.test(edu.endDate)) {
      errors.endDate = `Please enter a valid year (e.g., ${currentYear})`;
    }
    
    // Validate end date is after start date if both are provided
    if (edu.startDate && edu.endDate && !edu.isCurrent && 
        parseInt(edu.startDate) > parseInt(edu.endDate)) {
      errors.endDate = 'End year must be after start year';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- THIS IS THE CORRECTED LINE ---
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) {
      console.log('[ProfileImage] No file selected or user not authenticated');
      return;
    }

    const file = e.target.files[0];
    console.log('[ProfileImage] Selected file:', { 
      name: file.name, 
      type: file.type, 
      size: file.size 
    });

    // Create a blob URL for preview (temporary)
    const blobUrl = URL.createObjectURL(file);
    console.log('[ProfileImage] Created blob URL for preview:', blobUrl);
    
    try {
      // Set the blob URL for immediate preview
      setForm(f => ({ ...f, profileImageUrl: blobUrl }));
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `profileImages/${user.uid}/${Date.now()}_${file.name}`);
      console.log('[ProfileImage] Starting upload to Firebase Storage...');
      
      await uploadBytes(storageRef, file);
      console.log('[ProfileImage] File uploaded successfully');
      
      // Get the persistent download URL
      const downloadUrl = await getDownloadURL(storageRef);
      console.log('[ProfileImage] Got download URL:', downloadUrl);
      
      // Check for photo URL conflicts before updating the form
      const conflictCheck = await PhotoConflictMonitor.checkPhotoUrl(downloadUrl, user.uid);
      const hasConflict = conflictCheck !== null;
      const conflictUsers = hasConflict ? conflictCheck.users.map(u => u.displayName) : [];
      
      setPhotoConflict({
        hasConflict,
        conflictUsers
      });
      
      if (hasConflict) {
        console.warn('[ProfileImage] ⚠️ Photo URL conflict detected:', conflictUsers);
        // Don't prevent the upload, but warn the user
        setError(`⚠️ This photo is already being used by: ${conflictUsers.join(', ')}. Consider using a different photo.`);
        // Clear the error after 5 seconds
        setTimeout(() => setError(''), 5000);
      }
      
      // Update the form with the persistent URL
      setForm(f => ({ ...f, profileImageUrl: downloadUrl }));
      
      // Revoke the temporary blob URL
      URL.revokeObjectURL(blobUrl);
      console.log('[ProfileImage] Revoked temporary blob URL');
      
    } catch (error) {
      console.error('[ProfileImage] Error uploading image:', error);
      // Revert to the previous image URL if there was an error
      setForm(f => ({ ...f, profileImageUrl: '' }));
      
      // Revoke the blob URL on error
      URL.revokeObjectURL(blobUrl);
      
      // Show error message to user
      setMessage(t('resume.builder.imageUploadError'));
    }
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

  const updateEducation = (i: number, field: keyof EducationEntry, value: string | boolean) => {
    setForm(f => {
      const education = [...f.education];
      // Ensure the education entry exists
      education[i] = {
        ...education[i],
        [field]: value
      };
      
      // If isCurrent is true, clear the endDate
      if (field === 'isCurrent' && value === true) {
        education[i].endDate = '';
      }
      
      return { ...f, education };
    });
  };

  const addEducation = () => {
    setForm(f => ({
      ...f,
      education: [
        ...f.education,
        {
          institution: '',
          place: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          grade: '',
          description: '',
          isCurrent: false
        }
      ]
    }));
  };

  const removeEducation = (i: number) =>
    setForm(f => ({
      ...f,
      education: f.education.filter((_, idx) => idx !== i)
    }));

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

  const updateProfileType = (profileType: 'professional' | 'student' | 'teacher') => {
    setForm(f => ({
      ...f,
      profileType,
      studentInfo: {
        institution: profileType === 'student' ? f.studentInfo?.institution || '' : ''
      },
      teacherInfo: {
        institution: profileType === 'teacher' ? f.teacherInfo?.institution || '' : '',
        classes: profileType === 'teacher' ? f.teacherInfo?.classes || [] : []
      },
      selectedTeacherIds: profileType === 'student' ? f.selectedTeacherIds || [] : [],
      selectedTeachers: profileType === 'student' ? f.selectedTeachers || [] : []
    }));
  };

  const normalizeInstitution = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

  const getMatchingRegisteredTeachers = () => {
    const studentInstitution = normalizeInstitution(form.studentInfo?.institution || '');
    if (!studentInstitution) return [];

    return registeredTeachers.filter(teacher =>
      normalizeInstitution(teacher.institution) === studentInstitution
    );
  };

  const updateStudentInstitution = (institution: string) => {
    setForm(f => {
      const normalizedInstitution = normalizeInstitution(institution);
      const stillMatchingTeacherIds = new Set(
        registeredTeachers
          .filter(teacher => normalizeInstitution(teacher.institution) === normalizedInstitution)
          .map(teacher => teacher.uid)
      );

      return {
        ...f,
        studentInfo: {
          ...(f.studentInfo || {}),
          institution
        },
        selectedTeacherIds: (f.selectedTeacherIds || []).filter(teacherId => stillMatchingTeacherIds.has(teacherId)),
        selectedTeachers: (f.selectedTeachers || []).filter(teacher => stillMatchingTeacherIds.has(teacher.uid))
      };
    });
  };

  const toggleSelectedTeacher = (teacher: RegisteredTeacher, checked: boolean) => {
    setForm(f => {
      const selectedTeacherIds = new Set(f.selectedTeacherIds || []);
      // Preserve existing per-teacher class enrollments so unchecking and
      // re-checking the same teacher doesn't lose the student's class picks.
      const existingClassesByTeacher = new Map(
        (f.selectedTeachers || []).map(entry => [entry.uid, entry.classes || []])
      );

      if (checked) {
        selectedTeacherIds.add(teacher.uid);
      } else {
        selectedTeacherIds.delete(teacher.uid);
        existingClassesByTeacher.delete(teacher.uid);
      }

      const selectedTeachers = Array.from(selectedTeacherIds)
        .map(teacherId => {
          const matchedTeacher = registeredTeachers.find(registeredTeacher => registeredTeacher.uid === teacherId);
          if (!matchedTeacher) return null;
          return {
            uid: matchedTeacher.uid,
            name: matchedTeacher.name,
            institution: matchedTeacher.institution,
            classes: existingClassesByTeacher.get(matchedTeacher.uid) || []
          };
        })
        .filter(Boolean) as NonNullable<CrewProfileFormData['selectedTeachers']>;

      return {
        ...f,
        selectedTeacherIds: Array.from(selectedTeacherIds),
        selectedTeachers
      };
    });
  };

  // Toggle a single class enrollment for a specific teacher on the student's
  // profile. Used by the per-teacher class checkboxes that appear under each
  // selected teacher. Powers the teacher's "My Students" page grouping.
  const toggleStudentEnrolledClass = (teacherUid: string, className: string, checked: boolean) => {
    setForm(f => {
      const selectedTeachers = (f.selectedTeachers || []).map(entry => {
        if (entry.uid !== teacherUid) return entry;
        const existing = new Set(entry.classes || []);
        if (checked) existing.add(className);
        else existing.delete(className);
        return { ...entry, classes: Array.from(existing) };
      });
      return { ...f, selectedTeachers };
    });
  };

  const updateTeacherClass = (index: number, value: string) => {
    setForm(f => {
      const classes = [...(f.teacherInfo?.classes || [])];
      classes[index] = value;
      return {
        ...f,
        teacherInfo: {
          ...(f.teacherInfo || {}),
          classes
        }
      };
    });
  };

  const addTeacherClass = () => {
    setForm(f => ({
      ...f,
      teacherInfo: {
        ...(f.teacherInfo || {}),
        classes: [...(f.teacherInfo?.classes || []), '']
      }
    }));
  };

  const removeTeacherClass = (index: number) => {
    setForm(f => ({
      ...f,
      teacherInfo: {
        ...(f.teacherInfo || {}),
        classes: (f.teacherInfo?.classes || []).filter((_, idx) => idx !== index)
      }
    }));
  };

  // Helper function to remove undefined values from objects recursively
  const removeUndefinedValues = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return null;
    }
    if (Array.isArray(obj)) {
      return obj.map(removeUndefinedValues).filter(item => item !== null);
    }
    if (typeof obj === 'object') {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          cleaned[key] = removeUndefinedValues(value);
        }
      }
      return cleaned;
    }
    return obj;
  };

  const saveProfile = useCallback(async (options: { silent?: boolean } = {}) => {
    if (!user) {
      console.log("DEBUG: No user found, cannot save");
      return false;
    }

    if (savingRef.current) {
      pendingAutoSaveRef.current = true;
      return false;
    }

    const formToSave = latestFormRef.current;
    const publishedToSave = latestPublishedRef.current;
    const snapshotToSave = getSaveSnapshot(formToSave, publishedToSave);

    console.log("DEBUG: Starting save process for user:", user.uid);
    console.log("DEBUG: Form data to save:", formToSave);
    savingRef.current = true;
    setSaving(true);
    setLoading(true);
    setSaveStatus('saving');
    try {
      const docRef = doc(db, 'crewProfiles', user.uid);
      console.log("DEBUG: Saving to document:", docRef.path);

      // Always ensure name and profileImageUrl are set
      const safeName = formToSave.name && formToSave.name.trim() !== '' ? formToSave.name : 'Unknown Crew';
              let safeProfileImageUrl = formToSave.profileImageUrl && formToSave.profileImageUrl.trim() !== '' ? formToSave.profileImageUrl : '/bust-avatar.svg';
      // Prevent saving blob: URLs
      if (safeProfileImageUrl.startsWith('blob:')) {
        // If the current image is a blob, fallback to previous or default
                    safeProfileImageUrl = '/bust-avatar.svg';
      }

      // Ensure email is included in the saved data
      const profileType = formToSave.profileType === 'student' || formToSave.profileType === 'teacher' ? formToSave.profileType : 'professional';
      const studentInstitution = formToSave.studentInfo?.institution?.trim() || '';
      const teacherInstitution = formToSave.teacherInfo?.institution?.trim() || '';
      const teacherClasses = (formToSave.teacherInfo?.classes || [])
        .map(className => className.trim())
        .filter(Boolean);
      const selectedTeacherIds = profileType === 'student' ? formToSave.selectedTeacherIds || [] : [];
      // Preserve per-teacher class enrollments from the form state so we don't
      // wipe them when the student saves. Falls back to existing form entry
      // if the teacher record isn't in registeredTeachers anymore.
      const formClassesByTeacher = new Map(
        (formToSave.selectedTeachers || []).map(entry => [entry.uid, entry.classes || []])
      );
      const selectedTeachers = profileType === 'student'
        ? selectedTeacherIds
            .map(teacherId => {
              const matchedTeacher = registeredTeachers.find(teacher => teacher.uid === teacherId);
              const classes = formClassesByTeacher.get(teacherId) || [];
              if (!matchedTeacher) {
                const fallback = formToSave.selectedTeachers?.find(teacher => teacher.uid === teacherId);
                return fallback ? { ...fallback, classes: fallback.classes || classes } : null;
              }
              return {
                uid: matchedTeacher.uid,
                name: matchedTeacher.name,
                institution: matchedTeacher.institution,
                classes
              };
            })
            .filter(Boolean)
        : [];
      const dataToSave = {
        ...formToSave,
        name: safeName,
        profileImageUrl: safeProfileImageUrl,
        profileType,
        studentInfo: {
          institution: profileType === 'student' ? studentInstitution : ''
        },
        teacherInfo: {
          institution: profileType === 'teacher' ? teacherInstitution : '',
          classes: profileType === 'teacher' ? teacherClasses : []
        },
        isStudent: profileType === 'student',
        isTeacher: profileType === 'teacher',
        school: profileType === 'student' ? studentInstitution : '',
        teacherInstitution: profileType === 'teacher' ? teacherInstitution : '',
        teacherClasses: profileType === 'teacher' ? teacherClasses : [],
        selectedTeacherIds,
        selectedTeachers,
        // Note: uid field is intentionally omitted since document ID should be the UID
        email: user.email || formToSave.contactInfo?.email || '', // Use auth email as primary, fallback to contact info
        contactInfo: {
          ...formToSave.contactInfo,
          email: user.email || formToSave.contactInfo?.email || '', // Ensure email is in contact info
          instagram: getCleanInstagramHandle(formToSave.contactInfo?.instagram || ''), // Clean Instagram handle before saving
        },
        languages: formToSave.languages || [],
        isPublished: publishedToSave, // Save publish state
        updatedAt: new Date()
      };

      // Remove any undefined values before saving to Firestore
      const cleanedData = removeUndefinedValues(dataToSave);

      await setDoc(docRef, cleanedData, { merge: true });
      console.log("DEBUG: Save successful!");
      lastSavedSnapshotRef.current = snapshotToSave;
      setLastSavedAt(new Date());
      setSaveStatus(latestSnapshotRef.current === snapshotToSave ? 'saved' : 'dirty');
      if (!options.silent) {
        setMessage(t('resume.builder.savedMessage'));
        setTimeout(() => setMessage(null), 3000);
      }
      return true;
    } catch(error) { // Added error logging
      console.error("DEBUG: Save failed with error:", error);
      setSaveStatus('error');
      if (!options.silent) {
        setMessage(t('resume.builder.saveError'));
      }
      return false;
    } finally {
      savingRef.current = false;
      setSaving(false);
      setLoading(false);
      if (pendingAutoSaveRef.current) {
        pendingAutoSaveRef.current = false;
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current);
        }
        autoSaveTimerRef.current = setTimeout(() => {
          void saveProfile({ silent: true });
        }, 500);
      }
    }
  }, [registeredTeachers, t, user]);

  useEffect(() => {
    if (!profileLoaded || !user) return;

    const currentSnapshot = getSaveSnapshot(form, isPublished);
    latestSnapshotRef.current = currentSnapshot;

    if (currentSnapshot === lastSavedSnapshotRef.current) {
      if (saveStatus === 'dirty') {
        setSaveStatus('saved');
      }
      return;
    }

    if (savingRef.current) {
      pendingAutoSaveRef.current = true;
      return;
    }

    setSaveStatus('dirty');

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      void saveProfile({ silent: true });
    }, 1500);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [form, isPublished, profileLoaded, saveProfile, saveStatus, user]);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visibleSection = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleSection) return;

        const sectionId = visibleSection.target.id.replace('section-', '') as ResumeBuilderSectionId;
        if (RESUME_BUILDER_SECTIONS.some(section => section.id === sectionId)) {
          setActiveSectionId(sectionId);
        }
      },
      {
        rootMargin: '-160px 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    RESUME_BUILDER_SECTIONS.forEach(section => {
      const element = document.getElementById(`section-${section.id}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    await saveProfile({ silent: false });
  };

  const matchingRegisteredTeachers = getMatchingRegisteredTeachers();
  const hasStudentInstitution = Boolean(normalizeInstitution(form.studentInfo?.institution || ''));
  const registeredTeacherInstitutions = Array.from(
    new Set(registeredTeachers.map(teacher => teacher.institution).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const saveStatusText = (() => {
    switch (saveStatus) {
      case 'dirty':
        return t('resume.builder.unsavedChanges');
      case 'saving':
        return t('resume.builder.savingChanges');
      case 'saved':
        return lastSavedAt
          ? t('resume.builder.lastSaved', {
              time: lastSavedAt.toLocaleTimeString(i18n.language.startsWith('es') ? 'es-DO' : 'en-US', {
                hour: 'numeric',
                minute: '2-digit'
              })
            })
          : t('resume.builder.allChangesSaved');
      case 'error':
        return t('resume.builder.saveFailedStatus');
      default:
        return t('resume.builder.autoSaveReady');
    }
  })();
  const saveStatusClass = saveStatus === 'error'
    ? 'text-red-700'
    : saveStatus === 'dirty'
      ? 'text-amber-700'
      : saveStatus === 'saving'
        ? 'text-blue-700'
        : 'text-green-700';
  const resumeBuilderSections = RESUME_BUILDER_SECTIONS.map(section => ({
    ...section,
    label: t(`resume.builder.sections.${section.labelKey}`)
  }));

  // --- JSX / HTML ---
  return (
    <div className="mfj-vv-world flex min-h-screen flex-col items-center pt-4 sm:pt-8">
      <div className="w-full max-w-6xl mb-4 px-4">
        <div className="resume-builder-banner mfj-vv-topbar flex flex-col items-start gap-1 p-4 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h1 className="mfj-vv-heading mb-1 text-xl">{t('resume.builder.title')}</h1>
            <p className="text-sm leading-snug text-slate-600">{t('resume.builder.description')}</p>
          </div>
          <span className={`mfj-vv-status-chip ${isPublished ? 'mfj-vv-status-chip-live' : 'mfj-vv-status-chip-private'}`}>
            {isPublished ? t('resume.builder.published') : t('resume.builder.private')}
          </span>
        </div>
      </div>
      <div className="w-full max-w-6xl px-0 sm:px-4">
        <div className="bg-transparent">
          {/* Hero Section */}
          <div className="mx-4 mb-4 sm:mx-0 sm:mb-6">
            <div className="mfj-vv-hero p-5 sm:p-7">
              <div className="flex flex-col gap-5 animate-fade-in lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <span className="mfj-vv-chip mfj-vv-chip-accent mb-3">
                    {t('resume.builder.profileInformation')}
                  </span>
                  <h1 className="mfj-vv-heading mb-2 text-3xl leading-tight sm:text-4xl">
                    {t('resume.builder.edit')}
                  </h1>
                  <h2 className="mfj-vv-subheading mb-3 text-lg sm:text-xl">
                    {t('resume.builder.crewProfile')}
                  </h2>
                  <p className="max-w-xl text-base leading-relaxed text-slate-600">
                    {t('resume.builder.updateDescription')}
                  </p>
                </div>
                <div className="mfj-vv-card flex flex-col gap-2 sm:min-w-56">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {t('resume.builder.sections.profileType')}
                  </span>
                  <span className="text-base font-semibold text-slate-900">
                    {t(`resume.builder.profileTypes.${form.profileType}`)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-transparent">
            <div className="max-w-6xl mx-auto px-0 py-4 sm:px-0 sm:py-6 lg:py-8">
              <div className="mfj-vv-panel rounded-none p-4 animate-fade-in sm:rounded-2xl sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-xl font-semibold text-slate-950 sm:text-2xl">{t('resume.builder.profileInformation')}</h3>
                  <div className={`mfj-vv-status-chip ${isPublished ? 'mfj-vv-status-chip-live' : 'mfj-vv-status-chip-private'}`}>
                    {isPublished ? t('resume.builder.published') : t('resume.builder.private')}
                  </div>
                </div>

                {/*
                  Combined sticky bar: section navigator on the left, autosave
                  + manual-save controls on the right. Replaces the previous
                  save-only sticky bar so the user has one persistent toolbar
                  (less vertical real estate consumed, fewer "where do I save"
                  moments). Phones get a compact section select in normal page
                  flow; large screens keep the sticky pill navigator.
                */}
                <div className="mfj-vv-toolbar static z-30 mb-8 px-3 py-3 sm:mb-10 sm:px-4 lg:sticky lg:top-20">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <select
                      aria-label={t('resume.builder.sectionNavLabel')}
                      value={activeSectionId}
                      onChange={e => {
                        const sectionId = e.target.value as ResumeBuilderSectionId;
                        setActiveSectionId(sectionId);
                        const el = document.getElementById(`section-${sectionId}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`${compactFieldInputClassName} sm:hidden`}
                    >
                      {resumeBuilderSections.map(section => (
                        <option key={section.id} value={section.id}>
                          {section.label}
                        </option>
                      ))}
                    </select>
                    <nav
                      aria-label={t('resume.builder.sectionNavLabel')}
                      className="-mx-1 hidden flex-1 items-center gap-1 overflow-x-auto pb-1 scrollbar-thin sm:flex"
                    >
                      {resumeBuilderSections.map(section => {
                        const isActive = activeSectionId === section.id;
                        return (
                        <a
                          key={section.id}
                          href={`#section-${section.id}`}
                          aria-current={isActive ? 'step' : undefined}
                          onClick={e => {
                            e.preventDefault();
                            setActiveSectionId(section.id);
                            const el = document.getElementById(`section-${section.id}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className={`mfj-vv-nav-pill focus:outline-none focus:ring-2 focus:ring-cyan-200 ${
                            isActive
                              ? 'mfj-vv-nav-pill-active'
                              : ''
                          }`}
                        >
                          {section.label}
                        </a>
                        );
                      })}
                    </nav>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 lg:justify-end">
                      <p className={`text-xs leading-snug ${saveStatusClass}`}>{saveStatusText}</p>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className={`${primaryButtonClassName} w-full px-4 py-2.5 text-xs sm:w-auto sm:py-2`}
                      >
                        {saving ? t('resume.builder.loading') : t('resume.builder.saveNow')}
                      </button>
                    </div>
                  </div>
                </div>

                {/*
                  -- SECTION 01 — Profile Type --
                  All sections below follow the same pattern:
                    id="section-X"  → anchor target for the sticky nav
                    scroll-mt-44    → leaves room for sticky nav so anchor lands cleanly
                    Section number  → tiny gray label for clear progression
                    border-t        → subtle divider between sections (instead of heavy cards)
                    pt-8 / pb-10    → generous breathing room
                */}
                <section id="section-profile-type" className="scroll-mt-44 pb-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    {t('resume.builder.sectionNumberLabel', { number: '01' })}
                  </p>
                  <h3 className="text-xl font-medium text-gray-900 mb-5 tracking-tight">{t('resume.builder.profileType')}</h3>
                  <div
                    className="mfj-vv-segment grid w-full grid-cols-1 gap-2 sm:inline-grid sm:w-auto sm:grid-cols-3 sm:gap-1"
                    aria-label={t('resume.builder.selectProfileType')}
                  >
                    {[
                      { value: 'professional', label: t('resume.builder.profileTypes.professional') },
                      { value: 'student', label: t('resume.builder.profileTypes.student') },
                      { value: 'teacher', label: t('resume.builder.profileTypes.teacher') }
                    ].map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateProfileType(option.value as 'professional' | 'student' | 'teacher')}
                        className={`mfj-vv-segment-btn px-4 py-2.5 text-sm ${
                          form.profileType === option.value
                            ? 'mfj-vv-segment-btn-active'
                            : ''
                        }`}
                        aria-pressed={form.profileType === option.value}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    {t('resume.builder.profileTypeDescription')}
                  </p>

                  {form.profileType === 'student' && (
                    <div className="mt-5 space-y-5">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                          {t('resume.builder.schoolInstitution')}
                        </label>
                        {/*
                          COMBOBOX — free-typeable with suggested institutions.
                          Students whose teacher is registered will see the
                          institution name appear in the dropdown autocomplete
                          and pick it directly (so wording matches teacher's).
                          Students whose teacher isn't on the platform yet can
                          still type their school freely.
                          The <datalist> populates the suggestion menu without
                          restricting input — best of both worlds.
                        */}
                        <input
                          type="text"
                          list="registered-teacher-institutions"
                          value={form.studentInfo?.institution || ''}
                          onChange={e => updateStudentInstitution(e.target.value)}
                          placeholder={t('resume.builder.schoolInstitutionPlaceholder')}
                          className={fieldInputClassName}
                        />
                        <datalist id="registered-teacher-institutions">
                          {registeredTeacherInstitutions.map(institution => (
                            <option key={institution} value={institution} />
                          ))}
                        </datalist>
                        <p className="mt-2 text-xs text-gray-500">
                          {t('resume.builder.schoolInstitutionHint')}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                          {t('resume.builder.registeredTeachers')}
                        </label>
                        {!hasStudentInstitution ? (
                          <p className="mfj-vv-card text-sm text-slate-500">
                            {t('resume.builder.pickInstitutionFirst')}
                          </p>
                        ) : matchingRegisteredTeachers.length === 0 ? (
                          <p className="mfj-vv-card text-sm text-slate-500">
                            {t('resume.builder.noRegisteredTeachers')}
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {matchingRegisteredTeachers.map(teacher => {
                              const isTeacherSelected = (form.selectedTeacherIds || []).includes(teacher.uid);
                              const enrolledClasses = new Set(
                                (form.selectedTeachers || []).find(entry => entry.uid === teacher.uid)?.classes || []
                              );
                              return (
                                <div
                                  key={teacher.uid}
                                  className="mfj-vv-card"
                                >
                                  <label className="flex items-start gap-3">
                                    <input
                                      type="checkbox"
                                      checked={isTeacherSelected}
                                      onChange={e => toggleSelectedTeacher(teacher, e.target.checked)}
                                      className="mt-1 w-4 h-4 text-cyan-700 bg-white border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                                    />
                                    <span className="min-w-0">
                                      <span className="block text-sm font-medium text-gray-900">{teacher.name}</span>
                                      {teacher.classes.length > 0 && (
                                        <span className="block text-xs text-gray-500 truncate">
                                          {teacher.classes.join(', ')}
                                        </span>
                                      )}
                                    </span>
                                  </label>

                                  {/* Per-teacher class enrollment checkboxes.
                                      Only shown once the student has actually
                                      selected this teacher AND the teacher has
                                      published a class list. Lets the teacher's
                                      "My Students" page group students by class. */}
                                  {isTeacherSelected && teacher.classes.length > 0 && (
                                    <div className="mt-3 ml-7 pl-3 border-l-2 border-cyan-100 space-y-2">
                                      <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        {t('resume.builder.enrolledClasses')}
                                      </p>
                                      {teacher.classes.map(className => (
                                        <label
                                          key={className}
                                          className="flex items-start gap-2 text-sm text-gray-700"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={enrolledClasses.has(className)}
                                            onChange={e =>
                                              toggleStudentEnrolledClass(teacher.uid, className, e.target.checked)
                                            }
                                            className="w-4 h-4 text-cyan-700 bg-white border-gray-300 rounded focus:ring-cyan-500 focus:ring-2"
                                          />
                                          <span className="min-w-0">{className}</span>
                                        </label>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {form.profileType === 'teacher' && (
                    <div className="mt-5 space-y-5">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                          {t('resume.builder.teacherInstitution')}
                        </label>
                        <input
                          type="text"
                          value={form.teacherInfo?.institution || ''}
                          onChange={e =>
                            setForm(f => ({
                              ...f,
                              teacherInfo: {
                                ...(f.teacherInfo || {}),
                                institution: e.target.value
                              }
                            }))
                          }
                          placeholder={t('resume.builder.teacherInstitutionPlaceholder')}
                          className={fieldInputClassName}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                          {t('resume.builder.teacherClasses')}
                        </label>
                        {(form.teacherInfo?.classes || []).map((className, index) => (
                          <div key={index} className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                            <input
                              type="text"
                              value={className}
                              onChange={e => updateTeacherClass(index, e.target.value)}
                              placeholder={t('resume.builder.teacherClassPlaceholder', { number: index + 1 })}
                              className={`${fieldInputClassName} sm:flex-1`}
                            />
                            <button
                              type="button"
                              onClick={() => removeTeacherClass(index)}
                              className={`${dangerLinkClassName} self-start`}
                            >
                              {t('resume.builder.removeTeacherClass')}
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addTeacherClass}
                          className={actionLinkClassName}
                        >
                          {t('resume.builder.addTeacherClass')}
                        </button>
                      </div>
                    </div>
                  )}
                </section>

                {/* -- SECTION 02 — Basic Information (Name + Bio) -- */}
                <section id="section-basic-info" className="scroll-mt-44 pb-10 border-t border-gray-200 pt-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    {t('resume.builder.sectionNumberLabel', { number: '02' })}
                  </p>
                  <h3 className="text-xl font-medium text-gray-900 mb-5 tracking-tight">{t('resume.builder.basicInformation')}</h3>
                  <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                      {t('resume.builder.fullName')}
                    </label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                                              placeholder={t('resume.builder.fullNamePlaceholder')} 
                      className={fieldInputClassName} 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                      {t('resume.builder.bio')}
                    </label>
                    <textarea 
                      name="bio" 
                      value={form.bio} 
                      onChange={handleChange} 
                                              placeholder={t('resume.builder.bioPlaceholder')} 
                      rows={4} 
                      className={`${fieldInputClassName} resize-none`} 
                    />
                  </div>
                  </div>
                </section>

                {/* -- SECTION 03 — Job Titles -- */}
                <section id="section-job-titles" className="scroll-mt-44 pb-10 border-t border-gray-200 pt-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    {t('resume.builder.sectionNumberLabel', { number: '03' })}
                  </p>
                  <h3 className="text-xl font-medium text-gray-900 mb-5 tracking-tight">{t('resume.builder.jobTitles')}</h3>
                  {form.jobTitles.map((entry, i) => (
                    <div key={i} className={`mb-6 space-y-4 ${compactCardClassName}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                            {t('resume.builder.department')}
                          </label>
                          <select 
                            value={entry.department} 
                            onChange={e => updateJobEntry(i, 'department', e.target.value)} 
                            className={fieldInputClassName}
                          >
                            <option value="">{t('resume.builder.selectDepartment')}</option>
                            {departments.map(d => (<option key={d.name} value={d.name}>{d.name}</option>))}
                            <option value="Other">{t('resume.builder.other')}</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                            {t('resume.builder.jobTitle')}
                          </label>
                          {entry.department === 'Other' ? (
                            <input 
                              value={entry.title} 
                              onChange={e => updateJobEntry(i, 'title', e.target.value)} 
                              placeholder={t('resume.builder.enterJobTitle')} 
                              className={fieldInputClassName} 
                            />
                          ) : (
                            <select 
                              value={entry.title} 
                              onChange={e => updateJobEntry(i, 'title', e.target.value)} 
                              className={fieldInputClassName} 
                              disabled={!entry.department}
                            >
                              <option value="">{t('resume.builder.selectJobTitle')}</option>
                              {departments.find(d => d.name === entry.department)?.titles.map(title => (<option key={title} value={title}>{title}</option>))}
                            </select>
                          )}
                        </div>
                      </div>
                      
                      {form.jobTitles.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeJobEntry(i)} 
                          className={dangerLinkClassName}
                        >
                          {t('resume.builder.removeJobTitle')}
                        </button>
                      )}
                      
                      {/* Additional Job Titles */}
                      {entry.title && (
                        <div className="space-y-4 border-gray-200 sm:ml-4 sm:border-l-2 sm:pl-4">
                          {entry.subcategories?.map((sub, idx) => (
                            <div key={idx} className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                                    {t('resume.builder.additionalDepartment')}
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
                                    className={compactFieldInputClassName}
                                  >
                                    <option value="">{t('resume.builder.selectDepartment')}</option>
                                    {departments.map(dept => (
                                      <option key={dept.name} value={dept.name}>
                                        {dept.name}
                                      </option>
                                    ))}
                                    <option value="Other">{t('resume.builder.other')}</option>
                                  </select>
                                </div>
                                
                                {sub.department && (
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                                      {t('resume.builder.additionalJobTitle')}
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
                                        placeholder={t('resume.builder.enterJobTitle')}
                                        className={compactFieldInputClassName}
                                      />
                                    ) : (
                                      <select
                                        value={sub.title}
                                        onChange={(e) => {
                                          const newSubs = [...(entry.subcategories || [])];
                                          newSubs[idx] = { ...sub, title: e.target.value };
                                          updateJobEntry(i, 'subcategories', newSubs);
                                        }}
                                        className={compactFieldInputClassName}
                                      >
                                        <option value="">{t('resume.builder.selectJobTitle')}</option>
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
                    className={actionLinkClassName}
                  >
                    {t('resume.builder.addJobTitle')}
                  </button>
                </section>

                {/* Languages Section */}
                <section id="section-languages" className="scroll-mt-44 pb-10 border-t border-gray-200 pt-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    {t('resume.builder.sectionNumberLabel', { number: '04' })}
                  </p>
                  <h3 className="text-xl font-medium text-gray-900 mb-5 tracking-tight">{t('resume.builder.languages')}</h3>
                  {(form.languages || []).map((lang: string, idx: number) => (
                    <div key={idx} className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <input
                        type="text"
                        value={lang}
                        maxLength={40}
                        onChange={e => updateLanguage(idx, e.target.value)}
                        placeholder={t('resume.builder.languagePlaceholderNumber', { number: idx + 1 })}
                        className={`${fieldInputClassName} sm:flex-1`}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeLanguage(idx)} 
                        className={`${dangerLinkClassName} self-start`}
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  ))}
                  {(form.languages?.length || 0) < 3 && (
                    <button 
                      type="button" 
                      onClick={addLanguage} 
                      className={actionLinkClassName}
                    >
                      {t('resume.builder.addLanguage')}
                    </button>
                  )}
                </section>

                {/* Residences Section */}
                <section id="section-residences" className="scroll-mt-44 pb-10 border-t border-gray-200 pt-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    {t('resume.builder.sectionNumberLabel', { number: '05' })}
                  </p>
                  <h3 className="text-xl font-medium text-gray-900 mb-5 tracking-tight">{t('resume.builder.residences')}</h3>
                  {form.residences.map((res, i) => (
                    <div key={i} className={`mb-4 space-y-4 ${compactCardClassName}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                            {t('resume.builder.country')}
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
                          className={dangerLinkClassName}
                        >
                          {t('resume.builder.removeResidence')}
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    onClick={addResidence} 
                    className={actionLinkClassName}
                  >
                    {t('resume.builder.addResidence')}
                  </button>
                </section>

                {/* Projects Section */}
                <section id="section-projects" className="scroll-mt-44 pb-10 border-t border-gray-200 pt-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    {t('resume.builder.sectionNumberLabel', { number: '06' })}
                  </p>
                  <h3 className="text-xl font-medium text-gray-900 mb-5 tracking-tight">{t('resume.builder.projects')}</h3>
                  {form.projects.map((proj, i) => (
                    <div key={i} className={`mb-4 space-y-4 ${compactCardClassName}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                            {t('resume.builder.projectName')}
                          </label>
                          <input
                            value={proj.projectName}
                            onChange={e => updateProject(i, 'projectName', e.target.value)}
                            placeholder={t('resume.builder.projectNamePlaceholder')}
                            className={fieldInputClassName}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                            {t('resume.builder.yourRole')}
                          </label>
                          <input
                            value={proj.role}
                            onChange={e => updateProject(i, 'role', e.target.value)}
                            placeholder={t('resume.builder.yourRolePlaceholder')}
                            className={fieldInputClassName}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                          {t('resume.builder.projectDescription')}
                        </label>
                        <input
                          value={proj.description}
                          onChange={e => updateProject(i, 'description', e.target.value)}
                          placeholder={t('resume.builder.descriptionPlaceholder')}
                          maxLength={100}
                          className={fieldInputClassName}
                        />
                      </div>
                      {form.projects.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeProject(i)} 
                          className={dangerLinkClassName}
                        >
                          {t('resume.builder.removeProject')}
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={addProject} 
                    className={actionLinkClassName}
                  >
                    {t('resume.builder.addProject')}
                  </button>
                </section>

                {/* Education Section */}
                <section id="section-education" className="scroll-mt-44 pb-10 border-t border-gray-200 pt-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    {t('resume.builder.sectionNumberLabel', { number: '07' })}
                  </p>
                  <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-medium text-gray-900 tracking-tight">{t('resume.builder.education')}</h3>
                    <span className="text-sm text-gray-500">
                                              {t('resume.builder.educationEntries', { count: form.education.length })}
                    </span>
                  </div>
                  
                  {form.education.length === 0 ? (
                    <div className="mfj-vv-card border-dashed px-4 py-6 text-center">
                      <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <h4 className="mt-2 text-sm font-medium text-gray-900">{t('resume.builder.noEducationTitle')}</h4>
                      <p className="mt-1 text-sm text-gray-500">{t('resume.builder.noEducationDescription')}</p>
                      <button
                        type="button"
                        onClick={addEducation}
                        className={`${primaryButtonClassName} mt-3 w-full px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:w-auto sm:py-1.5`}
                      >
                        <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {t('resume.builder.addEducation')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {form.education.map((edu, i) => (
                        <div 
                          key={i} 
                          className="mfj-vv-card transition-colors"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {t('resume.builder.institution')}
                              </label>
                              <input
                                value={edu.institution}
                                onChange={e => updateEducation(i, 'institution', e.target.value)}
                                placeholder={t('resume.builder.institutionPlaceholder')}
                                className={compactFieldInputClassName}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {t('resume.builder.degree')}
                              </label>
                              <input
                                value={edu.degree || ''}
                                onChange={e => updateEducation(i, 'degree', e.target.value)}
                                placeholder={t('resume.builder.degreePlaceholder')}
                                className={compactFieldInputClassName}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {t('resume.builder.fieldOfStudy')}
                              </label>
                              <input
                                value={edu.fieldOfStudy || ''}
                                onChange={e => updateEducation(i, 'fieldOfStudy', e.target.value)}
                                placeholder={t('resume.builder.fieldOfStudyPlaceholder')}
                                className={compactFieldInputClassName}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {t('resume.builder.startYear')}
                              </label>
                              <input
                                type="number"
                                value={edu.startDate || ''}
                                onChange={e => updateEducation(i, 'startDate', e.target.value)}
                                placeholder={t('resume.builder.startYearPlaceholder')}
                                min="1900"
                                max={new Date().getFullYear()}
                                className={compactFieldInputClassName}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {edu.isCurrent ? t('resume.builder.expectedGraduation') : t('resume.builder.endYear')}
                              </label>
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                                <input
                                  type="number"
                                  value={edu.isCurrent ? '' : (edu.endDate || '')}
                                  onChange={e => updateEducation(i, 'endDate', e.target.value)}
                                  disabled={edu.isCurrent}
                                  placeholder={edu.isCurrent ? t('resume.labels.present') : t('resume.builder.endYearPlaceholder')}
                                  min={edu.startDate || '1900'}
                                  max={new Date().getFullYear() + 10}
                                  className={`${compactFieldInputClassName} sm:flex-1`}
                                />
                                <label className="flex items-center justify-center rounded-xl border border-white/80 bg-white/75 px-3 py-2 text-xs text-gray-700 sm:justify-start">
                                  <input
                                    type="checkbox"
                                    checked={!!edu.isCurrent}
                                    onChange={e => updateEducation(i, 'isCurrent', e.target.checked)}
                                    className="h-3.5 w-3.5 text-cyan-700 focus:ring-cyan-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-1.5">{t('resume.builder.current')}</span>
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeEducation(i)}
                              className={`${dangerLinkClassName} w-full px-2.5 py-2 text-xs sm:w-auto sm:py-1`}
                            >
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              {t('common.remove')}
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={addEducation}
                          className={`${primaryButtonClassName} w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:w-auto sm:py-1.5`}
                        >
                          <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          {t('resume.builder.addAnotherEducation')}
                        </button>
                      </div>
                    </div>
                  )}
                </section>

                {/* Profile Picture Section */}
                <div className="mb-8">
                  <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                    {t('resume.builder.profilePicture')}
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfileImageChange}
                    className={fieldInputClassName}
                  />
                  {form.profileImageUrl && (
                    <div className="mt-4 flex flex-col gap-2">
                      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                        {!form.profileImageUrl.startsWith('blob:') ? (
                          <img src={form.profileImageUrl} className="h-20 w-20 rounded-full object-cover border-2 border-gray-200" />
                        ) : (
                          <div className="text-xs text-red-500">{t('resume.builder.imagePreviewOnly')}</div>
                        )}
                        <button 
                          onClick={() => {
                            setForm(f => ({ ...f, profileImageUrl: '' }));
                            setPhotoConflict({hasConflict: false, conflictUsers: []});
                          }} 
                          className={dangerLinkClassName} 
                          type="button"
                        >
                          {t('common.remove')}
                        </button>
                      </div>
                      
                      {/* Photo Conflict Warning */}
                      {photoConflict.hasConflict && (
                        <div className="mfj-vv-card mt-2 text-xs text-amber-700">
                          <strong>{t('resume.builder.photoConflictTitle')}</strong>{' '}
                          {t('resume.builder.photoConflictDescription', { users: photoConflict.conflictUsers.join(', ') })}
                        </div>
                      )}
                      
                      <div className="mfj-vv-card mfj-vv-card-accent mt-2 text-xs text-cyan-800">
                        <strong>{t('resume.builder.reminderTitle')}</strong>{' '}
                        {t('resume.builder.profileImageSaveReminder')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Info Section */}
                <section id="section-contact" className="scroll-mt-44 pb-10 border-t border-gray-200 pt-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    {t('resume.builder.sectionNumberLabel', { number: '08' })}
                  </p>
                  <h3 className="text-xl font-medium text-gray-900 mb-5 tracking-tight">{t('resume.builder.contactInformationOptional')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email with Privacy Toggle */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                        {t('resume.builder.email')}
                      </label>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                        <input
                          type="email"
                          placeholder={t('resume.builder.emailPlaceholder')}
                          value={form.contactInfo?.email || ''}
                          onChange={e =>
                            setForm(f => ({ ...f, contactInfo: { ...(f.contactInfo || {}), email: e.target.value } }))
                          }
                          className={`${fieldInputClassName} flex-1`}
                        />
                        <button
                          type="button"
                          onClick={() => setForm(f => ({
                            ...f,
                            contactInfo: {
                              ...(f.contactInfo || {}),
                              emailPrivate: !(f.contactInfo?.emailPrivate)
                            }
                          }))}
                          className={`${iconButtonClassName} self-start sm:mt-[4px] sm:shrink-0`}
                          title={form.contactInfo?.emailPrivate ? t('resume.builder.emailPrivateTitle') : t('resume.builder.emailPublicTitle')}
                        >
                          {form.contactInfo?.emailPrivate ? (
                            <EyeOff className="w-5 h-5 text-gray-600" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                      <p className="flex items-start gap-1 text-xs text-gray-500">
                        {form.contactInfo?.emailPrivate ? (
                          <>
                            <EyeOff className="mt-0.5 h-3 w-3 shrink-0" />
                            <span>{t('resume.builder.privateContactHint')}</span>
                          </>
                        ) : (
                          <>
                            <Eye className="mt-0.5 h-3 w-3 shrink-0" />
                            <span>{t('resume.builder.publicContactHint')}</span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Phone with Privacy Toggle */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                        {t('resume.builder.phone')}
                      </label>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                        <input
                          type="tel"
                          placeholder={t('resume.builder.phonePlaceholder')}
                          value={form.contactInfo?.phone || ''}
                          onChange={e =>
                            setForm(f => ({ ...f, contactInfo: { ...(f.contactInfo || {}), phone: e.target.value } }))
                          }
                          className={`${fieldInputClassName} flex-1`}
                        />
                        <button
                          type="button"
                          onClick={() => setForm(f => ({
                            ...f,
                            contactInfo: {
                              ...(f.contactInfo || {}),
                              phonePrivate: !(f.contactInfo?.phonePrivate)
                            }
                          }))}
                          className={`${iconButtonClassName} self-start sm:mt-[4px] sm:shrink-0`}
                          title={form.contactInfo?.phonePrivate ? t('resume.builder.phonePrivateTitle') : t('resume.builder.phonePublicTitle')}
                        >
                          {form.contactInfo?.phonePrivate ? (
                            <EyeOff className="w-5 h-5 text-gray-600" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                      <p className="flex items-start gap-1 text-xs text-gray-500">
                        {form.contactInfo?.phonePrivate ? (
                          <>
                            <EyeOff className="mt-0.5 h-3 w-3 shrink-0" />
                            <span>{t('resume.builder.privateContactHint')}</span>
                          </>
                        ) : (
                          <>
                            <Eye className="mt-0.5 h-3 w-3 shrink-0" />
                            <span>{t('resume.builder.publicContactHint')}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                        {t('resume.builder.website')}
                      </label>
                      <input
                        type="url"
                        placeholder={t('resume.builder.websitePlaceholder')}
                        value={form.contactInfo?.website || ''}
                        onChange={e =>
                          setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, website: e.target.value } }))
                        }
                        className={fieldInputClassName}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                        {t('resume.builder.instagram')}
                      </label>
                      <input
                        type="text"
                        placeholder={t('resume.builder.instagramPlaceholder')}
                        value={form.contactInfo?.instagram || ''}
                        onChange={e =>
                          setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, instagram: e.target.value } }))
                        }
                        className={fieldInputClassName}
                      />
                    </div>
                  </div>
                </section>

                {/* Other Info Section */}
                <div className="mb-8">
                  <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                    {t('resume.builder.otherRelevantInformation')}
                  </label>
                  <textarea
                    placeholder={t('resume.builder.otherRelevantInformationPlaceholder')}
                    value={form.otherInfo || ''}
                    onChange={e =>
                      setForm(f => ({ ...f, otherInfo: e.target.value }))
                    }
                    rows={4}
                    className={`${fieldInputClassName} resize-none`}
                  />
                </div>

                {/* Publish & Visibility Section */}
                <section id="section-publish" className="scroll-mt-44 pb-10 border-t border-gray-200 pt-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">
                    {t('resume.builder.sectionNumberLabel', { number: '09' })}
                  </p>
                  <h3 className="text-xl font-medium text-gray-900 mb-5 tracking-tight">{t('resume.builder.publishVisibility')}</h3>

                  <div className="space-y-8">
                    {/* Publish Toggle */}
                    <div className="mfj-vv-card">
                      <div className="mb-3 flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="publish-toggle"
                          checked={isPublished}
                          onChange={(e) => setIsPublished(e.target.checked)}
                          className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 bg-white text-gray-600 focus:ring-2 focus:ring-gray-500"
                        />
                        <label htmlFor="publish-toggle" className="font-medium text-gray-900">
                          {t('resume.builder.publishResumePublicly')}
                        </label>
                      </div>
                      {isPublished ? (
                        <div className="text-sm text-green-600">
                          {t('resume.builder.publishedHint')}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          {t('resume.builder.privateHint')}
                        </div>
                      )}
                      {isPublished && (
                        <p className="text-yellow-600 text-sm mt-2">
                          {t('resume.builder.publishedWarning')}
                        </p>
                      )}
                    </div>

                    {/* Availability Status */}
                    <div className="mfj-vv-card">
                      <h4 className="font-medium text-gray-900 mb-4">{t('resume.builder.availabilityStatus')}</h4>
                      <div className="space-y-3">
                        <label className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="availability"
                            value="available"
                            checked={form.availability === 'available'}
                            onChange={(e) => setForm(f => ({ ...f, availability: e.target.value as 'available' | 'unavailable' | 'soon' }))}
                            className="mt-0.5 h-4 w-4 shrink-0 border-gray-300 bg-white text-green-600 focus:ring-2 focus:ring-green-500"
                          />
                          <span className="font-medium text-green-700">{t('resume.builder.availableForWork')}</span>
                        </label>
                        <label className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="availability"
                            value="soon"
                            checked={form.availability === 'soon'}
                            onChange={(e) => setForm(f => ({ ...f, availability: e.target.value as 'available' | 'unavailable' | 'soon' }))}
                            className="mt-0.5 h-4 w-4 shrink-0 border-gray-300 bg-white text-yellow-600 focus:ring-2 focus:ring-yellow-500"
                          />
                          <span className="font-medium text-yellow-700">{t('resume.builder.availableSoon')}</span>
                        </label>
                        <label className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="availability"
                            value="unavailable"
                            checked={form.availability === 'unavailable'}
                            onChange={(e) => setForm(f => ({ ...f, availability: e.target.value as 'available' | 'unavailable' | 'soon' }))}
                            className="mt-0.5 h-4 w-4 shrink-0 border-gray-300 bg-white text-red-600 focus:ring-2 focus:ring-red-500"
                          />
                          <span className="font-medium text-red-700">{t('resume.builder.currentlyUnavailable')}</span>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        {t('resume.builder.availabilityHelp')}
                      </p>
                    </div>

                    {/* Share Resume */}
                    {isPublished && user && (
                      <div className="mfj-vv-card mfj-vv-card-accent">
                        <h4 className="font-medium text-cyan-900 mb-3">{t('resume.builder.shareResume')}</h4>
                        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                          <input
                            type="text"
                            value={`${window.location.origin}/resume/${user.uid}`}
                            readOnly
                            className={`${compactFieldInputClassName} text-gray-600 sm:flex-1`}
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/resume/${user.uid}`);
                              setMessage(t('resume.builder.linkCopied'));
                              setTimeout(() => setMessage(null), 3000);
                            }}
                            className={`${primaryButtonClassName} w-full px-4 py-3 text-sm sm:w-auto`}
                          >
                            {t('resume.builder.copyLink')}
                          </button>
                        </div>
                        <p className="text-xs text-cyan-800">
                          {t('resume.builder.shareDescription')}
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Save Button */}
                <button 
                  onClick={handleSave} 
                  disabled={saving} 
                  className={`${primaryButtonClassName} w-full py-4 text-base`}
                >
                  {saving ? t('resume.builder.loading') : t('resume.builder.save')}
                </button>
                
                {message && (
                  <p className={`text-center mt-4 font-medium ${saveStatus === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message}</p>
                )}

                {/* Resume Preview */}
                <hr className="my-8 border-gray-200" />
                <h3 className="text-xl font-light text-gray-900 mb-6 tracking-wide">{t('resume.builder.resumePreview')}</h3>
                <div className="mfj-vv-preview-shell -mx-4 overflow-x-auto px-4 py-3 sm:mx-0 sm:rounded-2xl">
                  <div ref={resumeRef} className="resume-preview-wrapper">
                    <ResumeView 
                      profile={{
                        ...form,
                        projects: form.projects?.map(project => ({
                          projectName: project.projectName,
                          role: project.role,
                          description: project.description || '' // Ensure description is always a string
                        }))
                      }}
                      isOwnResume={true}
                    />
                  </div>
                </div>
                <ResumeDownloadButton
                  resumeUrl="#"
                  fileName={`${form.name.replace(/\s+/g, '_')}_Resume.pdf`}
                  className={`${primaryButtonClassName} mt-6 w-full px-6 py-3 text-center sm:w-auto`}
                  variant="primary"
                  size="large"
                  onCustomDownload={handleDownloadPDF}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCrewProfile;
