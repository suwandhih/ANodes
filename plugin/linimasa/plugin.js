/* ============================================================
   ANodes — plugin/linimasa/plugin.js
   KETERANGAN PLUGIN: 🕒 Linimasa Sejarah   (K87 — 3 Nov 2026)

   💬 Pemilik proyek 3 Nov 2026: *“Linimasa sejarah bukannya sudah ada ? atau ini
     beda.. mengukur masa ?”* ⇒ dijawab **BEDA**, lalu dipilih **kerjakan**.

   ⚠️ BEDA dari 📖 Sejarah Kitab (K55) — diukur 3 Nov 2026:
     📖 Sejarah Kitab  = panel **per kitab** · 66 entri · hanya **rentang tahun**
                          per kitab ("±1445–1405 SM") · tidak bisa dibandingkan
     🕒 Linimasa       = **450 PERISTIWA** berurutan menurut tahun (−4003 … 57 M) ·
                          bisa disaring per **zaman** · bisa dicari · tiap peristiwa
                          punya **chip ayat** yang bisa diklik

   BERKAS PLUGIN:
     plugin.js    — berkas ini (keterangan)
     linimasa.js  — MESIN  (data peristiwa + IndexedDB)   → window.ANodesLinimasa
     tampilan.js  — TAMPILAN (halaman ke-11)              → window.ANodesLinimasaTampilan
     data/linimasa.js — DATA (hasil tools/siapkan-data-linimasa.js)

   SUMBER: robertrouse/theographic-bible-metadata · CC-BY-SA-4.0
           Terjemahan Indonesia ditulis tangan (tools/linimasa-terjemah.json).
   ============================================================ */

window.ANodesPlug = window.ANodesPlug || [];

window.ANodesPlug.push({
  id: 'linimasa',
  nama: 'Linimasa Sejarah',
  ikon: '🕒',
  versi: '1.0',
  penulis: 'ANodes',
  ukuran: '±213 KB',
  ringkas: 'Garis waktu 450 peristiwa Alkitab berurutan menurut tahun, bisa disaring per zaman.',
  siap: true,

  angka: [
    { n: '450', l: 'peristiwa' },
    { n: '9', l: 'zaman' },
    { n: '17.570', l: 'ayat' },
    { n: '213', l: 'KB' }
  ],

  keterangan:
    'Menampilkan sejarah Alkitab sebagai GARIS WAKTU — bukan per kitab, tetapi per PERISTIWA. ' +
    'Terukur 450 peristiwa berurutan dari Penciptaan (4.003 SM) sampai Paulus di Roma (57 M), ' +
    'masing-masing dengan tahun, bagian besar (mis. “Kerajaan terpecah”), dan rujukan ayat yang ' +
    'bisa diklik untuk dibaca langsung di halaman baca Alkitab. ' +
    'Ini BEDA dari 📖 Sejarah Kitab: yang itu menerangkan SATU KITAB (penulis, tema, tokoh); ' +
    'linimasa ini menyusun banyak peristiwa menurut MASA, sehingga bisa dibandingkan — ' +
    'mis. nabi mana yang hidup sezaman dengan raja mana.',

  fitur: [
    '🕒 **450 peristiwa** tersusun menurut tahun — 4.003 SM sampai 57 M',
    '📚 **9 zaman** — dari “Penciptaan & bapa leluhur” sampai “Gereja mula-mula” · bisa disaring',
    '🔍 **Cari peristiwa** — ketik kata apa pun (mis. “Yerusalem”, “Bait”, “Paskah”)',
    '📖 **Chip ayat bisa diklik** — tiap peristiwa punya rujukan yang langsung membuka Alkitab',
    '🧭 **Bagian besar tiap peristiwa** — mis. “Kerajaan Utara (Israel)”, “Perjalanan misi kedua”',
    '⚖️ **Atribusi lisensi** — keterangan sumber CC-BY-SA-4.0 di kaki halaman',
    '✨ **Bisa dipakai bersama plugin lain** — Alkitab · penguat · kamus · paralel · perikop ' +
      'tetap bekerja seperti biasa'
  ],

  cara: [
    'Pasang plugin ini lewat tombol ⬇ Pasang.',
    'Buka lewat tombol ▶ Buka di halaman ini (atau 🧩 ▼ di toolbar tulis).',
    'Pilih zaman di deretan tombol, atau ketik kata di kotak cari.',
    'Klik salah satu chip ayat ⇒ Alkitab terbuka pada ayat itu.',
    'Tekan 🏠 (atau Esc) untuk kembali — 🏠 membawa Anda kembali ke halaman Linimasa dulu, ' +
      'tekan 🏠 lagi baru ke catatan.'
  ],

  catatan: [
    '⚠️ **Tahunnya perkiraan** — sumber memakai kronologi konservatif (Penciptaan ±4003 SM). ' +
      'Alkitab sendiri tidak memberi tahun; angka ini adalah salah satu tafsiran yang lazim. ' +
      '❌ Jangan dipakai sebagai angka pasti.',
    '⚠️ **Judul diterjemahkan ANodes** — sumbernya berbahasa Inggris; 450 judul diterjemahkan ' +
      'tangan agar terbaca wajar dalam bahasa Indonesia (tools/linimasa-terjemah.json).',
    '⚠️ **Nama tempat & orang memakai ejaan Inggris** di catatan sumber — mis. “Jeroboam”, ' +
      '“Hezekiah”. Judulnya sudah Indonesia, tetapi nama di dalamnya mengikuti sumber.',
    '⚠️ **Sumber CC-BY-SA-4.0** — wajib menyebut sumber; keterangannya tampil di kaki halaman.',
    '⚠️ **Bukan pengganti 📖 Sejarah Kitab** — keduanya berbeda tujuan: yang satu per kitab, ' +
      'yang ini per peristiwa/masa.',
    '⚠️ Kalau plugin 📖 Alkitab belum dipasang, chip ayat belum bisa dibuka (halaman tetap ' +
      'bisa dibaca).'
  ],

  tombolBuka: '▶ Buka Linimasa',
  buka: function () {
    const T = window.ANodesLinimasaTampilan;
    if (T && T.bukaHalaman) T.bukaHalaman();
  },

  saatDipasang: function () {
    if (window.ANodesLinimasa && window.ANodesLinimasa.siapkanOtomatis) {
      window.ANodesLinimasa.siapkanOtomatis();
    }
    if (window.ANodesLinimasaTampilan && window.ANodesLinimasaTampilan.siapkanOtomatis) {
      window.ANodesLinimasaTampilan.siapkanOtomatis();
    }
  },
  saatDilepas: function () {
    if (window.ANodesLinimasaTampilan && window.ANodesLinimasaTampilan.bersihkan) {
      window.ANodesLinimasaTampilan.bersihkan();
    }
    if (window.ANodesLinimasa && window.ANodesLinimasa.saatDilepas) {
      window.ANodesLinimasa.saatDilepas();
    }
  }
});