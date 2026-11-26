/* ============================================================
   ANodes — plugin/peta/ayat.js
   MESIN: 📍 KATA LOKASI DI HALAMAN BACA ALKITAB  (K69 butir b–d · 5 Okt 2026)

   ------------------------------------------------------------
   Bapak 5 Okt 2026:
     *“alkitab saya perlu km kumpulkan kata2 yg mengandung kata lokasi dan
      ayat2 yg berhubungan dengan peta.. jadi tujuannya adalah dari alkitab
      user pilih kitab...dan ayat didalam pasal mengandung kata tempat atau
      ayat yg berhubungan tempat .. ditampil dibawah ayat tsb.. kata
      lokasinya .. jika di klik kata lokasi akan tampil dibawah ayat ·
      konsepnya sama seperti penguat · plugin penguat bisa km pelajari cara
      kerjanya · kalau dalam 1 ayat terdapat lebih dari 1 kata lokasi
      ditampilkan bergantian pada kolom yg sama”*
     Keputusan lanjutan Bapak:
       • *“kata lokasi berulang banyak seharusnya tetap ditunjukkan”*
         ⇒ ❌ TANPA saringan frekuensi — selama nama itu memang nama tempat,
           tetap ditampilkan.
       • >1 lokasi dalam 1 ayat ⇒ **bergantian di kolom YANG SAMA**
       • mini-peta **langsung di kolom bawah ayat** (bukan halaman terpisah)
       • mini-peta = **sama dengan halaman Peta** (citra relief NASA),
         **tanpa zoom/seret**, **titik lokasi berkedip**

   Berkas ini TIDAK menyentuh catatan pengguna. Tugasnya:
     1. membangun **indeks ayat → daftar lokasi** (dari data peta)
     2. menyediakan **mini-peta SVG** (klon jalur gambar `peta.js`)

   ⚠️ Perawatannya SATU tempat: kalau bentuk geografi di halaman peta
      diperbaiki, `gambarMini()` di bawah ikut diperbaiki ⇒ kolom ayat
      memakai bentuk yang sama (❌ tidak ada gambar peta kedua yang berbeda).
   ============================================================ */

