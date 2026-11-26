/* ============================================================
   ANodes — plugin/alkitab/alkitab.js
   MESIN PLUGIN ALKITAB (tahap c)
   ------------------------------------------------------------
   Tugasnya:
     1. Menyediakan data Alkitab untuk dipakai ANodes.
     2. Menyimpan data itu di IndexedDB ("gudang besar browser")
        supaya next time TIDAK perlu membaca ulang berkas 5 MB.
     3. Menyediakan jalan masuk sederhana: kitab(), pasal(), ayat().

   Kenapa IndexedDB?
     localStorage hanya ±5 MB — tidak cukup untuk Alkitab.
     IndexedDB jauh lebih besar dan memang untuk data sebesar ini.

   Kenapa data dimuat lewat tag <script>, bukan fetch?
     Saat halaman dibuka dengan file:// , Chrome melarang fetch/XHR
     ke berkas lain. Yang diizinkan hanya pemuatan lewat tag script.
   ============================================================ */

window.ANodesAlkitab = (function () {
  'use strict';

  const NAMA_DB   = 'anodes-plugin-db';
  const NAMA_TOKO = 'data';
  const KUNCI     = 'alkitab-tb';
  const BERKAS_DATA = 'plugin/alkitab/data/alkitab-tb.js';

  let data = null;        // data Alkitab yang sedang dipakai
  let sedangMuat = null;  // kalau sedang memuat, simpan janjinya (biar tidak dobel)

  // ------------------------------------------------------------
  // IndexedDB — gudang besar browser
  // ------------------------------------------------------------
  function bukaDB() {
    return new Promise((selesai, gagal) => {
      if (!window.indexedDB) return gagal(new Error('IndexedDB tidak didukung'));
      const minta = indexedDB.open(NAMA_DB, 1);
      minta.onupgradeneeded = () => {
        const db = minta.result;
        if (!db.objectStoreNames.contains(NAMA_TOKO)) db.createObjectStore(NAMA_TOKO);
      };
      minta.onsuccess = () => selesai(minta.result);
      minta.onerror = () => gagal(minta.error || new Error('gagal membuka IndexedDB'));
    });
  }

  async function bacaSimpanan() {
    try {
      const db = await bukaDB();
      return await new Promise((selesai) => {
        const tx = db.transaction(NAMA_TOKO, 'readonly');
        const minta = tx.objectStore(NAMA_TOKO).get(KUNCI);
        minta.onsuccess = () => selesai(minta.result || null);
        minta.onerror = () => selesai(null);
      });
    } catch (e) {
      return null;
    }
  }

  async function tulisSimpanan(isi) {
    try {
      const db = await bukaDB();
      return await new Promise((selesai) => {
        const tx = db.transaction(NAMA_TOKO, 'readwrite');
        tx.objectStore(NAMA_TOKO).put(isi, KUNCI);
        tx.oncomplete = () => selesai(true);
        tx.onerror = () => selesai(false);
      });
    } catch (e) {
      return false;
    }
  }

  // ------------------------------------------------------------
  // muat berkas data lewat tag <script>
  // ------------------------------------------------------------
  function muatBerkas(src, saatProses) {
    return new Promise((selesai, gagal) => {
      if (saatProses) saatProses(0, 'membaca berkas');
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => { if (saatProses) saatProses(100, 'selesai'); selesai(); };
      s.onerror = () => gagal(new Error('berkas data tidak ditemukan: ' + src));
      document.head.appendChild(s);
    });
  }

  // ------------------------------------------------------------
  // muat() — jalan utama
  //   lapor(persen 0..100, tahap) dipakai untuk menampilkan kemajuan
  // ------------------------------------------------------------
  function muat(lapor) {
    if (data) return Promise.resolve({ dari: 'sudah-siap', jumlahKitab: data.kitab.length });
    if (sedangMuat) return sedangMuat;

    const kabari = (p, t) => { if (typeof lapor === 'function') lapor(p, t); };

    sedangMuat = (async () => {
      // 1) data sudah ada di halaman? (mis. versi satu berkas) — langsung pakai
      if (window.ANodesAlkitabData && window.ANodesAlkitabData.kitab) {
        kabari(20, 'menyiapkan');
        data = window.ANodesAlkitabData;
        kabari(60, 'menyimpan agar cepat dibuka lagi');
        await tulisSimpanan(data);
        kabari(100, 'selesai');
        sedangMuat = null;
        return { dari: 'berkas-halaman', jumlahKitab: data.kitab.length };
      }

      // 2) sudah pernah disimpan di gudang besar? — pakai itu (cepat, tanpa 5 MB)
      kabari(10, 'memeriksa simpanan');
      const simpanan = await bacaSimpanan();
      if (simpanan && simpanan.meta && simpanan.kitab) {
        data = simpanan;
        kabari(100, 'selesai');
        sedangMuat = null;
        return { dari: 'simpanan', jumlahKitab: data.kitab.length };
      }

      // 3) belum ada — baca berkas data (sekali saja)
      kabari(25, 'membaca data Alkitab');
      await muatBerkas(BERKAS_DATA, kabari);

      if (!window.ANodesAlkitabData || !window.ANodesAlkitabData.kitab) {
        sedangMuat = null;
        throw new Error('data Alkitab tidak terbaca');
      }

      data = window.ANodesAlkitabData;
      kabari(70, 'menyimpan agar cepat dibuka lagi');
      await tulisSimpanan(data);
      kabari(100, 'selesai');
      sedangMuat = null;
      return { dari: 'berkas-plugin', jumlahKitab: data.kitab.length };
    })().catch((e) => { sedangMuat = null; throw e; });

    return sedangMuat;
  }

  // ------------------------------------------------------------
  // jalan masuk sederhana untuk fitur lain (tahap d–g)
  // ------------------------------------------------------------
  const siap = () => !!data;

  function daftarKitab() {
    if (!data) return [];
    return data.kitab.map((k, i) => ({ no: i + 1, nama: k.nama, singkatan: k.singkatan }));
  }

  function ambilPasal(noKitab, noPasal) {
    if (!data) return null;
    const k = data.kitab[noKitab - 1];
    if (!k) return null;
    const p = (k.pasal || []).find(x => x.no === Number(noPasal));
    if (!p) return null;
    return { nama: k.nama, singkatan: k.singkatan, no: p.no, ayat: p.ayat || [] };
  }

  function ambilAyat(noKitab, noPasal, noAyat) {
    const p = ambilPasal(noKitab, noPasal);
    if (!p) return null;
    return (p.ayat || []).find(a => a.no === Number(noAyat)) || null;
  }

  // jumlah pasal tiap kitab (dipakai untuk pilih kitab → pasal)
  function jumlahPasal(noKitab) {
    if (!data) return 0;
    const k = data.kitab[noKitab - 1];
    return k ? (k.pasal || []).length : 0;
  }

  function meta() {
    return (data && data.meta) ? data.meta : (window.ANodesAlkitabData || {}).meta || null;
  }

  // ------------------------------------------------------------
  // PENGENALAN NAMA AYAT (tahap d)
  //   "ibr 11:1" · "ibrani 11:1-10" · "1 Kor 13:4" · "mazmur 23"
  //   Nama boleh salah tulis sedikit.
  // ------------------------------------------------------------

  // sebutan lain yang sering dipakai orang (selain nama & singkatan resmi).
  // ⚠️ JANGAN memasukkan kata pendek yang lazim dalam kalimat
  //    (mis. "dan", "am", "mi", "ob", "za", "ho", "im", "ul") —
  //    dulu "dan 1" sempat terbaca "Daniel 1".
  //    Yang resmi sudah ditangani lewat singkatan kitab (Am, Mi, Ob, Za, Ho, Im, Ul…).
  const SEBUTAN = {
    'mas': 'Mzm', 'maz': 'Mzm', 'mzm': 'Mzm', 'mzmr': 'Mzm', 'mz': 'Mzm', 'mur': 'Mzm',
    'mazmur': 'Mzm', 'pengkhotbah': 'Pkh',
    'kid': 'KiA', 'kia': 'KiA', 'kidung': 'KiA', 'kidungagung': 'KiA',
    'kisah': 'Kis', 'kisahpararasul': 'Kis', 'rasul': 'Kis',
    'wah': 'Why', 'wahyu': 'Why', 'why': 'Why', 'whyu': 'Why',
    'yudas': 'Yud', 'yohanes': 'Yoh', 'joh': 'Yoh',
    'markus': 'Mrk', 'mar': 'Mrk', 'mr': 'Mrk', 'lukas': 'Luk', 'matius': 'Mat',
    'ibrani': 'Ibr', 'ibrn': 'Ibr', 'yakobus': 'Yak',
    'petrus': '1Ptr', 'pet': '1Ptr', 'ptr': '1Ptr',
    'filemon': 'Flm', 'timotius': '1Tim', 'tesalonika': '1Tes', 'korintus': '1Ko',
    '1kor': '1Ko', '2kor': '2Ko', '1tes': '1Tes', '2tes': '2Tes',
    '1tim': '1Tim', '2tim': '2Tim', '1pet': '1Ptr', '2pet': '2Ptr',
    '1ptr': '1Ptr', '2ptr': '2Ptr', '1raj': '1Raj', '2raj': '2Raj',
    '1taw': '1Taw', '2taw': '2Taw', '1sa': '1Sam', '2sa': '2Sam',
    'raja': '1Raj', 'tawarikh': '1Taw',
    'kejadian': 'Kej', 'keluaran': 'Kel', 'imamat': 'Im', 'bilangan': 'Bil',
    'ulangan': 'Ul', 'yosua': 'Yos', 'hakim': 'Hak', 'ezra': 'Ezr', 'nehemia': 'Neh',
    'ester': 'Est', 'ayub': 'Ayb', 'amsal': 'Ams', 'yesaya': 'Yes', 'yeremia': 'Yer',
    'ratapan': 'Rat', 'yehezkiel': 'Yeh', 'daniel': 'Dan', 'hosea': 'Ho',
    'amos': 'Am', 'obaja': 'Ob', 'yunus': 'Yun', 'mikha': 'Mi', 'nahum': 'Nah',
    'habakuk': 'Hab', 'zefanya': 'Zef', 'hagai': 'Hag', 'zakharia': 'Za',
    'maleakhi': 'Mal', 'roma': 'Rom', 'galatia': 'Gal', 'efesus': 'Ef',
    'filipi': 'Flp', 'kolose': 'Kol', 'titus': 'Tit',
    // 🆕 K42 butir d (18 Sep 2026) — 3 singkatan yang DIPAKAI di dalam arti
    //    kamus istilah tetapi belum dikenali mesin Alkitab (sudah diukur di
    //    data asli: Rm, Hos, Yl). Dipakai saat memecah rujukan di halaman kamus.
    'rm': 'Rom', 'hos': 'Ho', 'yl': 'Yoel'
  };

  // buang tanda baca & spasi, kecilkan huruf
  const normal = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // kata umum dalam kalimat yang TIDAK boleh dianggap nama kitab.
  // Contoh bahaya: "dan" sama dengan singkatan resmi "Dan" (Daniel),
  // sehingga "dan 1 Yohanes 4:8" sempat terbaca "Daniel 1".
  const KATA_UMUM = new Set([
    'dan', 'di', 'ke', 'pada', 'dari', 'yang', 'itu', 'ini', 'juga', 'lalu',
    'ayat', 'pasal', 'nomor', 'no', 'hal', 'bab', 'halaman', 'bagian',
    'tahun', 'thn', 'hari', 'jam', 'menit', 'orang', 'anak', 'kali',
    'sampai', 'hingga', 'kira', 'sekitar', 'serta', 'atau', 'ada', 'tidak',
    'ya', 'yg', 'lah', 'kah', 'pun', 'saja', 'bila', 'jika', 'kalau', 'maka',
    'the', 'and', 'of', 'in', 'to', 'for'
  ]);

  // jarak dua tulisan (untuk memaafkan salah tulis)
  function jarak(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const baris = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) baris[j] = j;
    for (let i = 1; i <= a.length; i++) {
      let lalu = baris[0];
      baris[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const tmp = baris[j];
        baris[j] = Math.min(baris[j] + 1, baris[j - 1] + 1, lalu + (a[i - 1] === b[j - 1] ? 0 : 1));
        lalu = tmp;
      }
    }
    return baris[b.length];
  }

  // cari kitab dari tulisan user -> { no, nama, singkatan }
  function kenaliKitab(tulisan) {
    if (!data) return null;
    const q = normal(tulisan);
    if (!q) return null;
    if (KATA_UMUM.has(q)) return null;      // "dan", "ayat", "pasal", … bukan kitab

    // 1) sebutan umum ("ibr" -> Ibr, "maz" -> Mzm, "mas" -> Mzm, dst.)
    //    ⚠️ cocokkan HANYA ke kitab yang singkatannya sama — jangan
    //    ditambahkan ke semua kitab (dulu: "ibr" malah terbaca Kejadian).
    const dariSebutan = SEBUTAN[q];
    if (dariSebutan) {
      const idx = data.kitab.findIndex(k => normal(k.singkatan) === normal(dariSebutan));
      if (idx >= 0) {
        return { no: idx + 1, nama: data.kitab[idx].nama, singkatan: data.kitab[idx].singkatan, skor: 0 };
      }
    }

    // 2) nama atau singkatan resmi
    let terbaik = null;
    data.kitab.forEach((k, i) => {
      [k.nama, k.singkatan].map(normal).forEach((c) => {
        let skor = null;
        if (c === q) skor = 0;                                          // sama persis
        // awalan: minimal 3 huruf, supaya "ya" jangan jadi "Yakobus"
        else if (q.length >= 3 && c.startsWith(q)) skor = 1;
        else if (c.length >= 4 && q.startsWith(c) && q.length - c.length <= 1) skor = 2;
        // salah tulis sedikit — hanya untuk tulisan >=3 huruf ("ya" jangan jadi "Za")
        else if (q.length >= 3 && c.length >= 4 && jarak(q, c) <= (c.length >= 8 ? 2 : 1)) skor = 3;
        if (skor !== null && (!terbaik || skor < terbaik.skor)) {
          terbaik = { no: i + 1, nama: k.nama, singkatan: k.singkatan, skor };
        }
      });
    });
    return terbaik;
  }

  // baca satu nama ayat -> { no, nama, singkatan, pasal, ayat1, ayat2 }
  function kenaliAyat(teks) {
    const t = String(teks || '').trim();
    // pola: <nama kitab> <pasal> [: atau . lalu ayat] [- ayat2]
    const cocok = t.match(/^(.+?)\s+(\d+)\s*(?:[:.]\s*(\d+)\s*(?:[-–—]\s*(\d+))?)?$/);
    if (!cocok) return null;

    const k = kenaliKitab(cocok[1]);
    if (!k) return null;

    const pasal = parseInt(cocok[2], 10);
    const a1 = cocok[3] ? parseInt(cocok[3], 10) : 0;
    let a2 = cocok[4] ? parseInt(cocok[4], 10) : a1;

    if (pasal < 1 || pasal > jumlahPasal(k.no)) return null;
    if (a1 < 0 || a2 < a1) return null;

    // ⚠️ K67 (28 Sep 2026) — skor WAJIB diteruskan dari kenaliKitab().
    //    Sebelumnya skor tidak dikembalikan ⇒ potongTeks memakai
    //    `(tebak.skor || 0) * 100 - coba.length` = `-coba.length` ⇒
    //    calon TERPANJANG selalu menang, walau itu salah (mis. "3:5, Hakim-Hakim").
    return {
      no: k.no, nama: k.nama, singkatan: k.singkatan,
      pasal, ayat1: a1, ayat2: a2, skor: k.skor || 0
    };
  }

  // label pendek untuk ditampilkan: "Ibrani 11:1" / "Ibrani 11:1-10" / "Mazmur 23"
  function label(ref) {
    if (!ref) return '';
    let s = ref.nama + ' ' + ref.pasal;
    if (ref.ayat1) {
      s += ':' + ref.ayat1;
      if (ref.ayat2 && ref.ayat2 !== ref.ayat1) s += '-' + ref.ayat2;
    }
    return s;
  }

  // ambil teks ayat sesuai nama ayat -> [{ no, teks }]
  function ayatDariRef(ref) {
    const p = ambilPasal(ref.no, ref.pasal);
    if (!p) return [];
    if (!ref.ayat1) return p.ayat;                       // seluruh pasal
    return p.ayat.filter(a => a.no >= ref.ayat1 && a.no <= ref.ayat2);
  }

  // ------------------------------------------------------------
  // AMBIL BANYAK AYAT SEKALIGUS  (dipakai plugin lain — mis. 🔗 Ayat Terkait)
  // ------------------------------------------------------------
  // Kenapa perlu?  Satu ayat bisa punya 90 kaitan. Kalau diambil satu-satu
  // (panggil ambilPasal() + cari ayat, 90 kali), itu pemborosan besar:
  // tiap panggilan mencari kitab & pasal dari awal lagi.
  // Fungsi ini mengambil semuanya dalam SATU jalan.
  //
  // daftarRef boleh dua bentuk:
  //   [{ no:44, pasal:24, ayat1:31, ayat2:31 }, …]      ← enak dibaca
  //   [[44, 24, 31, 31], …]                             ← bentuk ringkas
  // (bentuk kedua sama seperti isi data silang: [kitab, pasal, awal, akhir])
  //
  // Hasil tiap butir:
  //   { no, nama, singkatan, pasal, ayat1, ayat2,
  //     ayat: [{ no, teks, merah }],   ← teks siap dipakai
  //     label: 'Kejadian 49:10',       ← nama panjang (untuk chip)
  //     labelPendek: 'Kej 49:10' }
  function ambilAyatBanyak(daftarRef) {
    if (!data) return [];
    const hasil = [];
    const arr = Array.isArray(daftarRef) ? daftarRef : [];

    for (const r of arr) {
      if (!r) continue;
      const ringkas = Array.isArray(r);
      const noKitab = Number(ringkas ? r[0] : r.no);
      const pasal   = Number(ringkas ? r[1] : r.pasal);
      const a1      = Number(ringkas ? r[2] : (r.ayat1 || 0)) || 0;
      const a2      = Number(ringkas ? r[3] : (r.ayat2 || a1)) || a1;

      const k = data.kitab[noKitab - 1];
      if (!k) continue;
      const p = (k.pasal || []).find(x => x.no === pasal);
      if (!p) continue;

      const ayat = (p.ayat || []).filter(a => a.no >= a1 && a.no <= (a2 || a1));
      if (!ayat.length) continue;

      const akhir = a2 || a1;
      const ref3 = a1 ? (':' + a1 + (akhir !== a1 ? '-' + akhir : '')) : '';

      hasil.push({
        no: noKitab,
        nama: k.nama,
        singkatan: k.singkatan,
        pasal,
        ayat1: a1,
        ayat2: akhir,
        ayat: ayat.map(a => ({ no: a.no, teks: a.teks, merah: !!a.merah })),
        label: k.nama + ' ' + pasal + ref3,
        labelPendek: k.singkatan + ' ' + pasal + ref3
      });
    }

    return hasil;
  }

  // ------------------------------------------------------------
  // TANDAI AYAT DI CATATAN (tahap d)
  //   Nama ayat yang diketik berubah jadi tautan berwarna.
  //   Penanda ini TIDAK disimpan ke catatan (dibersihkan saat menyimpan).
  //   Kursor dijaga: (A) posisi kursor dihitung sebagai jumlah huruf,
  //                  (C) bagian yang sedang diketik dilewati.
  // ------------------------------------------------------------
  const KELAS_LINK = 'ay-link';

  // ------------------------------------------------------------
  // DAFTAR KELAS TANDA BERSAMA (K42 butir c — 18 Sep 2026)
  //   DUA plugin boleh menandai teks di editor yang SAMA:
  //     • 📖 Alkitab → span.ay-link       (nama ayat)
  //     • 📚 Kamus   → span.kamus-istilah (kata istilah)
  //   ⚠️ Karena itu keduanya WAJIB memakai daftar ini supaya:
  //      1) masing-masing MELEWATI node yang sudah bertanda (tidak saling
  //         menimpa / menghapus tanda plugin lain), dan
  //      2) tidak ada yang memanggil normalize() pada node bertanda.
  //   Kalau daftar ini diubah, ubah di SATU tempat ini saja.
  // ------------------------------------------------------------
  window.ANodesTandaKelas = window.ANodesTandaKelas || ['ay-link', 'kamus-istilah'];
  function diDalamTanda(node) {
    const daftar = window.ANodesTandaKelas || [KELAS_LINK];
    let el = node && node.parentNode;
    while (el && el !== document.body) {
      if (el.classList && daftar.some(c => el.classList.contains(c))) return true;
      el = el.parentNode;
    }
    return false;
  }
  // Cari ANGKANYA dulu (mis. 11:1-10 / 23 / 3:16), baru lihat ke belakang
  // mencari nama kitab. Cara ini jauh lebih aman daripada menebak nama
  // kitab di depan (dulu: "dan juga 1" sempat terbaca "Daniel 1").
  // Pemisah titik / titik dua harus ada supaya "3 16" tidak dianggap ayat.
  const POLA = /\b(\d{1,3})(?:\s*([:.])\s*(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?)?/g;

  // hitung jumlah huruf sebelum titik kursor (dari awal editor)
  function offsetKursor(editorEl) {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return null;
    const r = sel.getRangeAt(0);
    if (!editorEl.contains(r.startContainer)) return null;
    const hitung = document.createRange();
    hitung.selectNodeContents(editorEl);
    try { hitung.setEnd(r.startContainer, r.startOffset); } catch (e) { return null; }
    return { offset: hitung.toString().length, collapsed: sel.isCollapsed };
  }

  // taruh kembali titik kursor dari jumlah huruf
  function pasangKursor(editorEl, simpan) {
    if (!simpan) return;
    const jalan = document.createTreeWalker(editorEl, NodeFilter.SHOW_TEXT, null);
    let sisa = simpan.offset, n = jalan.nextNode();
    while (n) {
      const panjang = n.textContent.length;
      if (sisa <= panjang) {
        const r = document.createRange();
        r.setStart(n, sisa);
        r.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        return;
      }
      sisa -= panjang;
      n = jalan.nextNode();
    }
    // kalau tidak ketemu, taruh di akhir
    const r = document.createRange();
    r.selectNodeContents(editorEl);
    r.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
  }

  // buka semua tautan lama (kembali jadi teks biasa)
  function bukaTanda(editorEl) {
    const ada = editorEl.querySelectorAll('span.' + KELAS_LINK);
    if (!ada.length) return;
    ada.forEach(sp => {
      const isi = document.createTextNode(sp.textContent);
      sp.parentNode.replaceChild(isi, sp);
    });
    editorEl.normalize();
  }

  // bangun potongan HTML berisi tautan ayat dari satu teks
  //   batasKursor = posisi kursor di dalam teks ini (atau -1).
  //   Nama ayat yang memuat kursor DILEWATI sementara, supaya kursor
  //   tidak terganggu saat user baru selesai mengetiknya.
  function potongTeks(teks, daftar, batasKursor) {
    const kursorDi = (typeof batasKursor === 'number') ? batasKursor : -1;
    let pos = 0, hasil = '', ada = false;
    POLA.lastIndex = 0;
    let m;
    while ((m = POLA.exec(teks)) !== null) {
      const iAngka = m.index;
      if (iAngka < pos) continue;

      // lihat 30 huruf ke belakang, ambil 1-3 kata terakhir sebagai calon nama
      const awalJendela = Math.max(0, iAngka - 30);
      const jendela = teks.slice(awalJendela, iAngka);
      const ekor = jendela.replace(/\s+$/, '');          // buang spasi di EKOR saja
      if (!ekor) continue;
      // ekor dimulai tepat di awal jendela (spasi depan tidak dibuang),
      // jadi posisi awalnya = awalJendela.
      const awalEkor = awalJendela;

      const kataPos = [];
      const reW = /\S+/g;
      let mw;
      while ((mw = reW.exec(ekor)) !== null) kataPos.push({ w: mw[0], at: awalEkor + mw.index });

      let ref = null, mulai = -1, pakai = '';
      let terbaikK = null;      // pilih tebakan TERBAIK, bukan yang pertama ketemu
      let terbaikSah = null;    // ⚠️ K67 — calon yang TIDAK menabrak teks yang sudah dipakai
      for (let k = Math.min(3, kataPos.length); k >= 1; k--) {
        const pilih = kataPos.slice(-k);
        const coba = pilih.map(x => x.w).join(' ');
        const mulaiCoba = pilih[0].at;
        // jangan mulai di tengah kata (mis. "rahasia 3" -> "sia 3")
        if (mulaiCoba > 0 && /[0-9A-Za-z]/.test(teks[mulaiCoba - 1])) continue;
        const tebak = kenaliAyat(coba + ' ' + m[0]);
        if (!tebak) continue;
        const nilainya = (tebak.skor || 0) * 100 - coba.length;   // makin kecil makin baik
        if (!terbaikK || nilainya < terbaikK.nilai) {
          terbaikK = { ref: tebak, mulai: mulaiCoba, pakai: coba, nilai: nilainya };
        }
        // ⚠️ K67 (28 Sep 2026) — calon yang MULAI SEBELUM `pos` berarti
        //    menabrak teks yang sudah jadi tautan (mis. "3:5, Hakim-Hakim"
        //    mulai di dalam "Amsal 3:5"). Calon itu TIDAK boleh dipakai.
        //    Simpan calon SAH terbaik sebagai cadangan.
        if (mulaiCoba >= pos && (!terbaikSah || nilainya < terbaikSah.nilai)) {
          terbaikSah = { ref: tebak, mulai: mulaiCoba, pakai: coba, nilai: nilainya };
        }
      }
      // pakai calon SAH kalau ada; kalau tidak, pakai terbaik (nanti ditolak `mulai < pos`)
      const dipakai = terbaikSah || terbaikK;
      if (dipakai) { ref = dipakai.ref; mulai = dipakai.mulai; pakai = dipakai.pakai; }
      if (!ref || mulai < pos) continue;

      /* ------------------------------------------------------------
         K56b (23 Sep 2026) — TOLAK “rujukan” YANG SEBETULNYA DAFTAR KITAB
         ------------------------------------------------------------
         Ketemu saat menguji halaman Sejarah Alkitab: teksnya memuat
           “Kitab: Yosua, Hakim-hakim, Rut, 1 & 2 Samuel, 1 & 2 Raja-raja, …”
         dan yang tertangkap sebagai tautan adalah **“Rut, 1”**, **“& 2 Samuel, 1”**,
         **“& 2 Raja-raja, 1”** — semuanya menunjuk **ayat 0** (`Rut 1:0`) ⇒ PALSU.

         ⚠️ Rujukan PASAL-SAJA yang SAH tetap harus hidup (mis. “(Amsal 31)”,
            “(Daniel 9)”, “(Yesaya 53)”) — jadi jangan tolak semua tanpa pemisah.
         ⇒ Aturan: rujukan **TANPA** `:`/`.` yang **dipisahkan KOMA/titik-koma**
            dari nama kitabnya = bagian dari DAFTAR, bukan ayat.
         ------------------------------------------------------------ */
      if (!m[2]) {
        const antara = teks.slice(mulai, iAngka);
        if (/[,;]/.test(antara)) continue;
      }

      const akhir = m.index + m[0].length;
      // lewati hanya nama ayat yang SEDANG diketik (kursor di tengahnya).
      // Kalau kursor tepat di ujung, tautan tetap dibuat — kursor ada di
      // luar tautan, jadi mengetik lanjutan tetap aman.
      if (kursorDi >= 0 && kursorDi >= mulai && kursorDi < akhir) continue;

      // pertahankan pemisah seperti yang ditulis user (titik / titik dua)
      const isiLink = pakai + ' ' + m[1] +
        (m[3] ? (m[2] || ':') + m[3] : '') + (m[4] ? '-' + m[4] : '');

      hasil += escapeKecil(teks.slice(pos, mulai)) +
        '<span class="' + KELAS_LINK + '" contenteditable="false" title="Klik: buka ' +
        escapeKecil(label(ref)) + '" data-ref="' + escapeKecil(JSON.stringify(ref)) + '">' +
        escapeKecil(isiLink) + '</span>';
      pos = akhir;
      ada = true;
      daftar.push(ref);
    }
    hasil += escapeKecil(teks.slice(pos));
    return ada ? hasil : null;
  }

  function escapeKecil(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // saat plugin DILEPAS: bersihkan penanda tautan + tutup halaman baca
  function saatDilepas() {
    const editor = document.getElementById('editor');
    if (editor) {
      bukaTanda(editor);
      editor.dataset.siapTandai = '';
    }
    const hal = document.getElementById('baca-alkitab');
    if (hal && !hal.hidden) {
      hal.hidden = true;
      const utama = document.getElementById('app-utama');
      if (utama) utama.hidden = false;
    }
    // paket yang belum ditempel ikut dibuang (baris ke-2 kembali jadi toolbar tulis)
    if (window.ANodesEditor && window.ANodesEditor.paketBuang) {
      try { window.ANodesEditor.paketBuang(); } catch (e) {}
    }
  }

  // tandai semua nama ayat di dalam editor
  function tandaiAyat(editorEl) {
    if (!aktif() || !editorEl) return 0;
    const simpan = offsetKursor(editorEl);
    bukaTanda(editorEl);

    // kumpulkan dulu semua teks (jangan diubah sambil berjalan)
    const jalan = document.createTreeWalker(editorEl, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.textContent || !n.textContent.trim()) return NodeFilter.FILTER_REJECT;
        const induk = n.parentNode;
        if (!induk) return NodeFilter.FILTER_REJECT;
        // ⚠️ lewati node yang sudah bertanda — baik tanda Alkitab sendiri
        //    MAUPUN tanda plugin lain (mis. istilah dari plugin Kamus).
        if (diDalamTanda(n)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const daftarNode = [];
    let n = jalan.nextNode();
    while (n) { daftarNode.push(n); n = jalan.nextNode(); }

    let jumlah = 0;
    daftarNode.forEach(node => {
      // hitung posisi kursor di dalam teks ini (kalau kursor ada di sini)
      let batas = -1;
      if (simpan && simpan.collapsed) {
        const sel = window.getSelection();
        const titik = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
        if (titik && titik.startContainer === node) batas = titik.startOffset;
      }
      const daftar = [];
      const html = potongTeks(node.textContent, daftar, batas);
      if (!html) return;
      const tmp = document.createElement('span');
      tmp.innerHTML = html;
      const frag = document.createDocumentFragment();
      while (tmp.firstChild) frag.appendChild(tmp.firstChild);
      try { node.parentNode.replaceChild(frag, node); } catch (e) { return; }
      jumlah += daftar.length;
    });

    if (jumlah) { editorEl.normalize(); pasangKursor(editorEl, simpan); }
    return jumlah;
  }

  /* ============================================================
     K56 — TANDAI TEKS DI HALAMAN **BACA-SAJA** (❌ bukan editor)
     ------------------------------------------------------------
     Bapak 23 Sep 2026: *“Pengantar Sejarah Alkitab: Bagaimana Firman
     Menjadi Tulisan .. ada kamus istilah dan **link alkitab belum
     berfungsi**”* ⇒ teks halaman sejarah belum pernah ditandai.

     ⚠️ MENGAPA fungsi terpisah (bukan memakai `tandaiAyat`)?
       • `tandaiAyat` menuntut `aktif()` = plugin terpasang **DAN mode
         penandaan catatan hidup** → gagal di halaman baca-saja.
       • `tandaiAyat` juga `normalize()` + memulihkan KURSOR — tidak perlu
         di halaman yang tidak bisa diketik, dan bisa mengacaukan kursor.
     ⇒ Fungsi ini: NodeFilter SAMA (lewati node bertanda), ❌ TANPA kursor,
       ❌ TANPA `normalize()` (justru lebih aman: tanda plugin lain tetap utuh).
     ============================================================ */
  function tandaiWadahHalaman(wadah) {
    if (!wadah) return 0;
    const jalan = document.createTreeWalker(wadah, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.textContent || !n.textContent.trim()) return NodeFilter.FILTER_REJECT;
        const induk = n.parentNode;
        if (!induk) return NodeFilter.FILTER_REJECT;
        // lewati: node bertanda milik plugin mana pun, skrip, dan gaya
        let el = induk;
        while (el && el !== wadah) {
          if (el.classList && (window.ANodesTandaKelas || ['ay-link'])
                .some(c => el.classList.contains(c))) return NodeFilter.FILTER_REJECT;
          if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return NodeFilter.FILTER_REJECT;
          el = el.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const daftarNode = [];
    let n = jalan.nextNode();
    while (n) { daftarNode.push(n); n = jalan.nextNode(); }

    let jumlah = 0;
    daftarNode.forEach(node => {
      const daftar = [];
      const html = potongTeks(node.textContent, daftar, -1);
      if (!html) return;
      const tmp = document.createElement('span');
      tmp.innerHTML = html;
      const frag = document.createDocumentFragment();
      while (tmp.firstChild) frag.appendChild(tmp.firstChild);
      try { node.parentNode.replaceChild(frag, node); } catch (e) { return; }
      jumlah += daftar.length;
    });
    return jumlah;
  }

  // (dipakai saat MENYIMPAN / memindah halaman) buang tanda dari sebuah wadah
  function bersihTandaWadah(wadah) {
    if (!wadah) return 0;
    const ada = wadah.querySelectorAll('span.' + KELAS_LINK);
    ada.forEach(sp => sp.parentNode.replaceChild(document.createTextNode(sp.textContent), sp));
    return ada.length;
  }

  // buang penanda dari HTML (dipakai saat MENYIMPAN catatan)
  function bersihTanda(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    tmp.querySelectorAll('span.' + KELAS_LINK).forEach(sp => {
      const isi = document.createTextNode(sp.textContent);
      sp.parentNode.replaceChild(isi, sp);
    });
    return tmp.innerHTML;
  }

  // apakah plugin sedang terpasang & datanya siap?
  //   `wadah` (opsional) = tempat yang akan ditandai.
  //   🔌 K70 (5 Okt 2026) — sakelar ON/OFF penandaan **CATATAN**.
  //   🐞 CACAT NYATA (30 Okt 2026, ketemu saat menguji K83): dulu `aktif()`
  //      membaca sakelar itu TANPA memeriksa wadah ⇒ saat bawaan OFF,
  //      penandaan di **halaman baca-saja** (mis. halaman Sejarah lewat
  //      `tandaiWadahHalaman`) ikut mati padahal itu bukan catatan.
  //      K70 sendiri menyatakan: *“Halaman plugin ❌ TIDAK ikut mati —
  //      yang berhenti HANYA penandaan di catatan.”*
  function aktif(wadah) {
    if (!data || !(window.ANodesPlugin && window.ANodesPlugin.dipasang('alkitab'))) return false;
    // sakelar K70 hanya berlaku untuk catatan (`#editor`)
    const editor = document.getElementById('editor');
    const untukCatatan = (wadah === undefined || wadah === null) ? true : (wadah === editor);
    if (untukCatatan
        && window.ANodesEditor && typeof window.ANodesEditor.catatanDitandai === 'function'
        && !window.ANodesEditor.catatanDitandai()) return false;
    return true;
  }

  // ------------------------------------------------------------
  // INGAT TEMPAT ASAL (tahap e) — supaya setelah ↩ kembali,
  // tempat yang tadi diklik bisa disorot kuning.
  //   nomor urut (index) dipakai lebih dulu daripada teks, supaya
  //   kalau ada dua tautan bertulis sama, sorot tidak salah tempat.
  // ------------------------------------------------------------
  let asal = null;   // { index, teks, gulir }

  function ingatAsal(elemenLink, index) {
    const editor = document.getElementById('editor');
    asal = {
      index: (typeof index === 'number' && index >= 0) ? index : null,
      teks: elemenLink ? elemenLink.textContent.trim() : '',
      gulir: editor ? editor.scrollTop : 0
    };
  }

  function kembaliKeCatatan() {
    if (!asal) return;
    const editor = document.getElementById('editor');
    if (!editor) { asal = null; return; }

    const semua = [...editor.querySelectorAll('span.' + KELAS_LINK)];
    let sasaran = null;
    if (asal.index !== null && semua[asal.index]) sasaran = semua[asal.index];
    if (!sasaran) sasaran = semua.find(x => x.textContent.trim() === asal.teks) || null;

    if (sasaran) {
      sasaran.scrollIntoView({ behavior: 'auto', block: 'center' });
      semua.forEach(x => x.classList.remove('ay-sorot'));
      sasaran.classList.add('ay-sorot');
      clearTimeout(window.__aySorot);
      window.__aySorot = setTimeout(() => sasaran.classList.remove('ay-sorot'), 4000);
    } else if (asal.gulir) {
      editor.scrollTop = asal.gulir;
    }
    asal = null;
  }

  // ------------------------------------------------------------
  // OTOMATIS: tandai ayat setelah mengetik (tahap d)
  //   ditunda 900 ms supaya mengetik tetap lancar.
  // ------------------------------------------------------------
  let timerTandai = null;

  function pasangOtomatis() {
    const editor = document.getElementById('editor');
    if (!editor || editor.dataset.siapTandai) return;
    editor.dataset.siapTandai = '1';
    /* ⚠️⚠️ K61 (23 Sep 2026) — CACAT NYATA yang jangan diulang:
       penandaan SUSULAN (saat mengetik / saat editor difokuskan) memanggil
       `tandaiAyat()` **LANGSUNG** ⇒ **sambungan resmi** milik editor
       (`ANodesEditor.jalanPenghiasTanda`) **TIDAK ikut jalan**.
       Akibatnya: setelah mengetik, tautan ayat muncul tetapi tombol `🖊`
       penguat **tidak menempel** sampai catatan dibuka ulang.
       ⇒ Setiap selesai menandai, kita **memberi tahu** editor supaya para
         penghias (plugin 🖊) ikut dipanggil — editor tetap ❌ tidak perlu
         tahu plugin apa yang mendaftar. */
    const tandaiSekarang = () => {
      tandaiAyat(editor);
      const ed = window.ANodesEditor;
      if (ed && typeof ed.jalanPenghiasTanda === 'function') {
        try { ed.jalanPenghiasTanda({ editor }); } catch (e) {}
      }
    };
    editor.addEventListener('input', () => {
      if (!aktif()) return;
      clearTimeout(timerTandai);
      timerTandai = setTimeout(tandaiSekarang, 900);
    });
    // saat buka catatan / fokus, tandai sekali
    editor.addEventListener('focus', () => {
      if (!aktif()) return;
      clearTimeout(timerTandai);
      timerTandai = setTimeout(tandaiSekarang, 300);
    });
  }

  // ------------------------------------------------------------
  // dipasang() — dipanggil ANodesPlugin saat plugin baru dipasang.
  // Menyiapkan data SEKALI dengan tampilan "Memuat plugin Alkitab…".
  // Setelah selesai, tombol bar plugin ditandai siap.
  // ------------------------------------------------------------
  function dipasang() {
    const lapis = window.ANodesPlugin && window.ANodesPlugin.lapisMemuat;
    const tampil = (p, t) => {
      if (lapis) lapis('📖 Memuat plugin Alkitab…', p, t || 'mohon tunggu sebentar');
    };

    if (data) { tandaiSiap(); return Promise.resolve(true); }

    tampil(8, 'menyiapkan…');
    return muat((persen, tahap) => tampil(persen, tahap))
      .then((hasil) => {
        // biar lapisan terlihat sekejap (kalau data sudah tersimpan,
        // pemuatan hanya beberapa puluh milidetik)
        return new Promise((ok) => setTimeout(ok, 450)).then(() => hasil);
      })
      .then((hasil) => {
        tampil(100, 'selesai');
        setTimeout(() => { if (lapis) lapis(null); }, 250);
        tandaiSiap();
        pasangOtomatis();
        if (window.ANodesAlkitabTampilan) window.ANodesAlkitabTampilan.hidupkan();
        if (window.ANodesPlugin) window.ANodesPlugin.terapkanBar();   // segarkan tombol kepala
        pesanKecil('📖 Alkitab siap (' + hasil.jumlahKitab + ' kitab)');
        return true;
      })
      .catch((e) => {
        tampil(100, 'gagal memuat');
        setTimeout(() => { if (lapis) lapis(null); }, 1200);
        console.warn('ANodes Alkitab: gagal memuat data', e);
        pesanKecil('⚠️ Data Alkitab gagal dimuat');
        return false;
      });
  }

  // tandai semua tombol bar plugin jadi "siap" (bisa diklik)
  function tandaiSiap() {
    const p = window.ANodesPlug && window.ANodesPlug.find(x => x.id === 'alkitab');
    if (p) {
      p.siap = true;
      if (Array.isArray(p.bar)) p.bar.forEach(t => { t.siap = true; });
    }
    kabariSiap();
  }

  // ------------------------------------------------------------
  // ketikaSiap(fn) — jalankan fn begitu data Alkitab siap
  //   Dipakai editor.js: kalau catatan dibuka SEBELUM data siap,
  //   penandaan tautan ayat tetap dikerjakan setelah data siap.
  // ------------------------------------------------------------
  let tungguSiap = [];

  function ketikaSiap(fn) {
    if (typeof fn !== 'function') return;
    if (data) { fn(); return; }
    tungguSiap.push(fn);
  }

  function kabariSiap() {
    if (!data || !tungguSiap.length) return;
    const daftar = tungguSiap;
    tungguSiap = [];
    daftar.forEach(fn => { try { fn(); } catch (e) {} });
  }

  function pesanKecil(t) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = t;
    el.classList.add('tampil');
    clearTimeout(el._tA);
    el._tA = setTimeout(() => el.classList.remove('tampil'), 2200);
  }

  // ------------------------------------------------------------
  // MUAT OTOMATIS saat halaman dibuka (PENTING)
  //   Kalau plugin sudah terpasang, data TIDAK BOLEH dimuat hanya saat
  //   tombol "Pasang" ditekan. Setelah F5/refresh, isi halaman hilang —
  //   jadi data harus dimuat lagi, kalau tidak tombol 📋 PILIH & ⌨ KETIK
  //   diam saja (tidak bereaksi).
  // ------------------------------------------------------------
  function siapkanOtomatis() {
    const plug = window.ANodesPlugin;
    if (!plug || !plug.dipasang || !plug.dipasang('alkitab')) return;
    if (data) { tandaiSiap(); pasangOtomatis(); return; }

    // tampilkan lapisan "Memuat…" supaya user tahu sedang menyiapkan
    const lapis = plug.lapisMemuat;
    if (lapis) lapis('📖 Menyiapkan plugin Alkitab…', 25, 'mohon tunggu sebentar');

    const mulai = Date.now();
    muat()
      .then((hasil) => {
        // beri jeda kecil supaya lapisan tidak berkedip hilang
        const sisa = Math.max(0, 450 - (Date.now() - mulai));
        return new Promise((ok) => setTimeout(() => ok(hasil), sisa));
      })
      .then(() => {
        tandaiSiap();
        pasangOtomatis();
        if (window.ANodesAlkitabTampilan) window.ANodesAlkitabTampilan.hidupkan();
        if (window.ANodesPlugin) window.ANodesPlugin.terapkanBar();   // segarkan tombol kepala
        if (lapis) lapis(null);
        // sengaja TIDAK memunculkan toast di sini — biar tidak berisik tiap
        // halaman dibuka; lapisan "Menyiapkan plugin Alkitab…" sudah cukup.
      })
      .catch((e) => {
        if (lapis) lapis(null);
        console.warn('ANodes Alkitab: gagal memuat data saat membuka halaman', e);
        pesanKecil('⚠️ Data Alkitab gagal dimuat');
      });
  }

  // jalankan setelah semua berkas selesai dimuat (semua skrip sudah ada)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', siapkanOtomatis);
  } else {
    setTimeout(siapkanOtomatis, 0);
  }

  return {
    muat, siap, meta, dipasang, saatDilepas,
    daftarKitab, ambilPasal, ambilAyat, jumlahPasal,
    kenaliKitab, kenaliAyat, label, ayatDariRef,
    // K25 c — ambil banyak ayat sekaligus (dipakai plugin 🔗 Ayat Terkait)
    ambilAyatBanyak,
    tandaiAyat, bersihTanda, bukaTanda,
    // K56 — tandai teks di HALAMAN BACA-SAJA (mis. halaman Sejarah Alkitab)
    tandaiWadahHalaman, bersihTandaWadah,
    ingatAsal, kembaliKeCatatan, pasangOtomatis, siapkanOtomatis, ketikaSiap,
    // dipakai alat uji
    _potongTeks: (t) => { const d = []; return { html: potongTeks(t, d, -1), ref: d }; },
    get data() { return data; }
  };
})();
