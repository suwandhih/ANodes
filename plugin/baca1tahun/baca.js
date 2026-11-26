/* ============================================================
   ANodes — plugin/baca1tahun/baca.js
   MESIN PLUGIN: 🗓️ Bacaan Alkitab 1 Tahun   (K96 — 3 Nov 2026)

   💬 Bapak 3 Nov 2026:
     *“saya mau buat bacaan 1 th alkitab artinya 1th baca selesai semua..
      setiap hari ntah berapa pasal.. pasal2 yg di beri tentu user sudah
      dilengkapi banyak referensi .. kemungkinan baca 1 tahun akan lebih
      menyenangkan.. apakah km bisa menenukan daftar baca alkitab... dan ini
      jika diaktifkan akan berjalan setiap hari.. dari pada pengingat firman
      bagaimana menurut km”*

   TUGAS BERKAS INI: data rencana + KEMAJUAN BACA.
   ❌ TIDAK menyentuh tampilan (itu plugin/baca1tahun/tampilan.js).

   ------------------------------------------------------------
   DATA RENCANA  (dibangun `tools/siapkan-data-baca.js`)
     plugin/baca1tahun/data/baca.js → window.ANodesBacaData
       3 rencana × 365 hari · semuanya menutup 1.189 pasal (100 %):
         urut — berurutan Kejadian → Wahyu   (paling merata)
         plpb — PL + PB tiap hari
         edw  — PL + PB + Mazmur + Amsal tiap hari (pola Every Day In the Word)
     Disimpan di IndexedDB `anodes-plugin-db` / toko `data` / kunci `baca1tahun`.

   KEMAJUAN BACA  (localStorage, ikut disinkronkan PC ⇄ HP)
     `anodes-baca1tahun-v1`
       { versi, rencana, mulai, selesai: { "12": 1793600000000, … }, terakhir }

     `mulai`  = tanggal (YYYY-MM-DD) hari ke-1
     `selesai`= peta nomor-hari → waktu ditandai (ms)
     Tanggal dihitung dari `mulai`, jadi kalau ketinggalan beberapa hari
     tidak “menumpuk”: hari ini tetap hari yang sesuai tanggal kalender.

   ⚠️ Ikut disinkronkan: kuncinya didaftarkan di `js/sinkron.js`.
   ============================================================ */

