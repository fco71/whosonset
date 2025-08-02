# ✅ Production Setup Checklist

## 🎯 Your Plan: Git Branch Strategy
- **`main`** branch = Production (live site)
- **`develop`** branch = Development (new features)
- Deploy via GitHub → Firebase

## 📋 Setup Steps

### 1. ✅ Git Branches (DONE)
- [x] Created `develop` branch
- [x] Added deployment scripts
- [x] Created deployment guide

### 2. 🔥 Firebase Production Project
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Create new project with your production name
- [ ] Set up Authentication (same as dev)
- [ ] Set up Firestore Database
- [ ] Set up Storage
- [ ] Copy production config to `.env.production`

### 3. 🔧 Environment Configuration
- [ ] Create `.env.production` file with production Firebase config
- [ ] Update `package.json` deploy:prod script with your production project ID
- [ ] Test environment switching

### 4. 🚀 First Deployment
- [ ] Switch to `main` branch: `git checkout main`
- [ ] Merge `develop`: `git merge develop`
- [ ] Update production Firebase project ID in `package.json`
- [ ] Run deployment: `./deploy.sh`

### 5. 🔄 Ongoing Workflow
- [ ] Always develop on `develop` branch
- [ ] Test features thoroughly
- [ ] Merge `develop` → `main` when ready
- [ ] Deploy with `./deploy.sh`

## 🛠️ Quick Commands

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

### Emergency Rollback:
```bash
git checkout main
git reset --hard HEAD~1
git push origin main --force
./deploy.sh
```

## 📝 Notes
- No data migration needed (new database)
- Same features in dev and prod
- Deploy often via GitHub
- Keep `main` stable and tested

## 🎉 You're Ready!
Once you complete the Firebase setup, you'll have a professional deployment workflow! 