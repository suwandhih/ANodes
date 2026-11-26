/* ============================================================
   ANodes — plugin/kamus/tampilan.js
   TAMPILAN PLUGIN KAMUS ISTILAH (K42)
   ------------------------------------------------------------
   ⚠️ BERKAS INI BARU SEBAGIAN — baru **butir a** (pondasi).
      Yang sudah ada di sini:
        • caraTampil / pilihCara / simpanCaraTampil  (kontrak plugin — WAJIB)
        • hidupkan() / bersihkan()                   (dipanggil mesin)
        • bukaDaftar()                               (tombol ▶ Buka di gudang)

      Yang BELUM (menunggu butir berikutnya):
        • butir b — halaman 📚 Kamus Istilah (halaman ke-4) + kotak cari
        • butir c — garis putus-putus istilah di catatan
        • butir d — halaman arti + kolom ayat + berantai
        • butir e — istilah di halaman baca Alkitab
        • butir f — halaman Ayat & Istilah
        • butir g — kamus pribadi + antrian istilah

   ⚠️ `caraTampil` / `pilihCara` / `simpanCaraTampil` WAJIB ADA di berkas ini.
      `plugin/kamus/plugin.js` memanggilnya lewat window.ANodesKamusTampilan.
      Kalau hilang → tombol pilihan cara di halaman keterangan plugin
      MATI DIAM-DIAM (pelajaran nyata dari plugin Ayat Terkait, K25).
   ============================================================ */

