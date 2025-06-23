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

    // --- (1) ADDED HERE: State management for the form ---
    // These variables will hold the selections from the JobTitleSelector.
    const [department, setDepartment] = useState('');
    const [jobTitle, setJobTitle] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            const userId = firebaseUser.uid;

            // Create the main user document in the 'users' collection
            const newUser: User = {
                uid: userId,
                email: firebaseUser.email,
                displayName: displayName,
                photoURL: null,
                roles: ['user'],
                country: country,
                user_type: userType,
            };
            await setDoc(doc(db, 'users', userId), newUser);
            console.log('User document created successfully!');

            // If user is Crew, create a separate profile in 'crewProfiles'
            if (userType === 'Crew') {

                // --- (2) ADDED HERE: Saving data to 'crewProfiles' on submit ---
                // Define any other profile fields you might need here.
                // For now, it's an empty object as a placeholder.
                const otherProfileFields = {
                    availability: 'available',
                    yearsOfExperience: 0,
                    // add other default fields here
                };

                await setDoc(doc(db, "crewProfiles", userId), {
                    department,
                    jobTitle,
                    ...otherProfileFields,
                });

                console.log('Crew profile created successfully!');
            }

        } catch (error: any) {
            console.error('Error registering user:', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Input fields for email, password, displayName, etc. */}
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
                <label>User Type:</label>
                <select value={userType} onChange={e => setUserType(e.target.value)}>
                    <option value="Crew">Crew</option>
                    <option value="Producer">Producer</option>
                </select>
            </div>

            {/* Conditionally render JobTitleSelector and pass state to it */}
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