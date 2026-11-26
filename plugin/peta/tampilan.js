/* ============================================================
   ANodes — plugin/peta/tampilan.js
   TAMPILAN PLUGIN: 🗺️ PETA ALKITAB  (K68 — 4 Okt 2026)

   ------------------------------------------------------------
   Bapak 4 Okt 2026: *“peta-lab sekarang di jadikan plugin pada
   ANodes-1berkas dengan nama peta..”*

   Tugas berkas ini HANYA membuka/menutup **halaman peta**
   (`#peta-halaman`, halaman ke-7) — pola SAMA seperti
   `plugin/sejarah/tampilan.js` (K55c):

     • halaman = anak `body` (kalau di dalam `#app-utama`, ikut tersembunyi)
     • halaman menyembunyikan DIRINYA SENDIRI saat pindah
     • ❌ tidak menyentuh catatan pengguna sama sekali
     • dilepas plugin ⇒ halaman ditutup

   Mesin gambar peta ada di `plugin/peta/peta.js` (`window.ANodesPeta`).
   ============================================================ */

window.ANodesPetaTampilan = (function () {
  'use strict';

  const VERSI = 'v5Okt-h';   // K72 (5 Okt 2026) — peta lama SVG dihapus · dasar peta selalu citra NASA

  const elHal = () => document.getElementById('peta-halaman');
  const mesin = () => window.ANodesPeta;

  let halamanAktif = false;
  let pengaitSiap = false;

  function pesan(t) {
    const g = window.ANodesPlugin;
    if (g && typeof g.pesan === 'function') { g.pesan(t); return; }
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = t;
    toast.classList.add('tampil');
    clearTimeout(toast._tPeta);
    toast._tPeta = setTimeout(() => toast.classList.remove('tampil'), 2200);
  }

  /* sembunyikan semua halaman lain (pola SAMA halaman sejarah/kamus) */
  function sembunyikanLain() {
    document.querySelectorAll('body > .app').forEach(a => {
      if (a !== elHal()) a.hidden = true;
    });
  }

  function bukaHalaman() {
    const hal = elHal();
    if (!hal) { pesan('⚠️ Halaman peta belum ada di index.html'); return false; }
    sembunyikanLain();
    hal.hidden = false;
    hal.scrollTop = 0;
    halamanAktif = true;
    /* ⚠️ Peta WAJIB digambar ulang sesudah halaman tampil — kalau digambar
       saat halaman masih `hidden`, lebar kotaknya 0 ⇒ tinggi peta salah
       (pelajaran sama seperti halaman sejarah & kamus). */
    const m = mesin();
    if (m && typeof m.segarkan === 'function') {
      try { m.segarkan(); } catch (e) { console.warn('ANodes: gambar peta gagal', e); }
    }
    /* 🔴 K71 (5 Okt 2026) — kunci tinggi baris peta supaya panggung bisa
       “menempel” (sticky) saat daftar lokasi digulir. Dipanggil dua kali:
       segera (tinggi sudah ada) + tertunda (kalau citra bumi selesai dimuat
       dan tinggi panggung berubah). */
    kunciTinggiPeta();
    setTimeout(kunciTinggiPeta, 350);
    return true;
  }

  /* ============================================================
     🔴 K71 (5 Okt 2026) — ⬆ PETA BEKU (tetap terlihat saat digulir)
     ------------------------------------------------------------
     Bapak: *“peta di freeze .. kalau titik air dan lain2 sampai banyak ..
     di scroll kebawah peta harusnya tetap terlihat”*

     SEBAB (diukur): `.peta-lab` = satu-satunya wadah gulir, dan panggung
     peta ikut tergulir ⇒ begitu daftar lokasi panjang, peta hilang ke atas.

     PELAKSANAAN (❌ tanpa menambah wadah gulir — petunjuk LAB):
       • `.peta-atas` → `display: contents` ⇒ isinya naik ke `.peta-lab`
       • kepala `sticky top:0` · panggung `sticky top:<tinggi kepala>`
       • baris `.peta-kunci` (pembungkus `.peta-atas`) tingginya DIKUNCI
         = kepala + panggung ⇒ panggung punya ruang untuk menempel
     ============================================================ */
  function kunciTinggiPeta() {
    const lab = document.querySelector('.peta-lab');
    if (!lab) return;
    const atas = lab.querySelector('.peta-atas');
    if (!atas) return;
    const kepala = lab.querySelector('.peta-kepala');
    const panggung = document.getElementById('peta-panggung');
    if (!kepala || !panggung) return;
    const hk = Math.round(kepala.getBoundingClientRect().height);
    const hp = Math.round(panggung.getBoundingClientRect().height);
    if (hk > 0) kepala.style.top = '0px';
    if (hp > 0) panggung.style.top = hk + 'px';
    if (hk + hp > 0) atas.style.height = (hk + hp) + 'px';
  }

  /* saat jendela berubah ukuran / peta digambar ulang ⇒ tinggi kunci disegarkan */
  let kunciSiap = false;
  function pasangKunciPeta() {
    if (kunciSiap) return;
    kunciSiap = true;
    window.addEventListener('resize', () => { if (halamanAktif) kunciTinggiPeta(); });
    document.addEventListener('anodes-setting-berubah', () => { if (halamanAktif) kunciTinggiPeta(); });
  }

  function tutupHalaman() {
    const hal = elHal();
    if (hal) hal.hidden = true;
    halamanAktif = false;
    const utama = document.getElementById('app-utama');
    if (utama) utama.hidden = false;
  }

  /** pintu plugin (🧩 ▼ / gudang plugin) */
  function buka() { return bukaHalaman(); }

  /* ------------------------------------------------------------
     PENGAIT tombol halaman (🏠 kembali · 🌍 bumi · zoom · daftar)
       ⚠️ Tombol-tombol DI DALAM halaman sudah dipasangi pengait oleh
       `peta.js` (dulu bagian dari LAB). Di sini hanya tombol yang
       BARU: 🏠 kembali.
     ------------------------------------------------------------ */
  function pasangPengait() {
    if (pengaitSiap) return;
    const kembali = document.getElementById('peta-kembali');
    if (kembali) {
      kembali.addEventListener('click', tutupHalaman);
    }
    pengaitSiap = true;
  }

    /* ============================================================
       🔴 K69f (5 Okt 2026) — UKURAN NAMA IKUT PENGATURAN HURUF
       Bapak: *“nama2 titik sangat kecil dibuat ukuran font sesuai
       pengaturan / setting”*
       ⇒ saat ukuran huruf diganti (⚙), nama di peta **digambar ulang**
         supaya ukurannya langsung menyesuaikan — ❌ tanpa perlu keluar
         dari halaman Peta / membuka ulang ayat.
       ============================================================ */
    let ubahHurufSiap = false;
    function pasangUbahHuruf() {
      if (ubahHurufSiap) return;
      ubahHurufSiap = true;
      document.addEventListener('anodes-setting-berubah', function () {
        /* 1) nama di halaman Peta */
        if (halamanAktif) {
          const m = mesin();
          if (m && typeof m.segarkan === 'function') {
            try { m.segarkan(); } catch (e) {}
          }
        }
        /* 2) nama di kolom mini-peta (halaman baca) — gambar ulang kolom yang terbuka */
        if (kotakAktif && lokasiAktif) {
          const w = kotakAktif, k = lokasiAktif, no = Number(w.dataset.ayat);
          const pos = window.ANodesAlkitabTampilan && window.ANodesAlkitabTampilan.posisi;
          if (pos) {
            kotakAktif = null;
            try {
              tampilKotakLokasi(w, mesinAyat().daftarLokasi(pos.kitab, pos.pasal, no), k);
            } catch (e) { console.warn('ANodes: gambar ulang mini-peta gagal', e); }
            kotakAktif = w;
          }
        }
      });
    }

  /* ============================================================
     K69 b–d (5 Okt 2026) — 📍 KATA LOKASI DI HALAMAN BACA ALKITAB
     ------------------------------------------------------------
     Bapak: *“dari alkitab user pilih kitab...dan ayat didalam pasal
     mengandung kata tempat .. ditampil dibawah ayat tsb.. kata lokasinya ..
     jika di klik kata lokasi akan tampil dibawah ayat · konsepnya sama
     seperti penguat · kalau dalam 1 ayat terdapat lebih dari 1 kata lokasi
     ditampilkan bergantian pada kolom yg sama”*

     ⇒ Pola SAMA dengan 🖊 Penguat (K54): tombol kecil per ayat, dipasang
       lewat **sambungan resmi** `tambahPenghias()` milik plugin Alkitab
       ⇒ plugin Alkitab ❌ tidak perlu tahu plugin Peta ada.
     ⇒ BEDA dari penguat: tekan 📍 ⇒ yang terbuka **hanya ayat itu**
       (penguat membuka SELURUH pasal). Sebab isi kolom ini = PETA, dan
       membuka 3.745 peta sekaligus akan mematikan perangkat.
     ============================================================ */
  let kotakAktif = null;        // wadah `.pl-sisip` yang sedang terbuka
  let lokasiAktif = null;       // kunci lokasi yang sedang ditampilkan
  let berkedip = true;          // titik lokasi berkedip (bisa dimatikan dari halaman keterangan)
  let penghiasSiap = false;
  let sedangHias = false;

  const KUNCI_BERKEDIP = 'anodes-peta-kedip';

  function pluginAktif() {
    return !!(window.ANodesPlugin && window.ANodesPlugin.dipasang
              && window.ANodesPlugin.dipasang('peta'));
  }

  function mesinAyat() { return window.ANodesPetaAyat; }

  /* baca preferensi berkedip (bawaan: nyala) */
  try {
    if (localStorage.getItem(KUNCI_BERKEDIP) === 'mati') berkedip = false;
  } catch (e) {}

  /* kosongkan SELURUH hiasan lokasi dari halaman baca (tombol + kolom) */
  function bersihkanBaca(isi) {
    if (!isi) return;
    isi.querySelectorAll('.pl-sisip').forEach(x => x.remove());
    isi.querySelectorAll('.ayat-baca[data-pl-hias]').forEach(b => delete b.dataset.plHias);
    kotakAktif = null;
    lokasiAktif = null;
  }

  /* tutup kolom yang sedang terbuka — wadah tombolnya DIBIARKAN
     ⚠️ Kalau wadah tombol ikut dibuang, tombol yang sedang diklik lenyap dan
        kolom tidak pernah bisa dibuat (cacat nyata yang sama seperti K54). */
  function tutupKotakLokasi() {
    if (kotakAktif) {
      kotakAktif.querySelectorAll('.pl-kotak').forEach(x => x.remove());
      kotakAktif.classList.remove('terbuka');
      const b = kotakAktif.querySelector('.pl-toggle');
      if (b) b.classList.remove('aktif');
    }
    kotakAktif = null;
    lokasiAktif = null;
  }

  /* satu wadah + satu tombol 📍 untuk satu baris ayat */
  function wadahLokasi(no, jumlah) {
    const wadah = document.createElement('span');
    wadah.className = 'pl-sisip';
    wadah.dataset.ayat = String(no);
    wadah.dataset.plJumlah = String(jumlah);

    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pl-toggle';
    /* 🎛 I-15 GAYA C — ikon saja (arti di `title`), supaya sejajar dengan
       tombol 🖊 penguat & 🔗 ayat terkait dan tidak menambah tinggi baris. */
    b.textContent = '📍';
    b.title = jumlah > 1
      ? '📍 ' + jumlah + ' nama tempat di ayat ini — klik untuk melihat peta'
      : '📍 nama tempat di ayat ini — klik untuk melihat peta';
    b.setAttribute('aria-label', 'tempat / lokasi di ayat ' + no);
    b.addEventListener('click', () => saatTombolLokasi(wadah, no));
    wadah.appendChild(b);
    return wadah;
  }

  /** Tombol 📍 ditekan — buka/tutup kolom mini-peta untuk ayat itu */
  function saatTombolLokasi(wadah, no) {
    const pos = window.ANodesAlkitabTampilan && window.ANodesAlkitabTampilan.posisi;
    if (!pos) return;
    /* tombol pada wadah yang SEDANG terbuka ⇒ tutup (pola K68 b: klik sama = hide) */
    if (wadah === kotakAktif) { tutupKotakLokasi(); return; }
    tutupKotakLokasi();
    const daftar = (mesinAyat() && mesinAyat().daftarLokasi(pos.kitab, pos.pasal, no)) || [];
    if (!daftar.length) return;
    wadah.classList.add('terbuka');
    const tb = wadah.querySelector('.pl-toggle');
    if (tb) tb.classList.add('aktif');
    kotakAktif = wadah;
    tampilKotakLokasi(wadah, daftar, daftar[0]);
  }

  /**
   * Gambar kolom lokasi. >1 lokasi ⇒ **chip bergantian di kolom YANG SAMA**
   * (keputusan Bapak) — ❌ bukan menumpuk kolom baru.
   */
  function tampilKotakLokasi(wadah, daftar, kunci) {
    const m = mesinAyat();
    if (!m || !wadah) return;
    const x = m.info(kunci);
    if (!x) return;
    lokasiAktif = kunci;

    let kotak = wadah.querySelector('.pl-kotak');
    if (!kotak) {
      kotak = document.createElement('div');
      kotak.className = 'pl-kotak';
      wadah.appendChild(kotak);
    }
    kotak.textContent = '';

    /* kepala: ikon + nama + jenis */
    const kepala = document.createElement('div');
    kepala.className = 'pl-kepala';
    const nm = document.createElement('span');
    nm.className = 'pl-nama';
    nm.textContent = '📍 ' + x.nama;
    kepala.appendChild(nm);
    const jn = document.createElement('span');
    jn.className = 'pl-jenis';
    jn.textContent = ' · ' + m.labelJenis(x.jenis);
    kepala.appendChild(jn);

    /* pemilih lokasi (hanya kalau ayat ini punya >1 nama tempat) */
    if (daftar.length > 1) {
      const pilih = document.createElement('span');
      pilih.className = 'pl-pilih';
      daftar.forEach(k => {
        const xx = m.info(k);
        if (!xx) return;
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'pl-chip' + (k === kunci ? ' aktif' : '');
        c.textContent = xx.nama;
        c.title = 'Tampilkan ' + xx.nama + ' di peta';
        c.addEventListener('click', () => tampilKotakLokasi(wadah, daftar, k));
        pilih.appendChild(c);
      });
      kepala.appendChild(pilih);
    }
    kotak.appendChild(kepala);

    /* mini-peta — citra relief NASA, tanpa zoom/seret, titik berkedip */
    const panggung = document.createElement('div');
    panggung.className = 'pl-panggung';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'pl-svg');
    panggung.appendChild(svg);
    kotak.appendChild(panggung);
    /* 🔴 K69c — `lebar:480, tinggi:240` = rasio **2:1**, SAMA dengan jendela citra
       NASA (42°×21°) dan SAMA dengan halaman Peta ⇒ geografi ❌ tidak tertarik. */
    const tergambar = m.gambarMini(svg, [kunci], { lebar: 480, tinggi: 240, kedip: berkedip });
    if (!tergambar) {
      panggung.remove();
      const gagal = document.createElement('div');
      gagal.className = 'pl-kosong';
      gagal.textContent = 'Peta belum bisa digambar (data citra belum ada).';
      kotak.appendChild(gagal);
    }

    /* keterangan */
        if (x.ket) {
          const ket = document.createElement('div');
          ket.className = 'pl-ket';
          ket.textContent = x.ket;
          kotak.appendChild(ket);
        }
      }

  /* dipanggil plugin Alkitab tiap selesai menggambar satu pasal */
  function hiasAyatBaca(ctx) {
    if (!ctx || !ctx.isi) return;
    if (!pluginAktif()) return;                 // plugin belum dipasang → tanpa tombol
      if (sedangHias) return;

      const m = mesinAyat();
      const siap = !!(m && typeof m.siap === 'function' && m.siap());

      /* ⚠️ PENTING — penjaga “sudah dihiasi” HANYA boleh dipasang kalau indeks
         BENAR-BENAR siap. Kalau dipasang saat indeks belum ada, pasal itu
         terkunci tanpa tombol selamanya (cacat nyata yang sama seperti K54). */
      const kunci = ctx.kitab + '.' + ctx.pasal;
      const barisPertama = ctx.isi.querySelector('.ayat-baca[data-ayat]');
      if (siap && barisPertama && barisPertama.dataset.plHias === kunci) return;

      if (!siap) {
        /* data belum siap ⇒ bersihkan tanda lama, minta hias ULANG saat siap */
        ctx.isi.querySelectorAll('.ayat-baca[data-pl-hias]').forEach(b => delete b.dataset.plHias);
        mintaSaatSiap(ctx);
        return;
      }

      sedangHias = true;
      try {
        bersihkanBaca(ctx.isi);
        ctx.isi.querySelectorAll('.ayat-baca[data-ayat]').forEach(baris => {
          const no = Number(baris.dataset.ayat);
          baris.dataset.plHias = kunci;
          const daftar = m.daftarLokasi(ctx.kitab, ctx.pasal, no);
          if (!daftar.length) return;             // ayat tanpa nama tempat → tanpa tombol
          baris.appendChild(wadahLokasi(no, daftar.length));
        });
      } finally {
        sedangHias = false;
      }
    }

    /* Hias ulang SEKALI begitu indeks siap — pasal yang sedang tampil saja */
    let mintaTertunda = false;
    function mintaSaatSiap(ctx) {
      if (mintaTertunda) return;
      mintaTertunda = true;
      const m = mesinAyat();
      if (!m || typeof m.saatSiap !== 'function') { mintaTertunda = false; return; }
      m.saatSiap(() => {
        mintaTertunda = false;
        const t = window.ANodesAlkitabTampilan;
        const hal = document.getElementById('baca-alkitab');
        const isi = document.getElementById('baca-isi');
        if (!t || !hal || hal.hidden || !isi) return;
        const pos = t.posisi ||
          { kitab: Number(ctx.kitab), pasal: Number(ctx.pasal) };
        try { hiasAyatBaca({ kitab: pos.kitab, pasal: pos.pasal, isi }); } catch (e) {}
      });
    }

    function daftarPenghiasBaca() {
      const t = window.ANodesAlkitabTampilan;
      if (t && typeof t.tambahPenghias === 'function') {
        t.tambahPenghias(hiasAyatBaca);
        penghiasSiap = true;
        return true;
      }
      return false;
    }

  /* ------------------------------------------------------------
     BERSIHKAN — saat plugin dilepas
       ❌ Tidak menyentuh catatan; hanya menutup halaman & membuang hiasan.
     ------------------------------------------------------------ */
  function bersihkan() {
    const hal = elHal();
    if (hal) hal.hidden = true;
    halamanAktif = false;
    const utama = document.getElementById('app-utama');
    if (utama) utama.hidden = false;
    /* K69 b–e — buang tombol 📍 & kolom mini-peta dari halaman baca */
    bersihkanBaca(document.getElementById('baca-isi'));
  }

  /* ------------------------------------------------------------
     SIAPKAN OTOMATIS — dipanggil saat HALAMAN DIBUKA
       ⚠️ PELAJARAN NYATA (K45 i · K47e · K55): tanpa ini, kalau plugin
       sudah terpasang lalu halaman dimuat ulang, `saatDipasang` TIDAK
       jalan lagi ⇒ pengait tombol tidak terpasang.
     ------------------------------------------------------------ */
  function siapkanOtomatis() {
    const g = window.ANodesPlugin;
    if (!g || typeof g.dipasang !== 'function') return;
    if (!g.dipasang('peta')) return;      // plugin belum dipasang → tidak ada yang dipasang
    pasangPengait();
        pasangUbahHuruf();
        pasangKunciPeta();          /* K71 — ⬆ peta beku */

            /* K69 b–d — daftarkan penghias halaman baca + bangun indeks ayat→lokasi.
           ⚠️ `tambahPenghias` WAJIB didaftarkan ULANG (dulu pernah lupa ⇒ setelah
              pasang → lepas → pasang lagi tombolnya TIDAK muncul, pelajaran K45 i). */
        if (!daftarPenghiasBaca()) setTimeout(daftarPenghiasBaca, 300);

        const m = mesinAyat();
        if (m && typeof m.saatSiap === 'function') {
          m.saatSiap(() => {
            /* indeks siap ⇒ hias pasal yang SEDANG tampil (kalau ada) */
            const t = window.ANodesAlkitabTampilan;
            const hal = document.getElementById('baca-alkitab');
            const isi = document.getElementById('baca-isi');
            if (!t || !hal || hal.hidden || !isi) return;
            const pos = t.posisi;
            if (pos) { try { hiasAyatBaca({ kitab: pos.kitab, pasal: pos.pasal, isi }); } catch (e) {} }
          });
        }
      }

  return {
    buka, bukaHalaman, tutupHalaman, pasangPengait, bersihkan, siapkanOtomatis,
    get aktif() { return halamanAktif; },
    versi: () => VERSI,
      /* K69f — ukuran nama ikut pengaturan huruf */
      pasangUbahHuruf,
      /* K71 — ⬆ peta beku (kepala + panggung menempel saat digulir) */
      kunciTinggiPeta, pasangKunciPeta,
    /* K69 b–d — 📍 kata lokasi di halaman baca Alkitab */
    hiasAyatBaca, bersihkanBaca, tutupKotakLokasi,
    titikBerkedip: () => berkedip,
    simpanBerkedip: (nyala) => {
      berkedip = !!nyala;
      try { localStorage.setItem(KUNCI_BERKEDIP, berkedip ? 'nyala' : 'mati'); } catch (e) {}
      /* gambar ulang kolom yang sedang terbuka supaya perubahannya langsung terlihat */
      if (kotakAktif && lokasiAktif) {
        const w = kotakAktif, k = lokasiAktif, no = Number(w.dataset.ayat);
        const pos = window.ANodesAlkitabTampilan && window.ANodesAlkitabTampilan.posisi;
        if (pos) {
          kotakAktif = null;
          tampilKotakLokasi(w, mesinAyat().daftarLokasi(pos.kitab, pos.pasal, no), k);
          kotakAktif = w;
        }
      }
      return berkedip;
    },
    // untuk uji
    _keadaanLokasi: () => ({
      tombol: document.querySelectorAll('#baca-isi .pl-sisip').length,
      kotak: document.querySelectorAll('#baca-isi .pl-kotak').length,
      keterbuka: kotakAktif ? Number(kotakAktif.dataset.ayat) : null,
      lokasi: lokasiAktif,
      penghias: penghiasSiap,
      berkedip
    }),
    _kunciBerkedip: () => KUNCI_BERKEDIP
  };
})();

// hidupkan begitu halaman siap (kalau plugin sudah terpasang)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    window.ANodesPetaTampilan.siapkanOtomatis();
  });
} else {
  window.ANodesPetaTampilan.siapkanOtomatis();
}
