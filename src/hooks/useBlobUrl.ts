import { useState, useEffect } from 'react';

/**
 * A custom hook to manage blob URLs and ensure they're properly revoked when no longer needed.
 * @param blob The Blob or MediaSource to create a URL for, or null/undefined
 * @returns The blob URL as a string, or null if no blob was provided
 */
export const useBlobUrl = (blob: Blob | MediaSource | null | undefined): string | null => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    // If no blob is provided, clear any existing URL and return
    if (!blob) {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
      return;
    }

    // Create a new blob URL
    const newBlobUrl = URL.createObjectURL(blob);
    setBlobUrl(newBlobUrl);

    // Cleanup function to revoke the blob URL when the component unmounts or the blob changes
    return () => {
      if (newBlobUrl) {
        URL.revokeObjectURL(newBlobUrl);
        // Only reset the state if this is still the current URL
        setBlobUrl(prevUrl => prevUrl === newBlobUrl ? null : prevUrl);
      }
    };
  }, [blob]);

  return blobUrl;
};

/**
 * A custom hook to manage a blob URL from a string URL.
 * This is useful when you might have either a regular URL or a blob URL.
 * @param url The URL string (can be a regular URL or a blob URL)
 * @returns The URL as a string, or null if no URL was provided
 */
export const useManagedUrl = (url: string | null | undefined): string | null => {
  const [isBlobUrl, setIsBlobUrl] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const blobUrl = useBlobUrl(blob);

  useEffect(() => {
    // Reset state when URL changes
    setIsBlobUrl(false);
    setBlob(null);

    // If no URL or not a blob URL, we're done
    if (!url || !url.startsWith('blob:')) {
      return;
    }

    // If it's a blob URL, we need to fetch the blob
    const fetchBlob = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.error('Failed to fetch blob:', response.statusText);
          return;
        }
        const blobData = await response.blob();
        setBlob(blobData);
        setIsBlobUrl(true);
      } catch (error) {
        console.error('Error fetching blob:', error);
      }
    };

    fetchBlob();
  }, [url]);

  // Return the managed blob URL if we have one, otherwise return the original URL
  return isBlobUrl && blobUrl ? blobUrl : url || null;
};
