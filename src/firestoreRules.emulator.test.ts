import { readFileSync } from 'fs';
import path from 'path';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { afterAll, afterEach, beforeAll, describe, it } from 'vitest';

const PROJECT_ID = 'demo-whosonset';
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(path.join(process.cwd(), 'firestore.rules'), 'utf8')
    }
  });
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('Firestore notification authority', () => {
  it('rejects top-level notification creation by an authenticated client', async () => {
    const db = testEnv.authenticatedContext('sender').firestore();
    await assertFails(setDoc(doc(db, 'notifications', 'spoofed'), {
      userId: 'victim',
      type: 'system',
      title: 'Spoofed',
      body: 'Spoofed',
      createdAt: Timestamp.now()
    }));
  });

  it('rejects legacy notification subcollection creation, including the caller own inbox', async () => {
    const db = testEnv.authenticatedContext('sender').firestore();
    await assertFails(setDoc(doc(db, 'users', 'victim', 'notifications', 'spoofed'), {
      userId: 'victim'
    }));
    await assertFails(setDoc(doc(db, 'users', 'sender', 'notifications', 'self'), {
      userId: 'sender'
    }));
    await assertFails(setDoc(doc(db, 'crewProfiles', 'sender', 'notifications', 'self'), {
      userId: 'sender'
    }));
  });

  it('allows recipients to read, mark, and delete server-created notifications', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'notifications', 'server-created'), {
        userId: 'recipient',
        type: 'system',
        title: 'Server notification',
        body: 'Server notification',
        isRead: false,
        read: false,
        createdAt: Timestamp.now()
      });
    });

    const recipientDb = testEnv.authenticatedContext('recipient').firestore();
    const otherDb = testEnv.authenticatedContext('other').firestore();
    const ref = doc(recipientDb, 'notifications', 'server-created');
    await assertSucceeds(getDoc(ref));
    await assertFails(getDoc(doc(otherDb, 'notifications', 'server-created')));
    await assertSucceeds(updateDoc(ref, { isRead: true, read: true }));
    await assertSucceeds(deleteDoc(ref));
  });
});

describe('follow notification source integrity', () => {
  it('allows only the request recipient to accept a legacy follow request', async () => {
    const senderDb = testEnv.authenticatedContext('sender').firestore();
    const recipientDb = testEnv.authenticatedContext('recipient').firestore();
    const senderRef = doc(senderDb, 'followRequests', 'request-1');
    const recipientRef = doc(recipientDb, 'followRequests', 'request-1');

    await assertSucceeds(setDoc(senderRef, {
      fromUserId: 'sender',
      toUserId: 'recipient',
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }));
    await assertFails(updateDoc(senderRef, {
      status: 'accepted',
      updatedAt: Timestamp.now()
    }));
    await assertSucceeds(updateDoc(recipientRef, {
      status: 'accepted',
      updatedAt: Timestamp.now()
    }));
  });

  it('allows only the followed user to accept a v2 follow request', async () => {
    const senderDb = testEnv.authenticatedContext('sender').firestore();
    const recipientDb = testEnv.authenticatedContext('recipient').firestore();
    const senderRef = doc(senderDb, 'follows', 'follow-1');
    const recipientRef = doc(recipientDb, 'follows', 'follow-1');

    await assertSucceeds(setDoc(senderRef, {
      followerId: 'sender',
      followingId: 'recipient',
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }));
    await assertFails(updateDoc(senderRef, {
      status: 'accepted',
      updatedAt: Timestamp.now()
    }));
    await assertSucceeds(updateDoc(recipientRef, {
      status: 'accepted',
      updatedAt: Timestamp.now()
    }));
  });
});

describe('screenplay notification source integrity', () => {
  it('allows mention recipient IDs but rejects a forged supervisor provenance flag', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'workspaces', 'workspace-1'), {
        ownerId: 'author',
        memberIds: ['author', 'student', 'mentioned', 'supervisor'],
        members: [
          { userId: 'author' },
          { userId: 'student' },
          { userId: 'mentioned' },
          { userId: 'supervisor' }
        ],
        supervisorIds: ['supervisor'],
        selfElectedSupervisors: [],
        viewerIds: []
      });
      await setDoc(doc(context.firestore(), 'screenplays', 'script-1'), {
        uploadedBy: 'author',
        teamMembers: ['student', 'mentioned', 'supervisor'],
        name: 'Test Script',
        workspaceId: 'workspace-1'
      });
    });

    const studentDb = testEnv.authenticatedContext('student').firestore();
    const baseAnnotation = {
      screenplayId: 'script-1',
      projectId: 'project-1',
      userId: 'student',
      userName: 'Student',
      userAvatar: '',
      annotation: '@mentioned please review',
      timestamp: Timestamp.now(),
      pageNumber: 1,
      position: { x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
      replies: [],
      resolved: false,
      mentionedUserIds: ['mentioned'],
      priority: 'medium'
    };

    await assertSucceeds(setDoc(doc(studentDb, 'screenplayAnnotations', 'valid'), {
      ...baseAnnotation,
      supervisorAtAuthorTime: false
    }));
    await assertFails(setDoc(doc(studentDb, 'screenplayAnnotations', 'forged'), {
      ...baseAnnotation,
      supervisorAtAuthorTime: true
    }));

    const supervisorDb = testEnv.authenticatedContext('supervisor').firestore();
    await assertSucceeds(setDoc(doc(supervisorDb, 'screenplayAnnotations', 'supervisor-note'), {
      ...baseAnnotation,
      userId: 'supervisor',
      userName: 'Supervisor',
      supervisorAtAuthorTime: true
    }));
  });
});

