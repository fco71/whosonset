import { describe, expect, it } from 'vitest';
import { getRouteRobots, getSeoForPath, isNoindexRoute, NOINDEX_ROBOTS, normalizeSeoPath } from './routeSeo';

describe('route SEO classification', () => {
  it('normalizes paths before matching route metadata', () => {
    expect(normalizeSeoPath('jobs/')).toBe('/jobs');
    expect(getSeoForPath('/jobs/').title).toBe('Film Jobs Board | Production, Crew, and Creative Roles');
  });

  it('leaves public discovery routes indexable by default', () => {
    expect(isNoindexRoute('/')).toBe(false);
    expect(isNoindexRoute('/jobs')).toBe(false);
    expect(isNoindexRoute('/jobs/gaffer-needed')).toBe(false);
    expect(isNoindexRoute('/blog')).toBe(false);
    expect(isNoindexRoute('/crew-public')).toBe(false);
    expect(isNoindexRoute('/directory/camera/dominican-republic')).toBe(false);
    expect(getRouteRobots('/jobs')).toBeUndefined();
  });

  it('marks auth, private app, and workflow routes noindex', () => {
    [
      '/login',
      '/register',
      '/chat',
      '/collaboration/class/abc',
      '/settings',
      '/projects/project-1/manage',
      '/applications/app-1/edit',
      '/jobs/posted',
      '/jobs/applied',
      '/jobs/job-1/apply',
      '/jobs/job-1/applications',
      '/email-integration-test',
    ].forEach(path => {
      expect(getRouteRobots(path)).toBe(NOINDEX_ROBOTS);
    });
  });
});
