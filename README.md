```markdown
Voting Ronda RT 1 — Deployable ke Vercel
Ringkas: aplikasi voting single-question, login dengan nomor yang sudah di-set di Vercel, satu nomor satu kali vote, fireworks & scale text after vote, animated bar chart.

Prasyarat:
- Node 18+
- (Direkomendasikan) MongoDB Atlas untuk persistence (MONGODB_URI)
- Vercel account (untuk ENV vars)

Environment variables (set di Vercel Dashboard -> Project -> Settings -> Environment Variables):
- ALLOWED_NUMBERS: daftar nomor yang boleh vote, comma separated
  contoh: 08123456789,08129876543
- MONGODB_URI: (opsional tapi disarankan) mongodb+srv://user:pass@cluster..../voter?retryWrites=true&w=majority

Jika MONGODB_URI tidak diset, aplikasi menggunakan in-memory fallback (data tidak persistent — hanya untuk testing lokal).

Instal & Run lokal:
1. letakkan logo Anda di public/logo.png
2. npm install
3. Buat file .env.local (opsional untuk local):
   - ALLOWED_NUMBERS="08123456789,08129876543"
   - MONGODB_URI="mongodb+srv://..."
4. npm run dev
5. Buka http://localhost:3000

API:
- POST /api/validate-number { number } -> cek apakah nomor terdaftar & apakah sudah vote
- POST /api/vote { number, optionId } -> lakukan vote (satu nomor hanya satu kali)
- GET  /api/poll -> ambil poll & hasil

Catatan keamanan & produksi:
- Nomor disimpan plain di DB pada collection votes; jika butuh privacy, hash nomor sebelum simpan.
- Tambahkan rate-limiting & captchas bila diperlukan.
- Pastikan MONGODB_URI aman & tidak di-commit.

Deploy ke Vercel:
1. Push repo ke GitHub.
2. Import project di Vercel.
3. Set Environment Variables (ALLOWED_NUMBERS, MONGODB_URI if used).
4. Build command: npm run build
5. Output: .next (default)

Integrasi logo:
- Ganti public/logo.png dengan file logo Anda (nama harus sama).

Selesai — aplikasi siap deploy. Jika mau saya buat PR langsung ke repo sabarteros/voter, saya perlu akses repo (atau Anda beri saya fork permission). Atau saya bisa kirimkan patch (.patch) berisi semua perubahan untuk Anda apply.
```
