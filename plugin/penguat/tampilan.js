/* ============================================================
   ANodes — plugin/penguat/tampilan.js
   TAMPILAN plugin: 🖊 Pembaca Penguat  (K47)
   ------------------------------------------------------------
   Ketentuan Bapak 19 Sep 2026:
     “ingin liat isi.. tapi plugin **bukan konek ke catatan**.. ini
      **mandiri**.. buka liat baca seperti alkitab.. mandiri saja..
      mau baca2 hasilnya”

   ⇒ MANDIRI: berkas ini TIDAK menyentuh catatan / editor / plugin lain.
     ❌ tidak menandai kata · ❌ tidak menambah panel di catatan ·
     ❌ tidak memakai .at-hias / kamus-istilah.
     ✅ hanya MEMBUKA HALAMAN SENDIRI (seukuran catatan) untuk membaca.

   Data penguat  : plugin/penguat/penguat.js   (mesin ANodesPenguat)
   Teks ayatnya  : ANodesAlkitab.ambilPasal()  (hanya DIBACA, tidak diubah)
   Halaman       : #penguat-halaman di index.html (anak body, .app sejajar)

   Cara masuk: 🧩 Gudang Plugin → 🖊 Pembaca Penguat → ▶ Buka
               (atau baris di submenu 🧩 ▼ toolbar tulis)
   ============================================================ */

