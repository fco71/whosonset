import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import CrewProfileCard from '../components/CrewProfileCard';
import { useNavigate } from 'react-router-dom';
const CollectionsPage = () => {
    const [savedCrew, setSavedCrew] = useState([]);
    const [savedProjects, setSavedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCollections = async () => {
            const user = auth.currentUser;
            if (!user)
                return;
            try {
                const [crewSnap, projectSnap] = await Promise.all([
                    getDocs(collection(db, `collections/${user.uid}/savedCrew`)),
                    getDocs(collection(db, `collections/${user.uid}/savedProjects`)),
                ]);
                const crewData = crewSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const projectData = projectSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setSavedCrew(crewData);
                setSavedProjects(projectData);
            }
            catch (error) {
                console.error('Error fetching collections:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchCollections();
    }, []);
    return (_jsxs("div", { className: "min-h-screen bg-gray-900 text-white p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "My Collections" }), loading ? (_jsx("div", { className: "text-center text-gray-400", children: "Loading collections..." })) : (_jsxs(_Fragment, { children: [_jsxs("section", { className: "mb-10", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Saved Crew Profiles" }), savedCrew.length === 0 ? (_jsx("p", { className: "text-gray-400", children: "No saved crew profiles." })) : (_jsx("div", { className: "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", children: savedCrew.slice(0, 6).map(profile => (_jsx(CrewProfileCard, { profile: profile }, profile.id))) })), _jsx("button", { onClick: () => navigate('/saved-crew'), className: "mt-4 text-blue-400 hover:underline", children: "View all saved crew \u2192" })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Saved Projects" }), savedProjects.length === 0 ? (_jsx("p", { className: "text-gray-400", children: "No saved projects." })) : (_jsx("div", { className: "space-y-6", children: savedProjects.slice(0, 3).map(project => (_jsxs("div", { className: "flex bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer", onClick: () => navigate(`/projects/${project.id}`), children: [project.coverImageUrl && (_jsx("img", { src: project.coverImageUrl, alt: project.projectName, className: "w-1/3 object-cover" })), _jsxs("div", { className: "p-4 flex flex-col justify-between", children: [_jsx("h3", { className: "text-xl font-semibold", children: project.projectName }), _jsx("p", { className: "text-sm text-gray-300 line-clamp-2", children: project.logline }), _jsx("span", { className: "mt-2 inline-block px-2 py-1 text-xs bg-blue-700 rounded", children: project.status })] })] }, project.id))) })), _jsx("button", { onClick: () => navigate('/saved-projects'), className: "mt-4 text-blue-400 hover:underline", children: "View all saved projects \u2192" })] })] }))] }));
};
export default CollectionsPage;
