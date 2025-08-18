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
exports.notifyNewMessage = exports.notifyFollowRequest = exports.emailSend = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const params_1 = require("firebase-functions/params");
const emailService_1 = require("./emailService");
// Define secrets for environment variables
const sendgridApiKey = (0, params_1.defineSecret)('SENDGRID_API_KEY');
const smtpUser = (0, params_1.defineSecret)('SMTP_USER');
const smtpPass = (0, params_1.defineSecret)('SMTP_PASS');
const emailFrom = (0, params_1.defineSecret)('EMAIL_FROM');
admin.initializeApp();
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
            res.json({
                success: true,
                message: 'Email sent successfully!',
                data: { to, subject, message, senderName },
                timestamp: new Date().toISOString()
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Failed to send email. Please check the logs for details.'
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
    var _a, _b;
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
        // Get recipient's email
        const recipientDoc = await admin.firestore().collection('users').doc(toUserId).get();
        if (!recipientDoc.exists) {
            console.log('[notifyFollowRequest] Recipient not found:', toUserId);
            return;
        }
        const recipientEmail = (_b = recipientDoc.data()) === null || _b === void 0 ? void 0 : _b.email;
        if (!recipientEmail) {
            console.log('[notifyFollowRequest] No email found for recipient:', toUserId);
            return;
        }
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
    var _a, _b, _c;
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
        // Get recipient's email
        const recipientDoc = await admin.firestore().collection('users').doc(receiverId).get();
        if (!recipientDoc.exists) {
            console.log('[notifyNewMessage] Recipient not found:', receiverId);
            return;
        }
        const recipientEmail = (_b = recipientDoc.data()) === null || _b === void 0 ? void 0 : _b.email;
        if (!recipientEmail) {
            console.log('[notifyNewMessage] No email found for recipient:', receiverId);
            return;
        }
        // Get sender's name
        const senderDoc = await admin.firestore().collection('users').doc(senderId).get();
        const senderName = senderDoc.exists ? ((_c = senderDoc.data()) === null || _c === void 0 ? void 0 : _c.displayName) || 'Unknown User' : 'Unknown User';
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