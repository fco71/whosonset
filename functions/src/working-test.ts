import { onRequest } from "firebase-functions/v2/https";

export const workingTest = onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  res.json({ 
    message: "Working test function", 
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}); 