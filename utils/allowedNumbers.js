// utils/allowedNumbers.js
// Robust parser for ALLOWED_NUMBERS env var.
// Supports JSON array, CSV, newline-separated, or space-separated values.

export function normalizeNumber(n) {
  if (!n) return "";
  // remove spaces and common separators, keep only digits and leading +
  const s = String(n).replace(/[^\d+]/g, "");
  return s.trim();
}

export function allowedListFromEnv() {
  const raw = process.env.ALLOWED_NUMBERS || "";
  const trimmed = raw.trim();
  if (!trimmed) return [];

  // try JSON array first
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(x => normalizeNumber(x)).filter(Boolean);
      }
    } catch (e) {
      // fallthrough to flexible parsing
    }
  }

  // fallback: split by any whitespace or comma
  const parts = trimmed.split(/[\s,]+/);
  return parts.map(p => normalizeNumber(p)).filter(Boolean);
}
