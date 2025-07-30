"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[4381],{

/***/ 4381:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ ProjectManagement_ProjectDashboard)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var dist = __webpack_require__(7767);
// EXTERNAL MODULE: ./node_modules/react-router-dom/dist/index.js
var react_router_dom_dist = __webpack_require__(4976);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
;// ./src/pages/ProjectManagement/ProjectCrewManagement.tsx




const ProjectCrewManagement = ({ projectId, crew, onCrewUpdate }) => {
    const [isAddingCrew, setIsAddingCrew] = (0,react.useState)(false);
    const [isEditingCrew, setIsEditingCrew] = (0,react.useState)(null);
    const [availableCrew, setAvailableCrew] = (0,react.useState)([]);
    const [formData, setFormData] = (0,react.useState)({
        crewMemberId: '',
        role: '',
        department: '',
        startDate: '',
        endDate: '',
        status: 'pending',
        salary: undefined,
        notes: ''
    });
    const currentUser = firebase/* auth */.j2.currentUser;
    (0,react.useEffect)(() => {
        loadAvailableCrew();
    }, []);
    const loadAvailableCrew = async () => {
        try {
            // Use crewProfiles collection instead of users (single source of truth)
            const crewQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles'), (0,index_esm/* where */._M)('isPublished', '==', true));
            const crewSnapshot = await (0,index_esm/* getDocs */.GG)(crewQuery);
            const crewData = crewSnapshot.docs.map(doc => {
                const crewData = doc.data();
                // Don't try to validate blob URLs - handle them at render time
                const photoURL = crewData.profileImageUrl?.startsWith('blob:') ? null : crewData.profileImageUrl;
                return {
                    id: doc.id,
                    displayName: crewData.name || crewData.displayName || crewData.email?.split('@')[0] || 'Crew Member',
                    email: crewData.email,
                    photoURL: photoURL || null
                };
            });
            setAvailableCrew(crewData);
        }
        catch (error) {
            console.error('Error loading available crew:', error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser)
            return;
        try {
            const crewData = {
                projectId,
                ...formData,
                addedBy: currentUser.uid,
                addedAt: new Date()
            };
            if (isEditingCrew) {
                await (0,index_esm/* updateDoc */.mZ)((0,index_esm.doc)(firebase.db, 'projectCrew', isEditingCrew), crewData);
            }
            else {
                await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'projectCrew'), crewData);
            }
            setFormData({
                crewMemberId: '',
                role: '',
                department: '',
                startDate: '',
                endDate: '',
                status: 'pending',
                salary: undefined,
                notes: ''
            });
            setIsAddingCrew(false);
            setIsEditingCrew(null);
            onCrewUpdate();
        }
        catch (error) {
            console.error('Error saving crew member:', error);
        }
    };
    const handleEdit = (member) => {
        setFormData({
            crewMemberId: member.crewMemberId,
            role: member.role,
            department: member.department,
            startDate: member.startDate,
            endDate: member.endDate || '',
            status: member.status,
            salary: member.salary,
            notes: member.notes || ''
        });
        setIsEditingCrew(member.id);
    };
    const handleDelete = async (memberId) => {
        if (window.confirm('Are you sure you want to remove this crew member?')) {
            try {
                await (0,index_esm/* deleteDoc */.kd)((0,index_esm.doc)(firebase.db, 'projectCrew', memberId));
                onCrewUpdate();
            }
            catch (error) {
                console.error('Error deleting crew member:', error);
            }
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getDepartmentColor = (department) => {
        const colors = [
            'bg-purple-100 text-purple-800',
            'bg-indigo-100 text-indigo-800',
            'bg-pink-100 text-pink-800',
            'bg-orange-100 text-orange-800',
            'bg-teal-100 text-teal-800'
        ];
        const index = department.length % colors.length;
        return colors[index];
    };
    const renderCrewMemberAvatar = (member) => {
        const crewMember = availableCrew.find(c => c.id === member.crewMemberId);
        if (crewMember?.photoURL) {
            return ((0,jsx_runtime.jsx)("img", { src: crewMember.photoURL, alt: member.crewMemberId || 'Crew member', className: "h-10 w-10 rounded-full object-cover", onError: (e) => {
                    const target = e.target;
                    target.onerror = null;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium';
                    fallback.textContent = member.crewMemberId?.charAt(0)?.toUpperCase() || 'U';
                    target.parentNode?.insertBefore(fallback, target.nextSibling);
                } }));
        }
        return ((0,jsx_runtime.jsx)("div", { className: "h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium", children: member.crewMemberId?.charAt(0)?.toUpperCase() || 'U' }));
    };
    return ((0,jsx_runtime.jsxs)("div", { className: "p-8", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-center mb-8", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-2xl font-light text-gray-900 mb-2", children: "Project Crew" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: "Manage crew members and their roles for this project" })] }), (0,jsx_runtime.jsx)("button", { onClick: () => setIsAddingCrew(true), className: "bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium", children: "Add Crew Member" })] }), (isAddingCrew || isEditingCrew) && ((0,jsx_runtime.jsxs)("div", { className: "bg-gray-50 rounded-xl p-6 mb-8", children: [(0,jsx_runtime.jsx)("h4", { className: "text-lg font-medium text-gray-900 mb-4", children: isEditingCrew ? 'Edit Crew Member' : 'Add New Crew Member' }), (0,jsx_runtime.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Crew Member" }), (0,jsx_runtime.jsxs)("select", { value: formData.crewMemberId, onChange: (e) => setFormData({ ...formData, crewMemberId: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent", required: true, children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select a crew member" }), availableCrew.map((member) => ((0,jsx_runtime.jsx)("option", { value: member.id, children: member.displayName || member.email }, member.id)))] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Role" }), (0,jsx_runtime.jsx)("input", { type: "text", value: formData.role, onChange: (e) => setFormData({ ...formData, role: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent", placeholder: "e.g., Director of Photography", required: true })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Department" }), (0,jsx_runtime.jsxs)("select", { value: formData.department, onChange: (e) => setFormData({ ...formData, department: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent", required: true, children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select department" }), (0,jsx_runtime.jsx)("option", { value: "Camera", children: "Camera" }), (0,jsx_runtime.jsx)("option", { value: "Sound", children: "Sound" }), (0,jsx_runtime.jsx)("option", { value: "Lighting", children: "Lighting" }), (0,jsx_runtime.jsx)("option", { value: "Art", children: "Art" }), (0,jsx_runtime.jsx)("option", { value: "Costume", children: "Costume" }), (0,jsx_runtime.jsx)("option", { value: "Makeup", children: "Makeup" }), (0,jsx_runtime.jsx)("option", { value: "Production", children: "Production" }), (0,jsx_runtime.jsx)("option", { value: "Post-Production", children: "Post-Production" }), (0,jsx_runtime.jsx)("option", { value: "Other", children: "Other" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), (0,jsx_runtime.jsxs)("select", { value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent", required: true, children: [(0,jsx_runtime.jsx)("option", { value: "pending", children: "Pending" }), (0,jsx_runtime.jsx)("option", { value: "confirmed", children: "Confirmed" }), (0,jsx_runtime.jsx)("option", { value: "completed", children: "Completed" }), (0,jsx_runtime.jsx)("option", { value: "cancelled", children: "Cancelled" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Start Date" }), (0,jsx_runtime.jsx)("input", { type: "date", value: formData.startDate, onChange: (e) => setFormData({ ...formData, startDate: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent", required: true })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "End Date" }), (0,jsx_runtime.jsx)("input", { type: "date", value: formData.endDate, onChange: (e) => setFormData({ ...formData, endDate: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Salary (optional)" }), (0,jsx_runtime.jsx)("input", { type: "number", value: formData.salary || '', onChange: (e) => setFormData({ ...formData, salary: e.target.value ? Number(e.target.value) : undefined }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent", placeholder: "Enter salary amount" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Notes" }), (0,jsx_runtime.jsx)("textarea", { value: formData.notes, onChange: (e) => setFormData({ ...formData, notes: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent", rows: 3, placeholder: "Additional notes about this crew member..." })] }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-3", children: [(0,jsx_runtime.jsx)("button", { type: "submit", className: "bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium", children: isEditingCrew ? 'Update Crew Member' : 'Add Crew Member' }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: () => {
                                            setIsAddingCrew(false);
                                            setIsEditingCrew(null);
                                            setFormData({
                                                crewMemberId: '',
                                                role: '',
                                                department: '',
                                                startDate: '',
                                                endDate: '',
                                                status: 'pending',
                                                salary: undefined,
                                                notes: ''
                                            });
                                        }, className: "bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium", children: "Cancel" })] })] })] })), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: crew.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "col-span-full text-center py-12", children: [(0,jsx_runtime.jsx)("div", { className: "text-gray-400 mb-4", children: (0,jsx_runtime.jsx)("svg", { className: "mx-auto h-12 w-12", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }) }), (0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No crew members yet" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-4", children: "Get started by adding your first crew member to the project." }), (0,jsx_runtime.jsx)("button", { onClick: () => setIsAddingCrew(true), className: "bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium", children: "Add First Crew Member" })] })) : (crew.map((member) => ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-start mb-4", children: [(0,jsx_runtime.jsx)("div", { className: "flex items-center space-x-3", children: (0,jsx_runtime.jsx)("div", { className: "flex-shrink-0", children: (0,jsx_runtime.jsx)("div", { className: "relative", children: renderCrewMemberAvatar(member) }) }) }), (0,jsx_runtime.jsxs)("div", { className: "flex-1 min-w-0", children: [(0,jsx_runtime.jsx)("h4", { className: "text-lg font-medium text-white mb-1", children: availableCrew.find(c => c.id === member.crewMemberId)?.displayName || member.crewMemberId || 'Unknown Crew Member' }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600 mb-2", style: { color: 'rgba(255,255,255,0.85)' }, children: member.role }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [(0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(member.department)}`, children: member.department }), (0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`, children: member.status })] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [(0,jsx_runtime.jsx)("button", { onClick: () => handleEdit(member), className: "text-gray-400 hover:text-gray-600 transition-colors duration-300", children: (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) }), (0,jsx_runtime.jsx)("button", { onClick: () => handleDelete(member.id), className: "text-gray-400 hover:text-red-600 transition-colors duration-300", children: (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) })] })] }), (0,jsx_runtime.jsxs)("div", { className: "space-y-2 text-sm", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-600", style: { color: 'rgba(255,255,255,0.7)' }, children: "Start Date:" }), (0,jsx_runtime.jsx)("span", { className: "font-medium text-gray-900", style: { color: '#fff', fontWeight: 600 }, children: new Date(member.startDate).toLocaleDateString() })] }), member.endDate && ((0,jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-600", style: { color: 'rgba(255,255,255,0.7)' }, children: "End Date:" }), (0,jsx_runtime.jsx)("span", { className: "font-medium text-gray-900", style: { color: '#fff', fontWeight: 600 }, children: new Date(member.endDate).toLocaleDateString() })] })), member.salary && ((0,jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-600", style: { color: 'rgba(255,255,255,0.7)' }, children: "Salary:" }), (0,jsx_runtime.jsxs)("span", { className: "font-medium text-gray-900", style: { color: '#fff', fontWeight: 600 }, children: ["$", member.salary.toLocaleString()] })] }))] }), member.notes && ((0,jsx_runtime.jsx)("div", { className: "mt-4 pt-4 border-t border-gray-100", children: (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", style: { color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }, children: member.notes }) }))] }, member.id)))) })] }));
};
/* harmony default export */ const ProjectManagement_ProjectCrewManagement = (ProjectCrewManagement);

