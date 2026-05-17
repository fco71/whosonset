import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

const readRepoFile = (filePath: string) =>
  readFileSync(path.join(process.cwd(), filePath), 'utf8');

describe('security rules guardrails', () => {
  it('does not reintroduce the broad Firestore top-level collection wildcard', () => {
    const rules = readRepoFile('firestore.rules');

    expect(rules).not.toMatch(/match\s+\/\{collectionName\}\/\{docId\}/);
    expect(rules).not.toMatch(/allow\s+read,\s*write:\s*if\s+request\.auth\s*!=\s*null\s*&&\s*collectionName/);
  });

  it('keeps confidential Storage write paths scoped by user id', () => {
    const rules = readRepoFile('storage.rules');

    expect(rules).toMatch(/match\s+\/screenplays\/\{userId\}\/\{allPaths=\*\*\}/);
    expect(rules).toMatch(/match\s+\/project-documents\/\{projectId\}\/\{userId\}\/\{allPaths=\*\*\}/);
    expect(rules).toMatch(/match\s+\/chat-uploads\/\{userId\}\/\{allPaths=\*\*\}/);
    expect(rules).not.toMatch(/match\s+\/screenplays\/\{allPaths=\*\*\}/);
    expect(rules).not.toMatch(/allow\s+write:\s*if\s+request\.auth\s*!=\s*null/);
  });

  it('keeps known credential-shaped values out of tracked documentation', () => {
    const docs = [
      readRepoFile('PROJECT_OVERVIEW.md'),
      readRepoFile('docs/firebase/SECURITY_FIX_SUMMARY.md'),
      readRepoFile('docs/email/GMAIL_FIX_GUIDE.md'),
      readRepoFile('docs/email/GMAIL_EMAIL_SETUP_GUIDE.md'),
    ].join('\n');

    expect(docs).not.toMatch(/AIzaSy[A-Za-z0-9_-]+/);
    expect(docs).not.toMatch(/`[a-z]{4} [a-z]{4} [a-z]{4} [a-z]{4}`/);
    expect(docs).not.toMatch(/`[a-z]{16}`/);
  });
});
