/* Standalone feature-page renderer and interactions for the client walkthrough. */
(() => {
  "use strict";

  const demo = window.CareSphereDemo;
  const root = document.getElementById("feature-root");
  const feature = document.body.dataset.feature;
  const params = new URLSearchParams(window.location.search);
  const titles = {
    hospitals: ["Hospital Availability", "Search verified hospitals, facilities, addresses and directions."],
    beds: ["Bed Availability", "Compare verified General, ICU and Emergency beds in your city."],
    doctors: ["Doctor Availability", "Specialist directory, working hours, hospital affiliation and appointment preview."],
    medicines: ["Medicine Availability", "Search medicine inventory across hospital pharmacies, suppliers and Jan Aushadhi Kendras."],
    ambulances: ["Ambulance Services", "Preview nearby response options and emergency assistance."],
    blood: ["Blood Availability", "Check live updates reported by blood banks with donor compatibility."],
    records: ["Medical Records Management", "Private-by-default personal health vault, prescriptions, lab reports and security."],
    search: ["Unified City Search", "Search hospitals, beds, doctors, blood stock, medicines, ambulances and records."],
    schemes: ["Government Health Benefits", "Explore support programmes and check official rules."]
  };
  const state = {
    query: params.get("q") || "",
    bedType: demo.bedTypes.includes(params.get("type")) ? params.get("type") : "All",
    bedDistance: "Any distance",
    bedAvailability: "All",
    bedSort: "nearest",
    medicineProvider: "All",
    medicineAvailableOnly: false,
    medicineNearbyOnly: false,
    schemeMessage: "",
    doctorMessage: "",
    ambulancePreview: null
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    })[character]);
  }

  function statusClass(value) {
    if (value === "Limited") return "limited";
    if (["Unavailable","Full"].includes(value)) return "critical";
    if (["Unknown","Availability not confirmed"].includes(value)) return "unknown";
    return "";
  }

  function statusPill(value) {
    return `<span class="status ${statusClass(value)}">${escapeHtml(value)}</span>`;
  }

  function shell(title, subtitle, content) {
    return `<header class="site-header">
      <a class="brand" href="../index.html"><img src="../assets/caresphere-symbol.svg" alt=""><span>Care<span>Sphere</span></span></a>
      <nav aria-label="Main navigation"><a href="../index.html">Dashboard</a><a class="emergency-link" href="../index.html?dashboard=1&amp;emergency=1">Emergency SOS</a></nav>
    </header>
    <main class="feature-main">
      <div class="breadcrumbs">CareSphere / ${escapeHtml(title)}</div>
      <p class="eyebrow">CARESPHERE · CONNECTED CARE</p>
      <h1>${escapeHtml(title)}</h1><p class="lede">${escapeHtml(subtitle)}</p>
      <p class="prototype-note"><strong>Prototype sample data.</strong> Availability is illustrative, not live. Confirm directly with providers before making care decisions.</p>
      ${content}
    </main>
    <footer class="site-footer"><span>CareSphere · Right Care, Right Place, Right Time.</span><a href="../index.html">Back to dashboard →</a></footer>`;
  }

  function bedData(hospital, type) {
    const values = hospital.beds[type];
    if (!values || !values[1]) return {available:0,total:0,status:"Unknown"};
    return {available:values[0],total:values[1],status:values[0] === 0 ? "Full" : values[0] <= 2 ? "Limited" : "Available"};
  }

  function bedCard(hospital) {
    const types = state.bedType === "All" ? demo.bedTypes : [state.bedType];
    const lines = types.map(type => {
      const item = bedData(hospital,type);
      const percentage = item.total ? Math.round(item.available / item.total * 100) : 0;
      const detail = item.total ? `${item.available} available · ${item.total-item.available} occupied · ${item.total} total` : "Not reported";
      return `<div class="bed-row"><span>${escapeHtml(type)}</span><span class="meter"><span style="width:${percentage}%"></span></span><strong>${detail}</strong></div>`;
    }).join("");
    const hosp3d = (window.CareSphere3D && window.CareSphere3D.svg) ? window.CareSphere3D.svg("hospital", { width: 36, height: 36 }) : "";
    return `<article class="resource-card"><div class="card-heading"><div style="display:flex;align-items:center;gap:12px">${hosp3d}<div><h2>${escapeHtml(hospital.name)}</h2><p>${escapeHtml(hospital.type)}</p></div></div>${statusPill(hospital.status)}</div>
      <div class="resource-meta"><span>📍 ${escapeHtml(hospital.location)}</span><span>🛣️ ${hospital.distance} km</span></div>
      <div class="bed-list">${lines}</div><p class="sample-update">Last sample update: ${escapeHtml(hospital.updated)}</p>
      <div class="card-actions"><a class="button secondary" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(`${hospital.name}, ${hospital.location}`)}" target="_blank" rel="noopener noreferrer">Get directions</a></div></article>`;
  }

  function bedsPage() {
    let hospitals = demo.hospitals.filter(hospital => {
      const q = state.query.trim().toLowerCase();
      const matchesQuery = !q || `${hospital.name} ${hospital.type} ${hospital.location}`.toLowerCase().includes(q);
      const matchesDistance = state.bedDistance === "Any distance" || hospital.distance <= Number(state.bedDistance);
      const availability = bedData(hospital,state.bedType).status;
      const matchesAvailability = state.bedAvailability === "All" || (state.bedAvailability === "Available" ? ["Available","Limited"].includes(availability) : availability === state.bedAvailability);
      return matchesQuery && matchesDistance && matchesAvailability;
    });
    hospitals.sort((first,second) => state.bedSort === "available" ? bedData(second,state.bedType).available-bedData(first,state.bedType).available : first.distance-second.distance);
    const content = `<div class="toolbar">
      <input type="search" aria-label="Search hospitals" placeholder="Search hospital or location" data-filter="query" value="${escapeHtml(state.query)}">
      <select aria-label="Bed type" data-filter="bedType">${["All",...demo.bedTypes].map(value=>`<option ${state.bedType===value?"selected":""}>${value}</option>`).join("")}</select>
      <select aria-label="Distance" data-filter="bedDistance">${["Any distance","5","10"].map(value=>`<option value="${value}" ${state.bedDistance===value?"selected":""}>${value==="Any distance"?value:`Within ${value} km`}</option>`).join("")}</select>
      <select aria-label="Availability" data-filter="bedAvailability">${["All","Available","Limited","Full","Unknown"].map(value=>`<option ${state.bedAvailability===value?"selected":""}>${value}</option>`).join("")}</select>
      <select aria-label="Sort hospitals" data-filter="bedSort"><option value="nearest" ${state.bedSort==="nearest"?"selected":""}>Nearest first</option><option value="available" ${state.bedSort==="available"?"selected":""}>Most available</option></select>
    </div><p class="result-count">${hospitals.length} sample hospital${hospitals.length===1?"":"s"} match your filters</p>
    <section class="card-grid">${hospitals.map(bedCard).join("") || '<p class="empty-state">No sample hospitals match those filters. Try widening your search.</p>'}</section>
    <p class="prototype-note notice-warning">Bed counts are sample values, not a live capacity feed or a reservation. Confirm directly with the facility.</p>`;
    return shell(titles.beds[0],titles.beds[1],content);
  }

  function medicineCard(medicine) {
    const pill3d = (window.CareSphere3D && window.CareSphere3D.svg) ? window.CareSphere3D.svg("capsules", { width: 36, height: 36 }) : "";
    const sourceLabel = medicine._source === "api" ? "<strong style='color:#059669;'>Live Registry API</strong>" : "Sample baseline";
    return `<article class="resource-card"><div class="card-heading"><div style="display:flex;align-items:center;gap:12px">${pill3d}<div><h2>${escapeHtml(medicine.name)} ${escapeHtml(medicine.strength)}</h2><p>${escapeHtml(medicine.provider)}</p></div></div>${statusPill(medicine.availability)}</div>
      <div class="resource-meta"><span>🏪 ${escapeHtml(medicine.providerType)}</span><span>📍 ${escapeHtml(medicine.location)}</span><span>🛣️ ${medicine.distance} km</span><span>📡 ${sourceLabel}</span></div>
      <div class="resource-meta"><strong>${escapeHtml(medicine.quantity)}</strong></div><p class="sample-update">${medicine._source === "api" ? "Live verified update: " : "Last sample update: "}${escapeHtml(medicine.updated)}</p></article>`;
  }

  function medicinesPage() {
    const q = state.query.trim().toLowerCase();
    const medicines = demo.medicines.filter(medicine => {
      const matchesQuery = !q || `${medicine.name} ${medicine.strength} ${medicine.provider} ${medicine.providerType}`.toLowerCase().includes(q);
      const matchesProvider = state.medicineProvider === "All" || medicine.providerType === state.medicineProvider;
      const matchesAvailable = !state.medicineAvailableOnly || medicine.availability !== "Unavailable";
      const matchesNearby = !state.medicineNearbyOnly || medicine.distance <= 5;
      return matchesQuery && matchesProvider && matchesAvailable && matchesNearby;
    });
    const content = `<div class="toolbar"><input type="search" aria-label="Search medicines" placeholder="Search medicine name" data-filter="query" value="${escapeHtml(state.query)}">
      <select aria-label="Provider type" data-filter="medicineProvider">${["All","Government pharmacy","Hospital pharmacy","Authorized supplier"].map(value=>`<option ${state.medicineProvider===value?"selected":""}>${value}</option>`).join("")}</select>
      <label class="check-filter"><input type="checkbox" data-filter="medicineNearbyOnly" ${state.medicineNearbyOnly?"checked":""}> Nearby (within 5 km)</label>
      <label class="check-filter"><input type="checkbox" data-filter="medicineAvailableOnly" ${state.medicineAvailableOnly?"checked":""}> Available now</label></div>
      <p class="result-count">${medicines.length} medicine listing${medicines.length===1?"":"s"} match your filters</p><section class="card-grid">${medicines.map(medicineCard).join("") || '<p class="empty-state">No sample listings match. Try a different medicine or filter.</p>'}</section>
      <p class="prototype-note notice-warning">Stock is illustrative unless synchronized with a live municipal pharmacy node. This is not medical advice; do not substitute a prescription without consulting a doctor or pharmacist.</p>`;
    return shell(titles.medicines[0],titles.medicines[1],content);
  }

  function ambulanceCard(ambulance) {
    const amb3d = (window.CareSphere3D && window.CareSphere3D.svg) ? window.CareSphere3D.svg("ambulance", { width: 36, height: 36 }) : "";
    const action = ambulance.status === "Unavailable" ? "" : `<button class="button secondary" type="button" data-ambulance="${escapeHtml(ambulance.id)}">Preview request</button>`;
    const sourceLabel = ambulance._source === "api" ? "<strong style='color:#059669;'>Live Registry API</strong>" : "Sample baseline";
    return `<article class="resource-card"><div class="card-heading"><div style="display:flex;align-items:center;gap:12px">${amb3d}<div><h2>${escapeHtml(ambulance.type)}</h2><p>${escapeHtml(ambulance.id)}</p></div></div>${statusPill(ambulance.status)}</div>
      <div class="resource-meta"><span>🛣️ ${ambulance.distance} km</span><span>⏱️ ${ambulance._source === "api" ? "Live ETA" : "Sample ETA"} ${ambulance.eta} min</span><span>📡 ${sourceLabel}</span></div><div class="card-actions">${action}</div></article>`;
  }

  function ambulanceForm() {
    return `<section class="detail-panel form-panel"><h2>Request preview</h2><p>Enter an example pickup to see the confirmation state. Nothing is transmitted.</p>
      <form id="ambulance-form"><div class="form-grid"><label>Pickup location<input name="pickup" required placeholder="Enter a demo pickup location"></label>
      <label>Emergency type<select name="type"><option>Medical emergency</option><option>Accident / injury</option><option>Pregnancy / maternity</option><option>Patient transfer</option></select></label>
      <label class="full">Optional note<textarea name="notes" placeholder="Do not enter real personal or medical information"></textarea></label></div>
      <div class="card-actions"><button class="button danger" type="submit">Create local preview</button></div></form></section>`;
  }

  function ambulancesPage() {
    const cards = demo.ambulances.map(ambulanceCard).join("");
    const preview = state.ambulancePreview ? `<section class="detail-panel inline-status" role="status"><strong>Preview only — not dispatched.</strong><br>${escapeHtml(state.ambulancePreview.type)} · Pickup: ${escapeHtml(state.ambulancePreview.pickup)}<br>No ambulance has been assigned, and no service or hospital has been contacted.</section>` : "";
    const content = `<p class="prototype-note notice-warning"><strong>For a real emergency, call your local emergency number now.</strong> Sample availability, distance and ETA are not live. This page does not dispatch an ambulance.</p>
      <section class="card-grid">${cards}</section>${ambulanceForm()}${preview}`;
    return shell(titles.ambulances[0],titles.ambulances[1],content);
  }

  function bloodCard(item) {
    const blood3d = (window.CareSphere3D && window.CareSphere3D.svg) ? window.CareSphere3D.svg("blood", { width: 36, height: 36 }) : "";
    const sourceLabel = item._source === "api" ? "<strong style='color:#059669;'>Live Registry API</strong>" : "Sample baseline";
    return `<article class="resource-card"><div class="card-heading"><div style="display:flex;align-items:center;gap:12px">${blood3d}<div><h2>${escapeHtml(item.group)} blood</h2><p>${escapeHtml(item.facility)}</p></div></div>${statusPill(item.status)}</div>
      <div class="resource-meta"><span>📍 ${escapeHtml(item.location)}</span><span>🛣️ ${item.distance} km</span><span>📡 ${sourceLabel}</span></div><div class="resource-meta"><strong>${item.units===null?"Units not reported":item._source==="api"?`${item.units} units verified`:`${item.units} units (sample)`}</strong></div><p class="sample-update">${escapeHtml(item.updated)}</p></article>`;
  }

  function bloodPage() {
    const content = `<section class="card-grid">${demo.blood.map(bloodCard).join("")}</section>
      <p class="prototype-note notice-warning">Blood-stock data can change quickly. Contact the blood bank to confirm stock and compatibility. In an emergency, contact local emergency services.</p>`;
    return shell(titles.blood[0],titles.blood[1],content);
  }

  function doctorsPage() {
    const q = state.query.trim().toLowerCase();
    const doctors = demo.doctors.filter(doctor => !q || `${doctor.name} ${doctor.specialty} ${doctor.facility}`.toLowerCase().includes(q));
    const doc3d = (window.CareSphere3D && window.CareSphere3D.svg) ? window.CareSphere3D.svg("equipment", { width: 36, height: 36 }) : "";
    const cards = doctors.map(doctor => `<article class="resource-card"><div class="card-heading"><div style="display:flex;align-items:center;gap:12px">${doc3d}<div><h2>${escapeHtml(doctor.name)}</h2><p>${escapeHtml(doctor.specialty)}</p></div></div>${statusPill(doctor.status)}</div>
      <div class="resource-meta"><span>🏥 ${escapeHtml(doctor.facility)}</span><span>🛣️ ${doctor.distance} km</span><span>📡 ${doctor._source === "api" ? "<strong style='color:#059669;'>Live Registry API</strong>" : "Sample baseline"}</span></div>
      <div class="card-actions"><button class="button secondary" type="button" data-doctor-preview="${escapeHtml(doctor.name)}">Preview appointment</button></div>
      ${state.doctorMessage === doctor.name ? '<p class="inline-status" role="status">Appointment preview only — no appointment was booked or sent to the care team.</p>' : ""}</article>`).join("");
    const content = `<div class="toolbar"><input type="search" aria-label="Search doctors" placeholder="Search name, specialty or hospital" data-filter="query" value="${escapeHtml(state.query)}"></div>
      <p class="result-count">${doctors.length} clinician${doctors.length===1?"":"s"} found</p><section class="card-grid">${cards || '<p class="empty-state">No clinicians match that search.</p>'}</section>
      <p class="prototype-note notice-warning">Clinician names and appointment availability are illustrative unless synchronized with a live municipal registry node.</p>`;
    return shell("Find a doctor",titles.doctors[1],content);
  }

  function schemesPage() {
    const scheme3d = (window.CareSphere3D && window.CareSphere3D.svg) ? window.CareSphere3D.svg("heart", { width: 36, height: 36 }) : "";
    const cards = demo.schemes.map(scheme => {
      const message = state.schemeMessage && state.schemeMessage.id === scheme.id ? `<p class="inline-status" role="status">${escapeHtml(state.schemeMessage.text)}</p>` : "";
      return `<article class="scheme-card"><div class="card-heading"><div style="display:flex;align-items:center;gap:12px">${scheme3d}<div><h2>${escapeHtml(scheme.name)}</h2><p>${escapeHtml(scheme.description)}</p></div></div><span class="status unknown">Check rules</span></div>
        <p><strong>Eligibility:</strong> ${escapeHtml(scheme.eligibility)}</p><details><summary>Benefits and next steps</summary><ul>${scheme.benefits.map(benefit=>`<li>${escapeHtml(benefit)}</li>`).join("")}</ul><p>${escapeHtml(scheme.how)}</p><p>${escapeHtml(scheme.contact)}</p></details>
        <div class="card-actions"><button class="button secondary" type="button" data-scheme-preview="${escapeHtml(scheme.id)}">Application preview</button></div>${message}</article>`;
    }).join("");
    const content = `<p class="prototype-note notice-warning">CareSphere cannot determine eligibility or submit an application. Confirm current criteria, documents and application status through the official programme or government office.</p><section class="card-grid">${cards}</section>`;
    return shell(titles.schemes[0],titles.schemes[1],content);
  }

  function searchPage() {
    const q = state.query.trim().toLowerCase();
    const category = (...words) => words.some(word => q.split(/\s+/).includes(word));
    const hospitalCategory = category("hospital","hospitals");
    const bedCategory = category("bed","beds");
    const typeQuery = demo.bedTypes.find(type => q.includes(type.toLowerCase()));
    const medicineCategory = category("medicine","medicines","pharmacy","pharmacies");
    const doctorCategory = category("doctor","doctors","physician","physicians");
    const bloodCategory = category("blood","bank","banks");
    const ambulanceCategory = category("ambulance","ambulances");
    const recordsCategory = category("record","records","prescription","prescriptions","report","reports");
    const results = [
      ...demo.hospitals.filter(item=>hospitalCategory||`${item.name} ${item.type} ${item.location}`.toLowerCase().includes(q)).map(item=>["Hospital",item.name,`${item.type} · ${item.distance} km`,"bed-availability.html"]),
      ...demo.hospitals.filter(()=>bedCategory||Boolean(typeQuery)).map(item=>["Bed availability",`${typeQuery||"All"} beds · ${item.name}`,`${item.distance} km · Sample counts`,"bed-availability.html"+(typeQuery?`?type=${encodeURIComponent(typeQuery)}`:"")]),
      ...demo.medicines.filter(item=>medicineCategory||`${item.name} ${item.strength} ${item.provider}`.toLowerCase().includes(q)).map(item=>["Medicine",`${item.name} ${item.strength}`,`${item.provider} · ${item.distance} km`,"medicine-availability.html"+(medicineCategory?"":`?q=${encodeURIComponent(item.name)}`)]),
      ...demo.doctors.filter(item=>doctorCategory||`${item.name} ${item.specialty} ${item.facility}`.toLowerCase().includes(q)).map(item=>["Doctor",item.name,`${item.specialty} · ${item.facility} · ${item.distance} km`,"doctor-directory.html"+(doctorCategory?"":`?q=${encodeURIComponent(item.name)}`)]),
      ...demo.blood.filter(item=>bloodCategory||`${item.group} ${item.facility} ${item.location}`.toLowerCase().includes(q)).map(item=>["Blood",`${item.group} blood · ${item.facility}`,`${item.distance} km · ${item.status}`,"blood-availability.html"]),
      ...demo.ambulances.filter(item=>ambulanceCategory||`${item.id} ${item.type}`.toLowerCase().includes(q)).map(item=>["Ambulance",item.id,`${item.type} · ${item.distance} km · ${item.status}`,"ambulance-availability.html"]),
      ...(recordsCategory ? [["Medical Records","Personal Health Records & Prescriptions","Manage your private health vault","../index.html?dashboard=1&nav=records"]] : [])
    ];
    const rows = results.map(([kind,title,description,href])=>`<article class="resource-card"><div class="card-heading"><div><span class="eyebrow">${escapeHtml(kind)}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p></div></div><div class="card-actions"><a class="button secondary" href="${href}">View feature →</a></div></article>`).join("");
    const content = `<div class="toolbar"><input type="search" aria-label="Search all sample services" placeholder="Try ICU, a hospital, doctor or medicine" data-filter="query" value="${escapeHtml(state.query)}"></div>
      <p class="result-count">${results.length} sample result${results.length===1?"":"s"} ${q?"matched":"available to explore"}</p><section class="card-grid">${rows || '<p class="empty-state">No sample results matched. Try “ICU”, “doctor”, “blood”, or “medicine”.</p>'}</section>`;
    return shell(titles.search[0],titles.search[1],content);
  }

  function hospitalsPage() {
    const q = state.query.trim().toLowerCase();
    const hospitals = demo.hospitals.filter(h => !q || `${h.name} ${h.type} ${h.location} ${h.address}`.toLowerCase().includes(q));
    const hosp3d = (window.CareSphere3D && window.CareSphere3D.svg) ? window.CareSphere3D.svg("hospital", { width: 36, height: 36 }) : "";
    const cards = hospitals.map(h => `
      <article class="resource-card">
        <div class="card-heading">
          <div style="display:flex;align-items:center;gap:12px">${hosp3d}<div><h2>${escapeHtml(h.name)}</h2><p>${escapeHtml(h.type)}</p></div></div>
          ${statusPill(h.status)}
        </div>
        <div class="resource-meta"><span>📍 ${escapeHtml(h.address)}</span><span>🛣️ ${h.distance} km</span><span>📞 ${escapeHtml(h.phone)}</span></div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0;">
          ${(h.facilities || []).map(f => `<span style="padding:2px 8px;border-radius:6px;background:#EFF6FF;border:1px solid #BFDBFE;color:#1E40AF;font-size:11.5px;font-weight:700;">${escapeHtml(f)}</span>`).join("")}
        </div>
        <div class="card-actions">
          <a class="button" href="bed-availability.html">Check Bed Counts</a>
          <a class="button secondary" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(`${h.name}, ${h.address}`)}" target="_blank" rel="noopener noreferrer">Get directions</a>
        </div>
      </article>`).join("");
    const content = `<div class="toolbar"><input type="search" aria-label="Search hospitals" placeholder="Search hospital name or address" data-filter="query" value="${escapeHtml(state.query)}"></div>
      <p class="result-count">${hospitals.length} verified hospital${hospitals.length===1?"":"s"} available in active city node</p>
      <section class="card-grid">${cards || '<p class="empty-state">No hospitals matched your search.</p>'}</section>`;
    return shell(titles.hospitals[0], titles.hospitals[1], content);
  }

  function recordsPage() {
    const records = demo.medicalRecords;
    const content = `
      <div style="display:grid;gap:16px;margin-bottom:20px;">
        <div style="padding:18px 22px;border-radius:16px;background:linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%);color:#FFF;">
          <h3 style="margin:0 0 6px;font-size:16px;font-weight:800;">🔒 Private by Default · End-to-End Client-Side Privacy</h3>
          <p style="margin:0;font-size:13.5px;color:#E2E8F0;">Health records, diagnoses and prescriptions are stored locally in your private client-side vault.</p>
        </div>
        <section class="detail-panel">
          <h3>Personal Health Profile</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;margin-top:12px;">
            <div style="padding:12px;background:#F8FAFD;border:1px solid #E2E8F0;border-radius:10px;"><strong>Blood Group:</strong> ${records.profile.bloodGroup}</div>
            <div style="padding:12px;background:#F8FAFD;border:1px solid #E2E8F0;border-radius:10px;"><strong>Allergies:</strong> ${records.profile.allergies}</div>
            <div style="padding:12px;background:#F8FAFD;border:1px solid #E2E8F0;border-radius:10px;"><strong>Chronic Conditions:</strong> ${records.profile.chronicConditions}</div>
            <div style="padding:12px;background:#F8FAFD;border:1px solid #E2E8F0;border-radius:10px;"><strong>Emergency Contact:</strong> ${records.profile.emergencyContact}</div>
          </div>
        </section>
        <section class="detail-panel">
          <h3>Active Prescriptions</h3>
          <div class="card-grid" style="margin-top:12px;">
            ${records.prescriptions.map(p => `
              <div style="padding:16px;border-radius:12px;background:#F8FAFD;border:1px solid #E2E8F0;">
                <h4 style="margin:0 0 4px;font-size:15px;color:#0F172A;">${escapeHtml(p.medication)}</h4>
                <p style="margin:0 0 6px;font-size:12.5px;color:#475569;">${p.form} · ${p.dosage}</p>
                <p style="margin:0;font-size:12px;color:#64748B;">Dr: ${p.doctor} · ${p.facility}</p>
              </div>
            `).join("")}
          </div>
        </section>
        <section class="detail-panel">
          <h3>Diagnostic Lab Reports</h3>
          <div class="card-grid" style="margin-top:12px;">
            ${records.labReports.map(l => `
              <div style="padding:16px;border-radius:12px;background:#F8FAFD;border:1px solid #E2E8F0;">
                <h4 style="margin:0 0 4px;font-size:15px;color:#0F172A;">${escapeHtml(l.title)}</h4>
                <p style="margin:0 0 6px;font-size:12.5px;color:#475569;">${l.lab} · ${l.date}</p>
                <div style="font-size:12px;color:#1E40AF;font-weight:700;">${l.resultSummary}</div>
              </div>
            `).join("")}
          </div>
        </section>
      </div>
      <div class="card-actions">
        <a class="button" href="../index.html?dashboard=1&amp;nav=records">Open Full Health Vault &amp; Upload Documents →</a>
      </div>`;
    return shell(titles.records[0], titles.records[1], content);
  }

  function render(restoreFilter) {
    const pages = {hospitals:hospitalsPage,beds:bedsPage,doctors:doctorsPage,medicines:medicinesPage,ambulances:ambulancesPage,blood:bloodPage,records:recordsPage,schemes:schemesPage,search:searchPage};
    const page = pages[feature];
    if (!page) {
      root.innerHTML = '<p class="empty-state">This feature page could not be loaded.</p>';
      return;
    }
    root.innerHTML = page();
    if (restoreFilter) {
      const replacement = root.querySelector(`[data-filter="${restoreFilter.name}"]`);
      if (replacement) {
        replacement.focus({preventScroll:true});
        if (typeof restoreFilter.position === "number" && replacement.setSelectionRange) replacement.setSelectionRange(restoreFilter.position,restoreFilter.position);
      }
    }
  }

  // Keep each feature filter local to the page while retaining focus during live search.
  root.addEventListener("input", event => {
    const control = event.target.closest("[data-filter]");
    if (!control) return;
    const key = control.dataset.filter;
    state[key] = control.type === "checkbox" ? control.checked : control.value;
    render({name:key,position:control.selectionStart});
  });
  root.addEventListener("change", event => {
    const control = event.target.closest("[data-filter]");
    if (!control || control.type === "checkbox" || control.type === "search") return;
    state[control.dataset.filter] = control.value;
    render();
  });
  root.addEventListener("submit", event => {
    if (event.target.id !== "ambulance-form") return;
    event.preventDefault();
    if (!event.target.reportValidity()) return;
    const form = new FormData(event.target);
    state.ambulancePreview = {pickup:String(form.get("pickup")||""),type:String(form.get("type")||"")};
    render();
    root.querySelector(".inline-status")?.scrollIntoView({block:"nearest",behavior:"smooth"});
  });
  root.addEventListener("click", event => {
    const ambulance = event.target.closest("[data-ambulance]");
    if (ambulance) {
      state.ambulancePreview = {pickup:"Demo pickup required",type:`${ambulance.dataset.ambulance} selected`};
      render();
      return;
    }
    const scheme = event.target.closest("[data-scheme-preview]");
    if (scheme) {
      const record = demo.schemes.find(item=>item.id===scheme.dataset.schemePreview);
      if (!record) return;
      state.schemeMessage = {id:record.id,text:"Preview only — nothing was submitted. Confirm eligibility and apply through the official programme channel."};
      render();
      return;
    }
    const doctor = event.target.closest("[data-doctor-preview]");
    if (doctor) {
      state.doctorMessage = doctor.dataset.doctorPreview;
      render();
    }
  });

  // Attempt live read-side sync from CareSphere REST API
  if (window.CareSphereAPI && ["hospitals", "beds"].includes(feature)) {
    window.CareSphereAPI.checkHealth(1500).then(health => {
      if (health.online) {
        window.CareSphereAPI.getHospitals("bengaluru").then(res => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            demo.hospitals = res.data.map(h => ({
              id: h.id,
              city: h.cityId || "bengaluru",
              name: h.name,
              type: h.hospitalType || h.type || "General hospital",
              location: h.locationArea || h.location || "Central District, Bengaluru",
              address: h.address || "Bengaluru",
              distance: typeof h.distanceKm === "number" ? h.distanceKm : (h.distance || 0),
              updated: h.updated || "Live API verified",
              status: h.status || "Available",
              phone: h.phone || "+91 80 2200 0000",
              facilities: h.facilities || [],
              beds: h.beds || {},
              _source: "api"
            }));
            render();
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  } else if (window.CareSphereAPI && feature === "doctors") {
    window.CareSphereAPI.checkHealth(1500).then(health => {
      if (health.online) {
        window.CareSphereAPI.getDoctors("bengaluru").then(res => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            demo.doctors = res.data.map(d => ({
              id: d.id,
              city: d.cityId || "bengaluru",
              name: d.name,
              specialty: d.specialty,
              qualification: d.qualification || "MBBS, Specialist",
              facility: d.facility || "District General Hospital",
              department: d.department || `${d.specialty} Department`,
              hours: d.workingHours || d.hours || "09:00 AM – 01:30 PM",
              distance: typeof d.distanceKm === "number" ? d.distanceKm : (d.distance || 0),
              status: d.status || "Appointments available",
              _source: "api"
            }));
            render();
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  } else if (window.CareSphereAPI && feature === "blood") {
    window.CareSphereAPI.checkHealth(1500).then(health => {
      if (health.online) {
        window.CareSphereAPI.getBloodInventory("bengaluru").then(res => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            demo.blood = res.data.map(b => ({
              id: b.id,
              group: b.group,
              city: b.cityId || "bengaluru",
              facility: b.facility,
              location: b.location || "Central District, Bengaluru",
              phone: b.phone || "+91 80 5550 0105",
              distance: typeof b.distanceKm === "number" ? b.distanceKm : (typeof b.distance === "number" ? b.distance : 2.4),
              status: b.status || "Available",
              units: typeof b.units === "number" ? b.units : 0,
              updated: b.updated || "Live API registry",
              compatible: Array.isArray(b.compatible) ? b.compatible : [b.group],
              _source: "api"
            }));
            render();
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  } else if (window.CareSphereAPI && feature === "medicines") {
    window.CareSphereAPI.checkHealth(1500).then(health => {
      if (health.online) {
        window.CareSphereAPI.getMedicines("bengaluru").then(res => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            demo.medicines = res.data.map(m => ({
              id: m.id,
              city: m.cityId || "bengaluru",
              name: m.name,
              strength: m.strength,
              availability: m.availability || "Available",
              quantity: m.quantity || "In stock",
              provider: m.provider || "Government Pharmacy",
              providerType: m.providerType || "Government pharmacy",
              location: m.location || "Central District, Bengaluru",
              distance: typeof m.distanceKm === "number" ? m.distanceKm : (typeof m.distance === "number" ? m.distance : 2.5),
              updated: m.updated || "Live API registry",
              _source: "api"
            }));
            render();
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  } else if (window.CareSphereAPI && feature === "ambulances") {
    window.CareSphereAPI.checkHealth(1500).then(health => {
      if (health.online) {
        window.CareSphereAPI.getAmbulances("bengaluru").then(res => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            const typeMap = {
              "ADVANCED_LIFE_SUPPORT": "Advanced Life Support",
              "BASIC_LIFE_SUPPORT": "Basic Life Support",
              "PATIENT_TRANSPORT": "Patient Transport"
            };
            const statusMap = {
              "AVAILABLE": "Available",
              "LIMITED": "Limited",
              "UNAVAILABLE": "Unavailable"
            };
            demo.ambulances = res.data.map(a => ({
              id: a.id,
              type: typeMap[a.type] || a.type || "Basic Life Support",
              distance: typeof a.distanceKm === "number" ? a.distanceKm : (typeof a.distance === "number" ? a.distance : 2.5),
              eta: typeof a.etaMinutes === "number" ? a.etaMinutes : (typeof a.eta === "number" ? a.eta : 10),
              status: statusMap[a.status] || a.status || "Available",
              _source: "api"
            }));
            render();
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  }

  render();
})();
