# Shaf Application Structure

## Overview
Shaf is a Next.js-based SaaS application for social media monitoring and advertising analytics, with built-in support for Arabic and English languages.

## Directory Structure

```
src/
├── actions/                 # Server actions
├── app/                    # Next.js App Router
│   ├── (site)/            # Main website routes
│   ├── (studio)/          # Admin/studio routes
│   ├── api/               # API endpoints
│   └── context/           # React contexts
├── components/            # React Components
│   ├── Admin/            # Admin panel components
│   ├── Auth/             # Authentication components
│   ├── Blog/             # Blog components
│   ├── Common/           # Shared components
│   ├── Header/           # Navigation components
│   ├── Home/             # Landing page components
│   ├── User/             # User dashboard components
│   └── ui/               # UI component library
├── emails/               # Email templates
├── lib/                  # Core utilities
├── paylink/             # Payment integration
├── sanity/              # CMS integration
├── translations/        # i18n translations
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

## Key Features

1. **Authentication System**
   - Email/Password login
   - Magic link authentication
   - OAuth providers (Google, GitHub)
   - Password reset functionality

2. **User Dashboard**
   - Keyword monitoring
   - Analytics dashboard
   - Notification settings
   - Billing management

3. **Admin Panel**
   - User management
   - Content management (Sanity CMS)
   - Newsletter system
   - Notification management

4. **Billing System**
   - Multiple subscription tiers
   - Payment processing
   - Purchase history
   - API key management

5. **Internationalization**
   - Arabic language support
   - RTL layout support
   - Localized content

6. **Technical Stack**
   - Next.js (React Framework)
   - TypeScript
   - Prisma (Database ORM)
   - Sanity (Headless CMS)
   - AWS S3 (Storage)
   - Email service integration

## Current i18n Implementation

The application currently has:
- Translation files in `/src/translations/`
- RTL support for Arabic language
- Translation context provider in `/src/app/context/TranslationContext.tsx`

Next steps will involve setting up Next.js built-in i18n configuration for proper routing and locale management.
