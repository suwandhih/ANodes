/* ============================================================
   ANodes — js/sinkron.js  (K77 · 30 Okt 2026)
   Sinkron catatan PC ⇄ HP lewat Cloudflare Worker + Turso.

   PRINSIP:
   - Token Turso TIDAK ada di berkas ini (disimpan di Worker).
   - Berkas ini hanya tahu ALAMAT Worker + KUNCI aplikasi.
   - K77b (1 Nov 2026): alamat + kunci aplikasi DITANAM sebagai BAWAAN
     supaya perangkat baru langsung bisa sinkron tanpa mengisi apa pun.
   - Tanpa internet: aplikasi tetap jalan normal (offline).
   - Bentrok: yang `waktu`-nya lebih baru MENANG, per catatan (bukan seluruh berkas).
   - Anti-dobel: catatan dicocokkan per `id`.

   KUNCI YANG DISINKRONKAN (lihat KUNCI_SINKRON):
     anodes-catatan-v1 · anodes-setting-v1 · anodes-kamus-pribadi ·
        anodes-rantai-v1 · anodes-bookmark-v1 · anodes-baca1tahun-v1
   ============================================================ */

const ANodesSinkron = (() => {
  'use strict';

  const VERSI = 'v3Nov-b';   // K100 (3 Nov 2026) — 👤 kunci per email

  const KUNCI_SETEL = 'anodes-sinkron-setel';   // {alamat, kunci, otomatis}
  const KUNCI_WAKTU = 'anodes-sinkron-waktu';   // {kunci: waktuTerakhirBerubah}

  /* ⚠️ K77h (1 Nov 2026) — DAFTAR HAPUS (tombstone).
     Terukur: menghapus catatan di PC lalu sinkron ⇒ catatan itu **KEMBALI**
     dari server (gabung bersifat MENAMBAH saja). Bukti: PC 1 catatan →
     `ambil()` ⇒ *“4 catatan masuk”*.
     Perbaikan: setiap `buang()` mencatat `{id: waktuHapus}` di sini; saat
     gabung, id yang ada di daftar hapus **DIBUANG** dari kedua sisi.
     Daftar ini ikut disinkronkan supaya perangkat lain juga ikut menghapus. */
  const KUNCI_HAPUS = 'anodes-sinkron-hapus';   // {id: waktuHapus}
  let daftarHapus = {};

  // ------------------------------------------------------------
  // SETELAN BAWAAN (K77b · 1 Nov 2026)
  //   Permintaan pengguna: *“sync data dengan server di buat permanent saja..
  //   supaya setiap sync saya tidak perlu mengisi..”*
  //   ⇒ alamat Worker + kunci aplikasi DITANAM di sini supaya perangkat baru
  //     (HP / profil Chrome baru / setelah data dibersihkan) langsung bisa
  //     sinkron TANPA mengisi apa pun.
  //   ⚠️ Token Turso TETAP hanya di Worker — tidak ada di berkas ini.
  //   ⚠️ Kolom di modal tetap bisa diubah kalau nanti ganti Worker sendiri.
  // ------------------------------------------------------------
  const BAWAAN = {
    alamat: 'https://anodes-sync.suwandhih.workers.dev',
    kunci: 'anodes-suwandhi-2026',
    otomatis: true
  };

  // kunci localStorage yang ikut disinkronkan
  const KUNCI_SINKRON = [
    'anodes-catatan-v1',
    'anodes-setting-v1',
    'anodes-kamus-pribadi',
    'anodes-rantai-v1',
    // K81 (30 Okt 2026) — 📌 Bookmark Ayat ikut disinkronkan
    //   (keputusan Bapak: “Ya .. ikut disinkronkan”)
        'anodes-bookmark-v1',
        // K96 (3 Nov 2026) — 🗓️ Bacaan Alkitab 1 Tahun ikut disinkronkan
        //   (keputusan Bapak: “Ya — tambah kunci sinkron (urutan baca sama di PC & HP)”)
        'anodes-baca1tahun-v1'
      ];

  let setel = { alamat: '', kunci: '', otomatis: true };
  let waktuLokal = {};        // {kunci: waktu}
  let sedangJalan = false;
  let timerKirim = null;
  let timerAmbil = null;
  let terakhir = { waktu: 0, pesan: '', ok: null };

  // ------------------------------------------------------------
  // setelan
  // ------------------------------------------------------------
  function muatSetel() {
    // mulai dari setelan bawaan (sudah tertanam) — bukan kosong
    setel = {
      alamat: BAWAAN.alamat,
      kunci: BAWAAN.kunci,
      otomatis: BAWAAN.otomatis
    };

    try {
      const m = localStorage.getItem(KUNCI_SETEL);
      if (m) {
        const d = JSON.parse(m);
        // ⚠️ kolom yang KOSONG di simpanan TIDAK boleh menghapus bawaan
        //    (dulu: simpanan kosong menimpa bawaan ⇒ pengguna harus mengisi ulang)
        const alamat = String(d.alamat || '').trim();
        const kunci = String(d.kunci || '');
        if (alamat) setel.alamat = alamat;
        if (kunci) setel.kunci = kunci;
        if (typeof d.otomatis === 'boolean') setel.otomatis = d.otomatis;
      }
    } catch (e) { /* pakai bawaan */ }

    try {
      const w = localStorage.getItem(KUNCI_WAKTU);
      if (w) waktuLokal = JSON.parse(w) || {};
    } catch (e) { waktuLokal = {}; }

    try {
      const h = localStorage.getItem(KUNCI_HAPUS);
      if (h) daftarHapus = JSON.parse(h) || {};
    } catch (e) { daftarHapus = {}; }
  }

  function simpanSetel(baru) {
    const alamat = String((baru && baru.alamat) || '').trim().replace(/\/+$/, '');
    const kunci = String((baru && baru.kunci) || '');
    setel = {
      // kosong ⇒ kembali ke bawaan (jangan simpan kosong)
      alamat: alamat || BAWAAN.alamat,
      kunci: kunci || BAWAAN.kunci,
      otomatis: baru && baru.otomatis !== false
    };
    try { localStorage.setItem(KUNCI_SETEL, JSON.stringify(setel)); } catch (e) {}
    return setel;
  }

  /** kembalikan setelan ke bawaan pabrik (dipakai tombol “Setelan bawaan”) */
  function setelBawaan() {
    setel = { alamat: BAWAAN.alamat, kunci: BAWAAN.kunci, otomatis: BAWAAN.otomatis };
    try { localStorage.setItem(KUNCI_SETEL, JSON.stringify(setel)); } catch (e) {}
    return setel;
  }

  function simpanWaktu() {
    try { localStorage.setItem(KUNCI_WAKTU, JSON.stringify(waktuLokal)); } catch (e) {}
  }

  function simpanHapus() {
    try { localStorage.setItem(KUNCI_HAPUS, JSON.stringify(daftarHapus)); } catch (e) {}
  }

  /** catat bahwa sebuah catatan DIHAPUS (dipakai `ANodesStore.buang`) */
  function catatHapus(id) {
    if (!id) return;
    daftarHapus[String(id)] = Date.now();
    simpanHapus();
    tandaiBerubah('anodes-catatan-v1');
  }

  /** daftar id yang sudah dihapus (untuk uji & pembersihan) */
  function hapusTercatat() { return Object.keys(daftarHapus); }

  /** lupakan satu id dari daftar hapus (kalau catatan itu dibuat ulang) */
  function lupakanHapus(id) {
    if (!id) return;
    if (daftarHapus[String(id)]) { delete daftarHapus[String(id)]; simpanHapus(); }
  }

  const siap = () => !!(setel.alamat && setel.kunci);

  // ------------------------------------------------------------
  // baca / tulis localStorage
  // ------------------------------------------------------------
  // ------------------------------------------------------------
  // 👤 K100 (3 Nov 2026) — SEMUA kunci data dipisah per email
  //   kLokal(k) = kunci milik email yang aktif di perangkat ini
  //   kJauh(k)  = nama baris di SERVER  (email|kunci) ⇒ antar pengguna
  //               tidak saling menimpa
  //   Kunci setelan sinkron / waktu / hapus TIDAK diberi awalan supaya
  //   tetap bisa ditemukan saat email belum diisi.
  // ------------------------------------------------------------
  function kLokal(k) {
    const P = window.ANodesPengguna;
    return (P && P.kunci) ? P.kunci(k) : k;
  }

  function kJauh(k) {
    const P = window.ANodesPengguna;
    const e = (P && P.email) ? P.email() : '';
    return e ? e + '|' + k : k;
  }

  function baca(kunci) {
    try { return localStorage.getItem(kLokal(kunci)); } catch (e) { return null; }
  }

  function tulis(kunci, isi) {
    try { localStorage.setItem(kLokal(kunci), isi); return true; } catch (e) { return false; }
  }

  /** waktu perubahan lokal sebuah kunci (dibuat kalau belum ada) */
  function waktuDari(kunci) {
    if (!waktuLokal[kunci]) {
      waktuLokal[kunci] = Date.now();
      simpanWaktu();
    }
    return waktuLokal[kunci];
  }

  // ------------------------------------------------------------
  // HTTP ke Worker
  // ------------------------------------------------------------
  /** ubah galat jaringan menjadi kalimat yang bisa dimengerti pengguna */
  function pesanRamah(e) {
    const t = String((e && e.message) || e || '');
    if (/Failed to fetch|NetworkError|ERR_CONNECTION|ERR_NAME|ERR_INTERNET/i.test(t)) {
      return 'Tidak tersambung ke server — periksa internet & alamat Worker';
    }
    if (/Kunci aplikasi salah/i.test(t)) {
      return 'Kunci aplikasi salah — samakan dengan KUNCI_APP di Worker';
    }
    if (/TURSO_URL|TURSO_TOKEN/i.test(t)) {
      return 'Worker belum diisi TURSO_URL / TURSO_TOKEN';
    }
    if (/Turso menolak \(401\)/i.test(t)) {
      return 'Token database ditolak — buat token baru di dasbor Turso';
    }
    if (/Turso menolak \(404\)/i.test(t)) {
      return 'Alamat database salah — pastikan bentuknya libsql://…';
    }
    return t || 'Galat tidak diketahui';
  }

  /* Android mengerjakan HTTP melalui OkHttp dan mengirim jawaban secara asinkron. */
  function jembatanAndroid() {
    try { return window.ANodesAndroid || null; } catch (e) { return null; }
  }

  let nomorHttp = 0;
  const sesiHttp = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  const menungguHttp = new Map();
  window.__anodesHttpSelesai = (id, hasil) => {
    const tugas = menungguHttp.get(String(id));
    if (!tugas) return;
    menungguHttp.delete(String(id));
    clearTimeout(tugas.timer);
    tugas.selesai(hasil);
  };

  /** Jembatan menjawab kemudian agar JavaScript tidak menunggu jaringan. */
  async function panggilAndroid(metode, alamat, badan) {
    const A = jembatanAndroid();
    if (!A || typeof A.httpKirimAsync !== 'function') {
      throw new Error('Jembatan sinkron Android perlu diperbarui');
    }
    const id = sesiHttp + '-' + (++nomorHttp);
    const mentah = await new Promise((selesai, gagal) => {
      const timer = setTimeout(() => {
        menungguHttp.delete(id);
        gagal(new Error('Waktu menunggu sinkron habis'));
      }, 65000);
      menungguHttp.set(id, { selesai, timer });
      try {
        A.httpKirimAsync(metode, alamat, setel.kunci, badan || '', id);
      } catch (e) {
        clearTimeout(timer);
        menungguHttp.delete(id);
        gagal(e);
      }
    });
    let bungkus = null;
    try { bungkus = JSON.parse(mentah); } catch (e) { bungkus = null; }
    if (!bungkus) throw new Error('Jawaban jembatan Android tidak terbaca');
    if (!bungkus.ok) throw new Error(pesanRamah(new Error(bungkus.pesan || '')));
    let hasil = null;
    try { hasil = JSON.parse(bungkus.isi || 'null'); } catch (e) { hasil = null; }
    const status = Number(bungkus.status) || 0;
    if (status < 200 || status >= 300 || !hasil || hasil.ok === false) {
      const pesan = (hasil && hasil.pesan) || ('HTTP ' + status);
      throw new Error(pesanRamah(new Error(pesan)));
    }
    return hasil;
  }

  async function panggil(jalur, opsi) {
    if (!siap()) throw new Error('Sinkron belum diatur (alamat Worker / kunci kosong)');
    const alamat = setel.alamat + jalur;
    const metode = (opsi && opsi.method) || 'GET';
    const badan = opsi && opsi.body ? JSON.stringify(opsi.body) : '';

    // 1) APK Android → pakai jembatan native (WebView memblokir CORS)
    if (jembatanAndroid()) return panggilAndroid(metode, alamat, badan);

    // 2) browser biasa (PC / Chrome HP) → fetch seperti semula
    let balasan;
    try {
      balasan = await fetch(alamat, {
        method: metode,
        headers: {
          'Content-Type': 'application/json',
          'X-Kunci': setel.kunci
        },
        body: badan || undefined
      });
    } catch (e) {
      throw new Error(pesanRamah(e));
    }
    let hasil = null;
    try { hasil = await balasan.json(); } catch (e) { hasil = null; }
    if (!balasan.ok || !hasil || hasil.ok === false) {
      const pesan = (hasil && hasil.pesan) || ('HTTP ' + balasan.status);
      throw new Error(pesanRamah(new Error(pesan)));
    }
    return hasil;
  }

  // ------------------------------------------------------------
  // GABUNG catatan (inti anti-bentrok & anti-dobel)
  // ------------------------------------------------------------
  /* ⚠️ K77c (1 Nov 2026) — PENGENAL CATATAN CONTOH.
     Perangkat baru membuat 2 catatan contoh (`awal-1` & `awal-2`). Catatan itu
     TIDAK BOLEH menimpa catatan asli pengguna di server. Dikenali dari ISINYA
     (bukan hanya `waktu`), supaya perangkat LAMA yang catatan contohnya masih
     ber-`waktu` = sekarang pun tetap aman. */
  const TANDA_CONTOH = [
    'Selamat datang di ANodes',
    'Bangun kerangka (tahap 1)'
  ];

  function ialahContoh(c) {
    if (!c) return false;
    if (Number(c.waktu) === 0) return true;
    const isi = String(c.isi || '');
    return TANDA_CONTOH.some(t => isi.indexOf(t) >= 0);
  }

  /**
   * Gabungkan dua berkas catatan ANodes.
   * @param {object} lokal   {kategori, catatan, aktifId}
   * @param {object} jauh    bentuk sama
   * @returns {{hasil:object, masuk:number, keluar:number, ubah:boolean}}
   */
  function gabungCatatan(lokal, jauh) {
    const hasil = {
      kategori: Array.isArray(lokal && lokal.kategori) ? lokal.kategori.slice() : ['Umum'],
      catatan: Array.isArray(lokal && lokal.catatan) ? lokal.catatan.slice() : [],
      aktifId: (lokal && lokal.aktifId) || null
    };
    const peta = new Map();
    hasil.catatan.forEach(c => { if (c && c.id) peta.set(c.id, c); });

    let masuk = 0;      // dari jauh -> lokal
    let keluar = 0;     // lokal lebih baru -> perlu dikirim
    let ubah = false;

    /* ⚠️ K77f (1 Nov 2026) — CATATAN CONTOH DARI SERVER DILEWATI.
       Terukur: APK baru dipasang → sinkron → daftar berisi 3 catatan
       (`awal-1` "Catatan Pertama" + `awal-2` "Rencana" + catatan asli).
       Aturan: kalau server SUDAH punya catatan asli, catatan contoh di server
       itu sampah ⇒ jangan dimasukkan ke perangkat mana pun. */
    const daftarJauh = (jauh && Array.isArray(jauh.catatan)) ? jauh.catatan : [];
    const adaAsliJauh = daftarJauh.some(c => c && !ialahContoh(c));

    daftarJauh.forEach(c => {
      if (!c || !c.id) return;
      const ada = peta.get(c.id);
      if (!ada) {
        if (adaAsliJauh && ialahContoh(c)) return;   // contoh dari server ⇒ lewati
        hasil.catatan.push(c);
        peta.set(c.id, c);
        masuk++;
        ubah = true;
        return;
      }
      const wLokal = Number(ada.waktu) || 0;
      const wJauh = Number(c.waktu) || 0;

      /* ⚠️ K77c (1 Nov 2026) — CATATAN CONTOH TIDAK PERNAH MENANG.
         Terukur sebelum perbaikan: perangkat baru ⇒ `masuk 0 · keluar 2`
         ⇒ catatan CONTOH menimpa catatan ASLI pengguna di server. */
      const contohLokal = ialahContoh(ada);
      const contohJauh = ialahContoh(c);

      if (contohLokal && !contohJauh) {
        // lokal masih contoh, server sudah asli ⇒ pakai server
        const i = hasil.catatan.findIndex(x => x.id === c.id);
        if (i >= 0) hasil.catatan[i] = c;
        peta.set(c.id, c);
        masuk++;
        ubah = true;
        return;
      }
      if (contohJauh && !contohLokal) {
        keluar++;          // server masih contoh, lokal sudah asli ⇒ kirim yang asli
        return;
      }

      if (wJauh > wLokal) {
        // versi jauh lebih baru -> pakai versi jauh
        const i = hasil.catatan.findIndex(x => x.id === c.id);
        if (i >= 0) hasil.catatan[i] = c;
        peta.set(c.id, c);
        masuk++;
        ubah = true;
      } else if (wLokal > wJauh) {
        keluar++;
      }
    });

    /* ⚠️ K77f (1 Nov 2026) — CATATAN CONTOH DIBUANG kalau sudah ada catatan ASLI.
       Catatan contoh (`awal-1` "Catatan Pertama" & `awal-2` "Rencana") hanya berguna
       saat aplikasi benar-benar kosong. Begitu ada catatan asli (dari server atau
       ketikan pengguna), contoh itu jadi sampah di daftar.
       Terukur: APK baru dipasang → sinkron → daftar berisi 3 catatan (2 contoh + 1 asli). */
    if (hasil.catatan.some(c => c && !ialahContoh(c))) {
      const sebelum = hasil.catatan.length;
      hasil.catatan = hasil.catatan.filter(c => c && !ialahContoh(c));
      if (hasil.catatan.length !== sebelum) ubah = true;
    }

    /* ⚠️ K77h (1 Nov 2026) — CATATAN YANG SUDAH DIHAPUS JANGAN HIDUP LAGI.
       Terukur: hapus catatan di PC → sinkron → catatan itu KEMBALI dari server
       (gabung bersifat MENAMBAH saja). Sekarang id di `daftarHapus` dibuang
       dari kedua sisi. */
    const hapus = (jauh && jauh.hapus && typeof jauh.hapus === 'object') ? jauh.hapus : {};
    // gabungkan daftar hapus (yang paling baru menang)
    Object.keys(hapus).forEach(id => {
      const wJauh = Number(hapus[id]) || 0;
      const wLokal = Number(daftarHapus[id]) || 0;
      if (wJauh > wLokal) { daftarHapus[id] = wJauh; ubah = true; }
    });
    const idHapus = Object.keys(daftarHapus);
    if (idHapus.length) {
      const sebelum = hasil.catatan.length;
      hasil.catatan = hasil.catatan.filter(c => !(c && daftarHapus[c.id]));
      if (hasil.catatan.length !== sebelum) ubah = true;
    }

    // kategori digabung (tanpa dobel)
    const setKat = new Set(hasil.kategori);
    const katJauh = (jauh && Array.isArray(jauh.kategori)) ? jauh.kategori : [];
    katJauh.forEach(k => { if (k && !setKat.has(k)) { setKat.add(k); ubah = true; } });
    hasil.kategori = [...setKat];

    // aktifId harus menunjuk catatan yang ada
    if (!hasil.catatan.some(c => c.id === hasil.aktifId)) {
      hasil.aktifId = hasil.catatan[0] ? hasil.catatan[0].id : null;
    }

    return { hasil, masuk, keluar, ubah };
  }

  // ------------------------------------------------------------
  // AMBIL (server -> perangkat)
  // ------------------------------------------------------------
  async function ambil() {
    if (modeUji()) return { adaPerubahan: false, ringkas: [], dilewati: 'mode uji' };
    const hasil = await panggil('/ambil', { method: 'GET' });
    const baris = Array.isArray(hasil.data) ? hasil.data : [];
    let adaPerubahan = false;
    let ringkas = [];

    baris.forEach(b => {
      if (!b || !b.kunci) return;

      // 👤 K100 — di server kunci berbentuk <email>|anodes-….
      //   • baris milik email LAIN ⇒ dilewati
      //   • baris tanpa awalan (data sebelum pemisahan email) hanya dipakai
      //     kalau email belum diisi
      const P = window.ANodesPengguna;
      const emailAktif = (P && P.email) ? P.email() : '';
      const garis = b.kunci.lastIndexOf('|');
      let kunciDasar = b.kunci;
      if (garis >= 0) {
        const emailBaris = b.kunci.slice(0, garis);
        kunciDasar = b.kunci.slice(garis + 1);
        if (emailBaris !== emailAktif) return;
      } else if (emailAktif) {
        return;
      }

      if (KUNCI_SINKRON.indexOf(kunciDasar) < 0) return;

      const wJauh = Number(b.waktu) || 0;
      const wLokal = Number(waktuLokal[kunciDasar]) || 0;

      if (kunciDasar === 'anodes-catatan-v1') {
        let lokal = null, jauh = null;
        try { lokal = JSON.parse(baca(kunciDasar) || 'null'); } catch (e) { lokal = null; }
        try { jauh = JSON.parse(b.isi || 'null'); } catch (e) { jauh = null; }
        if (!jauh || !Array.isArray(jauh.catatan)) return;

        const g = gabungCatatan(lokal, jauh);
        if (g.ubah) {
          tulis(kunciDasar, JSON.stringify(g.hasil));
          waktuLokal[kunciDasar] = Math.max(wLokal, wJauh);
          simpanWaktu();
          simpanHapus();                 // K77h — daftar hapus ikut diperbarui
          adaPerubahan = true;
          ringkas.push(g.masuk + ' catatan masuk');
        }
        return;
      }

      // kunci lain: cukup bandingkan waktu
      if (wJauh > wLokal) {
        tulis(kunciDasar, b.isi);
        waktuLokal[kunciDasar] = wJauh;
        simpanWaktu();
        adaPerubahan = true;
      }
    });

    if (adaPerubahan) {
      // beri tahu aplikasi supaya tampilan ikut segar
      try {
        window.dispatchEvent(new CustomEvent('anodes-sinkron-masuk', { detail: { ringkas } }));
      } catch (e) {}
    }
    return { adaPerubahan, ringkas };
  }

  // ------------------------------------------------------------
  // KIRIM (perangkat -> server)
  // ------------------------------------------------------------
  /* ⚠️ K77f (1 Nov 2026) — CATATAN CONTOH TIDAK BOLEH DIKIRIM.
     Terukur: APK baru dipasang → sinkron → server berisi 3 catatan
     (`awal-1` "Catatan Pertama" + `awal-2` "Rencana" + catatan asli).
     Dua aturan di sini:
       1. catatan contoh DIBUANG dari kiriman;
       2. kalau setelah dibuang TIDAK ADA catatan asli sama sekali ⇒
          `anodes-catatan-v1` TIDAK dikirim (kalau dikirim, server akan
          ditimpa daftar kosong ⇒ catatan asli pengguna HILANG). */
  function saringContoh(isi) {
    let d = null;
    try { d = JSON.parse(isi || 'null'); } catch (e) { return { isi, adaAsli: false }; }
    if (!d || !Array.isArray(d.catatan)) return { isi, adaAsli: false };
    const asli = d.catatan.filter(c => !ialahContoh(c));
    if (!asli.length) return { isi: null, adaAsli: false };
    if (asli.length === d.catatan.length) return { isi, adaAsli: true };
    const hasil = Object.assign({}, d, { catatan: asli });
    if (!asli.some(c => c.id === hasil.aktifId)) hasil.aktifId = asli[0].id;
    return { isi: JSON.stringify(hasil), adaAsli: true };
  }

  /* ⚠️ K77g (1 Nov 2026) — MODE UJI: JANGAN MENYENTUH SERVER.
     Terukur: menjalankan `tools/uji-cepat.js` di `index.html` membuat catatan UJI
     (`awal-1` berisi "…sertaxyzwqv Taurat…") TERKIRIM ke server sungguhan, karena
     sinkron otomatis hidup & `tandaiBerubah()` dipanggil saat uji menyimpan catatan.
     Alat uji menyalakan `window.__ANODES_UJI = true` ⇒ semua kirim/ambil DIBATALKAN. */
  function modeUji() {
    try { return window.__ANODES_UJI === true; } catch (e) { return false; }
  }

  async function kirim() {
    if (modeUji()) return { ditulis: 0, dilewati: 'mode uji' };
    const data = [];
    KUNCI_SINKRON.forEach(k => {
      const mentah = baca(k);
      if (mentah == null) return;
      let isi = mentah;
      if (k === 'anodes-catatan-v1') {
        const s = saringContoh(mentah);
        if (!s.adaAsli) return;          // belum ada catatan asli ⇒ jangan kirim
        isi = s.isi;
        /* K77h — sertakan daftar hapus di dalam berkas catatan supaya
           perangkat lain ikut menghapus (tanpa kunci sinkron baru). */
        try {
          const d = JSON.parse(isi);
          if (d && typeof d === 'object') {
            d.hapus = daftarHapus;
            isi = JSON.stringify(d);
          }
        } catch (e) {}
      }
      data.push({ kunci: kJauh(k), isi: isi, waktu: waktuDari(k) });
    });
    if (!data.length) return { ditulis: 0 };
    return await panggil('/simpan', { method: 'POST', body: { data } });
  }

  // ------------------------------------------------------------
  // SINKRON PENUH (kirim lalu ambil)
  // ------------------------------------------------------------
  async function sekarang(opsi) {
    if (modeUji()) return { ok: false, pesan: 'Mode uji — sinkron dilewati' };
    if (sedangJalan) return { ok: false, pesan: 'Sinkron sedang berjalan' };
    if (!siap()) return { ok: false, pesan: 'Sinkron belum diatur' };

    sedangJalan = true;
    const senyap = !!(opsi && opsi.senyap);
    try {
      if (!senyap) kabar('☁️ Menyinkronkan…', null);

      // 1) ambil dulu supaya tidak menimpa data baru di server
      const a = await ambil();
      // 2) kirim keadaan lokal (yang lebih baru)
      const k = await kirim();
      // 3) ambil sekali lagi (kalau perangkat lain menulis di antaranya)
      const a2 = await ambil();

      const pesan = 'Selesai · ' + (k.ditulis || 0) + ' kunci terkirim' +
        (a.ringkas && a.ringkas.length ? ' · ' + a.ringkas.join(', ') : '') +
        (a2.ringkas && a2.ringkas.length ? ' · ' + a2.ringkas.join(', ') : '');

      terakhir = { waktu: Date.now(), pesan, ok: true };
      if (!senyap) kabar('✅ ' + pesan, true);
      return { ok: true, pesan, masuk: (a.ringkas || []).concat(a2.ringkas || []) };
    } catch (e) {
      const pesan = pesanRamah(e);
      terakhir = { waktu: Date.now(), pesan, ok: false };
      if (!senyap) kabar('⚠️ ' + pesan, false);
      return { ok: false, pesan };
    } finally {
      sedangJalan = false;
    }
  }

  // ------------------------------------------------------------
  // OTOMATIS
  // ------------------------------------------------------------
  /** dipanggil setiap kali catatan disimpan */
  function tandaiBerubah(kunci) {
    kunci = kunci || 'anodes-catatan-v1';
    waktuLokal[kunci] = Date.now();
    simpanWaktu();
    if (modeUji()) return;                 // K77g — jangan jadwalkan kirim saat uji
    if (!setel.otomatis || !siap()) return;
    if (timerKirim) clearTimeout(timerKirim);
    timerKirim = setTimeout(() => {
      timerKirim = null;
      sekarang({ senyap: true });
    }, 3000);
  }

  /** ambil berkala saat aplikasi terbuka (kalau otomatis hidup) */
  function mulaiOtomatis() {
    if (timerAmbil) clearInterval(timerAmbil);
    if (modeUji()) return;                 // K77g — jangan ambil berkala saat uji
    if (!setel.otomatis || !siap()) return;
    timerAmbil = setInterval(() => {
      if (document.hidden) return;      // hemat: jangan saat aplikasi di latar
      sekarang({ senyap: true });
    }, 60000);
  }

  function hentikanOtomatis() {
    if (timerAmbil) { clearInterval(timerAmbil); timerAmbil = null; }
    if (timerKirim) { clearTimeout(timerKirim); timerKirim = null; }
  }

  // ------------------------------------------------------------
  // kabar ke layar
  // ------------------------------------------------------------
  function kabar(pesan, ok) {
    try {
      if (window.ANodesEditor && typeof window.ANodesEditor.toast === 'function') {
        window.ANodesEditor.toast(pesan);
        return;
      }
    } catch (e) {}
    console.log('ANodes sinkron:', pesan);
  }

  // ------------------------------------------------------------
  // uji sambungan
  // ------------------------------------------------------------
  async function uji() {
    try {
      const h = await panggil('/ambil', { method: 'GET' });
      const n = Array.isArray(h.data) ? h.data.length : 0;
      return { ok: true, pesan: 'Sambungan berhasil · ' + n + ' kunci di server' };
    } catch (e) {
      return { ok: false, pesan: pesanRamah(e) };
    }
  }

  // ------------------------------------------------------------
  // mulai
  // ------------------------------------------------------------
  muatSetel();

  if (typeof document !== 'undefined') {
    const siapkan = () => {
      if (setel.otomatis && siap()) {
        // ambil data terbaru sekali saat aplikasi dibuka
        setTimeout(() => sekarang({ senyap: true }), 2500);
        mulaiOtomatis();
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', siapkan);
    } else {
      setTimeout(siapkan, 0);
    }
  }

  return {
    VERSI,
    KUNCI_SINKRON,
    BAWAAN: { ...BAWAAN },
    siap,
    setel: () => ({ ...setel }),
    simpanSetel,
    setelBawaan,
    sekarang,
    ambil,
    kirim,
    uji,
    tandaiBerubah,
    mulaiOtomatis,
    hentikanOtomatis,
    gabungCatatan,
    // K77h — penghapusan permanen (tombstone)
    catatHapus,
    hapusTercatat,
    lupakanHapus,
    daftarHapus: () => ({ ...daftarHapus }),
    terakhir: () => ({ ...terakhir }),
    sedangJalan: () => sedangJalan
  };
})();

window.ANodesSinkron = ANodesSinkron;
