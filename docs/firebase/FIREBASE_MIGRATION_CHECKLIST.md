# 🔥 Firebase Production Migration Checklist

## 📋 Complete Setup for New Production Database

### 1. 🔥 Firebase Project Setup
- [ ] Create new Firebase project with production name
- [ ] Enable Authentication (Email/Password, Google, etc.)
- [ ] Create Firestore Database
- [ ] Enable Storage
- [ ] Copy production config to `.env.production`

### 2. 📊 Firestore Database Setup

#### Collections to Create:
- [ ] `users` - User profiles and data
- [ ] `UserCollections` - User-specific collections
- [ ] `crewProfiles` - Crew member profiles
- [ ] `projects` - Project listings
- [ ] `jobPostings` - Job postings
- [ ] `jobApplications` - Job applications
- [ ] `favorites` - User favorites
- [ ] `crewFavorites` - Crew favorites
- [ ] `conversations` - Chat conversations
- [ ] `messages` - Chat messages
- [ ] `notifications` - User notifications
- [ ] `activityFeed` - Social activity feed
- [ ] `jobTitles` - Job title reference data
- [ ] `jobDepartments` - Job department reference data
- [ ] `countries` - Country reference data
- [ ] `cities` - City reference data

### 3. 🔍 Firestore Indexes
Deploy the indexes from `firestore.indexes.json`:
```bash
firebase deploy --only firestore:indexes --project your-prod-project-id
```

**Current Indexes:**
- [ ] `activityFeed` - `isPublic` + `createdAt` (ASC)
- [ ] `activityFeed` - `isPublic` + `createdAt` (DESC)
- [ ] `activityFeed` - `userId` + `createdAt` (DESC)
- [ ] `notifications` - `timestamp` (DESC)

### 4. 🔒 Security Rules
Deploy the security rules from `firestore.rules`:
```bash
firebase deploy --only firestore:rules --project your-prod-project-id
```

**Key Rules:**
- [ ] User collections access control
- [ ] Crew profiles permissions
- [ ] Projects access control
- [ ] Job postings permissions
- [ ] Job applications (applicant/poster access)
- [ ] Messaging permissions
- [ ] Notifications access

### 5. 📁 Storage Rules
Deploy the storage rules from `storage.rules`:
```bash
firebase deploy --only storage --project your-prod-project-id
```

**Storage Folders:**
- [ ] `project-images/` - Public read, auth write
- [ ] `profileImages/` - Public read, auth write
- [ ] `screenplays/` - Public read, auth write
- [ ] `chat-uploads/` - Auth only
- [ ] `chat-images/` - Auth only
- [ ] `chat-audio/` - Auth only
- [ ] `users/{userId}/` - User-specific access

### 6. ⚡ Cloud Functions
Deploy the functions from `functions/src/index.ts`:
```bash
firebase deploy --only functions --project your-prod-project-id
```

**Current Functions:**
- [ ] `notifyJobPosterOnApplication` - Notifies job poster on new application

### 7. 🌐 Hosting Configuration
Deploy the hosting configuration:
```bash
firebase deploy --only hosting --project your-prod-project-id
```

**Hosting Settings:**
- [ ] Public directory: `public`
- [ ] SPA fallback: `index.html`
- [ ] Ignore patterns configured

### 8. 📝 Reference Data Seeding

#### Job Titles (if needed):
```bash
npm run seed:job-titles
```

#### Job Departments (if needed):
```bash
npm run seed:job-departments
```

#### Countries (if needed):
```bash
npm run seed:countries
```

### 9. 🔧 Environment Configuration

#### Create `.env.production`:
```env
REACT_APP_FIREBASE_API_KEY=your_prod_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_prod_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_prod_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_prod_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_prod_sender_id
REACT_APP_FIREBASE_APP_ID=your_prod_app_id
REACT_APP_ENV=production
```

#### Update `package.json`:
```json
{
  "scripts": {
    "deploy:prod": "firebase deploy --project your-prod-project-id"
  }
}
```

### 10. 🚀 Complete Deployment Commands

#### First-Time Setup:
```bash
# 1. Initialize Firebase for production
firebase use --add
# Select your production project

# 2. Deploy everything
firebase deploy --project your-prod-project-id

# 3. Or deploy components individually:
firebase deploy --only firestore:rules --project your-prod-project-id
firebase deploy --only firestore:indexes --project your-prod-project-id
firebase deploy --only storage --project your-prod-project-id
firebase deploy --only functions --project your-prod-project-id
firebase deploy --only hosting --project your-prod-project-id
```

#### Regular Deployments:
```bash
# Deploy everything
npm run deploy:prod

# Or use the deployment script
./deploy.sh
```

### 11. ✅ Post-Deployment Verification

#### Test These Features:
- [ ] User registration/login
- [ ] Profile creation/editing
- [ ] Project creation/listing
- [ ] Job posting/application
- [ ] Messaging system
- [ ] Notifications
- [ ] File uploads
- [ ] Favorites functionality
- [ ] Social features

#### Check Firebase Console:
- [ ] Authentication users
- [ ] Firestore data
- [ ] Storage files
- [ ] Functions logs
- [ ] Hosting status

### 12. 🔄 Ongoing Maintenance

#### Regular Tasks:
- [ ] Monitor function logs
- [ ] Check storage usage
- [ ] Review security rules
- [ ] Update indexes as needed
- [ ] Backup important data

#### Emergency Procedures:
- [ ] Rollback deployment if needed
- [ ] Restore from backup
- [ ] Contact Firebase support

## 🎯 Quick Reference

### Development:
```bash
git checkout develop
npm start
```

### Deploy to Production:
```bash
git checkout main
git merge develop
./deploy.sh
```

### Firebase Commands:
```bash
# Deploy everything
firebase deploy --project your-prod-project-id

# Deploy specific components
firebase deploy --only firestore --project your-prod-project-id
firebase deploy --only storage --project your-prod-project-id
firebase deploy --only functions --project your-prod-project-id
firebase deploy --only hosting --project your-prod-project-id
```

## 🎉 You're Ready!
Once you complete this checklist, your production environment will be fully configured and ready to handle real users! 