import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BlogPost } from '../types/blog';

const fetchBlogPostById = vi.fn();
const fetchBlogPosts = vi.fn();
const fetchOriginalBlogPosts = vi.fn();

vi.mock('../services/blogService', () => ({
  fetchBlogPostById: (...args: unknown[]) => fetchBlogPostById(...args),
  fetchBlogPosts: (...args: unknown[]) => fetchBlogPosts(...args),
  fetchOriginalBlogPosts: (...args: unknown[]) => fetchOriginalBlogPosts(...args),
}));
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => ({ currentUser: null }) }));
vi.mock('../utilities/conversionTracking', () => ({ trackConversion: vi.fn() }));
vi.mock('../components/Blog/BlogCommentSection', () => ({ default: () => null }));

import BlogPostPage from './BlogPostPage';

const basePost: BlogPost = {
  id: 'tarifas-crew-rd',
  title: 'Tarifas de crew en RD',
  summary: 'Cuánto se cobra por día en cada departamento.',
  sourceName: 'Source',
  sourceUrl: '',
  originalUrl: '',
  category: 'careers',
  tags: ['crew'],
  publishedAt: new Date('2026-10-23T00:00:00Z'),
  curatedDate: '',
  commentsCount: 0,
  isPublic: true,
  postType: 'original',
  contentPolicy: 'original',
  bodyHtml: '<p>Hola crew</p><h2>Cámara</h2>',
  lang: 'es',
  authorName: 'Francisco Valdez',
};

function renderAt(postId: string) {
  return render(
    <MemoryRouter initialEntries={[`/blog/${postId}`]}>
      <Routes>
        <Route path="/blog/:postId" element={<BlogPostPage />} />
      </Routes>
    </MemoryRouter>
  );
}

const robots = () => document.querySelector('meta[name="robots"]')?.getAttribute('content');
const hreflang = (code: string) =>
  document.querySelector(`link[rel="alternate"][hreflang="${code}"]`)?.getAttribute('href');

describe('BlogPostPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchBlogPosts.mockResolvedValue([]);
    fetchOriginalBlogPosts.mockResolvedValue([]);
  });

  it('renders an original post body, author, and an indexable robots tag', async () => {
    fetchBlogPostById.mockResolvedValue(basePost);
    renderAt(basePost.id);

    expect(await screen.findByRole('heading', { level: 2, name: 'Cámara' })).toBeInTheDocument();
    expect(screen.getByText('Hola crew')).toBeInTheDocument();
    expect(screen.getByText('Francisco Valdez')).toBeInTheDocument();
    expect(screen.queryByText('Read Article')).not.toBeInTheDocument();
    await waitFor(() => expect(robots()).toMatch(/^index, follow/));
    expect(fetchOriginalBlogPosts).toHaveBeenCalled();
    // Spanish article → Spanish page chrome and <html lang>.
    expect(await screen.findByText('Crece con My Film Jobs')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('es');
    // No translation → only its own hreflang, no ?lang= variants.
    await waitFor(() => expect(hreflang('es')).toBe('https://myfilmjobs.com/blog/tarifas-crew-rd'));
    expect(hreflang('en')).toBeUndefined();
  });

  it('links the es and en versions of an original article', async () => {
    const english: BlogPost = {
      ...basePost,
      id: 'crew-rates-dr',
      title: 'Crew rates in the DR',
      lang: 'en',
      translationSlug: 'tarifas-crew-rd',
    };
    fetchBlogPostById.mockImplementation(async (id: string) =>
      id === 'tarifas-crew-rd' ? { ...basePost, translationSlug: 'crew-rates-dr' } : id === 'crew-rates-dr' ? english : null
    );
    renderAt('tarifas-crew-rd');

    const switchLink = await screen.findByRole('link', { name: 'Read in English' });
    expect(switchLink).toHaveAttribute('href', '/blog/crew-rates-dr');
    await waitFor(() => expect(hreflang('en')).toBe('https://myfilmjobs.com/blog/crew-rates-dr'));
    expect(hreflang('es')).toBe('https://myfilmjobs.com/blog/tarifas-crew-rd');
    expect(hreflang('en')).toBe('https://myfilmjobs.com/blog/crew-rates-dr');
    expect(hreflang('x-default')).toBe('https://myfilmjobs.com/blog/tarifas-crew-rd');
  });

  it('marks curated headlines noindex, follow and keeps the link out', async () => {
    fetchBlogPostById.mockResolvedValue({
      ...basePost,
      id: '2026-10-22-05d711581ff7',
      postType: 'curated',
      contentPolicy: 'metadata_only',
      bodyHtml: undefined,
      originalUrl: 'https://example.com/story',
    });
    renderAt('2026-10-22-05d711581ff7');

    expect(await screen.findByText('Read Article')).toBeInTheDocument();
    await waitFor(() => expect(robots()).toBe('noindex, follow'));
    expect(fetchBlogPosts).toHaveBeenCalled();
  });
});
