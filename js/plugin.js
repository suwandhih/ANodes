/* ============================================================
   ANodes — js/plugin.js
   GUDANG PLUGIN (gaya WordPress)
   ------------------------------------------------------------
   • Mendaftar plugin dari  window.ANodesPlug  (diisi file
     plugin/<nama>/plugin.js yang dimuat lewat <script src>).
   • Menyimpan plugin mana yang TERPASANG di localStorage
     (kunci `anodes-plugin-v1`) → { daftar: ['alkitab'] }.
   • Menampilkan halaman keterangan sebelum dipasang:
     nama, ukuran, isi, daftar fitur, cara pakai, catatan,
     lalu tombol [Pasang] / [Lepas].

   TAHAP a — keterangan plugin saja.
   Data ayat + fitur baca/cari menyusul pada tahap berikutnya.

   Catatan: hasilnya juga dipasang ke `window.ANodesPlugin` supaya
   plugin (mis. Alkitab) bisa memanggil layanan ANodes dari berkasnya
   sendiri. (const/variable biasa tidak otomatis ada di window.)
   ============================================================ */

const ANodesPlugin = (() => {
  'use strict';

  const KUNCI  = 'anodes-plugin-v1';
    const modal  = document.getElementById('modal-plugin');
    const isi    = document.getElementById('p-isi');
    const btnKpl = document.getElementById('btn-plugin');
    const barEl  = document.getElementById('bar-plugin');
    const toastEl = document.getElementById('toast');

  let terpasang = [];      // id plugin yang terpasang
  let sedangLihat = null;  // id yang sedang dibuka halaman keterangannya
  let tombolBar = [];      // { id, plugin, label, ikon, judul, aksi }

  // ------------------------------------------------------------
  // pesan singkat (toast) — sama gayanya dengan editor
  // ------------------------------------------------------------
  function pesan(t) {
    if (!toastEl) return;
    toastEl.textContent = t;
    toastEl.classList.add('tampil');
    clearTimeout(toastEl._tP);
    toastEl._tP = setTimeout(() => toastEl.classList.remove('tampil'), 2200);
  }

  // ------------------------------------------------------------
  // simpan / muat status terpasang
  // ------------------------------------------------------------
  function tulis() {
    try { localStorage.setItem(KUNCI, JSON.stringify({ daftar: terpasang })); } catch (e) {}
  }

  function muat() {
    let mentah = null;
    try { mentah = localStorage.getItem(KUNCI); } catch (e) {}
    if (!mentah) return;
    try {
      const d = JSON.parse(mentah);
      if (d && Array.isArray(d.daftar)) terpasang = d.daftar.filter(x => typeof x === 'string');
    } catch (e) { /* rusak -> anggap belum ada */ }
    // buang id plugin yang BERKASNYA sudah tidak ada (mis. plugin dihapus/diganti).
    //   Kalau tidak, nama plugin lama tetap tertinggal di penyimpanan & ikut
    //   terhitung “terpasang” walau berkasnya sudah tidak ada.
    const sah = terpasang.filter(x => daftar().some(p => p.id === x));
    if (sah.length !== terpasang.length) { terpasang = sah; tulis(); }
  }

  // ------------------------------------------------------------
  // daftar plugin yang terdaftar
  // ------------------------------------------------------------
  function daftar() {
    const arr = Array.isArray(window.ANodesPlug) ? window.ANodesPlug.slice() : [];
    return arr.filter(p => p && p.id);
  }

  const ambil    = (id) => daftar().find(p => p.id === id) || null;
  const dipasang = (id) => terpasang.indexOf(id) >= 0;
  // mesin plugin → nama di window.
  //   'alkitab'       → window.ANodesAlkitab
  //   'ayat-terkait'  → window.ANodesAyatTerkait
  // ⚠️ id BOLEH memakai tanda hubung (mis. 'ayat-terkait'). Kalau langsung
  //    ditempel, hasilnya 'ANodesAyat-terkait' — nama yang TIDAK SAH sebagai
  //    sifat objek, sehingga mesinnya tidak akan pernah ketemu.
  //    Karena itu tiap bagian diubah jadi huruf besar di depan, tanpa tanda hubung.
  const namespace = (id) => window['ANodes' + String(id)
    .split(/[-_]/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')];

  // ------------------------------------------------------------
  // pasang / lepas
  // ------------------------------------------------------------
  function panggilHati(hati, p, arah) {
    if (!hati) return;
    const f = p[hati];
    if (typeof f === 'function') {
      try { f.call(p, arah); } catch (e) { console.warn('ANodes: ' + hati + ' gagal', e); }
    }
  }

  function pasang(id) {
    const p = ambil(id);
    if (!p) return false;
    if (!dipasang(id)) { terpasang.push(id); tulis(); }
    panggilHati('saatDipasang', p, 'pasang');
    tandaKepala();
    pesan(p.ikon + ' ' + p.nama + ' dipasang');
    // pemberitahuan ke plugin (mis. ANodesAlkitab memuat datanya)
    const kabari = namespace(id);
    if (kabari && typeof kabari.dipasang === 'function') {
      try { kabari.dipasang(); } catch (e) { console.warn('ANodes: dipasang gagal', e); }
    }
    return true;
  }

  function lepas(id) {
    const p = ambil(id);
    if (!p) return false;
    terpasang = terpasang.filter(x => x !== id);
    tulis();
    panggilHati('saatDilepas', p, 'lepas');
    tandaKepala();
    if (sedangLihat === null) renderDaftar();
    pesan('🧩 ' + p.nama + ' dilepas');
    return true;
  }

  // tanda kecil di tombol kepala kalau ada plugin terpasang
  function tandaKepala() {
    if (!btnKpl) return;
    const ada = terpasang.length > 0;
    btnKpl.classList.toggle('aktif', ada);
    btnKpl.title = ada
      ? 'Gudang Plugin (' + terpasang.length + ' terpasang)'
      : 'Gudang Plugin';
    // tombol 🧩 di toolbar editor ikut disegarkan
    try { renderToolbar(); } catch (e) {}
  }

  // ------------------------------------------------------------
  // BARIS KE-2 — hanya toolbar tulis
  // ------------------------------------------------------------
  // ⚠️ Keputusan user 14 Sep 2026: seluruh urusan plugin ada di
  //    SATU halaman (gudang plugin, tombol 🧩). Baris “bar plugin”
  //    yang dulu bergantian dengan toolbar tulis TIDAK dipakai lagi →
  //    logikanya jadi sederhana:
  //        ▦ = toolbar tulis (sembunyi/tampilkan)
  //        🧩 = semua urusan plugin (pasang · buka · lepas)
  //    Ikon keduanya TETAP (sebelum ini berganti sendiri → 🧩 kembar).
  const KUNCI_BAR = 'anodes-bar';
    // 🔴 K104 (6 Nov 2026) — keadaan "disembunyikan" TIDAK ADA LAGI.
    //    `anodes-bar` tetap ditulis ({"siap":"1"}) supaya perangkat yang masih
    //    menyimpan {"siap":"0"} dari versi lama **otomatis sembuh** saat dibuka.
    // paket       : true = ada PAKET AYAT yang belum ditutup (K20)
    // paketTampil : dipertahankan untuk keserasian pemanggil lama (bar paket
    //               sekarang tampil DI ATAS toolbar, bukan menggantikannya).
    const bar = { nampak: 'toolbar', siap: '1', paket: false, paketTampil: false };

    function bacaBar() {
      // 🔴 K104 — nilai lama {"siap":"0"} / `anodes-toolbar`='0' DIBUANG:
      //    toolbar tulis selalu tampil. Menulis ulang kunci = menyembuhkan perangkat
      //    yang sebelumnya kehilangan menu.
      bar.siap = '1';
      tulisBar();
      try { localStorage.removeItem('anodes-toolbar'); } catch (e) {}
    }
    function tulisBar() {
      try { localStorage.setItem(KUNCI_BAR, JSON.stringify({ siap: '1' })); } catch (e) {}
    }

  // Baris ke-2 hanya SATU baris → pemiliknya harus satu saja.
    //   • ada paket ayat (K20) → bar paket muncul DI ATAS toolbar tulis
    //   • tidak ada paket     → toolbar tulis saja
    // ❌ JANGAN ada berkas lain yang menyentuh #toolbar.hidden (dulu bentrok, K17).
    // 🔴 K104 (6 Nov 2026) — TOOLBAR TULIS **SELALU TAMPIL**, tidak bisa disembunyikan:
    //    sebab cacat "menu hilang" = `anodes-bar` {siap:'0'} bertahan sesudah aplikasi
    //    ditutup (terukur di APK Z Flip 3). Akarnya dihapus ⇒ tombol ▦ dibuang dan
    //    #toolbar.hidden **tidak pernah** di-set true lagi.
    function terapkanBar(flagsSiap) {
      bar.siap = '1';                     // keadaan "disembunyikan" tidak ada lagi
      const toolbar = document.getElementById('toolbar');
      const barPaket = document.getElementById('toolbar-paket');
      if (toolbar) toolbar.hidden = false;                 // 🔴 SELALU tampil
      if (barPaket) barPaket.hidden = !bar.paket;          // bar paket di atas toolbar
      if (barEl) barEl.hidden = true;      // baris bar plugin tidak dipakai lagi
      tulisBar();
    }

    // dipakai editor saat paket ayat siap ditempel (K20)
    function paketAktif(tampil) {
      bar.paket = !!tampil;
      bar.paketTampil = !!tampil;   // dipertahankan untuk keserasian pemanggil lama
      terapkanBar();
    }

      // ------------------------------------------------------------
      // K104 (6 Nov 2026) — keadaan baris ke-2 (dipakai blok uji)
      // ------------------------------------------------------------
      function baris() {
        const toolbar = document.getElementById('toolbar');
        return {
          siap: '1',
          paket: bar.paket,
          paketTampil: bar.paketTampil,
          tampil: !!(toolbar && !toolbar.hidden),
          tinggi: toolbar ? Math.round(toolbar.getBoundingClientRect().height * 10) / 10 : 0,
          pemulih: !!document.getElementById('bar-pulih')
        };
      }

      // dipertahankan supaya pemanggil lama tidak error (toolbar memang selalu tampil)
            function tampilkanBar() { terapkanBar('1'); }

        // 🔴 K104 — tombol ▦ Tulis DIHAPUS; toolbar tulis selalu tampil, jadi tidak ada
        //    lagi pengait klik untuk menyembunyikannya.

        // ------------------------------------------------------------
        // tampilan: daftar plugin
        // ------------------------------------------------------------
  function el(tag, cls, teks) {
    const d = document.createElement(tag);
    if (cls) d.className = cls;
    if (teks !== undefined && teks !== null) d.textContent = teks;
    return d;
  }

  function lambangBadge(p) {
    if (dipasang(p.id)) return el('span', 'plugin-badge pasang', '● Terpasang');
    if (p.siap)         return el('span', 'plugin-badge belum', 'Siap dipasang');
    return el('span', 'plugin-badge belum', 'Belum dipasang');
  }

  function renderDaftar() {
    sedangLihat = null;
    isi.innerHTML = '';

    const arr = daftar();
    if (!arr.length) {
      const k = el('div', 'plugin-kosong');
      k.innerHTML = 'Belum ada plugin yang terdaftar.<br>' +
                    'Plugin ditambahkan dengan meletakkan berkas di folder <b>plugin/</b>.';
      isi.appendChild(k);
      return;
    }

    // ⚠️ URUTAN: plugin yang TERPASANG di kelompok ATAS.
    //    Jadi plugin yang baru dipasang otomatis “naik ke atas”
    //    (permintaan user 14 Sep 2026).
    const terpasangArr = arr.filter(p => dipasang(p.id));
    const tersediaArr  = arr.filter(p => !dipasang(p.id));

    const kelompok = (judulBaris, ketBaris, isiArr, kelas) => {
      const kepala = el('div', 'plugin-judul ' + kelas);
      kepala.appendChild(el('b', null, judulBaris));
      if (ketBaris) kepala.appendChild(el('span', 'plugin-ket', ketBaris));
      if (!isiArr.length) {
        kepala.appendChild(el('span', 'plugin-kosong-kecil', '— belum ada —'));
      }
      isi.appendChild(kepala);
      isiArr.forEach(p => isi.appendChild(kartuPlugin(p)));
    };

    kelompok('✔ Plugin yg terinstall',
      'Sudah dipasang. Klik untuk membuka / melepas.',
      terpasangArr, 'terinstall');

    kelompok('▸ Plugin yg tersedia (belum diinstall)',
      'Klik untuk melihat keterangannya dulu.',
      tersediaArr, 'tersedia');
  }

  // satu kartu plugin (dipakai daftar terinstall & tersedia)
  function kartuPlugin(p) {
    const kartu = el('div', 'plugin-kartu');
    kartu.dataset.id = p.id;
    if (dipasang(p.id)) kartu.classList.add('terpasang');

    kartu.appendChild(el('div', 'pk-ikon', p.ikon || '🧩'));

    const tengah = el('div', 'pk-tengah');
    tengah.appendChild(el('div', 'pk-nm', p.nama || p.id));
    tengah.appendChild(el('div', 'pk-kt', p.ringkas || ''));
    tengah.appendChild(lambangBadge(p));
    kartu.appendChild(tengah);

    // tombol cepat di kartu
    const aksi = el('div', 'pk-aksi');
    if (dipasang(p.id) && typeof p.buka === 'function') {
      const bBuka = el('button', 'pk-buka', p.tombolBuka || 'Buka');
      bBuka.addEventListener('click', (ev) => {
        ev.stopPropagation();
        try { p.buka(); } catch (e) { console.warn('ANodes: buka plugin gagal', e); }
        tutupGudang();
      });
      aksi.appendChild(bBuka);
    } else if (!dipasang(p.id) && p.siap) {
      const bPasang = el('button', 'pk-pasang', '⬇ Pasang');
      bPasang.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (!pasang(p.id)) return;
        const pesanSiap = () => {
          tandaKepala();
          pesan((p.ikon || '🧩') + ' ' + (p.nama || p.id) + ' siap dipakai');
          if (sedangLihat === null) renderDaftar();   // pindah ke kelompok “terinstall”
        };
        renderDaftar();
        const mesin = namespace(p.id);
        if (p.siap) pesanSiap();
        else if (mesin && typeof mesin.ketikaSiap === 'function') mesin.ketikaSiap(pesanSiap);
        else setTimeout(pesanSiap, 2200);
      });
      aksi.appendChild(bPasang);
    }
    kartu.appendChild(aksi);

    kartu.appendChild(el('div', 'pk-panah', '›'));
    kartu.addEventListener('click', () => bukaInfo(p.id));
    return kartu;
  }

  // ------------------------------------------------------------
  // tampilan: halaman keterangan (gaya WordPress)
  // ------------------------------------------------------------
  function bukaInfo(id) {
    const p = ambil(id);
    if (!p) return;
    sedangLihat = id;
    isi.innerHTML = '';

    const tombolKembali = el('button', 'plugin-pil-kembali', '‹ Kembali ke daftar');
    tombolKembali.addEventListener('click', renderDaftar);
    isi.appendChild(tombolKembali);

    // --- kepala: ikon + nama + versi/penulis + badge ---
    const kop = el('div', 'plugin-kop');
    kop.appendChild(el('div', 'pd-ikon', p.ikon || '🧩'));

    const info = el('div', 'pd-info');
    info.appendChild(el('div', 'pd-nm', p.nama || p.id));
    const baris = el('div', 'pd-baris');
    if (p.versi)   baris.appendChild(el('span', 'pd-tag', 'Versi ' + p.versi));
    if (p.penulis) baris.appendChild(el('span', 'pd-tag', 'oleh ' + p.penulis));
    if (p.ukuran)  baris.appendChild(el('span', 'pd-tag', 'Ukuran ' + p.ukuran));
    info.appendChild(baris);
    info.appendChild(lambangBadge(p));
    kop.appendChild(info);
    isi.appendChild(kop);

    // --- angka ringkas (66 kitab, dst) ---
    if (Array.isArray(p.angka) && p.angka.length) {
      const kotak = el('div', 'plugin-angka');
      p.angka.forEach(a => {
        const d = el('div');
        d.appendChild(el('b', null, a.n));
        d.appendChild(el('span', null, a.l));
        kotak.appendChild(d);
      });
      isi.appendChild(kotak);
    }

    // --- keterangan ---
    if (p.keterangan) {
      isi.appendChild(el('div', 'plugin-teks', p.keterangan));
    }

    // --- fitur ---
    blokDaftar('Yang bisa dilakukan setelah dipasang', p.fitur, false);

    // --- cara pakai ---
    blokDaftar('Cara pakai', p.cara, true);

    // --- pilihan cara tampil (kalau plugin menawarkannya) ---
    //   Dipakai plugin 🔗 Ayat Terkait (K25 butir f): user memilih apakah
    //   kaitan langsung tampil atau cukup tombol kecil.
    if (Array.isArray(p.pilihanTampil) && p.pilihanTampil.length) {
      const blok = el('div', 'plugin-blok');
      blok.appendChild(el('h4', null, 'Cara tampil di halaman baca'));
      const kotak = el('div', 'plugin-cara-tampil');
      const sekarang = typeof p.caraTampil === 'function' ? p.caraTampil() : null;
      p.pilihanTampil.forEach(pi => {
        const b = el('button', sekarang === pi.id ? 'aktif' : null);
        b.appendChild(document.createTextNode((sekarang === pi.id ? '✔ ' : '') + pi.nama));
        if (pi.contoh) b.appendChild(el('span', 'pct-contoh', pi.contoh));
        b.title = 'Pakai cara ini';
        b.addEventListener('click', () => {
          if (typeof p.pilihCara !== 'function') return;
          p.pilihCara(pi.id);
          bukaInfo(p.id);              // gambar ulang halaman supaya tanda ✔ pindah
        });
        kotak.appendChild(b);
      });
      blok.appendChild(kotak);
      isi.appendChild(blok);
    }

    // --- tombol tambahan di halaman keterangan (kalau plugin menawarkannya) ---
    //   Dipakai plugin 📖 Alkitab (K55): tombol [📖 sejarah] untuk membuka
    //   “Pengantar Sejarah Alkitab” dari gudang plugin.
    if (Array.isArray(p.tombolInfo) && p.tombolInfo.length) {
      const blok = el('div', 'plugin-blok');
      blok.appendChild(el('h4', null, 'Bacaan tambahan'));
      const kotak = el('div', 'plugin-tombol-info');
      p.tombolInfo.forEach(t => {
        const b = el('button', 'pt-info-buka');
        b.textContent = (t.ikon ? t.ikon + ' ' : '') + (t.nama || 'Buka');
        if (t.judul) b.title = t.judul;
        b.addEventListener('click', () => {
          if (typeof t.saatKlik === 'function') { try { t.saatKlik(); } catch (e) {} }
          // ⚠️ Panel gudang WAJIB ditutup — kalau tidak, panelnya menutupi
          //    halaman yang baru dibuka (mis. 📖 Pengantar Sejarah Alkitab).
          //    Sama seperti pola tombol [▶ Buka] di atas (`p.buka()` → `tutupGudang()`).
          tutupGudang();
        });
        kotak.appendChild(b);
      });
      blok.appendChild(kotak);
      isi.appendChild(blok);
    }

    // --- catatan ---
    if (Array.isArray(p.catatan) && p.catatan.length) {
      const blok = el('div', 'plugin-blok');
      blok.appendChild(el('h4', null, 'Sebelum memasang, perlu diketahui'));
      const box = el('div', 'plugin-catatan');
      box.innerHTML = p.catatan.map(c => '• ' + escapeKecil(c)).join('<br>');
      blok.appendChild(box);
      isi.appendChild(blok);
    }

    // --- kalau data belum siap ---
    // ⚠️ Teks ini GENERIK. Jangan menyebut nama plugin tertentu (dulu tertulis
    //    “Isi Alkitab (ayatnya) belum dimasukkan” — muncul juga di plugin Kamus
    //    padahal datanya sudah lengkap → membingungkan Bapak).
    if (!p.siap) {
      const box = el('div', 'plugin-belum');
      box.innerHTML = p.catatanTahap
        ? escapeKecil(p.catatanTahap)
        : '<b>Catatan tahap pengembangan:</b><br>' +
          'Keterangan plugin ini sudah siap. Isinya belum dimasukkan — ' +
          'itu dikerjakan pada tahap berikutnya. Tombol <b>Pasang</b> ' +
          'sudah bisa dicoba untuk melihat alurnya.';
      isi.appendChild(box);
    }

    // --- tombol aksi ---
    const aksi = el('div', 'plugin-aksi');
    if (dipasang(p.id)) {
      const bLepas = el('button', 'lepas', '🗑 Lepas plugin');
      bLepas.addEventListener('click', () => {
        if (confirm('Lepas plugin "' + p.nama + '"?\n\nCatatan pengguna tidak akan hilang — ' +
                    'hanya kemampuan plugin ini yang dimatikan.')) {
          lepas(p.id);
          bukaInfo(p.id);
        }
      });
      aksi.appendChild(bLepas);
      aksi.appendChild(el('span', 'plugin-status', '✔ Sedang terpasang'));
    } else {
      const bPasang = el('button', 'pasang', '⬇ Pasang plugin');
      bPasang.addEventListener('click', () => {
        if (!pasang(p.id)) return;

        // GUDANG TUTUP OTOMATIS setelah plugin dipasang —
        // user tidak perlu menutupnya sendiri (dulu dibiarkan terbuka terus).
        tutupGudang();

        // beri pesan setelah pemasangan benar-benar selesai (data siap),
        // supaya user tahu plugin sudah bisa dipakai.
        const pesanSiap = () => {
          tandaKepala();
          pesan((p.ikon || '🧩') + ' ' + (p.nama || p.id) + ' siap dipakai');
        };
        const mesin = namespace(p.id);
        if (p.siap) pesanSiap();
        else if (mesin && typeof mesin.ketikaSiap === 'function') mesin.ketikaSiap(pesanSiap);
        else setTimeout(pesanSiap, 2200);
      });
      aksi.appendChild(bPasang);
    }

    // plugin TERPASANG yang punya tombol buka (mis. Alkitab) — biar tidak
    // perlu mencari jalan lain untuk membukanya.
    if (dipasang(p.id) && typeof p.buka === 'function') {
      const bBuka = el('button', 'buka', (p.tombolBuka || '▶ Buka'));
      bBuka.addEventListener('click', () => {
        tutupGudang();
        try { p.buka(); } catch (e) { console.warn('ANodes: buka plugin gagal', e); }
      });
      aksi.insertBefore(bBuka, aksi.firstChild);
    }
    isi.appendChild(aksi);

    isi.parentNode.scrollTop = 0;

    function blokDaftar(judul, arr, bernomor) {
      if (!Array.isArray(arr) || !arr.length) return;
      const blok = el('div', 'plugin-blok');
      blok.appendChild(el('h4', null, judul));
      const list = el(bernomor ? 'ol' : 'ul');
      arr.forEach(x => list.appendChild(el('li', null, x)));
      blok.appendChild(list);
      isi.appendChild(blok);
    }
  }

  function escapeKecil(s) {
    const d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }

  // ------------------------------------------------------------
  // buka / tutup gudang
  // ------------------------------------------------------------
  function bukaGudang() {
    renderDaftar();
    modal.classList.add('buka');
  }
  function tutupGudang() { modal.classList.remove('buka'); }
  if (btnKpl) btnKpl.addEventListener('click', bukaGudang);
  if (modal) {
    document.getElementById('p-tt').addEventListener('click', tutupGudang);
    modal.addEventListener('click', (e) => { if (e.target === modal) tutupGudang(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('buka')) tutupGudang();
    });
  }

  muat();
  bacaBar();
  terapkanBar(bar.siap);
  tandaKepala();      // sekaligus menggambar tombol 🧩 di toolbar editor

  // ------------------------------------------------------------
  // TOMBOL 🧩 DI TOOLBAR EDITOR (submenu)
  // ------------------------------------------------------------
  // Permintaan user 14 Sep 2026: di toolbar tulis ada tombol [🧩 ▼];
  // kalau dipencet panahnya, yang keluar HANYA plugin yang sudah
  // terinstall (bukan yang belum), lalu diklik untuk dibuka.
  //   catatan: submenu digambar ulang setiap kali plugin dipasang/dilepas,
  //   jadi yang tampil selalu keadaan terbaru.
  function isiToolbarTombol() {
    return daftar().filter(p => dipasang(p.id));
  }

  function renderToolbar() {
    const sm = document.querySelector('.submenu[data-sub="plugin"]');
    const labelEl = document.getElementById('plugin-isi');
    const dasar = sm ? sm.parentNode.querySelector('.dasar') : null;
    if (labelEl) labelEl.textContent = '🧩';

    // tooltip + tanda kalau ada plugin terpasang
    const ada = isiToolbarTombol();
    if (dasar) {
      dasar.title = ada.length
        ? 'Plugin yang sudah terpasang (' + ada.length + '): klik panah ▼ untuk memilih'
        : 'Belum ada plugin terpasang — klik 🧩 di kepala untuk memasang';
      dasar.classList.toggle('ada-plugin', ada.length > 0);
    }
    if (!sm) return;

    sm.innerHTML = '';
    if (!ada.length) {
      const k = el('div', 'submenu-kosong', 'Belum ada plugin terpasang.');
      sm.appendChild(k);
      return;
    }

    ada.forEach(p => {
      const b = el('button', 'submenu-plugin-baris');
      b.appendChild(el('span', 'smp-ikon', p.ikon || '🧩'));
      b.appendChild(el('span', 'smp-nama', p.namaBar || p.nama || p.id));
      const bisa = typeof p.buka === 'function';
      if (bisa) b.appendChild(el('span', 'smp-panah', '›'));
      b.title = bisa
        ? ((p.ringkas || p.nama || '') + ' — klik untuk membuka')
        : ((p.ringkas || '') + ' — belum ada tampilan untuk dibuka');
      b.addEventListener('click', () => {
        if (!bisa) { pesan('⏳ ' + (p.nama || p.id) + ': belum ada tampilan untuk dibuka'); return; }
        try { p.buka(); } catch (e) { console.warn('ANodes: buka plugin gagal', e); }
      });
      sm.appendChild(b);
    });

    // selalu ada jalan ke halaman gudang (pasang / lepas plugin)
    const bGudang = el('button', 'submenu-plugin-baris ke-gudang');
    bGudang.appendChild(el('span', 'smp-ikon', '🧩'));
    bGudang.appendChild(el('span', 'smp-nama', 'Gudang Plugin…'));
    bGudang.title = 'Pasang / lepas plugin';
    bGudang.addEventListener('click', bukaGudang);
    sm.appendChild(bGudang);
  }

  // ------------------------------------------------------------
  // lapisan "sedang memuat" (dipakai plugin saat menyiapkan data besar)
  // ------------------------------------------------------------
  function lapisMemuat(nama, persen, ket) {
    const lapis = document.getElementById('memuat-plugin');
    if (!lapis) return;
    if (nama === null) { lapis.hidden = true; return; }
    lapis.hidden = false;
    const nm = document.getElementById('memuat-nama');
    const isi = document.getElementById('memuat-isi');
    const kt = document.getElementById('memuat-ket');
    if (nm)  nm.textContent  = nama;
    if (isi) isi.style.width = Math.max(0, Math.min(100, persen || 0)) + '%';
    if (kt)  kt.textContent  = ket || '';
  }

  // ------------------------------------------------------------
  // API
  // ------------------------------------------------------------
  return {
    daftar, ambil, pasang, lepas,
    dipasang, bukaGudang, tutupGudang,
    terapkanBar, paket: paketAktif, lapisMemuat, renderToolbar,
    // daftar tombol plugin terpasang (dipakai uji)
    tombolBar: () => {
      const arr = [];
      daftar()
        .filter(p => dipasang(p.id) && Array.isArray(p.bar))
        .forEach(p => p.bar.forEach(t => arr.push(Object.assign({ plugin: p.id }, t))));
      return arr;
    },
    get terpasang() { return terpasang.slice(); },
    get sedangLihat() { return sedangLihat; },
        // K103 — keadaan baris ke-2 + pemulih (dipakai strip & blok uji)
        baris, tampilkanBar,
        get barTampil() {
          const toolbar = document.getElementById('toolbar');
          return (toolbar && !toolbar.hidden) ? 'toolbar' : 'tidak ada';
        }
  };
})();

// supaya bisa dipanggil dari berkas plugin lain (mis. plugin/alkitab/alkitab.js)
window.ANodesPlugin = ANodesPlugin;