;// ./src/pages/ProjectManagement/ProjectBudgetView.tsx




const ProjectBudgetView = ({ projectId, budget, onBudgetUpdate }) => {
    const [isEditingBudget, setIsEditingBudget] = (0,react.useState)(false);
    const [formData, setFormData] = (0,react.useState)({
        totalBudget: budget?.totalBudget || 0,
        currency: budget?.currency || 'USD',
        categories: budget?.categories || {
            'Pre-Production': { budgeted: 0, spent: 0, notes: '' },
            'Production': { budgeted: 0, spent: 0, notes: '' },
            'Post-Production': { budgeted: 0, spent: 0, notes: '' },
            'Equipment': { budgeted: 0, spent: 0, notes: '' },
            'Location': { budgeted: 0, spent: 0, notes: '' },
            'Crew': { budgeted: 0, spent: 0, notes: '' },
            'Marketing': { budgeted: 0, spent: 0, notes: '' },
            'Other': { budgeted: 0, spent: 0, notes: '' }
        }
    });
    const currentUser = firebase/* auth */.j2.currentUser;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser)
            return;
        try {
            const budgetData = {
                projectId,
                totalBudget: formData.totalBudget,
                spentBudget: budget?.spentBudget || 0,
                currency: formData.currency,
                categories: formData.categories,
                lastUpdated: new Date()
            };
            if (budget) {
                await (0,index_esm/* updateDoc */.mZ)((0,index_esm.doc)(firebase.db, 'projectBudget', budget.id), budgetData);
            }
            else {
                await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'projectBudget'), budgetData);
            }
            setIsEditingBudget(false);
            onBudgetUpdate();
        }
        catch (error) {
            console.error('Error saving budget:', error);
        }
    };
    const updateCategoryBudget = (category, field, value) => {
        setFormData(prev => ({
            ...prev,
            categories: {
                ...prev.categories,
                [category]: {
                    ...prev.categories[category],
                    [field]: field === 'notes' ? value : Number(value)
                }
            }
        }));
    };
    const calculateTotalBudgeted = () => {
        return Object.values(formData.categories).reduce((sum, cat) => sum + cat.budgeted, 0);
    };
    const calculateTotalSpent = () => {
        return Object.values(formData.categories).reduce((sum, cat) => sum + cat.spent, 0);
    };
    const getSpendingPercentage = (spent, budgeted) => {
        if (budgeted === 0)
            return 0;
        return (spent / budgeted) * 100;
    };
    const getProgressColor = (percentage) => {
        if (percentage >= 90)
            return 'bg-red-500';
        if (percentage >= 75)
            return 'bg-yellow-500';
        return 'bg-green-500';
    };
    if (!budget && !isEditingBudget) {
        return ((0,jsx_runtime.jsx)("div", { className: "p-8", children: (0,jsx_runtime.jsxs)("div", { className: "text-center py-12", children: [(0,jsx_runtime.jsx)("div", { className: "text-gray-400 mb-4", children: (0,jsx_runtime.jsx)("svg", { className: "mx-auto h-12 w-12", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" }) }) }), (0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No budget set up yet" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-4", children: "Create a budget to track your project expenses and spending." }), (0,jsx_runtime.jsx)("button", { onClick: () => setIsEditingBudget(true), className: "bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium", children: "Set Up Budget" })] }) }));
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "p-8", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-center mb-8", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-2xl font-light text-gray-900 mb-2", children: "Project Budget" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: "Track and manage your project's financial resources" })] }), budget && ((0,jsx_runtime.jsx)("button", { onClick: () => setIsEditingBudget(true), className: "bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium", children: "Edit Budget" }))] }), budget && !isEditingBudget && ((0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0,jsx_runtime.jsx)("h4", { className: "text-sm font-medium text-gray-600", children: "Total Budget" }), (0,jsx_runtime.jsx)("span", { className: "text-xs text-gray-400", children: "Planned" })] }), (0,jsx_runtime.jsxs)("div", { className: "text-2xl font-light text-gray-900", children: [budget.currency, budget.totalBudget.toLocaleString()] })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0,jsx_runtime.jsx)("h4", { className: "text-sm font-medium text-gray-600", children: "Spent" }), (0,jsx_runtime.jsx)("span", { className: "text-xs text-gray-400", children: "Actual" })] }), (0,jsx_runtime.jsxs)("div", { className: "text-2xl font-light text-gray-900", children: [budget.currency, budget.spentBudget.toLocaleString()] })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0,jsx_runtime.jsx)("h4", { className: "text-sm font-medium text-gray-600", children: "Remaining" }), (0,jsx_runtime.jsx)("span", { className: "text-xs text-gray-400", children: "Available" })] }), (0,jsx_runtime.jsxs)("div", { className: "text-2xl font-light text-gray-900", children: [budget.currency, (budget.totalBudget - budget.spentBudget).toLocaleString()] })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0,jsx_runtime.jsx)("h4", { className: "text-sm font-medium text-gray-600", children: "Spent %" }), (0,jsx_runtime.jsx)("span", { className: "text-xs text-gray-400", children: "Progress" })] }), (0,jsx_runtime.jsxs)("div", { className: "text-2xl font-light text-gray-900", children: [budget.totalBudget > 0 ? ((budget.spentBudget / budget.totalBudget) * 100).toFixed(1) : 0, "%"] })] })] })), isEditingBudget && ((0,jsx_runtime.jsxs)("div", { className: "bg-gray-50 rounded-xl p-6 mb-8", children: [(0,jsx_runtime.jsx)("h4", { className: "text-lg font-medium text-gray-900 mb-4", children: budget ? 'Edit Budget' : 'Create Budget' }), (0,jsx_runtime.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Total Budget" }), (0,jsx_runtime.jsx)("input", { type: "number", value: formData.totalBudget, onChange: (e) => setFormData({ ...formData, totalBudget: Number(e.target.value) }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent", placeholder: "Enter total budget", required: true })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Currency" }), (0,jsx_runtime.jsxs)("select", { value: formData.currency, onChange: (e) => setFormData({ ...formData, currency: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent", required: true, children: [(0,jsx_runtime.jsx)("option", { value: "USD", children: "USD ($)" }), (0,jsx_runtime.jsx)("option", { value: "EUR", children: "EUR (\u20AC)" }), (0,jsx_runtime.jsx)("option", { value: "GBP", children: "GBP (\u00A3)" }), (0,jsx_runtime.jsx)("option", { value: "CAD", children: "CAD (C$)" }), (0,jsx_runtime.jsx)("option", { value: "AUD", children: "AUD (A$)" })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h5", { className: "text-md font-medium text-gray-900 mb-4", children: "Budget Categories" }), (0,jsx_runtime.jsx)("div", { className: "space-y-4", children: Object.entries(formData.categories).map(([category, data]) => ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200", children: [(0,jsx_runtime.jsx)("h6", { className: "font-medium text-gray-900 mb-3", children: category }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Budgeted" }), (0,jsx_runtime.jsx)("input", { type: "number", value: data.budgeted, onChange: (e) => updateCategoryBudget(category, 'budgeted', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm", placeholder: "0" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Spent" }), (0,jsx_runtime.jsx)("input", { type: "number", value: data.spent, onChange: (e) => updateCategoryBudget(category, 'spent', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm", placeholder: "0" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Notes" }), (0,jsx_runtime.jsx)("input", { type: "text", value: data.notes || '', onChange: (e) => updateCategoryBudget(category, 'notes', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm", placeholder: "Optional notes" })] })] })] }, category))) })] }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-3", children: [(0,jsx_runtime.jsx)("button", { type: "submit", className: "bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium", children: budget ? 'Update Budget' : 'Create Budget' }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: () => setIsEditingBudget(false), className: "bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium", children: "Cancel" })] })] })] })), budget && !isEditingBudget && ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100", children: [(0,jsx_runtime.jsx)("div", { className: "p-6 border-b border-gray-100", children: (0,jsx_runtime.jsx)("h4", { className: "text-lg font-medium text-gray-900", children: "Budget Breakdown" }) }), (0,jsx_runtime.jsx)("div", { className: "p-6", children: (0,jsx_runtime.jsx)("div", { className: "space-y-4", children: Object.entries(budget.categories).map(([category, data]) => {
                                const percentage = getSpendingPercentage(data.spent, data.budgeted);
                                return ((0,jsx_runtime.jsxs)("div", { className: "border border-gray-200 rounded-lg p-4", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-center mb-3", children: [(0,jsx_runtime.jsx)("h5", { className: "font-medium text-gray-900", children: category }), (0,jsx_runtime.jsxs)("div", { className: "text-right", children: [(0,jsx_runtime.jsxs)("div", { className: "text-sm font-medium text-gray-900", children: [budget.currency, data.spent.toLocaleString(), " / ", budget.currency, data.budgeted.toLocaleString()] }), (0,jsx_runtime.jsxs)("div", { className: "text-xs text-gray-600", children: [percentage.toFixed(1), "% spent"] })] })] }), (0,jsx_runtime.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2 mb-2", children: (0,jsx_runtime.jsx)("div", { className: `h-2 rounded-full ${getProgressColor(percentage)}`, style: { width: `${Math.min(percentage, 100)}%` } }) }), data.notes && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600 mt-2", children: data.notes }))] }, category));
                            }) }) })] }))] }));
};
/* harmony default export */ const ProjectManagement_ProjectBudgetView = (ProjectBudgetView);

;// ./src/pages/ProjectManagement/ProjectTimelineView.tsx




