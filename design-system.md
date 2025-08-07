# Suprimo Coffee Design System

## Brand Philosophy
Suprimo embodies the intersection of craft and soul in coffee culture. Our design language reflects artisanal quality, warmth, and the ritualistic nature of coffee consumption. Every design decision should evoke the sensory richness and deliberate craftsmanship of specialty coffee.

## 1. Color Palette

### Primary Colors
```css
/* Dark Grounds - Primary backgrounds */
--color-espresso: #1A1614;      /* Darkest - primary background */
--color-dark-roast: #1F1A17;    /* Section backgrounds */
--color-medium-roast: #221D1A;  /* Gradient ends */
--color-coffee-bean: #2A2420;   /* Alternate sections */
--color-mocha: #2A1F1A;         /* Accent backgrounds */

/* Warm Accents - Brand colors */
--color-golden-crema: #D4A574;  /* Primary accent, CTAs, headlines */
--color-cinnamon: #8B5A2B;      /* Button gradients start */
--color-nutmeg: #A0522D;        /* Button gradients end */

/* Light Tones - Text and UI */
--color-oat-milk: #E8DFD3;      /* Primary text on dark */
--color-steamed-milk: #FFF8F0;  /* Button text, high contrast */
--color-foam: #B8A898;          /* Secondary text */
--color-latte: #A89888;         /* Tertiary text */
--color-cappuccino: #8A7868;    /* Muted text, captions */
```

### Atmospheric Effects
```css
/* Overlays and Gradients */
--gradient-hero: linear-gradient(to bottom, #1A1614 0%, #221D1A 100%);
--gradient-section: linear-gradient(to bottom, #2A2420 0%, #1A1614 100%);
--gradient-button: linear-gradient(135deg, #8B5A2B 0%, #A0522D 100%);
--gradient-button-hover: linear-gradient(135deg, #A0522D 0%, #8B5A2B 100%);

/* Shadows and Glows */
--shadow-subtle: 0 4px 15px rgba(139, 90, 43, 0.3);
--shadow-lifted: 0 6px 20px rgba(139, 90, 43, 0.4);
--shadow-deep: 0 20px 40px rgba(0, 0, 0, 0.3);
--shadow-inset: inset 0 10px 30px rgba(0, 0, 0, 0.5);
```

## 2. Typography

### Type Scale
```css
/* Font Families */
--font-serif: 'Georgia', serif;           /* Primary - headlines, body */
--font-sans: -apple-system, sans-serif;   /* Secondary - UI elements */

/* Font Sizes - Desktop */
--text-hero: clamp(2.5rem, 5vw, 4rem);   /* Hero headlines */
--text-display: 3rem;                     /* Section titles */
--text-headline: 2.5rem;                  /* Sub-headers */
--text-subhead: 1.75rem;                  /* Quotes, emphasis */
--text-body-large: 1.25rem;               /* Lead paragraphs */
--text-body: 1.125rem;                    /* Standard body */
--text-small: 0.95rem;                    /* Supporting text */
--text-caption: 0.875rem;                 /* Captions, notes */

/* Font Weights */
--weight-light: 300;
--weight-regular: 400;
--weight-medium: 500;

/* Letter Spacing */
--spacing-tight: -0.02em;    /* Headlines */
--spacing-normal: 0;         /* Body text */
--spacing-wide: 0.08em;      /* Buttons */
--spacing-wider: 0.15em;     /* Logo */

/* Line Heights */
--leading-tight: 1.2;        /* Headlines */
--leading-normal: 1.6;       /* Body text */
--leading-relaxed: 1.8;      /* Long-form content */
```

### Typography Patterns
```css
/* Hero Title */
.type-hero {
    font-family: var(--font-serif);
    font-size: var(--text-hero);
    font-weight: var(--weight-regular);
    letter-spacing: var(--spacing-tight);
    line-height: var(--leading-tight);
    color: var(--color-oat-milk);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

/* Accent Text */
.type-accent {
    color: var(--color-golden-crema);
    font-style: italic;
    font-weight: var(--weight-light);
}

/* Section Headline */
.type-section {
    font-family: var(--font-serif);
    font-size: var(--text-headline);
    font-weight: var(--weight-light);
    color: var(--color-oat-milk);
}

/* Body Text */
.type-body {
    font-family: var(--font-serif);
    font-size: var(--text-body);
    line-height: var(--leading-normal);
    color: var(--color-foam);
}
```

## 3. Spacing System

