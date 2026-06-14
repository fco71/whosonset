import { beforeEach, describe, expect, it, vi } from 'vitest';

const firestoreMocks = vi.hoisted(() => ({
  collection: vi.fn(() => ({ path: 'Projects' })),
  query: vi.fn((...parts: unknown[]) => ({ parts })),
  where: vi.fn((...parts: unknown[]) => ({ where: parts })),
  getDocs: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  arrayUnion: vi.fn(),
  serverTimestamp: vi.fn(),
  Timestamp: { now: vi.fn(), fromDate: vi.fn() }
}));

vi.mock('../firebase', () => ({ db: { name: 'test-db' } }));
vi.mock('firebase/firestore', () => firestoreMocks);

import { ProjectCrewService } from './ProjectCrewService';

describe('ProjectCrewService.getProjectsForCrewMember', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMocks.doc.mockReturnValue({ path: 'Projects/project-1' });
    firestoreMocks.arrayUnion.mockImplementation(
      (...values: unknown[]) => ({ operation: 'arrayUnion', values })
    );
    firestoreMocks.serverTimestamp.mockReturnValue({ operation: 'serverTimestamp' });
  });

  it('uses the crewMemberIds array index and returns only active memberships', async () => {
    firestoreMocks.getDocs.mockResolvedValue({
      docs: [
        {
          id: 'active-project',
          data: () => ({
            projectName: 'Active Project',
            crewMemberIds: ['member-1'],
            crewMembers: [{ userId: 'member-1', status: 'active' }]
          })
        },
        {
          id: 'stale-project',
          data: () => ({
            projectName: 'Stale Project',
            crewMemberIds: ['member-1'],
            crewMembers: [{ userId: 'member-1', status: 'inactive' }]
          })
        }
      ]
    });

    const projects = await ProjectCrewService.getProjectsForCrewMember('member-1');

    expect(firestoreMocks.collection).toHaveBeenCalledWith(
      { name: 'test-db' },
      'Projects'
    );
    expect(firestoreMocks.where).toHaveBeenCalledWith(
      'crewMemberIds',
      'array-contains',
      'member-1'
    );
    expect(firestoreMocks.query).toHaveBeenCalledOnce();
    expect(firestoreMocks.getDocs).toHaveBeenCalledWith(
      expect.objectContaining({ parts: expect.any(Array) })
    );
    expect(projects.map(project => project.id)).toEqual(['active-project']);
  });

  it('adds accepted invitations to the queryable crewMemberIds field', async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        updateCount: 2,
        crewMembers: [],
        invitedCrewMembers: [{
          userId: 'member-1',
          userEmail: 'member@example.com',
          displayName: 'Member One',
          role: 'Editor',
          department: 'Editorial',
          status: 'pending',
          invitedBy: 'owner-1'
        }]
      })
    });

    await ProjectCrewService.respondToInvitation(
      'project-1',
      'member-1',
      'accepted'
    );

    expect(firestoreMocks.updateDoc).toHaveBeenCalledWith(
      { path: 'Projects/project-1' },
      expect.objectContaining({
        crewMemberIds: {
          operation: 'arrayUnion',
          values: ['member-1']
        }
      })
    );
  });
});
