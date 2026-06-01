export interface MentionableUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

export interface MentionQuery {
  query: string;
  start: number;
}

const ACTIVE_MENTION_PATTERN = /(^|\s)@([A-Za-z0-9_.-]*)$/;
const SENT_MENTION_PATTERN = /@([A-Za-z0-9_.-]{2,})/g;

const normalize = (value?: string | null): string => (value || '').toLowerCase();

const mentionKeysForUser = (user: MentionableUser): string[] => {
  const fullName = normalize(user.name);
  const firstName = fullName.split(/\s+/)[0] || '';
  const squashedName = fullName.replace(/\s+/g, '');
  const emailLocal = normalize(user.email).split('@')[0] || '';

  return Array.from(new Set([firstName, squashedName, emailLocal].filter(Boolean)));
};

export function getMentionQueryAtCursor(value: string, cursorPosition: number): MentionQuery | null {
  const upToCursor = value.slice(0, cursorPosition);
  const match = upToCursor.match(ACTIVE_MENTION_PATTERN);
  if (!match) return null;

  return {
    query: match[2],
    start: cursorPosition - match[2].length - 1
  };
}

export function filterMentionSuggestions(
  users: MentionableUser[],
  query: string,
  currentUserId?: string | null,
  limit = 6
): MentionableUser[] {
  const normalizedQuery = query.toLowerCase();

  return users
    .filter(user => user?.id && user.id !== currentUserId)
    .filter(user => {
      if (!normalizedQuery) return true;
      const fullName = normalize(user.name);
      return mentionKeysForUser(user).some(key => key.startsWith(normalizedQuery)) ||
        fullName.includes(normalizedQuery);
    })
    .slice(0, limit);
}

export function getMentionInsertName(user: MentionableUser): string {
  return (user.name || '').split(/\s+/)[0] || (user.email || '').split('@')[0] || 'user';
}

export function applyMentionSuggestion(
  value: string,
  mention: MentionQuery,
  user: MentionableUser
): string {
  const before = value.slice(0, mention.start);
  const after = value.slice(mention.start + 1 + mention.query.length);
  const spacedAfter = after.startsWith(' ') ? after : ` ${after}`;

  return `${before}@${getMentionInsertName(user)}${spacedAfter}`;
}

export function extractMentionedUserIds(
  text: string,
  users: MentionableUser[],
  currentUserId?: string | null
): string[] {
  if (!text || users.length === 0) return [];

  const tokens = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = SENT_MENTION_PATTERN.exec(text)) !== null) {
    tokens.add(match[1].toLowerCase().replace(/[.,!?;:]+$/, ''));
  }
  if (tokens.size === 0) return [];

  const ids = new Set<string>();
  for (const user of users) {
    if (!user?.id || user.id === currentUserId) continue;
    const keys = mentionKeysForUser(user);
    if (keys.some(key => tokens.has(key))) {
      ids.add(user.id);
    }
  }

  return [...ids];
}
