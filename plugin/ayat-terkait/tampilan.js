/* ============================================================
   ANodes — plugin/ayat-terkait/tampilan.js
   TAMPILAN PLUGIN 🔗 AYAT TERKAIT — **LOGIKA LAB 2** (K25 h–o)

   ------------------------------------------------------------
   KONSEP (dari lab2 — Bapak: “yg dibuat adalah logikanya;
   penempatan/aturan tetap pakai aturan ANodes sekarang”):

     1)  Klik kaitan   →  PRATINJAU   (1 slot, gantian, BELUM permanen)
     2)  Klik ✓ pilih  →  KOMIT       (jadi tetap)
            • label jejak KUMULATIF (dipisah koma)
            • baris kaitan MENUTUP lagi (rapat)
            • blok permanen muncul DI BAWAH (berurutan)
            • 1 jalur tercatat di 🕒 Riwayat Jalur
     3)  📍 di blok    →  sorot posisi ayat itu di Riwayat Jalur
     4)  ✕ di blok     →  hapus ayat + SELURUH cabangnya (konfirmasi 2 langkah)

   Yang DIPERTAHANKAN dari versi sebelumnya (jangan dibongkar):
     • kaitan diurut menurut URUTAN KITAB (bukan votes)
     • 1 ayat = 1 blok (dedup) — ayat yang sudah ada cukup DISOROT (kedip)
     • kaitan berentang dibuka LENGKAP (mis. 1 Tes 4:14-17 → 4 ayat)
     • kaitan lanjutan ditanyakan pada AYAT PERTAMA rentang
     • teks ayat diambil SEKALIGUS lewat ANodesAlkitab.ambilAyatBanyak()
     • sambungan resmi Alkitab: tambahPenghias() / jalankanPenghias()

   Bentuknya (penempatan ANodes — bukan salinan layar lab2):
     • hanya di halaman baca (#baca-isi), di bawah ayatnya sendiri
     • lebar 480px, CSS berawalan .at-
     • ❌ tidak ada panel samping — Riwayat Jalur menurun di bawah judul

   ⚠️ ATURAN PLUGIN ANodes:
     • plugin BISA DILEPAS — kalau tidak dipasang halaman baca tampil apa adanya
     • lepas plugin → semua tampilan kaitan dibuang; catatan user TIDAK disentuh
     • ❌ JANGAN fetch() — data lewat mesin (IndexedDB)
   ============================================================ */

