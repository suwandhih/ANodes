/* ============================================================
   ANodes — plugin/sejarah/tampilan.js
   TAMPILAN plugin 📖 SEJARAH KITAB  (K55b → K55c)

   ------------------------------------------------------------
   🔄 KONSEP DIUBAH BAPAK 23 Sep 2026:
     *“saya mau ubah konsep dari k55c. Jika klik [🧩▼] <- muncul semua plugin.
      1. catatan plugin sejarah sudah di tempelkan. 2. sekarang plugin
      [sejarah] > klik kosong. 3. disini sejarah **“alkitab” (bukan kitab2)**
      di tampilkan. apakah arahan ini cukup jelas ?”*
     ➕ Penegasan: *“saya **tidak mengeluh klik kosong** justru saya mau
      **manfaatkan untuk tempat user bisa baca sejarah alkitab < prakata**..
      **sejarah perkitab sudah ada disetiap kitab dalam alkitab**”*

   ⇒ DUA hal, jangan dicampur:
     ① **Sejarah PER KITAB**  — tombol `📖 sejarah` di PASAL 1 tiap kitab
        (hiasAyatBaca) · SUDAH ADA sejak K55/K55b · ❌ tidak diubah.
     ② **Sejarah ALKITAB (prakata)** — “Bagaimana Firman menjadi tulisan”
        (15.356 huruf) · sekarang punya **HALAMAN SENDIRI** (`#sejarah-halaman`,
        halaman ke-6) yang dibuka **1 KLIK** dari 🧩▼ → 📖 Sejarah Kitab.
        ⇒ `buka()` = pintu masuknya (kontrak plugin di plugin.js).

   Cara kerjanya (❌ TANPA mesin baru):
     1. Daftar ke sambungan resmi plugin 📖 Alkitab:
          ANodesAlkitabTampilan.tambahPenghias(hiasAyatBaca)
        ⇒ setiap kali halaman baca selesai menggambar pasal, kita dipanggil.
     2. Kalau pasal itu = PASAL 1 dan kitabnya punya sejarah ⇒ sisipkan
        tombol `📖 sejarah` di bawah judul pasal.
     3. Tombol ditekan ⇒ panel sejarah turun di bawahnya
        (🎯 inti → 🏷️ fakta → 💡 tema → 👤 tokoh → 📜 sejarah → 🔑 ayat kunci).
        Ditekan lagi ⇒ panel TERTUTUP.
     4. Ayat kunci diklik ⇒ memakai `bukaAyatDariLink()` milik plugin Alkitab
        (fitur yang SUDAH ADA — kita tidak membuat mesin pengganti).
     5. `buka()` (K55c) ⇒ HALAMAN SENDIRI `#sejarah-halaman` menampilkan
        **sejarah ALKITAB (prakata)** + pintasan 66 kitab; chip kitab diklik
        ⇒ pindah ke PASAL 1 kitab itu di halaman baca Alkitab.

   ⚠️ Plugin Alkitab TIDAK tahu plugin ini ada (asas “plugin bisa dicabut”).
   ⚠️ Kelas CSS `.ay-sejarah-*` & `.baca-isi` sudah ada di css/app.css (K55),
      jadi isi halaman mandiri ❌ tidak perlu gaya baru.
   ⚠️ Kalau plugin Alkitab TIDAK terpasang: bagian ② tetap jalan (halaman
      mandiri mandiri), tetapi chip kitab & ayat kunci memberi pesan.
   ============================================================ */

