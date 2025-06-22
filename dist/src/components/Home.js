import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom'; // Import Link
const Home = () => {
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        const fetchProjects = async () => {
            const projectsCollectionRef = collection(db, 'Projects');
            try {
                const querySnapshot = await getDocs(projectsCollectionRef);
                const projectsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProjects(projectsData);
            }
            catch (error) {
                console.error('Error fetching projects:', error.message);
            }
        };
        fetchProjects();
    }, []);
    return (_jsxs("div", { children: [_jsxs("section", { className: "hero", children: [_jsx("h1", { children: "whosonset" }), _jsx("p", { children: "Discover the latest movie productions and the talented crews behind them." }), _jsx(Link, { to: "/projects", className: "btn-primary", children: "Explore Projects" })] }), _jsx("h2", { children: "Recent Projects" }), _jsx("div", { className: "projects-container", children: projects.map(project => (_jsxs("div", { className: "project-card", children: [project.coverImageUrl && (_jsx("img", { src: project.coverImageUrl, alt: project.projectName, className: "project-image" })), _jsx("h3", { children: _jsx(Link, { to: `/projects/${project.id}`, className: "project-link", children: project.projectName }) }), _jsxs("p", { children: ["Country: ", project.country] }), _jsxs("p", { children: ["Status: ", project.status] }), _jsxs("p", { children: ["Logline: ", project.logline] })] }, project.id))) })] }));
};
export default Home;
