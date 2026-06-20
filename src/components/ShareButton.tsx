import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ShareButtonProps {
  /** Absolute URL to share (e.g. https://myfilmjobs.com/resume/abc). */
  url: string;
  /** Title for the native share sheet. */
  title?: string;
  /** Optional descriptive text for the native share sheet. */
  text?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Share control: on mobile / supported browsers it opens the native share sheet
 * (navigator.share); everywhere else it copies the link to the clipboard. Pairs with the
 * server-rendered link previews (#1) so a shared profile/job unfurls as a rich card.
 */
const ShareButton: React.FC<ShareButtonProps> = ({ url, title, text, className, style }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const nav = typeof navigator !== 'undefined' ? navigator : undefined;
    if (nav?.share) {
      try {
        await nav.share({ title, text, url });
      } catch {
        /* user cancelled or the sheet failed — nothing to do */
      }
      return;
    }
    // Desktop fallback: copy the link.
    try {
      await nav?.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t('share.copyPrompt', { defaultValue: 'Copy this link:' }), url);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={className}
      style={style}
      aria-label={t('share.button', { defaultValue: 'Share' })}
    >
      {copied
        ? `✓ ${t('share.copied', { defaultValue: 'Link copied' })}`
        : `↗ ${t('share.button', { defaultValue: 'Share' })}`}
    </button>
  );
};

export default ShareButton;
