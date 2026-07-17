# Excused Absence Management System · Riwi

Interface MVP (login + coder module + Socioemotional Skills/admin module).
Built with **Vite + Vanilla JS + TailwindCSS v4**, following the same architecture as the 
reservation system: folder-based MVC (`views`, `controllers`, `services`, `components`), 
History API routing with role guards, and `json-server` as a simulated backend.

## Getting Started

```bash
npm install
npm run dev
```

This spins up both services simultaneously:
- The Vite client at `http://localhost:5173`
- `json-server` at `http://localhost:3000` (uses `db.json`)

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Coder | juan.coder@riwi.io | Coder123* |
| Coder | maria.coder@riwi.io | Coder123* |
| Socioemotional Advisor (admin) | soc@riwi.io | Socio123* |
| Team Leader (no dedicated view yet) | team.leader@riwi.io | Leader123* |

## What's Included in This First Release

- **Login / Register Tabs**: Users can log in or create a new account by selecting their role (Coder or Socioemotional Advisor). The registration process validates that the email does not exist, saves the user persistently to `db.json` (via `json-server`), and automatically establishes a session with the chosen role. Upon logging out, users can sign back in anytime using their email and password.
- **Coder Module**: Form to log an absence (date, reason, description, attachment/support link) + "My Requests" history showing real-time status (Pending / Under Review / Approved / Rejected) along with feedback notes when applicable.
- **Administrative Module (Socioemotional Advisor)**: Dashboard tracking statistical cards (total, pending, under review, approved, rejected), absences per month, most frequent reasons, and coders with highest absence counts. It features a requests table with a modal window to review supporting documentation, update status, and attach performance notes.
- **Admin Sidebar Placeholders**: Reserved spaces for **User, Campus, and Program Management** (marked as "Coming Soon") ensuring the interface layout is ready for upcoming features.

## Future Iterations / Roadmap

- Dedicated view for Team Leaders (read-only access, no approval permissions).
- Core CRUD operations for users, campuses, and programs inside the admin module.
- Cloud document handling (currently tracking file names only, as `json-server` does not store binary media assets).
- Robust validation rules and strict authorization controls on the backend (currently following client-side guard protocols, similar to the reservation project).
