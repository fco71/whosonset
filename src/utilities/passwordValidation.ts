export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number; // 0-100
}

export interface PasswordRequirement {
  name: string;
  test: (password: string) => boolean;
  message: string;
}

// Early-adoption password policy: a single minimum-length rule that mirrors
// Firebase Auth's own hard floor (6 characters). Deliberately NO complexity
// requirements (uppercase/number/symbol) — those deter sign-ups at this stage,
// and this gate only ever applies to CREATING or RESETTING a password, never
// to logging in, so existing users with older/simpler passwords are unaffected.
export const MIN_PASSWORD_LENGTH = 6;

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    name: 'length',
    test: (password: string) => password.length >= MIN_PASSWORD_LENGTH,
    message: `At least ${MIN_PASSWORD_LENGTH} characters`
  }
];

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  PASSWORD_REQUIREMENTS.forEach(requirement => {
    if (!requirement.test(password)) {
      errors.push(requirement.message);
    }
  });

  const isValid = errors.length === 0;
  // Strength/score are retained for interface compatibility but are no longer
  // surfaced in the UI (the strength meter + checklist were removed). Report a
  // neutral pass/fail so any future consumer isn't misled.
  return {
    isValid,
    errors,
    strength: isValid ? 'strong' : 'weak',
    score: isValid ? 100 : 0
  };
};

export const getPasswordStrengthColor = (strength: string): string => {
  switch (strength) {
    case 'weak': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'strong': return 'text-blue-500';
    case 'very-strong': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

export const getPasswordStrengthText = (strength: string): string => {
  switch (strength) {
    case 'weak': return 'Weak';
    case 'medium': return 'Medium';
    case 'strong': return 'Strong';
    case 'very-strong': return 'Very Strong';
    default: return 'Unknown';
  }
}; 