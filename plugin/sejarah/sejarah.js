/* ============================================================
   ANodes — plugin/sejarah/sejarah.js
   MESIN plugin: 📖 SEJARAH KITAB  (K55 → K55b)

   ------------------------------------------------------------
   Bapak 22 Sep 2026:
     *“alkitab saya ingin menambahkan penulisan artikel pemanis — user hanya
      membaca **Pengantar Sejarah Alkitab**.. user perlu mengenal masing2
      sejarah kitab.. contoh kej 1:1 ada tombol [sejarah] diklik ⇒ info
      sejarah Kejadian ditampilkan .. dan ini untuk kesemua kitab hingga
      Perjanjian Baru .. untuk sejarah Alkitab keseluruhan ditempatkan pada
      gudang plugin -> alkitab ada tombol [sejarah]”*
   Lalu (K55b, 22 Sep 2026):
     *“sejarah apakah bisa di buatkan plugin seperti orderan saya tadi”*
     ⇒ ✅ **dijadikan PLUGIN SENDIRI** (`plugin/sejarah/`) supaya bisa
        dipasang/dilepas tanpa menyentuh plugin 📖 Alkitab.
        Tanda di halaman baca dipasang lewat sambungan resmi
        **`tambahPenghias()`** milik plugin Alkitab (❌ tanpa mesin baru).

   Berkas ini MESIN saja (data + tanya-jawab). Tampilannya di
   plugin/sejarah/tampilan.js. Datanya dari plugin/sejarah/data/sejarah.js
   (hasil tools/siapkan-data-sejarah.js — ❌ jangan diedit tangan).

   API (window.ANodesSejarah):
     muat(lapor)          → memuat data (sekali)
     siap()               → true kalau data sudah siap
     meta()               → keterangan data (jumlah kitab, tanggal, dll)
     kitab(no)            → { no,nama,singkatan,penulis,kategori,perjanjian,
                              tahun,inti,tema[],tokoh[],ayat[],sejarah }
     semua()              → daftar seluruh kitab (untuk daftar/kelompok)
     ada(no)              → true kalau kitab itu punya keterangan sejarah
     pengantar()          → teks “Pengantar Sejarah Alkitab” keseluruhan
     adaPengantar()       → true kalau teks pengantar tersedia
     jumlahKitab()        → berapa kitab yang punya sejarah
     kelompok()           → daftar {kategori, kitab:[…]} (mis. Taurat, Injil)
     ketikaSiap(fn) / saatSiap(fn) / padaSiap(fn)
     dipasang() / saatDilepas() / siapkanOtomatis()

   ⚠️ Memuat berkas data lewat <script src> — ❌ JANGAN fetch (Chrome
      memblokir fetch di file://). Simpanan cepat memakai IndexedDB
      kunci `sejarah` (gudang yang sama dengan Alkitab, KUNCI BEDA).
   ============================================================ */

