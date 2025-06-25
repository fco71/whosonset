# Whosonset Design System

## Overview
Whosonset uses a modern, sophisticated design system inspired by premium film industry brands like Nowness, A24, and Behance. The design emphasizes clean typography, subtle animations, and a refined color palette.

## Color Palette

### Primary Colors
- **White**: `#ffffff` - Primary background
- **Gray 50**: `#f9fafb` - Subtle background gradients
- **Gray 100**: `#f3f4f6` - Light backgrounds and borders
- **Gray 200**: `#e5e7eb` - Form borders and hover states
- **Gray 300**: `#d1d5db` - Hover borders
- **Gray 400**: `#9ca3af` - Focus states
- **Gray 500**: `#6b7280` - Secondary text
- **Gray 600**: `#4b5563` - Body text
- **Gray 700**: `#374151` - Strong text
- **Gray 800**: `#1f2937` - Headings
- **Gray 900**: `#111827` - Primary headings and buttons

### Status Colors
- **Green**: `bg-green-100 text-green-800` - Available/Active
- **Blue**: `bg-blue-100 text-blue-800` - Pre-production
- **Purple**: `bg-purple-100 text-purple-800` - Post-production
- **Yellow**: `bg-yellow-100 text-yellow-800` - Development
- **Orange**: `bg-orange-100 text-orange-800` - In progress
- **Red**: `bg-red-100 text-red-800` - Cancelled/Unavailable

## Typography

### Font Weights
- **Light (300)**: Primary font weight for headings and body text
- **Medium (500)**: Used for labels and emphasis
- **Regular (400)**: Fallback for system fonts

### Font Sizes
- **6xl**: `text-6xl` - Hero headings
- **4xl**: `text-4xl` - Section headings
- **3xl**: `text-3xl` - Page titles
- **2xl**: `text-2xl` - Subsection headings
- **xl**: `text-xl` - Card titles
- **lg**: `text-lg` - Body text
- **base**: `text-base` - Default text
- **sm**: `text-sm` - Small text and labels
- **xs**: `text-xs` - Micro text

### Letter Spacing
- **Tight**: `tracking-tight` - Hero headings
- **Wide**: `tracking-wide` - Section headings
- **Wider**: `tracking-wider` - Labels and buttons

## Layout Patterns

### Hero Sections
```jsx
<div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
  <div className="max-w-7xl mx-auto px-8 py-24">
    <div className="text-center mb-16 animate-fade-in">
      <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight animate-slide-up">
        Main Heading
      </h1>
      <h2 className="text-4xl font-light text-gray-600 mb-8 tracking-wide animate-slide-up-delay">
        Subheading
      </h2>
      <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay-2">
        Description text
      </p>
    </div>
  </div>
</div>
```

### Filter Sections
```jsx
<div className="bg-white border-b border-gray-100">
  <div className="max-w-7xl mx-auto px-8 py-12">
    <div className="flex items-center justify-between mb-8 animate-fade-in">
      <h3 className="text-2xl font-light text-gray-900 tracking-wide">Section Title</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-delay">
      {/* Filter components */}
    </div>
  </div>
</div>
```

### Content Sections
```jsx
<div className="bg-gray-50">
  <div className="max-w-7xl mx-auto px-8 py-16">
    <div className="mb-12 animate-fade-in">
      <h3 className="text-3xl font-light text-gray-900 tracking-wide">
        Section Title
      </h3>
    </div>
    {/* Content grid */}
  </div>
</div>
```

## Component Patterns

### Cards
```jsx
<div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden hover:scale-[1.02]">
  <div className="h-48 bg-gray-100 overflow-hidden">
    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
  </div>
  <div className="p-6">
    <h2 className="text-xl font-light text-gray-900 mb-3 tracking-wide group-hover:text-gray-700 transition-colors">
      Title
    </h2>
    <p className="text-sm font-medium text-gray-500 mb-3 tracking-wider uppercase">
      Subtitle
    </p>
    <p className="text-gray-600 leading-relaxed line-clamp-3">
      Description
    </p>
  </div>
</div>
```

### Buttons
```jsx
// Primary Button
<button className="px-6 py-3 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105">
  Button Text
</button>

// Secondary Button
<button className="px-6 py-3 bg-gray-100 text-gray-700 font-light tracking-wide rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105">
  Button Text
</button>
```

### Form Elements
```jsx
<div>
  <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
    Label
  </label>
  <input
    className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
  />
</div>
```

## Animations

### Entrance Animations
- **Fade In**: `animate-fade-in` - General fade in
- **Slide Up**: `animate-slide-up` - Hero content
- **Card Entrance**: `animate-card-entrance` - Grid items
- **Filter Slide**: `animate-slide-up-filter` - Filter components

### Hover Effects
- **Scale**: `hover:scale-[1.02]` - Subtle card scaling
- **Image Scale**: `group-hover:scale-105` - Image zoom on hover
- **Shadow**: `hover:shadow-xl` - Enhanced shadow on hover

### Loading States
- **Pulse**: `animate-pulse` - Loading skeletons
- **Bounce Slow**: `animate-bounce-slow` - Empty state icons

## Spacing System

### Container Widths
- **Max Width**: `max-w-7xl` - Main content containers
- **Padding**: `px-8` - Horizontal padding
- **Section Padding**: `py-16` - Vertical section padding
- **Hero Padding**: `py-24` - Hero section padding

### Grid Gaps
- **Small**: `gap-3` - Button groups
- **Medium**: `gap-6` - Filter grids
- **Large**: `gap-8` - Content grids

## Responsive Design

### Breakpoints
- **Mobile**: `grid-cols-1` - Single column
- **Tablet**: `md:grid-cols-2` - Two columns
- **Desktop**: `lg:grid-cols-3` - Three columns
- **Large Desktop**: `xl:grid-cols-4` - Four columns

### Typography Scaling
```css
@media (max-width: 640px) {
  .text-6xl { font-size: 3rem; line-height: 1; }
  .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
  .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
}
```

## Loading States

### Skeleton Components
```jsx
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-white">
    {/* Hero Skeleton */}
    <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <div className="h-16 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
    {/* Content Skeleton */}
  </div>
);
```

## Empty States

### Empty State Pattern
```jsx
<div className="text-center py-24 animate-fade-in">
  <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">🎬</div>
  <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
    No items found
  </h3>
  <p className="text-lg font-light text-gray-500 max-w-md mx-auto leading-relaxed">
    Description of empty state
  </p>
</div>
```

## Best Practices

### Do's
- Use light font weights (300) for headings
- Apply consistent spacing with the spacing system
- Include loading states for all data fetching
- Use subtle animations for enhanced UX
- Maintain consistent color usage
- Implement responsive design patterns

### Don'ts
- Don't use heavy font weights (600+) for body text
- Don't skip loading states
- Don't use bright colors outside the status system
- Don't forget hover states for interactive elements
- Don't use inconsistent spacing

## Implementation Guidelines

### For New Pages
1. Start with the hero section pattern
2. Add filter sections if needed
3. Implement content sections with proper spacing
4. Include loading skeletons
5. Add empty states for no data scenarios

### For New Components
1. Follow the card pattern for content cards
2. Use consistent button styles
3. Implement proper hover states
4. Include loading states
5. Make components responsive

### For Animations
1. Use entrance animations for page loads
2. Apply hover effects for interactive elements
3. Include loading animations for data fetching
4. Keep animations subtle and purposeful

This design system ensures consistency across the platform while maintaining the sophisticated, modern aesthetic that reflects the premium nature of the film industry. 