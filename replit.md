# Campus Print Delivery

A full-stack digital xerox and stationery delivery service for engineering students.

## Overview

Campus Print Delivery is a web application that allows students to upload PDF files, customize print options, and have their documents printed and delivered to their campus location. The service automatically routes print jobs to the least-crowded xerox shop for faster processing.

## Features

### Core Functionality
- **Home Page**: Hero section with service overview, how it works explanation, pricing comparison, and call-to-action
- **PDF Upload Form**: Multi-step form (4 steps) for student details, file upload, print options, and order review
- **Live Pricing Calculator**: Real-time price breakdown that updates as users select options
- **Automatic Shop Routing**: Assigns orders to the least-crowded shop from 3 mock xerox shops
- **Order Confirmation**: Success page with timeline visualization and downloadable receipt
- **Admin Dashboard**: Manage all orders with filtering, searching, and status updates
- **Order Tracking**: Students can track their orders by USN

### Print Options
- Print type: Black & White (₹3/page) or Color (₹11/page)
- Single or double-sided printing
- Multiple copies support
- Additional services: Stapling (₹2), Spiral Binding (₹20), Graph Sheets, Record Sheets
- Delivery speeds: Normal (2 hours), Fast (1 hour - ₹5), Express (30 min - ₹10)

## Project Structure

```
client/
  src/
    components/
      Navbar.tsx               # Fixed navigation bar
      PricingCalculator.tsx    # Live pricing sidebar
      ui/                      # Shadcn UI components
    pages/
      Home.tsx                 # Landing page
      Upload.tsx               # Multi-step upload form
      Confirmation.tsx         # Order confirmation with timeline
      Admin.tsx                # Admin dashboard with order management
      Track.tsx                # Order tracking by USN
    App.tsx                    # Route configuration
    index.css                  # Design tokens and utility classes
server/
  routes.ts                    # API endpoints
  storage.ts                   # In-memory storage interface
shared/
  schema.ts                    # Data models and types
```

## Data Model

### Order Schema
- **Student Details**: name, college, USN, department, semester, class, year
- **File Information**: file names, file paths, page count
- **Print Options**: print type, copies, sides
- **Additional Services**: stapling, spiral binding, graph sheets, record sheets
- **Delivery**: delivery speed, expected delivery time
- **Pricing**: subtotal, extras, total
- **Shop Assignment**: assigned shop, queue position
- **Status**: pending → printing → delivered
- **Timestamps**: created at

## Design System

- **Font**: Inter (primary), Poppins (alternative)
- **Icons**: Lucide React icons, Font Awesome via CDN
- **Components**: Shadcn UI components with custom styling
- **Colors**: Professional blue primary color scheme
- **Layout**: Mobile-first responsive design
- **Spacing**: Consistent 4, 6, 8, 12 unit system

## Technology Stack

- **Frontend**: React, TypeScript, Wouter (routing), TanStack Query
- **Backend**: Node.js, Express
- **Styling**: Tailwind CSS, Shadcn UI
- **File Upload**: Multer (to be implemented)
- **Storage**: In-memory storage (MemStorage)

## Recent Changes

- 2024-11-20: Initial project setup with complete frontend implementation
  - Created all page components (Home, Upload, Confirmation, Admin, Track)
  - Implemented multi-step upload form with live pricing
  - Added order tracking and admin dashboard
  - Configured design tokens and typography
  - Set up data schemas and TypeScript types

## User Workflow

1. Student visits home page and clicks "Upload Printout"
2. Fills out student details (name, USN, college, etc.)
3. Uploads PDF files and specifies page count
4. Selects print options and additional services
5. Reviews order and sees live pricing calculation
6. Submits order
7. Order is automatically assigned to least-crowded shop
8. Student receives confirmation with order ID and expected delivery time
9. Student can track order status by USN
10. Admin can manage orders and update status

## Next Steps

- Backend implementation with file upload handling
- Shop routing logic
- Pricing calculation on server
- Order persistence
- Integration testing
