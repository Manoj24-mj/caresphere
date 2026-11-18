const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../src/app");
const http = require("node:http");

let server;
let baseUrl;

test.before(async () => {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
});

test("GET /api/health returns 200 and healthy status", async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.status, "healthy");
  assert.equal(json.activeNode, "bengaluru");
});

test("GET /api/cities lists registered cities including Bengaluru", async () => {
  const res = await fetch(`${baseUrl}/api/cities`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  const blr = json.data.find(c => c.id === "bengaluru");
  assert.ok(blr, "Bengaluru must be present in cities list");
  assert.equal(blr.status, "active");
});

test("GET /api/hospitals filters correctly by city", async () => {
  const res = await fetch(`${baseUrl}/api/hospitals?city=bengaluru`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 3);
  assert.equal(json.data[0].cityId, "bengaluru");
});

test("GET /api/beds/availability returns categorized bed metrics", async () => {
  const res = await fetch(`${baseUrl}/api/beds?city=bengaluru&type=ICU`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 1);
  assert.equal(json.data[0].category, "ICU");
  assert.ok(typeof json.data[0].available === "number");
});

test("GET /api/doctors returns specialists for city", async () => {
  const res = await fetch(`${baseUrl}/api/doctors?city=bengaluru&specialty=Cardiology`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 1);
  assert.equal(json.data[0].specialty, "Cardiology");
});

test("GET /api/blood-inventory filters by blood group", async () => {
  const res = await fetch(`${baseUrl}/api/blood-inventory?city=bengaluru&group=O+`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 1);
  assert.equal(json.data[0].group, "O+");
});

test("GET /api/medicines searches medicines by name", async () => {
  const res = await fetch(`${baseUrl}/api/medicines?city=bengaluru&query=Paracetamol`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 1);
  assert.match(json.data[0].name, /Paracetamol/i);
});

test("GET /api/ambulances lists emergency response units", async () => {
  const res = await fetch(`${baseUrl}/api/ambulances?city=bengaluru`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 1);
});

test("AUTH: Rejects registration when required fields are missing", async () => {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName: "Incomplete User" })
  });
  assert.equal(res.status, 400);
  const json = await res.json();
  assert.equal(json.success, false);
});

test("AUTH & PRIVATE VAULT: Full patient registration, authentication, and vault security flow", async () => {
  // 1. Register new patient
  const mobile = `+91 99999 ${Math.floor(10000 + Math.random() * 90000)}`;
  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Pooja Verma",
      mobile,
      password: "SecurePassword123!",
      address: "12, Koramangala 4th Block, Bengaluru",
      pinCode: "560034",
      cityId: "bengaluru",
      role: "PATIENT"
    })
  });
  assert.equal(regRes.status, 201);
  const regJson = await regRes.json();
  const token = regJson.data.token;
  assert.ok(token);

  // 2. Unauthenticated access to medical records is blocked (401)
  const unauthRes = await fetch(`${baseUrl}/api/medical-records/me`);
  assert.equal(unauthRes.status, 401);

  // 3. Authenticated access to own medical records succeeds (200)
  const vaultRes = await fetch(`${baseUrl}/api/medical-records/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(vaultRes.status, 200);
  const vaultJson = await vaultRes.json();
  assert.equal(vaultJson.success, true);

  // 4. Generate 6-digit Clinician Access Pass
  const passRes = await fetch(`${baseUrl}/api/medical-records/access-pass/generate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(passRes.status, 200);
  const passJson = await passRes.json();
  const passCode = passJson.data.passCode;
  assert.match(passCode, /^CS-\d{6}$/);

  // 5. Patient cannot update hospital beds (RBAC 403 Forbidden)
  const bedRes = await fetch(`${baseUrl}/api/beds/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ hospitalId: "district-general", beds: { General: [10, 50] } })
  });
  assert.equal(bedRes.status, 403, "Patient role must be forbidden from updating bed inventory");
});
