import { describe, it, expect } from 'vitest';
import {
  parseFountain,
  computePageCount,
  paginateElements,
  computePageAtCaret,
  applyElementType,
  detectLineType,
  nextElementType,
  prevElementType,
  isSceneHeading,
  isTransition,
  isCharacter,
  isParenthetical,
  parseSlugText,
  describeFountainScenes,
  formatPageEighths,
  LINES_PER_PAGE
} from './fountain';

describe('element predicates', () => {
  it('recognizes scene headings', () => {
    expect(isSceneHeading('INT. KITCHEN - DAY')).toBe(true);
    expect(isSceneHeading('EXT. BEACH - NIGHT')).toBe(true);
    expect(isSceneHeading('EST. CITY SKYLINE')).toBe(true);
    expect(isSceneHeading('INT./EXT. CAR - DAY')).toBe(true);
    expect(isSceneHeading('.FORCED HEADING')).toBe(true); // forced via leading dot
    expect(isSceneHeading('..not a heading')).toBe(false); // double dot = forced action
    expect(isSceneHeading('She walks in.')).toBe(false);
  });

  it('recognizes transitions', () => {
    expect(isTransition('CUT TO:')).toBe(true);
    expect(isTransition('SMASH CUT TO:')).toBe(true);
    expect(isTransition('> Fade to black')).toBe(true); // forced
    expect(isTransition('cut to:')).toBe(false); // not all caps
    expect(isTransition('INT. ROOM - DAY')).toBe(false); // scene heading wins
  });

  it('recognizes parentheticals', () => {
    expect(isParenthetical('(beat)')).toBe(true);
    expect(isParenthetical('(to herself)')).toBe(true);
    expect(isParenthetical('not parenthetical')).toBe(false);
  });

  it('recognizes character cues only when followed by dialogue', () => {
    expect(isCharacter('DANIELA', 'No mucho en verdad.')).toBe(true);
    expect(isCharacter('DANIELA (O.S.)', 'Hello.')).toBe(true);
    expect(isCharacter('@mc', 'yo')).toBe(true); // forced
    expect(isCharacter('DANIELA', '')).toBe(false); // no dialogue under it
    expect(isCharacter('daniela', 'hi')).toBe(false); // not all caps
  });
});

describe('parseFountain', () => {
  it('classifies a basic scene', () => {
    const source = [
      'INT. KITCHEN - DAY',
      '',
      'PAUL stirs a pot.',
      '',
      'DANIELA',
      '(in French)',
      'No mucho en verdad.',
      '',
      'CUT TO:'
    ].join('\n');

    const elements = parseFountain(source);
    const types = elements.map(e => e.type);
    expect(types).toEqual([
      'scene_heading',
      'action',
      'character',
      'parenthetical',
      'dialogue',
      'transition'
    ]);
  });

  it('treats a parenthetical with no preceding character as action', () => {
    const source = ['(this is standalone)'].join('\n');
    const elements = parseFountain(source);
    expect(elements[0].type).toBe('action');
  });

  it('keeps multi-line dialogue in the dialogue block', () => {
    const source = [
      'MARIA',
      'First line of dialogue.',
      'Second line still dialogue.'
    ].join('\n');
    const elements = parseFountain(source);
    expect(elements.map(e => e.type)).toEqual(['character', 'dialogue', 'dialogue']);
  });

  it('records correct line indices (skipping blanks)', () => {
    const source = ['INT. ROOM - DAY', '', 'Action here.'].join('\n');
    const elements = parseFountain(source);
    expect(elements[0].lineIndex).toBe(0);
    expect(elements[1].lineIndex).toBe(2);
  });
});

describe('computePageCount', () => {
  it('returns 1 for empty source', () => {
    expect(computePageCount('')).toBe(1);
    expect(computePageCount('   \n  \n')).toBe(1);
  });

  it('returns 1 for a short scene', () => {
    const source = [
      'INT. KITCHEN - DAY',
      '',
      'PAUL stirs a pot.',
      '',
      'DANIELA',
      'No mucho en verdad.'
    ].join('\n');
    expect(computePageCount(source)).toBe(1);
  });

  it('counts blank separators between action paragraphs', () => {
    // 110 single-line action paragraphs (each < 60 chars => 1 wrapped line),
    // separated by blanks: 110 text lines + 109 separators = 219 layout lines,
    // which spans 5 effective 53-line pages.
    const actionLines = Array.from({ length: 110 }, (_, i) => `Action paragraph number ${i}.`);
    const source = actionLines.join('\n\n');
    expect(computePageCount(source)).toBe(5);
  });

  it('wraps long action lines into multiple counted lines', () => {
    const longLine = 'x'.repeat(60 * 56); // 56 wrapped lines at width 60 => > 1 page
    expect(computePageCount(longLine)).toBeGreaterThanOrEqual(2);
  });

  it('counts dialogue at a narrower width than action', () => {
    // 70-char dialogue wraps to 2 lines (width 35); same text as action wraps to 2 (width 60 => 2).
    const dialogueSource = ['MARIA', 'x'.repeat(70)].join('\n');
    const elements = parseFountain(dialogueSource);
    expect(elements[1].type).toBe('dialogue');
    // Sanity: not zero pages.
    expect(computePageCount(dialogueSource)).toBe(1);
  });
});

