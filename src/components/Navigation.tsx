// src/components/Navigation.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.scss';

interface NavigationProps {
    authUser: any;
    userSignOut: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ authUser, userSignOut }) => {
    return (
        <nav className="navigation">
            <ul className="navigation-list">
                <li className="navigation-item">
                    <Link to="/" className="navigation-link">Home</Link>
                </li>
                <li className="navigation-item">
                    <Link to="/projects" className="navigation-link">Projects</Link>
                </li>
                {authUser && (
                    <li className="navigation-item">
                        <Link to="/crew" className="navigation-link">Crew</Link>
                    </li>
                )}
                {!authUser ? (
                    <>
                        <li className="navigation-item">
                            <Link to="/login" className="navigation-link">Login</Link>
                        </li>
                        <li className="navigation-item">
                            <Link to="/register" className="navigation-link">Register</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="navigation-item">
                            <Link to="/projects/add" className="navigation-link">Add Project</Link>
                        </li>
                        <li className="navigation-item">
                            <button onClick={userSignOut} className="navigation-button">Sign Out</button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navigation;