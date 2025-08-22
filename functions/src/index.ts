import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { EmailService } from "./emailService";

// Helper function to get user data from either users or crewProfiles
async function getUserData(userId: string) {
  try {
    // Try users collection first
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    if (userDoc.exists) {
      return { 
        ...userDoc.data(),
        email: userDoc.data()?.email || null,
        collection: 'users'
      };
    }

    // If not found, try crewProfiles
    const crewDoc = await admin.firestore().collection('crewProfiles').doc(userId).get();
    if (crewDoc.exists) {
      return { 
        ...crewDoc.data(),
        email: crewDoc.data()?.email || null,
        collection: 'crewProfiles'
      };
    }

    return null;
  } catch (error) {
    console.error(`[getUserData] Error fetching user ${userId}:`, error);
    return null;
  }
}
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

// Define secrets for environment variables
const sendgridApiKey = defineSecret('SENDGRID_API_KEY');
const smtpUser = defineSecret('SMTP_USER');
const smtpPass = defineSecret('SMTP_PASS');
const emailFrom = defineSecret('EMAIL_FROM');

// Initialize Firebase Admin SDK with explicit configuration
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
  storageBucket: `${process.env.GCLOUD_PROJECT}.appspot.com`
});

// Set the database rules to allow Admin SDK to bypass security rules
const db = admin.firestore();
db.settings({
  ignoreUndefinedProperties: true
});

