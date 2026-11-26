/* ============================================================
   ANodes — js/berkas.js
   🗂️ HALAMAN BERKAS TERSIMPAN  (K28h — 3 Nov 2026)

   ------------------------------------------------------------
   SEJARAH SINGKAT (jangan diulang)
   ------------------------------------------------------------
   Dulu daftar ini ada di **menu [Doc]** → baris “🌿 Ayat Terkait”.
   Menu [Doc] **dihapus** atas keputusan pemilik proyek
   (*“[doc] sudah tidak perlu.. karena sistem sudah hampir selesai”*),
   jadi daftarnya dipindah ke **halaman sendiri** supaya rantai yang
   sudah disimpan tetap bisa:
     • dibuka lagi di halaman kerja 🌿
     • dikirim ke catatan (tombol “+ Ayat” — jalur K40)
     • dihapus satu-satu / dibersihkan semua

   ⚠️ Yang dipindah HANYA daftarnya. Mesin rantai tetap di
      `plugin/ayat-terkait/kerja.js` (K31) — ❌ tidak ada mesin baru.

   Halaman ini **anak `body`** (sejajar #app-utama · #baca-alkitab ·
   #kerja-ayat · …). Kalau ditaruh di dalam #app-utama, ia ikut
   tersembunyi saat catatan disembunyikan.
   ============================================================ */

