# AFK Coders · Absence Management System

AFK Coders is a full-stack web application designed to track, manage, and validate student or developer absences. The system allows users to justify their absences by submitting supporting documents or images. It features a secure login system and specialized dashboards tailored to different organization roles.

---

## System Roles & Workflows

The application manages distinct user roles with custom permissions and navigation guards:

### 1. Coder (Student/Developer)
*   **Access**: Personal dashboard.
*   **Submit Justification**: Create absence tickets by specifying:
    *   `Absence Date` (Fecha de inasistencia)
    *   `Category/Reason` (Motivo de inasistencia)
    *   `Detailed Description` (Descripción detallada)
    *   `Support Document Link/Image` (Soporte/Foto de la razón justificada)
*   **History**: Track "My Requests" showing live status and reviewer notes.

### 2. Socioemotional Skills Advisor (Admin)
*   **Dashboard**: High-level statistical cards tracking total, pending, under review, approved, and rejected tickets.
*   **Analytics**: View metrics like absences per month, frequent reasons, and coders with highest absence counts.
*   **Review Control**: Open support documents via modal windows and update ticket statuses while adding performance observation notes.

### 3. Team Leader (TL)
*   **Read-Only Access**: View permissions to check member statuses. (*Full dedicated view coming in future updates*).

---

##  Global Technology Stack

### Frontend
*   **Vite**: Fast frontend build tooling.
*   **Vanilla JS**: Native JavaScript logic following a clean MVC architecture (`views`, `controllers`, `services`, `components`).
*   **TailwindCSS v4**: Modern, utility-first CSS framework for interface styling.
*   **History API**: Native client-side routing equipped with secure role-based guards.
*   **JSON Server**: Temporary mock database engine running on `db.json` for development.

### Backend & Database
*   **FastAPI**: Modern, high-performance web framework for building APIs with Python.
*   **Uvicorn**: Production-ready ASGI web server to run the application.
*   **PostgreSQL**: Relational database management system for persistent production storage.
*   **Psycopg2 (with RealDictCursor)**: PostgreSQL database adapter for Python, returning SQL results as native JSON dictionaries.
*   **Pydantic**: Data validation and settings management using Python type hints.
*   **PyJWT**: Library to encode, sign, and decode JSON Web Tokens (JWT) safely.
*   **Passlib (with Bcrypt)**: High-security password hashing system.
*   **Python-Dotenv**: Cleans and secures environment variables via `.env` files.
*   **Email-Validator**: Strict syntax verification for user email inputs.

---

##  Project Architecture

```text
AFK-Coders/
│
├── Backend/
│   ├── .env                  # Environment variables (Database & JWT secrets)
│   ├── .venv/                # Isolated Python virtual environment
│   └── app/
│       ├── main.py           # App initialization, CORS settings, and router inclusion
│       ├── database.py       # Postgres connections using RealDictCursor
│       ├── security.py       # Bcrypt hashing, JWT handling, and Role-Based Access Control
│       └── routers/
│           ├── auth.py       # Authentication endpoints (Login & Register)
│           └── solicitudes.py # Absence management logic and workflows
│
└── Frontend/
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── controllers/      # App request and workflow logic
    │   ├── services/         # API connection handlers
    │   └── views/            # User screens and interface layouts
    ├── db.json               # Local mock database for json-server testing
    ├── package.json          # Node dependencies and scripts
    └── vite.config.js        # Vite configurations
```

---

##  Getting Started

###  Frontend Setup
1. Navigate to the `Frontend/` folder.
2. Install dependencies and spin up both the Vite client and the mock data server:
```bash
npm install
npm run dev
```
*   **Vite Client Host**: `http://localhost:5173`
*   **Mock Server (JSON Server)**: `http://localhost:3000` (Modifies `db.json`)

####  Mock Credentials (Frontend Testing)

| Role | Email | Password |
|---|---|---|
| Coder | `juan.coder@riwi.io` | `Coder123*` |
| Coder | `maria.coder@riwi.io` | `Coder123*` |
| Socioemotional Advisor | `soc@riwi.io` | `Socio123*` |
| Team Leader | `team.leader@riwi.io` | `Leader123*` |

---

###  Backend Setup

#### 1. Environment Variables Setup
Create a `.env` file inside the root of your `Backend/` folder:
```env
DB_HOST=localhost
DB_NAME=AfkCoders
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5433

JWT_SECRET=riwi_afk
JWT_ALGORITHM=HS256
```

