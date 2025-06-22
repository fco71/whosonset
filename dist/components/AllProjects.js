var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
var PROJECTS_PER_PAGE = 48;
var getStatusBadgeColor = function (rawStatus) {
    var status = rawStatus.toLowerCase();
    if (status.includes('development'))
        return 'bg-indigo-600 text-white';
    if (status.includes('pre'))
        return 'bg-yellow-500 text-black';
    if (status.includes('filming') || status.includes('production'))
        return 'bg-green-500 text-white';
    if (status.includes('post'))
        return 'bg-orange-500 text-white';
    if (status.includes('completed'))
        return 'bg-blue-500 text-white';
    if (status.includes('cancel'))
        return 'bg-red-500 text-white';
    return 'bg-gray-600 text-white';
};
var formatStatus = function (status) {
    return status
        .toLowerCase()
        .split(/[-_\s]+/)
        .map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1); })
        .join(' ');
};
var containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};
var cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};
var AllProjects = function () {
    var _a = useState([]), projects = _a[0], setProjects = _a[1];
    var _b = useState(null), lastVisible = _b[0], setLastVisible = _b[1];
    var _c = useState(null), firstVisible = _c[0], setFirstVisible = _c[1];
    var _d = useState([]), prevPages = _d[0], setPrevPages = _d[1];
    var _e = useState(true), loading = _e[0], setLoading = _e[1];
    var _f = useState(''), searchQuery = _f[0], setSearchQuery = _f[1];
    var _g = useState(searchQuery), debouncedQuery = _g[0], setDebouncedQuery = _g[1];
    var _h = useState(''), statusFilter = _h[0], setStatusFilter = _h[1];
    var _j = useState('newest'), sortBy = _j[0], setSortBy = _j[1];
    var _k = useState(null), authUser = _k[0], setAuthUser = _k[1];
    var _l = useState(1), pageNumber = _l[0], setPageNumber = _l[1];
    var isInitialLoad = useRef(true);
    useEffect(function () {
        var unsubscribe = onAuthStateChanged(auth, function (user) { return setAuthUser(user); });
        return function () { return unsubscribe(); };
    }, []);
    useEffect(function () {
        var handler = setTimeout(function () { return setDebouncedQuery(searchQuery); }, 300);
        return function () { return clearTimeout(handler); };
    }, [searchQuery]);
    useEffect(function () {
        fetchProjects('reset');
    }, []);
    var fetchProjects = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (direction) {
            var q, prev, snapshot, docs_1, data, error_1;
            if (direction === void 0) { direction = 'reset'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        q = void 0;
                        if (direction === 'next' && lastVisible) {
                            q = query(collection(db, 'Projects'), orderBy('projectName'), startAfter(lastVisible), limit(PROJECTS_PER_PAGE));
                            setPageNumber(function (prev) { return prev + 1; });
                        }
                        else if (direction === 'prev' && prevPages.length > 0) {
                            prev = prevPages[prevPages.length - 2];
                            q = query(collection(db, 'Projects'), orderBy('projectName'), startAfter(prev), limit(PROJECTS_PER_PAGE));
                            setPrevPages(function (prev) { return prev.slice(0, -1); });
                            setPageNumber(function (prev) { return Math.max(prev - 1, 1); });
                        }
                        else {
                            q = query(collection(db, 'Projects'), orderBy('projectName'), limit(PROJECTS_PER_PAGE));
                            setPrevPages([]);
                            setPageNumber(1);
                        }
                        return [4 /*yield*/, getDocs(q)];
                    case 2:
                        snapshot = _a.sent();
                        docs_1 = snapshot.docs;
                        data = docs_1.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                        setProjects(data);
                        setLastVisible(docs_1[docs_1.length - 1] || null);
                        setFirstVisible(docs_1[0] || null);
                        if (direction === 'next')
                            setPrevPages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [docs_1[0]], false); });
                        if (direction === 'reset')
                            setPrevPages([docs_1[0]]);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error fetching paginated projects:', error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    var resetFilters = function () {
        setSearchQuery('');
        setStatusFilter('');
    };
    var filteredProjects = projects.filter(function (project) {
        var _a;
        var query = debouncedQuery.toLowerCase();
        var matchesSearch = project.projectName.toLowerCase().includes(query) ||
            ((_a = project.productionCompany) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(query)); // Added optional chaining
        var matchesStatus = statusFilter === '' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    var sortedProjects = __spreadArray([], filteredProjects, true).sort(function (a, b) {
        if (sortBy === 'a-z')
            return a.projectName.localeCompare(b.projectName);
        if (sortBy === 'z-a')
            return b.projectName.localeCompare(a.projectName);
        return b.id.localeCompare(a.id);
    });
    var highlightMatch = function (text, query) {
        if (!query)
            return text;
        var regex = new RegExp("(".concat(query, ")"), 'gi');
        var parts = text.split(regex);
        return parts.map(function (part, i) {
            return part.toLowerCase() === query.toLowerCase() ? (_jsx("mark", { className: "bg-yellow-300 text-gray-900 rounded px-1", children: part }, i)) : (part);
        });
    };
    var renderSkeletons = function () {
        return Array.from({ length: 6 }).map(function (_, i) { return (_jsxs("div", { className: "flex flex-col md:flex-row animate-pulse bg-gray-800 rounded-xl overflow-hidden border border-gray-700 min-h-[220px]", children: [_jsx("div", { className: "w-full md:w-[200px] h-[200px] bg-gray-700" }), _jsxs("div", { className: "flex-1 p-5 space-y-4", children: [_jsx("div", { className: "h-6 bg-gray-700 rounded w-3/4" }), _jsx("div", { className: "h-4 bg-gray-700 rounded w-1/2" }), _jsx("div", { className: "h-4 bg-gray-700 rounded w-1/3" }), _jsx("div", { className: "h-3 bg-gray-600 rounded w-full" }), _jsx("div", { className: "h-3 bg-gray-600 rounded w-5/6" })] })] }, i)); });
    };
    return (_jsxs(motion.div, { className: "min-h-screen bg-gray-900 text-white p-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, transition: { duration: 0.1, ease: 'easeOut' }, children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "All Projects" }), authUser && (_jsxs(Link, { to: "/projects/add", className: "bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4v16m8-8H4" }) }), "Add"] }))] }), _jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-4 mb-6", children: [_jsx("input", { type: "text", placeholder: "Search by name or company", className: "w-full md:w-1/2 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); } }), _jsxs("select", { value: statusFilter, onChange: function (e) { return setStatusFilter(e.target.value); }, className: "w-full md:w-1/4 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All Statuses" }), _jsx("option", { value: "In Development", children: "In Development" }), _jsx("option", { value: "Pre-Production", children: "Pre-Production" }), _jsx("option", { value: "Production", children: "Production" }), _jsx("option", { value: "Post-Production", children: "Post-Production" }), _jsx("option", { value: "Completed", children: "Completed" })] }), _jsxs("select", { value: sortBy, onChange: function (e) { return setSortBy(e.target.value); }, className: "w-full md:w-1/4 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "newest", children: "Newest" }), _jsx("option", { value: "a-z", children: "A\u2013Z" }), _jsx("option", { value: "z-a", children: "Z\u2013A" })] }), (searchQuery || statusFilter) && (_jsx("button", { onClick: resetFilters, className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition", children: "Reset" }))] }), loading ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: renderSkeletons() })) : (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "grid grid-cols-1 md:grid-cols-2 gap-6", variants: containerVariants, initial: "hidden", animate: "show", children: sortedProjects.map(function (project) { return (_jsx(motion.div, { variants: cardVariants, transition: { duration: 0.3, ease: 'easeOut' }, children: _jsxs(Link, { to: "/projects/".concat(project.id), className: "flex flex-col md:flex-row bg-gray-800 rounded-xl overflow-hidden border border-blue-500/20 hover:border-blue-500/70 shadow-md hover:shadow-blue-500/30 transition duration-300 transform hover:scale-[1.01] min-h-[220px] cursor-pointer", children: [_jsx("div", { className: "w-full md:w-[200px] h-[200px] bg-black flex items-center justify-center shrink-0", children: _jsx("img", { src: project.coverImageUrl || '/my-icon.png', alt: project.projectName, className: "max-w-full max-h-full object-contain", onError: function (e) {
                                                e.target.src = '/my-icon.png';
                                            } }) }), _jsxs("div", { className: "flex-1 min-w-0 p-5 flex flex-col justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-xl font-bold text-pink-400 truncate", children: highlightMatch(project.projectName, debouncedQuery) }), _jsxs("p", { className: "text-white font-medium truncate", children: [project.productionCompany ? highlightMatch(project.productionCompany, debouncedQuery) : 'N/A', " "] }), project.director && (_jsxs("p", { className: "text-sm text-gray-300 truncate", children: [_jsx("span", { className: "font-semibold", children: "Director:" }), " ", project.director] })), project.producer && (_jsxs("p", { className: "text-sm text-gray-300 truncate", children: [_jsx("span", { className: "font-semibold", children: "Producer:" }), " ", project.producer] })), _jsx("p", { className: "text-sm text-gray-400 mt-1 line-clamp-2", children: project.logline }), project.genres && project.genres.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-1", children: project.genres.map(function (genre, index) { return (_jsx("span", { className: "bg-gray-700 text-xs text-white px-2 py-1 rounded-full", children: genre }, index)); }) }))] }), _jsx("div", { className: "mt-3", children: _jsx("span", { className: "inline-block text-xs font-semibold px-3 py-1 rounded-full ".concat(getStatusBadgeColor(project.status)), children: formatStatus(project.status) }) })] })] }) }, project.id)); }) }), filteredProjects.length === 0 && (_jsx("div", { className: "text-center text-gray-400 mt-8 col-span-full", children: "No projects match your filters." })), _jsxs("div", { className: "flex justify-center items-center gap-6 mt-10", children: [_jsx("button", { disabled: prevPages.length < 2, onClick: function () { return fetchProjects('prev'); }, className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white disabled:opacity-40", children: "Previous" }), _jsxs("span", { className: "text-gray-300 text-sm", children: ["Page ", pageNumber] }), _jsx("button", { disabled: projects.length < PROJECTS_PER_PAGE, onClick: function () { return fetchProjects('next'); }, className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white disabled:opacity-40", children: "Next" })] })] }))] }));
};
export default AllProjects;
