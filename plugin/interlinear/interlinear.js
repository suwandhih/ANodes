/* ============================================================
   ANodes — plugin/interlinear/interlinear.js
   MESIN: 🔤 Interlinear (bahasa asli + kode Strong)   — K85
   ------------------------------------------------------------
   Data: plugin/interlinear/data/interlinear.js
         (dibuat tools/siapkan-data-interlinear.js)

   Sumber:
     • tonny-kohar/idkjv — Indonesia + kode Strong · **Public Domain**
     • andysaktia/strongs-dictionary-json — lemma Yunani + arti Inggris
       (teks PD · struktur CC BY 4.0 / OpenScriptures)

   ⚠️ ARTI INDONESIA = **pemakaian nyata** (kata yang dipakai idkjv untuk
      nomor Strong itu), ❌ BUKAN terjemahan mesin. Terukur: berkas
      `strongs-greek.json` hanya punya **0** `definition.id` (semua
      `translation_status: pending`) ⇒ tidak bisa dipakai.

   Simpanan: IndexedDB `anodes-plugin-db` / toko `data` / kunci `interlinear`
   ⚠️ `meta.sidik` WAJIB dibandingkan — kalau beda, simpanan lama DIBUANG
      (pelajaran K45: sidik lama menutupi data baru).
   ============================================================ */

window.ANodesInterlinear = (function () {
  'use strict';

  const VERSI = 'v1Nov-a';
  const DB_NAMA = 'anodes-plugin-db';
  const DB_TOKO = 'data';
  const KUNCI = 'interlinear';

  let data = null;          // { meta, ayat, lex }
  let memuat = null;        // Promise
  let siap = false;
  const tungguSiap = [];    // fn yang dipanggil saat data siap
  const pendengar = [];     // fn yang dipanggil tiap data siap (boleh berkali-kali)

  // ------------------------------------------------------------
  // IndexedDB — pembantu kecil (pola sama plugin lain)
  // ------------------------------------------------------------
  function bukaDb() {
    return new Promise((selesai, gagal) => {
      if (!window.indexedDB) return gagal(new Error('IndexedDB tidak ada'));
      const req = indexedDB.open(DB_NAMA, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(DB_TOKO)) db.createObjectStore(DB_TOKO);
      };
      req.onsuccess = () => selesai(req.result);
      req.onerror = () => gagal(req.error);
    });
  }

  function dbAmbil(kunci) {
    return bukaDb().then(db => new Promise((selesai, gagal) => {
      const tx = db.transaction(DB_TOKO, 'readonly');
      const req = tx.objectStore(DB_TOKO).get(kunci);
      req.onsuccess = () => selesai(req.result || null);
      req.onerror = () => gagal(req.error);
    })).catch(() => null);
  }

  function dbSimpan(kunci, nilai) {
    return bukaDb().then(db => new Promise((selesai, gagal) => {
      const tx = db.transaction(DB_TOKO, 'readwrite');
      tx.objectStore(DB_TOKO).put(nilai, kunci);
      tx.oncomplete = () => selesai(true);
      tx.onerror = () => gagal(tx.error);
    })).catch(() => false);
  }

  // ------------------------------------------------------------
  // muat — BERKAS DATA lebih dulu, simpanan hanya kalau sidik SAMA
  // ------------------------------------------------------------
  function muat(lapor) {
    if (memuat) return memuat;
    const kabar = typeof lapor === 'function' ? lapor : function () {};

    memuat = new Promise(selesai => {
      const dariBerkas = window.ANodesInterlinearData || null;

      if (!dariBerkas) {
        // berkas data belum termuat → coba simpanan
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

      // ✅ berkas data ADA ⇒ pakai itu (paling baru)
      data = dariBerkas;
      tandaiSiap();
      kabar('dari berkas');

      // simpanan: hanya dipakai kalau sidiknya SAMA (hemat waktu buka berikutnya)
      dbAmbil(KUNCI).then(simpanan => {
        const sidikBaru = data.meta && data.meta.sidik;
        const sidikLama = simpanan && simpanan.meta && simpanan.meta.sidik;
        if (sidikLama !== sidikBaru) {
          dbSimpan(KUNCI, data);   // timpa simpanan lama
        }
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

  function kitabAda(no) {
    if (!data || !data.meta) return false;
    return (data.meta.kitab || []).some(k => Number(k.no) === Number(no));
  }

  function daftarKitab() {
    return data && data.meta ? (data.meta.kitab || []).slice() : [];
  }

  /** kata-kata ber-Strong untuk satu ayat → [[kata, [G…]], …] atau null */
  function ayat(noKitab, noPasal, noAyat) {
    if (!siapkah()) return null;
    const kunci = Number(noKitab) + '.' + Number(noPasal) + '.' + Number(noAyat);
    return data.ayat[kunci] || null;
  }

  function adaAyat(noKitab, noPasal, noAyat) {
    return !!ayat(noKitab, noPasal, noAyat);
  }

  /** peta { noAyat: jumlahKata } untuk satu pasal — satu panggilan */
  function petaPasal(noKitab, noPasal) {
    if (!siapkah()) return {};
    const awalan = Number(noKitab) + '.' + Number(noPasal) + '.';
    const hasil = {};
    Object.keys(data.ayat).forEach(k => {
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
    return data.lex[n] || null;
  }

  function jumlahAyat() { return data && data.meta ? data.meta.jumlahAyat : 0; }
  function jumlahStrong() { return data && data.meta ? data.meta.jumlahStrong : 0; }

  /** cari nomor Strong menurut kata Indonesia / lemma / alih huruf */
  function cariStrong(kata, maks) {
    if (!siapkah()) return [];
    const q = String(kata || '').trim().toLowerCase();
    if (!q) return [];
    const batas = maks || 40;
    const hasil = [];
    const kunci = Object.keys(data.lex);
    for (let i = 0; i < kunci.length && hasil.length < batas; i++) {
      const n = kunci[i];
      const e = data.lex[n];
      const cocok =
        n.toLowerCase() === q ||
        String(e.l || '').toLowerCase().indexOf(q) >= 0 ||
        String(e.t || '').toLowerCase().indexOf(q) >= 0 ||
        (e.i || []).some(x => String(x).toLowerCase().indexOf(q) >= 0);
      if (cocok) hasil.push({ nomor: n, entri: e });
    }
    return hasil;
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

  function ketikaSiap(fn) {
    if (typeof fn !== 'function') return;
    if (siapkah()) { try { fn(); } catch (e) {} return; }
    tungguSiap.push(fn);
  }

  function padaSiap(fn) {
    if (typeof fn !== 'function') return;
    pendengar.push(fn);
    if (siapkah()) { try { fn(); } catch (e) {} }
  }

  function saatSiap(fn) {
    if (siapkah()) { try { fn(); } catch (e) {} return; }
    muat();
    ketikaSiap(fn);
  }

  /** dipanggil otomatis saat halaman dibuka (pola K14/K55b) */
  function siapkanOtomatis() {
    if (!window.ANodesPlugin || typeof window.ANodesPlugin.dipasang !== 'function') return;
    if (!window.ANodesPlugin.dipasang('interlinear')) return;
    muat();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', siapkanOtomatis);
  } else {
    setTimeout(siapkanOtomatis, 0);
  }

  return {
    muat, siap: siapkah, meta, versi,
    daftarKitab, kitabAda,
    ayat, adaAyat, petaPasal, strong, cariStrong,
    jumlahAyat, jumlahStrong,
    dipasang, saatDilepas,
    ketikaSiap, padaSiap, saatSiap, siapkanOtomatis,
    _data: () => data,
    _kunci: KUNCI
  };
})();
