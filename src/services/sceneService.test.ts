import { describe, expect, it } from 'vitest';
import {
  FountainSceneAnchor,
  FountainSceneDescriptor,
  reconcileFountainScenes
} from '../utilities/fountain';

const scene = (overrides: Partial<FountainSceneAnchor>): FountainSceneAnchor => ({
  id: 'scene-1',
  selection: 'INT. ROOM - DAY',
  ...overrides
});

const descriptor = (overrides: Partial<FountainSceneDescriptor>): FountainSceneDescriptor => ({
  ordinal: 0,
  lineIndex: 0,
  page: 1,
  positionY: 0,
  heading: 'INT. ROOM - DAY',
  estimatedPageEighths: 1,
  ...overrides
});

describe('reconcileFountainScenes', () => {
  it('keeps stable scene IDs when lines are inserted before a heading', () => {
    const existing = scene({
      id: 'stable-id',
      sourceLineIndex: 0,
      sourceOrdinal: 0,
      sourceHeading: 'INT. ROOM - DAY'
    });
    const matches = reconcileFountainScenes(
      [existing],
      [descriptor({ lineIndex: 8, ordinal: 1 })]
    );

    expect(matches[0].scene?.id).toBe('stable-id');
  });

  it('keeps metadata attached when a heading is renamed in place', () => {
    const existing = scene({
      id: 'stable-id',
      sourceLineIndex: 4,
      sourceOrdinal: 1,
      sourceHeading: 'INT. ROOM - DAY'
    });
    const matches = reconcileFountainScenes(
      [existing],
      [descriptor({
        lineIndex: 4,
        ordinal: 1,
        heading: 'INT. KITCHEN - NIGHT'
      })]
    );

    expect(matches[0].scene?.id).toBe('stable-id');
  });
});
