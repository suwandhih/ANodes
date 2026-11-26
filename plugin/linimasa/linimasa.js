/* ============================================================
   ANodes — plugin/linimasa/linimasa.js
   MESIN plugin 🕒 Linimasa Sejarah   — K87 (3 Nov 2026)

   Data: plugin/linimasa/data/linimasa.js
         (dibangun tools/siapkan-data-linimasa.js — JANGAN diedit tangan)

   Sumber: robertrouse/theographic-bible-metadata — CC-BY-SA-4.0
           https://github.com/robertrouse/theographic-bible-metadata
           Terjemahan judul & bagian ke Indonesia: ANodes (ditulis tangan).

   Bentuk data:
     { meta:{jumlah,tahunAwal,tahunAkhir,jumlahAyat,sidik,lisensi,sumber},
       era:[{k:−4200, s:−2000, n:'Penciptaan & bapa leluhur'}],
       bagian:[{dari:'Lifetime of Adam', ke:'Masa hidup Adam'}],
       peristiwa:[{i:1, t:−4003, j:'Penciptaan segala sesuatu', b:'', e:−4200,
                   a:[[1,1,1],[1,1,2], …] }] }
     i = nomor urut · t = tahun (negatif = SM) · j = judul Indonesia
     b = bagian (Indonesia) · e = kunci zaman · a = rujukan ayat [kitab,pasal,ayat]

   Simpanan: IndexedDB `anodes-plugin-db` / toko `data` / kunci `linimasa`.
   ⚠️ `meta.sidik` WAJIB dibandingkan — kalau beda, simpanan lama DIBUANG
      (pelajaran K45: sidik lama menutupi data baru).
   ============================================================ */

window.ANodesLinimasa = (function () {
  'use strict';

  const VERSI = 'v3Nov-a';
  const DB_NAMA = 'anodes-plugin-db';
  const DB_TOKO = 'data';
  const KUNCI = 'linimasa';

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
      const dariBerkas = window.ANodesLinimasaData || null;

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
    while (tungguSiap.length) { try { tungguSiap.shift()(); } catch (e) {} }
    pendengar.slice().forEach(fn => { try { fn(); } catch (e) {} });
  }

  // ------------------------------------------------------------
  // API baca
  // ------------------------------------------------------------
  function siapkah() { return siap && !!data; }
  function meta() { return data ? data.meta : null; }
  function versi() { return VERSI; }
  function era() { return data ? data.era : []; }
  function bagian() { return data ? data.bagian : []; }

  function lisensi() {
    return 'Linimasa: Theographic Bible Metadata · CC-BY-SA-4.0 · terjemahan Indonesia ANodes';
  }

  /** seluruh peristiwa (array apa adanya, urut tahun) */
  function semua() { return data ? data.peristiwa : []; }

  /** 1 peristiwa menurut nomor urut 1..n */
  function nomor(n) {
    if (!siapkah()) return null;
    return data.peristiwa[n - 1] || null;
  }

  /**
   * saring peristiwa.
   * @param {{zaman?:number|null, kata?:string}} opsi
   *   zaman = kunci era (`k`), null = semua
   *   kata  = teks bebas (judul / bagian), tanpa beda huruf besar-kecil
   */
  function daftar(opsi) {
    if (!siapkah()) return [];
    const o = opsi || {};
    const kata = String(o.kata || '').trim().toLowerCase();
    return data.peristiwa.filter(x => {
      if (o.zaman !== null && o.zaman !== undefined && x.e !== o.zaman) return false;
      if (kata && (x.j + ' ' + x.b).toLowerCase().indexOf(kata) < 0) return false;
      return true;
    });
  }

  /** jumlah peristiwa per zaman → { '-4200': 63, … } */
  function hitungZaman() {
    const hasil = {};
    if (!siapkah()) return hasil;
    data.era.forEach(e => { hasil[e.k] = 0; });
    data.peristiwa.forEach(x => { hasil[x.e] = (hasil[x.e] || 0) + 1; });
    return hasil;
  }

  function eraUntuk(t) {
    if (!siapkah()) return null;
    return data.era.find(e => t >= e.k && t < e.s) || null;
  }

  /** label tahun untuk tampilan: −4003 → '4003 SM' · 57 → '57 M' */
  function labelTahun(t) {
    const n = Number(t);
    if (!Number.isFinite(n)) return '';
    return n < 0 ? Math.abs(n) + ' SM' : n + ' M';
  }

  function jumlah() { return data && data.meta ? data.meta.jumlah : 0; }

  function ketikaSiap(fn) {
    if (typeof fn !== 'function') return;
    if (siapkah()) { try { fn(); } catch (e) {} return; }
    tungguSiap.push(fn);
  }

  function padaSiap(fn) { if (typeof fn === 'function') pendengar.push(fn); }

  function saatSiap(tugas) {
    if (siapkah()) return Promise.resolve(tugas ? tugas() : null);
    return muat().then(() => (tugas ? tugas() : null));
  }

  // ------------------------------------------------------------
  // siklus plugin
  // ------------------------------------------------------------
  function dipasang() { return muat(); }

  function saatDilepas() {
    data = null;
    siap = false;
    memuat = null;
    tungguSiap.length = 0;
    pendengar.length = 0;
  }

  function siapkanOtomatis() {
    if (window.ANodesPlugin && typeof window.ANodesPlugin.dipasang === 'function'
      && window.ANodesPlugin.dipasang('linimasa')) {
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
    era,
    bagian,
    semua,
    nomor,
    daftar,
    hitungZaman,
    eraUntuk,
    labelTahun,
    jumlah,
    ketikaSiap,
    padaSiap,
    saatSiap,
    dipasang,
    saatDilepas,
    siapkanOtomatis
  };
})();