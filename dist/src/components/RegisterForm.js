import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/RegisterForm.tsx
import { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [country, setCountry] = useState('Dominican Republic'); // Default value
    const [userType, setUserType] = useState('Crew'); // Default value
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const newUser = {
                uid: user.uid,
                email: user.email,
                displayName: displayName,
                photoURL: null,
                roles: ['user'],
                country: country,
                user_type: userType,
            };
            await setDoc(doc(db, 'users', user.uid), newUser);
            console.log('User registered successfully!');
        }
        catch (error) {
            console.error('Error registering user:', error.message);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { children: "Email:" }), _jsx("input", { type: "email", value: email, onChange: e => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { children: "Password:" }), _jsx("input", { type: "password", value: password, onChange: e => setPassword(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { children: "Display Name:" }), _jsx("input", { type: "text", value: displayName, onChange: e => setDisplayName(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { children: "Country:" }), _jsxs("select", { value: country, onChange: e => setCountry(e.target.value), children: [_jsx("option", { value: "Dominican Republic", children: "Dominican Republic" }), _jsx("option", { value: "United States", children: "United States" }), _jsx("option", { value: "Other", children: "Other" })] })] }), _jsxs("div", { children: [_jsx("label", { children: "User Type:" }), _jsxs("select", { value: userType, onChange: e => setUserType(e.target.value), children: [_jsx("option", { value: "Crew", children: "Crew" }), _jsx("option", { value: "Producer", children: "Producer" })] })] }), _jsx("button", { type: "submit", children: "Register" })] }));
};
export default RegisterForm;
