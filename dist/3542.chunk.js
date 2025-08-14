"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[3542],{

/***/ 676:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ imageErrorFallback)
/* harmony export */ });
// Utility for robust <img> error fallback
function imageErrorFallback(e, fallback = '/bust-avatar.svg') {
    const target = e.target;
    if (!target.src.endsWith(fallback)) {
        target.src = fallback;
    }
}


/***/ }),

/***/ 3542:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ components_ResumeView)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
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
                // If we can't fetch the blob, don't try to manage it
                setIsBlobUrl(false);
                setBlob(null);
            }
        };
        fetchBlob();
    }, [url]);
    // Return the managed blob URL if we have one, otherwise return the original URL
    return isBlobUrl && blobUrl ? blobUrl : url || null;
};

// EXTERNAL MODULE: ./src/utilities/imageErrorFallback.ts
var imageErrorFallback = __webpack_require__(676);
;// ./src/components/ResumeView.tsx




// Import html2pdf using require to bypass TypeScript issues
const html2pdf = __webpack_require__(3833);
const ResumeView = (props) => {
    const { profile, isOwnResume = false } = props;
    const { t } = (0,es/* useTranslation */.Bd)();
    // Fallback: use photoURL if profileImageUrl is missing
    const managedProfileImageUrl = useManagedUrl(profile?.profileImageUrl || profile?.photoURL);
    // Calculate available space and prioritize content
    const calculateContentLimits = () => {
        const totalHeight = 297; // A4 height in mm
        const padding = 30; // 15mm top + 15mm bottom
        const headerHeight = 25; // Original header height
        const contactHeight = 15; // Contact section is critical, reserve space
        const sectionSpacing = 5; // Original spacing between sections
        let availableHeight = totalHeight - padding - headerHeight - contactHeight;
        let sections = [];
        // Only apply limits if content would overflow
        const hasManySections = ((profile.languages && profile.languages.length > 2) ||
            (profile.residences && profile.residences.length > 2) ||
            (profile.jobTitles && profile.jobTitles.filter(jt => jt.department && jt.title).length > 4) ||
            (profile.projects && profile.projects.filter(p => p.projectName && p.role).length > 3) ||
            (profile.education && profile.education.length > 2) ||
            (profile.otherInfo && profile.otherInfo.length > 200));
        if (!hasManySections) {
            // If content is reasonable, don't apply limits
            return [];
        }
        // Languages (low priority, can be cut)
        if (profile.languages && profile.languages.length > 0) {
            const langHeight = Math.min(10, availableHeight);
            sections.push({ type: 'languages', height: langHeight, priority: 1 });
            availableHeight -= langHeight + sectionSpacing;
        }
        // Residences (low priority, can be cut)
        if (profile.residences && profile.residences.length > 0) {
            const resHeight = Math.min(10, availableHeight);
            sections.push({ type: 'residences', height: resHeight, priority: 1 });
            availableHeight -= resHeight + sectionSpacing;
        }
        // Job Titles (medium priority)
        if (profile.jobTitles && profile.jobTitles.filter(jt => jt.department && jt.title).length > 0) {
            const jobHeight = Math.min(25, availableHeight);
            sections.push({ type: 'jobTitles', height: jobHeight, priority: 2 });
            availableHeight -= jobHeight + sectionSpacing;
        }
        // Projects (medium priority)
        if (profile.projects && profile.projects.filter(p => p.projectName && p.role).length > 0) {
            const projectHeight = Math.min(20, availableHeight);
            sections.push({ type: 'projects', height: projectHeight, priority: 3 });
            availableHeight -= projectHeight + sectionSpacing;
        }
        // Education (medium priority)
        if (profile.education && profile.education.length > 0) {
            const eduHeight = Math.min(15, availableHeight);
            sections.push({ type: 'education', height: eduHeight, priority: 4 });
            availableHeight -= eduHeight + sectionSpacing;
        }
        // Other Info (lowest priority, can be cut)
        if (profile.otherInfo && availableHeight > 10) {
            const otherHeight = Math.min(10, availableHeight);
            sections.push({ type: 'otherInfo', height: otherHeight, priority: 5 });
        }
        return sections;
    };
    const contentLimits = calculateContentLimits();
    const containerStyle = {
        width: '210mm',
        height: '297mm',
        padding: '10mm 15mm 15mm 15mm', // Back to reasonable padding
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        fontFamily: 'Georgia, serif',
        fontSize: '11pt',
        lineHeight: 1.3,
        color: '#333',
        // Remove overflow: 'hidden' to prevent name chopping
    };
    const headerStyle = {
        display: 'flex',
        alignItems: 'flex-start', // This ensures name aligns with top of photo
        gap: '10mm',
        marginBottom: '6mm',
        borderBottom: '2pt solid #333',
        paddingBottom: '3mm',
        paddingTop: '0', // Remove top padding to align name with photo
        marginTop: '0', // Remove any top margin
    };
    const profileImageStyle = {
        width: '30mm',
        height: '40mm', // Original elegant rectangular aspect ratio
        borderRadius: '3mm',
        objectFit: 'cover', // Cover to maintain aspect ratio
        border: '1pt solid #ccc',
        flexShrink: 0,
        backgroundColor: '#f5f5f5', // Light background for transparent images
        marginTop: '0', // Ensure photo starts at the very top
    };
    const nameStyle = {
        fontSize: '22pt',
        fontWeight: 'bold',
        margin: 0,
        padding: 0, // Remove all padding
        color: '#333',
        alignSelf: 'flex-start', // Ensure name aligns with top of photo
        lineHeight: 1, // Tight line height for better alignment
        marginTop: '-2mm', // Move name up to align with photo top
    };
    const bioStyle = {
        fontSize: '10pt', // Match the Languages section text size exactly
        color: '#333', // Match the Languages section color exactly
        margin: '2mm 0 0 0',
        fontStyle: 'italic',
        fontWeight: 'normal', // Ensure same weight as Languages section
        // Align bio with bottom of profile photo (40mm photo height)
        maxHeight: '38mm', // 40mm photo height minus 2mm margin
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 8, // Allow more lines to fill the space
        WebkitBoxOrient: 'vertical',
        lineHeight: 1.3,
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
              padding: 10mm 15mm 15mm 15mm !important; /* Match container padding */
              box-shadow: none !important;
              page-break-after: avoid;
              page-break-inside: avoid;
              break-inside: avoid;
              font-size: 11pt !important;
              line-height: 1.3 !important;
              font-family: Georgia, serif !important; /* Match preview font */
            }
            
            .resume-container img {
              max-width: 30mm !important;
              max-height: 40mm !important;
              object-fit: cover !important;
            }
            
            .resume-container h1 {
              font-size: 22pt !important;
              font-weight: bold !important;
              margin: 0 !important;
              padding: 0 !important;
              color: #333 !important;
              line-height: 1 !important;
              align-self: flex-start !important; /* Match preview alignment */
              margin-top: -2mm !important; /* Move name up to align with photo top */
            }
            
            .resume-container h2 {
              font-size: 13pt !important;
              font-weight: bold !important;
              padding-bottom: 3mm !important;
              margin-bottom: 5mm !important;
              border-bottom: 1pt solid #333 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.5pt !important;
            }
            
            .resume-container p, .resume-container li {
              font-size: 10pt !important;
              margin-bottom: 1mm !important;
              color: #333 !important;
            }
            
            /* Bio text specific styling to match preview exactly */
            .resume-container p {
              font-size: 10pt !important; /* Match Languages section exactly */
              color: #333 !important; /* Match Languages section color */
              font-style: italic !important;
              line-height: 1.3 !important;
              font-weight: normal !important; /* Ensure same weight as Languages */
              margin: 2mm 0 0 0 !important; /* Match preview margin */
            }
            
            /* Ensure header alignment matches preview */
            .resume-container > div > div > div:first-child {
              display: flex !important;
              align-items: flex-start !important;
              gap: 10mm !important;
              margin-bottom: 6mm !important;
              border-bottom: 2pt solid #333 !important;
              padding-bottom: 3mm !important;
              padding-top: 0 !important;
              margin-top: 0 !important;
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
        ` }), (0,jsx_runtime.jsx)("div", { className: "resume-container", style: containerStyle, children: (0,jsx_runtime.jsx)("div", { style: contentWrapperStyle, children: (0,jsx_runtime.jsxs)("div", { style: scrollableContentStyle, children: [(0,jsx_runtime.jsxs)("div", { style: headerStyle, children: [managedProfileImageUrl && ((0,jsx_runtime.jsx)("img", { src: managedProfileImageUrl, alt: "Profile", style: profileImageStyle, crossOrigin: "anonymous", onError: e => (0,imageErrorFallback/* imageErrorFallback */.i)(e) })), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h1", { style: nameStyle, children: profile.name }), profile.bio && ((0,jsx_runtime.jsx)("p", { style: bioStyle, children: profile.bio }))] })] }), profile.languages && profile.languages.length > 0 && contentLimits.find(s => s.type === 'languages') && ((0,jsx_runtime.jsxs)("section", { style: sectionStyle, children: [(0,jsx_runtime.jsx)("div", { style: sectionTitleStyle, children: t('resume.sections.languages') }), (0,jsx_runtime.jsx)("ul", { style: jobTitlesListStyle, children: profile.languages.slice(0, 2).map((lang, idx) => ((0,jsx_runtime.jsx)("li", { style: jobTitleItemStyle, children: lang }, idx))) }), profile.languages.length > 2 && ((0,jsx_runtime.jsxs)("p", { style: { fontSize: '9pt', color: '#666', fontStyle: 'italic', margin: '1mm 0 0 0' }, children: ["(", t('resume.labels.showingTop', { count: 2, type: t('resume.types.languages') }), ")"] }))] })), profile.residences && profile.residences.length > 0 && contentLimits.find(s => s.type === 'residences') && ((0,jsx_runtime.jsxs)("section", { style: sectionStyle, children: [(0,jsx_runtime.jsx)("div", { style: sectionTitleStyle, children: t('resume.sections.residences') }), (0,jsx_runtime.jsx)("ul", { style: jobTitlesListStyle, children: profile.residences.slice(0, 2).map((residence, idx) => ((0,jsx_runtime.jsx)("li", { style: jobTitleItemStyle, children: residence.city && residence.country ? `${residence.city}, ${residence.country}` :
                                                residence.city || residence.country || '' }, idx))) }), profile.residences.length > 2 && ((0,jsx_runtime.jsxs)("p", { style: { fontSize: '9pt', color: '#666', fontStyle: 'italic', margin: '1mm 0 0 0' }, children: ["(", t('resume.labels.showingTop', { count: 2, type: t('resume.types.residences') }), ")"] }))] })), profile.jobTitles && profile.jobTitles.filter(jt => jt.department && jt.title).length > 0 && contentLimits.find(s => s.type === 'jobTitles') && ((0,jsx_runtime.jsxs)("div", { style: sectionStyle, children: [(0,jsx_runtime.jsx)("h2", { style: sectionTitleStyle, children: t('resume.sections.professionalExperience') }), (0,jsx_runtime.jsx)("ul", { style: jobTitlesListStyle, children: profile.jobTitles
                                            .filter(jt => jt.department && jt.title)
                                            .slice(0, 3) // Reduced from 4 to 3
                                            .map((jt, i) => ((0,jsx_runtime.jsxs)("li", { style: jobTitleItemStyle, children: [(0,jsx_runtime.jsx)("strong", { children: jt.title }), " \u2014 ", jt.department] }, i))) }), profile.jobTitles.filter(jt => jt.department && jt.title).length > 3 && ((0,jsx_runtime.jsxs)("p", { style: { fontSize: '9pt', color: '#666', fontStyle: 'italic', margin: '1mm 0 0 0' }, children: ["(", t('resume.labels.showingTop', { count: 3, type: t('resume.types.positions') }), ")"] }))] })), profile.projects && profile.projects.filter(p => p.projectName && p.role).length > 0 && contentLimits.find(s => s.type === 'projects') && ((0,jsx_runtime.jsxs)("div", { style: sectionStyle, children: [(0,jsx_runtime.jsx)("h2", { style: sectionTitleStyle, children: t('resume.sections.selectedProjects') }), (0,jsx_runtime.jsx)("ul", { style: projectsListStyle, children: profile.projects
                                            .filter(p => p.projectName && p.role)
                                            .slice(0, 2) // Reduced from 3 to 2
                                            .map((p, i) => ((0,jsx_runtime.jsxs)("li", { style: projectItemStyle, children: [(0,jsx_runtime.jsx)("span", { style: projectNameStyle, children: p.projectName }), (0,jsx_runtime.jsxs)("span", { style: projectRoleStyle, children: [" \u2014 ", p.role] }), p.description && ((0,jsx_runtime.jsxs)("span", { style: projectDescriptionStyle, children: [": ", p.description] }))] }, i))) })] })), profile.education && profile.education.length > 0 && contentLimits.find(s => s.type === 'education') && ((0,jsx_runtime.jsxs)("div", { style: sectionStyle, children: [(0,jsx_runtime.jsx)("h2", { style: sectionTitleStyle, children: t('resume.sections.education') }), (0,jsx_runtime.jsx)("ul", { style: jobTitlesListStyle, children: profile.education
                                            .filter(edu => {
                                            // Handle both string and object formats
                                            if (typeof edu === 'string')
                                                return edu.trim() !== '';
                                            // Only show if there's at least one piece of information
                                            return edu.institution || edu.degree || edu.fieldOfStudy || edu.endDate || edu.isCurrent;
                                        })
                                            .slice(0, 1) // Reduced from 2 to 1
                                            .map((edu, i) => {
                                            // Handle string format (legacy)
                                            if (typeof edu === 'string') {
                                                return ((0,jsx_runtime.jsx)("li", { style: { ...jobTitleItemStyle, marginBottom: '4mm' }, children: (0,jsx_runtime.jsx)("div", { style: { color: '#444' }, children: edu }) }, i));
                                            }
                                            // Handle new structured format
                                            const dateInfo = [];
                                            // Only show end date or current status
                                            if (edu.isCurrent) {
                                                dateInfo.push(t('resume.labels.present'));
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
                                        }) })] })), (profile.contactInfo?.email || profile.contactInfo?.phone || profile.contactInfo?.website || profile.contactInfo?.instagram) && ((0,jsx_runtime.jsxs)("div", { style: sectionStyle, children: [(0,jsx_runtime.jsx)("h2", { style: sectionTitleStyle, children: t('resume.sections.contactInformation') }), (0,jsx_runtime.jsxs)("ul", { style: contactListStyle, children: [isOwnResume && profile.contactInfo.email && (0,jsx_runtime.jsxs)("li", { style: contactItemStyle, children: ["\uD83D\uDCE7 ", profile.contactInfo.email] }), isOwnResume && profile.contactInfo.phone && (0,jsx_runtime.jsxs)("li", { style: contactItemStyle, children: ["\uD83D\uDCDE ", profile.contactInfo.phone] }), profile.contactInfo.website && (0,jsx_runtime.jsxs)("li", { style: contactItemStyle, children: ["\uD83C\uDF10 ", profile.contactInfo.website] }), profile.contactInfo.instagram && (0,jsx_runtime.jsxs)("li", { style: contactItemStyle, children: ["\uD83D\uDCF7 @", profile.contactInfo.instagram] })] })] })), profile.otherInfo && contentLimits.find(s => s.type === 'otherInfo') && ((0,jsx_runtime.jsxs)("div", { style: sectionStyle, children: [(0,jsx_runtime.jsx)("h2", { style: sectionTitleStyle, children: t('resume.sections.additionalInformation') }), (0,jsx_runtime.jsx)("p", { style: {
                                            ...otherInfoStyle,
                                            maxHeight: '8mm', // Limit height for other info
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }, children: profile.otherInfo })] }))] }) }) })] }));
};
/* harmony default export */ const components_ResumeView = (ResumeView);


/***/ })

}]);
//# sourceMappingURL=3542.chunk.js.map