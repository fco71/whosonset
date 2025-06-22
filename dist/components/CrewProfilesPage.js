import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var CrewProfileCard = function (_a) {
    var profile = _a.profile;
    return (_jsxs("div", { className: "bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center text-white", children: [profile.avatarUrl && (_jsx("img", { src: profile.avatarUrl, alt: profile.name, className: "w-24 h-24 rounded-full object-cover mb-4" })), _jsx("h2", { className: "text-xl font-semibold", children: profile.name }), _jsx("p", { className: "text-gray-400", children: profile.role }), _jsx("p", { className: "mt-2 text-sm text-center", children: profile.bio }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: profile.location }), _jsxs("div", { className: "mt-4 flex gap-2", children: [profile.resumeUrl && (_jsx("a", { href: profile.resumeUrl, download: true, className: "px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm", children: "Download Resume" })), _jsx("button", { className: "px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm", children: "Add to Collection" })] })] }));
};
export default CrewProfileCard;
