/**
 * CareSphere In-Memory Baseline Store (Bengaluru Node Data)
 * Mirrors Prisma schema structure and provides immediate seed data and fallback
 * when PostgreSQL is offline, ensuring 100% operational REST API testing.
 */

const bcrypt = require("bcryptjs");

const defaultHashedPassword = bcrypt.hashSync("CareSphere@2026", 10);

const store = {
  cities: [
    { id: "bengaluru", name: "Bengaluru", state: "Karnataka", district: "Bengaluru Urban", status: "active", latitude: 12.9716, longitude: 77.5946 },
    { id: "mysuru", name: "Mysuru", state: "Karnataka", district: "Mysuru", status: "upcoming", latitude: 12.2958, longitude: 76.6394 },
    { id: "mumbai", name: "Mumbai", state: "Maharashtra", district: "Mumbai City", status: "upcoming", latitude: 19.0760, longitude: 72.8777 },
    { id: "delhi", name: "Delhi", state: "Delhi", district: "Central Delhi", status: "upcoming", latitude: 28.6139, longitude: 77.2090 },
    { id: "chennai", name: "Chennai", state: "Tamil Nadu", district: "Chennai", status: "upcoming", latitude: 13.0827, longitude: 80.2707 },
    { id: "hyderabad", name: "Hyderabad", state: "Telangana", district: "Hyderabad", status: "upcoming", latitude: 17.3850, longitude: 78.4867 }
  ],

  users: [
    {
      id: "usr-patient-1",
      email: "patient@caresphere.gov.in",
      mobile: "+91 98450 12345",
      passwordHash: defaultHashedPassword,
      role: "PATIENT",
      cityId: "bengaluru",
      isVerified: true,
      profile: {
        fullName: "Aarav Mehta",
        dateOfBirth: "1992-05-14",
        gender: "Male",
        address: "42, 100ft Road, Indiranagar, Bengaluru",
        pinCode: "560038",
        preferredLanguage: "en"
      }
    },
    {
      id: "usr-doctor-1",
      email: "dr.priya@dgh.caresphere.gov.in",
      mobile: "+91 80 5550 0110",
      passwordHash: defaultHashedPassword,
      role: "DOCTOR",
      cityId: "bengaluru",
      isVerified: true,
      profile: {
        fullName: "Dr. Priya Sharma",
        gender: "Female",
        address: "Victoria Hospital Campus, Bengaluru",
        pinCode: "560002",
        preferredLanguage: "en"
      }
    },
    {
      id: "usr-staff-1",
      email: "staff@dgh.caresphere.gov.in",
      mobile: "+91 80 5550 0120",
      passwordHash: defaultHashedPassword,
      role: "HOSPITAL_STAFF",
      cityId: "bengaluru",
      isVerified: true,
      profile: {
        fullName: "Rajesh Kumar",
        address: "Victoria Hospital Ward Admin, Bengaluru",
        pinCode: "560002"
      }
    },
    {
      id: "usr-admin-1",
      email: "admin@caresphere.gov.in",
      mobile: "+91 80 2200 0001",
      passwordHash: defaultHashedPassword,
      role: "ADMINISTRATOR",
      cityId: "bengaluru",
      isVerified: true,
      profile: {
        fullName: "State Health Admin",
        address: "Department of Health & Family Welfare, Bengaluru",
        pinCode: "560001"
      }
    }
  ],

  hospitals: [
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
      status: "Available",
      facilities: ["24x7 Emergency", "ICU", "Blood Bank", "Pharmacy", "Ambulance Bay", "Diagnostics"],
      beds: { General: [18, 50], ICU: [3, 12], Emergency: [2, 6], Pediatric: [4, 10], Maternity: [5, 12], Isolation: [1, 4] },
      updated: "5 minutes ago"
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
      status: "Limited",
      facilities: ["Specialist OPD", "ICU", "Blood Depot", "24x7 Pharmacy", "Diagnostics"],
      beds: { General: [9, 40], ICU: [2, 10], Emergency: [1, 5], Pediatric: [3, 8], Maternity: [2, 10], Isolation: [0, 3] },
      updated: "12 minutes ago"
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
      status: "Available",
      facilities: ["General OPD", "Emergency First Aid", "Jan Aushadhi Kendra", "Diagnostics"],
      beds: { General: [22, 35], ICU: [0, 0], Emergency: [2, 4], Pediatric: [2, 6], Maternity: [3, 6], Isolation: [1, 2] },
      updated: "8 minutes ago"
    }
  ],

  doctors: [
    {
      id: "dr-priya",
      cityId: "bengaluru",
      hospitalId: "district-general",
      name: "Dr. Priya Sharma",
      specialty: "Cardiology",
      qualification: "MBBS, MD (Med), DM (Cardiology)",
      department: "Cardiology & Cardiac Care",
      workingHours: "09:00 AM – 01:30 PM",
      distanceKm: 2.4,
      status: "Appointments available"
    },
    {
      id: "dr-kiran",
      cityId: "bengaluru",
      hospitalId: "city-medical",
      name: "Dr. Kiran Rao",
      specialty: "General Medicine",
      qualification: "MBBS, MD (General Medicine)",
      department: "Internal Medicine & OPD",
      workingHours: "10:00 AM – 04:30 PM",
      distanceKm: 5.1,
      status: "Limited appointments"
    },
    {
      id: "dr-ananya",
      cityId: "bengaluru",
      hospitalId: "community-care",
      name: "Dr. Ananya Iyer",
      specialty: "Pediatrics",
      qualification: "MBBS, DCH, DNB (Pediatrics)",
      department: "Pediatrics & Neonatal Care",
      workingHours: "02:00 PM – 06:00 PM",
      distanceKm: 7.8,
      status: "Availability confirmed"
    }
  ],

  bloodStock: [
    { id: "bld-1", group: "O+", cityId: "bengaluru", facility: "District General Hospital Blood Bank", location: "Central District, Bengaluru", phone: "+91 80 5550 0105", units: 14, status: "Available", updated: "12 minutes ago", compatible: ["O+", "A+", "B+", "AB+"] },
    { id: "bld-2", group: "A+", cityId: "bengaluru", facility: "City Medical Centre Blood Bank", location: "North District, Bengaluru", phone: "+91 80 5550 0205", units: 3, status: "Limited", updated: "25 minutes ago", compatible: ["A+", "AB+"] },
    { id: "bld-3", group: "B+", cityId: "bengaluru", facility: "District General Hospital Blood Bank", location: "Central District, Bengaluru", phone: "+91 80 5550 0105", units: 8, status: "Available", updated: "15 minutes ago", compatible: ["B+", "AB+"] },
    { id: "bld-4", group: "AB+", cityId: "bengaluru", facility: "City Medical Centre Blood Bank", location: "North District, Bengaluru", phone: "+91 80 5550 0205", units: 5, status: "Available", updated: "35 minutes ago", compatible: ["AB+ only"] },
    { id: "bld-5", group: "O−", cityId: "bengaluru", facility: "Community Care Hospital Blood Bank", location: "East District, Bengaluru", phone: "+91 80 5550 0305", units: 1, status: "Limited", updated: "10 minutes ago", compatible: ["Universal Donor (All groups)"] }
  ],

  medicines: [
    { id: "paracetamol", cityId: "bengaluru", name: "Paracetamol", strength: "500 mg", dosageForm: "Tablet", availability: "Available", quantity: "128 tablets", provider: "District General Hospital Pharmacy", providerType: "Hospital pharmacy", location: "Central District, Bengaluru", distanceKm: 2.4, updated: "10 minutes ago" },
    { id: "metformin", cityId: "bengaluru", name: "Metformin", strength: "500 mg", dosageForm: "Tablet", availability: "Limited", quantity: "12 strips", provider: "Jan Aushadhi Kendra", providerType: "Government pharmacy", location: "Central District, Bengaluru", distanceKm: 3.2, updated: "18 minutes ago" },
    { id: "amoxicillin", cityId: "bengaluru", name: "Amoxicillin", strength: "250 mg", dosageForm: "Capsule", availability: "Unavailable", quantity: "Currently unavailable", provider: "City Medical Centre Pharmacy", providerType: "Hospital pharmacy", location: "North District, Bengaluru", distanceKm: 5.1, updated: "45 minutes ago" },
    { id: "saline", cityId: "bengaluru", name: "Normal saline IV", strength: "0.9% · 500 ml", dosageForm: "IV Bottle", availability: "Available", quantity: "36 bottles", provider: "Care Supply Network", providerType: "Authorized supplier", location: "East District, Bengaluru", distanceKm: 6.7, updated: "22 minutes ago" }
  ],

  ambulances: [
    { id: "KA-01-AB-1234", cityId: "bengaluru", provider: "Karnataka 108 Emergency Network", phone: "+91 80 2200 1080", type: "ADVANCED_LIFE_SUPPORT", distanceKm: 1.8, etaMinutes: 6, status: "AVAILABLE" },
    { id: "KA-01-XY-4820", cityId: "bengaluru", provider: "City Red Cross Rapid Response", phone: "+91 80 2200 4820", type: "BASIC_LIFE_SUPPORT", distanceKm: 3.4, etaMinutes: 11, status: "LIMITED" },
    { id: "KA-02-CD-9021", cityId: "bengaluru", provider: "Metro Patient Transfer Logistics", phone: "+91 80 2200 9021", type: "PATIENT_TRANSPORT", distanceKm: 5.2, etaMinutes: 16, status: "UNAVAILABLE" }
  ],

  ambulanceRequests: [],

  appointments: [],

  medicalRecords: {
    "usr-patient-1": {
      profile: {
        bloodGroup: "O+",
        allergies: "Penicillin (Mild rash, hives)",
        chronicConditions: "Hypertension (Stage 1 · monitored)",
        emergencyContactName: "Anita Sharma (Spouse)",
        emergencyContactPhone: "+91 98450 12345"
      },
      diagnoses: [
        { id: "diag-1", condition: "Essential Hypertension", diagnosedDate: "May 2024", severity: "Mild", doctor: "Dr. Kiran Rao", facility: "City Medical Centre" },
        { id: "diag-2", condition: "Seasonal Bronchitis", diagnosedDate: "Jan 2026", severity: "Resolved", doctor: "Dr. Priya Sharma", facility: "District General Hospital" }
      ],
      prescriptions: [
        { id: "rx-1", date: "15 Oct 2026", medication: "Amlodipine 5 mg", form: "Oral Tablet", dosage: "1 tablet daily after breakfast", doctor: "Dr. Kiran Rao", facility: "City Medical Centre", status: "Active" },
        { id: "rx-2", date: "15 Oct 2026", medication: "Paracetamol 650 mg", form: "Oral Tablet", dosage: "1 tablet SOS for headache / fever", doctor: "Dr. Kiran Rao", facility: "City Medical Centre", status: "Active" }
      ],
      labReports: [
        { id: "lab-1", date: "12 Oct 2026", title: "Comprehensive Lipid Profile & Glucose", lab: "District General Diagnostics", resultSummary: "Total Chol: 192 mg/dL · HDL: 48 mg/dL · Fasting Glucose: 98 mg/dL", badge: "Normal" }
      ],
      documents: [
        { id: "doc-1", name: "Discharge_Summary_Jan2026.pdf", category: "Discharge Summary", date: "18 Jan 2026", size: "420 KB", access: "Protected" }
      ],
      accessPass: { code: null, expiresAt: null, active: false }
    }
  }
};

module.exports = store;
