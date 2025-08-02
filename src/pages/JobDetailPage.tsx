import React from 'react';
import { useParams } from 'react-router-dom';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Job Details</h1>
      <p>Job ID: {id}</p>
      {/* Job details will be fetched and displayed here */}
    </div>
  );
};

export default JobDetailPage;
