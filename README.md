# CareSphere

**AI-Powered, City-Based Integrated Government Healthcare Resource Management and Assistance Platform**

CareSphere connects citizens, healthcare providers, blood banks, pharmacies, and emergency services into one unified healthcare system. The platform is initially centered on **Bengaluru** as the active healthcare node, with an expandable multi-city architecture.

---

## 1. Project Architecture

CareSphere comprises a modern frontend SPA and an enterprise-grade RESTful backend service:

```
CareSphere/
├── index.html                   # Main frontend SPA application (7 Core Services)
├── logo-animation.html          # Animated 8-node circular healthcare network visualizer
├── onboarding.html              # Standalone role onboarding & setup wizard
├── assets/                      # Intelligent 3D User Guide, Localization, Theme CSS
├── features/                    # Standalone client service showcase pages
│
└── backend/                     # Complete Node.js & Express RESTful API Service
    ├── prisma/
    │   ├── schema.prisma        # Normalized PostgreSQL relational schema (Prisma ORM)
    │   └── seed.js              # Database seeder for Bengaluru baseline data
    ├── src/
    │   ├── config/database.js   # Prisma connection manager & diagnostics
    │   ├── controllers/         # Domain controllers (Auth, Hospitals, Beds, etc.)
    │   ├── middleware/          # JWT authentication, RBAC, error & audit logging
    │   ├── routes/              # Express API endpoints for all 7 services
    │   ├── services/store.js    # Verified Bengaluru seed store & fallback adapter
    │   ├── app.js               # Express app (Helmet, CORS, Morgan)
    │   └── server.js            # Server listener with graceful shutdown
    ├── tests/api.test.js        # Automated integration test suite (10/10 passing)
    ├── CareSphere_API.postman_collection.json # Ready-to-import Postman collection
    ├── .env.example             # Environment configuration template
    └── package.json             # Backend dependencies & npm scripts
```

---

## 2. The Seven Core Services

1. **Hospital Availability:** Directory of registered hospitals, facilities, addresses, and contacts in the selected city.
2. **Bed Availability:** Real-time capacity meters for **General**, **ICU**, and **Emergency** beds with occupancy tracking.
3. **Doctor Availability:** Specialists searchable by discipline, hospital affiliation, working hours, and consultation booking.
4. **Blood Availability:** Stock tracking by blood group (`A+`, `A−`, `B+`, `B−`, `AB+`, `AB−`, `O+`, `O−`) with donor compatibility.
5. **Medicine Availability:** Pharmacy drug inventory across registered hospital pharmacies and Jan Aushadhi Kendras.
6. **Ambulance Services:** Emergency response fleet directory (ALS/BLS), 24/7 hotline dialers, and dispatch tracking.
7. **Medical Records Management:** Private-by-default personal health vault with encrypted document uploads and 6-digit temporary clinician access passes.

---

## 3. Getting Started

### Running the Frontend
The frontend requires no build step and can be opened directly:
- Open [`index.html`](./index.html) in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox).
- For the animated brand introduction, open [`logo-animation.html`](./logo-animation.html).
- For feature-specific tours, open [`features/index.html`](./features/index.html).

### Running the Backend Server
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# (Optional) Configure PostgreSQL in .env
cp .env.example .env

# Validate Prisma schema
npm run prisma:validate

# Generate Prisma Client
npm run prisma:generate

# Start the Express API server
npm start
```
The backend API starts on `http://localhost:5000`.  
Health check endpoint: `http://localhost:5000/api/health`

---

## 4. Testing & Verification

### Run Backend Tests (10/10 Passing)
```bash
cd backend
npm test
```
Verifies server health, city filtering, 7 core service queries, patient registration, JWT authentication, and RBAC security rules.

### Run Frontend Unit Tests (4/4 Passing)
```bash
node assets/predictai-core.test.js
```
Verifies core CSV observation parsing, schema checks, and column validation.

### API Testing with Postman
Import `backend/CareSphere_API.postman_collection.json` into Postman to test all endpoints with preconfigured request bodies and query parameters.