describe('verified teacher authority', () => {
  it('rejects cosmetic teacher self-election and allows only an admin-verified teacher to toggle self', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setDoc(doc(adminDb, 'crewProfiles', 'candidate'), {
        uid: 'candidate',
        isTeacher: true,
        profileType: 'teacher'
      });
      await setDoc(doc(adminDb, 'workspaces', 'workspace-teacher'), {
        ownerId: 'owner',
        memberIds: ['owner', 'candidate'],
        members: [{ userId: 'owner' }, { userId: 'candidate' }],
        supervisorIds: [],
        selfElectedSupervisors: [],
        viewerIds: [],
        updatedAt: Timestamp.now()
      });
    });

    const candidateDb = testEnv.authenticatedContext('candidate').firestore();
    const workspaceRef = doc(candidateDb, 'workspaces', 'workspace-teacher');
    const roleRef = doc(candidateDb, 'teacherRoles', 'candidate');

    await assertFails(updateDoc(workspaceRef, {
      selfElectedSupervisors: ['candidate'],
      updatedAt: Timestamp.now()
    }));
    await assertFails(setDoc(roleRef, { grantedAt: Timestamp.now() }));

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'teacherRoles', 'candidate'), {
        grantedAt: Timestamp.now()
      });
    });

    await assertSucceeds(updateDoc(workspaceRef, {
      selfElectedSupervisors: ['candidate'],
      updatedAt: Timestamp.now()
    }));
    await assertSucceeds(updateDoc(workspaceRef, {
      selfElectedSupervisors: [],
      updatedAt: Timestamp.now()
    }));
  });
});

describe('conversation message ownership', () => {
  it('prevents recipients from rewriting message content while preserving receipts and sender edits', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setDoc(doc(adminDb, 'conversations', 'conversation-1'), {
        participants: ['sender', 'recipient'],
        createdAt: Timestamp.now()
      });
      await setDoc(doc(adminDb, 'conversations', 'conversation-1', 'messages', 'message-1'), {
        senderId: 'sender',
        content: 'Original message',
        messageType: 'text',
        timestamp: Timestamp.now(),
        isRead: false,
        reactions: [],
        status: 'sent'
      });
    });

    const recipientRef = doc(
      testEnv.authenticatedContext('recipient').firestore(),
      'conversations',
      'conversation-1',
      'messages',
      'message-1'
    );
    const senderRef = doc(
      testEnv.authenticatedContext('sender').firestore(),
      'conversations',
      'conversation-1',
      'messages',
      'message-1'
    );
    const outsiderRef = doc(
      testEnv.authenticatedContext('outsider').firestore(),
      'conversations',
      'conversation-1',
      'messages',
      'message-1'
    );

    await assertFails(updateDoc(recipientRef, { content: 'Rewritten by recipient' }));
    await assertSucceeds(updateDoc(recipientRef, {
      isRead: true,
      readAt: Timestamp.now()
    }));
    await assertSucceeds(updateDoc(senderRef, { content: 'Edited by sender' }));
    await assertFails(getDoc(outsiderRef));
    await assertFails(updateDoc(outsiderRef, { isRead: true }));
  });
});

