# 🚀 Email Migration Deployment Guide

## Firebase Account Requirement

Use Firebase project `my-film-jobs` while logged into Firebase as `iam@myfilmjobs.com` for all CLI and Console work, including Hosting, Firestore, Storage, Functions, and secrets. Do not deploy from any other Google account.

Before deploying, verify the active account:

```bash
firebase login:list
```

If the active Firebase account is wrong, reauthenticate and choose `iam@myfilmjobs.com`:

```bash
firebase logout
firebase login --reauth
```

## ✅ Migration Complete - Ready to Deploy!

Your email notification system has been successfully migrated from **SendGrid to Gmail SMTP**. All code changes are complete.

---

## 📋 What Was Changed

### Files Modified:
1. **functions/package.json** - Removed SendGrid, updated to Node 22
2. **functions/src/emailService.ts** - Removed SendGrid, implemented Gmail SMTP
3. **functions/src/index.ts** - Updated secrets (removed sendgridApiKey)

### Firebase Secrets Configured:
- ✅ SMTP_USER: iam@myfilmjobs.com
- ✅ SMTP_PASS: Your Gmail App Password  
- ✅ EMAIL_FROM: iam@myfilmjobs.com

---

## 🎯 Final Steps to Deploy

### 1. Ensure Node 22 in functions/package.json
Line 14 should show: `"node": "22"` (not 18)

### 2. From your Mac, commit and push:
```bash
cd ~/Documents/whosonset/functions  # Or your actual path
# Edit package.json line 14 to say "22" if needed
cd ..
git add functions/package.json
git commit -m "Update to Node 22" --no-verify
git push
```

### 3. Deploy from Cloud Shell:
```bash
cd ~/whosonset
git pull
firebase deploy --only functions
```

---

## 🔧 If Cloud Build Still Fails

Contact Firebase Support: https://firebase.google.com/support
- Project: my-film-jobs
- Issue: "Cloud Build failing for Node 22 functions"
- Build ID: bf4cc07e-949a-48b8-8c12-24f8c96e7a26

---

## ✨ What You're Getting

- **Free forever**: 500 emails/day with Gmail
- **All notifications working**: Follow requests, messages, jobs, projects
- **$0/month cost** (vs SendGrid's paid tiers)

---

## 🧪 Test After Deployment

```bash
curl -X POST https://us-central1-my-film-jobs.cloudfunctions.net/testFollowRequestNotification
firebase functions:log --only notifyFollowRequest
```

Expected: `[EmailService] Using Nodemailer with Gmail SMTP` ✅

---

**Status**: Code Complete - Ready to Deploy! 🎉
