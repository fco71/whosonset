# Email Notification Testing Guide

## 🎯 **Current Issues & Solutions**

### **Problem 1: User not receiving email notifications**
- **Cause:** Firebase Functions may not be deployed or authentication issues
- **Solution:** Test locally first, then deploy functions

### **Problem 2: Too many chat notifications**
- **Cause:** Each message triggers an email notification
- **Solution:** Implement consolidated daily notifications

## 🧪 **Testing Steps**

### **Step 1: Local Email Testing**
```bash
# Test email configuration
cd functions
node test-email.js
```

### **Step 2: Firebase Functions Testing**
```bash
# Deploy test functions
firebase deploy --only functions:emailTest,functions:testEmail,functions:testNotification

# Test via curl
curl -X POST https://us-central1-my-film-jobs.cloudfunctions.net/testEmail \
  -H "Content-Type: application/json" \
  -d '{"to":"iam@myfilmjobs.com","subject":"Test","message":"Hello from My Film Jobs"}'
```

### **Step 3: In-App Notification Testing**
1. Go to `/test-notifications` page
2. Click "Send Test Message" 
3. Check notification center
4. Verify email is sent

## 📧 **Consolidated Daily Notifications**

### **Implementation Plan:**

1. **Create Daily Digest Service**
   - Collect all notifications for each user
   - Group by type (messages, job applications, etc.)
   - Send one email per day with summary

2. **User Preferences**
   - Add "Daily Digest" option to notification settings
   - Allow users to choose frequency: immediate, daily, weekly

3. **Smart Notification Logic**
   - For messages: Send immediate notification for first message, then daily digest
   - For other notifications: Send immediate notification
   - Allow users to override preferences

### **Benefits:**
- ✅ Reduces email spam
- ✅ Better user experience
- ✅ Configurable preferences
- ✅ Maintains important notifications

## 🔧 **Implementation Steps**

### **1. Create Daily Digest Service**
```typescript
// functions/src/dailyDigestService.ts
export class DailyDigestService {
  static async sendDailyDigest(userId: string): Promise<void> {
    // Collect all unread notifications
    // Group by type
    // Send consolidated email
  }
}
```

### **2. Update User Preferences**
```typescript
// Add to UserPreferences interface
interface UserPreferences {
  // ... existing fields
  messageNotificationFrequency: 'immediate' | 'daily' | 'weekly';
  dailyDigestEnabled: boolean;
  digestTime: string; // e.g., "09:00"
}
```

### **3. Update Notification Service**
```typescript
// Modify notification logic
if (userPreferences.messageNotificationFrequency === 'daily') {
  // Store for daily digest instead of sending immediately
  await this.storeForDailyDigest(userId, notification);
} else {
  // Send immediate notification
  await this.sendImmediateNotification(userId, notification);
}
```

## 🚀 **Quick Test Implementation**

### **Option 1: Test with Existing Functions**
1. Deploy current functions
2. Test email sending
3. Verify notifications work

### **Option 2: Implement Daily Digest First**
1. Create daily digest service
2. Add user preferences
3. Test consolidated notifications

## 📋 **Testing Checklist**

- [ ] **Email Configuration**
  - [ ] SMTP settings correct
  - [ ] Firebase Functions config set
  - [ ] Test email sends successfully

- [ ] **Function Deployment**
  - [ ] Functions deploy without errors
  - [ ] HTTP functions accessible
  - [ ] Firestore triggers working

- [ ] **Notification Flow**
  - [ ] Message triggers notification
  - [ ] Email sends to correct address
  - [ ] In-app notification appears

- [ ] **User Preferences**
  - [ ] Daily digest option available
  - [ ] Preferences save correctly
  - [ ] Notification frequency respected

## 🎯 **Next Steps**

1. **Fix Firebase Authentication**
   ```bash
   firebase login --reauth
   ```

2. **Deploy Functions**
   ```bash
   firebase deploy --only functions
   ```

3. **Test Email Sending**
   ```bash
   curl -X POST [function-url] -d '{"to":"iam@myfilmjobs.com","subject":"Test","message":"Hello"}'
   ```

4. **Implement Daily Digest**
   - Create digest service
   - Update user preferences
   - Test consolidated notifications

## 📞 **Support**

If testing fails:
1. Check Firebase Console logs
2. Verify email configuration
3. Test with simpler functions first
4. Check authentication status 