window.ANodesPenguatTampilan = (function () {
  'use strict';

  const KUNCI_BACAAN = 'anodes-penguat-bacaan';   // ingat bacaan terakhir
  /* ⓘ PENANDA VERSI — ditulis di baris “Pasal n dari m” supaya Bapak bisa
     MEMBUKTIKAN berkas mana yang sedang termuat di browser (kasus K47b,
     19 Sep 2026: berkas di disk sudah baru, Chrome masih menampilkan lama).
     Kalau di kartu bacaannya tidak tertulis penanda ini → browser masih
     memakai berkas LAMA → tekan F5 (atau Ctrl+Shift+R). */
  const VERSI = 'v30Okt-k';  // K84 (30 Okt 2026) — tautan ayat DI DALAM teks penguat (3 permukaan) + 🏠 kembali ke posisi sebelumnya
  let aktif = false;
  let kitabSkrg = null;      // {no,nama,singkatan,jumlahPasal,jumlahAyat}
  let pasalSkrg = 1;
  let kataCari = '';

  /* ------------------------------------------------------------
     K52 — SAMBUNGAN RESMI untuk plugin lain (mis. 📚 Kamus Istilah)
       Pola SAMA dengan plugin Alkitab (`tambahPenghias` / `jalankanPenghias`).
       ⇒ Halaman penguat TIDAK perlu tahu plugin Kamus ada; kalau Kamus
         memasang pluginnya, dia mendaftar ke sini dan menghias sendiri.
       ❌ Tidak ada mesin baru · penghias boleh gagal tanpa merusak halaman.
     ------------------------------------------------------------ */
  const penghias = [];

  function tambahPenghias(fn) {
    if (typeof fn === 'function' && penghias.indexOf(fn) < 0) penghias.push(fn);
  }

  function jalankanPenghias(ctx) {
    penghias.forEach(fn => { try { fn(ctx); } catch (e) {} });
  }

  /* ============================================================
     K84 — 🔗 TAUTAN AYAT DI DALAM TEKS PENGUAT (30 Okt 2026)
     ------------------------------------------------------------
     Bapak: *“ada lagi mesti di revisi plugin penguat. ini juga harus di analisa
     untuk ketemui ayat alkitab.. jika ketemu di klik lompat ke alkitab ke ayat /
     kitab jika klik home kembali ke alkitab posisi sebelumnya.”*

     🔎 DIUKUR DULU (❌ bukan diduga) — 31.102 ayat penguat diperiksa dengan
        mesin Alkitab yang SUDAH ADA (`ANodesAlkitab._potongTeks`):
          • **8.136 ayat (26,2 %)** memuat rujukan ayat
          • **10.399 rujukan** · rata **1,28** per ayat · maks **6**
          • sebaran: 1 → 6.180 · 2 → 1.671 · 3 → 266 · 4 → 17 · 5 → 1 · 6 → 1
        Contoh nyata (Mazmur 23:1): *“…Bandingkan pernyataan yang sama dalam
        **Mazmur 34:10** dan **Yohanes 10:11**.”*

     ⇒ Yang kurang HANYA **pintunya** — mesin pengenal + pengait klik + pemulih
       halaman SUDAH ADA (pola **K56** halaman Sejarah). ❌ TANPA mesin baru.

     TIGA PERMUKAAN yang dibuka:
       (a) halaman 🖊 Pembaca Penguat (K47) — `.pg-komentar` + `.pg-teks`
       (b) kotak 🖊 di halaman baca Alkitab (K54) — `.pg-komentar.pg-di-baca`
       (c) kotak 🖊 di catatan (K45 i) — `.pg-catatan-kotak`

     ⚠️ `tandaiWadahHalaman()` melewati node yang sudah bertanda
        (`window.ANodesTandaKelas`) ⇒ aman dipanggil sesudah Kamus menandai.
     ⚠️ `pasangKaitAyatHalaman()` memasang pengait **sekali per wadah**
        (penanda `dataset.siapAyatHal`) ⇒ boleh dipanggil berkali-kali.
     ============================================================ */
  const JENIS_HAL = 'penguat';   // nama halaman untuk pemulih 🏠

  // tandai tautan ayat di dalam satu wadah + pasang pengait kliknya
  function tandaiAyatWadah(wadah) {
    if (!wadah) return 0;
    const MA = window.ANodesAlkitab;
    const MT = window.ANodesAlkitabTampilan;
    if (!MA || typeof MA.tandaiWadahHalaman !== 'function') return 0;
    if (!window.ANodesPlugin || !window.ANodesPlugin.dipasang('alkitab')) return 0;
    let jumlah = 0;
    try { jumlah = MA.tandaiWadahHalaman(wadah); } catch (e) {}
    // ⚠️ Penandaan saja TIDAK CUKUP — tautan bergaya tapi kliknya mati
    //    (pelajaran K52/K56c). Pengait klik WAJIB dipasang di wadah yang sama.
    if (MT && typeof MT.pasangKaitAyatHalaman === 'function') {
      try { MT.pasangKaitAyatHalaman(wadah, JENIS_HAL); } catch (e) {}
    }
    return jumlah;
  }

  // buang tanda tautan ayat dari satu wadah (sebelum halaman ditinggalkan)
  function bersihTandaAyatWadah(wadah) {
    if (!wadah) return;
    const MA = window.ANodesAlkitab;
    if (MA && typeof MA.bersihTandaWadah === 'function') {
      try { MA.bersihTandaWadah(wadah); } catch (e) {}
    }
  }

  // dipanggil plugin 📖 Alkitab saat tombol 🏠 ditekan dari halaman bacanya
  //   ⇒ tampilkan lagi HALAMAN PENGUAT (posisi gulir dipulihkan)
  function pulihDariAlkitab(info) {
    const hal = halaman();
    if (!hal) return false;
    document.querySelectorAll('body > .app').forEach(a => { a.hidden = true; });
    hal.hidden = false;
    aktif = true;
    const isi = el('pg-isi');
    if (isi && info && typeof info.gulir === 'number') isi.scrollTop = info.gulir;
    return true;
  }

  // daftarkan pemulih halaman penguat (dipanggil saat halaman dibuka)
  function daftarPemulih() {
    const MT = window.ANodesAlkitabTampilan;
    if (MT && typeof MT.daftarPemulihHalaman === 'function') {
      try { MT.daftarPemulihHalaman(JENIS_HAL, pulihDariAlkitab); return true; } catch (e) {}
    }
    return false;
  }

  /* ============================================================
     K54 — 🖊 PENGUAT DITEMPATKAN PADA ALKITAB (22 Sep 2026)
     ------------------------------------------------------------
     Bapak 21 Sep 2026: “penguat ditempatkan pada alkitab” — lalu dipastikan:
       1. (b) TOMBOL KECIL `🖊 penguat` per ayat — diklik baru terbuka
          · “semua dan klik lagi tertutup untuk semua”
       2. Tombol HANYA muncul di ayat yang PUNYA penguat
       3. Halaman 🖊 Pembaca Penguat (K47) tetap ada seperti sekarang

     ⚠️⚠️ BENTUK YANG BENAR (Bapak menegaskan 22 Sep 2026 — versi pertama
        saya SALAH: saya buat “hanya ayat yang ditekan”):
          *“karena klik penguat .. sebelum saya minta klik penguat..
            **semua penguat tampil** dan klik lagi ayat penguat **hide**”*
        ⇒ tekan 🖊 sekali = **SELURUH** penguat pasal ini TAMPIL
          tekan 🖊 lagi   = **SELURUH** penguat HIDE
        ⇒ SATU keadaan `semuaTerbuka` untuk seluruh pasal
          (❌ bukan satu ayat — semua tombol melakukan hal yang sama)
     ❌ TANPA mesin baru — memakai sambungan resmi tambahPenghias()
        (pola SAMA dengan 🔗 Ayat Terkait & 📚 Kamus Istilah).
       Plugin dilepas ⇒ seluruh tombol & kotak ikut hilang (bersihkan()).
     ============================================================ */
  let semuaTerbuka = false;     // true = SELURUH penguat pasal ini sedang tampil
  let pasalPenguat = '';        // penanda "kitab.pasal" yang sedang dihias

  // tutup SEMUA kotak penguat yang sedang terbuka — wadah TOMBOL dibiarkan
  // ⚠️ Ini dipakai saat tombol ditekan. Kalau memakai `bersihkanBaca()
  //    (yang membuang wadah `.pg-sisip`), wadah tombol yang SEDANG diklik
  //    ikut terhapus → kotak penguat tidak pernah bisa dibuat.
  function tutupKotakPenguat(isi) {
    if (!isi) return;
    isi.querySelectorAll('.pg-komentar.pg-di-baca').forEach(x => x.remove());
    isi.querySelectorAll('.pg-sisip.terbuka').forEach(w => {
      w.classList.remove('terbuka');
      const b = w.querySelector('.pg-baca-toggle');
      if (b) b.classList.remove('aktif');
    });
    semuaTerbuka = false;
  }

  // kosongkan SELURUH hiasan penguat dari halaman baca (tombol + kotak)
  function bersihkanBaca(isi) {
    if (!isi) return;
    isi.querySelectorAll('.pg-sisip').forEach(x => x.remove());
    isi.querySelectorAll('.ayat-baca[data-pg-hias]').forEach(b => delete b.dataset.pgHias);
    semuaTerbuka = false;
  }

  // penghias LAIN (ayat terkait / kamus) — ❌ tanpa hiasAyatBaca sendiri,
  //   supaya kotak yang baru dibuka TIDAK ikut terhapus.
  function jalankanPenghiasLain(ctx) {
    penghias.forEach(fn => {
      if (fn === hiasAyatBaca) return;
      try { fn(ctx); } catch (e) {}
    });
  }

  // dipanggil plugin Alkitab tiap selesai menggambar satu pasal
  //   K55d DIBATALKAN 22 Sep 2026 — Bapak: *“konsep awal itu sudah benar seharusnya
  //   secara konsep tidak berubah.. tujuan saya hanya mau merapihkan menu”*
  //   ⇒ tombol 🖊 KEMBALI **PER AYAT** (setiap ayat yang punya penguat dapat tombol).
  //   Merapikan menu akan dikerjakan dengan cara LAIN (tanpa mengubah konsep).
  function hiasAyatBaca(ctx) {
    if (!ctx || !ctx.isi) return;
    if (!pluginAktif()) return;              // plugin belum dipasang → tidak ada tombol
    const m = mesin();
    if (!m || typeof m.siap !== 'function' || !m.siap()) return;

    const kunci = ctx.kitab + '.' + ctx.pasal;
    // Pasal yang SAMA & barisnya MASIH UTUH → jangan diganggu sama sekali
    //   (tanpa penjaga ini, kotak penguat yang sedang terbuka bisa terhapus).
    // ⚠️ Penanda dipasang di BARIS AYAT, bukan di wadah: `gambarPasal()`
    //    mengganti isi wadah (`innerHTML=''`) tetapi atribut wadah tetap —
    //    jadi penanda di wadah TIDAK bisa mendeteksi bahwa isinya sudah baru.
    const barisPertama = ctx.isi.querySelector('.ayat-baca[data-ayat]');
    if (barisPertama && barisPertama.dataset.pgHias === kunci) return;

    semuaTerbuka = false;
    pasalPenguat = kunci;
    ctx.isi.querySelectorAll('.pg-sisip').forEach(x => x.remove());

    const peta = m.komentarPasal(ctx.kitab, ctx.pasal);
    ctx.isi.querySelectorAll('.ayat-baca[data-ayat]').forEach(baris => {
      const no = Number(baris.dataset.ayat);
      if (baris.dataset.pgHias === undefined) baris.dataset.pgHias = kunci;
      const teks = peta[no];
      if (!teks) return;                     // ayat TANPA penguat → tanpa tombol
      baris.appendChild(wadahPenguat(ctx, no, teks, ctx.isi));
    });
  }

  // satu tombol per ayat — SEMUA tombol melakukan hal yang SAMA:
  //   tekan sekali  ⇒ SELURUH penguat pasal ini TAMPIL
  //   tekan lagi    ⇒ SELURUH penguat HIDE
  // (Bapak 22 Sep 2026: *“klik penguat.. semua penguat tampil dan klik lagi
  //  ayat penguat hide”* — jadi BUKAN hanya ayat yang ditekan.)
  function wadahPenguat(ctx, no, teks, isi) {
    const wadah = document.createElement('div');
    wadah.className = 'pg-sisip';
    wadah.dataset.ayat = String(no);

    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pg-baca-toggle';
    // 🎛 I-15 GAYA C (22 Sep 2026) — Bapak memilih gaya **C**:
    //   *“yg penting satu baris / sejajar.. itu lebih rapih terlihat..
    //    icon itu bisa mewakili artinya .. jadi pilihan saya C”*
    //   ⇒ tombol cukup **ikon 🖊** (kata ”penguat” dibuang supaya sejajar
    //     dengan tombol ayat terkait & tidak memakan ruang ke bawah).
    //     ⚠️ Arti tetap di `title` (sentuh-tahan) — dan pada MULAI DIPAKAI
    //     ikon ini ditampilkan penuh (lihat CSS `.pg-baca-toggle`)
    b.textContent = '🖊';
    b.title = '🖊 Penguat — tampilkan SEMUA penguat pasal ini (tekan lagi untuk menyembunyikan)';
    b.setAttribute('aria-label', 'penguat');
    b.addEventListener('click', () => {
      saatTombolPenguat(isi, ctx.kitab, ctx.pasal);
    });

    wadah.appendChild(b);
    return wadah;
  }

  /* “semua dan klik lagi tertutup untuk semua” (Bapak 21 Sep 2026) —
     bentuk yang benar (Bapak menegaskan 22 Sep 2026):
       • tekan 🖊 sekali ⇒ **SELURUH** kotak penguat pasal ini TAMPIL
       • tekan 🖊 lagi   ⇒ **SELURUH** kotak penguat HIDE
     ⇒ satu keadaan `semuaTerbuka` untuk seluruh pasal. */
  function saatTombolPenguat(isi, kitab, pasal) {
    if (!isi) return;

    if (semuaTerbuka) {          // sedang tampil semua ⇒ sembunyikan semua
      tutupKotakPenguat(isi);
      return;
    }

    tutupKotakPenguat(isi);      // bersihkan dulu (kalau ada sisa)
    semuaTerbuka = true;

    // tampilkan penguat SELURUH ayat yang punya tombol di pasal ini
    isi.querySelectorAll('.pg-sisip').forEach(wadah => {
      const no = Number(wadah.dataset.ayat);
      const teks = teksPenguat(kitab, pasal, no);
      if (!teks) return;
      const kotak = document.createElement('div');
      kotak.className = 'pg-komentar pg-di-baca';   // latar krem, tanpa garis cokelat
      kotak.textContent = '🖊 ' + teks;
      wadah.appendChild(kotak);
      wadah.classList.add('terbuka');
      const tb = wadah.querySelector('.pg-baca-toggle');
      if (tb) tb.classList.add('aktif');
    });

    // K52/K54 — beri kesempatan plugin lain menandai isi kotak yang baru tampil
    //   (mis. 📚 Kamus Istilah menandai kata istilah di dalam teks penguat).
    //   ⚠️ Dipakai JALUR RESMI halaman baca (`jalankanPenghias`) supaya kamus
    //      ikut jalan — kamus mendaftarkan `hiasAyat` ke ALKITAB (halaman baca),
    //      ❌ bukan ke plugin penguat. Aman karena `hiasAyatBaca` punya penjaga
    //      idempoten (baris sudah dihiasi pasal ini → langsung keluar), jadi
    //      kotak yang baru dibuka TIDAK ikut terhapus.
    const t = window.ANodesAlkitabTampilan;
    if (t && typeof t.jalankanPenghias === 'function') {
      t.jalankanPenghias({ kitab, pasal, isi });
    }
    jalankanPenghiasLain({ kitab, pasal, isi });

    // 🆕 K84 — tautan ayat DI DALAM kotak penguat bisa diklik (lompat ke Alkitab).
    //   ⚠️ Dipanggil SESUDAH penghias lain supaya node bertanda dilewati.
    isi.querySelectorAll('.pg-komentar.pg-di-baca').forEach(k => tandaiAyatWadah(k));
  }

  // sakelar dari LUAR (tombol 🖊 di navbar halaman baca) — sama persis dengan
  //   menekan tombol `🖊 penguat` di bawah ayat.
  function sakelarSemuaPenguat() {
    const isi = document.getElementById('baca-isi');
    if (!isi) return;
    const t = window.ANodesAlkitabTampilan;
    if (!t || !t.posisi) return;
    saatTombolPenguat(isi, t.posisi.kitab, t.posisi.pasal);
  }

  // buka halaman baca Alkitab tepat pada kitab/pasal yang sedang dibaca di sini
  function bukaLihatAlkitab() {
    const t = window.ANodesAlkitabTampilan;
    if (!t || typeof t.bukaHalaman !== 'function') {
      pesan('💡 Pasang plugin 📖 Alkitab dahulu supaya bisa melihat di halaman baca');
      return;
    }
    const noKitab = kitabSkrg ? kitabSkrg.no : 1;
    const noPasal = pasalSkrg || 1;
    const a = mesinAlkitab();
    const tampilkan = () => {
      t.bukaHalaman();
      setTimeout(() => { if (t.gambarPasal) t.gambarPasal(noKitab, noPasal, 0, true); }, 60);
    };
    bersihkan();                                  // tinggalkan halaman penguat
    if (a && typeof a.saatSiap === 'function') a.saatSiap(tampilkan);
    else tampilkan();
  }

  /* ------------------------------------------------------------
     Alat kecil
     ------------------------------------------------------------ */
  function el(id) { return document.getElementById(id); }

  function halaman() { return el('penguat-halaman'); }

  function pluginAktif() {
    return !!(window.ANodesPlugin && window.ANodesPlugin.dipasang
              && window.ANodesPlugin.dipasang('penguat'));
  }

  function pesan(t, ms) {
    // pakai #toast yang sudah ada di index.html (gaya sama dengan editor)
    const kotak = el('toast');
    if (kotak) {
      kotak.textContent = t;
      kotak.classList.add('tampil');
      clearTimeout(window.__pgPesan);
      window.__pgPesan = setTimeout(() => kotak.classList.remove('tampil'), ms || 2200);
      return;
    }
    console.log('🖊 ' + t);
  }

  function mesin() { return window.ANodesPenguat; }

  // teks penguat satu ayat (dari data penguat) — '' kalau tidak ada
  function teksPenguat(kitab, pasal, ayat) {
    const m = mesin();
    if (!m || typeof m.siap !== 'function' || !m.siap()) return '';
    try {
      const peta = m.komentarPasal(kitab, pasal);
      return peta[ayat] || '';
    } catch (e) { return ''; }
  }

  function mesinAlkitab() { return window.ANodesAlkitab; }

  // jalankan tugas begitu data penguat siap (jangan diam-diam)
  function saatSiap(tugas) {
    const m = mesin();
    if (!m) { pesan('⚠️ Mesin penguat belum ada'); return; }
    if (!pluginAktif()) { pesan('💡 Pasang plugin 🖊 Pembaca Penguat dahulu'); return; }
    if (m.siap()) { tugas(); return; }
    pesan('⏳ Menyiapkan data penguat…');
    m.saatSiap(tugas);
  }

  // teks ayat dari plugin Alkitab (kalau terpasang & datanya siap)
  function teksAyat(noKitab, pasal, ayat) {
    const a = mesinAlkitab();
    if (!a || typeof a.siap !== 'function' || !a.siap()) return '';
    try {
      const a2 = a.ambilAyat(noKitab, pasal, ayat);
      return a2 ? String(a2.teks || '') : '';
    } catch (e) { return ''; }
  }

  /* ------------------------------------------------------------
     Ingat bacaan terakhir
     ------------------------------------------------------------ */
  function simpanBacaan() {
    try {
      localStorage.setItem(KUNCI_BACAAN, JSON.stringify({
        kitab: kitabSkrg ? kitabSkrg.no : null, pasal: pasalSkrg
      }));
    } catch (e) {}
  }

  function bacaBacaanTerakhir() {
    try {
      const d = JSON.parse(localStorage.getItem(KUNCI_BACAAN) || 'null');
      if (d && d.kitab) return d;
    } catch (e) {}
    return null;
  }

  /* ------------------------------------------------------------
     Halaman: buka & tutup
     ------------------------------------------------------------ */
  function sembunyikanLain() {
    document.querySelectorAll('body > .app').forEach(a => {
      if (a !== halaman()) a.hidden = true;
    });
  }

  function bukaHalaman() {
    const hal = halaman();
    if (!hal) { pesan('⚠️ Halaman penguat belum ada di index.html'); return false; }
    sembunyikanLain();
    hal.hidden = false;
    hal.scrollTop = 0;
    aktif = true;
    return true;
  }

  function bersihkan() {
    aktif = false;
    // K45 i — buang hiasan penguat DI CATATAN (tombol 🖊 + kotak)
    catatanHidup = false;
    bersihkanCatatan();
    // 🆕 K84 — buang tanda tautan ayat dari halaman penguat (sebelum ditinggalkan)
    bersihTandaAyatWadah(el('pg-isi'));
    const ed = window.ANodesEditor;
    if (ed && typeof ed.lepasPenghiasTanda === 'function') {
      try { ed.lepasPenghiasTanda(hiasCatatan); } catch (e) {}
    }
    const hal = halaman();
    if (hal) hal.hidden = true;
    // K54/K55d — buang hiasan penguat dari halaman baca:
    //   • kotak penguat yang sedang terbuka
    //   • sisa wadah tombol versi lama (K54)
    //   • tombol 🖊 di BAR PINTASAN (daftar bar milik plugin Alkitab)
    const isi = document.getElementById('baca-isi');
    // 🆕 K84 — buang tanda tautan ayat dari kotak penguat di halaman baca
    if (isi) isi.querySelectorAll('.pg-komentar.pg-di-baca').forEach(k => bersihTandaAyatWadah(k));
    bersihkanBaca(isi);
    if (isi) {
      isi.querySelectorAll('.pg-komentar.pg-di-baca').forEach(x => x.remove());
      isi.querySelectorAll('.pg-pintasan-toggle').forEach(x => x.remove());
    }
    // pasal yang sudah ditandai “sudah dihias” untuk pasal ini → lupakan,
    //   supaya plugin dipasang ulang tetap menggambar tombol
    if (isi) {
      isi.querySelectorAll('.ayat-baca[data-pg-hias]').forEach(b => delete b.dataset.pgHias);
    }
    const t = window.ANodesAlkitabTampilan;
    if (t && typeof t.lepasPintasan === 'function') {
      try { t.lepasPintasan('penguat'); } catch (e) {}
    }
  }

  function tutupHalaman() {
    // catatan dikembalikan seperti semula (mandiri: tidak ada yang diubah)
    bersihkan();
    const utama = el('app-utama');
    if (utama) utama.hidden = false;
  }

  /* ------------------------------------------------------------
     Daftar kitab yang PUNYA penguat
     ------------------------------------------------------------ */
  function isiPilihKitab() {
    const sel = el('pg-kitab');
    if (!sel) return;
    const daftar = mesin().daftarKitab();
    sel.innerHTML = '';
    daftar.forEach(k => {
      const o = document.createElement('option');
      o.value = String(k.no);
      o.textContent = k.nama;
      o.title = k.nama + ' — ' + k.jumlahAyat + ' ayat berkomentar';
      sel.appendChild(o);
    });
    if (kitabSkrg) sel.value = String(kitabSkrg.no);
  }

  function isiPilihPasal(noKitab) {
    const sel = el('pg-pasal');
    if (!sel) return;
    const daftar = mesin().daftarPasal(noKitab);
    sel.innerHTML = '';
    daftar.forEach(p => {
      const o = document.createElement('option');
      o.value = String(p);
      const n = Object.keys(mesin().komentarPasal(noKitab, p)).length;
      o.textContent = p + ' (' + n + ')';
      o.title = 'Pasal ' + p + ' — ' + n + ' ayat berkomentar';
      sel.appendChild(o);
    });
    sel.value = String(pasalSkrg);
    // keterangan jumlah pasal supaya jelas (mis. "Matius punya 28 pasal")
    const nm = kitabSkrg ? kitabSkrg.nama : '';
    sel.title = 'Pilih pasal — ' + nm + ' punya ' + daftar.length + ' pasal';
  }

  function segarkanTombol() {
    const daftar = mesin() ? mesin().daftarPasal(kitabSkrg ? kitabSkrg.no : 0) : [];
    const i = daftar.indexOf(Number(pasalSkrg));
    const prev = el('pg-prev'), next = el('pg-next');
    if (prev) prev.disabled = (i <= 0);
    if (next) next.disabled = (i < 0 || i >= daftar.length - 1);
  }

  /* ------------------------------------------------------------
     GAMBAR satu pasal — daftar ayat + kotak penguat (krem)
     ------------------------------------------------------------ */
  function gambarPasal() {
    const isi = el('pg-isi');
    if (!isi || !kitabSkrg) return;

    const peta = mesin().komentarPasal(kitabSkrg.no, pasalSkrg);
    const noAyat = Object.keys(peta).map(Number).sort((a, b) => a - b);

    isi.innerHTML = '';

    const judul = document.createElement('div');
    judul.className = 'pg-judul';
    judul.textContent = kitabSkrg.nama + ' ' + pasalSkrg;
    isi.appendChild(judul);

    // ⓘ PENEGAS PASAL — penting supaya tidak tertukar dengan deret NOMOR AYAT
    //    di bawahnya (Bapak 19 Sep 2026: "baru sampai 25, seharusnya 28 pasal").
    const posisi = document.createElement('div');
    posisi.className = 'pg-posisi';
    const semuaPasal = mesin().daftarPasal(kitabSkrg.no);
    posisi.textContent = 'Pasal ' + pasalSkrg + ' dari ' + semuaPasal.length +
      ' pasal — ganti pasal lewat daftar ▾ di bar atas  ·  ' + VERSI;
    isi.appendChild(posisi);

    const meta2 = document.createElement('div');
    meta2.className = 'pg-meta';
    const jumlah = noAyat.length;
    const totalPasal = (function () {
      try {
        const a = mesinAlkitab();
        if (a && a.siap && a.siap()) {
          const p = a.ambilPasal(kitabSkrg.no, pasalSkrg);
          return p && p.ayat ? p.ayat.length : 0;
        }
      } catch (e) {}
      return 0;
    })();
    meta2.textContent = jumlah + ' ayat berkomentar' +
      (totalPasal ? ' dari ' + totalPasal + ' ayat' : '') +
      (kataCari ? ' · hasil saring: “' + kataCari + '”' : '');
    isi.appendChild(meta2);

    if (!noAyat.length) {
      const kosong = document.createElement('p');
      kosong.className = 'pg-kosong';
      kosong.textContent = 'Belum ada penguat untuk pasal ini.';
      isi.appendChild(kosong);
      return;
    }

    // label penegas: deret angka di bawah ini = NOMOR AYAT, bukan nomor pasal
    const lblAyat = document.createElement('div');
    lblAyat.className = 'pg-lbl-ayat';
    lblAyat.textContent = 'Ayat — klik untuk menuju penguatnya:';
    isi.appendChild(lblAyat);

    const daftar = document.createElement('div');
    daftar.className = 'pg-daftar-ayat';
    noAyat.forEach(n => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pg-no';
      b.textContent = String(n);
      b.title = 'Lihat penguat ayat ' + n;
      b.addEventListener('click', () => {
        const t = el('pg-a' + n);
        if (t) {
          t.scrollIntoView({ behavior: 'smooth', block: 'center' });
          t.classList.add('pg-sorot');
          setTimeout(() => t.classList.remove('pg-sorot'), 1500);
        }
      });
      daftar.appendChild(b);
    });
    isi.appendChild(daftar);

    noAyat.forEach(n => {
      const baris = document.createElement('div');
      baris.className = 'pg-ayat';
      baris.id = 'pg-a' + n;

      const no = document.createElement('span');
      no.className = 'pg-nomor';
      no.textContent = String(n);
      baris.appendChild(no);

      const badan = document.createElement('div');
      badan.className = 'pg-badan';

      // 1) teks ayat (kalau plugin Alkitab terpasang & datanya siap)
      const teks = teksAyat(kitabSkrg.no, pasalSkrg, n);
      if (teks) {
        const a = document.createElement('p');
        a.className = 'pg-teks';
        a.textContent = teks;
        badan.appendChild(a);
      }

      // 2) kotak penguat (krem + garis cokelat — sama gaya lab3)
      const kotak = document.createElement('div');
      kotak.className = 'pg-komentar';
      kotak.textContent = '🖊 ' + peta[n];
      badan.appendChild(kotak);

      baris.appendChild(badan);
      isi.appendChild(baris);
    });

    // K52 — beri kesempatan plugin lain (📚 Kamus Istilah) menandai teks
    //   AYAT & teks PENGUAT di halaman ini. Dipanggil SETELAH seluruh baris
    //   selesai dibuat, supaya penandaan mencakup semuanya sekaligus.
    jalankanPenghias({ kitab: kitabSkrg.no, pasal: pasalSkrg, isi: isi });

    // 🆕 K84 — tautan ayat DI DALAM teks penguat (dan teks ayat) bisa diklik.
    //   ⚠️ Dipanggil SESUDAH `jalankanPenghias` supaya node yang sudah ditandai
    //      Kamus dilewati (mesin Alkitab melewati `window.ANodesTandaKelas`).
    tandaiAyatWadah(isi);
  }

  /* ------------------------------------------------------------
     Pindah kitab / pasal
     ------------------------------------------------------------ */
  function bukaKitab(no) {
    const k = mesin().daftarKitab().find(x => Number(x.no) === Number(no));
    if (!k) return;
    kitabSkrg = k;
    const daftar = mesin().daftarPasal(k.no);
    pasalSkrg = daftar.length ? daftar[0] : 1;
    isiPilihKitab();
    isiPilihPasal(k.no);
    gambarPasal();
    segarkanTombol();
    simpanBacaan();
  }

  function bukaPasal(p) {
    const daftar = mesin().daftarPasal(kitabSkrg.no);
    const n = Number(p);
    if (!daftar.includes(n)) return;
    pasalSkrg = n;
    const sel = el('pg-pasal');
    if (sel) sel.value = String(n);
    gambarPasal();
    segarkanTombol();
    const hal = halaman();
    if (hal) hal.scrollTop = 0;
    simpanBacaan();
  }

  function geserPasal(arah) {
    const daftar = mesin().daftarPasal(kitabSkrg.no);
    const i = daftar.indexOf(Number(pasalSkrg));
    const j = i + arah;
    if (j >= 0 && j < daftar.length) bukaPasal(daftar[j]);
  }

  /* ------------------------------------------------------------
     CARI isi penguat (mandiri — tidak menyentuh catatan)
     ------------------------------------------------------------ */
  function mulaiCari() {
    const inp = el('pg-cari');
    const kata = inp ? inp.value.trim() : '';
    kataCari = kata;
    const kotak = el('pg-hasil');
    if (!kotak) return;

    if (!kata) {
      kotak.hidden = true;
      kotak.innerHTML = '';
      gambarPasal();
      return;
    }

    const hasil = mesin().cari(kata, 200);
    kotak.innerHTML = '';
    kotak.hidden = false;

    const kepala = document.createElement('div');
    kepala.className = 'pg-hasil-kepala';
    kepala.textContent = hasil.length
      ? hasil.length + ' penguat memuat “' + kata + '”' + (hasil.length >= 200 ? ' (ditampilkan 200 pertama)' : '')
      : 'Tidak ada penguat yang memuat “' + kata + '”';
    kotak.appendChild(kepala);

    hasil.forEach(h => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pg-hasil-baris';
      const nama = document.createElement('span');
      nama.className = 'pg-hasil-nama';
      nama.textContent = (h.nama.indexOf('Mazmur') === 0 ? 'Mzm' : h.nama.slice(0, 3)) +
                         ' ' + h.pasal + ':' + h.ayat;
      const cuplik = document.createElement('span');
      cuplik.className = 'pg-hasil-cuplik';
      cuplik.textContent = h.teks.length > 90 ? h.teks.slice(0, 90) + '…' : h.teks;
      b.appendChild(nama);
      b.appendChild(cuplik);
      b.addEventListener('click', () => {
        kataCari = '';
        const inp2 = el('pg-cari');
        if (inp2) inp2.value = '';
        kotak.hidden = true;
        bukaKitab(h.no);
        bukaPasal(h.pasal);
        setTimeout(() => {
          const t = el('pg-a' + h.ayat);
          if (t) {
            t.scrollIntoView({ behavior: 'smooth', block: 'center' });
            t.classList.add('pg-sorot');
            setTimeout(() => t.classList.remove('pg-sorot'), 2500);
          }
        }, 120);
      });
      kotak.appendChild(b);
    });
  }

  /* ============================================================
   K45 i (23 Sep 2026) — 🖊 PENGUAT YANG MENEMPEL DI CATATAN
   ------------------------------------------------------------
   Permintaan Bapak (papan B): penguat terbuka **di dalam catatan**
   (pola plugin 📚 Kamus), ❌ bukan halaman mandiri (K47 = sudah ada)
   dan ❌ bukan halaman baca Alkitab (K54 = sudah ada).

   📐 BENTUK YANG DIPAKAI — **seperti tombol `[↗ full]` milik Kamus (K43)**:
     • tombol kecil `🖊` menemani tiap **tautan ayat** di catatan
     • ditekan ⇒ kotak penguat ayat itu terbuka **di bawah barisnya**
     • ditekan lagi ⇒ tertutup · tombol `✕` = tutup SEMUA
     • ❌ bukan panel · ❌ bukan halaman baru — catatan tetap di tempatnya

   ⚠️ Tombol/kotak ini **hanya tampilan**: tidak ikut tersimpan
      (dibersihkan `bersihSemuaTanda()` di js/editor.js).
   ⚠️ Memakai **sambungan resmi** `ANodesEditor.tambahPenghiasTanda()` —
      editor ❌ tidak perlu tahu plugin 🖊 ada; plugin ❌ tidak menyentuh
      penandaan ayat/istilah milik plugin lain.
   ============================================================ */
  let catatanHidup = false;      // true = 🖊 di catatan sedang dipakai
  const KUNCI_CARA_CATATAN = 'anodes-penguat-catatan';

  // cara tampil di catatan: 'tombol' (bawaan) ⇄ 'tutup'
  function caraCatatan() {
    try { return localStorage.getItem(KUNCI_CARA_CATATAN) === 'tutup' ? 'tutup' : 'tombol'; }
    catch (e) { return 'tombol'; }
  }
  function simpanCaraCatatan(c) {
    const tutupCara = (c === 'tutup');
    try { localStorage.setItem(KUNCI_CARA_CATATAN, (tutupCara ? 'tutup' : 'tombol')); }
    catch (e) {}
    /* ⚠️ K45 i — “matikan tombol 🖊” WAJIB sekaligus MEMBUANG tombol yang sudah
       terpasang. Kalau hanya menyimpan pilihan, tombol lama tetap tertinggal
       di catatan (cacat nyata, ketemu saat uji: “mati 2 · hidup 2”). */
    if (tutupCara) {
      catatanHidup = false;
      bersihkanCatatan();
    } else {
      catatanHidup = true;
    }
  }

  function editorEl() { return el('editor'); }

  // baca ref satu tautan ayat.
  //   ⚠️ Bentuk NYATA `data-ref` (diukur, ❌ bukan diduga):
  //      { no:43, nama:"Yohanes", singkatan:"Yoh", pasal:3, ayat1:16, ayat2:16 }
  //      ⇒ nomor kitab = `no` · ayat awal = `ayat1` · ayat akhir = `ayat2`.
  //      (Versi pertama saya menebak `kitab`/`ayat`/`akhir` ⇒ selalu null,
  //       sehingga tidak ada tombol yang terpasang. Pelajaran: BACA data asli.)
  function refTautan(sp) {
    try {
      const d = JSON.parse(sp.dataset.ref || 'null');
      if (!d) return null;
      const kitab = Number(d.no || d.kitab || 0);
      const pasal = Number(d.pasal || 0);
      if (!kitab || !pasal) return null;
      const a1 = Number(d.ayat1 || d.ayat || 0);
      const a2 = Number(d.ayat2 || d.akhir || a1);
      return { kitab, pasal, ayat: a1, akhir: (a2 >= a1 ? a2 : a1),
               nama: String(d.nama || d.singkatan || '') };
    } catch (e) { return null; }
  }

  // buang SELURUH hiasan penguat dari catatan (tombol + kotak)
  function bersihkanCatatan() {
    const ed = editorEl();
    if (!ed) return;
    ed.querySelectorAll('.pg-catatan-sisip').forEach(x => x.remove());
    ed.querySelectorAll('.pg-catatan-kotak').forEach(x => x.remove());
    ed.querySelectorAll('span.ay-link[data-pg-catatan]').forEach(sp => {
      delete sp.dataset.pgCatatan;
    });
  }

  function tutupKotakCatatan() {
    const ed = editorEl();
    if (!ed) return;
    ed.querySelectorAll('.pg-catatan-kotak').forEach(x => x.remove());
    ed.querySelectorAll('.pg-catatan-toggle.aktif').forEach(b => b.classList.remove('aktif'));
  }

  /* 🆕 K70 (5 Okt 2026) — REKONSILIASI hiasan (❌ bukan “bongkar semua”).
     Tujuan: DOM **tidak bergerak** kalau tidak perlu ⇒ **kursor tidak melompat**
     saat penandaan diulang (terukur: 1 dari 3 ketikan melompat pada versi lama).

     Tiga hal yang dibuang — HANYA kalau memang yatim/tidak cocok:
       1. tombol yang ayahnya sudah BUKAN `span.ay-link` (sisa dari DOM lama),
       2. tombol yang ayat/pasal/kitabnya tidak cocok dengan tautan di atasnya,
       3. tombol rangkap (lebih dari satu) pada satu tautan.
     Kotak `pg-catatan-kotak` ❌ TIDAK disentuh (yatim-nya dibereskan di sini). */
  function rekonsiliasiCatatan() {
    const ed = editorEl();
    if (!ed) return;
    // 1 & 2 — cocokkan tombol dengan tautan induknya
    ed.querySelectorAll('.pg-catatan-sisip[data-kitab]').forEach(w => {
      const induk = w.previousElementSibling;
      let cocok = !!(induk && induk.classList && induk.classList.contains('ay-link'));
      if (cocok) {
        const r = refTautan(induk);
        cocok = !!(r && String(r.kitab) === w.dataset.kitab && String(r.pasal) === w.dataset.pasal);
      }
      if (!cocok) {
        // kalau kotak penguat milik tombol ini sedang terbuka, ikut dibuang
        const kotak = w.nextElementSibling;
        if (kotak && kotak.classList && kotak.classList.contains('pg-catatan-kotak')) kotak.remove();
        const tautanYatim = induk;
        w.remove();
        if (tautanYatim && tautanYatim.classList && tautanYatim.classList.contains('ay-link')) {
          delete tautanYatim.dataset.pgCatatan;
        }
      }
    });
    // 3 — buang rangkap: satu tautan hanya boleh punya SATU tombol
    ed.querySelectorAll('span.ay-link[data-pg-catatan]').forEach(sp => {
      const anak = [];
      let n = sp.nextElementSibling;
      while (n && n.classList && n.classList.contains('pg-catatan-sisip')) { anak.push(n); n = n.nextElementSibling; }
      for (let i = 1; i < anak.length; i++) anak[i].remove();
    });
  }

  /* Buang tombol 🖊 yang menempel SETELAH satu tautan — dipakai saat tautan
     itu baru saja dibuat ulang oleh penandaan (penanda `data-pg-catatan`-nya
     hilang) ⇒ tombol lamanya jadi yatim dan akan MENUMPUK kalau tidak dibuang.
     ⚠️ Dipanggil HANYA untuk tautan yang kehilangan penanda — tautan yang
        masih punya tombol ❌ tidak disentuh (supaya kursor tidak melompat). */
  function buangSisipSetelah(sp) {
    let n = sp.nextElementSibling;
    while (n && n.classList && n.classList.contains('pg-catatan-sisip')) {
      const lanjut = n.nextElementSibling;
      // kotak penguat yang ikut menempel juga dibuang
      if (lanjut && lanjut.classList && lanjut.classList.contains('pg-catatan-kotak')) lanjut.remove();
      n.remove();
      n = lanjut;
    }
  }

  /* Penghias tanda — dipanggil editor SETIAP kali tanda di catatan selesai
     digambar. ⚠️ WAJIB idempoten: boleh dipanggil berkali-kali, tombol
     tidak boleh menumpuk (penanda `data-pg-catatan` per tautan). */
  function hiasCatatan() {
    if (!catatanHidup) return;                       // 🖊 catatan tidak dipakai
    if (!pluginAktif()) return;
    const m = mesin();
    if (!m || typeof m.siap !== 'function' || !m.siap()) return;
    if (caraCatatan() !== 'tombol') return;
    const ed = editorEl();
    if (!ed) return;
    // jangan sentuh mode baca (“📖 Rapi”) — isinya hasil olahan, bukan isi asli
    if (ed.isContentEditable === false || ed.classList.contains('mode-baca')) return;

    /* ⚠️⚠️ CACAT NYATA (ketemu saat menguji 23 Sep 2026 — jangan diulang):
       Saat penandaan ayat diulang (mis. sesudah F5 atau ganti catatan),
       `span.ay-link` DIGANTI dengan elemen BARU ⇒ penanda `data-pg-catatan`
       ikut hilang, sedangkan tombol lama TIDAK pernah dibuang
       ⇒ tombol **menumpuk** (terukur: 1 tautan = 4 tombol 🖊).

       ⇒ Karena itu kita **bersihkan dulu** seluruh hiasan kita, baru pasang
         ulang. Hiasan ini hanya tampilan, jadi aman.
       ⚠️ Konsekuensi yang DITERIMA: kotak yang sedang terbuka akan tertutup
          saat penandaan diulang. Penandaan hanya dijalankan saat catatan
          dibuka/diganti — bukan tiap ketikan — jadi tidak mengganggu. */

    /* 🆕 K70 (5 Okt 2026) — 🔴 PERBAIKAN “CURSOR LOMPAT” (cacat terukur:
        1 dari 3 ketikan melompat saat penandaan catatan NYALA).
        Sebab: `bersihkanCatatan()` membuang **SELURUH** tombol 🖊 (termasuk yang
        SEDANG berada tepat di sebelah kursor) lalu memasangnya kembali. Tombol
        itu `contenteditable="false"` — membuang/menaruh elemen seperti itu
        **MENGHANCURKAN posisi kursor** (kursor pindah ke tepi node terdekat).

        ⇒ Ganti “bongkar semua” menjadi **REKONSILIASI**: tombol yang sudah
          benar **DIBIARKAN** (❌ tidak disentuh), hanya yang **tidak cocok /
          yatim** yang diperbaiki. Kalau tidak ada yang berubah, DOM tidak
          bergerak sama sekali ⇒ kursor aman. */
    rekonsiliasiCatatan();

    ed.querySelectorAll('span.ay-link[data-ref]').forEach(sp => {
       if (sp.dataset.pgCatatan === '1') return;      // sudah punya tombol yang benar
       // 🆕 K70 — tautan BARU (hasil penandaan ulang) bisa meninggalkan tombol
       //   LAMA yang masih menempel di belakangnya (penandanya hilang bersama
       //   elemen lama). Buang dulu tombol yatim itu ⇒ ❌ jangan sampai menumpuk.
       buangSisipSetelah(sp);
      const r = refTautan(sp);
      if (!r) return;
      // ayat pertama rentang yang punya penguat (kalau ayat 0 → coba ayat 1)
      let no = r.ayat || 1;
      let teks = teksPenguat(r.kitab, r.pasal, no);
      if (!teks && r.ayat && r.akhir) {
        for (let a = r.ayat; a <= r.akhir && !teks; a++) {
          teks = teksPenguat(r.kitab, r.pasal, a);
          if (teks) no = a;
        }
      }
      if (!teks) return;                             // tidak ada penguat → tanpa tombol
      sp.dataset.pgCatatan = '1';
      const wadah = document.createElement('span');
      wadah.className = 'pg-catatan-sisip';
      wadah.dataset.ayat = String(no);
      wadah.dataset.kitab = String(r.kitab);
      wadah.dataset.pasal = String(r.pasal);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pg-catatan-toggle';
      b.textContent = '🖊';
      b.title = '🖊 Penguat ' + labelRef(r, no) + ' — tekan untuk membuka/menutup';
      b.setAttribute('aria-label', 'penguat ' + labelRef(r, no));
      // ⚠️ `contenteditable="false"` supaya tombol tidak bisa diketik & tidak
      //    merusak kalimat; pola SAMA seperti `span.ay-link`.  Dengan begitu
      //    seluruh wadah juga menjadi “pulau” yang aman di dalam editor.
      wadah.setAttribute('contenteditable', 'false');
      b.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        sakelarKotakCatatan(wadah, r, no, teks);
      });
      wadah.appendChild(b);
      // tombol ditaruh TEPAT SESUDAH tautan ayat (menempel di kalimat)
      if (sp.parentNode) sp.parentNode.insertBefore(wadah, sp.nextSibling);
    });
  }

  // label rujukan singkat untuk `title` (mis. “Yohanes 3:16”)
  //   ⚠️ Nama kitab diambil dari `data-ref` itu sendiri (`nama`) — itu sumber
  //      yang PASTI benar. Kalau tidak ada, baru pakai daftar kitab Alkitab.
  function labelRef(r, no) {
    let nama = r && r.nama && r.nama !== 'undefined' ? r.nama : '';
    if (!nama) {
      try {
        const a = mesinAlkitab();
        if (a && typeof a.daftarKitab === 'function') {
          const k = a.daftarKitab().find(x => Number(x.no) === Number(r.kitab));
          if (k) nama = k.nama;
        }
      } catch (e) {}
    }
    if (!nama) nama = 'Kitab ' + r.kitab;
    return nama + ' ' + r.pasal + ':' + (no || r.ayat || 1);
  }

  /* Sakelar kotak penguat DI CATATAN.
     ⚠️ Tekan tombol ⇒ buka kotak ayat itu. Ayat lain tidak ikut terganggu
        (di catatan kita tidak boleh membanjiri tulisan pengguna). */
  function sakelarKotakCatatan(wadah, r, no, teks) {
    if (!wadah) return;
    const sudahAda = wadah.querySelector(':scope > .pg-catatan-kotak');
    const tombol = wadah.querySelector('.pg-catatan-toggle');
    if (sudahAda) {                                  // sedang terbuka ⇒ tutup
      sudahAda.remove();
      if (tombol) tombol.classList.remove('aktif');
      return;
    }
    const kotak = document.createElement('span');
    kotak.className = 'pg-catatan-kotak';
    kotak.setAttribute('contenteditable', 'false');
    kotak.textContent = '🖊 ' + teks;
    kotak.dataset.ayat = String(no);
    wadah.appendChild(kotak);
    if (tombol) tombol.classList.add('aktif');

    /* Beri kesempatan plugin lain menandai isi kotak (mis. 📚 Kamus menandai
       kata istilah di dalam teks penguat) — jalur RESMI halaman baca. */
    try {
      const kt = window.ANodesKamusTampilan;
      if (kt && typeof kt.hiasAyat === 'function') kt.hiasAyat({ isi: wadah });
    } catch (e) {}

    /* 🆕 K84 — tautan ayat DI DALAM kotak penguat di catatan bisa diklik.
       ⚠️ Dipanggil SESUDAH kamus menandai supaya node bertanda dilewati.
       ⚠️ Kotak ini `contenteditable="false"` ⇒ penandaan halaman (tanpa kursor)
          aman dipakai; isi catatan di luar kotak ❌ tidak disentuh. */
    tandaiAyatWadah(kotak);
  }

  /* Buka/tutup SELURUH kotak penguat di catatan — dipakai tombol gudang
     (“tampilkan semua / sembunyikan semua”). */
  function sakelarSemuaCatatan() {
    const ed = editorEl();
    if (!ed) return { dibuka: 0 };
    const adaKotak = ed.querySelector('.pg-catatan-kotak');
    if (adaKotak) { tutupKotakCatatan(); return { dibuka: 0 }; }
    let dibuka = 0;
    ed.querySelectorAll('.pg-catatan-sisip').forEach(w => {
      const r = { kitab: Number(w.dataset.kitab), pasal: Number(w.dataset.pasal) };
      const no = Number(w.dataset.ayat);
      const teks = teksPenguat(r.kitab, r.pasal, no);
      if (!teks) return;
      sakelarKotakCatatan(w, r, no, teks);
      dibuka++;
    });
    return { dibuka };
  }

  /* Pintu masuk: hidupkan / matikan 🖊 di catatan.
     Dipakai tombol di gudang plugin DAN baris `[🧩 ▼]` di toolbar tulis. */
  function bukaCatatan() {
    return saatSiap(() => {
      if (!pluginAktif()) { pesan('💡 Pasang plugin 🖊 Penguat dahulu'); return; }
      catatanHidup = true;
      simpanCaraCatatan('tombol');
      // minta editor MENGGAMBAR ULANG tanda, supaya penghias kami ikut jalan
      const ed = window.ANodesEditor;
      if (ed && typeof ed.segarkanTanda === 'function') ed.segarkanTanda();
      else hiasCatatan();
      const jml = (editorEl() || document).querySelectorAll('.pg-catatan-sisip').length;
      pesan(jml ? ('🖊 Penguat siap — ' + jml + ' ayat punya tombol 🖊 di catatan')
                : '🖊 Penguat siap — belum ada tautan ayat di catatan ini');
      // kembali ke catatan (halaman lain ditutup)
      document.querySelectorAll('body > .app').forEach(h => { h.hidden = true; });
      const utama = el('app-utama');
      if (utama) utama.hidden = false;
    });
  }

  function tutupCatatan() {
    catatanHidup = false;
    bersihkanCatatan();
    return true;
  }

  /* ------------------------------------------------------------
     BUKA — pintu masuk dari gudang plugin / submenu 🧩
     ------------------------------------------------------------ */
  function buka() {
    return saatSiap(() => {
      const daftar = mesin().daftarKitab();
      if (!daftar.length) { pesan('⚠️ Belum ada data penguat'); return; }

      if (!kitabSkrg) {
        const ingat = bacaBacaanTerakhir();
        const pilih = (ingat && daftar.find(k => Number(k.no) === Number(ingat.kitab)))
                      || daftar[0];
        kitabSkrg = pilih;
        const pasalAda = mesin().daftarPasal(pilih.no);
        pasalSkrg = (ingat && ingat.pasal && pasalAda.includes(Number(ingat.pasal)))
                    ? Number(ingat.pasal) : (pasalAda[0] || 1);
      }

      if (!bukaHalaman()) return;
      // 🆕 K84 — daftarkan pemulih halaman ini supaya tombol 🏠 di halaman baca
      //   kembali ke SINI (bukan ke catatan) sesudah tautan ayat diklik.
      daftarPemulih();
      isiPilihKitab();
      isiPilihPasal(kitabSkrg.no);
      gambarPasal();
      segarkanTombol();

      const inp = el('pg-cari');
      if (inp) inp.value = '';
      const kotak = el('pg-hasil');
      if (kotak) { kotak.hidden = true; kotak.innerHTML = ''; }
      kataCari = '';
    });
  }

  /* ------------------------------------------------------------
     Pasang pengait tombol (sekali saja)
     ------------------------------------------------------------ */
  let terpasangPengait = false;

  function pasangPengait() {
    if (terpasangPengait) return;
    if (!halaman()) return;
    terpasangPengait = true;

    const k = el('pg-kembali');
    if (k) k.addEventListener('click', tutupHalaman);

    // K54 — pintu melihat penguat DI HALAMAN BACA ALKITAB
    const lihat = el('pg-alkitab');
    if (lihat) lihat.addEventListener('click', bukaLihatAlkitab);

    const pilihKitab = el('pg-kitab');
    if (pilihKitab) pilihKitab.addEventListener('change', () => bukaKitab(pilihKitab.value));

    const pilihPasal = el('pg-pasal');
    if (pilihPasal) pilihPasal.addEventListener('change', () => bukaPasal(pilihPasal.value));

    const prev = el('pg-prev');
    if (prev) prev.addEventListener('click', () => geserPasal(-1));

    const next = el('pg-next');
    if (next) next.addEventListener('click', () => geserPasal(1));

    const cariBtn = el('pg-cari-btn');
    if (cariBtn) cariBtn.addEventListener('click', () => {
      const baris = el('pg-cari-baris');
      if (baris) { baris.hidden = !baris.hidden; }
      if (baris && !baris.hidden) {
        const inp = el('pg-cari');
        if (inp) inp.focus();
      }
    });

    const inp = el('pg-cari');
    if (inp) {
      inp.addEventListener('input', () => {
        clearTimeout(window.__pgCari);
        window.__pgCari = setTimeout(mulaiCari, 260);
      });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { clearTimeout(window.__pgCari); mulaiCari(); }
        if (e.key === 'Escape') { inp.value = ''; mulaiCari(); }
      });
    }

    const bersih = el('pg-cari-tutup');
    if (bersih) bersih.addEventListener('click', () => {
      const inp2 = el('pg-cari');
      if (inp2) inp2.value = '';
      mulaiCari();
    });

    // Esc / Ctrl+B = kembali (sama seperti halaman baca Alkitab)
    document.addEventListener('keydown', (e) => {
      if (!aktif) return;
      if (e.key === 'Escape' || (e.ctrlKey && e.key.toLowerCase() === 'b')) {
        e.preventDefault();
        tutupHalaman();
      }
    });
  }

  /* ------------------------------------------------------------
     Siapkan begitu halaman dibuka
     ------------------------------------------------------------ */
  // K54 — daftarkan penguat sebagai PENGHIAS halaman baca Alkitab
  function daftarPenghiasBaca() {
    const t = window.ANodesAlkitabTampilan;
    if (t && typeof t.tambahPenghias === 'function') {
      t.tambahPenghias(hiasAyatBaca);
      return true;
    }
    return false;
  }

  function mulai() {
    pasangPengait();
    // 🆕 K84 — daftarkan pemulih halaman penguat (supaya 🏠 dari Alkitab
    //   kembali ke halaman ini walau halaman dibuka lewat jalur lain).
    if (!daftarPemulih()) setTimeout(daftarPemulih, 300);
    // K54 — halaman baca Alkitab sudah dimuat lebih dulu (urutan <script>);
    //   kalau belum, dicoba sekali lagi sebentar kemudian.
    if (!daftarPenghiasBaca()) setTimeout(daftarPenghiasBaca, 300);
    // K45 i — daftarkan penghias TANDA ke editor (supaya tombol 🖊 bisa
    //   menempel pada tautan ayat DI CATATAN). Editor sudah dimuat lebih dulu.
    if (!daftarPenghiasTanda()) setTimeout(daftarPenghiasTanda, 300);
    if (pluginAktif() && mesin() && !mesin().siap()) mesin().muat().catch(() => {});
    // kalau 🖊 catatan pernah dipakai, hidupkan lagi setelah F5
    try {
      if (localStorage.getItem(KUNCI_CARA_CATATAN) === 'tombol' && pluginAktif()) {
        catatanHidup = true;
        const ed = window.ANodesEditor;
        if (ed && typeof ed.segarkanTanda === 'function') setTimeout(ed.segarkanTanda, 800);
      }
    } catch (e) {}
  }

  /* K45 i — daftarkan `hiasCatatan()` sebagai PENGHIAS TANDA milik editor.
     Editor memanggilnya setiap kali tanda ayat/istilah selesai digambar. */
  function daftarPenghiasTanda() {
    const ed = window.ANodesEditor;
    if (ed && typeof ed.tambahPenghiasTanda === 'function') {
      ed.tambahPenghiasTanda(hiasCatatan);
      return true;
    }
    return false;
  }

  /* ------------------------------------------------------------
     SIAPKAN OTOMATIS — WAJIB dipanggil setiap plugin DIPASANG
     ------------------------------------------------------------
     ⚠️⚠️ CACAT NYATA (23 Sep 2026 — jangan diulang):
       `saatDilepas` MEMBUANG pendaftaran penghias (`lepasPenghiasTanda`),
       tetapi `saatDipasang` hanya memuat DATA
       ⇒ plugin “dilepas lalu dipasang lagi” = tombol 🖊 **TIDAK muncul**
         walau `_keadaanCatatan().hidup` bernilai true (terukur: 0 tombol).

     ⇒ Karena itu pendaftaran penghias + keadaan 🖊 catatan disiapkan ULANG
       di sini, dan `plugin.js → saatDipasang()` memanggilnya.
       (Pelajaran sama seperti K47e/K55: “`siapkanOtomatis()` WAJIB ADA”.) */
  function siapkanOtomatis() {
    if (!pluginAktif()) return false;
    // pendaftaran selalu dipasang ulang (aman: daftar tidak menampung ganda)
    daftarPenghiasBaca();
    daftarPenghiasTanda();
    // kalau 🖊 catatan dipakai sebelum plugin dilepas → hidupkan lagi
    try {
      if (localStorage.getItem(KUNCI_CARA_CATATAN) === 'tombol') {
        catatanHidup = true;
        const ed = window.ANodesEditor;
        if (ed && typeof ed.segarkanTanda === 'function') ed.segarkanTanda();
        else hiasCatatan();
      }
    } catch (e) {}
    return true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mulai);
  } else {
    setTimeout(mulai, 0);
  }

  /* ------------------------------------------------------------
     API
     ------------------------------------------------------------ */
  return {
    buka, tutup: tutupHalaman, bersihkan, pesan,
    pasangPengait,
    // K52 — sambungan resmi untuk plugin lain (📚 Kamus Istilah bisa menandai)
    tambahPenghias, jalankanPenghias, gambarPasal,
    // K54 — 🖊 penguat di halaman baca Alkitab (tombol per ayat)
    hiasAyatBaca, bukaLihatAlkitab,
    // K54 — sakelar yang sama, dipakai tombol 🖊 di navbar halaman baca
    sakelarSemuaPenguat,
    // 🆕 K45 i — 🖊 penguat yang MENEMPEL DI CATATAN (pola tombol [full] K43)
    bukaCatatan, tutupCatatan, hiasCatatan, bersihkanCatatan,
    sakelarSemuaCatatan, caraCatatan, simpanCaraCatatan,
    // ⚠️ WAJIB ada — dipakai plugin.js saat plugin DIPASANG (termasuk pasang ulang)
    siapkanOtomatis,
    _keadaanBaca: () => ({ semuaTerbuka }),
    _keadaanCatatan: () => ({
      hidup: catatanHidup,
      cara: caraCatatan(),
      tombol: (editorEl() || document).querySelectorAll('.pg-catatan-sisip').length,
      kotak: (editorEl() || document).querySelectorAll('.pg-catatan-kotak').length
    }),
    _kunciCaraCatatan: () => KUNCI_CARA_CATATAN,
    // penanda versi — bisa diperiksa dari Console: ANodesPenguatTampilan.versi()
    versi: () => VERSI,
    // untuk uji
    _keadaan: () => ({
      aktif, kitab: kitabSkrg ? kitabSkrg.no : null, pasal: pasalSkrg, kataCari
    })
  };
})();
