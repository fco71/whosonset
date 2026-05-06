import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

// Lazy load pages for better performance
const ProducerView = React.lazy(() => import('./pages/ProducerView'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const MyProjectsPage = React.lazy(() => import('./pages/MyProjectsPage'));
const SavedCrewProfilesPage = React.lazy(() => import('./pages/SavedCrewProfilesPage'));
const SavedProjectsPage = React.lazy(() => import('./pages/SavedProjectsPage'));
const CollectionsHubPage = React.lazy(() => import('./pages/CollectionsHubPage'));
const SocialPage = React.lazy(() => import('./pages/SocialPage'));
const CollaborationPage = React.lazy(() => import('./pages/CollaborationPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const JobsPage = React.lazy(() => import('./pages/JobsPage'));
const PostJobPage = React.lazy(() => import('./pages/PostJobPage'));
const JobDetailPage = React.lazy(() => import('./components/JobSearch/JobDetailPage'));
const DebugJobsPage = React.lazy(() => import('./pages/DebugJobsPage'));
const EditProfilePage = React.lazy(() => import('./pages/EditProfilePage'));
const PublicResumePage = React.lazy(() => import('./components/PublicResumePage'));
const ChatTestPage = React.lazy(() => import('./components/Chat/ChatTestPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const EmailVerificationPage = React.lazy(() => import('./pages/EmailVerificationPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const ApplicationDetailPage = React.lazy(() => import('./pages/ApplicationDetailPage'));
const JobApplicationForm = React.lazy(() => import('./components/JobSearch/JobApplicationForm'));
const JobApplicationDashboard = React.lazy(() => import('./components/JobSearch/JobApplicationDashboard'));
const ApplicationSuccessPage = React.lazy(() => import('./components/JobSearch/ApplicationSuccessPage'));
const EditJobApplication = React.lazy(() => import('./components/JobSearch/EditJobApplication'));
const JobPosterDashboard = React.lazy(() => import('./components/JobSearch/JobPosterDashboard'));
const JobApplicationsPage = React.lazy(() => import('./components/JobSearch/JobApplicationsPage'));
const JobApplicantsPage = React.lazy(() => import('./components/JobSearch/JobApplicantsPage'));
const AppliedJobsPage = React.lazy(() => import('./components/JobSearch/AppliedJobsPage'));
const SavedJobsPage = React.lazy(() => import('./components/JobSearch/SavedJobsPage'));
const ApplicationDashboard = React.lazy(() => import('./components/JobSearch/ApplicationDashboard'));
const ApplicationAnalytics = React.lazy(() => import('./components/JobSearch/ApplicationAnalytics'));
const JobPosterAnalytics = React.lazy(() => import('./components/JobSearch/JobPosterAnalytics'));
const ProjectsPage = React.lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = React.lazy(() => import('./pages/ProjectDetailPage'));
const ProjectDashboard = React.lazy(() => import('./pages/ProjectManagement/ProjectDashboard'));
const AddProject = React.lazy(() => import('./components/AddProject'));
const SimpleEmailTestPage = React.lazy(() => import('./pages/SimpleEmailTestPage'));
const EmailIntegrationTestPage = React.lazy(() => import('./pages/EmailIntegrationTestPage'));
const PasswordResetTestPage = React.lazy(() => import('./pages/PasswordResetTestPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('./pages/TermsOfServicePage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const PublicCrewPage = React.lazy(() => import('./pages/PublicCrewPage'));
const MyStudentsPage = React.lazy(() => import('./pages/MyStudentsPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));

// Import the main App component that will handle the layout
import App from './App';

export function createAppRouter() {
  return createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <HomePage /> },
        { 
          path: 'about', 
          element: <AboutPage />
        },
        {
          path: 'blog',
          element: <BlogPage />
        },
        {
          path: 'blog/page/:pageNumber',
          element: <BlogPage />
        },
        {
          path: 'blog/:postId',
          element: <BlogPostPage />
        },
        { 
          path: 'crew', 
          element: (
            <ProtectedRoute>
              <ProducerView />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'crew-public', 
          element: <PublicCrewPage />
        },
        { 
          path: 'projects', 
          element: (
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'projects/create', 
          element: (
            <ProtectedRoute>
              <AddProject />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'projects/:projectId', 
          element: (
            <ProtectedRoute>
              <ProjectDetailPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'projects/:projectId/manage', 
          element: (
            <ProtectedRoute>
              <ProjectDashboard />
            </ProtectedRoute>
          ) 
        },
        {
          // Teacher-only page that lists students who selected this user as
          // their teacher. The page itself enforces the access check (shows
          // "you're not a teacher" empty state for non-teacher users), so it
          // only needs the standard auth guard here.
          path: 'my-students',
          element: (
            <ProtectedRoute>
              <MyStudentsPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'email-test',
          element: <SimpleEmailTestPage />
        },
        { 
          path: 'email-integration-test', 
          element: <EmailIntegrationTestPage />
        },
        { 
          path: 'password-reset-test', 
          element: <PasswordResetTestPage />
        },
        { 
          path: 'login', 
          element: (
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          ) 
        },
        { 
          path: 'register', 
          element: (
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          ) 
        },
        { 
          path: 'verify-email', 
          element: (
            <ProtectedRoute>
              <EmailVerificationPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'forgot-password', 
          element: (
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          ) 
        },
        { 
          path: 'reset-password', 
          element: (
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          ) 
        },
        { 
          path: 'my-projects', 
          element: (
            <ProtectedRoute>
              <MyProjectsPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'saved-crew', 
          element: (
            <ProtectedRoute>
              <SavedCrewProfilesPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'saved-projects', 
          element: (
            <ProtectedRoute>
              <SavedProjectsPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'collections', 
          element: (
            <ProtectedRoute>
              <CollectionsHubPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'social', 
          element: (
            <ProtectedRoute>
              <SocialPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'chat', 
          element: (
            <ProtectedRoute>
              <ChatTestPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'collaboration', 
          element: (
            <ProtectedRoute>
              <CollaborationPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'settings', 
          element: (
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'edit-profile', 
          element: (
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          ) 
        },
        { path: 'resume/:uid', element: <PublicResumePage /> },
        { 
          path: 'jobs', 
          element: <JobsPage />
        },
        { 
          path: 'jobs/:jobId', 
          element: <JobDetailPage />
        },
        { 
          path: 'jobs/:jobId/apply', 
          element: (
            <ProtectedRoute>
              <JobApplicationForm />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'applications', 
          element: (
            <ProtectedRoute>
              <JobApplicationDashboard />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'applications/:applicationId', 
          element: (
            <ProtectedRoute>
              <ApplicationDetailPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'applications/:applicationId/edit', 
          element: (
            <ProtectedRoute>
              <EditJobApplication />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'applications/:applicationId/success', 
          element: (
            <ProtectedRoute>
              <ApplicationSuccessPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'jobs/posted', 
          element: (
            <ProtectedRoute>
              <JobPosterDashboard />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'jobs/:jobId/applications', 
          element: (
            <ProtectedRoute>
              <JobApplicantsPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'post-job', 
          element: (
            <ProtectedRoute>
              <PostJobPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'jobs/applied', 
          element: (
            <ProtectedRoute>
              <AppliedJobsPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'jobs/saved', 
          element: (
            <ProtectedRoute>
              <SavedJobsPage />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'applications/dashboard', 
          element: (
            <ProtectedRoute>
              <ApplicationDashboard />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'applications/analytics', 
          element: (
            <ProtectedRoute>
              <ApplicationAnalytics />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'jobs/analytics', 
          element: (
            <ProtectedRoute>
              <JobPosterAnalytics />
            </ProtectedRoute>
          ) 
        },
        { 
          path: 'privacy-policy', 
          element: <PrivacyPolicyPage />
        },
        { 
          path: 'terms-of-service', 
          element: <TermsOfServicePage />
        },
        { 
          path: 'contact', 
          element: <ContactPage />
        },
        ...(process.env.NODE_ENV === 'development' ? [{ path: 'debug-jobs', element: <DebugJobsPage /> }] : []),
      ],
    },
  ]);
} 
