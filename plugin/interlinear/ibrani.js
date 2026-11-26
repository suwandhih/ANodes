/* ============================================================
   ANodes — plugin/interlinear/ibrani.js
   MESIN penjelasan Ibrani (Perjanjian Lama) → Indonesia   — K90

   ⚠️ BEDA dari `yunani.js` (K88/K89):
     • K88 = penjelasan kata YUNANI (Perjanjian Baru)
     • K89 = ✡ kata SERAPAN Ibrani/Aram di dalam PB
     • K90 = penjelasan kata IBRANI untuk seluruh PERJANJIAN LAMA

   Bentuk data SAMA dengan K88 (kata + ayat), jadi tampilannya bisa
   memakai jalur yang sama — hanya mesin & kuncinya berbeda.

   Simpanan: IndexedDB `anodes-plugin-db` / toko `data` / kunci `ibrani`.
   Data dibangun `tools/siapkan-data-ibrani.js` (JANGAN diedit tangan).
   ============================================================ */

window.ANodesIbrani = (function () {
  'use strict';

  const VERSI = 'v3Nov-a';
  const DB_NAMA = 'anodes-plugin-db';
  const DB_TOKO = 'data';
  const KUNCI = 'ibrani';

  let data = null;
  let siap = false;
  let memuat = null;

  const tungguSiap = [];    // fn dipanggil SEKALI saat data siap
  const pendengar = [];     // fn dipanggil TIAP data siap

  function db() {
    return new Promise((selesai, gagal) => {
      let req;
      try { req = indexedDB.open(DB_NAMA, 1); } catch (e) { gagal(e); return; }
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(DB_TOKO)) db.createObjectStore(DB_TOKO);
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
      const dariBerkas = window.ANodesIbraniData || null;

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

  /** nomor Strong yang penjelasannya tersedia untuk satu ayat → ['H430', …] */
  function ayat(noKitab, noPasal, noAyat) {
    if (!siapkah()) return [];
    const kunci = Number(noKitab) + '.' + Number(noPasal) + '.' + Number(noAyat);
    return (data.ayat && data.ayat[kunci]) ? data.ayat[kunci].slice() : [];
  }

  /** ada penjelasan untuk ayat ini? */
  function adaAyat(noKitab, noPasal, noAyat) {
    return ayat(noKitab, noPasal, noAyat).length > 0;
  }

  /** peta { noAyat: jumlahKata } untuk satu pasal — satu panggilan */
  function petaPasal(noKitab, noPasal) {
    if (!siapkah()) return {};
    const awalan = Number(noKitab) + '.' + Number(noPasal) + '.';
    const hasil = {};
    Object.keys(data.ayat || {}).forEach(k => {
      if (k.indexOf(awalan) !== 0) return;
      const no = Number(k.slice(awalan.length));
      if (no) hasil[no] = data.ayat[k].length;
    });
    return hasil;
  }

  /** penjelasan satu nomor Strong → { l, t, tb, kalimat, ayat[] } atau null */
  function kata(nomor) {
    if (!siapkah()) return null;
    const n = String(nomor || '').toUpperCase();
    return (data.kata && data.kata[n]) ? data.kata[n] : null;
  }

  /** semua penjelasan untuk satu ayat, urut sesuai kemunculan */
  function semuaAyat(noKitab, noPasal, noAyat) {
    return ayat(noKitab, noPasal, noAyat).map(n => {
      const k = kata(n);
      return k ? Object.assign({ no: n }, k) : null;
    }).filter(Boolean);
  }

  function jumlahKata() { return data && data.kata ? Object.keys(data.kata).length : 0; }
  function jumlahAyat() { return data && data.ayat ? Object.keys(data.ayat).length : 0; }

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
      && window.ANodesPlugin.dipasang('interlinear')) {
      muat();
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', siapkanOtomatis);
    } else {
      setTimeout(siapkanOtomatis, 0);
    }
  }

  return {
    VERSI,
    muat,
    siap: siapkah,
    meta,
    versi,
    ayat,
    adaAyat,
    petaPasal,
    kata,
    semuaAyat,
    jumlahKata,
    jumlahAyat,
    ketikaSiap,
    padaSiap,
    saatSiap,
    dipasang,
    saatDilepas,
    siapkanOtomatis
  };
})();

window.ANodesIbrani = window.ANodesIbrani;
