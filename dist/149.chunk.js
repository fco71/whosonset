"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[149],{

/***/ 1149:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ components_PublicResumePage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router/dist/development/chunk-QMGIS6GS.mjs
var chunk_QMGIS6GS = __webpack_require__(5788);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./src/components/ResumeView.tsx + 1 modules
var ResumeView = __webpack_require__(3542);
// EXTERNAL MODULE: ./src/components/Social/FollowButton.tsx
var FollowButton = __webpack_require__(6024);
;// ./src/utilities/crewFavoritesService.ts


class CrewFavoritesService {
    /**
     * Add a crew profile to user's favorites
     */
    static async addToFavorites(crewId, crewData) {
        const user = firebase/* auth */.j2.currentUser;
        if (!user) {
            throw new Error('User must be authenticated to add favorites');
        }
        const favoriteData = {
            id: `${user.uid}_${crewId}`,
            crewId,
            userId: user.uid,
            addedAt: new Date(),
            crewData: crewData ? {
                name: crewData.name,
                profileImageUrl: crewData.profileImageUrl,
                jobTitles: crewData.jobTitles?.map(jt => jt.title),
                residences: crewData.residences?.map(r => `${r.city}, ${r.country}`),
                availability: crewData.availability,
            } : undefined
        };
        await (0,index_esm/* setDoc */.BN)((0,index_esm.doc)(firebase.db, this.COLLECTION_NAME, favoriteData.id), favoriteData);
    }
    /**
     * Remove a crew profile from user's favorites
     */
    static async removeFromFavorites(crewId) {
        const user = firebase/* auth */.j2.currentUser;
        if (!user) {
            throw new Error('User must be authenticated to remove favorites');
        }
        const favoriteId = `${user.uid}_${crewId}`;
        await (0,index_esm/* deleteDoc */.kd)((0,index_esm.doc)(firebase.db, this.COLLECTION_NAME, favoriteId));
    }
    /**
     * Check if a crew profile is in user's favorites
     */
    static async isFavorite(crewId) {
        const user = firebase/* auth */.j2.currentUser;
        if (!user)
            return false;
        const favoriteId = `${user.uid}_${crewId}`;
        const favoriteDoc = await (0,index_esm/* getDocs */.GG)((0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, this.COLLECTION_NAME), (0,index_esm/* where */._M)('id', '==', favoriteId)));
        return !favoriteDoc.empty;
    }
    /**
     * Get all user's favorite crew profiles
     */
    static async getFavorites() {
        const user = firebase/* auth */.j2.currentUser;
        if (!user)
            return [];
        const favoritesQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, this.COLLECTION_NAME), (0,index_esm/* where */._M)('userId', '==', user.uid), (0,index_esm/* orderBy */.My)('addedAt', 'asc'), (0,index_esm/* orderBy */.My)('__name__', 'asc'));
        const snapshot = await (0,index_esm/* getDocs */.GG)(favoritesQuery);
        return snapshot.docs.map(doc => ({
            ...doc.data(),
            addedAt: doc.data().addedAt.toDate()
        }));
    }
    /**
     * Get favorite crew profile IDs for a user
     */
    static async getFavoriteCrewIds() {
        const favorites = await this.getFavorites();
        return favorites.map(fav => fav.crewId);
    }
    /**
     * Toggle favorite status
     */
    static async toggleFavorite(crewId, crewData) {
        const isCurrentlyFavorite = await this.isFavorite(crewId);
        if (isCurrentlyFavorite) {
            await this.removeFromFavorites(crewId);
            return false;
        }
        else {
            await this.addToFavorites(crewId, crewData);
            return true;
        }
    }
}
CrewFavoritesService.COLLECTION_NAME = 'crewFavorites';

// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
;// ./src/components/MessageButton.tsx

