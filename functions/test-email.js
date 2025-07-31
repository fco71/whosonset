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
      subject: 'Test Email from My Film Jobs',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Test Email</h2>
          <p>This is a test email from the My Film Jobs notification system.</p>
          <p>If you receive this email, the email service is working correctly!</p>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Best regards,<br>
            The My Film Jobs Team
          </p>
        </div>
      `,
      text: `
Test Email from My Film Jobs

This is a test email from the My Film Jobs notification system.

If you receive this email, the email service is working correctly!

Best regards,
The My Film Jobs Team
      `
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