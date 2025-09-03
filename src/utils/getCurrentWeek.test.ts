import test from 'node:test';
import assert from 'node:assert/strict';
import { getCurrentWeek } from './getCurrentWeek';

test('returns 1 when start date is today', () => {
  const now = new Date();
  assert.equal(getCurrentWeek(now), 1);
});

test('returns 2 when one week has passed', () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  assert.equal(getCurrentWeek(date), 2);
});

test('caps the result at 12 weeks', () => {
  const date = new Date();
  date.setDate(date.getDate() - 13 * 7);
  assert.equal(getCurrentWeek(date), 12);
});
