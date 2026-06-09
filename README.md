# CrochetHub

A full-stack web application for crochet learning and pattern sharing. Students enroll in structured courses and track lesson progress, instructors create and manage course content, and admins oversee the platform. Built as a Database Systems final project.

**Live app:** https://crochethub.vercel.app

---

## Repositories

| Component | Repo |
|---|---|
| Frontend Next.js (latest) + TypeScript | https://github.com/ghanimajid/crochethub (Frontend: /Frontend folder) |
| Backend (ASP.NET Core 8) | https://github.com/ghanimajid/crochethub (Backend: /Backend/CrochetHub folder) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Database | MySQL 8.0 |
| ORM | Entity Framework Core 8 |
| Backend | ASP.NET Core 8 |
| Authentication | JWT |
| PDF Generation | QuestPDF |
| Frontend | Next.js (latest) + TypeScript |

---

## Features

**Students**
- Browse and enroll in courses (prerequisite enforcement included)
- Complete lessons and track progress per course
- Browse, create, and favorite crochet patterns
- Review courses and patterns
- Participate in the community forum
- Download learning reports and course completion certificates

**Instructors**
- Create and manage courses with difficulty levels, tags, and prerequisites
- Add and order lessons with video URLs and written content
- View enrollment statistics and student progress
- Download performance reports and achievement certificates

**Admins**
- Manage all users, change roles, and delete accounts with safety checks
- Moderate forum threads
- View platform-wide statistics via database views
- Generate platform overview, user growth, forum activity, and content audit reports
- Issue top-contributor certificates to any user

---

## Database Highlights

- 22 tables normalised to 3NF
- Shared primary key inheritance for Person / User / Student / Instructor
- Centralised lookup table for all categorical values (roles, difficulty, forum categories, notification types, audit actions)
- 6 SQL views for aggregation and recommendation logic
- 8 stored procedures (4 with explicit transaction control)
- 20 triggers: 8 business logic + 12 backup triggers
- 6 backup tables capturing full row snapshots before every UPDATE and DELETE
- Application-level audit log covering all significant operations
- Cascade, restrict, and set-null foreign key strategies applied per relationship

---

## Project Structure

```
Backend (ASP.NET Core 8)
├── Controllers/       HTTP endpoints, role checks
├── Services/          Business logic, audit calls, DTO mapping
├── Repositories/      EF Core queries and multi-table updates
├── DTOs/              Request and response shapes
└── Models/            Entity classes and EF Core configuration

Frontend (Next.js)
├── app/               App Router pages per role
├── components/        Shared UI components
└── context/           Auth context and apiFetch utility
```

---

## Getting Started

### Prerequisites

- .NET 8 SDK
- Node.js 18+
- MySQL 8.0

### Backend Setup

1. Clone the backend repo.
2. Copy `appsettings.example.json` to `appsettings.json` and fill in your values:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=crochethub;User=root;Password=yourpassword;"
  },
  "Jwt": {
    "Secret": "your-secret-key-at-least-32-chars",
    "Issuer": "CrochetHub",
    "Audience": "CrochetHubUsers",
    "ExpiryInDays": "7"
  }
}
```

3. Run migrations and start the server:

```bash
dotnet ef database update
dotnet run
```

The API will be available at `https://localhost:7167`.

### Database Setup

After running migrations, execute the following scripts in order against your MySQL database:

1. `views.sql` (creates the 6 views)
2. `triggers.sql` (creates the 20 triggers and 6 backup tables)
3. `procedures.sql` / `transactions.sql` (creates the 8 stored procedures)
4. `seed.sql` (optional sample data)

### Frontend Setup

1. Clone the frontend repo.
2. Create a `.env.local` file:

# Local development
NEXT_PUBLIC_API_URL=https://localhost:7167

# Production (Vercel)
NEXT_PUBLIC_API_URL=https://crochethub-production.up.railway.app

3. Install dependencies and run:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

### Deploying to Vercel

1. Push the frontend repo to GitHub.
2. Import the repo in Vercel.
3. Add the environment variable `NEXT_PUBLIC_API_URL` pointing to your hosted backend URL in the Vercel project settings.
4. Vercel builds and deploys automatically on every push to main.

---

## User Roles and Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@crochethub.com | Admin@123

---

## Reports and Certificates

All reports are generated on demand from live database data using QuestPDF.

| Role | Reports |
|---|---|
| Admin | Platform Overview, User Growth, Forum Activity, Content Audit |
| Instructor | Course Performance, Student Progress, Lesson Engagement, Content Popularity |
| Student | My Learning, My Progress, My Patterns, Activity Summary |
| Certificates | Course Completion (student), Instructor Achievement (instructor), Top Contributor (admin-issued) |

---

## Authors

- Zainab Aftab
- Ghania Majid

Database Systems Course, Semester 2 2026