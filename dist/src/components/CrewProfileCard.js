import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { FaDownload, FaBookmark, FaRegBookmark } from 'react-icons/fa';
const CrewProfileCard = ({ profile }) => {
    const [user] = useAuthState(auth);
    const [isSaved, setIsSaved] = useState(false);
    const handleSaveToCollection = async () => {
        if (!user) {
            alert('Please log in to save profiles.');
            return;
        }
        const docRef = doc(db, `collections/${user.uid}/savedCrew/${profile.id}`);
        try {
            if (isSaved) {
                await deleteDoc(docRef);
                setIsSaved(false);
            }
            else {
                await setDoc(docRef, profile);
                setIsSaved(true);
            }
        }
        catch (error) {
            console.error('Error saving crew profile:', error);
        }
    };
    const handleDownloadResume = () => {
        if (profile.resumeUrl) {
            window.open(profile.resumeUrl, '_blank');
        }
        else {
            alert('No resume available.');
        }
    };
    return (_jsxs("div", { className: "bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center text-center", children: [_jsx("img", { src: profile.avatarUrl || '/default-avatar.png', alt: profile.name, className: "w-24 h-24 rounded-full mb-4 object-cover" }), _jsx("h2", { className: "text-xl font-semibold", children: profile.name }), _jsxs("p", { className: "text-sm text-gray-400", children: [profile.role, " \u2013 ", profile.location] }), _jsx("p", { className: "mt-2 text-sm text-gray-300", children: profile.bio }), _jsxs("div", { className: "mt-4 flex gap-3", children: [_jsxs("button", { onClick: handleSaveToCollection, className: "bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center", children: [isSaved ? _jsx(FaBookmark, { className: "mr-2" }) : _jsx(FaRegBookmark, { className: "mr-2" }), isSaved ? 'Saved' : 'Save'] }), _jsxs("button", { onClick: handleDownloadResume, className: "bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center", children: [_jsx(FaDownload, { className: "mr-2" }), "Download Resume"] })] })] }));
};
export default CrewProfileCard;
