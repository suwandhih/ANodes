/* ============================================================
   ANodes — plugin/bookmark/tampilan.js
   TAMPILAN PLUGIN: 📌 Bookmark Ayat   (K81 — 30 Okt 2026)
   ------------------------------------------------------------
   Bapak: *“di alkitab tambahan tombol bookmark ketika user baca dan di klik
   ayat yg mau dibookmark bisa dari ayat - ayat bisa dari pasal .. ayat ...
   sampai dengan pasal .. ayat tergantung user klik ayat mana saja.. tidak bisa
   lompat jika mau dari .. sampai ..... jika lompat terpisah bookmarknya ...
   setelah bookmark hasilnya ada pages di bookmark daftar ayat2 yg dibookmark
   user user bisa edit/hapus .. user klik edit > sistem ke alkitab dan diposisi
   ayat yg mau diedit .. klik ayat lain tambah tidak bisa lompat harus satu
   seleksi.. jika user klik kembali ke ayat yg sudah diklik artinya hapus jadi
   edit ini juga bisa berfungsi hapus dengan cara klik ulang ayat yg sudah
   diklik.. jadi selama edit area edit harus ada stabilo sistem sampai selesai
   prosesnya”*

   ➕ TAMBAHAN Bapak: *“di alkitab ayat yg sudah ada bookmark di beri tanda sudah
   dibookmark.. bisa dibook ulang untuk keperluan topik lain bisa saja.. tapi
   dipastikan ke user sudah ada jika ada klik ayat tapi beda seleksi ayat dan
   ayat yg sudah ada book juga kena book lagi itu bisa tanpa harus tanya ..
   karena sudah pasti diperuntuk topik yg beda... satu hal lagi ... di beri copy
   ayat yg dibook untuk di paste ke catatan”*

   ✅ KEPUTUSAN BAPAK (5 pertanyaan, 30 Okt 2026):
     1. Ayat LOMPAT (24 lalu 26)  ⇒ **DUA bookmark terpisah**
     2. Tombol 📌                 ⇒ **hanya di halaman baca Alkitab**
     3. Daftar bookmark           ⇒ **HALAMAN SENDIRI** (halaman ke-9)
     4. Catatan per bookmark      ⇒ **ya, satu baris**
     5. Ikut sinkron PC ⇄ HP      ⇒ **ya**

   ⚠️ TIDAK ada mesin baru: memakai sambungan resmi yang sudah ada
      (`tambahPenghias` · `daftarPemulihHalaman` · `ANodesEditor.terimaPaket`).
   ============================================================ */

