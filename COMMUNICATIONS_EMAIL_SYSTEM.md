# Communications & Email Notification System

## Overview

The My Film Jobs platform now includes a comprehensive communications and email notification system that handles both in-app notifications and email notifications. This system is designed to keep users informed about important events and activities across the platform.

## Architecture

### Components

1. **Email Service** (`functions/src/emailService.ts`)
   - Handles email sending via SendGrid and Nodemailer
   - Provides email templates for different notification types
   - Supports HTML and text email formats

2. **Notification Service** (`functions/src/notificationService.ts`)
   - Manages both in-app and email notifications
   - Integrates with the Email Service
   - Handles different notification types

3. **User Preferences Service** (`src/utilities/userPreferencesService.ts`)
   - Manages user notification preferences
   - Controls email and push notification settings
   - Provides granular control over notification types

4. **Notification Settings UI** (`src/components/NotificationSettings.tsx`)
   - User interface for managing notification preferences
   - Real-time settings updates
   - Intuitive toggle controls

5. **Firebase Functions** (`functions/src/index.ts`)
   - Trigger-based notification system
   - Real-time event handling
   - Automatic email and in-app notification dispatch

## Notification Types

### 1. Job Application Notifications
- **Trigger**: New job application submitted
- **Recipients**: Job poster
- **Content**: Applicant details, job title, company name
- **Actions**: View application, respond to applicant

### 2. Project Invitation Notifications
- **Trigger**: New project invitation sent
- **Recipients**: Invited user
- **Content**: Project details, role, inviter information
- **Actions**: Accept/decline invitation

### 3. Task Assignment Notifications
- **Trigger**: New task assigned to user
- **Recipients**: Assigned user
- **Content**: Task details, project name, due date
- **Actions**: View task, update status

### 4. Message Notifications
- **Trigger**: New message received
- **Recipients**: Message receiver
- **Content**: Sender name, message preview
- **Actions**: View conversation, reply

### 5. Project Update Notifications
- **Trigger**: Project details updated
- **Recipients**: Project crew members
- **Content**: Update type, updater name, project name
- **Actions**: View updated project

### 6. Application Status Update Notifications
- **Trigger**: Job application status changed
- **Recipients**: Applicant
- **Content**: Status change, job details
- **Actions**: View application details

## Email Templates

### Template Features
- **Responsive Design**: Mobile-friendly email layouts
- **Brand Consistency**: My Film Jobs branding and colors
- **Action Buttons**: Direct links to relevant pages
- **Personalization**: User-specific content and data
- **Fallback Support**: Text versions for email clients

### Template Types
1. **Job Application Template**
   - Professional layout with application details
   - Direct link to application review

2. **Project Invitation Template**
   - Clear project information
   - Accept/decline action buttons

3. **Task Assignment Template**
   - Task details with due date
   - Direct link to task management

4. **Message Notification Template**
   - Sender information and message preview
   - Link to conversation

5. **Project Update Template**
   - Change summary and updater information
   - Link to updated project

6. **Application Status Template**
   - Status change notification
   - Professional formatting

## User Preferences

### Notification Settings
- **Email Notifications**: Enable/disable email notifications
- **Push Notifications**: Enable/disable browser push notifications
- **Notification Frequency**: Immediate, daily digest, or weekly digest
- **Granular Control**: Toggle specific notification types

### Supported Notification Types
- Job Application Notifications
- Project Invitation Notifications
- Task Assignment Notifications
- Message Notifications
- Project Update Notifications
- Application Status Notifications

## Firebase Functions

### Function Triggers
1. **`notifyJobPosterOnApplication`**
   - Trigger: `jobApplications/{applicationId}` document created
   - Action: Notify job poster of new application

2. **`notifyProjectInvitation`**
   - Trigger: `projectInvitations/{invitationId}` document created
   - Action: Notify invitee of project invitation

3. **`notifyTaskAssignment`**
   - Trigger: `tasks/{taskId}` document created
   - Action: Notify assignee of new task

4. **`notifyNewMessage`**
   - Trigger: `conversations/{conversationId}/messages/{messageId}` document created
   - Action: Notify receiver of new message

5. **`notifyProjectUpdate`**
   - Trigger: `Projects/{projectId}` document updated
   - Action: Notify crew members of project changes

