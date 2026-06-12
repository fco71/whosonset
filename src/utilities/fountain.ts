// Simplified Fountain parsing + pagination utility.
//
// This is intentionally a SUBSET of the Fountain spec (https://fountain.io) — enough to
// classify screenplay elements for rendering, drive the editor's format toolbar/shortcuts,
// and produce a running page count. It does NOT render visual page breaks (per product
// decision); it only estimates the page number a writer has reached.
//
// Pure module: no React, no Firebase. Fully unit-tested in fountain.test.ts.

export type ScreenplayElementType =
  | 'scene_heading'
  | 'action'
  | 'character'
  | 'parenthetical'
  | 'dialogue'
  | 'transition';

export interface ParsedElement {
  type: ScreenplayElementType;
  text: string;
  /** 0-based index of the source line where this element appears. */
  lineIndex: number;
}

const SCENE_PREFIXES = ['INT./EXT.', 'INT/EXT.', 'I/E.', 'INT.', 'EXT.', 'EST.'];

// Per-element character widths used by the page-count heuristic. Roughly matches
// standard screenplay margins: action runs full width, dialogue is indented both sides,
// character/parenthetical narrower still.
const ELEMENT_WIDTHS: Record<ScreenplayElementType, number> = {
  scene_heading: 60,
  action: 60,
  character: 38,
  parenthetical: 25,
  dialogue: 35,
  transition: 60
};

// Standard screenplay page ≈ 55 lines of text at standard margins.
export const LINES_PER_PAGE = 55;

// Tab cycles element types in this order (matches Final Draft / Highland muscle memory).
const TAB_CYCLE: ScreenplayElementType[] = [
  'action',
  'character',
  'dialogue',
  'parenthetical',
  'transition',
  'scene_heading'
];

function normalize(source: string): string {
  return source.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

export function isSceneHeading(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  // Forced scene heading: a leading single dot (but not "..", which is a forced action).
  if (trimmed.startsWith('.') && !trimmed.startsWith('..')) return true;
  const upper = trimmed.toUpperCase();
  return SCENE_PREFIXES.some(prefix => upper.startsWith(prefix));
}

export function isTransition(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  // Forced transition: leading ">" (and not the centered-text ">...<" form).
  if (trimmed.startsWith('>') && !trimmed.endsWith('<')) return true;
  if (trimmed !== trimmed.toUpperCase()) return false; // transitions are all caps
  if (isSceneHeading(trimmed)) return false;
  return /\bTO:$/.test(trimmed);
}

export function isParenthetical(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith('(') && trimmed.endsWith(')') && trimmed.length >= 2;
}

export function isCharacter(line: string, nextLine: string | undefined): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  // Forced character cue: leading "@".
  if (trimmed.startsWith('@')) return true;
  if (trimmed !== trimmed.toUpperCase()) return false; // character cues are all caps
  if (!/[A-Z]/.test(trimmed)) return false; // must contain at least one letter
  if (isSceneHeading(trimmed) || isTransition(trimmed)) return false;
  // A character cue is followed by dialogue (a non-blank line).
  return Boolean(nextLine && nextLine.trim() !== '');
}

/**
 * Parse Fountain source into a flat list of typed elements. Blank lines produce no
 * element (they are structural separators), but their effect on pagination is handled
 * in computePageCount.
 */
export function parseFountain(source: string): ParsedElement[] {
  const lines = normalize(source).split('\n');
  const elements: ParsedElement[] = [];
  let inDialogueBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      inDialogueBlock = false;
      continue;
    }

    const next = lines[i + 1];

    if (isSceneHeading(line)) {
      elements.push({ type: 'scene_heading', text: trimmed, lineIndex: i });
      inDialogueBlock = false;
    } else if (isTransition(line)) {
      elements.push({ type: 'transition', text: trimmed, lineIndex: i });
      inDialogueBlock = false;
    } else if (isCharacter(line, next)) {
      elements.push({ type: 'character', text: trimmed, lineIndex: i });
      inDialogueBlock = true;
    } else if (inDialogueBlock && isParenthetical(line)) {
      elements.push({ type: 'parenthetical', text: trimmed, lineIndex: i });
    } else if (inDialogueBlock) {
      elements.push({ type: 'dialogue', text: trimmed, lineIndex: i });
    } else {
      elements.push({ type: 'action', text: trimmed, lineIndex: i });
    }
  }

  return elements;
}