window.ANodesBookmarkTampilan = (function () {
  'use strict';

  // K81 (30 Okt 2026) — 🔖 Bookmark Ayat · K81b — 🏠 kembali ke halaman asal
  // K82 (30 Okt 2026) — DUA JALUR di bar pilihan ayat + ikon 📌 → 🔖
  // K92 (2 Nov 2026) — tombol 🔖 HILANG sesudah halaman dimuat ulang
  // K93 (2 Nov 2026) — kartu daftar bisa DIKLIK ⇒ lompat ke kitab/ayatnya
  const VERSI = 'v2Nov-b';

  const mesin = () => window.ANodesBookmark;
  const mesinAlkitab = () => window.ANodesAlkitab;
  const tampilanAlkitab = () => window.ANodesAlkitabTampilan;

  const elBaca = () => document.getElementById('baca-isi');
  const elHal = () => document.getElementById('bookmark-halaman');
  const elIsi = () => document.getElementById('bm-isi');

  // ------------------------------------------------------------
  // KEADAAN
  // ------------------------------------------------------------
  let mode = 'tandai';        // 'tandai' (bookmark baru) | 'edit' (ubah yang ada)
  let pilih = [];             // nomor ayat yang sedang dipilih (urut naik)
  let editId = null;          // id bookmark yang sedang diedit (mode 'edit')
  let editCatatan = '';       // catatan yang sedang diedit
  let barAktif = false;       // apakah bar bookmark sedang tampil

  /* 🐞 K81b (30 Okt 2026) — TOMBOL 🏠 HARUS KEMBALI KE HALAMAN ASAL.
     Bapak: *“Home tidak berfungsi.. tidak kembali ke alkitab”*.
     Sebab terukur: `tutupHalaman()` SELALU memunculkan `#app-utama` (catatan),
     padahal halaman bookmark biasanya dibuka DARI halaman baca Alkitab.
     Sekarang halaman asal DIINGAT saat `bukaHalaman()` dan dipulihkan saat 🏠. */
  let asalHalaman = null;     // id halaman tempat bookmark dibuka ('baca-alkitab' | 'app-utama' | …)

  // ------------------------------------------------------------
  // PESAN KECIL (toast) — pola sama seperti plugin lain
  // ------------------------------------------------------------
  function pesan(t) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = t;
    el.classList.add('tampil');
    clearTimeout(el._tBm);
    el._tBm = setTimeout(() => el.classList.remove('tampil'), 2400);
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
  // TANDA “SUDAH DIBOOKMARK” DI HALAMAN BACA
  //   Bapak: *“di alkitab ayat yg sudah ada bookmark di beri tanda sudah
  //   dibookmark”* ⇒ titik kecil 📌 di sebelah nomor ayat.
  //   ⚠️ Ini PENGHIAS (dipanggil tiap pasal digambar) — wajib idempoten.
  // ------------------------------------------------------------
  // apakah plugin bookmark sedang terpasang?
  //   ⚠️ WAJIB diperiksa di dalam `hias()` — kalau tidak, tanda 📌 tetap
  //      digambar sesudah plugin DILEPAS (penghias masih terdaftar di plugin
  //      Alkitab). Pola sama seperti plugin 🖊 Penguat (`pluginAktif()`).
  function pluginAktif() {
    const g = window.ANodesPlugin;
    if (!g || typeof g.dipasang !== 'function') return true;   // alat uji / tanpa gudang
    return !!g.dipasang('bookmark');
  }

  function hias(ctx) {
    if (!ctx || !ctx.isi) return;
    if (!pluginAktif()) return;
    const m = mesin();
    if (!m) return;
    const peta = m.petaPasal(ctx.kitab, ctx.pasal);

    ctx.isi.querySelectorAll('.ayat-baca[data-ayat]').forEach(baris => {
      const no = Number(baris.dataset.ayat);
      const lama = baris.querySelector(':scope > .bm-tanda');
      const jml = peta[no] || 0;
      if (!jml) { if (lama) lama.remove(); return; }
      if (lama) { lama.textContent = '🔖' + (jml > 1 ? jml : ''); return; }
      const t = elSpan('bm-tanda', '🔖' + (jml > 1 ? jml : ''));
      t.title = jml > 1
        ? 'Ayat ini ada di ' + jml + ' bookmark'
        : 'Ayat ini sudah dibookmark';
      baris.appendChild(t);
    });
  }

  // ------------------------------------------------------------
  // BAR BOOKMARK (baris ke-2 di halaman baca)
  //   Muncul saat tombol 📌 ditekan. Isinya:
  //     [📌 Bil 6:24-26]  [💬 Catatan]  [💾 Simpan]  [✕]
  // ------------------------------------------------------------
  function elBar() { return document.getElementById('bar-bookmark'); }

  function bukaBar() {
    const bar = elBar();
    if (!bar) return;
    barAktif = true;
    bar.hidden = false;
    segarkanBar();
  }

  function tutupBar() {
    const bar = elBar();
    if (bar) bar.hidden = true;
    barAktif = false;
    pilih = [];
    editId = null;
    editCatatan = '';
    mode = 'tandai';
    segarkanTandaPilih();
  }

  function segarkanBar() {
    const bar = elBar();
    if (!bar) return;
    const m = mesin();
    const t = tampilanAlkitab();
    const pos = t && t.posisi ? t.posisi : { kitab: 1, pasal: 1 };

    const chip = document.getElementById('bm-chip');
    const bCat = document.getElementById('bm-catatan');
    const bSimpan = document.getElementById('bm-simpan');
    const bBatal = document.getElementById('bm-batal');

    if (chip) {
      if (!pilih.length) {
        chip.textContent = mode === 'edit' ? '✏️ klik ayat untuk ubah' : '🔖 klik angka ayat';
        chip.classList.remove('ada');
      } else {
        chip.textContent = '🔖 ' + labelPilih(pos.kitab, pos.pasal);
        chip.classList.add('ada');
      }
    }
    if (bCat) {
      bCat.classList.toggle('hidup', !!editCatatan);
      bCat.title = editCatatan ? ('Catatan: ' + editCatatan) : 'Tambah catatan satu baris';
    }
    if (bSimpan) {
      bSimpan.disabled = !pilih.length;
      bSimpan.textContent = mode === 'edit' ? '💾 Simpan' : '💾 Simpan';
    }
    if (bBatal) bBatal.textContent = mode === 'edit' ? '✕ Batal' : '✕';
  }

  // label pilihan sekarang, mis. “Bil 6:24-26”
  function labelPilih(no, pasal) {
    const m = mesinAlkitab();
    let nama = '';
    if (m && m.siap && m.siap()) {
      const k = m.daftarKitab().find(x => x.no === Number(no));
      if (k) nama = k.singkatan;
    }
    if (!nama) nama = 'Kitab ' + no;
    return nama + ' ' + pasal + ':' + rentangTeks(pilih);
  }

  // [24,25,26] → “24-26” · [24,26] → “24, 26”
  function rentangTeks(arr) {
    const a = (arr || []).slice().sort((x, y) => x - y);
    if (!a.length) return '';
    const bagian = [];
    let mulai = a[0], akhir = a[0];
    for (let i = 1; i < a.length; i++) {
      if (a[i] === akhir + 1) { akhir = a[i]; continue; }
      bagian.push(mulai === akhir ? String(mulai) : mulai + '-' + akhir);
      mulai = akhir = a[i];
    }
    bagian.push(mulai === akhir ? String(mulai) : mulai + '-' + akhir);
    return bagian.join(', ');
  }

  // ------------------------------------------------------------
  // KLIK ANGKA AYAT — inti aturan Bapak
  //
  //   ✅ BERURUTAN  : 24 → 25 → 26  ⇒ satu pilihan “24-26”
  //   ⚠️ LOMPAT     : 24 → 26       ⇒ **DUA bookmark terpisah**
  //   ✅ KLIK ULANG : 25 (sudah dipilih) ⇒ DILEPAS dari pilihan
  //
  //   Cara kerja “lompat ⇒ dua bookmark”:
  //     saat user mengklik ayat yang TIDAK bersambung dengan pilihan sekarang,
  //     pilihan yang LAMA langsung DISIMPAN sebagai bookmark, lalu pilihan
  //     baru dimulai dari ayat yang baru diklik.
  // ------------------------------------------------------------
  function klikAyat(no) {
    if (!barAktif) return false;
    const t = tampilanAlkitab();
    const pos = t && t.posisi ? t.posisi : null;
    if (!pos) return false;

    const i = pilih.indexOf(no);
    if (i >= 0) {
      // klik ulang ⇒ LEPAS (Bapak: “klik kembali ke ayat yg sudah diklik artinya hapus”)
      pilih.splice(i, 1);
      segarkanTandaPilih();
      segarkanBar();
      return true;
    }

    // apakah bersambung dengan pilihan sekarang?
    if (pilih.length) {
      const min = Math.min(...pilih);
      const maks = Math.max(...pilih);
      const bersambung = (no === min - 1) || (no === maks + 1);
      if (!bersambung) {
        // ⚠️ LOMPAT ⇒ simpan pilihan lama sebagai bookmark TERPISAH
        simpanPilihan(pos.kitab, pos.pasal, pilih, editCatatan, true);
        pilih = [];
        pesan('🔖 Bookmark terpisah disimpan — pilihan baru dimulai');
      }
    }

    pilih.push(no);
    pilih.sort((a, b) => a - b);
    segarkanTandaPilih();
    segarkanBar();
    return true;
  }

  // beri tanda pada baris ayat yang sedang dipilih
  function segarkanTandaPilih() {
    const isi = elBaca();
    if (!isi) return;
    isi.querySelectorAll('.ayat-baca[data-ayat]').forEach(baris => {
      const no = Number(baris.dataset.ayat);
      baris.classList.toggle('bm-pilih', pilih.indexOf(no) >= 0);
    });
  }

  // ------------------------------------------------------------
  // SIMPAN
  // ------------------------------------------------------------
  function simpanPilihan(no, pasal, ayat, catatan, senyap) {
    const m = mesin();
    if (!m || !ayat.length) return null;
    const b = m.tambah(no, pasal, ayat, catatan || '');
    if (!b) return null;
    if (!senyap) pesan('🔖 Tersimpan: ' + m.label(b, false));
    hias({ kitab: no, pasal: pasal, isi: elBaca() });
    return b;
  }

  function simpanSekarang() {
    const t = tampilanAlkitab();
    const pos = t && t.posisi ? t.posisi : null;
    if (!pos) return;
    if (!pilih.length) { pesan('🔖 Klik angka ayat dulu'); return; }

    const m = mesin();
    if (mode === 'edit' && editId) {
      m.ubah(editId, { ayat: pilih, catatan: editCatatan });
      pesan('✏️ Bookmark diperbarui: ' + m.label(m.ambil(editId), false));
      const id = editId;
      tutupBar();
      hias({ kitab: pos.kitab, pasal: pos.pasal, isi: elBaca() });
      // kembali ke halaman bookmark
      bukaHalaman();
      return;
    }

    simpanPilihan(pos.kitab, pos.pasal, pilih, editCatatan, false);
    pilih = [];
    segarkanTandaPilih();
    segarkanBar();
  }

  // ------------------------------------------------------------
  // TOMBOL 📌 DI NAVBAR ALKITAB
  //   Dipasang lewat kontrak `tombol[]` milik plugin Alkitab
  //   (pola sama seperti 📤 baca-kirim & 🖊 baca-penguat).
  // ------------------------------------------------------------
  // ------------------------------------------------------------
  // K82 (30 Okt 2026) — DUA JALUR DI BAR PILIHAN AYAT
  //
  //   Bapak: *“bookmark dengan panah di pasted image ... karena tidak menemukan
  //   cara bookmark .. dugaan belum ada cara book ... jadi di posisi alkitab
  //   pada saat klik ayat ada 2 jalur satu copy ke catatan dan ke dua masuk ke
  //   pages booking”*
  //   ⇒ keputusan: (1) **B** — pilih ayat lalu PINDAH ke halaman bookmark ·
  //      (2) **A** — tombol di navbar jadi PINTU ke halaman bookmark ·
  //      (3) ikon 📌 DIGANTI 🔖 (📌 sudah dipakai untuk peta).
  //
  //   Bentuk bar pilihan ayat (K20) sekarang:
  //     [Mat 4:4-6] [💬 Kalimat] [Matius 4:4-6] [📋 Simpan] [🔖 Bookmark] [✕]
  //                                                    │            │
  //                                              ke catatan   ke halaman 🔖
  // ------------------------------------------------------------

  // pecah [24,25,26,28] ⇒ [[24,25,26],[28]] — satu kelompok = satu bookmark
  function kelompokBerurutan(arr) {
    const a = (arr || []).slice().map(Number).filter(n => n > 0).sort((x, y) => x - y);
    const hasil = [];
    let kini = [];
    a.forEach(n => {
      if (!kini.length || n === kini[kini.length - 1] + 1) { kini.push(n); return; }
      hasil.push(kini);
      kini = [n];
    });
    if (kini.length) hasil.push(kini);
    return hasil;
  }

  // [🔖 Bookmark] di bar pilihan ayat ⇒ simpan pilihan sekarang, lalu buka halaman
  function simpanDariPilihan() {
    const t = tampilanAlkitab();
    const pos = t && t.posisi ? t.posisi : null;
    if (!pos) { pesan('💡 Buka halaman baca Alkitab dahulu'); return false; }
    const pilihan = (t && t.pilihan) ? t.pilihan : [];
    if (!pilihan.length) { pesan('👆 Klik angka ayat dulu'); return false; }

    const m = mesin();
    if (!m) { pesan('⏳ Mesin bookmark belum siap'); return false; }

    // ⚠️ ATURAN BAPAK: ayat LOMPAT ⇒ bookmark TERPISAH.
    //    [24,25,26,28] ⇒ “24-26” dan “28” (dua bookmark), ❌ bukan satu rentang.
    const kelompok = kelompokBerurutan(pilihan);
    const dibuat = [];
    kelompok.forEach(g => {
      const b = m.tambah(pos.kitab, pos.pasal, g, '');
      if (b) dibuat.push(b);
    });
    if (!dibuat.length) { pesan('⚠️ Gagal menyimpan bookmark'); return false; }

    // pilihan di bar kirim dikosongkan (bar ikut menutup sendiri)
    if (t && typeof t.batalPilih === 'function') t.batalPilih();

    const nama = dibuat.map(b => m.label(b, false)).join(' + ');
    pesan(dibuat.length > 1
      ? '🔖 ' + dibuat.length + ' bookmark tersimpan: ' + nama
      : '🔖 Tersimpan: ' + nama);

    // (1B) langsung pindah ke halaman 🔖 Bookmark
    bukaHalaman();
    return true;
  }

  // pasang tombol [🔖 Bookmark] di bar pilihan ayat (K20) — sekali saja
  function pasangTombolBarKirim() {
    const bar = document.getElementById('bar-kirim');
    if (!bar) return false;
    let b = document.getElementById('bk-bookmark');
    if (!b) {
      b = document.createElement('button');
      b.id = 'bk-bookmark';
      b.className = 'bk-bookmark';
      b.innerHTML = '🔖<span class="bk-lbl"> Bookmark</span>';
      b.title = 'Simpan ayat yang dipilih sebagai bookmark, lalu buka halaman Bookmark';
      b.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        simpanDariPilihan();
      });
    }
    // taruh SEBELUM tombol ✕ (paling kanan setelah 📋 Simpan)
    const batal = document.getElementById('bk-batal');
    if (batal && batal.parentElement === bar) bar.insertBefore(b, batal);
    else bar.appendChild(b);
    return true;
  }

  // ------------------------------------------------------------
  // TOMBOL 🔖 DI NAVBAR ALKITAB
  //   K82 (30 Okt 2026) — Bapak memilih **A**: tombol ini jadi PINTU ke
  //   halaman 🔖 Bookmark (❌ bukan lagi mode “tandai”).
  //   Alasannya: *“untuk membedakan klik ayat pindah ke catatan atau booking
  //   dan pindah ke page booking”* ⇒ dua jalur harus TERLIHAT BEDA.
  // ------------------------------------------------------------
  function pasangTombolNavbar() {
    const nav = document.querySelector('#baca-alkitab .ay-nav-b1')
             || document.querySelector('#baca-alkitab .alkitab-nav');
    if (!nav) return false;
    let b = document.getElementById('baca-bookmark');
    if (!b) {
      b = document.createElement('button');
      b.id = 'baca-bookmark';
      b.addEventListener('click', (e) => {
        e.preventDefault();
        bukaHalaman();
      });
    }
    b.textContent = '🔖';
    b.title = 'Buka halaman Bookmark ayat';
    nav.appendChild(b);
    return true;
  }

  // mode “tandai” lewat bar bookmark (masih dipakai MODE EDIT)
  function sakelarBar() {
    if (barAktif) { tutupBar(); return; }
    mode = 'tandai';
    editId = null;
    editCatatan = '';
    pilih = [];
    bukaBar();
    segarkanTandaPilih();
    pesan('🔖 Klik angka ayat yang mau dibookmark');
  }

  // ------------------------------------------------------------
  // HALAMAN 📌 BOOKMARK (halaman ke-9)
  // ------------------------------------------------------------
  const HALAMAN_LAIN = ['app-utama', 'baca-alkitab', 'kerja-ayat', 'kamus-halaman',
                        'penguat-halaman', 'sejarah-halaman', 'peta-halaman', 'doc-alkitab'];

  function bukaHalaman() {
    const hal = elHal();
    if (!hal) { pesan('⏳ Halaman bookmark belum siap'); return; }
    // INGAT halaman asal SEBELUM disembunyikan (K81b) — supaya 🏠 bisa kembali
    // ke Alkitab kalau halaman ini dibuka dari sana.
    asalHalaman = null;
    for (const id of HALAMAN_LAIN) {
      const el = document.getElementById(id);
      if (el && !el.hidden) { asalHalaman = id; break; }
    }
    // sembunyikan halaman lain
    HALAMAN_LAIN.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    });
    hal.hidden = false;
    segarkanTombolKembali();
    gambarDaftar();
  }

  function tutupHalaman() {
    const hal = elHal();
    if (hal) hal.hidden = true;
    // K81b — kembali ke halaman ASAL (Alkitab), bukan selalu ke catatan.
    const asal = asalHalaman;
    asalHalaman = null;
    if (asal && asal !== 'app-utama') {
      const el = document.getElementById(asal);
      if (el) {
        el.hidden = false;
        // halaman baca Alkitab: pastikan isinya masih ada (kalau kosong, gambar ulang)
        if (asal === 'baca-alkitab') {
          const t = tampilanAlkitab();
          if (t && typeof t.bukaHalaman === 'function' && !document.querySelector('#baca-isi .ay-judul')) {
            try { t.bukaHalaman(); } catch (e) {}
          }
        }
        return;
      }
    }
    const u = document.getElementById('app-utama');
    if (u) u.hidden = false;
  }

  // Judul tombol 🏠 menyesuaikan halaman asal (biar pengguna tahu ke mana)
  function segarkanTombolKembali() {
    const b = document.getElementById('bm-kembali');
    if (!b) return;
    const keAlkitab = asalHalaman === 'baca-alkitab';
    b.title = keAlkitab
      ? 'Kembali ke bacaan Alkitab (Esc / Ctrl+B)'
      : 'Kembali ke catatan (Esc / Ctrl+B)';
  }

  function gambarDaftar() {
    const isi = elIsi();
    if (!isi) return;
    const m = mesin();
    const daftar = m.semua();
    isi.innerHTML = '';

    const kepala = document.createElement('div');
    kepala.className = 'bm-kepala';
    kepala.appendChild(elSpan('bm-jumlah',
      daftar.length ? daftar.length + ' bookmark' : 'Belum ada bookmark'));
    isi.appendChild(kepala);

    if (!daftar.length) {
      const kosong = document.createElement('div');
      kosong.className = 'bm-kosong';
      kosong.textContent = 'Buka Alkitab, klik angka ayat (boleh beberapa), lalu tekan ' +
        '[🔖 Bookmark] di bar pilihan. Ayat itu akan muncul di sini.';
      isi.appendChild(kosong);
      return;
    }

    daftar.forEach(b => isi.appendChild(kartu(b)));
  }

  function kartu(b) {
    const m = mesin();
    const a = mesinAlkitab();
    const box = document.createElement('div');
    box.className = 'bm-kartu';
    box.dataset.id = b.id;

    // kepala: 📌 Bilangan 6:24-26
    const kepala = document.createElement('div');
    kepala.className = 'bm-kartu-kepala';
    kepala.appendChild(elSpan('bm-kartu-nama', '🔖 ' + m.label(b, true)));
    box.appendChild(kepala);

    // teks ayat
    const teks = document.createElement('div');
    teks.className = 'bm-kartu-teks';
    if (a && a.siap && a.siap()) {
      const data = a.ambilAyatBanyak([[b.no, b.pasal, b.ayat1, b.ayat2]])[0];
      if (data) {
        data.ayat.forEach(x => {
          const p = document.createElement('p');
          p.className = 'bm-ayat' + (x.merah ? ' merah' : '');
          p.appendChild(elSpan('bm-no', x.no));
          p.appendChild(document.createTextNode(x.teks));
          teks.appendChild(p);
        });
      }
    }
    box.appendChild(teks);

    // catatan (kalau ada)
    if (b.catatan) {
      const c = document.createElement('div');
      c.className = 'bm-kartu-catatan';
      c.textContent = '📝 ' + b.catatan;
      box.appendChild(c);
    }

    // aksi
    const aksi = document.createElement('div');
    aksi.className = 'bm-kartu-aksi';
    aksi.appendChild(tombol('bm-btn bm-copy', '📋 Copy',
      'Salin ayat ini untuk ditempel ke catatan', () => salinKeCatatan(b)));
    aksi.appendChild(tombol('bm-btn bm-edit', '✏️ Edit',
      'Ubah ayat yang ditandai (pindah ke Alkitab)', () => mulaiEdit(b)));
    aksi.appendChild(tombol('bm-btn bm-hapus', '🗑 Hapus',
      'Hapus bookmark ini', () => hapusBookmark(b)));
    box.appendChild(aksi);

    /* 🆕 K93 (2 Nov 2026) — KARTU BISA DIKLIK ⇒ LOMPAT KE KITAB/AYATNYA.
       Bapak: *“ke daftarnya list bookmark.. bisa di klik salah satu book dan
       lompat ke kitab book .. ini fungsi bookmark”*.

       🔎 Keadaan SEBELUM (terukur): kartu TIDAK punya pengait klik dan
       `cursor` = `auto` ⇒ hanya bisa dibaca; untuk melihat ayatnya di Alkitab
       harus lewat ✏️ Edit (mode edit) — bukan maksud Bapak.

       ⚠️ Klik pada TOMBOL (Copy/Edit/Hapus) TIDAK boleh ikut membuka Alkitab
          ⇒ diperiksa dengan `closest('button')`. */
    box.classList.add('bm-kartu-klik');
    box.title = 'Klik untuk membuka ' + m.label(b, true) + ' di Alkitab';
    box.addEventListener('click', (e) => {
      if (e.target.closest && e.target.closest('button')) return;
      bukaDiAlkitab(b);
    });

    return box;
  }

  // ------------------------------------------------------------
  // 🆕 K93 (2 Nov 2026) — BUKA BOOKMARK DI ALKITAB
  //   Klik kartu ⇒ pindah ke halaman baca pada kitab/pasal/ayat bookmark itu,
  //   ayatnya DISOROT (pola `bukaRentang` K80 — kedip 5 dtk lalu sorot tetap).
  //   🏠 ⇒ kembali ke HALAMAN 🔖 BOOKMARK (bukan ke catatan).
  // ------------------------------------------------------------
  function bukaDiAlkitab(b) {
    const t = tampilanAlkitab();
    if (!t || typeof t.bukaRentang !== 'function') {
      pesan('💡 Pasang plugin 📖 Alkitab dahulu');
      return;
    }
    const hal = elHal();
    const gulir = elIsi() ? elIsi().scrollTop : 0;

    // ingat halaman asal supaya 🏠 kembali ke daftar bookmark (K56/K81b)
    if (typeof t.ingatAsalAyat === 'function') {
      try { t.ingatAsalAyat({ jenis: 'bookmark', gulir: gulir }); } catch (e) {}
    }
    // halaman bookmark disembunyikan sendiri (pola K81b — `pindahKeBaca()`
    // hanya menangani `#app-utama` & `#baca-alkitab`)
    if (hal) hal.hidden = true;

    t.bukaRentang({ no: b.no, pasal: b.pasal, ayat1: b.ayat1, ayat2: b.ayat2 });
    pesan('🔖 ' + mesin().label(b, true));
  }

  // dipanggil plugin 📖 Alkitab saat tombol 🏠 ditekan dari halaman bacanya
  //   ⇒ tampilkan lagi HALAMAN 🔖 BOOKMARK (posisi gulir dipulihkan)
  function pulihDariAlkitab(info) {
    const hal = elHal();
    if (!hal) return false;
    document.querySelectorAll('body > .app').forEach(a => { a.hidden = true; });
    hal.hidden = false;
    gambarDaftar();
    if (info && info.gulir && elIsi()) elIsi().scrollTop = info.gulir;
    return true;
  }

  // ------------------------------------------------------------
  // 📋 COPY — kirim ayat ke catatan (memakai jalur K20 yang sudah ada)
  //   Bapak: *“di beri copy ayat yg dibook untuk di paste ke catatan”*
  // ------------------------------------------------------------
  function salinKeCatatan(b) {
    const a = mesinAlkitab();
    const m = mesin();
    if (!a || !a.siap || !a.siap()) { pesan('⏳ Menyiapkan data Alkitab…'); return; }
    const data = a.ambilAyatBanyak([[b.no, b.pasal, b.ayat1, b.ayat2]])[0];
    if (!data) { pesan('⚠️ Ayat tidak ditemukan'); return; }

    // susun teks: nama ayat + nomor + kalimat (pola sama seperti K20c)
    const baris = [m.label(b, true)];
    data.ayat.forEach(x => baris.push(x.no + ' ' + x.teks));
    const teks = baris.join('\n');

    const ed = window.ANodesEditor;
    if (ed && typeof ed.terimaPaket === 'function') {
      const hasil = ed.terimaPaket({
        teks: teks,
        nama: m.label(b, true),
        sumber: { jenis: 'bookmark', id: b.id }
      });
      if (hasil === false) { pesan('⚠️ Gagal menyiapkan paket'); return; }
      // tampilkan catatan supaya user bisa langsung menentukan letak
      const u = document.getElementById('app-utama');
      const hal = elHal();
      if (hal) hal.hidden = true;
      if (u) u.hidden = false;
      pesan('📋 Ayat siap ditempel — tentukan letak di catatan, lalu tekan [Tempel ⇩]');
      return;
    }
    // cadangan: salin ke papan klip
    try {
      navigator.clipboard.writeText(teks);
      pesan('📋 Ayat disalin ke papan klip');
    } catch (e) {
      pesan('⚠️ Tidak bisa menyalin');
    }
  }

  // ------------------------------------------------------------
  // ✏️ EDIT — pindah ke Alkitab di posisi ayat itu, dengan STABILO
  //   Bapak: *“user klik edit > sistem ke alkitab dan diposisi ayat yg mau
  //   diedit .. klik ayat lain tambah tidak bisa lompat harus satu seleksi..
  //   jika user klik kembali ke ayat yg sudah diklik artinya hapus .. jadi
  //   selama edit area edit harus ada stabilo sistem sampai selesai prosesnya”*
  // ------------------------------------------------------------
  function mulaiEdit(b) {
    const t = tampilanAlkitab();
    if (!t || typeof t.bukaRentang !== 'function') {
      pesan('💡 Pasang plugin 📖 Alkitab dahulu');
      return;
    }
    mode = 'edit';
    editId = b.id;
    editCatatan = b.catatan || '';
    pilih = [];
    for (let n = b.ayat1; n <= b.ayat2; n++) pilih.push(n);

    // ⚠️ CACAT NYATA (ketemu 30 Okt 2026 lewat tangkapan layar): halaman
    //    bookmark TIDAK ikut tersembunyi — `pindahKeBaca()` hanya menangani
    //    `#app-utama` & `#baca-alkitab`, jadi halaman bookmark tetap terlihat
    //    di bawahnya. Wajib disembunyikan di sini.
    const hal = elHal();
    if (hal) hal.hidden = true;

    // pindah ke Alkitab + sorot rentang (kedip 5 dtk ⇒ lalu sorot tetap)
    t.bukaRentang({ no: b.no, pasal: b.pasal, ayat1: b.ayat1, ayat2: b.ayat2 });
    bukaBar();
    segarkanTandaPilih();
    segarkanBar();
    pesan('✏️ Mode edit — klik ayat untuk tambah, klik ulang untuk hapus');
  }

  function hapusBookmark(b) {
    const m = mesin();
    if (!m.hapus(b.id)) { pesan('⚠️ Gagal menghapus'); return; }
    pesan('🗑 Bookmark dihapus: ' + m.label(b, false));
    gambarDaftar();
    // perbarui tanda di halaman baca (kalau sedang tampil)
    const t = tampilanAlkitab();
    if (t && t.posisi) hias({ kitab: t.posisi.kitab, pasal: t.posisi.pasal, isi: elBaca() });
  }

  // ------------------------------------------------------------
  // CATATAN SATU BARIS (prompt sederhana — pola ANodes)
  // ------------------------------------------------------------
  function tanyaCatatan(awal) {
    const isi = window.prompt('Catatan untuk bookmark ini (boleh dikosongkan):', awal || '');
    if (isi === null) return null;      // dibatalkan
    return isi.slice(0, 200);
  }

  // ------------------------------------------------------------
  // BERSIHKAN — saat plugin dilepas
  // ------------------------------------------------------------
  function bersihkan() {
    const isi = elBaca();
    if (isi) {
      isi.querySelectorAll('.bm-tanda').forEach(x => x.remove());
      isi.querySelectorAll('.bm-pilih').forEach(x => x.classList.remove('bm-pilih'));
      // ⚠️ penanda “sudah dipasang pengait” WAJIB dibuang — kalau tidak,
      //    plugin dipasang ulang ⇒ pengait tidak pernah dipasang lagi
      //    (pelajaran K55d: `dataset.*Daftar` harus dihapus di `bersihkan()`).
      delete isi.dataset.siapBookmark;
    }
    const b = document.getElementById('baca-bookmark');
    if (b) b.remove();
    // K92 — tombol [🔖 Bookmark] di bar pilihan ayat juga ikut dibuang
    const bb = document.getElementById('bk-bookmark');
    if (bb) bb.remove();
    const bar = elBar();
    if (bar) bar.hidden = true;
    barAktif = false;
    pilih = [];
    editId = null;
    mode = 'tandai';
    const hal = elHal();
    if (hal) hal.hidden = true;
  }

  // ------------------------------------------------------------
  // HIDUPKAN — saat plugin dipasang / halaman dibuka ulang
  // ------------------------------------------------------------
  function hidupkan() {
    daftarkanPenghias();
    pasangTombolNavbar();
    pasangTombolBarKirim();     // K82 — [🔖 Bookmark] di bar pilihan ayat
    pasangPengait();
    pasangPengaitBar();
    pasangPengaitHalaman();
    daftarkanPemulih();         // K93 — 🏠 dari Alkitab kembali ke daftar bookmark
    const t = tampilanAlkitab();
    if (t && t.posisi && elBaca() && !document.getElementById('baca-alkitab').hidden) {
      hias({ kitab: t.posisi.kitab, pasal: t.posisi.pasal, isi: elBaca() });
    }
  }

  /* 🆕 K93 (2 Nov 2026) — 🏠 DARI ALKITAB KEMBALI KE DAFTAR BOOKMARK.
     Sambungan resmi `daftarPemulihHalaman(jenis, fn)` milik plugin 📖 Alkitab
     (pola sama seperti halaman 📖 Sejarah K56). Alkitab TIDAK perlu tahu
     halaman bookmark ada — yang memutuskan halaman pemiliknya. */
  function daftarkanPemulih() {
    const t = tampilanAlkitab();
    if (t && typeof t.daftarPemulihHalaman === 'function') {
      try { t.daftarPemulihHalaman('bookmark', pulihDariAlkitab); } catch (e) {
        console.warn('ANodes Bookmark: gagal mendaftarkan pemulih', e);
      }
    }
  }

  // ⚠️ PELAJARAN K80 (30 Okt 2026): pendaftaran penghias ❌ JANGAN menunggu
  //    “data siap” — kalau menunggu, halaman baca bisa tampil TANPA tanda
  //    (flaky). Daftarkan SEGERA saat modul dimuat; `hias()` menjaga sendiri.
  function daftarkanPenghias() {
    const t = tampilanAlkitab();
    if (t && typeof t.tambahPenghias === 'function') {
      try { t.tambahPenghias(hias); } catch (e) {
        console.warn('ANodes Bookmark: gagal mendaftarkan penghias', e);
      }
    }
  }

  // pengait klik angka ayat di halaman baca
  function pasangPengait() {
    const isi = elBaca();
    if (!isi || isi.dataset.siapBookmark) return;
    isi.dataset.siapBookmark = '1';
    isi.addEventListener('click', (e) => {
      if (!barAktif) return;
      const no = e.target.closest && e.target.closest('.ayat-baca .no');
      if (!no) return;
      const baris = no.closest('.ayat-baca');
      if (!baris) return;
      e.preventDefault();
      e.stopPropagation();
      klikAyat(Number(baris.dataset.ayat));
    }, true);   // capture — supaya mendahului pengait 📤 kirim ke catatan

    /* 🐞 K92 (2 Nov 2026) — PENGAMAN TOMBOL [🔖 Bookmark].
       Bapak: *“sudah pilih ayat yg akan dibookmark tapi icon bookmark tidak ada”*.
       Tombol itu hidup di dalam `#bar-kirim` (milik plugin Alkitab). Kalau bar itu
       digambar ulang / tombolnya hilang karena sebab lain, tombol bookmark ikut
       lenyap. Karena itu setiap kali PILIHAN AYAT berubah, tombol dipastikan ada
       lagi. `pasangTombolBarKirim()` idempoten (memeriksa `#bk-bookmark` dulu). */
    isi.addEventListener('anodes-pilih-berubah', () => {
      if (!pluginAktif()) return;
      pasangTombolBarKirim();
    });
  }

  // ------------------------------------------------------------
  // PENGHAIT BAR & HALAMAN (dipasang sekali)
  // ------------------------------------------------------------
  function pasangPengaitBar() {
    const bar = elBar();
    if (!bar || bar.dataset.siapBm) return;
    bar.dataset.siapBm = '1';

    const bCat = document.getElementById('bm-catatan');
    if (bCat) bCat.addEventListener('click', () => {
      const hasil = tanyaCatatan(editCatatan);
      if (hasil === null) return;
      editCatatan = hasil;
      segarkanBar();
    });

    const bSimpan = document.getElementById('bm-simpan');
    if (bSimpan) bSimpan.addEventListener('click', simpanSekarang);

    const bBatal = document.getElementById('bm-batal');
    if (bBatal) bBatal.addEventListener('click', () => {
      const sedangEdit = (mode === 'edit');
      tutupBar();
      if (sedangEdit) bukaHalaman();
      else pesan('🔖 Dibatalkan');
    });
  }

  function pasangPengaitHalaman() {
    const hal = elHal();
    if (!hal || hal.dataset.siapBm) return;
    hal.dataset.siapBm = '1';

    const b = document.getElementById('bm-kembali');
    if (b) b.addEventListener('click', tutupHalaman);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hal && !hal.hidden) { tutupHalaman(); return; }
      if (e.ctrlKey && (e.key === 'b' || e.key === 'B') && hal && !hal.hidden) {
        e.preventDefault();
        tutupHalaman();
      }
    });
  }

  // ------------------------------------------------------------
  // SIAPKAN OTOMATIS — dipanggil saat halaman dibuka (plugin tetap terpasang)
  // ------------------------------------------------------------
  function siapkanOtomatis() {
    const g = window.ANodesPlugin;
    if (!g || !g.dipasang || !g.dipasang('bookmark')) return;
    hidupkan();
  }

  // ------------------------------------------------------------
  // API
  // ------------------------------------------------------------
  return {
    VERSI,
    hidupkan, hias, bersihkan, siapkanOtomatis,
    bukaHalaman, tutupHalaman, gambarDaftar,
    _asalHalaman: () => asalHalaman,
    pasangTombolNavbar, sakelarBar, bukaBar, tutupBar,
    klikAyat, simpanSekarang, mulaiEdit, salinKeCatatan, hapusBookmark,
    tanyaCatatan,
    // K82 (30 Okt 2026) — dua jalur di bar pilihan ayat
    pasangTombolBarKirim, simpanDariPilihan,
    // K93 (2 Nov 2026) — kartu bisa diklik ⇒ lompat ke kitab/ayatnya
    bukaDiAlkitab, pulihDariAlkitab, daftarkanPemulih,
    // dipakai alat uji
    _kelompokBerurutan: kelompokBerurutan,
    _pilih: () => pilih.slice(),
    _setPilih: (a) => { pilih = (a || []).slice().sort((x, y) => x - y); segarkanTandaPilih(); segarkanBar(); },
    _mode: () => mode,
    _barAktif: () => barAktif,
    _rentangTeks: rentangTeks,
    _labelPilih: labelPilih,
    versi: () => VERSI
  };
})();

