/* ============================================================
   ANodes — plugin/perikop/plugin.js
   KETERANGAN PLUGIN: 📖 Judul Perikop   (K99 — 3 Nov 2026)

   💬 Bapak 3 Nov 2026: memilih **judul perikop** sebagai pelengkapan Alkitab
     berikutnya (sesudah K86 🔀 Paralel).

   ⚠️ SUMBER JUDUL = AYT, ❌ bukan TB (diukur 3 Nov 2026):
     TB (LAI) berhak cipta ⇒ judulnya tidak boleh dibundel. AYT berlisensi
     **CC BY-NC 4.0** ⇒ boleh untuk pemakaian pribadi dengan atribusi.
     Terukur: **2.573 judul** dari penanda USFM `\s1` (2.547) + `\s2` (57),
     dikurangi 31 judul palsu (penomoran bagian Amsal 22–24: "—1—" … "—30—").

   BERKAS PLUGIN:
     plugin.js   — berkas ini (keterangan)
     perikop.js  — MESIN  (data judul + IndexedDB)     → window.ANodesPerikop
     tampilan.js — TAMPILAN (judul disisipkan di atas ayat) → window.ANodesPerikopTampilan
     data/perikop.js — DATA (hasil tools/siapkan-data-perikop.js)
   ============================================================ */

window.ANodesPlug = window.ANodesPlug || [];

window.ANodesPlug.push({
  id: 'perikop',
  nama: 'Judul Perikop',
  ikon: '📖',
  versi: '1.0',
  penulis: 'ANodes',
  ukuran: '±133 KB',
  ringkas: 'Judul bagian di atas ayat — seperti Alkitab cetak, supaya tahu sedang membaca bagian apa.',
  siap: true,

  angka: [
    { n: '2.573', l: 'judul' },
    { n: '1.144', l: 'pasal' },
    { n: '66', l: 'kitab' },
    { n: '133', l: 'KB' }
  ],

  keterangan:
    'Menampilkan judul bagian (perikop) di atas ayatnya, seperti pada Alkitab cetak. ' +
    'Contoh: sebelum Markus 1:1 muncul judul “Pelayanan Yohanes Pembaptis”, lalu sebelum ' +
    'ayat 9 muncul “Yohanes Membaptis Yesus”. Jadi Anda tahu sedang membaca bagian apa ' +
    'tanpa harus menebak dari isinya. Judul diambil dari AYT (Alkitab Yang Terbuka) — ' +
    'terukur 2.573 judul yang menutup 1.144 dari 1.189 pasal (96,2 %).',

  fitur: [
    '📖 **Judul di atas ayatnya** — seperti Alkitab cetak, tanpa perlu menekan tombol apa pun',
    '🔢 **2.573 judul** — menutup **1.144 dari 1.189 pasal (96,2 %)**',
    '📚 **66 kitab** — dari Kejadian sampai Wahyu',
    '🎚️ **Bisa dimatikan** — lewat halaman keterangan ini (tombol “Cara tampil”)',
    '⚖️ **Atribusi lisensi** — keterangan hak cipta AYT tampil di kaki halaman',
    '✨ **Tetap bisa dipakai bersama plugin lain** — 🔀 paralel · 🖊 penguat · 📚 kamus · ' +
      '🌿 ayat terkait · 🗺️ peta · 🔤 interlinear tetap bekerja seperti biasa'
  ],

  cara: [
    'Pasang plugin ini lewat tombol ⬇ Pasang.',
    'Buka halaman baca Alkitab (📖 Alkitab → pilih kitab & pasal).',
    'Judul bagian langsung muncul di atas ayatnya — tidak perlu menekan apa pun.',
    'Kalau ingin mematikan: buka halaman keterangan ini → bagian “Cara tampil di halaman baca” → pilih “Mati”.'
  ],

  catatan: [
    '⚠️ **Judul berasal dari AYT** (Alkitab Yang Terbuka) yang berlisensi **CC BY-NC 4.0** — ' +
      '© YLSA-AYT 2011–2024. Dipakai untuk **pemakaian pribadi**. ❌ Jangan dijual atau ' +
      'dipakai untuk kepentingan komersial.',
    '⚠️ **Judul TB (LAI) tidak dipakai** karena berhak cipta — AYT boleh dipakai dengan atribusi.',
    '⚠️ **45 pasal tidak punya judul** (3,8 %) — mis. Imamat 22 · Ulangan 24 · Yosua 17 · ' +
      'Ayub 5 · 7 · 10 · 13 · 14 · 17 · 24 · 27 · 30 · 31. Itu **bukan kerusakan**: sumbernya ' +
      'memang tidak memberi judul di bagian itu.',
    '⚠️ **Mazmur 119 memakai huruf Ibrani** sebagai judul (Bet · He · Waw · …) — itu memang ' +
      'pembagian ayat akrostik dalam Alkitab, bukan salah ambil.',
    '⚠️ **Tidak ada tombol di navbar** — diukur: navbar sudah 9 tombol dan pas 324 px; ' +
      'menambah tombol ke-10 membuatnya meluber. ON/OFF ada di halaman keterangan ini.',
    '⚠️ Kalau plugin 📖 Alkitab belum dipasang, plugin ini belum bisa dipakai.'
  ],

  pilihanTampil: [
    { id: 'tampil', nama: 'Tampil', contoh: 'judul muncul di atas ayat' },
    { id: 'mati', nama: 'Mati', contoh: 'halaman baca seperti biasa' }
  ],
  caraTampil: function () {
    const T = window.ANodesPerikopTampilan;
    return T && T.caraTampil ? T.caraTampil() : 'tampil';
  },
  pilihCara: function (id) {
    const T = window.ANodesPerikopTampilan;
    if (T && T.pilihCara) T.pilihCara(id);
  },

  tombolBuka: '▶ Buka Alkitab',
  buka: function () {
    const T = window.ANodesAlkitabTampilan;
    if (T && T.bukaHalaman) T.bukaHalaman();
  },

  saatDipasang: function () {
    if (window.ANodesPerikop && window.ANodesPerikop.siapkanOtomatis) {
      window.ANodesPerikop.siapkanOtomatis();
    }
    if (window.ANodesPerikopTampilan && window.ANodesPerikopTampilan.siapkanOtomatis) {
      window.ANodesPerikopTampilan.siapkanOtomatis();
    }
  },
  saatDilepas: function () {
    if (window.ANodesPerikopTampilan && window.ANodesPerikopTampilan.bersihkan) {
      window.ANodesPerikopTampilan.bersihkan();
    }
    if (window.ANodesPerikop && window.ANodesPerikop.saatDilepas) {
      window.ANodesPerikop.saatDilepas();
    }
  }
});
