# SendGrid API Key Setup Instructions

## ⚠️ SECURITY ALERT
Since you've shared your API key (U5ZHZXSRVJAKU599M7N2KW8R), you should:
1. **Regenerate this API key immediately** after setup
2. Go to SendGrid Dashboard → Settings → API Keys → Create a new key
3. Delete the old key that was exposed

## Setup Steps

### 1. Authenticate with Firebase (if not already done)
```bash
firebase login
```

### 2. Set the SendGrid API Key in Firebase Config
```bash
# Run this from your project root
firebase functions:config:set sendgrid.api_key="U5ZHZXSRVJAKU599M7N2KW8R"
```

### 3. Verify the Configuration
```bash
firebase functions:config:get
```
You should see:
```json
{
  "sendgrid": {
    "api_key": "U5ZHZXSRVJAKU599M7N2KW8R"
  }
}
```

### 4. Deploy the Functions
```bash
# Deploy all functions
firebase deploy --only functions

# Or deploy just the sendEmail function
firebase deploy --only functions:sendEmail
```

### 5. Update the Sender Email
Before deploying, make sure to update the sender email in `functions/src/index.ts`:
```typescript
from: {
  email: 'your-verified-email@yourdomain.com', // Update this!
  name: 'WhosOnSet'
},
```

## Alternative: Local Development Setup

For local testing, create a `.env` file in the `functions` directory:
```bash
# functions/.env
SENDGRID_API_KEY=U5ZHZXSRVJAKU599M7N2KW8R
```

Then add to `.gitignore`:
```
functions/.env
```

## Testing the Deployment

1. After deployment, check the Firebase console for your function URL
2. Navigate to your SimpleEmailTestPage
3. Enter a test email address
4. Click "Test Email System"

## Common SendGrid API Key Issues

1. **Invalid API Key Format**: SendGrid keys usually start with "SG." - make sure you copied the full key
2. **Insufficient Permissions**: Ensure your API key has "Mail Send" permissions
3. **Sender Verification**: You must verify the sender email address in SendGrid

## Next Steps After Setup

1. **REGENERATE YOUR API KEY** in SendGrid (since it was exposed)
2. Update the Firebase config with the new key:
   ```bash
   firebase functions:config:set sendgrid.api_key="YOUR_NEW_API_KEY"
   ```
3. Redeploy the functions
4. Test email sending

## Security Best Practices

- Never commit API keys to version control
- Use Firebase config or environment variables
- Rotate API keys regularly
- Use restricted API keys with minimal permissions
- Monitor API key usage in SendGrid dashboard