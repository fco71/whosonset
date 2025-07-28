#!/bin/bash

echo "🚀 Deployment Helper"
echo "==================="
echo ""
echo "Choose deployment type:"
echo "1) Development (safe for testing)"
echo "2) Production (myfilmjobs.com)"
echo "3) Show current branch"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo ""
    ./deploy-development.sh
    ;;
  2)
    echo ""
    ./deploy-production.sh
    ;;
  3)
    echo ""
    echo "Current branch: $(git branch --show-current)"
    echo "Available branches:"
    git branch
    ;;
  *)
    echo "Invalid choice. Please run again."
    exit 1
    ;;
esac 