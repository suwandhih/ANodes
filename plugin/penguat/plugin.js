/* ============================================================
   ANodes — plugin/penguat/plugin.js
   KETERANGAN PLUGIN: 🖊 Pembaca Penguat  (K47)
   ------------------------------------------------------------
   Permintaan Bapak 19 Sep 2026:
     “sebelum lanjut yesaya.. tolong buat plugin sementara.. ingin liat isi..
      tapi plugin **bukan konek ke catatan** .. ini **mandiri** ..
      buka liat baca seperti alkitab.. mandiri saja.. mau baca2 hasilnya”

   Jadi plugin ini SENGAJA TIDAK menyentuh catatan:
     ❌ tidak menandai kata · ❌ tidak menambah panel di catatan ·
     ❌ tidak mengubah isi catatan sama sekali.
     ✅ hanya membuka HALAMAN SENDIRI (seukuran catatan) untuk MEMBACA
        hasil penguat (komentar/tafsiran per ayat).

   Berkas ini HANYA KETERANGAN (nama, ukuran, bisa apa saja, cara pakai).
   Isi sebenarnya:
     plugin/penguat/penguat.js          = MESIN (data + pencarian)
     plugin/penguat/tampilan.js         = TAMPILAN (halaman baca)
     plugin/penguat/data/penguat.js     = DATA (dibuat tools/siapkan-data-penguat.js)

   Dimuat lewat <script src="plugin/penguat/plugin.js"> di index.html
   (BUKAN fetch) — Chrome di file:// memblokir fetch.
   ============================================================ */

window.ANodesPlug = window.ANodesPlug || [];

