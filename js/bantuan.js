/* ============================================================
   ANodes — js/bantuan.js
   ❓ TOMBOL BANTUAN `[?]` YANG MENYESUAIKAN HALAMAN  (K64 b–e · 3 Nov 2026)

   ------------------------------------------------------------
   PERMINTAAN PEMILIK PROYEK (23 Sep 2026)
   ------------------------------------------------------------
     *“buat rencanakerja · panduan -> dalam plugin > [help] · konsep adalah
      · bila berada di note > paduannya di catatan dan setiap fitur / menu ·
      bila ada alkitab > panduannya alkitab dengan sedikit arahan tambahan
      plugin hanya keterangan tujuan · bila ada di sejarah, ayat terkait,
      kamus istilah dan penguat · masing menerangkan cara menggunakan
      secara detail pada help”*

   ⇒ SATU tombol `[?]`. Isinya MENYESUAIKAN halaman yang sedang terbuka:
     • 📝 Catatan      → semua fitur & menu catatan (paling lengkap)
     • 📖 Alkitab      → cara baca + arahan tambahan dari plugin yang aktif
     • 🌿 kerja · 📚 kamus · 🖊 penguat · 📜 sejarah · 🗺️ peta
                       → cara pakai halaman itu SECARA DETAIL
     • 🧩 halaman keterangan plugin → HANYA tujuan pluginnya
       (cara pakainya sudah ada di daftar `cara[]` milik plugin itu)

   ------------------------------------------------------------
   KENAPA ISINYA DITULIS DI BERKAS INI (❌ bukan dibaca dari panduan.md)
   ------------------------------------------------------------
   Sebelum K28h, isi dokumen `.md` ditanam lewat `tools/siapkan-dokumen.js`
   karena `fetch()` diblokir di `file://`. Sejak menu `[Doc]` dihapus
   (K28h), data dokumen **tidak lagi** ikut ke `ANodes-1berkas.html`
   (hemat 2,29 MB). Jadi teks bantuan ditulis **langsung** di sini.

   ⚠️ `panduan.md` tetap ada untuk pembaca berkas — isinya lebih panjang.
      Berkas ini = versi ringkas yang bisa dibaca di dalam aplikasi.

   ------------------------------------------------------------
   ATURAN YANG DIJAGA
   ------------------------------------------------------------
   1. ❌ JANGAN menulis “Bapak” di teks yang tampil (aturan K48) — pakai “Anda”.
   2. Tombol `[?]` ada di **kepala** (dekat 🗂️ Berkas) ⇒ berlaku untuk SEMUA
      halaman, ❌ tidak menambah tombol di tiap navbar (navbar Alkitab sudah penuh:
      9 tombol, terukur 324 = 324 px).
   3. Halaman yang terbuka dideteksi dari `.app` yang **tidak** `hidden`
      (pola sama seperti `tutupHalaman()` milik plugin Alkitab).
   4. `Esc` menutup bantuan. Modal memakai kelas `.buka` (❌ bukan atribut
      `hidden` — pelajaran berulang sejak K77).
   ============================================================ */

