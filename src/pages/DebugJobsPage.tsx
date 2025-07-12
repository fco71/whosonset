import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

interface JobData {
  id: string;
  [key: string]: any; // Allow other job properties
  userData?: Record<string, unknown> | null;
  createdAt: any;
  updatedAt: any;
}

const DebugJobsPage = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collectionName, setCollectionName] = useState('jobPostings');
  const [collectionNames] = useState(['jobPostings', 'jobs']);
  const [jobCounts, setJobCounts] = useState<Record<string, number>>({});
  const auth = useAuth();
  
  // Check job counts in all collections
  const checkAllCollections = async () => {
    console.log('Checking all collections for jobs...');
    const counts: Record<string, number> = {};
    const db = getFirestore();
    
    for (const name of collectionNames) {
      try {
        const q = query(collection(db, name));
        const snapshot = await getDocs(q);
        counts[name] = snapshot.size;
        console.log(`Found ${snapshot.size} jobs in collection '${name}'`);
      } catch (err) {
        console.error(`Error checking collection '${name}':`, err);
        counts[name] = -1; // Indicate error
      }
    }
    
    setJobCounts(counts);
    return counts;
  };

  // Fetch jobs from the specified collection
  const fetchAllJobs = async (collectionToCheck = collectionName) => {
    try {
      setLoading(true);
      console.log(`Fetching all jobs from collection '${collectionToCheck}'...`);
      const db = getFirestore();
      const jobsRef = collection(db, collectionToCheck);
      const querySnapshot = await getDocs(jobsRef);
      
      console.log(`Found ${querySnapshot.size} jobs in collection '${collectionToCheck}'`);
      
      const jobsData = await Promise.all(querySnapshot.docs.map(async docSnapshot => {
        const data = docSnapshot.data();
        const jobData: JobData = {
          id: docSnapshot.id,
          ...data,
          // Convert Firestore timestamps to readable dates
          createdAt: data.createdAt?.toDate?.() || 'No date',
          updatedAt: data.updatedAt?.toDate?.() || 'No date',
          // Initialize userData as undefined (will be set if user data is available)
          userData: undefined
        };
        
        // Try to get user data if postedById exists
        if (data.postedById) {
          try {
            const userDoc = await getDoc(doc(db, 'users', data.postedById));
            if (userDoc.exists()) {
              // Explicitly type the user data
              const userData = userDoc.data() as Record<string, unknown>;
              jobData.userData = userData;
            }
          } catch (userErr) {
            console.log(`Could not fetch user data for ${data.postedById}:`, userErr);
          }
        }
        
        return jobData;
      }));
      
      setJobs(jobsData);
      console.log('Jobs data:', jobsData);
      setError(null);
    } catch (err) {
      const errorMessage = `Error fetching jobs from '${collectionToCheck}': ${err instanceof Error ? err.message : String(err)}`;
      console.error(errorMessage, err);
      setError(errorMessage);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      // First check all collections
      const counts = await checkAllCollections();
      
      // Then load jobs from the first non-empty collection
      const nonEmptyCollection = Object.entries(counts).find(([_, count]) => count > 0);
      if (nonEmptyCollection) {
        setCollectionName(nonEmptyCollection[0]);
        await fetchAllJobs(nonEmptyCollection[0]);
      } else {
        // If no jobs found, still try to load from default collection
        await fetchAllJobs();
      }
    };
    
    initialize();
  }, []);

  const handleRefresh = async () => {
    await checkAllCollections();
    await fetchAllJobs(collectionName);
  };
  
  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCollection = e.target.value;
    setCollectionName(newCollection);
    fetchAllJobs(newCollection);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Debug: Loading Job Data...</h1>
        <p>Checking collections: {JSON.stringify(collectionNames)}</p>
        <p>Please wait...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Debug: Job Postings</h1>
        <div>
          <Button onClick={handleRefresh} style={{ marginRight: '10px' }}>Refresh</Button>
          <select 
            value={collectionName} 
            onChange={handleCollectionChange}
            style={{ padding: '5px' }}
          >
            {collectionNames.map(name => (
              <option key={name} value={name}>
                {name} ({jobCounts[name] ?? '?'})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '15px', 
          borderRadius: '4px',
          marginBottom: '20px',
          borderLeft: '4px solid #c62828'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Collection Status:</h3>
        <ul>
          {collectionNames.map(name => (
            <li key={name}>
              <strong>{name}:</strong> {jobCounts[name] ?? '?'} jobs
              {name === collectionName && ' (current)'}
            </li>
          ))}
        </ul>
      </div>
      <p>Total jobs: {jobs.length}</p>
      
      <h2>All Jobs in 'jobPostings' collection:</h2>
      <div style={{ marginTop: '20px' }}>
        {jobs.length === 0 ? (
          <p>No jobs found in the database.</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {jobs.map((job) => (
              <div 
                key={job.id} 
                style={{
                  border: '1px solid #ccc',
                  padding: '15px',
                  borderRadius: '5px',
                  backgroundColor: job.status === 'published' ? '#f0fff0' : '#fff0f0'
                }}
              >
                <h3>{job.title || 'Untitled Job'}</h3>
                <p><strong>ID:</strong> {job.id}</p>
                <p><strong>Status:</strong> <span style={{ 
                  color: job.status === 'published' ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>{job.status || 'draft'}</span></p>
                <p><strong>Created:</strong> {job.createdAt?.toString() || 'N/A'}</p>
                <p><strong>Updated:</strong> {job.updatedAt?.toString() || 'N/A'}</p>
                <p><strong>Posted By:</strong> {job.postedById || 'N/A'}</p>
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f8f8', borderRadius: '4px' }}>
                  <pre>{JSON.stringify(job, null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugJobsPage;
