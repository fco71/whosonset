import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ScenesPanel, { SceneNoteItem } from './ScenesPanel';
import type { SceneMark } from '../../services/sceneService';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number; defaultValue?: string }) => {
      const categories: Record<string, string> = {
        'screenplay.categories.cast_member': 'Cast Member',
        'screenplay.categories.props': 'Props',
        'screenplay.categories.vehicles': 'Vehicles'
      };
      if (categories[key]) return categories[key];
      if (options?.defaultValue) return options.defaultValue;
      if (typeof options?.count === 'number') return `${key} (${options.count})`;
      return key;
    }
  })
}));

vi.mock('../../services/sceneService', () => ({
  INT_EXT_OPTIONS: ['', 'INT', 'EXT', 'INT/EXT'],
  deleteScene: vi.fn(),
  updateScene: vi.fn(),
  estimateScenePageEighths: vi.fn(() => 2),
  reconcileFountainScenes: vi.fn(() => []),
  parseSlugText: vi.fn(),
  sceneHeading: (scene: SceneMark) => `${scene.intExt}. ${scene.location} - ${scene.timeOfDay}`,
  sceneOrderKey: (item: { pageNumber: number; position: { y: number } }) =>
    item.pageNumber * 10000 + item.position.y * 1000,
  sceneForPosition: (scenes: SceneMark[], pageNumber: number, positionY: number) => {
    const key = pageNumber * 10000 + positionY * 1000;
    return scenes.reduce<SceneMark | null>((owner, scene) => {
      const sceneKey = scene.pageNumber * 10000 + scene.position.y * 1000;
      const ownerKey = owner
        ? owner.pageNumber * 10000 + owner.position.y * 1000
        : -Infinity;
      return sceneKey <= key && sceneKey > ownerKey ? scene : owner;
    }, null);
  }
}));

const makeScene = (
  id: string,
  pageNumber: number,
  location: string,
  sceneNumber: string
): SceneMark => ({
  id,
  screenplayId: 'screenplay-1',
  userId: 'user-1',
  userName: 'Writer',
  sceneNumber,
  intExt: 'INT',
  location,
  timeOfDay: 'DAY',
  synopsis: '',
  note: '',
  pageNumber,
  position: { x: 0.1, y: 0.1, width: 0.5, height: 0.05 },
  selection: `INT. ${location} - DAY`,
  sourceType: 'pdf',
  sourceStatus: 'active',
  scriptDay: '',
  unit: '',
  sequence: '',
  estimatedTime: ''
});

const notes: SceneNoteItem[] = [
  {
    id: 'cast-1',
    kind: 'tag',
    label: 'Hero',
    userName: 'Teacher',
    pageNumber: 1,
    positionY: 0.2,
    category: 'cast_member',
    color: '#ff0000'
  },
  {
    id: 'prop-1',
    kind: 'tag',
    label: 'Knife',
    userName: 'Teacher',
    pageNumber: 1,
    positionY: 0.3,
    category: 'props',
    color: '#00ff00'
  },
  {
    id: 'vehicle-1',
    kind: 'tag',
    label: 'Car',
    userName: 'Teacher',
    pageNumber: 2,
    positionY: 0.2,
    category: 'vehicles',
    color: '#0000ff'
  }
];

describe('ScenesPanel category filtering', () => {
  it('filters selected-scene and screenplay-wide tags by breakdown category', () => {
    render(
      <ScenesPanel
        isFountain={false}
        fountainSource=""
        scenes={[
          makeScene('scene-1', 1, 'KITCHEN', '1'),
          makeScene('scene-2', 2, 'STREET', '2')
        ]}
        notes={notes}
        currentUserUid="user-1"
        canModerateScene={() => false}
        onJumpToPage={vi.fn()}
        onJumpToFountainLine={vi.fn()}
        onOpenNote={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('KITCHEN'));

    expect(screen.getByRole('button', { name: 'screenplay.scenes.allCategories 2/3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Props 1/1' })).toBeInTheDocument();
    expect(screen.getAllByText('Hero')).toHaveLength(2);
    expect(screen.getAllByText('Knife')).toHaveLength(2);
    expect(screen.getByText('Car')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Props 1/1' }));

    expect(screen.queryByText('Hero')).not.toBeInTheDocument();
    expect(screen.queryByText('Car')).not.toBeInTheDocument();
    expect(screen.getAllByText('Knife')).toHaveLength(2);
  });

  it('offers scene metadata editing to any current participant', () => {
    render(
      <ScenesPanel
        isFountain={false}
        fountainSource=""
        scenes={[makeScene('scene-1', 1, 'KITCHEN', '1')]}
        notes={[]}
        currentUserUid="user-2"
        canModerateScene={() => false}
        onJumpToPage={vi.fn()}
        onJumpToFountainLine={vi.fn()}
        onOpenNote={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('KITCHEN'));

    expect(screen.getByRole('button', { name: /screenplay\.scenes\.edit/ })).toBeInTheDocument();
  });
});
