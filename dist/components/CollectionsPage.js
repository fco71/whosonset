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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import CrewProfileCard from '../components/CrewProfileCard';
import { useNavigate } from 'react-router-dom';
var CollectionsPage = function () {
    var _a = useState([]), savedCrew = _a[0], setSavedCrew = _a[1];
    var _b = useState([]), savedProjects = _b[0], setSavedProjects = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var navigate = useNavigate();
    useEffect(function () {
        var fetchCollections = function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, _a, crewSnap, projectSnap, crewData, projectData, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = auth.currentUser;
                        if (!user)
                            return [2 /*return*/];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, Promise.all([
                                getDocs(collection(db, "collections/".concat(user.uid, "/savedCrew"))),
                                getDocs(collection(db, "collections/".concat(user.uid, "/savedProjects"))),
                            ])];
                    case 2:
                        _a = _b.sent(), crewSnap = _a[0], projectSnap = _a[1];
                        crewData = crewSnap.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                        projectData = projectSnap.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                        setSavedCrew(crewData);
                        setSavedProjects(projectData);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _b.sent();
                        console.error('Error fetching collections:', error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchCollections();
    }, []);
    return (_jsxs("div", { className: "min-h-screen bg-gray-900 text-white p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "My Collections" }), loading ? (_jsx("div", { className: "text-center text-gray-400", children: "Loading collections..." })) : (_jsxs(_Fragment, { children: [_jsxs("section", { className: "mb-10", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Saved Crew Profiles" }), savedCrew.length === 0 ? (_jsx("p", { className: "text-gray-400", children: "No saved crew profiles." })) : (_jsx("div", { className: "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", children: savedCrew.slice(0, 6).map(function (profile) { return (_jsx(CrewProfileCard, { profile: profile }, profile.id)); }) })), _jsx("button", { onClick: function () { return navigate('/saved-crew'); }, className: "mt-4 text-blue-400 hover:underline", children: "View all saved crew \u2192" })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Saved Projects" }), savedProjects.length === 0 ? (_jsx("p", { className: "text-gray-400", children: "No saved projects." })) : (_jsx("div", { className: "space-y-6", children: savedProjects.slice(0, 3).map(function (project) { return (_jsxs("div", { className: "flex bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer", onClick: function () { return navigate("/projects/".concat(project.id)); }, children: [project.coverImageUrl && (_jsx("img", { src: project.coverImageUrl, alt: project.projectName, className: "w-1/3 object-cover" })), _jsxs("div", { className: "p-4 flex flex-col justify-between", children: [_jsx("h3", { className: "text-xl font-semibold", children: project.projectName }), _jsx("p", { className: "text-sm text-gray-300 line-clamp-2", children: project.logline }), _jsx("span", { className: "mt-2 inline-block px-2 py-1 text-xs bg-blue-700 rounded", children: project.status })] })] }, project.id)); }) })), _jsx("button", { onClick: function () { return navigate('/saved-projects'); }, className: "mt-4 text-blue-400 hover:underline", children: "View all saved projects \u2192" })] })] }))] }));
};
export default CollectionsPage;
