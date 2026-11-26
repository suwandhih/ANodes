# 🧩 prompt.md — Blueprint Bangun Ulang ANodes 100% Sama

> 🔄 **K106 (24 Nov 2026, koreksi):** setelah impor menolak ZIP HTML besar (`Component source exceeds the safe discovery limit`), ZIP `artifacts/ANodes-server-html-20261124.zip` diganti menjadi paket 54 berkas kode sumber (index.html + css/js/plugin, tanpa data hasil generasi). Ukuran ZIP 415.436 byte. `ANodes-1berkas.html`, data plugin, APK/native, lab, dan tools tidak disertakan. Paket untuk impor sumber, **tidak bisa menjalankan aplikasi utuh tanpa membangkitkan kembali data runtime**.

> 🔄 **K105 (13 Nov 2026):** jembatan HTTP Android kini asinkron (`httpKirimAsync` + callback dengan ID unik); jawaban jaringan tidak lagi menahan JavaScript. Urutan sinkron dan plugin dipertahankan. Uji sasaran K105: 9 lulus, 0 gagal, 3,8 detik; APK versionCode 32 aset identik, emulator offline membuka Alkitab 31 ayat. Penyebab dan hasil pada HP 4G serta seluruh plugin belum terbukti. Mode uji dinyalakan sebelum halaman dimuat supaya uji tidak menghubungi server asli.

> File ini untuk AI mana pun agar bisa membangun ulang ANodes **persis sama**.
> Lokasi proyek: `C:\data\ANodes` · **Update: 6 November 2026 (kasus terakhir: K104 SELESAI — 🧰 toolbar tulis SELALU tampil, tombol ▦ Tulis dihapus)**
> · berkas HP `ANodes-1berkas.html` **38,97 MB** · **11 halaman** · **12 plugin** · **UJI: `node tools/uji-sasaran.js <NAMA>`** (hanya blok itu · ±10 dtk) — ⚠️ `tools/uji-chrome.js --blok` **DITOLAK** oleh pagar (K94) · uji menyeluruh hanya bila diminta · **BUKTI:** `node tools/cek-cara-uji.js`
> · **APK: `node tools/cek-apk.js`** (memeriksa aset di dalam APK vs sumber · `exit 1` kalau tertinggal)
>
> ✅ **6 Nov 2026 — K104 SELESAI: 🧰 TOOLBAR TULIS SELALU TAMPIL — TOMBOL ▦ Tulis DIHAPUS.**
> Pemilik proyek: *"iy benar.. kalau begitu tombol **▦ Tulis** di hilang kan .. dan deretan menu
> jangan hide.. selalu tampil saja"*.
> 💡 **Maksudnya:** K103 hanya **jalan pulang** — akarnya belum dibuang. Sekarang akarnya
> **dibuang**: toolbar **tidak bisa disembunyikan lagi** ⇒ cacat "menu hilang" **mustahil** terjadi.
> **⚙️:** `js/plugin.js` — `bar.siap` **selalu** `'1'` · `terapkanBar()` **tidak pernah**
> menyembunyikan `#toolbar` (**26 → 6 baris**) · `bacaBar()` **menimpa** nilai lama
> `{siap:"0"}` jadi `{siap:"1"}` ⇒ perangkat yang terlanjur kena **SEMBUH SENDIRI** ·
> kunci usang `anodes-toolbar` dibersihkan · `stripPemulih()` + pengait tombol ▦ **dibuang** ·
> `index.html` tombol `#btn-toolbar` **DIHAPUS** · `css/app.css` blok `.bar-pulih`
> (**2 tempat**) dibuang · `js/bantuan.js` "toolbar **selalu tampil**" · penanda
> **`v6Nov-b` → `v6Nov-c`** · APK **`versionCode 31`**.
> **📊 HASIL (APK `versionCode 31`, 412 px):** tombol ▦ **TIDAK ADA** · strip **TIDAK ADA** ·
> toolbar **TAMPIL 88,8 px** (12 tombol) · kepala **6 tombol** · nilai lama `{siap:"0"}` + buka ulang
> ⇒ `anodes-bar` jadi **`{siap:"1"}`** & toolbar **tetap 88,8 px** · `terapkanBar("0")` pun
> **tidak menyembunyikan** · bar paket K20 muncul **DI ATAS** toolbar (editor 513,2 → 474,4 px,
> keduanya tampil) · `anodes-toolbar` = **null**.
> **🧪** `K104` **28 · 0 · 4,3 dtk** · `--sentuh --lebar 344` **28 · 0 · 4,3 dtk** ·
> `--berkas ANodes-1berkas.html` **28 · 0 · 4,0 dtk** · `K104,K64` **62 · 0 · 6,2 dtk** ·
> `K102` **18 · 0 · 4,1 dtk** · `K28h` **42 · 0 · 20,5 dtk**.
> **📦** HP **40.861.048 byte (38,97 MB)** · APK **34.233.823 byte (32,65 MB)** ·
> SHA-256 `45799E8E…45505C` · `versionCode 31` / `2.0.0-webview-k104` · aset **byte-identik** ✅.
> **⚠️ PELAJARAN:** (a) **kalau sebuah fitur menyembunyikan hal penting & tidak ada jalan pulang,
> HAPUS fiturnya** — ❌ jangan hanya menambah tombol pemulih; (b) **nilai `localStorage` lama WAJIB
> ditimpa saat versi baru dibuka**, kalau tidak perangkat yang sudah kena **tetap rusak**;
> (c) **setelah memotong blok CSS berdasarkan nomor baris, periksa kurung kurawal seimbang**
> (pemotongan meninggalkan komentar menggantung + `}` berlebih).
> Rincian: `agents.md` **0a00d9y-u** · bukti `artifacts/k104-menu-selalu-tampil.png`.
>
> ✅ **6 Nov 2026 — K103 SELESAI: 🧰 TOOLBAR TULIS HILANG ⇒ SEKARANG ADA JALAN PULANG (STRIP PEMULIH).**
> Pemilik proyek (Samsung Z Flip 3): *"di catatan 2 kolom menu belum tampil yg tampil kategori
> umum on off · menu dibawa tidak ada .. untuk samsung z flip 3 · untuk samsung note 8 ada"*.
> 🔎 **Diukur dulu DI APK NYATA** ⇒ **sebab TUNGGAL (bukan tata letak):**
> `localStorage['anodes-bar']` = **{"siap":"0"}** ⇒ `#toolbar.hidden = true`,
> `display:none`, tinggi **0 px**, `#editor` melebar **627 px** ⇒ tampilan **PERSIS**
> seperti tangkapan layar; di **Note 8** nilainya **{"siap":"1"}** ⇒ toolbar **88,8 px** tampil.
> Nilai itu **bertahan** sesudah aplikasi ditutup & satu-satunya jalan pulang hanya tombol
> **▦ Tulis** (paling kiri di kepala) yang **tidak pernah disebut** di Bantuan.
> **⚙️:** `js/plugin.js` ➕ **`stripPemulih(tampil)`** · **`baris()`** · **`tampilkanBar()`**
> (dipanggil di akhir `terapkanBar()`) · `css/app.css` blok **`.bar-pulih`**
> (tombol **44 px** di `(pointer: coarse), (hover: none)`) · `js/bantuan.js`
> menjelaskan **▦ Tulis** + strip (`VERSI` → **`v6Nov-b`**) · penanda halaman
> **`v6Nov-a` → `v6Nov-b`**.
> **📊 HASIL (diukur di APK `versionCode 30`, 412 px):** `siap=1` ⇒ toolbar **88,8 px** ·
> `siap=0` ⇒ strip `#bar-pulih` **52,8 px** + tombol `[Tampilkan]` **44 px**
> `cursor: pointer` · tekan `[Tampilkan]` ⇒ toolbar **HIDUP 88,8 px**, strip **HILANG**,
> `anodes-bar` → **{"siap":"1"}** · **buka ulang aplikasi ⇒ toolbar TETAP tampil** ·
> strip **tidak muncul** saat bar paket ayat · catatan **tidak tersentuh**.
> **🧪** `uji-sasaran K103` **28 uji · 0 gagal · 4,6 dtk** · `--sentuh --lebar 344` **28 · 0 · 4,6 dtk** ·
> `--berkas ANodes-1berkas.html` **28 · 0 · 4,0 dtk**.
> **📦** HP **40.864.734 byte (38,97 MB)** · APK **34.235.699 byte (32,65 MB)** ·
> SHA-256 `3511D767…3C7B` · `versionCode 30` / `2.0.0-webview-k103` · aset **byte-identik** ✅.
> **⚠️ PELAJARAN:** (a) **sakelar tampilan di `localStorage` WAJIB punya jalan pulang yang
> TERLIHAT** — kalau tidak, fitur hilang **selamanya**; (b) **keluhan "ada di HP A, tidak ada di HP B"
> hampir selalu `localStorage`, bukan tata letak** — periksa kuncinya **SEBELUM** menyentuh CSS;
> (c) cacat begini **hanya ketemu** dengan mengukur **keadaan data** di APK nyata.
> Rincian: `agents.md` **0a00d9y-t** · bukti `artifacts/k103-strip-pemulih.png`.
>
> ✅ **6 Nov 2026 — K102 SELESAI: 📱 TATA LETAK DI HP NYATA (BAR INFO TERPOTONG + MENU TIDAK BESAR).**
> Pemilik proyek: *“sudah install hp z flip 3 · menu atas tidak lengkap ketutupan · di hp note 8
> tombol on off tidak terlihat · di PC terlihat semua · versi apk harus diperbaiki”*.
> 🔎 **Diukur dulu DI APK NYATA** (emulator + WebView DevTools, ❌ bukan diduga) ⇒ **3 sebab:**
> (1) **`matchMedia('(pointer: coarse)')` = `false`** di WebView APK (padahal `maxTouchPoints=5` ·
> `hover:none=true`) ⇒ **SELURUH blok K79 mati** (kepala 47 px · tombol 29 px · label `display:none` ·
> toolbar 34 px); (2) **`.info` `flex-shrink: 1`** ⇒ menyusut **20,6 px** padahal isinya **29 px** ⇒
> **`info-kategori` & `info-tandai` (🔗 ON/OFF) TERPOTONG**; (3) **`.toolbar` `flex-shrink: 1`**.
> **⚙️:** `.info` & `.toolbar` ➕ **`flex-shrink: 0`** · **8** `@media (pointer: coarse)` →
> **`@media (pointer: coarse), (hover: none)`** · penanda halaman **`v3Nov-j` → `v6Nov-a`**.
> ⚠️ **Jebakan:** `and` lebih kuat dari `,` ⇒ baris `(pointer: coarse) and (max-width: 360px)`
> **WAJIB** ditulis dua kali.
> **📊 HASIL (diukur di APK `versionCode 29`):** `.info` **54 px** (`scrollH 53 ≤ clientH 53`) ·
> `info-kategori h30` + `info-tandai h30` **di dalam kotak** · kepala **70,4 px** · tombol **44 px** ·
> label **terlihat** · toolbar **88,8 px** (2 baris) · ruang tulis **513 px** ·
> menu File **11 entri lengkap** (`meluber: false`).
> **🧪** `uji-sasaran K102` **18 uji · 0 gagal · 4,3 dtk** ·
> `--sentuh --lebar 344` **21 uji · 0 gagal · 4,4 dtk**.
> **📦** HP **40.859.698 byte (38,97 MB)** · APK **34.233.883 byte (32,65 MB)** ·
> SHA-256 `527C2517…199328` · `versionCode 29` / `2.0.0-webview-k102` · aset **byte-identik** ✅.
> **⚠️ PELAJARAN:** (a) **`@media (pointer: coarse)` tidak bisa dipercaya di WebView Android** —
> selalu pasangkan `(hover: none)`; (b) **baris flex di dalam kolom flex WAJIB `flex-shrink: 0`**;
> (c) **cacat tata letak HP WAJIB diukur di APK NYATA**, ❌ bukan di Chrome;
> (d) **DUA paket APK ada di perangkat** — `com.anodes.app` (lama) & **`com.anodes.app.webview`** (baru).
> Rincian: `agents.md` **0a00d9y-s**.
>
> ✅ **6 Nov 2026 — K101 SELESAI: 📦 APK DIBANGUN ULANG + PAGAR `tools/cek-apk.js`.**
> Pemilik proyek: *“saya sudah tes ke APK ANodes-webview-debug.apk belum ada seperti pasted image ·
> sinkron online seharusnya sudah ada .. pasted image 2”*.
> 🔎 **Diukur dulu (❌ bukan diduga):** APK **tertinggal 5 kasus** — penanda `v3Nov-e` (era K98)
> padahal sumber `v3Nov-j` · `ANodesPengguna` **0 vs 17** · `ANodesBantuan` **0 vs 1** ·
> `ANodesBerkas` **0 vs 3** · `ANodesPerikop` **0 vs 22** · `ANodesParalel` **0 vs 20** ·
> `ANodesLinimasa` **0 vs 20** · `menu-pengguna`/`btn-bantuan` **0** · aset **37.500.605 vs
> 40.858.550 byte**. ⇒ **Menu ☁️ Sinkron & 👤 Pengguna SUDAH ADA di sumber** — hanya belum masuk APK.
> **Sebabnya sama seperti K78 · K79 · K95e: APK belum dibangun ulang** (kejadian **ke-4**).
> **⚙️:** `versionCode` **27 → 28** · `versionName` **`2.0.0-webview-k100`** · `gradlew clean` **53 dtk** ·
> `build-apk.bat` **1m 49s** · ⚠️ **`JAVA_HOME` wajib diset di proses yang SAMA**.
> **📊 HASIL:** APK **34.233.351 byte (32,65 MB)** · SHA-256 `69D1F4F1…7620EA` ·
> aset **byte-identik** dengan sumber ✅ · penanda halaman di APK **`v3Nov-j`** ✅ ·
> **12 penanda per kasus semuanya sama** ✅ · izin `INTERNET` + `ACCESS_NETWORK_STATE` ✅ ·
> modal ☁️ Sinkron di APK **versi K77d** (tanpa kolom alamat/kunci · 3 tombol) ✅.
> **🛡 PAGAR BARU:** **`tools/cek-apk.js`** — memeriksa **aset di dalam APK** (SHA-256) +
> **12 penanda per kasus** ⇒ `exit 1` kalau tertinggal. **Diuji dengan APK LAMA ⇒ `exit 1` +
> menyebut 8 penanda hilang** (bukan lulus palsu).
> **⚠️ PELAJARAN:** “berkas proyek sudah diperbarui” **≠** “APK berisi kode terbaru” —
> **sudah 4×** (K78 · K79 · K95e · K101). Rincian: `agents.md` **0a00d9y-r**.
>
> ✅ **3 Nov 2026 — K87 SELESAI: 🕒 PLUGIN LINIMASA SEJARAH.**
> Pemilik proyek: *“3. Linimasa sejarah bukannya sudah ada ? atau ini beda.. mengukur masa ?”*
> ⇒ dijelaskan **bedanya** ⇒ dipilih **“linimasa kerjakan”**.
> 🔎 **Diukur dulu:** **450 peristiwa** · **semuanya** punya rujukan ayat · tahun **−4003 … 57** ·
> **17.570 rujukan** (**100 %** memetakan & **100 %** ayatnya ada) · **41** nilai `partOf` ·
> zaman **63/65/25/9/81/4/0/93/110 = 450**.
> ⚠️ **2 cacat sumber:** **BOM `\uFEFF`** · **`startDate`** kadang angka kadang tanggal ISO.
> **Berkas:** `tools/osis.js` · `tools/linimasa-terjemah.json` (450) · `tools/linimasa-bagian.json` (41) ·
> `tools/siapkan-data-linimasa.js` · `plugin/linimasa/{linimasa,tampilan,plugin}.js` ·
> `plugin/linimasa/data/linimasa.js` **213,4 KB** sidik **`lm-450--4003-57-3f9bc0c1`** ·
> halaman ke-**11** `#linimasa-halaman` · CSS `.lm-*` · `js/bantuan.js` ➕ isi linimasa (**12 halaman**).
> **🐞 3 cacat nyata:** urut abjad (pemutus = **urutan sumber**) · **2 judul kembar**
> (`Reign of Jehoash` / `Death of Jehoahash` ⇒ **“(Israel)”**) · 🏠 kembali ke catatan
> (⇒ `ingatAsalAyat({jenis:'linimasa'})` — pola 🔖 K81b).
> **Hasil:** **56 uji K87 · 0 gagal · 10,7 dtk** (`index.html`) · **56 · 0 · 10,6 dtk** (HP) ·
> regresi **K64+K99+K100 110 · 0** · **K86+K96+K28h 143 · 0** ·
> HP **40.858.550 B (38,97 MB)** · halaman **`v3Nov-j`**. Rincian: `agents.md` **0a00d9y-q**.
> 📁 **K14 ditutup:** `C:\data\bible` **sudah tidak ada** ⇒ ➕ `tools/sumber-data.js` (`cariSumber()`).
>
> ✅ **3 Nov 2026 — K64 + K100 SELESAI: ❓ TOMBOL BANTUAN `[?]` + 👤 PEMISAHAN DATA PER EMAIL.**
> Pemilik proyek: *“help [?] dengan tujuan dan pejelasan perlu sekali .. nanti sistem hanya memiliki
> pemilah data menggunakan atau berdasarkan email”* + *“sekalian dibuat untuk isi 1x untuk seterusnya
> masuk email .. data dipisahkan dengan email saja”*.
> ✅ **Keputusan pemilik:** catatan lama **WARISI** (jadi milik email pertama) · email ditanya
> **SEKALI** saat pertama membuka · sinkron **PER EMAIL**.
> 🔴 **K64 — diukur dulu:** navbar Alkitab **sudah penuh** (9 tombol · **324 = 324 px** di layar
> 344 px) ⇒ ❌ mustahil menambah tombol di navbar. Kepala masih punya ruang (6 tombol ·
> **257/257 px** di 480 px) ⇒ **SATU tombol `[?]` di kepala**, isinya **12 halaman** berbeda
> (**1.283–4.746 huruf**), ditulis **di dalam `js/bantuan.js`** (❌ bukan dari `panduan.md` —
> data dokumen tidak lagi ikut ke versi HP sejak K28h).
> 🔴 **K100 — cara paling murah:** data dipisah dari **NAMA KUNCI** —
> `ANodesPengguna.kunci('anodes-x')` ⇒ `u:<email>::anodes-x`. **6 modul** cukup memakai satu
> pembantu `kunciData()`; struktur data **tidak berubah**. Sinkron: `kLokal(k)` untuk lokal,
> `kJauh(k)` = `email|kunci` untuk server ⇒ antar pengguna **tidak saling menimpa**. Migrasi
> **WARISI** memindah (❌ bukan menduplikasi) kunci lama saat email pertama diisi.
> **Hasil:** **K64 34 uji · 0 gagal · 5,2 dtk** · **K100 34 · 0 · 4,4 dtk** (`index.html`) ·
> **68 · 0** (HP) · regresi **K92+K93+K96+K99 136 · 0** (HP) · **K86+K98+K99 107 · 0** ·
> **K28h 42 · 0** · HP **40.602.494 B (38,72 MB)** · halaman **`v3Nov-i`** · pengguna **`v3Nov-j`** ·
> sinkron **`v3Nov-b`**. Rincian: `agents.md` **0a00d9y-p** · `CHANGELOG.md`.
>
> ✅ **3 Nov 2026 — K28h SELESAI: 🗂️ MENU `[Doc]` DIHAPUS + HALAMAN BERKAS TERSIMPAN (HP −2,29 MB).**
> Pemilik proyek: *“[doc] sudah tidak perlu.. karena sistem sudah hampir selesai”* ⇒ dipilih
> **“Hapus `[Doc]` + pindahkan daftar rantai ke halaman plugin 🌿 Ayat Terkait”**.
> 🔴 **Diukur dulu:** `js/dokumen.js` (**1.094 baris**) ternyata memuat **3 hal sekaligus** —
> halaman dokumen · **daftar rantai tersimpan** · **pengolah markdown** yang dipakai
> **Impor `.md`/`.txt`**, tombol **“📖 Rapi”**, dan **rapikan tempelan (K44)**.
> ⇒ **Mesin dipindah, bukan dihapus:** **`js/markdown.js`** (BARU · `window.ANodesMarkdown`) ·
> **`js/berkas.js`** (BARU · halaman **🗂️ Berkas Tersimpan** `#berkas-halaman`) ·
> tombol kepala `📄 Doc` → **`🗂️ Berkas`** · daftar rantai pindah **utuh** ke `#bk-isi`
> (🌿 Buka · + Ayat · 🗑 tetap) · `js/editor.js` 4 tempat → `ANodesMarkdown` ·
> `plugin/ayat-terkait/kerja.js` → `berkas-halaman` · **DIHAPUS:** `js/dokumen.js` ·
> `js/dokumen-data.js` · `tools/siapkan-dokumen.js` · halaman `#doc-alkitab` ·
> `start.bat` & `tools/buat-1-berkas.js` tidak lagi menyatukan dokumen.
> **Hasil:** HP **42.944.496 B (40,96 MB) → 40.539.519 B (38,66 MB)** = **−2,29 MB (−5,6 %)** ·
> **42 uji K28h · 0 gagal · 20,2 dtk** (`index.html`) & **42 · 0 · 20,3 dtk** (HP) ·
> regresi **K99+K86+K98 107 · 0** · **K92+K93+K96 94 · 0** · penanda **`v3Nov-h`**.
> Rincian: `rencanakerja.md` **18.5** · `agents.md` **0a00d9y-n**.
>
> ✅ **3 Nov 2026 — K99 SELESAI: 📖 PLUGIN JUDUL PERIKOP (2.573 judul · 96,2 % pasal).**
> Bapak: *“ngk usah deh ... ada lagi pelengkapan alkitab ?”* ⇒ saya **ukur seluruh lapisan
> Alkitab** (penguat 100 % · sejarah 66/66 · bacaan 1 tahun 100 % · paralel 100 % ·
> **interlinear 97,9 %** · **ayat terkait 94,4 %** · **perikop 0 %**) ⇒ Bapak memilih **perikop**.
> **Data:** `tools/siapkan-data-perikop.js` (BARU) membaca `tools/_sumber-ayt/` (sumber **SAMA**
> dengan K86) ⇒ **66 kitab · 2.573 judul · 132,5 KB** · sidik **`pk-2573-6df3cabe`** ·
> **1.144/1.189 pasal = 96,2 %**. **Bentuk:** `.pk-judul` **di atas baris ayat** (cokelat
> `#6b4f29` · tebal 700 · garis kiri `inset 3px`) · sub-judul `.pk-judul.pk-sub` · kaki atribusi
> CC BY-NC. **❌ TANPA tombol navbar** — diukur navbar sudah **9 tombol · 324 = 324 px** ⇒ tombol
> ke-10 meluber; ON/OFF lewat **halaman keterangan plugin** (`pilihanTampil`, kunci
> `anodes-perikop-cara`). **42 uji K99 · 0 gagal · 9,0 dtk** (`index.html`) & **42 · 0 · 9,1 dtk**
> (HP) · penanda **`v3Nov-g`** · HP **40,96 MB**.
> Rincian: `rencanakerja.md` **18.3.4** · `agents.md` **0a00d9y-m**.
>
> ✅ **3 Nov 2026 — K86 SELESAI: 🔀 PLUGIN PARALEL TERJEMAHAN (TB ⇄ AYT).**
> Bapak memilih **K86** dari papan order. **🔴 KOREKSI RENCANA:** sumber yang direncanakan
> (**TSI** `ind_usfm.zip`) ternyata **hanya 48 kitab** — 18 kitab PL tidak ada (1CH · 2CH · JOB ·
> PSA · SNG · JER · LAM · EZK · DAN · HOS · JOL · AMO · OBA · MIC · NAM · HAB · ZEP · HAG).
> Diukur 3 terjemahan Indonesia ⇒ dipakai **AYT** (`indayt_usfm.zip` 1,50 MB) = **66 kitab ·
> 31.102 ayat** (persis sama dengan TB) · lisensi **CC BY-NC 4.0** (pemakaian pribadi).
> **Bentuk:** **bertumpuk per ayat** (TB di atas, kotak AYT di bawah) — ❌ bukan 2 kolom, karena
> `.app` selalu gaya HP (maks 480px) ⇒ 2 kolom hanya ±220px. **42 uji K86 · 0 gagal · 13,3 dtk**
> (`index.html`) & **42 · 0 · 13,5 dtk** (HP) · penanda **`v3Nov-f`** · HP **40,77 MB**.
> Rincian: `rencanakerja.md` **18.3.3** · `agents.md` **0a00d9y-l**.
>
> ✅ **3 Nov 2026 — K98 SELESAI: 🔤 PANEL ARTI STRONG MUNCUL TEPAT DI BAWAH BARIS YANG DIKLIK.**
> Bapak: *“mau revisi satu lagi kata - yunani — misal γρηγορῶν (grēgorōn) G1127 < klik >
> jatuh keterangan jauh apalagi kata banyak keterangan ada dibawah — maunya selalu ada dibawah ..
> supaya mempermudah pada saat di baca”*.
> **🔎 SEBAB TUNGGAL (diukur):** `gambarKolom()` membuat **SATU** `.il-panel` lalu
> **`kolom.appendChild(panel)`** ⇒ di **UJUNG kolom**; `tampilStrong()` hanya **mengisi** panel
> tetap itu ⇒ keterangan **selalu** di dasar (chip baris ke-16 dari 32 ⇒ **511 px** di bawahnya).
> **⚙️ Perbaikan:** panel dibuat **saat chip diklik** · disisipkan
> **`insertBefore(panel, baris.nextSibling)`** ⇒ **TEPAT di bawah barisnya** · **satu slot**
> (panel lama **`.remove()`**, ❌ bukan `hidden`) · klik nomor sama ⇒ panel **tertutup** ·
> CSS `.baca-isi .il-panel` margin **`3px 0 9px`** + garis kiri **`3px solid #d8b96a`**.
> **📊 HASIL:** jarak **511 px → 3 px** · **23 uji K98 · 0 gagal · 9,7 dtk** (`index.html`) &
> **23 · 0 · 9,9 dtk** (`ANodes-1berkas.html`) · regresi **K85t2 52 uji · 0 gagal** ·
> tampilan interlinear **`v3Nov-d` → `v3Nov-e`** · bukti nyata **1 Petrus 5:8 chip `G1127`**
> ⇒ panel *“G1127 · γρηγορεύω · grēgoreúō — berjaga-jagalah · …”* tepat di bawah γρηγοροῦντες ·
> `artifacts/k98-panel-dibawah.png`.
> **🐞 3 cacat yang ketemu:** panel lama hanya `hidden` ⇒ **menumpuk** · uji memakai
> **`meta.kitab[].pasal`** yang **TIDAK ADA** ⇒ 0 ayat uji · panel diperiksa sebagai anak
> **`.il-kolom`** padahal di dalam **`.il-daftar`**.
>
> ✅ **3 Nov 2026 — K97 SELESAI: 📅 TOMBOL BACAAN 1 TAHUN DI NAVBAR HALAMAN BACA ALKITAB.**
> Tombol **`#baca-bacaan`** ditempel ke `.ay-nav-b1` (pola 🔖 K82) · ikon **📅 ⇄ ✅** ·
> 🏠 kembali ke **HALAMAN BACA** · navbar **464 ≤ 464 px** (juga 344 px) ·
> **59 uji · 0 gagal · 7,7 dtk** · tampilan baca1tahun **`v3Nov-b`**.
>
> ✅ **3 Nov 2026 — K96 SELESAI: 🗓️ PLUGIN BACAAN ALKITAB 1 TAHUN (menggantikan 🕊️ Pengingat Firman).**
> Bapak: *“saya mau buat bacaan 1 th alkitab artinya 1th baca selesai semua.. setiap hari ntah
> berapa pasal.. pasal2 yg di beri tentu user sudah dilengkapi banyak referensi.. apakah km bisa
> menenukan daftar baca alkitab”* ➕ *“apakah di internet ada menyediakan API untuk ini bisa km
> carikan yg bagus.. jika bahasa inggris harus diterjemahkan dalam bahasa indonesia”*.
> **🔎 DIUKUR DULU (❌ bukan diduga):** Alkitab **66 kitab · 1.189 pasal · 31.102 ayat** ⇒
> 1 tahun = **3,26 pasal/hari** atau **85,2 ayat/hari**. Setiap pasal **sudah** punya
> 🖊 penguat · 📚 kamus · 🌿 ayat terkait · 🗺️ peta · 🔤 interlinear ⇒ **permintaan referensi
> Bapak sudah terpenuhi**.
> **🌐 6 rencana internet diukur dengan data ANodes** — ⭐ Every Day In the Word **99,3 %**
> (1.181/1.189 · kurang 8 pasal Kidung Agung) · Chronological 95,5 % · M'Cheyne 91,1 % ·
> Through The Bible **52,2 %** · OT+NT **55,3 %** · Back to the Bible **42,3 %**.
> 🔴 **TEMUAN:** rencana terkenal **TIDAK** mencakup seluruh Alkitab. ⇒ ANodes **membangun
> sendiri** ketiga rencananya dari data Alkitab ⇒ **100 % cakupan**.
> ⚠️ **`file://` tidak bisa memanggil API** ⇒ **unduh sekali, tanam ke data** (pola Alkitab/penguat).
> **⚙️ Pelaksanaan (❌ tanpa mesin Alkitab baru):** `tools/siapkan-data-baca.js` (BARU) →
> `plugin/baca1tahun/data/baca.js` **212,9 KB** sidik **`bc-365-3-f704d134`** ·
> mesin `plugin/baca1tahun/baca.js` (`window.ANodesBaca`) · tampilan `tampilan.js` ·
> kartu `plugin.js` · **halaman ke-10** `#baca1tahun-halaman` (anak `body`) · CSS `.bt-*` ·
> `js/sinkron.js` ➕ kunci **`anodes-baca1tahun-v1`** ⇒ **6 kunci** · ➕ tombol **📖 per baris blok**.
> **📊 HASIL:** 🅰️ `urut` **100 % · 28–176 ayat/hari (tengah 85)** · 🅱️ `plpb` **100 %** ·
> ⭐ `edw` **100 %** · kalender **365 sel** · label **“Kejadian 1–3”** (nama kitab sekali).
> **🧪 UJI:** **44 uji · 0 gagal · 6,2 dtk** di `index.html` **dan** `ANodes-1berkas.html` ·
> regresi **K90i 17 · 0 gagal** · **K85t2 51 · 0 gagal**.
> ⚠️ **9 CACAT ketemu & diperbaiki** — terbesar: 🔴 **`SyntaxError` `cekUnik` dideklarasikan 2×**
> ⇒ blok uji **tidak pernah jalan** (alat menunggu 90 dtk) ⇒ **`node --check` DULU** kalau blok
> tidak mengeluarkan hasil. Rincian: `agents.md` **0a00d9y-k**.
>
> ✅ **3 Nov 2026 — K95b SELESAI: DATA GANDA DIBUANG ⇒ BERKAS HP 44,22 → 35,41 MB (−8,81 MB).**
> Bapak: *“bisa dikecil 8,33 itu sepadan ngk ? .. kalau hanya pengaruh sedikit lebih baik ngk usah”*.
> **🔎 DIUKUR DULU (❌ bukan diduga):** **6 berkas data masuk DUA KALI** — `ANodesPetaData` ·
> `ANodesPetaBumi` · `ANodesInterlinearData` · `ANodesYunaniData` · `ANodesIbraniData` ·
> `ANodesPbData` — semuanya **byte-identik**. **Sebabnya:** berkas itu **sudah ada di `index.html`**
> (`<script src="plugin/…/data/….js">`) **DAN** disisipkan **lagi** oleh bagian **3f–3k**
> `tools/buat-1-berkas.js` di akhir berkas. ⚠️ **Cacat ini tidak terlihat di PC** (di sana berkas
> dibaca terpisah) — hanya muncul di **versi HP**.
> **⚙️ Perbaikan:** ➕ **`sudahInline`** (Set) di `tools/buat-1-berkas.js` — mencatat berkas yang
> **sudah** disisipkan di tempat aslinya ⇒ bagian 3f–3k diberi penjaga
> **`&& !sudahInline.has(DATA_…)`**. ⚠️ **Urutan tetap:** data **di tempat aslinya** (sebelum mesin),
> karena mesin membaca `window.ANodes*Data` **saat dimuat**.
> **📊 HASIL TERUKUR (Chrome headless · 3 putaran · 420×900):** berkas **46.373.062 → 37.131.931 B**
> (**44,22 → 35,41 MB** · **−8,81 MB = −19,9 %**) · blok `<script>` **55 → 49** ·
> isi skrip **44,79 → 34,47 MB** · **muat 2.179/2.210 → 1.749/1.714/1.726 ms** ·
> **RAM 141 → 111 MB (−30 MB)** · data tetap utuh (`peta 12` · `bumi 3` · `pb 3` · `ibrani 3`).
> **🧪 UJI:** **K85t2 51 uji · 0 gagal · 14,1 dtk** · regresi **K90i 17 uji · 0 gagal · 9,7 dtk**.
> **📐 JAWABAN BAPAK:** ukuran berkas **tidak langsung** membuat lag — yang lambat adalah
> **banyaknya JavaScript yang dibaca saat halaman dibuka**. **Konsep plugin menolong** (data besar
> tidak dihitung saat menulis catatan; di PC data disimpan di **IndexedDB**). Dan **8,81 MB
> SEPADAN** — terukur **muat −450 ms & RAM −30 MB**, bukan “pengaruh sedikit”.
> Rincian: `agents.md` **0a00d9y-j**.
>
> ✅ **3 Nov 2026 — K85 TAHAP 3 SELESAI: 1.398 ARTI BARU ⇒ CAKUPAN PB 95,1 % → 100 %.**
> Bapak: *“lanjut sampai selesai”*. **⏱️ Perkiraan ±6 jam · nyata ±1 jam 15 menit.**
> **🔎 DIUKUR DULU (❌ bukan diduga) — ternyata 1.398, bukan 1.205:** kata isi PB belum punya arti
> **1.398** (**≥5× = 67** ⚠️ · **1× = 1.331**) · kemunculan belum berarti **1.805 dari 74.787 (2,4 %)** ·
> jenis kata pita 1× N **632** · V **428** · A **269**.
> ⚠️ **Angka 1.205 di rencana SALAH** — itu selisih pita frekuensi (2.274 − 1.069), bukan jumlah
> kata yang benar-benar belum punya arti. **Selalu hitung dari data.**
> **⚙️ Pelaksanaan:** `tools/pb-penjelasan.json` **1.030 → 2.429 entri** (48.677 → **116.567 byte**) ·
> `node tools/siapkan-data-pb.js` ⇒ data PB **3.128 → 3.296 KB** · entri lex **4.168 → 5.685** ·
> sidik **`pb-4170-5685-cd66c7eb`**.
> **🐞 CACAT NYATA KETEMU UJI:** **118 nomor Strong (semuanya ADV)** dipakai di ayat tetapi
> **tidak punya entri lex** ⇒ tampil `—` tanpa jenis kata. **Perbaikan di `siapkan-data-pb.js`:**
> langkah **(d)** setiap nomor Strong yang dipakai **wajib** punya entri lex · langkah **(e)**
> **jenis kata (POS)** disimpan di setiap entri.
> **📊 HASIL:** cakupan kata isi PB **35.407/37.213 (95,1 %) → 37.213/37.213 (100,0 %)** ·
> kata isi belum berarti **1.806 → 0** · HP **45.285,9 KB (44,22 MB)**.
> **🧪 UJI:** blok **K85t2** diperluas **46 → 51 uji** ⇒ **51 uji · 0 gagal · 14,1 dtk**
> (`index.html` **dan** `ANodes-1berkas.html`) · regresi **K90i 17 uji · 0 gagal · 9,6 dtk**.
> **📱 PENANDA:** mesin PB **`v3Nov-d`** · tampilan interlinear **`v3Nov-e`** (K98) · halaman **`v3Nov-e`** ·
> plugin interlinear **1.3 → 1.4** · ukuran **±7,8 → ±8,0 MB**.
> **🎉 SELESAI:** interlinear Perjanjian Baru **100 %** (tahap 1 = 89,6 % · tahap 2 = 95,1 % · tahap 3 = 100 %).
> Rincian: `agents.md` **0a00d9y-i**.
>
> ✅ **3 Nov 2026 — K85 TAHAP 2 SELESAI: 803 ARTI BARU ⇒ CAKUPAN PB 89,6 % → 95,1 %.**
> Bapak: *“lanjut tahap 2”*. **⏱️ Perkiraan ±4–5 jam · nyata ±1 jam 10 menit.**
> **🔎 DIUKUR DULU (❌ bukan diduga) — ternyata 803, bukan 714:** kata isi PB **37.213**
> kemunculan · sudah punya arti **33.342 (89,6 %)** · kata frekuensi **2–4×** yang belum
> punya arti = **803** (**4× = 121** · **3× = 216** · **2× = 466**) · **0 bisa otomatis**
> (lemma sama sudah habis di pita atas) · jenis kata N **393** · V **263** · A **138**.
> ⚠️ **Angka 714 di rencana SALAH** — itu selisih pita frekuensi (1.069 − 355), bukan jumlah
> kata yang benar-benar belum punya arti. **Selalu hitung dari data.**
> **⚙️ Pelaksanaan:** `tools/pb-penjelasan.json` **227 → 1.030 entri** (8.929 → **48.677 byte**) ·
> `node tools/siapkan-data-pb.js` ⇒ data PB **3.059 → 3.128 KB** · entri lex **3.364 → 4.168** ·
> sidik **`pb-4170-4168-cd66c7eb`**.
> **📊 HASIL:** cakupan kata isi PB **33.342/37.213 (89,6 %) → 35.407/37.213 (95,1 %)** ·
> kata isi belum berarti **3.871 → 1.806** · HP **44.927,1 KB (43,87 MB)**.
> **🧪 UJI:** blok **K85t2** diperluas **43 → 46 uji** ⇒ **46 uji · 0 gagal · 13,9 dtk**
> (`index.html` **dan** `ANodes-1berkas.html`) · regresi **K90i 17 uji · 0 gagal · 9,6 dtk**.
> **📱 PENANDA:** mesin PB **`v3Nov-c`** · tampilan **`v3Nov-c`** · halaman **`v3Nov-c`** ·
> plugin interlinear **1.2 → 1.3** · ukuran **±7,6 → ±7,8 MB**.
> **🎉 SELESAI:** tahap 3 (3 Nov 2026) menambah **1.398 arti** ⇒ **cakupan 100 %**.
> Rincian: `agents.md` **0a00d9y-h**.
>
> ✅ **3 Nov 2026 — K85 TAHAP 2 SELESAI (tahap 1): 🔤 INTERLINEAR PERJANJIAN BARU (Kisah 26 s/d Wahyu).**
> Bapak memilih **Tahap 1** sesudah saya paparkan hasil ukur + contoh bentuk
> (`artifacts/contoh-pb-interlinear.html`). Pertanyaan Bapak: *“proses sampai selesai perlu
> berapa lama?”* ⇒ jawaban terukur: **±14 jam untuk 100 %**, tetapi **94 % sudah tercapai
> dalam ±4 jam** — sebab yang ditulis adalah **KATA**, bukan **AYAT**.
> **🔎 DIUKUR DULU (❌ bukan diduga):** celah = **Kisah 26 s/d Wahyu · 3.271 ayat** ·
> **3.781** nomor Strong · **1.383** sudah punya arti · **124** kata fungsi · **251** bisa
> otomatis (lemma sama) · **2.023** perlu ditulis. **Kunci efisiensi:** tulis kata **≥5×**
> (**355 kata**) ⇒ **94 %** kemunculan kata isi terjelaskan; **8 kata** saja ⇒ **87 %**.
> **⚠️ SEBAB bentuknya berbeda:** sumber `idkjv` **hanya punya 4 Injil + Kisah 1–25**
> (terukur: Kisah berhenti di **25:9**) ⇒ bagian ini **tidak punya teks Indonesia per ayat**.
> **⚙️ Pelaksanaan:** alat BARU **`tools/siapkan-data-pb.js`** (STEPBible TAGNT · CC BY 4.0) ·
> sumber arti BARU **`tools/pb-penjelasan.json`** (**227 entri** ditulis tangan) ·
> mesin BARU **`plugin/interlinear/pb.js`** (`window.ANodesPb` · IndexedDB kunci **`pb`**) ·
> **DUA BENTUK kolom** lewat `tampilan.js → bentukUntuk(kitab)`:
> **`40–43 ⇒ 'A'`** (kata Indonesia ⇄ Yunani) · **`44–66 ⇒ 'B'`** (Yunani + alih huruf + arti).
> **📊 HASIL:** data PB **4.170 ayat · 4.400 Strong · 3.364 entri arti · 3.059 KB** ·
> sidik **`pb-4170-3364-cd66c7eb`** · Kisah 26:1 = **19 kata** · Wahyu 3:20 = **29 kata** ·
> 4 Injil **tetap Bentuk A** · HP **44.748,1 KB (43,70 MB)**.
> **🧪 UJI:** blok sasaran **`tools/uji-blok/K85t2.js`** (BARU) ⇒ **43 uji · 0 gagal** ·
> **13,7 dtk** (`index.html`) · **13,9 dtk** (`ANodes-1berkas.html`) · regresi **K90i 17 uji · 0 gagal**.
> **📱 PENANDA:** mesin PB **`v3Nov-b`** · tampilan **`v3Nov-a` → `v3Nov-b`** ·
> plugin interlinear **1.1 → 1.2** · ukuran **±4,6 → ±7,6 MB**.
> **⏭️ SISA:** tahap 2 (+803 kata · 2–4×) ⇒ **95,1 %** · tahap 3 (+1.398 kata · 1×) ⇒ **100 %**.
> Rincian: `agents.md` **0a00d9y-g**.
>
> ✅ **3 Nov 2026 — K90i SELESAI: ✡ PENJELASAN IBRANI TAURAT DITUNTASKAN (149 kata baru).**
> Bapak memilih **A. Tuntaskan 86 ayat Taurat** sesudah saya paparkan hasil ukur.
> **🔎 DIUKUR DULU (❌ bukan diduga) — rencana lama ternyata sudah usang:** P1 (Taurat) tercatat
> **±3 jam** di `rencanakerja.md` 18.2.3, padahal **K90 sudah menutup 98,5 %**-nya
> (**5.766 dari 5.852 ayat**). Yang benar-benar kurang hanya **86 ayat (1,5 %)** yang memuat
> **149 nomor Strong layak** (dari 186; sisanya kata fungsi). **298 nomor Strong di Taurat
> sudah 100 % dijelaskan.**
> **⚠️ TEMUAN SAMPINGAN YANG LEBIH PENTING:** celah terbesar **bukan** Taurat, melainkan
> **Perjanjian Baru — 4.234 ayat belum ada** (Kisah s/d Wahyu **0 %**), sebab sumber `idkjv`
> **hanya punya 4 Injil + Kisah 1–25** (882 dari 1.007 ayat = 87,6 %).
> **⚙️ Pelaksanaan:** tulis **149 penjelasan** baru (rata-rata **305 huruf**) ⇒
> `tools/ibrani-penjelasan.json` **326 → 475 entri** (184,7 → **236,1 KB**) ⇒
> `plugin/interlinear/data/ibrani.js` **2.796,2 → 2.910,4 KB**.
> **📊 HASIL:** kata dijelaskan **306 → 455** · ayat PL **22.602 → 22.688 (97,7 %)** ·
> **cakupan Taurat 98,5 % → 99,5 %** (Kejadian **99,9 %** · Keluaran **99,6 %** · Imamat **99,2 %** ·
> Bilangan **98,8 %** · Ulangan **99,7 %**) · sidik **`ib-23213-455-624bf961`** ·
> **32 ayat sisa diperiksa satu per satu ⇒ semuanya hanya kata fungsi** ⇒ Taurat efektif **100 %**.
> **🧪 UJI:** blok sasaran **`tools/uji-blok/K90i.js`** (BARU) ⇒ **17 uji · 0 gagal** ·
> **9,7 dtk** (`index.html`) · **9,8 dtk** (`ANodes-1berkas.html`).
> **📱 PENANDA:** mesin Ibrani **`v1Nov-a` → `v3Nov-a`** · tampilan **`v1Nov-e` → `v3Nov-a`** ·
> halaman **`v2Nov-c` → `v3Nov-a`** · plugin interlinear **1.0 → 1.1** · HP **39.544.836 byte (37,71 MB)**.
> **🐞 CACAT UJI:** K90i-01 gagal palsu (ambang saya tulis `>= 475`, yang benar **455** =
> 306 terpakai + 149 baru) ⇒ ambang diperbaiki. ⚠️ **ambang uji wajib dari angka nyata**,
> bukan dari jumlah entri berkas sumber.
> Rincian: `agents.md` **0a00d9y-f**.
>
> ✅ **2 Nov 2026 — K95 SELESAI: 📌 ATURAN UJI UNTUK SEMUA AI + BUKTI NYATA.**
> Bapak: *“di catat atau prompt apalah supaya selain AI km AI lain juga bekerja seperti km..
> terutama di uji .. saya hanya perkiraan.. tidak ada bukti nyata.. bukti saya hanya karena km
> mengakui”*. **🔎 DIUKUR DULU:** `AGENTS.md` di akar **= `agents.md`** (Windows tidak membedakan
> huruf besar/kecil) ⇒ sudah terbaca AI lain; tetapi **`.github/copilot-instructions.md` TIDAK ADA**
> (itulah yang dibaca Copilot otomatis) dan **tidak ada bukti terukur**.
> **Perbaikan — 3 LAPIS:** (1) **ATURAN** — `.github/copilot-instructions.md` (BARU) + Aturan #1 di
> kepala `agents.md` · (2) **PAGAR** — `--blok` ditolak `exit 2` + peringatan otomatis bila lambat ·
> (3) **BUKTI** — `tools/uji-log.js` menulis `artifacts/uji-log.txt` (dipakai **KEDUA** alat uji ⇒
> cara lambat tidak bisa disembunyikan) + `node tools/cek-cara-uji.js` = ringkasan angka nyata.
> **📊 BUKTI:** `cek-cara-uji.js` ⇒ *“cara SASARAN 2 kali · 21,9 dtk · MENYELURUH 0 kali”*.
>
> ✅ **2 Nov 2026 — K94 SELESAI: 🎯 UJI SASARAN (cara uji dibenahi).**
> Bapak: *“sifat uji ini menguji aplikasi keseluruhan.. jadi memang butuh waktu yg sangat lama..
> seharusnya uji di lokasi atau di sasaran tepat diminta perbaikan .. posisi itu saja yg di uji”*
> lalu *“mengapa km pakai cara lama lagi.. cari cara lain supaya tidak masuk lubang yg sama”*.
> **🔎 DIUKUR DULU (kritik TERBUKTI BENAR):** `tools/uji-cepat.js` **8.435 baris · 465 KB ·
> 893 asersi · 43 blok · 44 pasang/lepas plugin · 12 muat data besar** ⇒ **±4–7 menit**;
> `window.__BLOK` **hanya menyaring LAPORAN** — seluruh asersi tetap jalan.
> **Perbaikan:** ➕ **`tools/uji-sasaran.js`** (menjalankan **HANYA** `tools/uji-blok/<NAMA>.js`) ·
> ➕ folder **`tools/uji-blok/`** (`K92.js` · `K93.js` sudah ada) · 🛑 **PAGAR** di
> `tools/uji-chrome.js`: `--blok` **DITOLAK** (`exit 2`) kecuali `--paksa` · aturan ditulis di
> `agents.md` + penanda di kepala `uji-cepat.js`.
> **📊 HASIL:** **156 baris / 7,2 KB / 10,9 detik** vs **8.435 baris / 465 KB / ±4–7 menit** =
> **54× lebih ringkas, ±30× lebih cepat** · **35 uji · 0 gagal**.
>
> ✅ **2 Nov 2026 — K92 + K93 SELESAI: 🔖 BOOKMARK.**
> Bapak: *“ada perbaikan lagi bookmark · sudah pilih ayat yg akan dibookmark tapi icon bookmark tidak
> ada atau plugin icon bookmark tidak muncul..”* lalu *“bookmark .. ke daftarnya list bookmark.. bisa
> di klik salah satu book dan lompat ke kitab book .. ini fungsi bookmark”*.
> **🔴 K92 SEBAB TERUKUR:** `ANodesPlugin.dipasang('bookmark')` = **true** tetapi tombol 🔖 navbar &
> `[🔖 Bookmark]` di bar pilihan **TIDAK ADA** (isi bar tanpa `bk-bookmark`); sesudah `hidupkan()`
> manual ⇒ **muncul**. Ternyata `plugin/bookmark/tampilan.js` **tidak punya pemanggil
> `siapkanOtomatis()` saat halaman dimuat** — semua plugin lain punya `DOMContentLoaded`. Akibatnya
> tombol hidup **hanya di sesi pemasangan** dan **hilang sesudah F5**. ⚠️ **Pelajaran K55/K47e
> terulang ke-3×**. **Perbaikan:** ➕ blok `DOMContentLoaded`/`readyState` di akhir `tampilan.js` ·
> ➕ pendengar **`anodes-pilih-berubah`** ⇒ `pasangTombolBarKirim()` dipasang ulang · `bersihkan()`
> juga membuang `#bk-bookmark`. **17 uji · 0 gagal.**
> **🔎 K93 SEBELUM:** kartu `.bm-kartu` **tidak punya pengait klik**, `cursor` = **`auto`** ⇒ hanya
> bisa dibaca. **Perbaikan:** klik **kartu** (kecuali tombol — `closest('button')`) ⇒
> `bukaDiAlkitab()` → `bukaRentang()` (K80) ⇒ Alkitab pada ayat itu + **sorot rentang** · 🏠 ⇒
> **kembali ke HALAMAN 🔖 BOOKMARK** lewat sambungan resmi
> `daftarPemulihHalaman('bookmark', …)` + `ingatAsalAyat()` · `cursor: pointer` + `↗` + latar
> berubah saat disentuh. **13 uji live + 18 asersi suite · 0 gagal.**
> Penanda **`v2Nov-a` → `v2Nov-b`** · plugin bookmark **1.1 → 1.3**.
>
> ✅ **2 Nov 2026 — K91 SELESAI: 🔍 REVISI FITUR CARI DI ALKITAB (3 butir).**
> Bapak: *“1. posisi sedang baca kitab keluaran 1:1 lalu klik cari misal "onesimus" keluar kolose 4:9 ..
> user hanya baca lalu mau kembali ke bacaan sebelumnya keluaran 1:1 .. belum bisa klik 🏠 > ke catatan
> seharusnya kembali ke kitab keluaran 1:1 · 2. cari misal "onesimus" sekarang harus persis sama ..
> jika beda omesimus sudah tidak ditemukan mungkin user bermaksud onesimus tapi lafal salah misal
> omesimus.. apa sistem bisa cari beberapa alternatif dengan kata mirip seperti list user tinggal cari
> yg dimaksud · 3. history cari bisa banyak dari tanggal lalu mungkin user cari apa yg lalu.. dan
> history bisa dihapus disediakan tombol hapus history”*.
> **🔎 DIUKUR DULU:** kosakata unik TB **16.896 kata** (≥4 huruf) · **687.265 kata** · **31.102 ayat** ·
> bangun indeks **226 ms** (sekali, malas) · satu pencarian mirip **3–30 ms** · `onesimus` **2×**,
> `omesimus` **0×**. **🔧 (a)** `asalCari` baru + `bukaHasilCari()` memindahkannya ke `asalBacaan` (K80)
> ⇒ 🏠 pertama ke **Keluaran 1**, 🏠 kedua ke catatan. **🔧 (b)** **Damerau-Levenshtein** (huruf tertukar
> = 1 langkah) · ambang **TERUKUR**: panjang ≥7 ⇒ jarak 2, <7 ⇒ jarak 1 (aturan tersempit — jarak 2 untuk
> kata pendek menghasilkan **138** saran untuk `kasi`). **🔧 (c)** kunci **`anodes-alkitab-cari-riwayat`**
> (masuk `KUNCI_AMAN`) · maks **50** · tanpa dobel · label waktu · tombol **🗑 Hapus** + konfirmasi ·
> daftar **tertutup** saat ada hasil, **terbuka** saat halaman cari kosong.
> **📊 BUKTI:** **33 uji K91 · 0 gagal** di `index.html` **dan** `ANodes-1berkas.html` · klik NYATA:
> Keluaran 1 → cari `omesimus` ⇒ chip **onesimus** ⇒ klik ⇒ **Kolose 4:9** ⇒ 🏠 ⇒ **Keluaran 1** ⇒
> 🏠 ⇒ catatan ✅ · penanda **`v2Nov-a`** · HP **39.204.678 byte (37,39 MB)**.
> Rincian: `agents.md` **0a00d9z**.
>
> ✅ **1 Nov 2026 — K90h SELESAI: ✡ PENJELASAN IBRANI UNTUK PERJANJIAN LAMA (39 kitab).**
> Bapak: *"berikut supaya PL juga ada"*. **Diukur:** **39 kitab** morphhb · **23.213 ayat** ·
> **306.785 kata** · **8.640 nomor Strong** · **5.960 kata isi layak** · **306 kata dijelaskan**
> ⇒ **22.602 ayat = 97,4 %** PL. ⚠️ **Format morphhb TIDAK punya atribut `strong`** — nomor Strong
> ada di **digit depan `lemma`** (`b/7225` → 7225 · `1254 a` → 1254); 2 percobaan pertama salah
> (0 hasil · 4 nomor). **Kolom 🖊 SATU** untuk PL & PB (`mesinUntuk(kitab)` = ≤39 Ibrani, ≥40 Yunani).
> **Bukti:** Kejadian 1:1 ⇒ **3 blok** (אֱלֹהִים · שָׁמַיִם · אֶרֶץ) · Kejadian 1 ⇒ **31 tombol** ·
> bagian ✡ serapan **hanya di PB** · **33 uji K90 + 11 uji K90g · 0 gagal** · versi **`v1Nov-k`** ·
> HP **37,21 MB** · APK **32,31 MB** · `versionCode 22` (build 1 Nov).
>
> ✅ **2 Nov 2026 — APK DIBANGUN ULANG (K91–K95 masuk).** ⚠️ **Temuan:** APK yang ada
> **masih versi 1 Nov** (`v1Nov` · aset 39.185.975 byte) — perbaikan hari ini **belum ada**
> di dalamnya. **Bukti terukur:** `asalCari` **0** · `bm-kartu-klik` **0** di dalam APK.
> **Perbaikan:** `gradlew clean` + `build-apk.bat` ⇒ **APK 33.985.095 byte (32,41 MB)** ·
> SHA-256 `E2722D0A…0A14135` · **`versionCode 23`** / `2.0.0-webview-k95` ·
> aset **39.289.009 byte = sumber (byte-identik)** · versi halaman **`v2Nov-c`** ·
> **K91 (27×) · K91b (6×) · K91c (24×) · K92 (26×) · K93 (14×) · K94 (43×) · K95 (18×)** ✅ ·
> build **18s (clean) + 58s (assemble)**. ⚠️ **Belum diuji di emulator** (Bapak: uji besok).
> 🐞 **Cacat build yang ketemu:** build **tanpa `clean`** ⇒ APK **47.134.786 byte (45,0 MB)** —
> **13,25 MB lebih besar** dari isi sebenarnya (entri terkompres hanya 33.881.047 byte).
>
> ✅ **1 Nov 2026 — K89 SELESAI: ✡ KATA SERAPAN IBRANI / ARAM (ikon Bintang Daud).**
> Bapak mengirim `icon yahudi.png` (Bintang Daud hitam 768×887). **Keputusan Bapak:** ikon
> **di dalam kolom 🖊 Yunani** · **tanpa** penjelasan mengalir (cukup arti singkat) · **SVG**.
> **Diukur:** **29 nomor Strong** berlabel Ibrani/Aram di 4 Injil · **203 dari 3.778 ayat (5,4 %)** ·
> Matius **65** · Markus **38** · Lukas **31** · Yohanes **69** · tersering: amin **106×** ·
> sabat **40×** · rabi **17×** · satan **12×** · paskah **11×** · barabas **10×**.
> ⚠️ **Data Ibrani PL TIDAK ADA** di komputer ⇒ penanda hanya untuk **Injil**.
> **Bukti:** Matius 27:46 ⇒ **3 blok Yunani + 3 kata Ibrani** · Yohanes 5:2 ⇒ **2 kata** ·
> Matius 6:1 ⇒ **0** · ikon **SVG 2 segitiga** `currentColor` **15×15 px** · **tanpa angka Strong** ·
> lepas plugin **49 → 0** tombol, ayat tetap **66**, pasang lagi ⇒ **49** ✅ ·
> **15 uji K89 · 0 gagal** · versi **`v1Nov-c`** · HP **31,05 MB**.
>
> ✅ **1 Nov 2026 — K88g SELESAI: 🔤 PENJELASAN YUNANI → INDONESIA (TANPA ANGKA).**
> Bapak: *"dari angka km terjemahkan buat saya artinya jadi saya tidak perlu telusuri angka"*.
> **Unit = KATA Yunani**, ❌ bukan ayat: **1.296 kata layak dijelaskan** · **572 kata sudah ditulis** ·
> fungsi dilewati = 36,3 %) · **572 kata ⇒ 3.723 ayat (98,5 %)** · data **703,1 KB** · sidik `yl-3778-572-29-76d05fa0` ·
>
> ✅ **1 Nov 2026 — K77i SELESAI: 🖥 TAMPILAN IKUT SEGAR SESUDAH SINKRON MASUK.**
> 🔴 **Cacat terukur di APK:** `localStorage` **sudah** berisi catatan asli, tetapi **layar tetap
> menampilkan catatan contoh "Selamat datang di ANodes"** ⇒ pengguna mengira sinkron GAGAL.
> **2 sebab:** (a) `js/sinkron.js → ambil()` mengirim event **`anodes-sinkron-masuk`** tetapi
> **TIDAK ADA pendengarnya**; (b) `ANodesStore` menyimpan salinan di **MEMORI** (`let data`)
> ⇒ menulis langsung ke `localStorage` **tidak terbaca**. **Perbaikan:** `js/store.js` ➕
> **`muatUlang()`** · `js/editor.js` ➕ **`muatUlangCatatan()`** + pendengar event.
> **Bukti emulator:** sebelum layar *"Selamat datang di ANodes"* → tekan sinkron →
> sesudah layar *"Melakukan lebih dari diminta , terbaik"* **tanpa buka ulang aplikasi** ✅ ·
> **7 uji K77i · 0 gagal** · penanda **`v1Nov-h`** · HP **30,65 MB** · APK **30,30 MB**
> (`versionCode 18`). Rincian: `agents.md` **0a00d9v**.
>
> ✅ **1 Nov 2026 — K77h SELESAI: 🗑 CATATAN YANG DIHAPUS TIDAK KEMBALI DARI SERVER.**
> 🔴 **Cacat terukur:** PC **1 catatan**, server **5 catatan** ⇒ `ambil()` melaporkan
> **"4 catatan masuk"** ⇒ sinkron **hanya MENAMBAH, tidak pernah MENGHAPUS**.
> **Perbaikan — TOMBSTONE:** kunci **`anodes-sinkron-hapus`** · `catatHapus()` dipanggil
> `ANodesStore.buang()` · `gabungCatatan()` menyaring id yang sudah dihapus · `kirim()`
> menyertakan `d.hapus` di dalam muatan `anodes-catatan-v1`. **5 uji K77h · 0 gagal** ·
> server tinggal **1 catatan** + peta `hapus` 3 id. Rincian: `agents.md` **0a00d9u**.
>
> ✅ **1 Nov 2026 — K77g SELESAI: 🧪 ALAT UJI TIDAK BOLEH MENYENTUH SERVER SINKRON.**
> 🔴 **Cacat terukur:** menjalankan `tools/uji-cepat.js` di `index.html` membuat catatan **UJI**
> (`awal-1` berisi `"…sertaxyzwqv Taurat…"`) **TERKIRIM ke server sungguhan** — karena sinkron
> otomatis hidup & `tandaiBerubah()` dipanggil saat uji menyimpan catatan. **Perbaikan:**
> `js/sinkron.js → modeUji()` membaca **`window.__ANODES_UJI`** ⇒ `kirim`/`ambil`/`sekarang`/
> `tandaiBerubah`/`mulaiOtomatis` **semua dilewati**; `tools/uji-cepat.js` menyalakannya di awal
> & mematikannya di akhir. **5 uji K77g · 0 gagal** · server dibersihkan ⇒ **1 catatan** ·
> penanda **`v1Nov-g`** · HP **30,63 MB** · APK **30,29 MB** (`versionCode 17`).
> Rincian: `agents.md` **0a00d9t**.
> File ini untuk AI mana pun agar bisa membangun ulang ANodes **persis sama**.
> Lokasi proyek: `C:\data\ANodes` · **Update: 1 November 2026 (kasus terakhir: K77g SELESAI — 🧪 alat uji tidak boleh menyentuh server sinkron)**
> · berkas HP `ANodes-1berkas.html` **±30,63 MB** · uji cepat **1.005 uji, 0 gagal** (+ 46 uji K85)
>
> ✅ **1 Nov 2026 — K77g SELESAI: 🧪 ALAT UJI TIDAK BOLEH MENYENTUH SERVER SINKRON.**
> 🔴 **Cacat terukur:** menjalankan `tools/uji-cepat.js` di `index.html` membuat catatan **UJI**
> (`awal-1` berisi `"…sertaxyzwqv Taurat…"`) **TERKIRIM ke server sungguhan** — karena sinkron
> otomatis hidup & `tandaiBerubah()` dipanggil saat uji menyimpan catatan. **Perbaikan:**
> `js/sinkron.js → modeUji()` membaca **`window.__ANODES_UJI`** ⇒ `kirim`/`ambil`/`sekarang`/
> `tandaiBerubah`/`mulaiOtomatis` **semua dilewati**; `tools/uji-cepat.js` menyalakannya di awal
> & mematikannya di akhir. **5 uji K77g · 0 gagal** · server dibersihkan ⇒ **1 catatan** ·
> penanda **`v1Nov-g`** · HP **30,63 MB** · APK **30,29 MB** (`versionCode 17`).
> Rincian: `agents.md` **0a00d9t**.
> Lokasi proyek: `C:\data\ANodes` · **Update: 1 November 2026 (kasus terakhir: K77f SELESAI — 🧹 catatan contoh tidak boleh mengotori daftar/server)**
> · berkas HP `ANodes-1berkas.html` **±30,62 MB** · uji cepat **999 uji, 0 gagal** (+ 46 uji K85)
>
> ✅ **1 Nov 2026 — K77f SELESAI: 🧹 CATATAN CONTOH TIDAK BOLEH MENGOTORI DAFTAR/SERVER.**
> 🔴 **2 cacat terukur:** (a) `js/store.js → rapikan()` menulis `if (!c.waktu) c.waktu = Date.now()`
> ⇒ angka **`0` dianggap kosong** ⇒ perbaikan K77c **dibatalkan sendiri**; (b) `js/sinkron.js →
> kirim()` mengirim **seluruh** isi `anodes-catatan-v1` **tanpa menyaring** ⇒ server berisi
> **3 catatan** (2 contoh + 1 asli). **Perbaikan:** `waktu == null || === ''` ·
> **`saringContoh()`** di `kirim()` (kalau tidak ada catatan asli ⇒ **JANGAN kirim**, supaya
> server tidak ditimpa daftar kosong) · `gabungCatatan()` membuang contoh lokal & melewati
> contoh dari server. **BUKTI DI EMULATOR (APK dipasang BERSIH):** sebelum **1 catatan** ·
> `uji()` ⇒ *“Sambungan berhasil · 5 kunci di server”* · `sekarang()` ⇒ *“Selesai · 5 kunci
> terkirim”* · sesudah **1 catatan** · **server 1 catatan** · **7 uji K77f · 0 gagal** ·
> penanda **`v1Nov-f`** · HP **30,62 MB** · APK **30,29 MB** (`versionCode 16`).
> ⚠️ **`gradlew clean` WAJIB** sebelum build APK kalau sebelumnya build bertahap — tanpa clean
> dex lama tertinggal ⇒ APK membengkak **30,29 → 40,7 MB** (terukur). Rincian: `agents.md` **0a00d9s**.
> ✅ **1 Nov 2026 — K77e SELESAI: 🌉 JEMBATAN HTTP NATIVE — SINKRON DI APK AKHIRNYA JALAN.**
> 🔴 **Sebab terukur:** WebView Android **MEMBLOKIR** `fetch()` dari `file://` ke `https://`
> (CORS) — padahal di Chrome PC **berhasil**. **Perbaikan:** permintaan HTTP dikerjakan dari
> **sisi Android** (OkHttp) lewat `ANodesAndroid.httpKirim()`; `js/sinkron.js` memakainya
> kalau ada. ➕ izin `INTERNET`. **BUKTI DI EMULATOR (APK nyata):** `uji()` ⇒
> *“Sambungan berhasil · 5 kunci di server”* · `sekarang()` ⇒ *“Selesai · 5 kunci terkirim”* ·
> **9 uji logika + 10 uji di APK · 0 gagal** · penanda **`v1Nov-e`** · APK **30,28 MB**
> (`versionCode 15`). Rincian: `agents.md` **0a00d9r**.
> ✅ **1 Nov 2026 — K77c SELESAI: 🛡 CATATAN CONTOH TIDAK BOLEH MENIMPA CATATAN ASLI.**
> 🔴 **Temuan berbahaya:** karena K77b membuat sinkron **langsung siap**, perangkat **BARU**
> (HP setelah update APK) langsung menyinkron ⇒ catatan **CONTOH** (`waktu` = sekarang)
> **mengalahkan** catatan **ASLI** di server ⇒ **data hilang** (terukur `masuk 0 · keluar 2`).
> **Perbaikan 2 lapis:** `waktu: 0` di `js/store.js` + **`TANDA_CONTOH`/`ialahContoh()`**
> di `js/sinkron.js`. **6 skenario diuji, semuanya AMAN** · **10 uji K77c · 0 gagal** ·
> penanda **`v1Nov-c`**. Rincian: `agents.md` **0a00d9p**.
>
> ✅ **1 Nov 2026 — K77b SELESAI: ☁️ SETELAN SINKRON DIBUAT PERMANEN.**
> Alamat Worker + kunci aplikasi **DITANAM** sebagai `BAWAAN` di `js/sinkron.js` ⇒ perangkat
> baru / HP / profil Chrome baru **langsung bisa sinkron tanpa mengisi apa pun**.
> **27 uji K77b + 29 uji K77 resmi · 0 gagal** · sambungan **nyata** dari profil kosong
> **BERHASIL** (*“5 kunci di server”*) · token Turso **tetap hanya di Worker** ·
> penanda **`v1Nov-b`**. Rincian: `agents.md` **0a00d9o**.
>
> ✅ **1 Nov 2026 — K85 TAHAP 1 SELESAI: 🔤 PLUGIN INTERLINEAR (4 INJIL).**
> **3.778 ayat · 2.833 nomor Strong · 46 uji 0 gagal** · data **1.741 KB** · HP **30,56 MB**.
> ⚠️ **Arti Indonesia DITURUNKAN dari pemakaian nyata** (kata yang dipakai idkjv), ❌ bukan
> terjemahan mesin — kamus Strong berbahasa Indonesia yang beredar hanya **5 dari 14.197**
> entri terisi. Rincian: `rencanakerja.md` bagian **18.2** · `agents.md` **0a00d9n**.
> ✅ **3 Nov 2026 — K99 SELESAI: 📖 PLUGIN JUDUL PERIKOP.**
> **66 kitab · 2.573 judul · 132,5 KB** · **1.144/1.189 pasal = 96,2 %** · **42 uji K99 · 0 gagal** ·
> penanda **`v3Nov-g`** · HP **40,96 MB**. ❌ **tanpa tombol navbar** (navbar sudah 9 tombol ·
> 324 = 324 px) ⇒ ON/OFF lewat halaman keterangan plugin. Rincian: `rencanakerja.md`
> bagian **18.3.4** · `agents.md` **0a00d9y-m**.
> ✅ **3 Nov 2026 — K86 SELESAI: 🔀 PLUGIN PARALEL TERJEMAHAN (TB ⇄ AYT).**
> 🔴 **KOREKSI:** rencana menyebut **TSI**, ternyata paketnya **hanya 48 kitab** (18 kitab PL
> tidak ada) ⇒ dipakai **AYT** (CC BY-NC 4.0 · pemakaian pribadi). Bentuknya **bertumpuk per ayat**
> (❌ bukan 2 kolom — `.app` maks 480px ⇒ 2 kolom hanya ±220px). Rincian: `rencanakerja.md`
> bagian **18.3.3** · `agents.md` **0a00d9y-l**.
> ✅ **3 Nov 2026 — K87 SELESAI: 🕒 PLUGIN LINIMASA SEJARAH.**
> **450 peristiwa** berurutan menurut tahun (**−4003 … 57**) · **9 zaman** · **17.570 rujukan ayat**
> (**100 %** memetakan & **100 %** ayatnya ada) · data **213,4 KB** sidik **`lm-450--4003-57-3f9bc0c1`** ·
> halaman ke-**11** `#linimasa-halaman` · **56 uji K87 · 0 gagal** · penanda **`v3Nov-j`** ·
> HP **38,97 MB**. ⚠️ **Beda dari 📖 Sejarah Kitab** (per kitab) — ini **per peristiwa**, bisa
> dibandingkan menurut masa. Rincian: `rencanakerja.md` bagian **18.4.3** · `agents.md` **0a00d9y-q**.
> 📁 **K14 ditutup:** `C:\data\bible` sudah tidak ada ⇒ ➕ `tools/sumber-data.js` (`cariSumber()`).

> ✅ **30 Okt 2026 — K77 SELESAI (kode): ☁️ SINKRON PC ⇄ HP lewat Cloudflare Worker + Turso.**
> Bapak: *“PC dan HP data sync (sama) .. kerja dimana sama”* · *“token di mana saja jg ok.. ini
> bukan data rahasia”* · *“cloudflare sudah punya”* · arah = **keduanya**.
> **DIUKUR DULU:** `catatan[].waktu` **sudah ada** ⇒ ❌ tidak perlu ubah struktur data ·
> **4 kunci** disinkronkan (`anodes-catatan-v1` · `anodes-setting-v1` · `anodes-kamus-pribadi` ·
> `anodes-rantai-v1`) = **0,9 KB** pada data uji · ❌ **tidak** menyentuh data Alkitab 23 MB.
> **DIBUAT:** **`worker/worker.js`** (perantara — token Turso disimpan DI SINI, ❌ bukan di berkas
> HP) + **`worker/README.md`** + **`js/sinkron.js`** + modal **☁️ Sinkron** di menu File.
> **Cara kerja:** kirim → ambil → kirim → ambil · **bentrok per catatan** ⇒ `waktu` lebih baru
> menang · **anti-dobel** per `id` · **otomatis** (kirim 3 s · ambil 60 s) + **tombol** ·
> **offline** ⇒ aplikasi tetap jalan.
> **UJI:** **74 uji 0 gagal** (17 Node + 13 Worker + 30 browser + 14 HP) · penanda **`v30Okt-a`**.
> ⚠️ **Sisa 1 langkah Bapak:** deploy Worker + isi `TURSO_URL` (`libsql://…`) · `TURSO_TOKEN` ·
> `KUNCI_APP` ⇒ `worker/README.md`. Lihat `agents.md` **0a00d9f**.

> ✅ **28 Okt 2026 — K79 SELESAI: MENU 3 TINGKAT + KEPALA TIDAK LAGI DI BAWAH KAMERA.**
> Bapak: *“hasil apk (webview) di HP z fold 3 posisi sangat diatas sejajar dengan kamera ..
> sulit di touchscreen .. silahkan di design 3 tinggat atau 4.. kalau sekarang terlalu kecil
> dan tidak ingat ini apa.. di PC bisa diterima”* + *“jarak kolom jangan pake gang”*.
> **SEBAB TERUKUR:** `env(safe-area-inset-top)` **TIDAK ADA** di CSS · `viewport-fit=cover`
> **TIDAK ADA** · tombol kepala **31–33 px** (standar ≥44) · label **ikon saja**.
> Sebab kepala di kamera: `targetSdk 37` memaksa **edge-to-edge**.
> **PERBAIKAN:** `viewport-fit=cover` + **`js/layar.js` (BARU)** mengisi `--sa-top`/`--sa-bottom`
> + jembatan `ANodesAndroid.insetAtas()/insetBawah()` · **menu 3 tingkat** · tombol **44 px
> BERLABEL** · toolbar **2 baris 40 px** · seluruhnya di `@media (pointer: coarse)` ⇒
> **PC TIDAK berubah** · gap 2 px (tanpa “gang”).
> **HASIL:** Z Fold 3 344×938 ⇒ kepala **61** · info **56** · toolbar **89** · total **206** ·
> ruang tulis **701** · tombol terkecil **44 px** · **PC tetap 49/40/38/127** · ruang aman
> simulasi 34 px ⇒ kepala `top: 34` (dulu 0) · **K71 dijaga** · judul catatan **tidak terpotong**
> (bar info 2 baris) · **19 uji K79 · 0 gagal** · penanda **`v28Okt-a`**.
> **🐞 CACAT KEDUA:** `build-apk.bat` **tidak pernah** menyalin `ANodes-1berkas.html` →
> `assets/anodes.html` ⇒ APK berisi HTML **LAMA** walau `BUILD SUCCESSFUL`. Skrip kini menyalin
> lebih dulu + berhenti kalau sumber tidak ada. **APK akhir 39.737.327 byte** ·
> SHA-256 `18F989AE…7E3F` · aset **27.737.215 byte = sumber** ✅.
> **✅ DIKONFIRMASI BAPAK 28 Okt 2026:** *“ok jadi lebih baik.. thx”* — sudah dipasang & diuji
> di **Samsung Z Fold 3** ⇒ **K79 SELESAI**.
> 🔴 **KOREKSI K102 (6 Nov 2026):** ternyata **`@media (pointer: coarse)` TIDAK AKTIF di WebView
> APK** — terukur `coarse=false` · `fine=true` · `hover:none=true` · `maxTouchPoints=5`.
> ⇒ **seluruh tata letak K79 di atas TIDAK PERNAH JALAN di APK** (kepala 47 px · tombol 29 px ·
> label `display:none` · toolbar 34 px). **Perbaikan K102:** setiap `@media (pointer: coarse)`
> **WAJIB** dipasangkan **`(hover: none)`** ⇒ `@media (pointer: coarse), (hover: none)`.
> ⚠️ **Cacat ini tidak terlihat di Chrome** (Chrome melaporkan `coarse` dengan benar) ⇒
> **cacat tata letak HP WAJIB diukur di APK NYATA** (emulator + WebView DevTools).
> Lihat `agents.md` **0a00d9e** (K79) & **0a00d9y-s** (K102) · `rencanakerja.md` **D → K79 · K102**.

> ✅ **27 Okt 2026 — K78 SELESAI: DUA APK BERNama PAKET SAMA DIPISAHKAN.**
> Bapak: *“hasil apk tidak sama dengan versi file:///C:/data/ANodes/index.html (PC) tidak sama
> dengan versi webview”* ⇒ **SEBAB TERBUKTI:** ada **DUA** APK di `artifacts/` dengan
> **nama paket SAMA** (`com.anodes.app`) + **label SAMA** (`ANodes`), padahal **dua aplikasi
> berbeda** — `ANodes-debug.apk` (**native Kotlin K74** · `versionCode 3` · launcher `MainActivity` ·
> **tanpa `assets/`**) dan `ANodes-webview-debug.apk` (**WebView** · `versionCode 4` ·
> launcher `WebAppActivity` · `assets/anodes.html`).
> **Bukti APK WebView = PC:** diukur lewat **Chrome DevTools Protocol** pada emulator Android 34
> dan dibandingkan dengan PC lewat Playwright ⇒ **166 dari 171 nilai IDENTIK**; 5 sisanya hanya
> **lebar layar** (APK 412px vs PC 330px ⇒ `@media (max-width:400px)` di `css/app.css:129`).
> **Perbaikan:** `applicationId` → **`com.anodes.app.webview`** · label → **“ANodes WebView”** ·
> `versionCode 5 / 2.0.0-webview-k78` · `build-apk.bat` → **`ANodes-webview-debug.apk`** ·
> APK native lama → **`ANodes-NATIVE-K74-lama.apk`**.
> **Hasil:** APK **39.721.170 byte (37,9 MB)** · SHA-256 `757028AC…F40D` · aset
> `assets/anodes.html` **27.698.349 byte** = `ANodes-1berkas.html` ✅ · **38 uji JVM lulus**.
> ⚠️ **`versionCode` native (3) < webview (4)** ⇒ memasang native **di atas** webview **GAGAL**.
> Lihat `agents.md` **0a00d9d** · `rencanakerja.md` **D → K78**.

> 🔨 **26 Okt 2026 — K75 HASIL UJI APK SESI 3:** enam temuan editor native dicatat di
> `rencanakerja.md` papan A: daftar tidak berlanjut saat Enter · H1/H2 dan bold/italic belum
> bekerja bila dipilih sebelum mengetik · tabel masih string Markdown · warna hanya bekerja
> melalui seleksi · stabilo sudah benar. Akar: belum ada active/pending typing style dan
> penanganan Enter; belum ada tabel native. **Implementasi K75 sudah dimulai tetapi BELUM selesai:**
38 uji JVM lulus; instrumentasi terakhir **3/11 lulus**, sehingga **belum ada APK K75**.
Checkpoint: `backups/k75-checkpoint-20261026/`. Jangan melanjutkan dengan mengganti controller
per recomposition—pending style/seleksi/undo ikut hilang. Sinkronisasi `TextFieldValue` dan IME
masih perlu diisolasi satu kasus dengan pengukuran, bukan suite berulang tanpa bukti.
> 🔴 **Aturan wajib background:** setiap proses background harus diumumkan di layar sebagai
> **“sedang proses di background: [nama proses] — perkiraan ±N menit”**. Jangan menjawab
> “tidak tahu”; kabari jika lewat estimasi dan laporkan waktu nyata saat selesai.
> Lihat `agents.md` **0a00d9** dan aturan background di bagian atas.

> 📱 **25 Okt 2026 — K74 APK NATIVE (Sesi 1–3):** APK **tanpa WebView**, dari nol,
> **`android-native/`**: **Kotlin + Jetpack Compose**, AGP 9.4.1 · SDK 37 · min SDK 26 ·
> navigasi 8 halaman · tema acuan · ikon. **Sesi 2:** Room 2.8.5/KSP 2.3.12 ·
> catatan CRUD/otomatis/kategori/cari/soft delete · outbox lokal. HP satu kolom; tablet
> **≥600dp** daftar + editor berdampingan. **Sesi 3:** `TextFieldValue` + `AnnotatedString`,
> codec JSON versi 1 pada Room (teks lama tetap terbaca), format/judul/daftar/warna/hapus
> selektif/undo-redo · DataStore font/kecerahan/jenis huruf/toolbar · autosave 700 ms.
> **22 unit test + 2 instrumentasi Compose, 0 gagal** (seleksi → toolbar/popup → restart).
> Build: `android-native/build-apk.bat` ⇒ **`artifacts/ANodes-webview-debug.apk`** (K78; dulu
> menyalin ke `ANodes-debug.apk` — nama itu sekarang dipakai APK native lama
> `ANodes-NATIVE-K74-lama.apk`, **20.537.217 byte**).
> `index.html` tetap acuan web, **bukan** dibungkus; IndexedDB tidak dipakai pada native.
> **Belum ada Turso/Worker/WorkManager/pemulihan/impor/ekspor/data Alkitab/PDF/paritas plugin/release.**
> Sesi 4–5 = data Alkitab lokal/baca pasal/pencarian/tanda. Lihat `agents.md` **0a00d6–0a00d8**.
>
> ### 📱 26 Okt 2026 — **K76: APK WEBVIEW (JALUR YANG DIPAKAI SEKARANG)**
>
> Bapak memilih **APK WebView** supaya hasilnya **sama persis** dengan `index.html`:
> `WebAppActivity.kt` memuat `file:///android_asset/anodes.html` (salinan `ANodes-1berkas.html`).
> **IndexedDB + localStorage berfungsi normal** di dalam APK ⇒ **cukup** untuk satu perangkat;
> **Turso DITUNDA** (hanya perlu untuk sinkron PC↔HP, lewat **Cloudflare Worker**).
> Jembatan Android: `ANodesAndroid.simpanBerkas()` (ekspor → **Download**) · `.cetak()`
> (`window.print` → PrintManager) · `.versi()` · impor lewat `onShowFileChooser` ·
> **tombol Back berlapis** `ANodesAndroidKembali()` (gudang → modal → halaman → keluar).
> APK `artifacts/ANodes-webview-debug.apk` **37,9 MB** · `versionCode 5 / 2.0.0-webview-k78`
> (K78: `applicationId` **`com.anodes.app.webview`** · label **“ANodes WebView”**).
> **6 plugin jalan** (Alkitab · Ayat Terkait · Kamus · Penguat · Sejarah · Peta) — dibuktikan di
> emulator Android 34 lewat WebView DevTools. `MainActivity` native (K74/K75) tetap ada tetapi
> **tidak dibuka dari launcher**. Lihat `agents.md` **0a00d9c** · `rencanakerja.md` **D → K76**.
>
> ⚠️ **PELAJARAN APK WEBVIEW:** (1) `noCompress html` membuat APK **2,5× lebih besar** (75,9 → 37,9 MB) ·
> (2) **tombol Back wajib ditangani** — tanpa itu pengguna keluar aplikasi padahal hanya ingin
> menutup halaman · (3) `window.print()` **tidak ada** di WebView ⇒ jembatani ke `PrintManager` ·
> (4) `<input type=file>` butuh **`onShowFileChooser`** · (5) `textZoom = 100` supaya skala huruf
> ANodes tidak digandakan skala sistem.

---

## 0. 🔍 KONSEP & METODE INTI — baca ini DULU

> Bagian ini merangkum **cara berpikir** sistem ANodes: batasan, arsitektur, aturan kerja,
> dan cara memeriksanya. Bagian A–E di bawah adalah **rincian teknis**; bagian ini menjelaskan
> **mengapa** rincian itu berbentuk demikian.

### 0.1 Apa itu ANodes

Aplikasi **catatan/penulisan** bergaya aplikasi MarkDown — kepala hitam, isi putih, sederhana —
yang dipakai untuk **menulis catatan sambil menggali Alkitab**. Berkasnya **HTML/CSS/JS vanilla**,
**tanpa server**, dibuka lewat `file://`. Tampilannya **selalu gaya HP** (kolom ±480px di tengah),
berlaku juga di PC.

Kekuatan utamanya bukan pada catatannya, melainkan pada **kemampuan menggali**: setiap nama ayat
yang ditulis di catatan berubah menjadi tautan; ayat Tuhan punya **tafsiran per ayat** (penguat);
kata istilah bisa diklik untuk membuka keterangannya; kaitan antar ayat bisa disusun jadi
**rantai penelusuran** yang **ditempel kembali ke catatan**.

### 0.2 Batasan teknis yang WAJIB dipatuhi (tidak bisa dinegosiasi)

| Batasan | Sebab | Akibat pada rancangan |
|---|---|---|
| **Tanpa server** (`file://`) | aplikasi harus jalan di PC & HP dengan cara di-klik biasa | ❌ **tidak boleh** `fetch()` · data besar **wajib ditanam** lewat `<script src>` |
| **Data besar tidak boleh di `localStorage`** | `localStorage` hanya ±5 MB & memblokir halaman | data >±1 MB ke **IndexedDB** (`anodes-plugin-db` / toko `data`) |
| **Satu berkas untuk HP** | berkas `css/`, `js/`, `plugin/` tidak ikut terkirim ke HP | dibuat `ANodes-1berkas.html` oleh `tools/buat-1-berkas.js` |
| **Isi catatan pengguna tidak boleh rusak** | catatan = data milik pengguna | semua fitur plugin harus bisa **dicabut** tanpa menyentuh catatan |
| **Tampilan gaya HP di semua layar** | satu rancangan untuk PC & HP | wadah `.app` ±480px dipusatkan · ukuran huruf & tombol sama |

### 0.3 Arsitektur halaman — **11 halaman**, semuanya **anak `body`**

Halaman ANodes **bukan** panel di dalam catatan, melainkan **sebelas halaman sejajar** yang
saling menyembunyikan:

```
body
 ├── #app-utama         ← CATATAN (tulis)          ── selalu jadi tempat pulang
 ├── #baca-alkitab      ← BACA ALKITAB
 ├── #kerja-ayat        ← HALAMAN KERJA (susun rantai ayat)
 ├── #kamus-halaman     ← KAMUS ISTILAH
 ├── #penguat-halaman   ← PEMBACA PENGUAT (tafsiran per ayat)
 ├── #sejarah-halaman   ← SEJARAH ALKITAB (prakata)
 ├── #peta-halaman      ← 🗺️ PETA ALKITAB   (K68 — halaman ke-7)
 ├── #bookmark-halaman  ← 🔖 BOOKMARK AYAT  (K81 — halaman ke-9)
 ├── #baca1tahun-halaman ← 🗓️ BACAAN 1 TAHUN (K96 — halaman ke-10)
 ├── #berkas-halaman    ← 🗂️ BERKAS TERSIMPAN (K28h — daftar rantai 🌿 Ayat Terkait)
 └── #linimasa-halaman  ← 🕒 LINIMASA SEJARAH (K87 — halaman ke-11 · 450 peristiwa)
```

**Tiga aturan wajib (pelajaran mahal):**

1. **Halaman WAJIB anak `body`** — kalau ditaruh di dalam `#app-utama`, saat catatan
   disembunyikan halaman itu **ikut tersembunyi** (pernah terjadi: “baca tidak keluar &
   catatan hilang”).
2. **`.app[hidden]` wajib `display:none !important`** — karena `display:flex` **menimpa**
   atribut `hidden` bawaan browser.
3. **Halaman menyembunyikan DIRINYA SENDIRI** saat pindah — mis. `pindahKeBaca()` hanya
   menutup `#app-utama`; halaman lain (Kamus/Sejarah/Peta) yang harus menyembunyikan dirinya.

### 0.4 Penyimpanan — dibagi 3 sesuai ukuran & sifat data

| Wadah | Isi | Contoh kunci |
|---|---|---|
| **`localStorage`** (`anodes-…`) — 👤 **ber-awalan email** | data kecil & cepat: catatan, pengaturan, status plugin, pilihan tampilan, catatan pribadi. Sejak **K100** tiap pengguna punya awalan sendiri: **`u:<email>::anodes-…`** (tanpa email ⇒ bentuk lama) | `anodes-catatan-v1` · `anodes-setting-v1` · `anodes-plugin-v1` · `anodes-insert-ayat` · `anodes-kamus-pribadi` · `anodes-rantai-v1` |
| **IndexedDB** (`anodes-plugin-db` / toko `data`) | data besar: Alkitab, kaitan ayat, kamus, penguat, sejarah · ⚠️ **tidak** dipisah per email (isinya data bersama, bukan data pribadi) | `alkitab-tb` · `silang` · `kamus` · `penguat` · `sejarah` |
| **`js/markdown.js`** | pengolah markdown (dulu menumpang di `js/dokumen.js`) — dipakai **Impor `.md`/`.txt`** · tombol **“📖 Rapi”** · rapikan tempelan (K44) | `window.ANodesMarkdown` |
| **☁️ Turso** (lewat Cloudflare Worker) | **sinkron PC ⇄ HP** — **6 kunci** kecil (catatan · pengaturan · istilah pribadi · rantai · bookmark · bacaan 1 tahun) · sejak **K100** nama baris di server = **`<email>\|anodes-…`** ⇒ antar pengguna tidak saling menimpa | `anodes-catatan-v1` · `anodes-setting-v1` · `anodes-kamus-pribadi` · `anodes-rantai-v1` · `anodes-bookmark-v1` · `anodes-baca1tahun-v1` |

👤 **K100 — PEMISAHAN DATA PER EMAIL (3 Nov 2026).** `js/pengguna.js` (`window.ANodesPengguna`)
menyimpan email di **`anodes-pengguna-email`** (⚠️ **tanpa** awalan — ia penentu awalannya), lalu
`kunci('anodes-x')` mengembalikan **`u:<email>::anodes-x`**. **6 modul** memakai satu pembantu
`kunciData()`; struktur data **tidak berubah**. Email ditanya **sekali** saat pertama membuka
(bisa dilewati) dan bisa diganti lewat **`File ▼ → 👤 Pengguna…`**. Migrasi **WARISI**: kunci lama
tanpa awalan **dipindah** (❌ bukan diduplikasi) ke email pertama.

⚠️ **K77 — token Turso ❌ JANGAN ditanam di berkas ANodes.** Berkas itu dikirim ke HP; siapa pun
yang membukanya bisa membaca token. Token disimpan di **Cloudflare Worker** (`worker/worker.js`);
berkas ANodes hanya tahu **alamat Worker + kunci aplikasi**. Sinkron **per catatan** (per `id` +
`waktu`) — ❌ bukan per berkas — supaya dua perangkat bisa mengubah catatan berbeda tanpa saling
menimpa. Urutan **kirim → ambil → kirim → ambil** mencegah menimpa data baru di server.

⚠️ **Pola muat data plugin:** baca **BERKAS DATA lebih dulu** → simpanan IndexedDB dipakai
**hanya kalau `meta.sidik` sama**. Kalau sidik berbeda ⇒ simpanan **ditimpa**. (Tanpa ini,
menambah kitab baru tidak akan terlihat pengguna — sidik lama dianggap masih sah.)

### 0.5 Sistem plugin — inti rancangan ANodes

ANodes adalah **wadah**; Alkitab, Kaitan Ayat, Kamus Istilah, Penguat, Sejarah, **Peta** = **plugin**
yang bisa dipasang/dilepas sendiri. Tujuannya: pengguna bisa memakai hanya yang dia butuh,
dan **mencabut plugin tidak boleh merusak catatan**.

> 📌 **5 Okt 2026 (K73):** 🗺️ **bagian Peta di panel bawah catatan** — Bapak: *“di catatan / di
> note .. ketik **sungai yordan** juga harusnya ada daftar peta .. tampil ada di **kolom paling
> bawah note**.. km bisa liat **ayat & istilah** .. di tempatkan di sana”*.
> ⇒ panel **📋 Ayat & Istilah** ditambah bagian **🗺️ Peta (n)** — chip nama tempat (aturan
> tersempit K69d: `dan` dibuang · `teman` wajib besar · `israel/persia/nil/kreta/antiokhia/sela`
> ditolak) · diklik ⇒ **mini-peta + keterangan + rujukan** (mesin `ANodesPetaAyat.gambarMini()`
> dipakai ulang — ❌ tanpa mesin baru) · **satu slot** (nama lain ⇒ ditimpa · nama sama ⇒ tertutup) ·
> rujukan diklik ⇒ **halaman baca Alkitab** · plugin 🗺️ dilepas ⇒ bagian hilang & **catatan UTUH** ·
> **18 uji K73 · 0 gagal** · HP **26,99 MB** · penanda **`v5Okt-i`**. Lihat **`agents.md` 0a00d5**.
> ⚠️ **PELAJARAN:** nama tempat dihitung **SEBELUM** pemeriksaan “tidak ada isi” — kalau tidak,
> catatan yang **hanya** menyebut nama tempat akan **menyembunyikan panel**.
>
> 📌 **5 Okt 2026 (K72):** 🗺️ **peta lama SVG dihapus · dasar peta selalu citra NASA** — Bapak:
> *“saya minta map lama svg (sederhana) di hapus saja.. supaya lebih irit space · jadi tidak perlu
> ada tombol [bumi] langsung tampil map baru saja”* ⇒ tombol **`🌍 bumi`** + **seluruh jalur peta
> lama** (gradien laut · daratan polos · poligon laut/darat · garis sungai & danau · ikon gunung
> 3 puncak + salju · filter `fLembut`/`fPantai`) **DIHAPUS** · `setCitra` dibuang ·
> **`citraHidup()` = true** · peta kini **9 elemen** · **11 uji K72 · 0 gagal** · penanda **`v5Okt-h`**.
> ⚠️ `plugin/peta/data/bumi.js` (**380 KB**) **TETAP dipakai** — itu **citra NASA** yang kini jadi
> **dasar peta**, ❌ bukan yang dihapus.
>
> 📌 **5 Okt 2026 (IDE BARU `I-16`):** 🧩 **plugin mandiri (tanpa note)** — Bapak bertanya apakah tiap
> plugin bisa **berdiri sendiri** (`.html` mandiri) lalu **sync** kalau bertemu note/plugin lain.
> ⇒ **DICATAT sebagai DISKUSI** (`rencanakerja.md` bagian **17**), ❌ belum diproses.
> **Penentu = 3 hal yang BELUM diukur:** (1) apakah `localStorage` **dibagi** antar berkas `.html`
> di `file://`? · (2) apakah `IndexedDB` **dibagi**? · (3) apakah `BroadcastChannel`/`storage` event
> jalan di `file://`? ⇒ kalau (1)/(2) TIDAK, satu-satunya jalan = **satu berkas per plugin**
> (bertentangan dengan “irit space”).
>
> 📌 **5 Okt 2026 (K71):** 🎛 **menu berukuran TETAP + ⬆ peta beku** — Bapak: *“setting font
> jika 15 bisa terlihat semua .. jika font di set 22 sudah terpotong.. seharusnya font jangan
> pengaruh pada menu atau pengaruh pun tidak boleh hilang · Peta.. peta di freeze.. kalau titik
> air dan lain2 sampai banyak.. di scroll kebawah peta harusnya tetap terlihat”*.
> **SEBAB (diukur):** ukuran menu dikalikan `var(--skala)` ⇒ font 22 ⇒ kepala **304/370** ·
> toolbar **304/341** (meluber) · peta **hilang ke atas** saat daftar digulir.
> ⇒ **Menu = angka px TETAP** (font 12–24: kepala **304/304** · toolbar **304/304** · tinggi
> **47/32** · huruf tombol **13/12**) · **isi catatan tetap ikut ⚙** · **peta BEKU**
> (kepala `sticky top:0` · panggung `sticky top:42px` · tinggi baris dikunci dari JS) ·
> **18 uji K71 · 0 gagal** · HP **26,31 MB** · penanda **`v5Okt-g`**.
> ⚠️ **PELAJARAN:** ukuran **menu** ❌ jangan pakai `var(--skala)` — tombol menu baru pakai
> **angka px**; `position: sticky` **butuh ruang** di wadah induknya. Lihat **`agents.md` 0a00d4**.
>
> 📌 **5 Okt 2026 (K69f):** 🔠 **nama titik di Peta ikut pengaturan ukuran huruf** — Bapak:
> *“nama2 titik sangat kecil dibuat ukuran font sesuai pengaturan / setting”*.
> Sebab (diukur): **3 tempat** ukurannya **tetap** — chip daftar lokasi (`11.5px`) ·
> **nama DI DALAM peta** (`const FONT = {kota:13, laut:17, …}`) · mini-peta (`.pl-mlbl 13px`).
> ⇒ Sekarang: **`peta.js → fontPeta()`** & **`ayat.js → fontMini()`** (skala = `data.font ÷ 16`) +
> **seluruh** CSS Peta `calc(Npx * var(--skala))` + **`anodes-setting-berubah`** (dari
> `js/setting.js`) ⇒ nama **digambar ulang saat itu juga**.
> ⚠️ **Aturan tersempit:** pada **16px ukurannya SAMA PERSIS** seperti sebelumnya.
> Terukur: chip **8,625 → 11,5 → 17,25px** · nama peta **12,75 → 17 → 25,5** (viewBox) ·
> mini-peta **9,75 → 13 → 19,5px** · **731 uji 0 gagal** (K69f-01…14) ·
> HP **26,28 MB** · penanda **`v5Okt-f`**.
> ⚠️ **PELAJARAN:** ukuran yang dipasang **lewat JS** ❌ tidak ikut berubah sendiri seperti CSS —
> perlu **pemberitahuan + gambar ulang**. Lihat **`agents.md` 0a00d3**.
>
> 📌 **5 Okt 2026 (K70):** 🔌 **sakelar ON/OFF penandaan catatan** — tombol **`🔗 ON` ⇄ `🔗 OFF`**
> di **bar info** (❌ bukan di kepala — diukur: kepala HP 320px sisanya **0px**). **BAWAAN = OFF**
> supaya mengetik **tanpa lag**; tekan ON ⇒ **semua hidup sekaligus** (ayat + istilah + 🖊).
> 🔴 **“cursor lompat” TERBUKTI HILANG** (ketikan keyboard nyata). 1 pintu:
> `tandaiSemuaTanda()` keluar saat OFF · `ANodesAlkitab.aktif()` & `ANodesKamusTampilan.bisaTandai()`
> ikut membaca sakelar. Kunci **`anodes-tandai-note`** (bawaan tidak ada = OFF).
> **717 uji · 0 gagal** (K70-01…19).
> 📌 **5 Okt 2026 (K69):** plugin 🗺️ **Peta** (halaman ke-7) disinkronkan ke proyek PC —
> sebelumnya hanya ada di versi HP. Keadaan proyek & `ANodes-1berkas.html` sekarang **sama**
> (26/26 berkas bundle). Lihat **`agents.md` 0a00cd**.
>
> 📌 **5 Okt 2026 (K69 b–e):** 📍 **kata lokasi di halaman baca Alkitab** — ayat yang memuat
> nama tempat mendapat tombol **`📍`**; diklik ⇒ **kolom mini-peta + keterangan** di bawah ayat;
> **>1 lokasi ⇒ chip bergantian di kolom yang sama**. Pola **K54** (sambungan resmi
> `tambahPenghias()`) · **22 uji · 0 gagal** · lihat **`agents.md` 0a00cf**.
>
> 📌 **5 Okt 2026 (K69d):** 🧹 **4 cacat DATA peta diperbaiki** — **diukur dulu** (234 entri ·
> 224 entri wadah indeks · 31.102 ayat): **(a)** ejaan TB ≠ nama katalog ⇒ **63 entri 0-cocok** ·
> **(b)** **3 rujukan 2-bagian** · **(c)** **`16.22.8`** (Yope — Nehemia hanya 13 pasal) ·
> **(d)** ref **`25.3.3`** = **Ratapan 3:3** (bukan kota Teman). **Aturan tersempit:**
> **bentuk dasar** (buang kurung, `Yope (Jaffa)` → `Yope`) + **daftar alias sempit** ·
> **`KEMBAR_TOLAK`** (`israel · persia · nil · kreta · antiokhia · sela`) ·
> **`BESAR_TAMBAHAN`** (`raba` — huruf besar **15 ayat semuanya kota** ✓).
> **Hasil:** ayat bertombol 📍 **3.591 (11,5 %) → 4.441 (14,3 %)** ·
> entri 0-cocok **63 → 0** (7 sisanya **kembar**) · rujukan tak sah **4 → 0** ·
> ayat >1 lokasi 579 → **955** · maks **8** · **76 uji · 0 gagal** · HP **26,20 MB** ·
> penanda **`v5Okt-d`** · lihat **`agents.md` 0a00d1**.
>
> 📌 **5 Okt 2026 (K69c):** 🗺️ **bentuk mini-peta disamakan dengan halaman Peta** — sebabnya
> **terukur**: (1) kotak proyeksi dulu **0,42:1** vs panggung **2,40:1** ⇒ citra **ditarik 5,76×**;
> (2) proyeksi **1:1** sedangkan halaman Peta **F = 1,5** ⇒ gepeng. Sekarang **F = 1,5** + kotak
> **2:1** + lebar bawaan **±8°** (citra penuh untuk **167/191** = 87 %; dulu ±21° = **0 %**).
> **13 uji · 0 gagal** · HP **26,18 MB** · lihat **`agents.md` 0a00d0**.
**Kontrak plugin** (`plugin/<id>/plugin.js` → `window.ANodesPlug.push({…})`):

| Kunci | Isi |
|---|---|
| `id` · `nama` · `namaBar` · `ikon` · `versi` · `penulis` · `ukuran` | identitas |
| `ringkas` | satu baris di daftar gudang |
| `angka[]` | kotak angka ringkas (`{n, l}`), mis. `66 kitab` · `31.102 ayat` |
| `keterangan` · `fitur[]` · `cara[]` · `catatan[]` | isi halaman keterangan (gaya WordPress) |
| `siap` | `true` kalau data sudah lengkap |
| `tombolBuka` + `buka()` | tombol **▶ Buka** di kartu gudang **dan** baris `[🧩 ▼]` di toolbar tulis |
| `tombol[]` | tombol tambahan di navbar halaman baca (mis. `📤`) |
| `tombolInfo[]` | tombol tambahan di **halaman keterangan** plugin (mis. `📖 sejarah`) |
| `pilihanTampil[]` + `caraTampil()` + `pilihCara(id)` | pilihan cara tampil milik plugin |
| `saatDipasang()` / `saatDilepas()` | jalan saat Pasang/Lepas — **`saatDilepas` wajib bersih-bersih** |
| `siapkanOtomatis()` | **WAJIB ADA** — kalau tidak, setelah F5 (plugin tetap terpasang) fitur tidak hidup lagi |

**Rambu emas plugin:**

- **Plugin tidak boleh tahu plugin lain.** Alkitab tidak menyebut Kamus, Penguat, atau Sejarah.
  Yang dipakai adalah **sambungan resmi** (di bawah).
- **Kontrak `tombolBuka` + `buka()` adalah pintu masuk yang seragam.** Kalau ada plugin yang
  “tombolnya tidak melakukan apa-apa”, **periksa dulu apakah kedua kunci itu ada**.
- **Kalau plugin dilepas, yang hilang HANYA hiasannya** — catatan, isi Alkitab, dan plugin lain
  tetap utuh (selalu dibuat ujinya).

**Sambungan resmi (pintu antar-plugin — ❌ jangan diganti cara lain):**

| Sambungan | Milik | Gunanya |
|---|---|---|
| `tambahPenghias(fn)` · `jalankanPenghias(ctx)` | halaman baca Alkitab **dan** halaman Penguat | plugin lain menitipkan hiasan setiap kali halaman digambar ulang |
| `daftarPintasan(nama,urut,buat)` · `lepasPintasan` · `segarkanPintasan` | halaman baca | plugin menaruh **satu** tombol di bar pintasan pasal (❌ supaya tidak menumpuk per ayat) |
| `tandaiWadahHalaman(wadah)` · `bersihTandaWadah(wadah)` | mesin Alkitab | menandai tautan ayat di **halaman baca-saja** (tanpa kursor, aman) |
| `pasangKaitAyatHalaman(wadah, jenis)` | tampilan Alkitab | memasang **pengait klik** tautan ayat di halaman lain |
| `daftarPemulihHalaman(jenis, fn)` · `ingatAsalAyat()` · `kembaliKeHalamanAsalAyat()` | tampilan Alkitab | mengingat halaman asal supaya tombol 🏠 kembali **ke tempat yang benar** |
| `tandaiHalaman(wadah)` | tampilan Kamus | menandai **istilah + sekaligus memasang pengait kliknya** |
| `terimaPaket` · `tempelPaket` · `angkatPaket` · `ingatPosisi` · `pulihPosisi` | `js/editor.js` (`window.ANodesEditor`) | jalur resmi mengirim ayat ke catatan + mengembalikan posisi tulis |
| `tambahPenghiasTanda(fn)` · `lepasPenghiasTanda(fn)` · `jalanPenghiasTanda(ctx)` · `segarkanTanda()` | `js/editor.js` (`window.ANodesEditor`) | **K45 i** — plugin menitipkan hiasan **di dalam catatan** setiap kali penandaan ayat/istilah selesai digambar (dipakai tombol `🖊`) |
| `window.ANodesTandaKelas` | tanda bersama | daftar kelas tanda (`ay-link`, `kamus-istilah`) supaya **dua plugin tidak saling merusak** |

### 0.6 Cara kerja penandaan (ayat & istilah) — dua hal yang TERPISAH

Ini sumber kesalahan yang paling sering terulang, jadi ditulis tegas:

```
   PENANDAAN  (mesin)   →  membungkus teks jadi <span class="…">  = tampilan
   PENGHAIT   (tampilan) →  addEventListener klik pada wadah      = bisa diklik
```

**“Sudah ditandai” ≠ “sudah bisa diklik”.** Keduanya **wajib dipasang di wadah yang sama**.
Pernah terjadi: tanda ada di DOM, angkanya benar, **tetapi klik tidak berbuat apa-apa**
karena pengaitnya hanya dipasang di `#editor`.

Aturan teknis penandaan:

| Aturan | Sebab |
|---|---|
| Membungkus lewat **POTONGAN TEKS (TreeWalker)** | tag HTML (tabel, tebal, tautan) **tidak pernah tersentuh**. ❌ jangan `innerHTML.replace` |
| Tanda **tidak pernah disimpan** | sebelum simpan/ekspor dibersihkan (`bersihSemuaTanda`) supaya catatan tetap teks biasa |
| Melewati node yang **sudah bertanda** (milik plugin mana pun) | dua plugin menandai satu editor tanpa saling merusak |
| Kursor **tidak boleh lompat** saat menandai | penandaan dipotong **hanya** pada kata di kursor, bukan seluruh paragraf; posisi kursor dihitung **jumlah huruf** lalu dipulihkan |
| Tanda pencarian hanya **tampilan** | dibuang saat pencarian ditutup/diganti/halaman ditinggalkan |

### 0.7 Aturan kerja (JANGAN dilanggar)

1. **Setiap order DITULIS dulu ke papan order** (`rencanakerja.md` bagian 0:
   A. KASUS BELUM SELESAI · B. ANTREAN KERJA · C. IDE · D. SELESAI) — **baru dikerjakan
   satu butir per giliran**. Satu hal hanya boleh muncul di **satu** tabel.
2. **Kerja tahap demi tahap.** Fitur baru ⇒ paparkan tahapan (a, b, c) dulu ⇒ tunggu persetujuan.
3. **Backup sebelum mengubah** ⇒ folder `backups/<kasus>-<tanggal-jam>/`.
4. **Penanda versi setiap perubahan tampilan** (`const VERSI = 'v…'` + `…Tampilan.versi()`)
   supaya bisa dibuktikan berkas mana yang termuat.
5. **Perbarui dokumen tiap tahap** (`agents.md`, `prompt.md`, `CHANGELOG.md`, `panduan.md`
   + papan order) — **hanya di `C:\data\ANodes\`**.
6. **Sebutan umum di teks yang tampil di layar** — ❌ jangan kata “Bapak”; pakai
   **pengguna · Anda · catatan pengguna**. Komentar kode & dokumen `.md` boleh.
7. ⏱️ **BERI PERKIRAAN WAKTU SEBELUM MULAI — SYARAT WAJIB** (Bapak 5 Okt 2026):
   > Bapak: *“setiap perbaikan atau develop sistem baru **harus atau wajib memberikan perkiraan
   > waktu** kepada saya.. supaya tidak harus tunggu yg tidak jelas ...”*

   | Kewajiban | Contoh |
   |---|---|
   | **Sebelum mulai** tulis **“⏱️ Perkiraan: ±N menit”** | *“⏱️ Perkiraan: ±3 menit”* |
   | Angka **nyata**, ❌ bukan “sebentar”/“cepat” | — |
   | **Lewat perkiraan ⇒ langsung kabari** | *“sudah 5 menit, sisa ±2 menit”* |
   | **Saat selesai** tulis waktu **nyata** | *“✅ Selesai — nyata ±2 menit (perkiraan ±3)”* |
   | **Pekerjaan panjang ⇒ pecah** & sebut waktu tiap butir | *“POSISI 2 dari 5 · sisa ±4 menit”* |
   | Berlaku **SEMUA**: perbaikan · revisi · fitur · uji · build | — |
   | **PROSES BACKGROUND (26 Okt 2026)** | Tulis **“sedang proses di background: [nama proses] — perkiraan ±N menit”** · termasuk build/test/server/emulator dan proses yang berpindah ke background · ❌ jangan jawab “tidak tahu” · lewat estimasi ⇒ kabari posisi + sisa waktu · selesai ⇒ hasil + waktu nyata |

   Dan **tampilkan posisi “n dari m”** untuk pekerjaan beberapa langkah.

### 0.8 Metode menguji & memeriksa

| Metode | Isi |
|---|---|
| **🔴 KECEPATAN — revisi kecil JANGAN pakai suite** | Untuk perubahan kecil cukup **pemeriksaan pendek `page.evaluate` ±10 detik** (baca angka nyata). Suite (`tools/uji-cepat.js`) memakai plugin lepas/pasang + data besar ⇒ **menit-menitan**. Kalau memang perlu suite ⇒ **saring blok**: setel **`window.__BLOK = ['K70']`** sebelum menempel (meringkas **laporan**, langkahnya tetap jalan). ❌ **jangan** menempel berkas uji berulang-ulang, dan ❌ **jangan** `buat-1-berkas.js` (26 MB) tiap habis uji. |
| **Uji blok terkait saja** | `tools/uji-cepat.js` (±15 s s.d. beberapa menit karena menyiapkan plugin; saring dengan `__BLOK`). Uji penuh (`tools/uji-toolbar.js`, ±4 menit) **butuh izin**. |
| **Klik NYATA, bukan panggil fungsi** | uji lewat klik sungguhan + `window.onerror`; cacat besar (mis. klik mati) hanya ketemu dengan cara ini |
| **🔴 “menghitung elemen ≠ menguji yang terlihat”** | uji tampilan **WAJIB** memakai **`getComputedStyle`** (`color` · `borderBottomStyle` · `cursor`) **dan diuji di WADAH TEMPAT REVISI** (mis. `#sj-isi`), ❌ bukan hanya `#editor`. Wadah berbeda = aturan CSS berbeda. |
| **🔴 Ukur data dulu sebelum memutuskan aturan** | kalau ada yang salah (mis. satu kata salah ditandai), **hitung dulu** berapa yang sah akan ikut rusak. Aturan umum yang merusak 24 hal untuk memperbaiki 1 hal **wajib ditolak** ⇒ pakai aturan **tersempit**. |
| **Label uji ❌ jangan memuat tanda ❌** | penyaring kegagalan memakai `includes('❌')` ⇒ label yang memuatnya dihitung **GAGAL PALSU**. |
| **Ubah BAWAAN (`default`) ⇒ uji LAMA wajib dinormalkan** | contoh nyata K70: penandaan catatan jadi **bawaan OFF** ⇒ 3 uji K45 i/K61 langsung gagal palsu (mengandaikan penandaan hidup). Alat uji harus **menormalkan keadaan** dulu; blok yang menguji bawaan itu sendiri yang membuktikannya. |
| **🔴 Ukuran yang dipasang lewat JS ≠ CSS** | CSS ikut sendiri (`calc(Npx * var(--skala))`), tetapi ukuran yang dipasang **lewat JS** (`el.style.fontSize`) **wajib dihitung sendiri** dengan skala yang sama. Contoh nyata K69f: nama peta (`const FONT`) & mini-peta **lepas** dari pengaturan. Saat pengaturan berubah, nilai JS **tidak** ikut berubah sendiri ⇒ perlu **pemberitahuan** (`anodes-setting-berubah`) + **gambar ulang**. |
| **Ukuran label SVG memakai satuan viewBox** | kanvas peta `viewBox 480` (diperkecil ±0,66× ke layar) ⇒ angka font di dalam SVG **bukan px layar**. Faktor skala dipakai **apa adanya** supaya pada 16px hasilnya **sama** seperti sebelum revisi (aturan tersempit). |
| **Uji kursor JANGAN pakai `Range.toString()`** | emoji (mis. `🖊`) dihitung **2 UTF-16** per tombol ⇒ hasil **artefak**. Pakai **ketikan keyboard nyata**, atau hitung teks **di luar pulau** (`.ay-link`/`.pg-catatan-sisip`). |
| **Sebelum menaruh tombol di kepala — UKUR DULU** | `kepala.scrollWidth - kepala.clientWidth`. Di HP 320px sisanya **0px**; satu tombol ikon (28px) pun membuat kepala **meluber**. |
| **Uji wajib membuktikan plugin bisa dicabut** | lepas plugin ⇒ hiasannya hilang, **catatan utuh**. |
| **Jangan mengulang cara yang sama bila gagal** | cara sama = keadaan sama. Ganti pendekatan, atau **hentikan** dan cari jalan lain. |
| **1 berkas = 1 proses uji** | jalankan uji **sekali** per muat halaman; kalau mau ulang ⇒ `page.reload()` dulu (dua proses menulis hasil bersamaan ⇒ menggantung). |

### 0.9 🧰 Perkakas (`tools/`) — mesin pembangun & pemeriksa

Semua alat dijalankan dengan **Node.js** dari folder `c:\data\ANodes`.

**A. Pembangun & penyiap data**

| Alat | Guna |
|---|---|
| `buat-1-berkas.js` | menggabungkan `css/` + `js/` + `plugin/` + **semua data** menjadi **`ANodes-1berkas.html`** (berkas untuk HP). Menyisipkan data sebelum penutup body — penutup **paling belakang** (`gantiPenutupBody()`), karena kecocokan pertama pernah menaruh data 5 MB di tengah kode. ⚠️ **K95b:** berkas data yang **sudah ada di `index.html`** dicatat di **`sudahInline`** ⇒ bagian **3f–3k** **tidak** menyisipkannya lagi (dulu 6 berkas masuk **2×** ⇒ berkas HP **+8,81 MB**). |
| `siapkan-data-alkitab.js` | `bible/data/alkitab-tb.json` → `plugin/alkitab/data/alkitab-tb.js` (**5,08 MB**) |
| `siapkan-data-silang.js` | `bible/data/silang.json` (OpenBible CC-BY) → `plugin/ayat-terkait/data/silang.js` (**5,21 MB**) |
| `siapkan-data-kamus.js` | `kamus-utama.json` + `kamus-tambahan.json` + `kamus-nama.json` → `plugin/kamus/data/kamus.js` (**2.978 entri · 3.142 tulisan**) |
| `siapkan-data-penguat.js` | `bible/data/komentar/<bookId>.json` → `plugin/penguat/data/penguat.js` (**12,40 MB**) + menghitung **sidik isi teks** |
| `siapkan-data-sejarah.js` | `kitab.json` + `tambahan-sejarah-kitab.js` + berkas prakata → `plugin/sejarah/data/sejarah.js` |
| `tambahan-sejarah-kitab.js` | data tambahan sejarah 66 kitab (inti · tema · tokoh · ayat kunci) — **bukan** alat, ini sumber data |

**B. Alat pemeriksa mutu data (dipakai saat penguat Alkitab ditulis)**

| Alat | Guna |
|---|---|
| `bersih-dan-dan.js` | membersihkan cacat tulis `dan dan` / `, ,` / spasi ganda — **wajib** dijalankan sebelum menggabungkan. ⚠️ bekerja pada **NILAI JSON saja** (kalau mengganti seluruh berkas, indentasi rusak). ⚠️ pola `dan dan` wajib pakai *lookahead* (`dan dan(?![a-z])`) — “mata air **dan dan**au” itu bahasa Indonesia yang benar. |
| `cek-hitung-hal.js` | memeriksa hitungan rincian (“dinyatakan dengan N hal”) — salah hitung paling sering pada ayat panjang |
| `cek-penguat.js` | membuktikan kunci penguat benar-benar masuk berkas build (per pasal) |
| `cek-gaya-penguat.js` | membuktikan **GAYA** tulisan (berapa % berpola rincian · kata ulang · panjang) |
| `lihat-pasal.js` | membaca teks satu pasal dari data Alkitab (untuk menyusun penguat) |
| `tambah-komentar.js` | menggabungkan berkas batch penguat ke berkas kitab (**cadangan otomatis** · memeriksa **kunci kembar** · memeriksa nomor ayat benar-benar ada) |

**C. Alat uji otomatis (dijalankan di Console browser)**

| Alat | Ukuran | Guna |
|---|---|---|
| **`uji-sasaran.js`** | **±10 detik** | 🎯 **DIPAKAI SETIAP REVISI.** Menjalankan **HANYA** `tools/uji-blok/<NAMA>.js` — tidak ada blok lain yang ikut jalan. `node tools/uji-sasaran.js K92` · `--daftar` · `--berkas ANodes-1berkas.html` |
| `uji-cepat.js` | **1.186 asersi · 43 blok** | ⚠️ **JANGAN dipakai untuk satu revisi** — menjalankan **SELURUH** blok (±4–7 menit). Hanya untuk pemeriksaan menyeluruh. `window.__BLOK` **hanya menyaring laporan** — seluruh langkah tetap jalan |
| `uji-chrome.js` | — | menjalankan suite penuh di Chrome headless. 🛑 **`--blok` DITOLAK** (`exit 2`) kecuali `--paksa` — pagar K94 supaya jebakan “uji keseluruhan untuk satu revisi” tidak bisa terulang |
| **`uji-log.js`** | — | 📝 menulis **`artifacts/uji-log.txt`** setiap kali uji dijalankan (dipakai **kedua** alat) ⇒ cara lambat **tidak bisa disembunyikan** |
| **`cek-cara-uji.js`** | — | 🔍 **BUKTI NYATA** untuk pemilik proyek: berapa kali sasaran vs menyeluruh · total waktu · gagal. `node tools/cek-cara-uji.js` |
| `uji-toolbar.js` | uji penuh | menguji **seluruh** aplikasi — **butuh izin** karena lama. Menerima `window.__UJI_BLOK = ['K37']` untuk menyaring laporan |

⚠️ **Kedua alat uji menyimpan & memulihkan `localStorage` sendiri (`KUNCI_AMAN`)** — pengaman itu
❌ jangan dihapus, kalau tidak catatan asli bisa tertimpa.
⚠️ Saat menguji berkas satu-berkas, **tab browser harus di depan** — di latar belakang timer
ditahan browser sehingga uji tampak “macet” (itu bukan cacat).

### 0.10 📦 Portofolio — angka terukur sistem ini

> 📅 **Angka diukur ulang 3 Nov 2026** (sesudah K99).

| Bagian | Ukuran |
|---|---|
| `index.html` | **959 baris** |
| `css/` (2 berkas) | **6.411 baris** |
| `js/` (8 berkas) | **6.180 baris** |
| `plugin/` (**39 berkas JS** kode + 14 berkas data) | **20.675 baris** |
| `tools/` (**40 berkas `.js`** — 36 di akar + 4 di `uji-blok/`) | **19.222 baris** |
| **Total kode** (tanpa data) | **53.447 baris** |
| Data tanam: Alkitab 5,08 MB · kaitan ayat 5,21 MB · penguat 12,40 MB · kamus 0,48 MB · sejarah 0,10 MB · peta 0,06 MB · bumi 0,37 MB · **interlinear 1,71 MB** · **penjelasan Yunani 0,68 MB** · **penjelasan Ibrani 2,77 MB** · **interlinear PB 3,22 MB** · **paralel AYT 5,07 MB** · **perikop 0,13 MB** | **±37,4 MB** |
| `ANodes-1berkas.html` (versi HP) | **40,96 MB** (42.944.496 B) — diukur **3 Nov 2026** sesudah **K99** (tambah data perikop 0,13 MB; sebelum K99 **40,77 MB** sesudah K86) |
| ⚠️ **Data ganda (K95b)** | **6 berkas data** dulu masuk **2×** (`ANodesPetaData` · `ANodesPetaBumi` · `ANodesInterlinearData` · `ANodesYunaniData` · `ANodesIbraniData` · `ANodesPbData`) ⇒ **−8,81 MB** · blok `<script>` **55 → 49** · **muat −450 ms** · **RAM −30 MB** |
| Uji otomatis | **±1.084 asersi** di `tools/uji-cepat.js` (46+ blok) + **46 uji K85** (`tools/uji-k85.js`) + **12 uji K88** + **15 uji K89** + **17 uji K90i** + **51 uji K85t2** + **42 uji K86** + **42 uji K99** + **34 uji K64** + **34 uji K100** + **56 uji K87** (`tools/uji-blok/` — **12 blok sasaran**) |
| Isi Alkitab | **66 kitab · 1.189 pasal · 31.102 ayat** |
| Penguat (tafsiran per ayat) | **31.102 ayat (100 %)** |
| Kaitan antar ayat | **344.100 kaitan** (29.363 ayat) |
| Kamus istilah | **2.978 entri · 3.142 tulisan** (K83) |
| Sejarah kitab | **66 kitab** + 1 prakata |
| Peta Alkitab | **126 lokasi · 42 daerah · 12 gunung** (dari **234 nama katalog**) |
| 📍 Kata lokasi per ayat | **4.441 ayat (14,3 %)** dapat tombol · **955 ayat** >1 lokasi (maks **8**) |
| 🔤 Interlinear (K85 tahap 1) | **3.778 ayat (4 Injil) · 56.785 kata · 2.833 nomor Strong** |
| 🔤 Interlinear PB (K85 tahap 2) | **4.170 ayat (Kisah 26 s/d Wahyu) · 4.400 nomor Strong · 5.685 entri arti** · **Bentuk B** (Yunani + alih huruf + arti Indonesia) · sidik `pb-4170-5685-cd66c7eb` · **cakupan kata isi 100 %** |
| 🔤 Penjelasan Yunani (K88) | **20 kata dijelaskan · 3.103 ayat (82,1 %)** · 1.296 kata layak (344 kata ≥10× ⇒ 97,6 %) |
| ✡ Kata serapan Ibrani/Aram (K89) | **29 kata · 203 ayat (5,4 %)** di 4 Injil |
| ✡ Penjelasan Ibrani PL (K90 + **K90i**) | **455 kata dijelaskan · 22.688 ayat (97,7 %)** dari 23.213 ayat PL · **Taurat 99,5 %** (Kejadian 99,9 % · Ulangan 99,7 %) — 32 ayat sisa **hanya kata fungsi** ⇒ efektif **100 %** |
| ✅ **Celah yang sudah TERTUTUP** | **Kisah 26 s/d Wahyu: 0 kata isi tanpa arti** — tahap 3 (3 Nov 2026) menambah **1.398 arti** ⇒ **cakupan 100 %** |
| 🔀 **Paralel Terjemahan (K86)** | **AYT — 66 kitab · 1.189 pasal · 31.102 ayat** (persis sama dengan TB) · data **5.073,4 KB** · sidik `ayt-66-31102-8b98ec85` · **CC BY-NC 4.0** (pemakaian pribadi) |
| 📖 **Judul Perikop (K99)** | **2.573 judul · 66 kitab · 1.144/1.189 pasal (96,2 %)** · data **132,5 KB** · sidik `pk-2573-6df3cabe` · **CC BY-NC 4.0** |
| 🕒 **Linimasa Sejarah (K87)** | **450 peristiwa · 9 zaman · 17.570 rujukan ayat** · tahun **−4003 … 57** · data **213,4 KB** · sidik `lm-450--4003-57-3f9bc0c1` · **CC-BY-SA-4.0** |

**Plugin yang ada (12):** 📖 Alkitab **2.809** baris (v1.2) · 🌿 Ayat Terkait **3.007** (v1.0) ·
📚 Kamus Istilah **3.108** (v1.4) · 🗺️ Peta **2.955** (v1.0) · 🖊 Penguat **1.753** (v1.4) ·
📖 Sejarah Kitab **1.265** (v1.2) · 🔖 Bookmark Ayat **1.132** (v1.1) ·
🔤 Interlinear **1.000** (v1.4 · 4 Injil + PB Kisah 26 s/d Wahyu 100 % + penjelasan Ibrani PL) ·
🗓️ **Bacaan Alkitab 1 Tahun** (v1.0 · K96 — **3 rencana · 365 hari · 100 % cakupan** · data 212,9 KB) ·
🔀 **Paralel Terjemahan** (v1.0 · K86 — **TB ⇄ AYT** · 66 kitab · 31.102 ayat · data 5.073,4 KB) ·
📖 **Judul Perikop** (v1.0 · K99 — **2.573 judul** · 96,2 % pasal · data 132,5 KB · ❌ tanpa tombol navbar) ·
🕒 **Linimasa Sejarah** (v1.0 · K87 — **450 peristiwa · 9 zaman · halaman ke-11** · data 213,4 KB).
⚠️ **🕊️ Pengingat Firman DILEPAS** (3 Nov 2026, K96) — berkasnya **tidak dihapus**, idenya
(ayat yang ditandai) tetap di papan C **I-09** dan bisa menyusul **di dalam** plugin 🗓️.
**Plugin yang DIRENCANAKAN (belum ada kode — `rencanakerja.md` bagian 18):**

| Kasus | Plugin | Data | Lisensi | Perkiraan |
|---|---|---|---|---|
| **K85 tahap 2** | 🔤 Interlinear — 62 kitab | `STEPBible/STEPBible-Data` (TAHOT + TAGNT) | CC BY | **±16,5 jam** (7 pekerjaan) |
| ↳ **P1 Taurat** | ✅ **efektif SELESAI lewat K90 + K90i** | — | — | **0 jam** (dulu tercatat ±3 jam — **usang**) |
| ↳ **PB Kisah 26 s/d Wahyu** | ✅ **SELESAI 3 Nov 2026 (tahap 1 · 94 %)** | TAGNT Act-Rev (15,9 MB) | CC BY 4.0 | ✅ **±4 jam** (nyata) |
| ↳ **PB tahap 2** | ✅ **SELESAI 3 Nov 2026 — 803 arti baru ⇒ 95,1 %** | — | — | ✅ **±1 jam 10 mnt** (perkiraan ±4–5 jam) |
| ↳ **PB tahap 3** | ✅ **SELESAI 3 Nov 2026 — 1.398 arti baru ⇒ 100 %** | — | — | ✅ **±1 jam 15 mnt** (perkiraan ±6 jam) |
| **K86** | ✅ **SELESAI 3 Nov 2026** — 🔀 Paralel terjemahan | **AYT** dari eBible.org (`indayt_usfm.zip` 1,50 MB) — ⚠️ **TSI hanya 48 kitab** | **CC BY-NC 4.0** | ✅ **±1 jam 20 mnt** (perkiraan ±5 jam) |
| **K99** | ✅ **SELESAI 3 Nov 2026** — 📖 Judul perikop | **AYT** (sumber **SAMA** dengan K86 · `\s1`/`\s2`) | **CC BY-NC 4.0** | ✅ **±1 jam 10 mnt** (perkiraan ±2 jam) |
| **K87** | ✅ **SELESAI 3 Nov 2026** — 🕒 Linimasa sejarah | `robertrouse/theographic-bible-metadata` | CC-BY-SA-4.0 | ✅ **±1 jam 5 mnt** (perkiraan ±4 jam) |

✅ **K87 SUDAH JADI:** `ANodes-1berkas.html` **38,97 MB** dan halaman jadi **11**
(tambah `#linimasa-halaman` · **450 peristiwa · 9 zaman**).

---

## A. Perintah Inti (salin ke AI)

> Bangun aplikasi **ANodes** di `C:\data\Anodes`:
> aplikasi catatan/penulisan bergaya aplikasi **MarkDown** — **kepala hitam,
> isi putih, elegan, simple** — memakai **HTML / CSS / JS vanilla**, **tanpa server**
> (dibuka lewat `file://`).
> **Tampilan harus SELALU seperti di HP** (kolom sempit di tengah, daftar catatan
> di atas), berlaku juga saat dibuka di PC — ukuran huruf & tombol sama.
> Mulai dari **note/editor gaya markdown**, dikembangkan bertahap.
> ❌ Jangan pakai versi Android. ❌ Jangan sentuh Lab 1/2/3.

---

## B. Aturan Kerja

> 🔴🔴 **ATURAN UJI SASARAN (K94/K95 — 2 Nov 2026) — BACA SEBELUM MENJALANKAN UJI APA PUN.**
> **Uji HANYA di lokasi yang direvisi.** `node tools/uji-sasaran.js <NAMA>` (±10 detik) —
> menjalankan **hanya** `tools/uji-blok/<NAMA>.js`.
> ❌ **JANGAN** menjalankan `tools/uji-cepat.js` / `tools/uji-chrome.js` untuk satu revisi —
> keduanya menjalankan **SELURUH 43 blok · 1.186 asersi** (±4–7 menit) walau `window.__BLOK`
> dipasang (`__BLOK` **hanya menyaring laporan**, seluruh langkah tetap jalan).
> 🛑 `tools/uji-chrome.js --blok` **DITOLAK** (`exit 2`) oleh pagar di kode kecuali `--paksa`.
> 📝 Setiap uji **tercatat** di `artifacts/uji-log.txt` (ditulis **kedua** alat) ⇒ cara lambat
> tidak bisa disembunyikan. **Bukti untuk pemilik proyek:** `node tools/cek-cara-uji.js`.
> 📖 Aturan lengkap dalam bahasa AI: **`.github/copilot-instructions.md`** + **Aturan #1 di kepala `agents.md`**.

0. ⭐ **ATURAN MUTLAK (permintaan user 14 Sep 2026).** **Setiap order user WAJIB
   lebih dulu DITULIS ke `rencanakerja.md`** (kasus + butir a/b/c, status ⬜),
   **baru dikerjakan SATU BUTIR PER GILIRAN — jangan sekaligus.**
   Walau user mengetik puluhan order sekaligus: catat semuanya dulu, lalu kerjakan
   satu butir (selesai → uji → update dokumen → lapor → lanjut butir berikutnya).
   Pengecualian hanya bila user sendiri bilang “kerjakan sampai selesai”.
1. ⭐ **PAPAN ORDER (paling penting).** Sebelum kerja apa pun, buka
   `rencanakerja.md` **bagian 0** — 4 tabel: **A. KASUS BELUM SELESAI**,
   **B. ANTREAN KERJA**, **C. IDE**, **D. SELESAI**. User **pelupa**; papan ini
   alat navigasinya. Setiap selesai kerja **WAJIB** memperbarui papan:
   ✅ + **tanggal** pada butir · butir habis → kasus dipindah ke **D** ·
   ide yang disetujui → pindah ke **B**, barisnya dihapus dari **C**.
   **Satu hal hanya boleh muncul di satu tabel.**
2. Kerja **tahap demi tahap** — satu perintah user (`proses`) = satu tahap.
3. Fitur baru: paparkan tahapan (a,b,c) dulu → tunggu konfirmasi.
4. **Debug sendiri dulu** — jalankan uji di Console browser (+ uji keyboard nyata)
   SEBELUM minta user tes. Tambah uji baru bila ada fitur baru.
   ⭐ **ATURAN KECEPATAN (16 Sep 2026):** jalankan **HANYA blok uji yang berhubungan**
   dengan yang direvisi (mis. revisi K37 → **K37-01…K37-22** saja).
   ❌ **JANGAN** menjalankan uji penuh tanpa **memberi tahu** lebih dulu — pengguna harus
   menunggu, dan progres proyek jadi lambat.
   ✅ **`tools/uji-cepat.js`** = uji kecil **±15–60 detik** (hanya fitur terbaru) — pakai ini
   saat merevisi satu fitur. `tools/uji-toolbar.js` (uji penuh) menerima
   **`window.__UJI_BLOK = ['K37']`** → hanya blok itu yang dilaporkan.
   ⭐ **ATURAN TAMBAHAN (17 Sep 2026 — JANGAN dilanggar):**
   (1) uji **hanya bagian yang direvisi/ditambah**; sesudah itu **pengguna** yang menguji ·
   (2) uji bermasalah & lama → **JANGAN ulangi cara yang sama** (cara sama = keadaan sama =
   looping error) — ganti pendekatan atau hentikan ·
   (3) bagian revisi yang sebabnya **tidak diketahui** & memakan waktu → **HENTIKAN, cari
   jalan lain** ·
   (4) ⏱️ **WAJIB beri PERKIRAAN WAKTU sebelum mulai** (“±3 menit” / “±5 menit” /
   “±10 menit”); kalau lebih lama → **kabari**. Jangan biarkan pengguna menunggu
   tanpa kejelasan.
   ⭐ **POSISI n dari m** — untuk pekerjaan beberapa langkah, tampilkan posisinya supaya
   pengguna tahu sudah sampai mana.
   ⭐ **SEBUTAN UMUM DI TEKS TAMPIL (K48, 19 Sep 2026 — JANGAN dilanggar):**
   ❌ **jangan menulis “Bapak” di teks yang TAMPIL DI LAYAR** (keterangan plugin ·
   konfirmasi · tombol · pesan toast). Pakai sebutan umum: **pengguna · Anda ·
   pengguna bisa · catatan pengguna**. ✅ Komentar kode (`//`, `/* */`) & dokumen `.md`
   **tetap boleh** memakai “Bapak” — itu catatan kerja internal, tidak tampil.
   ⭐ **DUA METODE UJI YANG WAJIB (23 Sep 2026 — lihat juga bagian 0.8):**
   (a) **“menghitung elemen ≠ menguji yang terlihat”** — uji tampilan **WAJIB** memakai
       **`getComputedStyle`** (`color` · `borderBottomStyle` · `cursor`) **dan diuji di
       WADAH TEMPAT REVISI** (mis. `#sj-isi`), ❌ bukan hanya `#editor`;
   (b) **ukur data dulu sebelum memutuskan aturan** — kalau ada yang salah (mis. satu kata
       salah ditandai), **hitung dulu** berapa yang sah akan ikut rusak; aturan umum yang
       merusak banyak hal untuk memperbaiki satu **wajib ditolak** ⇒ pakai aturan tersempit.
5. Backup sebelum perubahan.
6. Update `agents.md`, `prompt.md`, `CHANGELOG.md`, `panduan.md` tiap tahap
   (+ **📋 PAPAN ORDER** di `rencanakerja.md` bagian 0).

---

## C. Struktur File (Tahap 5a)

```
C:\data\Anodes\
├── index.html      satu halaman: kepala hitam + panel daftar + editor + modal plugin
├── start.bat       buka index.html
├── css/base.css    variabel warna + reset + wadah .app (lebar HP, dipusatkan)
├── css/app.css     kepala, panel, toolbar, editor, status, toast, modal, pengaturan, plugin
├── js/store.js     data catatan — localStorage `anodes-catatan-v1`
├── js/setting.js   pengaturan + pintasan — localStorage `anodes-setting-v1`
├── js/plugin.js    GUDANG PLUGIN — localStorage `anodes-plugin-v1`
├── js/editor.js    editor + toolbar + daftar + kategori + pencarian + auto-save
├── js/markdown.js  pengolah markdown (Impor .md/.txt · tombol 📖 Rapi · rapikan tempelan K44)
├── js/berkas.js    halaman 🗂️ BERKAS TERSIMPAN (daftar rantai 🌿 Ayat Terkait) — K28h
├── js/bantuan.js   ❓ BANTUAN — satu tombol [?], isi menyesuaikan 12 halaman (K64 · 3 Nov 2026)
├── js/pengguna.js  👤 PEMISAHAN DATA PER EMAIL — `u:<email>::` awalan semua kunci data (K100 · 3 Nov 2026)
├── js/layar.js     ruang aman layar HP (--sa-top/--sa-bottom) — K79
├── plugin/alkitab/plugin.js   KETERANGAN plugin (window.ANodesPlug.push)
├── tools/uji-toolbar.js  403 uji otomatis (uji penuh; terima __UJI_BLOK untuk saring laporan)
├── tools/uji-cepat.js    ⚡ ±15 detik — HANYA fitur terbaru (pakai saat revisi satu fitur)
├── tools/buat-1-berkas.js bikin ANodes-1berkas.html (versi 1 berkas untuk HP)
├── tools/siapkan-data-alkitab.js  bikin plugin/alkitab/data/alkitab-tb.js
├── tools/siapkan-data-silang.js   bikin plugin/ayat-terkait/data/silang.js
├── plugin/alkitab/plugin.js       KETERANGAN plugin (window.ANodesPlug.push)
├── plugin/alkitab/alkitab.js      MESIN plugin (window.ANodesAlkitab)
├── plugin/alkitab/tampilan.js     TAMPILAN: tautan ayat, halaman baca, cari
├── plugin/alkitab/data/alkitab-tb.js  DATA ayat 5,08 MB (window.ANodesAlkitabData)
├── plugin/ayat-terkait/plugin.js    KETERANGAN 🔗 Ayat Terkait + pilihan cara tampil
├── plugin/ayat-terkait/terkait.js   MESIN (window.ANodesAyatTerkait)
├── plugin/ayat-terkait/tampilan.js  TAMPILAN kaitan di halaman baca
├── plugin/ayat-terkait/data/silang.js  DATA kaitan 5,21 MB (window.ANodesAyatTerkaitData)
├── plugin/kamus/data/kamus.js    DATA kamus (2.978 entri · 3.142 tulisan · 492 KB)
├── plugin/penguat/plugin.js      KETERANGAN 🖊 Pembaca Penguat (K47 — MANDIRI)
├── plugin/penguat/penguat.js     MESIN (window.ANodesPenguat · IndexedDB kunci `penguat`)
├── plugin/penguat/tampilan.js    TAMPILAN halaman baca (#penguat-halaman)
├── plugin/penguat/data/penguat.js  DATA penguat (66 kitab · 31.102 ayat · 12.691,7 KB)
│                                  ✅ 66 kitab TUNTAS = 100 % ALKITAB (SELESAI 21 Sep 2026)
├── plugin/linimasa/plugin.js     KETERANGAN 🕒 Linimasa Sejarah (K87 · 3 Nov 2026)
├── plugin/linimasa/linimasa.js   MESIN (window.ANodesLinimasa · IndexedDB kunci `linimasa`)
├── plugin/linimasa/tampilan.js   TAMPILAN halaman ke-11 (#linimasa-halaman)
├── plugin/linimasa/data/linimasa.js  DATA 450 peristiwa (213,4 KB · sidik lm-450--4003-57-3f9bc0c1)
├── tools/sumber-data.js  pencari berkas sumber (ANODES_SUMBER → ANodes/bible/data → C:\data\bible\data)
├── tools/osis.js         peta OSIS 3 huruf → nomor kitab 1–66 (dipakai alat data linimasa)
├── ANodes-1berkas.html   versi SATU BERKAS (css+js+data menyatu, 38,97 MB, untuk HP)
├── agents.md / prompt.md / CHANGELOG.md / panduan.md / rencanakerja.md
└── backups/
```

---

## D. Detail Wajib (supaya 100% sama)

### D.1 Warna (base.css)
```
--kepala:  #1e2733   (hitam kebiruan — atas)
--putih:   #ffffff   (isi)
--abu-bg:  #f5f6f7   (panel daftar)
--garis:   #e2e2e2
--teks:    #1a1a1a
--teks2:   #6b7280
--aksen:   #ffcf40   (kuning — status belum simpan)
--ok:      #7bff9e   (hijau  — sudah simpan)
--merah:   #d32f2f
```

### D.2 Gaya HP di semua layar
- `body` latar abu `#d9dde2`, konten dipusatkan (`align-items: center`).
- Wadah `.app`: `width: 480px` (variabel `--lebar-app`), `max-width: 100%`,
  `height: 100%`, latar putih, `box-shadow`, `overflow: hidden`.
- Panel daftar (`.aside`) **di ATAS**, tinggi maks ±190px, dapat digulir.
- Editor di bawahnya. **Ukuran huruf & tombol SAMA** di PC maupun HP.
- Responsif: bila layar ≤ 480px, `.app` otomatis penuh layar.

### D.3 Kepala (header) — gaya HP
- Latar `--kepala` (`#1e2733`), teks putih.
- Kiri: logo kotak putih "A" + **ANodes** + pil **Tahap** + titik status.
- Kanan hanya **3 tombol**: **[▦]** (show/hide toolbar), **[File ▼]**, **[🔍 Cari ▼]**
  (tulisan diperpendek 15 Sep 2026, K27 a — judulnya tetap “Cari catatan”).
  - `File ▼` → menu: **📂 Open · ＋ New · 💾 Save · 🗑 Del · ⤒ Impor… (.md/.txt/.json) ·
    ⤓ Ekspor .md · ⤓ Ekspor .txt · ⤓ Ekspor .pdf · ⤓ Cadangan .json**
    (*Open* = tampilkan kembali daftar catatan)
  - `🔍 Cari ▼` → kotak cari + dropdown kategori (tulisan diperpendek 15 Sep 2026, K27 a)
- **Jangan** taruh `+ Baru / Simpan / Hapus` langsung di kepala (dulu mubazir).
- Titik: kuning = belum disimpan, hijau = sudah.

### D.3b Panel daftar catatan
- Judul **Catatan (n)** — `(n)` jumlah tampil, atau `(tampil/total)` saat disaring.
- Hanya tombol **▲** (sembunyikan daftar). **(Tidak ada `＋ Kategori` lagi.)**
- Klik baris = buka catatan; **✕** di kanan = hapus catatan.
- Kategori baru dibuat dari dropdown **`＋ Kategori baru...`** di bar info editor.
- **Daftar disembunyikan saat start** — dibuka HANYA lewat **File → 📂 Open**
  (tidak ada tombol `☰ Catatan`). Saat start langsung masuk catatan terakhir.

### D.3c Bar info editor (1 baris)
- Format: `Judul · Kategori: [▾] · n kata` — **wajib muat 1 baris**; nama panjang
  dipotong `text-overflow: ellipsis`.
- Di sinilah kategori catatan diganti/dibuat.

### D.3c2 🔍 Cari di catatan + 📥📤 Impor/Ekspor (K29 · K30 — 15 Sep 2026)

#### 🔠 K69f (5 Okt 2026) — NAMA TITIK DI PETA IKUT PENGATURAN UKURAN HURUF

| Hal | Pelaksanaan |
|---|---|
| Sebab (diukur) | **3 tempat** ukurannya **tetap**: chip `.peta-nchip` (`11.5px`) · nama **DI DALAM peta** (`const FONT = { kota:13, laut:17, … }`) · mini-peta `.pl-mlbl` (`13px`) |
| Mesin peta | **`peta.js → fontPeta(n)`** = `n × skala()` (skala = `data.font ÷ 16`) · `FONT` dihitung dari **angka lama** |
| Mini-peta | **`ayat.js → fontMini(n)`** — ukuran **dan** jarak label ikut membesar (`sk = fMini / 13`) |
| CSS Peta | **SELURUH** blok Peta ⇒ `calc(… * var(--skala))` — termasuk `stroke-width` label SVG |
| Saat ⚙ diubah | `js/setting.js` mengirim **`anodes-setting-berubah`** ⇒ `peta/tampilan.js → pasangUbahHuruf()` **menggambar ulang** nama halaman Peta **dan** kolom mini-peta yang terbuka |
| Satuan | label SVG memakai **viewBox 480** (bukan px layar) — skala dipakai **apa adanya** |
| ⚠️ Aturan tersempit | pada **16px hasilnya SAMA PERSIS** seperti sebelumnya |
| Terukur | chip **8,625 / 11,5 / 17,25px** · nama peta **12,75 / 17 / 25,5** · mini-peta **9,75 / 13 / 19,5px** (12 / 16 / 24px) |

#### 🔌 K70 (5 Okt 2026) — SAKELAR ON/OFF PENANDAAN DI CATATAN

| Hal | Pelaksanaan |
|---|---|
| Tombol | **`#info-tandai`** di **bar info** (`🔗 ON` ⇄ `🔗 OFF`) — kelas `.info-tandai` (+ `.nyala` hijau) |
| Letak | **BAR INFO**, ❌ bukan kepala — **diukur**: kepala HP 320px sisa `0px`, tombol ikon 28px ⇒ **meluber** |
| Bawaan | **OFF** (kunci `anodes-tandai-note` **tidak ada** = OFF) |
| ON | semua hidup sekaligus: ayat + istilah + 🖊 + panel 📋 Ayat & Istilah |
| OFF | `tandaiSemuaTanda()` keluar + **membersihkan bekas** (tautan · istilah · 🖊 · kotak · panel) |
| Penandaan susulan | `ANodesAlkitab.aktif()` & `ANodesKamusTampilan.bisaTandai()` **ikut membaca** sakelar |
| API | `ANodesEditor.catatanDitandai()` · `setTandaiCatatan(hidup[,diam])` · `segarkanTombolTandai()` · `bersihkanTandaCatatan()` |
| 🔴 Cursor | `hiasCatatan()` memakai **REKONSILIASI** (`rekonsiliasiCatatan`) — ❌ **JANGAN** “bongkar semua” tombol `🖊`, sebab elemen `contenteditable="false"` yang dilepas **menghancurkan posisi kursor** |

**Bilah cari catatan** `#bar-cari` (di atas `#toolbar`, `hidden` secara bawaan):
`#cari-isi` (kotak) + `#cari-isi-prev` ◀ + `#cari-isi-next` ▶ + `#cari-isi-info` + `#cari-isi-tutup` ✕.
- Dibuka tombol kepala **`🔍 Cari`** atau **Ctrl+F** (menggantikan kotak cari browser).
- **Enter** = berikutnya · **Shift+Enter** = sebelumnya · **Esc** = tutup & bersih.
- Temuan disorot `<mark class="cari-hit">` **kuning**; yang aktif `+ .cari-aktif` (lebih tegas + garis).
- ⚠️ Penandaan lewat **potongan teks** (TreeWalker), ❌ bukan `innerHTML.replace`.
- ⚠️ Sorotan **dibuang sebelum simpan** (`bersihTandaCari()`) → catatan tetap teks biasa.
- Ganti catatan → pencarian otomatis **ditutup**.

**Cari ANTAR-catatan + saring kategori** pindah ke **panel daftar**: kotak `#cari` +
`#filter-kategori` (dalam `.daftar-cari`). ❌ tidak hilang, hanya pindah tempat.

**Menu File (K30):**
```
📂 Open · ＋ New · 💾 Save · 🗑 Del
⤒ Impor… (.md · .txt · .json)
⤓ Ekspor .md · ⤓ Ekspor .txt · ⤓ Ekspor .pdf
⤓ Cadangan .json
```
- Impor `.md`/`.txt` → **ke catatan yang sedang dibuka** (OK = ganti isi · Cancel = tambah di akhir).
- Ekspor `.md` = isi apa adanya (nama = judul catatan) · `.txt` = penanda markdown dibuang ·
  `.pdf` = **jendela cetak** browser (“Simpan sebagai PDF”), ❌ tanpa pustaka luar.
- ⚠️ **JEBAKAN:** jangan menulis teks penutup body mentah di dalam kode — pakai escape
  `'\x3c/body>'`; penggabung memakai `gantiPenutupBody()` (penutup **paling belakang**).

### D.3d Kepala kanan: [▦] [⚙] [🧩] [File ▼] [🔍 Cari ▼] [🗂️ Berkas]
- `▦` = toolbar tulis (ikon TETAP) · `⚙` = pengaturan · `🧩` = gudang plugin
  (semua urusan plugin) · `File ▼` = Open/New/Save/Del/Impor/Ekspor ·
  `🔍 Cari ▼` = kotak cari + saring kategori (tulisan **diperpendek** 15 Sep 2026 —
  dulu “Cari catatan ▼” terlalu panjang; judulnya tetap “Cari catatan”) ·
  `Doc` = berkas proyek (lihat D.13c).
- ❌ Kotak logo `[A]` **sudah dibuang** (hemat ruang).
- ⚠️ Ikon tombol **TETAP** — ❌ **jangan** pernah membuat ikon berganti sendiri
  (`#btn-toolbar` pernah memakai 🧩 → kembar dengan `#btn-plugin`, user bingung).
- ⚠️ Kepala wajib **1 baris** (`flex-wrap: nowrap`, padding 8/10, gap 6);
  ≤460px `.tahap` disembunyikan · ≤400px `.merk-teks` + `.panah` disembunyikan.

### D.3e Pengaturan (js/setting.js) — localStorage `anodes-setting-v1`
- Bentuk: `{font(12-24), kecerahan(50-100), jenisFont, pintas{}}`.
- Terapkan ke CSS: `--font-isi` = `Npx`, `--skala` = **angka polos** `N/16`,
  `--font-jenis` = keluarga font. Jangan hitung skala di CSS.
- Kecerahan → `#lapis-cahaya` (fixed, pointer-events:none, rgba hitam).
- Pintasan: 9 aksi (h1,h2,h3,p,bullet,number,icon,bold,italic), bisa direkam ulang
  (`aksiUntuk(e)` + `keTeksPintas(e)`), `Esc` batal / `Del` kosongkan / Reset.

### D.4 Toolbar (tahap 3 + K18 — lengkap, hemat ruang)
Tombol dikelompokkan (dropdown), kiri→kanan **12 tombol**:
```
[↶]          → batal (undo)
[↷]          → ulangi (redo)
[¶ ▼ Size]   → H1 H2 H3 ¶
[• List ▼]   → • Titik | 1. Nomor | ✅ Icon List
[B]  [I]
[▦ ▼]        → ▦ Sisip tabel | ✎ Edit tabel
[▬ ▼]        → stabilo 5 warna (#fff176,#b9f6ca,#b3e5fc,#f8bbd0,#ffe0b2)
[A ▼]        → warna huruf 6 (#111,#d32f2f,#2e7d32,#1565c0,#7b1fa2,#ef6c00)
[✕]          → hapus warna
[✅ ▼]       → grid 28 icon
[🧩 ▼]       → plugin TERPASANG saja + baris “🧩 Gudang Plugin…”   (K18)
```
*(Tombol `<> Row` sudah DIHAPUS — user tidak perlu lihat kode.)*
- Tombol dasar klik = pakai yang terakhir; klik panah `▼` = buka submenu.
- Tombol grup bisa **hide/unhide** (Alt+klik tombol `🧩`/`▦` di kepala) — status di `localStorage`.
- Panel daftar juga bisa **hide/unhide** (tombol `▲` di panel; `File → 📂 Open` menampilkan lagi).
- ⚠️ **Toolbar WAJIB 1 baris** (`flex-wrap: nowrap`). 12 tombol ±390px, tersedia ±344px
  di layar sempit → label panjang disingkat: `[• List ▼]` → `[• ▼]`, `[1. List ▼]` → `[1. ▼]`
  (dua span `.lbl-penuh` / `.lbl-pendek`, diisi `setLabelDaftar()` di `js/editor.js`).
- ⚠️ **Media query WAJIB di BAWAH aturan dasar** — kalau di atas, kalah cascade,
  penghematan tidak jalan, toolbar pecah 2 baris.
- ❌ Di ≤360px yang disembunyikan **titik warna** (`.dot`), **bukan panah ▼** —
  tanpa panah, pilihan stabilo/warna/icon tidak bisa dibuka.
- Hasil ukur: **1 baris 32px** di 300/320/360/412/430/480px, tidak terpotong.

### D.4b Submenu panjang WAJIB bisa digulir (perbaikan 14 Sep 2026)

```css
.submenu {
  max-height: min(46vh, 300px);
  overflow-y: auto;
  overscroll-behavior: contain;
}
.submenu button { flex-shrink: 0; }
.submenu.buka.ke-atas { top: auto; bottom: calc(100% + 5px); }
```

- ⚠️ Tanpa ini, daftar **28 icon** terpotong layar dan icon paling bawah tidak bisa diklik.

### D.4c 🐞 Letak submenu WAJIB diatur — jangan andalkan CSS saja (K18/K19, 14 Sep 2026)

> **JEBAKAN BESAR 1 (K18):** `.toolbar { overflow-x: auto }` pernah dipakai untuk
> memaksa 1 baris. Akibatnya **SEMUA submenu tidak kelihatan**: kelas `.buka` terpasang,
> ada di DOM, `getBoundingClientRect()` melaporkan 89px — tapi
> `document.elementFromPoint()` mengembalikan `#editor`.
> Sebabnya: kalau satu sumbu `auto`, **sumbu lain yang `visible` ikut dihitung `auto`**
> → submenu yang menonjol keluar kotak toolbar **dipotong 0 px**.
>
> **JEBAKAN BESAR 2 (K19):** yang memotong submenu di PC adalah **`.app`
> (`overflow: hidden`, width 480px di tengah layar)** — ❌ **bukan** layar.
> Pengecekan lama memakai `window.innerWidth` → di PC selalu lolos →
> submenu tombol paling kanan menonjol keluar kotak & **terpotong**.

| Aturan | Pelaksanaan |
|--------|-------------|
| `.toolbar` | `overflow: visible` — ❌ **jangan** `overflow-x: auto` |
| Letak submenu | fungsi **`pasangSubmenu(sm)`** di `js/editor.js`, dipanggil tiap submenu dibuka |
| **Batas yang diukur** | **kotak `.app`**: `sm.closest('.app').getBoundingClientRect()`, diiris dgn layar. ❌ jangan `window.innerWidth` |
| Menonjol ke KANAN | `sm.style.left='auto'; sm.style.right='0'` (mis. tombol 🧩 di ujung kanan) |
| Lalu menonjol ke KIRI | `sm.style.left='0'; sm.style.right='auto'` |
| Tidak muat ke BAWAH | tambah kelas **`.ke-atas`** |

⚠️ **Pelajaran uji:** uji yang hanya memeriksa `classList.contains('buka')` **LOLOS
walau submenu tidak terlihat**. Uji **Z16–Z20** memakai `document.elementFromPoint()`
pada **puncak & tepi kanan** submenu, dan memeriksa `terpotongApp`.

**Cara memeriksa sendiri (Console):**
```js
const s = document.querySelector('.submenu[data-sub="plugin"]');
s.classList.contains('buka')                       // true = memang terbuka
s.getBoundingClientRect().height                   // 0 = terpotong (bug overflow)
document.elementFromPoint(50, s.getBoundingClientRect().top + 8)  // harus di dalam submenu
const a = s.getBoundingClientRect(), k = s.closest('.app').getBoundingClientRect();
a.right <= k.right     // false = terpotong kotak .app (bug K19)
```

### D.5 Data (store.js) — TAHAP 2
- Kunci localStorage: **`anodes-catatan-v1`**.
- Bentuk data: `{ kategori: ['Umum',...], catatan: [{id,judul,isi,kategori,waktu}], aktifId }`.
- Fungsi: `daftar()`, `daftarKategori()`, `tambahKategori(nama)`, `ambil(id)`,
  `aktifId()`, `setAktif(id)`, `baru(kategori)`, `simpan(id,judul,isi,kategori)`,
  `buang(id)`, `pindahKategori(id,kategori)`, `cari(teks)`, `ekspor()`, `impor(json)`.
- `muat()`: kalau kosong → isi 2 catatan contoh + kategori Umum/Rencana.
- `ekspor()` → string JSON `{app:'ANodes', versi:2, kategori, catatan, aktifId}`.
- `impor(json)` → gabung; id bentrok diganti; kategori ikut ditambah.
- **Jalan juga di Chrome Android (HP)** saat dibuka `file://`.

### D.6 Editor (editor.js) — TAHAP 2
- Editor `contenteditable`, format via `document.execCommand`.
- **Auto-save**: tiap `input` → debounce 700 ms → `simpan(true)`; titik kuning/hijau.
- Judul catatan dari **teks baris pertama** (`teksPertama` rekursif ke `childNodes`).
- Cuplikan/judul: beri spasi antar blok (`<p>`, `<h1>`, `<li>`, `<br>`, `tr`, `table`, `ul`, `ol`)
  agar tidak menyambung.
- Tombol Simpan / **Ctrl+S** → toast "Tersimpan jam:menit:detik".
- Pencarian (`#cari`) → saring judul+isi; dropdown `#filter-kategori` → saring kategori.
- Dropdown `#info-kategori` → pindah kategori / `＋ Kategori baru...` (prompt).
- Ekspor → unduh `.json`; Impor → baca `.json` lalu gabung.
- `beforeunload` → simpan kalau masih kotor.
- **Tahap 3 tambahan**: `ubahBlok` (H1-H3/¶), `daftarFmt` (bullet/number/icon),
  `sisipTabel` + modal `gambarGrid`/`masukkanTabel`, `warnai`/`hapusWarna`,
  `sisipIcon` (28), `markupCepat` (manipulasi DOM untuk `# `, `- `, `1. `),
  `paste` bersihkan teks.
- **Daftar WAJIB manipulasi DOM**, jangan `execCommand`: helper `liTerpilih()`,
  `blokTerpilih()`, `listDariLi()`, `jenisLi()`, `gantiTag()`, `setJenisWadah()`,
  `bikinDaftar()`, `matikanDaftar()`, `kupasIcon()`. Ganti jenis = tukar tag UL↔OL;
  jenis sama = toggle OFF; icon = `<ul class="anodes-ico">` + `li[data-ico]`
  (CSS `::before attr(data-ico)` → format sama dengan dot).
  **PENTING**: daftar icon JANGAN pakai `list-style: none` (seleksi jadi macet);
  pakai `list-style: disc` + `li::marker{color:transparent}`.
- Handler toolbar: **satu listener** + cek `dataset.grup` lalu `closest('.submenu')`.

### D.7 Jebakan penting (hasil debugging)
- Setiap wadah flex berisi editor WAJIB `min-height: 0` (kalau tidak, tidak bisa digulir).
- Daftar icon JANGAN `list-style: none` (seleksi macet) — pakai `::marker` transparan.
- Pakai `kupasIconNode(li)` (bukan `li.textContent=`) supaya format dalam item aman.
- `Enter` di akhir judul/daftar menghasilkan `<div>` → `rapikanHtml()` ubah ke `<p>`
  saat simpan (hanya `<div>` tingkat atas).
- `window.open` diblokir browser → pakai modal.
- Jalankan `tools/uji-toolbar.js` (403 uji) setiap kali selesai mengubah kode.
  Alat uji **menyimpan & memulihkan** isi localStorage sendiri — catatan asli
  tidak tertimpa (jangan hapus pengaman `KUNCI_AMAN` di awal file).

### D.8 Rencana Plugin (keputusan 13 Sep 2026)

ANodes = **wadah**; Alkitab / istilah-IT / mesin = **plugin** yang bisa dicabut
(gaya **WordPress**: daftar plugin + halaman info + tombol **Pasang/Lepas**).

| Hal | Keputusan user |
|-----|----------------|
| 3 cara cari ayat | Pilih dari daftar · Ketik nama ayat · Cari lewat kata/kutipan |
| “Senada” | cukup kata sama persis & mirip (`kasih` cocok `mengasihi`) — belum pakai sinonim |
| Data dipasang | ayat saja dulu (±6 MB) |
| Letak tombol | **baris ke-2 di bawah bar hitam**, bergantian dgn toolbar tulis; keduanya bisa sembunyi/tampil |
| Simpan data besar | IndexedDB (localStorage cuma ±5 MB) |
| Muat plugin | `<script src="...">` — ❌ jangan `fetch()` (diblokir Chrome di `file://`) |

**Fitur ↩ kembali + sorot tempat klik (wajib):** klik link ayat → halaman **sebesar note**
→ tombol **↩ kembali** → balik + **sorot kuning** tempat klik tadi ±4 detik.
Ingat dulu `posisiBaca = {scrollY, teks}` (seperti lab3), tapi cari tempat asal pakai
**nomor urut** (bukan hanya teks) supaya tidak salah sorot.

**Kursor tidak boleh lompat** saat pewarnaan otomatis (masalah lab3). Cara aman:
(A) posisi kursor disimpan sebagai **hitungan huruf**, (B) warnai **dari belakang ke depan**,
(C) **lewati sementara** kata yang ditempeli kursor.

Rincian tahapan a–i: `rencanakerja.md` bagian 13 · `agents.md` bagian 7.

### D.9 Gudang Plugin (TAHAP 5a — sudah jadi)

**File:** `js/plugin.js` (mesin) + `plugin/<id>/plugin.js` (keterangan plugin).

**Kontrak plugin** — `plugin/<id>/plugin.js` berisi:

```js
window.ANodesPlug = window.ANodesPlug || [];
window.ANodesPlug.push({
  id: 'alkitab', nama: '…', ikon: '📖', versi: '1.0', penulis: 'ANodes',
  ukuran: '± 6 MB', ringkas: '…', siap: false,
  angka: [{ n: '66', l: 'kitab' }, …],   // kotak angka ringkas
  keterangan: '…',                        // paragraf “apa ini”
  fitur: [ '…' ],                         // “yang bisa dilakukan setelah dipasang”
  cara: [ '…' ],                          // langkah pakai (bernomor)
  catatan: [ '…' ],                       // “sebelum memasang perlu diketahui”
  saatDipasang() {}, saatDilepas() {}     // opsional
});
```

**index.html** — di akhir `body`:

```html
<script src="plugin/alkitab/plugin.js"></script>   <!-- JANGAN pakai fetch() -->
<script src="js/store.js"></script>
<script src="js/setting.js"></script>
<script src="js/plugin.js"></script>
<script src="js/editor.js"></script>
```

**API `ANodesPlugin`:** `daftar()`, `ambil(id)`, `pasang(id)`, `lepas(id)`,
`dipasang(id)`, `bukaGudang()`, `tutupGudang()`, `terapkanBar(siap?)`, `lapisMemuat()`,
`tombolBar()`, `terpasang`, `sedangLihat`, `barTampil`.
❌ `renderBar()` **sudah dihapus** (baris bar plugin tidak dipakai lagi).

**localStorage:** `anodes-plugin-v1` = `{"daftar":["alkitab"]}`.

**Tombol:** `#btn-plugin` (🧩) di kepala, setelah ⚙. Class `.aktif` = putih kalau
ada plugin terpasang; `title` = “Gudang Plugin (n terpasang)”.

**Modal:** `#modal-plugin` > `.modal.plugin-modal` > `#p-isi` (isi digambar JS).
Kelas CSS: `.plugin-kartu` (+ `.terpasang`) · `.plugin-judul.terinstall` / `.tersedia` ·
`.pk-ikon` `.pk-tengah` `.pk-aksi` (+ `button.pk-buka` / `button.pk-pasang`) `.pk-panah` ·
`.plugin-kop`, `.plugin-angka`, `.plugin-blok`, `.plugin-catatan`,
`.plugin-aksi` (`button.pasang` / `button.lepas` / `button.buka`).

**Alat uji:** `tools/uji-toolbar.js` menyimpan `KUNCI_AMAN` (catatan, pengaturan,
plugin, bar, toolbar, daftar) di awal & memulihkannya di akhir — jangan hapus pengaman itu.
Ada juga **cadangan darurat** `anodes-cadangan-uji`: ditulis sebelum uji jalan; kalau uji
berhenti di tengah (error kode), catatan dipulihkan otomatis saat uji dijalankan lagi.
Di awal uji, plugin **dilepas & baris ke-2 diseragamkan** supaya hasilnya konsisten.

### D.10 Baris bar plugin (TAHAP 5b — ⚠️ RIAWAYAT: sudah DIHAPUS 14 Sep 2026 oleh K17)

> ❌ `#bar-plugin` **tidak dipakai lagi**. Sekarang: `▦` = toolbar tulis (ikon tetap)
> · `🧩` = semua urusan plugin (satu halaman). Aturan baru di **D.10b/D.10c**.
> Bagian di bawah hanya catatan riwayat (jangan dibuat ulang).

```html
<!-- index.html: di bawah .info, di atas #toolbar -->
<div class="bar-plugin" id="bar-plugin" hidden></div>
```

**Kontrak tambahan di plugin:**

```js
window.ANodesPlug.push({
  id: 'alkitab',
  nama: 'Alkitab (Terjemahan Baru)',
  namaBar: 'Alkitab',        // nama PENDEK untuk badge di bar (pokok: muat 1 baris)
  bar: [                     // tombol di baris bar plugin — MAKSIMAL 2
    { ikon: '📖', label: 'Alkitab', judul: '…', siap: true, aksi: function () {…} },
    { ikon: '🧩', label: '', judul: 'Gudang Plugin', siap: true,
      aksi: function () { window.ANodesPlugin.bukaGudang(); } }
  ],
  caraCari: [ { no:'1', ikon:'1️⃣', nama:'Pilih dari daftar', ket:'…' }, … ],
  saatDipasang: function () {}, saatDilepas: function () {}
});
```

### D.10b Tombol kepala — IKON TETAP (perbaikan 14 Sep 2026)

```
ANodes  Tahap 5  ●      [▦] [⚙] [🧩] [File ▼] [🔍 Cari ▼] [🗂️ Berkas]
                        ↑ toolbar tulis    ↑ semua urusan plugin
```

| Tombol | Ikon | Aksi |
|--------|------|------|
| `#btn-toolbar` | **▦ tetap** | sembunyi/tampilkan toolbar tulis · **Alt+klik** = sembunyikan seluruh baris ke-2 |
| `#btn-plugin` | **🧩 tetap** | gudang plugin = **semua urusan plugin** (pasang · buka · lepas) |

❌ **JANGAN** membuat ikon tombol berganti sendiri. Dulu `#btn-toolbar` menaruh 🧩 saat
ada plugin → **kembar** dengan `#btn-plugin` (🧩) di sebelahnya → user bingung (K17).
❌ **Baris “bar plugin” (`#bar-plugin`) sudah DIHAPUS.** Cukup satu baris: toolbar tulis.
`js/plugin.js` tidak lagi punya `renderBar()` / `pluginBerbar()` / `bar.nampak`.

```js
// terapkanBar() — satu-satunya pengendali toolbar tulis
const tampil = bar.siap !== '0';
if (toolbar) toolbar.hidden = !tampil;
if (barEl) barEl.hidden = true;   // baris bar plugin tidak dipakai lagi
```

⚠️ **Kalau menghapus fungsi, CARI DULU semua pemanggilnya.** Dulu `renderBar()` dihapus
tapi `plugin/alkitab/alkitab.js` masih memanggilnya (2 tempat) → error tiap halaman dibuka.

### D.10c Gudang plugin — 2 KELOMPOK (perbaikan 14 Sep 2026)

```
🧩 GUDANG PLUGIN
├─ ✔ Plugin yg terinstall                   ← SELALU DI ATAS
│    📖 Alkitab (Terjemahan Baru)  [▶ Buka Alkitab]  ›
└─ ▸ Plugin yg tersedia (belum diinstall)
     🗓️ Bacaan Alkitab 1 Tahun                  ›
     🔖 Bookmark Ayat                           ›
```

- Plugin yang **baru dipasang otomatis NAIK** ke kelompok atas.
- Satu fungsi `kartuPlugin(p)` dipakai kedua kelompok.
- Tombol cepat: **▶ Buka** (pakai `p.buka()` + `p.tombolBuka`) · **⬇ Pasang** (kalau `p.siap`).
  Klik kartu = halaman keterangan (di situ ada ▶ Buka + 🗑 Lepas).
- ⚠️ **Kartu WAJIB grid kaku**: `grid-template-columns: auto minmax(0,1fr) auto auto`.
  Kalau `flex`, di panel sempit **teks jatuh ke bawah ikon & badge pindah baris**.
  ≤400px: tombol cepat pindah ke baris bawah kolom teks.
- ⚠️ **🕊️ Pengingat Firman DILEPAS 3 Nov 2026 (K96)** — tag `<script>`-nya **dihapus** dari
  `index.html` (bukan dikomentari: `<!-- <script src> -->` tetap disatukan penggabung versi HP
  ⇒ berkas membengkak tanpa guna). Berkas `plugin/pengingat/plugin.js` **tetap ada**; idenya
  di papan C **I-09** dan bisa menyusul **di dalam** plugin 🗓️.
- **Kartu plugin sekarang:** 🗓️ **Bacaan Alkitab 1 Tahun** (`plugin/baca1tahun/plugin.js`,
  K96) menggantikan kartu 🕊️ tadi.
**Aturan baris ke-2 (JANGAN dilanggar):**
- Satu-satunya pengendali tampil/sembunyi = `ANodesPlugin.terapkanBar()`.
  `js/editor.js` **tidak boleh** menyentuh `#toolbar.hidden` (dulu bentrok).
  `#btn-toolbar` **tidak boleh** punya listener lain (dulu dobel).
- **localStorage `anodes-bar`** = `{siap:'1'|'0'}`. Baca lama `anodes-toolbar='0'`
  → migrasi otomatis ke `siap:'0'`.
- ❌ ❌ **`#bar-plugin` SUDAH DIHAPUS (K17)** — `renderBar()`, `pluginBerbar()`,
  `bar.nampak`, `rapikanBar()` **tidak ada lagi**. ❌ Jangan dibuat kembali.
- ❌ **Ikon tombol kepala TETAP** (▦ toolbar tulis · 🧩 gudang plugin) —
  lihat **D.10b**. ❌ Jangan pernah membuat ikon berganti sendiri.
- **Gudang plugin TUTUP SENDIRI** setelah tombol **Pasang** ditekan
  (`js/plugin.js` → `tutupGudang()`), lalu toast “… siap dipakai” setelah data siap.
- Tombol `siap:false` → tampil pudar (`.bp-coba`) + klik hanya memunculkan toast
  “⏳ … menyusul pada tahap berikutnya” (tidak error).
- **Klik-2 pada tombol 🧩** di kepala = sembunyikan seluruh baris ke-2.

**API `ANodesPlugin`:** `daftar, ambil, pasang, lepas, dipasang, bukaGudang, tutupGudang,
terapkanBar, lapisMemuat, renderToolbar, tombolBar, terpasang, sedangLihat, barTampil`.
(`renderBar()` **sudah dihapus** — kalau ada pemanggilnya, itu error; cari dulu semua pemanggil.)

**Alat uji:** uji **P17a–P24 + Q1–Q11 + Z10–Z19** (blok P, Q, Z di `tools/uji-toolbar.js`).

### D.10d 🧩 Tombol plugin di toolbar tulis (K18 — 14 Sep 2026)

```
[↶][↷][¶ ▼][• ▼][B][I][▦ ▼][▬ ▼][A ▼][✕][✅ ▼][🧩 ▼]
                                              ↑ K18
klik [🧩 ▼] →
   ┌────────────────┐
   │ 📖  Alkitab      ›  │  HANYA plugin yang sudah terinstall
   │ 🧩  Gudang Plugin…   │  jalan ke gudang (pasang/lepas)
   └────────────────┘
belum ada plugin → "Belum ada plugin terpasang."
```

**HTML (`index.html`)** — satu grup baru di ujung kanan `#toolbar`:
```html
<div class="grup">
  <button class="dasar" data-grup="plugin"
          title="Plugin yang sudah terpasang (klik untuk pilih)">
    <span id="plugin-isi">🧩</span> <span class="panah">▼</span>
  </button>
  <div class="submenu submenu-plugin" data-sub="plugin"></div>
</div>
```

**`js/plugin.js`:**
| Fungsi | Tugas |
|--------|-------|
| `renderToolbar()` | isi `.submenu[data-sub="plugin"]` — **plugin terinstall saja** (`daftar().filter(p=>dipasang(p.id))`) + baris `.ke-gudang` |
| `tandaKepala()` | diakhiri `renderToolbar()` → isi submenu otomatis segar saat Pasang/Lepas |

- Baris plugin: `.submenu-plugin-baris` > `.smp-ikon` · `.smp-nama` · `.smp-panah`;
  klik → `p.buka()` (mis. Alkitab). Baris gudang: kelas tambahan `.ke-gudang`.
- Tombol dasar dapat kelas `.ada-plugin` (pinggir hijau) kalau ada plugin terpasang.
- Pesan kosong: `.submenu-kosong` → “Belum ada plugin terpasang.”
- ⚠️ Isi submenu diisi **ulang** oleh `renderToolbar()` setiap ada perubahan
  Pasang/Lepas — ❌ jangan menanam isinya di `index.html`.

**CSS:** `.submenu.submenu-plugin{min-width:calc(180px*var(--skala));max-width:min(320px,78vw)}`
· `.submenu-plugin-baris{display:flex}` · `.smp-nama{overflow:hidden;text-overflow:ellipsis}`
· `.toolbar button.dasar.ada-plugin{border-color:#1b7a37}`.

⚠️ **Letak submenu diatur `pasangSubmenu()`** (lihat D.4c) — tombol 🧩 ada di ujung
KANAN, jadi submenunya kadang harus ditempel `right: 0` supaya tidak keluar layar.
❌ **Jangan** pakai `overflow-x: auto` pada `.toolbar` — itu memotong semua submenu.

**Alat uji:** uji **Z10–Z20** (blok Z di `tools/uji-toolbar.js`) + **N1b–N1d**.

### D.10e 🗓️ PLUGIN BACAAN ALKITAB 1 TAHUN (K96 — 3 Nov 2026) · **halaman ke-10**

> Permintaan Bapak: *“saya mau buat bacaan 1 th alkitab artinya 1th baca selesai semua..
> setiap hari ntah berapa pasal.. pasal2 yg di beri tentu user sudah dilengkapi banyak
> referensi.. apakah km bisa menenukan daftar baca alkitab”* ⇒ **menggantikan 🕊️ Pengingat
> Firman** yang selama ini kosong.

**Berkas (semua BARU):**

```
tools/siapkan-data-baca.js              ← ALAT DATA (dijalankan sekali)
plugin/baca1tahun/data/baca.js          ← DATA 212,9 KB (hasil alat, jangan diedit tangan)
plugin/baca1tahun/baca.js               ← MESIN   → window.ANodesBaca
plugin/baca1tahun/plugin.js             ← KETERANGAN (kartu gudang, tombolBuka + buka())
plugin/baca1tahun/tampilan.js           ← TAMPILAN → window.ANodesBacaTampilan
tools/uji-blok/K96.js                   ← 44 uji sasaran
```

**Bentuk data:**

```js
window.ANodesBacaData = {
  meta: { versi, sidik, jumlahHari, jumlahRencana, totalPasal, totalAyat, dibangun },
  rencana: {
    urut: { id, nama, ket, jalur:[{id,nama}], jumlahHari, pasalTercakup,
            hari:[ { h, ayat, pasal, blok:[ { jalur, dari:{k,p}, sampai:{k,p},
                                             pasal: null|[[k,p],…], ayat, rapat } ] } ] }
  }
}
```

⚠️ **`pasal` = `null` bila blok RAPAT** (361/365 blok `urut`, 786/788 `plpb`, 786/787 `edw`) —
diuraikan saat dipakai oleh **`daftarPasalBlok(b, info)`**. Menghemat **±46 KB**.

**3 RENCANA — semuanya 100 % cakupan (1.189/1.189 pasal · 365 hari):**

| id | Nama | Jalur | Ayat/hari | Ringan | Berat |
|---|---|---|---|---|---|
| `urut` | 🅰️ Berurutan Kejadian→Wahyu | 1 | **28–176 (tengah 85)** | 17 | **1** |
| `plpb` | 🅱️ PL + PB tiap hari | 2 | 26–207 | 57 | 13 |
| `edw` | ⭐ Every Day In the Word (PL+PB+Mzm+Amsal) | 4 | 22–259 | 63 | 23 |

**ALGORITMA PEMBAGI (jangan diganti) — ayat-berimbang:**

```js
const target = TOTAL / days;
let jalan = 0;
for (const c of chapters) {
  let h = Math.floor((jalan + c.ayat / 2) / target);   // titik tengah imbas pasal
  if (h >= days) h = days - 1;
  hasil[h].push(c);
  jalan += c.ayat;
}
```

❌ **“Tumpuk sampai ≥ target” SALAH** — hasilnya cuma **27 hari**, bukan 365.
⚠️ **`edw`/`plpb` memakai `PL_TANPA_PUISI = k <= 39 && k !== 19 && k !== 20`** supaya
Mazmur & Amsal **tidak dihitung dua kali** (kalau tidak: 1.370 pasal, bukan 1.189).

**Halaman ke-10 `#baca1tahun-halaman`** (anak `body`) berisi 5 bagian:

```
kartuRingkas   → hari ke-n dari 365 · tanggal · bilah progres · n% selesai · sisa hari · 🔥 berturut
barRencana     → 3 tombol pilih rencana
kartuHari      → “📖 Hari ini — hari n” · baris blok (tag PL/PB/Mzm/Ams) · tombol 📖 per baris
                 · [📖 Buka di Alkitab] [○ Tandai sudah dibaca] · “📅 Besok — hari n+1”
kalender       → 365 sel (`.bt-kal-sel`, cursor pointer) · sel dibaca berwarna
kaki           → keterangan + tombol kosongkan
```

**Progres:** `localStorage['anodes-baca1tahun-v1']` =
`{ versi:1, rencana, mulai:'YYYY-MM-DD', selesai:{ "12": ms, … }, terakhir }`.
Hari ke-n = `selisihHari(mulai, hariIni) + 1` ⇒ **hari yang terlewat tidak menumpuk**.

**☁️ Disinkronkan** — `anodes-baca1tahun-v1` adalah **kunci sinkron ke-6** (`js/sinkron.js`).

⚠️ **WAJIB `siapkanOtomatis()` punya pemanggil sendiri** di `tampilan.js`
(`document.readyState === 'loading' ? DOMContentLoaded : setTimeout(…, 0)`) — pelajaran **K92**:
tanpa itu tombol hilang sesudah F5.

⚠️ **Halaman menyembunyikan DIRINYA SENDIRI** sebelum `bukaRentang()` — `pindahKeBaca()`
hanya menangani `#app-utama` & `#baca-alkitab` (pelajaran **K81b**).

⚠️ **Uji:** `node tools/uji-sasaran.js K96` → **59 uji · 0 gagal · ±8 dtk**.
Kalau blok **tidak mengeluarkan hasil apa pun** ⇒ hampir pasti **SyntaxError** —
jalankan **`node --check tools/uji-blok/K96.js` DULU** (sudah terjadi: `cekUnik` dideklarasikan 2×).

#### K97 (3 Nov 2026) — 📅 tombol pintu di navbar halaman baca Alkitab

Bapak: *“saya mau minta bacaan di tempatkan di dalam menu seperti yg pasted image ada panah”*
⇒ tombol **`#baca-bacaan`** ditempelkan ke **`.ay-nav-b1`** — **pola SAMA** seperti 🔖 Bookmark
(K82): plugin menempel sendiri, plugin Alkitab **tidak perlu tahu**.

```
[🏠] [Kejadian ▾] [📋 PILIH] [🔍 Cari] [📅] [🔖] [📤] [🖊]
                                        ↑ K97 — latar hijau muda #eef7ea
```

| Fungsi | Tugas |
|---|---|
| `pasangTombolNavbar()` | tempel/buat `#baca-bacaan` (dipanggil ulang tiap `siapkanOtomatis()`) |
| `segarkanTombolNavbar()` | ikon **📅 belum dibaca** ⇄ **✅ sudah dibaca** |
| `bukaDariAlkitab()` | buka halaman 🗓️ — 🔴 **JANGAN** sembunyikan `#baca-alkitab` dulu |
| `pulihDariAlkitab(info)` + `daftarkanPemulih()` | 🏠 kembali ke **HALAMAN BACA** |

🔴 **CACAT YANG SUDAH TERJADI (jangan diulang):** `bukaDariAlkitab()` sempat menyembunyikan
`#baca-alkitab` **sebelum** `bukaHalaman()`. Akibatnya `bukaHalaman()` mencatat asal =
`#app-utama` ⇒ 🏠 kembali ke **catatan**, bukan halaman baca. **`bukaHalaman()` mencari sendiri
halaman asal dari `body > .app` yang masih tampil** — biarkan ia bekerja.

⚠️ `css/app.css` blok **K97**: latar `#eef7ea` · garis `#b6d5ab` · `min 44×44 px` pada
`@media (pointer: coarse), (hover: none)`. Navbar tetap **1 baris** (terukur **464 ≤ 464 px**, juga di **344 px**).

🔴 **K102 (6 Nov 2026) — SEMUA `@media (pointer: coarse)` WAJIB dipasangkan `(hover: none)`.**
Terukur di WebView APK: `pointer: coarse` = **`false`** (padahal `maxTouchPoints=5` ·
`hover:none=true`) ⇒ **seluruh tata letak sentuh mati** di APK. Sekarang **8 tempat** berbunyi
**`@media (pointer: coarse), (hover: none)`**. ⚠️ **Jebakan operator:** `and` lebih kuat dari `,`
⇒ `(pointer: coarse) and (max-width: 360px)` **WAJIB** ditulis dua kali
(`(pointer: coarse) and (max-width: 360px), (hover: none) and (max-width: 360px)`).
⚠️ **Baris flex di dalam kolom flex WAJIB `flex-shrink: 0`** kalau isinya tidak boleh terpotong —
`.info` menyusut **20,6 px** dari kebutuhan **29 px** ⇒ **Kategori & 🔗 ON/OFF hilang**.

🔴 **K103 (6 Nov 2026) — SAKELAR TAMPILAN DI `localStorage` WAJIB PUNYA JALAN PULANG YANG TERLIHAT.**
Keluhan pemilik proyek *"menu bawah tidak ada di Z Flip 3, tapi ada di Note 8"* **bukan** cacat tata
letak (K102 sudah beres) — sebabnya **`localStorage['anodes-bar'] = {"siap":"0"}`** ⇒ `#toolbar.hidden
= true`, `display:none`, tinggi **0 px**, `#editor` melebar **627 px**. Nilai itu **bertahan**
sesudah aplikasi ditutup, dan satu-satunya jalan pulang hanyalah `#btn-toolbar` (**▦ Tulis**, tombol
paling kiri di kepala) yang **tidak pernah disebut** di Bantuan.

**Aturan baru (jangan dilanggar):**

| # | Aturan |
|---|---|
| **1** | `ANodesPlugin.terapkanBar()` adalah **satu-satunya** pemilik `#toolbar.hidden` ⇒ penjaga dipasang **di situ** (`stripPemulih(!bar.paket && !tampil)`), ❌ jangan di tempat lain |
| **2** | Saat toolbar disembunyikan ⇒ **WAJIB** muncul **strip `.bar-pulih`** (`#bar-pulih`) berisi teks *"▦ Toolbar tulis disembunyikan"* + tombol **`#bar-pulih-tampil`** `[Tampilkan]` |
| **3** | Strip **TIDAK boleh** muncul saat bar paket ayat bergantian (`paketAktif()` benar) — itu **bergantian**, bukan disembunyikan |
| **4** | Tombol `[Tampilkan]` **≥ 44 px** & `cursor: pointer` pada `@media (pointer: coarse), (hover: none)` |
| **5** | API wajib tersedia untuk uji: **`ANodesPlugin.baris()`** (`siap` · `paket` · `paketTampil` · `tampil` · `tinggi` · `pemulih`) + **`ANodesPlugin.tampilkanBar()`** |
| **6** | `js/bantuan.js` (K64) **WAJIB** menyebut `▦ Tulis` + strip `[Tampilkan]` di halaman 📝 catatan |

⚠️ **Cara mendiagnosis keluhan sejenis:** periksa **`localStorage['anodes-bar']`** di perangkat
yang bermasalah **SEBELUM** menyentuh CSS. Keluhan *"ada di HP A, tidak ada di HP B"* hampir selalu
**data**, bukan tata letak.

🔴 **K104 (6 Nov 2026) — TOOLBAR TULIS **TIDAK BOLEH BISA DISEMBUNYIKAN** LAGI.**
K103 hanya menambah **jalan pulang** (strip `[Tampilkan]`). Pemilik proyek memilih **membuang
akarnya**: tombol **▦ Tulis** (`#btn-toolbar`) **DIHAPUS** dan toolbar **selalu tampil**.

**Aturan baru (jangan dilanggar):**

| # | Aturan |
|---|---|
| **1** | `ANodesPlugin.terapkanBar()` **TIDAK PERNAH** menyetel `#toolbar.hidden = true` — toolbar **selalu tampil** (fungsi tinggal **6 baris**) |
| **2** | `bar.siap` **selalu** `'1'` · `bacaBar()` **WAJIB menimpa** nilai lama `{siap:"0"}` jadi `{siap:"1"}` ⇒ perangkat yang terlanjur kena **sembuh sendiri** |
| **3** | Kunci usang **`anodes-toolbar`** dibersihkan saat halaman dibuka |
| **4** | Tombol **▦ Tulis** (`#btn-toolbar`) **TIDAK ADA LAGI** — ❌ jangan dihidupkan kembali |
| **5** | Bar paket ayat (K20) **DI ATAS** toolbar — **keduanya tampil bersamaan** (❌ tidak lagi bergantian) · `paketTampil` disimpan hanya untuk pemanggil lama |
| **6** | `js/bantuan.js` (K64) **WAJIB** menyebut *"toolbar **selalu tampil**"* di halaman 📝 catatan |
| **7** | API uji: **`ANodesPlugin.baris()`** (`siap` · `paket` · `paketTampil` · `tampil` · `tinggi` · `pemulih`) + **`tampilkanBar()`** tetap ada |

⚠️ **Pelajaran:** kalau sebuah fitur menyembunyikan hal penting **dan tidak ada jalan pulang**,
**hapus fiturnya** — ❌ jangan hanya menambah tombol pemulih. Jalan pulang masih menuntut
pengguna **tahu** harus menekan apa; menghapus akarnya membuat cacatnya **mustahil**.

### D.10f 🔀📖 DUA PLUGIN DARI SUMBER AYT (K86 paralel · K99 judul perikop — 3 Nov 2026)

> Keduanya membaca **sumber yang SAMA**: `tools/_sumber-ayt/*.usfm` (70 berkas AYT dari
> eBible.org · `indayt_usfm.zip` 1.575.061 byte · **CC BY-NC 4.0** · pemakaian pribadi).
> ❌ **Jangan unduh ulang** — dua alat data memakai folder itu.

#### K86 — 🔀 Paralel Terjemahan (TB ⇄ AYT)

**Berkas:**

```
tools/siapkan-data-paralel.js           ← ALAT DATA
plugin/paralel/data/paralel.js          ← DATA 5.073,4 KB · sidik ayt-66-31102-8b98ec85
plugin/paralel/paralel.js               ← MESIN   → window.ANodesParalel (IndexedDB kunci `paralel`)
plugin/paralel/tampilan.js              ← TAMPILAN → window.ANodesParalelTampilan
plugin/paralel/plugin.js                ← KETERANGAN (kartu gudang)
tools/uji-blok/K86.js                   ← 42 uji sasaran
```

**Bentuk:** **bertumpuk per ayat** — TB di atas, kotak AYT di bawahnya. ❌ **bukan 2 kolom**
(diukur `.app` maks **480px** ⇒ 2 kolom hanya **±220px**). Tombol **`#baca-paralel`** di
`.ay-nav-b1` (pola 🔖 K82) · kunci `anodes-paralel-aktif`.

**🔴 3 CACAT PENGURAI USFM (semuanya TANPA error — teks diam-diam kosong):**

| Cacat | Akibat | Perbaikan |
|---|---|---|
| Tabel `\tr`/`\tc1`/`\tc2` tidak ditangani | **Wahyu 7:5–8 hilang** (31.098 ayat) | cabang `\tc`/`\th` |
| Baris puisi `\q1`/`\q2` tidak ditangani | **isi Mazmur hilang** (Mzm 23:1 = *“Nyanyian Daud.”* saja) | cabang `\q1-4` · `\m` · `\mi` · `\pi` · `\li` · `\pc` · `\nb` · `\p` |
| Ayat gabung `(22:9)` (Yes 22:10/11/18) | ayat tampak kosong | teks *“— (pada AYT ayat ini digabung dengan ayat N)”* + `a.gabung = true` |

⚠️ **Selisih jumlah ayat = alat pemeriksa terbaik** — `31.098 vs 31.102` langsung menunjukkan
4 ayat hilang. Tanpa pembanding TB, cacat itu **tidak akan terlihat**.

#### K99 — 📖 Judul Perikop

**Berkas:**

```
tools/siapkan-data-perikop.js           ← ALAT DATA
plugin/perikop/data/perikop.js          ← DATA 132,5 KB · sidik pk-2573-6df3cabe
plugin/perikop/perikop.js               ← MESIN   → window.ANodesPerikop (IndexedDB kunci `perikop`)
plugin/perikop/tampilan.js              ← TAMPILAN → window.ANodesPerikopTampilan
plugin/perikop/plugin.js                ← KETERANGAN (pilihanTampil tampil/mati)
tools/uji-blok/K99.js                   ← 42 uji sasaran
```

**Bentuk data:** `{ meta, perikop: { '41.1.9': { j:'Pelayanan Yohanes Pembaptis', t:1 } } }`
(`t` = tingkat: **1** = `\s1` judul utama · **2** = `\s2` sub-judul).

**Tampilan:** `hias()` menyisipkan `.pk-judul` **sebelum baris ayat** · sub-judul
`.pk-judul.pk-sub` · kaki atribusi `.pk-kaki` · kunci **`anodes-perikop-cara`** (`tampil`|`mati`).

**❌ TANPA TOMBOL NAVBAR — ini KEPUTUSAN HASIL UKUR:** navbar sudah **9 tombol · 324 = 324 px**
⇒ tombol ke-10 **pasti meluber**. ON/OFF lewat **halaman keterangan plugin** (`pilihanTampil`).

**🔴 2 CACAT DATA:**

| Cacat | Akibat | Perbaikan |
|---|---|---|
| **Penomoran berkas eBible ≠ nomor kitab** — `02-GEN`=1 · `40-MAL`=39 · `70-MAT`=40 · `96-REV`=66 · **tidak ada `01-*`** | percobaan pertama hanya **27 kitab** | peta eksplisit `eBible → ANodes` |
| **30 judul palsu** di Amsal 22–24 (`\s2 "—1—"` … `"—30—"` = nomor amsal) | 30 “judul” tak bermakna | `judulPalsu()` — buang `/^[—–\-\s]*\d+[—–\-\s]*$/` |

**Hasil:** **2.573 judul · 66 kitab · 1.144/1.189 pasal (96,2 %)** · 45 pasal tanpa judul
(Imamat 22 · Ulangan 24 · Yosua 17 · Ayub 5/7/10/13/14/17/24/27/30/31 …) · Mazmur 119 punya
**22** judul huruf Ibrani (Alef … Taw).

⚠️ **Uji:** `node tools/uji-sasaran.js K86` → **42 · 0 · ±13 dtk** ·
`node tools/uji-sasaran.js K99` → **42 · 0 · ±9 dtk**.

### D.10g 🕒 PLUGIN LINIMASA SEJARAH (K87 — 3 Nov 2026) · **halaman ke-11**

> **Beda dari 📖 Sejarah Kitab (K55):** yang itu **panel per kitab** (penulis · rentang tahun ·
> tema · tokoh · ayat kunci). Yang ini **450 PERISTIWA** berurutan menurut tahun ⇒ bisa
> **dibandingkan** (nabi mana sezaman dengan raja mana).

**Berkas:**

```
tools/osis.js                    ← peta OSIS 3 huruf → nomor kitab 1–66 (dipakai alat data)
tools/linimasa-terjemah.json     ← 450 judul Inggris → Indonesia (ditulis tangan)
tools/linimasa-bagian.json       ← 41 nilai partOf → Indonesia
tools/_sumber-linimasa/Events.csv ← sumber mentah (robertrouse/theographic-bible-metadata)
tools/siapkan-data-linimasa.js   ← ALAT DATA (menolak judul tanpa terjemahan / judul kembar)
plugin/linimasa/data/linimasa.js ← DATA 213,4 KB · sidik lm-450--4003-57-3f9bc0c1
plugin/linimasa/linimasa.js      ← MESIN   → window.ANodesLinimasa (IndexedDB kunci `linimasa`)
plugin/linimasa/tampilan.js      ← TAMPILAN → window.ANodesLinimasaTampilan
plugin/linimasa/plugin.js        ← KETERANGAN (kartu gudang · tombolBuka)
tools/uji-blok/K87.js            ← 56 uji sasaran
```

**Bentuk data:** `{ meta, peristiwa: [{ tahun, judul, bagian, ayat:[[k,p,a,a], …] }] }` —
**sudah terurut** menurut tahun, dengan **urutan baris sumber** sebagai pemutus.

**Tampilan:** `.lm-peristiwa` (grid: `.lm-tahun` · `.lm-judul` · `.lm-bagian` · `.lm-ayat`) ·
**9 chip zaman** + kotak cari · `MAKS_AYAT_TAMPIL = 6` (+`n lagi`) · klik chip ⇒
`bukaRentang()` (❌ tanpa mesin baru) · kunci `anodes-linimasa-zaman` / `anodes-linimasa-kata`.

**🔴 2 CACAT SUMBER:**

| Cacat | Akibat | Perbaikan |
|---|---|---|
| **BOM `\uFEFF`** di baris pertama CSV | nama kolom pertama jadi `\uFEFFtitle` ⇒ `title` **tidak pernah** ditemukan | `replace(/^\uFEFF/,'')` sebelum mengurai |
| **`startDate`** kadang **angka** (`-4003`) kadang **tanggal ISO** (`0030-04-04`) | tahun tidak terbaca / `NaN` | `tahunDari()` — ambil 4 digit pertama untuk ISO |

**🔴 3 CACAT YANG KETEMU SAAT MENGUJI:**

| Cacat | Akibat | Perbaikan |
|---|---|---|
| Pengurut **abjad** sebagai pemutus tahun sama | *“Penciptaan Adam dan Hawa”* tampil **sebelum** *“Penciptaan segala sesuatu”* | **urutan baris sumber** (`a.urut - b.urut`) |
| **2 judul Indonesia kembar** (`Reign of Jehoash` · `Death of Jehoahash`) | dua peristiwa berjudul sama | dibedakan **“(Israel)”** · pembangun **menolak** judul kembar |
| 🏠 dari Alkitab kembali ke **catatan** | pengguna kehilangan tempat | `ingatAsalAyat({jenis:'linimasa'})` **sebelum** lompat (pola 🔖 K81b) |

**Hasil:** **450 peristiwa · 9 zaman · 17.570 rujukan · 213,4 KB** ·
zaman **63/65/25/9/81/4/0/93/110 = 450** · **56 uji · 0 gagal · 10,7 dtk**.

### D.12 Tautan ayat + halaman baca GAYA BUKU + cari (TAHAP 5d/5e/5f/5h)

**Berkas:** `plugin/alkitab/tampilan.js` (tampilan) · logika di `plugin/alkitab/alkitab.js`.

**Struktur index.html (WAJIB — jangan diubah tanpa cek):**

```html
<div class="app" id="app-utama"> … </main> </div><!-- /wrap --> </div><!-- /app-utama -->
<div class="app halaman-alkitab" id="baca-alkitab" hidden>
  .alkitab-nav → #baca-kembali ↑kembali · #baca-kitab · #baca-pasal
                 #baca-prev ◀ · #baca-next ▶ · #baca-back ↩
                  #baca-pilih 📋 PILIH · #baca-ketik 🔍 Cari
  .baca-isi#baca-isi   → .ay-judul · .ay-meta · .ayat-baca
</div>
```

⚠️ **`#baca-alkitab` harus ANAK `body`, sejajar dengan `#app-utama`.**
Dulu tag `</div>` penutup hilang → halaman baca terjebak di dalam `app-utama`
→ saat app-utama disembunyikan, halaman baca ikut hilang (user: “catatan hilang”).
**Periksa**: `document.getElementById('baca-alkitab').parentElement === document.body`.

⚠️ **`display:flex` MENIMPA atribut `hidden`.** Wajib ada:
```css
.app[hidden] { display: none !important; }
.halaman-alkitab[hidden] { display: none !important; }
```

**Format BUKU (meniru lab3):**

| Bagian | Bentuk |
|--------|--------|
| Kepala buku | `.ay-judul` = “Matius 5” · `.ay-meta` = “48 ayat” + garis |
| Ayat | `.ayat-baca` (blok) > `span.no` (nomor di kiri) + `span` teks |
| Perkataan Yesus | `span.merah` warna `#b3261e` — pakai `a.merah` (sudah ada di data TB) |
| Ayat yang dituju | `.ayat-baca.target` — latar `#fdf3d7` + garis `#f5a623` |
| Pindah pasal | `.ay-nav` di bawah bacaan |
| Hasil cari | pakai `.ayat-baca` juga, judulnya `.ay-judul` |

⚠️ **Jangan pakai `red-letter.json` langsung** — penomorannya memakai WEB,
ayat bisa geser. Data TB **sudah punya** properti `merah:true` (2.059 ayat).

**Navbar baca — 1 BARIS (perbaikan 14 Sep 2026):**

```
[🏠] [Kitab ▾] [Pasal ▾] [◀] [▶] [↩] [📋 PILIH] [🔍 Cari]
```

| Tombol | Fungsi | Fungsi di `tampilan.js` |
|--------|--------|--------------------------|
| `#baca-kembali` (**🏠**) | balik ke catatan + sorot tempat klik | `kembali()` |
| `#baca-kitab` | ganti kitab → mulai pasal 1 | `gambarPasal(no, 1, 0, true)` |
| `#baca-pasal` | ganti pasal (isi = **angka saja**) | `gambarPasal(no, pasal)` |
| `#baca-prev` / `#baca-next` | pasal ±1 (non-aktif di ujung) | `segarkanTombol()` |
| `#baca-back` (↩) | posisi sebelumnya | riwayat 30 langkah `riwayat[]` |
| `#baca-pilih` | grid kitab→pasal→ayat | `bukaPilih()` · `#ab-pk-overlay` |
| `#baca-ketik` (**🔍 Cari**) | satu kotak: nama ayat **atau** kata/kutipan | `bukaKetik()` · `#ab-ketik-overlay` |

⚠️ `gambarPasal(kitab, pasal, ayatTarget, tanpaRiwayat)`: klik tautan dari catatan
memakai `true` (riwayat direset); ganti pasal memakai `false` (dicatat ke riwayat).
⚠️ **📋 PILIH** = grid 6 kolom (4 kolom di ≤480px), kitab no ≥ 40 (PB) berlatar gelap
(`.ab-pk-kitab.pb`), ada “← kitab” / “← pasal” + tulisan langkah di bawah.
⚠️ **🔍 Cari** satu kotak serba bisa: `kenaliAyat()` berhasil → “📖 Buka …”;
kalau tidak → “🔍 Cari ayat yang memuat …”.
⚠️ **`⌨ KETIK` DIHAPUS** (14 Sep 2026) — fungsinya **disatukan** ke `🔍 Cari`.
⚠️ **`#baca-cari` SUDAH TIDAK ADA.** `Ctrl+B` di halaman baca = kembali ke catatan.
⚠️ Navbar **`flex-wrap: nowrap`** + kitab/pasal punya `min-width`; layar ≤420px & ≤360px
   dirapatkan. ❌ Dulu `wrap` → di HP pecah 2–3 baris & baris atas terpotong.
⚠️ Tinggi `.app`/`body` pakai **`100dvh`** (bukan hanya `vh`) supaya toolbar atas
   tidak terpotong di HP.

`gambarPasal(noKitab, noPasal, ayatTarget)` — argumen ke-3 opsional untuk sorot ayat.

**Mengenali nama ayat (urutan WAJIB — jangan diubah tanpa alasan):**

```
1. cari ANGKAnya dulu:  /\b(\d{1,3})(?:\s*([:.])\s*(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?)?/g
2. lihat 30 huruf ke BELAKANG angka itu, ambil 1-3 kata terakhir
3. uji 3 kata → 2 kata → 1 kata, PILIH skor terkecil (bukan yang pertama ketemu)
```

❌ Jangan dibalik (nama kitab dulu) — dulu `“dan juga 1”` terbaca **“Daniel 1”**.

**Aturan aman di `kenaliKitab()`:**
- `SEBUTAN` (alias tulis) dicocokkan **hanya** ke kitab dengan singkatan sama.
- `KATA_UMUM` (dan, ayat, pasal, ya, …) → **tolak**.
- awalan (`startsWith`) hanya kalau tulisan **≥3 huruf**.
- salah tulis hanya kalau **≥3 huruf** & jarak ≤1 (≤2 kalau nama panjang ≥8 huruf).
- pemisah `:` atau `.` **dipertahankan** seperti ditulis user.

**Penanda tautan (`span.ay-link`) TIDAK disimpan:**
- `js/editor.js` → `simpan()` memanggil `ANodesAlkitab.bersihTanda(html)` dulu.
- `tampilkan(c)` memanggil `tandaAyatSekarang()` (plugin hanya menandai kalau terpasang & siap).
- `saatDilepas()` membersihkan penanda + menutup halaman baca.

**Kursor tidak lompat (wajib dijaga — pelajaran lab3):**

| Ide | Pelaksanaan |
|-----|-------------|
| A | `offsetKursor()` = hitungan huruf → `pasangKursor()` (TreeWalker) |
| B | bangun ulang per text node: `<span>` sementara → `DocumentFragment` → `replaceChild` **sekali** |
| C | `potongTeks(teks, daftar, batasKursor)`: lewati **HANYA nama ayat** yang memuat kursor (`kursorDi >= mulai && kursorDi < akhir`) |

⚠️ Ide C ❌ **jangan** melewati seluruh paragraf (tautan baru tidak akan muncul).
⚠️ Kursor tepat di ujung → tautan **tetap** dibuat (`< akhir`, bukan `<=`).

**Cari ayat — 3 pintu (2 di toolbar baca + 1 di toolbar tulis):**
1️⃣ **📋 PILIH** (grid kitab → pasal → ayat) · 2️⃣ **🔍 Cari** ketik nama ayat
(`why 22:21`) · 3️⃣ **🔍 Cari** ketik kata/kutipan → hasil **dikelompokkan per kitab**
(maks 40 ayat/kitab), cocok memakai `indexOf >= 0` (`kasih` cocok `mengasihi`).

**Alat uji:** uji **T1–T21 + W1–W7 + P17a–P24 + Q1–Q11 + Z1–Z20 + Y1–Y16**
di `tools/uji-toolbar.js` (**403 uji, 0 gagal**).
Nama variabel harus unik (pernah bentrok `tampilLapis`, lalu `rT` → SyntaxError,
seluruh uji gagal jalan).
Uji penting (jangan dihapus): **T7** kursor tidak lompat · **T9b** catatan & halaman
baca tidak tampil bersamaan · **T9c** halaman baca punya tinggi · **T15e/T15f**
perkataan Yesus benar-benar merah `rgb(179, 38, 30)` · **W6/W7** klik sungguhan
pada tombol 📋 PILIH & 🔍 Cari · **P17b** gudang menutup sendiri · **Z4/Z4b** toolbar
baca 1 baris & tidak melebihi layar · **Z8** submenu panjang bisa digulir.

### D.13b ⚠️ Muat data OTOMATIS + tombol tidak boleh diam (perbaikan 13 Sep 2026)

> Bug yang pernah terjadi: user menekan 📋 PILIH / 🔍 Cari → **tidak ada reaksi**
> (“belum berfungsi”).
> **Sebab:** data Alkitab hanya dimuat saat tombol “Pasang” ditekan; setelah **F5**
> `data` kosong walau plugin tetap tercatat terpasang, lalu
> `if (!m || !m.siap()) return;` membuat tombol **diam tanpa pesan**.

**Tiga hal yang WAJIB ada (jangan dihapus):**

| # | Nama | Tempat | Guna |
|---|------|--------|------|
| 1 | `ANodesAlkitab.siapkanOtomatis()` | `plugin/alkitab/alkitab.js`, dipanggil lewat `DOMContentLoaded` | memuat data sendiri tiap halaman dibuka + lapisan “📖 Menyiapkan plugin Alkitab…” |
| 2 | `tampilan.js → saatSiap(fn)` | semua tombol yang butuh data (`bukaPilih`, `bukaKetik`, `bukaHalaman`) | belum siap → toast “⏳ Menyiapkan data Alkitab…”, lalu aksi dijalankan setelah siap. Belum dipasang → “💡 Pasang plugin 📖 Alkitab dahulu” |
| 3 | `ANodesAlkitab.ketikaSiap(fn)` + `kabariSiap()` | dipakai `js/editor.js → tandaAyatSekarang()` | tautan ayat tetap diwarnai kalau catatan dibuka sebelum data siap |

❌ **Aturan penting:** fungsi plugin yang butuh data **JANGAN** `return` diam-diam —
selalu pakai `saatSiap()` atau beri pesan toast.

⚠️ Uji harus **mengklik tombolnya sungguhan** (`dispatchEvent`), bukan memanggil
fungsi langsung — uji lama memanggil fungsi langsung sehingga bug ini lolos.

### D.14 — Undo/Redo + versi satu berkas (13 Sep 2026)
**Undo/redo:**
- Tombol `[data-aksi="undo"]` (**↶**) & `[data-aksi="redo"]` (**↷**) paling kiri `#toolbar`.
- Pintasan di `js/editor.js` (handler `document` keydown, **sebelum** cek pintasan kustom):
  `Ctrl+Z` = batal · `Ctrl+Y` atau `Ctrl+Shift+Z` = ulangi.
- Dua cara: (1) `document.execCommand('undo'/'redo')`; (2) cadangan **riwayat sendiri**
  (`catatRiwayat()` → array `riwayat`, batas 80, tertunda 450 ms via `timerRiwayat`).
- `tampilkan(c)` **mereset riwayat** untuk catatan itu: `riwayat = [editor.innerHTML]; riwayatIdx = 0;`

**Versi satu berkas:**
- ❌ **JANGAN kirim `index.html` ke HP** (css/js/plugin tidak ikut → tampilan polos).
- ✅ `node tools/buat-1-berkas.js` → **`ANodes-1berkas.html`** (semua menyatu,
  **termasuk data Alkitab** → ±5,4 MB). `start.bat` menjalankannya otomatis.
- ⚠️ **Jebakan wajib diingat:** di dalam blok `<script>`, teks penutup script
  **mengakhiri blok walaupun ada di dalam komentar**. Penggabung wajib meng-escape
  (`amanScript()` di `tools/buat-1-berkas.js`), dan komentar di berkas JS
  **jangan** menuliskan teks penutup itu mentah.

---

### D.15 🗂️ Halaman BERKAS TERSIMPAN (K28h — 3 Nov 2026) + kepala 1 BARIS

> ⚠️ **Menu `[Doc]` SUDAH DIHAPUS 3 Nov 2026 (K28h).** Pemilik proyek:
> *“[doc] sudah tidak perlu.. karena sistem sudah hampir selesai”*.
> Yang **dipindah**, bukan dihapus: **daftar rantai tersimpan** dan **pengolah markdown**.

**Tombol `#btn-berkas` (“🗂️ Berkas”)** = **paling kanan** bar kepala (setelah menu Cari).
Klik → halaman **`#berkas-halaman`** (anak `body`, sejajar `#app-utama`;
keduanya `.app` = **selebar catatan**).

**Isi halaman:** daftar **rantai 🌿 Ayat Terkait** yang tersimpan
(`localStorage` **`anodes-rantai-v1`**) — tiap baris: nama · jumlah ayat · waktu diubah ·
tombol **🌿 Buka** · **+ Ayat** (kirim ke catatan, jalur K40) · **🗑**.
Navbar: `[🏠] 🗂️ Berkas Tersimpan [🌿 Kerja] [🗑 Bersihkan]` · `Esc` = tutup.

| Elemen | Guna |
|--------|------|
| `#bk-isi` | wadah daftar rantai |
| `#bk-kembali` | balik ke catatan (`Esc` / `Ctrl+B`) |
| `#bk-kerja` | buka halaman kerja 🌿 (rantai terakhir) |
| `#bk-bersih` | **🗑 Bersihkan semua** — buang seluruh berkas tersimpan (dengan konfirmasi) |

**Berkas:** `js/berkas.js` (`window.ANodesBerkas` — `buka` · `tutup` · `gambar` ·
`siapkanOtomatis` · `_terbuka`) · `css/app.css` (`.halaman-berkas` · `.bk-nav` · `.bk-isi`) ·
`index.html` (`#berkas-halaman`) · uji **K28h** (`tools/uji-blok/K28h.js` · 42 uji).

⚠️ **YANG DIHAPUS (jangan dicari lagi):** `js/dokumen.js` · `js/dokumen-data.js` ·
`tools/siapkan-dokumen.js` · halaman `#doc-alkitab` · tombol `#btn-doc` ·
kunci `anodes-dokumen-v1` · langkah `siapkan-dokumen.js` di `start.bat`.
⇒ **Berkas HP −2,29 MB** (isi 5 berkas `.md` ±1,1 MB tidak lagi ditanam).

⚠️ **YANG TETAP ADA (jangan dihapus):** **`js/markdown.js`** (`window.ANodesMarkdown` —
`keHtml` · `bisaMarkdown` · `benahiMarkdown` · `sudahHtml` · `aman`). Dipakai **3 fitur**:
**Impor `.md`/`.txt`** · tombol **“📖 Rapi”** · **rapikan naskah tempelan (K44)**.
🔴 **Pelajaran K28h:** sebelum menghapus sebuah halaman, **ukur dulu apa saja yang menumpang
di dalamnya** — `[Doc]` tampak “hanya penampil dokumen”, ternyata memuat **3 hal sekaligus**.

**Kepala WAJIB 1 BARIS** (dulu terlipat 2 baris = 83px):

| Aturan | Pelaksanaan |
|--------|-------------|
| Kepala | `flex-wrap: nowrap`, padding `8/10`, gap `6` |
| Merek | `.merk { flex-shrink: 0 }` |
| ≤460px | `.tahap` disembunyikan |
| ≤400px | `.merk-teks` + `.panah` disembunyikan (logo “A” tetap) |
| Tombol | `flex-shrink: 0`, `white-space: nowrap` |

⚠️ Tombol **jangan** diperkecil/dihapus; uji mengukur **hanya unsur `height > 0`**
(unsur `display:none` dari media query tingginya 0 → uji gagal palsu).
Jadi: **1 baris 45px** di 320/360/412/480px.

**Uji:** **Y1–Y16** di `tools/uji-toolbar.js` (total **403 uji, 0 gagal**).

---

### D.15b 📥 IMPOR `.md` → TAMPIL MUDAH DIBACA + TOMBOL “📖 RAPI” (K36 — 16 Sep 2026)

> Bapak: *“di ANodes -> File -> impor -> rencanakerja.md tapi dibuat dalam tampil
> rencanakerja.md mengikuti layar supaya tampil mudah dibaca”*

**Masalahnya:** pengolah impor lama (`keHtmlImpor`) hanya kenal **judul · daftar ·
paragraf** → **tabel** dan **kutipan** ikut jadi paragraf raksasa (berantakan).
Terukur: `rencanakerja.md` → **1.222 paragraf · 0 tabel · 0 kutipan**.

**Perbaikan (3 bagian):**

| # | Bagian | Pelaksanaan |
|---|--------|-------------|
| 1 | **Pengolah impor** | `keHtmlImpor()` menyerahkan ke **pengolah markdown** (`ANodesMarkdown.benahiMarkdown` → `keHtml`) kalau berkasnya berbentuk dokumen. Hasil: **54 tabel · 73 kutipan · 28 blok kode · 61 judul** dikenali |
| 2 | **Tombol “📖 Rapi”** | di **bar info** catatan (`#info-rapi`) — muncul **hanya** kalau isi catatan masih markdown mentah. Ditekan → **mode baca**: isi dirapikan, **tidak bisa diketik** (`contenteditable=false`), tombol berubah jadi **“✏️ Tulis”** |
| 3 | **Catatan lama** | `htmlKeMarkdown()` mengubah HTML catatan kembali ke teks markdown → catatan lama pun bisa ditampilkan rapi |

⚠️ **Isi mentah TIDAK pernah tertimpa:** saat mode baca, `simpan()` & `autoSimpan()`
**berhenti** (isinya hasil olahan). Keluar mode baca → isi mentah kembali **persis** (uji **Y23e**).

⚠️ **Jebakan yang ketemu (jangan diulang):**
- **`pre` (blok kode) melebar 852px** di layar 186px → **seluruh halaman bisa digeser
  mendatar**. Perbaikan: `#editor.mode-baca pre, table { max-width: 100%; overflow-x: auto }`.
- **`bisaMarkdown()` sempat menolak dokumen proyek** karena isinya memuat **contoh HTML**
  (`<p>`, `<script>`). Perbaikan: `sudahHtml()` hanya menolak kalau tag ada **di awal baris**,
  dan tanda markdown yang jelas (``` / tabel / kutipan / ≥3 judul) **diperiksa lebih dulu**.
- **Aturan judul jangan terlalu longgar** — `judul >= 2` membuat catatan biasa pun dianggap
  dokumen (tombol Rapi muncul di mana-mana). Sekarang **`judul >= 3`**.

**Berkas:** `js/markdown.js` (`bisaMarkdown` · `benahiMarkdown` · `sudahHtml` ·
`window.ANodesMarkdown`) · `js/editor.js` (`keHtmlImpor` · `htmlKeMarkdown` ·
`terapkanRapi` · `segarkanTombolRapi`) · `index.html` (`#info-rapi`) · `css/app.css`
(`#editor.mode-baca*` · `button.info-rapi`) · `tools/uji-toolbar.js` (uji **Y21–Y23e**).

**Uji:** **Y21–Y23e (10 uji baru)** → **403 uji, 0 gagal** di kedua versi berkas.

---

## D-7v4. 🖊 K47 / K47b — PLUGIN **PEMBACA PENGUAT (MANDIRI)** — 19 Sep 2026

> Bapak: *“sebelum lanjut yesaya.. tolong buat plugin sementara.. ingin liat isi..
> tapi plugin **bukan konek ke catatan**.. ini **mandiri**.. buka liat baca seperti alkitab”*

**Halaman ke-5** `#penguat-halaman` — anak `body`, seukuran catatan (`.app`), **MENIMPA catatan**.
❌ **TIDAK menyentuh** catatan/editor (dibuktikan uji **K47-23/24/25/31**).

| Berkas | Isi |
|---|---|
| `tools/siapkan-data-penguat.js` | gabung `bible/data/komentar/<bookId>.json` → `plugin/penguat/data/penguat.js` |
| `plugin/penguat/penguat.js` | MESIN (`window.ANodesPenguat` · IndexedDB kunci `penguat`) |
| `plugin/penguat/tampilan.js` | TAMPILAN (`window.ANodesPenguatTampilan`) |
| `plugin/penguat/plugin.js` | KETERANGAN (gudang 🧩) |

**API mesin:** `muat` · `siap` · `meta` · `daftarKitab` · `daftarPasal(no)` · `komentar(k,p,a)` ·
`komentarPasal(k,p)` · `jumlahAyat(no)` · `jumlahSemua()` · `kitabAda(no)` · `cari(kata,maks)` ·
`ketikaSiap` · `saatSiap` · `dipasang` · `saatDilepas` · `siapkanOtomatis`.

### ⚠️ CACAT yang pernah terjadi — SIMPANAN LAMA IndexedDB MENUTUPI DATA BARU (jangan diulang)

> Gejala: Yesaya sudah tuntas & alat lapor **5 kitab · 7.721 ayat**, TETAPI halaman penguat masih **4 kitab**.

**Sebab:** `penguat.js → muat()` membaca **IndexedDB lebih dulu**; simpanan lama dianggap sah.
⇒ `siapkan-data-penguat.js` **saja TIDAK CUKUP** kalau simpanan lama masih ada.

**Perbaikan terpasang:** alat menulis **`meta.sidik`** = `jumlahKitab-jumlahAyat-isi per kitab`
(contoh sekarang: `9-12646-1:1533,2:1213,4:1288,19:2461,23:1292,24:1364,26:1273,40:1071,42:1151`),
dan `muat()` **membaca BERKAS DATA lebih dulu**; simpanan IndexedDB dipakai **hanya kalau sidik SAMA**,
sidik beda → **ditimpa**. ⇒ cukup `node tools/siapkan-data-penguat.js` + `node tools/buat-1-berkas.js`.

### 🔍 K47b — HALAMAN DIPERJELAS: PASAL vs AYAT (19 Sep 2026)

> Bapak: *“baru sampai 25, seharusnya 28 pasal”* — dikira **Matius baru punya 25 pasal**.

⚠️ **Datanya SUDAH LENGKAP** (`40.json` **1.071 ayat** · p26=75 · p27=66 · p28=20 · **kini 66 kitab 31.102 ayat**).
**Sebab kebingungan:** judul **“Matius 1”** + deret angka **1–25** — angka itu **NOMOR AYAT**
(Matius 1 memang 25 ayat), **bukan** jumlah pasal.

| Yang diperjelas | Sesudah |
|---|---|
| Baris bawah judul | **“Pasal 1 dari 28 pasal — ganti pasal lewat daftar ▾ di bar atas”** (`.pg-posisi`) |
| Deret angka | label **“Ayat — klik untuk menuju penguatnya:”** (`.pg-lbl-ayat`) |
| Dropdown pasal | `title` → “Pilih pasal — Matius punya 28 pasal” |

⚠️ **PELAJARAN PENTING:** kalau Bapak bilang *“pasal X–Y kurang”*, **PERIKSA DULU apakah itu
kebingungan nomor PASAL vs nomor AYAT** — jangan langsung menambah data.
Cara membuktikan (bukan menebak): buka halaman penguat → pilih **Matius** → dropdown pasal →
terakhir tertulis **`28 (20)`** · buka pasal 26 → **75 ayat berkomentar dari 75 ayat**.

**Uji:** blok **K47: 0 gagal** (`tools/uji-cepat.js`) — uji blok **K47** sudah diperbarui
untuk **66 kitab · 31.102 ayat** (K47-08/09/10/11/18) + 7 uji baru **K47-36…K47-42**.

---

## D-7v5. ✅ K45 — PENGUAT KITAB (isi) — **SELESAI TOTAL 21 Sep 2026**

**”ISI dulu, SISTEM menyusul”** (keputusan Bapak 18 Sep 2026). Yang dikerjakan di `C:\data\bible`.

🎉 **66 KITAB · 31.102 AYAT = 100 % ALKITAB.**
❌ **Tidak ada kitab kosong lagi** — 66 berkas `data/komentar/NN.json` lengkap semua.

| Bagian | Jumlah | Keterangan |
|---|---|---|
| **10 kitab tafsir ulang** | **13.604 ayat** | Lukas · Ayub · Keluaran · Ulangan · Yesaya · Yehezkiel · Bilangan · Kejadian · Yeremia · Mazmur (selesai 19–20 Sep) |
| **Kitab BARU PL** | **—** | 1 Raja-raja s/d Maleakhi (selesai 20 Sep · 3 langkah setup) |
| **Kitab BARU PB** | **—** | Matius s/d Wahyu (selesai 21 Sep · 3 langkah setup) |

**Kitab-kitab terakhir (21 Sep 2026):** Titus 46 · Filemon 25 · Ibrani 303 · Yakobus 108 ·
1 Petrus 105 · 2 Petrus 61 · 1 Yohanes 105 · 2 Yohanes 13 · 3 Yohanes 14 · Yudas 25 · **Wahyu 404**.

| Data | Angka |
|---|---|
| Berkas data | `plugin/penguat/data/penguat.js` **12.691,7 KB** |
| Sidik | **`66-31102-1:1533,…,66:404-11c3e3e5`** (`dibangun 2026-09-21`) |
| HP `ANodes-1berkas.html` | **24,44 MB** · penguat **`v21Sep-b`** · kamus **`v21Sep-a`** |

⇒ ⏭️ **SISA = K45 i** (SISTEM plugin penguat **yang menempel di catatan**) — papan **B urut 1**.
❌ **Bukan** halaman mandiri **K47** yang sudah ada.

**Urutan langkah (jangan dibalik):**
```
0. SETUP kitab BARU: kerangka data/komentar/<bookId>.json + DATA_FILES build-lab3.js + muatData di lab3.html
1. node tools/lihat-pasal.js <bookId> <pasal>
2. tulis data/komentar/_batch-<bookId>-<pasal>.json   ← {bookId:5, ayat:{"5.1.1":"…"}}
3. node tools/bersih-dan-dan.js <batch>           ← pembersih `dan dan`, WAJIB
4. node tools/cek-hitung-hal.js <batch>           ← pemeriksa hitungan “N hal”, WAJIB
5. node tools/tambah-komentar.js <batch>          ← cadangan + gabung + urut + periksa kunci kembar
6. node tools/build-lab3.js
7. node tools/cek-penguat.js <bookId>             ← buktikan kunci masuk ke build
8. node tools/cek-gaya-penguat.js                 ← buktikan gaya TAFSIR (pola “N hal” TURUN)
```
**Sesudah kitab TUNTAS → urutan penutup:** `siapkan-data-penguat.js` + `buat-1-berkas.js` (SEKALI) +
naikkan penanda versi `plugin/penguat/tampilan.js` (**`v19Sep-r`**) + perbarui uji K47 + arsipkan batch + perbarui dokumen.

⚠️ **Kitab BARU = 3 langkah setup lebih dulu:** (1) kerangka `data/komentar/<bookId>.json` ·
(2) daftar di `DATA_FILES` `tools/build-lab3.js` · (3) `muatData('komentar-<bookId>')` + gabung
`komentarData` di `lab3.html` (~baris 3235). Sudah dikerjakan untuk **5 (Ulangan)**.

⚠️ **`tools/bersih-dan-dan.js` WAJIB ada:** templat kalimat sering berakhir `, dan` lalu
ditambah `dan X.` → `dan dan X`. Alat `tambah-komentar.js` **tidak** memeriksa itu.
⚠️ Pembersih **harus bekerja pada NILAI JSON** (bukan seluruh isi berkas) — kalau tidak,
indenasi 2 spasi ikut dirapatkan dan berkas menjadi berantakan.

⚠️ **`tools/cek-hitung-hal.js`** memeriksa hitungan **“dinyatakan dengan N hal”** — gaya tulisan
penguat selalu berpola itu, dan salah hitung paling sering pada ayat panjang.
⚠️ Kata **“serta”** JANGAN dihitung sebagai pemisah rincian (sering ada DI DALAM rincian,
mis. “tembok tinggi-tinggi **serta** pintu-pintu gerbang”) — pemisah sah hanya **“, dan ”** dan **“; ”**.
⚠️ **12 salah hitung nyata tertangkap di Ulangan 29–34** (4 + 6 + 2) — semuanya diperbaiki
**sebelum** digabung. **Selalu jalankan alat ini tiap batch.**

---

## D-7r. 📤 K20 — Kirim paket ayat dari Alkitab ke catatan (14 Sep 2026)

**Aturan bentuk (WAJIB sama kalau dibangun ulang):**

```
BARIS 1 (bar utama, TIDAK pernah diganti/ditutup):
  [🏠][Kitab ▾][Pasal ▾][◀][▶][↩][📋 PILIH][🔍 Cari][📤]
BARIS 2 (muncul hanya saat angka ayat diklik):
  [Yoh 4:7-11] [💬 Kalimat] [📖 Yohanes 4:7-11] [📋 Simpan] [✕]
BARIS 2 di halaman CATATAN (kalau ada paket):
  siap:      [📋 Yohanes 4:7-11] [Tempel ⇩] [❌ Buang]
  tertempel: [📋 Ditempel ✓] [↶ Batalkan] [❌ Selesai]
```

⚠️ **KESALAHAN — KODE DI ATAS = BENTUK LAMA ❌** (sejak **K63 · 23 Sep 2026**).
Bentuk yang **sekarang** dipakai:

```
BARIS 1 : [🏠] [ 1 Samuel ▾ ] [📋 PILIH] [🔍 Cari] [📤] [🖊]   ← + kotak pilih kitab
BARIS 2 : 1 Samuel  [ 7 ▾ ]  [◀] [▶] [↩]          17 ayat      ← SEKALIGUS JUDUL
```

Wadahnya `.alkitab-nav` > **`.ay-nav-b1`** (flex-wrap: wrap) + **`.ay-nav-b2`** ·
seluruh navbar `flex-shrink: 0` (**di-freeze**, di luar `#baca-isi` yang menggulir) ·
“n ayat” di **ujung baris 2** (`#ay-nav-jml`) · `.ay-judul` & `.ay-meta` di dalam bacaan
**disembunyikan** (`.ay-judul-samar` / `.ay-meta-samar`) — ⚠️ **elemennya tetap ada**
(jangkar plugin 📖 Sejarah & 🌿 Ayat Terkait).
🔴 **WAJIB:** kotak `select#baca-kitab` memakai **`min-width: 0`** + lebar tetap (`width`) —
kalau hanya `flex: 1 1 …`, ia **mendorong** 🔍 Cari/📤/🖊 ke baris berikutnya ⇒ navbar jadi **3 baris**.
Di layar ≤390px, teks tombol 📋 PILIH & 🔍 Cari disembunyikan (`.ay-lbl`) ⇒ **ikon saja** (pola I-15).
❌ **JANGAN** `overflow-x: auto` di navbar (pelajaran K18).
📌 **Pilihan cara buka di ⚙ Pengaturan SUDAH DIHAPUS** (arahan Bapak 23 Sep 2026) — bentuknya
cukup rapi selalu. **Ganti kitab tetap bisa dari 2 pintu:** kotak ▾ **atau** 📋 PILIH.

| Hal | Ketentuan |
|-----|-----------|
| Pilih ayat | klik `span.no` (angka di kiri ayat); klik angka sama = lepas; beberapa angka → ditulis `7-11` / `7, 9` |
| Tombol `💬 Kalimat` | hidup = kalimat tiap ayat ikut (**didahului nomor ayatnya**, mis. `3 Kasih karunia …`); mati = hanya nama ayat |
| Tombol `📖 …` | menunjukkan bentuk yang akan dikirim; klik = tukar panjang ⇄ singkat (`Yohanes 4:7` ⇄ `Yoh 4:7`). Kalimat **selalu penuh** |
| `📋 Simpan` | paket dipegang (clipboard), bar kirim TUTUP, pindah ke catatan, baris ke-2 → bar paket |
| `Tempel ⇩` | paket masuk di **bawah baris tempat kursor** (atau menggantikan baris kosong); tanpa kursor → paling bawah; disorot kuning ±4 detik |
| `↶ Batalkan` | paket diangkat lagi supaya bisa dicari tempat lain |
| `❌ Selesai` / `❌ Buang` | bar paket TUTUP, toolbar tulis kembali seperti semula |
| Jumlah paket | **satu** (paket baru menimpa yang lama); **tidak disimpan** ke localStorage |
| Baris ke-2 bergantian | ada paket → **klik ▦ = bar paket ⇄ toolbar tulis** (`bar.paket` + `bar.paketTampil` di `js/plugin.js`; `toolbar.hidden = bar.paketTampil`). Bar paket hanya hilang kalau **[❌ Selesai]/[❌ Buang]** |
| Panjang/singkat | **WAJIB benar-benar dipakai**: `susunPaket()` memakai `labelPilihan(opsiPaket.panjang)` — ❌ bukan `labelPilihan(true)` |
| Nomor ayat | kalimat didahului nomor (`a.no + ' ' + teks`) — ❌ **JANGAN pakai `[3]`**, kurung siku + angka bisa dibaca pengenal ayat → tautan palsu |
| Tempat kembali | `ingatPosisi()` menyimpan `{id catatan, offset huruf, gulir}`; `pulihPosisi()` memulihkannya saat 🏠; tanpa kenangan → kursor ke paling bawah |
| Bersih saat lepas plugin | `ANodesAlkitab.saatDilepas()` → `ANodesEditor.paketBuang()` (bar paket tutup) |

**Berkas:** `index.html` (`#bar-kirim` di dalam `#baca-alkitab`, `#toolbar-paket` sebelum `#toolbar`) ·
`css/app.css` (`.bar-kirim`, `.bar-paket`, `.no.pilih`, `.ikut-pilih`, `#editor .paket-ayat`) ·
`plugin/alkitab/tampilan.js` · `plugin/alkitab/plugin.js` (kontrak **`tombol[]`**) ·
`plugin/alkitab/alkitab.js` · `js/plugin.js` (`ANodesPlugin.paket()`) · `js/editor.js` (`window.ANodesEditor`).

**🐞 Jebakan (jangan diulang):**
- ❌ `execCommand('insertHTML')` **selalu memecah pembungkus** → paket disisipkan **lewat DOM**
  (`<div class="paket-ayat" data-paket="1">` berisi `<p>`, ditambahkan **sesudah** penempelan).
- ⚠️ Tempelan DOM **tidak** masuk tumpukan undo bawaan → `↶/↷` memakai **riwayat sendiri**
  untuk langkah paket (`langkahPaket()`); `syncBarPaket()` membaca keadaan dari isi catatan.
- ⚠️ Pengait klik angka dipasang di **`#baca-isi`**, bukan `#editor`.
- Bar kirim di layar sempit: chip pilihan **bentuk singkat**; **kata pada tombol disembunyikan
  ≤380px** (ikon tetap, arti lewat `title`) → 5 tombol tetap 1 baris di 230–349px.
- `#toolbar-paket[hidden]` & `.bar-kirim[hidden]` wajib `display:none !important`.

**Uji:** **AB0–AB19** (20 uji) → **244 uji, 0 gagal**; uji lama **T16** & **Z3** ikut diperbarui.

---

## D-7s. 🔍 K21 — Pencarian Alkitab disempurnakan (14 Sep 2026)

**Di halaman hasil pencarian:**

```
Hasil: "tebus"                          ← judul (+ " — Perjanjian Lama/Baru" kalau disaring)
83 ayat di 21 kitab — klik nama ayat …
[ tebus                  ] [🔍 Cari]   ← cari lagi (Enter juga jalan)
[📚 Semua] [PL] [PB]                    ← saringan wilayah (aktif = biru)
📖 Keluaran — 8 ayat
Kel 13:13 … kau▮tebus▮lah …              ← kata dicari tebal + latar kuning
```

| Hal | Ketentuan |
|-----|-----------|
| Nama tombol | kepala **`Cari catatan ▼`** (berkas) · halaman Alkitab **`🔍 Cari`**, lapisan berjudul **“🔍 Cari ayat”** |
| Kata tebal | bentuk ≥**4 huruf** saja (`kas` dari `kasih` jangan menebalkan sebagian) |
| Cari lagi | `mulaiCari()` dari kotak di halaman hasil — **tidak** kembali ke halaman baca |
| PL / PB | `KITAB_PB_MULAI = 40` (kitab 40–66 = PB) · tombol `.ay-wilayah-btn` |
| Tombol wilayah | **tanpa ikon** — teksnya tepat `Semua` / `PL` / `PB` (K22 c) |
| Form cari ganda | `bukaKetik()` → kalau `.ay-cari-input` ada & ada pencarian berjalan → `fokusKotakCari()` (JANGAN buka form) — K22 b |
| **Cari = 1 langkah** | `bukaKetik()` → `bukaHalamanCari()` (❌ **JANGAN** buat popup lagi). `gambarHasilCari()` boleh **kata kosong** → jadi halaman awal cari. Nama ayat → tombol `📖 Buka …` di `#ay-cari-saran` — K23 |
| Ingat bacaan | `anodes-alkitab-bacaan` `{kitab,pasal,ayat}` ditulis tiap `gambarPasal()`; dibaca di `bukaHalamanSekarang()` (K22 a) |
| Kata dasar | `kandidatKata()` + `kembalikanSengau()` + `bentukCari()` |

**⚠️ Pencocokan kata dasar — jangan disederhanakan:**
- ❌ **Jangan** rantai berurutan (akhiran lalu awalan): `penebusan` → `ebus` (salah).
- ✅ Kumpulkan **SEMUA kemungkinan kata dasar**, termasuk mengembalikan huruf sengau
  (`penebus`→`nebus`→**`tebus`**; `menyuci`→`suci`). Ayat cocok kalau **salah satu** bentuk ditemukan.
- Bentuk pertama (kata asli) SELALU diikutkan → `tebus` tetap ketemu `tebus`.
- Pencocokan tetap **“termuat”** — belum pakai daftar sinonim (keputusan user).

**Uji:** **AC1–AC7b** (16 uji) → **264 uji, 0 gagal** di kedua versi berkas.

---

## D-7v. 🔗 K25/K31/K33/K34/K80 — Plugin **Ayat Terkait** (logika LAB 2 · **HALAMAN KERJA** · **bersihkan & buang** · **rentang ayat** · **tombol `[Full]`**) — 15–16 Sep 2026 · 30 Okt 2026

> ✅ **DIPERBARUI 30 Okt 2026 (K80) — TOMBOL `[Full]` DI KEPALA PRATINJAU.**
> Bapak: *“Bil 6:24-26  ✓ pilih  Full  ✕ · tombol full ini untuk lompat ke alkitab ke bilangan 6
> bisa baca keseluruhan · tapi posisikan pada ayat 24-26 di buat stabilo sistem blinking beberapa
> detik supaya user tau posisi ayat · dan klik home kembali pada bacaan sebelumnya”*
>
> ```
> ┌──────────────────────────────────────────────┐
> │ Bil 6:24-26    ✓ pilih    Full    ✕          │  ← [Full] BARU
> ├──────────────────────────────────────────────┤
> │ 24 TUHAN memberkati engkau …                 │
> └──────────────────────────────────────────────┘
>         │ tekan [Full]
>         ▼
> HALAMAN BACA — Bilangan 6 (27 ayat, bisa dibaca semua)
>  24-26 DISOROT + BERKEDIP 5 detik ⇒ lalu sorot TETAP
>         │ tekan 🏠
>         ▼
>  kembali ke 2 Petrus 1 (bacaan sebelumnya) · 🏠 lagi ⇒ catatan
> ```
>
> | Bagian | Pelaksanaan |
> |--------|-------------|
> | API baru | `ANodesAlkitabTampilan.bukaRentang(ref)` · `adaAsalBacaan()` · `kembaliKeAsalBacaan()` · `segarkanTombolKembali()` |
> | `gambarPasal()` | argumen ke-5 **`sorotRentang`** = `{awal, akhir}` ⇒ baris diberi kelas `.target-rentang` |
> | Kedip | `mulaiKedipRentang()` — `.target-rentang-kedip` (`@keyframes ay-kedip-rentang` **0,5 s × 10 = 5 dtk**) ⇒ lalu `.target-rentang-tetap` |
> | 🏠 prioritas | kamus (K43b) → halaman asal (K56) → **bacaan asal (K80)** → catatan |
> | Penjaga | `pertahankanAsalBacaan` — perpindahan **BIASA** membuang `asalBacaan` |
> | Tombol | `.at-full` di `plugin/ayat-terkait/tampilan.js` → `bukaFull(d)` → `bukaRentang()` |
> | “kurangi gerak” | `prefers-reduced-motion` ⇒ **tanpa kedip**, langsung sorot tetap |
> | Uji | **29 uji K80 · 0 gagal** (6× PC + 3× HP) |
>
> 🐞 **CACAT NYATA yang diperbaiki (jangan diulang):**
> 1. **Pendaftaran penghias bergantung pada “data siap”** ⇒ halaman baca bisa tampil **tanpa
>    tombol kaitan** (flaky 4 dari 5 kali). Sekarang `daftarkanPenghias()` dipanggil **saat modul
>    dimuat**; `hias()` sendiri yang menjaga kalau data belum siap.
> 2. **`kabariPendengar()` urutannya terbalik** — `pendengar` (padaSiap) **wajib dulu**, baru
>    `tungguSiap` (ketikaSiap).
> 3. **Penyaring `__BLOK` letaknya di tengah** ⇒ blok baru **tidak pernah dilaporkan**
>    (“K80: 0 uji”). Sekarang di **akhir**.
> 4. **Uji mengukur warna saat animasi berjalan** ⇒ `getComputedStyle` = warna di tengah keyframe
>    ⇒ gagal palsu. Lepas kelas animasi dulu.

> ✅ **DIPERBARUI 16 Sep 2026 (K34) — AYAT TERKAIT UNTUK SATU RENTANG AYAT.**
> Bapak: *“roma 8:6-10 tampilkan semua 6,7,8,9,10 **tanpa ayat terkait di bawah ayat** ..
> **di bawah ayat 10 baru tampilkan `[6][7][8][9][10]`** .. user pilih 7 .. baru tampilkan
> ayat terkaitnya.”*
>
> ```
> Roma 8:  6 · 7 · 8 · 9 · 10        ← ayat rentang TANPA tombol “ayat terkait” sendiri
>          [6] [7] [8] [9] [10]      ← SATU baris pemilih, hanya di bawah ayat terakhir
>            │ klik 7
>            ▼
>          ┌───────────────────────────┐
>          │ Ayat terkait Roma 8:7 (25) │ ← kolom kaitan AYAT ITU SAJA (logika lab2)
>          └───────────────────────────┘
> ```
>
> | Bagian | Pelaksanaan |
> |--------|-------------|
> | Rentang dari mana | **tautan berentang di catatan** (`Roma 8:6-10`) → `bukaAyatDariLink()` menyimpan `rentangBuka` → diteruskan lewat `jalankanPenghias({…, rentang})` |
> | Ayat dalam rentang | **TIDAK** dipasangi tombol `ayat terkait (n)` |
> | Baris pemilih | `barisPemilihRentang()` → `.at-rentang` di bawah **ayat terakhir**; nomor aktif **biru** (`.at-rentang-aktif`) |
> | Klik nomor | kolom kaitan **ayat itu saja** (Roma 8:7 = 25 chip · Roma 8:6 = 16 chip) |
> | `✓ pilih` | akar halaman kerja = **ayat yang dipilih** (`kotak._akarRef`) |
> | Ayat di luar rentang | tetap normal (punya tombol sendiri) |
> | Lepas plugin | baris pemilih ikut dibuang (uji **RK21c**) |
>
> **Ukuran (dari `silang.js`):** 8:6 = 16 · 8:7 = **25** · 8:8 = 15 · 8:9 = **29** ·
> 8:10 = **29** · digabung semua = **114**. ⇒ per ayat maks ±29 chip = ringan
> (batas gambar 60); menggabung jadi 114 juga bisa tapi **asal-usul kaitan hilang**.
> **Berkas:** `plugin/alkitab/tampilan.js` (`rentangBuka` + `get rentang`) ·
> `plugin/ayat-terkait/tampilan.js` (`barisPemilihRentang` + `hias()` melewati ayat rentang) ·
> `css/app.css` (`.at-rentang*`) · uji **RK18–RK21c**.
> ❌ Mesin `terkait.js` · data `silang.js` · `ambilAyatBanyak()` **tidak diubah**.
>
> ✅ **DIPERBARUI 16 Sep 2026 (K33 tuntas):** uji **RK14–RK17** akhirnya dijalankan →
> **403 uji, 0 gagal**. 🐞 **Bug nyata ketemu:** `js/dokumen.js → gambarRantai()` memakai
> `daftar` **sebelum** dideklarasikan → halaman **[Doc] → 🌿 Ayat Terkait tampil KOSONG**
> + uji RK12 menggantung. Perbaikan: `const k` & `const daftar` **dipindah ke atas**.
> ⚠️ **Pelajaran:** uji menggantung → **periksa Console** dulu, jangan menyalahkan tab.
>
> ⚠️ **DIPERBARUI 15 Sep 2026 (K33) — KODE SELESAI, UJI OTOMATIS BESOK.**
> Bapak: *“saya perlu del **[x] riwayat jalur** .. belum mau di simpan masih test ..
> berkas test masih gantung”*. Yang ditambahkan:
>
> | Tombol | Letak | Guna |
> |---|---|---|
> | **[✕]** | kepala panel 🕒 Riwayat Jalur | **bersihkan riwayat** — ⚠️ ❌ **TIDAK** menghapus ayat/blok/simpanan (riwayat = catatan jalan) |
> | **[🗑 Buang]** | kepala halaman kerja (ganti 🆕) | meja kerja kosong **+ hapus dari daftar simpanan** · tanya **inline** (❌ bukan popup) |
> | **[🗑 Bersihkan semua]** | menu **[Doc] → 🌿 Ayat Terkait** | buang **semua** berkas tes sekaligus |
>
> `kerja.js`: `buang()` · `buangSekarang()` · `kumpulkanJalur()` · `pohonUntukSimpan()`
> (penanda `_rb`) · `batalkanSimpan()`.
> ⚠️ **Dua jebakan yang sudah dijaga:** (1) **`batalkanSimpan()` WAJIB** sebelum membuang —
> kalau tidak, timer simpan tertunda (900 ms) **menghidupkan lagi** rantai yang baru dihapus;
> (2) **Riwayat ≠ data** — membersihkan riwayat tidak menyentuh blok/ayat (dipakai penanda
> `_rb` supaya tetap kosong setelah dibuka ulang).
> ⏳ **Uji RK14–RK17** — ✅ **SUDAH dijalankan 16 Sep 2026** (lihat catatan K33 tuntas di atas):
> **403 uji, 0 gagal**. 🐞 Bug nyata yang ketemu: `js/dokumen.js → gambarRantai()` memakai
> `daftar` **sebelum** dideklarasikan → halaman **[Doc] → 🌿 Ayat Terkait tampil KOSONG**.
>
> ✅ **DIPERBARUI 15 Sep 2026 (K31):** ada **HALAMAN KE-3** — **HALAMAN KERJA AYAT TERKAIT**.
> Tekan `✓ pilih` **PINDAH ke sana** (❌ bukan ke catatan). Isinya **hanya rantai**:
> akar = ayat tempat mulai (`2 Korintus 1:2`) + blok hasil `✓ pilih` (`Roma 1:7`) → terus
> ditelusuri ayat demi ayat → **tersimpan sendiri dengan nama ayat utama**.
> Rantai = **bahan mentah**, dipanggil ke catatan baru di **K32**.
> 📌 Baca **`agents.md` bagian 0a0** (tiga halaman) dulu sebelum menyentuh berkas ini.
>
> ✅ **DIPERBARUI 15 Sep 2026 (K25 h–o):** butir **a–o SEMUA SELESAI**. Plugin sekarang
> memakai **LOGIKA LAB 2**: klik kaitan → **pratinjau** (1 slot, gantian) → **`✓ pilih`**
> = komit → **label jejak kumulatif** + blok bertumpuk di bawah → **1 jalur tercatat di
> 🕒 Riwayat Jalur** → **[✕] = hapus satu ayat + SELURUH cabangnya** (konfirmasi 2 langkah).
> Kaitan lanjutan **di dalam pratinjau** = **abu-abu & tidak bisa diklik**. Bawaan cara
> tampil tetap **`chip`** (tombol `ayat terkait (n)`, K25 l). Tampilan lab2 **tidak** disalin
> bulat-bulat — bentuk & letak tetap aturan ANodes.
> 📌 Baca **`agents.md` bagian 0a/0b** + **`catatan-konsep-lab2.md`** sebelum menyentuh
> `plugin/ayat-terkait/**`.
> Yang **tidak boleh dibongkar**: mesin `terkait.js` · data `silang.js` ·
> `ambilAyatBanyak()` · sambungan `tambahPenghias()/jalankanPenghias()` · pintu masuk 🧩.

**Berkas & kontrak:**

```
plugin/ayat-terkait/plugin.js        keterangan + pilihanTampil/caraTampil/pilihCara
plugin/ayat-terkait/terkait.js       MESIN  → window.ANodesAyatTerkait
tools/siapkan-data-silang.js         pembuat data (dari C:\data\bible\data\silang.json)
plugin/ayat-terkait/data/silang.js   DATA 5,21 MB → window.ANodesAyatTerkaitData
plugin/ayat-terkait/tampilan.js      TAMPILAN halaman BACA → window.ANodesAyatTerkaitTampilan
plugin/ayat-terkait/kerja.js   🆕    HALAMAN KERJA → window.ANodesAyatTerkaitKerja
```

**Data:** `refs["kitab.pasal.ayat"] = [kitab, pasal, ayatAwal, ayatAkhir, votes]` ·
29.363 ayat · **344.100 kaitan** · **nomor kitab 1–66 SAMA** dengan ANodes.
Simpanan cepat: IndexedDB `anodes-plugin-db` / toko `data` / kunci **`silang`**.

**Bentuk di halaman baca (WAJIB — logika lab2, bentuk ANodes):**

```
 1  Tentang kedatangan Tuhan kita …
    [ ayat terkait (10) ]              ← BAWAAN: cuma tombol (bawaan K25 l)
       │ ditekan
       ▼
    ┌──────────────────────────────────┐
    │ Ayat terkait (10)              ✕ │ ← judul + tutup
    │ [Kejadian 49:10] [Matius 24:31]  │ ← chip, URUT URUTAN KITAB
    └──────────────────────────────────┘
       │ klik chip = PRATINJAU (belum permanen, 1 slot gantian)
       ▼
    ┌──────────────────────────────────┐
    │ Kejadian 49:10      ✓ pilih    ✕ │
    │ 10 Tongkat kerajaan tidak akan…  │ ← teks ayat (rentang: semua ditampilkan)
    │ Bilangan 21:18  Bilangan 24:17 … │ ← kaitan lanjutan ABU-ABU & MATI
    └──────────────────────────────────┘
       │ `✓ pilih` = KOMIT
       ▼
    Kejadian 49:10, Matius 24:31      ← LABEL JEJAK (kumulatif, dipisah koma)
    kaitan lainnya (10)                ← buka lagi chip kalau mau ganti

    ┌──────────────────────────────────┐
    │ 📖 Kejadian 49:10     📍      ✕ │ ← BLOK PERMANEN (bertumpuk ke bawah)
    │ 10 Tongkat kerajaan tidak akan…  │
    │ [ayat terkait (47)]              │ ← bisa dirantai terus
    └──────────────────────────────────┘

    🕒 Riwayat Jalur                    ← tiap `✓ pilih` = 1 baris (cara A,
    1. Kejadian 49:10                     ❌ bukan panel samping)
```

| Hal | Ketentuan |
|-----|-----------|
| Letak | **di bawah ayatnya sendiri** (`.at-hias` di dalam `.ayat-baca`) — bukan panel terpisah |
| Urutan chip | **urut urutan kitab** (`sort` `[kitab,pasal,ayatawal]`) — ❌ bukan votes |
| Klik chip | = **PRATINJAU** (`_pratinjau` — 1 slot, gantian) — ❌ **bukan** langsung jadi blok |
| `✓ pilih` | = **KOMIT**: `_dipilih` bertambah · blok dibuat di `kotak.parentElement` · `catatJalur()` · `_rapat = true` |
| Anti-dobel | `blokMap` per pasal; sudah ada → **`.at-sorot`** (kuning 2,5 s) saja |
| Rentang | 1 Tes 4:14-17 → **keempat ayat** ikut ditampilkan |
| Batas | **60 kaitan** digambar serentak + tombol **“＋ n kaitan lagi”** |
| Cara tampil | **`chip` = BAWAAN** (tombol `ayat terkait (n)` — TERTUTUP sampai ditekan, K25 l) ⇄ `buka` (langsung terbuka) — `anodes-ayat-terkait-cara` |
| Ambil teks | **`ANodesAlkitab.ambilAyatBanyak(daftar)`** — satu panggilan untuk semua kaitan |
| Riwayat | `#at-riwayat` disisipkan **setelah `.ay-meta`** (❌ bukan `isi.firstChild`) |

**Sambungan Alkitab ⇄ plugin (cara resmi supaya plugin bisa dicabut):**
`plugin/alkitab/tampilan.js` → **`tambahPenghias(fn)`** + **`jalankanPenghias(ctx)`**.
Alkitab memberi tahu tiap selesai `gambarPasal()` dan saat `bukaHalamanSekarang()`
(kalau bacaan sudah tampil) dengan `ctx = {kitab, pasal, isi}`. Alkitab **tidak
pernah** memanggil plugin kaitan langsung → plugin boleh dicabut kapan saja.

**Pintu masuk:** kartu di gudang 🧩 (angka 29.363 & 344.100 · `▶ Buka di Alkitab` ·
`🗑 Lepas plugin`) + baris di submenu **[🧩 ▼]** toolbar tulis (otomatis).

⚠️ **JEBAKAN (jangan diulang):**
| Jebakan | Akibat | Perbaikan |
|---------|--------|-----------|
| `hias()` membuang hiasan lama dulu | kaitan yang dibuka **hilang** → klik lagi **DOBEL** | baris yang sudah punya `.at-hias` **dilewati** + pengaman anti-dobel |
| kotak pratinjau dicari `:scope > .at-pratinjau` di **elemen salah** | pratinjau **menumpuk** | cari di dalam **`.at-anak`** |
| blok ditaruh **di dalam kotak** yang lalu dibongkar | blok **hilang** sesudah `✓ pilih` | taruh di **`kotak.parentElement`** |
| `caraTampil`/`simpanCaraTampil` hilang saat ditulis ulang | tombol pilihan cara **mati diam-diam** | keduanya **wajib ada** di `tampilan.js` |
| `window.X = (function(){ … window.X = {…} … })()` | nama ditulis 2× → hasil (`undefined`) menimpa isi → modul “tidak ada” | cukup **`return`** |
| `namespace()` besarkan huruf pertama saja | `ayat-terkait` → `ANodesAyat-terkait` (**tidak sah**) | pisah tanda hubung, besarkan tiap bagian |

**Uji:** **AF3–AF17** (diperluas 15 Sep 2026, dilewati otomatis kalau plugin belum terdaftar)
+ uji lama **Q4b** diperbarui → **352 uji, 0 gagal** di kedua versi berkas.
⚠️ Tambahkan `anodes-ayat-terkait-cara` ke `KUNCI_AMAN` di `tools/uji-toolbar.js`.

---

## D-7v6f. 🖊 K84 — **TAUTAN AYAT DI DALAM TEKS PENGUAT** — ✅ **SELESAI · 30 Okt 2026**

> 💬 Bapak: *“ada lagi mesti di revisi plugin penguat. ini juga harus di analisa untuk ketemui ayat
> alkitab.. jika ketemu di klik lompat ke alkitab ke ayat / kitab jika klik home kembali ke alkitab
> posisi sebelumnya. arahan ini cukup jelas ?”*

**🔎 DIUKUR DULU (❌ bukan diduga)** — 31.102 ayat penguat diperiksa dengan mesin Alkitab **asli**:

| Hal | Angka |
|---|---|
| Ayat penguat **memuat rujukan ayat** | **8.136 (26,2 %)** |
| Total rujukan | **10.399** · rata **1,28**/ayat · maks **6** |
| Sebaran | 1 → **6.180** · 2 → **1.671** · 3 → **266** · 4 → **17** · 5 → **1** · 6 → **1** |

⇒ **Yang kurang HANYA pintunya** (pola **K56** halaman Sejarah) — ❌ **tanpa mesin baru**.

**📐 TIGA PERMUKAAN dibuka** (semuanya memakai jalur resmi yang SUDAH ADA):

| # | Permukaan | Sebelum | Sesudah |
|---|---|---|---|
| **a** | Halaman 🖊 Pembaca Penguat (K47) | ❌ 0 | ✅ **21 tautan** |
| **b** | Kotak 🖊 di halaman baca Alkitab (K54) | ❌ 0 | ✅ **7 tautan** |
| **c** | Kotak 🖊 di catatan (K45 i) | ❌ 0 | ✅ **2 tautan** |

**Jalur resmi yang dipakai:** `ANodesAlkitab.tandaiWadahHalaman(wadah)` ·
`ANodesAlkitabTampilan.pasangKaitAyatHalaman(wadah, jenis)` ·
`ANodesAlkitabTampilan.daftarPemulihHalaman(jenis, fn)` · `ingatAsalAyat` ·
`kembaliKeHalamanAsalAyat` · `ANodesAlkitabTampilan.kembali()` (🏠 sudah otomatis mendelegasikan).

**✅ HASIL:** klik tautan ⇒ lompat ke ayat · 🏠 ⇒ **kembali ke tempat semula**
(halaman penguat gulir **420 → 420** · dari kotak halaman baca ⇒ **Mazmur 23** ·
dari kotak catatan ⇒ **CATATAN**) · lepas plugin ⇒ hiasan hilang, **catatan UTUH** ·
**22 uji K84 · 0 gagal** · penanda **`v30Okt-k`** · plugin penguat **1.4** ·
HP **28.399.057 byte** · APK **±40,1 MB** (aset byte-identik · build **±24s**).

**🐞 2 CACAT NYATA (jangan diulang):**
1. **`*/` di dalam komentar blok = SyntaxError.** Teks `**1,28**/ayat` menutup komentar lebih awal
   ⇒ `ANodesPenguatTampilan` **undefined** ⇒ **seluruh plugin penguat mati**. Selalu `node --check`.
2. **Wadah di dalam halaman aplikasi ❌ jangan didaftarkan sebagai “halaman asal”.**
   Kalau wadahnya di dalam `#baca-alkitab`/`#app-utama`, jalur bawaan `kembali()` sudah benar.
   Penanda “dari dalam halaman baca” **WAJIB dari pemanggil** (`dariDalamBaca`), ❌ jangan ditebak
   dari `baca.hidden` — klik dari **kotak catatan** ikut salah terbaca.

**Berkas:** `plugin/penguat/tampilan.js` · `plugin/alkitab/tampilan.js` · `css/app.css` ·
`plugin/penguat/plugin.js` · `tools/uji-cepat.js` (**K84-01…K84-22**).

---

## D-7v6e. 📚 K83 batch 4+5+6 — **KAMUS NAMA: 1.154 → 2.978 ENTRI** — ✅ **SELESAI TOTAL · 30 Okt 2026**

> 💬 Bapak: *“selanjutnya butuh berapa lama proses ?”* ⇒ sisa pekerjaan **diukur dari data**
> (2.801 calon − 762 sudah masuk = **2.048**) ⇒ **⏱️ perkiraan batch 4 ±60–75 menit · batch 4+5
> ±2,5–3 jam** ⇒ Bapak memilih **`batch4dan5`** dengan **`arti = sama seperti batch 3`**.

| Hal | Sebelum | Sesudah |
|---|---|---|
| `tools/kamus-nama.json` | 762 | **2.586** (+754 batch 4 · +1.050 batch 5 · +20 batch 6) |
| Entri kamus | 1.154 | **2.978** |
| Tulisan | 1.207 | **3.142** |
| Ukuran data | 246,4 KB | **491,5 KB** |
| Plugin kamus | 1.3 · ±246 KB | **1.4 · ±492 KB** |
| Penanda | `v30Okt-h` | **`v30Okt-j`** |
| HP | ±26,81 MB | **28.350.319 byte (27,69 MB)** |
| APK | ±38,2 MB | **±38,3 MB** · SHA-256: lihat `artifacts/APK-INFO.txt` · aset **byte-identik** · build **±24s** |

**🔎 CARA KERJA:** `tools/_konteks-nama.js` mengambil **2 ayat nyata** per calon dari
`plugin/alkitab/data/alkitab-tb.js` (`vm.createContext`) ⇒ arti ditulis dari ayat itu, ❌ bukan
tebakan. Saringan: bentuk kata kerja **`Kau-`/`Ku-`** · akhiran **`-pun`/`-lah`** · kata gabung/
camelCase · kata ganti & kata umum. Penggabung memeriksa nama dobel · nama di luar calon ·
arti kosong ⇒ **0 masalah**.
**✅ BUKTI:** `jumlahIstilah()` **2.978** · `jumlahTulisan()` **3.142** · `versi()` **`v30Okt-j`** ·
plugin **1.4** · **20 nama uji 0 gagal** · klik nyata “Sobakh” ⇒ halaman istilah · keterangan
**470 huruf** · catatan **6 tanda**.
**🐞 4 cacat di uji sendiri:** `tandaiSekarang()` tidak ada (benar **`segarkanTanda()`**) ·
tunggu 900 ms terlalu cepat (pakai **1.600 ms**) · salah tulis `Haaarabim` · `Baal-Salisa` terlewat.
**📦 BERKAS:** `tools/kamus-nama.json` · `plugin/kamus/data/kamus.js` · `plugin/kamus/plugin.js` ·
`plugin/kamus/tampilan.js` · `index.html` · `tools/uji-cepat.js` · `rencanakerja.md` ·
`agents.md` **0a00d9k**.

## D-7v6d. 📚 K83 — **KAMUS NAMA ORANG / TEMPAT / ISTILAH + KATA GANTI** — ✅ **SELESAI batch 1+2+3 · 30 Okt 2026**

> 💬 Bapak: *“dari seluruh 66 kitab dalam alkitab.. km analisa dan kumpulkan dan temukan nama2
> orang tempat atau istilah (bukan bahasa hari2) dan carikan arti yg jelas menerangkan.. mau
> lengkapi kamus istilah terlalu sedikit.. setelah ini di alkitab juga ada link teks yg mengandung
> kamus istilah.. user baca bisa langsung paham walau nama orang, lokasi atau istilah2 bukan
> hari2 .. arahan ini cukup jelas ?”*
> ➕ *“mungkin sekalian kata Aku, Dia sedang menerangkan siapa pun boleh dimasuk .. karena termasuk
> sulit dimengerti”*
> ➕ *“saya ingin lengkap.. saya yakin tidak semua orang klik link.. dia klik jika ingin tau..
> mungkin hanya di awal2.. tapi kedepannya dia klik jika ingin tau. karena masih sore.. bisa
> dimulai dari yg besar.. nanti semakin ukuran yg lebih kecil mungkin harus beberapa hari prosesnya”*

### ✅ Keputusan Bapak

| # | Hal | Jawaban |
|---|---|---|
| 1 | Cakupan | ✅ **LENGKAP** — semua nama, ❌ bukan sebagian |
| 2 | Urutan | ✅ **mulai dari kelompok TERBESAR** (≥100×) |
| 3 | Kata ganti | ✅ **IKUT** (Aku · Dia · Engkau · Ia · Kamu) |

### 🔎 Diukur dulu (❌ bukan diduga) — 4 putaran

| Putaran | Saringan | Hasil |
|---|---|---|
| 1 | kata berhuruf besar, **bukan awal kalimat**, ≥3 huruf | 3.417 kata · **3.313 belum di kamus** |
| 2 | **rasio huruf kecil/besar ≤ 0,05** | 2.824 calon |
| 3 | saringan bentuk posesif — ❌ **SALAH** (membuang nama sah) | — |
| 4 | **diperbaiki:** buang hanya bila **bentuk dasar** kata umum | ✅ **2.801 calon** |

**Bukti aturan:** `Daud` **1098 besar / 0 kecil** (rasio 0) vs `Besar` 69 besar / **835 kecil** (rasio 12,1).

### 📊 Sebaran 2.801 calon nama

| Kelompok | Jumlah | Status |
|---|---|---|
| **≥100×** | **31** | ✅ **SELESAI (batch 1)** |
| **20–99×** | **177** | ✅ **SELESAI (batch 2 — 173 ditulis, 4 dibuang)** |
| 5–19× | 563 | ⬜ batch 3 |
| 2–4× | 825 | ⬜ batch 4 |
| 1× | 1.205 | ⬜ batch 5 (opsional) |

### ⚙️ Pelaksanaan (❌ tanpa mesin baru)

| Bagian | Pelaksanaan |
|---|---|
| Sumber baru | **`tools/kamus-nama.json`** — **762 entri** (40 batch 1 + 173 batch 2 + 549 batch 3) |
| Sumber lama dipindah | `tools/kamus-utama.json` (340) + `tools/kamus-tambahan.json` (69) — dari `backups/` karena `C:\data\bible\` **sudah tidak ada** |
| Alat | `tools/siapkan-data-kamus.js` — `SUMBER_NAMA` + `masukkan(daftarNama, true)` sebagai langkah gabung **terakhir** (sumber baru **menang**) |
| Hasil | `plugin/kamus/data/kamus.js` — **1.154 entri · 1.207 tulisan · 246,4 KB** |
| Keterangan plugin | `plugin/kamus/plugin.js` — versi **1.2 → 1.3** · angka **605/659 → 1.154/1.207** · ukuran **176 → 246 KB** |
| Alat uji BARU | **`tools/uji-chrome.js`** — menjalankan `tools/uji-cepat.js` di Chrome headless nyata |

### 🐞 Cacat #1 — sakelar K70 ikut mematikan halaman plugin

> **Sakelar K70 (ON/OFF penandaan CATATAN, bawaan OFF) ikut mematikan penandaan di HALAMAN PLUGIN.**
> Terukur: **0 tanda** istilah di halaman baca Alkitab (Yohanes 3). Padahal K70 sendiri menyatakan:
> *“Halaman plugin (Alkitab · Peta · Kamus · Penguat · Sejarah) ❌ TIDAK ikut mati — yang berhenti
> HANYA penandaan di catatan.”*

| Berkas | Sebelum | Sesudah |
|---|---|---|
| `plugin/kamus/tampilan.js → bisaTandai()` | membaca sakelar **tanpa memeriksa wadah** | **`bisaTandai(wadah)`** — sakelar hanya bila wadahnya `#editor` |
| `plugin/alkitab/alkitab.js → aktif()` | idem | **`aktif(wadah)`** — idem |
| `bersihkanTanda()` | `#editor` · `#baca-isi` · `#pg-isi` | ➕ **`#sj-isi`** |

### 🐞 Cacat #2 — kata ganti huruf kecil ikut ditandai

> Kamus nama menambahkan kata ganti (`Aku` · `Dia` · `Engkau` · `Kamu` · `Ialah` …). Karena
> pengenal kata memakai regex **tanpa beda huruf besar/kecil** (`gi`), bentuk **huruf kecil**
> ikut ditandai — padahal itu kata biasa: *“anak orang ini **ialah** Yoram”* ·
> *“**aku** mengasihi **engkau**”*. Terukur **17 tanda dalam 1 ayat**.

| Aturan | Bukti ukur (seluruh 31.102 ayat) |
|---|---|
| **`WAJIB_BESAR`** = daftar sempit **10 kata ganti** (`aku` · `dia` · `engkau` · `kamu` · `ia` · `akulah` · `dialah` · `engkaulah` · `kamulah` · `ialah`) — hanya ditandai bila **berawalan huruf besar** | tanda **72.875 → 56.154** (−16.721 · **−23 %**) · ayat bertanda **25.287 → 22.551** · maks/ayat **17 → 15** · **0 entri hilang** |

### 📊 Hasil terukur (akhir batch 2)

| Hal | Kamus LAMA (392) | Kamus BARU (605) | Selisih |
|---|---|---|---|
| Ayat bertanda | 16.943 (54,5 %) | **23.243 (74,7 %)** | **+6.300** |
| Total tanda | 32.173 | **61.534** | **+29.361 (+91 %)** |
| Rata tanda/ayat | 1,90 | **2,65** | +0,75 |
| Maks tanda/ayat | 13 | **15** | +2 |
| Entri muncul | 265 / 392 | **1.024 / 1.154** | +759 |
| Ukuran data | 135 KB | **246,4 KB** | +111,4 KB |

| Hal | Angka |
|---|---|
| Kamus | **392 → 1.154 entri** · **437 → 1.207 tulisan** · **135 → 246,4 KB** |
| **Halaman Alkitab (Yohanes 3)** | ✅ **76 tanda** (dulu **0**) |
| **Halaman Sejarah** | ✅ **244 tanda** |
| **Halaman Penguat** | ✅ **62 tanda** |
| **Catatan saat sakelar OFF** | ✅ **0 tanda** (tetap benar) |
| **Catatan saat sakelar ON** | ✅ **4 tanda** |
| Uji | ✅ **28 uji K83 · 0 gagal** (K83-01…K83-28) di `index.html` **dan** `ANodes-1berkas.html` |
| Suite penuh | **972 uji · 12 gagal = baseline lama** (lingkungan headless) ⇒ **0 regresi baru** |
| Penanda versi | **`v30Okt-g` → `v30Okt-h`** |
| HP | **±26,81 MB** · lihat `artifacts/APK-INFO.txt` |
| APK | **±38,2 MB** · SHA-256: lihat `artifacts/APK-INFO.txt` · `versionCode 12` / `2.0.0-webview-k83c` · aset **byte-identik** · build **40s** |

### ⚠️ Pelajaran

1. **Sakelar yang berlaku untuk SATU wadah wajib memeriksa wadahnya.**
2. **Ukur dulu sebelum memutuskan aturan** — saringan “bentuk posesif” versi pertama **salah**.
3. **Uji lama bisa gagal palsu karena data bertambah** — K52-03 mencari tanda **pertama** di
   Yos 1:8; sejak kamus memuat kata ganti, tanda pertama jadi “engkau”. Uji diperbaiki agar
   mencari kata **“Taurat”** (yang memang diuji), ❌ bukan urutannya.
4. **Folder `C:\data\bible\` sudah TIDAK ADA** ⇒ sumber kamus dipindah ke `tools/`.
5. **Menambah entri kata ganti ⇒ WAJIB memeriksa huruf besar/kecil.** Pengenal kata memakai
   regex `gi` — bagus untuk nama (`daud` = `Daud`), tetapi **buruk untuk kata ganti** yang bentuk
   huruf kecilnya adalah kata biasa. Aturan `WAJIB_BESAR` menyelesaikannya dengan **daftar
   sempit**, ❌ bukan aturan umum.
6. **Harness ukur harus setia pada mesin asli.** Versi pertama saya memakai flag `g` (bukan `gi`)
   ⇒ hasil **36.102 tanda** padahal yang benar **72.875**. Selalu **bandingkan** hasil harness
   dengan mesin asli sebelum memutuskan aturan.
7. **Uji lama yang menyebut ANGKA data wajib ikut diperbarui** — K42a-05 (`392`), K57-05 (`392`),
   K80-04 (`v30Okt-b`) gagal karena data/versi berubah, **bukan** karena kode rusak.

**Berkas:** `tools/kamus-nama.json` (BARU — 762 entri) · `tools/kamus-utama.json` ·
`tools/kamus-tambahan.json` · `tools/siapkan-data-kamus.js` · `plugin/kamus/{kamus,tampilan,plugin}.js` ·
`plugin/alkitab/{alkitab,tampilan}.js` · `plugin/kamus/data/kamus.js` · `index.html` ·
`tools/uji-cepat.js` (**K83-01…K83-28**) · **`tools/uji-chrome.js` (BARU)** ·
`android-native/app/build.gradle.kts`.

---

## D-7v6c. 🔀 K82 — **DUA JALUR DI BAR PILIHAN AYAT** — ✅ **SELESAI 30 Okt 2026**

> 💬 Bapak: *“bookmark dengan panah di pasted image ... karena tidak menemukan cara bookmark ..
> dugaan belum ada cara book ... jadi di posisi alkitab pada saat klik ayat ada **2 jalur** satu
> copy ke catatan dan ke dua masuk ke pages booking”*

### ✅ Keputusan Bapak

| # | Pertanyaan | Jawaban |
|---|---|---|
| 1 | Setelah `[🔖 Bookmark]` ditekan, mau ke mana? | ✅ **B — langsung PINDAH ke halaman 🔖 Bookmark** |
| 2 | Tombol 📌 di navbar diapakan? | ✅ **A — jadi PINTU ke halaman daftar bookmark** |
| ➕ | Ikon | ✅ **📌 DIGANTI 🔖** (📌 sudah dipakai peta) |

### 📐 Bentuk yang jadi

```text
[Mat 4:4-6] [💬 Kalimat] [Matius 4:4-6] [📋 Simpan] [🔖 Bookmark] [✕]
                                            │            │
                                      ke CATATAN   ke HALAMAN 🔖
```

### ⚙️ Pelaksanaan (❌ tanpa mesin baru)

| Bagian | Pelaksanaan |
|---|---|
| Tombol baru | **`#bk-bookmark`** di `#bar-kirim` — `pasangTombolBarKirim()` (idempoten, ditaruh **sebelum ✕**) |
| Fungsi | **`simpanDariPilihan()`** — baca `ANodesAlkitabTampilan.pilihan` → simpan → `batalPilih()` → **`bukaHalaman()`** |
| **LOMPAT ⇒ terpisah** | **`kelompokBerurutan([24,25,26,28])` ⇒ `[[24,25,26],[28]]`** — satu kelompok = satu bookmark |
| Tombol navbar | `#baca-bookmark` sekarang **`bukaHalaman()`** (❌ bukan `sakelarBar()`) |
| Ikon | **📌 → 🔖** di seluruh plugin |
| CSS | `.bar-kirim .bk-bookmark` · ≤430px kata “Bookmark” disembunyikan (ikon tetap) |

### ✅ Hasil terukur

| Hal | Bukti |
|---|---|
| Dua jalur terlihat | ✅ `["💬 Kalimat","Matius 4:4-6","📋 Simpan","🔖 Bookmark","✕"]` |
| Tekan `[🔖 Bookmark]` | ✅ tersimpan + **langsung pindah** ke halaman bookmark |
| **LOMPAT 24 & 26** | ✅ **2 bookmark** (`24-24`, `26-26`) |
| Tombol navbar 🔖 | ✅ membuka halaman · ❌ tidak membuka bar tandai |
| **344 px** | ✅ `lebarBar 344 = lebarIsi 344` — tidak meluber |
| Uji | ✅ **94 uji (K81 64 + K82 30) · 0 gagal** |
| Penanda versi | **`v30Okt-d` → `v30Okt-e`** |
| HP | **27.939.523 byte (27,94 MB)** · SHA-256 `1D96C0F8…7931` |
| **APK WebView** | **39.901.809 byte (38,0 MB)** · SHA-256 `65A5CE54…DB6D` · `versionCode 9` / `2.0.0-webview-k82` · aset **byte-identik** |

### ⚠️ Pelajaran

1. 🔴 **Fitur yang “sudah ada” bisa tetap tidak ditemukan pengguna** — tombol 📌 sudah ada sejak
   K81 tetapi **ikon saja tanpa tulisan** ⇒ Bapak menyimpulkan fiturnya belum ada. **Dua jalur
   harus TERLIHAT BERSAMAAN di tempat keputusan diambil.**
2. **Ikon bisa bentrok makna** — 📌 dipakai peta ⇒ pakai 🔖 untuk bookmark.
3. **Aturan “lompat ⇒ terpisah” wajib dipertahankan di jalur baru** (`kelompokBerurutan()`).
4. **Ukuran menu tetap** (K71) — di ≤430px kata disembunyikan, bar tetap 1 baris di 344 px.

---

## D-7v6b. 🏠 K81b — **TOMBOL HOME BOOKMARK KEMBALI KE ALKITAB** — ✅ **SELESAI 30 Okt 2026**

> 💬 Bapak: *“pages bookmark ayat · 🏠 📌 BOOKMARK AYAT · **Home tidak berfungsi.. tidak kembali
> ke alkitab**”*

### 🔎 Sebab terukur (CDP, ❌ bukan diduga)

`bukaHalaman()` menyembunyikan **semua** halaman lain **tanpa mencatat halaman mana yang sedang
tampil** ⇒ `tutupHalaman()` **selalu** membuka `#app-utama` (catatan). Terukur
`baca=false · utama=true` pada **setiap** jalur, termasuk saat bookmark dibuka dari halaman baca.

### 🔧 Perbaikan

| Bagian | Pelaksanaan |
|---|---|
| Keadaan baru | **`let asalHalaman = null`** — diisi **SEBELUM** halaman lain disembunyikan |
| `bukaHalaman()` | cari halaman yang masih `!hidden` → simpan idnya → baru sembunyikan semua |
| `tutupHalaman()` | `asalHalaman` ada & bukan `app-utama` ⇒ buka halaman itu (gambar ulang Alkitab bila kosong) · kalau tidak ⇒ `#app-utama` |
| `segarkanTombolKembali()` | judul 🏠 ikut berubah: **“Kembali ke bacaan Alkitab”** ⇄ **“Kembali ke catatan”** |

### ✅ Hasil terukur

| Jalur | Hasil |
|---|---|
| Buka bookmark dari **halaman baca** → 🏠 | ✅ kembali ke **ALKITAB** |
| Buka bookmark dari **catatan** → 🏠 | ✅ kembali ke **CATATAN** |
| Tekan **Esc** dari halaman bookmark | ✅ kembali ke **ALKITAB** |
| Uji | ✅ **64 uji K81 · 0 gagal** (K81-56…K81-63 baru) di `index.html` **dan** `ANodes-1berkas.html` |
| Penanda versi | `tampilan.js` **`v30Okt-c` → `v30Okt-d`** · halaman **`v30Okt-d`** |
| HP | **27.918.652 byte (27,92 MB)** · SHA-256 `A3EB41A7…16DE` |
| **APK WebView** | **39.886.105 byte (38,0 MB)** · SHA-256 `C6FE1AB8…8F9F` · `versionCode 8` / `2.0.0-webview-k81b` · aset **byte-identik** |

### ⚠️ Pelajaran

1. 🔴 **Halaman yang “menimpa” WAJIB mencatat SIAPA yang ditimpanya** — tanpa itu tombol kembali
   **selalu** mendarat di tempat yang salah. Pola ini sudah ada (`daftarPemulihHalaman` K56).
2. **Judul tombol kembali harus mengikuti asal** — pengguna perlu tahu akan dibawa ke mana.
3. **Uji harus menguji LEBIH DARI SATU jalur masuk** — kalau hanya diuji dari catatan, cacat ini
   **tidak akan pernah ketemu**.

**Berkas:** `plugin/bookmark/tampilan.js` · `index.html` · `tools/uji-cepat.js` (**K81-56…K81-63**).

---

## D-7v6. 📌 K81 — PLUGIN **BOOKMARK AYAT** — ✅ **SELESAI 30 Okt 2026**

> 💬 Bapak: *“perlu plugin tambahan .. **bookmark ayat alkitab**.. jika di aktifkan bookmark ..
> di alkitab tambahan tombol bookmark ketika user baca dan di klik ayat yg mau dibookmark bisa dari
> ayat - ayat bisa dari pasal .. ayat ... sampai dengan pasal .. ayat tergantung user klik ayat mana
> saja.. **tidak bisa lompat** jika mau dari .. sampai ..... **jika lompat terpisah bookmarknya** ...
> setelah bookmark hasilnya ada **pages di bookmark daftar ayat2 yg dibookmark** user user bisa
> **edit/hapus** .. user klik edit > sistem ke alkitab dan diposisi ayat yg mau diedit .. klik ayat
> lain tambah **tidak bisa lompat harus satu seleksi**.. jika user klik kembali ke ayat yg sudah
> diklik artinya **hapus** jadi edit ini juga bisa berfungsi hapus dengan cara klik ulang ayat yg
> sudah diklik.. jadi selama edit **area edit harus ada stabilo sistem** sampai selesai prosesnya”*

### ✅ Keputusan Bapak

| # | Pertanyaan | Jawaban |
|---|---|---|
| 1 | Bookmark lompat (24 lalu 26) | ✅ **B. DUA bookmark terpisah** |
| 2 | Letak tombol 📌 | ✅ **A. hanya di halaman baca Alkitab** |
| 3 | Daftar bookmark | ✅ **A. halaman sendiri** |
| 4 | Catatan per bookmark | ✅ **A. satu baris catatan** |
| 5 | Ikut sinkron K77? | ✅ **A. Ya, ikut disinkronkan** |
| ➕1 | Ayat yang sudah dibookmark | ✅ **diberi tanda** · boleh dibook **ulang** untuk topik lain **tanpa bertanya** |
| ➕2 | Copy ke catatan | ✅ **diberi tombol Copy** untuk ditempel ke catatan |

### 📐 Bentuk yang jadi

```text
HALAMAN BACA ALKITAB — Bilangan 6
[🏠] [Bilangan ▾] [📋 PILIH] [🔍 Cari] [📤] [🖊] [📌]     ← tombol 📌 BARU (ujung baris 1)
 24  TUHAN memberkati engkau dan melindungi engkau;   📌   ← tanda ayat SUDAH dibookmark
 25  TUHAN menyinari engkau dengan wajah-Nya …         📌
 26  TUHAN menghadapkan wajah-Nya kepadamu …           📌
      │ klik angka 24, 25, 26  ⇒ pilihan [24,25,26]
      ▼
 BAR BOOKMARK:  [📌 Bil 6:24-26]  [💾 Simpan]  [✕]
      │ klik angka 26 lagi (LOMPAT)  ⇒ pilihan baru [26]
      │ ⇒ bookmark “24” TERSIMPAN SENDIRI (terpisah)
      ▼
 HALAMAN 📌 BOOKMARK (halaman ke-9)
 ┌──────────────────────────────────────────────────────┐
 │ [🏠] 📌 Bookmark Ayat — 2 bookmark                   │
 │ ┌──────────────────────────────────────────────────┐ │
 │ │ 📌 Bilangan 6:24-26                              │ │
 │ │ 24 TUHAN memberkati engkau dan melindungi…       │ │
 │ │ 📝 topik: berkat                                 │ │
 │ │ [📋 Copy] [✏️ Edit] [🗑 Hapus]                    │ │
 │ └──────────────────────────────────────────────────┘ │
 └──────────────────────────────────────────────────────┘
      │ [✏️ Edit]  ⇒ pindah ke Alkitab + ayat DISOROT + STABILO
      ▼
 klik 25 ⇒ TAMBAH ([24,25]) · klik ulang 25 ⇒ HAPUS ([24])
 [💾 Simpan] ⇒ jadi 24-26 · jumlah tetap 2 · kembali ke halaman bookmark
```

### ⚙️ Pelaksanaan (❌ tanpa mesin baru)

| Bagian | Pelaksanaan |
|---|---|
| Berkas BARU | **`plugin/bookmark/bookmark.js`** (mesin · 227 baris) · **`plugin/bookmark/plugin.js`** (keterangan · 80 baris) · **`plugin/bookmark/tampilan.js`** (tampilan · 678 baris) |
| Simpanan | localStorage **`anodes-bookmark-v1`** — `{daftar:[{id,kitab,pasal,ayat[],catatan,dibuat,diubah}]}` |
| Tombol 📌 | kontrak **`tombol[]`** milik plugin Alkitab (pola sama 📤 & 🖊) ⇒ Alkitab **tidak tahu** plugin Bookmark ada |
| Tanda 📌 di ayat | sambungan resmi **`tambahPenghias()` / `jalankanPenghias()`** |
| Bar bookmark | `#bar-bookmark` di dalam `#baca-alkitab` (setelah `#bar-kirim`) — pola sama bar kirim K20 |
| Halaman | **`#bookmark-halaman`** = halaman ke-**9**, anak `body` (wajib — pelajaran K8) |
| Copy ke catatan | jalur **K20** yang sudah ada: `ANodesEditor.terimaPaket({teks,nama,sumber})` |
| Sinkron | `js/sinkron.js` → `KUNCI_SINKRON` **4 → 5 kunci** (+`anodes-bookmark-v1`) · `gabung()` = yang lebih baru `diubah` menang |
| Aman | lepas plugin ⇒ tanda & tombol hilang · **Alkitab & catatan UTUH** (diuji) |

### 📊 Hasil terukur

| Hal | Bukti |
|---|---|
| Klik 24, 25, 26 | ✅ pilihan `[24,25,26]` · chip **“📌 Bil 6:24-26”** |
| Klik ulang 25 | ✅ lepas ⇒ `[24,26]` · chip **“📌 Bil 6:24, 26”** |
| **LOMPAT 24 → 26** | ✅ pilihan baru `[26]` · **bookmark “24” tersimpan terpisah** |
| Simpan | ✅ 2 bookmark · pilihan dikosongkan |
| Tanda 📌 | ✅ muncul di ayat 24, 26, 27 |
| Halaman bookmark | ✅ 2 kartu · nama + teks ayat + 3 tombol |
| Mode edit | ✅ pindah ke Alkitab · halaman bookmark **tersembunyi** · ayat disorot + stabilo |
| Edit: klik 25 / klik ulang | ✅ tambah `[24,25]` / hapus `[24]` |
| Simpan edit | ✅ jadi 24-26 · **jumlah tetap 2** · kembali ke halaman bookmark |
| Copy | ✅ paket siap tempel · kembali ke catatan · bar paket tampil |
| Lepas plugin | ✅ tanda & tombol hilang · **Alkitab tetap 27 ayat** · catatan **166 huruf utuh** |
| Sinkron | ✅ **5 kunci** |
| Uji | ✅ **85 uji (K80 29 + K81 56) · 0 gagal** di `index.html` **dan** `ANodes-1berkas.html` |
| Penanda versi | **`v30Okt-b` → `v30Okt-c`** |
| HP | `ANodes-1berkas.html` **27.902.376 byte (27,90 MB)** |

### 🐞 4 CACAT NYATA yang ketemu & diperbaiki (jangan diulang)

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | `hias()` **tidak memeriksa apakah plugin masih terpasang** | tanda 📌 **tetap digambar sesudah plugin DILEPAS** | `pluginAktif()` diperiksa di dalam `hias()` (pola sama plugin 🖊 Penguat) |
| 2 | `bersihkan()` tidak membuang **`dataset.siapBookmark`** | plugin dipasang ulang ⇒ **pengait klik tidak pernah dipasang lagi** | `delete isi.dataset.siapBookmark` (pelajaran K55d) |
| 3 | `mulaiEdit()` tidak menyembunyikan halaman bookmark | halaman bookmark **tetap terlihat** di bawah halaman baca | `hal.hidden = true` sebelum `bukaRentang()` |
| 4 | Tanda 📌 `inline` / `inline-block` | tanda **jatuh ke baris baru** kalau baris teks penuh (terukur: teks **373 px** dari **433 px**) | **`position: absolute`** di ujung kanan + `.ayat-baca { position: relative }` |

### 🐞 3 CACAT BERKAS UJI yang ketemu & diperbaiki (jangan diulang)

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 5 | `ok` & `tunggu73` dideklarasikan **DI DALAM `try` blok K73/K79** | tidak terlihat di blok K80/K81 ⇒ blok itu **langsung error** (`ok is not defined`) dan **SELURUH ujinya HILANG** dari laporan (terukur: **“K81: 1 uji”** padahal ada 56) | `ok` & penunggu dideklarasikan **ulang di tiap blok** |
| 6 | Penyaring `__BLOK` memakai `x.indexOf(b) === 0` | label **SELALU** diawali `✅ `/`❌ ` ⇒ **tidak pernah cocok** ⇒ **“Total: 0 uji”** | tanda itu **dibuang dulu** sebelum dicocokkan |
| 7 | Blok K81 **tidak memasang plugin bookmark** | tombol 📌 & tanda ayat **tidak pernah digambar** ⇒ **6 uji gagal palsu** | pasang plugin dulu (`ANodesPlugin.pasang('bookmark')`) |

### ⚠️ PELAJARAN

1. **Setiap plugin yang menempel di DOM WAJIB memeriksa “apakah saya masih terpasang”** di dalam
   fungsi hiasnya. Tanpa itu, hiasan **tetap hidup sesudah plugin dilepas** (cacat #1).
2. **`bersihkan()` WAJIB membuang penanda `dataset`** — kalau tidak, **pasang ulang ⇒ tidak
   pernah mendaftar lagi** (pelajaran K55d yang terulang).
3. **Halaman yang “menimpa” wajib disembunyikan sendiri** — `pindahKeBaca()` hanya mengurus
   `#app-utama` & `#baca-alkitab`; halaman lain (kamus · penguat · sejarah · peta · **bookmark**)
   **harus menyembunyikan dirinya sendiri**.
4. **Tanda kecil di ujung baris teks ⇒ pakai `position: absolute`.** `inline` & `inline-block`
   **gagal** kalau barisnya sudah penuh (terukur 373 px dari 433 px) — tanda terdorong ke baris baru.
5. **Uji yang gagal belum tentu cacat kode** — 3 dari 5 kegagalan pertama adalah **cacat uji saya
   sendiri** (`ANodesEditor.paket` tidak ada — yang benar `paketTeks`; urutan kartu = terbaru dulu).

**Berkas:** `plugin/bookmark/{plugin,bookmark,tampilan}.js` (BARU) · `index.html` ·
`css/app.css` · `js/sinkron.js` · `tools/uji-cepat.js` (**K81-01…K81-55**) ·
💾 `backups/k81-bookmark-ayat-20261030/`.

## D-7v2. 🔗🖐 K37–K41 — 5 kasus plugin **Ayat Terkait** (17 Sep 2026)

> ✅ **Semua SELESAI 17 Sep 2026 · 66 uji cepat, 0 gagal** (`tools/uji-cepat.js`, ±15 detik).
> Semua perubahan **hanya di dalam `plugin/ayat-terkait/**` + `js/dokumen.js` + `js/editor.js`** —
> mesin `terkait.js`, data `silang.js`, `ambilAyatBanyak()`, dan sambungan
> `tambahPenghias()/jalankanPenghias()` **TIDAK disentuh**.

| # | Nama | Inti |
|---|------|------|
| **K37** | 🔗🖐 **MODE GRUP** | klik **beberapa angka ayat** (mis. Roma 4:2-4) → tekan salah satu `ayat terkait (n)` ⇒ **sistem pindah ke halaman kerja** dengan ayat-ayat itu **diikat** (❌ bukan membuka daftar di tempat) · **baris pemilih** `[2][3][4]` di halaman kerja → klik nomor ⇒ kolom kaitan **ayat itu saja**, bisa **bolak-balik** (belum ada blok sebelum `✓ pilih`) · `✓ pilih` ⇒ akar = ayat grup yang aktif, ayat pilihan **TURUN** jadi blok · `[🗑]` saat masih di baris grup = **batalkan grup** (pulang ke halaman baca) · ⚠️ **alur 1 ayat TIDAK berubah** (grup hanya hidup kalau **≥ 2** ayat terpilih) |
| **K38** | 📖 **REVISI GRUP** | klik nomor ⇒ **kalimat ayat itu ikut tampil** di atas deretan kaitan · chip kaitan pakai **nama kitab SINGKAT** (`Kejadian 12:12-13` → **`Kej 12:12-13`**) · sesudahnya proses **sama** seperti 1 ayat · ⚠️ alur 1 ayat & baris rentang (K34) tetap **nama PANJANG** |
| **K39** | ✂️ **NAMA AYAT SINGKAT** | **Bapak:** *“semua ayat terkait gunakan metode **ayat singkat saja**.. **Matius → Mat** supaya hemat tempat”* · dipakai di **chip · pratinjau · kaitan lanjutan · blok 📖 · jejak langkah · Riwayat Jalur · nama berkas bawaan** · `title` tetap nama **PANJANG** · ⚠️ **judul pasal halaman baca & bar paket K20 TIDAK diubah** (keputusan Bapak: *“alkitab tidak perlu .. plugin saja diproses”*) |
| **K40** | 📥 **INSERT HASIL KE CATATAN** | `[Doc] → 🌿 Ayat Terkait` → tombol **`[ + Ayat ]`** di samping `[🌿 Buka]`/`[🗑]` → **pindah ke catatan** (ayat **dipegang**, belum ditempel) → Bapak **klik di tulisan** menentukan letak → tekan **`[ + Ayat ]` di bar info** → ayat masuk + disorot kuning → bar paket `[💬 Kalimat] [Singkat⇄Panjang] [↶ Batalkan] [Selesai]` · ⚠️ **memakai jalur K20 yang sudah ada** (`ANodesEditor.terimaPaket`/`tempelPaket`, `sumber` untuk menyusun ulang paket) — ❌ **bukan cara baru** · tombol di bar info **hanya muncul kalau ada rantai dipegang** |
| **K41** | 🔄 **TOMBOL SEGARKAN DI [Doc]** | isi 5 berkas `.md` **ditanam** saat halaman dibuka → setelah `.md` diubah, halaman **harus dimuat ulang**. Tombol **`🔄`** di navbar [Doc] (sebelah `↩ Asli`) = `location.reload()` · ⚠️ **simpan dulu catatan** (`ANodesEditor.simpanSekarang()`) · kalau ada editan dokumen belum disimpan → **ditanya dulu** · ❌ **tidak** memuat ulang otomatis saat [Doc] dibuka (bisa mengagetkan saat menulis) |

**Berkas & fungsi kunci yang ditambahkan:**

```
plugin/ayat-terkait/kerja.js     grup · kotakGrup() · chipGrup() · kotakPratinjauGrup() · komitGrup()
                                 bukaGrup(kitab,pasal,ayat[],aktif) · namaKitab() · jumlahKaitanGrup()
                                 labelRef() = SINGKAT (K39) · labelPanjangRef() = panjang (judul saja)
                                 susunTeksRantai(pohonR,{kalimat,panjang}) · susunDariSimpanan(id,opsi)
                                 kirimKeCatatan(paketTeks,sumber) · _grup
plugin/ayat-terkait/tampilan.js  ayatDipilih() · masukGrup() · segarkanTandaGrup() ·
                                 segarkanSemuaTombolGrup() · labelAyat(d) = d.labelPendek || d.label
                                 pendengar event 'anodes-pilih-berubah' pada #baca-isi
plugin/alkitab/tampilan.js       kabariPilihanBerubah() — dipanggil di akhir segarkanPilihan()
js/berkas.js                     halaman 🗂️ BERKAS TERSIMPAN (K28h) · .ss-insert +
                                 opsiInsert()/simpanOpsiInsert() · KUNCI_INSERT = 'anodes-insert-ayat'
js/editor.js                     #info-insert + segarkanTombolInsert() · gambarOpsiPaket()
                                 susunUlangPaket() · kaitOpsiPaket() · simpanSekarang()
```

⚠️ **JEBAKAN BARU (jangan diulang):**

| Jebakan | Akibat | Pencegahan |
|---------|--------|-----------|
| menebak jumlah kaitan dari ingatan/regex | uji gagal palsu (Roma 4:3 sebenarnya **15**, bukan 13 — regex tidak menghitung entri berentang) | **selalu** pakai `ANodesAyatTerkait.jumlahKaitanAyat()` |
| menebak kalimat ayat dari ingatan | uji gagal palsu (TB menulis *“Sebab **jikalau** Abraham …”*, bukan “jika”) | ambil pembanding dari **data asli** |
| mengira `kaitan()` sudah tersortir | chip pertama bukan yang terkecil — **pengurutan ada di `kaitanRef()`** | urutkan sendiri atau pakai `kaitanRef()` |
| **label uji memuat `❌`** | penyaring kegagalan (`L.filter(x => x.includes('❌'))`) menghitungnya **GAGAL palsu** | tulis `[Selesai]` saja |
| pilihan yang **diingat** (localStorage) tidak dinormalkan di awal uji | pilihan dari uji sebelumnya terbawa → uji berikutnya gagal palsu | tambah kunci baru ke **`KUNCI_AMAN`** + `localStorage.removeItem()` sebelum blok itu |
| memperbaiki tata letak berkali-kali tanpa mengukur | bisa jadi masalah **sudah ada sebelumnya** (bukan akibat perubahan) | **STOP setelah 3–4 percobaan**, ukur dulu (sembunyikan tombol → tinggi navbar tidak berubah ⇒ bukan regresi) |

**Uji:** blok **K37-01…K37-22 · K38-01…K38-07 · K39-01…K39-14 · K40-01…K40-18 ·
K41-01…K41-05** digabung di **`tools/uji-cepat.js`** = **66 uji, 0 gagal** (±15 detik).
⚠️ Uji K41 **tidak mengklik** tombol 🔄 (kalau diklik halaman dimuat ulang & alat uji mati) —
yang diperiksa: tombol ada · pengait terpasang · keterangan benar · ikon-saja · fungsi tersedia.

---

## D-7v3. 📚 K42 — PLUGIN **KAMUS ISTILAH** — ✅ **SELESAI 18 Sep 2026** (butir a–g)

> ✅ **SUDAH JADI & BERFUNGSI.** Perintah Bapak: *“berikut adalah **plugin baru** · **kamus istilah** ·
> bisa pelajari `file:///C:/data/bible/android/lab3-offline.html` dan `C:\data\bible\prompt.md` ·
> semoga mencatat dengan baik .. setelah km pahami .. **paparkan pada rencana kerja secara mendetail**”*
> lalu (18 Sep, setelah mencoba): *“proses satu2 tapi sampai tuntas.. tapi dilayar tampilkan
> progressnya sudah sampai mana.. berapa persen lagi dan berapa menit lagi selesai”*
>
> 📌 **Rencana lengkap + angka terukur + 16 jebakan: `rencanakerja.md` bagian 16.**
> 📌 **Ide lama yang DISATUKAN ke sini: I-04 · I-05 · I-02** (❌ jangan dicari lagi di tabel IDE).

**Konsep:** kata istilah khas Alkitab di dalam tulisan diberi **garis bawah putus-putus** →
**diklik = artinya muncul** → **ayat** & **istilah lain** di dalam arti **bisa diklik** →
**penelusuran berantai** (kata → arti → ayat → istilah lain → arti → …).

**Sumber data (fakta terukur 17 Sep 2026):**

| Berkas | Isi |
|--------|-----|
| `C:\data\bible\data\kamus.json` | **340 entri** (`kamus istilah alkitab.txt`, 27 Agu 2026) |
| `C:\data\bible\data\kamus-tambahan.json` | **69 entri** manual (Pniel, Roh Kudus, Taurat…) |
| **Gabungan** | **409 entri** → **466 tulisan** → **426 istilah siap deteksi** (±160 KB) |
| `C:\data\bible\android\lab3-offline.html` | lab3 versi HP — **acuan** (fitur sudah jadi di sana) |

**Angka lain yang wajib diingat:** arti kosong **0** · **374 (91 %)** arti memuat rujukan ayat ·
**257 (63 %)** arti memuat istilah lain · **78 entri** memuat “Lihat X” (⚠️ `Lihat Lamp.` = lampiran,
**bukan** istilah) · arti **terpanjang 1.324 huruf** → panel **wajib bisa digulir** ·
**58 arti** memakai rujukan **koma-lanjutan** (`Kel 21:29, 30`) → perlu pengembang ·
**83 singkatan kitab** dipakai di dalam arti → **49** cocok langsung, **26** lewat `SEBUTAN`,
**3 belum** (**`Rm`**→Rom · **`Hos`**→Ho · **`Yl`**→Yoel) · **22 entri (5 %)** berupa
**KATA UMUM** (Bait, Imam, Korban, Tanda, Tiang, Domba, Nabi, Sabat…) dan **47 entri** < 5 huruf
(`Roh`, `Log`, `Mil`, `Undi`, `Wadi`, `Zeus`) → ⚠️ **risiko salah tandai**.

**Arsitektur (meniru plugin 🔗 Ayat Terkait):**

```
plugin/kamus/plugin.js        KETERANGAN → window.ANodesPlug.push({…})  id = 'kamus' · ikon 📚
plugin/kamus/kamus.js         MESIN → window.ANodesKamus   (IndexedDB kunci 'kamus')
plugin/kamus/tampilan.js      TAMPILAN → window.ANodesKamusTampilan
plugin/kamus/data/kamus.js    DATA → window.ANodesKamusData  (dibuat alat, JANGAN diedit tangan)
tools/siapkan-data-kamus.js   pembuat data (gabung 2 JSON → 1 berkas .js)
```

**Gudang:** IndexedDB **`anodes-plugin-db`** / toko **`data`** / kunci **`kamus`**
(gudang **sama** dengan `alkitab-tb` & `silang`, **kunci berbeda**).
⚠️ Muat data lewat **`<script src>`**, ❌ **jangan `fetch()`** (diblokir di `file://`).
⚠️ `kamus.json`/`kamus-tambahan.json` **tidak diedit** — hasil gabungan masuk `data/kamus.js` (hasil alat).

**Tahapan (satu butir per giliran — Bapak bilang “proses” untuk tiap butir):**

| Butir | Isi | Status |
|-------|-----|--------|
| **a** | alat pembuat data + mesin kamus (IndexedDB + `petaTulisan` + `termRegex` urut terpanjang, saring **huruf+spasi/tanda-hubung ≥ 3 huruf**) | ✅ **SELESAI 17 Sep 2026**
| **b** | halaman **📚 Kamus Istilah** (halaman ke-4, **seukuran catatan**) + kotak cari + 🏠 kembali | ✅ **SELESAI 18 Sep 2026** |
| **c** | **garis putus-putus di catatan** + klik = arti — ⚠️ **paling rawan** | ✅ **SELESAI 18 Sep 2026** |
| **d** | **HALAMAN ARTI** (menimpa catatan) + **kolom ayat** + berantai + `pecahRujukan()` + 🏠 ke kata asal | ✅ **SELESAI 18 Sep 2026** |
| **e** | istilah di **halaman baca Alkitab** (lewat `tambahPenghias`) + daftar “📚 Istilah di ayat ini” | ✅ **SELESAI 18 Sep 2026** |
| **f** | halaman **Ayat & Istilah** (isi catatan) — *gabungan I-02* | ✅ **SELESAI 18 Sep 2026** |
| **g** | **kamus pribadi + antrian istilah** (`＋ Istilah`, `[📋 Salin daftar]`) — *gabungan I-05* | ✅ **SELESAI 18 Sep 2026** |

### ✅ HASIL BUTIR b–g (18 Sep 2026)

**Berkas:** `plugin/kamus/tampilan.js` (**ditulis ulang — inti pekerjaan**) · `plugin/kamus/plugin.js`
(`siap: true`) · `index.html` (**`#kamus-halaman`**) · `css/app.css` (`.halaman-kamus` · `.kamus-*`) ·
`js/editor.js` (**`tandaiSemuaTanda()`** & `bersihSemuaTanda()`) · `js/plugin.js` (teks “belum siap”
generik + `catatanTahap`) · `plugin/alkitab/alkitab.js` (**+3 sebutan `Rm`/`Hos`/`Yl`** ·
**`window.ANodesTandaKelas`** · `diDalamTanda()`) · `tools/uji-cepat.js` (**K42a–K42g + K42x**).

**⚠️ ARSITEKTUR WAJIB (butir c) — dua plugin menandai editor yang sama:**
```
window.ANodesTandaKelas = ['ay-link', 'kamus-istilah']   ← SATU daftar bersama
   ├─ alkitab.js → diDalamTanda(node)   ← melewati node bertanda MANA PUN
   └─ kamus/tampilan.js → acceptNode()  ← idem
js/editor.js → tandaiSemuaTanda()  ← SATU PINTU: ayat dulu → istilah kemudian
Simpan/Ekspor → bersihSemuaTanda() ← buang SEMUA tanda sekali jalan
```
⚠️ `bukaTanda()` **boleh** `normalize()` (node plugin lain masih `<span>`) — ❌ jangan `normalize()`
pada node **bertanda**.

**🐞 4 CACAT NYATA yang ketemu saat menguji (sudah diperbaiki — jangan diulang):**
1. **`bisaTandai()` menuntut penanda `hidup`** → setelah `bersihkan()` istilah **tidak ditandai**
   walau plugin terpasang & data siap — **inilah sebab “kamus belum berfungsi”**. Syarat cukup:
   plugin terpasang + data siap + cara `'putus'`; `hidup` diselaraskan sendiri.
2. **`tandaiWadah()` memulihkan kursor hanya kalau ada istilah baru** → saat kata yang diketik
   tidak lagi istilah, tanda lamanya dibongkar → node kursor hilang → **kursor melompat**.
   Pulihkan kursor kalau `jumlah > 0` **ATAU** `dibongkar > 0`.
3. teks bawaan halaman keterangan menulis *“Isi Alkitab (ayatnya) belum dimasukkan”* juga di
   plugin Kamus → **generik** + plugin boleh isi `catatanTahap`.
4. `plugin/kamus/plugin.js` masih `siap: false` → tombol **⬇ Pasang** tidak muncul di kartu gudang.

**⚠️ 5 PELAJARAN UJI (kesalahan UJI, bukan kode):**
1. **Label uji JANGAN memuat `❌`** — teks `(❌ bukan di dalam #app-utama)` membuat uji yang LULUS
   dihitung **gagal palsu**.
2. Jangan membandingkan lebar dengan `#app-utama` saat halaman kamus terbuka — elemen itu `hidden`
   → lebarnya **0** (gagal palsu) → ukur `.app` sungguhan.
3. **Jangan membandingkan nama yang diketik** dengan nama entri — `Tebusan` adalah **alias** dari
   entri `Penebusan` (data asli) → ambil nama **entri**.
4. `execCommand('insertText')` menggeser kursor **beda antar browser** → untuk uji kursor pakai
   ketikan sungguhan (`beforeinput` + `insertData`).
5. Beri jeda **> 900 ms** (tunda penandaan otomatis editor) di antara langkah uji kursor — kalau
   tidak, ada penandaan liar yang ikut membongkar tanda.
   (Tambahan dari butir a: `Bul` **memang** istilah 3 huruf → tetap ditandai; **jangan menebak isi kamus**.)

**🧪 Uji:** `tools/uji-cepat.js` → **135 uji, 0 gagal** (±70 detik).
Uji penuh 403 uji **belum** dijalankan (menunggu izin Bapak).
**📱 Versi HP:** ✅ **11,60 MB** (data kamus 133,6 KB ikut).

**Kontrak API `ANodesKamusTampilan`:** `hidupkan` · `bersihkan` · `caraTampil` · `pilihCara` ·
`simpanCaraTampil` · `bukaDaftar` · `bukaIstilah` · `tutupHalaman` · `kembaliKeCatatan` ·
`kembaliIstilah` · `tandaiSemua` · `bersihkanTanda` · `bersihkanHtml` · `hiasAyat` · `gambarPanel` ·
`tambahIstilahPribadi` · `hapusIstilahPribadi` · `daftarAntrian` ·
**K43:** `bukaFull` · `dariKamus` · `pulihDariAlkitab` · `segarkanTombolKembaliBaca` ·
`catatanBapak` · `simpanCatatanBapak`.
⚠️ **`caraTampil`/`pilihCara`/`simpanCaraTampil` WAJIB ADA** — kalau hilang, tombol pilihan di
halaman keterangan plugin **mati diam-diam** (pelajaran nyata dari plugin Ayat Terkait, K25).
🔑 Kunci localStorage: **`anodes-kamus-cara`** & **`anodes-kamus-pribadi`** — keduanya **wajib**
ada di `KUNCI_AMAN` alat uji.

### ✅ K54 — PENGUAT DITEMPATKAN PADA ALKITAB (✅ **SELESAI 22 Sep 2026**)

Bapak (21 Sep 2026): *"penguat ditempatkan pada alkitab.. jangan diproses dulu.. saya mau pastikan gambaran km sudah sama"*

**Jawaban Bapak:**
1. **(b) TOMBOL KECIL per ayat** — diklik baru terbuka · **“semua dan klik lagi tertutup untuk semua”**
2. **“ya tidak ada tombol penguat.. sejauh saya perhatikan selalu ada”** ⇒ tombol hanya di ayat
   yang punya penguat.
3. Halaman 🖊 Pembaca Penguat (**K47**) tetap ada.

**Pelaksanaan:** sambungan resmi **`tambahPenghias()`** (sudah dipakai 🔗 Ayat Terkait & 📚 Kamus) →
`hiasAyatBaca()` · tombol di baris `.ayat-baca` (wadah `.pg-sisip`) + tombol **`🖊` di navbar**
(`baca-penguat`, kontrak `tombol[]`) · kotak `.pg-komentar` + `.pg-di-baca` (**latar krem,
huruf sebesar huruf Alkitab, ❌ tanpa garis cokelat**) · **SATU keadaan `semuaTerbuka` untuk
SELURUH pasal** · tombol 📖 (`#pg-alkitab`) di halaman pembaca penguat · berkas
`plugin/penguat/tampilan.js` + `plugin/penguat/plugin.js` + `plugin/alkitab/plugin.js` +
`index.html` + `css/app.css` · uji **K54-01…K54-20** (30 uji) · **418 uji, 0 gagal** ·
HP **24,59 MB** · penanda **`v21Sep-f`**.

🐞 **4 cacat nyata saat uji:** (1) tombol ditekan memakai `bersihkanBaca()` → wadah tombol
ikut terbuang ⇒ kotak tak pernah bisa dibuat → pakai **`tutupKotakPenguat()`** ·
(2) `jalankanPenghias()` memanggil diri sendiri ⇒ kotak baru langsung terhapus → pakai
**`jalankanPenghiasLain()`** · (3) penanda “sudah dihiasi” di **wadah** ⇒ pulang ke pasal sama
tombol tak digambar ulang → penanda dipindah ke **baris ayat** (`dataset.pgHias`) ·
(4) kotak baru tak ikut ditandai istilah (kamus mendaftarkan `hiasAyat` ke **ALKITAB**,
❌ bukan ke plugin penguat) → panggil **`jalankanPenghias()`** milik halaman baca saat kotak dibuka.
⚠️ Keempatnya **hanya ketemu lewat uji KLIK NYATA**.

⏭️ **Berikutnya:** **K45 i** — sistem plugin penguat yang menempel di catatan.

**🔄 KOREKSI PERILAKU 22 Sep 2026 (⚠️ versi pertama saya SALAH):**

> Bapak: *"karena klik penguat .. sebelum saya minta klik penguat.. **semua penguat tampil**
> dan klik lagi ayat penguat **hide**.. sekarang belum sesuai"*

| | Bentuk |
|---|---|
| ❌ **SALAH** (versi pertama) | tekan tombol ayat n ⇒ hanya kotak **ayat n** yang terbuka |
| ✅ **BENAR** (dipakai) | tekan `🖊` sekali ⇒ **SELURUH penguat pasal ini TAMPIL** · tekan lagi ⇒ **SELURUH HIDE** |

⇒ satu keadaan **`semuaTerbuka`** untuk **seluruh pasal** — semua tombol melakukan hal yang SAMA.
Tambahan: tombol **`🖊` di navbar halaman baca** (sebelah 📤) lewat `sakelarSemuaPenguat()`
(kontrak `tombol[]` di `plugin/alkitab/plugin.js`).
**Bukti:** 18 kotak ⇄ 0 · tombol navbar juga jalan · **418 uji, 0 gagal** ·
penanda **`v21Sep-e` → `v21Sep-f`** · HP **24,59 MB**.

**🔄 REVISI BAPAK 22 Sep 2026 (3 hal) — SUDAH DIKERJAKAN:**

| # | Permintaan Bapak | Perbaikan |
|---|---|---|
| **1** | *"ukuran font lebih kecil dari pada alkitab, kalau di samakan bisa ?"* | kotak penguat memakai **ukuran huruf ayat Alkitab** — dulu **12,5px** vs ayat **16px** ⇒ sekarang **16px** (`.baca-isi .pg-di-baca { font-size: inherit }`) |
| **2** | *"garis vertikal coklat kalau dihilangkan akan lebih besar ruang bacanya"* | **garis cokelat kiri DIHAPUS** (`border: 0`, semua sisi `0px`) · padding 8/10px ⇒ ruang baca lebih lebar · pembeda tetap **latar krem** `#faf6ec` (pola SAMA K51) |
| **3** | *"apakah ada kata istilah pada penguat.. kalau ada seharusnya bisa diklik dan pindah halaman istilah saja"* | kata istilah di penguat kini **ditandai & bisa diklik** (Yos 1:8 = **5 tanda**) ⇒ halaman istilah · 🏠 balik + sorot kuning · kotak tetap terbuka |

**🐞 Sebab butir 3 (diperiksa, ❌ bukan diduga):** plugin 📚 Kamus mendaftarkan `hiasAyat` ke
**ALKITAB** (halaman baca) — ❌ bukan ke plugin penguat (`hiasPenguat` hanya untuk halaman Pembaca
Penguat). Kotak penguat dibuat **sesudah** penghias Alkitab selesai ⇒ isinya terlewat.
**Perbaikan:** saat kotak dibuka, plugin penguat memanggil **jalur resmi** `jalankanPenghias()`
milik halaman baca ⇒ kamus ikut jalan. **Aman** karena `hiasAyatBaca` punya penjaga idempoten
(baris sudah dihiasi pasal ini ⇒ langsung keluar) ⇒ kotak yang baru dibuka **tidak** terhapus.
**Uji:** **418 uji, 0 gagal** (**K54-12 · 12b · 12c · 17 · 17b · 18 · 19 · 20** baru) ·
penanda penguat **`v21Sep-e` → `v21Sep-f`** · HP **24,59 MB**.

### ✅ K55b — 📖 SEJARAH KITAB DIJADIKAN **PLUGIN SENDIRI** — ✅ **SELESAI 22 Sep 2026** (450 uji, 0 gagal)

Bapak: *“sejarah apakah bisa di buatkan plugin seperti orderan saya tadi”* ⇒ ✅ **bisa — dan lebih rapi.**
Bapak memilih **bentuk B** = plugin sendiri dengan **tanda di halaman baca** (pola SAMA seperti 🖊 Penguat K54).
Bentuk halaman mandiri (*“pilih kitab ▾ → langsung panel”*) ✅ **disetujui Bapak** ⇒ dikerjakan sebagai **K55c**.

```text
SEBELUM (K55)                          SESUDAH (K55b)
🧩 📖 Alkitab                          🧩 📖 Alkitab          (bersih — ❌ tidak tahu sejarah)
   └ fitur 📖 sejarah di dalamnya      🧩 📖 Sejarah Kitab    ← PLUGIN SENDIRI
        · mesin + data + tampilan           ├ mesin  plugin/sejarah/sejarah.js
        · tombol di halaman keterangan     ├ data   plugin/sejarah/data/sejarah.js (98,1 KB)
                                            ├ tanda  tombol 📖 sejarah di PASAL 1
                                            │        (lewat tambahPenghias() — ❌ tanpa mesin baru)
                                            └ [📖 sejarah] di halaman keterangannya SENDIRI
```

| Butir | Pekerjaan | Status |
|---|---|---|
| **a** | Pindahkan mesin + data + tampilan ke `plugin/sejarah/` (4 berkas) + kartu plugin | ✅ **22 Sep 2026** |
| **b** | Bersihkan plugin 📖 Alkitab (buang `pasangSejarah` · `gambarSejarah` · `bukaSejarahAlkitab` · `tombolInfo`) | ✅ **22 Sep 2026** — Alkitab `VERSI` → **`v22Sep-b`** (uji **K55-01d**) |
| **c** | Halaman **mandiri** (pilih kitab ▾ → langsung panel) — ✅ **disetujui Bapak** | ⬜ **berikutnya (K55c)** |
| **d** | Uji **K55** (35 uji) + build + 5 dokumen | ✅ **22 Sep 2026** — **450 uji, 0 gagal** · HP **24,76 MB** |

**Berkas:** `plugin/sejarah/{plugin,sejarah,tampilan}.js` + `plugin/sejarah/data/sejarah.js` ·
`plugin/alkitab/tampilan.js` (dibersihkan) · `plugin/alkitab/plugin.js` (`tombolInfo` dibuang) ·
`index.html` (3 tag `<script>` baru) · `tools/buat-1-berkas.js` (jalur data baru) ·
`tools/uji-cepat.js` (**K55-01b/01c/01d · 19b · 20/20b/20c**).

**Bukti penting:** `ANodesPlug` memuat **`sejarah`** · kartu **📖 Sejarah Kitab** di gudang ·
Alkitab BERSIH (`gambarPasal` ❌ tidak menyebut sejarah) · tombol muncul di Kejadian 1 ·
panel + ayat kunci (Kejadian 1:1 · 12:3 · 50:20) · **plugin DILEPAS ⇒ tombol & panel 0,
isi Alkitab & catatan UTUH** (**K55-20/20b**) · dipasang lagi ⇒ tombol muncul (**K55-20c**).

**🐞 Cacat nyata yang ketemu saat uji (WAJIB diingat):**

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | **Tidak ada `siapkanOtomatis()`** — `saatDipasang` hanya jalan saat tombol **Pasang** ditekan | kalau halaman **dimuat ulang** (plugin tetap terpasang) ⇒ tombol 📖 sejarah **TIDAK muncul** & mesin `siap=false` | `tampilan.js` ditambah **`siapkanOtomatis()`** dipanggil saat `DOMContentLoaded` (pola SAMA `ANodesAlkitab.siapkanOtomatis()` K14) · uji **K55-01e** |
| 2 | Penanda idempoten di **wadah** `#baca-isi` (`dataset.sejarahHias`) | isi wadah diganti tetapi atribut tetap ⇒ tombol tidak digambar ulang saat pulang ke pasal yang sama | buang penanda saat isi diganti (pelajaran SAMA seperti K54) |

**⚠️ Pelajaran:** plugin bisa **dipindah utuh** tanpa mesin baru karena sambungan resmi
**`tambahPenghias()`** sudah disiapkan sejak K25 — Alkitab tidak perlu tahu plugin lain ada.
Asas “plugin bisa dicabut” diuji dengan **LEPAS plugin nyata**.
🔴 **Setiap plugin baru WAJIB punya `siapkanOtomatis()`** — tanpa itu, setelah halaman dimuat
ulang plugin tampak “tidak berfungsi” walau statusnya terpasang.
⚠️ **DIPERBARUI K55d (22 Sep 2026):** pendaftaran hiasan **dipindah ke BAR PINTASAN** —
sejarah · penguat · ayat-terkait kini memakai **`daftarPintasan()`** (lihat blok **K55d** di atas).

### ✅ I-15 — 🎛 **TOMBOL SEJAJAR (GAYA C)** — ✅ **SELESAI 22 Sep 2026** (465 uji, 0 gagal)

> Bapak: *“yg penting satu baris / sejajar.. itu lebih rapih terlihat.. icon itu bisa mewakili
> artinya icon tidak bisa dipakai hal lain.. jadi pilihan saya **C** saja.. sejajar dan rapih”*

Bapak lebih dulu minta **contoh di Kej 1:1 saja** (*“jangan sentuh yg lain.. setelah sudah benar..
 diterapkan keseluruhan”*) ⇒ dibuat alat sementara `tools/contoh-baris.js` + bilah `[A][B][C]`.
Bapak memilih **C**: ❌ bukan memindahkan tombol, tetapi **membuatnya sejajar**.

```text
SEBELUM (58 baris tombol di Kejadian 1)          SESUDAH (gaya C)
1  Pada mulanya Allah menciptakan ……        1  Pada mulanya Allah menciptakan
   [ 🖊 penguat ]                                langit dan bumi.   🖊  🔗62
   [ ayat terkait (62) ]                     2  Bumi belum berbentuk …  🖊  🔗8
```

| Hal | Pelaksanaan |
|---|---|
| Tombol penguat | **ikon saja** `🖊` — kata dibuang; arti tetap di `title` + `aria-label` |
| Tombol ayat terkait | **ikon + angka** `🔗62` (`segarkanTandaGrup` menulis ulang tulisan) |
| Wadah | `.pg-sisip` & `.at-hias` jadi **`inline`** — ❌ **pakai `inline`, BUKAN `flex`** |
| Mode grup (K37) | **tetap pakai kata** (`ayat terkait (n)`) — saat menyusun beberapa ayat perlu jelas |
| Berkas | `plugin/penguat/tampilan.js` (`v22Sep-b`) · `plugin/ayat-terkait/tampilan.js` (`v22Sep-d`) · `css/app.css` |

**Bukti (Chrome nyata + versi HP — Kejadian 1):** tinggi ayat **138 → 72 px (–48 %)** ·
tinggi pasal **6.945 → 5.139 px (hemat 26 %)** · tombol **31 🖊 + 27 🔗** (tetap per ayat) ·
klik 🖊 ⇒ seluruh penguat tampil · klik 🔗 ⇒ daftar kaitan · **465 uji, 0 gagal** ·
HP **24,82 MB**.

**🐞 CACAT NYATA (jangan diulang):** (1) menyembunyikan tulisan via CSS `font-size:0` + `::before`
⇒ emoji **tetap tergambar** (**“🖊🖊 penguat”**) → tulisan diganti lewat **JS** ·
(2) “menempel di ujung” dengan `display:flex` ⇒ ayat justru **makin tinggi** (187 vs 138 px) →
pakai **`inline`**.

⚠️ **PELAJARAN:** kalau Bapak bilang “rapikan”, coba dulu **cara TERKECIL** (CSS + tulisan tombol).
**Bikin contoh di SATU tempat** dulu kalau Bapak ragu ⇒ Bapak bisa membandingkan & memilih.
⚠️ Kode **bar pintasan** masih ada tetapi tidur (`PINTASAN_HIDUP = false`) — ❌ jangan dihapus.

### ❌ K55d — 🎛 **BAR PINTASAN DI HALAMAN BACA** — **DIBATALKAN 22 Sep 2026** (457 uji, 0 gagal)

> Bapak: *“saya salah menjawab pertanyaan km.. tadi tujuan saya hanya merapihkan menu yg mengambil
> space kebawah terlalu banyak.. **seharusnya perayat ada ayat kaitannya konsep awal itu sudah benar
> seharusnya secara konsep tidak berubah**.. tujuan saya hanya mau merapihkan menu.. apakah bisa
> dikembalikan ke sebelum perubahan”*
> ⇒ **K55d DIBATALKAN** — seluruh tombol **KEMBALI PER AYAT** (keadaan **K55b**).

| Hal | Dikembalikan ke | Penanda versi |
|---|---|---|
| `plugin/penguat/tampilan.js` | tombol `🖊 penguat` **per ayat** (`wadahPenguat` · `.pg-sisip` · `.pg-baca-toggle`) | **`v22Sep-a`** |
| `plugin/ayat-terkait/tampilan.js` | tombol `ayat terkait (n)` **per ayat** di `.at-hias` · akar rantai dari `.at-hias[data-asal]` | **`v22Sep-c`** |
| `plugin/sejarah/tampilan.js` | tombol `📖 sejarah` di **barisnya sendiri** (`.ay-sejarah-baris`) — tetap **hanya pasal 1** | **`v22Sep-d`** |
| `plugin/alkitab/tampilan.js` | **bar pintasan DIMATIKAN** (`PINTASAN_HIDUP = false`) | **`v22Sep-d`** |

**Bukti (Kejadian 1 · Chrome nyata + versi HP):** bar pintasan ❌ **tidak ada** ·
`🖊 penguat` per ayat ✅ **31** · `ayat terkait (n)` per ayat ✅ **27** ·
baris `📖 sejarah` ✅ 1 baris di bawah “31 ayat” · ayat 1 = `🖊 penguat` + `ayat terkait (62)` ·
**457 uji, 0 gagal** · HP **24,80 MB** · backup `backups/k55d-dibatalkan-20260922-211823/`.

⚠️ **PELAJARAN:** **jangan menyimpulkan maksud pengguna dari SATU kalimat singkat.**
Kalau ragu → **tanyakan dulu gambaran yang benar**, ❌ jangan langsung mengubah **KONSEP**.
Merapikan tampilan **tidak boleh menghilangkan** cara kerja yang sudah disetujui.

📌 **Yang MASIH belum diselesaikan — I-15 (papan C. IDE):** tujuan asli Bapak = tombol yang
menumpuk tiap ayat (Kejadian 1 = 58 baris) supaya **tidak memakan ruang ke bawah**.
❌ BUKAN dengan memindahkan tombol ke bar atas (itu K55d). ⇒ kerjakan **cara lain** &
**TANYA DULU** (mis. tombol dibuat satu baris rapat · chip kecil sejajar nomor ayat).

⚠️ **Kode bar pintasan MASIH ADA** (`daftarPintasan` · `lepasPintasan` · `segarkanPintasan` ·
`.ay-pintasan`) tetapi tidur karena **`PINTASAN_HIDUP = false`** — jangan dihapus.

### ✅ K55 — 📖 SEJARAH KITAB (artikel pemanis bacaan) — ✅ **SELESAI 22 Sep 2026** (441 uji, 0 gagal)

Bapak: *“alkitab saya ingin menambahkan penulisan artikel pemanis — user hanya membaca
**Pengantar Sejarah Alkitab**.. user perlu mengenal masing2 sejarah kitab.. contoh **kej 1:1
ada tombol [sejarah]** diklik ⇒ info sejarah kejadian ditampilkan, dan ini untuk kesemua
kitab hingga perjanjian baru · untuk **sejarah alkitab keseluruhan** ditempatkan pada
**gudang plugin -> alkitab ada tombol [sejarah]**”*

**🔎 Temuan (diperiksa, ❌ bukan diduga):** data sejarah **SUDAH ADA** — `C:\data\bible\data\kitab.json`
memuat **66/66 kitab** dengan 7 kunci (`nama`·`singkatan`·**`penulis`**·`kategori`·`perjanjian`·
**`tahun`**·**`sejarah`**) · `sejarah` **692–971 huruf** · total **54.748 huruf** · **0 kosong** ·
bahasa Indonesia ⇒ ❌ **tidak perlu eBook / terjemahan**.

**Tambahan saya (disetujui Bapak “bisa dikombinasikan”) — ditulis 66 kitab sekaligus:**

| # | Tambahan | Bentuk |
|---|---|---|
| 1 | 🎯 **Inti kitab** | 1 kalimat (paling atas) |
| 2 | 💡 **Tema utama** | 3–4 frasa pendek |
| 3 | 👤 **Tokoh utama** | 3–5 nama |
| 4 | 🔑 **Ayat kunci** | 2–3 rujukan — **BISA DIKLIK** ⇒ langsung ke ayat itu |

**Bentang kerja:**

```text
HALAMAN BACA — Kejadian 1
 [ 📖 sejarah ]   ← TOMBOL, HANYA di PASAL 1 (semua 66 kitab)
      │ diklik
      ▼  panel turun di bawah judul pasal:
   🎯 inti → 🏷️ penulis/tahun/kategori/perjanjian → 💡 tema → 👤 tokoh
   → 📜 sejarah → 🔑 ayat kunci (DIKLIK ⇒ pindah ke ayat itu)
      │ tombol ditekan LAGI
      ▼  panel TERTUTUP

🧩 GUDANG PLUGIN → 📖 Alkitab
   “Bacaan tambahan” → [ 📖 sejarah ]     ← kontrak BARU `tombolInfo[]`
      │ diklik
      ▼  HALAMAN BACA — “📖 Pengantar Sejarah Alkitab”
         66 chip kitab per kategori + teks 15.356 huruf
         chip kitab diklik ⇒ PASAL 1 kitab itu
```

**Pelaksanaan (❌ tanpa mesin baru untuk tampilan):**

| Hal | Pelaksanaan |
|---|---|
| Alat data | `tools/siapkan-data-sejarah.js` — `kitab.json` + `tools/tambahan-sejarah-kitab.js` + `cat\Pengantar Sejarah Alkitab…md` ⇒ `plugin/alkitab/data/sejarah.js` (**98,1 KB**) |
| Mesin | `plugin/alkitab/sejarah.js` (BARU) — `window.ANodesSejarah`: `muat`·`siap`·`meta`·`kitab(n)`·`semua`·`ada(n)`·`pengantar`·`adaPengantar`·`jumlahKitab`·`kelompok()`·`ketikaSiap`/`saatSiap` + simpanan IndexedDB kunci **`sejarah`** |
| Tombol | `tampilan.js → pasangSejarah()` dipanggil **hanya kalau `Number(noPasal) === 1`** |
| Panel | `gambarSejarah(k,…)` — urutan **🎯 → 🏷️ → 💡 → 👤 → 📜 → 🔑** · gaya krem `#faf6ec` |
| Ayat kunci | memakai **`bukaAyatDariLink()`** yang SUDAH ADA (❌ bukan mesin baru) |
| Pengantar | `bukaSejarahAlkitab()` di **halaman baca** (pola SAMA dengan hasil pencarian) |
| Tombol di gudang | **kontrak BARU `tombolInfo[]`** di `js/plugin.js` (halaman keterangan plugin boleh punya tombol tambahan) · pengait klik **WAJIB memanggil `tutupGudang()`** |
| Aman | ❌ tidak mengubah catatan · plugin Alkitab dilepas ⇒ mesin sejarah dibersihkan (`saatDilepas`) |

**Bukti (Chrome nyata):** tombol **muncul di Kejadian 1** (**K55-08**) · ❌ **tidak muncul di pasal 2**
(**K55-15**) · panel terbuka lengkap (**K55-09…12**) · **klik ayat kunci ⇒ Kejadian 1:1** (**K55-13**) ·
tombol lagi ⇒ **tertutup** (**K55-14**) · gudang plugin punya tombol **📖 sejarah** (**K55-16/16b**) ·
pengantar **66 chip + 15.356 huruf** (**K55-17/17b/17c**) · catatan **tidak berubah** (**K55-18**) ·
**441 uji, 0 gagal** (blok **K55**: 29 uji) · penanda Alkitab **`v22Sep-a`** · HP **24,74 MB**.

**🐞 4 cacat nyata:** (1) ekor berkas sumber memuat **pertanyaan mesin obrolan** ⇒ alat data membuang
kalimat tanya terakhir bergaya obrolan (pengantar 15.577 → **15.356 huruf**); (2) label uji memuat
tanda **❌** ⇒ 2 gagal palsu; (3) panel gudang memakai **kelas `.buka`** ❌ bukan `hidden` ⇒ tutup
dengan `ANodesPlugin.tutupGudang()` saat menguji; (4) **tombol `[📖 sejarah]` di halaman keterangan
plugin TIDAK menutup panel gudang** (ketemu saat Bapak minta uji Kej 1:1 di `ANodes-1berkas.html`) ⇒
pengait klik `tombolInfo[]` ditambah **`tutupGudang()`** · uji baru **K55-16c0/16c/16d**.

### ✅ K51 butir c+d — BLOK ISTILAH + `＋ Istilah` ke CATATAN (21 Sep 2026) — 388 uji, 0 gagal

Bapak: *"metode sama seperti ayat terkait .. kebawah terus.. dengan head "suci;kudus" dan
disimpan bisa dipaste ke catatan"*.

**Pola SAMA dengan 🌿 Ayat Terkait (❌ tanpa mesin baru):**
1. Tiap kolom istilah punya tombol **`✓ pilih`** → keterangan jadi **BLOK TETAP**
   (`pilihKolom()`, wadah `#kamus-blok-wadah`).
2. Blok memuat **chip istilah lanjutan** → rantai bisa diteruskan dari dalam blok
   (`istilahDalamTeks()`, `levelDariChip()` mengenal `.kamus-blok`).
3. **HANYA level itu** yang diganti saat `✓ pilih`; turunan dibuang di
   `tampilkanKeteranganIstilah()` (saat KEPALA diganti).
4. Tombol **`＋ Istilah`** (`#kamus-kirim-istilah`) → `kirimIstilahKeCatatan()` →
   **jalur K40** (`ANodesEditor.terimaPaket` / `tempelPaket`).
5. Kepala (head) = istilah utama (`namaAkarIstilah()`), baris pertama teks kiriman.

**Cacat nyata:** turunan ikut terhapus saat `✓ pilih` → blok berlevel tak pernah bisa disusun.

**Penanda versi:** kamus **`v21Sep-g`** · **Uji:** **K53-01…K53-13** (16 uji) →
**388 uji, 0 gagal** · HP **25,12 MB** · backup `backups/k51-blok-istilah-20260921/`.
✅ **K51 TUNTAS (a+b+c+d).**

### ✅ K52 — TAUTAN ISTILAH DI HALAMAN BACA & PENGUAT (21 Sep 2026) — 372 uji, 0 gagal

Bapak: *"Yos 1:8 ada kata taurat <- kamus istilah sudah ada link tapi di klik tidak fungsi"*.

**SEBAB (diperiksa di Chrome):** penandaan istilah di `#baca-isi` **sudah jalan** (13 tanda),
TETAPI **pengait klik hanya dipasang di `#editor`** → span di `#baca-isi` & `#pg-isi` **MATI**.
Halaman 🖊 Penguat malah **0 link** (teks ditulis `textContent`).

**Perbaikan (4 butir):**
1. **a** `pasangKaitHalaman(wadah, jenis)` — satu pengait delegasi untuk `#baca-isi` (`baca`)
   & `#pg-isi` (`penguat`) → klik = **pindah halaman istilah**.
2. **b** chip "📚 Istilah di pasal ini" **bisa diklik** (pengait langsung di chip).
3. **c** halaman penguat dapat **sambungan resmi** `tambahPenghias()` / `jalankanPenghias()`
   (pola SAMA plugin Alkitab) → teks **AYAT + PENGUAT** ditandai (**45 tanda**).
4. **d** `asalHalaman` + `ingatAsalHalaman()` + `kembaliKeHalamanAsal()` → tombol 🏠
   balik ke **halaman asal** (baca/penguat) **+ SOROT KUNING** · label ikut berubah
   ("kembali ke bacaan" / "kembali ke penguat").

⚠️ **WAJIB:** `tutupHalaman(kembaliKe)` — `bukaHalaman()` menyembunyikan SEMUA `body > .app`,
jadi halaman asal **harus dimunculkan ulang** di situ.

**Cacat nyata:** `ingatAsal(null)` bikin `TypeError` (`Cannot read properties of null`) →
klik tidak berbuat apa-apa. Ketemu **hanya** karena uji **KLIK NYATA + `window.onerror`**.

**Penanda versi:** kamus **`v21Sep-f`** · penguat **`v21Sep-c`** ·
**Uji:** **K52-01…K52-12** (18 uji) → **372 uji, 0 gagal** · HP **25,10 MB** ·
backup `backups/k52-link-baca-penguat-20260921/`.

### ✅ K51 — KOLOM ISTILAH **BERLEVEL** (butir a+b + 3 revisi · 21 Sep 2026) — 354 uji, 0 gagal

> Permintaan Bapak: *“misal link suci ← klik … muncul kolom dibawah isi ayat kel 28:36 ·
> ide ini juga berlaku pada kamus istilah … [Yehuwa][Ibrani][Kristen] klik … muncul bergantian
> pada kolom yg sama”*

**Jawaban Bapak 1–7:**

| # | Jawaban |
|---|---|
| 1 | ✅ **DUA KOLOM TERPISAH** — *“kolom ayat no.1 dan kolom no.2 istilah”* |
| 2 | ✅ Judul/head **tetap** (*“kudus;suci itu “head” harus ada”*) |
| 3 | ❌ kotak tanggal/jam & ➤ **bukan bagian revisi** (sudah diperiksa di browser: **tidak ada** di ANodes) |
| 4 | ✅ *“metode sama seperti ayat terkait .. kebawah terus.. dengan head “suci;kudus” dan disimpan bisa dipaste ke catatan”* ⇒ butir **c–d** |
| 5–7 | ✅ 📋 Daftar · 🔍 Cari · [full] · **garis putus-putus** semua **tetap** |

### 🔴 REVISI BAPAK (versi pertama SALAH — “menimpa”)

> *“klik Ibrani -> ada 4 istilah didalam ibrani: Yakub Aram Kristus Murid <- klik Yakub **sekarang
> menimpa dikolom Ibrani seharusnya kolom baru dibawahnya** … jadi ada 2 kata istilah dengan
> **level 0=head level 1-> ibrani Level2= yakub · perlevel per kolom · sama dengan ayat** ..
> jadi **ditimpa pada level yg sama** konsepnya”*

```text
LEVEL 0 = head  "Ibrani"
  └─ LEVEL 1  [Yakub]  → kolom Yakub
       └─ LEVEL 2  [Israel] → kolom Israel   ← DI BAWAH, bukan menimpa
            └─ LEVEL 3  … terus ke bawah
  klik [Aram] (level 1) → menimpa kolom LEVEL 1 saja
```

| Fungsi baru (`plugin/kamus/tampilan.js`) | Tugas |
|---|---|
| **`buatKolomIstilah(nama)`** | membuat **isi** satu kolom keterangan |
| **`tampilKeteranganIstilah(nama, chip, level)`** | menyisipkan kolom di **level** tertentu |
| **`buangKolomDari(tunas, level)`** | membuang kolom level **≥ n** saja (level di atas tetap) |
| **`levelDariChip(el)`** | level = level kolom induk + 1 |
| **`#kamus-istilah-tunas`** | wadah kolom bertumpuk |
| 🐞 **kait klik `span.kamus-ist-link`** | **tautan di dalam keterangan DULU MATI** |

### 🔴 REVISI ke-2 — KOLOM JANGAN DIKECILKAN

> *“hanya revisi kolom baru **jangan dikecilkan**.. saya tau tujuan untuk menandakan turunan..
> tapi jika ditampil di HP jadi kecil ruang tulisannya apalagi saya besarkan size font..
> jadi **ukuran kolom tetap diukuran pas layar**.. **boleh beri tanda saja**”*

⇒ ❌ **JANGAN pakai `margin-left`/indent** untuk menandai turunan ·
✅ **kolom SELALU selebar layar** · turunan ditandai **BADGE “Tingkat n”** (`.kamus-level-tanda`)
+ garis kiri makin gelap.
✅ **Terukur:** lv1 = lv2 = wadah (**354px** PC · **306px** layar 420px) · `margin-left: 0`.

**Penanda versi:** `plugin/kamus/tampilan.js` → **`v21Sep-e`** ·
💾 backup `backups/k51-tanpa-garis-hijau-20260921/`.
**Uji:** **K51-01…K51-17 + 11b/11c/17b** · uji lama disesuaikan (`K42a-06` · `K42d-08/08b/09/10`).
🔴 **Revisi ke-3 (21 Sep):** garis vertikal hijau (`border-left` tebal) **DIHAPUS** — kolom jadi
lebih lebar (lebar isi **304px**) · `border` keempat sisi **1px tipis** · penanda tingkat = **BADGE “Tingkat n”**.
✅ **Terbukti di Chrome:** `Ibrani → Yakub (L1) → Israel (L2) → Yakub (L3)` — 3 kolom menumpuk.
⏭️ **Sisa:** butir **c** (blok tersendiri + tombol `✓`) · butir **d** (simpan + paste ke catatan).

### ✅ K50 — TAUTAN ISTILAH “TIDAK DITEMUKAN” (21 Sep 2026) — 14 uji, 0 gagal

> Laporan Bapak: *“ada link tapi tidak ada isinya contoh kata suci ada link di klik → pesan
> **”istilah ”Kudus;Suci”tidak ditemukan”** · berkas uji: `cat/exp md/Pengantar Sejarah Alkitab.md`”*

**Sebabnya (diperiksa, ❌ bukan diduga): isi kamus TIDAK hilang** — masalahnya di **pengenal kata**.

| Hal | Keadaan |
|---|---|
| Setiap tautan menyimpan | `data-istilah` = **NAMA RESMI entri** (`{nama, alias[]}`), mis. `Kudus; Suci` |
| Aturan LAMA | `HANYA_HURUF = /^[A-Za-z ]+$/` → hanya **huruf + spasi** |
| Akibat | nama resmi bertanda `;` `(` `)` `-` **tidak pernah masuk `petaTulisan`** ⇒ `istilah("Kudus; Suci")` = **`null`** ⇒ halaman arti tidak bisa dibuka (padahal isinya ADA 756 huruf) |

**Terukur: 23 entri kena** — 17 (tautan ada, klik gagal) + 6 (tidak terdeteksi:
`Hakim-hakim` · `Hari-hari terakhir` · `Kapal-kapal Tarsyis` · `Mut-laben` · `Orang-orang suci` · `Sida-sida`).

| Perbaikan | Pelaksanaan |
|---|---|
| **`petaNama`** (BARU) | peta **NAMA RESMI → entri** (semua nama, walau bertanda baca) · `istilah()` = `petaTulisan.get(k) \|\| petaNama.get(k) \|\| null` ⇒ **tautan tidak pernah mati** |
| **Tanda hubung** | `const HANYA_HURUF = /^[A-Za-z][A-Za-z -]*$/` — diselaraskan di **`kamus.js`** · **`tampilan.js`** · **`tools/siapkan-data-kamus.js`** |
| **Kamus pribadi** | `siapkanPetaPribadi()` — nama resmi **selalu** didaftarkan |
| **`saatDilepas()`** | ikut membersihkan `petaNama` |

| Ukuran | Sebelum | Sesudah |
|---|---|---|
| Tulisan siap deteksi | 427 | ✅ **437** |
| Entri yang tidak bisa diklik | ❌ **23** | ✅ **0** |
| Berkas Bapak | banyak gagal | ✅ **44 istilah → 0 gagal · 0 arti kosong** |

- 🏷️ Penanda versi `plugin/kamus/tampilan.js` → **`v21Sep-a`** · 💾 backup `backups/kamus-link-kosong-20260921-184444/`.
- ⚠️ **PELAJARAN:** kalau ada **DUA sumber nama** (nama resmi vs alias), pencarian **WAJIB** mengenal
  **keduanya** — **nama resmi itulah yang disimpan di setiap tautan**.

### ✅ K43 — REVISI KAMUS (18 Sep 2026) — 150 uji, 0 gagal

> Bapak: *“ini sudah benar.. **harus ada garis putus2 seperti ini.. garis putus2 penting ..
> jangan di hilangkan**.. 1. kolom melengkapi keterangan **terpisah**, di **atas tombol kembali** ..
> 2. tombol **[full]** disamping ayat → **lompat ke alkitab**, dan **bisa lompat kembali**”*

⚠️ **GARIS PUTUS-PUTUS JANGAN DIHILANGKAN** — cara tampil bawaan tetap **`'putus'`**.

| Butir | Pelaksanaan |
|-------|-------------|
| **a** 📝 kolom catatan Bapak | `gambarArti()` menyisipkan blok `📝 catatan Bapak` **sebelum** tombol `.kamus-kembali-besar` · simpan ke **kamus pribadi** field **`catatan`** (❌ **BUKAN** `arti`) · `entriUntukHalaman()` menggabung: **keterangan bawaan + catatan Bapak** kalau entri pribadi tidak punya arti sendiri |
| **b** ↗ tombol `[full]` | tiap chip ayat dibungkus `.kamus-ay-bungkus` (chip + `[↗ full]`) · `bukaFull(ref,nama)` → `ANodesAlkitabTampilan.bukaAyatDariLink()` · sementara itu simpan penanda **`asalKamus`** + ubah `#baca-kembali` jadi **📚** |
| **b** kembali | `plugin/alkitab/tampilan.js → kembali()` **memeriksa dulu** `ANodesKamusTampilan.dariKamus()` → kalau ya, **delegasikan** ke `pulihDariAlkitab()` (buka istilah lagi + tampilkan lagi ayatnya) · kalau tidak → alur lama (catatan + sorot kata) |

⚠️ **3 pelajaran (jangan diulang):**
1. Catatan Bapak **wajib** di field `catatan`, ❌ bukan `arti` — kalau salah, keterangan kamus
   tertimpa jadi “belum ada keterangan”.
2. Penanda `asalKamus` **wajib** dibersihkan di `tutupHalaman()` · `bukaIstilah()` · `bersihkan()`
   — kalau tidak, label tombol kembali di halaman baca tertinggal jadi 📚.
3. **Alkitab tidak perlu tahu plugin Kamus ada** — `kembali()` bertanya dulu, Kamus yang tahu isinya.

### ✅ Butir a — HASIL (17 Sep 2026)

**Berkas baru:** `tools/siapkan-data-kamus.js` · `plugin/kamus/kamus.js` (mesin) ·
`plugin/kamus/plugin.js` (keterangan) · `plugin/kamus/tampilan.js` (**kerangka**) ·
`plugin/kamus/data/kamus.js` (hasil alat, **135 KB**).
**Berkas diubah:** `index.html` (3 tag `<script>` sebelum `js/plugin.js`) ·
`tools/buat-1-berkas.js` (menyisipkan `data/kamus.js` sebelum `</body>`).

**📊 Hasil terukur (sesudah K50, 21 Sep 2026):** **392 entri** · **437 tulisan siap deteksi** · **135 KB** · **0 dibuang**.
⚠️ Angka rencana (409/426) beda dari hasil (392/437) — sebabnya: **17 nama sama** di kedua berkas
(tambahan menang, tidak dobel) + tulisan dihitung **unik**. **Normal, bukan salah.**

**API mesin `ANodesKamus`:** `muat` · `siap` · `meta` · `istilah(tulisan)` · `adaIstilah` ·
`semuaIstilah()` · `cariIstilah(kata)` · `temukanIstilah(teks)` · `istilahDiTeks(teks,maks)` ·
`jumlahIstilah` · `jumlahTulisan` · `ketikaSiap` · `padaSiap` · `saatSiap` · `dipasang` ·
`saatDilepas` · `siapkanOtomatis`.

**Gudang:** IndexedDB `anodes-plugin-db` / toko `data` / kunci **`kamus`** (gudang sama dengan
`alkitab-tb` & `silang`, kunci beda).

**Uji:** **K42a-01…K42a-21** → **87 uji, 0 gagal** (`tools/uji-cepat.js`, ±20 detik).
**Versi HP:** ✅ **11,53 MB** — data kamus ikut disatukan & terbaca (**392 entri · 437 tulisan**).

⚠️ **2 PELAJARAN UJI (kesalahan UJI, bukan kode):**
1. **K40-09** bergantung keadaan sebelumnya — `opsiPaketCatatan` dibaca **SEKALI** saat halaman
   dibuka, jadi `localStorage.removeItem` **tidak** mengembalikannya → uji harus memastikan
   **mulai dari MATI** dulu.
2. **K42a-11** salah harapan — `Bul` **memang** istilah 3 huruf → harus **tetap** ditandai;
   yang dilewati hanya `Ab` (2 huruf). **Jangan menebak isi kamus.**

⚠️ **PELAJARAN KECEPATAN:** jangan menunggu uji dengan **menebak waktu** berulang kali —
pakai **polling** sekali. Uji cepat sekarang **87 uji ±20 detik**; sebut angka itu di awal.

⚠️🖥️ **TAMPILAN — ketentuan Bapak 17 Sep 2026 (GANTI “panel kecil”):**

**Bapak:** *“urusan UI tidak sama harus disesuaikan dengan UI ANodes · catatan menemukan kata
(istilah) ada link dan diklik → tampil kata dan keterangannya · **tampilannya sama ukuran
layar** .. atau **menimpa catatan tapi diberi back** · dan harus bisa **kembali ke baris kalimat
atau kata** ketika di klik · dan setiap istilah kadang didukung ayat, posisinya **setelah** pada
layar kamus istilah dan keterangan, **dibawah adalah tampilkan ayat dengan konsep seperti ayat
terkait** · **ayat diklik tampil dikolom yg sama**”*

⇒ **HALAMAN PENUH** (`.app` 480px) yang **menimpa catatan** — ❌ **bukan** panel/kotak kecil.
Ini halaman **ke-4** (`#kamus-halaman`, sejajar `#app-utama` / `#baca-alkitab` / `#kerja-ayat`).

```
① CATATAN   … ia mempersembahkan KORBAN di MEZBAH …   ← garis putus-putus
                            │ diklik
                            ▼
② HALAMAN KAMUS 📚 — MENIMPA catatan (seukuran catatan, 480px)
   [🏠]  📚 Istilah: KORBAN                        [🔍] [↩]
   ─────────────────────────────────────────────────────
   1️⃣ KETERANGAN (bisa digulir — arti terpanjang 1.324 huruf)
      “Persembahan yang dipersembahkan… (Kel 21:29; Im 1:2) …”
      📚 istilah lain: [Mezbah] [Imam] [Sabat]      ← diklik = pindah istilah
   2️⃣ 📖 AYATNYA (2)
      [Kel 21:29] [Im 1:2]                          ← chip ayat
      ┌───────────────────────────────────────────┐
      │ 29 Tetapi jika lembu itu…                 │ ← SATU kolom, ganti-ganti
      │ [📖 ayat terkait (9)]                     │ ← konsep sama K25
      └───────────────────────────────────────────┘
   [🏠 kembali ke catatan]  ← gulir balik + KATA itu DISOROT KUNING ±4 dtk
                            │ 🏠
                            ▼
③ CATATAN lagi — di baris itu, kata disorot kuning
```

**Aturan tetap:**

| Hal | Ketentuan |
|-----|-----------|
| Ukuran | **sama persis dengan catatan** (`.app` 480px) — ❌ bukan popup, ❌ bukan panel samping |
| Cara tampil | **menimpa catatan** (`#app-utama` disembunyikan, `#kamus-halaman` muncul) |
| Urutan isi | 1️⃣ keterangan → 2️⃣ kolom ayat (**ayat di BAWAH keterangan** — ketentuan Bapak) |
| Kembali | `🏠` ⇒ catatan + **gulir ke baris & sorot KATA itu** ±4 detik (pola `ingatAsal`/`kembaliKeCatatan` K25 e) |
| Berantai | klik istilah lain ⇒ **halaman pindah** (❌ tidak menumpuk) · `↩` kembali ke istilah sebelumnya (**riwayat 30 langkah**) |
| Ayat di dalam arti | **tautan** → diklik ⇒ ayat **muncul di KOLOM AYAT** (❌ tidak meninggalkan halaman) |
| Kolom ayat | **SATU kolom, ganti-ganti** (satu slot seperti pratinjau lab2) · isinya **teks ayat saja** · bisa digulir |
| Halaman dipakai ulang | **satu** `#kamus-halaman` — isi diganti, ❌ jangan buat halaman baru tiap klik |
| **SEDERHANA** ⭐ | halaman kamus **hanya** menerangkan istilah + menampilkan ayat pendukung. ❌ **TIDAK ada penelusuran ayat terkait di sini** |

⏸️ **DITANGGUHKAN (keputusan Bapak 17 Sep 2026):** tombol `[📖 ayat terkait (n)]` **di halaman kamus**
— Bapak: *“sebenarnya bagus. tapi **sementara ditangguhkan untuk masuk ke ayat terkait**.. alasannya
menjadi **keluar fokus user** dan **sistem jadi kompleks**. harus **sederhana tapi canggih** menolong
untuk penggalian”*. ⇒ Halaman kamus **tetap ramping** (keterangan + kolom ayat + 🏠).

💡 **IDE PENGGANTI (DIPISAH — ❌ jangan dikerjakan sekarang): 📌 TANDA / BOOKMARK AYAT**
Bapak: *“user bisa **beri tanda** untuk nanti dia akan telusuri — jadi dia beri tanda seperti
**bookmark**.. nanti dia ke **[doc] → ayat terkait → pilih bookmark** ada ayat cuma satu dengan
keterangan.. disana dia bisa telusuri ayat terkait.. ini baru ide · **jangan masuk dalam proses** ·
**dipisah**”*

```
SEDANG MENULIS / MENGGALI ISTILAH
  ayat bertemu → tekan [📌 Tandai nanti]      ← 1 klik, TIDAK pindah halaman (fokus tidak pecah)
                          │ (kapan saja, nanti)
                          ▼
[Doc] → 🌿 Ayat Terkait → 📌 Bookmark
   📌 KEL 21:29 · “Tetapi jika lembu itu…” · dari istilah “Tebusan”
                              [🌿 Telusuri] [🗑]   ← BARU di sini ayat terkait dibuka
                          │
                          ▼  masuk SISTEM K25/K31 yang SUDAH ADA (❌ tidak ada mesin baru)
```

⇒ Rencana lengkap + 5 ide tambahan: **`rencanakerja.md` bagian 16.1d** · papan **C. IDE → I-13**.
⚠️ **4 hal harus diputuskan dulu:** ayat saja/istilah juga · tombol di mana saja ·
perlu catatan sendiri · taruh di [Doc] atau halaman sendiri.

**⚙️ Cara kerja mesin kamus (pondasi butir a — tulis PERSIS begini):**

```js
// 1. gabung: kamus.istilah + kamusTambahan.istilah  (tambahan MENIMPA kalau nama sama)
// 2. saring tiap alias: hanya /^[A-Za-z ]+$/ dan panjang >= 3 huruf  →  426 istilah
// 3. urutkan dari TERPANJANG  (supaya "Orang Samaria" menang atas "orang")
// 4. satu regex alternasi:  new RegExp('\\b(' + items.map(escapeRegExp).join('|') + ')\\b', 'gi')
//    → termMap: huruf-kecil  →  arti
```

⚠️ **Butir c — cara yang dipilih (dua plugin menandai satu editor, jangan diimprovisasi):**
1. daftar kelas bersama `window.ANodesTandaKelas = ['ay-link', 'kamus-istilah']`
2. **kedua** penanda melewati node bertanda **mana pun** dalam daftar itu
3. urut & sekali jalan: ayat dulu → istilah kemudian, lewat **satu** pintu di `js/editor.js`
4. **jangan** `normalize()` node yang memuat kelas tanda
5. kursor: `offsetKursor`/`pasangKursor` + **lewati hanya kata yang memuat kursor**
   (`kursorDi >= mulai && kursorDi < akhir`) — ⚠️ **jangan pernah** `replaceWith` node kursor
6. kalau gagal **2×** → **HENTIKAN** (aturan Bapak), pakai `pilihanTampil: 'tombol'`
   (tanpa garis putus) supaya fitur tetap berguna

**Data yang akan disentuh (perkiraan):** `index.html` · `css/app.css` · `js/editor.js` ·
`tools/siapkan-data-kamus.js` (**baru**) · `tools/buat-1-berkas.js` · `plugin/kamus/*` (**baru, 4 berkas**) ·
`plugin/alkitab/alkitab.js` (+3 `SEBUTAN`) · `plugin/alkitab/tampilan.js` (daftar kelas tanda) ·
`tools/uji-cepat.js` · dokumen 5 berkas.
❌ **TIDAK disentuh:** `terkait.js` · `silang.js` · `alkitab-tb.js` · `plugin/ayat-terkait/**` ·
folder `C:\data\bible` (**hanya dibaca**) · Lab 1/2/3.

---

## E. Peta Tahap

```
TAHAP 1 ✅  kerangka + note gaya markdown (kepala hitam, daftar atas, editor + toolbar)
TAHAP 2 ✅  simpan permanen (localStorage) + auto-save + kategori + pencarian + ekspor/impor
TAHAP 3 ✅  toolbar lengkap hemat ruang (dropdown) + hide + tabel + stabilo/warna/icon
            + markup ketik cepat
TAHAP 4 ✅  setting ⚙ (4 jenis font + ukuran 12-24 + kecerahan) + pintasan keyboard
            + ↶ Batal / ↷ Ulangi (undo/redo) + 📱 ANodes-1berkas.html untuk HP
TAHAP 5 ~  🧩 PLUGIN ALKITAB — tahap a–f + h SELESAI
            a = daftar + halaman info + Pasang/Lepas
            b = ⚠️ RIAWAYAT: baris bar plugin (bergantian) — sudah DIHAPUS 14 Sep 2026
                (K17). Sekarang cukup satu baris: toolbar tulis; plugin lewat 🧩.
            c = data Alkitab 5 MB (plugin/alkitab/data) + simpanan cepat IndexedDB
            d = nama ayat di catatan jadi tautan berwarna (alias + rentang)
            e = halaman baca sebesar catatan + ↩ kembali + sorot tempat klik
            f = baca penuh (66 kitab → pasal) + 3 cara cari
                + toolbar baca PERSIS lab3:
                  [🏠][Kitab ▾][Pasal ▾][◀][▶][↩][📋 PILIH][🔍 Cari]      ← bentuk LAMA (mode “pilih”)
                  K63: bawaan = 2 baris — lihat **D-7r**
            h = kursor tidak lompat (A+B+C) — terukur 0 lompatan
            14 Sep 2026: kepala diringkas — logo [A] dibuang · ikon ▦/🧩 TETAP ·
               baris bar plugin DIHAPUS · gudang plugin 2 kelompok (K17) ·
               🏠 ganti “↑ kembali” · ⌨ KETIK disatukan ke 🔍 Cari ·
               submenu panjang bisa digulir · navbar 1 baris + tinggi dvh · gudang plugin tutup sendiri
            ⚠️ data WAJIB dimuat otomatis tiap halaman dibuka
               (`ANodesAlkitab.siapkanOtomatis()`), kalau tidak tombol
               📋 PILIH / 🔍 Cari diam setelah F5 (= “tidak berfungsi”).
               Setiap fungsi plugin wajib pakai `tampilan.js → saatSiap(fn)`.
            sisa: g (kutipan panjang) + i (uji/dokumen)
            uji sekarang: 403 uji, 0 gagal (index.html + ANodes-1berkas.html)
TAHAP 6 ✅  menu [Doc] (baca + EDIT rencanakerja/CHANGELOG/panduan/agents/prompt)
            + kepala jadi 1 BARIS + tombol [Doc] paling kanan
K64    🔨  📘 PANDUAN PER HALAMAN + TOMBOL `[help]` (23 Sep 2026 · papan **A**)
            💬 Bapak: *“panduan -> dalam plugin > **[help]** · … bila berada di **note** > paduannya
            **di catatan** … bila ada **alkitab** > panduannya alkitab dengan **sedikit arahan
            tambahan** (plugin hanya keterangan **tujuan**) · bila ada di **sejarah, ayat terkait,
            kamus istilah dan penguat** · masing menerangkan cara menggunakan **secara detail pada
            help** · hanya catat dan **lengkapi `panduan.md`** … bahasa yg sederhana dan cara kerja
            kepada user”*
            📐 **Konsep:** SATU tombol `[help]` yang isinya **menyesuaikan halaman yang dibuka**.
            | di mana | panduan yang muncul |
            |---|---|
            | 📝 catatan | panduan catatan (semua fitur & menu) |
            | 📖 Alkitab | panduan Alkitab + sedikit arahan dari plugin yang membuka halaman |
            | 📖 Sejarah · 🌿 Ayat Terkait · 📚 Kamus · 🖊 Penguat | **masing-masing DETAIL** |
            ✅ **Butir a SELESAI (DOKUMEN SAJA · ❌ tanpa kode)** — `panduan.md` dilengkapi:
            bagian **`0`** = **peta “panduan mana untuk halaman mana”** (11 halaman) ·
            bagian **`3f-3`** = **📖 Sejarah Alkitab & Sejarah Kitab** (punya bagian sendiri, dulu
            menumpang di bagian Kamus) · 🐞 **nomor bagian kembar dibereskan** (`3f`→`3e-c` ·
            `4b`→`4d` · `5b`→`5d`) · 🔤 **sapaan “Bapak” → “Anda”** (64 → 0) · kaki berkas → 23 Sep 2026 ·
            ⇒ **1.904 baris · 94,5 KB** (dari 1.857 · 90,6).
            ⏭️ **Butir b–e menunggu perintah:** (b) `[help]` di gudang plugin · (c) `[help]` di
            halaman baca Alkitab · (d) `[help]` di Sejarah/Ayat Terkait/Kamus/Penguat ·
            (e) uji blok K64 + build.
            ℹ️ **Pola yang dipakai (❌ tanpa mesin baru):** `js/markdown.js` (`ANodesMarkdown.keHtml`)
            bisa menampilkan teks markdown sebagai **halaman gaya dokumen** ⇒ `[help]` cukup
            memanggil jalur itu dengan **bagian** panduan yang sesuai.
            ⚠️ **Menu `[Doc]` sudah DIHAPUS (K28h)** ⇒ isi bantuan **wajib ditanam** di
            `js/bantuan.js` (❌ tidak bisa lagi membaca berkas `.md` dari halaman).
            Gelar: **1 tombol `[help]` · isi menyesuaikan halaman · plugin hanya menerangkan tujuannya.**
K63    ✅  🎛 MENU HALAMAN BACA DIRAPIKAN 2 BARIS + JUDUL DI-FREEZE (23 Sep 2026) — lihat **D-7r**
K18    ✅  tombol [🧩 ▼] di toolbar tulis (plugin terinstall saja) — toolbar tetap
            1 baris di 300–480px · 🐞 submenu hilang karena overflow-x:auto (dibuang)
K19    ✅  🐞 submenu 🧩 terpotong di PC — yang memotong kotak `.app{overflow:hidden}`,
            bukan layar; `pasangSubmenu()` kini ukur kotak `.app` (KIRI/KANAN/ATAS)
K25    ✅  🔗 PLUGIN AYAT TERKAIT (butir a–g) — konsep lab3: kaitan turun di bawah
            ayat, chip urut urutan kitab, blok putih bertumpu, anti-dobel kedip,
            pilihan cara tampil buka/chip. Data 5,21 MB → IndexedDB kunci `silang`.
            Sambungan resmi: `tambahPenghias()`/`jalankanPenghias()` di tampilan Alkitab.
            Versi HP jadi ±11 MB. Uji AF1–AF17b → 403 uji, 0 gagal. Sisa: butir g.
K31    ✅  🌿 HALAMAN KERJA AYAT TERKAIT (halaman ke-3) — `✓ pilih` PINDAH ke sana
            (❌ bukan ke catatan) · isi = hanya rantai · telusuri ayat demi ayat ·
            Riwayat Jalur · hapus cabang inline · nama inline + auto-simpan > 3 turunan ·
            daftar simpanan di halaman 🗂️ BERKAS TERSIMPAN (K28h; dulu di menu [Doc]) ·
            berkas `plugin/ayat-terkait/kerja.js`
K33    ✅  🧹 Halaman kerja: BERSIHKAN & BUANG — `[✕]` riwayat jalur · `[🗑 Buang]`
            (kosongkan meja + hapus dari daftar simpanan) · `[🗑 Bersihkan semua]` di
            halaman 🗂️ BERKAS TERSIMPAN (K28h; dulu di [Doc]).
            ⚠️ `batalkanSimpan()` WAJIB sebelum membuang (timer 900 ms bisa menghidupkan lagi).
            🐞 Bug nyata: `gambarRantai()` memakai `daftar` SEBELUM dideklarasikan →
            daftar rantai tampil KOSONG + uji RK12 menggantung. (Kode itu kini di `js/berkas.js`.)
K34    ✅  🌿 AYAT TERKAIT UNTUK SATU RENTANG AYAT (mis. Roma 8:6-10) — tautan berentang →
            `rentangBuka` → `jalankanPenghias({…,rentang})` → `barisPemilihRentang()`.
            Ayat rentang TANPA tombol sendiri · satu baris `[6][7][8][9][10]` di bawah ayat
            terakhir · klik nomor → kolom kaitan ayat itu · `✓ pilih` → akar = ayat dipilih.
K35    ✅  📄 ~~MENU [DOC]: PENANDA VERSI + TOMBOL “↩ ASLI”~~ — **DIHAPUS K28h (3 Nov 2026)**
            bersama seluruh menu `[Doc]`. Yang tetap hidup: pengolah markdown
            (`js/markdown.js`) untuk Impor `.md` · “📖 Rapi” · rapikan tempelan (K44).
K36    ✅  📥 IMPOR `.md` → TAMPIL MUDAH DIBACA + TOMBOL “📖 RAPI” — `keHtmlImpor()`
            memakai pengolah markdown (`ANodesMarkdown.benahiMarkdown`) → 54 tabel · 73 kutipan ·
            28 blok kode · 61 judul dikenali (dulu 0) · `#info-rapi` = mode baca
            (`contenteditable=false`, isi mentah aman) · `htmlKeMarkdown()` untuk catatan lama.
            ⚠️ `#editor.mode-baca pre, table { max-width:100%; overflow-x:auto }`.
K37–K41 ✅  PLUGIN AYAT TERKAIT — 5 kasus (17 Sep 2026, 66 uji cepat, 0 gagal)
            K37 = mode GRUP (klik beberapa angka → `ayat terkait (n)` memindahkan ke
                  halaman kerja dengan ayat DIKAT · baris `[2][3][4]` ganti-ganti satu kolom)
            K38 = grup: kalimat ayat tampil + nama kitab singkat di chip
            K39 = nama ayat SINGKAT di semua tampilan plugin (Matius → Mat)
            K40 = INSERT hasil ayat terkait ke catatan (`[ + Ayat ]` dari [Doc] → bar info)
            K41 = tombol 🔄 Segarkan di navbar [Doc] (+ penanda build di dalam dokumen)
            📌 Rincian lengkap: **D-7v2** di berkas ini.
K42    ✅  📚 PLUGIN KAMUS ISTILAH — **SELESAI 18 Sep 2026 (butir a–g, 135 uji 0 gagal)**
            Kata istilah bergaris putus → klik = arti → ayat & istilah di dalam arti
            bisa diklik → penelusuran BERANTAI. **2.978 entri (3.142 tulisan) 492 KB** (K83).
            b = halaman 📚 (halaman ke-4, seukuran catatan, MENIMPA) + kotak cari
            c = garis putus di catatan (⚠️ dua plugin satu editor → `ANodesTandaKelas`)
            d = HALAMAN ARTI + SATU kolom ayat berganti isi + 🏠 ke kata asal + ↩ berantai
            e = istilah di halaman baca Alkitab · f = panel 📋 Ayat & Istilah
            g = kamus pribadi + antrian istilah (⏳/✅ + salin daftar)
            📌 Ringkasan: **D-7v3** di berkas ini. Menyatukan ide lama I-02 · I-04 · I-05.
K44    ✅  🧹 TEMPEL NASKAH DARI LUAR → MASUK RAPI (18 Sep 2026, 166 uji 0 gagal)
            Salin naskah dari AI / halaman web → Ctrl+V di ANodes → langsung rapi:
              • `**SASARAN**` sendiri → JUDUL BAGIAN  • `1. JUDUL` → JUDUL BAB
              • tautan Alkitab diringkas (`[1Yohanes 1:3](…)` → `1Yo 1:3`)
              • `____` → tetap baris untuk menulis (maks 3, ❌ tidak jadi <hr>)
              • `**EVALUASI**` DIKECUALIKAN (bagian tempat menulis)
              • tempelan pendek biasa TIDAK diubah · ↶ kembali ke bentuk mentah
            Berkas: js/editor.js (naskahBergaya/rapikanNaskah/hiaskanNaskah · pengait paste ·
            bersihSemuaTanda) · js/markdown.js (bisaMarkdown) · css/app.css · uji K44-01…K44-16.
            ⚠️ Yang dirapikan HANYA hasil tempelan di ANodes — halaman web sumber TIDAK disentuh.
TAHAP 7 ⬜  impor/ekspor .md + logo aplikasi
            (impor/ekspor `.md` sudah tercakup K30 · sisa: **logo**)
TAHAP 8 ✅  fitur lab3 lanjutan (deteksi istilah, rantai ayat)
            → **SELESAI** sebagai **K42** (lihat D-7v3) + **K25/K31** (rantai ayat)
TAHAP 9 ⬜  gudang plugin dari internet (GitHub Pages / jsDelivr)
```

> 📌 **Sisa pekerjaan & urutannya: lihat 📋 PAPAN ORDER —
> `rencanakerja.md` bagian 0** (tabel **B. ANTREAN KERJA**).