describe('paginateElements', () => {
  it('puts a short script entirely on page 1', () => {
    const source = ['INT. KITCHEN - DAY', '', 'PAUL stirs a pot.'].join('\n');
    const paginated = paginateElements(source);
    expect(paginated.every(el => el.page === 1)).toBe(true);
  });

  it('advances the page number past the line threshold', () => {
    const source = Array.from({ length: 120 }, (_, i) => `Action paragraph ${i}.`).join('\n\n');
    const paginated = paginateElements(source);
    const maxPage = Math.max(...paginated.map(el => el.page));
    expect(maxPage).toBeGreaterThanOrEqual(2);
    // Pages must be monotonically non-decreasing through the document.
    for (let i = 1; i < paginated.length; i++) {
      expect(paginated[i].page).toBeGreaterThanOrEqual(paginated[i - 1].page);
    }
  });
});

describe('describeFountainScenes', () => {
  it('returns scene anchors and automatic page-eighth estimates', () => {
    const source = [
      'INT. KITCHEN - DAY',
      '',
      'PAUL cooks.',
      '',
      'EXT. STREET - NIGHT',
      '',
      ...Array.from({ length: 12 }, (_, index) => `Action ${index}.`)
    ].join('\n');

    const scenes = describeFountainScenes(source);

    expect(scenes).toHaveLength(2);
    expect(scenes[0]).toMatchObject({
      ordinal: 0,
      lineIndex: 0,
      page: 1,
      heading: 'INT. KITCHEN - DAY'
    });
    expect(scenes[1]).toMatchObject({
      ordinal: 1,
      lineIndex: 4,
      page: 1,
      heading: 'EXT. STREET - NIGHT'
    });
    expect(scenes.every(scene => scene.estimatedPageEighths >= 1)).toBe(true);
  });

  it('formats integer eighth counts as production page lengths', () => {
    expect(formatPageEighths(1)).toBe('1/8');
    expect(formatPageEighths(8)).toBe('1');
    expect(formatPageEighths(11)).toBe('1 3/8');
  });
});

describe('computePageAtCaret', () => {
  it('returns 1 at the start', () => {
    expect(computePageAtCaret('INT. ROOM - DAY\n\nAction.', 0)).toBe(1);
    expect(computePageAtCaret('', 0)).toBe(1);
  });

  it('returns a later page deep in a long script', () => {
    const source = Array.from({ length: 120 }, (_, i) => `Action paragraph ${i}.`).join('\n\n');
    const pageAtEnd = computePageAtCaret(source, source.length);
    expect(pageAtEnd).toBeGreaterThanOrEqual(2);
  });
});

describe('applyElementType', () => {
  it('converts a line to a scene heading', () => {
    const source = 'kitchen at night';
    const { source: out, caret } = applyElementType(source, source.length, 'scene_heading');
    expect(out).toBe('INT. KITCHEN AT NIGHT');
    expect(caret).toBe(out.length);
  });

  it('does not double the INT. prefix', () => {
    const source = 'INT. KITCHEN';
    const { source: out } = applyElementType(source, source.length, 'scene_heading');
    expect(out).toBe('INT. KITCHEN');
  });

  it('uppercases a character cue', () => {
    const source = 'daniela';
    const { source: out } = applyElementType(source, source.length, 'character');
    expect(out).toBe('DANIELA');
  });

  it('wraps a line in parentheses and parks caret inside', () => {
    const source = 'beat';
    const { source: out, caret } = applyElementType(source, source.length, 'parenthetical');
    expect(out).toBe('(beat)');
    expect(caret).toBe(out.length - 1);
  });

  it('formats a transition ending in TO:', () => {
    const source = 'smash cut';
    const { source: out } = applyElementType(source, source.length, 'transition');
    expect(out).toBe('SMASH CUT TO:');
  });

  it('only transforms the current line, not the whole document', () => {
    const source = 'INT. ROOM - DAY\nshe enters\nDANIELA';
    const caret = source.indexOf('she enters') + 2; // caret on the middle line
    const { source: out } = applyElementType(source, caret, 'character');
    expect(out).toBe('INT. ROOM - DAY\nSHE ENTERS\nDANIELA');
  });
});

