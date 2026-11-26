/* ============================================================
   ANodes — plugin/kamus/kamus.js
   MESIN PLUGIN KAMUS ISTILAH (K42 butir a)
   ------------------------------------------------------------
   Tugasnya:
     1. Menyediakan DATA istilah Alkitab (hasil tools/siapkan-data-kamus.js).
     2. Menyimpan data itu di IndexedDB ("gudang besar browser") supaya
        membuka ANodes berikutnya tidak perlu membaca berkas lagi.
     3. Menjawab pertanyaan: "kata ini istilah apa?" dan
        "kata apa saja yang perlu ditandai di teks ini?"

   Kenapa IndexedDB?
     Datanya hanya ±135 KB (sebenarnya muat di localStorage), TETAPI
     caranya disamakan dengan plugin Alkitab & Ayat Terkait supaya
     tidak ada dua cara menyimpan di satu aplikasi.

   Kenapa data dimuat lewat tag <script>, bukan fetch?
     Saat halaman dibuka dengan file:// , Chrome melarang fetch/XHR
     ke berkas lain. Yang diizinkan hanya pemuatan lewat tag script.

   Bagian INI hanya MESIN (data + pencarian kata).
   Yang MENAMPILKAN adalah plugin/kamus/tampilan.js — dipisah supaya jelas.

   ⚠️ Sumber arti: kamus istilah alkitab + tambahan manual.
   ============================================================ */

