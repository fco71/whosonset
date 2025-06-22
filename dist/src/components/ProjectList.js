import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ProjectList = ({ projects }) => {
    return (_jsxs("div", { className: "bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-4/5", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-700 mb-4", children: "Movie Projects" }), _jsx("ul", { children: projects.map(project => (_jsxs("li", { className: "border-b border-gray-200 py-2", children: [_jsx("h3", { className: "text-lg font-medium text-gray-600", children: project.project_name }), _jsx("p", { className: "text-gray-500", children: project.logline })] }, project.project_id))) })] }));
};
export default ProjectList;
