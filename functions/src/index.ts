import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { EmailService } from "./emailService";

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

// Simple email test function with CORS - This now actually sends emails
export const simpleEmailTest = onRequest({
  cors: true,
  invoker: 'public'
}, async (req, res) => {
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

    // Create email template
    const emailTemplate = {
      subject: subject || `New message from ${senderName || 'My Film Jobs'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Email Test</h2>
          <p>Hello,</p>
          <p>This is a test email from <strong>${senderName || 'My Film Jobs'}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Message:</h3>
            <p>${message}</p>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Best regards,<br>
            The My Film Jobs Team
          </p>
        </div>
      `,
      text: `
Email Test

Hello,

This is a test email from ${senderName || 'My Film Jobs'}.

Message:
${message}

Best regards,
The My Film Jobs Team
      `
    };

    // Send the email using EmailService
    const success = await EmailService.sendEmail({
      to,
      template: emailTemplate,
      data: {
        senderName: senderName || 'My Film Jobs',
        message
      }
    });

    if (success) {
      res.json({ 
        success: true, 
        message: 'Email sent successfully!',
        data: { to, subject, message, senderName },
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Failed to send email. Please check the logs for details.' 
      });
    }
  } catch (error) {
    console.error('Simple email test error:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});
