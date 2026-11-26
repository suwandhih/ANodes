/* ============================================================
   ANodes — plugin/alkitab/tampilan.js
   TAMPILAN PLUGIN ALKITAB (tahap d + e + f)
   ------------------------------------------------------------
   Gaya baca MENIRU lab3:
     [↑ kembali][Kitab ▾][Pasal ▾][◀][▶][↩][📋 PILIH][⌨ KETIK]

   Mengurus:
     • klik nama ayat di catatan  → halaman baca (sebesar catatan)
     • tombol ↑ kembali           → balik + sorot tempat klik tadi
     • pilih kitab/pasal dari daftar, ◀ ▶ pindah pasal, ↩ posisi sebelumnya
     • 📋 PILIH  → grid kitab → pasal → ayat
     • ⌨ KETIK   → ketik nama ayat, atau ketik kata untuk mencari
   ============================================================ */

(function () {
  'use strict';

  // penanda versi — bisa diperiksa dari Console: ANodesAlkitabTampilan.versi()
  // K55b (22 Sep 2026): fitur 📖 sejarah dipindah menjadi PLUGIN SENDIRI
  //   (plugin/sejarah/) — plugin Alkitab kembali bersih & tidak tahu soal itu.
  // K80 (30 Okt 2026) — [Full] rentang + kedip 5 dtk + 🏠 balik bacaan
  //   (sebelumnya K70, 5 Okt 2026 — 🔌 sakelar ON/OFF penandaan catatan, bawaan OFF)
  // K91 (2 Nov 2026) — 🔍 revisi cari: 🏠 balik ke bacaan sebelum cari ·
  //   🔎 saran kata mirip · 🕘 riwayat cari + 🗑 hapus
  const VERSI = 'v3Nov-f';

  const mesin = () => window.ANodesAlkitab;

  const elKitab   = () => document.getElementById('baca-kitab');
  const elPasal   = () => document.getElementById('baca-pasal');
  const elIsi     = () => document.getElementById('baca-isi');
  const elNavNama = () => document.getElementById('baca-kitab-nama');
  const elNavJml  = () => document.getElementById('ay-nav-jml');

  /* ============================================================
     K63 (23 Sep 2026) — CARA BUKA HALAMAN BACA
     ------------------------------------------------------------
     Bapak: *“⚙ Pengaturan > pilih model buka alkitab dengan menu pulldown / Pilih”*

       'pulldown' (BAWAAN) — menu dikelompokkan **2 baris**:
           baris 1 : [🏠] [📋 PILIH]   …   [↩] [🔍 Cari] [📤] [🖊]
           baris 2 : 1 Samuel  [ 7 ▾ ]  [◀] [▶]        28 ayat
         ⇒ baris 2 SEKALIGUS jadi JUDUL (kitab + pasal) dan SELURUH navbar
           **di-freeze** (`flex-shrink: 0` di dalam `.halaman-alkitab`).
           Penanda di dalam bacaan (`.ay-judul` · `.ay-meta`) disembunyikan
           ⚠️ tetapi **ELEMENNYA TETAP ADA** — dipakai sebagai jangkar oleh
              plugin 📖 Sejarah & 🌿 Ayat Terkait.
       'pilih' — semua tombol **1 baris** (bentuk LAMA sejak 14 Sep 2026).

     ⚠️ Yang berubah HANYA TAMPILAN. Cara kerja (🏠 · ◀ ▶ · ↩ · 📋 PILIH ·
        🔍 Cari · 📤 · 🖊 · klik angka ayat) ❌ TIDAK berubah sama sekali.
     ⚠️ `#baca-kitab` TETAP ADA di DOM (hanya `display:none` saat pulldown)
        supaya pengait & uji lama tidak gagal palsu.
     ============================================================ */
  // pasal yang sedang tampil — dipakai baris 2 navbar (judul pasal)
  let pasalTampil = null;      // { nama, noPasal, jumlahAyat } atau null

  // K63 — isi BARIS 2 navbar: nama kitab + “n ayat”
  //   Baris 2 itu SEKALIGUS judul pasal — nomor pasalnya ada di kotak pilihan.
  function segarkanBaris2() {
    const n = elNavNama();
    const j = elNavJml();
    if (n) {
      n.textContent = pasalTampil ? pasalTampil.nama : '—';
      n.title = pasalTampil
        ? (pasalTampil.nama + ' ' + pasalTampil.noPasal +
           ' — ganti kitab lewat kotak pilihan atau 📋 PILIH')
        : 'Kitab yang sedang dibuka — ganti lewat kotak pilihan atau 📋 PILIH';
    }
    if (j) j.textContent = pasalTampil ? (pasalTampil.jumlahAyat + ' ayat') : '';
  }

  // ⏹️ Fungsi di bawah tidak dipakai lagi (arahan Bapak 23 Sep 2026:
  //   “⚙ Pengaturan untuk pilih di hilangkan lagi”) — DIPERTAHANKAN sebagai
  //   no-op supaya berkas/pemanggil versi lama tidak error.
  function caraBaca() { return 'dua-baris'; }
  function terapkanCaraBaca() { segarkanBaris2(); return 'dua-baris'; }
  function segarkanSamarJudul() {}

  // posisi yang sedang dibuka + riwayat (untuk tombol ↩)
  let posisi = { kitab: 1, pasal: 1, ayat: 0 };
  // K34 — rentang ayat yang sedang dibuka (mis. Roma 8:6-10).
  //   Diisi saat tautan berentang diklik dari catatan; DIKOSONGKAN saat pindah
  //   pasal / ganti kitab / buka lewat cara lain (supaya baris pemilih ayat
  //   hanya muncul untuk rentang yang memang diminta user).
  let rentangBuka = null;
  let riwayat = [];

  // K80 (30 Okt 2026) — [Full] dari pratinjau 🌿 Ayat Terkait.
  //   Bapak: *“tombol full ini untuk lompat ke alkitab ke bilangan 6 bisa baca
  //   keseluruhan · tapi posisikan pada ayat 24-26 di buat stabilo sistem
  //   blinking beberapa detik supaya user tau posisi ayat · dan klik home
  //   kembali pada bacaan sebelumnya”*
  //   ⇒ `asalBacaan` = bacaan SEBELUM lompat (mis. 2 Petrus 1). Tombol 🏠
  //     memakainya lebih dulu; tekan 🏠 lagi baru kembali ke catatan.
  let asalBacaan = null;
  // penjaga: `gambarPasal()` mengosongkan `asalBacaan` pada setiap perpindahan
  //   BIASA (supaya 🏠 tidak melompat ke tempat tak terduga). Hanya pemanggil
  //   yang MENYETEL `asalBacaan` sendiri yang boleh mempertahankannya.
  let pertahankanAsalBacaan = false;

  // K91a (2 Nov 2026) — 🏠 dari HASIL CARI kembali ke bacaan SEBELUM mencari.
  //   Bapak: *“posisi sedang baca kitab keluaran 1:1 lalu klik cari misal
  //   "onesimus" keluar kolose 4:9 .. user hanya baca lalu mau kembali ke
  //   bacaan sebelumnya keluaran 1:1 .. belum bisa klik 🏠 > ke catatan
  //   seharusnya kembali ke kitab keluaran 1:1”*
  //   Sebab terukur: `bukaHalamanCari()` tidak mencatat bacaan asal, dan
  //   `gambarHasilCari()` tidak menyentuh `posisi`/`asalBacaan` ⇒ klik hasil
  //   memanggil `gambarPasal()` biasa ⇒ `asalBacaan` dibuang ⇒ 🏠 langsung
  //   ke catatan. Sekarang bacaan itu diingat di sini lalu dipakai K80.
  let asalCari = null;
  let timerKedip = null;

  // ------------------------------------------------------------
  // K20 · PILIH AYAT → KIRIM PAKET KE CATATAN
  // ------------------------------------------------------------
  // Alur (keputusan user 14 Sep 2026):
  //   klik angka ayat → bar kirim muncul (baris ke-2, di bawah bar utama)
  //   klik angka lain → jadi rentang (7,8 → "7-8"); klik angka sama = dilepas
  //   [💬 Kalimat]     → sertakan kalimatnya (mati = hanya nama ayat)
  //   [📖 Yoh 4:7]     → tulisannya berubah sendiri (panjang ⇄ singkat)
  //   [📋 Simpan]      → paket siap ditempel; bar kirim TUTUP (selesai tugas)
  let pilih = [];                                    // nomor ayat terpilih
  let opsiPaket = { kalimat: false, panjang: true }; // bentuk paket

  const elKirim = () => document.getElementById('bar-kirim');
  const bacaHal = () => document.getElementById('baca-alkitab');
  const utamaHal = () => document.getElementById('app-utama');

  function amanTeks(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // [7,8,9,11] → "7-9, 11"
  function rentangAyat(arr) {
    const a = arr.slice().sort((x, y) => x - y);
    const bagian = [];
    let mulai = a[0], akhir = a[0];
    for (let i = 1; i < a.length; i++) {
      if (a[i] === akhir + 1) { akhir = a[i]; continue; }
      bagian.push(mulai === akhir ? String(mulai) : mulai + '-' + akhir);
      mulai = akhir = a[i];
    }
    if (typeof mulai === 'number') bagian.push(mulai === akhir ? String(mulai) : mulai + '-' + akhir);
    return bagian.join(', ');
  }

  // "Yoh 4:7-11" (singkat) / "Yohanes 4:7-11" (panjang)
  function labelPilihan(pakaiPanjang) {
    const m = mesin();
    if (!m || !m.siap()) return '';
    const k = m.daftarKitab().find(x => x.no === posisi.kitab);
    if (!k || !pilih.length) return '';
    const nm = pakaiPanjang ? k.nama : k.singkatan;
    return nm + ' ' + posisi.pasal + ':' + rentangAyat(pilih);
  }

  // klik angka ayat → pilih / lepas
  function pilihAyat(no) {
    const i = pilih.indexOf(no);
    if (i >= 0) pilih.splice(i, 1);
    else pilih.push(no);
    pilih.sort((a, b) => a - b);
    segarkanPilihan();
  }

  function tutupBarKirim() {
    const bar = elKirim();
    if (bar) bar.hidden = true;
  }

  // segarkan tanda di bacaan + isi bar kirim
  function segarkanPilihan() {
    const isi = elIsi();
    if (isi) {
      isi.querySelectorAll('.ayat-baca').forEach(d => {
        const tNo = d.querySelector('.no');
        if (!tNo) return;
        const dipilih = pilih.indexOf(Number(tNo.textContent)) >= 0;
        tNo.classList.toggle('pilih', dipilih);
        d.classList.toggle('ikut-pilih', dipilih);
      });
    }
    // tidak ada yang dipilih → bar kirim menutup sendiri
    if (!pilih.length) { tutupBarKirim(); kabariPilihanBerubah(); return; }

    const bAyat = document.getElementById('bk-ayat');
    const bKal  = document.getElementById('bk-kalimat');
    const bFmt  = document.getElementById('bk-ayat-format');
    // chip pilihan selalu bentuk SINGKAT (hemat tempat) — bentuk yang akan
    // dipakai terlihat pada tombol 📖 di sebelahnya.
    if (bAyat) bAyat.textContent = labelPilihan(false);
    if (bKal)  bKal.classList.toggle('hidup', opsiPaket.kalimat);
    if (bFmt) {
      bFmt.textContent = labelPilihan(opsiPaket.panjang);
      bFmt.title = 'Bentuk nama ayat yang akan dikirim: ' +
        (opsiPaket.panjang ? 'panjang — klik untuk jadi singkat' : 'singkat — klik untuk jadi panjang');
    }
    const bar = elKirim();
    if (bar) bar.hidden = false;
    kabariPilihanBerubah();     // K37 — beri tahu plugin lain (mode grup)
  }

  // K37 — beri tahu plugin lain (mis. 🔗 Ayat Terkait) bahwa daftar ayat
  // terpilih berubah, supaya tombolnya bisa menyesuaikan diri (mode grup).
  function kabariPilihanBerubah() {
    const isi = elIsi();
    if (!isi || typeof CustomEvent !== 'function') return;
    try {
      isi.dispatchEvent(new CustomEvent('anodes-pilih-berubah',
        { bubbles: true, detail: { jumlah: pilih.length } }));
    } catch (e) {}
  }

  function batalPilih() {
    pilih = [];
    segarkanPilihan();
  }

  // susun isi paket: nama ayat, dan kalimat tiap ayat kalau dihidupkan
  //   ⚠️ Bentuknya TEKS BIASA dengan pemisah baris (\n), BUKAN HTML.
  //   Alasan (sudah diuji di browser): `execCommand('insertHTML')` SELALU
  //   memecah pembungkus (<p>/<div>/<span>) supaya struktur dokumen sah —
  //   jadi mengirim HTML malah menghasilkan paragraf terbelah.
  //   Teks biasa → jadi paragraf normal (seperti mengetik), bisa dibatalkan
  //   dengan Ctrl+Z bawaan, dan nama ayatnya otomatis dikenali jadi tautan.
  function susunPaket() {
    const m = mesin();
    if (!m || !pilih.length) return null;
    // ⚠️ Bentuk yang DIPILIH user (panjang/singkat) harus benar-benar ikut
    //    ke hasil — bukan selalu panjang (perbaikan 14 Sep 2026).
    const namaAyat = labelPilihan(opsiPaket.panjang);
    const baris = [namaAyat];
    if (opsiPaket.kalimat) {
      const ref = { no: posisi.kitab, pasal: posisi.pasal,
                    ayat1: Math.min.apply(null, pilih),
                    ayat2: Math.max.apply(null, pilih) };
      const arr = m.ayatDariRef(ref) || [];
      arr.forEach(a => {
        const t = String(a.teks || '').replace(/\s+/g, ' ').trim();
        // nomor ayat ikut ditampilkan (permintaan user 14 Sep 2026), mis.
        //   "3 Kasih karunia dan damai sejahtera dari Allah, …"
        // supaya jelas ayat mana yang sedang dibaca. Nomor ini juga yang
        // membuat teks tetap terbaca rapi kalau barisnya menyatu.
        if (t) baris.push(a.no + ' ' + t);
      });
    }
    return { teks: baris.join('\n'), nama: namaAyat };
  }

  // [📋 Simpan] → serahkan paket ke catatan; bar kirim TUTUP (selesai tugas)
  function simpanPaket() {
    const p = susunPaket();
    if (!p) { pesanKecil('👆 Klik angka ayat dulu (di kiri tiap ayat)'); return false; }
    if (!window.ANodesEditor || !window.ANodesEditor.terimaPaket) {
      pesanKecil('⚠️ Catatan belum siap menerima paket');
      return false;
    }
    const diterima = window.ANodesEditor.terimaPaket({ teks: p.teks, nama: p.nama });
    if (diterima) {
      batalPilih();          // sekaligus menutup bar kirim
      pindahKeCatatan();
      pesanKecil('📋 Paket ' + p.nama + ' siap — klik di catatan, lalu [Tempel ⇩]');
    }
    return diterima;
  }

  // tombol 📤 di navbar (kalau user lebih suka lewat tombol)
  function kirimAyatDariSini() {
    if (!pilih.length) {
      pesanKecil('👆 Klik angka ayat dulu, lalu tekan 📋 Simpan');
      return;
    }
    simpanPaket();
  }

  // pastikan halaman catatan yang tampil (dipakai saat kirim & saat kembali)
  function pindahKeCatatan() {
    const b = bacaHal(), u = utamaHal();
    if (b) b.hidden = true;
    if (u) u.hidden = false;
  }

  // ------------------------------------------------------------
  // pilihan kitab & pasal (di toolbar)
  // ------------------------------------------------------------
  function isiPilihanKitab() {
    const m = mesin();
    const sel = elKitab();
    if (!sel || !m || !m.siap()) return;
    const lama = sel.value;
    sel.innerHTML = '';
    m.daftarKitab().forEach(k => {
      const o = document.createElement('option');
      o.value = String(k.no);
      o.textContent = k.nama;
      sel.appendChild(o);
    });
    sel.value = lama || '1';
  }

  function isiPilihanPasal(noKitab, noPasal) {
    const m = mesin();
    const sel = elPasal();
    if (!sel || !m) return;
    // Nama pilihan cukup ANGKAnya saja — supaya daftar tetap terbaca walau
    // toolbar baca harus muat 1 baris di HP. (Penjelasan lewat tooltip.)
    // K63: tooltip diberi nama kitab supaya jelas pasal kitab mana. (tanpa ubah isi)
    const kitab = m.daftarKitab().find(k => k.no === noKitab);
    sel.title = (kitab ? kitab.nama + ' — ' : '') + 'pilih pasal';
    const jumlah = m.jumlahPasal(noKitab);
    sel.innerHTML = '';
    for (let p = 1; p <= jumlah; p++) {
      const o = document.createElement('option');
      o.value = String(p);
      o.textContent = String(p);
      sel.appendChild(o);
    }
    sel.value = String(noPasal || 1);
  }

  // K63 — catat pasal yang sedang tampil lalu isi baris 2 navbar
  function isiKepalaPasal(nama, noPasal, jumlahAyat) {
    pasalTampil = { nama: nama || '—', noPasal: noPasal || 1, jumlahAyat: jumlahAyat || 0 };
    segarkanBaris2();
  }

  // K63 — kosongkan baris 2 navbar (dipakai saat hasil PENCARIAN)
  function kosongkanBaris2() {
    pasalTampil = null;
    segarkanBaris2();
  }

  // ------------------------------------------------------------
  // TAMPILKAN PASAL — gaya BUKU (meniru lab3)
  //   judul kitab+pasal · "n ayat" · ayat satu per satu
  //   nomor di kiri · perkataan Yesus merah · ayat tujuan disorot
  // ------------------------------------------------------------
  function gambarPasal(noKitab, noPasal, ayatTarget, tanpaRiwayat, sorotRentang) {
    const m = mesin();
    if (!m || !m.siap || !m.siap()) return;
    const p = m.ambilPasal(noKitab, noPasal);
    if (!p) return;

    // K80 — perpindahan BIASA membuang ingatan bacaan asal (lihat komentar
    //   `asalBacaan`). Pemanggil yang menyetelnya sendiri memasang penjaga.
    // K91a — `asalCari` ikut dibuang: perpindahan biasa berarti user sudah
    //   meninggalkan alur pencarian.
    if (!pertahankanAsalBacaan) { asalBacaan = null; asalCari = null; }
    pertahankanAsalBacaan = false;

    // catat posisi sebelumnya (untuk tombol ↩)
    if (!tanpaRiwayat && (posisi.kitab !== noKitab || posisi.pasal !== noPasal)) {
      riwayat.push({ kitab: posisi.kitab, pasal: posisi.pasal, ayat: posisi.ayat });
      if (riwayat.length > 30) riwayat.shift();
    }
    posisi = { kitab: noKitab, pasal: noPasal, ayat: ayatTarget || 0 };
    // K34: rentang hanya berlaku untuk pasal yang sedang dibuka. Kalau user
    // pindah pasal/kitab, rentang lama dibuang (baris pemilih ikut hilang).
    if (rentangBuka && (rentangBuka.kitab !== noKitab || rentangBuka.pasal !== noPasal)) {
      rentangBuka = null;
    }
    simpanBacaan();          // K22 a: ingat bacaan terakhir
    segarkanTombol();
    segarkanTombolKembali(); // K80 — label/title 🏠 mengikuti keadaan

    const kitab = m.daftarKitab().find(k => k.no === noKitab);
    const namaKitab = kitab ? kitab.nama : p.nama;

    const isi = elIsi();
    if (!isi) return;
    isi.innerHTML = '';

    // kepala buku
    const judul = document.createElement('div');
    judul.className = 'ay-judul';
    judul.textContent = namaKitab + ' ' + noPasal;
    isi.appendChild(judul);

    const meta = document.createElement('div');
    meta.className = 'ay-meta';
    meta.textContent = p.ayat.length + ' ayat';
    // K63 (23 Sep 2026) — baris 2 navbar SEKALIGUS jadi JUDUL pasal
    //   (nama kitab + “n ayat”). Karena itu penanda judul di DALAM bacaan
    //   disembunyikan.
    //   ⚠️ Elemennya TETAP ADA (`display:none`) karena dipakai sebagai JANGKAR
    //      oleh plugin 📖 Sejarah & 🌿 Ayat Terkait.
    judul.classList.add('ay-judul-samar');
    meta.classList.add('ay-meta-samar');
    isi.appendChild(meta);
    // K63 — tulis judul pasal di baris 2 navbar (nama kitab + “n ayat”)
    isiKepalaPasal(namaKitab, noPasal, p.ayat.length);
    // ℹ️ K55b (22 Sep 2026): tombol 📖 sejarah TIDAK lagi dipasang di sini.
    //    Fitur itu kini **plugin sendiri** (plugin/sejarah/) dan menempel
    //    lewat sambungan resmi `tambahPenghias()` — lihat plugin/sejarah/tampilan.js.
    // K55d — bar pintasan di atas pasal (di bawah “n ayat”): isinya dari
    //    plugin yang mendaftar lewat daftarPintasan() (urutan 10 = sejarah).
    pasangBarPintasan(isi, noKitab, noPasal);

    // K80 — rentang yang diminta [Full] (mis. Bilangan 6:24-26)
    const sr = (sorotRentang && sorotRentang.awal)
      ? { awal: Number(sorotRentang.awal), akhir: Number(sorotRentang.akhir || sorotRentang.awal) }
      : null;

    // ayat-ayat
    p.ayat.forEach(a => {
      const d = document.createElement('div');
      const dalamSorot = sr && a.no >= sr.awal && a.no <= sr.akhir;
      d.className = 'ayat-baca' +
        (ayatTarget && a.no === ayatTarget ? ' target' : '') +
        (dalamSorot ? ' target-rentang' : '');
      d.id = 'ay-' + a.no;
      // nomor ayat di wadahnya — dipakai plugin lain (mis. 🔗 Ayat Terkait)
      // supaya tahu baris ini ayat nomor berapa tanpa menebak dari tulisan.
      d.dataset.ayat = String(a.no);

      const no = document.createElement('span');
      no.className = 'no';
      no.textContent = a.no;
      no.dataset.ayat = String(a.no);
      no.title = 'Klik untuk mengirim ayat ' + a.no + ' ke catatan';
      d.appendChild(no);

      const teks = document.createElement('span');
      if (a.merah) teks.className = 'merah';   // perkataan Yesus
      teks.textContent = a.teks;
      d.appendChild(teks);

      isi.appendChild(d);
    });

    // pilihan ayat lama dibuang saat pindah pasal (biar tidak salah kirim)
    pilih = [];
    segarkanPilihan();

    // samakan pilihan di toolbar
    const selKitab = elKitab();
    if (selKitab) selKitab.value = String(noKitab);
    isiPilihanPasal(noKitab, noPasal);

    // beri kesempatan plugin lain menambahkan sesuatu di bawah ayat-ayat
    // (mis. plugin 🔗 Ayat Terkait menaruh chip kaitan di sini).
    // Dilakukan SEBELUM menggulir supaya tinggi halaman sudah final.
    jalankanPenghias({ kitab: noKitab, pasal: noPasal, isi, rentang: rentangBuka });

    // gulir ke ayat yang dituju
    if (sr) {
      // K80 — gulir ke ayat PERTAMA rentang, lalu kedipkan seluruh rentang
      const sasaran = document.getElementById('ay-' + sr.awal);
      if (sasaran) setTimeout(() => sasaran.scrollIntoView({ block: 'center' }), 30);
      mulaiKedipRentang(sr);
    } else if (ayatTarget) {
      const sasaran = document.getElementById('ay-' + ayatTarget);
      if (sasaran) setTimeout(() => sasaran.scrollIntoView({ block: 'center' }), 30);
    } else {
      isi.scrollTop = 0;
    }
  }

  // ------------------------------------------------------------
  // K80 · KEDIP RENTANG AYAT (5 detik) — supaya user tahu posisi ayat
  //   Bapak: *“di buat stabilo sistem blinking beberapa detik supaya user
  //   tau posisi ayat”* ⇒ 5 detik (pilihan Bapak), lalu jadi sorot TETAP
  //   (tidak hilang) supaya posisi tetap terlihat selama membaca.
  //   ⚠️ “kurangi gerak” (prefers-reduced-motion) ⇒ tanpa kedip, langsung tetap.
  // ------------------------------------------------------------
  const KEDIP_MS = 5000;

  function mulaiKedipRentang(sr) {
    clearTimeout(timerKedip);
    const isi = elIsi();
    if (!isi || !sr) return;
    const baris = [...isi.querySelectorAll('.ayat-baca.target-rentang')];
    if (!baris.length) return;

    const kurangiGerak = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (kurangiGerak) {
      baris.forEach(b => b.classList.add('target-rentang-tetap'));
      return;
    }

    baris.forEach(b => b.classList.add('target-rentang-kedip'));
    timerKedip = setTimeout(() => {
      baris.forEach(b => {
        b.classList.remove('target-rentang-kedip');
        b.classList.add('target-rentang-tetap');
      });
    }, KEDIP_MS);
  }

  // ------------------------------------------------------------
  // K80 · [Full] — lompat ke Alkitab pada RENTANG ayat, ingat bacaan asal
  //   Dipakai plugin 🌿 Ayat Terkait (tombol [Full] di kepala pratinjau).
  //   ❌ tanpa mesin baru: memakai `gambarPasal()` + `pindahKeBaca()` yang ada.
  // ------------------------------------------------------------
  function bukaRentang(ref) {
    const m = mesin();
    if (!m || !m.siap || !m.siap()) return false;
    if (!ref || !ref.no || !ref.pasal) return false;

    const a1 = Number(ref.ayat1 || 0) || 0;
    const a2 = Number(ref.ayat2 || a1) || a1;

    // ingat bacaan SEBELUM lompat (hanya kalau memang sedang di halaman baca)
    const baca = bacaHal();
    const sedangBaca = baca && !baca.hidden;
    asalBacaan = sedangBaca
      ? { kitab: posisi.kitab, pasal: posisi.pasal, ayat: posisi.ayat }
      : null;

    // ingat tempat di catatan (untuk 🏠 tahap kedua)
    if (window.ANodesEditor && window.ANodesEditor.ingatPosisi) {
      try { window.ANodesEditor.ingatPosisi(); } catch (e) {}
    }
    // Alkitab tidak lagi “dipinjamkan” ke kamus / halaman lain
    if (window.ANodesKamusTampilan && window.ANodesKamusTampilan.dariKamus &&
        window.ANodesKamusTampilan.dariKamus()) {
      try { window.ANodesKamusTampilan.pulihDariAlkitab(); } catch (e) {}
    }

    riwayat = [];
    rentangBuka = (a1 && a2 > a1)
      ? { kitab: Number(ref.no), pasal: Number(ref.pasal), awal: a1, akhir: a2 }
      : null;

    pertahankanAsalBacaan = true;   // jangan dibuang oleh gambarPasal()
    gambarPasal(Number(ref.no), Number(ref.pasal), a1 || 0, true,
      a1 ? { awal: a1, akhir: a2 } : null);
    pindahKeBaca();
    segarkanTombolKembali();
    return true;
  }

  // apakah sedang ada bacaan asal yang bisa dituju 🏠?
  function adaAsalBacaan() { return !!asalBacaan; }

  // K91a — apakah 🏠 akan kembali ke bacaan SEBELUM mencari?
  function adaAsalCari() { return !!asalCari; }

  // K91a — dipakai `kembali()`: kembali ke bacaan sebelum mencari.
  function kembaliKeAsalCari() {
    const a = asalCari;
    asalCari = null;
    if (!a) return false;
    gambarPasal(a.kitab, a.pasal, a.ayat || 0, true);
    return true;
  }

  // dipanggil `kembali()` — balik ke bacaan SEBELUM [Full]
  function kembaliKeAsalBacaan() {
    const a = asalBacaan;
    asalBacaan = null;
    if (!a) return false;
    gambarPasal(a.kitab, a.pasal, a.ayat || 0, true);
    return true;
  }

  // K80 — label + judul tombol 🏠 mengikuti keadaan
  function segarkanTombolKembali() {
    const b = document.getElementById('baca-kembali');
    if (!b) return;
    // kamus & halaman lain punya prioritas sendiri (K43b / K56)
    const K47 = window.ANodesKamusTampilan;
    if (K47 && typeof K47.dariKamus === 'function' && K47.dariKamus()) return;
    if (adaAsalAyat()) return;
    if (asalBacaan || asalCari) {
      const a = asalBacaan || asalCari;
      const m = mesin();
      const k = m && m.daftarKitab ? m.daftarKitab().find(x => x.no === a.kitab) : null;
      const nama = k ? k.nama : 'bacaan sebelumnya';
      b.textContent = '🏠';
      b.title = 'Kembali ke ' + nama + ' ' + a.pasal +
        ' (tekan 🏠 lagi untuk kembali ke catatan)';
    } else {
      b.textContent = '🏠';
      b.title = 'Kembali ke catatan (di tempat tadi diklik)';
    }
  }

  // nyalakan/matikan tombol ◀ ▶ ↩ sesuai keadaan
  function segarkanTombol() {
    const m = mesin();
    const prev = document.getElementById('baca-prev');
    const next = document.getElementById('baca-next');
    const back = document.getElementById('baca-back');
    if (prev) prev.disabled = !(posisi.pasal > 1);
    if (next) next.disabled = !(m && posisi.pasal < m.jumlahPasal(posisi.kitab));
    if (back) back.disabled = riwayat.length === 0;
  }

  // ------------------------------------------------------------
  // tampilkan daftar ayat (untuk hasil pencarian)
  // ------------------------------------------------------------
  function goIsi(judul, ayatArr) {
    const isi = elIsi();
    if (!isi) return;
    isi.innerHTML = '';
    // K63 — hasil pencarian: nama kitab & “n ayat” di baris 2 NAVBAR dikosongkan
    //   (judul hasil cari hidup di dalam bacaan seperti biasa).
    kosongkanBaris2();

    const h = document.createElement('div');
    h.className = 'ay-judul';
    h.textContent = judul;
    isi.appendChild(h);

    if (!ayatArr || !ayatArr.length) {
      const k = document.createElement('div');
      k.className = 'ay-kosong';
      k.textContent = 'Ayat tidak ditemukan.';
      isi.appendChild(k);
      return;
    }

    ayatArr.forEach(a => {
      const d = document.createElement('div');
      d.className = 'ayat-baca';
      const no = document.createElement('span');
      no.className = 'no';
      no.textContent = a.no;
      d.appendChild(no);
      const teks = document.createElement('span');
      if (a.merah) teks.className = 'merah';
      teks.textContent = a.teks;
      d.appendChild(teks);
      isi.appendChild(d);
    });    // hasil pencarian bukan pasal → pilihan ayat lama dibuang
    pilih = [];
    segarkanPilihan();    isi.scrollTop = 0;
  }

  // ------------------------------------------------------------
  // buka / kembali
  // ------------------------------------------------------------
  function pindahKeBaca() {
    document.getElementById('app-utama').hidden = true;
    document.getElementById('baca-alkitab').hidden = false;
  }

  function bukaAyatDariLink(ref, elemen, index, dariDalamBaca) {
    const m = mesin();
    if (!m) return;
    m.ingatAsal(elemen, index);
    // K20: ingat juga tempat kursor & gulir catatan, supaya 🏠 nanti
    // kembali PERSIS ke tempat yang tadi dipakai menulis.
    if (window.ANodesEditor && window.ANodesEditor.ingatPosisi) {
      try { window.ANodesEditor.ingatPosisi(); } catch (e) {}
    }
    /* 🆕 K84 (30 Okt 2026) — LOMPAT DARI DALAM HALAMAN BACA SENDIRI.
       Wadah tautan bisa berada DI DALAM `#baca-alkitab` (mis. kotak 🖊 K54 di
       `#baca-isi`). Dulu `gambarPasal()` selalu membuang `asalBacaan` ⇒ 🏠
       tidak punya tempat kembali. Terukur: klik “Mazmur 34:10” di kotak penguat
       Mazmur 23 ⇒ 🏠 membuka HALAMAN PENGUAT (salah).
       ⇒ Kalau memang sedang membaca, ingat bacaan itu dulu (pola K80).

       ⚠️ Penanda `dariDalamBaca` WAJIB datang dari pemanggil (bukan ditebak dari
          `baca.hidden`): kalau ditebak, klik dari KOTAK PENGUAT CATATAN ikut
          dianggap “dari halaman baca” (halaman baca memang masih tersembunyi
          tetapi `posisi` masih menyimpan bacaan lama) ⇒ 🏠 melompat ke pasal
          lama, bukan kembali ke catatan. Terukur 30 Okt 2026. */
    const baca = document.getElementById('baca-alkitab');
    if (dariDalamBaca && baca && !baca.hidden && posisi && posisi.kitab) {
      asalBacaan = { kitab: posisi.kitab, pasal: posisi.pasal, ayat: posisi.ayat };
      pertahankanAsalBacaan = true;   // jangan dibuang oleh gambarPasal()
    }
    riwayat = [];
    // K34: kalau tautannya BERENTANG (mis. Roma 8:6-10), rentangnya diteruskan
    // ke halaman baca supaya plugin 🔗 Ayat Terkait bisa menampilkan baris
    // pemilih ayat [6][7][8][9][10] di bawah ayat terakhir.
    rentangBuka = (ref.ayat1 && ref.ayat2 && ref.ayat2 > ref.ayat1)
      ? { kitab: ref.no, pasal: ref.pasal, awal: ref.ayat1, akhir: ref.ayat2 }
      : null;
    gambarPasal(ref.no, ref.pasal, ref.ayat1 || 0, true);
    pindahKeBaca();
  }

  function kembali() {
    // K43 b (18 Sep 2026) — kalau halaman baca ini dibuka dari halaman KAMUS
    // (tombol [full] di samping chip ayat), tombol 🏠 BERUBAH MAKNA menjadi 📚:
    // kembali ke halaman kamus pada istilah yang sama, bukan kembali ke catatan.
    // ⚠️ Kamus yang memutuskan — Alkitab tidak perlu tahu isinya.
    const K47 = window.ANodesKamusTampilan;
    if (K47 && typeof K47.dariKamus === 'function' && K47.dariKamus() &&
        typeof K47.pulihDariAlkitab === 'function') {
      try {
        if (K47.pulihDariAlkitab()) return;
      } catch (e) { console.warn('ANodes: kembali ke kamus gagal', e); }
    }
    // K56 (23 Sep 2026) — dibuka dari HALAMAN LAIN (mis. halaman Sejarah
    // Alkitab): 🏠 kembali KE HALAMAN ITU, bukan ke catatan.
    // ⚠️ Yang memutuskan = halaman pemiliknya (didaftarkan lewat
    //    `daftarPemulihHalaman`), jadi Alkitab tidak perlu tahu isinya.
    if (adaAsalAyat()) {
      try {
        if (kembaliKeHalamanAsalAyat()) return;
      } catch (e) { console.warn('ANodes: kembali ke halaman asal gagal', e); }
    }
    // K80 (30 Okt 2026) — dibuka lewat [Full] dari pratinjau 🌿 Ayat Terkait:
    //   🏠 kembali ke BACAAN SEBELUMNYA dulu (mis. 2 Petrus 1). Tekan 🏠 lagi
    //   baru kembali ke catatan. (Pilihan Bapak: “kembali pada bacaan sebelumnya”.)
    if (adaAsalBacaan()) {
      try {
        if (kembaliKeAsalBacaan()) { segarkanTombolKembali(); return; }
      } catch (e) { console.warn('ANodes: kembali ke bacaan asal gagal', e); }
    }
    // K91a (2 Nov 2026) — dibuka lewat 🔍 Cari dari sebuah pasal:
    //   🏠 kembali ke BACAAN SEBELUM mencari (mis. Keluaran 1:1).
    //   Tekan 🏠 lagi baru kembali ke catatan.
    if (adaAsalCari()) {
      try {
        if (kembaliKeAsalCari()) { segarkanTombolKembali(); return; }
      } catch (e) { console.warn('ANodes: kembali ke bacaan sebelum cari gagal', e); }
    }
    const b = bacaHal(), u = utamaHal();
    if (b) b.hidden = true;
    if (u) u.hidden = false;
    // K20: pulihkan tempat menulis dulu (kursor & gulir), baru sorot tautan
    if (window.ANodesEditor && window.ANodesEditor.pulihPosisi) {
      try { window.ANodesEditor.pulihPosisi(); } catch (e) {}
    }
    const m = mesin();
    if (m) m.kembaliKeCatatan();
  }

  // ↩ = kembalikan pasal yang dibuka sebelumnya
  function kembaliPosisi() {
    if (!riwayat.length) return;
    const sebelum = riwayat.pop();
    gambarPasal(sebelum.kitab, sebelum.pasal, sebelum.ayat, true);
  }

  // ------------------------------------------------------------
  // 📋 PILIH — grid kitab → pasal → ayat (meniru lab3)
  // ------------------------------------------------------------
  // pastikan data siap dulu; kalau belum, tunggu sebentar lalu jalankan lagi.
  //   (kalau data belum siap dan kita diam saja, user merasa tombol "tidak jalan")
  function saatSiap(fungsi) {
    const m = mesin();
    if (m && m.siap()) { fungsi(); return; }
    if (!m) { pesanKecil('💡 Pasang plugin 📖 Alkitab dahulu'); return; }
    pesanKecil('⏳ Menyiapkan data Alkitab…');
    if (m.muat) {
      m.muat()
        .then(() => { if (m.siap()) fungsi(); else pesanKecil('⚠️ Data Alkitab belum siap'); })
        .catch(() => pesanKecil('⚠️ Data Alkitab gagal dimuat'));
    }
  }

  function pesanKecil(t) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = t;
    el.classList.add('tampil');
    clearTimeout(el._tA);
    el._tA = setTimeout(() => el.classList.remove('tampil'), 2200);
  }

  function bukaPilih() {
    saatSiap(bukaPilihSekarang);
  }

  function bukaPilihSekarang() {
    let ov = document.getElementById('ab-pk-overlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'ab-pk-overlay';
      ov.className = 'ab-pk-overlay';
      ov.innerHTML =
        '<div class="ab-pk-panel">' +
          '<div class="ab-pk-head"><b>Pilih Kitab</b>' +
          '<button id="ab-pk-tutup" title="Tutup">×</button></div>' +
          '<div id="ab-pk-grid" class="ab-pk-grid"></div>' +
          '<div id="ab-pk-langkah" class="ab-pk-langkah"></div>' +
        '</div>';
      document.body.appendChild(ov);
      ov.addEventListener('click', (e) => { if (e.target === ov) tutupPilih(); });
      ov.querySelector('#ab-pk-tutup').addEventListener('click', tutupPilih);
    }
    ov.classList.add('show');
    muatGridKitab();
  }

  function tutupPilih() {
    const ov = document.getElementById('ab-pk-overlay');
    if (ov) ov.classList.remove('show');
  }

  function muatGridKitab() {
    const grid = document.getElementById('ab-pk-grid');
    const langkah = document.getElementById('ab-pk-langkah');
    if (!grid) return;
    langkah.textContent = '';
    grid.className = 'ab-pk-grid';
    grid.innerHTML = '';

    mesin().daftarKitab().forEach(k => {
      const b = document.createElement('button');
      b.className = 'ab-pk-kitab' + (k.no >= 40 ? ' pb' : '');
      b.textContent = k.singkatan;
      b.title = k.nama;
      b.addEventListener('click', () => pilihPasalnya(k.no));
      grid.appendChild(b);
    });
  }

  function pilihPasalnya(noKitab) {
    const m = mesin();
    const k = m.daftarKitab().find(x => x.no === noKitab);
    const grid = document.getElementById('ab-pk-grid');
    const langkah = document.getElementById('ab-pk-langkah');
    if (!grid) return;
    grid.className = 'ab-pk-grid ab-pk-grid-angka';
    grid.innerHTML = '';

    const kembali = document.createElement('button');
    kembali.className = 'ab-pk-kembali';
    kembali.textContent = '← kitab';
    kembali.addEventListener('click', muatGridKitab);
    grid.appendChild(kembali);

    for (let p = 1; p <= m.jumlahPasal(noKitab); p++) {
      const b = document.createElement('button');
      b.className = 'ab-pk-angka';
      b.textContent = p;
      b.dataset.p = p;
      b.addEventListener('click', () => pilihAyatnya(noKitab, p));
      grid.appendChild(b);
    }
    langkah.innerHTML = '<b>' + k.nama + '</b> — pilih pasal';
  }

  function pilihAyatnya(noKitab, noPasal) {
    const m = mesin();
    const k = m.daftarKitab().find(x => x.no === noKitab);
    const p = m.ambilPasal(noKitab, noPasal);
    const grid = document.getElementById('ab-pk-grid');
    const langkah = document.getElementById('ab-pk-langkah');
    if (!grid || !p) return;
    grid.className = 'ab-pk-grid ab-pk-grid-angka';
    grid.innerHTML = '';

    const kembali = document.createElement('button');
    kembali.className = 'ab-pk-kembali';
    kembali.textContent = '← pasal';
    kembali.addEventListener('click', () => pilihPasalnya(noKitab));
    grid.appendChild(kembali);

    p.ayat.forEach(a => {
      const b = document.createElement('button');
      b.className = 'ab-pk-angka';
      b.textContent = a.no;
      b.dataset.v = a.no;
      b.addEventListener('click', () => {
        tutupPilih();
        gambarPasal(noKitab, noPasal, a.no);
        pindahKeBaca();
      });
      grid.appendChild(b);
    });
    langkah.innerHTML = '<b>' + k.nama + ' ' + noPasal + '</b> — pilih ayat';
  }

  // ------------------------------------------------------------
  // ⌨🔍 CARI — SATU PINTU (dulu: ⌨ KETIK)
  //   Satu kotak serba bisa:
  //     • nama ayat        -> “📖 Buka …”
  //     • kata / kutipan   -> “🔍 Cari ayat yang memuat …”
  //   (perbaikan tampilan: fungsi KETIK + kotak Cari DISATUKAN)
  // ------------------------------------------------------------
  // ------------------------------------------------------------
  // K23 · 🔍 Cari = SATU LANGKAH (langsung ke halaman pencarian)
  //   ❌ Popup “form cari” DIBUANG. Dulu alurnya 2 langkah:
  //        klik 🔍 Cari → popup → ketik kata → TEKAN TOMBOL → halaman hasil
  //      dan baru di halaman hasil itu ada kotak cari + [Semua][PL][PB]
  //      → user merasa “cari 2×”.
  //   ✅ Sekarang: klik 🔍 Cari → LANGSUNG halaman pencarian
  //      (satu kotak + tombol [Semua][PL][PB]) → ketik → Enter / tekan 🔍 Cari
  //      → hasil muncul di halaman yang SAMA.
  //   Halaman ini juga pintu untuk nama ayat (muncul tawaran “📖 Buka …”).
  // ------------------------------------------------------------
  function bukaKetik() {
    saatSiap(bukaHalamanCari);
  }

  function bukaHalamanCari() {
    // K91a — ingat bacaan SEBELUM mencari (hanya kalau memang sedang membaca
    //   sebuah pasal, bukan saat halaman cari sudah tampil).
    const baca = bacaHal();
    const sedangBaca = baca && !baca.hidden && pasalTampil && posisi && posisi.kitab;
    if (sedangBaca) {
      asalCari = { kitab: posisi.kitab, pasal: posisi.pasal, ayat: posisi.ayat || 0 };
    }
    pindahKeBaca();
    // kalau halaman pencarian sudah tampil → cukup arahkan ke kotaknya
    if (elIsi() && elIsi().querySelector('.ay-cari-input')) {
      // K91c — halaman cari yang masih KOSONG digambar ulang supaya
      //   🕘 riwayat cari yang baru bertambah langsung terlihat.
      if (!cariBerjalan.kata) gambarHasilCari();
      fokusKotakCari();
      return;
    }
    // halaman baru: cariBerjalan kosong → gambar halaman + kotak cari
    cariBerjalan = { kata: '', wilayah: cariBerjalan.wilayah || 'semua' };
    gambarHasilCari();
    fokusKotakCari();
  }

  // sorot + fokuskan kotak cari di halaman pencarian
  function fokusKotakCari() {
    const isi = elIsi();
    if (!isi) return false;
    const inp = isi.querySelector('.ay-cari-input');
    if (!inp) return false;
    pindahKeBaca();
    try {
      inp.scrollIntoView({ block: 'center' });
      inp.focus();
      inp.select();
    } catch (e) {}
    return true;
  }

  // popup lama — sengaja TIDAK dipakai lagi (K23). Dibuat sebagai penutup
  // supaya pemanggil lama (Esc / tombol ×) tetap aman.
  function tutupKetik() {
    const ov = document.getElementById('ab-ketik-overlay');
    if (ov) ov.classList.remove('show');
  }

  // saran kecil: kalau yang ditulis seperti NAMA AYAT, tawarkan membukanya
  //   (bagian dari satu kotak serba bisa — nama ayat ATAU kata)
  function gambarSaran(kata) {
    const wadah = document.getElementById('ay-cari-saran');
    if (!wadah) return;
    wadah.innerHTML = '';
    const t = String(kata || '').trim();
    if (t.length < 3) return;
    const m = mesin();
    if (!m || !m.kenaliAyat) return;
    const ref = m.kenaliAyat(t);
    if (!ref) return;
    const b = document.createElement('button');
    b.className = 'ay-cari-buka';
    b.textContent = '📖 Buka ' + m.label(ref);
    b.title = 'Yang ditulis seperti nama ayat — klik untuk membukanya';
    b.addEventListener('click', () => {
      gambarPasal(ref.no, ref.pasal, ref.ayat1 || 0);
      pindahKeBaca();
    });
    wadah.appendChild(b);
  }

  // ⚠️ K23: popup lama TIDAK dipakai lagi.
  //    Fungsi ini hanya disimpan sebagai pengaman supaya pemanggil lama
  //    (Esc, tombol ×, uji lama) tidak error. Alur cari sekarang satu langkah
  //    (lihat bukaHalamanCari + gambarHasilCari).
  function bukaKetikSekarang() { bukaHalamanCari(); }

  function tutupKetik() {
    const ov = document.getElementById('ab-ketik-overlay');
    if (ov) ov.classList.remove('show');
  }

  // popup lama memang tidak dibuat lagi — fungsi ini hanya sisa yang tidak dipakai
  function periksaKetik() { /* tidak dipakai lagi (K23) */ }

  // ------------------------------------------------------------
  // CARI lewat kata / kutipan (cara 3)  — K21 b · c · d · e
  //   b. kata yang dicari DIBERI TEBAL di dalam kalimat hasil
  //   d. bisa disaring Perjanjian Lama (PL) / Perjanjian Baru (PB) / keduanya
  //   e. pencocokan dibuat "akrab" — buang awalan & akhiran Indonesia,
  //      supaya "penebusan" juga menemukan "tebus" (dan sebaliknya)
  //   Jumlah kitab PL = 39 → kitab nomor 40–66 adalah Perjanjian Baru.
  // ------------------------------------------------------------
  const KITAB_PB_MULAI = 40;

  // akhiran & awalan yang biasa dipakai bahasa Indonesia.
  // ⚠️ Hanya dipakai untuk MENCOCOKKAN (bukan mengubah tampilan hasil).
  const AKHIRAN = ['kannya', 'annya', 'inya', 'kan', 'nya', 'lah', 'an', 'i'];
  const AWALAN  = ['memper', 'diper', 'menge', 'meng', 'meny', 'men', 'mem',
                   'per', 'ber', 'ter', 'pen', 'pem', 'peng', 'peny',
                   'me', 'di', 'ke', 'pe', 'se'];

  // Bahasa Indonesia melebur huruf pertama kata dasar setelah awalan:
  //   pe- + tebus → "penebus" (t → n) · me- + suci → "menyucikan" (s → ny)
  // Jadi setelah awalan dibuang, huruf sengau di depan dikembalikan
  // supaya ketemu kata dasarnya.
  function kembalikanSengau(sisa) {
    if (/^ny/.test(sisa) && sisa.length >= 4) return 's' + sisa.slice(2);
    if (/^ng/.test(sisa) && sisa.length >= 4) return 'k' + sisa.slice(2);
    if (/^n/.test(sisa)  && sisa.length >= 4) return 't' + sisa.slice(1);
    if (/^m/.test(sisa)  && sisa.length >= 4) return 'p' + sisa.slice(1);
    return sisa;
  }

  // Kumpulkan SEMUA kemungkinan kata dasar dari sebuah kata.
  //   ⚠️ Cara ini dipilih (bukan satu rantai awalan→akhiran berurutan) karena
  //   aturan bahasanya BERCABANG: "penebusan" bisa dibaca pe-+nebus+an
  //   ataupun pen-+ebus+an. Dulu dipakai rantai berurutan → hasilnya "ebus"
  //   (salah). Dengan mengumpulkan semua kemungkinan lalu mencocokkan semuanya,
  //   "penebusan" tetap bisa menemukan "tebus".
  //   Contoh: penebusan → [nebus, tebus, ebus, tebusan, …]
  function kandidatKata(w) {
    const keluar = [];
    const tambah = (s) => { if (s && s.length >= 4 && s !== w && keluar.indexOf(s) < 0) keluar.push(s); };

    for (const p of AWALAN) {
      if (!w.startsWith(p) || w.length - p.length < 4) continue;
      const s1 = w.slice(p.length);
      [s1, kembalikanSengau(s1)].forEach(s2 => {
        tambah(s2);
        for (const a of AKHIRAN) {
          if (s2.length - a.length >= 4 && s2.endsWith(a)) tambah(s2.slice(0, -a.length));
        }
      });
    }
    // tanpa awalan: hanya buang akhiran
    for (const a of AKHIRAN) {
      if (w.length - a.length >= 4 && w.endsWith(a)) tambah(w.slice(0, -a.length));
    }
    return keluar;
  }

  // susun daftar bentuk kata yang dianggap cocok dengan kata yang dicari.
  //   Bentuk pertama SELALU kata aslinya (supaya "tebus" tetap ketemu "tebus").
  function bentukCari(w) {
    return [w].concat(kandidatKata(w));
  }

  // satu ayat cocok? setiap kata yang dicari harus ditemukan
  // (persis, atau sama-sama berasal dari kata dasar yang sama)
  function ayatCocok(teksKecil, cariArr) {
    return cariArr.every(c => {
      if (teksKecil.indexOf(c.kata) >= 0) return true;
      return c.bentuk.some(b => b.length >= 4 && teksKecil.indexOf(b) >= 0);
    });
  }

  // sisipkan <b> pada bagian kalimat yang memuat kata yang dicari
  function tebalKata(teks, cariArr) {
    if (!teks) return document.createTextNode('');
    const kecil = teks.toLowerCase();

    // kumpulkan semua rentang yang harus ditebalkan
    const rentang = [];
    cariArr.forEach(c => {
      c.bentuk.forEach(b => {
        // hanya bentuk yang cukup panjang ditebalkan, supaya potongan
        // pendek (mis. "kas" dari "kasih") tidak menebalkan sebagian kata
        if (b.length < 4) return;
        let mulai = 0;
        while (mulai <= kecil.length - b.length) {
          const i = kecil.indexOf(b, mulai);
          if (i < 0) break;
          rentang.push([i, i + b.length]);
          mulai = i + 1;
        }
      });
    });
    if (!rentang.length) return document.createTextNode(teks);

    // gabung rentang yang bertumpuk / bersambung
    rentang.sort((x, y) => x[0] - y[0] || y[1] - x[1]);
    const gabung = [];
    rentang.forEach(r => {
      const terakhir = gabung[gabung.length - 1];
      if (terakhir && r[0] <= terakhir[1]) terakhir[1] = Math.max(terakhir[1], r[1]);
      else gabung.push([r[0], r[1]]);
    });

    const frag = document.createDocumentFragment();
    let pos = 0;
    gabung.forEach(([a, b]) => {
      if (a > pos) frag.appendChild(document.createTextNode(teks.slice(pos, a)));
      const b2 = document.createElement('b');
      b2.className = 'ay-cari-tebal';
      b2.textContent = teks.slice(a, b);
      frag.appendChild(b2);
      pos = b;
    });
    if (pos < teks.length) frag.appendChild(document.createTextNode(teks.slice(pos)));
    return frag;
  }

  // --- ayunan pilihan PL / PB / keduanya di halaman hasil ---
  let cariBerjalan = { kata: '', wilayah: 'semua' };

  function pindahWilayah(w) {
    cariBerjalan.wilayah = w;
    gambarHasilCari();
  }

  // gambar ulang halaman pencarian menurut kata & wilayah yang tersimpan
  //   K23: halaman ini juga menjadi HALAMAN AWAL pencarian (kata boleh kosong)
  //   supaya user cukup: klik 🔍 Cari → ketik → Enter (satu langkah).
  // ------------------------------------------------------------
  // K91b (2 Nov 2026) — 🔎 SARAN KATA MIRIP
  //   Bapak: *“cari misal "onesimus" sekarang harus persis sama .. jika beda
  //   omesimus sudah tidak ditemukan mungkin user bermaksud onesimus tapi
  //   lafal salah misal omesimus.. apa sistem bisa cari beberapa alternatif
  //   dengan kata mirip seperti list user tinggal cari yg dimaksud”*
  //
  //   🔎 DIUKUR DULU (2 Nov 2026): kosakata unik TB = 16.896 kata (≥4 huruf) ·
  //   bangun indeks 226 ms (sekali, malas) · satu pencarian mirip 3–30 ms.
  //   Ambang TERUKUR: panjang ≥7 ⇒ jarak 2 · <7 ⇒ jarak 1
  //   (omesimus→onesimus 1 · oneismus→onesimus 1 · allha→allah 1 ·
  //    anugrah→anugerah 1 · yerusalm→yerusalem 1 · syalom→0 padanan).
  //   ⚠️ Jarak 2 untuk kata PENDEK menghasilkan sampah (terukur: `kasi` ⇒ 138
  //      kata) ⇒ aturan tersempit: kata <7 huruf hanya boleh jarak 1.
  // ------------------------------------------------------------
  let kosakata = null;   // Map(kata → {pl, pb})

  function bangunKosakata() {
    if (kosakata) return kosakata;
    const m = mesin();
    if (!m || !m.data) return null;
    const peta = new Map();
    m.data.kitab.forEach((k, ki) => {
      const pb = (ki + 1) >= KITAB_PB_MULAI;
      (k.pasal || []).forEach(p => (p.ayat || []).forEach(a => {
        const kata = String(a.teks || '').toLowerCase().match(/[a-z\u00c0-\u024f]+/g) || [];
        kata.forEach(w => {
          let e = peta.get(w);
          if (!e) { e = { pl: 0, pb: 0 }; peta.set(w, e); }
          if (pb) e.pb++; else e.pl++;
        });
      }));
    });
    kosakata = peta;
    return peta;
  }

  // Damerau-Levenshtein — menukar 2 huruf bersebelahan dihitung 1 langkah.
  //   Penting untuk salah lafal seperti "oneismus" (s & u tertukar).
  function jarakKata(a, b, maks) {
    const m1 = a.length, n1 = b.length;
    if (Math.abs(m1 - n1) > maks) return maks + 1;
    const D = [];
    for (let i = 0; i <= m1; i++) D[i] = [i];
    for (let j = 0; j <= n1; j++) D[0][j] = j;
    for (let i = 1; i <= m1; i++) {
      let terbaik = i;
      for (let j = 1; j <= n1; j++) {
        let v = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1,
                         D[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          v = Math.min(v, D[i - 2][j - 2] + 1);
        }
        D[i][j] = v;
        if (v < terbaik) terbaik = v;
      }
      if (terbaik > maks) return maks + 1;
    }
    return D[m1][n1];
  }

  // daftar kata mirip untuk satu kata kueri (maks 8, urut jarak lalu frekuensi)
  function saranMirip(kata, wilayah) {
    const peta = bangunKosakata();
    if (!peta) return [];
    const q = String(kata || '').toLowerCase().trim();
    if (q.length < 4) return [];
    const maks = q.length >= 7 ? 2 : 1;
    const hasil = [];
    peta.forEach((frek, w) => {
      if (w === q || w.length < 4) return;
      if (wilayah === 'pl' && !frek.pl) return;
      if (wilayah === 'pb' && !frek.pb) return;
      const d = jarakKata(q, w, maks);
      if (d <= maks) hasil.push({ kata: w, jarak: d, jumlah: frek.pl + frek.pb });
    });
    hasil.sort((x, y) => x.jarak - y.jarak || y.jumlah - x.jumlah || x.kata.localeCompare(y.kata));
    return hasil.slice(0, 8);
  }

  // ------------------------------------------------------------
  // K91c (2 Nov 2026) — 🕘 RIWAYAT CARI
  //   Bapak: *“history cari bisa banyak dari tanggal lalu mungkin user cari apa
  //   yg lalu.. dan history bisa dihapus disediakan tombol hapus history”*
  //   Disimpan di localStorage (kunci berawalan `anodes-` ⇒ ikut KUNCI_AMAN).
  //   Maks 50 entri · terbaru di atas · tanpa dobel (kata sama dipindah ke atas).
  // ------------------------------------------------------------
  const KUNCI_RIWAYAT_CARI = 'anodes-alkitab-cari-riwayat';
  const MAKS_RIWAYAT_CARI = 50;

  function bacaRiwayatCari() {
    let mentah = null;
    try { mentah = localStorage.getItem(KUNCI_RIWAYAT_CARI); } catch (e) {}
    if (!mentah) return [];
    try {
      const d = JSON.parse(mentah);
      if (!Array.isArray(d)) return [];
      return d.filter(x => x && typeof x.kata === 'string' && x.kata)
              .map(x => ({ kata: x.kata, wilayah: x.wilayah || 'semua', waktu: Number(x.waktu) || 0 }))
              .slice(0, MAKS_RIWAYAT_CARI);
    } catch (e) { return []; }
  }

  function simpanRiwayatCari(daftar) {
    try {
      localStorage.setItem(KUNCI_RIWAYAT_CARI,
        JSON.stringify(daftar.slice(0, MAKS_RIWAYAT_CARI)));
    } catch (e) {}
  }

  function catatRiwayatCari(kata, wilayah) {
    const t = String(kata || '').trim();
    if (t.length < 2) return;
    const daftar = bacaRiwayatCari()
      .filter(x => x.kata.toLowerCase() !== t.toLowerCase());
    daftar.unshift({ kata: t, wilayah: wilayah || 'semua', waktu: Date.now() });
    simpanRiwayatCari(daftar);
  }

  function hapusRiwayatCari() {
    try { localStorage.removeItem(KUNCI_RIWAYAT_CARI); } catch (e) {}
  }

  // “hari ini 14:05” · “kemarin” · “Sen 28 Okt” · “Sen 28 Okt 2025”
  function labelWaktuRiwayat(ms) {
    if (!ms) return '';
    const d = new Date(ms);
    const sekarang = new Date();
    const dua = (n) => String(n).padStart(2, '0');
    if (d.toDateString() === sekarang.toDateString()) {
      return 'hari ini ' + dua(d.getHours()) + ':' + dua(d.getMinutes());
    }
    const kemarin = new Date(sekarang.getTime() - 86400000);
    if (d.toDateString() === kemarin.toDateString()) return 'kemarin';
    const hari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][d.getDay()];
    const bln = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][d.getMonth()];
    return hari + ' ' + d.getDate() + ' ' + bln +
      (d.getFullYear() !== sekarang.getFullYear() ? ' ' + d.getFullYear() : '');
  }

  // `terbuka` = tampilkan daftarnya sekarang (bawaan: terbuka kalau belum ada kata)
  function gambarRiwayatCari(wadah, terbuka) {
    if (!wadah) return;
    wadah.innerHTML = '';
    const daftar = bacaRiwayatCari();
    if (!daftar.length) return;

    const kepala = document.createElement('div');
    kepala.className = 'ay-cari-riwayat-kepala';

    const judul = document.createElement('button');
    judul.className = 'ay-cari-riwayat-judul';
    judul.textContent = (terbuka ? '▾ ' : '▸ ') + '🕘 Riwayat cari (' + daftar.length + ')';
    judul.title = terbuka ? 'Sembunyikan riwayat cari' : 'Tampilkan riwayat cari';
    judul.addEventListener('click', () => gambarRiwayatCari(wadah, !terbuka));
    kepala.appendChild(judul);

    const hapus = document.createElement('button');
    hapus.className = 'ay-cari-riwayat-hapus';
    hapus.textContent = '🗑 Hapus';
    hapus.title = 'Hapus SELURUH riwayat cari (catatan tidak tersentuh)';
    hapus.addEventListener('click', () => {
      if (!window.confirm('Hapus seluruh riwayat cari?')) return;
      hapusRiwayatCari();
      gambarRiwayatCari(wadah, false);
      pesanKecil('🗑 Riwayat cari dihapus');
    });
    kepala.appendChild(hapus);
    wadah.appendChild(kepala);

    if (!terbuka) return;

    const baris = document.createElement('div');
    baris.className = 'ay-cari-riwayat-baris';
    daftar.forEach(x => {
      const b = document.createElement('button');
      b.className = 'ay-cari-riwayat-chip';
      const k = document.createElement('span');
      k.className = 'ay-cari-riwayat-kata';
      k.textContent = x.kata;
      b.appendChild(k);
      const w = document.createElement('span');
      w.className = 'ay-cari-riwayat-waktu';
      w.textContent = labelWaktuRiwayat(x.waktu);
      b.appendChild(w);
      b.title = 'Cari lagi "' + x.kata + '"' +
        (x.waktu ? ' · ' + labelWaktuRiwayat(x.waktu) : '');
      b.addEventListener('click', () => mulaiCari(x.kata));
      baris.appendChild(b);
    });
    wadah.appendChild(baris);
  }

  function gambarSaranMirip(wadah, kata, wilayah) {
    if (!wadah) return;
    wadah.innerHTML = '';
    const daftar = saranMirip(kata, wilayah);
    if (!daftar.length) return;

    const kepala = document.createElement('div');
    kepala.className = 'ay-cari-mirip-kepala';
    kepala.textContent = '🔎 Mungkin maksud Anda:';
    wadah.appendChild(kepala);

    const baris = document.createElement('div');
    baris.className = 'ay-cari-mirip-baris';
    daftar.forEach(s => {
      const b = document.createElement('button');
      b.className = 'ay-cari-mirip-chip';
      b.textContent = s.kata;
      b.title = 'Cari "' + s.kata + '" — ' + s.jumlah + '× muncul di Alkitab';
      b.addEventListener('click', () => mulaiCari(s.kata));
      baris.appendChild(b);
    });
    wadah.appendChild(baris);
  }

  function gambarHasilCari() {
    const m = mesin();
    const isi = elIsi();
    if (!m || !m.data || !isi) return;
    const t = cariBerjalan.kata;
    const wilayah = cariBerjalan.wilayah;

    const kataKata = t ? t.toLowerCase().split(/\s+/).filter(x => x.length >= 2) : [];
    const cariArr = kataKata.map(w => ({ kata: w, bentuk: bentukCari(w) }));

    isi.innerHTML = '';
    // K63 — mode pencarian: nama kitab & “n ayat” di baris 2 navbar dikosongkan.
    kosongkanBaris2();

    // --- kepala: judul (hasil / cari ayat) ---
    const kepala = document.createElement('div');
    kepala.className = 'ay-judul';
    kepala.textContent = t ? ('Hasil: "' + t + '"') : '🔍 Cari ayat';
    if (t && wilayah === 'pl') kepala.textContent += ' — Perjanjian Lama';
    else if (t && wilayah === 'pb') kepala.textContent += ' — Perjanjian Baru';
    isi.appendChild(kepala);

    // --- satu kotak cari (SATU-SATUNYA tempat mencari) + tombol wilayah ---
    const kotak = document.createElement('div');
    kotak.className = 'ay-cari-lagi';
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'ay-cari-input';
    inp.value = t;
    inp.placeholder = 'kata: tebus · atau nama ayat: yoh 3:16';
    inp.addEventListener('input', () => gambarSaran(inp.value));
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); mulaiCari(inp.value.trim()); }
    });
    const bCari = document.createElement('button');
    bCari.className = 'ay-cari-tombol';
    bCari.textContent = '🔍 Cari';
    bCari.title = 'Cari ayat yang memuat kata ini';
    bCari.addEventListener('click', () => mulaiCari(inp.value.trim()));
    kotak.appendChild(inp);
    kotak.appendChild(bCari);
    isi.appendChild(kotak);

    // (d) pilihan PL / PB / keduanya — sudah ada di SINI (form pertama & satu-satunya)
    //   ⚠️ K22 c: tombol ini **tanpa ikon** — dulu memakai 📚 yang tampil
    //   berwarna dan mengganggu. Sekarang cukup tulisan saja (rapi & tenang).
    const pilih3 = document.createElement('div');
    pilih3.className = 'ay-cari-wilayah';
    [['semua', 'Semua'], ['pl', 'PL'], ['pb', 'PB']].forEach(([w, label]) => {
      const b = document.createElement('button');
      b.className = 'ay-wilayah-btn' + (wilayah === w ? ' aktif' : '');
      b.dataset.wilayah = w;
      b.title = w === 'semua' ? 'Cari di seluruh Alkitab'
              : w === 'pl' ? 'Cari hanya Perjanjian Lama (Kejadian → Maleakhi)'
              : 'Cari hanya Perjanjian Baru (Matius → Wahyu)';
      b.textContent = label;
      b.addEventListener('click', () => pindahWilayah(w));
      pilih3.appendChild(b);
    });
    isi.appendChild(pilih3);

    // wadah saran “📖 Buka …” (kalau yang diketik seperti nama ayat)
    const saran = document.createElement('div');
    saran.id = 'ay-cari-saran';
    saran.className = 'ay-cari-saran';
    isi.appendChild(saran);
    gambarSaran(t);

    // K91b — wadah saran kata mirip (diisi hanya kalau hasil 0)
    const mirip = document.createElement('div');
    mirip.id = 'ay-cari-mirip';
    mirip.className = 'ay-cari-mirip';
    isi.appendChild(mirip);

    // K91c — wadah riwayat cari (hanya saat belum ada kata)
    const riwayatWadah = document.createElement('div');
    riwayatWadah.id = 'ay-cari-riwayat';
    riwayatWadah.className = 'ay-cari-riwayat';
    isi.appendChild(riwayatWadah);

    // kata kosong → halaman siap dipakai, belum ada hasil
    if (!cariArr.length) {
      const petunjuk = document.createElement('div');
      petunjuk.className = 'ay-cari-petunjuk';
      petunjuk.textContent = 'Ketik satu kata (mis. tebus) lalu tekan Enter — ' +
        'atau ketik nama ayat (mis. yoh 3:16) untuk membukanya.';
      isi.appendChild(petunjuk);
      gambarRiwayatCari(riwayatWadah, true);
      isi.scrollTop = 0;
      return;
    }

    // --- cari & tampilkan ---
    let jumlahAyat = 0, jumlahKitab = 0;
    const data = m.data;

    data.kitab.forEach((k, ki) => {
      const noKitab = ki + 1;
      if (wilayah === 'pl' && noKitab >= KITAB_PB_MULAI) return;
      if (wilayah === 'pb' && noKitab < KITAB_PB_MULAI) return;

      const temuan = [];
      (k.pasal || []).forEach(p => {
        (p.ayat || []).forEach(a => {
          if (ayatCocok(a.teks.toLowerCase(), cariArr)) {
            temuan.push({ no: p.no, ay: a.no, teks: a.teks, merah: a.merah });
          }
        });
      });
      if (!temuan.length) return;
      jumlahKitab++;
      jumlahAyat += temuan.length;

      const h = document.createElement('div');
      h.className = 'ay-kitab';
      h.textContent = '📖 ' + k.nama + ' — ' + temuan.length + ' ayat';
      isi.appendChild(h);

      temuan.slice(0, 40).forEach(t2 => {
        const baris = document.createElement('div');
        baris.className = 'ayat-baca';
        const link = document.createElement('button');
        link.className = 'ay-link-kecil';
        link.textContent = k.singkatan + ' ' + t2.no + ':' + t2.ay;
        // K91a — buka hasil cari sambil MENGINGAT bacaan sebelum mencari
        link.addEventListener('click', () => bukaHasilCari(noKitab, t2.no, t2.ay));
        baris.appendChild(link);
        const teks = document.createElement('span');
        if (t2.merah) teks.className = 'merah';
        teks.appendChild(tebalKata(t2.teks, cariArr));   // (b) kata dicari ditebalkan
        baris.appendChild(teks);
        isi.appendChild(baris);
      });
      if (temuan.length > 40) {
        const sisa = document.createElement('div');
        sisa.className = 'ay-isi2';
        sisa.textContent = '… dan ' + (temuan.length - 40) + ' ayat lain di kitab ini.';
        isi.appendChild(sisa);
      }
    });

    if (!jumlahAyat) {
      const k = document.createElement('div');
      k.className = 'ay-kosong';
      k.textContent = 'Tidak ada ayat yang memuat "' + t + '"' +
        (wilayah === 'pl' ? ' di Perjanjian Lama' : wilayah === 'pb' ? ' di Perjanjian Baru' : '') +
        '. Coba kata lain atau ganti wilayah (PL / PB / Semua).';
      // pesan “tidak ada” ditaruh SEBELUM saran & riwayat (urutan baca wajar)
      isi.insertBefore(k, mirip);
      // K91b — hasil 0 ⇒ tawarkan kata yang MIRIP (salah lafal / salah ketik)
      gambarSaranMirip(mirip, t, wilayah);
      // K91c — riwayat tetap tersedia (tertutup) supaya bisa dibuka
      gambarRiwayatCari(riwayatWadah, false);
    } else {
      const ket = document.createElement('div');
      ket.className = 'ay-isi2';
      ket.style.marginBottom = '8px';
      ket.textContent = jumlahAyat + ' ayat di ' + jumlahKitab + ' kitab — klik nama ayat untuk membukanya.';
      // ringkasan ditaruh tepat di bawah kotak cari + tombol wilayah
      if (saran.nextSibling) isi.insertBefore(ket, saran.nextSibling);
      else isi.appendChild(ket);
    }
    // K91c — riwayat cari juga tersedia saat ada hasil (tertutup, bisa dibuka)
    gambarRiwayatCari(riwayatWadah, false);
    isi.scrollTop = 0;
  }

  // K91a — buka satu hasil pencarian.
  //   Bacaan sebelum mencari (`asalCari`) dipindah ke `asalBacaan` (K80) supaya
  //   🏠 kembali ke pasal itu; `asalCari` dikosongkan agar 🏠 KEDUA kembali ke
  //   catatan (❌ bukan berputar di tempat yang sama).
  function bukaHasilCari(noKitab, noPasal, noAyat) {
    if (asalCari) {
      asalBacaan = asalCari;
      asalCari = null;
      pertahankanAsalBacaan = true;   // jangan dibuang oleh gambarPasal()
    }
    gambarPasal(noKitab, noPasal, noAyat || 0, true);
    pindahKeBaca();
    segarkanTombolKembali();
  }

  // buka/gambar hasil pencarian untuk satu kata
  function mulaiCari(t) {
    if (!t || t.length < 2) { pesanKecil('⌨️ Tulis minimal 2 huruf untuk dicari'); return false; }
    cariBerjalan.kata = t;
    // kalau sebelumnya belum memilih wilayah, pakai "Semua"
    if (!cariBerjalan.wilayah) cariBerjalan.wilayah = 'semua';
    // K91c — catat ke riwayat cari (maks 50, tanpa dobel)
    catatRiwayatCari(t, cariBerjalan.wilayah);
    pindahKeBaca();
    gambarHasilCari();
    return true;
  }

  // nama lama dipertahankan (dipakai tombol 🔍 Cari di lapisan & uji lama)
  function cariKata(t) {
    cariBerjalan = { kata: t, wilayah: 'semua' };
    pindahKeBaca();
    gambarHasilCari();
  }

  // ------------------------------------------------------------
  // pasang semua pengait
  //   ⚠️ pengait NAVBAR versi LAMA (tombol “↑ kembali” / “⌨ KETIK”) masih
  //   bisa tersimpan di `dataset.siap` kalau berkas index.html belum ikut
  //   diperbarui (atau terambil dari cache). Pembersih di bawah membuang
  //   pengait lama itu supaya tidak dobel.
  // ------------------------------------------------------------
  function pasangPengait() {
    const kait = (id, jenis, fungsi) => {
      const e = document.getElementById(id);
      if (!e || e.dataset.siap) return;
      e.dataset.siap = '1';
      e.addEventListener(jenis, fungsi);
    };

    // pindahan dari versi lama (tombol “↑ kembali” → 🏠)
    const kpl = document.getElementById('baca-kembali');
    if (kpl && kpl.dataset.siap === '1' && kpl.textContent.indexOf('kembali') >= 0) {
      const baru = kpl.cloneNode(true);       // salinan TANPA listener lama
      baru.dataset.siap = '';
      kpl.parentNode.replaceChild(baru, kpl);
    }
    ['baca-back', 'baca-pilih', 'baca-ketik', 'baca-prev', 'baca-next'].forEach(id => {
      const e = document.getElementById(id);
      // tulisan lama: “⌨ KETIK” (sekarang “🔍 Cari”)
      if (e && e.dataset.siap === '1' && /KETIK/.test(e.textContent)) {
        const baru = e.cloneNode(true);
        baru.dataset.siap = '';
        e.parentNode.replaceChild(baru, e);
      }
    });

    kait('baca-kembali', 'click', kembali);
    kait('baca-back', 'click', kembaliPosisi);
    kait('baca-pilih', 'click', bukaPilih);
    kait('baca-ketik', 'click', bukaKetik);

    // --- K20: tombol bar kirim paket ---
    kait('bk-kalimat', 'click', () => {
      opsiPaket.kalimat = !opsiPaket.kalimat;
      segarkanPilihan();
    });
    kait('bk-ayat-format', 'click', () => {
      opsiPaket.panjang = !opsiPaket.panjang;
      segarkanPilihan();
    });
    kait('bk-simpan', 'click', simpanPaket);
    kait('bk-batal', 'click', batalPilih);

    // --- K20: klik ANGKA ayat → pilih / lepas ---
    // ⚠️ Pengait dipasang di WADAH BACAAN (`#baca-isi`), BUKAN di `#editor`:
    //    angka ayat ada di halaman baca, bukan di dalam catatan — jadi
    //    kliknya tidak pernah naik sampai `#editor`. (Ini pernah salah dan
    //    membuat klik angka tidak berfungsi.)
    //    `#baca-isi` isinya digambar ulang lewat innerHTML, tapi WADAHNYA
    //    tetap sama → pengait di wadah tetap hidup (delegasi).
    const wadahBaca = elIsi();
    if (wadahBaca && !wadahBaca.dataset.siapAngka) {
      wadahBaca.dataset.siapAngka = '1';
      wadahBaca.addEventListener('click', (e) => {
        const t = e.target;
        if (!t || !t.classList || !t.classList.contains('no')) return;
        // hanya ayat di halaman BACA yang punya data-ayat (hasil cari tidak)
        if (t.dataset.ayat === undefined) return;
        pilihAyat(Number(t.dataset.ayat));
      });
    }

    kait('baca-prev', 'click', () => {
      if (posisi.pasal > 1) gambarPasal(posisi.kitab, posisi.pasal - 1);
    });
    kait('baca-next', 'click', () => {
      const m = mesin();
      if (m && posisi.pasal < m.jumlahPasal(posisi.kitab)) gambarPasal(posisi.kitab, posisi.pasal + 1);
    });

    const sk = elKitab();
    if (sk && !sk.dataset.siap) {
      sk.dataset.siap = '1';
      sk.addEventListener('change', () => { riwayat = []; gambarPasal(Number(sk.value), 1, 0, true); });
    }
    const sp = elPasal();
    if (sp && !sp.dataset.siap) {
      sp.dataset.siap = '1';
      sp.addEventListener('change', () => {
        gambarPasal(Number(sk ? sk.value : 1), Number(sp.value));
      });
    }

    // klik nama ayat di catatan
    const editor = document.getElementById('editor');
    if (editor && !editor.dataset.siapAyat) {
      editor.dataset.siapAyat = '1';
      editor.addEventListener('click', (e) => {
        const link = e.target.closest && e.target.closest('span.ay-link');
        if (!link) return;
        let ref = null;
        try { ref = JSON.parse(link.dataset.ref); } catch (err) {}
        if (!ref) return;
        const semua = [...editor.querySelectorAll('span.ay-link')];
        bukaAyatDariLink(ref, link, semua.indexOf(link));
      });
    }

    // Esc menutup lapisan · Ctrl+B = balik ke catatan (sama seperti 🏠 Home)
    if (!document.body.dataset.siapEsc) {
      document.body.dataset.siapEsc = '1';
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { tutupPilih(); tutupKetik(); }
        const hal = document.getElementById('baca-alkitab');
        if ((e.ctrlKey || e.metaKey) && e.key && e.key.toLowerCase() === 'b' &&
            hal && !hal.hidden) { e.preventDefault(); kembali(); }
      });
    }
  }

  // dipanggil saat plugin dipasang / halaman dibuka ulang
  function hidupkan() {
    pasangPengait();
    pasangTombolPlugin();      // tombol plugin → BARIS 1 (K63b)
    isiPilihanKitab();
    isiPilihanPasal(posisi.kitab, posisi.pasal);
    segarkanTombol();
    segarkanBaris2();          // K63 — isi nama kitab + “n ayat” di baris 2
  }

  /* ============================================================
     K56 — PENGHAIT KLIK TAUTAN AYAT DI HALAMAN LAIN (23 Sep 2026)
     ------------------------------------------------------------
     Bapak: *“Pengantar Sejarah Alkitab .. **link alkitab belum berfungsi**”*
     ⇒ teks halaman sejarah sudah DITANDAI (K56) tetapi kliknya belum hidup:
        pengait klik hanya dipasang di `#editor` (catatan).

     ⚠️ MENGAPA fungsi terpisah: pengait di `#editor` memakai
        `bukaAyatDariLink(ref, link, index)` yang mengingat **tempat di
        catatan** (untuk tombol 🏠). Dari halaman baca-saja, tempat itu tidak
        ada ⇒ cukup ingat **halaman asal** (pola K52 untuk kamus/penguat),
        lalu dipulihkan lewat `kembaliKeHalamanAsal()`.
     ❌ TANPA mesin baru — hanya pintu pengait untuk wadah lain.
     ============================================================ */
  const KELAS_HAL_ASAL = 'ay-link';      // sama dengan KELAS_LINK mesin
  const halamanAsalAyat = [];            // [{ wadah, kelas }] — kecil & jarang

  /* 🆕 K84 (30 Okt 2026) — LEPAS pengait halaman yang sudah dibuang.
     Wadah yang di-`innerHTML=''` atau dihapus dari DOM tetap tertahan di
     `halamanAsalAyat` ⇒ daftar tumbuh terus. Fungsi ini membuang yang sudah
     tidak terhubung ke dokumen. Dipanggil dari `pasangKaitAyatHalaman()`. */
  function bersihkanKaitHalaman() {
    for (let i = halamanAsalAyat.length - 1; i >= 0; i--) {
      if (!halamanAsalAyat[i].wadah.isConnected) halamanAsalAyat.splice(i, 1);
    }
  }

  function pasangKaitAyatHalaman(wadah, jenis) {
    if (!wadah || wadah.dataset.siapAyatHal) return false;
    bersihkanKaitHalaman();
    wadah.dataset.siapAyatHal = '1';
    halamanAsalAyat.push({ wadah: wadah, jenis: jenis || 'halaman' });

    wadah.addEventListener('click', (e) => {
      const link = e.target.closest && e.target.closest('span.' + KELAS_HAL_ASAL);
      if (!link) return;
      let ref = null;
      try { ref = JSON.parse(link.dataset.ref || 'null'); } catch (err) {}
      if (!ref) return;
      e.preventDefault();
      // ingat halaman asal (untuk tombol 🏠 di halaman baca)
      //   🐞 CACAT NYATA (ketemu saat uji klik 23 Sep 2026): dulu saya memanggil
      //      `window.__anodesAsalAyat.ingat(...)` — pusat perantara itu TIDAK
      //      PERNAH dipasang ⇒ penanda asal tidak terbentuk ⇒ tombol 🏠 kembali
      //      ke CATATAN, bukan ke halaman sejarah. Sekarang panggil LANGSUNG.
      //
      //   🐞 CACAT NYATA #2 (ketemu saat uji K84, 30 Okt 2026): kalau wadahnya
      //      BERADA DI DALAM halaman aplikasi biasa (`#baca-alkitab` atau
      //      `#app-utama`), mendaftarkan “halaman asal” itu SALAH — 🏠 jadi
      //      melompat ke halaman penguat padahal pengguna hanya ingin kembali
      //      ke pasal yang tadi dibaca / ke catatan.
      //      Terukur: klik “Mazmur 34:10” di kotak penguat Mazmur 23 ⇒ 🏠
      //      membuka HALAMAN PENGUAT, bukan Mazmur 23.
      //      ⇒ Untuk wadah di dalam halaman aplikasi, biarkan jalur bawaan
      //        `kembali()` yang menangani (`asalBacaan` K80 untuk halaman baca ·
      //        `pulihPosisi()` untuk catatan).
      const diDalamApp = !!(wadah.closest &&
        (wadah.closest('#baca-alkitab') || wadah.closest('#app-utama')));
      if (!diDalamApp) {
        try {
          ingatAsalAyat({
            jenis: jenis || 'halaman',
            gulir: wadah.scrollTop,
            teks: link.textContent
          });
        } catch (err) {}
      }
      // sembunyikan halaman asal (pola `pindahKeBaca()` — ia hanya menyembunyikan
      //   `#app-utama`, jadi halaman lain seperti halaman Sejarah harus ditutup
      //   di sini supaya tidak menumpuk dengan halaman baca).
      const app = wadah.closest('.app');
      if (app && app !== document.getElementById('baca-alkitab')) app.hidden = true;
      bukaAyatDariLink(ref, null, 0, diDalamApp);
    });
    return true;
  }

  /* ------------------------------------------------------------
     PUSAT INGATAN HALAMAN ASAL (dipakai plugin lain, mis. halaman Sejarah)
       K56 — supaya tombol 🏠 di halaman baca bisa kembali ke halaman asal
       (❌ bukan ke catatan) + memunculkan halamannya lagi.
       Pola SAMA dengan `ANodesKamusTampilan.pulihDariAlkitab()` (K43) —
       hanya GENERAL: wadah mana pun bisa mendaftar callback pulihnya.
     ------------------------------------------------------------ */
  let asalAyat = null;          // { jenis, gulir, teks, pulih? }
  let pulihHal = null;          // fungsi milik plugin pemilik halaman

  function ingatAsalAyat(info) {
    asalAyat = info || null;
    // cari callback pulih dari pendaftar (yang punya halaman masih terdaftar)
    pulihHal = null;
    if (info && info.jenis && pemulihHalaman[info.jenis]) pulihHal = pemulihHalaman[info.jenis];
  }

  const pemulihHalaman = Object.create(null);   // { jenis: fn() -> bool }

  function daftarPemulihHalaman(jenis, fn) {
    if (jenis && typeof fn === 'function') pemulihHalaman[jenis] = fn;
  }

  function adaAsalAyat() { return !!asalAyat; }

  // dipanggil `kembali()` bila halaman baca dibuka dari halaman lain
  function kembaliKeHalamanAsalAyat() {
    const a = asalAyat;
    const fn = pulihHal;
    asalAyat = null; pulihHal = null;
    if (!a || !fn) return false;
    const baca = document.getElementById('baca-alkitab');
    if (baca) baca.hidden = true;
    try { return fn(a) !== false; } catch (e) { return false; }
  }

  // ------------------------------------------------------------
  // pasang tombol tambahan dari definisi plugin (kontrak: `tombol[]`)
  // ------------------------------------------------------------
  // Navbar baca sudah 8 tombol dan WAJIB muat 1 baris — jadi tombol
  // tambahan (mis. 📤 = pintu masuk fitur K20) ditempel setelah 🔍 Cari.
  // Tombol digambar dari plugin/alkitab/plugin.js supaya KETERANGAN plugin
  // tetap satu tempat; berkas ini hanya memasangnya.
  function pasangTombolPlugin() {
    const nav = document.querySelector('#baca-alkitab .ay-nav-b1')
             || document.querySelector('#baca-alkitab .alkitab-nav');
    const def = (window.ANodesPlug || []).find(x => x && x.id === 'alkitab');
    if (!nav || !def || !Array.isArray(def.tombol)) return;
    def.tombol.forEach(t => {
      if (!t || !t.id) return;
      let b = document.getElementById(t.id);
      if (!b) {
        b = document.createElement('button');
        b.id = t.id;
      }
      // K63 — tombol plugin selalu di UJUNG baris 1 (setelah 🔍 Cari).
      //   `appendChild` sekaligus memindahkannya kalau barisnya berubah.
      nav.appendChild(b);
      b.textContent = t.ikon || '🔘';
      if (t.judul) b.title = t.judul;
      if (!b.dataset.siapTombol) {
        b.dataset.siapTombol = '1';
        b.addEventListener('click', () => { if (typeof t.saatKlik === 'function') t.saatKlik(); });
      }
    });
  }

  // ------------------------------------------------------------
  // K22 a · INGAT BACAAN TERAKHIR
  //   Kalau Alkitab dibuka lagi (walau aplikasi sudah ditutup), yang tampil
  //   adalah kitab & pasal terakhir yang dibaca — ❌ bukan selalu Kejadian 1:1.
  //   Disimpan di localStorage; kata kunci berawalan `anodes-` supaya ikut
  //   diamankan & dipulihkan oleh alat uji.
  // ------------------------------------------------------------
  const KUNCI_BACAAN = 'anodes-alkitab-bacaan';

  function simpanBacaan() {
    try {
      localStorage.setItem(KUNCI_BACAAN, JSON.stringify({
        kitab: posisi.kitab, pasal: posisi.pasal, ayat: posisi.ayat || 0
      }));
    } catch (e) {}
  }

  function bacaBacaanTerakhir() {
    let mentah = null;
    try { mentah = localStorage.getItem(KUNCI_BACAAN); } catch (e) {}
    if (!mentah) return null;
    try {
      const d = JSON.parse(mentah);
      if (!d || !(d.kitab >= 1 && d.kitab <= 66) || !(d.pasal >= 1)) return null;
      return { kitab: d.kitab, pasal: d.pasal, ayat: d.ayat || 0 };
    } catch (e) { return null; }
  }

  // untuk tombol 📖 Alkitab di bar plugin
  function bukaHalaman() {
    // K20: ingat tempat menulis dulu — supaya 🏠 bisa kembali ke posisi itu
    if (window.ANodesEditor && window.ANodesEditor.ingatPosisi) {
      try { window.ANodesEditor.ingatPosisi(); } catch (e) {}
    }
    saatSiap(bukaHalamanSekarang);
  }

  function bukaHalamanSekarang() {
    pindahKeBaca();
    // kalau bacaan sudah tampil, biarkan apa adanya (jangan digambar ulang) —
    // tetapi penghias tetap dijalankan supaya plugin yang baru dipasang
    // (mis. 🔗 Ayat Terkait) langsung terlihat tanpa perlu pindah pasal.
    if (document.querySelector('#baca-isi .ay-judul')) {
      jalankanPenghias({ kitab: posisi.kitab, pasal: posisi.pasal, isi: elIsi() });
      return;
    }
    // K22 a: lanjutkan dari bacaan terakhir; kalau belum ada catatan → Kejadian 1
    const terakhir = bacaBacaanTerakhir();
    if (terakhir) {
      gambarPasal(terakhir.kitab, terakhir.pasal, terakhir.ayat, true);
    } else {
      gambarPasal(1, 1, 0, true);
    }
  }

  // ------------------------------------------------------------
  // PENGHIAS — plugin lain menambahkan sesuatu di halaman baca
  // ------------------------------------------------------------
  // Kenapa pakai cara ini, bukan memanggil langsung?
  //   Plugin 🔗 Ayat Terkait butuh halaman baca yang SEDANG tampil.
  //   Kalau plugin itu memanggil fungsi Alkitab, berarti Alkitab harus
  //   tahu soal dia — padahal plugin harus bisa dicabut. Jadi dibalik:
  //   Alkitab SETIAP KALI selesai menggambar pasal, ia MEMBERI TAHU
  //   (“gambar selesai, pasal X”). Plugin yang berminat mendaftar lewat
  //   tambahPenghias(fn). Kalau plugin tidak ada → tidak ada yang jalan.
  const penghias = [];

  function tambahPenghias(fn) {
    if (typeof fn !== 'function') return;
    if (penghias.indexOf(fn) >= 0) return;
    penghias.push(fn);
  }

  // K86 (3 Nov 2026) — plugin boleh MENARIK penghiasnya saat dilepas.
  //   Tanpa ini, plugin yang dilepas masih dipanggil tiap pasal digambar
  //   (fungsi lama tetap di daftar) ⇒ hiasan bisa muncul lagi sesudah dilepas.
  function lepasPenghias(fn) {
    const i = penghias.indexOf(fn);
    if (i < 0) return false;
    penghias.splice(i, 1);
    return true;
  }

  function jalankanPenghias(ctx) {
    penghias.slice().forEach(fn => {
      try { fn(ctx); } catch (e) { console.warn('ANodes Alkitab: penghias gagal', e); }
    });
  }

  /* ============================================================
     BAR PINTASAN — ⏸️ DIMATIKAN 22 Sep 2026
     ------------------------------------------------------------
     Bapak membatalkan K55d: *“konsep awal itu sudah benar seharusnya secara
     konsep tidak berubah.. tujuan saya hanya mau merapihkan menu”*
     ⇒ tombol KEMBALI ke tempatnya masing-masing (per ayat / baris sendiri).

     Fungsi di bawah dibiarkan ADA supaya plugin versi lama tidak error kalau
     masih memanggilnya, TETAPI **tidak menggambar apa pun** (`PINTASAN_HIDUP
     = false`). Kalau nanti bar pintasan mau dipakai lagi, cukup ubah
     `PINTASAN_HIDUP` menjadi `true` — kodenya masih utuh.
     ============================================================ */
  const PINTASAN_HIDUP = false;
  const pintasan = [];

  function daftarPintasan(nama, urut, buat) {
    if (!PINTASAN_HIDUP) return false;
    if (typeof nama !== 'string' || typeof buat !== 'function') return false;
    const lama = pintasan.find(p => p.nama === nama);
    if (lama) { lama.urut = urut; lama.buat = buat; }
    else pintasan.push({ nama: nama, urut: (typeof urut === 'number' ? urut : 10), buat: buat });
    segarkanPintasan();
    return true;
  }

  function lepasPintasan(nama) {
    const i = pintasan.findIndex(p => p.nama === nama);
    if (i < 0) return false;
    pintasan.splice(i, 1);
    if (PINTASAN_HIDUP) segarkanPintasan();
    return true;
  }

  // gambar ulang isi bar pintasan (⏸️ tidak jalan selama PINTASAN_HIDUP = false)
  function segarkanPintasan() {
    const isi = elIsi();
    if (!isi || !isi.querySelector('.ay-judul')) return;   // bukan halaman pasal
    if (!PINTASAN_HIDUP) {                                 // pastikan sisa bar dibuang
      const sisa = isi.querySelector('.ay-pintasan');
      if (sisa) sisa.remove();
      return;
    }

    let baris = isi.querySelector('.ay-pintasan');
    if (!baris) {
      if (!pintasan.length) return;                        // belum ada isinya
      baris = document.createElement('div');
      baris.className = 'ay-pintasan';
      const jangkar = isi.querySelector('.ay-meta') || isi.querySelector('.ay-judul');
      if (jangkar && jangkar.parentElement === isi) {
        jangkar.insertAdjacentElement('afterend', baris);
      } else {
        isi.insertBefore(baris, isi.firstChild);
      }
    }
    baris.innerHTML = '';
    isiBarPintasan(isi, baris);
  }

  function isiBarPintasan(isi, baris) {
    // ⚠️ `buat()` boleh mengembalikan `null` kalau tombolnya TIDAK berlaku untuk
    //    pasal yang sedang tampil (mis. 📖 sejarah hanya di pasal 1). Karena itu
    //    tiap plugin membaca keadaan pasal SENDIRI — daftar tidak perlu direset.
    if (!pintasan.length) return;
    pintasan.slice()
      .sort((a, b) => a.urut - b.urut)
      .forEach(p => {
        let el = null;
        try { el = p.buat(); } catch (e) { console.warn('ANodes: pintasan gagal', e); }
        if (el) baris.appendChild(el);
      });
  }

  // dipanggil tiap selesai menggambar pasal — ⏸️ no-op (K55d dibatalkan)
  function pasangBarPintasan(isi, noKitab, noPasal) {
    if (!PINTASAN_HIDUP) return;
    if (!isi || !pintasan.length) return;
    segarkanPintasan();
    const baris = isi.querySelector('.ay-pintasan');
    if (!baris) return;
    if (!baris.children.length) baris.remove();           // kosong → tidak perlu baris
  }

  // untuk tombol 🔍 Cari di toolbar halaman baca (dulu dinamai ⌨ KETIK)
  function bukaCari() { bukaKetik(); }

  window.ANodesAlkitabTampilan = {
    hidupkan, bukaAyatDariLink, kembali, gambarPasal, cariKata,
    // penanda versi — K55b (22 Sep 2026: fitur sejarah dipindah jadi plugin sendiri)
    versi: () => VERSI,
    // K63 — baris 2 navbar = judul pasal (nama kitab + “n ayat”)
    segarkanBaris2,
    bukaHalaman, bukaCari, bukaPilih, bukaKetik,
    // penghias: plugin lain boleh menambahkan isi di halaman baca
    tambahPenghias, jalankanPenghias, lepasPenghias,
    // K56 (23 Sep 2026) — tautan ayat di HALAMAN LAIN + kembali ke halaman asal
    pasangKaitAyatHalaman, daftarPemulihHalaman, ingatAsalAyat,
    adaAsalAyat, kembaliKeHalamanAsalAyat, bersihkanKaitHalaman,
    // K80 (30 Okt 2026) — [Full] dari pratinjau 🌿 Ayat Terkait:
    //   lompat ke rentang ayat + kedip 5 detik + 🏠 balik ke bacaan sebelumnya
    bukaRentang, adaAsalBacaan, kembaliKeAsalBacaan, segarkanTombolKembali,
    // K55d — plugin lain boleh menaruh tombol di BAR PINTASAN atas pasal
    daftarPintasan, lepasPintasan, segarkanPintasan,
    // K20 — kirim paket ayat ke catatan
    kirimAyatDariSini, simpanPaket, pilihAyat, batalPilih, susunPaket,
    // K21 — pencarian ayat (cari lagi · PL/PB · kata tebal · kata dasar)
    mulaiCari, pindahWilayah,
    // K91 (2 Nov 2026) — 🏠 balik ke bacaan sebelum cari · 🔎 saran kata mirip ·
    //   🕘 riwayat cari (+ hapus)
    bukaHasilCari, adaAsalCari, kembaliKeAsalCari,
    saranMirip, bacaRiwayatCari, hapusRiwayatCari,
    // K22 a — ingat bacaan terakhir
    bacaBacaanTerakhir,
    // K22 b — kalau halaman hasil sudah terbuka, jangan buka form cari lagi
    fokusKotakCari,
    isiPilihanKitab, get posisi() { return posisi; },
    // K34 — rentang ayat yang sedang dibuka (mis. Roma 8:6-10) atau null
    get rentang() { return rentangBuka ? Object.assign({}, rentangBuka) : null; },
    get pilihan() { return pilih.slice(); },
    get opsi() { return Object.assign({}, opsiPaket); },
    get cari() { return Object.assign({}, cariBerjalan); },
    _bentukCari: bentukCari
  };

  // hidupkan begitu halaman siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pastiHidupkan);
  } else {
    pastiHidupkan();
  }
  function pastiHidupkan() {
    if (window.ANodesPlugin && window.ANodesPlugin.dipasang('alkitab')) hidupkan();
    else {
      pasangPengait();          // tetap siapkan pengait supaya klik pertama langsung jalan
      pasangTombolPlugin();     // tombol 📤 tetap disiapkan (belum berfungsi kalau plugin dilepas)
      segarkanBaris2();         // K63 — baris 2 judul (kalau halaman baca ada)
    }
  }
})();