const EmailButton = ({ email, disabled }) => {
    if (!email)
        return null;
    return ((0,jsx_runtime.jsxs)("a", { href: `mailto:${email}`, className: `inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition-all duration-200 ${disabled ? 'opacity-50 pointer-events-none' : ''}`, style: { minWidth: 110, justifyContent: 'center' }, target: "_blank", rel: "noopener noreferrer", tabIndex: disabled ? -1 : 0, "aria-disabled": disabled, children: [(0,jsx_runtime.jsxs)("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24", children: [(0,jsx_runtime.jsx)("path", { d: "M4 4h16v16H4z", stroke: "none" }), (0,jsx_runtime.jsx)("path", { d: "M22 6l-10 7L2 6" })] }), "Email"] }));
};
/* harmony default export */ const MessageButton = (EmailButton);

;// ./src/components/CrewProfileHeader.tsx






const CrewProfileHeader = ({ profile }) => {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [isBookmarked, setIsBookmarked] = (0,react.useState)(false);
    const [bookmarking, setBookmarking] = (0,react.useState)(false);
    (0,react.useEffect)(() => {
        const checkFavorite = async () => {
            if (currentUser && profile?.uid) {
                setIsBookmarked(await CrewFavoritesService.isFavorite(profile.uid));
            }
        };
        checkFavorite();
    }, [currentUser, profile?.uid]);
    const handleBookmark = async () => {
        if (!currentUser)
            return;
        setBookmarking(true);
        try {
            const newStatus = await CrewFavoritesService.toggleFavorite(profile.uid, profile);
            setIsBookmarked(newStatus);
        }
        finally {
            setBookmarking(false);
        }
    };
    const mainTitle = profile.jobTitles?.[0]?.title || '';
    const mainLocation = profile.residences?.[0]
        ? `${profile.residences[0].city ? profile.residences[0].city + ', ' : ''}${profile.residences[0].country || ''}`
        : '';
    // Fallback: use photoURL if profileImageUrl is missing
    const imageUrl = profile.profileImageUrl || profile.photoURL || '/default-avatar.svg';
    const availability = profile.availability || '';
    const canMessage = !!profile.contactInfo?.email && currentUser && currentUser.uid !== profile.uid;
    return ((0,jsx_runtime.jsxs)("div", { className: "flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl shadow-lg px-8 py-6 mb-8 border border-gray-100 animate-fade-in", children: [(0,jsx_runtime.jsx)("img", { src: imageUrl, alt: profile.name, className: "w-24 h-24 rounded-full object-cover border-2 border-gray-200", onError: e => { e.target.src = '/default-avatar.svg'; }, style: { flexShrink: 0 } }), (0,jsx_runtime.jsxs)("div", { className: "flex-1 min-w-0 text-center md:text-left", children: [(0,jsx_runtime.jsx)("div", { className: "font-bold text-2xl text-gray-900 mb-1", children: profile.name }), (0,jsx_runtime.jsxs)("div", { className: "text-sm text-gray-500 mb-1", children: [mainTitle, mainLocation ? ' · ' + mainLocation : ''] }), availability && ((0,jsx_runtime.jsx)("span", { className: `inline-block px-2 py-1 rounded-full text-xs font-medium ${availability.toLowerCase() === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`, children: availability }))] }), (0,jsx_runtime.jsx)("div", { className: "flex flex-col gap-2 items-center md:items-end", children: currentUser && currentUser.uid !== profile.uid && ((0,jsx_runtime.jsxs)("div", { className: "flex gap-2 items-center", children: [(0,jsx_runtime.jsx)(FollowButton/* default */.A, { currentUserId: currentUser.uid, targetUserId: profile.uid, size: "sm" }), (0,jsx_runtime.jsx)("button", { onClick: handleBookmark, disabled: bookmarking, className: `p-2 rounded-full border border-gray-200 bg-white hover:bg-yellow-50 transition-all duration-200 ${isBookmarked ? 'text-yellow-500' : 'text-gray-400'} ${bookmarking ? 'opacity-50' : ''}`, title: isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks', style: { lineHeight: 0 }, children: isBookmarked ? ((0,jsx_runtime.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", viewBox: "0 0 24 24", className: "w-6 h-6", children: (0,jsx_runtime.jsx)("path", { d: "M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" }) })) : ((0,jsx_runtime.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24", className: "w-6 h-6", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" }) })) }), canMessage && ((0,jsx_runtime.jsx)(MessageButton, { email: profile.contactInfo.email }))] })) })] }));
};
/* harmony default export */ const components_CrewProfileHeader = (CrewProfileHeader);

;// ./src/components/PublicResumePage.tsx







// Use enum-like object with uppercase keys for better type safety
const LOADING_STATES = {
    IDLE: 'IDLE',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
};
const PublicResumePage = () => {
    const { uid } = (0,chunk_QMGIS6GS/* useParams */.g)();
    const [profile, setProfile] = (0,react.useState)(null);
    const [status, setStatus] = (0,react.useState)(LOADING_STATES.LOADING);
    const [error, setError] = (0,react.useState)(null);
    (0,react.useEffect)(() => {
        const fetchResume = async () => {
            if (!uid) {
                setStatus(LOADING_STATES.ERROR);
                setError('No user ID provided');
                return;
            }
            try {
                setStatus(LOADING_STATES.LOADING);
                const docRef = (0,index_esm.doc)(firebase.db, 'crewProfiles', uid);
                const docSnap = await (0,index_esm.getDoc)(docRef);
                if (!docSnap.exists()) {
                    throw new Error('Profile not found');
                }
                let profileData = docSnap.data();
                // Fallback: use photoURL if profileImageUrl is missing
                if (!profileData.profileImageUrl && profileData.photoURL) {
                    profileData = { ...profileData, profileImageUrl: profileData.photoURL };
                }
                console.log('[PublicResumePage] Fetched profile data:', {
                    hasProfileImage: !!profileData.profileImageUrl,
                    profileImageUrl: profileData.profileImageUrl,
                    isBlobUrl: profileData.profileImageUrl?.startsWith('blob:'),
                    profileData: { ...profileData, profileImageUrl: '...' }
                });
                if (!profileData.isPublished) {
                    throw new Error('Profile is not published');
                }
                setProfile(profileData);
                setStatus(LOADING_STATES.SUCCESS);
            }
            catch (err) {
                console.error('Error fetching resume:', err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setStatus(LOADING_STATES.ERROR);
            }
        };
        fetchResume();
    }, [uid]);
    // Always call hooks in the same order
    (0,react.useEffect)(() => {
        if (profile) {
            console.log('[PublicResumePage] Rendering ResumeView with profile:', {
                hasProfileImage: !!profile?.profileImageUrl,
                isBlobUrl: profile?.profileImageUrl?.startsWith('blob:'),
                profileId: uid
            });
        }
    }, [profile, uid]);
    if (status === LOADING_STATES.LOADING) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-900 text-white flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4", "aria-label": "Loading" }), (0,jsx_runtime.jsx)("p", { children: "Loading resume..." }),  false && (0)] }) }));
    }
    if (status === LOADING_STATES.ERROR) {
        console.error('[PublicResumePage] Error loading profile:', { error, profile });
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-900 text-white flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center max-w-md mx-auto p-6", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-4", role: "img", "aria-hidden": "true", children: error?.includes('not found') ? '🔍' : '🔒' }), (0,jsx_runtime.jsx)("h1", { className: "text-2xl font-bold mb-4", children: error?.includes('not found')
                            ? 'Resume Not Found'
                            : 'Resume Not Available' }), (0,jsx_runtime.jsx)("p", { className: "text-gray-300", children: error || 'This resume is not available. Please check the link or contact the profile owner.' }),  false && (0)] }) }));
    }
    if (!profile) {
        return null; // Should be handled by error state, but TypeScript needs this check
    }
    return ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)("div", { className: "max-w-3xl mx-auto px-4 pt-8", children: [(0,jsx_runtime.jsx)(components_CrewProfileHeader, { profile: profile }), (0,jsx_runtime.jsx)(ResumeView/* default */.A, { profile: profile })] }),  false && (0)] }));
};
/* harmony default export */ const components_PublicResumePage = (PublicResumePage);


