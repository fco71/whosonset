// src/components/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.scss';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to Who's On Set!</h1>
      <p>Find and connect with film professionals.</p>
      <div className="auth-links">
        <Link to="/login" className="login-link">Login</Link>
        <Link to="/register" className="register-link">Register</Link>
      </div>
    </div>
  );
};

export default LandingPage;