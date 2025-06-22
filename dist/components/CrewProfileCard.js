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
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { FaDownload, FaBookmark, FaRegBookmark } from 'react-icons/fa';
var CrewProfileCard = function (_a) {
    var profile = _a.profile;
    var user = useAuthState(auth)[0];
    var _b = useState(false), isSaved = _b[0], setIsSaved = _b[1];
    var handleSaveToCollection = function () { return __awaiter(void 0, void 0, void 0, function () {
        var docRef, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user) {
                        alert('Please log in to save profiles.');
                        return [2 /*return*/];
                    }
                    docRef = doc(db, "collections/".concat(user.uid, "/savedCrew/").concat(profile.id));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!isSaved) return [3 /*break*/, 3];
                    return [4 /*yield*/, deleteDoc(docRef)];
                case 2:
                    _a.sent();
                    setIsSaved(false);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, setDoc(docRef, profile)];
                case 4:
                    _a.sent();
                    setIsSaved(true);
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error saving crew profile:', error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleDownloadResume = function () {
        if (profile.resumeUrl) {
            window.open(profile.resumeUrl, '_blank');
        }
        else {
            alert('No resume available.');
        }
    };
    return (_jsxs("div", { className: "bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center text-center", children: [_jsx("img", { src: profile.avatarUrl || '/default-avatar.png', alt: profile.name, className: "w-24 h-24 rounded-full mb-4 object-cover" }), _jsx("h2", { className: "text-xl font-semibold", children: profile.name }), _jsxs("p", { className: "text-sm text-gray-400", children: [profile.role, " \u2013 ", profile.location] }), _jsx("p", { className: "mt-2 text-sm text-gray-300", children: profile.bio }), _jsxs("div", { className: "mt-4 flex gap-3", children: [_jsxs("button", { onClick: handleSaveToCollection, className: "bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center", children: [isSaved ? _jsx(FaBookmark, { className: "mr-2" }) : _jsx(FaRegBookmark, { className: "mr-2" }), isSaved ? 'Saved' : 'Save'] }), _jsxs("button", { onClick: handleDownloadResume, className: "bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center", children: [_jsx(FaDownload, { className: "mr-2" }), "Download Resume"] })] })] }));
};
export default CrewProfileCard;
