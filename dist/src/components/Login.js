import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Successfully Logged In");
            navigate('/');
        }
        catch (error) { //Type any for errors
            setError(error.message);
            console.error("Login failed:", error.message);
        }
    };
    return (_jsxs("div", { children: [_jsx("h2", { children: "Login" }), error && _jsx("p", { style: { color: 'red' }, children: error }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", children: "Email:" }), _jsx("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", children: "Password:" }), _jsx("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), _jsx("button", { type: "submit", children: "Login" })] }), _jsxs("p", { children: ["Don't have an account? ", _jsx(Link, { to: "/register", children: "Register" })] })] }));
};
export default Login;
