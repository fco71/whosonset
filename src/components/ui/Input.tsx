import React, { forwardRef, useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  variant?: 'outline' | 'filled' | 'flushed' | 'unstyled';
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      className = '',
      containerClassName = '',
      labelClassName = '',
      errorClassName = '',
      variant = 'outline',
      inputSize = 'md',
      id,
      disabled,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || React.useId();

    // Map our custom size to the appropriate classes
    const sizeClasses = {
      sm: 'h-8 text-xs px-2.5 py-1.5',
      md: 'h-10 text-sm px-3 py-2',
      lg: 'h-12 text-base px-4 py-3',
    }[inputSize || 'md'];

    // Variant classes
    const variantClasses = {
      outline: `bg-transparent border ${
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500'
      }`,
      filled: `bg-gray-50 dark:bg-neutral-700/30 border border-transparent ${
        error
          ? 'focus:border-red-500 focus:ring-red-500'
          : 'focus:border-primary-500 focus:ring-primary-500'
      }`,
      flushed: `bg-transparent border-0 border-b ${
        error
          ? 'border-red-500 focus:border-red-500'
          : 'border-gray-300 dark:border-neutral-600 focus:border-primary-500'
      } rounded-none px-0`,
      unstyled: 'bg-transparent border-0 p-0 focus:ring-0',
    }[variant];

    // Label classes
    const labelSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    }[inputSize || 'md'];

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block mb-1.5 font-medium text-gray-700 dark:text-gray-200 ${labelSizeClasses} ${labelClassName} ${
              error ? 'text-red-600 dark:text-red-400' : ''
            }`}
          >
            {label}
          </label>
        )}

        <div
          className={`relative flex items-center ${sizeClasses} ${variantClasses} ${
            isFocused ? 'ring-1 ring-primary-500' : ''
          } rounded-md transition-all duration-200 ${
            disabled ? 'opacity-60 cursor-not-allowed' : ''
          } ${className}`}
        >
          {leftIcon && (
            <div className="absolute left-3 flex items-center justify-center text-gray-400 dark:text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`w-full h-full bg-transparent border-0 focus:outline-none focus:ring-0 ${
              leftIcon ? 'pl-9' : 'pl-3'
            } ${rightIcon ? 'pr-9' : 'pr-3'} ${
              disabled ? 'cursor-not-allowed' : ''
            } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 flex items-center justify-center text-gray-400 dark:text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            className={`mt-1.5 text-sm text-red-600 dark:text-red-400 ${errorClassName}`}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
