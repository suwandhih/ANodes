/* ============================================================
   ANodes — plugin/baca1tahun/tampilan.js
   TAMPILAN: 🗓️ Bacaan Alkitab 1 Tahun   (K96 — 3 Nov 2026)

   HALAMAN ke-10 (`#baca1tahun-halaman`) — anak `body`
     ⚠️ WAJIB anak `body`; kalau di dalam #app-utama ⇒ ikut tersembunyi (K8).

   SUSUNAN:
     ┌──────────────────────────────────────────────┐
     │ [🏠] 🗓️ BACAAN 1 TAHUN   365 hari · 42 %     │
     ├──────────────────────────────────────────────┤
     │ 🅰️ Berurutan  🅱️ PL+PB  ⭐ EDW               │ ← pilih rencana
     ├──────────────────────────────────────────────┤
     │ HARI 47 dari 365 · Selasa, 3 Nov 2026        │
     │ ▓▓▓▓▓▓▓░░░░░░░░░░░░░░  42,1 %                │
     │ 🔥 12 hari berturut-turut · 154 hari selesai  │
     │                                              │
     │ 📖 HARI INI                                  │
     │   Kejadian 1 – Kejadian 3   3 pasal · 80 ayat │
     │   [ 📖 Buka di Alkitab ]  [ ✓ Sudah dibaca ] │
     │ 📅 BESOK                                     │
     │   Kejadian 4 – Kejadian 6   3 pasal · 80 ayat │
     ├──────────────────────────────────────────────┤
     │ 🗓️ KALENDER 365 HARI                          │
     │ [1][2][3][4][5][6][7] …                      │ ← hijau = selesai
     └──────────────────────────────────────────────┘

   ❌ TIDAK menyentuh mesin Alkitab — memakai `bukaRentang()` /
      `bukaHalaman()` yang SUDAH ADA.
   ============================================================ */

