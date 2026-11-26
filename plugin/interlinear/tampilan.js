/* ============================================================
   ANodes — plugin/interlinear/tampilan.js
   TAMPILAN: 🔤 Interlinear di halaman baca Alkitab   — K85
   ------------------------------------------------------------
   Pola SAMA dengan 🖊 Penguat (K54):
     • tombol kecil `🔤` disisipkan di tiap baris `.ayat-baca`
     • memakai sambungan RESMI `tambahPenghias()` / `jalankanPenghias()`
       milik plugin Alkitab ⇒ plugin Alkitab TIDAK PERLU tahu plugin ini ada
     • dilepas plugin ⇒ tombol & kolom ikut hilang, Alkitab tetap utuh

   ⚠️ Penanda “sudah dihiasi” dipasang di BARIS AYAT (bukan wadah) —
      `gambarPasal()` mengganti isi wadah tetapi atribut wadah tetap
      (pelajaran K54: penanda di wadah ⇒ tombol tidak digambar ulang).
   ============================================================ */

window.ANodesInterlinearTampilan = (function () {
  'use strict';

  const VERSI = 'v3Nov-e';

  let semuaTerbuka = false;
  let pasalSekarang = null;      // 'kitab.pasal'
  let strongAktif = null;        // nomor Strong yang sedang dibuka di panel bawah

  function mesin() { return window.ANodesInterlinear; }
  function alkitabTampilan() { return window.ANodesAlkitabTampilan; }

  /* ------------------------------------------------------------
     K85 tahap 2 (3 Nov 2026) — DUA BENTUK KOLOM
     ------------------------------------------------------------
     • kitab 40–43 (4 Injil)  → Bentuk A: kata Indonesia ⇄ kata Yunani
       (sumber idkjv punya teks Indonesia per ayat)
     • kitab 44–66 (Kisah 26 s/d Wahyu) → Bentuk B: kata Yunani +
       alih huruf + arti Indonesia (sumber idkjv TIDAK punya teks
       Indonesia untuk bagian ini — terukur 3 Nov 2026)
     ------------------------------------------------------------ */
  function mesinPb() { return window.ANodesPb; }

  function bentukUntuk(kitab) {
    const no = Number(kitab);
    if (no >= 40 && no <= 43) return 'A';
    if (no >= 44 && no <= 66) return 'B';
    return 'A';
  }

  function mesinIl(kitab) {
    return bentukUntuk(kitab) === 'B' ? mesinPb() : mesin();
  }

  function pluginAktif() {
    return !!(window.ANodesPlugin && typeof window.ANodesPlugin.dipasang === 'function'
      && window.ANodesPlugin.dipasang('interlinear'));
  }

  // ------------------------------------------------------------
  // penghias — dipanggil plugin Alkitab tiap selesai menggambar pasal
  // ------------------------------------------------------------
  function hiasAyatBaca(ctx) {
    if (!ctx || !ctx.isi) return;
    if (!pluginAktif()) return;
    const m = mesinIl(ctx.kitab);
    if (!m || !m.siap()) return;

    const kunci = ctx.kitab + '.' + ctx.pasal;
    const barisPertama = ctx.isi.querySelector('.ayat-baca[data-ayat]');
    if (barisPertama && barisPertama.dataset.ilHias === kunci) return;

    semuaTerbuka = false;
    pasalSekarang = kunci;
    ctx.isi.querySelectorAll('.il-sisip').forEach(x => x.remove());

    const peta = m.petaPasal(ctx.kitab, ctx.pasal);
    ctx.isi.querySelectorAll('.ayat-baca[data-ayat]').forEach(baris => {
      const no = Number(baris.dataset.ayat);
      if (baris.dataset.ilHias === undefined) baris.dataset.ilHias = kunci;
      if (!peta[no]) return;                 // ayat tanpa data → tanpa tombol
      baris.appendChild(wadahTombol(ctx, no, ctx.isi));
    });
  }

  function wadahTombol(ctx, no, isi) {
    const wadah = document.createElement('div');
    wadah.className = 'il-sisip';
    wadah.dataset.ayat = String(no);

    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'il-toggle';
    b.textContent = '🔤';
    b.title = '🔤 Interlinear — bahasa asli + kode Strong (tekan lagi untuk menyembunyikan)';
    b.setAttribute('aria-label', 'interlinear');
    b.addEventListener('click', () => {
      saatTombol(isi, ctx.kitab, ctx.pasal);
    });

    wadah.appendChild(b);
    return wadah;
  }

  // ------------------------------------------------------------
  // buka / tutup SEMUA (pola K54 — satu keadaan untuk seluruh pasal)
  // ------------------------------------------------------------
  function saatTombol(isi, kitab, pasal) {
    if (!isi) return;
    if (semuaTerbuka) { tutupSemua(isi); return; }

    tutupSemua(isi);
    semuaTerbuka = true;

    isi.querySelectorAll('.il-sisip').forEach(wadah => {
      const no = Number(wadah.dataset.ayat);
      const m = mesinIl(kitab);
      if (!m) return;
      const kataArr = m.ayat(kitab, pasal, no);
      if (!kataArr) return;
      wadah.appendChild(gambarKolom(kitab, pasal, no, kataArr));
      wadah.classList.add('terbuka');
      const tb = wadah.querySelector('.il-toggle');
      if (tb) tb.classList.add('aktif');
    });
  }

  function tutupSemua(isi) {
    semuaTerbuka = false;
    strongAktif = null;
    if (!isi) return;
    isi.querySelectorAll('.il-sisip').forEach(w => {
      w.querySelectorAll('.il-kolom').forEach(k => k.remove());
      w.classList.remove('terbuka');
      const tb = w.querySelector('.il-toggle');
      if (tb) tb.classList.remove('aktif');
    });
  }

  // ------------------------------------------------------------
  // kolom interlinear satu ayat
  // ------------------------------------------------------------
  function gambarKolom(kitab, pasal, noAyat, kataArr) {
    const bentuk = bentukUntuk(kitab);
    const kolom = document.createElement('div');
    kolom.className = 'il-kolom';
    kolom.dataset.ayat = String(noAyat);
    kolom.dataset.bentuk = bentuk;

    const kepala = document.createElement('div');
    kepala.className = 'il-kepala';
    const namaKitab = namaKitabDari(kitab);
    kepala.textContent = '🔤 ' + namaKitab + ' ' + pasal + ':' + noAyat + ' · Yunani → Indonesia';
    kolom.appendChild(kepala);

    const daftar = document.createElement('div');
    daftar.className = 'il-daftar';

    const m = mesinIl(kitab);

    kataArr.forEach(item => {
      const kata = item[0];
      const nomorArr = item[1];
      const alih = item[2] || '';

      const baris = document.createElement('div');
      baris.className = 'il-baris';

      /* Bentuk B — kata Yunani + alih huruf (Bentuk A tidak punya alih huruf) */
      if (bentuk === 'B') {
        const kYunani = document.createElement('span');
        kYunani.className = 'il-yunani';
        kYunani.textContent = kata;
        baris.appendChild(kYunani);

        if (alih) {
          const kAlih = document.createElement('span');
          kAlih.className = 'il-alih';
          kAlih.textContent = '(' + alih + ')';
          baris.appendChild(kAlih);
        }
      } else {
        const kId = document.createElement('span');
        kId.className = 'il-kata';
        kId.textContent = kata;
        baris.appendChild(kId);
      }

      const kStrong = document.createElement('span');
      kStrong.className = 'il-strong';
      nomorArr.forEach((nm, i) => {
        if (i) kStrong.appendChild(document.createTextNode(' '));
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'il-chip';
        chip.textContent = nm;
              chip.title = 'Lihat arti ' + nm + ' — keterangan muncul TEPAT DI BAWAH baris ini';
              chip.addEventListener('click', () => tampilStrong(nm, baris, kitab));
        kStrong.appendChild(chip);
      });
      baris.appendChild(kStrong);

      const kArti = document.createElement('span');
      kArti.className = 'il-arti';
      const arti = [];
      nomorArr.forEach(nm => {
        const e = m && m.strong(nm);
        if (e && e.i && e.i.length) arti.push(e.i[0]);
      });
      if (arti.length) {
        kArti.textContent = arti.join(' · ');
      } else if (bentuk === 'B') {
        kArti.textContent = '(arti belum tersedia)';
        kArti.classList.add('il-arti-kosong');
      }
      baris.appendChild(kArti);

      daftar.appendChild(baris);
    });

    kolom.appendChild(daftar);

        // ⚠️ K98 (3 Nov 2026) — panel arti TIDAK lagi di ujung kolom.
        //    Panel dibuat PALING AKHIR (`tampilStrong`) dan ditaruh TEPAT DI BAWAH
        //    baris yang chipnya diklik. Sebelumnya panel selalu di dasar kolom ⇒
        //    kalau ayatnya banyak kata, keterangan muncul JAUH di bawah (keluhan
        //    Bapak: *“klik jatuh keterangan jauh apalagi kata banyak keterangan
        //    ada dibawah”*).

        // atribusi lisensi (WAJIB — syarat CC BY 4.0)
    const kaki = document.createElement('div');
    kaki.className = 'il-kaki';
    kaki.textContent = bentuk === 'B'
      ? 'Sumber: STEPBible TAGNT (CC BY 4.0 · STEPBible.org / Tyndale House Cambridge) · Strong\'s Greek (Public Domain) · arti Indonesia oleh ANodes'
      : 'Sumber: idkjv (Public Domain) · Strong\'s Greek (Public Domain / CC BY 4.0) · arti Indonesia oleh ANodes';
    kolom.appendChild(kaki);

    return kolom;
  }

  // K98 (3 Nov 2026) — panel arti TARUH TEPAT DI BAWAH baris yang diklik.
    //   `baris` = elemen `.il-baris` tempat chip Strong berada (❌ bukan kolom).
    //   Satu slot per kolom: panel lama dibuang dulu, jadi tidak menumpuk.
    function tampilStrong(nomor, baris, kitab) {
      if (!baris) return;
      const kolom = baris.closest('.il-kolom');

      // klik nomor yang sama ⇒ panel ditutup (toggle)
      const lama = baris._ilPanel;
      if (lama && lama.dataset.nomor === String(nomor) && !lama.hidden) {
        lama.hidden = true;
        baris._ilPanel = null;
        strongAktif = null;
        return;
      }

      // buang panel mana pun yang sedang terbuka (satu slot saja)
      //   ⚠️ WAJIB `.remove()` — kalau hanya `hidden = true`, panel lama
      //      MENUMPUK di DOM (cacat nyata yang tertangkap uji K98-20).
      if (kolom) {
        kolom.querySelectorAll('.il-panel').forEach(p => {
          const b = p.closest('.il-baris');
          if (b) b._ilPanel = null;
          else if (p.parentElement && p.parentElement.parentElement) {
            const bb = p.parentElement.parentElement.closest('.il-baris');
            if (bb) bb._ilPanel = null;
          }
          p.remove();
        });
      }
      if (lama && lama.parentElement) lama.remove();

      strongAktif = nomor;
      const m = mesinIl(kitab);
      const e = m && m.strong(nomor);

      const panel = document.createElement('div');
      panel.className = 'il-panel';
      panel.dataset.nomor = String(nomor);
      baris._ilPanel = panel;

      const judul = document.createElement('div');
      judul.className = 'il-panel-judul';
      judul.textContent = nomor + (e && e.l ? ' · ' + e.l : '') + (e && e.t ? ' · ' + e.t : '');
      panel.appendChild(judul);

      if (!e) {
        const kosong = document.createElement('div');
        kosong.className = 'il-panel-kosong';
        kosong.textContent = 'Arti untuk nomor ini belum tersedia.';
        panel.appendChild(kosong);
      } else {
        if (e.i && e.i.length) {
          const lbl = document.createElement('div');
          lbl.className = 'il-panel-lbl';
          lbl.textContent = bentukUntuk(kitab) === 'B'
            ? 'Arti Indonesia:'
            : 'Arti (dari pemakaian nyata di 4 Injil):';
          panel.appendChild(lbl);

          const kata = document.createElement('div');
          kata.className = 'il-panel-arti';
          kata.textContent = e.i.join(' · ');
          panel.appendChild(kata);
        }

        if (e.e) {
          const lbl2 = document.createElement('div');
          lbl2.className = 'il-panel-lbl';
          lbl2.textContent = 'Strong (Inggris, Public Domain):';
          panel.appendChild(lbl2);

          const en = document.createElement('div');
          en.className = 'il-panel-en';
          en.textContent = e.e;
          panel.appendChild(en);
        }
      }

      // TEPAT DI BAWAH baris yang diklik
      if (baris.parentElement) baris.parentElement.insertBefore(panel, baris.nextSibling);
      else if (kolom) kolom.appendChild(panel);
      return panel;
    }

  function namaKitabDari(no) {
    const m = window.ANodesAlkitab;
    if (m && typeof m.daftarKitab === 'function') {
      const k = m.daftarKitab().find(x => Number(x.no) === Number(no));
      if (k) return k.nama;
    }
    const il = mesinIl(no);
    if (il && il.meta()) {
      const k = (il.meta().kitab || []).find(x => Number(x.no) === Number(no));
      if (k) return k.nama;
    }
    return 'Kitab ' + no;
  }

  // ------------------------------------------------------------
  // bersih-bersih
  // ------------------------------------------------------------
  function bersihkan() {
    semuaTerbuka = false;
    pasalSekarang = null;
    strongAktif = null;
    ySemuaTerbuka = false;
    document.querySelectorAll('.il-sisip').forEach(x => x.remove());
    document.querySelectorAll('.il-kolom').forEach(x => x.remove());
    // K88 — penjelasan Yunani ikut dibersihkan
    document.querySelectorAll('.yl-sisip').forEach(x => x.remove());
    document.querySelectorAll('.yl-kolom').forEach(x => x.remove());
    /* ⚠️ WAJIB buang penanda “sudah dihiasi” di BARIS AYAT (pelajaran K55d).
       Tanpa ini: lepas plugin lalu pasang lagi ⇒ `hiasAyatBaca`/`hiasYunani`
       melihat `dataset.ilHias`/`dataset.ylHias` sudah terisi ⇒ tombol TIDAK
       pernah digambar ulang. Terukur 1 Nov 2026: pasang ulang ⇒ 0 tombol. */
    document.querySelectorAll('.ayat-baca[data-ayat]').forEach(b => {
      delete b.dataset.ilHias;
      delete b.dataset.ylHias;
    });
  }

  // ------------------------------------------------------------
  // pendaftaran penghias — SEGERA saat modul dimuat (pelajaran K80:
  //   jangan menunggu “data siap”, kalau tidak tombol kadang tidak muncul)
  // ------------------------------------------------------------
  function daftarkanPenghias() {
    const t = alkitabTampilan();
    if (!t || typeof t.tambahPenghias !== 'function') return false;
    t.tambahPenghias(hiasAyatBaca);
      t.tambahPenghias(hiasYunani);
      return true;
    }

    /* gambar ulang hiasan untuk pasal yang sedang tampil.
       ⚠️ WAJIB dipanggil sesudah data siap / plugin dipasang ulang — kalau tidak,
       tombol tidak pernah muncul sampai pengguna pindah pasal (pelajaran K55b). */
    function gambarUlangHiasan() {
      if (!pluginAktif()) return;
      const t = alkitabTampilan();
      if (!t || typeof t.jalankanPenghias !== 'function') return;
      const isi = document.getElementById('baca-isi');
      const pos = t.posisi;
      if (!isi || !pos || !pos.kitab) return;
      // penanda lama dibuang dulu supaya penghias mau menggambar ulang
      isi.querySelectorAll('.ayat-baca[data-ayat]').forEach(b => {
        delete b.dataset.ilHias;
        delete b.dataset.ylHias;
      });
      try { t.jalankanPenghias({ kitab: pos.kitab, pasal: pos.pasal, isi }); } catch (e) {}
    }

    function siapkanOtomatis() {
      if (!pluginAktif()) return;
      daftarkanPenghias();
      // K85 (4 Injil) + K88 (Yunani) + K90 (Ibrani) + K85t2 (PB Kisah 26 s/d Wahyu)
      [mesin(), mesinYunani(), mesinIbrani(), mesinPb()].forEach(y => {
        if (!y) return;
        if (typeof y.padaSiap === 'function') y.padaSiap(gambarUlangHiasan);
        if (typeof y.muat === 'function') y.muat().then(gambarUlangHiasan);
        if (typeof y.siap === 'function' && y.siap()) setTimeout(gambarUlangHiasan, 0);
      });
    }

    /* ============================================================
       K88 (1 Nov 2026) — 🖊 PENJELASAN YUNANI → INDONESIA
       ------------------------------------------------------------
       ⚠️ BAPAK: "dari angka km terjemahkan buat saya artinya jadi saya
       tidak perlu telusuri angka" ⇒ penjelasan mengalir, TANPA nomor Strong.

       Pola SAMA dengan 🖊 Penguat (K54): tombol per ayat + SATU keadaan
       `ySemuaTerbuka` untuk seluruh pasal.
       ============================================================ */
    let ySemuaTerbuka = false;

    function mesinYunani() { return window.ANodesYunani; }
    function mesinIbrani() { return window.ANodesIbrani; }

    /* K90 — kitab 1–39 = Perjanjian Lama (Ibrani), 40–66 = Perjanjian Baru (Yunani).
       Keduanya memakai kolom 🖊 yang SAMA supaya pengguna tidak perlu
       menghafal dua tombol berbeda. */
    function mesinUntuk(kitab) {
      return Number(kitab) <= 39 ? mesinIbrani() : mesinYunani();
    }

    function hiasYunani(ctx) {
      if (!ctx || !ctx.isi) return;
      if (!pluginAktif()) return;
      const y = mesinUntuk(ctx.kitab);
      if (!y || !y.siap()) return;

      const kunci = ctx.kitab + '.' + ctx.pasal;
      const barisPertama = ctx.isi.querySelector('.ayat-baca[data-ayat]');
      if (barisPertama && barisPertama.dataset.ylHias === kunci) return;

      ySemuaTerbuka = false;
      ctx.isi.querySelectorAll('.yl-sisip').forEach(x => x.remove());

      const peta = y.petaPasal(ctx.kitab, ctx.pasal);
      ctx.isi.querySelectorAll('.ayat-baca[data-ayat]').forEach(baris => {
        const no = Number(baris.dataset.ayat);
        if (baris.dataset.ylHias === undefined) baris.dataset.ylHias = kunci;
        if (!peta[no]) return;
        baris.appendChild(wadahTombolYunani(ctx, no, ctx.isi));
      });
    }

    function wadahTombolYunani(ctx, no, isi) {
      const wadah = document.createElement('div');
      wadah.className = 'yl-sisip';
      wadah.dataset.ayat = String(no);

      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'yl-toggle';
      b.textContent = '🖊';
      b.title = Number(ctx.kitab) <= 39
        ? '🖊 Penjelasan dari bahasa Ibrani (tekan lagi untuk menyembunyikan)'
        : '🖊 Penjelasan dari bahasa Yunani (tekan lagi untuk menyembunyikan)';
      b.setAttribute('aria-label', 'penjelasan bahasa asli');
      b.addEventListener('click', () => saatTombolYunani(isi, ctx.kitab, ctx.pasal));

      wadah.appendChild(b);
      return wadah;
    }

    function saatTombolYunani(isi, kitab, pasal) {
      if (!isi) return;
      if (ySemuaTerbuka) { tutupSemuaYunani(isi); return; }

      tutupSemuaYunani(isi);
      ySemuaTerbuka = true;

      isi.querySelectorAll('.yl-sisip').forEach(wadah => {
        const no = Number(wadah.dataset.ayat);
        const m = mesinUntuk(kitab);
        if (!m) return;
        const daftar = m.semuaAyat(kitab, pasal, no);
        if (!daftar.length) return;
        wadah.appendChild(gambarKolomYunani(kitab, pasal, no, daftar));
        wadah.classList.add('terbuka');
        const tb = wadah.querySelector('.yl-toggle');
        if (tb) tb.classList.add('aktif');
      });
    }

    function tutupSemuaYunani(isi) {
      ySemuaTerbuka = false;
      if (!isi) return;
      isi.querySelectorAll('.yl-sisip').forEach(w => {
        w.querySelectorAll('.yl-kolom').forEach(k => k.remove());
        w.classList.remove('terbuka');
        const tb = w.querySelector('.yl-toggle');
        if (tb) tb.classList.remove('aktif');
      });
    }

    function gambarKolomYunani(kitab, pasal, noAyat, daftar) {
      const kolom = document.createElement('div');
      kolom.className = 'yl-kolom';
      kolom.dataset.ayat = String(noAyat);

      const kepala = document.createElement('div');
      kepala.className = 'yl-kepala';
      kepala.textContent = '🖊 ' + namaKitabDari(kitab) + ' ' + pasal + ':' + noAyat +
        (Number(kitab) <= 39 ? ' — dari bahasa Ibrani' : ' — dari bahasa Yunani');
      kolom.appendChild(kepala);

      daftar.forEach((k, i) => {
        if (i) {
          const pisah = document.createElement('div');
          pisah.className = 'yl-pisah';
          kolom.appendChild(pisah);
        }

        const blok = document.createElement('div');
        blok.className = 'yl-blok';
        blok.dataset.strong = k.no;

        // baris 1: lemma Yunani + alih huruf + apa yang ditulis TB
        const judul = document.createElement('div');
        judul.className = 'yl-judul';

        const lemma = document.createElement('span');
        lemma.className = 'yl-lemma';
        lemma.textContent = k.l || '';
        judul.appendChild(lemma);

        if (k.t) {
          const alih = document.createElement('span');
          alih.className = 'yl-alih';
          alih.textContent = '(' + k.t + ')';
          judul.appendChild(alih);
        }

        if (k.tb) {
          const tb = document.createElement('span');
          tb.className = 'yl-tb';
          tb.textContent = '— TB: ' + k.tb;
          judul.appendChild(tb);
        }
        blok.appendChild(judul);

        // isi penjelasan
        const isi = document.createElement('div');
        isi.className = 'yl-isi';
        isi.textContent = k.kalimat || '';
        blok.appendChild(isi);

        kolom.appendChild(blok);
      });

      // K89 — ✡ kata serapan Ibrani / Aram (arti singkat, bukan penjelasan mengalir)
      // ⚠️ Hanya untuk Perjanjian Baru — di PL kata Ibrani sudah dijelaskan penuh di atas.
      const daftarIbrani = (Number(kitab) > 39 && typeof mesinYunani().semuaIbrani === 'function')
        ? mesinYunani().semuaIbrani(kitab, pasal, noAyat) : [];
      if (daftarIbrani.length) {
        const pisah = document.createElement('div');
        pisah.className = 'yl-pisah';
        kolom.appendChild(pisah);

        const judulIbrani = document.createElement('div');
        judulIbrani.className = 'yl-ibrani-kepala';
        judulIbrani.appendChild(ikonIbrani());
        const lbl = document.createElement('span');
        lbl.textContent = 'Kata serapan bahasa Ibrani / Aram';
        judulIbrani.appendChild(lbl);
        kolom.appendChild(judulIbrani);

        daftarIbrani.forEach(k => {
          const blok = document.createElement('div');
          blok.className = 'yl-blok yl-blok-ibrani';
          blok.dataset.strong = k.no;

          const judul = document.createElement('div');
          judul.className = 'yl-judul';

          const lemma = document.createElement('span');
          lemma.className = 'yl-lemma';
          lemma.textContent = k.l || '';
          judul.appendChild(lemma);

          if (k.t) {
            const alih = document.createElement('span');
            alih.className = 'yl-alih';
            alih.textContent = '(' + k.t + ')';
            judul.appendChild(alih);
          }

          if (k.tb) {
            const tb = document.createElement('span');
            tb.className = 'yl-tb';
            tb.textContent = '— TB: ' + k.tb;
            judul.appendChild(tb);
          }
          blok.appendChild(judul);

          const arti = document.createElement('div');
          arti.className = 'yl-isi';
          arti.textContent = k.arti || '';
          blok.appendChild(arti);

          kolom.appendChild(blok);
        });
      }

      // atribusi lisensi (WAJIB — syarat CC BY 4.0)
      const kaki = document.createElement('div');
      kaki.className = 'yl-kaki';
      kaki.textContent = Number(kitab) <= 39
        ? 'Sumber: Strong\'s Hebrew (Public Domain) · CC BY 4.0 (OpenScriptures morphhb) · penjelasan Indonesia oleh ANodes'
        : 'Sumber: Strong\'s Greek (Public Domain) · CC BY 4.0 (OpenScriptures) · penjelasan Indonesia oleh ANodes';
      kolom.appendChild(kaki);

      return kolom;
    }

    /* ------------------------------------------------------------
       K89 — ikon ✡ Bintang Daud (SVG, ikut warna teks)
       ------------------------------------------------------------
       Dibuat sebagai SVG dua segitiga bergaris supaya tajam di semua
       ukuran & ikut `currentColor` (bisa dipakai di latar terang/gelap).
       ------------------------------------------------------------ */
    function ikonIbrani() {
      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'yl-ikon-ibrani');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      // segitiga atas (mengarah ke atas)
      const atas = document.createElementNS(NS, 'path');
      atas.setAttribute('d', 'M12 2.6 L21.2 18.4 L2.8 18.4 Z');
      // segitiga bawah (mengarah ke bawah)
      const bawah = document.createElementNS(NS, 'path');
      bawah.setAttribute('d', 'M12 21.4 L2.8 5.6 L21.2 5.6 Z');
      [atas, bawah].forEach(p => {
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', 'currentColor');
        p.setAttribute('stroke-width', '2.4');
        p.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(p);
      });
      return svg;
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', daftarkanPenghias);
    } else {
      setTimeout(daftarkanPenghias, 0);
    }

    return {
      versi: () => VERSI,
      hiasAyatBaca,
      tutupSemua,
      bersihkan,
      siapkanOtomatis,
      daftarkanPenghias,
      // K88
      hiasYunani,
      tutupSemuaYunani,
      gambarUlangHiasan,
      // K89
      ikonIbrani,
      _semuaTerbuka: () => semuaTerbuka,
      _ySemuaTerbuka: () => ySemuaTerbuka,
      _pasal: () => pasalSekarang
    };
  })();
