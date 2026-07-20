import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

const readRepoFile = (filePath: string) =>
  readFileSync(path.join(process.cwd(), filePath), 'utf8');

describe('SEO crawl guardrails', () => {
  const extractLocs = (xml: string) =>
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);

  it('keeps page routes crawlable so noindex directives can be seen', () => {
    const robots = readRepoFile('public/robots.txt');

    expect(robots).toMatch(/Allow:\s*\/$/m);
    expect(robots).toMatch(/Sitemap:\s*https:\/\/myfilmjobs\.com\/sitemap\.xml/);
    expect(robots).not.toMatch(/^Disallow:\s*\/(?:login|register|chat|collaboration|settings|applications|jobs|projects)/m);
  });

  it('sends server-level noindex headers for private app route families', () => {
    const firebaseConfig = JSON.parse(readRepoFile('firebase.json')) as {
      hosting: Array<{ headers?: Array<{ source: string; headers: Array<{ key: string; value: string }> }> }>;
    };

    const requiredSources = [
      '@(login|register|verify-email|forgot-password|reset-password|crew|projects|my-students|my-projects|saved-crew|saved-projects|collections|social|chat|collaboration|settings|edit-profile|post-job|applications|debug-jobs|email-test|email-integration-test|password-reset-test)',
      '@(projects|my-projects|saved-crew|saved-projects|collections|social|chat|collaboration|settings|applications)/**',
      'jobs/@(posted|applied|saved|analytics)',
      'jobs/*/@(apply|applications)',
    ];

    firebaseConfig.hosting.forEach(hostingTarget => {
      requiredSources.forEach(source => {
        const matchingRule = hostingTarget.headers?.find(rule => rule.source === source);
        expect(matchingRule?.headers).toContainEqual({
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow',
        });
      });
    });
  });

  it('keeps prerendered private job workflows noindex for crawler HTML', () => {
    const prerender = readRepoFile('functions/src/prerender.ts');

    expect(prerender).toMatch(/const NOINDEX_ROBOTS = "noindex, nofollow"/);
    expect(prerender).toMatch(/function isNoindexAppRoute/);
    expect(prerender).toMatch(/RESERVED_JOBS\.has\(parts\[1\]\)/);
    expect(prerender).toMatch(/parts\[2\] === "apply" \|\| parts\[2\] === "applications"/);
  });

  it('submits only always-indexable directory hubs in the directory sitemap', () => {
    const sitemap = readRepoFile('public/sitemap-directory.xml');
    const locs = extractLocs(sitemap);

    expect(locs).toEqual([
      'https://myfilmjobs.com/directorio',
      'https://myfilmjobs.com/directory',
    ]);
  });
});