const ProjectTimelineView = ({ projectId, timeline, onTimelineUpdate }) => {
    const [isAddingMilestone, setIsAddingMilestone] = (0,react.useState)(false);
    const [editingMilestone, setEditingMilestone] = (0,react.useState)(null);
    const [formData, setFormData] = (0,react.useState)({
        title: '',
        description: '',
        dueDate: '',
        status: 'pending',
        priority: 'medium',
        assignedTo: '',
        dependencies: [],
        notes: ''
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firebase/* auth */.j2.currentUser)
            return;
        try {
            const milestoneData = {
                ...formData,
                projectId,
                createdBy: firebase/* auth */.j2.currentUser.uid,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            if (editingMilestone) {
                await (0,index_esm/* updateDoc */.mZ)((0,index_esm.doc)(firebase.db, 'projectMilestones', editingMilestone), {
                    ...milestoneData,
                    updatedAt: new Date()
                });
                setEditingMilestone(null);
            }
            else {
                await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'projectMilestones'), milestoneData);
            }
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                status: 'pending',
                priority: 'medium',
                assignedTo: '',
                dependencies: [],
                notes: ''
            });
            setIsAddingMilestone(false);
            onTimelineUpdate();
        }
        catch (error) {
            console.error('Error saving milestone:', error);
        }
    };
    const handleDelete = async (milestoneId) => {
        if (!confirm('Are you sure you want to delete this milestone?'))
            return;
        try {
            await (0,index_esm/* deleteDoc */.kd)((0,index_esm.doc)(firebase.db, 'projectMilestones', milestoneId));
            onTimelineUpdate();
        }
        catch (error) {
            console.error('Error deleting milestone:', error);
        }
    };
    const handleEdit = (milestone) => {
        setEditingMilestone(milestone.id);
        setFormData({
            title: milestone.title,
            description: milestone.description,
            dueDate: milestone.dueDate,
            status: milestone.status,
            priority: milestone.priority,
            assignedTo: milestone.assignedTo || '',
            dependencies: milestone.dependencies || [],
            notes: milestone.notes || ''
        });
        setIsAddingMilestone(true);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'delayed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-green-100 text-green-800';
        }
    };
    return ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-lg shadow-md p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-center mb-6", children: [(0,jsx_runtime.jsx)("h2", { className: "text-2xl font-bold text-gray-900", children: "Project Timeline" }), (0,jsx_runtime.jsxs)("button", { onClick: () => setIsAddingMilestone(true), className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors", children: [(0,jsx_runtime.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }), "Add Milestone"] })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-blue-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h3", { className: "font-semibold text-blue-900", children: "Total Milestones" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-blue-600", children: timeline?.milestones?.length || 0 })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-green-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h3", { className: "font-semibold text-green-900", children: "Completed" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-green-600", children: timeline?.milestones?.filter(m => m.status === 'completed').length || 0 })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-yellow-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h3", { className: "font-semibold text-yellow-900", children: "In Progress" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-yellow-600", children: timeline?.milestones?.filter(m => m.status === 'in_progress').length || 0 })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-red-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h3", { className: "font-semibold text-red-900", children: "Delayed" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-red-600", children: timeline?.milestones?.filter(m => m.status === 'delayed').length || 0 })] })] }), isAddingMilestone && ((0,jsx_runtime.jsxs)("div", { className: "bg-gray-50 p-6 rounded-lg mb-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold mb-4", children: editingMilestone ? 'Edit Milestone' : 'Add New Milestone' }), (0,jsx_runtime.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Title *" }), (0,jsx_runtime.jsx)("input", { type: "text", required: true, value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Due Date *" }), (0,jsx_runtime.jsx)("input", { type: "date", required: true, value: formData.dueDate, onChange: (e) => setFormData({ ...formData, dueDate: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), (0,jsx_runtime.jsx)("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), (0,jsx_runtime.jsxs)("select", { value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [(0,jsx_runtime.jsx)("option", { value: "pending", children: "Pending" }), (0,jsx_runtime.jsx)("option", { value: "in_progress", children: "In Progress" }), (0,jsx_runtime.jsx)("option", { value: "completed", children: "Completed" }), (0,jsx_runtime.jsx)("option", { value: "delayed", children: "Delayed" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Priority" }), (0,jsx_runtime.jsxs)("select", { value: formData.priority, onChange: (e) => setFormData({ ...formData, priority: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [(0,jsx_runtime.jsx)("option", { value: "low", children: "Low" }), (0,jsx_runtime.jsx)("option", { value: "medium", children: "Medium" }), (0,jsx_runtime.jsx)("option", { value: "high", children: "High" }), (0,jsx_runtime.jsx)("option", { value: "critical", children: "Critical" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Assigned To" }), (0,jsx_runtime.jsx)("input", { type: "text", value: formData.assignedTo, onChange: (e) => setFormData({ ...formData, assignedTo: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Team member name" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Notes" }), (0,jsx_runtime.jsx)("textarea", { value: formData.notes, onChange: (e) => setFormData({ ...formData, notes: e.target.value }), rows: 2, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Additional notes..." })] }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-3", children: [(0,jsx_runtime.jsx)("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors", children: editingMilestone ? 'Update Milestone' : 'Add Milestone' }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: () => {
                                            setIsAddingMilestone(false);
                                            setEditingMilestone(null);
                                            setFormData({
                                                title: '',
                                                description: '',
                                                dueDate: '',
                                                status: 'pending',
                                                priority: 'medium',
                                                assignedTo: '',
                                                dependencies: [],
                                                notes: ''
                                            });
                                        }, className: "bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors", children: "Cancel" })] })] })] })), (0,jsx_runtime.jsxs)("div", { className: "space-y-4", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Milestones" }), timeline?.milestones && timeline.milestones.length > 0 ? ((0,jsx_runtime.jsx)("div", { className: "space-y-4", children: timeline.milestones.map((milestone, index) => ((0,jsx_runtime.jsx)("div", { className: "bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow", children: (0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-start", children: [(0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [(0,jsx_runtime.jsx)("div", { className: "w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center", children: (0,jsx_runtime.jsx)("span", { className: "text-blue-600 font-semibold text-sm", children: index + 1 }) }), (0,jsx_runtime.jsx)("h4", { className: "text-lg font-semibold text-gray-900", style: { color: '#fff', fontWeight: 600 }, children: milestone.title }), (0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`, children: milestone.status.replace('_', ' ') }), (0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(milestone.priority)}`, children: milestone.priority })] }), milestone.description && ((0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-2", style: { color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }, children: milestone.description })), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 text-sm text-gray-500", children: [(0,jsx_runtime.jsxs)("span", { style: { color: 'rgba(255,255,255,0.7)' }, children: ["Due: ", new Date(milestone.dueDate).toLocaleDateString()] }), milestone.assignedTo && ((0,jsx_runtime.jsxs)("span", { style: { color: 'rgba(255,255,255,0.7)' }, children: ["Assigned to: ", milestone.assignedTo] }))] }), milestone.notes && ((0,jsx_runtime.jsx)("div", { className: "mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600", children: milestone.notes }))] }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [(0,jsx_runtime.jsx)("button", { onClick: () => handleEdit(milestone), className: "text-blue-600 hover:text-blue-800 p-1", children: (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) }), (0,jsx_runtime.jsx)("button", { onClick: () => handleDelete(milestone.id), className: "text-red-600 hover:text-red-800 p-1", children: (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) })] })] }) }, milestone.id))) })) : ((0,jsx_runtime.jsxs)("div", { className: "text-center py-8 text-gray-500", children: [(0,jsx_runtime.jsx)("svg", { className: "w-12 h-12 mx-auto mb-4 text-gray-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), (0,jsx_runtime.jsx)("p", { children: "No milestones added yet." }), (0,jsx_runtime.jsx)("p", { className: "text-sm", children: "Click \"Add Milestone\" to get started." })] }))] })] }));
};
/* harmony default export */ const ProjectManagement_ProjectTimelineView = (ProjectTimelineView);

// EXTERNAL MODULE: ./node_modules/firebase/storage/dist/esm/index.esm.js + 1 modules
var esm_index_esm = __webpack_require__(2539);
// EXTERNAL MODULE: ./node_modules/react-pdf/dist/esm/entry.js + 44 modules
var entry = __webpack_require__(6372);
// EXTERNAL MODULE: ./node_modules/fast-xml-parser/src/xmlparser/XMLParser.js + 9 modules
var XMLParser = __webpack_require__(4221);
// EXTERNAL MODULE: ./node_modules/react-modal/lib/index.js
var lib = __webpack_require__(312);
var lib_default = /*#__PURE__*/__webpack_require__.n(lib);
// EXTERNAL MODULE: ./node_modules/react-hot-toast/dist/index.mjs + 1 modules
var react_hot_toast_dist = __webpack_require__(888);
;// ./src/components/BreakdownReports.tsx





