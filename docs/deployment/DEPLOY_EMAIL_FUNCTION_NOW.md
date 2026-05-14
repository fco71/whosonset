# Deploy Email Function - Quick Guide

## Prerequisites
You need to run these commands from your local machine where you can authenticate with Firebase.

## Step 1: Clone the latest changes
```bash
git pull origin cursor/investigate-sendemail-deployment-issues-0a6d
```

## Step 2: Navigate to the project root
```bash
cd whosonset
```

## Step 3: Install dependencies
```bash
# Install main dependencies
npm install

# Install function dependencies
cd functions
npm install
cd ..
```

## Step 4: Build the functions
```bash
cd functions
npm run build
cd ..
```

## Step 5: Login to Firebase (if not already logged in)
```bash
firebase login
```

## Step 6: Select the correct project
```bash
firebase use my-film-jobs
```

## Step 7: Deploy the email function
```bash
firebase deploy --only functions:simpleEmailTest
```

## Step 8: (Optional) Set email configuration
If you haven't already configured email settings:

### For SendGrid (Recommended):
```bash
firebase functions:config:set sendgrid.api_key="YOUR_SENDGRID_API_KEY"
firebase functions:config:set email.from="noreply@myfilmjobs.com"
```

### For SMTP (Gmail):
```bash
firebase functions:config:set smtp.host="smtp.gmail.com"
firebase functions:config:set smtp.port="587"
firebase functions:config:set smtp.user="your-email@gmail.com"
firebase functions:config:set smtp.pass="your-app-specific-password"
firebase functions:config:set email.from="your-email@gmail.com"
```

## Step 9: Redeploy after setting config (if you did step 8)
```bash
firebase deploy --only functions:simpleEmailTest
```

## Expected Output
After successful deployment, you should see:
```
✔  functions[simpleEmailTest(us-central1)] Successful create operation.
Function URL (simpleEmailTest(us-central1)): https://us-central1-my-film-jobs.cloudfunctions.net/simpleEmailTest

✔  Deploy complete!
```

## Test the Function
Once deployed, the email test page at `/email-test` will work immediately without any delays.

## Troubleshooting

### If deployment fails:
1. Make sure you're logged in: `firebase login`
2. Check you're on the right project: `firebase projects:list`
3. Ensure functions are built: `cd functions && npm run build`

### If emails don't send after deployment:
1. Check function logs: `firebase functions:log`
2. Verify email config: `firebase functions:config:get`
3. Make sure SendGrid API key or SMTP credentials are correct