/***/ }),

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

/***/ 6024:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6997);
/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(888);




const FollowButton = ({ currentUserId, targetUserId, onFollowRequest, className = '', size = 'md', showCount = false }) => {
    const [followStatus, setFollowStatus] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('none');
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [followersCount, setFollowersCount] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const checkStatus = async () => {
            const status = await _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__/* .SocialService */ .l.getFollowStatus(currentUserId, targetUserId);
            setFollowStatus(status);
        };
        checkStatus();
    }, [currentUserId, targetUserId]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (showCount) {
            const getCount = async () => {
                const count = await _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__/* .SocialService */ .l.getFollowersCount(targetUserId);
                setFollowersCount(count);
            };
            getCount();
        }
    }, [targetUserId, showCount]);
    const handleFollow = async () => {
        if (onFollowRequest) {
            onFollowRequest();
            return;
        }
        try {
            setLoading(true);
            if (followStatus === 'pending' || followStatus === 'following') {
                (0,react_hot_toast__WEBPACK_IMPORTED_MODULE_3__/* .toast */ .oR)('Follow request already sent or you are already following.');
                return;
            }
            console.log('[FollowButton] Sending follow request from', currentUserId, 'to', targetUserId);
            await _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__/* .SocialService */ .l.sendFollowRequest(currentUserId, targetUserId);
            console.log('[FollowButton] Follow request sent successfully');
            setFollowStatus('pending');
        }
        catch (error) {
            if (error?.message && error.message.includes('already exists')) {
                setFollowStatus('pending');
                (0,react_hot_toast__WEBPACK_IMPORTED_MODULE_3__/* .toast */ .oR)('Follow request already sent.');
            }
            else {
                console.error('[FollowButton] Error sending follow request:', error);
                react_hot_toast__WEBPACK_IMPORTED_MODULE_3__/* .toast */ .oR.error('Error sending follow request.');
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleUnfollow = async () => {
        try {
            setLoading(true);
            await _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__/* .SocialService */ .l.unfollow(currentUserId, targetUserId);
            setFollowStatus('none');
            if (showCount) {
                setFollowersCount(prev => Math.max(0, prev - 1));
            }
        }
        catch (error) {
            console.error('Error unfollowing:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-3 py-1.5 text-xs';
            case 'lg':
                return 'px-6 py-3 text-base';
            default:
                return 'px-4 py-2 text-sm';
        }
    };
    const renderButton = () => {
        const baseClasses = `font-light tracking-wide rounded-lg transition-all duration-300 disabled:opacity-50 ${getSizeClasses()} ${className}`;
        switch (followStatus) {
            case 'following':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: handleUnfollow, disabled: loading, className: `bg-red-600 text-white hover:bg-red-700 hover:scale-105 ${baseClasses} flex items-center gap-2`, title: "Click to unfollow", children: loading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Unfollowing..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "\u2713" }), "Following"] })) }));
            case 'pending':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { disabled: true, className: `bg-yellow-100 text-yellow-800 font-medium rounded-full tracking-wider ${getSizeClasses()} ${className} flex items-center gap-2 cursor-not-allowed`, title: "Request sent, waiting for approval", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "\u23F3" }), "Request Sent"] }));
            default:
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: handleFollow, disabled: loading, className: `bg-gray-900 text-white hover:bg-gray-800 hover:scale-105 ${baseClasses} flex items-center gap-2`, title: "Click to send follow request", children: loading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Sending..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "+" }), "Follow"] })) }));
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [renderButton(), showCount && followersCount > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-xs text-gray-500", children: [followersCount, " follower", followersCount !== 1 ? 's' : ''] }))] }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FollowButton);


/***/ })

}]);
//# sourceMappingURL=149.chunk.js.map