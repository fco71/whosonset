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

  it('keeps workspace listing scoped to membership', () => {
    const rules = readRepoFile('firestore.rules');
    const workspaceRules = rules.match(/match\s+\/workspaces\/\{workspaceId\}\s+\{[\s\S]*?\n\s+\}\n\n\s+match\s+\/collaborationSessions/)?.[0] || '';

    expect(rules).toMatch(/function\s+isWorkspaceMemberData/);
    expect(rules).toMatch(/match\s+\/workspaceMemberships\/\{membershipId\}/);
    expect(rules).toMatch(/allow\s+get,\s+list:\s+if\s+signedIn\(\)\s+&&\s+resource\.data\.userId\s+==\s+request\.auth\.uid/);
    expect(workspaceRules).toMatch(/allow\s+list:\s+if\s+false;/);
    expect(rules).not.toMatch(/allow\s+list:\s+if\s+signedIn\(\);/);
  });

  it('keeps the workspace activity log member-scoped and append-only', () => {
    const rules = readRepoFile('firestore.rules');
    const activityRules = rules.match(/match\s+\/workspaceActivity\/\{activityId\}\s+\{[\s\S]*?\n\s+\}/)?.[0] || '';

    expect(activityRules).toMatch(/allow\s+read:\s+if\s+canAccessWorkspace\(resource\.data\.workspaceId\)/);
    expect(activityRules).toMatch(/request\.resource\.data\.actorUid\s+==\s+request\.auth\.uid/);
    expect(activityRules).toMatch(/allow\s+update:\s+if\s+false;/);
    expect(activityRules).toMatch(/allow\s+delete:\s+if\s+signedIn\(\)\s+&&\s+isWorkspaceOwner/);
  });

  it('keeps workspace invitation responses on the callable/Admin SDK path', () => {
    const rules = readRepoFile('firestore.rules');
    const invitationRules = rules.match(/match\s+\/workspaceInvitations\/\{invitationId\}\s+\{[\s\S]*?\n\s+\}/)?.[0] || '';

    expect(invitationRules).toMatch(/request\.resource\.data\.inviterId\s+==\s+request\.auth\.uid/);
    expect(invitationRules).toMatch(/isWorkspaceOwner\(request\.resource\.data\.workspaceId,\s+request\.auth\.uid\)/);
    expect(invitationRules).toMatch(/request\.resource\.data\.status\s+==\s+'pending'/);
    expect(invitationRules).toMatch(/allow\s+update:\s+if\s+false;/);
  });

  it('keeps screenplay updates field-scoped', () => {
    const rules = readRepoFile('firestore.rules');

    expect(rules).toMatch(/function\s+isScreenplayContentUpdate/);
    expect(rules).toMatch(/function\s+isScreenplayAccessUpdate/);
    expect(rules).toMatch(/function\s+isScreenplayReviewStatusUpdate/);
    expect(rules).toMatch(/function\s+isScreenplayTeamMemberData/);
    expect(rules).toMatch(/data\.teamMembers\.hasAny\(\[request\.auth\.uid\]\)/);
    expect(rules).toMatch(/allow\s+get:\s+if\s+isScreenplayMemberData\(resource\.data\)/);
    expect(rules).toMatch(/allow\s+list:\s+if\s+isScreenplayTeamMemberData\(resource\.data\)/);
    expect(rules).toMatch(/affectedKeys\(\)\.hasOnly\(\[\s*'fountainSource'/);
    expect(rules).toMatch(/affectedKeys\(\)\.hasOnly\(\[\s*'teamMembers'/);
    expect(rules).toMatch(/affectedKeys\(\)\.hasOnly\(\[\s*'reviewStatus'/);
    expect(rules).toMatch(/newData\.reviewStatus\s+in\s+\['draft',\s+'submitted',\s+'changes_requested',\s+'approved'\]/);
    expect(rules).not.toMatch(/allow\s+update:\s+if\s+canEditScreenplayData\(resource\.data\)\s+&&/);
  });

  it('keeps supervisor annotations protected from broad participant updates', () => {
    const rules = readRepoFile('firestore.rules');
    const annotationRules = rules.match(/match\s+\/screenplayAnnotations\/\{annotationId\}\s+\{[\s\S]*?\n\s+\}\n\n\s+match\s+\/screenplayTags/)?.[0] || '';

    expect(rules).toMatch(/function\s+canModerateAnnotationData/);
    expect(rules).toMatch(/function\s+canResolveAnnotationData/);
    expect(rules).toMatch(/function\s+isAnnotationResolveUpdate/);
    expect(rules).toMatch(/canResolveAnnotationData\(oldData\)\s+&&\s+newData\.diff\(oldData\)\.affectedKeys\(\)\.hasOnly\(\['resolved'\]\)/);
    expect(rules).toMatch(/data\.get\('supervisorAtAuthorTime',\s+false\)\s+==\s+true\s+&&\s+isScreenplayManager\(data\.screenplayId,\s+request\.auth\.uid\)/);
    expect(annotationRules).toMatch(/allow\s+update:\s+if\s+keepsAnnotationIdentity/);
    expect(annotationRules).toMatch(/allow\s+delete:\s+if\s+canModerateAnnotationData\(resource\.data\)/);
    expect(annotationRules).not.toMatch(/allow\s+update,\s+delete:\s+if\s+signedIn\(\)\s+&&\s+canAccessScreenplay/);
  });

  it('keeps screenplay history queries aligned with workspace-scoped activity rules', () => {
    const viewer = readRepoFile('src/components/Collaboration/ScreenplayViewer.tsx');

    expect(viewer).toMatch(/where\('workspaceId',\s*'==',\s*screenplayWorkspaceId\)/);
    expect(viewer).toMatch(/where\('targetId',\s*'==',\s*screenplay\.id\)/);
    expect(viewer).toMatch(/currentUser\?\.uid,\s*screenplay\.id,\s*screenplayWorkspaceId/);
  });

  it('does not run the denied screenplay teamMembers collection query', () => {
    const hub = readRepoFile('src/components/Collaboration/CollaborationHub.tsx');

    expect(hub).not.toMatch(/where\('teamMembers',\s*'array-contains'/);
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
