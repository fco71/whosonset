# Gmail Email Notification Setup Guide

## ✅ What's Been Done
- ✅ Removed SendGrid dependency from package.json
- ✅ Updated emailService.ts to use only Nodemailer
- ✅ Updated all Firebase Functions to remove SendGrid secrets
- ✅ Your email system is now free and uses Gmail SMTP!

## 📧 Step 1: Create Gmail App Password (5 minutes)

Since you'll be using Gmail to send emails programmatically, you need to create an **App Password** (not your regular Gmail password).

### Instructions:

1. **Go to your Google Account**: https://myaccount.google.com/

2. **Enable 2-Step Verification** (if not already enabled):
   - Click "Security" in the left menu
   - Under "How you sign in to Google", click "2-Step Verification"
   - Follow the prompts to enable it

3. **Create an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Security → 2-Step Verification → App passwords (at the bottom)
   - Select "Mail" and "Other (Custom name)"
   - Enter name: "WhosOnSet Notifications"
   - Click "Generate"
   - **COPY THE 16-CHARACTER PASSWORD** (you'll need this in Step 2)
   - Example format: `[REDACTED_GMAIL_APP_PASSWORD]`

## 🔐 Step 2: Set Firebase Secrets

You need to configure 3 secrets in Firebase:

```bash
# Navigate to your functions directory
cd /sessions/clever-eager-fermi/mnt/whosonset/functions

# Set SMTP_USER (your Gmail address)
firebase functions:secrets:set SMTP_USER

# When prompted, enter: your-email@gmail.com

# Set SMTP_PASS (the 16-character App Password from Step 1)
firebase functions:secrets:set SMTP_PASS

# When prompted, enter: the app password (no spaces needed)

# Set EMAIL_FROM (the email address that appears in the "From" field)
firebase functions:secrets:set EMAIL_FROM

# When prompted, enter: iam@myfilmjobs.com
```

**Important Notes:**
- `SMTP_USER` = Your Gmail address (e.g., youremail@gmail.com)
- `SMTP_PASS` = The 16-character App Password (remove spaces if you want)
- `EMAIL_FROM` = The email that appears as sender (iam@myfilmjobs.com)

## 🚀 Step 3: Deploy Your Functions

```bash
# Navigate to project root
cd /sessions/clever-eager-fermi/mnt/whosonset

# Navigate to functions directory and reinstall dependencies
cd functions
npm install

# Build the TypeScript code
npm run build

# Deploy to Firebase
cd ..
firebase deploy --only functions
```

## 🧪 Step 4: Test Your Email Notifications

After deployment, test your email system:

```bash
# Test follow request notification
curl -X POST https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/testFollowRequestNotification
```

Or trigger a real notification by:
1. Creating a follow request in your app
2. Sending a message to another user
3. Checking Firebase Functions logs:
   ```bash
   firebase functions:log
   ```

## 📊 Gmail Free Tier Limits

- **500 emails per day** (plenty for your ~1,000/month need)
- No monthly fees
- Good deliverability
- Professional appearance

## 🔧 Troubleshooting

### Issue: "Invalid login" error
- **Solution**: Make sure you're using the App Password, not your regular Gmail password
- Double-check 2-Step Verification is enabled

### Issue: "Authentication failed"
- **Solution**: Verify SMTP_USER and SMTP_PASS secrets are set correctly:
  ```bash
  firebase functions:secrets:access SMTP_USER
  firebase functions:secrets:access SMTP_PASS
  ```

### Issue: Emails not sending
- **Solution**: Check Firebase Functions logs:
  ```bash
  firebase functions:log --only notifyFollowRequest,notifyNewMessage,emailSend
  ```

### Issue: "Less secure app access" error
- **Solution**: You MUST use App Passwords (not regular password). This is the modern, secure way.

## 📝 What Changed?

### Files Modified:
1. **functions/package.json** - Removed `@sendgrid/mail` dependency
2. **functions/src/emailService.ts** - Removed all SendGrid code, uses only Nodemailer
3. **functions/src/index.ts** - Removed SendGrid secrets from all functions

### Email Functions Still Working:
- ✅ `notifyFollowRequest` - Sends email when someone sends a friend request
- ✅ `notifyNewMessage` - Sends email when someone sends a message
- ✅ `emailSend` - General email sending endpoint

All templates are preserved:
- Follow requests
- Message notifications
- Job applications
- Project invitations
- Task assignments
- Project updates

## 🎉 You're Done!

Once you complete Steps 1-3 above, your email system will be:
- ✅ **Free** (no more SendGrid costs)
- ✅ **Reliable** (Gmail's infrastructure)
- ✅ **Simple** (no external API keys to manage)
- ✅ **Professional** (emails from iam@myfilmjobs.com)

## Next Steps

1. Create Gmail App Password (2 minutes)
2. Set Firebase secrets (2 minutes)
3. Deploy functions (3 minutes)
4. Test and celebrate! 🎊

---

**Need help?** Check the troubleshooting section or review your Firebase Functions logs.
