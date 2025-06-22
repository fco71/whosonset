import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/index.tsx
import './styles/globals.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AllProjects from './components/AllProjects';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import AddProject from './components/AddProject';
import Home from './components/Home';
import ProjectDetail from './components/ProjectDetail';
import EditCrewProfile from './components/EditCrewProfile';
import SavedCrewProfilesPage from './pages/SavedCrewProfilesPage';
import SavedProjectsPage from './pages/SavedProjectsPage';
import CollectionsHubPage from './pages/CollectionsHubPage';
import { AnimatePresence } from 'framer-motion';
const CrewSearch = () => _jsx("h2", { className: "text-white p-6", children: "Crew Search (Protected)" });
const App = () => {
    const [authUser, setAuthUser] = useState(null);
    const location = useLocation(); // Needed for AnimatePresence keying
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user || null);
        });
        return () => unsubscribe();
    }, []);
    const userSignOut = () => {
        signOut(auth)
            .then(() => console.log("Sign out successful"))
            .catch(error => console.log(error));
    };
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "bg-gray-800 text-white py-4 px-6 shadow-md", children: _jsx("nav", { className: "flex flex-wrap items-center justify-between", children: _jsxs("ul", { className: "flex gap-4 flex-wrap", children: [_jsx("li", { children: _jsx(Link, { to: "/", className: "hover:underline", children: "Home" }) }), _jsx("li", { children: _jsx(Link, { to: "/projects", className: "hover:underline", children: "All Projects" }) }), !authUser ? (_jsxs(_Fragment, { children: [_jsx("li", { children: _jsx(Link, { to: "/login", className: "hover:underline", children: "Login" }) }), _jsx("li", { children: _jsx(Link, { to: "/register", className: "hover:underline", children: "Register" }) })] })) : (_jsxs(_Fragment, { children: [_jsx("li", { children: _jsx(Link, { to: "/projects/add", className: "hover:underline", children: "Add Project" }) }), _jsx("li", { children: _jsx(Link, { to: "/crew", className: "hover:underline", children: "Crew Search" }) }), _jsx("li", { children: _jsx(Link, { to: "/collections", className: "hover:underline", children: "My Collections" }) }), _jsx("li", { children: _jsx(Link, { to: "/edit-profile", className: "hover:underline", children: "Edit Profile" }) }), _jsx("li", { children: _jsx("button", { onClick: userSignOut, className: "text-sm bg-red-600 hover:bg-red-500 px-3 py-1 rounded", children: "Sign Out" }) })] }))] }) }) }), _jsx("main", { className: "bg-gray-900 min-h-screen", children: _jsx(AnimatePresence, { mode: "wait", children: _jsxs(Routes, { location: location, children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/projects", element: _jsx(AllProjects, {}) }), _jsx(Route, { path: "/projects/:projectId", element: _jsx(ProjectDetail, {}) }), _jsx(Route, { path: "/projects/add", element: _jsx(PrivateRoute, { children: _jsx(AddProject, {}) }) }), _jsx(Route, { path: "/crew", element: _jsx(PrivateRoute, { children: _jsx(CrewSearch, {}) }) }), _jsx(Route, { path: "/collections", element: _jsx(PrivateRoute, { children: _jsx(CollectionsHubPage, {}) }) }), _jsx(Route, { path: "/saved-crew", element: _jsx(PrivateRoute, { children: _jsx(SavedCrewProfilesPage, {}) }) }), _jsx(Route, { path: "/saved-projects", element: _jsx(PrivateRoute, { children: _jsx(SavedProjectsPage, {}) }) }), _jsx(Route, { path: "/edit-profile", element: _jsx(PrivateRoute, { children: _jsx(EditCrewProfile, {}) }) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) })] }, location.pathname) }) })] }));
};
const RootWithRouter = () => (_jsx(Router, { children: _jsx(App, {}) }));
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(_jsx(React.StrictMode, { children: _jsx(RootWithRouter, {}) }));
}
else {
    console.error("Could not find root element!");
}
