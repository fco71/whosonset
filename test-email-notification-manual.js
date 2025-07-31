#!/usr/bin/env node

/**
 * Manual Email Notification Test
 * 
 * This script manually triggers email notifications for testing
 * since Firebase Functions aren't deployed yet.
 */

import nodemailer from 'nodemailer';

// Configuration (same as in Firebase Functions)
const config = {
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'iam@myfilmjobs.com',
      pass: process.env.SMTP_PASSWORD || 'your-app-password-here'
    }
  },
  email: {
    from: 'iam@myfilmjobs.com'
  }
};

async function sendTestNotificationEmail() {
  console.log('🧪 Testing Email Notification System...\n');

  try {
    // Create transporter
    const transporter = nodemailer.createTransporter(config.smtp);
    
    // Verify connection
    console.log('📡 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test notification email
    console.log('📧 Sending test notification email...');
    const info = await transporter.sendMail({
      from: config.email.from,
      to: 'iam@myfilmjobs.com',
      subject: 'Test Notification - New Message Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">My Film Jobs</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">New Message Notification</p>
          </div>
          
          <div style="padding: 20px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hello Francisco,</h2>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">New Message</h3>
              <p style="margin: 0; color: #6b7280;">
                You have received a new message from <strong>Test User</strong>.
              </p>
            </div>

            <div style="padding: 15px; background: #f8fafc; border-left: 3px solid #2563eb; margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; font-weight: 500;">This is a test message to verify email notifications are working!</p>
              <small style="color: #6b7280;">Just now</small>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <a href="https://myfilmjobs.com/chat" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Message
              </a>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 8px; font-size: 14px; color: #6b7280;">
              <p style="margin: 0;">
                You're receiving this notification because you have email notifications enabled. 
                <a href="https://myfilmjobs.com/settings/notifications" style="color: #2563eb;">Manage your notification preferences</a>
              </p>
            </div>
          </div>
        </div>
      `,
      text: `My Film Jobs - New Message Notification

Hello Francisco,

You have received a new message from Test User.

Message: This is a test message to verify email notifications are working!

View message: https://myfilmjobs.com/chat

Manage notification preferences: https://myfilmjobs.com/settings/notifications

Best regards,
The My Film Jobs Team`
    });

    console.log('✅ Test notification email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Check your email inbox for the notification message.\n');

  } catch (error) {
    console.error('❌ Email notification test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your SMTP_PASSWORD environment variable');
    console.log('2. Verify your Gmail app password is correct');
    console.log('3. Make sure 2FA is enabled on your Google account');
  }
}

async function sendDailyDigestEmail() {
  console.log('📧 Testing Daily Digest Email...\n');

  try {
    const transporter = nodemailer.createTransporter(config.smtp);
    
    const info = await transporter.sendMail({
      from: config.email.from,
      to: 'iam@myfilmjobs.com',
      subject: 'My Film Jobs - Daily Digest (3 notifications)',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">My Film Jobs - Daily Digest</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your daily activity summary</p>
          </div>
          
          <div style="padding: 20px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hello Francisco,</h2>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">Summary</h3>
              <p style="margin: 0; color: #6b7280;">
                You have <strong>3</strong> new notifications today:
              </p>
              <ul style="margin: 10px 0 0 0; color: #6b7280;">
                <li>2 new messages</li>
                <li>1 job application</li>
              </ul>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #2563eb; margin-bottom: 10px;">New Messages</h3>
              <div style="padding: 10px; background: #f8fafc; border-left: 3px solid #2563eb; margin-bottom: 8px;">
                <p style="margin: 0 0 5px 0; font-weight: 500;">Test message 1</p>
                <small style="color: #6b7280;">10:30 AM</small>
              </div>
              <div style="padding: 10px; background: #f8fafc; border-left: 3px solid #2563eb; margin-bottom: 8px;">
                <p style="margin: 0 0 5px 0; font-weight: 500;">Test message 2</p>
                <small style="color: #6b7280;">11:45 AM</small>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #2563eb; margin-bottom: 10px;">Job Applications</h3>
              <div style="padding: 10px; background: #f8fafc; border-left: 3px solid #2563eb; margin-bottom: 8px;">
                <p style="margin: 0 0 5px 0; font-weight: 500;">New application for "Camera Operator"</p>
                <small style="color: #6b7280;">2:15 PM</small>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <a href="https://myfilmjobs.com" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View All Notifications
              </a>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 8px; font-size: 14px; color: #6b7280;">
              <p style="margin: 0;">
                You're receiving this digest because you have daily digest notifications enabled. 
                <a href="https://myfilmjobs.com/settings/notifications" style="color: #2563eb;">Manage your notification preferences</a>
              </p>
            </div>
          </div>
        </div>
      `,
      text: `My Film Jobs - Daily Digest

Hello Francisco,

You have 3 new notifications today:
- 2 new messages
- 1 job application

New Messages:
• Test message 1 (10:30 AM)
• Test message 2 (11:45 AM)

Job Applications:
• New application for "Camera Operator" (2:15 PM)

View all notifications: https://myfilmjobs.com

Manage notification preferences: https://myfilmjobs.com/settings/notifications

Best regards,
The My Film Jobs Team`
    });

    console.log('✅ Daily digest email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Check your email inbox for the daily digest.\n');

  } catch (error) {
    console.error('❌ Daily digest test failed:', error.message);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--notification')) {
    await sendTestNotificationEmail();
  } else if (args.includes('--digest')) {
    await sendDailyDigestEmail();
  } else {
    console.log('🚀 Email Notification Testing\n');
    console.log('Usage:');
    console.log('  node test-email-notification-manual.js --notification  # Test single notification');
    console.log('  node test-email-notification-manual.js --digest        # Test daily digest');
    console.log('');
    console.log('Examples:');
    console.log('  node test-email-notification-manual.js --notification');
    console.log('  node test-email-notification-manual.js --digest');
  }
}

// Run the script
main().catch(console.error); 