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
import { AuthProvider } from './contexts/AuthContext';

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
import FavoritesPage from './pages/FavoritesPage';

// New components
import JobSearchPage from './components/JobSearch/JobSearchPage';
import JobDetailPage from './components/JobSearch/JobDetailPage';
import JobApplicationForm from './components/JobSearch/JobApplicationForm';
import ApplicationSuccessPage from './components/JobSearch/ApplicationSuccessPage';
import JobApplicationDashboard from './components/JobSearch/JobApplicationDashboard';
import ProjectDashboard from './pages/ProjectManagement/ProjectDashboard';
import AvailabilityCalendar from './components/Availability/AvailabilityCalendar';
import GanttChart from './components/GanttChart/GanttChart';
import SocialDashboard from './components/Social/SocialDashboard';
import SocialTestPage from './components/Social/SocialTestPage';
import NotificationBell from './components/Social/NotificationBell';
import PerformanceMonitor from './components/PerformanceMonitor';
import PostJobPage from './pages/PostJobPage';
import MyProjectsPage from './pages/MyProjectsPage';
import ChatTestPage from './components/Chat/ChatTestPage';
import UserMenu from './components/UserMenu';

// Analytics components
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import ProjectAnalytics from './components/Analytics/ProjectAnalytics';

// Collaboration components
import CollaborationHub from './components/Collaboration/CollaborationHub';

// Video Conference components
import VideoConferenceHub from './components/VideoConference/VideoConferenceHub';

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
            console.log('[App] Auth state changed:', {
                uid: user?.uid,
                displayName: user?.displayName,
                email: user?.email,
                photoURL: user?.photoURL,
                providerData: user?.providerData
            });
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
            <header className="bg-white bg-opacity-90 backdrop-blur-md shadow-sm fixed w-full z-50 top-0 left-0 border-b border-gray-100">
                <nav className="flex flex-wrap items-center justify-between px-8 py-2">
                    <div>
                        {/* Typographical logo */}
                        <Link to="/" className="tracking-widest text-lg font-medium text-gray-800 uppercase select-none" style={{ letterSpacing: '0.15em', fontFamily: 'Inter, Helvetica, Arial, sans-serif' }}>
                            whosonset
                        </Link>
                    </div>
                    <ul className="flex gap-5 flex-wrap items-center">
                        <li><Link to="/" className="nav-link">Home</Link></li>
                        <li><Link to="/projects" className="nav-link">Projects</Link></li>
                        <li><Link to="/jobs" className="nav-link">Jobs</Link></li>
                        <li><Link to="/crew" className="nav-link">Crew</Link></li>
                        {!authUser ? (
                            <>
                                <li><Link to="/login" className="nav-link">Login</Link></li>
                                <li><Link to="/register" className="nav-link">Register</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/edit-profile" className="nav-link">Resume Builder</Link></li>
                                <li><Link to="/social" className="nav-link">Social</Link></li>
                                <li><Link to="/collaboration" className="nav-link">🤝 Collaboration</Link></li>
                                <li><Link to="/analytics" className="nav-link">📊 Analytics</Link></li>
                                <li><NotificationBell currentUserId={authUser?.uid || ''} /></li>
                                <li>
                                    <UserMenu authUser={authUser} userSignOut={userSignOut} />
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            <main className="bg-gray-900 min-h-screen pt-16">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects" element={<AllProjects />} />
                        <Route path="/projects/:projectId" element={<ProjectDetail />} />
                        <Route path="/projects/add" element={<PrivateRoute><AddProject /></PrivateRoute>} />
                        <Route path="/projects/:projectId/manage" element={<PrivateRoute><ProjectDashboardWrapper /></PrivateRoute>} />
                        <Route path="/crew" element={<ProducerView />} />
                        <Route path="/social" element={<PrivateRoute><SocialDashboard currentUserId={authUser?.uid || ''} currentUserName={authUser?.displayName || authUser?.email || `User ${authUser?.uid?.slice(-4) || 'Unknown'}`} currentUserAvatar={authUser?.photoURL} /></PrivateRoute>} />
                        <Route path="/social/test" element={<PrivateRoute><SocialTestPage currentUserId={authUser?.uid || ''} currentUserName={authUser?.displayName || authUser?.email || 'User'} currentUserAvatar={authUser?.photoURL} /></PrivateRoute>} />
                        <Route path="/collaboration" element={<PrivateRoute><CollaborationHub /></PrivateRoute>} />
                        <Route path="/video-conference" element={<PrivateRoute><VideoConferenceHub /></PrivateRoute>} />
                        <Route path="/collections" element={<PrivateRoute><CollectionsHubPage /></PrivateRoute>} />
                        <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
                        <Route path="/saved-crew" element={<PrivateRoute><SavedCrewProfilesPage /></PrivateRoute>} />
                        <Route path="/saved-projects" element={<PrivateRoute><SavedProjectsPage /></PrivateRoute>} />
                        <Route path="/edit-profile" element={<PrivateRoute><EditCrewProfile /></PrivateRoute>} />
                        <Route path="/resume/:uid" element={<PublicResumePage />} />
                        
                        {/* New routes */}
                        <Route path="/jobs" element={<JobSearchPage />} />
                        <Route path="/jobs/:jobId" element={<JobDetailPage />} />
                        <Route path="/jobs/:jobId/apply" element={<JobApplicationForm />} />
                        <Route path="/applications" element={<JobApplicationDashboard />} />
                        <Route path="/applications/:applicationId/success" element={<ApplicationSuccessPage />} />
                        <Route path="/availability" element={<PrivateRoute><AvailabilityCalendar /></PrivateRoute>} />
                        <Route path="/availability/:userId" element={<AvailabilityCalendar readOnly={true} />} />
                        <Route path="/gantt/:projectId" element={<div>Gantt Chart Page (Coming Soon)</div>} />
                        
                        {/* Analytics routes */}
                        <Route path="/analytics" element={<PrivateRoute><AnalyticsDashboard /></PrivateRoute>} />
                        <Route path="/analytics/project/:projectId" element={<PrivateRoute><ProjectAnalytics /></PrivateRoute>} />
                        
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/post-job" element={<PostJobPage />} />
                        <Route path="/my-projects" element={<MyProjectsPage />} />
                        <Route path="/chat-test" element={<ChatTestPage />} />
                    </Routes>
                </AnimatePresence>
            </main>
            <PerformanceMonitor />
        </>
    );
};

const RootWithRouter = () => (
    <Router>
        <AuthProvider>
            <App />
        </AuthProvider>
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
    console.error('Root element not found');
}