/* ============================================================
   🐞 K92 (2 Nov 2026) — HIDUPKAN SENDIRI SAAT HALAMAN DIMUAT
   ------------------------------------------------------------
   Bapak: *“sudah pilih ayat yg akan dibookmark tapi icon bookmark tidak ada
   atau plugin icon bookmark tidak muncul..”*

   🔴 SEBAB TERUKUR (di Chrome nyata, ❌ bukan dugaan):
     `ANodesPlugin.dipasang('bookmark')` = **true** (plugin tercatat terpasang)
     tetapi tombol 🔖 di navbar = **TIDAK ADA** dan `[🔖 Bookmark]` di bar
     pilihan ayat = **TIDAK ADA**. Sesudah `hidupkan()` dipanggil manual ⇒
     keduanya **muncul**.

   Sebabnya: `siapkanOtomatis()` hanya dipanggil dari `saatDipasang` (tombol
   Pasang). Sesudah **F5 / buka ulang aplikasi** plugin tetap tercatat
   terpasang, tetapi `saatDipasang` TIDAK dijalankan lagi ⇒ tombol tidak
   pernah dipasang. Semua plugin lain (alkitab · ayat-terkait · interlinear ·
   kamus · penguat · peta · sejarah) sudah punya pemanggil sendiri di sini.

   ⚠️ PELAJARAN K55/K47e TERULANG: *“`siapkanOtomatis()` WAJIB ADA”*.
   ============================================================ */
(function () {
  'use strict';
  function hidupkanSekarang() {
    const t = window.ANodesBookmarkTampilan;
    if (!t || typeof t.siapkanOtomatis !== 'function') return;
    try { t.siapkanOtomatis(); } catch (e) {
      console.warn('ANodes Bookmark: siapkanOtomatis gagal', e);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hidupkanSekarang);
  } else {
    hidupkanSekarang();
  }
})();
