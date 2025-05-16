import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import ProjectList from './components/ProjectList';
import RegisterForm from './components/RegisterForm';

interface AppProps {
    name: string;
}

const App: React.FC<AppProps> = ({ name }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User signed in:', user);
                setUser(user);
            } else {
                console.log('No user signed in.');
                setUser(null);
            }
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const projects = [
        { project_id: '1', project_name: 'Project A', logline: 'A thrilling adventure.' },
        { project_id: '2', project_name: 'Project B', logline: 'A heartwarming romance.' },
        { project_id: '3', project_name: 'Project C', logline: 'A hilarious comedy.' },
    ];

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Hello, {name}!</h1>
            {user ? (
                <p className="mb-2 text-green-700">Signed in as: {user.email}</p>
            ) : (
                <p className="mb-2 text-red-600">Not signed in</p>
            )}
            <RegisterForm />
            <ProjectList projects={projects} />
        </div>
    );
};

export default App;
