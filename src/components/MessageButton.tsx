import React from 'react';

interface MessageButtonProps {
  email?: string;
  disabled?: boolean;
}

const EmailButton: React.FC<MessageButtonProps> = ({ email, disabled }) => {
  if (!email) return null;
  return (
    <a
      href={`mailto:${email}`}
      className={`inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition-all duration-200 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      style={{ minWidth: 110, justifyContent: 'center' }}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" stroke="none"/><path d="M22 6l-10 7L2 6" /></svg>
      Email
    </a>
  );
};

export default EmailButton;
