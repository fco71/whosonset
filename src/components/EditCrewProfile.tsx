// src/components/EditCrewProfile.tsx
import React, { useState, useEffect } from 'react';

// Define the shape of your form data
interface FormData {
  name: string;
  role: string;
  location: string;
  skills: string;
  bio: string;
  avatarUrl: string; // Assuming you store the URL after upload
  resumeUrl: string; // Assuming you store the URL after upload
}

const EditCrewProfile: React.FC = () => {
  // Initialize form state with empty strings for all fields
  const [form, setForm] = useState<FormData>({
    name: '',
    role: '',
    location: '',
    skills: '',
    bio: '',
    avatarUrl: '', // Initial empty string
    resumeUrl: '', // Initial empty string
  });

  // This useEffect can be used to load existing profile data if you're editing
  // For example, if you pass a 'crewId' prop, you'd fetch data here.
  useEffect(() => {
    // Example: Fetch existing profile data if editing a specific user
    // In a real app, you might get an ID from URL params or props
    // const fetchProfileData = async () => {
    //   try {
    //     const response = await fetch('/api/crew/your_crew_id'); // Replace with your API endpoint
    //     const data = await response.json();
    //     setForm(data); // Set the fetched data to your form state
    //   } catch (error) {
    //     console.error('Error fetching profile data:', error);
    //   }
    // };
    // fetchProfileData();
  }, []); // Empty dependency array means this runs once on mount

  // Handles changes for all text, textarea, and select inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handles avatar image file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // In a real application, you would upload this file to a server
      // and update `form.avatarUrl` with the URL returned by the server.
      // For now, let's create a temporary URL for preview:
      setForm((prevForm) => ({
        ...prevForm,
        avatarUrl: URL.createObjectURL(file), // Creates a temporary URL for preview
      }));
      // console.log("Selected Avatar File:", file);
    }
  };

  // Handles resume PDF file selection
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // In a real application, you would upload this file to a server
      // and update `form.resumeUrl` with the URL returned by the server.
      // For now, let's create a temporary URL for preview:
      setForm((prevForm) => ({
        ...prevForm,
        resumeUrl: URL.createObjectURL(file), // Creates a temporary URL for preview
      }));
      // console.log("Selected Resume File:", file);
    }
  };

  // Handles the save button click
  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default button behavior (if inside a form)
    // Here you would typically send the 'form' data to your backend API
    console.log('Saving profile:', form);
    // Example API call:
    // fetch('/api/save-profile', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(form),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Profile saved successfully:', data);
    //   // Optionally, redirect or show a success message
    // })
    // .catch(error => {
    //   console.error('Error saving profile:', error);
    //   // Show an error message
    // });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-bold mb-4">Edit Crew Profile</h2>

        {/* Input fields */}
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded"
        />
        <input
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded"
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded"
        />
        <input
          name="skills"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={handleChange}
          className="w-full p-2 bg-gray-700 rounded"
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 bg-gray-700 rounded"
        />

        {/* Avatar Upload */}
        <div>
          <label className="block mb-1">Avatar Image:</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {form.avatarUrl && (
            <img src={form.avatarUrl} alt="avatar" className="mt-2 h-20 w-20 object-cover rounded-full" />
          )}
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block mb-1">Resume (PDF):</label>
          <input type="file" accept="application/pdf" onChange={handleResumeChange} />
          {form.resumeUrl && (
            <a
              href={form.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline mt-2 block"
            >
              View Uploaded Resume
            </a>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default EditCrewProfile;