describe('screenplay ownership and collaborator authority', () => {
  it('limits access-list changes to the screenplay uploader or workspace owner', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setDoc(doc(adminDb, 'workspaces', 'workspace-access'), {
        ownerId: 'workspace-owner',
        memberIds: ['workspace-owner', 'uploader', 'member'],
        members: [
          { userId: 'workspace-owner' },
          { userId: 'uploader' },
          { userId: 'member' }
        ],
        supervisorIds: [],
        selfElectedSupervisors: [],
        viewerIds: []
      });
      await setDoc(doc(adminDb, 'screenplays', 'script-access'), {
        uploadedBy: 'uploader',
        teamMembers: ['member'],
        workspaceId: 'workspace-access',
        name: 'Access Test'
      });
    });

    const memberRef = doc(
      testEnv.authenticatedContext('member').firestore(),
      'screenplays',
      'script-access'
    );
    const uploaderRef = doc(
      testEnv.authenticatedContext('uploader').firestore(),
      'screenplays',
      'script-access'
    );
    const ownerRef = doc(
      testEnv.authenticatedContext('workspace-owner').firestore(),
      'screenplays',
      'script-access'
    );

    await assertFails(updateDoc(memberRef, {
      teamMembers: ['member', 'outsider'],
      lastModified: Timestamp.now()
    }));
    await assertSucceeds(updateDoc(uploaderRef, {
      teamMembers: ['member', 'collaborator-1'],
      lastModified: Timestamp.now()
    }));
    await assertSucceeds(updateDoc(ownerRef, {
      teamMembers: ['member', 'collaborator-1', 'collaborator-2'],
      lastModified: Timestamp.now()
    }));
  });

  it('allows only the uploader or workspace owner to delete a screenplay', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setDoc(doc(adminDb, 'workspaces', 'workspace-delete'), {
        ownerId: 'workspace-owner',
        memberIds: ['workspace-owner', 'uploader', 'member', 'supervisor'],
        members: [
          { userId: 'workspace-owner' },
          { userId: 'uploader' },
          { userId: 'member' },
          { userId: 'supervisor' }
        ],
        supervisorIds: ['supervisor'],
        selfElectedSupervisors: [],
        viewerIds: []
      });
      for (const screenplayId of ['member-attempt', 'supervisor-attempt', 'owner-delete', 'uploader-delete']) {
        await setDoc(doc(adminDb, 'screenplays', screenplayId), {
          uploadedBy: 'uploader',
          teamMembers: ['member', 'supervisor'],
          workspaceId: 'workspace-delete',
          name: screenplayId
        });
      }
    });

    await assertFails(deleteDoc(doc(
      testEnv.authenticatedContext('member').firestore(),
      'screenplays',
      'member-attempt'
    )));
    await assertFails(deleteDoc(doc(
      testEnv.authenticatedContext('supervisor').firestore(),
      'screenplays',
      'supervisor-attempt'
    )));
    await assertSucceeds(deleteDoc(doc(
      testEnv.authenticatedContext('workspace-owner').firestore(),
      'screenplays',
      'owner-delete'
    )));
    await assertSucceeds(deleteDoc(doc(
      testEnv.authenticatedContext('uploader').firestore(),
      'screenplays',
      'uploader-delete'
    )));
  });
});

describe('scene-mark moderation authority', () => {
  it('allows authors and supervisors to delete student marks but protects supervisor marks from students', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setDoc(doc(adminDb, 'workspaces', 'workspace-scenes'), {
        ownerId: 'owner',
        memberIds: ['owner', 'student', 'supervisor'],
        members: [
          { userId: 'owner' },
          { userId: 'student' },
          { userId: 'supervisor' }
        ],
        supervisorIds: ['supervisor'],
        selfElectedSupervisors: [],
        viewerIds: []
      });
      await setDoc(doc(adminDb, 'screenplays', 'script-scenes'), {
        uploadedBy: 'owner',
        teamMembers: ['student', 'supervisor'],
        workspaceId: 'workspace-scenes',
        name: 'Scene Test'
      });
      await setDoc(doc(adminDb, 'screenplayScenes', 'student-own'), {
        screenplayId: 'script-scenes',
        userId: 'student',
        supervisorAtAuthorTime: false
      });
      await setDoc(doc(adminDb, 'screenplayScenes', 'student-moderated'), {
        screenplayId: 'script-scenes',
        userId: 'student',
        supervisorAtAuthorTime: false
      });
      await setDoc(doc(adminDb, 'screenplayScenes', 'supervisor-protected'), {
        screenplayId: 'script-scenes',
        userId: 'supervisor',
        supervisorAtAuthorTime: true
      });
    });

    const studentDb = testEnv.authenticatedContext('student').firestore();
    const supervisorDb = testEnv.authenticatedContext('supervisor').firestore();

    await assertSucceeds(deleteDoc(doc(studentDb, 'screenplayScenes', 'student-own')));
    await assertSucceeds(deleteDoc(doc(supervisorDb, 'screenplayScenes', 'student-moderated')));
    await assertFails(deleteDoc(doc(studentDb, 'screenplayScenes', 'supervisor-protected')));
    await assertSucceeds(deleteDoc(doc(supervisorDb, 'screenplayScenes', 'supervisor-protected')));
  });
});
