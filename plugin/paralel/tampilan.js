/* ============================================================
   ANodes — plugin/paralel/tampilan.js
   TAMPILAN plugin 🔀 Paralel Terjemahan (TB ⇄ AYT)   — K86

   💬 Bapak 3 Nov 2026: memilih **AYT** sebagai versi pembanding.

   📐 BENTUK YANG DIPAKAI — BERTUMPUK per ayat (❌ bukan 2 kolom):
     Diukur 3 Nov 2026: `.app` ANodes SELALU gaya HP (maks 480px) dan ruang
     tulis ayat hanya ±440px. Dua kolom ⇒ ±220px per kolom — terlalu sempit
     untuk teks Alkitab (baris jadi 3–4 kata). Karena itu tiap ayat menampilkan
     TB di atas dan AYT di bawahnya dalam kotak berwarna berbeda.

       ┌──────────────────────────────────────────────┐
       │ 16  Karena begitu besar kasih Allah akan …   │  ← TB (seperti biasa)
       │ ┌──────────────────────────────────────────┐ │
       │ │ AYT  Karena Allah sangat mengasihi dunia │ │  ← AYT (kotak biru muda)
       │ │      ini, Dia memberikan Anak-Nya …      │ │
       │ └──────────────────────────────────────────┘ │
       └──────────────────────────────────────────────┘

   ⚠️ ATURAN (pelajaran K80): pendaftaran penghias dilakukan SAAT MODUL DIMUAT,
      ❌ jangan menunggu data siap — kalau menunggu, tombol/kotak bisa tidak
      pernah muncul (race yang muncul kadang-kadang).

   ⚠️ ATURAN (pelajaran K55d/K81): `bersihkan()` WAJIB membuang penanda
      `dataset` — kalau tidak, plugin dipasang ulang ⇒ tidak pernah menghias lagi.
   ============================================================ */

