// src/index.tsx
import './styles/globals.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
    useLocation
} from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import ProjectList from './components/ProjectList';
import RegisterForm from './components/RegisterForm';
import AllProjects from './components/AllProjects';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import AddProject from './components/AddProject';
import Home from './components/Home';
import ProjectDetail from './components/ProjectDetail';

import SavedCrewProfilesPage from './pages/SavedCrewProfilesPage';
import SavedProjectsPage from './pages/SavedProjectsPage';
import CollectionsHubPage from './pages/CollectionsHubPage';

import { AnimatePresence } from 'framer-motion';

const CrewSearch = () => <h2 className="text-white p-6">Crew Search (Protected)</h2>;

const App: React.FC = () => {
    const [authUser, setAuthUser] = useState<any>(null);
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

    return (
        <>
            <header className="bg-gray-800 text-white py-4 px-6 shadow-md">
                <nav className="flex flex-wrap items-center justify-between">
                    <ul className="flex gap-4 flex-wrap">
                        <li><Link to="/" className="hover:underline">Home</Link></li>
                        <li><Link to="/projects" className="hover:underline">All Projects</Link></li>
                        {!authUser ? (
                            <>
                                <li><Link to="/login" className="hover:underline">Login</Link></li>
                                <li><Link to="/register" className="hover:underline">Register</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/projects/add" className="hover:underline">Add Project</Link></li>
                                <li><Link to="/crew" className="hover:underline">Crew Search</Link></li>
                                <li><Link to="/collections" className="hover:underline">My Collections</Link></li>
                                <li>
                                    <button
                                        onClick={userSignOut}
                                        className="text-sm bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
                                    >
                                        Sign Out
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            <main className="bg-gray-900 min-h-screen">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects" element={<AllProjects />} />
                        <Route path="/projects/:projectId" element={<ProjectDetail />} />
                        <Route path="/projects/add" element={<PrivateRoute><AddProject /></PrivateRoute>} />
                        <Route path="/crew" element={<PrivateRoute><CrewSearch /></PrivateRoute>} />
                        <Route path="/collections" element={<PrivateRoute><CollectionsHubPage /></PrivateRoute>} />
                        <Route path="/saved-crew" element={<PrivateRoute><SavedCrewProfilesPage /></PrivateRoute>} />
                        <Route path="/saved-projects" element={<PrivateRoute><SavedProjectsPage /></PrivateRoute>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </AnimatePresence>
            </main>
        </>
    );
};

// Router wrapper to allow AnimatePresence to access location
const RootWithRouter = () => (
    <Router>
        <App />
    </Router>
);

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <RootWithRouter />
        </React.StrictMode>
    );
} else {
    console.error("Could not find root element!");
}
