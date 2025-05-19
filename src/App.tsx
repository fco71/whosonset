import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import ProjectList from './components/ProjectList';
import RegisterForm from './components/RegisterForm';
import AllProjects from './components/AllProjects';

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
      <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
        {/* NAVBAR */}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              🎬 Who's On Set
            </h1>
            <div className="space-x-4">
              <Link to="/" className="text-blue-600 hover:underline">Home</Link>
              <Link to="/projects" className="text-blue-600 hover:underline">All Projects</Link>
            </div>
          </div>
        </nav>

        {/* ROUTES */}
        <main className="max-w-5xl mx-auto px-4 py-10">
          <Routes>
            <Route
              path="/"
              element={
                <div className="space-y-6">
                  {user ? (
                    <p className="text-green-700 font-medium">
                      ✅ Signed in as: {user.email}
                    </p>
                  ) : (
                    <p className="text-red-600 font-medium">
                      ❌ Not signed in
                    </p>
                  )}

                  <RegisterForm />

                  <section>
                    <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
                    <ProjectList projects={projects} />
                  </section>

                  <div className="mt-6">
                    <Link
                      to="/projects"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      View All Projects →
                    </Link>
                  </div>
                </div>
              }
            />
            <Route path="/projects" element={<AllProjects />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
