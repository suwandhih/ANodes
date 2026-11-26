/* ============================================================
   ANodes — plugin/ayat-terkait/terkait.js
   MESIN PLUGIN AYAT TERKAIT (butir b)
   ------------------------------------------------------------
   Tugasnya:
     1. Menyediakan DATA kaitan antar ayat (hasil tools/siapkan-data-silang.js).
     2. Menyimpan data itu di IndexedDB ("gudang besar browser") supaya
        membuka ANodes berikutnya tidak perlu membaca 5 MB lagi.
     3. Menjawab pertanyaan: "ayat ini punya kaitan apa saja?"

   Kenapa IndexedDB?
     localStorage hanya ±5 MB — data kaitan 5,2 MB tidak muat.
     IndexedDB jauh lebih besar dan memang untuk data sebesar ini.

   Kenapa data dimuat lewat tag <script>, bukan fetch?
     Saat halaman dibuka dengan file:// , Chrome melarang fetch/XHR
     ke berkas lain. Yang diizinkan hanya pemuatan lewat tag script.

   Bagian INI hanya MESIN (data). Yang MENAMPILKAN di halaman baca
   adalah plugin/ayat-terkait/tampilan.js — dipisah supaya jelas.

   ⚠️ Data sumber: OpenBible.info Cross-References (CC-BY) — wajib disebut.
   ============================================================ */

