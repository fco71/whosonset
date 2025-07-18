"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[360],{

/***/ 3542:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ components_ResumeView)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
;// ./src/hooks/useBlobUrl.ts

/**
 * A custom hook to manage blob URLs and ensure they're properly revoked when no longer needed.
 * @param blob The Blob or MediaSource to create a URL for, or null/undefined
 * @returns The blob URL as a string, or null if no blob was provided
 */
const useBlobUrl = (blob) => {
    const [blobUrl, setBlobUrl] = (0,react.useState)(null);
    (0,react.useEffect)(() => {
        // If no blob is provided, clear any existing URL and return
        if (!blob) {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
                setBlobUrl(null);
            }
            return;
        }
        // Create a new blob URL
        const newBlobUrl = URL.createObjectURL(blob);
        setBlobUrl(newBlobUrl);
        // Cleanup function to revoke the blob URL when the component unmounts or the blob changes
        return () => {
            if (newBlobUrl) {
                URL.revokeObjectURL(newBlobUrl);
                // Only reset the state if this is still the current URL
                setBlobUrl(prevUrl => prevUrl === newBlobUrl ? null : prevUrl);
            }
        };
    }, [blob]);
    return blobUrl;
};
/**
 * A custom hook to manage a blob URL from a string URL.
 * This is useful when you might have either a regular URL or a blob URL.
 * @param url The URL string (can be a regular URL or a blob URL)
 * @returns The URL as a string, or null if no URL was provided
 */
const useManagedUrl = (url) => {
    const [isBlobUrl, setIsBlobUrl] = (0,react.useState)(false);
    const [blob, setBlob] = (0,react.useState)(null);
    const blobUrl = useBlobUrl(blob);
    (0,react.useEffect)(() => {
        // Reset state when URL changes
        setIsBlobUrl(false);
        setBlob(null);
        // If no URL or not a blob URL, we're done
        if (!url || !url.startsWith('blob:')) {
            return;
        }
        // If it's a blob URL, we need to fetch the blob
        const fetchBlob = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.error('Failed to fetch blob:', response.statusText);
                    return;
                }
                const blobData = await response.blob();
                setBlob(blobData);
                setIsBlobUrl(true);
            }
            catch (error) {
                console.error('Error fetching blob:', error);
            }
        };
        fetchBlob();
    }, [url]);
    // Return the managed blob URL if we have one, otherwise return the original URL
    return isBlobUrl && blobUrl ? blobUrl : url || null;
};

;// ./src/components/ResumeView.tsx


