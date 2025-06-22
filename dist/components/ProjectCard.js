import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var ProjectCard = function (_a) {
    var title = _a.title, status = _a.status, country = _a.country, startDate = _a.startDate, endDate = _a.endDate, coverImageUrl = _a.coverImageUrl;
    return (_jsxs("div", { className: "bg-white rounded-2xl shadow-md overflow-hidden max-w-sm w-full", children: [_jsx("img", { src: coverImageUrl, alt: title, className: "h-48 w-full object-cover" }), _jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-lg font-bold", children: title }), _jsx("span", { className: "inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1", children: status }), _jsxs("p", { className: "text-sm text-gray-600 mt-2", children: [country, " | ", startDate, " \u2013 ", endDate] })] })] }));
};
export default ProjectCard;
