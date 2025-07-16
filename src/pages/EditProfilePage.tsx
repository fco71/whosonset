import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const EditProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      {/* Profile edit form will go here */}
      <p>Welcome, {currentUser?.email}. This is your profile editing page.</p>
    </div>
  );
};

export default EditProfilePage;