window.ANodesAyatTerkait = (function () {
  'use strict';

  // ⚠️ Gudang yang SAMA dengan plugin Alkitab — tetapi KUNCI-nya beda.
  //    (localStorage tidak boleh dipakai untuk data sebesar ini.)
  const NAMA_DB     = 'anodes-plugin-db';
  const NAMA_TOKO   = 'data';
  const KUNCI       = 'silang';                      // ← IndexedDB, BUKAN localStorage
  const BERKAS_DATA = 'plugin/ayat-terkait/data/silang.js';

  let data = null;         // { meta, bentuk, refs } yang sedang dipakai
  let sedangMuat = null;   // kalau sedang memuat, simpan janjinya (biar tidak dobel)

  const tungguSiap = [];   // fungsi yang menunggu sampai data siap
  const pendengar = [];    // fungsi yang dipanggil TIAP kali data siap (mis. gambar ulang)

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
      if (saatProses) saatProses(0, 'membaca berkas kaitan ayat');
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => { if (saatProses) saatProses(100, 'selesai'); selesai(); };
      s.onerror = () => gagal(new Error('berkas data kaitan ayat tidak ada: ' + src));
      document.head.appendChild(s);
    });
  }

  // apakah data yang mau dipakai masuk akal?
  // (kalau isinya kosong/rusak, lebih baik dibuang daripada jadi "siap" palsu)
  function masukAkal(d) {
    if (!d || !d.refs || typeof d.refs !== 'object') return false;
    const kunci = Object.keys(d.refs);
    return kunci.length > 1000;   // data asli 29.363 ayat → jauh di atas 1000
  }

  // ------------------------------------------------------------
  // muat(lapor) — jalan utama
  //   lapor(persen 0..100, tahap) dipakai untuk menampilkan kemajuan
  // ------------------------------------------------------------
  function muat(lapor) {
    if (data) return Promise.resolve({ dari: 'sudah-siap', jumlahAyat: jumlahAyat() });
    if (sedangMuat) return sedangMuat;

    const kabari = (p, t) => { if (typeof lapor === 'function') lapor(p, t); };

    sedangMuat = (async () => {
      // 1) data sudah ada di halaman? (mis. versi satu berkas) — langsung pakai
      if (window.ANodesAyatTerkaitData) {
        kabari(20, 'menyiapkan');
        if (!masukAkal(window.ANodesAyatTerkaitData)) {
          sedangMuat = null;
          throw new Error('isi data kaitan ayat tidak masuk akal (kosong / rusak)');
        }
        data = window.ANodesAyatTerkaitData;
        kabari(60, 'menyimpan agar cepat dibuka lagi');
        await tulisSimpanan(data);
        kabari(100, 'selesai');
        sedangMuat = null;
        kabariPendengar();
        return { dari: 'berkas-halaman', jumlahAyat: jumlahAyat() };
      }

      // 2) sudah pernah disimpan di gudang besar? — pakai itu (cepat, tanpa 5 MB)
      kabari(10, 'memeriksa simpanan');
      const simpanan = await bacaSimpanan();
      if (masukAkal(simpanan)) {
        data = simpanan;
        kabari(100, 'selesai');
        sedangMuat = null;
        kabariPendengar();
        return { dari: 'simpanan', jumlahAyat: jumlahAyat() };
      }

      // 3) belum ada — baca berkas data (sekali saja)
      kabari(25, 'membaca data kaitan ayat');
      await muatBerkas(BERKAS_DATA, kabari);

      if (!masukAkal(window.ANodesAyatTerkaitData)) {
        sedangMuat = null;
        throw new Error('data kaitan ayat tidak terbaca');
      }

      data = window.ANodesAyatTerkaitData;
      kabari(70, 'menyimpan agar cepat dibuka lagi');
      await tulisSimpanan(data);
      kabari(100, 'selesai');
      sedangMuat = null;
      kabariPendengar();
      return { dari: 'berkas-plugin', jumlahAyat: jumlahAyat() };
    })().catch((e) => { sedangMuat = null; throw e; });

    return sedangMuat;
  }

  // ------------------------------------------------------------
  // jalan masuk sederhana untuk TAMPILAN
  // ------------------------------------------------------------
  const siap = () => !!data;

  // jumlah ayat yang punya kaitan
  function jumlahAyat() {
    return data && data.refs ? Object.keys(data.refs).length : 0;
  }

  // jumlah SELURUH kaitan (344.100) — dihitung sekali lalu diingat
  let _jumlahKaitan = null;
  function jumlahKaitan() {
    if (_jumlahKaitan !== null) return _jumlahKaitan;
    if (!siap()) return 0;
    if (data.meta && typeof data.meta.jumlahKaitan === 'number') {
      _jumlahKaitan = data.meta.jumlahKaitan;
      return _jumlahKaitan;
    }
    let n = 0;
    for (const k in data.refs) n += data.refs[k].length;
    _jumlahKaitan = n;
    return n;
  }

  const kunciAyat = (noKitab, noPasal, noAyat) =>
    Number(noKitab) + '.' + Number(noPasal) + '.' + Number(noAyat);

  // daftar kaitan satu ayat.
  // bentuk tiap butir: [noKitab, pasal, ayatAwal, ayatAkhir, votes]
  // urutan: votes TERBESAR dulu → yang paling kuat muncul paling depan.
  function kaitan(noKitab, noPasal, noAyat) {
    if (!siap()) return [];
    const baris = data.refs[kunciAyat(noKitab, noPasal, noAyat)];
    return baris || [];
  }

  const adaKaitan = (noKitab, noPasal, noAyat) => kaitan(noKitab, noPasal, noAyat).length > 0;
  const jumlahKaitanAyat = (noKitab, noPasal, noAyat) => kaitan(noKitab, noPasal, noAyat).length;

  // jumlah kaitan tiap ayat satu pasal sekaligus.
  // Dipakai tampilan supaya tidak memanggil kaitan() puluhan kali
  // (dan supaya tahu ayat mana saja yang perlu diberi chip).
  // hasil: { 1: 5, 3: 12, … } — hanya ayat yang punya kaitan
  function petaKaitanPasal(noKitab, noPasal) {
    if (!siap()) return {};
    const peta = {};
    const depan = Number(noKitab) + '.' + Number(noPasal) + '.';
    for (const k in data.refs) {
      if (k.lastIndexOf(depan, 0) === 0) {
        const ayat = Number(k.slice(depan.length));
        const n = data.refs[k].length;
        if (n) peta[ayat] = n;
      }
    }
    return peta;
  }

  // keterangan data (dipakai halaman keterangan plugin)
  function meta() {
    if (!siap()) return null;
    const m = data.meta || {};
    return {
      sumber: m.sumber || 'OpenBible.info Cross-References',
      lisensi: m.lisensi || 'CC-BY (OpenBible.info)',
      tanggalSumber: m.tanggalSumber || '',
      ayat: jumlahAyat(),
      kaitan: jumlahKaitan()
    };
  }

  // ------------------------------------------------------------
  // saat data siap
  //   ketikaSiap(fn) → sekali saja
  //   padaSiap(fn)   → tiap kali data siap (dipakai untuk gambar ulang)
  // ------------------------------------------------------------
  function ketikaSiap(fn) {
    if (typeof fn !== 'function') return;
    if (data) { try { fn(); } catch (e) {} return; }
    tungguSiap.push(fn);
  }

  function padaSiap(fn) {
    if (typeof fn !== 'function') return;
    pendengar.push(fn);
    if (data) { try { fn(); } catch (e) {} }
  }

  // ⚠️ URUTAN PENTING (cacat nyata, ketemu 30 Okt 2026 saat uji K80):
  //    `pendengar` (padaSiap → hidupkanTampilan → tambahPenghias) WAJIB jalan
  //    LEBIH DULU daripada `tungguSiap` (ketikaSiap).
  //    Dulu urutannya terbalik ⇒ siapa pun yang menunggu `ketikaSiap` lalu
  //    langsung menggambar pasal akan mendapat halaman TANPA penghias
  //    (terukur: `at-hias` = 0, lalu 21 pada percobaan berikutnya — flaky).
  function kabariPendengar() {
    // 1) hidupkan tampilan dulu (mendaftarkan penghias ke plugin Alkitab)
    pendengar.slice().forEach(fn => { try { fn(); } catch (e) {} });
    // 2) baru beri tahu penunggu `ketikaSiap` — sekarang penghias sudah siap
    const a = tungguSiap.splice(0, tungguSiap.length);
    a.forEach(fn => { try { fn(); } catch (e) {} });
  }

  // hidupkan TAMPILAN (kalau berkasnya sudah dimuat)
  function hidupkanTampilan() {
    const t = window.ANodesAyatTerkaitTampilan;
    if (t && typeof t.hidupkan === 'function') {
      try { t.hidupkan(); } catch (e) { console.warn('ANodes Ayat Terkait: tampilan gagal hidup', e); }
    }
  }

  // pastikan tampilan ikut hidup begitu data siap
  //   ⚠️ Dipanggil lewat `padaSiap`, jadi berlaku untuk SEMUA jalan:
  //      dipasang dari gudang · muat otomatis saat halaman dibuka · tombol Buka.
  padaSiap(hidupkanTampilan);

  // ------------------------------------------------------------
  // saatSiap(tugas) — untuk tombol/fungsi yang butuh data
  //   ❌ JANGAN `return` diam-diam: user harus selalu tahu kenapa.
  //   (aturan yang sama seperti plugin Alkitab — lihat K9/7l)
  // ------------------------------------------------------------
  function saatSiap(tugas) {
    const plug = window.ANodesPlugin;
    if (!plug || !plug.dipasang || !plug.dipasang('ayat-terkait')) {
      pesanKecil('💡 Pasang plugin 🔗 Ayat Terkait dahulu');
      return false;
    }
    if (siap()) { try { tugas(); } catch (e) { console.warn(e); } return true; }
    pesanKecil('⏳ Menyiapkan data ayat terkait…');
    const lapis = plug.lapisMemuat;
    if (lapis) lapis('🔗 Menyiapkan plugin Ayat Terkait…', 25, 'mohon tunggu sebentar');
    muat()
      .then(() => {
        if (lapis) lapis(null);
        try { tugas(); } catch (e) { console.warn(e); }
      })
      .catch((e) => {
        if (lapis) lapis(null);
        console.warn('ANodes Ayat Terkait: gagal memuat data', e);
        pesanKecil('⚠️ Data ayat terkait gagal dimuat');
      });
    return true;
  }

  function pesanKecil(t) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = t;
    el.classList.add('tampil');
    clearTimeout(el._tT);
    el._tT = setTimeout(() => el.classList.remove('tampil'), 2200);
  }

  // ------------------------------------------------------------
  // dipasang / dilepas (dipanggil js/plugin.js)
  // ------------------------------------------------------------
  function dipasang() {
    const plug = window.ANodesPlugin;
    const lapis = plug && plug.lapisMemuat;
    const tampil = (p, t) => {
      if (lapis) lapis('🔗 Memuat plugin Ayat Terkait…', p, t || 'mohon tunggu sebentar');
    };

    tandaiSiap();
    if (data) return Promise.resolve(true);

    tampil(8, 'menyiapkan…');
    return muat((persen, tahap) => tampil(persen, tahap))
      .then((hasil) => {
        // biar lapisan terlihat sekejap (kalau data sudah tersimpan,
        // pemuatan hanya beberapa puluh milidetik)
        return new Promise((ok) => setTimeout(ok, 450)).then(() => hasil);
      })
      .then(() => {
        tandaiSiap();
        if (window.ANodesPlugin) window.ANodesPlugin.terapkanBar();
        hidupkanTampilan();
        if (lapis) lapis(null);
        pesanKecil('🔗 Ayat Terkait siap — kaitan ayat kini tampil di halaman baca');
        return true;
      })
      .catch((e) => {
        if (lapis) lapis(null);
        console.warn('ANodes Ayat Terkait: gagal memuat data saat dipasang', e);
        pesanKecil('⚠️ Data ayat terkait gagal dimuat');
        return false;
      });
  }

  // tandai plugin "siap" di gudang plugin (tombol Pasang jadi aktif)
  function tandaiSiap() {
    const p = window.ANodesPlug && window.ANodesPlug.find(x => x.id === 'ayat-terkait');
    if (p) {
      p.siap = true;
      if (Array.isArray(p.tombol)) p.tombol.forEach(t => { t.siap = true; });
    }
  }

  // ⚠️ Lepas plugin TIDAK boleh menyentuh catatan user.
  //    Yang dibuang hanya: data di memori + penampilan kaitan di halaman baca.
  //    Simpanan di IndexedDB SENGAJA dibiarkan supaya memasang lagi cepat.
  function saatDilepas() {
    if (window.ANodesAyatTerkaitTampilan &&
        window.ANodesAyatTerkaitTampilan.bersihkan) {
      try { window.ANodesAyatTerkaitTampilan.bersihkan(); } catch (e) {}
    }
    data = null;
    _jumlahKaitan = null;
    sedangMuat = null;
  }
  // ------------------------------------------------------------
  // MUAT OTOMATIS saat halaman dibuka (PENTING)
  //   Kalau plugin sudah terpasang, data TIDAK BOLEH dimuat hanya saat
  //   tombol "Pasang" ditekan. Setelah F5 isi halaman hilang — kalau tidak
  //   dimuat lagi, fitur ini tampak "tidak berfungsi".
  // ------------------------------------------------------------
  function siapkanOtomatis() {
    const plug = window.ANodesPlugin;
    if (!plug || !plug.dipasang || !plug.dipasang('ayat-terkait')) return;
    if (data) { tandaiSiap(); return; }

    const lapis = plug.lapisMemuat;
    if (lapis) lapis('🔗 Menyiapkan plugin Ayat Terkait…', 25, 'mohon tunggu sebentar');

    const mulai = Date.now();
    muat()
      .then((hasil) => {
        const sisa = Math.max(0, 450 - (Date.now() - mulai));
        return new Promise((ok) => setTimeout(() => ok(hasil), sisa));
      })
      .then(() => {
        tandaiSiap();
        if (window.ANodesPlugin) window.ANodesPlugin.terapkanBar();
        hidupkanTampilan();
        if (lapis) lapis(null);
      })
      .catch((e) => {
        if (lapis) lapis(null);
        console.warn('ANodes Ayat Terkait: gagal memuat data saat membuka halaman', e);
        pesanKecil('⚠️ Data ayat terkait gagal dimuat');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', siapkanOtomatis);
  } else {
    setTimeout(siapkanOtomatis, 0);
  }

  return {
    muat, siap, meta, dipasang, saatDilepas, siapkanOtomatis,
    kaitan, adaKaitan, jumlahKaitanAyat, petaKaitanPasal,
    jumlahAyat, jumlahKaitan, kunciAyat,
    ketikaSiap, padaSiap, saatSiap, tandaiSiap,
    // dipakai alat uji
    get data() { return data; }
  };
})();