#### 2. Environment Execution
Isolate your environment inside the `Backend/` directory:
```bash
# Create the virtual environment (First time only)
python3 -m venv .venv

# Activate the virtual environment
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

# Install production dependencies
pip install fastapi uvicorn pydantic psycopg2-binary python-dotenv PyJWT passlib[bcrypt] "pydantic[email]"

# Run the development server
uvicorn app.main:app --reload
```
*   **Local Server API URL**: `http://localhost:8000`
*   **Interactive Documentation**: `http://localhost:8000/docs` (Swagger UI tool with security **"Authorize"** configurations).

---

##  Production API Endpoints Summary

###  Authentication Module (`/api/auth`)
*   `POST /api/auth/register`: Registers a new user inside PostgreSQL. Hashes passwords via **Bcrypt**.
*   `POST /api/auth/login`: Verifies user credentials. Returns a signed **JWT token** valid for 8 hours.

### Coder Requests Module (`/api/solicitudes`)
*   `POST /api/solicitudes`: Creates a new absence justification.
    *   **Security:** Requires `Authorization: Bearer <token>` header. Restricted to the `'Coder'` role.
    *   **Payload (JSON Body):**
        ```json
        {
          "categoria_id": 2,
          "fecha_ausencia": "YYYY-MM-DD",
          "motivo_detallado": "Detailed description of the absence",
          "url_soporte": "https://link-to-supporting-document.com"
        }
        ```

### Administrative Module (`/api/admin/solicitudes`)
Restricted to authorized administrative roles. Other roles return a `403 Forbidden` error.

*   `GET /api/admin/solicitudes`: Fetches all submitted tickets ordered by newest first. Runs a relational `JOIN` query to match student details and category labels.
*   `PUT /api/admin/solicitudes/{solicitud_id}`: Updates validation state (`'Aprobada'`, `'Rechazada'`, `'Pendiente'`, or `'Revision'`).
    *   **Payload (JSON Body):**
        ```json
        {
          "estado": "Aprobada", 
          "observaciones_socioemocional": "Valid medical certificate verified."
        }
        ```

---

## User Stories & Feature Scope

This section details the functional scope of the MVP, written in standard Agile formats with their respective acceptance criteria.

### 1. Submit Absence Request (Coder)
*   **User Story:** As a Coder, I want to submit an absence request by uploading a photo of my justification, selecting the date, and adding a description, so that my Team Leader or Advisor can review and validate my absence.

**Acceptance Criteria:**
*   **Given:** The Coder is logged into their dashboard.
*   **When:** They fill out the form with a valid date, category, description, upload the support link or image, and click "Submit".
*   **Then:** The system saves the request with a default status of Pending.

---

### 2. Track Personal Requests (Coder)
*   **User Story:** As a Coder, I want to view a history of all my submitted absence requests alongside their live status and notes, so that I can track whether my absences have been approved, rejected, or are still under review.

**Acceptance Criteria:**
*   **Given:** The Coder is on the My Requests module.
*   **When:** The personal dashboard loads.
*   **Then:** The system fetches and displays only the requests belonging to that specific user.

---

### 3. Review and Update Absence Status (Admin / TL)
*   **User Story:** As a Socioemotional Advisor or Team Leader, I want to view all submitted absence requests in a centralized table and update their status with custom feedback, so that I can process justifications and maintain control over overall team attendance.

**Acceptance Criteria:**
*   **Given:** The user is logged in with an administrative role (Habilidades Socioemocionales).
*   **When:** They open a request, view the support, change status to Approved or Rejected, write feedback, and click save.
*   **Then:** The system updates the status in the database and links the unique ID of the reviewer.

---

### 4. View Statistical Dashboard (Admin / TL)
*   **User Story:** As a Socioemotional Advisor or Team Leader, I want to view high-level statistical charts and metric cards regarding monthly absences and frequent reasons, so that I can identify attendance patterns and prevent user burnout or dropouts proactively.

**Acceptance Criteria:**
*   **Given:** The administrator is on the main dashboard.
*   **When:** The screen loads completely.
*   **Then:** The system displays statistical counters (Total, Pending, Approved, Rejected) and charts detailing absences grouped by month and categories.


---

##  Roadmap / Next Steps
*   **Bridge Integration**: Connect the native vanilla JavaScript `fetch` API commands from the frontend to the live FastAPI services (Migrating away from `json-server`).
*   **Cloud Document Handling**: Integrate cloud storage (e.g., AWS S3) to process actual uploaded image files (`UploadFile`) instead of tracking mock string names.
*   **TL Interface**: Deploy the dedicated view for Team Leaders.
*   **Admin Modules**: Open up CRUD interfaces for Users, Campuses (Sedes), and Programs currently set as placeholders.
