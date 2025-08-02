#!/bin/bash

echo "🚀 Starting PRODUCTION deployment to myfilmjobs.com..."

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ ERROR: Production deployment must be from main branch!"
    echo "   Current branch: $CURRENT_BRANCH"
    echo "   Please checkout main branch first: git checkout main"
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Firebase Hosting (Production)
echo "🌐 Deploying to PRODUCTION (myfilmjobs.com)..."
firebase deploy --only hosting:production

if [ $? -ne 0 ]; then
    echo "❌ Production deployment failed!"
    exit 1
fi

echo "✅ PRODUCTION deployment completed successfully!"
echo "🌍 Your app is now live at: https://myfilmjobs-com.web.app"
echo "🔗 Custom domain: https://myfilmjobs.com"
echo ""
echo "⚠️  This deployed to PRODUCTION - make sure your code is ready!" 