import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import '../styles/LandingPage.scss';
const LandingPage = () => {
    return (_jsxs("div", { className: "landing-page", children: [_jsx("h1", { children: "Welcome to Who's On Set!" }), _jsx("p", { children: "Find and connect with film professionals." }), _jsxs("div", { className: "auth-links", children: [_jsx(Link, { to: "/login", className: "login-link", children: "Login" }), _jsx(Link, { to: "/register", className: "register-link", children: "Register" })] })] }));
};
export default LandingPage;