window.ANodesPetaAyat = (function () {
  'use strict';

  const VERSI = 'v5Okt-i';           // K73 (5 Okt 2026) — nama tempat di catatan (panel bawah)
                                     //   ikut pengaturan ukuran huruf (⚙)
                                     //   K69d — 4 cacat DATA peta diperbaiki
                                     //   + alias ejaan TB (63 entri 0-cocok → 11)
                                     //   K69c — kotak mini-peta SEBENTUK panggung
                                     //   + faktor proyeksi F=1,5 (sama seperti halaman Peta)

  /* ------------------------------------------------------------
     GUDANG SIMPANAN (IndexedDB — sama seperti plugin Alkitab)
       ⚠️ Indeks ini turunan dari data peta + data Alkitab; menyimpannya
       mempercepat pembukaan berikutnya (±0,7 MB, dihitung ULANG kalau
       datanya berganti — dibuktikan lewat `sidik`).
     ------------------------------------------------------------ */
  const NAMA_DB = 'anodes-plugin-db';
  const NAMA_TOKO = 'data';
  const KUNCI = 'peta-ayat-lokasi';

  const WADAH = ['lokasi', 'daerah', 'gunung', 'sungai', 'danau', 'laut'];

  /* ============================================================
     ATURAN KATA — 🔴 HASIL UKUR atas SELURUH 31.102 ayat (5 Okt 2026)
     ------------------------------------------------------------
     ❌ `dan` (kota Dan) DIBUANG sama sekali:
          terukur 18.764 kali huruf kecil vs 2.151 kali “Dan” — dan
          **2.151 itu SEMUA konjungsi** (“**Dan** Allah menamai terang…”)
          ⇒ **0 benar** dari 18.764+2.151. Kalau dipakai, tombol 📍 muncul
          di hampir seluruh ayat (67 %) dan hampir semuanya SALAH.
     ✅ `teman` (kota Teman · Edom) WAJIB HURUF BESAR:
          terukur huruf-besar **19×** (semuanya “orang Teman” yang benar)
          tetapi huruf-kecil **41×** (“teman-teman”, “teman karibku”)
          ⇒ selisih **22 salah** kalau tidak dipisah.
     ✅ Batas kata memakai `[^a-zA-Z-]` — ❌ jangan `\b`:
          `\b` membuat “teman-teman” ikut tertangkap (kata ulang jadi 2 kata).
     ℹ️ Nama pendek lain (`gat` · `nob` · `silo` · `kana` · `ai` · `kota` …)
          **DIUKUR juga, selisihnya 0** ⇒ tidak perlu aturan huruf besar.
          (Menyetel aturan tanpa bukti justru berisiko; karena itu daftarnya
          HANYA yang benar-benar terbukti.)
     ============================================================ */
  const BUANG = ['dan'];
  const WAJIB_BESAR = ['teman'];

    /* ============================================================
       ALIAS EJAAN TB — 🔴 HASIL UKUR 5 Okt 2026 (K69d butir a)
       ------------------------------------------------------------
       Terukur **63 dari 224 entri** katalog TIDAK PERNAH dapat tombol 📍
       karena **ejaan nama di katalog ≠ ejaan Terjemahan Baru**. Contoh
       terbukti: katalog “Damaskus” tetapi TB menulis **“Damsyik”** (55 ayat);
       “Laut Merah” → TB **“laut Teberau”** (25 ayat);
       “Ecbatana” → TB **“Ahmeta”**; “Kades-Barnea” → TB **“Kadesh”**.

       ⚠️ ATURAN TERSEMPIT — ❌ BUKAN pencocokan kabur (fuzzy), ❌ bukan tebak-tebakan:
         1. **Bentuk dasar** — buang keterangan dalam kurung:
            `Yope (Jaffa)` → `Yope`, `Memfis (Nof)` → `Memfis`.
         2. **Daftar sempit** di bawah — HANYA ejaan yang **terbukti** dengan
            hitungan ayat di seluruh 31.102 ayat.
       ⚠️ Setiap kandidat diukur lebih dulu; yang **berisiko salah tandai**
          DIBUANG dari daftar (❌ jangan dipaksa masuk):
            • `Tarsis` — 26 ayat, **9 tanpa** petunjuk tempat (nama orang ·
              permata) ⇒ hanya **17** benar ⇒ dipakai alias `kapal-kapal Tarsis`.
            • `Us` — 8 ayat, hanya **3** berkonteks tempat ⇒ dipakai `tanah Us`.
            • `Raba` — 17 ayat, 1 × kata kerja “**raba**” (Kejadian 3:3)
              ⇒ dipakai `kota Raba`.
            • `Efraim` — 165 ayat, sebagian besar **suku/wilayah** ⇒ ❌ tidak dipakai.
            • `Israel` — **2.347 ayat** (bangsa) ⇒ ❌ ditolak mutlak.
       ============================================================ */
    const ALIAS = {
      'Damaskus': ['Damsyik'],
      'Susa': ['Susan'],
      'Ecbatana': ['Ahmeta'],
      'Refidim': ['Rafidim'],
      'Kades-Barnea': ['Kadesh'],
      'Tsoan (Tanis)': ['Zoan'],
      'Heliopolis (On)': ['On'],
      'Alexandria': ['Aleksandria'],
      'Kiriata-Yearim': ['Kiryat-Yearim'],
      'Adullam': ['Adulam'],
      'Lakis': ['Lakhis'],
      'Tarsyis': ['kapal-kapal Tarsis'],
      'Peniel': ['Pniel', 'Pnuel'],
      'Jabesh-Gilead': ['Yabesh-Gilead'],
      'Tishbe': ['Tisbe'],
      'Bosra (Edom)': ['Bozra'],
      'Sodom & Gomora': ['Sodom', 'Gomora'],
      'Korazim': ['Khorazim'],
      'Antiokhia Pisidia': ['Pisidia'],
      'Pergamum': ['Pergamus'],
      'Pulau Patmos': ['Patmos'],
      'Puteoli': ['Putioli'],
      'Yehuda / Yudea': ['Yudea'],
      'Negev': ['Negeb'],
      'Filistia': ['Filistin'],
      'Dataran Saron': ['Saron'],
      'Tanah Gosen': ['Gosyen'],
      'Babilonia': ['Babel'],
      'Gunung Ararat': ['Ararat'],
      'Gunung Gilboa': ['Gilboa'],
      'Laut Tengah': ['laut besar'],
      'Laut Merah': ['laut Teberau'],
      'Semenanjung Sinai': ['Sinai'],
      'Kaisarea Filippi': ['Kaisarea Filipi'],
      'Negeri Uz': ['tanah Us'],
      'Memfis (Nof)': ['Memfis'],
      'Raba (Amon)': ['Raba']
    };

    /* Beberapa bentuk dasar sudah **TERBUKTI juga** sebagai kata biasa atau
       istilah lain (diukur per ayat, ❌ bukan tebakan) ⇒ wajib **HURUF BESAR**:
         • `Raba` — bebas huruf 17 ayat, tetapi huruf BESAR **15 ayat dan
           SEMUANYA kota** (Kejadian 3:3 “**raba** buah itu” = kata kerja ·
           2 Korintus 1:1 “kami **raba** dengan tangan” ⇒ ikut kalau tidak dipisah). */
    const BESAR_TAMBAHAN = ['raba'];

    /* Nama yang bentuk dasarnya **sudah dipakai entri LAIN** (atau terlalu umum)
       ⇒ ❌ jangan dijadikan pola, kalau tidak satu nama akan menunjuk **dua**
       entri sekaligus (chip kembar) atau tombol 📍 muncul di mana-mana.
       Terukur 5 Okt 2026 — isi daftar ini SUDAH diperiksa satu per satu:
         • `Israel`   — **2.347 ayat** (bangsa, ❌ bukan tempat) — hanya ada
                        entri `Israel (utara)`.
         • `Persia`   — entri **`Persia`** [daerah] sudah ada ⇒ `Teluk Persia`
                        ❌ tidak boleh ikut memakai (jadi kembar).
         • `Nil`      — entri **`Sungai Nil`** sudah ada ⇒
                        `Nil — delta barat/timur` ❌ tidak ikut (kembar).
         • `Kreta`    — entri **`Kreta`** [daerah] sudah ada ⇒
                        `Kreta (Knossos)` ❌ tidak ikut.
         • `Antiokhia`— **`Antiokhia (Siria)`** & **`Antiokhia Pisidia`**
                        sama-sama berbentuk dasar `Antiokhia` ⇒ ❌ tidak ikut.
       ✅ Yang DIUKUR TIDAK kembar (sudah diperiksa ada/tiada entri lain) dan
          AMAN — jadi DIIZINKAN lewat bentuk dasar: `Edom (Seir)` 109 ayat ·
          `Aram (Siria)` 127 · `Asia (propinsi)` 20 · `Akhaya (Yunani)` 10.
         • `Sela`  — terukur **80 ayat**, tetapi **72 di antaranya di Mazmur**
                     = istilah musik (“*Sela*” di akhir bait) dan sisanya
                     “sela gunung batu” / nama orang ⇒ hanya **3** yang benar-benar
                     kota Sela/Petra ⇒ ❌ **ditolak** (nisbah 3/80 terlalu buruk). */
    const KEMBAR_TOLAK = ['israel', 'persia', 'nil', 'kreta', 'antiokhia', 'sela'];

    /* Rujukan katalog yang TERUKUR SALAH — daftar sempit, ❌ bukan aturan umum.
       `25.3.3` = Ratapan 3:3 (“aku dipukul-Nya…”) bukan kota Teman ⇒ ayat
       Ayub 3:3 dulu salah dapat tombol 📍. `16.22.8` = Nehemia 22:8 (tidak ada,
       Nehemia hanya 13 pasal) — sudah tertangkap pemeriksa “ayat ada”.
       ✅ K69d (5 Okt 2026): keduanya **sudah dibereskan di DATA** —
          `25.3.3` → **`18.2.11`** (Ayub 2:11 · Elifas orang Teman) ·
          `16.22.8` → **dibuang** (Yope tetap punya 3 rujukan sah lain).
       Daftar ini DIPERTAHANKAN sebagai penjaga kalau data lama termuat ulang
       dari simpanan peramban (IndexedDB/data tanam versi lama). */
    const REF_SALAH = ['25.3.3', '16.22.8'];

    /** Bentuk dasar nama: `Yope (Jaffa)` → `Yope` (keterangan kurung dibuang). */
    const bentukDasar = (n) => String(n || '').replace(/\([^)]*\)/g, ' ')
                                            .replace(/\s+/g, ' ').trim();

  const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  /* ------------------------------------------------------------
     KATALOG NAMA — nama unik → { entri, wadah, kunci }
       ⚠️ Kunci wadah `lokasi` memakai **id entri** (`lokasi:haran`) —
       inilah yang dipakai halaman peta. Wadah lain memakai nomor urut
       (`sungai:0`) supaya sama persis dengan `peta.js`.
     ------------------------------------------------------------ */
  let katalogSiap = null;

  function dataPeta() { return window.ANodesPetaData || null; }

  function katalog() {
    if (katalogSiap) return katalogSiap;
    const D = dataPeta();
    if (!D) return null;
    const peta = new Map();        // nama.lower → {entri, wadah, kunci}
    WADAH.forEach(w => {
      const arr = Array.isArray(D[w]) ? D[w] : [];
      arr.forEach((e, i) => {
        const nama = (e && e.nama ? e.nama : '').trim();
        if (!nama) return;
        const k = nama.toLowerCase();
        if (peta.has(k)) return;      // nama kembar ⇒ wadah pertama yang dipakai
        peta.set(k, { entri: e, wadah: w, kunci: w === 'lokasi' ? 'lokasi:' + e.id : w + ':' + i });
      });
    });
    katalogSiap = peta;
    return peta;
  }

  /* ------------------------------------------------------------
     INDEKS AYAT → LOKASI
       Dua jalur DIGABUNG (hasil ukur 5 Okt 2026):
         1. **rujukan katalog** `ref[]` — tiap entri peta menuliskan ayatnya
            sendiri (mis. `"6.3.15"` = Yosua 3:15)                557 ayat
         2. **cocok teks ayat** — nama katalog dicocokkan ke teks ayat,
            supaya “Yordan” di Kejadian 32:10 / Bilangan 13:29 /
            Matius 3:13 ikut dapat tombol                     3.571 ayat
       ⇒ GABUNGAN **3.721 ayat (12,0 %)** · >1 lokasi **652** · maks **7**
       Nama yang DIPAKAI untuk cocok-teks: **191 dari 192** (buang `dan`,
       dan `teman` wajib huruf besar).
     ------------------------------------------------------------ */
  let indeks = null;               // Map('b.p.a' → Set(kunci))
  let indeksSidik = '';

  function sidikIndeks() {
    const m = window.ANodesPetaData && window.ANodesPetaData.meta;
    const n = dataPeta() ? WADAH.reduce((s, w) => s + ((dataPeta()[w] || []).length), 0) : 0;
      /* ⚠️ K69d: VERSI ikut masuk sidik — kalau aturan pencocokan berubah
         (mis. alias ejaan ditambah), simpanan lama di IndexedDB **tidak boleh**
         dipakai; kalau lupa, pengguna tetap melihat hasil LAMA walau berkas
         sudah diperbarui (pelajaran K45 “sidik data tidak memuat isi”). */
      return 'pl2-' + n + '-' + ((m && m.dibuat) || '?') + '-' + VERSI;
    }

  function bangunIndeks() {
    const D = dataPeta();
    if (!D) return null;
      /* ⚠️ WAJIB menunggu data Alkitab: tanpa teks ayat, jalur (2) tidak bisa
         jalan dan rujukan katalog tidak bisa diperiksa ⇒ indeks akan salah. */
      const AL = (window.ANodesAlkitab && window.ANodesAlkitab.data) || window.ANodesAlkitabData;
      if (!AL || !AL.kitab || !AL.kitab.length) return null;

      const kat = katalog();
      const peta = new Map();
      const tambah = (key, kunci) => {
        let s = peta.get(key);
        if (!s) { s = new Set(); peta.set(key, s); }
        s.add(kunci);
      };

      /* ------------------------------------------------------------
         PERIKSA RUJUKAN KATALOG — 🔴 hasil ukur 5 Okt 2026 (695 rujukan):
           • **3 rujukan hanya 2 bagian** (`"31.3"` Sela · `"31.9"` Teman ·
             `"65.7"` Sodom) ⇒ tidak bisa menunjuk satu ayat ⇒ DILEWATI.
             Ayat yang pantas tetap masuk lewat jalur (2) cocok-teks —
             BUKTI: Obaja 1:9 (“hai Teman, akan tertegun”) tetap dapat tombol.
           • **1 rujukan menunjuk ayat yang tidak ada** (`"16.22.8"` — Nehemia
             hanya 13 pasal).
           • **2 rujukan menunjuk ayat NYATA tetapi isinya TIDAK berhubungan**
             (terukur, bukan dugaan):
               – `"25.3.3"` (Ratapan 3:3 “aku dipukul-Nya berulang-ulang”)
                 untuk kota **Teman** ⇒ dulu Ayub 3:3 salah dapat tombol 📍
               – `"16.22.8"` sudah tertangkap di atas.
           ⇒ ATURAN TERSEMPIT (bukan aturan umum): hanya 2 kode itu yang
             dibuang lewat `REF_SALAH`. ❌ JANGAN membuang rujukan hanya karena
             ayatnya tidak menyebut namanya — terukur 180 rujukan (26 %) yang
             “tersirat” tetapi BENAR (mis. Sodom ⇒ Kejadian 19:24, Nil ⇒ 15:18).
         ------------------------------------------------------------ */
      const ayatNyata = (r) => {
        const p = String(r).split('.');
        if (p.length !== 3) return false;
        const k = AL.kitab[Number(p[0]) - 1];
        if (!k) return false;
        const ps = k.pasal.find(x => x.no === Number(p[1]));
        if (!ps) return false;
        return !!ps.ayat.find(x => x.no === Number(p[2]));
      };

      /* (1) RUJUKAN KATALOG */
      kat.forEach((o) => {
        const nama = (o.entri.nama || '').trim().toLowerCase();
        if (BUANG.indexOf(nama) >= 0) return;
        (o.entri.ref || []).forEach(r => {
          if (REF_SALAH.indexOf(r) >= 0) return;
          if (ayatNyata(r)) tambah(r, o.kunci);
        });
      });

      /* (2) COCOK TEKS AYAT
            🔴 K69d (5 Okt 2026): tiap entri boleh dicocokkan dengan
            **beberapa ejaan** — nama katalog · **bentuk dasar** (buang kurung)
            · **alias ejaan TB** (daftar sempit `ALIAS`).
            ⚠️ satu ejaan dipakai SATU entri saja (`pakaiEjaan`) supaya nama yang
            sama tidak muncul **dua kali** (chip kembar) — mis. `Laut Tengah`
            memakai `laut besar` sedangkan entri `Laut` yang lain tidak ikut.
            Hasil ukur: 63 entri 0-cocok → **11** · 3.591 → **6.185 ayat**
            (11,5 % → 19,9 %) · maks lokasi/ayat **7 → 8**. */
      const cocok = [];
      const pakaiEjaan = Object.create(null);   // ejaan.lower → kunci pemilik
      kat.forEach((o, nama) => {
        if (BUANG.indexOf(nama) >= 0) return;
        const daftar = [nama];
        const dasar = bentukDasar(nama).toLowerCase();
        if (dasar && dasar !== nama) daftar.push(bentukDasar(nama));
        (ALIAS[o.entri.nama] || []).forEach(x => { if (daftar.indexOf(x) < 0) daftar.push(x); });
        daftar.forEach((t) => {
          const k = t.toLowerCase();
          if (KEMBAR_TOLAK.indexOf(k) >= 0) return;      // kata terlalu umum/kembar
          if (pakaiEjaan[k] && pakaiEjaan[k] !== o.kunci) return;  // sudah milik entri lain
          pakaiEjaan[k] = o.kunci;
                    const besar = WAJIB_BESAR.indexOf(k) >= 0 || BESAR_TAMBAHAN.indexOf(k) >= 0;
          const tulisan = besar ? t.replace(/^./, c => c.toUpperCase()) : t;
          cocok.push({
            kunci: o.kunci,
            re: new RegExp('(^|[^a-zA-Z-])' + esc(tulisan) + '(?![a-zA-Z-])', besar ? '' : 'i')
          });
        });
      });

      AL.kitab.forEach((k, ki) => {
        k.pasal.forEach(p => p.ayat.forEach(a => {
          const teks = a.teks || '';
          if (!teks) return;
          const key = (ki + 1) + '.' + p.no + '.' + a.no;
          for (let i = 0; i < cocok.length; i++) {
            if (cocok[i].re.test(teks)) tambah(key, cocok[i].kunci);
          }
        }));
      });

      indeksSidik = sidikIndeks();
      indeks = peta;
      return peta;
    }

  /* ------------------------------------------------------------
     SIAPKAN — bangun indeks SEKALI, pakai simpanan kalau sidiknya sama
         ⚠️ Indeks BUTUH **teks ayat** ⇒ kalau data Alkitab belum siap,
         jangan mengaku gagal: tunggu (`ketikaSiap`) lalu bangun.
         Pemeriksa berkala dipasang sebagai cadangan supaya tidak menggantung
         selamanya kalau pemberitahuan siap tidak pernah datang (mis. plugin
         Alkitab belum terpasang).
       ------------------------------------------------------------ */
    let sedangSiap = null;

    function siap() { return !!indeks; }

    function siapkan() {
      if (indeks) return Promise.resolve(true);
      if (sedangSiap) return sedangSiap;
      sedangSiap = new Promise((ok) => {
        const bangun = () => {
          const p = bangunIndeks();
          sedangSiap = null;
          if (!p) { ok(false); return; }        // data belum ada → coba lagi nanti
          simpanKeDb();
          ok(true);
        };
        const dariSimpanan = () => {
        muatDariDb().then((isi) => {
          if (isi && isi.sidik === sidikIndeks() && isi.daftar) {
            indeks = new Map();
            Object.keys(isi.daftar).forEach(k => indeks.set(k, new Set(isi.daftar[k])));
            indeksSidik = isi.sidik;
            sedangSiap = null;
            ok(true);
            return;
          }
          bangun();
        }).catch(bangun);
        };

        const mAl = window.ANodesAlkitab;
        if (mAl && typeof mAl.siap === 'function' && !mAl.siap()
            && typeof mAl.ketikaSiap === 'function') {
          mAl.ketikaSiap(dariSimpanan);        // tunggu TEKS AYAT dulu
          /* cadangan: periksa sendiri tiap 250 ms (maks ±10 detik) */
          let n = 0;
          const jam = setInterval(() => {
            n += 1;
            if (mAl.siap()) { clearInterval(jam); dariSimpanan(); }
            else if (n > 40) { clearInterval(jam); }
          }, 250);
          return;
        }
        dariSimpanan();
      });
      return sedangSiap;
    }

    /** Tunggu sampai indeks benar-benar siap — tugas hanya dijalankan kalau
        indeks BERHASIL dibangun (❌ jangan mengaku siap padahal data belum ada). */
    function saatSiap(tugas) {
      if (indeks) { tugas(true); return; }
      siapkan().then((berhasil) => { if (berhasil) tugas(true); });
    }

  /* ---------- IndexedDB ---------- */
  function bukaDB() {
    return new Promise((ok, gagal) => {
      if (!window.indexedDB) { gagal(new Error('IndexedDB tidak didukung')); return; }
      const minta = indexedDB.open(NAMA_DB, 1);
      minta.onupgradeneeded = () => {
        const db = minta.result;
        if (!db.objectStoreNames.contains(NAMA_TOKO)) db.createObjectStore(NAMA_TOKO);
      };
      minta.onsuccess = () => ok(minta.result);
      minta.onerror = () => gagal(minta.error || new Error('gagal membuka IndexedDB'));
    });
  }

  function simpanKeDb() {
    if (!indeks) return Promise.resolve(false);
    const daftar = {};
    indeks.forEach((v, k) => { daftar[k] = Array.from(v); });
    return bukaDB().then(db => new Promise((ok) => {
      try {
        const tx = db.transaction(NAMA_TOKO, 'readwrite');
        tx.objectStore(NAMA_TOKO).put({ sidik: indeksSidik, daftar }, KUNCI);
        tx.oncomplete = () => ok(true);
        tx.onerror = () => ok(false);
      } catch (e) { ok(false); }
    })).catch(() => false);
  }

  function muatDariDb() {
    return bukaDB().then(db => new Promise((ok) => {
      try {
        const tx = db.transaction(NAMA_TOKO, 'readonly');
        const r = tx.objectStore(NAMA_TOKO).get(KUNCI);
        r.onsuccess = () => ok(r.result || null);
        r.onerror = () => ok(null);
      } catch (e) { ok(null); }
    })).catch(() => null);
  }

  /* ------------------------------------------------------------
     DAFTAR LOKASI SATU AYAT — array kunci, urut seperti halaman peta
       (air → wilayah → gunung → kota) supaya terasa sama.
     ------------------------------------------------------------ */
  const URUT = { sungai: 1, danau: 2, laut: 3, daerah: 4, gunung: 5, lokasi: 6 };

  function daftarLokasi(kitab, pasal, ayat) {
    if (!indeks) return [];
    const s = indeks.get(kitab + '.' + pasal + '.' + ayat);
    if (!s || !s.size) return [];
    return Array.from(s).sort((a, b) => {
      const ua = URUT[a.split(':')[0]] || 9, ub = URUT[b.split(':')[0]] || 9;
      if (ua !== ub) return ua - ub;
      return b.length - a.length;               // nama panjang dulu (biasanya lebih khusus)
    });
  }

  /** Apakah ayat ini punya lokasi? (cepat — dipakai saat menghias) */
  function ada(kitab, pasal, ayat) {
    return !!(indeks && indeks.has(kitab + '.' + pasal + '.' + ayat));
  }

  /** Ambil keterangan satu lokasi (dipakai kolom bawah ayat) */
  function info(kunci) {
    const D = dataPeta();
    if (!D || !kunci) return null;
    const w = kunci.split(':')[0];
    const id = kunci.slice(w.length + 1);
    let e = null;
    if (w === 'lokasi') e = (D.lokasi || []).find(x => String(x.id) === id);
    else e = (D[w] || [])[Number(id)];
    if (!e) return null;
    return {
      kunci: kunci, nama: e.nama, ket: e.ket || '', ref: e.ref || [],
      bujur: e.bujur, lintang: e.lintang, titik: e.titik || null,
      jenis: e.jenis || (w === 'lokasi' ? 'kota' : w), wadah: w
    };
  }

  /** Label jenis yang enak dibaca (pola sama halaman peta: daerah ⇒ “wilayah”) */
  const NAMA_JENIS = { daerah: 'wilayah', kota: 'kota', pulau: 'pulau', gunung: 'gunung',
                       sungai: 'sungai', laut: 'laut', danau: 'danau', gurun: 'gurun',
                       tempat: 'tempat', rute: 'rute' };
  function labelJenis(j) { return NAMA_JENIS[j] || j || 'lokasi'; }

  /* ------------------------------------------------------------
     🔴 K73 (5 Okt 2026) — CARI NAMA TEMPAT DI TEKS CATATAN
     ------------------------------------------------------------
     Bapak: *“di catatan / di note .. ketik sungai yordan juga harusnya ada
     daftar peta .. tampil ada di kolom paling bawah note.. km bisa liat ayat &
     istilah .. di tempatkan di sana”*

     ⇒ Panel 📋 Ayat & Istilah di bawah catatan ditambah bagian **🗺️ Peta**.
     ⚠️ Catatan hanya berisi TEKS (❌ tanpa nomor kitab/pasal/ayat) ⇒ nama tempat
        dicocokkan langsung ke teks, memakai **aturan tersempit yang sudah
        TERUKUR** di K69d (❌ bukan aturan baru yang belum diuji):
          • `BUANG`        — `dan` (2.151× konjungsi, 0 benar)
          • `WAJIB_BESAR`  — `teman` (huruf kecil 41× = “teman-teman”, salah)
          • `KEMBAR_TOLAK` — `israel · persia · nil · kreta · antiokhia · sela`
          • `BESAR_TAMBAHAN` — `raba` (huruf besar 15 ayat, semuanya kota ✓)
          • batas kata `[^a-zA-Z-]` (❌ bukan `\b` — “teman-teman” jadi 2 kata)
     ⇒ Keputusan Bapak: **SEMUA 191 nama** katalog ikut dicari (bukan hanya
       yang “jelas”), tetapi tetap disaring aturan di atas.
     ------------------------------------------------------------ */
  let cocokCatatanSiap = null;

  function cocokCatatan() {
    if (cocokCatatanSiap) return cocokCatatanSiap;
    const kat = katalog();
    if (!kat) return null;
    const daftar = [];
    const pakaiEjaan = Object.create(null);
    kat.forEach((o, nama) => {
      if (BUANG.indexOf(nama) >= 0) return;
      const ejaan = [nama];
      const dasar = bentukDasar(nama).toLowerCase();
      if (dasar && dasar !== nama) ejaan.push(bentukDasar(nama));
      (ALIAS[o.entri.nama] || []).forEach(x => { if (ejaan.indexOf(x) < 0) ejaan.push(x); });
      ejaan.forEach((t) => {
        const k = t.toLowerCase();
        if (KEMBAR_TOLAK.indexOf(k) >= 0) return;
        if (pakaiEjaan[k] && pakaiEjaan[k] !== o.kunci) return;
        pakaiEjaan[k] = o.kunci;
        const besar = WAJIB_BESAR.indexOf(k) >= 0 || BESAR_TAMBAHAN.indexOf(k) >= 0;
        const tulisan = besar ? t.replace(/^./, c => c.toUpperCase()) : t;
        daftar.push({
          kunci: o.kunci,
          nama: o.entri.nama,
          re: new RegExp('(^|[^a-zA-Z-])' + esc(tulisan) + '(?![a-zA-Z-])', besar ? '' : 'i')
        });
      });
    });
    cocokCatatanSiap = daftar;
    return daftar;
  }

  /**
   * Cari nama tempat di dalam TEKS catatan.
   * @returns {Array<{kunci,nama}>} unik, urut seperti halaman peta (air → wilayah → gunung → kota)
   */
  function temukanLokasiDiTeks(teks) {
    const daftar = cocokCatatan();
    if (!daftar || !teks) return [];
    const dapat = new Map();                 // kunci → nama
    for (let i = 0; i < daftar.length; i++) {
      if (daftar[i].re.test(teks)) dapat.set(daftar[i].kunci, daftar[i].nama);
    }
    return Array.from(dapat.entries())
      .map(([kunci, nama]) => ({ kunci, nama }))
      .sort((a, b) => {
        const ua = URUT[a.kunci.split(':')[0]] || 9, ub = URUT[b.kunci.split(':')[0]] || 9;
        if (ua !== ub) return ua - ub;
        return a.nama.localeCompare(b.nama);
      });
  }

  /* ------------------------------------------------------------
     MINI-PETA — **klon** jalur gambar `peta.js` (citra relief NASA)
       Keputusan Bapak: “mini-peta **sama dengan halaman Peta**, tanpa
       zoom/seret, **titik lokasi berkedip**”.
       ⚠️ Titik tengah proyeksi = **titik lokasi** itu sendiri ⇒ lokasi
       selalu berada di tengah kolom (❌ tidak perlu menghitung bingkai
       khusus, ❌ tidak perlu memuat tiap bentuk untuk tahu di mana ia).
     ------------------------------------------------------------ */
  const SVGNS = 'http://www.w3.org/2000/svg';
  const NS = (t) => document.createElementNS(SVGNS, t);

  function dataBumi() {
    const BU = window.ANodesPetaBumi;
    return (BU && BU.datar) ? BU.datar : null;
  }

  /** batas proyeksi = jendela citra bumi (sama seperti peta.js → `pasangB()`) */
  function batas() {
    const bm = dataBumi();
    const D = dataPeta();
    if (bm && bm.bbox) return bm.bbox;
    return (D && D.batas) || { bujurMin: 21, bujurMax: 48, lintangMin: 23, lintangMax: 42.5 };
  }

  /** Radius gumpalan wilayah — pola SAMA dengan `radiusDaerah()` di peta.js */
  function radiusDaerah(nm) {
    const n = (nm || '').toLowerCase();
    if (/mesopotamia|babilonia|persia|media|arabia|asir|asyur|mesir|elam|kus|etiopia|italia|makedonia|akhaya|galatia|asia|pontus|bitinia|kapadokia|kilikia|frigia/.test(n)) return 46;
    if (/kanaan|israel|yehuda|gilead|basan|sinai|midian|paran|negev|uz|aram|siria/.test(n)) return 30;
    return 22;
  }

  function titikTengah(t2) {
    if (!t2 || !t2.length) return [0, 0];
    let sx = 0, sy = 0;
    t2.forEach(t => { sx += t[0]; sy += t[1]; });
    return [sx / t2.length, sy / t2.length];
  }

  /**
   * Gambar mini-peta untuk SATU atau BEBERAPA lokasi.
   * @param {SVGElement} svg  wadah `<svg>` (dibuat pemanggil)
   * @param {string[]} kunci  daftar kunci lokasi yang ingin disorot
   * @param {object} opsi     `{ lebar, tinggi, kedip }`
   */
  function gambarMini(svg, kunci, opsi) {
    if (!svg) return false;
    const D = dataPeta();
    if (!D) return false;
    const o = opsi || {};
        const W = o.lebar || 480;
        const H = o.tinggi || 240;
        /* keputusan keselamatan: kalau pengguna meminta “kurangi gerak”, titik
           TIDAK berkedip (pelajaran aksesibilitas — animasi tanpa henti) */
        let kedip = o.kedip !== false;
        try {
          if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) kedip = false;
        } catch (e) {}

        const info0 = info(kunci && kunci[0]);
        if (!info0) return false;

        /* titik tengah kolom = lokasi utama */
        let bj = info0.bujur, lt = info0.lintang;
        if (bj === undefined || lt === undefined) {
          const e = info0.titik ? titikTengah(info0.titik) : null;
          if (e) { bj = e[0]; lt = e[1]; }
          else { bj = (batas().bujurMin + batas().bujurMax) / 2; lt = (batas().lintangMin + batas().lintangMax) / 2; }
        }

        /* 🔴 K69c — DUA hal yang menentukan BENTUK peta (bukan selera, terukur):
           (1) kotak proyeksi WAJIB **sebentuk panggung** (W:H) — kalau tidak, citra
                   **ditarik**. Dulu separuh tinggi diambil dari SELURUH tinggi peta
                   (`(lintangMax-lintangMin)/2` = 10,5°) lalu lebar dihitung dari rasio
                   panggung ⇒ kotak **8,75° × 21,00°** = 0,42:1 padahal panggungnya 2,40:1
                   ⇒ citra **ditarik 5,76× lebih tinggi dari lebarnya** ⇒ bentuk daratan &
                   sungai **tidak dikenali**;
           (2) `F` = rasio piksel **lintang terhadap bujur** WAJIB sama dengan halaman Peta.
                   Di halaman Peta kanvas 480×360 memuat 42°×21° ⇒ **F = 1,5**; tanpa F,
                   mini-peta tampak **gepeng** dibanding halaman Peta
                   (K69c: contoh yang Bapak tunjuk = pasted image).
                   Catatan: F = 1,5 setara “1,5× peregangan lintang di ekuator”
                   (cos 33° ≈ 0,84) — jadi justru **lebih benar** dari 1:1.
           `o.bujur`/`o.lintang` = ukuran kotak (opsional; dipakai alat uji). */
        const F = 1.5;
        /* ±8° bujur ⇒ kotak 16° × 5,3° · terukur: citra NASA **penuh** untuk 167/191 titik
           (87 %); ±21° (versi lama) = 0 % ⇒ itulah sebab tepi peta dulu tanpa relief. */
        const LEBAR_BAWAAN = 8;
        let hw, hh;
        if (o.bujur || o.lintang) {
          hh = o.lintang || ((o.bujur || LEBAR_BAWAAN) * (H / W) / F);
          hw = o.bujur || (hh * F * W / H);
        } else {
          hw = LEBAR_BAWAAN; hh = hw * (H / W) / F;
          /* kalau yang disorot LEBIH LUAS dari kotak (mis. wilayah dengan banyak titik),
                 lebarkan secukupnya — supaya yang disorot SELALU masuk kotak */
          (kunci || []).forEach(k => {
                const x = info(k); if (!x) return;
                let bMin, bMax, lMin, lMax;
                if (x.titik && x.titik.length) {
                  const bs = x.titik.map(t => t[0]), ls = x.titik.map(t => t[1]);
                  bMin = Math.min.apply(null, bs); bMax = Math.max.apply(null, bs);
                  lMin = Math.min.apply(null, ls); lMax = Math.max.apply(null, ls);
                } else if (x.bujur !== undefined && x.lintang !== undefined) {
                  bMin = bMax = x.bujur; lMin = lMax = x.lintang;
                } else return;
                hw = Math.max(hw, (bMax - bMin) / 2 * 1.2, ((lMax - lMin) / 2) * F * W / H * 1.2);
                hh = hw * (H / W) / F;
          });
          hw = Math.min(hw, (batas().bujurMax - batas().bujurMin) / 2);   // batas: seluruh jendela
          hh = hw * (H / W) / F;
        }
        /* pusat kotak dijaga supaya seluruh isinya berada DI DALAM jendela citra NASA —
           di luar jendela itu hanya **warna datar** (❌ tanpa relief) ⇒ bentuk menyesatkan
           (halaman Peta pun menggeser jendelanya, lihat `hitungTinggiPeta()`). */
        const bmB0 = (dataBumi() && dataBumi().bbox) ? dataBumi().bbox : batas();
        if (bmB0.bujurMax - bmB0.bujurMin >= hw * 2) {
          bj = Math.min(Math.max(bj, bmB0.bujurMin + hw), bmB0.bujurMax - hw);
        }
        if (bmB0.lintangMax - bmB0.lintangMin >= hh * 2) {
          lt = Math.min(Math.max(lt, bmB0.lintangMin + hh), bmB0.lintangMax - hh);
        }
        const kotak = { bujurMin: bj - hw, bujurMax: bj + hw, lintangMin: lt - hh, lintangMax: lt + hh };
    const px = b => (b - kotak.bujurMin) / (kotak.bujurMax - kotak.bujurMin) * W;
    const py = l => (kotak.lintangMax - l) / (kotak.lintangMax - kotak.lintangMin) * H;
    const jalur = (t2) => (t2 || []).map((t, i) => (i ? 'L' : 'M') + px(t[0]).toFixed(1) + ' ' + py(t[1]).toFixed(1)).join(' ');

    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'mini-peta ' + info0.nama);

    const tambah = (el) => svg.appendChild(el);

    /* 1) samudra */
    const lautLatar = NS('rect');
    lautLatar.setAttribute('x', 0); lautLatar.setAttribute('y', 0);
    lautLatar.setAttribute('width', W); lautLatar.setAttribute('height', H);
    lautLatar.setAttribute('fill', '#12324f');
    tambah(lautLatar);

    /* 2) permukaan bumi (citra relief NASA) — digambar di KLIP kotak proyeksi,
          sebab citra hanya mencakup jendela tertentu. */
    const bm = dataBumi();
    if (bm && bm.dataUri) {
      const bmB = bm.bbox || batas();
      const x = px(bmB.bujurMin), y = py(bmB.lintangMax);
      const w = px(bmB.bujurMax) - x, h = py(bmB.lintangMin) - y;
      const img = NS('image');
      img.setAttribute('x', x.toFixed(1)); img.setAttribute('y', y.toFixed(1));
      img.setAttribute('width', w.toFixed(1)); img.setAttribute('height', h.toFixed(1));
      img.setAttribute('preserveAspectRatio', 'none');
      img.setAttribute('href', bm.dataUri);
      img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', bm.dataUri);
      img.style.pointerEvents = 'none';
      tambah(img);
    }

    /* 3) garis pantai daratan (tipis — citra sudah memberi bentuknya) */
    (D.darat || []).forEach(dr => {
      const el = NS('path');
      el.setAttribute('d', jalur(dr.titik) + ' Z');
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', '#e8dcc0');
      el.setAttribute('stroke-width', '0.7');
      el.setAttribute('opacity', '0.55');
      tambah(el);
    });

    /* 4) sungai & danau (penting — di citra tidak ada garis sungai) */
    (D.sungai || []).forEach(r => {
      const el = NS('path');
      el.setAttribute('d', jalur(r.titik));
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', '#7fc4f0');
      el.setAttribute('stroke-width', '1.6');
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('opacity', '0.9');
      tambah(el);
    });
    (D.danau || []).forEach(l => {
      const el = NS('path');
      el.setAttribute('d', jalur(l.titik) + ' Z');
      el.setAttribute('fill', 'rgba(40,110,160,.55)');
      el.setAttribute('stroke', '#8fd0f5');
      el.setAttribute('stroke-width', '0.8');
      tambah(el);
    });
    (D.laut || []).forEach(l => {
      const el = NS('path');
      el.setAttribute('d', jalur(l.titik) + ' Z');
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', 'rgba(180,225,250,.5)');
      el.setAttribute('stroke-width', '0.6');
      tambah(el);
    });

    /* 5) titik yang disorot */
    const daftar = (kunci || []).map(info).filter(x => x);
    daftar.forEach((x, i) => {
      let cx, cy;
      if (x.bujur !== undefined && x.lintang !== undefined) { cx = px(x.bujur); cy = py(x.lintang); }
      else if (x.titik) { const t = titikTengah(x.titik); cx = px(t[0]); cy = py(t[1]); }
      else return;

      /* sungai → garis tebal, bukan titik */
      if (x.wadah === 'sungai') {
        const r = (D.sungai || []).find(s => s.nama === x.nama);
        if (r) {
          const el = NS('path');
          el.setAttribute('d', jalur(r.titik));
          el.setAttribute('fill', 'none');
          el.setAttribute('stroke', '#ffd54f');
          el.setAttribute('stroke-width', '2.6');
          el.setAttribute('stroke-linecap', 'round');
          el.setAttribute('opacity', '0.95');
          tambah(el);
        }
      }
      /* wilayah → gumpalan/elips */
      if (x.wadah === 'daerah') {
        const r = radiusDaerah(x.nama);
        const el = NS('ellipse');
        el.setAttribute('cx', cx.toFixed(1)); el.setAttribute('cy', cy.toFixed(1));
        el.setAttribute('rx', (r * 0.82).toFixed(1)); el.setAttribute('ry', (r * 0.58).toFixed(1));
        el.setAttribute('fill', 'rgba(255,213,79,.22)');
        el.setAttribute('stroke', '#e8281b');
        el.setAttribute('stroke-width', '1.3');
        tambah(el);
      }

      /* halo lembut supaya titik terlihat di atas citra */
      const halo = NS('circle');
      halo.setAttribute('cx', cx.toFixed(1)); halo.setAttribute('cy', cy.toFixed(1));
      halo.setAttribute('r', '9');
      halo.setAttribute('fill', 'rgba(255,213,79,.28)');
      tambah(halo);

      /* cincin berkedip — ❌ tanpa animasi kalau `kedip === false` */
      const ring = NS('circle');
      ring.setAttribute('cx', cx.toFixed(1)); ring.setAttribute('cy', cy.toFixed(1));
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', '#ffd54f');
      ring.setAttribute('stroke-width', '1.5');
      if (kedip) {
        ring.setAttribute('r', '6');
        const an = NS('animate');
        an.setAttribute('attributeName', 'r');
        an.setAttribute('values', '6;18;6');
        an.setAttribute('dur', '1.8s');
        an.setAttribute('repeatCount', 'indefinite');
        ring.appendChild(an);
        const an2 = NS('animate');
        an2.setAttribute('attributeName', 'opacity');
        an2.setAttribute('values', '0.95;0;0.95');
        an2.setAttribute('dur', '1.8s');
        an2.setAttribute('repeatCount', 'indefinite');
        ring.appendChild(an2);
      } else {
        ring.setAttribute('r', '12');
        ring.setAttribute('opacity', '0.75');
      }
      tambah(ring);

      /* titik */
      const dot = NS('circle');
      dot.setAttribute('cx', cx.toFixed(1)); dot.setAttribute('cy', cy.toFixed(1));
      dot.setAttribute('r', '3.4');
      dot.setAttribute('fill', '#ffd54f');
      dot.setAttribute('stroke', '#7a4a00');
      dot.setAttribute('stroke-width', '1');
      tambah(dot);

      /* nama di samping titik — ukurannya **ikut pengaturan huruf** (K69f).
               ⚠️ Kanvas mini-peta memakai **viewBox 480** yang diperkecil ke lebar
               layar ⇒ angka di sini juga satuan viewBox (bukan px layar). */
            const fMini = (window.ANodesPeta && ANodesPeta.fontPeta) ? ANodesPeta.fontPeta(13) : 13;
            const sk = fMini / 13;                      // 1 = ukuran bawaan (16px)
            const lbl = NS('text');
            lbl.setAttribute('x', (cx + 7 * sk).toFixed(1));
            lbl.setAttribute('y', (cy + 3.5 * sk).toFixed(1));
            lbl.setAttribute('class', 'pl-mlbl pl-nm');
            lbl.style.fontSize = fMini + 'px';
            lbl.textContent = x.nama;
            tambah(lbl);
          });

    return true;
  }

  /* ------------------------------------------------------------
     API
     ------------------------------------------------------------ */
  return {
    versi: () => VERSI,
      /* K69f — ukuran label mini-peta (satuan viewBox) mengikuti ⚙ pengaturan */
      fontMini: (n) => ((window.ANodesPeta && ANodesPeta.fontPeta) ? ANodesPeta.fontPeta(n) : n),
      siap, siapkan, saatSiap, siapkanIndeks: bangunIndeks,
      daftarLokasi, ada, info, labelJenis,
      gambarMini,
      /* 🔴 K73 (5 Okt 2026) — cari nama tempat di TEKS catatan (panel bawah catatan) */
      temukanLokasiDiTeks,
    angka: () => ({
      ayat: indeks ? indeks.size : 0,
      nama: katalog() ? katalog().size : 0,
      dibuang: BUANG.slice(),
      wajibBesar: WAJIB_BESAR.slice()
    }),
    // dipakai alat uji
    _kunciDb: () => KUNCI,
    _sidik: () => indeksSidik
  };
})();