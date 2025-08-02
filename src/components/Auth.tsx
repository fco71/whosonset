// src/components/Auth.tsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

const Auth: React.FC = () => {
    const [user, setUser] = useState<FirebaseUser | null>(null);

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
        } catch (error: any) {
            console.error('Error signing out:', error.message);
        }
    };

    return (
        <div>
            {user ? (
                <div>
                    <p>Welcome, {user.email}!</p>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <p>Not signed in.</p>
            )}
        </div>
    );
};

export default Auth;