import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
const PROJECTS_PER_PAGE = 48;
const getStatusBadgeColor = (rawStatus) => {
    const status = rawStatus.toLowerCase();
    if (status.includes('development'))
        return 'bg-indigo-600 text-white';
    if (status.includes('pre'))
        return 'bg-yellow-500 text-black';
    if (status.includes('filming') || status.includes('production'))
        return 'bg-green-500 text-white';
    if (status.includes('post'))
        return 'bg-orange-500 text-white';
    if (status.includes('completed'))
        return 'bg-blue-500 text-white';
    if (status.includes('cancel'))
        return 'bg-red-500 text-white';
    return 'bg-gray-600 text-white';
};
const formatStatus = (status) => status
    .toLowerCase()
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};
const AllProjects = () => {
    const [projects, setProjects] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [firstVisible, setFirstVisible] = useState(null);
    const [prevPages, setPrevPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [authUser, setAuthUser] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const isInitialLoad = useRef(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => setAuthUser(user));
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);
    useEffect(() => {
        fetchProjects('reset');
    }, []);
    const fetchProjects = async (direction = 'reset') => {
        setLoading(true);
        try {
            let q;
            if (direction === 'next' && lastVisible) {
                q = query(collection(db, 'Projects'), orderBy('projectName'), startAfter(lastVisible), limit(PROJECTS_PER_PAGE));
                setPageNumber((prev) => prev + 1);
            }
            else if (direction === 'prev' && prevPages.length > 0) {
                const prev = prevPages[prevPages.length - 2];
                q = query(collection(db, 'Projects'), orderBy('projectName'), startAfter(prev), limit(PROJECTS_PER_PAGE));
                setPrevPages((prev) => prev.slice(0, -1));
                setPageNumber((prev) => Math.max(prev - 1, 1));
            }
            else {
                q = query(collection(db, 'Projects'), orderBy('projectName'), limit(PROJECTS_PER_PAGE));
                setPrevPages([]);
                setPageNumber(1);
            }
            const snapshot = await getDocs(q);
            const docs = snapshot.docs;
            const data = docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setProjects(data);
            setLastVisible(docs[docs.length - 1] || null);
            setFirstVisible(docs[0] || null);
            if (direction === 'next')
                setPrevPages((prev) => [...prev, docs[0]]);
            if (direction === 'reset')
                setPrevPages([docs[0]]);
        }
        catch (error) {
            console.error('Error fetching paginated projects:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
    };
    const filteredProjects = projects.filter((project) => {
        const query = debouncedQuery.toLowerCase();
        const matchesSearch = project.projectName.toLowerCase().includes(query) ||
            project.productionCompany?.toLowerCase().includes(query); // Added optional chaining
        const matchesStatus = statusFilter === '' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const sortedProjects = [...filteredProjects].sort((a, b) => {
        if (sortBy === 'a-z')
            return a.projectName.localeCompare(b.projectName);
        if (sortBy === 'z-a')
            return b.projectName.localeCompare(a.projectName);
        return b.id.localeCompare(a.id);
    });
    const highlightMatch = (text, query) => {
        if (!query)
            return text;
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) => part.toLowerCase() === query.toLowerCase() ? (_jsx("mark", { className: "bg-yellow-300 text-gray-900 rounded px-1", children: part }, i)) : (part));
    };
    const renderSkeletons = () => Array.from({ length: 6 }).map((_, i) => (_jsxs("div", { className: "flex flex-col md:flex-row animate-pulse bg-gray-800 rounded-xl overflow-hidden border border-gray-700 min-h-[220px]", children: [_jsx("div", { className: "w-full md:w-[200px] h-[200px] bg-gray-700" }), _jsxs("div", { className: "flex-1 p-5 space-y-4", children: [_jsx("div", { className: "h-6 bg-gray-700 rounded w-3/4" }), _jsx("div", { className: "h-4 bg-gray-700 rounded w-1/2" }), _jsx("div", { className: "h-4 bg-gray-700 rounded w-1/3" }), _jsx("div", { className: "h-3 bg-gray-600 rounded w-full" }), _jsx("div", { className: "h-3 bg-gray-600 rounded w-5/6" })] })] }, i)));
    return (_jsxs(motion.div, { className: "min-h-screen bg-gray-900 text-white p-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, transition: { duration: 0.1, ease: 'easeOut' }, children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "All Projects" }), authUser && (_jsxs(Link, { to: "/projects/add", className: "bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 4v16m8-8H4" }) }), "Add"] }))] }), _jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-4 mb-6", children: [_jsx("input", { type: "text", placeholder: "Search by name or company", className: "w-full md:w-1/2 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "w-full md:w-1/4 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All Statuses" }), _jsx("option", { value: "In Development", children: "In Development" }), _jsx("option", { value: "Pre-Production", children: "Pre-Production" }), _jsx("option", { value: "Production", children: "Production" }), _jsx("option", { value: "Post-Production", children: "Post-Production" }), _jsx("option", { value: "Completed", children: "Completed" })] }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "w-full md:w-1/4 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "newest", children: "Newest" }), _jsx("option", { value: "a-z", children: "A\u2013Z" }), _jsx("option", { value: "z-a", children: "Z\u2013A" })] }), (searchQuery || statusFilter) && (_jsx("button", { onClick: resetFilters, className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition", children: "Reset" }))] }), loading ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: renderSkeletons() })) : (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "grid grid-cols-1 md:grid-cols-2 gap-6", variants: containerVariants, initial: "hidden", animate: "show", children: sortedProjects.map((project) => (_jsx(motion.div, { variants: cardVariants, transition: { duration: 0.3, ease: 'easeOut' }, children: _jsxs(Link, { to: `/projects/${project.id}`, className: "flex flex-col md:flex-row bg-gray-800 rounded-xl overflow-hidden border border-blue-500/20 hover:border-blue-500/70 shadow-md hover:shadow-blue-500/30 transition duration-300 transform hover:scale-[1.01] min-h-[220px] cursor-pointer", children: [_jsx("div", { className: "w-full md:w-[200px] h-[200px] bg-black flex items-center justify-center shrink-0", children: _jsx("img", { src: project.coverImageUrl || '/my-icon.png', alt: project.projectName, className: "max-w-full max-h-full object-contain", onError: (e) => {
                                                e.target.src = '/my-icon.png';
                                            } }) }), _jsxs("div", { className: "flex-1 min-w-0 p-5 flex flex-col justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-xl font-bold text-pink-400 truncate", children: highlightMatch(project.projectName, debouncedQuery) }), _jsxs("p", { className: "text-white font-medium truncate", children: [project.productionCompany ? highlightMatch(project.productionCompany, debouncedQuery) : 'N/A', " "] }), project.director && (_jsxs("p", { className: "text-sm text-gray-300 truncate", children: [_jsx("span", { className: "font-semibold", children: "Director:" }), " ", project.director] })), project.producer && (_jsxs("p", { className: "text-sm text-gray-300 truncate", children: [_jsx("span", { className: "font-semibold", children: "Producer:" }), " ", project.producer] })), _jsx("p", { className: "text-sm text-gray-400 mt-1 line-clamp-2", children: project.logline }), project.genres && project.genres.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-1", children: project.genres.map((genre, index) => (_jsx("span", { className: "bg-gray-700 text-xs text-white px-2 py-1 rounded-full", children: genre }, index))) }))] }), _jsx("div", { className: "mt-3", children: _jsx("span", { className: `inline-block text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeColor(project.status)}`, children: formatStatus(project.status) }) })] })] }) }, project.id))) }), filteredProjects.length === 0 && (_jsx("div", { className: "text-center text-gray-400 mt-8 col-span-full", children: "No projects match your filters." })), _jsxs("div", { className: "flex justify-center items-center gap-6 mt-10", children: [_jsx("button", { disabled: prevPages.length < 2, onClick: () => fetchProjects('prev'), className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white disabled:opacity-40", children: "Previous" }), _jsxs("span", { className: "text-gray-300 text-sm", children: ["Page ", pageNumber] }), _jsx("button", { disabled: projects.length < PROJECTS_PER_PAGE, onClick: () => fetchProjects('next'), className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white disabled:opacity-40", children: "Next" })] })] }))] }));
};
export default AllProjects;
