import { onRequest } from "firebase-functions/v2/https";

// Fresh simple test function with CORS
export const freshTest = onRequest(async (req, res) => {
  // CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  // Simple response
  res.json({ 
    success: true, 
    message: 'Fresh test function working with CORS',
    timestamp: new Date().toISOString(),
    data: req.body || {}
  });
}); 