window.ANodesAyatTerkaitTampilan = (function () {
  'use strict';

  // K80 (30 Okt 2026) — tombol [Full] di kepala pratinjau
  //   (sebelumnya K61, 23 Sep 2026 — wadah kaitan jadi `block` saat daftar
  //    terbuka, teks tidak lagi terpotong)
  const VERSI = 'v30Okt-b';

  const CHIP_MAKS = 60;    // batas kaitan yang digambar serentak (data bisa 97)
  const JALUR_MAKS = 30;   // batas jalur yang diingat

  const mesinTerkait = () => window.ANodesAyatTerkait;
  const mesinAlkitab = () => window.ANodesAlkitab;
  const elBaca = () => document.getElementById('baca-isi');

  // cara tampil terpilih ('chip' = tombol kecil [bawaan] · 'buka' = langsung tampil)
  //   ⚠️ `plugin/ayat-terkait/plugin.js` memanggil DUA fungsi ini lewat
  //      window.ANodesAyatTerkaitTampilan — jadi keduanya WAJIB ada di sini.
  const KUNCI_CARA = 'anodes-ayat-terkait-cara';

  function caraTampil() {
    let c = null;
    try { c = localStorage.getItem(KUNCI_CARA); } catch (e) {}
    return (c === 'buka') ? 'buka' : 'chip';       // bawaan 15 Sep 2026 = 'chip'
  }

  function simpanCaraTampil(id) {
    const c = (id === 'buka') ? 'buka' : 'chip';
    try {
      if (c === 'chip') localStorage.removeItem(KUNCI_CARA);
      else localStorage.setItem(KUNCI_CARA, c);
    } catch (e) {}
    gambarUlang();                                   // halaman langsung ikut berubah
    return c;
  }

  const caraSekarang = () => caraTampil();

  // blok yang sudah terbuka pada pasal yang sedang tampil (anti-dobel)
  let blokMap = new Map();    // kunci ayat → elemen blok
  let pasalTampil = '';       // "53.2" — penanda pasal yang sedang digambar
  let sorotBlokAktif = null;  // blok yang sedang disorot (kuning)
  let sorotJalurAktif = [];   // tautan riwayat yang sedang disorot

  // 🕒 Riwayat Jalur — SATU untuk semua blok di halaman (menurun di bawah judul)
  let jalurHistori = [];
  let blokAktif = null;       // blok terakhir yang dipilih (garis hijau)

  const kunciAyat = (kitab, pasal, ayat) => kitab + '.' + pasal + '.' + ayat;

  // ------------------------------------------------------------
  // K39 (17 Sep 2026) — NAMA KITAB SINGKAT DI SELURUH TAMPILAN
  //   Bapak: *“saya perlu oder untuk **semua ayat terkait** gunakan metode
  //   **ayat singkat saja**.. **Matius → Mat** supaya hemat tempat.”*
  //   ⇒ `ambilAyatBanyak()` sudah menyediakan `labelPendek` di setiap butirnya,
  //     jadi di sini cukup memilih `labelPendek` (bukan `label`).
  //   ⚠️ Title (keterangan saat disorot) tetap boleh memakai nama PANJANG
  //      supaya tidak salah ayat.
  // ------------------------------------------------------------
  const labelAyat = (d) => {
    if (!d) return '';
    return d.labelPendek || d.label || '';
  };

  function pesan(t) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = t;
    el.classList.add('tampil');
    clearTimeout(el._tT);
    el._tT = setTimeout(() => el.classList.remove('tampil'), 2200);
  }

  function elSpan(kelas, teks) {
    const s = document.createElement('span');
    s.className = kelas;
    if (teks !== undefined) s.textContent = String(teks);
    return s;
  }

  function tombol(kelas, teks, judul, saatKlik) {
    const b = document.createElement('button');
    b.className = kelas;
    b.textContent = teks;
    if (judul) b.title = judul;
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      saatKlik();
    });
    return b;
  }

  // ------------------------------------------------------------
  // PENGHIAS — dipanggil plugin Alkitab tiap selesai menggambar pasal
  // ------------------------------------------------------------
  function hias(ctx) {
    if (!ctx || !ctx.isi) return;
    const m = mesinTerkait();
    if (!m || !m.siap()) return;
    const a = mesinAlkitab();
    if (!a || !a.ambilAyatBanyak) return;

    // pasal berganti → jejak blok & riwayat lama tidak berlaku lagi
    const kp = ctx.kitab + '.' + ctx.pasal;
    if (kp !== pasalTampil) {
      pasalTampil = kp;
      blokMap = new Map();
      jalurHistori = [];
      blokAktif = null;
    }

    const peta = m.petaKaitanPasal(ctx.kitab, ctx.pasal);

    // ------------------------------------------------------------
    // K34 — SATU RENTANG AYAT (mis. Roma 8:6-10)
    //   Bapak: *“tampilkan semua 6,7,8,9,10 TANPA ayat terkait di bawah ayat ..
    //   di bawah ayat 10 baru tampilkan [6][7][8][9][10] .. user pilih 7 ..
    //   baru tampilkan ayat terkaitnya.”*
    //   ⇒ ayat di dalam rentang TIDAK memasang tombol sendiri-sendiri;
    //     yang muncul hanya SATU baris pemilih di bawah ayat terakhir.
    // ------------------------------------------------------------
    const rentang = ctx.rentang;
    let ayatRentang = null;          // Set nomor ayat yang TIDAK boleh dipasangi tombol
    if (rentang && rentang.akhir > rentang.awal) {
      const barisRentang = [];
      for (let n = rentang.awal; n <= rentang.akhir; n++) {
        const baris = ctx.isi.querySelector('.ayat-baca[data-ayat="' + n + '"]');
        if (baris) barisRentang.push({ n, baris });
      }
      if (barisRentang.length > 1) {
        // ayat-ayat rentang: TIDAK dipasangi tombol “ayat terkait (n)”
        ayatRentang = new Set(barisRentang.map(x => x.n));
        barisRentang.forEach(({ baris }) => {
          const lama = baris.querySelector(':scope > .at-hias');
          if (lama) lama.remove();
        });
        // satu baris pemilih, ditempel di bawah ayat TERAKHIR rentang
        const terakhir = barisRentang[barisRentang.length - 1].baris;
        if (!terakhir.querySelector(':scope > .at-hias-rentang')) {
          terakhir.appendChild(barisPemilihRentang(ctx, rentang, peta));
        }
      }
    }

    ctx.isi.querySelectorAll('.ayat-baca[data-ayat]').forEach(baris => {
      // ⚠️ baris yang sudah punya hiasan JANGAN diganggu (hias bisa dipanggil
      //    berkali-kali: data menyusul, halaman dibuka lagi, plugin hidup ulang)
      if (baris.querySelector(':scope > .at-hias')) return;

      const noAyat = Number(baris.dataset.ayat);
      // K34: ayat di dalam rentang dilewati — tombolnya diganti baris pemilih
      if (ayatRentang && ayatRentang.has(noAyat)) return;

      const jumlah = peta[noAyat] || 0;
      if (!jumlah) return;

      const hiasEl = document.createElement('div');
      hiasEl.className = 'at-hias';
      hiasEl.dataset.asal = kunciAyat(ctx.kitab, ctx.pasal, noAyat);
      /* ⚠️ K61 (23 Sep 2026) — kalau daftar kaitan LANGSUNG terbuka (cara
         tampil 'buka'), wadah ini berisi SELURUH kotak ⇒ `.at-hias` harus
         balik jadi BLOK (kalau tetap `inline` sementara isinya blok,
         peramban bisa "membungkus" isinya dan teks jadi terpotong).
         Saat TERTUTUP (isi hanya tombol) tetap `inline` supaya sejajar. */
      if (caraSekarang() === 'buka') hiasEl.classList.add('at-hias-penuh');
      hiasEl.appendChild(pintuKaitan(ctx.kitab, ctx.pasal, noAyat, jumlah, hiasEl));
      baris.appendChild(hiasEl);
    });

    gambarRiwayat();
  }

  // ------------------------------------------------------------
  // K34 — BARIS PEMILIH AYAT untuk satu rentang
  //   [6] [7] [8] [9] [10]      ← satu baris, di bawah ayat terakhir
  //   klik salah satu → kolom kaitan AYAT ITU SAJA terbuka di bawahnya.
  //   ⚠️ Nomor yang sedang dipilih diberi tanda jelas (.at-rentang-aktif).
  // ------------------------------------------------------------
  function barisPemilihRentang(ctx, rentang, peta) {
    const m = mesinTerkait();

    const hiasEl = document.createElement('div');
    hiasEl.className = 'at-hias at-hias-rentang';
    hiasEl.dataset.asal = kunciAyat(ctx.kitab, ctx.pasal, rentang.awal);

    const kotak = document.createElement('div');
    kotak.className = 'at-rentang';

    const kepala = document.createElement('div');
    kepala.className = 'at-rentang-kepala';
    kepala.appendChild(elSpan('at-rentang-judul',
      'Ayat terkait — pilih ayat (' + rentang.awal + '–' + rentang.akhir + ')'));
    kotak.appendChild(kepala);

    const barisNo = document.createElement('div');
    barisNo.className = 'at-rentang-no';
    kotak.appendChild(barisNo);

    const wadah = document.createElement('div');
    wadah.className = 'at-rentang-isi';
    kotak.appendChild(wadah);

    // keadaan kotak (dipakai daftarKaitan lewat wadah)
    kotak._kitab = ctx.kitab;
    kotak._pasal = ctx.pasal;
    kotak._rentang = rentang;

    let aktif = null;

    function pilihAyat(n) {
      aktif = n;
      barisNo.querySelectorAll('.at-rentang-btn').forEach(b => {
        b.classList.toggle('at-rentang-aktif', Number(b.dataset.ayat) === n);
      });
      wadah.innerHTML = '';
      const jumlah = peta[n] || 0;
      if (!jumlah) {
        wadah.appendChild(elSpan('at-kosong', 'Ayat ' + n + ' tidak punya ayat terkait.'));
        return;
      }
      // kolom kaitan AYAT ITU SAJA — logika lab2 seperti biasa
      const daftar = daftarKaitan(ctx.kitab, ctx.pasal, n, jumlah, wadah);
      // ⚠️ akar rantai = AYAT YANG DIPILIH (bukan ayat pertama rentang) —
      //    supaya halaman kerja mencatat “Roma 8:7 → Kejadian 6:8”.
      daftar._akarRef = [ctx.kitab, ctx.pasal, n, n];
      wadah.appendChild(daftar);
    }

    for (let n = rentang.awal; n <= rentang.akhir; n++) {
      const jumlah = peta[n] || 0;
      const b = tombol('at-rentang-btn', String(n),
        jumlah
          ? 'Ayat ' + n + ' — ' + jumlah + ' ayat terkait'
          : 'Ayat ' + n + ' — tidak ada ayat terkait',
        () => pilihAyat(n));
      b.dataset.ayat = String(n);
      if (!jumlah) b.classList.add('at-rentang-kosong');
      barisNo.appendChild(b);
    }

    // langsung buka ayat PERTAMA rentang supaya user tidak melihat kolom kosong
    const pertamaAda = (() => {
      for (let n = rentang.awal; n <= rentang.akhir; n++) if (peta[n]) return n;
      return rentang.awal;
    })();
    pilihAyat(pertamaAda);

    hiasEl.appendChild(kotak);
    return hiasEl;
  }

  // ------------------------------------------------------------
  // PINTU MASUK kaitan — satu tempat supaya PILIHAN cara tampil dihormati:
  //   'chip' (bawaan) → tombol kecil “ayat terkait (n)”, daftar tertutup
  //   'buka'          → daftar kaitan langsung terbuka
  // ------------------------------------------------------------
  function pintuKaitan(kitab, pasal, ayat, jumlah, wadah) {
    if (caraSekarang() === 'buka') {
      return daftarKaitan(kitab, pasal, ayat, jumlah, wadah);
    }
    return tombolKaitan(kitab, pasal, ayat, jumlah, wadah);
  }

  // ------------------------------------------------------------
  // TOMBOL “ayat terkait (n)” — pintu masuk daftar kaitan
  //   (bawaan: TERTUTUP — permintaan Bapak 15 Sep 2026)
  //
  //   K37 (17 Sep 2026): kalau user sudah MEMILIH ≥2 ayat (mis. Roma 4:2-4),
  //   tombol ini menjadi **pintu masuk MODE GRUP** — ayat-ayat itu diikat dan
  //   user PINDAH ke halaman kerja (❌ bukan membuka daftar di tempat).
  //   ⚠️ alur 1 ayat TIDAK berubah.
  // ------------------------------------------------------------
  function ayatDipilih() {
    const t = window.ANodesAlkitabTampilan;
    if (!t || !t.pilihan) return [];
    try { return t.pilihan.slice(); } catch (e) { return []; }
  }

  function masukGrup(kitab, pasal, ayat) {
    const k = window.ANodesAyatTerkaitKerja;
    if (!k || typeof k.bukaGrup !== 'function') return false;
    const dipilih = ayatDipilih();
    if (dipilih.length < 2) return false;
    // ayat yang ditekan ikut masuk grup walaupun belum terpilih
    const arr = dipilih.indexOf(ayat) >= 0 ? dipilih.slice() : dipilih.concat([ayat]);
    try {
      // seleksi & bar kirim ditutup rapi supaya tidak bentrok dengan K20
      const t = window.ANodesAlkitabTampilan;
      if (t && typeof t.batalPilih === 'function') t.batalPilih();
      return k.bukaGrup(kitab, pasal, arr, ayat) !== false;
    } catch (e) {
      console.warn('ANodes: gagal masuk mode grup', e);
      return false;
    }
  }

  function tombolKaitan(kitab, pasal, ayat, jumlah, wadah) {
    // 🎛 I-15 GAYA C (22 Sep 2026) — Bapak memilih gaya **C**:
    //   *“yg penting satu baris / sejajar.. itu lebih rapih terlihat..
    //    icon itu bisa mewakili artinya .. jadi pilihan saya C”*
    //   ⇒ tombol cukup **ikon 🔗 + angka** (kata ”ayat terkait” dibuang)
    //     supaya sejajar dengan tombol 🖊 penguat dan hemat ruang ke bawah.
    //     ⚠️ Berbagai hal lain TIDAK berubah: klik ⇒ daftar kaitan turun
    //     di bawah ayat ini · alur grup (K37) tetap sama.
    const b = tombol('at-toggle', '🔗' + jumlah,
      '🔗 Ayat terkait — tampilkan ' + jumlah + ' ayat yang berkaitan dengan ayat ini',
      () => {
        // K37 — kalau saat DIKLIK ada ≥2 ayat terpilih → hidupkan mode GRUP
        //   (dicek di sini, bukan saat tombol digambar, supaya tidak basi)
        if (masukGrup(kitab, pasal, ayat)) return;
        wadah.innerHTML = '';
        /* ⚠️ K61 (23 Sep 2026) — saat daftar dibuka, wadah `.at-hias`
           berubah jadi berisi BLOK ⇒ WAJIB balik jadi `block`.
           Kalau tetap `inline` sedangkan isinya blok, peramban dapat
           “memecah” kotak dan teks pratinjau jadi TERPOTONG. */
        wadah.classList.add('at-hias-penuh');
        wadah.appendChild(daftarKaitan(kitab, pasal, ayat, jumlah, wadah));
      });
    segarkanTandaGrup(b, jumlah);
    return b;
  }

  // tanda visual + judul tombol mengikuti keadaan pilihan saat ini
  function segarkanTandaGrup(b, jumlah) {
    const dalamGrup = ayatDipilih().length >= 2;
    b.classList.toggle('at-toggle-grup', dalamGrup);
    // I-15: di mode grup tulisan tetap memakai kata (sedang menyusun beberapa
    // ayat ⇒ perlu jelas). Bukan grup ⇒ cukup ikon + angka.
    if (dalamGrup) {
      b.textContent = 'ayat terkait (' + (jumlah || '') + ')';
      b.title = 'Mulai ayat terkait dalam GROUP (' + ayatDipilih().length +
        ' ayat terpilih) — pindah ke halaman kerja';
    } else {
      b.textContent = '🔗' + (jumlah || '');
      b.title = '🔗 Ayat terkait — tampilkan ' + (jumlah || '') +
        ' ayat yang berkaitan dengan ayat ini';
    }
  }

  // semua tombol “ayat terkait (n)” di halaman baca ikut berubah begitu user
  // menambah/mengurangi ayat terpilih (pemberitahuan dari plugin Alkitab)
  //   K55d dibatalkan 22 Sep 2026 — tombol kembali PER AYAT, jadi cukup
  //   mengubah kelas/tanda tiap `.at-toggle` (❌ tanpa menggambar ulang bar).
  function segarkanSemuaTombolGrup() {
    const isi = elBaca();
    if (!isi) return;
    isi.querySelectorAll('.at-toggle').forEach(b => segarkanTandaGrup(b));
    const t = window.ANodesAlkitabTampilan;
    if (t && typeof t.segarkanPintasan === 'function') t.segarkanPintasan();
  }

  // ------------------------------------------------------------
  // DAFTAR KAITAN satu ayat (terbuka karena tombol ditekan)
  // ------------------------------------------------------------
  function daftarKaitan(kitab, pasal, ayat, jumlah, wadah) {
    const m = mesinTerkait();

    const kotak = document.createElement('div');
    kotak.className = 'at-daftar';

    const kepala = document.createElement('div');
    kepala.className = 'at-kepala';
    kepala.appendChild(elSpan('at-judul', 'Ayat terkait (' + jumlah + ')'));
    kepala.appendChild(tombol('at-tutup', '✕', 'Tutup daftar ini', () => {
      kotak.remove();
      // kembali ke pintu masuk yang sesuai cara tampil (rapat lagi)
      if (wadah && !wadah.querySelector('.at-toggle') && !wadah.querySelector('.at-daftar')) {
        wadah.classList.remove('at-hias-penuh');   // K61 — balik `inline` (hanya isi tombol)
        wadah.appendChild(pintuKaitan(kitab, pasal, ayat, jumlah, wadah));
      }
    }));
    kotak.appendChild(kepala);

    const barisKaitan = document.createElement('div');
    barisKaitan.className = 'at-kaitan';
    kotak.appendChild(barisKaitan);

    const anak = document.createElement('div');
    anak.className = 'at-anak';
    kotak.appendChild(anak);

    // ⚠️ URUT URUTAN KITAB (bukan votes) — seperti lab2/lab3
    const semua = m.kaitan(kitab, pasal, ayat).slice().sort((x, y) =>
      (x[0] - y[0]) || (x[1] - y[1]) || (x[2] - y[2]));

    // nyimpan keadaan kotak: siapa pemiliknya & apa yang sudah dipilih
    kotak._kitab = kitab; kotak._pasal = pasal; kotak._ayat = ayat;
    kotak._jumlah = jumlah; kotak._anak = anak;
    kotak._semua = semua;
    kotak._dipilih = [];
    kotak._pratinjau = null;
    kotak._dataKaitan = [];

    gambarBatangKaitan(kotak, semua.slice(0, CHIP_MAKS));

    if (semua.length > CHIP_MAKS) {
      barisKaitan.appendChild(tombol('at-lagi',
        '＋ ' + (semua.length - CHIP_MAKS) + ' kaitan lagi',
        'Tampilkan semua kaitan ayat ini (ada ' + semua.length + ')',
        () => {
          const sisa = barisKaitan.querySelector('.at-lagi');
          if (sisa) sisa.remove();
          gambarBatangKaitan(kotak, semua, true);
        }));
    }

    return kotak;
  }

  // ------------------------------------------------------------
  // GAMBAR “BATANG” SATU AYAT — bagian inti logika lab2
  //   Keadaan 1 (belum ada yang dipilih):
  //       [kaitan] [kaitan] [kaitan] …   ← semua chip, bisa diklik = PRATINJAU
  //   Keadaan 2 (sudah ada yang dipilih = label jejak):
  //       Yoh 4:7-11, Mrk 13:27          ← LABEL JEJAK (dipisah koma, kumulatif)
  // ------------------------------------------------------------
  function gambarBatangKaitan(kotak, daftar, tambah) {
    const a = mesinAlkitab();
    const baris = kotak.querySelector('.at-kaitan');
    if (!baris) return;

    if (!tambah) baris.innerHTML = '';
    if (!daftar || !daftar.length) {
      baris.appendChild(elSpan('at-kosong', '(tidak ada ayat terkait)'));
      return;
    }

    // teks ayat diambil SEKALIGUS (satu panggilan)
    const dataAyat = a.ambilAyatBanyak(daftar);

    if (tambah) {
      // menambah sisa kaitan → sisipkan SEBELUM tombol “＋ … lagi”
      const sisa = baris.querySelector('.at-lagi');
      dataAyat.forEach(d => {
        kotak._dataKaitan.push(d);
        const b = chipKaitan(kotak, d);
        if (sisa) baris.insertBefore(b, sisa); else baris.appendChild(b);
      });
      return;
    }

    dataAyat.forEach(d => {
      kotak._dataKaitan.push(d);
      baris.appendChild(chipKaitan(kotak, d));
    });
  }

  // satu chip kaitan: klik = PRATINJAU (belum komit)
  function chipKaitan(kotak, d) {
    const b = tombol('at-chip', labelAyat(d),
      d.label + (d.ayat.length > 1 ? ' (' + d.ayat.length + ' ayat)' : '') +
      ' — klik untuk melihat dulu',
      () => pratinjau(kotak, d));
    b._data = d;
    return b;
  }

  // ------------------------------------------------------------
  // K80 · [Full] — lompat ke halaman baca Alkitab pada RENTANG ayat ini
  //   ❌ tanpa mesin baru: memakai `ANodesAlkitabTampilan.bukaRentang()` yang
  //   sudah menangani gulir + kedip 5 detik + 🏠 kembali ke bacaan sebelumnya.
  //   Kalau plugin Alkitab belum siap / belum terpasang → beri pesan jelas
  //   (❌ jangan diam saja).
  // ------------------------------------------------------------
  function bukaFull(d) {
    if (!d || !d.no) return false;
    const A = window.ANodesAlkitab;
    const T = window.ANodesAlkitabTampilan;
    if (!A || !A.siap || !A.siap()) {
      pesan('⏳ Menyiapkan data Alkitab…');
      if (A && A.ketikaSiap) A.ketikaSiap(() => bukaFull(d));
      return false;
    }
    if (!T || typeof T.bukaRentang !== 'function') {
      pesan('💡 Pasang plugin 📖 Alkitab dahulu');
      return false;
    }
    try {
      return T.bukaRentang({
        no: d.no, pasal: d.pasal,
        ayat1: d.ayat1 || 0, ayat2: d.ayat2 || d.ayat1 || 0
      });
    } catch (e) {
      console.warn('ANodes Ayat Terkait: gagal membuka [Full]', e);
      pesan('⚠️ Gagal membuka Alkitab');
      return false;
    }
  }

  // ------------------------------------------------------------
  // ① PRATINJAU — 1 slot, gantian (klik chip lain → yang lama hilang)
  // ------------------------------------------------------------
  function pratinjau(kotak, d) {
    kotak._pratinjau = d;
    gambarKotakPratinjau(kotak);

    // chip yang sedang dipratinjau diberi tanda
    const baris = kotak.querySelector('.at-kaitan');
    if (baris) {
      baris.querySelectorAll('.at-chip').forEach(c => {
        c.classList.toggle('at-chip-previewed',
          !!(c._data && d && c._data.label === d.label));
      });
    }
  }

  // kotak pratinjau: teks ayat + [✓ pilih] + kaitan lanjutan (ABU-ABU, mati)
  function gambarKotakPratinjau(kotak) {
    const wadah = kotak.querySelector('.at-anak');
    if (!wadah) return;
    // ⚠️ kotak pratinjau tinggal DI DALAM `.at-anak` — jadi yang lama dicari
    //    di sana (bukan ':scope > .at-pratinjau', yang tidak akan ketemu →
    //    akibatnya pratinjau menumpuk, bukan bergantian).
    const lama = wadah.querySelector(':scope > .at-pratinjau');
    if (lama) lama.remove();
    const d = kotak._pratinjau;
    if (!d) return;

    const m = mesinTerkait();

    const box = document.createElement('div');
    box.className = 'at-pratinjau';

    const kepala = document.createElement('div');
    kepala.className = 'at-pratinjau-kepala';
    kepala.appendChild(elSpan('at-pratinjau-nama', labelAyat(d)));
    kepala.appendChild(tombol('at-pilih', '✓ pilih',
      'Pilih ayat ini (jadikan tetap & lanjutkan rantai)',
      () => komit(kotak, d)));
    // K80 (30 Okt 2026) — [Full]: lompat ke Alkitab pada RENTANG ayat ini,
    //   ayatnya dikedipkan ±5 detik supaya user tahu posisinya, lalu 🏠
    //   kembali ke bacaan sebelumnya.
    //   Bapak: *“tombol full ini untuk lompat ke alkitab ke bilangan 6 bisa
    //   baca keseluruhan · tapi posisikan pada ayat 24-26 di buat stabilo
    //   sistem blinking beberapa detik supaya user tau posisi ayat · dan klik
    //   home kembali pada bacaan sebelumnya”*
    kepala.appendChild(tombol('at-full', 'Full',
      'Buka ' + (d.label || '') + ' di Alkitab (ayatnya dikedipkan sebentar)',
      () => bukaFull(d)));
    kepala.appendChild(tombol('at-tutup', '✕', 'Tutup pratinjau', () => {
      kotak._pratinjau = null;
      gambarKotakPratinjau(kotak);
      const baris = kotak.querySelector('.at-kaitan');
      if (baris) baris.querySelectorAll('.at-chip-previewed')
        .forEach(c => c.classList.remove('at-chip-previewed'));
    }));
    box.appendChild(kepala);

    // teks ayat (berentang ditampilkan lengkap)
    const teks = document.createElement('div');
    teks.className = 'at-pratinjau-teks';
    d.ayat.forEach(x => {
      const p = document.createElement('p');
      p.className = 'at-ayat' + (x.merah ? ' merah' : '');
      p.appendChild(elSpan('at-no', x.no));
      p.appendChild(document.createTextNode(x.teks));
      teks.appendChild(p);
    });
    box.appendChild(teks);

    // kaitan lanjutan di DALAM pratinjau = ABU-ABU & TIDAK bisa diklik.
    //   Alasan (pelajaran lab2): mencegah ayat perantara ter-skip —
    //   wajib ✓ pilih dulu, baru kaitan itu jadi blok & bisa diklik.
    const sub = document.createElement('div');
    sub.className = 'at-kaitan at-kaitan-mati';
    const jml = (m && m.jumlahKaitanAyat) ? m.jumlahKaitanAyat(d.no, d.pasal, d.ayat1) : 0;
    if (jml) {
      const daftarSub = m.kaitan(d.no, d.pasal, d.ayat1).slice()
        .sort((x, y) => (x[0] - y[0]) || (x[1] - y[1]) || (x[2] - y[2]));
      const dataSub = mesinAlkitab().ambilAyatBanyak(daftarSub.slice(0, 24));
      dataSub.forEach(sd => {
        if (sd.label === d.label) return;             // dirinya sendiri dibuang
        // K39 — kaitan lanjutan juga nama kitab SINGKAT (hemat tempat)
        sub.appendChild(elSpan('at-ref-mati', labelAyat(sd)));
      });
      sub.title = 'Klik “✓ pilih” dulu untuk melanjutkan rantai';
    }
    box.appendChild(sub);

    wadah.appendChild(box);
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ------------------------------------------------------------
  // ② KOMIT — di halaman BACA ini hanya satu langkah kecil:
  //
  //     tekan `✓ pilih` → **PINDAH ke HALAMAN KERJA AYAT TERKAIT** (K31).
  //     ❌ JANGAN menumpuk blok di dalam baris ayat — dulu begitu, dan
  //     akibatnya pasal terburai penuh blok (Bapak: “sudah tidak sesuai”).
  //
  //   Di halaman kerja itu bloknya dibangun: akar = ayat tempat mulai
  //   (mis. 2 Korintus 1:2), lalu ayat yang dipilih (mis. Roma 1:7) di
  //   bawahnya, terus bisa diteruskan ayat demi ayat sampai tersimpan.
  // ------------------------------------------------------------
  function komit(kotak, d) {
    // wajib punya ref — kalau tidak, jatuh ke cara lama (aman)
    if (!d || !d.no) return;
    const ref = [d.no, d.pasal, d.ayat1, d.ayat2 || d.ayat1];

    // akar rantai = ayat tempat kotak ini berada (penanda `.at-hias`)
    //   K34: kalau kotak ini bagian dari baris pemilih rentang, akarnya = ayat
    //   yang DIPILIH user (kotak._akarRef), bukan ayat pertama rentang.
    let akarRef = null;
    if (kotak._akarRef) {
      akarRef = kotak._akarRef.slice();
    } else {
      const hias = kotak.closest('.at-hias');
      if (hias && hias.dataset.asal) {
        const b = hias.dataset.asal.split('.').map(Number);
        if (b.length >= 3) akarRef = [b[0], b[1], b[2], b[2]];
      }
      // cadangan: penanda wadah (kalau ada) → ayat yang sedang dipilih
      if (!akarRef) {
        const wadah = kotak.closest('.at-pintasan-wadah');
        if (wadah && wadah.dataset.akar) {
          const b = wadah.dataset.akar.split('.').map(Number);
          if (b.length >= 3) akarRef = [b[0], b[1], b[2], b[2]];
        }
      }
    }

    // tutup pratinjau & rapatkan baris — biar halaman baca tetap rapi
    kotak._pratinjau = null;
    kotak._rapat = true;
    segarkanBatang(kotak);

    const k = window.ANodesAyatTerkaitKerja;
    if (!k) {
      pesan('🌿 Halaman kerja ayat terkait belum siap — pasang ulang plugin');
      return;
    }
    try {
      k.buka(akarRef, { ...d, _ref: ref });
    } catch (e) {
      console.warn('ANodes: gagal membuka halaman kerja', e);
      pesan('⚠️ Gagal membuka halaman kerja: ' + e.message);
    }
  }

  // gambar ulang “batang”: label jejak (kalau ada) + chip (kalau belum) + pratinjau
  function segarkanBatang(kotak) {
    const baris = kotak.querySelector('.at-kaitan');
    if (!baris) return;
    const dipilih = kotak._dipilih || [];

    // label jejak: kumulatif (dipisah koma), selalu di atas
    let jejak = baris.querySelector('.at-jejak');
    if (jejak) jejak.remove();
    if (dipilih.length) {
      jejak = document.createElement('div');
      jejak.className = 'at-jejak';
      dipilih.forEach((d, i) => {
        if (i) jejak.appendChild(document.createTextNode(', '));
        const al = document.createElement('a');
        al.className = 'at-jejak-link';
        al.href = '#';
        // K39 — label jejak memakai nama kitab SINGKAT
        al.textContent = labelAyat(d);
        al.title = 'Klik untuk melihat ayat ini di pratinjau lagi (' + (d.label || '') + ')';
        al.addEventListener('click', (e) => {
          e.preventDefault();
          kotak._pratinjau = d;
          kotak._rapat = false;
          segarkanBatang(kotak);
          gambarKotakPratinjau(kotak);
        });
        jejak.appendChild(al);
      });
      baris.insertBefore(jejak, baris.firstChild);
    }

    // chip & tombol “lagi” disembunyikan hanya saat kotak “rapat” (lab2).
    //   ⚠️ JANGAN memakai `dipilih.length` sebagai syarat — kalau begitu,
    //   tombol “kaitan lainnya” tidak akan pernah bisa menampilkan chip lagi.
    const rapat = !!kotak._rapat;
    kotak.classList.toggle('at-rapat', rapat);
    baris.querySelectorAll('.at-chip, .at-lagi').forEach(c => {
      c.style.display = rapat ? 'none' : '';
    });

    // kepala daftar (“Ayat terkait (n)” + ✕) ikut disembunyikan saat rapat
    const kepala = kotak.querySelector(':scope > .at-kepala');
    if (kepala) kepala.style.display = rapat ? 'none' : '';

    // saat rapat: kotak pratinjau dibuang (tidak ada yang sedang dipilih)
    const anak2 = kotak.querySelector('.at-anak');
    if (rapat && anak2) {
      anak2.querySelectorAll(':scope > .at-pratinjau').forEach(x => x.remove());
      kotak._pratinjau = null;
    }

    // tombol untuk membuka lagi semua kaitan (biar tidak “terkunci”)
    let lebih = baris.querySelector('.at-lebih');
    if (lebih) lebih.remove();
    if (rapat) {
      const jmlSemua = (kotak._semua || []).length;
      baris.appendChild(tombol('at-lebih',
        'kaitan lainnya (' + jmlSemua + ')',
        'Tampilkan lagi daftar semua kaitan',
        () => {
          // buka lagi pilihan chip — label jejak TETAP (kumulatif, seperti lab2)
          kotak._rapat = false;
          segarkanBatang(kotak);
        }));
    }
    if (!rapat) gambarKotakPratinjau(kotak);
  }

  // ------------------------------------------------------------
  // BLOK PERMANEN — satu ayat yang sudah dipilih
  // ------------------------------------------------------------
  function buatBlok(d, wadahTempat, senyap) {
    const key = kunciAyat(d.no, d.pasal, d.ayat1);

    const blok = document.createElement('div');
    blok.className = 'at-blok';
    blok.dataset.kunci = key;

    const kepala = document.createElement('div');
    kepala.className = 'at-blok-kepala';
    // K39 — nama blok memakai nama kitab SINGKAT
    kepala.appendChild(elSpan('at-blok-ref', '📖 ' + labelAyat(d)));
    kepala.appendChild(tombol('at-blok-jalur', '📍',
      'Tunjukkan posisi ayat ini di Riwayat Jalur', () => sorotJalur(key)));
    kepala.appendChild(tombol('at-blok-hapus', '✕',
      'Hapus ayat ini beserta seluruh cabang di bawahnya', () => bukaHapus(blok)));
    blok.appendChild(kepala);

    const teks = document.createElement('div');
    teks.className = 'at-blok-teks';
    d.ayat.forEach(x => {
      const p = document.createElement('p');
      p.className = 'at-ayat' + (x.merah ? ' merah' : '');
      p.appendChild(elSpan('at-no', x.no));
      p.appendChild(document.createTextNode(x.teks));
      teks.appendChild(p);
    });
    blok.appendChild(teks);

    // kaitan lanjutan: tombol “ayat terkait (n)” lagi → rantai bisa diteruskan
    const anak = document.createElement('div');
    anak.className = 'at-anak';
    blok.appendChild(anak);

    const m = mesinTerkait();
    const jmlLanjut = m.jumlahKaitanAyat(d.no, d.pasal, d.ayat1);
    if (jmlLanjut) {
      const hiasLanjut = document.createElement('div');
      hiasLanjut.className = 'at-hias';
      hiasLanjut.appendChild(pintuKaitan(d.no, d.pasal, d.ayat1, jmlLanjut, hiasLanjut));
      anak.appendChild(hiasLanjut);
    }

    (wadahTempat || elBaca()).appendChild(blok);
    blokMap.set(key, blok);
    if (!senyap) blok.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return blok;
  }

  // garis hijau = “posisi sekarang”
  function tandaiAktif(blok) {
    if (blokAktif && blokAktif !== blok) blokAktif.classList.remove('at-blok-aktif');
    blokAktif = blok;
    if (blok) blok.classList.add('at-blok-aktif');
  }

  // sorot kuning sebentar (anti-dobel: cukup disorot, tidak dibuka dua kali)
  function sorot(blok) {
    if (sorotBlokAktif && sorotBlokAktif !== blok) sorotBlokAktif.classList.remove('at-sorot');
    sorotBlokAktif = blok;
    if (!blok) return;
    blok.classList.remove('at-sorot');
    void blok.offsetWidth;
    blok.classList.add('at-sorot');
    blok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    clearTimeout(window.__atSorotTimer);
    window.__atSorotTimer = setTimeout(() => {
      blok.classList.remove('at-sorot');
      if (sorotBlokAktif === blok) sorotBlokAktif = null;
    }, 2500);
  }

  // ------------------------------------------------------------
  // 🕒 RIWAYAT JALUR — daftar jalur menurun di bawah judul pasal
  //   (bukan panel samping — halaman ANodes hanya 480px)
  // ------------------------------------------------------------
  function catatJalur(keyBaru) {
    // jalur = urutan dari AKAR sampai ayat ini (hierarki blok)
    const rantai = [];
    const blokBaru = elBaca().querySelector('.at-blok[data-kunci="' + keyBaru + '"]');
    if (blokBaru) {
      const semua = [...elBaca().querySelectorAll('.at-blok')]
        .filter(b => b !== blokBaru && b.contains(blokBaru))
        .sort((a, b) => a.querySelectorAll('.at-blok').length -
                        b.querySelectorAll('.at-blok').length);
      semua.forEach(b => rantai.push(b.dataset.kunci));   // dari luar ke dalam
      rantai.push(keyBaru);
    } else {
      rantai.push(keyBaru);
    }
    jalurHistori.push(rantai);
    if (jalurHistori.length > JALUR_MAKS) jalurHistori.shift();
  }

  function gambarRiwayat() {
    const isi = elBaca();
    if (!isi) return;
    let panel = document.getElementById('at-riwayat');
    if (!jalurHistori.length) {
      if (panel) panel.remove();
      return;
    }
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'at-riwayat';
      panel.className = 'at-riwayat';
      const kepala = document.createElement('div');
      kepala.className = 'at-riwayat-kepala';
      kepala.appendChild(elSpan('at-riwayat-judul', '🕒 Riwayat Jalur'));
      panel.appendChild(kepala);
      const isiPanel = document.createElement('div');
      isiPanel.className = 'at-riwayat-isi';
      panel.appendChild(isiPanel);
      // ⚠️ panel ditaruh SETELAH judul pasal (.ay-meta), BUKAN di paling atas
      //    isi — kalau `isi.firstChild`, judul pasal jatuh ke bawah panel.
      const jangkar = isi.querySelector('.ay-meta') || isi.querySelector('.ay-judul');
      if (jangkar && jangkar.nextSibling) {
        isi.insertBefore(panel, jangkar.nextSibling);
      } else if (jangkar) {
        jangkar.parentElement.appendChild(panel);
      } else {
        isi.insertBefore(panel, isi.firstChild);
      }
    }
    const isiPanel = panel.querySelector('.at-riwayat-isi');
    isiPanel.innerHTML = '';
    const ol = document.createElement('ol');
    for (let i = jalurHistori.length - 1; i >= 0; i--) {   // terbaru di atas
      const li = document.createElement('li');
      jalurHistori[i].forEach((k, idx) => {
        if (idx) li.appendChild(document.createTextNode(' → '));
        const a = document.createElement('a');
        a.className = 'at-riwayat-link';
        a.href = '#';
        a.dataset.kunci = k;
        a.textContent = namaKunci(k);
        a.title = 'Tunjukkan ayat ini di rantai';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const blok = elBaca().querySelector('.at-blok[data-kunci="' + k + '"]');
          if (blok) sorot(blok); else pesan('Ayat itu belum ada di rantai');
        });
        li.appendChild(a);
      });
      ol.appendChild(li);
    }
    isiPanel.appendChild(ol);
  }

  // nama ayat dari kunci "53.2.1" (pakai data Alkitab yang sudah dimuat)
  //   K39 — memakai nama kitab SINGKAT (mis. `Mat 24:31`)
  const namaKunci = (k) => {
    const bagian = String(k).split('.').map(Number);
    const a = mesinAlkitab();
    if (!a || !a.ambilAyatBanyak) return k;
    try {
      const d = a.ambilAyatBanyak([[bagian[0], bagian[1], bagian[2], bagian[2]]]);
      if (d && d[0]) return labelAyat(d[0]) || k;
    } catch (e) {}
    return k;
  };

  // 📍 sorot posisi ayat ini di Riwayat Jalur
  function sorotJalur(key) {
    if (sorotJalurAktif.length) sorotJalurAktif.forEach(a => a.classList.remove('at-riwayat-sorot'));
    const panel = document.getElementById('at-riwayat');
    if (!panel) { pesan('Riwayat Jalur belum ada'); return; }
    const links = panel.querySelectorAll('.at-riwayat-link[data-kunci="' + key + '"]');
    if (!links.length) { sorotJalurAktif = []; pesan('Ayat ini belum tercatat di Riwayat Jalur'); return; }
    sorotJalurAktif = [...links];
    sorotJalurAktif.forEach(a => a.classList.add('at-riwayat-sorot'));
    links[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    clearTimeout(window.__atJalurTimer);
    window.__atJalurTimer = setTimeout(() => {
      sorotJalurAktif.forEach(a => a.classList.remove('at-riwayat-sorot'));
      sorotJalurAktif = [];
    }, 3000);
  }

  // ------------------------------------------------------------
  // HAPUS — satu ayat + SELURUH cabangnya (konfirmasi 2 langkah)
  //   ❌ tidak ada konsep EDIT: ubah = hapus lalu pilih ulang
  // ------------------------------------------------------------
  let hapusTarget = null;
  let hapusStep = 1;

  function kumpulkanSubtree(blok) {
    const hasil = [blok];
    blok.querySelectorAll('.at-blok').forEach(b => hasil.push(b));
    return hasil;
  }

  function bukaHapus(blok) {
    hapusTarget = blok;
    hapusStep = 1;
    pastikanModal();
    const m = document.getElementById('at-modal-hapus');
    if (!m) return;
    m.classList.add('buka');
    gambarHapus();
  }

  function tutupHapus() {
    const m = document.getElementById('at-modal-hapus');
    if (m) m.classList.remove('buka');
    hapusTarget = null;
    gambarRiwayat();
  }

  function gambarHapus() {
    const m = document.getElementById('at-modal-hapus');
    if (!m) return;
    const blok = hapusTarget;
    if (!blok) return;
    const isi = m.querySelector('.at-hapus-isi');
    const aksi = m.querySelector('.at-hapus-aksi');
    const judul = m.querySelector('.at-hapus-judul');
    const subtree = kumpulkanSubtree(blok);
    const nama = subtree.map(b => {
      const span = b.querySelector('.at-blok-ref');
      return span ? span.textContent.replace('📖 ', '') : b.dataset.kunci;
    });

    isi.innerHTML = '';
    aksi.innerHTML = '';

    if (hapusStep === 1) {
      judul.textContent = 'Hapus ayat?';
      const p = document.createElement('p');
      p.textContent = 'Ayat ' + nama[0] + ' akan dihapus. Kalau ayat ini punya cabang ' +
        '(ayat terkait yang sudah dipilih di bawahnya), cabang itu juga ikut terhapus.';
      isi.appendChild(p);
      aksi.appendChild(tombol('at-hapus-btn at-lanjut', 'Lanjut →', '', () => {
        hapusStep = 2; gambarHapus();
      }));
      aksi.appendChild(tombol('at-hapus-btn at-batal', 'Batal', '', tutupHapus));
    } else {
      judul.textContent = '⚠️ Konfirmasi hapus cabang';
      const p = document.createElement('p');
      p.textContent = 'Berikut akan dihapus (ayat + seluruh cabang di bawahnya):';
      isi.appendChild(p);
      const ul = document.createElement('ul');
      nama.forEach(n => {
        const li = document.createElement('li');
        li.textContent = n;
        ul.appendChild(li);
      });
      isi.appendChild(ul);
      const note = document.createElement('p');
      note.className = 'at-hapus-note';
      note.textContent = 'Tidak ada konsep edit — untuk mengubah, hapus dulu lalu pilih ulang.';
      isi.appendChild(note);
      aksi.appendChild(tombol('at-hapus-btn at-ya', 'Ya, hapus semuanya', '', hapusBlok));
      aksi.appendChild(tombol('at-hapus-btn at-batal', 'Batal', '', tutupHapus));
    }
  }

  function hapusBlok() {
    const blok = hapusTarget;
    if (!blok) { tutupHapus(); return; }
    const subtree = kumpulkanSubtree(blok);
    const kunciHapus = new Set(subtree.map(b => b.dataset.kunci));
    const induk = [...elBaca().querySelectorAll('.at-blok')]
      .find(x => x !== blok && x.contains(blok));
    const jmlHapus = subtree.length;

    subtree.forEach(b => blokMap.delete(b.dataset.kunci));
    blok.remove();

    // riwayat yang menyentuh ayat terhapus ikut dibersihkan
    jalurHistori = jalurHistori.filter(j => !j.some(k => kunciHapus.has(k)));

    if (induk) tandaiAktif(induk); else blokAktif = null;

    // kembalikan tombol “ayat terkait (n)” pada ayat asalnya (kalau hiasannya ada)
    const asal = elBaca().querySelector('.at-hias[data-asal="' + blok.dataset.kunci + '"]');
    if (asal && !asal.querySelector('.at-toggle')) {
      const bagian = blok.dataset.kunci.split('.').map(Number);
      const m = mesinTerkait();
      asal.appendChild(tombolKaitan(bagian[0], bagian[1], bagian[2],
        m.jumlahKaitanAyat(bagian[0], bagian[1], bagian[2]), asal));
    }

    hapusTarget = null;
    tutupHapus();
    pesan(jmlHapus + ' ayat dihapus');
  }

  // ------------------------------------------------------------
  // BERSIHKAN — saat plugin dilepas / pasal digambar ulang
  // ------------------------------------------------------------
  function bersihkan() {
    // tombol “ayat terkait” kembali PER AYAT (K55d dibatalkan 22 Sep 2026)
    const t = window.ANodesAlkitabTampilan;
    if (t && typeof t.lepasPintasan === 'function') {
      try { t.lepasPintasan('ayat-terkait'); } catch (e) {}
    }
    const isi = elBaca();
    if (isi) {
      delete isi.dataset.terkaitDaftar;
      isi.querySelectorAll('.at-pintasan-wadah').forEach(x => x.remove());
      isi.querySelectorAll('.at-hias').forEach(x => x.remove());
      isi.querySelectorAll('.at-blok').forEach(x => x.remove());
    }
    const panel = document.getElementById('at-riwayat');
    if (panel) panel.remove();
    const m = document.getElementById('at-modal-hapus');
    if (m) m.classList.remove('buka');
    blokMap = new Map();
    pasalTampil = '';
    jalurHistori = [];
    blokAktif = null;
  }

  // gambar ulang halaman baca yang sedang tampil (dipakai saat ganti cara)
  function gambarUlang() {
    const t = window.ANodesAlkitabTampilan;
    if (!t || !t.posisi) return;
    const p = t.posisi;
    bersihkan();
    t.gambarPasal(p.kitab, p.pasal, p.ayat, true);
  }

  // ------------------------------------------------------------
  // HIDUPKAN — saat plugin dipasang / halaman dibuka ulang
  // ------------------------------------------------------------
  function hidupkan() {
    daftarkanPenghias();

    // K37 — ikut mengetahui perubahan daftar ayat terpilih di halaman baca,
    //   supaya tombol “ayat terkait (n)” bisa berubah jadi pintu masuk GRUP.
    const isi = elBaca();
    if (isi && !isi.dataset.siapGrup) {
      isi.dataset.siapGrup = '1';
      isi.addEventListener('anodes-pilih-berubah', segarkanSemuaTombolGrup);
    }

    pastikanModal();
    const hal = document.getElementById('baca-alkitab');
    const t = window.ANodesAlkitabTampilan;
    if (hal && !hal.hidden && t && t.posisi) {
      hias({ kitab: t.posisi.kitab, pasal: t.posisi.pasal, isi: elBaca() });
    }
  }

  // ------------------------------------------------------------
  // DAFTARKAN PENGHIAS — dipanggil SEGERA saat modul dimuat
  //
  //   🐞 CACAT NYATA (ketemu 30 Okt 2026 saat uji K80 — flaky 4 dari 5 kali):
  //      dulu pendaftaran hanya terjadi di `hidupkan()`, yang baru jalan
  //      lewat `padaSiap()` milik mesin — yaitu SESUDAH data kaitan siap.
  //      Akibatnya, siapa pun yang menunggu `ketikaSiap()` lalu langsung
  //      menggambar pasal bisa mendapat halaman TANPA penghias
  //      (terukur: `at-hias` = 0 padahal data siap & peta berisi 21 ayat).
  //
  //   ⇒ Sekarang didaftarkan saat modul dimuat. `hias()` sendiri sudah
  //     menjaga diri (`if (!m || !m.siap()) return;`), jadi aman dipanggil
  //     sebelum data siap — ia hanya tidak melakukan apa pun.
  // ------------------------------------------------------------
  function daftarkanPenghias() {
    const t = window.ANodesAlkitabTampilan;
    if (t && typeof t.tambahPenghias === 'function') {
      try { t.tambahPenghias(hias); } catch (e) {
        console.warn('ANodes Ayat Terkait: gagal mendaftarkan penghias', e);
      }
    }
  }

  // modal hapus (gaya modal ANodes) — dibuat sekali
  function pastikanModal() {
    if (document.getElementById('at-modal-hapus')) return;
    const bg = document.createElement('div');
    bg.className = 'modal-bg at-hapus-modal';
    bg.id = 'at-modal-hapus';
    bg.innerHTML =
      '<div class="modal at-hapus-panel">' +
        '<div class="m-kepala"><span class="at-hapus-judul"></span><span class="sp"></span>' +
        '<button class="at-hapus-tutup" title="Tutup">✕</button></div>' +
        '<div class="m-isi at-hapus-isi"></div>' +
        '<div class="m-kaki at-hapus-aksi"></div>' +
      '</div>';
    document.body.appendChild(bg);
    bg.querySelector('.at-hapus-tutup').addEventListener('click', tutupHapus);
    bg.addEventListener('click', (e) => { if (e.target === bg) tutupHapus(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && bg.classList.contains('buka')) tutupHapus();
    });
  }

  // K80 — daftarkan penghias SEGERA (jangan menunggu data siap).
  //   `hias()` menjaga dirinya sendiri kalau data belum siap.
  daftarkanPenghias();

  // ⚠️ JANGAN menulis `window.ANodesAyatTerkaitTampilan = {...}` di dalam sini —
  //    blok ini sendiri yang menghasilkan nama itu. Cukup return objeknya.
  return {
    hidupkan, hias, bersihkan, gambarUlang, daftarkanPenghias,
    // kontrak cara tampil (dipakai plugin/ayat-terkait/plugin.js & js/plugin.js)
    caraTampil, simpanCaraTampil,
    // dipakai alat uji
    _bukaKaitan: buatBlok,
    _daftarKaitan: daftarKaitan,
    _pratinjau: pratinjau,
    _komit: komit,
    _bukaHapus: bukaHapus,
    get _blok() { return blokMap; },
    get _jalur() { return jalurHistori; },
    // penanda versi — K55d (22 Sep 2026)
    versi: () => VERSI
  };
})();
