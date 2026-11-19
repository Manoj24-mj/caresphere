-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'DOCTOR', 'NURSE', 'HOSPITAL_STAFF', 'BLOOD_BANK_STAFF', 'AMBULANCE_STAFF', 'SUPPLIER', 'GOVERNMENT', 'ADMINISTRATOR');

-- CreateEnum
CREATE TYPE "BedCategoryCode" AS ENUM ('GENERAL', 'ICU', 'EMERGENCY', 'PEDIATRIC', 'MATERNITY', 'ISOLATION');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('AVAILABLE', 'LIMITED', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "AmbulanceType" AS ENUM ('ADVANCED_LIFE_SUPPORT', 'BASIC_LIFE_SUPPORT', 'PATIENT_TRANSPORT');

-- CreateEnum
CREATE TYPE "AmbulanceStatus" AS ENUM ('AVAILABLE', 'ON_TRIP', 'MAINTENANCE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "EmergencyRequestStatus" AS ENUM ('REQUESTED', 'DISPATCHED', 'EN_ROUTE', 'ARRIVED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('DIAGNOSIS', 'PRESCRIPTION', 'LAB_REPORT', 'CONSULTATION', 'DISCHARGE_SUMMARY', 'IMMUNIZATION');

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(150),
    "mobile" VARCHAR(20) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'PATIENT',
    "cityId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" VARCHAR(30),
    "address" TEXT NOT NULL,
    "pinCode" VARCHAR(10) NOT NULL,
    "profilePhotoUrl" VARCHAR(500),
    "preferredLanguage" VARCHAR(20) NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospitals" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "hospitalType" VARCHAR(100) NOT NULL,
    "address" TEXT NOT NULL,
    "locationArea" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "emergency24x7" BOOLEAN NOT NULL DEFAULT true,
    "distanceKm" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Available',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hospitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospital_facilities" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "hospital_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospital_staff" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employeeId" VARCHAR(100) NOT NULL,
    "designation" VARCHAR(100) NOT NULL,
    "department" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bed_categories" (
    "id" TEXT NOT NULL,
    "code" "BedCategoryCode" NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "bed_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bed_availabilities" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "availableBeds" INTEGER NOT NULL DEFAULT 0,
    "totalCapacity" INTEGER NOT NULL DEFAULT 0,
    "occupiedBeds" INTEGER NOT NULL DEFAULT 0,
    "updatedByUserId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bed_availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bed_availability_histories" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "availableBeds" INTEGER NOT NULL,
    "totalCapacity" INTEGER NOT NULL,
    "occupiedBeds" INTEGER NOT NULL,
    "changedByUserId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bed_availability_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specializations" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "specializations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "hospitalId" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "qualification" VARCHAR(200) NOT NULL,
    "department" VARCHAR(150) NOT NULL,
    "workingHours" VARCHAR(100) NOT NULL,
    "status" VARCHAR(100) NOT NULL DEFAULT 'Appointments available',
    "distanceKm" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_schedules" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" VARCHAR(10) NOT NULL,
    "endTime" VARCHAR(10) NOT NULL,
    "slotDurationMinutes" INTEGER NOT NULL DEFAULT 15,
    "maxAppointments" INTEGER NOT NULL DEFAULT 20,

    CONSTRAINT "doctor_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_requests" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "timeSlot" VARCHAR(50) NOT NULL,
    "reason" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointment_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_banks" (
    "id" TEXT NOT NULL,
    "hospitalId" TEXT,
    "cityId" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "locationArea" VARCHAR(150) NOT NULL,
    "address" TEXT NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blood_banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_inventories" (
    "id" TEXT NOT NULL,
    "bloodBankId" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "availableUnits" INTEGER NOT NULL DEFAULT 0,
    "status" "StockStatus" NOT NULL DEFAULT 'AVAILABLE',
    "updatedByUserId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blood_inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_inventory_histories" (
    "id" TEXT NOT NULL,
    "bloodBankId" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "units" INTEGER NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "changedByUserId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blood_inventory_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicines" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "genericName" VARCHAR(150),
    "strength" VARCHAR(50) NOT NULL,
    "dosageForm" VARCHAR(50) NOT NULL,
    "category" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicine_inventories" (
    "id" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "providerName" VARCHAR(200) NOT NULL,
    "providerType" VARCHAR(100) NOT NULL,
    "locationArea" VARCHAR(150) NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "stockStatus" "StockStatus" NOT NULL DEFAULT 'AVAILABLE',
    "quantityDescription" VARCHAR(100) NOT NULL,
    "updatedByUserId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicine_inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicine_inventory_histories" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "stockStatus" "StockStatus" NOT NULL,
    "quantityDescription" VARCHAR(100) NOT NULL,
    "changedByUserId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicine_inventory_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ambulance_providers" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "baseLocation" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ambulance_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ambulances" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "type" "AmbulanceType" NOT NULL DEFAULT 'BASIC_LIFE_SUPPORT',
    "status" "AmbulanceStatus" NOT NULL DEFAULT 'AVAILABLE',
    "distanceKm" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "etaMinutes" INTEGER NOT NULL DEFAULT 10,
    "currentLat" DOUBLE PRECISION,
    "currentLng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ambulances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ambulance_requests" (
    "id" TEXT NOT NULL,
    "patientId" TEXT,
    "ambulanceId" TEXT,
    "destinationHospitalId" TEXT,
    "pickupAddress" TEXT NOT NULL,
    "emergencyType" VARCHAR(100) NOT NULL,
    "contactPhone" VARCHAR(30) NOT NULL,
    "patientName" VARCHAR(150),
    "notes" TEXT,
    "status" "EmergencyRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ambulance_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_medical_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bloodGroup" VARCHAR(10),
    "allergies" TEXT,
    "chronicConditions" TEXT,
    "emergencyContactName" VARCHAR(150),
    "emergencyContactPhone" VARCHAR(30),
    "emergencyContactRelation" VARCHAR(50),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_medical_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_records" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "recordType" "RecordType" NOT NULL,
    "facilityName" VARCHAR(200) NOT NULL,
    "doctorName" VARCHAR(150),
    "recordDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "summary" TEXT,
    "detailsJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" TEXT NOT NULL,
    "recordId" TEXT,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "medicationName" VARCHAR(150) NOT NULL,
    "strength" VARCHAR(50) NOT NULL,
    "form" VARCHAR(50) NOT NULL,
    "dosage" VARCHAR(100) NOT NULL,
    "instructions" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'Active',
    "prescribedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_documents" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "storagePath" VARCHAR(500) NOT NULL,
    "fileSize" VARCHAR(50) NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "accessLevel" VARCHAR(50) NOT NULL DEFAULT 'PROTECTED',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medical_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_record_accesses" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "accessPassCode" VARCHAR(20) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "medical_record_accesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" VARCHAR(100) NOT NULL,
    "resourceType" VARCHAR(100) NOT NULL,
    "resourceId" VARCHAR(100),
    "ipAddress" VARCHAR(45),
    "userAgent" VARCHAR(255),
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cities_status_idx" ON "cities"("status");

-- CreateIndex
CREATE INDEX "cities_state_district_idx" ON "cities"("state", "district");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_cityId_idx" ON "users"("cityId");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE INDEX "hospitals_cityId_idx" ON "hospitals"("cityId");

-- CreateIndex
CREATE INDEX "hospitals_status_idx" ON "hospitals"("status");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_facilities_hospitalId_name_key" ON "hospital_facilities"("hospitalId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_staff_userId_key" ON "hospital_staff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "bed_categories_code_key" ON "bed_categories"("code");

-- CreateIndex
CREATE INDEX "bed_availabilities_hospitalId_idx" ON "bed_availabilities"("hospitalId");

-- CreateIndex
CREATE INDEX "bed_availabilities_categoryId_idx" ON "bed_availabilities"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "bed_availabilities_hospitalId_categoryId_key" ON "bed_availabilities"("hospitalId", "categoryId");

-- CreateIndex
CREATE INDEX "bed_availability_histories_hospitalId_timestamp_idx" ON "bed_availability_histories"("hospitalId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "specializations_name_key" ON "specializations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");

-- CreateIndex
CREATE INDEX "doctors_hospitalId_idx" ON "doctors"("hospitalId");

-- CreateIndex
CREATE INDEX "doctors_specializationId_idx" ON "doctors"("specializationId");

-- CreateIndex
CREATE INDEX "doctor_schedules_doctorId_dayOfWeek_idx" ON "doctor_schedules"("doctorId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "appointment_requests_patientId_idx" ON "appointment_requests"("patientId");

-- CreateIndex
CREATE INDEX "appointment_requests_doctorId_appointmentDate_idx" ON "appointment_requests"("doctorId", "appointmentDate");

-- CreateIndex
CREATE INDEX "blood_banks_cityId_idx" ON "blood_banks"("cityId");

-- CreateIndex
CREATE INDEX "blood_inventories_bloodBankId_idx" ON "blood_inventories"("bloodBankId");

-- CreateIndex
CREATE INDEX "blood_inventories_bloodGroup_idx" ON "blood_inventories"("bloodGroup");

-- CreateIndex
CREATE UNIQUE INDEX "blood_inventories_bloodBankId_bloodGroup_key" ON "blood_inventories"("bloodBankId", "bloodGroup");

-- CreateIndex
CREATE INDEX "blood_inventory_histories_bloodBankId_timestamp_idx" ON "blood_inventory_histories"("bloodBankId", "timestamp");

-- CreateIndex
CREATE INDEX "medicines_name_idx" ON "medicines"("name");

-- CreateIndex
CREATE INDEX "medicine_inventories_cityId_idx" ON "medicine_inventories"("cityId");

-- CreateIndex
CREATE INDEX "medicine_inventories_medicineId_idx" ON "medicine_inventories"("medicineId");

-- CreateIndex
CREATE INDEX "medicine_inventories_stockStatus_idx" ON "medicine_inventories"("stockStatus");

-- CreateIndex
CREATE INDEX "medicine_inventory_histories_inventoryId_timestamp_idx" ON "medicine_inventory_histories"("inventoryId", "timestamp");

-- CreateIndex
CREATE INDEX "ambulance_providers_cityId_idx" ON "ambulance_providers"("cityId");

-- CreateIndex
CREATE INDEX "ambulances_cityId_idx" ON "ambulances"("cityId");

-- CreateIndex
CREATE INDEX "ambulances_status_idx" ON "ambulances"("status");

-- CreateIndex
CREATE INDEX "ambulance_requests_status_idx" ON "ambulance_requests"("status");

-- CreateIndex
CREATE INDEX "ambulance_requests_requestedAt_idx" ON "ambulance_requests"("requestedAt");

-- CreateIndex
CREATE UNIQUE INDEX "patient_medical_profiles_userId_key" ON "patient_medical_profiles"("userId");

-- CreateIndex
CREATE INDEX "medical_records_patientId_recordDate_idx" ON "medical_records"("patientId", "recordDate");

-- CreateIndex
CREATE INDEX "prescriptions_patientId_idx" ON "prescriptions"("patientId");

-- CreateIndex
CREATE INDEX "medical_documents_patientId_idx" ON "medical_documents"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "medical_record_accesses_accessPassCode_key" ON "medical_record_accesses"("accessPassCode");

-- CreateIndex
CREATE INDEX "medical_record_accesses_accessPassCode_idx" ON "medical_record_accesses"("accessPassCode");

-- CreateIndex
CREATE INDEX "medical_record_accesses_patientId_idx" ON "medical_record_accesses"("patientId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitals" ADD CONSTRAINT "hospitals_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospital_facilities" ADD CONSTRAINT "hospital_facilities_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospital_staff" ADD CONSTRAINT "hospital_staff_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospital_staff" ADD CONSTRAINT "hospital_staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bed_availabilities" ADD CONSTRAINT "bed_availabilities_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bed_availabilities" ADD CONSTRAINT "bed_availabilities_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "bed_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bed_availability_histories" ADD CONSTRAINT "bed_availability_histories_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bed_availability_histories" ADD CONSTRAINT "bed_availability_histories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "bed_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "specializations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_requests" ADD CONSTRAINT "appointment_requests_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_requests" ADD CONSTRAINT "appointment_requests_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_requests" ADD CONSTRAINT "appointment_requests_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_banks" ADD CONSTRAINT "blood_banks_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_banks" ADD CONSTRAINT "blood_banks_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_inventories" ADD CONSTRAINT "blood_inventories_bloodBankId_fkey" FOREIGN KEY ("bloodBankId") REFERENCES "blood_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_inventory_histories" ADD CONSTRAINT "blood_inventory_histories_bloodBankId_fkey" FOREIGN KEY ("bloodBankId") REFERENCES "blood_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_inventories" ADD CONSTRAINT "medicine_inventories_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_inventories" ADD CONSTRAINT "medicine_inventories_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_inventory_histories" ADD CONSTRAINT "medicine_inventory_histories_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "medicine_inventories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambulance_providers" ADD CONSTRAINT "ambulance_providers_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambulances" ADD CONSTRAINT "ambulances_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ambulance_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambulances" ADD CONSTRAINT "ambulances_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambulance_requests" ADD CONSTRAINT "ambulance_requests_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambulance_requests" ADD CONSTRAINT "ambulance_requests_ambulanceId_fkey" FOREIGN KEY ("ambulanceId") REFERENCES "ambulances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambulance_requests" ADD CONSTRAINT "ambulance_requests_destinationHospitalId_fkey" FOREIGN KEY ("destinationHospitalId") REFERENCES "hospitals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_medical_profiles" ADD CONSTRAINT "patient_medical_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "medical_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_documents" ADD CONSTRAINT "medical_documents_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_record_accesses" ADD CONSTRAINT "medical_record_accesses_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_record_accesses" ADD CONSTRAINT "medical_record_accesses_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