const BreakdownReports = ({ document: projectDocument, projectId }) => {
    const [breakdownElements, setBreakdownElements] = (0,react.useState)([]);
    const [reportData, setReportData] = (0,react.useState)(null);
    const [loading, setLoading] = (0,react.useState)(true);
    const [selectedReport, setSelectedReport] = (0,react.useState)('summary');
    (0,react.useEffect)(() => {
        loadBreakdownElements();
    }, [projectDocument?.id]);
    const loadBreakdownElements = async () => {
        try {
            setLoading(true);
            let q;
            if (projectDocument?.id) {
                // Query by document ID if available
                q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'breakdownElements'), (0,index_esm/* where */._M)('documentId', '==', projectDocument.id));
            }
            else if (projectId) {
                // Query by project ID if no document
                q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'breakdownElements'), (0,index_esm/* where */._M)('projectId', '==', projectId));
            }
            else {
                // No document or project ID available
                setBreakdownElements([]);
                setLoading(false);
                return;
            }
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(q);
            const elements = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBreakdownElements(elements);
            generateReportData(elements);
        }
        catch (error) {
            console.error('Error loading breakdown elements:', error);
            react_hot_toast_dist/* default */.Ay.error('Failed to load breakdown data');
        }
        finally {
            setLoading(false);
        }
    };
    const generateReportData = (elements) => {
        const elementsByType = {};
        const elementsByStatus = {};
        const elementsByPriority = {};
        const costByType = {};
        const elementsByScene = {};
        let totalEstimatedCost = 0;
        elements.forEach(element => {
            // Count by type
            elementsByType[element.elementType] = (elementsByType[element.elementType] || 0) + 1;
            // Count by status
            elementsByStatus[element.status] = (elementsByStatus[element.status] || 0) + 1;
            // Count by priority
            elementsByPriority[element.priority] = (elementsByPriority[element.priority] || 0) + 1;
            // Cost tracking
            if (element.estimatedCost) {
                totalEstimatedCost += element.estimatedCost;
                costByType[element.elementType] = (costByType[element.elementType] || 0) + element.estimatedCost;
            }
            // Group by scene
            const sceneKey = element.scene || 'Unspecified Scene';
            if (!elementsByScene[sceneKey]) {
                elementsByScene[sceneKey] = [];
            }
            elementsByScene[sceneKey].push(element);
        });
        const sceneCount = Object.keys(elementsByScene).length;
        const averageElementsPerScene = sceneCount > 0 ? elements.length / sceneCount : 0;
        setReportData({
            totalElements: elements.length,
            elementsByType,
            elementsByStatus,
            elementsByPriority,
            totalEstimatedCost,
            costByType,
            elementsByScene,
            sceneCount,
            averageElementsPerScene
        });
    };
    const exportToCSV = () => {
        if (!reportData)
            return;
        let csvContent = 'data:text/csv;charset=utf-8,';
        // Add header
        csvContent += 'Element Type,Name,Scene,Page,Priority,Status,Estimated Cost,Description,Tags\n';
        // Add data rows
        breakdownElements.forEach(element => {
            const row = [
                element.elementType,
                `"${element.name}"`,
                `"${element.scene || ''}"`,
                element.pageNumber || '',
                element.priority,
                element.status,
                element.estimatedCost || '',
                `"${element.description || ''}"`,
                `"${element.tags.join(', ')}"`
            ].join(',');
            csvContent += row + '\n';
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${projectDocument?.title}_breakdown_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        react_hot_toast_dist/* default */.Ay.success('CSV report exported successfully');
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'acquired': return 'bg-purple-100 text-purple-800';
            case 'identified': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getTypeColor = (type) => {
        switch (type) {
            case 'prop': return 'bg-blue-100 text-blue-800';
            case 'cast': return 'bg-purple-100 text-purple-800';
            case 'location': return 'bg-green-100 text-green-800';
            case 'costume': return 'bg-pink-100 text-pink-800';
            case 'vehicle': return 'bg-orange-100 text-orange-800';
            case 'equipment': return 'bg-gray-100 text-gray-800';
            case 'sound': return 'bg-yellow-100 text-yellow-800';
            case 'effect': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    if (loading) {
        return ((0,jsx_runtime.jsx)("div", { className: "bg-white rounded-lg shadow-md p-6", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-center py-8", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), (0,jsx_runtime.jsx)("span", { className: "ml-2 text-gray-600", children: "Loading breakdown data..." })] }) }));
    }
    if (!reportData) {
        return ((0,jsx_runtime.jsx)("div", { className: "bg-white rounded-lg shadow-md p-6", children: (0,jsx_runtime.jsx)("div", { className: "text-center py-8 text-gray-500", children: (0,jsx_runtime.jsx)("p", { children: "No breakdown data available." }) }) }));
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-lg shadow-md p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-center mb-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-bold text-gray-900", children: "Breakdown Reports" }), (0,jsx_runtime.jsxs)("button", { onClick: exportToCSV, className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors", children: [(0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), "Export CSV"] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg", children: [(0,jsx_runtime.jsx)("button", { onClick: () => setSelectedReport('summary'), className: `flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${selectedReport === 'summary'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'}`, children: "Summary" }), (0,jsx_runtime.jsx)("button", { onClick: () => setSelectedReport('budget'), className: `flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${selectedReport === 'budget'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'}`, children: "Budget" }), (0,jsx_runtime.jsx)("button", { onClick: () => setSelectedReport('scene'), className: `flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${selectedReport === 'scene'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'}`, children: "Scene Breakdown" }), (0,jsx_runtime.jsx)("button", { onClick: () => setSelectedReport('detailed'), className: `flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${selectedReport === 'detailed'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'}`, children: "Detailed List" })] }), selectedReport === 'summary' && ((0,jsx_runtime.jsxs)("div", { className: "space-y-6", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-blue-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h4", { className: "font-semibold text-blue-900", children: "Total Elements" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-blue-600", children: reportData.totalElements })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-green-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h4", { className: "font-semibold text-green-900", children: "Scenes" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-green-600", children: reportData.sceneCount })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-purple-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h4", { className: "font-semibold text-purple-900", children: "Avg per Scene" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-purple-600", children: reportData.averageElementsPerScene.toFixed(1) })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-orange-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h4", { className: "font-semibold text-orange-900", children: "Total Cost" }), (0,jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-orange-600", children: ["$", reportData.totalEstimatedCost.toLocaleString()] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [(0,jsx_runtime.jsx)("h4", { className: "font-semibold text-gray-900 mb-4", children: "Elements by Type" }), (0,jsx_runtime.jsx)("div", { className: "space-y-2", children: Object.entries(reportData.elementsByType).map(([type, count]) => ((0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-center", children: [(0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`, children: type }), (0,jsx_runtime.jsx)("span", { className: "font-semibold", children: count })] }, type))) })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [(0,jsx_runtime.jsx)("h4", { className: "font-semibold text-gray-900 mb-4", children: "Elements by Status" }), (0,jsx_runtime.jsx)("div", { className: "space-y-2", children: Object.entries(reportData.elementsByStatus).map(([status, count]) => ((0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-center", children: [(0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`, children: status.replace('_', ' ') }), (0,jsx_runtime.jsx)("span", { className: "font-semibold", children: count })] }, status))) })] })] })] })), selectedReport === 'budget' && ((0,jsx_runtime.jsxs)("div", { className: "space-y-6", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-yellow-50 p-6 rounded-lg", children: [(0,jsx_runtime.jsx)("h4", { className: "font-semibold text-yellow-900 mb-2", children: "Total Estimated Budget" }), (0,jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-yellow-600", children: ["$", reportData.totalEstimatedCost.toLocaleString()] })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [(0,jsx_runtime.jsx)("h4", { className: "font-semibold text-gray-900 mb-4", children: "Cost by Element Type" }), (0,jsx_runtime.jsx)("div", { className: "space-y-3", children: Object.entries(reportData.costByType)
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([type, cost]) => ((0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-center", children: [(0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`, children: type }), (0,jsx_runtime.jsxs)("span", { className: "font-semibold", children: ["$", cost.toLocaleString()] })] }, type))) })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [(0,jsx_runtime.jsx)("h4", { className: "font-semibold text-gray-900 mb-4", children: "Cost Breakdown Chart" }), (0,jsx_runtime.jsx)("div", { className: "space-y-2", children: Object.entries(reportData.costByType)
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([type, cost]) => {
                                            const percentage = (cost / reportData.totalEstimatedCost) * 100;
                                            return ((0,jsx_runtime.jsxs)("div", { className: "space-y-1", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between text-sm", children: [(0,jsx_runtime.jsx)("span", { className: "capitalize", children: type }), (0,jsx_runtime.jsxs)("span", { children: ["$", cost.toLocaleString(), " (", percentage.toFixed(1), "%)"] })] }), (0,jsx_runtime.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0,jsx_runtime.jsx)("div", { className: "bg-blue-600 h-2 rounded-full", style: { width: `${percentage}%` } }) })] }, type));
                                        }) })] })] })] })), selectedReport === 'scene' && ((0,jsx_runtime.jsx)("div", { className: "space-y-6", children: Object.entries(reportData.elementsByScene)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([scene, elements]) => ((0,jsx_runtime.jsxs)("div", { className: "bg-white border border-gray-200 rounded-lg", children: [(0,jsx_runtime.jsx)("div", { className: "bg-gray-50 px-4 py-3 border-b border-gray-200", children: (0,jsx_runtime.jsxs)("h4", { className: "font-semibold text-gray-900", children: [scene, " (", elements.length, " elements)"] }) }), (0,jsx_runtime.jsx)("div", { className: "p-4", children: (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: elements.map((element) => ((0,jsx_runtime.jsxs)("div", { className: "bg-gray-50 p-3 rounded-lg", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-start mb-2", children: [(0,jsx_runtime.jsx)("h5", { className: "font-medium text-gray-900 text-sm", children: element.name }), (0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(element.elementType)}`, children: element.elementType })] }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-1 mb-2", children: [(0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(element.priority)}`, children: element.priority }), (0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(element.status)}`, children: element.status })] }), element.estimatedCost && ((0,jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600", children: ["Est. Cost: $", element.estimatedCost] }))] }, element.id))) }) })] }, scene))) })), selectedReport === 'detailed' && ((0,jsx_runtime.jsx)("div", { className: "space-y-4", children: (0,jsx_runtime.jsx)("div", { className: "overflow-x-auto", children: (0,jsx_runtime.jsxs)("table", { className: "min-w-full bg-white border border-gray-200 rounded-lg", children: [(0,jsx_runtime.jsx)("thead", { className: "bg-gray-50", children: (0,jsx_runtime.jsxs)("tr", { children: [(0,jsx_runtime.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Element" }), (0,jsx_runtime.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Type" }), (0,jsx_runtime.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Scene" }), (0,jsx_runtime.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Page" }), (0,jsx_runtime.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Priority" }), (0,jsx_runtime.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), (0,jsx_runtime.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Cost" })] }) }), (0,jsx_runtime.jsx)("tbody", { className: "divide-y divide-gray-200", children: breakdownElements.map((element) => ((0,jsx_runtime.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0,jsx_runtime.jsx)("td", { className: "px-4 py-3", children: (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("div", { className: "font-medium text-gray-900", children: element.name }), element.description && ((0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-500", children: element.description }))] }) }), (0,jsx_runtime.jsx)("td", { className: "px-4 py-3", children: (0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(element.elementType)}`, children: element.elementType }) }), (0,jsx_runtime.jsx)("td", { className: "px-4 py-3 text-sm text-gray-900", children: element.scene || '-' }), (0,jsx_runtime.jsx)("td", { className: "px-4 py-3 text-sm text-gray-900", children: element.pageNumber || '-' }), (0,jsx_runtime.jsx)("td", { className: "px-4 py-3", children: (0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(element.priority)}`, children: element.priority }) }), (0,jsx_runtime.jsx)("td", { className: "px-4 py-3", children: (0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(element.status)}`, children: element.status }) }), (0,jsx_runtime.jsx)("td", { className: "px-4 py-3 text-sm text-gray-900", children: element.estimatedCost ? `$${element.estimatedCost}` : '-' })] }, element.id))) })] }) }) }))] }));
};
/* harmony default export */ const components_BreakdownReports = (BreakdownReports);

;// ./src/components/ScreenplayBreakdown.tsx






const ScreenplayBreakdown = ({ document, projectId, onBreakdownUpdate }) => {
    const [breakdownElements, setBreakdownElements] = (0,react.useState)([]);
    const [isAddingElement, setIsAddingElement] = (0,react.useState)(false);
    const [editingElement, setEditingElement] = (0,react.useState)(null);
    const [activeTab, setActiveTab] = (0,react.useState)('breakdown');
    const [formData, setFormData] = (0,react.useState)({
        elementType: 'prop',
        name: '',
        description: '',
        scene: '',
        pageNumber: '',
        lineNumber: '',
        context: '',
        notes: '',
        priority: 'medium',
        status: 'identified',
        assignedTo: '',
        estimatedCost: '',
        tags: []
    });
    const [newTag, setNewTag] = (0,react.useState)('');
    const [loading, setLoading] = (0,react.useState)(false);
    (0,react.useEffect)(() => {
        loadBreakdownElements();
    }, [document?.id]);
    const loadBreakdownElements = async () => {
        try {
            setLoading(true);
            let q;
            if (document?.id) {
                // Query by document ID if available
                q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'breakdownElements'), (0,index_esm/* where */._M)('documentId', '==', document.id));
            }
            else if (projectId) {
                // Query by project ID if no document
                q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'breakdownElements'), (0,index_esm/* where */._M)('projectId', '==', projectId));
            }
            else {
                // No document or project ID available
                setBreakdownElements([]);
                setLoading(false);
                return;
            }
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(q);
            const elements = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBreakdownElements(elements);
        }
        catch (error) {
            console.error('Error loading breakdown elements:', error);
            react_hot_toast_dist/* default */.Ay.error('Failed to load breakdown data');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const elementData = {
                ...formData,
                documentId: document?.id || null,
                projectId: projectId || 'default-project',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            if (editingElement) {
                // Update existing element
                await (0,index_esm/* updateDoc */.mZ)((0,index_esm.doc)(firebase.db, 'breakdownElements', editingElement), {
                    ...elementData,
                    updatedAt: new Date()
                });
                react_hot_toast_dist/* default */.Ay.success('Element updated successfully!');
            }
            else {
                // Add new element
                await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'breakdownElements'), elementData);
                react_hot_toast_dist/* default */.Ay.success('Element added successfully!');
            }
            // Reset form
            setFormData({
                elementType: 'prop',
                name: '',
                description: '',
                scene: '',
                pageNumber: '',
                lineNumber: '',
                context: '',
                notes: '',
                priority: 'medium',
                status: 'identified',
                assignedTo: '',
                estimatedCost: '',
                tags: []
            });
            setIsAddingElement(false);
            setEditingElement(null);
            loadBreakdownElements();
            if (onBreakdownUpdate) {
                onBreakdownUpdate();
            }
        }
        catch (error) {
            console.error('Error saving element:', error);
            react_hot_toast_dist/* default */.Ay.error('Failed to save element');
        }
    };
    const handleDelete = async (elementId) => {
        if (!confirm('Are you sure you want to delete this breakdown element?'))
            return;
        try {
            await (0,index_esm/* deleteDoc */.kd)((0,index_esm.doc)(firebase.db, 'breakdownElements', elementId));
            react_hot_toast_dist/* default */.Ay.success('Breakdown element deleted');
            loadBreakdownElements();
            onBreakdownUpdate?.();
        }
        catch (error) {
            console.error('Error deleting breakdown element:', error);
            react_hot_toast_dist/* default */.Ay.error('Failed to delete breakdown element');
        }
    };
    const handleEdit = (element) => {
        setEditingElement(element.id);
        setFormData({
            elementType: element.elementType,
            name: element.name,
            description: element.description || '',
            scene: element.scene || '',
            pageNumber: element.pageNumber?.toString() || '',
            lineNumber: element.lineNumber?.toString() || '',
            context: element.context || '',
            notes: element.notes || '',
            priority: element.priority,
            status: element.status,
            assignedTo: element.assignedTo || '',
            estimatedCost: element.estimatedCost?.toString() || '',
            tags: element.tags || []
        });
        setIsAddingElement(true);
    };
    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };
    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };
    const getElementTypeColor = (type) => {
        switch (type) {
            case 'prop': return 'bg-blue-100 text-blue-800';
            case 'cast': return 'bg-purple-100 text-purple-800';
            case 'location': return 'bg-green-100 text-green-800';
            case 'costume': return 'bg-pink-100 text-pink-800';
            case 'vehicle': return 'bg-orange-100 text-orange-800';
            case 'equipment': return 'bg-gray-100 text-gray-800';
            case 'sound': return 'bg-yellow-100 text-yellow-800';
            case 'effect': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'acquired': return 'bg-purple-100 text-purple-800';
            case 'identified': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const groupedElements = breakdownElements.reduce((acc, element) => {
        if (!acc[element.elementType]) {
            acc[element.elementType] = [];
        }
        acc[element.elementType].push(element);
        return acc;
    }, {});
    return ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-lg shadow-md p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg", children: [(0,jsx_runtime.jsx)("button", { onClick: () => setActiveTab('breakdown'), className: `flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'breakdown'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'}`, children: "Breakdown Elements" }), (0,jsx_runtime.jsx)("button", { onClick: () => setActiveTab('reports'), className: `flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'reports'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'}`, children: "Reports" })] }), activeTab === 'breakdown' && ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-center mb-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-bold text-gray-900", children: "Screenplay Breakdown" }), (0,jsx_runtime.jsxs)("button", { onClick: () => setIsAddingElement(true), className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors", children: [(0,jsx_runtime.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }), "Add Element"] })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-blue-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h4", { className: "font-semibold text-blue-900", children: "Total Elements" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-blue-600", children: breakdownElements.length })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-green-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h4", { className: "font-semibold text-green-900", children: "Completed" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-green-600", children: breakdownElements.filter(e => e.status === 'completed').length })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-orange-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h4", { className: "font-semibold text-orange-900", children: "In Progress" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-orange-600", children: breakdownElements.filter(e => e.status === 'in_progress').length })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-purple-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h4", { className: "font-semibold text-purple-900", children: "Categories" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-purple-600", children: Object.keys(groupedElements).length })] })] }), isAddingElement && ((0,jsx_runtime.jsxs)("div", { className: "bg-gray-50 p-6 rounded-lg mb-6", children: [(0,jsx_runtime.jsx)("h4", { className: "text-lg font-semibold mb-4", children: editingElement ? 'Edit Breakdown Element' : 'Add Breakdown Element' }), (0,jsx_runtime.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Element Type" }), (0,jsx_runtime.jsxs)("select", { value: formData.elementType, onChange: (e) => setFormData(prev => ({ ...prev, elementType: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", required: true, children: [(0,jsx_runtime.jsx)("option", { value: "prop", children: "Prop" }), (0,jsx_runtime.jsx)("option", { value: "cast", children: "Cast" }), (0,jsx_runtime.jsx)("option", { value: "location", children: "Location" }), (0,jsx_runtime.jsx)("option", { value: "costume", children: "Costume" }), (0,jsx_runtime.jsx)("option", { value: "vehicle", children: "Vehicle" }), (0,jsx_runtime.jsx)("option", { value: "equipment", children: "Equipment" }), (0,jsx_runtime.jsx)("option", { value: "sound", children: "Sound" }), (0,jsx_runtime.jsx)("option", { value: "effect", children: "Effect" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Name *" }), (0,jsx_runtime.jsx)("input", { type: "text", value: formData.name, onChange: (e) => setFormData(prev => ({ ...prev, name: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", required: true })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), (0,jsx_runtime.jsx)("textarea", { value: formData.description, onChange: (e) => setFormData(prev => ({ ...prev, description: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", rows: 3 })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Scene" }), (0,jsx_runtime.jsx)("input", { type: "text", value: formData.scene, onChange: (e) => setFormData(prev => ({ ...prev, scene: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Page Number" }), (0,jsx_runtime.jsx)("input", { type: "number", value: formData.pageNumber, onChange: (e) => setFormData(prev => ({ ...prev, pageNumber: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Line Number" }), (0,jsx_runtime.jsx)("input", { type: "number", value: formData.lineNumber, onChange: (e) => setFormData(prev => ({ ...prev, lineNumber: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Priority" }), (0,jsx_runtime.jsxs)("select", { value: formData.priority, onChange: (e) => setFormData(prev => ({ ...prev, priority: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [(0,jsx_runtime.jsx)("option", { value: "low", children: "Low" }), (0,jsx_runtime.jsx)("option", { value: "medium", children: "Medium" }), (0,jsx_runtime.jsx)("option", { value: "high", children: "High" }), (0,jsx_runtime.jsx)("option", { value: "critical", children: "Critical" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), (0,jsx_runtime.jsxs)("select", { value: formData.status, onChange: (e) => setFormData(prev => ({ ...prev, status: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [(0,jsx_runtime.jsx)("option", { value: "identified", children: "Identified" }), (0,jsx_runtime.jsx)("option", { value: "acquired", children: "Acquired" }), (0,jsx_runtime.jsx)("option", { value: "in_progress", children: "In Progress" }), (0,jsx_runtime.jsx)("option", { value: "completed", children: "Completed" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Estimated Cost" }), (0,jsx_runtime.jsx)("input", { type: "number", step: "0.01", value: formData.estimatedCost, onChange: (e) => setFormData(prev => ({ ...prev, estimatedCost: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tags" }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-2 mb-2", children: [(0,jsx_runtime.jsx)("input", { type: "text", value: newTag, onChange: (e) => setNewTag(e.target.value), placeholder: "Add a tag", className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: addTag, className: "px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700", children: "Add" })] }), (0,jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2", children: formData.tags.map((tag, index) => ((0,jsx_runtime.jsxs)("span", { className: "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1", children: [tag, (0,jsx_runtime.jsx)("button", { type: "button", onClick: () => removeTag(tag), className: "text-blue-600 hover:text-blue-800", children: "\u00D7" })] }, index))) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Notes" }), (0,jsx_runtime.jsx)("textarea", { value: formData.notes, onChange: (e) => setFormData(prev => ({ ...prev, notes: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", rows: 3 })] }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [(0,jsx_runtime.jsxs)("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors", children: [editingElement ? 'Update' : 'Add', " Element"] }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: () => {
                                                    setIsAddingElement(false);
                                                    setEditingElement(null);
                                                    setFormData({
                                                        elementType: 'prop',
                                                        name: '',
                                                        description: '',
                                                        scene: '',
                                                        pageNumber: '',
                                                        lineNumber: '',
                                                        context: '',
                                                        notes: '',
                                                        priority: 'medium',
                                                        status: 'identified',
                                                        assignedTo: '',
                                                        estimatedCost: '',
                                                        tags: []
                                                    });
                                                }, className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors", children: "Cancel" })] })] })] })), Object.keys(groupedElements).length > 0 ? ((0,jsx_runtime.jsx)("div", { className: "space-y-6", children: Object.entries(groupedElements).map(([type, elements]) => ((0,jsx_runtime.jsxs)("div", { className: "border border-gray-200 rounded-lg", children: [(0,jsx_runtime.jsx)("div", { className: "bg-gray-50 px-4 py-3 border-b border-gray-200", children: (0,jsx_runtime.jsxs)("h4", { className: "font-semibold text-gray-900 capitalize", children: [type, " (", elements.length, ")"] }) }), (0,jsx_runtime.jsx)("div", { className: "p-4", children: (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: elements.map((element) => ((0,jsx_runtime.jsxs)("div", { className: "bg-white border border-gray-200 rounded-lg p-4", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-start mb-2", children: [(0,jsx_runtime.jsx)("h5", { className: "font-semibold text-gray-900", children: element.name }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-1", children: [(0,jsx_runtime.jsx)("button", { onClick: () => handleEdit(element), className: "text-gray-600 hover:text-gray-800 p-1", title: "Edit", children: (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) }), (0,jsx_runtime.jsx)("button", { onClick: () => handleDelete(element.id), className: "text-red-600 hover:text-red-800 p-1", title: "Delete", children: (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) })] })] }), element.description && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600 mb-2", children: element.description })), (0,jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-2 mb-3", children: [(0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getElementTypeColor(element.elementType)}`, children: element.elementType }), (0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(element.priority)}`, children: element.priority }), (0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(element.status)}`, children: element.status })] }), (0,jsx_runtime.jsxs)("div", { className: "text-sm text-gray-500 space-y-1", children: [element.scene && (0,jsx_runtime.jsxs)("div", { children: ["Scene: ", element.scene] }), element.pageNumber && (0,jsx_runtime.jsxs)("div", { children: ["Page: ", element.pageNumber] }), element.estimatedCost && (0,jsx_runtime.jsxs)("div", { children: ["Est. Cost: $", element.estimatedCost] })] }), element.tags.length > 0 && ((0,jsx_runtime.jsx)("div", { className: "mt-3", children: (0,jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-1", children: element.tags.map((tag, index) => ((0,jsx_runtime.jsx)("span", { className: "bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs", children: tag }, index))) }) }))] }, element.id))) }) })] }, type))) })) : ((0,jsx_runtime.jsxs)("div", { className: "text-center py-8 text-gray-500", children: [(0,jsx_runtime.jsx)("p", { children: "No breakdown elements added yet." }), (0,jsx_runtime.jsx)("p", { className: "text-sm", children: "Click \"Add Element\" to start tagging your screenplay." })] }))] })), activeTab === 'reports' && document && ((0,jsx_runtime.jsx)(components_BreakdownReports, { document: document, projectId: projectId })), activeTab === 'reports' && !document && ((0,jsx_runtime.jsxs)("div", { className: "text-center py-8 text-gray-500", children: [(0,jsx_runtime.jsx)("p", { children: "No screenplay document available for reports." }), (0,jsx_runtime.jsx)("p", { className: "text-sm", children: "Upload a screenplay first to generate reports." })] }))] }));
};
/* harmony default export */ const components_ScreenplayBreakdown = (ScreenplayBreakdown);

