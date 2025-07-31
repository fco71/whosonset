const nodemailer = require('nodemailer');

// Test email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'iam@myfilmjobs.com',
    pass: 'ersb xtpm slup jgfn'
  }
});

async function testEmail() {
  try {
    console.log('Testing email service...');
    
    const mailOptions = {
      from: 'iam@myfilmjobs.com',
      to: 'iam@myfilmjobs.com', // Send to yourself for testing
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
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

testEmail(); 