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
// src/components/RegisterForm.tsx
import { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
var RegisterForm = function () {
    var _a = useState(''), email = _a[0], setEmail = _a[1];
    var _b = useState(''), password = _b[0], setPassword = _b[1];
    var _c = useState(''), displayName = _c[0], setDisplayName = _c[1];
    var _d = useState('Dominican Republic'), country = _d[0], setCountry = _d[1]; // Default value
    var _e = useState('Crew'), userType = _e[0], setUserType = _e[1]; // Default value
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var userCredential, user, newUser, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, createUserWithEmailAndPassword(auth, email, password)];
                case 2:
                    userCredential = _a.sent();
                    user = userCredential.user;
                    newUser = {
                        uid: user.uid,
                        email: user.email,
                        displayName: displayName,
                        photoURL: null,
                        roles: ['user'],
                        country: country,
                        user_type: userType,
                    };
                    return [4 /*yield*/, setDoc(doc(db, 'users', user.uid), newUser)];
                case 3:
                    _a.sent();
                    console.log('User registered successfully!');
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error registering user:', error_1.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { children: "Email:" }), _jsx("input", { type: "email", value: email, onChange: function (e) { return setEmail(e.target.value); } })] }), _jsxs("div", { children: [_jsx("label", { children: "Password:" }), _jsx("input", { type: "password", value: password, onChange: function (e) { return setPassword(e.target.value); } })] }), _jsxs("div", { children: [_jsx("label", { children: "Display Name:" }), _jsx("input", { type: "text", value: displayName, onChange: function (e) { return setDisplayName(e.target.value); } })] }), _jsxs("div", { children: [_jsx("label", { children: "Country:" }), _jsxs("select", { value: country, onChange: function (e) { return setCountry(e.target.value); }, children: [_jsx("option", { value: "Dominican Republic", children: "Dominican Republic" }), _jsx("option", { value: "United States", children: "United States" }), _jsx("option", { value: "Other", children: "Other" })] })] }), _jsxs("div", { children: [_jsx("label", { children: "User Type:" }), _jsxs("select", { value: userType, onChange: function (e) { return setUserType(e.target.value); }, children: [_jsx("option", { value: "Crew", children: "Crew" }), _jsx("option", { value: "Producer", children: "Producer" })] })] }), _jsx("button", { type: "submit", children: "Register" })] }));
};
export default RegisterForm;
