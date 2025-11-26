# Crop Disease & Pest Scout - Design Guidelines

## Design Approach

**System Selected**: Material Design principles with agricultural/health tech adaptation
**Rationale**: This diagnostic platform requires clarity, trust-building, and mobile-first usability for farmers with varying literacy levels. Material Design's strong visual feedback, elevation system, and mobile patterns suit this perfectly.

## Core Design Principles

1. **Trust & Credibility**: Medical-grade clarity with official badge integration (FAO/ICAR logos)
2. **Visual Learning**: Heavy use of photography and iconography for low-literacy accessibility
3. **Progressive Disclosure**: Multi-step flows with clear progress indicators
4. **Touch-First**: Large tap targets (minimum 48px), generous spacing for field use

## Typography

**Font Stack**: 
- Primary: Inter or Roboto (Google Fonts) - excellent multilingual support, highly legible
- Headings: 700 weight, sizes from text-2xl to text-5xl
- Body: 400 weight, text-base to text-lg for readability
- Subtext/Meta: 500 weight, text-sm for labels and hints
- RTL Support: Ensure sufficient line-height (1.6-1.8) for Arabic script

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, and 12** consistently
- Component padding: p-4 or p-6
- Section spacing: py-12 on mobile, py-16 on desktop
- Card gaps: gap-4 or gap-6 in grids
- Button spacing: px-6 py-3

**Container Strategy**:
- Max-width: max-w-7xl for main content
- Full-width for hero and image galleries
- Cards: max-w-sm for feature cards, max-w-2xl for forms

## Component Library

### Navigation
- Sticky header with language switcher prominently placed (flag icons + text)
- Mobile: Hamburger menu with large touch targets
- Desktop: Horizontal nav with mega-menu for Crop Library categories

### Hero Sections
**Homepage Hero**:
- Full-width background image: farmer examining crop in golden hour lighting
- Overlay: gradient from transparent to dark (for text readability)
- Headline: Large, bold, centered with blurred-background CTA button
- Height: 85vh on desktop, 70vh on mobile
- Include: Supported crops horizontal scroll with circular crop icons below CTA

### Cards & Content Blocks
- **Feature Cards**: Elevated (shadow-md), rounded corners (rounded-lg), white background
- **Disease Cards**: Image-first with overlay text, 2-column grid on tablet, 3-column on desktop
- **Diagnosis Results**: Use color-coded badges (green/yellow/red for risk levels) with icon indicators

### Forms & Input
- Large input fields: py-4 px-4 with rounded-lg borders
- Image upload: Dashed border dropzone with camera icon, minimum 300px height on mobile
- Crop selector: Dropdown with crop icons next to names
- Progress bar: Segmented steps with checkmarks for completed stages

### Diagnostic Flow
- Step-by-step cards with numbered badges (1, 2, 3, 4)
- Visual progress indicator at top (horizontal stepper)
- "Previous/Next" buttons: Full-width on mobile, inline on desktop
- Confidence scores: Horizontal bar graphs with percentage labels

### Chat Interface
- Message bubbles: User (green accent, right-aligned), AI (gray, left-aligned)
- Input area: Fixed bottom with blur-glass background effect
- Voice/image buttons: Large circular buttons flanking text input
- Rounded-2xl bubbles with generous padding (p-4)

### Dashboard
- Card-based layout with metric widgets
- Timeline: Vertical line with date markers and disease thumbnails
- Weekly score: Large circular progress indicator with crop icon
- 2-column grid on desktop, stacked on mobile

### Expert Directory
- Profile cards with avatar, name, specialization badges
- Filter chips: Rounded-full with close icons
- Contact buttons: Icon + text, stacked vertically in card

### Alerts Section
- Alert cards with left-border accent (border-l-4)
- Priority colors: Red (urgent), Yellow (warning), Blue (info)
- Date stamps and location badges

## Images

**Required Photography**:
1. **Homepage Hero**: Wide-angle farmer in field examining plant, warm natural lighting
2. **Crop Library**: High-quality macro shots of each crop's healthy state and common diseases (minimum 500x500px)
3. **Disease Gallery**: Close-up leaf damage, pest damage, comparison shots (healthy vs diseased)
4. **Expert Profiles**: Placeholder avatars or headshots
5. **Mobile App Mockups**: Phone screens showing key features (3-4 images)
6. **Success Stories**: Optional farmer testimonial photos

**Image Treatment**:
- Use rounded-lg for all card images
- Lazy loading for all gallery images
- Aspect ratio: 16:9 for hero, 1:1 for crops, 4:3 for diseases

## Accessibility Features

- **Icon Labels**: Every icon accompanied by text label or aria-label
- **Audio Toggle**: Speaker icon in top-right for text-to-speech
- **High Contrast**: Ensure 4.5:1 contrast ratio minimum
- **Large Touch Targets**: 48x48px minimum for all interactive elements
- **Offline Indicator**: Persistent badge when offline mode active

## Multi-Column Strategy

- **Homepage Features**: 3-column grid on desktop, 1-column mobile
- **Crop Categories**: 4-column icon grid on desktop, 2-column mobile
- **Disease Gallery**: Masonry layout, 3-4 columns desktop, 2 mobile
- **Expert Directory**: 3-column cards desktop, 1-column mobile
- **Dashboard Metrics**: 2-column desktop, 1-column mobile

## Special Patterns

**Language Switcher**: Dropdown with flag icons, positioned top-right of navbar

**Dark Mode**: Toggle in footer, affects primarily background and text (not imagery)

**Field Cards**: Downloadable PDF-style cards with QR codes, printable layout

**Confidence Meters**: Horizontal bars with icon + percentage + descriptive label

**Safety Disclaimers**: Yellow alert boxes with warning icon, prominent placement

## Mobile-Specific Enhancements

- Bottom navigation bar for key actions (Home, Diagnose, Library, Dashboard)
- Swipeable crop/disease galleries
- Native camera integration UI
- Expandable sections (accordions) for long content
- Floating action button for "Quick Diagnose"

This design creates a trustworthy, accessible agricultural platform that balances visual richness with functional clarity for farmers in varied conditions.