// Import html2pdf using require to bypass TypeScript issues
const html2pdf = __webpack_require__(3833);
const ResumeView = (props) => {
    const { profile } = props;
    // Fallback: use photoURL if profileImageUrl is missing
    const managedProfileImageUrl = useManagedUrl(profile?.profileImageUrl || profile?.photoURL);
    const containerStyle = {
        width: '210mm',
        height: '297mm',
        maxWidth: '8.5in',
        maxHeight: '11in',
        margin: '0 auto',
        background: 'white',
        color: 'black',
        fontFamily: "'Times New Roman', serif",
        fontSize: '11pt',
        lineHeight: 1.3,
        padding: '15mm',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        position: 'relative',
    };
    const headerStyle = {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10mm',
        marginBottom: '6mm',
        borderBottom: '2pt solid #333',
        paddingBottom: '3mm',
    };
    const profileImageStyle = {
        width: '30mm',
        height: '40mm',
        borderRadius: '3mm',
        objectFit: 'cover',
        border: '1pt solid #ccc',
        flexShrink: 0,
    };
    const nameStyle = {
        fontSize: '22pt',
        fontWeight: 'bold',
        margin: 0,
        color: '#333',
    };
    const bioStyle = {
        fontSize: '11pt',
        color: '#666',
        margin: '2mm 0 0 0',
        fontStyle: 'italic',
        maxHeight: '40px', // About 2 lines at 11pt
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        whiteSpace: 'normal',
    };
    const sectionStyle = {
        marginBottom: '5mm',
    };
    const sectionTitleStyle = {
        fontSize: '13pt',
        fontWeight: 'bold',
        color: '#333',
        borderBottom: '1pt solid #333',
        paddingBottom: '3mm',
        marginBottom: '5mm',
        textTransform: 'uppercase',
        letterSpacing: '0.5pt',
    };
    const jobTitlesListStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    };
    const jobTitleItemStyle = {
        marginBottom: '1mm',
        fontSize: '10pt',
    };
    const projectsListStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    };
    const projectItemStyle = {
        marginBottom: '2mm',
        fontSize: '10pt',
    };
    const projectNameStyle = {
        fontWeight: 'bold',
        color: '#333',
    };
    const projectRoleStyle = {
        color: '#666',
    };
    const projectDescriptionStyle = {
        color: '#666',
        fontStyle: 'italic',
    };
    const contactListStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2mm',
    };
    const contactItemStyle = {
        fontSize: '10pt',
        color: '#333',
    };
    const otherInfoStyle = {
        fontSize: '10pt',
        color: '#333',
        whiteSpace: 'pre-wrap',
        lineHeight: 1.3,
    };
    const contentWrapperStyle = {
        height: 'calc(297mm - 30mm)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    };
    const scrollableContentStyle = {
        flex: 1,
        overflowY: 'auto',
    };
    return ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)("style", { children: `
          @media print {
            .resume-container {
              width: 210mm !important;
              height: 297mm !important;
              margin: 0 !important;
              padding: 12mm !important;
              box-shadow: none !important;
              page-break-after: avoid;
              page-break-inside: avoid;
              break-inside: avoid;
              font-size: 11pt !important;
              line-height: 1.3 !important;
            }
            
            .resume-container img {
              max-width: 30mm !important;
              max-height: 40mm !important;
              object-fit: cover !important;
            }
            
            .resume-container h1 {
              font-size: 22pt !important;
            }
            
            .resume-container h2 {
              font-size: 13pt !important;
              padding-bottom: 3mm !important;
              margin-bottom: 5mm !important;
              border-bottom: 1pt solid #333 !important;
            }
            
            .resume-container p, .resume-container li {
              font-size: 10pt !important;
              margin-bottom: 1mm !important;
            }
            
            @page {
              size: A4;
              margin: 0;
            }
          }
          
          @media screen and (max-width: 210mm) {
            .resume-container {
              width: 100% !important;
              max-width: 210mm !important;
              height: auto !important;
              min-height: 297mm !important;
            }
          }
        ` }), (0,jsx_runtime.jsx)("div", { className: "resume-container", style: containerStyle, children: (0,jsx_runtime.jsx)("div", { style: contentWrapperStyle, children: (0,jsx_runtime.jsxs)("div", { style: scrollableContentStyle, children: [(0,jsx_runtime.jsxs)("div", { style: headerStyle, children: [managedProfileImageUrl && ((0,jsx_runtime.jsx)("img", { src: managedProfileImageUrl, alt: "Profile", style: profileImageStyle, crossOrigin: "anonymous", onError: (e) => {
                                            // Fallback to empty image if the URL is invalid
                                            const target = e.target;
                                            target.style.display = 'none';
                                        } })), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h1", { style: nameStyle, children: profile.name }), profile.bio && ((0,jsx_runtime.jsx)("p", { style: bioStyle, children: profile.bio }))] })] }), profile.languages && profile.languages.length > 0 && ((0,jsx_runtime.jsxs)("section", { style: sectionStyle, children: [(0,jsx_runtime.jsx)("div", { style: sectionTitleStyle, children: "Languages" }), (0,jsx_runtime.jsx)("ul", { style: jobTitlesListStyle, children: profile.languages.slice(0, 3).map((lang, idx) => ((0,jsx_runtime.jsx)("li", { style: jobTitleItemStyle, children: lang }, idx))) })] })), (0,jsx_runtime.jsxs)("div", { style: sectionStyle, children: [(0,jsx_runtime.jsx)("h2", { style: sectionTitleStyle, children: "Professional Experience" }), (0,jsx_runtime.jsx)("ul", { style: jobTitlesListStyle, children: profile.jobTitles
                                            .filter(jt => jt.department && jt.title)
                                            .slice(0, 4)
                                            .map((jt, i) => ((0,jsx_runtime.jsxs)("li", { style: jobTitleItemStyle, children: [(0,jsx_runtime.jsx)("strong", { children: jt.title }), " \u2014 ", jt.department] }, i))) }), profile.jobTitles.filter(jt => jt.department && jt.title).length > 4 && ((0,jsx_runtime.jsx)("p", { style: { fontSize: '9pt', color: '#666', fontStyle: 'italic', margin: '1mm 0 0 0' }, children: "(Showing top 4 positions - prioritize most relevant first)" }))] }), profile.projects && profile.projects.filter(p => p.projectName && p.role).length > 0 && ((0,jsx_runtime.jsxs)("div", { style: sectionStyle, children: [(0,jsx_runtime.jsx)("h2", { style: sectionTitleStyle, children: "Selected Projects" }), (0,jsx_runtime.jsx)("ul", { style: projectsListStyle, children: profile.projects
                                            .filter(p => p.projectName && p.role)
                                            .slice(0, 3)
                                            .map((p, i) => ((0,jsx_runtime.jsxs)("li", { style: projectItemStyle, children: [(0,jsx_runtime.jsx)("span", { style: projectNameStyle, children: p.projectName }), (0,jsx_runtime.jsxs)("span", { style: projectRoleStyle, children: [" \u2014 ", p.role] }), p.description && ((0,jsx_runtime.jsxs)("span", { style: projectDescriptionStyle, children: [": ", p.description] }))] }, i))) }), profile.projects.filter(p => p.projectName && p.role).length > 3 && ((0,jsx_runtime.jsx)("p", { style: { fontSize: '9pt', color: '#666', fontStyle: 'italic', margin: '1mm 0 0 0' }, children: "(Showing top 3 projects - prioritize most relevant first)" }))] })), profile.education && profile.education.length > 0 && ((0,jsx_runtime.jsxs)("div", { style: sectionStyle, children: [(0,jsx_runtime.jsx)("h2", { style: sectionTitleStyle, children: "Education" }), (0,jsx_runtime.jsx)("ul", { style: jobTitlesListStyle, children: profile.education
                                            .filter(edu => {
                                            // Handle both string and object formats
                                            if (typeof edu === 'string')
                                                return edu.trim() !== '';
                                            // Only show if there's at least one piece of information
                                            return edu.institution || edu.degree || edu.fieldOfStudy || edu.endDate || edu.isCurrent;
                                        })
                                            .slice(0, 2)
                                            .map((edu, i) => {
                                            // Handle string format (legacy)
                                            if (typeof edu === 'string') {
                                                return ((0,jsx_runtime.jsx)("li", { style: { ...jobTitleItemStyle, marginBottom: '4mm' }, children: (0,jsx_runtime.jsx)("div", { style: { color: '#444' }, children: edu }) }, i));
                                            }
                                            // Handle new structured format
                                            const dateInfo = [];
                                            // Only show end date or current status
                                            if (edu.isCurrent) {
                                                dateInfo.push('Present');
                                            }
                                            else if (edu.endDate) {
                                                const endDate = new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric' });
                                                dateInfo.push(endDate);
                                            }
                                            // Build the title line (bold) - only show degree in bold
                                            const titleParts = [
                                                edu.degree
                                            ].filter(Boolean);
                                            // Build the subtitle line (regular) - include field of study, institution, place, and dates
                                            const subtitleParts = [
                                                edu.fieldOfStudy,
                                                edu.institution,
                                                edu.place,
                                                dateInfo.length > 0 ? dateInfo.join(', ') : null
                                            ].filter(Boolean);
                                            return ((0,jsx_runtime.jsxs)("li", { style: { ...jobTitleItemStyle, marginBottom: '4mm' }, children: [titleParts.length > 0 && ((0,jsx_runtime.jsx)("div", { style: { fontWeight: 'bold', color: '#333' }, children: titleParts.join('') })), subtitleParts.length > 0 && ((0,jsx_runtime.jsx)("div", { style: { color: '#555' }, children: subtitleParts.join(', ') }))] }, i));
                                        }) }), profile.education.length > 2 && ((0,jsx_runtime.jsx)("p", { style: { fontSize: '9pt', color: '#666', fontStyle: 'italic', margin: '1mm 0 0 0' }, children: "(Showing 2 most recent - prioritize most relevant first)" }))] })), (profile.contactInfo?.email || profile.contactInfo?.phone || profile.contactInfo?.website || profile.contactInfo?.instagram) && ((0,jsx_runtime.jsxs)("div", { style: sectionStyle, children: [(0,jsx_runtime.jsx)("h2", { style: sectionTitleStyle, children: "Contact Information" }), (0,jsx_runtime.jsxs)("ul", { style: contactListStyle, children: [profile.contactInfo.email && (0,jsx_runtime.jsxs)("li", { style: contactItemStyle, children: ["\uD83D\uDCE7 ", profile.contactInfo.email] }), profile.contactInfo.phone && (0,jsx_runtime.jsxs)("li", { style: contactItemStyle, children: ["\uD83D\uDCDE ", profile.contactInfo.phone] }), profile.contactInfo.website && (0,jsx_runtime.jsxs)("li", { style: contactItemStyle, children: ["\uD83C\uDF10 ", profile.contactInfo.website] }), profile.contactInfo.instagram && (0,jsx_runtime.jsxs)("li", { style: contactItemStyle, children: ["\uD83D\uDCF7 @", profile.contactInfo.instagram] })] })] })), profile.otherInfo && ((0,jsx_runtime.jsxs)("div", { style: sectionStyle, children: [(0,jsx_runtime.jsx)("h2", { style: sectionTitleStyle, children: "Additional Information" }), (0,jsx_runtime.jsx)("p", { style: otherInfoStyle, children: profile.otherInfo })] }))] }) }) })] }));
};
/* harmony default export */ const components_ResumeView = (ResumeView);


