# Firebase Secrets Setup via CLI

## Step 1: Login to Firebase

```bash
# Navigate to project directory
cd /sessions/clever-eager-fermi/mnt/whosonset

# Login to Firebase (this will open a browser)
npx firebase login

# Follow the browser prompts to authenticate
```

## Step 2: Select Your Project

```bash
# Check which project is currently active
npx firebase use

# If needed, switch to your project
npx firebase use my-film-jobs
```

## Step 3: Enable Secret Manager API

The 403 error often means Secret Manager API isn't enabled. Enable it here:
https://console.cloud.google.com/apis/library/secretmanager.googleapis.com?project=my-film-jobs

Or run:
```bash
gcloud services enable secretmanager.googleapis.com --project=my-film-jobs
```

## Step 4: Set the Secrets

```bash
# Set SMTP_USER
npx firebase functions:secrets:set SMTP_USER
# Enter: your-email@gmail.com

# Set SMTP_PASS
npx firebase functions:secrets:set SMTP_PASS
# Enter: your 16-character Gmail App Password

# Set EMAIL_FROM
npx firebase functions:secrets:set EMAIL_FROM
# Enter: iam@myfilmjobs.com
```

## Step 5: Deploy

```bash
npx firebase deploy --only functions
```

## Troubleshooting

### "Caller does not have permission"
- You need Owner or Editor role on the Firebase project
- Go to https://console.firebase.google.com/project/my-film-jobs/settings/iam
- Make sure your account has sufficient permissions

### "Secret Manager API not enabled"
- Visit: https://console.cloud.google.com/apis/library/secretmanager.googleapis.com
- Click "Enable"

### "Authentication error"
- Run: `npx firebase logout`
- Then: `npx firebase login`
- Make sure you're using the correct Google account
