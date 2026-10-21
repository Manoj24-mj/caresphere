(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CareSpherePredictAICore = api;
})(typeof window === "undefined" ? null : window, function () {
  "use strict";

  const diseaseHeaders = ["date", "area", "cases"];
  const resourceHeaders = ["date", "area", "item", "daily_demand", "usable_stock", "lead_time_days"];

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = "";
    let quoted = false;
    const source = String(text).replace(/^\uFEFF/, "");

    for (let index = 0; index < source.length; index += 1) {
      const character = source[index];
      if (quoted) {
        if (character === '"' && source[index + 1] === '"') {
          value += '"';
          index += 1;
        } else if (character === '"') {
          quoted = false;
        } else {
          value += character;
        }
      } else if (character === '"' && value.length === 0) {
        quoted = true;
      } else if (character === ",") {
        row.push(value.trim());
        value = "";
      } else if (character === "\n" || character === "\r") {
        if (character === "\r" && source[index + 1] === "\n") index += 1;
        row.push(value.trim());
        if (row.some(cell => cell !== "")) rows.push(row);
        row = [];
        value = "";
      } else {
        value += character;
      }
    }

    if (quoted) throw new Error("CSV contains an unclosed quoted field.");
    row.push(value.trim());
    if (row.some(cell => cell !== "")) rows.push(row);
    if (rows.length < 2) throw new Error("CSV must include a header and at least one data row.");
    const headers = rows.shift().map(header => header.trim().toLowerCase());
    if (headers.some(header => !header)) throw new Error("CSV headers cannot be empty.");
    if (new Set(headers).size !== headers.length) throw new Error("CSV headers must be unique.");
    return rows.map((cells, index) => ({
      line: index + 2,
      extraCells: cells.slice(headers.length).filter(cell => cell !== ""),
      values: Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex] || ""]))
    }));
  }

  function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function validateDataset(text, type) {
    const rows = parseCsv(text);
    const requiredHeaders = type === "disease" ? diseaseHeaders : resourceHeaders;
    const headers = Object.keys(rows[0].values);
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length) {
      return {
        records: [], errors: [`Missing required columns: ${missingHeaders.join(", ")}.`],
        warnings: [], missingValues: 0, duplicates: 0, rowCount: rows.length
      };
    }

    const errors = [];
    const warnings = [];
    const records = [];
    const seen = new Set();
    let missingValues = 0;
    let duplicates = 0;

    rows.forEach(({ line, values, extraCells }) => {
      if (extraCells.length) {
        errors.push(`Row ${line}: contains values without matching headers.`);
        return;
      }
      const required = type === "disease" ? diseaseHeaders : resourceHeaders;
      const emptyFields = required.filter(field => !values[field]);
      if (emptyFields.length) {
        missingValues += emptyFields.length;
        errors.push(`Row ${line}: missing ${emptyFields.join(", ")}.`);
        return;
      }
      if (!isValidDate(values.date)) {
        errors.push(`Row ${line}: date must use a valid YYYY-MM-DD value.`);
        return;
      }

      let record;
      if (type === "disease") {
        const cases = Number(values.cases);
        if (!Number.isFinite(cases) || cases < 0) {
          errors.push(`Row ${line}: cases must be a non-negative number.`);
          return;
        }
        record = { date: values.date, area: values.area, cases };
      } else {
        const dailyDemand = Number(values.daily_demand);
        const usableStock = Number(values.usable_stock);
        const leadTimeDays = Number(values.lead_time_days);
        if (![dailyDemand, usableStock, leadTimeDays].every(Number.isFinite)
          || dailyDemand < 0 || usableStock < 0 || leadTimeDays < 0) {
          errors.push(`Row ${line}: daily_demand, usable_stock and lead_time_days must be non-negative numbers.`);
          return;
        }
        record = {
          date: values.date, area: values.area, item: values.item,
          dailyDemand, usableStock, leadTimeDays
        };
      }

      const identity = [record.date, record.area, record.item || ""].join("|").toLowerCase();
      if (seen.has(identity)) {
        duplicates += 1;
        warnings.push(`Row ${line}: duplicate date and location/item was ignored.`);
        return;
      }
      seen.add(identity);
      records.push(record);
    });

    if (missingValues) warnings.push(`${missingValues} required value(s) were missing; affected rows were excluded.`);
    const grouped = groupRecords(records);
    Object.values(grouped).forEach(group => {
      const sortedDates = group.map(record => record.date).sort();
      const hasGap = sortedDates.some((date, index) => index > 0
        && (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${sortedDates[index - 1]}T00:00:00Z`)) > 86400000);
      if (hasGap) warnings.push("Date gaps found; missing days are not imputed.");
    });
    return { records, errors, warnings, missingValues, duplicates, rowCount: rows.length };
  }

  function groupRecords(records) {
    return records.reduce((groups, record) => {
      const key = `${record.area}|${record.item || ""}`;
      (groups[key] ||= []).push(record);
      return groups;
    }, {});
  }

  return { parseCsv, validateDataset };
});
