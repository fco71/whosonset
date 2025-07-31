"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[6901],{

/***/ 676:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ imageErrorFallback)
/* harmony export */ });
// Utility for robust <img> error fallback
function imageErrorFallback(e, fallback = '/default-avatar.svg') {
    const target = e.target;
    if (!target.src.endsWith(fallback)) {
        target.src = fallback;
    }
}


/***/ }),

/***/ 1928:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ components_ProjectCard)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var dist = __webpack_require__(7767);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/film.js
var film = __webpack_require__(6163);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/clock.js
var clock = __webpack_require__(7235);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/bookmark-check.js
var bookmark_check = __webpack_require__(4316);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/bookmark.js
var bookmark = __webpack_require__(7157);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js + 3 modules
var createLucideIcon = __webpack_require__(9407);
;// ./node_modules/lucide-react/dist/esm/icons/image-off.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }],
  ["path", { d: "M10.41 10.41a2 2 0 1 1-2.83-2.83", key: "1bzlo9" }],
  ["line", { x1: "13.5", x2: "6", y1: "13.5", y2: "21", key: "1q0aeu" }],
  ["line", { x1: "18", x2: "21", y1: "12", y2: "15", key: "5mozeu" }],
  [
    "path",
    {
      d: "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",
      key: "mmje98"
    }
  ],
  ["path", { d: "M21 15V5a2 2 0 0 0-2-2H9", key: "43el77" }]
];
const ImageOff = (0,createLucideIcon/* default */.A)("image-off", __iconNode);


//# sourceMappingURL=image-off.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/map-pin.js
var map_pin = __webpack_require__(6069);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/calendar.js
var calendar = __webpack_require__(2307);
// EXTERNAL MODULE: ./src/components/ui/Card.tsx
var Card = __webpack_require__(4948);
// EXTERNAL MODULE: ./src/components/ui/Button.tsx
var Button = __webpack_require__(774);
// EXTERNAL MODULE: ./src/utilities/imageErrorFallback.ts
var imageErrorFallback = __webpack_require__(676);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
;// ./src/components/ProjectCard.tsx








/**
 * Format a date string to a more readable format
 */
const formatDate = (dateString) => {
    if (!dateString)
        return 'TBD';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
};
/**
 * Get status badge styles based on project status
 */
