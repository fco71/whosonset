#!/bin/bash

# 🚀 Production Deployment Script
# This script safely deploys your app to production

echo "🚀 Starting production deployment..."

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: You must be on the main branch to deploy to production"
    echo "Current branch: $CURRENT_BRANCH"
    echo "Please run: git checkout main"
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: You have uncommitted changes"
    echo "Please commit or stash your changes before deploying"
    exit 1
fi

# Confirm deployment
echo "📋 About to deploy to production:"
echo "   - Branch: $CURRENT_BRANCH"
echo "   - Last commit: $(git log -1 --oneline)"
echo ""
read -p "🤔 Are you sure you want to deploy to production? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Build for production
echo "🔨 Building for production..."
npm run build:prod

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
npm run deploy:prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live at: https://your-prod-project-id.web.app"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Test the live site"
    echo "   2. Check Firebase Console for any errors"
    echo "   3. Switch back to develop branch: git checkout develop"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi 