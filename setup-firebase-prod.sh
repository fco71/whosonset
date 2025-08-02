#!/bin/bash

# 🔥 Firebase Production Setup Script
# This script helps you set up your production Firebase environment

echo "🔥 Firebase Production Setup"
echo "=============================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged into Firebase. Please login first:"
    echo "   firebase login"
    exit 1
fi

echo "✅ Firebase CLI is ready"

# Get production project ID
echo ""
echo "📋 Please provide your production Firebase project ID:"
read -p "Production Project ID: " PROD_PROJECT_ID

if [ -z "$PROD_PROJECT_ID" ]; then
    echo "❌ Project ID cannot be empty"
    exit 1
fi

echo ""
echo "🔧 Setting up Firebase for production..."

# Add production project to Firebase
echo "Adding production project to Firebase configuration..."
firebase use --add $PROD_PROJECT_ID

if [ $? -ne 0 ]; then
    echo "❌ Failed to add production project. Please check your project ID."
    exit 1
fi

# Update package.json with production project ID
echo "Updating package.json with production project ID..."
sed -i.bak "s/your-prod-project-id/$PROD_PROJECT_ID/g" package.json

# Create .env.production template
echo "Creating .env.production template..."
cat > .env.production.template << EOF
# Production Environment Configuration
# Copy this file to .env.production and fill in your actual values

REACT_APP_FIREBASE_API_KEY=your_prod_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=$PROD_PROJECT_ID.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=$PROD_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=$PROD_PROJECT_ID.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_prod_messaging_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_prod_app_id_here
REACT_APP_ENV=production
EOF

echo ""
echo "✅ Firebase production setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to Firebase Console: https://console.firebase.google.com/"
echo "2. Select your project: $PROD_PROJECT_ID"
echo "3. Set up Authentication, Firestore, and Storage"
echo "4. Copy your Firebase config to .env.production"
echo "5. Run the deployment checklist:"
echo "   cat FIREBASE_MIGRATION_CHECKLIST.md"
echo ""
echo "🚀 To deploy everything:"
echo "   firebase deploy --project $PROD_PROJECT_ID"
echo ""
echo "📁 Files created:"
echo "   - .env.production.template (fill in your values)"
echo "   - package.json updated with production project ID" 