// Test function to check user data
export const testUserData = onRequest(async (req, res) => {
  try {
    const emails = ['iam@myfilmjobs.com', 'franciscovaldez@yahoo.com'];
    
    // Check users collection
    const usersSnapshot = await db.collection('users')
      .where('email', 'in', emails)
      .get();
    
    // Check crewProfiles collection
    const crewSnapshot = await db.collection('crewProfiles')
      .where('email', 'in', emails)
      .get();
    
    const users: any[] = [];
    
    // Process users from users collection
    usersSnapshot.forEach((doc: QueryDocumentSnapshot) => {
      users.push({
        id: doc.id,
        collection: 'users',
        ...doc.data()
      });
    });
    
    // Process users from crewProfiles collection
    crewSnapshot.forEach((doc: QueryDocumentSnapshot) => {
      // Only add if not already in the users array
      if (!users.some(u => u.email === doc.data().email)) {
        users.push({
          id: doc.id,
          collection: 'crewProfiles',
          ...doc.data()
        });
      }
    });
    
    if (users.length === 0) {
      res.status(404).json({ 
        error: 'No users found with the specified emails in either users or crewProfiles collections',
        checkedCollections: ['users', 'crewProfiles'],
        searchedEmails: emails
      });
      return;
    }

    res.json({ 
      users,
      message: `Found ${users.length} user(s) across all collections`
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user data',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Main email sending function - Production ready
export const emailSend = onRequest({
  cors: true,
  invoker: 'public',
  region: 'us-central1',
  secrets: [sendgridApiKey, smtpUser, smtpPass, emailFrom]
}, async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
      return;
    }

    // Verify the token
    const idToken = authHeader.split('Bearer ')[1];
    try {
      await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }

    const { to, subject, message, senderName } = req.body;
    
    if (!to || !subject || !message) {
      res.status(400).json({ 
        error: 'Missing required fields: to, subject, message' 
      });
      return;
    }

    // Set environment variables from secrets
    process.env.SENDGRID_API_KEY = sendgridApiKey.value();
    process.env.SMTP_USER = smtpUser.value();
    process.env.SMTP_PASS = smtpPass.value();
    process.env.EMAIL_FROM = emailFrom.value();

    // Create email template
    const emailTemplate = {
      subject: subject || `New message from ${senderName || 'My Film Jobs'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">My Film Jobs</h2>
          <p>Hello,</p>
          <p>You have received a new message from <strong>${senderName || 'My Film Jobs'}</strong>.</p>
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
My Film Jobs

Hello,

You have received a new message from ${senderName || 'My Film Jobs'}.

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
      console.log(`[emailSend] Email sent successfully to ${to}`);
      res.json({ 
        success: true, 
        message: 'Email sent successfully!',
        data: { 
          to, 
          subject, 
          message: message ? 'Message content redacted for security' : undefined,
          senderName 
        },
        timestamp: new Date().toISOString()
      });
    } else {
      const errorMsg = 'Failed to send email. Please check the logs for details.';
      console.error(`[emailSend] ${errorMsg}`, { to, subject });
      res.status(500).json({ 
        success: false,
        error: errorMsg
      });
    }
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

// Trigger function for follow request notifications
export const notifyFollowRequest = onDocumentCreated({
  document: 'followRequests/{requestId}',
  region: 'us-central1',
  secrets: [sendgridApiKey, smtpUser, smtpPass, emailFrom]
}, async (event) => {
  try {
    // Set environment variables from secrets
    process.env.SENDGRID_API_KEY = sendgridApiKey.value();
    process.env.SMTP_USER = smtpUser.value();
    process.env.SMTP_PASS = smtpPass.value();
    process.env.EMAIL_FROM = emailFrom.value();

    const requestData = event.data?.data();
    if (!requestData) {
      console.log('[notifyFollowRequest] No request data found');
      return;
    }

    const { toUserId, fromUserName } = requestData;
    
    // Get recipient's data using helper function
    const recipientData = await getUserData(toUserId);
    if (!recipientData || !recipientData.email) {
      console.log(`[notifyFollowRequest] No email found for recipient: ${toUserId}`);
      return;
    }
    const recipientEmail = recipientData.email;

    // Send email notification
    const emailTemplate = EmailService.getFollowRequestTemplate(fromUserName);
    const success = await EmailService.sendEmail({
      to: recipientEmail,
      template: emailTemplate,
      data: {
        requesterName: fromUserName,
        recipientEmail
      }
    });

    if (success) {
      console.log('[notifyFollowRequest] Email sent successfully to:', recipientEmail);
    } else {
      console.error('[notifyFollowRequest] Failed to send email to:', recipientEmail);
    }
  } catch (error) {
    console.error('[notifyFollowRequest] Error:', error);
  }
});

// Trigger function for message notifications
export const notifyNewMessage = onDocumentCreated({
  document: 'conversations/{conversationId}/messages/{messageId}',
  region: 'us-central1',
  secrets: [sendgridApiKey, smtpUser, smtpPass, emailFrom]
}, async (event) => {
  try {
    // Set environment variables from secrets
    process.env.SENDGRID_API_KEY = sendgridApiKey.value();
    process.env.SMTP_USER = smtpUser.value();
    process.env.SMTP_PASS = smtpPass.value();
    process.env.EMAIL_FROM = emailFrom.value();

    const messageData = event.data?.data();
    if (!messageData) {
      console.log('[notifyNewMessage] No message data found');
      return;
    }

    const { senderId, receiverId, content } = messageData;
    
    // Get recipient's data using helper function
    const recipientData = await getUserData(receiverId);
    if (!recipientData || !recipientData.email) {
      console.log(`[notifyNewMessage] No email found for recipient: ${receiverId}`);
      return;
    }
    const recipientEmail = recipientData.email;

    // Get sender's data using helper function
    const senderData = await getUserData(senderId);
    const senderName = (senderData as any)?.name || (senderData as any)?.displayName || 'Unknown User';

    // Send email notification
    const messagePreview = content.length > 50 ? content.substring(0, 50) + '...' : content;
    const emailTemplate = EmailService.getMessageNotificationTemplate(senderName, messagePreview);
    const success = await EmailService.sendEmail({
      to: recipientEmail,
      template: emailTemplate,
      data: {
        senderName,
        messagePreview,
        recipientEmail
      }
    });

    if (success) {
      console.log('[notifyNewMessage] Email sent successfully to:', recipientEmail);
    } else {
      console.error('[notifyNewMessage] Failed to send email to:', recipientEmail);
    }
  } catch (error) {
    console.error('[notifyNewMessage] Error:', error);
  }
});
