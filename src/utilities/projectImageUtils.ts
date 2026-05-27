const FIREBASE_STORAGE_MEDIA_BASE = 'https://firebasestorage.googleapis.com/v0/b';

function buildFirebaseStorageMediaUrl(bucket: string, storagePath: string): string {
  return `${FIREBASE_STORAGE_MEDIA_BASE}/${encodeURIComponent(bucket)}/o/${encodeURIComponent(storagePath)}?alt=media`;
}

export function resolveProjectImageUrl(rawUrl?: string | null): string | null {
  const url = typeof rawUrl === 'string' ? rawUrl.trim() : '';

  if (!url || url.startsWith('blob:')) {
    return null;
  }

  if (url.startsWith('//')) {
    return `https:${url}`;
  }

  if (/^(https?:|data:image\/|\/)/i.test(url)) {
    return url;
  }

  if (url.startsWith('gs://')) {
    const storageReference = url.slice('gs://'.length);
    const firstSlashIndex = storageReference.indexOf('/');

    if (firstSlashIndex <= 0) {
      return null;
    }

    const bucket = storageReference.slice(0, firstSlashIndex);
    const storagePath = storageReference.slice(firstSlashIndex + 1);
    return buildFirebaseStorageMediaUrl(bucket, storagePath);
  }

  const bucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
  if (bucket && /^[\w./% -]+$/.test(url)) {
    return buildFirebaseStorageMediaUrl(bucket, url);
  }

  return null;
}

export function getProjectImagePlaceholder(projectName?: string): string {
  const title = encodeURIComponent(projectName?.trim() || 'Project Image');

  return [
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 225%22%3E',
    '%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%22 x2=%221%22 y1=%220%22 y2=%221%22%3E',
    '%3Cstop stop-color=%22%23eff6ff%22/%3E%3Cstop offset=%221%22 stop-color=%22%23f5f3ff%22/%3E',
    '%3C/linearGradient%3E%3C/defs%3E',
    '%3Crect width=%22400%22 height=%22225%22 fill=%22url(%23g)%22/%3E',
    '%3Ccircle cx=%22200%22 cy=%2278%22 r=%2224%22 fill=%22none%22 stroke=%22%239ca3af%22 stroke-width=%226%22/%3E',
    '%3Cpath d=%22M170 138l42-38 42 38M112 168h176%22 fill=%22none%22 stroke=%22%239ca3af%22 stroke-width=%226%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E',
    `%3Ctext x=%22200%22 y=%22200%22 font-family=%22Inter, Arial, sans-serif%22 font-size=%2215%22 text-anchor=%22middle%22 fill=%22%236b7280%22%3E${title}%3C/text%3E`,
    '%3C/svg%3E',
  ].join('');
}
