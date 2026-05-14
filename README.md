# WhosOnSet

Social, jobs, and collaboration platform for the film industry. Live at [myfilmjobs.com](https://myfilmjobs.com).

## Stack

- **Frontend**: React 18 + TypeScript, Webpack 5, TailwindCSS + SCSS modules
- **Backend**: Firebase — Firestore (database), Cloud Functions (Node), Firebase Storage, Firebase Auth, Firebase Hosting
- **Email**: Gmail SMTP via a Cloud Function (`functions/src/emailService.ts`)
- **i18n**: i18next (English + Spanish)
- **Tests**: Vitest

## Setup

```sh
npm install
cp env-template.txt .env   # then fill in Firebase keys
npm run dev                # webpack dev server on http://localhost:8080
```

The Firebase project is `my-film-jobs` (see `.firebaserc`). You need a Firebase account with access to deploy.

## Common commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production webpack build into `dist/` |
| `npm run build:prod` | Same, with `REACT_APP_ENV=production` |
| `npm test` | Vitest (watch) |
| `npm run test:run` | Vitest single run |
| `firebase deploy` | Deploy hosting + rules + functions |
| `firebase deploy --only hosting` | Frontend only |
| `firebase deploy --only firestore:rules` | Firestore rules only |
| `firebase deploy --only storage:rules` | Storage rules only |
| `firebase deploy --only functions` | Cloud functions only |

## Project layout

```
src/
  components/   React components (feature-grouped where possible)
  pages/        Route-level pages
  contexts/     React contexts (Auth, Project)
  services/     Service modules (some still live in utilities/)
  utilities/    Pure utilities + legacy services
  hooks/        Custom React hooks
  models/       TypeScript domain models
  router.tsx, firebase.ts, App.tsx

functions/      Firebase Cloud Functions source
scripts/        Seed, backup, and migration scripts
public/         Static assets
```

## Data safety

This is a **live production site** with real user data in Firestore. Backups are configured via `scripts/setup-firestore-backups.sh` (native scheduled backups + PITR). Lost data is not recoverable from other sources.

**Before making any change that touches Firestore data, rules, or schema, see [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) §⚠️ Data safety.**

## Where to look next

- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) — current state, in-flight cleanup work, known issues
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — UI patterns
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) — deploy workflow

Other top-level `*.md` files contain historical handoffs and feature-specific notes. They are kept for reference but most are stale; treat `PROJECT_OVERVIEW.md` as the source of truth.
