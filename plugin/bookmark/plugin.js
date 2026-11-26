/* ============================================================
   ANodes — plugin/bookmark/plugin.js
   KETERANGAN PLUGIN: 🔖 Bookmark Ayat   (K81 — 30 Okt 2026 · K82 — 30 Okt 2026)
   ------------------------------------------------------------
   Bapak: *“perlu plugin tambahan .. bookmark ayat alkitab..”*

   Dimuat lewat <script src="plugin/bookmark/plugin.js"> di index.html
   (BUKAN fetch — Chrome memblokir fetch di file://).
   ============================================================ */

window.ANodesPlug = window.ANodesPlug || [];

window.ANodesPlug.push({
  id: 'bookmark',
  nama: 'Bookmark Ayat',
  ikon: '🔖',
  versi: '1.3',
  penulis: 'ANodes',
  ukuran: '± 20 KB',
  ringkas: 'Tandai ayat untuk digali nanti — daftar sendiri, bisa diedit & disalin.',
  siap: true,

  angka: [
    { n: '∞', l: 'bookmark' },
    { n: '1', l: 'klik menandai' }
  ],

  keterangan:
    'Saat membaca Alkitab, kadang ada ayat yang ingin digali nanti — tetapi ' +
    'saat itu sedang membaca bagian lain. Plugin ini memberi DUA JALUR saat ' +
    'Anda mengklik angka ayat: [📋 Simpan] mengirim ayat ke catatan, dan ' +
    '[🔖 Bookmark] menyimpannya ke daftar bookmark lalu membuka halaman ' +
    '🔖 Bookmark. Ayat yang sudah ditandai diberi tanda di halaman baca, dan ' +
    'boleh ditandai ulang untuk topik yang berbeda.',

  fitur: [
    'Tombol [🔖 Bookmark] di bar pilihan ayat — dua jalur: ke catatan atau ke bookmark.',
    'Tombol 🔖 di bar atas Alkitab — pintu cepat ke halaman Bookmark.',
    'Bisa satu ayat, beberapa ayat berurutan, atau satu pasal penuh.',
    'Ayat yang sudah ditandai diberi tanda di halaman baca.',
    'Halaman 🔖 Bookmark berisi daftar semua ayat yang ditandai.',
    'Klik kartu bookmark ⇒ langsung dibuka di Alkitab pada ayat itu (ayatnya disorot).',
    'Tiap bookmark bisa diberi catatan satu baris (mis. “bandingkan dengan Imamat”).',
    'Bisa diedit — pindah ke Alkitab, tambah ayat dengan klik, hapus dengan klik ulang.',
    'Bisa disalin (📋 Copy) untuk ditempel ke catatan.',
    'Ikut disinkronkan PC ⇄ HP.'
  ],

  cara: [
    'Pasang plugin ini dari gudang plugin.',
    'Buka Alkitab, lalu klik angka ayat yang ingin ditandai (boleh beberapa).',
    'Di bar pilihan ayat ada DUA tombol: [📋 Simpan] ke catatan · [🔖 Bookmark] ke daftar bookmark.',
    'Tekan [🔖 Bookmark] ⇒ ayat tersimpan dan Anda langsung pindah ke halaman 🔖 Bookmark.',
    'Bisa juga lewat tombol 🔖 di bar atas Alkitab, atau 🧩 → 🔖 Bookmark Ayat → ▶ Buka.',
    'Di daftar: KLIK KARTUNYA untuk membuka ayat itu di Alkitab (🏠 kembali ke daftar).',
    'Di daftar: [📋 Copy] untuk menyalin · [✏️ Edit] untuk mengubah · [🗑] untuk menghapus.'
  ],

  catatan: [
    'Ayat yang ditandai TIDAK mengubah isi catatan Anda.',
    'Kalau ayat yang diklik melompat (mis. 24 lalu 26), hasilnya DUA bookmark terpisah.',
    'Bookmark disimpan di perangkat dan ikut disinkronkan kalau ☁️ Sinkron aktif.'
  ],

  // tombol di halaman keterangan plugin (dipasang js/plugin.js)
  tombolBuka: '▶ Buka halaman Bookmark',
  buka: function () {
    const t = window.ANodesBookmarkTampilan;
    if (t && typeof t.bukaHalaman === 'function') { t.bukaHalaman(); return; }
    const g = window.ANodesPlugin;
    if (g && g.pesan) g.pesan('⏳ Halaman bookmark belum siap');
  },

  saatDipasang: function () {
    const t = window.ANodesBookmarkTampilan;
    if (t && typeof t.siapkanOtomatis === 'function') t.siapkanOtomatis();
  },

  saatDilepas: function () {
    const t = window.ANodesBookmarkTampilan;
    if (t && typeof t.bersihkan === 'function') t.bersihkan();
  }
});
