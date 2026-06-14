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
