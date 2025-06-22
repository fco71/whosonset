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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/EditCrewProfile.tsx
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
var EditCrewProfile = function () {
    var auth = getAuth();
    var currentUser = auth.currentUser;
    var _a = useState({
        name: '',
        bio: '',
        profileImageUrl: '',
        jobTitles: [''],
        residences: [{ country: '', city: '' }],
    }), form = _a[0], setForm = _a[1];
    var _b = useState([]), jobOptions = _b[0], setJobOptions = _b[1];
    var _c = useState([]), countryOptions = _c[0], setCountryOptions = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(null), message = _e[0], setMessage = _e[1];
    // 1) Fetch lookup data
    useEffect(function () {
        var fetchLookups = function () { return __awaiter(void 0, void 0, void 0, function () {
            var jobSnap, countrySnap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getDocs(collection(db, 'jobTitles'))];
                    case 1:
                        jobSnap = _a.sent();
                        setJobOptions(jobSnap.docs.map(function (doc) { return doc.data().name; }));
                        return [4 /*yield*/, getDocs(collection(db, 'countries'))];
                    case 2:
                        countrySnap = _a.sent();
                        setCountryOptions(countrySnap.docs.map(function (doc) { return ({
                            name: doc.data().name,
                            cities: doc.data().cities,
                        }); }));
                        return [2 /*return*/];
                }
            });
        }); };
        fetchLookups().catch(console.error);
    }, []);
    // 2) Load existing profile
    useEffect(function () {
        if (!currentUser)
            return;
        getDoc(doc(db, 'crewProfiles', currentUser.uid))
            .then(function (snap) {
            if (snap.exists()) {
                var data_1 = snap.data();
                setForm(function (f) {
                    var _a, _b;
                    return (__assign(__assign(__assign({}, f), data_1), { jobTitles: ((_a = data_1.jobTitles) === null || _a === void 0 ? void 0 : _a.length)
                            ? data_1.jobTitles
                            : [''], residences: ((_b = data_1.residences) === null || _b === void 0 ? void 0 : _b.length)
                            ? data_1.residences
                            : [{ country: '', city: '' }] }));
                });
            }
        })
            .catch(console.error);
    }, [currentUser]);
    // Handlers (same as before)…
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setForm(function (f) {
            var _a;
            return (__assign(__assign({}, f), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleProfileImageChange = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var file, storageRef, url;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!currentUser || !((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]))
                        return [2 /*return*/];
                    file = e.target.files[0];
                    storageRef = ref(storage, "profileImages/".concat(currentUser.uid));
                    return [4 /*yield*/, uploadBytes(storageRef, file)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, getDownloadURL(storageRef)];
                case 2:
                    url = _b.sent();
                    setForm(function (f) { return (__assign(__assign({}, f), { profileImageUrl: url })); });
                    return [2 /*return*/];
            }
        });
    }); };
    // Job titles add/remove/update
    var updateJobTitle = function (i, v) {
        setForm(function (f) {
            var jt = __spreadArray([], f.jobTitles, true);
            jt[i] = v;
            return __assign(__assign({}, f), { jobTitles: jt });
        });
    };
    var addJobTitle = function () {
        return setForm(function (f) { return (__assign(__assign({}, f), { jobTitles: __spreadArray(__spreadArray([], f.jobTitles, true), [''], false) })); });
    };
    var removeJobTitle = function (i) {
        return setForm(function (f) { return (__assign(__assign({}, f), { jobTitles: f.jobTitles.filter(function (_, idx) { return idx !== i; }) })); });
    };
    // Residences add/remove/update
    var updateResidence = function (i, key, value) {
        setForm(function (f) {
            var _a;
            var rs = __spreadArray([], f.residences, true);
            rs[i] = __assign(__assign({}, rs[i]), (_a = {}, _a[key] = value, _a));
            return __assign(__assign({}, f), { residences: rs });
        });
    };
    var addResidence = function () {
        return setForm(function (f) { return (__assign(__assign({}, f), { residences: __spreadArray(__spreadArray([], f.residences, true), [{ country: '', city: '' }], false) })); });
    };
    var removeResidence = function (i) {
        return setForm(function (f) { return (__assign(__assign({}, f), { residences: f.residences.filter(function (_, idx) { return idx !== i; }) })); });
    };
    // Save
    var handleSave = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    if (!currentUser)
                        return [2 /*return*/];
                    setLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, setDoc(doc(db, 'crewProfiles', currentUser.uid), __assign(__assign({}, form), { uid: currentUser.uid }))];
                case 2:
                    _b.sent();
                    setMessage('Profile saved!');
                    return [3 /*break*/, 5];
                case 3:
                    _a = _b.sent();
                    setMessage('Failed to save.');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx("div", { className: "min-h-screen bg-gray-900 text-white p-8", children: _jsxs("div", { className: "max-w-2xl mx-auto bg-gray-800 p-6 rounded space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Edit Crew Profile" }), _jsx("input", { name: "name", value: form.name, onChange: handleChange, placeholder: "Full Name", className: "w-full p-2 bg-gray-700 rounded" }), _jsx("textarea", { name: "bio", value: form.bio, onChange: handleChange, placeholder: "Short Bio", rows: 3, className: "w-full p-2 bg-gray-700 rounded" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-2", children: "Job Titles" }), form.jobTitles.map(function (jt, i) { return (_jsxs("div", { className: "flex gap-2 mb-2", children: [_jsxs("select", { value: jt, onChange: function (e) { return updateJobTitle(i, e.target.value); }, className: "flex-1 p-2 bg-gray-700 rounded", children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), jobOptions.map(function (opt) { return (_jsx("option", { value: opt, children: opt }, opt)); })] }), form.jobTitles.length > 1 && (_jsx("button", { onClick: function () { return removeJobTitle(i); }, className: "text-red-400", children: "\u274C" }))] }, i)); }), _jsx("button", { onClick: addJobTitle, className: "text-blue-400 underline text-sm", children: "+ Add Title" })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-2", children: "Residences" }), form.residences.map(function (res, i) {
                            var _a;
                            return (_jsxs("div", { className: "flex gap-2 mb-2", children: [_jsxs("select", { value: res.country, onChange: function (e) { return updateResidence(i, 'country', e.target.value); }, className: "p-2 bg-gray-700 rounded", children: [_jsx("option", { value: "", children: "\u2014 Country \u2014" }), countryOptions.map(function (c) { return (_jsx("option", { value: c.name, children: c.name }, c.name)); })] }), _jsxs("select", { value: res.city, onChange: function (e) { return updateResidence(i, 'city', e.target.value); }, disabled: !res.country, className: "p-2 bg-gray-700 rounded flex-1", children: [_jsx("option", { value: "", children: "\u2014 City (opt.) \u2014" }), (_a = countryOptions
                                                .find(function (c) { return c.name === res.country; })) === null || _a === void 0 ? void 0 : _a.cities.map(function (city) { return (_jsx("option", { value: city, children: city }, city)); })] }), form.residences.length > 1 && (_jsx("button", { onClick: function () { return removeResidence(i); }, className: "text-red-400", children: "\u274C" }))] }, i));
                        }), _jsx("button", { onClick: addResidence, className: "text-blue-400 underline text-sm", children: "+ Add Residence" })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1", children: "Profile Picture" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleProfileImageChange }), form.profileImageUrl && (_jsxs("div", { className: "mt-2 flex items-center gap-4", children: [_jsx("img", { src: form.profileImageUrl, className: "h-20 w-20 rounded-full object-cover" }), _jsx("button", { onClick: function () {
                                        return setForm(function (f) { return (__assign(__assign({}, f), { profileImageUrl: '' })); });
                                    }, className: "text-red-400 underline text-sm", type: "button", children: "Remove" })] }))] }), _jsx("button", { onClick: handleSave, disabled: loading, className: "w-full bg-green-600 py-2 rounded hover:bg-green-500 disabled:opacity-50", children: loading ? 'Saving…' : 'Save Profile' }), message && (_jsx("p", { className: "text-center text-yellow-400", children: message }))] }) }));
};
export default EditCrewProfile;
