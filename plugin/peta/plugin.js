/* ============================================================
   ANodes — plugin/peta/plugin.js
   KETERANGAN PLUGIN: 🗺️ PETA ALKITAB  (K68 — 4 Okt 2026)

   ------------------------------------------------------------
   Bapak 4 Okt 2026: *“peta-lab sekarang di jadikan plugin pada
   ANodes-1berkas dengan nama peta..”*

   ⇒ LAB peta (`peta-lab.html`) yang sudah disetujui bentuknya
     dijadikan **plugin resmi** bernama **Peta**, dengan
     **halaman sendiri** (pola 📖 Sejarah K55c).

   ⚠️ Plugin ini MANDIRI:
     • `buka()` ⇒ HALAMAN PETA (halaman ke-7) — peta + daftar lokasi
     • ❌ TIDAK menyentuh catatan pengguna
     • ❌ TIDAK butuh plugin 📖 Alkitab (data peta berdiri sendiri)
     • dilepas ⇒ halaman ditutup, tidak ada sisa di catatan

   Struktur:
     plugin.js        = berkas ini (keterangan untuk gudang plugin)
     peta.js          = MESIN + gambar peta (window.ANodesPeta)
     tampilan.js      = TAMPILAN halaman (window.ANodesPetaTampilan)
     data/peta.js     = DATA peta (126 lokasi · 42 wilayah · 12 gunung …)
     data/bumi.js     = CITRA relief NASA (domain publik) — dasar peta (K72: satu-satunya dasar)
   ============================================================ */

window.ANodesPlug = window.ANodesPlug || [];

window.ANodesPlug.push({
  id: 'peta',
  nama: 'Peta',
  namaBar: 'Peta',
  ikon: '🗺️',
  versi: '1.0',
  penulis: 'ANodes',
  ukuran: '± 1,2 MB',
  ringkas: 'Peta Tanah Perjanjian & dunia Alkitab — citra relief nyata, lokasi, gunung, laut, sungai, dan wilayah.',
  siap: true,

  angka: [
    { n: '126', l: 'lokasi' },
    { n: '42',  l: 'wilayah' },
    { n: '12',  l: 'gunung' },
    { n: '11',  l: 'perairan' }
  ],

  keterangan:
    'Peta dunia Alkitab — dari Mesir sampai Mesopotamia. Dasarnya **citra relief ' +
    'bumi yang nyata** (NASA, domain publik) sehingga bentuk geografinya asli: ' +
    'pegunungan, gurun, delta sungai, dan laut terlihat seperti keadaan sebenarnya. ' +
    'Di atasnya diletakkan lokasi (kota & tempat), wilayah, gunung, laut, sungai, ' +
    'dan danau yang disebut Alkitab. Peta mulai BERSIH — nama muncul hanya untuk ' +
    'yang Anda pilih dari daftar, supaya tidak bertumpuk dan mudah dibaca.',

  fitur: [
    'Halaman peta sendiri — dibuka 1 klik dari 🧩 ▼ atau gudang plugin.',
    'Dasar peta = citra relief bumi nyata (NASA) — bentuk geografi asli.',
    '126 lokasi (kota · desa · tempat) + 42 wilayah + 12 gunung + 3 laut + 6 sungai + 2 danau.',
    'Daftar lokasi dengan pencarian — klik nama ⇒ muncul di peta (titik + nama + garis batas).',
    'Klik nama wilayah/perairan ⇒ garis batas merah + keterangan + rujukan ayat.',
    'Tombol jenis (🏙️ titik · 💧 air · ⛰️ relief · 🏜️ gurun · 🗺️ wilayah) = sakelar lapis peta.',
    '📋 pilihan = sakelar: ON menampilkan pilihan Anda · OFF mengosongkan peta.',
    '🏷️ semua = tampilkan seluruh nama · 🧹 = sembunyikan semua.',
    'Zoom ＋ − dan geser peta (seret dengan mouse atau jari).',
    '📍 Di halaman baca Alkitab: ayat yang menyebut nama tempat dapat tombol 📍.',
    'Klik 📍 ⇒ mini-peta + keterangan muncul di bawah ayat itu (titik lokasi berkedip).',
    'Satu ayat dengan beberapa nama tempat ⇒ tombol nama di atas peta untuk bergantian.',
    'Bisa dipasang / dilepas sendiri — catatan pengguna tidak tersentuh.'
  ],

  cara: [
    'Buka 🧩 Gudang Plugin → pilih 🗺️ Peta → tekan Pasang.',
    'Tekan ▶ Buka ⇒ halaman peta terbuka.',
    'Cari nama di kotak “cari nama…”, lalu klik namanya ⇒ lokasi muncul di peta.',
    'Klik nama wilayah atau perairan ⇒ garis batas + keterangan + rujukan ayat.',
    'Buka Alkitab (📖) lalu cari ayat yang memuat nama tempat ⇒ ada tombol 📍 di ayat itu.',
    'Klik 📍 ⇒ mini-peta + keterangan muncul di bawah ayat · klik lagi ⇒ tertutup.',
    'Tekan 🏠 untuk kembali ke catatan.'
  ],

  catatan: [
    'Peta ini MANDIRI — tidak perlu plugin 📖 Alkitab terpasang untuk membuka halaman peta.',
    'Tombol 📍 di halaman baca Alkitab BARU muncul kalau plugin 📖 Alkitab juga terpasang.',
    'Citra relief berasal dari NASA (domain publik) dan disimpan di dalam berkas ini — tidak diunduh dari internet.',
    'Data peta disimpan di perangkat ini saja.',
    'Plugin bisa DILEPAS kapan saja — catatan Anda tidak akan hilang.'
  ],

  tombolBuka: '▶ Buka',

  buka: function () {
    const t = window.ANodesPetaTampilan;
    if (t && typeof t.buka === 'function') { t.buka(); return; }
    const g = window.ANodesPlugin;
    if (g && g.pesan) g.pesan('⚠️ Halaman peta belum siap');
  },

  tombolInfo: [
    { ikon: '🗺️', nama: 'peta',
      judul: 'Buka halaman Peta Alkitab',
      saatKlik: function () {
        const t = window.ANodesPetaTampilan;
        if (t && t.buka) { t.buka(); return; }
        const g = window.ANodesPlugin;
        if (g && g.pesan) g.pesan('⚠️ Halaman peta belum siap');
      } }
  ],

  saatDipasang: function () {
    const t = window.ANodesPetaTampilan;
    if (t && t.pasangPengait) t.pasangPengait();
      if (t && t.siapkanOtomatis) t.siapkanOtomatis();
    },

  saatDilepas: function () {
    const t = window.ANodesPetaTampilan;
    if (t && t.bersihkan) t.bersihkan();
  }
});
