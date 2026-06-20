// DEPRECATED & INTENTIONALLY NEUTRALIZED (2026-06).
//
// The previous JobSearchPage queried the `jobPostings` collection with NO status filter
// (it loaded the 50 most recent jobs of any status and filtered only by department /
// location / type / level / remote). That would have surfaced archived, closed, and draft
// jobs to visitors. It was never wired into the router (zero importers), so it was dead
// code, but it was a latent leak if anyone re-enabled it.
//
// The live, status-filtered job list is `src/pages/JobsPage.tsx`, which queries
// `where('status', 'in', ['published', 'active'])`. Use that. Do not revive this file's
// old implementation. (It is replaced rather than deleted only because the tooling could
// not unlink it in this environment — treat it as deleted.)
import React from 'react';
import { Navigate } from 'react-router-dom';

const JobSearchPage: React.FC = () => <Navigate to="/jobs" replace />;

export default JobSearchPage;
