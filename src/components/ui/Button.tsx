import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { motion, HTMLMotionProps } from 'framer-motion';

// Define our custom props
type ButtonBaseProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full' | 'none';
};

// Create a type that combines our custom props with button HTML attributes and motion props
type ButtonProps = ButtonBaseProps & 
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDragStart' | 'onDragEnd' | 'onDrag'> &
  Omit<HTMLMotionProps<'button'>, 'onDragStart' | 'onDragEnd' | 'onDrag'> & {
    as?: React.ElementType;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled = false,
  fullWidth = false,
  rounded = 'md',
  ...props
}, ref) => {
  const { theme } = useTheme();
  const isDisabled = isLoading || disabled;

  // Base classes
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-200 ease-in-out
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}
    ${rounded === 'sm' ? 'rounded' : 
      rounded === 'md' ? 'rounded-md' : 
      rounded === 'lg' ? 'rounded-lg' : 
      rounded === 'full' ? 'rounded-full' : 
      'rounded-none'}
  `;

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }[size];

  // Variant classes - using direct colors since Tailwind can't handle dynamic classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white border border-transparent hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 border border-transparent hover:bg-gray-300',
    outline: 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent',
    link: 'bg-transparent text-blue-600 hover:underline p-0',
    danger: 'bg-red-600 text-white border border-transparent hover:bg-red-700',
  }[variant];

  // Loading spinner
  const loadingSpinner = (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <motion.button
      ref={ref}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      {...props}
    >
      {isLoading && loadingSpinner}
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {isLoading && loadingText ? loadingText : children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';

export { Button };
