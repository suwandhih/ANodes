/* ============================================================
   ANodes — js/store.js
   Penyimpanan catatan.
   TAHAP 2: PERMANEN di localStorage (kunci `anodes-catatan-v1`).
   Bekerja juga di Chrome Android (HP) saat dibuka lewat file://.
   ============================================================ */

const ANodesStore = (() => {
  'use strict';

  // dipasang juga ke window supaya bisa dipakai dari berkas plugin
  // (const tidak otomatis muncul di window)

  const KUNCI = 'anodes-catatan-v1';

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


  // --- bentuk data ---
  // { kategori: ['Umum', ...], catatan: [{id, judul, isi, kategori, waktu}], aktifId }
  let data = { kategori: ['Umum'], catatan: [], aktifId: null };

  // ------------------------------------------------------------
  // simpan / muat dari localStorage
  // ------------------------------------------------------------
  function tulis() {
    try {
      localStorage.setItem(kunciData(), JSON.stringify(data));
      return true;
    } catch (e) {
      // localStorage penuh / diblokir
      console.warn('ANodes: gagal menyimpan', e);
      return false;
    }
  }

  function muat() {
    let mentah = null;
    try { mentah = localStorage.getItem(kunciData()); } catch (e) { mentah = null; }

    if (mentah) {
      try {
        const d = JSON.parse(mentah);
        if (d && Array.isArray(d.catatan)) {
          data = {
            kategori: Array.isArray(d.kategori) && d.kategori.length ? d.kategori : ['Umum'],
            catatan: d.catatan,
            aktifId: d.aktifId || (d.catatan[0] ? d.catatan[0].id : null)
          };
          rapikan();
          return;
        }
      } catch (e) { /* data rusak -> pakai contoh */ }
    }

    // pertama kali: isi contoh
    // ⚠️ K77c (1 Nov 2026) — `waktu` catatan contoh WAJIB **0**, bukan `Date.now()`.
    //    Sebab: perangkat BARU (HP / profil Chrome baru) membuat catatan contoh ini
    //    dengan waktu = SEKARANG. Saat sinkron, `gabungCatatan()` memakai aturan
    //    “yang `waktu`-nya lebih baru MENANG” ⇒ catatan CONTOH menimpa catatan
    //    ASLI pengguna di server (terukur: `masuk 0 · keluar 2` ⇒ data pengguna hilang).
    //    Dengan `waktu: 0`, catatan contoh SELALU kalah ⇒ catatan server yang menang.
    data = {
      kategori: ['Umum', 'Rencana'],
      catatan: [
        {
          id: 'awal-1',
          judul: 'Catatan Pertama',
          kategori: 'Umum',
          waktu: 0,
          isi: '<h1>Selamat datang di ANodes</h1>' +
               '<p>Tulis apa saja di sini. Gunakan toolbar di atas untuk membuat ' +
               '<b>tebal</b>, <i>miring</i>, judul, dan daftar.</p>' +
               '<p>Catatan kini <b>tersimpan otomatis</b> di browser ini.</p>'
        },
        {
          id: 'awal-2',
          judul: 'Rencana',
          kategori: 'Rencana',
          waktu: 0,
          isi: '<h2>Rencana</h2>' +
               '<ul><li>Bangun kerangka (tahap 1)</li>' +
               '<li>Simpan permanen + auto-save (tahap 2)</li>' +
               '<li>Ketik cepat markdown (tahap 3)</li></ul>'
        }
      ],
      aktifId: 'awal-1'
    };
    tulis();
  }

  // pastikan tiap catatan punya kategori & waktu yang sah
  function rapikan() {
    const setKat = new Set(data.kategori);
    data.catatan.forEach(c => {
      if (!c.kategori) c.kategori = 'Umum';
      /* ⚠️ K77f (1 Nov 2026) — `waktu: 0` itu SAH (catatan contoh, lihat K77c).
         Dulu ditulis `if (!c.waktu)` ⇒ angka 0 dianggap kosong ⇒ diganti `Date.now()`
         ⇒ catatan CONTOH menang saat sinkron & menimpa catatan asli di server.
         Terukur: APK baru memasang → `awal-1`/`awal-2` ber-`waktu` = sekarang. */
      if (c.waktu == null || c.waktu === '') c.waktu = Date.now();
      setKat.add(c.kategori);
    });
    data.kategori = [...setKat];
  }

  muat();

  // ------------------------------------------------------------
  const idBaru = () => 'c-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

  return {
    /* 🆕 K77i (1 Nov 2026) — BACA ULANG localStorage KE MEMORI.
       ⚠️ CACAT YANG DIPERBAIKI: `js/sinkron.js → ambil()` menulis hasil gabung
       LANGSUNG ke localStorage, sedangkan `ANodesStore` menyimpan salinan di
       variabel `data` (memori). Tanpa `muatUlang()`, layar tetap menampilkan
       keadaan LAMA walau localStorage sudah berisi catatan baru — terukur di
       APK: localStorage 1 catatan asli, layar masih "Selamat datang di ANodes".
       Dipakai `js/editor.js → muatUlangCatatan()` saat event
       `anodes-sinkron-masuk` diterima. */
    muatUlang() {
      muat();
      return data.catatan.length;
    },

    // ---------- daftar & kategori ----------
    daftar() {
      return data.catatan.map(c => ({
        id: c.id, judul: c.judul, isi: c.isi,
        kategori: c.kategori, waktu: c.waktu
      }));
    },

    daftarKategori() { return data.kategori.slice(); },

    /** buat kategori baru (kalau belum ada) */
    tambahKategori(nama) {
      nama = (nama || '').trim();
      if (!nama) return false;
      if (!data.kategori.includes(nama)) data.kategori.push(nama);
      tulis();
      return true;
    },

    // ---------- ambil / pilih ----------
    ambil(id) { return data.catatan.find(c => c.id === id) || null; },
    aktifId() { return data.aktifId; },

    setAktif(id) {
      if (data.catatan.some(c => c.id === id)) {
        data.aktifId = id;
        tulis();
      }
      return data.aktifId;
    },

    // ---------- buat / simpan / hapus ----------
    baru(kategori) {
      kategori = kategori || (data.kategori[0] || 'Umum');
      const c = {
        id: idBaru(), judul: 'Catatan Baru',
        isi: '<p></p>', kategori, waktu: Date.now()
      };
      data.catatan.unshift(c);
      data.aktifId = c.id;
      if (!data.kategori.includes(kategori)) data.kategori.push(kategori);
      tulis();
      return c;
    },

    simpan(id, judul, isi, kategori) {
      const c = data.catatan.find(x => x.id === id);
      if (!c) return false;
      c.judul = judul || 'Tanpa Judul';
      c.isi = isi;
      if (kategori) c.kategori = kategori;
      c.waktu = Date.now();
      if (kategori && !data.kategori.includes(kategori)) data.kategori.push(kategori);
      return tulis();
    },

    buang(id) {
      const i = data.catatan.findIndex(c => c.id === id);
      if (i === -1) return false;
      data.catatan.splice(i, 1);
      if (data.aktifId === id) {
        data.aktifId = data.catatan[0] ? data.catatan[0].id : null;
      }
      tulis();
      /* ⚠️ K77h (1 Nov 2026) — CATAT PENGHAPUSAN supaya tidak hidup lagi.
         Terukur: hapus catatan di PC → sinkron → catatan itu KEMBALI dari server
         (gabung bersifat MENAMBAH saja). `ANodesSinkron.catatHapus()` menulis
         tombstone yang ikut disinkronkan. */
      try {
        if (window.ANodesSinkron && typeof window.ANodesSinkron.catatHapus === 'function') {
          window.ANodesSinkron.catatHapus(id);
        }
      } catch (e) {}
      return true;
    },

    /** pindahkan catatan ke kategori lain */
    pindahKategori(id, kategori) {
      const c = data.catatan.find(x => x.id === id);
      if (!c) return false;
      c.kategori = kategori;
      if (!data.kategori.includes(kategori)) data.kategori.push(kategori);
      tulis();
      return true;
    },

    // ---------- pencarian ----------
    cari(teks) {
      const q = (teks || '').toLowerCase().trim();
      if (!q) return this.daftar();
      return this.daftar().filter(c => {
        const tmp = document.createElement('div');
        tmp.innerHTML = c.isi || '';
        const t = (tmp.textContent || '').toLowerCase();
        return c.judul.toLowerCase().includes(q) || t.includes(q);
      });
    },

    // ---------- ekspor / impor (cadangan) ----------
    ekspor() {
      return JSON.stringify({ app: 'ANodes', versi: 2, dibuat: Date.now(), ...data }, null, 2);
    },

    impor(jsonTeks) {
      try {
        const d = JSON.parse(jsonTeks);
        if (!d || !Array.isArray(d.catatan)) return { ok: false, pesan: 'Format tidak dikenali' };
        // gabung: buang id yang bentrok
        const ada = new Set(data.catatan.map(c => c.id));
        let masuk = 0;
        d.catatan.forEach(c => {
          if (!c.id || ada.has(c.id)) c.id = idBaru();
          if (!c.kategori) c.kategori = 'Umum';
          if (!c.waktu) c.waktu = Date.now();
          data.catatan.push(c);
          ada.add(c.id);
          masuk++;
        });
        if (Array.isArray(d.kategori)) {
          d.kategori.forEach(k => { if (!data.kategori.includes(k)) data.kategori.push(k); });
        }
        rapikan();
        tulis();
        return { ok: true, pesan: masuk + ' catatan dimasukkan', masuk };
      } catch (e) {
        return { ok: false, pesan: 'Berkas tidak bisa dibaca' };
      }
    }
  };
})();

// supaya bisa dipanggil dari berkas plugin (const tidak otomatis ada di window)
window.ANodesStore = ANodesStore;
