/* ============================================================
   ANodes — plugin/interlinear/plugin.js
   KETERANGAN PLUGIN: 🔤 Interlinear (bahasa asli + kode Strong)  — K85
   ------------------------------------------------------------
   Berkas ini HANYA KETERANGAN (nama, ukuran, bisa apa saja, cara pakai).
   Isi sebenarnya:
     plugin/interlinear/interlinear.js       = MESIN (data + pencarian)
     plugin/interlinear/tampilan.js          = TAMPILAN (tombol 🔤 + kolom)
     plugin/interlinear/data/interlinear.js  = DATA (dibuat tools/siapkan-data-interlinear.js)

   Dimuat lewat <script src="plugin/interlinear/plugin.js"> di index.html
   (BUKAN fetch) — Chrome di file:// memblokir fetch.
   ============================================================ */

window.ANodesPlug = window.ANodesPlug || [];

window.ANodesPlug.push({
  id: 'interlinear',
  nama: 'Interlinear',
  namaBar: 'Interlinear',
  ikon: '🔤',
  versi: '1.4 (4 Injil + PB Kisah 26 s/d Wahyu 100 % + penjelasan Ibrani PL)',
  penulis: 'ANodes',
  ukuran: '± 8,0 MB',
  ringkas: 'Bahasa asli (Yunani & Ibrani) + kode Strong per kata, menempel di halaman baca Alkitab.',
  siap: true,                 // data sudah ada: plugin/interlinear/data/interlinear.js

  angka: [
    { n: '4', l: 'Injil' },
    { n: '39', l: 'kitab PL' },
    { n: '62', l: 'kitab PB' },
    { n: '30.640', l: 'ayat' }
  ],

  keterangan:
    'Interlinear = teks bahasa asli (Yunani) ditampilkan **kata demi kata** bersama ' +
    '**kode Strong** dan **arti Indonesia**-nya. Tiap ayat di halaman baca Alkitab ' +
    'dapat tombol 🔤; ditekan ⇒ kolom interlinear terbuka tepat di bawah ayat itu. ' +
    'Kode Strong bisa diklik untuk melihat arti lengkapnya. ' +
    '**Tahap 1 = 4 Injil** (Matius · Markus · Lukas · Yohanes) — kata Indonesia ⇄ kata Yunani. ' +
    '**Tahap 2 = Kisah 26 s/d Wahyu** — kata Yunani + alih huruf + arti Indonesia ' +
    '(sumber teks Indonesia per ayat tidak tersedia untuk bagian ini). ' +
    'Isi catatan pengguna TIDAK PERNAH diubah: tombol 🔤 dan kolomnya hanya tampilan.',

  fitur: [
    '🔤 **Tombol per ayat di halaman baca Alkitab** — sekali tekan menampilkan SELURUH kolom interlinear pasal itu; tekan lagi menyembunyikan semuanya.',
    'Tiap kata Indonesia ditampilkan bersama **kode Strong**-nya (mis. `mengasihi` → `G25`).',
    '**Arti Indonesia** tiap kode Strong — diturunkan dari **kata yang benar-benar dipakai** di 4 Injil, ❌ bukan terjemahan mesin.',
    'Klik kode Strong ⇒ panel arti terbuka: kata Yunani asli · alih huruf · arti Indonesia · arti Inggris (Strong 1890, Public Domain).',
    'Kata Yunani asli (mis. `ἀγαπάω`) dan alih hurufnya (`agapáō`) ikut ditampilkan.',
    'Untuk **Kisah 26 s/d Wahyu** kolomnya berbentuk **kata Yunani + alih huruf + arti Indonesia** (mis. `θύραν (thuran) G2374 pintu`).',
    'Tombol 🏠 / Esc / Ctrl+B kembali — CATATAN TIDAK PERNAH DIUBAH.'
  ],

  cara: [
    'Buka 🧩 Gudang Plugin → pilih 🔤 Interlinear → tekan Pasang.',
    'Buka halaman baca Alkitab (mis. Yohanes 3 atau Wahyu 3).',
    'Tekan tombol 🔤 di ayat mana pun — seluruh kolom interlinear pasal itu terbuka.',
    'Klik kode Strong (mis. G25) untuk melihat arti lengkapnya.',
    'Tekan 🔤 lagi untuk menyembunyikan semuanya.'
  ],

  catatan: [
    '⚠️ **Tahap 1 = 4 Injil** (Matius · Markus · Lukas · Yohanes = 3.778 ayat) memakai sumber **idkjv** (Indonesia + Strong).',
    '⚠️ **Tahap 2 = Kisah 26 s/d Wahyu** (3.271 ayat) memakai **STEPBible TAGNT** (CC BY 4.0) — sumber idkjv tidak punya teks Indonesia untuk bagian ini ⇒ kolomnya **kata Yunani + alih huruf + arti Indonesia**.',
    '✅ **Cakupan arti PB = 100 %** dari seluruh kemunculan kata isi (tahap 1 = 89,6 % · tahap 2 = 95,1 % · **tahap 3 = 100 %** — 1.398 arti baru untuk kata frekuensi 1×).',
    '✅ **Perjanjian Lama (39 kitab) sudah ada** lewat kolom 🖊 — penjelasan dari bahasa **Ibrani** (K90), **22.688 dari 23.213 ayat = 97,7 %**.',
    '⚠️ Tombol 🔤 dan kolom interlinear HANYA TAMPILAN — tidak ikut tersimpan ke catatan pengguna.',
    '⚠️ **Arti Indonesia bukan terjemahan mesin.** Data kamus Strong berbahasa Indonesia yang beredar hanya punya **5 dari 14.197** entri terisi (dan itu pun hasil mesin) ⇒ tidak dipakai. Arti di sini diambil dari **kata yang dipakai penerjemah** untuk nomor Strong itu.',
    '⚠️ Lukas 17:36 tidak ada di sumber idkjv (ayat kurung) ⇒ ayat itu tidak punya tombol 🔤.',
    '📜 **Lisensi:** teks Indonesia + Strong dari **idkjv** (Public Domain) · lemma Yunani & arti Inggris dari **Strong\'s Dictionary** (Public Domain) · teks Yunani PB dari **STEPBible TAGNT** (CC BY 4.0 · STEPBible.org / Tyndale House Cambridge) · teks Ibrani dari **morphhb** (CC BY 4.0) · struktur **OpenScriptures** (CC BY 4.0).',
    '💡 Berguna untuk melihat kata asli di balik terjemahan — mis. `agápē` (kasih tanpa syarat) vs `philía` (kasih persahabatan).'
  ],

  /* ▶ Buka = langsung ke halaman baca Alkitab (tempat tombol 🔤 berada) */
  tombolBuka: '▶ Buka Alkitab',

  buka() {
    const t = window.ANodesAlkitabTampilan;
    if (t && typeof t.bukaHalaman === 'function') return t.bukaHalaman();
  },

  saatDipasang() {
    if (window.ANodesInterlinear && window.ANodesInterlinear.dipasang) {
      window.ANodesInterlinear.dipasang();
    }
    // K90 — mesin Ibrani (Perjanjian Lama) ikut dimuat
    if (window.ANodesIbrani && window.ANodesIbrani.dipasang) {
      try { window.ANodesIbrani.dipasang(); } catch (e) {}
    }
    // K85 tahap 2 — mesin PB (Kisah 26 s/d Wahyu) ikut dimuat
    if (window.ANodesPb && window.ANodesPb.dipasang) {
      try { window.ANodesPb.dipasang(); } catch (e) {}
    }
    /* ⚠️ WAJIB mendaftarkan ULANG penghias tiap kali plugin DIPASANG.
       `saatDilepas` membuang pendaftaran ⇒ tanpa baris ini “lepas lalu
       pasang lagi” membuat tombol 🔤 TIDAK muncul (pelajaran K45 i). */
    if (window.ANodesInterlinearTampilan && window.ANodesInterlinearTampilan.siapkanOtomatis) {
      try { window.ANodesInterlinearTampilan.siapkanOtomatis(); } catch (e) {}
    }
  },

  saatDilepas() {
    if (window.ANodesInterlinearTampilan && window.ANodesInterlinearTampilan.bersihkan) {
      try { window.ANodesInterlinearTampilan.bersihkan(); } catch (e) {}
    }
    if (window.ANodesInterlinear && window.ANodesInterlinear.saatDilepas) {
      try { window.ANodesInterlinear.saatDilepas(); } catch (e) {}
    }
    if (window.ANodesIbrani && window.ANodesIbrani.saatDilepas) {
      try { window.ANodesIbrani.saatDilepas(); } catch (e) {}
    }
    if (window.ANodesPb && window.ANodesPb.saatDilepas) {
      try { window.ANodesPb.saatDilepas(); } catch (e) {}
    }
  }
});
