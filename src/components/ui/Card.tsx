import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import clsx from 'clsx';

// Card variant types
export type CardVariant = 'elevated' | 'outline' | 'filled' | 'unstyled';
type RoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
type ShadowSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';

// Base card props
type CardBaseProps = {
  variant?: CardVariant;
  hoverable?: boolean;
  rounded?: RoundedSize;
  shadow?: ShadowSize;
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

// Combine all card props
type CardProps = CardBaseProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> &
  Omit<HTMLMotionProps<'div'>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'>;

const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'elevated',
  hoverable = false,
  rounded = 'lg',
  shadow = 'md',
  padding = 'md',
  className = '',
  children,
  ...props
}, ref) => {
  // Base card classes
  const baseClasses = clsx(
    // Base styles
    'transition-all duration-200',
    'overflow-hidden',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    
    // Variant styles
    variant === 'elevated' && 'bg-white border border-gray-100',
    variant === 'outline' && 'bg-white border border-gray-200',
    variant === 'filled' && 'bg-gray-50',
    variant === 'unstyled' && 'bg-transparent',
    
    // Shadow
    shadow === 'sm' && 'shadow-sm',
    shadow === 'md' && 'shadow',
    shadow === 'lg' && 'shadow-md',
    shadow === 'xl' && 'shadow-lg',
    shadow === '2xl' && 'shadow-xl',
    shadow === 'inner' && 'shadow-inner',
    
    // Rounded corners
    rounded === 'sm' && 'rounded-sm',
    rounded === 'md' && 'rounded',
    rounded === 'lg' && 'rounded-lg',
    rounded === 'xl' && 'rounded-xl',
    rounded === '2xl' && 'rounded-2xl',
    rounded === 'full' && 'rounded-full',
    
    // Padding
    padding === 'sm' && 'p-3',
    padding === 'md' && 'p-4',
    padding === 'lg' && 'p-6',
    
    // Hover effects
    hoverable && [
      'hover:shadow-lg',
      'hover:-translate-y-0.5',
      'transform transition-transform duration-200',
      'hover:ring-2 hover:ring-blue-100',
    ],
    
    // Custom class names
    className
  );

  // Animation variants with proper typing
  const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Hover animation
  const hoverAnimation = hoverable ? { scale: 1.01 } : {};

  return (
    <motion.div
      ref={ref}
      className={baseClasses}
      initial="hidden"
      animate="visible"
      whileHover={hoverAnimation}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

// Card Components
// Card Header Component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', withBorder = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'px-4 py-3',
        withBorder && 'border-b border-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

// Card Body Component
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', padding = 'md', children, ...props }, ref) => {
    const paddingClass = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    }[padding];

    return (
      <div 
        ref={ref} 
        className={clsx(paddingClass, className)} 
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

// Card Footer Component
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', withBorder = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'px-4 py-3',
        withBorder && 'border-t border-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

// Card Title Component
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  children: React.ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Tag = 'h3', className = '', children, ...props }, ref) => (
    <Tag 
      ref={ref} 
      className={clsx('text-lg font-semibold text-gray-900', className)}
      {...props}
    >
      {children}
    </Tag>
  )
);

CardTitle.displayName = 'CardTitle';

// Card Description Component
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children: React.ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className = '', children, ...props }, ref) => (
    <p 
      ref={ref} 
      className={clsx('text-sm text-gray-600 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

export default Card;
