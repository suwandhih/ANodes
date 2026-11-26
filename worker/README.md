# ☁️ K77 — Sinkron Turso lewat Cloudflare Worker

> Perantara supaya **token Turso tidak ditanam di berkas ANodes** (berkas itu dikirim ke HP).

## ✅ SUDAH TERPASANG (30 Okt 2026) — tinggal isi di ANodes

| Hal | Nilai |
|---|---|
| **Alamat Worker** | `https://anodes-sync.suwandhih.workers.dev` |
| **Kunci aplikasi** | `anodes-suwandhi-2026` |
| Database Turso | `libsql://anodes-suwandhi.aws-ap-southeast-1.turso.io` (Singapore) |
| Tabel | `sinkron` (dibuat otomatis) |
| Variabel Worker | `TURSO_URL` · `TURSO_TOKEN` · `KUNCI_APP` — **ketiganya Secret** ✅ |

**Yang perlu dilakukan di ANodes (sekali saja):**
**File ▼ → ☁️ Sinkron…** → isi **Alamat Worker** + **Kunci aplikasi** di atas →
**Uji sambungan** (harus muncul ✅) → selesai.

**Sudah diuji 30 Okt 2026:** Worker tanpa kunci ⇒ **401** · dengan kunci ⇒ **200** ·
tulis 1 kunci ⇒ `{"ok":true,"ditulis":1}` · baca kembali ⇒ data utuh ·
tabel `sinkron` terbuat di Turso · ANodes ⇄ Worker ⇒ *"Sambungan berhasil · 1 kunci di server"* ·
sinkron penuh ⇒ *"4 kunci terkirim · 1 catatan masuk"* ✅

⚠️ **`_kredensial.json`** di folder ini memuat token — **JANGAN dikirim ke siapa pun** dan
**tidak ikut** ke `ANodes-1berkas.html` (sudah diperiksa: token **tidak ada** di berkas HP).

---

## 1. Yang harus disiapkan (kalau mau mengulang dari nol)

| # | Hal | Dari mana |
|---|---|---|
| 1 | **URL database** `libsql://<db>-<org>.turso.io` | Dasbor Turso → pilih database → **Connect** / **URL** |
| 2 | **Auth token** | Dasbor Turso → database → **Create Token** |
| 3 | **Akun Cloudflare** | sudah punya ✅ |
| 4 | **Kunci aplikasi** (kata sandi bebas) | Bapak tentukan sendiri, mis. `anodes-suwandhi-2026` |

⚠️ **`https://app.turso.tech/suwandhi?branches=1` BUKAN alamat database** — itu halaman dasbor.
Alamat database selalu berbentuk **`libsql://…`**.

## 2. Deploy Worker (±5 menit)

1. Dasbor Cloudflare → **Workers & Pages** → **Create** → **Worker**
2. Beri nama, mis. `anodes-sync`
3. **Edit code** → hapus isi bawaan → tempel **seluruh isi `worker.js`**
4. **Deploy**
5. Masuk **Settings → Variables and Secrets**, tambahkan **3**:

| Nama | Nilai |
|---|---|
| `TURSO_URL` | `libsql://<db>-<org>.turso.io` |
| `TURSO_TOKEN` | token dari Turso |
| `KUNCI_APP` | kata sandi pilihan Bapak |

6. **Deploy ulang** (supaya variabel terbaca)
7. Catat alamat Worker, mis. `https://anodes-sync.<nama>.workers.dev`

## 3. Pasang di ANodes

Menu **File → ☁️ Sinkron…** → isi:

| Kolom | Isi |
|---|---|
| Alamat Worker | `https://anodes-sync.<nama>.workers.dev` |
| Kunci aplikasi | sama dengan `KUNCI_APP` |

Lalu tekan **Simpan pengaturan** → **Uji sambungan**.

## 4. Cara kerja sinkron

| Hal | Perilaku |
|---|---|
| **Otomatis** | setiap catatan disimpan (auto-save 700 ms) → dikirim ke server (tertunda 3 detik) |
| **Manual** | tombol **☁️ Sinkron sekarang** kapan pun perlu |
| **Saat aplikasi dibuka** | otomatis mengambil data terbaru dari server |
| **Bentrok** (PC & HP mengubah catatan yang sama) | **yang `waktu`-nya lebih baru menang** — per catatan, bukan seluruh berkas |
| **Anti-dobel** | catatan dicocokkan per **`id`**, jadi tidak muncul 2× |
| **Tanpa internet** | tetap jalan normal (offline) — sinkron menyusul saat online |

## 5. Yang disinkronkan

| Kunci | Isi |
|---|---|
| `anodes-catatan-v1` | ✅ catatan (id · judul · isi · kategori · waktu) |
| `anodes-setting-v1` | ✅ huruf · kecerahan · pintasan |
| `anodes-kamus-pribadi` | ✅ istilah buatan pengguna |
| `anodes-rantai-v1` | ✅ rantai ayat tersimpan |

❌ **Tidak** disinkronkan: data Alkitab 23 MB (sudah ada di tiap perangkat), posisi baca terakhir,
pilihan tampilan, plugin terpasang, editan berkas `.md` proyek.

## 6. Kalau ada masalah

| Gejala | Sebab & jalan |
|---|---|
| `Kunci aplikasi salah` | `KUNCI_APP` di Worker ≠ yang diisi di ANodes |
| `TURSO_URL / TURSO_TOKEN belum diisi` | variabel belum ditambahkan / belum deploy ulang |
| `Turso menolak (401)` | token salah atau kedaluwarsa → buat token baru |
| `Turso menolak (404)` | `TURSO_URL` salah — pastikan bentuknya `libsql://…` |
| `Failed to fetch` | alamat Worker salah, atau Worker belum deploy |
| Data tidak muncul di perangkat lain | tekan **☁️ Sinkron sekarang** di kedua perangkat |
