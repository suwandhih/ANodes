/* ============================================================
   ANodes — plugin/paralel/plugin.js
   KETERANGAN PLUGIN: 🔀 Paralel Terjemahan (TB ⇄ AYT)   (K86 — 3 Nov 2026)

   💬 Bapak 3 Nov 2026: memilih **AYT** sebagai versi pembanding.

   ⚠️ SEBAB AYT, ❌ BUKAN TSI (diukur 3 Nov 2026, ❌ bukan diduga):
     Rencana 18.3.1 menyebut TSI (eBible `ind`) sebagai pembanding. Setelah
     paketnya diunduh & diurai, ternyata **TSI hanya 48 kitab** — 18 kitab PL
     TIDAK ADA (1CH · 2CH · JOB · PSA · SNG · JER · LAM · EZK · DAN · HOS ·
     JOL · AMO · OBA · MIC · NAM · HAB · ZEP · HAG). Termasuk Mazmur, Yeremia,
     Yehezkiel, Daniel ⇒ tidak bisa dipakai sebagai pembanding seluruh Alkitab.
     AYT (eBible `indayt`) = **66 kitab · 31.102 ayat** — jumlah ayatnya PERSIS
     sama dengan TB ANodes ⇒ kolom paralel sejajar sempurna.

   BERKAS PLUGIN:
     plugin.js   — berkas ini (keterangan)
     paralel.js  — MESIN  (data AYT + IndexedDB)      → window.ANodesParalel
     tampilan.js — TAMPILAN (tombol 🔀 + kotak AYT)   → window.ANodesParalelTampilan
     data/paralel.js — DATA AYT (hasil tools/siapkan-data-paralel.js)
   ============================================================ */

window.ANodesPlug = window.ANodesPlug || [];

window.ANodesPlug.push({
  id: 'paralel',
  nama: 'Paralel Terjemahan',
  ikon: '🔀',
  versi: '1.0',
  penulis: 'ANodes',
  ukuran: '±5,0 MB',
  ringkas: 'Baca TB dan AYT berdampingan — tiap ayat TB disertai versi AYT di bawahnya.',
  siap: true,

  angka: [
    { n: '66', l: 'kitab' },
    { n: '1.189', l: 'pasal' },
    { n: '31.102', l: 'ayat' },
    { n: '2', l: 'terjemahan' }
  ],

  keterangan:
    'Menampilkan dua terjemahan Indonesia sekaligus: TB (Terjemahan Baru) yang ' +
    'sudah ada di plugin 📖 Alkitab, dan AYT (Alkitab Yang Terbuka) sebagai ' +
    'pembanding. Setiap ayat TB langsung disertai versi AYT-nya di bawah, jadi ' +
    'perbedaan pilihan kata bisa dibandingkan tanpa berpindah halaman. ' +
    'Cakupannya lengkap: 66 kitab · 1.189 pasal · 31.102 ayat — jumlah ayatnya ' +
    'persis sama dengan TB, sehingga tiap ayat selalu punya pasangan.',

  fitur: [
    '🔀 **Tombol di navbar halaman baca** — satu tekan, AYT langsung tampil di bawah tiap ayat TB',
    '📖 **Bertumpuk per ayat** — TB di atas, AYT di bawah dalam kotak biru muda (bukan dua kolom sempit)',
    '🔁 **Bisa dimatikan kapan saja** — tekan 🔀 lagi, halaman kembali seperti biasa',
    '💾 **Ingat pilihan** — kalau dinyalakan, tetap menyala saat aplikasi dibuka lagi',
    '📚 **Cakupan penuh** — 66 kitab · 31.102 ayat, tidak ada ayat yang kosong',
    '⚖️ **Atribusi lisensi** — keterangan hak cipta AYT selalu tampil di kaki halaman',
    '✨ **Tetap bisa dipakai bersama plugin lain** — 🖊 penguat · 📚 kamus · 🌿 ayat terkait · ' +
      '🗺️ peta · 🔤 interlinear tetap bekerja seperti biasa'
  ],

  cara: [
    'Pasang plugin ini lewat tombol ⬇ Pasang.',
    'Buka halaman baca Alkitab (📖 Alkitab → pilih kitab & pasal).',
    'Tekan tombol 🔀 di baris ikon navbar — AYT langsung muncul di bawah tiap ayat.',
    'Tekan 🔀 sekali lagi untuk mematikan (halaman kembali seperti biasa).',
    'Pilihan diingat: kalau dinyalakan, saat aplikasi dibuka lagi tetap menyala.'
  ],

  catatan: [
    '⚠️ **AYT berlisensi CC BY-NC 4.0** (Atribusi · Non-Komersial) — © YLSA-AYT 2011–2024. ' +
      'Dipakai untuk **pemakaian pribadi**. ❌ Jangan dijual atau dipakai untuk kepentingan komersial.',
    '⚠️ **TSI tidak dipakai** karena paketnya hanya 48 kitab (18 kitab PL tidak ada).',
    '⚠️ **Bentuknya bertumpuk, bukan dua kolom** — ANodes selalu bergaya HP (maks 480px); ' +
      'dua kolom hanya menyisakan ±220px per kolom sehingga baris teks jadi 3–4 kata.',
    '⚠️ **3 ayat AYT digabung** (Yesaya 22:10 · 22:11 · 22:18) — pada AYT ayat itu menyatu ' +
      'dengan ayat sebelumnya, jadi yang tampil adalah keterangan “digabung dengan ayat …”.',
    '⚠️ Kalau plugin 📖 Alkitab belum dipasang, plugin ini belum bisa dipakai.'
  ],

  pilihanTampil: [],

  tombolBuka: '▶ Buka Alkitab',
  buka: function () {
    const T = window.ANodesAlkitabTampilan;
    if (T && T.bukaHalaman) T.bukaHalaman();
  },

  saatDipasang: function () {
    if (window.ANodesParalel && window.ANodesParalel.siapkanOtomatis) {
      window.ANodesParalel.siapkanOtomatis();
    }
    if (window.ANodesParalelTampilan && window.ANodesParalelTampilan.siapkanOtomatis) {
      window.ANodesParalelTampilan.siapkanOtomatis();
    }
  },
  saatDilepas: function () {
    if (window.ANodesParalelTampilan && window.ANodesParalelTampilan.bersihkan) {
      window.ANodesParalelTampilan.bersihkan();
    }
    if (window.ANodesParalel && window.ANodesParalel.saatDilepas) {
      window.ANodesParalel.saatDilepas();
    }
  }
});