### Base Unit
```css
--space-unit: 0.5rem;  /* 8px base */

/* Spacing Scale */
--space-xs: calc(var(--space-unit) * 1);    /* 8px */
--space-sm: calc(var(--space-unit) * 2);    /* 16px */
--space-md: calc(var(--space-unit) * 3);    /* 24px */
--space-lg: calc(var(--space-unit) * 4);    /* 32px */
--space-xl: calc(var(--space-unit) * 6);    /* 48px */
--space-2xl: calc(var(--space-unit) * 8);   /* 64px */
--space-3xl: calc(var(--space-unit) * 12);  /* 96px */

/* Section Padding */
--section-padding: 6rem 0;
--section-padding-large: 8rem 0;
--container-padding: 0 40px;
```

## 4. Layout System

### Container
```css
.container {
    position: relative;
    z-index: 3;
    max-width: 1000px;
    margin: 0 auto;
    padding: var(--container-padding);
}

/* Grid Systems */
.grid-halves {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.grid-thirds {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
}
```

## 5. Components

### Buttons
```css
/* Primary CTA */
.button-primary {
    display: inline-block;
    padding: 1rem 2.5rem;
    background: var(--gradient-button);
    color: var(--color-steamed-milk);
    text-decoration: none;
    font-size: var(--text-small);
    letter-spacing: var(--spacing-wide);
    transition: all 0.4s ease;
    box-shadow: var(--shadow-subtle);
    text-transform: uppercase;
    font-family: var(--font-sans);
    font-weight: var(--weight-medium);
}

.button-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lifted);
    background: var(--gradient-button-hover);
}
```

### Cards
```css
.card-ritual {
    text-align: center;
}

.card-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    background: radial-gradient(circle at 30% 30%, #3A2F2A 0%, #2A1F1A 70%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: var(--color-golden-crema);
    box-shadow: var(--shadow-deep);
}
```

### Visual Elements
```css
/* Coffee Cup Illustration */
.visual-coffee-cup {
    width: 250px;
    height: 250px;
    position: relative;
    background: radial-gradient(ellipse at center, #3A2F2A 0%, #2A1F1A 70%);
    border-radius: 50%;
    box-shadow: 
        inset 0 10px 30px rgba(0,0,0,0.5),
        0 20px 40px rgba(0,0,0,0.3);
}

/* Quote Decoration */
.quote-mark {
    font-size: 8rem;
    color: #3A3430;
    font-family: Georgia, serif;
    line-height: 1;
    opacity: 0.5;
}
```

## 6. Animation Guidelines

### Timing Functions
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--duration-fast: 0.2s;
--duration-normal: 0.4s;
--duration-slow: 3s;
```

### Animation Patterns
```css
/* Hover Lift */
@keyframes hover-lift {
    to { transform: translateY(-2px); }
}

/* Steam Effect */
@keyframes steam-rise {
    0% { 
        transform: translateY(0) scale(1); 
        opacity: 0; 
    }
    50% { 
        opacity: 0.5; 
    }
    100% { 
        transform: translateY(-20px) scale(1.5); 
        opacity: 0; 
    }
}

/* Fade In */
@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}
```

## 7. Texture & Atmosphere

### Background Textures
```css
/* Grain Overlay */
.texture-grain {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.03;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><filter id="grain"><feTurbulence baseFrequency="0.9" numOctaves="4" /></filter></defs><rect width="200" height="200" filter="url(%23grain)" opacity="0.3"/></svg>');
    pointer-events: none;
    z-index: 2;
}

/* Radial Warmth */
.texture-warmth {
    background: 
        radial-gradient(circle at 20% 50%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(139, 69, 19, 0.05) 0%, transparent 50%);
}
```

## 8. Responsive Breakpoints

```css
--breakpoint-mobile: 480px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-wide: 1200px;

/* Mobile-First Media Queries */
@media (min-width: 768px) { /* Tablet and up */ }
@media (min-width: 1024px) { /* Desktop and up */ }
```

## 9. Accessibility Guidelines

### Color Contrast
- Text on dark backgrounds must meet WCAG AA standards
- Primary text (#E8DFD3) on dark (#1A1614): 11.5:1 ✓
- Accent text (#D4A574) on dark (#1A1614): 7.8:1 ✓

### Focus States
```css
:focus-visible {
    outline: 2px solid var(--color-golden-crema);
    outline-offset: 4px;
}
```

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

## 10. Implementation Notes

### CSS Architecture
- Use CSS custom properties for all design tokens
- Follow BEM naming convention for components
- Implement utility classes for common patterns
- Maintain separate files for base, components, and utilities

### Performance Considerations
- Optimize font loading with font-display: swap
- Use CSS containment for complex components
- Implement critical CSS for above-fold content
- Lazy load decorative animations

### Brand Voice in Code
- Comments should reflect craftsmanship mindset
- Variable names should evoke coffee culture
- Maintain consistency with artisanal terminology