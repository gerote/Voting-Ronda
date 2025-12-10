// utils/allowedNumbers.js
// Normalisasi ALLOWED_NUMBERS env var ke format kanonik: digits-only, Indonesia -> leading "62..."
//
// Behavior:
// - Menghapus semua karakter non-digit
// - Jika nomor dimulai dengan "0" -> ganti leading 0 dengan "62" (contoh: 08123... -> 628123...)
// - Jika nomor dimulai langsung dengan "8" -> anggap missing leading 0 dan tambahkan "62" (838... -> 62838...)
// - Semua nomor disimpan sebagai digits-only (tanpa "+")
// - ALLOWED_NUMBERS dapat berupa JSON array, CSV, newline-atau-space-separated list

export function normalizeNumber(n) {
  if (!n && n !== 0) return "";
  let s = String(n);

  // remove everything except digits
  s = s.replace(/\D/g, "");
  if (!s) return "";

  // Indonesian heuristics:
  // - leading 0 -> replace with 62
  // - leading 8 (mobile number without leading 0) -> prepend 62
  if (s.startsWith("0")) {
    s = "62" + s.slice(1);
  } else if (s.startsWith("8")) {
    s = "62" + s;
  }
  // if already starts with 62, keep as-is
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
      // fallback to flexible parsing
    }
  }

  // fallback: split by any whitespace or comma
  const parts = trimmed.split(/[\s,]+/);
  return parts.map(p => normalizeNumber(p)).filter(Boolean);
}
