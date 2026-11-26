/* ============================================================
   ANodes — plugin/perikop/tampilan.js
   TAMPILAN plugin 📖 Judul Perikop   — K99

   💬 Bapak 3 Nov 2026: memilih **judul perikop** sebagai pelengkapan Alkitab
     berikutnya (sesudah K86 🔀 Paralel).

   📐 BENTUK YANG DIPAKAI — judul DISISIPKAN di atas ayatnya (seperti Alkitab cetak):

       ┌──────────────────────────────────────────────┐
       │ Pelayanan Yohanes Pembaptis                  │  ← judul bagian (t1)
       │ ─────────────────────────────────────────    │
       │ 1  Inilah permulaan Injil tentang Yesus …    │
       │ 2  seperti yang tertulis dalam kitab …       │
       │ Yohanes Membaptis Yesus                      │  ← judul bagian berikut
       │ ─────────────────────────────────────────    │
       │ 9  Pada saat itu, Yesus datang dari …        │
       └──────────────────────────────────────────────┘

   ⚠️ TIDAK ADA TOMBOL DI NAVBAR — diukur 3 Nov 2026: navbar sudah **9 tombol**
      dan pas **324 = 324 px**; menambah tombol ke-10 membuatnya meluber.
      Judul perikop memang **selalu berguna**, jadi tidak perlu sakelar cepat —
      ON/OFF ada di halaman keterangan plugin (kontrak `pilihanTampil`).

   ⚠️ ATURAN (pelajaran K80): pendaftaran penghias dilakukan SAAT MODUL DIMUAT,
      ❌ jangan menunggu data siap.

   ⚠️ ATURAN (pelajaran K55d/K81): `bersihkan()` WAJIB membuang penanda
      `dataset` — kalau tidak, plugin dipasang ulang ⇒ tidak pernah menghias lagi.
   ============================================================ */

window.ANodesPerikopTampilan = (function () {
  'use strict';

  const VERSI = 'v3Nov-a';
  const KUNCI_CARA = 'anodes-perikop-cara';   // 'tampil' (bawaan) | 'mati'
  const KELAS_JUDUL = 'pk-judul';
  const KELAS_KAKI = 'pk-kaki';

  let cara = null;

  function mesin() { return window.ANodesPerikop || null; }
  function tampilAlkitab() { return window.ANodesAlkitabTampilan || null; }

  function pluginAktif() {
    return !!(window.ANodesPlugin && typeof window.ANodesPlugin.dipasang === 'function'
      && window.ANodesPlugin.dipasang('perikop'));
  }

  // ------------------------------------------------------------
  // keadaan cara tampil
  // ------------------------------------------------------------
  function caraTampil() {
    if (cara !== null) return cara;
    let v = null;
    try { v = localStorage.getItem(KUNCI_CARA); } catch (e) {}
    cara = (v === 'mati') ? 'mati' : 'tampil';
    return cara;
  }

  function simpanCaraTampil(nilai) {
    cara = (nilai === 'mati') ? 'mati' : 'tampil';
    try { localStorage.setItem(KUNCI_CARA, cara); } catch (e) {}
  }

  function pilihCara(id) {
    simpanCaraTampil(id);
    gambarUlangPasal();
    if (window.ANodesEditor && window.ANodesEditor.toast) {
      try {
        window.ANodesEditor.toast(cara === 'mati'
          ? '📖 Judul perikop dimatikan'
          : '📖 Judul perikop dinyalakan');
      } catch (e) {}
    }
    return cara;
  }

  function sedangTampil() { return caraTampil() === 'tampil'; }

  // ------------------------------------------------------------
  // gambar ulang pasal (dipakai sesudah cara diganti)
  // ------------------------------------------------------------
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

    bersihkanHiasan(isi);

    if (!sedangTampil()) return;

    const m = mesin();
    if (!m || !m.siap || !m.siap()) {
      m && m.muat && m.muat();
      return;
    }

    const daftar = m.pasal(ctx.kitab, ctx.pasal);
    if (!daftar.length) return;

    let jumlah = 0;
    daftar.forEach(x => {
      const baris = isi.querySelector('.ayat-baca[data-ayat="' + x.ayat + '"]');
      if (!baris) return;

      const d = document.createElement('div');
      d.className = KELAS_JUDUL + (x.t >= 2 ? ' pk-sub' : '');
      d.textContent = x.j;
      d.title = 'Judul bagian dari AYT (Alkitab Yang Terbuka)';
      baris.parentNode.insertBefore(d, baris);
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
    isi.querySelectorAll('.' + KELAS_JUDUL).forEach(e => e.remove());
    isi.querySelectorAll('.' + KELAS_KAKI).forEach(e => e.remove());
  }

  // ------------------------------------------------------------
  // SIKLUS PLUGIN
  // ------------------------------------------------------------
  function siapkanOtomatis() {
    if (!pluginAktif()) return;
    const T = tampilAlkitab();
    if (T && T.tambahPenghias) T.tambahPenghias(hias);
    const m = mesin();
    if (m && m.muat) m.muat();
  }

  function bersihkan() {
    const T = tampilAlkitab();
    if (T && T.lepasPenghias) T.lepasPenghias(hias);
    bersihkanHiasan(document.getElementById('baca-isi'));
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
    hias,
    caraTampil,
    simpanCaraTampil,
    pilihCara,
    sedangTampil,
    gambarUlangPasal,
    _kunciCara: KUNCI_CARA
  };
})();
