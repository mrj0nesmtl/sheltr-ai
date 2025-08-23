# 🎨 SHELTR-AI Design System

Comprehensive design system and UI guidelines for the SHELTR-AI platform.

## 🎯 Design Principles

### 1. Accessibility First
- WCAG 2.1 AA compliance
- High contrast ratios
- Keyboard navigation support
- Screen reader compatibility

### 2. Compassionate Design
- Warm, welcoming color palette
- Clear, empathetic messaging
- Stress-free user interactions
- Dignity-preserving interfaces

### 3. Mobile-First Responsive
- Progressive enhancement
- Touch-friendly interactions
- Optimized for various screen sizes
- Offline-capable when possible

## 🎨 Color Palette

### Primary Colors
```css
:root {
  /* SHELTR Brand Colors */
  --sheltr-primary: #2563eb;      /* Blue 600 */
  --sheltr-primary-dark: #1d4ed8; /* Blue 700 */
  --sheltr-primary-light: #3b82f6; /* Blue 500 */
  
  /* Secondary Colors */
  --sheltr-secondary: #7c3aed;    /* Violet 600 */
  --sheltr-accent: #059669;       /* Emerald 600 */
  --sheltr-warning: #d97706;      /* Amber 600 */
  --sheltr-error: #dc2626;        /* Red 600 */
  --sheltr-success: #16a34a;      /* Green 600 */
}
```

### Semantic Colors
```css
:root {
  /* Background Colors */
  --background: #ffffff;
  --background-secondary: #f8fafc;
  --background-muted: #f1f5f9;
  
  /* Text Colors */
  --foreground: #0f172a;
  --foreground-secondary: #475569;
  --foreground-muted: #64748b;
  
  /* Border Colors */
  --border: #e2e8f0;
  --border-muted: #f1f5f9;
}
```

### Dark Mode Support
```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0f172a;
    --background-secondary: #1e293b;
    --background-muted: #334155;
    
    --foreground: #f8fafc;
    --foreground-secondary: #cbd5e1;
    --foreground-muted: #94a3b8;
    
    --border: #334155;
    --border-muted: #1e293b;
  }
}
```

## 📝 Typography

### Font Stack
```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}
```

### Type Scale
```css
:root {
  /* Headings */
  --text-4xl: 2.25rem;   /* 36px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-xl: 1.25rem;    /* 20px */
  --text-lg: 1.125rem;   /* 18px */
  
  /* Body Text */
  --text-base: 1rem;     /* 16px */
  --text-sm: 0.875rem;   /* 14px */
  --text-xs: 0.75rem;    /* 12px */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

## 🧩 Component Library

### Button Variants
```tsx
// Primary Button
<Button variant="default" size="default">
  Primary Action
</Button>

// Secondary Button
<Button variant="outline" size="default">
  Secondary Action
</Button>

// Destructive Button
<Button variant="destructive" size="default">
  Delete Action
</Button>

// Ghost Button
<Button variant="ghost" size="sm">
  Subtle Action
</Button>
```

### Card Components
```tsx
// Basic Card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>

// Interactive Card
<Card className="hover:shadow-lg transition-shadow cursor-pointer">
  <CardContent className="p-6">
    Interactive content
  </CardContent>
</Card>
```

### Form Components
```tsx
// Input Field
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="Enter your email"
    required
  />
</div>

// Select Field
<div className="space-y-2">
  <Label htmlFor="role">User Role</Label>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select a role" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="participant">Participant</SelectItem>
      <SelectItem value="donor">Donor</SelectItem>
      <SelectItem value="shelter_admin">Shelter Admin</SelectItem>
    </SelectContent>
  </Select>
</div>
```

## 📐 Spacing & Layout

### Spacing Scale
```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### Grid System
```css
/* Container Widths */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive Grid */
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }

@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}
```

## 🎭 Animation & Transitions

### Standard Transitions
```css
:root {
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}

/* Common Transitions */
.transition-colors {
  transition: color var(--transition-fast), 
              background-color var(--transition-fast),
              border-color var(--transition-fast);
}

.transition-shadow {
  transition: box-shadow var(--transition-normal);
}

.transition-transform {
  transition: transform var(--transition-normal);
}
```

### Hover States
```css
/* Button Hover */
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Card Hover */
.card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
```

## 📱 Responsive Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

## ♿ Accessibility Guidelines

### Focus Management
```css
/* Focus Styles */
.focus-visible:focus-visible {
  outline: 2px solid var(--sheltr-primary);
  outline-offset: 2px;
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--sheltr-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  transition: top var(--transition-fast);
}

.skip-link:focus {
  top: 6px;
}
```

### ARIA Labels
```tsx
// Button with ARIA label
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// Form with ARIA descriptions
<Input 
  aria-describedby="email-help"
  aria-invalid={hasError}
/>
<div id="email-help" className="text-sm text-muted-foreground">
  We'll never share your email address
</div>
```

## 🔗 Related Documentation

- [Component Library](../07-reference/component-library.md)
- [Theme System](../07-reference/theme-system.md)
- [Development Guide](../04-development/README.md)
