// src/index.tsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";

// Component imports
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';  // Import PrivateRoute
import AddProject from './components/AddProject';
import Home from './components/Home';
import ProjectDetail from './components/ProjectDetail';

const CrewSearch = () => <h2>Crew Search (Protected)</h2>;

interface AppProps {}

const App: React.FC<AppProps> = () => {
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
        }
    }, []);

    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log("Sign out successful")
        }).catch(error => console.log(error))
    }

  return (
    <Router>
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {!authUser ? (
                        <>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/register">Register</Link>
                            </li>
                        </>
                    ) : (
                        <>
                        <li>
                            <Link to="/projects/add">Add Project</Link>
                        </li>
                        <li>
                            <Link to="/crew">Crew Search</Link>
                        </li>
                        <li>
                            <button onClick={userSignOut}>Sign Out</button>
                        </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>

        <div className="container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/projects/:projectId" element={<ProjectDetail />} />
                <Route path="/projects/add" element={<PrivateRoute><AddProject /></PrivateRoute>} />
                <Route path="/crew" element={<PrivateRoute><CrewSearch /></PrivateRoute>} />
            </Routes>
        </div>
    </Router>
  );
}

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