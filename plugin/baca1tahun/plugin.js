/* ============================================================
   ANodes — plugin/baca1tahun/plugin.js
   KETERANGAN PLUGIN: 🗓️ Bacaan Alkitab 1 Tahun   (K96 — 3 Nov 2026)

   💬 Bapak 3 Nov 2026:
     *“ada satu plugin yg belum selesai tapi ada "pengingat firman" · saya mau
      buat bacaan 1 th alkitab artinya 1th baca selesai semua.. setiap hari ntah
      berapa pasal.. pasal2 yg di beri tentu user sudah dilengkapi banyak
      referensi .. kemungkinan baca 1 tahun akan lebih menyenangkan.. apakah km
      bisa menenukan daftar baca alkitab... dan ini jika diaktifkan akan berjalan
      setiap hari.. dari pada pengingat firman bagaimana menurut km”*

   ⇒ Kartu 🕊️ “Pengingat Firman” (yang selama ini KOSONG, siap:false)
     DIGANTI dengan 🗓️ “Bacaan Alkitab 1 Tahun” yang benar-benar berfungsi.

   BERKAS PLUGIN:
     plugin.js   — berkas ini (keterangan)
     baca.js     — MESIN  (data rencana + kemajuan)   → window.ANodesBaca
     tampilan.js — TAMPILAN (halaman ke-10)           → window.ANodesBacaTampilan
     data/baca.js— DATA 3 rencana × 365 hari (hasil tools/siapkan-data-baca.js)
   ============================================================ */

window.ANodesPlug = window.ANodesPlug || [];

window.ANodesPlug.push({
  id: 'baca1tahun',
  nama: 'Bacaan Alkitab 1 Tahun',
  ikon: '🗓️',
  versi: '1.0',
  penulis: 'ANodes',
  ukuran: '±213 KB',
  ringkas: 'Baca seluruh Alkitab (66 kitab · 1.189 pasal) dalam 365 hari — ±85 ayat sehari.',
  siap: true,

  angka: [
    { n: '365', l: 'hari' },
    { n: '1.189', l: 'pasal' },
    { n: '31.102', l: 'ayat' },
    { n: '3', l: 'rencana' }
  ],

  keterangan:
    'Rencana baca yang membagi SELURUH Alkitab (66 kitab · 1.189 pasal · ' +
    '31.102 ayat) menjadi 365 hari. Rata-rata ±3 pasal atau ±85 ayat sehari, ' +
    'jadi tidak berat. Tersedia 3 rencana: Berurutan (Kejadian → Wahyu), ' +
    'PL + PB tiap hari, dan Every Day In the Word (PL + PB + Mazmur + Amsal ' +
    'menyertai tiap hari). Ketiganya menutup 100 % Alkitab — tidak ada pasal ' +
    'yang terlewat.',

  fitur: [
    '📅 **Kartu hari ini** — langsung terlihat bacaan hari ini, besok, dan beberapa hari ke depan',
    '📊 **Progres & 🔥 beruntun** — berapa persen selesai dan berapa hari berturut-turut',
    '🗓️ **Kalender 365 hari** — kotak kecil per hari; hijau = sudah dibaca, klik = lompat ke hari itu',
    '📖 **Buka di Alkitab** — satu tekan langsung membuka pasal yang harus dibaca',
    '✓ **Sudah dibaca** — centang per hari, bisa dibatalkan',
    '🅰️🅱️⭐ **3 rencana** — ganti kapan saja, kemajuannya tetap',
    '📌 **Mulai kapan saja** — tidak harus 1 Januari; hari ke-1 = tanggal saat dipasang',
    '☁️ **Ikut tersinkron** PC ⇄ HP — kemajuan baca sama di kedua perangkat',
    '✨ **Setiap pasal sudah lengkap referensinya** — 🖊 penguat (tafsiran) · ' +
      '📚 kamus istilah · 🌿 ayat terkait · 🗺️ peta · 🔤 interlinear bahasa asli'
  ],

  cara: [
    'Pasang plugin ini lewat tombol ⬇ Pasang, lalu tekan ▶ Buka (atau dari 🧩 ▼ di toolbar tulis).',
    'Pilih rencana yang disukai: 🅰️ Berurutan · 🅱️ PL + PB tiap hari · ⭐ Every Day In the Word.',
    'Setiap hari, buka halaman 🗓️ dan lihat “Hari ini” — pasal yang harus dibaca sudah tertulis.',
    'Tekan 📖 Buka di Alkitab untuk membaca (boleh satu blok saja, tidak harus semuanya).',
    'Sesudah selesai, tekan ✓ Sudah dibaca — kalender hari itu menjadi hijau.',
    'Kalau ketinggalan beberapa hari, tidak apa-apa: bacaan hari ini tetap sesuai tanggal, ' +
      'tidak menumpuk. Hari yang terlewat bisa dibuka dari kalender kapan saja.'
  ],

  catatan: [
    '⚠️ **Plafon hari tetap 1 tahun** — mulai kapan pun, selesainya 365 hari sejak tanggal mulai.',
    '⚠️ **Rencana tidak menyalin berkas siapa pun.** Pola “Every Day In the Word” dibangun ' +
      'ulang dari data Alkitab yang sudah ada, lalu ditambal agar menutup 100 %.',
    '⚠️ **Teks Alkitab memakai terjemahan TB** yang sudah ada di plugin 📖 Alkitab (public domain).',
    '⚠️ Kalau plugin 📖 Alkitab belum dipasang, jadwal tetap bisa dibaca, tetapi tombol ' +
      '📖 Buka di Alkitab belum bisa dipakai.'
  ],

  pilihanTampil: [],

  tombolBuka: '▶ Buka',
  buka: function () {
    const T = window.ANodesBacaTampilan;
    if (T && T.bukaHalaman) T.bukaHalaman();
  },

  saatDipasang: function () {
    if (window.ANodesBaca && window.ANodesBaca.siapkanOtomatis) {
      window.ANodesBaca.siapkanOtomatis();
    }
    if (window.ANodesBacaTampilan && window.ANodesBacaTampilan.siapkanOtomatis) {
      window.ANodesBacaTampilan.siapkanOtomatis();
    }
  },
  saatDilepas: function () {
    if (window.ANodesBacaTampilan && window.ANodesBacaTampilan.bersihkan) {
      window.ANodesBacaTampilan.bersihkan();
    }
    if (window.ANodesBaca && window.ANodesBaca.saatDilepas) {
      window.ANodesBaca.saatDilepas();
    }
  }
});