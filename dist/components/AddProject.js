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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import ProjectForm from './ProjectForm';
var AddProject = function () {
    var _a = useState(''), projectName = _a[0], setProjectName = _a[1];
    var _b = useState(''), country = _b[0], setCountry = _b[1];
    var _c = useState(''), productionCompany = _c[0], setProductionCompany = _c[1];
    var _d = useState('Pre-Production'), status = _d[0], setStatus = _d[1];
    var _e = useState(''), logline = _e[0], setLogline = _e[1];
    var _f = useState(''), synopsis = _f[0], setSynopsis = _f[1];
    var _g = useState(''), startDate = _g[0], setStartDate = _g[1];
    var _h = useState(''), endDate = _h[0], setEndDate = _h[1];
    var _j = useState(''), location = _j[0], setLocation = _j[1];
    var _k = useState(''), genre = _k[0], setGenre = _k[1];
    var _l = useState(''), director = _l[0], setDirector = _l[1];
    var _m = useState(''), producer = _m[0], setProducer = _m[1];
    var _o = useState(''), coverImageUrl = _o[0], setCoverImageUrl = _o[1];
    // Removed posterImageUrl state
    var _p = useState(''), projectWebsite = _p[0], setProjectWebsite = _p[1];
    var _q = useState(''), productionBudget = _q[0], setProductionBudget = _q[1];
    var _r = useState(''), productionCompanyContact = _r[0], setProductionCompanyContact = _r[1];
    var _s = useState(false), isVerified = _s[0], setIsVerified = _s[1];
    var navigate = useNavigate();
    var _t = useAuthState(auth), user = _t[0], loading = _t[1], error = _t[2];
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var projectsCollectionRef, safeCoverUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!user) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    projectsCollectionRef = collection(db, 'Projects');
                    safeCoverUrl = coverImageUrl.startsWith('http') ? coverImageUrl : '';
                    // Removed safePosterUrl
                    return [4 /*yield*/, addDoc(projectsCollectionRef, {
                            projectName: projectName,
                            country: country,
                            productionCompany: productionCompany,
                            status: status,
                            logline: logline,
                            synopsis: synopsis,
                            startDate: startDate,
                            endDate: endDate,
                            location: location,
                            genre: genre,
                            director: director,
                            producer: producer,
                            coverImageUrl: safeCoverUrl,
                            // Removed posterImageUrl from document data
                            projectWebsite: projectWebsite,
                            productionBudget: productionBudget,
                            productionCompanyContact: productionCompanyContact,
                            isVerified: isVerified,
                            owner_uid: user.uid,
                            createdAt: serverTimestamp(), // ✅ required for pagination
                        })];
                case 2:
                    // Removed safePosterUrl
                    _a.sent();
                    console.log('Project added successfully!');
                    navigate('/');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error adding project:', error_1.message);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    console.log('User not logged in.');
                    navigate('/login');
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleCoverImageUploaded = function (url) {
        setCoverImageUrl(url); // Will always be Firebase URL
    };
    // Removed handlePosterImageUploaded
    var handleCancel = function () {
        navigate('/');
    };
    if (loading)
        return _jsx("p", { children: "Loading..." });
    if (error)
        return _jsxs("p", { children: ["Error: ", error.message] });
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-6 py-10", children: [_jsx("h2", { className: "text-3xl font-bold mb-8 text-center", children: "Add New Project" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8 bg-white p-8 shadow-md rounded-lg", children: [_jsx(ProjectForm, { projectName: projectName, setProjectName: setProjectName, country: country, setCountry: setCountry, productionCompany: productionCompany, setProductionCompany: setProductionCompany, status: status, setStatus: setStatus, logline: logline, setLogline: setLogline, synopsis: synopsis, setSynopsis: setSynopsis, startDate: startDate, setStartDate: setStartDate, endDate: endDate, setEndDate: setEndDate, location: location, setLocation: setLocation, genre: genre, setGenre: setGenre, director: director, setDirector: setDirector, producer: producer, setProducer: setProducer, coverImageUrl: coverImageUrl, setCoverImageUrl: setCoverImageUrl, 
                        // Removed posterImageUrl and setPosterImageUrl props
                        projectWebsite: projectWebsite, setProjectWebsite: setProjectWebsite, productionBudget: productionBudget, setProductionBudget: setProductionBudget, productionCompanyContact: productionCompanyContact, setProductionCompanyContact: setProductionCompanyContact, isVerified: isVerified, setIsVerified: setIsVerified, handleCoverImageUploaded: handleCoverImageUploaded }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-end gap-4 pt-6", children: [_jsx("button", { type: "button", onClick: handleCancel, className: "w-full sm:w-auto px-6 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md transition", children: "Cancel" }), _jsx("button", { type: "submit", className: "w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition", children: "Add Project" })] })] })] }));
};
export default AddProject;