window.ANodesSejarah = (function () {
  'use strict';

  const NAMA_BERKAS = 'plugin/sejarah/data/sejarah.js';
  const KUNCI_SIMPAN = 'sejarah';        // IndexedDB di anodes-plugin-db / toko data

  let data = null;                        // { meta, kitab:[…], pengantar }
  let memuat = null;                      // janji pemuatan yang sedang jalan
  const tunggu = [];                      // tugas yang menunggu siap

  /* ------------------------------------------------------------
     Gudang IndexedDB (pola SAMA dengan mesin Alkitab & kamus)
     ------------------------------------------------------------ */
  function bukaGudang() {
    return new Promise((selesai, gagal) => {
      if (!window.indexedDB) { gagal(new Error('IndexedDB tidak tersedia')); return; }
      const minta = indexedDB.open('anodes-plugin-db', 1);
      minta.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('data')) db.createObjectStore('data');
      };
      minta.onsuccess = (e) => selesai(e.target.result);
      minta.onerror = (e) => gagal(e.target.error);
    });
  }

  async function bacaSimpanan() {
    const db = await bukaGudang();
    return new Promise((selesai, gagal) => {
      const t = db.transaction('data', 'readonly');
      const r = t.objectStore('data').get(KUNCI_SIMPAN);
      r.onsuccess = () => selesai(r.result || null);
      r.onerror = () => gagal(r.error);
    });
  }

  async function tulisSimpanan(isi) {
    const db = await bukaGudang();
    return new Promise((selesai, gagal) => {
      const t = db.transaction('data', 'readwrite');
      t.objectStore('data').put(isi, KUNCI_SIMPAN);
      t.oncomplete = () => selesai();
      t.onerror = () => gagal(t.error);
    });
  }

  /* ------------------------------------------------------------
     Muat berkas data lewat <script src> (❌ bukan fetch)
     ------------------------------------------------------------ */
  function muatBerkas(jalur) {
    return new Promise((selesai, gagal) => {
      // kalau sudah ada di halaman (versi 1 berkas), langsung pakai
      if (window.ANodesSejarahData) { selesai(window.ANodesSejarahData); return; }
      const s = document.createElement('script');
      s.src = jalur;
      s.onload = () => {
        if (window.ANodesSejarahData) selesai(window.ANodesSejarahData);
        else gagal(new Error('Berkas data sejarah termuat tetapi isinya kosong'));
      };
      s.onerror = () => gagal(new Error('Gagal membaca ' + jalur));
      document.head.appendChild(s);
    });
  }

  /* ------------------------------------------------------------
     MUAT — berkas data DIUTAMAKAN, simpanan hanya pembanding
       ⚠️ Pelajaran K45: simpanan lama IndexedDB pernah MENUTUPI data
          baru. Jadi berkas data selalu dibaca lebih dulu; simpanan hanya
          dipakai kalau sidiknya SAMA.
     ------------------------------------------------------------ */
  function muat(lapor) {
    if (data) return Promise.resolve(data);
    if (memuat) return memuat;

    memuat = (async () => {
      let dariBerkas = null;
      try {
        dariBerkas = await muatBerkas(NAMA_BERKAS);
      } catch (e) {
        // berkas gagal → coba simpanan lama (kalau ada)
        try {
          const lama = await bacaSimpanan();
          if (lama && Array.isArray(lama.kitab)) {
            data = lama;
            if (lapor) lapor(100, 'memakai simpanan lama');
            return data;
          }
        } catch (e2) {}
        throw e;
      }

      data = dariBerkas;

      // simpan ke gudang untuk pemuatan berikutnya (tidak wajib berhasil)
      try { await tulisSimpanan(dariBerkas); } catch (e) {}

      if (lapor) lapor(100, 'selesai');
      // beri tahu penunggu
      const t = tunggu.splice(0);
      t.forEach(fn => { try { fn(data); } catch (e) {} });
      return data;
    })();

    return memuat.catch((e) => { memuat = null; throw e; });
  }

  /* ------------------------------------------------------------
     Kesiapan berantai
     ------------------------------------------------------------ */
  function ketikaSiap(fn) {
    if (data) { try { fn(data); } catch (e) {} return; }
    tunggu.push(fn);
  }
  const padaSiap = ketikaSiap;

  function saatSiap(tugas) {
    if (data) { try { tugas(data); } catch (e) {} return; }
    const lapis = window.ANodesPlugin && window.ANodesPlugin.lapisMemuat;
    if (lapis) lapis('📖 Menyiapkan sejarah kitab…', 5, 'mohon tunggu sebentar');
    muat((p, ket) => { if (lapis) lapis('📖 Menyiapkan sejarah kitab…', p, ket); })
      .then(d => {
        if (lapis) setTimeout(() => lapis(null), 450);
        try { tugas(d); } catch (e) {}
      })
      .catch(e => {
        if (lapis) lapis(null);
        if (window.ANodesAlkitabTampilan && window.ANodesAlkitabTampilan.pesan) {
          window.ANodesAlkitabTampilan.pesan('⚠️ Data sejarah gagal dimuat: ' + e.message);
        }
      });
  }

  /* ------------------------------------------------------------
     Tanya-jawab data
     ------------------------------------------------------------ */
  function siap() { return !!data; }
  function meta() { return data ? data.meta : null; }

  function kitab(no) {
    if (!data || !Array.isArray(data.kitab)) return null;
    const n = Number(no);
    return data.kitab.find(k => Number(k.no) === n) || null;
  }

  function ada(no) {
    const k = kitab(no);
    return !!(k && (k.sejarah || k.inti));
  }

  function semua() { return data && Array.isArray(data.kitab) ? data.kitab.slice() : []; }

  function jumlahKitab() {
    return data && Array.isArray(data.kitab) ? data.kitab.length : 0;
  }

  function pengantar() {
    return (data && typeof data.pengantar === 'string') ? data.pengantar : '';
  }
  function adaPengantar() { return pengantar().length > 0; }

  // daftar {kategori, kitab:[…]} — urut sesuai kemunculan
  function kelompok() {
    const hasil = [];
    const peta = new Map();
    semua().forEach(k => {
      const kat = k.kategori || 'Lain-lain';
      if (!peta.has(kat)) { peta.set(kat, { kategori: kat, kitab: [] }); hasil.push(peta.get(kat)); }
      peta.get(kat).kitab.push(k);
    });
    return hasil;
  }

  /* ------------------------------------------------------------
     Pasang / lepas
     ------------------------------------------------------------ */
  function dipasang() {
    return muat((p, ket) => {
      if (window.ANodesPlugin && window.ANodesPlugin.lapisMemuat) {
        window.ANodesPlugin.lapisMemuat('📖 Memuat sejarah kitab…', p, ket);
      }
    }).then(d => {
      if (window.ANodesPlugin && window.ANodesPlugin.lapisMemuat) {
        setTimeout(() => window.ANodesPlugin.lapisMemuat(null), 450);
      }
      return d;
    });
  }

  function saatDilepas() {
    // cukup buang simpanan di memori; DATA di IndexedDB dibiarkan
    // (kalau plugin dipasang lagi, tidak perlu membaca berkas dari awal)
    data = null;
    memuat = null;
    tunggu.length = 0;
  }

  // siapkan otomatis kalau plugin 📖 Alkitab terpasang
  function siapkanOtomatis() {
    const gudang = window.ANodesPlugin;
    if (!gudang || typeof gudang.dipasang !== 'function') return;
    if (!gudang.dipasang('alkitab')) return;
    muat().catch(() => {});
  }

  /* ------------------------------------------------------------
     API
     ------------------------------------------------------------ */
  return {
    muat, siap, meta, kitab, semua, ada, pengantar, adaPengantar,
    jumlahKitab, kelompok,
    ketikaSiap, padaSiap, saatSiap,
    dipasang, saatDilepas, siapkanOtomatis,
    // untuk uji
    _data: () => data
  };
})();