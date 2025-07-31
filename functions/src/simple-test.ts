import { onRequest } from 'firebase-functions/v2/https';

export const simpleTest = onRequest((req, res) => {
  res.json({
    success: true,
    message: 'Simple test function working!',
    timestamp: new Date().toISOString()
  });
}); 