window.ANodesBantuan = (function () {
  'use strict';

  const VERSI = 'v6Nov-c';

  // ------------------------------------------------------------
  // daftar halaman → id elemen + kunci bantuan
  // ------------------------------------------------------------
  const HALAMAN = [
    ['baca-alkitab',        'alkitab'],
    ['kerja-ayat',          'kerja'],
    ['kamus-halaman',       'kamus'],
    ['penguat-halaman',     'penguat'],
    ['sejarah-halaman',     'sejarah'],
    ['peta-halaman',        'peta'],
    ['bookmark-halaman',    'bookmark'],
    ['baca1tahun-halaman',  'baca1tahun'],
    ['berkas-halaman',      'berkas'],
        ['linimasa-halaman',    'linimasa'],
      ];

  // ============================================================
  // BAHAN TULISAN
  // ============================================================
  const h  = (t) => '<h4 class="bt-h">' + t + '</h4>';
  const p  = (t) => '<p class="bt-p">' + t + '</p>';
  const ul = (a) => '<ul class="bt-ul">' + a.map(x => '<li>' + x + '</li>').join('') + '</ul>';
  const kv = (a) => '<table class="bt-tb">' + a.map(r => '<tr><th>' + r[0] + '</th><td>' + r[1] + '</td></tr>').join('') + '</table>';
  const cat = (t) => '<p class="bt-cat">' + t + '</p>';

  // ------------------------------------------------------------
  // 📝 CATATAN — semua fitur & menu
  // ------------------------------------------------------------
  function isiCatatan() {
    return (
      cat('Anda sedang di <b>catatan</b> — tempat menulis. Semua yang Anda ketik tersimpan sendiri.')

      + h('✍️ Menulis')
      + ul([
        'Klik di area putih, lalu **ketik biasa**. Catatan **tersimpan sendiri** setiap ±0,7 detik.',
        'Titik di kepala: <b style="color:#c9a227">kuning</b> = belum tersimpan · <b style="color:#2e7d32">hijau</b> = sudah tersimpan.',
        'Judul catatan diambil <b>otomatis</b> dari baris pertama (maks 60 huruf).',
        '`Ctrl+S` = simpan sekarang. `Ctrl+B` atau `Esc` = kembali dari halaman plugin ke catatan.',
      ])

      + h('🧰 Toolbar tulis (tingkat 3)')
      + kv([
        ['`H1` `H2` `H3` `¶`', 'judul besar / sedang / kecil · paragraf biasa'],
        ['`•` · `1.` · `✅`', 'daftar titik · daftar nomor · daftar ikon'],
        ['`B` `I`', 'tebal · miring'],
        ['`▦`', 'sisip tabel 3×3 · edit tabel (tambah/hapus baris & kolom)'],
        ['`▬`', 'stabilo 5 warna'],
        ['`A`', 'warna huruf 6 pilihan'],
        ['`✕`', 'hapus warna / format'],
        ['`✅`', '28 ikon untuk bullet'],
        ['`🧩`', 'daftar plugin yang sudah terpasang (klik = buka)'],
        ['`↶` `↷`', 'batal · ulangi (`Ctrl+Z` · `Ctrl+Y`)'],
      ])
      + p('Ketik cepat: `# ` → judul · `## ` → sub-judul · `### ` → sub-sub · `- ` → daftar titik · `1. ` → daftar nomor.')
            + p('<b>Toolbar tulis selalu tampil.</b> Deretan tombol alat tulis (<b>H1 · B · I · ▬ · ✅</b> dan seterusnya) <b>tidak bisa disembunyikan</b> — jadi menu tidak akan pernah hilang. Tombol <b>▦ Tulis</b> yang dulu ada di kepala sudah dihapus.')

      + h('📂 Menu File')
      + ul([
        '`＋ New` — catatan baru · `💾 Save` — simpan sekarang · `🗑 Del` — hapus catatan',
        '`⤒ Impor…` — buka berkas `.md`, `.txt`, atau `.json` (cadangan)',
        '`⤓ Ekspor .md` / `.txt` / `.pdf` — simpan catatan ke berkas (PDF lewat jendela cetak browser)',
        '`⤓ Cadangan .json` — semua catatan sekaligus (untuk pindah PC ⇄ HP)',
        '`☁️ Sinkron…` — samakan catatan antar perangkat (lihat halaman ☁️ Sinkron)',
        '`📂 Open` — tampilkan daftar catatan (juga kotak cari antar-catatan & saring kategori)',
      ])

      + h('🔍 Mencari')
      + ul([
        '**🔍 Cari** di kepala = mencari kata **di dalam catatan yang sedang dibuka** (`Ctrl+F`).',
        'Hasil ditandai **kuning** (isi tidak diubah). `Enter` = berikutnya · `Shift+Enter` = sebelumnya · `Esc` = bersih.',
        'Mencari **antar catatan** ada di panel daftar: `File ▼ → 📂 Open`.',
      ])

      + h('📚 Istilah & 📖 ayat — dua hal berbeda')
      + ul([
        '<b>Kata bergaris putus</b> (mis. <u>taurat</u>) = istilah kamus. Klik → halaman arti.',
        '<b>Kata biru bergaris titik</b> (mis. <b style="color:#1565c0">Yohanes 3:16</b>) = rujukan ayat. Klik → halaman baca Alkitab.',
        'Tombol <b>🖊</b> kecil di sebelah tautan ayat = buka/menutup penguat ayat itu.',
        'Tombol <b>🔗</b> = daftar ayat terkait ayat itu.',
        'Bila Anda mengetik dan tautan belum muncul, tunggu ±1 detik — penandaan berjalan otomatis.',
      ])

      + h('🔗 Sakelar ON/OFF penandaan')
      + p('Di bar info ada tombol <b>🔗 OFF / ON</b>. Saat <b>OFF</b> (bawaan) catatan bebas dari garis & tautan — menulis paling ringan. Saat <b>ON</b> semua penandaan hidup sekaligus.')

      + h('📎 Mengirim ayat ke catatan')
      + ul([
        'Buka ayat di Alkitab → <b>klik nomor ayatnya</b> di sisi kiri.',
        'Bar pilihan muncul: pilih beberapa nomor (berurutan) → <b>📋 Simpan</b>.',
        'Kembali ke catatan → letakkan kursor di tempat yang diinginkan → <b>Tempel ⇩</b>.',
        'Pilihan <b>💬 Kalimat</b> = ikut bunyi ayat · <b>📖</b> = nama panjang ⇄ singkat.',
      ])

      + h('⚙ Setelan & perlengkapan')
      + ul([
        '`⚙` — jenis huruf, ukuran huruf 12–24, kecerahan, dan 9 pintasan keyboard yang bisa Anda ubah sendiri.',
        '`🧩` — gudang plugin (pasang / lepas). Plugin yang dilepas **tidak** menyentuh catatan Anda.',
        '`▦` (di toolbar) — sisip tabel 3×3 · edit tabel (tambah/hapus baris & kolom).',
        '**Toolbar tulis selalu tampil** — tidak ada tombol untuk menyembunyikannya, jadi deretan menu ini tidak akan pernah hilang.',
        '`🗂️ Berkas` — daftar rantai 🌿 Ayat Terkait yang pernah Anda simpan.',
      ])

      + h('☁️ Sinkron & banyak pemakai')
      + ul([
        'Buka `File ▼ → ☁️ Sinkron…` lalu tekan <b>☁️ Sinkron sekarang</b>. Tidak ada yang perlu diisi.',
        'Bila dipakai beberapa orang, tiap orang memakai **email sendiri** saat pertama membuka ANodes — data tiap email terpisah.',
        'Ganti email lewat `File ▼ → 👤 Pengguna…`.',
      ])

      + h('💡 Bila ada yang aneh')
      + ul([
        'Tautan tidak muncul → tekan `🔗` supaya ON, atau tunggu ±1 detik.',
        'Tampilan tidak berubah setelah diperbarui → pastikan membuka berkas yang benar (`ANodes-1berkas.html` untuk HP), lalu `Ctrl+Shift+R`.',
        'Data hilang → periksa `File ▼ → 📂 Open`, dan pastikan email yang aktif sama.',
      ])
    );
  }

  // ------------------------------------------------------------
  // 📖 ALKITAB
  // ------------------------------------------------------------
  function isiAlkitab() {
    return (
      cat('Anda sedang di <b>halaman baca Alkitab</b>. Menu terdiri dari <b>2 baris</b> yang tidak ikut tergulir.')

      + h('🧭 Baris 1 — pindah tempat')
      + kv([
        ['`🏠`', 'kembali ke catatan — tepat di kata/ayat yang tadi Anda klik'],
        ['`[ Kitab ▾ ]`', 'ganti kitab (pintu ke-1). Selalu mulai dari pasal 1'],
        ['`📋 PILIH`', 'pilih kitab → pasal → ayat lewat kisi (pintu ke-2)'],
        ['`🔍 Cari`', 'cari nama ayat <b>atau</b> kata/kutipan di seluruh Alkitab'],
        ['`📤`', 'kirim ayat terpilih ke catatan'],
        ['`🖊`', 'buka/tutup SEMUA penguat pasal ini sekaligus'],
      ])

      + h('📖 Baris 2 — judul + pindah pasal')
      + p('Baris ini <b>sekaligus judul</b>: nama kitab · nomor pasal · `◀` `▶` · `↩` (kembali ke posisi sebelumnya, 30 langkah) · “n ayat” di ujung kanan.')

      + h('🖱️ Mengklik ayat')
      + ul([
        'Klik <b>nomor ayat</b> = memilih ayat. Klik nomor lain yang berurutan = jadi rentang.',
        'Klik nomor yang sama lagi = melepas pilihan.',
        'Saat ada pilihan, muncul bar: `[ Mat 4:4-6 ]` · `💬 Kalimat` · `📖 nama` · `📋 Simpan` · `✕`.',
        '`📋 Simpan` menaruh ayat di “tangan” Anda — belum menempel. Kembali ke catatan, tentukan letak, lalu `Tempel ⇩`.',
        'Pilihan **lompat** (mis. 24 lalu 26) otomatis menjadi **dua** bookmark/dua bagian — bukan satu rentang palsu.',
      ])

      + h('🔍 3 cara mencari')
      + ul([
        '<b>Pilih dari daftar</b> — tombol `📋 PILIH`.',
        '<b>Ketik nama ayat</b> — mis. `ibr 11:1`, `why 22:21`. Salah tulis sedikit masih dikenali (±1–2 huruf).',
        '<b>Kata / kutipan</b> — mis. `kasih` atau potongan kalimat; hasil dikelompokkan per kitab.',
        'Bila hasil kosong, ANodes menawarkan **saran kata mirip** dan menampilkan **🕘 riwayat cari** (bisa dihapus).',
        'Saringan `Semua / PL / PB` ada di halaman hasil.',
      ])

      + h('🔙 Kembali — 3 tujuan berbeda')
      + ul([
        '`🏠` dari halaman baca → **catatan**, tepat di tempat Anda mengklik.',
        '`🏠` setelah mencari → kembali ke **bacaan sebelum mencari**; tekan `🏠` sekali lagi baru ke catatan.',
        '`🏠` setelah membuka ayat lewat [Full] di pratinjau → kembali ke **bacaan sebelumnya**.',
      ])

      + h('🧩 Yang ditambahkan plugin (bila terpasang)')
      + ul([
        '`🔀` **Paralel Terjemahan** — tampilkan TB ⇄ AYT berdampingan per ayat.',
        '`🔖` **Bookmark Ayat** — tombol pintu ke halaman daftar bookmark.',
        'Judul **Perikop** — tampil otomatis di atas ayatnya (nyala/mati di halaman keterangan plugin).',
        'Tombol `📍` di ayat — kata tempat ⇒ mini-peta + keterangan.',
        'Tombol `🔗` di ayat — daftar ayat terkait (bila plugin 🌿 Ayat Terkait terpasang).',
        'Tanda `🔖` kecil di ujung baris ayat = ayat itu sudah dibookmark.',
      ])

      + p('Catatan: halaman ini <b>tidak</b> mengubah catatan Anda. Tekan `🏠` kapan pun untuk kembali.')
    );
  }

  // ------------------------------------------------------------
  // 🌿 HALAMAN KERJA AYAT TERKAIT
  // ------------------------------------------------------------
  function isiKerja() {
    return (
      cat('Halaman <b>kerja</b> = meja menyusun rantai ayat. Di sini Anda menelusuri ayat demi ayat, lalu menyimpannya sebagai satu berkas.')

      + h('🧭 Tombol')
      + kv([
        ['`🏠`', 'keluar ke halaman baca (rantai tersimpan otomatis)'],
        ['`📥 Pakai`', 'kirim isi rantai ke catatan'],
        ['`🗑 Buang`', 'kosongkan meja kerja <b>dan</b> hapus dari daftar simpanan (ditanya dulu)'],
        ['`⬆`', 'kembali ke akar rantai (paling atas)'],
      ])

      + h('➡️ Cara menyusun rantai')
      + ul([
        'Dari halaman baca, klik `🔗 ayat terkait (n)` pada satu ayat.',
        'Klik salah satu chip → muncul <b>pratinjau</b> (belum permanen, hanya satu kotak bergantian).',
        'Tekan **`✓ pilih`** → ayat itu menjadi **blok tetap** di bawahnya, dan Anda <b>pindah ke halaman kerja ini</b>.',
        'Di dalam blok ada chip lanjutan — klik lagi untuk menelusuri lebih dalam. Tiap `✓ pilih` menambah satu blok.',
        'Label jejak di atas blok menunjukkan jalan yang sudah Anda tempuh (mis. `Roma 4:3, Kejadian 15:6, …`).',
        'Chip di dalam pratinjau yang berwarna **abu-abu** sengaja tidak bisa diklik — supaya Anda tidak melompati ayat perantara.',
      ])

      + h('🗂️ Menyimpan')
      + ul([
        'Rantai **tersimpan sendiri** (tertunda ±0,9 detik), dan langsung saat kedalaman lebih dari 3 turunan.',
        'Nama berkas = ayat utama; bisa Anda ganti menjadi judul lewat kotak nama di kepala.',
        'Daftar semua berkas tersimpan ada di halaman **🗂️ Berkas** (tombol di kepala aplikasi).',
      ])

      + h('✂️ Menghapus')
      + ul([
        'Tombol `✕` di sebuah blok menanyakan konfirmasi **dua langkah**, lalu menghapus ayat itu **beserta seluruh cabang di bawahnya**.',
        'Tidak ada mode “edit” — rantai disusun ulang dengan cara menghapus lalu menambah.',
        'Menghapus blok **tidak** menyentuh catatan Anda.',
      ])

      + h('🕒 Riwayat jalur')
      + p('Panel riwayat mencatat tiap `✓ pilih`. Tombol `✕` di kepalanya <b>hanya</b> membersihkan catatan jalan (navigasi) — <b>tidak</b> menghapus ayat atau berkas.')

      + h('👥 Mode grup')
      + p('Kalau Anda memilih beberapa ayat di halaman baca <b>lalu</b> menekan salah satu tombol `🔗`, semua ayat itu diikat menjadi satu grup. Di halaman kerja muncul baris nomor `[2] [3] [4]` — klik nomornya untuk berganti-ganti, dan bunyi ayat yang aktif tampil di bawahnya. Nama kitab ditulis <b>singkat</b> (mis. `Kej 12:12-13`) supaya hemat tempat.')
    );
  }

  // ------------------------------------------------------------
  // 📚 KAMUS ISTILAH
  // ------------------------------------------------------------
  function isiKamus() {
    return (
      cat('Kamus ini menjelaskan <b>istilah</b> Alkitab (nama orang, tempat, benda, jabatan, hari raya, ukuran) — bukan kamus bahasa sehari-hari.')

      + h('🧭 Tombol')
      + kv([
        ['`🏠`', 'kembali ke catatan — gulir ke kata yang tadi diklik & sorot kuning ±4 detik'],
        ['`↩`', 'kembali ke istilah sebelumnya (riwayat 30 langkah)'],
        ['`📋 Daftar`', 'daftar semua istilah + kotak cari'],
        ['`🔍 Cari`', 'cari istilah dari mana saja'],
      ])

      + h('🧩 Kolom berlevel (cara paling khas)')
      + ul([
        'Klik satu istilah (di catatan, di Alkitab, atau di dalam keterangan) → keterangannya muncul di **kolom** di bawah tempat Anda berada.',
        'Klik istilah lain **di dalam** keterangan itu → kolom **baru** muncul **di bawahnya**. Jadi bisa bertingkat: level 1 → level 2 → level 3.',
        'Setiap kolom diberi tanda **“Tingkat n”** supaya Anda tahu sedang di kedalaman berapa.',
        'Klik istilah lain pada **tingkat yang sama** → kolom tingkat itu **diganti**; tingkat di bawahnya ikut dibuang.',
        'Kolom **selalu selebar layar** — tipis di kiri supaya ruang baca tetap luas.',
      ])

      + h('📖 Bagian di tiap kolom')
      + ul([
        '① <b>Keterangan</b> — arti & penjelasan (bisa panjang, silakan digulir).',
        '② <b>Istilah lain</b> — istilah yang disebut di dalam keterangan; bisa diklik untuk berantai.',
        '③ <b>📖 Ayatnya</b> — chip ayat. Klik satu chip → ayatnya tampil di **kolom yang sama** (bergantian, bukan menumpuk).',
        'Tombol **`[↗ full]`** di samping chip → lompat ke halaman baca Alkitab pada ayat itu; tombol kembali di sana berubah menjadi `📚` untuk melompat balik ke kamus dengan istilah yang sama.',
      ])

      + h('📝 Catatan pribadi Anda')
      + p('Di halaman arti ada kolom <b>catatan Anda sendiri</b> (di atas tombol kembali). Isinya <b>terpisah</b> dari keterangan kamus — keterangan bawaan tidak pernah tertimpa. Ada `💾 Simpan catatan` dan `🗑 Kosongkan`.')

      + h('🔎 Mencari istilah')
      + p('Tekan `📋 Daftar` atau `🔍 Cari`, ketik sebagian kata (mis. `taur` → Taurat). Hasil bisa diklik langsung.')

      + h('💡 Mengapa ada kata bergaris putus di catatan?')
      + p('Garis putus = “ini istilah, bisa diklik”. Garis itu <b>tidak pernah tersimpan</b> ke dalam catatan — hanya penanda saat dibaca.')
    );
  }

  // ------------------------------------------------------------
  // 🖊 PENGUAT
  // ------------------------------------------------------------
  function isiPenguat() {
    return (
      cat('Halaman ini menampilkan <b>penguat</b> — penjelasan & penafsiran untuk tiap ayat Alkitab. Isinya sudah lengkap untuk <b>seluruh 66 kitab (31.102 ayat)</b>.')

      + h('🧭 Tombol')
      + kv([
        ['`🏠`', 'kembali ke catatan (Esc / Ctrl+B)'],
        ['`◀` `▶`', 'pasal sebelumnya / berikutnya'],
        ['`🔍 Cari`', 'cari kata di dalam isi penguat'],
        ['`📖`', 'buka pasal yang sama di halaman baca Alkitab'],
      ])

      + h('🧩 Tiga tempat penguat muncul')
      + ul([
        '<b>① Halaman ini</b> — Pembaca Penguat: pilih kitab & pasal, semua penguat pasal itu tampil berurutan.',
        '<b>② Di halaman baca Alkitab</b> — tombol `🖊` di bawah tiap ayat. Satu tekan = <b>seluruh</b> penguat pasal tampil; tekan lagi = seluruhnya tertutup.',
        '<b>③ Di dalam catatan</b> — tombol `🖊` kecil di sebelah tautan ayat. Klik = kotak penguat terbuka di bawah baris itu; klik lagi = tertutup.',
      ])

      + h('📖 Cara memakai halaman ini')
      + ul([
        'Pilih kitab lewat daftar `▾` di bar atas, lalu pilih pasal dengan `◀` `▶` atau daftar pasal.',
        'Baris “Pasal n dari m pasal” menunjukkan posisi Anda — bukan jumlah ayat.',
        'Daftar **“Ayat — klik untuk menuju penguatnya”** memudahkan melompat ke nomor ayat tertentu.',
        'Teks penguat memakai ukuran huruf yang sama dengan ayat Alkitab, dan kotaknya berlatar krem tanpa garis — supaya ruang baca tetap lebar.',
      ])

      + h('🔗 Istilah di dalam penguat')
      + p('Kata istilah di dalam teks penguat <b>bisa diklik</b> → halaman arti. Setelah selesai, `🏠` mengembalikan Anda ke penguat tadi dengan kata itu disorot.')

      + h('🔗 Tautan ayat di dalam penguat')
      + p('Bila teks penguat menyebut rujukan ayat (mis. <i>“bandingkan Mazmur 34:10”</i>), rujukan itu menjadi tautan. Klik → halaman baca pada ayat tujuan; `🏠` → kembali ke halaman penguat pada posisi gulir yang sama.')

      + h('⚙ Mengatur tampilan')
      + p('Buka `🧩 → 🖊 Penguat → halaman keterangan`. Di sana ada pilihan: <b>tombol 🖊 di catatan (bawaan)</b> ⇄ <b>matikan tombol 🖊</b>. Bila dimatikan, catatan bersih dari tombol; halaman baca tetap punya tombolnya sendiri.')
    );
  }

  // ------------------------------------------------------------
  // 📜 SEJARAH
  // ------------------------------------------------------------
  function isiSejarah() {
    return (
      cat('Dua hal berbeda, jangan tertukar: <b>Sejarah Alkitab</b> (prakata — bagaimana Firman menjadi tulisan) dan <b>Sejarah Kitab</b> (latar tiap kitab).')

      + h('🧭 Tombol')
      + kv([
        ['`🏠`', 'kembali ke catatan (Esc / Ctrl+B)'],
        ['`🔍`', 'cari kata di dalam teks sejarah — hasil ditandai kuning'],
      ])

      + h('📜 Sejarah Alkitab (halaman ini)')
      + ul([
        'Teks “Bagaimana Firman menjadi tulisan” — proses penulisan, penyalinan, dan pengkanonan Alkitab.',
        'Di bawahnya ada **66 chip kitab** yang dikelompokkan per kategori (Taurat · Sejarah · Puisi/Hikmat · Nabi Besar · Nabi Kecil · Injil · Surat · Wahyu).',
        'Klik satu chip → langsung ke **pasal 1 kitab itu** di halaman baca.',
      ])

      + h('📖 Sejarah Kitab (per kitab)')
      + ul([
        'Tampil sebagai tombol **`📖 sejarah`** di **pasal 1** tiap kitab pada halaman baca. Klik = panel terbuka; klik lagi = tertutup.',
        'Isi panel berurutan: 🎯 <b>inti kitab</b> (satu kalimat) → 🏷️ penulis · tahun · kategori → 💡 tema utama → 👤 tokoh utama → 📜 sejarah lengkap → 🔑 ayat kunci.',
        'Chip 🔑 <b>ayat kunci bisa diklik</b> → langsung menuju ayat itu.',
      ])

      + h('🔍 Mencari')
      + ul([
        'Ketik kata (mis. `kanon`) lalu `Enter`. Setiap temuan dibungkus tanda kuning.',
        'Tombol `◀` `▶` berpindah antar temuan, penghitung `3/17` menunjukkan posisi.',
        'Tanda kuning **bertahan** sampai Anda menutup pencarian atau mengganti kata — tidak hilang sendiri.',
        '`✕` atau `Esc` membersihkan semua tanda (isi teks tidak berubah).',
      ])

      + h('🔗 Istilah & tautan ayat')
      + p('Di dalam teks sejarah, <b>kata istilah</b> bergaris putus dan <b>rujukan ayat</b> biru bisa diklik. Setelah selesai, `🏠` mengembalikan Anda ke halaman sejarah ini.')
    );
  }

  // ------------------------------------------------------------
  // 🗺️ PETA
  // ------------------------------------------------------------
  function isiPeta() {
    return (
      cat('Peta Alkitab — melihat letak tempat-tempat yang disebut Alkitab di atas citra relief asli.')

      + h('🧭 Tombol')
      + kv([
        ['`🏠`', 'kembali ke catatan'],
        ['`▾` jenis', 'saring menurut jenis: semua · laut · danau · sungai · darat · gunung · daerah · kota · rute'],
        ['`🔍`', 'cari nama tempat (melewati saringan jenis)'],
      ])

      + h('🗺️ Cara pakai')
      + ul([
        'Nyalakan satu atau beberapa **jenis** dulu. Bila semua mati, daftar kosong dan penghitung menulis *“nyalakan jenis dulu”*.',
        'Klik satu nama → peta menggambar wilayahnya + keterangan + daftar rujukan ayat.',
        'Klik salah satu rujukan ayat → isi ayatnya tampil di bawah.',
        'Nama tempat **di dalam peta** bisa diklik langsung.',
        'Kepala dan peta **tetap terlihat** saat daftar digulir.',
      ])

      + h('📍 Kata tempat di halaman baca Alkitab')
      + ul([
        'Di halaman baca, ayat yang menyebut nama tempat mendapat tombol `📍`.',
        'Klik → kolom muncul di bawah ayat itu: mini-peta + keterangan + chip tempat.',
        'Kalau satu ayat menyebut beberapa tempat, chip-nya **bergantian di kolom yang sama** (bukan menumpuk).',
        'Ukuran tulisan nama tempat mengikuti `⚙ Setelan` — jadi bisa diperbesar bila kurang jelas.',
      ])

      + h('💡 Catatan')
      + p('Katalog berisi <b>234 nama</b> tempat dengan 695 rujukan ayat. Nama yang terlalu umum (mis. “dan”, “teman”) sudah diperiksa satu per satu supaya tidak salah tandai.')
    );
  }

  // ------------------------------------------------------------
  // 🔖 BOOKMARK
  // ------------------------------------------------------------
  function isiBookmark() {
    return (
      cat('Bookmark = menandai ayat (atau rentang ayat) supaya mudah dibuka lagi nanti. Bookmark <b>tidak</b> mengubah isi ayat maupun catatan.')

      + h('➕ Menandai')
      + ul([
        'Di halaman baca, klik nomor ayat — beberapa nomor berurutan menjadi satu rentang.',
        'Di bar pilihan ada dua jalur: **`📋 Simpan`** = kirim ke catatan · **`🔖 Bookmark`** = simpan sebagai penanda.',
        'Tekan `🔖 Bookmark` → penanda tersimpan dan Anda langsung pindah ke halaman ini.',
        'Bila pilihan **lompat** (mis. 24 lalu 26), hasilnya **dua** penanda terpisah — bukan satu rentang palsu.',
        'Ayat yang sudah ditandai diberi tanda `🔖` kecil di ujung kanannya. Boleh ditandai lagi untuk topik berbeda.',
      ])

      + h('🧭 Di halaman ini')
      + ul([
        '`🏠` — kembali ke catatan (atau ke halaman baca bila bookmark dibuka dari sana).',
        'Klik **kartu** bookmark → langsung membuka kitab/pasal/ayatnya di halaman baca, dengan ayat-ayatnya disorot.',
        '`📋 Copy` — menyalin teks ayat agar bisa ditempel ke catatan.',
        '`✏️ Edit` — masuk mode edit: pindah ke halaman baca dengan ayat disorot.',
        '`🗑 Hapus` — menghapus satu bookmark (ayatnya tidak berubah).',
      ])

      + h('✏️ Mode edit')
      + ul([
        'Klik ayat lain yang **berurutan** untuk menambah; klik ulang ayat yang sudah terpilih untuk melepas.',
        'Selama mengedit muncul stabilo pada ayat — penanda bahwa Anda sedang mengedit.',
        '`💾 Simpan` menyelesaikan perubahan dan kembali ke halaman ini.',
      ])

      + h('📝 Catatan per bookmark')
      + p('Tiap bookmark bisa diberi satu baris catatan (mis. topiknya). Bookmark ikut tersinkron bila ☁️ Sinkron aktif.')
    );
  }

  // ------------------------------------------------------------
  // 🗓️ BACAAN 1 TAHUN
  // ------------------------------------------------------------
  function isiBaca1Tahun() {
    return (
      cat('Membaca <b>seluruh Alkitab dalam 365 hari</b>. Ketiga rencananya dibuat dari data Alkitab ANodes sendiri ⇒ cakupan pasal <b>100 %</b>.')

      + h('🧭 Tiga rencana')
      + kv([
        ['`🅰️ Berurutan`', 'Kejadian → Wahyu, 28–176 ayat per hari (paling ringan & paling rata)'],
        ['`🅱️ PL + PB`', 'setiap hari dapat porsi Perjanjian Lama <b>dan</b> Perjanjian Baru'],
        ['`⭐ Every Day`', 'PL + PB + Mazmur + Amsal setiap hari (paling banyak variasinya)'],
      ])

      + h('🗓️ Cara pakai')
      + ul([
        'Bagian **Hari ini** menampilkan bacaan hari ini; di bawahnya **Besok** untuk persiapan.',
        'Tiap baris blok punya tombol **`📖`** sendiri — jadi PL dan PB bisa dibuka satu per satu.',
        'Tombol **`○ Tandai sudah dibaca`** menandai hari itu selesai (berubah menjadi `✓ Sudah dibaca`).',
        'Bagian **Kalender** berisi 365 sel. Klik satu sel untuk melihat bacaan hari itu lalu membukanya.',
        'Penghitung di atas menunjukkan **% selesai**, sisa hari, dan **🔥 hari berturut-turut**.',
      ])

      + h('💾 Menyimpan & sinkron')
      + p('Tanda “sudah dibaca” disimpan di perangkat Anda dan ikut tersinkron bila ☁️ Sinkron aktif — jadi kemajuan di PC dan HP bisa menyatu.')

      + h('🔙 Kembali')
      + p('`🏠` mengembalikan Anda ke <b>halaman baca Alkitab</b> (bukan catatan) — karena halaman ini biasanya dibuka dari sana lewat tombol `📅` di navbar.')
    );
  }

  // ------------------------------------------------------------
  // 🗂️ BERKAS TERSIMPAN
  // ------------------------------------------------------------
  function isiBerkas() {
    return (
      cat('Halaman ini berisi daftar <b>berkas rantai 🌿 Ayat Terkait</b> yang pernah Anda simpan di halaman kerja. Catatan Anda tidak tersentuh dari sini.')

      + h('🧭 Tombol')
      + kv([
        ['`🏠`', 'kembali ke catatan'],
        ['`🌿 Kerja`', 'buka halaman kerja untuk menyusun rantai baru'],
        ['`🗑`', 'hapus <b>semua</b> berkas dalam daftar (ditanya dulu; catatan tetap aman)'],
      ])

      + h('📄 Tiap baris berkas')
      + kv([
        ['`🌿 Buka`', 'membuka berkas itu di halaman kerja untuk dilanjutkan'],
        ['`+ Ayat`', 'menaruh isi berkas di “tangan” Anda; kembali ke catatan, tentukan letak, lalu `Tempel ⇩`'],
        ['`🗑`', 'menghapus satu berkas'],
      ])

      + h('💡 Kapan berkas terbentuk?')
      + p('Setiap kali Anda menyusun rantai di halaman kerja, berkasnya <b>tersimpan sendiri</b> dengan nama ayat utamanya (bisa diganti menjadi judul). Daftarnya muncul di sini.')

      + h('📥 Bentuk masukan')
      + p('Sebelum menekan `+ Ayat`, Anda bisa memilih bentuknya: <b>kalimat</b> (ikut bunyi ayat) dan <b>panjang ⇄ singkat</b> untuk nama ayat. Pilihan ini sama dengan yang ada di bar paket pada catatan.')
    );
  }

  // ------------------------------------------------------------
    // 🕒 HALAMAN LINIMASA SEJARAH
  // ------------------------------------------------------------
    function isiLinimasa() {
      return (
        cat('Halaman ini menampilkan <b>sejarah Alkitab sebagai garis waktu</b> — <b>450 peristiwa</b> berurutan menurut tahun, dari Penciptaan (4.003 SM) sampai Paulus di Roma (57 M).')

        + h('🕒 Ini beda dengan 📖 Sejarah Kitab')
        + ul([
          '<b>📖 Sejarah Kitab</b> menerangkan <b>satu kitab</b>: penulis, rentang tahun, tema, tokoh, ayat kunci.',
          '<b>🕒 Linimasa</b> menyusun banyak <b>peristiwa</b> menurut <b>masa</b>, sehingga bisa dibandingkan — mis. nabi mana yang hidup sezaman dengan raja mana.',
        ])

        + h('🧭 Tombol & saringan')
        + kv([
          ['`🏠`', 'kembali ke catatan (atau ke halaman asal kalau Anda datang dari Alkitab)'],
          ['`Semua`', 'tampilkan seluruh 450 peristiwa'],
          ['Tombol zaman', 'menyaring satu zaman — mis. “Kerajaan terpecah (81)” · tekan lagi untuk membatalkan'],
          ['`🔍 Cari peristiwa…`', 'menyaring menurut kata: judul & bagian besar'],
        ])

        + h('📄 Membaca satu peristiwa')
        + ul([
          '<b>Tahun</b> di kiri (biru) — <b>SM</b> = sebelum Masehi, <b>M</b> = Masehi.',
          '<b>Judul</b> peristiwa dalam bahasa Indonesia.',
          '<b>↳ Bagian besar</b> — mis. “Kerajaan Utara (Israel)”, “Perjalanan misi kedua”.',
          '<b>Chip ayat</b> (hijau) — klik ⇒ Alkitab terbuka pada ayat itu.',
        ])

        + h('📖 Chip ayat')
        + p('Tiap peristiwa punya rujukan ayat. Supaya tidak memanjang, yang ditampilkan <b>6 ayat pertama</b>; sisanya muncul sebagai tulisan <b>+n ayat</b>. Klik chip mana pun ⇒ halaman baca Alkitab terbuka di ayat itu, dan <b>ayatnya disorot</b>.')

        + h('🔙 Kembali dari Alkitab')
        + p('Sesudah membaca di Alkitab, tekan `🏠` ⇒ Anda kembali ke <b>halaman Linimasa</b> dengan saringan yang tadi. Tekan `🏠` lagi ⇒ baru ke catatan.')

        + h('⚠️ Yang perlu diketahui')
        + ul([
          'Tahunnya <b>perkiraan</b> dari sumber (kronologi konservatif) — Alkitab sendiri tidak menyebut tahun.',
          'Judul sudah diterjemahkan ke bahasa Indonesia; <b>nama orang & tempat</b> di dalamnya mengikuti ejaan sumber (Inggris).',
          'Sumber: <b>Theographic Bible Metadata</b> · CC-BY-SA-4.0 — keterangannya tampil di kaki halaman.',
          'Tidak mengubah catatan Anda sama sekali.',
        ])
      );
    }

    // ------------------------------------------------------------
    // 🧩 HALAMAN KETERANGAN PLUGIN — hanya TUJUAN
    // ------------------------------------------------------------
  function isiPlugin() {
    return (
      cat('Anda sedang di <b>halaman keterangan sebuah plugin</b>. Bagian ini hanya menerangkan <b>tujuan</b> plugin itu.')

      + h('🧩 Apa itu plugin di ANodes?')
      + ul([
        'Plugin = tambahan yang bisa <b>dipasang</b> dan <b>dilepas</b> kapan saja.',
        'Melepas plugin <b>hanya</b> membuang tampilannya — <b>catatan Anda tetap utuh</b>.',
        'Data besar tiap plugin disimpan terpisah (IndexedDB), jadi tidak memenuhi ruang catatan.',
      ])

      + h('📖 Isi halaman ini')
      + kv([
        ['Angka ringkas', 'besar datanya (mis. jumlah ayat / istilah / kaitan)'],
        ['Fitur', 'apa yang bisa Anda lakukan setelah plugin dipasang'],
        ['Cara pakai', 'langkah singkat — berurutan'],
        ['Catatan', 'hal yang perlu diketahui sebelum memasang'],
        ['Pilihan tampilan', 'beberapa plugin punya sakelar ON/OFF di sini'],
      ])

      + h('🔘 Tombol')
      + ul([
        '`⬇ Pasang` — memasang plugin.',
        '`🗑 Lepas plugin` — melepasnya (tampilan hilang, catatan aman).',
        '`▶ Buka` — langsung membuka halaman plugin.',
      ])

      + p('Untuk penjelasan tiap halaman secara rinci, tekan `[?]` saat Anda <b>berada di halaman itu</b> — isinya menyesuaikan.')
    );
  }

  // ============================================================
  // mesin
  // ============================================================
  const ISI = {
    catatan: isiCatatan,
    alkitab: isiAlkitab,
    kerja: isiKerja,
    kamus: isiKamus,
    penguat: isiPenguat,
    sejarah: isiSejarah,
    peta: isiPeta,
    bookmark: isiBookmark,
    baca1tahun: isiBaca1Tahun,
    berkas: isiBerkas,
        linimasa: isiLinimasa,
        plugin: isiPlugin,
      };

  const JUDUL = {
    catatan: '📝 Bantuan — Catatan',
    alkitab: '📖 Bantuan — Membaca Alkitab',
    kerja: '🌿 Bantuan — Halaman Kerja Ayat Terkait',
    kamus: '📚 Bantuan — Kamus Istilah',
    penguat: '🖊 Bantuan — Penguat',
    sejarah: '📜 Bantuan — Sejarah',
    peta: '🗺️ Bantuan — Peta Alkitab',
    bookmark: '🔖 Bantuan — Bookmark Ayat',
    baca1tahun: '🗓️ Bantuan — Bacaan 1 Tahun',
    berkas: '🗂️ Bantuan — Berkas Tersimpan',
        linimasa: '🕒 Bantuan — Linimasa Sejarah',
        plugin: '🧩 Bantuan — Tentang Plugin',
      };

  // ------------------------------------------------------------
  // halaman mana yang sedang tampil?
  // ------------------------------------------------------------
  function halamanSekarang() {
    // halaman keterangan plugin = modal gudang plugin sedang terbuka
    const mp = document.getElementById('modal-plugin');
    if (mp && mp.classList.contains('buka')) return 'plugin';

    for (const [id, kunci] of HALAMAN) {
      const el = document.getElementById(id);
      if (el && !el.hidden) return kunci;
    }
    return 'catatan';
  }

  // ------------------------------------------------------------
  // modal
  // ------------------------------------------------------------
  function elModal() { return document.getElementById('modal-bantuan'); }

  function buatModal() {
    let m = elModal();
    if (m) return m;
    m = document.createElement('div');
    m.className = 'modal-bg';
    m.id = 'modal-bantuan';
    m.innerHTML =
      '<div class="modal">' +
        '<div class="m-kepala">' +
          '<span id="bp-judul">❓ Bantuan</span><span class="sp"></span>' +
          '<button id="bp-tt" title="Tutup (Esc)">✕</button>' +
        '</div>' +
        '<div class="m-isi" id="bp-isi"></div>' +
        '<div class="m-kaki">' +
          '<button class="batal" id="bp-tutup">Tutup</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(m);

    m.querySelector('#bp-tt').addEventListener('click', tutup);
    m.querySelector('#bp-tutup').addEventListener('click', tutup);
    // klik latar = tutup (pola sama modal lain)
    m.addEventListener('click', (e) => { if (e.target === m) tutup(); });
    return m;
  }

  function buka(kunci) {
      const k = ISI[kunci] ? kunci : halamanSekarang();
    const m = buatModal();
    const judul = document.getElementById('bp-judul');
    const isi = document.getElementById('bp-isi');
    if (judul) judul.textContent = JUDUL[k] || '❓ Bantuan';
    if (isi) isi.innerHTML = ISI[k]();
    m.classList.add('buka');
    // selalu mulai dari atas
    if (isi) isi.scrollTop = 0;
    m.dataset.halaman = k;
    return k;
  }

  function tutup() {
    const m = elModal();
    if (m) m.classList.remove('buka');
  }

  function terbuka() {
    const m = elModal();
    return !!(m && m.classList.contains('buka'));
  }

  function sakelar() {
    if (terbuka()) { tutup(); return null; }
    return buka(halamanSekarang());
  }

  // ------------------------------------------------------------
  // pemasangan
  // ------------------------------------------------------------
  function pasangPengait() {
    const btn = document.getElementById('btn-bantuan');
    if (btn && !btn.dataset.siap) {
      btn.dataset.siap = '1';
      btn.addEventListener('click', (e) => { e.preventDefault(); sakelar(); });
    }

    if (!document.body.dataset.siapBantuanEsc) {
      document.body.dataset.siapBantuanEsc = '1';
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && terbuka()) {
          e.preventDefault();
          e.stopPropagation();
          tutup();
        }
      }, true);

      // pindah halaman ⇒ bantuan yang sedang terbuka ditutup
      // (supaya isinya tidak tertinggal untuk halaman yang berbeda)
      const tutupBilaPindah = () => { if (terbuka()) tutup(); };
      document.addEventListener('click', (e) => {
        const t = e.target.closest && e.target.closest(
          '#baca-kembali, #kamus-kembali, #pg-kembali, #sj-kembali, #bm-kembali, ' +
          '#bt-kembali, #bk-kembali, #kerja-keluar, #btn-berkas, #btn-plugin');
        if (t) tutupBilaPindah();
      }, true);
    }
  }

  function siapkanOtomatis() {
    pasangPengait();
    // tombol bisa muncul belakangan (berkas dimuat setelah DOMContentLoaded)
    if (!document.getElementById('btn-bantuan')) {
      setTimeout(pasangPengait, 300);
      setTimeout(pasangPengait, 1200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', siapkanOtomatis);
  } else {
    setTimeout(siapkanOtomatis, 0);
  }

  return {
    versi: () => VERSI,
    buka,
    tutup,
    terbuka,
    sakelar,
    halamanSekarang,
    isi: (k) => (ISI[k] ? ISI[k]() : ''),
    daftarHalaman: () => Object.keys(ISI),
        judulHalaman: (k) => JUDUL[k] || ('Bantuan — ' + k),
        siapkanOtomatis,
      };
})();