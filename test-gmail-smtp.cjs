// Quick test to verify Gmail SMTP is working
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://my-film-jobs.firebaseio.com'
});

async function testGmailSMTP() {
  try {
    console.log('🔍 Testing Gmail SMTP configuration...\n');

    // Get secrets from Secret Manager
    const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
    const client = new SecretManagerServiceClient();

    const projectId = 'my-film-jobs';

    // Access secrets
    const [smtpUserVersion] = await client.accessSecretVersion({
      name: `projects/${projectId}/secrets/SMTP_USER/versions/latest`,
    });
    const [smtpPassVersion] = await client.accessSecretVersion({
      name: `projects/${projectId}/secrets/SMTP_PASS/versions/latest`,
    });
    const [emailFromVersion] = await client.accessSecretVersion({
      name: `projects/${projectId}/secrets/EMAIL_FROM/versions/latest`,
    });

    const SMTP_USER = smtpUserVersion.payload.data.toString();
    const SMTP_PASS = smtpPassVersion.payload.data.toString();
    const EMAIL_FROM = emailFromVersion.payload.data.toString();

    console.log('✅ Secrets loaded:');
    console.log(`   SMTP_USER: ${SMTP_USER}`);
    console.log(`   SMTP_PASS: ${SMTP_PASS.substring(0, 4)}****`);
    console.log(`   EMAIL_FROM: ${EMAIL_FROM}\n`);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    console.log('📧 Sending test email...\n');

    // Send test email
    const info = await transporter.sendMail({
      from: `My Film Jobs <${EMAIL_FROM}>`,
      to: 'franciscovaldez@yahoo.com',
      subject: '✅ Gmail SMTP Test - My Film Jobs',
      text: 'This is a test email to verify Gmail SMTP is working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">✅ Gmail SMTP Test Successful!</h2>
          <p>Hello,</p>
          <p>This test email confirms that your Gmail SMTP configuration is working correctly.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <p><strong>SMTP Server:</strong> smtp.gmail.com</p>
            <p><strong>Port:</strong> 587</p>
            <p><strong>From:</strong> ${EMAIL_FROM}</p>
            <p><strong>Sent via:</strong> Nodemailer with Gmail SMTP</p>
          </div>
          <p style="color: #10b981; font-weight: bold;">
            ✅ Your email notification system is working!
          </p>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Best regards,<br>
            The My Film Jobs Team
          </p>
        </div>
      `
    });

    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}\n`);
    console.log('📬 Check franciscovaldez@yahoo.com for the test email!');
    console.log('   (Check spam folder if not in inbox)\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ ERROR:', error);
    console.error('\nDetails:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    process.exit(1);
  }
}

testGmailSMTP();
