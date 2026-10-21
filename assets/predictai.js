(function (root) {
  "use strict";

  const core = root.CareSpherePredictAICore;
  const labels = {
    disease: "Disease case counts",
    bed: "Hospital bed demand",
    blood: "Blood inventory",
    medicine: "Medicine inventory",
    equipment: "Medical equipment demand",
    staffing: "Healthcare staffing demand"
  };
  const state = {
    type: "disease",
    records: [],
    source: null,
    quality: null,
    busy: false,
    importRequestId: 0,
    error: "",
    provenance: {},
    eventPlan: null,
    eventError: ""
  };
  const provenanceFields = [
    ["title", "Dataset title"],
    ["publisher", "Publisher"],
    ["url", "Source URL"],
    ["startDate", "Date range start"],
    ["endDate", "Date range end"],
    ["coverage", "Geographic coverage"],
    ["units", "Units"],
    ["frequency", "Update frequency"]
  ];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function getProvenance() {
    const form = document.querySelector("[data-predictai-provenance]");
    if (!form) return state.provenance;
    const values = {};
    provenanceFields.forEach(([key]) => {
      values[key] = form.elements.namedItem(key).value.trim();
    });
    values.attested = form.elements.namedItem("sourceAttested").checked;
    state.provenance = values;
    return values;
  }

  function provenanceError(provenance) {
    const missing = provenanceFields.filter(([key]) => !provenance[key]);
    if (missing.length) return "Complete all source details before selecting a file.";
    let sourceUrl;
    try {
      sourceUrl = new URL(provenance.url);
    } catch {
      return "Enter a valid source URL that you checked.";
    }
    if (!["https:", "http:"].includes(sourceUrl.protocol)) {
      return "The source URL must use HTTP or HTTPS.";
    }
    if (!isValidDate(provenance.startDate)
      || !isValidDate(provenance.endDate)
      || provenance.startDate > provenance.endDate) {
      return "Enter a valid date range in YYYY-MM-DD format.";
    }
    if (!provenance.attested) return "Confirm that you checked the cited source and file before importing.";
    return "";
  }

  function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function hasInsufficientHistory() {
    if (!state.quality || !state.records.length) return false;
    const groups = new Map();
    state.records.forEach(record => {
      const key = `${record.area}|${record.item || ""}`;
      groups.set(key, (groups.get(key) || 0) + 1);
    });
    return Array.from(groups.values()).some(count => count < 2);
  }

  function dataStateMessage() {
    if (state.busy) return `<div class="predictai-state" role="status" aria-live="polite"><span class="predictai-spinner" aria-hidden="true"></span><strong>Inspecting uploaded file</strong><span>Checking its CSV structure and observations in this browser tab.</span></div>`;
    if (state.error) return `<div class="predictai-state is-error" role="alert"><strong>File not available</strong><span>${escapeHtml(state.error)}</span></div>`;
    if (!state.records.length) return `<div class="predictai-state"><strong>Forecast unavailable — a suitable validated dataset has not been connected.</strong><span>No genuine historical dataset or validated forecasting model is configured in this prototype.</span></div>`;
    if (hasInsufficientHistory()) return `<div class="predictai-state is-warning" role="status"><strong>Insufficient historical observations to generate a reliable forecast.</strong><span>This prototype also has no independently verified dataset or evaluated forecasting model. Imported observations are shown for inspection only.</span></div>`;
    return `<div class="predictai-state is-warning" role="status"><strong>Forecast unavailable</strong><span>This prototype has no independently verified dataset or evaluated forecasting model. Imported observations are shown for inspection only; no forecast is generated.</span></div>`;
  }

  function dataQuality() {
    if (!state.quality) return `<p class="predictai-muted">No dataset has been imported or verified in this prototype.</p>`;
    const quality = state.quality;
    const warnings = quality.warnings.map(warning => `<li>${escapeHtml(warning)}</li>`).join("");
    const errors = quality.errors.map(error => `<li>${escapeHtml(error)}</li>`).join("");
    return `<dl class="predictai-quality-list">
      <div><dt>Rows received</dt><dd>${quality.rowCount}</dd></div>
      <div><dt>Valid observations</dt><dd>${quality.records.length}</dd></div>
      <div><dt>Missing required values</dt><dd>${quality.missingValues}</dd></div>
      <div><dt>Duplicate observations</dt><dd>${quality.duplicates}</dd></div>
    </dl>${errors ? `<h4>Validation errors</h4><ul class="predictai-messages is-error">${errors}</ul>` : ""}
    ${warnings ? `<h4>Quality warnings</h4><ul class="predictai-messages">${warnings}</ul>` : ""}`;
  }

  function renderProvenance() {
    const inputs = provenanceFields.map(([key, label]) => {
      const type = key.endsWith("Date") ? "date" : key === "url" ? "url" : "text";
      return `<label>${label}<input name="${key}" type="${type}" data-provenance="${key}" value="${escapeHtml(state.provenance[key] || "")}" required></label>`;
    }).join("");
    return `<form class="predictai-form-grid predictai-provenance" data-predictai-provenance>
      ${inputs}
      <label class="predictai-attestation"><input type="checkbox" name="sourceAttested" data-provenance="attested" ${state.provenance.attested ? "checked" : ""}>I checked the original source, file, dates, coverage, and units. The app does not independently verify them.</label>
      <label class="predictai-file">Import CSV<input type="file" accept=".csv,text/csv" data-predictai-file><small>Local browser processing only. Do not upload personal or sensitive health information.</small></label>
    </form>`;
  }

  function renderObservations() {
    if (!state.records.length || !state.source) return `<p class="predictai-muted">No observations to display.</p>`;
    const records = state.records.slice().sort((a, b) => a.date.localeCompare(b.date));
    const rows = records.map(record => {
      const values = state.type === "disease"
        ? [record.date, record.area, record.cases]
        : [record.date, record.area, record.item, record.dailyDemand, record.usableStock, record.leadTimeDays];
      return `<tr>${values.map(value => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`;
    }).join("");
    const headers = state.type === "disease"
      ? ["Date", "Area", "Observed cases"]
      : ["Date", "Area", "Item", "Daily demand", "Usable stock snapshot", "Lead time (days)"];
    return `<p class="predictai-tag">User-supplied observations · source not independently verified</p>
      <dl class="predictai-quality-list">
        <div><dt>Imported file</dt><dd>${escapeHtml(state.source.fileName)}</dd></div>
        <div><dt>Dataset title</dt><dd>${escapeHtml(state.source.title)}</dd></div>
        <div><dt>Publisher</dt><dd>${escapeHtml(state.source.publisher)}</dd></div>
        <div><dt>Source URL</dt><dd><a href="${escapeHtml(state.source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(state.source.url)}</a></dd></div>
        <div><dt>Date range</dt><dd>${escapeHtml(state.source.startDate)} to ${escapeHtml(state.source.endDate)}</dd></div>
        <div><dt>Geographic coverage</dt><dd>${escapeHtml(state.source.coverage)}</dd></div>
        <div><dt>Units</dt><dd>${escapeHtml(state.source.units)}</dd></div>
        <div><dt>Update frequency</dt><dd>${escapeHtml(state.source.frequency)}</dd></div>
        <div><dt>Latest observation date</dt><dd>${escapeHtml(records[records.length - 1].date)}</dd></div>
      </dl>
      <div class="predictai-table-wrap" tabindex="0" aria-label="Scrollable imported observation table"><table class="predictai-table"><caption>Imported historical observations — user-attested source, not independently verified</caption>
      <thead><tr>${headers.map(header => `<th scope="col">${header}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function renderEventPlanner() {
    const plan = state.eventPlan;
    return `<form class="predictai-form" data-predictai-form="event">
      <label>Event name<input name="eventName" required maxlength="120" value="${escapeHtml(plan?.name || "")}" placeholder="e.g. Community festival"></label>
      <label>Location<input name="eventLocation" required maxlength="120" value="${escapeHtml(plan?.location || "")}" placeholder="District or facility"></label>
      <div class="predictai-form-row"><label>Start date<input name="eventStart" type="date" required value="${escapeHtml(plan?.start || "")}"></label><label>End date<input name="eventEnd" type="date" required value="${escapeHtml(plan?.end || "")}"></label></div>
      <label>Expected attendance, if known<input name="attendance" type="number" min="0" step="1" value="${escapeHtml(plan?.attendance ?? "")}" placeholder="Optional"></label>
      <label>Relevant historical observations<textarea name="eventObservations" rows="3" maxlength="1000" placeholder="Describe event-linked records for human review. Do not include personal information.">${escapeHtml(plan?.observations || "")}</textarea></label>
      <label>Available hospital resource information<textarea name="resourceNotes" rows="3" maxlength="1000" placeholder="Optional notes for human review only.">${escapeHtml(plan?.resources || "")}</textarea></label>
      <button class="button" type="submit">Build preparedness checklist</button>
    </form>${state.eventError ? `<p class="predictai-state is-error" role="alert">${escapeHtml(state.eventError)}</p>` : ""}
    ${plan ? `<div class="predictai-event-result" role="status"><h4>${escapeHtml(plan.name)} · ${escapeHtml(plan.location)}</h4><p>${escapeHtml(plan.start)} to ${escapeHtml(plan.end)}${plan.attendance === "" ? " · attendance not provided" : ` · ${Number(plan.attendance).toLocaleString()} expected attendees (user supplied)`}</p><p>Notes are user-entered and not verified. This checklist does not estimate event-related disease or resource demand. An event is not assumed to cause an outbreak.</p>${plan.observations ? `<p><strong>Historical context entered:</strong> ${escapeHtml(plan.observations)}</p>` : ""}${plan.resources ? `<p><strong>Resource summary entered:</strong> ${escapeHtml(plan.resources)}</p>` : ""}<ul><li>Confirm facility contacts, escalation routes, staffing coverage, first-aid arrangements, and accessible public information with responsible teams.</li><li>Have qualified public-health and facility teams review relevant evidence, data freshness, and limitations.</li></ul></div>` : `<p class="predictai-muted">Checklist only. No event-related forecast is calculated.</p>`}`;
  }

  function render() {
    const unavailable = dataStateMessage();
    return `<section class="predictai-experience" aria-label="PredictAI data and forecasting status">
      <header class="predictai-banner"><div class="predictai-brand"><div class="predictai-logo" aria-hidden="true"><span>P</span></div><div class="predictai-copy"><strong>PredictAI</strong><small>Data status and preparedness</small></div></div><span class="predictai-highlight">No verified live feed</span></header>
      <div class="predictai-disclaimer" role="note"><strong>Current capability:</strong> No genuine dataset, hospital connection, evaluated forecasting model, or live alert service is configured. This prototype will not create forecasts, availability figures, or alerts. Imported records remain in browser memory and are not independently verified.</div>
      <nav class="predictai-tabs" aria-label="PredictAI sections">${[["overview","Overview"],["disease","Disease"],["beds","Beds"],["blood","Blood"],["medicine","Medicines"],["equipment","Equipment"],["staffing","Staffing"],["alerts","Alerts"],["preparedness","Preparedness"],["planner","Event planner"],["history","History & data"]].map(([id,label]) => `<a href="#predictai-${id}">${label}</a>`).join("")}</nav>
      <section class="predictai-panel predictai-import" id="predictai-overview"><div class="predictai-section-heading"><div><h2>Dataset source and inspection</h2><p>Record provenance and confirm you checked the original source before inspecting a CSV.</p></div><span class="predictai-data-badge">${state.source ? "User-attested source · not independently verified" : "No dataset connected"}</span></div>
        <label>Data category<select data-predictai-type>${Object.entries(labels).map(([key,label]) => `<option value="${key}" ${state.type === key ? "selected" : ""}>${label}</option>`).join("")}</select></label>
        ${renderProvenance()}
        <details class="predictai-schema"><summary>CSV schema and data requirements</summary><p>Use UTF-8 CSV with ISO dates (YYYY-MM-DD). Disease case-count CSV requires <code>date,area,cases</code>. Resource CSV requires <code>date,area,item,daily_demand,usable_stock,lead_time_days</code>. Keep units and reporting cadence consistent. The file is checked for required columns, invalid values, missing values, duplicates, and date gaps. These checks do not verify the publisher, source URL, or whether records are genuine. Reporting delays cannot be identified automatically. Never upload identifiable or sensitive health data.</p></details>
        ${unavailable}
      </section>
      <div class="predictai-section-grid">
        <section class="predictai-panel" id="predictai-disease"><h3>Disease case counts</h3><p>Forecast unavailable — a suitable validated dataset has not been connected. No disease forecast or outbreak-risk classification is generated.</p></section>
        <section class="predictai-panel" id="predictai-beds"><h3>Hospital bed demand</h3><p>Live availability unavailable — no verified hospital data connection.</p></section>
        <section class="predictai-panel" id="predictai-blood"><h3>Blood inventory</h3><p>Live availability unavailable — no verified hospital data connection.</p></section>
        <section class="predictai-panel" id="predictai-medicine"><h3>Medicine stock</h3><p>Live availability unavailable — no verified hospital data connection.</p></section>
        <section class="predictai-panel" id="predictai-equipment"><h3>Medical equipment demand</h3><p>Live availability unavailable — no verified hospital data connection.</p></section>
        <section class="predictai-panel" id="predictai-staffing"><h3>Healthcare staffing</h3><p>Live availability unavailable — no verified hospital data connection.</p></section>
      </div>
      <section class="predictai-panel" id="predictai-alerts"><h3>Early-warning alerts</h3><p>No live alert service or verified operational data connection is configured. No alerts are generated or displayed.</p></section>
      <section class="predictai-panel" id="predictai-preparedness"><h3>Preparedness action planner</h3><p>General checklist only. No public warnings, patient transfers, treatments, or purchases are triggered.</p><ul class="predictai-action-list"><li>Confirm data source, reporting date, units, and coverage directly with its publisher.</li><li>Have qualified health and facility teams review current conditions and any proposed model before operational use.</li><li>Record accountable human review and locally approved next steps outside this prototype.</li></ul></section>
      <section class="predictai-panel" id="predictai-planner"><h3>Festival and event preparedness</h3><p>Enter details to create a non-quantitative readiness checklist. No event-linked data or demand forecast is available.</p>${renderEventPlanner()}</section>
      <section class="predictai-section-grid" id="predictai-history"><article class="predictai-panel"><h3>Forecast history</h3><p>No forecasts have been generated or saved.</p></article><article class="predictai-panel"><h3>Dataset and data quality</h3><p>All imported file information is temporary and clears when this page is reloaded.</p>${dataQuality()}${renderObservations()}</article><article class="predictai-panel"><h3>Model evaluation</h3><span class="predictai-tag">Not evaluated</span><p>No forecasting model is implemented or validated. Forecasting requires chronological training and holdout evaluation using a suitable, traceable dataset and domain-reviewed metrics.</p></article></section>
      <details class="predictai-api"><summary>Future integration requirements</summary><p>No API is implemented. A future connection requires a verifiable source, publisher, coverage, units, reporting dates, data-quality review, server-side authorization, audit logging, and a model evaluated on chronological holdout data. This browser prototype is not a secure medical record.</p></details>
    </section>`;
  }

  function clearDataset() {
    state.importRequestId += 1;
    state.busy = false;
    state.records = [];
    state.source = null;
    state.quality = null;
    state.error = "";
  }

  function loadText(text, fileName, provenance) {
    const result = core.validateDataset(text, state.type);
    state.quality = result;
    state.records = result.records;
    state.source = { ...provenance, fileName };
    state.error = result.records.length ? "" : "The file contains no valid observations. Review its required columns and data-quality messages.";
    const dates = result.records.map(record => record.date).sort();
    if (dates.length && (dates[0] < provenance.startDate || dates[dates.length - 1] > provenance.endDate)) {
      result.warnings.push("Observed file dates fall outside the source date range declared by the user.");
    }
  }

  function refresh() {
    const content = document.getElementById("content");
    if (content && content.querySelector(".predictai-experience")) content.innerHTML = render();
  }

  function renderAuthorized(role) {
    if (role !== "hospital" && role !== "government") {
      return `<section class="predictai-panel"><h2>PredictAI preview is restricted</h2><p>This demo workspace is intended for hospital or government staff views. The role selector does not authenticate users or protect real data.</p></section>`;
    }
    return render();
  }

  document.addEventListener("change", event => {
    const target = event.target;
    if (target.matches("[data-provenance]")) {
      getProvenance();
    } else if (target.matches("[data-predictai-type]")) {
      state.type = target.value;
      clearDataset();
      refresh();
    } else if (target.matches("[data-predictai-file]") && target.files?.[0]) {
      const file = target.files[0];
      const provenance = getProvenance();
      const problem = provenanceError(provenance);
      if (problem) {
        clearDataset();
        state.error = problem;
        refresh();
        return;
      }
      clearDataset();
      const requestId = state.importRequestId;
      state.busy = true;
      refresh();
      file.text().then(text => {
        if (requestId === state.importRequestId) loadText(text, file.name, provenance);
      }).catch(error => {
        if (requestId === state.importRequestId) state.error = error.message || "Unable to read the selected CSV file.";
      }).finally(() => {
        if (requestId === state.importRequestId) {
          state.busy = false;
          refresh();
        }
      });
    }
  });

  document.addEventListener("submit", event => {
    const form = event.target;
    if (form.dataset.predictaiForm !== "event") return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const start = String(values.get("eventStart"));
    const end = String(values.get("eventEnd"));
    if (end < start) {
      state.eventError = "Event end date must be on or after its start date.";
      refresh();
      return;
    }
    state.eventError = "";
    state.eventPlan = {
      name: String(values.get("eventName")).trim(),
      location: String(values.get("eventLocation")).trim(),
      start, end, attendance: String(values.get("attendance") || ""),
      observations: String(values.get("eventObservations") || "").trim(),
      resources: String(values.get("resourceNotes") || "").trim()
    };
    refresh();
  });

  root.CareSpherePredictAI = { render: renderAuthorized };
})(window);
