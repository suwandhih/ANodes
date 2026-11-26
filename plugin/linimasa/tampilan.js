/* ============================================================
   ANodes — plugin/linimasa/tampilan.js
   TAMPILAN plugin 🕒 Linimasa Sejarah   — K87 (3 Nov 2026)

   HALAMAN ke-11 (`#linimasa-halaman`) — anak `body`
     ⚠️ WAJIB anak `body`; kalau di dalam #app-utama ⇒ ikut tersembunyi (K8).

   SUSUNAN:
     ┌──────────────────────────────────────────────────┐
     │ [🏠] 🕒 LINIMASA SEJARAH     450 peristiwa · 57 M │
     ├──────────────────────────────────────────────────┤
     │ [Semua] [Penciptaan] [Bapa bangsa] … [Gereja]     │ ← saring zaman
     │ [🔍 cari peristiwa…]                             │
     ├──────────────────────────────────────────────────┤
     │ 4003 SM  Penciptaan segala sesuatu                │
     │          Kej 1:1 · Kej 1:2 · Kej 1:3 …            │ ← chip ayat
     │ 3874 SM  Kain membunuh Habel                     │
     │ 2347 SM  Air bah mulai turun                     │
     └──────────────────────────────────────────────────┘

   ❌ TIDAK menyentuh mesin Alkitab — memakai `bukaRentang()` yang SUDAH ADA
      (pelajaran K80/K96: jangan menambah mesin baru untuk lompat ke ayat).

   ⚠️ ATURAN (pelajaran K81b): halaman yang “menimpa” WAJIB menyembunyikan
      DIRINYA SENDIRI sebelum lompat — `bukaRentang()` hanya mengurus
      #app-utama & #baca-alkitab.
   ============================================================ */

