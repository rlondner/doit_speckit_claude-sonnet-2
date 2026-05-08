# Design System Strategy: The Radiant Catalyst

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Radiant Catalyst."** 

Unlike traditional productivity tools that feel like rigid spreadsheets, this system is designed to feel like a high-end wellness editorial. It moves away from the "industrial" look of standard SaaS by embracing **Organic Sophistication**. We achieve this through intentional asymmetry, overlapping surfaces, and a "breathing" layout that prioritizes mental clarity and emotional motivation. The goal is to make "doing" feel as light and effortless as the interface itself.

## 2. Color Theory & Tonal Depth
We move beyond flat pastels by utilizing a Material-based hierarchy that emphasizes "Light and Air."

### The "No-Line" Rule
**Standard 1px borders are strictly prohibited.** To define sections, use background color shifts. For example, a `surface_container_low` sidebar should sit against a `background` main stage. Boundaries are felt through tone, not drawn with lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, fine-milled paper sheets.
*   **Base:** `background` (#f3f7fb)
*   **Secondary Content Areas:** `surface_container_low` (#ecf1f6)
*   **Primary Interactive Cards:** `surface_container_lowest` (#ffffff)
*   **Active Overlays:** `surface_bright` (#f3f7fb)

### The Glass & Gradient Rule
To instill "soul" into the goal-tracking experience, use **Subtle Radiant Gradients**. 
*   **Hero CTAs:** Transition from `primary` (#00684f) to `primary_container` (#89f0cb) at a 135° angle.
*   **Progress Indicators:** Use a soft "Sky Blue" (Secondary) to "Mint" (Primary) gradient to represent momentum.
*   **Glassmorphism:** For floating modals or navigation bars, use `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur.

## 3. Typography: Editorial Clarity
We pair the geometric precision of **Plus Jakarta Sans** for high-impact displays with the functional readability of **Inter** for data-heavy tracking.

*   **Display (Plus Jakarta Sans):** Used for motivational headers and daily tallies. Use `display-lg` (3.5rem) with `-0.04em` letter spacing to create a high-fashion, "tight" editorial feel.
*   **Headlines (Plus Jakarta Sans):** Use `headline-md` (1.75rem) for section titles. Do not capitalize every word; use sentence case to maintain a friendly, approachable tone.
*   **Body & Labels (Inter):** All functional text uses Inter. Use `body-md` (0.875rem) for goal descriptions. Set line-height to `1.6` to ensure the "breathing room" mentioned in the North Star.
*   **Hierarchy Note:** Use `on_surface_variant` (#575c60) for secondary metadata to create a sophisticated grey-scale contrast against the vibrant pastel accents.

## 4. Elevation & Depth: Tonal Layering
We reject heavy drop shadows in favor of **Ambient Luminosity**.

*   **The Layering Principle:** Avoid shadows on static elements. Instead, place a `surface_container_lowest` card on top of a `surface_container` background. The difference in hex value provides all the "lift" required.
*   **Ambient Shadows:** For floating elements (FABs, active modals), use a "tinted" shadow:
    *   `box-shadow: 0 12px 32px -4px rgba(0, 104, 79, 0.08);` (Using a tint of the `primary` color instead of black).
*   **The Ghost Border:** If accessibility requires a container edge (e.g., in high-contrast modes), use `outline_variant` (#a9aeb1) at **15% opacity**. It should be a whisper, not a shout.

## 5. Component Signature Styles

### Buttons (The "Pill" Standard)
*   **Primary:** Pill-shaped (`9999px` radius). Background is the Primary-to-Primary-Container gradient. No border. Text is `on_primary`.
*   **Secondary:** `surface_container_highest` background with `on_surface` text. This creates a soft, tactile button that doesn't compete with the main action.
*   **Tertiary:** Ghost style. No background. Use `label-md` bold typography with a subtle underline appearing only on hover.

### Goal Tracking Cards
*   **Layout:** Forbid dividers. Separate the goal title from the progress bar using `spacing-4` (1.4rem) of vertical white space.
*   **Visuals:** Use a `xl` (1.5rem) corner radius. The progress track should use `secondary_container` (#e1e1f5) with the active bar using the mint-to-blue gradient.

### Input Fields
*   **State:** Default state uses `surface_container_low` with no border. 
*   **Focus:** Transition to `surface_container_lowest` and add a `2px` "Ghost Border" of the `primary` color at 30% opacity.

### Motivational Chips
*   **Action Chips:** Use `tertiary_container` (Peach #fed9b8) with `on_tertiary_fixed` text for high-energy rewards or "Urgent" tags.

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical margins (e.g., more padding on the left than the right in hero sections) to create a custom, "designed" feel.
*   **Do** use the `24` (8.5rem) spacing token for major section breaks to ensure the UI never feels cluttered.
*   **Do** use the `full` (9999px) roundedness for all interactive elements to maintain the "fun/soft" brand personality.

### Don't
*   **Don't** use 100% black (#000000) for text. Always use `on_surface` (#2a2f32) to keep the contrast soft and premium.
*   **Don't** use "Drop Shadows" on cards that are already resting on a contrasting surface. It creates "visual mud."
*   **Don't** use standard 12-column grids for everything. Break the grid by allowing images or progress clusters to bleed off the edge or overlap container boundaries.