const getStatusStyles = (status) => {
    const statusMap = {
        'in_production': { bg: 'bg-green-100', text: 'text-green-800', icon: (0,jsx_runtime.jsx)(film/* default */.A, { size: 14 }) },
        'production': { bg: 'bg-green-100', text: 'text-green-800', icon: (0,jsx_runtime.jsx)(film/* default */.A, { size: 14 }) },
        'pre_production': { bg: 'bg-blue-100', text: 'text-blue-800', icon: (0,jsx_runtime.jsx)(clock/* default */.A, { size: 14 }) },
        'pre-production': { bg: 'bg-blue-100', text: 'text-blue-800', icon: (0,jsx_runtime.jsx)(clock/* default */.A, { size: 14 }) },
        'post_production': { bg: 'bg-purple-100', text: 'text-purple-800', icon: (0,jsx_runtime.jsx)(film/* default */.A, { size: 14 }) },
        'post-production': { bg: 'bg-purple-100', text: 'text-purple-800', icon: (0,jsx_runtime.jsx)(film/* default */.A, { size: 14 }) },
        'development': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: (0,jsx_runtime.jsx)(clock/* default */.A, { size: 14 }) },
        'completed': { bg: 'bg-gray-200', text: 'text-gray-800', icon: (0,jsx_runtime.jsx)(film/* default */.A, { size: 14 }) },
        'cancelled': { bg: 'bg-red-100', text: 'text-red-800', icon: (0,jsx_runtime.jsx)(clock/* default */.A, { size: 14 }) },
    };
    return statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: (0,jsx_runtime.jsx)(clock/* default */.A, { size: 14 }) };
};
const ProjectCard = (props) => {
    const { t } = (0,es/* useTranslation */.Bd)();
    const { id, projectName, productionCompany, country, productionLocations, status = 'development', summary, director, producer, genres = [], coverImageUrl: initialCoverImageUrl, startDate, endDate, showDetails = false, onBookmark, isBookmarked = false, className = '', } = props;
    // State to manage the cover image URL with error handling
    const [coverImageUrl, setCoverImageUrl] = (0,react.useState)(null);
    const [imageError, setImageError] = (0,react.useState)(false);
    const [retryCount, setRetryCount] = (0,react.useState)(0);
    const maxRetries = 2; // Maximum number of retry attempts
    // Track the last processed URL to prevent duplicate processing
    const lastProcessedUrlRef = (0,react.useRef)(null);
    const retryTimeoutRef = (0,react.useRef)(null);
    // Navigation and other component logic
    const navigate = (0,dist/* useNavigate */.Zp)();
    const statusStyles = getStatusStyles(status);
    // Get primary production location
    const primaryLocation = productionLocations?.[0]?.city
        ? `${productionLocations[0].city}, ${productionLocations[0].country || country}`
        : country || '';
    // Handle card click
    const handleCardClick = () => {
        navigate(`/projects/${id}`);
    };
    // Debug onBookmark prop
    (0,react.useEffect)(() => {
        console.log('[ProjectCard] ProjectCard rendered:', {
            id,
            isBookmarked,
            onBookmark: !!onBookmark,
            projectName,
            hasBookmarkButton: !!onBookmark
        });
    }, [id, isBookmarked, onBookmark, projectName]);
    // Handle bookmark click
    const handleBookmarkClick = (e) => {
        console.log('[ProjectCard] Bookmark clicked:', {
            id,
            isBookmarked,
            onBookmark: !!onBookmark,
            event: e,
            target: e.target,
            currentTarget: e.currentTarget,
            willToggleTo: !isBookmarked
        });
        e.stopPropagation();
        e.preventDefault(); // Prevent navigation if inside a link
        if (onBookmark) {
            console.log('[ProjectCard] Calling onBookmark with:', { id, isBookmarked: !isBookmarked });
            onBookmark(id, !isBookmarked);
        }
        else {
            console.log('[ProjectCard] No onBookmark handler provided');
        }
    };
    // Handle image URL changes and validate
    (0,react.useEffect)(() => {
        // Clear any pending retry timeouts when URL changes
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
        // Skip if no URL
        if (!initialCoverImageUrl) {
            setCoverImageUrl(null);
            setImageError(true);
            return;
        }
        // If URL hasn't changed, no need to reprocess
        if (initialCoverImageUrl === lastProcessedUrlRef.current) {
            return;
        }
        // Reset retry count when URL changes
        setRetryCount(0);
        // Update the last processed URL
        lastProcessedUrlRef.current = initialCoverImageUrl;
        loadImage(initialCoverImageUrl);
    }, [initialCoverImageUrl]);
    // Handle retry logic when image loading fails
    (0,react.useEffect)(() => {
        if (retryCount > 0 && retryCount <= maxRetries) {
            console.log(`[ProjectCard] Retrying image load (attempt ${retryCount}/${maxRetries})`);
            if (initialCoverImageUrl) {
                loadImage(initialCoverImageUrl, true);
            }
        }
    }, [retryCount]);
    // Get a placeholder image URL based on the project name or genre
    const getPlaceholderImage = () => {
        // Use a simple SVG data URL as a placeholder to avoid external dependencies
        const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3E${encodeURIComponent(projectName || 'Project Image')}%3C/text%3E%3C/svg%3E`;
        return placeholderSvg;
    };
    const loadImage = (url, isRetry = false) => {
        // Skip if no URL or invalid URL
        if (!url || typeof url !== 'string') {
            setCoverImageUrl(getPlaceholderImage());
            setImageError(true);
            return;
        }
        // Log the exact URL being loaded
        console.log('[ProjectCard] Attempting to load image URL:', url);
        // For blob URLs or invalid URLs, use a placeholder
        if (url.startsWith('blob:') || !url.startsWith('http')) {
            if (false) // removed by dead control flow
{}
            setCoverImageUrl(getPlaceholderImage());
            setImageError(false);
            return;
        }
        // Set a timeout for image loading (5 seconds)
        const timeoutId = setTimeout(() => {
            console.warn(`[ProjectCard] Image load timed out: ${url}`);
            setCoverImageUrl(getPlaceholderImage());
            setImageError(true);
            // Retry logic
            if (!isRetry && retryCount < maxRetries) {
                console.log(`[ProjectCard] Retrying image load (attempt ${retryCount + 1}/${maxRetries})`);
                setRetryCount(prev => prev + 1);
            }
        }, 5000);
        // Create a new image object to test loading
        const testImage = new Image();
        // Handle successful load
        testImage.onload = () => {
            clearTimeout(timeoutId);
            setCoverImageUrl(url);
            setImageError(false);
        };
        // Handle image load errors
        testImage.onerror = () => {
            clearTimeout(timeoutId);
            console.warn(`[ProjectCard] Failed to load image: ${url}`);
            setCoverImageUrl(getPlaceholderImage());
            setImageError(true);
            // Retry logic
            if (!isRetry && retryCount < maxRetries) {
                console.log(`[ProjectCard] Retrying image load (attempt ${retryCount + 1}/${maxRetries})`);
                setRetryCount(prev => prev + 1);
            }
        };
        // Start loading the image
        testImage.src = url;
    };
    const handleImageLoadError = (url, isRetry) => {
        if (url === lastProcessedUrlRef.current) {
            console.warn(`[ProjectCard] Failed to load image: ${url}`);
            // If this wasn't a retry and we haven't exceeded max retries, schedule a retry
            if (!isRetry && retryCount < maxRetries) {
                console.log(`[ProjectCard] Scheduling retry in 1 second...`);
                retryTimeoutRef.current = setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                }, 1000);
            }
            else {
                // If we've exhausted retries or this was a retry attempt, use placeholder
                setCoverImageUrl(getPlaceholderImage());
                setImageError(false); // Don't show error state since we have a fallback
            }
        }
    };
    const handleImageError = (e) => {
        const target = e.target;
        console.warn(`[ProjectCard] Image error:`, {
            src: target.src,
            currentSrc: target.currentSrc,
            naturalWidth: target.naturalWidth,
            naturalHeight: target.naturalHeight,
            complete: target.complete,
            width: target.width,
            height: target.height
        });
        // Only update state if this is the current URL we're trying to load
        if (coverImageUrl && target.src.includes(coverImageUrl)) {
            // If we haven't retried yet, schedule a retry
            if (retryCount < maxRetries) {
                console.log(`[ProjectCard] Scheduling retry from onError handler...`);
                setRetryCount(prev => prev + 1);
            }
            else {
                // If we've exhausted retries, use placeholder
                setCoverImageUrl(getPlaceholderImage());
                setImageError(false);
            }
        }
    };
    // Helper to format status text using translations
    const formatStatusText = (status) => {
        const statusKey = status.toLowerCase().replace(/-/g, '').replace(/_/g, '');
        switch (statusKey) {
            case 'inproduction':
            case 'production':
                return t('projectStatus.inProduction');
            case 'preproduction':
                return t('projectStatus.preProduction');
            case 'postproduction':
                return t('projectStatus.postProduction');
            case 'development':
                return t('projectStatus.development');
            case 'completed':
                return t('projectStatus.completed');
            case 'cancelled':
                return t('projectStatus.cancelled');
            case 'canceled':
                return t('projectStatus.canceled');
            case 'filming':
                return t('projectStatus.filming');
            default:
                return t('projectStatus.unknown');
        }
    };
    const formatDateWithFallback = (dateString) => {
        // Handle empty strings or falsy values
        if (!dateString || (typeof dateString === 'string' && dateString.trim() === '')) {
            return '';
        }
        // Handle Firestore Timestamp objects
        if (dateString && typeof dateString === 'object' && dateString.toDate) {
            const date = dateString.toDate();
            const formatted = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(date);
            return formatted;
        }
        // Handle string dates
        if (typeof dateString === 'string') {
            const date = new Date(dateString);
            // Check if the date is valid
            if (isNaN(date.getTime())) {
                return '';
            }
            const formatted = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(date);
            return formatted;
        }
        return '';
    };
    return ((0,jsx_runtime.jsxs)(Card/* default */.Ay, { className: `bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col ${className}`, style: { padding: 20, minHeight: 340, maxWidth: 370, margin: 'auto', boxSizing: 'border-box' }, hoverable: true, children: [(0,jsx_runtime.jsxs)("div", { style: { width: '100%', height: 180, position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 12, background: '#f8fafc' }, children: [onBookmark && ((0,jsx_runtime.jsx)("button", { onClick: handleBookmarkClick, className: `absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all duration-200 ${isBookmarked
                            ? 'bg-blue-500/20 hover:bg-blue-500/30 shadow-sm'
                            : 'bg-white/10 hover:bg-white/20 shadow-sm'}`, title: isBookmarked ? t('projectCard.removeBookmark') : t('projectCard.addBookmark'), style: { pointerEvents: 'auto' }, "data-testid": "bookmark-button", children: isBookmarked ? ((0,jsx_runtime.jsx)(bookmark_check/* default */.A, { size: 16, className: "text-blue-600 fill-current" })) : ((0,jsx_runtime.jsx)(bookmark/* default */.A, { size: 16, className: "text-gray-600 hover:text-blue-500" })) })), coverImageUrl && !imageError ? ((0,jsx_runtime.jsx)("img", { src: coverImageUrl, alt: `${projectName || 'Untitled Project'} cover`, className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105", loading: "lazy", onError: e => { handleImageError(e); (0,imageErrorFallback/* imageErrorFallback */.i)(e, getPlaceholderImage()); }, onLoad: () => setImageError(false) }, coverImageUrl)) : ((0,jsx_runtime.jsxs)("div", { className: "w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center text-center p-4", children: [(0,jsx_runtime.jsx)(ImageOff, { size: 32, className: "text-gray-400 mb-2" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: retryCount > 0 && retryCount <= maxRetries
                                    ? `${t('projectStatus.loadingImage', { count: retryCount, max: maxRetries })}`
                                    : t('projectStatus.imageNotAvailable') }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: initialCoverImageUrl ? t('projectStatus.failedToLoadImage') : t('projectStatus.noImageAvailable') })] }))] }), (0,jsx_runtime.jsxs)(Card/* CardBody */.bw, { className: "flex-1 flex flex-col", children: [(0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsx)(jsx_runtime.Fragment, { children: (0,jsx_runtime.jsx)("div", { className: "text-base font-medium mb-2 leading-tight truncate", title: projectName && projectName.trim() ? projectName : 'Untitled Project', style: {
                                        minHeight: 20,
                                        letterSpacing: '-0.01em',
                                        background: 'rgba(250,252,255,0.92)',
                                        color: '#23272f',
                                        padding: '5px 10px',
                                        borderRadius: 8,
                                        marginBottom: 8,
                                        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
                                        border: '1px solid #e5e7eb',
                                        maxWidth: '96%',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        fontWeight: 500,
                                        zIndex: 2,
                                        textShadow: 'none'
                                    }, children: projectName && projectName.trim() ? projectName : 'Untitled Project' }) }), (0,jsx_runtime.jsxs)("div", { className: `inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${statusStyles.bg} ${statusStyles.text}`, style: { minHeight: 24 }, children: [statusStyles.icon, (0,jsx_runtime.jsx)("span", { children: formatStatusText(status) })] }), productionCompany && ((0,jsx_runtime.jsxs)(Card/* CardDescription */.BT, { className: "flex items-center text-sm mb-3", children: [(0,jsx_runtime.jsx)(film/* default */.A, { size: 14, className: "mr-1.5 text-gray-400" }), productionCompany] })), primaryLocation && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center text-sm text-gray-500 mb-3", children: [(0,jsx_runtime.jsx)(map_pin/* default */.A, { size: 14, className: "mr-1.5 text-gray-400" }), primaryLocation] })), summary && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600 mb-4 line-clamp-3", children: summary })), genres.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-2 mt-3 mb-4", children: [genres.slice(0, 3).map((genre, index) => ((0,jsx_runtime.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: genre }, `${genre}-${index}`))), genres.length > 3 && ((0,jsx_runtime.jsxs)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600", children: ["+", genres.length - 3, " more"] }))] }))] }), (0,jsx_runtime.jsx)(Card/* CardFooter */.wL, { className: "pt-4 border-t border-gray-100", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between w-full", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center text-xs text-gray-500", children: [(0,jsx_runtime.jsx)(calendar/* default */.A, { size: 12, className: "mr-1" }), (0,jsx_runtime.jsx)("span", { children: (() => {
                                                const startDateFormatted = formatDateWithFallback(startDate);
                                                const endDateFormatted = formatDateWithFallback(endDate);
                                                if (!startDateFormatted && !endDateFormatted) {
                                                    return '';
                                                }
                                                if (startDateFormatted && endDateFormatted) {
                                                    return `${startDateFormatted} - ${endDateFormatted}`;
                                                }
                                                if (startDateFormatted) {
                                                    return startDateFormatted;
                                                }
                                                if (endDateFormatted) {
                                                    return endDateFormatted;
                                                }
                                                return '';
                                            })() })] }), (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "ghost", size: "sm", className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50", onClick: handleCardClick, children: [t('projectStatus.viewDetails'), " \u2192"] })] }) })] })] }));
};
/* harmony default export */ const components_ProjectCard = (ProjectCard);


/***/ }),

/***/ 2307:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Calendar)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("calendar", __iconNode);


//# sourceMappingURL=calendar.js.map


/***/ }),

/***/ 4316:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ BookmarkCheck)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z", key: "169p4p" }],
  ["path", { d: "m9 10 2 2 4-4", key: "1gnqz4" }]
];
const BookmarkCheck = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("bookmark-check", __iconNode);


//# sourceMappingURL=bookmark-check.js.map


/***/ }),

/***/ 6069:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ MapPin)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("map-pin", __iconNode);


//# sourceMappingURL=map-pin.js.map


/***/ }),

/***/ 6163:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Film)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M7 3v18", key: "bbkbws" }],
  ["path", { d: "M3 7.5h4", key: "zfgn84" }],
  ["path", { d: "M3 12h18", key: "1i2n21" }],
  ["path", { d: "M3 16.5h4", key: "1230mu" }],
  ["path", { d: "M17 3v18", key: "in4fa5" }],
  ["path", { d: "M17 7.5h4", key: "myr1c1" }],
  ["path", { d: "M17 16.5h4", key: "go4c1d" }]
];
const Film = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("film", __iconNode);


//# sourceMappingURL=film.js.map


/***/ }),

/***/ 7157:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Bookmark)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z", key: "1fy3hk" }]
];
const Bookmark = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("bookmark", __iconNode);


//# sourceMappingURL=bookmark.js.map


/***/ }),

/***/ 8390:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   g: () => (/* binding */ ProjectCrewService)
/* harmony export */ });
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9487);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7594);


class ProjectCrewService {
    /**
     * Add a crew member to a project
     */
    static async addCrewMember(projectId, crewMember) {
        try {
            console.log('[ProjectCrewService] Adding crew member to project:', projectId);
            console.log('[ProjectCrewService] Crew member data:', crewMember);
            const projectRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_0__.db, this.PROJECTS_COLLECTION, projectId);
            const projectDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.getDoc)(projectRef);
            if (!projectDoc.exists()) {
                console.error('[ProjectCrewService] Project not found:', projectId);
                throw new Error('Project not found');
            }
            const projectData = projectDoc.data();
            const existingCrew = projectData.crewMembers || [];
            console.log('[ProjectCrewService] Existing crew members:', existingCrew.length);
            // Check if user is already a crew member
            const isAlreadyCrewMember = existingCrew.some(member => member.userId === crewMember.userId);
            if (isAlreadyCrewMember) {
                console.error('[ProjectCrewService] User is already a crew member:', crewMember.userId);
                throw new Error('User is already a crew member of this project');
            }
            const newCrewMember = {
                ...crewMember,
                joinedAt: firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .Timestamp */ .Dc.now()
            };
            console.log('[ProjectCrewService] New crew member to add:', newCrewMember);
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .updateDoc */ .mZ)(projectRef, {
                crewMembers: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .arrayUnion */ .hq)(newCrewMember),
                lastUpdated: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .serverTimestamp */ .O5)(),
                updateCount: (projectData.updateCount || 0) + 1
            });
            console.log('[ProjectCrewService] Crew member added successfully');
        }
        catch (error) {
            console.error('[ProjectCrewService] Error adding crew member:', error);
            throw error;
        }
    }
    /**
     * Remove a crew member from a project
     */
    static async removeCrewMember(projectId, userId, removedBy) {
        try {
            const projectRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_0__.db, this.PROJECTS_COLLECTION, projectId);
            const projectDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.getDoc)(projectRef);
            if (!projectDoc.exists()) {
                throw new Error('Project not found');
            }
            const projectData = projectDoc.data();
            const existingCrew = projectData.crewMembers || [];
            // Find the crew member to remove
            const crewMemberToRemove = existingCrew.find(member => member.userId === userId);
            if (!crewMemberToRemove) {
                throw new Error('Crew member not found in project');
            }
            // Check permissions
            const isOwner = projectData.owner_uid === removedBy;
            const isSelfRemoval = userId === removedBy;
            if (!isOwner && !isSelfRemoval) {
                throw new Error('Insufficient permissions to remove crew member');
            }
            if (isSelfRemoval && !crewMemberToRemove.canRemoveSelf) {
                throw new Error('You cannot remove yourself from this project');
            }
            // Remove the crew member
            const updatedCrew = existingCrew.filter(member => member.userId !== userId);
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .updateDoc */ .mZ)(projectRef, {
                crewMembers: updatedCrew,
                lastUpdated: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .serverTimestamp */ .O5)(),
                updateCount: (projectData.updateCount || 0) + 1
            });
        }
        catch (error) {
            console.error('Error removing crew member:', error);
            throw error;
        }
    }
    /**
     * Get all projects where a user is a crew member
     */
    static async getProjectsForCrewMember(userId) {
        try {
            console.log('[ProjectCrewService] Getting projects for crew member:', userId);
            const projectsRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_0__.db, this.PROJECTS_COLLECTION);
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .getDocs */ .GG)(projectsRef);
            const projects = [];
            console.log('[ProjectCrewService] Total projects found:', snapshot.docs.length);
            snapshot.forEach(doc => {
                const projectData = doc.data();
                const crewMembers = projectData.crewMembers || [];
                console.log('[ProjectCrewService] Project:', doc.id, 'has crew members:', crewMembers.length);
                // Check if user is in the crew members array
                const isCrewMember = crewMembers.some(member => member.userId === userId && member.status === 'active');
                if (isCrewMember) {
                    console.log('[ProjectCrewService] User is crew member of project:', doc.id);
                    projects.push({ id: doc.id, ...projectData });
                }
            });
            console.log('[ProjectCrewService] Total crew projects found for user:', projects.length);
            return projects;
        }
        catch (error) {
            console.error('Error getting projects for crew member:', error);
            throw error;
        }
    }
    /**
     * Get crew members for a project
     */
    static async getProjectCrewMembers(projectId) {
        try {
            console.log('[ProjectCrewService] Getting crew members for project:', projectId);
            const projectRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_0__.db, this.PROJECTS_COLLECTION, projectId);
            const projectDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.getDoc)(projectRef);
            if (!projectDoc.exists()) {
                console.error('[ProjectCrewService] Project not found:', projectId);
                throw new Error('Project not found');
            }
            const projectData = projectDoc.data();
            const crewMembers = projectData.crewMembers || [];
            console.log('[ProjectCrewService] Found crew members:', crewMembers.length);
            return crewMembers;
        }
        catch (error) {
            console.error('[ProjectCrewService] Error getting project crew members:', error);
            throw error;
        }
    }
    /**
     * Check if a user is a crew member of a project
     */
    static async isUserCrewMember(projectId, userId) {
        try {
            const crewMembers = await this.getProjectCrewMembers(projectId);
            return crewMembers.some(member => member.userId === userId && member.status === 'active');
        }
        catch (error) {
            console.error('Error checking if user is crew member:', error);
            return false;
        }
    }
    /**
     * Update crew member permissions
     */
    static async updateCrewMemberPermissions(projectId, userId, permissions) {
        try {
            const projectRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_0__.db, this.PROJECTS_COLLECTION, projectId);
            const projectDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.getDoc)(projectRef);
            if (!projectDoc.exists()) {
                throw new Error('Project not found');
            }
            const projectData = projectDoc.data();
            const existingCrew = projectData.crewMembers || [];
            const updatedCrew = existingCrew.map(member => member.userId === userId
                ? { ...member, ...permissions }
                : member);
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .updateDoc */ .mZ)(projectRef, {
                crewMembers: updatedCrew,
                lastUpdated: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .serverTimestamp */ .O5)(),
                updateCount: (projectData.updateCount || 0) + 1
            });
        }
        catch (error) {
            console.error('Error updating crew member permissions:', error);
            throw error;
        }
    }
    /**
     * Invite a user to join a project
     */
    static async inviteCrewMember(projectId, invitation) {
        try {
            const projectRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_0__.db, this.PROJECTS_COLLECTION, projectId);
            const projectDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.getDoc)(projectRef);
            if (!projectDoc.exists()) {
                throw new Error('Project not found');
            }
            const projectData = projectDoc.data();
            const existingInvitations = projectData.invitedCrewMembers || [];
            // Check if user is already invited
            const isAlreadyInvited = existingInvitations.some(invite => invite.userId === invitation.userId && invite.status === 'pending');
            if (isAlreadyInvited) {
                throw new Error('User is already invited to this project');
            }
            // Check if user is already a crew member
            const existingCrew = projectData.crewMembers || [];
            const isAlreadyCrewMember = existingCrew.some(member => member.userId === invitation.userId);
            if (isAlreadyCrewMember) {
                throw new Error('User is already a crew member of this project');
            }
            const newInvitation = {
                ...invitation,
                invitedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .serverTimestamp */ .O5)(),
                status: 'pending',
                expiresAt: firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .Timestamp */ .Dc.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // 7 days
            };
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .updateDoc */ .mZ)(projectRef, {
                invitedCrewMembers: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .arrayUnion */ .hq)(newInvitation),
                lastUpdated: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .serverTimestamp */ .O5)(),
                updateCount: (projectData.updateCount || 0) + 1
            });
        }
        catch (error) {
            console.error('Error inviting crew member:', error);
            throw error;
        }
    }
    /**
     * Accept or decline a project invitation
     */
    static async respondToInvitation(projectId, userId, response) {
        try {
            const projectRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_0__.db, this.PROJECTS_COLLECTION, projectId);
            const projectDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.getDoc)(projectRef);
            if (!projectDoc.exists()) {
                throw new Error('Project not found');
            }
            const projectData = projectDoc.data();
            const existingInvitations = projectData.invitedCrewMembers || [];
            const invitation = existingInvitations.find(invite => invite.userId === userId && invite.status === 'pending');
            if (!invitation) {
                throw new Error('No pending invitation found for this user');
            }
            if (response === 'accepted') {
                // Add user to crew members
                const newCrewMember = {
                    userId: invitation.userId,
                    userEmail: invitation.userEmail,
                    displayName: invitation.displayName,
                    role: invitation.role,
                    department: invitation.department,
                    joinedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .serverTimestamp */ .O5)(),
                    status: 'active',
                    permissions: [],
                    canEdit: false,
                    canInvite: false,
                    canRemoveSelf: true
                };
                const existingCrew = projectData.crewMembers || [];
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .updateDoc */ .mZ)(projectRef, {
                    crewMembers: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .arrayUnion */ .hq)(newCrewMember),
                    invitedCrewMembers: existingInvitations.map(invite => invite.userId === userId
                        ? { ...invite, status: 'accepted' }
                        : invite),
                    lastUpdated: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .serverTimestamp */ .O5)(),
                    updateCount: (projectData.updateCount || 0) + 1
                });
            }
            else {
                // Mark invitation as declined
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .updateDoc */ .mZ)(projectRef, {
                    invitedCrewMembers: existingInvitations.map(invite => invite.userId === userId
                        ? { ...invite, status: 'declined' }
                        : invite),
                    lastUpdated: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .serverTimestamp */ .O5)(),
                    updateCount: (projectData.updateCount || 0) + 1
                });
            }
        }
        catch (error) {
            console.error('Error responding to invitation:', error);
            throw error;
        }
    }
}
ProjectCrewService.PROJECTS_COLLECTION = 'Projects';


/***/ })

}]);
//# sourceMappingURL=6901.chunk.js.map