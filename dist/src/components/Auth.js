import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// src/components/Auth.tsx
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
const Auth = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log('User signed out successfully!');
        }
        catch (error) {
            console.error('Error signing out:', error.message);
        }
    };
    return (_jsx("div", { children: user ? (_jsxs("div", { children: [_jsxs("p", { children: ["Welcome, ", user.email, "!"] }), _jsx("button", { onClick: handleSignOut, children: "Sign Out" })] })) : (_jsx("p", { children: "Not signed in." })) }));
};
export default Auth;
