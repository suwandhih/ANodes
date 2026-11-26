/* ============================================================
   ANodes — plugin/alkitab/plugin.js
   DEFINISI PLUGIN ALKITAB (plugin pertama ANodes)
   ------------------------------------------------------------
   File ini HANYA memuat KETERANGAN plugin (nama, ukuran, bisa
   apa saja, cara pakai). Data ayat + fitur baca/cari baru
   ditambahkan pada tahap berikutnya (c, d, e, ...).

   Dimuat lewat  <script src="plugin/alkitab/plugin.js"> di index.html
   (BUKAN fetch) — Chrome di file:// memblokir fetch, tapi
   pemuatan lewat tag script diizinkan.
   ============================================================ */

window.ANodesPlug = window.ANodesPlug || [];

window.ANodesPlug.push({
  id: 'alkitab',
  nama: 'Alkitab (Terjemahan Baru)',
  namaBar: 'Alkitab',
  ikon: '📖',
  versi: '1.2',
  penulis: 'ANodes',
  ukuran: '± 6 MB',
  ringkas: 'Membaca ayat Alkitab & menjadikan ayat di catatan sebagai tautan.',
  siap: false,          // true setelah data ayat dimuat (tahap c)

  // angka ringkas yang ditampilkan di halaman keterangan
  angka: [
    { n: '66',   l: 'kitab' },
    { n: '1.189', l: 'pasal' },
    { n: '31.102', l: 'ayat' },
    { n: '2.059', l: 'ayat merah' }
  ],

  keterangan:
    'Teks lengkap Alkitab Terjemahan Baru. Sekali dipasang, setiap nama ayat ' +
    'yang ditulis di catatan (mis. Ibrani 11:1) berubah menjadi tautan ' +
    'berwarna. Klik tautannya → terbuka halaman ayat sebesar catatan untuk ' +
    'dibaca. Setelah selesai, tombol ↩ mengembalikan pengguna tepat ke tempat ' +
    'yang tadi diklik, dan tempat itu disorot kuning sebentar supaya ' +
    'tidak kehilangan jejak.',

  // apa saja yang bisa dilakukan setelah dipasang
  fitur: [
    'Tulis nama ayat di catatan → jadi tautan berwarna (mis. Ibrani 11:1).',
    'Boleh disingkat atau salah tulis sedikit — ibr, ibrani, Ibr, mat, mar → tetap dikenali.',
    'Bisa beberapa ayat sekaligus — Ibrani 11:1-10 tampil berurutan.',
    'Klik tautan → halaman ayat terbuka SEBESAR catatan, nyaman dibaca.',
    'Tombol 🏠 Home / ↩ → balik ke catatan + tempat klik disorot kuning sebentar.',
    'Baca Alkitab penuh di dalam ANodes (pilih kitab → pasal → ayat).',
    'Cari ayat dengan 2 pintu di halaman baca: 🔍 Cari (nama ayat / kata-kutipan) dan 📋 PILIH (daftar kitab).'
  ],

  // langkah pakai
  cara: [
    'Buka 🧩 Gudang Plugin → pilih Alkitab → tekan Pasang.',
    'Tulis di catatan, misalnya: seperti tertulis dalam Ibrani 11:1-10',
    'Nama ayat itu berubah jadi tautan berwarna → klik.',
    'Baca halaman ayatnya → tekan 🏠 Home kalau sudah selesai.',
    'Mau mencari? Di halaman baca tekan 🔍 Cari, lalu ketik nama ayat atau katanya.'
  ],

  // hal yang perlu diketahui sebelum memasang
  catatan: [
    'Data disimpan di perangkat ini saja (tidak dikirim ke internet).',
    'Sekali dipasang, membuka Alkitab berikutnya lebih cepat (data sudah tersimpan).',
    'Plugin bisa DILEPAS kapan saja — catatan pengguna tidak akan hilang.',
    'Isi Alkitab Terjemahan Baru dipakai untuk keperluan pribadi.'
  ],

  // ------------------------------------------------------------
  // TOMBOL DI BARIS BAR PLUGIN (muncul setelah plugin dipasang)
  // ------------------------------------------------------------
  // ATURAN BARIS (baris ke-2 sempit, gaya HP ±480px):
  //   • hanya 2 tombol supaya MUAT 1 BARIS.
  //   • 🔍 Cari TIDAK ditaruh di sini — pindah ke toolbar halaman
  //     baca Alkitab (dekat tombol 📋 PILIH) supaya lebih masuk akal.
  bar: [
    { ikon: '📖', label: 'Alkitab', judul: 'Buka Alkitab — klik nama ayat di catatan, atau baca penuh',
      siap: true, aksi: function () {
        const t = window.ANodesAlkitabTampilan;
        if (!t) return;
        t.gambarPasal(1, 1);
        t.bukaHalaman();
      } },

    { ikon: '🧩', label: '', judul: 'Gudang Plugin (pasang / lepas plugin)',
      siap: true, aksi: function () {
        if (window.ANodesPlugin) window.ANodesPlugin.bukaGudang();
      } }
  ],

  // tiga cara mencari ayat (dipakai di dalam panel Cari)
  caraCari: [
    { no: '1', ikon: '1️⃣', nama: 'Pilih dari daftar',   ket: 'klik kitab → pasal → ayat' },
    { no: '2', ikon: '2️⃣', nama: 'Ketik nama ayat',     ket: 'mis. ibr 11:1 — salah tulis pun dikenali' },
    { no: '3', ikon: '3️⃣', nama: 'Cari lewat kata',     ket: 'mis. kasih, atau sepenggal kutipan' }
  ],

  // jalan saat dipasang / dilepas
  saatDipasang: function () { panggilAlkitab('saatDipasang'); },

  // ------------------------------------------------------------
  // TOMBOL DI HALAMAN BACA (navbar sudah penuh — jadi ditambahkan
  // paling kanan sebagai ikon). Dipasang plugin/alkitab/tampilan.js.
  // ------------------------------------------------------------
  tombol: [
    { id: 'baca-kirim', ikon: '📤', judul: 'Kirimkan ayat ini ke catatan (klik angka ayat dulu)',
      saatKlik: function () {
        const t = window.ANodesAlkitabTampilan;
        if (t && t.kirimAyatDariSini) t.kirimAyatDariSini();
      } },
    // K54 — pintu penguat: tampilkan / sembunyikan SELURUH penguat pasal ini.
    //   Tombol ini HANYA berguna kalau plugin 🖊 Pembaca Penguat terpasang;
    //   kalau tidak, plugin penguat yang memasang pengaitnya sendiri
    //   (lihat plugin/penguat/tampilan.js → pasangTombolAlkitab()).
    { id: 'baca-penguat', ikon: '🖊', judul: 'Tampilkan seluruh penguat pasal ini — tekan lagi untuk menyembunyikan',
      saatKlik: function () {
        const p = window.ANodesPenguatTampilan;
        if (p && p.sakelarSemuaPenguat) { p.sakelarSemuaPenguat(); return; }
        const g = window.ANodesPlugin;
        if (g && g.pesan) g.pesan('💡 Pasang plugin 🖊 Pembaca Penguat dahulu');
      } }
  ],

  // ------------------------------------------------------------
  // ℹ️ K55b (22 Sep 2026) — fitur “Sejarah Kitab” DIPINDAH ke plugin sendiri
  //    (**plugin/sejarah/**) supaya bisa dipasang/dilepas terpisah.
  //    Plugin Alkitab kembali bersih & ❌ tidak tahu soal sejarah.
  //    Tombol [📖 sejarah] kini ada di halaman keterangan plugin 📖 Sejarah Kitab.
  // ------------------------------------------------------------

  // tombol [▶ Buka Alkitab] di gudang plugin (untuk plugin yang terpasang)
  tombolBuka: '▶ Buka Alkitab',
  buka: function () {
    const t = window.ANodesAlkitabTampilan;
    if (!t) return;
    // di toolbar baca ada 🔍 Cari — cukup buka halaman bacanya
    t.bukaHalaman();
  },
  saatDilepas:  function () {
    if (window.ANodesAlkitab && window.ANodesAlkitab.saatDilepas) {
      window.ANodesAlkitab.saatDilepas();
    }
  }
});

// pemanggil aman: mesin Alkitab baru ada setelah tahap c.
// (kalau belum ada, tombol tidak error — cukup diabaikan)
function panggilAlkitab(nama, arg) {
  if (window.ANodesAlkitab && typeof window.ANodesAlkitab[nama] === 'function') {
    window.ANodesAlkitab[nama](arg);
  }
}
