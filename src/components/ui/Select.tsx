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
      outline: `bg-white dark:bg-neutral-50 border ${
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
          : 'border-gray-200 dark:border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50'
      } shadow-sm hover:border-gray-300 dark:hover:border-gray-400 transition-colors`,
      filled: `bg-gray-50 dark:bg-gray-100 border border-gray-200 dark:border-gray-300 ${
        error
          ? 'focus:border-red-500 focus:ring-1 focus:ring-red-500'
          : 'focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50'
      } hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors`,
      flushed: `bg-transparent border-0 border-b ${
        error
          ? 'border-red-500 focus:border-red-500'
          : 'border-gray-200 dark:border-gray-300 focus:border-primary-500'
      } rounded-none px-0 hover:border-gray-300 dark:hover:border-gray-400 transition-colors`,
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
              isFocused ? 'ring-1 ring-primary-500/50' : ''
            } rounded-md transition-all duration-150 ${
              disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'
            } ${className}`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={(e) => !disabled && (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen)}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-disabled={disabled}
          >
            {leftIcon && (
              <div className="absolute left-3 flex items-center justify-center text-gray-400 dark:text-gray-400">
                {leftIcon}
              </div>
            )}

            <span
              className={`flex-1 text-left truncate ${
                leftIcon ? 'pl-9' : 'pl-3'
              } pr-8 text-gray-800 dark:text-gray-800`}
            >
              {selectedOption?.label || <span className="text-gray-500">{placeholder}</span>}
            </span>

            <FiChevronDown
              className={`absolute right-3 h-4 w-4 text-gray-500 dark:text-gray-500 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </div>

          {isOpen && (
            <div 
              className="absolute z-10 w-full mt-1 bg-white dark:bg-white rounded-md shadow-lg border border-gray-200 dark:border-gray-200 max-h-60 overflow-auto py-1 focus:outline-none"
              role="listbox"
              tabIndex={-1}
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`px-3 py-2 text-sm text-gray-800 dark:text-gray-800 hover:bg-gray-50 dark:hover:bg-gray-100 cursor-pointer transition-colors ${
                    option.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  } ${
                    selectedOption?.value === option.value
                      ? 'bg-blue-50 dark:bg-blue-50 text-blue-700 dark:text-blue-800 font-medium'
                      : ''
                  }`}
                  onClick={() => handleOptionClick(option)}
                  role="option"
                  aria-selected={selectedOption?.value === option.value}
                  aria-disabled={option.disabled}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{option.label}</span>
                    {selectedOption?.value === option.value && (
                      <FiCheck className="h-4 w-4 text-blue-600 dark:text-blue-700 flex-shrink-0 ml-2" />
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