;// ./src/pages/ProjectManagement/ProjectDocuments.tsx









entry/* pdfjs.GlobalWorkerOptions */.Uy.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${entry/* pdfjs.version */.Uy.version}/pdf.worker.js`;
const ProjectDocuments = ({ projectId, documents, onDocumentsUpdate }) => {
    const [isAddingDocument, setIsAddingDocument] = (0,react.useState)(false);
    const [editingDocument, setEditingDocument] = (0,react.useState)(null);
    const [uploadingFile, setUploadingFile] = (0,react.useState)(false);
    const [selectedFile, setSelectedFile] = (0,react.useState)(null);
    const [formData, setFormData] = (0,react.useState)({
        title: '',
        description: '',
        category: 'other',
        version: '1.0',
        tags: [],
        notes: ''
    });
    const [viewerOpen, setViewerOpen] = (0,react.useState)(false);
    const [viewerDoc, setViewerDoc] = (0,react.useState)(null);
    const [fdxText, setFdxText] = (0,react.useState)('');
    const [breakdownOpen, setBreakdownOpen] = (0,react.useState)(false);
    const [selectedDocument, setSelectedDocument] = (0,react.useState)(null);
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firebase/* auth */.j2.currentUser || !selectedFile)
            return;
        setUploadingFile(true);
        try {
            // Upload file to Firebase Storage
            const fileRef = (0,esm_index_esm/* ref */.KR)(firebase/* storage */.IG, `project-documents/${projectId}/${selectedFile.name}`);
            await (0,esm_index_esm/* uploadBytes */.D)(fileRef, selectedFile);
            const downloadURL = await (0,esm_index_esm/* getDownloadURL */.qk)(fileRef);
            const documentData = {
                ...formData,
                projectId,
                fileName: selectedFile.name,
                fileSize: selectedFile.size,
                fileType: selectedFile.type,
                downloadURL,
                createdBy: firebase/* auth */.j2.currentUser.uid,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            if (editingDocument) {
                await (0,index_esm/* updateDoc */.mZ)((0,index_esm.doc)(firebase.db, 'projectDocuments', editingDocument), {
                    ...documentData,
                    updatedAt: new Date()
                });
                setEditingDocument(null);
            }
            else {
                await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'projectDocuments'), documentData);
            }
            setFormData({
                title: '',
                description: '',
                category: 'other',
                version: '1.0',
                tags: [],
                notes: ''
            });
            setSelectedFile(null);
            setIsAddingDocument(false);
            onDocumentsUpdate();
        }
        catch (error) {
            console.error('Error uploading document:', error);
        }
        finally {
            setUploadingFile(false);
        }
    };
    const handleDelete = async (document) => {
        if (!confirm('Are you sure you want to delete this document?'))
            return;
        try {
            // Delete from Storage
            if (document.downloadURL) {
                const fileRef = (0,esm_index_esm/* ref */.KR)(firebase/* storage */.IG, document.downloadURL);
                await (0,esm_index_esm/* deleteObject */.XR)(fileRef);
            }
            // Delete from Firestore
            await (0,index_esm/* deleteDoc */.kd)((0,index_esm.doc)(firebase.db, 'projectDocuments', document.id));
            onDocumentsUpdate();
        }
        catch (error) {
            console.error('Error deleting document:', error);
        }
    };
    const handleEdit = (document) => {
        setEditingDocument(document.id);
        setFormData({
            title: document.title ?? '',
            description: document.description ?? '',
            category: document.category ?? 'other',
            version: document.version ?? '',
            tags: document.tags ?? [],
            notes: document.notes ?? ''
        });
        setIsAddingDocument(true);
    };
    const formatFileSize = (bytes) => {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    const getCategoryColor = (category) => {
        switch (category) {
            case 'script': return 'bg-purple-100 text-purple-800';
            case 'contract': return 'bg-blue-100 text-blue-800';
            case 'schedule': return 'bg-green-100 text-green-800';
            case 'budget': return 'bg-yellow-100 text-yellow-800';
            case 'call_sheet': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'script': return '📄';
            case 'contract': return '📋';
            case 'schedule': return '📅';
            case 'budget': return '💰';
            case 'call_sheet': return '📞';
            default: return '📁';
        }
    };
    const groupedDocuments = documents.reduce((acc, doc) => {
        if (!acc[doc.category]) {
            acc[doc.category] = [];
        }
        acc[doc.category].push(doc);
        return acc;
    }, {});
    const handleOpenViewer = async (doc) => {
        setViewerDoc(doc);
        setViewerOpen(true);
        if (doc.fileName.endsWith('.fdx')) {
            // Fetch and parse FDX
            const res = await fetch(doc.downloadURL);
            const xml = await res.text();
            const parser = new XMLParser/* default */.A();
            const parsed = parser.parse(xml);
            // Extract screenplay text (simple version)
            let text = '';
            if (parsed.FinalDraft && parsed.FinalDraft.Content && parsed.FinalDraft.Content.Paragraph) {
                const paragraphs = parsed.FinalDraft.Content.Paragraph;
                text = Array.isArray(paragraphs)
                    ? paragraphs.map((p) => p['#text'] || '').join('\n')
                    : paragraphs['#text'] || '';
            }
            setFdxText(text);
        }
    };
    const handleCloseViewer = () => {
        setViewerOpen(false);
        setViewerDoc(null);
        setFdxText('');
    };
    const handleOpenBreakdown = (document) => {
        setSelectedDocument(document);
        setBreakdownOpen(true);
    };
    const handleCloseBreakdown = () => {
        setBreakdownOpen(false);
        setSelectedDocument(null);
    };
    const isScreenplay = (document) => {
        return document.fileName.endsWith('.fdx') ||
            document.fileName.endsWith('.pdf') ||
            document.category === 'script';
    };
    return ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-lg shadow-md p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-center mb-6", children: [(0,jsx_runtime.jsx)("h2", { className: "text-2xl font-bold text-gray-900", children: "Project Documents" }), (0,jsx_runtime.jsxs)("button", { onClick: () => setIsAddingDocument(true), className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors", children: [(0,jsx_runtime.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }), "Upload Document"] })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-blue-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h3", { className: "font-semibold text-blue-900", children: "Total Documents" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-blue-600", children: documents.length })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-green-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h3", { className: "font-semibold text-green-900", children: "Total Size" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-green-600", children: formatFileSize(documents.reduce((acc, doc) => acc + (doc.fileSize || 0), 0)) })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-purple-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h3", { className: "font-semibold text-purple-900", children: "Categories" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-purple-600", children: Object.keys(groupedDocuments).length })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-yellow-50 p-4 rounded-lg", children: [(0,jsx_runtime.jsx)("h3", { className: "font-semibold text-yellow-900", children: "Latest Upload" }), (0,jsx_runtime.jsx)("p", { className: "text-sm font-bold text-yellow-600", children: documents.length > 0
                                    ? new Date(Math.max(...documents.map(d => d.createdAt?.toDate?.() || d.createdAt))).toLocaleDateString()
                                    : 'None' })] })] }), isAddingDocument && ((0,jsx_runtime.jsxs)("div", { className: "bg-gray-50 p-6 rounded-lg mb-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold mb-4", children: editingDocument ? 'Edit Document' : 'Upload New Document' }), (0,jsx_runtime.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Document Title *" }), (0,jsx_runtime.jsx)("input", { type: "text", required: true, value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Category" }), (0,jsx_runtime.jsxs)("select", { value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: [(0,jsx_runtime.jsx)("option", { value: "script", children: "Script" }), (0,jsx_runtime.jsx)("option", { value: "contract", children: "Contract" }), (0,jsx_runtime.jsx)("option", { value: "schedule", children: "Schedule" }), (0,jsx_runtime.jsx)("option", { value: "budget", children: "Budget" }), (0,jsx_runtime.jsx)("option", { value: "call_sheet", children: "Call Sheet" }), (0,jsx_runtime.jsx)("option", { value: "other", children: "Other" })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), (0,jsx_runtime.jsx)("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Version" }), (0,jsx_runtime.jsx)("input", { type: "text", value: formData.version, onChange: (e) => setFormData({ ...formData, version: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "1.0" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tags (comma-separated)" }), (0,jsx_runtime.jsx)("input", { type: "text", value: formData.tags.join(', '), onChange: (e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "important, draft, final" })] })] }), !editingDocument && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "File *" }), (0,jsx_runtime.jsx)("input", { type: "file", required: true, accept: ".fdx,.pdf", onChange: handleFileSelect, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }), selectedFile && ((0,jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600 mt-1", children: ["Selected: ", selectedFile.name, " (", formatFileSize(selectedFile.size), ")"] }))] })), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Notes" }), (0,jsx_runtime.jsx)("textarea", { value: formData.notes, onChange: (e) => setFormData({ ...formData, notes: e.target.value }), rows: 2, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Additional notes..." })] }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-3", children: [(0,jsx_runtime.jsxs)("button", { type: "submit", disabled: uploadingFile || (!editingDocument && !selectedFile), className: "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2", children: [uploadingFile && ((0,jsx_runtime.jsxs)("svg", { className: "animate-spin h-4 w-4", fill: "none", viewBox: "0 0 24 24", children: [(0,jsx_runtime.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0,jsx_runtime.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })), editingDocument ? 'Update Document' : 'Upload Document'] }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: () => {
                                            setIsAddingDocument(false);
                                            setEditingDocument(null);
                                            setSelectedFile(null);
                                            setFormData({
                                                title: '',
                                                description: '',
                                                category: 'other',
                                                version: '1.0',
                                                tags: [],
                                                notes: ''
                                            });
                                        }, className: "bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors", children: "Cancel" })] })] })] })), (0,jsx_runtime.jsx)("div", { className: "space-y-6", children: Object.keys(groupedDocuments).length > 0 ? (Object.entries(groupedDocuments).map(([category, docs]) => ((0,jsx_runtime.jsxs)("div", { className: "border border-gray-200 rounded-lg", children: [(0,jsx_runtime.jsx)("div", { className: "bg-gray-50 px-4 py-3 border-b border-gray-200", children: (0,jsx_runtime.jsxs)("h3", { className: "text-lg font-semibold text-gray-900 flex items-center gap-2", children: [(0,jsx_runtime.jsx)("span", { children: getCategoryIcon(category) }), category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()), (0,jsx_runtime.jsxs)("span", { className: "text-sm text-gray-500", children: ["(", docs.length, ")"] })] }) }), (0,jsx_runtime.jsx)("div", { className: "p-4 space-y-3", children: docs.map((document) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3 flex-1", children: [(0,jsx_runtime.jsx)("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: (0,jsx_runtime.jsx)("svg", { className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), (0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsx)("h4", { className: "font-medium text-gray-900", children: document.title }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [(0,jsx_runtime.jsx)("span", { children: document.fileName }), (0,jsx_runtime.jsx)("span", { children: "\u2022" }), (0,jsx_runtime.jsx)("span", { children: formatFileSize(document.fileSize || 0) }), (0,jsx_runtime.jsx)("span", { children: "\u2022" }), (0,jsx_runtime.jsxs)("span", { children: ["v", document.version] }), (0,jsx_runtime.jsx)("span", { children: "\u2022" }), (0,jsx_runtime.jsx)("span", { children: new Date(document.createdAt?.toDate?.() || document.createdAt).toLocaleDateString() })] }), document.description && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600 mt-1", children: document.description })), document.tags && document.tags.length > 0 && ((0,jsx_runtime.jsx)("div", { className: "flex gap-1 mt-2", children: document.tags.map((tag, index) => ((0,jsx_runtime.jsx)("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded", children: tag }, index))) }))] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)("a", { href: document.downloadURL, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:text-blue-800 p-2", title: "Download", children: (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), (0,jsx_runtime.jsx)("button", { onClick: () => handleEdit(document), className: "text-gray-600 hover:text-gray-800 p-2", title: "Edit", children: (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) }), (0,jsx_runtime.jsx)("button", { onClick: () => handleDelete(document), className: "text-red-600 hover:text-red-800 p-2", title: "Delete", children: (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) }), (0,jsx_runtime.jsx)("button", { onClick: () => handleOpenViewer(document), className: "text-gray-600 hover:text-gray-800 p-2", title: "View", children: (0,jsx_runtime.jsxs)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [(0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7c-4.477 0-8.268-2.943-9.542-7z" })] }) }), isScreenplay(document) && ((0,jsx_runtime.jsx)("button", { onClick: () => handleOpenBreakdown(document), className: "text-purple-600 hover:text-purple-800 p-2", title: "Breakdown", children: (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" }) }) }))] })] }, document.id))) })] }, category)))) : ((0,jsx_runtime.jsxs)("div", { className: "text-center py-8 text-gray-500", children: [(0,jsx_runtime.jsx)("svg", { className: "w-12 h-12 mx-auto mb-4 text-gray-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), (0,jsx_runtime.jsx)("p", { children: "No documents uploaded yet." }), (0,jsx_runtime.jsx)("p", { className: "text-sm", children: "Click \"Upload Document\" to get started." })] })) }), (0,jsx_runtime.jsxs)((lib_default()), { isOpen: viewerOpen, onRequestClose: handleCloseViewer, contentLabel: "Document Viewer", style: { content: { maxWidth: '800px', margin: 'auto' } }, children: [(0,jsx_runtime.jsx)("button", { onClick: handleCloseViewer, className: "float-right text-lg", children: "\u00D7" }), viewerDoc?.fileName.endsWith('.pdf') && ((0,jsx_runtime.jsx)(entry/* Document */.yo, { file: viewerDoc.downloadURL, children: (0,jsx_runtime.jsx)(entry/* Page */.YW, { pageNumber: 1 }) })), viewerDoc?.fileName.endsWith('.fdx') && ((0,jsx_runtime.jsx)("pre", { style: { whiteSpace: 'pre-wrap', fontFamily: 'monospace', marginTop: '2em' }, children: fdxText || 'Loading...' }))] }), (0,jsx_runtime.jsxs)((lib_default()), { isOpen: breakdownOpen, onRequestClose: handleCloseBreakdown, contentLabel: "Screenplay Breakdown", style: {
                    content: {
                        maxWidth: '1200px',
                        maxHeight: '90vh',
                        margin: 'auto',
                        padding: '20px'
                    }
                }, children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between items-center mb-4", children: [(0,jsx_runtime.jsx)("h2", { className: "text-xl font-bold", children: "Screenplay Breakdown" }), (0,jsx_runtime.jsx)("button", { onClick: handleCloseBreakdown, className: "text-gray-500 hover:text-gray-700 text-2xl", children: "\u00D7" })] }), selectedDocument && ((0,jsx_runtime.jsx)(components_ScreenplayBreakdown, { document: selectedDocument, onBreakdownUpdate: () => {
                            // Refresh documents if needed
                            onDocumentsUpdate();
                        } }))] })] }));
};
/* harmony default export */ const ProjectManagement_ProjectDocuments = (ProjectDocuments);

// EXTERNAL MODULE: ./src/components/CollaborativeTasks/CollaborativeTasksHub.tsx + 3 modules
var CollaborativeTasksHub = __webpack_require__(4818);
;// ./src/pages/ProjectManagement/ProjectDashboard.tsx










const ProjectDashboard = () => {
    const { projectId } = (0,dist/* useParams */.g)();
    const [project, setProject] = (0,react.useState)(null);
    const [crew, setCrew] = (0,react.useState)([]);
    const [budget, setBudget] = (0,react.useState)(null);
    const [timeline, setTimeline] = (0,react.useState)(null);
    const [documents, setDocuments] = (0,react.useState)([]);
    const [activeTab, setActiveTab] = (0,react.useState)('overview');
    const [loading, setLoading] = (0,react.useState)(true);
    (0,react.useEffect)(() => {
        loadProjectData();
    }, [projectId]);
    const loadProjectData = async () => {
        if (!projectId)
            return;
        setLoading(true);
        try {
            // Load project details
            const projectDoc = await (0,index_esm.getDoc)((0,index_esm.doc)(firebase.db, 'projects', projectId));
            if (projectDoc.exists()) {
                setProject({ id: projectDoc.id, ...projectDoc.data() });
            }
            // Load crew data
            const crewQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'projectCrew'), (0,index_esm/* where */._M)('projectId', '==', projectId));
            const crewSnapshot = await (0,index_esm/* getDocs */.GG)(crewQuery);
            const crewData = crewSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCrew(crewData);
            // Load budget data
            const budgetQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'projectBudgets'), (0,index_esm/* where */._M)('projectId', '==', projectId));
            const budgetSnapshot = await (0,index_esm/* getDocs */.GG)(budgetQuery);
            if (!budgetSnapshot.empty) {
                const budgetData = { id: budgetSnapshot.docs[0].id, ...budgetSnapshot.docs[0].data() };
                setBudget(budgetData);
            }
            // Load timeline data
            const timelineQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'projectTimelines'), (0,index_esm/* where */._M)('projectId', '==', projectId));
            const timelineSnapshot = await (0,index_esm/* getDocs */.GG)(timelineQuery);
            if (!timelineSnapshot.empty) {
                const timelineData = { id: timelineSnapshot.docs[0].id, ...timelineSnapshot.docs[0].data() };
                setTimeline(timelineData);
            }
            // Load documents
            const documentsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'projectDocuments'), (0,index_esm/* where */._M)('projectId', '==', projectId));
            const documentsSnapshot = await (0,index_esm/* getDocs */.GG)(documentsQuery);
            const documentsData = documentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDocuments(documentsData);
        }
        catch (error) {
            console.error('Error loading project data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const getProjectStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'planning': return 'bg-yellow-100 text-yellow-800';
            case 'on_hold': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const calculateProgress = () => {
        if (!timeline?.phase || !project?.phases)
            return 0;
        const completed = project.phases.filter(p => p.status === 'completed').length;
        return Math.round((completed / project.phases.length) * 100);
    };
    const calculateBudgetUsage = () => {
        if (!budget)
            return 0;
        const totalSpent = Object.values(budget.categories || {}).reduce((acc, cat) => acc + (cat.spent || 0), 0);
        return Math.round((totalSpent / budget.totalBudget) * 100);
    };
    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'crew', label: 'Crew', icon: '👥' },
        { id: 'budget', label: 'Budget', icon: '💰' },
        { id: 'timeline', label: 'Timeline', icon: '📅' },
        { id: 'documents', label: 'Documents', icon: '📁' },
        { id: 'tasks', label: 'Tasks', icon: '✅' }
    ];
    if (loading) {
        return ((0,jsx_runtime.jsx)("div", { className: "flex items-center justify-center min-h-screen", children: (0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" }) }));
    }
    if (!project) {
        return ((0,jsx_runtime.jsxs)("div", { className: "text-center py-8", children: [(0,jsx_runtime.jsx)("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Project Not Found" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: "The project you're looking for doesn't exist or you don't have access to it." })] }));
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gray-50", children: [(0,jsx_runtime.jsx)("div", { className: "bg-white shadow-sm border-b", children: (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h1", { className: "text-3xl font-bold text-gray-900", style: { color: '#fff', fontWeight: 700 }, children: project.projectName }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mt-1", style: { color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }, children: project.logline }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 mt-2", children: [(0,jsx_runtime.jsx)("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${getProjectStatusColor(project.status)}`, children: project.status.replace('_', ' ') }), (0,jsx_runtime.jsxs)("span", { className: "text-sm text-gray-500", style: { color: 'rgba(255,255,255,0.7)' }, children: ["Created ", new Date(project.createdAt?.toDate?.() || project.createdAt).toLocaleDateString()] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsxs)(react_router_dom_dist/* Link */.N_, { to: `/analytics/project/${projectId}`, className: "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2", children: [(0,jsx_runtime.jsx)("span", { children: "\uD83D\uDCCA" }), "Analytics"] }), (0,jsx_runtime.jsx)("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors", children: "Edit Project" }), (0,jsx_runtime.jsx)("button", { className: "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors", children: "Export" })] })] }) }) }), (0,jsx_runtime.jsx)("div", { className: "bg-white border-b", children: (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: (0,jsx_runtime.jsx)("nav", { className: "flex space-x-8", children: tabs.map((tab) => ((0,jsx_runtime.jsxs)("button", { onClick: () => setActiveTab(tab.id), className: `py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [(0,jsx_runtime.jsx)("span", { children: tab.icon }), tab.label] }, tab.id))) }) }) }), (0,jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [activeTab === 'overview' && ((0,jsx_runtime.jsxs)("div", { className: "space-y-6", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [(0,jsx_runtime.jsx)("div", { className: "bg-white rounded-lg shadow-sm p-6 border", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center", children: [(0,jsx_runtime.jsx)("div", { className: "flex-shrink-0", children: (0,jsx_runtime.jsx)("div", { className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center", children: (0,jsx_runtime.jsx)("svg", { className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }) }) }), (0,jsx_runtime.jsxs)("div", { className: "ml-4", children: [(0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-500", style: { color: 'rgba(255,255,255,0.7)' }, children: "Crew Members" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-semibold text-gray-900", style: { color: '#fff', fontWeight: 600 }, children: crew.length })] })] }) }), (0,jsx_runtime.jsx)("div", { className: "bg-white rounded-lg shadow-sm p-6 border", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center", children: [(0,jsx_runtime.jsx)("div", { className: "flex-shrink-0", children: (0,jsx_runtime.jsx)("div", { className: "w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center", children: (0,jsx_runtime.jsx)("svg", { className: "w-5 h-5 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }) }) }), (0,jsx_runtime.jsxs)("div", { className: "ml-4", children: [(0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-500", style: { color: 'rgba(255,255,255,0.7)' }, children: "Documents" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-semibold text-gray-900", style: { color: '#fff', fontWeight: 600 }, children: documents.length })] })] }) }), (0,jsx_runtime.jsx)("div", { className: "bg-white rounded-lg shadow-sm p-6 border", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center", children: [(0,jsx_runtime.jsx)("div", { className: "flex-shrink-0", children: (0,jsx_runtime.jsx)("div", { className: "w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center", children: (0,jsx_runtime.jsx)("svg", { className: "w-5 h-5 text-purple-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }) }), (0,jsx_runtime.jsxs)("div", { className: "ml-4", children: [(0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-500", style: { color: 'rgba(255,255,255,0.7)' }, children: "Progress" }), (0,jsx_runtime.jsxs)("p", { className: "text-2xl font-semibold text-gray-900", style: { color: '#fff', fontWeight: 600 }, children: [calculateProgress(), "%"] })] })] }) }), (0,jsx_runtime.jsx)("div", { className: "bg-white rounded-lg shadow-sm p-6 border", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center", children: [(0,jsx_runtime.jsx)("div", { className: "flex-shrink-0", children: (0,jsx_runtime.jsx)("div", { className: "w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center", children: (0,jsx_runtime.jsx)("svg", { className: "w-5 h-5 text-yellow-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" }) }) }) }), (0,jsx_runtime.jsxs)("div", { className: "ml-4", children: [(0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-500", style: { color: 'rgba(255,255,255,0.7)' }, children: "Budget Used" }), (0,jsx_runtime.jsxs)("p", { className: "text-2xl font-semibold text-gray-900", style: { color: '#fff', fontWeight: 600 }, children: [calculateBudgetUsage(), "%"] })] })] }) })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-lg shadow-sm p-6 border", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", style: { color: '#fff', fontWeight: 600 }, children: "Project Details" }), (0,jsx_runtime.jsxs)("dl", { className: "space-y-3", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("dt", { className: "text-sm font-medium text-gray-500", style: { color: 'rgba(255,255,255,0.7)' }, children: "Genre" }), (0,jsx_runtime.jsx)("dd", { className: "text-sm text-gray-900", style: { color: '#fff' }, children: project.genre || 'Not specified' })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("dt", { className: "text-sm font-medium text-gray-500", style: { color: 'rgba(255,255,255,0.7)' }, children: "Location" }), (0,jsx_runtime.jsx)("dd", { className: "text-sm text-gray-900", style: { color: '#fff' }, children: project.productionLocations && project.productionLocations.length > 0
                                                                    ? `${project.productionLocations[0].city || ''} ${project.productionLocations[0].country}`.trim()
                                                                    : 'Not specified' })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("dt", { className: "text-sm font-medium text-gray-500", style: { color: 'rgba(255,255,255,0.7)' }, children: "Start Date" }), (0,jsx_runtime.jsx)("dd", { className: "text-sm text-gray-900", style: { color: '#fff' }, children: project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not specified' })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("dt", { className: "text-sm font-medium text-gray-500", style: { color: 'rgba(255,255,255,0.7)' }, children: "End Date" }), (0,jsx_runtime.jsx)("dd", { className: "text-sm text-gray-900", style: { color: '#fff' }, children: project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not specified' })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("dt", { className: "text-sm font-medium text-gray-500", style: { color: 'rgba(255,255,255,0.7)' }, children: "Budget" }), (0,jsx_runtime.jsx)("dd", { className: "text-sm text-gray-900", style: { color: '#fff' }, children: budget ? `$${budget.totalBudget?.toLocaleString()}` : 'Not specified' })] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-lg shadow-sm p-6 border", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Recent Activity" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [documents.slice(0, 3).map((doc) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }), (0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsxs)("p", { className: "text-sm text-gray-900", children: [doc.fileName, " was uploaded"] }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: new Date(doc.uploadedAt?.toDate?.() || doc.uploadedAt).toLocaleDateString() })] })] }, doc.id))), documents.length === 0 && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "No recent activity" }))] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-lg shadow-sm p-6 border", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", style: { color: '#fff', fontWeight: 600 }, children: "Quick Actions" }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0,jsx_runtime.jsxs)("button", { onClick: () => setActiveTab('crew'), className: "flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors", children: [(0,jsx_runtime.jsx)("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: (0,jsx_runtime.jsx)("svg", { className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }) }), (0,jsx_runtime.jsxs)("div", { className: "text-left", children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", style: { color: '#fff', fontWeight: 600 }, children: "Add Crew Member" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", style: { color: 'rgba(255,255,255,0.7)' }, children: "Manage your team" })] })] }), (0,jsx_runtime.jsxs)("button", { onClick: () => setActiveTab('timeline'), className: "flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors", children: [(0,jsx_runtime.jsx)("div", { className: "w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center", children: (0,jsx_runtime.jsx)("svg", { className: "w-5 h-5 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }), (0,jsx_runtime.jsxs)("div", { className: "text-left", children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "Add Milestone" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Track progress" })] })] }), (0,jsx_runtime.jsxs)("button", { onClick: () => setActiveTab('documents'), className: "flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors", children: [(0,jsx_runtime.jsx)("div", { className: "w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center", children: (0,jsx_runtime.jsx)("svg", { className: "w-5 h-5 text-purple-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" }) }) }), (0,jsx_runtime.jsxs)("div", { className: "text-left", children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "Upload Document" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Share files" })] })] })] })] })] })), activeTab === 'crew' && ((0,jsx_runtime.jsx)(ProjectManagement_ProjectCrewManagement, { projectId: projectId, crew: crew, onCrewUpdate: loadProjectData })), activeTab === 'budget' && ((0,jsx_runtime.jsx)(ProjectManagement_ProjectBudgetView, { projectId: projectId, budget: budget, onBudgetUpdate: loadProjectData })), activeTab === 'timeline' && ((0,jsx_runtime.jsx)(ProjectManagement_ProjectTimelineView, { projectId: projectId, timeline: timeline, onTimelineUpdate: loadProjectData })), activeTab === 'documents' && ((0,jsx_runtime.jsx)(ProjectManagement_ProjectDocuments, { projectId: projectId, documents: documents, onDocumentsUpdate: loadProjectData })), activeTab === 'tasks' && ((0,jsx_runtime.jsx)(CollaborativeTasksHub/* default */.A, { projectId: projectId }))] })] }));
};
/* harmony default export */ const ProjectManagement_ProjectDashboard = (ProjectDashboard);


/***/ })

}]);
//# sourceMappingURL=4381.chunk.js.map