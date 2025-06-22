import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var ProjectShowcase = function (_a) {
    var _b;
    var project = _a.project, userId = _a.userId, onEditClick = _a.onEditClick;
    var handleSuggestClick = function () {
        var subject = "Suggestion for project: ".concat(project.projectName);
        var body = encodeURIComponent("I would like to suggest an update to \"".concat(project.projectName, "\".\n\nDetails:\n"));
        window.location.href = "mailto:admin@example.com?subject=".concat(subject, "&body=").concat(body);
    };
    return (_jsxs("div", { className: "px-6 py-10 max-w-6xl mx-auto text-white space-y-10", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center mt-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: project.projectName }), _jsxs("div", { className: "flex gap-2 mt-2 md:mt-0 flex-wrap", children: [_jsx("span", { className: "text-xs px-2 py-1 rounded bg-blue-700 text-white", children: project.status }), (_b = project.genres) === null || _b === void 0 ? void 0 : _b.map(function (genre) { return (_jsx("span", { className: "text-xs px-2 py-1 bg-gray-700 rounded text-white", children: genre }, genre)); })] })] }), _jsx("div", { className: "grid md:grid-cols-3 gap-6 items-start", children: _jsxs("div", { className: "md:col-span-3 grid grid-cols-2 gap-4", children: [" ", _jsx(Field, { label: "Production Company", value: project.productionCompany }), _jsx(Field, { label: "Country", value: project.country }), _jsx(Field, { label: "Start Date", value: project.startDate }), _jsx(Field, { label: "End Date", value: project.endDate }), _jsx(Field, { label: "Location", value: project.location })] }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Logline" }), _jsx("p", { className: "text-gray-300", children: project.logline })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Synopsis" }), _jsx("p", { className: "text-gray-300 whitespace-pre-line", children: project.synopsis })] }), _jsx("div", { children: userId === project.ownerId ? (_jsx("button", { onClick: onEditClick, className: "px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md", children: "Edit Project" })) : (_jsx("button", { onClick: handleSuggestClick, className: "px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md", children: "Suggest Update" })) })] }));
};
var Field = function (_a) {
    var label = _a.label, value = _a.value;
    return (_jsxs("div", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-400", children: label }), _jsx("dd", { className: "text-sm text-white", children: value || '—' })] }));
};
export default ProjectShowcase;
