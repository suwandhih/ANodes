/* ============================================================
   ANodes — plugin/bookmark/bookmark.js
   MESIN PLUGIN: 📌 Bookmark Ayat   (K81 — 30 Okt 2026)
   ------------------------------------------------------------
   Bapak: *“perlu plugin tambahan .. bookmark ayat alkitab.. jika di aktifkan
   bookmark .. di alkitab tambahan tombol bookmark ketika user baca dan di klik
   ayat yg mau dibookmark bisa dari ayat - ayat bisa dari pasal .. ayat ...
   sampai dengan pasal .. ayat tergantung user klik ayat mana saja.. tidak bisa
   lompat jika mau dari .. sampai ..... jika lompat terpisah bookmarknya ...
   setelah bookmark hasilnya ada pages di bookmark daftar ayat2 yg dibookmark
   user user bisa edit/hapus”*

   TUGAS BERKAS INI: menyimpan & membaca daftar bookmark.
   ❌ TIDAK menyentuh tampilan (itu plugin/bookmark/tampilan.js).

   SIMPANAN: localStorage `anodes-bookmark-v1`
     { daftar: [ { id, no, pasal, ayat1, ayat2, catatan, dibuat, diubah } ] }

   ⚠️ Ikut disinkronkan PC ⇄ HP (K77) — kuncinya didaftarkan di js/sinkron.js.
   ============================================================ */