6. **`notifyApplicationStatusUpdate`**
   - Trigger: `jobApplications/{applicationId}` document updated
   - Action: Notify applicant of status change

## Email Service Configuration

### Environment Variables
```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key

# SMTP Configuration (fallback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Email Configuration
FROM_EMAIL=noreply@myfilmjobs.com
FRONTEND_URL=https://myfilmjobs.com
```

### Email Providers
1. **Primary**: SendGrid (recommended for production)
2. **Fallback**: Nodemailer with SMTP (Gmail, etc.)

## Implementation Guide

### 1. Setup Email Service
```bash
# Install dependencies
cd functions
npm install nodemailer @sendgrid/mail handlebars

# Configure environment variables
# Add to .env or Firebase Functions environment
```

### 2. Deploy Firebase Functions
```bash
# Deploy functions
firebase deploy --only functions

# Set environment variables
firebase functions:config:set sendgrid.api_key="your_api_key"
firebase functions:config:set email.from="noreply@myfilmjobs.com"
firebase functions:config:set app.frontend_url="https://myfilmjobs.com"
```

### 3. Initialize User Preferences
```typescript
// Initialize user preferences when user signs up
await UserPreferencesService.initializeUserPreferences(userId);
```

### 4. Test Notifications
```typescript
// Test email notification
await NotificationService.createNotification({
  userId: 'test-user-id',
  type: 'test_notification',
  message: 'Test notification',
  sendEmail: true,
  emailData: {
    to: 'test@example.com',
    template: EmailService.getJobApplicationTemplate('Test User', 'Test Job', 'Test Company'),
    data: { /* template data */ }
  }
});
```

## Best Practices

### Email Notifications
1. **Respect User Preferences**: Always check user's email notification settings
2. **Template Consistency**: Use consistent branding and formatting
3. **Clear Call-to-Action**: Include relevant action buttons
4. **Fallback Support**: Provide text versions for email clients
5. **Rate Limiting**: Implement rate limiting to prevent spam

### In-App Notifications
1. **Real-time Updates**: Use Firebase real-time listeners
2. **Unread Count**: Track and display unread notification count
3. **Notification Center**: Provide centralized notification management
4. **Action Handling**: Enable direct actions from notifications

### User Experience
1. **Granular Control**: Allow users to customize notification types
2. **Frequency Options**: Provide different notification frequency options
3. **Easy Management**: Intuitive settings interface
4. **Default Settings**: Sensible defaults for new users

## Monitoring and Analytics

### Key Metrics
- Email delivery rates
- Notification open rates
- User engagement with notifications
- Settings adoption rates

### Error Handling
- Email delivery failures
- Template rendering errors
- User preference loading errors
- Function execution errors

## Security Considerations

### Data Protection
- User email addresses are protected
- Notification content is sanitized
- Template data is validated

### Rate Limiting
- Email sending rate limits
- Notification frequency controls
- User preference enforcement

### Privacy Compliance
- GDPR-compliant email practices
- User consent for notifications
- Easy opt-out mechanisms

## Troubleshooting

### Common Issues
1. **Email Not Sending**
   - Check SendGrid API key
   - Verify SMTP configuration
   - Check Firebase Functions logs

2. **Notifications Not Appearing**
   - Verify user preferences
   - Check Firebase Functions deployment
   - Review function triggers

3. **Template Rendering Errors**
   - Validate template syntax
   - Check data structure
   - Test with sample data

### Debug Tools
- Firebase Functions logs
- Email service logs
- User preference debugging
- Template testing utilities

## Future Enhancements

### Planned Features
1. **Advanced Email Templates**: More sophisticated email designs
2. **Notification Analytics**: Detailed notification performance metrics
3. **Smart Notifications**: AI-powered notification timing
4. **Multi-language Support**: Internationalized email templates
5. **Rich Media**: Support for images and attachments in emails

### Integration Opportunities
1. **Slack Integration**: Send notifications to Slack channels
2. **SMS Notifications**: Text message notifications
3. **Webhook Support**: External system integrations
4. **API Endpoints**: RESTful notification APIs

## Support and Maintenance

### Regular Tasks
- Monitor email delivery rates
- Update email templates
- Review user feedback
- Optimize notification timing
- Update dependencies

### Documentation Updates
- Keep this documentation current
- Update configuration examples
- Add new notification types
- Document troubleshooting steps 