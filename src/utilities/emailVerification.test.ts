import { describe, expect, it } from 'vitest';
import { isPasswordAuthUser, shouldRequireEmailVerification } from './emailVerification';

const makeUser = (providerIds: string[], emailVerified = false) => ({
  emailVerified,
  providerData: providerIds.map(providerId => ({ providerId }))
});

describe('email verification gating', () => {
  it('requires verification for unverified password accounts explicitly marked at signup', () => {
    expect(
      shouldRequireEmailVerification(
        makeUser(['password']),
        { emailVerificationRequired: true }
      )
    ).toBe(true);
  });

  it('does not gate verified password accounts', () => {
    expect(
      shouldRequireEmailVerification(
        makeUser(['password'], true),
        { emailVerificationRequired: true }
      )
    ).toBe(false);
  });

  it('does not gate older unmarked password accounts', () => {
    expect(
      shouldRequireEmailVerification(
        makeUser(['password']),
        {}
      )
    ).toBe(false);
  });

  it('does not gate OAuth-only accounts', () => {
    expect(isPasswordAuthUser(makeUser(['google.com']))).toBe(false);
    expect(
      shouldRequireEmailVerification(
        makeUser(['google.com']),
        { emailVerificationRequired: true }
      )
    ).toBe(false);
  });
});
