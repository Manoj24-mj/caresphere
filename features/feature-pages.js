/* Standalone feature-page renderer and interactions for the client walkthrough. */
(() => {
  "use strict";

  const demo = window.CareSphereDemo;
  const root = document.getElementById("feature-root");
  const feature = document.body.dataset.feature;
  const params = new URLSearchParams(window.location.search);
  const titles = {
    beds:["Find a Hospital","Search sample hospitals and check reported beds."],
    doctors:["Find a Doctor","Browse sample doctors and preview an appointment request."],
    medicines:["Check Medicines","Search sample medicine stock at nearby pharmacies."],
    ambulances:["Emergency help","Preview nearby ambulance options. No vehicle will be sent."],
    blood:["Find Blood","Check recent sample updates reported by blood banks."],
    schemes:["Government Health Benefits","Explore support programmes and check official rules."],
    search:["Search CareSphere","Search sample hospitals, doctors, beds, medicines, blood stock, ambulances and schemes."]
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
    return `<article class="resource-card"><div class="card-heading"><div><h2>${escapeHtml(hospital.name)}</h2><p>${escapeHtml(hospital.type)}</p></div>${statusPill(hospital.status)}</div>
      <div class="resource-meta"><span>${escapeHtml(hospital.location)}</span><span>${hospital.distance} km</span></div>
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
    return `<article class="resource-card"><div class="card-heading"><div><h2>${escapeHtml(medicine.name)} ${escapeHtml(medicine.strength)}</h2><p>${escapeHtml(medicine.provider)}</p></div>${statusPill(medicine.availability)}</div>
      <div class="resource-meta"><span>${escapeHtml(medicine.providerType)}</span><span>${escapeHtml(medicine.location)}</span><span>${medicine.distance} km</span></div>
      <div class="resource-meta"><strong>${escapeHtml(medicine.quantity)}</strong></div><p class="sample-update">Last sample update: ${escapeHtml(medicine.updated)}</p></article>`;
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
      <p class="result-count">${medicines.length} sample listing${medicines.length===1?"":"s"} match your filters</p><section class="card-grid">${medicines.map(medicineCard).join("") || '<p class="empty-state">No sample listings match. Try a different medicine or filter.</p>'}</section>
      <p class="prototype-note notice-warning">Stock is illustrative. This is not medical advice; do not substitute a prescription without consulting a doctor or pharmacist.</p>`;
    return shell(titles.medicines[0],titles.medicines[1],content);
  }

  function ambulanceCard(ambulance) {
    const action = ambulance.status === "Unavailable" ? "" : `<button class="button secondary" type="button" data-ambulance="${escapeHtml(ambulance.id)}">Preview request</button>`;
    return `<article class="resource-card"><div class="card-heading"><div><h2>${escapeHtml(ambulance.type)}</h2><p>${escapeHtml(ambulance.id)}</p></div>${statusPill(ambulance.status)}</div>
      <div class="resource-meta"><span>${ambulance.distance} km · illustrative</span><span>Sample ETA ${ambulance.eta} min</span></div><div class="card-actions">${action}</div></article>`;
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
    return `<article class="resource-card"><div class="card-heading"><div><h2>${escapeHtml(item.group)} blood</h2><p>${escapeHtml(item.facility)}</p></div>${statusPill(item.status)}</div>
      <div class="resource-meta"><span>${escapeHtml(item.location)}</span><span>${item.distance} km</span></div><div class="resource-meta"><strong>${item.units===null?"Units not reported":`${item.units} units (sample)`}</strong></div><p class="sample-update">${escapeHtml(item.updated)}</p></article>`;
  }

  function bloodPage() {
    const content = `<section class="card-grid">${demo.blood.map(bloodCard).join("")}</section>
      <p class="prototype-note notice-warning">Blood-stock data can change quickly. Contact the blood bank to confirm stock and compatibility. In an emergency, contact local emergency services.</p>`;
    return shell(titles.blood[0],titles.blood[1],content);
  }

  function doctorsPage() {
    const q = state.query.trim().toLowerCase();
    const doctors = demo.doctors.filter(doctor => !q || `${doctor.name} ${doctor.specialty} ${doctor.facility}`.toLowerCase().includes(q));
    const cards = doctors.map(doctor => `<article class="resource-card"><div class="card-heading"><div><h2>${escapeHtml(doctor.name)}</h2><p>${escapeHtml(doctor.specialty)}</p></div>${statusPill(doctor.status)}</div>
      <div class="resource-meta"><span>${escapeHtml(doctor.facility)}</span><span>${doctor.distance} km</span></div>
      <div class="card-actions"><button class="button secondary" type="button" data-doctor-preview="${escapeHtml(doctor.name)}">Preview appointment</button></div>
      ${state.doctorMessage === doctor.name ? '<p class="inline-status" role="status">Appointment preview only — no appointment was booked or sent to the care team.</p>' : ""}</article>`).join("");
    const content = `<div class="toolbar"><input type="search" aria-label="Search doctors" placeholder="Search name, specialty or hospital" data-filter="query" value="${escapeHtml(state.query)}"></div>
      <p class="result-count">${doctors.length} sample care team${doctors.length===1?"":"s"} found</p><section class="card-grid">${cards || '<p class="empty-state">No sample doctors match that search.</p>'}</section>
      <p class="prototype-note notice-warning">Clinician names and appointment availability are illustrative. This prototype does not book a real appointment.</p>`;
    return shell("Find a doctor",titles.doctors[1],content);
  }

  function schemesPage() {
    const cards = demo.schemes.map(scheme => {
      const message = state.schemeMessage && state.schemeMessage.id === scheme.id ? `<p class="inline-status" role="status">${escapeHtml(state.schemeMessage.text)}</p>` : "";
      return `<article class="scheme-card"><div class="card-heading"><div><h2>${escapeHtml(scheme.name)}</h2><p>${escapeHtml(scheme.description)}</p></div><span class="status unknown">Check rules</span></div>
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
    const schemeCategory = category("scheme","schemes","government");
    const results = [
      ...demo.hospitals.filter(item=>hospitalCategory||`${item.name} ${item.type} ${item.location}`.toLowerCase().includes(q)).map(item=>["Hospital",item.name,`${item.type} · ${item.distance} km`,"bed-availability.html"]),
      ...demo.hospitals.filter(()=>bedCategory||Boolean(typeQuery)).map(item=>["Bed availability",`${typeQuery||"All"} beds · ${item.name}`,`${item.distance} km · Sample counts`,"bed-availability.html"+(typeQuery?`?type=${encodeURIComponent(typeQuery)}`:"")]),
      ...demo.medicines.filter(item=>medicineCategory||`${item.name} ${item.strength} ${item.provider}`.toLowerCase().includes(q)).map(item=>["Medicine",`${item.name} ${item.strength}`,`${item.provider} · ${item.distance} km`,"medicine-availability.html"+(medicineCategory?"":`?q=${encodeURIComponent(item.name)}`)]),
      ...demo.doctors.filter(item=>doctorCategory||`${item.name} ${item.specialty} ${item.facility}`.toLowerCase().includes(q)).map(item=>["Doctor",item.name,`${item.specialty} · ${item.facility} · ${item.distance} km`,"doctor-directory.html"+(doctorCategory?"":`?q=${encodeURIComponent(item.name)}`)]),
      ...demo.blood.filter(item=>bloodCategory||`${item.group} ${item.facility} ${item.location}`.toLowerCase().includes(q)).map(item=>["Blood",`${item.group} blood · ${item.facility}`,`${item.distance} km · ${item.status}`,"blood-availability.html"]),
      ...demo.ambulances.filter(item=>ambulanceCategory||`${item.id} ${item.type}`.toLowerCase().includes(q)).map(item=>["Ambulance",item.id,`${item.type} · ${item.distance} km · ${item.status}`,"ambulance-availability.html"]),
      ...demo.schemes.filter(item=>schemeCategory||`${item.name} ${item.description}`.toLowerCase().includes(q)).map(item=>["Scheme",item.name,item.description,"government-schemes.html"])
    ];
    const rows = results.map(([kind,title,description,href])=>`<article class="resource-card"><div class="card-heading"><div><span class="eyebrow">${escapeHtml(kind)}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p></div></div><div class="card-actions"><a class="button secondary" href="${href}">View feature →</a></div></article>`).join("");
    const content = `<div class="toolbar"><input type="search" aria-label="Search all sample services" placeholder="Try ICU, a hospital, blood group or scheme" data-filter="query" value="${escapeHtml(state.query)}"></div>
      <p class="result-count">${results.length} sample result${results.length===1?"":"s"} ${q?"matched":"available to explore"}</p><section class="card-grid">${rows || '<p class="empty-state">No sample results matched. Try “ICU”, “doctor”, “blood”, or “scheme”.</p>'}</section>`;
    return shell(titles.search[0],titles.search[1],content);
  }

  function render(restoreFilter) {
    const pages = {beds:bedsPage,doctors:doctorsPage,medicines:medicinesPage,ambulances:ambulancesPage,blood:bloodPage,schemes:schemesPage,search:searchPage};
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

  render();
})();
