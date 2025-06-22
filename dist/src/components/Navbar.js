import { jsx as _jsx } from "react/jsx-runtime";
import { Link } from 'react-router-dom'; // Only for React Router
_jsx("li", { children: _jsx(Link, { to: "/projects", className: "hover:text-blue-600", children: "All Projects" }) });
