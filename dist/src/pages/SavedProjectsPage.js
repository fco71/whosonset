import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
const SavedProjectsPage = () => {
    const [savedProjects, setSavedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchSavedProjects = async () => {
            const user = auth.currentUser;
            if (!user)
                return;
            try {
                const savedProjectsRef = collection(db, `collections/${user.uid}/savedProjects`);
                const snapshot = await getDocs(savedProjectsRef);
                const projects = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setSavedProjects(projects);
            }
            catch (error) {
                console.error('Error fetching saved projects:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchSavedProjects();
    }, []);
    return (_jsxs("div", { className: "min-h-screen bg-gray-900 text-white p-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Saved Projects" }), loading ? (_jsx("div", { className: "text-center text-gray-400", children: "Loading saved projects..." })) : savedProjects.length === 0 ? (_jsx("div", { className: "text-center text-gray-400", children: "No saved projects found." })) : (_jsx("div", { className: "space-y-6", children: savedProjects.map(project => (_jsxs("div", { className: "flex bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition", onClick: () => navigate(`/projects/${project.id}`), children: [project.coverImageUrl && (_jsx("img", { src: project.coverImageUrl, alt: project.projectName, className: "w-1/3 object-cover" })), _jsxs("div", { className: "p-4 flex flex-col justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold", children: project.projectName }), _jsxs("p", { className: "text-sm text-gray-400", children: [project.productionCompany, " \u2022 ", project.country] }), _jsx("p", { className: "mt-2 text-sm text-gray-300 line-clamp-3", children: project.logline })] }), _jsx("span", { className: "mt-2 inline-block px-2 py-1 text-xs bg-blue-700 rounded", children: project.status })] })] }, project.id))) }))] }));
};
export default SavedProjectsPage;
