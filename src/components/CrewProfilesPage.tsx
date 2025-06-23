// src/pages/EditCrewProfilePage.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'; // A popular library for handling auth state
import JobTitleSelector from '../components/JobTitleSelector';

const EditCrewProfilePage: React.FC = () => {
    // Using a hook to get the current user and loading state
    const [user, loadingAuth] = useAuthState(auth);

    // State for the form fields
    const [department, setDepartment] = useState('');
    const [jobTitle, setJobTitle] = useState('');

    // State to manage loading of profile data and form submission
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [message, setMessage] = useState('');

    // useEffect to fetch the crew profile data when the component loads
    useEffect(() => {
        const fetchCrewProfile = async () => {
            if (!user) return; // Wait until user is loaded

            const profileDocRef = doc(db, 'crewProfiles', user.uid);
            const profileSnap = await getDoc(profileDocRef);

            if (profileSnap.exists()) {
                const profileData = profileSnap.data();
                setDepartment(profileData.department || '');
                setJobTitle(profileData.jobTitle || '');
            } else {
                console.log("No crew profile found for this user.");
            }
            setLoadingProfile(false);
        };

        // Only fetch data if auth has finished loading and we have a user
        if (!loadingAuth && user) {
            fetchCrewProfile();
        }
    }, [user, loadingAuth]); // Rerun when user or auth loading state changes

    const handleProfileUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) {
            setMessage('Error: You must be logged in to update your profile.');
            return;
        }

        setMessage('Updating profile...');
        try {
            const userId = user.uid;
            // The data object to save to Firestore
            const crewProfileData = {
                department,
                jobTitle,
                // If you have other fields on the form, add them here.
                // For example:
                // yearsOfExperience: experience,
            };

            // Use setDoc with { merge: true } to update fields without overwriting the whole document
            await setDoc(doc(db, "crewProfiles", userId), crewProfileData, { merge: true });

            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile: ", error);
            setMessage('An error occurred while updating the profile.');
        }
    };

    if (loadingAuth || loadingProfile) {
        return <div>Loading Profile...</div>;
    }

    if (!user) {
        return <div>Please log in to edit your profile.</div>;
    }

    return (
        <div>
            <h2>Edit Your Crew Profile</h2>
            <form onSubmit={handleProfileUpdate}>
                <JobTitleSelector
                    selectedDepartment={department}
                    selectedJobTitle={jobTitle}
                    onDepartmentChange={setDepartment}
                    onJobTitleChange={setJobTitle}
                />
                
                {/* You can add other profile fields here */}
                {/* <div>
                    <label>Years of Experience:</label>
                    <input type="number" value={otherProfileFields.yearsOfExperience} ... />
                </div> 
                */}

                <button type="submit">Save Changes</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EditCrewProfilePage;