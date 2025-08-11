# Random Selector App

## Overview

This is a mobile-first web application that allows users to manage and randomly select items from two lists. The app provides a clean, compact interface optimized for mobile devices for adding/removing items from "List 1" and "List 2", and generates random selections from both lists simultaneously. Built with a modern React frontend and Express.js backend, it uses in-memory storage for fast data access and follows a type-safe development approach with TypeScript throughout.

## User Preferences

Preferred communication style: Simple, everyday language.
Target platform: Mobile app (compact, touch-friendly interface)

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