---
name: Internal Precision Interface
colors:
  surface: '#f9f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f5'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e4'
  on-surface: '#1a1c1d'
  on-surface-variant: '#414755'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f0f2'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005bc1'
  primary: '#0058bc'
  on-primary: '#ffffff'
  primary-container: '#0070eb'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#5d5e63'
  on-secondary: '#ffffff'
  secondary-container: '#e0dfe4'
  on-secondary-container: '#626267'
  tertiary: '#9e3d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c64f00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#e3e2e7'
  secondary-fixed-dim: '#c6c6cb'
  on-secondary-fixed: '#1a1b1f'
  on-secondary-fixed-variant: '#46464b'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb595'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7c2e00'
  background: '#f9f9fb'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e4'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is rooted in **Minimalism** and **Modern Corporate** aesthetics, heavily inspired by the Apple Human Interface Guidelines. It prioritizes clarity, intentionality, and a premium feel for an internal productivity context.

The goal is to evoke a sense of calm efficiency. By utilizing generous whitespace and a restricted color palette, the UI recedes into the background, allowing the user's tasks and data to take center stage. The style leverages subtle layering and high-quality typography to communicate hierarchy rather than decorative elements. Every interaction should feel deliberate, crisp, and functional.

## Colors

This design system utilizes a high-fidelity palette designed for long-term legibility and focus.

- **Primary:** A crisp, vibrant blue (#007AFF) used exclusively for primary actions, active states, and essential indicators.
- **Neutrals (Light):** A range of cool grays starting from pure white (#FFFFFF) for surfaces, to a soft off-white (#F5F5F7) for backgrounds, and deeper grays for secondary text and borders.
- **Neutrals (Dark):** Pure black (#000000) for the base background, with elevated surfaces using dark charcoal grays (#1C1C1E) to maintain contrast.
- **Accents:** Success (Green), Warning (Orange), and Destructive (Red) states follow the Apple system standard to ensure immediate recognition without breaking the minimalist aesthetic.

## Typography

The typography system uses **Inter** for its systematic, utilitarian, and neutral qualities, closely mimicking the San Francisco typeface. 

Hierarchy is established through weight and color (Primary vs. Secondary text) rather than drastic size changes. Headings use tight letter spacing for a modern, compact look, while body text maintains standard spacing for maximum readability in a data-heavy ticketing environment. Labels use a slightly heavier weight and uppercase styling for structural clarity in forms and metadata blocks.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop views to maintain focus, transitioning to a fluid model for smaller viewports. 

A strict 4px baseline grid ensures vertical rhythm. Global margins are set to 24px or 32px to provide breathing room, preventing the tool from feeling cluttered despite high information density. Content containers should be centered with a maximum width of 1280px to ensure optimal line lengths for reading ticket descriptions and internal logs.

## Elevation & Depth

Depth in this design system is created through **Tonal Layers** and **Low-Contrast Outlines**. 

In Light Mode, elevation is communicated via subtle 1px borders (#E5E5E7) and very soft, diffused ambient shadows (0px 4px 12px rgba(0,0,0,0.05)). In Dark Mode, elevation is achieved by lightening the surface color (e.g., a ticket card is a lighter gray than the background) rather than using heavy shadows. 

A "Glassmorphism" effect is applied sparingly to navigation bars and floating modals using a backdrop blur (20px) and 70% opacity, providing a sense of context and depth without distracting from the main content.

## Shapes

The shape language is **Rounded**, reflecting a premium and approachable feel. 

- Standard components (Buttons, Inputs, Cards) use a **0.5rem (8px)** corner radius.
- Larger containers or prominent sections use a **1rem (16px)** radius.
- System-wide icons and status badges should follow the same rounded logic to maintain visual harmony. 
This moderately rounded approach provides a "squircle-like" aesthetic that feels modern and consistent with high-end OS interfaces.

## Components

### Buttons
Primary buttons use the crisp blue background with white text. Secondary buttons use a light gray ghost style or a subtle border. All buttons feature a 0.5rem radius and a slight scale-down effect (0.98) on click to feel tactile.

### Input Fields
Inputs are minimalist: a subtle 1px border that turns primary blue on focus. Backgrounds should be slightly offset from the page background to define the hit area. Use inline labels or floating labels for a compact footprint.

### Cards
Cards are the primary vehicle for tickets. They should have no shadow by default, utilizing a 1px border. On hover, a soft ambient shadow is applied to suggest interactivity.

### Chips & Badges
Used for status (e.g., "Open", "In Progress"). These should be pill-shaped with low-saturation background tints and high-saturation text to ensure they are legible but not "loud."

### Additional Components
- **Data Tables:** High density with subtle row separators and no vertical lines.
- **Activity Feed:** A vertical timeline using soft gray lines and small circular avatars/icons to track ticket history.
- **Command Palette:** A floating, blurred modal (CMD+K) for quick navigation and ticket searching.