/***/ }),

/***/ 7360:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ components_EditCrewProfile)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/firebase/auth/dist/esm/index.esm.js + 2 modules
var index_esm = __webpack_require__(474);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var esm_index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./node_modules/firebase/storage/dist/esm/index.esm.js + 1 modules
var dist_esm_index_esm = __webpack_require__(2539);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./src/components/ResumeView.tsx + 1 modules
var ResumeView = __webpack_require__(3542);
;// ./src/components/LocationSelector.tsx




const LocationSelector = ({ selectedCountry, selectedCity, onCountryChange, onCityChange, placeholder = "Select location..." }) => {
    const [countries, setCountries] = (0,react.useState)([]);
    const [loading, setLoading] = (0,react.useState)(true);
    (0,react.useEffect)(() => {
        const fetchCountries = async () => {
            setLoading(true);
            try {
                const countriesSnapshot = await (0,esm_index_esm/* getDocs */.GG)((0,esm_index_esm/* collection */.rJ)(firebase.db, 'countries'));
                setCountries(countriesSnapshot.docs.map(doc => doc.data()));
            }
            catch (error) {
                console.error('Error fetching countries:', error);
                setCountries([]);
            }
            setLoading(false);
        };
        fetchCountries();
    }, []);
    // Find the selected country object
    const selectedCountryObj = countries.find(c => c.name === selectedCountry);
    const cityOptions = selectedCountryObj?.cities || [];
    return ((0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsxs)("select", { className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed", value: selectedCountry, onChange: e => onCountryChange(e.target.value), disabled: loading, children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select Country" }), countries.map(country => ((0,jsx_runtime.jsx)("option", { value: country.name, children: country.name }, country.name)))] }), (0,jsx_runtime.jsxs)("select", { className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed", value: selectedCity, onChange: e => onCityChange(e.target.value), disabled: !selectedCountry || loading, children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select City" }), cityOptions.map(city => ((0,jsx_runtime.jsx)("option", { value: city, children: city }, city)))] })] }));
};
/* harmony default export */ const components_LocationSelector = (LocationSelector);

;// ./src/components/EditCrewProfile.tsx


// --- MODIFIED: Added onAuthStateChanged for robust user checking ---




// Simplified default education entry
const getDefaultEducationEntry = () => ({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isCurrent: false
});


