# DESIGN BRIEF — OutingList Design Revolution
_Created: 2026-03-11 after Erik's feedback_

## The Problem
Current design is generic Tailwind bootstrap. Rounded bordered cards, emoji icons, gradient placeholders, category pills. Looks like every other template site. Zero personality.

## Reference Sites

### Gumroad (gumroad.com)
- High contrast: black text on light bg, bold pink accent
- Custom 3D floating coin illustrations — NOT stock, NOT emoji
- Large, confident serif/display typography ("Go from 0 to $1" is huge)
- Asymmetric layouts — not everything in a grid
- Thick black borders on key elements, not thin gray borders
- Playful but opinionated — the site has ATTITUDE
- Navigation is minimal and confident

### Wispr Flow (wisprflow.ai)
- Dark sections with warm, cinematic lighting
- Editorial typography — mixed weights, italic for emphasis
- Real product photography, not placeholders
- Generous whitespace
- Animated reveals on scroll
- Premium feel — like a magazine layout
- Color used sparingly but intentionally

## Design Principles for OutingList

### 1. NO emoji icons for categories
- Use SVG illustrations or simple geometric shapes
- Each category gets a custom icon built from basic SVG paths
- Think: simple, bold, one-color line drawings

### 2. NO outlined/bordered cards
- Cards should feel like content, not containers
- Options: full-bleed images, overlapping text, editorial layouts
- Event cards should look more like magazine clippings or posters than database rows

### 3. Typography IS the design
- Use a distinctive display font (not Inter for headlines)
- Mix weights dramatically: thin body + extra bold headings
- Large type. Confident type. Type that says something.
- Consider: Playfair Display, Clash Display, Cabinet Grotesk, or Satoshi

### 4. Real visual content
- Use Unsplash API or direct URLs for real event imagery
- Category headers with real Atlanta photography
- If no image: use bold typographic treatments, not gradient blobs

### 5. Layout breaks the grid
- Not everything needs to be in a 4-column card grid
- Hero events get full-width treatment
- Mix card sizes: feature one large, others small
- Asymmetric, editorial layouts

### 6. Color with intention
- Primary palette should be bold but not overwhelming
- Dark mode sections mixed with light (like Wispr)
- Color accent used to highlight, not decorate
- Consider a warm, earthy Atlanta palette: deep greens, warm terracotta, cream, charcoal

### 7. Personality in copy
- Section headers should have voice: "This weekend in Atlanta" not "Upcoming Events"
- Empty states should be charming
- Error states should be human

## Specific Changes Required

### Homepage
- Kill the emoji category grid
- Replace with editorial hero: featured event with real image, full-width
- "This weekend" section with mixed-size event cards
- Curator spotlight or "Lists we love" section
- Bold typographic treatment for the tagline

### Browse Page
- Ditch the 4-column identical card grid
- Mixed layout: 1 large featured + smaller cards
- Category filter as minimal text links or bold type, not pill buttons
- Event cards: image-forward, text overlaid or adjacent, no container border
- Search bar should be prominent and designed, not a generic input

### Event Cards
- Image-dominant (or bold typographic if no image)
- Category shown as small colored dot + text, not emoji pill
- Date formatted as "SAT MAR 14" not full datetime
- Location as simple text, not with pin emoji
- No rounded-corner bordered container
- Hover: subtle scale or reveal, not color change

### Navigation
- Simpler. Logo + 2-3 links + CTA
- No "OL" circle logo — wordmark only, or a distinctive mark
- Consider dark nav or transparent over hero

## Image Strategy
For MVP without real event images, use:
1. Unsplash source URLs: https://source.unsplash.com/featured/?{category} (deprecated but alternatives exist)
2. Picsum: https://picsum.photos/seed/{event-id}/600/400
3. For known Atlanta venues: actual venue photos from their websites
4. Bold solid-color backgrounds with large typography as fallback (poster style)

## Technical Notes
- Custom SVG icons: create a simple icon set (~15 icons) as React components
- Font: load from Google Fonts or self-host
- CSS: leverage Tailwind but with heavy custom properties, not utility-class soup
- Animations: subtle CSS transitions, no heavy JS animation libraries
- Dark sections: use CSS variables to swap palettes per section
