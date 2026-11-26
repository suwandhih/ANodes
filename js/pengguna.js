/* ============================================================
   ANodes — js/pengguna.js
   👤 PEMISAHAN DATA PER EMAIL  (K100 — 3 Nov 2026)

   ------------------------------------------------------------
   PERMINTAAN PEMILIK PROYEK
   ------------------------------------------------------------
     *“sekalian dibuat untuk isi 1x untuk seterusnya masuk email ..
      memisahan data satu user dengan yg lain .. menurut saya tidak
      banyak paling banyak mungkin 20 pengguna... data dipisahkan
      dengan email saja”*

   Keputusan yang dipilih pemilik proyek (3 pertanyaan saya):
     • catatan lama  → WARISI : semua catatan yang sudah ada otomatis
                       menjadi milik email PERTAMA yang dimasukkan
                       (❌ tidak ada yang hilang)
     • kapan ditanya → PERTAMA : hanya sekali saat pertama membuka ANodes,
                       sesudah itu diingat; bisa diganti lewat
                       `File ▼ → 👤 Pengguna…`
     • sinkron       → PER EMAIL : tiap email punya barisnya sendiri di
                       server (kunci dikirim dengan awalan email)

   ------------------------------------------------------------
   CARA KERJA (sengaja SESEDERHANA — data dipisah dari NAMA KUNCINYA)
   ------------------------------------------------------------
     awalan()            → `u:<email>::`      ('' kalau email belum diisi)
     kunci('anodes-x')   → `u:<email>::anodes-x`

   ⇒ SEMUA modul yang menyimpan data cukup memanggil `ANodesPengguna.kunci(…)`
     saat membaca/menulis. ❌ Tidak ada salinan data di tempat lain, tidak ada
     mesin baru, dan tidak ada yang perlu diubah di dalam struktur data.
   ⇒ Email kedua/ketiga otomatis mendapat ruangnya sendiri — tanpa menyentuh
     email yang lain.

   ------------------------------------------------------------
   MIGRASI “WARISI” (dijalankan SEKALI, saat email pertama diisi)
   ------------------------------------------------------------
     Untuk tiap kunci data: kalau versi TANPA awalan ada dan versi BERAWALAN
     belum ada ⇒ disalin, dibaca ulang untuk dipastikan utuh, lalu versi tanpa
     awalan dihapus. Dengan begitu catatan lama benar-benar “pindah” ke email
     pertama (bukan diduplikasi — ruang localStorage terbatas 5 MB).

   ------------------------------------------------------------
   ATURAN YANG DIJAGA
   ------------------------------------------------------------
   1. ❌ JANGAN menulis “Bapak” di teks yang tampil (aturan K48) — pakai “Anda”.
   2. Mengganti email ⇒ halaman DIMUAT ULANG sesudah catatan disimpan, supaya
      seluruh modul membaca kunci yang baru. (Satu jalur, tidak ada keadaan
      setengah berganti.)
   3. Email disimpan di luar awalan (`anodes-pengguna-email`) — kalau ikut
      diawali, ia tidak akan pernah bisa ditemukan lagi.
   4. Pemakaian tanpa email tetap DIPERBOLEHKAN (tombol “Lewati dulu”) ⇒
      aplikasi berjalan seperti sebelumnya (kunci tanpa awalan).
   ============================================================ */

