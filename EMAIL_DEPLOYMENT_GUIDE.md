# Email Function Deployment Guide

## Current Status ✅
- ✅ `sendEmail` function created with SendGrid integration
- ✅ TypeScript code compiled successfully  
- ✅ Frontend updated to call the Firebase function
- ✅ CORS headers configured for cross-origin requests

## Prerequisites

### 1. SendGrid Setup
You need a SendGrid account and API key:
1. Sign up at [SendGrid](https://sendgrid.com)
2. Create an API key with "Mail Send" permissions
3. Verify a sender email address (e.g., noreply@whosonset.com)

### 2. Update Sender Email
In `functions/src/index.ts`, line 53, update the sender email:
```typescript
from: {
  email: 'noreply@whosonset.com', // Replace with your verified sender email
  name: 'WhosOnSet'
},
```

## Deployment Steps

### Step 1: Set SendGrid API Key in Firebase
```bash
# Set the SendGrid API key as an environment variable in Firebase
firebase functions:config:set sendgrid.api_key="YOUR_SENDGRID_API_KEY"

# Verify the config is set
firebase functions:config:get
```

### Step 2: Deploy the Functions
```bash
# Deploy only the functions
firebase deploy --only functions

# Or deploy a specific function
firebase deploy --only functions:sendEmail
```

### Step 3: Test Locally (Optional)
```bash
# Start the Firebase emulator
cd functions
npm run serve

# The function will be available at:
# http://localhost:5001/my-film-jobs/us-central1/sendEmail
```

### Step 4: Test in Production
1. Navigate to your SimpleEmailTestPage
2. Enter a valid email address
3. Click "Test Email System"
4. Check the recipient's inbox

## Troubleshooting

### Common Issues:

1. **"SendGrid API key not configured" error**
   - Make sure you've set the API key: `firebase functions:config:set sendgrid.api_key="YOUR_KEY"`
   - Redeploy after setting the config

2. **CORS errors**
   - The function already includes CORS headers
   - Make sure you're using the correct function URL

3. **"The from address does not match a verified Sender Identity" error**
   - You need to verify the sender email in SendGrid
   - Go to Settings > Sender Authentication in SendGrid

4. **Build errors**
   - Run `npm install` in the functions directory
   - Run `npm run build` to compile TypeScript

## Function URLs

- **Production**: `https://us-central1-my-film-jobs.cloudfunctions.net/sendEmail`
- **Local**: `http://localhost:5001/my-film-jobs/us-central1/sendEmail`

## Next Steps

1. Set up email templates for different notification types
2. Add email queuing for bulk sends
3. Implement email tracking and analytics
4. Add unsubscribe functionality
5. Set up email preferences for users

## Security Notes

- Never commit your SendGrid API key to version control
- Use Firebase environment config for sensitive data
- Implement rate limiting to prevent abuse
- Add authentication to the function if needed