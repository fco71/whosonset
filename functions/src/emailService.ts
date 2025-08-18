import * as nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import * as handlebars from 'handlebars';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  template: EmailTemplate;
  data?: any;
}

export class EmailService {
  private static transporter: nodemailer.Transporter;
  private static sendGridApiKey: string;
  private static isInitialized = false;

  static initialize() {
    if (this.isInitialized) return;

    // Use environment variables for Firebase Functions v2
    this.sendGridApiKey = process.env.SENDGRID_API_KEY || '';
    console.log('[EmailService] SendGrid API key:', this.sendGridApiKey ? 'present' : 'missing');
    
    if (this.sendGridApiKey) {
      sgMail.setApiKey(this.sendGridApiKey);
    }

    // Initialize Nodemailer with environment variables
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    };

    console.log('[EmailService] SMTP Config:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      user: smtpConfig.auth.user,
      pass: smtpConfig.auth.pass ? 'present' : 'missing'
    });

    this.transporter = nodemailer.createTransport(smtpConfig);

    this.isInitialized = true;
  }

  static async sendEmail(emailData: EmailData): Promise<boolean> {
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
      console.log('[EmailService] From email value:', fromEmailValue);

      // Try SendGrid first, fallback to Nodemailer
      if (this.sendGridApiKey) {
        console.log('[EmailService] Using SendGrid');
        try {
          await sgMail.send({
            to,
            from: fromEmailValue,
            subject,
            html,
            text
          });
        } catch (sendGridError: any) {
          console.error('[EmailService] SendGrid error details:', {
            code: sendGridError.code,
            message: sendGridError.message,
            response: sendGridError.response?.body,
            errors: sendGridError.response?.body?.errors
          });
          throw sendGridError;
        }
      } else {
        console.log('[EmailService] Using Nodemailer');
        await this.transporter.sendMail({
          from: fromEmailValue,
          to,
          subject,
          html,
          text
        });
      }

      console.log(`[EmailService] Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      console.error('[EmailService] Error sending email:', error);
      return false;
    }
  }

  // Template generators for different notification types
  static getJobApplicationTemplate(applicantName: string, jobTitle: string, companyName: string): EmailTemplate {
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

  static getProjectInvitationTemplate(projectName: string, inviterName: string, role: string): EmailTemplate {
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

  static getTaskAssignmentTemplate(taskTitle: string, projectName: string, assignerName: string, dueDate?: string): EmailTemplate {
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

  static getMessageNotificationTemplate(senderName: string, messagePreview: string): EmailTemplate {
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

  static getFollowRequestTemplate(requesterName: string): EmailTemplate {
    return {
      subject: 'New Follow Request from {{requesterName}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Follow Request</h2>
          <p>Hello,</p>
          <p><strong>{{requesterName}}</strong> has sent you a follow request on My Film Jobs.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What this means:</h3>
            <p>When you accept this request, {{requesterName}} will be able to see your updates and you'll be able to see theirs.</p>
          </div>
          <p>Click the button below to manage this request:</p>
          <a href="{{followRequestsUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Follow Requests</a>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Best regards,<br>
            The My Film Jobs Team
          </p>
        </div>
      `,
      text: `
New Follow Request

Hello,

{{requesterName}} has sent you a follow request on My Film Jobs.

What this means:
When you accept this request, {{requesterName}} will be able to see your updates and you'll be able to see theirs.

Click the link below to manage this request: {{followRequestsUrl}}

Best regards,
The My Film Jobs Team
      `
    };
  }

  static getProjectUpdateTemplate(projectName: string, updateType: string, updaterName: string): EmailTemplate {
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