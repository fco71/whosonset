// src/index.tsx
import './styles/globals.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
    useLocation,
    useParams
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
import EditCrewProfile from './components/EditCrewProfile';
import PublicResumePage from './components/PublicResumePage';
import ProducerView from './pages/ProducerView';

import SavedCrewProfilesPage from './pages/SavedCrewProfilesPage';
import SavedProjectsPage from './pages/SavedProjectsPage';
import CollectionsHubPage from './pages/CollectionsHubPage';

// New components
import ChatInterface from './components/Chat/ChatInterface';
import JobSearchPage from './components/JobSearch/JobSearchPage';
import ProjectDashboard from './pages/ProjectManagement/ProjectDashboard';
import AvailabilityCalendar from './components/Availability/AvailabilityCalendar';
import GanttChart from './components/GanttChart/GanttChart';

import { AnimatePresence } from 'framer-motion';

const CrewSearch = () => <h2 className="text-white p-6">Crew Search (Protected)</h2>;

// Wrapper component to pass projectId to ProjectDashboard
const ProjectDashboardWrapper: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    return projectId ? <ProjectDashboard projectId={projectId} /> : <div>Project not found</div>;
};

const App: React.FC = () => {
    const [authUser, setAuthUser] = useState<any>(null);
    const [selectedChatRoom, setSelectedChatRoom] = useState<any>(null);
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
                        <li><Link to="/jobs" className="hover:underline">Job Search</Link></li>
                        {!authUser ? (
                            <>
                                <li><Link to="/login" className="hover:underline">Login</Link></li>
                                <li><Link to="/register" className="hover:underline">Register</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/projects/add" className="hover:underline">Add Project</Link></li>
                                <li><Link to="/crew" className="hover:underline">Crew Directory</Link></li>
                                <li><Link to="/collections" className="hover:underline">My Collections</Link></li>
                                <li><Link to="/chat" className="hover:underline">Messages</Link></li>
                                <li><Link to="/availability" className="hover:underline">Availability</Link></li>
                                <li><Link to="/edit-profile" className="hover:underline">Edit Profile</Link></li>
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
                        <Route path="/projects/:projectId/manage" element={<PrivateRoute><ProjectDashboardWrapper /></PrivateRoute>} />
                        <Route path="/crew" element={<ProducerView />} />
                        <Route path="/collections" element={<PrivateRoute><CollectionsHubPage /></PrivateRoute>} />
                        <Route path="/saved-crew" element={<PrivateRoute><SavedCrewProfilesPage /></PrivateRoute>} />
                        <Route path="/saved-projects" element={<PrivateRoute><SavedProjectsPage /></PrivateRoute>} />
                        <Route path="/edit-profile" element={<PrivateRoute><EditCrewProfile /></PrivateRoute>} />
                        <Route path="/resume/:uid" element={<PublicResumePage />} />
                        
                        {/* New routes */}
                        <Route path="/chat" element={<PrivateRoute><ChatInterface currentUserId={authUser?.uid || ''} currentUser={authUser} /></PrivateRoute>} />
                        <Route path="/jobs" element={<JobSearchPage />} />
                        <Route path="/jobs/:jobId" element={<div>Job Detail Page (Coming Soon)</div>} />
                        <Route path="/jobs/:jobId/apply" element={<div>Job Application Page (Coming Soon)</div>} />
                        <Route path="/availability" element={<PrivateRoute><AvailabilityCalendar /></PrivateRoute>} />
                        <Route path="/availability/:userId" element={<AvailabilityCalendar readOnly={true} />} />
                        <Route path="/gantt/:projectId" element={<div>Gantt Chart Page (Coming Soon)</div>} />
                        
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </AnimatePresence>
            </main>
        </>
    );
};

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
