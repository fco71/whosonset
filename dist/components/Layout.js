import { jsx as _jsx } from "react/jsx-runtime";
import '../styles/Layout.scss';
var Layout = function (_a) {
    var children = _a.children;
    return (_jsx("div", { className: "layout", children: _jsx("div", { className: "content", children: children }) }));
};
export default Layout;
