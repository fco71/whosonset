import { describe, expect, it } from 'vitest';
import {
  validatePassword,
  PASSWORD_REQUIREMENTS,
  MIN_PASSWORD_LENGTH,
} from './passwordValidation';

// These tests encode the *product decision* to keep an early-adoption,
// low-friction password policy: a single minimum-length rule (matching
// Firebase Auth's 6-char floor) and NO complexity requirements. If someone
// later reintroduces uppercase/number/symbol rules, these tests should fail
// loudly so it's a deliberate choice, not an accident.
describe('password policy (early-adoption, minimal)', () => {
  it('uses a 6-character minimum', () => {
    expect(MIN_PASSWORD_LENGTH).toBe(6);
  });

  it('enforces exactly one rule (length only — no complexity gate)', () => {
    expect(PASSWORD_REQUIREMENTS).toHaveLength(1);
    expect(PASSWORD_REQUIREMENTS[0].name).toBe('length');
  });

  it('rejects passwords shorter than the minimum', () => {
    expect(validatePassword('').isValid).toBe(false);
    expect(validatePassword('abc').isValid).toBe(false);
    expect(validatePassword('abcde').isValid).toBe(false); // 5 chars
  });

  it('accepts any password at or above the minimum length', () => {
    expect(validatePassword('abcdef').isValid).toBe(true); // exactly 6
    expect(validatePassword('abcdefgh').isValid).toBe(true);
  });

  it('does NOT require uppercase, numbers, or symbols', () => {
    // A plain all-lowercase password with no digits/symbols must pass —
    // this is the explicit anti-deterrent behavior.
    expect(validatePassword('simple').isValid).toBe(true);
    expect(validatePassword('password').isValid).toBe(true);
  });

  it('reports the length error only when too short', () => {
    expect(validatePassword('abc').errors).toEqual(['At least 6 characters']);
    expect(validatePassword('abcdef').errors).toEqual([]);
  });
});
