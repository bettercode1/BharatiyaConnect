# Pariwar Connect - Maharashtra BJP Management System

## Overview

Pariwar Connect is a comprehensive web-based management system designed for Maharashtra BJP to connect Admin, Leadership, and Member roles. This full-stack application provides member management, event coordination, leadership galleries, and notice distribution capabilities across 288 constituencies with 24,567+ verified members.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for fast development and building
- **UI Library**: Radix UI components with Tailwind CSS for styling (shadcn/ui component system)
- **Styling**: Custom BJP-themed design with saffron, orange, and brown color scheme
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **Internationalization**: Custom language provider supporting Marathi (primary) and English
- **Form Handling**: React Hook Form with Zod schema validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit's OIDC authentication system with passport.js
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API with role-based access control

### Database Schema
- **Users**: Basic user information with role-based access (admin, leadership, member)
- **Members**: Detailed BJP member profiles with constituency, district, and division mapping
- **Events**: Event management with online/offline/hybrid support and attendance tracking
- **Notices**: Announcement system with priority levels and expiry dates
- **Leadership**: Leadership profiles with social media integration
- **Sessions**: Secure session storage for authentication

## Key Components

### Authentication System
- **Problem**: Secure multi-role access control for political organization
- **Solution**: Replit OIDC integration with role-based permissions
- **Benefits**: Seamless authentication with automatic user provisioning

### Member Management
- **Problem**: Managing 24,567+ members across 288 constituencies
- **Solution**: Hierarchical organization by division, district, and constituency
- **Features**: Advanced search, filtering, profile management, and statistics dashboard

### Event Management
- **Problem**: Coordinating political events and tracking attendance
- **Solution**: Comprehensive event lifecycle management with RSVP system
- **Features**: Online/offline/hybrid events, attendance tracking, photo uploads

### Notice System
- **Problem**: Distributing announcements efficiently to targeted groups
- **Solution**: Priority-based notice system with expiry and targeting
- **Features**: Categorized notices, file attachments, push notifications

### Leadership Gallery
- **Problem**: Showcasing party leadership and their achievements
- **Solution**: Dynamic leadership profiles with social media integration
- **Features**: Profile management, social media links, achievement tracking

## Data Flow

1. **Authentication Flow**: User logs in via Replit OIDC → Session created → Role-based access granted
2. **Member Data Flow**: Admin/Leadership creates member profiles → Data stored with constituency mapping → Statistics generated
3. **Event Flow**: Event created → Invitations sent → RSVPs tracked → Attendance recorded
4. **Notice Flow**: Notice created with priority → Targeted distribution → Expiry management
5. **Leadership Flow**: Leadership profiles maintained → Social media integration → Public gallery display

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection for cloud deployment
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/**: Comprehensive UI component library
- **tailwindcss**: Utility-first CSS framework

### Authentication & Security
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Type safety across the stack
- **zod**: Runtime type validation and schema definition

## Deployment Strategy

### Development Environment
- **Problem**: Need for fast development iteration and hot reloading
- **Solution**: Vite development server with Express API integration
- **Benefits**: Fast HMR, TypeScript compilation, and integrated debugging

### Production Build
- **Problem**: Optimized deployment for web and mobile access
- **Solution**: Vite production build with esbuild server bundling
- **Process**: 
  1. Frontend built to `dist/public` directory
  2. Server bundled as ESM module to `dist/index.js`
  3. Static file serving in production mode

### Database Management
- **Problem**: Schema evolution and data migrations
- **Solution**: Drizzle Kit for schema management and migrations
- **Features**: Type-safe migrations, schema introspection, and push commands

### Hosting Considerations
- Designed for Replit deployment with integrated authentication
- PostgreSQL database provisioning required
- Environment variables for database connection and session secrets
- Support for both development and production environments

The application uses a monorepo structure with shared schema types between client and server, ensuring type safety across the full stack. The architecture prioritizes developer experience, type safety, and scalable organization management for political party operations.