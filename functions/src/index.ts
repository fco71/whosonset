import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

admin.initializeApp();

// CORS helper function
const setCorsHeaders = (res: any) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// Email test function with CORS
export const emailTest = onRequest(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.status(204).send('');
    return;
  }

  setCorsHeaders(res);
  
  try {
    const { to, subject, message, senderName } = req.body;
    
    if (!to || !subject || !message) {
      res.status(400).json({ 
        error: 'Missing required fields: to, subject, message' 
      });
      return;
    }

    res.json({ 
      success: true, 
      message: 'Email test endpoint working with CORS',
      data: { to, subject, message, senderName },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test email function with CORS
export const testEmail = onRequest(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.status(204).send('');
    return;
  }

  setCorsHeaders(res);
  
  try {
    const { to, subject, message, senderName } = req.body;
    
    if (!to || !subject || !message) {
      res.status(400).json({ 
        error: 'Missing required fields: to, subject, message' 
      });
      return;
    }

    res.json({ 
      success: true, 
      message: 'Test email endpoint working with CORS',
      data: { to, subject, message, senderName },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Simple email test function with CORS
export const simpleEmailTest = onRequest(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.status(204).send('');
    return;
  }

  setCorsHeaders(res);
  
  try {
    const { to, subject, message, senderName } = req.body;
    
    if (!to || !subject || !message) {
      res.status(400).json({ 
        error: 'Missing required fields: to, subject, message' 
      });
      return;
    }

    res.json({ 
      success: true, 
      message: 'Simple email test endpoint working with CORS',
      data: { to, subject, message, senderName },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Simple email test error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
