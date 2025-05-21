/*import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import styles from './App.module.css';
import ProjectList from './components/ProjectList';
import '../src/styles/globals.css';
var App = function (_a) {
    var name = _a.name;
    var projects = [
        { project_id: '1', project_name: 'Project A', logline: 'A thrilling adventure.' },
        { project_id: '2', project_name: 'Project B', logline: 'A heartwarming romance.' },
        { project_id: '3', project_name: 'Project C', logline: 'A hilarious comedy.' },
    ];
    return (_jsxs("div", { className: styles.container, children: [_jsxs("h1", { className: styles.heading, children: ["Hello, ", name, "!"] }), _jsx(ProjectList, { projects: projects })] }));
};
export default App;
