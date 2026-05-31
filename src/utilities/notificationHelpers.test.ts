import { describe, expect, it, vi } from 'vitest';
import {
  getNotificationTitle,
  getNotificationBody,
  normalizeNotificationData,
  getNotificationDateValue,
} from './notificationHelpers';
import { AppNotification } from '../types/notifications';

// A stub translator that echoes "<key>::<json-params>" so tests can assert
// both that the i18n key was used and what params reached it.
const fakeT = (key: string, params?: Record<string, unknown>) =>
  params && Object.keys(params).length ? `${key}::${JSON.stringify(params)}` : key;

const makeNotification = (overrides: Partial<AppNotification>): AppNotification => ({
  id: 'n1',
  userId: 'u1',
  type: 'system',
  title: 'Stored title',
  body: 'Stored body',
  message: 'Stored message',
  isRead: false,
  read: false,
  createdAt: null,
  timestamp: null,
  ...overrides,
});

describe('recipient-locale notification rendering', () => {
  it('prefers the i18n key over the stored (sender-locale) string', () => {
    const n = makeNotification({
      title: 'Hola (sender locale)',
      titleKey: 'screenplay.notifications.reviewApproved.title',
      i18nParams: { reviewer: 'Ana', screenplay: 'Scene 2' },
    });
    const rendered = getNotificationTitle(n, fakeT);
    expect(rendered).toContain('screenplay.notifications.reviewApproved.title');
    expect(rendered).toContain('Ana');
    // The stored sender-locale string must NOT leak through when a key exists.
    expect(rendered).not.toContain('Hola (sender locale)');
  });

  it('falls back to the stored string when no key is present (legacy notifications)', () => {
    const n = makeNotification({ title: 'Legacy title', titleKey: undefined });
    expect(getNotificationTitle(n, fakeT)).toBe('Legacy title');
  });

  it('body falls back through body -> message', () => {
    expect(getNotificationBody(makeNotification({ body: '', message: 'msg only' }), fakeT)).toBe('msg only');
    expect(getNotificationBody(makeNotification({ bodyKey: 'some.key' }), fakeT)).toContain('some.key');
  });

  it('resolves params ending in "Key" through t() and exposes them under the base name', () => {
    const spy = vi.fn((key: string, params?: Record<string, unknown>) =>
      key === 'roles.supervisor' ? 'Supervisor' : `${key}::${JSON.stringify(params)}`);
    const n = makeNotification({
      titleKey: 'collaboration.notifications.invited.title',
      // roleKey is itself a translation key; inviter is plain data.
      i18nParams: { inviter: 'Ana', roleKey: 'roles.supervisor' },
    });
    getNotificationTitle(n, spy);
    // roles.supervisor was resolved on its own...
    expect(spy).toHaveBeenCalledWith('roles.supervisor');
    // ...and the title was rendered with `role` (base name) = the resolved value,
    // while the raw roleKey is no longer passed through.
    const titleCall = spy.mock.calls.find(c => c[0] === 'collaboration.notifications.invited.title');
    expect(titleCall?.[1]).toMatchObject({ inviter: 'Ana', role: 'Supervisor' });
    expect(titleCall?.[1]).not.toHaveProperty('roleKey');
  });
});

describe('normalizeNotificationData', () => {
  it('treats legacy notifications with no read flags as read (so they do not inflate unread counts)', () => {
    const n = normalizeNotificationData('x', { type: 'system', title: 't' });
    expect(n.isRead).toBe(true);
    expect(n.read).toBe(true);
  });

  it('honors an explicit unread flag', () => {
    expect(normalizeNotificationData('x', { isRead: false }).isRead).toBe(false);
    expect(normalizeNotificationData('x', { read: false }).isRead).toBe(false);
    expect(normalizeNotificationData('x', { isRead: true }).isRead).toBe(true);
  });

  it('passes through the recipient-locale fields', () => {
    const n = normalizeNotificationData('x', {
      type: 'review_approved',
      titleKey: 'a.title',
      bodyKey: 'a.body',
      i18nParams: { reviewer: 'Ana' },
    });
    expect(n.titleKey).toBe('a.title');
    expect(n.bodyKey).toBe('a.body');
    expect(n.i18nParams).toEqual({ reviewer: 'Ana' });
  });
});

describe('getNotificationDateValue', () => {
  it('handles Firestore-style { seconds } timestamps', () => {
    const d = getNotificationDateValue({ seconds: 1_700_000_000, nanoseconds: 0 });
    expect(d).toBeInstanceOf(Date);
    expect(d?.getTime()).toBe(1_700_000_000 * 1000);
  });

  it('handles Date, ISO string, and millis; returns null for empty/invalid', () => {
    const now = new Date();
    expect(getNotificationDateValue(now)).toBe(now);
    expect(getNotificationDateValue('2026-05-31T00:00:00.000Z')?.toISOString()).toBe('2026-05-31T00:00:00.000Z');
    expect(getNotificationDateValue(0)).toBeNull(); // falsy guard
    expect(getNotificationDateValue(null)).toBeNull();
    expect(getNotificationDateValue('not-a-date')).toBeNull();
  });
});
