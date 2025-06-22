import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/SavedCrewProfilesPage.tsx
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import CrewProfileCard from '../components/CrewProfileCard';
const SavedCrewProfilesPage = () => {
    const [user] = useAuthState(auth);
    const [savedProfiles, setSavedProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchSavedProfiles = async () => {
            if (!user)
                return;
            try {
                const snapshot = await getDocs(collection(db, `collections/${user.uid}/savedCrew`));
                const profiles = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setSavedProfiles(profiles);
            }
            catch (error) {
                console.error('Error fetching saved crew profiles:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchSavedProfiles();
    }, [user]);
    return (_jsxs("div", { className: "min-h-screen bg-gray-900 text-white p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Saved Crew" }), loading ? (_jsx("div", { className: "text-center text-gray-400", children: "Loading saved crew..." })) : savedProfiles.length === 0 ? (_jsx("div", { className: "text-center text-gray-400", children: "No saved crew found." })) : (_jsx("div", { className: "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", children: savedProfiles.map(profile => (_jsx(CrewProfileCard, { profile: profile }, profile.id))) }))] }));
};
export default SavedCrewProfilesPage;
