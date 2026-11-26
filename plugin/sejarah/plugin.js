/* ============================================================
   ANodes — plugin/sejarah/plugin.js
   KETERANGAN PLUGIN: 📖 SEJARAH KITAB  (K55b → K55c)

   ------------------------------------------------------------
   Bapak 22 Sep 2026: *“sejarah apakah bisa di buatkan plugin seperti
   orderan saya tadi”* ⇒ ✅ **dijadikan plugin sendiri**.

   🔄 KONSEP DIUBAH BAPAK 23 Sep 2026 (K55c):
     *“saya mau ubah konsep dari k55c. Jika klik [🧩▼] <- muncul semua plugin.
      1. catatan plugin sejarah sudah di tempelkan. 2. sekarang plugin
      [sejarah] > klik kosong. 3. disini sejarah **“alkitab” (bukan kitab2)**
      di tampilkan.”*
     ➕ Penegasan Bapak: *“saya **tidak mengeluh klik kosong** justru saya mau
      **manfaatkan untuk tempat user bisa baca sejarah alkitab < prakata**..”
     ⇒ ✅ **pintu plugin DIBUKA** (`tombolBuka` + `buka()`) dan langsung
        menampilkan **SEJARAH ALKITAB (prakata)** di HALAMAN SENDIRI.

   ⚠️ Plugin ini MANDIRI:
     • `buka()` ⇒ HALAMAN SENDIRI (ke-6) berisi sejarah Alkitab + pintasan 66 kitab
     • juga menyisipkan tombol `📖 sejarah` di halaman baca Alkitab pada PASAL 1
       (melalui sambungan resmi `tambahPenghias()`) — untuk melihat sejarah KITAB
     • ❌ TIDAK menyentuh catatan pengguna
     • dilepas ⇒ tombol, panel, & halaman sejarah ikut hilang

   Struktur:
     plugin.js        = berkas ini (keterangan untuk gudang plugin)
     sejarah.js       = MESIN (window.ANodesSejarah)
     tampilan.js      = TAMPILAN (halaman mandiri · tombol · panel kitab)
     data/sejarah.js  = DATA hasil tools/siapkan-data-sejarah.js
   ============================================================ */

window.ANodesPlug = window.ANodesPlug || [];

window.ANodesPlug.push({
  id: 'sejarah',
  nama: 'Sejarah Kitab',
  namaBar: 'Sejarah',
  ikon: '📖',
  versi: '1.2',
  penulis: 'ANodes',
  ukuran: '± 98 KB',
  ringkas: 'Mengenal sejarah Alkitab & tiap kitabnya — penulis, tahun, tema, tokoh, & ayat kunci.',
  siap: true,

  angka: [
    { n: '66',    l: 'kitab' },
    { n: '54.748', l: 'huruf sejarah' },
    { n: '158',   l: 'ayat kunci' },
    { n: '1',     l: 'sejarah Alkitab' }
  ],

  keterangan:
    'Keterangan sejarah Alkitab — dari Kejadian sampai Wahyu. Ditekan ▶ Buka ⇒ ' +
    'terbuka HALAMAN SEJARAH ALKITAB: tulisan “bagaimana Firman menjadi tulisan” ' +
    '(prakata) lengkap dengan pintasan ke 66 kitab. Selain itu, di halaman baca ' +
    'Alkitab pada PASAL 1 setiap kitab muncul tombol 📖 sejarah bersama tombol baca ' +
    'lainnya — ditekan ⇒ terbuka ringkasan kitab itu: satu kalimat inti, penulis, ' +
    'perkiraan tahun, tema utama, tokoh utama, cerita sejarahnya, dan ayat-ayat kunci ' +
    'yang bisa langsung diklik.',

  fitur: [
    'Halaman Sejarah Alkitab (prakata) — dibuka 1 klik dari 🧩 ▼.',
    'Pintasan ke 66 kitab (dikelompokkan: Taurat · Injil · dst) — diklik ⇒ pasal 1 kitab itu.',
    'Tombol 📖 sejarah di halaman baca Alkitab pada PASAL 1 setiap kitab (66 kitab).',
    'Ringkasan tiap kitab: 🎯 inti · 🏷️ penulis & tahun · 💡 tema · 👤 tokoh · 📜 sejarah.',
    '🔑 Ayat kunci tiap kitab — diklik langsung membuka ayat itu di halaman baca.',
    '🔍 Cari kata di dalam teks sejarah Alkitab.',
    'Bisa dipasang / dilepas sendiri — catatan pengguna tidak tersentuh.'
  ],

  cara: [
    'Buka 🧩 Gudang Plugin → pilih 📖 Sejarah Kitab → tekan Pasang.',
    'Tekan ▶ Buka ⇒ halaman Sejarah Alkitab (prakata) terbuka + pintasan 66 kitab.',
    'Mau sejarah satu kitab? Buka kitab itu pada PASAL 1 di Alkitab → tekan 📖 sejarah.',
    '🔍 di bar atas halaman sejarah = mencari kata di dalam teksnya.'
  ],

  catatan: [
    'Halaman sejarah Alkitab bisa dibaca tanpa plugin 📖 Alkitab;',
    'namun pintasan kitab & ayat kunci perlu plugin 📖 Alkitab terpasang.',
    'Data disimpan di perangkat ini saja (tidak dikirim ke internet).',
    'Plugin bisa DILEPAS kapan saja — catatan & isi Alkitab tidak akan hilang.',
    'Isi sejarah bersumber dari data kitab yang sudah ada di komputer pengguna.'
  ],

  // K55c (23 Sep 2026) — PINTU PLUGIN DIBUKA
  //   ⚠️ Sebelum ini plugin sejarah ❌ belum punya `tombolBuka` & `buka()`,
  //      sehingga klik `[sejarah]` di 🧩 ▼ tidak membuka apa pun.
  //      Sekarang ⇒ HALAMAN SENDIRI berisi SEJARAH ALKITAB (prakata).
  tombolBuka: '▶ Buka',

  buka: function () {
    const t = window.ANodesSejarahTampilan;
    if (t && typeof t.buka === 'function') { t.buka(); return; }
    const g = window.ANodesPlugin;
    if (g && g.pesan) g.pesan('⚠️ Halaman sejarah belum siap');
  },

  // tombol [📖 sejarah] di halaman keterangan plugin ini
  //   (kontrak `tombolInfo[]` di js/plugin.js — K55)
  //   K55c: sekarang diarahkan ke HALAMAN MANDIRI (❌ tidak lagi menempel
  //         di halaman baca Alkitab).
  tombolInfo: [
    { ikon: '📖', nama: 'sejarah',
      judul: 'Buka halaman Sejarah Alkitab — bagaimana Firman menjadi tulisan',
      saatKlik: function () {
        const t = window.ANodesSejarahTampilan;
        if (t && t.buka) { t.buka(); return; }
        const g = window.ANodesPlugin;
        if (g && g.pesan) g.pesan('⚠️ Halaman sejarah belum siap');
      } }
  ],

  saatDipasang: function () {
    const s = window.ANodesSejarah;
    if (s && s.dipasang) s.dipasang();
    const t = window.ANodesSejarahTampilan;
    if (t && t.pasangTanda) t.pasangTanda();
    if (t && t.pasangPengait) t.pasangPengait();
  },

  saatDilepas: function () {
    const t = window.ANodesSejarahTampilan;
    if (t && t.bersihkan) t.bersihkan();
    const s = window.ANodesSejarah;
    if (s && s.saatDilepas) s.saatDilepas();
  }
});