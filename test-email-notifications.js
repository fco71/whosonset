#!/usr/bin/env node

/**
 * Email Notification Testing Script
 * 
 * This script helps test email notifications without deploying Firebase Functions.
 * It tests the local email configuration and provides guidance for testing.
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

async function testEmailSending() {
  console.log('🧪 Testing Email Configuration...\n');

  try {
    // Create transporter
    const transporter = nodemailer.createTransporter(config.smtp);
    
    // Verify connection
    console.log('📡 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: config.email.from,
      to: 'iam@myfilmjobs.com',
      subject: 'Test Email from My Film Jobs',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Test Email</h2>
          <p>This is a test email to verify the email notification system is working.</p>
          <p>If you receive this email, the SMTP configuration is correct!</p>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Best regards,<br>
            The My Film Jobs Team
          </p>
        </div>
      `,
      text: `Test Email\n\nThis is a test email to verify the email notification system is working.\n\nBest regards,\nThe My Film Jobs Team`
    });

    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Check your email inbox for the test message.\n');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your SMTP_PASSWORD environment variable');
    console.log('2. Verify your Gmail app password is correct');
    console.log('3. Make sure 2FA is enabled on your Google account');
    console.log('4. Check that "Less secure app access" is disabled');
  }
}

async function testNotificationFlow() {
  console.log('\n🔔 Testing Notification Flow...\n');
  
  console.log('📋 Steps to test notifications:');
  console.log('1. Deploy Firebase Functions:');
  console.log('   firebase deploy --only functions');
  console.log('');
  console.log('2. Test email sending:');
  console.log('   curl -X POST https://us-central1-my-film-jobs.cloudfunctions.net/testEmail \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"to":"iam@myfilmjobs.com","subject":"Test","message":"Hello from My Film Jobs"}\'');
  console.log('');
  console.log('3. Test notification creation:');
  console.log('   curl -X POST https://us-central1-my-film-jobs.cloudfunctions.net/testNotification \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"userId":"your-user-id","type":"message","message":"Test notification"}\'');
  console.log('');
  console.log('4. Test daily digest:');
  console.log('   curl -X POST https://us-central1-my-film-jobs.cloudfunctions.net/testDailyDigest \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"userId":"your-user-id"}\'');
  console.log('');
  console.log('5. In-app testing:');
  console.log('   - Go to /test-notifications page');
  console.log('   - Click "Send Test Message"');
  console.log('   - Check notification center');
  console.log('   - Verify email is sent');
}

function showConfigurationGuide() {
  console.log('\n⚙️  Configuration Guide:\n');
  
  console.log('📧 Email Configuration:');
  console.log('1. Set up Gmail App Password:');
  console.log('   - Go to Google Account settings');
  console.log('   - Enable 2-Factor Authentication');
  console.log('   - Generate App Password for "Mail"');
  console.log('');
  console.log('2. Set Firebase Functions config:');
  console.log('   firebase functions:config:set smtp.host="smtp.gmail.com"');
  console.log('   firebase functions:config:set smtp.port="587"');
  console.log('   firebase functions:config:set smtp.user="iam@myfilmjobs.com"');
  console.log('   firebase functions:config:set smtp.pass="your-app-password"');
  console.log('   firebase functions:config:set email.from="iam@myfilmjobs.com"');
  console.log('');
  console.log('3. Deploy functions:');
  console.log('   firebase deploy --only functions');
  console.log('');
  console.log('4. Test functions:');
  console.log('   firebase functions:list');
}

function showDailyDigestInfo() {
  console.log('\n📧 Daily Digest Feature:\n');
  
  console.log('✅ Benefits:');
  console.log('- Reduces email spam');
  console.log('- Consolidated notifications');
  console.log('- User-configurable preferences');
  console.log('- Smart notification logic');
  console.log('');
  console.log('🔧 Implementation:');
  console.log('- DailyDigestService created');
  console.log('- User preferences updated');
  console.log('- Notification settings enhanced');
  console.log('- Scheduled function ready');
  console.log('');
  console.log('📋 User Options:');
  console.log('- Enable/disable daily digest');
  console.log('- Choose digest time (e.g., 09:00)');
  console.log('- Set message notification frequency');
  console.log('- Immediate, daily, or weekly digests');
}

// Main execution
async function main() {
  console.log('🚀 My Film Jobs - Email Notification Testing\n');
  
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node test-email-notifications.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --test-email     Test email sending');
    console.log('  --test-flow      Show notification flow testing steps');
    console.log('  --config         Show configuration guide');
    console.log('  --digest         Show daily digest information');
    console.log('  --all            Run all tests and show all information');
    console.log('');
    return;
  }
  
  if (args.includes('--test-email') || args.includes('--all')) {
    await testEmailSending();
  }
  
  if (args.includes('--test-flow') || args.includes('--all')) {
    await testNotificationFlow();
  }
  
  if (args.includes('--config') || args.includes('--all')) {
    showConfigurationGuide();
  }
  
  if (args.includes('--digest') || args.includes('--all')) {
    showDailyDigestInfo();
  }
  
  if (args.length === 0) {
    console.log('🔍 No options specified. Use --help to see available options.');
    console.log('💡 Try: node test-email-notifications.js --all');
  }
}

// Run the script
main().catch(console.error); 