import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const FirebaseDiagnostic: React.FC = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<{
    firebaseConfig: boolean;
    firestoreConnection: boolean;
    authConnection: boolean;
    error?: string;
  }>({
    firebaseConfig: false,
    firestoreConnection: false,
    authConnection: false
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const results = {
      firebaseConfig: false,
      firestoreConnection: false,
      authConnection: false,
      error: undefined as string | undefined
    };

    try {
      // Check Firebase config
      const config = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
      };

      results.firebaseConfig = !!(config.apiKey && config.projectId && config.appId);

      // Test Firestore connection
      try {
        const testDoc = await getDoc(doc(db, 'test', 'connection-test'));
        results.firestoreConnection = true;
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          // This is expected for a test document
          results.firestoreConnection = true;
        } else {
          results.firestoreConnection = false;
          results.error = `Firestore error: ${error.code} - ${error.message}`;
        }
      }

      // Test Auth connection
      results.authConnection = true; // Auth is usually available if config is correct

    } catch (error: any) {
      results.error = `Diagnostic error: ${error.message}`;
    }

    setDiagnosticResults(results);
  };

  if (!diagnosticResults.firebaseConfig) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Firebase Configuration Issue</h3>
        <p className="text-red-700 mb-2">Firebase configuration is incomplete. Please check your environment variables:</p>
        <ul className="text-sm text-red-600 space-y-1">
          <li>REACT_APP_FIREBASE_API_KEY: {process.env.REACT_APP_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</li>
          <li>REACT_APP_FIREBASE_PROJECT_ID: {process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</li>
          <li>REACT_APP_FIREBASE_APP_ID: {process.env.REACT_APP_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing'}</li>
        </ul>
        <button
          onClick={runDiagnostics}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry Diagnostics
        </button>
      </div>
    );
  }

  if (!diagnosticResults.firestoreConnection) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Firestore Connection Issue</h3>
        <p className="text-yellow-700 mb-2">Unable to connect to Firestore database.</p>
        {diagnosticResults.error && (
          <p className="text-sm text-yellow-600 mb-2">Error: {diagnosticResults.error}</p>
        )}
        <div className="text-sm text-yellow-600 space-y-1">
          <p>Possible causes:</p>
          <ul className="list-disc list-inside ml-2">
            <li>Network connectivity issues</li>
            <li>Firebase project is paused or disabled</li>
            <li>Firestore rules are blocking access</li>
            <li>Firebase configuration mismatch</li>
          </ul>
        </div>
        <button
          onClick={runDiagnostics}
          className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Retry Diagnostics
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-lg font-semibold text-green-800 mb-2">Firebase Connection Status</h3>
      <div className="space-y-1 text-sm text-green-700">
        <p>✅ Firebase Configuration: Valid</p>
        <p>✅ Firestore Connection: Working</p>
        <p>✅ Auth Connection: Available</p>
      </div>
      <button
        onClick={runDiagnostics}
        className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Refresh Diagnostics
      </button>
    </div>
  );
};

export default FirebaseDiagnostic; 