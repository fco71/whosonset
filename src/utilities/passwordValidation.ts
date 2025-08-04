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

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    name: 'length',
    test: (password: string) => password.length >= 8,
    message: 'At least 8 characters'
  },
  {
    name: 'uppercase',
    test: (password: string) => /[A-Z]/.test(password),
    message: 'At least one uppercase letter'
  },
  {
    name: 'lowercase',
    test: (password: string) => /[a-z]/.test(password),
    message: 'At least one lowercase letter'
  },
  {
    name: 'number',
    test: (password: string) => /\d/.test(password),
    message: 'At least one number'
  },
  {
    name: 'special',
    test: (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    message: 'At least one special character (!@#$%^&*...)'
  }
];

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let score = 0;
  
  // Check each requirement
  PASSWORD_REQUIREMENTS.forEach(requirement => {
    if (requirement.test(password)) {
      score += 20; // Each requirement adds 20 points
    } else {
      errors.push(requirement.message);
    }
  });
  
  // Additional scoring based on length and complexity
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 10; // Multiple special characters
  }
  if (/\d.*\d/.test(password)) {
    score += 10; // Multiple numbers
  }
  
  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  if (score < 60) strength = 'weak';
  else if (score < 80) strength = 'medium';
  else if (score < 100) strength = 'strong';
  else strength = 'very-strong';
  
  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score: Math.min(score, 100)
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