import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { EmailService } from "./emailService";

// Helper function to get user data from crewProfiles first, then users
async function getUserData(userId: string) {
  try {
    console.log(`[getUserData] Looking up user with ID: ${userId}`);
    
    // Try crewProfiles first since it's more likely to have the email
    const crewDoc = await admin.firestore().collection('crewProfiles').doc(userId).get();
    if (crewDoc.exists) {
      const crewData = crewDoc.data();
      console.log(`[getUserData] Found user in 'crewProfiles' collection`);
      
      // Check multiple possible locations for email
      const email = crewData?.email || 
                  crewData?.contactInfo?.email || 
                  crewData?.notificationPreferences?.email ||
                  null;
                  
      console.log(`[getUserData] Extracted email from crewProfiles: ${email}`);
      
      // Always update the users collection with the email from crewProfiles if found
      if (email) {
        console.log(`[getUserData] Updating users collection with email from crewProfiles`);
        try {
          await admin.firestore().collection('users').doc(userId).set(
            { 
              email, 
              contactInfo: { email },
              notificationPreferences: {
                emailNotifications: {
                  general: true,
                  projects: true,
                  chat: true,
                  jobs: true
                },
                inAppNotifications: {
                  general: true,
                  projects: true,
                  chat: true,
                  jobs: true
                },
                emailFrequency: {
                  jobs: 'daily',
                  general: 'daily',
                  projects: 'daily',
                  chat: 'daily'
                }
              }
            },
            { merge: true }
          );
          console.log(`[getUserData] Successfully updated users collection with email`);
        } catch (updateError) {
          console.error('[getUserData] Error updating users collection:', updateError);
        }
      }
      
      return { 
        ...crewData,
        email,
        collection: 'crewProfiles'
      };
    }
    
    // If not found in crewProfiles, try users collection
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log(`[getUserData] Found user in 'users' collection`);
      
      // Check multiple possible locations for email
      const email = userData?.email || 
                   userData?.contactInfo?.email || 
                   userData?.notificationPreferences?.email ||
                   null;
                   
      console.log(`[getUserData] Extracted email from users collection: ${email}`);
      
      // If email notifications are explicitly disabled, return null for email
      if (userData?.notificationPreferences?.emailNotifications?.general === false) {
        console.log(`[getUserData] Email notifications are disabled for user: ${userId}`);
        return {
          ...userData,
          email: null,
          collection: 'users'
        };
      }
      
      return { 
        ...userData,
        email,
        collection: 'users'
      };
    }

    console.log(`[getUserData] No user found with ID: ${userId} in either collection`);
    return null;
  } catch (error) {
    console.error(`[getUserData] Error fetching user ${userId}:`, error);
    return null;
  }
}
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

// Define secrets for environment variables
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
// Test endpoint to manually trigger a follow request notification
export const testFollowRequestNotification = onRequest(async (req, res) => {
  try {
    // This is a test function, so we'll use a mock document
    const followRequestData = {
      toUserId: 'ozfTOauw44ZAI9FvCBkcpvAr5sy2', // Replace with actual user ID for testing
      fromUserId: 'MrLprkr8VVhkDU1h87sE6EUdxfr1',
      fromUserName: 'Test User',
      status: 'pending'
    };

    // Instead of calling notifyFollowRequest directly, we'll create a document in Firestore
    const db = admin.firestore();
    const followRequestRef = db.collection('followRequests').doc('test-request-' + Date.now());
    
    await followRequestRef.set({
      toUserId: followRequestData.toUserId,
      fromUserId: followRequestData.fromUserId,
      fromUserName: followRequestData.fromUserName,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ 
      success: true, 
      message: 'Follow request created successfully. Notification should be sent shortly.'
    });
  } catch (error: unknown) {
    console.error('Error in testFollowRequestNotification:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
      success: false, 
      error: errorMessage
    });
  }
});

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
  secrets: [smtpUser, smtpPass, emailFrom]
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
  secrets: [smtpUser, smtpPass, emailFrom]
}, async (event) => {
  try {
    // Set environment variables from secrets
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
        recipientEmail,
        followRequestsUrl: 'https://myfilmjobs.com/social?tab=requests'
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
  secrets: [smtpUser, smtpPass, emailFrom]
}, async (event) => {
  try {
    // Set environment variables from secrets
    process.env.SMTP_USER = smtpUser.value();
    process.env.SMTP_PASS = smtpPass.value();
    process.env.EMAIL_FROM = emailFrom.value();

    const messageData = event.data?.data();
    if (!messageData) {
      console.log('[notifyNewMessage] No message data found');
      return;
    }

    const { senderId, receiverId, content } = messageData;

    // Get conversation ID from event params
    const conversationId = event.params.conversationId;

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
        recipientEmail,
        messageUrl: `https://myfilmjobs.com/messages?conversation=${conversationId}`
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
