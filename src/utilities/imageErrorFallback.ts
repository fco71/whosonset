// Utility for robust <img> error fallback
export function imageErrorFallback(e: React.SyntheticEvent<HTMLImageElement, Event>, fallback: string = '/default-avatar.svg') {
  const target = e.target as HTMLImageElement;
  if (!target.src.endsWith(fallback)) {
    target.src = fallback;
  }
} 