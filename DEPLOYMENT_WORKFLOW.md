# Deployment Workflow

## Branch Strategy

- **`main`** = Regular working branch (local only)
- **`develop`** = Experimental features (local only)
- **`deployate`** = Auto-deploys to myfilmjobs.com (PRODUCTION)

## Daily Workflow

### 1. Regular Work (main branch)
```bash
# Work on main branch for regular features
git checkout main

# Make your changes...
# Test locally with npm start
# Commit your changes
git add .
git commit -m "Your changes"
```

### 2. Experimental Features (develop branch)
```bash
# Work on experimental features
git checkout develop

# Make experimental changes...
# Test locally with npm start

# Deploy to development for testing
./deploy-development.sh
# This deploys to: https://my-film-jobs.web.app
```

### 3. Production Deployment (deployate branch)
```bash
# When ready to deploy to production:

# 1. Merge your changes to deployate
git checkout deployate
git merge main  # or git merge develop

# 2. Push to deployate (auto-deploys to production)
git push origin deployate
# This automatically deploys to: https://myfilmjobs-com.web.app

# 3. Go back to main for next feature
git checkout main
```

## Deployment Scripts

- **`./deploy-development.sh`** - Deploy to development (safe for testing)
- **`./deploy-production.sh`** - Deploy to production (only from deployate branch)

## Safety Features

- ✅ Only `deployate` branch auto-deploys to production
- ✅ `main` and `develop` branches are local only (safe!)
- ✅ Git hook asks for confirmation before production deployment
- ✅ Clear separation between development and production URLs

## URLs

- **Development**: https://my-film-jobs.web.app (manual deployment)
- **Production**: https://myfilmjobs-com.web.app (auto-deploys from deployate)

## Quick Commands

```bash
# Regular work
git checkout main
# ... make changes ...
git add . && git commit -m "Changes"

# Experimental work
git checkout develop
# ... make experimental changes ...
./deploy-development.sh

# Deploy to production
git checkout deployate
git merge main  # or develop
git push origin deployate  # auto-deploys!
git checkout main
```

## Branch Purposes

- **`main`**: Your daily work, stable features
- **`develop`**: Experimental features, testing new ideas
- **`deployate`**: Production-ready code that goes live

## TEST: Auto-deploy is working correctly! 