window.ANodesPengguna = (function () {
  'use strict';

  const VERSI = 'v3Nov-j';

  const KUNCI_EMAIL = 'anodes-pengguna-email';   // ⚠️ TANPA awalan — ini penentu awalan
  const KUNCI_LEWATI = 'anodes-pengguna-lewati'; // '1' = sudah pernah menekan “Lewati dulu”

  /* Kunci data yang ikut dipisah per email.
     ⚠️ Tambahkan di sini kalau nanti ada simpanan baru — kalau tidak, simpanan
        itu akan tetap dipakai bersama semua email. */
  const KUNCI_DATA = [
    'anodes-catatan-v1',
    'anodes-setting-v1',
    'anodes-kamus-pribadi',
    'anodes-rantai-v1',
    'anodes-bookmark-v1',
    'anodes-baca1tahun-v1',
  ];

  let emailAktif = '';

  // ------------------------------------------------------------
  // email
  // ------------------------------------------------------------
  function bacaEmail() {
    try { return String(localStorage.getItem(KUNCI_EMAIL) || '').toLowerCase().trim(); } catch (e) { return ''; }
  }

  function tulisEmail(e) {
    try { localStorage.setItem(KUNCI_EMAIL, e || ''); return true; } catch (x) { return false; }
  }

  function bacaLewati() {
    try { return localStorage.getItem(KUNCI_LEWATI) === '1'; } catch (e) { return false; }
  }

  function tulisLewati(v) {
    try { localStorage.setItem(KUNCI_LEWATI, v ? '1' : '0'); } catch (e) {}
  }

  /** email yang sedang dipakai ('' = belum diisi) */
  function email() { return emailAktif; }

  /** sudah pernah diisi? */
  function ada() { return !!emailAktif; }

  /** awalan semua kunci data — '' kalau email belum diisi */
  function awalan() { return emailAktif ? 'u:' + emailAktif + '::' : ''; }

  /** kunci data sesungguhnya untuk email yang sedang aktif */
  function kunci(k) { return awalan() + k; }

  /** sah? (cek sederhana — cukup untuk memisahkan data, bukan pendaftaran) */
  function sah(e) {
    e = String(e || '').trim();
    if (e.length < 5 || e.length > 80) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  }

  // ------------------------------------------------------------
  // MIGRASI “WARISI”
  // ------------------------------------------------------------
  /** pindahkan kunci TANPA awalan ⇒ kunci BERAWALAN (sekali saja) */
  function warisi() {
    const aw = awalan();
    if (!aw) return { dipindah: [] };
    const dipindah = [];

    KUNCI_DATA.forEach(k => {
      let asal = null;
      try { asal = localStorage.getItem(k); } catch (e) { return; }
      if (asal == null) return;

          // ⚠️ tujuan WAJIB kunci BER-AWALAN — kalau memakai kunci mentah,
          //    pemeriksa "sudah ada isinya" akan menemukan kunci sumbernya sendiri
          //    dan migrasi tidak pernah berjalan (cacat nyata, ketemu di K100-17).
          const tujuan = kunci(k);
          let sudah = null;
          try { sudah = localStorage.getItem(tujuan); } catch (e) { sudah = null; }
          // sudah ada isi untuk email ini ⇒ JANGAN ditimpa
          if (sudah != null) return;

      try {
        localStorage.setItem(tujuan, asal);
        // pastikan benar-benar tertulis sebelum yang lama dihapus
        if (localStorage.getItem(tujuan) !== asal) return;
        localStorage.removeItem(k);
        dipindah.push(k);
      } catch (e) {
        console.warn('ANodes: gagal memindahkan ' + k, e);
      }
    });

    return { dipindah: dipindah };
  }

  // ------------------------------------------------------------
  // simpan email + muat ulang halaman
  // ------------------------------------------------------------
  /**
   * @param {string} e      email yang dipakai
   * @param {object} opsi   { paksa:true = jangan minta konfirmasi, senyap:true = tanpa muat ulang }
   */
  function pakai(e, opsi) {
    e = String(e || '').toLowerCase().trim();
    if (!sah(e)) return { ok: false, pesan: 'Email belum benar — contoh: nama@contoh.com' };

    const lama = bacaEmail();
    if (lama === e) {
      emailAktif = e;
      return { ok: true, pesan: 'Email tidak berubah', tetap: true };
    }

    // pastikan ketikan yang belum tersimpan tidak hilang
    try {
      if (window.ANodesEditor && ANodesEditor.simpanSekarang) ANodesEditor.simpanSekarang({ diam: true });
    } catch (x) {}

    const pertama = !lama;
    tulisEmail(e);
    emailAktif = e;

    // email PERTAMA ⇒ semua data lama diwarisi
    const w = pertama ? warisi() : { dipindah: [] };

    tulisLewati(false);

    if (!(opsi && opsi.senyap)) {
      // muat ulang supaya SEMUA modul membaca kunci yang baru
      // (satu jalur — tidak ada keadaan setengah berganti)
      try { location.reload(); } catch (x) {}
    }

    return { ok: true, pesan: 'Email dipakai: ' + e, warisan: w.dipindah, pertama };
  }

  function lewati() {
    tulisLewati(true);
    tutup();
  }

  function lupakan() {
    // hanya melepas email dari perangkat ini — DATA TIDAK DIHAPUS
    tulisEmail('');
    emailAktif = '';
    try { location.reload(); } catch (x) {}
  }

  /** daftar email yang punya data di perangkat ini (untuk pemilih) */
  function daftarEmail() {
    const set = new Set();
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || '';
        const m = k.match(/^u:([^:]+)::/);
        if (m) set.add(m[1]);
      }
    } catch (e) {}
    if (emailAktif) set.add(emailAktif);
    return [...set].sort();
  }

  // ------------------------------------------------------------
  // modal
  // ------------------------------------------------------------
  function elModal() { return document.getElementById('modal-pengguna'); }

  function buatModal() {
    let m = elModal();
    if (m) return m;

    m = document.createElement('div');
    m.className = 'modal-bg';
    m.id = 'modal-pengguna';
    m.innerHTML =
      '<div class="modal">' +
        '<div class="m-kepala">' +
          '<span>👤 Pengguna ANodes</span><span class="sp"></span>' +
          '<button id="pu-tt" title="Tutup">✕</button>' +
        '</div>' +
        '<div class="m-isi">' +
          '<p class="pu-ket">' +
            'Tulis <b>email Anda</b> satu kali. Sejak itu ANodes mengingatnya, dan ' +
            '<b>data Anda terpisah</b> dari data orang lain di perangkat ini.' +
          '</p>' +
          '<div class="pu-baris">' +
            '<label for="pu-email">Email</label>' +
            '<input id="pu-email" type="email" inputmode="email" autocomplete="email" ' +
              'placeholder="nama@contoh.com" spellcheck="false">' +
          '</div>' +
          '<div id="pu-pesan" class="pu-pesan"></div>' +
          '<div id="pu-daftar" class="pu-daftar"></div>' +
          '<p class="pu-ket pu-ket-kecil">' +
            'Catatan: pemisahan ini hanya menyimpan data di perangkat ini (dan di server ' +
            'sinkron bila dipakai). Tidak ada kata sandi — ini untuk memisahkan data, ' +
            'bukan mengamankannya.' +
          '</p>' +
        '</div>' +
        '<div class="m-kaki">' +
          '<button class="batal" id="pu-lewati">Lewati dulu</button>' +
          '<button class="ok" id="pu-pakai">Pakai email ini</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(m);

    const inp = m.querySelector('#pu-email');

    m.querySelector('#pu-tt').addEventListener('click', () => {
      // saat pertama kali (belum ada email & belum dilewati) ✕ = lewati
      if (!ada() && !bacaLewati()) { lewati(); return; }
      tutup();
    });
    m.querySelector('#pu-lewati').addEventListener('click', lewati);
    m.querySelector('#pu-pakai').addEventListener('click', () => {
      const r = pakai(inp.value);
      if (!r.ok) { pesan(r.pesan, false); return; }
      if (r.tetap) tutup();
    });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); m.querySelector('#pu-pakai').click(); }
    });
    m.addEventListener('click', (e) => {
      if (e.target === m) {
        if (!ada() && !bacaLewati()) return;   // tahap pertama: wajib memilih
        tutup();
      }
    });
    return m;
  }

  function pesan(t, ok) {
    const e = document.getElementById('pu-pesan');
    if (!e) return;
    e.textContent = t || '';
    e.className = 'pu-pesan' + (ok === false ? ' salah' : (ok === true ? ' benar' : ''));
  }

  function gambarDaftar() {
    const w = document.getElementById('pu-daftar');
    if (!w) return;
    const daftar = daftarEmail();
    if (!daftar.length) { w.innerHTML = ''; return; }
    w.innerHTML = '<div class="pu-daftar-judul">Sudah ada di perangkat ini:</div>' +
      daftar.map(x =>
        '<button class="pu-pilih" data-email="' + x.replace(/"/g, '&quot;') + '"' +
        (x === emailAktif ? ' disabled' : '') + '>' +
        (x === emailAktif ? '✅ ' : '👤 ') + x + '</button>'
      ).join('');
    w.querySelectorAll('.pu-pilih').forEach(b => {
      b.addEventListener('click', () => {
        const inp = document.getElementById('pu-email');
        if (inp) inp.value = b.dataset.email;
        pakai(b.dataset.email);
      });
    });
  }

  function buka() {
    const m = buatModal();
    const inp = document.getElementById('pu-email');
    const judul = m.querySelector('.m-kepala span');
    const kakiL = document.getElementById('pu-lewati');
    const pertama = !ada() && !bacaLewati();

    if (inp) inp.value = emailAktif || '';
    if (judul) judul.textContent = pertama ? '👤 Siapa yang memakai ANodes?' : '👤 Pengguna ANodes';
    // tombol “Lewati dulu” hanya pada tahap pertama (sesudah itu tidak perlu)
    if (kakiL) kakiL.hidden = !pertama;

    pesan(emailAktif ? 'Sedang dipakai: ' + emailAktif : '', emailAktif ? true : null);
    gambarDaftar();
    m.classList.add('buka');
    setTimeout(() => { if (inp) inp.focus(); }, 60);
    return m;
  }

  function tutup() {
    const m = elModal();
    if (m) {
      m.classList.remove('buka');
      pesan('');
    }
  }

  function terbuka() {
    const m = elModal();
    return !!(m && m.classList.contains('buka'));
  }

  // ------------------------------------------------------------
  // pemasangan
  // ------------------------------------------------------------
  function pasangPengait() {
    const it = document.getElementById('menu-pengguna');
    if (it && !it.dataset.siap) {
      it.dataset.siap = '1';
      it.addEventListener('click', (e) => { e.preventDefault(); buka(); });
    }
    if (!document.body.dataset.siapPenggunaEsc) {
      document.body.dataset.siapPenggunaEsc = '1';
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || !terbuka()) return;
        const pertama = !ada() && !bacaLewati();
        if (pertama) return;          // tahap pertama: harus memilih
        e.preventDefault(); e.stopPropagation();
        tutup();
      }, true);
    }
  }

  /** tampilkan modal otomatis kalau email belum pernah diisi */
  function siapkanOtomatis() {
    emailAktif = bacaEmail();
    pasangPengait();
    if (!emailAktif && !bacaLewati()) {
      // beri kesempatan seluruh modul memuat data dulu
      setTimeout(() => { if (!ada() && !bacaLewati()) buka(); }, 700);
    }
  }

  // ------------------------------------------------------------
  // mulai
  // ------------------------------------------------------------
  emailAktif = bacaEmail();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', siapkanOtomatis);
  } else {
    setTimeout(siapkanOtomatis, 0);
  }

  return {
    VERSI,
    KUNCI_DATA,
    email,
    ada,
    awalan,
    kunci,
    sah,
    pakai,
    lewati,
    lupakan,
    daftarEmail,
    buka,
    tutup,
    terbuka,
    warisi,
    siapkanOtomatis,
    versi: () => VERSI,
  };
})();