window.ANodesKamusTampilan = (function () {
  'use strict';

  // ⚠️ PENANDA VERSI — naikkan setiap kali berkas ini diperbaiki.
  //    Dipakai untuk MEMBUKTIKAN berkas baru benar-benar termuat
  //    (K47c: "sudah diperbaiki, Chrome belum berubah").
  //    v21Sep-a → K50: tautan istilah ber-tanda-baca & ber-tanda-hubung.
  //    v21Sep-b → K51: KOLOM ISTILAH (kolom ke-2) — klik istilah = keterangannya
  //                    tampil di kolom (tidak pindah halaman) — Bapak 21 Sep 2026.
  //    v21Sep-c → K51 REVISI: kolom istilah MENUMPUK per LEVEL (kolom BARU di
  //                    bawah · hanya level SAMA yang ditimpa) — Bapak 21 Sep 2026.
  //    v21Sep-d → K51 revisi 2: kolom **SELALU SELEBAR LAYAR** ( jangan dikecilkan —
  //                    di HP ruang tulis jadi sempit) · turunan ditandai BADGE
  //                    “Tingkat n” — Bapak 21 Sep 2026.
  //    v21Sep-e → K51 revisi 3: **GARIS VERTIKAL HIJAU DI KIRI DIHAPUS** supaya
  //                    ruang tulis lebih lebar — Bapak 21 Sep 2026.
  //    v21Sep-f → K52: **TAUTAN ISTILAH DI HALAMAN BACA & PENGUAT BISA DIKLIK**
  //                    (Yos 1:8 “Taurat” dulu MATI) · chip “Istilah di pasal ini”
  //                    bisa diklik · 🏠 balik ke halaman asal + sorot kuning.
  //    v21Sep-g → K51 c+d: **BLOK ISTILAH + `✓ pilih` + `＋ Istilah`** — pilih
  //                    keterangan jadi blok tetap, lalu kirim ke catatan (jalur K40).
  const VERSI = 'v30Okt-j';   // K83 (30 Okt 2026) — 📚 kamus nama orang/tempat/istilah + kata ganti (batch 4+5+6)

  const KUNCI_CARA = 'anodes-kamus-cara';       // ⚠️ wajib masuk KUNCI_AMAN alat uji
  const KUNCI_PRIBADI = 'anodes-kamus-pribadi'; // ⚠️ wajib masuk KUNCI_AMAN alat uji

  // 👤 K100 (3 Nov 2026) — istilah pribadi dipisah per email (lihat js/pengguna.js).
  //    ⚠️ Kalau js/pengguna.js belum termuat, kunci kembali ke bentuk lama
  //       supaya aplikasi TETAP JALAN.
  function kunciPribadi() {
    const P = window.ANodesPengguna;
    return (P && P.kunci) ? P.kunci(KUNCI_PRIBADI) : KUNCI_PRIBADI;
  }
  const CARA_BAWAAN = 'putus';              // 'putus' = garis putus-putus (bawaan)

  let hidup = false;

  // ------------------------------------------------------------
  // pilihan cara tampil (kontrak plugin)
  // ------------------------------------------------------------
  function caraTampil() {
    try {
      const v = localStorage.getItem(KUNCI_CARA);
      return (v === 'tombol' || v === 'putus') ? v : CARA_BAWAAN;
    } catch (e) { return CARA_BAWAAN; }
  }

  function simpanCaraTampil(id) {
    try { localStorage.setItem(KUNCI_CARA, id); } catch (e) {}
  }

  function pilihCara(id) {
    if (id !== 'putus' && id !== 'tombol') return;
    simpanCaraTampil(id);
    // kalau tampilan sudah hidup, terapkan langsung
    if (hidup) {
      if (id === 'tombol') bersihkanTanda();
      else tandaiSemua();
    }
  }

  // ============================================================
  // KEADAAN (state)
  // ============================================================
  let asal           = null;   // { index, teks, gulir } — kata yang diklik di catatan
  let asalKamus      = null;   // K43 b: { nama, ref, label } — sedang “dipinjamkan” ke Alkitab
  // K52 — kata istilah yang diklik dari HALAMAN LAIN (baca Alkitab / penguat).
  //   { jenis:'baca'|'penguat', ref:{no,pasal,ayat}, teks }
  //   Dipakai supaya tombol 🏠 membawa kembali KE HALAMAN ITU + sorot ayatnya.
  let asalHalaman    = null;
  let riwayatIstilah = [];     // riwayat istilah (tombol ↩) — maks 30 langkah
  let istilahKini    = null;   // nama istilah yang sedang tampil
  let modeDaftar     = false;  // halaman sedang menampilkan daftar istilah
  let daftarPribadi  = null;   // kamus pribadi (butir g)
  let petaPribadi    = new Map();
  let panelCatatan   = null;   // panel 📋 Ayat & Istilah (butir f)
  let timerPanel     = null;
  let dipasangKait   = false;  // pengait klik dipasang sekali saja
  let kaitAyatBaca   = false;  // penghias halaman baca sudah didaftarkan
  let kaitPenguat    = false;  // K52: penghias halaman penguat sudah didaftarkan
  let pengaitPanel   = false;  // pengait global (panel & halaman) sekali saja

  const KELAS        = 'kamus-istilah';     // ← WAJIB sama dengan window.ANodesTandaKelas
  const KELAS_AYAT   = 'kamus-ay-link';     // tautan ayat DI DALAM arti (halaman kamus saja)
  const KELAS_TERM   = 'kamus-ist-link';    // tautan istilah lain di dalam arti
  const KELAS_SOROT  = 'kamus-sorot';       // sorot kuning kata asal

  // ------------------------------------------------------------
  // alat kecil
  // ------------------------------------------------------------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function escRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  const mesin = () => window.ANodesKamus;
  const adaData = () => { const m = mesin(); return !!m && m.siap(); };
  const halaman = () => document.getElementById('kamus-halaman');
  const isiHal = () => document.getElementById('kamus-isi');
  const editorEl = () => document.getElementById('editor');

  function pesan(t, ms) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = t;
    el.classList.add('tampil');
    clearTimeout(el._tT);
    el._tT = setTimeout(() => el.classList.remove('tampil'), ms || 2400);
  }

  function pluginAktif() {
    return !!(window.ANodesPlugin && window.ANodesPlugin.dipasang
              && window.ANodesPlugin.dipasang('kamus'));
  }

  // apakah penandaan istilah boleh jalan sekarang?
  //
  // ⚠️ JANGAN bergantung pada penanda `hidup` saja (perbaikan 18 Sep 2026 —
  //    cacat nyata yang ketemu saat menguji): kalau `bersihkan()` pernah
  //    dijalankan (mis. plugin dilepas-pasang, atau mesin memuat ulang data),
  //    `hidup` tetap false sampai `hidupkan()` dipanggil ulang — dan selama itu
  //    istilah TIDAK ditandai walau plugin jelas terpasang & datanya siap.
  //    Sekarang syaratnya cukup: plugin terpasang + data siap + cara 'putus'.
  //    Saat plugin benar-benar dilepas, mesin membuang datanya (`saatDilepas`)
  //    sehingga syarat ini mati sendiri — catatan tetap bersih.
  // 🔌 K70 (5 Okt 2026) — sakelar ON/OFF penandaan **CATATAN**.
  //   ⚠️ Sakelar ini HANYA untuk catatan (`#editor`). Halaman plugin
  //      (Alkitab · Penguat · Sejarah) ❌ TIDAK ikut mati — itu yang
  //      dinyatakan sendiri oleh K70 di `js/editor.js`.
  //   🐞 CACAT NYATA (30 Okt 2026, ketemu saat menguji K83): dulu
  //      `bisaTandai()` membaca sakelar ini TANPA memeriksa wadah ⇒
  //      saat bawaan OFF, istilah di **halaman baca Alkitab** ikut mati
  //      (0 tanda) padahal halaman itu bukan catatan.
  function sakelarCatatanHidup() {
    if (window.ANodesEditor && typeof window.ANodesEditor.catatanDitandai === 'function') {
      return !!window.ANodesEditor.catatanDitandai();
    }
    return true;   // editor belum siap ⇒ jangan menghalangi
  }

  // apakah penandaan istilah boleh jalan sekarang?
  //   `wadah` (opsional) = tempat yang akan ditandai. Kalau wadahnya
  //   BUKAN catatan (`#editor`), sakelar K70 diabaikan.
  function bisaTandai(wadah) {
    if (!pluginAktif() || !adaData()) return false;
    if (caraTampil() !== 'putus') return false;
    // sakelar K70 hanya berlaku untuk catatan
    if (wadah === undefined || wadah === null) {
      // tanpa keterangan wadah ⇒ anggap catatan (pemanggil lama)
      if (!sakelarCatatanHidup()) return false;
    } else if (wadah === editorEl()) {
      if (!sakelarCatatanHidup()) return false;
    }
    if (!hidup) hidup = true;      // selaraskan keadaan
    return true;
  }

  // ============================================================
  // KAMUS PRIBADI (butir g)
  // ============================================================
  function muatPribadi() {
    if (daftarPribadi) return daftarPribadi;
    let d = { daftar: [] };
    try {
      const s = localStorage.getItem(kunciPribadi());
      if (s) d = JSON.parse(s) || d;
    } catch (e) {}
    if (!Array.isArray(d.daftar)) d.daftar = [];
    daftarPribadi = d;
    siapkanPetaPribadi();
    return daftarPribadi;
  }

  function simpanPribadi() {
    try { localStorage.setItem(kunciPribadi(), JSON.stringify(daftarPribadi || { daftar: [] })); }
    catch (e) {}
  }

  // huruf + spasi + tanda hubung & ≥ 3 huruf — aturan sama seperti kamus bawaan
  const HANYA_HURUF = /^[A-Za-z][A-Za-z -]*$/;

  /* K57 (23 Sep 2026) — daftar kata yang BENTROK dengan nama asing.
     Sama seperti `BENTROK_ASING` di `plugin/kamus/kamus.js`.
     “Sea” (takaran) di dalam “Dead Sea Scrolls” JANGAN ditandai;
     “sea” yang berdiri sendiri tetap ditandai. Lihat catatan lengkap di kamus.js. */
  const BENTROK_ASING = ['sea'];

  /* K62 (23 Sep 2026) — nama kitab yang diikuti pola rujukan ayat DILEWATI.
     Sama seperti aturan di `plugin/kamus/kamus.js` (lihat catatan lengkap di sana).
     Sebabnya: 5 nama kitab juga entri kamus (`Mazmur` · `Amsal` · `Ibrani` ·
     `Hakim-Hakim` · `Kisah Para Rasul`) ⇒ saat MENGETIK, kata itu lebih dulu
     ditandai istilah ⇒ teks “Mazmur 23:1” terpecah ⇒ **tautan ayat hilang**.
     Diukur di seluruh 31.102 ayat: ke-5 nama itu muncul **0×** diikuti angka. */
  const NAMA_KITAB_KAMUS = ['hakim-hakim', 'mazmur', 'amsal', 'kisah para rasul', 'ibrani'];
  const POLA_RUJUKAN_AYAT = /\s*\d{1,3}\s*[:.]/;
  const diikutiRujukanAyat = (teks, akhir) =>
    !!teks && POLA_RUJUKAN_AYAT.test(teks.slice(akhir, akhir + 8));

  function siapkanPetaPribadi() {
    petaPribadi = new Map();
    (daftarPribadi ? daftarPribadi.daftar : []).forEach(e => {
      const semua = [e.nama].concat(Array.isArray(e.alias) ? e.alias : []);
      semua.forEach(t => {
        if (!t) return;
        // ⚠️ NAMA RESMI (dengan tanda baca pun) SELALU bisa diklik (K50)
        const kunci = String(t).toLowerCase();
        if (String(t) === String(e.nama)) { petaPribadi.set(kunci, e); return; }
        if (!HANYA_HURUF.test(t)) return;
        if (String(t).replace(/ /g, '').length < 3) return;
        petaPribadi.set(kunci, e);
      });
    });
  }

  function istilahPribadi(tulisan) {
    muatPribadi();
    return petaPribadi.get(String(tulisan || '').toLowerCase()) || null;
  }

  // ------------------------------------------------------------
  // K43 a — CATATAN BAPAK (keterangan tambahan)
  //   ⚠️ TERPISAH dari keterangan kamus. Field-nya `catatan`, ❌ BUKAN `arti`.
  //      Keterangan kamus tetap utuh & tidak bisa diubah dari kolom ini
  //      (Bapak bisa menambah/lengkapi, bukan menimpa).
  // ------------------------------------------------------------
  function catatanBapak(nama) {
    const p = istilahPribadi(nama);
    return (p && typeof p.catatan === 'string') ? p.catatan : '';
  }

  function simpanCatatanBapak(nama, teks) {
    const n = String(nama || '').trim();
    if (!n) return false;
    muatPribadi();
    let e = daftarPribadi.daftar.find(x =>
      String(x.nama).toLowerCase() === n.toLowerCase());
    if (!e) {
      // ⚠️ entri baru dibuat TANPA `arti` supaya keterangan kamus bawaan
      //    tetap dipakai — jangan sampai tertimpa jadi “belum ada keterangan”.
      e = { nama: n, alias: [], arti: '', pribadi: true };
      daftarPribadi.daftar.push(e);
    }
    e.catatan = String(teks == null ? '' : teks);
    simpanPribadi();
    siapkanPetaPribadi();
    return true;
  }

  // keterangan yang DIPAKAI halaman arti: entri pribadi kalau punya arti
  // sendiri, kalau tidak → entri bawaan (jadi keterangan tidak pernah hilang)
  function entriUntukHalaman(nama) {
    const m = mesin();
    const bawaan = (m && m.siap()) ? m.istilah(nama) : null;
    const pribadi = istilahPribadi(nama);
    if (!pribadi) return bawaan;
    const artiPribadi = String(pribadi.arti || '').trim();
    const catatan = String(pribadi.catatan || '').trim();
    // kalau entri pribadi tidak punya arti & tidak punya catatan → pakai bawaan
    if (!artiPribadi && !catatan) return bawaan || pribadi;
    // punya arti sendiri → pribadi menang (perilaku kamus pribadi butir g)
    if (artiPribadi) return pribadi;
    // hanya punya CATATAN → pakai keterangan bawaan + catatan Bapak
    return {
      nama: (bawaan && bawaan.nama) || pribadi.nama,
      alias: (bawaan && bawaan.alias) || pribadi.alias,
      arti: (bawaan && bawaan.arti) || '',
      catatan: catatan,
      pribadi: true
    };
  }

  // satu istilah dicari: kamus pribadi MENANG atas kamus bawaan
  function istilah(nama) {
    if (!nama) return null;
    const p = istilahPribadi(nama);
    if (p) return p;
    const m = mesin();
    return m && m.siap() ? m.istilah(nama) : null;
  }

  // semua istilah (bawaan + pribadi), pribadi menimpa kalau nama sama
  function semuaIstilah() {
    const m = mesin();
    const bawaan = m && m.siap() ? m.semuaIstilah() : [];
    muatPribadi();
    const peta = new Map();
    bawaan.forEach(e => peta.set(String(e.nama).toLowerCase(), e));
    (daftarPribadi.daftar || []).forEach(e => peta.set(String(e.nama).toLowerCase(), e));
    return [...peta.values()].sort((a, b) =>
      String(a.nama).localeCompare(String(b.nama), 'id'));
  }

  function cariIstilah(kata) {
    const q = String(kata || '').trim().toLowerCase();
    const semua = semuaIstilah();
    if (!q) return semua;
    return semua.filter(e => {
      if (String(e.nama).toLowerCase().indexOf(q) >= 0) return true;
      return (e.alias || []).some(a => String(a).toLowerCase().indexOf(q) >= 0);
    });
  }

  // temukan istilah di teks: gabungan bawaan + pribadi (pribadi menimpa)
  function temukanIstilah(teks) {
    if (!teks) return [];
    const m = mesin();
    let hasil = [];
    if (m && m.siap() && m.temukanIstilah) {
      hasil = m.temukanIstilah(teks).map(k => ({
        mulai: k.mulai, akhir: k.akhir, tulisan: k.tulisan,
        entri: istilahPribadi(k.tulisan) || k.entri
      }));
    }
    muatPribadi();
    if (petaPribadi.size) {
      const nama = [...petaPribadi.keys()].sort((a, b) => b.length - a.length).map(escRe);
      const re = new RegExp('\\b(' + nama.join('|') + ')\\b', 'gi');
      let x;
      while ((x = re.exec(teks)) !== null) {
        const t = x[0];
        /* K57 — aturan SAMA seperti mesin kamus: kata yang berbenturan dengan
           nama asing (mis. “Sea” di “Dead Sea Scrolls”) hanya ditandai bila
           HURUF KECIL. Lihat BENTROK_ASING di plugin/kamus/kamus.js. */
        if (BENTROK_ASING.indexOf(String(t).toLowerCase()) >= 0 && /^[A-Z]/.test(t)) {
          if (x.index === re.lastIndex) re.lastIndex++;
          continue;
        }
        /* K62 — nama kitab + pola rujukan ⇒ biarkan jadi TAUTAN AYAT. */
        if (NAMA_KITAB_KAMUS.indexOf(String(t).toLowerCase()) >= 0 &&
            diikutiRujukanAyat(teks, x.index + t.length)) {
          if (x.index === re.lastIndex) re.lastIndex++;
          continue;
        }
        const tumpang = hasil.some(h => x.index < h.akhir && (x.index + t.length) > h.mulai);
        if (!tumpang) {
          hasil.push({ mulai: x.index, akhir: x.index + t.length, tulisan: t,
                       entri: petaPribadi.get(t.toLowerCase()) });
        }
        if (x.index === re.lastIndex) re.lastIndex++;
      }
    }
    hasil.sort((a, b) => a.mulai - b.mulai || b.akhir - a.akhir);
    return hasil;
  }

  // tambah istilah pribadi (arti boleh KOSONG → masuk antrian ⏳)
  function tambahIstilahPribadi(nama, arti) {
    const n = String(nama || '').trim().replace(/\s+/g, ' ');
    if (!n) { pesan('⚠️ Tidak ada kata yang dipilih'); return null; }
    muatPribadi();
    let e = daftarPribadi.daftar.find(x =>
      String(x.nama).toLowerCase() === n.toLowerCase());
    if (e) {
      if (arti !== undefined && arti !== null) e.arti = arti;
    } else {
      e = { nama: n, alias: [], arti: (arti || ''), pribadi: true };
      daftarPribadi.daftar.push(e);
    }
    simpanPribadi();
    siapkanPetaPribadi();
    if (bisaTandai()) tandaiSemua();
    return e;
  }

  function hapusIstilahPribadi(nama) {
    muatPribadi();
    daftarPribadi.daftar = daftarPribadi.daftar.filter(x =>
      String(x.nama).toLowerCase() !== String(nama).toLowerCase());
    simpanPribadi();
    siapkanPetaPribadi();
    if (bisaTandai()) tandaiSemua();
  }

  const daftarAntrian = () => {
    muatPribadi();
    const belum = [], sudah = [];
    daftarPribadi.daftar.forEach(e => {
      if (String(e.arti || '').trim()) sudah.push(e); else belum.push(e);
    });
    return { belum, sudah };
  };

  // ============================================================
  // BUTIR c — PENANDAAN ISTILAH DI CATATAN
  //   Kursor TIDAK boleh lompat. Cara yang sudah terbukti (dipakai juga
  //   oleh plugin Alkitab):
  //     A. posisi kursor dihitung sebagai JUMLAH HURUF (offsetKursor)
  //     B. bangun ulang per text node (satu DocumentFragment → replaceChild sekali)
  //     C. LEWATI kata yang sedang memuat kursor
  //   ⚠️ Tanda plugin LAIN (span.ay-link dari Alkitab) dilewati, tidak dibongkar.
  // ============================================================
  function offsetKursor(el) {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return null;
    const r = sel.getRangeAt(0);
    if (!el.contains(r.startContainer)) return null;
    const hitung = document.createRange();
    hitung.selectNodeContents(el);
    try { hitung.setEnd(r.startContainer, r.startOffset); } catch (e) { return null; }
    return { offset: hitung.toString().length, collapsed: sel.isCollapsed };
  }

  function pasangKursor(el, simpan) {
    if (!simpan) return;
    const jalan = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let sisa = simpan.offset, n = jalan.nextNode();
    while (n) {
      const panjang = n.textContent.length;
      if (sisa <= panjang) {
        const r = document.createRange();
        r.setStart(n, sisa);
        r.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        return;
      }
      sisa -= panjang;
      n = jalan.nextNode();
    }
  }

  // buang HANYA tanda milik Kamus (tanda Alkitab dibiarkan)
  function bukaTanda(el) {
    const ada = el.querySelectorAll('span.' + KELAS);
    if (!ada.length) return 0;
    ada.forEach(sp => {
      sp.parentNode.replaceChild(document.createTextNode(sp.textContent), sp);
    });
    // ⚠️ normalize() boleh: semua node bertanda milik kita sudah dibuka.
    //    Node milik plugin lain masih berupa <span> sehingga tidak ikut tergabung.
    el.normalize();
    return ada.length;
  }

  // bangun potongan HTML berisi tautan istilah dari SATU teks
  function potongTeks(teks, batasKursor) {
    const ketemu = temukanIstilah(teks);
    if (!ketemu.length) return null;
    const kursorDi = (typeof batasKursor === 'number') ? batasKursor : -1;
    let pos = 0, hasil = '', ada = false;
    for (const k of ketemu) {
      if (k.mulai < pos) continue;
      // C: lewati HANYA kata yang sedang memuat kursor (bukan seluruh paragraf)
      if (kursorDi >= 0 && kursorDi >= k.mulai && kursorDi < k.akhir) continue;
      const nama = (k.entri && k.entri.nama) ? k.entri.nama : k.tulisan;
      hasil += esc(teks.slice(pos, k.mulai)) +
        '<span class="' + KELAS + '" contenteditable="false" data-istilah="' + esc(nama) +
        '" title="📚 ' + esc(nama) + ' — klik untuk melihat artinya">' +
        esc(k.tulisan) + '</span>';
      pos = k.akhir;
      ada = true;
    }
    hasil += esc(teks.slice(pos));
    return ada ? hasil : null;
  }

  // tandai seluruh istilah di satu wadah (editor catatan ATAU isi halaman baca)
  function tandaiWadah(wadah, simpanKursor) {
    const simpan = simpanKursor ? offsetKursor(wadah) : null;
    const dibongkar = bukaTanda(wadah);      // jumlah tanda lama yang dibuang

    const jalan = document.createTreeWalker(wadah, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.textContent || !n.textContent.trim()) return NodeFilter.FILTER_REJECT;
        const induk = n.parentNode;
        if (!induk) return NodeFilter.FILTER_REJECT;
        // lewati node yang sudah bertanda — tanda kita SENDIRI maupun
        // tanda plugin lain (mis. span.ay-link / .kamus-* milik halaman ini)
        let el = induk;
        while (el && el !== wadah) {
          if (el.classList && (
              el.classList.contains(KELAS) ||
              el.classList.contains('ay-link') ||
              el.classList.contains(KELAS_AYAT) ||
              el.classList.contains(KELAS_TERM) ||
              el.tagName === 'SCRIPT' || el.tagName === 'STYLE')) {
            return NodeFilter.FILTER_REJECT;
          }
          el = el.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const daftarNode = [];
    let n = jalan.nextNode();
    while (n) { daftarNode.push(n); n = jalan.nextNode(); }

    let jumlah = 0;
    daftarNode.forEach(node => {
      let batas = -1;
      if (simpan && simpan.collapsed) {
        const sel = window.getSelection();
        const titik = (sel && sel.rangeCount) ? sel.getRangeAt(0) : null;
        if (titik && titik.startContainer === node) batas = titik.startOffset;
      }
      const html = potongTeks(node.textContent, batas);
      if (!html) return;
      const tmp = document.createElement('span');
      tmp.innerHTML = html;
      const frag = document.createDocumentFragment();
      while (tmp.firstChild) frag.appendChild(tmp.firstChild);
      try { node.parentNode.replaceChild(frag, node); } catch (e) { return; }
      jumlah++;
    });

    // ⚠️ Kursor WAJIB dipulihkan kalau DOM berubah — bukan hanya kalau ada
    //    istilah baru. Kalau tidak, begini jadinya (cacat nyata 18 Sep 2026):
    //    user mengetik di tengah kata istilah → kata itu tidak lagi cocok →
    //    tanda lamanya DIBONGKAR (span hilang) → node tempat kursor berada
    //    ikut hilang → kursor MELOMPAT ke awal baris.
    if (simpan && (jumlah || dibongkar)) pasangKursor(wadah, simpan);
    return jumlah;
  }

  // tandai istilah di CATATAN
  function tandaiSemua() {
    const el = editorEl();
    if (!bisaTandai(el)) { bersihkanTanda(); return 0; }
    if (!el) return 0;
    // jangan sentuh kalau editor sedang di mode baca (“📖 Rapi”) —
    // isinya hasil olahan, bukan isi asli.
    if (el.isContentEditable === false || el.classList.contains('mode-baca')) return 0;
    const jml = tandaiWadah(el, true);
    gambarPanel();
    return jml;
  }

  function bersihkanTanda() {
    const el = editorEl();
    if (el) bukaTanda(el);
    const baca = document.getElementById('baca-isi');
    if (baca) bukaTanda(baca);
    // K52 — halaman penguat juga dibersihkan (tanda milik Kamus saja)
    const pg = document.getElementById('pg-isi');
    if (pg) bukaTanda(pg);
    // K56 — halaman baca-saja lain (Sejarah Alkitab) juga
    const sj = document.getElementById('sj-isi');
    if (sj) bukaTanda(sj);
  }

  // ============================================================
  // klik istilah di CATATAN → ingat tempat → buka halaman kamus
  // ============================================================
  function ingatAsal(elemenLink) {
    // K52 — boleh dipanggil dengan `null` (artinya: BUKAN dari catatan).
    //   ⚠️ Dulu `ingatAsal(null)` bikin `TypeError` (cacat nyata 21 Sep 2026,
    //      ketemu saat menguji klik “Taurat” di halaman baca).
    if (!elemenLink) { asal = null; return; }
    const el = editorEl();
    if (!el) return;
    const semua = [...el.querySelectorAll('span.' + KELAS)];
    // cari lewat NOMOR URUT lebih dulu, baru teks — supaya kalau ada dua
    // kata bertulis sama, sorot tidak salah tempat.
    asal = {
      index: semua.indexOf(elemenLink),
      teks: (elemenLink.textContent || '').trim(),
      gulir: el.scrollTop
    };
  }

  function kembaliKeCatatan() {
    // K52 — kalau istilah ini dibuka dari HALAMAN LAIN (baca Alkitab / penguat),
    //   tombol 🏠 membawa kembali KE HALAMAN ITU + sorot kuning kata tadi.
    if (asalHalaman) { kembaliKeHalamanAsal(); return; }
    tutupHalaman();
    const el = editorEl();
    if (!el) { asal = null; return; }
    const semua = [...el.querySelectorAll('span.' + KELAS)];
    let sasaran = null;
    if (asal) {
      if (asal.index >= 0 && semua[asal.index]) sasaran = semua[asal.index];
      if (!sasaran) sasaran = semua.find(x => (x.textContent || '').trim() === asal.teks) || null;
    }
    if (sasaran) {
      sasaran.scrollIntoView({ behavior: 'auto', block: 'center' });
      semua.forEach(x => x.classList.remove(KELAS_SOROT));
      sasaran.classList.add(KELAS_SOROT);
      clearTimeout(window.__kamusSorot);
      window.__kamusSorot = setTimeout(() => sasaran.classList.remove(KELAS_SOROT), 4000);
    } else if (asal && asal.gulir) {
      el.scrollTop = asal.gulir;
    }
    asal = null;
  }

  // ============================================================
  // K52 — KEMBALI KE HALAMAN ASAL (baca Alkitab / penguat)
  //   Pola SAMA dengan kembaliKeCatatan(): cari lewat NOMOR URUT dulu,
  //   baru teks (kalau ada 2 kata bertulis sama) → sorot kuning ±4 detik.
  // ============================================================
  function ingatAsalHalaman(elemenSpan, jenis) {
    const idWadah = jenis === 'penguat' ? 'pg-isi'
                  : (jenis === 'sejarah' ? 'sj-isi' : 'baca-isi');
    const wadah = document.getElementById(idWadah);
    if (!wadah) { asalHalaman = null; return; }
    // ⚠️ Tanpa span (mis. diklik dari chip “Istilah di pasal ini”) → cukup
    //    ingat HALAMANNYA + posisi gulir; tidak ada kata yang bisa disorot.
    if (!elemenSpan) {
      asalHalaman = { jenis: jenis, tanpaKata: true, gulir: wadah.scrollTop };
      return;
    }
    const baris = elemenSpan.closest(jenis === 'penguat' ? '.pg-ayat'
                                    : (jenis === 'sejarah' ? '.ay-sejarah-teks' : '.ayat-baca'));
    const noEl = baris ? baris.querySelector(jenis === 'penguat' ? '.pg-nomor'
                          : (jenis === 'sejarah' ? null : '.no')) : null;
    const A = window.ANodesAlkitabTampilan;
    const p = (A && A.posisi) ? A.posisi : null;
    asalHalaman = {
      jenis: jenis,
      no: p ? p.kitab : null,
      pasal: p ? p.pasal : null,
      ayat: noEl ? Number(noEl.textContent) : null,
      index: [...wadah.querySelectorAll('span.' + KELAS)].indexOf(elemenSpan),
      teks: (elemenSpan.textContent || '').trim(),
      gulir: wadah.scrollTop
    };
  }

  function kembaliKeHalamanAsal() {
    const a = asalHalaman;
    asalHalaman = null;                 // sebelum tutupHalaman (dia membersihkan penanda)
    if (!a) { tutupHalaman(); return; }
    tutupHalaman(a.jenis);
    const idWadah = a.jenis === 'penguat' ? 'pg-isi'
                  : (a.jenis === 'sejarah' ? 'sj-isi' : 'baca-isi');
    const wadah = document.getElementById(idWadah);
    if (!wadah) return;
    const semua = [...wadah.querySelectorAll('span.' + KELAS)];
    let sasaran = null;
    if (!a.tanpaKata) {
      if (a.index >= 0 && semua[a.index]) sasaran = semua[a.index];
      if (!sasaran) sasaran = semua.find(x => (x.textContent || '').trim() === a.teks) || null;
    }
    if (sasaran) {
      sasaran.scrollIntoView({ behavior: 'auto', block: 'center' });
      semua.forEach(x => x.classList.remove(KELAS_SOROT));
      sasaran.classList.add(KELAS_SOROT);
      clearTimeout(window.__kamusSorot);
      window.__kamusSorot = setTimeout(() => sasaran.classList.remove(KELAS_SOROT), 4000);
    } else if (a.gulir) {
      wadah.scrollTop = a.gulir;
    }
  }

  // label tombol besar di bawah halaman istilah — menyesuaikan halaman asalnya
  function segarkanTombolKembaliKamus() {
    const b = document.querySelector('.kamus-kembali-besar');
    if (!b) return;
    const j = asalHalaman ? asalHalaman.jenis : null;
    if (j === 'penguat') {
      b.textContent = '🏠 kembali ke penguat';
      b.title = 'Kembali ke halaman penguat — tepat di kata yang tadi diklik';
    } else if (j === 'baca') {
      b.textContent = '🏠 kembali ke bacaan';
      b.title = 'Kembali ke halaman baca Alkitab — tepat di kata yang tadi diklik';
    } else {
      b.textContent = '🏠 kembali ke catatan';
      b.title = 'Kembali ke catatan — tepat di kata yang tadi diklik';
    }
  }

  // ============================================================
  // HALAMAN (butir b & d)
  // ============================================================
  function sembunyikanLain() {
    document.querySelectorAll('body > .app').forEach(a => {
      if (a !== halaman()) a.hidden = true;
    });
  }

  function bukaHalaman() {
    const hal = halaman();
    if (!hal) { pesan('⚠️ Halaman kamus belum ada di index.html'); return false; }
    sembunyikanLain();
    hal.hidden = false;
    hal.scrollTop = 0;
    return true;
  }

  // K52 — tutup halaman kamus, lalu TAMPILKAN halaman asalnya.
  //   `kembaliKe` : 'baca' | 'penguat' | 'sejarah' | null(kosong ⇒ catatan)
  //   ⚠️ Wajib: `bukaHalaman()` menyembunyikan SEMUA `body > .app`, jadi halaman
  //      baca/penguat/sejarah ikut tersembunyi — harus dimunculkan lagi di sini.
  function tutupHalaman(kembaliKe) {
    const hal = halaman();
    if (hal) { hal.hidden = true; }
    if (kembaliKe === 'baca') {
      const b = document.getElementById('baca-alkitab');
      if (b) b.hidden = false;
    } else if (kembaliKe === 'penguat') {
      const p = document.getElementById('penguat-halaman');
      if (p) p.hidden = false;
    } else if (kembaliKe === 'sejarah') {
      // K56 (23 Sep 2026) — istilah diklik dari HALAMAN SEJARAH ALKITAB
      const s = document.getElementById('sejarah-halaman');
      if (s) s.hidden = false;
    } else {
      const utama = document.getElementById('app-utama');
      if (utama) utama.hidden = false;
    }
    asalKamus = null;                    // K43 b: titik aman — jangan tinggalkan penanda
    segarkanTombolKembaliBaca();
  }

  function aturJudul(t) {
    const j = document.getElementById('kamus-judul');
    if (j) j.textContent = t;
  }

  function tampilCari(tampil) {
    const b = document.getElementById('kamus-cari-baris');
    if (b) b.hidden = !tampil;
  }

  function segarkanTombolBack() {
    const b = document.getElementById('kamus-back');
    if (b) b.disabled = riwayatIstilah.length === 0;
  }

  // ============================================================
  // BUTIR b — halaman 📚 Daftar Istilah + kotak cari
  // ============================================================
  function bukaDaftar() {
    if (!adaData()) {
      pesan('⏳ Menyiapkan kamus istilah…');
      const m = mesin();
      if (m && m.saatSiap) m.saatSiap(() => bukaDaftar());
      return;
    }
    modeDaftar = true;
    istilahKini = null;
    aturJudul('📚 Daftar Istilah');
    if (!bukaHalaman()) return;
    tampilCari(true);
    const inp = document.getElementById('kamus-cari');
    if (inp) inp.value = '';
    gambarDaftar('');
    segarkanTombolBack();
    const i = document.getElementById('kamus-cari');
    if (i) setTimeout(() => { try { i.focus(); } catch (e) {} }, 80);
  }

  function gambarDaftar(kata) {
    const kotak = isiHal();
    if (!kotak) return;
    kotak.innerHTML = '';
    kotak.scrollTop = 0;

    const arr = cariIstilah(kata);
    const antrian = daftarAntrian();

    // --- ringkasan + antrian istilah belum berarti (butir g) ---
    const info = document.createElement('div');
    info.className = 'kamus-daftar-info';
    let baris = kata
      ? 'Ditemukan <b>' + arr.length + '</b> istilah untuk “' + esc(kata) + '”'
      : '<b>' + arr.length + '</b> istilah siap dibaca';
    if (antrian.belum.length || antrian.sudah.length) {
      baris += ' · antrian: <b>' + antrian.belum.length + '</b> belum berarti · ' +
               '<b>' + antrian.sudah.length + '</b> sudah berarti';
    }
    info.innerHTML = baris;

    if (antrian.belum.length) {
      const tombolSalin = document.createElement('button');
      tombolSalin.className = 'kamus-salin';
      tombolSalin.textContent = '📋 Salin daftar belum berarti (' + antrian.belum.length + ')';
      tombolSalin.title = 'Menyalin daftar istilah yang belum berarti — tempel ke chat AI untuk dibuatkan draf artinya';
      tombolSalin.addEventListener('click', () => {
        const teks = antrian.belum.map(e => e.nama).join('\n');
        salinTeks(teks);
      });
      info.appendChild(document.createElement('br'));
      info.appendChild(tombolSalin);
    }
    kotak.appendChild(info);

    if (!arr.length) {
      const kosong = document.createElement('div');
      kosong.className = 'kamus-kosong';
      kosong.textContent = 'Tidak ada istilah yang cocok dengan “' + kata + '”.';
      kotak.appendChild(kosong);
      return;
    }

    const daftar = document.createElement('div');
    daftar.className = 'kamus-daftar';
    arr.forEach(e => {
      const barisEl = document.createElement('div');
      barisEl.className = 'kamus-daftar-baris' + (e.pribadi ? ' pribadi' : '');
      const nama = document.createElement('span');
      nama.className = 'kdb-nama';
      nama.textContent = e.nama;
      const cuplik = document.createElement('span');
      cuplik.className = 'kdb-cuplik';
      const arti = String(e.arti || '').trim();
      cuplik.textContent = arti ? arti.slice(0, 70) + (arti.length > 70 ? '…' : '') : '⏳ belum ada keterangan';
      barisEl.appendChild(nama);
      barisEl.appendChild(cuplik);
      barisEl.addEventListener('click', () => bukaIstilah(e.nama));
      daftar.appendChild(barisEl);
    });
    kotak.appendChild(daftar);

    const catatanKaki = document.createElement('div');
    catatanKaki.className = 'kamus-catatan-kaki';
    catatanKaki.textContent = 'Klik satu istilah untuk membaca keterangannya.';
    kotak.appendChild(catatanKaki);
  }

  function salinTeks(teks) {
    const pakai = (t) => {
      const ta = document.createElement('textarea');
      ta.value = t;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      let bisa = false;
      try { bisa = document.execCommand('copy'); } catch (e) {}
      ta.remove();
      pesan(bisa ? '📋 Daftar disalin — tempel di chat AI untuk dibuatkan draf arti'
                 : '⚠️ Gagal menyalin', 3200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(teks).then(() => pakai(teks), () => pakai(teks));
    } else pakai(teks);
  }

  // ============================================================
  // BUTIR d — HALAMAN ARTI (kata + keterangan) + kolom ayat + berantai
  // ============================================================
  function bukaIstilah(nama, opsi) {
    // ⚠️ halaman dibuka BIASA lagi → penanda “dari Alkitab” dibuang, supaya
    //    label tombol kembali di halaman baca tidak tertinggal jadi 📚.
    asalKamus = null;
    segarkanTombolKembaliBaca();
    // K52 — dari mana halaman ini dibuka? (catatan / baca Alkitab / penguat)
    //   Kalau BUKAN dari halaman lain ⇒ penanda lama DIBUANG (titik aman).
    if (opsi && opsi.dariHalaman) {
      ingatAsalHalaman(opsi.dariHalaman.span, opsi.dariHalaman.jenis);
    } else if (!(opsi && opsi.pertahankanAsal)) {
      asalHalaman = null;
    }
    const e = entriUntukHalaman(nama);
    if (!e) { pesan('⚠️ Istilah “' + nama + '” tidak ditemukan'); return; }
    if (!(opsi && opsi.mundur)) {
      if (istilahKini && String(istilahKini).toLowerCase() !== String(e.nama).toLowerCase()) {
        riwayatIstilah.push(istilahKini);
        if (riwayatIstilah.length > 30) riwayatIstilah.shift();
      }
    }
    istilahKini = e.nama;
    modeDaftar = false;
    aturJudul('📚 ' + e.nama);
    if (!bukaHalaman()) return;
    tampilCari(false);
    gambarArti(e);
    segarkanTombolBack();
  }

  // ============================================================
  // K43 b — TOMBOL [full] → lompat ke halaman baca ALKITAB
  //   ⚠️ Setelah lompat, tombol kembali di Alkitab menjadi 📚 dan
  //      membawa Bapak BALIK ke istilah ini (ayatnya tetap tampil).
  //   ❌ Tidak ada mesin baru: memakai bukaAyatDariLink() yang sudah ada (K20/K25).
  // ============================================================
  function bukaFull(ref, namaIstilah) {
    const A = window.ANodesAlkitab;
    const T = window.ANodesAlkitabTampilan;
    if (!A || !A.siap || !A.siap()) {
      pesan('⏳ Menyiapkan data Alkitab…');
      if (A && A.ketikaSiap) A.ketikaSiap(() => bukaFull(ref, namaIstilah));
      return false;
    }
    if (!T || typeof T.bukaAyatDariLink !== 'function') {
      pesan('💡 Pasang plugin 📖 Alkitab dahulu');
      return false;
    }
    // label ayat untuk ditampilkan lagi saat kembali
    const label = ref.singkatan + ' ' + ref.pasal +
      (ref.ayat1 ? ':' + ref.ayat1 + (ref.ayat2 !== ref.ayat1 ? '-' + ref.ayat2 : '') : '');
    asalKamus = {
      nama: namaIstilah || istilahKini,
      ref: ref,
      label: label
    };
    // halaman kamus disembunyikan; Alkitab yang menampilkan halaman bacanya
    const hal = halaman();
    if (hal) hal.hidden = true;
    try {
      T.bukaAyatDariLink(ref, null, 0);
    } catch (e) {
      console.warn('ANodes Kamus: gagal membuka Alkitab', e);
      if (hal) hal.hidden = false;
      asalKamus = null;
      return false;
    }
    segarkanTombolKembaliBaca();
    return true;
  }

  // apakah sedang “dipinjamkan” ke Alkitab? (dipakai plugin Alkitab)
  function dariKamus() { return !!asalKamus; }

  // sesudah halaman baca menampilkan ayat, ubah label tombol kembali jadi 📚
  function segarkanTombolKembaliBaca() {
    const b = document.getElementById('baca-kembali');
    if (!b) return;
    if (asalKamus) {
      b.textContent = '📚';
      b.title = 'Kembali ke kamus istilah “' + asalKamus.nama + '”';
    } else {
      b.textContent = '🏠';
      b.title = 'Kembali ke catatan (di tempat tadi diklik)';
    }
  }

  // dipanggil plugin Alkitab saat tombol kembali ditekan SESUDAH [full]
  function pulihDariAlkitab() {
    const kembali = asalKamus;
    asalKamus = null;
    const baca = document.getElementById('baca-alkitab');
    if (baca) baca.hidden = true;
    if (!kembali) return false;
    // buka lagi halaman kamus pada istilah yang sama (riwayat tidak ditambah)
    bukaIstilah(kembali.nama, { mundur: true, pertahankanAsal: true });
    // tampilkan lagi ayat yang tadi dibuka [full]
    const kolom = document.getElementById('kamus-ayat-kolom');
    if (kolom && kembali.ref) {
      const chip = [...(isiHal() || document).querySelectorAll('.kamus-ay-chip')]
        .find(c => {
          let r = null;
          try { r = JSON.parse(c.dataset.ref || 'null'); } catch (e) {}
          return r && kembali.ref &&
                 r.no === kembali.ref.no && r.pasal === kembali.ref.pasal &&
                 r.ayat1 === kembali.ref.ayat1 && r.ayat2 === kembali.ref.ayat2;
        });
      tampilAyat(kembali.ref, chip || null);
    }
    segarkanTombolKembaliBaca();
    pesanKembali('📚 Kembali ke kamus — “' + (kembali.nama || '') + '”', false);
    return true;
  }

  function pesanKembali(t, pakaiToast) {
    if (pakaiToast) { pesan(t); return; }
    // tanda kecil di halaman kamus (tidak menutupi apa pun)
    const hal = halaman();
    if (!hal) return;
    let tanda = document.getElementById('kamus-tanda-kembali');
    if (!tanda) {
      tanda = document.createElement('div');
      tanda.id = 'kamus-tanda-kembali';
      tanda.className = 'kamus-tanda-kembali';
      hal.appendChild(tanda);
    }
    tanda.textContent = t;
    tanda.classList.add('tampil');
    clearTimeout(window.__kamusTanda);
    window.__kamusTanda = setTimeout(() => tanda.classList.remove('tampil'), 2600);
  }

  function kembaliIstilah() {
    if (!riwayatIstilah.length) return;
    const sebelum = riwayatIstilah.pop();
    // K52 — riwayat istilah TIDAK menghilangkan halaman asal; kalau dibuka
    //   dari baca Alkitab / penguat, 🏠 tetap membawa kembali ke sana.
    bukaIstilah(sebelum, { mundur: true, pertahankanAsal: true });
  }

  // ---- pecah rujukan ayat dari arti (termasuk bentuk koma-lanjutan) ----
  //   "Kel 21:29, 30"  → 2 rujukan: Kel 21:29 dan Kel 21:30
  //   "Kel 21:29; Im 1:2" → 2 rujukan (titik-koma pemisah)
  const RE_REF = /([1-3]?\s?[A-Za-zÀ-ÿ]+)\.?\s+(\d{1,3})\s*[:.]\s*(\d{1,3})((?:\s*[-–—]\s*\d{1,3})?(?:\s*,\s*\d{1,3}(?:\s*[-–—]\s*\d{1,3})?)*)/g;

  function cariRujukan(arti) {
    const A = window.ANodesAlkitab;
    if (!A || !A.kenaliAyat || !A.siap || !A.siap()) return [];
    const hasil = [];
    let m;
    RE_REF.lastIndex = 0;
    while ((m = RE_REF.exec(arti)) !== null) {
      const kitab = m[1].trim();
      const pasal = m[2];
      const bagian = m[0].split(',');
      let pos = m.index;
      let refDasar = null;
      bagian.forEach((b, i) => {
        const isi = b.trim();
        const awalIsi = pos + (b.length - b.trimStart().length);
        let ref = null;
        if (i === 0) {
          ref = A.kenaliAyat(isi);
          if (ref) refDasar = { kitab, pasal };
        } else if (/^\d/.test(isi) && refDasar) {
          ref = A.kenaliAyat(refDasar.kitab + ' ' + refDasar.pasal + ':' + isi);
        }
        if (ref && isi) {
          hasil.push({ mulai: awalIsi, akhir: awalIsi + isi.length, teks: isi, ref });
        }
        pos += b.length + 1;   // +1 = tanda koma pemisah
      });
    }
    return hasil;
  }

  // ---- olah arti jadi HTML: rujukan ayat & istilah lain jadi TAUTAN ----
  function richArti(arti, kecuali) {
    const tandai = cariRujukan(arti);
    const ist = temukanIstilah(arti) || [];
    const kunciKecuali = String(kecuali || '').toLowerCase();
    for (const k of ist) {
      const nama = k.entri && k.entri.nama;
      // istilah itu SENDIRI tidak ditandai di artinya sendiri (redundan) —
      // sama seperti lab3 richArti(arti, kecualiTerm)
      if (nama && String(nama).toLowerCase() === kunciKecuali) continue;
      if (tandai.some(a => k.mulai < a.akhir && k.akhir > a.mulai)) continue;
      tandai.push({ mulai: k.mulai, akhir: k.akhir, term: nama || k.tulisan });
    }
    tandai.sort((a, b) => a.mulai - b.mulai || b.akhir - a.akhir);

    let pos = 0, html = '';
    for (const t of tandai) {
      if (t.mulai < pos) continue;
      html += esc(arti.slice(pos, t.mulai));
      const isi = esc(arti.slice(t.mulai, t.akhir));
      if (t.ref) {
        html += '<span class="' + KELAS_AYAT + '" data-ref="' + esc(JSON.stringify(t.ref)) +
                '" title="Klik: ayat ini tampil di kolom ayat">' + isi + '</span>';
      } else {
        html += '<span class="' + KELAS_TERM + '" data-istilah="' + esc(t.term) +
                '" title="📚 ' + esc(t.term) + ' — klik: keterangannya tampil di kolom istilah">' + isi + '</span>';
      }
      pos = t.akhir;
    }
    html += esc(arti.slice(pos));
    return html;
  }

  function gambarArti(e) {
    const kotak = isiHal();
    if (!kotak) return;
    kotak.innerHTML = '';
    kotak.scrollTop = 0;

    // ---------- 1️⃣ KATA + KETERANGAN ----------
    const nama = document.createElement('div');
    nama.className = 'kamus-nama';
    nama.textContent = e.nama;
    kotak.appendChild(nama);

    const artiTeks = String(e.arti || '').trim() || '(belum ada keterangan)';
    const arti = document.createElement('div');
    arti.className = 'kamus-arti';
    arti.innerHTML = richArti(artiTeks, e.nama);
    kotak.appendChild(arti);

    // ---------- 2️⃣ ISTILAH LAIN DI DALAM ARTI ----------
    const lain = [];
    const sudah = new Set();
    (temukanIstilah(artiTeks) || []).forEach(k => {
      const n = (k.entri && k.entri.nama) ? k.entri.nama : k.tulisan;
      const kunci = String(n).toLowerCase();
      if (kunci === String(e.nama).toLowerCase()) return;
      if (sudah.has(kunci)) return;
      sudah.add(kunci);
      lain.push(n);
    });
    if (lain.length) {
      const blok = document.createElement('div');
      blok.className = 'kamus-bagian';
      const jud = document.createElement('div');
      jud.className = 'kamus-bagian-judul';
      jud.textContent = '📚 istilah lain di keterangan (klik: tampil di kolom bawah)';
      blok.appendChild(jud);
      const chips = document.createElement('div');
      chips.className = 'kamus-chip-baris';
      lain.forEach(n => {
        const c = document.createElement('span');
        c.className = 'kamus-chip kamus-chip-ist';
        c.textContent = n;
        c.dataset.istilah = n;
        c.title = '📚 ' + n + ' — klik: keterangannya tampil di kolom di bawah';
        chips.appendChild(c);
      });
      blok.appendChild(chips);

      // K51 — TUNAS KOLOM ISTILAH (level 1..n).
      //   ⚠️ KETENTUAN BAPAK (21 Sep 2026) — ini yang benar:
      //     • tiap klik istilah = KOLOM BARU DI BAWAH (menumpuk ke bawah)
      //     • hanya level YANG SAMA yang ditimpa
      //     • level 0 = head (“Kudus; Suci”) · level 1 = [Ibrani] · level 2 = [Yakub] · dst.
      //   ⇒ pola SAMA dengan 🌿 Ayat Terkait (kebawah terus).
      const tunas = document.createElement('div');
      tunas.className = 'kamus-istilah-tunas';
      tunas.id = 'kamus-istilah-tunas';
      blok.appendChild(tunas);

      kotak.appendChild(blok);
    }

    // ---------- 3️⃣ 📖 AYATNYA — kolom ayat (SATU kolom, ganti-ganti) ----------
    const refs = cariRujukan(artiTeks);
    const unik = [];
    const sudahR = new Set();
    refs.forEach(r => {
      const k = r.ref.no + '.' + r.ref.pasal + '.' + r.ref.ayat1 + '.' + r.ref.ayat2;
      if (sudahR.has(k)) return;
      sudahR.add(k);
      unik.push(r.ref);
    });

    const blokAyat = document.createElement('div');
    blokAyat.className = 'kamus-bagian';
    const judAyat = document.createElement('div');
    judAyat.className = 'kamus-bagian-judul';
    judAyat.textContent = '📖 AYATNYA (' + unik.length + ')';
    blokAyat.appendChild(judAyat);

    if (!unik.length) {
      const k = document.createElement('div');
      k.className = 'kamus-hint';
      k.textContent = 'Istilah ini tidak memuat rujukan ayat.';
      blokAyat.appendChild(k);
    } else {
      const chips = document.createElement('div');
      chips.className = 'kamus-chip-baris';
      unik.forEach(ref => {
        // satu bungkus: chip ayat + tombol [full] (K43 b)
        const bungkus = document.createElement('span');
        bungkus.className = 'kamus-ay-bungkus';
        const labelAyat = ref.singkatan + ' ' + ref.pasal +
          (ref.ayat1 ? ':' + ref.ayat1 + (ref.ayat2 !== ref.ayat1 ? '-' + ref.ayat2 : '') : '');
        const c = document.createElement('span');
        c.className = 'kamus-chip kamus-ay-chip';
        c.textContent = labelAyat;
        c.dataset.ref = JSON.stringify(ref);
        c.title = 'Klik: teks ayat tampil di kolom di bawah';
        const bf = document.createElement('span');
        bf.className = 'kamus-full';
        bf.textContent = 'full';
        bf.dataset.ref = JSON.stringify(ref);
        bf.title = 'Buka ayat ini di halaman baca Alkitab — bisa kembali ke kamus lagi';
        bungkus.appendChild(c);
        bungkus.appendChild(bf);
        chips.appendChild(bungkus);
      });
      blokAyat.appendChild(chips);

      const kolom = document.createElement('div');
      kolom.className = 'kamus-ayat-kolom';
      kolom.id = 'kamus-ayat-kolom';
      const hint = document.createElement('div');
      hint.className = 'kamus-hint';
      hint.textContent = 'Klik satu ayat di atas — teksnya tampil di sini (kolom ini berganti isi, tidak menumpuk).';
      kolom.appendChild(hint);
      blokAyat.appendChild(kolom);
    }
    kotak.appendChild(blokAyat);

    // ---------- 3️⃣b K51 c+d — bilah [ + Istilah ] (kirim ke catatan) ----------
    //   Pola SAMA dengan 🌿 Ayat Terkait [ + Ayat ] (jalur K40).
    //   Rantai & blok dikosongkan saat istilah berganti (titik aman).
    rantaiIstilah = [];
    const wadahLama = document.getElementById('kamus-blok-wadah');
    if (wadahLama) wadahLama.remove();
    pasangBilahKirim(kotak);

    // ---------- 4️⃣ CATATAN PENGGUNA (K43 a) — tepat di ATAS tombol kembali ----------
    //   ⚠️ TERPISAH dari keterangan kamus: keterangan kamus tetap utuh di atas,
    //      kolom ini hanya MENAMBAH. Dipakai kalau keterangan kamus kurang lengkap.
    const blokCatatan = document.createElement('div');
    blokCatatan.className = 'kamus-bagian kamus-catatan-bapak';
    const judCat = document.createElement('div');
    judCat.className = 'kamus-bagian-judul';
    judCat.textContent = '📝 catatan pengguna (terpisah dari keterangan kamus)';
    blokCatatan.appendChild(judCat);

    const ta = document.createElement('textarea');
    ta.className = 'kamus-catatan-isi';
    ta.id = 'kamus-catatan-isi';
    ta.rows = 3;
    ta.placeholder = 'kalau keterangan di atas terasa kurang lengkap, tuliskan tambahan Anda di sini…';
    ta.title = 'Keterangan tambahan dari pengguna — tersimpan tersendiri, keterangan kamus di atas tidak berubah';
    ta.value = String(e.catatan || '');
    blokCatatan.appendChild(ta);

    const barisCat = document.createElement('div');
    barisCat.className = 'kamus-catatan-baris';
    const bSimpanCat = document.createElement('button');
    bSimpanCat.className = 'kamus-catatan-simpan';
    bSimpanCat.textContent = '💾 Simpan catatan';
    bSimpanCat.title = 'Simpan keterangan tambahan ini untuk istilah ini';
    bSimpanCat.addEventListener('click', () => {
      simpanCatatanBapak(istilahKini || e.nama, ta.value);
      pesan('💾 Catatan pengguna tersimpan untuk “' + (istilahKini || e.nama) + '”', 2600);
    });
    const bHapusCat = document.createElement('button');
    bHapusCat.className = 'kamus-catatan-hapus';
    bHapusCat.textContent = '🗑 Kosongkan';
    bHapusCat.title = 'Kosongkan catatan pengguna untuk istilah ini (keterangan kamus tidak tersentuh)';
    bHapusCat.addEventListener('click', () => {
      if (!ta.value.trim()) { pesan('Catatan sudah kosong'); return; }
      ta.value = '';
      simpanCatatanBapak(istilahKini || e.nama, '');
      pesan('🗑 Catatan pengguna dikosongkan', 2200);
    });
    barisCat.appendChild(bSimpanCat);
    barisCat.appendChild(bHapusCat);
    blokCatatan.appendChild(barisCat);

    const hintCat = document.createElement('div');
    hintCat.className = 'kamus-hint';
    hintCat.textContent = 'Isian ini disimpan di perangkat ini saja. ' +
      'Keterangan kamus di atas TIDAK ikut berubah.';
    blokCatatan.appendChild(hintCat);

    kotak.appendChild(blokCatatan);

    // ---------- 5️⃣ kembali ke halaman asal ----------
    //   K52: label menyesuaikan — “kembali ke catatan / bacaan / penguat”.
    const tombol = document.createElement('button');
    tombol.className = 'kamus-kembali-besar';
    tombol.addEventListener('click', kembaliKeCatatan);
    kotak.appendChild(tombol);
    segarkanTombolKembaliKamus();
  }

  // tampilkan teks ayat DI KOLOM YANG SAMA (bukan menambah kolom baru)
  function tampilAyat(ref, chipAktif) {
    const kolom = document.getElementById('kamus-ayat-kolom');
    if (!kolom) return;
    const A = window.ANodesAlkitab;
    if (!A || !A.siap || !A.siap()) {
      pesan('⏳ Menyiapkan data Alkitab…');
      if (A && A.ketikaSiap) A.ketikaSiap(() => tampilAyat(ref, chipAktif));
      return;
    }
    const arr = A.ambilAyatBanyak([ref]) || [];
    kolom.innerHTML = '';
    if (!arr.length) {
      kolom.textContent = '⚠️ Ayat tidak terbaca.';
      return;
    }
    const d = arr[0];
    const judul = document.createElement('div');
    judul.className = 'kamus-ayat-judul';
    judul.textContent = '📖 ' + d.label;
    kolom.appendChild(judul);
    (d.ayat || []).forEach(a => {
      const p = document.createElement('p');
      p.className = 'kamus-ayat-teks' + (a.merah ? ' merah' : '');
      p.innerHTML = '<span class="kamus-ayat-no">' + a.no + '</span> ' + esc(a.teks);
      kolom.appendChild(p);
    });
    const semuaChip = (isiHal() || document).querySelectorAll('.kamus-ay-chip');
    semuaChip.forEach(c => c.classList.remove('aktif'));
    if (chipAktif) chipAktif.classList.add('aktif');
  }

  // ============================================================
  // K51 — LEVEL KOLOM ISTILAH (menumpuk ke bawah, per level)
  //
  //   ⚠️ KETENTUAN BAPAK 21 Sep 2026 (revisi atas versi “timpa”) — INI YANG BENAR:
  //     “jadi ada 2 kata istilah dengan level 0=head level 1-> ibrani Level2= yakub
  //      perlevel per kolom · sama dengan ayat · **jadi ditimpa pada level yg sama**”
  //
  //     • tiap klik istilah ⇒ **KOLOM BARU DI BAWAHNYA** (menumpuk ke bawah)
  //     • **hanya level yang SAMA** yang ditimpa
  //     • pola SAMA dengan 🌿 Ayat Terkait (“kebawah terus”)
  //
  //   Contoh (kasus “penulis; Ahli Taurat”):
  //     level 0 = head “Penulis; Ahli Taurat”
  //     klik [Ibrani]  ⇒ level 1 → kolom Ibrani
  //     klik [Yakub]   ⇒ level 2 → kolom Yakub (DI BAWAH kolom Ibrani, ❌ bukan menimpanya)
  //     klik [Aram]    ⇒ level 2 lagi → kolom Aram MENIMPA kolom Yakub (level sama)
  //
  //   ℹ️ Kolom AYAT tetap TERPISAH (kolom no.1) — chip ayat di sini membuka kolom ayat.
  // ============================================================
  const KUNCI_LEVEL = 'kamusLevel';   // disimpan di elemen kolom (dataset)

  // buang semua kolom istilah pada level >= n (level n sendiri akan diganti/baru)
  function buangKolomDari(tunas, level) {
    if (!tunas) return;
    [...tunas.children].forEach(k => {
      const lv = parseInt(k.dataset[KUNCI_LEVEL] || '0', 10);
      if (lv >= level) k.remove();
    });
  }

  // buat SATU kolom keterangan untuk satu istilah (isi kolomnya)
  function buatKolomIstilah(nama, level) {
    const e = entriUntukHalaman(nama);
    const kolom = document.createElement('div');
    kolom.className = 'kamus-istilah-kolom';
    if (!e) {
      const k = document.createElement('div');
      k.className = 'kamus-hint';
      k.textContent = '⚠️ Istilah “' + nama + '” tidak ditemukan.';
      kolom.appendChild(k);
      return kolom;
    }

    // ── kepala kolom: judul istilah + BADGE tingkat ──
    //   🔴 KETENTUAN BAPAK: kolom tetap SELEBAR LAYAR (❌ jangan dikecilkan) —
    //      tingkat ditandai badge saja (“Tingkat 2”), bukan margin.
    const kepala = document.createElement('div');
    kepala.className = 'kamus-istilah-kepala';
    const judul = document.createElement('span');
    judul.className = 'kamus-istilah-judul';
    judul.textContent = '📚 ' + e.nama;
    kepala.appendChild(judul);

    const lvKolom = (typeof level === 'number' && level > 0) ? level : 1;
    const badge = document.createElement('span');
    badge.className = 'kamus-level-tanda';
    badge.textContent = 'Tingkat ' + lvKolom;
    badge.title = 'Tingkat ' + lvKolom + ' — tiap istilah yang diklik membuka tingkat berikutnya';
    kepala.appendChild(badge);

    // K51 c — tombol `✓ pilih`: simpan keterangan ini jadi BLOK TETAP
    //   (pola SAMA dengan 🌿 Ayat Terkait)
    const bPilih = document.createElement('button');
    bPilih.type = 'button';
    bPilih.className = 'kamus-pilih';
    bPilih.textContent = '✓ pilih';
    bPilih.title = 'Simpan keterangan ini sebagai blok tetap (bisa dikirim ke catatan)';
    bPilih.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      pilihKolom(kolom);
    });
    kepala.appendChild(bPilih);

    kolom.dataset.kamusNama = e.nama;
    kolom.appendChild(kepala);

    // ── isi keterangan (arti) ──
    const artiTeks = String(e.arti || '').trim() || '(belum ada keterangan)';
    const arti = document.createElement('div');
    arti.className = 'kamus-istilah-arti';
    arti.innerHTML = richArti(artiTeks, e.nama);
    kolom.appendChild(arti);

    // ── catatan pengguna (kalau ada) ──
    if (typeof e.catatan === 'string' && e.catatan.trim()) {
      const cat = document.createElement('div');
      cat.className = 'kamus-istilah-catatan';
      cat.textContent = '📝 ' + e.catatan.trim();
      kolom.appendChild(cat);
    }

    // ── istilah lain di DALAM keterangan ini (bisa diklik → level berikutnya) ──
    const lain = [];
    const sudah = new Set();
    (temukanIstilah(artiTeks) || []).forEach(k => {
      const n = (k.entri && k.entri.nama) ? k.entri.nama : k.tulisan;
      const kunci = String(n).toLowerCase();
      if (kunci === String(e.nama).toLowerCase()) return;
      if (sudah.has(kunci)) return;
      sudah.add(kunci);
      lain.push(n);
    });
    if (lain.length) {
      const jud = document.createElement('div');
      jud.className = 'kamus-bagian-judul kecil';
      jud.textContent = '📚 istilah lain di keterangan ini (klik: kolom baru di bawah)';
      kolom.appendChild(jud);
      const chips = document.createElement('div');
      chips.className = 'kamus-chip-baris';
      lain.forEach(n => {
        const c = document.createElement('span');
        c.className = 'kamus-chip kamus-chip-ist';
        c.textContent = n;
        c.dataset.istilah = n;
        c.title = '📚 ' + n + ' — klik: kolom baru muncul di bawah';
        chips.appendChild(c);
      });
      kolom.appendChild(chips);
    }

    // ── ayat pendukung istilah ini (chip) — bisa diklik → kolom AYAT ──
    const refs = cariRujukan(artiTeks);
    const unik = [];
    const sudahR = new Set();
    refs.forEach(r => {
      const k = r.ref.no + '.' + r.ref.pasal + '.' + r.ref.ayat1 + '.' + r.ref.ayat2;
      if (sudahR.has(k)) return;
      sudahR.add(k);
      unik.push(r.ref);
    });
    if (unik.length) {
      const jud = document.createElement('div');
      jud.className = 'kamus-bagian-judul kecil';
      jud.textContent = '📖 AYATNYA (' + unik.length + ')';
      kolom.appendChild(jud);
      const chips = document.createElement('div');
      chips.className = 'kamus-chip-baris';
      unik.forEach(ref => {
        const c = document.createElement('span');
        c.className = 'kamus-chip kamus-ay-chip kamus-ay-chip-dalam';
        const label = ref.singkatan + ' ' + ref.pasal +
          (ref.ayat1 ? ':' + ref.ayat1 + (ref.ayat2 !== ref.ayat1 ? '-' + ref.ayat2 : '') : '');
        c.textContent = label;
        c.dataset.ref = JSON.stringify(ref);
        c.title = 'Klik: teks ayat tampil di kolom ayat (kolom no.1)';
        chips.appendChild(c);
      });
      kolom.appendChild(chips);
    }

    return kolom;
  }

  // ── tambah kolom istilah pada level tertentu (timpa jika level sama) ──
  function tampilKeteranganIstilah(nama, chipAktif, level) {
    const tunas = document.getElementById('kamus-istilah-tunas') ||
                  document.getElementById('kamus-istilah-kolom');
    if (!tunas) return;
    const lv = (typeof level === 'number' && level > 0) ? level : 1;

    // ⚠️ hanya level yang SAMA (dan di bawahnya) yang dibuang —
    //    level di ATASNYA tetap (tidak ikut hilang).
    buangKolomDari(tunas, lv);

    // ⚠️ Ganti level 1 = ganti RANTAI ⇒ blok & tunas dari level 1 dibuang,
    //    rantai dikosongkan. Turunan di bawahnya tidak boleh tertinggal
    //    (dia milik kepala yang lama) — cacat nyata 21 Sep 2026.
    if (lv === 1) {
      const wadahBlok = document.getElementById('kamus-blok-wadah');
      if (wadahBlok) buangBlokDari(wadahBlok, 1);
      rantaiIstilah = [];
      segarkanKirimIstilah();
    }

    const kolom = buatKolomIstilah(nama, lv);
    kolom.dataset[KUNCI_LEVEL] = String(lv);
    tunas.appendChild(kolom);

    // kolom baru disorot sekejap supaya pengguna tahu di mana
    kolom.classList.add('kamus-istilah-baru');
    setTimeout(() => kolom.classList.remove('kamus-istilah-baru'), 900);

    // ── tandai chip yang aktif ──
    const semua = (isiHal() || document).querySelectorAll('.kamus-chip-ist');
    semua.forEach(c => c.classList.remove('aktif'));
    if (chipAktif) chipAktif.classList.add('aktif');
  }

  // Hitung level kolom dari posisi chip yang diklik:
  //   • chip di blok “istilah lain” utama (level 0 = head)  ⇒ level 1
  //   • chip di dalam kolom istilah level n                 ⇒ level n + 1
  //   • chip di dalam teks keterangan kolom level n         ⇒ level n + 1
  //   • chip di dalam BLOK level n (sudah di-✓ pilih)       ⇒ level n + 1
  function levelDariChip(el) {
    const kolom = el && el.closest ? el.closest('.kamus-istilah-kolom') : null;
    if (kolom) {
      const lv = parseInt(kolom.dataset[KUNCI_LEVEL] || '1', 10);
      return (lv || 1) + 1;
    }
    const blok = el && el.closest ? el.closest('.kamus-blok') : null;
    if (blok) {
      const lv = parseInt(blok.dataset[KUNCI_LEVEL] || '1', 10);
      return (lv || 1) + 1;
    }
    return 1;
  }

  // ============================================================
  // BUTIR e — istilah di HALAMAN BACA ALKITAB
  //   Mendaftar lewat sambungan resmi Alkitab: tambahPenghias(fn).
  //   ⚠️ Alkitab TIDAK perlu tahu plugin Kamus ada.
  // ============================================================
  function hiasAyat(ctx) {
    const isiBaca = document.getElementById('baca-isi');
    if (!isiBaca) return;
    if (!bisaTandai(isiBaca)) return;
    // buang daftar istilah lama (kalau pasal berganti)
    isiBaca.querySelectorAll('.kamus-ayat-daftar').forEach(x => x.remove());
    // tandai istilah di seluruh bacaan (tanpa urusan kursor)
    tandaiWadah(isiBaca, false);
    // daftar ringkas istilah di pasal ini
    const teks = isiBaca.textContent || '';
    const unik = [];
    const sudah = new Set();
    (temukanIstilah(teks) || []).forEach(k => {
      const n = (k.entri && k.entri.nama) ? k.entri.nama : k.tulisan;
      const kunci = String(n).toLowerCase();
      if (sudah.has(kunci)) return;
      sudah.add(kunci);
      unik.push(n);
    });
    if (!unik.length) return;

    const blok = document.createElement('div');
    blok.className = 'kamus-ayat-daftar';
    const jud = document.createElement('div');
    jud.className = 'kamus-bagian-judul';
    jud.textContent = '📚 Istilah di pasal ini (' + unik.length + ')' +
                      (unik.length > 12 ? ' — 12 pertama' : '');
    blok.appendChild(jud);
    const chips = document.createElement('div');
    chips.className = 'kamus-chip-baris';
    unik.slice(0, 12).forEach(n => {
      const c = document.createElement('span');
      c.className = 'kamus-chip kamus-chip-ist';
      c.textContent = n;
      c.dataset.istilah = n;
      c.title = '📚 ' + n + ' — klik untuk melihat artinya';
      // K52 — chip ini dulu TIDAK terhubung ke pengait mana pun (hanya pengait
      //   halaman kamus); sekarang diklik → langsung buka halaman istilahnya.
      c.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!adaData()) { pesan('⏳ Menyiapkan kamus istilah…'); return; }
        ingatAsal(null);
        bukaIstilah(n, { dariHalaman: { span: null, jenis: 'baca' } });
      });
      chips.appendChild(c);
    });
    blok.appendChild(chips);
    isiBaca.appendChild(blok);
  }

  // ============================================================
  // K52 BUTIR c — istilah di HALAMAN PENGUAT (🖊 Pembaca Penguat)
  //   Halaman penguat menyediakan sambungan resmi yang SAMA polanya dengan
  //   plugin Alkitab: tambahPenghias(fn) / jalankanPenghias(ctx).
  //   ⇒ Kamus yang mendaftar; halaman penguat tidak perlu tahu Kamus ada.
  //   Teks AYAT dan teks PENGUAT dua-duanya ditandai (permintaan Bapak).
  // ============================================================
  function hiasPenguat(ctx) {
    const isi = document.getElementById('pg-isi');
    if (!isi) return;
    if (!bisaTandai(isi)) return;
    tandaiWadah(isi, false);
  }

  // ============================================================
  // K56 (23 Sep 2026) — TANDAI ISTILAH DI HALAMAN BACA-SAJA LAIN
  //   Bapak: *“Pengantar Sejarah Alkitab .. kamus istilah juga belum
  //   berfungsi”* ⇒ halaman Sejarah Alkitab perlu ditandai juga.
  //   ⇒ fungsi generik: tandai wadah APA PUN (pakai `tandaiWadah` yang sudah
  //     ada — penandaan + pengait klik-nya sudah generik).
  //   ❌ TANPA mesin baru — hanya membuka pintu untuk wadah lain.
  // ============================================================
  function tandaiHalaman(wadah) {
    if (!wadah || !bisaTandai(wadah)) return 0;
    // ⚠️ Penandaan saja TIDAK CUKUP — tautan bergaya tapi kliknya mati.
    //    Pengait klik WAJIB dipasang di wadah yang sama (pelajaran K52).
    pasangKaitHalaman(wadah, halamanUntukWadah(wadah));
    tandaiWadah(wadah, false);
    return wadah.querySelectorAll('span.' + KELAS).length;
  }

  // kenali jenis halaman dari id wadahnya (dipakai ingatAsalHalaman)
  function halamanUntukWadah(wadah) {
    const id = wadah && wadah.id;
    if (id === 'pg-isi') return 'penguat';
    if (id === 'sj-isi') return 'sejarah';
    return 'baca';
  }

  // ============================================================
  // K51 BUTIR c+d — RANTAI ISTILAH → BLOK TERSENDIRI → SIMPAN & PASTE
  //   ⚠️ Bapak 21 Sep 2026: *"metode sama seperti ayat terkait .. kebawah terus..
  //      dengan head “suci;kudus” dan **disimpan bisa dipaste ke catatan**"*
  //
  //   Pola SAMA dengan 🌿 Ayat Terkait (K37):
  //     klik istilah → kolom keterangan (PRATINJAU)
  //     `✓ pilih`      → keterangan jadi BLOK TETAP (bertumpuk ke bawah)
  //     [ + Istilah ]  → keterangan dikirim ke catatan (jalur K40, ❌ bukan mesin baru)
  //
  //   ❌ TIDAK ada mesin baru: yang dikirim adalah hasil susun sendiri
  //      (`ANodesEditor.terimaPaket` / `tempelPaket` — jalur K20/K40).
  // ============================================================
  let rantaiIstilah = [];   // daftar {nama, arti} — urut sesuai pilihan

  // teks polos satu keterangan (arti + catatan pengguna kalau ada)
  function teksKeterangan(nama) {
    const e = entriUntukHalaman(nama);
    if (!e) return '';
    let t = String(e.nama || nama).trim();
    const arti = String(e.arti || '').trim();
    if (arti) t += ' — ' + arti;
    if (typeof e.catatan === 'string' && e.catatan.trim()) {
      t += ' 📝 ' + e.catatan.trim();
    }
    return t;
  }

  // kepala rantai = judul istilah yang SEDANG dibuka (level 0)
  function namaAkarIstilah() {
    return istilahKini || (rantaiIstilah[0] ? rantaiIstilah[0].nama : null);
  }

  // buang blok/kolom pada level >= n (level n sendiri diganti — “timpa level sama”)
  function buangBlokDari(wadah, level) {
    if (!wadah) return;
    [...wadah.children].forEach(b => {
      const lv = parseInt(b.dataset[KUNCI_LEVEL] || '0', 10);
      if (lv >= level) b.remove();
    });
  }

  // buang SEMUA perwakilan (kolom di tunas + blok di wadah blok) pada level >= n
  function buangLevelDari(tunas, level) {
    buangBlokDari(tunas, level);
    buangBlokDari(document.getElementById('kamus-blok-wadah'), level);
    rantaiIstilah = rantaiIstilah.filter(x => x.level < level);
  }

  // `✓ pilih` di satu kolom → keterangannya jadi BLOK TETAP (bertumpuk ke bawah)
  //   ⚠️ HANYA level ini yang diganti — turunan di bawahnya TIDAK dibuang.
  //      (cacat nyata 21 Sep 2026: dulu memilih level 1 menghapus kolom level 2
  //       yang baru saja dibuka, sehingga blok berlevel tak pernah bisa disusun)
  //   Turunan dibuang di `tampilKeteranganIstilah()` — saat KEPALA diganti.
  function pilihKolom(kolom) {
    const tunas = document.getElementById('kamus-istilah-tunas');
    if (!tunas || !kolom) return null;
    const nama = kolom.dataset.kamusNama;
    if (!nama) return null;
    const level = parseInt(kolom.dataset[KUNCI_LEVEL] || '1', 10);

    // ganti HANYA level ini (kolom + blok level itu)
    buangBlokDari(tunas, level);
    const wadahBlok = pastikanWadahBlok();
    if (wadahBlok) buangBlokDari(wadahBlok, level);
    kolom.remove();

    const blok = document.createElement('div');
    blok.className = 'kamus-blok';
    blok.dataset[KUNCI_LEVEL] = String(level);
    const kepala = document.createElement('div');
    kepala.className = 'kamus-blok-kepala';
    const judul = document.createElement('span');
    judul.className = 'kamus-blok-judul';
    judul.textContent = '✓ ' + nama;
    kepala.appendChild(judul);
    const lv = document.createElement('span');
    lv.className = 'kamus-level-tanda';
    lv.textContent = 'Tingkat ' + level;
    kepala.appendChild(lv);
    blok.appendChild(kepala);
    const isi = document.createElement('div');
    isi.className = 'kamus-blok-isi';
    isi.textContent = teksKeterangan(nama);
    blok.appendChild(isi);

    // ── lanjutan rantai: istilah lain di DALAM blok ini ──
    //   ⚠️ Dulu TIDAK ada — sehingga rantai berlevel tak bisa diteruskan
    //      dari blok (cacat nyata 21 Sep 2026). Sekarang chip di sini
    //      membuka kolom di level BERIKUTNYA (pola sama Ayat Terkait).
    const lanjut = istilahDalamTeks(nama);
    if (lanjut.length) {
      const jud = document.createElement('div');
      jud.className = 'kamus-bagian-judul kecil';
      jud.textContent = '📚 istilah lain di keterangan ini (klik: kolom baru di bawah)';
      blok.appendChild(jud);
      const chips = document.createElement('div');
      chips.className = 'kamus-chip-baris';
      lanjut.forEach(n => {
        const c = document.createElement('span');
        c.className = 'kamus-chip kamus-chip-ist';
        c.textContent = n;
        c.dataset.istilah = n;
        c.title = '📚 ' + n + ' — klik: kolom baru muncul di bawah';
        chips.appendChild(c);
      });
      blok.appendChild(chips);
    }

    if (!wadahBlok) return null;
    wadahBlok.appendChild(blok);

    // catat di rantai (untuk dikirim ke catatan) — urut per level
    rantaiIstilah = rantaiIstilah.filter(x => x.level !== level);
    rantaiIstilah.push({ level: level, nama: nama });
    rantaiIstilah.sort((a, b) => a.level - b.level);

    segarkanKirimIstilah();
    blok.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return blok;
  }

  // nama-nama istilah lain yang disebut di keterangan sebuah istilah
  function istilahDalamTeks(nama) {
    const e = entriUntukHalaman(nama);
    if (!e) return [];
    const artiTeks = String(e.arti || '');
    const lain = [];
    const sudah = new Set([String(e.nama).toLowerCase()]);
    (temukanIstilah(artiTeks) || []).forEach(k => {
      const n = (k.entri && k.entri.nama) ? k.entri.nama : k.tulisan;
      const kunci = String(n).toLowerCase();
      if (sudah.has(kunci)) return;
      sudah.add(kunci);
      lain.push(n);
    });
    return lain;
  }

  // wadah blok dibuat sekali — ditaruh PALING BAWAH halaman arti
  //   (supaya blok benar-benar “kebawah terus”, pola sama Ayat Terkait)
  function pastikanWadahBlok() {
    let wadah = document.getElementById('kamus-blok-wadah');
    if (wadah) return wadah;
    const induk = isiHal();
    if (!induk) return null;
    wadah = document.createElement('div');
    wadah.className = 'kamus-blok-wadah';
    wadah.id = 'kamus-blok-wadah';
    // sebelum bilah kirim kalau ada, kalau tidak → paling belakang
    const barisKirim = document.getElementById('kamus-kirim-baris');
    if (barisKirim && barisKirim.parentNode === induk) induk.insertBefore(wadah, barisKirim);
    else induk.appendChild(wadah);
    return wadah;
  }

  // teks yang dikirim ke catatan: kepala (head) + tiap keterangan
  function susunTeksIstilah() {
    const kepala = namaAkarIstilah();
    const baris = [];
    if (kepala) baris.push(String(kepala));
    rantaiIstilah.forEach(x => baris.push(teksKeterangan(x.nama)));
    return { teks: baris.join('\n'), nama: kepala || 'Istilah' };
  }

  // tombol [ + Istilah ] — kirim ke catatan (jalur K40: ANodesEditor.terimaPaket)
  function kirimIstilahKeCatatan() {
    if (!rantaiIstilah.length) {
      // kalau belum ada blok ✓ tapi sedang ada istilah terbuka → kirim istilah itu
      if (!istilahKini) { pesan('⚠️ Pilih dulu satu istilah dengan tombol ✓'); return false; }
      rantaiIstilah = [{ level: 1, nama: istilahKini }];
    }
    const ed = window.ANodesEditor;
    if (!ed || typeof ed.terimaPaket !== 'function') {
      pesan('⚠️ Catatan belum siap menerima');
      return false;
    }
    const paket = susunTeksIstilah();
    if (!paket.teks) { pesan('⚠️ Tidak ada keterangan untuk dikirim'); return false; }
    const okTerima = ed.terimaPaket({
      teks: paket.teks, nama: paket.nama,
      sumber: { jenis: 'kamus', nama: paket.nama }
    });
    if (!okTerima) return false;
    // tutup halaman kamus (yang menyembunyikan semua body > .app)
    const hal = halaman();
    if (hal) hal.hidden = true;
    const utama = document.getElementById('app-utama');
    if (utama) utama.hidden = false;
    pesan('📋 “' + paket.nama + '” siap — klik di catatan, lalu [ + Istilah ]');
    return true;
  }

  function segarkanKirimIstilah() {
    const b = document.getElementById('kamus-kirim-istilah');
    if (!b) return;
    const jml = rantaiIstilah.length;
    const bisa = jml > 0 || !!istilahKini;
    b.disabled = !bisa;
    b.title = jml
      ? 'Kirim ' + jml + ' keterangan istilah ke catatan'
      : (istilahKini
          ? 'Kirim keterangan “' + istilahKini + '” ke catatan'
          : 'Pilih dulu satu istilah dengan tombol ✓');
  }

  // sisipkan bilah [ + Istilah ] di bawah "AYATNYA" (halaman arti & kolom)
  function pasangBilahKirim(tempat) {
    if (!tempat) return;
    let bilah = document.getElementById('kamus-kirim-baris');
    if (!bilah) {
      bilah = document.createElement('div');
      bilah.className = 'kamus-kirim-baris';
      bilah.id = 'kamus-kirim-baris';
      tempat.appendChild(bilah);
    }
    if (!document.getElementById('kamus-kirim-istilah')) {
      const b = document.createElement('button');
      b.type = 'button';
      b.id = 'kamus-kirim-istilah';
      b.className = 'kamus-kirim-istilah';
      b.textContent = '＋ Istilah';
      b.addEventListener('click', kirimIstilahKeCatatan);
      bilah.appendChild(b);
    }
    segarkanKirimIstilah();
  }

  // ============================================================
  // BUTIR f — panel 📋 AYAT & ISTILAH di catatan (bisa dilipat)
  // ============================================================
  function pasangPanelCatatan() {
    const utama = document.getElementById('app-utama');
    if (!utama || panelCatatan) return;
    const p = document.createElement('div');
    p.className = 'kamus-panel';
    p.id = 'kamus-panel';
    p.hidden = true;

    const kepala = document.createElement('div');
    kepala.className = 'kamus-panel-kepala';
    const judul = document.createElement('span');
    judul.className = 'kpp-judul';
    judul.id = 'kamus-panel-judul';
    judul.textContent = '📋 Ayat & Istilah';
    const tombol = document.createElement('button');
    tombol.className = 'kpp-toggle';
    tombol.id = 'kamus-panel-toggle';
    tombol.textContent = '▾';
    tombol.title = 'Buka/tutup daftar ayat & istilah di catatan ini';
    kepala.appendChild(judul);
    kepala.appendChild(tombol);

    const badan = document.createElement('div');
    badan.className = 'kamus-panel-badan';
    badan.id = 'kamus-panel-badan';
    badan.hidden = true;

    tombol.addEventListener('click', () => {
      badan.hidden = !badan.hidden;
      tombol.textContent = badan.hidden ? '▾' : '▴';
    });

    p.appendChild(kepala);
    p.appendChild(badan);
    utama.appendChild(p);
    panelCatatan = p;
  }

  function gambarPanel() {
    if (!pluginAktif() || !adaData()) { if (panelCatatan) panelCatatan.hidden = true; return; }
    // 🔌 K70 (5 Okt 2026) — saat penandaan catatan OFF, panel 📋 Ayat & Istilah
    //   TIDAK boleh muncul (isinya sudah tidak berlaku — tanda sudah dibersihkan).
    if (window.ANodesEditor && typeof window.ANodesEditor.catatanDitandai === 'function'
        && !window.ANodesEditor.catatanDitandai()) { if (panelCatatan) panelCatatan.hidden = true; return; }
    const el = editorEl();
    if (!el) return;
    const teks = el.textContent || '';
    const ist = [];
    const sudah = new Set();
    (temukanIstilah(teks) || []).forEach(k => {
      const n = (k.entri && k.entri.nama) ? k.entri.nama : k.tulisan;
      const kunci = String(n).toLowerCase();
      if (sudah.has(kunci)) return;
      sudah.add(kunci);
      ist.push(n);
    });
    const A = window.ANodesAlkitab;
    const ayat = [];
    if (A && A.siap && A.siap()) {
      const semuaLink = [...el.querySelectorAll('span.ay-link')];
      const sudahA = new Set();
      semuaLink.forEach(l => {
        const t = (l.textContent || '').trim();
        if (!t || sudahA.has(t)) return;
        sudahA.add(t);
        ayat.push(t);
      });
    }
    /* 🔴 K73 (5 Okt 2026) — nama tempat di catatan (bagian 🗺️ Peta).
       Dihitung DI SINI (sebelum pemeriksaan “tidak ada isi”) supaya panel
       tetap muncul walau catatan hanya menyebut nama tempat — tanpa ayat
       maupun istilah. */
    const petaAyat = window.ANodesPetaAyat;
    const petaTampilan = window.ANodesPetaTampilan;
    const petaAda = !!(petaAyat && petaTampilan && window.ANodesPlugin
                       && window.ANodesPlugin.dipasang('peta'));
    let tempat = [];
    if (petaAda && typeof petaAyat.temukanLokasiDiTeks === 'function') {
      try { tempat = petaAyat.temukanLokasiDiTeks(teks) || []; } catch (e) { tempat = []; }
    }

    if (!ist.length && !ayat.length && !tempat.length) {
      pasangPanelCatatan(); if (panelCatatan) panelCatatan.hidden = true; return;
    }

    pasangPanelCatatan();
    if (!panelCatatan) return;
    panelCatatan.hidden = false;
    const judul = document.getElementById('kamus-panel-judul');
    if (judul) {
      judul.textContent = '📋 Ayat & Istilah — ' + ayat.length + ' ayat · '
                        + ist.length + ' istilah'
                        + (tempat.length ? ' · ' + tempat.length + ' tempat' : '');
    }

    const badan = document.getElementById('kamus-panel-badan');
    if (!badan) return;
    badan.innerHTML = '';
    if (ist.length) {
      const h = document.createElement('div');
      h.className = 'kamus-bagian-judul';
      h.textContent = '📚 Istilah (' + ist.length + ')';
      badan.appendChild(h);
      const c = document.createElement('div');
      c.className = 'kamus-chip-baris';
      ist.forEach(n => {
        const x = document.createElement('span');
        x.className = 'kamus-chip kamus-chip-ist';
        x.textContent = n;
        x.dataset.istilah = n;
        x.title = '📚 ' + n + ' — klik untuk melihat artinya';
        c.appendChild(x);
      });
      badan.appendChild(c);
    }
    if (ayat.length) {
      const h = document.createElement('div');
      h.className = 'kamus-bagian-judul';
      h.textContent = '📖 Ayat (' + ayat.length + ')';
      badan.appendChild(h);
      const c = document.createElement('div');
      c.className = 'kamus-chip-baris';
      ayat.forEach(t => {
        const x = document.createElement('span');
        x.className = 'kamus-chip kamu-chip-ayat';
        x.textContent = t;
        x.title = 'Nama ayat — dibaca di halaman Alkitab';
        x.addEventListener('click', () => {
          const A2 = window.ANodesAlkitab;
          if (!A2 || !A2.kenaliAyat || !A2.siap || !A2.siap()) { pesan('⏳ Menyiapkan data Alkitab…'); return; }
          const r = A2.kenaliAyat(t);
          const T = window.ANodesAlkitabTampilan;
          if (r && T && T.bukaAyatDariLink) T.bukaAyatDariLink(r);
        });
        c.appendChild(x);
      });
      badan.appendChild(c);
    }

    /* ============================================================
       🔴 K73 (5 Okt 2026) — BAGIAN 🗺️ PETA DI PANEL BAWAH CATATAN
       ------------------------------------------------------------
       Bapak: *“di catatan / di note .. ketik sungai yordan juga harusnya ada
       daftar peta .. tampil ada di kolom paling bawah note.. km bisa liat ayat
       & istilah .. di tempatkan di sana”*

       ⇒ nama tempat yang disebut di catatan muncul sebagai chip; diklik ⇒
         **mini-peta + keterangan** tampil di panel (pola SAMA seperti 📍 di
         halaman baca Alkitab — mesin `ANodesPetaAyat` dipakai ulang).
       ⚠️ Plugin 🗺️ Peta boleh TIDAK terpasang ⇒ bagian ini cukup dilewati.
       ============================================================ */
    if (tempat.length) {
      const h = document.createElement('div');
      h.className = 'kamus-bagian-judul';
      h.textContent = '🗺️ Peta (' + tempat.length + ')';
      badan.appendChild(h);
      const c = document.createElement('div');
      c.className = 'kamus-chip-baris';
      tempat.forEach(t => {
        const x = document.createElement('span');
        x.className = 'kamus-chip kamus-chip-peta';
        x.textContent = t.nama;
        x.dataset.lokasi = t.kunci;
        x.title = '🗺️ ' + t.nama + ' — klik untuk melihat petanya';
        x.addEventListener('click', () => tampilPetaPanel(badan, tempat, t.kunci));
        c.appendChild(x);
      });
      badan.appendChild(c);
      /* wadah mini-peta (satu slot, gantian — pola sama seperti di ayat) */
      const wadahPeta = document.createElement('div');
      wadahPeta.className = 'kamus-peta-slot';
      wadahPeta.id = 'kamus-peta-slot';
      wadahPeta.hidden = true;
      badan.appendChild(wadahPeta);
    }

    // tombol ＋ Istilah (butir g) — memakai kata yang sedang dipilih
    const bTambah = document.createElement('button');
    bTambah.className = 'kamus-tambah-ist';
    bTambah.textContent = '＋ Istilah';
    bTambah.title = 'Pilih dulu satu kata di catatan, lalu tekan tombol ini — keterangannya boleh diisi nanti';
    bTambah.addEventListener('click', () => {
      const sel = window.getSelection();
      const kata = (sel && !sel.isCollapsed) ? String(sel.toString()).trim() : '';
      if (!kata) { pesan('⚠️ Pilih (blok) dulu satu kata di catatan'); return; }
      const e = tambahIstilahPribadi(kata);
      if (!e) return;
      pesan('✅ “' + e.nama + '” masuk daftar istilah pribadi (keterangan menyusul)', 3000);
      gambarPanel();
    });
    badan.appendChild(bTambah);
  }

  /* ============================================================
     🔴 K73 (5 Okt 2026) — MINI-PETA DI PANEL BAWAH CATATAN
     ------------------------------------------------------------
     Chip nama tempat diklik ⇒ mini-peta + keterangan tampil di **satu slot**
     (`#kamus-peta-slot`) — pola SAMA seperti 📍 di halaman baca Alkitab
     (klik nama lain ⇒ isi DITIMPA, ❌ bukan menumpuk kolom baru).
     Mesin gambar dipakai ulang: `ANodesPetaAyat.gambarMini()`.
     ============================================================ */
  function tampilPetaPanel(badan, daftar, kunci) {
    const m = window.ANodesPetaAyat;
    const slot = badan.querySelector('#kamus-peta-slot');
    if (!m || !slot) return;
    const x = m.info(kunci);
    if (!x) return;

    /* klik nama yang SAMA ⇒ tutup (pola K68 b: klik sama = hide) */
    if (slot.dataset.lokasi === kunci && !slot.hidden) {
      slot.hidden = true;
      slot.dataset.lokasi = '';
      slot.textContent = '';
      badan.querySelectorAll('.kamus-chip-peta.aktif').forEach(c => c.classList.remove('aktif'));
      return;
    }

    slot.hidden = false;
    slot.dataset.lokasi = kunci;
    slot.textContent = '';
    badan.querySelectorAll('.kamus-chip-peta').forEach(c => {
      c.classList.toggle('aktif', c.dataset.lokasi === kunci);
    });

    /* kepala: nama + jenis */
    const kepala = document.createElement('div');
    kepala.className = 'kamus-peta-kepala';
    const nm = document.createElement('span');
    nm.className = 'kamus-peta-nama';
    nm.textContent = '📍 ' + x.nama;
    kepala.appendChild(nm);
    const jn = document.createElement('span');
    jn.className = 'kamus-peta-jenis';
    jn.textContent = ' · ' + m.labelJenis(x.jenis);
    kepala.appendChild(jn);
    slot.appendChild(kepala);

    /* mini-peta — citra relief NASA, tanpa zoom/seret, titik berkedip */
    const panggung = document.createElement('div');
    panggung.className = 'kamus-peta-panggung';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'kamus-peta-svg');
    panggung.appendChild(svg);
    slot.appendChild(panggung);
    /* rasio 2:1 = SAMA dengan jendela citra NASA & halaman Peta (K69c) */
    const tergambar = m.gambarMini(svg, [kunci], { lebar: 480, tinggi: 240, kedip: true });
    if (!tergambar) {
      panggung.remove();
      const gagal = document.createElement('div');
      gagal.className = 'kamus-peta-kosong';
      gagal.textContent = 'Peta belum bisa digambar (data citra belum ada).';
      slot.appendChild(gagal);
    }

    /* keterangan */
    if (x.ket) {
      const ket = document.createElement('div');
      ket.className = 'kamus-peta-ket';
      ket.textContent = x.ket;
      slot.appendChild(ket);
    }

    /* rujukan ayat — diklik ⇒ dibaca di halaman Alkitab */
    if (x.ref && x.ref.length) {
      const baris = document.createElement('div');
      baris.className = 'kamus-peta-ref';
      const lbl = document.createElement('span');
      lbl.className = 'kamus-peta-ref-lbl';
      lbl.textContent = '📖 ';
      baris.appendChild(lbl);
      x.ref.forEach(r => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'kamus-peta-ref-btn';
        b.textContent = labelRefPeta(r);
        b.title = 'Baca ayat ini di halaman Alkitab';
        b.addEventListener('click', () => {
          const A = window.ANodesAlkitab;
          const T = window.ANodesAlkitabTampilan;
          if (!A || !A.siap || !A.siap()) { pesan('⏳ Menyiapkan data Alkitab…'); return; }
          const p = String(r).split('.');
          if (p.length !== 3) return;
          const ref = { no: Number(p[0]), pasal: Number(p[1]), ayat1: Number(p[2]), ayat2: Number(p[2]) };
          if (T && T.bukaAyatDariLink) T.bukaAyatDariLink(ref);
        });
        baris.appendChild(b);
      });
      slot.appendChild(baris);
    }
  }

  /** Label rujukan peta (`"6.3.15"` ⇒ `Yosua 3:15`) — memakai data Alkitab. */
  function labelRefPeta(r) {
    const p = String(r).split('.');
    if (p.length !== 3) return String(r);
    const A = window.ANodesAlkitab;
    let nama = 'Kitab ' + p[0];
    if (A && A.daftarKitab) {
      const k = (A.daftarKitab() || []).find(x => Number(x.no) === Number(p[0]));
      if (k) nama = k.nama;
    }
    return nama + ' ' + p[1] + ':' + p[2];
  }

  // ============================================================
  // hidupkan / bersihkan — dipanggil mesin kamus.js
  // ============================================================
  function hidupkan() {
    hidup = true;
    muatPribadi();
    pasangPanelCatatan();
    if (!dipasangKait) { pasangKait(); dipasangKait = true; }
    // penghias halaman baca Alkitab (sambungan resmi — boleh gagal)
    const A = window.ANodesAlkitabTampilan;
    if (A && typeof A.tambahPenghias === 'function' && !kaitAyatBaca) {
      try { A.tambahPenghias(hiasAyat); kaitAyatBaca = true; } catch (e) {}
    }
    // K52 c — penghias halaman 🖊 Pembaca Penguat (pola sambungan SAMA)
    const P = window.ANodesPenguatTampilan;
    if (P && typeof P.tambahPenghias === 'function' && !kaitPenguat) {
      try { P.tambahPenghias(hiasPenguat); kaitPenguat = true; } catch (e) {}
    }
    tandaiSemua();
    gambarPanel();
    if (!adaData()) return;
    // kalau data baru siap, tandai lagi (kadang editor belum terisi)
    const m = mesin();
    if (m && m.padaSiap) m.padaSiap(() => { tandaiSemua(); gambarPanel(); });
  }

  function bersihkan() {
    hidup = false;
    const el0 = editorEl();
    if (el0) bukaTanda(el0);
    const baca = document.getElementById('baca-isi');
    if (baca) {
      bukaTanda(baca);
      baca.querySelectorAll('.kamus-ayat-daftar').forEach(x => x.remove());
    }
    // K52 — tanda di halaman penguat juga dibuang saat plugin dilepas
    const pg = document.getElementById('pg-isi');
    if (pg) bukaTanda(pg);
    if (panelCatatan) panelCatatan.hidden = true;
    // 🆕 K70 (5 Okt 2026) — saat penandaan catatan DIMATIKAN, panel 📋 Ayat &
    //   Istilah juga harus disembunyikan (isinya sudah tidak berlaku lagi).
    if (window.ANodesEditor && typeof window.ANodesEditor.catatanDitandai === 'function'
        && !window.ANodesEditor.catatanDitandai() && panelCatatan) panelCatatan.hidden = true;
    tutupHalaman();
    riwayatIstilah = [];
    istilahKini = null;
    asal = null;
    asalKamus = null;
    asalHalaman = null;
  }

  // ============================================================
  // PENGAI T KLIK — satu pintu untuk seluruh halaman kamus
  // ============================================================
  function pasangKait() {
    const hal = halaman();
    if (hal) {
      // klik pada arti: tautan ayat ATAU istilah lain
      hal.addEventListener('click', (ev) => {
        const t = ev.target;
        if (!t || !t.closest) return;
        const ay = t.closest('span.' + KELAS_AYAT);
        if (ay) {
          ev.preventDefault();
          let ref = null;
          try { ref = JSON.parse(ay.dataset.ref || 'null'); } catch (e) {}
          if (ref) {
            const chip = [...(isiHal() || hal).querySelectorAll('.kamus-ay-chip')]
              .find(c => {
                let r2 = null;
                try { r2 = JSON.parse(c.dataset.ref || 'null'); } catch (e) {}
                return r2 && ref && r2.no === ref.no && r2.pasal === ref.pasal &&
                       r2.ayat1 === ref.ayat1 && r2.ayat2 === ref.ayat2;
              });
            if (chip) tampilAyat(ref, chip);
            else tampilAyat(ref, null);
          }
          return;
        }
        const it = t.closest('.kamus-chip-ist');
        if (it && it.dataset.istilah) {
          ev.preventDefault();
          // K51 — klik istilah = KOLOM BARU DI BAWAH (per level).
          //   level = kolom tempat chip itu berada + 1.
          //   ⚠️ Kalau tidak ada tunas kolom (mis. chip di HALAMAN DAFTAR),
          //      baru pindah halaman seperti dulu — supaya daftar tetap bisa dipakai.
          const tunas = document.getElementById('kamus-istilah-tunas') ||
                        document.getElementById('kamus-istilah-kolom');
          if (tunas) {
            tampilKeteranganIstilah(it.dataset.istilah, it, levelDariChip(it));
          } else {
            bukaIstilah(it.dataset.istilah);
          }
          return;
        }
        // K51 — kata istilah DI DALAM teks keterangan (span.kamus-ist-link).
        //   Dulu tidak ada pengaitnya (tautan mati) → sekarang kolom baru di bawah.
        const tl = t.closest('span.' + KELAS_TERM);
        if (tl && tl.dataset.istilah) {
          ev.preventDefault();
          const tunas2 = document.getElementById('kamus-istilah-tunas') ||
                         document.getElementById('kamus-istilah-kolom');
          if (tunas2) {
            tampilKeteranganIstilah(tl.dataset.istilah, tl, levelDariChip(tl));
          } else {
            bukaIstilah(tl.dataset.istilah);
          }
          return;
        }
        const ayc = t.closest('.kamus-ay-chip');
        if (ayc) {
          ev.preventDefault();
          let ref = null;
          try { ref = JSON.parse(ayc.dataset.ref || 'null'); } catch (e) {}
          if (ref) tampilAyat(ref, ayc);
          return;
        }
        // K43 b — tombol [full]: lompat ke halaman baca Alkitab
        const bf = t.closest('.kamus-full');
        if (bf) {
          ev.preventDefault();
          let ref = null;
          try { ref = JSON.parse(bf.dataset.ref || 'null'); } catch (e) {}
          if (ref) bukaFull(ref, istilahKini);
          return;
        }
      });

      const bKembali = document.getElementById('kamus-kembali');
      if (bKembali) bKembali.addEventListener('click', kembaliKeCatatan);
      const bBack = document.getElementById('kamus-back');
      if (bBack) bBack.addEventListener('click', kembaliIstilah);
      const bDaftar = document.getElementById('kamus-daftar');
      if (bDaftar) bDaftar.addEventListener('click', bukaDaftar);
      const bCariBtn = document.getElementById('kamus-cari-btn');
      if (bCariBtn) {
        bCariBtn.addEventListener('click', () => {
          if (!adaData()) { bukaDaftar(); return; }
          const b = document.getElementById('kamus-cari-baris');
          const sedangTampil = b && !b.hidden;
          if (modeDaftar && sedangTampil) {
            const i = document.getElementById('kamus-cari');
            if (i) { i.focus(); i.select(); }
            return;
          }
          // dari halaman arti → pindah ke daftar + kotak cari
          bukaDaftar();
        });
      }
      const inp = document.getElementById('kamus-cari');
      if (inp) {
        const jalan = () => {
          const kata = inp.value.trim();
          gambarDaftar(kata);
          const info = document.getElementById('kamus-cari-info');
          if (info) info.textContent = kata ? cariIstilah(kata).length + ' temuan' : '';
        };
        inp.addEventListener('input', jalan);
        inp.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter') { ev.preventDefault(); jalan(); }
          if (ev.key === 'Escape') { ev.preventDefault(); inp.value = ''; jalan(); }
        });
      }
      const bTutup = document.getElementById('kamus-cari-tutup');
      if (bTutup) {
        bTutup.addEventListener('click', () => {
          tampilCari(false);
          if (modeDaftar) gambarDaftar('');
        });
      }
      document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && hal && !hal.hidden) {
          if (istilahKini && !modeDaftar) kembaliKeCatatan();
          else kembaliKeCatatan();
        }
      });
    }

    // klik istilah DI CATATAN
    const ed = editorEl();
    if (ed) {
      ed.addEventListener('click', (ev) => {
        const t = ev.target;
        if (!t || !t.closest) return;
        const sp = t.closest('span.' + KELAS);
        if (!sp) return;
        ev.preventDefault();
        if (!adaData()) { pesan('⏳ Menyiapkan kamus istilah…'); return; }
        ingatAsal(sp);
        bukaIstilah(sp.dataset.istilah);
      });
    }

    // tangkal batang penandaan ulang setelah MENGETIK — dipasang terpisah
    // supaya blok klik di atas tetap ringkas.
    if (ed && !ed.dataset.kamusTandai) {
      ed.dataset.kamusTandai = '1';
      // tandai lagi setelah mengetik (ditunda supaya mengetik lancar)
      let timerTandai = null;
      ed.addEventListener('input', () => {
        if (!bisaTandai()) {
          clearTimeout(timerPanel);
          timerPanel = setTimeout(gambarPanel, 1200);
          return;
        }
        clearTimeout(timerTandai);
        timerTandai = setTimeout(() => tandaiSemua(), 900);
        clearTimeout(timerPanel);
        timerPanel = setTimeout(gambarPanel, 1200);
      });
      ed.addEventListener('focus', () => {
        if (bisaTandai()) setTimeout(() => tandaiSemua(), 250);
      });
    }

    // K52 — klik istilah DI HALAMAN LAIN: baca Alkitab & halaman penguat.
    //   ⚠️ Dulu MATI (cacat nyata yang Bapak temukan 21 Sep 2026 pada Yosua 1:8):
    //      penandaan jalan, tapi pengait klik hanya dipasang di `#editor`.
    //   ⇒ satu pengait generik untuk kedua wadah (delegasi, jadi tetap hidup
    //     walau tanda dibongkar-pasang berkali-kali).
    pasangKaitHalaman(document.getElementById('baca-isi'), 'baca');
    pasangKaitHalaman(document.getElementById('pg-isi'), 'penguat');
    // K56 (23 Sep 2026) — halaman SEJARAH ALKITAB juga (Bapak: *“kamus istilah
    //   juga belum berfungsi”*). Sama seperti di atas: penandaan saja tidak
    //   cukup — pengait klik WAJIB dipasang di wadahnya.
    pasangKaitHalaman(document.getElementById('sj-isi'), 'sejarah');
  }

  // pengait klik istilah di satu wadah HALAMAN (baca Alkitab / penguat)
  function pasangKaitHalaman(wadah, jenis) {
    if (!wadah || wadah.dataset.kamusKait) return;
    wadah.dataset.kamusKait = '1';
    wadah.addEventListener('click', (ev) => {
      const t = ev.target;
      if (!t || !t.closest) return;
      const sp = t.closest('span.' + KELAS);
      if (!sp) return;
      ev.preventDefault();
      if (!adaData()) { pesan('⏳ Menyiapkan kamus istilah…'); return; }
      ingatAsal(null);                       // bukan dari catatan
      bukaIstilah(sp.dataset.istilah, { dariHalaman: { span: sp, jenis: jenis } });
    });
  }

  // buang tanda Kamus dari sebuah HTML (dipakai saat MENYIMPAN / EKSPOR catatan)
  //   ⚠️ Tanda Alkitab (span.ay-link) TIDAK disentuh di sini — itu urusan
  //      ANodesAlkitab.bersihTanda(). Yang dibuang hanya milik Kamus.
  function bersihkanHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    tmp.querySelectorAll('span.' + KELAS).forEach(sp => {
      sp.parentNode.replaceChild(document.createTextNode(sp.textContent), sp);
    });
    return tmp.innerHTML;
  }

  // ============================================================
  // API yang dipakai berkas lain
  // ============================================================
  return {
    hidupkan, bersihkan,
    caraTampil, pilihCara, simpanCaraTampil,
    versi: () => VERSI,
    // halaman
    bukaDaftar, bukaIstilah, tutupHalaman, kembaliKeCatatan, kembaliIstilah,
    // K43 — lompat ke Alkitab + kembali ke kamus
    bukaFull, dariKamus, pulihDariAlkitab, segarkanTombolKembaliBaca,
    catatanBapak, simpanCatatanBapak,
    // penandaan (dipakai editor / uji)
    tandaiSemua, bersihkanTanda, bersihkanHtml, hiasAyat, hiasPenguat, gambarPanel,
    // K56 — tandai istilah di halaman baca-saja lain (mis. halaman Sejarah)
    tandaiHalaman,
    // K52 — pembantu uji
    _asalHalaman: () => asalHalaman,
    _levelDariChip: (el) => levelDariChip(el),
    // K51 c+d — pembantu uji
    _rantaiIstilah: () => rantaiIstilah.slice(),
    _pilihKolom: pilihKolom,
    _susunTeksIstilah: susunTeksIstilah,
    // kamus pribadi (butir g)
    tambahIstilahPribadi, hapusIstilahPribadi, daftarAntrian,
    // pembantu uji
    _istilah: istilah, _semuaIstilah: semuaIstilah, _cari: cariIstilah,
    _temukan: temukanIstilah, _rujukan: cariRujukan, _richArti: richArti,
    _hidup: () => hidup,
    _kunciCara: KUNCI_CARA,
    _kunciPribadi: KUNCI_PRIBADI
  };
})();
