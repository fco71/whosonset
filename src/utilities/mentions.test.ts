import { describe, expect, it } from 'vitest';
import {
  applyMentionSuggestion,
  extractMentionedUserIds,
  filterMentionSuggestions,
  getMentionQueryAtCursor
} from './mentions';

const members = [
  { id: 'student', name: 'Sofia Ramos', email: 'sofia@example.com' },
  { id: 'teacher', name: 'Francisco Ortega', email: 'for-teacher@example.com' },
  { id: 'peer', name: 'Alex Kim', email: 'alex.kim@example.com' }
];

describe('mention helpers', () => {
  it('detects active @mention queries at the cursor', () => {
    expect(getMentionQueryAtCursor('Please ask @sof', 15)).toEqual({ query: 'sof', start: 11 });
    expect(getMentionQueryAtCursor('email@domain.com', 16)).toBeNull();
    expect(getMentionQueryAtCursor('Already done @sof later', 12)).toBeNull();
  });

  it('matches suggestions by first name, squashed full name, and email local part', () => {
    expect(filterMentionSuggestions(members, 'sof', 'teacher').map(user => user.id)).toEqual(['student']);
    expect(filterMentionSuggestions(members, 'sofiar', 'teacher').map(user => user.id)).toEqual(['student']);
    expect(filterMentionSuggestions(members, 'alex.k', 'teacher').map(user => user.id)).toEqual(['peer']);
    expect(filterMentionSuggestions(members, '', 'student').map(user => user.id)).toEqual(['teacher', 'peer']);
  });

  it('inserts the selected first name without swallowing following text', () => {
    const value = 'Review this with @sof today';
    const query = getMentionQueryAtCursor(value, 'Review this with @sof'.length);

    expect(query).not.toBeNull();
    expect(applyMentionSuggestion(value, query!, members[0])).toBe('Review this with @Sofia today');
  });

  it('extracts deduped mentioned user ids and excludes the sender', () => {
    const text = '@Sofia please compare with @alex.kim. @Sofia again. @Francisco should not self-notify.';

    expect(extractMentionedUserIds(text, members, 'teacher')).toEqual(['student', 'peer']);
  });
});