window.ANodesPlug.push({
  id: 'penguat',
  nama: 'Penguat',
  namaBar: 'Penguat',
  ikon: '🖊',
  versi: '1.4 (tautan ayat di dalam penguat)',
  penulis: 'ANodes',
  ukuran: '± 12,4 MB',
  ringkas: 'Penguat (tafsiran per ayat) menempel di catatan + halaman pembaca mandiri.',
  siap: true,                 // data sudah ada: plugin/penguat/data/penguat.js

  angka: [
    { n: '66', l: 'kitab' },
    { n: '31.102', l: 'ayat' }
  ],

  keterangan:
    'Penguat = keterangan/tafsiran per ayat. Sekarang ada DUA cara memakainya: ' +
    '(1) **menempel di catatan** — tiap nama ayat di catatan dapat tombol 🖊, ' +
    'tekan ⇒ kotak penguat terbuka tepat di bawah ayat itu; ' +
    '(2) **halaman pembaca mandiri** — membaca penguat seperti membaca Alkitab. ' +
    'Isinya SELURUH ALKITAB — Perjanjian Lama (Kejadian sampai Maleakhi, 39 kitab) ' +
    'dan Perjanjian Baru (Matius sampai Wahyu, 27 kitab) — seluruhnya 66 kitab, ' +
    '31.102 ayat. Isi catatan pengguna TIDAK PERNAH diubah: tombol 🖊 dan kotaknya ' +
    'hanya tampilan, tidak ikut tersimpan.',

  fitur: [
    '🖊 **Penguat menempel DI CATATAN** — tiap nama ayat di catatan dapat tombol 🖊; ditekan ⇒ kotak penguat terbuka tepat di bawah ayat itu (tanpa meninggalkan catatan).',
    'Buka/tutup semua kotak penguat di catatan dengan satu tombol — catatan tetap di tempatnya.',
    'Pilih kitab (yang sudah punya penguat) — lalu pilih pasal, untuk membaca lewat halaman mandiri.',
    'Setiap ayat ditampilkan bersama kotak penguatnya (latar krem).',
    'Tombol ◀ ▶ untuk pindah pasal dengan cepat.',
    'Deretan nomor ayat — diklik langsung menuju ayat itu.',
    '🔍 Cari di dalam ISI PENGUAT (mis. “kasih”, “perjanjian”) — hasilnya bisa diklik.',
    'Ingat bacaan terakhir (buka lagi → kembali ke kitab/pasal yang terakhir dibaca).',
    'Kalau plugin 📖 Alkitab terpasang, teks ayatnya ikut ditampilkan.',
    '🔗 **Rujukan ayat DI DALAM teks penguat bisa diklik** — mis. “…Bandingkan Mazmur 34:10 dan Yohanes 10:11.” ⇒ tekan ⇒ langsung lompat ke ayat itu di halaman baca Alkitab.',
    '🏠 **Kembali ke tempat semula** — sesudah membaca ayat tujuan, tekan 🏠 ⇒ kembali ke halaman/pasal yang tadi (posisi gulir dipulihkan).',
    'Di halaman baca Alkitab, tiap ayat punya tombol 🖊 — sekali tekan menampilkan SELURUH penguat pasal itu; tekan lagi menyembunyikan semuanya.',
    'Tombol 🏠 / Esc / Ctrl+B kembali — CATATAN TIDAK PERNAH DIUBAH.'
  ],

  cara: [
    'Buka 🧩 Gudang Plugin → pilih 🖊 Penguat → tekan Pasang.',
    'Tekan ▶ Buka di catatan — tombol 🖊 muncul pada tiap nama ayat yang punya penguat.',
    'Tulis ayat di catatan (mis. “Yohanes 3:16”), lalu tekan tombol 🖊 di sebelahnya.',
    'Mau membaca lebih leluasa? Buka “Halaman Pembaca Penguat” dari tombol di halaman keterangan ini.',
    'Mau mencari kata di dalam penguat? Tekan 🔍 Cari dan ketik katanya.'
  ],

  catatan: [
    '⚠️ Tombol 🖊 dan kotak penguat di catatan HANYA TAMPILAN — tidak ikut tersimpan ke catatan pengguna.',
    '⚠️ Penguat terbuka hanya untuk ayat yang ditekan (di catatan) — supaya tulisan pengguna tidak dibanjiri kotak.',
    '⚠️ SELURUH 66 KITAB sudah punya penguat (31.102 ayat) — Alkitab tuntas 100%.',
    '⚠️ Halaman Pembaca Penguat (mandiri) tetap ada — untuk membaca lewat halaman penuh.',
    '🔗 Rujukan ayat di dalam teks penguat bisa diklik (8.136 dari 31.102 ayat penguat memuat rujukan) — tekan ⇒ lompat ke ayat itu; tekan 🏠 ⇒ kembali ke tempat semula.',
    '💡 Sesudah membaca, pengguna bisa menilai: mana yang perlu diperbaiki · mana yang sudah baik.',
    '✅ Perjanjian Lama (39 kitab) & Perjanjian Baru (27 kitab) tuntas ditulis bergaya tafsir.',
  ],

  /* Pilihan cara tampil — memakai kontrak plugin yang sudah ada
     (`pilihanTampil[]` = `{id, nama, contoh}` · `caraTampil()` · `pilihCara(id)`).
     “Mematikan tombol 🖊 di catatan” berguna kalau catatan sedang ramai. */
  pilihanTampil: [
    { id: 'tombol', nama: '🖊 Tombol di catatan (bawaan)', contoh: 'tiap ayat dapat tanda 🖊' },
    { id: 'tutup', nama: '🚫 Matikan tombol 🖊', contoh: 'catatan tetap bersih' }
  ],

  caraTampil() {
    const t = window.ANodesPenguatTampilan;
    return (t && typeof t.caraCatatan === 'function') ? t.caraCatatan() : 'tombol';
  },

  pilihCara(id) {
    const t = window.ANodesPenguatTampilan;
    if (!t || typeof t.simpanCaraCatatan !== 'function') return;
    const c = (id === 'tutup') ? 'tutup' : 'tombol';
    t.simpanCaraCatatan(c);
    if (c === 'tutup') { if (t.tutupCatatan) t.tutupCatatan(); }
    else { if (t.bukaCatatan) t.bukaCatatan(); }
  },

  /* ▶ Buka = penguat MENEMPEL DI CATATAN (K45 i).
     Halaman Pembaca Penguat (K47) tetap bisa dibuka dari halaman keterangan. */
  tombolBuka: '▶ Buka',

  buka() {
    if (window.ANodesPenguatTampilan && window.ANodesPenguatTampilan.bukaCatatan) {
      return window.ANodesPenguatTampilan.bukaCatatan();
    }
  },

  /* Tombol tambahan di HALAMAN KETERANGAN (kontrak `tombolInfo[]` =
     `{id, nama, ikon, judul, saatKlik}`).
     Di sini pintu ke halaman mandiri (K47) tetap disediakan. */
  tombolInfo: [
    {
      id: 'pg-info-baca',
      ikon: '📖',
      nama: 'Halaman Pembaca Penguat',
      judul: 'Buka halaman mandiri untuk membaca penguat seperti membaca Alkitab',
      saatKlik() {
        if (window.ANodesPenguatTampilan && window.ANodesPenguatTampilan.buka) {
          window.ANodesPenguatTampilan.buka();
        }
      }
    }
  ],

  saatDipasang() {
    if (window.ANodesPenguat && window.ANodesPenguat.dipasang) {
      window.ANodesPenguat.dipasang();
    }
    /* ⚠️ K45 i (23 Sep 2026) — WAJIB mendaftarkan ULANG penghias tiap kali
       plugin DIPASANG. `saatDilepas` membuang pendaftaran penghias
       (`lepasPenghiasTanda`), jadi tanpa baris ini “lepas lalu pasang lagi”
       membuat tombol 🖊 di catatan TIDAK muncul (cacat nyata, ketemu saat uji). */
    if (window.ANodesPenguatTampilan && window.ANodesPenguatTampilan.siapkanOtomatis) {
      try { window.ANodesPenguatTampilan.siapkanOtomatis(); } catch (e) {}
    }
  },

  saatDilepas() {
    if (window.ANodesPenguat && window.ANodesPenguat.saatDilepas) {
      return window.ANodesPenguat.saatDilepas();
    }
    // K54 — tombol & kotak penguat di halaman baca Alkitab ikut dibuang
    if (window.ANodesPenguatTampilan && window.ANodesPenguatTampilan.bersihkan) {
      try { window.ANodesPenguatTampilan.bersihkan(); } catch (e) {}
    }
  }
});