window.ANodesKamus = (function () {
  'use strict';

  // ⚠️ Gudang yang SAMA dengan plugin Alkitab & Ayat Terkait — KUNCI-nya beda.
  const NAMA_DB     = 'anodes-plugin-db';
  const NAMA_TOKO   = 'data';
  const KUNCI       = 'kamus';                       // ← IndexedDB, BUKAN localStorage
  const BERKAS_DATA = 'plugin/kamus/data/kamus.js';

  let data = null;         // { meta, istilah:[…] } yang sedang dipakai
  let sedangMuat = null;   // kalau sedang memuat, simpan janjinya (biar tidak dobel)

  // peta cepat: huruf-kecil tulisan → entri
  let petaTulisan = new Map();
  // ⚠️ peta NAMA RESMI → entri. Dipakai saat tautan diklik: data-istilah
  //    pada tautan memakai NAMA RESMI entri (mis. "Kudus; Suci"), yang bisa
  //    memuat tanda baca sehingga TIDAK ikut masuk petaTulisan.
  //    Tanpa peta ini, klik tautan jadi "istilah … tidak ditemukan" (K50).
  let petaNama = new Map();
  // pengenal kata: satu regex alternasi, diurut dari TERPANJANG
  let termRegex = null;
  // daftar tulisan yang dipakai regex (untuk pemeriksaan & uji)
  let daftarTulisan = [];

  /* ------------------------------------------------------------
     K57 (23 Sep 2026) — BENTROK NAMA ASING
     ------------------------------------------------------------
     💬 Bapak: *“Dead Sea Scrolls <- di ambil arti sea · Takaran untuk bahan
     kering… ntah apa bisa bedakan sea < takaran dengan dead sea tentu bukan
     takaran”*

     ⇒ **“Sea”** memang istilah sah (takaran bahan kering, 1 dari 392 entri),
       tetapi di dalam **“Dead Sea Scrolls”** (nama Inggris) kata itu bermakna
       lain ⇒ **JANGAN ditandai**.

     ⚠️ **KENAPA TIDAK PAKAI ATURAN HURUF BESAR SAJA?** Sudah diukur — SALAH.
        Aturan “kata sebelumnya berhuruf besar” ikut mematikan istilah yang
        justru SAH: `Kristen` · `Israel` · `TUHAN` · `Mazmur` · `Taurat` …
        (terukur: 24 istilah sah hilang di teks sejarah, 1 di Yosua, 1 di Imamat).
     ⚠️ **KENAPA TIDAK MELARANG SEMUA KATA PENDEK?** `Injil` · `Nabi` · `Roh` ·
        `Imam` · `Puasa` · `Sabat` · `Surat` — semuanya sah dan penting.

     ✅ **Jalan yang dipilih = daftar SEMPIT (1 kata) yang memang berbahaya.**
        Diketahui dari pengukuran: dari **53 kata Inggris umum** yang diuji
        (land · water · bread · lord · king · light · law · sin …), **hanya `sea`**
        yang ada di kamus. Kata ini juga **0 kali** muncul di seluruh Alkitab
        (31.102 ayat) ⇒ tidak ada risiko kehilangan penandaan yang sah.

     ➕ **Kalau nanti ditemukan kata bentrok baru**: tambahkan ke daftar ini
        (jangan mengubah aturan umum), supaya istilah Indonesia tetap aman.
     ------------------------------------------------------------ */
  const BENTROK_ASING = ['sea'];   // huruf kecil (pembanding memakai toLowerCase)

  const hanyaHurufBesarAwal = (s) => !!s && /^[A-Z]/.test(s);

  /* ------------------------------------------------------------
     K62 (23 Sep 2026) — NAMA KITAB YANG DISEROBOT KAMUS
     ------------------------------------------------------------
     ⚠️⚠️ CACAT NYATA (Bapak: “Mazmur 23:1 tidak jadi tautan”):
     5 nama kitab juga merupakan **entri kamus** —
     `Hakim-Hakim` · `Mazmur` · `Amsal` · `Kisah Para Rasul` · `Ibrani`.
     Saat penandaan istilah jalan **ketika pengguna masih MENGETIK**
     (`tandaiSemua` dari event `input`, tunda 900 ms), kata “Mazmur” sudah
     lebih dulu diubah menjadi `span.kamus-istilah` ⇒ teks rujukan **TERPECAH**
     sehingga mesin Alkitab **tidak lagi menemukan** pola “Mazmur 23:1”
     ⇒ **tautan ayat hilang** (tombol 🔗 / 🖊 juga tidak muncul).

     ATURAN TERSEMPIT (diukur, ❌ bukan dugaan):
       Lewati istilah bila tulisannya = nama kitab **DAN** diikuti pola rujukan
       ayat (`\s*<angka>[:.]`).

     ✅ Kenapa AMAN: diukur di **seluruh 31.102 ayat**, ke-5 nama kitab itu muncul
     **0 kali** diikuti pola rujukan ⇒ ❌ tidak ada penandaan sah yang hilang.
     Kemunculan biasa tetap ditandai — `Mazmur 60×` · `Ibrani 48×` · `Amsal 4×`
     (mis. “kitab **Mazmur**”, “surat **Ibrani**”, “**Amsal** Salomo”).
     ------------------------------------------------------------ */
  const NAMA_KITAB_KAMUS = ['hakim-hakim', 'mazmur', 'amsal', 'kisah para rasul', 'ibrani'];
  const POLA_RUJUKAN_AYAT = /\s*\d{1,3}\s*[:.]/;
  const diikutiRujukanAyat = (teks, akhir) =>
    !!teks && POLA_RUJUKAN_AYAT.test(teks.slice(akhir, akhir + 8));

  /* ------------------------------------------------------------
     K83 (30 Okt 2026) — KATA GANTI WAJIB HURUF BESAR
     ------------------------------------------------------------
     ⚠️⚠️ CACAT NYATA yang ketemu saat mengukur dampak kamus nama:
     kamus nama menambahkan kata ganti (`Aku` · `Dia` · `Engkau` · `Kamu` ·
     `Ialah` …). Karena pengenal kata memakai regex **tanpa beda huruf besar/kecil**
     (`gi`), bentuk **huruf kecil** ikut ditandai — padahal itu kata biasa:
       “anak orang ini **ialah** Yoram” · “**aku** mengasihi **engkau**” ·
       “**kamu** telah mentahbiskan dirimu”
     ⇒ ayat jadi penuh garis putus-putus (terukur **17 tanda dalam 1 ayat**).

     ATURAN TERSEMPIT (diukur di seluruh 31.102 ayat, ❌ bukan dugaan):
       Kata ganti hanya ditandai bila **berawalan huruf besar**.

     ✅ Kenapa AMAN — hasil ukur:
       total tanda   72.875 → **56.154**  (−16.721 · −23 %)
       ayat bertanda 25.287 → **22.551**  (81,3 % → 72,5 %)
       maks/ayat     17 → **15**
       entri hilang  **0** (semua 605 entri tetap punya penandaan)
     ✅ Yang DIPEROLEH: “**Aku** mengasihi **engkau**” tetap ditandai pada
        “Aku” (menunjuk Allah/Yesus — memang sulit dimengerti), sedangkan
        “aku” huruf kecil (kata biasa) tidak lagi mengganggu.

     ⚠️ Daftar ini SEMPIT — hanya kata ganti. ❌ Jangan menambahkan kata biasa
        lain ke sini tanpa mengukur dampaknya lebih dulu.
     ------------------------------------------------------------ */
  const WAJIB_BESAR = ['aku', 'dia', 'engkau', 'kamu', 'ia',
                       'akulah', 'dialah', 'engkaulah', 'kamulah', 'ialah'];
  const wajibBesar = (tulisan) => WAJIB_BESAR.indexOf(String(tulisan).toLowerCase()) >= 0;

  const tungguSiap = [];   // fungsi yang menunggu sampai data siap
  const pendengar = [];    // fungsi yang dipanggil TIAP kali data siap

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
      if (saatProses) saatProses(0, 'membaca berkas kamus istilah');
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => { if (saatProses) saatProses(100, 'selesai'); selesai(); };
      s.onerror = () => gagal(new Error('berkas data kamus tidak ada: ' + src));
      document.head.appendChild(s);
    });
  }

  // apakah data yang mau dipakai masuk akal?
  function masukAkal(d) {
    if (!d || !Array.isArray(d.istilah)) return false;
    return d.istilah.length > 100;   // data asli 392 entri → jauh di atas 100
  }

  // ------------------------------------------------------------
  // siapkan peta & pengenal kata dari data
  //   Aturan SAMA dengan lab3 (buildKamus):
  //     - huruf + spasi + tanda hubung  ← tanda hubung DIPERBOLEHKAN (K50)
  //       supaya "Hakim-hakim", "Sida-sida", "Hari-hari terakhir" bisa
  //       dideteksi (dulu semua tulisan itu dibuang → tautannya tidak pernah ada)
  //     - panjang (tanpa spasi) >= 3 huruf
  //     - diurut dari TERPANJANG supaya "Orang Samaria" menang atas "orang"
  // ------------------------------------------------------------
  const HANYA_HURUF = /^[A-Za-z][A-Za-z -]*$/;

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function siapkanPeta() {
    petaTulisan = new Map();
    petaNama = new Map();
    const daftar = [];
    const sudah = new Set();

    for (const e of data.istilah) {
      // ⚠️ NAMA RESMI selalu bisa dicari — walau memuat tanda baca —
      //    sebab itulah yang ditulis di data-istilah setiap tautan.
      if (e && e.nama) petaNama.set(String(e.nama).toLowerCase(), e);
      const semua = [e.nama].concat(Array.isArray(e.alias) ? e.alias : []);
      for (const t of semua) {
        if (!t || !HANYA_HURUF.test(t)) continue;
        if (t.replace(/ /g, '').length < 3) continue;
        const k = t.toLowerCase();
        if (sudah.has(k)) continue;      // first-win (sama seperti lab3)
        sudah.add(k);
        petaTulisan.set(k, e);
        daftar.push(t);
      }
    }

    daftar.sort((a, b) => b.length - a.length);
    daftarTulisan = daftar;
    termRegex = daftar.length
      ? new RegExp('\\b(' + daftar.map(escapeRegExp).join('|') + ')\\b', 'gi')
      : null;
  }

  // ------------------------------------------------------------
  // muat(lapor) — jalan utama
  // ------------------------------------------------------------
  function muat(lapor) {
    if (data) return Promise.resolve({ dari: 'sudah-siap', jumlah: jumlahIstilah() });
    if (sedangMuat) return sedangMuat;

    const kabari = (p, t) => { if (typeof lapor === 'function') lapor(p, t); };

    sedangMuat = (async () => {
      // 1) data sudah ada di halaman? (mis. versi satu berkas) — langsung pakai
      if (window.ANodesKamusData) {
        kabari(20, 'menyiapkan');
        if (!masukAkal(window.ANodesKamusData)) {
          sedangMuat = null;
          throw new Error('isi data kamus tidak masuk akal (kosong / rusak)');
        }
        data = window.ANodesKamusData;
        siapkanPeta();
        kabari(60, 'menyimpan agar cepat dibuka lagi');
        await tulisSimpanan(data);
        kabari(100, 'selesai');
        sedangMuat = null;
        kabariPendengar();
        return { dari: 'berkas-halaman', jumlah: jumlahIstilah() };
      }

      // 2) sudah pernah disimpan di gudang besar? — pakai itu (cepat)
      kabari(10, 'memeriksa simpanan');
      const simpanan = await bacaSimpanan();
      if (masukAkal(simpanan)) {
        data = simpanan;
        siapkanPeta();
        kabari(100, 'selesai');
        sedangMuat = null;
        kabariPendengar();
        return { dari: 'simpanan', jumlah: jumlahIstilah() };
      }

      // 3) belum ada — baca berkas data (sekali saja)
      kabari(25, 'membaca data kamus istilah');
      await muatBerkas(BERKAS_DATA, kabari);

      if (!masukAkal(window.ANodesKamusData)) {
        sedangMuat = null;
        throw new Error('data kamus tidak terbaca');
      }

      data = window.ANodesKamusData;
      siapkanPeta();
      kabari(70, 'menyimpan agar cepat dibuka lagi');
      await tulisSimpanan(data);
      kabari(100, 'selesai');
      sedangMuat = null;
      kabariPendengar();
      return { dari: 'berkas-plugin', jumlah: jumlahIstilah() };
    })().catch((e) => { sedangMuat = null; throw e; });

    return sedangMuat;
  }

  // ------------------------------------------------------------
  // jalan masuk sederhana untuk TAMPILAN
  // ------------------------------------------------------------
  const siap = () => !!data;

  const jumlahIstilah = () => (data && Array.isArray(data.istilah)) ? data.istilah.length : 0;
  const jumlahTulisan = () => daftarTulisan.length;

  // cari satu istilah dari tulisan apa pun (nama resmi ATAU alias)
  function istilah(tulisan) {
    if (!siap() || !tulisan) return null;
    const k = String(tulisan).toLowerCase();
    // ⚠️ petaNama WAJIB jadi cadangan: tautan memakai nama resmi entri
    //    (mis. "Kudus; Suci") yang bisa memuat tanda baca (K50).
    return petaTulisan.get(k) || petaNama.get(k) || null;
  }

  // apakah tulisan ini istilah yang dikenal?
  const adaIstilah = (tulisan) => !!istilah(tulisan);

  // daftar SEMUA entri (untuk halaman Daftar Istilah)
  function semuaIstilah() {
    if (!siap()) return [];
    return data.istilah.slice();
  }

  // cari istilah dari sepenggal kata (untuk kotak cari halaman kamus)
  //   cocok kalau nama/alias MENGANDUNG kata itu (huruf kecil)
  function cariIstilah(kata) {
    if (!siap()) return [];
    const q = String(kata || '').trim().toLowerCase();
    if (!q) return data.istilah.slice();
    return data.istilah.filter(e => {
      if (e.nama.toLowerCase().indexOf(q) >= 0) return true;
      return (e.alias || []).some(a => a.toLowerCase().indexOf(q) >= 0);
    });
  }

  // ------------------------------------------------------------
  // PENGENAL KATA — dipakai tampilan untuk menandai istilah di teks
  //   temukanIstilah(teks) → [{ mulai, akhir, tulisan, entri }]
  //   ⚠️ Urut dari kiri ke kanan; yang lebih panjang menang (regex sudah
  //      diurut terpanjang, jadi "Orang Samaria" tidak terpotong).
  // ------------------------------------------------------------
  function temukanIstilah(teks) {
    if (!siap() || !termRegex || !teks) return [];
    const hasil = [];
    termRegex.lastIndex = 0;
    let m;
    while ((m = termRegex.exec(teks)) !== null) {
      const tulisan = m[0];
      const entri = petaTulisan.get(tulisan.toLowerCase());
      if (!entri) continue;
      /* K57 — kata yang berbenturan dengan nama asing (mis. “Sea” di dalam
         “Dead Sea Scrolls”) hanya ditandai bila ditulis HURUF KECIL.
         ⇒ “sea” (takaran) tetap hidup · “Dead Sea Scrolls” tidak diganggu. */
      if (BENTROK_ASING.indexOf(tulisan.toLowerCase()) >= 0 &&
          hanyaHurufBesarAwal(tulisan)) continue;
      /* K62 — nama kitab yang diikuti pola rujukan ayat dilewati supaya
         “Mazmur 23:1” tetap menjadi TAUTAN AYAT (bukan istilah kamus).
         ⚠️ Hanya berlaku bila bentuknya memang rujukan (`<angka>[:.]`),
         jadi “kitab Mazmur” & “surat Ibrani” TETAP ditandai istilah. */
      if (NAMA_KITAB_KAMUS.indexOf(tulisan.toLowerCase()) >= 0 &&
          diikutiRujukanAyat(teks, m.index + tulisan.length)) continue;
      /* K83 — kata ganti hanya ditandai bila berawalan HURUF BESAR.
         ⇒ “Aku mengasihi engkau” tetap menandai “Aku” (menunjuk Allah),
           sedangkan “aku”/“engkau” huruf kecil (kata biasa) dilewati.
         Terukur: −16.721 tanda (−23 %) · maks/ayat 17 → 15 · 0 entri hilang. */
      if (wajibBesar(tulisan) && !hanyaHurufBesarAwal(tulisan)) continue;
      hasil.push({ mulai: m.index, akhir: m.index + tulisan.length, tulisan, entri });
      // jaga-jaga kalau regex cocok kosong (tidak mungkin, tapi aman)
      if (m.index === termRegex.lastIndex) termRegex.lastIndex++;
    }
    return hasil;
  }

  // daftar istilah UNIK yang muncul di sebuah teks (untuk panel "Istilah di ayat ini")
  function istilahDiTeks(teks, maks) {
    const ketemu = temukanIstilah(teks);
    const unik = [];
    const sudah = new Set();
    for (const k of ketemu) {
      const key = k.tulisan.toLowerCase();
      if (sudah.has(key)) continue;
      sudah.add(key);
      unik.push(k.entri);
      if (maks && unik.length >= maks) break;
    }
    return unik;
  }

  // keterangan data (dipakai halaman keterangan plugin)
  function meta() {
    if (!siap()) return null;
    const m = data.meta || {};
    return {
      sumber: m.sumber || 'kamus istilah alkitab',
      tanggalSumber: m.tanggal || '',
      entri: jumlahIstilah(),
      tulisan: jumlahTulisan()
    };
  }

  // ------------------------------------------------------------
  // saat data siap
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

  function kabariPendengar() {
    const a = tungguSiap.splice(0, tungguSiap.length);
    a.forEach(fn => { try { fn(); } catch (e) {} });
    pendengar.slice().forEach(fn => { try { fn(); } catch (e) {} });
  }

  // hidupkan TAMPILAN (kalau berkasnya sudah dimuat)
  function hidupkanTampilan() {
    const t = window.ANodesKamusTampilan;
    if (t && typeof t.hidupkan === 'function') {
      try { t.hidupkan(); } catch (e) { console.warn('ANodes Kamus: tampilan gagal hidup', e); }
    }
  }

  padaSiap(hidupkanTampilan);

  // ------------------------------------------------------------
  // saatSiap(tugas) — untuk tombol/fungsi yang butuh data
  //   ❌ JANGAN `return` diam-diam: user harus selalu tahu kenapa.
  // ------------------------------------------------------------
  function saatSiap(tugas) {
    const plug = window.ANodesPlugin;
    if (!plug || !plug.dipasang || !plug.dipasang('kamus')) {
      pesanKecil('💡 Pasang plugin 📚 Kamus Istilah dahulu');
      return false;
    }
    if (siap()) { try { tugas(); } catch (e) { console.warn(e); } return true; }
    pesanKecil('⏳ Menyiapkan kamus istilah…');
    const lapis = plug.lapisMemuat;
    if (lapis) lapis('📚 Menyiapkan plugin Kamus Istilah…', 25, 'mohon tunggu sebentar');
    muat()
      .then(() => {
        if (lapis) lapis(null);
        try { tugas(); } catch (e) { console.warn(e); }
      })
      .catch((e) => {
        if (lapis) lapis(null);
        console.warn('ANodes Kamus: gagal memuat data', e);
        pesanKecil('⚠️ Data kamus gagal dimuat');
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
      if (lapis) lapis('📚 Memuat plugin Kamus Istilah…', p, t || 'mohon tunggu sebentar');
    };

    tandaiSiap();
    if (data) return Promise.resolve(true);

    tampil(8, 'menyiapkan…');
    return muat((persen, tahap) => tampil(persen, tahap))
      .then((hasil) => new Promise((ok) => setTimeout(() => ok(hasil), 450)))
      .then(() => {
        tandaiSiap();
        if (window.ANodesPlugin) window.ANodesPlugin.terapkanBar();
        hidupkanTampilan();
        if (lapis) lapis(null);
        pesanKecil('📚 Kamus Istilah siap — kata istilah kini bisa diklik di catatan');
        return true;
      })
      .catch((e) => {
        if (lapis) lapis(null);
        console.warn('ANodes Kamus: gagal memuat data saat dipasang', e);
        pesanKecil('⚠️ Data kamus gagal dimuat');
        return false;
      });
  }

  // tandai plugin "siap" di gudang plugin (tombol Pasang jadi aktif)
  function tandaiSiap() {
    const p = window.ANodesPlug && window.ANodesPlug.find(x => x.id === 'kamus');
    if (p) {
      p.siap = true;
      if (Array.isArray(p.tombol)) p.tombol.forEach(t => { t.siap = true; });
    }
  }

  // ⚠️ Lepas plugin TIDAK boleh menyentuh catatan user.
  //    Yang dibuang hanya: data di memori + penampilan istilah.
  //    Simpanan di IndexedDB SENGAJA dibiarkan supaya memasang lagi cepat.
  function saatDilepas() {
    if (window.ANodesKamusTampilan && window.ANodesKamusTampilan.bersihkan) {
      try { window.ANodesKamusTampilan.bersihkan(); } catch (e) {}
    }
    data = null;
    petaTulisan = new Map();
    petaNama = new Map();
    termRegex = null;
    daftarTulisan = [];
    sedangMuat = null;
  }

  // ------------------------------------------------------------
  // MUAT OTOMATIS saat halaman dibuka (PENTING)
  //   Kalau plugin sudah terpasang, data TIDAK BOLEH dimuat hanya saat
  //   tombol "Pasang" ditekan. Setelah F5 isi halaman hilang.
  // ------------------------------------------------------------
  function siapkanOtomatis() {
    const plug = window.ANodesPlugin;
    if (!plug || !plug.dipasang || !plug.dipasang('kamus')) return;
    if (data) { tandaiSiap(); return; }

    const lapis = plug.lapisMemuat;
    if (lapis) lapis('📚 Menyiapkan plugin Kamus Istilah…', 25, 'mohon tunggu sebentar');

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
        console.warn('ANodes Kamus: gagal memuat data saat membuka halaman', e);
        pesanKecil('⚠️ Data kamus gagal dimuat');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', siapkanOtomatis);
  } else {
    setTimeout(siapkanOtomatis, 0);
  }

  return {
    muat, siap, meta, dipasang, saatDilepas, siapkanOtomatis,
    istilah, adaIstilah, semuaIstilah, cariIstilah,
    temukanIstilah, istilahDiTeks,
    jumlahIstilah, jumlahTulisan,
    ketikaSiap, padaSiap, saatSiap, tandaiSiap,
    // dipakai alat uji
    get data() { return data; },
    get _tulisan() { return daftarTulisan.slice(); }
  };
})();
