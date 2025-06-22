import { jsx as _jsx } from "react/jsx-runtime";
import '../styles/Layout.scss';
const Layout = ({ children }) => {
    return (_jsx("div", { className: "layout", children: _jsx("div", { className: "content", children: children }) }));
};
export default Layout;
