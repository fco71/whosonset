# 🔐 Firebase Admin SDK Setup for Complete Backup

## ⚠️ Current Issue
The backup script can only access `crewProfiles` because other collections have security rules that require authentication.

## 🛠️ Solution: Firebase Admin SDK

To get a complete backup with all collections, you need Firebase Admin SDK credentials.

### Step 1: Get Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `my-film-jobs`
3. Go to **Project Settings** (gear icon)
4. Click **Service accounts** tab
5. Click **Generate new private key**
6. Save the JSON file as `service-account-key.json` in your project root

### Step 2: Update Backup Script
Once you have the service account key, I can update the backup script to use it and access ALL collections.

### Step 3: Run Complete Backup
With Admin SDK, the backup will include:
- ✅ All collections (no permission errors)
- ✅ All user data
- ✅ All project data
- ✅ All social connections
- ✅ All notifications and preferences

## 🚨 IMPORTANT: Manual Image Backup Still Required

Even with Admin SDK, you still need to manually backup images from Firebase Storage:
1. Go to Firebase Console > Storage
2. Download all profile and project images
3. Store them with your Firestore backup

## 📞 Next Steps

1. **Get the service account key** (see Step 1 above)
2. **Contact me** to update the backup script
3. **Run the complete backup** with full access
4. **Manually backup images** from Firebase Storage

## 🛡️ Security Note

The service account key gives full access to your Firebase project. Keep it secure and never commit it to version control.
