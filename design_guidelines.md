# Design Guidelines: Campus Print Delivery Service

## Design Approach
**Reference-Based Approach** - Drawing inspiration from modern student-focused productivity platforms like Notion and Linear, combined with e-commerce checkout flows like Shopify for the ordering process.

**Core Principles:**
- Clean, distraction-free interface optimized for quick task completion
- Professional appearance that builds trust with students
- Mobile-first design (students primarily use phones)
- Fast, functional, zero-friction ordering flow

## Typography System
- **Primary Font:** Inter or Poppins (Google Fonts via CDN)
- **Headings:** 
  - H1: text-4xl md:text-5xl, font-bold
  - H2: text-3xl md:text-4xl, font-semibold
  - H3: text-xl md:text-2xl, font-semibold
- **Body:** text-base md:text-lg, font-normal
- **Labels/Small:** text-sm, font-medium
- **Price displays:** text-2xl md:text-3xl, font-bold (tabular numbers)

## Layout System
**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, and 12 consistently
- Section padding: py-12 md:py-16
- Component spacing: gap-4 md:gap-6
- Form field spacing: space-y-4
- Container: max-w-6xl mx-auto px-4

## Component Library

### Navigation
- Fixed top navbar with logo left, "Track Order" and "Admin" links right
- Mobile: Hamburger menu with smooth slide-in drawer
- Height: h-16, shadow-sm

### Hero Section (Home Page)
- Split layout: 60% text left, 40% illustration/image right (desktop)
- Stack vertically on mobile
- Include: Main headline, 2-line value proposition, primary CTA button
- Image: Modern illustration of student uploading document on laptop/phone (friendly, minimal style)
- Background: Subtle gradient or light geometric pattern

### Upload Form
- Multi-step visual progress indicator at top (Student Info → Upload → Options → Review)
- Card-based layout with grouped sections
- Each section in elevated card with rounded corners
- Form inputs: Full-width with clear labels above, helper text below
- File upload: Drag-and-drop zone with visual feedback, file list preview below

### Pricing Calculator (Live Display)
- Sticky sidebar on desktop (or bottom card on mobile)
- Real-time itemized breakdown as user selects options
- Highlighted total with contrasting background
- Format: "Item - Quantity × Rate = Subtotal"

### Order Confirmation
- Success checkmark icon at top
- Timeline visualization showing: Order Placed → Printing → Out for Delivery → Delivered
- Highlight assigned shop with "less crowded" badge
- Downloadable receipt button (outline style)

### Admin Dashboard
- Clean table layout with alternating row backgrounds
- Status badges: Pill-shaped with color coding (Pending: yellow, Printing: blue, Delivered: green)
- Action column with dropdown for status updates
- Search/filter bar at top

### Buttons
- Primary: Rounded (rounded-lg), medium padding (px-6 py-3), text-base font-semibold
- Secondary: Same size, outline variant
- Icon buttons: Square with icon centered
- Hover states: Slight scale and shadow increase

### Cards
- Rounded corners: rounded-xl
- Shadow: shadow-md on hover shadow-lg
- Padding: p-6
- Border: Optional subtle border (border border-gray-200)

### Forms
- Input fields: Rounded (rounded-lg), padding (px-4 py-3), border
- Focus state: Ring effect (focus:ring-2)
- Dropdowns: Custom styled with chevron icon
- Checkboxes: Rounded squares with checkmark
- Radio buttons: Circular

### Icons
**Font Awesome** (CDN) for consistent iconography:
- Upload: fa-cloud-upload-alt
- Print: fa-print
- Delivery: fa-shipping-fast
- Check: fa-check-circle
- Admin: fa-user-shield
- Track: fa-search

## Page-Specific Layouts

### Home Page
1. **Hero:** Full-width with split content/image, py-16 md:py-24
2. **How It Works:** 3-column grid (single column mobile) with numbered steps, icons, descriptions
3. **Pricing:** 2-column comparison (B&W vs Color) with feature lists
4. **CTA Section:** Centered, gradient background, large button
5. **Footer:** 3-column (Services, Quick Links, Contact)

### Upload Form Page
- Single column centered layout, max-w-3xl
- Progress bar at top
- Form sections in sequence with clear visual separation
- Live pricing sidebar/bottom card always visible

### Confirmation Page
- Centered content, max-w-2xl
- Large success icon, order summary card, timeline, action buttons

### Admin Dashboard
- Full-width table, max-w-7xl
- Filters above table
- Pagination below

## Images

**Hero Image:** Illustration or photo of friendly student using laptop/phone to upload document, modern flat illustration style or actual photo of diverse students. Position: Right side on desktop, full-width above content on mobile. Size: Approximately 600×400px optimized.

**How It Works Section:** Three small icon illustrations for Upload, Print, Deliver steps (200×200px each).

**No other images required** - rely on icons and clean typography for remaining sections.

## Key Design Details
- Generous whitespace - don't cram content
- Consistent border radius across all components (8px standard)
- Shadow usage: Subtle by default, enhanced on hover/active states
- Price displays: Always prominent with large, bold typography
- Status indicators: Color-coded with text labels (not color alone)
- Mobile tap targets: Minimum 44×44px
- Loading states: Skeleton loaders or spinners for uploads

## Accessibility
- Form labels always visible (not placeholder-only)
- Color contrast ratio minimum 4.5:1
- Keyboard navigation support for all interactions
- ARIA labels for icon-only buttons
- Focus indicators clearly visible