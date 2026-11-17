/* Shared illustrative records for CareSphere city-focused healthcare services. */
window.CareSphereDemo = {
  cities: [
    { id: "bengaluru", name: "Bengaluru", state: "Karnataka", district: "Bengaluru Urban", status: "active", hospitalCount: 3, bedCount: 165, doctorCount: 3, lat: 12.9716, lng: 77.5946 },
    { id: "mysuru", name: "Mysuru", state: "Karnataka", district: "Mysuru", status: "upcoming", hospitalCount: 0, bedCount: 0, doctorCount: 0, lat: 12.2958, lng: 76.6394 },
    { id: "mumbai", name: "Mumbai", state: "Maharashtra", district: "Mumbai City", status: "upcoming", hospitalCount: 0, bedCount: 0, doctorCount: 0, lat: 19.0760, lng: 72.8777 },
    { id: "delhi", name: "Delhi", state: "Delhi", district: "Central Delhi", status: "upcoming", hospitalCount: 0, bedCount: 0, doctorCount: 0, lat: 28.6139, lng: 77.2090 },
    { id: "chennai", name: "Chennai", state: "Tamil Nadu", district: "Chennai", status: "upcoming", hospitalCount: 0, bedCount: 0, doctorCount: 0, lat: 13.0827, lng: 80.2707 },
    { id: "hyderabad", name: "Hyderabad", state: "Telangana", district: "Hyderabad", status: "upcoming", hospitalCount: 0, bedCount: 0, doctorCount: 0, lat: 17.3850, lng: 78.4867 }
  ],
  bedTypes: ["General", "ICU", "Emergency", "Pediatric", "Maternity", "Isolation"],
  hospitals: [
    {
      id: "district-general",
      city: "bengaluru",
      name: "District General Hospital",
      type: "Government hospital",
      location: "Central District, Bengaluru",
      address: "Victoria Hospital Campus, Fort Road, Bengaluru - 560002",
      distance: 2.4,
      updated: "5 minutes ago",
      status: "Available",
      phone: "+91 80 5550 0100",
      facilities: ["24x7 Emergency", "ICU", "Blood Bank", "Pharmacy", "Ambulance Bay", "Diagnostics"],
      beds: { General: [18, 50], ICU: [3, 12], Emergency: [2, 6], Pediatric: [4, 10], Maternity: [5, 12], Isolation: [1, 4] }
    },
    {
      id: "city-medical",
      city: "bengaluru",
      name: "City Medical Centre",
      type: "Public teaching hospital",
      location: "North District, Bengaluru",
      address: "Malleswaram 18th Cross, Bengaluru - 560055",
      distance: 5.1,
      updated: "12 minutes ago",
      status: "Limited",
      phone: "+91 80 5550 0200",
      facilities: ["Specialist OPD", "Blood Depot", "24x7 Pharmacy", "Diagnostics"],
      beds: { General: [9, 40], ICU: [2, 10], Emergency: [1, 5], Pediatric: [3, 8], Maternity: [2, 10], Isolation: [0, 3] }
    },
    {
      id: "community-care",
      city: "bengaluru",
      name: "Community Care Hospital",
      type: "Community health centre",
      location: "East District, Bengaluru",
      address: "Indiranagar 100ft Road, Bengaluru - 560038",
      distance: 7.8,
      updated: "8 minutes ago",
      status: "Available",
      phone: "+91 80 5550 0300",
      facilities: ["General OPD", "Emergency First Aid", "Jan Aushadhi Kendra"],
      beds: { General: [22, 35], ICU: [0, 0], Emergency: [2, 4], Pediatric: [2, 6], Maternity: [3, 6], Isolation: [1, 2] }
    }
  ],
  medicines: [
    { id: "paracetamol", city: "bengaluru", name: "Paracetamol", strength: "500 mg", form: "Tablet", availability: "Available", quantity: "128 tablets", provider: "District General Hospital Pharmacy", providerType: "Hospital pharmacy", location: "Central District, Bengaluru", distance: 2.4, updated: "10 minutes ago" },
    { id: "metformin", city: "bengaluru", name: "Metformin", strength: "500 mg", form: "Tablet", availability: "Limited", quantity: "12 strips", provider: "Jan Aushadhi Kendra", providerType: "Government pharmacy", location: "Central District, Bengaluru", distance: 3.2, updated: "18 minutes ago" },
    { id: "amoxicillin", city: "bengaluru", name: "Amoxicillin", strength: "250 mg", form: "Capsule", availability: "Unavailable", quantity: "Currently unavailable", provider: "City Medical Centre Pharmacy", providerType: "Hospital pharmacy", location: "North District, Bengaluru", distance: 5.1, updated: "45 minutes ago" },
    { id: "saline", city: "bengaluru", name: "Normal saline IV", strength: "0.9% · 500 ml", form: "IV Bottle", availability: "Available", quantity: "36 bottles", provider: "Care Supply Network", providerType: "Authorized supplier", location: "East District, Bengaluru", distance: 6.7, updated: "22 minutes ago" },
    { id: "azithromycin", city: "bengaluru", name: "Azithromycin", strength: "500 mg", form: "Tablet", availability: "Available", quantity: "45 strips", provider: "Jan Aushadhi Kendra Malleswaram", providerType: "Government pharmacy", location: "North District, Bengaluru", distance: 4.8, updated: "15 minutes ago" }
  ],
  ambulances: [
    { id: "KA-01-AB-1234", city: "bengaluru", type: "Advanced Life Support (ALS)", distance: 1.8, eta: 6, status: "Available", phone: "+91 80 5550 0108", base: "Victoria Hospital Emergency Bay" },
    { id: "KA-01-XY-4820", city: "bengaluru", type: "Basic Life Support (BLS)", distance: 3.4, eta: 11, status: "Limited", phone: "+91 80 5550 0208", base: "Malleswaram Response Post" },
    { id: "KA-02-CD-9021", city: "bengaluru", type: "Patient Transport (PTS)", distance: 5.2, eta: 16, status: "Unavailable", phone: "+91 80 5550 0308", base: "Indiranagar Depot" }
  ],
  blood: [
    { group: "O+", city: "bengaluru", facility: "District General Hospital Blood Bank", location: "Central District, Bengaluru", phone: "+91 80 5550 0105", distance: 2.4, status: "Available", units: 12, updated: "14 minutes ago", compatible: ["O+", "A+", "B+", "AB+"] },
    { group: "A+", city: "bengaluru", facility: "City Medical Centre Blood Bank", location: "North District, Bengaluru", phone: "+91 80 5550 0205", distance: 5.1, status: "Limited", units: 2, updated: "28 minutes ago", compatible: ["A+", "AB+"] },
    { group: "B+", city: "bengaluru", facility: "District General Hospital Blood Bank", location: "Central District, Bengaluru", phone: "+91 80 5550 0105", distance: 2.4, status: "Available", units: 8, updated: "20 minutes ago", compatible: ["B+", "AB+"] },
    { group: "AB+", city: "bengaluru", facility: "City Medical Centre Blood Bank", location: "North District, Bengaluru", phone: "+91 80 5550 0205", distance: 5.1, status: "Available", units: 5, updated: "35 minutes ago", compatible: ["AB+ only"] },
    { group: "O−", city: "bengaluru", facility: "Community Care Hospital Blood Bank", location: "East District, Bengaluru", phone: "+91 80 5550 0305", distance: 7.8, status: "Limited", units: 1, updated: "10 minutes ago", compatible: ["Universal Donor (All groups)"] }
  ],
  doctors: [
    { id: "dr-priya", city: "bengaluru", name: "Dr. Priya Sharma", specialty: "Cardiology", qualification: "MBBS, MD (Med), DM (Cardiology)", facility: "District General Hospital", department: "Cardiology", hours: "09:00 AM – 01:30 PM", distance: 2.4, status: "Appointments available" },
    { id: "dr-kiran", city: "bengaluru", name: "Dr. Kiran Rao", specialty: "General Medicine", qualification: "MBBS, MD (General Medicine)", facility: "City Medical Centre", department: "Internal Medicine", hours: "10:00 AM – 04:30 PM", distance: 5.1, status: "Limited appointments" },
    { id: "dr-ananya", city: "bengaluru", name: "Dr. Ananya Iyer", specialty: "Pediatrics", qualification: "MBBS, DCH, DNB (Pediatrics)", facility: "Community Care Hospital", department: "Pediatrics", hours: "02:00 PM – 06:00 PM", distance: 7.8, status: "Availability confirmed" }
  ],
  medicalRecords: {
    profile: { bloodGroup: "O+", allergies: "Penicillin (Mild rash)", chronicConditions: "Hypertension (Stage 1)", emergencyContact: "Anita Sharma (Spouse) · +91 98450 12345" },
    prescriptions: [
      { id: "rx-1", date: "15 Oct 2026", medication: "Amlodipine 5 mg", form: "Tablet", dosage: "1 tab daily morning", doctor: "Dr. Kiran Rao", facility: "City Medical Centre", status: "Active" },
      { id: "rx-2", date: "15 Oct 2026", medication: "Paracetamol 650 mg", form: "Tablet", dosage: "1 tab SOS for headache", doctor: "Dr. Kiran Rao", facility: "City Medical Centre", status: "Active" }
    ],
    labReports: [
      { id: "lab-1", date: "12 Oct 2026", title: "Lipid Profile & Glucose", lab: "District General Diagnostics", resultSummary: "Total Chol: 192 mg/dL · Glucose: 98 mg/dL", badge: "Normal" }
    ],
    consultations: [
      { id: "con-1", date: "15 Oct 2026", doctor: "Dr. Kiran Rao", facility: "City Medical Centre", reason: "Hypertension follow-up", outcome: "BP 138/88 mmHg. Prescription renewed." }
    ]
  },
  schemes: [
    { id: "pmjay", name: "Ayushman Bharat · PM-JAY", description: "Hospital treatment coverage for eligible families at participating hospitals.", eligibility: "Eligibility depends on official beneficiary records and current programme rules.", benefits: ["Hospital treatment support", "Cashless eligible care", "Empanelled hospitals"], how: "Check beneficiary status through the official PM-JAY channel or an authorized help desk.", contact: "Official PM-JAY helpline: 14555. Verify current details through official sources." }
  ]
};
