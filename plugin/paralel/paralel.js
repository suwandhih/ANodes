/* ============================================================
   ANodes — plugin/paralel/paralel.js
   MESIN plugin 🔀 Paralel Terjemahan (TB ⇄ AYT)   — K86

   💬 Bapak 3 Nov 2026: memilih **AYT** sebagai versi pembanding
     (TSI di rencana ternyata hanya 48 kitab — 18 kitab PL tidak ada).

   Data: plugin/paralel/data/paralel.js
         (dibangun tools/siapkan-data-paralel.js — JANGAN diedit tangan)

   Sumber: eBible.org — indayt (Alkitab Yang Terbuka, YLSA-AYT 2011–2024)
           Lisensi CC BY-NC 4.0 · dipakai untuk pemakaian pribadi (non-komersial).

   Simpanan: IndexedDB `anodes-plugin-db` / toko `data` / kunci `paralel`.
   ⚠️ `meta.sidik` WAJIB dibandingkan — kalau beda, simpanan lama DIBUANG
      (pelajaran K45: sidik lama menutupi data baru).
   ============================================================ */

window.ANodesParalel = (function () {
  'use strict';

  const VERSI = 'v3Nov-a';
  const DB_NAMA = 'anodes-plugin-db';
  const DB_TOKO = 'data';
  const KUNCI = 'paralel';

  let data = null;
  let siap = false;
  let memuat = null;

  const tungguSiap = [];
  const pendengar = [];

  function db() {
    return new Promise((selesai, gagal) => {
      let req;
      try { req = indexedDB.open(DB_NAMA, 1); } catch (e) { gagal(e); return; }
      req.onupgradeneeded = () => {
        const d = req.result;
        if (!d.objectStoreNames.contains(DB_TOKO)) d.createObjectStore(DB_TOKO);
      };
      req.onsuccess = () => selesai(req.result);
      req.onerror = () => gagal(req.error);
    });
  }

  function dbAmbil(kunci) {
    return db().then(d => new Promise((selesai, gagal) => {
      const tx = d.transaction(DB_TOKO, 'readonly');
      const r = tx.objectStore(DB_TOKO).get(kunci);
      r.onsuccess = () => selesai(r.result || null);
      r.onerror = () => gagal(r.error);
    })).catch(() => null);
  }

  function dbSimpan(kunci, nilai) {
    return db().then(d => new Promise(selesai => {
      const tx = d.transaction(DB_TOKO, 'readwrite');
      tx.objectStore(DB_TOKO).put(nilai, kunci);
      tx.oncomplete = () => selesai(true);
      tx.onerror = () => selesai(false);
    })).catch(() => false);
  }

  // ------------------------------------------------------------
  // muat — BERKAS DATA lebih dulu, simpanan hanya kalau sidik SAMA
  // ------------------------------------------------------------
  function muat(lapor) {
    if (memuat) return memuat;
    const kabar = typeof lapor === 'function' ? lapor : function () {};

    memuat = new Promise(selesai => {
      const dariBerkas = window.ANodesParalelData || null;

      if (!dariBerkas) {
        dbAmbil(KUNCI).then(simpanan => {
          if (simpanan && simpanan.meta) {
            data = simpanan;
            tandaiSiap();
            kabar('dari simpanan');
          } else {
            kabar('data tidak ada');
          }
          selesai(data);
        });
        return;
      }

      data = dariBerkas;
      tandaiSiap();
      kabar('dari berkas');

      dbAmbil(KUNCI).then(simpanan => {
        const baru = data.meta && data.meta.sidik;
        const lama = simpanan && simpanan.meta && simpanan.meta.sidik;
        if (lama !== baru) dbSimpan(KUNCI, data);
      });

      selesai(data);
    });

    return memuat;
  }

  function tandaiSiap() {
    if (siap) return;
    siap = true;
    while (tungguSiap.length) {
      try { tungguSiap.shift()(); } catch (e) {}
    }
    pendengar.slice().forEach(fn => { try { fn(); } catch (e) {} });
  }

  // ------------------------------------------------------------
  // API baca
  // ------------------------------------------------------------
  function siapkah() { return siap && !!data; }
  function meta() { return data ? data.meta : null; }
  function versi() { return VERSI; }

  /** nama singkat terjemahan pembanding, mis. 'AYT' */
  function nama() { return data && data.meta ? data.meta.terjemahan : 'AYT'; }

  /** keterangan lisensi untuk kaki halaman */
  function lisensi() {
    if (!data || !data.meta) return '';
    return data.meta.nama + ' © YLSA-AYT · ' + data.meta.lisensi;
  }

  function kitab(noKitab) {
    if (!siapkah()) return null;
    return data.kitab[Number(noKitab) - 1] || null;
  }

  /** satu ayat pembanding → { no, teks, gabung? } atau null */
  function ayat(noKitab, noPasal, noAyat) {
    if (!siapkah()) return null;
    const k = kitab(noKitab);
    if (!k) return null;
    const p = k.pasal.find(x => x.no === Number(noPasal));
    if (!p) return null;
    return p.ayat.find(x => x.no === Number(noAyat)) || null;
  }

  function adaAyat(noKitab, noPasal, noAyat) {
    return !!ayat(noKitab, noPasal, noAyat);
  }

  /** seluruh ayat satu pasal → [{no, teks}] (kosong kalau tidak ada) */
  function pasal(noKitab, noPasal) {
    if (!siapkah()) return [];
    const k = kitab(noKitab);
    if (!k) return [];
    const p = k.pasal.find(x => x.no === Number(noPasal));
    return p ? p.ayat : [];
  }

  /** peta { noAyat: teks } satu pasal — satu panggilan (dipakai kolom paralel) */
  function petaPasal(noKitab, noPasal) {
    const hasil = {};
    for (const a of pasal(noKitab, noPasal)) hasil[a.no] = a.teks;
    return hasil;
  }

  function jumlahKitab() { return data && data.meta ? data.meta.jumlahKitab : 0; }
  function jumlahPasal() { return data && data.meta ? data.meta.jumlahPasal : 0; }
  function jumlahAyat() { return data && data.meta ? data.meta.jumlahAyat : 0; }

  function ketikaSiap(fn) {
    if (typeof fn !== 'function') return;
    if (siapkah()) { try { fn(); } catch (e) {} return; }
    tungguSiap.push(fn);
  }

  function padaSiap(fn) {
    if (typeof fn === 'function') pendengar.push(fn);
  }

  function saatSiap(tugas) {
    if (siapkah()) return Promise.resolve(tugas ? tugas() : null);
    return muat().then(() => (tugas ? tugas() : null));
  }

  // ------------------------------------------------------------
  // siklus plugin
  // ------------------------------------------------------------
  function dipasang() {
    return muat();
  }

  function saatDilepas() {
    data = null;
    siap = false;
    memuat = null;
    tungguSiap.length = 0;
    pendengar.length = 0;
  }

  function siapkanOtomatis() {
    if (window.ANodesPlugin && typeof window.ANodesPlugin.dipasang === 'function'
      && window.ANodesPlugin.dipasang('paralel')) {
      muat();
    }
  }

  return {
    VERSI,
    muat,
    siap: siapkah,
    meta,
    versi,
    nama,
    lisensi,
    kitab,
    ayat,
    adaAyat,
    pasal,
    petaPasal,
    jumlahKitab,
    jumlahPasal,
    jumlahAyat,
    ketikaSiap,
    padaSiap,
    saatSiap,
    dipasang,
    saatDilepas,
    siapkanOtomatis
  };
})();
