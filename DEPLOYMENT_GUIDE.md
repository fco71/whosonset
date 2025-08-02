# 🚀 Deployment Guide

## Branch Strategy

### Branches:
- **`main`** - Production-ready code (deployed to live site)
- **`develop`** - New features and development work
- **`feature/xyz`** - Individual feature branches (optional)

## Workflow

### 1. Development Workflow
```bash
# Always work on develop branch for new features
git checkout develop

# Create feature branch (optional)
git checkout -b feature/new-feature

# Make your changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin develop
```

### 2. Deploy to Production
```bash
# Switch to main branch
git checkout main

# Merge develop into main
git merge develop

# Push to production
git push origin main

# Deploy to Firebase
npm run deploy:prod
```

### 3. After Deployment
```bash
# Switch back to develop for next features
git checkout develop

# Pull latest changes
git pull origin main
```

## Environment Configuration

### Development Environment (.env.development)
```env
REACT_APP_FIREBASE_API_KEY=your_dev_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_dev_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_dev_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_dev_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_dev_sender_id
REACT_APP_FIREBASE_APP_ID=your_dev_app_id
REACT_APP_ENV=development
```

### Production Environment (.env.production)
```env
REACT_APP_FIREBASE_API_KEY=your_prod_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_prod_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_prod_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_prod_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_prod_sender_id
REACT_APP_FIREBASE_APP_ID=your_prod_app_id
REACT_APP_ENV=production
```

## Firebase Projects Setup

### 1. Create Production Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project with your production name
3. Set up Authentication, Firestore, Storage
4. Copy configuration to `.env.production`

### 2. Configure Firebase CLI
```bash
# Login to Firebase
firebase login

# Initialize Firebase for production
firebase use --add

# Select your production project
```

## Deployment Scripts

### Add to package.json:
```json
{
  "scripts": {
    "deploy:dev": "firebase deploy --project your-dev-project",
    "deploy:prod": "firebase deploy --project your-prod-project",
    "build:prod": "REACT_APP_ENV=production npm run build"
  }
}
```

## Best Practices

### ✅ Do's:
- Always develop on `develop` branch
- Test thoroughly before merging to `main`
- Use descriptive commit messages
- Keep `main` branch stable
- Deploy during low-traffic hours

### ❌ Don'ts:
- Never commit directly to `main`
- Don't deploy untested code
- Don't skip the merge process
- Don't forget to update environment variables

## Quick Commands

### Development:
```bash
git checkout develop
npm start
```

### Deploy to Production:
```bash
git checkout main
git merge develop
git push origin main
npm run deploy:prod
```

### Rollback (if needed):
```bash
git checkout main
git reset --hard HEAD~1
git push origin main --force
npm run deploy:prod
```

## Monitoring

### After Deployment:
1. Check Firebase Console for deployment status
2. Test all critical features
3. Monitor error logs
4. Check user feedback

### Emergency Rollback:
If something goes wrong:
1. Immediately rollback using the rollback command above
2. Investigate the issue on `develop` branch
3. Fix and test thoroughly
4. Deploy again when ready 