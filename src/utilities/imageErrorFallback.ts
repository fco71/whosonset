// Utility for robust <img> error fallback
export function imageErrorFallback(e: React.SyntheticEvent<HTMLImageElement, Event>, fallback: string = '/bust-avatar.svg') {
  const target = e.target as HTMLImageElement;
  if (!target.src.endsWith(fallback)) {
    target.src = fallback;
    // Ensure proper sizing for the fallback image
    target.style.minWidth = '32px';
    target.style.minHeight = '32px';
    target.style.width = 'auto';
    target.style.height = 'auto';
  }
} 