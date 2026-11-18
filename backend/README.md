# CareSphere Backend — Phase 1: PostgreSQL & Express API Service

**Platform:** CareSphere – AI-Powered, City-Based Integrated Government Healthcare Resource Management and Assistance Platform  
**Initial City:** Bengaluru (Active Node), structured for multi-city expansion.  
**Tech Stack:** Node.js, Express.js, PostgreSQL, Prisma ORM, JWT, Bcrypt.

---

## 1. Directory Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Complete normalized relational Prisma schema
│   └── seed.js             # Initial database seeder for Bengaluru & cities
├── src/
│   ├── config/
│   │   └── database.js     # Prisma connection manager with fallback
│   ├── controllers/        # Domain controllers (Auth, Hospitals, Beds, etc.)
│   ├── middleware/         # Auth (JWT & RBAC), Error handler, Audit logging
│   ├── routes/             # Express route endpoints for all 7 core services
│   ├── services/
│   │   └── store.js        # Baseline verified Bengaluru dataset
│   ├── utils/              # Standardized API response helpers
│   ├── app.js              # Express app configuration (Helmet, CORS, Morgan)
│   └── server.js           # Server entry point & graceful shutdown
├── tests/
│   └── api.test.js         # Automated integration test suite (10/10 passing)
├── .env.example            # Environment variables template
├── .env                    # Local environment configuration
└── package.json            # Project manifest & npm scripts
```

---

## 2. Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested with v24.21.0)
- **PostgreSQL**: v14.0 or higher (optional for mock dev mode; required for persistent storage)

### Installation
```bash
cd backend
npm install
```

### Configure Environment Variables
Copy `.env.example` to `.env` and configure your PostgreSQL database credentials:
```bash
cp .env.example .env
```
Default connection string:
```ini
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/caresphere?schema=public"
JWT_SECRET="caresphere-dev-secret-key-32chars-min-security-test"
PORT=5000
```

### Database Operations (with PostgreSQL running)
```bash
# Validate schema
npm run prisma:validate

# Generate Prisma Client
npm run prisma:generate

# Apply migrations
npm run prisma:migrate

# Seed database with baseline Bengaluru verified data
npm run seed
```

### Run the Server
```bash
# Start server
npm start
```
The server will start on `http://localhost:5000`.

---

## 3. Running Automated Tests

Run the comprehensive test suite verifying server startup, health checks, city filtering, 7 core service queries, authentication, and role-based access control:

```bash
npm test
```

Test Results: **10/10 Suites Passing**.

---

## 4. API Endpoints Reference

### Health & System
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status & active node | None |

### City Management
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cities` | List active and upcoming healthcare cities | None |
| `GET` | `/api/cities/:cityId` | City profile & summary resource counts | None |

### 1. Hospital Availability
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/hospitals` | List hospitals (`?city=bengaluru&facility=ICU&query=...`) | None |
| `GET` | `/api/hospitals/:id` | Detailed hospital profile & attached doctors | None |

### 2. Bed Availability
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/beds` | Live bed availability by city (`?city=bengaluru&type=ICU`) | None |
| `PATCH` | `/api/beds/update` | Update bed counts | `HOSPITAL_STAFF`, `ADMIN` |

### 3. Doctor Availability
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/doctors` | List doctors by city and specialty | None |
| `GET` | `/api/doctors/:id` | Doctor profile and hospital affiliation | None |
| `POST` | `/api/appointments` | Request consultation appointment | Optional |
| `GET` | `/api/appointments/my` | View patient's booked appointments | `PATIENT` |

### 4. Blood Availability
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/blood-inventory` | Blood bank stock by group (`?city=bengaluru&group=O+`) | None |
| `PATCH` | `/api/blood-inventory/update` | Update blood stock units | `BLOOD_BANK_STAFF`, `ADMIN` |

### 5. Medicine Availability
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/medicines` | Search essential medicine inventory | None |
| `PATCH` | `/api/medicines/inventory/update` | Update pharmacy stock status | `SUPPLIER`, `ADMIN` |

### 6. Ambulance Services
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/ambulances` | Available ambulance units in city | None |
| `POST` | `/api/ambulances/requests` | Emergency ambulance dispatch request | Optional |
| `GET` | `/api/ambulances/requests/:id/tracking` | Track active dispatch & ETA | None |

### 7. Medical Records Management Vault
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/medical-records/me` | Patient private health vault | `PATIENT` (Private) |
| `POST` | `/api/medical-records/documents` | Upload diagnostic document metadata | `PATIENT` |
| `POST` | `/api/medical-records/access-pass/generate` | Generate 6-digit temporary clinician pass | `PATIENT` |
| `POST` | `/api/medical-records/access-pass/verify` | Doctor verify pass to unlock records | `DOCTOR` |
| `POST` | `/api/medical-records/access-pass/revoke` | Revoke active clinician pass | `PATIENT` |
| `GET` | `/api/prescriptions/my` | View patient active prescriptions | `PATIENT` |

### Authentication & Users
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | None |
| `POST` | `/api/auth/login` | Login with mobile/email & password | None |
| `GET` | `/api/auth/me` | Current authenticated user profile | Authenticated |
| `POST` | `/api/auth/logout` | Invalidate session | Authenticated |
| `GET` | `/api/users/profile` | View profile details | Authenticated |
| `PUT` | `/api/users/profile` | Update profile information | Authenticated |
