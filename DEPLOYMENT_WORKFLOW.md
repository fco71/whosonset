# Deployment Workflow

## Branch Strategy

- **`main`** = Production (deploys to myfilmjobs.com)
- **`develop`** = Development (where you do all your work)

## Daily Workflow

### 1. Development (Normal Work)
```bash
# Always work on develop branch
git checkout develop

# Make your changes...
# Test locally with npm start

# Deploy to development for testing
./deploy-development.sh
# This deploys to: https://my-film-jobs.web.app
```

### 2. Production Deployment (When Ready)
```bash
# When your changes are ready for production:

# 1. Merge develop into main
git checkout main
git merge develop

# 2. Deploy to production
./deploy-production.sh
# This deploys to: https://myfilmjobs-com.web.app (myfilmjobs.com)

# 3. Go back to develop for next feature
git checkout develop
```

## Deployment Scripts

- **`./deploy-development.sh`** - Deploy to development (safe for testing)
- **`./deploy-production.sh`** - Deploy to production (only from main branch)

## Safety Features

- ✅ Production deployment only works from `main` branch
- ✅ Git hook asks for confirmation before production deployment
- ✅ Development deployments are safe and don't affect production
- ✅ Clear separation between development and production URLs

## URLs

- **Development**: https://my-film-jobs.web.app
- **Production**: https://myfilmjobs-com.web.app (myfilmjobs.com)

## Quick Commands

```bash
# Start working
git checkout develop

# Test changes
./deploy-development.sh

# When ready for production
git checkout main
git merge develop
./deploy-production.sh
git checkout develop
``` 