const ANodesBerkas = (() => {
  'use strict';

  const KUNCI_INSERT = 'anodes-insert-ayat';   // pilihan bentuk masukan (K40)

  const elHal    = () => document.getElementById('berkas-halaman');
  const elIsi    = () => document.getElementById('bk-isi');
  const elKembali= () => document.getElementById('bk-kembali');
  const elKerja  = () => document.getElementById('bk-kerja');
  const elBersih = () => document.getElementById('bk-bersih');

  const mesinKerja = () => window.ANodesAyatTerkaitKerja;

  // ------------------------------------------------------------
  // pesan singkat (pakai toast milik editor kalau ada)
  // ------------------------------------------------------------
  function pesan(t) {
    const e = document.getElementById('toast');
    if (!e) return;
    e.textContent = t;
    e.classList.add('tampil');
    clearTimeout(pesan._t);
    pesan._t = setTimeout(() => e.classList.remove('tampil'), 2200);
  }

  // ------------------------------------------------------------
  // pilihan bentuk masukan (sama seperti di halaman kerja)
  // ------------------------------------------------------------
  function opsiInsert() {
    let o = null;
    try { o = JSON.parse(localStorage.getItem(KUNCI_INSERT) || 'null'); } catch (e) {}
    return Object.assign({ kalimat: false, panjang: false }, o || {});
  }

  // tanggal ringkas: “15 Sep 19:54”
  function jamPendek(iso) {
    if (!iso) return '—';
    const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '—';
      const p = (x) => String(x).padStart(2, '0');
      return d.getDate() + ' ' + BULAN[d.getMonth()] + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    } catch (e) { return '—'; }
  }

  // ------------------------------------------------------------
  // BUKA / TUTUP halaman
  // ------------------------------------------------------------
  function buka() {
    const hal = elHal();
    if (!hal) return;
    // sembunyikan halaman lain yang sedang tampil (pola sama seperti
    // halaman plugin lain — halaman ini menyembunyikan DIRINYA SENDIRI
    // saat pindah, dan menyembunyikan yang lain saat dibuka).
    ['app-utama', 'baca-alkitab', 'kerja-ayat', 'kamus-halaman',
     'penguat-halaman', 'sejarah-halaman', 'peta-halaman',
     'baca1tahun-halaman', 'bookmark-halaman'].forEach(id => {
      const e = document.getElementById(id);
      if (e) e.hidden = true;
    });
    hal.hidden = false;
    gambar();
  }

  function tutup() {
    const hal = elHal();
    if (hal) hal.hidden = true;
    const utama = document.getElementById('app-utama');
    if (utama) utama.hidden = false;
  }

  // ------------------------------------------------------------
  // GAMBAR daftar
  // ------------------------------------------------------------
  function gambar() {
    const lihat = elIsi();
    if (!lihat) return;
    lihat.innerHTML = '';

    const k = mesinKerja();
    const daftar = (k && k.daftarSimpanan) ? k.daftarSimpanan() : [];

    const kotak = document.createElement('div');
    kotak.className = 'simpanan-kotak';

    const h = document.createElement('h2');
    h.textContent = '🗂️ Berkas tersimpan — ' + daftar.length + ' berkas';
    kotak.appendChild(h);

    const ket = document.createElement('p');
    ket.className = 'simpanan-catatan';
    ket.textContent = 'Berkas ini adalah BAHAN MENTAH (urutan ayat), belum jadi catatan. ' +
      'Dibuat di halaman kerja 🌿 Ayat Terkait — bawaan namanya ayat utama. ' +
      'Tekan “+ Ayat” untuk mengirim isinya ke catatan.';
    kotak.appendChild(ket);

    if (!k) {
      const kosong = document.createElement('div');
      kosong.className = 'simpanan-kosong';
      kosong.textContent = '⚠️ Plugin 🔗 Ayat Terkait belum dipasang. ' +
        'Pasang lewat 🧩 Gudang Plugin supaya berkas tersimpan bisa dibuka.';
      kotak.appendChild(kosong);
      lihat.appendChild(kotak);
      return;
    }

    if (!daftar.length) {
      const kosong = document.createElement('div');
      kosong.className = 'simpanan-kosong';
      kosong.textContent = 'Belum ada berkas tersimpan. Buka Alkitab → tekan “ayat terkait (n)” ' +
        'pada sebuah ayat → pilih kaitan → tekan “✓ pilih”. Rantainya akan tersimpan sendiri.';
      kotak.appendChild(kosong);
      lihat.appendChild(kotak);
      return;
    }

    const ul = document.createElement('ul');
    ul.className = 'simpanan-lis';

    daftar.forEach(s => {
      const li = document.createElement('li');

      const info = document.createElement('div');
      const nm = document.createElement('div');
      nm.className = 'ss-nama';
      nm.textContent = '🌿 ' + (s.nama || '(tanpa nama)');
      info.appendChild(nm);
      const pk = document.createElement('div');
      pk.className = 'ss-ket';
      pk.textContent = (s.jumlahAyat || 1) + ' ayat · diubah ' + jamPendek(s.diubah);
      info.appendChild(pk);
      li.appendChild(info);

      const aks = document.createElement('div');
      aks.className = 'ss-aksi';

      // 🌿 Buka lagi di halaman kerja
      const bBuka = document.createElement('button');
      bBuka.className = 'ss-buka';
      bBuka.textContent = '🌿 Buka';
      bBuka.title = 'Buka lagi rantai ini di halaman kerja';
      bBuka.addEventListener('click', () => {
        const hal = elHal();
        if (hal) hal.hidden = true;
        k.bukaSimpanan(s.id);
      });
      aks.appendChild(bBuka);

      // + Ayat — kirim isi rantai ke CATATAN (jalur K40)
      const bInsert = document.createElement('button');
      bInsert.className = 'ss-insert';
      bInsert.textContent = '+ Ayat';
      bInsert.title = 'Kirim ayat rantai ini ke catatan (lalu tentukan letaknya di catatan)';
      bInsert.addEventListener('click', () => {
        if (typeof k.susunDariSimpanan !== 'function') {
          pesan('⚠️ Plugin 🔗 Ayat Terkait belum dipasang');
          return;
        }
        const paket = k.susunDariSimpanan(s.id, opsiInsert());
        if (!paket) { pesan('⚠️ Isi rantai tidak ditemukan'); return; }
        k.kirimKeCatatan(paket, { jenis: 'rantai', id: s.id });
      });
      aks.appendChild(bInsert);

      // 🗑 Hapus satu berkas
      const bHapus = document.createElement('button');
      bHapus.className = 'ss-hapus';
      bHapus.textContent = '🗑';
      bHapus.title = 'Hapus berkas rantai ini';
      bHapus.addEventListener('click', () => {
        if (!confirm('Hapus berkas rantai “' + (s.nama || '(tanpa nama)') + '”?\n\n' +
                     '(Catatan pengguna TIDAK tersentuh — ini hanya daftar ayat.)')) return;
        if (k.hapusSimpanan) k.hapusSimpanan(s.id);
        pesan('🗑 Berkas rantai dihapus');
        gambar();
      });
      aks.appendChild(bHapus);

      li.appendChild(aks);
      ul.appendChild(li);
    });

    kotak.appendChild(ul);
    lihat.appendChild(kotak);
    lihat.scrollTop = 0;
  }

  // ------------------------------------------------------------
  // PENGHAIT
  // ------------------------------------------------------------
  function kait(id, jenis, fn) {
    const e = document.getElementById(id);
    if (!e || e.dataset.siapBerkas) return;
    e.dataset.siapBerkas = '1';
    e.addEventListener(jenis, fn);
  }

  function pasangPengait() {
    kait('btn-berkas', 'click', buka);
    kait('bk-kembali', 'click', tutup);

    kait('bk-kerja', 'click', () => {
      const k = mesinKerja();
      if (!k) { pesan('⚠️ Plugin 🔗 Ayat Terkait belum dipasang'); return; }
      const hal = elHal();
      if (hal) hal.hidden = true;
      k.buka(null, null);
      if (typeof k.hidupkan === 'function') k.hidupkan();
    });

    kait('bk-bersih', 'click', () => {
      const k = mesinKerja();
      if (!k || !k.daftarSimpanan) { pesan('⚠️ Plugin 🔗 Ayat Terkait belum dipasang'); return; }
      const daftar = k.daftarSimpanan();
      if (!daftar.length) { pesan('ℹ️ Belum ada berkas untuk dibersihkan'); return; }
      if (!confirm('Hapus SEMUA berkas rantai (' + daftar.length + ' berkas)?\n\n' +
                   'Ini hanya daftar ayat (bahan mentah) — CATATAN pengguna tidak tersentuh.\n' +
                   'Tidak bisa dibatalkan.')) return;
      daftar.slice().forEach(s => k.hapusSimpanan(s.id));
      pesan('🗑 ' + daftar.length + ' berkas rantai dibersihkan');
      gambar();
    });

    // Esc = kembali ke catatan (pola sama seperti halaman plugin lain)
    document.addEventListener('keydown', (e) => {
      const hal = elHal();
      if (!hal || hal.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); tutup(); }
    });
  }

  // ------------------------------------------------------------
  // SIAPKAN OTOMATIS
  //   ⚠️ WAJIB ada pemanggil sendiri saat halaman dimuat — kalau hanya
  //      dipanggil dari tempat lain, penghait hilang sesudah F5
  //      (pelajaran K47e · K55 · K92).
  // ------------------------------------------------------------
  function siapkanOtomatis() {
    pasangPengait();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', siapkanOtomatis);
  } else {
    setTimeout(siapkanOtomatis, 0);
  }

  return {
    buka, tutup, gambar, siapkanOtomatis,
    get _terbuka() { const h = elHal(); return !!(h && !h.hidden); }
  };
})();

window.ANodesBerkas = ANodesBerkas;