window.ANodesLinimasaTampilan = (function () {
  'use strict';

  const VERSI = 'v3Nov-a';
  const KUNCI_ZAMAN = 'anodes-linimasa-zaman';   // 'semua' | kunci era ('-4200' …)
  const KUNCI_KATA = 'anodes-linimasa-kata';

  const MAKS_AYAT_TAMPIL = 6;   // chip ayat yang digambar (sisanya “+n lagi”)

  let asalHalaman = null;
  let zamanAktif = null;
  let kataAktif = '';
  let terbuka = false;

  function mesin() { return window.ANodesLinimasa || null; }
  function tampilAlkitab() { return window.ANodesAlkitabTampilan || null; }

  function hal() { return document.getElementById('linimasa-halaman'); }
  function wadahIsi() { return document.getElementById('lm-isi'); }
  function wadahSaring() { return document.getElementById('lm-saring'); }
  function elVersi() { return document.getElementById('lm-versi'); }

  function pluginAktif() {
    const P = window.ANodesPlugin;
    if (!P || !P.dipasang) return false;
    try { return P.dipasang('linimasa'); } catch (e) { return false; }
  }

  function toast(teks) {
    try {
      const P = window.ANodesPlugin;
      if (P && P.toast) { P.toast(teks); return; }
    } catch (e) {}
    console.log(teks);
  }

  // ------------------------------------------------------------
  // keadaan saringan (diingat antar kunjungan)
  // ------------------------------------------------------------
  function muatKeadaan() {
    let z = null, k = null;
    try { z = localStorage.getItem(KUNCI_ZAMAN); k = localStorage.getItem(KUNCI_KATA); } catch (e) {}
    zamanAktif = (z === null || z === 'semua' || z === '') ? null : Number(z);
    if (!Number.isFinite(zamanAktif)) zamanAktif = null;
    kataAktif = k || '';
  }

  function simpanKeadaan() {
    try {
      localStorage.setItem(KUNCI_ZAMAN, zamanAktif === null ? 'semua' : String(zamanAktif));
      localStorage.setItem(KUNCI_KATA, kataAktif);
    } catch (e) {}
  }

  // ------------------------------------------------------------
  // BUKA / TUTUP HALAMAN
  // ------------------------------------------------------------
  function bukaHalaman() {
    const h = hal();
    if (!h) return false;
    if (!pluginAktif()) { toast('💡 Pasang plugin 🕒 Linimasa Sejarah dahulu'); return false; }

    asalHalaman = null;
    document.querySelectorAll('body > .app').forEach(el => {
      if (el !== h && !el.hidden && !asalHalaman) asalHalaman = el.id;
    });

    if (window.ANodesEditor && window.ANodesEditor.ingatPosisi) {
      try { window.ANodesEditor.ingatPosisi(); } catch (e) {}
    }
    if (window.ANodesKamusTampilan && window.ANodesKamusTampilan.dariKamus &&
        window.ANodesKamusTampilan.dariKamus()) {
      try { window.ANodesKamusTampilan.pulihDariAlkitab(); } catch (e) {}
    }

    document.querySelectorAll('body > .app').forEach(el => { if (el !== h) el.hidden = true; });
    h.hidden = false;
    terbuka = true;

    muatKeadaan();
    gambar();
    return true;
  }

  function tutupHalaman() {
    const h = hal();
    if (h) h.hidden = true;
    terbuka = false;

    const tujuan = asalHalaman;
    asalHalaman = null;

    if (tujuan && tujuan !== 'app-utama') {
      const t = document.getElementById(tujuan);
      if (t) {
        t.hidden = false;
        if (tujuan === 'baca-alkitab') {
          const A = tampilAlkitab();
          if (A && A.bukaHalaman) { try { A.bukaHalaman(); } catch (e) {} }
        }
        return true;
      }
    }

    const utama = document.getElementById('app-utama');
    if (utama) utama.hidden = false;
    if (window.ANodesEditor && window.ANodesEditor.pulihPosisi) {
      try { window.ANodesEditor.pulihPosisi(); } catch (e) {}
    }
    return true;
  }

  // ------------------------------------------------------------
  // GAMBAR — kepala, saringan, daftar
  // ------------------------------------------------------------
  function gambar() {
    const m = mesin();
    if (!m) return;
    if (!m.siap || !m.siap()) {
      m.muat && m.muat();
      m.ketikaSiap(() => { if (terbuka) gambar(); });
      const isi = wadahIsi();
      if (isi) isi.innerHTML = '<div class="lm-kosong">⏳ Memuat linimasa…</div>';
      return;
    }

    gambarKepala(m);
    gambarSaring(m);
    gambarDaftar(m);
  }

  function gambarKepala(m) {
    const el = elVersi();
    if (!el) return;
    const mt = m.meta();
    el.textContent = m.jumlah() + ' peristiwa · ' +
      m.labelTahun(mt.tahunAwal) + ' – ' + m.labelTahun(mt.tahunAkhir);
  }

  function gambarSaring(m) {
    const w = wadahSaring();
    if (!w) return;
    w.innerHTML = '';

    const baris = document.createElement('div');
    baris.className = 'lm-chip-baris';

    const semuaBtn = document.createElement('button');
    semuaBtn.className = 'lm-chip' + (zamanAktif === null ? ' lm-aktif' : '');
    semuaBtn.textContent = 'Semua (' + m.jumlah() + ')';
    semuaBtn.title = 'Tampilkan seluruh peristiwa';
    semuaBtn.addEventListener('click', () => {
      zamanAktif = null;
      simpanKeadaan();
      gambarSaring(m);
      gambarDaftar(m);
    });
    baris.appendChild(semuaBtn);

    const hitung = m.hitungZaman();
    m.era().forEach(e => {
      const b = document.createElement('button');
      b.className = 'lm-chip' + (zamanAktif === e.k ? ' lm-aktif' : '');
      b.textContent = e.n + ' (' + (hitung[e.k] || 0) + ')';
      b.title = m.labelTahun(e.k) + ' – ' + m.labelTahun(e.s);
      b.addEventListener('click', () => {
        zamanAktif = (zamanAktif === e.k) ? null : e.k;
        simpanKeadaan();
        gambarSaring(m);
        gambarDaftar(m);
      });
      baris.appendChild(b);
    });

    w.appendChild(baris);

    const cari = document.createElement('div');
    cari.className = 'lm-cari-baris';
    const inp = document.createElement('input');
    inp.type = 'search';
    inp.id = 'lm-cari';
    inp.className = 'lm-cari';
    inp.placeholder = '🔍 Cari peristiwa…';
    inp.value = kataAktif;
    inp.addEventListener('input', () => {
      kataAktif = inp.value;
      simpanKeadaan();
      gambarDaftar(m, true);
    });
    cari.appendChild(inp);
    w.appendChild(cari);
  }

  function gambarDaftar(m, janganGambarUlangSaring) {
    const w = wadahIsi();
    if (!w) return;

    const daftar = m.daftar({ zaman: zamanAktif, kata: kataAktif });

    if (!daftar.length) {
      w.innerHTML = '<div class="lm-kosong">' +
        (kataAktif ? '🔍 Tidak ada peristiwa yang memuat “' + aman(kataAktif) + '”.' :
          'Tidak ada peristiwa pada zaman ini.') + '</div>';
      return;
    }

    const frag = document.createDocumentFragment();
    let zamanTerakhir = null;

    daftar.forEach(x => {
      if (x.e !== zamanTerakhir && zamanAktif === null) {
        const e = m.era().find(z => z.k === x.e);
        if (e) {
          const kp = document.createElement('div');
          kp.className = 'lm-zaman';
          kp.textContent = e.n + ' · ' + m.labelTahun(e.k) + ' – ' + m.labelTahun(e.s);
          frag.appendChild(kp);
        }
        zamanTerakhir = x.e;
      }

      frag.appendChild(kartuPeristiwa(m, x));
    });

    w.innerHTML = '';
    w.appendChild(frag);
    w.appendChild(kaki(m));
  }

  function kartuPeristiwa(m, x) {
    const d = document.createElement('div');
    d.className = 'lm-peristiwa';
    d.dataset.peristiwa = String(x.i);

    const kepala = document.createElement('div');
    kepala.className = 'lm-kepala';

    const thn = document.createElement('span');
    thn.className = 'lm-tahun';
    thn.textContent = m.labelTahun(x.t);
    kepala.appendChild(thn);

    const judul = document.createElement('span');
    judul.className = 'lm-judul';
    judul.textContent = x.j;
    kepala.appendChild(judul);

    d.appendChild(kepala);

    if (x.b) {
      const bg = document.createElement('div');
      bg.className = 'lm-bagian';
      bg.textContent = '↳ ' + x.b;
      d.appendChild(bg);
    }

    const ayat = document.createElement('div');
    ayat.className = 'lm-ayat';
    const tampil = x.a.slice(0, MAKS_AYAT_TAMPIL);
        tampil.forEach(r => {
          const c = chipAyat(r);
          if (c) ayat.appendChild(c);
        });
    if (x.a.length > tampil.length) {
      const sisa = document.createElement('span');
      sisa.className = 'lm-ayat-sisa';
      sisa.textContent = '+' + (x.a.length - tampil.length) + ' ayat';
      sisa.title = 'Ayat lainnya dibuka satu per satu lewat chip — yang ditampilkan ' +
        MAKS_AYAT_TAMPIL + ' pertama';
      ayat.appendChild(sisa);
    }
    d.appendChild(ayat);

    return d;
  }

  function chipAyat(r) {
    const [k, p, a] = r;
    const b = document.createElement('button');
    b.className = 'lm-ayat-chip';
    b.dataset.ref = k + '.' + p + '.' + a;

    const A = window.ANodesAlkitab;
    let label = k + ' ' + p + ':' + a;
        if (A && A.ambilAyatBanyak && A.siap && A.siap()) {
      try {
            const r = A.ambilAyatBanyak([[k, p, a, a]])[0];
            if (!r) return null;   // data siap tetapi rujukan tidak ada ⇒ chip tidak dibuat
            if (r.labelPendek) label = r.labelPendek;
          } catch (e) {}
        }
        b.textContent = label;
        b.title = 'Buka ' + label + ' di halaman baca Alkitab';
        b.addEventListener('click', () => lompatAyat(k, p, a));
        return b;
  }

  function lompatAyat(k, p, a) {
    const T = tampilAlkitab();
    if (!T) { toast('💡 Pasang plugin 📖 Alkitab dahulu'); return; }
    const A = window.ANodesAlkitab;
    if (!A || !A.siap || !A.siap()) { toast('⏳ Menyiapkan data Alkitab…'); return; }

    // halaman ini menyembunyikan DIRINYA SENDIRI (pelajaran K81b)
    const h = hal();
    if (h) h.hidden = true;
    terbuka = false;

        // 🏠 dari Alkitab WAJIB kembali ke HALAMAN LINIMASA, bukan ke catatan
            // (pola SAMA seperti 🔖 Bookmark — K56/K81b). Yang memutuskan = Alkitab
            // lewat `daftarPemulihHalaman`, jadi Alkitab tidak perlu tahu halaman ini.
            if (typeof T.ingatAsalAyat === 'function') {
              const w = wadahIsi();
              const gulir = w ? w.scrollTop : 0;
              try { T.ingatAsalAyat({ jenis: 'linimasa', gulir: gulir }); } catch (e) {}
            }

            if (T.bukaHalaman) { try { T.bukaHalaman(); } catch (e) {} }
    if (T.bukaRentang) {
      try { T.bukaRentang({ no: k, pasal: p, ayat1: a, ayat2: a }); } catch (e) {}
    } else if (T.gambarPasal) {
      try { T.gambarPasal(k, p, a, true); } catch (e) {}
    }
  }

  function kaki(m) {
    const d = document.createElement('div');
    d.className = 'lm-kaki';
    d.textContent = m.lisensi();
    return d;
  }

  function aman(t) {
    return String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  // ------------------------------------------------------------
  // DIPANGGIL PLUGIN ALKITAB saat 🏠 ditekan dari halaman bacanya
  // ------------------------------------------------------------
  function pulihDariAlkitab() {
    const h = hal();
    if (!h) return false;
    document.querySelectorAll('body > .app').forEach(el => { if (el !== h) el.hidden = true; });
    h.hidden = false;
    terbuka = true;
    gambar();
    return true;
  }

  function daftarPemulih() {
    const T = tampilAlkitab();
    if (T && T.daftarPemulihHalaman) {
      try { T.daftarPemulihHalaman('linimasa', pulihDariAlkitab); } catch (e) {}
    }
    return true;
  }

  // ------------------------------------------------------------
  // SIKLUS PLUGIN
  // ------------------------------------------------------------
  function siapkanOtomatis() {
    if (!pluginAktif()) return;
    const m = mesin();
    if (m && m.muat) m.muat();
    daftarPemulih();
  }

  function bersihkan() {
    const h = hal();
    if (h) h.hidden = true;
    terbuka = false;
    const isi = wadahIsi();
    if (isi) isi.innerHTML = '';
    const s = wadahSaring();
    if (s) s.innerHTML = '';
  }

  function versi() { return VERSI; }

  // ------------------------------------------------------------
  // PENGAT PENGIKAT
  // ------------------------------------------------------------
  function pasangPengait() {
    const kembali = document.getElementById('lm-kembali');
    if (kembali && !kembali.dataset.siap) {
      kembali.dataset.siap = '1';
      kembali.addEventListener('click', tutupHalaman);
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && terbuka) { e.preventDefault(); tutupHalaman(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { pasangPengait(); siapkanOtomatis(); });
  } else {
    setTimeout(() => { pasangPengait(); siapkanOtomatis(); }, 0);
  }

  return {
    VERSI,
    versi,
    bukaHalaman,
    tutupHalaman,
    buka: bukaHalaman,
    tutup: tutupHalaman,
    terbuka: () => terbuka,
    gambar,
    siapkanOtomatis,
    bersihkan,
    pulihDariAlkitab,
    daftarPemulih,
    zamanAktif: () => zamanAktif,
    kataAktif: () => kataAktif,
    _kunciZaman: KUNCI_ZAMAN,
    _kunciKata: KUNCI_KATA
  };
})();