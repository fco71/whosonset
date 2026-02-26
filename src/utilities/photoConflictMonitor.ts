import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export interface PhotoConflict {
  photoUrl: string;
  users: Array<{
    uid: string;
    name: string;
    displayName: string;
  }>;
  conflictCount: number;
}

export interface PhotoConflictReport {
  totalConflicts: number;
  conflicts: PhotoConflict[];
  timestamp: string;
}

/**
 * Monitors and detects photo URL conflicts across all crew profiles
 * This helps prevent the issue where multiple users show the same photo
 */
export class PhotoConflictMonitor {
  
  /**
   * Scans all crew profiles and returns a report of photo URL conflicts
   */
  static async scanForConflicts(): Promise<PhotoConflictReport> {
    try {
      console.log('🔍 Starting photo conflict scan...');
      
      const snapshot = await getDocs(collection(db, 'crewProfiles'));
      const photoUrlMap = new Map<string, Array<{
        uid: string;
        name: string;
        displayName: string;
      }>>();
      
      // Group users by photo URL
      snapshot.forEach(doc => {
        const data = doc.data();
        const photoUrl = data.profileImageUrl || data.photoURL;
        
        // Skip empty URLs and default avatars
        if (!photoUrl || photoUrl === '/bust-avatar.svg' || photoUrl.startsWith('blob:')) {
          return;
        }
        
        const userInfo = {
          uid: doc.id,
          name: data.name || 'Unknown',
          displayName: data.displayName || data.name || 'Unknown'
        };
        
        const existingUsers = photoUrlMap.get(photoUrl) || [];
        existingUsers.push(userInfo);
        photoUrlMap.set(photoUrl, existingUsers);
      });
      
      // Find conflicts (URLs used by more than one user)
      const conflicts: PhotoConflict[] = [];
      photoUrlMap.forEach((users, photoUrl) => {
        if (users.length > 1) {
          conflicts.push({
            photoUrl,
            users,
            conflictCount: users.length
          });
        }
      });
      
      const report: PhotoConflictReport = {
        totalConflicts: conflicts.length,
        conflicts,
        timestamp: new Date().toISOString()
      };
      
      // Log results in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Photo Conflict Scan Results:', report);
        
        if (conflicts.length > 0) {
          console.warn('⚠️ PHOTO CONFLICTS DETECTED:');
          conflicts.forEach(conflict => {
            console.warn(`  URL: ${conflict.photoUrl}`);
            console.warn(`  Users: ${conflict.users.map(u => u.displayName).join(', ')}`);
            console.warn(`  Count: ${conflict.conflictCount}`);
          });
        } else {
          console.log('✅ No photo conflicts found');
        }
      }
      
      return report;
      
    } catch (error) {
      console.error('❌ Error scanning for photo conflicts:', error);
      return {
        totalConflicts: 0,
        conflicts: [],
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * Checks if a specific photo URL has conflicts
   */
  static async checkPhotoUrl(photoUrl: string, excludeUserId?: string): Promise<PhotoConflict | null> {
    try {
      const snapshot = await getDocs(collection(db, 'crewProfiles'));
      const conflictingUsers: Array<{
        uid: string;
        name: string;
        displayName: string;
      }> = [];
      
      snapshot.forEach(doc => {
        if (excludeUserId && doc.id === excludeUserId) {
          return;
        }
        
        const data = doc.data();
        const userPhotoUrl = data.profileImageUrl || data.photoURL;
        
        if (userPhotoUrl === photoUrl) {
          conflictingUsers.push({
            uid: doc.id,
            name: data.name || 'Unknown',
            displayName: data.displayName || data.name || 'Unknown'
          });
        }
      });
      
      if (conflictingUsers.length > 0) {
        return {
          photoUrl,
          users: conflictingUsers,
          conflictCount: conflictingUsers.length
        };
      }
      
      return null;
      
    } catch (error) {
      console.error('❌ Error checking photo URL conflicts:', error);
      return null;
    }
  }
  
  /**
   * Generates a summary report for admin monitoring
   */
  static generateSummaryReport(report: PhotoConflictReport): string {
    if (report.totalConflicts === 0) {
      return '✅ No photo conflicts detected in the system.';
    }
    
    let summary = `⚠️ PHOTO CONFLICT REPORT (${report.timestamp})\n`;
    summary += `Total Conflicts: ${report.totalConflicts}\n\n`;
    
    report.conflicts.forEach((conflict, index) => {
      summary += `${index + 1}. URL: ${conflict.photoUrl}\n`;
      summary += `   Users (${conflict.conflictCount}): ${conflict.users.map(u => u.displayName).join(', ')}\n\n`;
    });
    
    return summary;
  }
}

/**
 * Convenience function for quick conflict scanning
 */
export const scanPhotoConflicts = PhotoConflictMonitor.scanForConflicts;

/**
 * Convenience function for checking specific photo URL
 */
export const checkPhotoConflict = PhotoConflictMonitor.checkPhotoUrl;

/**
 * Admin utility - Run this in browser console to scan for conflicts
 * Usage: await window.scanPhotoConflicts()
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).scanPhotoConflicts = scanPhotoConflicts;
  (window as any).checkPhotoConflict = PhotoConflictMonitor.checkPhotoUrl;
  
  console.log('🔧 Photo conflict monitoring utilities available in window:');
  console.log('  - await window.scanPhotoConflicts() // Scan all profiles');
  console.log('  - await window.checkPhotoConflict(url, userId) // Check specific URL');
}
