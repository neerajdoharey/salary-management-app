# Salary Management Application

A full-stack multi-tenant salary management platform with executive compensation analytics, employee directory management, CSV bulk streaming imports with background job processing, and role-based access control (RBAC).

---

## Architecture Overview

- **Backend**: Ruby on Rails 8 (API mode) with SQLite, Solid Queue for asynchronous job processing, Action Mailer with Letter Opener, Mission Control Jobs UI, and Swagger OpenAPI documentation.
- **Frontend**: React 19 SPA powered by Vite, Tailwind CSS v4, Lucide React icons, and Recharts analytics visualizations.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend: How to Run Rails Server](#1-backend-how-to-run-rails-server)
3. [Frontend: How to Build & Run React App](#2-frontend-how-to-build--run-react-app)
4. [API Documentation (`/api-docs`)](#3-how-to-access-api-documentation)
5. [Mission Control Jobs UI (`/jobs`) & Credentials](#4-how-to-access-mission-control-jobs-ui--credentials)
6. [How to Run Tests](#5-how-to-run-tests)
7. [Default Seed Credentials & RBAC Roles](#6-default-seed-credentials--rbac-roles)

---

## Prerequisites

- **Ruby**: `3.4.x` (managed via `rbenv` or `rvm`)
- **Bundler**: `2.x`
- **Node.js**: `>= 18.x` (LTS recommended)
- **npm**: `>= 9.x`

---

## 1. Backend: How to Run Rails Server

Navigate to the `backend/` directory from the repository root:

```bash
cd backend
```

### Install Dependencies
```bash
bundle install
```

### Setup Database & Seed Data
Initialize the database and populate default tenants, users, and 10,000 employee records:

```bash
bin/rails db:prepare
bin/rails db:seed
```

### Start the Rails API Server
```bash
bin/rails server
```
- The backend server starts at **`http://localhost:3000`**.
- Solid Queue background jobs run in Puma automatically.
- Email deliveries in development are intercepted and previewed locally in your browser via `letter_opener`.

---

## 2. Frontend: How to Build & Run React App

Navigate to the `frontend/` directory from the repository root:

```bash
cd frontend
```

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
- The React application will be available at **`http://localhost:5173`**.
- Vite automatically proxies `/api/*` network requests to the Rails server at `http://localhost:3000`.

### Build for Production
To generate an optimized production bundle:
```bash
npm run build
```
- Assets are compiled to `frontend/dist/`.

### Preview Production Build
To preview the compiled production build locally:
```bash
npm run preview
```

---

## 3. How to Access API Documentation

Interactive Swagger / OpenAPI 3.0 documentation is powered by `rswag` and mounted on the Rails server.

- **URL**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Features**:
  - Full API endpoint specifications (`/api/v1/*`).
  - Interactive "Try it out" console to send live requests.
  - JWT Bearer Token authorization header support (`Bearer <signed_token>`).

---

## 4. How to Access Mission Control Jobs UI & Credentials

Mission Control Jobs provides real-time monitoring and management for Solid Queue background processes (including bulk employee CSV imports).

- **URL**: [http://localhost:3000/jobs](http://localhost:3000/jobs)
- **Authentication**: Protected by HTTP Basic Authentication. When accessing `/jobs` in your browser, enter either of the following credential pairs:

### Option A: Configured Admin Credentials (Default)
| Parameter | Value |
| :--- | :--- |
| **Username** | `admin` *(configurable via `MISSION_CONTROL_USER` environment variable)* |
| **Password** | `Password@12345` *(configurable via `MISSION_CONTROL_PASSWORD` environment variable)* |

### Option B: Database Admin Account
| Parameter | Value |
| :--- | :--- |
| **Username** | `hr@acme.com` |
| **Password** | `Password@12345` |

> **Note**: Users with the `hr_manager` role (such as `hrmanager@acme.com`) are restricted from accessing `/jobs` and will receive `401 Unauthorized`.

---

## 5. How to Run Tests

### Backend Rails Test Suite

Run the full Minitest test suite (controller tests, integration tests, background job tests, model validations):

```bash
cd backend
bin/rails test
```

#### Run Specific Test Files
- **Mission Control Jobs Authentication**:
  ```bash
  bin/rails test test/integration/mission_control_jobs_authentication_test.rb
  ```
- **RBAC User CRUD & Permissions**:
  ```bash
  bin/rails test test/controllers/api/v1/users_controller_test.rb
  ```
- **Bulk CSV Import Job with Log Dispatch**:
  ```bash
  bin/rails test test/jobs/bulk_import_employees_job_test.rb
  ```
- **Employee CRUD API**:
  ```bash
  bin/rails test test/controllers/api/v1/employees_controller_test.rb
  ```

---

### Frontend Validation & Linting

```bash
cd frontend
```

- **Run Linter**:
  ```bash
  npm run lint
  ```
- **Run Production Build Verification**:
  ```bash
  npm run build
  ```

---

## 6. Default Seed Credentials & RBAC Roles

When the database is seeded (`bin/rails db:seed`), two user accounts are created with predefined Role-Based Access Control permissions:

| Email | Password | Role | Permissions |
| :--- | :--- | :--- | :--- |
| **`hr@acme.com`** | `Password@12345` | `admin` | **Full access**: Dashboard, Employee Directory, Bulk CSV Import, Salary Analytics, Team & RBAC User Management (`/admin/users`), and Mission Control Jobs (`/jobs`). |
| **`hrmanager@acme.com`** | `Password@12345` | `hr_manager` | **Operational access**: Dashboard, Employee Directory, Bulk CSV Import, and Salary Analytics. Restricted from user CRUD (`/admin/users`) and `/jobs`. |