window.ANodesSejarahTampilan = (function () {
  'use strict';

  // K56 (23 Sep 2026) — tautan ayat + istilah di halaman sejarah
  //   juga: 🔍 cari di dalam teks sejarah (K55c) · pulih dari Alkitab
  const VERSI = 'v22Sep-i';

  const mesin = () => window.ANodesSejarah;
  const Alkitab = () => window.ANodesAlkitabTampilan;
  const elIsi = () => document.getElementById('baca-isi');

  // halaman mandiri (K55c)
  const elHal = () => document.getElementById('sejarah-halaman');
  const elSJ = () => document.getElementById('sj-isi');

  // keadaan: jangan mendaftarkan penghias dua kali
  let terdaftar = false;
  let halamanAktif = false;      // true = halaman sejarah sedang tampil
  let kataCari = '';
  // K58 — tanda temuan pencarian di teks sejarah + temuan yang sedang aktif
  let daftarCari = [];
  let urutCari = -1;

  /* ------------------------------------------------------------
     Pesan singkat (pakai toast yang sudah ada)
     ------------------------------------------------------------ */
  function pesan(t) {
    const kotak = document.getElementById('toast');
    if (!kotak) { console.log('📖 ' + t); return; }
    kotak.textContent = t;
    kotak.classList.add('tampil');
    clearTimeout(window.__sejarahPesan);
    window.__sejarahPesan = setTimeout(() => kotak.classList.remove('tampil'), 2200);
  }

  /* ------------------------------------------------------------
     PASANG TANDA — daftarkan diri ke halaman baca Alkitab
     ------------------------------------------------------------ */
  function pasangTanda() {
    const a = Alkitab();
    if (!a || typeof a.tambahPenghias !== 'function') return false;
    if (terdaftar) return true;
    a.tambahPenghias(hiasAyatBaca);
    terdaftar = true;

    // kalau halaman baca SEDANG terbuka, sisipkan sekarang juga
    try {
      const p = a.posisi;
      const isi = elIsi();
      if (p && isi && isi.querySelector('.ay-judul')) {
        hiasAyatBaca({ kitab: p.kitab, pasal: p.pasal, isi });
      }
    } catch (e) {}
    return true;
  }

  /* ------------------------------------------------------------
     HIAS — dipanggil plugin Alkitab tiap selesai menggambar pasal
       K55d DIBATALKAN (22 Sep 2026) — Bapak: *“konsep awal itu sudah benar
       seharusnya secara konsep tidak berubah.. tujuan saya hanya mau merapihkan
       menu”* ⇒ tombol `📖 sejarah` KEMBALI di **barisnya sendiri** di bawah
       judul pasal (dan tetap HANYA di PASAL 1).
     ------------------------------------------------------------ */
  function hiasAyatBaca(ctx) {
    if (!ctx || !ctx.isi) return;
    const s = mesin();
    if (!s || typeof s.saatSiap !== 'function') return;

    const isi = ctx.isi;

    // Kalau pasal bukan 1 → pastikan panel & baris lama dibuang
    if (Number(ctx.pasal) !== 1) {
      const lama = isi.querySelector('.ay-sejarah-panel');
      if (lama) lama.remove();
      return;
    }

    const kitab = Number(ctx.kitab);
    if (!s.kitab(kitab)) return;

    // ⚠️ Penanda “sudah ada baris” diperiksa dari DOM (bukan dataset):
    //    `gambarPasal()` mengganti isi wadah tetapi atribut wadah tetap —
    //    jadi penanda di wadah TIDAK bisa mendeteksi isi yang sudah baru.
    if (isi.querySelector('.ay-sejarah-baris')) return;

    const baris = document.createElement('div');
    baris.className = 'ay-sejarah-baris';
    baris.appendChild(tombolSejarah(s.kitab(kitab)));
    const jangkar = isi.querySelector('.ay-meta') || isi.querySelector('.ay-judul');
    if (jangkar && jangkar.parentElement === isi) {
      jangkar.insertAdjacentElement('afterend', baris);
    } else {
      isi.insertBefore(baris, isi.firstChild);
    }
  }

  // tombol 📖 sejarah (dipakai di bar pintasan / cadangan)
  function tombolSejarah(k) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ay-sejarah-toggle';
    b.textContent = '📖 sejarah';
    b.title = 'Sejarah kitab ' + k.nama + ' — penulis, tahun, tema, tokoh, dan ayat kunci';

    // panel dibuka di BAWAH bar pintasan (wadah terdekat yang punya teman)
    b.addEventListener('click', () => {
      const baris = b.closest('.ay-pintasan') || b.parentElement;
      sakelar(baris, b, k);
    });
    return b;
  }

  /* ------------------------------------------------------------
     SAKELAR — tekan tombol: belum ada panel ⇒ buka, ada ⇒ tutup
     ------------------------------------------------------------ */
  function sakelar(baris, tombol, k) {
    const lama = baris.querySelector('.ay-sejarah-panel');
    if (lama) {
      lama.remove();
      if (tombol) tombol.classList.remove('aktif');
      return;
    }
    baris.appendChild(gambarPanel(k));
    if (tombol) tombol.classList.add('aktif');
  }

  /* ------------------------------------------------------------
     PANEL — isi sejarah satu kitab
       Urutan (disetujui Bapak): 🎯 → 🏷️ → 💡 → 👤 → 📜 → 🔑
     ------------------------------------------------------------ */
  function gambarPanel(k) {
    const kotak = document.createElement('div');
    kotak.className = 'ay-sejarah-panel';

    const kepala = document.createElement('div');
    kepala.className = 'ay-sejarah-kepala';
    kepala.textContent = '📖 SEJARAH — ' + String(k.nama || '').toUpperCase();
    kotak.appendChild(kepala);

    // 🎯 inti kitab (paling mudah dibaca)
    if (k.inti) {
      const inti = document.createElement('p');
      inti.className = 'ay-sejarah-inti';
      inti.textContent = '🎯 ' + k.inti;
      kotak.appendChild(inti);
    }

    // 🏷️ fakta singkat
    const fakta = document.createElement('div');
    fakta.className = 'ay-sejarah-fakta';
    [['Penulis', k.penulis], ['Tahun', k.tahun],
     ['Kategori', k.kategori], ['Perjanjian', k.perjanjian]].forEach(x => {
      if (!x[1]) return;
      const d = document.createElement('div');
      d.className = 'ay-sejarah-fakta-baris';
      const l = document.createElement('span');
      l.className = 'ay-sejarah-lbl';
      l.textContent = x[0];
      const v = document.createElement('span');
      v.textContent = x[1];
      d.appendChild(l);
      d.appendChild(v);
      fakta.appendChild(d);
    });
    kotak.appendChild(fakta);

    // 💡 tema utama
    if (Array.isArray(k.tema) && k.tema.length) {
      kotak.appendChild(judulBagian('💡 Tema utama'));
      kotak.appendChild(chipBaris(k.tema, ''));
    }

    // 👤 tokoh utama
    if (Array.isArray(k.tokoh) && k.tokoh.length) {
      kotak.appendChild(judulBagian('👤 Tokoh utama'));
      kotak.appendChild(chipBaris(k.tokoh, 'tokoh'));
    }

    // 📜 sejarah (teks utama)
    if (k.sejarah) {
      kotak.appendChild(judulBagian('📜 Sejarah'));
      const p = document.createElement('p');
      p.className = 'ay-sejarah-teks';
      p.textContent = k.sejarah;
      kotak.appendChild(p);
    }

    // 🔑 ayat kunci — BISA DIKLIK ⇒ langsung ke ayat itu
    if (Array.isArray(k.ayat) && k.ayat.length) {
      kotak.appendChild(judulBagian('🔑 Ayat kunci — klik untuk membuka'));
      const baris = document.createElement('div');
      baris.className = 'ay-sejarah-chip-baris';
      k.ayat.forEach(a => {
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'ay-sejarah-ayat';
        c.textContent = String(k.nama) + ' ' + a.label;
        c.title = 'Buka ' + k.nama + ' ' + a.label;
        c.addEventListener('click', () => {
          const a2 = Alkitab();
          if (a2 && typeof a2.bukaAyatDariLink === 'function') {
            a2.bukaAyatDariLink({ no: Number(k.no), pasal: Number(a.p), ayat1: Number(a.a) }, null, 0);
          }
        });
        baris.appendChild(c);
      });
      kotak.appendChild(baris);
    }

    return kotak;
  }

  function judulBagian(teks) {
    const j = document.createElement('div');
    j.className = 'ay-sejarah-bagian';
    j.textContent = teks;
    return j;
  }

  function chipBaris(daftar, kelasTambahan) {
    const baris = document.createElement('div');
    baris.className = 'ay-sejarah-chip-baris';
    daftar.forEach(t => {
      const c = document.createElement('span');
      c.className = 'ay-sejarah-chip' + (kelasTambahan ? ' ' + kelasTambahan : '');
      c.textContent = t;
      baris.appendChild(c);
    });
    return baris;
  }

  /* ============================================================
     K55c — 📖 SEJARAH ALKITAB (PRAKATA) DI HALAMAN SENDIRI
     ------------------------------------------------------------
     Bapak 23 Sep 2026: *“manfaatkan untuk tempat user bisa baca sejarah
     alkitab < prakata”* ⇒ halaman ke-6 `#sejarah-halaman` menampilkan
     teks “Bagaimana Firman menjadi tulisan” (15.356 huruf) + pintasan
     66 kitab.

     ⚠️ HALAMAN INI MANDIRI:
       • tidak menyentuh catatan pengguna sama sekali
       • tidak membutuhkan plugin 📖 Alkitab untuk MEMBACA teksnya
         (kalau plugin Alkitab ada, chip kitab & ayat kunci bisa mengantar)
       • dilepas plugin ⇒ halaman ditutup & hiasan dibuang
     ============================================================ */

  // sembunyikan semua halaman lain (pola SAMA halaman penguat/kamus)
  function sembunyikanLain() {
    document.querySelectorAll('body > .app').forEach(a => {
      if (a !== elHal()) a.hidden = true;
    });
  }

  function bukaHalaman() {
    const hal = elHal();
    if (!hal) { pesan('⚠️ Halaman sejarah belum ada di index.html'); return false; }
    sembunyikanLain();
    hal.hidden = false;
    hal.scrollTop = 0;
    halamanAktif = true;
    return true;
  }

  function tutupHalaman() {
    // K58 — tanda temuan pencarian ikut dibuang (halaman ditinggalkan)
    bersihkanTandaCari();
    kataCari = '';
    segarkanInfoCari();
    const hal = elHal();
    if (hal) hal.hidden = true;
    halamanAktif = false;
    // kembali ke catatan (pola halaman penguat: catatan tidak pernah diubah)
    const utama = document.getElementById('app-utama');
    if (utama) utama.hidden = false;
  }

  // gambar seluruh isi halaman mandiri: pengantar + pintasan 66 kitab
  function gambarPengantar() {
    const s = mesin();
    const isi = elSJ();
    if (!s || !isi) return;
    // K58 — halaman digambar ulang ⇒ tanda cari lama tidak berlaku lagi
    daftarCari = [];
    urutCari = -1;
    isi.innerHTML = '';

    const judul = document.createElement('div');
    judul.className = 'ay-judul';
    judul.textContent = '📖 Sejarah Alkitab';
    isi.appendChild(judul);

    const meta = document.createElement('div');
    meta.className = 'ay-meta';
    // K55c — penanda versi ikut ditulis supaya bisa DIBUKTIKAN berkas mana
    //   yang termuat di browser (pelajaran K47b/K47c).
    meta.textContent = 'Bagaimana Firman menjadi tulisan · ' +
      (typeof s.jumlahKitab === 'function' ? s.jumlahKitab() : 66) + ' kitab · ' + VERSI;
    isi.appendChild(meta);

    // pintasan ke tiap kitab (dikelompokkan per kategori)
    //   ⚠️ jawaban Bapak no.1 (23 Sep 2026): chip **tetap ada** —
    //      diklik ⇒ pindah ke PASAL 1 kitab itu di halaman baca Alkitab.
    if (typeof s.kelompok === 'function') {
      s.kelompok().forEach(g => {
        isi.appendChild(judulBagianKecil('📚 ' + g.kategori + ' (' + g.kitab.length + ')'));
        const baris = document.createElement('div');
        baris.className = 'ay-sejarah-chip-baris';
        g.kitab.forEach(k => {
          const c = document.createElement('button');
          c.type = 'button';
          c.className = 'ay-sejarah-ayat';
          c.textContent = String(k.no) + '. ' + k.nama;
          c.title = 'Buka ' + k.nama + ' 1 — di situ ada tombol 📖 sejarah kitab itu';
          c.addEventListener('click', () => bukaKitabDariChip(k));
          baris.appendChild(c);
        });
        isi.appendChild(baris);
      });
    }

    // teks pengantar — dibagi per paragraf supaya enak dibaca
    const bungkus = document.createElement('div');
    bungkus.className = 'ay-sejarah-teks panjang';
    String(s.pengantar() || '').split(/\n{2,}/).forEach(par => {
      const t = par.trim();
      if (!t) return;
      const p = document.createElement('p');
      p.className = 'ay-sejarah-teks';
      p.textContent = t;
      bungkus.appendChild(p);
    });
    isi.appendChild(bungkus);

    // K56 — tandai tautan ayat & istilah di teks (ay-link 0 → hidup)
    setTimeout(hiasHalamanSejarah, 30);

    isi.scrollTop = 0;
  }

  // chip kitab ditekan ⇒ PASAL 1 kitab itu di halaman baca Alkitab
  function bukaKitabDariChip(k) {
    const a = Alkitab();
    if (!a || typeof a.gambarPasal !== 'function') {
      pesan('💡 Pasang plugin 📖 Alkitab dahulu supaya kitab bisa dibuka');
      return;
    }
    const m = window.ANodesAlkitab;
    const buka = () => {
      const hal = elHal();
      if (hal) hal.hidden = true;
      halamanAktif = false;
      // K56 — halaman ini BUKAN halaman baca; jangan tinggalkan penanda
      bersihkanTandaHalaman();
      if (typeof a.bukaHalaman === 'function') {
        try { a.bukaHalaman(); } catch (e) {}
      }
      setTimeout(() => {
        try { a.gambarPasal(Number(k.no), 1, 0, false); } catch (e) {}
      }, 60);
    };
    if (m && typeof m.saatSiap === 'function') m.saatSiap(buka);
    else buka();
  }

  /* ============================================================
     K56 — TAUTAN AYAT + ISTILAH DI HALAMAN SEJARAH (23 Sep 2026)
     ------------------------------------------------------------
     Bapak: *“Pengantar Sejarah Alkitab: Bagaimana Firman Menjadi Tulisan ..
     ada **kamus istilah dan link alkitab belum berfungsi**”*
     ⇒ teks halaman ini memang belum pernah ditandai (terukur: ay-link 0 ·
       kamus-istilah 0, padahal teks memuat “Ulangan 34:5-6”, “Yesaya 45:1”,
       “Taurat”, “Tuhan”).

     Cara: memakai pintu resmi kedua plugin (❌ TANPA mesin baru):
       • 📖 Alkitab → `ANodesAlkitab.tandaiWadahHalaman(isi)`
       • 📚 Kamus   → `ANodesKamusTampilan.tandaiHalaman(isi)`
       • klik tautan ayat → `pasangKaitAyatHalaman(isi,'sejarah')`
       • klik istilah     → pengait kamus (dipasang kamus saat hias)
     Tombol 🏠 kembali dari halaman baca ⇒ kembali KE HALAMAN INI
       (didaftarkan lewat `daftarPemulihHalaman('sejarah', …)`).
     ============================================================ */
  let tandaHalamanPasang = false;

  // pasang tanda + pengait klik pada isi halaman sejarah
  function hiasHalamanSejarah() {
    const isi = elSJ();
    if (!isi) return;

    // (1) tautan ayat — mesin Alkitab (halaman baca-saja, ❌ tanpa kursor)
    const MA = window.ANodesAlkitab;
    if (MA && typeof MA.tandaiWadahHalaman === 'function' &&
        window.ANodesPlugin && window.ANodesPlugin.dipasang('alkitab')) {
      try { MA.tandaiWadahHalaman(isi); } catch (e) {}
    }

    // (2) istilah — plugin Kamus (penandaan + pengait klik-nya sudah generik)
    const MT = window.ANodesKamusTampilan;
    if (MT && typeof MT.tandaiHalaman === 'function' &&
        window.ANodesPlugin && window.ANodesPlugin.dipasang('kamus')) {
      try { MT.tandaiHalaman(isi); } catch (e) {}
    }

    // (3) pengait klik tautan ayat — supaya tautan HIDUP (bukan hanya bergaya)
    const A = Alkitab();
    if (A && typeof A.pasangKaitAyatHalaman === 'function' && !tandaHalamanPasang) {
      try { A.pasangKaitAyatHalaman(isi, 'sejarah'); tandaHalamanPasang = true; } catch (e) {}
    }
  }

  // buang tanda dari isi halaman sejarah (sebelum meninggalkan halaman)
  function bersihkanTandaHalaman() {
    const isi = elSJ();
    if (!isi) return;
    const MA = window.ANodesAlkitab;
    if (MA && typeof MA.bersihTandaWadah === 'function') {
      try { MA.bersihTandaWadah(isi); } catch (e) {}
    }
  }

  // dipanggil plugin 📖 Alkitab saat tombol 🏠 ditekan dari halaman bacanya
  //   ⇒ tampilkan lagi HALAMAN INI (posisi gulir dipulihkan)
  function pulihDariAlkitab(info) {
    const hal = elHal();
    if (!hal) return false;
    // pastikan isinya masih ada (kalau sudah dikosongkan → gambar ulang)
    if (!elSJ().querySelector('.ay-judul')) gambarPengantar();
    document.querySelectorAll('body > .app').forEach(a => { a.hidden = true; });
    hal.hidden = false;
    halamanAktif = true;
    if (info && info.gulir) elSJ().scrollTop = info.gulir;
    return true;
  }

  /* ------------------------------------------------------------
     BUKA — pintu masuk dari 🧩▼ / gudang plugin (K55c)
       Bapak: klik `[sejarah]` ⇒ tampil **sejarah ALKITAB** (1 klik).
       ⇒ inilah yang membuat pintu itu BEKERJA (sebelumnya belum ada
         `tombolBuka` & `buka()` pada kontrak plugin).
     ------------------------------------------------------------ */
  function buka() {
    const s = mesin();
    if (!s || typeof s.saatSiap !== 'function') { pesan('⚠️ Mesin sejarah belum siap'); return false; }
    if (typeof s.adaPengantar === 'function' && !s.adaPengantar()) {
      pesan('⚠️ Teks sejarah Alkitab belum ada');
      return false;
    }
    s.saatSiap(() => {
      // K56 — daftarkan pemulih halaman ini supaya tombol 🏠 di halaman baca
      //   kembali ke SINI (bukan ke catatan) sesudah tautan ayat diklik.
      const A = Alkitab();
      if (A && typeof A.daftarPemulihHalaman === 'function') {
        try { A.daftarPemulihHalaman('sejarah', pulihDariAlkitab); } catch (e) {}
      }
      if (!bukaHalaman()) return;
      gambarPengantar();
      const inp = document.getElementById('sj-cari');
      if (inp) inp.value = '';
      const hasil = document.getElementById('sj-hasil');
      if (hasil) { hasil.hidden = true; hasil.innerHTML = ''; }
      const baris = document.getElementById('sj-cari-baris');
      if (baris) baris.hidden = true;
      kataCari = '';
    });
    return true;
  }

  // PENGANTAR (nama lama dipertahankan — dipanggil tombol halaman keterangan
  //   plugin lewat kontrak `tombolInfo[]`). Sekarang diarahkan ke halaman
  //   mandiri, ❌ tidak lagi menempel di halaman baca Alkitab.
  function bukaPengantar() { return buka(); }

  // judul kelompok di daftar chip pengantar
  function judulBagianKecil(teks) {
    const j = document.createElement('div');
    j.className = 'ay-sejarah-bagian';
    j.textContent = teks;
    return j;
  }

  /* ------------------------------------------------------------
     PENGATUR HALAMAN MANDIRI (K55c) — pasang sekali
       ⚠️ Pengait dipasang SEKALI saja (terpasangPengait) supaya tidak
       menumpuk kalau `buka()` dipanggil berkali-kali.
     ------------------------------------------------------------ */
  let terpasangPengait = false;

  function pasangPengait() {
    if (terpasangPengait) return;
    if (!elHal()) return;
    terpasangPengait = true;

    const k = document.getElementById('sj-kembali');
    if (k) k.addEventListener('click', tutupHalaman);

    const cariBtn = document.getElementById('sj-cari-btn');
    if (cariBtn) cariBtn.addEventListener('click', () => {
      const baris = document.getElementById('sj-cari-baris');
      if (!baris) return;
      baris.hidden = !baris.hidden;
      if (!baris.hidden) {
        const inp = document.getElementById('sj-cari');
        if (inp) inp.focus();
      }
    });

    const tutupCari = document.getElementById('sj-cari-tutup');
    if (tutupCari) tutupCari.addEventListener('click', () => {
      const inp = document.getElementById('sj-cari');
      if (inp) inp.value = '';
      const baris = document.getElementById('sj-cari-baris');
      if (baris) baris.hidden = true;
      const hasil = document.getElementById('sj-hasil');
      if (hasil) { hasil.hidden = true; hasil.innerHTML = ''; }
      kataCari = '';
      // K58 — tanda temuan ikut HILANG saat pencarian ditutup (permintaan Bapak)
      bersihkanTandaCari();
      segarkanInfoCari();
    });

    /* K58 — tombol ◀ ▶ = pindah temuan (berputar).
       Bapak: *“…dan next atau preview..”* */
    const btnPrev = document.getElementById('sj-cari-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => lompatTemuan(-1));
    const btnNext = document.getElementById('sj-cari-next');
    if (btnNext) btnNext.addEventListener('click', () => lompatTemuan(1));

    const inp = document.getElementById('sj-cari');
    if (inp) {
      inp.addEventListener('input', () => mulaiCari());
      inp.addEventListener('keydown', (e) => {
        // Enter = temuan BERIKUTNYA (pola sama seperti cari di catatan)
        if (e.key === 'Enter') { e.preventDefault(); if (daftarCari.length) lompatTemuan(1); else mulaiCari(); }
        if (e.key === 'Escape') {
          inp.value = '';
          const hasil = document.getElementById('sj-hasil');
          if (hasil) { hasil.hidden = true; hasil.innerHTML = ''; }
          kataCari = '';
          bersihkanTandaCari();
          segarkanInfoCari();
        }
      });
    }

    // Esc / Ctrl+B = kembali (sama seperti halaman baca Alkitab & penguat)
    document.addEventListener('keydown', (e) => {
      if (!halamanAktif) return;
      if (e.key === 'Escape' || (e.ctrlKey && e.key.toLowerCase() === 'b')) {
        const baris = document.getElementById('sj-cari-baris');
        // Esc saat kotak cari terbuka = bersihkan cari dulu (jangan tinggalkan halaman)
        if (e.key === 'Escape' && baris && !baris.hidden) {
          e.preventDefault();
          const inp2 = document.getElementById('sj-cari');
          if (inp2) inp2.value = '';
          baris.hidden = true;
          const hasil = document.getElementById('sj-hasil');
          if (hasil) { hasil.hidden = true; hasil.innerHTML = ''; }
          kataCari = '';
          bersihkanTandaCari();      // K58 — tanda ikut hilang
          segarkanInfoCari();
          return;
        }
        e.preventDefault();
        tutupHalaman();
      }
    });
  }

  /* ------------------------------------------------------------
     🔍 CARI di dalam teks sejarah ALKITAB (K55c — pelengkap)
       Hasilnya memuat NAMA KITAB yang disebut teks itu + kutipannya,
       lalu diklik ⇒ pindah ke pasal 1 kitab itu di halaman baca.
       ⚠️ Kalau tidak ada nama kitab di sekitar temuan, hasil tetap
       ditampilkan (tanpa tombol buka) — jangan menyembunyikan temuan.
     ------------------------------------------------------------ */
  function mulaiCari() {
    const s = mesin();
    const inp = document.getElementById('sj-cari');
    const hasil = document.getElementById('sj-hasil');
    if (!s || !inp || !hasil) return;

    const kata = String(inp.value || '').trim().toLowerCase();
    bersihkanTandaCari();                 // K58 — buang tanda lama dulu (diganti)
    kataCari = kata;
    if (kata.length < 3) { hasil.hidden = true; hasil.innerHTML = ''; return; }

    /* K58 — BERI TANDA setiap kata yang ketemu (KUNING).
       Tanda ini TETAP ADA selama pencarian belum ditutup atau diganti. */
    const jumlah = bungkusTemuan(kata);

    const teks = String(s.pengantar() || '');
    const temuan = [];
    const rendah = teks.toLowerCase();
    let i = rendah.indexOf(kata), dari = 0;
    while (i >= 0 && temuan.length < 60) {
      const awal = Math.max(0, i - 60);
      const akhir = Math.min(teks.length, i + kata.length + 60);
      temuan.push({
        cuplik: (awal > 0 ? '… ' : '') +
                teks.slice(awal, akhir).replace(/\s+/g, ' ').trim() +
                (akhir < teks.length ? ' …' : ''),
        pos: i - dari
      });
      dari = i + kata.length;
      i = rendah.indexOf(kata, dari);
    }

    hasil.innerHTML = '';
    if (!temuan.length) {
      const k = document.createElement('div');
      k.className = 'pg-hasil-kepala';
      k.textContent = 'Tidak ada temuan untuk “' + inp.value.trim() + '” di teks sejarah Alkitab.';
      hasil.appendChild(k);
    } else {
      const k = document.createElement('div');
      k.className = 'pg-hasil-kepala';
      k.textContent = temuan.length + ' temuan untuk “' + inp.value.trim() + '” — klik untuk melompat ke bagian itu';
      hasil.appendChild(k);
      temuan.forEach((t, nomor) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pg-hasil-baris';
        const c = document.createElement('span');
        c.className = 'pg-hasil-cuplik';
        c.textContent = t.cuplik;
        b.appendChild(c);
        b.addEventListener('click', () => keTemuan(nomor));
        hasil.appendChild(b);
      });
    }
    hasil.hidden = false;

    // langsung loncat ke temuan PERTAMA + isi penghitung “1/5”
    if (jumlah) { urutCari = -1; keTemuan(0); }
    else { segarkanInfoCari(); }
  }

  /* ------------------------------------------------------------
     K58 (23 Sep 2026) — TANDA TEMUAN + PINDAH TEMUAN (◀ ▶)
     ------------------------------------------------------------
     💬 Bapak: *“misal cari kata ‘dead sea’ lewat fitur ‘cari’ jika ketemu di beri
     tanda pada tulisan ‘dead sea’ dan next atau preview.. selama fitur cari masih
     ada tulisan ‘dead sea’ tanda atau warna pada tulisan ‘dead sea’ masih ada..
     sampai ditutup atau diganti ..atau dihilangkan”*

     ⇒ kata yang ketemu DIBERI WARNA (kuning) · tombol ◀ ▶ pindah temuan ·
       penghitung “3/5” · tanda TETAP ada sampai ditutup/diganti.

     ⚠️ Penandaan memakai POTONGAN TEKS (TreeWalker) — pola SAMA seperti cari di
        catatan (`js/editor.js → bungkusDiEditor`) ⇒ tag HTML tidak tersentuh.
     ⚠️ Tanda ini HANYA tampilan: tidak masuk data & tidak disimpan ke mana pun.
     ------------------------------------------------------------ */
  function bungkusTemuan(kata) {
    const isi = elSJ();
    if (!isi || !kata) return 0;
    const kumpul = [];
    const jalan = document.createTreeWalker(isi, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const induk = n.parentNode;
        if (!induk) return NodeFilter.FILTER_REJECT;
        if (induk.tagName === 'SCRIPT' || induk.tagName === 'STYLE') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let n;
    while ((n = jalan.nextNode())) kumpul.push(n);

    const bawah0 = kata.toLowerCase();
    kumpul.forEach(node => {
      const teks = node.nodeValue || '';
      const bawah = teks.toLowerCase();
      const pos = [];
      let dari = 0, i;
      while ((i = bawah.indexOf(bawah0, dari)) !== -1) {
        pos.push({ mulai: i, akhir: i + kata.length });
        dari = i + kata.length;
      }
      if (!pos.length) return;
      const frag = document.createDocumentFragment();
      let pos2 = 0;
      pos.forEach(p => {
        if (p.mulai > pos2) frag.appendChild(document.createTextNode(teks.slice(pos2, p.mulai)));
        const m = document.createElement('mark');
        m.className = 'sj-cari-hit';
        m.textContent = teks.slice(p.mulai, p.akhir);
        frag.appendChild(m);
        daftarCari.push(m);
        pos2 = p.akhir;
      });
      if (pos2 < teks.length) frag.appendChild(document.createTextNode(teks.slice(pos2)));
      try { node.parentNode.replaceChild(frag, node); } catch (e) {}
    });
    return daftarCari.length;
  }

  // buang SEMUA tanda temuan — halaman kembali seperti semula (diuji: catatan tetap utuh)
  function bersihkanTandaCari() {
    const isi = elSJ();
    if (isi) {
      isi.querySelectorAll('mark.sj-cari-hit').forEach(m => {
        const t = document.createTextNode(m.textContent);
        if (m.parentNode) m.parentNode.replaceChild(t, m);
      });
      try { isi.normalize(); } catch (e) {}
    }
    daftarCari = [];
    urutCari = -1;
  }

  // penghitung “3/5” + bedakan warna temuan yang sedang aktif
  function segarkanInfoCari() {
    const info = document.getElementById('sj-cari-info');
    if (info) {
      info.textContent = (!kataCari || !daftarCari.length) ? ''
        : (urutCari + 1) + '/' + daftarCari.length;
    }
    daftarCari.forEach((m, i) => m.classList.toggle('sj-cari-aktif', i === urutCari));
  }

  // pindah ke temuan nomor ke-n (berputar) — gulir + sorot
  function keTemuan(n) {
    if (!daftarCari.length) { segarkanInfoCari(); return; }
    urutCari = ((n % daftarCari.length) + daftarCari.length) % daftarCari.length;
    segarkanInfoCari();
    const m = daftarCari[urutCari];
    if (m && m.scrollIntoView) {
      try { m.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
    }
  }

  // ◀ ▶ — temuan sebelumnya / berikutnya
  function lompatTemuan(arah) {
    if (!daftarCari.length) return;
    keTemuan(urutCari < 0 ? 0 : urutCari + arah);
  }

  // gulir + sorot satu temuan di teks (pola sorot kuning yang sudah dipakai)
  function sorotTemuan(cuplik) {
    const isi = elSJ();
    if (!isi) return;
    const bersih = cuplik.replace(/^…\s*/, '').replace(/\s*…$/, '');
    const bagian = bersih.slice(0, 40);
    const par = Array.prototype.find.call(
      isi.querySelectorAll('.ay-sejarah-teks'),
      p => (p.textContent || '').indexOf(bagian) >= 0
    );
    if (!par) return;
    par.scrollIntoView({ block: 'center' });
    par.style.transition = 'background .25s';
    par.style.background = '#fff3cd';
    clearTimeout(window.__sjSorot);
    window.__sjSorot = setTimeout(() => { par.style.background = ''; }, 2600);
  }

  /* ------------------------------------------------------------
     BERSIHKAN — saat plugin dilepas
       ❌ Tidak menyentuh catatan & isi Alkitab; hanya buang hiasan kita.
     ------------------------------------------------------------ */
  function bersihkan() {
    // K55d dibatalkan 22 Sep 2026 — tombol kembali di barisnya sendiri;
    //   tetap lepas pendaftaran bar pintasan (kalau versi lama masih terdaftar)
    const a = Alkitab();
    if (a && typeof a.lepasPintasan === 'function') {
      try { a.lepasPintasan('sejarah'); } catch (e) {}
    }
    // K56 — buang tanda tautan ayat dari isi halaman mandiri
    bersihkanTandaHalaman();
    // K55c — tutup halaman mandiri & kosongkan isinya
    const hal = elHal();
    if (hal) hal.hidden = true;
    halamanAktif = false;
    const sj = elSJ();
    if (sj) sj.innerHTML = '';
    const sjHasil = document.getElementById('sj-hasil');
    if (sjHasil) { sjHasil.hidden = true; sjHasil.innerHTML = ''; }
    const sjBaris = document.getElementById('sj-cari-baris');
    if (sjBaris) sjBaris.hidden = true;
    const sjInp = document.getElementById('sj-cari');
    if (sjInp) sjInp.value = '';
    kataCari = '';

    // buang sisa hiasan & panel dari halaman baca
    const isi = elIsi();
    if (isi) {
      delete isi.dataset.sejarahDaftar;
      isi.querySelectorAll('.ay-sejarah-baris, .ay-sejarah-panel').forEach(e => e.remove());
    }
    // penghias tidak perlu dicabut (mekanisme tidak punya “lepas”),
    // cukup ditandai supaya tidak menyisipkan apa-apa lagi
    terdaftar = false;
  }

  /* ------------------------------------------------------------
     SIAPKAN OTOMATIS — dipanggil saat HALAMAN DIBUKA
       ⚠️ PELAJARAN NYATA (22 Sep 2026): tanpa ini, kalau plugin sudah
       terpasang lalu halaman dimuat ulang, `saatDipasang` TIDAK jalan lagi
       ⇒ penghias tidak pernah terdaftar ⇒ **tombol 📖 sejarah tidak muncul**
       (mesin juga tidak dimuat: `siap=false` selamanya).
       Pola SAMA seperti ANodesAlkitab.siapkanOtomatis() (K14).
     ------------------------------------------------------------ */
  function siapkanOtomatis() {
    const g = window.ANodesPlugin;
    if (!g || typeof g.dipasang !== 'function') return;
    if (!g.dipasang('sejarah')) return;        // plugin belum dipasang → tidak ada tanda
    pasangTanda();                             // daftarkan penghias ke halaman baca
    pasangPengait();                           // pasang pengait halaman mandiri (K55c)
    const s = mesin();
    if (s && typeof s.muat === 'function') s.muat().catch(() => {});
  }

  /* ------------------------------------------------------------
     API
     ------------------------------------------------------------ */
  return {
    pasangTanda, hiasAyatBaca, gambarPanel, bukaPengantar, bersihkan,
    siapkanOtomatis, tombolSejarah,
    // K55c — pintu plugin (🧩▼ / gudang) + halaman mandiri
    buka, bukaHalaman, tutupHalaman, gambarPengantar, pasangPengait,
    // K56 — tautan ayat & istilah di halaman sejarah + pulih dari Alkitab
    hiasHalamanSejarah, bersihkanTandaHalaman, pulihDariAlkitab,
    get aktif() { return halamanAktif; },
    versi: () => VERSI
  };
})();

// hidupkan begitu halaman siap (kalau plugin sudah terpasang)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    window.ANodesSejarahTampilan.siapkanOtomatis();
  });
} else {
  window.ANodesSejarahTampilan.siapkanOtomatis();
}