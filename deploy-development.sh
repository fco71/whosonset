#!/bin/bash

echo "🧪 Starting DEVELOPMENT deployment..."

# Check if we're on develop branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ]; then
    echo "⚠️  Warning: You're not on the develop branch (currently on $CURRENT_BRANCH)"
    echo "   Deploying from $CURRENT_BRANCH to development..."
fi

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Firebase Hosting (Development)
echo "🌐 Deploying to DEVELOPMENT..."
firebase deploy --only hosting:development

if [ $? -ne 0 ]; then
    echo "❌ Development deployment failed!"
    exit 1
fi

echo "✅ DEVELOPMENT deployment completed successfully!"
echo "🧪 Your app is now live at: https://my-film-jobs.web.app"
echo ""
echo "💡 This is the DEVELOPMENT version - safe to test changes!" 