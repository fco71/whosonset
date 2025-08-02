import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import * as sgMail from "@sendgrid/mail";

// Load environment variables for local development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

admin.initializeApp();

// Initialize SendGrid with API key from Firebase config or environment
const config = functions.config();
const sendGridApiKey = config.sendgrid?.api_key || process.env.SENDGRID_API_KEY;
if (sendGridApiKey) {
  sgMail.setApiKey(sendGridApiKey);
}

// CORS helper function
const setCorsHeaders = (res: any) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// Main sendEmail function
export const sendEmail = onRequest(async (req, res) => {
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

    if (!sendGridApiKey) {
      console.error('SendGrid API key not configured');
      res.status(500).json({ 
        error: 'Email service not configured. Please set SENDGRID_API_KEY in Firebase environment.' 
      });
      return;
    }

    // Prepare email message
    const msg = {
      to,
      from: {
        email: 'iam@myfilmjobs.com',
        name: 'My Film Jobs'
      },
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New message from ${senderName || 'My Film Jobs user'}</h2>
          <p style="color: #666; line-height: 1.6;">${message}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            This email was sent from My Film Jobs. Please do not reply to this email.
          </p>
        </div>
      `
    };

    // Send email via SendGrid
    await sgMail.send(msg);
    
    console.log('Email sent successfully to:', to);
    
    res.json({ 
      success: true, 
      message: 'Email sent successfully',
      data: { to, subject, senderName },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    
    // SendGrid specific error handling
    if (error.response) {
      console.error('SendGrid error body:', error.response.body);
      res.status(error.code || 500).json({ 
        error: 'Failed to send email',
        details: error.response.body.errors || error.message
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to send email',
        details: error.message || 'Unknown error occurred'
      });
    }
  }
});

// Email test function with CORS (for testing without actually sending)
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