window.ANodesBacaTampilan = (function () {
  'use strict';

  const VERSI = 'v3Nov-b';
  const JENIS_HAL = 'baca1tahun';

  function mesin() { return window.ANodesBaca || null; }
  function mesinAlkitab() { return window.ANodesAlkitab || null; }
  function tampilAlkitab() { return window.ANodesAlkitabTampilan || null; }

  function hal() { return document.getElementById('baca1tahun-halaman'); }
  function wadahIsi() { return document.getElementById('bt-isi'); }
  function elVersi() { return document.getElementById('bt-versi'); }

  function pluginAktif() {
    const P = window.ANodesPlugin;
    if (!P || !P.dipasang) return false;
    try { return P.dipasang('baca1tahun'); } catch (e) { return false; }
  }

  // ------------------------------------------------------------
  // BUKA / TUTUP HALAMAN
  //   ⚠️ halaman lain WAJIB disembunyikan sendiri (pindahKeBaca() hanya
  //      mengurus #app-utama & #baca-alkitab — pelajaran K81b).
  // ------------------------------------------------------------
  let asalHalaman = null;

  function bukaHalaman() {
    const h = hal();
    if (!h) return false;

    // ingat halaman mana yang sedang tampil SEBELUM disembunyikan
    asalHalaman = null;
    const semua = document.querySelectorAll('body > .app');
    for (const el of semua) {
      if (el !== h && !el.hidden) { asalHalaman = el.id; break; }
    }

    // ingat posisi di catatan (untuk 🏠)
    if (window.ANodesEditor && window.ANodesEditor.ingatPosisi) {
      try { window.ANodesEditor.ingatPosisi(); } catch (e) {}
    }
    // Alkitab tidak lagi “dipinjamkan” ke halaman lain
    if (window.ANodesKamusTampilan && window.ANodesKamusTampilan.dariKamus &&
        window.ANodesKamusTampilan.dariKamus()) {
      try { window.ANodesKamusTampilan.pulihDariAlkitab(); } catch (e) {}
    }

    semua.forEach(el => { if (el !== h) el.hidden = true; });
    h.hidden = false;
    gambar();
    return true;
  }

  function tutupHalaman() {
    const h = hal();
    if (h) h.hidden = true;

    const tujuan = asalHalaman;
    asalHalaman = null;

    if (tujuan && tujuan !== 'app-utama') {
      const t = document.getElementById(tujuan);
      if (t) {
        t.hidden = false;
        // halaman Alkitab perlu digambar ulang kalau isinya kosong
        if (tujuan === 'baca-alkitab') {
          const A = tampilAlkitab();
          if (A && A.bukaHalaman) { try { A.bukaHalaman(); } catch (e) {} }
        }
        return true;
      }
    }

    // bawaan: kembali ke catatan
    const utama = document.getElementById('app-utama');
    if (utama) utama.hidden = false;
    if (window.ANodesEditor && window.ANodesEditor.pulihPosisi) {
      try { window.ANodesEditor.pulihPosisi(); } catch (e) {}
    }
    return true;
  }

  // ------------------------------------------------------------
    // K97 (3 Nov 2026) — TOMBOL 📅 DI NAVBAR HALAMAN BACA ALKITAB
    //   Bapak: *“saya mau minta bacaan di tempatkan di dalam menu seperti yg
    //   pasted image ada panah”* ⇒ Bacaan 1 Tahun harus PUNYA PINTU di
    //   navbar halaman baca (baris ikon), ❌ bukan hanya lewat 🧩 gudang plugin.
    //
    //   ⚠️ Pola SAMA seperti 🔖 Bookmark (K82) — plugin MENEMPELKAN tombolnya
    //      sendiri ke `.ay-nav-b1`; plugin 📖 Alkitab TIDAK perlu tahu plugin
    //      ini ada. Urutan tombol mengikuti urutan skrip di `index.html`
    //      (bookmark dulu → baca1tahun → …), jadi 📅 muncul SEBELUM 🔖.
    //
    //   ⚠️ `appendChild` dipanggil ULANG tiap siapkanOtomatis() — sekaligus
    //      memindahkan tombol ke ujung kalau barisnya digambar ulang.
    // ------------------------------------------------------------
  function pasangTombolNavbar() {
      const nav = document.querySelector('#baca-alkitab .ay-nav-b1')
               || document.querySelector('#baca-alkitab .alkitab-nav');
      if (!nav) return false;
      let b = document.getElementById('baca-bacaan');
      if (!b) {
        b = document.createElement('button');
        b.id = 'baca-bacaan';
        b.className = 'ay-bacaan';
        b.addEventListener('click', (e) => {
          e.preventDefault();
          bukaDariAlkitab();
        });
      }
      b.textContent = '📅';
      b.title = 'Bacaan Alkitab 1 Tahun — lihat bacaan hari ini (📅 belum dibaca · ✅ sudah)';
      // selalu di UJUNG baris ikon (pola sama seperti 🔖 & 📤) — `appendChild`
      // sekaligus memindahkannya kalau barisnya digambar ulang
      nav.appendChild(b);
      return true;
    }

  // Buka halaman 🗓️ dari halaman baca Alkitab.
    //   🏠 di halaman bacaan ⇒ kembali ke HALAMAN BACA (bukan catatan).
    //   ⚠️ JANGAN menyembunyikan `#baca-alkitab` di sini — `bukaHalaman()` yang
    //      mencari sendiri halaman mana yang sedang tampil untuk dicatat sebagai
    //      asal. Kalau disembunyikan lebih dulu, asalnya jadi `#app-utama`
    //      (cacat nyata yang tertangkap uji K97-14).
    function bukaDariAlkitab() {
      return bukaHalaman();
    }

  // dipanggil plugin 📖 Alkitab saat tombol 🏠 ditekan dari halaman bacanya
  function pulihDariAlkitab(info) {
      const h = hal();
      if (!h) return false;
      document.querySelectorAll('body > .app').forEach(a => { a.hidden = true; });
      h.hidden = false;
      gambar();
      return true;
    }

  function daftarkanPemulih() {
        const T = tampilAlkitab();
        if (T && typeof T.daftarPemulihHalaman === 'function') {
          try { T.daftarPemulihHalaman(JENIS_HAL, pulihDariAlkitab); } catch (e) {}
          return true;
        }
        return false;
      }

      // ------------------------------------------------------------
      // GAMBAR
      // ------------------------------------------------------------
  function gambar() {
    const w = wadahIsi();
    if (!w) return;
    const m = mesin();
    if (!m) return;

    if (!m.siap()) {
      w.innerHTML = '';
      w.appendChild(pesan('⏳ Menyiapkan rencana bacaan…'));
      m.muat();
      return;
    }

    // mesin Alkitab dipakai untuk nama kitab & membuka pasal
    const A = mesinAlkitab();
    if (A && A.siap && !A.siap()) {
      w.innerHTML = '';
      w.appendChild(pesan('⏳ Menyiapkan data Alkitab…'));
      if (A.muat) A.muat();
      return;
    }

    w.innerHTML = '';
    w.appendChild(kartuRingkas(m));
    w.appendChild(barRencana(m));
    w.appendChild(kartuHari(m));
    w.appendChild(kalender(m));
    w.appendChild(kaki());

    const v = elVersi();
    if (v) v.textContent = '365 hari · ' + m.persen() + ' % selesai';
        segarkanTombolNavbar();      // K97 — ikon 📅 ⇄ ✅ di navbar Alkitab
      }

  function pesan(teks) {
    const d = document.createElement('div');
    d.className = 'bt-pesan';
    d.textContent = teks;
    return d;
  }

  // --- ringkasan: progres + beruntun -----------------------------
  function kartuRingkas(m) {
    const p = m.ambilProgres();
    const total = m.jumlahHari(p.rencana) || 365;
    const selesai = p.jumlahSelesai;
    const persen = m.persen();
    const ini = m.hariIniKe();

    const d = document.createElement('div');
    d.className = 'bt-ringkas';

    const baris1 = document.createElement('div');
    baris1.className = 'bt-ringkas-baris';
    const hariTeks = (ini < 1)
      ? 'Belum mulai'
      : (ini > total ? 'Rencana sudah selesai' : 'Hari ' + ini + ' dari ' + total);
    baris1.textContent = hariTeks + ' · ' + m.tanggalIndonesia(m.hariIni());
    d.appendChild(baris1);

    const bar = document.createElement('div');
    bar.className = 'bt-bar';
    const isi = document.createElement('span');
    isi.className = 'bt-bar-isi';
    isi.style.width = Math.min(100, persen) + '%';
    bar.appendChild(isi);
    d.appendChild(bar);

    const baris2 = document.createElement('div');
    baris2.className = 'bt-ringkas-baris bt-kecil';
    const sisa = Math.max(0, total - selesai);
    baris2.textContent = persen + ' % · ' + selesai + ' hari selesai · sisa ' + sisa + ' hari'
      + '  ·  🔥 ' + m.beruntun() + ' hari berturut-turut';
    d.appendChild(baris2);

    return d;
  }

  // --- pilih rencana --------------------------------------------
  function barRencana(m) {
    const aktif = m.rencanaAktif();
    const d = document.createElement('div');
    d.className = 'bt-rencana';
    m.daftarRencana().forEach(r => {
      const b = document.createElement('button');
      b.className = 'bt-rencana-btn' + (r.id === aktif ? ' aktif' : '');
      b.textContent = r.nama;
      b.title = r.ket;
      b.onclick = () => {
        if (m.gantiRencana(r.id)) gambar();
      };
      d.appendChild(b);
    });
    return d;
  }

  // --- kartu hari ini + besok -----------------------------------
  function kartuHari(m) {
    const d = document.createElement('div');
    d.className = 'bt-hari';

    const aktif = m.rencanaAktif();
    const ini = m.hariIniKe();
    const total = m.jumlahHari(aktif) || 365;

    if (ini < 1) {
      d.appendChild(pesan('Rencana dimulai ' + m.tanggalIndonesia(m.ambilProgres().mulai) + '.'));
      const b = document.createElement('button');
      b.className = 'bt-btn bt-btn-utama';
      b.textContent = '▶ Mulai hari ini';
      b.onclick = () => { m.mulaiHariIni(); gambar(); };
      d.appendChild(b);
      return d;
    }

    if (ini > total) {
      d.appendChild(pesan('🎉 Selamat! Rencana ' + total + ' hari sudah selesai.'));
      const b = document.createElement('button');
      b.className = 'bt-btn';
      b.textContent = '🔄 Mulai lagi dari hari 1';
      b.onclick = () => {
        if (window.confirm('Mulai lagi dari hari 1? Kemajuan baca akan dikosongkan.')) {
          m.kosongkanProgres(); m.mulaiHariIni(); gambar();
        }
      };
      d.appendChild(b);
      return d;
    }

    // HARI INI
    const judul = document.createElement('div');
    judul.className = 'bt-judul';
    judul.textContent = '📖 Hari ini — hari ' + ini;
    d.appendChild(judul);
    d.appendChild(isBlok(m, m.hariKe(ini, aktif)));

    const sudah = m.sudahDibaca(ini);
    const aksi = document.createElement('div');
    aksi.className = 'bt-aksi';

    const bBuka = document.createElement('button');
    bBuka.className = 'bt-btn bt-btn-utama';
    bBuka.textContent = '📖 Buka di Alkitab';
    bBuka.onclick = () => bukaDiAlkitab(m, ini);
    aksi.appendChild(bBuka);

    const bTandai = document.createElement('button');
    bTandai.className = 'bt-btn' + (sudah ? ' bt-btn-selesai' : '');
        bTandai.textContent = sudah ? '✓ Sudah dibaca' : '○ Tandai sudah dibaca';
    bTandai.title = sudah ? 'Tekan untuk membatalkan tanda hari ini' : 'Tandai hari ini sudah dibaca';
    bTandai.onclick = () => { m.tandaiDibaca(ini, !sudah); gambar(); };
    aksi.appendChild(bTandai);

    d.appendChild(aksi);

    // SATU hari ke depan (cukup — supaya layar tidak panjang)
    const besok = ini + 1;
    if (besok <= total) {
      const j2 = document.createElement('div');
      j2.className = 'bt-judul bt-judul-kecil';
      j2.textContent = '📅 Besok — hari ' + besok;
      d.appendChild(j2);
      d.appendChild(isBlok(m, m.hariKe(besok, aktif)));
    }

    return d;
  }

  // isi satu hari → baris per jalur
  function isBlok(m, h) {
    const w = document.createElement('div');
    w.className = 'bt-hari-isi';
    if (!h) { w.appendChild(pesan('Tidak ada bacaan.')); return w; }

    const A = mesinAlkitab();
    const namaKitab = k => {
      if (A && A.siap && A.siap()) {
        const it = A.daftarKitab().find(x => x.no === k);
        if (it) return it.nama;
      }
      return 'Kitab ' + k;
    };

    h.blok.forEach(b => {
      const baris = document.createElement('div');
      baris.className = 'bt-blok';

      const tag = document.createElement('span');
      tag.className = 'bt-blok-tag';
      const jal = (b.jalur || '').toString();
      tag.textContent = jal === 'pb' ? 'PB' : jal === 'pl' ? 'PL'
        : jal === 'mzm' ? 'Mzm' : jal === 'ams' ? 'Ams' : '📖';
      baris.appendChild(tag);

      const teks = document.createElement('span');
      teks.className = 'bt-blok-teks';
            // ⚠️ Nama kitab HANYA ditulis sekali bila kitabnya sama
            //    (dulu jadi “Kejadian 1 – Kejadian 3” — boros & sulit dibaca)
            const nd = namaKitab(b.dari.k);
            const ns = namaKitab(b.sampai.k);
            let labelTeks;
            if (b.dari.k === b.sampai.k) {
              labelTeks = (b.dari.p === b.sampai.p)
                ? nd + ' ' + b.dari.p
                : nd + ' ' + b.dari.p + '–' + b.sampai.p;
            } else {
              labelTeks = nd + ' ' + b.dari.p + ' – ' + ns + ' ' + b.sampai.p;
            }
            teks.textContent = labelTeks;
            baris.appendChild(teks);

      const ket = document.createElement('span');
      ket.className = 'bt-blok-ket';
      ket.textContent = b.pasal.length + ' pasal · ' + b.ayat + ' ayat';
      baris.appendChild(ket);

            // tombol kecil per blok — supaya PL dan PB bisa dibuka satu-satu
            const bBuka = document.createElement('button');
            bBuka.className = 'bt-blok-buka';
            bBuka.textContent = '📖';
            bBuka.title = 'Buka ' + labelTeks + ' di Alkitab';
            bBuka.onclick = (e) => { e.stopPropagation(); bukaBlok(b); };
            baris.appendChild(bBuka);

            w.appendChild(baris);
    });

    if (h.blok.length > 1) {
      const tot = document.createElement('div');
      tot.className = 'bt-total';
      tot.textContent = 'Total hari ini: ' + h.pasal.length + ' pasal · ' + h.ayat + ' ayat';
      w.appendChild(tot);
    }

    return w;
  }

  // ------------------------------------------------------------
  // BUKA DI ALKITAB
  //   Satu blok = satu rentang. Kalau lebih dari satu blok (PL+PB), yang
  //   dibuka blok PERTAMA — sisanya bisa dibuka dari kalender.
  // ------------------------------------------------------------
  function bukaDiAlkitab(m, n) {
    const aktif = m.rencanaAktif();
    const h = m.hariKe(n, aktif);
    if (!h || !h.blok.length) return false;

      const b = h.blok[0];
      return bukaBlok(b);
    }

    // buka SATU blok (dipakai tombol per-baris & tombol utama)
  function bukaBlok(b) {
      const T = tampilAlkitab();
      if (!T) {
        toast('💡 Pasang plugin 📖 Alkitab dahulu');
        return false;
      }

      const ref = { no: b.dari.k, pasal: b.dari.p, ayat1: 0, ayat2: 0 };

      // sembunyikan halaman ini lebih dulu (pelajaran K81b)
      const hh = hal();
      if (hh) hh.hidden = true;

      if (T.bukaHalaman) { try { T.bukaHalaman(); } catch (e) {} }
      if (T.bukaRentang) {
        try { T.bukaRentang(ref); } catch (e) {}
      } else if (T.gambarPasal) {
        try { T.gambarPasal(b.dari.k, b.dari.p, 0, true); } catch (e) {}
      }
      return true;
    }

  function toast(teks) {
      try {
        const P = window.ANodesPlugin;
        if (P && P.toast) { P.toast(teks); return; }
      } catch (e) {}
      console.log(teks);
    }

  // ------------------------------------------------------------
  // KALENDER 365 HARI
  // ------------------------------------------------------------
  function kalender(m) {
    const d = document.createElement('div');
    d.className = 'bt-kal';

    const judul = document.createElement('div');
    judul.className = 'bt-judul';
    judul.textContent = '🗓️ Kalender — klik satu hari untuk melihat & membuka';
    d.appendChild(judul);

    const pakai = m.petaSelesai();
    const aktif = m.rencanaAktif();
    const total = m.jumlahHari(aktif) || 365;
    const ini = m.hariIniKe();

    const grid = document.createElement('div');
    grid.className = 'bt-kal-grid';

    for (let i = 1; i <= total; i++) {
      const b = document.createElement('button');
      b.className = 'bt-kal-sel' + (pakai[String(i)] ? ' selesai' : '') + (i === ini ? ' ini' : '');
      b.textContent = i;
      b.title = m.labelHari(i, aktif) || ('Hari ' + i);
      b.onclick = () => lihatHari(m, i);
      grid.appendChild(b);
    }
    d.appendChild(grid);
    return d;
  }

  // klik satu hari di kalender ⇒ tampilkan rinciannya di atas kalender
  let hariDilihat = null;

  function lihatHari(m, n) {
    const h = m.hariKe(n, m.rencanaAktif());
    if (!h) return;

    const lama = document.getElementById('bt-lihat');
    if (lama) lama.remove();
    if (hariDilihat === n) { hariDilihat = null; return; }
    hariDilihat = n;

    const kotak = document.createElement('div');
    kotak.className = 'bt-lihat';
    kotak.id = 'bt-lihat';

    const kepala = document.createElement('div');
    kepala.className = 'bt-judul';
    kepala.textContent = '📅 Hari ' + n + ' — ' + tanggalHari(m, n);
    kotak.appendChild(kepala);

    kotak.appendChild(isBlok(m, h));

    const aksi = document.createElement('div');
    aksi.className = 'bt-aksi';

    const bBuka = document.createElement('button');
    bBuka.className = 'bt-btn bt-btn-utama';
    bBuka.textContent = '📖 Buka di Alkitab';
    bBuka.onclick = () => bukaDiAlkitab(m, n);
    aksi.appendChild(bBuka);

    const sudah = m.sudahDibaca(n);
    const bTandai = document.createElement('button');
    bTandai.className = 'bt-btn' + (sudah ? ' bt-btn-selesai' : '');
    bTandai.textContent = sudah ? '✓ Sudah dibaca' : '✓ Tandai sudah dibaca';
    bTandai.onclick = () => { m.tandaiDibaca(n, !sudah); gambar(); };
    aksi.appendChild(bTandai);

    const bTutup = document.createElement('button');
    bTutup.className = 'bt-btn';
    bTutup.textContent = '✕ Tutup';
    bTutup.onclick = () => { const k = document.getElementById('bt-lihat'); if (k) k.remove(); hariDilihat = null; };
    aksi.appendChild(bTutup);

    kotak.appendChild(aksi);

    const kal = document.querySelector('.bt-kal');
    if (kal && kal.parentElement) kal.parentElement.insertBefore(kotak, kal);
    if (kotak.scrollIntoView) kotak.scrollIntoView({ block: 'nearest' });
  }

  function tanggalHari(m, n) {
    const p = m.ambilProgres();
    const ms = new Date(
      Number(p.mulai.slice(0, 4)),
      Number(p.mulai.slice(5, 7)) - 1,
      Number(p.mulai.slice(8, 10))
    ).getTime();
    const d = new Date(ms + (n - 1) * 86400000);
    const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return d.getDate() + ' ' + BULAN[d.getMonth()] + ' ' + d.getFullYear();
  }

  // ------------------------------------------------------------
  // KAKI — pengaturan tanggal mulai
  // ------------------------------------------------------------
  function kaki() {
    const d = document.createElement('div');
    d.className = 'bt-kaki';
    const p = mesin().ambilProgres();

    const baris = document.createElement('div');
    baris.className = 'bt-kaki-baris';
    baris.textContent = 'Mulai: ' + mesin().tanggalIndonesia(p.mulai);
    d.appendChild(baris);

    const aksi = document.createElement('div');
    aksi.className = 'bt-aksi';

    const b1 = document.createElement('button');
    b1.className = 'bt-btn';
    b1.textContent = '📅 Mulai hari ini';
    b1.title = 'Jadikan hari ini sebagai hari ke-1';
    b1.onclick = () => {
      if (window.confirm('Jadikan HARI INI sebagai hari ke-1? Kemajuan baca tidak dihapus.')) {
        mesin().mulaiHariIni(); gambar();
      }
    };
    aksi.appendChild(b1);

    const b2 = document.createElement('button');
    b2.className = 'bt-btn';
    b2.textContent = '🔄 Kosongkan kemajuan';
    b2.onclick = () => {
      if (window.confirm('Kosongkan semua tanda “sudah dibaca”?')) {
        mesin().kosongkanProgres();
        mesin().mulaiHariIni();
        gambar();
      }
    };
    aksi.appendChild(b2);

    d.appendChild(aksi);
    return d;
  }

  // ------------------------------------------------------------
  // PENGHAIT
  // ------------------------------------------------------------
  function pasangPengait() {
    const k = document.getElementById('bt-kembali');
    if (k) k.onclick = () => tutupHalaman();

    const h = hal();
    if (h && h.dataset.btSiap === '1') return;
    if (h) h.dataset.btSiap = '1';

    document.addEventListener('keydown', (e) => {
      const hh = hal();
      if (!hh || hh.hidden) return;
      if (e.key === 'Escape' || (e.ctrlKey && (e.key === 'b' || e.key === 'B'))) {
        e.preventDefault();
        tutupHalaman();
      }
    });
  }

  function siapkanOtomatis() {
    pasangPengait();
      pasangTombolNavbar();          // K97 — tombol 📅 di navbar halaman baca
      daftarkanPemulih();            // K97 — 🏠 dari Alkitab kembali ke halaman ini
      const m = mesin();
      if (m) {
        m.siapkanOtomatis();
        m.padaSiap(() => {
          const h = hal();
          if (h && !h.hidden) gambar();
          const v = elVersi();
          if (v && m.siap()) v.textContent = '365 hari · ' + m.persen() + ' % selesai';
          segarkanTombolNavbar();
        });
      }
    }

    // keadaan tombol 📅: ⌛ = hari ini belum dibaca · ✅ = sudah
  function segarkanTombolNavbar() {
      const b = document.getElementById('baca-bacaan');
      if (!b) return;
      const m = mesin();
      if (!m || !m.siap()) return;
      const sudah = m.sudahDibaca(m.hariIniKe());
      b.textContent = sudah ? '✅' : '📅';
      b.title = sudah
        ? 'Bacaan 1 Tahun — hari ini SUDAH dibaca ✅ (klik untuk membuka)'
        : 'Bacaan 1 Tahun — hari ini BELUM dibaca 📅 (klik untuk membuka)';
    }

  function bersihkan() {
    const h = hal();
    if (h) {
      h.hidden = true;
      delete h.dataset.btSiap;
    }
    const w = wadahIsi();
    if (w) w.innerHTML = '';
    hariDilihat = null;
    asalHalaman = null;
    // kalau halaman ini sedang tampil, kembalikan ke catatan
    const utama = document.getElementById('app-utama');
    if (utama && utama.hidden) utama.hidden = false;
  }

  // ------------------------------------------------------------
  // dipanggil saat halaman dimuat (pola WAJIB plugin — pelajaran K92)
  // ------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', siapkanOtomatis);
  } else {
    setTimeout(siapkanOtomatis, 0);
  }

  return {
    VERSI, JENIS_HAL,
    versi: () => VERSI,
    bukaHalaman, tutupHalaman, gambar, siapkanOtomatis, bersihkan,
      bukaDiAlkitab, bukaBlok, lihatHari,
      // K97 — pintu di navbar halaman baca Alkitab
      pasangTombolNavbar, bukaDariAlkitab, pulihDariAlkitab, segarkanTombolNavbar,
      daftarkanPemulih,
      // pembaca keadaan untuk uji
      _hal: hal, _asal: () => asalHalaman
    };
})();