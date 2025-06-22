import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Register.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, {
                displayName: displayName
            });
            console.log("Successfully Registered");
            navigate('/');
        }
        catch (error) { //Type any for errors
            setError(error.message);
            console.error("Registration failed:", error.message);
        }
    };
    return (_jsxs("div", { children: [_jsx("h2", { children: "Register" }), error && _jsx("p", { style: { color: 'red' }, children: error }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "displayName", children: "Display Name:" }), _jsx("input", { type: "text", id: "displayName", value: displayName, onChange: (e) => setDisplayName(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", children: "Email:" }), _jsx("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", children: "Password:" }), _jsx("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), _jsx("button", { type: "submit", children: "Register" })] }), _jsxs("p", { children: ["Already have an account? ", _jsx(Link, { to: "/login", children: "Login" })] })] }));
};
export default Register;
