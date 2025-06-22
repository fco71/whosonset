import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
var CollectionsHubPage = function () {
    var navigate = useNavigate();
    return (_jsxs("div", { className: "min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "My Collections" }), _jsxs("div", { className: "grid gap-8 w-full max-w-3xl", children: [_jsxs("div", { className: "bg-gray-800 hover:bg-gray-700 transition p-6 rounded-lg shadow-lg cursor-pointer", onClick: function () { return navigate('/saved-projects'); }, children: [_jsx("h2", { className: "text-2xl font-semibold mb-2", children: "\uD83D\uDCC1 Saved Projects" }), _jsx("p", { className: "text-gray-400", children: "View and manage the film projects you\u2019ve bookmarked." })] }), _jsxs("div", { className: "bg-gray-800 hover:bg-gray-700 transition p-6 rounded-lg shadow-lg cursor-pointer", onClick: function () { return navigate('/saved-crew'); }, children: [_jsx("h2", { className: "text-2xl font-semibold mb-2", children: "\uD83D\uDC65 Saved Crew" }), _jsx("p", { className: "text-gray-400", children: "Browse crew members you've added to your collection." })] })] })] }));
};
export default CollectionsHubPage;
