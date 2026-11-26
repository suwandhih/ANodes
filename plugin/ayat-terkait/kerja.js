/* ============================================================
   ANodes — plugin/ayat-terkait/kerja.js
   🌿 HALAMAN KERJA AYAT TERKAIT (K31 — 15 Sep 2026)

   ------------------------------------------------------------
   APA INI? (penegasan Bapak 15 Sep 2026)
   “halaman kerja ayat terkait **bukan kembali pada ANodes** ..
    tapi **halaman kerja ayat terkait** .. ini masih proses membuat
    **urutan ayat yg diperlukan user** jadi **belum dipindahkan ke
    note utama atau home**”
   “tetap disana user bisa **menelusuri ayat demi ayat** .. dari ayat
    pertama klik sampai user menemukan **rantai ayat yg terkait** ..
    ini **disimpan dengan nama → ayat pertama atau judul** .. nanti
    file ini diperlukan di note home .. akan **dipanggil** untuk
    diolah dalam kalimat oleh user”

   Jadi ada 3 HALAMAN:
     ① catatan (ANodes)        — tempat menulis (note/home)
     ② baca pasal (Alkitab)    — ada tombol “ayat terkait (n)”
     ③ **HALAMAN KERJA ini**   — meja kerja: menyusun + menyimpan rantai

   ALUR:
     baca pasal → [ayat terkait (n)] → chip → PRATINJAU → `✓ pilih`
       → **PINDAH ke halaman kerja ini** (❌ bukan ke catatan)
       → telusuri ayat demi ayat (klik chip → pratinjau → ✓ pilih)
       → tersimpan sendiri dengan nama **ayat utama**
       → nanti dipanggil dari catatan (K32)

   ATURAN LOGIKA LAB 2 yang tetap dipakai (jangan diubah):
     • blok putih bertumpuk ke bawah (❌ bukan breadcrumb / pohon lipat)
     • 1 ayat = 1 blok (dedup) — ayat yang sudah ada cukup disorot
     • klik kaitan = PRATINJAU dulu (1 slot, gantian) → `✓ pilih` = jadi blok
     • kaitan lanjutan DI DALAM pratinjau = abu-abu & mati
     • hapus = satu ayat + SELURUH cabangnya (2 langkah)
     • kaitan diurut urutan kitab (bukan votes)

   ATURAN PLUGIN ANodes:
     • plugin BISA DILEPAS → halaman kerja ikut dibersihkan
     • ❌ JANGAN fetch() — data lewat mesin (IndexedDB)
     • ❌ JANGAN popup untuk tanya nama — Bapak: “bisa ditanya tapi
       jangan popup supaya seragam konsisten.. mengurangi sampah”

   SIMPANAN: localStorage `anodes-rantai-v1` → { daftar: [ {id,nama,akar,pohon,diubah} ] }
     • auto-simpan mulai kedalaman > 3 turunan (keputusan Bapak 15 Sep)
     • keluar halaman → tersimpan otomatis dengan nama ayat utama
   ============================================================ */

