# Deploy Your Email Function - Quick Steps

## ✅ Current Status
- Sender email updated: **iam@myfilmjobs.com**
- Sender name updated: **My Film Jobs**
- Function compiled and ready to deploy

## 🚀 Deploy Now (3 Steps)

### Step 1: Login to Firebase
```bash
firebase login
```

### Step 2: Set Your SendGrid API Key
```bash
# Replace YOUR_NEW_API_KEY with the API key you just generated
firebase functions:config:set sendgrid.api_key="YOUR_NEW_API_KEY"
```

Example (DO NOT copy this - use your real key):
```bash
firebase functions:config:set sendgrid.api_key="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Step 3: Deploy the Function
```bash
# Deploy just the sendEmail function
firebase deploy --only functions:sendEmail
```

## 📧 Test Your Email Function

Once deployed, test it:
1. Go to your app's `/simple-email-test` page
2. Enter a test email address
3. Click "Test Email System"
4. Check the inbox!

## 🔍 Verify Deployment

Check if your function is live:
```bash
firebase functions:list
```

You should see:
```
┌────────────┬────────────────────────────────────────┐
│ Function   │ Trigger                                │
├────────────┼────────────────────────────────────────┤
│ sendEmail  │ HTTP                                   │
│ emailTest  │ HTTP                                   │
│ testEmail  │ HTTP                                   │
└────────────┴────────────────────────────────────────┘
```

## 🛠️ Troubleshooting

### If deployment fails:
1. Make sure you're logged in: `firebase login`
2. Check you're in the right project: `firebase use my-film-jobs`
3. Verify your API key is set: `firebase functions:config:get`

### If emails don't send:
1. Check Firebase Functions logs: `firebase functions:log`
2. Verify `iam@myfilmjobs.com` is verified in SendGrid
3. Check the browser console for errors

## 📝 Quick Reference

- **Your sender email**: iam@myfilmjobs.com
- **Your sender name**: My Film Jobs
- **Function URL**: https://us-central1-my-film-jobs.cloudfunctions.net/sendEmail
- **Test page**: https://myfilmjobs.com/simple-email-test

## 🎉 Success Checklist

After deployment:
- [ ] Function shows as deployed in Firebase console
- [ ] Test email sends successfully
- [ ] Email arrives with "My Film Jobs" as sender
- [ ] No errors in function logs

## 🔐 Security Reminder

- Your API key is now safely stored in Firebase config
- Never commit API keys to code
- The old exposed key should be deleted from SendGrid