/**
 * Estimate how many pages the source fills. Heuristic, not a true layout engine:
 *  - each element wraps at an element-specific character width
 *  - a blank line is reserved before each scene heading and character cue
 *  - 55 wrapped lines ≈ 1 page
 */
export function computePageCount(source: string): number {
  const elements = parseFountain(source);
  if (elements.length === 0) return 1;

  let totalLines = 0;
  let prevType: ScreenplayElementType | null = null;

  for (const element of elements) {
    if ((element.type === 'scene_heading' || element.type === 'character') && prevType !== null) {
      totalLines += 1; // blank-line separator before the block
    }
    const width = ELEMENT_WIDTHS[element.type];
    const stripped = element.text.replace(/^[.>@]/, '');
    const wrapped = Math.max(1, Math.ceil(stripped.length / width));
    totalLines += wrapped;
    prevType = element.type;
  }

  return Math.max(1, Math.ceil(totalLines / LINES_PER_PAGE));
}

export interface PaginatedElement extends ParsedElement {
  /** 1-based page this element begins on, per the line-count heuristic. */
  page: number;
}

/**
 * Annotate each element with the page it starts on. Same heuristic as computePageCount:
 * element-specific wrap widths, a reserved blank line before scene headings + character
 * cues, 55 wrapped lines per page.
 */
export function paginateElements(source: string): PaginatedElement[] {
  const elements = parseFountain(source);
  const result: PaginatedElement[] = [];
  let totalLines = 0;
  let prevType: ScreenplayElementType | null = null;

  for (const element of elements) {
    if ((element.type === 'scene_heading' || element.type === 'character') && prevType !== null) {
      totalLines += 1;
    }
    const page = Math.floor(totalLines / LINES_PER_PAGE) + 1;
    const width = ELEMENT_WIDTHS[element.type];
    const stripped = element.text.replace(/^[.>@]/, '');
    const wrapped = Math.max(1, Math.ceil(stripped.length / width));
    totalLines += wrapped;
    result.push({ ...element, page });
    prevType = element.type;
  }

  return result;
}

/** Which page the caret currently sits on (1-based). Empty docs / caret-before-content => 1. */
export function computePageAtCaret(source: string, caret: number): number {
  const normalized = normalize(source);
  const clamped = Math.max(0, Math.min(caret, normalized.length));
  const caretLineIndex = (normalized.slice(0, clamped).match(/\n/g) || []).length;
  const paginated = paginateElements(normalized);
  let page = 1;
  for (const element of paginated) {
    if (element.lineIndex <= caretLineIndex) {
      page = element.page;
    } else {
      break;
    }
  }
  return page;
}

export interface LineBounds {
  start: number;
  end: number;
  line: string;
}

/** Bounds of the line containing `caret` in the (normalized) source. */
export function getCurrentLineBounds(source: string, caret: number): LineBounds {
  const normalized = normalize(source);
  const clamped = Math.max(0, Math.min(caret, normalized.length));
  const start = normalized.lastIndexOf('\n', clamped - 1) + 1;
  let end = normalized.indexOf('\n', clamped);
  if (end === -1) end = normalized.length;
  return { start, end, line: normalized.slice(start, end) };
}

/** Classify the line the caret is currently on. Empty lines default to 'action'. */
export function detectLineType(source: string, caret: number): ScreenplayElementType {
  const normalized = normalize(source);
  const clamped = Math.max(0, Math.min(caret, normalized.length));
  const lineIndex = (normalized.slice(0, clamped).match(/\n/g) || []).length;
  const elements = parseFountain(normalized);
  const match = elements.find(element => element.lineIndex === lineIndex);
  return match ? match.type : 'action';
}

/**
 * Transform the line the caret is on into the given element type, returning new source
 * and a sensible new caret position. Pure line-level transform — does NOT insert blank
 * lines (the editor handles spacing on Enter), so the result is deterministic + testable.
 */
