# Salat Companion - رفيق الصلاة

## Overview

Salat Companion is a mobile-first Islamic web application that helps users with Quranic memorization and daily review. The app provides a clean, compact interface optimized for mobile devices with Arabic language support and RTL (right-to-left) layout. Users can manage "سور/آيات قصيرة" (Short surahs/verses), "سور/آيات طويلة" (Long surahs/verses), and "أيات مقترحة للحفظ" (Suggested verses for memorization) through separate dedicated pages, and generate random selections from all lists simultaneously on the home page. Built with a modern React frontend and Express.js backend, it uses PostgreSQL database for persistent storage and follows a type-safe development approach with TypeScript throughout.

## User Preferences

Preferred communication style: Simple, everyday language.
Target platform: Mobile app (compact, touch-friendly interface)
Language: Arabic with RTL (right-to-left) layout

## Recent Changes (August 12, 2025)

### Mobile App Development & PWA Enhancement
- **Progressive Web App (PWA) implementation** with installable mobile experience
- Created comprehensive web app manifest with Arabic language support and RTL configuration
- Implemented service worker for offline functionality and caching
- Added Islamic-themed app icons (192px and 512px SVG) with proper mobile optimization
- **Capacitor integration** for native mobile app development (Android & iOS)
- Configured native app settings with Arabic app name "رفيق الصلاة" and Islamic theme colors
- Created mobile setup documentation and automated scripts for platform development
- Enhanced HTML metadata with PWA-specific tags for iOS and Android compatibility

### iOS Safari Compatibility & Logo Integration
- **Resolved iPhone loading issues** by fixing service worker cache conflicts
- Integrated user's custom mosque arch logo for mobile devices and PWA installation
- Added iOS-specific viewport settings with safe area support for notch devices
- Enhanced service worker with better error handling and offline fallback
- Maintained Islamic arch icon in app header while using custom logo for mobile
- Added proper Apple touch icon sizes and format detection settings

### App Rebranding & Navigation Enhancement
- **App renamed to "Salat Companion - رفيق الصلاة"** to better reflect Islamic purpose
- Updated HTML metadata with bilingual title and enhanced SEO tags
- Replaced unified list management with separate navigation entries for each list
- Created individual dedicated management pages for all three lists (list1.tsx, list2.tsx, list3.tsx)
- Enhanced navigation with color-coded icons and descriptions for each list type
- Removed generic "القوائم" (Lists) entry in favor of specific list navigation
- Added About page with comprehensive app information and Islamic content

### List Management Restructure
- Each list now has its own dedicated page with distinct visual identity:
  - Short verses: Blue theme with List icon
  - Long verses: Green theme with ListOrdered icon  
  - Suggested verses: Purple theme with BookOpen icon
- Individual list pages feature complete CRUD functionality
- Color-coded backgrounds and borders match each list's theme
- Enhanced mobile-first design with touch-friendly interactions

## Previous Changes (August 11, 2025)

### Navigation & UI Updates
- Converted entire application to Arabic language with RTL layout support
- Added Noto Sans Arabic font for proper Arabic text rendering
- Replaced header navigation with slide-out side panel using hamburger menu
- Enhanced navigation with descriptive cards and status indicators

### List Management Enhancement
- Created unified tabbed interface for managing all lists in one page
- Added third list: "أيات مقترحة للحفظ" (Suggested verses for memorization)
- Each list has distinct color coding: Short verses (blue), Long verses (green), Suggested verses (purple)
- Removed individual list overview from home page for cleaner interface
- Home page now focuses solely on random selection functionality

### Data Persistence Solution
- **CRITICAL UPGRADE**: Converted from in-memory storage to PostgreSQL database
- Implemented persistent storage to prevent data loss on server restarts
- Created DatabaseStorage class with proper initialization of default Arabic lists
- All user content now survives server restarts and redeployments
- Database automatically creates three default lists on first startup

### Technical Implementation
- Backend storage updated to support three default lists with Arabic names
- All user interface text converted to Arabic
- Toast notifications and confirmation dialogs localized
- Maintained mobile-first responsive design throughout changes
- List names updated to "سور/آيات قصيرة", "سور/آيات طويلة", and "أيات مقترحة للحفظ"

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation integration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with CRUD operations for selection lists
- **Request/Response**: JSON-based communication with middleware for logging
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Development Server**: Hot module replacement with Vite integration in development mode

### Data Storage Solutions
- **Database**: PostgreSQL with Neon Database serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Fallback Storage**: In-memory storage implementation for development/testing
- **Data Validation**: Zod schemas for runtime type checking and validation

### External Dependencies
- **Database**: Neon Database (PostgreSQL-compatible serverless database)
- **UI Components**: Radix UI primitives for accessible component foundations
- **Icons**: Lucide React icon library
- **Build Tools**: Vite with React plugin and TypeScript support
- **Development Tools**: Replit-specific plugins for error overlay and cartographer
- **Styling**: PostCSS with Tailwind CSS and Autoprefixer

### Key Design Patterns
- **Separation of Concerns**: Clear separation between client, server, and shared code
- **Type Safety**: End-to-end TypeScript with shared schema definitions
- **Component Composition**: Reusable UI components with consistent design system
- **Error Boundaries**: Proper error handling and user feedback mechanisms
- **Responsive Design**: Mobile-first responsive layouts with Tailwind utilities
- **Internationalization**: Arabic language support with RTL layout using CSS direction properties
- **Page Organization**: Unified tabbed interface for managing multiple lists with extensible design
- **Multi-list Support**: Support for three lists including Arabic verse memorization list