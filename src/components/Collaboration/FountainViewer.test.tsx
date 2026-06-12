import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import FountainViewer from './FountainViewer';

const firestoreMock = vi.hoisted(() => {
  let snapshotHandler: ((snapshot: {
    exists: () => boolean;
    data: () => { fountainSource: string };
  }) => void) | null = null;

  return {
    doc: vi.fn(() => ({ id: 'screenplay-1' })),
    onSnapshot: vi.fn((
      _ref: unknown,
      onNext: (snapshot: {
        exists: () => boolean;
        data: () => { fountainSource: string };
      }) => void
    ) => {
      snapshotHandler = onNext;
      return vi.fn();
    }),
    emitSource(source: string) {
      snapshotHandler?.({
        exists: () => true,
        data: () => ({ fountainSource: source })
      });
    }
  };
});

vi.mock('firebase/firestore', () => ({
  doc: firestoreMock.doc,
  onSnapshot: firestoreMock.onSnapshot
}));

vi.mock('../../firebase', () => ({
  db: {}
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) =>
      typeof options?.count === 'number' ? `${key}:${options.count}` : key
  })
}));

vi.mock('../../utilities/exportFountainPdf', () => ({
  exportElementToPdf: vi.fn()
}));

vi.mock('./FountainPages', () => ({
  default: ({ source, printMode }: { source: string; printMode?: boolean }) =>
    printMode ? null : <div data-testid="fountain-source">{source}</div>
}));

describe('FountainViewer live source synchronization', () => {
  it('publishes Firestore source updates to the reader and parent scene navigator', () => {
    const onSourceChange = vi.fn();

    render(
      <FountainViewer
        screenplayId="screenplay-1"
        initialSource="INT. OLD ROOM - DAY"
        onSourceChange={onSourceChange}
      />
    );

    expect(screen.getByTestId('fountain-source')).toHaveTextContent('INT. OLD ROOM - DAY');
    expect(onSourceChange).toHaveBeenCalledWith('INT. OLD ROOM - DAY');

    act(() => {
      firestoreMock.emitSource('EXT. NEW STREET - NIGHT');
    });

    expect(screen.getByTestId('fountain-source')).toHaveTextContent('EXT. NEW STREET - NIGHT');
    expect(onSourceChange).toHaveBeenLastCalledWith('EXT. NEW STREET - NIGHT');
  });
});
