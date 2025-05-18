import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import ProjectList from './components/ProjectList';
import RegisterForm from './components/RegisterForm';
import AllProjects from './pages/AllProjects'; // <- Ensure this path matches where your AllProjects.tsx file is

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

    return () => unsubscribe();
  }, []);

  const projects = [
    { project_id: '1', project_name: 'Project A', logline: 'A thrilling adventure.' },
    { project_id: '2', project_name: 'Project B', logline: 'A heartwarming romance.' },
    { project_id: '3', project_name: 'Project C', logline: 'A hilarious comedy.' },
  ];

  return (
    <BrowserRouter>
      <div className="bg-gray-100 min-h-screen">
        <nav className="bg-white shadow p-4 mb-4 flex justify-between">
          <span className="text-xl font-bold">Welcome, {name}</span>
          <div className="space-x-4">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link>
            <Link to="/projects" className="text-blue-600 hover:underline">All Projects</Link>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="flex flex-col items-center">
                {user ? (
                  <p className="mb-2 text-green-700">Signed in as: {user.email}</p>
                ) : (
                  <p className="mb-2 text-red-600">Not signed in</p>
                )}
                <RegisterForm />
                <ProjectList projects={projects} />
                <Link to="/projects" className="text-blue-600 underline mt-4 hover:text-blue-800">
                  View All Projects
                </Link>
              </div>
            }
          />
          <Route path="/projects" element={<AllProjects />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
