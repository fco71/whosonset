import React, { SelectHTMLAttributes, forwardRef, useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  options: Option[];
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  variant?: 'outline' | 'filled' | 'flushed' | 'unstyled';
  selectSize?: 'sm' | 'md' | 'lg';
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      leftIcon,
      className = '',
      containerClassName = '',
      labelClassName = '',
      errorClassName = '',
      variant = 'outline',
      selectSize = 'md',
      placeholder = 'Select an option',
      id,
      value,
      disabled,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(
      options.find((opt) => opt.value === value) || null
    );

    const inputId = id || React.useId();

    // Size classes
    const sizeClasses = {
      sm: 'h-8 text-xs px-2.5 py-1.5',
      md: 'h-10 text-sm px-3 py-2',
      lg: 'h-12 text-base px-4 py-3',
    }[selectSize];

    // Variant classes
    const variantClasses = {
      outline: `bg-white dark:bg-neutral-800 border ${
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
    }[selectSize];

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleOptionClick = (option: Option) => {
      if (option.disabled) return;
      setSelectedOption(option);
      setIsOpen(false);
      // Trigger onChange event
      const fakeEvent = {
        target: { value: option.value, name: props.name },
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      props.onChange?.(fakeEvent);
    };

    return (
      <div className={`relative w-full ${containerClassName}`}>
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

        <div className="relative">
          <div
            className={`relative flex items-center ${sizeClasses} ${variantClasses} ${
              isFocused ? 'ring-1 ring-primary-500' : ''
            } rounded-md transition-all duration-200 ${
              disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
            } ${className}`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            {leftIcon && (
              <div className="absolute left-3 flex items-center justify-center text-gray-400 dark:text-gray-400">
                {leftIcon}
              </div>
            )}

            <span
              className={`flex-1 text-left truncate ${
                leftIcon ? 'pl-9' : 'pl-3'
              } pr-8 text-gray-900 dark:text-white`}
            >
              {selectedOption?.label || placeholder}
            </span>

            <FiChevronDown
              className={`absolute right-3 h-4 w-4 text-gray-400 dark:text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </div>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-gray-200 dark:border-neutral-700 max-h-60 overflow-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer ${
                    option.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  } ${
                    selectedOption?.value === option.value
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-200'
                      : ''
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  <div className="flex items-center">
                    <span className="flex-1">{option.label}</span>
                    {selectedOption?.value === option.value && (
                      <FiCheck className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                </div>
              ))}
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

Select.displayName = 'Select';

export default Select;
