# INSA Summer Camp — exptestino (Web Prototype)

## Description

Experimental web-first prototype that replaces paper forms with QR-based attendance, provides real-time role-targeted news, and offers dashboards and reports for instructors and admin staff. Designed as a minimal, extendable web app ("exptestino") to be expanded in the future.

## Problem it solves

- Eliminates paper attendance and manual score tracking.
- Reduces fraudulent or repeated attendance using short-lived, server-validated QR codes.
- Delivers targeted real-time announcements to distinct user groups (students / mentors).
- Provides analytics (day/week/year) and exportable reports for staff.

## Key features

- Server-generated, time-limited QR codes for lecture and dining attendance.
- QR scan → `GET /attendance/<code>/` → validate and save attendance for authenticated users.
- Role-based real-time news via WebSockets (separate channels or a single authenticated channel with group routing).
- Admin dashboard: bulk user import (CSV/Excel), publish schedules, manual attendance edits.
- Score management with history and audit logs.
- Reporting & charts with day/week/year aggregation for dashboards.
- REST API (Django REST Framework) for frontend integration.
- Authentication with JWT or session-based auth; permissioned endpoints by role.

## User roles

### Admin

- Bulk import students (CSV/Excel).
- Generate and publish QR codes (with expiry).
- Send group-targeted news (students/mentors).
- Edit attendance and scores; view reports and exports.

### Mentor

- View assigned students' attendance and scores.
- Receive mentor-targeted news.
- Access class reports.

### Student

- Log attendance by scanning QR code (must be authenticated).
- View personal scores and receive notifications.

## Tech stack (web-only)

- Backend: Python, Django, Django REST Framework, Django Channels, SimpleJWT, CORS
- Frontend: React, React Router, Axios
- Charts: Recharts (or Nivo if preferred)
- Database: PostgreSQL (recommended)
- Channel layer: Redis (production)
- Optional: Celery + Redis for background tasks

## Architecture (brief)

1. Admin creates `code = UUID` stored server-side with expiry and scope.
2. Server builds URL `https://.../attendance/<code>/` and QR encodes it.
3. Student scans QR → browser opens URL → backend verifies `request.user`, code validity and expiry, writes Attendance record.
4. Admin posts news → backend sends to `students_group` or `mentors_group` via channel layer; clients receive via WebSocket.
5. Frontend fetches aggregated endpoints (`/api/attendance/aggregate/?range=day|week|year`) to render charts and tables.

## Minimal backend setup

```bash
py -m venv venv
# Windows
venv/Scripts/activate
# macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
# set env vars: SECRET_KEY, DATABASE_URL, CHANNEL_LAYER config
python manage.py migrate
python manage.py createsuperuser
# dev server (channels)
python manage.py runserver
# or for ASGI testing
# daphne -p 8000 project.asgi:application
```

## Minimal frontend setup

```bash
npx create-react-app web
cd web
npm install axios recharts
# run
npm start
```

## Security & anti-cheat suggestions

- Make QR codes short-lived (1–5 minutes) and validate server-side.
- Store codes with expiry and scope; consider HMAC-signed tokens to prevent tampering.
- Rate-limit attendance submissions per user.
- Log IP and user-agent for audit trails.
- Use HTTPS in production and protect WebSocket connections (wss\://).

## Roadmap / Future ideas

- Add mobile support (PWA or simple native companion app) as the primary future direction.
- Add export options (CSV/Excel) for reports.
- Add aggregated endpoints in the backend to offload frontend processing.
- Implement horizontal scaling (Redis channel layer, worker queues) when needed.
