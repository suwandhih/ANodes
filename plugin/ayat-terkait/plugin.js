/* ============================================================
   ANodes — plugin/ayat-terkait/plugin.js
   KETERANGAN PLUGIN: 🔗 Ayat Terkait  (K25)
   ------------------------------------------------------------
   Konsep dipindahkan dari lab3 (`js/alkitab.js` → panel “Gali Ayat”),
   disesuaikan dengan cara ANodes. Kata Bapak: “beda versi tapi
   secara konsep sama”.

   Berkas ini HANYA KETERANGAN (nama, ukuran, bisa apa saja, cara pakai).
   Isi sebenarnya ada di:
     plugin/ayat-terkait/terkait.js     = MESIN (data + simpanan cepat)
     plugin/ayat-terkait/tampilan.js    = TAMPILAN (chip + blok di halaman baca)
     plugin/ayat-terkait/data/silang.js = DATA kaitan (dibuat tools/siapkan-data-silang.js)

   Dimuat lewat <script src="plugin/ayat-terkait/plugin.js"> di index.html
   (BUKAN fetch) — Chrome di file:// memblokir fetch.
   ============================================================ */

window.ANodesPlug = window.ANodesPlug || [];

window.ANodesPlug.push({
  id: 'ayat-terkait',
  nama: 'Ayat Terkait',
  namaBar: 'Ayat Terkait',
  ikon: '🔗',
  versi: '1.0',
  penulis: 'ANodes',
  ukuran: '± 5,2 MB',
  ringkas: 'Menampilkan ayat-ayat lain yang berkaitan dengan ayat yang sedang dibaca.',
  siap: false,          // true setelah data kaitan dimuat (mesin terkait.js)

  angka: [
    { n: '29.363', l: 'ayat' },
    { n: '344.100', l: 'kaitan' }
  ],

  keterangan:
    'Ketika membaca Alkitab di ANodes, ayat-ayat lain yang berkaitan ' +
    'ditampilkan langsung di bawah ayat itu — seperti “rantai ayat”. ' +
    'Misalnya 2 Tesalonika 2:1 dikaitkan dengan Matius 24:31, Markus 13:27, ' +
    '1 Tesalonika 4:14-17, dan lain-lain. Klik salah satu kaitan → ayatnya ' +
    'terbuka, dan bisa terus ditelusuri. Sumber data: kaitan ayat ' +
    'OpenBible.info (CC-BY).',

  fitur: [
    'Ayat yang punya kaitan diberi TOMBOL “ayat terkait (n)” di bawahnya — halaman tetap rapi.',
    'Tombol ditekan → muncul semua kaitan ayat itu (diurut menurut urutan Alkitab).',
    'Klik satu kaitan → ayat itu terbuka lengkap (bisa beberapa ayat, mis. 4:14-17).',
    'Bisa ditelusuri terus seperti rantai — kaitan dari kaitan.',
    'Ayat yang sudah terbuka tidak dibuka dua kali — hanya disorot kuning sebentar.',
    'Perkataan Yesus ikut merah (seperti di Alkitab cetak).',
    'Ada dua cara tampil: tombol kecil (bawaan) atau langsung terbuka.'
  ],

  cara: [
    'Buka 🧩 Gudang Plugin → pilih 🔗 Ayat Terkait → tekan Pasang.',
    'Baca Alkitab seperti biasa (📖 Alkitab, atau klik tautan ayat di catatan).',
    'Di bawah ayat yang punya kaitan, muncullah tombol “ayat terkait (n)”.',
    'Tekan tombol itu → tampil semua kaitannya. Klik salah satu → ayatnya terbuka.',
    'Klik lagi kaitannya untuk menelusuri lebih jauh. Tekan ✕ untuk menutup.'
  ],

  catatan: [
    'Data kaitan disimpan di perangkat ini saja (tidak dikirim ke internet).',
    'Ukuran datanya 5,2 MB — memasang butuh beberapa detik, berikutnya cepat.',
    'Plugin bisa DILEPAS kapan saja — catatan pengguna tidak akan hilang.',
    'Sumber kaitan: OpenBible.info Cross-References, lisensi CC-BY.',
    'Plugin ini menumpang plugin 📖 Alkitab (datanya dipakai untuk menampilkan teks ayat).'
  ],

  // ------------------------------------------------------------
  // PILIHAN CARA TAMPIL (butir f)
  //   Halaman keterangan plugin menampilkannya sebagai tombol pilihan.
  //   Dipakai `js/plugin.js` lewat kontrak: pilihanTampil + caraTampil + pilihCara.
  // ------------------------------------------------------------
  pilihanTampil: [
    { id: 'chip',
      nama: 'Cukup tombol kecil',
      contoh: 'hanya tombol “ayat terkait (n)” — halaman tetap rapi, kaitan dibuka kalau tombolnya ditekan (bawaan)' },
    { id: 'buka',
      nama: 'Langsung tampil',
      contoh: 'ayat terkait langsung terbuka di bawah setiap ayat — halaman jadi lebih panjang' }
  ],

  caraTampil: function () {
    const t = window.ANodesAyatTerkaitTampilan;
    return t && t.caraTampil ? t.caraTampil() : 'chip';
  },

  pilihCara: function (id) {
    const t = window.ANodesAyatTerkaitTampilan;
    if (!t || !t.simpanCaraTampil) return false;
    t.simpanCaraTampil(id);
    return true;
  },

  // tombol ▶ Buka di gudang plugin — buka halaman baca Alkitab
  tombolBuka: '▶ Buka di Alkitab',
  buka: function () {
    const t = window.ANodesAlkitabTampilan;
    if (!t) return;
    if (!window.ANodesAlkitab || !window.ANodesAlkitab.siap()) {
      const p = window.ANodesPlugin;
      if (p && p.pesan) p.pesan('💡 Pasang plugin 📖 Alkitab dahulu supaya ayatnya bisa dibaca');
      return;
    }
    // pastikan data kaitan sudah siap sebelum membuka (setelah F5 data dimuat ulang)
    const m = window.ANodesAyatTerkait;
    if (m && m.saatSiap) m.saatSiap(() => t.bukaHalaman());
    else t.bukaHalaman();
  },

  // ⚠️ saatDipasang TIDAK perlu memanggil mesinnya: `js/plugin.js → pasang()`
  //    SUDAH memanggil `window.ANodesAyatTerkait.dipasang()` sendiri
  //    (lewat penerjemah nama mesin). Kalau dipanggil dua kali, pemuatan
  //    datanya berjalan dua kali — jadi sengaja dikosongkan.
  saatDipasang: function () {},

  saatDilepas: function () {
    const m = window.ANodesAyatTerkait;
    if (m && m.saatDilepas) m.saatDilepas();
    // halaman kerja (K31) ikut dibereskan — kalau tidak, halaman itu bisa
    // tertinggal tampil walau pluginnya sudah dilepas.
    const k = window.ANodesAyatTerkaitKerja;
    if (k && k.bersihkan) { try { k.bersihkan(); } catch (e) {} }
  }
});
