# ACME Employee Salary Management System
## Product Requirements Document (PRD)

---

### 1. Context & Business Goal
**ACME Corp** manages salary data for **10,000 employees** across multiple international locations using fragmented, static Excel spreadsheets. This spreadsheet-reliant process creates data lag, lacks auditability, and makes strategic compensation analysis tedious and error-prone for leadership.

**Goal**: Build a modern, web-based Employee Salary Management System empowering the **HR Manager** to manage employee compensation records effortlessly, **upload & import bulk employee datasets via CSV**, authenticate securely, access **interactive Swagger API documentation**, and **answer strategic questions about how ACME pays its people** across departments, job roles, and geographic regions.

---

### 2. HR Persona & Key Business Questions Answered

#### **Target User Persona**: HR Manager
Needs secure, role-restricted visibility into compensation metrics, salary parity, regional pay differences, and department budget allocations across 10,000 employees.

#### **Strategic Questions the App Answers**:
1. **Total Payroll Liability**: *"What is ACME’s total annual payroll commitment across all 10,000 employees?"*
2. **Departmental Budget Consumption**: *"Which departments consume the largest portion of our overall salary budget?"*
3. **Regional Pay Parity**: *"How does the average compensation in Engineering or Sales compare across different operating countries?"*
4. **Compensation Outliers**: *"What are the min, max, and median salary figures within specific departments?"*
5. **Filtered Sub-Aggregations**: *"What is the average salary of employees in 'Marketing' located in 'Germany'?"*

---

### 3. Application Architecture & Module Breakdown

#### **A. Backend Modules (Ruby on Rails API)**
* **`Authentication & RBAC` Module**: User login/token authentication, password hashing (Bcrypt), and role-based access enforcement (`hr_manager`, `admin`).
* **`Bulk Import Engine` Module**: `CsvImportService` processing uploaded CSV files with header validation, batch processing (`find_in_batches`), row-level error reporting, and bulk database insertion (`insert_all`).
* **`Employees API` Module**: RESTful endpoints (`index`, `show`, `update`, `destroy`). Contains query scope filters (`country`, `department`, `min_salary`, `max_salary`, `search`).
* **`Salary Analytics Engine`**: Executes single-query SQL aggregations (`SUM`, `AVG`, `PERCENTILE`, `GROUP BY`) to compute executive metrics over 10,000 records.
* **`Swagger / OpenAPI API Documentation` Module**: Interactive API UI (`/api-docs` endpoint generated via Rails `rswag` / OpenAPI 3.0 spec) detailing all REST endpoints, request/response schemas, and JWT headers.
* **`Bulk Database Seeder` Module**: Seed script using bulk ActiveRecord operations (`insert_all`) to instantly seed 10,000 initial benchmark employee records.
* **`Core Serialization & Validation` Module**: Standardizes API payload schemas, pagination headers, and validation error messages.

#### **B. Frontend Modules (React + Vite)**
* **`Authentication & Session` Module**: Login view (`LoginForm`), token storage (localStorage/session), protected route wrappers (`ProtectedRoute`), and user session header.
* **`Bulk Data Import` Module**: Drag-and-drop CSV upload modal (`CsvUploadModal`), upload progress bar, and row validation error preview table.
* **`Analytics & Executive BI` Module**:
  * *Metric Summary Cards*: Total Payroll, Average Salary, Median Salary, Employee Count.
  * *Visual Analytics Charts*: Salary Distribution by Country (Bar Chart) & Department Budget Allocation (Pie/Donut Chart).
* **`Employee Directory` Module**:
  * *Paginated Table*: High-performance data grid with sortable columns (`Name`, `Department`, `Country`, `Salary`).
  * *Filter Toolbar*: Multi-criteria dropdowns (Country, Department), salary range inputs, and debounced search.
  * *Pagination Bar*: Server-driven page controls (`Page X of Y`, records per page selector).
* **`Employee Profile & Editor` Module**:
  * *Detail Drawer/Modal*: Complete employee compensation breakdown.
  * *Edit Form Modal*: Validated form to update employee salary or department with instant UI sync.

---

### 4. Scope Decisions & Technical Rationale

| Feature | Scope Status | Engineering Rationale |
| :--- | :--- | :--- |
| **User Authentication & RBAC** | **IN SCOPE (MVP)** | Implements JWT-based auth and role checks to secure HR salary data against unauthorized access. |
| **CSV / Excel Bulk Import** | **IN SCOPE (MVP)** | Provides HR managers a drag-and-drop CSV uploader with batch validation to import large employee datasets seamlessly. |
| **Swagger / OpenAPI Documentation** | **IN SCOPE (MVP)** | Serves interactive API documentation at `/api-docs` using Rails `rswag` for API exploration and developer testing. |
| **High-Speed Database Seeding** | **IN SCOPE (MVP)** | Uses Rails `insert_all` to seed 10,000 realistic benchmark records in < 2 seconds for testing & demo readiness. |
| **Gross Salary Management** | **IN SCOPE (MVP)** | Focuses on annual base salary, department allocations, and regional pay parity analysis. |
| **Taxation & Net Pay Engine** | **OUT OF SCOPE** | Calculating country-specific income taxes and social security withholdings across multiple nations is compliance-heavy and irrelevant to HR compensation analysis. |
| **Multi-Currency Real-Time FX** | **OUT OF SCOPE** | All salaries normalized to USD in MVP to keep aggregate SQL queries (`SUM`, `AVG`) deterministic and fast. |

---

### 5. Technical Constraints & Non-Functional Requirements

* **Dataset Scale**: 10,000 employee records supported via database seed and CSV bulk import.
* **Security SLA**: Protected API endpoints requiring valid JWT Authorization header.
* **API Documentation**: OpenAPI 3.0 / Swagger UI hosted live at `/api-docs`.
* **API Latency SLA**: Response time `< 100ms` for paginated list queries and analytics aggregations.
* **Database Indexes**: Required B-Tree indexes on `country`, `department`, `salary`, and `name`.
* **Testing Standards**: Deterministic unit & API controller tests (RSpec/Minitest) covering authentication, CSV parsing, query scopes, and aggregation logic.
