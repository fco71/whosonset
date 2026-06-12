import { describe, expect, it } from 'vitest';
import {
  canModerateScreenplayElement,
  canResolveScreenplayElement
} from './screenplayElementPermissions';

describe('screenplay element permissions', () => {
  it('lets authors moderate and resolve their own notes', () => {
    const actor = { currentUserId: 'student' };
    const element = { userId: 'student', supervisorAtAuthorTime: false };

    expect(canModerateScreenplayElement(element, actor)).toBe(true);
    expect(canResolveScreenplayElement(element, actor)).toBe(true);
  });

  it('lets screenplay managers address supervisor notes without deleting them', () => {
    const actor = { currentUserId: 'student', canManageScreenplay: true, isScreenplaySupervisor: false };
    const element = { userId: 'teacher', supervisorAtAuthorTime: true };

    expect(canResolveScreenplayElement(element, actor)).toBe(true);
    expect(canModerateScreenplayElement(element, actor)).toBe(false);
  });

  it('lets supervisors moderate supervisor and student notes', () => {
    const actor = { currentUserId: 'teacher', canManageScreenplay: false, isScreenplaySupervisor: true };

    expect(canModerateScreenplayElement({ userId: 'other-teacher', supervisorAtAuthorTime: true }, actor)).toBe(true);
    expect(canResolveScreenplayElement({ userId: 'student', supervisorAtAuthorTime: false }, actor)).toBe(true);
  });

  it('blocks ordinary collaborators from closing or deleting someone else’s notes', () => {
    const actor = { currentUserId: 'peer', canManageScreenplay: false, isScreenplaySupervisor: false };

    expect(canResolveScreenplayElement({ userId: 'student', supervisorAtAuthorTime: false }, actor)).toBe(false);
    expect(canModerateScreenplayElement({ userId: 'teacher', supervisorAtAuthorTime: true }, actor)).toBe(false);
  });

  it('enforces the supervisor/student scene-mark deletion matrix', () => {
    const studentMark = { userId: 'student', supervisorAtAuthorTime: false };
    const supervisorMark = { userId: 'teacher', supervisorAtAuthorTime: true };

    expect(canModerateScreenplayElement(studentMark, {
      currentUserId: 'teacher',
      isScreenplaySupervisor: true
    })).toBe(true);
    expect(canModerateScreenplayElement(supervisorMark, {
      currentUserId: 'student',
      canManageScreenplay: true,
      isScreenplaySupervisor: false
    })).toBe(false);
    expect(canModerateScreenplayElement(studentMark, {
      currentUserId: 'student'
    })).toBe(true);
    expect(canModerateScreenplayElement(supervisorMark, {
      currentUserId: 'teacher'
    })).toBe(true);
  });
});
