# Intelligent DevSecOps Pipeline Security & Reliability Platform

## Overview
This repository contains the foundation for an **Intelligent DevSecOps Pipeline Security & Reliability Platform**.
Currently implemented: **Phase 1 — MERN Application Foundation**.

Phase 1 provides the target **Task & Project Management Application** that our automated DevSecOps CI/CD pipeline (Docker, SonarQube, Gitleaks, Trivy, Kubernetes, AI Analysis, and Finding Correlation) will monitor, scan, test, and protect in subsequent phases.

---

## Tech Stack (Phase 1)

- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router v6, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, express-validator
- **Testing**: Jest, Supertest, mongodb-memory-server (In-memory DB for automated zero-dependency CLI test execution)
- **Version Control**: Git, Clean REST API, environment variable configuration

---

## Directory Structure

```text
devsecops/
├── client/                 # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── api/            # Axios API services (authApi.js, taskApi.js)
│   │   ├── components/     # UI Components (Navbar, TaskCard, TaskModal, TaskFilter, PrivateRoute)
│   │   ├── context/        # AuthContext state management
│   │   ├── pages/          # Login, Register, Dashboard, Tasks
│   │   ├── App.jsx         # App router configuration
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Tailwind CSS directives
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express REST API Backend
│   ├── src/
│   │   ├── config/         # Database connection (db.js)
│   │   ├── controllers/    # Auth and Task controllers
│   │   ├── middleware/     # Auth, Validation, and Central Error Handler
│   │   ├── models/         # User and Task Mongoose schemas
│   │   ├── routes/         # Auth and Task route definitions
│   │   ├── app.js          # Express app instance
│   │   └── server.js       # HTTP server listener
│   ├── tests/              # Jest + Supertest integration tests
│   │   ├── auth.test.js
│   │   └── task.test.js
│   ├── .env.example
│   ├── .env
│   ├── jest.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register new user account.
- `POST /api/auth/login`: Authenticate user and return JWT.
- `GET /api/auth/me`: Get current authenticated user details.

### Tasks (User Protected & Scoped)
- `POST /api/tasks`: Create a new task (`title`, `description`, `status`, `priority`, `dueDate`).
- `GET /api/tasks`: Get user tasks (supports filters: `status`, `priority`, `search`).
- `GET /api/tasks/stats`: Get dashboard task statistics (Total, Todo, In Progress, Completed, High Priority).
- `GET /api/tasks/:id`: Get task by ID.
- `PUT /api/tasks/:id`: Update task properties.
- `PATCH /api/tasks/:id/status`: Update task status (`TODO`, `IN_PROGRESS`, `COMPLETED`).
- `DELETE /api/tasks/:id`: Delete task.

---

## Running Automated Tests

Zero external setup required! Automated tests run using an in-memory MongoDB server:

```bash
cd server
npm test
```

---

## Running the Application Locally

### 1. Backend Server
```bash
cd server
npm run dev
```
Runs on `http://localhost:5000`.

### 2. Frontend Client
```bash
cd client
npm run dev
```
Runs on `http://localhost:5173`.
