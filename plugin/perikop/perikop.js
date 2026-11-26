/* ============================================================
   ANodes — plugin/perikop/perikop.js
   MESIN plugin 📖 Judul Perikop   — K99

   Data: plugin/perikop/data/perikop.js
         (dibangun tools/siapkan-data-perikop.js — JANGAN diedit tangan)

   Sumber: eBible.org — indayt (Alkitab Yang Terbuka, YLSA-AYT 2011–2024)
           Lisensi CC BY-NC 4.0 · dipakai untuk pemakaian pribadi (non-komersial).

   Bentuk data: { meta, perikop: { '41.1.9': { j: 'Yohanes Membaptis Yesus', t: 1 } } }
     j = judul · t = tingkat (1 = bagian, 2 = sub-bagian)

   Simpanan: IndexedDB `anodes-plugin-db` / toko `data` / kunci `perikop`.
   ⚠️ `meta.sidik` WAJIB dibandingkan — kalau beda, simpanan lama DIBUANG
      (pelajaran K45: sidik lama menutupi data baru).
   ============================================================ */

window.ANodesPerikop = (function () {
  'use strict';

  const VERSI = 'v3Nov-a';
  const DB_NAMA = 'anodes-plugin-db';
  const DB_TOKO = 'data';
  const KUNCI = 'perikop';

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
      const dariBerkas = window.ANodesPerikopData || null;

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

  /** keterangan lisensi untuk kaki halaman */
  function lisensi() {
    if (!data || !data.meta) return '';
    return 'Judul perikop: Alkitab Yang Terbuka (AYT) © YLSA-AYT · ' + data.meta.lisensi;
  }

  /** satu ayat → { j, t } atau null */
  function ayat(noKitab, noPasal, noAyat) {
    if (!siapkah()) return null;
    return data.perikop[noKitab + '.' + noPasal + '.' + noAyat] || null;
  }

  /** judul untuk satu ayat (string) atau '' */
  function judul(noKitab, noPasal, noAyat) {
    const p = ayat(noKitab, noPasal, noAyat);
    return p ? p.j : '';
  }

  /**
   * seluruh judul satu pasal → [{ ayat, j, t }] urut nomor ayat.
   * Satu panggilan per pasal (❌ jangan panggil `ayat()` berulang).
   */
  function pasal(noKitab, noPasal) {
    if (!siapkah()) return [];
    const awalan = noKitab + '.' + noPasal + '.';
    const hasil = [];
    Object.keys(data.perikop).forEach(k => {
      if (k.indexOf(awalan) !== 0) return;
      const no = Number(k.slice(awalan.length));
      if (!no) return;
      const p = data.perikop[k];
      hasil.push({ ayat: no, j: p.j, t: p.t || 1 });
    });
    hasil.sort((a, b) => a.ayat - b.ayat);
    return hasil;
  }

  /** peta { noAyat: judul } satu pasal */
  function petaPasal(noKitab, noPasal) {
    const hasil = {};
    pasal(noKitab, noPasal).forEach(x => { hasil[x.ayat] = x.j; });
    return hasil;
  }

  function jumlah() { return data && data.meta ? data.meta.jumlah : 0; }

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
      && window.ANodesPlugin.dipasang('perikop')) {
      muat();
    }
  }

  return {
    VERSI,
    muat,
    siap: siapkah,
    meta,
    versi,
    lisensi,
    ayat,
    judul,
    pasal,
    petaPasal,
    jumlah,
    ketikaSiap,
    padaSiap,
    saatSiap,
    dipasang,
    saatDilepas,
    siapkanOtomatis
  };
})();