window.ANodesAyatTerkaitKerja = (function () {
  'use strict';

  const KUNCI = 'anodes-rantai-v1';   // simpanan rantai (bahan mentah, belum jadi catatan)

  // ------------------------------------------------------------
  // 👤 K100 (3 Nov 2026) — KUNCI PER EMAIL
  // Data dipisah menurut email; lihat js/pengguna.js.
  // ⚠️ Kalau ANodesPengguna belum ada (mis. diuji tanpa berkas itu),
  //    kunci kembali ke bentuk lama supaya aplikasi TETAP JALAN.
  // ------------------------------------------------------------
  function kunciData() {
    const P = window.ANodesPengguna;
    return (P && P.kunci) ? P.kunci(KUNCI) : KUNCI;
  }

  const CHIP_MAKS = 60;               // batas chip per blok (data bisa 97)
  const KEDALAMAN_AUTO = 3;           // > 3 turunan → simpan otomatis (keputusan Bapak)

  const mesinTerkait = () => window.ANodesAyatTerkait;
  const mesinAlkitab = () => window.ANodesAlkitab;
  const elHal = () => document.getElementById('kerja-ayat');
  const elIsi = () => document.getElementById('kerja-isi');
  const elNama = () => document.getElementById('kerja-nama');
  const elStatus = () => document.getElementById('kerja-status');
  const elLangkah = () => document.getElementById('kerja-langkah');

  // ── keadaan halaman kerja (satu meja kerja pada satu waktu) ──
  let kunciRantai = null;     // id simpanan (dibuat saat rantai mulai)
  let namaRantai = '';        // nama berkas (bawaan: ayat utama)
  let namaDisentuh = false;   // user sudah mengetik nama sendiri?
  let pohon = null;           // { r:[k,p,a1,a2], a:[ anak... ] }
  let aktif = null;           // node blok terakhir yang dipilih (garis hijau)
  let pratinjauDi = null;     // node yang sedang punya kotak pratinjau
  let pratinjauD = null;      // data ayat yang sedang dipratinjau (1 slot, gantian)
  let sorotNode = null;       // node yang sedang disorot kuning
  let sudahSimpan = true;     // sudah tersimpan & tidak ada perubahan baru?
  let riwayatDibersihkan = false;  // user sudah tekan [✕] riwayat (K33)

  // ── K37 MODE GRUP (17 Sep 2026) ──
  //   Bapak: *“klik ayat 2,3 dan 4 .. klik salah satu tombol [ayat terkait(21)]
  //   sistem mengerti user sedang menghidupkan sistem ayat terkait dalam GROUP ..
  //   ketiga ayat tsb (2,3 dan 4) bisa ganti2 dalam satu kolom sampai user klik
  //   [✓ pilih] .. ayat mulai turun seperti yg sudah ada.”*
  //   ⇒ baris pemilih grup tampil di halaman kerja SEBELUM rantai turun.
  //     Setelah `✓ pilih` → grup selesai tugasnya, alur rantai biasa berjalan.
  let grup = null;            // { kitab, pasal, ayat:[2,3,4], aktif:2 }
  let pratinjauGrupD = null;  // ayat yang sedang dipratinjau di mode grup (1 slot)

  // ── simpanan sementara untuk riwayat: kalau user membersihkan riwayat,
  //    kita simpan penanda di memori saja (riwayat = catatan jalan, bukan data).

  // ------------------------------------------------------------
  // alat kecil (sama gaya dengan tampilan.js)
  // ------------------------------------------------------------
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

  const kunci = (r) => r[0] + '.' + r[1] + '.' + r[2];

  // teks + nama ayat dari ref; pakai SATU panggilan (ambilAyatBanyak)
  function dataRef(r) {
    const a = mesinAlkitab();
    if (!a || !a.ambilAyatBanyak) return null;
    try {
      const d = a.ambilAyatBanyak([[r[0], r[1], r[2], r[3]]]);
      return (d && d[0]) || null;
    } catch (e) { return null; }
  }

  // labelRef dengan nama kitab PANJANG (dipakai di luar mode grup)
  // ------------------------------------------------------------
  // K39 (17 Sep 2026) — NAMA KITAB SINGKAT DI SELURUH TAMPILAN PLUGIN
  //   Bapak: *“saya perlu oder untuk **semua ayat terkait** gunakan metode
  //   **ayat singkat saja**.. **Matius → Mat** supaya hemat tempat.”*
  //   ⇒ blok · jejak langkah · Riwayat Jalur · nama berkas = **nama SINGKAT**.
  //     (`labelPendek` disediakan `ANodesAlkitab.ambilAyatBanyak()`)
  //   ⚠️ Title (keterangan saat disorot mouse) tetap boleh nama PANJANG.
  // ------------------------------------------------------------
  function labelRef(r) {
    const d = dataRef(r);
    if (!d) return r[0] + ':' + r[1] + ':' + r[2];
    return d.labelPendek || d.label || (r[0] + ':' + r[1] + ':' + r[2]);
  }

  // nama PANJANG (dipakai hanya untuk keterangan/title supaya tidak salah ayat)
  function labelPanjangRef(r) {
    const d = dataRef(r);
    return d && d.label ? d.label : (r[0] + ':' + r[1] + ':' + r[2]);
  }

  // K38 — dipakai mode grup (sekarang sama dengan labelRef)
  const labelPendekRef = labelRef;

  // kaitan satu ref (urut URUTAN KITAB — seperti lab2)
  function kaitanRef(r) {
    const m = mesinTerkait();
    if (!m || !m.kaitan) return [];
    return m.kaitan(r[0], r[1], r[2]).slice()
      .sort((x, y) => (x[0] - y[0]) || (x[1] - y[1]) || (x[2] - y[2]));
  }

  const samaRef = (x, y) => x && y && x[0] === y[0] && x[1] === y[1] && x[2] === y[2] && x[3] === y[3];
  const samaAyat = (x, y) => x && y && x[0] === y[0] && x[1] === y[1] && x[2] === y[2];

  // ------------------------------------------------------------
  // POKOK POHON
  // ------------------------------------------------------------
  function turunanPohon(n) {
    let n2 = 0;
    (n.a || []).forEach(c => { n2 = Math.max(n2, 1 + turunanPohon(c)); });
    return n2;
  }
  const dalamnya = (n) => 1 + turunanPohon(n);

  // hitung kedalaman node (= berapa turunan dari akar)
  function kedalaman(node) {
    let k = 0, t = akarPohon();
    (function jalan(n, d) {
      if (n === node) { k = d; return; }
      (n.a || []).forEach(c => jalan(c, d + 1));
    })(t, 0);
    return k;
  }

  const akarPohon = () => pohon;
  function cariInduk(n, mulai) {
    const dari = mulai || pohon;
    if (!dari) return null;
    if ((dari.a || []).indexOf(n) >= 0) return dari;
    for (const c of (dari.a || [])) {
      const h = cariInduk(n, c);
      if (h) return h;
    }
    return null;
  }

  // apakah node ada di dalam cabang `induk`?
  function didalam(induk, node) {
    if (induk === node) return true;
    return (induk.a || []).some(c => didalam(c, node));
  }

  // cari node yang mengandung ref (dedup 1 ayat = 1 blok)
  function cariNodeRef(r, dari) {
    const mulai = dari || pohon;
    if (!mulai) return null;
    if (samaAyat(mulai.r, r)) return mulai;
    for (const c of (mulai.a || [])) {
      const h = cariNodeRef(r, c);
      if (h) return h;
    }
    return null;
  }

  // daftar jalur dari akar ke node (untuk jejak di kepala)
  function jalurKe(node) {
    const hasil = [];
    (function cari(n, jalan) {
      const baru = jalan.concat([n]);
      if (n === node) { hasil.push(...baru); return true; }
      for (const c of (n.a || [])) { if (cari(c, baru)) return true; }
      return false;
    })(pohon, []);
    return hasil;
  }

  // ------------------------------------------------------------
  // GAMBAR HALAMAN
  // ------------------------------------------------------------
  function gambar() {
    const isi = elIsi();
    if (!isi) return;
    isi.innerHTML = '';

    // K37 — MODE GRUP: baris pemilih grup tampil SEBELUM rantai turun.
    if (grup) {
      isi.appendChild(kotakGrup());
      gambarLangkah();
      gambarStatus();
      return;
    }

    if (!pohon) {
      const k = document.createElement('div');
      k.className = 'rk-kosong';
      k.innerHTML = 'Meja kerja masih kosong.<br>' +
        'Buka <b>Alkitab</b> → tekan <b>ayat terkait (n)</b> di sebuah ayat → ' +
        'pilih satu kaitan → tekan <b>✓ pilih</b>.<br>' +
        'Rantainya akan muncul di sini dan bisa diteruskan ayat demi ayat.';
      isi.appendChild(k);
      gambarLangkah();
      gambarStatus();
      return;
    }

    // 🕒 Riwayat Jalur (dipakai untuk “jalan yang sudah dilewati”)
    isi.appendChild(panelRiwayat());

    isi.appendChild(blokNode(pohon, 0));
    gambarLangkah();
    gambarStatus();
    namaKeKotak();
  }

  // ============================================================
  // K37 — MODE GRUP (17 Sep 2026)
  //   Halaman baca: klik angka 2, 3, 4 → tekan salah satu `ayat terkait (n)`
  //   → **pindah ke halaman kerja** dengan 3 ayat diikat.
  //   Halaman kerja: [2][3][4] bisa GANTI-GANTI (satu kolom) sampai `✓ pilih`.
  //   Setelah `✓ pilih` → ayat grup yang aktif jadi AKAR rantai, ayat pilihan
  //   TURUN jadi blok pertama, lalu alur rantai biasa (seperti sekarang).
  //   ⚠️ alur 1 ayat TIDAK berubah (grup hanya hidup kalau ≥2 ayat terpilih).
  // ============================================================
  function namaKitab(no) {
    const a = mesinAlkitab();
    if (!a || !a.daftarKitab) return String(no);
    try {
      const k = a.daftarKitab().find(x => x.no === no);
      return k ? k.nama : String(no);
    } catch (e) { return String(no); }
  }

  function jumlahKaitanGrup(n) {
    const m = mesinTerkait();
    if (!m || !m.jumlahKaitanAyat) return 0;
    try { return m.jumlahKaitanAyat(grup.kitab, grup.pasal, n); } catch (e) { return 0; }
  }

  // kotak pemilih grup: [2][3][4] + kolom kaitan ayat yang aktif
  function kotakGrup() {
    const wrap = document.createElement('div');
    wrap.className = 'rk-grup';

    const kepala = document.createElement('div');
    kepala.className = 'rk-grup-kepala';
    kepala.appendChild(elSpan('rk-grup-judul',
      '🔗 Ayat terkait — grup ' + namaKitab(grup.kitab) + ' ' + grup.pasal +
      ' (' + grup.ayat.length + ' ayat)'));
    kepala.appendChild(elSpan('rk-grup-hint',
      'pilih nomor ayat, lalu klik kaitannya'));
    wrap.appendChild(kepala);

    const barisNo = document.createElement('div');
    barisNo.className = 'rk-grup-no';
    grup.ayat.forEach(n => {
      const jumlah = jumlahKaitanGrup(n);
      const b = tombol('rk-grup-btn' + (n === grup.aktif ? ' rk-grup-aktif' : ''),
        String(n),
        jumlah ? 'Ayat ' + n + ' — ' + jumlah + ' ayat terkait'
               : 'Ayat ' + n + ' — tidak ada ayat terkait',
        () => {
          if (grup.aktif === n) return;
          grup.aktif = n;
          pratinjauGrupD = null;      // ganti ayat → pratinjau lama dibuang
          gambar();
        });
      b.dataset.ayat = String(n);
      if (!jumlah) b.classList.add('rk-grup-kosong');
      barisNo.appendChild(b);
    });
    wrap.appendChild(barisNo);

    const isi = document.createElement('div');
    isi.className = 'rk-grup-isi';

    const ref = [grup.kitab, grup.pasal, grup.aktif, grup.aktif];
    const semua = kaitanRef(ref);

    // K38 butir a — TAMPILKAN KALIMAT AYAT yang sedang aktif.
    //   Bapak 17 Sep 2026: *“klik [2] tampil isi kalimat ayat [2] dan klik [3]
    //   tampilkan isi ayat [3] dan dibawah ayat terkait seperti ini.”*
    //   ⇒ kalimat ayat ditaruh DI ATAS deretan kaitan (kaitan tetap di bawahnya).
    const dAktif = dataRef(ref);
    if (dAktif) {
      const ayatAktif = document.createElement('div');
      ayatAktif.className = 'rk-grup-ayat';
      (dAktif.ayat || []).forEach(x => {
        const p = document.createElement('p');
        p.className = 'at-ayat' + (x.merah ? ' merah' : '');
        p.appendChild(elSpan('at-no', x.no));
        p.appendChild(document.createTextNode(x.teks));
        ayatAktif.appendChild(p);
      });
      isi.appendChild(ayatAktif);
    }

    const baris = document.createElement('div');
    baris.className = 'at-kaitan';
    if (!semua.length) {
      baris.appendChild(elSpan('at-kosong',
        'Ayat ' + grup.aktif + ' tidak punya ayat terkait.'));
    } else {
      semua.slice(0, CHIP_MAKS).forEach(r => baris.appendChild(chipGrup(r)));
      if (semua.length > CHIP_MAKS) {
        const sisa = tombol('at-lagi', '＋ ' + (semua.length - CHIP_MAKS) + ' kaitan lagi',
          'Tampilkan semua kaitan ayat ini', () => {
            const t = baris.querySelector('.at-lagi');
            semua.slice(CHIP_MAKS).forEach(r => {
              const c = chipGrup(r);
              if (t) baris.insertBefore(c, t); else baris.appendChild(c);
            });
            if (t) t.remove();
          });
        baris.appendChild(sisa);
      }
    }
    isi.appendChild(baris);

    if (pratinjauGrupD) isi.appendChild(kotakPratinjauGrup(pratinjauGrupD));
    wrap.appendChild(isi);
    return wrap;
  }

  // satu chip kaitan di mode grup: klik = PRATINJAU (belum jadi blok)
  //   K39 — label = nama kitab SINGKAT · title = nama PANJANG (supaya tidak salah ayat)
  function chipGrup(r) {
    const d = dataRef(r);
    const label = labelPendekRef(r);
    const panjang = labelPanjangRef(r);
    const judul = panjang +
      (d && d.ayat.length > 1 ? ' (' + d.ayat.length + ' ayat)' : '') +
      ' — klik untuk melihat dulu';
    const b = tombol('at-chip', label, judul, () => {
      const isi = Object.assign({}, d || { label: label });
      // label pendek dipakai di tampilan pratinjau mode grup (hemat tempat)
      isi.labelPendek = label;
      isi._ref = r;
      pratinjauGrupD = isi;
      gambar();
    });
    if (pratinjauGrupD && pratinjauGrupD._ref && samaAyat(r, pratinjauGrupD._ref)) {
      b.classList.add('at-chip-previewed');
    }
    return b;
  }

  // kotak pratinjau mode grup: teks + ✓ pilih + kaitan lanjutan abu-abu (mati)
  function kotakPratinjauGrup(d) {
    const box = document.createElement('div');
    box.className = 'at-pratinjau';

    const kepala = document.createElement('div');
    kepala.className = 'at-pratinjau-kepala';
    // K38 — nama kitab singkat supaya hemat tempat
    kepala.appendChild(elSpan('at-pratinjau-nama', d.labelPendek || d.label));
    kepala.appendChild(tombol('at-pilih', '✓ pilih',
      'Mulai rantai dari ayat ' + grup.aktif + ' → ' + labelPanjangRef(d._ref),
      () => komitGrup(d)));
    kepala.appendChild(tombol('at-tutup', '✕', 'Tutup pratinjau', () => {
      pratinjauGrupD = null;
      gambar();
    }));
    box.appendChild(kepala);

    const teks = document.createElement('div');
    teks.className = 'at-pratinjau-teks';
    (d.ayat || []).forEach(x => {
      const p = document.createElement('p');
      p.className = 'at-ayat' + (x.merah ? ' merah' : '');
      p.appendChild(elSpan('at-no', x.no));
      p.appendChild(document.createTextNode(x.teks));
      teks.appendChild(p);
    });
    box.appendChild(teks);

    const r = d._ref;
    const sub = document.createElement('div');
    sub.className = 'at-kaitan at-kaitan-mati';
    if (r) {
      // K38 — kaitan lanjutan juga pakai nama kitab singkat (hemat tempat)
      const lanjut = kaitanRef(r).filter(x => !samaAyat(x, r)).slice(0, 24);
      lanjut.forEach(x => sub.appendChild(elSpan('at-ref-mati', labelPendekRef(x))));
      if (lanjut.length) sub.title = 'Klik “✓ pilih” dulu untuk melanjutkan rantai';
    }
    box.appendChild(sub);
    return box;
  }

  // ② KOMIT mode grup → rantai MULAI: ayat grup yang aktif = akar,
  //    ayat pilihan TURUN jadi blok pertama (lalu alur biasa berjalan).
  function komitGrup(d) {
    const r = d && d._ref;
    if (!r) return;

    kunciRantai = 'r' + Date.now();
    namaDisentuh = false;
    pohon = { r: [grup.kitab, grup.pasal, grup.aktif, grup.aktif], a: [] };
    const baru = { r: r.slice(), a: [] };
    pohon.a.push(baru);
    aktif = baru;
    namaRantai = labelRef(pohon.r);
    grup = null;                 // baris pemilih grup selesai tugasnya
    pratinjauGrupD = null;
    sudahSimpan = false;
    simpan(true);                // bahan mentah langsung siap (seperti `buka()`)
    gambar();
    sorot(baru);
    pesan('🌿 Rantai mulai dari ' + labelRef(pohon.r));
  }

  // dipanggil tampilan.js saat user menghidupkan ayat terkait dalam GRUP
  function bukaGrup(kitab, pasal, ayatArr, ayatAktif) {
    const arr = (ayatArr || []).filter(n => typeof n === 'number')
      .slice().sort((a, b) => a - b);
    if (arr.length < 2) return false;

    if (pohon && !sudahSimpan) simpan(true);   // rantai lama disimpan dulu

    kunciRantai = null;
    pohon = null;
    aktif = null;
    pratinjauDi = null; pratinjauD = null;
    namaDisentuh = false;
    namaRantai = '';
    sudahSimpan = true;
    riwayatDibersihkan = false;
    const inp0 = elNama();
    if (inp0) inp0.value = '';

    grup = {
      kitab: kitab, pasal: pasal, ayat: arr,
      aktif: (arr.indexOf(ayatAktif) >= 0) ? ayatAktif : arr[0]
    };
    pratinjauGrupD = null;
    tampilkan();
    gambar();
    pesan('🔗 ' + arr.length + ' ayat diikat — pilih nomor ayat, lalu kaitannya');
    return true;
  }

  function blokNode(n, dalam) {
    const d = dataRef(n.r);
    const wrap = document.createElement('div');
    wrap.className = 'rk-blok' + (n === aktif ? ' rk-aktif' : '');
    if (n === sorotNode) wrap.classList.add('rk-sorot');
    wrap.dataset.kunci = kunci(n.r);

    const kepala = document.createElement('div');
    kepala.className = 'rk-kepala';
    // K39 — blok memakai nama kitab SINGKAT; nama panjang hanya di title
    kepala.appendChild(elSpan('rk-ref', '📖 ' + labelRef(n.r)));
    if (d && d.label) kepala.lastChild.title = d.label;
    kepala.appendChild(tombol('at-blok-jalur', '📍',
      'Tunjukkan ayat ini di Riwayat Jalur', () => sorotJalur(kunci(n.r))));
    if (n !== pohon) {
      kepala.appendChild(tombol('at-blok-hapus', '✕',
        'Hapus ayat ini beserta seluruh cabang di bawahnya', () => bukaHapus(wrap, n)));
    } else {
      kepala.appendChild(elSpan('rk-akar', 'akar'));
    }
    wrap.appendChild(kepala);

    const box = document.createElement('div');
    box.className = 'rk-dalam';

    // teks ayat (berentang ditampilkan lengkap)
    const teks = document.createElement('div');
    teks.className = 'rk-teks';
    if (d) {
      d.ayat.forEach(x => {
        const p = document.createElement('p');
        p.className = 'at-ayat' + (x.merah ? ' merah' : '');
        p.appendChild(elSpan('at-no', x.no));
        p.appendChild(document.createTextNode(x.teks));
        teks.appendChild(p);
      });
    }
    box.appendChild(teks);

    // kaitan langsung tampil sebagai chip (butir c: tidak perlu tekan tombol lagi)
    const semua = kaitanRef(n.r);
    const baris = document.createElement('div');
    baris.className = 'at-kaitan';
    if (semua.length) {
      semua.slice(0, CHIP_MAKS).forEach(r => baris.appendChild(chip(n, r)));
      if (semua.length > CHIP_MAKS) {
        baris.appendChild(tombol('at-lagi', '＋ ' + (semua.length - CHIP_MAKS) + ' kaitan lagi',
          'Tampilkan semua kaitan ayat ini', () => {
            const sisa = baris.querySelector('.at-lagi');
            semua.slice(CHIP_MAKS).forEach(r => {
              const c = chip(n, r);
              if (sisa) baris.insertBefore(c, sisa); else baris.appendChild(c);
            });
            if (sisa) sisa.remove();
          }));
      }
    } else {
      baris.appendChild(elSpan('at-kosong', '(tidak ada ayat terkait)'));
    }
    box.appendChild(baris);

    // kotak pratinjau (hanya di node yang sedang dipratinjau)
    if (pratinjauDi === n && pratinjauD) box.appendChild(kotakPratinjau(n, pratinjauD));

    wrap.appendChild(box);

    // cabang-cabang (blok bertumpuk ke bawah)
    if ((n.a || []).length) {
      const anak = document.createElement('div');
      anak.className = 'rk-anak';
      n.a.forEach(c => anak.appendChild(blokNode(c, dalam + 1)));
      wrap.appendChild(anak);
    }
    return wrap;
  }

  // satu chip kaitan: klik = PRATINJAU (belum jadi blok)
  function chip(n, r) {
    const d = dataRef(r);
    const b = tombol('at-chip', labelRef(r),
      labelPanjangRef(r) +
      (d && d.ayat.length > 1 ? ' (' + d.ayat.length + ' ayat)' : '') +
      ' — klik untuk melihat dulu', () => {
        pratinjauDi = n;
        pratinjauD = d || { label: kunci(r) };
        pratinjauD._ref = r;
        gambar();
      });
    if (pratinjauDi === n && pratinjauD && samaAyat(r, pratinjauD._ref || r)) {
      b.classList.add('at-chip-previewed');
    }
    return b;
  }

  // kotak pratinjau: teks + ✓ pilih + kaitan lanjutan abu-abu (matat)
  function kotakPratinjau(n, d) {
    const box = document.createElement('div');
    box.className = 'at-pratinjau';

    const kepala = document.createElement('div');
    kepala.className = 'at-pratinjau-kepala';
    // K39 — nama di pratinjau = nama kitab SINGKAT
    kepala.appendChild(elSpan('at-pratinjau-nama', labelRef(d._ref || [0, 0, 1, 1]) || d.label));
    kepala.appendChild(tombol('at-pilih', '✓ pilih',
      'Pilih ayat ini — jadi blok & lanjutkan rantai', () => komit(n, d)));
    kepala.appendChild(tombol('at-tutup', '✕', 'Tutup pratinjau', () => {
      pratinjauDi = null; pratinjauD = null; gambar();
    }));
    box.appendChild(kepala);

    const teks = document.createElement('div');
    teks.className = 'at-pratinjau-teks';
    (d.ayat || []).forEach(x => {
      const p = document.createElement('p');
      p.className = 'at-ayat' + (x.merah ? ' merah' : '');
      p.appendChild(elSpan('at-no', x.no));
      p.appendChild(document.createTextNode(x.teks));
      teks.appendChild(p);
    });
    box.appendChild(teks);

    // kaitan lanjutan: ABU-ABU & TIDAK bisa diklik (cegah ayat perantara ter-skip)
    const r = d._ref;
    const sub = document.createElement('div');
    sub.className = 'at-kaitan at-kaitan-mati';
    if (r) {
      const lanjut = kaitanRef(r).filter(x => !samaAyat(x, r)).slice(0, 24);
      lanjut.forEach(x => sub.appendChild(elSpan('at-ref-mati', labelRef(x))));
      if (lanjut.length) sub.title = 'Klik “✓ pilih” dulu untuk melanjutkan rantai';
    }
    box.appendChild(sub);
    return box;
  }

  // ------------------------------------------------------------
  // ② KOMIT — ayat jadi blok: label jejak + blok baru DI BAWAH
  // ------------------------------------------------------------
  function komit(n, d) {
    const r = d._ref;
    if (!r) return;

    // dedup 1 ayat = 1 blok → kalau sudah ada, cukup disorot
    const sudah = cariNodeRef(r);
    if (sudah) {
      aktif = sudah;
      sorot(sudah);
      pratinjauDi = null; pratinjauD = null;
      gambar();
      pesan('Ayat itu sudah ada di rantai — disorot');
      return;
    }

    const baru = { r: r.slice(), a: [] };
    n.a = n.a || [];
    n.a.push(baru);
    aktif = baru;

    pratinjauDi = null; pratinjauD = null;
    adaPerubahan();

    // auto-simpan mulai kedalaman > 3 turunan (keputusan Bapak 15 Sep 2026)
    if (kedalaman(baru) > KEDALAMAN_AUTO) simpan(true);
    gambar();
    sorot(baru);
  }

  function sorot(node) {
    sorotNode = node;
    setTimeout(() => {
      if (sorotNode === node) { sorotNode = null; }
      const el = elIsi() && elIsi().querySelector('.rk-blok.rk-sorot');
      if (el) el.classList.remove('rk-sorot');
    }, 2500);
    const el = elIsi();
    if (!el) return;
    setTimeout(() => {
      const t = el.querySelector('.rk-blok[data-kunci="' + kunci(node.r) + '"]');
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 30);
  }

  // ------------------------------------------------------------
  // HAPUS — satu ayat + SELURUH cabangnya (2 langkah, INLINE / bukan popup)
  // ------------------------------------------------------------
  function bukaHapus(wrap, n) {
    const lama = wrap.querySelector(':scope > .rk-hapus');
    if (lama) lama.remove();

    const kumpul = [];
    (function kump(nn) { kumpul.push(nn); (nn.a || []).forEach(kump); })(n);

    const kotak = document.createElement('div');
    kotak.className = 'rk-hapus';
    kotak.appendChild(elSpan('rk-hapus-isi',
      kumpul.length > 1
        ? 'Hapus ' + labelRef(n.r) + ' + ' + (kumpul.length - 1) + ' cabang di bawahnya?'
        : 'Hapus ' + labelRef(n.r) + '?'));

    kotak.appendChild(tombol('rk-hapus-ya', 'Ya, hapus', 'Hapus ayat ini & seluruh cabangnya', () => {
      const induk = cariInduk(n);
      if (induk) induk.a = (induk.a || []).filter(x => x !== n);
      if (aktif === n || didalam(n, aktif)) aktif = induk || pohon;
      if (pratinjauDi === n || (pratinjauDi && didalam(n, pratinjauDi))) { pratinjauDi = null; pratinjauD = null; }
      adaPerubahan();
      simpan(true);
      gambar();
      pesan('🗑 ' + labelRef(n.r) + (kumpul.length > 1 ? ' + cabangnya' : '') + ' dihapus');
    }));
    kotak.appendChild(tombol('rk-hapus-batal', 'Batal', 'Batalkan', () => kotak.remove()));

    wrap.querySelector(':scope > .rk-dalam').appendChild(kotak);
  }

  // ------------------------------------------------------------
  // NAMA + SIMPAN
  // ------------------------------------------------------------
  function namaKeKotak() {
    const inp = elNama();
    if (!inp) return;
    if (!namaDisentuh) namaRantai = pohon ? labelRef(pohon.r) : '';
    if (inp.value !== namaRantai) inp.value = namaRantai;
  }

  function adaPerubahan() {
    sudahSimpan = false;
    if (!kunciRantai) kunciRantai = 'r' + Date.now();
    gambarStatus();
    jadwalkanSimpan();
  }

  // ── simpan otomatis (tertunda) ────────────────────────────────
  //   Bapak: *“bisa otomatis bisa diberi judul”* + *“kalau sudah telusuri
  //   lebih dari 3 turunan sebaiknya disimpan otomatis.. nama ayat utama”*
  //   Jadi: setiap perubahan → simpan tertunda (900 ms) → ditambah simpan
  //   langsung kalau rantai sudah > 3 turunan. Dengan begitu rantai tidak
  //   hilang walau aplikasi ditutup / halaman disegarkan (F5).
  function jadwalkanSimpan() {
    clearTimeout(window.__rkSimpanT);
    window.__rkSimpanT = setTimeout(() => {
      if (pohon && !sudahSimpan) simpan(true);
    }, 900);
  }

  // batalkan simpan yang masih tertunda — dipakai saat rantai DIBUANG,
  // supaya rantai yang baru dihapus tidak “hidup lagi” dari timer.
  function batalkanSimpan() {
    clearTimeout(window.__rkSimpanT);
    window.__rkSimpanT = null;
  }

  function bacaSimpanan() {
    try {
      const mentah = localStorage.getItem(kunciData());
      const d = mentah ? JSON.parse(mentah) : null;
      return (d && Array.isArray(d.daftar)) ? d : { daftar: [] };
    } catch (e) { return { daftar: [] }; }
  }

  function tulisSimpanan(obj) {
    try {
      localStorage.setItem(kunciData(), JSON.stringify(obj));
      return true;
    } catch (e) {
      pesan('⚠️ Tidak bisa menyimpan (ruang penuh?)');
      return false;
    }
  }

  // buang kolom “riwayatBersih” dari pohon sebelum disimpan supaya simpanan
  // rapi; nilai `_rb` dipakai untuk mengingat bahwa Riwayat sudah dibersihkan.
  function pohonUntukSimpan(n) {
    const t = { r: n.r.slice(), a: (n.a || []).map(pohonUntukSimpan) };
    if (n === pohon && riwayatDibersihkan) t._rb = 1;
    return t;
  }

  function simpan(diam) {
    if (!pohon) return false;
    const inp = elNama();
    if (inp && inp.value.trim()) namaRantai = inp.value.trim();
    else if (!namaRantai) namaRantai = labelRef(pohon.r);

    if (!kunciRantai) kunciRantai = 'r' + Date.now();
    const data = bacaSimpanan();
    const lama = data.daftar.find(x => x.id === kunciRantai);
    const isi = {
      id: kunciRantai,
      nama: namaRantai,
      akar: pohon.r.slice(),
      pohon: pohonUntukSimpan(pohon),
      jumlahAyat: (function hit(n) { return 1 + (n.a || []).reduce((s, c) => s + hit(c), 0); })(pohon),
      dibuat: lama ? lama.dibuat : new Date().toISOString(),
      diubah: new Date().toISOString()
    };
    if (lama) Object.assign(lama, isi); else data.daftar.unshift(isi);
    if (tulisSimpanan(data)) {
      sudahSimpan = true;
      gambarStatus();
      if (!diam) {
        const j = new Date();
        const p = (x) => String(x).padStart(2, '0');
        pesan('💾 “' + namaRantai + '” disimpan ' + p(j.getHours()) + ':' + p(j.getMinutes()) + ':' + p(j.getSeconds()));
      }
      return true;
    }
    return false;
  }

  function gambarStatus() {
    const s = elStatus();
    if (!s) return;
    if (!pohon) { s.textContent = ''; return; }
    const jml = (function hit(n) { return 1 + (n.a || []).reduce((x, c) => x + hit(c), 0); })(pohon);
    s.textContent = sudahSimpan ? ('💾 tersimpan · ' + jml + ' ayat')
                                : ('✎ belum disimpan · ' + jml + ' ayat');
    s.style.color = sudahSimpan ? '#0b7a34' : '#b26a00';
  }

  // jejak langkah: 2 Korintus 1:2 → Roma 1:7
  function gambarLangkah() {
    const el = elLangkah();
    if (!el) return;
    el.innerHTML = '';

    // K37 — mode grup: jejak = daftar ayat yang diikat + nomor yang aktif
    if (grup) {
      el.appendChild(elSpan('kl-ikon', '🔗 '));
      el.appendChild(elSpan('kl-nama',
        'grup ' + namaKitab(grup.kitab) + ' ' + grup.pasal + ' — ayat ' +
        grup.ayat.join(', ') + ' (aktif: ' + grup.aktif + ')'));
      return;
    }

    if (!pohon) {
      el.appendChild(elSpan('kl-kosong', 'belum ada rantai'));
      return;
    }
    const jalan = jalurKe(aktif || pohon);
    el.appendChild(elSpan('kl-ikon', '🧭 '));
    jalan.forEach((n, i) => {
      if (i) el.appendChild(document.createTextNode(' → '));
      const a = document.createElement('a');
      a.className = 'kl-link';
      a.href = '#';
      a.textContent = labelRef(n.r);
      a.title = i === 0 ? 'Ayat utama (akar rantai)' : 'Lompat ke ayat ini';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        aktif = n;
        gambar();
        sorot(n);
      });
      el.appendChild(a);
    });
    if (!namaDisentuh) el.appendChild(elSpan('kl-nama', '  · nama: ' + labelRef(pohon.r)));
  }

  // 🕒 Riwayat Jalur — setiap ✓ pilih = 1 jalur
  //   [✕] di kepala panel = **bersihkan riwayat** (K33).
  //   ⚠️ Membersihkan riwayat ❌ TIDAK menghapus ayat/blok atau simpanan —
  //      riwayat itu hanya CATATAN JALAN (navigasi).
  function panelRiwayat() {
    const wrap = document.createElement('div');
    wrap.className = 'at-riwayat';
    const kepala = document.createElement('div');
    kepala.className = 'at-riwayat-kepala';
    kepala.appendChild(elSpan('at-riwayat-judul', '🕒 Riwayat Jalur'));

    // hitung dulu berapa jalur (untuk tahu tombol perlu tampil atau tidak)
    const semua = kumpulkanJalur(pohon);

    if (semua.length) {
      kepala.appendChild(tombol('at-riwayat-bersih', '✕',
        'Bersihkan Riwayat Jalur (ayat & rantai TIDAK terhapus)', () => {
          riwayatDibersihkan = true;
          batalkanSimpan();          // jangan tersimpan karena perubahan riwayat saja
          gambar();
          pesan('✕ Riwayat Jalur dibersihkan');
        }));
    }
    wrap.appendChild(kepala);

    const isi = document.createElement('div');
    isi.className = 'at-riwayat-isi';
    if (!semua.length) {
      const p = document.createElement('div');
      p.style.color = '#777';
      p.textContent = riwayatDibersihkan
        ? 'Riwayat sudah dibersihkan. Tekan “✓ pilih” untuk mencatat jalur baru.'
        : 'Belum ada jalur. Tekan “✓ pilih” pada sebuah ayat.';
      isi.appendChild(p);
    } else {
      const ol = document.createElement('ol');
      semua.slice().reverse().forEach(j => {
        const li = document.createElement('li');
        j.forEach((n, i) => {
          if (i) li.appendChild(document.createTextNode(' → '));
          const a = document.createElement('a');
          a.className = 'at-riwayat-link';
          a.href = '#';
          a.dataset.kunci = kunci(n.r);
          a.textContent = labelRef(n.r);
          a.title = 'Tunjukkan ayat ini di rantai — ' + labelPanjangRef(n.r);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            aktif = n;
            gambar();
            sorot(n);
          });
          li.appendChild(a);
        });
        ol.appendChild(li);
      });
      isi.appendChild(ol);
    }
    wrap.appendChild(isi);
    return wrap;
  }

  // semua jalur dari akar ke tiap turunan (terbaru di belakang)
  //   ⚠️ kalau user sudah menekan [✕] (riwayatDibersihkan) → dianggap kosong,
  //      TETAPI ayat/blok/simpanan TIDAK tersentuh.
  function kumpulkanJalur(dari) {
    const hasil = [];
    if (!dari || riwayatDibersihkan) return hasil;
    (function kump(n, jalan) {
      const j = jalan.concat([n]);
      if (jalan.length) hasil.push(j);
      (n.a || []).forEach(c => kump(c, j));
    })(dari, []);
    return hasil;
  }

  function sorotJalur(k) {
    const panel = elIsi() && elIsi().querySelector('.at-riwayat');
    if (!panel) return;
    const links = panel.querySelectorAll('.at-riwayat-link[data-kunci="' + k + '"]');
    if (!links.length) { pesan('Ayat ini belum tercatat di Riwayat Jalur'); return; }
    links.forEach(a => a.classList.add('at-riwayat-sorot'));
    links[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => links.forEach(a => a.classList.remove('at-riwayat-sorot')), 3000);
  }

  // ------------------------------------------------------------
  // BUKA / TUTUP HALAMAN KERJA
  // ------------------------------------------------------------
  //   akarRef  = ayat tempat user MULAI (mis. 2 Korintus 1:2)
  //   pilih    = data ayat yang baru di-`✓ pilih` (mis. Roma 1:7)
  //   Tanpa akarRef (mis. dibuka dari menu [Doc]) → halaman kerja KOSONG,
  //   tinggal pilih rantai dari daftar simpanan.
  function buka(akarRef, pilih) {
    // K37: masuk lewat jalur biasa → mode grup ditutup
    grup = null;
    pratinjauGrupD = null;

    if (!akarRef) {
      if (pohon) { tampilkan(); gambar(); return; }   // sudah ada rantai → lanjutkan
      tampilkan();                                   // meja kerja kosong
      gambar();
      return;
    }

    // rantai yang sama sedang dibuka → jangan direset, cukup lanjut
    if (pohon && samaAyat(pohon.r, akarRef)) {
      tampilkan();
      if (pilih && pilih._ref) {
        const n = cariNodeRef(pilih._ref);
        if (n) { aktif = n; gambar(); sorot(n); }
      }
      return;
    }

    // rantai lain yang belum tersimpan → simpan dulu (tanpa popup)
    if (pohon && !sudahSimpan) simpan(true);

    kunciRantai = 'r' + Date.now();
    namaDisentuh = false;
    pohon = { r: akarRef.slice(0, 4), a: [] };
    aktif = pohon;
    riwayatDibersihkan = false;
    if (pohon.r.length < 4) pohon.r = [pohon.r[0], pohon.r[1], pohon.r[2], pohon.r[2]];
    namaRantai = labelRef(pohon.r);
    adaPerubahan();
    simpan(true);                  // akarnya sudah tersimpan (bahan mentah siap)

    if (pilih && pilih._ref) {
      const baru = { r: pilih._ref.slice(), a: [] };
      pohon.a.push(baru);
      aktif = baru;
      // kalau turunan pertama sudah > 3 (tidak mungkin) → tetap aman
      simpan(true);
    }
    pratinjauDi = null; pratinjauD = null;
    tampilkan();
    gambar();
  }

  function tampilkan() {
    const utama = document.getElementById('app-utama');
    const baca = document.getElementById('baca-alkitab');
    const hal = elHal();
    if (utama) utama.hidden = true;
    if (baca) baca.hidden = true;
    if (hal) hal.hidden = false;
    const isi = elIsi();
    if (isi) isi.scrollTop = 0;
  }

  function tutup() {
    // K37: keluar dari baris pemilih grup → grup dibatalkan (belum ada rantai)
    if (grup && !pohon) {
      grup = null;
      pratinjauGrupD = null;
    }
    // keluar → tersimpan otomatis dengan nama ayat utama (keputusan Bapak)
    if (pohon && !sudahSimpan) simpan(true);
    else if (pohon) simpan(true);
    batalkanSimpan();
    const hal = elHal();
    if (hal) hal.hidden = true;
    // kembali ke HALAMAN BACA (bukan langsung ke catatan)
    const baca = document.getElementById('baca-alkitab');
    if (baca) {
      baca.hidden = false;
      const t = window.ANodesAlkitabTampilan;
      if (t && typeof t.segarkanTombol === 'function') { try { t.segarkanTombol(); } catch (e) {} }
    }
    pesan('↩ Keluar dari halaman kerja — rantai tersimpan');
  }

  function buang() {
    // K33: membuang rantai yang sedang di meja kerja **DAN** menghapusnya dari
    // daftar simpanan — satu tombol, satu perbuatan jelas (permintaan Bapak:
    // “berkas test masih gantung”).

    // K37: kalau yang tampil baris pemilih GRUP (rantai belum turun),
    //      tombol ini membatalkan grup — belum ada berkas yang perlu dibuang.
    //      Sesudah dibatalkan, user dipulangkan ke HALAMAN BACA (meja kerja
    //      sudah tidak berisi apa-apa, jadi tidak ada gunanya dibiarkan terbuka).
    if (grup && !pohon) {
      grup = null;
      pratinjauGrupD = null;
      gambar();
      const hal = elHal();
      if (hal) hal.hidden = true;
      const baca = document.getElementById('baca-alkitab');
      if (baca) {
        baca.hidden = false;
        const t = window.ANodesAlkitabTampilan;
        if (t && typeof t.segarkanTombol === 'function') { try { t.segarkanTombol(); } catch (e) {} }
      }
      pesan('✕ Grup ayat dibatalkan');
      return;
    }

    if (!pohon) { pesan('Meja kerja sudah kosong'); return; }

    // tanya dulu INLINE (❌ bukan popup) — supaya tidak salah buang
    const isi = elIsi();
    if (!isi) return;
    if (isi.querySelector('.rk-buang-tanya')) return;

    const kotak = document.createElement('div');
    kotak.className = 'rk-buang-tanya';
    kotak.appendChild(elSpan('rk-buang-isi',
      'Buang rantai “' + (namaRantai || labelRef(pohon.r)) + '” beserta seluruh isinya?'));
    kotak.appendChild(tombol('rk-buang-ya', 'Ya, buang', 'Buang & hapus dari daftar simpanan', () => {
      buangSekarang();
    }));
    kotak.appendChild(tombol('rk-buang-batal', 'Batal', 'Batalkan', () => kotak.remove()));
    isi.insertBefore(kotak, isi.firstChild);
  }

  function buangSekarang() {
    batalkanSimpan();                      // jangan “hidup lagi” dari timer simpan
    if (kunciRantai) hapusSimpanan(kunciRantai);
    const namaLama = namaRantai;
    kunciRantai = null;
    pohon = null;
    aktif = null;
    pratinjauDi = null; pratinjauD = null;
    namaDisentuh = false;
    namaRantai = '';
    sudahSimpan = true;
    riwayatDibersihkan = false;
    const inp = elNama();
    if (inp) inp.value = '';
    gambar();
    pesan('🗑 Rantai “' + (namaLama || '') + '” dibuang');
  }

  // buka kembali rantai yang sudah tersimpan (dipakai menu [Doc])
  function bukaSimpanan(id) {
    const data = bacaSimpanan();
    const s = data.daftar.find(x => x.id === id);
    if (!s || !s.pohon) { pesan('Rantai tidak ditemukan'); return false; }
    grup = null; pratinjauGrupD = null;      // K37: buka simpanan → keluar mode grup
    kunciRantai = s.id;
    namaRantai = s.nama;
    namaDisentuh = true;
    pohon = s.pohon;
    aktif = pohon;
    pratinjauDi = null; pratinjauD = null;
    sudahSimpan = true;
    riwayatDibersihkan = !!pohon._rb;   // ingat: riwayat pernah dibersihkan
    tampilkan();
    gambar();
    return true;
  }

  function daftarSimpanan() {
    const data = bacaSimpanan();
    return data.daftar
      .slice()
      .sort((a, b) => String(b.diubah || '').localeCompare(String(a.diubah || '')));
  }

  // ============================================================
  // K40 (17 Sep 2026) — INSERT HASIL RANTAI KE CATATAN
  //   Bapak: *“buka [Doc] pilih ayat terkait berkas tersimpan .. [Buka] [insert] [🗑]
  //   ditambah menu [insert] untuk copy ke catatan .. user tentukan letak yg dia mau
  //   untuk di insert ayat terkait .. setelah ditentukan klik di menu [insert].”*
  //   ⇒ menyusun TEKS rantai (nama ayat / + kalimat) lalu menyerahkannya ke
  //     catatan lewat jalur yang SUDAH ADA (K20): ANodesEditor.terimaPaket().
  // ============================================================

  // kumpulkan SEMUA ayat rantai (akar dulu, lalu turunan berurutan ke bawah)
  function ayatRantai(pohonR) {
    const hasil = [];
    (function kump(n) { hasil.push(n.r.slice()); (n.a || []).forEach(kump); })(pohonR);
    return hasil;
  }

  // susun teks rantai. Pilihan: { kalimat:bool, panjang:bool }
  //   tanpa kalimat → satu nama ayat per baris (mis. “Rom 4:3”)
  //   + kalimat     → nama ayat lalu kalimatnya (nomor ayat ikut, seperti K20c)
  function susunTeksRantai(pohonR, opsi) {
    const o = Object.assign({ kalimat: false, panjang: false }, opsi || {});
    const refs = ayatRantai(pohonR);
    const baris = [];
    refs.forEach(r => {
      const d = dataRef(r);
      const nama = o.panjang ? labelPanjangRef(r) : labelRef(r);
      baris.push(nama);
      if (o.kalimat && d && d.ayat) {
        d.ayat.forEach(x => {
          const t = String(x.teks || '').replace(/\s+/g, ' ').trim();
          // nomor ayat ikut (jangan pakai [3] — kurung siku + angka bisa
          // terbaca sebagai tautan ayat oleh pengenal Alkitab).
          if (t) baris.push(x.no + ' ' + t);
        });
      }
    });
    return { teks: baris.join('\n'), nama: labelRef(pohonR.r) };
  }

  // dari ID simpanan → susun teks (dipakai tombol [ + Ayat ] di menu [Doc])
  function susunDariSimpanan(id, opsi) {
    const data = bacaSimpanan();
    const s = data.daftar.find(x => x.id === id);
    if (!s || !s.pohon) return null;
    const hasil = susunTeksRantai(s.pohon, opsi);
    hasil.nama = s.nama || hasil.nama;
    return hasil;
  }

  // serahkan ke catatan (jalur K20) — TIDAK menempel, hanya dipegang user
  function kirimKeCatatan(paketTeks, sumber) {
    if (!paketTeks || !paketTeks.teks) { pesan('⚠️ Tidak ada ayat untuk dikirim'); return false; }
    const ed = window.ANodesEditor;
    if (!ed || typeof ed.terimaPaket !== 'function') {
      pesan('⚠️ Catatan belum siap menerima ayat');
      return false;
    }
    const okTerima = ed.terimaPaket({
      teks: paketTeks.teks, nama: paketTeks.nama,
      sumber: sumber || null            // K40 — supaya pilihan bentuk bisa menyusun ulang
    });
    if (okTerima) {
      // tutup halaman kerja & halaman berkas, pindah ke CATATAN
      const hal = elHal();
      if (hal) hal.hidden = true;
      const baca = document.getElementById('baca-alkitab');
      if (baca) baca.hidden = true;
      const berkas = document.getElementById('berkas-halaman');
      if (berkas) berkas.hidden = true;
      const utama = document.getElementById('app-utama');
      if (utama) utama.hidden = false;
      pesan('📋 “' + paketTeks.nama + '” siap — klik di catatan, lalu [ + Ayat ]');
    }
    return okTerima;
  }

  function hapusSimpanan(id) {
    const data = bacaSimpanan();
    data.daftar = data.daftar.filter(x => x.id !== id);
    tulisSimpanan(data);
    if (kunciRantai === id) { kunciRantai = null; pohon = null; aktif = null; }
  }

  // ------------------------------------------------------------
  // PEMASANGAN
  // ------------------------------------------------------------
  function kait(id, jenis, fn) {
    const e = document.getElementById(id);
    if (!e || e.dataset.siapKerja) return;
    e.dataset.siapKerja = '1';
    e.addEventListener(jenis, fn);
  }

  function hidupkan() {
    kait('kerja-keluar', 'click', tutup);
    kait('kerja-atas', 'click', () => {
      const isi = elIsi();
      if (isi) isi.scrollTo({ top: 0, behavior: 'smooth' });
      if (pohon) { aktif = pohon; gambar(); }
    });
    kait('kerja-buang', 'click', buang);
    kait('kerja-baru', 'click', buang);      // nama lama (kalau masih ada) → sama
    kait('kerja-simpan', 'click', () => simpan(false));
    kait('kerja-pasang', 'click', () => pesan('📥 “Pakai di catatan” menyusul (tahap K32)'));

    const inp = elNama();
    if (inp && !inp.dataset.siapKerjaNama) {
      inp.dataset.siapKerjaNama = '1';
      inp.addEventListener('input', () => {
        namaDisentuh = !!inp.value.trim() && inp.value.trim() !== (pohon ? labelRef(pohon.r) : '');
        namaRantai = inp.value;
        sudahSimpan = false;
        gambarStatus();
      });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); inp.blur(); simpan(false); }
      });
    }

    // pintasan: Esc = keluar (seperti halaman lain) · Ctrl+S = simpan
    if (!document.body.dataset.siapKerjaEsc) {
      document.body.dataset.siapKerjaEsc = '1';
      document.addEventListener('keydown', (e) => {
        const hal = elHal();
        if (!hal || hal.hidden) return;
        if (e.key === 'Escape') { tutup(); return; }
        if ((e.ctrlKey || e.metaKey) && e.key && e.key.toLowerCase() === 's') {
          e.preventDefault();
          simpan(false);
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key && e.key.toLowerCase() === 'b') {
          e.preventDefault();
          tutup();
        }
      });
    }
  }

  // saat plugin dilepas / data digambar ulang
  function bersihkan() {
    batalkanSimpan();
    const hal = elHal();
    if (hal) hal.hidden = true;
    if (pohon && !sudahSimpan) simpan(true);
    pohon = null; aktif = null; pratinjauDi = null; pratinjauD = null;
    grup = null; pratinjauGrupD = null;
    kunciRantai = null; namaDisentuh = false; sudahSimpan = true;
    riwayatDibersihkan = false;
    const isi = elIsi();
    if (isi) isi.innerHTML = '';
    const inp = elNama();
    if (inp) inp.value = '';
    // kalau halaman kerja sedang tampil saat plugin dilepas → pindah ke catatan
    const kerja = elHal();
    if (kerja && !kerja.hidden) {
      kerja.hidden = true;
      const baca = document.getElementById('baca-alkitab');
      if (baca) baca.hidden = true;
      const utama = document.getElementById('app-utama');
      if (utama) utama.hidden = false;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hidupkan);
  } else {
    setTimeout(hidupkan, 0);
  }

  // ⚠️ JANGAN menulis `window.ANodesAyatTerkaitKerja = {...}` di dalam sini —
  //    blok ini sendiri yang menghasilkan nama itu. Cukup return objeknya.
  return {
    hidupkan, buka, tutup, buang, buangSekarang, bersihkan,
    bukaSimpanan, daftarSimpanan, hapusSimpanan, simpan, batalkanSimpan,
    bukaGrup,                                   // K37 — mode grup
    // K40 — insert hasil rantai ke catatan
    susunTeksRantai, susunDariSimpanan, kirimKeCatatan,
    // dipakai alat uji & berkas lain
    get _grup() { return grup ? Object.assign({}, grup) : null; },
    get _pohon() { return pohon; },
    get _aktif() { return aktif; },
    get _nama() { return namaRantai; },
    get _tersimpan() { return sudahSimpan; },
    get _kunci() { return kunciRantai; },
    get _riwayatBersih() { return riwayatDibersihkan; },
    _kumpulkanJalur: kumpulkanJalur,
    _komit: komit,
    KUNCI
  };
})();
