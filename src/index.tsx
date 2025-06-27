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
import SocialDashboard from './components/Social/SocialDashboard';

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
            <header className="bg-white bg-opacity-80 backdrop-blur-md shadow-sm fixed w-full z-50 top-0 left-0">
                <nav className="flex items-center justify-between px-6 py-3">
                    {/* Left: Home/Logo */}
                    <div>
                        <Link to="/" className="text-xl font-bold text-gray-900 hover:opacity-80 transition">whosonset</Link>
                    </div>
                    {/* Right: Notifications & Profile */}
                    <div className="flex items-center gap-4">
                        {/* Notifications Bell */}
                        <Link to="/chat" className="relative group" title="Messages & Notifications">
                            <span className="material-icons text-gray-700 text-2xl group-hover:text-blue-600 transition">notifications</span>
                            {/* Optionally, add a red dot for unread */}
                            {/* <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span> */}
                        </Link>
                        {/* Profile Avatar */}
                        {authUser ? (
                            <Link to="/profile" className="flex items-center gap-2 group">
                                {/* Replace with user avatar if available */}
                                <span className="material-icons text-gray-700 text-2xl group-hover:text-blue-600 transition">account_circle</span>
                                {/* <img src={authUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full object-cover" /> */}
                            </Link>
                        ) : (
                            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
                        )}
                    </div>
                </nav>
            </header>

            {/* Add padding top to main to offset fixed header */}
            <main className="bg-gray-900 min-h-screen pt-20">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects" element={<AllProjects />} />
                        <Route path="/projects/:projectId" element={<ProjectDetail />} />
                        <Route path="/projects/add" element={<PrivateRoute><AddProject /></PrivateRoute>} />
                        <Route path="/projects/:projectId/manage" element={<PrivateRoute><ProjectDashboardWrapper /></PrivateRoute>} />
                        <Route path="/crew" element={<ProducerView />} />
                        <Route path="/social" element={<PrivateRoute><SocialDashboard currentUserId={authUser?.uid || ''} currentUser={authUser} /></PrivateRoute>} />
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