window.ANodesBaca = (function () {
  'use strict';

  const VERSI = 'v3Nov-a';
  const KUNCI_PROGRES = 'anodes-baca1tahun-v1';

  // ------------------------------------------------------------
  // 👤 K100 (3 Nov 2026) — KUNCI PER EMAIL
  // Data dipisah menurut email; lihat js/pengguna.js.
  // ⚠️ Kalau ANodesPengguna belum ada (mis. diuji tanpa berkas itu),
  //    kunci kembali ke bentuk lama supaya aplikasi TETAP JALAN.
  // ------------------------------------------------------------
  function kunciData() {
    const P = window.ANodesPengguna;
    return (P && P.kunci) ? P.kunci(KUNCI_PROGRES) : KUNCI_PROGRES;
  }

  const DB_NAMA = 'anodes-plugin-db';
  const DB_TOKO = 'data';
  const DB_KUNCI = 'baca1tahun';

  const RENCANA_BAWAAN = 'urut';

  let data = null;          // window.ANodesBacaData (meta + rencana)
  let siap = false;
  let memuat = null;

  const tungguSiap = [];    // fn dipanggil SEKALI saat data siap
  const pendengar = [];     // fn dipanggil TIAP data siap

  // ------------------------------------------------------------
  // IndexedDB (pola sama plugin lain — simpanan cepat)
  // ------------------------------------------------------------
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
  // muat — BERKAS DATA lebih dulu; simpanan hanya kalau sidik SAMA
  //   (pelajaran K45/K90: sidik WAJIB memuat ISI, bukan hanya jumlah)
  // ------------------------------------------------------------
  function muat(lapor) {
    if (memuat) return memuat;
    const kabar = typeof lapor === 'function' ? lapor : function () {};

    memuat = new Promise(selesai => {
      const dariBerkas = window.ANodesBacaData || null;

      if (!dariBerkas) {
        dbAmbil(DB_KUNCI).then(simpanan => {
          if (simpanan && simpanan.meta && simpanan.rencana) {
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

      dbAmbil(DB_KUNCI).then(simpanan => {
        const baru = data.meta && data.meta.sidik;
        const lama = simpanan && simpanan.meta && simpanan.meta.sidik;
        if (lama !== baru) dbSimpan(DB_KUNCI, data);
      });

      selesai(data);
    });

    return memuat;
  }

  function tandaiSiap() {
    if (siap) return;
    siap = true;
    while (tungguSiap.length) {
      try { (tungguSiap.shift())(); } catch (e) { console.warn('ANodes Baca:', e); }
    }
    kabariPendengar();
  }

  function kabariPendengar() {
    // pendengar didahulukan (pelajaran K80)
    pendengar.slice().forEach(fn => { try { fn(); } catch (e) {} });
  }

  function ketikaSiap(fn) {
    if (siap) { try { fn(); } catch (e) {} return; }
    tungguSiap.push(fn);
  }

  function saatSiap(fn) {
    if (typeof fn !== 'function') return;
    whenSiapLaluMuat(fn);
  }

  function whenSiapLaluMuat(fn) {
    const tugas = () => ketikaSiap(fn);
    if (!memuat) muat();
    tugas();
  }

  function padaSiap(fn) {
    if (typeof fn !== 'function') return;
    pendengar.push(fn);
    if (siap) { try { fn(); } catch (e) {} }
  }

  // ------------------------------------------------------------
  // KETERANGAN DATA
  // ------------------------------------------------------------
  function meta() { return data ? Object.assign({}, data.meta) : null; }
  function dipasang() { return siap || !!memuat; }
  function saatDilepas() {
    data = null; siap = false; memuat = null;
    tungguSiap.length = 0; pendengar.length = 0;
  }

  function daftarRencana() {
    if (!data || !data.rencana) return [];
    return Object.keys(data.rencana).map(id => {
      const r = data.rencana[id];
      return {
        id,
        nama: r.nama,
        ket: r.ket,
        jalur: (r.jalur || []).slice(),
        jumlahHari: r.jumlahHari,
        pasalTercakup: r.pasalTercakup
      };
    });
  }

  function rencana(id) {
    if (!data || !data.rencana) return null;
    return data.rencana[id] || data.rencana[RENCANA_BAWAAN] || null;
  }

  // ------------------------------------------------------------
  // HARI → DAFTAR PASAL
  //   `pasal` blok boleh null (blok rapat) ⇒ dihitung dari dari/sampai.
  //   Dihitung pakai data `ANodesAlkitab` supaya tidak menebak jumlah pasal.
  // ------------------------------------------------------------
  function daftarPasalBlok(b, kitabInfo) {
    if (b.pasal) return b.pasal.slice();
    const out = [];
    for (let k = b.dari.k; k <= b.sampai.k; k++) {
      const jml = (kitabInfo && kitabInfo[k]) ? kitabInfo[k] : 0;
      if (!jml) continue;
      const mulai = (k === b.dari.k) ? b.dari.p : 1;
      const akhir = (k === b.sampai.k) ? b.sampai.p : jml;
      for (let p = mulai; p <= akhir; p++) out.push([k, p]);
    }
    return out;
  }

  // jumlah pasal tiap kitab dari mesin Alkitab (dipakai kalau `pasal` null)
  function kitabInfo() {
    const A = window.ANodesAlkitab;
    if (!A || !A.siap || !A.siap()) return null;
    const out = {};
    const daftar = A.daftarKitab();
    for (const k of daftar) out[k.no] = A.jumlahPasal(k.no);
    return out;
  }

  // hari ke-n (1–365) → { h, ayat, pasal, blok:[…] }  (pasal sudah dipecah)
  function hariKe(n, idRencana) {
    const r = rencana(idRencana);
    if (!r) return null;
    const h = r.hari[Number(n) - 1];
    if (!h) return null;
    const ki = kitabInfo();
    const blok = h.blok.map(b => {
      const ps = daftarPasalBlok(b, ki);
      return {
        jalur: b.jalur,
        dari: { k: b.dari.k, p: b.dari.p },
        sampai: { k: b.sampai.k, p: b.sampai.p },
        ayat: b.ayat,
        pasal: ps
      };
    });
    const pasal = [];
    blok.forEach(b => b.pasal.forEach(x => pasal.push(x)));
    return { h: h.h, ayat: h.ayat, pasal, blok };
  }

  function jumlahHari(idRencana) {
    const r = rencana(idRencana);
    return r ? r.jumlahHari : 0;
  }

  // label satu blok: "Kejadian 1–3" / "Kejadian 50 – Keluaran 2" / "Matius 1"
    // ⚠️ Nama kitab ditulis SEKALI bila kitabnya sama (dulu “Kejadian 1 – Kejadian 3”)
    function labelBlok(b) {
      const A = window.ANodesAlkitab;
      const nama = k => {
        if (A && A.siap && A.siap()) {
          const it = A.daftarKitab().find(x => x.no === k);
          if (it) return it.nama;
        }
        return 'Kitab ' + k;
      };
      const nd = nama(b.dari.k);
      if (b.dari.k === b.sampai.k) {
        if (b.dari.p === b.sampai.p) return nd + ' ' + b.dari.p;
        return nd + ' ' + b.dari.p + '–' + b.sampai.p;
      }
      return nd + ' ' + b.dari.p + ' – ' + nama(b.sampai.k) + ' ' + b.sampai.p;
    }

  function labelHari(n, idRencana) {
    const h = hariKe(n, idRencana);
    if (!h) return '';
    return h.blok.map(labelBlok).join('  ·  ');
  }

  // ------------------------------------------------------------
  // TANGGAL
  // ------------------------------------------------------------
  function hariIni() {
    const d = new Date();
    return d.getFullYear() + '-' + dua(d.getMonth() + 1) + '-' + dua(d.getDate());
  }
  function dua(n) { return (n < 10 ? '0' : '') + n; }

  function tanggalKeMs(t) {
    // "2026-11-03" → ms waktu lokal jam 00:00
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(t || ''));
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
  }

  function selisihHari(dariTgl, keTgl) {
    const a = tanggalKeMs(dariTgl);
    const b = tanggalKeMs(keTgl);
    if (a == null || b == null) return 0;
    return Math.round((b - a) / 86400000);
  }

  // ------------------------------------------------------------
  // KEMAJUAN BACA — localStorage
  // ------------------------------------------------------------
  let progres = null;

  function progresBawaan() {
    return { versi: 1, rencana: RENCANA_BAWAAN, mulai: hariIni(), selesai: {}, terakhir: null };
  }

  function muatProgres() {
    if (progres) return progres;
    let mentah = null;
    try { mentah = localStorage.getItem(kunciData()); } catch (e) {}
    if (!mentah) { progres = progresBawaan(); return progres; }
    try {
      const d = JSON.parse(mentah);
      progres = {
        versi: 1,
        rencana: (d && d.rencana) || RENCANA_BAWAAN,
        mulai: (d && /^\d{4}-\d{2}-\d{2}$/.test(d.mulai || '')) ? d.mulai : hariIni(),
        selesai: (d && d.selesai && typeof d.selesai === 'object') ? d.selesai : {},
        terakhir: (d && typeof d.terakhir === 'string') ? d.terakhir : null
      };
    } catch (e) {
      console.warn('ANodes Baca: kemajuan rusak, dimulai dari awal', e);
      progres = progresBawaan();
    }
    return progres;
  }

  function simpanProgres() {
    // ⚠️ `if (!nilai)` MERUSAK angka 0 — pakai pemeriksaan eksplisit (pelajaran K77f)
    const p = muatProgres();
    p.terakhir = new Date().toISOString();
    try {
      localStorage.setItem(kunciData(), JSON.stringify(p));
      const S = window.ANodesSinkron;
      if (S && typeof S.tandaiBerubah === 'function') S.tandaiBerubah(KUNCI_PROGRES);
      return true;
    } catch (e) {
      console.warn('ANodes Baca: gagal menyimpan kemajuan', e);
      return false;
    }
  }

  function ambilProgres() {
    const p = muatProgres();
    return {
      rencana: p.rencana,
      mulai: p.mulai,
      selesai: Object.assign({}, p.selesai),
      jumlahSelesai: Object.keys(p.selesai).length,
      terakhir: p.terakhir
    };
  }

  function rencanaAktif() { return muatProgres().rencana || RENCANA_BAWAAN; }

  function gantiRencana(id) {
    if (!rencana(id)) return false;
    const p = muatProgres();
    if (p.rencana === id) return true;
    p.rencana = id;
    // kemajuan TIDAK dihapus — nomor hari tetap sama (365), jadi tetap bermakna
    simpanProgres();
    kabariPendengar();
    return true;
  }

  function mulaiDari(tanggal) {
    const t = String(tanggal || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return false;
    const p = muatProgres();
    p.mulai = t;
    simpanProgres();
    kabariPendengar();
    return true;
  }

  function mulaiHariIni() { return mulaiDari(hariIni()); }

  // hari ke-berapa untuk tanggal tertentu (1…365; <=0 belum mulai; >365 selesai)
  function hariUntukTanggal(tgl) {
    const p = muatProgres();
    return selisihHari(p.mulai, tgl || hariIni()) + 1;
  }

  function hariIniKe() { return hariUntukTanggal(hariIni()); }

  function sudahDibaca(n) {
    const p = muatProgres();
    return !!(p.selesai && p.selesai[String(n)]);
  }

  function tandaiDibaca(n, sudah) {
    const p = muatProgres();
    const k = String(n);
    if (sudah === false) {
      delete p.selesai[k];
    } else {
      p.selesai[k] = Date.now();
    }
    simpanProgres();
    kabariPendengar();
    return true;
  }

  function tandaiHariIni(sudah) {
    const n = hariIniKe();
    if (n < 1) return false;
    return tandaiDibaca(n, sudah);
  }

  // peta { "1": ms, … } — untuk kalender
  function petaSelesai() { return Object.assign({}, muatProgres().selesai); }

  // berapa hari berturut-turut sudah dibaca (dihitung mundur dari hari ini)
  function beruntun() {
    const p = muatProgres();
    const ini = hariIniKe();
    if (ini < 1) return 0;
    let n = 0;
    let i = Math.min(ini, jumlahHari(p.rencana) || 365);
    // kalau hari ini belum ditandai, mulai dari kemarin
    if (!p.selesai[String(i)]) i -= 1;
    while (i >= 1 && p.selesai[String(i)]) { n++; i--; }
    return n;
  }

  function persen() {
    const p = muatProgres();
    const total = jumlahHari(p.rencana) || 365;
    const n = Object.keys(p.selesai).length;
    return Math.round((n / total) * 1000) / 10;   // satu desimal
  }

  function kosongkanProgres() {
    progres = progresBawaan();
    simpanProgres();
    kabariPendengar();
    return true;
  }

  // ------------------------------------------------------------
  // BANTU: cap tanggal Indonesia ("3 Nov 2026")
  // ------------------------------------------------------------
  const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  function tanggalIndonesia(t) {
    const ms = tanggalKeMs(t);
    if (ms == null) return '';
    const d = new Date(ms);
    return d.getDate() + ' ' + BULAN[d.getMonth()] + ' ' + d.getFullYear();
  }

  // ------------------------------------------------------------
  // SIMPANAN cepat sekali saat plugin dipasang (pola plugin lain)
  // ------------------------------------------------------------
  function siapkanOtomatis() {
    if (siap || memuat) { kabariPendengar(); return; }
    muat();
    muatProgres();
  }

  // ------------------------------------------------------------
  return {
    VERSI,
    KUNCI_PROGRES,

    // data rencana
    muat, siap: () => siap, meta, dipasang, saatDilepas, siapkanOtomatis,
    ketikaSiap, saatSiap, padaSiap,
    daftarRencana, rencana, jumlahHari, hariKe, labelBlok, labelHari, daftarPasalBlok,

    // kemajuan
    ambilProgres, rencanaAktif, gantiRencana,
    mulaiDari, mulaiHariIni, hariUntukTanggal, hariIniKe,
    sudahDibaca, tandaiDibaca, tandaiHariIni, petaSelesai,
    beruntun, persen, kosongkanProgres,

    // bantu
    hariIni, tanggalIndonesia, selisihHari
  };
})();