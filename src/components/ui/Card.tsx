import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useTheme } from '../../theme/ThemeProvider';

// Define our custom props
type CardBaseProps = {
  variant?: 'elevated' | 'outline' | 'filled' | 'unstyled';
  hoverable?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' | 'inner';
  children: React.ReactNode;
  className?: string;
};

// Create a type that combines our custom props with div HTML attributes and motion props
type CardProps = CardBaseProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> &
  Omit<HTMLMotionProps<'div'>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'>;

const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'elevated',
  hoverable = false,
  rounded = 'lg',
  shadow = 'md',
  className = '',
  children,
  ...props
}, ref) => {
  const { theme } = useTheme();

  // Base card classes
  const baseClasses = [
    'transition-all duration-200',
    'overflow-hidden',
    'focus:outline-none',
    variant !== 'unstyled' && 'bg-white dark:bg-neutral-800',
    variant === 'outline' && 'border border-gray-200 dark:border-neutral-700',
    variant === 'filled' && 'bg-gray-50 dark:bg-neutral-800/50',
    shadow === 'sm' && 'shadow-sm',
    shadow === 'md' && 'shadow-md',
    shadow === 'lg' && 'shadow-lg',
    shadow === 'xl' && 'shadow-xl',
    shadow === '2xl' && 'shadow-2xl',
    shadow === 'inner' && 'shadow-inner',
    shadow === 'none' && 'shadow-none',
    rounded === 'sm' && 'rounded-sm',
    rounded === 'md' && 'rounded-md',
    rounded === 'lg' && 'rounded-lg',
    rounded === 'xl' && 'rounded-xl',
    rounded === '2xl' && 'rounded-2xl',
    rounded === 'full' && 'rounded-full',
    rounded === 'none' && 'rounded-none',
    hoverable && 'hover:shadow-lg hover:-translate-y-0.5 dark:hover:shadow-neutral-800/50',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      ref={ref}
      className={baseClasses}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverable ? { scale: 1.01 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

// Card Components
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-4 border-b border-gray-100 dark:border-neutral-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
);

CardBody.displayName = 'CardBody';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-6 py-4 bg-gray-50 dark:bg-neutral-800/50 border-t border-gray-100 dark:border-neutral-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export default Card;
