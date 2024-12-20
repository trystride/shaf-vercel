## Project Overview

The goal of this integration is to add a bankruptcy announcement monitoring feature to the existing SaaS application. Users can add custom keywords (e.g., a client’s name or a business entity) that the system uses to track announcements from [bankruptcy.gov.sa](https://bankruptcy.gov.sa). The system periodically (every 2 hours) fetches new announcements, matches them against stored keywords, and notifies users (via email) when matches are found. Users can view matched announcements and manage their keywords and notification preferences via their dashboard.

# Detailed Implementation Instructions

**Note**: The existing SaaS application already provides core user management features such as login, signup, and subscription handling. Do not duplicate or re-implement these functionalities. Instead, integrate the new bankruptcy announcement monitoring features into the existing structure and follow best practices for modern web apps.

## Project Context & Existing Structure

The application is organized into a [Next.js 13+ App Router](https://nextjs.org/docs) directory structure. Many essential features—authentication (login, signup), user management, payment integration—are already implemented. Your task is to extend the current setup by adding bankruptcy announcement monitoring capabilities, adhering to established coding styles, conventions, and folder structures.

Use the `(site)/user/dashboard` subdirectory to add new pages related to keywords and announcements. Leverage `(site)/admin/...` for optional admin views (like a fetch status page). For API endpoints, consider placing announcement-related APIs under `src/app/api/announcements/` or within `(site)/user/api/keywords/` and `(site)/user/api/announcements/` for user-specific endpoints.

## New Features Overview

You will add a new set of features for monitoring bankruptcy announcements. The main steps are:

1.  **Keyword Management (User Dashboard)**
2.  **Periodic Announcement Fetching (Server)**
3.  **Keyword Matching & Notifications (Server)**
4.  **Announcement Viewing (User Dashboard)**
5.  **Notification Settings (User Dashboard)**

**Do not re-implement existing features** such as user authentication or subscription management. These are already in place, so simply integrate with the existing user and subscription logic (for example, ensuring that only authenticated users can manage keywords).

## Key Points & Constraints

- The external API (`https://bankruptcy.gov.sa/eservices/api/AnnouncementNewDataAPI/`) does not support query parameters and returns a complete set of announcements.
- SSL certificate issues may require bypassing SSL verification.
- Announcements are fetched every 2 hours using a scheduled job (e.g., Vercel Cron) calling a Next.js API route.
- Matching and notifications run after each fetch cycle.
- Users can manage their keywords and notification settings in their dashboards.
- Integration should leverage existing user and subscription systems without disrupting current functionalities.

## Core Functionalities

### 1. Keyword Management

**Description**:  
Enable users to add, edit, and delete custom keywords. These keywords form the basis for tracking announcements.

**Functional Requirements**:

- Users can create new keywords through a form in `/user/dashboard/keywords`.
- Users can view a list of keywords, edit them inline or via a modal, and remove unwanted keywords.
- Validate to prevent empty or duplicate keywords.

**UI Layout**:

- A dedicated `/user/dashboard/keywords` page with:
  - A form to add a new keyword.
  - A list/table of existing keywords with "Edit" and "Delete" icons.

**Actions**:

- **Add Keyword**: Opens a form to submit a new keyword.
- **Edit**: Allows users to change an existing keyword.
- **Delete**: Removes a keyword after user confirmation.

**Technologies**:

- Next.js for the front-end and API endpoints.
- Tailwind CSS for styling.
- Lucid-icons for UI icons.

**Database Schema Changes**:

```prisma
model Keyword {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  value     String
  createdAt DateTime @default(now())

  @@index([userId])
}

```

### 2. Announcement Fetch & Storage

**Description**:  
Fetch announcements from `https://bankruptcy.gov.sa/eservices/api/AnnouncementNewDataAPI/` every 2 hours. Parse and store them in the `Announcement` model.

**Functional Requirements**:

- Implement a serverless cron job (e.g., Vercel Cron) to call `/api/announcements/fetch` every 2 hours.
- Fetch and parse raw JSON, handling Arabic text normalization and date formatting.
- Store unique announcements (identified by `annId`) in the database.

**UI Layout**:

- No direct UI for end-users.
- Optional admin page to view the last fetch timestamp and the count of announcements.

**Actions**:

- **Scheduled Fetch (Every 2 Hours)**: Automatically triggered.
- **Manual Fetch (Optional, Admin Only)**: A button in admin dashboard to fetch data on-demand (for testing).

**Technologies**:

- Next.js API routes for fetching announcements.
- Prisma for database operations.
- HTTPS agent with `rejectUnauthorized: false` to bypass SSL verification if needed.

**Database Schema Changes**:

```prisma
model Announcement {
  id               String     @id @default(cuid())
  annId            Int        @unique
  header           String?
  comment          String?
  actionType       String?
  courtType        String?
  announcementType String?
  publishDate      DateTime?
  url              String?
  createdAt        DateTime    @default(now())
  matches          Match[]
}

```

### Python Script Reference (For Developer Insight)

**Note**: This Python script was previously used to fetch announcements and can guide how the API behaves. It shows how to bypass SSL verification and parse the response.

```python
import requests
import json
import logging

logging.basicConfig(level=logging.DEBUG)

class BankruptcyAPI:
    def __init__(self):
        self.url = "https://bankruptcy.gov.sa/eservices/api/AnnouncementNewDataAPI"
        self.session = self._create_session()

    @staticmethod
    def _create_session():
        session = requests.Session()
        session.verify = False  # Bypass SSL
        return session

    def fetch_announcements(self):
        response = self.session.get(self.url, timeout=30)
        response.raise_for_status()
        text = response.text.strip()

        if text.startswith('"') and text.endswith('"'):
            text = text[1:-1]
        text = text.replace('\\"', '"').replace('\\\\', '\\')

        announcements = json.loads(text)
        if not isinstance(announcements, list):
            text = text.replace('}{', '},{')
            if not text.startswith('['):
                text = '[' + text
            if not text.endswith(']'):
                text = text + ']'
            announcements = json.loads(text)

        return announcements

```

### 3. Keyword Matching & Notification

**Description**: After each fetch, match newly fetched announcements against all user keywords. If matches occur, save them and send email notifications.

**Functional Requirements**:

- For each announcement, check if the keyword’s terms appear in its fields.
- Create `Match` records for all found matches.
- Send an email notification to the user listing the matched announcements.

**UI Layout**:

- No dedicated UI for the matching process, but matched announcements appear in `/user/dashboard/announcements`.

**Actions**:

- **Automated Matching**: Runs after every successful fetch and storage operation.
- **Email Notification**: Triggered when new matches are found.

**Technologies**:

- Prisma for creating `Match` records.
- Nodemailer or existing email service for sending emails.
- A text normalization utility to ensure case-insensitive and diacritic-insensitive matching.

**Database Schema Changes**:

```prisma
model Match {
  id             String       @id @default(cuid())
  keywordId      String
  keyword        Keyword      @relation(fields: [keywordId], references: [id], onDelete: Cascade)
  announcementId String
  announcement   Announcement @relation(fields: [announcementId], references: [id], onDelete: Cascade)
  createdAt      DateTime     @default(now())

  @@index([keywordId])
  @@index([announcementId])
}

```

### 4. Announcement Viewing (User Dashboard)

**Description**: Users can view matched announcements in their dashboard, filter them by keyword and date, and see detailed announcement info.

**Functional Requirements**:

- A `/user/dashboard/announcements` page listing matched announcements.
- Filters by keyword, date range, or other attributes.
- Pagination if many matches are present.

**UI Layout**:

- A table or list of matched announcements.
- A filter bar on top (dropdown for keywords, date pickers, etc.).

**Actions**:

- **Filter**: Allows users to narrow down the list by keyword or date.
- **View Details**: Clicking an announcement shows more information.

**Technologies**:

- Next.js pages for front-end UI.
- Tailwind CSS for responsive layout.
- Lucid-icons for filter and detail icons.

### 5. Notification Settings (User Preferences)

**Description**: Users can enable/disable email notifications and optionally specify a secondary email.

**Functional Requirements**:

- In `/user/settings`, a toggle for enabling/disabling notifications.
- A field for adding an alternate notification email.
- Save preferences in the `User` model or a dedicated model.

**UI Layout**:

- A simple form in `/user/settings` with a toggle and input for email.

**Actions**:

- **Save Settings**: Commits changes to the database.

**Technologies**:

- Tailwind CSS for form styling.
- Prisma for user updates.

**Database Schema Changes** (Extend User Model):

```prisma
model User {
  ...
  notificationsEnabled        Boolean? @default(true)
  alternateNotificationEmail  String?
  ...
}

```

## Implementation Steps

1.  **Database Migrations**:

    - Add `Keyword`, `Announcement`, `Match` models and update `User` model.
    - Run `npx prisma migrate dev` to apply schema changes.

2.  **Fetching Announcements**:

    - Implement `/api/announcements/fetch` route.
    - Use a scheduled job (every 2 hours) to call this endpoint.
    - Parse and store announcements.

3.  **Keyword CRUD**:

    - Add `/user/api/keywords` routes for creating, editing, and deleting keywords.
    - Implement a front-end page `/user/dashboard/keywords` with forms and lists.

4.  **Matching & Notifications**:

    - After fetching, run a matching function on the server:
      - Get new announcements.
      - Compare with all keywords.
      - Store matches and send emails.

5.  **View Matches**:

    - Create `/user/dashboard/announcements` page.
    - Display matched announcements and implement filtering.

6.  **Notification Settings**:

    - In `/user/settings`, add a toggle for notifications and a field for alternate email.
    - Update `User` record accordingly.

## Best Practices

- **Security**:

  - Store secrets (DB URL, SMTP creds) in `.env`.
  - Use HTTPS in production.

- **Performance**:

  - Add indexes on frequently queried fields (e.g., `annId`, `keyword.value`).
  - Implement pagination to handle large datasets.

- **Code Quality**:

  - Use TypeScript for type safety.
  - Write unit tests for keyword matching logic.
  - Write integration tests for the full announcement → match → notification flow.

- **Monitoring & Logging**:

  - Log fetch operations, errors, and notification sends.
  - Consider integrating with a logging/monitoring solution like Sentry or Datadog.
