/* ============================================================
   ANodes — plugin/penguat/penguat.js
   MESIN plugin: 🖊 Pembaca Penguat  (K47)
   ------------------------------------------------------------
   MANDIRI — berkas ini TIDAK menyentuh catatan/editor sama sekali.
   Tugasnya hanya: MEMUAT data penguat lalu MENJAWAB pertanyaan
   “penguat untuk ayat ini apa?”.

   Data  : plugin/penguat/data/penguat.js
           (window.ANodesPenguatData — dibuat tools/siapkan-data-penguat.js)
   Gudang: IndexedDB `anodes-plugin-db` / toko `data` / kunci `penguat`
           (gudang SAMA dengan alkitab-tb & silang & kamus, kunci BEDA)

   ⚠️ Muat berkas lewat <script src> saja — fetch() diblokir di file://.
   ⚠️ Ukuran data ±1 MB → disimpan di IndexedDB supaya sesudah dibuka
      sekali tidak perlu membaca berkas lagi.

   API (window.ANodesPenguat):
     muat(lapor)                     → memuat data (IndexedDB dulu)
     siap()                          → true kalau data sudah ada
     meta()                          → { sumber, dibangun, jumlahAyat, kitab }
     daftarKitab()                   → [{no, nama, singkatan, jumlahAyat, jumlahPasal}]
     kitabAda(no)                    → true kalau kitab itu punya penguat
     daftarPasal(no)                 → [1, 2, 3, …]
     komentarPasal(no, pasal)        → { "1":"teks", "2":"teks", … }
     komentar(no, pasal, ayat)       → teks atau ''
     jumlahAyat(no)                  → jumlah ayat berkomentar di kitab itu
     jumlahSemua()                   → jumlah seluruh ayat berkomentar
     cari(kata, batas)               → [{no, nama, pasal, ayat, teks}]  (isi penguat)
     ketikaSiap(fn) · saatSiap(tugas) · siapkanOtomatis()
     dipasang() · saatDilepas()
   ============================================================ */

