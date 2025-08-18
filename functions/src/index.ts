import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { EmailService } from "./emailService";

// Define secrets for environment variables
const sendgridApiKey = defineSecret('SENDGRID_API_KEY');
const smtpUser = defineSecret('SMTP_USER');
const smtpPass = defineSecret('SMTP_PASS');
const emailFrom = defineSecret('EMAIL_FROM');

admin.initializeApp();

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
    
    // Get recipient's email
    const recipientDoc = await admin.firestore().collection('users').doc(toUserId).get();
    if (!recipientDoc.exists) {
      console.log('[notifyFollowRequest] Recipient not found:', toUserId);
      return;
    }

    const recipientEmail = recipientDoc.data()?.email;
    if (!recipientEmail) {
      console.log('[notifyFollowRequest] No email found for recipient:', toUserId);
      return;
    }

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
    
    // Get recipient's email
    const recipientDoc = await admin.firestore().collection('users').doc(receiverId).get();
    if (!recipientDoc.exists) {
      console.log('[notifyNewMessage] Recipient not found:', receiverId);
      return;
    }

    const recipientEmail = recipientDoc.data()?.email;
    if (!recipientEmail) {
      console.log('[notifyNewMessage] No email found for recipient:', receiverId);
      return;
    }

    // Get sender's name
    const senderDoc = await admin.firestore().collection('users').doc(senderId).get();
    const senderName = senderDoc.exists ? senderDoc.data()?.displayName || 'Unknown User' : 'Unknown User';

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
