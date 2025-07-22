(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[6290],{

/***/ 296:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_CollaborationPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(5072);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(7825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(7659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(5056);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(1113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/CollaborativeTasks/TaskForm.scss
var TaskForm = __webpack_require__(8597);
;// ./src/components/CollaborativeTasks/TaskForm.scss

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(TaskForm/* default */.A, options);




       /* harmony default export */ const CollaborativeTasks_TaskForm = (TaskForm/* default */.A && TaskForm/* default */.A.locals ? TaskForm/* default */.A.locals : undefined);

;// ./src/components/CollaborativeTasks/TaskForm.tsx





const TaskForm_TaskForm = ({ task, onSubmit, onCancel, projectId }) => {
    const [formData, setFormData] = (0,react.useState)({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        category: 'other',
        estimatedHours: 0,
        location: '',
        budget: 0,
        notes: '',
        tags: [],
        assignedTeamMembers: [],
        subtasks: []
    });
    const [availableTeamMembers, setAvailableTeamMembers] = (0,react.useState)([]);
    const [showSubtaskForm, setShowSubtaskForm] = (0,react.useState)(false);
    const [subtaskForm, setSubtaskForm] = (0,react.useState)({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
        estimatedHours: 0
    });
    const [loading, setLoading] = (0,react.useState)(false);
    (0,react.useEffect)(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                priority: task.priority,
                dueDate: task.dueDate,
                category: task.category,
                estimatedHours: task.estimatedHours || 0,
                location: task.location || '',
                budget: task.budget || 0,
                notes: task.notes || '',
                tags: task.tags || [],
                assignedTeamMembers: task.assignedTeamMembers || [],
                subtasks: task.subtasks || []
            });
        }
        loadTeamMembers();
    }, [task]);
    const loadTeamMembers = async () => {
        try {
            setLoading(true);
            // Load project crew members
            const crewQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'projectCrew'), (0,index_esm/* where */._M)('projectId', '==', projectId));
            const crewSnapshot = await (0,index_esm/* getDocs */.GG)(crewQuery);
            const crewMembers = crewSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // If no crew members found, create some mock data for demonstration
            if (crewMembers.length === 0) {
                const mockMembers = [
                    { id: 'member-1', name: 'John Director', role: 'Director', email: 'john@example.com' },
                    { id: 'member-2', name: 'Sarah Producer', role: 'Producer', email: 'sarah@example.com' },
                    { id: 'member-3', name: 'Mike DP', role: 'Director of Photography', email: 'mike@example.com' },
                    { id: 'member-4', name: 'Lisa Editor', role: 'Editor', email: 'lisa@example.com' },
                    { id: 'member-5', name: 'Tom Sound', role: 'Sound Designer', email: 'tom@example.com' }
                ];
                setAvailableTeamMembers(mockMembers);
            }
            else {
                setAvailableTeamMembers(crewMembers);
            }
        }
        catch (error) {
            console.error('Error loading team members:', error);
            // Fallback to mock data
            const mockMembers = [
                { id: 'member-1', name: 'John Director', role: 'Director', email: 'john@example.com' },
                { id: 'member-2', name: 'Sarah Producer', role: 'Producer', email: 'sarah@example.com' },
                { id: 'member-3', name: 'Mike DP', role: 'Director of Photography', email: 'mike@example.com' },
                { id: 'member-4', name: 'Lisa Editor', role: 'Editor', email: 'lisa@example.com' },
                { id: 'member-5', name: 'Tom Sound', role: 'Sound Designer', email: 'tom@example.com' }
            ];
            setAvailableTeamMembers(mockMembers);
        }
        finally {
            setLoading(false);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleTagsChange = (value) => {
        const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
        setFormData(prev => ({ ...prev, tags }));
    };
    const handleAddTeamMember = () => {
        const newMember = {
            userId: '',
            role: 'contributor',
            assignedAt: new Date(),
            assignedBy: firebase/* auth */.j2.currentUser?.uid || '',
            status: 'assigned',
            subtasks: [],
            estimatedHours: 0,
            actualHours: 0,
            notes: ''
        };
        setFormData(prev => ({
            ...prev,
            assignedTeamMembers: [...prev.assignedTeamMembers, newMember]
        }));
    };
    const handleTeamMemberChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            assignedTeamMembers: prev.assignedTeamMembers.map((member, i) => i === index ? { ...member, [field]: value } : member)
        }));
    };
    const handleRemoveTeamMember = (index) => {
        setFormData(prev => ({
            ...prev,
            assignedTeamMembers: prev.assignedTeamMembers.filter((_, i) => i !== index)
        }));
    };
    const handleAddSubtask = () => {
        const newSubtask = {
            id: Date.now().toString(),
            taskId: task?.id || '',
            title: '',
            description: '',
            status: 'pending',
            priority: 'medium',
            assignedTo: '',
            dueDate: '',
            estimatedHours: 0,
            actualHours: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            notes: '',
            attachments: [],
            dependencies: []
        };
        setFormData(prev => ({
            ...prev,
            subtasks: [...prev.subtasks, newSubtask]
        }));
        setShowSubtaskForm(false);
    };
    const handleRemoveSubtask = (index) => {
        setFormData(prev => ({
            ...prev,
            subtasks: prev.subtasks.filter((_, i) => i !== index)
        }));
    };
    const handleSubtaskChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            subtasks: prev.subtasks.map((subtask, i) => i === index ? { ...subtask, [field]: value } : subtask)
        }));
    };
    const handleCompleteSubtask = (index) => {
        setFormData(prev => ({
            ...prev,
            subtasks: prev.subtasks.map((subtask, i) => i === index ? {
                ...subtask,
                status: 'completed',
                completedAt: new Date(),
                updatedAt: new Date()
            } : subtask)
        }));
    };
    const handleAssignMemberToSubtask = (subtaskIndex, memberId) => {
        setFormData(prev => ({
            ...prev,
            subtasks: prev.subtasks.map((subtask, i) => i === subtaskIndex ? { ...subtask, assignedTo: memberId } : subtask)
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate required fields
        if (!formData.title.trim()) {
            alert('Please enter a task title');
            return;
        }
        // Create notification for assigned team members
        const assignedMembers = formData.assignedTeamMembers.filter(member => member.userId);
        if (assignedMembers.length > 0) {
            // Here you would typically send notifications to assigned members
            console.log('Notifying assigned members:', assignedMembers);
        }
        onSubmit(formData);
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low': return '#10b981';
            case 'medium': return '#f59e0b';
            case 'high': return '#ef4444';
            case 'critical': return '#7c3aed';
            default: return '#6b7280';
        }
    };
    // Handle Escape key to close form
    (0,react.useEffect)(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);
    return ((0,jsx_runtime.jsx)("div", { className: "task-form-overlay", children: (0,jsx_runtime.jsxs)("div", { className: "task-form-modal", children: [(0,jsx_runtime.jsxs)("div", { className: "form-header", children: [(0,jsx_runtime.jsx)("h2", { children: task ? 'Edit Task' : 'Create New Task' }), (0,jsx_runtime.jsx)("button", { onClick: onCancel, className: "close-btn", children: (0,jsx_runtime.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), (0,jsx_runtime.jsxs)("form", { onSubmit: handleSubmit, className: "form-content", children: [(0,jsx_runtime.jsxs)("div", { className: "form-section", children: [(0,jsx_runtime.jsx)("h3", { children: "Basic Information" }), (0,jsx_runtime.jsx)("div", { className: "form-row", children: (0,jsx_runtime.jsxs)("div", { className: "form-group full-width", children: [(0,jsx_runtime.jsx)("label", { children: "Task Title *" }), (0,jsx_runtime.jsx)("input", { type: "text", value: formData.title, onChange: (e) => handleInputChange('title', e.target.value), placeholder: "Enter task title", className: "form-input", required: true })] }) }), (0,jsx_runtime.jsx)("div", { className: "form-row", children: (0,jsx_runtime.jsxs)("div", { className: "form-group full-width", children: [(0,jsx_runtime.jsx)("label", { children: "Description" }), (0,jsx_runtime.jsx)("textarea", { value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), placeholder: "Describe the task...", className: "form-textarea", rows: 3 })] }) }), (0,jsx_runtime.jsxs)("div", { className: "form-row", children: [(0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Priority" }), (0,jsx_runtime.jsxs)("select", { value: formData.priority, onChange: (e) => handleInputChange('priority', e.target.value), className: "form-select", style: { borderLeftColor: getPriorityColor(formData.priority) }, children: [(0,jsx_runtime.jsx)("option", { value: "low", children: "Low" }), (0,jsx_runtime.jsx)("option", { value: "medium", children: "Medium" }), (0,jsx_runtime.jsx)("option", { value: "high", children: "High" }), (0,jsx_runtime.jsx)("option", { value: "critical", children: "Critical" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Category" }), (0,jsx_runtime.jsxs)("select", { value: formData.category, onChange: (e) => handleInputChange('category', e.target.value), className: "form-select", children: [(0,jsx_runtime.jsx)("option", { value: "pre_production", children: "Pre-Production" }), (0,jsx_runtime.jsx)("option", { value: "production", children: "Production" }), (0,jsx_runtime.jsx)("option", { value: "post_production", children: "Post-Production" }), (0,jsx_runtime.jsx)("option", { value: "marketing", children: "Marketing" }), (0,jsx_runtime.jsx)("option", { value: "distribution", children: "Distribution" }), (0,jsx_runtime.jsx)("option", { value: "other", children: "Other" })] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "form-row", children: [(0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Due Date" }), (0,jsx_runtime.jsx)("input", { type: "date", value: formData.dueDate, onChange: (e) => handleInputChange('dueDate', e.target.value), className: "form-input" })] }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Estimated Hours" }), (0,jsx_runtime.jsx)("input", { type: "number", value: formData.estimatedHours, onChange: (e) => handleInputChange('estimatedHours', parseFloat(e.target.value) || 0), placeholder: "0", className: "form-input", min: "0", step: "0.5" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "form-row", children: [(0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Location" }), (0,jsx_runtime.jsx)("input", { type: "text", value: formData.location, onChange: (e) => handleInputChange('location', e.target.value), placeholder: "Task location", className: "form-input" })] }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Budget" }), (0,jsx_runtime.jsx)("input", { type: "number", value: formData.budget, onChange: (e) => handleInputChange('budget', parseFloat(e.target.value) || 0), placeholder: "0", className: "form-input", min: "0", step: "0.01" })] })] }), (0,jsx_runtime.jsx)("div", { className: "form-row", children: (0,jsx_runtime.jsxs)("div", { className: "form-group full-width", children: [(0,jsx_runtime.jsx)("label", { children: "Tags" }), (0,jsx_runtime.jsx)("input", { type: "text", value: formData.tags.join(', '), onChange: (e) => handleTagsChange(e.target.value), placeholder: "Enter tags separated by commas", className: "form-input" })] }) })] }), (0,jsx_runtime.jsxs)("div", { className: "form-section", children: [(0,jsx_runtime.jsxs)("div", { className: "section-header", children: [(0,jsx_runtime.jsx)("h3", { children: "Team Members" }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: handleAddTeamMember, className: "btn-add", children: "+ Add Member" })] }), formData.assignedTeamMembers.map((member, index) => ((0,jsx_runtime.jsx)("div", { className: "team-member-item", children: (0,jsx_runtime.jsxs)("div", { className: "form-row", children: [(0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Member" }), (0,jsx_runtime.jsxs)("select", { value: member.userId, onChange: (e) => handleTeamMemberChange(index, 'userId', e.target.value), className: "form-select", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select team member" }), availableTeamMembers.map(teamMember => ((0,jsx_runtime.jsxs)("option", { value: teamMember.id, children: [teamMember.name, " - ", teamMember.role] }, teamMember.id)))] })] }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Role" }), (0,jsx_runtime.jsxs)("select", { value: member.role, onChange: (e) => handleTeamMemberChange(index, 'role', e.target.value), className: "form-select", children: [(0,jsx_runtime.jsx)("option", { value: "contributor", children: "Contributor" }), (0,jsx_runtime.jsx)("option", { value: "lead", children: "Lead" }), (0,jsx_runtime.jsx)("option", { value: "reviewer", children: "Reviewer" }), (0,jsx_runtime.jsx)("option", { value: "approver", children: "Approver" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Status" }), (0,jsx_runtime.jsxs)("select", { value: member.status, onChange: (e) => handleTeamMemberChange(index, 'status', e.target.value), className: "form-select", children: [(0,jsx_runtime.jsx)("option", { value: "assigned", children: "Assigned" }), (0,jsx_runtime.jsx)("option", { value: "in_progress", children: "In Progress" }), (0,jsx_runtime.jsx)("option", { value: "completed", children: "Completed" }), (0,jsx_runtime.jsx)("option", { value: "blocked", children: "Blocked" })] })] }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: () => handleRemoveTeamMember(index), className: "btn-remove", children: "Remove" })] }) }, index))), formData.assignedTeamMembers.length === 0 && ((0,jsx_runtime.jsxs)("div", { className: "empty-state", children: [(0,jsx_runtime.jsx)("p", { children: "No team members assigned yet." }), (0,jsx_runtime.jsx)("p", { children: "Click \"Add Member\" to assign team members to this task." })] }))] }), (0,jsx_runtime.jsxs)("div", { className: "form-section", children: [(0,jsx_runtime.jsxs)("div", { className: "section-header", children: [(0,jsx_runtime.jsx)("h3", { children: "Subtasks" }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: handleAddSubtask, className: "btn-add", children: "+ Add Subtask" })] }), formData.subtasks.map((subtask, index) => ((0,jsx_runtime.jsxs)("div", { className: `subtask-item ${subtask.status === 'completed' ? 'completed' : ''}`, children: [(0,jsx_runtime.jsx)("div", { className: "subtask-header", children: (0,jsx_runtime.jsxs)("div", { className: "subtask-title-section", children: [(0,jsx_runtime.jsx)("input", { type: "text", value: subtask.title, onChange: (e) => handleSubtaskChange(index, 'title', e.target.value), placeholder: "Enter subtask title", className: "subtask-title-input" }), (0,jsx_runtime.jsxs)("div", { className: "subtask-actions", children: [subtask.status !== 'completed' && ((0,jsx_runtime.jsx)("button", { type: "button", onClick: () => handleCompleteSubtask(index), className: "btn-complete-subtask", title: "Mark as completed", children: (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) })), (0,jsx_runtime.jsx)("button", { type: "button", onClick: () => handleRemoveSubtask(index), className: "btn-remove-small", title: "Remove subtask", children: "\u00D7" })] })] }) }), (0,jsx_runtime.jsx)("textarea", { value: subtask.description, onChange: (e) => handleSubtaskChange(index, 'description', e.target.value), placeholder: "Describe the subtask...", className: "subtask-description-input", rows: 2 }), (0,jsx_runtime.jsxs)("div", { className: "subtask-controls", children: [(0,jsx_runtime.jsxs)("div", { className: "subtask-row", children: [(0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Priority" }), (0,jsx_runtime.jsxs)("select", { value: subtask.priority, onChange: (e) => handleSubtaskChange(index, 'priority', e.target.value), className: "form-select small", children: [(0,jsx_runtime.jsx)("option", { value: "low", children: "Low" }), (0,jsx_runtime.jsx)("option", { value: "medium", children: "Medium" }), (0,jsx_runtime.jsx)("option", { value: "high", children: "High" }), (0,jsx_runtime.jsx)("option", { value: "critical", children: "Critical" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Assigned To" }), (0,jsx_runtime.jsxs)("select", { value: subtask.assignedTo, onChange: (e) => handleAssignMemberToSubtask(index, e.target.value), className: "form-select small", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select member" }), availableTeamMembers.map(teamMember => ((0,jsx_runtime.jsxs)("option", { value: teamMember.id, children: [teamMember.name, " - ", teamMember.role] }, teamMember.id)))] })] }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Due Date" }), (0,jsx_runtime.jsx)("input", { type: "date", value: subtask.dueDate, onChange: (e) => handleSubtaskChange(index, 'dueDate', e.target.value), className: "form-input small" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "subtask-row", children: [(0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Est. Hours" }), (0,jsx_runtime.jsx)("input", { type: "number", value: subtask.estimatedHours || 0, onChange: (e) => handleSubtaskChange(index, 'estimatedHours', parseFloat(e.target.value) || 0), className: "form-input small", min: "0", step: "0.5" })] }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Status" }), (0,jsx_runtime.jsxs)("select", { value: subtask.status, onChange: (e) => handleSubtaskChange(index, 'status', e.target.value), className: "form-select small", children: [(0,jsx_runtime.jsx)("option", { value: "pending", children: "Pending" }), (0,jsx_runtime.jsx)("option", { value: "in_progress", children: "In Progress" }), (0,jsx_runtime.jsx)("option", { value: "completed", children: "Completed" }), (0,jsx_runtime.jsx)("option", { value: "blocked", children: "Blocked" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Notes" }), (0,jsx_runtime.jsx)("input", { type: "text", value: subtask.notes || '', onChange: (e) => handleSubtaskChange(index, 'notes', e.target.value), placeholder: "Add notes...", className: "form-input small" })] })] })] }), subtask.assignedTo && ((0,jsx_runtime.jsx)("div", { className: "subtask-assigned", children: (0,jsx_runtime.jsxs)("span", { className: "assigned-badge", children: ["\uD83D\uDC64 ", availableTeamMembers.find(m => m.id === subtask.assignedTo)?.name || subtask.assignedTo] }) }))] }, index))), formData.subtasks.length === 0 && ((0,jsx_runtime.jsxs)("div", { className: "empty-state", children: [(0,jsx_runtime.jsx)("p", { children: "No subtasks created yet." }), (0,jsx_runtime.jsx)("p", { children: "Click \"Add Subtask\" to break down this task into smaller components." })] }))] }), (0,jsx_runtime.jsxs)("div", { className: "form-section", children: [(0,jsx_runtime.jsx)("h3", { children: "Additional Notes" }), (0,jsx_runtime.jsx)("div", { className: "form-group full-width", children: (0,jsx_runtime.jsx)("textarea", { value: formData.notes, onChange: (e) => handleInputChange('notes', e.target.value), placeholder: "Add any additional notes or requirements...", className: "form-textarea", rows: 3 }) })] }), (0,jsx_runtime.jsxs)("div", { className: "form-actions", children: [(0,jsx_runtime.jsx)("button", { type: "button", onClick: onCancel, className: "btn-secondary", children: "Cancel" }), (0,jsx_runtime.jsx)("button", { type: "submit", className: "btn-primary", children: task ? 'Update Task' : 'Create Task' })] })] })] }) }));
};
/* harmony default export */ const components_CollaborativeTasks_TaskForm = (TaskForm_TaskForm);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/CollaborativeTasks/CollaborativeTasksHub.scss
var CollaborativeTasksHub = __webpack_require__(4698);
;// ./src/components/CollaborativeTasks/CollaborativeTasksHub.scss

      
      
      
      
      
      
      
      
      

var CollaborativeTasksHub_options = {};

CollaborativeTasksHub_options.styleTagTransform = (styleTagTransform_default());
CollaborativeTasksHub_options.setAttributes = (setAttributesWithoutAttributes_default());
CollaborativeTasksHub_options.insert = insertBySelector_default().bind(null, "head");
CollaborativeTasksHub_options.domAPI = (styleDomAPI_default());
CollaborativeTasksHub_options.insertStyleElement = (insertStyleElement_default());

var CollaborativeTasksHub_update = injectStylesIntoStyleTag_default()(CollaborativeTasksHub/* default */.A, CollaborativeTasksHub_options);




       /* harmony default export */ const CollaborativeTasks_CollaborativeTasksHub = (CollaborativeTasksHub/* default */.A && CollaborativeTasksHub/* default */.A.locals ? CollaborativeTasksHub/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/react-hot-toast/dist/index.mjs + 1 modules
var dist = __webpack_require__(888);
;// ./src/components/CollaborativeTasks/CollaborativeTasksHub.tsx







const CollaborativeTasksHub_CollaborativeTasksHub = ({ projectId }) => {
    const [tasks, setTasks] = (0,react.useState)([]);
    const [loading, setLoading] = (0,react.useState)(true);
    const [viewMode, setViewMode] = (0,react.useState)('list');
    const [selectedTask, setSelectedTask] = (0,react.useState)(null);
    const [showTaskForm, setShowTaskForm] = (0,react.useState)(false);
    const [showTaskDetails, setShowTaskDetails] = (0,react.useState)(false);
    const [editingTask, setEditingTask] = (0,react.useState)(null);
    const [filters, setFilters] = (0,react.useState)({
        status: 'all',
        category: 'all'
    });
    const [searchTerm, setSearchTerm] = (0,react.useState)('');
    const [showCompletedTasks, setShowCompletedTasks] = (0,react.useState)(false);
    const [expandedTaskId, setExpandedTaskId] = (0,react.useState)(null);
    const [newComment, setNewComment] = (0,react.useState)('');
    const [users, setUsers] = (0,react.useState)({});
    // Add a helper for status options
    const statusOptions = [
        { value: 'pending', label: 'Not Started' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'overdue', label: 'Overdue' },
    ];
    (0,react.useEffect)(() => {
        if (projectId) {
            loadTasks();
            loadUsers();
        }
    }, [projectId]);
    // Request notification permission on component mount
    (0,react.useEffect)(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);
    const loadUsers = async () => {
        try {
            // Use crewProfiles collection instead of users (single source of truth)
            const crewQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles'), (0,index_esm/* where */._M)('isPublished', '==', true));
            const snapshot = await (0,index_esm/* getDocs */.GG)(crewQuery);
            const usersData = {};
            snapshot.docs.forEach(doc => {
                const crewData = doc.data();
                usersData[doc.id] = {
                    name: crewData.name || crewData.displayName || crewData.email || 'Unknown Crew Member',
                    email: crewData.email || '',
                    avatar: crewData.profileImageUrl || crewData.photoURL || undefined
                };
            });
            setUsers(usersData);
        }
        catch (error) {
            console.error('Error loading users:', error);
        }
    };
    const loadTasks = () => {
        setLoading(true);
        const tasksQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'collaborativeTasks'), (0,index_esm/* where */._M)('projectId', '==', projectId));
        const unsubscribe = (0,index_esm/* onSnapshot */.aQ)(tasksQuery, (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort tasks in memory to handle optional dueDate
            tasksData.sort((a, b) => {
                if (!a.dueDate && !b.dueDate)
                    return 0;
                if (!a.dueDate)
                    return 1;
                if (!b.dueDate)
                    return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            });
            console.log('Loaded tasks:', tasksData);
            setTasks(tasksData);
            setLoading(false);
        }, (error) => {
            console.error('Error loading tasks:', error);
            setLoading(false);
        });
        return unsubscribe;
    };
    const handleCreateTask = async (taskData) => {
        try {
            const currentUser = firebase/* auth */.j2.currentUser;
            if (!currentUser) {
                dist/* toast */.oR.error('You must be logged in to create tasks');
                return;
            }
            const newTask = {
                id: Date.now().toString(),
                projectId,
                title: taskData.title || '',
                description: taskData.description || '',
                status: 'pending',
                priority: taskData.priority || 'medium',
                dueDate: taskData.dueDate || '',
                createdBy: currentUser.uid,
                createdAt: new Date(),
                updatedAt: new Date(),
                assignedTeamMembers: taskData.assignedTeamMembers || [],
                subtasks: taskData.subtasks || [],
                reminders: [],
                tags: taskData.tags || [],
                attachments: [],
                comments: [],
                dependencies: [],
                estimatedHours: taskData.estimatedHours,
                category: taskData.category || 'other',
                location: taskData.location,
                budget: taskData.budget,
                notes: taskData.notes
            };
            // Add to Firestore
            await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'collaborativeTasks'), newTask);
            // Send notifications to assigned team members
            const assignedMemberIds = newTask.assignedTeamMembers
                .filter(member => member.userId)
                .map(member => member.userId);
            if (assignedMemberIds.length > 0) {
                await sendTaskAssignmentNotification(newTask.id, assignedMemberIds);
            }
            setShowTaskForm(false);
            setEditingTask(null);
        }
        catch (error) {
            console.error('Error creating task:', error);
            dist/* toast */.oR.error('Failed to create task. Please try again.');
        }
    };
    const handleUpdateTask = async (taskId, updates) => {
        try {
            const taskRef = (0,index_esm.doc)(firebase.db, 'collaborativeTasks', taskId);
            await (0,index_esm/* updateDoc */.mZ)(taskRef, {
                ...updates,
                updatedAt: new Date()
            });
            setEditingTask(null);
            setShowTaskForm(false);
        }
        catch (error) {
            console.error('Error updating task:', error);
            dist/* toast */.oR.error('Failed to update task. Please try again.');
        }
    };
    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await (0,index_esm/* deleteDoc */.kd)((0,index_esm.doc)(firebase.db, 'collaborativeTasks', taskId));
                setSelectedTask(null);
                setShowTaskDetails(false);
                setExpandedTaskId(null);
            }
            catch (error) {
                console.error('Error deleting task:', error);
                dist/* toast */.oR.error('Failed to delete task. Please try again.');
            }
        }
    };
    const handleCompleteTask = async (taskId) => {
        try {
            const taskRef = (0,index_esm.doc)(firebase.db, 'collaborativeTasks', taskId);
            await (0,index_esm/* updateDoc */.mZ)(taskRef, {
                status: 'completed',
                completedAt: new Date(),
                updatedAt: new Date()
            });
        }
        catch (error) {
            console.error('Error completing task:', error);
            dist/* toast */.oR.error('Failed to complete task. Please try again.');
        }
    };
    const handleStartTask = async (taskId) => {
        try {
            const taskRef = (0,index_esm.doc)(firebase.db, 'collaborativeTasks', taskId);
            await (0,index_esm/* updateDoc */.mZ)(taskRef, {
                status: 'in_progress',
                startedAt: new Date(),
                updatedAt: new Date()
            });
        }
        catch (error) {
            console.error('Error starting task:', error);
            dist/* toast */.oR.error('Failed to start task. Please try again.');
        }
    };
    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowTaskForm(true);
        setShowTaskDetails(false);
        setExpandedTaskId(null);
    };
    const handleRestoreTask = async (taskId) => {
        try {
            const taskRef = (0,index_esm.doc)(firebase.db, 'collaborativeTasks', taskId);
            await (0,index_esm/* updateDoc */.mZ)(taskRef, {
                status: 'pending',
                completedAt: null,
                updatedAt: new Date()
            });
        }
        catch (error) {
            console.error('Error restoring task:', error);
            dist/* toast */.oR.error('Failed to restore task. Please try again.');
        }
    };
    const handleAddComment = async (taskId) => {
        if (!newComment.trim() || !firebase/* auth */.j2.currentUser)
            return;
        try {
            const taskRef = (0,index_esm.doc)(firebase.db, 'collaborativeTasks', taskId);
            const task = tasks.find(t => t.id === taskId);
            if (!task)
                return;
            const comment = {
                id: Date.now().toString(),
                taskId,
                userId: firebase/* auth */.j2.currentUser.uid,
                content: newComment.trim(),
                type: 'comment',
                createdAt: new Date(),
                isEdited: false,
                mentions: []
            };
            const updatedComments = [...(task.comments || []), comment];
            await (0,index_esm/* updateDoc */.mZ)(taskRef, {
                comments: updatedComments,
                updatedAt: new Date()
            });
            setNewComment('');
        }
        catch (error) {
            console.error('Error adding comment:', error);
            dist/* toast */.oR.error('Failed to add comment. Please try again.');
        }
    };
    const toggleTaskExpansion = (taskId) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    };
    const getTaskStats = () => {
        const total = tasks.length;
        const completed = tasks.filter(task => task.status === 'completed').length;
        const inProgress = tasks.filter(task => task.status === 'in_progress').length;
        const overdue = tasks.filter(task => {
            if (task.status === 'completed' || !task.dueDate)
                return false;
            return new Date(task.dueDate) < new Date();
        }).length;
        return { total, completed, inProgress, overdue };
    };
    const getFilteredTasks = () => {
        let filtered = tasks;
        // Filter by status
        if (filters.status !== 'all') {
            filtered = filtered.filter(task => task.status === filters.status);
        }
        // Filter by category
        if (filters.category !== 'all') {
            filtered = filtered.filter(task => task.category === filters.category);
        }
        // Filter by search term
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(task => task.title.toLowerCase().includes(term) ||
                task.description.toLowerCase().includes(term) ||
                task.tags.some(tag => tag.toLowerCase().includes(term)));
        }
        return filtered;
    };
    const filteredTasks = getFilteredTasks();
    const activeTasks = filteredTasks.filter(task => task.status !== 'completed');
    const completedTasks = filteredTasks.filter(task => task.status === 'completed');
    const stats = getTaskStats();
    const getMemberAvatar = (userId) => {
        const user = users[userId];
        if (user?.avatar) {
            return ((0,jsx_runtime.jsx)("img", { src: user.avatar, alt: user.name || 'User', className: "member-avatar" }));
        }
        // Generate colored bubble with initials
        const name = user?.name || userId;
        const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
        const colorIndex = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return ((0,jsx_runtime.jsx)("div", { className: "member-avatar-bubble", style: { backgroundColor: colors[colorIndex] }, children: initials }));
    };
    const getMemberName = (userId) => {
        const user = users[userId];
        return user?.name || userId;
    };
    // Notification system for task assignments
    const sendTaskAssignmentNotification = async (taskId, assignedMembers) => {
        try {
            const currentUser = firebase/* auth */.j2.currentUser;
            if (!currentUser)
                return;
            const task = tasks.find(t => t.id === taskId);
            if (!task)
                return;
            // Create notifications for assigned members
            const notifications = assignedMembers.map(memberId => ({
                id: `${taskId}-${memberId}-${Date.now()}`,
                userId: memberId,
                type: 'task_assignment',
                title: 'New Task Assignment',
                message: `You have been assigned to task: ${task.title}`,
                taskId: taskId,
                projectId: projectId,
                createdAt: new Date(),
                isRead: false,
                priority: 'medium'
            }));
            // Here you would typically save notifications to Firestore
            console.log('Sending task assignment notifications:', notifications);
            // Show browser notifications if permission is granted
            if ('Notification' in window && Notification.permission === 'granted') {
                notifications.forEach(notification => {
                    new Notification(notification.title, {
                        body: notification.message,
                        icon: '/my-icon.png',
                        badge: '/my-icon.png',
                        tag: notification.id,
                        requireInteraction: false,
                        silent: false
                    });
                });
            }
            else if ('Notification' in window && Notification.permission === 'default') {
                // Request permission if not granted
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    notifications.forEach(notification => {
                        new Notification(notification.title, {
                            body: notification.message,
                            icon: '/my-icon.png'
                        });
                    });
                }
            }
        }
        catch (error) {
            console.error('Error sending task assignment notifications:', error);
        }
    };
    const handleStatusChange = async (taskId, newStatus) => {
        await handleUpdateTask(taskId, { status: newStatus });
    };
    if (loading) {
        return ((0,jsx_runtime.jsx)("div", { className: "collaborative-tasks-hub", children: (0,jsx_runtime.jsxs)("div", { className: "loading-state", children: [(0,jsx_runtime.jsx)("div", { className: "loading-spinner" }), (0,jsx_runtime.jsx)("p", { children: "Loading tasks..." })] }) }));
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "collaborative-tasks-hub", children: [(0,jsx_runtime.jsxs)("div", { className: "tasks-header", children: [(0,jsx_runtime.jsxs)("div", { className: "header-content", children: [(0,jsx_runtime.jsxs)("div", { className: "header-left", children: [(0,jsx_runtime.jsx)("h1", { className: "header-title", children: "Collaborative Tasks" }), (0,jsx_runtime.jsx)("p", { className: "header-subtitle", children: "Manage team tasks, deadlines, and reminders" })] }), (0,jsx_runtime.jsx)("div", { className: "header-actions", children: (0,jsx_runtime.jsxs)("button", { onClick: () => {
                                        setEditingTask(null);
                                        setShowTaskForm(true);
                                    }, className: "btn-primary", children: [(0,jsx_runtime.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }), "Create Task"] }) })] }), (0,jsx_runtime.jsxs)("div", { className: "stats-grid", children: [(0,jsx_runtime.jsxs)("div", { className: "stat-card", children: [(0,jsx_runtime.jsx)("div", { className: "stat-icon total", children: (0,jsx_runtime.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }) }), (0,jsx_runtime.jsxs)("div", { className: "stat-content", children: [(0,jsx_runtime.jsx)("p", { className: "stat-label", children: "Total Tasks" }), (0,jsx_runtime.jsx)("p", { className: "stat-value", children: stats.total })] })] }), (0,jsx_runtime.jsxs)("div", { className: "stat-card", children: [(0,jsx_runtime.jsx)("div", { className: "stat-icon completed", children: (0,jsx_runtime.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }), (0,jsx_runtime.jsxs)("div", { className: "stat-content", children: [(0,jsx_runtime.jsx)("p", { className: "stat-label", children: "Completed" }), (0,jsx_runtime.jsx)("p", { className: "stat-value", children: stats.completed })] })] }), (0,jsx_runtime.jsxs)("div", { className: "stat-card", children: [(0,jsx_runtime.jsx)("div", { className: "stat-icon in-progress", children: (0,jsx_runtime.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), (0,jsx_runtime.jsxs)("div", { className: "stat-content", children: [(0,jsx_runtime.jsx)("p", { className: "stat-label", children: "In Progress" }), (0,jsx_runtime.jsx)("p", { className: "stat-value", children: stats.inProgress })] })] }), (0,jsx_runtime.jsxs)("div", { className: "stat-card", children: [(0,jsx_runtime.jsx)("div", { className: "stat-icon overdue", children: (0,jsx_runtime.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), (0,jsx_runtime.jsxs)("div", { className: "stat-content", children: [(0,jsx_runtime.jsx)("p", { className: "stat-label", children: "Overdue" }), (0,jsx_runtime.jsx)("p", { className: "stat-value", children: stats.overdue })] })] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "tasks-controls", children: [(0,jsx_runtime.jsx)("div", { className: "controls-left", children: (0,jsx_runtime.jsxs)("div", { className: "view-mode-selector", children: [(0,jsx_runtime.jsxs)("button", { className: `view-btn ${viewMode === 'list' ? 'active' : ''}`, onClick: () => setViewMode('list'), children: [(0,jsx_runtime.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 10h16M4 14h16M4 18h16" }) }), "List"] }), (0,jsx_runtime.jsxs)("button", { className: `view-btn ${viewMode === 'calendar' ? 'active' : ''}`, onClick: () => setViewMode('calendar'), children: [(0,jsx_runtime.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), "Calendar"] }), (0,jsx_runtime.jsxs)("button", { className: `view-btn ${viewMode === 'kanban' ? 'active' : ''}`, onClick: () => setViewMode('kanban'), children: [(0,jsx_runtime.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2z" }) }), "Kanban"] }), (0,jsx_runtime.jsxs)("button", { className: `view-btn ${viewMode === 'analytics' ? 'active' : ''}`, onClick: () => setViewMode('analytics'), children: [(0,jsx_runtime.jsx)("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }), "Analytics"] })] }) }), (0,jsx_runtime.jsx)("div", { className: "controls-right", children: (0,jsx_runtime.jsxs)("div", { className: "search-container", children: [(0,jsx_runtime.jsxs)("div", { className: "search-box", children: [(0,jsx_runtime.jsx)("svg", { className: "w-5 h-5 search-icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), (0,jsx_runtime.jsx)("input", { type: "text", placeholder: "Search tasks...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "search-input" })] }), (0,jsx_runtime.jsxs)("div", { className: "filters", children: [(0,jsx_runtime.jsxs)("select", { value: filters.status, onChange: (e) => setFilters({ ...filters, status: e.target.value }), className: "filter-select", children: [(0,jsx_runtime.jsx)("option", { value: "all", children: "All Status" }), (0,jsx_runtime.jsx)("option", { value: "pending", children: "Pending" }), (0,jsx_runtime.jsx)("option", { value: "in_progress", children: "In Progress" }), (0,jsx_runtime.jsx)("option", { value: "completed", children: "Completed" }), (0,jsx_runtime.jsx)("option", { value: "cancelled", children: "Cancelled" }), (0,jsx_runtime.jsx)("option", { value: "overdue", children: "Overdue" })] }), (0,jsx_runtime.jsxs)("select", { value: filters.category, onChange: (e) => setFilters({ ...filters, category: e.target.value }), className: "filter-select", children: [(0,jsx_runtime.jsx)("option", { value: "all", children: "All Categories" }), (0,jsx_runtime.jsx)("option", { value: "pre_production", children: "Pre-Production" }), (0,jsx_runtime.jsx)("option", { value: "production", children: "Production" }), (0,jsx_runtime.jsx)("option", { value: "post_production", children: "Post-Production" }), (0,jsx_runtime.jsx)("option", { value: "marketing", children: "Marketing" }), (0,jsx_runtime.jsx)("option", { value: "distribution", children: "Distribution" }), (0,jsx_runtime.jsx)("option", { value: "other", children: "Other" })] })] })] }) })] }), (0,jsx_runtime.jsxs)("div", { className: "tasks-content", children: [viewMode === 'list' && ((0,jsx_runtime.jsx)("div", { className: "tasks-list", children: activeTasks.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "empty-state", children: [(0,jsx_runtime.jsx)("svg", { className: "w-16 h-16 empty-icon", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }), (0,jsx_runtime.jsx)("h3", { className: "empty-title", children: "No tasks found" }), (0,jsx_runtime.jsx)("p", { className: "empty-description", children: "Create your first task to get started" }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                        setEditingTask(null);
                                        setShowTaskForm(true);
                                    }, className: "btn-primary", children: "Create Task" })] })) : ((0,jsx_runtime.jsx)("div", { className: "tasks-grid", children: activeTasks.map(task => ((0,jsx_runtime.jsxs)("div", { className: `task-card ${expandedTaskId === task.id ? 'expanded' : ''}`, children: [(0,jsx_runtime.jsxs)("div", { className: "task-header", onClick: () => toggleTaskExpansion(task.id), children: [(0,jsx_runtime.jsxs)("div", { className: "task-title-section", children: [(0,jsx_runtime.jsx)("h3", { className: "task-title", children: task.title }), (0,jsx_runtime.jsx)("div", { className: "task-members", children: task.assignedTeamMembers && task.assignedTeamMembers.length > 0 ? ((0,jsx_runtime.jsxs)("div", { className: "members-avatars", children: [task.assignedTeamMembers.slice(0, 3).map((member, index) => ((0,jsx_runtime.jsx)("div", { className: "member-avatar-container", title: getMemberName(member.userId), children: getMemberAvatar(member.userId) }, member.userId))), task.assignedTeamMembers.length > 3 && ((0,jsx_runtime.jsxs)("div", { className: "member-count", title: `${task.assignedTeamMembers.length - 3} more members`, children: ["+", task.assignedTeamMembers.length - 3] }))] })) : ((0,jsx_runtime.jsx)("span", { className: "no-members", children: "No members assigned" })) })] }), (0,jsx_runtime.jsxs)("div", { className: "task-actions", children: [(0,jsx_runtime.jsx)("span", { className: `task-status ${task.status}`, children: task.status }), (0,jsx_runtime.jsx)("svg", { className: `expand-icon ${expandedTaskId === task.id ? 'expanded' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] })] }), (0,jsx_runtime.jsxs)("div", { className: "task-preview", children: [(0,jsx_runtime.jsx)("p", { className: "task-description", children: task.description }), (0,jsx_runtime.jsxs)("div", { className: "task-meta", children: [(0,jsx_runtime.jsxs)("span", { className: "task-due-date", children: ["Due: ", task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'] }), task.subtasks && task.subtasks.length > 0 && ((0,jsx_runtime.jsxs)("span", { className: "subtasks-count", children: [task.subtasks.length, " subtasks"] }))] }), (0,jsx_runtime.jsxs)("div", { className: "task-quick-actions", children: [(0,jsx_runtime.jsx)("select", { value: task.status, onChange: e => handleStatusChange(task.id, e.target.value), className: `task-status-dropdown status-${task.status}`, disabled: task.status === 'completed', title: "Change task status", style: { minWidth: 120, borderRadius: 6, padding: '0.25rem 0.5rem', fontWeight: 500 }, children: statusOptions.map(opt => ((0,jsx_runtime.jsx)("option", { value: opt.value, children: opt.label }, opt.value))) }), task.status === 'completed' && ((0,jsx_runtime.jsx)("span", { className: "task-status-badge completed", style: { marginLeft: 8, color: '#10b981', fontWeight: 600 }, children: "\u2714 Completed" })), (0,jsx_runtime.jsx)("button", { onClick: (e) => {
                                                            e.stopPropagation();
                                                            handleEditTask(task);
                                                        }, className: "btn-quick-action btn-edit", title: "Edit Task", children: "\u270F\uFE0F Edit" })] })] }), expandedTaskId === task.id && ((0,jsx_runtime.jsxs)("div", { className: "task-expanded-details", children: [(0,jsx_runtime.jsxs)("div", { className: "task-details-section", children: [(0,jsx_runtime.jsxs)("div", { className: "task-info-grid", children: [(0,jsx_runtime.jsxs)("div", { className: "info-item", children: [(0,jsx_runtime.jsx)("span", { className: "info-label", children: "Priority:" }), (0,jsx_runtime.jsx)("span", { className: `info-value priority ${task.priority}`, children: task.priority })] }), (0,jsx_runtime.jsxs)("div", { className: "info-item", children: [(0,jsx_runtime.jsx)("span", { className: "info-label", children: "Category:" }), (0,jsx_runtime.jsx)("span", { className: "info-value", children: task.category })] }), task.estimatedHours && ((0,jsx_runtime.jsxs)("div", { className: "info-item", children: [(0,jsx_runtime.jsx)("span", { className: "info-label", children: "Estimated Hours:" }), (0,jsx_runtime.jsxs)("span", { className: "info-value", children: [task.estimatedHours, "h"] })] })), task.location && ((0,jsx_runtime.jsxs)("div", { className: "info-item", children: [(0,jsx_runtime.jsx)("span", { className: "info-label", children: "Location:" }), (0,jsx_runtime.jsx)("span", { className: "info-value", children: task.location })] }))] }), task.notes && ((0,jsx_runtime.jsxs)("div", { className: "task-notes", children: [(0,jsx_runtime.jsx)("h4", { children: "Notes" }), (0,jsx_runtime.jsx)("p", { children: task.notes })] })), task.tags && task.tags.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "task-tags", children: [(0,jsx_runtime.jsx)("h4", { children: "Tags" }), (0,jsx_runtime.jsx)("div", { className: "tags-list", children: task.tags.map((tag, index) => ((0,jsx_runtime.jsx)("span", { className: "tag", children: tag }, index))) })] })), task.assignedTeamMembers && task.assignedTeamMembers.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "task-team", children: [(0,jsx_runtime.jsx)("h4", { children: "Team Members" }), (0,jsx_runtime.jsx)("div", { className: "team-members-list", children: task.assignedTeamMembers.map((member, index) => ((0,jsx_runtime.jsxs)("div", { className: "team-member-item", children: [(0,jsx_runtime.jsxs)("div", { className: "member-info", children: [getMemberAvatar(member.userId), (0,jsx_runtime.jsxs)("div", { className: "member-details", children: [(0,jsx_runtime.jsx)("span", { className: "member-name", children: getMemberName(member.userId) }), (0,jsx_runtime.jsx)("span", { className: "member-role", children: member.role })] })] }), member.notes && (0,jsx_runtime.jsx)("span", { className: "member-notes", children: member.notes })] }, member.userId))) })] })), task.subtasks && task.subtasks.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "task-subtasks", children: [(0,jsx_runtime.jsxs)("h4", { children: ["Subtasks (", task.subtasks.filter(st => st.status === 'completed').length, "/", task.subtasks.length, " completed)"] }), (0,jsx_runtime.jsx)("div", { className: "subtasks-list", children: task.subtasks.map((subtask, index) => ((0,jsx_runtime.jsxs)("div", { className: "subtask-item", children: [(0,jsx_runtime.jsxs)("div", { className: "subtask-header", children: [(0,jsx_runtime.jsx)("h5", { children: subtask.title }), (0,jsx_runtime.jsx)("span", { className: `subtask-status ${subtask.status}`, children: subtask.status })] }), (0,jsx_runtime.jsx)("p", { className: "subtask-description", children: subtask.description }), (0,jsx_runtime.jsxs)("div", { className: "subtask-meta", children: [(0,jsx_runtime.jsxs)("span", { className: "subtask-due", children: ["Due: ", subtask.dueDate ? new Date(subtask.dueDate).toLocaleDateString() : 'No due date'] }), subtask.estimatedHours && ((0,jsx_runtime.jsxs)("span", { className: "subtask-hours", children: [subtask.estimatedHours, "h"] }))] })] }, subtask.id))) })] }))] }), (0,jsx_runtime.jsxs)("div", { className: "task-comments-section", children: [(0,jsx_runtime.jsx)("h4", { children: "Comments" }), (0,jsx_runtime.jsx)("div", { className: "comments-list", children: task.comments && task.comments.length > 0 ? (task.comments.map((comment, index) => ((0,jsx_runtime.jsxs)("div", { className: "comment-item", children: [(0,jsx_runtime.jsxs)("div", { className: "comment-header", children: [(0,jsx_runtime.jsxs)("div", { className: "comment-author", children: [getMemberAvatar(comment.userId), (0,jsx_runtime.jsx)("span", { className: "author-name", children: getMemberName(comment.userId) })] }), (0,jsx_runtime.jsx)("span", { className: "comment-date", children: new Date(comment.createdAt).toLocaleString() })] }), (0,jsx_runtime.jsx)("p", { className: "comment-content", children: comment.content })] }, comment.id)))) : ((0,jsx_runtime.jsx)("p", { className: "no-comments", children: "No comments yet. Be the first to add one!" })) }), (0,jsx_runtime.jsxs)("div", { className: "add-comment", children: [(0,jsx_runtime.jsx)("textarea", { placeholder: "Add a comment...", value: newComment, onChange: (e) => setNewComment(e.target.value), className: "comment-input", rows: 3 }), (0,jsx_runtime.jsx)("div", { className: "comment-actions", children: (0,jsx_runtime.jsx)("button", { onClick: () => handleAddComment(task.id), disabled: !newComment.trim(), className: "btn-primary", children: "Add Comment" }) })] })] }), (0,jsx_runtime.jsxs)("div", { className: "task-expanded-actions", children: [(0,jsx_runtime.jsx)("select", { value: task.status, onChange: e => handleStatusChange(task.id, e.target.value), className: `task-status-dropdown status-${task.status}`, disabled: task.status === 'completed', title: "Change task status", style: { minWidth: 120, borderRadius: 6, padding: '0.25rem 0.5rem', fontWeight: 500 }, children: statusOptions.map(opt => ((0,jsx_runtime.jsx)("option", { value: opt.value, children: opt.label }, opt.value))) }), task.status === 'completed' && ((0,jsx_runtime.jsx)("span", { className: "task-status-badge completed", style: { marginLeft: 8, color: '#10b981', fontWeight: 600 }, children: "\u2714 Completed" })), (0,jsx_runtime.jsx)("button", { onClick: () => handleEditTask(task), className: "btn-secondary", children: "Edit Task" }), (0,jsx_runtime.jsx)("button", { onClick: () => handleDeleteTask(task.id), className: "btn-danger", children: "Delete Task" })] })] }))] }, task.id))) })) })), viewMode === 'calendar' && ((0,jsx_runtime.jsx)("div", { className: "calendar-view", children: (0,jsx_runtime.jsx)("p", { children: "Calendar view coming soon..." }) })), viewMode === 'kanban' && ((0,jsx_runtime.jsx)("div", { className: "kanban-board", children: (0,jsx_runtime.jsx)("p", { children: "Kanban view coming soon..." }) })), viewMode === 'analytics' && ((0,jsx_runtime.jsx)("div", { className: "analytics-view", children: (0,jsx_runtime.jsx)("p", { children: "Analytics view coming soon..." }) }))] }), showTaskForm && ((0,jsx_runtime.jsx)("div", { className: "modal-overlay", children: (0,jsx_runtime.jsxs)("div", { className: "modal-content", children: [(0,jsx_runtime.jsxs)("div", { className: "modal-header", children: [(0,jsx_runtime.jsx)("h2", { children: editingTask ? 'Edit Task' : 'Create New Task' }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                        setShowTaskForm(false);
                                        setEditingTask(null);
                                    }, className: "modal-close", children: (0,jsx_runtime.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), (0,jsx_runtime.jsx)("div", { className: "modal-body", children: (0,jsx_runtime.jsx)(components_CollaborativeTasks_TaskForm, { task: editingTask || undefined, onSubmit: editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask, onCancel: () => {
                                    setShowTaskForm(false);
                                    setEditingTask(null);
                                }, projectId: projectId }) })] }) })), completedTasks.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "completed-tasks-section", children: [(0,jsx_runtime.jsxs)("div", { className: "section-header", children: [(0,jsx_runtime.jsxs)("h3", { children: ["Completed Tasks (", completedTasks.length, ")"] }), (0,jsx_runtime.jsxs)("button", { onClick: () => setShowCompletedTasks(!showCompletedTasks), className: "btn-toggle", children: [showCompletedTasks ? 'Hide' : 'Show', " Completed"] })] }), showCompletedTasks && ((0,jsx_runtime.jsx)("div", { className: "completed-tasks-grid", children: completedTasks.map(task => ((0,jsx_runtime.jsxs)("div", { className: "task-card completed", children: [(0,jsx_runtime.jsxs)("div", { className: "task-header", children: [(0,jsx_runtime.jsx)("h3", { className: "task-title completed", children: task.title }), (0,jsx_runtime.jsxs)("div", { className: "task-actions", children: [(0,jsx_runtime.jsx)("button", { onClick: () => handleRestoreTask(task.id), className: "action-btn restore", title: "Restore Task", children: (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }) }), (0,jsx_runtime.jsx)("button", { onClick: () => handleDeleteTask(task.id), className: "action-btn delete", title: "Delete Task", children: (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) })] })] }), (0,jsx_runtime.jsx)("p", { className: "task-description completed", children: task.description }), (0,jsx_runtime.jsxs)("div", { className: "task-meta", children: [(0,jsx_runtime.jsxs)("span", { className: "task-completed-date", children: ["Completed: ", task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Unknown'] }), (0,jsx_runtime.jsx)("span", { className: "task-status completed", children: "Completed" })] })] }, task.id))) }))] }))] }));
};
/* harmony default export */ const components_CollaborativeTasks_CollaborativeTasksHub = (CollaborativeTasksHub_CollaborativeTasksHub);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Collaboration/CollaborationHub.scss
var CollaborationHub = __webpack_require__(4318);
;// ./src/components/Collaboration/CollaborationHub.scss

      
      
      
      
      
      
      
      
      

var CollaborationHub_options = {};

CollaborationHub_options.styleTagTransform = (styleTagTransform_default());
CollaborationHub_options.setAttributes = (setAttributesWithoutAttributes_default());
CollaborationHub_options.insert = insertBySelector_default().bind(null, "head");
CollaborationHub_options.domAPI = (styleDomAPI_default());
CollaborationHub_options.insertStyleElement = (insertStyleElement_default());

var CollaborationHub_update = injectStylesIntoStyleTag_default()(CollaborationHub/* default */.A, CollaborationHub_options);




       /* harmony default export */ const Collaboration_CollaborationHub = (CollaborationHub/* default */.A && CollaborationHub/* default */.A.locals ? CollaborationHub/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/lodash/debounce.js
var debounce = __webpack_require__(8221);
var debounce_default = /*#__PURE__*/__webpack_require__.n(debounce);
;// ./src/components/Collaboration/UserAutocomplete.tsx



const UserAutocomplete = ({ value, onChange, onSearch, options, loading = false, placeholder = 'Search users...' }) => {
    const [inputValue, setInputValue] = (0,react.useState)('');
    const [showDropdown, setShowDropdown] = (0,react.useState)(false);
    const [highlightedIndex, setHighlightedIndex] = (0,react.useState)(-1);
    const inputRef = (0,react.useRef)(null);
    const dropdownRef = (0,react.useRef)(null);
    const [showSearching, setShowSearching] = (0,react.useState)(false);
    (0,react.useEffect)(() => {
        // Debounce search to avoid jitter
        const debouncedSearch = debounce_default()((val) => {
            if (val.trim()) {
                onSearch(val);
            }
        }, 250);
        debouncedSearch(inputValue);
        return () => debouncedSearch.cancel();
    }, [inputValue, onSearch]);
    (0,react.useEffect)(() => {
        if (showDropdown && options.length > 0) {
            setHighlightedIndex(0);
        }
        else {
            setHighlightedIndex(-1);
        }
    }, [showDropdown, options]);
    (0,react.useEffect)(() => {
        let timer;
        if (loading && inputValue.trim()) {
            timer = setTimeout(() => setShowSearching(true), 300);
        }
        else {
            setShowSearching(false);
        }
        return () => clearTimeout(timer);
    }, [loading, inputValue]);
    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (!showDropdown)
            return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev + 1) % options.length);
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < options.length) {
                handleSelect(options[highlightedIndex]);
            }
        }
        else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    };
    // Click outside to close dropdown
    (0,react.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setShowDropdown(true);
    };
    // In handleSelect, do not clear inputValue or close the dropdown. Only update selected users and keep input focused.
    const handleSelect = (user) => {
        if (!value.find((u) => u.id === user.id)) {
            onChange([...value, user]);
        }
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setShowDropdown(true);
    };
    const handleRemove = (userId) => {
        onChange(value.filter((u) => u.id !== userId));
    };
    return ((0,jsx_runtime.jsxs)("div", { className: "user-autocomplete", style: { position: 'relative' }, children: [(0,jsx_runtime.jsx)("div", { className: "selected-users", style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem', maxHeight: 64, overflowY: 'auto' }, children: value.map((user) => ((0,jsx_runtime.jsxs)("span", { className: "user-chip-modern", style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#f3f6fa',
                        borderRadius: '999px',
                        padding: '0.25rem 0.75rem 0.25rem 0.5rem',
                        margin: '0 0.25rem 0.25rem 0',
                        fontSize: '0.95em',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        border: '1px solid #e0e6ed',
                    }, children: [user.avatar && ((0,jsx_runtime.jsx)("img", { src: user.avatar, alt: user.name, style: { width: 22, height: 22, borderRadius: '50%', marginRight: 6 } })), (0,jsx_runtime.jsx)("span", { style: { fontWeight: 500, color: '#222' }, children: user.name }), (0,jsx_runtime.jsx)("button", { onClick: () => handleRemove(user.id), style: {
                                background: 'none',
                                border: 'none',
                                color: '#888',
                                marginLeft: 8,
                                fontSize: '1.1em',
                                cursor: 'pointer',
                                lineHeight: 1,
                                padding: 0,
                            }, "aria-label": `Remove ${user.name}`, children: "\u00D7" })] }, user.id))) }), (0,jsx_runtime.jsxs)("div", { style: { position: 'relative', width: '100%' }, children: [(0,jsx_runtime.jsx)("input", { ref: inputRef, className: "form-input user-autocomplete-input", value: inputValue, onChange: handleInputChange, onFocus: () => setShowDropdown(true), placeholder: placeholder, style: {
                            minWidth: 220,
                            maxWidth: 340,
                            border: '1.5px solid #d0d7e2',
                            borderRadius: 8,
                            padding: '0.5rem 0.75rem',
                            fontSize: '1em',
                            background: '#fff',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        } }), showDropdown && ((0,jsx_runtime.jsx)("div", { className: "autocomplete-dropdown-modern", style: {
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            zIndex: 10,
                            background: '#fff',
                            border: '1.5px solid #d0d7e2',
                            borderRadius: 8,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            marginTop: 4,
                            minWidth: 220,
                            maxWidth: 340,
                            maxHeight: 220,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        }, children: loading && options.length === 0 ? ((0,jsx_runtime.jsx)("div", { className: "autocomplete-loading", style: { padding: '1rem', textAlign: 'center', color: '#888' }, children: "Searching..." })) : options.length === 0 && inputValue.trim() ? ((0,jsx_runtime.jsx)("div", { className: "autocomplete-no-results", style: { padding: '1rem', textAlign: 'center', color: '#888' }, children: "No results found" })) : (options.map((user, idx) => ((0,jsx_runtime.jsxs)("div", { className: `autocomplete-option-modern${highlightedIndex === idx ? ' highlighted' : ''}`, style: {
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                                background: highlightedIndex === idx ? '#f0f6ff' : '#fff',
                                fontWeight: 500,
                                color: '#222',
                                borderBottom: idx !== options.length - 1 ? '1px solid #f3f6fa' : 'none',
                            }, onMouseDown: () => handleSelect(user), onMouseEnter: () => setHighlightedIndex(idx), children: [user.avatar && ((0,jsx_runtime.jsx)("img", { src: user.avatar, alt: user.name, style: { width: 22, height: 22, borderRadius: '50%', marginRight: 10 } })), (0,jsx_runtime.jsxs)("div", { style: { flex: 1 }, children: [(0,jsx_runtime.jsx)("div", { style: { fontWeight: 500 }, children: user.name }), (0,jsx_runtime.jsx)("div", { style: { fontSize: '0.85em', color: '#888' }, children: user.email }), user.role && (0,jsx_runtime.jsx)("div", { style: { fontSize: '0.8em', color: '#059669' }, children: user.role })] })] }, user.id)))) }))] })] }));
};
/* harmony default export */ const Collaboration_UserAutocomplete = (UserAutocomplete);

// EXTERNAL MODULE: ./node_modules/firebase/storage/dist/esm/index.esm.js + 1 modules
var esm_index_esm = __webpack_require__(2539);
// EXTERNAL MODULE: ./node_modules/react-pdf/dist/esm/entry.js + 44 modules
var entry = __webpack_require__(6372);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Collaboration/ScreenplayViewer.scss
var ScreenplayViewer = __webpack_require__(8758);
;// ./src/components/Collaboration/ScreenplayViewer.scss

      
      
      
      
      
      
      
      
      

var ScreenplayViewer_options = {};

ScreenplayViewer_options.styleTagTransform = (styleTagTransform_default());
ScreenplayViewer_options.setAttributes = (setAttributesWithoutAttributes_default());
ScreenplayViewer_options.insert = insertBySelector_default().bind(null, "head");
ScreenplayViewer_options.domAPI = (styleDomAPI_default());
ScreenplayViewer_options.insertStyleElement = (insertStyleElement_default());

var ScreenplayViewer_update = injectStylesIntoStyleTag_default()(ScreenplayViewer/* default */.A, ScreenplayViewer_options);




       /* harmony default export */ const Collaboration_ScreenplayViewer = (ScreenplayViewer/* default */.A && ScreenplayViewer/* default */.A.locals ? ScreenplayViewer/* default */.A.locals : undefined);

;// ./src/components/Collaboration/ScreenplayViewer.tsx








entry/* pdfjs.GlobalWorkerOptions */.Uy.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${entry/* pdfjs.version */.Uy.version}/pdf.worker.min.js`;
// Helper to convert Firestore timestamp or Date to JS Date
const toDate = (ts) => {
    if (!ts)
        return new Date();
    if (ts instanceof Date)
        return ts;
    if (typeof ts === 'object' && ts.seconds)
        return new Date(ts.seconds * 1000);
    return new Date(ts);
};
// Helper to get mouse position relative to PDF page
function getRelativePosition(e, pageDiv, scale) {
    const rect = pageDiv.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
}
const ScreenplayViewer_ScreenplayViewer = ({ screenplay, projectId, onClose, onGenerateReport }) => {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [annotations, setAnnotations] = (0,react.useState)([]);
    const [tags, setTags] = (0,react.useState)([]);
    const [newAnnotation, setNewAnnotation] = (0,react.useState)('');
    const [newTag, setNewTag] = (0,react.useState)('');
    const [selectedTagType, setSelectedTagType] = (0,react.useState)('character');
    const [numPages, setNumPages] = (0,react.useState)(null);
    const [loading, setLoading] = (0,react.useState)(true);
    const [error, setError] = (0,react.useState)(null);
    const [scale, setScale] = (0,react.useState)(1.2);
    const [showOverlays, setShowOverlays] = (0,react.useState)(true);
    const [selectedElement, setSelectedElement] = (0,react.useState)(null);
    const [mousePosition, setMousePosition] = (0,react.useState)({ x: 0, y: 0 });
    const [session, setSession] = (0,react.useState)(null);
    const [activeUsers, setActiveUsers] = (0,react.useState)([]);
    const [viewMode, setViewMode] = (0,react.useState)('single');
    const [filterType, setFilterType] = (0,react.useState)('all');
    const [searchQuery, setSearchQuery] = (0,react.useState)('');
    const [sortBy, setSortBy] = (0,react.useState)('time');
    const [showUserCursors, setShowUserCursors] = (0,react.useState)(true);
    const [autoSync, setAutoSync] = (0,react.useState)(true);
    const [annotationInput, setAnnotationInput] = (0,react.useState)('');
    const [activeThread, setActiveThread] = (0,react.useState)(null);
    const [showAnnotationSidebar, setShowAnnotationSidebar] = (0,react.useState)(false);
    const [activeAnnotation, setActiveAnnotation] = (0,react.useState)(null);
    const [newReply, setNewReply] = (0,react.useState)('');
    const [showAnnotationPanel, setShowAnnotationPanel] = (0,react.useState)(false);
    const [panelX, setPanelX] = (0,react.useState)(0);
    const [panelY, setPanelY] = (0,react.useState)(0);
    const [drawingPage, setDrawingPage] = (0,react.useState)(null);
    const [selectionRect, setSelectionRect] = (0,react.useState)(null);
    const [selectedText, setSelectedText] = (0,react.useState)('');
    const [selectionPage, setSelectionPage] = (0,react.useState)(null);
    const [showSelectionPopup, setShowSelectionPopup] = (0,react.useState)(false);
    const [popupType, setPopupType] = (0,react.useState)(null);
    const [currentPage, setCurrentPage] = (0,react.useState)(1);
    const [popupPosition, setPopupPosition] = (0,react.useState)({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = (0,react.useState)(false);
    const [dragOffset, setDragOffset] = (0,react.useState)({ x: 0, y: 0 });
    const [isNavigating, setIsNavigating] = (0,react.useState)(false);
    const [sidebarCollapsed, setSidebarCollapsed] = (0,react.useState)(false);
    const [replyingTo, setReplyingTo] = (0,react.useState)(null);
    const [replyInput, setReplyInput] = (0,react.useState)('');
    const [userPresence, setUserPresence] = (0,react.useState)({});
    const [previousActiveUsers, setPreviousActiveUsers] = (0,react.useState)([]);
    const [showAddCollaboratorModal, setShowAddCollaboratorModal] = (0,react.useState)(false);
    const [collaboratorSearch, setCollaboratorSearch] = (0,react.useState)('');
    const [collaboratorResults, setCollaboratorResults] = (0,react.useState)([]);
    const [addingCollaborator, setAddingCollaborator] = (0,react.useState)(false);
    const [collaborators, setCollaborators] = (0,react.useState)([]);
    const [userFollows, setUserFollows] = (0,react.useState)([]);
    const [approvedContacts, setApprovedContacts] = (0,react.useState)([]);
    const viewerRef = (0,react.useRef)(null);
    const pdfContainerRef = (0,react.useRef)(null);
    const drawingCanvasRef = (0,react.useRef)(null);
    const popupRef = (0,react.useRef)(null);
    const pdfScrollRef = (0,react.useRef)(null);
    // Add state for virtualization
    const [visiblePageRange, setVisiblePageRange] = (0,react.useState)([1, 10]);
    // Focus trap for modal
    const modalRef = (0,react.useRef)(null);
    const [searchLoading, setSearchLoading] = (0,react.useState)(false);
    if (!screenplay || !screenplay.id)
        return null;
    // Prevent body scrolling when modal is open
    (0,react.useEffect)(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);
    // Reply functionality
    const handleAddReply = async (annotationId, replyContent) => {
        if (!currentUser || !replyContent.trim())
            return;
        try {
            const reply = {
                id: Date.now().toString(),
                userId: currentUser.uid,
                userName: currentUser.displayName || 'Anonymous',
                userAvatar: currentUser?.photoURL || undefined,
                content: replyContent.trim(),
                timestamp: new Date()
            };
            // Update local state immediately for instant feedback
            setAnnotations(prev => {
                const updatedAnnotations = prev.map(a => a.id === annotationId
                    ? { ...a, replies: [...(a.replies || []), reply] }
                    : a);
                // Update Firestore with the updated annotation data
                const updatedAnnotation = updatedAnnotations.find(a => a.id === annotationId);
                if (updatedAnnotation) {
                    const annotationRef = (0,index_esm.doc)(firebase.db, 'screenplayAnnotations', annotationId);
                    // Deep sanitize replies
                    const safeReplies = Array.isArray(updatedAnnotation.replies)
                        ? updatedAnnotation.replies
                            .filter(r => r && typeof r === 'object' && r.id && r.userId && r.userName && r.content && r.timestamp)
                            .map(r => {
                            // Remove undefined properties and set userAvatar to null if missing
                            const { id, userId, userName, content, timestamp } = r;
                            return {
                                id,
                                userId,
                                userName,
                                content,
                                timestamp,
                                userAvatar: r.userAvatar || null
                            };
                        })
                        : [];
                    (0,index_esm/* updateDoc */.mZ)(annotationRef, { replies: safeReplies })
                        .then(() => {
                        console.log('[DEBUG] Reply saved to Firestore successfully');
                    })
                        .catch((error) => {
                        console.error('[DEBUG] Error saving reply to Firestore:', error);
                        dist/* toast */.oR.error('Failed to save reply to server');
                    });
                }
                return updatedAnnotations;
            });
            dist/* toast */.oR.success('Reply added successfully!');
            setNewReply(''); // Clear input after successful reply
            setReplyInput('');
            setReplyingTo(null);
        }
        catch (error) {
            console.error('Error adding reply:', error);
            dist/* toast */.oR.error('Failed to add reply');
        }
    };
    const handleRemoveTag = async (annotationId, replyId) => {
        try {
            const annotation = annotations.find(a => a.id === annotationId);
            if (annotation) {
                const updatedReplies = annotation.replies?.filter(r => r.id !== replyId) || [];
                const annotationRef = (0,index_esm.doc)(firebase.db, 'screenplayAnnotations', annotationId);
                await (0,index_esm/* updateDoc */.mZ)(annotationRef, { replies: updatedReplies });
                // Update local state
                setAnnotations(prev => prev.map(a => a.id === annotationId
                    ? { ...a, replies: updatedReplies }
                    : a));
                dist/* toast */.oR.success('Reply removed successfully!');
            }
        }
        catch (error) {
            console.error('Error removing reply:', error);
            dist/* toast */.oR.error('Failed to remove reply');
        }
    };
    const tagColors = {
        // Character related
        character: '#FF6B6B',
        character_arc: '#FF8E8E',
        character_development: '#FFB3B3',
        // Location related
        location: '#4ECDC4',
        set_design: '#6ED7D0',
        location_detail: '#8EE1DB',
        // Props and objects
        prop: '#45B7D1',
        costume: '#5FC1D8',
        makeup: '#79CBDF',
        // Scene related
        scene: '#96CEB4',
        scene_transition: '#A8D8C0',
        scene_beat: '#BAE2CC',
        // Technical
        camera: '#FFD93D',
        lighting: '#FFE066',
        sound: '#FFE680',
        // Story elements
        plot_point: '#A8E6CF',
        subplot: '#B8EBD9',
        theme: '#C8F0E3',
        // Production
        budget: '#FF9F43',
        schedule: '#FFB366',
        logistics: '#FFC789',
        // Notes and general
        note: '#FFEAA7',
        revision: '#FDCB6E',
        research: '#F39C12'
    };
    const priorityColors = {
        low: '#10B981',
        medium: '#F59E0B',
        high: '#EF4444',
        critical: '#7C3AED'
    };
    // Smart popup positioning function
    const calculatePopupPosition = (0,react.useCallback)((rect, popupWidth = 280, popupHeight = 120) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        // Start with the selection position
        let x = rect.left;
        let y = rect.bottom + 8;
        // Ensure popup doesn't go off-screen horizontally
        if (x + popupWidth > viewportWidth - 16) {
            x = Math.max(16, viewportWidth - popupWidth - 16);
        }
        // Ensure popup doesn't go off-screen vertically
        if (y + popupHeight > viewportHeight - 16) {
            y = Math.max(16, rect.top - popupHeight - 8);
        }
        // Ensure popup doesn't go off the left edge
        if (x < 16) {
            x = 16;
        }
        return { x, y };
    }, []);
    // Navigate to specific annotation/tag location
    const navigateToElement = (element) => {
        setIsNavigating(true);
        setCurrentPage(element.pageNumber);
        setSelectedElement(element.id);
        // Scroll to the element's position
        setTimeout(() => {
            const elementOverlay = document.querySelector(`[data-element-id="${element.id}"]`);
            if (elementOverlay) {
                elementOverlay.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
                // Highlight the element briefly
                elementOverlay.style.animation = 'pulse 1s ease-in-out';
                setTimeout(() => {
                    elementOverlay.style.animation = '';
                    setIsNavigating(false);
                }, 1000);
            }
            else {
                setIsNavigating(false);
            }
        }, 100);
    };
    // Handle popup dragging
    const handlePopupMouseDown = (e) => {
        if (!popupRef.current)
            return;
        const rect = popupRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setIsDragging(true);
    };
    const handlePopupMouseMove = (e) => {
        if (!isDragging)
            return;
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        // Keep popup within viewport bounds
        const maxX = window.innerWidth - (popupRef.current?.offsetWidth || 320);
        const maxY = window.innerHeight - (popupRef.current?.offsetHeight || 200);
        setPopupPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        });
    };
    const handlePopupMouseUp = () => {
        setIsDragging(false);
    };
    // Handle PDF scroll events to prevent background scrolling
    const handlePdfScroll = (e) => {
        // Allow the scroll to work normally, just prevent it from bubbling up
        e.stopPropagation();
    };
    // Handle PDF wheel events to prevent background scrolling
    const handlePdfWheel = (e) => {
        // Allow the wheel scroll to work normally, just prevent it from bubbling up
        e.stopPropagation();
    };
    // Initialize collaboration session
    (0,react.useEffect)(() => {
        console.log('[DEBUG] ScreenplayViewer mounted with screenplay:', screenplay);
        if (!screenplay.url || typeof screenplay.url !== 'string' || screenplay.url.trim() === '') {
            setError('No PDF URL found for this screenplay.');
            setLoading(false);
        }
        initializeSession();
        loadAnnotations();
        loadTags();
        startRealTimeSync();
    }, [screenplay.id]);
    const initializeSession = async () => {
        try {
            const sessionData = {
                screenplayId: screenplay.id,
                projectId: projectId,
                participants: [currentUser?.uid || ''],
                activeUsers: [{
                        userId: currentUser?.uid || '',
                        userName: currentUser?.displayName || 'Anonymous',
                        userAvatar: currentUser?.photoURL || '',
                        lastSeen: new Date(),
                        currentPage: 1
                    }],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const sessionRef = await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'screenplaySessions'), sessionData);
            setSession({ id: sessionRef.id, ...sessionData });
        }
        catch (error) {
            console.error('Error initializing session:', error);
        }
    };
    const updateUserPresence = async () => {
        if (!session || !currentUser)
            return;
        try {
            const userPresenceData = {
                userId: currentUser.uid,
                userName: currentUser.displayName || 'Anonymous',
                userAvatar: currentUser.photoURL || '',
                lastSeen: new Date(),
                currentPage: 1, // This would be updated based on actual page
                isOnline: true
            };
            // Update session with current user's presence
            const sessionRef = (0,index_esm.doc)(firebase.db, 'screenplaySessions', session.id);
            await (0,index_esm/* updateDoc */.mZ)(sessionRef, {
                activeUsers: (0,index_esm/* arrayUnion */.hq)(userPresenceData),
                updatedAt: new Date()
            });
            // Update local state
            setActiveUsers(prev => {
                const existingUser = prev.find(u => u.userId === currentUser.uid);
                if (existingUser) {
                    return prev.map(u => u.userId === currentUser.uid ? userPresenceData : u);
                }
                else {
                    return [...prev, userPresenceData];
                }
            });
        }
        catch (error) {
            console.error('Error updating user presence:', error);
        }
    };
    const removeUserPresence = async () => {
        if (!session || !currentUser)
            return;
        try {
            const sessionRef = (0,index_esm.doc)(firebase.db, 'screenplaySessions', session.id);
            await (0,index_esm/* updateDoc */.mZ)(sessionRef, {
                activeUsers: (0,index_esm/* arrayRemove */.C3)({
                    userId: currentUser.uid,
                    userName: currentUser.displayName || 'Anonymous',
                    userAvatar: currentUser.photoURL || '',
                    lastSeen: new Date(),
                    currentPage: 1,
                    isOnline: false
                }),
                updatedAt: new Date()
            });
        }
        catch (error) {
            console.error('Error removing user presence:', error);
        }
    };
    const startRealTimeSync = () => {
        // Real-time annotations sync
        const annotationsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'screenplayAnnotations'), (0,index_esm/* where */._M)('screenplayId', '==', screenplay.id), (0,index_esm/* orderBy */.My)('timestamp', 'desc'));
        const annotationsUnsubscribe = (0,index_esm/* onSnapshot */.aQ)(annotationsQuery, (snapshot) => {
            const annotationsData = snapshot.docs.map(doc => {
                const data = doc.data();
                const processedReplies = Array.isArray(data.replies)
                    ? data.replies.map((reply) => ({
                        ...reply,
                        timestamp: toDate(reply.timestamp)
                    }))
                    : [];
                console.log(`[DEBUG] Annotation ${doc.id} has ${processedReplies.length} replies:`, processedReplies);
                return {
                    id: doc.id,
                    ...data,
                    timestamp: toDate(data.timestamp),
                    replies: processedReplies
                };
            });
            setAnnotations(annotationsData);
        });
        // Real-time tags sync
        const tagsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'screenplayTags'), (0,index_esm/* where */._M)('screenplayId', '==', screenplay.id), (0,index_esm/* orderBy */.My)('timestamp', 'desc'));
        const tagsUnsubscribe = (0,index_esm/* onSnapshot */.aQ)(tagsQuery, (snapshot) => {
            const tagsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: toDate(doc.data().timestamp)
            }));
            setTags(tagsData);
        });
        // Enhanced real-time session sync with presence
        if (session) {
            const sessionUnsubscribe = (0,index_esm/* onSnapshot */.aQ)((0,index_esm.doc)(firebase.db, 'screenplaySessions', session.id), (doc) => {
                if (doc.exists()) {
                    const sessionData = doc.data();
                    setSession(sessionData);
                    // Process active users and remove stale entries
                    const now = new Date();
                    const activeUsersData = sessionData.activeUsers.filter(user => {
                        const lastSeen = new Date(user.lastSeen);
                        const timeDiff = now.getTime() - lastSeen.getTime();
                        return timeDiff < 60000; // Remove users inactive for more than 1 minute
                    });
                    setActiveUsers(activeUsersData);
                    // Update presence state
                    const presenceData = {};
                    activeUsersData.forEach(user => {
                        presenceData[user.userId] = {
                            isOnline: true,
                            lastSeen: new Date(user.lastSeen),
                            currentPage: user.currentPage
                        };
                    });
                    setUserPresence(presenceData);
                }
            });
            return () => {
                annotationsUnsubscribe();
                tagsUnsubscribe();
                sessionUnsubscribe();
            };
        }
        return () => {
            annotationsUnsubscribe();
            tagsUnsubscribe();
        };
    };
    const loadAnnotations = async () => {
        try {
            console.log('[DEBUG] Querying screenplayAnnotations with screenplayId:', screenplay.id);
            const q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'screenplayAnnotations'), (0,index_esm/* where */._M)('screenplayId', '==', screenplay.id), (0,index_esm/* orderBy */.My)('timestamp', 'desc'));
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(q);
            const annotationsData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const processedReplies = Array.isArray(data.replies)
                    ? data.replies.map((reply) => ({
                        ...reply,
                        timestamp: toDate(reply.timestamp)
                    }))
                    : [];
                console.log(`[DEBUG] Loaded annotation ${doc.id} with ${processedReplies.length} replies:`, processedReplies);
                return {
                    id: doc.id,
                    ...data,
                    timestamp: toDate(data.timestamp),
                    replies: processedReplies
                };
            });
            setAnnotations(annotationsData);
            console.log('[DEBUG] Total annotations loaded:', annotationsData.length);
        }
        catch (error) {
            console.error('[DEBUG] Error loading annotations:', error);
        }
    };
    const loadTags = async () => {
        try {
            console.log('[DEBUG] Querying screenplayTags with screenplayId:', screenplay.id);
            const q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'screenplayTags'), (0,index_esm/* where */._M)('screenplayId', '==', screenplay.id), (0,index_esm/* orderBy */.My)('timestamp', 'desc'));
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(q);
            const tagsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: toDate(doc.data().timestamp)
            }));
            setTags(tagsData);
            console.log('[DEBUG] Loaded tags:', tagsData);
        }
        catch (error) {
            console.error('[DEBUG] Error loading tags:', error);
        }
    };
    const addAnnotation = async (position, pageNumber, annotation) => {
        if (!annotation.trim())
            return;
        try {
            const annotationData = {
                screenplayId: screenplay.id,
                userId: currentUser?.uid || 'unknown',
                userName: currentUser?.displayName || 'Anonymous',
                userAvatar: currentUser?.photoURL || '',
                annotation: annotation.trim(),
                timestamp: new Date(),
                projectId: projectId,
                pageNumber,
                position,
                replies: [],
                resolved: false,
                priority: 'medium'
            };
            await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'screenplayAnnotations'), annotationData);
            setNewAnnotation('');
            dist/* toast */.oR.success('Annotation added successfully!');
        }
        catch (error) {
            console.error('Error adding annotation:', error);
            dist/* toast */.oR.error('Failed to add annotation');
        }
    };
    const addTag = async (position, pageNumber, tag) => {
        if (!tag.trim())
            return;
        try {
            const tagData = {
                screenplayId: screenplay.id,
                userId: currentUser?.uid || 'unknown',
                userName: currentUser?.displayName || 'Anonymous',
                userAvatar: currentUser?.photoURL || '',
                tagType: selectedTagType,
                content: tag.trim(),
                timestamp: new Date(),
                projectId: projectId,
                pageNumber,
                position,
                color: tagColors[selectedTagType],
                resolved: false
            };
            await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'screenplayTags'), tagData);
            setNewTag('');
            dist/* toast */.oR.success('Tag added successfully!');
        }
        catch (error) {
            console.error('Error adding tag:', error);
            dist/* toast */.oR.error('Failed to add tag');
        }
    };
    const attachSelectionHandlers = (0,react.useCallback)(() => {
        // Debounce the handler attachment to prevent multiple listeners
        const timeoutId = setTimeout(() => {
            const textLayers = document.querySelectorAll('.react-pdf__Page__textContent');
            textLayers.forEach((layer) => {
                // Remove existing listeners to prevent duplicates
                layer.removeEventListener('mouseup', handleTextSelection);
                layer.removeEventListener('touchend', handleTextSelection);
                // Add optimized listeners
                layer.addEventListener('mouseup', handleTextSelection, { passive: true });
                layer.addEventListener('touchend', handleTextSelection, { passive: true });
            });
        }, 100);
        return () => clearTimeout(timeoutId);
    }, []);
    const handleTextSelection = (0,react.useCallback)((e) => {
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            const selection = window.getSelection();
            if (!selection || selection.toString().trim() === '') {
                setShowSelectionPopup(false);
                setSelectionRect(null);
                setSelectedText('');
                setSelectionPage(null);
                return;
            }
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            // Get the page number from the closest page container
            const pageContainer = e.target.closest('.react-pdf__Page');
            const pageNumber = pageContainer ?
                parseInt(pageContainer.getAttribute('data-page-number') || '1') : 1;
            if (rect.width > 0 && rect.height > 0) {
                // Calculate position relative to the page for accurate marker placement
                const pageRect = pageContainer?.getBoundingClientRect();
                if (pageRect) {
                    const relativeX = (rect.left - pageRect.left) / pageRect.width;
                    const relativeY = (rect.top - pageRect.top) / pageRect.height;
                    const relativeWidth = rect.width / pageRect.width;
                    const relativeHeight = rect.height / pageRect.height;
                    // Store the relative position for accurate marker placement
                    setSelectionRect({
                        ...rect,
                        relativeX,
                        relativeY,
                        relativeWidth,
                        relativeHeight,
                        pageNumber
                    });
                }
                else {
                    setSelectionRect(rect);
                }
                setSelectedText(selection.toString().trim());
                setSelectionPage(pageNumber);
                setShowSelectionPopup(true);
                // Calculate popup position immediately
                const position = calculatePopupPosition(rect);
                setPopupPosition(position);
            }
        });
    }, []);
    const formatTimeAgo = (date) => {
        const now = new Date();
        const d = toDate(date);
        const diff = now.getTime() - d.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 60)
            return `${minutes}m ago`;
        if (hours < 24)
            return `${hours}h ago`;
        return `${days}d ago`;
    };
    const toggleElementResolved = async (elementId, type) => {
        try {
            const collectionName = type === 'annotation' ? 'screenplayAnnotations' : 'screenplayTags';
            const elementRef = (0,index_esm.doc)(firebase.db, collectionName, elementId);
            const element = type === 'annotation'
                ? annotations.find(c => c.id === elementId)
                : tags.find(t => t.id === elementId);
            if (element) {
                await (0,index_esm/* updateDoc */.mZ)(elementRef, { resolved: !element.resolved });
                dist/* toast */.oR.success(`${type === 'annotation' ? 'Annotation' : 'Tag'} ${element.resolved ? 'reopened' : 'resolved'}!`);
            }
        }
        catch (error) {
            console.error(`Error toggling ${type}:`, error);
            dist/* toast */.oR.error(`Failed to update ${type}`);
        }
    };
    const deleteElement = async (elementId, type) => {
        try {
            const collectionName = type === 'annotation' ? 'screenplayAnnotations' : 'screenplayTags';
            await (0,index_esm/* deleteDoc */.kd)((0,index_esm.doc)(firebase.db, collectionName, elementId));
            dist/* toast */.oR.success(`${type === 'annotation' ? 'Annotation' : 'Tag'} deleted successfully!`);
        }
        catch (error) {
            console.error(`Error deleting ${type}:`, error);
            dist/* toast */.oR.error(`Failed to delete ${type}`);
        }
    };
    (0,react.useEffect)(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handlePopupMouseMove);
            document.addEventListener('mouseup', handlePopupMouseUp);
            return () => {
                document.removeEventListener('mousemove', handlePopupMouseMove);
                document.removeEventListener('mouseup', handlePopupMouseUp);
            };
        }
    }, [isDragging, dragOffset]);
    // Simplified and faster annotation/tag creation
    const createAnnotation = (0,react.useCallback)(async (type) => {
        if (!selectionRect || !selectionPage || !currentUser)
            return;
        const content = type === 'annotation' ? annotationInput.trim() : newTag.trim();
        if (!content)
            return;
        try {
            const position = {
                x: selectionRect.relativeX || selectionRect.left / window.innerWidth,
                y: selectionRect.relativeY || selectionRect.top / window.innerHeight,
                width: selectionRect.relativeWidth || selectionRect.width / window.innerWidth,
                height: selectionRect.relativeHeight || selectionRect.height / window.innerHeight,
            };
            if (type === 'annotation') {
                await addAnnotation(position, selectionPage, content);
            }
            else {
                await addTag(position, selectionPage, content);
            }
            // Clear the selection popup immediately
            setShowSelectionPopup(false);
            setSelectionRect(null);
            setSelectedText('');
            setSelectionPage(null);
            setAnnotationInput('');
            setNewTag('');
            setPopupType(null);
            // Clear the text selection
            window.getSelection()?.removeAllRanges();
        }
        catch (error) {
            console.error(`Error creating ${type}:`, error);
            dist/* toast */.oR.error(`Failed to create ${type}`);
        }
    }, [selectionRect, selectionPage, currentUser, annotationInput, newTag, addAnnotation, addTag]);
    // Helper to calculate visible pages based on scroll
    const handleVirtualizedScroll = (0,react.useCallback)(() => {
        if (!pdfScrollRef.current || !numPages)
            return;
        const scrollTop = pdfScrollRef.current.scrollTop;
        const containerHeight = pdfScrollRef.current.clientHeight;
        // Calculate which pages should be visible with a larger buffer
        const pageHeight = 900; // Approximate page height
        const buffer = 2; // Show 2 pages before and after
        const firstVisible = Math.max(1, Math.floor(scrollTop / pageHeight) - buffer);
        const lastVisible = Math.min(numPages, Math.ceil((scrollTop + containerHeight) / pageHeight) + buffer);
        setVisiblePageRange([firstVisible, lastVisible]);
    }, [numPages]);
    // Attach scroll handler
    (0,react.useEffect)(() => {
        const ref = pdfScrollRef.current;
        if (!ref)
            return;
        ref.addEventListener('scroll', handleVirtualizedScroll);
        handleVirtualizedScroll();
        return () => ref.removeEventListener('scroll', handleVirtualizedScroll);
    }, [handleVirtualizedScroll]);
    // Debug replies when annotations change
    (0,react.useEffect)(() => {
        console.log('[DEBUG] Annotations updated:', annotations.length);
        annotations.forEach(annotation => {
            console.log(`[DEBUG] Annotation ${annotation.id}:`, {
                content: annotation.annotation,
                repliesCount: annotation.replies?.length || 0,
                replies: annotation.replies,
                hasRepliesArray: Array.isArray(annotation.replies),
                repliesType: typeof annotation.replies
            });
        });
    }, [annotations]);
    // Initialize user presence and session
    (0,react.useEffect)(() => {
        if (!currentUser)
            return;
        const initializePresence = async () => {
            try {
                // Initialize session first
                await initializeSession();
                // Set up presence update interval
                const presenceInterval = setInterval(updateUserPresence, 30000); // Update every 30 seconds
                // Initial presence update
                await updateUserPresence();
                // Set up page visibility change handler
                const handleVisibilityChange = () => {
                    if (document.hidden) {
                        // User switched tabs or minimized window
                        removeUserPresence();
                    }
                    else {
                        // User returned to the tab
                        updateUserPresence();
                    }
                };
                document.addEventListener('visibilitychange', handleVisibilityChange);
                // Cleanup function
                return () => {
                    clearInterval(presenceInterval);
                    document.removeEventListener('visibilitychange', handleVisibilityChange);
                    removeUserPresence();
                };
            }
            catch (error) {
                console.error('Error initializing presence:', error);
            }
        };
        const cleanup = initializePresence();
        return () => {
            cleanup.then(cleanupFn => cleanupFn?.());
        };
    }, [currentUser, session?.id]);
    (0,react.useEffect)(() => {
        // Check for user presence changes and show notifications
        if (activeUsers.length > 0 && previousActiveUsers.length > 0) {
            const newUsers = activeUsers.filter(user => !previousActiveUsers.find(prevUser => prevUser.userId === user.userId));
            const leftUsers = previousActiveUsers.filter(user => !activeUsers.find(currentUser => currentUser.userId === user.userId));
            newUsers.forEach(user => {
                if (user.userId !== currentUser?.uid) {
                    dist/* toast */.oR.success(`${user.userName} joined the session`, {
                        icon: '👋',
                        duration: 3000
                    });
                }
            });
            leftUsers.forEach(user => {
                if (user.userId !== currentUser?.uid) {
                    (0,dist/* toast */.oR)(`${user.userName} left the session`, {
                        icon: '👋',
                        duration: 2000
                    });
                }
            });
        }
        setPreviousActiveUsers(activeUsers);
    }, [activeUsers, currentUser]);
    // Real-time collaborators listener
    (0,react.useEffect)(() => {
        if (!screenplay.id)
            return;
        console.log('Setting up real-time collaborators listener for screenplay:', screenplay.id);
        const collaboratorsUnsubscribe = (0,index_esm/* onSnapshot */.aQ)((0,index_esm.doc)(firebase.db, 'screenplays', screenplay.id), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                const teamMembers = data.teamMembers || [];
                console.log('Real-time collaborators update received:', teamMembers);
                setCollaborators(teamMembers);
            }
            else {
                console.log('Screenplay document does not exist');
                setCollaborators([]);
            }
        }, (error) => {
            console.error('Error listening to collaborators:', error);
            setCollaborators([]);
        });
        return () => {
            console.log('Cleaning up collaborators listener');
            collaboratorsUnsubscribe();
        };
    }, [screenplay.id]);
    // Fetch current user's followers and following on mount
    (0,react.useEffect)(() => {
        const fetchFollows = async () => {
            if (!currentUser)
                return;
            try {
                // Get user's followers and following from social data using crewProfiles
                const crewSnap = await (0,index_esm/* getDocs */.GG)((0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles'), (0,index_esm/* where */._M)('uid', '==', currentUser.uid)));
                if (!crewSnap.empty) {
                    const data = crewSnap.docs[0].data();
                    const followers = Array.isArray(data.followers) ? data.followers : [];
                    const following = Array.isArray(data.following) ? data.following : [];
                    setUserFollows(Array.from(new Set([...followers, ...following])));
                }
            }
            catch (error) {
                console.error('Error fetching follows:', error);
                // If we can't get follows, we'll still allow searching all users
                setUserFollows([]);
            }
        };
        fetchFollows();
    }, [currentUser]);
    // Fetch approved contacts (mutual connections)
    (0,react.useEffect)(() => {
        if (!currentUser)
            return;
        const fetchApprovedContacts = async () => {
            const connectionsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'connections'), (0,index_esm/* where */._M)('status', '==', 'accepted'), (0,index_esm/* where */._M)('userId', '==', currentUser.uid));
            const reverseConnectionsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'connections'), (0,index_esm/* where */._M)('status', '==', 'accepted'), (0,index_esm/* where */._M)('connectedUserId', '==', currentUser.uid));
            const [directSnap, reverseSnap] = await Promise.all([
                (0,index_esm/* getDocs */.GG)(connectionsQuery),
                (0,index_esm/* getDocs */.GG)(reverseConnectionsQuery)
            ]);
            const directContacts = directSnap.docs.map(doc => doc.data().connectedUserId);
            const reverseContacts = reverseSnap.docs.map(doc => doc.data().userId);
            setApprovedContacts([...new Set([...directContacts, ...reverseContacts])]);
        };
        fetchApprovedContacts();
    }, [currentUser]);
    const handleCollaboratorSearch = async (queryStr) => {
        setCollaboratorSearch(queryStr);
        setSearchLoading(true);
        if (!queryStr.trim()) {
            setCollaboratorResults([]);
            setSearchLoading(false);
            return;
        }
        try {
            let allResults = [];
            if (approvedContacts.length > 0) {
                // Fetch all approved contacts' crew profiles in chunks of 10
                const crewRef = (0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles');
                const approvedChunks = [];
                for (let i = 0; i < approvedContacts.length; i += 10) {
                    approvedChunks.push(approvedContacts.slice(i, i + 10));
                }
                for (const chunk of approvedChunks) {
                    const q = (0,index_esm/* query */.P)(crewRef, (0,index_esm/* where */._M)('uid', 'in', chunk));
                    const snap = await (0,index_esm/* getDocs */.GG)(q);
                    allResults = allResults.concat(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                }
            }
            else {
                // Fallback: search all crew profiles
                const crewRef = (0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles');
                const snap = await (0,index_esm/* getDocs */.GG)(crewRef);
                console.log('[ScreenplayCollabModal] Fallback: found', snap.docs.length, 'crew profiles in Firestore');
                allResults = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if (allResults.length === 0) {
                    console.warn('[ScreenplayCollabModal] No crew profiles found in Firestore crewProfiles collection.');
                }
            }
            // Filter by search query
            const filtered = allResults
                .filter(user => user.id !== currentUser?.uid &&
                ((user.displayName || user.name || '').toLowerCase().includes(queryStr.toLowerCase()) ||
                    (user.email || '').toLowerCase().includes(queryStr.toLowerCase())))
                .map(user => ({
                id: user.id,
                name: user.name || user.displayName || `Crew Member ${user.id.slice(-4)}`,
                email: user.email || '',
                avatar: user.profileImageUrl || user.avatarUrl || user.avatar || '',
                role: user.jobTitles?.[0]?.title || user.role || 'Crew Member',
                isFollowing: userFollows.includes(user.id),
                connectionStatus: 'connected',
            }));
            console.log('[ScreenplayCollabModal] Filtered users after search:', filtered.length, filtered.map(u => u.name));
            setCollaboratorResults(filtered);
            setSearchLoading(false);
        }
        catch (error) {
            console.error('[ScreenplayCollabModal] Error searching users:', error);
            setCollaboratorResults([]);
            setSearchLoading(false);
        }
    };
    const handleAddCollaborator = async (user) => {
        if (collaborators.some(c => c.id === user.id)) {
            dist/* toast */.oR.error(`${user.name} is already a collaborator.`);
            return;
        }
        setAddingCollaborator(true);
        try {
            console.log('Adding collaborator:', user);
            console.log('Screenplay ID:', screenplay.id);
            // First check if the screenplay document exists
            const screenplayRef = (0,index_esm.doc)(firebase.db, 'screenplays', screenplay.id);
            const screenplayDoc = await (0,index_esm.getDoc)(screenplayRef);
            if (!screenplayDoc.exists()) {
                throw new Error('Screenplay document not found');
            }
            const screenplayData = screenplayDoc.data();
            console.log('Current screenplay data:', screenplayData);
            const newCollaborator = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar || '',
                role: user.role || 'collaborator',
                addedAt: new Date(),
                addedBy: currentUser?.uid
            };
            console.log('New collaborator object:', newCollaborator);
            // Update the database
            await (0,index_esm/* updateDoc */.mZ)(screenplayRef, {
                teamMembers: (0,index_esm/* arrayUnion */.hq)(newCollaborator)
            });
            console.log('Database updated successfully');
            // Update local state immediately
            setCollaborators(prev => {
                const updated = [...prev, newCollaborator];
                console.log('Updated collaborators list:', updated);
                return updated;
            });
            // Show success message
            dist/* toast */.oR.success(`${user.name} added as collaborator!`);
            // Close modal and reset search
            setShowAddCollaboratorModal(false);
            setCollaboratorSearch('');
            setCollaboratorResults([]);
        }
        catch (err) {
            console.error('Error adding collaborator:', err);
            dist/* toast */.oR.error(`Failed to add collaborator: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
        finally {
            setAddingCollaborator(false);
        }
    };
    // Focus trap for modal
    (0,react.useEffect)(() => {
        if (showAddCollaboratorModal && modalRef.current) {
            // Focus the search input when modal opens
            const searchInput = modalRef.current.querySelector('.collaborator-search-input');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
            // Handle focus trap
            const handleKeyDown = (e) => {
                if (e.key === 'Tab') {
                    const focusableElements = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (focusableElements && focusableElements.length > 0) {
                        const firstElement = focusableElements[0];
                        const lastElement = focusableElements[focusableElements.length - 1];
                        if (e.shiftKey) {
                            if (document.activeElement === firstElement) {
                                e.preventDefault();
                                lastElement.focus();
                            }
                        }
                        else {
                            if (document.activeElement === lastElement) {
                                e.preventDefault();
                                firstElement.focus();
                            }
                        }
                    }
                }
            };
            modalRef.current.addEventListener('keydown', handleKeyDown);
            return () => {
                modalRef.current?.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [showAddCollaboratorModal]);
    // Add remove collaborator handler
    const handleRemoveCollaborator = async (userId) => {
        try {
            const toRemove = collaborators.find(c => c.id === userId);
            if (!toRemove)
                return;
            const screenplayRef = (0,index_esm.doc)(firebase.db, 'screenplays', screenplay.id);
            await (0,index_esm/* updateDoc */.mZ)(screenplayRef, {
                teamMembers: (0,index_esm/* arrayRemove */.C3)(toRemove)
            });
            setCollaborators(collaborators.filter(c => c.id !== userId));
            dist/* toast */.oR.success('Collaborator removed.');
        }
        catch (err) {
            dist/* toast */.oR.error('Failed to remove collaborator.');
        }
    };
    // When rendering collaborators, ensure uniqueness by ID
    const uniqueCollaborators = Array.from(new Map(collaborators.map(c => [c.id, c])).values());
    return ((0,jsx_runtime.jsx)("div", { className: "screenplay-viewer-overlay", children: (0,jsx_runtime.jsxs)("div", { className: "screenplay-viewer", ref: viewerRef, children: [(0,jsx_runtime.jsx)("button", { onClick: onClose, className: "btn-close-absolute", "aria-label": "Close", children: "\u00D7" }), (0,jsx_runtime.jsxs)("div", { className: "viewer-content", children: [(0,jsx_runtime.jsxs)("div", { className: `pdf-panel ${viewMode} ${sidebarCollapsed ? 'expanded' : ''}`, children: [(0,jsx_runtime.jsxs)("div", { className: "pdf-floating-zoom-controls", children: [(0,jsx_runtime.jsx)("button", { onClick: () => setScale(prev => Math.max(0.5, prev - 0.2)), children: "-" }), (0,jsx_runtime.jsxs)("span", { children: [Math.round(scale * 100), "%"] }), (0,jsx_runtime.jsx)("button", { onClick: () => setScale(prev => Math.min(3, prev + 0.2)), children: "+" })] }), (0,jsx_runtime.jsx)("div", { className: "pdf-container", ref: pdfContainerRef, style: { position: 'relative' }, children: error ? ((0,jsx_runtime.jsx)("div", { className: "error-message", children: error })) : screenplay.url ? ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)(entry/* Document */.yo, { file: screenplay.url, onLoadSuccess: ({ numPages }) => {
                                                    console.log('PDF loaded successfully, numPages:', numPages);
                                                    setNumPages(numPages);
                                                    setLoading(false);
                                                    setCurrentPage(1);
                                                }, onLoadError: (error) => {
                                                    console.error('Error loading PDF:', error);
                                                    setError('Failed to load PDF document');
                                                    setLoading(false);
                                                }, loading: (0,jsx_runtime.jsxs)("div", { className: "loading-container", children: [(0,jsx_runtime.jsx)("div", { className: "loading-spinner" }), (0,jsx_runtime.jsx)("p", { children: "Loading PDF..." })] }), error: (0,jsx_runtime.jsx)("div", { children: "Failed to load PDF document." }), children: typeof numPages === 'number' && numPages > 0 ? ((0,jsx_runtime.jsx)("div", { className: "pdf-scrollable-container", ref: pdfScrollRef, onScroll: handlePdfScroll, onWheel: handlePdfWheel, children: Array.from(new Array(numPages), (el, index) => {
                                                        const pageNumber = index + 1;
                                                        const [first, last] = visiblePageRange;
                                                        const isVisible = pageNumber >= first && pageNumber <= last;
                                                        return ((0,jsx_runtime.jsx)("div", { className: "page-container", style: { position: 'relative', marginBottom: '20px', minHeight: 900 }, children: isVisible ? ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)(entry/* Page */.YW, { pageNumber: pageNumber, scale: scale, onLoadSuccess: () => {
                                                                            console.log(`Page ${pageNumber} loaded successfully`);
                                                                            attachSelectionHandlers();
                                                                        }, onRenderSuccess: () => {
                                                                            console.log(`Page ${pageNumber} rendered successfully`);
                                                                            attachSelectionHandlers();
                                                                        }, onLoadError: (error) => console.error(`Error loading page ${pageNumber}:`, error), error: (error) => ((0,jsx_runtime.jsxs)("div", { className: "page-error", children: [(0,jsx_runtime.jsxs)("p", { children: ["Error loading page ", pageNumber] }), (0,jsx_runtime.jsx)("small", { children: error.message })] })), loading: () => ((0,jsx_runtime.jsx)("div", { className: "page-loading", children: (0,jsx_runtime.jsxs)("p", { children: ["Loading page ", pageNumber, "..."] }) })) }), showOverlays && annotations.filter(annotation => annotation.pageNumber === pageNumber).map(annotation => {
                                                                        const overlayHeight = `${annotation.position.height * 100}%`;
                                                                        const pagePixelHeight = 900;
                                                                        const heightPx = annotation.position.height * pagePixelHeight;
                                                                        const isSingleLine = heightPx < 32;
                                                                        const verticalPad = isSingleLine ? 4 : 0;
                                                                        const markerOffset = isSingleLine ? -18 : -20;
                                                                        return ((0,jsx_runtime.jsxs)(react.Fragment, { children: [(0,jsx_runtime.jsx)("div", { className: `annotation-overlay ${selectedElement === annotation.id ? 'selected' : ''} ${annotation.resolved ? 'resolved' : ''}`, style: {
                                                                                        position: 'absolute',
                                                                                        left: `${annotation.position.x * 100}%`,
                                                                                        top: `calc(${annotation.position.y * 100}% - ${verticalPad}px)`,
                                                                                        width: `${annotation.position.width * 100}%`,
                                                                                        height: `calc(${overlayHeight} + ${verticalPad * 2}px)`,
                                                                                        border: isSingleLine ? '1px solid rgba(239, 68, 68, 0.45)' : '2px solid rgba(239, 68, 68, 0.7)',
                                                                                        borderRadius: isSingleLine ? 3 : 8,
                                                                                        cursor: 'pointer',
                                                                                        zIndex: 5,
                                                                                        transition: 'all 0.15s ease',
                                                                                        pointerEvents: 'auto',
                                                                                        background: 'none',
                                                                                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)'
                                                                                    }, "data-element-id": annotation.id, onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        setActiveAnnotation(annotation);
                                                                                        setShowAnnotationPanel(true);
                                                                                        setPanelX(e.clientX);
                                                                                        setPanelY(e.clientY);
                                                                                        setSelectedElement(annotation.id);
                                                                                        setActiveThread(null);
                                                                                    }, title: `Annotation by ${annotation.userName}: ${annotation.annotation}` }), (0,jsx_runtime.jsx)("div", { className: "annotation-marker", style: {
                                                                                        position: 'absolute',
                                                                                        left: `calc(${annotation.position.x * 100}% + ${annotation.position.width * 100}% - 10px)`,
                                                                                        top: `calc(${annotation.position.y * 100}% - ${verticalPad}px + ${markerOffset}px)`,
                                                                                        width: 20,
                                                                                        height: 20,
                                                                                        borderRadius: '50%',
                                                                                        background: '#EF4444',
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'center',
                                                                                        fontSize: 10,
                                                                                        color: 'white',
                                                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                                                        border: '1px solid white',
                                                                                        zIndex: 10
                                                                                    }, children: "\uD83D\uDCAC" })] }, `annotation-${annotation.id}`));
                                                                    }), showOverlays && tags.filter(tag => tag.pageNumber === pageNumber).map(tag => {
                                                                        const overlayHeight = `${tag.position.height * 100}%`;
                                                                        const pagePixelHeight = 900;
                                                                        const heightPx = tag.position.height * pagePixelHeight;
                                                                        const isSingleLine = heightPx < 32;
                                                                        const verticalPad = isSingleLine ? 4 : 0;
                                                                        const markerOffset = isSingleLine ? -18 : -20;
                                                                        return ((0,jsx_runtime.jsxs)(react.Fragment, { children: [(0,jsx_runtime.jsx)("div", { className: `tag-overlay ${selectedElement === tag.id ? 'selected' : ''} ${tag.resolved ? 'resolved' : ''}`, style: {
                                                                                        position: 'absolute',
                                                                                        left: `${tag.position.x * 100}%`,
                                                                                        top: `calc(${tag.position.y * 100}% - ${verticalPad}px)`,
                                                                                        width: `${tag.position.width * 100}%`,
                                                                                        height: `calc(${overlayHeight} + ${verticalPad * 2}px)`,
                                                                                        border: isSingleLine ? '1px solid rgba(245, 158, 11, 0.45)' : '2px solid rgba(245, 158, 11, 0.7)',
                                                                                        borderRadius: isSingleLine ? 3 : 8,
                                                                                        cursor: 'pointer',
                                                                                        zIndex: 5,
                                                                                        transition: 'all 0.15s ease',
                                                                                        pointerEvents: 'auto',
                                                                                        background: 'none',
                                                                                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.08)'
                                                                                    }, "data-element-id": tag.id, onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        setActiveAnnotation(null);
                                                                                        setShowAnnotationPanel(true);
                                                                                        setPanelX(e.clientX);
                                                                                        setPanelY(e.clientY);
                                                                                        setSelectedElement(tag.id);
                                                                                        setActiveThread(null);
                                                                                    }, title: `Tag by ${tag.userName}: ${tag.content}` }), (0,jsx_runtime.jsx)("div", { className: "tag-marker", style: {
                                                                                        position: 'absolute',
                                                                                        left: `calc(${tag.position.x * 100}% + ${tag.position.width * 100}% - 10px)`,
                                                                                        top: `calc(${tag.position.y * 100}% - ${verticalPad}px + ${markerOffset}px)`,
                                                                                        width: 20,
                                                                                        height: 20,
                                                                                        borderRadius: '50%',
                                                                                        background: '#f59e0b',
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'center',
                                                                                        fontSize: 10,
                                                                                        color: 'white',
                                                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                                                        border: '1px solid white',
                                                                                        zIndex: 10
                                                                                    }, children: "\uD83C\uDFF7\uFE0F" })] }, `tag-${tag.id}`));
                                                                    })] })) : ((0,jsx_runtime.jsx)("div", { className: "page-loading", style: { minHeight: 900 } })) }, `page_${pageNumber}`));
                                                    }) })) : ((0,jsx_runtime.jsxs)("div", { className: "loading-container", children: [(0,jsx_runtime.jsx)("div", { className: "loading-spinner" }), (0,jsx_runtime.jsx)("p", { children: "Loading PDF pages..." })] })) }), (0,jsx_runtime.jsx)("canvas", { ref: drawingCanvasRef, className: "drawing-canvas", style: {
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    pointerEvents: 'none',
                                                    zIndex: 10
                                                } }), showOverlays && ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [ false && 0, activeUsers.length > 1 && ((0,jsx_runtime.jsx)("div", { className: "floating-collaboration-indicator", children: (0,jsx_runtime.jsxs)("div", { className: "indicator-content", children: [(0,jsx_runtime.jsxs)("div", { className: "active-users-count", children: [(0,jsx_runtime.jsx)("span", { className: "count", children: activeUsers.length }), (0,jsx_runtime.jsx)("span", { className: "label", children: "collaborating" })] }), (0,jsx_runtime.jsxs)("div", { className: "users-avatars", children: [activeUsers.slice(0, 3).map(user => ((0,jsx_runtime.jsx)("div", { className: "mini-avatar", title: user.userName, children: user.userAvatar ? ((0,jsx_runtime.jsx)("img", { src: user.userAvatar, alt: user.userName })) : ((0,jsx_runtime.jsx)("div", { className: "mini-avatar-placeholder", children: user.userName.charAt(0).toUpperCase() })) }, user.userId))), activeUsers.length > 3 && ((0,jsx_runtime.jsxs)("div", { className: "more-users", children: ["+", activeUsers.length - 3] }))] })] }) }))] }))] })) : ((0,jsx_runtime.jsx)("div", { children: "No PDF URL provided." })) })] }), (0,jsx_runtime.jsxs)("div", { className: `collaboration-panel${sidebarCollapsed ? ' collapsed' : ''}`, children: [(0,jsx_runtime.jsx)("button", { className: "sidebar-toggle-btn", onClick: () => setSidebarCollapsed((prev) => !prev), "aria-label": sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar', children: sidebarCollapsed ? '⮜' : '⮞' }), !sidebarCollapsed && ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)("div", { className: "panel-header", children: [(0,jsx_runtime.jsx)("h3", { children: "\uD83D\uDCAC Collaboration" }), (0,jsx_runtime.jsxs)("div", { className: "panel-controls", children: [(0,jsx_runtime.jsxs)("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), children: [(0,jsx_runtime.jsx)("option", { value: "all", children: "All" }), (0,jsx_runtime.jsx)("option", { value: "annotations", children: "Annotations" }), (0,jsx_runtime.jsx)("option", { value: "tags", children: "Tags" }), (0,jsx_runtime.jsx)("option", { value: "resolved", children: "Resolved" })] }), (0,jsx_runtime.jsxs)("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), children: [(0,jsx_runtime.jsx)("option", { value: "time", children: "Time" }), (0,jsx_runtime.jsx)("option", { value: "page", children: "Page" }), (0,jsx_runtime.jsx)("option", { value: "type", children: "Type" }), (0,jsx_runtime.jsx)("option", { value: "user", children: "User" })] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "panel-content", children: [(0,jsx_runtime.jsxs)("div", { className: "active-users", children: [(0,jsx_runtime.jsxs)("h4", { children: ["\uD83D\uDC65 Active Users (", activeUsers.length, ")"] }), (0,jsx_runtime.jsxs)("div", { className: "users-list", children: [activeUsers.map(user => {
                                                                    const isCurrentUser = user.userId === currentUser?.uid;
                                                                    const isOnline = userPresence[user.userId]?.isOnline || isCurrentUser;
                                                                    const lastSeen = userPresence[user.userId]?.lastSeen;
                                                                    return ((0,jsx_runtime.jsxs)("div", { className: "user-item", children: [(0,jsx_runtime.jsxs)("div", { className: "user-avatar", children: [user.userAvatar ? ((0,jsx_runtime.jsx)("img", { src: user.userAvatar, alt: user.userName })) : ((0,jsx_runtime.jsx)("div", { className: "avatar-placeholder", children: user.userName.charAt(0).toUpperCase() })), (0,jsx_runtime.jsx)("div", { className: `online-indicator ${isOnline ? 'online' : 'offline'}` })] }), (0,jsx_runtime.jsxs)("div", { className: "user-info", children: [(0,jsx_runtime.jsx)("span", { className: "user-name", children: isCurrentUser ? `${user.userName} (You)` : user.userName }), (0,jsx_runtime.jsxs)("span", { className: "user-status", children: [isOnline ? '🟢 Online' : '🔴 Offline', !isOnline && lastSeen && ((0,jsx_runtime.jsxs)("span", { className: "last-seen", children: [' ', "\u2022 ", formatTimeAgo(lastSeen)] }))] }), (0,jsx_runtime.jsxs)("span", { className: "user-page", children: ["Page ", userPresence[user.userId]?.currentPage || 1] })] })] }, user.userId));
                                                                }), activeUsers.length === 0 && ((0,jsx_runtime.jsx)("div", { className: "no-users", children: (0,jsx_runtime.jsx)("span", { children: "No other users currently viewing" }) }))] })] }), (0,jsx_runtime.jsxs)("div", { className: "collaborators-section", children: [(0,jsx_runtime.jsxs)("h4", { children: ["\uD83E\uDD1D Collaborators (", collaborators.filter(user => user && user.id && user.name).length, ")"] }), (0,jsx_runtime.jsxs)("div", { className: "collaborators-list", children: [uniqueCollaborators.length === 0 && (0,jsx_runtime.jsx)("div", { className: "no-collaborators", children: "No collaborators yet." }), uniqueCollaborators.map(user => ((0,jsx_runtime.jsxs)("div", { className: "collaborator-item", children: [(0,jsx_runtime.jsx)("div", { className: "collaborator-avatar", children: user.avatar ? (0,jsx_runtime.jsx)("img", { src: user.avatar, alt: user.name }) : (0,jsx_runtime.jsx)("div", { className: "avatar-placeholder", children: user.name?.charAt(0).toUpperCase() || '?' }) }), (0,jsx_runtime.jsxs)("div", { className: "collaborator-info", children: [(0,jsx_runtime.jsx)("span", { className: "collaborator-name", children: user.name || 'Unknown' }), (0,jsx_runtime.jsx)("span", { className: "collaborator-role", children: user.role || 'Collaborator' })] }), user.id !== currentUser?.uid && ((0,jsx_runtime.jsx)("button", { className: "remove-btn", onClick: () => handleRemoveCollaborator(user.id), title: "Remove collaborator", style: { marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer' }, children: "\u00D7" }))] }, user.id)))] }), (0,jsx_runtime.jsx)("button", { className: "add-collaborator-btn", onClick: () => setShowAddCollaboratorModal(true), children: "+ Add Collaborator" })] }), (0,jsx_runtime.jsxs)("div", { className: "annotations-section", children: [(0,jsx_runtime.jsxs)("h4", { children: ["\uD83D\uDCAC Annotations (", annotations.length, ")"] }), (0,jsx_runtime.jsx)("div", { className: "annotations-list", children: annotations.map(annotation => ((0,jsx_runtime.jsxs)("div", { className: `annotation-item ${annotation.resolved ? 'resolved' : ''}`, children: [(0,jsx_runtime.jsxs)("div", { className: "annotation-header", children: [(0,jsx_runtime.jsxs)("div", { className: "annotation-author", children: [annotation.userAvatar ? ((0,jsx_runtime.jsx)("img", { src: annotation.userAvatar, alt: annotation.userName })) : ((0,jsx_runtime.jsx)("div", { className: "avatar-placeholder", children: annotation.userName.charAt(0) })), (0,jsx_runtime.jsx)("span", { children: annotation.userName })] }), (0,jsx_runtime.jsx)("div", { className: "annotation-meta", children: (0,jsx_runtime.jsx)("span", { className: "annotation-time", children: formatTimeAgo(toDate(annotation.timestamp)) }) })] }), (0,jsx_runtime.jsx)("div", { className: "annotation-content", children: annotation.annotation }), !annotation.resolved && ((0,jsx_runtime.jsxs)("button", { onClick: () => setReplyingTo(annotation.id), className: "reply-btn compact", children: [(0,jsx_runtime.jsx)("span", { style: { fontSize: '1.1em', marginRight: 2 }, children: "\u21A9" }), " Reply"] })), annotation.replies && annotation.replies.length > 0 && ((0,jsx_runtime.jsx)("div", { className: "replies-section compact", children: annotation.replies.map(reply => ((0,jsx_runtime.jsxs)("div", { className: "reply-item compact", children: [(0,jsx_runtime.jsxs)("div", { className: "reply-header compact", children: [reply.userAvatar ? ((0,jsx_runtime.jsx)("img", { src: reply.userAvatar, alt: reply.userName, className: "reply-avatar compact" })) : ((0,jsx_runtime.jsx)("div", { className: "avatar-placeholder compact", children: reply.userName.charAt(0) })), (0,jsx_runtime.jsx)("span", { className: "reply-author compact", children: reply.userName }), (0,jsx_runtime.jsx)("span", { className: "reply-time compact", children: formatTimeAgo(toDate(reply.timestamp)) })] }), (0,jsx_runtime.jsx)("div", { className: "reply-content compact", children: reply.content })] }, reply.id))) })), replyingTo === annotation.id && !annotation.resolved && ((0,jsx_runtime.jsxs)("div", { className: "reply-input-section compact", children: [(0,jsx_runtime.jsx)("textarea", { value: replyInput, onChange: (e) => setReplyInput(e.target.value), placeholder: "Write a reply...", className: "reply-textarea compact", rows: 2, autoFocus: true, onKeyDown: (e) => {
                                                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                                                        e.preventDefault();
                                                                                        if (replyInput.trim()) {
                                                                                            handleAddReply(annotation.id, replyInput.trim());
                                                                                            setReplyInput('');
                                                                                            setReplyingTo(null);
                                                                                        }
                                                                                    }
                                                                                    else if (e.key === 'Escape') {
                                                                                        setReplyingTo(null);
                                                                                        setReplyInput('');
                                                                                    }
                                                                                } }), (0,jsx_runtime.jsxs)("div", { className: "reply-actions compact", children: [(0,jsx_runtime.jsx)("button", { onClick: () => {
                                                                                            if (replyInput.trim()) {
                                                                                                handleAddReply(annotation.id, replyInput.trim());
                                                                                                setReplyInput('');
                                                                                                setReplyingTo(null);
                                                                                            }
                                                                                        }, className: "reply-submit-btn compact", disabled: !replyInput.trim(), children: "Reply" }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                                                                            setReplyingTo(null);
                                                                                            setReplyInput('');
                                                                                        }, className: "reply-cancel-btn compact", children: "Cancel" })] })] })), (0,jsx_runtime.jsxs)("div", { className: "annotation-actions", children: [(0,jsx_runtime.jsx)("button", { onClick: (e) => { e.stopPropagation(); navigateToElement(annotation); }, className: "action-btn", children: "\uD83D\uDCCD Go to" }), !annotation.resolved ? ((0,jsx_runtime.jsx)("button", { onClick: () => toggleElementResolved(annotation.id, 'annotation'), className: "action-btn", children: "\u2705 Resolve" })) : ((0,jsx_runtime.jsx)("button", { onClick: () => toggleElementResolved(annotation.id, 'annotation'), className: "action-btn", children: "\uD83D\uDD04 Reopen" })), (0,jsx_runtime.jsx)("button", { onClick: (e) => { e.stopPropagation(); deleteElement(annotation.id, 'annotation'); }, className: "action-btn delete", children: "\uD83D\uDDD1\uFE0F Delete" })] })] }, annotation.id))) })] }), (0,jsx_runtime.jsxs)("div", { className: "tags-section", children: [(0,jsx_runtime.jsxs)("h4", { children: ["\uD83C\uDFF7\uFE0F Tags (", tags.length, ")"] }), (0,jsx_runtime.jsx)("div", { className: "tags-list", children: tags.map(tag => ((0,jsx_runtime.jsxs)("div", { className: `tag-item ${tag.resolved ? 'resolved' : ''}`, children: [(0,jsx_runtime.jsxs)("div", { className: "tag-header", children: [(0,jsx_runtime.jsxs)("div", { className: "tag-author", children: [tag.userAvatar ? ((0,jsx_runtime.jsx)("img", { src: tag.userAvatar, alt: tag.userName })) : ((0,jsx_runtime.jsx)("div", { className: "avatar-placeholder", children: tag.userName.charAt(0) })), (0,jsx_runtime.jsx)("span", { children: tag.userName })] }), (0,jsx_runtime.jsx)("div", { className: "tag-meta", children: (0,jsx_runtime.jsx)("span", { className: "tag-time", children: formatTimeAgo(toDate(tag.timestamp)) }) })] }), (0,jsx_runtime.jsxs)("div", { className: "tag-content", children: [(0,jsx_runtime.jsx)("span", { className: "tag-type", style: { backgroundColor: tag.color }, children: tag.tagType }), (0,jsx_runtime.jsx)("span", { className: "tag-text", children: tag.content })] }), (0,jsx_runtime.jsxs)("div", { className: "tag-actions", children: [(0,jsx_runtime.jsx)("button", { onClick: (e) => { e.stopPropagation(); navigateToElement(tag); }, className: "action-btn", children: "\uD83D\uDCCD Go to" }), (0,jsx_runtime.jsx)("button", { onClick: (e) => { e.stopPropagation(); toggleElementResolved(tag.id, 'tag'); }, className: `action-btn ${tag.resolved ? 'resolved' : ''}`, children: tag.resolved ? '🔄 Reopen' : '✅ Resolve' }), (0,jsx_runtime.jsx)("button", { onClick: (e) => { e.stopPropagation(); deleteElement(tag.id, 'tag'); }, className: "action-btn delete", children: "\uD83D\uDDD1\uFE0F Delete" })] })] }, tag.id))) })] })] })] }))] })] }), isNavigating && ((0,jsx_runtime.jsxs)("div", { className: "navigation-loading", children: [(0,jsx_runtime.jsx)("div", { className: "spinner" }), (0,jsx_runtime.jsx)("span", { children: "Navigating to annotation..." })] })), (showSelectionPopup || popupType) && ((0,jsx_runtime.jsxs)("div", { className: "selection-popup", ref: popupRef, style: {
                        left: popupPosition.x || 100,
                        top: popupPosition.y || 100,
                        position: 'fixed',
                        zIndex: 3000,
                        minWidth: 260,
                        maxWidth: 340,
                        cursor: isDragging ? 'grabbing' : 'grab',
                        userSelect: 'none',
                    }, onMouseDown: handlePopupMouseDown, children: [(0,jsx_runtime.jsx)("div", { className: "popup-header", style: { fontWeight: 600, color: '#374151', marginBottom: 8, cursor: 'grab' }, children: popupType === 'annotation' ? 'Add Annotation' : popupType === 'tag' ? 'Add Tag' : 'Add to selection:' }), popupType === 'annotation' && ((0,jsx_runtime.jsx)("textarea", { placeholder: "Enter your annotation...", value: annotationInput, onChange: e => setAnnotationInput(e.target.value), rows: 3, style: { width: '100%', marginBottom: 8, border: '1px solid #d1d5db', borderRadius: 6, padding: 8, fontSize: 13, resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }, autoFocus: true, onKeyDown: (e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    createAnnotation('annotation');
                                }
                                else if (e.key === 'Escape') {
                                    setPopupType(null);
                                    setAnnotationInput('');
                                }
                            } })), popupType === 'tag' && ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)("select", { value: selectedTagType, onChange: e => setSelectedTagType(e.target.value), style: { width: '100%', marginBottom: 8, border: '1px solid #d1d5db', borderRadius: 6, padding: 8, fontSize: 13, fontFamily: 'inherit' }, children: [(0,jsx_runtime.jsx)("option", { value: "character", children: "Character" }), (0,jsx_runtime.jsx)("option", { value: "location", children: "Location" }), (0,jsx_runtime.jsx)("option", { value: "prop", children: "Prop" }), (0,jsx_runtime.jsx)("option", { value: "scene", children: "Scene" }), (0,jsx_runtime.jsx)("option", { value: "camera", children: "Camera" }), (0,jsx_runtime.jsx)("option", { value: "lighting", children: "Lighting" }), (0,jsx_runtime.jsx)("option", { value: "sound", children: "Sound" }), (0,jsx_runtime.jsx)("option", { value: "note", children: "Note" })] }), (0,jsx_runtime.jsx)("input", { type: "text", placeholder: "Enter tag content...", value: newTag, onChange: e => setNewTag(e.target.value), style: {
                                        width: '100%',
                                        marginBottom: '8px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        padding: '8px',
                                        fontSize: '13px',
                                        fontFamily: 'inherit'
                                    }, autoFocus: true, onKeyDown: (e) => {
                                        if (e.key === 'Enter') {
                                            createAnnotation('tag');
                                        }
                                        else if (e.key === 'Escape') {
                                            setPopupType(null);
                                            setNewTag('');
                                        }
                                    } })] })), !popupType && ((0,jsx_runtime.jsxs)("div", { style: { display: 'flex', gap: 8, flexDirection: 'column' }, children: [(0,jsx_runtime.jsx)("button", { onClick: () => {
                                        setPopupType('annotation');
                                        setAnnotationInput('');
                                    }, style: { background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, padding: '8px 12px', fontSize: 13, cursor: 'pointer', transition: 'background 0.2s ease' }, children: "\uD83D\uDCAC Add Annotation" }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                        setPopupType('tag');
                                        setNewTag('');
                                    }, style: { background: '#f59e0b', color: 'white', border: 'none', borderRadius: 6, padding: '8px 12px', fontSize: 13, cursor: 'pointer', transition: 'background 0.2s ease' }, children: "\uD83C\uDFF7\uFE0F Add Tag" }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                        setShowSelectionPopup(false);
                                        setSelectionRect(null);
                                        setSelectedText('');
                                        setSelectionPage(null);
                                        window.getSelection()?.removeAllRanges();
                                    }, style: { background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer', transition: 'background 0.2s ease' }, children: "Cancel" })] })), (popupType === 'annotation' || popupType === 'tag') && ((0,jsx_runtime.jsxs)("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' }, children: [(0,jsx_runtime.jsx)("button", { onClick: () => {
                                        setPopupType(null);
                                        setAnnotationInput('');
                                        setNewTag('');
                                    }, style: { background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }, children: "Cancel" }), (0,jsx_runtime.jsxs)("button", { onClick: () => createAnnotation(popupType), disabled: popupType === 'annotation' ? !annotationInput.trim() : !newTag.trim(), style: { background: (popupType === 'annotation' ? annotationInput.trim() : newTag.trim()) ? (popupType === 'annotation' ? '#3b82f6' : '#f59e0b') : '#9ca3af', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: (popupType === 'annotation' ? annotationInput.trim() : newTag.trim()) ? 'pointer' : 'not-allowed' }, children: ["Save ", popupType === 'annotation' ? '(Ctrl+Enter)' : '(Enter)'] })] }))] })), showAddCollaboratorModal && ((0,jsx_runtime.jsx)("div", { className: "modal-overlay", onClick: (e) => {
                        if (e.target === e.currentTarget) {
                            setShowAddCollaboratorModal(false);
                            setCollaboratorSearch('');
                            setCollaboratorResults([]);
                        }
                    }, onKeyDown: (e) => {
                        if (e.key === 'Escape') {
                            setShowAddCollaboratorModal(false);
                            setCollaboratorSearch('');
                            setCollaboratorResults([]);
                        }
                    }, tabIndex: -1, children: (0,jsx_runtime.jsxs)("div", { className: "modal-content", ref: modalRef, style: { position: 'relative' }, children: [(0,jsx_runtime.jsx)("button", { onClick: () => {
                                    setShowAddCollaboratorModal(false);
                                    setCollaboratorSearch('');
                                    setCollaboratorResults([]);
                                }, className: "close-btn", "aria-label": "Close modal", style: { position: 'absolute', top: 12, right: 12, zIndex: 2, fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }, children: "\u00D7" }), (0,jsx_runtime.jsx)("div", { className: "modal-header", children: (0,jsx_runtime.jsx)("h3", { children: "Add Collaborator" }) }), (0,jsx_runtime.jsxs)("div", { className: "modal-body", children: [(0,jsx_runtime.jsx)("input", { type: "text", placeholder: "Search by name or email...", value: collaboratorSearch, onChange: e => handleCollaboratorSearch(e.target.value), className: "collaborator-search-input", autoFocus: true }), (0,jsx_runtime.jsxs)("div", { className: "collaborator-search-results", children: [searchLoading && ((0,jsx_runtime.jsx)("div", { className: "no-results", children: "Searching..." })), !searchLoading && collaboratorResults.length === 0 && collaboratorSearch.trim() && ((0,jsx_runtime.jsx)("div", { className: "no-results", children: "No friends found." })), !searchLoading && collaboratorResults.length === 0 && !collaboratorSearch.trim() && ((0,jsx_runtime.jsx)("div", { className: "no-results", children: "Start typing to search for users" })), collaboratorResults.map(user => ((0,jsx_runtime.jsxs)("div", { className: "user-result", children: [(0,jsx_runtime.jsxs)("div", { className: "user-info", children: [(0,jsx_runtime.jsx)("div", { className: "user-avatar", children: user.avatar ? ((0,jsx_runtime.jsx)("img", { src: user.avatar, alt: user.name })) : ((0,jsx_runtime.jsx)("div", { className: "avatar-placeholder", children: user.name?.charAt(0).toUpperCase() || '?' })) }), (0,jsx_runtime.jsxs)("div", { className: "user-details", children: [(0,jsx_runtime.jsx)("span", { className: "user-name", children: user.name || 'Unknown' }), (0,jsx_runtime.jsx)("span", { className: "user-email", children: user.email }), user.role && (0,jsx_runtime.jsx)("span", { className: "user-role", children: user.role }), (0,jsx_runtime.jsx)("span", { className: "connection-badge", style: { color: '#10b981', fontWeight: 500, fontSize: '0.85em', marginLeft: 6 }, children: "Connected" })] })] }), (0,jsx_runtime.jsx)("button", { disabled: addingCollaborator || collaborators.some(c => c.id === user.id), onClick: () => handleAddCollaborator(user), className: "add-btn", children: addingCollaborator ? 'Adding...' : collaborators.some(c => c.id === user.id) ? 'Already Added' : 'Add' })] }, user.id || user.email || Math.random())))] })] })] }) }))] }) }));
};
/* harmony default export */ const components_Collaboration_ScreenplayViewer = (ScreenplayViewer_ScreenplayViewer);

;// ./src/components/Collaboration/CollaborationHub.tsx











class CollaborationErrorBoundary extends react.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('CollaborationHub Error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return ((0,jsx_runtime.jsxs)("div", { className: "error-boundary", children: [(0,jsx_runtime.jsx)("h2", { children: "Something went wrong with the Collaboration Hub." }), (0,jsx_runtime.jsx)("p", { children: "Please refresh the page or try again later." }), (0,jsx_runtime.jsx)("button", { onClick: () => window.location.reload(), children: "Refresh Page" })] }));
        }
        return this.props.children;
    }
}
const CollaborationHub_CollaborationHub = ({ projectId }) => {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [activeTab, setActiveTab] = (0,react.useState)('workspaces');
    const [workspaces, setWorkspaces] = (0,react.useState)([]);
    const [selectedWorkspace, setSelectedWorkspace] = (0,react.useState)(null);
    const [loading, setLoading] = (0,react.useState)(true);
    const [error, setError] = (0,react.useState)(null);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = (0,react.useState)(false);
    const [showAddMemberModal, setShowAddMemberModal] = (0,react.useState)(false);
    const [showSettingsModal, setShowSettingsModal] = (0,react.useState)(false);
    // Video call functionality will be added in a future update
    const [showScreenplayViewer, setShowScreenplayViewer] = (0,react.useState)(false);
    const [showScreenplayModal, setShowScreenplayModal] = (0,react.useState)(false);
    // Workspace creation state
    const [workspaceCreationStep, setWorkspaceCreationStep] = (0,react.useState)('details');
    const [newWorkspaceData, setNewWorkspaceData] = (0,react.useState)({
        name: '',
        description: '',
        type: 'project',
        selectedMembers: [],
        settings: {
            allowGuestAccess: false,
            requireApproval: true,
            autoArchive: false,
            retentionDays: 365,
            maxFileSize: 100 * 1024 * 1024,
            allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
        }
    });
    // User search state
    const [userSearchQuery, setUserSearchQuery] = (0,react.useState)('');
    const [userSearchResults, setUserSearchResults] = (0,react.useState)([]);
    const [isSearchingUsers, setIsSearchingUsers] = (0,react.useState)(false);
    // Settings state
    const [workspaceSettings, setWorkspaceSettings] = (0,react.useState)(newWorkspaceData.settings);
    // Screenplay upload state
    const [screenplayFile, setScreenplayFile] = (0,react.useState)(null);
    const [uploadingScreenplay, setUploadingScreenplay] = (0,react.useState)(false);
    const [uploadedScreenplay, setUploadedScreenplay] = (0,react.useState)(null);
    // Screenplay collaboration state
    const [screenplayAnnotations, setScreenplayAnnotations] = (0,react.useState)([]);
    const [newAnnotation, setNewAnnotation] = (0,react.useState)('');
    const [teamMembers, setTeamMembers] = (0,react.useState)([]);
    const [userScreenplays, setUserScreenplays] = (0,react.useState)([]);
    const [selectedScreenplayId, setSelectedScreenplayId] = (0,react.useState)(null);
    const [approvedContacts, setApprovedContacts] = (0,react.useState)([]);
    (0,react.useEffect)(() => {
        // Load workspaces and team members
        loadWorkspaces();
        loadTeamMembers();
        if (!currentUser)
            return;
        // Load all screenplays for this user (uploaded or as team member)
        const fetchScreenplays = async () => {
            try {
                const screenplaysRef = (0,index_esm/* collection */.rJ)(firebase.db, 'screenplays');
                const q1 = (0,index_esm/* query */.P)(screenplaysRef, (0,index_esm/* where */._M)('uploadedBy', '==', currentUser.uid));
                const snap1 = await (0,index_esm/* getDocs */.GG)(q1);
                const q2 = (0,index_esm/* query */.P)(screenplaysRef, (0,index_esm/* where */._M)('teamMembers', 'array-contains', currentUser.uid));
                const snap2 = await (0,index_esm/* getDocs */.GG)(q2);
                // Combine and deduplicate screenplays
                const allScreenplays = [...snap1.docs, ...snap2.docs];
                const uniqueScreenplays = Array.from(new Map(allScreenplays.map(doc => {
                    const data = doc.data();
                    // Ensure we have all required fields and handle timestamps
                    const screenplay = {
                        id: doc.id,
                        name: data.name || 'Untitled Screenplay',
                        type: data.type || 'pdf',
                        url: data.url || '',
                        uploadedBy: data.uploadedBy,
                        teamMembers: data.teamMembers || [],
                        size: data.size,
                        // Convert Firestore timestamps to Date objects
                        uploadedAt: data.uploadedAt?.toDate ? data.uploadedAt.toDate() : data.uploadedAt,
                        lastModified: data.lastModified?.toDate ? data.lastModified.toDate() : data.lastModified
                    };
                    return [doc.id, screenplay];
                })).values());
                setUserScreenplays(uniqueScreenplays);
            }
            catch (err) {
                console.error('Error fetching user screenplays:', err);
            }
        };
        fetchScreenplays();
    }, [currentUser, projectId]);
    (0,react.useEffect)(() => {
        if (!currentUser)
            return;
        const fetchApprovedContacts = async () => {
            try {
                const connectionsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'connections'), (0,index_esm/* where */._M)('status', '==', 'accepted'), (0,index_esm/* where */._M)('userId', '==', currentUser.uid));
                const reverseConnectionsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'connections'), (0,index_esm/* where */._M)('status', '==', 'accepted'), (0,index_esm/* where */._M)('connectedUserId', '==', currentUser.uid));
                const [directSnap, reverseSnap] = await Promise.all([
                    (0,index_esm/* getDocs */.GG)(connectionsQuery),
                    (0,index_esm/* getDocs */.GG)(reverseConnectionsQuery)
                ]);
                const directContacts = directSnap.docs.map(doc => doc.data().connectedUserId);
                const reverseContacts = reverseSnap.docs.map(doc => doc.data().userId);
                setApprovedContacts([...new Set([...directContacts, ...reverseContacts])]);
            }
            catch (error) {
                setApprovedContacts([]);
            }
        };
        fetchApprovedContacts();
    }, [currentUser]);
    const loadWorkspaces = async () => {
        try {
            setLoading(true);
            setError(null);
            // Load real workspaces from Firestore
            const workspacesRef = (0,index_esm/* collection */.rJ)(firebase.db, 'workspaces');
            let q = (0,index_esm/* query */.P)(workspacesRef);
            if (projectId) {
                q = (0,index_esm/* query */.P)(workspacesRef, (0,index_esm/* where */._M)('projectId', '==', projectId));
            }
            const snap = await (0,index_esm/* getDocs */.GG)(q);
            const workspaceList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWorkspaces(workspaceList);
            if (workspaceList.length > 0) {
                setSelectedWorkspace(workspaceList[0]);
            }
            else {
                setSelectedWorkspace(null);
            }
        }
        catch (error) {
            console.error('Error loading workspaces:', error);
            setError('Failed to load workspaces');
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
        // Do NOT clear userSearchResults here; keep previous results while loading
        try {
            let allResults = [];
            if (approvedContacts.length > 0) {
                // Fetch all approved contacts' crew profiles in chunks of 10
                const crewProfilesRef = (0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles');
                const approvedChunks = [];
                for (let i = 0; i < approvedContacts.length; i += 10) {
                    approvedChunks.push(approvedContacts.slice(i, i + 10));
                }
                for (const chunk of approvedChunks) {
                    const q = (0,index_esm/* query */.P)(crewProfilesRef, (0,index_esm/* where */._M)('uid', 'in', chunk));
                    const snap = await (0,index_esm/* getDocs */.GG)(q);
                    allResults = allResults.concat(snap.docs.map(doc => ({
                        id: doc.id,
                        name: doc.data().name || doc.data().displayName || `Crew Member ${doc.id.slice(-4)}`,
                        email: doc.data().email || '',
                        avatar: doc.data().profileImageUrl || doc.data().avatarUrl || '',
                        role: doc.data().jobTitles?.[0]?.title || 'Crew Member',
                        company: doc.data().company || ''
                    })));
                }
            }
            else {
                // Fallback: search all crew profiles
                const crewProfilesRef = (0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles');
                const snap = await (0,index_esm/* getDocs */.GG)(crewProfilesRef);
                console.log('[CollabModal] Fallback: found', snap.docs.length, 'crew profiles in Firestore');
                allResults = snap.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name || doc.data().displayName || `Crew Member ${doc.id.slice(-4)}`,
                    email: doc.data().email || '',
                    avatar: doc.data().profileImageUrl || doc.data().avatarUrl || '',
                    role: doc.data().jobTitles?.[0]?.title || 'Crew Member',
                    company: doc.data().company || ''
                }));
                if (allResults.length === 0) {
                    console.warn('[CollabModal] No crew profiles found in Firestore crewProfiles collection.');
                }
            }
            // Filter by search query
            const filtered = allResults.filter(user => (user.name || '').toLowerCase().includes(queryStr.toLowerCase()) ||
                (user.email || '').toLowerCase().includes(queryStr.toLowerCase()) ||
                (user.role || '').toLowerCase().includes(queryStr.toLowerCase()) ||
                (user.company || '').toLowerCase().includes(queryStr.toLowerCase()));
            console.log('[CollabModal] Filtered users after search:', filtered.length, filtered.map(u => u.name));
            setUserSearchResults(filtered);
        }
        catch (error) {
            console.error('[CollabModal] Error searching users:', error);
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
    const addUserToWorkspace = (user) => {
        if (!selectedWorkspace)
            return;
        const newMember = {
            userId: user.id,
            email: user.email,
            role: 'member',
            joinedAt: new Date(),
            permissions: ['read', 'write'],
            isOnline: false,
            lastSeen: new Date()
        };
        setWorkspaces(prev => prev.map(ws => ws.id === selectedWorkspace.id
            ? { ...ws, members: [...ws.members, newMember] }
            : ws));
        setSelectedWorkspace(prev => prev ? {
            ...prev,
            members: [...prev.members, newMember]
        } : null);
        setShowAddMemberModal(false);
        setUserSearchQuery('');
        setUserSearchResults([]);
        dist/* toast */.oR.success(`Added ${user.name} to workspace successfully!`);
    };
    // Workspace creation handlers
    const handleCreateWorkspaceStep = () => {
        if (workspaceCreationStep === 'details') {
            if (!newWorkspaceData.name.trim()) {
                dist/* toast */.oR.error('Please enter a workspace name');
                return;
            }
            setWorkspaceCreationStep('members');
        }
        else if (workspaceCreationStep === 'members') {
            setWorkspaceCreationStep('settings');
        }
        else if (workspaceCreationStep === 'settings') {
            handleCreateWorkspace();
        }
    };
    const handleCreateWorkspace = () => {
        try {
            console.log('Creating workspace with data:', newWorkspaceData);
            const newWorkspace = {
                id: Date.now().toString(),
                projectId: projectId || 'default-project',
                name: newWorkspaceData.name.trim(),
                description: newWorkspaceData.description.trim(),
                type: newWorkspaceData.type,
                members: [
                    {
                        userId: currentUser?.uid || 'default-user',
                        role: 'admin',
                        joinedAt: new Date(),
                        permissions: ['read', 'write'],
                        isOnline: true,
                        lastSeen: new Date()
                    },
                    ...newWorkspaceData.selectedMembers.map(user => ({
                        userId: user.id,
                        email: user.email,
                        role: 'member',
                        joinedAt: new Date(),
                        permissions: ['read', 'write'],
                        isOnline: false,
                        lastSeen: new Date()
                    }))
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
                settings: newWorkspaceData.settings
            };
            setWorkspaces(prev => [...prev, newWorkspace]);
            setSelectedWorkspace(newWorkspace);
            // Reset form
            setNewWorkspaceData({
                name: '',
                description: '',
                type: 'project',
                selectedMembers: [],
                settings: {
                    allowGuestAccess: false,
                    requireApproval: true,
                    autoArchive: false,
                    retentionDays: 365,
                    maxFileSize: 100 * 1024 * 1024,
                    allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
                }
            });
            setWorkspaceCreationStep('details');
            setShowCreateWorkspaceModal(false);
            dist/* toast */.oR.success(`Workspace "${newWorkspaceData.name.trim()}" created successfully!`);
        }
        catch (error) {
            console.error('Error in handleCreateWorkspace:', error);
            dist/* toast */.oR.error('Failed to create workspace. Please try again.');
        }
    };
    const handleAddMemberToCreation = (user) => {
        if (!newWorkspaceData.selectedMembers.find(m => m.id === user.id)) {
            setNewWorkspaceData(prev => ({
                ...prev,
                selectedMembers: [...prev.selectedMembers, user]
            }));
        }
    };
    const handleRemoveMemberFromCreation = (userId) => {
        setNewWorkspaceData(prev => ({
            ...prev,
            selectedMembers: prev.selectedMembers.filter(m => m.id !== userId)
        }));
    };
    const handleUpdateWorkspaceSettings = () => {
        if (!selectedWorkspace)
            return;
        setWorkspaces(prev => prev.map(ws => ws.id === selectedWorkspace.id
            ? { ...ws, settings: workspaceSettings }
            : ws));
        setSelectedWorkspace(prev => prev ? {
            ...prev,
            settings: workspaceSettings
        } : null);
        setShowSettingsModal(false);
        dist/* toast */.oR.success('Workspace settings updated successfully!');
    };
    // Video call functionality will be added in a future update
    // Handle joining a workspace
    const handleJoinWorkspace = (workspaceId) => {
        try {
            console.log('Join workspace clicked:', workspaceId);
            const workspace = workspaces.find(ws => ws.id === workspaceId);
            if (workspace) {
                setSelectedWorkspace(workspace);
                dist/* toast */.oR.success(`Successfully joined workspace: ${workspace.name}`);
            }
        }
        catch (error) {
            console.error('Error in handleJoinWorkspace:', error);
        }
    };
    // Handle workspace settings
    const handleWorkspaceSettings = (workspaceId) => {
        try {
            console.log('Workspace settings clicked:', workspaceId);
            const workspace = workspaces.find(ws => ws.id === workspaceId);
            if (workspace) {
                setWorkspaceSettings(workspace.settings);
                setShowSettingsModal(true);
            }
        }
        catch (error) {
            console.error('Error in handleWorkspaceSettings:', error);
        }
    };
    // Screenplay upload handler
    const handleScreenplayUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !currentUser)
            return;
        setScreenplayFile(file);
        setUploadingScreenplay(true);
        try {
            // Upload file to storage
            const storageRef = (0,esm_index_esm/* ref */.KR)(firebase/* storage */.IG, `screenplays/${Date.now()}_${file.name}`);
            const snapshot = await (0,esm_index_esm/* uploadBytes */.D)(storageRef, file);
            const downloadURL = await (0,esm_index_esm/* getDownloadURL */.qk)(snapshot.ref);
            // Create screenplay data with proper typing
            const now = new Date();
            const screenplayData = {
                name: file.name,
                type: file.type || 'application/octet-stream',
                url: downloadURL,
                uploadedBy: currentUser.uid,
                teamMembers: [currentUser.uid],
                size: file.size,
                uploadedAt: now,
                lastModified: now
            };
            // Save to Firestore
            const docRef = await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'screenplays'), screenplayData);
            // Create the complete screenplay object with ID
            const uploadedScreenplay = {
                ...screenplayData,
                id: docRef.id
            };
            // Update state
            setUploadedScreenplay(uploadedScreenplay);
            setScreenplayFile(null);
            // Update the screenplays list
            setUserScreenplays(prev => [...prev, uploadedScreenplay]);
            dist/* toast */.oR.success(`${file.name} uploaded successfully!`);
            loadTeamMembers();
        }
        catch (error) {
            console.error('Error uploading screenplay:', error);
            dist/* toast */.oR.error('Failed to upload screenplay');
        }
        finally {
            setUploadingScreenplay(false);
            e.target.value = '';
        }
    };
    const loadTeamMembers = async () => {
        try {
            if (!selectedWorkspace) {
                setTeamMembers([]);
                return;
            }
            // Load real team members from Firestore crewProfiles collection
            const memberIds = selectedWorkspace.members?.map(m => m.userId) || [];
            if (memberIds.length === 0) {
                setTeamMembers([]);
                return;
            }
            const crewProfilesRef = (0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles');
            const chunks = [];
            for (let i = 0; i < memberIds.length; i += 10) {
                chunks.push(memberIds.slice(i, i + 10));
            }
            let allMembers = [];
            for (const chunk of chunks) {
                const q = (0,index_esm/* query */.P)(crewProfilesRef, (0,index_esm/* where */._M)('uid', 'in', chunk));
                const snap = await (0,index_esm/* getDocs */.GG)(q);
                allMembers = allMembers.concat(snap.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name || doc.data().displayName || `Crew Member ${doc.id.slice(-4)}`,
                    email: doc.data().email || '',
                    role: doc.data().jobTitles?.[0]?.title || 'Crew Member',
                    avatar: doc.data().profileImageUrl || doc.data().avatarUrl || '',
                    isOnline: doc.data().isOnline || false
                })));
            }
            setTeamMembers(allMembers);
        }
        catch (error) {
            console.error('Error loading team members:', error);
            setTeamMembers([]);
        }
    };
    // Add annotation to screenplay (reference version)
    const addAnnotation = async () => {
        if (!newAnnotation.trim() || !uploadedScreenplay)
            return;
        try {
            const annotationData = {
                screenplayId: uploadedScreenplay.id,
                userId: currentUser?.uid || 'unknown',
                userName: currentUser?.displayName || 'Anonymous',
                annotation: newAnnotation.trim(),
                timestamp: new Date(),
                projectId: projectId || 'default-project'
            };
            await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'screenplayAnnotations'), annotationData);
            setScreenplayAnnotations(prev => [...prev, {
                    id: Date.now().toString(),
                    userId: currentUser?.uid || 'unknown',
                    userName: currentUser?.displayName || 'Anonymous',
                    annotation: newAnnotation.trim(),
                    timestamp: new Date()
                }]);
            setNewAnnotation('');
            setShowScreenplayViewer(true);
            dist/* toast */.oR.success('Annotation added successfully!');
        }
        catch (error) {
            console.error('Error adding annotation:', error);
            dist/* toast */.oR.error('Failed to add annotation');
        }
    };
    // Load screenplay annotations (reference version)
    const loadAnnotations = async () => {
        if (!uploadedScreenplay)
            return;
        try {
            const q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'screenplayAnnotations'), (0,index_esm/* where */._M)('screenplayId', '==', uploadedScreenplay.id), (0,index_esm/* orderBy */.My)('timestamp', 'desc'));
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(q);
            const annotations = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setScreenplayAnnotations(annotations);
        }
        catch (error) {
            console.error('Error loading annotations:', error);
        }
    };
    const formatTimeAgo = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 60)
            return `${minutes}m ago`;
        if (hours < 24)
            return `${hours}h ago`;
        return `${days}d ago`;
    };
    const handleGenerateReport = () => {
        // Navigate to the breakdown reports component
        setActiveTab('screenplays');
        // You can add additional logic here to generate a comprehensive report
        // For now, we'll just show a toast notification
        dist/* toast */.oR.success('Generating screenplay breakdown report...');
        // In a real implementation, you might want to:
        // 1. Collect all annotations and tags
        // 2. Generate a PDF report
        // 3. Include breakdown elements
        // 4. Add analytics and insights
    };
    // No-op: upload is handled by handleScreenplayUpload
    function handleUploadScreenplay() {
        // Upload is handled by handleScreenplayUpload via file input
    }
    const handleDeleteScreenplay = async (screenplayId) => {
        if (window.confirm('Are you sure you want to delete this screenplay?')) {
            try {
                await (0,index_esm/* deleteDoc */.kd)((0,index_esm.doc)(firebase.db, 'screenplays', screenplayId));
                dist/* toast */.oR.success('Screenplay deleted successfully');
                // Refresh the screenplays list
                loadUserScreenplays();
            }
            catch (error) {
                console.error('Error deleting screenplay:', error);
                dist/* toast */.oR.error('Failed to delete screenplay');
            }
        }
    };
    const loadUserScreenplays = async () => {
        if (!currentUser)
            return;
        try {
            const screenplaysRef = (0,index_esm/* collection */.rJ)(firebase.db, 'screenplays');
            // Query 1: uploadedBy == currentUser.uid
            const q1 = (0,index_esm/* query */.P)(screenplaysRef, (0,index_esm/* where */._M)('uploadedBy', '==', currentUser.uid));
            const snap1 = await (0,index_esm/* getDocs */.GG)(q1);
            // Query 2: teamMembers array-contains currentUser.uid
            const q2 = (0,index_esm/* query */.P)(screenplaysRef, (0,index_esm/* where */._M)('teamMembers', 'array-contains', currentUser.uid));
            const snap2 = await (0,index_esm/* getDocs */.GG)(q2);
            // Combine and deduplicate screenplays
            const allScreenplays = [...snap1.docs, ...snap2.docs];
            const uniqueScreenplays = Array.from(new Map(allScreenplays.map(doc => {
                const data = doc.data();
                // Ensure we have all required fields and handle timestamps
                const screenplay = {
                    id: doc.id,
                    name: data.name || 'Untitled Screenplay',
                    type: data.type || 'pdf',
                    url: data.url || '',
                    uploadedBy: data.uploadedBy,
                    teamMembers: data.teamMembers || [],
                    size: data.size,
                    // Convert Firestore timestamps to Date objects
                    uploadedAt: data.uploadedAt?.toDate ? data.uploadedAt.toDate() : data.uploadedAt,
                    lastModified: data.lastModified?.toDate ? data.lastModified.toDate() : data.lastModified
                };
                return [doc.id, screenplay];
            })).values());
            setUserScreenplays(uniqueScreenplays);
        }
        catch (err) {
            console.error('Error fetching user screenplays:', err);
        }
    };
    // Open screenplay viewer modal (reference version)
    const openScreenplayViewer = (screenplay) => {
        setSelectedScreenplayId(screenplay.id);
        setShowScreenplayModal(true);
    };
    // Delete workspace handler
    const handleDeleteWorkspace = (workspaceId) => {
        if (window.confirm('Are you sure you want to delete this workspace and all its data? This action cannot be undone.')) {
            setWorkspaces(prev => prev.filter(ws => ws.id !== workspaceId));
            if (selectedWorkspace?.id === workspaceId) {
                setSelectedWorkspace(null);
            }
        }
    };
    const renderWorkspacesTab = () => ((0,jsx_runtime.jsxs)("div", { className: "workspaces-tab", children: [(0,jsx_runtime.jsxs)("div", { className: "workspaces-header", children: [(0,jsx_runtime.jsx)("h2", { children: "Workspaces" }), (0,jsx_runtime.jsxs)("button", { className: "create-workspace-btn", onClick: () => setShowCreateWorkspaceModal(true), children: [(0,jsx_runtime.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [(0,jsx_runtime.jsx)("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), (0,jsx_runtime.jsx)("line", { x1: "5", y1: "12", x2: "19", y2: "12" })] }), "Create Workspace"] })] }), (0,jsx_runtime.jsx)("div", { className: "workspaces-grid", children: workspaces.map(workspace => ((0,jsx_runtime.jsxs)("div", { className: `workspace-card ${selectedWorkspace?.id === workspace.id ? 'selected' : ''}`, onClick: () => setSelectedWorkspace(workspace), children: [(0,jsx_runtime.jsx)("button", { className: "workspace-settings-gear", title: "Settings", "aria-label": "Settings", onClick: e => { e.stopPropagation(); handleWorkspaceSettings(workspace.id); }, style: { position: 'absolute', top: 16, right: 48, background: 'none', border: 'none', padding: 0, cursor: 'pointer', zIndex: 2 }, children: (0,jsx_runtime.jsxs)("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "#888", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0,jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "3" }), (0,jsx_runtime.jsx)("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })] }) }), (0,jsx_runtime.jsx)("button", { className: "workspace-delete-btn", title: "Delete Workspace", "aria-label": "Delete Workspace", onClick: e => { e.stopPropagation(); handleDeleteWorkspace(workspace.id); }, style: { position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', padding: 0, cursor: 'pointer', zIndex: 2 }, children: (0,jsx_runtime.jsxs)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "#ef4444", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0,jsx_runtime.jsx)("polyline", { points: "3 6 5 6 21 6" }), (0,jsx_runtime.jsx)("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" }), (0,jsx_runtime.jsx)("line", { x1: "10", y1: "11", x2: "10", y2: "17" }), (0,jsx_runtime.jsx)("line", { x1: "14", y1: "11", x2: "14", y2: "17" })] }) }), (0,jsx_runtime.jsx)("div", { className: "workspace-header", children: (0,jsx_runtime.jsxs)("div", { className: "workspace-title-section", children: [(0,jsx_runtime.jsx)("div", { className: "workspace-icon", children: (0,jsx_runtime.jsxs)("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [(0,jsx_runtime.jsx)("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }), (0,jsx_runtime.jsx)("polyline", { points: "9,22 9,12 15,12 15,22" })] }) }), (0,jsx_runtime.jsxs)("div", { className: "workspace-info", children: [(0,jsx_runtime.jsx)("h3", { className: "workspace-title", style: { color: selectedWorkspace?.id === workspace.id ? '#1a1a1a' : '#fff', fontWeight: 600 }, children: workspace.name }), (0,jsx_runtime.jsx)("span", { className: `workspace-type ${workspace.type}`, style: { color: selectedWorkspace?.id === workspace.id ? '#666' : '#fff', background: selectedWorkspace?.id === workspace.id ? '#f0f0f0' : 'rgba(255,255,255,0.15)' }, children: workspace.type })] })] }) }), (0,jsx_runtime.jsx)("p", { className: "workspace-description", style: { color: selectedWorkspace?.id === workspace.id ? '#666' : 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }, children: workspace.description }), (0,jsx_runtime.jsxs)("div", { className: "workspace-stats", children: [(0,jsx_runtime.jsxs)("div", { className: "stat", style: { color: selectedWorkspace?.id === workspace.id ? '#666' : 'rgba(255,255,255,0.85)' }, children: [(0,jsx_runtime.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [(0,jsx_runtime.jsx)("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), (0,jsx_runtime.jsx)("circle", { cx: "9", cy: "7", r: "4" }), (0,jsx_runtime.jsx)("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), (0,jsx_runtime.jsx)("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })] }), (0,jsx_runtime.jsx)("span", { className: "stat-value", style: { color: selectedWorkspace?.id === workspace.id ? '#333' : '#fff', fontWeight: 600 }, children: workspace.members.length }), (0,jsx_runtime.jsx)("span", { className: "stat-label", style: { color: selectedWorkspace?.id === workspace.id ? '#666' : 'rgba(255,255,255,0.85)' }, children: "Members" })] }), (0,jsx_runtime.jsxs)("div", { className: "stat", style: { color: selectedWorkspace?.id === workspace.id ? '#666' : 'rgba(255,255,255,0.85)' }, children: [(0,jsx_runtime.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [(0,jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "10" }), (0,jsx_runtime.jsx)("polyline", { points: "12,6 12,12 16,14" })] }), (0,jsx_runtime.jsx)("span", { className: "stat-value", style: { color: selectedWorkspace?.id === workspace.id ? '#333' : '#fff', fontWeight: 600 }, children: workspace.members.filter(m => m.isOnline).length }), (0,jsx_runtime.jsx)("span", { className: "stat-label", style: { color: selectedWorkspace?.id === workspace.id ? '#666' : 'rgba(255,255,255,0.85)' }, children: "Online" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "workspace-actions", children: [(0,jsx_runtime.jsxs)("button", { className: "btn-primary", onClick: (e) => {
                                        e.stopPropagation();
                                        handleJoinWorkspace(workspace.id);
                                    }, children: [(0,jsx_runtime.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [(0,jsx_runtime.jsx)("path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }), (0,jsx_runtime.jsx)("polyline", { points: "10,17 15,12 10,7" }), (0,jsx_runtime.jsx)("line", { x1: "15", y1: "12", x2: "3", y2: "12" })] }), "Join"] }), (0,jsx_runtime.jsxs)("button", { className: "btn-secondary", onClick: (e) => {
                                        e.stopPropagation();
                                        setShowAddMemberModal(true);
                                    }, children: [(0,jsx_runtime.jsxs)("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [(0,jsx_runtime.jsx)("path", { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), (0,jsx_runtime.jsx)("circle", { cx: "8.5", cy: "7", r: "4" }), (0,jsx_runtime.jsx)("line", { x1: "20", y1: "8", x2: "20", y2: "14" }), (0,jsx_runtime.jsx)("line", { x1: "23", y1: "11", x2: "17", y2: "11" })] }), "Add Member"] })] })] }, workspace.id))) }), showCreateWorkspaceModal && ((0,jsx_runtime.jsx)("div", { className: "modal-overlay", children: (0,jsx_runtime.jsxs)("div", { className: "modal-content", children: [(0,jsx_runtime.jsxs)("div", { className: "modal-header", children: [(0,jsx_runtime.jsx)("h3", { children: "Create New Workspace" }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                        setShowCreateWorkspaceModal(false);
                                        setWorkspaceCreationStep('details');
                                        setNewWorkspaceData({
                                            name: '',
                                            description: '',
                                            type: 'project',
                                            selectedMembers: [],
                                            settings: {
                                                allowGuestAccess: false,
                                                requireApproval: true,
                                                autoArchive: false,
                                                retentionDays: 365,
                                                maxFileSize: 100 * 1024 * 1024,
                                                allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png']
                                            }
                                        });
                                    }, className: "close-btn", children: "\u00D7" })] }), (0,jsx_runtime.jsxs)("div", { className: "modal-body", children: [workspaceCreationStep === 'details' && ((0,jsx_runtime.jsxs)("div", { className: "step-content", children: [(0,jsx_runtime.jsx)("h4", { children: "Step 1: Workspace Details" }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Workspace Name *" }), (0,jsx_runtime.jsx)("input", { type: "text", value: newWorkspaceData.name, onChange: (e) => setNewWorkspaceData(prev => ({ ...prev, name: e.target.value })), placeholder: "Enter workspace name", className: "form-input" })] }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Description" }), (0,jsx_runtime.jsx)("textarea", { value: newWorkspaceData.description, onChange: (e) => setNewWorkspaceData(prev => ({ ...prev, description: e.target.value })), placeholder: "Enter workspace description", className: "form-input", rows: 3 })] }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Workspace Type" }), (0,jsx_runtime.jsxs)("select", { value: newWorkspaceData.type, onChange: (e) => setNewWorkspaceData(prev => ({ ...prev, type: e.target.value })), className: "form-input", children: [(0,jsx_runtime.jsx)("option", { value: "project", children: "Project" }), (0,jsx_runtime.jsx)("option", { value: "department", children: "Department" }), (0,jsx_runtime.jsx)("option", { value: "general", children: "General" })] })] })] })), workspaceCreationStep === 'members' && ((0,jsx_runtime.jsxs)("div", { className: "step-content", children: [(0,jsx_runtime.jsx)("h4", { children: "Step 2: Add Members" }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Search Users" }), (0,jsx_runtime.jsx)(Collaboration_UserAutocomplete, { value: newWorkspaceData.selectedMembers, onChange: (users) => setNewWorkspaceData(prev => ({ ...prev, selectedMembers: users })), onSearch: handleUserSearchChange, options: userSearchResults, loading: isSearchingUsers, placeholder: "Search by name, email, or role..." })] })] })), workspaceCreationStep === 'settings' && ((0,jsx_runtime.jsxs)("div", { className: "step-content", children: [(0,jsx_runtime.jsx)("h4", { children: "Step 3: Workspace Settings" }), (0,jsx_runtime.jsx)("div", { className: "form-group", children: (0,jsx_runtime.jsxs)("label", { children: [(0,jsx_runtime.jsx)("input", { type: "checkbox", checked: newWorkspaceData.settings.allowGuestAccess, onChange: (e) => setNewWorkspaceData(prev => ({
                                                            ...prev,
                                                            settings: { ...prev.settings, allowGuestAccess: e.target.checked }
                                                        })) }), "Allow Guest Access"] }) }), (0,jsx_runtime.jsx)("div", { className: "form-group", children: (0,jsx_runtime.jsxs)("label", { children: [(0,jsx_runtime.jsx)("input", { type: "checkbox", checked: newWorkspaceData.settings.requireApproval, onChange: (e) => setNewWorkspaceData(prev => ({
                                                            ...prev,
                                                            settings: { ...prev.settings, requireApproval: e.target.checked }
                                                        })) }), "Require Approval for New Members"] }) }), (0,jsx_runtime.jsx)("div", { className: "form-group", children: (0,jsx_runtime.jsxs)("label", { children: [(0,jsx_runtime.jsx)("input", { type: "checkbox", checked: newWorkspaceData.settings.autoArchive, onChange: (e) => setNewWorkspaceData(prev => ({
                                                            ...prev,
                                                            settings: { ...prev.settings, autoArchive: e.target.checked }
                                                        })) }), "Auto-archive Inactive Content"] }) }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Retention Period (days)" }), (0,jsx_runtime.jsx)("input", { type: "number", value: newWorkspaceData.settings.retentionDays, onChange: (e) => setNewWorkspaceData(prev => ({
                                                        ...prev,
                                                        settings: { ...prev.settings, retentionDays: parseInt(e.target.value) || 365 }
                                                    })), className: "form-input", min: "30", max: "3650" })] })] }))] }), (0,jsx_runtime.jsxs)("div", { className: "modal-footer", style: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1.5rem 2rem 1rem 2rem' }, children: [(0,jsx_runtime.jsx)("button", { className: "btn-secondary", onClick: () => {
                                        if (workspaceCreationStep === 'details') {
                                            setShowCreateWorkspaceModal(false);
                                            setWorkspaceCreationStep('details');
                                        }
                                        else if (workspaceCreationStep === 'members') {
                                            setWorkspaceCreationStep('details');
                                        }
                                        else if (workspaceCreationStep === 'settings') {
                                            setWorkspaceCreationStep('members');
                                        }
                                    }, children: "Cancel" }), (0,jsx_runtime.jsx)("button", { className: "btn-primary", onClick: handleCreateWorkspaceStep, children: workspaceCreationStep === 'settings' ? 'Create Workspace' : 'Next' })] })] }) })), showAddMemberModal && ((0,jsx_runtime.jsx)("div", { className: "modal-overlay", children: (0,jsx_runtime.jsxs)("div", { className: "modal-content", children: [(0,jsx_runtime.jsxs)("div", { className: "modal-header", children: [(0,jsx_runtime.jsx)("h3", { children: "Add Member to Workspace" }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                        setShowAddMemberModal(false);
                                        setUserSearchQuery('');
                                        setUserSearchResults([]);
                                    }, className: "close-btn", "aria-label": "Close", children: "\u00D7" })] }), (0,jsx_runtime.jsx)("div", { className: "modal-body", children: (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Search Users" }), (0,jsx_runtime.jsx)(Collaboration_UserAutocomplete, { value: selectedWorkspace ? selectedWorkspace.members.map(m => ({
                                            id: m.userId,
                                            name: m.email || m.userId,
                                            email: m.email || '',
                                            avatar: '',
                                            role: m.role,
                                            company: ''
                                        })) : [], onChange: (users) => {
                                            // Only add new users
                                            const newUsers = users.filter((u) => !(selectedWorkspace && selectedWorkspace.members.some(m => m.userId === u.id)));
                                            newUsers.forEach((user) => addUserToWorkspace(user));
                                            setShowAddMemberModal(false);
                                            setUserSearchQuery('');
                                            setUserSearchResults([]);
                                        }, onSearch: handleUserSearchChange, options: userSearchResults, loading: isSearchingUsers, placeholder: "Search by name, email, or role..." }), isSearchingUsers && (0,jsx_runtime.jsx)("div", { className: "searching-indicator", children: "Searching..." }), !isSearchingUsers && userSearchQuery.trim() && userSearchResults.length === 0 && (0,jsx_runtime.jsx)("div", { className: "searching-indicator", children: "No friends found." }), !isSearchingUsers && !userSearchQuery.trim() && (0,jsx_runtime.jsx)("div", { className: "searching-indicator", children: "Start typing to search for users" })] }) })] }) })), showSettingsModal && ((0,jsx_runtime.jsx)("div", { className: "modal-overlay", children: (0,jsx_runtime.jsxs)("div", { className: "modal-content", children: [(0,jsx_runtime.jsxs)("div", { className: "modal-header", children: [(0,jsx_runtime.jsx)("h3", { children: "Workspace Settings" }), (0,jsx_runtime.jsx)("button", { onClick: () => setShowSettingsModal(false), className: "close-btn", children: "\u00D7" })] }), (0,jsx_runtime.jsxs)("div", { className: "modal-body", children: [(0,jsx_runtime.jsx)("div", { className: "form-group", children: (0,jsx_runtime.jsxs)("label", { children: [(0,jsx_runtime.jsx)("input", { type: "checkbox", checked: workspaceSettings.allowGuestAccess, onChange: (e) => setWorkspaceSettings(prev => ({ ...prev, allowGuestAccess: e.target.checked })) }), "Allow Guest Access"] }) }), (0,jsx_runtime.jsx)("div", { className: "form-group", children: (0,jsx_runtime.jsxs)("label", { children: [(0,jsx_runtime.jsx)("input", { type: "checkbox", checked: workspaceSettings.requireApproval, onChange: (e) => setWorkspaceSettings(prev => ({ ...prev, requireApproval: e.target.checked })) }), "Require Approval for New Members"] }) }), (0,jsx_runtime.jsx)("div", { className: "form-group", children: (0,jsx_runtime.jsxs)("label", { children: [(0,jsx_runtime.jsx)("input", { type: "checkbox", checked: workspaceSettings.autoArchive, onChange: (e) => setWorkspaceSettings(prev => ({ ...prev, autoArchive: e.target.checked })) }), "Auto-archive Inactive Content"] }) }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Retention Period (days)" }), (0,jsx_runtime.jsx)("input", { type: "number", value: workspaceSettings.retentionDays, onChange: (e) => setWorkspaceSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) || 365 })), className: "form-input", min: "30", max: "3650" })] }), (0,jsx_runtime.jsxs)("div", { className: "form-group", children: [(0,jsx_runtime.jsx)("label", { children: "Max File Size (MB)" }), (0,jsx_runtime.jsx)("input", { type: "number", value: Math.round(workspaceSettings.maxFileSize / (1024 * 1024)), onChange: (e) => setWorkspaceSettings(prev => ({
                                                ...prev,
                                                maxFileSize: (parseInt(e.target.value) || 100) * 1024 * 1024
                                            })), className: "form-input", min: "1", max: "1000" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "modal-footer", style: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1.5rem 2rem 1rem 2rem' }, children: [(0,jsx_runtime.jsx)("button", { className: "btn-secondary", onClick: () => setShowSettingsModal(false), children: "Cancel" }), (0,jsx_runtime.jsx)("button", { className: "btn-primary", onClick: handleUpdateWorkspaceSettings, children: "Save Settings" })] })] }) }))] }));
    const renderTasksTab = () => ((0,jsx_runtime.jsxs)("div", { className: "tasks-tab", children: [(0,jsx_runtime.jsxs)("div", { className: "tasks-header", children: [(0,jsx_runtime.jsx)("h2", { children: "Tasks" }), (0,jsx_runtime.jsx)("p", { children: "Manage collaborative tasks and project workflows" })] }), (0,jsx_runtime.jsx)("div", { className: "tasks-content", children: (0,jsx_runtime.jsx)(components_CollaborativeTasks_CollaborativeTasksHub, { projectId: projectId || 'default-project' }) })] }));
    const renderScreenplaysTab = () => ((0,jsx_runtime.jsxs)("div", { className: "screenplays-tab", children: [(0,jsx_runtime.jsxs)("div", { className: "screenplays-header", children: [(0,jsx_runtime.jsx)("h2", { children: "Screenplays" }), (0,jsx_runtime.jsx)("p", { children: "Upload and collaborate on screenplay breakdowns" })] }), (0,jsx_runtime.jsxs)("div", { className: "screenplays-content", children: [(0,jsx_runtime.jsx)("div", { className: "bg-white rounded-lg shadow-md p-6 mb-6", children: (0,jsx_runtime.jsxs)("label", { htmlFor: "screenplay-upload", style: {
                                display: 'inline-block',
                                background: '#1976d2',
                                color: '#fff',
                                padding: '0.75rem 2rem',
                                borderRadius: '6px',
                                fontWeight: 600,
                                cursor: uploadingScreenplay ? 'not-allowed' : 'pointer',
                                opacity: uploadingScreenplay ? 0.6 : 1,
                                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
                                marginBottom: 16
                            }, children: [uploadingScreenplay ? 'Uploading...' : 'Upload Screenplay', (0,jsx_runtime.jsx)("input", { id: "screenplay-upload", type: "file", accept: ".pdf,.doc,.docx,.txt", style: { display: 'none' }, onChange: handleScreenplayUpload, disabled: uploadingScreenplay })] }) }), (0,jsx_runtime.jsx)("div", { className: "screenplays-list bg-white rounded-lg shadow-md p-6", children: userScreenplays.length === 0 ? ((0,jsx_runtime.jsx)("div", { style: { color: '#888', textAlign: 'center', padding: '2rem 0' }, children: "No screenplays uploaded yet." })) : ((0,jsx_runtime.jsx)("ul", { style: { listStyle: 'none', padding: 0, margin: 0 }, children: userScreenplays.map(screenplay => ((0,jsx_runtime.jsxs)("li", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: '1px solid #eee'
                                }, children: [(0,jsx_runtime.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [(0,jsx_runtime.jsx)("span", { style: { fontWeight: 600, color: '#222' }, children: screenplay.name }), (0,jsx_runtime.jsx)("span", { style: { color: '#888', fontSize: '0.95em', marginLeft: 12 }, children: screenplay.type })] }), (0,jsx_runtime.jsxs)("div", { style: { display: 'flex', gap: 12 }, children: [(0,jsx_runtime.jsx)("button", { className: "btn-secondary", style: { padding: '0.4rem 1rem', fontSize: '0.95em' }, onClick: () => openScreenplayViewer(screenplay), children: "View" }), (0,jsx_runtime.jsx)("button", { className: "btn-danger", style: { padding: '0.4rem 1rem', fontSize: '0.95em' }, onClick: () => handleDeleteScreenplay(screenplay.id), children: "Delete" })] })] }, screenplay.id))) })) })] })] }));
    const renderTabContent = () => {
        switch (activeTab) {
            case 'workspaces':
                return renderWorkspacesTab();
            case 'tasks':
                return renderTasksTab();
            case 'screenplays':
                return renderScreenplaysTab();
            default:
                return ((0,jsx_runtime.jsx)("div", { className: "error-content", children: (0,jsx_runtime.jsx)("p", { children: "Please try refreshing the page." }) }));
        }
    };
    if (loading) {
        return ((0,jsx_runtime.jsx)("div", { className: "collaboration-hub loading", children: (0,jsx_runtime.jsx)("div", { className: "loading-spinner", children: "Loading..." }) }));
    }
    if (error) {
        return ((0,jsx_runtime.jsx)("div", { className: "collaboration-hub error", children: (0,jsx_runtime.jsxs)("div", { className: "error-content", children: [(0,jsx_runtime.jsx)("h2", { children: "Error" }), (0,jsx_runtime.jsx)("p", { children: error }), (0,jsx_runtime.jsx)("button", { onClick: () => window.location.reload(), children: "Refresh Page" })] }) }));
    }
    console.log('Rendering CollaborationHub with:', {
        activeTab,
        workspacesCount: workspaces.length,
        selectedWorkspace: selectedWorkspace?.name
    });
    return ((0,jsx_runtime.jsx)(CollaborationErrorBoundary, { children: (0,jsx_runtime.jsxs)("div", { className: "collaboration-hub", children: [(0,jsx_runtime.jsxs)("div", { className: "collaboration-header", children: [(0,jsx_runtime.jsx)("h1", { children: "Collaboration Hub" }), (0,jsx_runtime.jsx)("div", { className: "header-actions" })] }), (0,jsx_runtime.jsxs)("div", { className: "collaboration-content", children: [(0,jsx_runtime.jsx)("div", { className: "collaboration-sidebar", children: (0,jsx_runtime.jsxs)("nav", { className: "collaboration-nav", children: [(0,jsx_runtime.jsxs)("button", { className: `nav-item ${activeTab === 'workspaces' ? 'active' : ''}`, onClick: () => setActiveTab('workspaces'), children: [(0,jsx_runtime.jsxs)("svg", { className: "nav-icon", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [(0,jsx_runtime.jsx)("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }), (0,jsx_runtime.jsx)("polyline", { points: "9,22 9,12 15,12 15,22" })] }), (0,jsx_runtime.jsx)("span", { className: "nav-label", children: "Workspaces" })] }), (0,jsx_runtime.jsxs)("button", { className: `nav-item ${activeTab === 'tasks' ? 'active' : ''}`, onClick: () => setActiveTab('tasks'), children: [(0,jsx_runtime.jsxs)("svg", { className: "nav-icon", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [(0,jsx_runtime.jsx)("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), (0,jsx_runtime.jsx)("polyline", { points: "22,4 12,14.01 9,11.01" })] }), (0,jsx_runtime.jsx)("span", { className: "nav-label", children: "Tasks" })] }), (0,jsx_runtime.jsxs)("button", { className: `nav-item ${activeTab === 'screenplays' ? 'active' : ''}`, onClick: () => setActiveTab('screenplays'), children: [(0,jsx_runtime.jsxs)("svg", { className: "nav-icon", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [(0,jsx_runtime.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), (0,jsx_runtime.jsx)("polyline", { points: "14,2 14,8 20,8" }), (0,jsx_runtime.jsx)("line", { x1: "16", y1: "13", x2: "8", y2: "13" }), (0,jsx_runtime.jsx)("line", { x1: "16", y1: "17", x2: "8", y2: "17" }), (0,jsx_runtime.jsx)("polyline", { points: "10,9 9,9 8,9" })] }), (0,jsx_runtime.jsx)("span", { className: "nav-label", children: "Screenplays" })] })] }) }), (0,jsx_runtime.jsx)("div", { className: "collaboration-main", children: renderTabContent() })] }), showScreenplayViewer && uploadedScreenplay && ((0,jsx_runtime.jsx)(components_Collaboration_ScreenplayViewer, { screenplay: {
                        id: uploadedScreenplay.id || '',
                        name: uploadedScreenplay.name,
                        url: uploadedScreenplay.url,
                        type: uploadedScreenplay.type
                    }, projectId: projectId || 'default-project', onClose: () => setShowScreenplayViewer(false), onGenerateReport: handleGenerateReport })), showScreenplayModal && selectedScreenplayId && ((0,jsx_runtime.jsx)("div", { className: "screenplay-modal-overlay", onScroll: (e) => e.stopPropagation(), onWheel: (e) => e.stopPropagation(), children: (0,jsx_runtime.jsx)("div", { className: "screenplay-modal", children: (0,jsx_runtime.jsx)("div", { className: "modal-content", children: (() => {
                                const selectedScreenplay = userScreenplays.find(s => s.id === selectedScreenplayId);
                                if (!selectedScreenplay)
                                    return null;
                                return ((0,jsx_runtime.jsx)(components_Collaboration_ScreenplayViewer, { screenplay: {
                                        id: selectedScreenplay.id,
                                        name: selectedScreenplay.name,
                                        url: selectedScreenplay.url,
                                        type: selectedScreenplay.type
                                    }, projectId: projectId || 'default-project', onClose: () => {
                                        setShowScreenplayModal(false);
                                        setSelectedScreenplayId(null);
                                    }, onGenerateReport: handleGenerateReport }));
                            })() }) }) }))] }) }));
};
/* harmony default export */ const components_Collaboration_CollaborationHub = (CollaborationHub_CollaborationHub);

;// ./src/pages/CollaborationPage.tsx


const CollaborationPage = () => {
    return (0,jsx_runtime.jsx)(components_Collaboration_CollaborationHub, {});
};
/* harmony default export */ const pages_CollaborationPage = (CollaborationPage);


/***/ }),

/***/ 717:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 854:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 941:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 3251:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 4129:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 4318:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.collaboration-hub{display:flex;flex-direction:column;height:100vh;background:#fff;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-size:14px;line-height:1.5}.collaboration-hub.loading{justify-content:center;align-items:center}.collaboration-hub.loading .loading-spinner{font-size:1.25rem;color:#666;font-weight:400}.collaboration-hub.error{justify-content:center;align-items:center}.collaboration-hub.error .error-content{text-align:center;color:#666;max-width:400px}.collaboration-hub.error .error-content h2{margin-bottom:.75rem;font-size:1.25rem;color:#1a1a1a;font-weight:600}.collaboration-hub.error .error-content p{margin-bottom:1.5rem;opacity:.8;font-size:.9rem}.collaboration-hub.error .error-content button{background:#007aff;color:#fff;border:none;padding:.625rem 1.25rem;border-radius:6px;font-weight:500;font-size:.875rem;cursor:pointer;transition:all .15s ease}.collaboration-hub.error .error-content button:hover{background:#0056cc;transform:translateY(-1px)}.collaboration-hub .collaboration-header{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 2rem;background:#fff;border-bottom:1px solid #f0f0f0;box-shadow:0 1px 0 rgba(0,0,0,.05)}.collaboration-hub .collaboration-header h1{margin:0;font-size:1.5rem;font-weight:600;color:#1a1a1a;letter-spacing:-0.01em}.collaboration-hub .collaboration-header .header-actions{display:flex;align-items:center;gap:.75rem}.collaboration-hub .collaboration-header .header-actions button{background:#007aff;color:#fff;border:none;padding:.5rem 1rem;border-radius:6px;font-weight:500;font-size:.875rem;cursor:pointer;transition:all .15s ease}.collaboration-hub .collaboration-header .header-actions button:hover{background:#0056cc;transform:translateY(-1px)}.collaboration-hub .collaboration-header .header-actions .notifications-bell{position:relative;cursor:pointer;padding:.5rem;border-radius:6px;transition:all .15s ease;color:#666}.collaboration-hub .collaboration-header .header-actions .notifications-bell:hover{background-color:#f8f9fa;color:#333}.collaboration-hub .collaboration-header .header-actions .notifications-bell .notification-icon{font-size:1.125rem}.collaboration-hub .collaboration-header .header-actions .notifications-bell .notification-badge{position:absolute;top:.25rem;right:.25rem;background:#ff3b30;color:#fff;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;font-size:.625rem;font-weight:600}.collaboration-hub .collaboration-content{display:flex;flex:1;overflow:hidden}.collaboration-hub .collaboration-content .collaboration-sidebar{width:260px;background:#fafafa;border-right:1px solid #f0f0f0;padding:1rem 0}.collaboration-hub .collaboration-content .collaboration-sidebar .collaboration-nav{display:flex;flex-direction:column;gap:.125rem;padding:0 .75rem}.collaboration-hub .collaboration-content .collaboration-sidebar .collaboration-nav .nav-item{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border:none;background:none;border-radius:8px;cursor:pointer;transition:all .15s ease;text-align:left;color:#666;font-weight:500;font-size:.875rem}.collaboration-hub .collaboration-content .collaboration-sidebar .collaboration-nav .nav-item:hover{background:#f0f0f0;color:#333}.collaboration-hub .collaboration-content .collaboration-sidebar .collaboration-nav .nav-item.active{background:#007aff;color:#fff;box-shadow:0 2px 4px rgba(0,122,255,.15)}.collaboration-hub .collaboration-content .collaboration-sidebar .collaboration-nav .nav-item .nav-icon{font-size:1rem;width:20px;height:20px;display:flex;align-items:center;justify-content:center}.collaboration-hub .collaboration-content .collaboration-sidebar .collaboration-nav .nav-item .nav-label{font-weight:500}.collaboration-hub .collaboration-content .collaboration-main{flex:1;background:#fff;overflow-y:auto;padding:2rem}.collaboration-hub .collaboration-content .collaboration-main .error-content{text-align:center;padding:3rem;color:#666}.collaboration-hub .collaboration-content .collaboration-main .error-content h2{margin-bottom:1rem;font-size:1.25rem;color:#1a1a1a;font-weight:600}.collaboration-hub .collaboration-content .collaboration-main .error-content p{margin-bottom:1.5rem;opacity:.8;font-size:.9rem}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-header h2{margin:0;font-size:1.375rem;font-weight:600;color:#1a1a1a}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-header .create-workspace-btn{background:#007aff;color:#fff;border:none;padding:.625rem 1.25rem;border-radius:6px;font-weight:500;font-size:.875rem;cursor:pointer;transition:all .15s ease;display:flex;align-items:center;gap:.5rem}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-header .create-workspace-btn:hover{background:#0056cc;transform:translateY(-1px)}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:1.25rem}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card{background:#f8f9fb;color:#1a1a1a;border:1px solid #f0f0f0;border-radius:12px;padding:1.5rem;transition:all .15s ease;cursor:pointer;position:relative;box-sizing:border-box}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-title,.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-type,.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-description,.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .stat,.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .stat-value,.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .stat-label{color:#1a1a1a !important}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card:hover{border-color:#007aff;box-shadow:0 4px 12px rgba(0,122,255,.08);transform:translateY(-2px)}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card.selected{border-color:#007aff;background:#f4f7ff}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-header{margin-bottom:1rem}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-header .workspace-title-section{display:flex;align-items:flex-start;gap:.75rem}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-header .workspace-title-section .workspace-icon{color:#007aff;flex-shrink:0;margin-top:.125rem}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-header .workspace-title-section .workspace-info{flex:1;min-width:0}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-header .workspace-title-section .workspace-info .workspace-title{font-size:1.125rem;font-weight:600;color:#1a1a1a;margin:0 0 .25rem 0;line-height:1.3}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-header .workspace-title-section .workspace-info .workspace-type{display:inline-block;background:#f0f0f0;color:#666;padding:.25rem .5rem;border-radius:4px;font-size:.75rem;font-weight:500;text-transform:capitalize}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-description{color:#666;margin-bottom:1.25rem;line-height:1.5;font-size:.875rem}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-stats{display:flex;gap:1rem;margin-bottom:1.25rem}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-stats .stat{display:flex;align-items:center;gap:.5rem;color:#666;font-size:.875rem}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-stats .stat svg{color:#999}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-stats .stat .stat-value{font-weight:600;color:#333}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-stats .stat .stat-label{color:#666}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-actions{display:flex;flex-wrap:wrap;gap:.5rem;width:100%;box-sizing:border-box;justify-content:flex-start;align-items:stretch;margin-top:1rem}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-actions .action-btn{flex:1;padding:.5rem;border:1px solid #e0e0e0;background:#fff;border-radius:6px;cursor:pointer;transition:all .15s ease;font-size:.875rem;color:#666;display:flex;align-items:center;justify-content:center;gap:.375rem}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-actions .action-btn:hover{background:#f8f9fa;border-color:#007aff;color:#007aff}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-actions .action-btn.primary{background:#007aff;color:#fff;border-color:#007aff}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-actions .action-btn.primary:hover{background:#0056cc;border-color:#0056cc}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-actions .action-btn svg{width:14px;height:14px}@media(max-width: 600px){.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-actions{flex-direction:column;gap:.5rem}}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-settings-gear{width:28px;height:28px;border-radius:50%;background:none;border:none;display:flex;align-items:center;justify-content:center;transition:background .15s;box-shadow:none;color:#888;z-index:2;outline:none;padding:0}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-settings-gear:hover,.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-settings-gear:focus{background:#f0f0f0;color:#007aff}.collaboration-hub .collaboration-content .collaboration-main .workspaces-tab .workspaces-grid .workspace-card .workspace-settings-gear svg{display:block;width:16px;height:16px;stroke:currentColor}.collaboration-hub .collaboration-content .collaboration-main .channels-tab .channels-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}.collaboration-hub .collaboration-content .collaboration-main .channels-tab .channels-header h2{margin:0;font-size:1.75rem;font-weight:600;color:#333}.collaboration-hub .collaboration-content .collaboration-main .channels-tab .channels-content .channels-list{display:flex;flex-direction:column;gap:.5rem}.collaboration-hub .collaboration-content .collaboration-main .channels-tab .channels-content .channels-list .channel-item{display:flex;justify-content:space-between;align-items:center;padding:1rem;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.05);cursor:pointer;transition:all .2s}.collaboration-hub .collaboration-content .collaboration-main .channels-tab .channels-content .channels-list .channel-item:hover{background:#f8f9fa;transform:translateX(4px)}.collaboration-hub .collaboration-content .collaboration-main .channels-tab .channels-content .channels-list .channel-item .channel-info{display:flex;align-items:center;gap:.75rem}.collaboration-hub .collaboration-content .collaboration-main .channels-tab .channels-content .channels-list .channel-item .channel-info .channel-icon{font-size:1.25rem}.collaboration-hub .collaboration-content .collaboration-main .channels-tab .channels-content .channels-list .channel-item .channel-info .channel-name{font-weight:600;color:#333}.collaboration-hub .collaboration-content .collaboration-main .channels-tab .channels-content .channels-list .channel-item .channel-info .channel-description{color:#666;font-size:.875rem}.collaboration-hub .collaboration-content .collaboration-main .channels-tab .channels-content .channels-list .channel-item .channel-stats .online-count{color:#28a745;font-size:.875rem;font-weight:500}.collaboration-hub .collaboration-content .collaboration-main .channels-tab .no-workspace-selected{text-align:center;padding:3rem;color:#666}.collaboration-hub .collaboration-content .collaboration-main .channels-tab .no-workspace-selected p{font-size:1.125rem}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-header h2{margin:0;font-size:1.75rem;font-weight:600;color:#333}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(400px, 1fr));gap:1.5rem}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card{display:flex;align-items:center;gap:1rem;background:#fff;border-radius:12px;padding:1.5rem;box-shadow:0 4px 20px rgba(0,0,0,.1);transition:all .3s}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,.15)}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card .document-icon{font-size:2rem;width:60px;height:60px;display:flex;align-items:center;justify-content:center;background:#f8f9fa;border-radius:12px}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card .document-info{flex:1}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card .document-info h3{margin:0 0 .5rem 0;font-size:1.125rem;font-weight:600;color:#333}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card .document-info p{margin:0 0 .75rem 0;color:#666;font-size:.875rem}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card .document-info .document-meta{display:flex;gap:1rem;font-size:.75rem}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card .document-info .document-meta .document-type{background:#e3f2fd;color:#1976d2;padding:.25rem .5rem;border-radius:4px;font-weight:500}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card .document-info .document-meta .document-collaborators{color:#666}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card .document-info .document-meta .document-updated{color:#999}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card .document-actions{display:flex;gap:.5rem}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card .document-actions button{padding:.5rem 1rem;border:none;border-radius:6px;cursor:pointer;font-weight:500;transition:all .2s}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card .document-actions button.btn-secondary{background:#f5f5f5;color:#666}.collaboration-hub .collaboration-content .collaboration-main .documents-tab .documents-grid .document-card .document-actions button.btn-secondary:hover{background:#e0e0e0;color:#333}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-header h2{margin:0;font-size:1.75rem;font-weight:600;color:#333}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(350px, 1fr));gap:1.5rem}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1);transition:all .3s}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card:hover{transform:translateY(-4px);box-shadow:0 8px 30px rgba(0,0,0,.15)}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card .whiteboard-preview{height:200px;background:linear-gradient(45deg, #f0f0f0, #e0e0e0);display:flex;align-items:center;justify-content:center}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card .whiteboard-preview .preview-placeholder{color:#999;font-size:1.125rem;font-weight:500}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card .whiteboard-info{padding:1.5rem}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card .whiteboard-info h3{margin:0 0 .5rem 0;font-size:1.125rem;font-weight:600;color:#333}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card .whiteboard-info p{margin:0 0 .75rem 0;color:#666;font-size:.875rem}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card .whiteboard-info .whiteboard-meta{display:flex;gap:1rem;font-size:.75rem}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card .whiteboard-info .whiteboard-meta .whiteboard-collaborators{color:#666}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card .whiteboard-info .whiteboard-meta .whiteboard-updated{color:#999}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card .whiteboard-actions{padding:0 1.5rem 1.5rem;display:flex;gap:.5rem}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card .whiteboard-actions button{flex:1;padding:.5rem;border:none;border-radius:6px;cursor:pointer;font-weight:500;transition:all .2s}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card .whiteboard-actions button.btn-secondary{background:#f5f5f5;color:#666}.collaboration-hub .collaboration-content .collaboration-main .whiteboards-tab .whiteboards-grid .whiteboard-card .whiteboard-actions button.btn-secondary:hover{background:#e0e0e0;color:#333}.collaboration-hub .collaboration-content .collaboration-main .tasks-tab .tasks-header{margin-bottom:2rem}.collaboration-hub .collaboration-content .collaboration-main .tasks-tab .tasks-header h2{margin:0 0 .5rem 0;font-size:1.75rem;font-weight:600;color:#333}.collaboration-hub .collaboration-content .collaboration-main .tasks-tab .tasks-header p{margin:0;color:#666;font-size:1rem}.collaboration-hub .collaboration-content .collaboration-main .tasks-tab .tasks-content .collaborative-tasks-hub{background:none;padding:0;margin:0;min-height:auto}.collaboration-hub .collaboration-content .collaboration-main .tasks-tab .tasks-content .collaborative-tasks-hub .tasks-header{background:none;padding:0;margin-bottom:2rem}.collaboration-hub .collaboration-content .collaboration-main .tasks-tab .tasks-content .collaborative-tasks-hub .tasks-header .header-content{flex-direction:column;align-items:flex-start;gap:1rem}.collaboration-hub .collaboration-content .collaboration-main .tasks-tab .tasks-content .collaborative-tasks-hub .tasks-header .header-content .header-left .header-title{font-size:1.5rem;margin-bottom:.5rem}.collaboration-hub .collaboration-content .collaboration-main .tasks-tab .tasks-content .collaborative-tasks-hub .tasks-header .header-content .header-left .header-subtitle{color:#666}.collaboration-hub .collaboration-content .collaboration-main .tasks-tab .tasks-content .collaborative-tasks-hub .tasks-header .header-content .header-actions{display:flex;gap:1rem;flex-wrap:wrap}.collaboration-hub .collaboration-content .collaboration-main .tasks-tab .tasks-content .collaborative-tasks-hub .stats-grid{margin-bottom:2rem}.collaboration-hub .collaboration-content .collaboration-main .tasks-tab .tasks-content .collaborative-tasks-hub .tasks-content{background:#fff;border-radius:12px;padding:1.5rem;box-shadow:0 2px 8px rgba(0,0,0,.1)}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:1000;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-header{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid #f0f0f0}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-header h3{margin:0;font-size:1.125rem;font-weight:600;color:#1a1a1a}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-header .close-btn{background:none;border:none;font-size:1.25rem;cursor:pointer;color:#666;padding:.25rem;border-radius:4px;transition:all .15s ease;width:32px;height:32px;display:flex;align-items:center;justify-content:center}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-header .close-btn:hover{background:#f8f9fa;color:#333}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body{padding:1.5rem 2rem;height:340px;overflow-y:auto;flex:1 1 auto}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content h4{margin:0 0 1.25rem 0;font-size:1rem;font-weight:600;color:#1a1a1a}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .form-group{margin-bottom:1.25rem}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .form-group label{display:block;margin-bottom:.5rem;font-weight:500;color:#333;font-size:.875rem}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .form-group .form-input{width:100%;padding:.75rem;border:1px solid #e0e0e0;border-radius:6px;font-size:.875rem;transition:all .15s ease;background:#fff;color:#222 !important}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .form-group .form-input:focus{outline:none;border-color:#007aff;box-shadow:0 0 0 3px rgba(0,122,255,.1)}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .form-group .form-input::-moz-placeholder{color:#555 !important;opacity:1 !important}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .form-group .form-input::placeholder{color:#555 !important;opacity:1 !important}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .form-group textarea.form-input{resize:vertical;min-height:80px}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .form-group select.form-input{cursor:pointer}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .searching-indicator{text-align:center;padding:1rem;color:#666;font-style:italic;font-size:.875rem}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .search-results{margin-top:1rem;border:1px solid #f0f0f0;border-radius:8px;max-height:200px;overflow-y:auto;background:#fff}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .search-results h5{margin:0;padding:.75rem;background:#fafafa;border-bottom:1px solid #f0f0f0;font-size:.875rem;font-weight:600;color:#333}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .search-results .user-result{display:flex;justify-content:space-between;align-items:center;padding:.75rem;border-bottom:1px solid #f8f9fa;transition:background-color .15s ease}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .search-results .user-result:last-child{border-bottom:none}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .search-results .user-result:hover{background:#f8f9fa}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .search-results .user-result .user-info{display:flex;flex-direction:column;gap:.25rem}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .search-results .user-result .user-info .user-name{font-weight:500;color:#1a1a1a;font-size:.875rem}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .search-results .user-result .user-info .user-email{color:#666;font-size:.75rem}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .search-results .user-result .user-info .user-role{color:#007aff;font-size:.75rem;font-weight:500}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .search-results .user-result .btn-add-user{padding:.5rem 1rem;background:#007aff;color:#fff;border:none;border-radius:6px;font-size:.75rem;font-weight:500;cursor:pointer;transition:all .15s ease}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .search-results .user-result .btn-add-user:hover:not(:disabled){background:#0056cc}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .search-results .user-result .btn-add-user:disabled{background:#ccc;cursor:not-allowed}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .selected-members{margin-top:1rem;border:1px solid #f0f0f0;border-radius:8px;background:#fff}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .selected-members h5{margin:0;padding:.75rem;background:#f8f9ff;border-bottom:1px solid #f0f0f0;font-size:.875rem;font-weight:600;color:#007aff}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .selected-members .selected-member{display:flex;justify-content:space-between;align-items:center;padding:.75rem;border-bottom:1px solid #f3f4f6}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .selected-members .selected-member:last-child{border-bottom:none}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .selected-members .selected-member .member-name{font-weight:500;color:#111827;font-size:.875rem}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .selected-members .selected-member .btn-remove-member{padding:.25rem .75rem;background:#ef4444;color:#fff;border:none;border-radius:4px;font-size:.75rem;cursor:pointer;transition:all .2s}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .step-content .selected-members .selected-member .btn-remove-member:hover{background:#dc2626}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .modal-footer{display:flex;justify-content:flex-end;gap:.75rem;padding:1.5rem;border-top:1px solid #e5e7eb}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .modal-footer button{padding:.75rem 1.5rem;border-radius:6px;font-weight:500;cursor:pointer;transition:all .2s;border:none}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .modal-footer button.btn-secondary{background:#f3f4f6;color:#374151}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .modal-footer button.btn-secondary:hover{background:#e5e7eb}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .modal-footer button.btn-primary{background:#667eea;color:#fff}.collaboration-hub .collaboration-content .collaboration-main .modal-overlay .modal-body .modal-footer button.btn-primary:hover{background:#5a67d8}.btn-primary{background:#007aff;color:#fff;border:none;padding:.625rem 1.25rem;border-radius:6px;font-weight:500;font-size:.875rem;cursor:pointer;transition:all .15s ease;display:inline-flex;align-items:center;gap:.5rem}.btn-primary:hover{background:#0056cc;transform:translateY(-1px)}.btn-primary:disabled{background:#ccc;cursor:not-allowed;transform:none}.btn-secondary{background:#fff;color:#666;border:1px solid #e0e0e0;padding:.625rem 1.25rem;border-radius:6px;font-weight:500;font-size:.875rem;cursor:pointer;transition:all .15s ease;display:inline-flex;align-items:center;gap:.5rem}.btn-secondary:hover{background:#f8f9fa;border-color:#007aff;color:#007aff}.btn-danger{background:#ff3b30;color:#fff;border:none;padding:.625rem 1.25rem;border-radius:6px;font-weight:500;font-size:.875rem;cursor:pointer;transition:all .15s ease}.btn-danger:hover{background:#dc2626;transform:translateY(-1px)}@media(max-width: 768px){.collaboration-hub .collaboration-content{flex-direction:column}.collaboration-hub .collaboration-content .collaboration-sidebar{width:100%;border-right:none;border-bottom:1px solid rgba(0,0,0,.1)}.collaboration-hub .collaboration-content .collaboration-sidebar .collaboration-nav{flex-direction:row;overflow-x:auto;padding:1rem}.collaboration-hub .collaboration-content .collaboration-sidebar .collaboration-nav .nav-item{flex-shrink:0;min-width:120px}.collaboration-hub .collaboration-content .collaboration-main{padding:1rem}.collaboration-hub .collaboration-content .collaboration-main .workspaces-grid,.collaboration-hub .collaboration-content .collaboration-main .documents-grid,.collaboration-hub .collaboration-content .collaboration-main .whiteboards-grid{grid-template-columns:1fr}}.error-boundary{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;text-align:center;padding:2rem}.error-boundary h2{margin-bottom:1rem;font-size:1.5rem}.error-boundary p{margin-bottom:2rem;opacity:.9}.error-boundary button{background:#fff;color:#667eea;border:none;padding:.75rem 1.5rem;border-radius:8px;font-weight:600;cursor:pointer;transition:all .2s}.error-boundary button:hover{background:#f8f9fa;transform:translateY(-2px)}.screenplay-selector{padding:20px}.screenplay-selector .selector-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.screenplay-selector .selector-header h3{margin:0;font-size:1.5rem;color:#333}.screenplay-selector .selector-header .upload-btn{background:#2563eb;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:.95rem;transition:background .2s}.screenplay-selector .selector-header .upload-btn:hover{background:#1e40af}.screenplay-selector .selector-header .upload-btn span{font-size:1.1rem}.screenplay-selector .empty-state{text-align:center;padding:60px 20px}.screenplay-selector .empty-state .empty-icon{font-size:4rem;margin-bottom:20px;opacity:.6}.screenplay-selector .empty-state h4{margin:0 0 10px 0;color:#333;font-size:1.3rem}.screenplay-selector .empty-state p{margin:0 0 30px 0;color:#666;font-size:1rem}.screenplay-selector .empty-state .upload-btn.primary{background:#2563eb;color:#fff;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-size:1rem;transition:background .2s}.screenplay-selector .empty-state .upload-btn.primary:hover{background:#1e40af}.screenplay-selector .screenplay-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:20px}.screenplay-selector .screenplay-grid .screenplay-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;transition:all .2s;cursor:pointer}.screenplay-selector .screenplay-grid .screenplay-card:hover{border-color:#2563eb;box-shadow:0 4px 12px rgba(37,99,235,.1);transform:translateY(-2px)}.screenplay-selector .screenplay-grid .screenplay-card .card-thumbnail{text-align:center;margin-bottom:15px}.screenplay-selector .screenplay-grid .screenplay-card .card-thumbnail .pdf-icon{font-size:3rem;opacity:.7}.screenplay-selector .screenplay-grid .screenplay-card .card-content .screenplay-name{color:#1a1a1a !important;font-weight:600;font-size:1.1rem;margin:0 0 8px 0}.screenplay-selector .screenplay-grid .screenplay-card .card-content .upload-date{margin:0 0 15px 0;font-size:.9rem;color:#666}.screenplay-selector .screenplay-grid .screenplay-card .card-content .card-actions{display:flex;gap:10px}.screenplay-selector .screenplay-grid .screenplay-card .card-content .card-actions .open-btn{background:#2563eb;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-size:.9rem;flex:1;transition:background .2s}.screenplay-selector .screenplay-grid .screenplay-card .card-content .card-actions .open-btn:hover{background:#1e40af}.screenplay-selector .screenplay-grid .screenplay-card .card-content .card-actions .delete-btn{background:#ef4444;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-size:.9rem;transition:background .2s}.screenplay-selector .screenplay-grid .screenplay-card .card-content .card-actions .delete-btn:hover{background:#dc2626}.screenplay-modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.8);z-index:1000;display:flex;align-items:center;justify-content:center;overflow:hidden}.screenplay-modal-overlay .screenplay-modal{background:#fff;border-radius:12px;width:95vw;height:95vh;max-width:1400px;display:flex;flex-direction:column;overflow:hidden}.screenplay-modal-overlay .screenplay-modal .modal-header{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #e5e7eb;background:#f9fafb}.screenplay-modal-overlay .screenplay-modal .modal-header h2{margin:0;font-size:1.3rem;color:#333}.screenplay-modal-overlay .screenplay-modal .modal-header .close-btn{background:none;border:none;font-size:1.5rem;color:#666;cursor:pointer;padding:5px;border-radius:4px;transition:background .2s}.screenplay-modal-overlay .screenplay-modal .modal-header .close-btn:hover{background:#e5e7eb;color:#333}.screenplay-modal-overlay .screenplay-modal .modal-content{width:420px;max-width:95vw;background:#fff;border-radius:18px;box-shadow:0 8px 32px rgba(0,0,0,.18);padding:0;overflow:hidden;display:flex;flex-direction:column}.screenplay-modal-overlay .screenplay-modal .modal-body{padding:1.5rem 2rem;height:340px;overflow-y:auto;flex:1 1 auto}.screenplay-modal-overlay .screenplay-modal .selected-users{display:flex;flex-wrap:nowrap;gap:.5rem;margin-bottom:.5rem;max-width:100%;overflow-x:auto;overflow-y:hidden;min-height:40px;height:40px;white-space:nowrap}.avatar{width:40px;height:40px;border-radius:50%;overflow:hidden;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:1.1rem}.avatar-list{width:32px;height:32px;font-size:1rem}.avatar-mini{width:28px;height:28px;font-size:.9rem}.avatar .online-indicator,.avatar-list .online-indicator,.avatar-mini .online-indicator{position:absolute;bottom:0;right:0;width:12px;height:12px;border-radius:50%;border:2px solid #fff;background:#10b981;box-shadow:0 0 0 2px rgba(16,185,129,.2)}.card-standard{background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 1px 4px rgba(30,41,59,.04);padding:14px 16px 10px 16px;margin-bottom:12px;transition:box-shadow .18s,border .18s}.card-standard:hover{box-shadow:0 2px 8px rgba(30,41,59,.08);border-color:#cbd5e1}.nav-item.active{background:#2563eb;color:#fff;box-shadow:0 2px 8px rgba(37,99,235,.1);font-weight:600}.collaborators-list,.users-list{gap:6px;margin-bottom:6px}.collaborator-name,.user-name,.member-name{color:#1e2937;font-weight:600}.workspaces-grid .workspace-card.selected .workspace-title,.workspaces-grid .workspace-card.selected .workspace-type,.workspaces-grid .workspace-card.selected .workspace-description,.workspaces-grid .workspace-card.selected .stat,.workspaces-grid .workspace-card.selected .stat-value,.workspaces-grid .workspace-card.selected .stat-label{color:#1a1a1a !important}`, "",{"version":3,"sources":["webpack://./src/components/Collaboration/CollaborationHub.scss"],"names":[],"mappings":"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","sourcesContent":[".collaboration-hub {\n  display: flex;\n  flex-direction: column;\n  height: 100vh;\n  background: #ffffff;\n  color: #1a1a1a;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n  font-size: 14px;\n  line-height: 1.5;\n\n  &.loading {\n    justify-content: center;\n    align-items: center;\n    \n    .loading-spinner {\n      font-size: 1.25rem;\n      color: #666;\n      font-weight: 400;\n    }\n  }\n\n  &.error {\n    justify-content: center;\n    align-items: center;\n    \n    .error-content {\n      text-align: center;\n      color: #666;\n      max-width: 400px;\n      \n      h2 {\n        margin-bottom: 0.75rem;\n        font-size: 1.25rem;\n        color: #1a1a1a;\n        font-weight: 600;\n      }\n      \n      p {\n        margin-bottom: 1.5rem;\n        opacity: 0.8;\n        font-size: 0.9rem;\n      }\n      \n      button {\n        background: #007AFF;\n        color: white;\n        border: none;\n        padding: 0.625rem 1.25rem;\n        border-radius: 6px;\n        font-weight: 500;\n        font-size: 0.875rem;\n        cursor: pointer;\n        transition: all 0.15s ease;\n\n        &:hover {\n          background: #0056CC;\n          transform: translateY(-1px);\n        }\n      }\n    }\n  }\n\n  .collaboration-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 1.25rem 2rem;\n    background: white;\n    border-bottom: 1px solid #f0f0f0;\n    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);\n\n    h1 {\n      margin: 0;\n      font-size: 1.5rem;\n      font-weight: 600;\n      color: #1a1a1a;\n      letter-spacing: -0.01em;\n    }\n\n    .header-actions {\n      display: flex;\n      align-items: center;\n      gap: 0.75rem;\n\n      button {\n        background: #007AFF;\n        color: white;\n        border: none;\n        padding: 0.5rem 1rem;\n        border-radius: 6px;\n        font-weight: 500;\n        font-size: 0.875rem;\n        cursor: pointer;\n        transition: all 0.15s ease;\n\n        &:hover {\n          background: #0056CC;\n          transform: translateY(-1px);\n        }\n      }\n\n      .notifications-bell {\n        position: relative;\n        cursor: pointer;\n        padding: 0.5rem;\n        border-radius: 6px;\n        transition: all 0.15s ease;\n        color: #666;\n\n        &:hover {\n          background-color: #f8f9fa;\n          color: #333;\n        }\n\n        .notification-icon {\n          font-size: 1.125rem;\n        }\n\n        .notification-badge {\n          position: absolute;\n          top: 0.25rem;\n          right: 0.25rem;\n          background: #FF3B30;\n          color: white;\n          border-radius: 50%;\n          width: 16px;\n          height: 16px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          font-size: 0.625rem;\n          font-weight: 600;\n        }\n      }\n    }\n  }\n\n  .collaboration-content {\n    display: flex;\n    flex: 1;\n    overflow: hidden;\n\n    .collaboration-sidebar {\n      width: 260px;\n      background: #fafafa;\n      border-right: 1px solid #f0f0f0;\n      padding: 1rem 0;\n\n      .collaboration-nav {\n        display: flex;\n        flex-direction: column;\n        gap: 0.125rem;\n        padding: 0 0.75rem;\n\n        .nav-item {\n          display: flex;\n          align-items: center;\n          gap: 0.75rem;\n          padding: 0.75rem 1rem;\n          border: none;\n          background: none;\n          border-radius: 8px;\n          cursor: pointer;\n          transition: all 0.15s ease;\n          text-align: left;\n          color: #666;\n          font-weight: 500;\n          font-size: 0.875rem;\n\n          &:hover {\n            background: #f0f0f0;\n            color: #333;\n          }\n\n          &.active {\n            background: #007AFF;\n            color: white;\n            box-shadow: 0 2px 4px rgba(0, 122, 255, 0.15);\n          }\n\n          .nav-icon {\n            font-size: 1rem;\n            width: 20px;\n            height: 20px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n          }\n\n          .nav-label {\n            font-weight: 500;\n          }\n        }\n      }\n    }\n\n    .collaboration-main {\n      flex: 1;\n      background: white;\n      overflow-y: auto;\n      padding: 2rem;\n\n      .error-content {\n        text-align: center;\n        padding: 3rem;\n        color: #666;\n        \n        h2 {\n          margin-bottom: 1rem;\n          font-size: 1.25rem;\n          color: #1a1a1a;\n          font-weight: 600;\n        }\n        \n        p {\n          margin-bottom: 1.5rem;\n          opacity: 0.8;\n          font-size: 0.9rem;\n        }\n      }\n\n      // Workspaces Tab\n      .workspaces-tab {\n        .workspaces-header {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          margin-bottom: 2rem;\n\n          h2 {\n            margin: 0;\n            font-size: 1.375rem;\n            font-weight: 600;\n            color: #1a1a1a;\n          }\n\n          .create-workspace-btn {\n            background: #007AFF;\n            color: white;\n            border: none;\n            padding: 0.625rem 1.25rem;\n            border-radius: 6px;\n            font-weight: 500;\n            font-size: 0.875rem;\n            cursor: pointer;\n            transition: all 0.15s ease;\n            display: flex;\n            align-items: center;\n            gap: 0.5rem;\n\n            &:hover {\n              background: #0056CC;\n              transform: translateY(-1px);\n            }\n          }\n        }\n\n        .workspaces-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n          gap: 1.25rem;\n\n          .workspace-card {\n            background: #f8f9fb;\n            color: #1a1a1a;\n            border: 1px solid #f0f0f0;\n            border-radius: 12px;\n            padding: 1.5rem;\n            transition: all 0.15s ease;\n            cursor: pointer;\n            position: relative;\n            box-sizing: border-box;\n            \n            .workspace-title,\n            .workspace-type,\n            .workspace-description,\n            .stat,\n            .stat-value,\n            .stat-label {\n              color: #1a1a1a !important;\n            }\n            \n            &:hover {\n              border-color: #007AFF;\n              box-shadow: 0 4px 12px rgba(0, 122, 255, 0.08);\n              transform: translateY(-2px);\n            }\n            \n            &.selected {\n              border-color: #007AFF;\n              background: #f4f7ff;\n            }\n\n            .workspace-header {\n              margin-bottom: 1rem;\n\n              .workspace-title-section {\n                display: flex;\n                align-items: flex-start;\n                gap: 0.75rem;\n\n                .workspace-icon {\n                  color: #007AFF;\n                  flex-shrink: 0;\n                  margin-top: 0.125rem;\n                }\n\n                .workspace-info {\n                  flex: 1;\n                  min-width: 0;\n\n                  .workspace-title {\n                    font-size: 1.125rem;\n                    font-weight: 600;\n                    color: #1a1a1a;\n                    margin: 0 0 0.25rem 0;\n                    line-height: 1.3;\n                  }\n\n                  .workspace-type {\n                    display: inline-block;\n                    background: #f0f0f0;\n                    color: #666;\n                    padding: 0.25rem 0.5rem;\n                    border-radius: 4px;\n                    font-size: 0.75rem;\n                    font-weight: 500;\n                    text-transform: capitalize;\n                  }\n                }\n              }\n            }\n            \n            .workspace-description {\n              color: #666;\n              margin-bottom: 1.25rem;\n              line-height: 1.5;\n              font-size: 0.875rem;\n            }\n            \n            .workspace-stats {\n              display: flex;\n              gap: 1rem;\n              margin-bottom: 1.25rem;\n\n              .stat {\n                display: flex;\n                align-items: center;\n                gap: 0.5rem;\n                color: #666;\n                font-size: 0.875rem;\n\n                svg {\n                  color: #999;\n                }\n\n                .stat-value {\n                  font-weight: 600;\n                  color: #333;\n                }\n\n                .stat-label {\n                  color: #666;\n                }\n              }\n            }\n            \n            .workspace-actions {\n              display: flex;\n              flex-wrap: wrap;\n              gap: 0.5rem;\n              width: 100%;\n              box-sizing: border-box;\n              justify-content: flex-start;\n              align-items: stretch;\n              margin-top: 1rem;\n\n              .action-btn {\n                flex: 1;\n                padding: 0.5rem;\n                border: 1px solid #e0e0e0;\n                background: white;\n                border-radius: 6px;\n                cursor: pointer;\n                transition: all 0.15s ease;\n                font-size: 0.875rem;\n                color: #666;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                gap: 0.375rem;\n\n                &:hover {\n                  background: #f8f9fa;\n                  border-color: #007AFF;\n                  color: #007AFF;\n                }\n\n                &.primary {\n                  background: #007AFF;\n                  color: white;\n                  border-color: #007AFF;\n\n                  &:hover {\n                    background: #0056CC;\n                    border-color: #0056CC;\n                  }\n                }\n\n                svg {\n                  width: 14px;\n                  height: 14px;\n                }\n              }\n            }\n\n            // Responsive: stack buttons on small screens\n            @media (max-width: 600px) {\n              .workspace-actions {\n                flex-direction: column;\n                gap: 0.5rem;\n              }\n            }\n\n            .workspace-settings-gear {\n              width: 28px;\n              height: 28px;\n              border-radius: 50%;\n              background: none;\n              border: none;\n              display: flex;\n              align-items: center;\n              justify-content: center;\n              transition: background 0.15s;\n              box-shadow: none;\n              color: #888;\n              z-index: 2;\n              outline: none;\n              padding: 0;\n              &:hover, &:focus {\n                background: #f0f0f0;\n                color: #007AFF;\n              }\n              svg {\n                display: block;\n                width: 16px;\n                height: 16px;\n                stroke: currentColor;\n              }\n            }\n          }\n        }\n      }\n\n      // Channels Tab\n      .channels-tab {\n        .channels-header {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          margin-bottom: 2rem;\n\n          h2 {\n            margin: 0;\n            font-size: 1.75rem;\n            font-weight: 600;\n            color: #333;\n          }\n        }\n\n        .channels-content {\n          .channels-list {\n            display: flex;\n            flex-direction: column;\n            gap: 0.5rem;\n\n            .channel-item {\n              display: flex;\n              justify-content: space-between;\n              align-items: center;\n              padding: 1rem;\n              background: white;\n              border-radius: 8px;\n              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);\n              cursor: pointer;\n              transition: all 0.2s;\n\n              &:hover {\n                background: #f8f9fa;\n                transform: translateX(4px);\n              }\n\n              .channel-info {\n                display: flex;\n                align-items: center;\n                gap: 0.75rem;\n\n                .channel-icon {\n                  font-size: 1.25rem;\n                }\n\n                .channel-name {\n                  font-weight: 600;\n                  color: #333;\n                }\n\n                .channel-description {\n                  color: #666;\n                  font-size: 0.875rem;\n                }\n              }\n\n              .channel-stats {\n                .online-count {\n                  color: #28a745;\n                  font-size: 0.875rem;\n                  font-weight: 500;\n                }\n              }\n            }\n          }\n        }\n\n        .no-workspace-selected {\n          text-align: center;\n          padding: 3rem;\n          color: #666;\n\n          p {\n            font-size: 1.125rem;\n          }\n        }\n      }\n\n      // Documents Tab\n      .documents-tab {\n        .documents-header {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          margin-bottom: 2rem;\n\n          h2 {\n            margin: 0;\n            font-size: 1.75rem;\n            font-weight: 600;\n            color: #333;\n          }\n        }\n\n        .documents-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));\n          gap: 1.5rem;\n\n          .document-card {\n            display: flex;\n            align-items: center;\n            gap: 1rem;\n            background: white;\n            border-radius: 12px;\n            padding: 1.5rem;\n            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n            transition: all 0.3s;\n\n            &:hover {\n              transform: translateY(-2px);\n              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);\n            }\n\n            .document-icon {\n              font-size: 2rem;\n              width: 60px;\n              height: 60px;\n              display: flex;\n              align-items: center;\n              justify-content: center;\n              background: #f8f9fa;\n              border-radius: 12px;\n            }\n\n            .document-info {\n              flex: 1;\n\n              h3 {\n                margin: 0 0 0.5rem 0;\n                font-size: 1.125rem;\n                font-weight: 600;\n                color: #333;\n              }\n\n              p {\n                margin: 0 0 0.75rem 0;\n                color: #666;\n                font-size: 0.875rem;\n              }\n\n              .document-meta {\n                display: flex;\n                gap: 1rem;\n                font-size: 0.75rem;\n\n                .document-type {\n                  background: #e3f2fd;\n                  color: #1976d2;\n                  padding: 0.25rem 0.5rem;\n                  border-radius: 4px;\n                  font-weight: 500;\n                }\n\n                .document-collaborators {\n                  color: #666;\n                }\n\n                .document-updated {\n                  color: #999;\n                }\n              }\n            }\n\n            .document-actions {\n              display: flex;\n              gap: 0.5rem;\n\n              button {\n                padding: 0.5rem 1rem;\n                border: none;\n                border-radius: 6px;\n                cursor: pointer;\n                font-weight: 500;\n                transition: all 0.2s;\n\n                &.btn-secondary {\n                  background: #f5f5f5;\n                  color: #666;\n\n                  &:hover {\n                    background: #e0e0e0;\n                    color: #333;\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n\n      // Whiteboards Tab\n      .whiteboards-tab {\n        .whiteboards-header {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          margin-bottom: 2rem;\n\n          h2 {\n            margin: 0;\n            font-size: 1.75rem;\n            font-weight: 600;\n            color: #333;\n          }\n        }\n\n        .whiteboards-grid {\n          display: grid;\n          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));\n          gap: 1.5rem;\n\n          .whiteboard-card {\n            background: white;\n            border-radius: 12px;\n            overflow: hidden;\n            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n            transition: all 0.3s;\n\n            &:hover {\n              transform: translateY(-4px);\n              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);\n            }\n\n            .whiteboard-preview {\n              height: 200px;\n              background: linear-gradient(45deg, #f0f0f0, #e0e0e0);\n              display: flex;\n              align-items: center;\n              justify-content: center;\n\n              .preview-placeholder {\n                color: #999;\n                font-size: 1.125rem;\n                font-weight: 500;\n              }\n            }\n\n            .whiteboard-info {\n              padding: 1.5rem;\n\n              h3 {\n                margin: 0 0 0.5rem 0;\n                font-size: 1.125rem;\n                font-weight: 600;\n                color: #333;\n              }\n\n              p {\n                margin: 0 0 0.75rem 0;\n                color: #666;\n                font-size: 0.875rem;\n              }\n\n              .whiteboard-meta {\n                display: flex;\n                gap: 1rem;\n                font-size: 0.75rem;\n\n                .whiteboard-collaborators {\n                  color: #666;\n                }\n\n                .whiteboard-updated {\n                  color: #999;\n                }\n              }\n            }\n\n            .whiteboard-actions {\n              padding: 0 1.5rem 1.5rem;\n              display: flex;\n              gap: 0.5rem;\n\n              button {\n                flex: 1;\n                padding: 0.5rem;\n                border: none;\n                border-radius: 6px;\n                cursor: pointer;\n                font-weight: 500;\n                transition: all 0.2s;\n\n                &.btn-secondary {\n                  background: #f5f5f5;\n                  color: #666;\n\n                  &:hover {\n                    background: #e0e0e0;\n                    color: #333;\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n\n      // Tasks Tab\n      .tasks-tab {\n        .tasks-header {\n          margin-bottom: 2rem;\n\n          h2 {\n            margin: 0 0 0.5rem 0;\n            font-size: 1.75rem;\n            font-weight: 600;\n            color: #333;\n          }\n\n          p {\n            margin: 0;\n            color: #666;\n            font-size: 1rem;\n          }\n        }\n\n        .tasks-content {\n          // Override the CollaborativeTasksHub styles to fit within the collaboration layout\n          .collaborative-tasks-hub {\n            background: none;\n            padding: 0;\n            margin: 0;\n            min-height: auto;\n\n            .tasks-header {\n              background: none;\n              padding: 0;\n              margin-bottom: 2rem;\n\n              .header-content {\n                flex-direction: column;\n                align-items: flex-start;\n                gap: 1rem;\n\n                .header-left {\n                  .header-title {\n                    font-size: 1.5rem;\n                    margin-bottom: 0.5rem;\n                  }\n\n                  .header-subtitle {\n                    color: #666;\n                  }\n                }\n\n                .header-actions {\n                  display: flex;\n                  gap: 1rem;\n                  flex-wrap: wrap;\n                }\n              }\n            }\n\n            .stats-grid {\n              margin-bottom: 2rem;\n            }\n\n            .tasks-content {\n              background: white;\n              border-radius: 12px;\n              padding: 1.5rem;\n              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n            }\n          }\n        }\n      }\n\n      // Modal Styles\n      .modal-overlay {\n        position: fixed;\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        background: rgba(0, 0, 0, 0.4);\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        z-index: 1000;\n        backdrop-filter: blur(4px);\n\n        .modal-header {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          padding: 1.25rem 1.5rem;\n          border-bottom: 1px solid #f0f0f0;\n\n          h3 {\n            margin: 0;\n            font-size: 1.125rem;\n            font-weight: 600;\n            color: #1a1a1a;\n          }\n\n          .close-btn {\n            background: none;\n            border: none;\n            font-size: 1.25rem;\n            cursor: pointer;\n            color: #666;\n            padding: 0.25rem;\n            border-radius: 4px;\n            transition: all 0.15s ease;\n            width: 32px;\n            height: 32px;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n\n            &:hover {\n              background: #f8f9fa;\n              color: #333;\n            }\n          }\n        }\n\n        .modal-body {\n          padding: 1.5rem 2rem;\n          height: 340px;\n          overflow-y: auto;\n          flex: 1 1 auto;\n\n          .step-content {\n            h4 {\n              margin: 0 0 1.25rem 0;\n              font-size: 1rem;\n              font-weight: 600;\n              color: #1a1a1a;\n            }\n\n            .form-group {\n              margin-bottom: 1.25rem;\n\n              label {\n                display: block;\n                margin-bottom: 0.5rem;\n                font-weight: 500;\n                color: #333;\n                font-size: 0.875rem;\n              }\n\n              .form-input {\n                width: 100%;\n                padding: 0.75rem;\n                border: 1px solid #e0e0e0;\n                border-radius: 6px;\n                font-size: 0.875rem;\n                transition: all 0.15s ease;\n                background: white;\n                color: #222 !important;\n\n                &:focus {\n                  outline: none;\n                  border-color: #007AFF;\n                  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);\n                }\n\n                &::placeholder {\n                  color: #555 !important;\n                  opacity: 1 !important;\n                }\n              }\n\n              textarea.form-input {\n                resize: vertical;\n                min-height: 80px;\n              }\n\n              select.form-input {\n                cursor: pointer;\n              }\n            }\n\n            .searching-indicator {\n              text-align: center;\n              padding: 1rem;\n              color: #666;\n              font-style: italic;\n              font-size: 0.875rem;\n            }\n\n            .search-results {\n              margin-top: 1rem;\n              border: 1px solid #f0f0f0;\n              border-radius: 8px;\n              max-height: 200px;\n              overflow-y: auto;\n              background: white;\n\n              h5 {\n                margin: 0;\n                padding: 0.75rem;\n                background: #fafafa;\n                border-bottom: 1px solid #f0f0f0;\n                font-size: 0.875rem;\n                font-weight: 600;\n                color: #333;\n              }\n\n              .user-result {\n                display: flex;\n                justify-content: space-between;\n                align-items: center;\n                padding: 0.75rem;\n                border-bottom: 1px solid #f8f9fa;\n                transition: background-color 0.15s ease;\n\n                &:last-child {\n                  border-bottom: none;\n                }\n\n                &:hover {\n                  background: #f8f9fa;\n                }\n\n                .user-info {\n                  display: flex;\n                  flex-direction: column;\n                  gap: 0.25rem;\n\n                  .user-name {\n                    font-weight: 500;\n                    color: #1a1a1a;\n                    font-size: 0.875rem;\n                  }\n\n                  .user-email {\n                    color: #666;\n                    font-size: 0.75rem;\n                  }\n\n                  .user-role {\n                    color: #007AFF;\n                    font-size: 0.75rem;\n                    font-weight: 500;\n                  }\n                }\n\n                .btn-add-user {\n                  padding: 0.5rem 1rem;\n                  background: #007AFF;\n                  color: white;\n                  border: none;\n                  border-radius: 6px;\n                  font-size: 0.75rem;\n                  font-weight: 500;\n                  cursor: pointer;\n                  transition: all 0.15s ease;\n\n                  &:hover:not(:disabled) {\n                    background: #0056CC;\n                  }\n\n                  &:disabled {\n                    background: #ccc;\n                    cursor: not-allowed;\n                  }\n                }\n              }\n            }\n\n            .selected-members {\n              margin-top: 1rem;\n              border: 1px solid #f0f0f0;\n              border-radius: 8px;\n              background: white;\n\n              h5 {\n                margin: 0;\n                padding: 0.75rem;\n                background: #f8f9ff;\n                border-bottom: 1px solid #f0f0f0;\n                font-size: 0.875rem;\n                font-weight: 600;\n                color: #007AFF;\n              }\n\n              .selected-member {\n                display: flex;\n                justify-content: space-between;\n                align-items: center;\n                padding: 0.75rem;\n                border-bottom: 1px solid #f3f4f6;\n\n                &:last-child {\n                  border-bottom: none;\n                }\n\n                .member-name {\n                  font-weight: 500;\n                  color: #111827;\n                  font-size: 0.875rem;\n                }\n\n                .btn-remove-member {\n                  padding: 0.25rem 0.75rem;\n                  background: #ef4444;\n                  color: white;\n                  border: none;\n                  border-radius: 4px;\n                  font-size: 0.75rem;\n                  cursor: pointer;\n                  transition: all 0.2s;\n\n                  &:hover {\n                    background: #dc2626;\n                  }\n                }\n              }\n            }\n          }\n\n          .modal-footer {\n            display: flex;\n            justify-content: flex-end;\n            gap: 0.75rem;\n            padding: 1.5rem;\n            border-top: 1px solid #e5e7eb;\n\n            button {\n              padding: 0.75rem 1.5rem;\n              border-radius: 6px;\n              font-weight: 500;\n              cursor: pointer;\n              transition: all 0.2s;\n              border: none;\n\n              &.btn-secondary {\n                background: #f3f4f6;\n                color: #374151;\n\n                &:hover {\n                  background: #e5e7eb;\n                }\n              }\n\n              &.btn-primary {\n                background: #667eea;\n                color: white;\n\n                &:hover {\n                  background: #5a67d8;\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\n// Global button styles for consistency\n.btn-primary {\n  background: #007AFF;\n  color: white;\n  border: none;\n  padding: 0.625rem 1.25rem;\n  border-radius: 6px;\n  font-weight: 500;\n  font-size: 0.875rem;\n  cursor: pointer;\n  transition: all 0.15s ease;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n\n  &:hover {\n    background: #0056CC;\n    transform: translateY(-1px);\n  }\n\n  &:disabled {\n    background: #ccc;\n    cursor: not-allowed;\n    transform: none;\n  }\n}\n\n.btn-secondary {\n  background: white;\n  color: #666;\n  border: 1px solid #e0e0e0;\n  padding: 0.625rem 1.25rem;\n  border-radius: 6px;\n  font-weight: 500;\n  font-size: 0.875rem;\n  cursor: pointer;\n  transition: all 0.15s ease;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n\n  &:hover {\n    background: #f8f9fa;\n    border-color: #007AFF;\n    color: #007AFF;\n  }\n}\n\n.btn-danger {\n  background: #FF3B30;\n  color: white;\n  border: none;\n  padding: 0.625rem 1.25rem;\n  border-radius: 6px;\n  font-weight: 500;\n  font-size: 0.875rem;\n  cursor: pointer;\n  transition: all 0.15s ease;\n\n  &:hover {\n    background: #DC2626;\n    transform: translateY(-1px);\n  }\n}\n\n// Responsive Design\n@media (max-width: 768px) {\n  .collaboration-hub {\n    .collaboration-content {\n      flex-direction: column;\n\n      .collaboration-sidebar {\n        width: 100%;\n        border-right: none;\n        border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n\n        .collaboration-nav {\n          flex-direction: row;\n          overflow-x: auto;\n          padding: 1rem;\n\n          .nav-item {\n            flex-shrink: 0;\n            min-width: 120px;\n          }\n        }\n      }\n\n      .collaboration-main {\n        padding: 1rem;\n\n        .workspaces-grid,\n        .documents-grid,\n        .whiteboards-grid {\n          grid-template-columns: 1fr;\n        }\n      }\n    }\n  }\n}\n\n.error-boundary {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  text-align: center;\n  padding: 2rem;\n\n  h2 {\n    margin-bottom: 1rem;\n    font-size: 1.5rem;\n  }\n\n  p {\n    margin-bottom: 2rem;\n    opacity: 0.9;\n  }\n\n  button {\n    background: white;\n    color: #667eea;\n    border: none;\n    padding: 0.75rem 1.5rem;\n    border-radius: 8px;\n    font-weight: 600;\n    cursor: pointer;\n    transition: all 0.2s;\n\n    &:hover {\n      background: #f8f9fa;\n      transform: translateY(-2px);\n    }\n  }\n}\n\n// Screenplay Selector Styles\n.screenplay-selector {\n  padding: 20px;\n  \n  .selector-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    margin-bottom: 20px;\n    \n    h3 {\n      margin: 0;\n      font-size: 1.5rem;\n      color: #333;\n    }\n    \n    .upload-btn {\n      background: #2563eb;\n      color: white;\n      border: none;\n      padding: 10px 20px;\n      border-radius: 8px;\n      cursor: pointer;\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      font-size: 0.95rem;\n      transition: background 0.2s;\n      \n      &:hover {\n        background: #1e40af;\n      }\n      \n      span {\n        font-size: 1.1rem;\n      }\n    }\n  }\n  \n  .empty-state {\n    text-align: center;\n    padding: 60px 20px;\n    \n    .empty-icon {\n      font-size: 4rem;\n      margin-bottom: 20px;\n      opacity: 0.6;\n    }\n    \n    h4 {\n      margin: 0 0 10px 0;\n      color: #333;\n      font-size: 1.3rem;\n    }\n    \n    p {\n      margin: 0 0 30px 0;\n      color: #666;\n      font-size: 1rem;\n    }\n    \n    .upload-btn.primary {\n      background: #2563eb;\n      color: white;\n      border: none;\n      padding: 12px 24px;\n      border-radius: 8px;\n      cursor: pointer;\n      font-size: 1rem;\n      transition: background 0.2s;\n      \n      &:hover {\n        background: #1e40af;\n      }\n    }\n  }\n  \n  .screenplay-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n    gap: 20px;\n    \n    .screenplay-card {\n      background: white;\n      border: 1px solid #e5e7eb;\n      border-radius: 12px;\n      padding: 20px;\n      transition: all 0.2s;\n      cursor: pointer;\n      \n      &:hover {\n        border-color: #2563eb;\n        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);\n        transform: translateY(-2px);\n      }\n      \n      .card-thumbnail {\n        text-align: center;\n        margin-bottom: 15px;\n        \n        .pdf-icon {\n          font-size: 3rem;\n          opacity: 0.7;\n        }\n      }\n      \n      .card-content {\n        .screenplay-name {\n          color: #1a1a1a !important;\n          font-weight: 600;\n          font-size: 1.1rem;\n          margin: 0 0 8px 0;\n        }\n        \n        .upload-date {\n          margin: 0 0 15px 0;\n          font-size: 0.9rem;\n          color: #666;\n        }\n        \n        .card-actions {\n          display: flex;\n          gap: 10px;\n          \n          .open-btn {\n            background: #2563eb;\n            color: white;\n            border: none;\n            padding: 8px 16px;\n            border-radius: 6px;\n            cursor: pointer;\n            font-size: 0.9rem;\n            flex: 1;\n            transition: background 0.2s;\n            \n            &:hover {\n              background: #1e40af;\n            }\n          }\n          \n          .delete-btn {\n            background: #ef4444;\n            color: white;\n            border: none;\n            padding: 8px 16px;\n            border-radius: 6px;\n            cursor: pointer;\n            font-size: 0.9rem;\n            transition: background 0.2s;\n            \n            &:hover {\n              background: #dc2626;\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\n// Screenplay Modal Styles\n.screenplay-modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.8);\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  \n  .screenplay-modal {\n    background: white;\n    border-radius: 12px;\n    width: 95vw;\n    height: 95vh;\n    max-width: 1400px;\n    display: flex;\n    flex-direction: column;\n    overflow: hidden;\n    \n    .modal-header {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      padding: 20px;\n      border-bottom: 1px solid #e5e7eb;\n      background: #f9fafb;\n      \n      h2 {\n        margin: 0;\n        font-size: 1.3rem;\n        color: #333;\n      }\n      \n      .close-btn {\n        background: none;\n        border: none;\n        font-size: 1.5rem;\n        color: #666;\n        cursor: pointer;\n        padding: 5px;\n        border-radius: 4px;\n        transition: background 0.2s;\n        \n        &:hover {\n          background: #e5e7eb;\n          color: #333;\n        }\n      }\n    }\n    \n    .modal-content {\n      width: 420px;\n      max-width: 95vw;\n      background: #fff;\n      border-radius: 18px;\n      box-shadow: 0 8px 32px rgba(0,0,0,0.18);\n      padding: 0;\n      overflow: hidden;\n      display: flex;\n      flex-direction: column;\n    }\n    \n    .modal-body {\n      padding: 1.5rem 2rem;\n      height: 340px;\n      overflow-y: auto;\n      flex: 1 1 auto;\n    }\n    \n    .selected-users {\n      display: flex;\n      flex-wrap: nowrap;\n      gap: 0.5rem;\n      margin-bottom: 0.5rem;\n      max-width: 100%;\n      overflow-x: auto;\n      overflow-y: hidden;\n      min-height: 40px;\n      height: 40px;\n      white-space: nowrap;\n    }\n  }\n}\n\n// Avatar styles\n.avatar {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  overflow: hidden;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: #fff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 600;\n  font-size: 1.1rem;\n}\n.avatar-list {\n  width: 32px;\n  height: 32px;\n  font-size: 1rem;\n}\n.avatar-mini {\n  width: 28px;\n  height: 28px;\n  font-size: 0.9rem;\n}\n.avatar .online-indicator, .avatar-list .online-indicator, .avatar-mini .online-indicator {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  border: 2px solid #fff;\n  background: #10b981;\n  box-shadow: 0 0 0 2px rgba(16,185,129,0.2);\n}\n// Card styles\n.card-standard {\n  background: #fff;\n  border: 1px solid #e5e7eb;\n  border-radius: 10px;\n  box-shadow: 0 1px 4px rgba(30,41,59,0.04);\n  padding: 14px 16px 10px 16px;\n  margin-bottom: 12px;\n  transition: box-shadow 0.18s, border 0.18s;\n  &:hover {\n    box-shadow: 0 2px 8px rgba(30,41,59,0.08);\n    border-color: #cbd5e1;\n  }\n}\n// Nav item active\n.nav-item.active {\n  background: #2563eb;\n  color: #fff;\n  box-shadow: 0 2px 8px rgba(37,99,235,0.10);\n  font-weight: 600;\n}\n// Reduce whitespace in lists\n.collaborators-list, .users-list {\n  gap: 6px;\n  margin-bottom: 6px;\n}\n// Improve text contrast\n.collaborator-name, .user-name, .member-name {\n  color: #1e2937;\n  font-weight: 600;\n}\n\n.workspaces-grid {\n  .workspace-card.selected {\n    .workspace-title,\n    .workspace-type,\n    .workspace-description,\n    .stat,\n    .stat-value,\n    .stat-label {\n      color: #1a1a1a !important;\n    }\n  }\n} "],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 4698:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.collaborative-tasks-hub{padding:2rem;background:#f8fafc;min-height:100vh}.collaborative-tasks-hub .loading-state{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px;gap:1rem}.collaborative-tasks-hub .loading-state .loading-spinner{width:3rem;height:3rem;border:3px solid #e2e8f0;border-top:3px solid #3b82f6;border-radius:50%;animation:spin 1s linear infinite}.collaborative-tasks-hub .loading-state p{color:#64748b;font-size:1rem}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.collaborative-tasks-hub .tasks-header{margin-bottom:2rem}.collaborative-tasks-hub .tasks-header .header-content{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}.collaborative-tasks-hub .tasks-header .header-content .header-left .header-title{font-size:2rem;font-weight:700;color:#1e293b;margin-bottom:.5rem}.collaborative-tasks-hub .tasks-header .header-content .header-left .header-subtitle{color:#64748b;font-size:1rem}.collaborative-tasks-hub .tasks-header .header-content .header-actions .btn-primary{display:flex;align-items:center;gap:.5rem;background:#3b82f6;color:#fff;padding:.75rem 1.5rem;border-radius:.5rem;border:none;font-weight:500;cursor:pointer;transition:all .2s}.collaborative-tasks-hub .tasks-header .header-content .header-actions .btn-primary:hover{background:#2563eb;transform:translateY(-1px)}.collaborative-tasks-hub .tasks-header .header-content .header-actions .btn-primary svg{width:1.25rem;height:1.25rem}.collaborative-tasks-hub .tasks-header .stats-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem}.collaborative-tasks-hub .tasks-header .stats-grid .stat-card{background:#fff;padding:1.5rem;border-radius:.75rem;box-shadow:0 1px 3px rgba(0,0,0,.1);border:1px solid #e2e8f0;display:flex;align-items:center;gap:1rem}.collaborative-tasks-hub .tasks-header .stats-grid .stat-card .stat-icon{width:3rem;height:3rem;border-radius:.5rem;display:flex;align-items:center;justify-content:center}.collaborative-tasks-hub .tasks-header .stats-grid .stat-card .stat-icon.total{background:#dbeafe;color:#1d4ed8}.collaborative-tasks-hub .tasks-header .stats-grid .stat-card .stat-icon.completed{background:#dcfce7;color:#16a34a}.collaborative-tasks-hub .tasks-header .stats-grid .stat-card .stat-icon.in-progress{background:#fef3c7;color:#d97706}.collaborative-tasks-hub .tasks-header .stats-grid .stat-card .stat-icon.overdue{background:#fee2e2;color:#dc2626}.collaborative-tasks-hub .tasks-header .stats-grid .stat-card .stat-content .stat-label{color:#64748b;font-size:.875rem;margin-bottom:.25rem}.collaborative-tasks-hub .tasks-header .stats-grid .stat-card .stat-content .stat-value{font-size:1.5rem;font-weight:700;color:#1e293b}.collaborative-tasks-hub .tasks-controls{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;background:#fff;padding:1.5rem;border-radius:.75rem;box-shadow:0 1px 3px rgba(0,0,0,.1);border:1px solid #e2e8f0}.collaborative-tasks-hub .tasks-controls .controls-left .view-mode-selector{display:flex;gap:.5rem}.collaborative-tasks-hub .tasks-controls .controls-left .view-mode-selector .view-btn{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border:1px solid #e2e8f0;background:#fff;border-radius:.5rem;cursor:pointer;transition:all .2s;font-size:.875rem}.collaborative-tasks-hub .tasks-controls .controls-left .view-mode-selector .view-btn:hover{background:#f8fafc;border-color:#cbd5e1}.collaborative-tasks-hub .tasks-controls .controls-left .view-mode-selector .view-btn.active{background:#3b82f6;color:#fff;border-color:#3b82f6}.collaborative-tasks-hub .tasks-controls .controls-left .view-mode-selector .view-btn svg{width:1.25rem;height:1.25rem}.collaborative-tasks-hub .tasks-controls .controls-right .search-container{display:flex;align-items:center;gap:1rem}.collaborative-tasks-hub .tasks-controls .controls-right .search-container .search-box{position:relative;min-width:220px;flex:1;max-width:350px;display:flex;align-items:center;background:#f8fafc;border-radius:.5rem;border:1px solid #e2e8f0;box-shadow:0 1px 4px rgba(0,0,0,.03);padding:0 .5rem}.collaborative-tasks-hub .tasks-controls .controls-right .search-container .search-box .search-icon{position:absolute;left:.75rem;top:50%;transform:translateY(-50%);color:#64748b;z-index:1;width:1.1em;height:1.1em;pointer-events:none}.collaborative-tasks-hub .tasks-controls .controls-right .search-container .search-box .search-input{padding:.45rem .5rem .45rem 2.2rem;border:none;border-radius:.5rem;width:100%;font-size:.95em;background:rgba(0,0,0,0);box-shadow:none;transition:all .2s ease;height:2.1rem}.collaborative-tasks-hub .tasks-controls .controls-right .search-container .search-box .search-input:focus{outline:none;border:none;background:#fff;box-shadow:0 0 0 2px rgba(59,130,246,.2)}.collaborative-tasks-hub .tasks-controls .controls-right .search-container .search-box .search-input::-moz-placeholder{color:#b6c2d1;font-size:.95em}.collaborative-tasks-hub .tasks-controls .controls-right .search-container .search-box .search-input::placeholder{color:#b6c2d1;font-size:.95em}.collaborative-tasks-hub .tasks-controls .controls-right .search-container .filters{display:flex;gap:.75rem}.collaborative-tasks-hub .tasks-controls .controls-right .search-container .filters .filter-select{padding:.75rem;border:1px solid #e2e8f0;border-radius:.5rem;background:#fff;font-size:.875rem;color:#374151;cursor:pointer;transition:all .2s}.collaborative-tasks-hub .tasks-controls .controls-right .search-container .filters .filter-select:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}.collaborative-tasks-hub .tasks-controls .controls-right .search-container .filters .filter-select:hover{border-color:#cbd5e1}.collaborative-tasks-hub .tasks-content .tasks-list .empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem 2rem;background:#fff;border-radius:.75rem;box-shadow:0 1px 3px rgba(0,0,0,.1);border:1px solid #e2e8f0}.collaborative-tasks-hub .tasks-content .tasks-list .empty-state .empty-icon{color:#94a3b8;margin-bottom:1rem}.collaborative-tasks-hub .tasks-content .tasks-list .empty-state .empty-title{font-size:1.5rem;font-weight:600;color:#374151;margin-bottom:.5rem}.collaborative-tasks-hub .tasks-content .tasks-list .empty-state .empty-description{color:#6b7280;margin-bottom:2rem;text-align:center}.collaborative-tasks-hub .tasks-content .tasks-list .empty-state .btn-primary{background:#3b82f6;color:#fff;padding:.75rem 1.5rem;border-radius:.5rem;border:none;font-weight:500;cursor:pointer;transition:all .2s}.collaborative-tasks-hub .tasks-content .tasks-list .empty-state .btn-primary:hover{background:#2563eb;transform:translateY(-1px)}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid{display:grid;gap:1.5rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:1.5rem;transition:all .2s ease;cursor:pointer;position:relative;overflow:hidden}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card:hover{transform:translateY(-2px);box-shadow:0 10px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04);border-color:#d1d5db}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card.expanded{border-color:#667eea;box-shadow:0 0 0 3px rgba(102,126,234,.1)}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-title-section{flex:1;min-width:0}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-title-section .task-title{font-size:1.125rem;font-weight:600;color:#1f2937;margin:0 0 .5rem 0;line-height:1.4}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-title-section .task-members{display:flex;align-items:center;gap:.5rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-title-section .task-members .members-avatars{display:flex;align-items:center;gap:.25rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-title-section .task-members .members-avatars .member-avatar-container{position:relative;cursor:pointer}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-title-section .task-members .members-avatars .member-avatar-container .member-avatar{width:32px;height:32px;border-radius:50%;-o-object-fit:cover;object-fit:cover;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.1)}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-title-section .task-members .members-avatars .member-avatar-container .member-avatar-bubble{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:.75rem;font-weight:600;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.1);text-transform:uppercase}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-title-section .task-members .members-avatars .member-avatar-container:hover::after{content:attr(title);position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:#1f2937;color:#fff;padding:.5rem;border-radius:6px;font-size:.75rem;white-space:nowrap;z-index:10;margin-bottom:.5rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-title-section .task-members .members-avatars .member-count{background:#f3f4f6;color:#6b7280;padding:.25rem .5rem;border-radius:12px;font-size:.75rem;font-weight:500;border:1px solid #e5e7eb}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-title-section .task-members .no-members{color:#9ca3af;font-size:.875rem;font-style:italic}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-actions{display:flex;align-items:center;gap:.5rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-actions .task-status{padding:.25rem .75rem;border-radius:12px;font-size:.75rem;font-weight:500;text-transform:capitalize}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-actions .task-status.pending{background:#fef3c7;color:#92400e}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-actions .task-status.in_progress{background:#dbeafe;color:#1e40af}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-actions .task-status.completed{background:#d1fae5;color:#065f46}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-actions .task-status.cancelled{background:#fee2e2;color:#991b1b}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-actions .task-status.overdue{background:#fecaca;color:#dc2626}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-actions .expand-icon{width:1.25rem;height:1.25rem;color:#6b7280;transition:transform .2s ease}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-header .task-actions .expand-icon.expanded{transform:rotate(180deg)}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-description{color:#6b7280;font-size:.875rem;line-height:1.5;margin:0 0 1rem 0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-meta{display:flex;align-items:center;gap:1rem;font-size:.75rem;color:#9ca3af}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-meta .task-due-date{display:flex;align-items:center;gap:.25rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-meta .task-due-date::before{content:"📅";font-size:.875rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-meta .subtasks-count{display:flex;align-items:center;gap:.25rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-meta .subtasks-count::before{content:"📋";font-size:.875rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-quick-actions{display:flex;gap:.5rem;margin-top:.75rem;flex-wrap:wrap}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-quick-actions .btn-quick-action{padding:.375rem .75rem;border:none;border-radius:4px;font-size:.75rem;font-weight:500;cursor:pointer;transition:all .2s;white-space:nowrap}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-quick-actions .btn-quick-action.btn-start{background:#3b82f6;color:#fff}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-quick-actions .btn-quick-action.btn-start:hover{background:#2563eb}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-quick-actions .btn-quick-action.btn-complete{background:#10b981;color:#fff}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-quick-actions .btn-quick-action.btn-complete:hover{background:#059669}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-quick-actions .btn-quick-action.btn-edit{background:#f59e0b;color:#fff}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-quick-actions .btn-quick-action.btn-edit:hover{background:#d97706}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-preview .task-quick-actions .btn-quick-action:active{transform:scale(0.95)}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details{border-top:1px solid #f1f5f9;background:#f8fafc}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section{padding:1.5rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-info-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;margin-bottom:2rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-info-grid .info-item{display:flex;flex-direction:column;gap:.25rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-info-grid .info-item .info-label{font-size:.75rem;color:#64748b;font-weight:500;text-transform:uppercase}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-info-grid .info-item .info-value{font-size:.875rem;color:#1e293b;font-weight:500}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-info-grid .info-item .info-value.priority{padding:.25rem .5rem;border-radius:.5rem;font-size:.75rem;font-weight:600;text-transform:uppercase;width:-moz-fit-content;width:fit-content}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-info-grid .info-item .info-value.priority.low{background:#dcfce7;color:#16a34a}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-info-grid .info-item .info-value.priority.medium{background:#fef3c7;color:#d97706}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-info-grid .info-item .info-value.priority.high{background:#fee2e2;color:#dc2626}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-info-grid .info-item .info-value.priority.critical{background:#fecaca;color:#991b1b}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-notes{margin-bottom:2rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-notes h4{font-size:1rem;font-weight:600;color:#1e293b;margin-bottom:.75rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-notes p{color:#64748b;line-height:1.6}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-tags{margin-bottom:2rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-tags h4{font-size:1rem;font-weight:600;color:#1e293b;margin-bottom:.75rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-tags .tags-list{display:flex;flex-wrap:wrap;gap:.5rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-tags .tags-list .tag{background:#e2e8f0;color:#475569;padding:.25rem .75rem;border-radius:1rem;font-size:.75rem;font-weight:500}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-team{margin-bottom:2rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-team h4{font-size:1rem;font-weight:600;color:#1e293b;margin-bottom:.75rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-team .team-members-list{display:flex;flex-direction:column;gap:.75rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-team .team-members-list .team-member-item{display:flex;justify-content:space-between;align-items:center;padding:.75rem;background:#fff;border-radius:.5rem;border:1px solid #e2e8f0}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-team .team-members-list .team-member-item .member-info{display:flex;align-items:center;gap:.75rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-team .team-members-list .team-member-item .member-info .member-avatar{width:2.5rem;height:2.5rem;border-radius:50%;-o-object-fit:cover;object-fit:cover}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-team .team-members-list .team-member-item .member-info .member-bubble{width:2.5rem;height:2.5rem;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:.875rem;font-weight:600}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-team .team-members-list .team-member-item .member-info .member-details{display:flex;flex-direction:column;gap:.25rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-team .team-members-list .team-member-item .member-info .member-details .member-name{font-weight:500;color:#1e293b}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-team .team-members-list .team-member-item .member-info .member-details .member-role{font-size:.75rem;color:#64748b;text-transform:capitalize}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-team .team-members-list .team-member-item .member-notes{font-size:.75rem;color:#64748b;font-style:italic}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-subtasks h4{font-size:1rem;font-weight:600;color:#1e293b;margin-bottom:.75rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-subtasks .subtasks-list{display:flex;flex-direction:column;gap:.75rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-subtasks .subtasks-list .subtask-item{padding:1rem;background:#fff;border-radius:.5rem;border:1px solid #e2e8f0}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-subtasks .subtasks-list .subtask-item .subtask-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-subtasks .subtasks-list .subtask-item .subtask-header h5{font-size:.875rem;font-weight:600;color:#1e293b;margin:0}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-subtasks .subtasks-list .subtask-item .subtask-header .subtask-status{padding:.25rem .5rem;border-radius:.5rem;font-size:.75rem;font-weight:600;text-transform:uppercase}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-subtasks .subtasks-list .subtask-item .subtask-header .subtask-status.pending{background:#fef3c7;color:#d97706}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-subtasks .subtasks-list .subtask-item .subtask-header .subtask-status.in_progress{background:#dbeafe;color:#1d4ed8}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-subtasks .subtasks-list .subtask-item .subtask-header .subtask-status.completed{background:#dcfce7;color:#16a34a}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-subtasks .subtasks-list .subtask-item .subtask-header .subtask-status.cancelled{background:#fee2e2;color:#dc2626}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-subtasks .subtasks-list .subtask-item .subtask-description{color:#64748b;font-size:.75rem;line-height:1.5;margin-bottom:.5rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-subtasks .subtasks-list .subtask-item .subtask-meta{display:flex;gap:1rem;font-size:.75rem;color:#94a3b8}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-details-section .task-subtasks .subtasks-list .subtask-item .subtask-meta .subtask-hours{background:#f1f5f9;padding:.25rem .5rem;border-radius:.5rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section{padding:1.5rem;border-top:1px solid #e2e8f0}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section h4{font-size:1rem;font-weight:600;color:#1e293b;margin-bottom:1rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .comments-list{margin-bottom:1.5rem;max-height:300px;overflow-y:auto}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .comments-list .comment-item{padding:1rem;background:#fff;border-radius:.5rem;border:1px solid #e2e8f0;margin-bottom:.75rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .comments-list .comment-item .comment-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .comments-list .comment-item .comment-header .comment-author{display:flex;align-items:center;gap:.5rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .comments-list .comment-item .comment-header .comment-author .member-avatar{width:1.5rem;height:1.5rem;border-radius:50%;-o-object-fit:cover;object-fit:cover}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .comments-list .comment-item .comment-header .comment-author .member-bubble{width:1.5rem;height:1.5rem;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:.625rem;font-weight:600}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .comments-list .comment-item .comment-header .comment-author .author-name{font-size:.875rem;font-weight:500;color:#1e293b}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .comments-list .comment-item .comment-header .comment-date{font-size:.75rem;color:#94a3b8}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .comments-list .comment-item .comment-content{color:#64748b;font-size:.875rem;line-height:1.5;margin:0}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .comments-list .no-comments{text-align:center;color:#94a3b8;font-style:italic;padding:2rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .add-comment .comment-input{width:100%;padding:.75rem;border:1px solid #e2e8f0;border-radius:.5rem;font-size:.875rem;resize:vertical;min-height:80px;margin-bottom:1rem}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .add-comment .comment-input:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .add-comment .comment-input::-moz-placeholder{color:#94a3b8}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .add-comment .comment-input::placeholder{color:#94a3b8}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .add-comment .comment-actions{display:flex;justify-content:flex-end}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .add-comment .comment-actions .btn-primary{background:#3b82f6;color:#fff;padding:.5rem 1rem;border-radius:.5rem;border:none;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .add-comment .comment-actions .btn-primary:hover:not(:disabled){background:#2563eb}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-comments-section .add-comment .comment-actions .btn-primary:disabled{background:#94a3b8;cursor:not-allowed}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-expanded-actions{padding:1.5rem;border-top:1px solid #e2e8f0;display:flex;gap:.75rem;flex-wrap:wrap}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-expanded-actions .btn-secondary{background:#f1f5f9;color:#475569;padding:.5rem 1rem;border-radius:.5rem;border:1px solid #e2e8f0;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-expanded-actions .btn-secondary:hover{background:#e2e8f0;border-color:#cbd5e1}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-expanded-actions .btn-success{background:#10b981;color:#fff;padding:.5rem 1rem;border-radius:.5rem;border:none;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-expanded-actions .btn-success:hover{background:#059669}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-expanded-actions .btn-danger{background:#ef4444;color:#fff;padding:.5rem 1rem;border-radius:.5rem;border:none;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card .task-expanded-details .task-expanded-actions .btn-danger:hover{background:#dc2626}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card.completed{opacity:.7}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card.completed .task-title.completed{text-decoration:line-through;color:#94a3b8}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card.completed .task-description.completed{text-decoration:line-through;color:#94a3b8}.collaborative-tasks-hub .tasks-content .tasks-list .tasks-grid .task-card.completed .task-status.completed{background:#dcfce7;color:#16a34a}.collaborative-tasks-hub .tasks-content .calendar-view,.collaborative-tasks-hub .tasks-content .kanban-board,.collaborative-tasks-hub .tasks-content .analytics-view{background:#fff;padding:2rem;border-radius:.75rem;box-shadow:0 1px 3px rgba(0,0,0,.1);border:1px solid #e2e8f0;text-align:center;color:#64748b}.collaborative-tasks-hub .completed-tasks-section{margin-top:3rem}.collaborative-tasks-hub .completed-tasks-section .section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}.collaborative-tasks-hub .completed-tasks-section .section-header h3{font-size:1.25rem;font-weight:600;color:#1e293b;margin:0}.collaborative-tasks-hub .completed-tasks-section .section-header .btn-toggle{background:#f1f5f9;color:#475569;padding:.5rem 1rem;border-radius:.5rem;border:1px solid #e2e8f0;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s}.collaborative-tasks-hub .completed-tasks-section .section-header .btn-toggle:hover{background:#e2e8f0;border-color:#cbd5e1}.collaborative-tasks-hub .completed-tasks-section .completed-tasks-grid{display:grid;gap:1rem}.collaborative-tasks-hub .completed-tasks-section .completed-tasks-grid .task-card.completed .task-actions .action-btn{padding:.25rem;border:none;border-radius:.25rem;cursor:pointer;transition:all .2s}.collaborative-tasks-hub .completed-tasks-section .completed-tasks-grid .task-card.completed .task-actions .action-btn.restore{background:#dbeafe;color:#1d4ed8}.collaborative-tasks-hub .completed-tasks-section .completed-tasks-grid .task-card.completed .task-actions .action-btn.restore:hover{background:#bfdbfe}.collaborative-tasks-hub .completed-tasks-section .completed-tasks-grid .task-card.completed .task-actions .action-btn.delete{background:#fee2e2;color:#dc2626}.collaborative-tasks-hub .completed-tasks-section .completed-tasks-grid .task-card.completed .task-actions .action-btn.delete:hover{background:#fecaca}.collaborative-tasks-hub .completed-tasks-section .completed-tasks-grid .task-card.completed .task-actions .action-btn svg{width:1rem;height:1rem}.collaborative-tasks-hub .modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000;padding:1rem}.collaborative-tasks-hub .modal-overlay .modal-content{background:#fff;border-radius:.75rem;box-shadow:0 20px 25px -5px rgba(0,0,0,.1);max-width:90vw;max-height:90vh;overflow:hidden;display:flex;flex-direction:column}.collaborative-tasks-hub .modal-overlay .modal-content.large{width:800px}.collaborative-tasks-hub .modal-overlay .modal-content .modal-header{display:flex;justify-content:space-between;align-items:center;padding:1.5rem;border-bottom:1px solid #e2e8f0}.collaborative-tasks-hub .modal-overlay .modal-content .modal-header h2{font-size:1.25rem;font-weight:600;color:#1e293b;margin:0}.collaborative-tasks-hub .modal-overlay .modal-content .modal-header .modal-close{background:none;border:none;color:#64748b;cursor:pointer;padding:.5rem;border-radius:.25rem;transition:all .2s}.collaborative-tasks-hub .modal-overlay .modal-content .modal-header .modal-close:hover{background:#f1f5f9;color:#374151}.collaborative-tasks-hub .modal-overlay .modal-content .modal-header .modal-close svg{width:1.5rem;height:1.5rem}.collaborative-tasks-hub .modal-overlay .modal-content .modal-body{padding:1.5rem;overflow-y:auto;flex:1}.collaborative-tasks-hub .task-quick-actions{display:flex;gap:.5rem;margin-top:.75rem;flex-wrap:wrap}.collaborative-tasks-hub .task-quick-actions .btn-quick-action{padding:.375rem .75rem;border:none;border-radius:4px;font-size:.75rem;font-weight:500;cursor:pointer;transition:all .2s;white-space:nowrap}.collaborative-tasks-hub .task-quick-actions .btn-quick-action.btn-start{background:#3b82f6;color:#fff}.collaborative-tasks-hub .task-quick-actions .btn-quick-action.btn-start:hover{background:#2563eb}.collaborative-tasks-hub .task-quick-actions .btn-quick-action.btn-complete{background:#10b981;color:#fff}.collaborative-tasks-hub .task-quick-actions .btn-quick-action.btn-complete:hover{background:#059669}.collaborative-tasks-hub .task-quick-actions .btn-quick-action.btn-edit{background:#f59e0b;color:#fff}.collaborative-tasks-hub .task-quick-actions .btn-quick-action.btn-edit:hover{background:#d97706}.collaborative-tasks-hub .task-quick-actions .btn-quick-action:active{transform:scale(0.95)}@media(max-width: 768px){.collaborative-tasks-hub{padding:1rem}.collaborative-tasks-hub .tasks-header .header-content{flex-direction:column;gap:1rem;align-items:flex-start}.collaborative-tasks-hub .tasks-header .header-content .header-actions{width:100%}.collaborative-tasks-hub .tasks-header .stats-grid{grid-template-columns:repeat(2, 1fr)}.collaborative-tasks-hub .tasks-controls{flex-direction:column;gap:1rem}.collaborative-tasks-hub .tasks-controls .controls-right{width:100%}.collaborative-tasks-hub .tasks-controls .controls-right .search-container{flex-direction:column;width:100%}.collaborative-tasks-hub .tasks-controls .controls-right .search-container .search-box{min-width:auto;max-width:none}.collaborative-tasks-hub .tasks-controls .controls-right .search-container .filters{width:100%;justify-content:space-between}.collaborative-tasks-hub .tasks-controls .controls-right .search-container .filters .filter-select{flex:1}.collaborative-tasks-hub .tasks-content .tasks-grid .task-card .task-header .task-title-section{flex-direction:column;gap:.75rem}.collaborative-tasks-hub .tasks-content .tasks-grid .task-card .task-header .task-title-section .task-members{align-self:flex-start}.collaborative-tasks-hub .tasks-content .tasks-grid .task-card .task-expanded-details .task-info-grid{grid-template-columns:1fr}.collaborative-tasks-hub .tasks-content .tasks-grid .task-card .task-expanded-details .task-expanded-actions{flex-direction:column}.collaborative-tasks-hub .tasks-content .tasks-grid .task-card .task-expanded-details .task-expanded-actions button{width:100%}}`, "",{"version":3,"sources":["webpack://./src/components/CollaborativeTasks/CollaborativeTasksHub.scss"],"names":[],"mappings":"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","sourcesContent":[".collaborative-tasks-hub {\n  padding: 2rem;\n  background: #f8fafc;\n  min-height: 100vh;\n\n  .loading-state {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    min-height: 400px;\n    gap: 1rem;\n\n    .loading-spinner {\n      width: 3rem;\n      height: 3rem;\n      border: 3px solid #e2e8f0;\n      border-top: 3px solid #3b82f6;\n      border-radius: 50%;\n      animation: spin 1s linear infinite;\n    }\n\n    p {\n      color: #64748b;\n      font-size: 1rem;\n    }\n  }\n\n  @keyframes spin {\n    0% { transform: rotate(0deg); }\n    100% { transform: rotate(360deg); }\n  }\n\n  .tasks-header {\n    margin-bottom: 2rem;\n\n    .header-content {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 2rem;\n\n      .header-left {\n        .header-title {\n          font-size: 2rem;\n          font-weight: 700;\n          color: #1e293b;\n          margin-bottom: 0.5rem;\n        }\n\n        .header-subtitle {\n          color: #64748b;\n          font-size: 1rem;\n        }\n      }\n\n      .header-actions {\n        .btn-primary {\n          display: flex;\n          align-items: center;\n          gap: 0.5rem;\n          background: #3b82f6;\n          color: white;\n          padding: 0.75rem 1.5rem;\n          border-radius: 0.5rem;\n          border: none;\n          font-weight: 500;\n          cursor: pointer;\n          transition: all 0.2s;\n\n          &:hover {\n            background: #2563eb;\n            transform: translateY(-1px);\n          }\n\n          svg {\n            width: 1.25rem;\n            height: 1.25rem;\n          }\n        }\n      }\n    }\n\n    .stats-grid {\n      display: grid;\n      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n      gap: 1rem;\n\n      .stat-card {\n        background: white;\n        padding: 1.5rem;\n        border-radius: 0.75rem;\n        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n        border: 1px solid #e2e8f0;\n        display: flex;\n        align-items: center;\n        gap: 1rem;\n\n        .stat-icon {\n          width: 3rem;\n          height: 3rem;\n          border-radius: 0.5rem;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n\n          &.total {\n            background: #dbeafe;\n            color: #1d4ed8;\n          }\n\n          &.completed {\n            background: #dcfce7;\n            color: #16a34a;\n          }\n\n          &.in-progress {\n            background: #fef3c7;\n            color: #d97706;\n          }\n\n          &.overdue {\n            background: #fee2e2;\n            color: #dc2626;\n          }\n        }\n\n        .stat-content {\n          .stat-label {\n            color: #64748b;\n            font-size: 0.875rem;\n            margin-bottom: 0.25rem;\n          }\n\n          .stat-value {\n            font-size: 1.5rem;\n            font-weight: 700;\n            color: #1e293b;\n          }\n        }\n      }\n    }\n  }\n\n  .tasks-controls {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    margin-bottom: 2rem;\n    background: white;\n    padding: 1.5rem;\n    border-radius: 0.75rem;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n    border: 1px solid #e2e8f0;\n\n    .controls-left {\n      .view-mode-selector {\n        display: flex;\n        gap: 0.5rem;\n\n        .view-btn {\n          display: flex;\n          align-items: center;\n          gap: 0.5rem;\n          padding: 0.5rem 1rem;\n          border: 1px solid #e2e8f0;\n          background: white;\n          border-radius: 0.5rem;\n          cursor: pointer;\n          transition: all 0.2s;\n          font-size: 0.875rem;\n\n          &:hover {\n            background: #f8fafc;\n            border-color: #cbd5e1;\n          }\n\n          &.active {\n            background: #3b82f6;\n            color: white;\n            border-color: #3b82f6;\n          }\n\n          svg {\n            width: 1.25rem;\n            height: 1.25rem;\n          }\n        }\n      }\n    }\n\n    .controls-right {\n      .search-container {\n        display: flex;\n        align-items: center;\n        gap: 1rem;\n\n        .search-box {\n          position: relative;\n          min-width: 220px;\n          flex: 1;\n          max-width: 350px;\n          display: flex;\n          align-items: center;\n          background: #f8fafc;\n          border-radius: 0.5rem;\n          border: 1px solid #e2e8f0;\n          box-shadow: 0 1px 4px rgba(0,0,0,0.03);\n          padding: 0 0.5rem;\n\n          .search-icon {\n            position: absolute;\n            left: 0.75rem;\n            top: 50%;\n            transform: translateY(-50%);\n            color: #64748b;\n            z-index: 1;\n            width: 1.1em;\n            height: 1.1em;\n            pointer-events: none;\n          }\n\n          .search-input {\n            padding: 0.45rem 0.5rem 0.45rem 2.2rem;\n            border: none;\n            border-radius: 0.5rem;\n            width: 100%;\n            font-size: 0.95em;\n            background: transparent;\n            box-shadow: none;\n            transition: all 0.2s ease;\n            height: 2.1rem;\n\n            &:focus {\n              outline: none;\n              border: none;\n              background: #fff;\n              box-shadow: 0 0 0 2px #3b82f633;\n            }\n\n            &::placeholder {\n              color: #b6c2d1;\n              font-size: 0.95em;\n            }\n          }\n        }\n\n        .filters {\n          display: flex;\n          gap: 0.75rem;\n\n          .filter-select {\n            padding: 0.75rem;\n            border: 1px solid #e2e8f0;\n            border-radius: 0.5rem;\n            background: white;\n            font-size: 0.875rem;\n            color: #374151;\n            cursor: pointer;\n            transition: all 0.2s;\n\n            &:focus {\n              outline: none;\n              border-color: #3b82f6;\n              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n            }\n\n            &:hover {\n              border-color: #cbd5e1;\n            }\n          }\n        }\n      }\n    }\n  }\n\n  .tasks-content {\n    .tasks-list {\n      .empty-state {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        padding: 4rem 2rem;\n        background: white;\n        border-radius: 0.75rem;\n        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n        border: 1px solid #e2e8f0;\n\n        .empty-icon {\n          color: #94a3b8;\n          margin-bottom: 1rem;\n        }\n\n        .empty-title {\n          font-size: 1.5rem;\n          font-weight: 600;\n          color: #374151;\n          margin-bottom: 0.5rem;\n        }\n\n        .empty-description {\n          color: #6b7280;\n          margin-bottom: 2rem;\n          text-align: center;\n        }\n\n        .btn-primary {\n          background: #3b82f6;\n          color: white;\n          padding: 0.75rem 1.5rem;\n          border-radius: 0.5rem;\n          border: none;\n          font-weight: 500;\n          cursor: pointer;\n          transition: all 0.2s;\n\n          &:hover {\n            background: #2563eb;\n            transform: translateY(-1px);\n          }\n        }\n      }\n\n      .tasks-grid {\n        display: grid;\n        gap: 1.5rem;\n\n        .task-card {\n          background: white;\n          border: 1px solid #e5e7eb;\n          border-radius: 12px;\n          padding: 1.5rem;\n          transition: all 0.2s ease;\n          cursor: pointer;\n          position: relative;\n          overflow: hidden;\n\n          &:hover {\n            transform: translateY(-2px);\n            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n            border-color: #d1d5db;\n          }\n\n          &.expanded {\n            border-color: #667eea;\n            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);\n          }\n\n          .task-header {\n            display: flex;\n            justify-content: space-between;\n            align-items: flex-start;\n            margin-bottom: 1rem;\n\n            .task-title-section {\n              flex: 1;\n              min-width: 0;\n\n              .task-title {\n                font-size: 1.125rem;\n                font-weight: 600;\n                color: #1f2937;\n                margin: 0 0 0.5rem 0;\n                line-height: 1.4;\n              }\n\n              .task-members {\n                display: flex;\n                align-items: center;\n                gap: 0.5rem;\n\n                .members-avatars {\n                  display: flex;\n                  align-items: center;\n                  gap: 0.25rem;\n\n                  .member-avatar-container {\n                    position: relative;\n                    cursor: pointer;\n\n                    .member-avatar {\n                      width: 32px;\n                      height: 32px;\n                      border-radius: 50%;\n                      object-fit: cover;\n                      border: 2px solid white;\n                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n                    }\n\n                    .member-avatar-bubble {\n                      width: 32px;\n                      height: 32px;\n                      border-radius: 50%;\n                      display: flex;\n                      align-items: center;\n                      justify-content: center;\n                      color: white;\n                      font-size: 0.75rem;\n                      font-weight: 600;\n                      border: 2px solid white;\n                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n                      text-transform: uppercase;\n                    }\n\n                    &:hover::after {\n                      content: attr(title);\n                      position: absolute;\n                      bottom: 100%;\n                      left: 50%;\n                      transform: translateX(-50%);\n                      background: #1f2937;\n                      color: white;\n                      padding: 0.5rem;\n                      border-radius: 6px;\n                      font-size: 0.75rem;\n                      white-space: nowrap;\n                      z-index: 10;\n                      margin-bottom: 0.5rem;\n                    }\n                  }\n\n                  .member-count {\n                    background: #f3f4f6;\n                    color: #6b7280;\n                    padding: 0.25rem 0.5rem;\n                    border-radius: 12px;\n                    font-size: 0.75rem;\n                    font-weight: 500;\n                    border: 1px solid #e5e7eb;\n                  }\n                }\n\n                .no-members {\n                  color: #9ca3af;\n                  font-size: 0.875rem;\n                  font-style: italic;\n                }\n              }\n            }\n\n            .task-actions {\n              display: flex;\n              align-items: center;\n              gap: 0.5rem;\n\n              .task-status {\n                padding: 0.25rem 0.75rem;\n                border-radius: 12px;\n                font-size: 0.75rem;\n                font-weight: 500;\n                text-transform: capitalize;\n\n                &.pending {\n                  background: #fef3c7;\n                  color: #92400e;\n                }\n\n                &.in_progress {\n                  background: #dbeafe;\n                  color: #1e40af;\n                }\n\n                &.completed {\n                  background: #d1fae5;\n                  color: #065f46;\n                }\n\n                &.cancelled {\n                  background: #fee2e2;\n                  color: #991b1b;\n                }\n\n                &.overdue {\n                  background: #fecaca;\n                  color: #dc2626;\n                }\n              }\n\n              .expand-icon {\n                width: 1.25rem;\n                height: 1.25rem;\n                color: #6b7280;\n                transition: transform 0.2s ease;\n\n                &.expanded {\n                  transform: rotate(180deg);\n                }\n              }\n            }\n          }\n\n          .task-preview {\n            .task-description {\n              color: #6b7280;\n              font-size: 0.875rem;\n              line-height: 1.5;\n              margin: 0 0 1rem 0;\n              display: -webkit-box;\n              -webkit-line-clamp: 2;\n              -webkit-box-orient: vertical;\n              overflow: hidden;\n            }\n\n            .task-meta {\n              display: flex;\n              align-items: center;\n              gap: 1rem;\n              font-size: 0.75rem;\n              color: #9ca3af;\n\n              .task-due-date {\n                display: flex;\n                align-items: center;\n                gap: 0.25rem;\n\n                &::before {\n                  content: '📅';\n                  font-size: 0.875rem;\n                }\n              }\n\n              .subtasks-count {\n                display: flex;\n                align-items: center;\n                gap: 0.25rem;\n\n                &::before {\n                  content: '📋';\n                  font-size: 0.875rem;\n                }\n              }\n            }\n\n            .task-quick-actions {\n              display: flex;\n              gap: 0.5rem;\n              margin-top: 0.75rem;\n              flex-wrap: wrap;\n\n              .btn-quick-action {\n                padding: 0.375rem 0.75rem;\n                border: none;\n                border-radius: 4px;\n                font-size: 0.75rem;\n                font-weight: 500;\n                cursor: pointer;\n                transition: all 0.2s;\n                white-space: nowrap;\n\n                &.btn-start {\n                  background: #3b82f6;\n                  color: white;\n\n                  &:hover {\n                    background: #2563eb;\n                  }\n                }\n\n                &.btn-complete {\n                  background: #10b981;\n                  color: white;\n\n                  &:hover {\n                    background: #059669;\n                  }\n                }\n\n                &.btn-edit {\n                  background: #f59e0b;\n                  color: white;\n\n                  &:hover {\n                    background: #d97706;\n                  }\n                }\n\n                &:active {\n                  transform: scale(0.95);\n                }\n              }\n            }\n          }\n\n          .task-expanded-details {\n            border-top: 1px solid #f1f5f9;\n            background: #f8fafc;\n\n            .task-details-section {\n              padding: 1.5rem;\n\n              .task-info-grid {\n                display: grid;\n                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n                gap: 1rem;\n                margin-bottom: 2rem;\n\n                .info-item {\n                  display: flex;\n                  flex-direction: column;\n                  gap: 0.25rem;\n\n                  .info-label {\n                    font-size: 0.75rem;\n                    color: #64748b;\n                    font-weight: 500;\n                    text-transform: uppercase;\n                  }\n\n                  .info-value {\n                    font-size: 0.875rem;\n                    color: #1e293b;\n                    font-weight: 500;\n\n                    &.priority {\n                      padding: 0.25rem 0.5rem;\n                      border-radius: 0.5rem;\n                      font-size: 0.75rem;\n                      font-weight: 600;\n                      text-transform: uppercase;\n                      width: fit-content;\n\n                      &.low {\n                        background: #dcfce7;\n                        color: #16a34a;\n                      }\n\n                      &.medium {\n                        background: #fef3c7;\n                        color: #d97706;\n                      }\n\n                      &.high {\n                        background: #fee2e2;\n                        color: #dc2626;\n                      }\n\n                      &.critical {\n                        background: #fecaca;\n                        color: #991b1b;\n                      }\n                    }\n                  }\n                }\n              }\n\n              .task-notes {\n                margin-bottom: 2rem;\n\n                h4 {\n                  font-size: 1rem;\n                  font-weight: 600;\n                  color: #1e293b;\n                  margin-bottom: 0.75rem;\n                }\n\n                p {\n                  color: #64748b;\n                  line-height: 1.6;\n                }\n              }\n\n              .task-tags {\n                margin-bottom: 2rem;\n\n                h4 {\n                  font-size: 1rem;\n                  font-weight: 600;\n                  color: #1e293b;\n                  margin-bottom: 0.75rem;\n                }\n\n                .tags-list {\n                  display: flex;\n                  flex-wrap: wrap;\n                  gap: 0.5rem;\n\n                  .tag {\n                    background: #e2e8f0;\n                    color: #475569;\n                    padding: 0.25rem 0.75rem;\n                    border-radius: 1rem;\n                    font-size: 0.75rem;\n                    font-weight: 500;\n                  }\n                }\n              }\n\n              .task-team {\n                margin-bottom: 2rem;\n\n                h4 {\n                  font-size: 1rem;\n                  font-weight: 600;\n                  color: #1e293b;\n                  margin-bottom: 0.75rem;\n                }\n\n                .team-members-list {\n                  display: flex;\n                  flex-direction: column;\n                  gap: 0.75rem;\n\n                  .team-member-item {\n                    display: flex;\n                    justify-content: space-between;\n                    align-items: center;\n                    padding: 0.75rem;\n                    background: white;\n                    border-radius: 0.5rem;\n                    border: 1px solid #e2e8f0;\n\n                    .member-info {\n                      display: flex;\n                      align-items: center;\n                      gap: 0.75rem;\n\n                      .member-avatar {\n                        width: 2.5rem;\n                        height: 2.5rem;\n                        border-radius: 50%;\n                        object-fit: cover;\n                      }\n\n                      .member-bubble {\n                        width: 2.5rem;\n                        height: 2.5rem;\n                        border-radius: 50%;\n                        display: flex;\n                        align-items: center;\n                        justify-content: center;\n                        color: white;\n                        font-size: 0.875rem;\n                        font-weight: 600;\n                      }\n\n                      .member-details {\n                        display: flex;\n                        flex-direction: column;\n                        gap: 0.25rem;\n\n                        .member-name {\n                          font-weight: 500;\n                          color: #1e293b;\n                        }\n\n                        .member-role {\n                          font-size: 0.75rem;\n                          color: #64748b;\n                          text-transform: capitalize;\n                        }\n                      }\n                    }\n\n                    .member-notes {\n                      font-size: 0.75rem;\n                      color: #64748b;\n                      font-style: italic;\n                    }\n                  }\n                }\n              }\n\n              .task-subtasks {\n                h4 {\n                  font-size: 1rem;\n                  font-weight: 600;\n                  color: #1e293b;\n                  margin-bottom: 0.75rem;\n                }\n\n                .subtasks-list {\n                  display: flex;\n                  flex-direction: column;\n                  gap: 0.75rem;\n\n                  .subtask-item {\n                    padding: 1rem;\n                    background: white;\n                    border-radius: 0.5rem;\n                    border: 1px solid #e2e8f0;\n\n                    .subtask-header {\n                      display: flex;\n                      justify-content: space-between;\n                      align-items: center;\n                      margin-bottom: 0.5rem;\n\n                      h5 {\n                        font-size: 0.875rem;\n                        font-weight: 600;\n                        color: #1e293b;\n                        margin: 0;\n                      }\n\n                      .subtask-status {\n                        padding: 0.25rem 0.5rem;\n                        border-radius: 0.5rem;\n                        font-size: 0.75rem;\n                        font-weight: 600;\n                        text-transform: uppercase;\n\n                        &.pending {\n                          background: #fef3c7;\n                          color: #d97706;\n                        }\n\n                        &.in_progress {\n                          background: #dbeafe;\n                          color: #1d4ed8;\n                        }\n\n                        &.completed {\n                          background: #dcfce7;\n                          color: #16a34a;\n                        }\n\n                        &.cancelled {\n                          background: #fee2e2;\n                          color: #dc2626;\n                        }\n                      }\n                    }\n\n                    .subtask-description {\n                      color: #64748b;\n                      font-size: 0.75rem;\n                      line-height: 1.5;\n                      margin-bottom: 0.5rem;\n                    }\n\n                    .subtask-meta {\n                      display: flex;\n                      gap: 1rem;\n                      font-size: 0.75rem;\n                      color: #94a3b8;\n\n                      .subtask-hours {\n                        background: #f1f5f9;\n                        padding: 0.25rem 0.5rem;\n                        border-radius: 0.5rem;\n                      }\n                    }\n                  }\n                }\n              }\n            }\n\n            .task-comments-section {\n              padding: 1.5rem;\n              border-top: 1px solid #e2e8f0;\n\n              h4 {\n                font-size: 1rem;\n                font-weight: 600;\n                color: #1e293b;\n                margin-bottom: 1rem;\n              }\n\n              .comments-list {\n                margin-bottom: 1.5rem;\n                max-height: 300px;\n                overflow-y: auto;\n\n                .comment-item {\n                  padding: 1rem;\n                  background: white;\n                  border-radius: 0.5rem;\n                  border: 1px solid #e2e8f0;\n                  margin-bottom: 0.75rem;\n\n                  .comment-header {\n                    display: flex;\n                    justify-content: space-between;\n                    align-items: center;\n                    margin-bottom: 0.5rem;\n\n                    .comment-author {\n                      display: flex;\n                      align-items: center;\n                      gap: 0.5rem;\n\n                      .member-avatar {\n                        width: 1.5rem;\n                        height: 1.5rem;\n                        border-radius: 50%;\n                        object-fit: cover;\n                      }\n\n                      .member-bubble {\n                        width: 1.5rem;\n                        height: 1.5rem;\n                        border-radius: 50%;\n                        display: flex;\n                        align-items: center;\n                        justify-content: center;\n                        color: white;\n                        font-size: 0.625rem;\n                        font-weight: 600;\n                      }\n\n                      .author-name {\n                        font-size: 0.875rem;\n                        font-weight: 500;\n                        color: #1e293b;\n                      }\n                    }\n\n                    .comment-date {\n                      font-size: 0.75rem;\n                      color: #94a3b8;\n                    }\n                  }\n\n                  .comment-content {\n                    color: #64748b;\n                    font-size: 0.875rem;\n                    line-height: 1.5;\n                    margin: 0;\n                  }\n                }\n\n                .no-comments {\n                  text-align: center;\n                  color: #94a3b8;\n                  font-style: italic;\n                  padding: 2rem;\n                }\n              }\n\n              .add-comment {\n                .comment-input {\n                  width: 100%;\n                  padding: 0.75rem;\n                  border: 1px solid #e2e8f0;\n                  border-radius: 0.5rem;\n                  font-size: 0.875rem;\n                  resize: vertical;\n                  min-height: 80px;\n                  margin-bottom: 1rem;\n\n                  &:focus {\n                    outline: none;\n                    border-color: #3b82f6;\n                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n                  }\n\n                  &::placeholder {\n                    color: #94a3b8;\n                  }\n                }\n\n                .comment-actions {\n                  display: flex;\n                  justify-content: flex-end;\n\n                  .btn-primary {\n                    background: #3b82f6;\n                    color: white;\n                    padding: 0.5rem 1rem;\n                    border-radius: 0.5rem;\n                    border: none;\n                    font-size: 0.875rem;\n                    font-weight: 500;\n                    cursor: pointer;\n                    transition: all 0.2s;\n\n                    &:hover:not(:disabled) {\n                      background: #2563eb;\n                    }\n\n                    &:disabled {\n                      background: #94a3b8;\n                      cursor: not-allowed;\n                    }\n                  }\n                }\n              }\n            }\n\n            .task-expanded-actions {\n              padding: 1.5rem;\n              border-top: 1px solid #e2e8f0;\n              display: flex;\n              gap: 0.75rem;\n              flex-wrap: wrap;\n\n              .btn-secondary {\n                background: #f1f5f9;\n                color: #475569;\n                padding: 0.5rem 1rem;\n                border-radius: 0.5rem;\n                border: 1px solid #e2e8f0;\n                font-size: 0.875rem;\n                font-weight: 500;\n                cursor: pointer;\n                transition: all 0.2s;\n\n                &:hover {\n                  background: #e2e8f0;\n                  border-color: #cbd5e1;\n                }\n              }\n\n              .btn-success {\n                background: #10b981;\n                color: white;\n                padding: 0.5rem 1rem;\n                border-radius: 0.5rem;\n                border: none;\n                font-size: 0.875rem;\n                font-weight: 500;\n                cursor: pointer;\n                transition: all 0.2s;\n\n                &:hover {\n                  background: #059669;\n                }\n              }\n\n              .btn-danger {\n                background: #ef4444;\n                color: white;\n                padding: 0.5rem 1rem;\n                border-radius: 0.5rem;\n                border: none;\n                font-size: 0.875rem;\n                font-weight: 500;\n                cursor: pointer;\n                transition: all 0.2s;\n\n                &:hover {\n                  background: #dc2626;\n                }\n              }\n            }\n          }\n\n          &.completed {\n            opacity: 0.7;\n\n            .task-title.completed {\n              text-decoration: line-through;\n              color: #94a3b8;\n            }\n\n            .task-description.completed {\n              text-decoration: line-through;\n              color: #94a3b8;\n            }\n\n            .task-status.completed {\n              background: #dcfce7;\n              color: #16a34a;\n            }\n          }\n        }\n      }\n    }\n\n    .calendar-view,\n    .kanban-board,\n    .analytics-view {\n      background: white;\n      padding: 2rem;\n      border-radius: 0.75rem;\n      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n      border: 1px solid #e2e8f0;\n      text-align: center;\n      color: #64748b;\n    }\n  }\n\n  .completed-tasks-section {\n    margin-top: 3rem;\n\n    .section-header {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 1.5rem;\n\n      h3 {\n        font-size: 1.25rem;\n        font-weight: 600;\n        color: #1e293b;\n        margin: 0;\n      }\n\n      .btn-toggle {\n        background: #f1f5f9;\n        color: #475569;\n        padding: 0.5rem 1rem;\n        border-radius: 0.5rem;\n        border: 1px solid #e2e8f0;\n        font-size: 0.875rem;\n        font-weight: 500;\n        cursor: pointer;\n        transition: all 0.2s;\n\n        &:hover {\n          background: #e2e8f0;\n          border-color: #cbd5e1;\n        }\n      }\n    }\n\n    .completed-tasks-grid {\n      display: grid;\n      gap: 1rem;\n\n      .task-card.completed {\n        .task-actions {\n          .action-btn {\n            padding: 0.25rem;\n            border: none;\n            border-radius: 0.25rem;\n            cursor: pointer;\n            transition: all 0.2s;\n\n            &.restore {\n              background: #dbeafe;\n              color: #1d4ed8;\n\n              &:hover {\n                background: #bfdbfe;\n              }\n            }\n\n            &.delete {\n              background: #fee2e2;\n              color: #dc2626;\n\n              &:hover {\n                background: #fecaca;\n              }\n            }\n\n            svg {\n              width: 1rem;\n              height: 1rem;\n            }\n          }\n        }\n      }\n    }\n  }\n\n  // Modal styles\n  .modal-overlay {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background: rgba(0, 0, 0, 0.5);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 1000;\n    padding: 1rem;\n\n    .modal-content {\n      background: white;\n      border-radius: 0.75rem;\n      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);\n      max-width: 90vw;\n      max-height: 90vh;\n      overflow: hidden;\n      display: flex;\n      flex-direction: column;\n\n      &.large {\n        width: 800px;\n      }\n\n      .modal-header {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        padding: 1.5rem;\n        border-bottom: 1px solid #e2e8f0;\n\n        h2 {\n          font-size: 1.25rem;\n          font-weight: 600;\n          color: #1e293b;\n          margin: 0;\n        }\n\n        .modal-close {\n          background: none;\n          border: none;\n          color: #64748b;\n          cursor: pointer;\n          padding: 0.5rem;\n          border-radius: 0.25rem;\n          transition: all 0.2s;\n\n          &:hover {\n            background: #f1f5f9;\n            color: #374151;\n          }\n\n          svg {\n            width: 1.5rem;\n            height: 1.5rem;\n          }\n        }\n      }\n\n      .modal-body {\n        padding: 1.5rem;\n        overflow-y: auto;\n        flex: 1;\n      }\n    }\n  }\n\n  // Quick action buttons for task preview\n  .task-quick-actions {\n    display: flex;\n    gap: 0.5rem;\n    margin-top: 0.75rem;\n    flex-wrap: wrap;\n\n    .btn-quick-action {\n      padding: 0.375rem 0.75rem;\n      border: none;\n      border-radius: 4px;\n      font-size: 0.75rem;\n      font-weight: 500;\n      cursor: pointer;\n      transition: all 0.2s;\n      white-space: nowrap;\n\n      &.btn-start {\n        background: #3b82f6;\n        color: white;\n\n        &:hover {\n          background: #2563eb;\n        }\n      }\n\n      &.btn-complete {\n        background: #10b981;\n        color: white;\n\n        &:hover {\n          background: #059669;\n        }\n      }\n\n      &.btn-edit {\n        background: #f59e0b;\n        color: white;\n\n        &:hover {\n          background: #d97706;\n        }\n      }\n\n      &:active {\n        transform: scale(0.95);\n      }\n    }\n  }\n\n  // Responsive design\n  @media (max-width: 768px) {\n    padding: 1rem;\n\n    .tasks-header {\n      .header-content {\n        flex-direction: column;\n        gap: 1rem;\n        align-items: flex-start;\n\n        .header-actions {\n          width: 100%;\n        }\n      }\n\n      .stats-grid {\n        grid-template-columns: repeat(2, 1fr);\n      }\n    }\n\n    .tasks-controls {\n      flex-direction: column;\n      gap: 1rem;\n\n      .controls-right {\n        width: 100%;\n\n        .search-container {\n          flex-direction: column;\n          width: 100%;\n\n          .search-box {\n            min-width: auto;\n            max-width: none;\n          }\n\n          .filters {\n            width: 100%;\n            justify-content: space-between;\n\n            .filter-select {\n              flex: 1;\n            }\n          }\n        }\n      }\n    }\n\n    .tasks-content {\n      .tasks-grid {\n        .task-card {\n          .task-header {\n            .task-title-section {\n              flex-direction: column;\n              gap: 0.75rem;\n\n              .task-members {\n                align-self: flex-start;\n              }\n            }\n          }\n\n          .task-expanded-details {\n            .task-info-grid {\n              grid-template-columns: 1fr;\n            }\n\n            .task-expanded-actions {\n              flex-direction: column;\n\n              button {\n                width: 100%;\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n} "],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 8434:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 8597:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.task-form-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:1rem}.task-form-modal{background:#fff;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04);max-width:800px;width:100%;max-height:90vh;overflow-y:auto;animation:slideIn .3s ease-out}.task-form-modal .form-header{display:flex;justify-content:space-between;align-items:center;padding:1.5rem 2rem;border-bottom:1px solid #e5e7eb;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;border-radius:16px 16px 0 0}.task-form-modal .form-header h2{margin:0;font-size:1.5rem;font-weight:600}.task-form-modal .form-header .close-btn{background:none;border:none;color:#fff;cursor:pointer;padding:.5rem;border-radius:50%;transition:all .2s ease;display:flex;align-items:center;justify-content:center}.task-form-modal .form-header .close-btn:hover{background:hsla(0,0%,100%,.1);transform:scale(1.1)}.task-form-modal .form-header .close-btn svg{width:1.5rem;height:1.5rem}.task-form-modal .form-content{padding:2rem}.task-form-modal .form-content .form-section{margin-bottom:2rem}.task-form-modal .form-content .form-section h3{font-size:1.25rem;font-weight:600;color:#1f2937;margin:0 0 1rem 0;padding-bottom:.5rem;border-bottom:2px solid #e5e7eb;position:relative}.task-form-modal .form-content .form-section h3::after{content:"";position:absolute;bottom:-2px;left:0;width:50px;height:2px;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%)}.task-form-modal .form-content .form-section .section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}.task-form-modal .form-content .form-section .section-header h3{margin:0;border:none;padding:0}.task-form-modal .form-content .form-section .section-header h3::after{display:none}.task-form-modal .form-content .form-section .section-header .btn-add{background:linear-gradient(135deg, #10b981 0%, #059669 100%);color:#fff;border:none;padding:.5rem 1rem;border-radius:8px;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s ease;display:flex;align-items:center;gap:.5rem}.task-form-modal .form-content .form-section .section-header .btn-add:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(16,185,129,.3)}.task-form-modal .form-content .form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}.task-form-modal .form-content .form-row.full-width{grid-template-columns:1fr}@media(max-width: 768px){.task-form-modal .form-content .form-row{grid-template-columns:1fr}}.task-form-modal .form-content .form-group.full-width{grid-column:1/-1}.task-form-modal .form-content .form-group label{display:block;font-size:.875rem;font-weight:500;color:#374151;margin-bottom:.5rem}.task-form-modal .form-content .form-group .form-input,.task-form-modal .form-content .form-group .form-select,.task-form-modal .form-content .form-group .form-textarea{width:100%;padding:.75rem;border:2px solid #e5e7eb;border-radius:8px;font-size:.875rem;transition:all .2s ease;background:#fff}.task-form-modal .form-content .form-group .form-input:focus,.task-form-modal .form-content .form-group .form-select:focus,.task-form-modal .form-content .form-group .form-textarea:focus{outline:none;border-color:#667eea;box-shadow:0 0 0 3px rgba(102,126,234,.1)}.task-form-modal .form-content .form-group .form-input::-moz-placeholder, .task-form-modal .form-content .form-group .form-select::-moz-placeholder, .task-form-modal .form-content .form-group .form-textarea::-moz-placeholder{color:#9ca3af}.task-form-modal .form-content .form-group .form-input::placeholder,.task-form-modal .form-content .form-group .form-select::placeholder,.task-form-modal .form-content .form-group .form-textarea::placeholder{color:#9ca3af}.task-form-modal .form-content .form-group .form-textarea{resize:vertical;min-height:80px;font-family:inherit}.task-form-modal .form-content .form-group .form-select{cursor:pointer;appearance:auto;-webkit-appearance:auto;-moz-appearance:auto}.task-form-modal .form-content .form-group .form-select.small{padding:.5rem;font-size:.8rem}.task-form-modal .form-content .team-member-item{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:1rem;margin-bottom:1rem}.task-form-modal .form-content .team-member-item .form-row{grid-template-columns:1fr 1fr auto;gap:1rem;align-items:end}@media(max-width: 768px){.task-form-modal .form-content .team-member-item .form-row{grid-template-columns:1fr}}.task-form-modal .form-content .team-member-item .btn-remove{background:#ef4444;color:#fff;border:none;padding:.5rem 1rem;border-radius:6px;font-size:.875rem;cursor:pointer;transition:all .2s ease;white-space:nowrap}.task-form-modal .form-content .team-member-item .btn-remove:hover{background:#dc2626;transform:translateY(-1px)}.task-form-modal .form-content .subtask-item{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:1rem;margin-bottom:1rem;transition:all .2s ease}.task-form-modal .form-content .subtask-item.completed{background:#f0fdf4;border-color:#bbf7d0}.task-form-modal .form-content .subtask-item.completed .subtask-title-input{text-decoration:line-through;color:#6b7280}.task-form-modal .form-content .subtask-item .subtask-header{margin-bottom:1rem}.task-form-modal .form-content .subtask-item .subtask-header .subtask-title-section{display:flex;justify-content:space-between;align-items:center;gap:1rem}.task-form-modal .form-content .subtask-item .subtask-header .subtask-title-section .subtask-title-input{flex:1;font-size:1rem;font-weight:500;border:none;background:rgba(0,0,0,0);padding:.5rem;border-radius:4px;transition:all .2s ease}.task-form-modal .form-content .subtask-item .subtask-header .subtask-title-section .subtask-title-input:focus{outline:none;background:#fff;box-shadow:0 0 0 2px rgba(102,126,234,.1)}.task-form-modal .form-content .subtask-item .subtask-header .subtask-title-section .subtask-actions{display:flex;gap:.5rem;align-items:center}.task-form-modal .form-content .subtask-item .subtask-header .subtask-title-section .subtask-actions .btn-complete-subtask{background:#10b981;color:#fff;border:none;padding:.25rem;border-radius:4px;cursor:pointer;transition:all .2s ease;display:flex;align-items:center;justify-content:center}.task-form-modal .form-content .subtask-item .subtask-header .subtask-title-section .subtask-actions .btn-complete-subtask:hover{background:#059669;transform:scale(1.1)}.task-form-modal .form-content .subtask-item .subtask-header .subtask-title-section .subtask-actions .btn-complete-subtask svg{width:1rem;height:1rem}.task-form-modal .form-content .subtask-item .subtask-header .subtask-title-section .subtask-actions .btn-remove-small{background:#ef4444;color:#fff;border:none;width:24px;height:24px;border-radius:50%;cursor:pointer;font-size:1rem;font-weight:bold;display:flex;align-items:center;justify-content:center;transition:all .2s ease}.task-form-modal .form-content .subtask-item .subtask-header .subtask-title-section .subtask-actions .btn-remove-small:hover{background:#dc2626;transform:scale(1.1)}.task-form-modal .form-content .subtask-item .subtask-description-input{width:100%;border:1px solid #e5e7eb;border-radius:6px;padding:.5rem;font-size:.875rem;resize:vertical;min-height:60px;margin-bottom:1rem;font-family:inherit}.task-form-modal .form-content .subtask-item .subtask-description-input:focus{outline:none;border-color:#667eea;box-shadow:0 0 0 2px rgba(102,126,234,.1)}.task-form-modal .form-content .subtask-item .subtask-controls .subtask-row{display:grid;grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:1rem;margin-bottom:1rem}@media(max-width: 768px){.task-form-modal .form-content .subtask-item .subtask-controls .subtask-row{grid-template-columns:1fr}}.task-form-modal .form-content .subtask-item .subtask-controls .form-group label{font-size:.8rem;margin-bottom:.25rem}.task-form-modal .form-content .subtask-item .subtask-controls .form-group .form-input.small,.task-form-modal .form-content .subtask-item .subtask-controls .form-group .form-select.small{padding:.5rem;font-size:.8rem}.task-form-modal .form-content .empty-state{text-align:center;padding:2rem;color:#6b7280}.task-form-modal .form-content .empty-state p{margin:.5rem 0;font-size:.875rem}.task-form-modal .form-content .form-actions{display:flex;justify-content:flex-end;gap:1rem;margin-top:2rem;padding-top:1rem;border-top:1px solid #e5e7eb}.task-form-modal .form-content .form-actions .btn-cancel{background:#6b7280;color:#fff;border:none;padding:.75rem 1.5rem;border-radius:8px;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s ease}.task-form-modal .form-content .form-actions .btn-cancel:hover{background:#4b5563;transform:translateY(-1px)}.task-form-modal .form-content .form-actions .btn-submit{background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;border:none;padding:.75rem 1.5rem;border-radius:8px;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s ease}.task-form-modal .form-content .form-actions .btn-submit:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(102,126,234,.3)}.task-form-modal .form-content .form-actions .btn-submit:disabled{opacity:.6;cursor:not-allowed;transform:none}.subtask-modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.8);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1100;padding:1rem}.subtask-modal{background:#fff;border-radius:12px;box-shadow:0 25px 50px -12px rgba(0,0,0,.25);max-width:500px;width:100%;animation:slideIn .3s ease-out}.subtask-modal .modal-header{display:flex;justify-content:space-between;align-items:center;padding:1.5rem;border-bottom:1px solid #e5e7eb;background:#f9fafb}.subtask-modal .modal-header h3{margin:0;font-size:1.25rem;font-weight:600;color:#1f2937}.subtask-modal .modal-header .close-btn{background:none;border:none;color:#6b7280;cursor:pointer;font-size:1.5rem;padding:.25rem;border-radius:4px;transition:all .2s ease}.subtask-modal .modal-header .close-btn:hover{background:#e5e7eb;color:#374151}.subtask-modal .modal-body{padding:1.5rem}.subtask-modal .modal-body .form-group{margin-bottom:1rem}.subtask-modal .modal-body .form-group label{display:block;font-size:.875rem;font-weight:500;color:#374151;margin-bottom:.5rem}.subtask-modal .modal-body .form-group .form-input,.subtask-modal .modal-body .form-group .form-select,.subtask-modal .modal-body .form-group .form-textarea{width:100%;padding:.75rem;border:2px solid #e5e7eb;border-radius:8px;font-size:.875rem;transition:all .2s ease}.subtask-modal .modal-body .form-group .form-input:focus,.subtask-modal .modal-body .form-group .form-select:focus,.subtask-modal .modal-body .form-group .form-textarea:focus{outline:none;border-color:#667eea;box-shadow:0 0 0 3px rgba(102,126,234,.1)}.subtask-modal .modal-body .form-group .form-textarea{resize:vertical;min-height:60px;font-family:inherit}.subtask-modal .modal-body .form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}@media(max-width: 768px){.subtask-modal .modal-body .form-row{grid-template-columns:1fr}}.subtask-modal .modal-footer{display:flex;justify-content:flex-end;gap:1rem;padding:1.5rem;border-top:1px solid #e5e7eb;background:#f9fafb;border-radius:0 0 12px 12px}.subtask-modal .modal-footer .btn-secondary{background:#f3f4f6;color:#374151;border:1px solid #d1d5db;padding:.75rem 1.5rem;border-radius:8px;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s ease}.subtask-modal .modal-footer .btn-secondary:hover{background:#e5e7eb}.subtask-modal .modal-footer .btn-primary{background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;border:none;padding:.75rem 1.5rem;border-radius:8px;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s ease}.subtask-modal .modal-footer .btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(102,126,234,.3)}@keyframes slideIn{from{opacity:0;transform:translateY(-20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}@media(max-width: 768px){.task-form-modal{margin:1rem;max-height:calc(100vh - 2rem)}.task-form-modal .form-header{padding:1rem 1.5rem}.task-form-modal .form-header h2{font-size:1.25rem}.task-form-modal .form-content{padding:1.5rem}.subtask-modal{margin:1rem}}@media(max-width: 480px){.task-form-modal .form-header{padding:1rem}.task-form-modal .form-header h2{font-size:1.125rem}.task-form-modal .form-content{padding:1rem}.task-form-modal .form-content .form-actions{flex-direction:column}.task-form-modal .form-content .form-actions .btn-cancel,.task-form-modal .form-content .form-actions .btn-submit{width:100%}.subtask-modal .modal-header,.subtask-modal .modal-body,.subtask-modal .modal-footer{padding:1rem}.subtask-modal .modal-footer{flex-direction:column}.subtask-modal .modal-footer .btn-secondary,.subtask-modal .modal-footer .btn-primary{width:100%}}`, "",{"version":3,"sources":["webpack://./src/components/CollaborativeTasks/TaskForm.scss"],"names":[],"mappings":"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","sourcesContent":[".task-form-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n  padding: 1rem;\n}\n\n.task-form-modal {\n  background: white;\n  border-radius: 16px;\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n  max-width: 800px;\n  width: 100%;\n  max-height: 90vh;\n  overflow-y: auto;\n  animation: slideIn 0.3s ease-out;\n\n  .form-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 1.5rem 2rem;\n    border-bottom: 1px solid #e5e7eb;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    border-radius: 16px 16px 0 0;\n\n    h2 {\n      margin: 0;\n      font-size: 1.5rem;\n      font-weight: 600;\n    }\n\n    .close-btn {\n      background: none;\n      border: none;\n      color: white;\n      cursor: pointer;\n      padding: 0.5rem;\n      border-radius: 50%;\n      transition: all 0.2s ease;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n\n      &:hover {\n        background: rgba(255, 255, 255, 0.1);\n        transform: scale(1.1);\n      }\n\n      svg {\n        width: 1.5rem;\n        height: 1.5rem;\n      }\n    }\n  }\n\n  .form-content {\n    padding: 2rem;\n\n    .form-section {\n      margin-bottom: 2rem;\n\n      h3 {\n        font-size: 1.25rem;\n        font-weight: 600;\n        color: #1f2937;\n        margin: 0 0 1rem 0;\n        padding-bottom: 0.5rem;\n        border-bottom: 2px solid #e5e7eb;\n        position: relative;\n\n        &::after {\n          content: '';\n          position: absolute;\n          bottom: -2px;\n          left: 0;\n          width: 50px;\n          height: 2px;\n          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n        }\n      }\n\n      .section-header {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        margin-bottom: 1rem;\n\n        h3 {\n          margin: 0;\n          border: none;\n          padding: 0;\n\n          &::after {\n            display: none;\n          }\n        }\n\n        .btn-add {\n          background: linear-gradient(135deg, #10b981 0%, #059669 100%);\n          color: white;\n          border: none;\n          padding: 0.5rem 1rem;\n          border-radius: 8px;\n          font-size: 0.875rem;\n          font-weight: 500;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          display: flex;\n          align-items: center;\n          gap: 0.5rem;\n\n          &:hover {\n            transform: translateY(-1px);\n            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);\n          }\n        }\n      }\n    }\n\n    .form-row {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 1rem;\n      margin-bottom: 1rem;\n\n      &.full-width {\n        grid-template-columns: 1fr;\n      }\n\n      @media (max-width: 768px) {\n        grid-template-columns: 1fr;\n      }\n    }\n\n    .form-group {\n      &.full-width {\n        grid-column: 1 / -1;\n      }\n\n      label {\n        display: block;\n        font-size: 0.875rem;\n        font-weight: 500;\n        color: #374151;\n        margin-bottom: 0.5rem;\n      }\n\n      .form-input,\n      .form-select,\n      .form-textarea {\n        width: 100%;\n        padding: 0.75rem;\n        border: 2px solid #e5e7eb;\n        border-radius: 8px;\n        font-size: 0.875rem;\n        transition: all 0.2s ease;\n        background: white;\n\n        &:focus {\n          outline: none;\n          border-color: #667eea;\n          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);\n        }\n\n        &::placeholder {\n          color: #9ca3af;\n        }\n      }\n\n      .form-textarea {\n        resize: vertical;\n        min-height: 80px;\n        font-family: inherit;\n      }\n\n      .form-select {\n        cursor: pointer;\n        appearance: auto;\n        -webkit-appearance: auto;\n        -moz-appearance: auto;\n      }\n\n      .form-select.small {\n        padding: 0.5rem;\n        font-size: 0.8rem;\n      }\n    }\n\n    .team-member-item {\n      background: #f9fafb;\n      border: 1px solid #e5e7eb;\n      border-radius: 8px;\n      padding: 1rem;\n      margin-bottom: 1rem;\n\n      .form-row {\n        grid-template-columns: 1fr 1fr auto;\n        gap: 1rem;\n        align-items: end;\n\n        @media (max-width: 768px) {\n          grid-template-columns: 1fr;\n        }\n      }\n\n      .btn-remove {\n        background: #ef4444;\n        color: white;\n        border: none;\n        padding: 0.5rem 1rem;\n        border-radius: 6px;\n        font-size: 0.875rem;\n        cursor: pointer;\n        transition: all 0.2s ease;\n        white-space: nowrap;\n\n        &:hover {\n          background: #dc2626;\n          transform: translateY(-1px);\n        }\n      }\n    }\n\n    .subtask-item {\n      background: #f9fafb;\n      border: 1px solid #e5e7eb;\n      border-radius: 8px;\n      padding: 1rem;\n      margin-bottom: 1rem;\n      transition: all 0.2s ease;\n\n      &.completed {\n        background: #f0fdf4;\n        border-color: #bbf7d0;\n\n        .subtask-title-input {\n          text-decoration: line-through;\n          color: #6b7280;\n        }\n      }\n\n      .subtask-header {\n        margin-bottom: 1rem;\n\n        .subtask-title-section {\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n          gap: 1rem;\n\n          .subtask-title-input {\n            flex: 1;\n            font-size: 1rem;\n            font-weight: 500;\n            border: none;\n            background: transparent;\n            padding: 0.5rem;\n            border-radius: 4px;\n            transition: all 0.2s ease;\n\n            &:focus {\n              outline: none;\n              background: white;\n              box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);\n            }\n          }\n\n          .subtask-actions {\n            display: flex;\n            gap: 0.5rem;\n            align-items: center;\n\n            .btn-complete-subtask {\n              background: #10b981;\n              color: white;\n              border: none;\n              padding: 0.25rem;\n              border-radius: 4px;\n              cursor: pointer;\n              transition: all 0.2s ease;\n              display: flex;\n              align-items: center;\n              justify-content: center;\n\n              &:hover {\n                background: #059669;\n                transform: scale(1.1);\n              }\n\n              svg {\n                width: 1rem;\n                height: 1rem;\n              }\n            }\n\n            .btn-remove-small {\n              background: #ef4444;\n              color: white;\n              border: none;\n              width: 24px;\n              height: 24px;\n              border-radius: 50%;\n              cursor: pointer;\n              font-size: 1rem;\n              font-weight: bold;\n              display: flex;\n              align-items: center;\n              justify-content: center;\n              transition: all 0.2s ease;\n\n              &:hover {\n                background: #dc2626;\n                transform: scale(1.1);\n              }\n            }\n          }\n        }\n      }\n\n      .subtask-description-input {\n        width: 100%;\n        border: 1px solid #e5e7eb;\n        border-radius: 6px;\n        padding: 0.5rem;\n        font-size: 0.875rem;\n        resize: vertical;\n        min-height: 60px;\n        margin-bottom: 1rem;\n        font-family: inherit;\n\n        &:focus {\n          outline: none;\n          border-color: #667eea;\n          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);\n        }\n      }\n\n      .subtask-controls {\n        .subtask-row {\n          display: grid;\n          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n          gap: 1rem;\n          margin-bottom: 1rem;\n\n          @media (max-width: 768px) {\n            grid-template-columns: 1fr;\n          }\n        }\n\n        .form-group {\n          label {\n            font-size: 0.8rem;\n            margin-bottom: 0.25rem;\n          }\n\n          .form-input.small,\n          .form-select.small {\n            padding: 0.5rem;\n            font-size: 0.8rem;\n          }\n        }\n      }\n    }\n\n    .empty-state {\n      text-align: center;\n      padding: 2rem;\n      color: #6b7280;\n\n      p {\n        margin: 0.5rem 0;\n        font-size: 0.875rem;\n      }\n    }\n\n    .form-actions {\n      display: flex;\n      justify-content: flex-end;\n      gap: 1rem;\n      margin-top: 2rem;\n      padding-top: 1rem;\n      border-top: 1px solid #e5e7eb;\n\n      .btn-cancel {\n        background: #6b7280;\n        color: white;\n        border: none;\n        padding: 0.75rem 1.5rem;\n        border-radius: 8px;\n        font-size: 0.875rem;\n        font-weight: 500;\n        cursor: pointer;\n        transition: all 0.2s ease;\n\n        &:hover {\n          background: #4b5563;\n          transform: translateY(-1px);\n        }\n      }\n\n      .btn-submit {\n        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n        color: white;\n        border: none;\n        padding: 0.75rem 1.5rem;\n        border-radius: 8px;\n        font-size: 0.875rem;\n        font-weight: 500;\n        cursor: pointer;\n        transition: all 0.2s ease;\n\n        &:hover {\n          transform: translateY(-1px);\n          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);\n        }\n\n        &:disabled {\n          opacity: 0.6;\n          cursor: not-allowed;\n          transform: none;\n        }\n      }\n    }\n  }\n}\n\n.subtask-modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.8);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1100;\n  padding: 1rem;\n}\n\n.subtask-modal {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);\n  max-width: 500px;\n  width: 100%;\n  animation: slideIn 0.3s ease-out;\n\n  .modal-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 1.5rem;\n    border-bottom: 1px solid #e5e7eb;\n    background: #f9fafb;\n\n    h3 {\n      margin: 0;\n      font-size: 1.25rem;\n      font-weight: 600;\n      color: #1f2937;\n    }\n\n    .close-btn {\n      background: none;\n      border: none;\n      color: #6b7280;\n      cursor: pointer;\n      font-size: 1.5rem;\n      padding: 0.25rem;\n      border-radius: 4px;\n      transition: all 0.2s ease;\n\n      &:hover {\n        background: #e5e7eb;\n        color: #374151;\n      }\n    }\n  }\n\n  .modal-body {\n    padding: 1.5rem;\n\n    .form-group {\n      margin-bottom: 1rem;\n\n      label {\n        display: block;\n        font-size: 0.875rem;\n        font-weight: 500;\n        color: #374151;\n        margin-bottom: 0.5rem;\n      }\n\n      .form-input,\n      .form-select,\n      .form-textarea {\n        width: 100%;\n        padding: 0.75rem;\n        border: 2px solid #e5e7eb;\n        border-radius: 8px;\n        font-size: 0.875rem;\n        transition: all 0.2s ease;\n\n        &:focus {\n          outline: none;\n          border-color: #667eea;\n          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);\n        }\n      }\n\n      .form-textarea {\n        resize: vertical;\n        min-height: 60px;\n        font-family: inherit;\n      }\n    }\n\n    .form-row {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 1rem;\n      margin-bottom: 1rem;\n\n      @media (max-width: 768px) {\n        grid-template-columns: 1fr;\n      }\n    }\n  }\n\n  .modal-footer {\n    display: flex;\n    justify-content: flex-end;\n    gap: 1rem;\n    padding: 1.5rem;\n    border-top: 1px solid #e5e7eb;\n    background: #f9fafb;\n    border-radius: 0 0 12px 12px;\n\n    .btn-secondary {\n      background: #f3f4f6;\n      color: #374151;\n      border: 1px solid #d1d5db;\n      padding: 0.75rem 1.5rem;\n      border-radius: 8px;\n      font-size: 0.875rem;\n      font-weight: 500;\n      cursor: pointer;\n      transition: all 0.2s ease;\n\n      &:hover {\n        background: #e5e7eb;\n      }\n    }\n\n    .btn-primary {\n      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n      color: white;\n      border: none;\n      padding: 0.75rem 1.5rem;\n      border-radius: 8px;\n      font-size: 0.875rem;\n      font-weight: 500;\n      cursor: pointer;\n      transition: all 0.2s ease;\n\n      &:hover {\n        transform: translateY(-1px);\n        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);\n      }\n    }\n  }\n}\n\n@keyframes slideIn {\n  from {\n    opacity: 0;\n    transform: translateY(-20px) scale(0.95);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n\n// Responsive design\n@media (max-width: 768px) {\n  .task-form-modal {\n    margin: 1rem;\n    max-height: calc(100vh - 2rem);\n\n    .form-header {\n      padding: 1rem 1.5rem;\n\n      h2 {\n        font-size: 1.25rem;\n      }\n    }\n\n    .form-content {\n      padding: 1.5rem;\n    }\n  }\n\n  .subtask-modal {\n    margin: 1rem;\n  }\n}\n\n@media (max-width: 480px) {\n  .task-form-modal {\n    .form-header {\n      padding: 1rem;\n\n      h2 {\n        font-size: 1.125rem;\n      }\n    }\n\n    .form-content {\n      padding: 1rem;\n\n      .form-actions {\n        flex-direction: column;\n\n        .btn-cancel,\n        .btn-submit {\n          width: 100%;\n        }\n      }\n    }\n  }\n\n  .subtask-modal {\n    .modal-header,\n    .modal-body,\n    .modal-footer {\n      padding: 1rem;\n    }\n\n    .modal-footer {\n      flex-direction: column;\n\n      .btn-secondary,\n      .btn-primary {\n        width: 100%;\n      }\n    }\n  }\n} "],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 8758:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.screenplay-viewer-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:1000;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.screenplay-viewer{background:#fff;border-radius:16px;box-shadow:0 25px 50px rgba(0,0,0,.4);width:95vw;height:90vh;max-width:1600px;display:flex;flex-direction:column;overflow:hidden;position:relative;padding-top:0;padding-bottom:0;padding-left:0;padding-right:0;box-sizing:border-box}.screenplay-viewer.single .viewer-content{grid-template-columns:1fr}.screenplay-viewer.split .viewer-content{grid-template-columns:2fr 1fr}.screenplay-viewer.fullscreen{width:98vw;height:95vh;max-width:none}.screenplay-viewer h1:not(.document-title),.screenplay-viewer h2:not(.document-title),.screenplay-viewer h3:not(.document-title),.screenplay-viewer h4:not(.document-title),.screenplay-viewer h5:not(.document-title),.screenplay-viewer h6:not(.document-title){display:none !important;padding:0 !important;margin:0 !important}.screenplay-viewer [title]::before,.screenplay-viewer [title]::after,.screenplay-viewer [aria-label*=title]::before,.screenplay-viewer [aria-label*=title]::after,.screenplay-viewer [aria-label*=Title]::before,.screenplay-viewer [aria-label*=Title]::after{display:none !important;padding:0 !important;margin:0 !important;content:none !important}.screenplay-viewer .react-pdf__Document h1,.screenplay-viewer .react-pdf__Document h2,.screenplay-viewer .react-pdf__Document h3,.screenplay-viewer .react-pdf__Document h4,.screenplay-viewer .react-pdf__Document h5,.screenplay-viewer .react-pdf__Document h6,.screenplay-viewer .react-pdf__Page h1,.screenplay-viewer .react-pdf__Page h2,.screenplay-viewer .react-pdf__Page h3,.screenplay-viewer .react-pdf__Page h4,.screenplay-viewer .react-pdf__Page h5,.screenplay-viewer .react-pdf__Page h6,.screenplay-viewer .react-pdf__Page__canvas h1,.screenplay-viewer .react-pdf__Page__canvas h2,.screenplay-viewer .react-pdf__Page__canvas h3,.screenplay-viewer .react-pdf__Page__canvas h4,.screenplay-viewer .react-pdf__Page__canvas h5,.screenplay-viewer .react-pdf__Page__canvas h6,.screenplay-viewer .react-pdf__Page__textContent h1,.screenplay-viewer .react-pdf__Page__textContent h2,.screenplay-viewer .react-pdf__Page__textContent h3,.screenplay-viewer .react-pdf__Page__textContent h4,.screenplay-viewer .react-pdf__Page__textContent h5,.screenplay-viewer .react-pdf__Page__textContent h6{display:none !important;padding:0 !important;margin:0 !important}.screenplay-viewer .react-pdf__Document [class*=title],.screenplay-viewer .react-pdf__Document [class*=Title],.screenplay-viewer .react-pdf__Document [id*=title],.screenplay-viewer .react-pdf__Document [id*=Title],.screenplay-viewer .react-pdf__Page [class*=title],.screenplay-viewer .react-pdf__Page [class*=Title],.screenplay-viewer .react-pdf__Page [id*=title],.screenplay-viewer .react-pdf__Page [id*=Title],.screenplay-viewer .react-pdf__Page__canvas [class*=title],.screenplay-viewer .react-pdf__Page__canvas [class*=Title],.screenplay-viewer .react-pdf__Page__canvas [id*=title],.screenplay-viewer .react-pdf__Page__canvas [id*=Title],.screenplay-viewer .react-pdf__Page__textContent [class*=title],.screenplay-viewer .react-pdf__Page__textContent [class*=Title],.screenplay-viewer .react-pdf__Page__textContent [id*=title],.screenplay-viewer .react-pdf__Page__textContent [id*=Title]{display:none !important;padding:0 !important;margin:0 !important}.screenplay-viewer iframe[title]::before,.screenplay-viewer iframe[title]::after,.screenplay-viewer iframe[aria-label]::before,.screenplay-viewer iframe[aria-label]::after,.screenplay-viewer object[title]::before,.screenplay-viewer object[title]::after,.screenplay-viewer object[aria-label]::before,.screenplay-viewer object[aria-label]::after,.screenplay-viewer embed[title]::before,.screenplay-viewer embed[title]::after,.screenplay-viewer embed[aria-label]::before,.screenplay-viewer embed[aria-label]::after{display:none !important;padding:0 !important;margin:0 !important;content:none !important}.screenplay-viewer .react-pdf__Document::before,.screenplay-viewer .react-pdf__Document::after{content:none !important;padding:0 !important;margin:0 !important}.viewer-header{display:flex !important;align-items:center;justify-content:space-between;padding:10px 24px 6px 24px;background:rgba(0,0,0,0);border-bottom:1px solid #f1f5f9;position:sticky;top:0;z-index:10}.btn-close{background:none;border:none;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:#64748b;transition:background .15s,color .15s;cursor:pointer;box-shadow:none;outline:none;font-size:2rem;margin-left:12px}.btn-close:hover,.btn-close:focus{background:#f1f5f9;color:#1e293b}.viewer-header-minimal{display:none !important}.viewer-content{display:flex;height:calc(100vh - 40px)}.viewer-content .pdf-panel{flex:1 1 0%;min-width:0;overflow:hidden;position:relative;z-index:1;background:none}.viewer-content .collaboration-panel{position:relative;width:340px;min-width:220px;max-width:400px;z-index:2;background:#f8fafc;border-left:1px solid #e2e8f0;display:flex;flex-direction:column;transition:transform .25s cubic-bezier(0.4, 0, 0.2, 1);box-shadow:none;transform:translateX(0)}.viewer-content .collaboration-panel.collapsed{transform:translateX(100%);box-shadow:none}.pdf-panel{display:flex;flex-direction:column;background:#f8fafc;position:relative}.pdf-panel .pdf-controls{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:#fff;border-bottom:1px solid #e2e8f0}.pdf-panel .pdf-controls .navigation-controls{display:flex;align-items:center;gap:12px}.pdf-panel .pdf-controls .navigation-controls .nav-btn{background:#3b82f6;border:none;color:#fff;padding:8px 16px;border-radius:6px;cursor:pointer;font-weight:500;transition:all .2s ease}.pdf-panel .pdf-controls .navigation-controls .nav-btn:hover:not(:disabled){background:#2563eb}.pdf-panel .pdf-controls .navigation-controls .nav-btn:disabled{background:#cbd5e1;cursor:not-allowed}.pdf-panel .pdf-controls .navigation-controls .page-display{font-weight:600;color:#374151;min-width:80px;text-align:center}.pdf-panel .pdf-controls .zoom-controls{display:flex;align-items:center;gap:8px}.pdf-panel .pdf-controls .zoom-controls button{background:#f1f5f9;border:1px solid #e2e8f0;color:#64748b;width:32px;height:32px;border-radius:6px;cursor:pointer;transition:all .2s ease}.pdf-panel .pdf-controls .zoom-controls button:hover{background:#e2e8f0;color:#374151}.pdf-panel .pdf-controls .zoom-controls .zoom-level{font-weight:500;color:#374151;min-width:50px;text-align:center}.pdf-panel .pdf-container{position:relative;width:100%;height:100%;overflow:auto;background:#f8fafc}.pdf-scrollable-container{width:100%;height:100%;overflow-y:auto;overflow-x:hidden;padding:20px;background:#f8fafc;position:relative}.pdf-scrollable-container:hover{overflow-y:auto}.pdf-scrollable-container::-webkit-scrollbar{width:8px}.pdf-scrollable-container::-webkit-scrollbar-track{background:#f1f1f1;border-radius:4px}.pdf-scrollable-container::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:4px}.pdf-scrollable-container::-webkit-scrollbar-thumb:hover{background:#a8a8a8}.pdf-scrollable-container .page-container{display:flex;justify-content:center;margin-bottom:20px}.pdf-scrollable-container .page-container:last-child{margin-bottom:0}.page-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;color:#6b7280;font-size:.875rem}.page-error{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;color:#ef4444;font-size:.875rem;text-align:center}.page-error small{margin-top:8px;color:#6b7280}.collaboration-panel{background:#fff;border-left:1px solid #e2e8f0;display:flex;flex-direction:column;overflow:hidden}.collaboration-panel .panel-header{display:none !important}.collaboration-panel .panel-content{flex:1;overflow:auto;padding:20px 24px}.collaboration-panel .panel-content .active-users{margin-bottom:32px}.collaboration-panel .panel-content .active-users h4{margin:0 0 16px 0;color:#1f2937;font-size:1rem;font-weight:600}.collaboration-panel .panel-content .active-users .users-list{display:flex;flex-direction:column;gap:12px}.collaboration-panel .panel-content .active-users .users-list .user-item{display:flex;align-items:center;gap:12px;padding:12px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;transition:all .2s ease}.collaboration-panel .panel-content .active-users .users-list .user-item:hover{background:#f1f5f9;border-color:#cbd5e1}.collaboration-panel .panel-content .active-users .users-list .user-item .user-avatar{width:32px;height:32px;border-radius:50%;overflow:hidden;position:relative}.collaboration-panel .panel-content .active-users .users-list .user-item .user-avatar img{width:100%;height:100%;-o-object-fit:cover;object-fit:cover}.collaboration-panel .panel-content .active-users .users-list .user-item .user-avatar .avatar-placeholder{width:100%;height:100%;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:.875rem}.collaboration-panel .panel-content .active-users .users-list .user-item .user-avatar .online-indicator{position:absolute;bottom:0;right:0;width:12px;height:12px;border-radius:50%;border:2px solid #fff}.collaboration-panel .panel-content .active-users .users-list .user-item .user-avatar .online-indicator.online{background:#10b981;box-shadow:0 0 0 2px rgba(16,185,129,.2)}.collaboration-panel .panel-content .active-users .users-list .user-item .user-avatar .online-indicator.offline{background:#6b7280}.collaboration-panel .panel-content .active-users .users-list .user-item .user-info{display:flex;flex-direction:column;gap:2px;flex:1}.collaboration-panel .panel-content .active-users .users-list .user-item .user-info .user-name{font-weight:500;color:#1f2937;font-size:.875rem}.collaboration-panel .panel-content .active-users .users-list .user-item .user-info .user-status{font-size:.75rem;color:#6b7280;font-weight:500}.collaboration-panel .panel-content .active-users .users-list .user-item .user-info .user-status .last-seen{color:#9ca3af;font-weight:400}.collaboration-panel .panel-content .active-users .users-list .user-item .user-info .user-page{font-size:.75rem;color:#9ca3af}.collaboration-panel .panel-content .annotations-section,.collaboration-panel .panel-content .tags-section{margin-bottom:32px}.collaboration-panel .panel-content .annotations-section h4,.collaboration-panel .panel-content .tags-section h4{margin:0 0 16px 0;color:#1f2937;font-size:1rem;font-weight:600}.collaboration-panel .panel-content .annotations-section .annotations-list,.collaboration-panel .panel-content .annotations-section .tags-list,.collaboration-panel .panel-content .tags-section .annotations-list,.collaboration-panel .panel-content .tags-section .tags-list{display:flex;flex-direction:column;gap:16px}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item,.collaboration-panel .panel-content .tags-section .tags-list .tag-item{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;transition:all .2s ease}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item:hover,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item:hover,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item:hover,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item:hover,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item:hover,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item:hover,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item:hover,.collaboration-panel .panel-content .tags-section .tags-list .tag-item:hover{border-color:#cbd5e1;box-shadow:0 2px 8px rgba(0,0,0,.05)}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item.resolved,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item.resolved,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item.resolved,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item.resolved,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item.resolved,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item.resolved,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item.resolved,.collaboration-panel .panel-content .tags-section .tags-list .tag-item.resolved{opacity:.6;background:#f8fafc}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item.resolved .annotation-content,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item.resolved .tag-content,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item.resolved .annotation-content,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item.resolved .tag-content,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item.resolved .annotation-content,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item.resolved .tag-content,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item.resolved .annotation-content,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item.resolved .tag-content,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item.resolved .annotation-content,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item.resolved .tag-content,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item.resolved .annotation-content,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item.resolved .tag-content,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item.resolved .annotation-content,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item.resolved .tag-content,.collaboration-panel .panel-content .tags-section .tags-list .tag-item.resolved .annotation-content,.collaboration-panel .panel-content .tags-section .tags-list .tag-item.resolved .tag-content{text-decoration:line-through}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-header,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-header,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-header,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-header,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-header,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-header,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-header,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-header,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-header,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-header,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-header,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-header,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-header,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-header,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-header,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-header .annotation-author,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-header .tag-author,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-header .annotation-author,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-header .tag-author,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-header .annotation-author,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-header .tag-author,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-header .annotation-author,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-header .tag-author,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-header .annotation-author,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-header .tag-author,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-header .annotation-author,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-header .tag-author,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-header .annotation-author,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-header .tag-author,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-header .annotation-author,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-header .tag-author,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-header .annotation-author,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-header .tag-author,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-header .annotation-author,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-header .tag-author,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-header .annotation-author,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-header .tag-author,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-header .annotation-author,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-header .tag-author,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-header .annotation-author,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-header .tag-author,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-header .annotation-author,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-header .tag-author,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-header .annotation-author,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-header .tag-author,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-header .annotation-author,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-header .tag-author{display:flex;align-items:center;gap:8px}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-header .tag-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-header .annotation-author .avatar-placeholder,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-header .tag-author .avatar-placeholder{width:24px;height:24px;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:600}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-header .annotation-author span,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-header .tag-author span,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-header .annotation-author span,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-header .tag-author span,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-header .annotation-author span,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-header .tag-author span,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-header .annotation-author span,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-header .tag-author span,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-header .annotation-author span,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-header .tag-author span,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-header .annotation-author span,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-header .tag-author span,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-header .annotation-author span,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-header .tag-author span,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-header .annotation-author span,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-header .tag-author span,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-header .annotation-author span,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-header .tag-author span,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-header .annotation-author span,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-header .tag-author span,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-header .annotation-author span,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-header .tag-author span,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-header .annotation-author span,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-header .tag-author span,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-header .annotation-author span,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-header .tag-author span,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-header .annotation-author span,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-header .tag-author span,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-header .annotation-author span,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-header .tag-author span,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-header .annotation-author span,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-header .tag-author span{font-weight:500;color:#1f2937;font-size:.875rem}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-header .annotation-meta,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-header .tag-meta,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-header .annotation-meta,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-header .tag-meta,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-header .annotation-meta,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-header .tag-meta,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-header .annotation-meta,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-header .tag-meta,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-header .annotation-meta,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-header .tag-meta,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-header .annotation-meta,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-header .tag-meta,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-header .annotation-meta,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-header .tag-meta,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-header .annotation-meta,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-header .tag-meta,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-header .annotation-meta,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-header .tag-meta,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-header .annotation-meta,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-header .tag-meta,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-header .annotation-meta,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-header .tag-meta,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-header .annotation-meta,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-header .tag-meta,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-header .annotation-meta,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-header .tag-meta,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-header .annotation-meta,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-header .tag-meta,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-header .annotation-meta,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-header .tag-meta,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-header .annotation-meta,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-header .tag-meta{display:flex;gap:8px;font-size:.75rem;color:#6b7280}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-content,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-content,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-content,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-content,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-content,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-content,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-content,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-content{color:#374151;line-height:1.5;margin-bottom:12px}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-content,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-content,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-content,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-content,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-content,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-content,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-content,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-content{display:flex;align-items:center;gap:8px;margin-bottom:12px}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-content .tag-type,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-content .tag-type,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-content .tag-type,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-content .tag-type,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-content .tag-type,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-content .tag-type,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-content .tag-type,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-content .tag-type{padding:2px 8px;border-radius:12px;color:#fff;font-size:.75rem;font-weight:500;text-transform:capitalize}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-content .tag-text,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-content .tag-text,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-content .tag-text,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-content .tag-text,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-content .tag-text,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-content .tag-text,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-content .tag-text,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-content .tag-text{color:#374151;line-height:1.5}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-actions,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-actions,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-actions,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-actions,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-actions,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-actions,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-actions,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-actions,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-actions,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-actions,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-actions,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-actions,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-actions,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-actions,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-actions,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-actions{display:flex;gap:8px;flex-wrap:wrap}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-actions .action-btn,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-actions .action-btn,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-actions .action-btn,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-actions .action-btn,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-actions .action-btn,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-actions .action-btn,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-actions .action-btn,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-actions .action-btn,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-actions .action-btn,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-actions .action-btn,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-actions .action-btn,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-actions .action-btn,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-actions .action-btn,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-actions .action-btn,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-actions .action-btn,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-actions .action-btn{background:#f1f5f9;border:1px solid #e2e8f0;color:#64748b;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:.75rem;transition:all .2s ease}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-actions .action-btn:hover,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-actions .action-btn:hover,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-actions .action-btn:hover,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-actions .action-btn:hover,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-actions .action-btn:hover,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-actions .action-btn:hover,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-actions .action-btn:hover,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-actions .action-btn:hover,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-actions .action-btn:hover,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-actions .action-btn:hover,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-actions .action-btn:hover,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-actions .action-btn:hover,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-actions .action-btn:hover,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-actions .action-btn:hover,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-actions .action-btn:hover,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-actions .action-btn:hover{background:#e2e8f0;color:#374151}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-actions .action-btn.resolved,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-actions .action-btn.resolved,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-actions .action-btn.resolved,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-actions .action-btn.resolved,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-actions .action-btn.resolved,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-actions .action-btn.resolved,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-actions .action-btn.resolved,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-actions .action-btn.resolved,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-actions .action-btn.resolved,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-actions .action-btn.resolved,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-actions .action-btn.resolved,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-actions .action-btn.resolved,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-actions .action-btn.resolved,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-actions .action-btn.resolved,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-actions .action-btn.resolved,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-actions .action-btn.resolved{background:#dcfce7;border-color:#bbf7d0;color:#166534}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-actions .action-btn.delete,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-actions .action-btn.delete,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-actions .action-btn.delete,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-actions .action-btn.delete,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-actions .action-btn.delete,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-actions .action-btn.delete,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-actions .action-btn.delete,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-actions .action-btn.delete,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-actions .action-btn.delete,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-actions .action-btn.delete,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-actions .action-btn.delete,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-actions .action-btn.delete,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-actions .action-btn.delete,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-actions .action-btn.delete,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-actions .action-btn.delete,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-actions .action-btn.delete{background:#fef2f2;border-color:#fecaca;color:#dc2626}.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .annotation-actions .action-btn.delete:hover,.collaboration-panel .panel-content .annotations-section .annotations-list .annotation-item .tag-actions .action-btn.delete:hover,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .annotation-actions .action-btn.delete:hover,.collaboration-panel .panel-content .annotations-section .annotations-list .tag-item .tag-actions .action-btn.delete:hover,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .annotation-actions .action-btn.delete:hover,.collaboration-panel .panel-content .annotations-section .tags-list .annotation-item .tag-actions .action-btn.delete:hover,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .annotation-actions .action-btn.delete:hover,.collaboration-panel .panel-content .annotations-section .tags-list .tag-item .tag-actions .action-btn.delete:hover,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .annotation-actions .action-btn.delete:hover,.collaboration-panel .panel-content .tags-section .annotations-list .annotation-item .tag-actions .action-btn.delete:hover,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .annotation-actions .action-btn.delete:hover,.collaboration-panel .panel-content .tags-section .annotations-list .tag-item .tag-actions .action-btn.delete:hover,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .annotation-actions .action-btn.delete:hover,.collaboration-panel .panel-content .tags-section .tags-list .annotation-item .tag-actions .action-btn.delete:hover,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .annotation-actions .action-btn.delete:hover,.collaboration-panel .panel-content .tags-section .tags-list .tag-item .tag-actions .action-btn.delete:hover{background:#fee2e2;color:#b91c1c}.annotation-overlay{border:2px solid rgba(239,68,68,.7);background:none !important;border-radius:8px !important;box-shadow:0 2px 8px rgba(239,68,68,.08);transition:border .18s,box-shadow .18s;position:absolute;z-index:5;pointer-events:auto;overflow:visible}.annotation-overlay:hover,.annotation-overlay.selected{border:2.5px solid #ef4444;box-shadow:0 4px 16px rgba(239,68,68,.13)}.tag-overlay{border:2px solid rgba(245,158,11,.7);background:none !important;border-radius:8px !important;box-shadow:0 2px 8px rgba(245,158,11,.08);transition:border .18s,box-shadow .18s;position:absolute;z-index:5;pointer-events:auto;overflow:visible}.tag-overlay:hover,.tag-overlay.selected{border:2.5px solid #f59e0b;box-shadow:0 4px 16px rgba(245,158,11,.13)}.user-cursor{position:absolute;z-index:15}.user-cursor .cursor-pointer{display:none !important}.user-cursor .cursor-label{position:absolute;top:-8px;right:-8px;width:24px;height:24px;border-radius:50%;background:#3b82f6;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.2)}.drawing-instructions{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.8);color:#fff;padding:12px 20px;border-radius:8px;font-size:.875rem;z-index:20;animation:fadeInUp .3s ease}@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(59,130,246,.7)}70%{box-shadow:0 0 0 10px rgba(59,130,246,0)}100%{box-shadow:0 0 0 0 rgba(59,130,246,0)}}@keyframes fadeInUp{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@media(max-width: 1200px){.screenplay-viewer{width:98vw;height:95vh}.screenplay-viewer.split .viewer-content{grid-template-columns:1fr}.screenplay-viewer.split .collaboration-panel{position:absolute;right:0;top:80px;bottom:0;width:350px;transform:translateX(100%);transition:transform .3s ease}.screenplay-viewer.split .collaboration-panel.open{transform:translateX(0)}.viewer-header .header-center{display:none}.viewer-header .header-actions .overlay-controls,.viewer-header .header-actions .drawing-controls{display:none}}@media(max-width: 768px){.screenplay-viewer{width:100vw;height:100vh;border-radius:0}.screenplay-viewer .viewer-header-minimal{border-radius:0;padding:4px 8px;height:36px;min-height:36px}.screenplay-viewer .viewer-header-minimal .header-left-minimal .document-title{font-size:.7rem;max-width:150px;opacity:.7}.screenplay-viewer .viewer-header-minimal .header-controls-minimal{gap:6px}.screenplay-viewer .viewer-header-minimal .header-controls-minimal .zoom-controls-minimal{padding:2px 4px}.screenplay-viewer .viewer-header-minimal .header-controls-minimal .zoom-controls-minimal button{padding:1px 2px;font-size:9px}.screenplay-viewer .viewer-header-minimal .header-controls-minimal .zoom-controls-minimal span{font-size:9px;min-width:28px}.screenplay-viewer .viewer-header-minimal .header-controls-minimal .overlay-btn,.screenplay-viewer .viewer-header-minimal .header-controls-minimal .btn-report-minimal,.screenplay-viewer .viewer-header-minimal .header-controls-minimal .btn-close-minimal{padding:3px 4px;font-size:10px}.screenplay-viewer .viewer-header-minimal .header-controls-minimal .btn-close-minimal{width:20px;height:20px;font-size:12px}.viewer-content{height:calc(100vh - 36px)}.collaboration-panel{position:fixed;right:0;top:0;height:100vh;width:90vw;min-width:0;max-width:none;z-index:2000;box-shadow:-2px 0 16px rgba(0,0,0,.08);background:#fff;border-left:1px solid #e2e8f0;transition:transform .2s cubic-bezier(0.4, 0, 0.2, 1)}.collaboration-panel.collapsed{transform:translateX(100%);width:36px !important;min-width:36px !important;max-width:36px !important;box-shadow:none}.collaboration-panel .sidebar-toggle-btn{left:-24px;top:16px}.pdf-panel.expanded{width:100vw !important;min-width:0;max-width:none}}.annotation-marker,.tag-marker{pointer-events:auto;box-shadow:0 2px 8px rgba(0,0,0,.1);border-radius:50%;font-weight:bold;transition:box-shadow .18s,background .18s;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}.annotation-marker:hover,.tag-marker:hover{box-shadow:0 4px 16px rgba(0,0,0,.18);filter:brightness(1.08)}.annotation-icon,.tag-icon{font-size:14px;line-height:1}.annotation-input-popup .popup-header:hover,.tag-input-popup .popup-header:hover{background:#f8fafc;border-radius:8px 8px 0 0}.annotation-input-popup .popup-header:active,.tag-input-popup .popup-header:active{cursor:grabbing}.annotation-overlay:hover,.tag-overlay:hover{transform:scale(1.02);box-shadow:0 4px 12px rgba(0,0,0,.15)}.annotation-overlay:hover .annotation-marker,.annotation-overlay:hover .tag-marker,.tag-overlay:hover .annotation-marker,.tag-overlay:hover .tag-marker{transform:scale(1.1)}.annotation-overlay.selected,.tag-overlay.selected{border-width:3px !important;box-shadow:0 0 0 3px rgba(59,130,246,.3);animation:pulse 1s ease-in-out}.annotation-overlay.resolved,.tag-overlay.resolved{opacity:.6}.annotation-overlay.resolved .annotation-marker,.annotation-overlay.resolved .tag-marker,.tag-overlay.resolved .annotation-marker,.tag-overlay.resolved .tag-marker{opacity:.7}@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(59,130,246,.7)}70%{box-shadow:0 0 0 10px rgba(59,130,246,0)}100%{box-shadow:0 0 0 0 rgba(59,130,246,0)}}.annotation-input-popup,.tag-input-popup{-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid rgba(226,232,240,.8);box-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04)}.annotation-input-popup .popup-header,.tag-input-popup .popup-header{background:linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);border-bottom:1px solid #e2e8f0;margin:-1.5rem -1.5rem 1rem -1.5rem;padding:1.5rem;border-radius:12px 12px 0 0}.annotation-input-popup .popup-header h4,.tag-input-popup .popup-header h4{margin:0;color:#1f2937;font-size:1.1rem;font-weight:600}.annotation-input-popup textarea:focus,.annotation-input-popup input:focus,.annotation-input-popup select:focus,.tag-input-popup textarea:focus,.tag-input-popup input:focus,.tag-input-popup select:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}.annotation-input-popup button:hover,.tag-input-popup button:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.15)}.annotation-input-popup button:active,.tag-input-popup button:active{transform:translateY(0)}.annotation-panel{position:fixed;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,.15);z-index:2000;max-width:400px;min-width:320px;max-height:80vh;overflow-y:auto}.annotation-panel.sidebar-mode{right:20px;top:20px;width:350px}.annotation-panel .panel-header{display:flex;align-items:center;gap:12px;padding:16px;border-bottom:1px solid #e2e8f0;background:#f8fafc;border-radius:12px 12px 0 0}.annotation-panel .panel-header .author-avatar{width:32px;height:32px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;font-size:16px}.annotation-panel .panel-header .author-avatar img{width:100%;height:100%;border-radius:50%;-o-object-fit:cover;object-fit:cover}.annotation-panel .panel-header .author-name{font-weight:600;color:#1f2937;flex:1}.annotation-panel .panel-header .timestamp{font-size:.875rem;color:#6b7280}.annotation-panel .panel-header .close-btn{background:none;border:none;font-size:20px;color:#6b7280;cursor:pointer;padding:4px;border-radius:4px;transition:all .2s ease}.annotation-panel .panel-header .close-btn:hover{background:#e5e7eb;color:#374151}.annotation-panel .annotation-content{padding:16px}.annotation-panel .annotation-content .annotation-main-text{font-size:.875rem;color:#374151;line-height:1.5;margin-bottom:16px;padding:12px;background:#f9fafb;border-radius:8px;border-left:4px solid #3b82f6}.annotation-panel .annotation-content .annotation-replies h5{margin:0 0 12px 0;font-size:.875rem;font-weight:600;color:#374151}.annotation-panel .annotation-content .annotation-replies .replies-list{max-height:200px;overflow-y:auto;margin-bottom:16px}.annotation-panel .annotation-content .annotation-replies .replies-list .reply-item{padding:8px 12px;background:#f8fafc;border-radius:8px;margin-bottom:8px;position:relative}.annotation-panel .annotation-content .annotation-replies .replies-list .reply-item .reply-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}.annotation-panel .annotation-content .annotation-replies .replies-list .reply-item .reply-header .reply-author{font-weight:500;font-size:.75rem;color:#3b82f6}.annotation-panel .annotation-content .annotation-replies .replies-list .reply-item .reply-header .reply-time{font-size:.75rem;color:#6b7280}.annotation-panel .annotation-content .annotation-replies .replies-list .reply-item .reply-content{font-size:.875rem;color:#374151;line-height:1.4}.annotation-panel .annotation-content .annotation-replies .replies-list .reply-item .remove-reply-btn{position:absolute;top:4px;right:4px;background:none;border:none;color:#ef4444;cursor:pointer;font-size:14px;padding:2px 6px;border-radius:4px;opacity:0;transition:opacity .2s ease}.annotation-panel .annotation-content .annotation-replies .replies-list .reply-item .remove-reply-btn:hover{background:#fee2e2}.annotation-panel .annotation-content .annotation-replies .replies-list .reply-item:hover .remove-reply-btn{opacity:1}.annotation-panel .annotation-content .annotation-replies .add-reply-section{display:flex;gap:8px}.annotation-panel .annotation-content .annotation-replies .add-reply-section input{flex:1;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:.875rem}.annotation-panel .annotation-content .annotation-replies .add-reply-section input:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}.annotation-panel .annotation-content .annotation-replies .add-reply-section button{padding:8px 16px;background:#3b82f6;color:#fff;border:none;border-radius:6px;font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s ease}.annotation-panel .annotation-content .annotation-replies .add-reply-section button:hover:not(:disabled){background:#2563eb}.annotation-panel .annotation-content .annotation-replies .add-reply-section button:disabled{background:#9ca3af;cursor:not-allowed}.tag-overlay{position:absolute;border-radius:6px;cursor:pointer;transition:all .2s ease;z-index:5}.tag-overlay:hover{transform:scale(1.02);box-shadow:0 4px 12px rgba(0,0,0,.15)}.tag-overlay.selected{border-width:3px !important;box-shadow:0 0 0 2px rgba(59,130,246,.3);animation:pulse 1s ease-in-out}.tag-overlay.resolved{opacity:.6}.tag-overlay.resolved .tag-marker{background:#10b981 !important}.tag-overlay .tag-marker{position:absolute;top:-8px;right:-8px;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,.15);transition:all .2s ease;z-index:10}.navigation-loading{position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:rgba(0,0,0,.8);color:#fff;padding:12px 24px;border-radius:8px;z-index:3000;font-size:.875rem;display:flex;align-items:center;gap:8px}.navigation-loading .spinner{width:16px;height:16px;border:2px solid rgba(0,0,0,0);border-top:2px solid #fff;border-radius:50%;animation:spin 1s linear infinite}.pdf-scrollable-container{will-change:transform;contain:layout style paint}.annotation-overlay,.tag-overlay{will-change:transform;contain:layout style paint}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@media(max-width: 768px){.annotation-panel.sidebar-mode{right:10px;left:10px;width:auto;max-width:none}.annotation-panel.popup-mode{left:10px !important;right:10px !important;width:auto !important;max-width:none}.viewer-header{flex-direction:column;gap:12px}.viewer-header .header-center{order:2}.viewer-header .header-actions{order:3}}.fast-selection-popup,.fast-annotation-popup,.fast-tag-popup{animation:popupFadeIn .15s ease-out;will-change:transform,opacity;contain:layout style paint}.fast-selection-popup button:focus,.fast-annotation-popup button:focus,.fast-tag-popup button:focus{outline:2px solid #3b82f6;outline-offset:2px}.fast-selection-popup button:active,.fast-annotation-popup button:active,.fast-tag-popup button:active{transform:translateY(1px)}.fast-selection-popup input:focus,.fast-selection-popup textarea:focus,.fast-selection-popup select:focus,.fast-annotation-popup input:focus,.fast-annotation-popup textarea:focus,.fast-annotation-popup select:focus,.fast-tag-popup input:focus,.fast-tag-popup textarea:focus,.fast-tag-popup select:focus{outline:2px solid #3b82f6;outline-offset:2px}@keyframes popupFadeIn{from{opacity:0;transform:translateY(-4px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}.annotation-overlay:hover,.tag-overlay:hover{transform:scale(1.01);box-shadow:0 2px 8px rgba(0,0,0,.1)}.annotation-overlay.selected,.tag-overlay.selected{border-width:3px !important;box-shadow:0 0 0 2px rgba(59,130,246,.3);animation:pulse .6s ease-in-out}.annotation-overlay.resolved,.tag-overlay.resolved{opacity:.5}.annotation-overlay.resolved .annotation-marker,.annotation-overlay.resolved .tag-marker,.tag-overlay.resolved .annotation-marker,.tag-overlay.resolved .tag-marker{background:#10b981 !important}.react-pdf__Page__textContent{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.screenplay-viewer:focus-within{outline:none}.screenplay-viewer button:focus-visible,.screenplay-viewer input:focus-visible,.screenplay-viewer textarea:focus-visible,.screenplay-viewer select:focus-visible{outline:2px solid #3b82f6;outline-offset:2px}@media(max-width: 768px){.fast-selection-popup,.fast-annotation-popup,.fast-tag-popup{left:10px !important;right:10px !important;width:auto !important;max-width:none;min-width:auto}.annotation-overlay .annotation-marker,.annotation-overlay .tag-marker,.tag-overlay .annotation-marker,.tag-overlay .tag-marker{width:24px !important;height:24px !important;font-size:12px !important}}.pdf-panel.expanded{width:100% !important;flex:1 1 100%;transition:width .2s cubic-bezier(0.4, 0, 0.2, 1)}@media(max-width: 900px){.collaboration-panel{position:fixed;right:0;top:0;height:100vh;width:90vw;min-width:0;max-width:none;z-index:2000;box-shadow:-2px 0 16px rgba(0,0,0,.08);background:#fff;border-left:1px solid #e2e8f0;transition:transform .2s cubic-bezier(0.4, 0, 0.2, 1)}.collaboration-panel.collapsed{transform:translateX(100%);width:36px !important;min-width:36px !important;max-width:36px !important;box-shadow:none}.collaboration-panel .sidebar-toggle-btn{left:-24px;top:16px}.pdf-panel.expanded{width:100vw !important;min-width:0;max-width:none}}@keyframes bounceBtn{0%,100%{transform:translateY(0)}20%{transform:translateY(-8px)}40%{transform:translateY(0)}60%{transform:translateY(-4px)}80%{transform:translateY(0)}}.viewer-header-minimal{height:32px !important;min-height:32px !important;padding:0 8px !important;background:#f8fafc !important;border-bottom:1px solid #e2e8f0 !important;display:flex;align-items:center}.viewer-header-minimal .header-left-minimal .document-title{font-size:.8rem !important;font-weight:500 !important;color:#6b7280 !important;opacity:.8 !important;margin:0 !important;padding:0 !important}.pdf-container{position:relative;width:100%;height:100%;overflow:auto;background:#f8fafc}.pdf-scrollable-container{width:100%;height:100%;overflow-y:auto;overflow-x:hidden;padding:20px;background:#f8fafc;position:relative}.pdf-scrollable-container:hover{overflow-y:auto}.pdf-scrollable-container::-webkit-scrollbar{width:8px}.pdf-scrollable-container::-webkit-scrollbar-track{background:#f1f1f1;border-radius:4px}.pdf-scrollable-container::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:4px}.pdf-scrollable-container::-webkit-scrollbar-thumb:hover{background:#a8a8a8}.pdf-scrollable-container .page-container{display:flex;justify-content:center;margin-bottom:20px}.pdf-scrollable-container .page-container:last-child{margin-bottom:0}.page-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;color:#6b7280;font-size:.875rem}.page-error{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;color:#ef4444;font-size:.875rem}.react-pdf__Document h1,.react-pdf__Document h2,.react-pdf__Document h3,.react-pdf__Document h4,.react-pdf__Document h5,.react-pdf__Document h6{display:none !important;padding:0 !important;margin:0 !important}.react-pdf__Document .react-pdf__Page__textContent{user-select:text;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text}.pdf-container h1,.pdf-container h2,.pdf-container h3,.pdf-container h4,.pdf-container h5,.pdf-container h6{display:none !important;padding:0 !important;margin:0 !important}.pdf-container .react-pdf__Document h1,.pdf-container .react-pdf__Document h2,.pdf-container .react-pdf__Document h3,.pdf-container .react-pdf__Document h4,.pdf-container .react-pdf__Document h5,.pdf-container .react-pdf__Document h6{display:none !important;padding:0 !important;margin:0 !important}.viewer-header-minimal .document-title{display:block !important;visibility:visible !important;opacity:1 !important}.screenplay-viewer h1:not(.document-title),.screenplay-viewer h2:not(.document-title),.screenplay-viewer h3:not(.document-title),.screenplay-viewer h4:not(.document-title),.screenplay-viewer h5:not(.document-title),.screenplay-viewer h6:not(.document-title){display:none !important;padding:0 !important;margin:0 !important}.react-pdf__Page::before,.react-pdf__Page::after{content:none !important;padding:0 !important;margin:0 !important}.screenplay-viewer *[class*=title]:not(.document-title),.screenplay-viewer *[class*=Title]:not(.document-title),.screenplay-viewer *[id*=title]:not(.document-title),.screenplay-viewer *[id*=Title]:not(.document-title){display:none !important;padding:0 !important;margin:0 !important;height:0 !important;overflow:hidden !important}.screenplay-viewer{padding:0 !important}.screenplay-viewer div[class*=title],.screenplay-viewer div[class*=Title],.screenplay-viewer div[id*=title],.screenplay-viewer div[id*=Title],.screenplay-viewer span[class*=title],.screenplay-viewer span[class*=Title],.screenplay-viewer span[id*=title],.screenplay-viewer span[id*=Title],.screenplay-viewer p[class*=title],.screenplay-viewer p[class*=Title],.screenplay-viewer p[id*=title],.screenplay-viewer p[id*=Title],.screenplay-viewer h1[class*=title],.screenplay-viewer h1[class*=Title],.screenplay-viewer h1[id*=title],.screenplay-viewer h1[id*=Title],.screenplay-viewer h2[class*=title],.screenplay-viewer h2[class*=Title],.screenplay-viewer h2[id*=title],.screenplay-viewer h2[id*=Title],.screenplay-viewer h3[class*=title],.screenplay-viewer h3[class*=Title],.screenplay-viewer h3[id*=title],.screenplay-viewer h3[id*=Title],.screenplay-viewer h4[class*=title],.screenplay-viewer h4[class*=Title],.screenplay-viewer h4[id*=title],.screenplay-viewer h4[id*=Title],.screenplay-viewer h5[class*=title],.screenplay-viewer h5[class*=Title],.screenplay-viewer h5[id*=title],.screenplay-viewer h5[id*=Title],.screenplay-viewer h6[class*=title],.screenplay-viewer h6[class*=Title],.screenplay-viewer h6[id*=title],.screenplay-viewer h6[id*=Title]{display:none !important;padding:0 !important;margin:0 !important;height:0 !important;width:0 !important;overflow:hidden !important;position:absolute !important;left:-9999px !important;top:-9999px !important}.screenplay-viewer *[class*=pdf] h1,.screenplay-viewer *[class*=pdf] h2,.screenplay-viewer *[class*=pdf] h3,.screenplay-viewer *[class*=pdf] h4,.screenplay-viewer *[class*=pdf] h5,.screenplay-viewer *[class*=pdf] h6,.screenplay-viewer *[class*=pdf] [class*=title],.screenplay-viewer *[class*=pdf] [class*=Title],.screenplay-viewer *[class*=pdf] [id*=title],.screenplay-viewer *[class*=pdf] [id*=Title],.screenplay-viewer *[class*=PDF] h1,.screenplay-viewer *[class*=PDF] h2,.screenplay-viewer *[class*=PDF] h3,.screenplay-viewer *[class*=PDF] h4,.screenplay-viewer *[class*=PDF] h5,.screenplay-viewer *[class*=PDF] h6,.screenplay-viewer *[class*=PDF] [class*=title],.screenplay-viewer *[class*=PDF] [class*=Title],.screenplay-viewer *[class*=PDF] [id*=title],.screenplay-viewer *[class*=PDF] [id*=Title],.screenplay-viewer *[class*=viewer] h1,.screenplay-viewer *[class*=viewer] h2,.screenplay-viewer *[class*=viewer] h3,.screenplay-viewer *[class*=viewer] h4,.screenplay-viewer *[class*=viewer] h5,.screenplay-viewer *[class*=viewer] h6,.screenplay-viewer *[class*=viewer] [class*=title],.screenplay-viewer *[class*=viewer] [class*=Title],.screenplay-viewer *[class*=viewer] [id*=title],.screenplay-viewer *[class*=viewer] [id*=Title],.screenplay-viewer *[class*=Viewer] h1,.screenplay-viewer *[class*=Viewer] h2,.screenplay-viewer *[class*=Viewer] h3,.screenplay-viewer *[class*=Viewer] h4,.screenplay-viewer *[class*=Viewer] h5,.screenplay-viewer *[class*=Viewer] h6,.screenplay-viewer *[class*=Viewer] [class*=title],.screenplay-viewer *[class*=Viewer] [class*=Title],.screenplay-viewer *[class*=Viewer] [id*=title],.screenplay-viewer *[class*=Viewer] [id*=Title],.screenplay-viewer *[class*=document] h1,.screenplay-viewer *[class*=document] h2,.screenplay-viewer *[class*=document] h3,.screenplay-viewer *[class*=document] h4,.screenplay-viewer *[class*=document] h5,.screenplay-viewer *[class*=document] h6,.screenplay-viewer *[class*=document] [class*=title],.screenplay-viewer *[class*=document] [class*=Title],.screenplay-viewer *[class*=document] [id*=title],.screenplay-viewer *[class*=document] [id*=Title],.screenplay-viewer *[class*=Document] h1,.screenplay-viewer *[class*=Document] h2,.screenplay-viewer *[class*=Document] h3,.screenplay-viewer *[class*=Document] h4,.screenplay-viewer *[class*=Document] h5,.screenplay-viewer *[class*=Document] h6,.screenplay-viewer *[class*=Document] [class*=title],.screenplay-viewer *[class*=Document] [class*=Title],.screenplay-viewer *[class*=Document] [id*=title],.screenplay-viewer *[class*=Document] [id*=Title]{display:none !important;padding:0 !important;margin:0 !important;height:0 !important;width:0 !important;overflow:hidden !important;position:absolute !important;left:-9999px !important;top:-9999px !important;font-size:0 !important;line-height:0 !important}.pdf-container,.pdf-scrollable-container,.react-pdf__Page{padding-top:0 !important;margin-top:0 !important}.panel-controls .search-input{font-size:.85rem;padding:4px 8px;min-width:80px;max-width:120px;border-radius:4px;border:1px solid #e2e8f0;background:#f3f4f6;color:#6b7280;margin-left:4px}.panel-controls{margin-bottom:0;gap:6px}.panel-header{margin-bottom:0;padding-bottom:8px}.screenplay-viewer,.viewer-content,.pdf-panel,.pdf-container,.pdf-scrollable-container,.react-pdf__Page{padding:0 !important;margin:0 !important;box-shadow:none !important;background:none !important}.sidebar-toggle-btn,.sidebar-toggle-btn-collapsed{display:none !important}.collaboration-panel{padding:0 !important;margin:0 !important;box-shadow:none !important;background:#f8fafc;border-left:1px solid #e2e8f0}.collaboration-panel.collapsed{transform:none !important;box-shadow:none !important}.screenplay-viewer h1:not(.document-title),.screenplay-viewer h2:not(.document-title),.screenplay-viewer h3:not(.document-title),.screenplay-viewer h4:not(.document-title),.screenplay-viewer h5:not(.document-title),.screenplay-viewer h6:not(.document-title){display:none !important;padding:0 !important;margin:0 !important;height:0 !important;overflow:hidden !important}.annotation-overlay.highlighted,.tag-overlay.highlighted{box-shadow:0 0 0 4px #3b82f6,0 2px 8px rgba(59,130,246,.15);border-width:3px !important;z-index:10;animation:pulse 1s}.annotation-tag-popup{position:fixed;left:50%;top:50%;transform:translate(-50%, -50%);z-index:3000;background:#fff;border:1px solid #e2e8f0;border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,.15);padding:18px 24px;min-width:260px;max-width:340px;font-size:15px;display:flex;flex-direction:column;gap:12px;cursor:default}.panel-controls select,.overlay-btn,.three-bars-icon{display:none !important}.pdf-floating-zoom-controls{position:absolute;right:16px;bottom:16px;z-index:2001;display:flex;align-items:center;gap:8px;background:rgba(245,245,245,.85);border-radius:24px;box-shadow:0 2px 8px rgba(0,0,0,.08);padding:8px 16px;transition:opacity .2s;opacity:.95}.pdf-floating-zoom-controls:hover{opacity:1}.pdf-floating-zoom-controls button{background:#f3f4f6;border:1px solid #e2e8f0;border-radius:50%;width:32px;height:32px;font-size:18px;color:#374151;cursor:pointer;transition:background .2s,color .2s}.pdf-floating-zoom-controls button:hover{background:#3b82f6;color:#fff}.pdf-floating-zoom-controls span{font-size:15px;color:#374151;min-width:40px;text-align:center}.sidebar-toggle-btn-collapsed{position:fixed !important;right:0;top:40%;z-index:3000;width:36px;height:48px;background:#f3f4f6;border:1px solid #e2e8f0;border-radius:0 8px 8px 0;color:#3b82f6;font-size:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.08);opacity:.85}.sidebar-toggle-btn-collapsed:hover{background:#3b82f6;color:#fff;opacity:1}.selection-popup{max-width:340px;min-width:180px;max-height:80vh;overflow-y:auto;cursor:grab;-webkit-user-select:none;-moz-user-select:none;user-select:none;box-shadow:0 4px 24px rgba(0,0,0,.15);border-radius:10px;border:1px solid #e2e8f0;background:#fff;z-index:3000;position:fixed;padding:18px 24px;font-size:15px;display:flex;flex-direction:column;gap:12px;transition:box-shadow .2s}.selection-popup:active{cursor:grabbing}.screenplay-modal .modal-header{position:relative;padding:0 !important;margin:0 !important;height:0 !important;min-height:0 !important;background:none !important;border:none !important}.screenplay-modal .modal-header h2{display:none !important}.screenplay-modal .modal-header .close-btn{position:fixed !important;top:16px !important;right:16px !important;z-index:3000 !important;background:hsla(0,0%,100%,.9) !important;border:1px solid #e2e8f0 !important;border-radius:50% !important;width:32px !important;height:32px !important;display:flex !important;align-items:center !important;justify-content:center !important;font-size:18px !important;color:#6b7280 !important;cursor:pointer !important;transition:all .2s ease !important}.screenplay-modal .modal-header .close-btn:hover{background:#f3f4f6 !important;color:#374151 !important}.screenplay-modal .modal-header>*:not(h2):not([class]):not(:empty):only-child{font-size:18px;color:red;display:none !important}.annotation-item{background:#fff;border-radius:10px;box-shadow:0 1px 4px rgba(30,41,59,.04);border:1px solid #e5e7eb;padding:14px 16px 10px 16px;margin-bottom:18px;font-family:"Inter","Segoe UI",Arial,sans-serif;transition:box-shadow .18s;position:relative}.annotation-item:hover{box-shadow:0 2px 8px rgba(30,41,59,.08);border-color:#cbd5e1}.annotation-header{display:flex;align-items:center;gap:10px;margin-bottom:2px}.annotation-author{display:flex;align-items:center;gap:8px;font-weight:600;color:#1e293b;font-size:1.08em}.annotation-author img,.annotation-author .avatar-placeholder{width:36px;height:36px;border-radius:50%;-o-object-fit:cover;object-fit:cover;background:#e0e7ef;font-size:1.1em;display:flex;align-items:center;justify-content:center}.annotation-meta{margin-left:auto;color:#94a3b8;font-size:.98em;font-weight:400}.annotation-content{color:#374151;font-size:1.04em;line-height:1.5;margin-bottom:4px;padding-left:1px}.replies-section.compact{margin:2px 0 0 0;padding-left:0;border-left:none;background:#f8fafc;border-radius:7px;box-shadow:none;display:flex;flex-direction:column;gap:0;border:1px solid #e5e7eb}.reply-item.compact{display:flex;flex-direction:column;background:#fff;border-radius:5px;box-shadow:none;padding:7px 12px 5px 16px;margin-bottom:2px;font-size:.96em;border-left:none;transition:background .18s}.reply-item.compact:nth-child(even){background:#f5f6fa}.reply-item.compact:nth-child(odd){background:#eceff3}.reply-item.compact:hover{background:#f0f4fa}.reply-header.compact{display:flex;align-items:center;gap:6px;margin-bottom:1px}.reply-content.compact{font-size:.98em;color:#374151;line-height:1.4;margin-bottom:0}.replies-section.compact{margin-bottom:4px}.annotation-actions{margin-top:2px;display:flex;gap:8px}.screenplay-viewer{overflow:hidden}.screenplay-viewer .viewer-content{overflow:hidden;height:100%}.screenplay-viewer .pdf-panel{overflow:hidden;height:100%}.pdf-scrollable-container{overflow-y:auto !important;overflow-x:hidden !important}.screenplay-modal-header{display:flex;align-items:center;justify-content:space-between;padding:10px 24px 6px 24px;background:rgba(0,0,0,0);border-bottom:1px solid #f1f5f9;position:sticky;top:0;z-index:10}.screenplay-title{font-size:1.35rem;font-weight:600;color:#1e293b;letter-spacing:-0.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.screenplay-close-btn{background:none;border:none;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;color:#64748b;transition:background .15s,color .15s;cursor:pointer;box-shadow:none;outline:none}.screenplay-close-btn:hover,.screenplay-close-btn:focus{background:#f1f5f9;color:#1e293b}.btn-close-absolute{position:fixed;top:32px;right:420px;z-index:5000;background:rgba(30,41,59,.32);border:none;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:hsla(0,0%,100%,.7);font-size:1.3rem;font-weight:300;cursor:pointer;box-shadow:none;outline:none;transition:background .15s,color .15s;padding:0;line-height:1}.btn-close-absolute:hover,.btn-close-absolute:focus{background:rgba(30,41,59,.6);color:#fff}@media(max-width: 900px){.btn-close-absolute{right:16px;top:8px}}.reply-btn.compact{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;background:none;color:#2563eb;border:none;border-radius:6px;font-size:.98em;font-weight:500;cursor:pointer;transition:background .15s,color .15s;outline:none;box-shadow:none;margin-top:8px;margin-bottom:2px;margin-left:0}.reply-btn.compact:hover,.reply-btn.compact:focus{background:#eff6ff;color:#1d4ed8}.annotation-actions .action-btn{background:#f8fafc;color:#2563eb;border:1.5px solid #cbd5e1;border-radius:999px;font-size:.98em;padding:4px 14px;margin-left:4px;font-weight:500;transition:background .15s,color .15s,border .15s;cursor:pointer;outline:none}.annotation-actions .action-btn:hover,.annotation-actions .action-btn:focus{background:#eff6ff;border-color:#2563eb;color:#1d4ed8}.annotation-item.resolved{background:#f8fafc;border-color:#e5e7eb;color:#94a3b8;opacity:.85}.replies-section.compact .reply-item.compact:first-child{border-left:none}.replies-section.compact{border-left:2.5px solid #e0e0e0;border-top:none;border-right:none;border-bottom:none;border-radius:7px}.no-users{text-align:center;padding:20px;color:#6b7280;font-size:.875rem;font-style:italic}.floating-collaboration-indicator{position:fixed;top:20px;right:20px;background:hsla(0,0%,100%,.95);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid rgba(0,0,0,.1);border-radius:12px;padding:12px 16px;box-shadow:0 4px 20px rgba(0,0,0,.1);z-index:1000;animation:slideInRight .3s ease-out}.floating-collaboration-indicator .indicator-content{display:flex;align-items:center;gap:12px}.floating-collaboration-indicator .indicator-content .active-users-count{display:flex;flex-direction:column;align-items:center}.floating-collaboration-indicator .indicator-content .active-users-count .count{font-size:1.25rem;font-weight:700;color:#1f2937;line-height:1}.floating-collaboration-indicator .indicator-content .active-users-count .label{font-size:.75rem;color:#6b7280;font-weight:500;text-transform:uppercase;letter-spacing:.5px}.floating-collaboration-indicator .indicator-content .users-avatars{display:flex;align-items:center;gap:4px}.floating-collaboration-indicator .indicator-content .users-avatars .mini-avatar{width:28px;height:28px;border-radius:50%;overflow:hidden;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.1)}.floating-collaboration-indicator .indicator-content .users-avatars .mini-avatar img{width:100%;height:100%;-o-object-fit:cover;object-fit:cover}.floating-collaboration-indicator .indicator-content .users-avatars .mini-avatar .mini-avatar-placeholder{width:100%;height:100%;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:.75rem}.floating-collaboration-indicator .indicator-content .users-avatars .more-users{width:28px;height:28px;border-radius:50%;background:#f3f4f6;color:#6b7280;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:600;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.1)}@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}.collaborators-section{margin-bottom:32px}.collaborators-section h4{margin:0 0 12px 0;color:#1f2937;font-size:1rem;font-weight:600}.collaborators-section .collaborators-list{display:flex;flex-direction:column;gap:10px;margin-bottom:10px}.collaborators-section .collaborators-list .collaborator-item{display:flex;align-items:center;gap:10px;background:#f8fafc;border-radius:7px;padding:8px 12px;border:1px solid #e2e8f0;transition:background .18s,border .18s}.collaborators-section .collaborators-list .collaborator-item:hover{background:#f1f5f9;border-color:#cbd5e1}.collaborators-section .collaborators-list .collaborator-item .collaborator-avatar{width:28px;height:28px;border-radius:50%;overflow:hidden;background:#e0e7ef;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:.9rem}.collaborators-section .collaborators-list .collaborator-item .collaborator-avatar img{width:100%;height:100%;-o-object-fit:cover;object-fit:cover}.collaborators-section .collaborators-list .collaborator-item .collaborator-avatar .avatar-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#fff;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%)}.collaborators-section .collaborators-list .collaborator-item .collaborator-info{display:flex;flex-direction:column;gap:2px}.collaborators-section .collaborators-list .collaborator-item .collaborator-info .collaborator-name{font-weight:500;color:#1f2937;font-size:.92em}.collaborators-section .collaborators-list .collaborator-item .collaborator-info .collaborator-role{font-size:.75em;color:#6b7280}.collaborators-section .collaborators-list .no-collaborators{color:#9ca3af;font-size:.92em;font-style:italic;padding:8px 0}.collaborators-section .add-collaborator-btn{margin-top:4px;padding:6px 14px;background:#3b82f6;color:#fff;border:none;border-radius:6px;font-size:.95em;font-weight:500;cursor:pointer;transition:background .18s}.collaborators-section .add-collaborator-btn:hover{background:#2563eb}.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(31,41,55,.18);z-index:2000;display:flex;align-items:center;justify-content:center;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}.modal-content{background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.18);width:100%;max-width:450px;min-width:0;padding:0;overflow:hidden;display:flex;flex-direction:column;max-height:80vh}.modal-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px 8px 18px;border-bottom:1px solid #e5e7eb}.modal-header h3{margin:0;font-size:1.08rem;font-weight:600;color:#1f2937}.modal-header .close-btn{background:none;border:none;font-size:1.4rem;color:#6b7280;cursor:pointer;padding:4px 8px;border-radius:6px;transition:all .18s}.modal-header .close-btn:hover{color:#ef4444}.modal-header .close-btn:focus{outline:2px solid #3b82f6;outline-offset:2px}.modal-body{padding:16px 18px 18px 18px}.modal-body .collaborator-search-input{width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:1em;margin-bottom:12px;outline:none;transition:border .18s,box-shadow .18s}.modal-body .collaborator-search-input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}.modal-body .collaborator-search-results{max-height:300px;overflow-y:auto}.modal-body .collaborator-search-results .user-result{display:flex;align-items:center;justify-content:space-between;padding:12px;border-radius:8px;margin-bottom:8px;border:1px solid #f3f4f6;transition:all .18s}.modal-body .collaborator-search-results .user-result:hover{background:#f8fafc;border-color:#e5e7eb}.modal-body .collaborator-search-results .user-result:last-child{margin-bottom:0}.modal-body .collaborator-search-results .user-result .user-info{display:flex;align-items:center;gap:12px;flex:1;min-width:0}.modal-body .collaborator-search-results .user-result .user-info .user-avatar{position:relative;width:40px;height:40px;border-radius:50%;overflow:hidden;flex-shrink:0}.modal-body .collaborator-search-results .user-result .user-info .user-avatar img{width:100%;height:100%;-o-object-fit:cover;object-fit:cover}.modal-body .collaborator-search-results .user-result .user-info .user-avatar .avatar-placeholder{width:100%;height:100%;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:1rem}.modal-body .collaborator-search-results .user-result .user-info .user-avatar .following-badge{position:absolute;bottom:-2px;right:-2px;width:16px;height:16px;background:#10b981;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;border:2px solid #fff}.modal-body .collaborator-search-results .user-result .user-info .user-details{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}.modal-body .collaborator-search-results .user-result .user-info .user-details .user-name{font-weight:600;color:#1f2937;font-size:.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.modal-body .collaborator-search-results .user-result .user-info .user-details .user-email{color:#6b7280;font-size:.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.modal-body .collaborator-search-results .user-result .user-info .user-details .user-role{color:#3b82f6;font-size:.8rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.modal-body .collaborator-search-results .user-result .add-btn{background:#10b981;color:#fff;border:none;border-radius:6px;padding:8px 16px;font-size:.9rem;font-weight:500;cursor:pointer;transition:all .18s;flex-shrink:0}.modal-body .collaborator-search-results .user-result .add-btn:hover:not(:disabled){background:#059669;transform:translateY(-1px)}.modal-body .collaborator-search-results .user-result .add-btn:disabled{background:#9ca3af;cursor:not-allowed;transform:none}.modal-body .collaborator-search-results .no-results{text-align:center;padding:20px;color:#6b7280}.modal-body .collaborator-search-results .no-results p{margin:0 0 8px 0;font-size:.95rem}.modal-body .collaborator-search-results .no-results .search-tip{font-size:.85rem;color:#9ca3af;font-style:italic}.avatar{width:40px;height:40px;border-radius:50%;overflow:hidden;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:1.1rem}.avatar-list{width:32px;height:32px;font-size:1rem}.avatar-mini{width:28px;height:28px;font-size:.9rem}.avatar .online-indicator,.avatar-list .online-indicator,.avatar-mini .online-indicator{position:absolute;bottom:0;right:0;width:12px;height:12px;border-radius:50%;border:2px solid #fff;background:#10b981;box-shadow:0 0 0 2px rgba(16,185,129,.2)}.card-standard{background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 1px 4px rgba(30,41,59,.04);padding:14px 16px 10px 16px;margin-bottom:12px;transition:box-shadow .18s,border .18s}.card-standard:hover{box-shadow:0 2px 8px rgba(30,41,59,.08);border-color:#cbd5e1}.nav-item.active{background:#2563eb;color:#fff;box-shadow:0 2px 8px rgba(37,99,235,.1);font-weight:600}.collaborators-list,.users-list{gap:6px;margin-bottom:6px}.collaborator-name,.user-name,.member-name{color:#1e2937;font-weight:600}`, "",{"version":3,"sources":["webpack://./src/components/Collaboration/ScreenplayViewer.scss"],"names":[],"mappings":"AAAA,2BACE,cAAA,CACA,KAAA,CACA,MAAA,CACA,OAAA,CACA,QAAA,CACA,0BAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,YAAA,CACA,iCAAA,CAAA,yBAAA,CAGF,mBACE,eAAA,CACA,kBAAA,CACA,qCAAA,CACA,UAAA,CACA,WAAA,CACA,gBAAA,CACA,YAAA,CACA,qBAAA,CACA,eAAA,CACA,iBAAA,CACA,aAAA,CACA,gBAAA,CACA,cAAA,CACA,eAAA,CACA,qBAAA,CAGE,0CACE,yBAAA,CAKF,yCACE,6BAAA,CAIJ,8BACE,UAAA,CACA,WAAA,CACA,cAAA,CAIA,kQACE,uBAAA,CACA,oBAAA,CACA,mBAAA,CAMF,+PACE,uBAAA,CACA,oBAAA,CACA,mBAAA,CACA,uBAAA,CASF,8jCACE,uBAAA,CACA,oBAAA,CACA,mBAAA,CAIF,43BAEE,uBAAA,CACA,oBAAA,CACA,mBAAA,CAOA,ggBACE,uBAAA,CACA,oBAAA,CACA,mBAAA,CACA,uBAAA,CAOJ,+FACE,uBAAA,CACA,oBAAA,CACA,mBAAA,CAKN,eACE,uBAAA,CACA,kBAAA,CACA,6BAAA,CACA,0BAAA,CACA,wBAAA,CACA,+BAAA,CACA,eAAA,CACA,KAAA,CACA,UAAA,CAGF,WACE,eAAA,CACA,WAAA,CACA,iBAAA,CACA,UAAA,CACA,WAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,aAAA,CACA,qCAAA,CACA,cAAA,CACA,eAAA,CACA,YAAA,CACA,cAAA,CACA,gBAAA,CAEA,kCACE,kBAAA,CACA,aAAA,CAIJ,uBACE,uBAAA,CAGF,gBACE,YAAA,CACA,yBAAA,CACA,2BACE,WAAA,CACA,WAAA,CACA,eAAA,CACA,iBAAA,CACA,SAAA,CACA,eAAA,CAEF,qCACE,iBAAA,CACA,WAAA,CACA,eAAA,CACA,eAAA,CACA,SAAA,CACA,kBAAA,CACA,6BAAA,CACA,YAAA,CACA,qBAAA,CACA,sDAAA,CACA,eAAA,CACA,uBAAA,CACA,+CACE,0BAAA,CACA,eAAA,CAKN,WACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,iBAAA,CAEA,yBACE,YAAA,CACA,kBAAA,CACA,6BAAA,CACA,iBAAA,CACA,eAAA,CACA,+BAAA,CAEA,8CACE,YAAA,CACA,kBAAA,CACA,QAAA,CAEA,uDACE,kBAAA,CACA,WAAA,CACA,UAAA,CACA,gBAAA,CACA,iBAAA,CACA,cAAA,CACA,eAAA,CACA,uBAAA,CAEA,4EACE,kBAAA,CAGF,gEACE,kBAAA,CACA,kBAAA,CAIJ,4DACE,eAAA,CACA,aAAA,CACA,cAAA,CACA,iBAAA,CAIJ,wCACE,YAAA,CACA,kBAAA,CACA,OAAA,CAEA,+CACE,kBAAA,CACA,wBAAA,CACA,aAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,cAAA,CACA,uBAAA,CAEA,qDACE,kBAAA,CACA,aAAA,CAIJ,oDACE,eAAA,CACA,aAAA,CACA,cAAA,CACA,iBAAA,CAKN,0BACE,iBAAA,CACA,UAAA,CACA,WAAA,CACA,aAAA,CACA,kBAAA,CAIJ,0BACE,UAAA,CACA,WAAA,CACA,eAAA,CACA,iBAAA,CACA,YAAA,CACA,kBAAA,CACA,iBAAA,CAGA,gCACE,eAAA,CAIF,6CACE,SAAA,CAGF,mDACE,kBAAA,CACA,iBAAA,CAGF,mDACE,kBAAA,CACA,iBAAA,CAEA,yDACE,kBAAA,CAIJ,0CACE,YAAA,CACA,sBAAA,CACA,kBAAA,CAEA,qDACE,eAAA,CAKN,cACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,sBAAA,CACA,YAAA,CACA,aAAA,CACA,iBAAA,CAGF,YACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,sBAAA,CACA,YAAA,CACA,aAAA,CACA,iBAAA,CACA,iBAAA,CAEA,kBACE,cAAA,CACA,aAAA,CAIJ,qBACE,eAAA,CACA,6BAAA,CACA,YAAA,CACA,qBAAA,CACA,eAAA,CAEA,mCACE,uBAAA,CAGF,oCACE,MAAA,CACA,aAAA,CACA,iBAAA,CAEA,kDACE,kBAAA,CAEA,qDACE,iBAAA,CACA,aAAA,CACA,cAAA,CACA,eAAA,CAGF,8DACE,YAAA,CACA,qBAAA,CACA,QAAA,CAEA,yEACE,YAAA,CACA,kBAAA,CACA,QAAA,CACA,YAAA,CACA,kBAAA,CACA,iBAAA,CACA,wBAAA,CACA,uBAAA,CAEA,+EACE,kBAAA,CACA,oBAAA,CAGF,sFACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,eAAA,CACA,iBAAA,CAEA,0FACE,UAAA,CACA,WAAA,CACA,mBAAA,CAAA,gBAAA,CAGF,0GACE,UAAA,CACA,WAAA,CACA,4DAAA,CACA,UAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,eAAA,CACA,iBAAA,CAGF,wGACE,iBAAA,CACA,QAAA,CACA,OAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,qBAAA,CAEA,+GACE,kBAAA,CACA,wCAAA,CAGF,gHACE,kBAAA,CAKN,oFACE,YAAA,CACA,qBAAA,CACA,OAAA,CACA,MAAA,CAEA,+FACE,eAAA,CACA,aAAA,CACA,iBAAA,CAGF,iGACE,gBAAA,CACA,aAAA,CACA,eAAA,CAEA,4GACE,aAAA,CACA,eAAA,CAIJ,+FACE,gBAAA,CACA,aAAA,CAOV,2GAEE,kBAAA,CAEA,iHACE,iBAAA,CACA,aAAA,CACA,cAAA,CACA,eAAA,CAGF,gRAEE,YAAA,CACA,qBAAA,CACA,QAAA,CAEA,4oBAEE,eAAA,CACA,wBAAA,CACA,iBAAA,CACA,YAAA,CACA,uBAAA,CAEA,4rBACE,oBAAA,CACA,oCAAA,CAGF,otBACE,UAAA,CACA,kBAAA,CAEA,grDAEE,4BAAA,CAIJ,ghDAEE,YAAA,CACA,kBAAA,CACA,6BAAA,CACA,kBAAA,CAEA,ghHAEE,YAAA,CACA,kBAAA,CACA,OAAA,CAEA,gpIACE,UAAA,CACA,WAAA,CACA,4DAAA,CACA,UAAA,CACA,iBAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,gBAAA,CACA,eAAA,CAGF,grHACE,eAAA,CACA,aAAA,CACA,iBAAA,CAIJ,g9GAEE,YAAA,CACA,OAAA,CACA,gBAAA,CACA,aAAA,CAIJ,4yBACE,aAAA,CACA,eAAA,CACA,kBAAA,CAGF,ovBACE,YAAA,CACA,kBAAA,CACA,OAAA,CACA,kBAAA,CAEA,o0BACE,eAAA,CACA,kBAAA,CACA,UAAA,CACA,gBAAA,CACA,eAAA,CACA,yBAAA,CAGF,o0BACE,aAAA,CACA,eAAA,CAIJ,giDAEE,YAAA,CACA,OAAA,CACA,cAAA,CAEA,guDACE,kBAAA,CACA,wBAAA,CACA,aAAA,CACA,eAAA,CACA,iBAAA,CACA,cAAA,CACA,gBAAA,CACA,uBAAA,CAEA,g0DACE,kBAAA,CACA,aAAA,CAGF,g3DACE,kBAAA,CACA,oBAAA,CACA,aAAA,CAGF,g1DACE,kBAAA,CACA,oBAAA,CACA,aAAA,CAEA,g7DACE,kBAAA,CACA,aAAA,CAYlB,oBACE,mCAAA,CACA,0BAAA,CACA,4BAAA,CACA,wCAAA,CACA,sCAAA,CACA,iBAAA,CACA,SAAA,CACA,mBAAA,CACA,gBAAA,CAGF,uDACE,0BAAA,CACA,yCAAA,CAGF,aACE,oCAAA,CACA,0BAAA,CACA,4BAAA,CACA,yCAAA,CACA,sCAAA,CACA,iBAAA,CACA,SAAA,CACA,mBAAA,CACA,gBAAA,CAGF,yCACE,0BAAA,CACA,0CAAA,CAGF,aACE,iBAAA,CACA,UAAA,CAEA,6BACE,uBAAA,CAGF,2BACE,iBAAA,CACA,QAAA,CACA,UAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,kBAAA,CACA,UAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,cAAA,CACA,eAAA,CACA,qBAAA,CACA,mCAAA,CAIJ,sBACE,iBAAA,CACA,WAAA,CACA,QAAA,CACA,0BAAA,CACA,yBAAA,CACA,UAAA,CACA,iBAAA,CACA,iBAAA,CACA,iBAAA,CACA,UAAA,CACA,2BAAA,CAIF,gBACE,GAAA,sBAAA,CACA,KAAA,wBAAA,CAAA,CAGF,iBACE,GACE,sCAAA,CAEF,IACE,wCAAA,CAEF,KACE,qCAAA,CAAA,CAIJ,oBACE,KACE,SAAA,CACA,2CAAA,CAEF,GACE,SAAA,CACA,wCAAA,CAAA,CAKJ,0BACE,mBACE,UAAA,CACA,WAAA,CAGE,yCACE,yBAAA,CAGF,8CACE,iBAAA,CACA,OAAA,CACA,QAAA,CACA,QAAA,CACA,WAAA,CACA,0BAAA,CACA,6BAAA,CAEA,mDACE,uBAAA,CAON,8BACE,YAAA,CAIA,kGAEE,YAAA,CAAA,CAMR,yBACE,mBACE,WAAA,CACA,YAAA,CACA,eAAA,CAEA,0CACE,eAAA,CACA,eAAA,CACA,WAAA,CACA,eAAA,CAGE,+EACE,eAAA,CACA,eAAA,CACA,UAAA,CAIJ,mEACE,OAAA,CAEA,0FACE,eAAA,CAEA,iGACE,eAAA,CACA,aAAA,CAGF,+FACE,aAAA,CACA,cAAA,CAIJ,6PAGE,eAAA,CACA,cAAA,CAGF,sFACE,UAAA,CACA,WAAA,CACA,cAAA,CAMR,gBACE,yBAAA,CAGF,qBACE,cAAA,CACA,OAAA,CACA,KAAA,CACA,YAAA,CACA,UAAA,CACA,WAAA,CACA,cAAA,CACA,YAAA,CACA,sCAAA,CACA,eAAA,CACA,6BAAA,CACA,qDAAA,CAEA,+BACE,0BAAA,CACA,qBAAA,CACA,yBAAA,CACA,yBAAA,CACA,eAAA,CAGF,yCACE,UAAA,CACA,QAAA,CAIJ,oBACE,sBAAA,CACA,WAAA,CACA,cAAA,CAAA,CAIJ,+BAEE,mBAAA,CACA,mCAAA,CACA,iBAAA,CACA,gBAAA,CACA,0CAAA,CACA,cAAA,CACA,wBAAA,CAAA,qBAAA,CAAA,gBAAA,CAGF,2CACE,qCAAA,CACA,uBAAA,CAGF,2BAEE,cAAA,CACA,aAAA,CAOE,iFACE,kBAAA,CACA,yBAAA,CAGF,mFACE,eAAA,CAQJ,6CACE,qBAAA,CACA,qCAAA,CAEA,wJAEE,oBAAA,CAIJ,mDACE,2BAAA,CACA,wCAAA,CACA,8BAAA,CAGF,mDACE,UAAA,CAEA,oKAEE,UAAA,CAMN,iBACE,GACE,sCAAA,CAEF,IACE,wCAAA,CAEF,KACE,qCAAA,CAAA,CAKJ,yCAEE,kCAAA,CAAA,0BAAA,CACA,qCAAA,CACA,2EACE,CAGF,qEACE,4DAAA,CACA,+BAAA,CACA,mCAAA,CACA,cAAA,CACA,2BAAA,CAEA,2EACE,QAAA,CACA,aAAA,CACA,gBAAA,CACA,eAAA,CAOF,2MACE,YAAA,CACA,oBAAA,CACA,wCAAA,CAKF,mEACE,0BAAA,CACA,qCAAA,CAGF,qEACE,uBAAA,CAMN,kBACE,cAAA,CACA,eAAA,CACA,wBAAA,CACA,kBAAA,CACA,sCAAA,CACA,YAAA,CACA,eAAA,CACA,eAAA,CACA,eAAA,CACA,eAAA,CAEA,+BACE,UAAA,CACA,QAAA,CACA,WAAA,CAOF,gCACE,YAAA,CACA,kBAAA,CACA,QAAA,CACA,YAAA,CACA,+BAAA,CACA,kBAAA,CACA,2BAAA,CAEA,+CACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,kBAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,cAAA,CAEA,mDACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,mBAAA,CAAA,gBAAA,CAIJ,6CACE,eAAA,CACA,aAAA,CACA,MAAA,CAGF,2CACE,iBAAA,CACA,aAAA,CAGF,2CACE,eAAA,CACA,WAAA,CACA,cAAA,CACA,aAAA,CACA,cAAA,CACA,WAAA,CACA,iBAAA,CACA,uBAAA,CAEA,iDACE,kBAAA,CACA,aAAA,CAKN,sCACE,YAAA,CAEA,4DACE,iBAAA,CACA,aAAA,CACA,eAAA,CACA,kBAAA,CACA,YAAA,CACA,kBAAA,CACA,iBAAA,CACA,6BAAA,CAIA,6DACE,iBAAA,CACA,iBAAA,CACA,eAAA,CACA,aAAA,CAGF,wEACE,gBAAA,CACA,eAAA,CACA,kBAAA,CAEA,oFACE,gBAAA,CACA,kBAAA,CACA,iBAAA,CACA,iBAAA,CACA,iBAAA,CAEA,kGACE,YAAA,CACA,6BAAA,CACA,kBAAA,CACA,iBAAA,CAEA,gHACE,eAAA,CACA,gBAAA,CACA,aAAA,CAGF,8GACE,gBAAA,CACA,aAAA,CAIJ,mGACE,iBAAA,CACA,aAAA,CACA,eAAA,CAGF,sGACE,iBAAA,CACA,OAAA,CACA,SAAA,CACA,eAAA,CACA,WAAA,CACA,aAAA,CACA,cAAA,CACA,cAAA,CACA,eAAA,CACA,iBAAA,CACA,SAAA,CACA,2BAAA,CAEA,4GACE,kBAAA,CAIJ,4GACE,SAAA,CAKN,6EACE,YAAA,CACA,OAAA,CAEA,mFACE,MAAA,CACA,gBAAA,CACA,wBAAA,CACA,iBAAA,CACA,iBAAA,CAEA,yFACE,YAAA,CACA,oBAAA,CACA,wCAAA,CAIJ,oFACE,gBAAA,CACA,kBAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,iBAAA,CACA,eAAA,CACA,cAAA,CACA,uBAAA,CAEA,yGACE,kBAAA,CAGF,6FACE,kBAAA,CACA,kBAAA,CASZ,aACE,iBAAA,CACA,iBAAA,CACA,cAAA,CACA,uBAAA,CACA,SAAA,CAEA,mBACE,qBAAA,CACA,qCAAA,CAGF,sBACE,2BAAA,CACA,wCAAA,CACA,8BAAA,CAGF,sBACE,UAAA,CAEA,kCACE,6BAAA,CAIJ,yBACE,iBAAA,CACA,QAAA,CACA,UAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,cAAA,CACA,oCAAA,CACA,uBAAA,CACA,UAAA,CAKJ,oBACE,cAAA,CACA,OAAA,CACA,QAAA,CACA,+BAAA,CACA,yBAAA,CACA,UAAA,CACA,iBAAA,CACA,iBAAA,CACA,YAAA,CACA,iBAAA,CACA,YAAA,CACA,kBAAA,CACA,OAAA,CAEA,6BACE,UAAA,CACA,WAAA,CACA,8BAAA,CACA,yBAAA,CACA,iBAAA,CACA,iCAAA,CAKJ,0BACE,qBAAA,CACA,0BAAA,CAGF,iCAEE,qBAAA,CACA,0BAAA,CAIF,iBACE,QACE,kBAAA,CAEF,IACE,qBAAA,CAAA,CAIJ,gBACE,KACE,sBAAA,CAEF,GACE,wBAAA,CAAA,CAKJ,yBAEI,+BACE,UAAA,CACA,SAAA,CACA,UAAA,CACA,cAAA,CAGF,6BACE,oBAAA,CACA,qBAAA,CACA,qBAAA,CACA,cAAA,CAIJ,eACE,qBAAA,CACA,QAAA,CAEA,8BACE,OAAA,CAGF,+BACE,OAAA,CAAA,CAMN,6DAGE,mCAAA,CACA,6BAAA,CACA,0BAAA,CAGE,oGACE,yBAAA,CACA,kBAAA,CAGF,uGACE,yBAAA,CAKF,+SACE,yBAAA,CACA,kBAAA,CAKN,uBACE,KACE,SAAA,CACA,sCAAA,CAEF,GACE,SAAA,CACA,gCAAA,CAAA,CAOF,6CACE,qBAAA,CACA,mCAAA,CAGF,mDACE,2BAAA,CACA,wCAAA,CACA,+BAAA,CAGF,mDACE,UAAA,CAEA,oKAEE,6BAAA,CAMN,8BACE,gBAAA,CACA,wBAAA,CACA,qBAAA,CACA,oBAAA,CAKA,gCACE,YAAA,CAIA,iKACE,yBAAA,CACA,kBAAA,CAMN,yBACE,6DAGE,oBAAA,CACA,qBAAA,CACA,qBAAA,CACA,cAAA,CACA,cAAA,CAKA,gIAEE,qBAAA,CACA,sBAAA,CACA,yBAAA,CAAA,CAKN,oBACE,qBAAA,CACA,aAAA,CACA,iDAAA,CAGF,yBACE,qBACE,cAAA,CACA,OAAA,CACA,KAAA,CACA,YAAA,CACA,UAAA,CACA,WAAA,CACA,cAAA,CACA,YAAA,CACA,sCAAA,CACA,eAAA,CACA,6BAAA,CACA,qDAAA,CACA,+BACE,0BAAA,CACA,qBAAA,CACA,yBAAA,CACA,yBAAA,CACA,eAAA,CAEF,yCACE,UAAA,CACA,QAAA,CAGJ,oBACE,sBAAA,CACA,WAAA,CACA,cAAA,CAAA,CAIJ,qBACE,QAAA,uBAAA,CACA,IAAA,0BAAA,CACA,IAAA,uBAAA,CACA,IAAA,0BAAA,CACA,IAAA,uBAAA,CAAA,CAIF,uBACE,sBAAA,CACA,0BAAA,CACA,wBAAA,CACA,6BAAA,CACA,0CAAA,CACA,YAAA,CACA,kBAAA,CACA,4DACE,0BAAA,CACA,0BAAA,CACA,wBAAA,CACA,qBAAA,CACA,mBAAA,CACA,oBAAA,CAKJ,eACE,iBAAA,CACA,UAAA,CACA,WAAA,CACA,aAAA,CACA,kBAAA,CAGF,0BACE,UAAA,CACA,WAAA,CACA,eAAA,CACA,iBAAA,CACA,YAAA,CACA,kBAAA,CACA,iBAAA,CAGA,gCACE,eAAA,CAIF,6CACE,SAAA,CAGF,mDACE,kBAAA,CACA,iBAAA,CAGF,mDACE,kBAAA,CACA,iBAAA,CAEA,yDACE,kBAAA,CAIJ,0CACE,YAAA,CACA,sBAAA,CACA,kBAAA,CAEA,qDACE,eAAA,CAKN,cACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,sBAAA,CACA,YAAA,CACA,aAAA,CACA,iBAAA,CAGF,YACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,sBAAA,CACA,YAAA,CACA,aAAA,CACA,iBAAA,CAKA,gJACE,uBAAA,CACA,oBAAA,CACA,mBAAA,CAGF,mDACE,gBAAA,CACA,wBAAA,CACA,qBAAA,CACA,oBAAA,CAMF,4GACE,uBAAA,CACA,oBAAA,CACA,mBAAA,CAIA,0OACE,uBAAA,CACA,oBAAA,CACA,mBAAA,CAMN,uCACE,wBAAA,CACA,6BAAA,CACA,oBAAA,CAME,kQACE,uBAAA,CACA,oBAAA,CACA,mBAAA,CAOJ,iDACE,uBAAA,CACA,oBAAA,CACA,mBAAA,CAQA,0NACE,uBAAA,CACA,oBAAA,CACA,mBAAA,CACA,mBAAA,CACA,0BAAA,CAMN,mBAEE,oBAAA,CAIE,kuCAEE,uBAAA,CACA,oBAAA,CACA,mBAAA,CACA,mBAAA,CACA,kBAAA,CACA,0BAAA,CACA,4BAAA,CACA,uBAAA,CACA,sBAAA,CAYA,4gFAGE,uBAAA,CACA,oBAAA,CACA,mBAAA,CACA,mBAAA,CACA,kBAAA,CACA,0BAAA,CACA,4BAAA,CACA,uBAAA,CACA,sBAAA,CACA,sBAAA,CACA,wBAAA,CAMR,0DACE,wBAAA,CACA,uBAAA,CAIF,8BACE,gBAAA,CACA,eAAA,CACA,cAAA,CACA,eAAA,CACA,iBAAA,CACA,wBAAA,CACA,kBAAA,CACA,aAAA,CACA,eAAA,CAIF,gBACE,eAAA,CACA,OAAA,CAIF,cACE,eAAA,CACA,kBAAA,CAGF,wGACE,oBAAA,CACA,mBAAA,CACA,0BAAA,CACA,0BAAA,CAIF,kDAAA,uBAAA,CACA,qBAAA,oBAAA,CAAA,mBAAA,CAAA,0BAAA,CAAA,kBAAA,CAAA,6BAAA,CACA,+BAAA,yBAAA,CAAA,0BAAA,CAIE,kQACE,uBAAA,CACA,oBAAA,CACA,mBAAA,CACA,mBAAA,CACA,0BAAA,CAKJ,yDACE,2DAAA,CACA,2BAAA,CACA,UAAA,CACA,kBAAA,CAIF,sBACE,cAAA,CACA,QAAA,CACA,OAAA,CACA,+BAAA,CACA,YAAA,CACA,eAAA,CACA,wBAAA,CACA,kBAAA,CACA,qCAAA,CACA,iBAAA,CACA,eAAA,CACA,eAAA,CACA,cAAA,CACA,YAAA,CACA,qBAAA,CACA,QAAA,CACA,cAAA,CAIF,qDAAA,uBAAA,CAEA,4BACE,iBAAA,CACA,UAAA,CACA,WAAA,CACA,YAAA,CACA,YAAA,CACA,kBAAA,CACA,OAAA,CACA,gCAAA,CACA,kBAAA,CACA,oCAAA,CACA,gBAAA,CACA,sBAAA,CACA,WAAA,CACA,kCAAA,SAAA,CACA,mCACE,kBAAA,CACA,wBAAA,CACA,iBAAA,CACA,UAAA,CACA,WAAA,CACA,cAAA,CACA,aAAA,CACA,cAAA,CACA,mCAAA,CACA,yCAAA,kBAAA,CAAA,UAAA,CAEF,iCACE,cAAA,CACA,aAAA,CACA,cAAA,CACA,iBAAA,CAIJ,8BACE,yBAAA,CACA,OAAA,CACA,OAAA,CACA,YAAA,CACA,UAAA,CACA,WAAA,CACA,kBAAA,CACA,wBAAA,CACA,yBAAA,CACA,aAAA,CACA,cAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,cAAA,CACA,oCAAA,CACA,WAAA,CACA,oCAAA,kBAAA,CAAA,UAAA,CAAA,SAAA,CAIF,iBACE,eAAA,CACA,eAAA,CACA,eAAA,CACA,eAAA,CACA,WAAA,CACA,wBAAA,CAAA,qBAAA,CAAA,gBAAA,CACA,qCAAA,CACA,kBAAA,CACA,wBAAA,CACA,eAAA,CACA,YAAA,CACA,cAAA,CACA,iBAAA,CACA,cAAA,CACA,YAAA,CACA,qBAAA,CACA,QAAA,CACA,yBAAA,CAEF,wBACE,eAAA,CAGF,gCACE,iBAAA,CACA,oBAAA,CACA,mBAAA,CACA,mBAAA,CACA,uBAAA,CACA,0BAAA,CACA,sBAAA,CAEA,mCACE,uBAAA,CAGF,2CACE,yBAAA,CACA,mBAAA,CACA,qBAAA,CACA,uBAAA,CACA,wCAAA,CACA,mCAAA,CACA,4BAAA,CACA,qBAAA,CACA,sBAAA,CACA,uBAAA,CACA,6BAAA,CACA,iCAAA,CACA,yBAAA,CACA,wBAAA,CACA,yBAAA,CACA,kCAAA,CAEA,iDACE,6BAAA,CACA,wBAAA,CAUA,8EAEE,cAAA,CACA,SAAA,CACA,uBAAA,CAOR,iBACE,eAAA,CACA,kBAAA,CACA,uCAAA,CACA,wBAAA,CACA,2BAAA,CACA,kBAAA,CACA,+CAAA,CACA,0BAAA,CACA,iBAAA,CACA,uBACE,uCAAA,CACA,oBAAA,CAIJ,mBACE,YAAA,CACA,kBAAA,CACA,QAAA,CACA,iBAAA,CAGF,mBACE,YAAA,CACA,kBAAA,CACA,OAAA,CACA,eAAA,CACA,aAAA,CACA,gBAAA,CAGF,8DACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,mBAAA,CAAA,gBAAA,CACA,kBAAA,CACA,eAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CAGF,iBACE,gBAAA,CACA,aAAA,CACA,eAAA,CACA,eAAA,CAGF,oBACE,aAAA,CACA,gBAAA,CACA,eAAA,CACA,iBAAA,CACA,gBAAA,CAIF,yBACE,gBAAA,CACA,cAAA,CACA,gBAAA,CACA,kBAAA,CACA,iBAAA,CACA,eAAA,CACA,YAAA,CACA,qBAAA,CACA,KAAA,CACA,wBAAA,CAGF,oBACE,YAAA,CACA,qBAAA,CACA,eAAA,CACA,iBAAA,CACA,eAAA,CACA,yBAAA,CACA,iBAAA,CACA,eAAA,CACA,gBAAA,CACA,0BAAA,CAGF,oCACE,kBAAA,CAGF,mCACE,kBAAA,CAGF,0BACE,kBAAA,CAGF,sBACE,YAAA,CACA,kBAAA,CACA,OAAA,CACA,iBAAA,CAGF,uBACE,eAAA,CACA,aAAA,CACA,eAAA,CACA,eAAA,CAIF,yBACE,iBAAA,CAGF,oBACE,cAAA,CACA,YAAA,CACA,OAAA,CAIF,mBACE,eAAA,CAEA,mCACE,eAAA,CACA,WAAA,CAGF,8BACE,eAAA,CACA,WAAA,CAKJ,0BACE,0BAAA,CACA,4BAAA,CAGF,yBACE,YAAA,CACA,kBAAA,CACA,6BAAA,CACA,0BAAA,CACA,wBAAA,CACA,+BAAA,CACA,eAAA,CACA,KAAA,CACA,UAAA,CAGF,kBACE,iBAAA,CACA,eAAA,CACA,aAAA,CACA,sBAAA,CACA,kBAAA,CACA,eAAA,CACA,sBAAA,CAGF,sBACE,eAAA,CACA,WAAA,CACA,iBAAA,CACA,UAAA,CACA,WAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,aAAA,CACA,qCAAA,CACA,cAAA,CACA,eAAA,CACA,YAAA,CAEA,wDACE,kBAAA,CACA,aAAA,CAIJ,oBACE,cAAA,CACA,QAAA,CAEA,WAAA,CACA,YAAA,CACA,6BAAA,CACA,WAAA,CACA,iBAAA,CACA,UAAA,CACA,WAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,wBAAA,CACA,gBAAA,CACA,eAAA,CACA,cAAA,CACA,eAAA,CACA,YAAA,CACA,qCAAA,CACA,SAAA,CACA,aAAA,CAEA,oDACE,4BAAA,CACA,UAAA,CAIJ,yBACE,oBACE,UAAA,CACA,OAAA,CAAA,CAIJ,mBACE,mBAAA,CACA,kBAAA,CACA,OAAA,CACA,eAAA,CACA,eAAA,CACA,aAAA,CACA,WAAA,CACA,iBAAA,CACA,eAAA,CACA,eAAA,CACA,cAAA,CACA,qCAAA,CACA,YAAA,CACA,eAAA,CACA,cAAA,CACA,iBAAA,CACA,aAAA,CACA,kDACE,kBAAA,CACA,aAAA,CAKJ,gCACE,kBAAA,CACA,aAAA,CACA,0BAAA,CACA,mBAAA,CACA,eAAA,CACA,gBAAA,CACA,eAAA,CACA,eAAA,CACA,iDAAA,CACA,cAAA,CACA,YAAA,CACA,4EACE,kBAAA,CACA,oBAAA,CACA,aAAA,CAKJ,0BACE,kBAAA,CACA,oBAAA,CACA,aAAA,CACA,WAAA,CAGF,yDACE,gBAAA,CAGF,yBACE,+BAAA,CACA,eAAA,CACA,iBAAA,CACA,kBAAA,CACA,iBAAA,CAGF,UACE,iBAAA,CACA,YAAA,CACA,aAAA,CACA,iBAAA,CACA,iBAAA,CAGF,kCACE,cAAA,CACA,QAAA,CACA,UAAA,CACA,8BAAA,CACA,kCAAA,CAAA,0BAAA,CACA,+BAAA,CACA,kBAAA,CACA,iBAAA,CACA,oCAAA,CACA,YAAA,CACA,mCAAA,CAEA,qDACE,YAAA,CACA,kBAAA,CACA,QAAA,CAEA,yEACE,YAAA,CACA,qBAAA,CACA,kBAAA,CAEA,gFACE,iBAAA,CACA,eAAA,CACA,aAAA,CACA,aAAA,CAGF,gFACE,gBAAA,CACA,aAAA,CACA,eAAA,CACA,wBAAA,CACA,mBAAA,CAIJ,oEACE,YAAA,CACA,kBAAA,CACA,OAAA,CAEA,iFACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,eAAA,CACA,qBAAA,CACA,mCAAA,CAEA,qFACE,UAAA,CACA,WAAA,CACA,mBAAA,CAAA,gBAAA,CAGF,0GACE,UAAA,CACA,WAAA,CACA,4DAAA,CACA,UAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,eAAA,CACA,gBAAA,CAIJ,gFACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,kBAAA,CACA,aAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,gBAAA,CACA,eAAA,CACA,qBAAA,CACA,mCAAA,CAMR,wBACE,KACE,0BAAA,CACA,SAAA,CAEF,GACE,uBAAA,CACA,SAAA,CAAA,CAIJ,uBACE,kBAAA,CAEA,0BACE,iBAAA,CACA,aAAA,CACA,cAAA,CACA,eAAA,CAGF,2CACE,YAAA,CACA,qBAAA,CACA,QAAA,CACA,kBAAA,CAEA,8DACE,YAAA,CACA,kBAAA,CACA,QAAA,CACA,kBAAA,CACA,iBAAA,CACA,gBAAA,CACA,wBAAA,CACA,sCAAA,CAEA,oEACE,kBAAA,CACA,oBAAA,CAGF,mFACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,eAAA,CACA,kBAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,eAAA,CACA,eAAA,CACA,uFACE,UAAA,CACA,WAAA,CACA,mBAAA,CAAA,gBAAA,CAEF,uGACE,UAAA,CACA,WAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,UAAA,CACA,4DAAA,CAGJ,iFACE,YAAA,CACA,qBAAA,CACA,OAAA,CACA,oGACE,eAAA,CACA,aAAA,CACA,eAAA,CAEF,oGACE,eAAA,CACA,aAAA,CAIN,6DACE,aAAA,CACA,eAAA,CACA,iBAAA,CACA,aAAA,CAGJ,6CACE,cAAA,CACA,gBAAA,CACA,kBAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,eAAA,CACA,eAAA,CACA,cAAA,CACA,0BAAA,CACA,mDACE,kBAAA,CAKN,eACE,cAAA,CACA,KAAA,CAAA,MAAA,CAAA,OAAA,CAAA,QAAA,CACA,6BAAA,CACA,YAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,iCAAA,CAAA,yBAAA,CAEF,eACE,eAAA,CACA,kBAAA,CACA,qCAAA,CACA,UAAA,CACA,eAAA,CACA,WAAA,CACA,SAAA,CACA,eAAA,CACA,YAAA,CACA,qBAAA,CACA,eAAA,CAEF,cACE,YAAA,CACA,kBAAA,CACA,6BAAA,CACA,0BAAA,CACA,+BAAA,CACA,iBACE,QAAA,CACA,iBAAA,CACA,eAAA,CACA,aAAA,CAEF,yBACE,eAAA,CACA,WAAA,CACA,gBAAA,CACA,aAAA,CACA,cAAA,CACA,eAAA,CACA,iBAAA,CACA,mBAAA,CACA,+BACE,aAAA,CAEF,+BACE,yBAAA,CACA,kBAAA,CAIN,YACE,2BAAA,CACA,uCACE,UAAA,CACA,iBAAA,CACA,wBAAA,CACA,iBAAA,CACA,aAAA,CACA,kBAAA,CACA,YAAA,CACA,sCAAA,CACA,6CACE,oBAAA,CACA,wCAAA,CAGJ,yCACE,gBAAA,CACA,eAAA,CAEA,sDACE,YAAA,CACA,kBAAA,CACA,6BAAA,CACA,YAAA,CACA,iBAAA,CACA,iBAAA,CACA,wBAAA,CACA,mBAAA,CAEA,4DACE,kBAAA,CACA,oBAAA,CAGF,iEACE,eAAA,CAGF,iEACE,YAAA,CACA,kBAAA,CACA,QAAA,CACA,MAAA,CACA,WAAA,CAEA,8EACE,iBAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,eAAA,CACA,aAAA,CAEA,kFACE,UAAA,CACA,WAAA,CACA,mBAAA,CAAA,gBAAA,CAGF,kGACE,UAAA,CACA,WAAA,CACA,4DAAA,CACA,UAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,eAAA,CACA,cAAA,CAGF,+FACE,iBAAA,CACA,WAAA,CACA,UAAA,CACA,UAAA,CACA,WAAA,CACA,kBAAA,CACA,UAAA,CACA,iBAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,cAAA,CACA,gBAAA,CACA,qBAAA,CAIJ,+EACE,YAAA,CACA,qBAAA,CACA,OAAA,CACA,WAAA,CACA,MAAA,CAEA,0FACE,eAAA,CACA,aAAA,CACA,gBAAA,CACA,kBAAA,CACA,eAAA,CACA,sBAAA,CAGF,2FACE,aAAA,CACA,gBAAA,CACA,kBAAA,CACA,eAAA,CACA,sBAAA,CAGF,0FACE,aAAA,CACA,eAAA,CACA,eAAA,CACA,kBAAA,CACA,eAAA,CACA,sBAAA,CAKN,+DACE,kBAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,gBAAA,CACA,eAAA,CACA,eAAA,CACA,cAAA,CACA,mBAAA,CACA,aAAA,CAEA,oFACE,kBAAA,CACA,0BAAA,CAGF,wEACE,kBAAA,CACA,kBAAA,CACA,cAAA,CAKN,qDACE,iBAAA,CACA,YAAA,CACA,aAAA,CAEA,uDACE,gBAAA,CACA,gBAAA,CAGF,iEACE,gBAAA,CACA,aAAA,CACA,iBAAA,CAOR,QACE,UAAA,CACA,WAAA,CACA,iBAAA,CACA,eAAA,CACA,4DAAA,CACA,UAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,eAAA,CACA,gBAAA,CAEF,aACE,UAAA,CACA,WAAA,CACA,cAAA,CAEF,aACE,UAAA,CACA,WAAA,CACA,eAAA,CAEF,wFACE,iBAAA,CACA,QAAA,CACA,OAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,qBAAA,CACA,kBAAA,CACA,wCAAA,CAGF,eACE,eAAA,CACA,wBAAA,CACA,kBAAA,CACA,uCAAA,CACA,2BAAA,CACA,kBAAA,CACA,sCAAA,CACA,qBACE,uCAAA,CACA,oBAAA,CAKJ,iBACE,kBAAA,CACA,UAAA,CACA,uCAAA,CACA,eAAA,CAGF,gCACE,OAAA,CACA,iBAAA,CAGF,2CACE,aAAA,CACA,eAAA","sourcesContent":[".screenplay-viewer-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.85);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n  backdrop-filter: blur(8px);\n}\n\n.screenplay-viewer {\n  background: #ffffff;\n  border-radius: 16px;\n  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);\n  width: 95vw;\n  height: 90vh;\n  max-width: 1600px;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  position: relative;\n  padding-top: 0;\n  padding-bottom: 0;\n  padding-left: 0;\n  padding-right: 0;\n  box-sizing: border-box;\n  \n  &.single {\n    .viewer-content {\n      grid-template-columns: 1fr;\n    }\n  }\n  \n  &.split {\n    .viewer-content {\n      grid-template-columns: 2fr 1fr;\n    }\n  }\n  \n  &.fullscreen {\n    width: 98vw;\n    height: 95vh;\n    max-width: none;\n  }\n\n  h1, h2, h3, h4, h5, h6 {\n    &:not(.document-title) {\n      display: none !important;\n      padding: 0 !important;\n      margin: 0 !important;\n    }\n  }\n\n  // Hide any title attributes or elements from PDF viewers\n  [title], [aria-label*=\"title\"], [aria-label*=\"Title\"] {\n    &::before, &::after {\n      display: none !important;\n      padding: 0 !important;\n      margin: 0 !important;\n      content: none !important;\n    }\n  }\n  \n  // Hide any PDF viewer title elements\n  .react-pdf__Document,\n  .react-pdf__Page,\n  .react-pdf__Page__canvas,\n  .react-pdf__Page__textContent {\n    h1, h2, h3, h4, h5, h6 {\n      display: none !important;\n      padding: 0 !important;\n      margin: 0 !important;\n    }\n    \n    // Hide any title-like elements\n    [class*=\"title\"], [class*=\"Title\"],\n    [id*=\"title\"], [id*=\"Title\"] {\n      display: none !important;\n      padding: 0 !important;\n      margin: 0 !important;\n    }\n  }\n  \n  // Hide any iframe or object titles\n  iframe, object, embed {\n    &[title], &[aria-label] {\n      &::before, &::after {\n        display: none !important;\n        padding: 0 !important;\n        margin: 0 !important;\n        content: none !important;\n      }\n    }\n  }\n  \n  // Hide any browser default PDF viewer titles\n  .react-pdf__Document {\n    &::before, &::after {\n      content: none !important;\n      padding: 0 !important;\n      margin: 0 !important;\n    }\n  }\n}\n\n.viewer-header {\n  display: flex !important;\n  align-items: center;\n  justify-content: space-between;\n  padding: 10px 24px 6px 24px;\n  background: transparent;\n  border-bottom: 1px solid #f1f5f9;\n  position: sticky;\n  top: 0;\n  z-index: 10;\n}\n\n.btn-close {\n  background: none;\n  border: none;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #64748b;\n  transition: background 0.15s, color 0.15s;\n  cursor: pointer;\n  box-shadow: none;\n  outline: none;\n  font-size: 2rem;\n  margin-left: 12px;\n\n  &:hover, &:focus {\n    background: #f1f5f9;\n    color: #1e293b;\n  }\n}\n\n.viewer-header-minimal {\n  display: none !important;\n}\n\n.viewer-content {\n  display: flex;\n  height: calc(100vh - 40px);\n  .pdf-panel {\n    flex: 1 1 0%;\n    min-width: 0;\n    overflow: hidden;\n    position: relative;\n    z-index: 1;\n    background: none;\n  }\n  .collaboration-panel {\n    position: relative;\n    width: 340px;\n    min-width: 220px;\n    max-width: 400px;\n    z-index: 2;\n    background: #f8fafc;\n    border-left: 1px solid #e2e8f0;\n    display: flex;\n    flex-direction: column;\n    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);\n    box-shadow: none;\n    transform: translateX(0);\n    &.collapsed {\n      transform: translateX(100%);\n      box-shadow: none;\n    }\n  }\n}\n\n.pdf-panel {\n  display: flex;\n  flex-direction: column;\n  background: #f8fafc;\n  position: relative;\n  \n  .pdf-controls {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 16px 24px;\n    background: white;\n    border-bottom: 1px solid #e2e8f0;\n    \n    .navigation-controls {\n      display: flex;\n      align-items: center;\n      gap: 12px;\n      \n      .nav-btn {\n        background: #3b82f6;\n        border: none;\n        color: white;\n        padding: 8px 16px;\n        border-radius: 6px;\n        cursor: pointer;\n        font-weight: 500;\n        transition: all 0.2s ease;\n        \n        &:hover:not(:disabled) {\n          background: #2563eb;\n        }\n        \n        &:disabled {\n          background: #cbd5e1;\n          cursor: not-allowed;\n        }\n      }\n      \n      .page-display {\n        font-weight: 600;\n        color: #374151;\n        min-width: 80px;\n        text-align: center;\n      }\n    }\n    \n    .zoom-controls {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      \n      button {\n        background: #f1f5f9;\n        border: 1px solid #e2e8f0;\n        color: #64748b;\n        width: 32px;\n        height: 32px;\n        border-radius: 6px;\n        cursor: pointer;\n        transition: all 0.2s ease;\n        \n        &:hover {\n          background: #e2e8f0;\n          color: #374151;\n        }\n      }\n      \n      .zoom-level {\n        font-weight: 500;\n        color: #374151;\n        min-width: 50px;\n        text-align: center;\n      }\n    }\n  }\n  \n  .pdf-container {\n    position: relative;\n    width: 100%;\n    height: 100%;\n    overflow: auto;\n    background: #f8fafc;\n  }\n}\n\n.pdf-scrollable-container {\n  width: 100%;\n  height: 100%;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 20px;\n  background: #f8fafc;\n  position: relative;\n  \n  // Prevent scroll events from bubbling to parent\n  &:hover {\n    overflow-y: auto;\n  }\n  \n  // Ensure scroll events are captured\n  &::-webkit-scrollbar {\n    width: 8px;\n  }\n  \n  &::-webkit-scrollbar-track {\n    background: #f1f1f1;\n    border-radius: 4px;\n  }\n  \n  &::-webkit-scrollbar-thumb {\n    background: #c1c1c1;\n    border-radius: 4px;\n    \n    &:hover {\n      background: #a8a8a8;\n    }\n  }\n  \n  .page-container {\n    display: flex;\n    justify-content: center;\n    margin-bottom: 20px;\n    \n    &:last-child {\n      margin-bottom: 0;\n    }\n  }\n}\n\n.page-loading {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 40px;\n  color: #6b7280;\n  font-size: 0.875rem;\n}\n\n.page-error {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 40px;\n  color: #ef4444;\n  font-size: 0.875rem;\n  text-align: center;\n  \n  small {\n    margin-top: 8px;\n    color: #6b7280;\n  }\n}\n\n.collaboration-panel {\n  background: white;\n  border-left: 1px solid #e2e8f0;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  \n  .panel-header {\n    display: none !important;\n  }\n  \n  .panel-content {\n    flex: 1;\n    overflow: auto;\n    padding: 20px 24px;\n    \n    .active-users {\n      margin-bottom: 32px;\n      \n      h4 {\n        margin: 0 0 16px 0;\n        color: #1f2937;\n        font-size: 1rem;\n        font-weight: 600;\n      }\n      \n      .users-list {\n        display: flex;\n        flex-direction: column;\n        gap: 12px;\n        \n        .user-item {\n          display: flex;\n          align-items: center;\n          gap: 12px;\n          padding: 12px;\n          background: #f8fafc;\n          border-radius: 8px;\n          border: 1px solid #e2e8f0;\n          transition: all 0.2s ease;\n          \n          &:hover {\n            background: #f1f5f9;\n            border-color: #cbd5e1;\n          }\n          \n          .user-avatar {\n            width: 32px;\n            height: 32px;\n            border-radius: 50%;\n            overflow: hidden;\n            position: relative;\n            \n            img {\n              width: 100%;\n              height: 100%;\n              object-fit: cover;\n            }\n            \n            .avatar-placeholder {\n              width: 100%;\n              height: 100%;\n              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n              color: white;\n              display: flex;\n              align-items: center;\n              justify-content: center;\n              font-weight: 600;\n              font-size: 0.875rem;\n            }\n            \n            .online-indicator {\n              position: absolute;\n              bottom: 0;\n              right: 0;\n              width: 12px;\n              height: 12px;\n              border-radius: 50%;\n              border: 2px solid white;\n              \n              &.online {\n                background: #10b981;\n                box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);\n              }\n              \n              &.offline {\n                background: #6b7280;\n              }\n            }\n          }\n          \n          .user-info {\n            display: flex;\n            flex-direction: column;\n            gap: 2px;\n            flex: 1;\n            \n            .user-name {\n              font-weight: 500;\n              color: #1f2937;\n              font-size: 0.875rem;\n            }\n            \n            .user-status {\n              font-size: 0.75rem;\n              color: #6b7280;\n              font-weight: 500;\n              \n              .last-seen {\n                color: #9ca3af;\n                font-weight: 400;\n              }\n            }\n            \n            .user-page {\n              font-size: 0.75rem;\n              color: #9ca3af;\n            }\n          }\n        }\n      }\n    }\n    \n    .annotations-section,\n    .tags-section {\n      margin-bottom: 32px;\n      \n      h4 {\n        margin: 0 0 16px 0;\n        color: #1f2937;\n        font-size: 1rem;\n        font-weight: 600;\n      }\n      \n      .annotations-list,\n      .tags-list {\n        display: flex;\n        flex-direction: column;\n        gap: 16px;\n        \n        .annotation-item,\n        .tag-item {\n          background: white;\n          border: 1px solid #e2e8f0;\n          border-radius: 8px;\n          padding: 16px;\n          transition: all 0.2s ease;\n          \n          &:hover {\n            border-color: #cbd5e1;\n            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);\n          }\n          \n          &.resolved {\n            opacity: 0.6;\n            background: #f8fafc;\n            \n            .annotation-content,\n            .tag-content {\n              text-decoration: line-through;\n            }\n          }\n          \n          .annotation-header,\n          .tag-header {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            margin-bottom: 12px;\n            \n            .annotation-author,\n            .tag-author {\n              display: flex;\n              align-items: center;\n              gap: 8px;\n              \n              .avatar-placeholder {\n                width: 24px;\n                height: 24px;\n                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n                color: white;\n                border-radius: 50%;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                font-size: 0.75rem;\n                font-weight: 600;\n              }\n              \n              span {\n                font-weight: 500;\n                color: #1f2937;\n                font-size: 0.875rem;\n              }\n            }\n            \n            .annotation-meta,\n            .tag-meta {\n              display: flex;\n              gap: 8px;\n              font-size: 0.75rem;\n              color: #6b7280;\n            }\n          }\n          \n          .annotation-content {\n            color: #374151;\n            line-height: 1.5;\n            margin-bottom: 12px;\n          }\n          \n          .tag-content {\n            display: flex;\n            align-items: center;\n            gap: 8px;\n            margin-bottom: 12px;\n            \n            .tag-type {\n              padding: 2px 8px;\n              border-radius: 12px;\n              color: white;\n              font-size: 0.75rem;\n              font-weight: 500;\n              text-transform: capitalize;\n            }\n            \n            .tag-text {\n              color: #374151;\n              line-height: 1.5;\n            }\n          }\n          \n          .annotation-actions,\n          .tag-actions {\n            display: flex;\n            gap: 8px;\n            flex-wrap: wrap;\n            \n            .action-btn {\n              background: #f1f5f9;\n              border: 1px solid #e2e8f0;\n              color: #64748b;\n              padding: 4px 8px;\n              border-radius: 4px;\n              cursor: pointer;\n              font-size: 0.75rem;\n              transition: all 0.2s ease;\n              \n              &:hover {\n                background: #e2e8f0;\n                color: #374151;\n              }\n              \n              &.resolved {\n                background: #dcfce7;\n                border-color: #bbf7d0;\n                color: #166534;\n              }\n              \n              &.delete {\n                background: #fef2f2;\n                border-color: #fecaca;\n                color: #dc2626;\n                \n                &:hover {\n                  background: #fee2e2;\n                  color: #b91c1c;\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\n// Visual Overlays\n.annotation-overlay {\n  border: 2px solid rgba(239, 68, 68, 0.7);\n  background: none !important;\n  border-radius: 8px !important;\n  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.08);\n  transition: border 0.18s, box-shadow 0.18s;\n  position: absolute;\n  z-index: 5;\n  pointer-events: auto;\n  overflow: visible;\n}\n\n.annotation-overlay:hover, .annotation-overlay.selected {\n  border: 2.5px solid #ef4444;\n  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.13);\n}\n\n.tag-overlay {\n  border: 2px solid rgba(245, 158, 11, 0.7);\n  background: none !important;\n  border-radius: 8px !important;\n  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.08);\n  transition: border 0.18s, box-shadow 0.18s;\n  position: absolute;\n  z-index: 5;\n  pointer-events: auto;\n  overflow: visible;\n}\n\n.tag-overlay:hover, .tag-overlay.selected {\n  border: 2.5px solid #f59e0b;\n  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.13);\n}\n\n.user-cursor {\n  position: absolute;\n  z-index: 15;\n  \n  .cursor-pointer {\n    display: none !important;\n  }\n  \n  .cursor-label {\n    position: absolute;\n    top: -8px;\n    right: -8px;\n    width: 24px;\n    height: 24px;\n    border-radius: 50%;\n    background: #3b82f6;\n    color: white;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 12px;\n    font-weight: 600;\n    border: 2px solid white;\n    box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n  }\n}\n\n.drawing-instructions {\n  position: absolute;\n  bottom: 20px;\n  left: 50%;\n  transform: translateX(-50%);\n  background: rgba(0, 0, 0, 0.8);\n  color: white;\n  padding: 12px 20px;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  z-index: 20;\n  animation: fadeInUp 0.3s ease;\n}\n\n// Animations\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n@keyframes pulse {\n  0% {\n    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);\n  }\n  70% {\n    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);\n  }\n}\n\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%) translateY(0);\n  }\n}\n\n// Responsive Design\n@media (max-width: 1200px) {\n  .screenplay-viewer {\n    width: 98vw;\n    height: 95vh;\n    \n    &.split {\n      .viewer-content {\n        grid-template-columns: 1fr;\n      }\n      \n      .collaboration-panel {\n        position: absolute;\n        right: 0;\n        top: 80px;\n        bottom: 0;\n        width: 350px;\n        transform: translateX(100%);\n        transition: transform 0.3s ease;\n        \n        &.open {\n          transform: translateX(0);\n        }\n      }\n    }\n  }\n  \n  .viewer-header {\n    .header-center {\n      display: none;\n    }\n    \n    .header-actions {\n      .overlay-controls,\n      .drawing-controls {\n        display: none;\n      }\n    }\n  }\n}\n\n@media (max-width: 768px) {\n  .screenplay-viewer {\n    width: 100vw;\n    height: 100vh;\n    border-radius: 0;\n    \n    .viewer-header-minimal {\n      border-radius: 0;\n      padding: 4px 8px;\n      height: 36px;\n      min-height: 36px;\n      \n      .header-left-minimal {\n        .document-title {\n          font-size: 0.7rem;\n          max-width: 150px;\n          opacity: 0.7;\n        }\n      }\n      \n      .header-controls-minimal {\n        gap: 6px;\n        \n        .zoom-controls-minimal {\n          padding: 2px 4px;\n          \n          button {\n            padding: 1px 2px;\n            font-size: 9px;\n          }\n          \n          span {\n            font-size: 9px;\n            min-width: 28px;\n          }\n        }\n        \n        .overlay-btn,\n        .btn-report-minimal,\n        .btn-close-minimal {\n          padding: 3px 4px;\n          font-size: 10px;\n        }\n        \n        .btn-close-minimal {\n          width: 20px;\n          height: 20px;\n          font-size: 12px;\n        }\n      }\n    }\n  }\n  \n  .viewer-content {\n    height: calc(100vh - 36px);\n  }\n  \n  .collaboration-panel {\n    position: fixed;\n    right: 0;\n    top: 0;\n    height: 100vh;\n    width: 90vw;\n    min-width: 0;\n    max-width: none;\n    z-index: 2000;\n    box-shadow: -2px 0 16px rgba(0,0,0,0.08);\n    background: #fff;\n    border-left: 1px solid #e2e8f0;\n    transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);\n    \n    &.collapsed {\n      transform: translateX(100%);\n      width: 36px !important;\n      min-width: 36px !important;\n      max-width: 36px !important;\n      box-shadow: none;\n    }\n    \n    .sidebar-toggle-btn {\n      left: -24px;\n      top: 16px;\n    }\n  }\n  \n  .pdf-panel.expanded {\n    width: 100vw !important;\n    min-width: 0;\n    max-width: none;\n  }\n}\n\n.annotation-marker,\n.tag-marker {\n  pointer-events: auto;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.10);\n  border-radius: 50%;\n  font-weight: bold;\n  transition: box-shadow 0.18s, background 0.18s;\n  cursor: pointer;\n  user-select: none;\n}\n\n.annotation-marker:hover, .tag-marker:hover {\n  box-shadow: 0 4px 16px rgba(0,0,0,0.18);\n  filter: brightness(1.08);\n}\n\n.annotation-icon,\n.tag-icon {\n  font-size: 14px;\n  line-height: 1;\n}\n\n// Draggable popup styles\n.annotation-input-popup,\n.tag-input-popup {\n  .popup-header {\n    &:hover {\n      background: #f8fafc;\n      border-radius: 8px 8px 0 0;\n    }\n    \n    &:active {\n      cursor: grabbing;\n    }\n  }\n}\n\n// Improved overlay styles\n.annotation-overlay,\n.tag-overlay {\n  &:hover {\n    transform: scale(1.02);\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n    \n    .annotation-marker,\n    .tag-marker {\n      transform: scale(1.1);\n    }\n  }\n  \n  &.selected {\n    border-width: 3px !important;\n    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);\n    animation: pulse 1s ease-in-out;\n  }\n  \n  &.resolved {\n    opacity: 0.6;\n    \n    .annotation-marker,\n    .tag-marker {\n      opacity: 0.7;\n    }\n  }\n}\n\n// Pulse animation for selected elements\n@keyframes pulse {\n  0% {\n    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);\n  }\n  70% {\n    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);\n  }\n}\n\n// Improved popup positioning and styling\n.annotation-input-popup,\n.tag-input-popup {\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(226, 232, 240, 0.8);\n  box-shadow: \n    0 20px 25px -5px rgba(0, 0, 0, 0.1),\n    0 10px 10px -5px rgba(0, 0, 0, 0.04);\n  \n  .popup-header {\n    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);\n    border-bottom: 1px solid #e2e8f0;\n    margin: -1.5rem -1.5rem 1rem -1.5rem;\n    padding: 1.5rem;\n    border-radius: 12px 12px 0 0;\n    \n    h4 {\n      margin: 0;\n      color: #1f2937;\n      font-size: 1.1rem;\n      font-weight: 600;\n    }\n  }\n  \n  textarea,\n  input,\n  select {\n    &:focus {\n      outline: none;\n      border-color: #3b82f6;\n      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n    }\n  }\n  \n  button {\n    &:hover {\n      transform: translateY(-1px);\n      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n    }\n    \n    &:active {\n      transform: translateY(0);\n    }\n  }\n}\n\n// Unified annotation panel styles\n.annotation-panel {\n  position: fixed;\n  background: white;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  box-shadow: 0 10px 25px rgba(0,0,0,0.15);\n  z-index: 2000;\n  max-width: 400px;\n  min-width: 320px;\n  max-height: 80vh;\n  overflow-y: auto;\n  \n  &.sidebar-mode {\n    right: 20px;\n    top: 20px;\n    width: 350px;\n  }\n  \n  &.popup-mode {\n    // Positioned by inline styles\n  }\n  \n  .panel-header {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    padding: 16px;\n    border-bottom: 1px solid #e2e8f0;\n    background: #f8fafc;\n    border-radius: 12px 12px 0 0;\n    \n    .author-avatar {\n      width: 32px;\n      height: 32px;\n      border-radius: 50%;\n      background: #e2e8f0;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 16px;\n      \n      img {\n        width: 100%;\n        height: 100%;\n        border-radius: 50%;\n        object-fit: cover;\n      }\n    }\n    \n    .author-name {\n      font-weight: 600;\n      color: #1f2937;\n      flex: 1;\n    }\n    \n    .timestamp {\n      font-size: 0.875rem;\n      color: #6b7280;\n    }\n    \n    .close-btn {\n      background: none;\n      border: none;\n      font-size: 20px;\n      color: #6b7280;\n      cursor: pointer;\n      padding: 4px;\n      border-radius: 4px;\n      transition: all 0.2s ease;\n      \n      &:hover {\n        background: #e5e7eb;\n        color: #374151;\n      }\n    }\n  }\n  \n  .annotation-content {\n    padding: 16px;\n    \n    .annotation-main-text {\n      font-size: 0.875rem;\n      color: #374151;\n      line-height: 1.5;\n      margin-bottom: 16px;\n      padding: 12px;\n      background: #f9fafb;\n      border-radius: 8px;\n      border-left: 4px solid #3b82f6;\n    }\n    \n    .annotation-replies {\n      h5 {\n        margin: 0 0 12px 0;\n        font-size: 0.875rem;\n        font-weight: 600;\n        color: #374151;\n      }\n      \n      .replies-list {\n        max-height: 200px;\n        overflow-y: auto;\n        margin-bottom: 16px;\n        \n        .reply-item {\n          padding: 8px 12px;\n          background: #f8fafc;\n          border-radius: 8px;\n          margin-bottom: 8px;\n          position: relative;\n          \n          .reply-header {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            margin-bottom: 4px;\n            \n            .reply-author {\n              font-weight: 500;\n              font-size: 0.75rem;\n              color: #3b82f6;\n            }\n            \n            .reply-time {\n              font-size: 0.75rem;\n              color: #6b7280;\n            }\n          }\n          \n          .reply-content {\n            font-size: 0.875rem;\n            color: #374151;\n            line-height: 1.4;\n          }\n          \n          .remove-reply-btn {\n            position: absolute;\n            top: 4px;\n            right: 4px;\n            background: none;\n            border: none;\n            color: #ef4444;\n            cursor: pointer;\n            font-size: 14px;\n            padding: 2px 6px;\n            border-radius: 4px;\n            opacity: 0;\n            transition: opacity 0.2s ease;\n            \n            &:hover {\n              background: #fee2e2;\n            }\n          }\n          \n          &:hover .remove-reply-btn {\n            opacity: 1;\n          }\n        }\n      }\n      \n      .add-reply-section {\n        display: flex;\n        gap: 8px;\n        \n        input {\n          flex: 1;\n          padding: 8px 12px;\n          border: 1px solid #d1d5db;\n          border-radius: 6px;\n          font-size: 0.875rem;\n          \n          &:focus {\n            outline: none;\n            border-color: #3b82f6;\n            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n          }\n        }\n        \n        button {\n          padding: 8px 16px;\n          background: #3b82f6;\n          color: white;\n          border: none;\n          border-radius: 6px;\n          font-size: 0.875rem;\n          font-weight: 500;\n          cursor: pointer;\n          transition: all 0.2s ease;\n          \n          &:hover:not(:disabled) {\n            background: #2563eb;\n          }\n          \n          &:disabled {\n            background: #9ca3af;\n            cursor: not-allowed;\n          }\n        }\n      }\n    }\n  }\n}\n\n// Improved tag overlay styles\n.tag-overlay {\n  position: absolute;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  z-index: 5;\n  \n  &:hover {\n    transform: scale(1.02);\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  }\n  \n  &.selected {\n    border-width: 3px !important;\n    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);\n    animation: pulse 1s ease-in-out;\n  }\n  \n  &.resolved {\n    opacity: 0.6;\n    \n    .tag-marker {\n      background: #10b981 !important;\n    }\n  }\n  \n  .tag-marker {\n    position: absolute;\n    top: -8px;\n    right: -8px;\n    width: 24px;\n    height: 24px;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 12px;\n    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n    transition: all 0.2s ease;\n    z-index: 10;\n  }\n}\n\n// Navigation feedback\n.navigation-loading {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background: rgba(0, 0, 0, 0.8);\n  color: white;\n  padding: 12px 24px;\n  border-radius: 8px;\n  z-index: 3000;\n  font-size: 0.875rem;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  \n  .spinner {\n    width: 16px;\n    height: 16px;\n    border: 2px solid transparent;\n    border-top: 2px solid white;\n    border-radius: 50%;\n    animation: spin 1s linear infinite;\n  }\n}\n\n// Performance optimizations\n.pdf-scrollable-container {\n  will-change: transform;\n  contain: layout style paint;\n}\n\n.annotation-overlay,\n.tag-overlay {\n  will-change: transform;\n  contain: layout style paint;\n}\n\n// Animation keyframes\n@keyframes pulse {\n  0%, 100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(1.05);\n  }\n}\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n// Responsive improvements\n@media (max-width: 768px) {\n  .annotation-panel {\n    &.sidebar-mode {\n      right: 10px;\n      left: 10px;\n      width: auto;\n      max-width: none;\n    }\n    \n    &.popup-mode {\n      left: 10px !important;\n      right: 10px !important;\n      width: auto !important;\n      max-width: none;\n    }\n  }\n  \n  .viewer-header {\n    flex-direction: column;\n    gap: 12px;\n    \n    .header-center {\n      order: 2;\n    }\n    \n    .header-actions {\n      order: 3;\n    }\n  }\n}\n\n// Fast popup styles for better performance\n.fast-selection-popup,\n.fast-annotation-popup,\n.fast-tag-popup {\n  animation: popupFadeIn 0.15s ease-out;\n  will-change: transform, opacity;\n  contain: layout style paint;\n  \n  button {\n    &:focus {\n      outline: 2px solid #3b82f6;\n      outline-offset: 2px;\n    }\n    \n    &:active {\n      transform: translateY(1px);\n    }\n  }\n  \n  input, textarea, select {\n    &:focus {\n      outline: 2px solid #3b82f6;\n      outline-offset: 2px;\n    }\n  }\n}\n\n@keyframes popupFadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(-4px) scale(0.98);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n\n// Improved overlay positioning\n.annotation-overlay,\n.tag-overlay {\n  &:hover {\n    transform: scale(1.01);\n    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  }\n  \n  &.selected {\n    border-width: 3px !important;\n    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);\n    animation: pulse 0.6s ease-in-out;\n  }\n  \n  &.resolved {\n    opacity: 0.5;\n    \n    .annotation-marker,\n    .tag-marker {\n      background: #10b981 !important;\n    }\n  }\n}\n\n// Performance optimizations\n.react-pdf__Page__textContent {\n  user-select: text;\n  -webkit-user-select: text;\n  -moz-user-select: text;\n  -ms-user-select: text;\n}\n\n// Accessibility improvements\n.screenplay-viewer {\n  &:focus-within {\n    outline: none;\n  }\n  \n  button, input, textarea, select {\n    &:focus-visible {\n      outline: 2px solid #3b82f6;\n      outline-offset: 2px;\n    }\n  }\n}\n\n// Mobile optimizations\n@media (max-width: 768px) {\n  .fast-selection-popup,\n  .fast-annotation-popup,\n  .fast-tag-popup {\n    left: 10px !important;\n    right: 10px !important;\n    width: auto !important;\n    max-width: none;\n    min-width: auto;\n  }\n  \n  .annotation-overlay,\n  .tag-overlay {\n    .annotation-marker,\n    .tag-marker {\n      width: 24px !important;\n      height: 24px !important;\n      font-size: 12px !important;\n    }\n  }\n}\n\n.pdf-panel.expanded {\n  width: 100% !important;\n  flex: 1 1 100%;\n  transition: width 0.2s cubic-bezier(0.4,0,0.2,1);\n}\n\n@media (max-width: 900px) {\n  .collaboration-panel {\n    position: fixed;\n    right: 0;\n    top: 0;\n    height: 100vh;\n    width: 90vw;\n    min-width: 0;\n    max-width: none;\n    z-index: 2000;\n    box-shadow: -2px 0 16px rgba(0,0,0,0.08);\n    background: #fff;\n    border-left: 1px solid #e2e8f0;\n    transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);\n    &.collapsed {\n      transform: translateX(100%);\n      width: 36px !important;\n      min-width: 36px !important;\n      max-width: 36px !important;\n      box-shadow: none;\n    }\n    .sidebar-toggle-btn {\n      left: -24px;\n      top: 16px;\n    }\n  }\n  .pdf-panel.expanded {\n    width: 100vw !important;\n    min-width: 0;\n    max-width: none;\n  }\n}\n\n@keyframes bounceBtn {\n  0%, 100% { transform: translateY(0); }\n  20% { transform: translateY(-8px); }\n  40% { transform: translateY(0); }\n  60% { transform: translateY(-4px); }\n  80% { transform: translateY(0); }\n}\n\n// Minimal header styles\n.viewer-header-minimal {\n  height: 32px !important;\n  min-height: 32px !important;\n  padding: 0 8px !important;\n  background: #f8fafc !important;\n  border-bottom: 1px solid #e2e8f0 !important;\n  display: flex;\n  align-items: center;\n  .header-left-minimal .document-title {\n    font-size: 0.8rem !important;\n    font-weight: 500 !important;\n    color: #6b7280 !important;\n    opacity: 0.8 !important;\n    margin: 0 !important;\n    padding: 0 !important;\n  }\n}\n\n// Update PDF container height\n.pdf-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  overflow: auto;\n  background: #f8fafc;\n}\n\n.pdf-scrollable-container {\n  width: 100%;\n  height: 100%;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 20px;\n  background: #f8fafc;\n  position: relative;\n  \n  // Prevent scroll events from bubbling to parent\n  &:hover {\n    overflow-y: auto;\n  }\n  \n  // Ensure scroll events are captured\n  &::-webkit-scrollbar {\n    width: 8px;\n  }\n  \n  &::-webkit-scrollbar-track {\n    background: #f1f1f1;\n    border-radius: 4px;\n  }\n  \n  &::-webkit-scrollbar-thumb {\n    background: #c1c1c1;\n    border-radius: 4px;\n    \n    &:hover {\n      background: #a8a8a8;\n    }\n  }\n  \n  .page-container {\n    display: flex;\n    justify-content: center;\n    margin-bottom: 20px;\n    \n    &:last-child {\n      margin-bottom: 0;\n    }\n  }\n}\n\n.page-loading {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 40px;\n  color: #6b7280;\n  font-size: 0.875rem;\n}\n\n.page-error {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 40px;\n  color: #ef4444;\n  font-size: 0.875rem;\n}\n\n// Hide any duplicate titles from react-pdf or other sources\n.react-pdf__Document {\n  h1, h2, h3, h4, h5, h6 {\n    display: none !important;\n    padding: 0 !important;\n    margin: 0 !important;\n  }\n  \n  .react-pdf__Page__textContent {\n    user-select: text;\n    -webkit-user-select: text;\n    -moz-user-select: text;\n    -ms-user-select: text;\n  }\n}\n\n// Hide any title elements that might be rendered by the PDF library\n.pdf-container {\n  h1, h2, h3, h4, h5, h6 {\n    display: none !important;\n    padding: 0 !important;\n    margin: 0 !important;\n  }\n  \n  .react-pdf__Document {\n    h1, h2, h3, h4, h5, h6 {\n      display: none !important;\n      padding: 0 !important;\n      margin: 0 !important;\n    }\n  }\n}\n\n// Ensure only our minimal header title is visible\n.viewer-header-minimal .document-title {\n  display: block !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n}\n\n// Hide any other title elements\n.screenplay-viewer {\n  h1, h2, h3, h4, h5, h6 {\n    &:not(.document-title) {\n      display: none !important;\n      padding: 0 !important;\n      margin: 0 !important;\n    }\n  }\n}\n\n// Additional rules for PDF viewer elements\n.react-pdf__Page {\n  &::before, &::after {\n    content: none !important;\n    padding: 0 !important;\n    margin: 0 !important;\n  }\n}\n\n// Hide any title elements in the entire component tree\n.screenplay-viewer * {\n  &[class*=\"title\"], &[class*=\"Title\"],\n  &[id*=\"title\"], &[id*=\"Title\"] {\n    &:not(.document-title) {\n      display: none !important;\n      padding: 0 !important;\n      margin: 0 !important;\n      height: 0 !important;\n      overflow: hidden !important;\n    }\n  }\n}\n\n// Target any remaining title with extreme measures\n.screenplay-viewer {\n  // Remove all padding from the entire viewer\n  padding: 0 !important;\n  \n  // Target any element that might contain a title\n  div, span, p, h1, h2, h3, h4, h5, h6 {\n    &[class*=\"title\"], &[class*=\"Title\"],\n    &[id*=\"title\"], &[id*=\"Title\"] {\n      display: none !important;\n      padding: 0 !important;\n      margin: 0 !important;\n      height: 0 !important;\n      width: 0 !important;\n      overflow: hidden !important;\n      position: absolute !important;\n      left: -9999px !important;\n      top: -9999px !important;\n    }\n  }\n}\n\n// Additional aggressive rules for any remaining titles\n.screenplay-viewer {\n  // Target any remaining title elements with extreme measures\n  * {\n    &[class*=\"pdf\"], &[class*=\"PDF\"],\n    &[class*=\"viewer\"], &[class*=\"Viewer\"],\n    &[class*=\"document\"], &[class*=\"Document\"] {\n      h1, h2, h3, h4, h5, h6,\n      [class*=\"title\"], [class*=\"Title\"],\n      [id*=\"title\"], [id*=\"Title\"] {\n        display: none !important;\n        padding: 0 !important;\n        margin: 0 !important;\n        height: 0 !important;\n        width: 0 !important;\n        overflow: hidden !important;\n        position: absolute !important;\n        left: -9999px !important;\n        top: -9999px !important;\n        font-size: 0 !important;\n        line-height: 0 !important;\n      }\n    }\n  }\n}\n\n.pdf-container, .pdf-scrollable-container, .react-pdf__Page {\n  padding-top: 0 !important;\n  margin-top: 0 !important;\n}\n\n// Annotation search bar smaller and subtle\n.panel-controls .search-input {\n  font-size: 0.85rem;\n  padding: 4px 8px;\n  min-width: 80px;\n  max-width: 120px;\n  border-radius: 4px;\n  border: 1px solid #e2e8f0;\n  background: #f3f4f6;\n  color: #6b7280;\n  margin-left: 4px;\n}\n\n// Remove extra margin from panel-controls\n.panel-controls {\n  margin-bottom: 0;\n  gap: 6px;\n}\n\n// Remove any extra margin from .panel-header\n.panel-header {\n  margin-bottom: 0;\n  padding-bottom: 8px;\n}\n\n.screenplay-viewer, .viewer-content, .pdf-panel, .pdf-container, .pdf-scrollable-container, .react-pdf__Page {\n  padding: 0 !important;\n  margin: 0 !important;\n  box-shadow: none !important;\n  background: none !important;\n}\n\n// Sidebar toggle chevron button\n.sidebar-toggle-btn, .sidebar-toggle-btn-collapsed { display: none !important; }\n.collaboration-panel { padding: 0 !important; margin: 0 !important; box-shadow: none !important; background: #f8fafc; border-left: 1px solid #e2e8f0; }\n.collaboration-panel.collapsed { transform: none !important; box-shadow: none !important; }\n\n// Hide any element that could be a PDF title (unless part of PDF content)\n.screenplay-viewer h1, .screenplay-viewer h2, .screenplay-viewer h3, .screenplay-viewer h4, .screenplay-viewer h5, .screenplay-viewer h6 {\n  &:not(.document-title) {\n    display: none !important;\n    padding: 0 !important;\n    margin: 0 !important;\n    height: 0 !important;\n    overflow: hidden !important;\n  }\n}\n\n// Highlight overlay for Go to\n.annotation-overlay.highlighted, .tag-overlay.highlighted {\n  box-shadow: 0 0 0 4px #3b82f6, 0 2px 8px rgba(59,130,246,0.15);\n  border-width: 3px !important;\n  z-index: 10;\n  animation: pulse 1s;\n}\n\n// Single popup for annotation/tag creation\n.annotation-tag-popup {\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 3000;\n  background: white;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  box-shadow: 0 4px 24px rgba(0,0,0,0.15);\n  padding: 18px 24px;\n  min-width: 260px;\n  max-width: 340px;\n  font-size: 15px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  cursor: default;\n}\n\n// Remove sort/filter/eye/three-bars icon styles\n.panel-controls select, .overlay-btn, .three-bars-icon { display: none !important; }\n\n.pdf-floating-zoom-controls {\n  position: absolute;\n  right: 16px;\n  bottom: 16px;\n  z-index: 2001;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background: rgba(245, 245, 245, 0.85);\n  border-radius: 24px;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.08);\n  padding: 8px 16px;\n  transition: opacity 0.2s;\n  opacity: 0.95;\n  &:hover { opacity: 1; }\n  button {\n    background: #f3f4f6;\n    border: 1px solid #e2e8f0;\n    border-radius: 50%;\n    width: 32px;\n    height: 32px;\n    font-size: 18px;\n    color: #374151;\n    cursor: pointer;\n    transition: background 0.2s, color 0.2s;\n    &:hover { background: #3b82f6; color: white; }\n  }\n  span {\n    font-size: 15px;\n    color: #374151;\n    min-width: 40px;\n    text-align: center;\n  }\n}\n\n.sidebar-toggle-btn-collapsed {\n  position: fixed !important;\n  right: 0;\n  top: 40%;\n  z-index: 3000;\n  width: 36px;\n  height: 48px;\n  background: #f3f4f6;\n  border: 1px solid #e2e8f0;\n  border-radius: 0 8px 8px 0;\n  color: #3b82f6;\n  font-size: 28px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.08);\n  opacity: 0.85;\n  &:hover { background: #3b82f6; color: white; opacity: 1; }\n}\n\n// Annotation/tag popup should never go offscreen and should be draggable\n.selection-popup {\n  max-width: 340px;\n  min-width: 180px;\n  max-height: 80vh;\n  overflow-y: auto;\n  cursor: grab;\n  user-select: none;\n  box-shadow: 0 4px 24px rgba(0,0,0,0.15);\n  border-radius: 10px;\n  border: 1px solid #e2e8f0;\n  background: white;\n  z-index: 3000;\n  position: fixed;\n  padding: 18px 24px;\n  font-size: 15px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  transition: box-shadow 0.2s;\n}\n.selection-popup:active {\n  cursor: grabbing;\n}\n\n.screenplay-modal .modal-header {\n  position: relative;\n  padding: 0 !important;\n  margin: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  background: none !important;\n  border: none !important;\n  \n  h2 {\n    display: none !important;\n  }\n  \n  .close-btn {\n    position: fixed !important;\n    top: 16px !important;\n    right: 16px !important;\n    z-index: 3000 !important;\n    background: rgba(255, 255, 255, 0.9) !important;\n    border: 1px solid #e2e8f0 !important;\n    border-radius: 50% !important;\n    width: 32px !important;\n    height: 32px !important;\n    display: flex !important;\n    align-items: center !important;\n    justify-content: center !important;\n    font-size: 18px !important;\n    color: #6b7280 !important;\n    cursor: pointer !important;\n    transition: all 0.2s ease !important;\n    \n    &:hover {\n      background: #f3f4f6 !important;\n      color: #374151 !important;\n    }\n  }\n}\n\n.screenplay-modal .modal-header > *:not(h2) {\n  /* Hide any direct child that is just an '×' character */\n  &:not([class]) {\n    /* Only target elements with no class */\n    &:not(:empty) {\n      &:only-child {\n        /* Hide if the only content is '×' */\n        font-size: 18px;\n        color: #f00;\n        display: none !important;\n      }\n    }\n  }\n}\n\n// Modern annotation card\n.annotation-item {\n  background: #fff;\n  border-radius: 10px;\n  box-shadow: 0 1px 4px rgba(30,41,59,0.04);\n  border: 1px solid #e5e7eb;\n  padding: 14px 16px 10px 16px;\n  margin-bottom: 18px;\n  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;\n  transition: box-shadow 0.18s;\n  position: relative;\n  &:hover {\n    box-shadow: 0 2px 8px rgba(30,41,59,0.08);\n    border-color: #cbd5e1;\n  }\n}\n\n.annotation-header {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 2px;\n}\n\n.annotation-author {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-weight: 600;\n  color: #1e293b;\n  font-size: 1.08em;\n}\n\n.annotation-author img, .annotation-author .avatar-placeholder {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  object-fit: cover;\n  background: #e0e7ef;\n  font-size: 1.1em;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.annotation-meta {\n  margin-left: auto;\n  color: #94a3b8;\n  font-size: 0.98em;\n  font-weight: 400;\n}\n\n.annotation-content {\n  color: #374151;\n  font-size: 1.04em;\n  line-height: 1.5;\n  margin-bottom: 4px;\n  padding-left: 1px;\n}\n\n// Modern replies section\n.replies-section.compact {\n  margin: 2px 0 0 0;\n  padding-left: 0;\n  border-left: none;\n  background: #f8fafc;\n  border-radius: 7px;\n  box-shadow: none;\n  display: flex;\n  flex-direction: column;\n  gap: 0;\n  border: 1px solid #e5e7eb;\n}\n\n.reply-item.compact {\n  display: flex;\n  flex-direction: column;\n  background: #fff;\n  border-radius: 5px;\n  box-shadow: none;\n  padding: 7px 12px 5px 16px;\n  margin-bottom: 2px;\n  font-size: 0.96em;\n  border-left: none;\n  transition: background 0.18s;\n}\n\n.reply-item.compact:nth-child(even) {\n  background: #f5f6fa;\n}\n\n.reply-item.compact:nth-child(odd) {\n  background: #eceff3;\n}\n\n.reply-item.compact:hover {\n  background: #f0f4fa;\n}\n\n.reply-header.compact {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-bottom: 1px;\n}\n\n.reply-content.compact {\n  font-size: 0.98em;\n  color: #374151;\n  line-height: 1.4;\n  margin-bottom: 0;\n}\n\n// Add a small gap between last reply and action row\n.replies-section.compact {\n  margin-bottom: 4px;\n}\n\n.annotation-actions {\n  margin-top: 2px;\n  display: flex;\n  gap: 8px;\n}\n\n// Ensure the modal prevents background scrolling\n.screenplay-viewer {\n  overflow: hidden;\n  \n  .viewer-content {\n    overflow: hidden;\n    height: 100%;\n  }\n  \n  .pdf-panel {\n    overflow: hidden;\n    height: 100%;\n  }\n}\n\n// Ensure pdf-scrollable-container can scroll\n.pdf-scrollable-container {\n  overflow-y: auto !important;\n  overflow-x: hidden !important;\n}\n\n.screenplay-modal-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 10px 24px 6px 24px;\n  background: transparent;\n  border-bottom: 1px solid #f1f5f9;\n  position: sticky;\n  top: 0;\n  z-index: 10;\n}\n\n.screenplay-title {\n  font-size: 1.35rem;\n  font-weight: 600;\n  color: #1e293b;\n  letter-spacing: -0.01em;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.screenplay-close-btn {\n  background: none;\n  border: none;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #64748b;\n  transition: background 0.15s, color 0.15s;\n  cursor: pointer;\n  box-shadow: none;\n  outline: none;\n\n  &:hover, &:focus {\n    background: #f1f5f9;\n    color: #1e293b;\n  }\n}\n\n.btn-close-absolute {\n  position: fixed;\n  top: 32px;\n  /* Place it just to the left of the annotation pane, assuming annotation pane is ~400px wide */\n  right: 420px;\n  z-index: 5000;\n  background: rgba(30,41,59,0.32);\n  border: none;\n  border-radius: 50%;\n  width: 28px;\n  height: 28px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: rgba(255,255,255,0.7);\n  font-size: 1.3rem;\n  font-weight: 300;\n  cursor: pointer;\n  box-shadow: none;\n  outline: none;\n  transition: background 0.15s, color 0.15s;\n  padding: 0;\n  line-height: 1;\n\n  &:hover, &:focus {\n    background: rgba(30,41,59,0.6);\n    color: #fff;\n  }\n}\n\n@media (max-width: 900px) {\n  .btn-close-absolute {\n    right: 16px;\n    top: 8px;\n  }\n}\n\n.reply-btn.compact {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 2px 8px;\n  background: none;\n  color: #2563eb;\n  border: none;\n  border-radius: 6px;\n  font-size: 0.98em;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.15s, color 0.15s;\n  outline: none;\n  box-shadow: none;\n  margin-top: 8px;\n  margin-bottom: 2px;\n  margin-left: 0;\n  &:hover, &:focus {\n    background: #eff6ff;\n    color: #1d4ed8;\n  }\n}\n\n// Action row resolve/reopen button\n.annotation-actions .action-btn {\n  background: #f8fafc;\n  color: #2563eb;\n  border: 1.5px solid #cbd5e1;\n  border-radius: 999px;\n  font-size: 0.98em;\n  padding: 4px 14px;\n  margin-left: 4px;\n  font-weight: 500;\n  transition: background 0.15s, color 0.15s, border 0.15s;\n  cursor: pointer;\n  outline: none;\n  &:hover, &:focus {\n    background: #eff6ff;\n    border-color: #2563eb;\n    color: #1d4ed8;\n  }\n}\n\n// Grey out resolved annotation card\n.annotation-item.resolved {\n  background: #f8fafc;\n  border-color: #e5e7eb;\n  color: #94a3b8;\n  opacity: 0.85;\n}\n\n.replies-section.compact .reply-item.compact:first-child {\n  border-left: none;\n}\n\n.replies-section.compact {\n  border-left: 2.5px solid #e0e0e0;\n  border-top: none;\n  border-right: none;\n  border-bottom: none;\n  border-radius: 7px;\n}\n\n.no-users {\n  text-align: center;\n  padding: 20px;\n  color: #6b7280;\n  font-size: 0.875rem;\n  font-style: italic;\n}\n\n.floating-collaboration-indicator {\n  position: fixed;\n  top: 20px;\n  right: 20px;\n  background: rgba(255, 255, 255, 0.95);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: 12px;\n  padding: 12px 16px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\n  z-index: 1000;\n  animation: slideInRight 0.3s ease-out;\n  \n  .indicator-content {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    \n    .active-users-count {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      \n      .count {\n        font-size: 1.25rem;\n        font-weight: 700;\n        color: #1f2937;\n        line-height: 1;\n      }\n      \n      .label {\n        font-size: 0.75rem;\n        color: #6b7280;\n        font-weight: 500;\n        text-transform: uppercase;\n        letter-spacing: 0.5px;\n      }\n    }\n    \n    .users-avatars {\n      display: flex;\n      align-items: center;\n      gap: 4px;\n      \n      .mini-avatar {\n        width: 28px;\n        height: 28px;\n        border-radius: 50%;\n        overflow: hidden;\n        border: 2px solid white;\n        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n        \n        img {\n          width: 100%;\n          height: 100%;\n          object-fit: cover;\n        }\n        \n        .mini-avatar-placeholder {\n          width: 100%;\n          height: 100%;\n          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n          color: white;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          font-weight: 600;\n          font-size: 0.75rem;\n        }\n      }\n      \n      .more-users {\n        width: 28px;\n        height: 28px;\n        border-radius: 50%;\n        background: #f3f4f6;\n        color: #6b7280;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        font-size: 0.75rem;\n        font-weight: 600;\n        border: 2px solid white;\n        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n      }\n    }\n  }\n}\n\n@keyframes slideInRight {\n  from {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n.collaborators-section {\n  margin-bottom: 32px;\n  \n  h4 {\n    margin: 0 0 12px 0;\n    color: #1f2937;\n    font-size: 1rem;\n    font-weight: 600;\n  }\n  \n  .collaborators-list {\n    display: flex;\n    flex-direction: column;\n    gap: 10px;\n    margin-bottom: 10px;\n    \n    .collaborator-item {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      background: #f8fafc;\n      border-radius: 7px;\n      padding: 8px 12px;\n      border: 1px solid #e2e8f0;\n      transition: background 0.18s, border 0.18s;\n      \n      &:hover {\n        background: #f1f5f9;\n        border-color: #cbd5e1;\n      }\n      \n      .collaborator-avatar {\n        width: 28px;\n        height: 28px;\n        border-radius: 50%;\n        overflow: hidden;\n        background: #e0e7ef;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        font-weight: 600;\n        font-size: 0.9rem;\n        img {\n          width: 100%;\n          height: 100%;\n          object-fit: cover;\n        }\n        .avatar-placeholder {\n          width: 100%;\n          height: 100%;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          color: #fff;\n          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n        }\n      }\n      .collaborator-info {\n        display: flex;\n        flex-direction: column;\n        gap: 2px;\n        .collaborator-name {\n          font-weight: 500;\n          color: #1f2937;\n          font-size: 0.92em;\n        }\n        .collaborator-role {\n          font-size: 0.75em;\n          color: #6b7280;\n        }\n      }\n    }\n    .no-collaborators {\n      color: #9ca3af;\n      font-size: 0.92em;\n      font-style: italic;\n      padding: 8px 0;\n    }\n  }\n  .add-collaborator-btn {\n    margin-top: 4px;\n    padding: 6px 14px;\n    background: #3b82f6;\n    color: #fff;\n    border: none;\n    border-radius: 6px;\n    font-size: 0.95em;\n    font-weight: 500;\n    cursor: pointer;\n    transition: background 0.18s;\n    &:hover {\n      background: #2563eb;\n    }\n  }\n}\n\n.modal-overlay {\n  position: fixed;\n  top: 0; left: 0; right: 0; bottom: 0;\n  background: rgba(31, 41, 55, 0.18);\n  z-index: 2000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  backdrop-filter: blur(2px);\n}\n.modal-content {\n  background: #fff;\n  border-radius: 12px;\n  box-shadow: 0 8px 32px rgba(0,0,0,0.18);\n  width: 100%;\n  max-width: 450px;\n  min-width: 0;\n  padding: 0;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  max-height: 80vh;\n}\n.modal-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 14px 18px 8px 18px;\n  border-bottom: 1px solid #e5e7eb;\n  h3 {\n    margin: 0;\n    font-size: 1.08rem;\n    font-weight: 600;\n    color: #1f2937;\n  }\n  .close-btn {\n    background: none;\n    border: none;\n    font-size: 1.4rem;\n    color: #6b7280;\n    cursor: pointer;\n    padding: 4px 8px;\n    border-radius: 6px;\n    transition: all 0.18s;\n    &:hover {\n      color: #ef4444;\n    }\n    &:focus {\n      outline: 2px solid #3b82f6;\n      outline-offset: 2px;\n    }\n  }\n}\n.modal-body {\n  padding: 16px 18px 18px 18px;\n  .collaborator-search-input {\n    width: 100%;\n    padding: 10px 12px;\n    border: 1px solid #d1d5db;\n    border-radius: 8px;\n    font-size: 1em;\n    margin-bottom: 12px;\n    outline: none;\n    transition: border 0.18s, box-shadow 0.18s;\n    &:focus {\n      border-color: #3b82f6;\n      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n    }\n  }\n  .collaborator-search-results {\n    max-height: 300px;\n    overflow-y: auto;\n    \n    .user-result {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      padding: 12px;\n      border-radius: 8px;\n      margin-bottom: 8px;\n      border: 1px solid #f3f4f6;\n      transition: all 0.18s;\n      \n      &:hover {\n        background: #f8fafc;\n        border-color: #e5e7eb;\n      }\n      \n      &:last-child {\n        margin-bottom: 0;\n      }\n      \n      .user-info {\n        display: flex;\n        align-items: center;\n        gap: 12px;\n        flex: 1;\n        min-width: 0;\n        \n        .user-avatar {\n          position: relative;\n          width: 40px;\n          height: 40px;\n          border-radius: 50%;\n          overflow: hidden;\n          flex-shrink: 0;\n          \n          img {\n            width: 100%;\n            height: 100%;\n            object-fit: cover;\n          }\n          \n          .avatar-placeholder {\n            width: 100%;\n            height: 100%;\n            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n            color: white;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-weight: 600;\n            font-size: 1rem;\n          }\n          \n          .following-badge {\n            position: absolute;\n            bottom: -2px;\n            right: -2px;\n            width: 16px;\n            height: 16px;\n            background: #10b981;\n            color: white;\n            border-radius: 50%;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-size: 10px;\n            font-weight: bold;\n            border: 2px solid white;\n          }\n        }\n        \n        .user-details {\n          display: flex;\n          flex-direction: column;\n          gap: 2px;\n          min-width: 0;\n          flex: 1;\n          \n          .user-name {\n            font-weight: 600;\n            color: #1f2937;\n            font-size: 0.95rem;\n            white-space: nowrap;\n            overflow: hidden;\n            text-overflow: ellipsis;\n          }\n          \n          .user-email {\n            color: #6b7280;\n            font-size: 0.85rem;\n            white-space: nowrap;\n            overflow: hidden;\n            text-overflow: ellipsis;\n          }\n          \n          .user-role {\n            color: #3b82f6;\n            font-size: 0.8rem;\n            font-weight: 500;\n            white-space: nowrap;\n            overflow: hidden;\n            text-overflow: ellipsis;\n          }\n        }\n      }\n      \n      .add-btn {\n        background: #10b981;\n        color: #fff;\n        border: none;\n        border-radius: 6px;\n        padding: 8px 16px;\n        font-size: 0.9rem;\n        font-weight: 500;\n        cursor: pointer;\n        transition: all 0.18s;\n        flex-shrink: 0;\n        \n        &:hover:not(:disabled) {\n          background: #059669;\n          transform: translateY(-1px);\n        }\n        \n        &:disabled {\n          background: #9ca3af;\n          cursor: not-allowed;\n          transform: none;\n        }\n      }\n    }\n    \n    .no-results {\n      text-align: center;\n      padding: 20px;\n      color: #6b7280;\n      \n      p {\n        margin: 0 0 8px 0;\n        font-size: 0.95rem;\n      }\n      \n      .search-tip {\n        font-size: 0.85rem;\n        color: #9ca3af;\n        font-style: italic;\n      }\n    }\n  }\n} \n\n// Avatar styles\n.avatar {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  overflow: hidden;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: #fff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 600;\n  font-size: 1.1rem;\n}\n.avatar-list {\n  width: 32px;\n  height: 32px;\n  font-size: 1rem;\n}\n.avatar-mini {\n  width: 28px;\n  height: 28px;\n  font-size: 0.9rem;\n}\n.avatar .online-indicator, .avatar-list .online-indicator, .avatar-mini .online-indicator {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  border: 2px solid #fff;\n  background: #10b981;\n  box-shadow: 0 0 0 2px rgba(16,185,129,0.2);\n}\n// Card styles\n.card-standard {\n  background: #fff;\n  border: 1px solid #e5e7eb;\n  border-radius: 10px;\n  box-shadow: 0 1px 4px rgba(30,41,59,0.04);\n  padding: 14px 16px 10px 16px;\n  margin-bottom: 12px;\n  transition: box-shadow 0.18s, border 0.18s;\n  &:hover {\n    box-shadow: 0 2px 8px rgba(30,41,59,0.08);\n    border-color: #cbd5e1;\n  }\n}\n// Button styles (already present, ensure usage)\n// Nav item active\n.nav-item.active {\n  background: #2563eb;\n  color: #fff;\n  box-shadow: 0 2px 8px rgba(37,99,235,0.10);\n  font-weight: 600;\n}\n// Reduce whitespace in lists\n.collaborators-list, .users-list {\n  gap: 6px;\n  margin-bottom: 6px;\n}\n// Improve text contrast\n.collaborator-name, .user-name, .member-name {\n  color: #1e2937;\n  font-weight: 600;\n}\n// Remove redundant avatar/card/button styles now covered by shared classes\n// ... existing code ..."],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

}]);
//# sourceMappingURL=6290.chunk.js.map