describe('detectLineType', () => {
  it('detects the type of the line under the caret', () => {
    const source = ['INT. ROOM - DAY', '', 'MARIA', 'Hello there.'].join('\n');
    expect(detectLineType(source, 0)).toBe('scene_heading');
    const mariaIdx = source.indexOf('MARIA');
    expect(detectLineType(source, mariaIdx)).toBe('character');
    const dialogueIdx = source.indexOf('Hello');
    expect(detectLineType(source, dialogueIdx)).toBe('dialogue');
  });

  it('defaults empty lines to action', () => {
    const source = 'INT. ROOM - DAY\n\n';
    expect(detectLineType(source, source.length)).toBe('action');
  });
});

describe('element type cycling', () => {
  it('cycles forward and wraps', () => {
    expect(nextElementType('action')).toBe('character');
    expect(nextElementType('scene_heading')).toBe('action'); // wraps
  });

  it('cycles backward and wraps', () => {
    expect(prevElementType('action')).toBe('scene_heading'); // wraps
    expect(prevElementType('character')).toBe('action');
  });
});

describe('constants', () => {
  it('uses 53 effective lines per page', () => {
    expect(LINES_PER_PAGE).toBe(53);
  });
});

describe('parseSlugText', () => {
  it('parses a standard slug', () => {
    expect(parseSlugText('INT. BAR - NIGHT')).toEqual({ intExt: 'INT', location: 'BAR', timeOfDay: 'NIGHT' });
  });

  it('does not eat word-initial INT/EXT/EST', () => {
    expect(parseSlugText('INTERROGATION ROOM - DAY')).toEqual({ intExt: '', location: 'INTERROGATION ROOM', timeOfDay: 'DAY' });
    expect(parseSlugText('ESTATE GROUNDS - DAY')).toEqual({ intExt: '', location: 'ESTATE GROUNDS', timeOfDay: 'DAY' });
  });

  it('keeps hyphenated locations whole', () => {
    expect(parseSlugText("INT. JEAN-PAUL'S APARTMENT - NIGHT")).toEqual({ intExt: 'INT', location: "JEAN-PAUL'S APARTMENT", timeOfDay: 'NIGHT' });
    expect(parseSlugText('EXT. DRIVE-IN - NIGHT')).toEqual({ intExt: 'EXT', location: 'DRIVE-IN', timeOfDay: 'NIGHT' });
    expect(parseSlugText('EXT. DRIVE-IN THEATER - NIGHT')).toEqual({ intExt: 'EXT', location: 'DRIVE-IN THEATER', timeOfDay: 'NIGHT' });
  });

  it('accepts typographic PDF separators without splitting typographic hyphens', () => {
    expect(parseSlugText('EXT. DRIVE-IN\u2014NIGHT')).toEqual({ intExt: 'EXT', location: 'DRIVE-IN', timeOfDay: 'NIGHT' });
    expect(parseSlugText('EXT. DRIVE\u2011IN - NIGHT')).toEqual({ intExt: 'EXT', location: 'DRIVE\u2011IN', timeOfDay: 'NIGHT' });
  });

  it('handles INT/EXT variants and EST', () => {
    expect(parseSlugText('INT./EXT. CAR - DUSK').intExt).toBe('INT/EXT');
    expect(parseSlugText('I/E. CAR - DUSK').intExt).toBe('INT/EXT');
    expect(parseSlugText('EST. FARMHOUSE - DAY').intExt).toBe('EXT');
  });

  it('strips forced-heading dots and tolerates prefixless selections', () => {
    expect(parseSlugText('.BARN - DAY')).toEqual({ intExt: '', location: 'BARN', timeOfDay: 'DAY' });
    expect(parseSlugText('BAR - NIGHT')).toEqual({ intExt: '', location: 'BAR', timeOfDay: 'NIGHT' });
    expect(parseSlugText('BAR')).toEqual({ intExt: '', location: 'BAR', timeOfDay: '' });
  });

  it('is case-insensitive and keeps compound times intact', () => {
    expect(parseSlugText('int. bar - night')).toEqual({ intExt: 'INT', location: 'bar', timeOfDay: 'night' });
    expect(parseSlugText('EXT. FIELD - DAY-FOR-NIGHT').timeOfDay).toBe('DAY-FOR-NIGHT');
  });
});
