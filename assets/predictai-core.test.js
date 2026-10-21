const assert = require("node:assert/strict");
const test = require("node:test");
const predictAI = require("./predictai-core.js");

test("parses quoted CSV fields without fabricating health observations", () => {
  const rows = predictAI.parseCsv('name,description\nCareSphere,"health data, source pending"');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].values.description, "health data, source pending");
});

test("rejects CSV with no observations", () => {
  assert.throws(() => predictAI.parseCsv("date,area,cases"), /header and at least one data row/);
});

test("rejects malformed CSV quoting", () => {
  assert.throws(() => predictAI.parseCsv('name,description\nCareSphere,"unclosed'), /unclosed quoted field/);
});

test("validates required dataset columns", () => {
  const result = predictAI.validateDataset("name,description\nCareSphere,source pending", "disease");
  assert.match(result.errors[0], /Missing required columns: date, area, cases/);
  assert.equal(result.records.length, 0);
});