window.ANodesParalelTampilan = (function () {
  'use strict';

  const VERSI = 'v3Nov-a';
  const KUNCI_AKTIF = 'anodes-paralel-aktif';
  const ID_TOMBOL = 'baca-paralel';
  const KELAS_KOTAK = 'pr-kotak';
  const KELAS_KAKI = 'pr-kaki';

  let aktif = null;          // null = belum dibaca dari localStorage

  function mesin() { return window.ANodesParalel || null; }
  function tampilAlkitab() { return window.ANodesAlkitabTampilan || null; }

  function pluginAktif() {
    return !!(window.ANodesPlugin && typeof window.ANodesPlugin.dipasang === 'function'
      && window.ANodesPlugin.dipasang('paralel'));
  }

  // ------------------------------------------------------------
  // keadaan ON/OFF
  // ------------------------------------------------------------
  function bacaAktif() {
    if (aktif !== null) return aktif;
    let v = null;
    try { v = localStorage.getItem(KUNCI_AKTIF); } catch (e) {}
    aktif = (v === '1');
    return aktif;
  }

  function simpanAktif(nilai) {
    aktif = !!nilai;
    try { localStorage.setItem(KUNCI_AKTIF, aktif ? '1' : '0'); } catch (e) {}
  }

  function sedangAktif() { return bacaAktif(); }

  // ------------------------------------------------------------
  // TOMBOL 🔀 DI NAVBAR HALAMAN BACA
  //   Pola SAMA seperti 🔖 Bookmark (K82) & 📅 Bacaan 1 Tahun (K97):
  //   plugin menempelkan tombolnya sendiri ke `.ay-nav-b1`; plugin 📖 Alkitab
  //   TIDAK perlu tahu plugin ini ada.
  // ------------------------------------------------------------
  function pasangTombolNavbar() {
    const nav = document.querySelector('#baca-alkitab .ay-nav-b1')
      || document.querySelector('#baca-alkitab .alkitab-nav');
    if (!nav) return false;
    let b = document.getElementById(ID_TOMBOL);
    if (!b) {
      b = document.createElement('button');
      b.id = ID_TOMBOL;
      b.className = 'ay-paralel';
      b.addEventListener('click', (e) => {
        e.preventDefault();
        sakelar();
      });
    }
    segarkanTombol(b);
    nav.appendChild(b);   // appendChild sekaligus memindahkan kalau baris digambar ulang
    return true;
  }

  function segarkanTombol(b) {
    const t = b || document.getElementById(ID_TOMBOL);
    if (!t) return;
    const nyala = bacaAktif();
    t.textContent = '🔀';
    t.classList.toggle('nyala', nyala);
    t.setAttribute('aria-pressed', nyala ? 'true' : 'false');
    t.title = nyala
      ? 'Paralel AKTIF — TB + AYT ditampilkan bersama. Klik untuk mematikan.'
      : 'Paralel — tampilkan AYT (Alkitab Yang Terbuka) di bawah tiap ayat TB';
  }

  // ------------------------------------------------------------
  // SAKELAR — nyalakan / matikan, lalu gambar ulang pasal
  // ------------------------------------------------------------
  function sakelar() {
    const baru = !bacaAktif();
    simpanAktif(baru);
    segarkanTombol();
    gambarUlangPasal();
    if (window.ANodesEditor && window.ANodesEditor.toast) {
      try {
        window.ANodesEditor.toast(baru
          ? '🔀 Paralel aktif — AYT tampil di bawah tiap ayat'
          : '🔀 Paralel dimatikan');
      } catch (e) {}
    }
    return baru;
  }

  function gambarUlangPasal() {
    const T = tampilAlkitab();
    const A = window.ANodesAlkitab;
    if (!T || !T.gambarPasal || !A || !A.siap || !A.siap()) return false;
    const p = T.posisi;
    if (!p || !p.kitab || !p.pasal) return false;
    T.gambarPasal(p.kitab, p.pasal, 0, true);
    return true;
  }

  // ------------------------------------------------------------
  // PENGHIAS — dipanggil plugin 📖 Alkitab tiap selesai menggambar pasal
  // ------------------------------------------------------------
  function hias(ctx) {
    if (!pluginAktif()) return;
    if (!ctx || !ctx.isi) return;
    const isi = ctx.isi;

    // buang sisa hiasan lama (idempoten)
    bersihkanHiasan(isi);

    if (!bacaAktif()) return;

    const m = mesin();
    if (!m || !m.siap || !m.siap()) {
      m && m.muat && m.muat();
      return;
    }

    const peta = m.petaPasal(ctx.kitab, ctx.pasal);
    const baris = [...isi.querySelectorAll('.ayat-baca')];
    let jumlah = 0;

    baris.forEach(b => {
      const no = Number(b.dataset.ayat || 0);
      if (!no) return;
      const teks = peta[no];
      if (!teks) return;

      const kotak = document.createElement('div');
      kotak.className = KELAS_KOTAK;

      const label = document.createElement('span');
      label.className = 'pr-label';
      label.textContent = m.nama();
      kotak.appendChild(label);

      const isiTeks = document.createElement('span');
      isiTeks.className = 'pr-teks';
      isiTeks.textContent = teks;
      kotak.appendChild(isiTeks);

      b.appendChild(kotak);
      b.dataset.prHias = '1';
      jumlah++;
    });

    if (jumlah) isi.appendChild(kaki(m));
  }

  function kaki(m) {
    const d = document.createElement('div');
    d.className = KELAS_KAKI;
    d.textContent = m.lisensi() + ' · dipakai untuk pemakaian pribadi (non-komersial)';
    return d;
  }

  function bersihkanHiasan(isi) {
    if (!isi) return;
    isi.querySelectorAll('.' + KELAS_KOTAK).forEach(e => e.remove());
    isi.querySelectorAll('.' + KELAS_KAKI).forEach(e => e.remove());
    isi.querySelectorAll('.ayat-baca').forEach(b => { delete b.dataset.prHias; });
  }

  // ------------------------------------------------------------
  // SIKLUS PLUGIN
  // ------------------------------------------------------------
  function siapkanOtomatis() {
    if (!pluginAktif()) return;
    pasangTombolNavbar();
    const T = tampilAlkitab();
    if (T && T.tambahPenghias) T.tambahPenghias(hias);
    const m = mesin();
    if (m && m.muat) m.muat();
  }

  function bersihkan() {
    const T = tampilAlkitab();
    if (T && T.lepasPenghias) T.lepasPenghias(hias);
    const isi = document.getElementById('baca-isi');
    bersihkanHiasan(isi);
    const b = document.getElementById(ID_TOMBOL);
    if (b) b.remove();
  }

  function versi() { return VERSI; }

  // ------------------------------------------------------------
  // DAFTARKAN PENGHIAS SEGERA (pelajaran K80 — ❌ jangan menunggu data siap)
  // ------------------------------------------------------------
  (function daftarkan() {
    const T = tampilAlkitab();
    if (T && T.tambahPenghias) T.tambahPenghias(hias);
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', siapkanOtomatis);
  } else {
    setTimeout(siapkanOtomatis, 0);
  }

  return {
    VERSI,
    versi,
    siapkanOtomatis,
    bersihkan,
    pasangTombolNavbar,
    segarkanTombol,
    sakelar,
    sedangAktif,
    bacaAktif,
    simpanAktif,
    gambarUlangPasal,
    hias,
    _kunciAktif: KUNCI_AKTIF
  };
})();
