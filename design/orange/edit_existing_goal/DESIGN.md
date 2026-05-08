# Design System Strategy: The Radiant Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Radiant Editorial."** We are moving away from the rigid, boxed-in layouts of traditional productivity apps and toward a high-end digital journal aesthetic. This system celebrates a "warmth-first" philosophy, blending the high-energy pulse of citrus tones with the soft, tactile comfort of premium cream paper.

To achieve a signature look, we lean into **intentional asymmetry and tonal depth**. Instead of centering everything, we use staggered white space and overlapping elements to create a sense of movement. The goal is a UI that feels "composed" rather than "built," using the `Round Eight` (0.5rem) corner radius to soften every interaction point while maintaining a sophisticated, modern edge.

---

## 2. Colors & Surface Architecture
Our palette is a sophisticated transition from deep, authoritative ochre to light, airy peach. 

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders for sectioning are strictly prohibited. We define boundaries exclusively through background shifts. For example, a `surface-container-low` (#fdf9ed) section should sit on a `background` (#fffbff) to create a soft, organic division.

### Surface Hierarchy & Nesting
We treat the UI as a series of physical layers. Use the surface tiers to create "nested" depth:
*   **Base Layer:** `background` (#fffbff)
*   **Content Sections:** `surface-container-low` (#fdf9ed)
*   **Active Cards/Modals:** `surface-container-lowest` (#ffffff)
*   **Elevated Elements:** `surface-container-high` (#f2eee1)

### Signature Textures & Gradients
To provide "visual soul," all primary CTAs and headers must use a **Radiant Gradient**: 
*   **Direction:** 135° Linear
*   **From:** `primary` (#b43a10) 
*   **To:** `primary-container` (#ff784e)
This gradient prevents the orange from feeling "flat" or "cheap," giving it a premium, backlit glow.

---

## 3. Typography: The Editorial Voice
We use **Plus Jakarta Sans** for its geometric clarity and contemporary warmth. The hierarchy is designed to feel like a high-end magazine.

*   **Display (lg/md/sm):** Used for large motivational quotes or "Hero" goal titles. Use `on-surface` (#393831) with a tight `-0.02em` letter spacing for a custom, bespoke feel.
*   **Headline & Title:** Use `primary` (#b43a10) for titles to inject energy into the information hierarchy. 
*   **Body (lg/md):** Keep these clean in `on-surface-variant` (#66645c) to ensure the interface feels breathable and easy to digest.
*   **Label (md/sm):** Uppercase with `0.05em` letter spacing for a sophisticated, "tagged" look.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are replaced by **Tonal Layering** and **Ambient Glows**.

*   **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#fdf9ed) background. The subtle 2% difference in brightness creates enough "lift" to be felt, but not enough to clutter the eye.
*   **Ambient Shadows:** For floating elements (like the Add New Goal Modal), use a diffused shadow: 
    *   `blur: 24px`, `opacity: 6%`, `color: #915441` (secondary tint).
*   **Glassmorphism:** For top navigation bars or floating action buttons, use `surface-bright` (#fffbff) at 80% opacity with a `backdrop-filter: blur(12px)`. This allows the warm peach tones to bleed through the UI, creating an integrated, high-end feel.

---

## 5. Component Signature Styles

### Buttons
*   **Primary:** Features the Radiant Gradient (`primary` to `primary-container`). Use `on-primary` (#ffffff) text.
*   **Secondary:** No background. Use `surface-container-highest` (#ece8da) with `on-secondary-container` (#6f3827) text.
*   **Rounding:** Always `DEFAULT` (0.5rem) as per the Round Eight rule.

### Input Fields
*   **Text Inputs:** Use `surface-container-low` (#fdf9ed) as the fill. Replace the bottom border with a 2px `outline-variant` (#bcb9af) that transitions to `primary` (#b43a10) only on focus.
*   **Helper Text:** Always use `label-md` in `on-tertiary-fixed-variant` (#6e5834).

### Cards & Goal Lists
*   **Forbidden:** Horizontal divider lines.
*   **Alternative:** Use `spacing-6` (1.5rem) of vertical white space or a slight background shift to `surface-container` (#f7f4e7) for every second list item (zebra striping, but sophisticated).

### Progress Elements (Signature Component)
For goal tracking, use thick, rounded progress bars using `tertiary-container` (#fddeb0) as the track and the `primary-container` (#ff784e) as the fill to maintain the warm, energetic theme.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins. If the left margin is `spacing-8`, try a right margin of `spacing-12` for editorial flair.
*   **Do** use the `primary-fixed-dim` (#f3683b) for icons to keep them vibrant but legible.
*   **Do** lean into "Cream over White." Use `surface-container-low` more often than absolute white to keep the "soft" feel.

### Don’t:
*   **Don’t** use black text. Always use `on-surface` (#393831) for a softer, premium contrast.
*   **Don’t** use standard 1px borders. If a container needs a edge, use the "Ghost Border" (outline-variant at 15% opacity).
*   **Don’t** crowd the layout. If in doubt, increase the spacing by one tier on the scale (e.g., move from `4` to `5`).