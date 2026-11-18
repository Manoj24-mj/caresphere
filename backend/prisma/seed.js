/**
 * CareSphere PostgreSQL Database Seeder
 * Populates verified baseline data for Bengaluru (active node) and upcoming cities.
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 [CareSphere Seed] Starting database seeding...");

  // 1. Seed Cities
  const cities = [
    { id: "bengaluru", name: "Bengaluru", state: "Karnataka", district: "Bengaluru Urban", status: "active", latitude: 12.9716, longitude: 77.5946 },
    { id: "mysuru", name: "Mysuru", state: "Karnataka", district: "Mysuru", status: "upcoming", latitude: 12.2958, longitude: 76.6394 },
    { id: "mumbai", name: "Mumbai", state: "Maharashtra", district: "Mumbai City", status: "upcoming", latitude: 19.0760, longitude: 72.8777 },
    { id: "delhi", name: "Delhi", state: "Delhi", district: "Central Delhi", status: "upcoming", latitude: 28.6139, longitude: 77.2090 },
    { id: "chennai", name: "Chennai", state: "Tamil Nadu", district: "Chennai", status: "upcoming", latitude: 13.0827, longitude: 80.2707 },
    { id: "hyderabad", name: "Hyderabad", state: "Telangana", district: "Hyderabad", status: "upcoming", latitude: 17.3850, longitude: 78.4867 }
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: city,
      create: city
    });
  }
  console.log(`✅ Seeded ${cities.length} cities.`);

  // 2. Seed Bed Categories
  const bedCategories = [
    { code: "GENERAL", name: "General Bed", description: "Standard ward medical bed" },
    { code: "ICU", name: "Intensive Care Unit", description: "High-acuity critical care with ventilator" },
    { code: "EMERGENCY", name: "Emergency Observation", description: "Immediate acute trauma / triage bed" },
    { code: "PEDIATRIC", name: "Pediatric Bed", description: "Dedicated ward bed for children" },
    { code: "MATERNITY", name: "Maternity / Labor", description: "Obstetric & neonatal delivery bed" },
    { code: "ISOLATION", name: "Infection Isolation", description: "Negative pressure isolation unit" }
  ];

  for (const cat of bedCategories) {
    await prisma.bedCategory.upsert({
      where: { code: cat.code },
      update: cat,
      create: cat
    });
  }
  console.log(`✅ Seeded ${bedCategories.length} bed categories.`);

  // 3. Seed Specializations
  const specializations = [
    { name: "Cardiology" },
    { name: "General Medicine" },
    { name: "Pediatrics" },
    { name: "Orthopedics" },
    { name: "Neurology" },
    { name: "Emergency Medicine" }
  ];

  for (const spec of specializations) {
    await prisma.specialization.upsert({
      where: { name: spec.name },
      update: spec,
      create: spec
    });
  }
  console.log(`✅ Seeded ${specializations.length} medical specializations.`);

  // 4. Seed Verified Hospitals for Bengaluru
  const hospitals = [
    {
      id: "district-general",
      cityId: "bengaluru",
      name: "District General Hospital",
      hospitalType: "Government hospital",
      address: "Victoria Hospital Campus, Fort Road, Bengaluru - 560002",
      locationArea: "Central District, Bengaluru",
      phone: "+91 80 5550 0100",
      emergency24x7: true,
      distanceKm: 2.4,
      status: "Available"
    },
    {
      id: "city-medical",
      cityId: "bengaluru",
      name: "City Medical Centre",
      hospitalType: "Public teaching hospital",
      address: "Malleswaram 18th Cross, Bengaluru - 560055",
      locationArea: "North District, Bengaluru",
      phone: "+91 80 5550 0200",
      emergency24x7: true,
      distanceKm: 5.1,
      status: "Limited"
    },
    {
      id: "community-care",
      cityId: "bengaluru",
      name: "Community Care Hospital",
      hospitalType: "Community health centre",
      address: "Indiranagar 100ft Road, Bengaluru - 560038",
      locationArea: "East District, Bengaluru",
      phone: "+91 80 5550 0300",
      emergency24x7: false,
      distanceKm: 7.8,
      status: "Available"
    }
  ];

  for (const hosp of hospitals) {
    await prisma.hospital.upsert({
      where: { id: hosp.id },
      update: hosp,
      create: hosp
    });
  }
  console.log(`✅ Seeded ${hospitals.length} hospitals for Bengaluru.`);

  // 5. Seed Test Users with Secure Hashes
  const passwordHash = await bcrypt.hash("CareSphere@2026", 10);
  const testUsers = [
    {
      email: "patient@caresphere.gov.in",
      mobile: "+91 98450 12345",
      passwordHash,
      role: "PATIENT",
      cityId: "bengaluru",
      isVerified: true
    },
    {
      email: "dr.priya@dgh.caresphere.gov.in",
      mobile: "+91 80 5550 0110",
      passwordHash,
      role: "DOCTOR",
      cityId: "bengaluru",
      isVerified: true
    },
    {
      email: "staff@dgh.caresphere.gov.in",
      mobile: "+91 80 5550 0120",
      passwordHash,
      role: "HOSPITAL_STAFF",
      cityId: "bengaluru",
      isVerified: true
    },
    {
      email: "admin@caresphere.gov.in",
      mobile: "+91 80 2200 0001",
      passwordHash,
      role: "ADMINISTRATOR",
      cityId: "bengaluru",
      isVerified: true
    }
  ];

  for (const u of testUsers) {
    await prisma.user.upsert({
      where: { mobile: u.mobile },
      update: u,
      create: u
    });
  }
  console.log(`✅ Seeded ${testUsers.length} test accounts (Password: CareSphere@2026).`);

  console.log("🌟 [CareSphere Seed] Database seeding complete.");
}

main()
  .catch(e => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
