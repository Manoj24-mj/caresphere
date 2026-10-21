# caresphere

## CareSphere prototype

CareSphere is a static healthcare ecosystem prototype. Open `index.html` for the dashboard and onboarding experience. The Find care page links to focused service walkthroughs in [`features/`](./features/index.html). The dashboard also includes a `PredictAI` section for hospital and government staff views. PredictAI currently reports that forecasts and live availability are unavailable; no genuine dataset or verified hospital connection is configured.

### Client walkthrough

Open [`features/index.html`](./features/index.html) for the presentation-oriented overview, feature highlights, a suggested demo story, and clear prototype boundaries. Each service can also be opened directly:

- [`features/bed-availability.html`](./features/bed-availability.html) — bed types, availability and distance filters.
- [`features/doctor-directory.html`](./features/doctor-directory.html) — sample clinicians and an appointment preview.
- [`features/medicine-availability.html`](./features/medicine-availability.html) — medicine/provider search and nearby/availability filters.
- [`features/ambulance-availability.html`](./features/ambulance-availability.html) — illustrative unit listings and a local, non-dispatch request preview.
- [`features/blood-availability.html`](./features/blood-availability.html) — illustrative blood-group availability.
- [`features/government-schemes.html`](./features/government-schemes.html) — programme information and an application preview.
- [`features/unified-search.html`](./features/unified-search.html) — sample search across connected services.

### Implementation notes

The pages are static HTML and can be opened directly in a browser; no build step is required. `features/features-data.js` contains shared demonstration records, `features/feature-pages.js` renders the interactive standalone service screens, and `features/feature-pages.css` provides their shared responsive styling. `assets/localization.js` provides the shared English, Kannada and Hindi language selection and translations, persisted across pages in the browser. Comments in these files identify the important data, rendering, and interaction blocks.

All availability and update times are sample data, not a live service. The ambulance preview does not contact emergency services or dispatch a vehicle. Scheme eligibility and applications require official verification; medicine content is not treatment advice.

### PredictAI data-status prototype

PredictAI is available from the hospital and government staff dashboard views. **No genuine dataset, verified hospital connection, forecasting model, or live alert service is configured.** Disease forecasts and operational availability are explicitly unavailable; no forecast numbers, resource counts, or alerts are generated. The role selector is a demo convenience, not access control.

Open `index.html` directly as before. PredictAI implementation is split across:

- `assets/predictai.js` — data-status screens, source-details form, local CSV inspection, and non-quantitative event preparedness checklist.
- `assets/predictai-core.js` — CSV parsing and schema/data-quality validation only; it does not implement forecasting.
- `assets/predictai.css` — responsive PredictAI-only styling.
- `assets/predictai-core.test.js` — dependency-free parser and schema-validation tests.

No genuine health datasets were used or independently verified for this project. If an authorized presenter elects to inspect a CSV, the screen requires the dataset title, publisher, URL, date range, geographic coverage, units, update frequency, and a user attestation that the source and file were checked. Those details are user-declared, not verified by the app. Imported observations are displayed with this limitation and processed in the current browser tab only; they are not persisted or uploaded. Disease files require `date,area,cases`; resource files require `date,area,item,daily_demand,usable_stock,lead_time_days`. CSV structural checks identify missing values, duplicate observations, invalid dates/numbers, and date gaps, but cannot prove authenticity, source accessibility, accuracy, or reporting timeliness. Do not upload patient-identifiable or otherwise sensitive data.

The disease, bed, blood, medicine, equipment, staffing, and alert sections show unavailable states because no suitable validated dataset, verified operational connection, evaluated model, or live warning service exists. Forecast history is empty because no forecasts are generated. The event form collects user-entered notes for an in-memory, non-quantitative checklist; it does not predict event-related demand or imply that an event causes an outbreak.

Run the focused tests with `node --test assets/predictai-core.test.js` (Node.js required; no package installation or build step). A future integration needs an accessible and traceable dataset, domain-approved data definitions, reporting-delay review, chronological model training and holdout evaluation, server-side authorization, audit logging, data governance, and retention controls. No backend or proposed API is currently implemented.