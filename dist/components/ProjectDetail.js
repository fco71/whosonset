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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
// src/components/ProjectDetail.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth, storage } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, orderBy, startAfter, limit, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Link } from 'react-router-dom';
import ProjectShowcase from '../components/ProjectShowcase';
var LoadingSpinner = function () { return _jsx("div", { className: "text-white text-center mt-10 p-4", children: "Loading..." }); };
var ProjectDetail = function () {
    var projectId = useParams().projectId;
    var _a = useState(null), project = _a[0], setProject = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useState(false), isEditing = _d[0], setIsEditing = _d[1];
    var _e = useState(false), saveSuccess = _e[0], setSaveSuccess = _e[1];
    var _f = useState(null), coverImage = _f[0], setCoverImage = _f[1];
    // Removed posterImage state
    var _g = useState([]), reviews = _g[0], setReviews = _g[1];
    var _h = useState(null), lastVisibleReview = _h[0], setLastVisibleReview = _h[1];
    var _j = useState([]), prevReviewPages = _j[0], setPrevReviewPages = _j[1];
    var _k = useState(false), loadingReviews = _k[0], setLoadingReviews = _k[1];
    var user = auth.currentUser;
    var _l = useState({}), formState = _l[0], setFormState = _l[1];
    useEffect(function () {
        var fetchProject = function () { return __awaiter(void 0, void 0, void 0, function () {
            var projectDocRef, projectDocSnapshot, firestoreData, projectWithDefaults, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        setProject(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, 6, 7]);
                        if (!projectId) return [3 /*break*/, 3];
                        projectDocRef = doc(db, 'Projects', projectId);
                        return [4 /*yield*/, getDoc(projectDocRef)];
                    case 2:
                        projectDocSnapshot = _a.sent();
                        if (projectDocSnapshot.exists()) {
                            firestoreData = projectDocSnapshot.data();
                            projectWithDefaults = {
                                id: projectDocSnapshot.id,
                                projectName: firestoreData.projectName || '',
                                country: firestoreData.country || '',
                                productionCompany: firestoreData.productionCompany || '',
                                status: firestoreData.status || 'Pre-Production',
                                logline: firestoreData.logline || '',
                                synopsis: firestoreData.synopsis || '',
                                startDate: firestoreData.startDate || '',
                                endDate: firestoreData.endDate || '',
                                location: firestoreData.location || '',
                                genre: firestoreData.genre || '',
                                director: firestoreData.director || '',
                                producer: firestoreData.producer || '',
                                coverImageUrl: firestoreData.coverImageUrl || '',
                                // Removed posterImageUrl from default assignment
                                projectWebsite: firestoreData.projectWebsite || '',
                                productionBudget: firestoreData.productionBudget || '',
                                productionCompanyContact: firestoreData.productionCompanyContact || '',
                                isVerified: typeof firestoreData.isVerified === 'boolean' ? firestoreData.isVerified : false,
                                owner_uid: firestoreData.owner_uid || '',
                                genres: firestoreData.genres || (firestoreData.genre ? [firestoreData.genre] : []),
                                ownerId: firestoreData.ownerId || '',
                            };
                            setProject(projectWithDefaults);
                            setFormState(projectWithDefaults);
                        }
                        else {
                            setError('Project not found.');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        setError('Project ID is missing.');
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        err_1 = _a.sent();
                        console.error("Error fetching project:", err_1);
                        setError(err_1.message || 'Failed to fetch project data.');
                        return [3 /*break*/, 7];
                    case 6:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        if (projectId) {
            fetchProject();
        }
        else {
            setError("Project ID is missing from URL.");
            setLoading(false);
        }
    }, [projectId]);
    useEffect(function () {
        if (projectId) {
            fetchReviews('reset');
        }
    }, [projectId]);
    useEffect(function () {
        if (!isEditing) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [reviews, isEditing]);
    var REVIEWS_PER_PAGE = 5;
    var fetchReviews = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (direction) {
            var q, reviewsCollection, newPrevPages, cursorForPrevPage, snapshot, docs_1, fetchedReviews, newLastVisible, err_2;
            if (direction === void 0) { direction = 'reset'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!projectId)
                            return [2 /*return*/];
                        setLoadingReviews(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        q = void 0;
                        reviewsCollection = collection(db, 'Projects', projectId, 'Reviews');
                        if (direction === 'next' && lastVisibleReview) {
                            q = query(reviewsCollection, orderBy('createdAt', 'desc'), startAfter(lastVisibleReview), limit(REVIEWS_PER_PAGE));
                        }
                        else if (direction === 'prev') {
                            if (prevReviewPages.length <= 1) {
                                setLoadingReviews(false);
                                return [2 /*return*/];
                            }
                            newPrevPages = prevReviewPages.slice(0, -1);
                            cursorForPrevPage = newPrevPages.length > 1 ? newPrevPages[newPrevPages.length - 2] : null;
                            q = cursorForPrevPage ? query(reviewsCollection, orderBy('createdAt', 'desc'), startAfter(cursorForPrevPage), limit(REVIEWS_PER_PAGE))
                                : query(reviewsCollection, orderBy('createdAt', 'desc'), limit(REVIEWS_PER_PAGE));
                            setPrevReviewPages(newPrevPages);
                        }
                        else {
                            q = query(reviewsCollection, orderBy('createdAt', 'desc'), limit(REVIEWS_PER_PAGE));
                            setPrevReviewPages([]);
                        }
                        return [4 /*yield*/, getDocs(q)];
                    case 2:
                        snapshot = _a.sent();
                        docs_1 = snapshot.docs;
                        fetchedReviews = docs_1.map(function (doc) { var _a, _b; return (__assign(__assign({ id: doc.id, projectId: projectId }, doc.data()), { createdAt: ((_b = (_a = doc.data().createdAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) || new Date() })); });
                        setReviews(fetchedReviews);
                        newLastVisible = docs_1.length > 0 ? docs_1[docs_1.length - 1] : null;
                        setLastVisibleReview(newLastVisible);
                        if (direction === 'next' && docs_1.length > 0)
                            setPrevReviewPages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [docs_1[0]], false); });
                        else if (direction === 'reset' && docs_1.length > 0)
                            setPrevReviewPages(docs_1[0] ? [docs_1[0]] : []);
                        return [3 /*break*/, 5];
                    case 3:
                        err_2 = _a.sent();
                        console.error('Failed to fetch reviews:', err_2);
                        setError(err_2.message || 'Failed to fetch reviews.'); // Added err.message
                        return [3 /*break*/, 5];
                    case 4:
                        setLoadingReviews(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    var handleEditClick = function () {
        if (project) {
            setFormState(__assign({}, project));
            setIsEditing(true);
            setError(null);
        }
    };
    var handleCancelClick = function () {
        setIsEditing(false);
        if (project)
            setFormState(__assign({}, project));
        setCoverImage(null); // Removed setPosterImage
        setError(null);
    };
    var handleCoverImageChange = function (e) {
        if (e.target.files && e.target.files[0])
            setCoverImage(e.target.files[0]);
        else
            setCoverImage(null);
    };
    // Removed handlePosterImageChange
    var deleteOldImage = function (url) { return __awaiter(void 0, void 0, void 0, function () {
        var pathWithQuery, encodedPath, decodedPath, oldRef, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!url || !url.startsWith("https://firebasestorage.googleapis.com/"))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    pathWithQuery = url.split("/o/")[1];
                    if (!pathWithQuery) {
                        console.warn("Could not parse path from old image URL:", url);
                        return [2 /*return*/];
                    }
                    encodedPath = pathWithQuery.split("?")[0];
                    decodedPath = decodeURIComponent(encodedPath);
                    oldRef = ref(storage, decodedPath);
                    return [4 /*yield*/, deleteObject(oldRef)];
                case 2:
                    _a.sent();
                    console.log("Old image deleted successfully:", decodedPath);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    if (e_1.code === 'storage/object-not-found')
                        console.log("Old image not found:", url);
                    else
                        console.warn("Could not delete old image:", url, e_1.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var uploadImage = function (imageFile, baseImageName) { return __awaiter(void 0, void 0, void 0, function () {
        var storageRef, uploadError_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!imageFile)
                        return [2 /*return*/, ''];
                    if (!projectId) {
                        setError("Project ID is missing for image upload.");
                        return [2 /*return*/, ''];
                    }
                    if (!imageFile.type.startsWith("image/")) {
                        setError("Please upload a valid image file.");
                        return [2 /*return*/, ''];
                    }
                    storageRef = ref(storage, "projects/".concat(projectId, "/").concat(baseImageName));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, uploadBytes(storageRef, imageFile)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, getDownloadURL(storageRef)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    uploadError_1 = _a.sent();
                    console.error("Error uploading image: ", uploadError_1);
                    setError("Image upload failed: ".concat(uploadError_1.message));
                    return [2 /*return*/, ''];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleSaveClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var formKeys, hasTextChanged, newCoverImageUrl_1, coverExtension, updatedData, _a, id, owner_uid, ownerId, writableData_1, saveError_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!project || !projectId) {
                        setError("Cannot save, project data missing.");
                        return [2 /*return*/];
                    }
                    formKeys = Object.keys(formState);
                    hasTextChanged = formKeys.some(function (key) {
                        if (key === 'genres') { // Special handling for arrays
                            return JSON.stringify(formState[key] || []) !== JSON.stringify(project[key] || []);
                        }
                        // REMOVED THE LINE THAT CAUSED THE ERROR: if (key === 'posterImageUrl') { return false; }
                        return formState[key] !== project[key];
                    });
                    // Simplified check for image changes, as only coverImage remains
                    if (!hasTextChanged && !coverImage) {
                        setIsEditing(false);
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    setError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 9]);
                    newCoverImageUrl_1 = project.coverImageUrl;
                    if (!coverImage) return [3 /*break*/, 5];
                    if (!project.coverImageUrl) return [3 /*break*/, 3];
                    return [4 /*yield*/, deleteOldImage(project.coverImageUrl)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    coverExtension = coverImage.name.split('.').pop() || 'jpg';
                    return [4 /*yield*/, uploadImage(coverImage, "cover_".concat(projectId, "_").concat(Date.now(), ".").concat(coverExtension))];
                case 4:
                    newCoverImageUrl_1 = _b.sent();
                    if (!newCoverImageUrl_1) {
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    _b.label = 5;
                case 5:
                    updatedData = __assign(__assign({}, formState), { coverImageUrl: newCoverImageUrl_1 });
                    if (formState.genres && Array.isArray(formState.genres)) {
                        updatedData.genres = formState.genres;
                        if (updatedData.hasOwnProperty('genre'))
                            delete updatedData.genre;
                    }
                    else if (typeof formState.genre === 'string') {
                        updatedData.genres = formState.genre.split(',').map(function (g) { return g.trim(); }).filter(function (g) { return g; });
                        if (updatedData.hasOwnProperty('genre'))
                            delete updatedData.genre;
                    }
                    _a = updatedData, id = _a.id, owner_uid = _a.owner_uid, ownerId = _a.ownerId, writableData_1 = __rest(_a, ["id", "owner_uid", "ownerId"]);
                    // Ensure posterImageUrl is removed from writableData if it somehow remains
                    if (writableData_1.hasOwnProperty('posterImageUrl')) {
                        delete writableData_1.posterImageUrl;
                    }
                    return [4 /*yield*/, updateDoc(doc(db, 'Projects', projectId), writableData_1)];
                case 6:
                    _b.sent();
                    // Update local project state
                    setProject(function (prev) {
                        if (!prev)
                            return null;
                        var newProjectState = __assign(__assign(__assign({}, prev), formState), { coverImageUrl: newCoverImageUrl_1, 
                            // Removed posterImageUrl from newProjectState
                            genres: writableData_1.genres || prev.genres, id: projectId, owner_uid: prev.owner_uid // Ensure owner_uid is preserved
                         });
                        // If genres array was set, ensure single 'genre' string is removed from local state if it exists
                        if (newProjectState.genres && newProjectState.hasOwnProperty('genre')) {
                            delete newProjectState.genre;
                        }
                        // Ensure posterImageUrl is removed from local state
                        if (newProjectState.hasOwnProperty('posterImageUrl')) {
                            delete newProjectState.posterImageUrl;
                        }
                        return newProjectState;
                    });
                    // Also update formState to reflect the saved state, including new image URLs
                    setFormState(function (prev) { return (__assign(__assign(__assign({}, prev), writableData_1), { coverImageUrl: newCoverImageUrl_1 })); }); // Removed posterImageUrl from here
                    setCoverImage(null); // Removed setPosterImage
                    setIsEditing(false);
                    setSaveSuccess(true);
                    setTimeout(function () { return setSaveSuccess(false); }, 3000);
                    return [3 /*break*/, 9];
                case 7:
                    saveError_1 = _b.sent();
                    console.error("Error updating project:", saveError_1);
                    setError(saveError_1.message || "Failed to save.");
                    return [3 /*break*/, 9];
                case 8:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormState(function (prevState) {
            var _a;
            return (__assign(__assign({}, prevState), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleGenresChange = function (e) {
        var value = e.target.value;
        var genresArray = value.split(',').map(function (g) { return g.trim(); }).filter(function (g) { return g; });
        setFormState(function (prev) { return (__assign(__assign({}, prev), { genres: genresArray, genre: value })); }); // Keep genre string for input field
    };
    var handleSuggestClick = function () {
        var subject = "Suggestion for project: ".concat(project === null || project === void 0 ? void 0 : project.projectName);
        var body = encodeURIComponent("I would like to suggest an update for \"".concat(project === null || project === void 0 ? void 0 : project.projectName, "\".\n\nDetails:\n"));
        window.location.href = "mailto:admin@example.com?subject=".concat(subject, "&body=").concat(body); // Replace with your admin email
    };
    var reviewSection = (_jsxs("section", { className: "mt-12", children: [_jsx("h2", { className: "text-2xl font-semibold text-white mb-6", children: "Reviews" }), loadingReviews ? (_jsx("div", { className: "text-gray-400", children: "Loading reviews..." })) :
                reviews.length === 0 ? (_jsx("p", { className: "text-gray-400", children: "No reviews yet." })) : (_jsx("ul", { className: "space-y-4", children: reviews.map(function (r) { return (_jsxs("li", { className: "bg-gray-900 rounded-lg p-5 border border-gray-700", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm font-medium text-teal-400", children: r.author }), _jsx("span", { className: "text-xs text-gray-500", children: r.createdAt.toLocaleString() })] }), _jsx("p", { className: "text-sm text-white", children: r.content })] }, r.id)); }) })), _jsxs("div", { className: "mt-8 flex items-center justify-between gap-6", children: [_jsx("button", { onClick: function () { return fetchReviews('prev'); }, disabled: loadingReviews || prevReviewPages.length <= 1, className: "px-4 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-40", children: "\u2190 Previous" }), _jsxs("span", { className: "text-gray-400 text-sm", children: ["Page ", prevReviewPages.length || (reviews.length > 0 ? 1 : 0)] }), _jsx("button", { onClick: function () { return fetchReviews('next'); }, disabled: loadingReviews || reviews.length < REVIEWS_PER_PAGE, className: "px-4 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-40", children: "Next \u2192" })] })] }));
    return (_jsxs("div", { className: "min-h-screen bg-gray-900 p-6", children: [_jsx(Link, { to: "/", className: "inline-block mb-6 text-blue-500 hover:text-blue-400 transition-colors", children: "\u2190 Back to All Projects" }), isEditing ? (
            // --- EDITING FORM ---
            _jsxs("form", { className: "max-w-5xl mx-auto p-6 bg-white rounded shadow-md space-y-6", children: [error && _jsx("p", { className: "text-red-600 text-sm mb-4", children: error }), saveSuccess && _jsx("p", { className: "text-green-500 text-sm mb-4", children: "Project updated successfully!" }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: "Basic Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "projectName", className: "block text-sm font-medium", children: "Project Name" }), _jsx("input", { type: "text", id: "projectName", name: "projectName", value: formState.projectName || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "country", className: "block text-sm font-medium", children: "Country" }), _jsx("input", { type: "text", id: "country", name: "country", value: formState.country || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "productionCompany", className: "block text-sm font-medium", children: "Production Company" }), _jsx("input", { type: "text", id: "productionCompany", name: "productionCompany", value: formState.productionCompany || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "status", className: "block text-sm font-medium", children: "Status" }), _jsxs("select", { id: "status", name: "status", value: formState.status || 'Pre-Production', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2", children: [_jsx("option", { value: "Pre-Production", children: "Pre-Production" }), _jsx("option", { value: "Development", children: "Development" }), _jsx("option", { value: "Production", children: "Production" }), _jsx("option", { value: "Post-Production", children: "Post-Production" }), _jsx("option", { value: "Completed", children: "Completed" }), _jsx("option", { value: "Cancelled", children: "Cancelled" })] })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: "Story Info" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "logline", className: "block text-sm font-medium", children: "Logline" }), _jsx("textarea", { id: "logline", name: "logline", value: formState.logline || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2", rows: 2 })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "synopsis", className: "block text-sm font-medium", children: "Synopsis" }), _jsx("textarea", { id: "synopsis", name: "synopsis", value: formState.synopsis || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2", rows: 4 })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: "Production Timeline" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "startDate", className: "block text-sm font-medium", children: "Start Date" }), _jsx("input", { type: "date", id: "startDate", name: "startDate", value: formState.startDate || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "endDate", className: "block text-sm font-medium", children: "End Date" }), _jsx("input", { type: "date", id: "endDate", name: "endDate", value: formState.endDate || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "location", className: "block text-sm font-medium", children: "Location" }), _jsx("input", { type: "text", id: "location", name: "location", value: formState.location || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "genres", className: "block text-sm font-medium", children: "Genres (comma-separated)" }), _jsx("input", { type: "text", id: "genres", name: "genres", value: (Array.isArray(formState.genres) ? formState.genres.join(', ') : formState.genre) || '', onChange: handleGenresChange, className: "mt-1 w-full border rounded px-3 py-2", placeholder: "e.g., Action, Comedy" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: "Creative Team" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "director", className: "block text-sm font-medium", children: "Director" }), _jsx("input", { type: "text", id: "director", name: "director", value: formState.director || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "producer", className: "block text-sm font-medium", children: "Producer" }), _jsx("input", { type: "text", id: "producer", name: "producer", value: formState.producer || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: "Media" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-start", children: _jsxs("div", { children: [_jsx("label", { htmlFor: "coverImage", className: "block text-sm font-medium", children: "Cover Image" }), _jsx("input", { type: "file", id: "coverImage", accept: "image/*", onChange: handleCoverImageChange, className: "mt-1" }), coverImage ? _jsx("img", { src: URL.createObjectURL(coverImage), alt: "New Cover Preview", className: "w-36 h-auto mt-2 rounded shadow object-cover" }) : formState.coverImageUrl ? _jsx("img", { src: formState.coverImageUrl, alt: "Current Cover", className: "w-36 h-auto mt-2 rounded shadow object-cover" }) : null] }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: "Additional" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "projectWebsite", className: "block text-sm font-medium", children: "Website" }), _jsx("input", { type: "url", id: "projectWebsite", name: "projectWebsite", value: formState.projectWebsite || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "productionBudget", className: "block text-sm font-medium", children: "Budget" }), _jsx("input", { type: "text", id: "productionBudget", name: "productionBudget", value: formState.productionBudget || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "productionCompanyContact", className: "block text-sm font-medium", children: "Company Contact" }), _jsx("input", { type: "text", id: "productionCompanyContact", name: "productionCompanyContact", value: formState.productionCompanyContact || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] })] })] }), _jsxs("div", { className: "pt-4 border-t mt-6 flex justify-end space-x-4", children: [_jsx("button", { type: "button", onClick: handleCancelClick, className: "px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600", disabled: loading, children: "Cancel" }), _jsx("button", { type: "button", onClick: handleSaveClick, disabled: loading, className: "px-4 py-2 rounded text-white ".concat(loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'), children: loading ? 'Saving...' : 'Save Changes' })] })] })) : (
            // --- DISPLAYING PROJECT DETAILS ---
            loading && !project ? (_jsx(LoadingSpinner, {})) :
                error && !project ? (_jsxs("p", { className: "text-white text-center mt-10", children: ["Error: ", error] })) :
                    project ? (_jsxs("div", { className: "max-w-4xl mx-auto py-12", children: [project.coverImageUrl && (_jsxs("div", { className: "mb-6 flex justify-center", children: [" ", _jsx("img", { src: project.coverImageUrl, alt: "".concat(project.projectName, " Cover"), 
                                        // Example: Fixed width, auto height, max height, contain to fit
                                        className: "w-64 h-auto max-h-48 object-contain rounded-md shadow-lg" })] })), _jsx(ProjectShowcase, { project: project, userId: user === null || user === void 0 ? void 0 : user.uid, 
                                // Pass onEditClick if ProjectShowcase itself renders an edit button for the owner.
                                // If the edit button is handled *only* below, this prop might not be needed by ProjectShowcase.
                                onEditClick: handleEditClick }), reviewSection, _jsxs("div", { className: "mt-10 text-center", children: [" ", user && user.uid === project.owner_uid ? (_jsx("button", { onClick: handleEditClick, className: "px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md", children: "Edit Project" })) : (_jsx("button", { onClick: handleSuggestClick, className: "px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md", children: "Suggest Update" }))] })] })) : (_jsx("div", { className: "text-white text-center mt-10", children: "Project not found or not available." })))] }));
};
export default ProjectDetail;
