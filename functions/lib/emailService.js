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
exports.EmailService = void 0;
const nodemailer = __importStar(require("nodemailer"));
const handlebars = __importStar(require("handlebars"));
class EmailService {
    static initialize() {
        if (this.isInitialized)
            return;
        // Initialize Nodemailer with Gmail SMTP
        const smtpConfig = {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASS || ''
            }
        };
        console.log('[EmailService] SMTP transport configured');
        this.transporter = nodemailer.createTransport(smtpConfig);
        this.isInitialized = true;
    }
    static async sendEmail(emailData) {
        try {
            this.initialize();
            const { to, template, data } = emailData;
            // Compile template with data
            const compiledSubject = handlebars.compile(template.subject);
            const compiledHtml = handlebars.compile(template.html);
            const compiledText = handlebars.compile(template.text);
            const subject = compiledSubject(data || {});
            const html = compiledHtml(data || {});
            const text = compiledText(data || {});
            // Get from email from environment variables
            const fromEmailValue = process.env.EMAIL_FROM || 'iam@myfilmjobs.com';
            // Create a professional display name for the from field
            const fromDisplayName = 'My Film Jobs';
            const fromWithDisplayName = `${fromDisplayName} <${fromEmailValue}>`;
            // Send email using Nodemailer (Gmail SMTP)
            await this.transporter.sendMail({
                from: fromWithDisplayName,
                to,
                subject,
                html,
                text
            });
            console.log('[EmailService] Email sent successfully');
            return true;
        }
        catch (error) {
            console.error('[EmailService] Error sending email:', error);
            return false;
        }
    }
    // Template generators for different notification types
    static getJobApplicationTemplate(applicantName, jobTitle, companyName) {
        return {
            subject: 'New Job Application - {{jobTitle}}',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Job Application</h2>
          <p>Hello,</p>
          <p>You have received a new job application for the position of <strong>{{jobTitle}}</strong> at <strong>{{companyName}}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Application Details:</h3>
            <p><strong>Applicant:</strong> {{applicantName}}</p>
            <p><strong>Position:</strong> {{jobTitle}}</p>
            <p><strong>Company:</strong> {{companyName}}</p>
          </div>
          <p>Please log in to your My Film Jobs dashboard to review this application.</p>
          <a href="{{dashboardUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Application</a>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Best regards,<br>
            The My Film Jobs Team
          </p>
        </div>
      `,
            text: `
New Job Application

Hello,

You have received a new job application for the position of {{jobTitle}} at {{companyName}}.

Application Details:
- Applicant: {{applicantName}}
- Position: {{jobTitle}}
- Company: {{companyName}}

Please log in to your My Film Jobs dashboard to review this application: {{dashboardUrl}}

Best regards,
The My Film Jobs Team
      `
        };
    }
    static getProjectInvitationTemplate(projectName, inviterName, role) {
        return {
            subject: 'Project Invitation - {{projectName}}',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Project Invitation</h2>
          <p>Hello,</p>
          <p><strong>{{inviterName}}</strong> has invited you to join the project <strong>{{projectName}}</strong> as a <strong>{{role}}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Project Details:</h3>
            <p><strong>Project:</strong> {{projectName}}</p>
            <p><strong>Role:</strong> {{role}}</p>
            <p><strong>Invited by:</strong> {{inviterName}}</p>
          </div>
          <p>Click the button below to accept or decline this invitation:</p>
          <div style="margin: 20px 0;">
            <a href="{{acceptUrl}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">Accept Invitation</a>
            <a href="{{declineUrl}}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Decline</a>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Best regards,<br>
            The My Film Jobs Team
          </p>
        </div>
      `,
            text: `
Project Invitation

Hello,

{{inviterName}} has invited you to join the project {{projectName}} as a {{role}}.

Project Details:
- Project: {{projectName}}
- Role: {{role}}
- Invited by: {{inviterName}}

To accept or decline this invitation, please visit your dashboard: {{dashboardUrl}}

Best regards,
The My Film Jobs Team
      `
        };
    }
    static getTaskAssignmentTemplate(taskTitle, projectName, assignerName, dueDate) {
        return {
            subject: 'New Task Assignment - {{taskTitle}}',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Task Assignment</h2>
          <p>Hello,</p>
          <p><strong>{{assignerName}}</strong> has assigned you a new task in the project <strong>{{projectName}}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Task Details:</h3>
            <p><strong>Task:</strong> {{taskTitle}}</p>
            <p><strong>Project:</strong> {{projectName}}</p>
            <p><strong>Assigned by:</strong> {{assignerName}}</p>
            {{#if dueDate}}
            <p><strong>Due Date:</strong> {{dueDate}}</p>
            {{/if}}
          </div>
          <p>Please log in to your My Film Jobs dashboard to view and work on this task.</p>
          <a href="{{dashboardUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Task</a>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Best regards,<br>
            The My Film Jobs Team
          </p>
        </div>
      `,
            text: `
New Task Assignment

Hello,

{{assignerName}} has assigned you a new task in the project {{projectName}}.

Task Details:
- Task: {{taskTitle}}
- Project: {{projectName}}
- Assigned by: {{assignerName}}
{{#if dueDate}}
- Due Date: {{dueDate}}
{{/if}}

Please log in to your My Film Jobs dashboard to view and work on this task: {{dashboardUrl}}

Best regards,
The My Film Jobs Team
      `
        };
    }
    static getMessageNotificationTemplate(senderName, messagePreview) {
        return {
            subject: 'New Message from {{senderName}}',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Message</h2>
          <p>Hello,</p>
          <p>You have received a new message from <strong>{{senderName}}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Message Preview:</h3>
            <p style="font-style: italic;">"{{messagePreview}}"</p>
          </div>
          <p>Click the button below to view and respond to this message:</p>
          <a href="{{messageUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Message</a>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Best regards,<br>
            The My Film Jobs Team
          </p>
        </div>
      `,
            text: `
New Message

Hello,

You have received a new message from {{senderName}}.

Message Preview:
"{{messagePreview}}"

Click the link below to view and respond to this message: {{messageUrl}}

Best regards,
The My Film Jobs Team
      `
        };
    }
    static getFollowRequestTemplate(requesterName) {
        return {
            subject: 'New Follow Request from {{requesterName}}',
            html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Follow Request</h2>
        <p>Hello,</p>
        <p><strong>{{requesterName}}</strong> has sent you a follow request on My Film Jobs.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>What this means:</h3>
          <p>Accepting this request will allow you to message each other and collaborate on projects.</p>
        </div>
        <p>Click the button below to manage this request:</p>
        <a href="{{followRequestsUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Manage Follow Request</a>
        <p>Or copy and paste this link into your browser:<br>
        <a href="{{followRequestsUrl}}" style="color: #2563eb; word-break: break-all;">{{followRequestsUrl}}</a></p>
      </div>`,
            text: `
New Follow Request

Hello,

{{requesterName}} has sent you a follow request on My Film Jobs.

What this means:
Accepting this request will allow you to message each other and collaborate on projects.

Click the link below to manage this request: {{followRequestsUrl}}

Best regards,
The My Film Jobs Team
      `
        };
    }
    static getProjectUpdateTemplate(projectName, updateType, updaterName) {
        return {
            subject: 'Project Update - {{projectName}}',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Project Update</h2>
          <p>Hello,</p>
          <p><strong>{{updaterName}}</strong> has made an update to the project <strong>{{projectName}}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Update Details:</h3>
            <p><strong>Project:</strong> {{projectName}}</p>
            <p><strong>Update Type:</strong> {{updateType}}</p>
            <p><strong>Updated by:</strong> {{updaterName}}</p>
            <p><strong>Date:</strong> {{updateDate}}</p>
          </div>
          <p>Click the button below to view the updated project:</p>
          <a href="{{projectUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Project</a>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Best regards,<br>
            The My Film Jobs Team
          </p>
        </div>
      `,
            text: `
Project Update

Hello,

{{updaterName}} has made an update to the project {{projectName}}.

Update Details:
- Project: {{projectName}}
- Update Type: {{updateType}}
- Updated by: {{updaterName}}
- Date: {{updateDate}}

Click the link below to view the updated project: {{projectUrl}}

Best regards,
The My Film Jobs Team
      `
        };
    }
}
exports.EmailService = EmailService;
EmailService.isInitialized = false;
//# sourceMappingURL=emailService.js.map