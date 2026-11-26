/* ============================================================
   ANodes — plugin/kamus/plugin.js
   KETERANGAN PLUGIN: 📚 Kamus Istilah  (K42)
   ------------------------------------------------------------
   Konsep dipindahkan dari lab3 (`android/lab3-offline.html`),
   disesuaikan dengan cara ANodes. Kata Bapak: “konsep seperti di
   lab3 tapi urusan UI tidak sama harus disesuaikan dengan UI ANodes”.

   Berkas ini HANYA KETERANGAN (nama, ukuran, bisa apa saja, cara pakai).
   Isi sebenarnya ada di:
     plugin/kamus/kamus.js          = MESIN (data + pencarian kata)
     plugin/kamus/tampilan.js       = TAMPILAN (garis putus + halaman kamus)
     plugin/kamus/data/kamus.js     = DATA (dibuat tools/siapkan-data-kamus.js)

   Dimuat lewat <script src="plugin/kamus/plugin.js"> di index.html
   (BUKAN fetch) — Chrome di file:// memblokir fetch.
   ============================================================ */

window.ANodesPlug = window.ANodesPlug || [];

window.ANodesPlug.push({
  id: 'kamus',
  nama: 'Kamus Istilah',
  namaBar: 'Kamus Istilah',
  ikon: '📚',
  versi: '1.4',
  penulis: 'ANodes',
  ukuran: '± 492 KB',
  ringkas: 'Nama orang, tempat & istilah Alkitab di catatan diberi garis putus-putus — diklik, artinya muncul.',
  // ✅ Data kamus (2.978 entri · 3.142 tulisan · 492 KB) SUDAH ada di
  //    plugin/kamus/data/kamus.js dan sudah terbukti terbaca mesin kamus.js.
  //    Karena itu siap = true → tombol ⬇ Pasang langsung muncul di kartu.
  siap: true,

  angka: [
    { n: '2.978', l: 'istilah' },
    { n: '3.142', l: 'tulisan' }
  ],

  keterangan:
    'Nama orang (Yesus, Musa, Daud), nama tempat (Yerusalem, Mesir, Babel), ' +
    'istilah khas Alkitab (Korban, Mezbah, Tebusan, Sabat), dan kata ganti ' +
    '(Aku, Dia, Engkau) di dalam tulisan diberi garis bawah putus-putus. ' +
    'Kata itu diklik → muncul artinya. Di dalam artinya sendiri ada rujukan ' +
    'ayat (mis. Kel 21:29) dan istilah lain — keduanya bisa diklik, jadi bisa ' +
    'ditelusuri berantai: kata → arti → ayat → istilah lain → arti → dan ' +
    'seterusnya. Sumber arti: kamus istilah alkitab + tambahan manual + ' +
    'nama orang/tempat/istilah (K83 — 2.978 entri). ' +
    '⚠️ Kata ganti (Aku, Dia, Engkau, Kamu) hanya ditandai bila berawalan ' +
    'HURUF BESAR — supaya kata biasa seperti “aku”/“engkau” tidak mengganggu.',

  fitur: [
    'Nama orang, tempat & istilah di catatan diberi garis putus-putus — halaman tetap rapi.',
    'Klik kata itu → terbuka halaman kamus berisi artinya (seukuran catatan).',
    'Rujukan ayat di dalam arti bisa diklik → ayatnya tampil di kolom ayat.',
    'Istilah lain di dalam arti bisa diklik → pindah ke istilah itu (berantai).',
    'Tombol 🏠 kembali ke catatan — tepat di baris & kata yang tadi diklik.',
    'Ada halaman 📚 Daftar Istilah dengan kotak cari (1.154 istilah).',
    'Istilah juga bisa diklik di halaman baca Alkitab, halaman Penguat & halaman Sejarah.'
  ],

  cara: [
    'Buka 🧩 Gudang Plugin → pilih 📚 Kamus Istilah → tekan Pasang.',
    'Tulis atau buka catatan seperti biasa.',
    'Kata istilah akan bergaris putus-putus — klik salah satu.',
    'Halaman kamus terbuka: baca artinya, klik ayat atau istilah lain kalau mau.',
    'Tekan 🏠 untuk kembali ke catatan (kata yang tadi diklik disorot kuning).'
  ],

  catatan: [
    'Data kamus disimpan di perangkat ini saja (tidak dikirim ke internet).',
    'Ukurannya kecil (±492 KB) — memasang hanya butuh sekejap.',
    'Plugin bisa DILEPAS kapan saja — catatan pengguna tidak akan hilang.',
    'Garis putus-putus hanya PENANDA TAMPILAN — tidak ikut tersimpan ke catatan.',
    'Halaman kamus sengaja SEDERHANA: keterangan + ayat pendukung. ' +
      'Penelusuran ayat terkait tidak ditaruh di sini supaya halaman tetap ringkas.'
  ],

  // ------------------------------------------------------------
  // PILIHAN CARA TAMPIL
  //   Halaman keterangan plugin menampilkannya sebagai tombol pilihan.
  //   Dipakai `js/plugin.js` lewat kontrak: pilihanTampil + caraTampil + pilihCara.
  // ------------------------------------------------------------
  pilihanTampil: [
    { id: 'putus',
      nama: 'Garis putus-putus',
      contoh: 'kata istilah di catatan diberi garis bawah putus-putus — diklik, artinya muncul (bawaan)' },
    { id: 'tombol',
      nama: 'Tanpa garis putus',
      contoh: 'catatan tetap bersih; istilah dibuka lewat halaman 📚 Daftar Istilah & halaman baca Alkitab' }
  ],

  saatDipasang: function () {
    const m = window.ANodesKamus;
    if (m && typeof m.dipasang === 'function') return m.dipasang();
    return Promise.resolve(false);
  },

  saatDilepas: function () {
    const m = window.ANodesKamus;
    if (m && typeof m.saatDilepas === 'function') m.saatDilepas();
  },

  // tombol cepat "▶ Buka" di gudang plugin → halaman Daftar Istilah
  tombolBuka: '▶ Buka daftar istilah',
  buka: function () {
    const t = window.ANodesKamusTampilan;
    if (t && typeof t.bukaDaftar === 'function') { t.bukaDaftar(); return; }
    const m = window.ANodesKamus;
    if (m && typeof m.saatSiap === 'function') {
      m.saatSiap(() => {
        const t2 = window.ANodesKamusTampilan;
        if (t2 && typeof t2.bukaDaftar === 'function') t2.bukaDaftar();
      });
    }
  }
});
