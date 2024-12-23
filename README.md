# Shaf - Keywords Monitoring System

Internal development documentation

## 🔧 Local Development Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file:
   ```env
   DATABASE_URL="your-db-connection-string"
   NEXTAUTH_SECRET="your-auth-secret"
   BANKRUPTCY_API_URL="https://bankruptcy.gov.sa/eservices/api/AnnouncementNewDataAPI/"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

```
src/
├── app/                    # Next.js 13 App Router
│   ├── (site)/            # Main site routes
│   │   ├── user/          # User dashboard routes
│   │   └── admin/         # Admin panel routes
│   └── api/               # API endpoints
├── components/            # Reusable components
├── lib/                   # Shared libraries
└── utils/                # Helper functions
```

## 🔄 Core Services

### Keywords Monitoring

- Fetches announcements every \*\* hours via Vercel Cron
- Endpoint: `/api/announcements/fetch`
- Matches announcements against user keywords
- Sends email notifications for matches

### User Management

- Authentication via NextAuth.js
- User roles: admin, user
- Subscription handling through paylink

### Database

- Prisma ORM
- Key models: User, Keyword, Announcement, Notification

## 🛠 Development Guidelines

1. **Branches**

   - `main`: production
   - `dev`: development
   - Feature branches: `feature/description`

2. **API Routes**

   - User routes: `/api/user/*`
   - Admin routes: `/api/admin/*`
   - Announcement routes: `/api/announcements/*`
   -

3. **Components**

   - Use TypeScript strictly
   - Follow existing component structure
   - Reuse UI components from `/components/ui`

4. **Testing**
   - Run tests: `npm test`
   - Add tests for new features

## 🔍 Monitoring & Debugging

- Check announcement fetch logs: `/admin/logs`
- Monitor API health: `/api/health`
- Debug email notifications: `/admin/notifications`

## 🚨 Common Issues

1. **SSL Certificate Issues**

   - The bankruptcy.gov.sa API might require SSL verification bypass
   - Use the provided utility in `utils/api-helpers.ts`

2. **API Rate Limiting**

   - Implement exponential backoff for retries
   - Log failed attempts

3. **Database Connections**
   - Check connection pool settings
   - Monitor query performance
