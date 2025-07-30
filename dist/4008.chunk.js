"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[4008],{

/***/ 4008:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7594);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9487);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7767);
/* harmony import */ var _components_ProjectCard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1928);
/* harmony import */ var _services_ProjectCrewService__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8390);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2389);








const MyProjectsPage = () => {
    const { t } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_7__/* .useTranslation */ .Bd)();
    const [ownedProjects, setOwnedProjects] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [crewProjects, setCrewProjects] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__/* .useNavigate */ .Zp)();
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);
            const user = _firebase__WEBPACK_IMPORTED_MODULE_3__/* .auth */ .j2.currentUser;
            if (!user) {
                setError(t('projects.mustBeLoggedIn'));
                setLoading(false);
                return;
            }
            try {
                // Fetch owned projects
                const ownedQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_3__.db, 'Projects'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .where */ ._M)('owner_uid', '==', user.uid));
                const ownedSnapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .getDocs */ .GG)(ownedQuery);
                const ownedData = ownedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOwnedProjects(ownedData);
                // Fetch projects where user is a crew member
                const crewProjectsData = await _services_ProjectCrewService__WEBPACK_IMPORTED_MODULE_6__/* .ProjectCrewService */ .g.getProjectsForCrewMember(user.uid);
                setCrewProjects(crewProjectsData);
            }
            catch (err) {
                console.error('Error fetching projects:', err);
                setError(t('projects.errorLoading'));
            }
            finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [t]);
    const handleEdit = (projectId) => {
        navigate(`/edit-project/${projectId}`);
    };
    const handleDelete = async (projectId) => {
        if (!window.confirm(t('projects.confirmDelete')))
            return;
        try {
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .deleteDoc */ .kd)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_3__.db, 'Projects', projectId));
            setOwnedProjects(projects => projects.filter(p => p.id !== projectId));
        }
        catch (err) {
            alert(t('projects.deleteFailed'));
        }
    };
    const allProjects = [...ownedProjects, ...crewProjects];
    const hasProjects = allProjects.length > 0;
    if (loading) {
        return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen flex items-center justify-center", children: t('projects.loading') });
    }
    if (error) {
        return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen flex items-center justify-center text-red-600", children: error });
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "min-h-screen bg-white", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "section-gradient border-b border-gray-100", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "container-base section-padding-large", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center mb-16 animate-fade", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "heading-primary mb-6 animate-slide", children: t('myProjects.title') }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "heading-secondary mb-8 animate-slide", children: t('myProjects.subtitle') }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "body-large max-w-2xl mx-auto animate-slide", children: t('myProjects.description') }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "mt-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => navigate('/projects/create'), className: "btn-primary", children: t('projects.createNewProject') }) })] }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "section-gray", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "container-base section-padding", children: !hasProjects ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-24 animate-fade", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-8xl mb-8 opacity-20 animate-bounce-slow", children: "\uD83C\uDFAC" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "heading-card mb-4", children: t('myProjects.noProjects') }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "body-medium max-w-md mx-auto mb-8", children: t('myProjects.createFirst') }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => navigate('/projects/create'), className: "btn-primary", children: t('projects.createNewProject') })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [ownedProjects.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h3", { className: "heading-card mb-6 flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-blue-600", children: "\uD83D\uDCC1" }), t('myProjects.ownedProjects'), " (", ownedProjects.length, ")"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid-cards", children: ownedProjects.map((project, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { animationDelay: `${index * 0.1}s` }, className: "relative group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_ProjectCard__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A, { id: project.id, projectName: project.projectName, productionCompany: project.productionCompany, country: project.country, productionLocations: project.productionLocations, status: project.status, summary: project.synopsis, director: project.director, producer: project.producer, coverImageUrl: project.coverImageUrl, genres: project.genres, startDate: project.startDate, endDate: project.endDate, showDetails: true }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => handleEdit(project.id), className: "btn-secondary px-3 py-1 text-xs", children: t('projects.edit') }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => handleDelete(project.id), className: "btn-danger px-3 py-1 text-xs", children: t('projects.delete') })] })] }, project.id))) })] })), crewProjects.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h3", { className: "heading-card mb-6 flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-green-600", children: "\uD83D\uDC65" }), t('myProjects.crewProjects'), " (", crewProjects.length, ")"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid-cards", children: crewProjects.map((project, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { animationDelay: `${index * 0.1}s` }, className: "relative group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_ProjectCard__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A, { id: project.id, projectName: project.projectName, productionCompany: project.productionCompany, country: project.country, productionLocations: project.productionLocations, status: project.status, summary: project.synopsis, director: project.director, producer: project.producer, coverImageUrl: project.coverImageUrl, genres: project.genres, startDate: project.startDate, endDate: project.endDate, showDetails: true }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full", children: "Crew Member" }) })] }, project.id))) })] }))] })) }) })] }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyProjectsPage);


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
            const projectRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_0__.db, this.PROJECTS_COLLECTION, projectId);
            const projectDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.getDoc)(projectRef);
            if (!projectDoc.exists()) {
                throw new Error('Project not found');
            }
            const projectData = projectDoc.data();
            const existingCrew = projectData.crewMembers || [];
            // Check if user is already a crew member
            const isAlreadyCrewMember = existingCrew.some(member => member.userId === crewMember.userId);
            if (isAlreadyCrewMember) {
                throw new Error('User is already a crew member of this project');
            }
            const newCrewMember = {
                ...crewMember,
                joinedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .serverTimestamp */ .O5)()
            };
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .updateDoc */ .mZ)(projectRef, {
                crewMembers: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .arrayUnion */ .hq)(newCrewMember),
                lastUpdated: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .serverTimestamp */ .O5)(),
                updateCount: (projectData.updateCount || 0) + 1
            });
        }
        catch (error) {
            console.error('Error adding crew member:', error);
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
            const projectsRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_0__.db, this.PROJECTS_COLLECTION);
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_1__/* .getDocs */ .GG)(projectsRef);
            const projects = [];
            snapshot.forEach(doc => {
                const projectData = doc.data();
                const crewMembers = projectData.crewMembers || [];
                // Check if user is in the crew members array
                const isCrewMember = crewMembers.some(member => member.userId === userId && member.status === 'active');
                if (isCrewMember) {
                    projects.push({ id: doc.id, ...projectData });
                }
            });
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
//# sourceMappingURL=4008.chunk.js.map