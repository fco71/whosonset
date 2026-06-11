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

  it('constrains top-level notification creation to internal links + capped payloads', () => {
    const rules = readRepoFile('firestore.rules');
    // The top-level /notifications block is the one whose first allow line is
    // `read, update, delete: if ownsUserId(...)` (the users/ + crewProfiles/
    // subcollection notification blocks start with `allow read:` instead).
    const notifRules = rules.match(/match\s+\/notifications\/\{notificationId\}\s+\{\s*\n\s*allow read, update, delete: if ownsUserId\(resource\.data\);[\s\S]*?\n\s+\}/)?.[0] || '';

    expect(notifRules).toMatch(/allow\s+create:\s+if\s+signedIn\(\)/);
    // link must be absent or an internal relative path (blocks external/phishing URLs)
    expect(notifRules).toMatch(/request\.resource\.data\.link\.matches\(/);
    expect(notifRules).toMatch(/request\.resource\.data\.link\.size\(\)\s*<\s*500/);
    // payload length caps
    expect(notifRules).toMatch(/title\.size\(\)\s*<\s*300/);
    expect(notifRules).toMatch(/body\.size\(\)\s*<\s*2000/);
    // must NOT regress to the old unconstrained create
    expect(notifRules).not.toMatch(/allow\s+create:\s+if\s+signedIn\(\)\s+&&\s+request\.resource\.data\.userId\s+is\s+string;/);
  });

  it('keeps project-management collections scoped to project access instead of any signed-in user', () => {
    const rules = readRepoFile('firestore.rules');
    const projectScopedCollections = [
      'tasks',
      'projectCrew',
      'projectBudgets',
      'projectTimelines',
      'projectDocuments',
      'projectMilestones',
      'projectBudget',
      'collaborativeTasks',
      'breakdownElements',
    ];

    expect(rules).toMatch(/function\s+isProjectParticipantData/);
    expect(rules).toMatch(/function\s+canAccessProject/);
    expect(rules).toMatch(/function\s+canAccessProjectScopedData/);
    expect(rules).toMatch(/data\.crewMemberIds\s+is\s+list/);
    expect(rules).toMatch(/data\.createdBy\s+==\s+request\.auth\.uid/);

    projectScopedCollections.forEach(collectionName => {
      const collectionRules = rules.match(new RegExp(`match\\s+\\/${collectionName}\\/\\{[^}]+\\}\\s+\\{[\\s\\S]*?\\n\\s+\\}`))?.[0] || '';

      expect(collectionRules).toMatch(/canAccessProjectScopedData\(resource\.data\)/);
      expect(collectionRules).toMatch(/canAccessProjectScopedData\(request\.resource\.data\)/);
      expect(collectionRules).not.toMatch(/allow\s+read,\s+write:\s+if\s+signedIn\(\)/);
      expect(collectionRules).not.toMatch(/allow\s+read,\s+write:\s+if\s+request\.auth\s*!=\s*null/);
    });
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

  it('keeps screenplay tags aligned with annotation moderation rules', () => {
    const rules = readRepoFile('firestore.rules');
    const tagRules = rules.match(/match\s+\/screenplayTags\/\{tagId\}\s+\{[\s\S]*?\n\s+\}\n\n\s+match\s+\/screenplaySessions/)?.[0] || '';

    expect(tagRules).toMatch(/allow\s+update:\s+if\s+keepsAnnotationIdentity/);
    expect(tagRules).toMatch(/isAnnotationResolveUpdate\(request\.resource\.data,\s+resource\.data\)/);
    expect(tagRules).toMatch(/allow\s+delete:\s+if\s+canModerateAnnotationData\(resource\.data\)/);
    expect(tagRules).not.toMatch(/allow\s+update,\s+delete:\s+if\s+signedIn\(\)\s+&&\s+canAccessScreenplay/);
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

  it('keeps supervisor self-election gated by admin-granted teacherRoles, not user-writable profile fields', () => {
    const rules = readRepoFile('firestore.rules');
    const hub = readRepoFile('src/components/Collaboration/CollaborationHub.tsx');

    // The privilege function must read teacherRoles/{uid}, which only the Admin SDK can write.
    expect(rules).toMatch(/function\s+isVerifiedTeacher\(uid\)\s*\{\s*\n\s*return\s+exists\(\/databases\/\$\(database\)\/documents\/teacherRoles\/\$\(uid\)\);/);
    expect(rules).toMatch(/isVerifiedTeacher\(uid\)\s+&&/);

    // teacherRoles must stay client-write-locked and self-read-only.
    const teacherRoleRules = rules.match(/match\s+\/teacherRoles\/\{userId\}\s+\{[\s\S]*?\n\s+\}/)?.[0] || '';
    expect(teacherRoleRules).toMatch(/allow\s+read:\s+if\s+signedIn\(\)\s+&&\s+request\.auth\.uid\s+==\s+userId;/);
    expect(teacherRoleRules).toMatch(/allow\s+write:\s+if\s+false;/);

    // Must NOT regress to gating privileges on user-writable crewProfiles fields.
    expect(rules).not.toMatch(/crewProfiles\/\$\(uid\)\)\.data\.isTeacher/);
    expect(rules).not.toMatch(/crewProfiles\/\$\(uid\)\)\.data\.profileType/);
    expect(rules).not.toMatch(/function\s+profileIsTeacher/);

    // The client teacher-action gate must read teacherRoles, not crewProfiles flags.
    expect(hub).toMatch(/getDoc\(doc\(db,\s*'teacherRoles',\s*currentUser\.uid\)\)/);
    expect(hub).not.toMatch(/data\?\.isTeacher\s*===\s*true\s*\|\|\s*data\?\.profileType\s*===\s*'teacher'/);
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
