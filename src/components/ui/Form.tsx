import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// ============================================================================
// FORM INPUT COMPONENT
// ============================================================================

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  fullWidth = true,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = clsx(
    'form-input',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    {
      'w-full': fullWidth,
      'pl-10': leftIcon,
      'pr-10': rightIcon,
      'border-red-300 focus:border-red-500 focus:ring-red-500': error,
      'border-gray-300 focus:border-blue-500': !error,
      'bg-gray-50 border-gray-200': variant === 'filled',
      'bg-white border-gray-300': variant === 'default',
      'bg-transparent border-2 border-gray-300': variant === 'outline',
      'h-8 px-3 text-sm': size === 'sm',
      'h-10 px-4 text-base': size === 'md',
      'h-12 px-4 text-lg': size === 'lg',
    },
    className
  );

  return (
    <div className={clsx('space-y-1', { 'w-full': fullWidth })}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="flex items-start space-x-2">
          {error && (
            <p className="text-sm text-red-600 flex items-center">
              <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

// ============================================================================
// FORM TEXTAREA COMPONENT
// ============================================================================

interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  rows?: number;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  fullWidth = true,
  className,
  id,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const textareaClasses = clsx(
    'form-textarea',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'resize-vertical',
    {
      'w-full': fullWidth,
      'border-red-300 focus:border-red-500 focus:ring-red-500': error,
      'border-gray-300 focus:border-blue-500': !error,
      'bg-gray-50 border-gray-200': variant === 'filled',
      'bg-white border-gray-300': variant === 'default',
      'bg-transparent border-2 border-gray-300': variant === 'outline',
      'px-3 py-2 text-sm': size === 'sm',
      'px-4 py-3 text-base': size === 'md',
      'px-4 py-4 text-lg': size === 'lg',
    },
    className
  );

  return (
    <div className={clsx('space-y-1', { 'w-full': fullWidth })}>
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      
      {(error || helperText) && (
        <div className="flex items-start space-x-2">
          {error && (
            <p className="text-sm text-red-600 flex items-center">
              <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

// ============================================================================
// FORM SELECT COMPONENT
// ============================================================================

interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: FormSelectOption[];
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
  label,
  error,
  helperText,
  options,
  variant = 'default',
  size = 'md',
  fullWidth = true,
  className,
  id,
  onChange,
  placeholder,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const selectClasses = clsx(
    'form-select',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'cursor-pointer',
    {
      'w-full': fullWidth,
      'border-red-300 focus:border-red-500 focus:ring-red-500': error,
      'border-gray-300 focus:border-blue-500': !error,
      'bg-gray-50 border-gray-200': variant === 'filled',
      'bg-white border-gray-300': variant === 'default',
      'bg-transparent border-2 border-gray-300': variant === 'outline',
      'h-8 px-3 text-sm': size === 'sm',
      'h-10 px-4 text-base': size === 'md',
      'h-12 px-4 text-lg': size === 'lg',
    },
    className
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={clsx('space-y-1', { 'w-full': fullWidth })}>
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <select
        ref={ref}
        id={selectId}
        className={selectClasses}
        onChange={handleChange}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {(error || helperText) && (
        <div className="flex items-start space-x-2">
          {error && (
            <p className="text-sm text-red-600 flex items-center">
              <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

// ============================================================================
// FORM CHECKBOX COMPONENT
// ============================================================================

interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (checked: boolean) => void;
}

const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(({
  label,
  error,
  helperText,
  size = 'md',
  className,
  id,
  onChange,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const checkboxClasses = clsx(
    'form-checkbox',
    'rounded border-gray-300 text-blue-600',
    'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'transition-all duration-200',
    {
      'border-red-300 focus:ring-red-500': error,
      'h-4 w-4': size === 'sm',
      'h-5 w-5': size === 'md',
      'h-6 w-6': size === 'lg',
    },
    className
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-start space-x-3">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={checkboxClasses}
          onChange={handleChange}
          {...props}
        />
        {label && (
          <label 
            htmlFor={checkboxId}
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="flex items-start space-x-2 ml-8">
          {error && (
            <p className="text-sm text-red-600 flex items-center">
              <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

FormCheckbox.displayName = 'FormCheckbox';

// ============================================================================
// FORM RADIO COMPONENT
// ============================================================================

interface FormRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: string) => void;
}

const FormRadio = forwardRef<HTMLInputElement, FormRadioProps>(({
  label,
  error,
  helperText,
  size = 'md',
  className,
  id,
  onChange,
  ...props
}, ref) => {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  const radioClasses = clsx(
    'form-radio',
    'border-gray-300 text-blue-600',
    'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'transition-all duration-200',
    {
      'border-red-300 focus:ring-red-500': error,
      'h-4 w-4': size === 'sm',
      'h-5 w-5': size === 'md',
      'h-6 w-6': size === 'lg',
    },
    className
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-start space-x-3">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={radioClasses}
          onChange={handleChange}
          {...props}
        />
        {label && (
          <label 
            htmlFor={radioId}
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="flex items-start space-x-2 ml-8">
          {error && (
            <p className="text-sm text-red-600 flex items-center">
              <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

FormRadio.displayName = 'FormRadio';

// ============================================================================
// FORM FIELD GROUP COMPONENT
// ============================================================================

interface FormFieldGroupProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  children,
  title,
  description,
  className
}) => {
  return (
    <div className={clsx('space-y-4', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// FORM COMPONENT
// ============================================================================

interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  className,
  ...props
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx('space-y-6', className)}
      {...props}
    >
      {children}
    </form>
  );
};

// Export all components
export {
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormRadio,
  FormFieldGroup,
  Form
}; 