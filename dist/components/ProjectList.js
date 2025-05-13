import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './ProjectList.module.css';
var ProjectList = function (_a) {
    var projects = _a.projects;
    return (_jsxs("div", { className: styles.container, children: [_jsx("h2", { className: styles.heading, children: "Movie Projects" }), _jsx("ul", { className: styles.list, children: projects.map(function (project) { return (_jsxs("li", { className: styles.listItem, children: [_jsx("h3", { children: project.project_name }), _jsx("p", { children: project.logline })] }, project.project_id)); }) })] }));
};
export default ProjectList;
