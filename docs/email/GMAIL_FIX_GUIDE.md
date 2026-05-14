# 🔧 Gmail SMTP Authentication Fix Guide

## Problem
Email authentication is failing with error: `535-5.7.8 Username and Password not accepted`

## Root Cause
The Firebase secrets may have:
1. **Quotes** around the email address: `"iam@myfilmjobs.com"` instead of `iam@myfilmjobs.com`
2. **Spaces** in the App Password: `krys ybjd nsiu hnmc` instead of `krysybjdnsiuhnmc`
3. **Invalid or revoked** App Password

---

## ✅ Solution: Fix in 3 Steps

### Step 1: Run Diagnostics

From your **Mac Terminal** or **Google Cloud Shell**, run:

```bash
cd ~/Documents/whosonset  # Or wherever your project is
chmod +x diagnose-gmail.sh
./diagnose-gmail.sh
```

This will:
- Show you the exact values stored in your secrets
- Identify any quotes, spaces, or formatting issues
- Test the Gmail SMTP connection
- Send a test email to franciscovaldez@yahoo.com

**If it passes**: You're done! ✅
**If it fails**: Continue to Step 2 ⬇️

---

### Step 2: Generate a Fresh App Password

The App Password may be invalid. Let's create a new one:

1. **Go to**: https://myaccount.google.com/apppasswords
   - Sign in with: **iam@myfilmjobs.com**

2. **Ensure 2-Step Verification is ON**:
   - If not enabled: https://myaccount.google.com/security
   - Enable "2-Step Verification" first (required for App Passwords)

3. **Create New App Password**:
   - Click: "Select app" → Choose "Other (Custom name)"
   - Enter: `My Film Jobs - Firebase Functions`
   - Click: "Generate"

4. **Copy the 16-character password**:
   - Example: `abcd efgh ijkl mnop`
   - **IMPORTANT**: Remove all spaces when saving
   - Final format: `abcdefghijklmnop` (16 characters, no spaces)

---

### Step 3: Update Firebase Secrets (Without Quotes or Spaces)

From **Google Cloud Shell** or **Mac Terminal** (with gcloud installed):

```bash
# Update SMTP_USER (no quotes!)
echo -n 'iam@myfilmjobs.com' | gcloud secrets versions add SMTP_USER --data-file=- --project=my-film-jobs

# Update SMTP_PASS (no spaces! Replace with your NEW App Password)
echo -n 'abcdefghijklmnop' | gcloud secrets versions add SMTP_PASS --data-file=- --project=my-film-jobs

# Update EMAIL_FROM (no quotes!)
echo -n 'iam@myfilmjobs.com' | gcloud secrets versions add EMAIL_FROM --data-file=- --project=my-film-jobs
```

**IMPORTANT**:
- Use `echo -n` (with `-n` flag) to avoid newlines
- Remove ALL spaces from the App Password
- NO quotes around any values
- Replace `abcdefghijklmnop` with your actual App Password

---

### Step 4: Verify the Fix

Wait 30 seconds for the secrets to propagate, then test:

```bash
# Run diagnostics again
./diagnose-gmail.sh

# OR test the deployed function directly
curl https://us-central1-my-film-jobs.cloudfunctions.net/testEmailDirect
```

**Expected result**:
```json
{"success":true,"message":"Test email sent successfully"}
```

**Check your email**: franciscovaldez@yahoo.com (check spam folder too!)

---

## 🔍 Common Issues

### Issue: "App Passwords not available"
**Solution**: Enable 2-Step Verification first at https://myaccount.google.com/security

### Issue: "Still getting authentication errors"
**Solutions**:
1. Double-check you removed ALL spaces from App Password
2. Make sure you used `echo -n` (with `-n`) when updating secrets
3. Try revoking the old App Password and creating a completely new one
4. Verify you're signed into the correct Google account (iam@myfilmjobs.com)

### Issue: "Secret not found"
**Solution**: Make sure you're in the correct project:
```bash
gcloud config set project my-film-jobs
```

---

## 📋 Quick Reference

| Secret Name | Correct Value Format | Example |
|-------------|---------------------|---------|
| SMTP_USER | No quotes, no newlines | `iam@myfilmjobs.com` |
| SMTP_PASS | 16 chars, no spaces | `abcdefghijklmnop` |
| EMAIL_FROM | No quotes, no newlines | `iam@myfilmjobs.com` |

---

## ✅ Success Checklist

- [ ] 2-Step Verification enabled on iam@myfilmjobs.com
- [ ] New App Password generated (16 characters)
- [ ] Spaces removed from App Password
- [ ] Secrets updated with `echo -n` (no quotes, no newlines)
- [ ] Diagnostic script passes all tests
- [ ] Test email received at franciscovaldez@yahoo.com
- [ ] Follow request notifications working
- [ ] Message notifications working

---

## 🆘 Still Not Working?

If you've followed all steps and it's still failing:

1. **Check the function logs**:
   ```bash
   firebase functions:log --only testEmailDirect
   ```

2. **Look for the exact error** in the logs

3. **Try a different App Password**: Sometimes they can be generated incorrectly
   - Revoke the current one
   - Generate a brand new one
   - Update the secret again

4. **Verify the Google account**:
   - Is iam@myfilmjobs.com the correct account?
   - Is it a Google Workspace account or regular Gmail?
   - Any security restrictions on the account?

---

**Last Updated**: February 2026
**Status**: Ready to fix authentication issues ✅