export function applyElementType(
  source: string,
  caret: number,
  type: ScreenplayElementType
): { source: string; caret: number } {
  const normalized = normalize(source);
  const { start, end, line } = getCurrentLineBounds(normalized, caret);
  const content = line.trim();
  let newLine: string;
  let caretInLine: number;

  switch (type) {
    case 'scene_heading': {
      const body = content.replace(/^(INT\.\/EXT\.|INT\/EXT\.|I\/E\.|INT\.|EXT\.|EST\.|\.)\s*/i, '');
      newLine = `INT. ${body.toUpperCase()}`;
      caretInLine = newLine.length;
      break;
    }
    case 'character': {
      newLine = content.replace(/^@/, '').toUpperCase();
      caretInLine = newLine.length;
      break;
    }
    case 'transition': {
      const body = content.replace(/^>/, '').toUpperCase().replace(/\s*TO:$/, '').trim();
      newLine = body ? `${body} TO:` : 'CUT TO:';
      caretInLine = newLine.length;
      break;
    }
    case 'parenthetical': {
      const inner = content.replace(/^\(/, '').replace(/\)$/, '');
      newLine = `(${inner})`;
      caretInLine = newLine.length - 1; // park caret just inside the closing paren
      break;
    }
    case 'dialogue':
    case 'action':
    default: {
      // Plain text: strip any forced-element marker, keep the author's casing.
      newLine = content.replace(/^[.>@]/, '');
      caretInLine = newLine.length;
      break;
    }
  }

  const newSource = normalized.slice(0, start) + newLine + normalized.slice(end);
  return { source: newSource, caret: start + Math.min(caretInLine, newLine.length) };
}

export function nextElementType(current: ScreenplayElementType): ScreenplayElementType {
  const index = TAB_CYCLE.indexOf(current);
  if (index === -1) return TAB_CYCLE[0];
  return TAB_CYCLE[(index + 1) % TAB_CYCLE.length];
}

export function prevElementType(current: ScreenplayElementType): ScreenplayElementType {
  const index = TAB_CYCLE.indexOf(current);
  if (index === -1) return TAB_CYCLE[TAB_CYCLE.length - 1];
  return TAB_CYCLE[(index - 1 + TAB_CYCLE.length) % TAB_CYCLE.length];
}

export type SlugIntExt = '' | 'INT' | 'EXT' | 'INT/EXT';

export interface ParsedSlug {
  intExt: SlugIntExt;
  location: string;
  timeOfDay: string;
}

// ASCII hyphens split a slug only when surrounded by whitespace, preserving
// locations such as DRIVE-IN. En/em dashes are unambiguous separators and may
// arrive without spaces when text is extracted from a PDF.
const SLUG_PART_SEPARATOR = /\s+[-\u2013\u2014]\s+|[\u2013\u2014]/;

/**
 * Best-effort parse of a slug line ("INT. BAR - NIGHT") into its parts.
 * Tolerates partial selections ("BAR - NIGHT", just "BAR"), forced headings
 * (".BARN - DAY"), and hyphenated locations ("EXT. DRIVE-IN - NIGHT").
 * Lives next to SCENE_PREFIXES so slug detection and slug parsing can't drift.
 */
export function parseSlugText(text: string): ParsedSlug {
  let cleaned = text.trim().replace(/\s+/g, ' ');
  // Forced scene headings carry a leading dot (".BARN - DAY").
  if (/^\.[^.\s]/.test(cleaned)) cleaned = cleaned.slice(1);

  let intExt: SlugIntExt = '';
  let rest = cleaned;
  // The prefix must be FOLLOWED by a dot or whitespace — "INT. X", "INT X",
  // "I/E. X" match; "INTERROGATION ROOM" must not.
  const prefixMatch = cleaned.match(/^(INT\s*\.?\s*\/\s*EXT|I\/E|INT|EXT|EST)(\.|\s)\s*/i);
  if (prefixMatch) {
    const raw = prefixMatch[1].toUpperCase().replace(/\s/g, '');
    intExt = raw.includes('/') ? 'INT/EXT' : raw === 'EXT' || raw === 'EST' ? 'EXT' : 'INT';
    rest = cleaned.slice(prefixMatch[0].length);
  }

  const separator = SLUG_PART_SEPARATOR.exec(rest);
  const location = (separator ? rest.slice(0, separator.index) : rest).trim();
  const timeOfDay = separator
    ? rest.slice(separator.index + separator[0].length).trim()
    : '';
  return { intExt, location, timeOfDay };
}
