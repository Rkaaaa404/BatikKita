---
name: Modern Heritage
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#53433c'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#86736b'
  outline-variant: '#d8c2b8'
  surface-tint: '#8e4d2b'
  primary: '#5d2808'
  on-primary: '#ffffff'
  primary-container: '#7a3e1d'
  on-primary-container: '#ffad84'
  inverse-primary: '#ffb692'
  secondary: '#4059aa'
  on-secondary: '#ffffff'
  secondary-container: '#8fa7fe'
  on-secondary-container: '#1d3989'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca730'
  on-tertiary-container: '#4f3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcb'
  primary-fixed-dim: '#ffb692'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#713716'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#00164e'
  on-secondary-fixed-variant: '#264191'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
  royal-sogan: '#7A3E1D'
  indigofera-blue: '#1E3A8A'
  heritage-gold: '#D4AF37'
  mori-cream: '#FDFBF7'
  success-green: '#10B981'
  warning-amber: '#F59E0B'
  danger-red: '#EF4444'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  narrative-body:
    fontFamily: Source Serif 4
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max-width: 1280px
---

## Brand & Style

This design system embodies the "Modern Heritage" philosophy—a sophisticated fusion of ancient Indonesian craftsmanship and cutting-edge digital interaction. The brand personality is **Enlightened, Cultured, and Playful**, designed to bridge the gap between Gen Z's digital-first habits and the profound depth of traditional Batik.

The visual style is **Contemporary Corporate with Tactile Accents**. It leverages the clean, high-impact layouts of modern fashion editorials (heavy whitespace, bold typography, and glassmorphism) but grounds them in the organic textures of "Mori" fabric. The UI evokes the feeling of a premium digital collector's album, where every interaction feels like uncovering a hidden piece of history.

**Emotional Response:**
- **Prestige:** Users feel like they are engaging with high art, not just a mobile app.
- **Curiosity:** Gamified elements and AI tools spark a desire to explore deeper cultural layers.
- **Warmth:** The cream-based palette and soft rounded corners provide an approachable, human-centric experience.

## Colors

The palette is derived from natural Batik dyes and traditional materials.

- **Royal Sogan Brown (#7A3E1D):** The primary brand color, representing the earth and the classic palace Batik of Solo and Yogyakarta. Use for primary actions, headers, and brand-heavy components.
- **Indigofera Blue (#1E3A8A):** Representing coastal (Pesisiran) Batik styles. Use for secondary interactive elements, links, and categorical tags.
- **Heritage Gold (#D4AF37):** A high-prestige accent color reserved for achievements, XP badges, holographic card effects, and "Aha!" moments in the gamified experience.
- **Mori Fabric Cream (#FDFBF7):** The canvas of the application. This off-white, textured background prevents the UI from feeling "clinical" or overly digital, mimicking the raw cotton cloth used in Batik making.
- **Functional Colors:** Standard semantic colors (Success, Warning, Danger) are tuned to maintain harmony with the earthy primary tones.

## Typography

The typographic strategy uses a dual-personality approach to bridge the modern and the traditional:

1.  **UI & Functional (Plus Jakarta Sans):** A modern, geometric sans-serif used for headings, navigation, and labels. It ensures the platform feels professional and technologically advanced.
2.  **Narrative & Culture (Source Serif 4):** A classic serif used exclusively for cultural storytelling, philosophy descriptions, and dialogue from "Sang Empu" (The Master). This font adds an authoritative, literary, and timeless quality to educational content.
3.  **General Body (Inter):** Used for functional interface text where maximum legibility at small sizes is required (e.g., tooltips, input text, and metadata).

**Scaling:** Large displays use high-contrast sizes for impact, while mobile views condense the scale to ensure the "Mori" background remains visible as a framing element.

## Layout & Spacing

The layout follows a **Fluid Grid** system with generous margins to evoke the "whitespace" found in luxury fashion layouts.

- **Base Rhythm:** All spacing is based on a 4px/8px incremental system.
- **Grid:** A 12-column grid is used for desktop, 6-column for tablet, and 2-column for mobile.
- **Margins:** High-impact "Editorial" margins (64px+) are used on landing pages to center the content like a piece of art. Functional dashboards use standard 24px margins.
- **Adaptive Reflow:** Components like the "Batikpedia" grid should reflow from 4 cards per row on desktop to a single, high-detail card view on mobile to maintain the intricate details of the Batik motifs.

## Elevation & Depth

This design system avoids heavy, muddy shadows in favor of **Tonal Layering and Glassmorphism**.

- **Surface Tiers:** The "Mori Fabric Cream" background serves as the base. Cards and containers use a slightly lighter, pure white surface or a semi-transparent glass effect to create elevation without clutter.
- **Glassmorphism:** Navigation bars and floating game controllers (like the puzzle tray) should use a backdrop blur (12px–20px) with a low-opacity white tint. This keeps the Batik patterns visible as they scroll underneath.
- **The Golden Shimmer:** Achievement cards and "unlocked" states use a holographic depth effect—a subtle, moving linear gradient using Heritage Gold and Indigofera Blue—to signify value and rarity.
- **Outlines:** Use soft, low-contrast borders (1px solid Royal Sogan at 10% opacity) instead of shadows for standard UI elements to maintain a clean, "sketched" aesthetic.

## Shapes

The shape language is **Soft and Friendly**.

- **Base Radius:** 0.5rem (8px) for small components like buttons and inputs.
- **Container Radius:** `rounded-xl` (1.5rem / 24px) is the signature radius for cards, modals, and major layout sections. This creates a soft, modern silhouette that contrasts beautifully with the sharp geometric patterns of Batik motifs inside.
- **Batik Borders:** Use subtle SVG-based Batik motif patterns (Kawung or Parang) as 1px-height borders for sections or as low-opacity watermarks in the corners of large containers.

## Components

- **Buttons:** Primary buttons use a solid Royal Sogan background with Heritage Gold text or icons. High-radius corners (rounded-xl) are required. Use a "blooming" micro-interaction (slight scale up and gold particle effect) on hover or press.
- **Cards (Batikpedia):** Use the signature `rounded-xl` radius. Unlocked cards feature a high-resolution motif image with a subtle Heritage Gold "holographic" border. Locked cards are represented as dark silhouettes with a "Mystery" label in Source Serif 4.
- **Chips & Tags:** Use Indigofera Blue for regional tags (e.g., "Pekalongan") and Royal Sogan for stylistic tags (e.g., "Keraton"). Use low-saturation backgrounds with high-contrast text.
- **Input Fields:** Minimalist design with a bottom-border only or a very light Mori-tinted background. Focus states should highlight the border in Heritage Gold.
- **Chat Interface (Tanya Sang Empu):** Chat bubbles should use asymmetric rounding (e.g., more rounded on the outer corners). The AI's bubbles use a light Sogan tint, while the user's bubbles are neutral Mori Cream.
- **Interactive Map Pins:** Pulse animations using Heritage Gold to draw attention to regional hotspots.
- **Progress Bars:** Use a dual-tone fill—Royal Sogan for the base progress and Heritage Gold for the "XP" gain animation.