window.ANodesBookmark = (function () {
  'use strict';

  const VERSI = 'v30Okt-e';
  const KUNCI = 'anodes-bookmark-v1';

  // ------------------------------------------------------------
  // 👤 K100 (3 Nov 2026) — KUNCI PER EMAIL
  // Data dipisah menurut email; lihat js/pengguna.js.
  // ⚠️ Kalau ANodesPengguna belum ada (mis. diuji tanpa berkas itu),
  //    kunci kembali ke bentuk lama supaya aplikasi TETAP JALAN.
  // ------------------------------------------------------------
  function kunciData() {
    const P = window.ANodesPengguna;
    return (P && P.kunci) ? P.kunci(KUNCI) : KUNCI;
  }


  let daftar = [];          // [{ id, no, pasal, ayat1, ayat2, catatan, dibuat, diubah }]
  let sudahMuat = false;

  // ------------------------------------------------------------
  // BACA / TULIS simpanan
  // ------------------------------------------------------------
  function muat() {
    if (sudahMuat) return daftar;
    sudahMuat = true;
    let mentah = null;
    try { mentah = localStorage.getItem(kunciData()); } catch (e) {}
    if (!mentah) { daftar = []; return daftar; }
    try {
      const d = JSON.parse(mentah);
      const arr = (d && Array.isArray(d.daftar)) ? d.daftar : [];
      daftar = arr.filter(x => x && x.no && x.pasal && x.ayat1).map(rapikan);
    } catch (e) {
      console.warn('ANodes Bookmark: simpanan rusak, dimulai dari kosong', e);
      daftar = [];
    }
    return daftar;
  }

  function simpan() {
    try {
      localStorage.setItem(kunciData(), JSON.stringify({ versi: 1, daftar: daftar }));
      // K77 — beri tahu modul sinkron bahwa ada perubahan
      const S = window.ANodesSinkron;
      if (S && typeof S.tandaiBerubah === 'function') S.tandaiBerubah(KUNCI);
      return true;
    } catch (e) {
      console.warn('ANodes Bookmark: gagal menyimpan', e);
      return false;
    }
  }

  // pastikan bentuknya konsisten (dipakai juga saat memuat dari simpanan)
  function rapikan(x) {
    const a1 = Number(x.ayat1) || 0;
    const a2 = Number(x.ayat2) || a1;
    return {
      id: x.id || buatId(),
      no: Number(x.no),
      pasal: Number(x.pasal),
      ayat1: a1,
      ayat2: a2,
      catatan: typeof x.catatan === 'string' ? x.catatan : '',
      dibuat: Number(x.dibuat) || Date.now(),
      diubah: Number(x.diubah) || Number(x.dibuat) || Date.now()
    };
  }

  function buatId() {
    return 'bm-' + Date.now().toString(36) + '-' +
      Math.random().toString(36).slice(2, 7);
  }

  // ------------------------------------------------------------
  // BACA
  // ------------------------------------------------------------
  function semua() {
    muat();
    // terbaru di atas
    return daftar.slice().sort((a, b) => (b.diubah || 0) - (a.diubah || 0));
  }

  function jumlah() { muat(); return daftar.length; }

  function ambil(id) {
    muat();
    return daftar.find(x => x.id === id) || null;
  }

  // apakah SATU ayat tertentu sudah pernah dibookmark?
  //   dipakai untuk memberi TANDA di halaman baca Alkitab.
  function ayatDibook(no, pasal, ayat) {
    muat();
    const a = Number(ayat);
    return daftar.some(x => x.no === Number(no) && x.pasal === Number(pasal) &&
      a >= x.ayat1 && a <= x.ayat2);
  }

  // peta { nomorAyat: jumlahBookmark } untuk satu pasal — satu panggilan
  function petaPasal(no, pasal) {
    muat();
    const peta = Object.create(null);
    daftar.forEach(x => {
      if (x.no !== Number(no) || x.pasal !== Number(pasal)) return;
      for (let a = x.ayat1; a <= x.ayat2; a++) {
        peta[a] = (peta[a] || 0) + 1;
      }
    });
    return peta;
  }

  // ------------------------------------------------------------
  // TULIS
  // ------------------------------------------------------------
  // tambah satu bookmark. `ayat` = array nomor ayat (boleh tidak berurutan —
  //   pemanggil yang memutuskan; mesin ini hanya menyimpan apa adanya).
  function tambah(no, pasal, ayat, catatan) {
    muat();
    const arr = (Array.isArray(ayat) ? ayat : [ayat])
      .map(Number).filter(n => n > 0).sort((a, b) => a - b);
    if (!arr.length) return null;
    const b = rapikan({
      no: Number(no), pasal: Number(pasal),
      ayat1: arr[0], ayat2: arr[arr.length - 1],
      catatan: catatan || '',
      dibuat: Date.now(), diubah: Date.now()
    });
    daftar.push(b);
    simpan();
    return b;
  }

  // ubah satu bookmark (dipakai mode EDIT)
  function ubah(id, ubahannya) {
    muat();
    const b = daftar.find(x => x.id === id);
    if (!b) return null;
    if (ubahannya && Array.isArray(ubahannya.ayat) && ubahannya.ayat.length) {
      const arr = ubahannya.ayat.map(Number).filter(n => n > 0).sort((a, b2) => a - b2);
      b.ayat1 = arr[0];
      b.ayat2 = arr[arr.length - 1];
    }
    if (ubahannya && typeof ubahannya.catatan === 'string') b.catatan = ubahannya.catatan;
    b.diubah = Date.now();
    simpan();
    return b;
  }

  function hapus(id) {
    muat();
    const i = daftar.findIndex(x => x.id === id);
    if (i < 0) return false;
    daftar.splice(i, 1);
    simpan();
    return true;
  }

  function hapusSemua() {
    muat();
    daftar = [];
    simpan();
  }

  // ------------------------------------------------------------
  // GABUNG (dipakai sinkron K77 — pola sama seperti catatan)
  //   • cocokkan lewat `id`
  //   • yang lebih baru (`diubah`) menang
  //   • yang dihapus di satu sisi ⇒ hilang di kedua sisi
  //     (dilacak lewat `dibuang` — daftar id yang pernah dihapus)
  // ------------------------------------------------------------
  function gabung(lokal, jauh) {
    const a = Array.isArray(lokal) ? lokal : [];
    const b = Array.isArray(jauh) ? jauh : [];
    const peta = new Map();
    a.forEach(x => { if (x && x.id) peta.set(x.id, rapikan(x)); });
    b.forEach(x => {
      if (!x || !x.id) return;
      const ada = peta.get(x.id);
      if (!ada) { peta.set(x.id, rapikan(x)); return; }
      if ((Number(x.diubah) || 0) > (Number(ada.diubah) || 0)) peta.set(x.id, rapikan(x));
    });
    return [...peta.values()];
  }

  // ------------------------------------------------------------
  // LABEL — “Bilangan 6:24-26” (panjang) / “Bil 6:24-26” (singkat)
  // ------------------------------------------------------------
  function label(b, pakaiPanjang) {
    if (!b) return '';
    const m = window.ANodesAlkitab;
    let nama = '';
    if (m && m.siap && m.siap()) {
      const k = m.daftarKitab().find(x => x.no === Number(b.no));
      if (k) nama = pakaiPanjang ? k.nama : k.singkatan;
    }
    if (!nama) nama = 'Kitab ' + b.no;
    const a1 = Number(b.ayat1) || 0;
    const a2 = Number(b.ayat2) || a1;
    const bagian = a1 ? (':' + a1 + (a2 !== a1 ? '-' + a2 : '')) : '';
    return nama + ' ' + b.pasal + bagian;
  }

  // ------------------------------------------------------------
  // API
  // ------------------------------------------------------------
  return {
    VERSI, KUNCI,
    muat, simpan, semua, jumlah, ambil,
    ayatDibook, petaPasal,
    tambah, ubah, hapus, hapusSemua,
    gabung, label,
    // dipakai alat uji
    _rapikan: rapikan,
    _setDaftar: (arr) => { daftar = (arr || []).map(rapikan); sudahMuat = true; }
  };
})();
