import * as React from 'react';
import { cn } from '../../lib/utils';

type DropdownMenuProps = {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
};

type DropdownMenuTriggerProps = {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
};

type DropdownMenuContentProps = {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
};

type DropdownMenuItemProps = {
  children: React.ReactNode;
  className?: string;
  onSelect?: (event: Event) => void;
  disabled?: boolean;
};

const DropdownMenu = ({ children, className, align = 'end' }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === DropdownMenuTrigger) {
        return React.cloneElement(child as React.ReactElement, {
          onClick: () => setIsOpen(!isOpen),
        });
      }
      if (child.type === DropdownMenuContent) {
        return isOpen ? React.cloneElement(child as React.ReactElement, { align }) : null;
      }
    }
    return child;
  });

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      {childrenWithProps}
    </div>
  );
};

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ children, className, asChild = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500',
          className
        )}
        aria-haspopup="true"
        {...props}
      >
        {children}
      </button>
    );
  }
);

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ children, className, align = 'end', sideOffset = 4, ...props }, ref) => {
    const alignmentClasses = {
      start: 'origin-top-left left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'origin-top-right right-0',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5',
          'focus:outline-none',
          alignmentClasses[align],
          className
        )}
        style={{ marginTop: `${sideOffset}px` }}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
        {...props}
      >
        <div className="py-1" role="none">
          {children}
        </div>
      </div>
    );
  }
);

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ children, className, onSelect, disabled = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'block w-full text-left px-4 py-2 text-sm text-gray-700',
          'hover:bg-gray-100 hover:text-gray-900',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          className
        )}
        role="menuitem"
        tabIndex={-1}
        onClick={(e) => {
          if (disabled) return;
          onSelect?.(e as unknown as Event);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// Set display names for components
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';
DropdownMenuContent.displayName = 'DropdownMenuContent';
DropdownMenuItem.displayName = 'DropdownMenuItem';

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
