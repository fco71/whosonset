"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[4649],{

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

/***/ 697:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Plus)
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
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("plus", __iconNode);


//# sourceMappingURL=plus.js.map


/***/ }),

/***/ 3893:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Users)
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
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("users", __iconNode);


//# sourceMappingURL=users.js.map


/***/ }),

/***/ 3954:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Mail)
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
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("mail", __iconNode);


//# sourceMappingURL=mail.js.map


/***/ }),

/***/ 4649:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_ProjectDetailPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var dist = __webpack_require__(7767);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./node_modules/firebase/storage/dist/esm/index.esm.js + 1 modules
var esm_index_esm = __webpack_require__(2539);
// EXTERNAL MODULE: ./node_modules/react-router-dom/dist/index.js
var react_router_dom_dist = __webpack_require__(4976);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
;// ./src/components/ProjectShowcase.tsx

const ProjectShowcase = ({ project, userId, onEditClick }) => {
    const handleSuggestClick = () => {
        const subject = `Suggestion for project: ${project.projectName}`;
        const body = encodeURIComponent(`I would like to suggest an update to "${project.projectName}".\n\nDetails:\n`);
        window.location.href = `mailto:admin@example.com?subject=${subject}&body=${body}`;
    };
    // Only show fields that have data
    const hasProductionInfo = project.productionCompany || project.country || project.startDate || project.endDate || (project.productionLocations && project.productionLocations.length > 0);
    const hasStoryInfo = project.logline || project.synopsis;
    return ((0,jsx_runtime.jsxs)("div", { className: "space-y-8", children: [hasProductionInfo && ((0,jsx_runtime.jsxs)("div", { className: "bg-gray-50 rounded-lg p-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Project Information" }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [project.productionCompany && ((0,jsx_runtime.jsx)(Field, { label: "Production Company", value: project.productionCompany })), project.country && ((0,jsx_runtime.jsx)(Field, { label: "Country", value: project.country })), project.startDate && ((0,jsx_runtime.jsx)(Field, { label: "Start Date", value: project.startDate })), project.endDate && ((0,jsx_runtime.jsx)(Field, { label: "End Date", value: project.endDate })), project.productionLocations && project.productionLocations.length > 0 && ((0,jsx_runtime.jsx)(Field, { label: "Location", value: project.productionLocations[0].city
                                    ? `${project.productionLocations[0].city}, ${project.productionLocations[0].country}`
                                    : project.productionLocations[0].country }))] })] })), hasStoryInfo && ((0,jsx_runtime.jsxs)("div", { className: "space-y-6", children: [project.logline && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Logline" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-700 leading-relaxed", children: project.logline })] })), project.synopsis && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Synopsis" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-700 whitespace-pre-line leading-relaxed", children: project.synopsis })] }))] })), !hasProductionInfo && !hasStoryInfo && ((0,jsx_runtime.jsx)("div", { className: "text-center py-8", children: (0,jsx_runtime.jsx)("p", { className: "text-gray-500 text-sm", children: "No additional project information available." }) }))] }));
};
const Field = ({ label, value }) => ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("dt", { className: "text-sm font-medium text-gray-600 mb-1", children: label }), (0,jsx_runtime.jsx)("dd", { className: "text-sm text-gray-900", children: value })] }));
/* harmony default export */ const components_ProjectShowcase = (ProjectShowcase);

// EXTERNAL MODULE: ./src/services/ProjectCrewService.ts
var ProjectCrewService = __webpack_require__(8390);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/users.js
var users = __webpack_require__(3893);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/plus.js
var plus = __webpack_require__(697);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/x.js
var x = __webpack_require__(8697);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/search.js
var search = __webpack_require__(8445);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/user.js
var icons_user = __webpack_require__(8686);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/user-check.js
var user_check = __webpack_require__(7623);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/trash-2.js
var trash_2 = __webpack_require__(2708);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/mail.js
var mail = __webpack_require__(3954);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/user-x.js
var user_x = __webpack_require__(6079);
;// ./src/components/ProjectCrewManagement.tsx








