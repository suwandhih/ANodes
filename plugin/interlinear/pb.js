/* ============================================================
   ANodes — plugin/interlinear/pb.js
   MESIN interlinear Perjanjian Baru (Kisah 26 s/d Wahyu)   — K85 tahap 2

   ⚠️ SEBAB BERKAS INI ADA (diukur 3 Nov 2026, ❌ bukan diduga):
     Sumber `idkjv` (K85 tahap 1) HANYA punya 4 Injil + Kisah 1–25.
     ⇒ Kisah 26 s/d Wahyu (3.271 ayat) TIDAK punya teks Indonesia per ayat.
     ⇒ bentuk kolomnya **B**: kata Yunani + alih huruf + arti Indonesia
       (❌ bukan “kata Indonesia ⇄ kata Yunani” seperti 4 Injil).

   Data: plugin/interlinear/data/pb.js
         (dibangun tools/siapkan-data-pb.js — JANGAN diedit tangan)

   Sumber: STEPBible TAGNT (CC BY 4.0 · STEPBible.org / Tyndale House
           Cambridge) + Strong's Greek (Public Domain).

   Simpanan: IndexedDB `anodes-plugin-db` / toko `data` / kunci `pb`.
   ⚠️ `meta.sidik` WAJIB dibandingkan — kalau beda, simpanan lama DIBUANG
      (pelajaran K45: sidik lama menutupi data baru).
   ============================================================ */

window.ANodesPb = (function () {
  'use strict';

  const VERSI = 'v3Nov-d';
  const DB_NAMA = 'anodes-plugin-db';
  const DB_TOKO = 'data';
  const KUNCI = 'pb';

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
      const dariBerkas = window.ANodesPbData || null;

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

  /** kata-kata ber-Strong satu ayat → [[kataYunani, [G…], alihHuruf], …] */
  function ayat(noKitab, noPasal, noAyat) {
    if (!siapkah()) return null;
    const kunci = Number(noKitab) + '.' + Number(noPasal) + '.' + Number(noAyat);
    return (data.ayat && data.ayat[kunci]) ? data.ayat[kunci] : null;
  }

  function adaAyat(noKitab, noPasal, noAyat) {
    return !!ayat(noKitab, noPasal, noAyat);
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

  /** entri lexikon satu nomor Strong → { l, t, i[], e } atau null */
  function strong(nomor) {
    if (!siapkah()) return null;
    const n = String(nomor || '').toUpperCase();
    return (data.lex && data.lex[n]) ? data.lex[n] : null;
  }

  /** arti Indonesia pertama (atau '') */
  function arti(nomor) {
    const e = strong(nomor);
    if (!e || !e.i || !e.i.length) return '';
    return e.i[0];
  }

  function jumlahAyat() { return data && data.meta ? data.meta.jumlahAyat : 0; }
  function jumlahStrong() { return data && data.meta ? data.meta.jumlahStrong : 0; }
  function jumlahArti() { return data && data.meta ? data.meta.jumlahArti : 0; }

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
    strong,
    arti,
    jumlahAyat,
    jumlahStrong,
    jumlahArti,
    ketikaSiap,
    padaSiap,
    saatSiap,
    dipasang,
    saatDilepas,
    siapkanOtomatis
  };
})();
