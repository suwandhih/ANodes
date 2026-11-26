/* ============================================================
   ANodes — plugin/peta/peta.js
   MESIN PLUGIN: 🗺️ PETA ALKITAB  (K68 — 4 Okt 2026)

   ------------------------------------------------------------
   Bapak 4 Okt 2026: *“peta-lab sekarang di jadikan plugin pada
   ANodes-1berkas dengan nama peta..”*
   ⇒ LAB peta (`peta-lab.html`) dipindah menjadi **plugin resmi**
     dengan **halaman sendiri** (pola 📖 Sejarah K55c).

   Isi berkas ini = MESIN + TAMPILAN peta (dulu satu blok di
   `peta-lab.html`). Yang berubah hanya:
     • nama global data  : `ANodesPetaLabData` → **`ANodesPetaData`**
     • nama global citra : `ANodesBumiLab`     → **`ANodesPetaBumi`**
     • id elemen diberi awalan `peta-` supaya ❌ tidak bentrok
       dengan id aplikasi (`#info`, `#bar`, `#catatan`, …)
     • dibungkus jadi `window.ANodesPeta` (mesin) + `ANodesPetaTampilan`
   ============================================================ */

window.ANodesPeta = (function () {
  'use strict';
  const VERSI = 'v5Okt-h';   // K72 (5 Okt 2026) — peta lama SVG dihapus · dasar peta selalu citra NASA
  const D = window.ANodesPetaData || {};

  /* ============================================================
     🔴 K69f (5 Okt 2026) — UKURAN NAMA IKUT PENGATURAN HURUF
     ------------------------------------------------------------
     Bapak: *“nama2 titik sangat kecil dibuat ukuran font sesuai
     pengaturan / setting”*.

     SEBAB (diukur, ❌ bukan diduga): ukuran nama di peta ditulis
     **angka tetap** dalam satuan viewBox:
        `const FONT = { kota: 13, laut: 17, … }`
     sedangkan **daftar nama (chip)** memakai `font-size: 11.5px`
     tetap di CSS ⇒ keduanya ❌ tidak ikut **⚙ Pengaturan › ukuran
     huruf** (skala aplikasi = `data.font / 16`).

     SATUAN: kanvas peta = **viewBox 480 unit** (0..480) yang
     **diperkecil** ke lebar layar (±0,66× di HP) ⇒ ukuran label
     sudah dirancang “lebih besar” dari ukuran layar. Karena itu
     **faktor skala dipakai APA ADANYA** (❌ tanpa dikali lagi),
     supaya `--skala` = 1 (16px) menghasilkan tampilan **persis
     seperti sebelum revisi ini** (❌ tidak ada perubahan tampilan
     yang tidak diminta).
     ============================================================ */
  const BAWAAN_HURUF = 16;
  function skala() {
    try {
      const s = window.ANodesSetting && ANodesSetting.ambil ? ANodesSetting.ambil().font : null;
      const n = Number(s);
      if (isFinite(n) && n >= 8 && n <= 48) return n / BAWAAN_HURUF;
    } catch (e) {}
    return 1;
  }
  /** Ukuran label peta (satuan viewBox) yang mengikuti pengaturan huruf. */
  function fontPeta(n) { return n * skala(); }
  /** Ukuran label mini-peta — dipisah supaya alat uji bisa membedakan. */
  function fontMini(n) { return n * skala(); }

  /* ============================================================
     🌍 DASAR PETA: CITRA BUMI NYATA — permintaan Bapak 4 Okt 2026
     ------------------------------------------------------------
     Bapak: “saya niat mengubah peta yg sekarang ini dengan peta yg
     lebih realistis.. yg sekarang kurang bagus.. saya ingin seperti
     di https://www.chngmkr.com/”

     Situs itu = **globe 3D** (three.js) bertekstur citra bumi NASA
     (`globe-relief.webp`). ANodes ❌ tanpa internet & ❌ tanpa WebGL
     ⇒ jalannya: **citra relief NASA** (domain publik) dipasang
     sebagai DASAR peta di dalam SVG, bentuk tetap **DATAR** (atlas).
     Data citra dibuat `tools/siapkan-bumi-lab.js`
     (NASA GIBS — Blue Marble: Shaded Relief + Bathymetry).

     🔴 K72 (5 Okt 2026) — Bapak: *“saya minta map lama svg (sederhana)
     di hapus saja.. supaya lebih irit space · jadi tidak perlu ada tombol
     [bumi] langsung tampil map baru saja”*
     ⇒ **GAMBAR SVG LAMA DIHAPUS SELURUHNYA** (laut bergradasi · daratan
     polos · poligon laut/darat · garis sungai & danau · ikon gunung
     3 puncak + salju) beserta **tombol 🌍 bumi**. Dasar peta sekarang
     **SELALU** citra relief NASA — ❌ tidak ada lagi sakelar.
     ============================================================ */
  const BU = window.ANodesPetaBumi || null;

  /** Jendela citra bumi yang dipakai peta (bentuk DATAR — keputusan Bapak 4 Okt 2026). */
  function jendelaBumi() {
    if (!BU) return null;
    return BU.datar || null;
  }

  /* Batas peta lama — dipakai sebagai cadangan kalau citra bumi tidak ada. */
  const B_PETA = Object.assign({}, D.batas || { bujurMin:21, bujurMax:48, lintangMin:23, lintangMax:42.5 });
  let B = Object.assign({}, B_PETA);

  /** Wilayah citra tetap → jadikan batas proyeksi (jendela citra `datar`). */
  function pasangB() {
    const bm = jendelaBumi();
    B = Object.assign({}, (bm && bm.bbox) ? bm.bbox : B_PETA);
  }

  const W = 480;                          // kanvas logis (viewBox) — lebar tetap
  /* ⚠️ H dihitung OTOMATIS (lihat `hitungTinggiPeta()`) supaya:
     (a) peta SELALU selebar penuh (❌ tanpa celah kiri-kanan),
     (b) SELURUH peta terlihat (kanvas selalu sama rasio dengan kotaknya ⇒ ❌ tanpa potongan),
     (c) masih ada ruang untuk daftar/informasi di bawahnya.
     Bapak (28 Sep 2026): “peta sekarang di freeze.. mempengaruhi informasi dibawah..
     dibawah hanya 1 baris” — sebabnya peta 4:3 selebar penuh = 75% tinggi layar. */
  let H = 360;
  const RASIO_MIN = 0.36, RASIO_MAKS = 0.75;   // 2,8:1 (pipih) … 4:3 (lega)
  /* Sisakan ruang untuk bagian bawah (kepala · tombol · kepala panel · penyaring · catatan)
     + **≥3 baris chip** ⇒ peta mengambil sisanya, dengan batas:
       • paling tinggi 75% lebar ⇒ bentuk 4:3 (lega)
       • paling tinggi 55% tinggi layar ⇒ daftar tetap dapat ruang
       • paling pipih 36% lebar ⇒ ❌ jangan sampai gepeng */
  function hitungTinggiPeta() {
    const lab = document.querySelector('.peta-lab');
    /* ⚠️ Saat halaman masih `hidden`, lebar kotaknya 0 ⇒ kalau dipakai,
       tinggi peta jadi tak masuk akal (puluhan ribu px). Karena itu pakai
       lebar jendela sebagai cadangan. */
    const lebar = (lab && lab.clientWidth > 40 ? lab.clientWidth : window.innerWidth) || 1;
    const ambil = (s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().height : 0; };
    let bawah = ambil('.peta-kepala') + ambil('.peta-bar') + ambil('.peta-panel-kepala')
                  + ambil('.peta-saring') + ambil('.peta-catatan') + 3 * 28 * skala() + 14;
    if (!(bawah > 80)) bawah = 300;                       // pengaman saat pengukuran belum siap
    let hpx = window.innerHeight - bawah;
    hpx = Math.min(hpx, window.innerHeight * 0.55, lebar * RASIO_MAKS);
    hpx = Math.max(hpx, lebar * RASIO_MIN);
    hpx = Math.max(110, hpx);
    return Math.max(110, Math.round(W * (hpx / lebar)));
  }

  /* ---------- proyeksi bujur/lintang → x/y kanvas ----------
     Kotak proyeksi (`P0`) = seluruh kanvas (bentuk DATAR). */
  let P0 = { x: 0, y: 0, w: W, h: H };
  const px = b => P0.x + (b - B.bujurMin) / (B.bujurMax - B.bujurMin) * P0.w;
  const py = l => P0.y + (B.lintangMax - l) / (B.lintangMax - B.lintangMin) * P0.h;
  const P = (bujur, lintang) => ({ x: px(bujur), y: py(lintang) });

  const SVGNS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('peta-svg');
  const NS  = (t) => document.createElementNS(SVGNS, t);

  /* ---------- klasifikasi daerah: gurun / subur / biasa ---------- */
  //  ditentukan dari NAMA daerah (data peta tidak menyimpan jenis lahan)
  function jenisDaerah(nama) {
    const n = (nama || '').toLowerCase();
    if (/gurun|paran|negev|arabia|sinai|midian|uz/.test(n)) return 'gurun';
    if (/mesir|gosen|kanaan|israel|yehuda|yudea|galilea|samaria|gilead|basan|saron|filistia|moab|amon|edom|seir|dataran|lembah|negeri/.test(n)) return 'subur';
    return 'biasa';
  }

  /* ---------- jalur SVG dari daftar titik ---------- */
  function jalur(titik2) {
    return (titik2 || []).map((t, i) => (i ? 'L' : 'M') + px(t[0]).toFixed(1) + ' ' + py(t[1]).toFixed(1)).join(' ');
  }

  /* ---------- BOLA BERGARIS HALUS (untuk daerah) ---------- */
  //  membentuk "gumpalan" lembut di sekitar satu titik → terasa seperti area,
  //  bukan sekadar titik. (data hanya punya TITIK, bukan poligon)
  function gumpalan(cx, cy, r, acak) {
    const n = 14, titik = [];
    let a = acak || 0;
    for (let i = 0; i < n; i++) {
      a = (a * 9301 + 49297) % 233280 / 233280;      // acak-tetap (deterministik)
      const jari = r * (0.74 + a * 0.5);
      const t = (i / n) * Math.PI * 2;
      titik.push([cx + Math.cos(t) * jari, cy + Math.sin(t) * jari * 0.74]);
    }
    let s = 'M' + titik[0][0].toFixed(1) + ' ' + titik[0][1].toFixed(1);
    for (let i = 1; i < titik.length; i++) {
      const p0 = titik[i], p1 = titik[(i + 1) % titik.length];
      const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
      s += ' Q' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1);
    }
    return s + ' Z';
  }

  /* ---------- lukis peta ---------- */
  let lapisNama = null, lapisAir = null, lapisGurun = null, lapisBatas = null;
  let tampilNama = false, lapisTitik = true;   // lapisTitik = tombol 🏙️ titik (setara 💧/🏜️/🌿/⛰️)
  let airHidup = true, gurunHidup = true, suburHidup = false, reliefHidup = true;
  let terpilih = null;              // id titik yang diklik ⇒ nama + titik diperbesar

  /* ---------- KONTROL NAMA PER-LOKASI (konsep Bapak 28 Sep 2026) ----------
     Peta mandiri menyediakan DAFTAR NAMA; user klik nama ⇒ lokasi itu tampil
     di peta. Jadi kalau ada nama yang saling menimpa, user sendiri yang
     mengatur nama mana yang perlu ditampilkan.
       • BAWAAN TAMPIL  : air (laut/danau/sungai) + gurun
       • BAWAAN SEMBUNYI: kota · gunung · daerah lain
     Dua himpunan di bawah menyimpan permintaan user yang MENYIMPANG dari bawaan. */
  /* ============================================================
     KONSEP NAMA DI PETA (ditetapkan Bapak 28 Sep 2026 — JANGAN diubah):
       1. Peta mulai **BERSIH** — hanya bentuk (laut · sungai · pulau · darat ·
          gunung · gurun). ❌ TANPA nama · ❌ TANPA titik.
       2. Tombol jenis (`🏙️ titik` · `💧 air` · `⛰️ relief` · `🏜️ gurun` ·
          `🗺️ daerah`) = **PENYARING DAFTAR** saja — **peta TIDAK berubah**.
          Boleh beberapa nyala bersamaan (sakelar).
       3. Klik nama di DAFTAR ⇒ nama itu **muncul di peta** (titik + nama).
       4. Tombol jenis **OFF** ⇒ nama jenis itu **hilang dari peta**
          (tapi tetap diingat — ON lagi ⇒ muncul kembali).
     ============================================================ */
  const namaPilih = new Set();   // nama yang DIPILIH user dari daftar ⇒ tampil di peta
  const namaGagal = new Set();   // nama yang diminta tampil tetapi belum dapat tempat
  let daftarMode = 'kosong';

  /** Jenis (tombol) yang mengatur sebuah nama — dari awalan kuncinya. */
  function jenisDariKunci(kunci) {
    const p = String(kunci).split(':')[0];
    if (p === 'lokasi') return 'titik';
    if (p === 'laut' || p === 'danau' || p === 'sungai') return 'air';
    if (p === 'gunung') return 'relief';
    if (p === 'daerah') {
      const w = (D.daerah || [])[Number(String(kunci).split(':')[1])];
      return (w && jenisDaerah(w.nama) === 'gurun') ? 'gurun' : 'daerah';
    }
    return null;
  }

  /**
   * Apakah nama ini TAMPIL di peta?
   *   = user MEMILIH-nya dari daftar **DAN** tombol jenisnya masih NYALA.
   * ⚠️ Inilah satu-satunya penentu — ❌ tidak ada “bawaan” per-nama.
   */
  function namaTampil(kunci) {
    if (!namaPilih.has(kunci)) return false;
    const j = jenisDariKunci(kunci);
    return j ? jenisHidup.has(j) : false;
  }

  function lukis() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    H = hitungTinggiPeta();               // tinggi kanvas menyesuaikan jendela
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    // kotak panggung disetel SAMA dengan rasio kanvas ⇒ peta mengisi penuh
    // (❌ celah kiri-kanan) TANPA terpotong (❌ bukan “zoom in”)
    const pg = document.getElementById('peta-panggung');
    if (pg) pg.style.paddingBottom = (H / W * 100).toFixed(2) + '%';
    // kanvas 4:3 & kotak panggung juga 4:3 (dari baris di atas) ⇒ `slice` MENGISI PENUH
    // kotaknya TANPA memotong peta (tidak ada kelebihan ⇒ tidak ada yang terpotong)
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

    /* ====== DASAR PETA — citra bumi nyata ⇒ tentukan kotak proyeksi ======
       Bentuk peta = **DATAR** (keputusan Bapak 4 Okt 2026: *“cukup citra
       realistisnya, bentuk tetap datar”*) ⇒ kotak proyeksi = seluruh kanvas.
       Bentuk ini **persis sama dengan peta lama** ⇒ posisi lokasi tidak bergeser. */
    P0 = { x: 0, y: 0, w: W, h: H };

    /* ====== <defs> — gradien & pola ====== */
    const defs = NS('defs');
    defs.innerHTML =
      // tanah subur
      '<radialGradient id="gSubur" cx="50%" cy="50%" r="58%">' +
        '<stop offset="0%" stop-color="#c2dc95" stop-opacity="0.72"/>' +
        '<stop offset="58%" stop-color="#c9e0a0" stop-opacity="0.44"/>' +
        '<stop offset="100%" stop-color="#c9e0a0" stop-opacity="0"/></radialGradient>' +
      // padang gurun
      '<radialGradient id="gGurun" cx="50%" cy="50%" r="58%">' +
        '<stop offset="0%" stop-color="#e9c877" stop-opacity="0.92"/>' +
        '<stop offset="58%" stop-color="#e5c473" stop-opacity="0.62"/>' +
        '<stop offset="100%" stop-color="#e5c473" stop-opacity="0"/></radialGradient>' +
      // bentang pergunungan
      '<radialGradient id="gGunung" cx="50%" cy="50%" r="60%">' +
        '<stop offset="0%" stop-color="#9b8362" stop-opacity="0.95"/>' +
        '<stop offset="66%" stop-color="#ab9370" stop-opacity="0.6"/>' +
        '<stop offset="100%" stop-color="#ab9370" stop-opacity="0"/></radialGradient>' +
      // tekstur pasir (titik-titik halus)
      '<pattern id="pPasir" width="9" height="9" patternUnits="userSpaceOnUse">' +
        '<circle cx="2" cy="2.4" r="0.45" fill="#c9ae74" opacity="0.33"/>' +
        '<circle cx="6.4" cy="6" r="0.38" fill="#d3bb85" opacity="0.28"/></pattern>' +
      // debu abu-abu rapat untuk area gurun yang dipilih
      '<pattern id="pDebu" width="7" height="7" patternUnits="userSpaceOnUse">' +
        '<circle cx="1.3" cy="1.5" r="0.72" fill="#72777d" opacity="0.78"/>' +
        '<circle cx="5.1" cy="2.7" r="0.52" fill="#858a90" opacity="0.68"/>' +
        '<circle cx="2.8" cy="5.7" r="0.48" fill="#666c72" opacity="0.7"/></pattern>' +
      // relief bayangan lembut
      '<filter id="fSangat" x="-40%" y="-40%" width="180%" height="180%">' +
        '<feGaussianBlur stdDeviation="6.5"/></filter>';
    svg.appendChild(defs);

    const gPeta = NS('g'); svg.appendChild(gPeta);
    const tambah = (el) => gPeta.appendChild(el);

    /* ====== 1) SAMUDRA (latar) ======
       K72 — dasar peta SELALU citra relief NASA ⇒ latar samudra cukup gelap
       polos (permukaan bumi yang bergambar ditaruh di langkah 1b). */
    const samudra = NS('rect');
    samudra.setAttribute('x', -W); samudra.setAttribute('y', -H);
    samudra.setAttribute('width', W * 3); samudra.setAttribute('height', H * 3);
    samudra.setAttribute('fill', '#12324f');
    tambah(samudra);

    /* ====== 1b) PERMUKAAN BUMI (citra relief NASA — dasar peta) ====== */
    if (BU) {
      const bm = jendelaBumi();
      const img = NS('image');
      img.setAttribute('x', P0.x.toFixed(1));
      img.setAttribute('y', P0.y.toFixed(1));
      img.setAttribute('width', P0.w.toFixed(1));
      img.setAttribute('height', P0.h.toFixed(1));
      img.setAttribute('preserveAspectRatio', 'none');
      img.setAttribute('href', bm.dataUri);
      img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', bm.dataUri);
      /* Label + objek peta digambar DI ATAS gambar ini. */
      img.style.pointerEvents = 'none';
      tambah(img);
    }

    /* ====== 3) LAUT ======
       K72 — citra relief NASA yang menjadi bentuk laut/darat; menggambar
       poligon laut & darat di atasnya akan MENUTUPI citra (cacat!).
       ⇒ poligon laut/darat lama **DIHAPUS**; yang tersisa hanya garis pantai
       tipis (kelas `pantai-nama`) untuk wilayah perairan yang sedang DIPILIH,
       supaya batas penamaannya tetap jelas. */

    /* ====== 3b) GARIS PEMISAH nama perairan (satu laut, dua nama) ======
       Revisi Bapak 28 Sep 2026: “ada laut walau satu tempat tapi terbelah 2 nama”
       ➕ butir 2 (28 Sep 2026): “pasted image ada titik warna merah itu apa ?”
       ⇒ dulu **putus-putus** ⇒ tampak seperti coretan merah kecil yang membingungkan.
         Sekarang **GARIS PENUH** + **halo putih** ⇒ jelas = batas PENAMAAN laut. */
    (D.pemisah || []).forEach(g => {
      const halo = NS('path');
      halo.setAttribute('d', jalur(g.titik));
      halo.setAttribute('class', 'peta-pemisah-halo');
      tambah(halo);
      const el = NS('path');
      el.setAttribute('d', jalur(g.titik));
      el.setAttribute('class', 'peta-pemisah-air peta-pemisah-tipis');
      tambah(el);
    });

    /* ====== 4) PADANG GURUN & TANAH SUBUR (lapis lembut di atas darat) ====== */
    /* Bentuk geografi (warna gurun & tanah subur) ikut tombolnya seperti semula. */
    const gGurun = NS('g'); gGurun.setAttribute('opacity', gurunHidup ? 1 : 0); tambah(gGurun);
    const gSubur = NS('g'); gSubur.setAttribute('opacity', suburHidup ? 1 : 0); tambah(gSubur);

    (D.daerah || []).forEach(w => {
      const j = jenisDaerah(w.nama);
      if (j === 'biasa') return;
      const p = P(w.bujur, w.lintang);
      const r = radiusDaerah(w.nama);
      let el;
      if (j === 'gurun') {
        /* ✅ Revisi Bapak 28 Sep 2026: *“yg gurun ada ide ngak icon apa .. dari pada
           border bulat... kurang cantik”* ⇒ gurun digambar sebagai **gumpalan tidak
           beraturan** (organik), ❌ bukan elips bulat. */
        el = NS('path');
        el.setAttribute('d', bentukGurun(w.nama, p.x, p.y, r));
      } else {
        el = NS('ellipse');
        el.setAttribute('cx', p.x.toFixed(1));
        el.setAttribute('cy', p.y.toFixed(1));
        el.setAttribute('rx', (r * 0.82).toFixed(1));
        el.setAttribute('ry', (r * 0.58).toFixed(1));
      }
      el.setAttribute('fill', j === 'gurun' ? 'url(#gGurun)' : 'url(#gSubur)');
      el.setAttribute('filter', 'url(#fSangat)');
      (j === 'gurun' ? gGurun : gSubur).appendChild(el);
    });
    // tekstur pasir lembut di atas gurun (bentuk sama, sedikit lebih kecil)
    (D.daerah || []).filter(w => jenisDaerah(w.nama) === 'gurun').forEach(w => {
      const p = P(w.bujur, w.lintang);
      const r = radiusDaerah(w.nama) * 0.86;
      const el = NS('path');
      el.setAttribute('d', bentukGurun(w.nama, p.x, p.y, r));
      el.setAttribute('fill', 'url(#pPasir)');
      el.setAttribute('opacity', 0.5);
      gGurun.appendChild(el);
    });

    /* ====== 5) BENTANG PERGUNUNGAN ======
       ✅ Arahan Bapak 28 Sep 2026: *“di peta saya sarankan gambar gunung di
          permanen saja sama seperti laut”* ⇒ ikon gunung **SELALU tampil**
          (❌ tidak ikut tombol ⛰️ relief). Tombol ⛰️ relief hanya mengatur
          **DAFTAR nama** gunung (dan nama yang dipilih user).
       ➕ *“kalau klik gunung gilboa warna icon gunung hijau diganti merah..
          di klik lagi hijau lagi”* ⇒ ikon gunung yang **DIPILIH** berubah
          **MERAH** (menandai gunung yang mana) — ❌ bukan ikon di depan nama. */
    const gGunung = NS('g');
    /* Mode citra bumi: penanda gunung = **segitiga kecil** saja (peta NASA sudah
       menampilkan pergunungan yang tajam & berbayang) supaya tidak menutupi dan
       tidak terlihat seperti gambar tempelan. Mode lama: ikon 3 puncak + salju. */
    gGunung.setAttribute('class', 'peta-ikon-tipis');
    tambah(gGunung);
    {
      (D.gunung || []).forEach((g, i) => {
        const p = P(g.bujur, g.lintang);
        /* Gunung yang DIPILIH user ⇒ ikon MERAH (penanda “gunung yang mana”). */
        const dipilih = namaTampil('gunung:' + i);
        /* K72 — dasar peta citra relief NASA (pergunungan sudah tajam & berbayang)
           ⇒ cukup **satu segitiga kecil** ringkas (penanda), warna tetap merah
           bila dipilih. Ikon 3 puncak + salju (peta lama) DIHAPUS. */
        const t = NS('path');
        t.setAttribute('d', 'M' + (p.x - 4.2).toFixed(1) + ' ' + (p.y + 3.4).toFixed(1) +
          ' L' + p.x.toFixed(1) + ' ' + (p.y - 4.8).toFixed(1) +
          ' L' + (p.x + 4.2).toFixed(1) + ' ' + (p.y + 3.4).toFixed(1) + ' Z');
        t.setAttribute('fill', dipilih ? 'rgba(201,58,45,0.88)' : 'rgba(72,100,58,0.75)');
        t.setAttribute('stroke', dipilih ? '#7d1610' : 'rgba(18,30,14,0.8)');
        t.setAttribute('stroke-width', '0.7');
        t.setAttribute('stroke-linejoin', 'round');
        gGunung.appendChild(t);
      });
    }

    /* ====== 6) SUNGAI ======
       K72 — citra relief NASA sudah memuat sungai sungguhan (Nil · Yordan ·
       Efrat — terlihat berkelok) ⇒ garis sungai lama **DIHAPUS** supaya tidak
       menutupi (dan tidak menggandakan gambar). Wilayah SUNGAI yang DIPILIH
       user tetap diberi **garis putus-putus** (lihat `gambarBatas`). */

    /* ====== 7) DANAU ======
       K72 — danau sudah tergambar di citra relief NASA (Laut Galilea · Laut Mati ·
       Danau Urmia) ⇒ poligon danau lama **DIHAPUS** supaya citra tetap terlihat. */

    /* Kotak label yang sudah ditempatkan — dipakai `taruh()` untuk menghindari
       tabrakan. ⚠️ Didaftarkan **SEBELUM** titik digambar supaya **label tidak
       menimpa dot** (revisi Bapak 28 Sep 2026: *“nama dengan dot jangan menimpa ..
       supaya terlihat dot”*). */
    const kotakDipakai = [];

    /* ====== 8) TITIK LOKASI ======
       ✅ KONSEP (Bapak 28 Sep 2026): peta mulai **BERSIH** — ❌ tanpa titik permanen.
          Titik muncul **hanya** untuk nama yang **DIPILIH user dari daftar**
          (`namaTampil` = dipilih DAN tombol 🏙️ titik nyala).
          ⇒ titik & nama **selalu berpasangan** 1:1.
       ✅ Revisi Bapak 28 Sep 2026: *“titik jangan bulat terlalu banyak bulat.. apa dot
          saja”* ⇒ dulu tiap kota digambar **3 lingkaran** (cincin putih + isi merah +
          lingkaran luar) sehingga terlihat “banyak bulat”. Sekarang cukup **SATU dot**
          (lingkaran kecil) + garis tepi tipis supaya tetap terlihat di atas peta. */
    (D.lokasi || []).forEach(l => {
      if (!namaTampil('lokasi:' + l.id)) return;
      const p = P(l.bujur, l.lintang);
      const dot = NS('circle');
      dot.setAttribute('cx', p.x.toFixed(1)); dot.setAttribute('cy', p.y.toFixed(1));
      dot.setAttribute('r', 3.4);
      dot.setAttribute('fill', '#c0392b');
      dot.setAttribute('stroke', '#fdfaf2');
      dot.setAttribute('stroke-width', 1.1);
      dot.style.cursor = 'pointer';
      dot.setAttribute('data-id', l.id);
      tambah(dot);
      /* Daftarkan kotak dot ⇒ label (kota/wilayah/gunung) **tidak boleh menimpanya**
         supaya dot tetap terlihat. Kotak dibuat sedikit lebih besar dari dot
         (r 3,4 + tepi 1,1 ⇒ ±4,5) supaya ada udara. */
      kotakDipakai.push({ l: p.x - 5.5, t: p.y - 5.5, r: p.x + 5.5, b: p.y + 5.5 });
    });

    /* ====== 9) NAMA — empat lapis (AIR · GURUN · umum · KOTA) ======
       • lapisAir   = nama LAUT · DANAU · SUNGAI ⇒ **SELALU tampil** (tombol 💧)
       • lapisGurun = nama PADANG GURUN ⇒ ikut tombol 🏜️ (bawaan hidup)
       • lapisNama  = nama DAERAH lain + GUNUNG ⇒ ikut tombol 🏷️ (bawaan samar)
       • lapisKota  = nama KOTA ⇒ hanya yang TERPILIH (+ mode 🏷️ semua)

       ⚠️ Supaya nama TIDAK saling menimpa, tiap label ditaruh lewat `taruh()`:
          dicoba beberapa posisi geser; yang pertama TIDAK bertabrakan dipakai.
          Kalau semuanya bertabrakan, label itu **tidak digambar** (titiknya tetap ada).
          Prioritas gambar (yang lebih penting didahulukan): AIR → GURUN → GUNUNG
          → DAERAH → KOTA.                                                    */
    /* ⚠️ Ketiga lapis nama **selalu tampil** (❌ bukan `samar`/`opacity:0`) —
       sebab isinya sudah disaring per-item (`namaTampil`). Kalau diberi `samar`,
       nama yang DITANDAI user **digambar tetapi tidak terlihat** (cacat 28 Sep 2026:
       “klik nama sungai A keluar dengan garis merah … tapi nama ada” — nama hanya
       terlihat di daftar, tidak di peta). */

    /* lapis GARIS BATAS wilayah — digambar **DI BAWAH nama** (arahan Bapak 28 Sep 2026:
       *“border merah harus dibawah nama bukan diatas”*) ⇒ ditambahkan SEBELUM lapis nama.
       Isinya diisi `gambarBatas()` (dipanggil dari `lukis()`). */
    lapisBatas = NS('g');
    lapisBatas.setAttribute('id', 'lapisBatas');
    svg.appendChild(lapisBatas);

    lapisAir = NS('g');
    lapisAir.setAttribute('id', 'lapisAir');
    svg.appendChild(lapisAir);

    lapisGurun = NS('g');
    lapisGurun.setAttribute('id', 'lapisGurun');
    svg.appendChild(lapisGurun);

    lapisNama = NS('g');
    lapisNama.setAttribute('id', 'lapisNama');
    /* ⚠️ Lapis ini **selalu tampil** (❌ bukan `samar`/`opacity:0`) — sebab isinya
       sudah disaring per-item (tombol ⛰️ relief · 🗺️ daerah · 🏷️ semua · pilihan
       dari daftar). Kalau diberi `samar`, nama gunung **digambar tetapi tidak
       terlihat** (cacat 28 Sep 2026). */
    svg.appendChild(lapisNama);

    const lapisKota = NS('g');
    lapisKota.setAttribute('id', 'lapisKota');
    svg.appendChild(lapisKota);

    /* Lapis GARIS PENUNJUK — ditaruh **DI BAWAH** lapis label supaya label selalu
       menutupi garis (❌ garis tidak memotong tulisan). ✅ Revisi Bapak 28 Sep 2026. */
    const lapisPenunjuk = NS('g');
    lapisPenunjuk.setAttribute('id', 'lapisPenunjuk');
    svg.insertBefore(lapisPenunjuk, lapisKota);
    namaGagal.clear();         // diisi ulang tiap kali peta digambar

    /**
     * Geseran yang dicoba (dx, dy) — disusun SPIRAL otomatis (bukan daftar tetap),
     * supaya label mudah mendapat tempat tanpa menimpa label lain.
     * Melebar ke kanan-kiri (×1,7) karena label umumnya lebar tapi pendek.
     */
    const GESER = (() => {
      const g = [[0, 0]];
      [6, 11, 16, 21, 26, 31, 36, 44, 54, 64].forEach((rr, idx) => {
        const n = idx < 2 ? 8 : (idx < 5 ? 12 : 16);
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          g.push([Math.round(Math.cos(a) * rr * 1.7), Math.round(Math.sin(a) * rr * 0.85)]);
        }
      });
      return g;
    })();

    /* Daftar geser RAPAT untuk label KOTA — label tetap di samping dot-nya.
       Urutan: kanan → atas → bawah → makin jauh (tetap vertikal dulu). */
    const GESER_DEKAT = (() => {
      const g = [[0, 0]];
      [10, 20, 30, 42, 56].forEach(dy => { g.push([0, -dy]); g.push([0, dy]); });
      [14, 28, 44].forEach(dx => {
        g.push([dx, 0]); g.push([dx, -10]); g.push([dx, 10]);
        g.push([dx, -20]); g.push([dx, 20]);
      });
      return g;
    })();

    /**
     * Nama untuk DI PETA — dipendekkan supaya mudah dibaca & mudah mendapat tempat.
     * Legenda sudah menjelaskan warna, jadi awalan yang berulang tidak perlu
     * diulang di setiap label (contoh: “Sungai Yordan” ⇒ “Yordan”).
     */
    function namaPeta(nama, jenis) {
      let n = String(nama || '');
      if (jenis === 'sungai') {
        n = n.replace(/^Sungai\s+/i, '')
             .replace(/^Nil\s*[—–-]\s*delta\s*(barat|timur)$/i, 'Delta $1');
      }
      n = n.replace(/^Negeri\s+/i, '').replace(/^Semenanjung\s+/i, '').replace(/^Gurun\s+/i, '');
      return n;
    }

    /**
     * Ukur lebar/tinggi teks SUNGGUHAN (pakai getBBox) — ❌ bukan perkiraan.
     * Pelajaran: perkiraan “jumlah huruf × angka” beberapa kali salah sehingga
     * label yang bertabrakan TIDAK terdeteksi. Ukur, jangan tebak.
     */
    let pengukur = null;
    function ukurLabel(o) {
      if (!pengukur || !pengukur.isConnected) {
        pengukur = NS('text');
        pengukur.setAttribute('visibility', 'hidden');
        pengukur.style.pointerEvents = 'none';
        svg.appendChild(pengukur);
      }
      pengukur.setAttribute('class', 'peta-lb ' + o.kelas);
      pengukur.style.fontSize = o.font + 'px';
      pengukur.setAttribute('text-anchor', 'start');
      pengukur.textContent = o.isi;
      const b = pengukur.getBBox();
      return { lebar: b.width, tinggi: b.height };
    }

    /**
     * Tempatkan satu label di posisi terbaik yang TIDAK bertabrakan.
     * @param {object} o {x, y, isi, kelas, font, anchor:'tengah'|'kiri', prioritas}
     * @returns {text|null} elemen <text> yang ditempatkan, atau null kalau penuh
     */
    function taruh(o) {
      const uk = ukurLabel(o);
      const lebar = uk.lebar + 2.5;          // beri sedikit udara antar label
      const tinggi = uk.tinggi + 1.4;
      /* `dekat` = label KOTA ⇒ pakai daftar geser **rapat & vertikal** supaya label
         tetap di samping dot-nya (❌ tidak dilempar jauh oleh spiral besar) ⇒
         garis penunjuk jadi pendek & ❌ tidak saling menyilang.
         ✅ Revisi Bapak 28 Sep 2026. */
      const daftar = o.dekat ? GESER_DEKAT : GESER;
      for (let i = 0; i < daftar.length; i++) {
        const cx = o.x + daftar[i][0];
        const cy = o.y + daftar[i][1];
        // SVG y = garis dasar teks ⇒ kotak label naik dari titik y
        const kiri = o.anchor === 'kiri' ? cx : cx - lebar / 2;
        const kotak = { l: kiri, t: cy - tinggi * 0.82, r: kiri + lebar, b: cy + tinggi * 0.22 };
        let tabrak = false;
        for (let k = 0; k < kotakDipakai.length; k++) {
          const q = kotakDipakai[k];
          if (!(kotak.r <= q.l || kotak.l >= q.r || kotak.b <= q.t || kotak.t >= q.b)) { tabrak = true; break; }
        }
        if (tabrak) continue;
        kotakDipakai.push(kotak);
        const t = NS('text');
        t.setAttribute('x', cx.toFixed(1));
        t.setAttribute('y', cy.toFixed(1));
        if (o.anchor !== 'kiri') t.setAttribute('text-anchor', 'middle');
        t.setAttribute('class', 'peta-lb ' + o.kelas);
        t.style.fontSize = o.font + 'px';
        t.textContent = o.isi;
        /* posisi yang BENAR-BENAR dipakai — dipakai pemanggil untuk menggambar
           garis penunjuk dari dot ke label (kalau label terdorong jauh). */
        t._px = cx; t._py = cy;
        return t;
      }
      /* `paksa` = nama yang DIPILIH USER SATU-SATU ⇒ WAJIB muncul walau
         bertabrakan (arahan Bapak: “timpa menimpa tidak masalah”). Kalau tidak
         dipaksa, label yang tidak dapat tempat **tidak digambar** — inilah yang
         membuat nama pilihan user terasa “hilang”. */
      if (o.paksa) {
        const cx = o.x, cy = o.y;
        const kiri = o.anchor === 'kiri' ? cx : cx - lebar / 2;
        kotakDipakai.push({ l: kiri, t: cy - tinggi * 0.82, r: kiri + lebar, b: cy + tinggi * 0.22 });
        const t = NS('text');
        t.setAttribute('x', cx.toFixed(1));
        t.setAttribute('y', cy.toFixed(1));
        if (o.anchor !== 'kiri') t.setAttribute('text-anchor', 'middle');
        t.setAttribute('class', 'peta-lb ' + o.kelas);
        t.style.fontSize = o.font + 'px';
        t.textContent = o.isi;
        t._px = cx; t._py = cy;
        return t;
      }
      return null;   // tidak ada tempat → label tidak digambar
    }

    /* 🔴 K69f — ukuran dasar label mengikuti **pengaturan huruf** (⚙).
       Angka = titik tolak pada skala 1 (16px) ⇒ tampilan lama tetap sama. */
    const FONT = (() => {
      const n = { laut: 17, danau: 13.5, sungai: 13.5, gurun: 14, gunung: 13, daerah: 13, kota: 13, kotaAktif: 17 };
      const o = {};
      for (const k in n) o[k] = fontPeta(n[k]);
      return o;
    })();

    /* ============================================================
       GAMBAR NAMA — hanya nama yang DIPILIH user dari daftar
       (`namaTampil` = dipilih DAN tombol jenisnya nyala).
       Urutan: KOTA → AIR → GURUN → DAERAH → GUNUNG
       (kota didahulukan supaya pasti dapat tempat — paling sering dipakai).
       ============================================================ */
    const sudahAda = new Set();   // cegah nama kembar digambar dua kali

    // — 1) KOTA / LOKASI —
    D.lokasi.forEach(l => {
      const kunci = 'lokasi:' + l.id;
      if (!namaTampil(kunci)) return;
      if (sudahAda.has(l.nama)) return;
      sudahAda.add(l.nama);
      const p = P(l.bujur, l.lintang);
      const t = taruh({
        x: p.x + 6.4, y: p.y + 2.1, isi: l.nama,
        kelas: 'peta-lb-kota peta-lb-kota-aktif', font: FONT.kotaAktif, paksa: true,
        /* ✅ Revisi Bapak 28 Sep 2026: *“nama dengan dot jangan menimpa .. supaya
           terlihat dot”* ⇒ label mulai **di samping kanan dot** (`anchor:'kiri'`),
           ❌ bukan di tengah dot. Jadi dot selalu terlihat & label jelas pasangannya. */
        anchor: 'kiri', dekat: true
      });
      if (t) {
        /* Garis penunjuk: kalau label terdorong jauh dari dot (karena menghindari
           tabrakan), tarik garis tipis dari dot ke label ⇒ jelas pasangannya.
           ✅ Revisi Bapak 28 Sep 2026: *“boleh kalau bisa”*. */
        const jauh = Math.hypot(t._px - (p.x + 6.4), t._py - (p.y + 2.1));
        if (jauh > 11) {
          const ln = NS('line');
          ln.setAttribute('x1', (p.x + 4.6).toFixed(1));
          ln.setAttribute('y1', p.y.toFixed(1));
          ln.setAttribute('x2', (t._px - 1.6).toFixed(1));
          ln.setAttribute('y2', (t._py - 3.2).toFixed(1));
          ln.setAttribute('class', 'peta-lb-penunjuk');
          lapisPenunjuk.appendChild(ln);
        }
        lapisKota.appendChild(t);
      } else namaGagal.add(kunci);
    });

    // — 2) AIR (laut · danau · sungai) —
    D.laut.forEach((l, i) => {
      const kunci = 'laut:' + i;
      if (!namaTampil(kunci)) return;
      if (sudahAda.has(l.nama)) return;
      sudahAda.add(l.nama);
      const c = titikTengah(l.titik);
      const t = taruh({ x: c.x, y: c.y - 2, isi: l.nama.toUpperCase(), kelas: 'peta-lb-laut', font: FONT.laut, paksa: true });
      if (t) lapisAir.appendChild(t); else namaGagal.add(kunci);
    });
    D.danau.forEach((l, i) => {
      const kunci = 'danau:' + i;
      if (!namaTampil(kunci)) return;
      if (sudahAda.has(l.nama)) return;
      sudahAda.add(l.nama);
      const c = titikTengah(l.titik);
      const t = taruh({ x: c.x, y: c.y + 2.6, isi: l.nama, kelas: 'peta-lb-danau', font: FONT.danau, paksa: true });
      if (t) lapisAir.appendChild(t); else namaGagal.add(kunci);
    });
    D.sungai.forEach((r, i) => {
      const kunci = 'sungai:' + i;
      if (!namaTampil(kunci)) return;
      if (sudahAda.has(r.nama)) return;
      sudahAda.add(r.nama);
      const c = titikTengah(r.titik);
      const t = taruh({ x: c.x + 3, y: c.y - 2, isi: namaPeta(r.nama, 'sungai'), kelas: 'peta-lb-sungai', font: FONT.sungai, paksa: true });
      if (t) lapisAir.appendChild(t); else namaGagal.add(kunci);
    });

    // — 3) GURUN —
    D.daerah.forEach((w, i) => {
      if (jenisDaerah(w.nama) !== 'gurun') return;
      const kunci = 'daerah:' + i;
      if (!namaTampil(kunci)) return;
      if (sudahAda.has(w.nama)) return;
      sudahAda.add(w.nama);
      const p = P(w.bujur, w.lintang);
      const t = taruh({ x: p.x, y: p.y, isi: namaPeta(w.nama, 'gurun').toUpperCase(), kelas: 'peta-lb-gurun', font: FONT.gurun, paksa: true });
      if (t) lapisGurun.appendChild(t); else namaGagal.add(kunci);
    });

    // — 4) DAERAH lain —
    D.daerah.forEach((w, i) => {
      if (jenisDaerah(w.nama) === 'gurun') return;
      const kunci = 'daerah:' + i;
      if (!namaTampil(kunci)) return;
      if (sudahAda.has(w.nama)) return;
      sudahAda.add(w.nama);
      const p = P(w.bujur, w.lintang);
      const t = taruh({ x: p.x, y: p.y, isi: w.nama.toUpperCase(), kelas: 'peta-lb-daerah', font: FONT.daerah, paksa: true });
      if (t) lapisNama.appendChild(t); else namaGagal.add(kunci);
    });

    // — 5) GUNUNG —
    /* ✅ Arahan Bapak 28 Sep 2026: *“nama keluar dengan ada icon untuk menandakan
       lokasi gunung yg mana”* ⇒ **ikon gunung DI PETA** yang menandai (berubah
       MERAH saat dipilih), ❌ bukan ikon di depan nama (itu seperti bullet —
       posisinya selalu sama, tidak menandai apa pun). */
    D.gunung.forEach((g, i) => {
      const kunci = 'gunung:' + i;
      if (!namaTampil(kunci)) return;
      if (sudahAda.has(g.nama)) return;
      sudahAda.add(g.nama);
      const p = P(g.bujur, g.lintang);
      const t = taruh({ x: p.x + 6.0, y: p.y - 1.6, isi: g.nama, kelas: 'peta-lb-gunung', font: FONT.gunung, paksa: true });
      if (t) lapisNama.appendChild(t); else namaGagal.add(kunci);
    });

    // — 6) GARIS BATAS wilayah yang DIPILIH (paling atas supaya terlihat) —
    gambarBatas();
  }

  /** Radius “gumpalan” wilayah mengikuti luas perkiraan (data hanya punya TITIK). */
  function radiusDaerah(nm) {
    const n = (nm || '').toLowerCase();
    if (/mesopotamia|babilonia|persia|media|arabia|asir|asyur|mesir|elam|kus|etiopia|italia|makedonia|akhaya|galatia|asia|pontus|bitinia|kapadokia|kilikia|frigia/.test(n)) return 46;
    if (/kanaan|israel|yehuda|gilead|basan|sinai|midian|paran|negev|uz|aram|siria/.test(n)) return 30;
    return 22;
  }

  /**
   * Bentuk wilayah GURUN — **tidak beraturan** (organik), ❌ bukan bulat.
   * ✅ Revisi Bapak 28 Sep 2026: *“yg gurun ada ide ngak icon apa .. dari pada border
   * bulat... kurang cantik”* ⇒ gurun digambar sebagai gumpalan berkelok.
   * ⚠️ Bentuknya **TETAP** untuk nama yang sama (acak **berbenih** dari nama) supaya
   * tidak berubah-ubah tiap peta digambar ulang (kalau berubah, border & isi bisa
   * tidak cocok dan terlihat “bergetar”).
   */
  function bentukGurun(nama, cx, cy, r) {
    let benih = 7;
    for (let i = 0; i < nama.length; i++) benih = (benih * 31 + nama.charCodeAt(i)) % 2147483647;
    const acak = () => { benih = (benih * 1103515245 + 12345) % 2147483648; return benih / 2147483648; };
    const N = 11;                                  // titik keliling
    const titik = [];
    for (let i = 0; i < N; i++) {
      const sudut = (i / N) * Math.PI * 2;
      /* Variasi radius dibuat **lebih besar untuk wilayah kecil** supaya kelokan
         tetap terlihat (kalau radiusnya 22–30 px, variasi 0.70–1.22 hampir bulat). */
      const lebar = r < 34 ? 0.58 : 0.70;
      const rr = r * (lebar + acak() * (1.34 - lebar));   // mis. 0.58–1.34 × radius
      titik.push([cx + Math.cos(sudut) * rr, cy + Math.sin(sudut) * rr * 0.72]);
    }
    // tutup dengan kurva halus (Catmull-Rom → bezier) supaya tidak bersudut
    let d = 'M' + titik[0][0].toFixed(1) + ' ' + titik[0][1].toFixed(1);
    for (let i = 0; i < N; i++) {
      const p0 = titik[(i - 1 + N) % N], p1 = titik[i],
            p2 = titik[(i + 1) % N],     p3 = titik[(i + 2) % N];
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += 'C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' +
                 c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' ' +
                 p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d + 'Z';
  }

  /**
   * Gambar GARIS BATAS wilayah yang sedang DIPILIH pengguna.
   * Revisi Bapak 28 Sep 2026: *“[ Laut Tengah ] < klik > ada garis tipis border wilayah
   * Laut tengah sampai mana ? … kalau bisa dibuat batasan dalam garis tipis jgan tebal”*
   * ⇒ garis TIPIS mengikuti bentuk wilayahnya (❌ bukan tebal).
   * ⚠️ Revisi ke-2 (28 Sep 2026): *“border merah mengikuti nama.. jika nama hide border
   * juga hide begitu sebaliknya.. jadi border tidak muncul terus setelah diklik”*
   * ⇒ border digambar **hanya untuk nama yang TAMPIL** (`namaTampil`) — ❌ bukan
   * semua yang pernah dipilih. Jadi tombol jenis OFF ⇒ nama & border ikut hilang.
   */
  function gambarBatas() {
    if (!lapisBatas) return;
    while (lapisBatas.firstChild) lapisBatas.removeChild(lapisBatas.firstChild);
    if (!namaPilih.size) return;
    // dua lapis: HALO putih (supaya terlihat di atas air biru) + garis MERAH CERAH
    const tambahBatas = (bentuk, kelas) => {
      ['peta-batas-halo', kelas || 'peta-batas-wilayah'].forEach(kls => {
        const el = NS(bentuk.tag);
        Object.keys(bentuk.atribut).forEach(k => el.setAttribute(k, bentuk.atribut[k]));
        el.setAttribute('class', kls);
        lapisBatas.appendChild(el);
      });
    };
    const poligon = (d) => ({ tag: 'path', atribut: { d: d } });
    const elips = (cx, cy, rx, ry) => ({ tag: 'ellipse', atribut: {
      cx: cx.toFixed(1), cy: cy.toFixed(1), rx: rx.toFixed(1), ry: ry.toFixed(1) } });

    /* Gambar border untuk **SEMUA** wilayah yang DIPILIH **dan TAMPIL** —
       supaya klik nama B tidak menghapus border nama A, tetapi border ikut
       hilang kalau nama itu disembunyikan (tombol jenis OFF / dibatalkan). */
    namaPilih.forEach(kunci => {
      if (!namaTampil(kunci)) return;      // nama tidak tampil ⇒ border juga tidak
      const jenis = kunci.split(':')[0];
      const i = Number(kunci.split(':')[1]);
      if (jenis === 'laut' || jenis === 'danau') {
        const l = (jenis === 'laut' ? D.laut : D.danau)[i];
        if (l) tambahBatas(poligon(jalur(l.titik) + ' Z'));
      } else if (jenis === 'sungai') {
        /* Sungai: pada citra tidak ada garis ⇒ beri **garis putus-putus** supaya
           letak sungai yang dipilih tetap terlihat. */
        const r = D.sungai[i];
        if (r) {
          const putus = NS('path');
          putus.setAttribute('d', jalur(r.titik));
          putus.setAttribute('fill', 'none');
          putus.setAttribute('class', 'peta-batas-sungai');
          lapisBatas.appendChild(putus);
        }
      } else if (jenis === 'daerah') {
        const w = D.daerah[i];
        if (w) {
          const p = P(w.bujur, w.lintang);
          const r = radiusDaerah(w.nama);
          if (jenisDaerah(w.nama) === 'gurun') {
            const debu = NS('path');
            debu.setAttribute('d', bentukGurun(w.nama, p.x, p.y, r));
            debu.setAttribute('fill', 'url(#pDebu)');
            debu.setAttribute('pointer-events', 'none');
            lapisBatas.appendChild(debu);
          } else {
            tambahBatas(elips(p.x, p.y, r * 0.82, r * 0.58));
          }
        }
      }
    });
  }

  function titikTengah(titik2) {
    if (!titik2 || !titik2.length) return { x: W / 2, y: H / 2 };
    let sx = 0, sy = 0;
    titik2.forEach(t => { sx += px(t[0]); sy += py(t[1]); });
    return { x: sx / titik2.length, y: sy / titik2.length };
  }

  /* ---------- DAFTAR NAMA — anti nama bertumpuk (konsep Bapak 28 Sep 2026) ----------
     Peta mandiri menampilkan DAFTAR nama lokasi; user klik nama ⇒ lokasi itu muncul
     di peta (titik diperbesar + merah + bernama). Klik lagi ⇒ disembunyikan.
     Jadi kalau ada nama yang saling menimpa, user sendiri yang mengatur nama mana
     yang perlu ditampilkan — tanpa perlu tombol baru tiap kali ada tumpukan. */
  const Uji = {
    didalam(poli, x, y) {
      let c = false;
      for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) {
        const xi = poli[i][0], yi = poli[i][1], xj = poli[j][0], yj = poli[j][1];
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c;
      }
      return c;
    }
  };

  const pDaftar = document.getElementById('peta-daftar');
  const pCari   = document.getElementById('peta-cari');
  const pJumlah = document.getElementById('peta-jumlah');
  const IKON_JENIS = { laut:'🌊', danau:'💧', sungai:'〰️', pulau:'🏝️', gunung:'⛰️', gurun:'🏜️', daerah:'🗺️', kota:'🏙️', tempat:'📍', wilayah:'🗺️' };

  /* ---------- PANEL INFO LOKASI ----------
     Revisi Bapak 28 Sep 2026: *“di klik ada tampil titik2 beberapa tempat tapi apa gunanya ..
     tidak ada info apa2”* ⇒ sekarang setiap nama/titik yang dipilih menampilkan
     keterangan: nama · jenis · keterangan · rujukan ayat. */
  const elInfo = document.getElementById('peta-info');
  const elInfoIkon = document.getElementById('peta-info-ikon');
  const elInfoNama = document.getElementById('peta-info-nama');
  const elInfoJenis = document.getElementById('peta-info-jenis');
  const elInfoKet = document.getElementById('peta-info-ket');
  const elInfoRef = document.getElementById('peta-info-ref');
  const elInfoTutup = document.getElementById('peta-info-tutup');
  const elAyat = document.getElementById('peta-ayat');
  let infoAktif = null;
  let refTerbuka = null;        // kunci rujukan yang sedang terbuka (K68 butir b)

  /* ---------- K68 butir b (4 Okt 2026) — RUJUKAN AYAT ⇒ KOLOM ISI AYAT ----------
     Bapak: *“ada ayat > klik > tampil isi ayat tsb dibawah informasi .. saat klik
     ayat .. dibawah unhide kolom isi ayat tsb.. klik ayat lain ayat ditimpa dengan
     ayat baru.. dan jika klik ayat yg sama hide kolom tsb”*

     ⇒ SATU slot, gantian — pola SAMA seperti `pratinjau()` di plugin 🔗 Ayat Terkait:
       • klik rujukan  ⇒ kolom isi ayat TERBUKA (unhide) di bawah panel informasi
       • klik rujukan lain ⇒ isi lama DITIMPA (❌ bukan menumpuk)
       • klik rujukan yang sama ⇒ kolom TERTUTUP
     Keputusan Bapak: (1a) plugin Alkitab belum dipasang ⇒ rujukan tetap bisa
     diklik + pesan · (2b) penutup = tombol [✕] · (3a) rentang ⇒ SEMUA ayat tampil.

     ⚠️ Teks ayat diambil lewat `ANodesAlkitab.ambilAyatBanyak()` — SATU panggilan
        (❌ jangan `ambilAyat()` berulang; satu entri bisa punya 7 rujukan).
     ⚠️ Plugin Peta ❌ TIDAK boleh tahu plugin lain — cukup periksa
        `window.ANodesAlkitab` (sambungan resmi yang sudah ada). */

  /** Ubah rujukan data peta ("1.11.31" / "1.11.31-35") ⇒ [kitab, pasal, ayat1, ayat2]. */
  function refKeArray(r) {
    const b = String(r).split('.');
    const kitab = Number(b[0]), pasal = Number(b[1]);
    if (!kitab || !pasal) return null;
    const a = String(b[2] || '');
    const pisah = a.split('-');
    const a1 = Number(pisah[0]) || 0;
    const a2 = Number(pisah[1]) || a1;
    return [kitab, pasal, a1, a2];
  }

  /** Label panjang satu rujukan: "Kejadian 11:31" / "Kejadian 11:31-35". */
  function labelRefSatu(r) {
    const b = String(r).split('.');
    const nm = (D.namaKitab || [])[Number(b[0]) - 1] || ('Kitab ' + b[0]);
    return nm + ' ' + b[1] + (b[2] ? ':' + b[2] : '');
  }

  function labelRef(ref) {
    if (!ref || !ref.length) return '';
    return ref.map(labelRefSatu).join(' · ');
  }

  /** Tutup kolom isi ayat (dipakai tombol ✕ & saat pindah lokasi). */
  function tutupAyat() {
    refTerbuka = null;
    if (elAyat) { elAyat.hidden = true; elAyat.innerHTML = ''; }
    if (elInfoRef) elInfoRef.querySelectorAll('.peta-ref-btn.terbuka')
      .forEach(b => b.classList.remove('terbuka'));
  }

  /** Buka kolom isi ayat untuk satu rujukan (SATU slot — yang lama ditimpa). */
  function bukaAyat(r, tombol) {
    if (!elAyat) return;
    const ref = refKeArray(r);
    if (!ref) return;

    elAyat.innerHTML = '';
    const kepala = document.createElement('div');
    kepala.className = 'peta-ayat-kepala';
    const nama = document.createElement('span');
    nama.className = 'peta-ayat-nama';
    nama.textContent = '📖 ' + labelRefSatu(r);
    kepala.appendChild(nama);
    const tutup = document.createElement('button');
    tutup.type = 'button';
    tutup.className = 'peta-ayat-tutup';
    tutup.textContent = '✕';
    tutup.title = 'Tutup isi ayat';
    tutup.addEventListener('click', tutupAyat);
    kepala.appendChild(tutup);
    elAyat.appendChild(kepala);

    const isi = document.createElement('div');
    isi.className = 'peta-ayat-teks';
    elAyat.appendChild(isi);

    /* (1a) plugin 📖 Alkitab belum dipasang ⇒ rujukan tetap bisa diklik,
       tetapi beri pesan yang JELAS (❌ jangan diam-diam gagal — pelajaran K14/7l). */
    const A = window.ANodesAlkitab;
    if (!A || typeof A.ambilAyatBanyak !== 'function') {
      const p = document.createElement('div');
      p.className = 'peta-ayat-pesan';
      p.textContent = '💡 Pasang plugin 📖 Alkitab dahulu untuk membaca isi ayat.';
      isi.appendChild(p);
      elAyat.hidden = false;
      return;
    }

    const data = A.ambilAyatBanyak([ref]);
    if (!data.length) {
      const p = document.createElement('div');
      p.className = 'peta-ayat-pesan';
      p.textContent = '⏳ Data Alkitab belum siap — coba lagi sebentar.';
      isi.appendChild(p);
      elAyat.hidden = false;
      return;
    }

    /* (3a) rentang ⇒ SEMUA ayat ditampilkan (bukan hanya ayat pertama). */
    data[0].ayat.forEach(x => {
      const p = document.createElement('p');
      if (x.merah) p.className = 'merah';
      const no = document.createElement('span');
      no.className = 'peta-ayat-no';
      no.textContent = x.no;
      p.appendChild(no);
      p.appendChild(document.createTextNode(x.teks));
      isi.appendChild(p);
    });

    elAyat.hidden = false;
    if (tombol) {
      elInfoRef.querySelectorAll('.peta-ref-btn.terbuka')
        .forEach(b => b.classList.remove('terbuka'));
      tombol.classList.add('terbuka');
    }
  }

  /** Gambar daftar rujukan sebagai TOMBOL (klik = buka/tutup kolom isi ayat). */
  function gambarRef(ref) {
    if (!elInfoRef) return;
    elInfoRef.innerHTML = '';
    if (!ref || !ref.length) return;
    const lbl = document.createElement('span');
    lbl.className = 'peta-ref-lbl';
    lbl.textContent = '📖';
    elInfoRef.appendChild(lbl);
    ref.forEach(r => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'peta-ref-btn';
      b.textContent = labelRefSatu(r);
      b.title = 'Klik untuk membaca isi ayat ini di bawah';
      b.addEventListener('click', () => {
        /* klik rujukan yang SAMA ⇒ kolom tertutup (keputusan Bapak 2b:
           penutup utama = tombol ✕, tetapi klik ulang juga menutup). */
        if (refTerbuka === r) { tutupAyat(); return; }
        refTerbuka = r;
        bukaAyat(r, b);
      });
      elInfoRef.appendChild(b);
    });
  }

  /** Tampilkan keterangan satu lokasi/wilayah. `b` = {id, nama, jenis}. */
  function tampilInfo(b) {
    if (!b) {
      infoAktif = null;
      elInfoTutup.title = 'tutup keterangan';
      elInfo.hidden = true;
      tutupAyat();                 // K68 b — kolom isi ayat ikut tertutup
      return;
    }
    infoAktif = b;
    let ket = '', ref = null, jenis = b.jenis;
    if (b.id.indexOf('lokasi:') === 0) {
      const l = (D.lokasi || []).find(x => 'lokasi:' + x.id === b.id);
      if (l) { ket = l.ket || ''; ref = l.ref || []; jenis = l.jenis || 'kota'; }
    } else if (b.id.indexOf('daerah:') === 0) {
      const w = (D.daerah || [])[Number(b.id.split(':')[1])];
      if (w) { ket = w.ket || ''; ref = w.ref || []; }
    } else if (b.id.indexOf('gunung:') === 0) {
      const g = (D.gunung || [])[Number(b.id.split(':')[1])];
      if (g) { ket = g.ket || ''; ref = g.ref || []; }
    } else if (b.id.indexOf('sungai:') === 0) {
      const r = (D.sungai || [])[Number(b.id.split(':')[1])];
      if (r) { ket = r.ket || ''; ref = r.ref || []; }
    } else if (b.id.indexOf('laut:') === 0) {
      const l = (D.laut || [])[Number(b.id.split(':')[1])];
      if (l) { ket = l.ket || ''; ref = l.ref || []; }
    } else if (b.id.indexOf('danau:') === 0) {
      const l = (D.danau || [])[Number(b.id.split(':')[1])];
      if (l) { ket = l.ket || ''; ref = l.ref || []; }
    }
    elInfoIkon.textContent = IKON_JENIS[jenis] || '📍';
    elInfoNama.textContent = b.nama;
    /* ✅ Revisi Bapak 28 Sep 2026: *“nama daerah di ganti saja dengan wilayah”*
       ⇒ label jenis `daerah` ditampilkan sebagai **wilayah** (istilah lebih jelas:
       kota = satu tempat · wilayah = satu kawasan). */
    const NAMA_JENIS = { daerah: 'wilayah', kota: 'kota', pulau: 'pulau',
                         gunung: 'gunung', sungai: 'sungai', laut: 'laut',
                         danau: 'danau', gurun: 'gurun' };
    elInfoJenis.textContent = ' · ' + (NAMA_JENIS[jenis] || jenis || 'lokasi');
    elInfoTutup.title = jenis === 'kota' ? 'hapus kota pilihan dari peta' : 'tutup keterangan';
    elInfoKet.textContent = ket;
    /* K68 b — rujukan jadi TOMBOL (klik ⇒ isi ayat terbuka di bawah).
       ⚠️ Pindah lokasi ⇒ kolom isi ayat lama DITUTUP (rujukan berganti). */
    tutupAyat();
    gambarRef(ref);
    elInfo.hidden = false;
  }
  elInfoTutup.onclick = () => {
    const b = infoAktif;
    if (b && b.id.indexOf('lokasi:') === 0) {
      const lokasi = (D.lokasi || []).find(x => 'lokasi:' + x.id === b.id);
      if (lokasi && jenisLokasi(lokasi) === 'kota') {
        namaPilih.delete(b.id);
        namaGagal.delete(b.id);
        if (String(terpilih) === String(lokasi.id)) terpilih = null;
        tampilInfo(null);
        lukisUlang();
        daftarNama();
        return;
      }
    }
    tampilInfo(null);
  };

  function jenisLokasi(l) {
    if (l.jenis === 'gunung') return 'gunung';
    if (l.jenis === 'sungai') return 'sungai';
    const dipulau = (D.darat || []).some(x => Uji.didalam(x.titik, l.bujur, l.lintang));
    return dipulau ? 'pulau' : 'kota';
  }

  /** Daftar nama (urut: air → gurun/daerah → gunung → kota). */
  function daftarNama() {
    const kata = (pCari.value || '').trim().toLowerCase();
    const semua = [];
    (D.laut   || []).forEach((x, i) => semua.push({ id:'laut:'   + i, nama:x.nama, jenis:'laut'   }));
    (D.danau  || []).forEach((x, i) => semua.push({ id:'danau:'  + i, nama:x.nama, jenis:'danau'  }));
    (D.sungai || []).forEach((x, i) => semua.push({ id:'sungai:' + i, nama:x.nama, jenis:'sungai' }));
    (D.daerah || []).forEach((x, i) => semua.push({
      id:'daerah:' + i, nama:x.nama,
      jenis: jenisDaerah(x.nama) === 'gurun' ? 'gurun' : 'daerah'
    }));
    (D.gunung || []).forEach((x, i) => semua.push({ id:'gunung:' + i, nama:x.nama, jenis:'gunung' }));
    (D.lokasi || []).forEach(x => semua.push({ id:'lokasi:' + x.id, nama:x.nama, jenis:jenisLokasi(x) }));

    pDaftar.textContent = '';
    /* ⚠️ K69b (5 Okt 2026) — saat user MENCARI, saringan jenis & mode DILEWATI.
       Sebab nyata: daftar mulai KOSONG (semua jenis mati — keputusan 28 Sep
       “peta mulai bersih”) ⇒ user mengetik “yordan” tetapi daftar tetap kosong
       ⇒ terasa “Yordan tidak ada / belum dilink”, padahal datanya ADA
       (Sungai Yordan · 3 rujukan ayat).
       Aturan tersempit: **hanya jalur PENCARIAN** yang dilewati — tampilan
       daftar biasa tetap mengikuti sakelar jenis seperti semula. */
    if (!kata) {
      if (daftarMode === 'kosong') {
        /* Dulu `pJumlah` dibiarkan KOSONG ⇒ user melihat daftar kosong tanpa
           penjelasan dan mengira datanya tidak ada. Sekarang diberi petunjuk. */
        pJumlah.textContent = '(0/' + semua.length + ') · nyalakan jenis dulu';
        return;
      }
      if (daftarMode === 'pilihan' && !namaPilih.size) {
        pJumlah.textContent = '(0/' + semua.length + ')';
        return;
      }
    }

    const pakai1 = kata ? semua.filter(b => b.nama.toLowerCase().indexOf(kata) >= 0) : semua;
    const pakai = kata ? pakai1 : pakai1.filter(b => {
      if (daftarMode === 'semua') return true;
      if (daftarMode === 'pilihan') return namaPilih.has(b.id);
      if (['kota','tempat','wilayah','pulau'].indexOf(b.jenis) >= 0) return jenisHidup.has('titik');
      if (['laut','danau','sungai'].indexOf(b.jenis) >= 0)          return jenisHidup.has('air');
      if (b.jenis === 'gunung')                                     return jenisHidup.has('relief');
      if (b.jenis === 'gurun')                                      return jenisHidup.has('gurun');
      if (b.jenis === 'daerah')                                     return jenisHidup.has('daerah');
      return false;
    });

    if (!pakai.length) {
      pJumlah.textContent = '(0/' + semua.length + ')' +
                            (daftarMode === 'pilihan' ? ' · dipilih ' + namaPilih.size : '');
      return;
    }

    pakai.forEach(b => {
      /* Cacat 28 Sep 2026 (Bapak): “sungai yordan, efrat, tigris, nil sudah diklik,
         tapi di peta tidak ada nama yordan dsb” ⇒ sebabnya 4 sungai tercatat **DUA
         KALI** di data: (1) di `D.sungai` = garis sungainya, (2) di `D.lokasi` =
         titik/lokasi (jenis “sungai”). Daftar jadi punya **2 chip kembar** ⇒ klik
         chip pertama menyalakan, klik chip kedua mematikan lagi (nama “hilang”),
         dan status chip terlihat berbalik-balik.
         ⇒ Pakai **SATU wadah** saja: kalau nama yang sama sudah ada di wadah lain
         (laut/danau/sungai/daerah/gunung), entri `D.lokasi` itu **dilewati**.
         ⚠️ Diukur dulu (aturan tersempit): dari **196 nama**, hanya **5 kembar** —
         4 sungai (Efrat · Tigris · Yordan · Nil) + **Tanah Gosen** (daerah ⇄ lokasi)
         ⇒ 5 chip kembar hilang, ❌ tidak ada nama sah yang ikut hilang. */
      const kembar = b.id.indexOf('lokasi:') === 0 &&
                     ['laut','danau','sungai','daerah','gunung']
                       .some(k => (D[k] || []).some(x => x.nama === b.nama));
      if (kembar) return;
      /* Chip = **PILIH nama** (28 Sep 2026): nyala kalau nama itu TAMPIL di peta.
         Klik = tampilkan di peta ⇄ sembunyikan. */
      const aktif = namaTampil(b.id);
      const tom = document.createElement('button');
      tom.type = 'button';
      tom.className = 'peta-nchip' + (aktif ? ' terpilih' : '');
      tom.textContent = (IKON_JENIS[b.jenis] || '•') + ' ' + b.nama;
      let jd = aktif ? 'sembunyikan nama ini dari peta' : 'tampilkan nama ini di peta';
      if (aktif && namaGagal.has(b.id)) {
        tom.className = 'peta-nchip terpilih sesak';
        jd = 'tempat belum cukup — sembunyikan nama lain yang berdekatan supaya ini bisa muncul';
      }
      tom.title = jd;
      tom.onclick = () => {
        if (daftarMode === 'pilihan' && namaPilih.has(b.id)) {
          tampilInfo(b);
          return;
        }
        /* Klik nama = **PILIH** ⇒ nama muncul di peta (titik + nama + border).
           Klik lagi = batal pilih ⇒ hilang dari peta.
           ⚠️ Konsep Bapak 28 Sep 2026: peta mulai BERSIH; nama muncul HANYA
           karena dipilih user dari daftar. */
        if (namaPilih.has(b.id)) namaPilih.delete(b.id);
        else namaPilih.add(b.id);
        lukisUlang();
        tampilInfo(b);
        daftarNama();
      };
      pDaftar.appendChild(tom);
    });
    pJumlah.textContent = '(' + pakai.length + '/' + semua.length + ') · dipilih ' + namaPilih.size;
  }

  document.getElementById('peta-cari').addEventListener('input', daftarNama);

  /* ---------- SATU BARIS TOMBOL (revisi Bapak 28 Sep 2026 butir 1) ----------
     “menu paling atas di satukan menu yg dibawah supaya tidak ada menu atas dan bawah”

     Tombol JENIS (`📋 semua` · `🏙️ titik` · `💧 air` · `⛰️ relief` · `🏜️ gurun` · `🗺️ daerah`)
     = **SAKELAR (toggle)** — arahan Bapak 28 Sep 2026:
       *“klik [titik] selama belum klik [titik] lagi tidak off walau klik [air]
        jadi ada 2 tombol yg [on] dan seterusnya”*
     ⇒ tiap tombol **berdiri sendiri**: klik = nyala, klik lagi = mati.
       Tombol lain **❌ tidak disentuh** ⇒ bisa **beberapa tombol nyala bersamaan**.
    Tombol kategori mengatur **LAPIS PETA** dan menampilkan nama jenis yang aktif.
    Beberapa kategori aktif ⇒ daftar berisi gabungan jenis tersebut.
     `📋 pilihan` = **SAKELAR ON/OFF** (keputusan Bapak 29 Sep 2026 — pilihan A):
       ON  = nyalakan semua jenis + tampilkan **pilihan user** (belum ada pilihan ⇒ peta tanpa nama)
       OFF = **kosongkan** (semua jenis mati + peta bersih).
     Tombol `🌿 subur` tetap **sakelar** (hanya warna area — tidak ada jenis “subur” di daftar). */
  const JENIS = ['titik', 'air', 'relief', 'gurun', 'daerah'];
  /* Keadaan awal = **KOSONG** (semua jenis MATI) — sesuai keputusan #12
     (“peta benar-benar mulai bersih”) dan arahan Bapak 28 Sep 2026:
     *“masalah air beda sudah benar **harus di klik baru tampil**”*.
     ⇒ klik tombol = **MENYALAKAN** (nama jenis itu muncul) · klik lagi = mematikan.
     ⚠️ Kalau semua nyala di awal, klik pertama malah MEMATIKAN ⇒ terasa “terbalik”
     (cacat Bapak: “tombol nama gunung diklik malah tidak tampil, terbalik”).
     ⚠️ Bentuk geografi (laut · darat · gurun) TETAP tampil — yang kosong hanya
     **label & titik**, jadi peta tidak kosong total. */
  const jenisHidup = new Set();
  const elBar = document.getElementById('peta-bar');
  const tomJenis = Array.from(elBar.querySelectorAll('button[data-jenis]'));

  /** Terapkan jenis yang NYALA ke LAPIS PETA (air · gurun · relief · titik). */
  function terapkanLapis() {
    airHidup    = jenisHidup.has('air');
    gurunHidup  = jenisHidup.has('gurun');
    reliefHidup = jenisHidup.has('relief');
    lapisTitik  = jenisHidup.has('titik');
  }

  /** Warnai tombol sesuai keadaan: tombol `📋 pilihan` nyala kalau SEMUA jenis nyala. */
  function segarkanTombol() {
    tomJenis.forEach(t => {
      const j = t.getAttribute('data-jenis');
      const nyala = (j === 'semua') ? JENIS.every(x => jenisHidup.has(x)) : jenisHidup.has(j);
      t.classList.toggle('aktif', nyala);
    });
  }

  tomJenis.forEach(tom => {
    tom.onclick = () => {
      const j = tom.getAttribute('data-jenis') || 'semua';
      if (j === 'semua') {
        /* 📋 pilihan = SAKELAR ON/OFF (keputusan Bapak 29 Sep 2026 — pilihan A):
             ON  ⇒ nyalakan SEMUA jenis + tampilkan **apa yang jadi pilihan user**
                   (kalau user belum memilih apa pun ⇒ peta TANPA NAMA)
             OFF ⇒ KOSONGKAN (semua jenis mati + peta bersih)
           ⚠️ ❌ TIDAK memaksa menampilkan seluruh isi daftar — hanya pilihan user. */
        const semuaNyala = JENIS.every(x => jenisHidup.has(x));
        if (semuaNyala) {
          jenisHidup.clear();                         // OFF ⇒ kosongkan
          daftarMode = 'kosong';
        } else {
          JENIS.forEach(x => jenisHidup.add(x));      // ON ⇒ nyalakan semua jenis
          daftarMode = 'pilihan';
        }
      } else if (jenisHidup.has(j)) {
        jenisHidup.delete(j);                       // klik tombol yang nyala ⇒ MATI
        daftarMode = jenisHidup.size ? 'kategori' : 'kosong';
      } else {
        jenisHidup.add(j);                          // klik tombol yang mati ⇒ NYALA
        daftarMode = 'kategori';
      }
      segarkanTombol();
      terapkanLapis();
      lukisUlang();
      daftarNama();
    };
  });

  document.getElementById('peta-tampil').onclick = () => {
    /* 🏷️ semua = **pilih SEMUA nama** ⇒ semuanya tampil di peta.
       ⚠️ Hanya nama yang jenisnya NYALA yang benar-benar tampil (`namaTampil`).
       ℹ️ Beda dengan `📋 pilihan`: tombol ini MEMANG memilih seluruh isi daftar. */
    daftarMode = 'semua';
    (D.lokasi || []).forEach(x => namaPilih.add('lokasi:' + x.id));
    (D.laut   || []).forEach((x, i) => namaPilih.add('laut:'   + i));
    (D.danau  || []).forEach((x, i) => namaPilih.add('danau:'  + i));
    (D.sungai || []).forEach((x, i) => namaPilih.add('sungai:' + i));
    (D.daerah || []).forEach((x, i) => namaPilih.add('daerah:' + i));
    (D.gunung || []).forEach((x, i) => namaPilih.add('gunung:' + i));
    lukisUlang(); daftarNama();
  };

  document.getElementById('peta-sembunyi').onclick = () => {
    /* 🧹 = **batalkan semua pilihan** ⇒ peta kembali BERSIH. */
    namaPilih.clear();
    elInfo.hidden = true;
    lukisUlang(); daftarNama();
  };

  /* ---------- tombol ---------- */
  const btnSubur  = document.getElementById('peta-btn-subur');

  /* 🔴 K72 (5 Okt 2026) — tombol 🌍 bumi DIHAPUS (Bapak: *“jadi tidak perlu ada
     tombol [bumi] langsung tampil map baru saja”*). Dasar peta sekarang SELALU
     citra relief NASA ⇒ ❌ tidak ada lagi sakelar. */

  function lukisUlang() {
    lukis();
    terapkan();
  }

  // tombol ▸/▾ di catatan kaki — keterangan LAB hanya 1 baris (hemat tempat)
  (function () {
    const cat = document.getElementById('peta-catatan');
    const tom = document.getElementById('peta-catatan-x');
    if (!cat || !tom) return;
    tom.onclick = () => {
      const buka = cat.classList.toggle('buka');
      tom.textContent = buka ? '▾' : '▸';
      tom.title = buka ? 'ringkas keterangan' : 'buka keterangan';
    };
  })();

  btnSubur.addEventListener('click', () => {
    suburHidup = !suburHidup; btnSubur.classList.toggle('aktif', suburHidup); lukisUlang();
  });

  // klik titik ⇒ perbesar + tampilkan namanya + keterangannya
  svg.addEventListener('click', (e) => {
    const id = e.target && e.target.getAttribute && e.target.getAttribute('data-id');
    if (!id) return;
    terpilih = (terpilih === id) ? null : id;
    // klik titik di peta ⇒ nama titik itu ikut DIPILIH (tetap tampil)
    if (terpilih) namaPilih.add('lokasi:' + terpilih);
    lukisUlang();
    if (terpilih) {
      const l = (D.lokasi || []).find(x => x.id === id);
      tampilInfo(l ? { id: 'lokasi:' + l.id, nama: l.nama, jenis: l.jenis } : null);
    } else {
      elInfo.hidden = true;
    }
  });

  /* ---------- zoom & geser ---------- */
  let pandangan = { s: 1, x: 0, y: 0 };
  function terapkan() {
    const s = pandangan.s, x = pandangan.x, y = pandangan.y;
    svg.setAttribute('viewBox',
      x.toFixed(1) + ' ' + y.toFixed(1) + ' ' + (W / s).toFixed(1) + ' ' + (H / s).toFixed(1));
  }
  function zoom(f) {
    const sBaru = Math.min(6, Math.max(1, pandangan.s * f));
    const cx = pandangan.x + (W / pandangan.s) / 2;
    const cy = pandangan.y + (H / pandangan.s) / 2;
    pandangan.s = sBaru;
    pandangan.x = cx - (W / sBaru) / 2;
    pandangan.y = cy - (H / sBaru) / 2;
    klem(); terapkan();
  }
  function klem() {
    const wv = W / pandangan.s, hv = H / pandangan.s;
    pandangan.x = Math.max(-W * 0.5, Math.min(W - wv + W * 0.5, pandangan.x));
    pandangan.y = Math.max(-H * 0.5, Math.min(H - hv + H * 0.5, pandangan.y));
  }
  function reset() { pandangan = { s: 1, x: 0, y: 0 }; terapkan(); }

  document.getElementById('peta-zoom-in').onclick  = () => zoom(1.35);
  document.getElementById('peta-zoom-out').onclick = () => zoom(1 / 1.35);
  document.getElementById('peta-reset').onclick   = reset;

  /* ⚠️ Bila jendela diubah ukurannya, tinggi peta harus dihitung ulang
     (HitungTinggiPeta bergantung pada lebar & tinggi layar). */
  let tundaUbah = null;
  window.addEventListener('resize', () => {
    clearTimeout(tundaUbah);
    tundaUbah = setTimeout(() => { pandangan = { s: 1, x: 0, y: 0 }; lukisUlang(); }, 200);
  });

  // geser (mouse & sentuh)
  let seret = null;
  const panggung = document.getElementById('peta-panggung');
  const mulai = (x, y) => { seret = { x, y, px: pandangan.x, py: pandangan.y }; svg.classList.add('peta-menyeret'); };
  const jalan = (x, y) => {
    if (!seret) return;
    const wv = W / pandangan.s, hv = H / pandangan.s;
    const r = panggung.getBoundingClientRect();
    pandangan.x = seret.px - (x - seret.x) / r.width * wv;
    pandangan.y = seret.py - (y - seret.y) / r.height * hv;
    klem(); terapkan();
  };
  const lepas = () => { seret = null; svg.classList.remove('peta-menyeret'); };

  panggung.addEventListener('mousedown', e => mulai(e.clientX, e.clientY));
  window.addEventListener('mousemove', e => jalan(e.clientX, e.clientY));
  window.addEventListener('mouseup', lepas);
  panggung.addEventListener('touchstart', e => { const t = e.touches[0]; mulai(t.clientX, t.clientY); }, { passive: true });
  panggung.addEventListener('touchmove', e => { const t = e.touches[0]; jalan(t.clientX, t.clientY); }, { passive: true });
  panggung.addEventListener('touchend', lepas);

  /* ---------- mulai ---------- */
  segarkanTombol();
  terapkanLapis();
  pasangB();                    // batas peta = jendela citra bumi
  lukis();
  terapkan();
  daftarNama();

  /* ------------------------------------------------------------
     API MESIN — dipakai `plugin/peta/plugin.js` & `tampilan.js`
     ------------------------------------------------------------ */
  return {
    versi: () => VERSI,
    /* K69f — bukti ukuran mengikuti pengaturan (dipakai alat uji) */
    skala: () => skala(),
    fontPeta: (n) => fontPeta(n),
    data: () => D,
    /** gambar ulang seluruh peta (dipakai saat halaman dibuka / ukuran berubah) */
    segarkan: () => { pasangB(); lukis(); terapkan(); daftarNama(); },
    /* K68 butir b — kolom isi ayat (dipakai uji & tampilan) */
    tutupAyat,
    bukaAyat: (r) => bukaAyat(r, null),
    refTerbuka: () => refTerbuka,
    tampilInfo,
    /** jumlah isi katalog — untuk halaman keterangan plugin */
    angka: () => ({
      lokasi: (D.lokasi || []).length,
      daerah: (D.daerah || []).length,
      gunung: (D.gunung || []).length,
      laut:   (D.laut   || []).length,
      sungai: (D.sungai || []).length,
      danau:  (D.danau  || []).length,
      darat:  (D.darat  || []).length,
      rute:   (D.rute   || []).length
    }),
    /** apakah citra bumi nyata tersedia (dipakai uji & keterangan) */
    adaCitra: () => !!(BU && BU.datar),
    /* 🔴 K72 — `setCitra` & `citraHidup` DIHAPUS: dasar peta selalu citra NASA
       (❌ tidak ada lagi sakelar 🌍). */
    citraHidup: () => true
  };
})();

window.ANodesPetaTampilan = window.ANodesPeta;
