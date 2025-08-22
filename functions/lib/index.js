"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyNewMessage = exports.notifyFollowRequest = exports.emailSend = exports.testUserData = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const params_1 = require("firebase-functions/params");
const emailService_1 = require("./emailService");
// Helper function to get user data from either users or crewProfiles
async function getUserData(userId) {
    var _a, _b;
    try {
        // Try users collection first
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        if (userDoc.exists) {
            return Object.assign(Object.assign({}, userDoc.data()), { email: ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.email) || null, collection: 'users' });
        }
        // If not found, try crewProfiles
        const crewDoc = await admin.firestore().collection('crewProfiles').doc(userId).get();
        if (crewDoc.exists) {
            return Object.assign(Object.assign({}, crewDoc.data()), { email: ((_b = crewDoc.data()) === null || _b === void 0 ? void 0 : _b.email) || null, collection: 'crewProfiles' });
        }
        return null;
    }
    catch (error) {
        console.error(`[getUserData] Error fetching user ${userId}:`, error);
        return null;
    }
}
// Define secrets for environment variables
const sendgridApiKey = (0, params_1.defineSecret)('SENDGRID_API_KEY');
const smtpUser = (0, params_1.defineSecret)('SMTP_USER');
const smtpPass = (0, params_1.defineSecret)('SMTP_PASS');
const emailFrom = (0, params_1.defineSecret)('EMAIL_FROM');
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
exports.testUserData = (0, https_1.onRequest)(async (req, res) => {
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
        const users = [];
        // Process users from users collection
        usersSnapshot.forEach((doc) => {
            users.push(Object.assign({ id: doc.id, collection: 'users' }, doc.data()));
        });
        // Process users from crewProfiles collection
        crewSnapshot.forEach((doc) => {
            // Only add if not already in the users array
            if (!users.some(u => u.email === doc.data().email)) {
                users.push(Object.assign({ id: doc.id, collection: 'crewProfiles' }, doc.data()));
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
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({
            error: 'Failed to fetch user data',
            details: error instanceof Error ? error.message : String(error)
        });
    }
});
// Main email sending function - Production ready
exports.emailSend = (0, https_1.onRequest)({
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
        }
        catch (error) {
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
        const success = await emailService_1.EmailService.sendEmail({
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
        }
        else {
            const errorMsg = 'Failed to send email. Please check the logs for details.';
            console.error(`[emailSend] ${errorMsg}`, { to, subject });
            res.status(500).json({
                success: false,
                error: errorMsg
            });
        }
    }
    catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        });
    }
});
// Trigger function for follow request notifications
exports.notifyFollowRequest = (0, firestore_1.onDocumentCreated)({
    document: 'followRequests/{requestId}',
    region: 'us-central1',
    secrets: [sendgridApiKey, smtpUser, smtpPass, emailFrom]
}, async (event) => {
    var _a;
    try {
        // Set environment variables from secrets
        process.env.SENDGRID_API_KEY = sendgridApiKey.value();
        process.env.SMTP_USER = smtpUser.value();
        process.env.SMTP_PASS = smtpPass.value();
        process.env.EMAIL_FROM = emailFrom.value();
        const requestData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
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
        const emailTemplate = emailService_1.EmailService.getFollowRequestTemplate(fromUserName);
        const success = await emailService_1.EmailService.sendEmail({
            to: recipientEmail,
            template: emailTemplate,
            data: {
                requesterName: fromUserName,
                recipientEmail
            }
        });
        if (success) {
            console.log('[notifyFollowRequest] Email sent successfully to:', recipientEmail);
        }
        else {
            console.error('[notifyFollowRequest] Failed to send email to:', recipientEmail);
        }
    }
    catch (error) {
        console.error('[notifyFollowRequest] Error:', error);
    }
});
// Trigger function for message notifications
exports.notifyNewMessage = (0, firestore_1.onDocumentCreated)({
    document: 'conversations/{conversationId}/messages/{messageId}',
    region: 'us-central1',
    secrets: [sendgridApiKey, smtpUser, smtpPass, emailFrom]
}, async (event) => {
    var _a;
    try {
        // Set environment variables from secrets
        process.env.SENDGRID_API_KEY = sendgridApiKey.value();
        process.env.SMTP_USER = smtpUser.value();
        process.env.SMTP_PASS = smtpPass.value();
        process.env.EMAIL_FROM = emailFrom.value();
        const messageData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
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
        const senderName = (senderData === null || senderData === void 0 ? void 0 : senderData.name) || (senderData === null || senderData === void 0 ? void 0 : senderData.displayName) || 'Unknown User';
        // Send email notification
        const messagePreview = content.length > 50 ? content.substring(0, 50) + '...' : content;
        const emailTemplate = emailService_1.EmailService.getMessageNotificationTemplate(senderName, messagePreview);
        const success = await emailService_1.EmailService.sendEmail({
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
        }
        else {
            console.error('[notifyNewMessage] Failed to send email to:', recipientEmail);
        }
    }
    catch (error) {
        console.error('[notifyNewMessage] Error:', error);
    }
});
//# sourceMappingURL=index.js.map