window.ANodesPenguat = (function () {
  'use strict';

  const NAMA_GUDANG = 'anodes-plugin-db';
  const VERSI_GUDANG = 1;
  const TOKO = 'data';
  const KUNCI = 'penguat';

  let data = null;          // { meta, kitab:[…] }
  let sedangMuat = null;    // Promise saat memuat
  const tunggu = [];        // fn yang menunggu data siap

  /* ------------------------------------------------------------
     Gudang cepat (IndexedDB)
     ------------------------------------------------------------ */
  function bukaGudang() {
    return new Promise((selesai, gagal) => {
      if (!window.indexedDB) { gagal(new Error('IndexedDB tidak ada')); return; }
      const minta = indexedDB.open(NAMA_GUDANG, VERSI_GUDANG);
      minta.onupgradeneeded = () => {
        const db = minta.result;
        if (!db.objectStoreNames.contains(TOKO)) db.createObjectStore(TOKO);
      };
      minta.onsuccess = () => selesai(minta.result);
      minta.onerror = () => gagal(minta.error);
    });
  }

  async function bacaGudang() {
    try {
      const db = await bukaGudang();
      return await new Promise((selesai, gagal) => {
        const trx = db.transaction(TOKO, 'readonly');
        const minta = trx.objectStore(TOKO).get(KUNCI);
        minta.onsuccess = () => selesai(minta.result || null);
        minta.onerror = () => gagal(minta.error);
      });
    } catch (e) {
      return null;
    }
  }

  async function tulisGudang(isi) {
    try {
      const db = await bukaGudang();
      return await new Promise((selesai, gagal) => {
        const trx = db.transaction(TOKO, 'readwrite');
        trx.objectStore(TOKO).put(isi, KUNCI);
        trx.oncomplete = () => selesai(true);
        trx.onerror = () => gagal(trx.error);
      });
    } catch (e) {
      return false;
    }
  }

  /* ------------------------------------------------------------
     Muat berkas data lewat <script src>
     ------------------------------------------------------------ */
  function muatBerkas(jalur) {
    return new Promise((selesai, gagal) => {
      if (document.querySelector('script[data-penguat="' + jalur + '"]')) {
        selesai(true); return;
      }
      const s = document.createElement('script');
      s.src = jalur;
      s.setAttribute('data-penguat', jalur);
      s.onload = () => selesai(true);
      s.onerror = () => gagal(new Error('gagal memuat ' + jalur));
      document.head.appendChild(s);
    });
  }

  /* ------------------------------------------------------------
     muat(lapor) — berkas data dulu (supaya kitab baru SELALU ikut),
     simpanan cepat dipakai hanya kalau sidiknya SAMA.
     ------------------------------------------------------------
     ⚠️ PELAJARAN 19 Sep 2026: kalau IndexedDB dipakai lebih dulu, kitab yang
     baru ditambahkan (Yesaya) TIDAK terbaca — simpanan lama (4 kitab) menang.
     Karena itu: baca sidik dari berkas data, buang simpanan yang sidiknya beda. */
  function muat(lapor) {
    if (data) return Promise.resolve(data);
    if (sedangMuat) return sedangMuat;

    sedangMuat = (async () => {
      if (lapor) lapor(10, 'membaca berkas data penguat…');

      // 1) berkas data — sumber kebenaran (selalu ada di halaman/1 berkas)
      if (!window.ANodesPenguatData) {
        await muatBerkas('plugin/penguat/data/penguat.js');
      }
      const dariBerkas = window.ANodesPenguatData;

      if (!dariBerkas || !dariBerkas.kitab) {
        sedangMuat = null;
        throw new Error('Data penguat tidak ditemukan');
      }

      // 2) simpanan cepat — hanya sah kalau sidiknya SAMA dengan berkas data
      let isi = await bacaGudang();
      const sama = !!(isi && dariBerkas.meta && isi.meta &&
                     isi.meta.sidik && isi.meta.sidik === dariBerkas.meta.sidik);

      if (!sama) {
        // simpanan lama/kosong → PAKAI BERKAS, lalu simpan sidik yang baru
        if (isi) { if (lapor) lapor(50, 'data penguat bertambah — memperbarui simpanan…'); }
        isi = dariBerkas;
        tulisGudang(isi);
      }

      data = isi;

      if (lapor) lapor(100, 'selesai');

      // beri tahu semua penunggu
      const daftar = tunggu.splice(0, tunggu.length);
      daftar.forEach(fn => { try { fn(data); } catch (e) {} });

      return data;
    })();

    sedangMuat.catch(() => { sedangMuat = null; });
    return sedangMuat;
  }

  /* ------------------------------------------------------------
     Pertanyaan dasar
     ------------------------------------------------------------ */
  const siap = () => !!data;

  function meta() {
    return data ? (data.meta || {}) : null;
  }

  function kitabUntuk(no) {
    if (!data) return null;
    return (data.kitab || []).find(k => Number(k.no) === Number(no)) || null;
  }

  function kitabAda(no) {
    return !!kitabUntuk(no);
  }

  function daftarKitab() {
    if (!data) return [];
    return (data.kitab || []).map(k => ({
      no: k.no,
      nama: k.nama,
      singkatan: k.singkatan,
      jumlahPasal: Object.keys(k.ayat || {}).length,
      jumlahAyat: Object.keys(k.ayat || {}).reduce((s, p) => s + Object.keys(k.ayat[p]).length, 0)
    }));
  }

  function daftarPasal(no) {
    const k = kitabUntuk(no);
    if (!k) return [];
    return Object.keys(k.ayat || {}).map(Number).sort((a, b) => a - b);
  }

  function komentarPasal(no, pasal) {
    const k = kitabUntuk(no);
    if (!k) return {};
    return (k.ayat || {})[Number(pasal)] || {};
  }

  function komentar(no, pasal, ayat) {
    const p = komentarPasal(no, pasal);
    return p[Number(ayat)] || '';
  }

  function jumlahAyat(no) {
    const k = kitabUntuk(no);
    if (!k) return 0;
    return Object.keys(k.ayat || {}).reduce((s, p) => s + Object.keys(k.ayat[p]).length, 0);
  }

  function jumlahSemua() {
    if (!data) return 0;
    return (data.meta && data.meta.jumlahAyat) || daftarKitab().reduce((s, k) => s + k.jumlahAyat, 0);
  }

  /* ------------------------------------------------------------
     cari(kata, batas) — cari DI DALAM ISI PENGUAT (mandiri)
     ------------------------------------------------------------ */
  function cari(kata, batas) {
    const kunci = String(kata || '').trim().toLowerCase();
    if (!kunci || !data) return [];

    const maks = Number(batas) > 0 ? Number(batas) : 200;
    const hasil = [];
    const kitabList = data.kitab || [];

    for (const k of kitabList) {
      const pasalList = Object.keys(k.ayat || {}).map(Number).sort((a, b) => a - b);
      for (const p of pasalList) {
        const peta = k.ayat[p];
        const ayatList = Object.keys(peta).map(Number).sort((a, b) => a - b);
        for (const a of ayatList) {
          const teks = peta[a] || '';
          const pos = teks.toLowerCase().indexOf(kunci);
          if (pos >= 0) {
            hasil.push({
              no: k.no, nama: k.nama,
              pasal: p, ayat: a,
              teks: teks,
              pos: pos
            });
            if (hasil.length >= maks) return hasil;
          }
        }
      }
    }
    return hasil;
  }

  /* ------------------------------------------------------------
     Kesiapan berantai
     ------------------------------------------------------------ */
  function ketikaSiap(fn) {
    if (data) { try { fn(data); } catch (e) {} return; }
    tunggu.push(fn);
  }

  function saatSiap(tugas) {
    if (data) { try { tugas(data); } catch (e) {} return; }
    window.ANodesPlugin && window.ANodesPlugin.lapisMemuat
      ? window.ANodesPlugin.lapisMemuat('🖊 Menyiapkan penguat…', 5, 'mohon tunggu sebentar')
      : null;
    muat((p, ket) => {
      if (window.ANodesPlugin && window.ANodesPlugin.lapisMemuat) {
        window.ANodesPlugin.lapisMemuat('🖊 Menyiapkan penguat…', p, ket);
      }
    }).then(d => {
      if (window.ANodesPlugin && window.ANodesPlugin.lapisMemuat) {
        setTimeout(() => window.ANodesPlugin.lapisMemuat(null), 450);
      }
      try { tugas(d); } catch (e) {}
    }).catch(e => {
      if (window.ANodesPlugin && window.ANodesPlugin.lapisMemuat) {
        window.ANodesPlugin.lapisMemuat(null);
      }
      if (window.ANodesPenguatTampilan && window.ANodesPenguatTampilan.pesan) {
        window.ANodesPenguatTampilan.pesan('⚠️ Data penguat gagal dimuat: ' + e.message);
      }
    });
  }

  /* ------------------------------------------------------------
     Pasang / lepas plugin
     ------------------------------------------------------------ */
  function dipasang() {
    return muat((p, ket) => {
      if (window.ANodesPlugin && window.ANodesPlugin.lapisMemuat) {
        window.ANodesPlugin.lapisMemuat('🖊 Memuat plugin Penguat…', p, ket);
      }
    }).then(d => {
      if (window.ANodesPlugin && window.ANodesPlugin.lapisMemuat) {
        setTimeout(() => window.ANodesPlugin.lapisMemuat(null), 450);
      }
      return d;
    });
  }

  function saatDilepas() {
    // mandiri: cukup pastikan halaman ditutup oleh tampilan
    if (window.ANodesPenguatTampilan && window.ANodesPenguatTampilan.bersihkan) {
      try { window.ANodesPenguatTampilan.bersihkan(); } catch (e) {}
    }
  }

  // siapkan otomatis kalau plugin terpasang (dipanggil saat halaman dibuka)
  function siapkanOtomatis() {
    const gudang = window.ANodesPlugin;
    if (!gudang || typeof gudang.dipasang !== 'function') return;
    if (!gudang.dipasang('penguat')) return;
    muat().catch(() => {});
  }

  /* ------------------------------------------------------------
     Rakit API
     ------------------------------------------------------------ */
  return {
    muat, siap, meta, daftarKitab, kitabAda, daftarPasal,
    komentarPasal, komentar, jumlahAyat, jumlahSemua, cari,
    ketikaSiap, saatSiap, siapkanOtomatis, dipasang, saatDilepas,
    // untuk uji
    _data: () => data
  };
})();