const ProjectCrewManagement = ({ project, onUpdate }) => {
    const { t } = (0,es/* useTranslation */.Bd)();
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [crewMembers, setCrewMembers] = (0,react.useState)([]);
    const [invitations, setInvitations] = (0,react.useState)([]);
    const [loading, setLoading] = (0,react.useState)(true);
    const [error, setError] = (0,react.useState)(null);
    const [showInviteForm, setShowInviteForm] = (0,react.useState)(false);
    const [inviteRole, setInviteRole] = (0,react.useState)('');
    const [inviteDepartment, setInviteDepartment] = (0,react.useState)('');
    // User search state
    const [userSearchQuery, setUserSearchQuery] = (0,react.useState)('');
    const [userSearchResults, setUserSearchResults] = (0,react.useState)([]);
    const [isSearchingUsers, setIsSearchingUsers] = (0,react.useState)(false);
    const [selectedUser, setSelectedUser] = (0,react.useState)(null);
    const isOwner = currentUser?.uid === project.owner_uid;
    const currentUserCrewMember = crewMembers.find(member => member.userId === currentUser?.uid);
    (0,react.useEffect)(() => {
        loadCrewData();
    }, [project.id]);
    const loadCrewData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [crew, invites] = await Promise.all([
                ProjectCrewService/* ProjectCrewService */.g.getProjectCrewMembers(project.id),
                Promise.resolve(project.invitedCrewMembers || [])
            ]);
            setCrewMembers(crew);
            setInvitations(invites);
        }
        catch (err) {
            console.error('Error loading crew data:', err);
            setError('Failed to load crew data');
        }
        finally {
            setLoading(false);
        }
    };
    // User search functionality
    const searchUsers = async (queryStr) => {
        if (!queryStr.trim()) {
            setUserSearchResults([]);
            return;
        }
        setIsSearchingUsers(true);
        try {
            // Search crew profiles
            const crewProfilesRef = (0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles');
            const crewQuery = (0,index_esm/* query */.P)(crewProfilesRef, (0,index_esm/* where */._M)('isPublished', '==', true), (0,index_esm/* limit */.AB)(20));
            const crewSnapshot = await (0,index_esm/* getDocs */.GG)(crewQuery);
            const results = [];
            crewSnapshot.docs.forEach(doc => {
                const data = doc.data();
                const name = data.name || data.displayName || data.firstName || '';
                if (doc.id !== currentUser?.uid &&
                    name.toLowerCase().includes(queryStr.toLowerCase())) {
                    results.push({
                        id: doc.id,
                        name: name || `Crew Member ${doc.id.slice(-4)}`,
                        email: data.email || '',
                        avatar: data.profileImageUrl || data.avatarUrl,
                        role: data.jobTitles?.[0]?.title || data.role || 'Crew Member',
                        company: data.company || ''
                    });
                }
            });
            console.log('[CrewManagement] Found users:', results.length);
            setUserSearchResults(results);
        }
        catch (error) {
            console.error('[CrewManagement] Error searching users:', error);
            setUserSearchResults([]);
        }
        finally {
            setIsSearchingUsers(false);
        }
    };
    const handleUserSearchChange = (query) => {
        setUserSearchQuery(query);
        if (query.trim()) {
            setTimeout(() => searchUsers(query), 300);
        }
        else {
            setUserSearchResults([]);
        }
    };
    const handleInviteCrewMember = async () => {
        if (!selectedUser) {
            setError(t('crewManagement.selectUser'));
            return;
        }
        try {
            setError(null);
            console.log('[CrewManagement] Starting to add crew member:', selectedUser.name);
            console.log('[CrewManagement] Project ID:', project.id);
            console.log('[CrewManagement] User ID:', selectedUser.id);
            console.log('[CrewManagement] Role:', inviteRole || 'Crew Member');
            console.log('[CrewManagement] Department:', inviteDepartment || 'General');
            // For now, allow adding any crew member without authentication requirements
            await ProjectCrewService/* ProjectCrewService */.g.addCrewMember(project.id, {
                userId: selectedUser.id,
                userEmail: selectedUser.email,
                displayName: selectedUser.name,
                role: inviteRole || 'Crew Member',
                department: inviteDepartment || 'General',
                status: 'active',
                permissions: [],
                canEdit: false,
                canInvite: false,
                canRemoveSelf: true
            });
            console.log('[CrewManagement] Crew member added successfully');
            setSelectedUser(null);
            setInviteRole('');
            setInviteDepartment('');
            setShowInviteForm(false);
            setUserSearchQuery('');
            setUserSearchResults([]);
            onUpdate();
            loadCrewData();
        }
        catch (err) {
            console.error('[CrewManagement] Error adding crew member:', err);
            console.error('[CrewManagement] Error details:', {
                message: err.message,
                code: err.code,
                stack: err.stack
            });
            setError(err.message || t('crewManagement.failedToInvite'));
        }
    };
    const handleRemoveCrewMember = async (userId) => {
        if (!currentUser?.uid)
            return;
        try {
            setError(null);
            await ProjectCrewService/* ProjectCrewService */.g.removeCrewMember(project.id, userId, currentUser.uid);
            onUpdate();
            loadCrewData();
        }
        catch (err) {
            console.error('Error removing crew member:', err);
            setError(err.message || t('crewManagement.failedToRemove'));
        }
    };
    const handleRespondToInvitation = async (invitation, response) => {
        try {
            setError(null);
            await ProjectCrewService/* ProjectCrewService */.g.respondToInvitation(project.id, invitation.userId, response);
            onUpdate();
            loadCrewData();
        }
        catch (err) {
            console.error('Error responding to invitation:', err);
            setError(err.message || t('crewManagement.failedToRespond'));
        }
    };
    const canInvite = isOwner || currentUserCrewMember?.canInvite;
    const canRemove = isOwner || (currentUserCrewMember?.canEdit && currentUserCrewMember?.userId === currentUser?.uid);
    console.log('[CrewManagement] Debug info:', {
        isOwner,
        currentUserCrewMember,
        canInvite,
        currentUser: currentUser?.uid
    });
    if (loading) {
        return ((0,jsx_runtime.jsx)("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: (0,jsx_runtime.jsxs)("div", { className: "animate-pulse", children: [(0,jsx_runtime.jsx)("div", { className: "h-6 bg-gray-200 rounded w-1/3 mb-4" }), (0,jsx_runtime.jsx)("div", { className: "space-y-3", children: [1, 2, 3].map(i => ((0,jsx_runtime.jsx)("div", { className: "h-16 bg-gray-200 rounded" }, i))) })] }) }));
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)(users/* default */.A, { className: "w-5 h-5 text-gray-600" }), (0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: t('crewManagement.title') }), (0,jsx_runtime.jsx)("span", { className: "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full", children: crewMembers.length })] }), (0,jsx_runtime.jsxs)("button", { onClick: () => setShowInviteForm(true), className: "flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", style: { display: canInvite ? 'flex' : 'none' }, children: [(0,jsx_runtime.jsx)(plus/* default */.A, { className: "w-4 h-4" }), "Add Crew Member"] })] }), error && ((0,jsx_runtime.jsx)("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded-lg", children: (0,jsx_runtime.jsx)("p", { className: "text-red-700 text-sm", children: error }) })), showInviteForm && ((0,jsx_runtime.jsxs)("div", { className: "mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0,jsx_runtime.jsx)("h4", { className: "font-medium text-gray-900", children: "Add New Crew Member" }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                    setShowInviteForm(false);
                                    setSelectedUser(null);
                                    setUserSearchQuery('');
                                    setUserSearchResults([]);
                                }, className: "text-gray-400 hover:text-gray-600", children: (0,jsx_runtime.jsx)(x/* default */.A, { className: "w-5 h-5" }) })] }), (0,jsx_runtime.jsxs)("div", { className: "mb-4", children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Search Crew Members" }), (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)("input", { type: "text", value: userSearchQuery, onChange: (e) => handleUserSearchChange(e.target.value), className: "w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Search by name, role, or company..." }), (0,jsx_runtime.jsx)(search/* default */.A, { className: "absolute left-3 top-2.5 w-4 h-4 text-gray-400" })] }), userSearchResults.length > 0 && ((0,jsx_runtime.jsx)("div", { className: "mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg", children: userSearchResults.map((user) => ((0,jsx_runtime.jsx)("div", { onClick: () => setSelectedUser(user), className: `p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${selectedUser?.id === user.id ? 'bg-blue-50 border-blue-200' : ''}`, children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("div", { className: "w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center", children: user.avatar ? ((0,jsx_runtime.jsx)("img", { src: user.avatar, alt: user.name, className: "w-8 h-8 rounded-full" })) : ((0,jsx_runtime.jsx)(icons_user/* default */.A, { className: "w-4 h-4 text-blue-600" })) }), (0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: user.name }), (0,jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600", children: [user.role, " \u2022 ", user.company] })] }), selectedUser?.id === user.id && ((0,jsx_runtime.jsx)(user_check/* default */.A, { className: "w-4 h-4 text-blue-600" }))] }) }, user.id))) })), isSearchingUsers && ((0,jsx_runtime.jsx)("div", { className: "mt-2 text-sm text-gray-500", children: "Searching..." }))] }), selectedUser && ((0,jsx_runtime.jsx)("div", { className: "mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center", children: selectedUser.avatar ? ((0,jsx_runtime.jsx)("img", { src: selectedUser.avatar, alt: selectedUser.name, className: "w-10 h-10 rounded-full" })) : ((0,jsx_runtime.jsx)(icons_user/* default */.A, { className: "w-5 h-5 text-blue-600" })) }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: selectedUser.name }), (0,jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600", children: [selectedUser.role, " \u2022 ", selectedUser.company] })] })] }) })), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: t('crewManagement.role') }), (0,jsx_runtime.jsx)("input", { type: "text", value: inviteRole, onChange: (e) => setInviteRole(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: t('crewManagement.rolePlaceholder') })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: t('crewManagement.department') }), (0,jsx_runtime.jsx)("input", { type: "text", value: inviteDepartment, onChange: (e) => setInviteDepartment(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: t('crewManagement.departmentPlaceholder') })] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-3 mt-4", children: [(0,jsx_runtime.jsx)("button", { onClick: handleInviteCrewMember, disabled: !selectedUser, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: "Add Crew Member" }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                    setShowInviteForm(false);
                                    setSelectedUser(null);
                                    setUserSearchQuery('');
                                    setUserSearchResults([]);
                                }, className: "px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors", children: t('crewManagement.cancel') })] })] })), (0,jsx_runtime.jsx)("div", { className: "space-y-3", children: crewMembers.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "text-center py-8 text-gray-500", children: [(0,jsx_runtime.jsx)(users/* default */.A, { className: "w-12 h-12 mx-auto mb-3 text-gray-300" }), (0,jsx_runtime.jsx)("p", { children: t('crewManagement.noCrewMembers') }), canInvite && ((0,jsx_runtime.jsx)("p", { className: "text-sm mt-1", children: t('crewManagement.inviteToGetStarted') }))] })) : (crewMembers.map((member) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center", children: (0,jsx_runtime.jsx)(icons_user/* default */.A, { className: "w-5 h-5 text-blue-600" }) }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: member.displayName }), (0,jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600", children: [member.role, " \u2022 ", member.department] }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: t('crewManagement.joinedRecently') })] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [member.status === 'active' && ((0,jsx_runtime.jsx)("span", { className: "bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full", children: t('crewManagement.active') })), (isOwner || (member.userId === currentUser?.uid && member.canRemoveSelf)) && ((0,jsx_runtime.jsx)("button", { onClick: () => handleRemoveCrewMember(member.userId), className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors", title: t('crewManagement.removeFromProject'), children: (0,jsx_runtime.jsx)(trash_2/* default */.A, { className: "w-4 h-4" }) }))] })] }, member.userId)))) }), invitations.filter(invite => invite.status === 'pending').length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "mt-6", children: [(0,jsx_runtime.jsx)("h4", { className: "font-medium text-gray-900 mb-3", children: t('crewManagement.pendingInvitations') }), (0,jsx_runtime.jsx)("div", { className: "space-y-3", children: invitations
                            .filter(invite => invite.status === 'pending')
                            .map((invitation) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("div", { className: "w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center", children: (0,jsx_runtime.jsx)(mail/* default */.A, { className: "w-5 h-5 text-yellow-600" }) }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: invitation.displayName }), (0,jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600", children: [invitation.role, " \u2022 ", invitation.department] }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: invitation.userEmail })] })] }), invitation.userId === currentUser?.uid && ((0,jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [(0,jsx_runtime.jsx)("button", { onClick: () => handleRespondToInvitation(invitation, 'accepted'), className: "px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors", children: (0,jsx_runtime.jsx)(user_check/* default */.A, { className: "w-4 h-4" }) }), (0,jsx_runtime.jsx)("button", { onClick: () => handleRespondToInvitation(invitation, 'declined'), className: "px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors", children: (0,jsx_runtime.jsx)(user_x/* default */.A, { className: "w-4 h-4" }) })] }))] }, invitation.userId))) })] }))] }));
};
/* harmony default export */ const components_ProjectCrewManagement = (ProjectCrewManagement);

// EXTERNAL MODULE: ./src/utilities/imageErrorFallback.ts
var imageErrorFallback = __webpack_require__(676);
;// ./src/components/ProjectDetail.tsx

// src/components/ProjectDetail.tsx










// import LoadingSpinner from '../components/LoadingSpinner';

const LoadingSpinner = () => (0,jsx_runtime.jsx)("div", { className: "text-white text-center mt-10 p-4", children: (0,es/* useTranslation */.Bd)().t('common.loading') });
const ProjectDetail = () => {
    const { t } = (0,es/* useTranslation */.Bd)();
    const { projectId } = (0,dist/* useParams */.g)();
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const navigate = (0,dist/* useNavigate */.Zp)();
    const [project, setProject] = (0,react.useState)(null);
    const [loading, setLoading] = (0,react.useState)(true);
    const [error, setError] = (0,react.useState)(null);
    const [isEditing, setIsEditing] = (0,react.useState)(false);
    const [saveSuccess, setSaveSuccess] = (0,react.useState)(false);
    const [coverImage, setCoverImage] = (0,react.useState)(null);
    const [coverImageBlobUrl, setCoverImageBlobUrl] = (0,react.useState)(null);
    // Track blob URL with ref for proper cleanup
    const coverImageBlobRef = (0,react.useRef)(null);
    const [formState, setFormState] = (0,react.useState)({});
    const fetchProject = async () => {
        setLoading(true);
        setError(null);
        setProject(null);
        try {
            if (projectId) {
                const projectDocRef = (0,index_esm.doc)(firebase.db, 'Projects', projectId);
                const projectDocSnapshot = await (0,index_esm.getDoc)(projectDocRef);
                if (projectDocSnapshot.exists()) {
                    const firestoreData = projectDocSnapshot.data();
                    const projectWithDefaults = {
                        id: projectDocSnapshot.id,
                        projectName: firestoreData.projectName || '',
                        country: firestoreData.country || '',
                        productionCompany: firestoreData.productionCompany || '',
                        status: firestoreData.status || 'pre_production',
                        logline: firestoreData.logline || '',
                        synopsis: firestoreData.synopsis || '',
                        startDate: firestoreData.startDate || '',
                        endDate: firestoreData.endDate || '',
                        productionLocations: firestoreData.productionLocations || [],
                        genre: firestoreData.genre || '',
                        director: firestoreData.director || '',
                        producer: firestoreData.producer || '',
                        coverImageUrl: firestoreData.coverImageUrl || '',
                        projectWebsite: firestoreData.projectWebsite || '',
                        productionBudget: firestoreData.productionBudget || '',
                        productionCompanyContact: firestoreData.productionCompanyContact || '',
                        isVerified: typeof firestoreData.isVerified === 'boolean' ? firestoreData.isVerified : false,
                        owner_uid: firestoreData.owner_uid || '',
                        genres: firestoreData.genres || (firestoreData.genre ? [firestoreData.genre] : []),
                        ownerId: firestoreData.ownerId || '',
                        // Required Project model properties
                        hierarchy: firestoreData.hierarchy || { level: 'junior', department: '', role: '', permissions: [], canEdit: false, canApprove: false, canInvite: false },
                        verificationStatus: firestoreData.verificationStatus || 'pending',
                        accessLevel: firestoreData.accessLevel || 'public',
                        isExclusive: firestoreData.isExclusive || false,
                        priority: firestoreData.priority || 'medium',
                        lastUpdated: firestoreData.lastUpdated || null,
                        updateCount: firestoreData.updateCount || 0
                    };
                    setProject(projectWithDefaults);
                    setFormState(projectWithDefaults);
                }
                else {
                    setError('Project not found.');
                }
            }
            else {
                setError('Project ID is missing.');
            }
        }
        catch (err) {
            console.error("Error fetching project:", err);
            setError(err.message || 'Failed to fetch project data.');
        }
        finally {
            setLoading(false);
        }
    };
    (0,react.useEffect)(() => {
        if (projectId) {
            fetchProject();
        }
        else {
            setError("Project ID is missing from URL.");
            setLoading(false);
        }
    }, [projectId]);
    (0,react.useEffect)(() => {
        if (!isEditing) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [isEditing]);
    const handleEditClick = () => {
        if (project) {
            setFormState({ ...project });
            setIsEditing(true);
            setError(null);
        }
    };
    const handleCancelClick = () => {
        setIsEditing(false);
        setCoverImage(null);
        // Clean up blob URL when canceling
        if (coverImageBlobRef.current) {
            URL.revokeObjectURL(coverImageBlobRef.current);
            coverImageBlobRef.current = null;
        }
        setCoverImageBlobUrl(null);
        setFormState(prevState => ({
            ...prevState,
            projectName: project?.projectName || '',
            country: project?.country || '',
            productionCompany: project?.productionCompany || '',
            status: project?.status || 'pre_production',
            logline: project?.logline || '',
            synopsis: project?.synopsis || '',
            startDate: project?.startDate || '',
            endDate: project?.endDate || '',
            genres: project?.genres || [],
            genre: project?.genre || '',
            director: project?.director || '',
            producer: project?.producer || '',
            coverImageUrl: project?.coverImageUrl || '',
            projectWebsite: project?.projectWebsite || '',
            productionBudget: project?.productionBudget || '',
            productionCompanyContact: project?.productionCompanyContact || ''
        }));
    };
    const handleCoverImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Clean up previous blob URL
            if (coverImageBlobRef.current) {
                URL.revokeObjectURL(coverImageBlobRef.current);
            }
            // Create new blob URL
            const blobUrl = URL.createObjectURL(file);
            coverImageBlobRef.current = blobUrl;
            setCoverImageBlobUrl(blobUrl);
            setCoverImage(file);
        }
    };
    const deleteOldImage = async (url) => {
        if (!url || !url.startsWith("https://firebasestorage.googleapis.com/"))
            return;
        try {
            const pathWithQuery = url.split("/o/")[1];
            if (!pathWithQuery) {
                console.warn("Could not parse path from old image URL:", url);
                return;
            }
            const encodedPath = pathWithQuery.split("?")[0];
            const decodedPath = decodeURIComponent(encodedPath);
            const oldRef = (0,esm_index_esm/* ref */.KR)(firebase/* storage */.IG, decodedPath);
            await (0,esm_index_esm/* deleteObject */.XR)(oldRef);
            console.log("Old image deleted successfully:", decodedPath);
        }
        catch (e) {
            if (e && typeof e === 'object' && 'code' in e && e.code === 'storage/object-not-found') {
                console.log("Old image not found:", url);
            }
            else if (e instanceof Error) {
                console.warn("Could not delete old image:", url, e.message);
            }
            else {
                console.warn("Could not delete old image:", url, e);
            }
        }
    };
    const uploadImage = async (imageFile, baseImageName) => {
        if (!imageFile)
            return '';
        if (!projectId) {
            setError("Project ID is missing for image upload.");
            return '';
        }
        if (!imageFile.type.startsWith("image/")) {
            setError("Please upload a valid image file.");
            return '';
        }
        const storageRef = (0,esm_index_esm/* ref */.KR)(firebase/* storage */.IG, `projects/${projectId}/${baseImageName}`);
        try {
            await (0,esm_index_esm/* uploadBytes */.D)(storageRef, imageFile);
            return await (0,esm_index_esm/* getDownloadURL */.qk)(storageRef);
        }
        catch (uploadError) {
            if (uploadError instanceof Error) {
                console.error("Error uploading image: ", uploadError);
                setError(`Image upload failed: ${uploadError.message}`);
            }
            else {
                console.error("Error uploading image: ", uploadError);
                setError("Image upload failed.");
            }
            return '';
        }
    };
    const handleSaveClick = async () => {
        if (!project || !projectId) {
            setError("Cannot save, project data missing.");
            return;
        }
        // More robust check for actual changes
        const formKeys = Object.keys(formState);
        const hasTextChanged = formKeys.some(key => {
            if (key === 'genres') { // Special handling for arrays
                return JSON.stringify(formState[key] || []) !== JSON.stringify(project[key] || []);
            }
            // REMOVED THE LINE THAT CAUSED THE ERROR: if (key === 'posterImageUrl') { return false; }
            return formState[key] !== project[key];
        });
        // Simplified check for image changes, as only coverImage remains
        if (!hasTextChanged && !coverImage) {
            setIsEditing(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            let newCoverImageUrl = project.coverImageUrl;
            // Removed newPosterImageUrl
            if (coverImage) {
                if (project.coverImageUrl)
                    await deleteOldImage(project.coverImageUrl);
                const coverExtension = coverImage.name.split('.').pop() || 'jpg';
                newCoverImageUrl = await uploadImage(coverImage, `cover_${projectId}_${Date.now()}.${coverExtension}`);
                if (!newCoverImageUrl) {
                    setLoading(false);
                    return;
                }
            }
            // Removed posterImage upload logic
            const updatedData = { ...formState, coverImageUrl: newCoverImageUrl }; // Removed posterImageUrl from here
            if (formState.genres && Array.isArray(formState.genres)) {
                updatedData.genres = formState.genres;
                if (updatedData.hasOwnProperty('genre'))
                    delete updatedData.genre;
            }
            else if (typeof formState.genre === 'string') {
                updatedData.genres = formState.genre.split(',').map(g => g.trim()).filter(g => g);
                if (updatedData.hasOwnProperty('genre'))
                    delete updatedData.genre;
            }
            const { id, owner_uid, ownerId, ...writableData } = updatedData; // ownerId might also be immutable
            // Ensure posterImageUrl is removed from writableData if it somehow remains
            if (writableData.hasOwnProperty('posterImageUrl')) {
                delete writableData.posterImageUrl;
            }
            await (0,index_esm/* updateDoc */.mZ)((0,index_esm.doc)(firebase.db, 'Projects', projectId), writableData);
            // Update local project state
            setProject(prev => {
                if (!prev)
                    return null;
                const newProjectState = {
                    ...prev, // Start with previous state
                    ...formState, // Apply changes from formState
                    coverImageUrl: newCoverImageUrl, // Ensure new image URL is used
                    // Removed posterImageUrl from newProjectState
                    genres: writableData.genres || prev.genres, // Update genres
                    id: projectId, // Ensure ID is preserved
                    owner_uid: prev.owner_uid // Ensure owner_uid is preserved
                };
                // If genres array was set, ensure single 'genre' string is removed from local state if it exists
                if (newProjectState.genres && newProjectState.hasOwnProperty('genre')) {
                    delete newProjectState.genre;
                }
                // Ensure posterImageUrl is removed from local state
                if (newProjectState.hasOwnProperty('posterImageUrl')) {
                    delete newProjectState.posterImageUrl;
                }
                return newProjectState;
            });
            // Also update formState to reflect the saved state, including new image URLs
            setFormState(prev => ({ ...prev, ...writableData, coverImageUrl: newCoverImageUrl })); // Removed posterImageUrl from here
            setCoverImage(null); // Removed setPosterImage
            // Clean up blob URL after successful save
            if (coverImageBlobRef.current) {
                URL.revokeObjectURL(coverImageBlobRef.current);
                coverImageBlobRef.current = null;
            }
            setCoverImageBlobUrl(null);
            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
        catch (saveError) {
            if (saveError instanceof Error) {
                console.error("Error updating project:", saveError);
                setError(saveError.message || "Failed to save.");
            }
            else {
                console.error("Error updating project:", saveError);
                setError("Failed to save.");
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };
    const handleGenresChange = (e) => {
        const { value } = e.target;
        const genresArray = value.split(',').map(g => g.trim()).filter(g => g);
        setFormState(prev => ({ ...prev, genres: genresArray, genre: value })); // Keep genre string for input field
    };
    const handleSuggestClick = () => {
        const subject = `Suggestion for project: ${project?.projectName}`;
        const body = encodeURIComponent(`I would like to suggest an update for "${project?.projectName}".\n\nDetails:\n`);
        window.location.href = `mailto:admin@example.com?subject=${subject}&body=${body}`; // Replace with your admin email
    };
    const handleDeleteClick = async () => {
        if (!project || !projectId)
            return;
        if (window.confirm(t('projectForm.confirmDelete'))) {
            try {
                // Delete the project document
                await (0,index_esm/* deleteDoc */.kd)((0,index_esm.doc)(firebase.db, 'Projects', projectId));
                // Delete cover image if it exists
                if (project.coverImageUrl) {
                    try {
                        // Extract the storage path from the download URL
                        const url = new URL(project.coverImageUrl);
                        const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
                        if (pathMatch) {
                            const storagePath = decodeURIComponent(pathMatch[1]);
                            const imageRef = (0,esm_index_esm/* ref */.KR)(firebase/* storage */.IG, storagePath);
                            await (0,esm_index_esm/* deleteObject */.XR)(imageRef);
                        }
                    }
                    catch (error) {
                        console.error('Error deleting cover image:', error);
                    }
                }
                // Navigate back to projects page
                navigate('/projects');
            }
            catch (error) {
                console.error('Error deleting project:', error);
                alert(t('projectForm.deleteFailed'));
            }
        }
    };
    // Cleanup blob URL when component unmounts or when coverImage changes
    (0,react.useEffect)(() => {
        return () => {
            if (coverImageBlobRef.current) {
                URL.revokeObjectURL(coverImageBlobRef.current);
            }
        };
    }, []);
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gray-50 p-6", children: [(0,jsx_runtime.jsx)(react_router_dom_dist/* Link */.N_, { to: "/projects", className: "inline-block mb-6 text-blue-600 hover:text-blue-700 transition-colors", children: t('projects.backToProjects') }), isEditing ? (
            // --- EDITING FORM ---
            (0,jsx_runtime.jsxs)("form", { className: "max-w-5xl mx-auto p-6 bg-white rounded shadow-md space-y-6", children: [error && (0,jsx_runtime.jsx)("p", { className: "text-red-600 text-sm mb-4", children: error }), saveSuccess && (0,jsx_runtime.jsx)("p", { className: "text-green-500 text-sm mb-4", children: t('projectForm.updateSuccess') }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: t('projectForm.basicInfo') }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "projectName", className: "block text-sm font-medium", children: t('projectForm.projectName') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "projectName", name: "projectName", value: formState.projectName || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "country", className: "block text-sm font-medium", children: t('projectForm.country') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "country", name: "country", value: formState.country || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "productionCompany", className: "block text-sm font-medium", children: t('projectForm.productionCompany') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "productionCompany", name: "productionCompany", value: formState.productionCompany || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "status", className: "block text-sm font-medium", children: t('projectForm.status') }), (0,jsx_runtime.jsxs)("select", { id: "status", name: "status", value: formState.status || 'Pre-Production', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2", children: [(0,jsx_runtime.jsx)("option", { value: "Pre-Production", children: t('projectStatus.preProduction') }), (0,jsx_runtime.jsx)("option", { value: "Development", children: t('projectStatus.development') }), (0,jsx_runtime.jsx)("option", { value: "Production", children: t('projectStatus.production') }), (0,jsx_runtime.jsx)("option", { value: "Post-Production", children: t('projectStatus.postProduction') }), (0,jsx_runtime.jsx)("option", { value: "Completed", children: t('projectStatus.completed') }), (0,jsx_runtime.jsx)("option", { value: "Cancelled", children: t('projectStatus.cancelled') })] })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: t('projectForm.storyInfo') }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "logline", className: "block text-sm font-medium", children: t('projectForm.logline') }), (0,jsx_runtime.jsx)("textarea", { id: "logline", name: "logline", value: formState.logline || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2", rows: 2 })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "synopsis", className: "block text-sm font-medium", children: t('projectForm.synopsis') }), (0,jsx_runtime.jsx)("textarea", { id: "synopsis", name: "synopsis", value: formState.synopsis || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2", rows: 4 })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: t('projectForm.productionTimeline') }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "startDate", className: "block text-sm font-medium", children: t('projectForm.startDate') }), (0,jsx_runtime.jsx)("input", { type: "date", id: "startDate", name: "startDate", value: formState.startDate || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "endDate", className: "block text-sm font-medium", children: t('projectForm.endDate') }), (0,jsx_runtime.jsx)("input", { type: "date", id: "endDate", name: "endDate", value: formState.endDate || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "genres", className: "block text-sm font-medium", children: t('projectForm.genres') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "genres", name: "genres", value: (Array.isArray(formState.genres) ? formState.genres.join(', ') : formState.genre) || '', onChange: handleGenresChange, className: "mt-1 w-full border rounded px-3 py-2", placeholder: t('projectForm.genresPlaceholder') })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: t('projectForm.creativeTeam') }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "genre", className: "block text-sm font-medium", children: t('projectForm.genre') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "genre", name: "genre", value: formState.genre || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2", placeholder: "e.g., Drama, Comedy, Action" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "director", className: "block text-sm font-medium", children: t('projectForm.director') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "director", name: "director", value: formState.director || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "producer", className: "block text-sm font-medium", children: t('projectForm.producer') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "producer", name: "producer", value: formState.producer || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: t('projectForm.media') }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-start", children: (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "coverImage", className: "block text-sm font-medium", children: t('projectForm.coverImage') }), (0,jsx_runtime.jsx)("input", { type: "file", id: "coverImage", accept: "image/*", onChange: handleCoverImageChange, className: "mt-1" }), coverImageBlobUrl ? ((0,jsx_runtime.jsx)("img", { src: coverImageBlobUrl, alt: t('projectDetail.newCoverPreview'), className: "w-36 h-auto mt-2 rounded shadow object-cover", onError: imageErrorFallback/* imageErrorFallback */.i })) : formState.coverImageUrl ? ((0,jsx_runtime.jsx)("img", { src: formState.coverImageUrl, alt: t('projectDetail.currentCover'), className: "w-36 h-auto mt-2 rounded shadow object-cover", onError: imageErrorFallback/* imageErrorFallback */.i })) : null] }) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: t('projectForm.additional') }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "projectWebsite", className: "block text-sm font-medium", children: t('projectForm.website') }), (0,jsx_runtime.jsx)("input", { type: "url", id: "projectWebsite", name: "projectWebsite", value: formState.projectWebsite || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "productionBudget", className: "block text-sm font-medium", children: t('projectForm.budget') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "productionBudget", name: "productionBudget", value: formState.productionBudget || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "productionCompanyContact", className: "block text-sm font-medium", children: t('projectForm.companyContact') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "productionCompanyContact", name: "productionCompanyContact", value: formState.productionCompanyContact || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "pt-4 border-t mt-6 flex justify-between", children: [(0,jsx_runtime.jsx)("button", { type: "button", onClick: handleDeleteClick, className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors", children: t('projectForm.delete') }), (0,jsx_runtime.jsxs)("div", { className: "flex space-x-4", children: [(0,jsx_runtime.jsx)("button", { type: "button", onClick: handleCancelClick, className: "px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600", disabled: loading, children: t('projectForm.cancel') }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: handleSaveClick, disabled: loading, className: `px-4 py-2 rounded text-white ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`, children: loading ? t('projectForm.saving') : t('projectForm.saveChanges') })] })] })] })) : (
            // --- DISPLAYING PROJECT DETAILS ---
            loading && !project ? ((0,jsx_runtime.jsx)(LoadingSpinner, {})) :
                error && !project ? ((0,jsx_runtime.jsxs)("p", { className: "text-white text-center mt-10", children: ["Error: ", error] })) :
                    project ? ((0,jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto py-12", children: [project.coverImageUrl && ((0,jsx_runtime.jsxs)("div", { className: "mb-6 flex justify-center", children: [" ", (0,jsx_runtime.jsx)("img", { src: project.coverImageUrl, alt: `${project.projectName} ${t('projectDetail.coverAlt')}`, className: "w-64 h-auto max-h-48 object-contain rounded-md shadow-lg", onError: imageErrorFallback/* imageErrorFallback */.i })] })), (0,jsx_runtime.jsx)(components_ProjectShowcase, { project: project, userId: currentUser?.uid, 
                                // Pass onEditClick if ProjectShowcase itself renders an edit button for the owner.
                                // If the edit button is handled *only* below, this prop might not be needed by ProjectShowcase.
                                onEditClick: handleEditClick }), (0,jsx_runtime.jsx)("div", { className: "mt-8", children: (0,jsx_runtime.jsx)(components_ProjectCrewManagement, { project: project, onUpdate: () => {
                                        // Refresh project data when crew is updated
                                        fetchProject();
                                    } }) }), (0,jsx_runtime.jsxs)("div", { className: "mt-10 text-center", children: [" ", currentUser && currentUser.uid === project.owner_uid ? ((0,jsx_runtime.jsx)("button", { onClick: handleEditClick, className: "px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors", children: t('projects.editProject') })) : ((0,jsx_runtime.jsx)("button", { onClick: handleSuggestClick, className: "px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md", children: t('projects.suggestUpdate') }))] })] })) : ((0,jsx_runtime.jsx)("div", { className: "text-white text-center mt-10", children: t('projects.projectNotFound') })))] }));
};
/* harmony default export */ const components_ProjectDetail = (ProjectDetail);

;// ./src/pages/ProjectDetailPage.tsx



const ProjectDetailPage = () => {
    const { projectId } = (0,dist/* useParams */.g)();
    if (!projectId) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-900 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("h1", { className: "text-2xl font-bold text-white mb-4", children: "Project Not Found" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-400", children: "The project you're looking for doesn't exist." })] }) }));
    }
    return (0,jsx_runtime.jsx)(components_ProjectDetail, {});
};
/* harmony default export */ const pages_ProjectDetailPage = (ProjectDetailPage);


/***/ }),

/***/ 6079:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ UserX)
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
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("user-x", __iconNode);


//# sourceMappingURL=user-x.js.map


/***/ }),

/***/ 7623:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ UserCheck)
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
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("user-check", __iconNode);


//# sourceMappingURL=user-check.js.map


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


/***/ }),

/***/ 8686:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ User)
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
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("user", __iconNode);


//# sourceMappingURL=user.js.map


/***/ })

}]);
//# sourceMappingURL=4649.chunk.js.map