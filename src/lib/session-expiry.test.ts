import { describe, it, expect } from 'vitest';
import { isSessionExpired } from './account';

const now = Date.parse('2026-11-25T14:00:00Z');
describe('24-hour sign-in limit', () => {
  it('keeps a sign-in from 23 hours ago', () => {
    expect(isSessionExpired('2026-11-24T15:00:00Z', now)).toBe(false);
  });
  it('expires a sign-in from 24 hours ago', () => {
    expect(isSessionExpired('2026-11-24T14:00:00Z', now)).toBe(true);
  });
  it('expires when sign-in time is unknown', () => {
    expect(isSessionExpired(undefined, now)).toBe(true);
  });
});
