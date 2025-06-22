import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth'; // Import useAuthState
import { auth } from '../firebase'; // Import Firebase auth
var PrivateRoute = function (_a) {
    var children = _a.children;
    var _b = useAuthState(auth), user = _b[0], loading = _b[1], error = _b[2];
    if (loading) {
        // You might want to render a loading spinner here
        return _jsx("p", { children: "Loading..." });
    }
    if (error) {
        // Handle the error appropriately
        console.error("PrivateRoute error:", error);
        return _jsxs("p", { children: ["Error: ", error.message] });
    }
    if (!user) {
        // Redirect to the login page if not authenticated
        return _jsx(Navigate, { to: "/login" });
    }
    // Render the children (the protected route) if authenticated
    return children;
};
export default PrivateRoute;