// Import html2pdf using require to bypass TypeScript issues
const html2pdf = __webpack_require__(3833);
const fetchJobDepartments = async () => {
    const snapshot = await (0,esm_index_esm/* getDocs */.GG)((0,esm_index_esm/* collection */.rJ)(firebase.db, "jobDepartments"));
    // This map assumes the data shape is correct in Firestore (i.e., has a 'titles' field)
    return snapshot.docs.map((doc) => ({
        name: doc.data().name,
        titles: doc.data().titles || [], // Fallback to empty array if titles is missing
    }));
};
const EditCrewProfile = () => {
    const auth = (0,index_esm/* getAuth */.xI)();
    // --- MODIFIED: Use state to track the user, which is more reliable on load ---
    const [user, setUser] = (0,react.useState)(null);
    // Initialize form with default values that match CrewProfileFormData interface
    const getInitialFormData = () => ({
        name: '',
        bio: '',
        profileImageUrl: '',
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
    const [form, setForm] = (0,react.useState)(getInitialFormData());
    // Helper function to ensure education entries have consistent structure
    const ensureEducationFields = (eduArray = []) => {
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
    const [departments, setDepartments] = (0,react.useState)([]);
    const [countryOptions, setCountryOptions] = (0,react.useState)([]);
    const [loading, setLoading] = (0,react.useState)(false);
    const [message, setMessage] = (0,react.useState)(null);
    const [isPublished, setIsPublished] = (0,react.useState)(true);
    // Clean up any blob URLs when component unmounts
    (0,react.useEffect)(() => {
        return () => {
            // Clean up any blob URLs in the form state
            if (form.profileImageUrl?.startsWith('blob:')) {
                console.log('[ProfileImage] Cleaning up blob URL on unmount:', form.profileImageUrl);
                URL.revokeObjectURL(form.profileImageUrl);
            }
        };
    }, [form.profileImageUrl]);
    // PDF download functionality
    const resumeRef = (0,react.useRef)(null);
    const handleDownloadPDF = () => {
        if (!resumeRef.current)
            return;
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
    (0,react.useEffect)(() => {
        const unsubscribe = (0,index_esm/* onAuthStateChanged */.hg)(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                console.log("DEBUG: Auth state changed. User is logged in:", firebaseUser.uid);
            }
            else {
                setUser(null);
                console.log("DEBUG: Auth state changed. User is logged out.");
            }
        });
        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, [auth]);
    // --- MODIFIED: All data fetching now depends on the 'user' state ---
    // This ensures we don't try to fetch data before we know who the user is.
    (0,react.useEffect)(() => {
        // Don't run if the user isn't logged in yet
        if (!user)
            return;
        console.log("DEBUG: User confirmed. Now loading lookup data...");
        const loadLookups = async () => {
            try {
                // Fetch departments
                const deptData = await fetchJobDepartments();
                // --- THIS IS THE KEY DEBUGGING LINE ---
                console.log("DEBUG: Fetched department data:", deptData);
                setDepartments(deptData);
                // Fetch countries
                const countrySnap = await (0,esm_index_esm/* getDocs */.GG)((0,esm_index_esm/* collection */.rJ)(firebase.db, 'countries'));
                setCountryOptions(countrySnap.docs.map(doc => ({
                    name: doc.data().name,
                    cities: doc.data().cities,
                })));
            }
            catch (error) {
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
                const docRef = (0,esm_index_esm.doc)(firebase.db, 'crewProfiles', user.uid);
                console.log("DEBUG: Document reference created:", docRef.path);
                const docSnap = await (0,esm_index_esm.getDoc)(docRef);
                console.log("DEBUG: Document snapshot retrieved, exists:", docSnap.exists());
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("DEBUG: Profile data loaded:", data);
                    // Migrate old string-based subcategories to new JobTitleEntry format
                    const migratedJobTitles = data.jobTitles?.map((jobTitle) => {
                        if (jobTitle.subcategories && Array.isArray(jobTitle.subcategories)) {
                            // Check if subcategories are strings (old format) or objects (new format)
                            const migratedSubcategories = jobTitle.subcategories.map((sub) => {
                                if (typeof sub === 'string') {
                                    // Convert old string format to new object format
                                    return { department: '', title: sub, subcategories: [] };
                                }
                                else {
                                    // Already in new format, ensure it has the right structure
                                    return {
                                        department: sub.department || '',
                                        title: sub.title || '',
                                        subcategories: sub.subcategories || []
                                    };
                                }
                            });
                            return { ...jobTitle, subcategories: migratedSubcategories };
                        }
                        else {
                            // No subcategories, initialize empty array
                            return { ...jobTitle, subcategories: [] };
                        }
                    }) || [];
                    // Ensure all required fields are present and properly formatted
                    const formData = {
                        // Required fields with defaults
                        name: data.name || '',
                        bio: data.bio || '',
                        profileImageUrl: data.profileImageUrl || '',
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
                    setForm(formData);
                    setIsPublished(data.isPublished || false);
                    console.log("DEBUG: Form state updated with profile data");
                }
                else {
                    console.log("DEBUG: No profile document found for user:", user.uid);
                }
            }
            catch (error) {
                console.error("DEBUG: Error loading profile:", error);
            }
        };
        loadLookups();
        loadProfile();
    }, [user]); // This entire block now runs only when 'user' changes
    // --- Helper function to ensure subcategories are in correct format ---
    const ensureSubcategoriesFormat = (subcategories) => {
        return subcategories.map((sub) => {
            if (typeof sub === 'string') {
                // Convert old string format to new object format
                return { department: '', title: sub, subcategories: [] };
            }
            else {
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
    const getDefaultEducationEntry = () => ({
        institution: '',
        place: '',
        degree: '',
        level: undefined,
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
    const formatDate = (dateString) => {
        if (!dateString)
            return '';
        if (dateString === 'Present')
            return 'Present';
        const [year, month] = dateString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };
    // Validate education entry - simplified for our needs
    const validateEducation = (edu) => {
        const errors = {};
        // No required fields - all are optional
        // Simple year validation if dates are provided
        if (edu.startDate && !/^\d{4}$/.test(edu.startDate)) {
            errors.startDate = 'Please enter a valid year (e.g., 2020)';
        }
        if (!edu.isCurrent && edu.endDate && !/^\d{4}$/.test(edu.endDate)) {
            errors.endDate = 'Please enter a valid year (e.g., 2024)';
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // --- THIS IS THE CORRECTED LINE ---
    const handleProfileImageChange = async (e) => {
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
            const storageRef = (0,dist_esm_index_esm/* ref */.KR)(firebase/* storage */.IG, `profileImages/${user.uid}/${Date.now()}_${file.name}`);
            console.log('[ProfileImage] Starting upload to Firebase Storage...');
            await (0,dist_esm_index_esm/* uploadBytes */.D)(storageRef, file);
            console.log('[ProfileImage] File uploaded successfully');
            // Get the persistent download URL
            const downloadUrl = await (0,dist_esm_index_esm/* getDownloadURL */.qk)(storageRef);
            console.log('[ProfileImage] Got download URL:', downloadUrl);
            // Update the form with the persistent URL
            setForm(f => ({ ...f, profileImageUrl: downloadUrl }));
            // Revoke the temporary blob URL
            URL.revokeObjectURL(blobUrl);
            console.log('[ProfileImage] Revoked temporary blob URL');
        }
        catch (error) {
            console.error('[ProfileImage] Error uploading image:', error);
            // Revert to the previous image URL if there was an error
            setForm(f => ({ ...f, profileImageUrl: '' }));
            // Revoke the blob URL on error
            URL.revokeObjectURL(blobUrl);
            // Show error message to user
            setMessage('Failed to upload image. Please try again.');
        }
    };
    const updateJobEntry = (i, field, value) => {
        setForm(f => {
            const updated = [...f.jobTitles];
            const newEntry = { ...updated[i] };
            if (field === 'department') {
                newEntry.department = value;
                newEntry.title = '';
                newEntry.subcategories = [];
            }
            else if (field === 'title') {
                newEntry.title = value;
                newEntry.subcategories = [];
            }
            else if (field === 'subcategories') {
                // Ensure subcategories are in correct format
                newEntry.subcategories = ensureSubcategoriesFormat(value);
            }
            updated[i] = newEntry;
            return { ...f, jobTitles: updated };
        });
    };
    const addJobEntry = () => setForm(f => ({ ...f, jobTitles: [...f.jobTitles, { department: '', title: '', subcategories: [] }] }));
    const removeJobEntry = (i) => setForm(f => ({ ...f, jobTitles: f.jobTitles.filter((_, idx) => idx !== i) }));
    const updateResidence = (i, key, value) => {
        setForm(f => {
            const rs = [...f.residences];
            rs[i] = { ...rs[i], [key]: value };
            return { ...f, residences: rs };
        });
    };
    const addResidence = () => setForm(f => ({ ...f, residences: [...f.residences, { country: '', city: '' }] }));
    const removeResidence = (i) => setForm(f => ({ ...f, residences: f.residences.filter((_, idx) => idx !== i) }));
    const updateProject = (i, field, value) => {
        setForm(f => {
            const updated = [...f.projects];
            updated[i] = { ...updated[i], [field]: value };
            return { ...f, projects: updated };
        });
    };
    const addProject = () => setForm(f => ({ ...f, projects: [...f.projects, { projectName: '', role: '', description: '' }] }));
    const removeProject = (i) => setForm(f => ({ ...f, projects: f.projects.filter((_, idx) => idx !== i) }));
    const updateEducation = (i, field, value) => {
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
                    level: undefined,
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
    const removeEducation = (i) => setForm(f => ({
        ...f,
        education: f.education.filter((_, idx) => idx !== i)
    }));
    const updateLanguage = (i, value) => {
        setForm(f => {
            const newLangs = [...(f.languages || [])];
            newLangs[i] = value;
            return { ...f, languages: newLangs };
        });
    };
    const addLanguage = () => {
        setForm(f => ({ ...f, languages: [...(f.languages || []), ''] }));
    };
    const removeLanguage = (i) => {
        setForm(f => ({ ...f, languages: (f.languages || []).filter((_, idx) => idx !== i) }));
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!user) {
            console.log("DEBUG: No user found, cannot save");
            return;
        }
        console.log("DEBUG: Starting save process for user:", user.uid);
        console.log("DEBUG: Form data to save:", form);
        setLoading(true);
        try {
            const docRef = (0,esm_index_esm.doc)(firebase.db, 'crewProfiles', user.uid);
            console.log("DEBUG: Saving to document:", docRef.path);
            // Always ensure name and profileImageUrl are set
            const safeName = form.name && form.name.trim() !== '' ? form.name : 'Unknown Crew';
            let safeProfileImageUrl = form.profileImageUrl && form.profileImageUrl.trim() !== '' ? form.profileImageUrl : '/default-avatar.png';
            // Prevent saving blob: URLs
            if (safeProfileImageUrl.startsWith('blob:')) {
                // If the current image is a blob, fallback to previous or default
                safeProfileImageUrl = '/default-avatar.png';
            }
            // Ensure email is included in the saved data
            const dataToSave = {
                ...form,
                name: safeName,
                profileImageUrl: safeProfileImageUrl,
                uid: user.uid,
                email: user.email || form.contactInfo?.email || '', // Use auth email as primary, fallback to contact info
                contactInfo: {
                    ...form.contactInfo,
                    email: user.email || form.contactInfo?.email || '', // Ensure email is in contact info
                },
                languages: form.languages || [],
                isPublished, // Save publish state
                updatedAt: new Date()
            };
            await (0,esm_index_esm/* setDoc */.BN)(docRef, dataToSave, { merge: true });
            console.log("DEBUG: Save successful!");
            setMessage('Profile saved!');
        }
        catch (error) { // Added error logging
            console.error("DEBUG: Save failed with error:", error);
            setMessage('Failed to save.');
        }
        finally {
            setLoading(false);
        }
    };
    // --- JSX / HTML (no changes) ---
    return ((0,jsx_runtime.jsxs)("div", { className: "flex flex-col items-center min-h-screen bg-gray-100 pt-10", children: [(0,jsx_runtime.jsx)("div", { className: "w-full max-w-6xl mb-4 px-4", children: (0,jsx_runtime.jsxs)("div", { className: "resume-builder-banner bg-white bg-opacity-95 shadow-md rounded-xl p-3 flex flex-col items-center text-center", children: [(0,jsx_runtime.jsx)("h1", { className: "text-xl font-medium text-gray-800 tracking-wide mb-1", children: "Resume Builder" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 text-sm leading-snug", children: "Easily create, update, and download your professional film industry resume. Showcase your experience, skills, and projects to producers and collaborators." })] }) }), (0,jsx_runtime.jsx)("div", { className: "w-full max-w-6xl px-4", children: (0,jsx_runtime.jsxs)("div", { className: "bg-white", children: [(0,jsx_runtime.jsx)("div", { className: "bg-gradient-to-br from-gray-50 to-white border-b border-gray-100", children: (0,jsx_runtime.jsx)("div", { className: "max-w-6xl mx-auto px-4 py-8", children: (0,jsx_runtime.jsxs)("div", { className: "text-center mb-6 animate-fade-in", children: [(0,jsx_runtime.jsx)("h1", { className: "text-3xl font-light text-gray-900 mb-2 tracking-tight animate-slide-up", children: "Edit" }), (0,jsx_runtime.jsx)("h2", { className: "text-xl font-light text-gray-600 mb-3 tracking-wide animate-slide-up-delay", children: "Crew Profile" }), (0,jsx_runtime.jsx)("p", { className: "text-base font-light text-gray-500 max-w-xl mx-auto leading-normal animate-slide-up-delay-2", children: "Update your professional information and showcase your experience. Keep your profile current to attract the best opportunities." })] }) }) }), (0,jsx_runtime.jsx)("div", { className: "bg-gray-50", children: (0,jsx_runtime.jsx)("div", { className: "max-w-6xl mx-auto px-8 py-16", children: (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm p-8 animate-fade-in", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-8", children: [(0,jsx_runtime.jsx)("h3", { className: "text-2xl font-light text-gray-900 tracking-wide", children: "Profile Information" }), (0,jsx_runtime.jsx)("div", { className: `px-4 py-2 rounded-full text-sm font-medium tracking-wider ${isPublished
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-600'}`, children: isPublished ? '🌐 Published' : '🔒 Private' })] }), (0,jsx_runtime.jsxs)("div", { className: "space-y-6 mb-8", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider", children: "Full Name" }), (0,jsx_runtime.jsx)("input", { name: "name", value: form.name, onChange: handleChange, placeholder: "Enter your full name", className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider", children: "Bio" }), (0,jsx_runtime.jsx)("textarea", { name: "bio", value: form.bio, onChange: handleChange, placeholder: "Tell us about yourself and your experience", rows: 4, className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] resize-none" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-light text-gray-900 mb-4 tracking-wide", children: "Job Titles" }), form.jobTitles.map((entry, i) => ((0,jsx_runtime.jsxs)("div", { className: "mb-6 p-6 bg-gray-50 rounded-lg space-y-4", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider", children: "Department" }), (0,jsx_runtime.jsxs)("select", { value: entry.department, onChange: e => updateJobEntry(i, 'department', e.target.value), className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select Department" }), departments.map(d => ((0,jsx_runtime.jsx)("option", { value: d.name, children: d.name }, d.name))), (0,jsx_runtime.jsx)("option", { value: "Other", children: "Other" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider", children: "Job Title" }), entry.department === 'Other' ? ((0,jsx_runtime.jsx)("input", { value: entry.title, onChange: e => updateJobEntry(i, 'title', e.target.value), placeholder: "Enter job title", className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]" })) : ((0,jsx_runtime.jsxs)("select", { value: entry.title, onChange: e => updateJobEntry(i, 'title', e.target.value), className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]", disabled: !entry.department, children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select Job Title" }), departments.find(d => d.name === entry.department)?.titles.map(title => ((0,jsx_runtime.jsx)("option", { value: title, children: title }, title)))] }))] })] }), form.jobTitles.length > 1 && ((0,jsx_runtime.jsx)("button", { type: "button", onClick: () => removeJobEntry(i), className: "text-red-600 hover:text-red-700 text-sm font-medium transition-colors", children: "Remove Job Title" })), entry.title && ((0,jsx_runtime.jsx)("div", { className: "ml-4 space-y-4 border-l-2 border-gray-200 pl-4", children: entry.subcategories?.map((sub, idx) => ((0,jsx_runtime.jsx)("div", { className: "space-y-3", children: (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider", children: "Additional Department" }), (0,jsx_runtime.jsxs)("select", { value: sub.department || '', onChange: (e) => {
                                                                                        const newSubs = [...(entry.subcategories || [])];
                                                                                        newSubs[idx] = {
                                                                                            department: e.target.value,
                                                                                            title: '',
                                                                                            subcategories: []
                                                                                        };
                                                                                        updateJobEntry(i, 'subcategories', newSubs);
                                                                                    }, className: "w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select Department" }), departments.map(dept => ((0,jsx_runtime.jsx)("option", { value: dept.name, children: dept.name }, dept.name))), (0,jsx_runtime.jsx)("option", { value: "Other", children: "Other" })] })] }), sub.department && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider", children: "Additional Job Title" }), sub.department === 'Other' ? ((0,jsx_runtime.jsx)("input", { type: "text", value: sub.title, onChange: (e) => {
                                                                                        const newSubs = [...(entry.subcategories || [])];
                                                                                        newSubs[idx] = { ...sub, title: e.target.value };
                                                                                        updateJobEntry(i, 'subcategories', newSubs);
                                                                                    }, placeholder: "Enter job title", className: "w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm" })) : ((0,jsx_runtime.jsxs)("select", { value: sub.title, onChange: (e) => {
                                                                                        const newSubs = [...(entry.subcategories || [])];
                                                                                        newSubs[idx] = { ...sub, title: e.target.value };
                                                                                        updateJobEntry(i, 'subcategories', newSubs);
                                                                                    }, className: "w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select Job Title" }), departments
                                                                                            .find(d => d.name === sub.department)
                                                                                            ?.titles.map(title => ((0,jsx_runtime.jsx)("option", { value: title, className: "truncate", children: title }, title)))] }))] }))] }) }, idx))) }))] }, i))), (0,jsx_runtime.jsx)("button", { type: "button", onClick: addJobEntry, className: "text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors", children: "+ Add Job Title" })] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-light text-gray-900 mb-4 tracking-wide", children: "Languages (up to 3, optional)" }), (form.languages || []).map((lang, idx) => ((0,jsx_runtime.jsxs)("div", { className: "mb-3 flex items-center gap-3", children: [(0,jsx_runtime.jsx)("input", { type: "text", value: lang, maxLength: 40, onChange: e => updateLanguage(idx, e.target.value), placeholder: `Language #${idx + 1}`, className: "flex-1 p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm" }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: () => removeLanguage(idx), className: "text-red-600 hover:text-red-700 text-sm font-medium transition-colors", children: "Remove" })] }, idx))), (form.languages?.length || 0) < 3 && ((0,jsx_runtime.jsx)("button", { type: "button", onClick: addLanguage, className: "text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors", children: "+ Add Language" }))] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-light text-gray-900 mb-4 tracking-wide", children: "Residences" }), form.residences.map((res, i) => ((0,jsx_runtime.jsxs)("div", { className: "mb-4 p-6 bg-gray-50 rounded-lg space-y-4", children: [(0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider", children: "Country" }), (0,jsx_runtime.jsx)(components_LocationSelector, { selectedCountry: res.country, selectedCity: res.city, onCountryChange: (value) => updateResidence(i, 'country', value), onCityChange: (value) => updateResidence(i, 'city', value) })] }) }), form.residences.length > 1 && ((0,jsx_runtime.jsx)("button", { type: "button", onClick: () => removeResidence(i), className: "text-red-600 hover:text-red-700 text-sm font-medium transition-colors", children: "Remove Residence" }))] }, i))), (0,jsx_runtime.jsx)("button", { onClick: addResidence, className: "text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors", children: "+ Add Residence" })] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-light text-gray-900 mb-4 tracking-wide", children: "Projects" }), form.projects.map((proj, i) => ((0,jsx_runtime.jsxs)("div", { className: "mb-4 p-6 bg-gray-50 rounded-lg space-y-4", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider", children: "Project Name" }), (0,jsx_runtime.jsx)("input", { value: proj.projectName, onChange: e => updateProject(i, 'projectName', e.target.value), placeholder: "Enter project name", className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider", children: "Your Role" }), (0,jsx_runtime.jsx)("input", { value: proj.role, onChange: e => updateProject(i, 'role', e.target.value), placeholder: "Enter your role", className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider", children: "Description (Optional)" }), (0,jsx_runtime.jsx)("input", { value: proj.description, onChange: e => updateProject(i, 'description', e.target.value), placeholder: "Short description of your contribution", maxLength: 100, className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm" })] }), form.projects.length > 1 && ((0,jsx_runtime.jsx)("button", { type: "button", onClick: () => removeProject(i), className: "text-red-600 hover:text-red-700 text-sm font-medium transition-colors", children: "Remove Project" }))] }, i))), (0,jsx_runtime.jsx)("button", { type: "button", onClick: addProject, className: "text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors", children: "+ Add Project" })] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-center mb-4", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-light text-gray-900 tracking-wide", children: "Education" }), (0,jsx_runtime.jsxs)("span", { className: "text-sm text-gray-500", children: [form.education.length, " ", form.education.length === 1 ? 'entry' : 'entries'] })] }), form.education.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "text-center py-6 px-4 border-2 border-dashed border-gray-200 rounded-lg", children: [(0,jsx_runtime.jsx)("svg", { className: "mx-auto h-10 w-10 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }), (0,jsx_runtime.jsx)("h4", { className: "mt-2 text-sm font-medium text-gray-900", children: "No education added" }), (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-gray-500", children: "Add your education history to showcase your background" }), (0,jsx_runtime.jsxs)("button", { type: "button", onClick: addEducation, className: "mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: [(0,jsx_runtime.jsx)("svg", { className: "-ml-0.5 mr-1.5 h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }), "Add Education"] })] })) : ((0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [form.education.map((edu, i) => ((0,jsx_runtime.jsxs)("div", { className: "p-4 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [(0,jsx_runtime.jsxs)("div", { className: "col-span-2", children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Institution" }), (0,jsx_runtime.jsx)("input", { value: edu.institution, onChange: e => updateEducation(i, 'institution', e.target.value), placeholder: "e.g., University of California, Los Angeles", className: "w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-sm" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Degree" }), (0,jsx_runtime.jsx)("input", { value: edu.degree || '', onChange: e => updateEducation(i, 'degree', e.target.value), placeholder: "e.g., Bachelor of Arts", className: "w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-sm" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Field of Study" }), (0,jsx_runtime.jsx)("input", { value: edu.fieldOfStudy || '', onChange: e => updateEducation(i, 'fieldOfStudy', e.target.value), placeholder: "e.g., Film Studies", className: "w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-sm" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Start Year" }), (0,jsx_runtime.jsx)("input", { type: "number", value: edu.startDate || '', onChange: e => updateEducation(i, 'startDate', e.target.value), placeholder: "e.g., 2015", min: "1900", max: new Date().getFullYear(), className: "w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-sm" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: edu.isCurrent ? 'Expected Graduation' : 'End Year' }), (0,jsx_runtime.jsxs)("div", { className: "flex space-x-2", children: [(0,jsx_runtime.jsx)("input", { type: "number", value: edu.isCurrent ? '' : (edu.endDate || ''), onChange: e => updateEducation(i, 'endDate', e.target.value), disabled: edu.isCurrent, placeholder: edu.isCurrent ? 'Present' : 'e.g., 2019', min: edu.startDate || '1900', max: new Date().getFullYear() + 10, className: "flex-1 p-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-sm disabled:bg-gray-50" }), (0,jsx_runtime.jsxs)("label", { className: "flex items-center px-3 py-2 border border-gray-200 rounded bg-white text-xs text-gray-700", children: [(0,jsx_runtime.jsx)("input", { type: "checkbox", checked: !!edu.isCurrent, onChange: e => updateEducation(i, 'isCurrent', e.target.checked), className: "h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" }), (0,jsx_runtime.jsx)("span", { className: "ml-1.5", children: "Current" })] })] })] })] }), (0,jsx_runtime.jsx)("div", { className: "mt-3 flex justify-end", children: (0,jsx_runtime.jsxs)("button", { type: "button", onClick: () => removeEducation(i), className: "inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 transition-colors", children: [(0,jsx_runtime.jsx)("svg", { className: "h-3 w-3 mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), "Remove"] }) })] }, i))), (0,jsx_runtime.jsx)("div", { className: "mt-2", children: (0,jsx_runtime.jsxs)("button", { type: "button", onClick: addEducation, className: "inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors", children: [(0,jsx_runtime.jsx)("svg", { className: "-ml-0.5 mr-1.5 h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }), "Add Another Education"] }) })] }))] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider", children: "Profile Picture" }), (0,jsx_runtime.jsx)("input", { type: "file", accept: "image/*", onChange: handleProfileImageChange, className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]" }), form.profileImageUrl && ((0,jsx_runtime.jsxs)("div", { className: "mt-4 flex flex-col gap-2", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-4", children: [!form.profileImageUrl.startsWith('blob:') ? ((0,jsx_runtime.jsx)("img", { src: form.profileImageUrl, className: "h-20 w-20 rounded-full object-cover border-2 border-gray-200" })) : ((0,jsx_runtime.jsx)("div", { className: "text-xs text-red-500", children: "Image preview only. Please click Save to update your profile image." })), (0,jsx_runtime.jsx)("button", { onClick: () => setForm(f => ({ ...f, profileImageUrl: '' })), className: "text-red-600 hover:text-red-700 text-sm font-medium transition-colors", type: "button", children: "Remove" })] }), (0,jsx_runtime.jsxs)("div", { className: "text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2 mt-2", children: [(0,jsx_runtime.jsx)("strong", { children: "Reminder:" }), " After uploading your profile image, please scroll down and press ", (0,jsx_runtime.jsx)("b", { children: "Save" }), " to update your public profile."] })] }))] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-light text-gray-900 mb-4 tracking-wide", children: "Contact Information (Optional)" }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider", children: "Email" }), (0,jsx_runtime.jsx)("input", { type: "email", placeholder: "your.email@example.com", value: form.contactInfo?.email || '', onChange: e => setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, email: e.target.value } })), className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider", children: "Phone" }), (0,jsx_runtime.jsx)("input", { type: "tel", placeholder: "+1 (555) 123-4567", value: form.contactInfo?.phone || '', onChange: e => setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, phone: e.target.value } })), className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider", children: "Website" }), (0,jsx_runtime.jsx)("input", { type: "url", placeholder: "https://yourwebsite.com", value: form.contactInfo?.website || '', onChange: e => setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, website: e.target.value } })), className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider", children: "Instagram" }), (0,jsx_runtime.jsx)("input", { type: "text", placeholder: "@yourusername", value: form.contactInfo?.instagram || '', onChange: e => setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, instagram: e.target.value } })), className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]" })] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider", children: "Other Relevant Information (Optional)" }), (0,jsx_runtime.jsx)("textarea", { placeholder: "Add any other skills, certifications, memberships, etc.", value: form.otherInfo || '', onChange: e => setForm(f => ({ ...f, otherInfo: e.target.value })), rows: 4, className: "w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] resize-none" })] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [(0,jsx_runtime.jsx)("input", { type: "checkbox", id: "publish-toggle", checked: isPublished, onChange: (e) => setIsPublished(e.target.checked), className: "w-5 h-5 text-gray-600 bg-white border-gray-300 rounded focus:ring-gray-500 focus:ring-2" }), (0,jsx_runtime.jsx)("label", { htmlFor: "publish-toggle", className: "font-medium text-gray-900", children: "Publish Resume Publicly" })] }), isPublished ? ((0,jsx_runtime.jsx)("div", { className: "text-sm text-green-600", children: "\u2705 Your resume will be visible via a public link once saved." })) : ((0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: "\uD83D\uDD12 Your resume is private and only visible to you." })), isPublished && ((0,jsx_runtime.jsx)("p", { className: "text-yellow-600 text-sm mt-2", children: "\u26A0\uFE0F Once published, your resume will be accessible to anyone with the link." }))] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200", children: [(0,jsx_runtime.jsx)("h4", { className: "font-medium text-gray-900 mb-4", children: "Availability Status" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsxs)("label", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("input", { type: "radio", name: "availability", value: "available", checked: form.availability === 'available', onChange: (e) => setForm(f => ({ ...f, availability: e.target.value })), className: "w-4 h-4 text-green-600 bg-white border-gray-300 focus:ring-green-500 focus:ring-2" }), (0,jsx_runtime.jsx)("span", { className: "text-green-700 font-medium", children: "\u2705 Available for work" })] }), (0,jsx_runtime.jsxs)("label", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("input", { type: "radio", name: "availability", value: "soon", checked: form.availability === 'soon', onChange: (e) => setForm(f => ({ ...f, availability: e.target.value })), className: "w-4 h-4 text-yellow-600 bg-white border-gray-300 focus:ring-yellow-500 focus:ring-2" }), (0,jsx_runtime.jsx)("span", { className: "text-yellow-700 font-medium", children: "\u23F0 Available soon" })] }), (0,jsx_runtime.jsxs)("label", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("input", { type: "radio", name: "availability", value: "unavailable", checked: form.availability === 'unavailable', onChange: (e) => setForm(f => ({ ...f, availability: e.target.value })), className: "w-4 h-4 text-red-600 bg-white border-gray-300 focus:ring-red-500 focus:ring-2" }), (0,jsx_runtime.jsx)("span", { className: "text-red-700 font-medium", children: "\u274C Currently unavailable" })] })] }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600 mt-3", children: "This helps producers know when you're available for new projects" })] }), isPublished && user && ((0,jsx_runtime.jsxs)("div", { className: "mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200", children: [(0,jsx_runtime.jsx)("h4", { className: "font-medium text-blue-900 mb-3", children: "Share Your Resume" }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [(0,jsx_runtime.jsx)("input", { type: "text", value: `${window.location.origin}/resume/${user.uid}`, readOnly: true, className: "flex-1 p-3 bg-white border border-blue-200 rounded-lg text-sm text-gray-600" }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                                                navigator.clipboard.writeText(`${window.location.origin}/resume/${user.uid}`);
                                                                setMessage('Link copied to clipboard!');
                                                                setTimeout(() => setMessage(null), 3000);
                                                            }, className: "px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors", children: "Copy" })] }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-blue-700", children: "Share this link with potential employers or collaborators" })] })), (0,jsx_runtime.jsx)("button", { onClick: handleSave, disabled: loading, className: "w-full bg-gray-900 text-white py-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 font-light tracking-wide transition-all duration-300 hover:scale-[1.02]", children: loading ? 'Saving…' : 'Save Profile' }), message && ((0,jsx_runtime.jsx)("p", { className: "text-center text-green-600 mt-4 font-medium", children: message })), (0,jsx_runtime.jsx)("hr", { className: "my-8 border-gray-200" }), (0,jsx_runtime.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-6 tracking-wide", children: "Resume Preview" }), (0,jsx_runtime.jsx)("div", { ref: resumeRef, className: "bg-white border border-gray-200 rounded-lg overflow-hidden", children: (0,jsx_runtime.jsx)(ResumeView/* default */.A, { profile: {
                                                    ...form,
                                                    projects: form.projects?.map(project => ({
                                                        projectName: project.projectName,
                                                        role: project.role,
                                                        description: project.description || '' // Ensure description is always a string
                                                    }))
                                                } }) }), (0,jsx_runtime.jsx)("button", { onClick: handleDownloadPDF, className: "mt-6 bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-light tracking-wide transition-all duration-300 hover:scale-105", children: "Download as PDF" })] }) }) })] }) })] }));
};
/* harmony default export */ const components_EditCrewProfile = (EditCrewProfile);


/***/ })

}]);
//# sourceMappingURL=360.chunk.js.map