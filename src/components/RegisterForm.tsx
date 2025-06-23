// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { User } from '../models/User';
import JobTitleSelector from './JobTitleSelector';

const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [country, setCountry] = useState('Dominican Republic');
    const [userType, setUserType] = useState('Crew');

    // State for the JobTitleSelector
    const [department, setDepartment] = useState('');
    const [jobTitle, setJobTitle] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // 2. Create the main user document in the 'users' collection
            const newUser: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: displayName,
                photoURL: null,
                roles: ['user'],
                country: country,
                user_type: userType,
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            console.log('User document created successfully!');

            // --- (NEW) 3. If user is Crew, create a separate profile in 'crewProfiles' ---
            if (userType === 'Crew') {
                const crewProfileData = {
                    department: department,
                    jobTitle: jobTitle,
                    // You can add other crew-specific default fields here
                    // e.g., availability: 'available', yearsOfExperience: 0
                };
                await setDoc(doc(db, "crewProfiles", firebaseUser.uid), crewProfileData);
                console.log('Crew profile created successfully!');
            }

        } catch (error: any) {
            console.error('Error registering user:', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* ... other input fields for email, password, displayName, etc. ... */}
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div>
                <label>Display Name:</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
            </div>
            <div>
                <label>Country:</label>
                <select value={country} onChange={e => setCountry(e.target.value)}>
                    <option value="Dominican Republic">Dominican Republic</option>
                    <option value="United States">United States</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <label>User Type:</label>
                <select value={userType} onChange={e => setUserType(e.target.value)}>
                    <option value="Crew">Crew</option>
                    <option value="Producer">Producer</option>
                </select>
            </div>

            {userType === 'Crew' && (
                <JobTitleSelector
                    selectedDepartment={department}
                    selectedJobTitle={jobTitle}
                    onDepartmentChange={setDepartment}
                    onJobTitleChange={setJobTitle}
                />
            )}

            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;