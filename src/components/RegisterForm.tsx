// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { User } from '../models/User';

const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [country, setCountry] = useState('');
    const [userType, setUserType] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const newUser: User = {
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
        } catch (error: any) {
            console.error('Error registering user:', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div>
                <label>Display Name:</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} />
            </div>
            <div>
                <label>Country:</label>
                <input type="text" value={country} onChange={e => setCountry(e.target.value)} />
            </div>
            <div>
                <label>User Type:</label>
                <input type="text" value={userType} onChange={e => setUserType(e.target.value)} />
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;