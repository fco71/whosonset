import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

// Button size classes
const sizeClasses = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2 text-sm',
  lg: 'h-12 px-6 py-3 text-base',
} as const;

// Button variant classes
const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400',
  outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-400',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus-visible:ring-2 focus-visible:ring-gray-300',
  link: 'bg-transparent text-blue-600 hover:underline p-0 focus-visible:ring-0',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-500',
} as const;

// Rounded classes
const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

// Button props
type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  as?: React.ElementType;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<HTMLMotionProps<'button'>, 'onDragStart' | 'onDragEnd' | 'onDrag'>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled = false,
  fullWidth = false,
  rounded = 'md',
  type = 'button',
  as: Component = motion.button,
  ...props
}, ref) => {
  const isDisabled = isLoading || disabled;

  // Generate class names
  const buttonClasses = clsx(
    'inline-flex items-center justify-center font-medium',
    'focus-visible:outline-none focus-visible:ring-offset-2',
    'transition-all duration-200 ease-in-out',
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses[rounded],
    {
      'w-full': fullWidth,
      'opacity-60 cursor-not-allowed pointer-events-none': isDisabled,
    },
    className
  );

  // Loading spinner
  const loadingSpinner = (
    <svg
      className="animate-spin h-4 w-4 text-current flex-shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <Component
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          {loadingSpinner}
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </span>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </Component>
  );
});

Button.displayName = 'Button';

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonRounded };
