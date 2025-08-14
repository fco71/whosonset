#!/bin/bash

# Create backup directory with timestamp on desktop
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$HOME/Desktop/firestore-backup-$TIMESTAMP"

echo "🔄 Starting Firestore backup to Desktop..."
echo "📁 Backup location: $BACKUP_DIR"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Export all Firestore data
echo "📦 Exporting all Firestore collections..."
firebase firestore:export "$BACKUP_DIR" --project=my-film-jobs

if [ $? -eq 0 ]; then
    echo "✅ Firestore backup completed successfully!"
    echo "📁 Backup saved to: $BACKUP_DIR"
    
    # Create backup info
    cat > "$BACKUP_DIR/backup-info.txt" << EOF
Firestore Backup Info
=====================
Timestamp: $(date)
Project: my-film-jobs
Backup Location: $BACKUP_DIR
Created by: Backup Script
EOF
    
    echo "📄 Backup info saved to: $BACKUP_DIR/backup-info.txt"
    echo "🎉 Backup is now on your Desktop!"
else
    echo "❌ Firestore backup failed!"
    exit 1
fi
