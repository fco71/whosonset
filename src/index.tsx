// src/index.tsx
import './styles/globals.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { auth } from './firebase';
// Combine imports from both files - KEEP ONLY ONE OF THESE LINES, BUT INCLUDE ALL NECESSARY FUNCTIONS
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import ProjectList from './components/ProjectList';
import RegisterForm from './components/RegisterForm';
import AllProjects from './components/AllProjects';

// Component imports
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import AddProject from './components/AddProject';
import Home from './components/Home';
import ProjectDetail from './components/ProjectDetail';

const CrewSearch = () => <h2>Crew Search (Protected)</h2>;

const App: React.FC = () => {
    // CODE FROM src/App.tsx STARTS HERE
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User signed in:', user);
                setUser(user);
            } else {
                console.log('No user signed in.');
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const projects = [
        { project_id: '1', project_name: 'Project A', logline: 'A thrilling adventure.' },
        { project_id: '2', project_name: 'Project B', logline: 'A heartwarming romance.' },
        { project_id: 3, project_name: 'Project C', logline: 'A hilarious comedy.' },
    ];
    // CODE FROM src/App.tsx ENDS HERE

    const [authUser, setAuthUser] = useState<any>(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });

        return () => {
            listen();
        };
    }, []);

    const userSignOut = () => {
        signOut(auth)
            .then(() => console.log("Sign out successful"))
            .catch(error => console.log(error));
    };

    return (
        <Router>
            <header>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/projects">All Projects</Link></li>
                        {!authUser ? (
                            <>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/projects/add">Add Project</Link></li>
                                <li><Link to="/crew">Crew Search</Link></li>
                                <li><button onClick={userSignOut}>Sign Out</button></li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            <div className="container grid grid-cols-1 md:grid-cols-2 gap-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<AllProjects />} />
                    <Route path="/projects/:projectId" element={<ProjectDetail />} />
                    <Route path="/projects/add" element={<PrivateRoute><AddProject /></PrivateRoute>} />
                    <Route path="/crew" element={<PrivateRoute><CrewSearch /></PrivateRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
};

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Could not find root element!");
}