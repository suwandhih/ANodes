## 13 November 2026 — 🔄 K105: SINKRON ANDROID TIDAK MENAHAN JAVASCRIPT

## 24 November 2026 — K106: Koreksi ZIP impor server

- Pesan impor `Component source exceeds the safe discovery limit` menunjukkan HTML hasil build terlalu besar untuk safe discovery.
- `artifacts/ANodes-server-html-20261124.zip` sekarang berisi 54 berkas kode sumber: index.html + css/js/plugin, tanpa data runtime hasil generasi dan tanpa ANodes-1berkas.html.
- ZIP 415.436 byte (sumber 1.463.743 byte); pemeriksaan memastikan tidak ada HTML bundle, direktori data, tools, APK/native, atau lab.
- **Bukan paket aplikasi siap jalan:** data plugin runtime dikecualikan dan perlu dibangun kembali sebelum menjalankan aplikasi lengkap.

---

- Jembatan HTTP Android menggunakan OkHttp asinkron dan mengirim jawaban melalui callback dengan ID unik per halaman; kegagalan dan batas waktu dikembalikan sebagai galat.
- Jalur gabung, urutan sinkron, dan plugin tidak diubah. Uji sasaran K105: 9 lulus, 0 gagal, 3,8 detik; jaringan ditiru, server asli tidak disentuh.
- Alat uji sasaran mengaktifkan mode uji sebelum halaman dimuat. Skrip build APK tidak lagi menjalankan suite unit lengkap secara otomatis.
- APK versionCode 32 berhasil dibangun dan aset terbukti identik. Emulator offline: jembatan kembali 9 ms, timer berjalan, Alkitab terbuka 31 ayat, dan galat jaringan tertangani. Penyebab dan hasil pada HP 4G serta seluruh plugin belum dibuktikan.

---

## 6 November 2026 — 🧰 **K104 SELESAI: TOOLBAR TULIS SELALU TAMPIL — TOMBOL ▦ Tulis DIHAPUS**

> 💬 **Pemilik proyek 6 Nov 2026:** *"iy benar.. kalau begitu tombol **▦ Tulis** di hilang kan ..
> dan deretan menu jangan hide.. selalu tampil saja"*

---

### 💡 Maksudnya (K103 hanya JALAN PULANG — akarnya belum dibuang)

K103 menambahkan strip pemulih `[Tampilkan]`. Tetapi jalan pulang **masih menuntut pengguna
tahu harus menekan apa**. Bapak memilih **membuang akarnya**: toolbar **tidak bisa
disembunyikan lagi** ⇒ cacat "menu hilang" **mustahil** terjadi.

---

### ⚙️ Yang dikerjakan

| # | Berkas | Perubahan |
|---|---|---|
| **a** | `js/plugin.js` | `bar.siap` **selalu** `'1'` · `terapkanBar()` **tidak pernah** menyembunyikan `#toolbar` (**26 → 6 baris**) · `bacaBar()` **menimpa** nilai lama `{siap:"0"}` jadi `{siap:"1"}` ⇒ perangkat yang terlanjur kena **SEMBUH SENDIRI** · kunci usang `anodes-toolbar` dibersihkan · `stripPemulih()` + pengait tombol ▦ **dibuang** |
| **b** | `index.html` | tombol `#btn-toolbar` (**▦ Tulis**) **DIHAPUS** dari kepala · penanda **`v6Nov-b` → `v6Nov-c`** |
| **c** | `css/app.css` | blok **`.bar-pulih`** (**2 tempat**) dibuang · kurung kurawal diperiksa **seimbang** (0 sisa) |
| **d** | `js/bantuan.js` | isi halaman **📝 catatan** → *"toolbar **selalu tampil** … tombol ▦ Tulis sudah dihapus"* · `VERSI` **`v6Nov-b` → `v6Nov-c`** |
| **e** | uji | **`tools/uji-blok/K104.js`** (BARU · 28 uji) · **`K103.js` DIHAPUS** · `tools/uji-toolbar.js` **G1 · P18–P23 · AB16b · Z8** disesuaikan |
| **f** | APK | `versionCode 30 → 31` · `versionName` **`2.0.0-webview-k104`** |

---

### 📊 HASIL TERUKUR (DI APK `versionCode 31`, 412 px)

| Keadaan | Bukti |
|---|---|
| Tombol ▦ Tulis | ✅ **TIDAK ADA** (`tombolTulis false`) |
| Strip pemulih | ✅ **TIDAK ADA** (`stripPemulih false`) |
| Toolbar tulis | ✅ **TAMPIL 88,8 px** · `hidden false` · **12 tombol** terlihat |
| Kepala | ✅ **6 tombol** (Setelan · Plugin · File · Cari · Berkas · Bantuan) |
| Nilai lama `{siap:"0"}` + buka ulang | ✅ `anodes-bar` jadi **`{siap:"1"}`** · toolbar **tetap 88,8 px** |
| `terapkanBar("0")` dipanggil | ✅ **tidak menyembunyikan** toolbar |
| Bar paket K20 | ✅ muncul **DI ATAS** toolbar · editor **513,2 → 474,4 px** · keduanya tampil |
| Kunci usang `anodes-toolbar` | ✅ **`null`** (dibersihkan) |
| Tangkapan layar | `artifacts/k104-menu-selalu-tampil.png` |

---

### 🧪 UJI

| Uji | Hasil |
|---|---|
| `K104` di `index.html` | ✅ **28 uji · 0 gagal · 4,3 dtk** |
| `K104` `--sentuh --lebar 344` | ✅ **28 · 0 · 4,3 dtk** |
| `K104` `--berkas ANodes-1berkas.html` | ✅ **28 · 0 · 4,0 dtk** |
| `K104,K64` | ✅ **62 · 0 · 6,2 dtk** |
| Regresi `K102` | ✅ **18 · 0 · 4,1 dtk** |
| Regresi `K28h` | ✅ **42 · 0 · 20,5 dtk** |

---

### 📦 HASIL BUILD

| Hal | Angka |
|---|---|
| `ANodes-1berkas.html` | **40.861.048 byte (38,97 MB)** |
| APK | **34.233.823 byte (32,65 MB)** |
| SHA-256 APK | `45799E8E4E27083DBE8DB3405E04F3B989666198BA3D13D8C0430D8F0945505C` |
| `versionCode` / `versionName` | **31** / `2.0.0-webview-k104` |
| Aset di APK | ✅ **byte-identik** dengan sumber |
| Penanda halaman | **`v6Nov-c`** · bantuan **`v6Nov-c`** |
| 💾 Backup | `backups/k104-menu-selalu-tampil-20261106-*/` |

---

### ⚠️ PELAJARAN (WAJIB dibawa)

1. 🔴 **Kalau sebuah fitur menyembunyikan hal penting & tidak ada jalan pulang, HAPUS fiturnya**
   — ❌ jangan hanya menambah tombol pemulih. Jalan pulang masih menuntut pengguna **tahu**
   harus menekan apa; menghapus akarnya membuat cacatnya **mustahil**.
2. 🔴 **Nilai `localStorage` lama WAJIB ditimpa saat versi baru dibuka** — kalau tidak,
   perangkat yang sudah terlanjur kena **tetap rusak** walau kodenya sudah diperbaiki.
3. 🔴 **Setelah memotong blok CSS berdasarkan nomor baris, periksa kurung kurawal
   seimbang.** Pemotongan meninggalkan **komentar menggantung** + **`}` berlebih** yang
   merusak seluruh berkas (terukur: `{` vs `}` wajib berakhir **0**).
4. **Menyederhanakan keadaan menghapus banyak kode:** `btnBar` · `stripPemulih` · dua cabang
   `paketTampil` hilang — `terapkanBar()` jadi **6 baris**.
5. **Bar paket K20 tidak lagi bergantian dengan toolbar** — sekarang **di atasnya**, keduanya
   tampil. `paketTampil` disimpan hanya supaya pemanggil lama tidak error.

---

## 6 November 2026 — 🧰 **K103 SELESAI: TOOLBAR TULIS HILANG ⇒ SEKARANG ADA JALAN PULANG (STRIP PEMULIH)**

> 💬 **Pemilik proyek 6 Nov 2026** (Samsung Z Flip 3): *"di catatan 2 kolom menu belum tampil
> yg tampil kategori umum on off · menu dibawa tidak ada .. untuk samsung z flip 3 · untuk
> samsung note 8 ada"*

---

### 🔎 DIUKUR DULU DI **APK NYATA** (emulator + WebView DevTools — ❌ bukan diduga)

| # | Yang diukur | Hasil terukur | Kesimpulan |
|---|---|---|---|
| **1** | APK `versionCode 29` di **412 px** & **344 px** | toolbar **88,8 px** · `flexShrink 0` · `hidden false` · 12 tombol terlihat · `.info` **54 px** | ✅ **perbaikan K102 BEKERJA** |
| **2** | `localStorage['anodes-bar']` = **{"siap":"0"}** | toolbar **`display:none`**, tinggi **0 px**, `#editor` melebar **627 px** | ❌ **inilah sebabnya** — tampilan **PERSIS** seperti tangkapan layar |
| **3** | `anodes-bar` = **{"siap":"1"}** (Note 8) | toolbar **88,8 px** tampil | ✅ sebab perbedaan Z Flip 3 ⇄ Note 8 |
| **4** | Cara memunculkan lagi | **HANYA** tombol `▦ Tulis` (`#btn-toolbar`) | ⚠️ **tidak ada jalan lain** — dan **tidak disebut** di Bantuan |

**🔴 CACAT SEBENARNYA:** `terapkanBar()` menyembunyikan toolbar **permanen**
(`localStorage` bertahan sesudah aplikasi ditutup). Di layar sentuh kepala punya **7 tombol**
dan `▦` adalah yang **paling kiri** & berikon paling tidak jelas ⇒ mudah tersentuh
tak sengaja dan **tidak bisa ditemukan lagi**.

---

### ⚙️ Yang dikerjakan

| # | Berkas | Perubahan |
|---|---|---|
| **a** | `js/plugin.js` | ➕ **`stripPemulih(tampil)`** — muncul **strip krem** di atas editor: *"▦ Toolbar tulis disembunyikan"* + tombol **`[Tampilkan]`** · dipanggil di akhir `terapkanBar()` sebagai `stripPemulih(!bar.paket && !tampil)` |
| **b** | `js/plugin.js` | ➕ **`baris()`** (`siap` · `paket` · `paketTampil` · `tampil` · `tinggi` · `pemulih`) + **`tampilkanBar()`** · API diekspor |
| **c** | `css/app.css` | blok **`.bar-pulih`** · `.bpulih-lbl` · `.bpulih-btn` (latar `rgb(255,248,230)`) + `@media (pointer: coarse), (hover: none)` ⇒ tombol **44 px** |
| **d** | `js/bantuan.js` | isi halaman **📝 catatan** sekarang menjelaskan tombol **▦ Tulis** + strip **`[Tampilkan]`** · `VERSI` **`v3Nov-i` → `v6Nov-b`** |
| **e** | `index.html` | penanda halaman **`v6Nov-a` → `v6Nov-b`** |
| **f** | `tools/uji-blok/K103.js` | **BARU** — 28 uji sasaran |

---

### 📊 HASIL TERUKUR (DI APK `versionCode 30`, 412 px)

| Keadaan | Bukti |
|---|---|
| toolbar tampil (`siap=1`) | **88,8 px** · `hidden false` · strip **tidak ada** |
| toolbar disembunyikan (`siap=0`) | `#toolbar.hidden true` · tinggi **0 px** · **strip `#bar-pulih` MUNCUL 52,8 px** · latar `rgb(255,248,230)` · tombol `[Tampilkan]` **44 px** · `cursor: pointer` |
| **tekan `[Tampilkan]`** | toolbar **HIDUP lagi 88,8 px** · strip **HILANG** · `anodes-bar` → **{"siap":"1"}** |
| buka ulang aplikasi | toolbar **TETAP tampil** (pilihan tersimpan) |
| saat bar paket ayat bergantian | strip **TIDAK muncul** (bergantian, ❌ bukan disembunyikan) |
| catatan | **tidak tersentuh** |

| Uji | Hasil |
|---|---|
| `node tools/uji-sasaran.js K103` | ✅ **28 uji · 0 gagal · 4,6 dtk** |
| `… K103 --sentuh --lebar 344 --tinggi 938` | ✅ **28 uji · 0 gagal · 4,6 dtk** |
| `… K103 --berkas ANodes-1berkas.html` | ✅ **28 uji · 0 gagal · 4,0 dtk** |

| Build | Angka |
|---|---|
| `ANodes-1berkas.html` | **40.864.734 byte (38,97 MB)** |
| APK | **34.235.699 byte (32,65 MB)** · SHA-256 `3511D767…3C7B` · `versionCode 30` / `2.0.0-webview-k103` |
| Aset di APK | `assets/anodes.html` = sumber (**byte-identik**) ✅ |
| Bukti | `artifacts/k103-strip-pemulih.png` |

**Cara pakai (untuk pemilik proyek):** tekan tombol kecil **▦ Tulis** di kepala, **atau**
tekan tombol kuning **Tampilkan** di atas tulisan.

---

### ⚠️ PELAJARAN (WAJIB dibawa)

1. 🔴 **Sakelar tampilan yang disimpan di `localStorage` WAJIB punya jalan pulang yang
   TERLIHAT.** Kalau tidak, pengguna kehilangan fitur **selamanya** dan tidak tahu sebabnya.
2. 🔴 **Jangan andalkan ikon saja** untuk tombol yang mengembalikan fitur penting —
   `▦` tidak berarti apa pun bagi pengguna baru.
3. 🔴 **Keluhan "ada di HP A, tidak ada di HP B" hampir selalu `localStorage`, bukan tata
   letak** — periksa kuncinya **SEBELUM** menyentuh CSS. Di sini K102 (tata letak) sudah
   beres, tetapi keluhannya **masih** muncul karena sebabnya **data**, bukan gaya.
4. **Cacat begini hanya ketemu dengan mengukur KEADAAN DATA di APK nyata**, ❌ bukan
   dengan memotret ulang tampilan.
5. **Strip pemulih dibuat sekali, dipakai berkali-kali** — `terapkanBar()` adalah
   **satu-satunya** pemilik `#toolbar.hidden`, jadi penjaganya cukup dipasang **di situ**.
## 6 November 2026 — 📱 **K102 SELESAI: TATA LETAK DI HP NYATA (BAR INFO TERPOTONG + MENU TIDAK BESAR)**

> 💬 **Pemilik proyek 6 Nov 2026:** *“sudah install hp z flip 3 · tampil (pasted image) menu atas
> tidak lengkap ketutupan · Pasted Image 2 > di hp note 8 samsung .. tombol on off tidak terlihat ·
> Pasted Image 3 > di PC terlihat semua · versi apk harus diperbaiki”*

---

### 🔎 DIUKUR DULU DI **APK NYATA** (emulator + WebView DevTools — ❌ bukan diduga)

| # | Yang diukur | Hasil terukur | Akibat |
|---|---|---|---|
| **1** | `matchMedia('(pointer: coarse)')` di WebView APK | ❌ **`false`** (padahal `maxTouchPoints=5` · `hover:none=true` · `ontouchstart` ada) | **SELURUH blok K79 tidak aktif** ⇒ kepala **47 px** (bukan 61) · tombol **29 px** (bukan 44) · label teks **`display:none`** · toolbar **34 px** 1 baris |
| **2** | `.info` `flex-shrink` | ❌ **`1`** (boleh menyusut) | `.info` **20,6 px** padahal isinya **29 px** ⇒ **`info-kategori` & `info-tandai` (🔗 ON/OFF) TERPOTONG** — persis keluhan pemilik proyek |
| **3** | `.toolbar` `flex-shrink` | ❌ **`1`** | toolbar bisa menyusut juga |

**Bukti angka (APK `com.anodes.app.webview` versionCode 28):**
`info h=20,6 scrollH=29 overflow=hidden` · anak di luar kotak: **`info-kategori`, `info-tandai`** ·
`kepala h=47` · `tombolKepala h=29` · `labelTampil=none` · `toolbar h=34`.

---

### ⚙️ Yang dikerjakan

| # | Berkas | Perubahan |
|---|---|---|
| **a** | `css/app.css` | **`.info { flex-shrink: 0 }`** + **`.toolbar { flex-shrink: 0 }`** ⇒ bar info & toolbar **tidak boleh menyusut** (isi wajib utuh) |
| **b** | `css/app.css` | **SEMUA** `@media (pointer: coarse)` → **`@media (pointer: coarse), (hover: none)`** (**8 tempat**) ⇒ WebView APK yang melaporkan `pointer: fine` **tetap** mendapat tata letak sentuh |
| **c** | `index.html` | penanda halaman **`v3Nov-j` → `v6Nov-a`** |
| **d** | `tools/uji-blok/K102.js` | **BARU** — 21 uji sasaran |
| **e** | `android-native/app/build.gradle.kts` | `versionCode` **28 → 29** · `versionName` → **`2.0.0-webview-k102`** |

⚠️ **Jebakan operator CSS:** `@media (pointer: coarse) and (max-width: 360px), (hover: none)`
**SALAH** — `and` lebih kuat dari `,` ⇒ aturannya jadi *“(coarse) ATAU (hover:none DAN ≤360px)”*.
Yang benar: **`@media (pointer: coarse) and (max-width: 360px), (hover: none) and (max-width: 360px)`**.

---

### 📊 HASIL TERUKUR

**A) Sesudah perbaikan disuntik lewat CDP (sebelum berkas diubah) — bukti sebabnya benar:**

| Hal | Sebelum | Sesudah |
|---|---|---|
| `.info` tinggi | **20,6 px** (terpotong) | ✅ **54 px** |
| `infoTerpotong` | ❌ **true** | ✅ **false** |
| Anak di luar kotak | ❌ `info-kategori`, `info-tandai` | ✅ **tidak ada** |
| Kepala | 47 px · tombol **29 px** · label **none** | ✅ **72 px** · tombol **44 px** · label **block** |
| Toolbar | 34 px (1 baris) | ✅ **89 px** (2 baris) |

**B) Sesudah perbaikan DITERAPKAN + APK dibangun ulang (`versionCode 29`) — diukur di APK nyata:**

| Hal | Hasil terukur |
|---|---|
| `.info` | **h=54 px** · `scrollH 53 ≤ clientH 53` · `flexShrink 0` ✅ |
| Anak bar info | `info-nama h15` · **`info-kategori h30`** · `info-kata h14` · **`info-tandai h30`** — **semuanya di dalam kotak** ✅ |
| Kepala | **70,4 px** · tombol **44 px** · label **terlihat** ✅ |
| Toolbar | **88,8 px** (2 baris) ✅ |
| Ruang tulis | **513 px** ✅ |
| Menu File | **11 entri** (Open · New · Save · Del · Impor · Ekspor .md/.txt/.pdf · Cadangan .json · **☁️ Sinkron…** · **👤 Pengguna…**) — **semua di atas dasar app** (`meluber: false`) ✅ |
| Penanda halaman | **`v6Nov-a`** ✅ |

**C) Uji sasaran:**

| Uji | Hasil |
|---|---|
| `node tools/uji-sasaran.js K102` | ✅ **18 uji · 0 gagal · 4,3 dtk** |
| `node tools/uji-sasaran.js K102 --sentuh --lebar 344 --tinggi 938` | ✅ **21 uji · 0 gagal · 4,4 dtk** (kepala **61 px** · tombol **44 px** · label **block** · toolbar **89 px** · info **56 px**) |

**D) Build:**

| Hal | Angka |
|---|---|
| `ANodes-1berkas.html` | **40.859.698 byte (38,97 MB)** |
| APK | **34.233.883 byte (32,65 MB)** · SHA-256 `2C8FD1B9D1561BD8D2056B3A301467526C04248F05C8C7AE9395F54CB4FA3716` |
| `versionCode` / `versionName` | **29** / `2.0.0-webview-k102` |
| Aset di APK | **byte-identik** dengan sumber ✅ (`tools/cek-apk.js`) |
| Tangkapan layar | `artifacts/k102-apk-tata-letak.png` · `artifacts/k102-apk-menu-file.png` |

---

### ⚠️ PELAJARAN (WAJIB dibawa)

1. 🔴 **`@media (pointer: coarse)` TIDAK BISA DIPERCAYA di WebView Android.** Terukur:
   `coarse=false` · `fine=true` · `hover:none=true` · `maxTouchPoints=5`. ⇒ **selalu pasangkan
   `(hover: none)`** untuk tata letak sentuh.
2. 🔴 **Baris flex di dalam kolom flex WAJIB `flex-shrink: 0`** kalau isinya tidak boleh
   terpotong. `.info` menyusut **20,6 px** dari kebutuhan **29 px** ⇒ 2 tombol hilang.
   Cacat ini **tidak terlihat di PC** (layar tinggi) — hanya muncul di HP.
3. 🔴 **Cacat tata letak HP WAJIB diukur di APK NYATA**, ❌ bukan di Chrome. Chrome melaporkan
   `pointer: coarse` dengan benar ⇒ **cacatnya tidak muncul** walau diuji di lebar 344 px.
4. ⚠️ **DUA paket APK ada di perangkat** — `com.anodes.app` (lama, versionCode 4) dan
   **`com.anodes.app.webview`** (baru). Salah membuka paket = **hasil ukur menyesatkan**.
   Selalu: `am start -n com.anodes.app.webview/com.anodes.app.WebAppActivity`.
5. ⚠️ **Operator `and` lebih kuat dari `,`** di media query — tulis kondisi lengkap dua kali.

---

## 6 November 2026 — 📦 **K101 SELESAI: APK DIBANGUN ULANG + PAGAR `tools/cek-apk.js`**

> 💬 **Pemilik proyek 6 Nov 2026:** *“saya sudah tes ke APK ANodes-webview-debug.apk belum ada
> seperti pasted image · sinkron online seharusnya sudah ada .. pasted image 2”*
> (tangkapan layar: modal **👤 “Siapa yang memakai ANodes?”** di PC + menu **File ▼** berisi
> **☁️ Sinkron…** dan **👤 Pengguna…**)

---

### 🔎 DIUKUR DULU (❌ bukan diduga) — APK TERTINGGAL 5 KASUS

| Hal | APK (3 Nov 15:43) | Sumber |
|---|---|---|
| Penanda halaman | **`v3Nov-e`** (era K98) | **`v3Nov-j`** |
| `ANodesPengguna` (K100) | ❌ **0** | 17 |
| `ANodesBantuan` (K64) | ❌ **0** | 1 |
| `ANodesBerkas` (K28h) | ❌ **0** | 3 |
| `ANodesPerikop` (K99) | ❌ **0** | 22 |
| `ANodesParalel` (K86) | ❌ **0** | 20 |
| `ANodesLinimasa` (K87) | ❌ **0** | 20 |
| `menu-pengguna` · `btn-bantuan` | ❌ **0** | 2 · 3 |
| Aset `assets/anodes.html` | 37.500.605 B | **40.858.550 B** |

⇒ **Menu ☁️ Sinkron & 👤 Pengguna SUDAH ADA di sumber** — hanya **belum masuk APK**.
**Sebabnya sama seperti K78 · K79 · K95e: APK belum dibangun ulang** sesudah
K86 · K99 · K28h · K64 · K100 · K87. **Ini kejadian ke-4.**

---

### ⚙️ Yang dikerjakan

| Langkah | Hasil |
|---|---|
| 💾 Backup | `backups/k100-apk-rebuild-20261106/` (APK lama · `APK-INFO.txt` · `build.gradle.kts`) |
| `versionCode` | **27 → 28** · `versionName` → **`2.0.0-webview-k100`** |
| `gradlew clean` | ✅ **53 dtk** |
| `build-apk.bat` | ✅ **1m 49s** · menyalin aset **40.858.550 byte** lebih dulu |
| ⚠️ `JAVA_HOME` | **WAJIB diset di proses yang SAMA** — kalau tidak: *“JAVA_HOME is not set”* |
| **PAGAR BARU** | **`tools/cek-apk.js`** — memeriksa **aset di dalam APK** vs sumber (SHA-256) + **12 penanda per kasus** ⇒ `exit 1` kalau tertinggal |

---

### 📊 Hasil terukur

| Hal | Angka |
|---|---|
| APK | **34.233.351 byte (32,65 MB)** |
| SHA-256 APK | `69D1F4F1BBF72651A3F1A71762520CA65C15C9D46934B80056B7B2956D7620EA` |
| `versionCode` / `versionName` | **28** / `2.0.0-webview-k100` |
| Aset di APK | **40.858.550 byte = sumber (byte-identik)** ✅ |
| Penanda halaman di APK | **`v3Nov-j`** ✅ |
| 12 penanda per kasus | ✅ **semuanya sama** dengan sumber |
| Izin | `INTERNET` + `ACCESS_NETWORK_STATE` ✅ |
| Modal ☁️ Sinkron di APK | ✅ **versi K77d** (tanpa kolom alamat/kunci · 3 tombol) |
| **Pagar diuji** | ✅ dengan APK LAMA ⇒ **`exit 1`** + menyebut **8 penanda hilang** (bukan lulus palsu) |

---

### ⚠️ PELAJARAN (WAJIB dibawa)

1. 🔴 **“Berkas proyek sudah diperbarui” ≠ “APK berisi kode terbaru”.** APK **tidak ikut berubah**
   kalau tidak dibangun ulang. **Sudah 4×** (K78 · K79 · K95e · **K101**).
2. 🔴 **Pagar di kode > janji.** Karena itu dibuat **`tools/cek-apk.js`** — memeriksa
   **aset di dalam APK** (bukan hanya tanggal berkas) + **12 penanda per kasus** ⇒ `exit 1`.
3. 🔴 **`JAVA_HOME` wajib diset di proses yang SAMA** dengan `gradlew`.
4. **`versionCode` WAJIB dinaikkan** setiap build.
5. **`gradlew clean` wajib** sebelum build (tanpa clean: dex lama tertinggal ⇒ APK +±10 MB).
6. **Cara memeriksa sendiri:** ekstrak `assets/anodes.html` dari APK, bandingkan **SHA-256**
   dengan `ANodes-1berkas.html`. Kalau beda ⇒ APK tertinggal.

**Berkas:** `android-native/app/build.gradle.kts` · `artifacts/ANodes-webview-debug.apk` ·
`artifacts/APK-INFO.txt` · **`tools/cek-apk.js`** (BARU) ·
💾 `backups/k100-apk-rebuild-20261106/`.

---
## 3 November 2026 — 🕒 **K87 SELESAI: PLUGIN LINIMASA SEJARAH (450 PERISTIWA · 9 ZAMAN)** + 📁 **K14 DITUTUP**

> 💬 **Pemilik proyek 3 Nov 2026:** *“3. Linimasa sejarah bukannya sudah ada ? atau ini beda..
> mengukur masa ?”* ⇒ dijelaskan **bedanya** ⇒ dipilih **“linimasa kerjakan”**.
> **⏱️ Perkiraan ±4 jam · nyata ±1 jam 5 menit.**

---

### 🔎 DIUKUR DULU (❌ bukan diduga)

| Yang diukur | Angka |
|---|---|
| Sumber `robertrouse/theographic-bible-metadata` | `CSV/Events.csv` **246 KB** + `CSV/Books.csv` |
| Peristiwa | **450** — **semuanya** punya rujukan ayat |
| Rentang tahun | **−4003 … 57** |
| Rujukan ayat | **17.570** — **100 %** memetakan ke kitab ANodes & **100 %** ayatnya ada |
| Nilai `partOf` | **41** |
| Sebaran zaman | Penciptaan & bapa leluhur **63** · Bapa bangsa & Mesir **65** · Hakim-hakim **25** · Kerajaan bersatu **9** · Kerajaan terpecah **81** · Pembuangan & pemulihan **4** · *(kosong)* **0** · Yesus **93** · Gereja mula-mula **110** = **450** |

⚠️ **2 cacat sumber:** **BOM `\uFEFF`** di baris pertama (nama kolom jadi `\uFEFFtitle`) ·
**`startDate`** kadang **angka** (`-4003`) kadang **tanggal ISO** (`0030-04-04`).

---

### ⚙️ Yang dibuat

| Berkas | Isi |
|---|---|
| **`tools/osis.js`** (BARU) | peta **OSIS 3 huruf** → **nomor kitab 1–66** |
| **`tools/linimasa-terjemah.json`** (BARU) | **450** judul Inggris → Indonesia (ditulis tangan) |
| **`tools/linimasa-bagian.json`** (BARU) | **41** nilai `partOf` → Indonesia |
| **`tools/siapkan-data-linimasa.js`** (BARU) | pembangun data · **menolak** judul tanpa terjemahan **atau** judul kembar |
| `plugin/linimasa/data/linimasa.js` | **213,4 KB** · sidik **`lm-450--4003-57-3f9bc0c1`** |
| **`plugin/linimasa/linimasa.js`** (BARU) | mesin `window.ANodesLinimasa` · IndexedDB kunci **`linimasa`** |
| **`plugin/linimasa/tampilan.js`** (BARU) | halaman **ke-11** `#linimasa-halaman` · 9 chip zaman + kotak cari |
| **`plugin/linimasa/plugin.js`** (BARU) | kartu 🕒 · `tombolBuka: '▶ Buka Linimasa'` |
| `index.html` | ➕ halaman `#linimasa-halaman` · ➕ 4 tag `<script>` · penanda **`v3Nov-j`** |
| `css/app.css` | blok **K87** (`.lm-*`) |
| `js/bantuan.js` | ➕ isi **linimasa** ⇒ **12 halaman bantuan** |
| `tools/buat-1-berkas.js` | ➕ bagian **3l** |
| `tools/uji-blok/K87.js` (BARU) | **56 uji** |

**Kunci tampilan:** `anodes-linimasa-zaman` · `anodes-linimasa-kata` (masuk `KUNCI_AMAN`).

---

### 🐞 3 CACAT NYATA yang ketemu (jangan diulang)

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | Pengurut **abjad** sebagai pemutus tahun yang sama | *“Penciptaan Adam dan Hawa”* tampil **sebelum** *“Penciptaan segala sesuatu”* (keduanya −4003) | pemutus = **urutan baris sumber** (`a.urut - b.urut`) |
| 2 | **2 judul Indonesia kembar** (`Reign of Jehoash` · `Death of Jehoahash`) | dua peristiwa berjudul sama | dibedakan **“(Israel)”** + pembangun data **menolak** judul kembar |
| 3 | 🏠 dari Alkitab kembali ke **catatan**, bukan ke **Linimasa** | pengguna kehilangan tempat | ➕ `ingatAsalAyat({jenis:'linimasa'})` sebelum lompat (pola 🔖 K81b) |

ℹ️ **1 cacat UJI:** `chipAyat()` membuang chip ketika `ambilAyatBanyak()` = `[]` (terjadi sebelum data Alkitab siap) ⇒ pembuangan hanya kalau **`A.siap()`**.

---

### 📊 Hasil terukur

| Hal | Bukti |
|---|---|
| Peristiwa #1 | ✅ **“Penciptaan segala sesuatu”** (−4003) |
| 450 judul | ✅ **450 unik** |
| Chip ayat | ✅ tergambar · `cursor: pointer` · label terisi |
| Klik chip | ✅ Alkitab terbuka · halaman Linimasa menyembunyikan dirinya |
| 🏠 | ✅ kembali ke **HALAMAN LINIMASA** |
| Lepas plugin | ✅ halaman tertutup · **catatan tidak tersentuh** |
| Uji | ✅ **56 uji · 0 gagal · 10,7 dtk** (`index.html`) · **56 · 0 · 10,6 dtk** (`ANodes-1berkas.html`) |
| Regresi | ✅ **K64+K99+K100 = 110 · 0** · **K86+K96+K28h = 143 · 0** (sesudah K96 dinormalkan) |
| `ANodes-1berkas.html` | **40.858.550 byte (38,97 MB)** |
| Penanda | halaman **`v3Nov-j`** · linimasa `v3Nov-a` |

---

### 📁 K14 — folder `bible` · **DITUTUP (tidak ada yang perlu dipindah)**

`C:\data\bible` **sudah tidak ada**; `alkitab-tb.json` · `silang.json` · `kitab.json` · `komentar/`
**tidak ditemukan** di `C:\data` (dicari rekursif 4 tingkat).
⇒ ➕ **`tools/sumber-data.js`** (BARU) — `cariSumber(nama)` mencoba **`$env:ANODES_SUMBER`** →
**`ANodes\bible\data\`** → `C:\data\bible\data\`, lalu **pesan jelas** kalau tidak ada.
Diubah: `siapkan-data-alkitab.js` · `siapkan-data-silang.js` · `siapkan-data-penguat.js` ·
`siapkan-data-sejarah.js`. ✅ keempatnya `node --check` bersih & berbunyi **“❌ Sumber tidak ada: …”**.

---

## 3 November 2026 — ❓ **K64 + K100 SELESAI: TOMBOL BANTUAN `[?]` + PEMISAHAN DATA PER EMAIL**

> 💬 **Pemilik proyek 3 Nov 2026:** *“help [?] dengan tujuan dan pejelasan perlu sekali .. mungkin
> satu hari bisa di saya share ke teman dekat jika mereka memang mau.. sistem ini tidak bisa di
> google play atau ditolak karena menggunakan sistem webview.. nanti sistem hanya memiliki pemilah
> data menggunakan atau berdasarkan email”* + *“sekalian dibuat untuk isi 1x untuk seterusnya masuk
> email .. memisahan data satu user dengan yg lain .. menurut saya tidak banyak paling banyak
> mungkin 20 pengguna... data dipisahkan dengan email saja”*
> **⏱️ Perkiraan ±45 menit · nyata ±55 menit.**

---

### ❓ K64 b–e — TOMBOL BANTUAN YANG MENYESUAIKAN HALAMAN

🔎 **Diukur dulu sebelum memutuskan letak tombol (bukan dugaan):**

| Yang diukur | Angka | Akibat |
|---|---|---|
| Navbar Alkitab | **9 tombol · 324 = 324 px** di layar **344 px** | ❌ **tidak bisa** menambah tombol di navbar |
| Kepala aplikasi (PC 480 px) | **6 tombol · aksi 257/257 px** | ✅ **masih ada ruang** |
| Kepala (sentuh 344 px) | **6 tombol · 209/209 px** | ✅ muat; sesudah ditambah jadi **247/247 px** |

⇒ **KEPUTUSAN: SATU tombol bantuan di kepala** (dekat 🗂️ Berkas), isinya menyesuaikan halaman.

| Berkas | Isi |
|---|---|
| **`js/bantuan.js`** (BARU) | `window.ANodesBantuan` — **11 isi halaman** ditulis langsung di berkas ini |
| `index.html` | ➕ `<button id="btn-bantuan">❓</button>` di `.kepala .aksi` · ➕ `<script src="js/bantuan.js">` |
| `css/app.css` | blok **K64** — `#modal-bantuan` (semua ukuran `calc(Npx * var(--skala))` ⇒ ikut ⚙) |
| `tools/uji-blok/K64.js` (BARU) | **34 uji** |

**11 isi bantuan** (semuanya BERBEDA · 1.283–4.746 huruf): 📝 catatan · 📖 alkitab · 🌿 kerja ·
📚 kamus · 🖊 penguat · 📜 sejarah · 🗺️ peta · 🔖 bookmark · 🗓️ baca1tahun · 🗂️ berkas ·
🧩 plugin (**hanya TUJUAN** — sesuai permintaan *“plugin hanya keterangan tujuan”*).

**Hasil terukur:**

| Hal | Bukti |
|---|---|
| Tombol | **47×44 px** (sentuh 344 px) · **34×31 px** (PC) |
| Kepala tidak meluber | **344 ≤ 344** · aksi **338 ≤ 338** · PC **420 = 420** |
| Isi menyesuaikan halaman | 📖 Membaca Alkitab · 📚 Kamus Istilah · 📜 Sejarah · 🗺️ Peta Alkitab |
| 11 isi BERBEDA | **11 unik** |
| Ukuran ikut ⚙ | **17,9 px** pada ⚙ 22 (= 13 × 22/16) |
| Catatan tidak terganggu | isi **sama persis** sebelum ⇄ sesudah |
| Tanpa kata “Bapak” | **0** kemunculan (aturan K48) |
| Uji | **34 · 0 · 5,2 dtk** (`index.html`) · **34 · 0 · 5,3 dtk** (HP, `--sentuh` 344 px) |

---

### 👤 K100 — PEMISAHAN DATA PER EMAIL

**Cara kerja (paling murah — data dipisah dari NAMA KUNCINYA):**

```text
ANodesPengguna.kunci('anodes-catatan-v1')
   ⇒ email kosong : 'anodes-catatan-v1'                        (seperti dulu)
   ⇒ email terisi : 'u:nama@contoh.com::anodes-catatan-v1'
```

⇒ **6 modul** cukup memakai satu pembantu `kunciData()`. Struktur data **tidak berubah**,
❌ tidak ada mesin baru, ❌ tidak ada salinan di tempat lain.

| Berkas | Perubahan |
|---|---|
| **`js/pengguna.js`** (BARU) | `window.ANodesPengguna` — `email` · `ada` · `awalan` · `kunci` · `sah` · `pakai` · `lewati` · `lupakan` · `daftarEmail` · `buka/tutup/terbuka` · **`warisi`** |
| `js/store.js` · `js/setting.js` · `plugin/kamus/tampilan.js` · `plugin/bookmark/bookmark.js` · `plugin/ayat-terkait/kerja.js` · `plugin/baca1tahun/baca.js` | ➕ pembantu kunci ber-email; baca/tulis memakainya |
| **`js/sinkron.js`** | ➕ `kLokal(k)` (lokal) · **`kJauh(k)`** = `email\|kunci` (server) · `ambil()` melewati baris email LAIN · `VERSI` → **`v3Nov-b`** |
| `index.html` | ➕ `<script src="js/pengguna.js">` **sebelum** `sinkron.js` & `store.js` · ➕ `File ▼ → 👤 Pengguna…` |
| `css/app.css` | blok **K100** — `#modal-pengguna` (ikut ⚙; tombol 44 px di layar sentuh) |
| `tools/uji-blok/K100.js` (BARU) | **34 uji** |

**Migrasi “WARISI”** (sekali, saat email pertama diisi): tiap kunci data tanpa awalan
**dipindah** ke versi ber-awalan, dibaca ulang untuk dipastikan utuh, lalu yang lama **dihapus**
⇒ benar-benar pindah (❌ bukan diduplikasi — localStorage hanya ±5 MB).
Data email yang sudah ada **tidak pernah ditimpa**.

**Hasil terukur:**

| Hal | Bukti |
|---|---|
| Email sah / tidak sah | `nama@contoh.com` ✅ · 4 bentuk salah ditolak |
| `ANodesStore` · `ANodesSetting` | menulis ke kunci **ber-email** |
| **Pemisahan nyata** | email ke-2 **kosong** · balik ke email ke-1 ⇒ **UTUH** |
| Warisi | kunci lama **dipindah** · isi **utuh** · kunci lama **dihapus** · data email ada **tidak tertimpa** |
| Modal | kotak email **44 px** (sentuh) · email salah ⇒ **pesan merah** · `Esc` menutup |
| Sinkron | mode uji: `kirim()` = `{ditulis:0, dilewati:'mode uji'}` · kunci server `email\|anodes-…` |
| Uji | **34 · 0 · 4,4 dtk** (`index.html`) · **34 · 0** (HP) |

---

### 🐞 4 cacat nyata yang ketemu saat menguji (jangan diulang)

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | `warisi()` memakai **kunci mentah** sebagai tujuan | pemeriksa *“sudah ada isinya?”* membaca **kunci sumbernya sendiri** ⇒ migrasi **tidak pernah jalan** | tujuan = **`kunci(k)`** |
| 2 | uji memanggil `ANodesStore.simpan()` dengan **id karangan** | `simpan()` mengembalikan `false` | pakai **`S.baru()`** dulu |
| 3 | uji pemisahan memakai `anodes-catatan-v1` | simpan-otomatis editor **menulis ulang** kunci itu ⇒ hasil menipu | pakai **`anodes-bookmark-v1`** |
| 4 | emulasi sentuh dinyalakan **otomatis** di `uji-sasaran.js` | `@media (pointer: coarse)` (K79) aktif ⇒ kepala **2 baris** ⇒ **K28h-40 gagal** | jadikan **opt-in `--sentuh`** |

### ⚠️ Pelajaran

1. 🔴 **Memisahkan data paling murah lewat NAMA KUNCI**, bukan lapisan data baru. Enam modul cukup
   memakai satu pembantu; struktur data tidak berubah sama sekali.
2. 🔴 **Migrasi wajib memeriksa kunci TUJUAN yang benar** — kalau salah, pemeriksanya membaca
   sumbernya sendiri dan migrasi **diam-diam tidak pernah berjalan**.
3. 🔴 **Uji pemisahan jangan memakai kunci yang ditulis ulang fitur lain** (catatan ditulis ulang
   `simpanSekarang()` setiap ganti email).
4. ⚠️ **Lingkungan uji tidak boleh berubah diam-diam** — emulasi sentuh otomatis mengubah garis
   dasar uji lama (kepala 1 baris → 2 baris) ⇒ jadikan **opt-in**.

### 📦 Hasil build

| Hal | Angka |
|---|---|
| `ANodes-1berkas.html` | **40.602.494 byte (38,72 MB)** |
| Penanda | halaman **`v3Nov-i`** · bantuan `v3Nov-i` · pengguna **`v3Nov-j`** · sinkron **`v3Nov-b`** |
| Uji | **K64+K100 68 · 0** (HP) · **K28h 42 · 0** (HP) · **K92+K93+K96+K99 136 · 0** (HP) · **K86+K98+K99 107 · 0** |
| 💾 Backup | `backups/k64-bantuan-20261103/` |

---
## 3 November 2026 — 🗂️ **K28h SELESAI: MENU `[Doc]` DIHAPUS + HALAMAN BERKAS TERSIMPAN (HP −2,29 MB)**

> 💬 **Pemilik proyek 3 Nov 2026:** *“[doc] sudah tidak perlu.. karena sistem sudah hampir selesai”*
> ⇒ dipilih **“Hapus `[Doc]` + pindahkan daftar rantai ke halaman plugin 🌿 Ayat Terkait”**.
> **⏱️ Perkiraan ±1 jam · nyata ±50 menit.**

### 🔎 DIUKUR DULU (❌ bukan diduga) — apa saja yang menumpang di dalam `[Doc]`

| Yang diperiksa | Hasil |
|---|---|
| `js/dokumen.js` | **1.094 baris** — halaman dokumen + **daftar rantai** + **pengolah markdown** |
| `js/dokumen-data.js` | isi 5 berkas `.md` ditanam (**±1,1 MB**) |
| Pemakai `ANodesDokumenTampilan` | **`js/editor.js` 4 tempat** — `pantasRapi` · `terapkanRapi` · `keHtmlImpor` · `rapikanNaskah` |
| Pemakai `doc-alkitab` | `plugin/ayat-terkait/kerja.js` (1 tempat) |

🔴 **TEMUAN PENTING:** menu `[Doc]` **bukan hanya** penampil dokumen proyek — di dalamnya ada
**daftar rantai tersimpan** (🌿 Ayat Terkait) **dan** pengolah markdown yang dipakai
**Impor `.md`/`.txt`**, tombol **“📖 Rapi”**, dan **rapikan naskah tempelan (K44)**.
⇒ Menghapus `[Doc]` **tanpa memindahkan** dua hal itu akan **mematikan 3 fitur** yang tidak
berhubungan dengan dokumen.

### ⚙️ Pelaksanaan (❌ tanpa mesin baru)

| Bagian | Pelaksanaan |
|---|---|
| **Berkas BARU** | **`js/markdown.js`** — pengolah markdown dipindah dari `js/dokumen.js` ⇒ `window.ANodesMarkdown` (`keHtml` · `bisaMarkdown` · `benahiMarkdown` · `sudahHtml` · `aman`) |
| **Berkas BARU** | **`js/berkas.js`** — halaman **🗂️ Berkas Tersimpan** ⇒ `window.ANodesBerkas` (`buka` · `tutup` · `gambar` · `siapkanOtomatis`) |
| **Halaman BARU** | **`#berkas-halaman`** (anak `body`, sejajar catatan) — navbar `[🏠] 🗂️ Berkas Tersimpan [🌿 Kerja] [🗑 Bersihkan]` |
| **Tombol kepala** | `#btn-doc` **📄 Doc** → **`#btn-berkas` 🗂️ Berkas** |
| **Daftar rantai** | dipindah **utuh** dari `#doc-isi` ke `#bk-isi` — tiap baris tetap **🌿 Buka · + Ayat · 🗑** (jalur K40 tidak berubah) |
| **`js/editor.js`** | 4 tempat diarahkan ke **`window.ANodesMarkdown`** |
| **`plugin/ayat-terkait/kerja.js`** | `doc-alkitab` → **`berkas-halaman`** |
| **DIHAPUS** | `js/dokumen.js` · `js/dokumen-data.js` · `tools/siapkan-dokumen.js` · halaman `#doc-alkitab` |
| **`start.bat`** | langkah `siapkan-dokumen.js` **dibuang** |
| **`tools/buat-1-berkas.js`** | tidak lagi menyatukan `dokumen-data.js` |
| **Uji** | blok **K28h** (BARU · 42 uji) · blok **K40** & **RK12/RK15/RK16** disesuaikan · blok **Y** & **AG** ditulis ulang |

### 📊 HASIL TERUKUR

| Hal | Sebelum | Sesudah |
|---|---|---|
| **Berkas HP** | 42.944.496 B (**40,96 MB**) | **40.539.519 B (38,66 MB)** |
| **Hemat** | — | **2.404.977 B = 2,29 MB (−5,6 %)** |
| Tombol kepala | `📄 Doc` | **`🗂️ Berkas`** |
| Impor `.md` · “📖 Rapi” · rapikan tempelan | ✅ | ✅ **tetap jalan** (lewat `js/markdown.js`) |

| Uji | Hasil |
|---|---|
| **K28h** di `index.html` | ✅ **42 uji · 0 gagal · 20,2 dtk** |
| **K28h** di `ANodes-1berkas.html` | ✅ **42 uji · 0 gagal · 20,3 dtk** |
| Regresi **K99 + K86 + K98** | ✅ **107 uji · 0 gagal · 26,3 dtk** |
| Regresi **K92 + K93 + K96** | ✅ **94 uji · 0 gagal · 15,6 dtk** |

### 🐞 CACAT YANG KETEMU SAAT MENGUJI (jangan diulang)

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | Blok uji **tidak memasang plugin 📖 Alkitab** | **8 uji gagal palsu** (K28h-22…29) — `susunDariSimpanan()` butuh teks ayat dari mesin Alkitab ⇒ `kirimKeCatatan()` menolak | pasang **`alkitab`** dulu + `await ANodesAlkitab.muat()` (pelajaran K81/K90 terulang) |
| 2 | Uji **Y21** mengambil contoh naskah dari `window.ANodesDokumen.daftar` | variabel itu **sudah tidak ada** ⇒ blok Y error | contoh naskah **dibuat sendiri** di dalam uji |
| 3 | Uji **AG1–AG11** menguji kotak cari di `[Doc]` | halamannya sudah tidak ada ⇒ gagal | blok AG **ditulis ulang** menjadi pemeriksaan “fitur ikut terhapus + yang tetap ada” |

### ⚠️ PELAJARAN (WAJIB dibawa)

1. 🔴 **Sebelum menghapus sebuah halaman, UKUR dulu apa saja yang menumpang di dalamnya.**
   Menu `[Doc]` tampak “hanya penampil dokumen”, ternyata di dalamnya ada **daftar berkas
   tersimpan** + **pengolah markdown** yang dipakai **3 fitur lain**.
2. 🔴 **Mesin yang dipakai bersama WAJIB dipindah ke berkas sendiri** (`js/markdown.js`),
   ❌ jangan dibiarkan menumpang di berkas halaman yang akan dihapus.
3. **Menghapus halaman = menghemat ukuran.** Isi 5 berkas `.md` (±1,1 MB) tidak lagi ditanam
   ⇒ berkas HP **−2,29 MB**.
4. **Uji yang menyebut elemen halaman yang dihapus WAJIB ditulis ulang**, bukan dihapus —
   supaya tetap terbukti bahwa **yang seharusnya hilang sudah hilang** dan **yang seharusnya
   tetap ada masih ada**.
5. **Blok uji plugin WAJIB memasang pluginnya sendiri** (pelajaran K81 · K90 · K96 · **K28h**).

**Berkas:** `js/markdown.js` (BARU) · `js/berkas.js` (BARU) · `index.html` · `css/app.css` ·
`js/editor.js` · `plugin/ayat-terkait/kerja.js` · `start.bat` · `tools/buat-1-berkas.js` ·
`tools/uji-cepat.js` · `tools/uji-toolbar.js` · **`tools/uji-blok/K28h.js`** (BARU) ·
`rencanakerja.md` (**18.5**) · `agents.md` (**0a00d9y-n**) · `prompt.md` · `panduan.md` ·
💾 `backups/k28h-hapus-doc-20261103/`.

---

## 3 November 2026 — 📖 **K99 SELESAI: PLUGIN JUDUL PERIKOP (2.573 judul · 96,2 % pasal)**

> 💬 **Bapak 3 Nov 2026:** *“ngk usah deh ... ada lagi pelengkapan alkitab ?”* ⇒ saya **ukur
> seluruh lapisan Alkitab** lalu paparkan tabel celah; Bapak memilih **📖 Judul Perikop**.
> **⏱️ Perkiraan ±2 jam · nyata ±1 jam 10 menit.**

### 🔎 DIUKUR DULU (❌ bukan diduga) — celah seluruh lapisan Alkitab

| Lapisan | Cakupan | Sisa |
|---|---|---|
| 📖 Teks TB | **31.102 / 31.102 = 100 %** | 0 kosong · 0 urutan salah · 2.059 ayat merah |
| 🖊 Penguat | **31.102 / 31.102 = 100 %** | — |
| 📖 Sejarah kitab | **66 / 66 = 100 %** | — |
| 🗓️ Bacaan 1 Tahun | **1.189 / 1.189 = 100 %** | — |
| 🔀 Paralel AYT (K86) | **31.102 / 31.102 = 100 %** | — |
| 🗺️ Peta | 232 entri · semua punya rujukan | — |
| 📚 Kamus | 2.978 entri | 75 calon, **hampir semua salah tangkap** (`Kupilih` · `Taurat-Mu`) |
| 🔤 Interlinear | **30.449 / 31.102 = 97,9 %** | **653 ayat PL** (Daniel 160 = **Aram**, 1Taw 66, Ayub 64, Ezr 60, Neh 48, Yos 43, Mzm 38 …) · 9 ayat PB **tidak ada di TAGNT** |
| 🌿 Ayat Terkait | **29.362 / 31.102 = 94,4 %** | **1.740 ayat** — **batas sumber** OpenBible.info |
| 📖 **Judul perikop** | ❌ **0 % — belum ada sama sekali** | **2.547 judul** tersedia di sumber AYT |

⇒ **Yang paling murah & paling terasa = 📖 Judul Perikop** (data sudah ada di paket AYT K86).

### ⚙️ Pelaksanaan (❌ tanpa mesin baru untuk tampilan)

| Bagian | Pelaksanaan |
|---|---|
| Alat data BARU | **`tools/siapkan-data-perikop.js`** — baca `tools/_sumber-ayt/*.usfm` (sumber **SAMA** dengan K86) → `plugin/perikop/data/perikop.js` |
| Penanda diambil | **`\s1`** (judul utama) + **`\s2`** (sub-judul) · **`\d`** (keterangan pemazmur) **tidak** diambil |
| Mesin BARU | **`plugin/perikop/perikop.js`** → `window.ANodesPerikop` · IndexedDB kunci **`perikop`** · API sama pola plugin lain |
| Tampilan | **`plugin/perikop/tampilan.js`** → `window.ANodesPerikopTampilan` · `hias()` menyisipkan `.pk-judul` **sebelum baris ayat** · sub-judul `.pk-judul.pk-sub` · kaki atribusi `.pk-kaki` |
| Sambungan | **`tambahPenghias()` / `jalankanPenghias()`** milik plugin Alkitab (SUDAH ADA) ⇒ **plugin Alkitab tidak tahu** plugin Perikop ada |
| ❌ **TANPA tombol navbar** | **diukur:** navbar sudah **9 tombol · 324 = 324 px** ⇒ tombol ke-10 **meluber**. ON/OFF lewat **halaman keterangan plugin** (`pilihanTampil` `tampil` ⇄ `mati`, kunci **`anodes-perikop-cara`**) |
| CSS | blok **K99** di `css/app.css` — `.pk-judul` (cokelat `#6b4f29` · tebal 700 · garis kiri `inset 3px`) · `.pk-judul.pk-sub` · `.pk-kaki` |
| Versi | mesin **`v3Nov-a`** · tampilan **`v3Nov-a`** · halaman **`v3Nov-g`** |

### 📊 HASIL TERUKUR

| Hal | Bukti |
|---|---|
| Data | **66 kitab** · **2.573 judul** · **132,5 KB** · sidik **`pk-2573-6df3cabe`** |
| Cakupan pasal | **1.144 / 1.189 = 96,2 %** · 45 pasal tanpa judul (Imamat 22 · Ulangan 24 · Yosua 17 · Ayub 5/7/10/13/14/17/24/27/30/31 …) |
| Markus 1 | **9 judul** · pertama *“Pelayanan Yohanes Pembaptis”* **di atas ayat 1** |
| Gaya (getComputedStyle) | `display: block` · `color rgb(107,79,29)` · `font-weight 700` · `box-shadow inset 3px` · `18,75 px` |
| Mazmur 23 · Kejadian 1 · Amsal 22 | **1 · 1 · 1** judul (judul palsu Amsal **hilang**) |
| Imamat 22 (tanpa judul) | **0** — tidak error |
| Mati ⇄ tampil | ✅ 0 ⇄ 9 judul |
| Lepas plugin | **0 judul** · **45 ayat tetap utuh** · pasang lagi ⇒ **9 judul** kembali |
| Navbar | **tidak berubah** (tetap 9 tombol) |
| Uji | ✅ **42 uji K99 · 0 gagal · 9,0 dtk** (`index.html`) · **42 · 0 · 9,1 dtk** (`ANodes-1berkas.html`) |
| Regresi | ✅ **K86 42 · 0** · **K98 23 · 0** · **K92+K93 35 · 0** |
| HP `ANodes-1berkas.html` | **42.940.190 byte (40,96 MB)** |

### 🐞 2 CACAT NYATA yang ketemu (jangan diulang)

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | **Penomoran berkas eBible ≠ nomor kitab ANodes** — `02-GEN` = kitab **1**, `40-MAL` = kitab **39**, `70-MAT` = kitab **40**, `96-REV` = kitab **66**; **tidak ada** berkas `01-*` | percobaan pertama hanya menghasilkan **27 kitab** | peta eksplisit `eBible → ANodes` di alat data |
| 2 | **30 judul palsu di Amsal 22–24** — AYT memakai `\s2 "—1—"` … `"—30—"` untuk 30 amsal | tampil sebagai judul perikop tak bermakna | **`judulPalsu()`** — buang yang isinya hanya angka berpenggal `/^[—–\-\s]*\d+[—–\-\s]*$/` |

### 🐞 3 CACAT UJI (❌ bukan kode)

| # | Cacat | Perbaikan |
|---|---|---|
| 1 | K99-15 menuntut **13** judul di Mazmur 119 | kenyataannya **22** judul huruf Ibrani (Alef … Taw) |
| 2 | K99-32 menuntut jumlah tombol navbar tetap | jumlah tombol **tergantung plugin terpasang** di profil uji baru |
| 3 | K99-37 menuntut `.at-hias` ada | plugin 🌿 Ayat Terkait **tidak terpasang** di profil uji baru |

### ⚠️ PELAJARAN (WAJIB dibawa)

1. 🔴 **Penomoran berkas sumber bisa menipu.** eBible memakai **urutan kanon Protestan dengan
   celah** (tidak ada `01-*`), bukan nomor kitab. **Selalu cocokkan nama kitabnya.**
2. 🔴 **Judul “struktural” bisa bukan judul.** Amsal 22–24 memakai `\s2` untuk **nomor amsal**
   (`—1—` … `—30—`) ⇒ wajib disaring.
3. **Ukur navbar sebelum menambah tombol.** Terukur **324 = 324 px** ⇒ tombol ke-10 **pasti
   meluber** ⇒ ON/OFF lewat halaman keterangan plugin **lebih baik**.
4. **Sumber data yang sama bisa dipakai dua plugin.** K86 & K99 membaca `tools/_sumber-ayt/`
   yang sama ⇒ ❌ tidak perlu unduh ulang; **atribusi CC BY-NC** ikut ditulis di kaki kolom.
5. **Uji yang menuntut jumlah elemen global mudah gagal palsu** (jumlah tombol navbar,
   ada/tidaknya `.at-hias`) — bergantung plugin yang terpasang di profil uji baru.

---

## 3 November 2026 — 🔀 **K86 SELESAI: PLUGIN PARALEL TERJEMAHAN (TB ⇄ AYT)**

> 💬 **Bapak 3 Nov 2026:** memilih **AYT** sebagai versi pembanding.
> **⏱️ Perkiraan ±5 jam · nyata ±1 jam 20 menit.**

### 🔴 KOREKSI BESAR — TSI TIDAK BISA DIPAKAI (diukur, ❌ bukan diduga)

Rencana **18.3.1** menyebut **TSI** (`ind_usfm.zip` · 1.377.614 byte · CC BY-SA 4.0).
Setelah paketnya **diunduh & diurai** (66 berkas diperiksa satu per satu):

| Versi | Kitab | Ayat | Lisensi | Kesimpulan |
|---|---|---|---|---|
| **TSI** (`ind`) | **48** | 20.650 | CC BY-SA 4.0 | ❌ **18 kitab PL TIDAK ADA** — 1CH · 2CH · **JOB** · **PSA** · SNG · **JER** · LAM · **EZK** · **DAN** · HOS · JOL · AMO · OBA · MIC · NAM · HAB · ZEP · HAG |
| **AYT** (`indayt`) | ✅ **66** | ✅ **31.102** | CC BY-**NC** 4.0 | ✅ **dipakai** — jumlah ayat **persis sama** dengan TB ⇒ tiap ayat punya pasangan |
| **AGS** (`indags`) | 28 | — | — | ❌ PB saja + masih draft |

⚠️ AYT **non-komersial** ⇒ dipakai untuk **pemakaian pribadi**; atribusi **selalu** tampil di kaki halaman.

### 📐 BENTUK — BERTUMPUK per ayat (❌ bukan 2 kolom)

Diukur 3 Nov 2026: `.app` ANodes **selalu gaya HP** (maks **480px**), ruang tulis ayat **±440px**
⇒ dua kolom = **±220px/kolom** (baris jadi 3–4 kata). Jadi tiap ayat TB diberi **kotak AYT di bawahnya**
(latar `#f2f6fd` · garis kiri `inset 3px #7d9bd4` · label **AYT**).

### ⚙️ Pelaksanaan

| Bagian | Pelaksanaan |
|---|---|
| Alat data BARU | **`tools/siapkan-data-paralel.js`** — urai 66 USFM AYT → `plugin/paralel/data/paralel.js` |
| Mesin BARU | **`plugin/paralel/paralel.js`** → `window.ANodesParalel` · IndexedDB kunci **`paralel`** |
| Tampilan BARU | **`plugin/paralel/tampilan.js`** → `window.ANodesParalelTampilan` · tombol **`#baca-paralel`** di `.ay-nav-b1` (pola 🔖 K82 / 📅 K97) |
| Keterangan | **`plugin/paralel/plugin.js`** — kartu 🔀 di gudang plugin |
| Sambungan resmi BARU | **`ANodesAlkitabTampilan.lepasPenghias(fn)`** — plugin bisa **menarik** penghiasnya saat dilepas |
| CSS | blok **K86** di `css/app.css` — `.pr-kotak` · `.pr-label` · `.pr-teks` · `.pr-kaki` · `#baca-paralel` (+`.nyala`) |
| `index.html` | ➕ 4 tag `<script>` (data → mesin → keterangan → tampilan) |
| Versi | tampilan paralel **`v3Nov-a`** · Alkitab **`v2Nov-a` → `v3Nov-f`** · halaman **`v3Nov-e` → `v3Nov-f`** |

### 🐞 3 CACAT PENGURAI yang ketemu & diperbaiki (jangan diulang)

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | **Tabel USFM** (`\tr` `\tc1` `\tc2`) tidak diurai | **Wahyu 7:5–8 hilang** (4 ayat) | tambah cabang `\tc`/`\th` ⇒ **31.102 ayat (selisih 0)** |
| 2 | **Baris puisi** (`\q1` `\q2`) tidak dianggap lanjutan ayat | **isi Mazmur HILANG** — terukur Mzm 23:1 = *“Nyanyian Daud.”* saja | tambah cabang `\q1-4` · `\m` · `\mi` · `\pi` · `\li` · `\pc` · `\nb` · `\p` |
| 3 | AYT menulis ayat **DIGABUNG** sebagai `(22:9)` saja | 3 ayat tampil `(22:9)` mentah (Yes 22:10 · 22:11 · 22:18) | diganti **“— (pada AYT ayat ini digabung dengan ayat 9)”** |

### 📊 HASIL TERUKUR

| Hal | Angka |
|---|---|
| Data AYT | **66 kitab · 1.189 pasal · 31.102 ayat** · **5.073,4 KB** · sidik **`ayt-66-31102-8b98ec85`** |
| Selisih dengan TB | ✅ **pasal 0 · ayat 0** |
| Mutu teks | **0** sisa penanda USFM · **0** ayat kosong · panjang **15–482** huruf |
| Kotak AYT | **36 kotak / 36 ayat** (Yohanes 3) · **6 / 6** (Mzm 23) |
| Gaya kotak | `display: block` · latar **`rgb(242,246,253)`** · garis kiri `inset 3px` · label **AYT** |
| Kaki atribusi | *“Alkitab Yang Terbuka © YLSA-AYT · CC BY-NC 4.0 · dipakai untuk pemakaian pribadi (non-komersial)”* |
| Navbar | **tidak meluber** di **320 · 344 · 360 · 420 · 480 px** |
| Lepas plugin | tombol & kotak **hilang** · ayat TB **tetap utuh** · pasang lagi ⇒ hidup kembali |
| Uji | ✅ **42 uji K86 · 0 gagal · 13,3 dtk** (`index.html`) · **42 · 0 · 13,5 dtk** (`ANodes-1berkas.html`) |
| Regresi | ✅ **K98 23 · 0** · **K92+K93 35 · 0** · ⚠️ **K96-34 gagal bila dijalankan SESUDAH K98** — **terbukti bukan regresi K86** |
| HP `ANodes-1berkas.html` | **41.747,9 KB (40,77 MB)** |

### ⚠️ PELAJARAN (WAJIB dibawa)

1. 🔴 **Periksa CAKUPAN paket data sebelum memilihnya.** Rencana menyebut TSI “Alkitab lengkap” —
   kenyataannya **48 kitab**. Yang membuktikan hanya **mengunduh & menghitung** (`\id` per berkas).
2. 🔴 **Pengurai USFM wajib menangani TABEL & PUISI.** Tanpa cabang `\tc` ⇒ **4 ayat hilang**;
   tanpa cabang `\q1` ⇒ **isi Mazmur hilang** (hanya judulnya tersisa). Keduanya **tidak
   menimbulkan error** — hanya teks yang diam-diam kosong.
3. **Selisih jumlah ayat = alat pemeriksa terbaik.** `31.098 vs 31.102` langsung menunjukkan
   ada 4 ayat hilang; tanpa pembanding TB, cacat itu tidak akan terlihat.
4. **Uji berurutan bisa gagal palsu.** K96-34 gagal **hanya** kalau dijalankan sesudah K98 —
   dibuktikan dengan mengembalikan berkas ke versi tanpa perubahan saya ⇒ **tetap gagal**.
   ⇒ **selalu buktikan regresi dengan membandingkan**, ❌ jangan menuduh perubahan sendiri.

**Berkas:** `tools/siapkan-data-paralel.js` (BARU) · `plugin/paralel/{paralel,tampilan,plugin}.js` (BARU) ·
`plugin/paralel/data/paralel.js` (hasil alat) · `plugin/alkitab/tampilan.js` (`lepasPenghias` + `VERSI`) ·
`css/app.css` (blok K86) · `index.html` (4 tag + penanda) · `tools/uji-blok/K86.js` (BARU · 42 uji) ·
`rencanakerja.md` (**18.3.3** · papan B & D) · `agents.md` (**0a00d9y-l**) · `prompt.md` · `panduan.md`.

---
## 3 November 2026 — 🔤 **K98 SELESAI: PANEL ARTI STRONG MUNCUL TEPAT DI BAWAH BARIS YANG DIKLIK**

> 💬 **Bapak 3 Nov 2026** (dengan tangkapan layar kolom interlinear): *“mau revisi satu lagi
> kata - yunani — misal γρηγορῶν (grēgorōn) G1127 < klik > **jatuh keterangan jauh** apalagi
> kata banyak keterangan ada dibawah — **maunya selalu ada dibawah** .. supaya mempermudah
> pada saat di baca”*

### 🔎 SEBAB TUNGGAL (diukur, ❌ bukan diduga)

`gambarKolom()` membuat **SATU** `.il-panel` lalu menempelkannya di **UJUNG kolom**
(`kolom.appendChild(panel)`). `tampilStrong()` hanya **mengisi** panel tetap itu
⇒ berapa pun baris yang diklik, keterangan **selalu** muncul di dasar kolom.
Terukur: chip di baris ke-16 dari 32 ⇒ keterangan **511 px** di bawah barisnya.

### ⚙️ Pelaksanaan (❌ tanpa mesin baru)

| Bagian | Pelaksanaan |
|---|---|
| `gambarKolom()` | panel **tidak lagi** dibuat di ujung kolom |
| Chip Strong | pengait klik meneruskan **`baris`** (❌ bukan `kolom`) ⇒ `tampilStrong(nm, baris, kitab)` |
| **`tampilStrong()`** | **ditulis ulang** — panel dibuat **saat chip diklik**, disimpan di `baris._ilPanel`, disisipkan **`insertBefore(panel, baris.nextSibling)`** ⇒ **TEPAT di bawah barisnya** |
| Satu slot | semua `.il-panel` di kolom **`.remove()`** dulu ⇒ pindah, ❌ tidak menumpuk |
| Toggle | klik nomor yang **sama** ⇒ panel **tertutup** |
| `css/app.css` | `.baca-isi .il-panel` — margin **`3px 0 9px`** · garis kiri **`3px solid #d8b96a`** |
| Versi | tampilan interlinear **`v3Nov-d` → `v3Nov-e`** |
| Uji | `tools/uji-blok/K98.js` (**BARU** · 23 uji) · `K85t2.js` — penanda versi + **K85t2-34b** |

### 📊 HASIL TERUKUR

| Hal | Sebelum | Sesudah |
|---|---|---|
| **Jarak panel ke baris yang diklik** | **511 px** | ✅ **3 px** |
| Posisi panel | ujung kolom | ✅ `previousElementSibling` = baris chip-nya |
| Klik chip baris lain | terisi di dasar | ✅ **PINDAH** · tetap **1 panel** |
| Klik chip yang sama | tidak menutup | ✅ **tertutup** |
| Gaya | tanpa penanda | ✅ garis kiri **3 px** `#d8b96a` · latar `rgb(255,253,245)` |
| Uji K98 | — | ✅ **23 uji · 0 gagal · 9,7 dtk** (index.html) · **23 · 0 · 9,9 dtk** (HP) |
| Regresi K85t2 | 51 uji | ✅ **52 uji · 0 gagal · 14,0 dtk** (index.html) · **52 · 0 · 14,2 dtk** (HP) |
| Bukti nyata | — | 1 Petrus 5:8 → chip **G1127** ⇒ panel *“G1127 · γρηγορεύω · grēgoreúō — berjaga-jagalah · …”* tepat di bawah γρηγοροῦντες |
| Tangkapan layar | — | `artifacts/k98-panel-dibawah.png` |

### 🐞 CACAT YANG KETEMU (jangan diulang)

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | panel lama hanya **`hidden = true`** | `.il-panel` **menumpuk** di DOM ⇒ **2 panel** (uji K98-20) | **`.remove()`** — buang dari DOM |
| 2 | uji mencari jumlah pasal di **`meta.kitab[].pasal`** | properti itu **TIDAK ADA** ⇒ loop tidak jalan ⇒ **0 ayat uji** | pakai **`ANodesAlkitab.jumlahPasal(k)`** |
| 3 | uji memeriksa panel sebagai anak langsung **`.il-kolom`** | panel ada di dalam **`.il-daftar`** ⇒ gagal palsu | bandingkan dengan **indeks baris terakhir di induk panel** |

⚠️ **PELAJARAN:** **`hidden = true` ≠ “dibuang”.** Elemen tersembunyi tetap ada di DOM — bisa
terhitung uji, bisa tampil lagi, dan memakan tempat. Kalau maksudnya “ganti”, pakai **`.remove()`**.

---

## 3 November 2026 — 📅 **K97 SELESAI: TOMBOL BACAAN 1 TAHUN DI NAVBAR HALAMAN BACA ALKITAB**

> 💬 **Bapak 3 Nov 2026** (dengan tangkapan layar navbar): *“saya mau minta bacaan di tempatkan
> di dalam menu seperti yg pasted image ada panah”*

### 🔎 KEADAAN SEBELUM (diukur di Chrome)

| Hal | Isi |
|---|---|
| Navbar baris 1 | `🏠 · [kitab▾] · 📋 PILIH · 🔍 Cari · 🔖 · 📤 · 🖊` |
| Pintu ke Bacaan 1 Tahun | ❌ **hanya lewat 🧩 gudang plugin** (2 langkah) |

### ⚙️ Pelaksanaan (❌ tanpa mesin baru)

| Bagian | Pelaksanaan |
|---|---|
| `plugin/baca1tahun/tampilan.js` | ➕ **`pasangTombolNavbar()`** — `#baca-bacaan` ke `.ay-nav-b1` (**pola SAMA** seperti 🔖 Bookmark K82) |
| | ➕ **`segarkanTombolNavbar()`** — ikon **📅 belum dibaca** ⇄ **✅ sudah dibaca** |
| | ➕ **`bukaDariAlkitab()`** · **`pulihDariAlkitab()`** · **`daftarkanPemulih()`** — 🏠 kembali ke **HALAMAN BACA** |
| `siapkanOtomatis()` | memanggil keduanya (WAJIB — pelajaran **K92**) |
| `css/app.css` | blok **K97** — latar hijau muda `#eef7ea` · `min 44×44 px` di layar sentuh |
| Versi | tampilan baca1tahun **`v3Nov-a` → `v3Nov-b`** |

### 📊 HASIL TERUKUR

| Hal | Bukti |
|---|---|
| Urutan navbar | `baca-kembali · baca-kitab · baca-pilih · baca-ketik · **baca-bacaan** · baca-bookmark · baca-kirim · baca-penguat` |
| Ikon | **📅** belum dibaca · **✅** sudah dibaca |
| Gaya | latar `#eef7ea` · garis `rgb(182,213,171)` · `cursor: pointer` |
| Navbar tidak meluber | **464 ≤ 464 px** · juga **344 px** (Z Fold tutup) |
| Klik 📅 | halaman 🗓️ terbuka · Alkitab tertutup |
| 🏠 | kembali ke **HALAMAN BACA** (bukan catatan) |
| Uji | ✅ **59 uji · 0 gagal · 7,7 dtk** (index.html) · 59 · 0 di 344 px · 59 · 0 di `ANodes-1berkas.html` |
| Regresi | ✅ K92 17 · K90i 17 · 0 gagal |
| HP `ANodes-1berkas.html` | **37.464.644 byte (35,73 MB)** |

### 🐞 CACAT YANG KETEMU (jangan diulang)

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | `bukaDariAlkitab()` **menyembunyikan `#baca-alkitab` lebih dulu** | `bukaHalaman()` mencatat asal = `#app-utama` ⇒ 🏠 kembali ke **catatan** (uji **K97-14** gagal) | **jangan** sembunyikan dulu — `bukaHalaman()` yang mencari halaman tampil |
| 2 | indenasi blok baru 4 spasi berlebih | kode sulit dibaca | dirapikan |

⚠️ **PELAJARAN:** **`bukaHalaman()` mencari sendiri halaman asal** dari `body > .app` yang masih
tampil. Menyembunyikan halaman lama **sebelum** memanggilnya **membuat asal hilang**.

**Berkas:** `plugin/baca1tahun/tampilan.js` · `css/app.css` · `tools/uji-blok/K96.js` (59 uji) ·
`index.html` · `ANodes-1berkas.html` · `rencanakerja.md` · `agents.md` · `prompt.md` · `panduan.md`.

---
## 3 November 2026 — 🗓️ **K96 SELESAI: PLUGIN BACAAN ALKITAB 1 TAHUN (3 RENCANA · 365 HARI · 100 %)**

> 💬 **Bapak 3 Nov 2026:** *“ada satu plugin yg belum selesai tapi ada "pengingat firman" ·
> saya mau buat bacaan 1 th alkitab artinya 1th baca selesai semua.. setiap hari ntah berapa
> pasal.. pasal2 yg di beri tentu user sudah dilengkapi banyak referensi .. kemungkinan baca
> 1 tahun akan lebih menyenangkan.. apakah km bisa menenukan daftar baca alkitab... dan ini
> jika diaktifkan akan berjalan setiap hari.. dari pada pengingat firman bagaimana menurut km”*
> lalu *“apakah di internet ada menyediakan API untuk ini bisa km carikan yg bagus.. jika
> bahasa inggris harus diterjemahkan dalam bahasa indonesia”*
> ➕ jawaban pertanyaan saya: rencana = **ketiganya** · letak = **halaman sendiri** · sinkron = **ya**

### 🔎 DIUKUR DULU (❌ bukan diduga)

| Hal | Angka |
|---|---|
| Alkitab ANodes | **66 kitab · 1.189 pasal · 31.102 ayat** |
| PL · PB | **929 pasal · 23.145 ayat** · **260 pasal · 7.957 ayat** |
| Rata-rata 1 tahun | **3,26 pasal/hari** atau **85,2 ayat/hari** |
| Referensi yang **sudah ada** tiap pasal | 🖊 penguat · 📚 kamus · 🌿 ayat terkait · 🗺️ peta · 🔤 interlinear ⇒ ✅ **permintaan “pasal sudah dilengkapi referensi” SUDAH terpenuhi** |

**🌐 Riset 6 rencana baca dari internet — diukur dengan data ANodes sendiri:**

| Sumber | Hari | Pasal tercakup | Ayat/hari | Ringan | Berat |
|---|---|---|---|---|---|
| ⭐ Every Day In the Word | 365 | **1.181 / 1.189 = 99,3 %** | 51–158 | 11 | 9 |
| One Year Chronological | 365 | 1.135 = 95,5 % | 26–234 | 18 | 14 |
| M'Cheyne (1842) | 365 | 1.083 = 91,1 % | 56–252 | 1 | **126** ⚠️ |
| Through The Bible | 365 | 621 = 52,2 % | 11–169 | 279 | 12 |
| Old and New Testament | 365 | 657 = 55,3 % | 18–169 | 266 | 15 |
| Back to the Bible | 365 | 503 = 42,3 % | 2–287 | 301 | 9 |

🔴 **TEMUAN PENTING:** kebanyakan rencana terkenal **TIDAK** mencakup seluruh Alkitab dalam
setahun — mereka memakai perikop pilihan. ⇒ ANodes **membangun ketiga rencananya sendiri**
dari data Alkitab ⇒ **100 % cakupan** tiap rencana.

⚠️ **ANodes berjalan `file://` tanpa internet** ⇒ ❌ tidak bisa memanggil API saat dipakai.
Yang benar: **unduh sekali → tanam ke data** (pola sama seperti Alkitab · penguat · interlinear).

### ⚙️ Pelaksanaan (❌ tanpa mesin Alkitab baru)

| Bagian | Pelaksanaan |
|---|---|
| **Alat data BARU** | **`tools/siapkan-data-baca.js`** — baca `plugin/alkitab/data/alkitab-tb.js` → 3 rencana × 365 hari |
| **Algoritma** | `hari = floor((jalan + ayat/2) / (TOTAL/hari))` = tiap pasal masuk hari **titik tengah imbasnya** · ❌ bukan “tumpuk sampai ≥ target” (itu salah — hasilnya cuma 27 hari) |
| **Data** | `plugin/baca1tahun/data/baca.js` — **212,9 KB** · sidik **`bc-365-3-f704d134`** |
| **Mesin BARU** | `plugin/baca1tahun/baca.js` → `window.ANodesBaca` · IndexedDB kunci **`baca1tahun`** · progres localStorage **`anodes-baca1tahun-v1`** |
| **Halaman BARU** | **ke-10** `#baca1tahun-halaman` (anak `body`) · `.bt-*` di `css/app.css` |
| **Tampilan** | kartu **hari ini** (+ besok) · **progres** · **🔥 berturut-turut** · pilih **3 rencana** · **kalender 365 sel** · tombol **📖 Buka di Alkitab** + **📖 per baris blok** |
| **Buka di Alkitab** | memakai **`bukaRentang()`** / `gambarPasal()` yang SUDAH ADA ⇒ ❌ tanpa mesin baru |
| **Ganti kartu plugin** | 🕊️ **Pengingat Firman DILEPAS** (tag `<script>` **dihapus** dari `index.html`) ⇒ digantikan 🗓️ **Bacaan Alkitab 1 Tahun** |
| **Sinkron** | `js/sinkron.js` ➕ `'anodes-baca1tahun-v1'` ⇒ **6 kunci** · `VERSI` `v3Nov-a` |
| **Versi** | mesin **`v3Nov-a`** · tampilan **`v3Nov-a`** · halaman **`v3Nov-e`** |

### 📊 HASIL TERUKUR

| Rencana | Jalur | Cakupan | Ayat/hari | Ringan (<60) | Berat (>130) |
|---|---|---|---|---|---|
| 🅰️ **`urut`** Kejadian→Wahyu | 1 | **1.189/1.189 = 100 %** | **28–176 (tengah 85)** | **17** | **1** ✅ |
| 🅱️ **`plpb`** PL + PB tiap hari | 2 | **100 %** | 26–207 (tengah 85) | 57 | 13 |
| ⭐ **`edw`** PL + PB + Mzm + Amsal | 4 | **100 %** | 22–259 (tengah 84) | 63 | 23 |

**Contoh nyata 🅰️:** hari 1 = **Kejadian 1–3 (80 ayat)** · hari 181 = **Mazmur 89–92 (100 ayat)** ·
hari 365 = **Wahyu 19–22 (84 ayat)**.

| Hal | Bukti |
|---|---|
| Halaman | **10** (`body > .app`) · `#baca1tahun-halaman` anak `body` ✅ |
| Kalender | **365 sel** · sel bisa diklik (`cursor: pointer`) |
| Label | “Kejadian 1–3” (nama kitab **sekali**) · “Kejadian 50 – Keluaran 2” (beda kitab) |
| Tombol tandai | “○ Tandai sudah dibaca” ⇄ “✓ Sudah dibaca” |
| Lepas plugin | halaman tertutup · pasang lagi ⇒ hidup kembali ✅ |
| Uji | ✅ **44 uji · 0 gagal · 6,2 detik** di `index.html` **dan** `ANodes-1berkas.html` |
| Regresi | ✅ **K90i 17 uji · 0 gagal** · ✅ **K85t2 51 uji · 0 gagal** |
| HP `ANodes-1berkas.html` | **37.425.110 byte (35,69 MB)** |

### 🐞 CACAT YANG KETEMU & DIPERBAIKI (jangan diulang)

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | `saring` dipanggil dengan **objek pasal**, bukan **nomor kitab** | rencana `plpb` & `edw` **0 pasal** | `.filter(c => j.saring(c.k))` |
| 2 | `edw` menghitung **Mazmur & Amsal dua kali** (1.370 pasal) | cakupan > 100 % | jalur `pl` → **`PL_TANPA_PUISI`** |
| 3 | `plpb` & `edw` jadi **identik** sesudah perbaikan #2 | dua tombol tanpa beda | `plpb` 2 jalur · `edw` **4 jalur** |
| 4 | 🔴 **`SyntaxError: Identifier 'cekUnik' has already been declared`** | blok uji **tidak pernah jalan** ⇒ alat menunggu 90 dtk & lapor “hasil tidak muncul” | buang deklarasi kedua · **`node --check` DULU** kalau blok tidak mengeluarkan hasil |
| 5 | `K96-07` memakai **batas pasal karangan (200)** | 9.092 pasal (harusnya 1.189) | pakai `M.daftarPasalBlok(b, infoKitab)` |
| 6 | Label “**Kejadian 1 – Kejadian 3**” | nama kitab diulang | ditulis **sekali** bila kitab sama |
| 7 | Tombol tandai **selalu** “✓ Sudah dibaca” | pengguna tidak tahu harus menekan apa | “○ Tandai sudah dibaca” ⇄ “✓ Sudah dibaca” |
| 8 | Hanya **satu** tombol 📖 untuk seluruh hari | PL & PB tidak bisa dibuka satu-satu | ➕ tombol **📖 per baris blok** |
| 9 | `<script>` pengingat **dikomentari** `<!-- … -->` | penggabung HP **ikut menyatukan isinya** jadi komentar HTML ⇒ berkas membengkak | tag **DIHAPUS** dari `index.html` (berkas plugin tetap ada) |

⚠️ **PELAJARAN (WAJIB dibawa):**
1. **Blok uji yang tidak mengeluarkan hasil apa pun hampir selalu SyntaxError** — jalankan
   `node --check tools/uji-blok/<NAMA>.js` **sebelum** mencurigai timeout.
2. **Rencana baca terkenal tidak mencakup seluruh Alkitab** — ukur dulu, jangan percaya nama.
3. **`file://` tidak bisa memanggil API** ⇒ unduh sekali, tanam ke data.
4. **`<!-- <script src> -->` tetap disatukan penggabung versi HP** ⇒ kalau ingin mematikan,
   **hapus tag-nya**, jangan dikomentari.

**Berkas:** `tools/siapkan-data-baca.js` (BARU) · `plugin/baca1tahun/{baca,plugin,tampilan}.js` (BARU) ·
`plugin/baca1tahun/data/baca.js` (hasil alat) · `index.html` · `css/app.css` · `js/sinkron.js` ·
`tools/uji-blok/K96.js` (BARU) · `tools/uji-toolbar.js` · `rencanakerja.md` · `agents.md` · `prompt.md` · `panduan.md`.

---
## 3 November 2026 — 🧹 **K95b SELESAI: DATA GANDA DIBUANG ⇒ BERKAS HP 44,22 → 35,41 MB (−8,81 MB)**

> 💬 **Bapak 3 Nov 2026:** *“saya mau tanyakan jika di runing di hp.. dengan size file apk cukup
> besar .. apakah akan mempengaruhi kelancaran (tidak lag) konsep aplikasi plugin apakah ini
> menolong untuk lancara walau size cukup besar”* lalu *“bisa dikecil 8,33 itu sepadan ngk ?
> dengan ukuran seperti itu.. kalau hanya pengaruh sedikit lebih baik ngk usah”*

### 🔎 DIUKUR DULU (❌ bukan diduga) — **6 berkas data masuk DUA KALI**

| Hal | Angka |
|---|---|
| Blok `<script>` di `ANodes-1berkas.html` | **55** |
| Isi skrip seluruhnya | **44,79 MB** |
| Berkas | **44,22 MB** |
| **Blok data yang muncul 2×** | **6** — `ANodesPetaData` · `ANodesPetaBumi` · `ANodesInterlinearData` · `ANodesYunaniData` · `ANodesIbraniData` · `ANodesPbData` |
| Terbukti **byte-identik** | ✅ **YA** (semuanya) |

**Sebabnya (diperiksa, ❌ bukan diduga):** 6 berkas data itu **sudah ada di `index.html`**
(`<script src="plugin/…/data/….js">`) **DAN** disisipkan **lagi** oleh bagian **3f–3k**
`tools/buat-1-berkas.js` di akhir berkas ⇒ isinya masuk **dua kali**.

### ⚙️ Perbaikan (❌ tanpa mesin baru)

| Bagian | Pelaksanaan |
|---|---|
| `tools/buat-1-berkas.js` | ➕ **`sudahInline`** (Set) — mencatat berkas yang **sudah** disisipkan di tempat aslinya (langkah 2) |
| Bagian **3f–3k** | penjaga **`&& !sudahInline.has(DATA_…)`** ⇒ **tidak** disisipkan dua kali |
| Keterangan | berbunyi *“sudah menyatu di tempat aslinya — tidak disisipkan dua kali”* |
| ⚠️ Urutan tetap | data **di tempat aslinya** (sebelum mesin) — mesin membaca `window.ANodes*Data` **saat dimuat** |

### ✅ Hasil terukur (Chrome headless · 3 putaran · 420×900)

| Hal | Sebelum | Sesudah |
|---|---|---|
| Berkas HP | 46.373.062 B (**44,22 MB**) | **37.131.931 B (35,41 MB)** |
| **Hemat** | — | **9.241.125 B = 8,81 MB (−19,9 %)** |
| Blok `<script>` | 55 | **49** |
| Isi skrip | 44,79 MB | **34,47 MB** |
| **DCL (muat)** | 2.179 · 2.210 ms | **1.749 · 1.714 · 1.726 ms** |
| **load** | 2.200 · 2.228 ms | **1.765 · 1.731 · 1.744 ms** |
| **Heap (RAM)** | 141 MB | **111 MB (−30 MB)** |
| Data tetap utuh | — | ✅ `peta 12` · `bumi 3` · `pb 3` · `ibrani 3` |

| Uji | Hasil |
|---|---|
| **K85t2** di `ANodes-1berkas.html` | ✅ **51 uji · 0 gagal · 14,1 dtk** |
| Regresi **K90i** | ✅ **17 uji · 0 gagal · 9,7 dtk** |

### ⚠️ PELAJARAN (WAJIB dibawa)

1. 🔴 **Berkas yang sudah ada di `index.html` ❌ JANGAN disisipkan lagi oleh pembangun.**
   Cacat ini **tidak terlihat** di PC (di sana berkas dibaca terpisah) — hanya muncul di
   **versi HP**. ⇒ **selalu periksa jumlah blok `<script>`** sesudah membangun.
2. 🔴 **Ukuran berkas MEMANG berpengaruh** — terukur **−8,81 MB ⇒ muat −450 ms & RAM −30 MB**.
   Jadi menjawab pertanyaan Bapak: **sepadan**, bukan “pengaruh sedikit”.
3. **Cara memeriksa sendiri:** hitung blok `<script>` yang memuat `window.ANodes\w+Data` —
   kalau ada nama yang muncul **2×**, itu data ganda.
4. **`ANodesPlug` (9×) & `ANodesDokumen` (2×) BUKAN ganda** — `ANodesPlug` = 9 berkas
   keterangan plugin yang masing-masing `push`; `ANodesDokumen` = data + mesin (beda isi).

**Berkas:** `tools/buat-1-berkas.js` · `ANodes-1berkas.html` ·
💾 `backups/k95b-buang-data-ganda-20261103-135055/`.

---

## 3 November 2026 — 🔤 **K85 TAHAP 2 SELESAI: INTERLINEAR PERJANJIAN BARU (Kisah 26 s/d Wahyu)**

> Bapak memilih **Tahap 1** sesudah saya paparkan hasil ukur: celah **Kisah 26 s/d Wahyu**
> = **3.271 ayat** yang **tidak punya teks Indonesia per ayat** (sumber `idkjv` hanya
> 4 Injil + Kisah 1–25). Bentuk kolomnya karena itu **berbeda** — dan Bapak sudah
> menyetujui **Bentuk B** lewat contoh `artifacts/contoh-pb-interlinear.html`.

### 🔎 DIUKUR DULU (❌ bukan diduga)

| Hal | Angka |
|---|---|
| Ayat Kisah 26 s/d Wahyu | **3.271** |
| Nomor Strong unik di situ | **3.781** |
| Sudah punya arti Indonesia (dari K85) | **1.383** |
| Kata fungsi (memang dilewati) | **124** |
| Bisa diisi otomatis (lemma sama) | **251** |
| **Benar-benar perlu ditulis** | **2.023** |
| Kata isi **≥ 5×** (target tahap 1) | **355** → **94 %** kemunculan kata isi terjelaskan |
| Dari 355 itu: bisa otomatis | **128** |
| Dari 355 itu: **perlu ditulis** | **227** |

### ⚙️ Pelaksanaan

| Bagian | Pelaksanaan |
|---|---|
| Alat data BARU | **`tools/siapkan-data-pb.js`** — baca `tools/_tagnt/TAGNT-Act-Rev.txt` (STEPBible TAGNT, CC BY 4.0) + `tools/pb-penjelasan.json` + pakai ulang lex 4 Injil & K88 ⇒ `plugin/interlinear/data/pb.js` |
| Sumber arti BARU | **`tools/pb-penjelasan.json`** — **227 entri** `{tb}` ditulis tangan dari glosa Inggris + pemakaian nyata |
| Mesin BARU | **`plugin/interlinear/pb.js`** → `window.ANodesPb` · IndexedDB kunci **`pb`** · API sama dengan `ANodesInterlinear` (`muat/siap/meta/ayat/petaPasal/strong/arti/…`) |
| **DUA BENTUK kolom** | `tampilan.js → bentukUntuk(kitab)` = **`40–43 ⇒ 'A'`** (kata Indonesia ⇄ Yunani) · **`44–66 ⇒ 'B'`** (Yunani + alih huruf + arti Indonesia) |
| Bentuk B | baris = `θύραν (thuran) [G2374] pintu` · atribusi **STEPBible TAGNT (CC BY 4.0)** di kaki kolom |
| `plugin.js` | `saatDipasang`/`saatDilepas` ikut memuat & melepas `ANodesPb` · versi **1.1 → 1.2** · ukuran **±4,6 → ±7,6 MB** · angka kartu diperbarui |
| `index.html` | ➕ `<script src="plugin/interlinear/data/pb.js">` + `<script src="plugin/interlinear/pb.js">` |
| `tools/buat-1-berkas.js` | ➕ bagian **3k** menyisipkan data PB (**2.538,7 KB**) |
| Versi | mesin PB **`v3Nov-b`** · tampilan **`v3Nov-a` → `v3Nov-b`** |

### ✅ Hasil terukur

| Hal | Bukti |
|---|---|
| Data PB | **4.170 ayat** · **4.400** nomor Strong · **3.364** entri arti · **3.059 KB** |
| Sidik | **`pb-4170-3364-cd66c7eb`** |
| Kisah 26:1 | **19 kata** · `Ἀγρίππας (Agrippas) [G0067] Agripa` |
| Wahyu 3:20 | **29 kata** · `θύραν (thuran) [G2374] pintu` |
| 4 Injil | ✅ **tetap Bentuk A** (`.il-kata`, tanpa `.il-yunani`) |
| Kisah 26 s/d Wahyu | ✅ **Bentuk B** (`.il-yunani` + `.il-alih` + `.il-arti`) |
| Nomor Strong diklik | ✅ panel arti terbuka |
| Lepas plugin | ✅ tombol & kolom hilang · Alkitab tetap utuh · pasang lagi ⇒ muncul lagi |
| Uji | ✅ **43 uji K85t2 · 0 gagal** (13,7 dtk) di `index.html` **dan** `ANodes-1berkas.html` |
| Uji regresi | ✅ **17 uji K90i · 0 gagal** (9,7 dtk) |
| HP `ANodes-1berkas.html` | **44.748,1 KB (43,70 MB)** |

### ⚠️ PELAJARAN (WAJIB dibawa)

1. 🔴 **Satu plugin bisa punya DUA bentuk kolom** — dipilih dari **nomor kitab**, bukan dari
   dua tombol berbeda. Pengguna tidak perlu menghafal; `bentukUntuk(kitab)` yang memutuskan.
2. 🔴 **Sumber data bisa TIDAK LENGKAP tanpa terlihat.** `idkjv` mengaku “Indonesia + Strong”
   tetapi **hanya 4 Injil + Kisah 1–25** (terukur: Kisah berhenti di **25:9**). Selalu
   **hitung cakupan per kitab**, ❌ jangan percaya deskripsi repo.
3. **Arti Indonesia tetap ditulis TANGAN** (227 entri) — glosa Inggris dari TAGNT hanya
   bahan; arti yang dipakai adalah kata yang benar-benar dipakai penerjemah.
4. **128 dari 355 kata bisa diisi otomatis** dari **lemma yang sama** dengan 4 Injil
   ⇒ hemat 36 % pekerjaan. Periksa tumpang-tindih lemma SEBELUM menulis.
5. **Atribusi lisensi WAJIB di kaki kolom** — STEPBible TAGNT menuntut CC BY 4.0.

**Berkas:** `tools/siapkan-data-pb.js` (BARU) · `tools/pb-penjelasan.json` (BARU · 227 entri) ·
`plugin/interlinear/pb.js` (BARU) · `plugin/interlinear/data/pb.js` (hasil alat) ·
`plugin/interlinear/tampilan.js` · `plugin/interlinear/plugin.js` · `index.html` ·
`css/app.css` · `tools/buat-1-berkas.js` · `tools/uji-blok/K85t2.js` (BARU · 43 uji) ·
`artifacts/contoh-pb-interlinear.html` (contoh bentuk) ·
💾 `backups/k85pb-tahap1-20261103-112146/`.

### ⏭️ SISA (menunggu perintah)

| Tahap | Isi | Hasil | Perkiraan |
|---|---|---|---|
| **2** | +803 kata (2–4×) | **95,1 %** | ±4 jam |
| **3** | +1.398 kata (1× + 67 sisa) | **100 %** | ±6 jam |

## 3 November 2026 — 🔤 **K85 TAHAP 3 SELESAI: 1.398 ARTI BARU ⇒ CAKUPAN PB 95,1 % → 100 %**

> Bapak: *“lanjut sampai selesai”* ⇒ dikerjakan **satu giliran penuh** (ukur → tulis → bangun → uji → build → dokumen).
> **⏱️ Perkiraan yang saya sebut di awal: ±6 jam** · **nyata ±1 jam 15 menit** (lebih cepat karena
> daftar kata sudah terukur dan arti ditulis per **KATA**, ❌ bukan per ayat).

### 🔎 DIUKUR DULU (❌ bukan diduga) — ternyata **1.398**, bukan 1.205

| Hal | Angka |
|---|---|
| Kata isi PB belum punya arti | **1.398** (bukan 1.205) |
| ↳ frekuensi **≥5×** | **67** ⚠️ (seharusnya sudah tertutup tahap 1) |
| ↳ frekuensi **1×** | **1.331** |
| Kemunculan belum berarti | 1.805 dari 74.787 (**2,4 %**) |
| Jenis kata pita 1× | N **632** · V **428** · A **269** |

⚠️ **Angka 1.205 di rencana SALAH** — itu **selisih pita frekuensi** (2.274 − 1.069), bukan jumlah
kata yang benar-benar belum punya arti. **Selalu hitung dari data.**

### ⚙️ Pelaksanaan

| Bagian | Pelaksanaan |
|---|---|
| Sumber arti | **`tools/pb-penjelasan.json`** — **1.030 → 2.429 entri** (1.398 baru) · 48.677 → **116.567 byte** |
| Cara menulis | 14 berkas batch (`_t3-b1.json` … `_t3-b14.json`), tiap batch ±100 kata, dibaca dari daftar ringkas `G####\|freq\|POS\|Inggris\|lemma` |
| Alat data | `node tools/siapkan-data-pb.js` — **diperbaiki** (lihat cacat di bawah) |
| Data PB | **3.128 → 3.296 KB** · entri lex **4.168 → 5.685** · sidik **`pb-4170-5685-cd66c7eb`** |
| Versi | mesin PB **`v3Nov-c` → `v3Nov-d`** · tampilan **`v3Nov-c` → `v3Nov-d`** · halaman **`v3Nov-c` → `v3Nov-d`** · plugin interlinear **1.3 → 1.4** · ukuran **±7,8 → ±8,0 MB** |
| Uji | blok **K85t2** diperluas **46 → 51 uji** (5 uji baru khusus tahap 3) |

### 🐞 CACAT NYATA yang ketemu UJI (❌ bukan cacat uji)

> Uji baru **K85t2-49** melaporkan **118 kata ISI tanpa arti** — padahal pengukuran saya bilang **0**.
> **Sebabnya (diperiksa, ❌ bukan diduga):** **118 nomor Strong** (semuanya **ADV** — kata keterangan)
> **dipakai di ayat** tetapi **tidak punya entri lex sama sekali** ⇒ di kolom tampil `—` **tanpa
> keterangan jenis kata**, dan alat uji **tidak bisa membedakan** kata isi dari kata fungsi
> (karena `lex[nomor].p` tidak ada).

| Perbaikan di `tools/siapkan-data-pb.js` | Isi |
|---|---|
| **langkah (d)** | **setiap** nomor Strong yang dipakai di ayat **WAJIB** punya entri lex (118 dilengkapi) |
| **langkah (e)** | **jenis kata (POS)** disimpan di setiap entri (`lex[nomor].p`) |

⇒ entri lex **5.567 → 5.685** · data **3.253 → 3.296 KB** · sidik **`pb-4170-5685-cd66c7eb`**.

⚠️ **Pelajaran:** pengukuran saya menghitung **kata isi** (POS bukan kata fungsi) — jadi 118 kata
**ADV** tidak masuk hitungan. Tetapi **tanpa entri lex**, kolom interlinear tetap menampilkan `—`
dan **pengguna tidak tahu** itu kata keterangan. **Ukuran “cakupan” harus dihitung dari apa yang
BENAR-BENAR tampil**, bukan dari kategori yang saya pilih.

### ✅ Hasil terukur

| Hal | Sebelum | Sesudah |
|---|---|---|
| **Cakupan kata isi PB** | 35.407 / 37.213 (**95,1 %**) | **37.213 / 37.213 (100,0 %)** |
| Entri arti PB | 4.168 | **5.685** |
| Kata isi belum berarti | 1.806 | **0** |
| Nomor Strong tanpa entri lex | 118 | **0** |
| Data PB | 3.128 KB | **3.296 KB** |
| HP `ANodes-1berkas.html` | 44.927,1 KB (43,87 MB) | **45.285,9 KB (44,22 MB)** |

| Uji | Hasil |
|---|---|
| **K85t2** di `index.html` | ✅ **51 uji · 0 gagal · 14,1 dtk** |
| **K85t2** di `ANodes-1berkas.html` | ✅ **51 uji · 0 gagal · 14,1 dtk** |
| Regresi **K90i** | ✅ **17 uji · 0 gagal · 9,6 dtk** |

**Contoh arti baru yang terbukti:** `G5039` bukti · `G0184` Akeldama · `G2957` Kirene ·
`G2493` Yoel · `G4551` Safira · `G2333` Teudas · `G1048` Gaza · `G3194` Malta ·
`G0717` Harmagedon · `G3963` Patmos · `G5402` Febe · `G5060` Tertius · `G3134` Maranata ·
`G0611` menjawab · `G1154` Damsyik · `G2445` Yope · `G2883` Kornelius · `G5344` Feliks ·
`G0116` Atena · `G2882` Korintus · **1 Korintus 16:22** ⇒ *Maranata* kini punya arti Indonesia.

### ⚠️ PELAJARAN (WAJIB dibawa)

1. 🔴 **Hitung sasaran dari DATA, bukan dari selisih tabel.** Rencana menulis **1.205**;
   kenyataannya **1.398**. Selisih pita frekuensi **tidak sama** dengan jumlah kata yang perlu ditulis.
2. 🔴 **“Cakupan 100 %” harus dihitung dari apa yang BENAR-BENAR TAMPIL.** 118 kata **ADV**
   tidak masuk hitungan “kata isi” saya, tetapi **tetap tampil `—`** di kolom. ⇒ **setiap** nomor
   Strong yang dipakai di ayat **wajib** punya entri lex + POS.
3. **Uji yang memeriksa DATA LEBIH TAJAM daripada pengukuran saya** — cacat 118 kata ini
   **hanya ketemu** karena uji memeriksa **seluruh** nomor Strong di ayat, bukan sampel.
4. **Menulis arti per KATA tetap kuncinya.** 1.398 kata menutup **2,4 %** kemunculan kata isi;
   kalau per ayat, 3.271 ayat harus ditulis satu per satu.
5. **Uji sasaran tetap ±14 detik** walau data bertambah 168 KB — tidak ada perlambatan.

**Berkas:** `tools/pb-penjelasan.json` (**2.429 entri**) · `tools/siapkan-data-pb.js` (langkah **d** & **e**) ·
`plugin/interlinear/data/pb.js` · `plugin/interlinear/pb.js` · `plugin/interlinear/tampilan.js` ·
`plugin/interlinear/plugin.js` · `index.html` · `tools/uji-blok/K85t2.js` (**51 uji**) ·
`ANodes-1berkas.html` · 💾 `backups/k85pb-tahap3-20261103-121838/`.

### 🎉 SELESAI — INTERLINEAR PERJANJIAN BARU 100 %

| Tahap | Isi | Cakupan | Status |
|---|---|---|---|
| 1 | 227 kata (≥5×) | 89,6 % | ✅ 3 Nov 2026 |
| 2 | 803 kata (2–4×) | 95,1 % | ✅ 3 Nov 2026 |
| **3** | **1.398 kata (1× + 67 sisa)** | **100,0 %** | ✅ **3 Nov 2026** |

## 3 November 2026 — 🔤 **K85 TAHAP 2 SELESAI: 803 ARTI BARU ⇒ CAKUPAN PB 89,6 % → 95,1 %**

> Bapak: *“lanjut tahap 2”* ⇒ dikerjakan **satu giliran penuh** (ukur → tulis → bangun → uji → build → dokumen).
> **⏱️ Perkiraan yang saya sebut di awal: ±4–5 jam** · **nyata ±1 jam 10 menit** (lebih cepat karena
> daftar kata sudah terukur dan artinya ditulis per **KATA**, bukan per ayat).

### 🔎 DIUKUR DULU (❌ bukan diduga) — ternyata **803**, bukan 714

| Hal | Angka |
|---|---|
| Kata isi PB (Kisah 26 s/d Wahyu) | **37.213** kemunculan |
| Sudah punya arti (sesudah tahap 1) | **33.342 (89,6 %)** |
| Kata frekuensi **2–4×** yang belum punya arti | **803** (bukan 714 — angka lama dari perkiraan) |
| Sebaran | **4× = 121** · **3× = 216** · **2× = 466** |
| Bisa diisi otomatis (lemma sama) | **0** — semuanya perlu ditulis |
| Sebaran jenis kata | N **393** · V **263** · A **138** · lain **9** |

⚠️ **Pelajaran:** angka **714** di rencana berasal dari **selisih pita frekuensi** (1.069 − 355),
padahal yang benar adalah **kata yang BENAR-BENAR belum punya arti** = **803**. Selalu hitung
dari data, ❌ jangan dari selisih tabel.

### ⚙️ Pelaksanaan

| Bagian | Pelaksanaan |
|---|---|
| Sumber arti | **`tools/pb-penjelasan.json`** — **227 → 1.030 entri** (803 baru) · 8.929 → **48.677 byte** |
| Alat data | `node tools/siapkan-data-pb.js` (tanpa perubahan kode) |
| Data PB | **3.059 → 3.128 KB** · entri lex **3.364 → 4.168** · sidik **`pb-4170-4168-cd66c7eb`** |
| Versi | mesin PB **`v3Nov-b` → `v3Nov-c`** · tampilan **`v3Nov-b` → `v3Nov-c`** · halaman **`v3Nov-a` → `v3Nov-c`** · plugin interlinear **1.2 → 1.3** · ukuran **±7,6 → ±7,8 MB** |
| Uji | blok **K85t2** diperluas **43 → 46 uji** (3 uji baru khusus tahap 2) |

### ✅ Hasil terukur

| Hal | Sebelum | Sesudah |
|---|---|---|
| **Cakupan kata isi PB** | 33.342 / 37.213 (**89,6 %**) | **35.407 / 37.213 (95,1 %)** |
| Entri arti PB | 3.364 | **4.168** |
| Kata isi belum berarti | 3.871 | **1.806** |
| Data PB | 3.059 KB | **3.128 KB** |
| HP `ANodes-1berkas.html` | 44.748,1 KB (43,70 MB) | **44.927,1 KB (43,87 MB)** |

| Uji | Hasil |
|---|---|
| **K85t2** di `index.html` | ✅ **46 uji · 0 gagal · 13,9 dtk** |
| **K85t2** di `ANodes-1berkas.html` | ✅ **46 uji · 0 gagal · 13,9 dtk** |
| Regresi **K90i** | ✅ **17 uji · 0 gagal · 9,6 dtk** |

**Contoh arti baru yang terbukti:** `G0019` kebaikan · `G2643` pendamaian · `G5464` hujan es ·
`G4010` Pergamus · `G5598` Omega · `G0747` pemimpin · `G2099` pemberita Injil · `G3065` Lukas ·
`G5546` orang Kristen · `G4681` Spanyol · Wahyu 1:8 ⇒ **Alfa/Omega kini punya arti Indonesia**.

### ⚠️ PELAJARAN (WAJIB dibawa)

1. 🔴 **Hitung sasaran dari DATA, bukan dari selisih tabel.** Rencana menulis **714**;
   kenyataannya **803** (kata yang benar-benar belum punya arti). Selisih pita frekuensi
   **tidak sama** dengan jumlah kata yang perlu ditulis.
2. **Tidak ada yang bisa diisi otomatis di pita 2–4×** (0 dari 803) — berbeda dari tahap 1
   (128 dari 355 bisa otomatis). Lemma yang sama sudah habis dipakai di pita atas.
3. **Menulis arti per KATA tetap kuncinya.** 803 kata menutup **5,5 %** kemunculan kata isi;
   kalau per ayat, 3.271 ayat harus ditulis satu per satu.
4. **Uji sasaran tetap ±14 detik** walau data bertambah 69 KB — tidak ada perlambatan.

**Berkas:** `tools/pb-penjelasan.json` (**1.030 entri**) · `plugin/interlinear/data/pb.js` ·
`plugin/interlinear/pb.js` · `plugin/interlinear/tampilan.js` · `plugin/interlinear/plugin.js` ·
`index.html` · `tools/uji-blok/K85t2.js` (**46 uji**) · `ANodes-1berkas.html` ·
💾 `backups/k85pb-tahap2-20261103-120203/`.

### ⏭️ SISA (menunggu perintah)

| Tahap | Isi | Hasil | Perkiraan |
|---|---|---|---|
| **3** | +1.398 kata (1× + 67 sisa) | **100 %** | ±6 jam |

## 3 November 2026 — ✡ **K90i SELESAI: PENJELASAN IBRANI TAURAT DITUNTASKAN (149 kata baru)**

> Bapak memilih **A. Tuntaskan 86 ayat Taurat** sesudah saya paparkan hasil ukur:
> P1 (Taurat) ternyata **sudah 98,5 %** tertutup oleh **K90** — yang benar-benar kurang
> justru **Perjanjian Baru** (4.234 ayat · Kisah s/d Wahyu **0 %**).

### 🔎 DIUKUR DULU (❌ bukan diduga)

| Hal | Angka |
|---|---|
| Ayat Taurat (Kej 1 – Ul 34) | **5.852** |
| Sudah ada penjelasan Ibrani (K90) | **5.766 (98,5 %)** |
| **Belum** | **86 ayat (1,5 %)** |
| Nomor Strong di Taurat | **298** → **100 % sudah dijelaskan** |
| Nomor Strong di 86 ayat itu | **186** · **149 di antaranya LAYAK** (bukan kata fungsi, definisi ≥45 huruf) |
| Sebaran per kitab | Kejadian 18 · Keluaran 18 · Imamat 13 · Bilangan 20 · Ulangan 17 |

⚠️ **Temuan sampingan yang penting:** celah terbesar **bukan** di Taurat, melainkan di
**Perjanjian Baru** — **4.234 ayat belum ada** (Kisah s/d Wahyu **0 %**), sebab sumber
`idkjv` **hanya punya 4 Injil + Kisah 1–25** (882 dari 1.007 ayat = 87,6 %).
⇒ dicatat sebagai bahan keputusan Bapak untuk pekerjaan berikutnya.

### ⚙️ Pelaksanaan

| Langkah | Hasil |
|---|---|
| Tulis **149 penjelasan** baru (gaya sama: `tb` + `kalimat` mengalir) | ✅ rata-rata **305 huruf** |
| Gabung ke `tools/ibrani-penjelasan.json` | **326 → 475 entri** · 184,7 → **236,1 KB** |
| Bangun ulang `plugin/interlinear/data/ibrani.js` | **2.796,2 → 2.910,4 KB** |
| Penanda versi | mesin Ibrani **`v1Nov-a` → `v3Nov-a`** · tampilan **`v1Nov-e` → `v3Nov-a`** · halaman **`v2Nov-c` → `v3Nov-a`** |
| Plugin interlinear | versi **1.0 → 1.1** · ukuran **±1,7 → ±4,6 MB** · angka kartu diperbarui |

**Isi 149 kata baru:** nama bangsa (Yebusi · Amori · Girgasi · Hewi · Ferizi · Refaim · Heti ·
Kanaan · Arki · Sini · Kadmoni · Keni · Kenas · Hori), nama orang (Gad · Dan · Naftali ·
Asyer · Isakhar · Esau · Edom · Syeba · Tema · Yetur · Nafis · Kedma · Misa · Duma · Betuel ·
Kenas · Syobal · Zibeon · Ana · Oholibama · Ela · Pinon · Teman · Hadoram · Uzal · Dikla ·
Abimael · Kesed · Pildash), nama tempat (Nahaliel · Yaezer · Atrot-Syofan · Matana · Bamot ·
Atarot · Dibon · Nimra · Hesybon · Eleale · Sebam · Nebo · Beon · Yogbeha), warna & bahan
(kain biru · kain ungu · kain kirmizi · lenan halus · benang dipintal), hewan (kambing ·
keledai · rusa · kijang · kambing hutan · babi · 8 burung haram), benda kudus (kaki dian ·
cawan · tombol · kelopak · serban · kopiah · celana · tutup kepala), takaran (omer · efa),
penyakit kulit (bengkak · kudis · bercak putih), dan kata kerja (membunuh · berzinah ·
mencuri · memamah biak · berkuku belah · mengirik · menutup mulut · memuliakan · cemburu ·
menyakiti hati · termeterai · tersimpan · menetes · memanah · membenci · memahitkan).

### 📊 HASIL TERUKUR

| Hal | Sebelum | Sesudah |
|---|---|---|
| Kata Ibrani dijelaskan | 306 | **455** |
| Ayat PL dapat penjelasan | 22.602 (97,4 %) | **22.688 (97,7 %)** |
| **Cakupan Taurat** | 5.766/5.852 (98,5 %) | **5.820/5.852 (99,5 %)** |
| Kejadian | 1.515/1.533 | **1.532/1.533 (99,9 %)** |
| Keluaran | 1.195/1.213 | **1.208/1.213 (99,6 %)** |
| Imamat | 846/859 | **852/859 (99,2 %)** |
| Bilangan | 1.268/1.288 | **1.272/1.288 (98,8 %)** |
| Ulangan | 942/959 | **956/959 (99,7 %)** |
| Sidik data | `ib-23213-306-…` | **`ib-23213-455-624bf961`** |
| HP `ANodes-1berkas.html` | 39.290.437 byte | **39.544.836 byte (37,71 MB)** |

✅ **32 ayat Taurat yang masih kosong DIPERIKSA satu per satu** ⇒ **semuanya hanya memuat
kata fungsi** (kata sandang · preposisi · partikel) yang memang **sengaja dilewati** karena
tidak menambah pengertian ⇒ **Taurat efektif 100 %**.

### 🧪 UJI

| Hal | Hasil |
|---|---|
| Blok sasaran **`tools/uji-blok/K90i.js`** (BARU) | **17 uji · 0 gagal** |
| `index.html` | ✅ 9,7 detik |
| `ANodes-1berkas.html` | ✅ 9,8 detik |
| Uji contoh nyata | Kej 10:16 ⇒ **H2983✓ H567✓ H1622✓** · Kel 20:13 ⇒ **H7523✓** · Im 11:7 ⇒ **H2386✓ H6536✓ H8156✓ H1641✓** · Ul 32:32 ⇒ **H1612✓ H5467✓ H6017✓ H6025✓ H7219✓ H811✓ H4846✓** · Kel 25:4 ⇒ **H8504✓ H713✓ H8438✓ H8144✓ H8336✓ H5795✓** |
| Tombol 🖊 di halaman baca | ✅ Kejadian 10 ⇒ tombol muncul · **ayat 16** (dulu kosong) kini punya tombol |

### 🐞 CACAT UJI (❌ bukan kode)

**K90i-01 gagal palsu** — saya menulis ambang `>= 475` padahal yang benar **455**
(306 kata terpakai + 149 baru). Ambang diperbaiki ⇒ **0 gagal**.
⚠️ **Pelajaran:** ambang uji wajib dihitung dari **angka nyata**, bukan dari jumlah entri
berkas sumber (326 entri, tetapi hanya **306** yang benar-benar terpakai).

### ⚠️ PELAJARAN

1. 🔴 **Rencana bisa sudah usang.** P1 (Taurat) tercatat sebagai pekerjaan **±3 jam** di
   `rencanakerja.md` bagian 18.2.3, padahal **K90 sudah menutup 98,5 %**-nya. ⇒ **selalu ukur
   dulu** sebelum mengerjakan rencana lama.
2. 🔴 **Celah terbesar ada di tempat yang tidak direncanakan.** Yang benar-benar kurang adalah
   **Perjanjian Baru (4.234 ayat)**, bukan Taurat (86 ayat).
3. **Kata fungsi memang harus dilewati.** 32 ayat Taurat tetap tanpa penjelasan karena isinya
   hanya kata sandang/preposisi — itu **benar**, bukan cacat.
4. **Ambang uji dihitung dari angka nyata.** Jumlah entri berkas sumber ≠ jumlah kata terpakai.

**Berkas:** `tools/ibrani-penjelasan.json` (326 → **475 entri**) ·
`plugin/interlinear/data/ibrani.js` (hasil alat) · `plugin/interlinear/ibrani.js` ·
`plugin/interlinear/tampilan.js` · `plugin/interlinear/plugin.js` · `index.html` ·
`ANodes-1berkas.html` · **`tools/uji-blok/K90i.js`** (BARU) ·
💾 `backups/k90i-tuntaskan-taurat-20261103-100637/`.

---

## 2 November 2026 — 📦 **APK DIBANGUN ULANG: K91–K95 MASUK KE DALAM APK**

> Bapak: *“apk sudah di update”* ⇒ diperiksa dulu (❌ bukan dipercaya begitu saja).

### 🔎 DIUKUR DULU — APK ternyata **MASIH VERSI 1 NOV**

| Yang diperiksa | Hasil |
|---|---|
| APK dibuat | **1 Nov 2026 21:52** |
| Aset di dalam APK | 39.185.975 byte |
| Sumber sekarang | 39.279.389 byte |
| Versi di APK | **`v1Nov`** (PC: `v2Nov`) |
| `asalCari` (K91) di APK | ❌ **0** |
| `bm-kartu-klik` (K93) di APK | ❌ **0** |
| `uji-sasaran` (K94) di APK | ❌ **0** |

⇒ **Perbaikan hari ini belum ada di dalam APK.** Ini jebakan **K78/K79** yang terulang:
berkas APK **tidak ikut berubah** kalau tidak dibangun ulang.

### ⚙️ Perbaikan

| Langkah | Hasil |
|---|---|
| `gradlew clean` | ✅ 31s (wajib — tanpa clean dex lama tertinggal) |
| `build-apk.bat` | ✅ 53s · menyalin aset **39.279.389 byte** lebih dulu |
| `versionCode` | **22 → 23** · `versionName` → **`2.0.0-webview-k95`** (supaya bisa dipasang di atas yang lama) |
| `artifacts/APK-INFO.txt` | diperbarui (ukuran · SHA-256 · versionCode · aset · penanda) |

### 📊 HASIL TERUKUR

| Hal | Angka |
|---|---|
| APK | **33.985.095 byte (32,41 MB)** |
| SHA-256 | `E2722D0AC96BFEB60F3DA162F12D2C2C7B9D71348B4E788ACB81FA1100A14135` |
| `versionCode` / `versionName` | **23** / `2.0.0-webview-k95` |
| Aset di APK | **39.289.009 byte = sumber (byte-identik)** ✅ |
| Versi halaman di APK | **`v2Nov-c`** ✅ |
| K91 `asalCari` | **27×** ✅ |
| K91b `saranMirip` | **6×** ✅ |
| K91c `ay-cari-riwayat` | **24×** ✅ |
| K92 `bk-bookmark` | **26×** ✅ |
| K93 `bm-kartu-klik` | **14×** ✅ |
| K94 `uji-sasaran` | **43×** ✅ |
| K95 `copilot-instructions` | **18×** ✅ |
| Izin | `INTERNET` + `ACCESS_NETWORK_STATE` ✅ |
| ⚠️ Uji emulator | **BELUM** (Bapak: uji besok) |

### 🐞 CACAT BUILD YANG KETEMU

> Build **tanpa `clean`** ⇒ APK **47.134.786 byte (45,0 MB)** — **13,25 MB lebih besar**
> dari isi sebenarnya (total entri terkompres hanya **33.881.047 byte**).
> Sesudah `gradlew clean` ⇒ **33.985.095 byte (32,41 MB)** = normal.
> ⇒ **`gradlew clean` WAJIB** setiap build APK.

### ⚠️ PELAJARAN

1. 🔴 **“APK sudah di-update” ≠ “APK berisi kode terbaru”.** Wajib **dibuktikan** dengan
   membandingkan **ukuran aset di dalam APK** dengan berkas sumber + mencari **penanda versi**.
2. 🔴 **`versionCode` WAJIB dinaikkan** setiap build — kalau sama, pemasangan di atas versi
   lama bisa **gagal** dan pengguna mengira APK-nya rusak.
3. **`gradlew clean` wajib** sebelum build (tanpa clean: 11 dex · 66 MB tak terkompresi).

---

## 2 November 2026 — 📌 **K95 SELESAI: ATURAN UJI DITULIS UNTUK SEMUA AI + BUKTI NYATA (LOG)**

> Bapak: *“ok di catat atau prompt apalah supaya selain AI km AI lain juga bekerja seperti km..
> terutama di uji .. saya pelajari soal uji ini .. sayangnya saya hanya perkiraan.. tidak ada
> bukti nyata.. bukti saya hanya karena km mengakui .. jadi memang sangat penting di catat dengan
> bahasa AI yg dapat dimengerti .. soal AI lain juga melakukan seperti km.. itu nyata.. sampai
> saya furstasi menyampaikan.. semoga masalah ini sudah teratasi walau saya ganti AI”*

### 🔎 DIUKUR DULU

`AGENTS.md` di akar **= `agents.md`** (Windows tidak membedakan huruf besar/kecil) ⇒ berkas itu
**sudah** terbaca AI lain. Tetapi **tidak ada** `.github/copilot-instructions.md` (berkas yang
dibaca Copilot **otomatis**) dan **tidak ada bukti terukur** yang bisa diperiksa pemilik proyek.

### ⚙️ Perbaikan

| Berkas | Isi |
|---|---|
| **`.github/copilot-instructions.md`** (BARU) | aturan uji sasaran dalam bahasa AI + tabel bukti + cara membuat blok baru + aturan kerja ringkas |
| **`agents.md`** | **Aturan #1** ditaruh di **kepala berkas** (sebelum 4 metode lama) — dibaca semua AI |
| **`tools/uji-log.js`** (BARU) | pencatat otomatis `artifacts/uji-log.txt` — dipakai **KEDUA** alat uji |
| **`tools/cek-cara-uji.js`** (BARU) | ringkasan bukti: berapa kali sasaran vs menyeluruh · total waktu · gagal |
| `tools/uji-sasaran.js` · `tools/uji-chrome.js` | menulis log + **peringatan otomatis** bila lambat |

### 📊 BUKTI NYATA (bisa diperiksa sendiri)

```
$ node tools/cek-cara-uji.js

=== 🔍 BUKTI CARA UJI — ANodes ===
  uji dijalankan        : 2 kali
  ✅ cara SASARAN       : 2 kali  · total 21.9 dtk (0.4 mnt)
  ⚠️  cara MENYELURUH   : 0 kali  · total 0.0 dtk (0.0 mnt)
  uji diperiksa         : 70  · gagal: 0

  2026-11-02 23:23:40 | sasaran | index.html | K92,K93 | 11.0 dtk | 35 uji | 0 gagal
  2026-11-02 23:24:31 | sasaran | index.html | K92,K93 | 10.9 dtk | 35 uji | 0 gagal
```

⚠️ **Log ditulis oleh KEDUA alat** ⇒ cara lambat **tidak bisa disembunyikan**. Setiap AI yang
memakai cara lambat akan **tercatat** di `artifacts/uji-log.txt`.

### ⚠️ PELAJARAN

1. **Aturan yang hanya ada di kepala AI = tidak ada.** Harus ditulis di berkas yang **dibaca
   otomatis** oleh alat AI (`.github/copilot-instructions.md`, `AGENTS.md`).
2. **Pagar di kode > janji.** `--blok` ditolak (`exit 2`) ⇒ tidak bisa diulang.
3. **Bukti harus bisa diperiksa pemilik proyek**, bukan hanya “kata AI”. Karena itu ada
   `artifacts/uji-log.txt` + `tools/cek-cara-uji.js`.

---

## 2 November 2026 — 🎯 **K94 SELESAI: UJI SASARAN — HANYA BLOK YANG DIREVISI YANG DIUJI**

> Bapak: *“saya mau kritisi soal uji .. agak terlalu lama.. curiga saya konsep uji itu ..
> sifat uji ini menguji aplikasi keseluruhan.. menurut saya secara normal adalah jika uji
> bukannya seharusnya uji di lokasi atau di sasaran tepat diminta perbaikan .. nah posisi itu
> saja yg di uji sudah benar atau belum... tapi yg saya curigakan uji keseluruhan .. di semua
> fungsi .. ini tidak efektif”*

### 🔎 DIUKUR DULU — KRITIK BAPAK TERBUKTI BENAR

| Hal | Angka |
|---|---|
| `tools/uji-cepat.js` | **8.435 baris · 465 KB** |
| Asersi | **893** |
| Blok uji | **43** |
| `pasang`/`lepas` plugin | **44×** |
| Muat data besar (Alkitab 5 MB · penguat 12 MB · dll) | **12×** |
| Waktu | **±4–7 menit** |

🔴 **Sebabnya:** `window.__BLOK` **HANYA MENYARING LAPORAN** — seluruh 893 asersi **tetap
dijalankan**. Jadi `--blok K92` tetap menguji **SELURUH aplikasi**.

### ⚙️ Perbaikan

| Berkas | Isi |
|---|---|
| **`tools/uji-sasaran.js`** (BARU) | menjalankan **HANYA** `tools/uji-blok/<NAMA>.js` — tidak ada blok lain yang ikut jalan |
| **`tools/uji-blok/K92.js`** · **`K93.js`** (BARU) | blok sasaran untuk revisi bookmark |
| **`tools/uji-chrome.js`** | 🛑 **PAGAR**: `--blok` **DITOLAK** (`exit code 2`) kecuali diberi `--paksa` ⇒ jebakan yang sama **tidak bisa terulang** |
| `agents.md` | aturan **K94** ditulis; aturan lama yang menyuruh `uji-cepat.js` **diganti** |
| `tools/uji-cepat.js` | penanda di kepala berkas: *“JANGAN JALANKAN BERKAS INI UNTUK MENGUJI SATU REVISI”* |

### 📊 HASIL TERUKUR

| Cara | Baris | Ukuran | Waktu |
|---|---|---|---|
| ❌ Lama (`uji-chrome.js --blok`) | 8.435 | 465,4 KB | **±4–7 menit** |
| ✅ Sasaran (`uji-sasaran.js K92,K93`) | **156** | **7,2 KB** | **10,9 detik** |
| | **54× lebih ringkas** | | **±30× lebih cepat** |

**35 uji · 0 gagal** · pagar dibuktikan: `--blok K92` ⇒ **BERHENTI** (exit 2, 0 detik).

### ⚠️ PELAJARAN

1. 🔴 **Memperbaiki alat TIDAK CUKUP** — jebakan wajib **ditutup di kode** (pagar `exit 2`)
   supaya AI berikutnya — atau saya sendiri — **tidak bisa** mengulanginya.
2. 🔴 **❌ JANGAN menjalankan cara lambat hanya untuk “membandingkan”.** Membuktikan bahwa
   cara lama lambat cukup dari **isi berkasnya** (jumlah baris/asersi) — tanpa menjalankannya.
3. **Satu revisi = satu blok sasaran.** Blok dibuat di `tools/uji-blok/<NAMA>.js` dan
   **memasang sendiri** plugin yang dibutuhkan.

---

## 2 November 2026 — 🔖 **K92 + K93 SELESAI: TOMBOL BOOKMARK HILANG + KARTU BOOKMARK BISA DIKLIK**

> Bapak: *“ada perbaikan lagi bookmark · sudah pilih ayat yg akan dibookmark tapi icon bookmark
> tidak ada atau plugin icon bookmark tidak muncul..”* lalu *“bookmark .. ke daftarnya list
> bookmark.. bisa di klik salah satu book dan lompat ke kitab book .. ini fungsi bookmark”*

### 🔴 K92 — SEBAB TUNGGAL TERUKUR (❌ bukan dugaan)

| Yang diperiksa | Hasil |
|---|---|
| `ANodesPlugin.dipasang('bookmark')` | ✅ **true** (plugin tercatat terpasang) |
| Tombol 🔖 di navbar Alkitab | ❌ **TIDAK ADA** |
| Tombol `[🔖 Bookmark]` di bar pilihan ayat | ❌ **TIDAK ADA** |
| Isi bar pilihan ayat | `bk-ayat · bk-kalimat · bk-ayat-format · bk-simpan · bk-batal` — **tanpa `bk-bookmark`** |
| Sesudah `hidupkan()` dipanggil manual | ✅ tombol **muncul** |

⇒ `plugin/bookmark/tampilan.js` **tidak punya pemanggil `siapkanOtomatis()` saat halaman
dimuat** (semua plugin lain punya `DOMContentLoaded`); ia hanya dipanggil dari `saatDipasang`
⇒ sesudah **F5 / buka ulang aplikasi** tombol **hilang** walau plugin tetap tercatat terpasang.
⚠️ **Pelajaran K55/K47e terulang** — *“`siapkanOtomatis()` WAJIB ADA”*.

**Perbaikan:** (a) ➕ blok pemanggil `DOMContentLoaded`/`readyState` di akhir `tampilan.js` ·
(b) ➕ pendengar **`anodes-pilih-berubah`** ⇒ `pasangTombolBarKirim()` dipanggil ulang
(idempoten) · (c) `bersihkan()` juga membuang `#bk-bookmark`.

### 🔎 K93 — KEADAAN SEBELUM (terukur)

Kartu `.bm-kartu` **tidak punya pengait klik** dan `getComputedStyle(cursor)` = **`auto`**
⇒ hanya bisa dibaca; untuk melihat ayatnya di Alkitab harus lewat **✏️ Edit** (mode edit).

**Perbaikan:** (a) klik **kartu** (kecuali tombol — diperiksa `closest('button')`) ⇒
`bukaDiAlkitab()` → `bukaRentang()` (K80) ⇒ Alkitab pada kitab/pasal/ayat + **sorot rentang** ·
(b) **🏠 ⇒ kembali ke HALAMAN 🔖 BOOKMARK** lewat sambungan resmi
`daftarPemulihHalaman('bookmark', pulihDariAlkitab)` + `ingatAsalAyat({jenis:'bookmark', gulir})` ·
(c) `cursor: pointer` + `↗` di nama + latar berubah saat disentuh + judul
*“Klik untuk membuka … di Alkitab”*.

### 📊 BUKTI

| Hal | Hasil |
|---|---|
| K92 | tombol navbar & bar pilihan **ADA** tanpa dipanggil manual · `hidupkan()` 3× tetap **1 tombol** · lepas plugin ⇒ hilang · pasang lagi ⇒ muncul · **17 uji · 0 gagal** |
| K93 | klik kartu ⇒ halaman bookmark tertutup · Alkitab di **Bilangan 6** · ayat **24-25 disorot** · 🏠 ⇒ **halaman Bookmark** (catatan TIDAK tampil) · 🏠 kedua ⇒ catatan · klik 📋 Copy **tidak** membuka Alkitab · **13 uji live + 18 asersi suite · 0 gagal** |
| Penanda versi | bookmark **`v2Nov-a` → `v2Nov-b`** · halaman **`v2Nov-b`** · plugin bookmark **1.1 → 1.3** |
| HP `ANodes-1berkas.html` | **39.230.505 byte (37,41 MB)** |

**Berkas:** `plugin/bookmark/tampilan.js` · `plugin/bookmark/plugin.js` · `css/app.css` ·
`tools/uji-cepat.js` (**K92-01…17** · **K93-01…18**) · `index.html` · `ANodes-1berkas.html`.

---

## 2 November 2026 — 🔍 **K91 SELESAI: REVISI FITUR CARI DI ALKITAB (3 butir)**

> Bapak: *“mau revisi fitur cari di alkitab — 1. posisi sedang baca kitab keluaran 1:1 lalu klik
> cari misal "onesimus" keluar kolose 4:9 .. user hanya baca lalu mau kembali ke bacaan sebelumnya
> keluaran 1:1 .. belum bisa klik 🏠 > ke catatan seharusnya kembali ke kitab keluaran 1:1 ·
> 2. cari misal "onesimus" sekarang harus persis sama .. jika beda omesimus sudah tidak ditemukan
> mungkin user bermaksud onesimus tapi lafal salah misal omesimus.. apa sistem bisa cari beberapa
> alternatif dengan kata mirip seperti list user tinggal cari yg dimaksud · 3. history cari bisa
> banyak dari tanggal lalu mungkin user cari apa yg lalu.. dan history bisa dihapus disediakan
> tombol hapus history”*

**🔎 DIUKUR DULU (❌ bukan diduga):** kosakata unik TB **16.896 kata** (≥4 huruf) ·
**687.265 kata** · **31.102 ayat** · bangun indeks **226 ms** (sekali, malas) ·
satu pencarian mirip **3–30 ms** · `onesimus` **2×** di data, `omesimus` **0×**.

| Butir | Hasil |
|---|---|
| **a** 🏠 balik ke bacaan sebelum cari | `asalCari` baru + `bukaHasilCari()` memindahkannya ke `asalBacaan` (K80) ⇒ 🏠 pertama ke **Keluaran 1**, 🏠 kedua ke catatan · judul 🏠 menyebut tujuannya |
| **b** 🔎 saran kata mirip | **Damerau-Levenshtein** (huruf tertukar = 1 langkah) · ambang **TERUKUR**: panjang ≥7 ⇒ jarak 2, <7 ⇒ jarak 1 · chip klik = cari kata itu |
| **c** 🕘 riwayat cari | kunci **`anodes-alkitab-cari-riwayat`** (masuk `KUNCI_AMAN`) · maks **50** · tanpa dobel · label waktu (“hari ini 21:51” · “kemarin” · “Sen 28 Okt”) · tombol **🗑 Hapus** + konfirmasi · daftar **tertutup** saat ada hasil, **terbuka** saat halaman cari kosong |

**📊 BUKTI:** **33 uji K91 · 0 gagal** di `index.html` **dan** `ANodes-1berkas.html` ·
klik NYATA: Keluaran 1 → cari `omesimus` ⇒ chip **onesimus** ⇒ klik ⇒ **Kolose 4:9** ⇒
🏠 ⇒ **Keluaran 1** ⇒ 🏠 ⇒ catatan ✅ · penanda **`v2Nov-a`** ·
HP **39.204.678 byte (37,39 MB)**.

**⚠️ Aturan tersempit (jangan diubah tanpa mengukur ulang):** jarak 2 untuk kata **pendek**
menghasilkan sampah — terukur `kasi` ⇒ **138 kata** mirip. Karena itu kata <7 huruf hanya
boleh jarak **1**.

**🐞 3 cacat UJI yang ketemu (❌ bukan kode):** (1) uji tidak menampilkan halaman baca dulu ⇒
`bukaHalamanCari()` tidak mencatat bacaan (pelajaran K55) · (2) `bukaKetik()` tidak menggambar
ulang halaman yang sudah berisi hasil ⇒ riwayat baru tidak terlihat (diperbaiki: halaman cari
**kosong** digambar ulang) · (3) uji menuntut chip riwayat **terbuka** padahal sengaja
**tertutup** saat ada hasil.

**Berkas diubah:** `plugin/alkitab/tampilan.js` (`VERSI` → **`v2Nov-a`**) · `css/app.css`
(blok K91b/K91c) · `tools/uji-cepat.js` (**K91-01…K91-31** + `KUNCI_AMAN`) · `index.html`
(`v2Nov-a`) · `ANodes-1berkas.html`.

## 1 November 2026 — 🖊 **K90h + K88g SELESAI: PENJELASAN BAHASA ASLI PL 97,1 % · PB 97,9 %**

> Bapak: *"mana saja.. jam 10 malam selesai.. besok lanjut"* lalu
> *"masih ada 1 jam 15 menit .. sebaiknya jangan di apk .. proses saja.. sampai 15 terakhir baru APK"*

**Hasil:** kata Ibrani **199 → 299** (PL **96,2 % → 97,1 %**) · kata Yunani **20 → 510**
(PB **82,1 % → 97,9 %**). APK dibangun **pada 15 menit terakhir** sesuai arahan.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Kata Ibrani dijelaskan | 199 | **299** |
| Ayat PL dapat penjelasan | 22.337 (96,2 %) | **22.535 (97,1 %)** |
| Data Ibrani | 2.405,5 KB | **2.712,0 KB** |
| Kata Yunani dijelaskan | 20 | **572** |
| Ayat PB dapat penjelasan | 3.103 (82,1 %) | **3.723 (98,5 %)** |
| Data Yunani | 180,3 KB | **703,1 KB** |
| Berkas HP | 35,80 MB | **37,21 MB** |
| APK | 31,84 MB (v21) | **32,31 MB** · `versionCode 22` |

**Sidik data:** Ibrani `ib-23213-299-c8e606a0` · Yunani `yl-3778-510-29-700f47ac`.

**Penanda versi:** halaman **`v1Nov-k`** · mesin Yunani `v1Nov-c` · mesin Ibrani `v1Nov-a` ·
tampilan interlinear `v1Nov-d`.

**Bukti di emulator Android 34 (klik NYATA lewat CDP):** **21 dari 21 uji LULUS** —
halaman `v1Nov-k` · Yunani **510 kata / 3.697 ayat** · Ibrani **299 kata / 22.535 ayat** ·
Kejadian 1:1 ⇒ **31 tombol + 3 blok** (אֱלֹהִים · שָׁמַיִם · אֶרֶץ) ·
Yohanes 3:16 ⇒ **36 tombol + 2 blok** (teks 1.085 huruf).
Tangkapan layar: `artifacts/k90h-apk-pl-ibrani.png` (Keluaran 20:1) ·
`artifacts/k90h-apk-pb-yunani.png` (Yohanes 3:14).

**Aset APK byte-identik:** `assets/anodes.html` = `ANodes-1berkas.html` ✅ ·
SHA-256 sumber `4F256EDB…91D0` · SHA-256 APK `E2C50472…ECAAA` · build **1m 16s**.

**Berkas diubah:** `tools/ibrani-penjelasan.json` (199 → 299) ·
`tools/yunani-penjelasan.json` (20 → 556, 510 terpakai) ·
`plugin/interlinear/data/{ibrani,yunani}.js` (dibangun ulang) · `index.html` (`v1Nov-k`) ·
`android-native/app/build.gradle.kts` (`versionCode 22`) · `ANodes-1berkas.html` ·
`artifacts/ANodes-webview-debug.apk` · `artifacts/APK-INFO.txt`.

**Pelajaran:** (1) **Saringan kata fungsi Yunani tidak cukup dengan pola** — percobaan pertama
memakai regex definisi Inggris masih meloloskan καί/ὅτι/μή/γάρ; yang berhasil = **daftar
`KATA` eksplisit + daftar awalan `BURUK`**. (2) **Penjelasan disusun per KATA, bukan per ayat** —
510 kata menutup 97,9 % ayat karena kata tersering muncul di ribuan ayat.
(3) **Jangan bangun APK sebelum isi selesai** — build ulang HP setelah APK membuat aset
tidak lagi byte-identik.

## 1 November 2026 — ✡ **K90 butir g SELESAI: +100 KATA IBRANI (cakupan PL 94,0 % → 96,2 %)**

> Lanjutan K90. Bapak: *"mana saja.. jam 10 malam selesai.. besok lanjut"*

**Hasil:** kata Ibrani yang dijelaskan **99 → 199**, cakupan Perjanjian Lama **21.822 → 22.337 ayat
(94,0 % → 96,2 %)**.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Kata dijelaskan | 99 | **199** |
| Ayat dapat penjelasan | 21.822 (94,0 %) | **22.337 (96,2 %)** |
| Berkas data | 1.925,0 KB | **2.405,5 KB** |
| Sidik | `ib-23213-99-9b006d8e` | **`ib-23213-199-60bc939c`** |
| HP | 34,84 MB | **35,80 MB** |
| APK | 31,51 MB (v20) | **31,84 MB (v21)** |

**Kata penting yang masuk batch 2:** חֶסֶד kasih setia · בְּרִית perjanjian · תּוֹרָה Taurat ·
שָׁלוֹם damai sejahtera · אָהַב mengasihi · יָשַׁע menyelamatkan · כָּבוֹד kemuliaan · אָרוֹן tabut ·
נָבִיא nabi · עֹלָה korban bakaran · מִשְׁפָּט keadilan · נַחֲלָה warisan · מַלְאָךְ malaikat · dll.

**Bukti:** Keluaran 20:3 & Yesaya 53:5 (dulu **kosong**) kini **dapat penjelasan** ·
Kejadian 1:1 & Mazmur 23:1 tetap · Yohanes 3:16 tetap **kosong di mesin Ibrani** (PB pakai Yunani) ·
**tanpa angka Strong** · **22 uji K90g · 0 gagal** (11 di antaranya masuk `tools/uji-cepat.js`).

**Berkas diubah:** `tools/ibrani-penjelasan.json` (99 → 199 entri) ·
`plugin/interlinear/data/ibrani.js` (hasil alat) · `tools/uji-cepat.js` (blok K90g) ·
`index.html` (`v1Nov-j`) · `android-native/app/build.gradle.kts` (`versionCode 21`).

---

# 📋 CHANGELOG.md — ANodes


## 1 November 2026 — ✡ **K90 SELESAI: PENJELASAN IBRANI UNTUK PERJANJIAN LAMA (39 kitab)**

> 💬 Bapak: *"ok sekarang bisa dibaca dan mengerti.. berikut supaya PL juga ada .. mana yg mau
> dikerjakan berikutnya dan butuh waktu berapa lama.. target saya jam 10 malam selesai"*

**Hasil:** seluruh **Perjanjian Lama** kini punya penjelasan bahasa asli — **39 kitab · 23.213 ayat
Ibrani · 306.785 kata** — dan **99 kata isi** yang dijelaskan menutup **21.822 ayat = 94,0 %** PL.

| Hal | Angka |
|---|---|
| Data | `plugin/interlinear/data/ibrani.js` **1.925,0 KB** · sidik `ib-23213-99-9b006d8e` |
| Mesin BARU | `plugin/interlinear/ibrani.js` (`ANodesIbrani` · IndexedDB kunci `ibrani`) |
| Kolom 🖊 | **SATU** untuk PL & PB — mesin dipilih dari nomor kitab (≤39 = Ibrani) |
| Kejadian 1:1 | **3 blok** (אֱלֹהִים · שָׁמַיִם · אֶרֶץ) · kepala **"dari bahasa Ibrani"** |
| Yohanes 3:16 | ✅ tetap **Yunani** · 8 blok |
| Angka Strong | ✅ **TIDAK ADA** di kolom |
| Uji | **33 uji K90 · 0 gagal** |
| HP | **36.534.756 byte (34,84 MB)** |
| APK | **33.040.167 byte (31,51 MB)** · `versionCode 20` · aset **byte-identik** |

**Berkas baru:** `tools/siapkan-data-ibrani.js` · `tools/ibrani-penjelasan.json` (99 entri) ·
`plugin/interlinear/ibrani.js` · `plugin/interlinear/data/ibrani.js`.
**Berkas diubah:** `plugin/interlinear/tampilan.js` (`mesinUntuk()` · kepala/kaki/tombol perjanjian) ·
`plugin/interlinear/plugin.js` (muat & lepas mesin Ibrani) · `index.html` (2 tag script) ·
`tools/buat-1-berkas.js` (bagian 3j) · `tools/uji-cepat.js` (K90-01…33) · `css/app.css` (tanpa perubahan).

**🐞 2 cacat UJI (bukan kode):** blok uji tidak memasang plugin ⇒ 11 gagal palsu (pelajaran K81) ·
blok uji tidak memuat data Alkitab padahal data dimuat **malas** ⇒ tombol tidak digambar.

**⚠️ Pelajaran:** format morphhb **tidak** punya atribut `strong` — nomor Strong ada di **digit depan
`lemma`** (`b/7225` → 7225). Dua percobaan pertama salah (0 hasil & 4 nomor) sebelum diukur benar.

---

## 1 November 2026 — ✡ **K89 SELESAI: KATA SERAPAN IBRANI / ARAM (ikon Bintang Daud)**

> Bapak: *"icon untuk menadakan bahasa yahudi.."* (disertai `icon yahudi.png` — Bintang Daud hitam 768×887)

**Keputusan Bapak:** ikon **di dalam kolom 🖊 Yunani** · **tanpa** penjelasan mengalir (cukup arti
singkat) · **SVG**.

**Diukur dulu:** **29 nomor Strong** berlabel Ibrani/Aram di 4 Injil · **203 dari 3.778 ayat (5,4 %)** ·
Matius **65** · Markus **38** · Lukas **31** · Yohanes **69** · tersering: amin **106×** · sabat **40×** ·
rabi **17×** · satan **12×** · paskah **11×** · barabas **10×**.
⚠️ **Data Ibrani Perjanjian Lama TIDAK ADA** di komputer ⇒ penanda hanya untuk **Injil**.

**Bentuk:** bagian **✡ Kata serapan bahasa Ibrani / Aram** di bawah blok Yunani, tiap kata =
lemma + alih huruf + apa yang TB tulis + **arti singkat 1 kalimat**. Ikon = **SVG Bintang Daud**
(2 segitiga bergaris, `currentColor`, 15×15 px).

**Bukti:** Matius 27:46 ⇒ **3 blok Yunani + 3 kata Ibrani** (Eli · lama · sabakhtani) ·
Yohanes 5:2 ⇒ **2 kata** · Matius 6:1 ⇒ **0** (tidak salah tandai) · **tanpa angka Strong** ·
lepas plugin **49 → 0** tombol, ayat tetap **66**, pasang lagi ⇒ **49** ✅

**Uji:** **15 uji K89 · 0 gagal** · versi **`v1Nov-c`** · HP **31,05 MB**

**Berkas:** `tools/siapkan-data-yunani.js` · `plugin/interlinear/{yunani.js,tampilan.js}` ·
`plugin/interlinear/data/yunani.js` · `css/app.css` · `tools/uji-cepat.js` · `rencanakerja.md` (18.2c)

---

## 1 November 2026 — 🔤 **K88 SELESAI butir a–f: PENJELASAN YUNANI → INDONESIA (TANPA ANGKA)**

> Bapak: *"untuk apa buat saya angka2 · bertanya-tanya > G3004 < di klik tidak ada yg terjadi..
> apa lebih baik dibuat dalam 1 kalimat sama seperti ayat TB.. saya tidak tau penuh angka2"*
> lalu *"kalau begitu apakah bisa dalam bahasa yunani menerangkan ayat seperti penguat.. jadi tidak
> perlu angka.. dari angka km terjemahkan buat saya artinya jadi saya tidak perlu telusuri angka"*

**Diukur dulu:** **2.833** kata Yunani di 4 Injil · **1.296 layak dijelaskan** · **1.537 kata fungsi
dilewati (36,3 %)** · bahan mentah **100 % lengkap** (56.785 kata) · **344 kata ≥10× menutup 97,6 %
ayat** · +190 kata (5–9×) ⇒ **100 %**.

⇒ **Kunci: penjelasan disusun PER KATA Yunani, ❌ bukan per ayat.**

**Hasil butir a–f:** data **180,3 KB** · sidik `yl-3778-20-29-d0cf9ba3` · **20 kata contoh** ⇒
**3.103 ayat (82,1 %)** · **12 uji K88 · 0 gagal** · versi **`v1Nov-c`** · HP **31,05 MB**.

🐞 **Cacat diperbaiki:** lepas plugin lalu pasang lagi ⇒ **0 tombol** (`dataset.ilHias`/`ylHias`
tidak dibuang · `siapkanOtomatis()` tidak menggambar ulang) ⇒ `gambarUlangHiasan()` +
`y.padaSiap(gambarUlangHiasan)`. Terukur **20 → 0 → 20 → 20 kolom** ✅

⬜ **Sisa:** butir **g** (344 kata, ±2,5 jam) · butir **h** (190 kata, ±1,5 jam).

**Berkas:** `tools/siapkan-data-yunani.js` · `tools/yunani-penjelasan.json` ·
`plugin/interlinear/{yunani.js,tampilan.js}` · `plugin/interlinear/data/yunani.js` ·
`css/app.css` · `index.html` · `tools/buat-1-berkas.js` · `tools/uji-cepat.js` · `rencanakerja.md` (18.2b)

---

## 1 November 2026 — 🖥 **K77i SELESAI: TAMPILAN IKUT SEGAR SESUDAH SINKRON MASUK**

> Bapak: *"coba catat di sudah di sharing with agnet.. dari index.html > server > APK. di coba lagi .. saya tes belum bisa"*

### 🔴 SEBAB TERUKUR (di APK nyata, ❌ bukan dugaan)

`localStorage` **sudah** berisi 1 catatan asli, tetapi **layar tetap menampilkan catatan contoh
"Selamat datang di ANodes"** ⇒ pengguna mengira sinkron **GAGAL** padahal datanya sudah masuk.

| # | Cacat | Akibat |
|---|---|---|
| a | `js/sinkron.js → ambil()` mengirim event **`anodes-sinkron-masuk`** tetapi **TIDAK ADA pendengarnya** | tampilan tidak pernah digambar ulang |
| b | `ANodesStore` menyimpan salinan di **MEMORI** (`let data`) | menulis langsung ke `localStorage` **tidak terbaca** oleh `daftar()`/`ambil()` |

### 🔧 Perbaikan

| Berkas | Perubahan |
|---|---|
| `js/store.js` | ➕ **`muatUlang()`** — baca ulang `localStorage` ke memori |
| `js/editor.js` | ➕ **`muatUlangCatatan()`** + pendengar `anodes-sinkron-masuk` (simpan dulu kalau `kotor`, lalu gambar ulang) · diekspor `ANodesEditor.muatUlangCatatan` |
| `tools/uji-cepat.js` | ➕ blok **K77i-01…06** · ➕ `anodes-sinkron-hapus` ke `KUNCI_AMAN` |

### 📊 BUKTI DI EMULATOR (APK dipasang BERSIH, sinkron otomatis DIMATIKAN supaya terukur bertahap)

| Tahap | Hasil |
|---|---|
| Sebelum | layar **"Selamat datang di ANodes"** · judul **"Catatan Pertama"** |
| Tekan sinkron | *"Selesai · 5 kunci terkirim · 1 catatan masuk"* |
| Sesudah | layar **"Melakukan lebih dari diminta , terbaik dan ex"** · judul **"Melakukan lebih dari diminta , terbaik"** |
| Tanpa buka ulang aplikasi | ✅ **BERHASIL** |

**7 uji K77i · 0 gagal** · penanda **`v1Nov-h`** · HP **32.139.975 byte (30,65 MB)** ·
**APK 31.769.931 byte (30,30 MB)** · SHA-256 `FB93F30E…28E99` · `versionCode 18` / `2.0.0-webview-k77i` · aset **byte-identik**.

⚠️ **Pelajaran:** uji yang menghitung **panggilan fungsi** GAGAL PALSU kalau pendengar memegang
**referensi asli** — uji **PERILAKU** (layar berubah), bukan jumlah panggilan.

## 1 November 2026 — 🗑 **K77h SELESAI: CATATAN YANG DIHAPUS TIDAK KEMBALI DARI SERVER**

> Bapak: *"hapus semua sisakan yg terakhir saja.. supaya bukti sudah berfungsi baik"* lalu *"di coba lagi .. saya tes belum bisa"*

### 🔴 SEBAB TERUKUR

PC berisi **1 catatan**, server berisi **5 catatan** (sisa duplikat + "Catatan Baru" kosong)
⇒ `ambil()` melaporkan **"4 catatan masuk"** ⇒ **sinkron hanya MENAMBAH, tidak pernah MENGHAPUS**.

### 🔧 Perbaikan — TOMBSTONE

| Bagian | Pelaksanaan |
|---|---|
| Kunci baru | `anodes-sinkron-hapus` → `{id: waktuHapus}` |
| `js/sinkron.js` | `KUNCI_HAPUS` · `daftarHapus` · `simpanHapus()` · `catatHapus(id)` · `hapusTercatat()` · `lupakanHapus(id)` |
| `gabungCatatan()` | menyaring id yang sudah dihapus + menggabung peta `hapus` dari server (yang lebih baru menang) |
| `kirim()` | menyertakan `d.hapus` **di dalam** muatan `anodes-catatan-v1` (tidak menambah kunci sinkron ke-6) |
| `js/store.js → buang()` | memanggil `catatHapus(id)` |

### 📊 BUKTI

Hapus 3 catatan lewat `ANodesStore.buang()` ⇒ tombstone tercatat ⇒ `kirim()` ⇒
**server tinggal 1 catatan** + peta `hapus` berisi 3 id ✅ · **5 uji logika K77h · 0 gagal** ·
penanda **`v1Nov-h`** · `versionCode 18`.

## 1 November 2026 — 🧪 **K77g SELESAI: ALAT UJI TIDAK BOLEH MENYENTUH SERVER SINKRON**

> Ditemukan sendiri saat memverifikasi server sesudah K77f: server berisi **2 catatan** —
> satu catatan asli + satu catatan **`awal-1` berjudul "Yohanes 3:16"** yang isinya
> **`"…sertaxyzwqv Taurat juga Mazmur 23:1."`** ⇒ itu **data uji K70** dari `tools/uji-cepat.js`.

### 🔴 Sebab terukur (❌ bukan diduga)

| Hal | Bukti |
|---|---|
| Sumber data | `tools/uji-cepat.js` blok **K70** mengetik `xyzwqv` untuk menguji “kursor tidak lompat” |
| Kenapa sampai ke server | suite uji **menyimpan catatan** ⇒ `js/editor.js → simpan()` memanggil **`ANodesSinkron.tandaiBerubah()`** ⇒ sinkron otomatis (3 detik) **mengirim** ke server sungguhan |
| Kenapa tidak terlihat | `KUNCI_AMAN` **memulihkan localStorage** sesudah uji — tetapi **kiriman ke server sudah terlanjur** |

### ⚙️ Perbaikan (2 berkas)

| Berkas | Pelaksanaan |
|---|---|
| **`js/sinkron.js`** | **`modeUji()`** membaca **`window.__ANODES_UJI`**. Saat hidup: `kirim()` ⇒ `{ditulis:0, dilewati:'mode uji'}` · `ambil()` ⇒ `{adaPerubahan:false, dilewati:'mode uji'}` · `sekarang()` ⇒ `{ok:false, pesan:'Mode uji — sinkron dilewati'}` · `tandaiBerubah()` **tidak menjadwalkan** kirim · `mulaiOtomatis()` **tidak memasang** timer |
| **`tools/uji-cepat.js`** | menyalakan **`window.__ANODES_UJI = true`** di awal suite · mematikannya di akhir + memanggil `mulaiOtomatis()` lagi |

### ✅ Hasil terukur

| Hal | Bukti |
|---|---|
| `sekarang()` saat mode uji | ✅ `{ok:false, pesan:'Mode uji — sinkron dilewati'}` |
| `kirim()` saat mode uji | ✅ `{ditulis:0, dilewati:'mode uji'}` |
| `ambil()` saat mode uji | ✅ `{adaPerubahan:false, dilewati:'mode uji'}` |
| `tandaiBerubah()` saat mode uji | ✅ tetap mencatat waktu, **tidak** menjadwalkan kirim |
| Mode uji mati | ✅ `sekarang()` ⇒ *“Selesai · 5 kunci terkirim”* (normal lagi) |
| Uji | ✅ **5 uji K77g · 0 gagal** (K77g-01…05) |
| Server dibersihkan | ✅ **1 catatan** (hanya catatan asli) |
| Penanda versi | **`v1Nov-f` → `v1Nov-g`** |
| HP `ANodes-1berkas.html` | **32.123.891 byte (30,63 MB)** |
| APK | **31.763.179 byte (30,29 MB)** · SHA-256 `371E5816…44F38` · `versionCode 17` / `2.0.0-webview-k77g` · aset **byte-identik** |

### ⚠️ Pelajaran

1. 🔴 **Alat uji yang menyimpan catatan AKAN memicu sinkron otomatis.** Memulihkan `localStorage`
   **tidak cukup** — kiriman ke server **sudah terlanjur**. Setiap suite uji **WAJIB** mematikan
   sinkron lebih dulu (`window.__ANODES_UJI`).
2. 🔴 **Data uji bisa masuk ke data produksi.** Karena sinkron otomatis hidup, catatan uji
   (`xyzwqv`) **terkirim ke server sungguhan** dan **muncul di HP**.
3. **Periksa server sesudah menjalankan suite uji** — jangan hanya percaya “uji 0 gagal”.
   Uji yang lulus bisa tetap **merusak data**.
4. **Penanda mode uji harus dibaca di SEMUA jalur** (`kirim` · `ambil` · `sekarang` ·
   `tandaiBerubah` · `mulaiOtomatis`) — kalau hanya di satu jalur, kebocoran tetap terjadi.

**Berkas:** `js/sinkron.js` · `tools/uji-cepat.js` · `index.html` · `artifacts/APK-INFO.txt` ·
`android-native/app/build.gradle.kts` · 💾 `backups/k77g-uji-tidak-sinkron-20261101-151735/`.

## 1 November 2026 — 🧹 **K77f SELESAI: CATATAN CONTOH TIDAK BOLEH MENGOTORI DAFTAR/SERVER**

> 💬 Bapak: *“hapus semua sisakan yg terakhir saja.. supaya bukti sudah berfungsi baik”*
> ⇒ sesudah catatan kotbah dibersihkan & disinkronkan, APK baru dipasang untuk membuktikan
> sinkron bekerja. Ternyata **server tercemar** catatan contoh.

### 🔴 2 cacat nyata (diukur, ❌ bukan diduga)

| # | Cacat | Bukti terukur |
|---|---|---|
| **A** | `js/store.js → rapikan()`: **`if (!c.waktu) c.waktu = Date.now()`** — angka **`0` dianggap kosong** ⇒ perbaikan **K77c** (`waktu: 0`) **DIBATALKAN sendiri** setiap halaman dimuat | APK baru dipasang: `awal-1`/`awal-2` ber-`waktu` = **sekarang**, bukan `0` |
| **B** | `js/sinkron.js → kirim()` mengirim **SELURUH** isi `anodes-catatan-v1` **tanpa menyaring** catatan contoh | Server berisi **3 catatan**: `awal-1` "Catatan Pertama" + `awal-2` "Rencana" + catatan asli |

### ⚙️ Perbaikan (3 lapis)

| Lapis | Berkas | Pelaksanaan |
|---|---|---|
| **a** | `js/store.js → rapikan()` | **`if (c.waktu == null \|\| c.waktu === '')`** — angka `0` **tetap 0** |
| **b** | `js/sinkron.js → kirim()` | **`saringContoh(isi)`** membuang catatan contoh. ⚠️ Kalau setelah disaring **TIDAK ADA catatan asli** ⇒ `anodes-catatan-v1` **TIDAK dikirim** (kalau dikirim, server ditimpa daftar kosong ⇒ **catatan asli pengguna HILANG**) |
| **c** | `js/sinkron.js → gabungCatatan()` | (1) contoh **dari server** dilewati bila server sudah punya catatan asli; (2) contoh **lokal** dibuang bila sudah ada catatan asli |

### ✅ Hasil terukur (emulator `uji-anodes-s2` Android 34 · APK dipasang **BERSIH**)

| Hal | Bukti |
|---|---|
| Sebelum sinkron | **1 catatan** — contoh dibersihkan otomatis (`waktu: 0` bertahan) |
| Uji sambungan | ✅ *“Sambungan berhasil · 5 kunci di server”* |
| Sinkron | ✅ *“Selesai · 5 kunci terkirim”* |
| Sesudah sinkron | ✅ **1 catatan** — “Melakukan lebih dari diminta , terbaik” (1.901 char) |
| **Server** | ✅ **1 catatan** (sama) — **TIDAK tercemar** |
| Uji logika | ✅ **7 uji K77f · 0 gagal** (K77f-01…07) |
| Penanda versi | **`v1Nov-e` → `v1Nov-f`** |
| HP `ANodes-1berkas.html` | **32.110.089 byte (30,62 MB)** |
| APK | **31.756.327 byte (30,29 MB)** · SHA-256 `3D1527FC…99240` · `versionCode 16` / `2.0.0-webview-k77f` · aset **byte-identik** |

### 🐞 Cacat build yang ketemu

> **APK membengkak 30,29 MB → 40,7 MB** sesudah 3× build bertahap.
> **Sebab terukur:** `gradlew` **tidak membersihkan** `classes*.dex` lama ⇒ **11 berkas dex**
> (total **66,2 MB** tak terkompresi) tertinggal di APK.
> **Perbaikan:** **`gradlew clean` WAJIB** sebelum build kalau sebelumnya pernah build bertahap.
> Sesudah clean: **30,29 MB** (normal).

### ⚠️ Pelajaran

1. 🔴 **`if (!c.waktu)` MERUSAK `waktu: 0`.** Angka `0` itu **sah** dan **bermakna**. Untuk memeriksa
   "belum diisi", pakai **`== null || === ''`** — ❌ jangan `!nilai`.
2. 🔴 **Fungsi KIRIM wajib menyaring, bukan hanya fungsi GABUNG.** K77c memperbaiki sisi **TERIMA**,
   tetapi `kirim()` (sisi **KIRIM**) masih mengirim apa adanya ⇒ data sampah tetap naik ke server.
3. 🔴 **Jangan pernah mengirim daftar KOSONG ke server** — server ditimpa daftar kosong ⇒
   **catatan asli pengguna hilang selamanya**.
4. **`gradlew clean` wajib** sebelum build APK kalau sebelumnya build bertahap.
5. **Uji di APK harus dari keadaan BERSIH** (`adb uninstall` dulu) — kalau tidak, cacatnya
   **tidak terlihat**.

**Berkas:** `js/store.js` · `js/sinkron.js` · `index.html` · `tools/uji-cepat.js` (**K77f-01…07**) ·
`android-native/app/build.gradle.kts` · `artifacts/APK-INFO.txt` ·
`artifacts/k77f-apk-satu-catatan.png` · 💾 `backups/k77f-contoh-tidak-kirim-20261101-144646/`.

## 1 November 2026 — 🌉 **K77e SELESAI: JEMBATAN HTTP NATIVE — SINKRON DI APK AKHIRNYA JALAN**

> 💬 Bapak (tangkapan layar APK): modal ☁️ Sinkron menampilkan
> **“⚠️ Tidak tersambung ke server — periksa internet & alamat Worker”** ⇒ *“cek di apk .. belum bisa”*

### 🔎 SEBAB TERUKUR (❌ bukan dugaan) — WebView Android memblokir CORS

| Yang diperiksa | Hasil |
|---|---|
| CORS di `worker/worker.js` | ✅ **sudah benar** (`Allow-Origin`, `Allow-Headers: X-Kunci`, `OPTIONS` → 204) |
| `fetch()` dari **Chrome PC** (`file://`) | ✅ **BERHASIL** — *“5 kunci di server”* |
| `fetch()` dari **WebView APK** (`file:///android_asset/…`) | ❌ **DIBLOKIR** — WebView menolak lintas-asal `file://` → `https://` |
| `WebSettings.allowFileAccess` | ❌ **tidak** membuka CORS; tidak ada API untuk mematikannya |

⇒ **Bukan salah Worker, bukan salah alamat/kunci.** Yang salah: permintaan dikerjakan
**dari WebView**, padahal WebView Android **tidak mengizinkannya**.

### 🔧 PERBAIKAN — permintaan HTTP dikerjakan dari SISI ANDROID (OkHttp)

| Bagian | Pelaksanaan |
|---|---|
| `build.gradle.kts` | ➕ `com.squareup.okhttp3:okhttp:4.12.0` |
| `AndroidManifest.xml` | ➕ `INTERNET` + `ACCESS_NETWORK_STATE` |
| `WebAppActivity.kt` | ➕ `OkHttpClient` (connect 20 s · read/write 30 s) |
| `Bridge` | ➕ **`@JavascriptInterface fun httpKirim(metode, alamat, kunci, badan): String`** — selalu mengembalikan JSON, **tidak pernah melempar galat** |
| `js/sinkron.js` | ➕ **`jembatanAndroid()`** + **`panggilAndroid()`** ⇒ `panggil()` memilih **jembatan Android dulu**, kalau tidak ada → `fetch()` |
| Versi | `js/sinkron.js` **`v1Nov-d` → `v1Nov-e`** · halaman **`v1Nov-e`** · APK **`versionCode 15`** |

⚠️ **`httpKirim` TIDAK boleh `runOnUiThread`** — dipanggil dari thread WebView & melakukan I/O jaringan.

### ✅ HASIL TERUKUR — diuji di EMULATOR dengan APK NYATA (Android 34)

| Uji | Hasil |
|---|---|
| **9 uji logika jembatan** (Node) | ✅ **0 gagal** |
| **10 uji di APK nyata** (WebView DevTools) | ✅ **0 gagal** |
| **`uji()` lewat jembatan** | ✅ **“Sambungan berhasil · 5 kunci di server”** |
| **`sekarang()` (Sinkron sekarang)** | ✅ **“Selesai · 5 kunci terkirim”** |
| Status di modal | ✅ **tidak lagi** “Tidak tersambung” |
| Izin di APK (`aapt2 dump badging`) | ✅ `INTERNET` + `ACCESS_NETWORK_STATE` |
| HP | **32.097.668 byte (30,61 MB)** |
| **APK** | **31.750.899 byte (30,28 MB)** · SHA-256 `057E209B…9D29` · `versionCode 15` |

### ⚠️ PELAJARAN

1. 🔴 **WebView Android ≠ Chrome.** `fetch()` dari `file://` ke `https://` **berhasil di Chrome**
   tetapi **DIBLOKIR di WebView** ⇒ fitur jaringan **WAJIB diuji di APK nyata**.
2. 🔴 **`allowFileAccess` BUKAN solusi CORS.** Yang benar: kerjakan permintaan dari sisi
   Android (OkHttp) lalu kirim hasilnya lewat `@JavascriptInterface`.
3. 🔴 **`@JavascriptInterface` yang melakukan I/O jaringan JANGAN `runOnUiThread`.**
4. **Jembatan harus SELALU mengembalikan JSON**, tidak pernah melempar galat.
5. **`js/sinkron.js` WAJIB tetap bisa jalan tanpa jembatan** (PC/Chrome).
6. **Izin `INTERNET` wajib** — tanpa itu OkHttp gagal `Permission denied`.
7. **Uji di emulator = bukti paling kuat** (`adb forward tcp:9222 localabstract:webview_devtools_remote_<pid>`).

**Berkas:** `android-native/app/build.gradle.kts` · `AndroidManifest.xml` · `WebAppActivity.kt` ·
`js/sinkron.js` · `index.html` · `artifacts/APK-INFO.txt` · `artifacts/k77e-apk-sinkron-berhasil.png`.

## 1 November 2026 — 🚫 **K77d SELESAI: KOLOM ALAMAT & KUNCI DIHAPUS DARI MODAL SINKRON**


> 💬 Bapak: *“kalau di index.html masih ada alamat worker + kunci .. sama saya sudah coba apk
> masih ada.. coba di debuging ..”*

### 🔎 HASIL DEBUG (❌ bukan dugaan) — APK SUDAH BENAR, yang salah TAMPILANNYA

Saya **ekstrak `assets/anodes.html` dari APK** lalu buka di Chrome:

```
versi        : v1Nov-c
bawaan       : {"alamat":"https://anodes-sync.suwandhih.workers.dev",
                "kunci":"anodes-suwandhi-2026","otomatis":true}
siap         : true
kolomAlamat  : https://anodes-sync.suwandhih.workers.dev   <- TERISI
kolomKunci   : 14 titik                                     <- TERISI
```

⇒ **Alamat & kunci memang sudah tertanam dan kolom sudah terisi otomatis.**
**Yang Bapak maksud: kolomnya TIDAK PERLU ADA SAMA SEKALI** — bukan “harus terisi”.

### 🔧 PERBAIKAN

| Bagian | Pelaksanaan |
|---|---|
| `index.html` | kolom `#sk-alamat` & `#sk-kunci` **DIHAPUS** · tombol **↺ Setelan bawaan** juga dihapus |
| Keterangan | **“✅ Sudah tersambung. Tidak perlu mengisi apa pun — cukup tekan ☁️ Sinkron sekarang.”** |
| `bukaSinkron()` | tidak menyentuh kolom yang tidak ada · semua akses lewat penjaga `if (el)` |
| `simpanSetelSinkron()` | membaca dari **`S.setel()`** (bukan DOM) |
| Kaki modal | **4 tombol → 3** (Tutup · Uji sambungan · ☁️ Sinkron sekarang) |
| Versi | `js/sinkron.js` **`v1Nov-c` → `v1Nov-d`** · halaman **`v1Nov-c` → `v1Nov-d`** |

### ✅ HASIL TERUKUR

| Hal | Bukti |
|---|---|
| **18 uji K77d · 0 gagal** | `index.html` |
| **14 uji K77d · 0 gagal** | **langsung dari `assets/anodes.html` di dalam APK** |
| Kolom alamat/kunci di DOM | ✅ **TIDAK ADA** |
| `siap()` tanpa mengisi | ✅ **true** |
| Kaki modal | ✅ **3 tombol** · tidak meluber |
| **Sambungan NYATA** | ✅ **BERHASIL** — *“Sambungan berhasil · 5 kunci di server”* |
| Sisa kolom di `ANodes-1berkas.html` | ✅ **0** |
| HP | **32.085.414 byte (30,60 MB)** |
| **APK** | **31.394.342 byte (29,94 MB)** · SHA-256 `5B3CCB9D…5A0F` · `versionCode 14` / `2.0.0-webview-k77d` · aset **byte-identik** |

### ⚠️ PELAJARAN

1. 🔴 **“Sudah terisi otomatis” ≠ “tidak perlu ada”.** Kalau pengguna bilang *“masih ada alamat
   worker + kunci”*, yang dimaksud bisa **kolomnya masih terlihat** — bukan nilainya kosong.
2. 🔴 **Debug dari ISI APK, bukan dari berkas proyek.** Ekstrak `assets/anodes.html` lalu buka
   di Chrome ⇒ terbukti APK **sudah** memuat kode terbaru.
3. **Menghapus elemen DOM wajib diikuti penjaga `if (el)` di SEMUA pembacanya.**
4. **Nilai setelan jangan dibaca dari DOM kalau kolomnya boleh tidak ada.**
5. **Uji lama yang menuntut elemen ada WAJIB dibalik** menjadi “elemen itu TIDAK boleh ada”.

**Berkas:** `index.html` · `js/editor.js` · `js/sinkron.js` · `tools/uji-cepat.js` ·
`android-native/app/build.gradle.kts` · `artifacts/APK-INFO.txt` ·
`artifacts/k77d-modal-tanpa-kolom.png`.

## 1 November 2026 — 🛡 **K77c SELESAI: CATATAN CONTOH TIDAK BOLEH MENIMPA CATATAN ASLI**

> 💬 Bapak: *“sebelum saya update APK pada HP .. saya perlu kunci aplikasi saya isi dulu
> untuk update data tadi saya ketik di catat ke server”*

### 🔴 TEMUAN BERBAHAYA (diukur, ❌ bukan diduga)

Karena **K77b** membuat sinkron **langsung siap tanpa mengisi apa pun**, perangkat **BARU**
(HP setelah update APK / profil Chrome baru) **langsung menyinkron** — dan itu berbahaya:

| Langkah | Yang terjadi |
|---|---|
| 1 | Perangkat baru membuka ANodes ⇒ `js/store.js` membuat **2 catatan contoh** dengan **`waktu: Date.now()`** |
| 2 | Sinkron otomatis jalan (bawaan **ON**) |
| 3 | Aturan **“`waktu` lebih baru MENANG”** ⇒ catatan **CONTOH** mengalahkan catatan **ASLI** di server |
| 4 | **DATA PENGGUNA HILANG** — terukur `masuk 0 · keluar 2` |

⚠️ **Bukan bug lama** — baru berbahaya **setelah** K77b (sebelumnya perangkat baru tidak
menyinkron karena setelan kosong).

### 🔧 PERBAIKAN (2 lapis — keduanya WAJIB)

| Lapis | Berkas | Pelaksanaan |
|---|---|---|
| **1. `waktu: 0`** | `js/store.js` | catatan contoh dibuat dengan **`waktu: 0`** ⇒ selalu kalah |
| **2. pengenal ISI** | `js/sinkron.js` | **`TANDA_CONTOH`** + **`ialahContoh()`** ⇒ perangkat **LAMA** juga aman |
| Aturan gabung | `js/sinkron.js` | `contohLokal && !contohJauh` ⇒ pakai server · `contohJauh && !contohLokal` ⇒ kirim yang asli |

### ✅ HASIL TERUKUR — 6 skenario, semuanya AMAN

| # | Skenario | Hasil |
|---|---|---|
| A | perangkat BARU (`waktu` 0) vs server asli | ✅ asli menang (`masuk 2 · keluar 0`) |
| B | perangkat LAMA (contoh ber-`waktu` sekarang) vs server asli | ✅ asli menang (`masuk 1 · keluar 1`) |
| C | lokal asli vs server masih contoh | ✅ asli menang (`keluar 2`) |
| D | lokal asli vs server contoh ber-`waktu` sekarang | ✅ asli menang |
| E | dua-duanya contoh | ✅ tidak berubah |
| F | dua-duanya asli sama | ✅ tidak berubah |

| Hal | Bukti |
|---|---|
| **10 uji K77c · 0 gagal** | `index.html` |
| **9 uji K77c · 0 gagal** | `ANodes-1berkas.html` + **sambungan NYATA** (*“5 kunci di server”*) |
| Setelan permanen K77b | ✅ tetap utuh |
| Penanda | **`v1Nov-b` → `v1Nov-c`** |
| HP | **32.074.929 byte (30,59 MB)** |
| **APK** | `artifacts/ANodes-webview-debug.apk` · **31.390.942 byte (29,94 MB)** · SHA-256 `55D28949…FE4C` · `versionCode 13` / `2.0.0-webview-k77c` · aset **byte-identik** · **token Turso 0 kemunculan** |

### ⚠️ PELAJARAN

1. 🔴 **Membuat fitur “langsung jalan” bisa MEMBUKA BAHAYA yang tadinya tertutup.**
   Setiap kali menghapus “pagar” (mis. wajib isi setelan), periksa apa yang tadinya
   terlindungi oleh pagar itu.
2. 🔴 **Catatan contoh WAJIB ber-`waktu` 0** — bukan data pengguna ⇒ tidak boleh pernah menang.
3. 🔴 **`waktu` saja tidak cukup** — perangkat lama sudah terlanjur menyimpan catatan contoh
   ber-`waktu` sekarang ⇒ **pengenal ISI** wajib ada.
4. **Uji skenario “perangkat baru” WAJIB ada** untuk setiap fitur sinkron.
5. **Ukur dulu, jangan menyerahkan ke pengguna** — temuan ini ketemu **sebelum** APK di-update.

**Berkas:** `js/store.js` · `js/sinkron.js` · `tools/uji-cepat.js` (**K77c-01…07**) ·
💾 `backups/k77b-setelan-permanen-20261101/`.

## 1 November 2026 — ☁️ **K77b SELESAI: SETELAN SINKRON DIBUAT PERMANEN**

> 💬 Bapak (dengan tangkapan layar modal ☁️ Sinkron — kolom **Kunci aplikasi kosong**):
> *“saya perlu bantuan sync data dengan server di buat permanent saja.. supaya setiap sync
> saya tidak perlu mengisi..”*

### 🔎 SEBAB TERUKUR (❌ bukan diduga)

Setelan **SUDAH** disimpan di `localStorage` (`anodes-sinkron-setel`) sejak K77. Yang salah
**3 hal lain**:

| # | Temuan | Akibat |
|---|---|---|
| 1 | **Bawaan KOSONG** (`{alamat:'', kunci:''}`) | perangkat baru / HP / profil Chrome baru **wajib mengisi ulang** |
| 2 | `simpanSetel()` **menyimpan nilai kosong** | bawaan bisa **terhapus** oleh simpanan kosong |
| 3 | Pengait memakai **`change`** (bukan `input`) | menutup modal lewat **✕ / klik latar** **membuang isian** yang baru diketik |

⇒ Yang diminta Bapak bukan “simpan setelan” (sudah ada), tetapi **“JANGAN PERNAH mengisi lagi”** —
termasuk di **perangkat baru**. Itu hanya bisa kalau setelannya **ditanam** di berkas.

### 🔧 PERBAIKAN

| Bagian | Pelaksanaan |
|---|---|
| **`BAWAAN`** (BARU) | `{alamat:'https://anodes-sync.suwandhih.workers.dev', kunci:'anodes-suwandhi-2026', otomatis:true}` **ditanam** di `js/sinkron.js` |
| `muatSetel()` | mulai dari **BAWAAN** · simpanan hanya menimpa **kolom yang BERISI** ⇒ **kolom kosong TIDAK menghapus bawaan** |
| `simpanSetel()` | kolom kosong ⇒ **kembali ke bawaan** |
| **`setelBawaan()`** (BARU) | kembalikan seluruh setelan ke bawaan pabrik |
| Tombol **↺ Setelan bawaan** | di kaki modal |
| Pengait kolom | **`input` + `change`** ⇒ ketikan **langsung** tersimpan |
| Keterangan | kotak hijau **“✅ Setelan sudah permanen”** |
| Kaki modal | **4 tombol → 2 baris × 2** (terukur **420/420**, tidak meluber) |
| Versi | `js/sinkron.js` **`v30Okt-c` → `v1Nov-b`** · halaman **`v1Nov-a` → `v1Nov-b`** |

### ✅ HASIL TERUKUR

| Hal | Bukti |
|---|---|
| **27 uji K77b · 0 gagal** | di `index.html` **dan** `ANodes-1berkas.html` |
| **29 uji K77 resmi · 0 gagal** | asersi lama **tidak ada yang rusak** |
| **Sambungan NYATA dari profil KOSONG** | ✅ **BERHASIL** — *“Sambungan berhasil · 5 kunci di server”* |
| Kolom terisi saat modal dibuka | ✅ alamat + kunci (14 titik) |
| Simpanan kosong | ✅ kembali ke bawaan · `siap()` tetap **true** |
| Token Turso | ✅ **TIDAK ADA** di berkas klien |
| HP `ANodes-1berkas.html` | **32.060.793 byte (30,58 MB)** |
| Tangkapan layar | `artifacts/k77b-setelan-permanen.png` |

### ⚠️ PELAJARAN

1. 🔴 **“Sudah disimpan” ≠ “tidak perlu diisi lagi”.** Setelan per perangkat tetap kosong di
   perangkat baru. Kalau pengguna minta *“permanen”*, maksudnya **ditanam sebagai bawaan**.
2. 🔴 **Simpanan KOSONG tidak boleh menghapus BAWAAN.**
3. 🔴 **`change` ≠ `input`** — `change` baru jalan saat kehilangan fokus.
4. **Rahasia tetap di tempatnya** — token Turso tetap hanya di Worker.
5. ⚠️ **`Set-Content -NoNewline` MERUSAK `index.html`** (899 → 1 baris). Pakai
   `[System.IO.File]::WriteAllText(...UTF8Encoding($false))`. Berkas dipulihkan dari backup.

**Berkas:** `js/sinkron.js` · `js/editor.js` · `index.html` · `css/app.css` ·
`tools/uji-cepat.js` (**K77b-01…16**) · `artifacts/k77b-setelan-permanen.png` ·
💾 `backups/k77b-setelan-permanen-20261101/`.

## 1 November 2026 — 🔤 **K85 TAHAP 1 SELESAI: PLUGIN INTERLINEAR (4 INJIL)**

> 💬 Bapak: *“proses bisa 6 jam”* — sesudah saya paparkan rencana K85 tahap 1 (±6 jam).
> ✅ **Nyata ±1,5 jam** (lebih cepat karena aturan ditemukan lewat **pengukuran**, bukan coba-coba).

### 📊 HASIL

| Hal | Angka |
|---|---|
| Ayat | **3.778** (Matius 1.071 · Markus 678 · Lukas 1.150 · Yohanes 879) |
| Kata ber-Strong | **56.785** |
| Nomor Strong dipakai | **2.833** |
| Kata fungsi ber-glosa tetap | **54** nomor (mencakup **62,4 %** kemunculan) |
| Ukuran data | **1.741 KB** |
| Sidik | `il-3778-2833-9ebeaa9b` |
| Uji | **46 uji · 0 gagal** (`index.html` **dan** `ANodes-1berkas.html`) |
| HP `ANodes-1berkas.html` | **30,56 MB** (dari 27,08) |
| Penanda versi | **`v1Nov-a`** |
| ⚠️ Ayat tanpa data | **Lukas 17:36** (ayat kurung, tidak ada di idkjv) |

### 🔴 6 TEMUAN YANG MENGUBAH RENCANA (semua diukur, ❌ bukan diduga)

| # | Rencana | Kenyataan | Perbaikan |
|---|---|---|---|
| 1 | kamus `andysaktia` = “Indonesia + Inggris” | ❌ **hanya 5 dari 14.197** entri punya `definition.id`, dan itu pun `machine` (AI, belum ditinjau) | arti **tidak** diambil dari situ |
| 2 | — | ✅ `idkjv` sudah memberi **kata Indonesia** tiap nomor Strong | arti **diturunkan dari pemakaian nyata**: G25→*mengasihi* · G2316→*Allah* · G3056→*firman* · G4102→*iman* |
| 3 | satu `<w>` = satu Strong | ❌ **6.109 dari 56.785 (10,8 %)** memuat **>1** Strong (`Firman` = `[G3588, G3056]`) | kata diberikan **hanya** ke Strong **TERAKHIR** |
| 4 | — | ✅ diuji 6 contoh: `Firman`→G3056 ✓ · `Allah`→G2316 ✓ · `hidup itu`→G2222 ✓ · `terang`→G5457 ✓ · `manusia`→G444 ✓ · `kegelapan`→G4653 ✓ | aturan **“Strong terakhir = kata isi”** |
| 5 | — | ❌ kata fungsi tetap ngawur (`G3588`→“Yesus · Allah · murid-murid” · `G3754`→“tiada · Anak · Mengapa”) | **`GLOSA_TETAP`** 54 nomor |
| 6 | — | ❌ **16 kata Inggris bocor** (`and`, `thou`, `Jesus`) | **`KATA_INGGRIS`** menyaring |

### 🐞 2 CACAT NYATA yang ketemu saat menguji (jangan diulang)

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | Pola `<verse sID="…">` untuk mengurai OSIS | **Yohanes 8:1–8:11 hilang** (terukur **337 dari 879** ayat) — atribut `osisID` kadang **sebelum** `sID` | pola `<verse\s[^>]*?sID="…"` ⇒ **879 ayat** ✓ |
| 2 | Harness uji tidak memasang plugin 📖 Alkitab | halaman baca tidak terbuka ⇒ **4 uji gagal palsu** | pasang `alkitab` dulu + tunggu 2,5 s (pelajaran K83) |

### 📦 BERKAS

**Baru:** `plugin/interlinear/plugin.js` (96 baris) · `plugin/interlinear/interlinear.js` (252) ·
`plugin/interlinear/tampilan.js` (285) · `plugin/interlinear/data/interlinear.js` (1.741 KB) ·
`tools/siapkan-data-interlinear.js` · `tools/uji-k85.js` · `artifacts/k85-interlinear.png`

**Diubah:** `index.html` (+4 tag `<script>`, penanda `v1Nov-a`) · `css/app.css` (blok K85, +141 baris) ·
`tools/buat-1-berkas.js` (data interlinear disatukan) · `tools/uji-cepat.js` (`KUNCI_AMAN`) ·
`plugin/alkitab/tampilan.js` (`VERSI` → `v1Nov-a`) · `rencanakerja.md` · `agents.md` ·
`prompt.md` · `panduan.md`

💾 Backup: `backups/k85-interlinear-20261101/`

### ⚠️ PELAJARAN

1. **“Kamus Indonesia” di GitHub bisa KOSONG.** Deskripsi repo ≠ isi. **Hitung** `definition.id`
   yang benar-benar ada.
2. **Arti lebih baik DITURUNKAN dari pemakaian nyata** daripada diterjemahkan mesin.
3. **Satu `<w>` bisa memuat >1 Strong (10,8 %)** ⇒ beri kata **hanya** ke Strong terakhir.
4. **Kata fungsi WAJIB glosa tetap** — arti-turunan untuk kata sandang/preposisi selalu ngawur.
5. **Atribut XML bisa berurutan bebas** — pola yang mengandaikan urutan kehilangan **62 % ayat**
   tanpa error.

## 1 November 2026 — 🔤🔀🕒 **RENCANA 3 PLUGIN TEOLOGI DIGABUNG KE `rencanakerja.md`** (berkas terpisah dihapus)

> 💬 Bapak: *“di proses satu - satu .. jadi semua ini dimasukkan dalam rencanakerja.md dan
> rencanakerja-next.md dihapus supaya tidak bingung banyak rencanakerja · mulai dari 1 ..
> boleh test injil dulu setelah itu selesai 62 kitab langsung dibagi per pekerjaan dengan waktu”*

### 🔎 SEBELUM DIGABUNG — 6 HAL DI BERKAS LAMA DIPERIKSA (5 salah, 1 perlu koreksi)

| # | Isi `rencanakerja-next.md` | Hasil pemeriksaan |
|---|---|---|
| 1 | data `indonesian_tb_strongs.json` dari `scrollmapper/bible_databases` | ❌ **TIDAK ADA** — 140 berkas JSON diperiksa: **0** cocok `indones`/`strong`; isinya hanya versi **Inggris** (KJV/ASV/WEB/YLT/Webster/BBE) |
| 2 | TSI/BIS “berhak cipta, tidak boleh dibundel” | ❌ **SALAH** — eBible.org menyatakan TSI = **CC BY-SA 4.0**, *“permission to share and redistribute … in any format”* ⇒ **boleh dibundel** dengan atribusi |
| 3 | `Bible-Forge/bible-forge` | ❌ **404** — repo yang benar `bibleforge/BibleForge` (66⭐) |
| 4 | *“DILARANG KERAS mengubah index.html”* | ❌ **mustahil** — plugin butuh `<script src>`; `index.html` sudah punya **34 tag** |
| 5 | perkiraan **15 / 10 / 12 menit** | ❌ **tidak realistis** — K84 saja 26 menit build + 22 uji; diganti **JAM** |
| 6 | *“tinggal panggil `tampilKeteranganIstilah()`”* | ⚠️ fungsinya **ADA** (`plugin/kamus/tampilan.js:1436`) tetapi **TIDAK diekspor** (blok `return` baris 2378–2406) ⇒ butuh jembatan baru / kolom sendiri |

### ✅ SUMBER DATA YANG **TERBUKTI ADA** (diperiksa 1 Nov 2026)

| Sumber | Isi | Lisensi | Cakupan |
|---|---|---|---|
| `tonny-kohar/idkjv` | Indonesia + **kode Strong** | ✅ **Public Domain** | ⚠️ **hanya 4 Injil** lengkap · Kisah s/d 25:9 |
| `andysaktia/strongs-dictionary-json` | kamus Strong **Indonesia + Inggris** | ✅ PD (teks) + CC BY 4.0 | Yunani 2,9 MB · Ibrani 4,7 MB |
| `STEPBible/STEPBible-Data` | teks asli **ber-Strong** TAHOT + TAGNT | ✅ CC BY | **66 kitab** |
| **eBible.org `ind`** | **TSI Edisi Ketiga** | ✅ **CC BY-SA 4.0** | `ind_usfm.zip` **HTTP 200 · 1.377.614 byte** |
| `robertrouse/theographic-bible-metadata` | 450+ peristiwa · raja · tahun | ✅ CC-BY-SA-4.0 | linimasa |

### 🔧 YANG DITULIS KE `rencanakerja.md`

| Bagian | Isi |
|---|---|
| **papan B** | **3 baris baru di urutan 1–3** (K85 · K86 · K87) · baris lama **dinomori ulang 4–12** |
| **bagian 18** (BARU, 218 baris) | **18.0** urutan + total **±31,5 jam** · **18.1** 12 aturan wajib · **18.2** K85 (tahap 1 = 4 Injil ±6 jam · tahap 2 = **62 kitab dibagi 7 pekerjaan** ±16,5 jam) · **18.3** K86 (±5 jam) · **18.4** K87 (±4 jam) · **18.5** dokumen yang diperbarui · **18.6** 6 hal yang dibatalkan · **18.7** 4 pertanyaan yang masih perlu keputusan |
| kepala dokumen | catatan **1 Nov 2026** — `rencanakerja-next.md` digabung lalu dihapus |

### 📊 PEMBAGIAN 62 KITAB — **ANGKA DIPERIKSA DARI DATA ASLI** (❌ bukan dikira)

| # | Pekerjaan | Kitab | Ayat | Jam |
|---|---|---|---|---|
| P1 | Taurat sisa | Kej 1–5 | **5.852** | ±3 |
| P2 | Sejarah | Yos 6 → Est 17 | **7.018** | ±3,5 |
| P3 | Puisi & Hikmat | Ayb 18 → Kid 22 | **4.785** | ±2,5 |
| P4 | Nabi Besar | Yes 23 → Dan 27 | **4.440** | ±2,5 |
| P5 | Nabi Kecil | Hos 28 → Mal 39 | **1.050** | ±1,5 |
| P6 | Kisah + Paulus | Kis 44 → Flm 57 | **3.040** | ±2 |
| P7 | Umum + Wahyu | Ibr 58 → Why 66 | **1.138** | ±1,5 |
| | **TOTAL** | **62 kitab** | **27.323** | **±16,5** |

✅ **Dibuktikan:** 5.852+7.018+4.785+4.440+1.050+3.040+1.138 = **27.323** = 31.102 − **3.779** (4 Injil) ✓

### 📦 HASIL

| Hal | Nilai |
|---|---|
| `rencanakerja.md` | **546.646 byte · 6.660 baris** (dari 532.350 · 6.429) |
| `rencanakerja-next.md` | ❌ **DIHAPUS** (backup: `backups/gabung-rencana-20261101/`) |
| Berkas `rencanakerja-*.md` di proyek | **0** — hanya satu rencana kerja ✅ |
| Papan B | **12 baris** bernomor 1–12, **0 kembar** |
| Perkiraan total | **±31,5 jam** (K85 t1 6 · K85 t2 16,5 · K86 5 · K87 4) |

⚠️ **BELUM ADA KODE APLIKASI YANG DIUBAH** — ini murni penggabungan rencana.
⚠️ **4 pertanyaan (18.7) harus dijawab dulu** sebelum tahap 1 dimulai.

## 1 November 2026 — 🧹 **DOKUMEN DIRAPIKAN (angka diukur ulang + papan order dibersihkan)**

> 💬 Bapak: *“di rapihkan .. secepatnya”* — setelah saya laporkan **5 ketidakcocokan** antara
> dokumen dan kenyataan.

**🔎 DIUKUR ULANG DULU (❌ bukan diduga)** — semua angka dihitung dari berkas asli:

| Hal | Dokumen (usang) | **Kenyataan 1 Nov 2026** |
|---|---|---|
| `index.html` | 808 baris | **891** |
| `css/` | 4.682 | **5.557** (2 berkas) |
| `js/` | 5.070 | **5.858** (8 berkas) |
| `plugin/` | 13.722 | **16.086** (24 berkas) |
| `tools/` | 10.595 | **14.126** (21 berkas) |
| **Total kode** | ±34.400 | **41.627** |
| `ANodes-1berkas.html` | 26,66 MB | **27,08 MB** (28.398.977 byte) |
| Uji otomatis | 952 | **966** |
| Kamus | 432 entri · 487 tulisan | **2.978 entri · 3.142 tulisan** |
| Halaman | prompt.md: **8** | **9** (ada `#bookmark-halaman`) |

**🔧 YANG DIPERBAIKI:**

| # | Berkas | Perbaikan |
|---|---|---|
| 1 | `prompt.md` **0.3** | **8 halaman → 9 halaman** + `#bookmark-halaman` (K81) masuk daftar |
| 2 | `prompt.md` **0.10** | seluruh angka portofolio diperbarui + **plugin per-baris** (8 plugin, versi masing-masing) |
| 3 | `prompt.md` kepala | tanggal → **1 Nov 2026** · HP **27,08 MB** · uji **966** |
| 4 | `prompt.md` **0.9** | `uji-cepat.js` **896 → 966 uji** · kamus **432 → 2.978 entri** |
| 5 | `prompt.md` struktur & K42 | kamus **2.978 entri · 3.142 tulisan · 492 KB** · HP **27,08 MB** |
| 6 | `rencanakerja.md` **papan B** | **21 baris → 9 baris** · nomor urut **1–9** (dulu banyak “1”) · **3 kasus dobel** disatukan (K69 e · K64 b–e · K28 h) · baris ✅ dipindah ke **D. SELESAI** · **K74 d–f** masuk · **K32** ditandai *“sebagian tergantikan K40”* |
| 7 | `rencanakerja.md` **papan A** | **K51** berjudul `⬜` padahal selesai ⇒ **`✅ SELESAI 21 Sep 2026`** |
| 8 | `rencanakerja.md` **D. SELESAI** | **+13 kasus** (K84 · K73 · K72 · K71 · K70 · K69 b/c/d/f · K58 · K57 · K56c · K56b · K56 · K55c · K51) ⇒ **37 kasus · 0 dobel** |
| 9 | `agents.md` kepala | tanggal → **1 Nov 2026** |
| 10 | `agents.md` **1b** | “BERIKUTNYA = K70” (usang) ⇒ **BERIKUTNYA = K69 e** + daftar selesai terakhir + antrean lengkap |
| 11 | `agents.md` **0a.7** | angka sistem diukur ulang (41.627 baris · 966 uji · kamus 2.978) |
| 12 | `agents.md` **0a.6** | `uji-cepat.js` **934 → 966 uji** |
| 13 | `agents.md` **1b butir 3** | HP **27,94 → 27,08 MB** |
| 14 | `agents.md` ikon plugin | 📌 → **🔖** Bookmark Ayat |

**📊 HASIL:**

| Hal | Sebelum | Sesudah |
|---|---|---|
| Papan B | 21 baris · nomor rusak · 3 dobel | **9 baris · urut 1–9 · 0 dobel** |
| D. SELESAI | 23 kasus | **37 kasus · 0 dobel** |
| Angka usang di prompt.md | 8 tempat | **0** (sisa 2 = catatan sejarah bertanggal, memang benar) |
| Angka usang di agents.md ringkasan | 5 tempat | **0** |
| Kode aplikasi diubah | — | ❌ **TIDAK ADA** (murni dokumen) |

**💾 Backup:** `backups/rapikan-dokumen-20261101/` (`rencanakerja.md` · `prompt.md`).

---

## 1 November 2026 — 🧰 **ALAT BARU: `tools/adobe-mode/` — MATIKAN CREATIVE CLOUD SAAT CODING**

> 💬 Bapak: *“bisa dibuatkan saya tools untuk dijalankan pada saat saya tidak menggunakan creative
> cloud.. atau tidak sedang menggunakan photoshop.. jadi fokus coding VSC dan android studio”*

**🔎 DIUKUR DULU (❌ bukan diduga)** — keadaan komputer 1 Nov 2026:

| Hal | Angka |
|---|---|
| Proses latar Adobe (Photoshop **tidak** dibuka) | **13 proses** |
| RAM dipakai Adobe latar | **555 MB** |
| RAM bebas sistem | **0,8 GB dari 13,9 GB (94 % terpakai)** |
| Layanan | `AdobeUpdateService` (Automatic, Running) |
| Tugas terjadwal Adobe | 5 (`Launch Adobe CCXProcess` · `SoftLandingCreativeManagementTask` · 3 × AdobeGC) |

**⚙️ YANG DIBUAT** — `tools/adobe-mode/` (❌ tanpa mengubah aplikasi ANodes):

| Berkas | Guna |
|---|---|
| `adobe-mode.ps1` | mesin — `-Mode status` / `off` / `on` (+ `-Force`) |
| `Adobe-Mode-OFF.bat` | **mode coding** — matikan proses latar Adobe |
| `Adobe-Mode-ON.bat` | kembalikan Creative Cloud |
| `Adobe-Mode-Cek.bat` | lihat keadaan (tidak mematikan apa pun) |
| `Adobe-Mode-OFF-Admin.bat` · `Adobe-Mode-ON-Admin.bat` | + layanan `AdobeUpdateService` (minta izin Administrator) |
| `Buat-Pintasan-Desktop.bat` | bikin 3 pintasan di Desktop |
| `README.md` | panduan + hasil uji |

**🛡️ PENGAMAN (jangan diubah):**

1. **Aplikasi kerja Adobe diperiksa lebih dulu** — kalau `Photoshop` · `lightroom` · `Illustrator` ·
   `InDesign` · `AfterFX` · `Premiere Pro` · `Acrobat` · `Audition` · `Animate` · `Dreamweaver` ·
   `InCopy` · `Adobe Media Encoder` · `Character Animator` · `Fresco` · `Adobe XD` ·
   `Substance Painter/Designer` **terbuka** ⇒ skrip **BERHENTI** (kecuali `-Force`).
2. **`node.exe` hanya dimatikan kalau jalurnya memuat `Adobe`** — `node` milik ANodes/npm **tidak disentuh**.
3. **Tidak ada yang dihapus** — hanya proses dihentikan; `-Mode on` mengembalikan semuanya.
4. **Tidak mengubah registry / startup permanen.**

**✅ HASIL UJI NYATA (3 putaran: OFF → ON → OFF):**

| Hal | Sebelum | Sesudah OFF |
|---|---|---|
| Proses latar Adobe | **17 proses** | **0 proses** |
| RAM dipakai Adobe | **1.255,8 MB** | **0 MB** |
| RAM bebas sistem | 0,7 GB | **1,9 GB** |
| Proses kembali sendiri (diperiksa 8 detik) | — | ✅ **Tidak** |
| Mode ON | — | ✅ Creative Cloud hidup lagi (ikon baki muncul) |
| Pintasan Desktop | — | ✅ 3 pintasan dibuat & target benar |

**🐞 1 CACAT KETEMU & DIPERBAIKI:** karakter `—` (em dash) di skrip **rusak jadi `â€”`** saat
dijalankan PowerShell 5.1 (berkas UTF-8 tanpa BOM dibaca sebagai ANSI). ⇒ **seluruh skrip dibuat
ASCII murni** (0 karakter non-ASCII) + ditulis UTF-8 tanpa BOM.

**⚠️ BATAS:** layanan `AdobeUpdateService` (9 MB) **tidak bisa dihentikan tanpa Administrator** —
karena itu disediakan versi `-Admin`. Kalau Adobe hidup sendiri lagi, matikan tugas terjadwalnya
(caranya ada di `README.md`).

**Berkas:** `tools/adobe-mode/{adobe-mode.ps1, Adobe-Mode-*.bat, Buat-Pintasan-Desktop.bat, README.md}`.

---

## 30 Oktober 2026 — 🖊 **K84 SELESAI: TAUTAN AYAT DI DALAM TEKS PENGUAT**

> 💬 Bapak: *“ada lagi mesti di revisi plugin penguat. ini juga harus di analisa untuk ketemui ayat
> alkitab.. jika ketemu di klik lompat ke alkitab ke ayat / kitab jika klik home kembali ke alkitab
> posisi sebelumnya. arahan ini cukup jelas ?”*

**🔎 DIUKUR DULU (❌ bukan diduga)** — 31.102 ayat penguat diperiksa dengan mesin Alkitab **asli**:

| Hal | Angka |
|---|---|
| Ayat penguat **memuat rujukan ayat** | **8.136 (26,2 %)** |
| Total rujukan ditemukan | **10.399** |
| Rata rujukan/ayat (yang punya) | **1,28** |
| Maks rujukan dalam 1 ayat | **6** |
| Sebaran | 1 → **6.180** · 2 → **1.671** · 3 → **266** · 4 → **17** · 5 → **1** · 6 → **1** |

⇒ **Yang kurang HANYA pintunya** (pola **K56** halaman Sejarah) — ❌ **tanpa mesin baru**.

**📐 TIGA PERMUKAAN dibuka:**

| # | Permukaan | Sebelum | Sesudah |
|---|---|---|---|
| **a** | Halaman 🖊 Pembaca Penguat (K47) | ❌ **0 tautan** | ✅ **21 tautan** |
| **b** | Kotak 🖊 di halaman baca Alkitab (K54) | ❌ **0 tautan** | ✅ **7 tautan** (Mazmur 23) |
| **c** | Kotak 🖊 di catatan (K45 i) | ❌ **0 tautan** | ✅ **2 tautan** |

**✅ HASIL TERUKUR (klik NYATA di Chrome):**

| Hal | Bukti |
|---|---|
| Klik tautan ⇒ Alkitab | ✅ halaman baca terbuka pada ayat tujuan |
| 🏠 dari halaman penguat | ✅ kembali ke **halaman penguat** · gulir **420 → 420** (persis) |
| Klik dari kotak halaman baca | Mazmur 23 → **Mazmur 34** · 🏠 ⇒ **Mazmur 23** |
| Klik dari kotak catatan | ⇒ halaman baca · 🏠 ⇒ **CATATAN** |
| Lepas plugin | hiasan **hilang** · **isi catatan UTUH** · Alkitab **tetap terpasang** |
| Uji | ✅ **22 uji K84 · 0 gagal** (K84-01…K84-22) |
| Penanda versi | penguat **`v5Okt-e` → `v30Okt-k`** · plugin penguat **1.3 → 1.4** |
| HP `ANodes-1berkas.html` | **28.399.057 byte (27,71 MB)** |
| APK WebView | **±40,1 MB** · aset **byte-identik** · build **±24s** |

**🐞 2 CACAT NYATA yang ketemu & diperbaiki:**

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | **`**1,28**/ayat` di dalam komentar blok** — teks `*/` menutup komentar lebih awal | **SyntaxError** ⇒ `ANodesPenguatTampilan` **undefined** ⇒ **seluruh plugin penguat mati** | tulis “**1,28** per ayat” — ⚠️ ❌ jangan pernah menulis `*/` di dalam komentar blok |
| 2 | **Wadah di dalam halaman aplikasi didaftarkan sebagai “halaman asal”** | klik tautan di kotak penguat **Mazmur 23** ⇒ 🏠 membuka **HALAMAN PENGUAT**, bukan Mazmur 23 | `pasangKaitAyatHalaman()` **melewati** pendaftaran bila wadah di dalam `#baca-alkitab`/`#app-utama` · `bukaAyatDariLink()` menerima penanda **`dariDalamBaca`** dari **pemanggil** |

**📦 BERKAS:** `plugin/penguat/tampilan.js` (blok K84) · `plugin/alkitab/tampilan.js`
(`bersihkanKaitHalaman` BARU · penjaga wadah · `dariDalamBaca`) · `css/app.css`
(`#editor .pg-catatan-kotak span.ay-link`) · `plugin/penguat/plugin.js` (1.4) ·
`tools/uji-cepat.js` (**K84-01…K84-22**).

## 30 Oktober 2026 — 📚 **K83 SELESAI TOTAL: KAMUS NAMA (batch 4 + 5 + 6) — 1.154 → 2.978 ENTRI**

> 💬 Bapak: *“selanjutnya butuh berapa lama proses ?”* ⇒ saya **ukur dulu** sisa pekerjaan dari data:
> **2.801 calon** − **762 sudah masuk** = **2.048 sisa** (batch 4 = 825 · batch 5 = 1.205).
> **⏱️ Perkiraan:** batch 4 **±60–75 menit** · batch 4+5 **±2,5–3 jam**.
> ✅ **Bapak memilih `batch4dan5`** dengan **`arti = sama seperti batch 3`**.

| Hal | Sebelum | Sesudah |
|---|---|---|
| `tools/kamus-nama.json` | 762 entri | **2.586 entri** (+754 · +1.050 · +20) |
| Entri kamus gabungan | 1.154 | **2.978** |
| Tulisan siap deteksi | 1.207 | **3.142** |
| Ukuran data | 246,4 KB | **491,5 KB** |
| Plugin kamus | 1.3 · ±246 KB | **1.4 · ±492 KB** |
| Penanda versi | `v30Okt-h` | **`v30Okt-j`** |
| HP `ANodes-1berkas.html` | ±26,81 MB | **28.350.319 byte (27,69 MB)** |
| APK WebView | ±38,2 MB | **±38,3 MB** · SHA-256: lihat `artifacts/APK-INFO.txt` · aset **byte-identik** · build **±24s** |

**🔎 CARA KERJA (arti ❌ bukan tebakan):** `tools/_konteks-nama.js` mengambil **2 ayat nyata** untuk
tiap calon dari `plugin/alkitab/data/alkitab-tb.js` (lewat `vm.createContext`) ⇒ arti ditulis dari
ayat itu. Saringan calon: bentuk kata kerja **`Kau-`/`Ku-`** · akhiran **`-pun`/`-lah`** ·
kata gabung/camelCase · kata ganti & kata umum. Penggabung `tools/_gabung-batch.js` memeriksa
nama dobel · nama di luar daftar calon · arti kosong ⇒ **0 masalah**.

**✅ BUKTI DI CHROME NYATA:** `jumlahIstilah()` **2.978** · `jumlahTulisan()` **3.142** ·
`versi()` **`v30Okt-j`** · plugin **1.4** · **20 nama uji** (Berotai · Sobakh · Yitra · Baal-Salisa ·
Asyhur · Netaim · Mirma · Obil · Hodewa · Sargon · Tiberius · Adria · Haarabim · Kezia ·
Harmagedon · Yemima · Bartimeus · Teofilus · Febe · Nimfa) ⇒ **0 gagal**.
**Uji klik nyata:** catatan “Sobakh berperang melawan Daud. Yitra ayah Amasa. Berotai kota
Hadadezer.” ⇒ **6 tanda** · klik **Sobakh** ⇒ halaman istilah terbuka · keterangan **470 huruf**.

**🐞 4 cacat di uji saya sendiri (❌ bukan kode):** `tandaiSekarang()` tidak ada (yang benar
**`segarkanTanda()`**) · tunggu 900 ms terlalu cepat (penandaan bertahap 400 ms ⇒ pakai **1.600 ms**) ·
salah tulis `Haaarabim` (3× “a”) tertangkap pemeriksa “BUKAN calon” · `Baal-Salisa` terlewat.

**📦 BERKAS:** `tools/kamus-nama.json` · `plugin/kamus/data/kamus.js` · `plugin/kamus/plugin.js` ·
`plugin/kamus/tampilan.js` · `index.html` · `tools/uji-cepat.js` (angka uji disesuaikan) ·
`rencanakerja.md` · `agents.md` (**0a00d9k**).

---

## 30 Oktober 2026 — 📚 **K83: KAMUS NAMA ORANG / TEMPAT / ISTILAH + KATA GANTI (batch 1 + 2 + 3)**

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

### 🔎 Diukur dulu (❌ bukan diduga)

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

### ✅ Yang diubah

| Bagian | Isi |
|---|---|
| Sumber baru | **`tools/kamus-nama.json`** — **762 entri** (40 batch 1 + 173 batch 2 + 549 batch 3) |
| Sumber lama dipindah | `tools/kamus-utama.json` (340) + `tools/kamus-tambahan.json` (69) — dari `backups/` karena `C:\data\bible\` **sudah tidak ada** |
| Alat | `tools/siapkan-data-kamus.js` — `SUMBER_NAMA` + `masukkan(daftarNama, true)` sebagai langkah gabung **terakhir** |
| Hasil | `plugin/kamus/data/kamus.js` — **1.154 entri · 1.207 tulisan · 246,4 KB** |
| Keterangan plugin | `plugin/kamus/plugin.js` — versi **1.2 → 1.3** · angka **605/659 → 1.154/1.207** · ukuran **176 → 246 KB** |
| 🐞 **Cacat K70 diperbaiki** | `plugin/kamus/tampilan.js → bisaTandai(wadah)` & `plugin/alkitab/alkitab.js → aktif(wadah)` — sakelar ON/OFF **catatan** hanya berlaku bila wadahnya `#editor` |
| `bersihkanTanda()` | ➕ `#sj-isi` (halaman Sejarah) |

### 🐞 Cacat #2 (batch 2) — kata ganti huruf kecil ikut ditandai

> Kamus nama menambahkan kata ganti (`Aku` · `Dia` · `Engkau` · `Kamu` · `Ialah` …). Karena
> pengenal kata memakai regex **tanpa beda huruf besar/kecil** (`gi`), bentuk **huruf kecil**
> ikut ditandai — padahal itu kata biasa: *“anak orang ini **ialah** Yoram”* ·
> *“**aku** mengasihi **engkau**”*. Terukur **17 tanda dalam 1 ayat**.

| Aturan | Bukti ukur (seluruh 31.102 ayat) |
|---|---|
| **`WAJIB_BESAR`** = daftar sempit **10 kata ganti** (`aku` · `dia` · `engkau` · `kamu` · `ia` · `akulah` · `dialah` · `engkaulah` · `kamulah` · `ialah`) — hanya ditandai bila **berawalan huruf besar** | tanda **72.875 → 56.154** (−16.721 · **−23 %**) · ayat bertanda **25.287 → 22.551** · maks/ayat **17 → 15** · **0 entri hilang** |

### ✅ Hasil terukur (akhir batch 2)

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
| **APK WebView** | **±38,2 MB** · SHA-256: lihat `artifacts/APK-INFO.txt` · `versionCode 12` / `2.0.0-webview-k83c` · aset **byte-identik** · build **40s** |

### ⚠️ Pelajaran

1. **Sakelar yang berlaku untuk SATU wadah wajib memeriksa wadahnya.** Sakelar K70 dibuat untuk
   **catatan**; membacanya tanpa memeriksa wadah membuat **halaman plugin ikut mati**.
2. **Ukur dulu sebelum memutuskan aturan.** Saringan “bentuk posesif” versi pertama **salah**.
3. **Uji lama bisa gagal palsu karena data bertambah.** K52-03 mencari tanda **pertama** di
   Yos 1:8 — sejak kamus memuat kata ganti, tanda pertama jadi “engkau”. Uji diperbaiki agar
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
8. **`tools/uji-chrome.js` (BARU)** — menjalankan `tools/uji-cepat.js` di Chrome headless nyata.
   Pakai: `node tools/uji-chrome.js --blok K83` atau tanpa `--blok` untuk suite penuh.

---

## 30 Oktober 2026 — 🔀 **K82: DUA JALUR DI BAR PILIHAN AYAT**

> 💬 Bapak: *“bookmark dengan panah di pasted image ... karena tidak menemukan cara bookmark ..
> dugaan belum ada cara book ... jadi di posisi alkitab pada saat klik ayat ada **2 jalur** satu
> copy ke catatan dan ke dua masuk ke pages booking”*

### ✅ Keputusan Bapak

| # | Pertanyaan | Jawaban |
|---|---|---|
| 1 | Setelah `[🔖 Bookmark]` ditekan, mau ke mana? | ✅ **B — langsung PINDAH ke halaman 🔖 Bookmark** |
| 2 | Tombol 📌 di navbar diapakan? | ✅ **A — jadi PINTU ke halaman daftar bookmark** |
| ➕ | Ikon | ✅ **📌 DIGANTI 🔖** (📌 sudah dipakai peta) |

### ✅ Yang diubah

| Bagian | Isi |
|---|---|
| Tombol baru | **`[🔖 Bookmark]`** di bar pilihan ayat — **sebelah** `[📋 Simpan]` ⇒ **dua jalur terlihat bersamaan** |
| Fungsi | `simpanDariPilihan()` — simpan pilihan → kosongkan pilihan → **pindah** ke halaman 🔖 Bookmark |
| **LOMPAT ⇒ terpisah** | `kelompokBerurutan([24,25,26,28])` ⇒ `[[24,25,26],[28]]` = **dua** bookmark |
| Tombol navbar | `🔖` = **pintu** ke halaman bookmark (❌ bukan mode tandai lagi) |
| Ikon | **📌 → 🔖** di seluruh plugin (tombol · tanda ayat · chip · kepala halaman · keterangan) |
| CSS | `.bar-kirim .bk-bookmark` · ≤430px kata “Bookmark” disembunyikan (ikon tetap) |

### ✅ Hasil terukur

| Hal | Bukti |
|---|---|
| Dua jalur | ✅ `["💬 Kalimat","Matius 4:4-6","📋 Simpan","🔖 Bookmark","✕"]` |
| Tekan `[🔖 Bookmark]` | ✅ tersimpan + **langsung pindah** ke halaman bookmark |
| LOMPAT 24 & 26 | ✅ **2 bookmark** (`24-24`, `26-26`) |
| Tombol navbar 🔖 | ✅ membuka halaman · ❌ tidak membuka bar tandai |
| **344 px** | ✅ `lebarBar 344 = lebarIsi 344` — tidak meluber |
| Uji | ✅ **94 uji (K81 64 + K82 30) · 0 gagal** |
| Penanda versi | **`v30Okt-d` → `v30Okt-e`** |
| HP | **27.939.523 byte (27,94 MB)** · SHA-256 `1D96C0F8…7931` |
| **APK WebView** | **39.901.809 byte (38,0 MB)** · SHA-256 `65A5CE54…DB6D` · `versionCode 9` / `2.0.0-webview-k82` · aset **byte-identik** |

### ⚠️ Pelajaran

1. 🔴 **Fitur yang “sudah ada” bisa tetap tidak ditemukan pengguna.** Tombol 📌 sudah ada sejak
   K81, tetapi **ikon saja tanpa tulisan** ⇒ Bapak menyimpulkan fiturnya belum ada. **Dua jalur
   harus TERLIHAT BERSAMAAN di tempat keputusan diambil**, ❌ bukan disembunyikan di navbar.
2. **Ikon bisa bentrok makna** — 📌 dipakai peta ⇒ pakai 🔖 untuk bookmark.
3. **Aturan “lompat ⇒ terpisah” wajib dipertahankan di jalur baru** (`kelompokBerurutan()`).
4. **Ukuran menu tetap** (K71) — di ≤430px kata disembunyikan, bar tetap 1 baris di 344 px.

---

## 30 Oktober 2026 — 🏠 **K81b: TOMBOL HOME BOOKMARK KEMBALI KE ALKITAB**

> 💬 Bapak: *“pages bookmark ayat · 🏠 📌 BOOKMARK AYAT · **Home tidak berfungsi.. tidak kembali
> ke alkitab**”*

### 🔎 Sebab terukur (diperiksa lewat CDP, ❌ bukan diduga)

`bukaHalaman()` menyembunyikan **semua** halaman lain **tanpa mencatat halaman mana yang sedang
tampil**. Karena itu `tutupHalaman()` **selalu** membuka `#app-utama` (catatan) — terukur
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
| HP | `ANodes-1berkas.html` **27.918.652 byte (27,92 MB)** · SHA-256 `A3EB41A7…16DE` |
| **APK WebView** | **39.886.105 byte (38,0 MB)** · SHA-256 `C6FE1AB8…8F9F` · `versionCode 8` / `2.0.0-webview-k81b` · aset **byte-identik** |

### ⚠️ Pelajaran

1. 🔴 **Halaman yang “menimpa” WAJIB mencatat SIAPA yang ditimpanya.** Tanpa itu tombol kembali
   **selalu** mendarat di tempat yang salah. Pola ini sudah ada (`daftarPemulihHalaman` K56) —
   pakai yang ada, atau catat sendiri seperti K81b.
2. **Judul tombol kembali harus mengikuti asal** — pengguna perlu tahu akan dibawa ke mana.
3. **Uji harus menguji LEBIH DARI SATU jalur masuk** — kalau hanya diuji dari catatan, cacat ini
   **tidak akan pernah ketemu**.

---

## 30 Oktober 2026 — 📌 **K81: PLUGIN BOOKMARK AYAT**

> 💬 Bapak: *“perlu plugin tambahan .. bookmark ayat alkitab.. jika di aktifkan bookmark .. di
> alkitab tambahan tombol bookmark ketika user baca dan di klik ayat yg mau dibookmark bisa dari
> ayat - ayat bisa dari pasal .. ayat ... sampai dengan pasal .. ayat tergantung user klik ayat mana
> saja.. tidak bisa lompat jika mau dari .. sampai ..... jika lompat terpisah bookmarknya ...
> setelah bookmark hasilnya ada pages di bookmark daftar ayat2 yg dibookmark user user bisa
> edit/hapus .. user klik edit > sistem ke alkitab dan diposisi ayat yg mau diedit .. klik ayat lain
> tambah tidak bisa lompat harus satu seleksi.. jika user klik kembali ke ayat yg sudah diklik
> artinya hapus jadi edit ini juga bisa berfungsi hapus dengan cara klik ulang ayat yg sudah
> diklik.. jadi selama edit area edit harus ada stabilo sistem sampai selesai prosesnya”*

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

### ✅ Yang ditambahkan

| Bagian | Isi |
|---|---|
| Plugin BARU | `plugin/bookmark/` — `bookmark.js` (mesin) · `plugin.js` (keterangan) · `tampilan.js` (tampilan) |
| Tombol 📌 | di navbar halaman baca Alkitab (ujung baris 1, setelah 🖊) — lewat kontrak `tombol[]` |
| Seleksi berurutan | klik angka ayat ⇒ pilihan `[24,25,26]` · klik ulang ⇒ lepas |
| **LOMPAT ⇒ 2 bookmark** | klik 24 lalu 26 ⇒ bookmark “24” **tersimpan sendiri** (terpisah) |
| Tanda 📌 | ayat yang sudah dibookmark diberi tanda di halaman baca |
| Halaman 📌 Bookmark | halaman ke-**9** (`#bookmark-halaman`) — daftar + catatan 1 baris + Copy/Edit/Hapus |
| Mode edit | pindah ke Alkitab + ayat **disorot + stabilo** · klik = tambah · klik ulang = hapus |
| Copy ke catatan | jalur **K20** (`ANodesEditor.terimaPaket`) ⇒ paket siap tempel di catatan |
| Sinkron | `KUNCI_SINKRON` **4 → 5 kunci** (+`anodes-bookmark-v1`) |

### 🐞 4 cacat nyata yang ketemu & diperbaiki

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | `hias()` tidak memeriksa apakah plugin masih terpasang | tanda 📌 **tetap digambar sesudah plugin DILEPAS** | `pluginAktif()` diperiksa di dalam `hias()` |
| 2 | `bersihkan()` tidak membuang `dataset.siapBookmark` | plugin dipasang ulang ⇒ **pengait klik tidak pernah dipasang lagi** | `delete isi.dataset.siapBookmark` |
| 3 | `mulaiEdit()` tidak menyembunyikan halaman bookmark | halaman bookmark **tetap terlihat** di bawah halaman baca | `hal.hidden = true` sebelum `bukaRentang()` |
| 4 | Tanda 📌 `inline`/`inline-block` | tanda **jatuh ke baris baru** kalau baris teks penuh (terukur: teks **373 px** dari **433 px**) | `position: absolute` + `.ayat-baca { position: relative }` |

### 🐞 3 cacat BERKAS UJI yang ketemu & diperbaiki

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 5 | `ok` & `tunggu73` dideklarasikan **DI DALAM `try` blok K73/K79** | tidak terlihat di blok K80/K81 ⇒ blok itu **langsung error** (`ok is not defined`) dan **SELURUH ujinya HILANG** dari laporan (terukur: **“K81: 1 uji”** padahal ada 56) | `ok` & penunggu dideklarasikan **ulang di tiap blok** |
| 6 | Penyaring `__BLOK` memakai `x.indexOf(b) === 0` | label **SELALU** diawali `✅ `/`❌ ` ⇒ **tidak pernah cocok** ⇒ **“Total: 0 uji”** | tanda itu **dibuang dulu** sebelum dicocokkan |
| 7 | Blok K81 **tidak memasang plugin bookmark** | tombol 📌 & tanda ayat **tidak pernah digambar** ⇒ **6 uji gagal palsu** | pasang plugin dulu |

### 📊 Hasil

| Hal | Angka |
|---|---|
| Uji | ✅ **85 uji (K80 29 + K81 56) · 0 gagal** di `index.html` **dan** `ANodes-1berkas.html` |
| Penanda versi | **`v30Okt-b` → `v30Okt-c`** |
| HP | **27.902.376 byte (27,90 MB)** |
| **APK WebView** | **39.863.462 byte (38,0 MB)** · SHA-256 `F0BCA813…B9A5F` · `versionCode 7` / `2.0.0-webview-k81` · aset **byte-identik** (SHA-256 `A009BFB3…7830D`) |
| Berkas diubah | `plugin/bookmark/{plugin,bookmark,tampilan}.js` (BARU) · `index.html` · `css/app.css` · `js/sinkron.js` · `tools/uji-cepat.js` |
| Backup | `backups/k81-bookmark-ayat-20261030/` |

## 30 Oktober 2026 — 🔵 **K80: TOMBOL `[Full]` DI PRATINJAU AYAT TERKAIT**

> 💬 Bapak: *“Bil 6:24-26  ✓ pilih  Full  ✕ · tombol full ini untuk lompat ke alkitab ke bilangan 6
> bisa baca keseluruhan · tapi posisikan pada ayat 24-26 di buat stabilo sistem blinking beberapa
> detik supaya user tau posisi ayat · dan klik home kembali pada bacaan sebelumnya”*

### ✅ Yang ditambahkan

| Bagian | Isi |
|---|---|
| Tombol `[Full]` | di kepala pratinjau 🌿 Ayat Terkait — `Bil 6:24-26  [✓ pilih] [Full] [✕]` |
| `bukaRentang()` | lompat ke halaman baca Alkitab pada **rentang** ayat (mis. Bilangan 6:24-26) |
| Kedip 5 detik | ayat 24-26 disorot + **berkedip** (`0.5s × 10`) ⇒ user tahu posisinya |
| Sorot tetap | sesudah kedip selesai, sorot **tetap terlihat** selama membaca |
| 🏠 bacaan sebelumnya | tekan 🏠 ⇒ kembali ke **2 Petrus 1** (bacaan sebelum `[Full]`); tekan 🏠 lagi ⇒ catatan |
| “kurangi gerak” | `prefers-reduced-motion` ⇒ **tanpa kedip**, langsung sorot tetap |

### 🐞 Cacat nyata yang ketemu & diperbaiki

| # | Cacat | Akibat |
|---|---|---|
| 1 | Pendaftaran penghias bergantung pada **data siap** | halaman baca bisa tampil **tanpa tombol kaitan** — **flaky 4 dari 5 kali** |
| 2 | `kabariPendengar()` memanggil `ketikaSiap` **sebelum** `padaSiap` | penghias belum terdaftar saat penunggu `ketikaSiap` menggambar pasal |
| 3 | Penyaring `__BLOK` letaknya **sebelum** blok K77/K80 | `__BLOK=['K80']` ⇒ **“K80: 0 uji”** |
| 4 | Uji mengukur warna **saat animasi berjalan** | `getComputedStyle` = warna di tengah keyframe ⇒ **gagal palsu** |

### 📊 Hasil

| Hal | Angka |
|---|---|
| Uji | **29 uji K80 · 0 gagal** — **6×** di `index.html` + **3×** di `ANodes-1berkas.html` |
| Penanda versi | **`v30Okt-a` → `v30Okt-b`** |
| HP | **27.793.929 byte (27,79 MB)** |
| **APK WebView** | **30.138.918 byte (28,7 MB)** · SHA-256 `26E4B451…34C34` · `versionCode 6` / `2.0.0-webview-k80` |
| **Aset di APK** | **byte-identik** dengan sumber · SHA-256 `7B7F747E…ABE72` ✅ |
| Build APK | **1m 27s** |
| ✅ Konfirmasi Bapak | *“sdh dites sudah oke ...”* |
| Berkas diubah | `plugin/alkitab/tampilan.js` · `plugin/ayat-terkait/tampilan.js` · `plugin/ayat-terkait/terkait.js` · `css/app.css` · `index.html` · `tools/uji-cepat.js` · `android-native/app/build.gradle.kts` · `artifacts/APK-INFO.txt` |

---

## 30 Oktober 2026 — ☁️ **K77: SINKRON PC ⇄ HP (Cloudflare Worker + Turso)**

> 💬 Bapak: *“PC dan HP data sync (sama) .. kerja dimana sama”* · *“token di mana saja jg ok..
> ini bukan data rahasia.. buat baca alkitab dan catat saja”* · *“cloudflare sudah punya”* ·
> arah sinkron = **keduanya** (otomatis + tombol).

### 🔎 Diukur dulu (bukan dugaan)

| Hal | Hasil |
|---|---|
| `catatan[].waktu` | ✅ **SUDAH ADA** — diisi `Date.now()` tiap simpan ⇒ ❌ tidak perlu ubah struktur data |
| Kunci `localStorage` di kode aktif | **36** — dipilah: **4** perlu disinkronkan, sisanya tidak |
| Ukuran 4 kunci (data uji) | **0,9 KB** ⇒ sangat ringan |
| Data Alkitab 23 MB | ❌ **tidak** disinkronkan (sudah ada di tiap perangkat) |

### 🔧 Yang dibuat

| Berkas | Isi |
|---|---|
| **`worker/worker.js`** (BARU) | Perantara Cloudflare Worker — **token Turso disimpan DI SINI**, ❌ bukan di berkas HP. Jalur `GET /ambil` · `POST /simpan` · CORS untuk `file://` · tabel dibuat otomatis |
| **`worker/README.md`** (BARU) | Panduan deploy 7 langkah + tabel pesan galat |
| **`js/sinkron.js`** (BARU) | Klien: `sekarang()` · `ambil()` · `kirim()` · `uji()` · `tandaiBerubah()` · `gabungCatatan()` · `pesanRamah()` |
| `js/editor.js` | `simpan()` memanggil `tandaiBerubah()` · `bukaSinkron()` / `tutupSinkron()` · `toast` diekspor |
| `index.html` | Tombol **☁️ Sinkron…** di menu File · modal `#modal-sinkron` · `<script src="js/sinkron.js">` |
| `css/app.css` | Blok **K77** — modal sinkron (kolom isian, status, tombol) |
| `tools/uji-cepat.js` | Blok **K77-01…K77-30** + 2 kunci baru di `KUNCI_AMAN` |

### ⚙️ Cara kerja

```
   PC (index.html)                    HP (APK WebView)
        │                                    │
        └──── HTTPS ──► Cloudflare Worker ◄──┘
                        (token Turso di sini)
                             │
                        Turso (libsql)
```

| Hal | Perilaku |
|---|---|
| **Kunci disinkronkan** | `anodes-catatan-v1` · `anodes-setting-v1` · `anodes-kamus-pribadi` · `anodes-rantai-v1` |
| **Bentrok** | **per catatan** — yang `waktu`-nya lebih baru menang (❌ bukan seluruh berkas) |
| **Anti-dobel** | dicocokkan per **`id`** |
| **Otomatis** | kirim tertunda **3 s** tiap simpan · ambil tiap **60 s** · ambil sekali saat aplikasi dibuka |
| **Manual** | tombol **☁️ Sinkron sekarang** |
| **Offline** | aplikasi tetap jalan normal; sinkron menyusul |

### ✅ Hasil uji

| Kelompok | Jumlah | Gagal |
|---|---|---|
| Logika gabung (Node) | **17** | **0** |
| Worker (Turso tiruan) | **13** | **0** |
| Blok K77 (browser) | **30** | **0** |
| Berkas HP (`ANodes-1berkas.html`) | **14** | **0** |

**Bukti alur nyata (klik nyata di Chrome):** kirim **4 kunci** ✅ · catatan dari “HP” **masuk** ✅ ·
**bentrok** ⇒ **Versi HP menang** & **tidak dobel** ✅ · **otomatis** saat simpan ✅ ·
**offline** ⇒ catatan utuh & editor tetap bisa diketik ✅ · kunci salah / alamat ngawur ⇒
**pesan bahasa Indonesia** ✅.

### 🐞 Cacat yang ketemu saat menguji (jangan diulang)

| # | Cacat | Perbaikan |
|---|---|---|
| 1 | Modal dibuka dengan `modal.hidden = false` ⇒ **tidak tampil** | modal ANodes memakai kelas **`.buka`** (`.modal-bg { display:none }` + `.modal-bg.buka { display:flex }`) |
| 2 | Pesan galat **“Failed to fetch”** (bahasa Inggris, tidak jelas) | `pesanRamah()` — 6 pola galat diterjemahkan (offline · kunci salah · token ditolak · alamat salah …) |

### 📦 Hasil akhir

| Hal | Angka |
|---|---|
| `ANodes-1berkas.html` | **27.758.493 byte (27,76 MB)** |
| Penanda versi | **`v28Okt-a` → `v30Okt-a`** |
| Backup | `backups/k77-sinkron-turso-20261030/` |

### ✅✅ SUDAH DIPASANG & DIUJI NYATA (30 Okt 2026)

| Hal | Nilai |
|---|---|
| Database Turso | **`anodes`** · Singapore · `libsql://anodes-suwandhi.aws-ap-southeast-1.turso.io` |
| Worker | **`https://anodes-sync.suwandhih.workers.dev`** |
| Variabel Worker | `TURSO_URL` · `TURSO_TOKEN` · `KUNCI_APP` — **ketiganya Secret** ✅ |
| Kunci aplikasi | **`anodes-suwandhi-2026`** |
| Tabel | `sinkron` — **dibuat otomatis** saat pertama dipakai |

**Bukti uji nyata:**

| Uji | Hasil |
|---|---|
| Worker tanpa kunci | **401** `{"ok":false,"pesan":"Kunci aplikasi salah"}` ✅ |
| Worker dengan kunci | **200** `{"ok":true,"data":[]}` ✅ |
| Tulis 1 kunci | `{"ok":true,"ditulis":1}` ✅ |
| Baca kembali | data utuh ✅ |
| Tabel di Turso | `anodes-catatan-v1 · waktu 1000 · 139 huruf` ✅ |
| ANodes ⇄ Worker | *"Sambungan berhasil · 1 kunci di server"* ✅ |
| Sinkron penuh | *"Selesai · 4 kunci terkirim · 1 catatan masuk"* ✅ |
| Token bocor ke berkas HP? | ❌ **TIDAK** (sudah diperiksa) ✅ |

**Yang perlu dilakukan pengguna (sekali saja):** **File ▼ → ☁️ Sinkron…** → isi
**Alamat Worker** + **Kunci aplikasi** di atas → **Uji sambungan** → selesai.

⚠️ **`worker/_kredensial.json`** memuat token — **jangan dikirim ke siapa pun**.

---

## 28 Oktober 2026 — 📱 **K79: MENU 3 TINGKAT + KEPALA TIDAK LAGI DI BAWAH KAMERA**

> 💬 Bapak: *“hasil apk (webview) di HP z fold 3 posisi sangat diatas sejajar dengan kamera ..
> sehingga sulit di touchscreen .. silahkan di design 3 tinggat atau 4.. supaya terlihat dan
> mudah di klik .. kalau sekarang terlalu kecil dan tidak ingat ini apa.. karena untuk hemat
> space.. di hp kurang cocok.. di PC bisa diterima”*

### 🔎 Sebab terbukti (diukur, bukan dugaan)

| Hal | Sebelum | Standar |
|---|---|---|
| `env(safe-area-inset-top)` di CSS | ❌ **TIDAK ADA** (0 hasil di `css/`, `index.html`, `js/`) | wajib untuk edge-to-edge |
| `viewport-fit=cover` di `<meta viewport>` | ❌ **TIDAK ADA** | wajib agar safe-area terbaca |
| Tinggi tombol kepala | **31–33 px** | **≥44 px** |
| Lebar tombol ikon `▦` `⚙` `🧩` | **26–38 px** | **≥44 px** |
| Label tombol | **ikon saja** | perlu teks |

**Sebab kepala di bawah kamera:** `targetSdk = 37` (Android 15+) memaksa WebView tampil
**edge-to-edge** ⇒ WebView mengisi seluruh layar termasuk area kamera punch-hole. CSS tidak
punya `safe-area` ⇒ kepala duduk di `top: 0` = tepat di bawah kamera. Di PC tidak terlihat
karena tidak ada lubang layar.

### 🔧 Perbaikan

| Bagian | Pelaksanaan |
|---|---|
| **Ruang aman** | `viewport-fit=cover` + `js/layar.js` (BARU) mengisi `--sa-top`/`--sa-bottom` · `.app` memakai keduanya sebagai padding · jembatan Android `ANodesAndroid.insetAtas()/insetBawah()` (WindowInsets ÷ density) sebagai cadangan kalau `env()` tidak dilaporkan WebView |
| **Menu 3 tingkat** | TINGKAT 1 kepala (merek + status + 6 tombol **44 px berlabel**) · TINGKAT 2 bar info · TINGKAT 3 toolbar tulis (**2 baris · 40 px**) |
| **Label tombol** | `<span class="ik">` + `<span class="lbl">` — ikon di atas, tulisan di bawah (Tulis · Setelan · Plugin · File · Cari · Doc) |
| **Hanya layar sentuh** | seluruh aturan baru di dalam `@media (pointer: coarse)` ⇒ **PC TIDAK berubah sama sekali** |
| **Tanpa “gang”** | gap 2 px · padding 3–4 px (permintaan Bapak: *“jarak kolom jangan pakai gang”*) |

### ✅ Hasil terukur

| Layar | Kepala | Toolbar | Total menu | Ruang tulis | Tombol terkecil |
|---|---|---|---|---|---|
| **Z Fold 3 (tutup) 344×938** | 61 px | 89 px (2 baris) | **187 px** | **677 px** | **44 px** |
| HP kecil 360×800 | 61 px | 89 px (2 baris) | 187 px | 539 px | 44 px |
| Z Fold 3 (buka) 756×944 | 73 px | 89 px (2 baris) | 199 px | 671 px | 44 px |
| **PC 1280×800** | **49 px** (sama) | **38 px 1 baris** (sama) | **127 px** (sama) | — | 31 px (sama) |

| Hal | Bukti |
|---|---|
| Kepala tidak meluber | **344 ≥ 344** · 360 ≥ 360 · 756 ≥ 756 |
| Toolbar tidak meluber | **344 ≥ 344** (2 baris) |
| Ruang aman bekerja | simulasi kamera 34 px ⇒ kepala `top: 34px` (dulu `0`) · `.app` 640 ≤ 640 |
| K71 dijaga | huruf 24 px ⇒ kepala **61 → 61 px** · huruf tombol **10 → 10 px** · isi catatan **20 → 24 px** |
| Uji | **19 uji K79 · 0 gagal** |
| Penanda versi | **`v5Okt-i` → `v28Okt-a`** |

### 🐞 CACAT KEDUA YANG IKUT KETEMU — `build-apk.bat` TIDAK MENYALIN HTML

> **Ini cacat paling berbahaya** — sama jenisnya dengan K78 (APK tidak sama dengan PC).

`android-native/build-apk.bat` **tidak pernah** menyalin `ANodes-1berkas.html` ke
`app/src/main/assets/anodes.html`. Akibatnya:

| Hal | Terukur |
|---|---|
| `assets/anodes.html` sebelum | **27.698.349 byte** (27 Okt 22:32) |
| `ANodes-1berkas.html` sesudah K79 | **27.737.215 byte** |
| APK hasil build pertama | aset **USANG** walau `BUILD SUCCESSFUL` |

⇒ **Perbaikan:** skrip kini **menyalin lebih dulu** + **berhenti dengan pesan jelas** kalau
berkas sumber tidak ada. Sesudah build ulang: aset **27.737.215 byte** = sumber ✅
(SHA-256 aset = SHA-256 sumber).

### ✅ Hasil akhir

| Hal | Angka |
|---|---|
| APK | `artifacts/ANodes-webview-debug.apk` · **39.737.327 byte (39,74 MB)** |
| SHA-256 | `18F989AEEACAB007F73BB82D1D282E08C37BBDA3C5D61FC8CC87B5B73E637E3F` |
| Aset di APK | `assets/anodes.html` **27.737.215 byte** = `ANodes-1berkas.html` ✅ |
| `ANodes-1berkas.html` | **27.737.215 byte (27,73 MB)** |
| Build | **1m 17s** (pertama) · **13s** (ulang) |

### ✅ DIKONFIRMASI BAPAK (28 Okt 2026): *“ok jadi lebih baik.. thx”*

APK K79 sudah dipasang & diuji di **Samsung Z Fold 3** — kepala **tidak lagi menempel di kamera**,
tombol **besar & bertulisan**, dan tampilan terasa **lebih baik**. Kasus **K79 SELESAI**.

### ⚠️ Pelajaran

1. **`targetSdk` tinggi = edge-to-edge otomatis.** Tanpa `viewport-fit=cover` + `env(safe-area-inset-*)`,
   kepala aplikasi akan menempel di kamera pada HP ber-lubang layar.
2. **`env()` tidak selalu dilaporkan WebView** ⇒ perlu **cadangan** dari sisi Android (WindowInsets).
3. **Tombol 31 px tidak layak disentuh.** Standar 44–48 px; label teks wajib supaya tidak lupa fungsi.
4. **12 tombol toolbar tidak muat 1 baris pada 344 px** kalau tombolnya 44 px (butuh 528 px) ⇒
   **membungkus 2 baris** lebih baik daripada mengecilkan tombol.
5. **`@media (pointer: coarse)`** adalah cara tepat membedakan HP ⇄ PC tanpa merusak tampilan PC.
6. 🔴 **`BUILD SUCCESSFUL` ≠ APK berisi kode terbaru.** Skrip build **WAJIB** menyalin aset
   lebih dulu. Selalu buktikan dengan **membandingkan ukuran/hash aset di dalam APK** dengan
   berkas sumbernya — ❌ jangan percaya status build.
7. **Judul catatan bisa terpotong** kalau bar info hanya 1 baris dan berebut ruang dengan
   kategori + jumlah kata ⇒ di layar sentuh bar info dibuat **2 baris** (judul selebar baris).

---

## 27 Oktober 2026 — 📦 **K78: DUA APK BERNama PAKET SAMA DIPISAHKAN**

> 💬 Bapak: *“setelah saya cek hasil apk tidak sama dengan versi file:///C:/data/ANodes/index.html
> (PC) tidak sama dengan versi webview .. coba km analisa terlebih dahulu. pelajari satu-satu fitur
> jangan kerjakan sekaligus .. fitur catat dulu lalu plugin alkitab”*

### 🔎 Sebab terbukti (bukan dugaan)

Ada **DUA** APK di `artifacts/` dengan **nama paket SAMA** (`com.anodes.app`) dan **label SAMA**
(`ANodes`), padahal isinya **dua aplikasi berbeda**:

| Berkas | Ukuran | versionCode | versionName | Launcher | Isi |
|---|---|---|---|---|---|
| `ANodes-debug.apk` | 20.537.217 | 3 | `1.2.0-native-s3` | `MainActivity` | **native Kotlin K74** — tanpa folder `assets/`, 11 `classes*.dex` |
| `ANodes-webview-debug.apk` | 39.706.208 | 4 | `2.0.0-webview` | `WebAppActivity` | **WebView** — `assets/anodes.html` |

Dibuktikan dengan `aapt2 dump badging` **dan** dipasang sungguhan di emulator: UI native
**sama sekali berbeda** (kepala `ANodes [Tahap 5] ●`, toolbar tombol bulat terpotong,
isi `Tulis catatan di sini…`, kaki `SQLite lokal · offline` / `ANodes · Native · Sesi 3`).

### 📊 Bukti APK WebView = PC

Diukur lewat **Chrome DevTools Protocol** (`adb forward` → WebView DevTools) pada emulator
Android 34, dibandingkan dengan PC lewat Playwright:

| Hal | Hasil |
|---|---|
| Nilai identik | **166 dari 171** |
| 5 yang berbeda | **hanya lingkungan** — `innerW` 412 vs 330 · `innerH` 839 vs 671 · `dpr` 2,625 vs 1,25 · `docW` · `docH` |
| Sebab 5 perbedaan | `@media (max-width:400px)` di `css/app.css:129` (menyembunyikan `.merk-teks` + `.panah`, padding kepala `7px 8px` vs `8px 10px`) |
| Aset APK | SHA-256 `EAB0BA49…D5F3` (27.698.349 byte) = `ANodes-1berkas.html` = entri zip `assets/anodes.html` ⇒ **tidak usang** |

**Perilaku juga sama (APK ⇄ PC):** mengetik ✅ · toolbar B ✅ · File menu ✅ · panel Open 273,8px ✅ ·
simpan ✅ · 🔗 OFF→ON ✅ · 🖊 **17 kotak ⇄ 0** ✅ · 📍 **Sungai Yordan** + mini-peta ✅ ·
ganti pasal ⇒ Yosua 5 · 15 ayat · peta bersih ✅ · cari “yordan” ⇒ **178 hasil** ✅ · 🏠 kembali ✅.

### 🔧 Perbaikan

| Bagian | Sebelum | Sesudah |
|---|---|---|
| `applicationId` | `com.anodes.app` | **`com.anodes.app.webview`** |
| Label aplikasi | `ANodes` | **`ANodes WebView`** |
| Versi | `versionCode 4 / 2.0.0-webview` | **`versionCode 5 / 2.0.0-webview-k78`** |
| `build-apk.bat` | menyalin ke `ANodes-debug.apk` (nama milik APK native) | **`ANodes-webview-debug.apk`** |
| APK native lama | `ANodes-debug.apk` | **`ANodes-NATIVE-K74-lama.apk`** |

### ✅ Hasil

| Hal | Angka |
|---|---|
| APK | `artifacts/ANodes-webview-debug.apk` · **39.721.170 byte (37,9 MB)** |
| SHA-256 | `757028AC752BCF90656BC2C11863CAEA75937302350528F19309630A4456F40D` |
| Aset di dalam APK | `assets/anodes.html` **27.698.349 byte** = `ANodes-1berkas.html` ✅ |
| Uji JVM | **38 lulus** |
| Build | **1m 45s** |

### ⚠️ Pelajaran

1. **Dua APK dengan nama paket sama = sumber kebingungan paling mahal** — di HP keduanya tampil “ANodes”.
2. **Nama berkas hasil build harus menyebut jenisnya** (`-webview-`), ❌ jangan nama umum.
3. **`versionCode` native (3) < webview (4)** ⇒ memasang native **di atas** webview **GAGAL**
   (`INSTALL_FAILED_VERSION_DOWNGRADE`), sebaliknya berhasil.

---

## 26 Oktober 2026 — 📱 **K76: APK WEBVIEW — ANodes SAMA PERSIS DENGAN index.html**

> 💬 Bapak: *“saya mau aplikasi ANodes ini di buat ke aplikasi APK.. dibuat persis sama dengan
> index.html hanya database yg digunakan index.html indexedDB di APK menggunakan database server
> https://app.turso.tech/suwandhi sudah di register · 1. apk buka versi webview · 2. apk sudah
> dibuat baru selesai bagian catat plugin masih proses .. saya mau dilanjut hingga selesai”*

### ✅ Keputusan Bapak (26 Okt 2026)

| Pertanyaan | Jawaban |
|---|---|
| Bentuk APK | **WebView** — bungkus `ANodes-1berkas.html` (persis sama, semua plugin langsung jalan) |
| Database | **IndexedDB saja** — *“apakah aman menggunakan database indexedDB saja?”* ⇒ **cukup & andal** untuk satu perangkat |
| Turso | **DITUNDA** — *“apa perlu tidak? apakah andal indexedDB sudah cukup?”* ⇒ belum perlu; hanya untuk sinkron PC↔HP |
| Perantara | **Cloudflare Worker** (bila Turso nanti dikerjakan) — token tidak ditanam di APK |
| Urutan | **APK bisa dipakai dulu**, sinkron Turso menyusul |

### ✅ Yang selesai

| Bagian | Hasil |
|---|---|
| `WebAppActivity.kt` (BARU) | WebView memuat `file:///android_asset/anodes.html` · JS + DOM storage + IndexedDB aktif · `textZoom 100` (skala huruf ANodes sendiri tidak digandakan) |
| Aset | `app/src/main/assets/anodes.html` = **27.666.324 byte** (salinan `ANodes-1berkas.html`) |
| Jembatan Android | `ANodesAndroid.simpanBerkas()` (ekspor → folder **Download**) · `ANodesAndroid.cetak()` (`window.print` → pencetakan Android) · `ANodesAndroid.versi()` |
| Impor berkas | `onShowFileChooser` → pemilih berkas Android (Downloads/Documents) |
| Tombol Back | `ANodesAndroidKembali()` — tutup gudang plugin → modal → halaman plugin → baru keluar aplikasi |
| Launcher | `WebAppActivity` jadi pembuka; `MainActivity` (native K74) tetap ada, `exported=false` |
| Versi | `versionCode 4` · `versionName 2.0.0-webview` |
| APK | `artifacts/ANodes-webview-debug.apk` · **±39,7 MB** · SHA-256 `artifacts/APK-INFO.txt` |

### ✅ Bukti terukur (emulator `uji-anodes-s2` Android 34, WebView DevTools)

| Yang diuji | Hasil |
|---|---|
| Aplikasi terbuka | ✅ tampilan **sama persis** dengan `index.html` (kepala hitam, toolbar, bar info) |
| IndexedDB di dalam APK | ✅ `anodes-plugin-db` → kunci `alkitab-tb` · **66 kitab** · Yohanes 3:16 terbaca |
| localStorage | ✅ 5 kunci · catatan tersimpan |
| 6 plugin dipasang | ✅ Alkitab · Ayat Terkait · Kamus (392 entri) · Penguat (66 kitab) · Sejarah · Peta |
| Penandaan catatan | ✅ 2 tautan ayat · 1 istilah · panel **📋 Ayat & Istilah — 2 ayat · 1 istilah · 2 tempat** |
| Halaman baca | ✅ Yohanes 3 · 36 ayat · **36 tombol 🖊** · **36 tombol 🔗** · **29 istilah** · **2 tombol 📍** · ayat 16 tersorot |
| 🖊 penguat | ✅ kotak krem terbuka · istilah di dalamnya bisa diklik |
| 📍 mini-peta | ✅ citra relief NASA · panggung **343×171** · “Yehuda / Yudea · wilayah” |
| Halaman Peta | ✅ citra NASA · cari “yordan” ⇒ **〰️ Sungai Yordan** · `(1/191)` |
| Halaman Kamus/Sejarah/Penguat/Doc | ✅ semua terbuka · Sejarah **16.142 huruf** · Penguat **31 ayat** · Doc **6 berkas** |
| Ekspor `.md` | ✅ tersimpan di `/sdcard/Download/anodes-ekspor-*.md` · isi benar |
| Impor `.md` | ✅ pemilih berkas Android → konfirmasi → isi catatan berganti |
| Tombol Back | ✅ menutup halaman baca, **tidak** keluar aplikasi |
| Data bertahan setelah app ditutup | ✅ catatan + plugin + IndexedDB utuh |

### 🐞 Cacat nyata yang ketemu & diperbaiki

| # | Cacat | Perbaikan |
|---|---|---|
| 1 | **Tombol Back langsung keluar aplikasi** padahal halaman baca masih terbuka | `ANodesAndroidKembali()` berlapis: gudang plugin → modal → halaman plugin → keluar |
| 2 | **Impor `.md` kecil menampilkan `# Judul` apa adanya** — `keHtmlImporSederhana()` hanya menguji baris **pertama** satu blok | diolah **baris demi baris**; diuji 6 kasus (judul+kalimat satu blok · judul sendiri · tanpa judul · judul+2 baris · daftar titik · daftar nomor) |
| 3 | APK **75,9 MB** karena `noCompress html` | kompresi dikembalikan ⇒ **37,9 MB** |
| 4 | `BuildConfig` tidak dikenali | `buildFeatures { buildConfig = true }` |

### ⚠️ Batas K76

- **Turso/Worker belum ada** — dicatat di papan order, bukan dibuang.
- **Sinkron PC↔HP belum ada** — pengaman sementara: **Ekspor/Impor** (sudah berfungsi di APK).
- APK masih **debug** (belum release/Play Store).
- `MainActivity` native K74 masih ada di proyek tetapi tidak dibuka dari launcher.

💾 Backup sebelum perubahan: `backups/k76-webview-20261026-213313/`.

---

## 26 Oktober 2026 — ⏸️ **K75 CHECKPOINT SEBELUM ISTIRAHAT — BELUM SELESAI**

Implementasi awal K75 menambahkan format sebelum/sesudah seleksi, daftar berlanjut,
tabel native 3×3, dokumen versi 2 dengan kompatibilitas teks lama/versi 1, dan pencarian plaintext.
**38 uji JVM lulus**, tetapi instrumentasi terakhir hanya **3 dari 11 skenario lulus** (shell 170,
4m6s). Delapan skenario masih gagal; **belum ada APK K75**, dan `artifacts/` tetap APK Sesi 3.

Debugging dihentikan sesuai waktu istirahat Bapak. Kode dan laporan terakhir disimpan di
`backups/k75-checkpoint-20261026/`. Berikutnya isolasi payload IME/recomposition per kasus;
jangan membuat `EditorState` baru per recomposition karena pending style, seleksi dan undo hilang.
Belum boleh menaikkan versi, mengganti APK, atau menandai K75 selesai.

---

## 26 Oktober 2026 — 🔨 **K75 DICATAT: HASIL UJI APK SESI 3 + ATURAN BACKGROUND**

> 💬 Bapak: *“hasil tahap 3 sudah saya tes.. ada beberapa hal belum bekerja seharusnya”*.

### Temuan yang dicatat

1. Bullet/nomor/ikon hanya memberi tanda pada baris pertama; Enter tidak meneruskan daftar.
2. H1/H2 belum bekerja bila dipilih sebelum mengetik; perlu juga jalur tulis → seleksi → atur ukuran.
3. Bold/italic belum bekerja pada jalur yang dicoba.
4. Tabel 3×3 masih string Markdown `| Kolom… | --- |`, bukan kisi native; bentuk pengganti perlu diputuskan.
5. Stabilo sudah berfungsi dan harus dijaga dengan uji regresi.
6. Warna bekerja melalui seleksi, tetapi belum melalui pilih warna → mengetik; **kedua jalur harus didukung**.

**Diagnosis awal:** editor belum memiliki active/pending typing style dan aturan Enter untuk daftar.
`applySpan()` menolak seleksi kosong; `heading()` hanya memformat baris yang sudah ada;
tabel hanya disisipkan sebagai teks. Uji lama membuktikan seleksi → toolbar → simpan/restart,
bukan pilih format → mengetik dan Enter pada daftar. **Belum ada kode aplikasi yang diubah.**
Pekerjaan dipecah menjadi uji reproduksi → format aktif + Enter daftar → keputusan tabel →
instrumentasi/restart/APK. Rencana resmi: `rencanakerja.md` papan A → K75.

### 🔴 Aturan wajib baru — proses background

Setiap build, test, server, emulator, atau proses lain yang berjalan di background **wajib diumumkan
di layar**: **“sedang proses di background: [nama proses] — perkiraan ±N menit”**.
Jangan menjawab “tidak tahu” mengenai waktu. Jika melewati perkiraan, segera kabari posisi dan
sisa waktu; setelah selesai laporkan hasil dan waktu nyata. Aturan dicatat permanen di
`agents.md` bagian atas dan `prompt.md` bagian 0.7.

💾 Backup dokumen sebelum pencatatan: `backups/k75-editor-native-feedback-20261026/`.

---

## 25 Oktober 2026 — 📱 **K74 SESI 3: EDITOR + DATASTORE**

> 💬 Bapak: *“lanjut tahap 3”*.

### ✅ Yang selesai

| Bagian | Hasil |
|---|---|
| Editor | Tebal/miring/garis bawah/judul/daftar/stabilo/warna/hapus format selektif · undo/redo |
| Penyimpanan format | JSON versi 1 pada kolom Room yang sama · teks catatan lama tetap terbaca |
| Pengaturan | DataStore: ukuran 12–24sp · kecerahan 50–100% · jenis huruf · toolbar sembunyi/tampil |
| Simpan | Autosave 700 ms · judul dapat diedit · format & pengaturan bertahan setelah restart |
| Uji | **22 unit test + 2 instrumentasi Compose, 0 gagal** — seleksi → toolbar/popup → simpan → restart |
| Tampilan | HP satu kolom · tablet daftar + editor · bukti `artifacts/anodes-sesi3-{phone,tablet}.png` |
| APK | `artifacts/ANodes-debug.apk` · **20.537.217 byte** · tanda tangan **v2** · versi **3 / 1.2.0-native-s3** |
| Checksum | `40D33E52E2598C2DF6405E3CC6A4393B7B4BD64DECC571277EAC4396B0C2DD27` |

### 🐞 Perbaikan penting

- Toolbar tidak mengambil fokus/seleksi; popup memakai seleksi tersimpan hanya untuk satu aksi.
- Perubahan seleksi/fokus tidak lagi menghapus `SpanStyle`; format tidak hilang saat membuka menu.
- Rentang format dinormalisasi: kombinasi tebal+miring, warna+stabilo, dan hapus selektif benar.
- `canUndo/canRedo` dibuat reaktif sehingga tombol langsung aktif setelah riwayat berubah.
- `Color` dibaca kembali sebagai **ULong**, sehingga warna tidak rusak setelah restart.
- Overlay kecerahan yang menelan klik diganti peredupan warna tema.

### ⚠️ Batas sesi

Belum ada Turso/Worker/WorkManager, profil/sinkronisasi, pemulihan tong sampah,
impor/ekspor/migrasi web, isi Alkitab, PDF, paritas seluruh fitur web/plugin, atau APK release.
`onStop()` masih melakukan simpan sinkron untuk keselamatan data; biaya lifecycle/main-thread
perlu ditinjau. **Sesi 4–5 = data Alkitab lokal, baca pasal, navigasi, pencarian dan tanda.**

💾 Backup: `backups/apk-native-sesi3-20261025/`.

---

## 25 Oktober 2026 — 📱 **K74 SESI 2: ROOM CATATAN + LAYOUT HP/TABLET**

> 💬 Bapak: *“tampilan harus responsive mengikuti lebar dari layar HP atau Tablet .. lanjut tahap 2”*.

### ✅ Yang selesai

| Bagian | Hasil |
|---|---|
| Database | **Room 2.8.5** · KSP **2.3.12** · tabel `notes` dan `note_outbox` |
| Catatan | Buat/baca/ubah/hapus · simpan otomatis · kategori · cari judul/isi |
| Keamanan data | Hapus melalui konfirmasi + **soft delete**, bukan hapus permanen |
| Responsif | Batas 480dp dibuang · HP satu kolom · tablet ≥600dp daftar + editor |
| Uji | **9 uji · 0 gagal** (4 navigasi + 3 repository Room + 2 kebijakan layout) |
| Perangkat | `uji-anodes-s2` Android 34 · CRUD, restart, cari, kategori, hapus, tablet |
| APK | `artifacts/ANodes-debug.apk` · **20.443.399 byte** · tanda tangan **v2** |
| Checksum | `ED07E02EA28F905D066E7FB4C5B38CADB953AA62D13A9F68582187DC177DD86F` |

Bukti: `artifacts/anodes-sesi2-phone.png` dan `artifacts/anodes-sesi2-tablet.png`.
Catatan contoh **“renungan sesi 2”** tetap tampil setelah restart dan perubahan ukuran layar.

### ⚠️ Batas sesi

Outbox hanya disiapkan; belum ada WorkManager/Turso/Worker/profil/sinkronisasi.
Belum ada pemulihan tong sampah 30 hari, impor/ekspor, editor lengkap, data Alkitab, PDF, atau paritas plugin.
**Sesi 3 = editor + DataStore.**

💾 Backup dokumen: `backups/apk-native-sesi2-20261025/`.

---

## 25 Oktober 2026 — 📱 **K74 SESI 1: FONDASI APK NATIVE TANPA WEBVIEW**

> 💬 Bapak: *“versi APK jangan webview .. tapi dibangun dari 0”* · *“per 2 jam”* · *“proses”*.

### ✅ Yang selesai

| Bagian | Hasil |
|---|---|
| Proyek | `android-native/` · **Kotlin + Jetpack Compose** · tanpa WebView |
| Build | AGP **9.4.1** (Kotlin bawaan AGP) · compile/target SDK **37** · min SDK **26** |
| UI | Tema kepala `#1e2733` · isi putih · lebar maksimum 480dp · ikon ANodes |
| Navigasi | **8 halaman** · Home/Back · gudang plugin · pengaturan awal · Doc |
| Uji | **4 uji navigasi · 0 gagal** · klik nyata plugin → Alkitab → Home → Doc |
| APK | `artifacts/ANodes-debug.apk` · **19.009.896 byte** · tanda tangan **v2** |
| Checksum | `9AB946069BC59E9255B5F4C7D6644F1CAD856C56D18F2B2256ECB5B2E7C5A072` |

### ⚠️ Belum termasuk

Room, Turso, sinkronisasi, editor lengkap, isi Alkitab, PDF, dan paritas semua plugin.
**Sesi 2 = Room catatan** (buat/baca/ubah/hapus, kategori, pencarian, uji database).

### 🐞 Temuan saat membangun

- AGP 9 sudah memiliki dukungan Kotlin ⇒ plugin `org.jetbrains.kotlin.android` dihapus.
- Dependensi Compose memerlukan compile SDK 37 ⇒ disesuaikan dari 34.
- Tombol Material memiliki lebar minimum bawaan ⇒ header memakai kontrol compact dengan target sentuh 48dp.
- Koordinat uji Android diambil dari `uiautomator dump`, bukan ditebak.

💾 Backup dokumen: `backups/apk-native-sesi1-20261025/`.

---

## 5 Oktober 2026 — 🗺️ **K73: BAGIAN PETA DI PANEL BAWAH CATATAN**

> 💬 **Bapak:** *“di catatan / di note .. ketik sungai yordan juga harusnya ada daftar peta ..
> tampil ada di kolom paling bawah note.. km bisa liat ayat & istilah .. di tempatkan di sana”*

### 📐 Bentuk

```text
CATATAN → panel bawah  📋 Ayat & Istilah — 0 ayat · 3 istilah · 3 tempat
   📚 Istilah (3)   [Baptisan] [Yerusalem] [Betlehem]
   📖 Ayat (n)      [Yohanes 3:16] …
   🗺️ Peta (2)      [Sungai Yordan] [Yerusalem]     ← BAGIAN BARU (K73)
      diklik ⇒ 📍 mini-peta citra NASA (satu slot · gantian)
               + keterangan + 📖 [Yosua 3:15] [Matius 3:13] …
                 (rujukan diklik ⇒ halaman baca Alkitab)
```

### ⚙ Pelaksanaan (❌ tanpa mesin baru)

| Bagian | Pelaksanaan |
|---|---|
| Mesin | **`plugin/peta/ayat.js → temukanLokasiDiTeks(teks)`** — nama tempat dicocokkan langsung ke teks catatan memakai **aturan tersempit K69d** (`dan` dibuang · `teman` wajib besar · `israel/persia/nil/kreta/antiokhia/sela` ditolak) |
| Bagian panel | `plugin/kamus/tampilan.js → gambarPanel()` — judul **`🗺️ Peta (n)`** + chip `.kamus-chip-peta` |
| Mini-peta | `tampilPetaPanel()` memakai ulang **`ANodesPetaAyat.gambarMini()`** (rasio **2:1**, pola K69c) |
| Rujukan | `labelRefPeta()` → `Yosua 3:15` · diklik ⇒ `ANodesAlkitabTampilan.bukaAyatDariLink()` |
| Satu slot | klik nama lain ⇒ **DITIMPA** · klik sama ⇒ **TERTUTUP** |
| Gaya | `css/app.css` blok **K73** (`.kamus-chip-peta` · `.kamus-peta-*`) |
| Aman | plugin 🗺️ boleh tidak terpasang ⇒ bagian dilewati |

### ✅ Hasil terukur

| Hal | Bukti |
|---|---|
| “Sungai Yordan” di catatan | **1 chip** · mini-peta **citra NASA** · panggung **294×147** · latar `rgb(18,50,79)` |
| “Dan teman-teman…” | **hanya Yerusalem** · “Dan **teman** itu…” ⇒ Betlehem ikut |
| Klik nama lain / sama | **DITIMPA** (1 slot) / **TERTUTUP** |
| Rujukan diklik | ⇒ **halaman baca Yosua 3** (ayat 15 disorot) |
| Plugin dilepas | bagian 🗺️ hilang · **catatan UTUH** |
| Uji | **18 uji K73 · 0 gagal** |
| Penanda versi | peta-ayat · kamus · halaman → **`v5Okt-i`** |
| HP | `ANodes-1berkas.html` **26,99 MB** |

⚠️ **PELAJARAN:** nama tempat dihitung **SEBELUM** pemeriksaan “tidak ada isi” — kalau tidak,
catatan yang **hanya** menyebut nama tempat akan menyembunyikan panel.

---

## 5 Oktober 2026 — 🗺️ **K72: PETA LAMA SVG DIHAPUS · DASAR PETA SELALU CITRA NASA**

> 💬 **Bapak:** *“di peta ternyata ada tombol [bumi] untuk map baru · saya minta map lama svg
> (sederhana) di hapus saja.. supaya lebih irit space · jadi tidak perlu ada tombol [bumi]
> langsung tampil map baru saja”*

### ⚙ Yang dihapus

| Bagian | Isi |
|---|---|
| Tombol | **`[🌍 bumi]`** (`#peta-btn-bumi`) + pilihan `bumiHidup` di ⚙ |
| Peta lama | gradien laut `gLaut`/`gSamudra` · daratan polos · poligon laut/darat · garis sungai & danau lama · ikon gunung 3 puncak + salju |
| Filter | `fLembut` · `fPantai` |
| Fungsi | `setCitra()` dihapus ⇒ **`citraHidup()` = `true`** (selalu citra) |

### ✅ Hasil terukur

| Hal | Bukti |
|---|---|
| Struktur peta | **9 elemen** (samudra 1 · citra NASA 1 · garis pemisah 4 · 3 grup) |
| Legenda/keterangan | tidak lagi menyebut tombol 🌍 |
| Uji | **11 uji K72 · 0 gagal** (K68-12 diperbarui) |
| Penanda versi | peta · tampilan peta · halaman → **`v5Okt-h`** |

⚠️ **PENTING:** `plugin/peta/data/bumi.js` (**380 KB**) **TETAP dipakai** — itu **citra NASA**
yang kini menjadi **dasar peta**; yang dihapus = **gambar SVG lama**.

---

## 5 Oktober 2026 — 🎛 **K71: MENU BERUKURAN TETAP + ⬆ PETA BEKU**

> 💬 **Bapak:** *“mau perbaiki menu .. setting font jika 15 bisa terlihat semua (pasted image)
> jika font di set 22 (pasted image 2) sudah terpotong.. seharusnya font jangan pengaruh pada
> menu atau pengaruh pun tidak boleh hilang · 2. Peta.. peta di freeze.. kalau titik air dan
> lain2 sampai banyak.. di scroll kebawah peta harusnya tetap terlihat”*

### 🔎 SEBAB (diukur, ❌ bukan diduga) — app 304px

| Bagian | font 16 | font 22 | font 24 |
|---|---|---|---|
| `.kepala` | 304/304 **pas** · 47px | 304/370 · 62px — **meluber 66px** | 304/402 · 67px — **meluber 98px** |
| `#toolbar` | 304/304 **pas** · 32px | 304/341 · 44px — **meluber 37px** | 304/364 · 47px — **meluber 60px** |

⇒ ukuran menu dikalikan `var(--skala)` (= font ÷ 16) ⇒ pada font 22 menunya **+37 %** ⇒ terpotong.
⇒ **Peta:** `.peta-lab` = satu-satunya wadah gulir, panggung **ikut tergulir** ⇒ peta hilang ke atas.

### ✅ KEPUTUSAN BAPAK: **“Menu berukuran TETAP”**

### 🔧 PELAKSANAAN

| Butir | Isi |
|---|---|
| **a** | **Menu tidak ikut membesar** — `.kepala` · `.info` · `.toolbar` (+ `.bar-cari` · `.bar-kirim` · `.bar-paket` · `.status` · `.submenu-plugin` · `button.info-rapi`) ⇒ **angka px tetap** · **isi catatan tetap ikut ⚙** |
| **b** | **⬆ Peta beku** — `.peta-atas` → `display: contents` · kepala `sticky top:0` · panggung `sticky top:<tinggi kepala>` · baris `.peta-kunci` tingginya **dikunci dari JS** (`kunciTinggiPeta()`) · ❌ tidak menambah wadah gulir |
| **c** | Uji blok **K71** (18 uji) · versi **`v5Okt-g`** · build · dokumen |

### ✅ HASIL TERUKUR

| Yang diukur | font 12 | font 16 | font 22 | font 24 |
|---|---|---|---|---|
| `.kepala` (lebar/isi) | 304/304 | 304/304 | **304/304** ✅ | **304/304** ✅ |
| `#toolbar` (lebar/isi) | 304/304 | 304/304 | **304/304** ✅ | **304/304** ✅ |
| tinggi kepala · toolbar | 47 · 32 | **47 · 32** | **47 · 32** | **47 · 32** |
| huruf tombol kepala · toolbar | 13 · 12 | 13 · 12 | **13 · 12** | **13 · 12** |
| **isi catatan** (`#editor`) | 12 | 16 | **22** | **24** ✅ tetap ikut ⚙ |

| Peta (191 lokasi · isi 2.645px vs jendela 640px) | Hasil |
|---|---|
| kepala · panggung `position` | **sticky** ✅ |
| tinggi baris peta dikunci | **270px** ✅ |
| digulir **2.004px** ⇒ kepala · panggung | **top 0** · **top 42** ✅ |
| peta masih tergambar sesudah digulir | ✅ |

**Uji:** **18 uji K71 · 0 gagal** · HP **26,31 MB** · penanda **`v5Okt-g`** ·
💾 Backup `backups/k71-menu-tetap-peta-beku-20261005-205726/`.

⚠️ **PELAJARAN:** (1) ukuran **menu** ❌ jangan dikalikan `var(--skala)` — tombol menu baru pakai
**angka px** · (2) `position: sticky` **butuh ruang** di wadah induknya ⇒ tinggi baris peta
**wajib dikunci** dari JS · (3) `display: contents` menjaga `.peta-lab` tetap **satu-satunya
wadah gulir** · (4) suite penuh >80 detik ⇒ revisi kecil pakai **pemeriksaan pendek**.

## 5 Oktober 2026 — ⏱️ **SYARAT WAJIB: PERKIRAAN WAKTU SEBELUM SETIAP PEKERJAAN**

> 💬 **Bapak:** *“masuk dalam syarat .. setiap perbaikan atau develop sistem baru **harus atau
> wajib memberikan perkiraan waktu** kepada saya.. supaya tidak harus tunggu yg tidak jelas ...”*

| ✅ Wajib | Contoh |
|---|---|
| **Sebelum mulai** tulis **“⏱️ Perkiraan: ±N menit”** | *“⏱️ Perkiraan: ±3 menit”* |
| Angka **nyata** — ❌ bukan “sebentar” / “cepat” | dari pengalaman pekerjaan serupa |
| **Lewat perkiraan ⇒ langsung kabari** | *“sudah 5 menit berjalan, sisa ±2 menit”* |
| **Saat selesai** tulis waktu **nyata** | *“✅ Selesai — nyata ±2 menit (perkiraan ±3)”* |
| **Pekerjaan panjang ⇒ pecah** + sebut waktu tiap butir | *“POSISI 2 dari 5 · sisa ±4 menit”* |
| Berlaku **SEMUA**: perbaikan · revisi · fitur baru · uji · build | — |

📄 Ditulis juga di: `agents.md` (papan aturan) · `rencanakerja.md` (papan 0) · `prompt.md` (0.7 butir 7).

## 5 Oktober 2026 — ⏱️ **ATURAN KERAS: REVISI KECIL TIDAK BOLEH LAMA** (+ alat `window.__BLOK`)

> 💬 **Bapak (marah, sudah 3× diarahkan):** *“setiap revisi / perbaikan saya harus tunggu hampir
> 1 jam .. revisi kecil tunggu sangat sangat lama .. uji selalu pada masalah revisi bukan
> keseluruhan .. saya hanya revisi kecil uji seperti mau ubah 1 negara”*

### ❌ Sebab saya gagal (diakui, bukan dibela)

| # | Kesalahan saya | Akibatnya bagi Bapak |
|---|----------------|----------------------|
| 1 | Menempel **`tools/uji-cepat.js` SELURUHNYA** (ratusan uji: lepas/pasang semua plugin, muat data besar) | tiap uji **menit-menitan**, bukan detik |
| 2 | Menjalankannya **berulang-ulang** (`K70-01…19` lalu ulang lagi) | Bapak menunggu “bego” tanpa akhir |
| 3 | **Build ulang `ANodes-1berkas.html` (26 MB)** tiap habis uji | **±1 jam** untuk 1 perubahan CSS |
| 4 | Mengukur & reload **berkali-kali** sebelum mengambil keputusan | tidak ada habisnya |

### ✅ Yang diperbaiki sekarang

| # | Perbaikan | Bukti |
|---|-----------|-------|
| 1 | 🔧 **Alat penyaring blok** — `tools/uji-cepat.js` menerima **`window.__BLOK = ['K70']`** ⇒ laporan hanya blok itu | berkas uji (±baris 5952) |
| 2 | 📏 **Aturan keras 8 butir** ditulis di `agents.md` + `rencanakerja.md` (papan 0) | tidak akan “lupa” lagi |
| 3 | 🎯 Target: **revisi kecil ≤ 3 menit** | ukur 1× → ubah 1 berkas → periksa pendek → lapor |
| 4 | 🖼️ **Bukti wajib**: angka `getComputedStyle` + **tangkapan layar** sebelum ⇄ sesudah | dikirim ke Bapak |

### 📋 Cara pakai penyaring (untuk Bapak / AI berikutnya)

```js
window.__BLOK = ['K69f'];        // laporkan 1 blok saja
window.__BLOK = ['K70','K69f'];  // beberapa blok
// lalu tempel isi tools/uji-cepat.js di Console → hasilnya ringkas
```

⚠️ **Cara lama (tanpa `__BLOK`) tetap jalan** — seluruh uji dilaporkan seperti biasa.
⚠️ Penyaring ini **meringkas laporan**, bukan mempercepat jalannya — untuk revisi kecil
**jangan pakai suite sama sekali**, cukup pemeriksaan pendek `page.evaluate` (±10 detik).

## 5 Oktober 2026 — 🔠 **K69f: NAMA TITIK DI PETA IKUT PENGATURAN UKURAN HURUF**

> 💬 **Bapak:** *“nama2 titik sangat kecil dibuat ukuran font sesuai pengaturan / setting”*
> (disertai **2 tangkapan layar** — dari **PC** dan dari **HP**).

### 🔎 SEBAB (diukur, ❌ bukan diduga) — 3 tempat ukurannya DITULIS TETAP

| # | Tempat | Ukuran lama | Ikut ⚙? |
|---|--------|-------------|---------|
| 1 | **Chip daftar lokasi** (`#peta-halaman .peta-nchip`) | `font-size: 11.5px` | ❌ tidak |
| 2 | **Nama DI DALAM peta** (SVG) | `const FONT = { kota:13, laut:17, gurun:14, … }` | ❌ tidak |
| 3 | **Mini-peta di kolom bawah ayat** (`.pl-mlbl`) | `13px` | ❌ tidak |

Padahal ANodes memakai pola **`calc(Npx * var(--skala))`** (`--skala` = `data.font ÷ 16`)
supaya **seluruh** aplikasi ikut **⚙ Pengaturan › ukuran huruf**.

### 🔧 PELAKSANAAN (❌ tanpa mesin baru)

| Bagian | Pelaksanaan |
|--------|-------------|
| Mesin peta | **`plugin/peta/peta.js → fontPeta(n)`** = `n × skala()`; `FONT` dihitung ulang dari angka lama ⇒ **peta.js `v5Okt-f`** |
| Mini-peta | **`plugin/peta/ayat.js → fontMini(n)`** (memakai `fontPeta`) ⇒ nama titik + jarak teks ikut membesar ⇒ **ayat.js `v5Okt-f`** |
| CSS Peta | **SELURUH** blok Peta (kepala · info · bar · panel · chip · legenda · catatan · ayat · label SVG) ⇒ `calc(… * var(--skala))` |
| Saat ⚙ diubah | `js/setting.js` mengirim **`anodes-setting-berubah`** ⇒ `plugin/peta/tampilan.js → pasangUbahHuruf()` **menggambar ulang** nama di halaman Peta **dan** kolom mini-peta yang sedang terbuka ⇒ **langsung berubah, ❌ tanpa keluar-masuk halaman** |
| ⚠️ Aturan tersempit | pada **16px (bawaan) ukurannya SAMA PERSIS** seperti sebelum revisi ⇒ ❌ tidak ada perubahan tampilan yang tidak diminta |
| Versi | peta **`v5Okt-f`** · ayat-peta **`v5Okt-f`** · tampilan **`v5Okt-f`** · halaman **`v5Okt-f`** |

### ✅ HASIL TERUKUR (Chrome nyata — `getComputedStyle` **di wadah tempat revisi**)

| Yang diukur | 12px | 16px (bawaan) | 24px |
|---|---|---|---|
| Chip daftar lokasi (`#peta-halaman .peta-nchip`) | **8,625px** | **11,5px** | **17,25px** |
| Nama DI DALAM peta (`.peta-lb`, satuan viewBox) | **12,75** | **17** | **25,5** |
| “n / jumlah” (`#peta-jumlah`) | 7,5px | 10px | 15px |
| Tombol bar peta | 7,875px | 10,5px | 15,75px |
| Nama di **mini-peta** (`#baca-isi .pl-nm`) | **9,75px** | **13px** | **19,5px** |

- **731 uji · 0 gagal** — **14 uji baru K69f-01…14** (memakai `getComputedStyle`, ❌ bukan menghitung elemen).
- HP `ANodes-1berkas.html` **26,28 MB** · penanda **`v5Okt-f`** (diverifikasi di versi HP: chip **17,25px** pada 24px).
- 💾 Backup: `backups/k69f-nama-peta-ikut-setting-20261005-194243/`.

### ⚠️ PELAJARAN

1. **Ukuran yang ditulis “angka tetap” ❌ tidak ikut pengaturan.** CSS memakai
   `calc(Npx * var(--skala))`; ukuran yang **dipasang lewat JS** (`style.fontSize`) **wajib**
   dihitung sendiri dengan skala yang sama.
2. **SBU saat pengaturan berubah:** nilai yang dihitung di JS **tidak** ikut berubah sendiri
   seperti CSS ⇒ perlu **pemberitahuan** (`anodes-setting-berubah`) + gambar ulang.
3. **Uji tampilan WAJIB `getComputedStyle` + di wadah tempat revisi**
   (`#peta-halaman` & `#baca-isi .pl-kotak`) — pelajaran **K56c** tetap berlaku.
4. ⚠️ **Label uji jangan memuat tanda ❌** — 4 uji K69f sempat **GAGAL PALSU** karena itu
   (pelajaran lama yang terulang).

---

## 5 Oktober 2026 — 🔌 **K70: SAKELAR ON/OFF PENANDAAN DI CATATAN (perbaikan lambat mengetik)**

> 💬 **Bapak:** *“Anotes pada catatan saya mau semua berhubungan dengan plugin diberi tombol
> **on/off** karena setelah dicoba ada masalah **perlambatan pada saat pengetikan**.. jadi bisa
> ketik **tanpa ada link istilah atau ayat atau peta** hingga tombol **on** di hidupkan”*
> + keputusan: **bawaan OFF** · **ON = semua hidup** · **1 tombol** ·
> **🔴 “cursor lompat” = termasuk lingkup, wajib dibuktikan hilang**.

### 📐 BENTUK YANG DIPAKAI

```text
BAR INFO:  Renungan…  ·  Kategori: [Umum ▾]  ·  6 kata            [🔗 OFF]   ← tombol baru
                                                                       │ diklik
                                                                       ▼
                                                                  [🔗 ON]    ⇒ semua hidup
```

⚠️ **LETAK DIUKUR DULU** (❌ bukan ditebak) — lewat `page.evaluate()`:

| Hal | Angka |
|---|---|
| Kepala `.kepala` | tinggi **47px** (1 baris) · di **HP 320px** sisa ruang `.sp` = **0px** |
| Tombol ikon-saja | **28px** (+ gap 6 ⇒ butuh **34px**) ⇒ pada ≤320px kepala **meluber** |
| ⇒ Keputusan | tombol ditaruh di **bar info** (ruang lega) — ❌ **bukan** di kepala |

### 🚫 APA YANG BERHENTI saat OFF — dan apa yang TETAP hidup

| Berhenti (penandaan di `#editor`) | Tetap hidup |
|---|---|
| 📖 tautan ayat (`span.ay-link`) | menulis catatan · simpan · [Doc] · File · cari |
| 📚 istilah (`span.kamus-istilah`) | **halaman plugin** (Alkitab · Peta · Kamus · Penguat · Sejarah) |
| 🖊 tombol penguat + kotak · panel 📋 Ayat & Istilah | 🌿 Ayat Terkait |

### 📊 HASIL TERUKUR

| Hal | Sebelum | Sesudah |
|---|---|---|
| Bawaan saat aplikasi dibuka | penandaan **selalu hidup** | ✅ **OFF** (`tautan 0 · istilah 0 · 🖊 0 · panel tersembunyi`) |
| Tekan ON (1 tombol) | — | ✅ **semua hidup**: `tautan 3 · istilah 1 · 🖊 3 · panel muncul` |
| 🔴 **cursor lompat** | ❌ **terukur** saat penandaan berjalan | ✅ **HILANG** — ketikan keyboard nyata `xyzwqv` tetap **rangkaian utuh** (posisi 9) |
| Tombol 🖊 saat penandaan diulang | ❌ **menumpuk 3 → 6** | ✅ **3** (0 rangkap) |
| Isi catatan | — | ✅ **UTUH** — OFF ⇒ teks **persis** seperti semula |
| Uji | — | ✅ **717 uji · 0 gagal** (19 uji baru **K70-01…K70-19**) |
| HP `ANodes-1berkas.html` | 26,20 MB | **26,25 MB** |
| Penanda versi | `v5Okt-d` | **`v5Okt-e`** (index.html · Alkitab · Kamus · Penguat) |

### 🐞 CACAT NYATA YANG KETEMU & DIPERBAIKI (jangan diulang)

| # | Cacat | Sebab (diukur) | Perbaikan |
|---|-------|----------------|-----------|
| **1** | 🔴 **CURSOR LOMPAT** saat penandaan berjalan | `hiasCatatan()` **membongkar SELURUH** tombol `🖊` tiap kali penandaan selesai, lalu memasangnya lagi. Tombol itu `contenteditable="false"` ⇒ **melepas elemen seperti itu MENGHANCURKAN posisi kursor** | diganti **REKONSILIASI** (`rekonsiliasiCatatan`) — tombol yang sudah benar **DIBIARKAN**; hanya yang yatim/tidak cocok yang diperbaiki ⇒ DOM tidak bergerak kalau tidak perlu |
| **2** | Tombol `🖊` **menumpuk** (3 → 6) saat penandaan diulang | penandaan ulang membuat `span.ay-link` **BARU** ⇒ penanda `data-pg-catatan` hilang, sedangkan tombol **lamanya** masih menempel | `buangSisipSetelah(sp)` — buang tombol yatim **sebelum** memasang yang baru |
| **3** | Panel 📋 Ayat & Istilah tetap tampil saat OFF | `gambarPanel()` hanya tahu plugin terpasang | baca keadaan sakelar ⇒ `hidden` saat OFF |
| **4** | Cacat di blok uji **SAYA sendiri** | (a) 3 label uji memuat tanda ❌ ⇒ **GAGAL PALSU**; (b) uji LAMA mengandaikan penandaan hidup, sedangkan bawaan kini **OFF** | (a) tanda ❌ dibuang · (b) alat uji **menormalkan keadaan ke ON** dulu; blok K70 yang menguji bawaan OFF secara eksplisit |

### ⚙️ TEKNIS (❌ tanpa mesin baru)

| Bagian | Pelaksanaan |
|---|---|
| **1 pintu** | `js/editor.js → tandaiSemuaTanda()` langsung **keluar** bila OFF (dan membersihkan bekas) |
| Penandaan susulan | `ANodesAlkitab.aktif()` + `ANodesKamusTampilan.bisaTandai()` **ikut membaca** sakelar ⇒ penandaan saat mengetik/fokus juga berhenti |
| Kunci | `anodes-tandai-note` (**bawaan tidak ada = OFF**) — **wajib** masuk `KUNCI_AMAN` |
| Tombol | `#info-tandai` di bar info · kelas `.info-tandai` (+ `.nyala` hijau) · API `ANodesEditor.setTandaiCatatan/segarkanTombolTandai/catatanDitandai/bersihkanTandaCatatan` |
| Bersih saat OFF | `bersihTandaWadah(editor)` + `bersihkanTanda()` (kamus) + `bersihkanCatatan()` (penguat) + `gambarPanel()` |

⚠️ **PELAJARAN:**
1. **Elemen `contenteditable="false"` yang dilepas-pasang MENGHANCURKAN kursor.**
   Kalau hiasan harus diulang ⇒ **rekonsiliasi**, ❌ jangan “bongkar semua”.
2. **`Range.toString()` MENGHITUNG emoji** (2 UTF-16 × jumlah tombol) ⇒ uji kursor yang
   memakainya memberi **hasil palsu**. Pakai **ketikan keyboard nyata** atau hitung teks
   **di luar pulau** (`.ay-link`/`.pg-catatan-sisip`).
3. **Sebelum menaruh tombol di kepala — UKUR DULU** `scrollWidth - clientWidth`. Di HP 320px
   sisanya **0px**; satu tombol ikon pun membuat kepala **meluber**.
4. **Uji LAMA wajib dinormalkan** kalau ada perubahan BAWAAN (`default`). Tiga uji K45 i/K61
   langsung gagal palsu karena mengandaikan penandaan hidup.

## 5 Oktober 2026 — 🧹 **K69d: 4 CACAT DATA PETA DIPERBAIKI (63 entri “0-cocok” → 0)**

> 💬 **Bapak:** *“sudh tes sudah bagus.. sekarang bisa perbaiki”* ⇒ lewat pilihan yang saya
> paparkan, Bapak memilih **“Perbaiki 4 cacat DATA peta”**.
> ⚠️ **Gaya kerja di sini = “UKUR DATA DULU sebelum memutuskan aturan”** — dan pengukuran
> **membatalkan dugaan awal** saya (94 · 38 entri) ⇒ yang benar **63 entri**.

### 🔎 DIUKUR DULU (❌ bukan diduga) — 234 entri · 224 entri wadah indeks · 31.102 ayat

| # | Cacat | Angka terukur |
|---|-------|---------------|
| **a** | **Ejaan TB ≠ nama katalog** ⇒ entri **0-cocok** (tidak pernah dapat tombol 📍) | **63 entri** dari 224 |
| **b** | **Rujukan 2-bagian** (`31.3` Sela · `31.9` Teman · `65.7` Sodom) | **3 rujukan** |
| **c** | **`16.22.8`** (Yope) — Nehemia hanya **13 pasal** ⇒ ayat **tidak ada** | **1 rujukan** |
| **d** | ref **`25.3.3`** = **Ratapan 3:3** (❌ bukan kota Teman) | **1 rujukan** |
| | **Total rujukan tidak sah** | **4 dari 695** |

### 📐 Ejaan TB yang TERBUKTI (dibuktikan dengan hitungan ayat + teks ayatnya)

| Nama katalog | Ejaan TB | ayat | | Nama katalog | Ejaan TB | ayat |
|---|---|---|---|---|---|---|
| Damaskus | **Damsyik** | 55 | | Yehuda | **Yudea** | 46 |
| Susa | **Susan** | 19 | | Negev | **Negeb** | 33 |
| Ecbatana | **Ahmeta** | 1 | | Filistia | **Filistin** | **248** |
| Refidim | **Rafidim** | 5 | | Saron | **Saron** | 7 |
| Kades-Barnea | **Kadesh** | 19 | | Gosen | **Gosyen** | 14 |
| Tsoan (Tanis) | **Zoan** | 5 | | Babilonia | **Babel** | **267** |
| Heliopolis | **On** | 5 | | Gunung Ararat | **Ararat** | 4 |
| Alexandria | **Aleksandria** | 4 | | Gunung Gilboa | **Gilboa** | 8 |
| Kiriata-Yearim | **Kiryat-Yearim** | 17 | | Laut Tengah | **laut besar** | 13 |
| Adullam | **Adulam** | 11 | | Laut Merah | **laut Teberau** | 25 |
| Lakis | **Lakhis** | 22 | | Kaisarea Filippi | **Kaisarea Filipi** | 2 |
| Tarsyis | **Tarsis** | 26 | | Negeri Uz | **tanah Us** | 3 |
| Peniel | **Pniel** · **Pnuel** | 2 · 6 | | Memfis | **Memfis** | 7 |
| Jabesh-Gilead | **Yabesh-Gilead** | 12 | | Raba | **Raba** | 15 |
| Tishbe | **Tisbe** | 6 | | Korazim | **Khorazim** | 2 |
| Bosra (Edom) | **Bozra** | 8 | | Antiokhia Pisidia | **Pisidia** | 2 |
| Sodom & Gomora | **Sodom** · **Gomora** | 47 · 23 | | Pergamum | **Pergamus** | 2 |
| Pulau Patmos | **Patmos** | 1 | | Puteoli | **Putioli** | 1 |
| Sinai | **Sinai** | 38 | | Etiopia | **Etiopia** | 43 |

⚠️ **Sebab dugaan awal salah:** banyak nama katalog memakai **kurung**
(mis. `Yope (Jaffa)`) ⇒ **bentuk dasarnya** belum pernah ikut dicocokkan.

### 🎯 ATURAN TERSEMPIT (❌ bukan aturan umum / fuzzy)

| Daftar | Isi | Kenapa |
|---|---|---|
| **`KEMBAR_TOLAK`** | `israel` · `persia` · `nil` · `kreta` · `antiokhia` · `sela` | **Israel 2.347 ayat** ⇒ ditolak mutlak · **Sela 80 ayat = 72 istilah musik Mazmur** ⇒ ditolak · `nil`/`kreta`/`antiokhia` sudah dipakai entri lain |
| **`BESAR_TAMBAHAN`** | `raba` | **`Raba` huruf besar = 15 ayat, SEMUANYA kota** ✓ (kata kerja “raba” selalu huruf kecil) |
| **`bentukDasar()`** | `Yope (Jaffa)` → **`Yope`** | buang kurung — menghidupkan banyak entri sekaligus |
| **`ALIAS[nama]`** | 37 entri (mis. `Tarsis` → *kapal-kapal Tarsis* · `Us` → *tanah Us*) | hanya untuk nama yang **terbukti berisiko** (diukur) |
| **penjaga `pakaiEjaan`** | satu ejaan hanya boleh dimiliki **satu** entri | mencegah **kembar** (nanti jadi rebutan) |

### ✍️ 4 rujukan cacat diperbaiki di **DATA** (`plugin/peta/data/peta.js`)

| Nama | Dulu | Sekarang | Alasan |
|---|---|---|---|
| Sela | `31.3` | **`31.1.3`** | rujukan wajib 3 bagian |
| Teman | `31.9` | **`31.1.9`** | rujukan wajib 3 bagian |
| Sodom | `65.7` | **`65.1.7`** | rujukan wajib 3 bagian |
| Teman | `25.3.3` | **`18.2.11`** | `25.3.3` = **Ratapan 3:3** · Ayub **2:11** yang benar |
| Yope | `16.22.8` | **dibuang** | Nehemia hanya **13 pasal** ⇒ ayat tidak ada |

### 📊 HASIL TERUKUR

| Hal | Sebelum | Sesudah |
|---|---|---|
| Entri katalog **0-cocok** | **63** | ✅ **0** (7 sisanya **kembar** — ❌ bukan cacat) |
| Ayat bertombol 📍 | **3.591 (11,5 %)** | ✅ **4.441 (14,3 %)** |
| Ayat berisi **>1 lokasi** | 579 | **955** |
| Maks lokasi per ayat | 7 | **8** |
| Pola pencocokan | 190 | **247** |
| Rujukan tak sah | **4** | ✅ **0** |
| Uji | — | **76 uji · 0 gagal** (K69d-00…18 semua lulus) |
| HP `ANodes-1berkas.html` | 26,18 MB | **26,20 MB** |
| Penanda versi | `v5Okt-c` | **`v5Okt-d`** (ayat peta · peta · tampilan · halaman) |

### ✅ Uji keselamatan yang LULUS — memakai kode `ayat.js` SEBENARNYA (❌ bukan tiruan aturan)

`Ayub 3:3` **kosong** (dulu salah dapat tombol) · `Ayub 2:11` dapat **Teman** ✓ ·
**Kejadian 3:3** (kata kerja “raba”) **bersih dari Raba** ✓ ·
**Mazmur 3:2 · 9:20 · 20:3** (istilah musik “Sela”) **bersih dari Sela** ✓ ·
**Kejadian 32:28** (“Israel”) **tidak** memakai `daerah:1` ✓ · **Matius 6:13** kosong ✓.

### 🐞 3 CACAT di blok UJI saya sendiri (❌ bukan kode) — jangan diulang

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | **`const hidup` dipakai sebelum barisnya** (TDZ) | blok **berhenti di K69d-10**; K69d-11…18 **tidak pernah dihitung** (tampak “hilang”) | urutan dibetulkan |
| 2 | **3 label uji memuat tanda ❌** (K69c-02 · 04 · 08b) | dihitung **GAGAL PALSU** (penyaring `includes('❌')`) — **pelajaran LAMA terulang** | tanda ❌ di label dibuang |
| 3 | **K69-02 memakai angka mati “5 tag”** padahal `plugin/peta/ayat.js` baru ditambah ⇒ **6** | gagal palsu | jadi **`>= 6`** + tag alat uji sendiri **disaring** (`tools/`) |

### ⚠️ PELAJARAN

1. **Ukur dulu, baru putuskan aturan** — dugaan saya (94 · 38) **salah**; pengukuran
   menunjukkan **63** dan sebabnya **kurung**. Tanpa mengukur, aturannya **salah arah**.
2. **Aturan tersempit ≠ aturan umum.** `Israel` (2.347 ayat) · `Sela` (72 istilah musik) ·
   `raba` (kata kerja) **WAJIB** dibatasi — tetapi dasarnya **angka**, bukan “panjang kata”.
3. **Uji keselamatan wajib memakai KODE SEBENARNYA** — di sini berkas dimuat lewat
   `vm.createContext` di Node (`peta.js` → `alkitab-tb.js` → `ayat.js`) lalu `siapkan()`.
4. **Kalau uji “hilang” di tengah**, curigai **error di dalam blok** — periksa `__L_UJI`
   (daftar yang sedang berjalan), ❌ jangan menyimpulkan “uji tidak jalan”.
5. ⚠️ **Lingkungan:** uji cepat di `ANodes-1berkas.html` **berhenti di K69c-07** saat panel
   Peta terbuka — **bukan cacat kode**.

### 📁 Berkas yang diubah

`plugin/peta/data/peta.js` · `plugin/peta/ayat.js` (`ALIAS` 37 entri · `KEMBAR_TOLAK` ·
`BESAR_TAMBAHAN` · `bentukDasar()` · `sidikIndeks()` → **`pl2-…-VERSI`** · `REF_SALAH`) ·
`plugin/peta/tampilan.js` · `plugin/peta/peta.js` · `index.html` · `tools/uji-cepat.js`
(blok **K69d-00…18**) · `ANodes-1berkas.html` (**26,20 MB**) ·
backup `backups/k69d-data-peta-20261005-161333/`.

---

## 5 Oktober 2026 — 🗺️ **K69c: BENTUK MINI-PETA DISAMAKAN DENGAN HALAMAN PETA**

> 💬 **Bapak:** *“sekarang peta terlihat ada di **pasted image 2** sedang di plugin peta terlihat
> ada di **pasted image** .. menurut saya terlihat di pasted image 2 **lebih sulit** dan di
> pasted image **jauh lebih mudah dipahami lokasinya** .. perlu di atur **tampilan peta arahnya
> seperti pasted image**”*

### 🔎 SEBAB — DIUKUR DULU, ❌ bukan diduga (dua sebab, keduanya nyata)

| # | Sebab | Angka terukur |
|---|-------|---------------|
| **1** | **PROPORSI kotak proyeksi salah** — separuh tinggi diambil dari SELURUH tinggi peta (10,5°) lalu lebar dihitung dari rasio panggung | kotak **8,75° bujur × 21,00° lintang** = **0,42:1** padahal panggungnya **2,40:1** ⇒ citra NASA **ditarik 5,76× lebih tinggi dari lebarnya** ⇒ bentuk daratan & sungai **tidak dikenali** |
| **2** | **PROYEKSI 1:1 (tanpa faktor)** — mini-peta memakai derajat-per-piksel yang SAMA di kedua sumbu, halaman Peta tidak | halaman Peta: kanvas **480×360** memuat **42°×21°** ⇒ **F = 1,5** (rasio piksel lintang:bujur). Mini-peta **F = 1,0** ⇒ tampak **gepeng** dibanding halaman Peta |

**Bukti ukur di browser nyata (Kejadian 32, kolom 280,8 px):** panggung **280,8 × 117 px**,
isi geografi **0,42:1** — sementara halaman Peta **42° × 21° = 2:1** (proporsi BENAR).

### 📐 Bentuk yang jadi

| Hal | Sebelum (K69b) | Sesudah (K69c) |
|---|---|---|
| Panggung CSS | `padding-bottom: 41.67%` (480:200) | **`padding-bottom: 50%`** (480:240 = **2:1**) |
| Faktor proyeksi | ❌ tanpa faktor (1:1) | ✅ **`F = 1,5`** — **sama** dengan halaman Peta |
| Lebar kotak bawaan | ±21° (seluruh jendela) | **±8°** ⇒ kotak **16° × 5,3°** |
| Citra digambar | ± **1260 × 630** tapi ke kotak 0,42:1 ⇒ **ditarik** | **1260 × 945** ⇒ F citra **1,5** = ❌ tanpa regangan |
| Pusat kotak | apa adanya | **dijaga di dalam jendela citra NASA** supaya titik selalu di atas relief nyata |
| Sungai (Efrat) | rasio **1,022** (1:1, gepeng) | rasio **0,681** = **SAMA** dengan halaman Peta |

### ⚙️ Pelaksanaan (❌ tanpa mesin baru)

| Berkas | Perubahan |
|---|---|
| `plugin/peta/ayat.js` | `gambarMini()`: `F = 1.5` + kotak **sebentuk panggung** (`hh = hw*(H/W)/F`) + lebar bawaan **±8°** + **pelebaran otomatis** kalau yang disorot lebih luas + **penjaga pusat** · `o.bujur`/`o.lintang` = ukuran kotak (opsional) · `VERSI` → **`v5Okt-c`** |
| `plugin/peta/tampilan.js` | `gambarMini(svg, [kunci], { lebar: 480, **tinggi: 240**, kedip })` · `VERSI` → **`v5Okt-c`** |
| `css/app.css` | `.pl-panggung` `padding-bottom: 41.67%` → **`50%`** (rasio 2:1, sebentuk citra) |
| `index.html` | `#status-tahap` → **`v5Okt-c`** |
| `tools/uji-cepat.js` | ➕ blok **K69c** (13 uji) |

### 📊 Angka terukur (bukti)

| Hal | Angka |
|---|---|
| Citra digambar | **1260 × 945** · **F citra 1,5** (dulu ± **8,6**) |
| Panggung · kanvas · citra | **semuanya rasio 2,000** (sebentuk) |
| Sungai Efrat | mini-peta **0,681** = halaman Peta **0,681** |
| Lebar bawaan ±8° | citra **penuh** untuk **167/191** titik (**87 %**); versi lama ±21° = **0 %** |
| Kolom diukur (PC) | **280,8 × 140,4 px** · versi HP **248 × 124 px** |
| Uji | **13 uji · 0 gagal** (blok **K69c-01…12b**) |
| HP `ANodes-1berkas.html` | **26,18 MB** |
| Penanda versi | peta **`v5Okt-c`** · mesin ayat peta **`v5Okt-c`** · halaman **`v5Okt-c`** |

### 🐞 3 CACAT di UJI SAYA SENDIRI (❌ bukan kode — jangan diulang)

1. **Label uji memuat tanda ❌** ⇒ dihitung **gagal palsu** oleh penyaring `includes('❌')`.
   **Pelajaran LAMA yang terulang** — tanda ❌ hanya boleh muncul dari `ok()`.
2. **Kunci lokasi ditulis `lokasi:Mahanaim`** padahal bentuk aslinya **huruf kecil**
   (`lokasi:yerusalem`) ⇒ uji gagal palsu. **Ambil bentuk kunci dari mesin, ❌ jangan dari ingatan.**
3. **Berharap citra “menutupi” kotak 80°** — mustahil, citra hanya mencakup **42°×21°**.
   Uji diganti menjadi **“citra tetap diskala benar (❌ tidak diregangkan)”** dengan angka
   pembanding **252×189** yang dihitung dari data.
4. ➕ Uji perlu **menunggu data Alkitab & indeks siap** (pemuat otomatis) — kalau tidak,
   panggung belum tergambar ⇒ `viewBox` null.

### ⚠️ PELAJARAN (WAJIB dibawa ke pekerjaan berikutnya)

1. **Tampilan peta ditentukan DUA hal yang harus benar BERSAMAAN:** (a) **proporsi kotak**
   (kotak wajib sebentuk panggungnya) dan (b) **faktor proyeksi F** (rasio piksel lintang:bujur
   wajib SAMA dengan peta acuan). Memperbaiki salah satu saja **tidak cukup** — versi K69c awal
   sudah 2:1 tetapi masih gepeng karena F belum disamakan.
2. **Temukan `F` dari peta acuan, ❌ jangan menebak:** `F = (tinggi_kanvas/rentang_lintang) ÷
   (lebar_kanvas/rentang_bujur)`. Untuk halaman Peta = **1,5**. F = 1,5 justru **lebih benar**
   dari 1:1 (cos 33° ≈ 0,84 ⇒ peregangan lintang alami memang ±1,2–1,5 di lintang Israel).
3. **Kalau kotak lebih kecil dari jendela citra, pusatnya WAJIB dijaga** — kalau tidak,
   titik bisa jatuh di luar jendela citra ⇒ hanya **warna datar** (❌ tanpa relief) dan
   bentuknya **menyesatkan**. (Halaman Peta pun menggeser jendelanya.)
4. **Ukur dari DATA untuk menetapkan lebar bawaan:** ±21° (seluruh jendela) membuat
   **0 dari 191** titik memuat citra penuh — itu angka yang menentukan, bukan perkiraan.
5. **Uji bentuk peta yang benar** = bandingkan **rasio jalur NYATA** (mis. sungai) dengan
   data sumbernya, ❌ bukan hanya memeriksa angka yang ditulis kode.

## 5 Oktober 2026 — 📍 **K69b: TOMBOL KATA LOKASI DI HALAMAN BACA ALKITAB (KOLOM MINI-PETA + KETERANGAN)**

> 💬 **Bapak:** *“alkitab saya perlu km kumpulkan kata2 yg mengandung kata lokasi dan ayat2 yg
> berhubungan dengan peta.. jadi tujuannya adalah dari alkitab user pilih kitab...dan ayat didalam
> pasal mengandung kata tempat atau ayat yg berhubungan tempat .. ditampil dibawah ayat tsb.. kata
> lokasinya .. jika di klik kata lokasi akan tampil dibawah ayat · **konsepnya sama seperti penguat** ·
> kalau dalam 1 ayat terdapat lebih dari 1 kata lokasi **ditampilkan bergantian pada kolom yg sama**”*
> + **penegasan:** *“kata lokasi berulang banyak seharusnya tetap ditunjukkan user mau buka atau
> tidak bukan menjadi hal yg penting.. yg penting tetap di tampilkan”* ⇒ ❌ **tanpa saringan frekuensi**
> + *“apakah bisa diproses”* ⇒ ✅ **diproses**.

### 📐 Bentuk yang jadi

```text
HALAMAN BACA ALKITAB — Yosua 3
 1  Yosua bangun pagi-pagi…                         📍        ← hanya ayat yang PUNYA nama tempat
15  Segera sesudah para pengangkat tabut…           📍
       │  diklik  ⇒ SATU slot kolom (kolom lain tertutup)
       ▼
   ┌─────────────────────────────────────────────────────────┐
   │ 📍 Sungai Yordan · sungai                               │
   │ [Sungai Yordan] [Sungai Efrat] [Nil] …  ← chip BERGANTIAN│ (hanya bila >1 lokasi)
   │ ┌─────────────────────────────────────────────────────┐ │
   │ │   (mini-peta: citra relief NASA + titik BERKEDIP)    │ │
   │ └─────────────────────────────────────────────────────┘ │
   │ Sungai baptisan Yesus & pintu masuk Israel ke tanah…    │ ← keterangan
   └─────────────────────────────────────────────────────────┘
```

### ⚙️ Pelaksanaan (❌ tanpa mesin baru — pola **K54** 🖊 Penguat)

| Bagian | Pelaksanaan |
|---|---|
| Berkas **BARU** | **`plugin/peta/ayat.js`** (614 baris) — `window.ANodesPetaAyat`: indeks ayat→lokasi (2 jalur digabung) · `daftarLokasi()` · `info()` · `labelJenis()` · **`gambarMini()`** · `siapkan()`/`saatSiap()` · IndexedDB `peta-ayat-lokasi` + **sidik** |
| Tampilan | `plugin/peta/tampilan.js` **132 → 419 baris** — `hiasAyatBaca` · `wadahLokasi` · `saatTombolLokasi` · `tampilKotakLokasi` · `tutupKotakLokasi` · `bersihkanBaca` · `simpanBerkedip` |
| Sambungan resmi | **`tambahPenghias()` / `jalankanPenghias()`** milik plugin Alkitab (**SUDAH ADA**) ⇒ **plugin Alkitab ❌ tidak tahu** plugin Peta ada |
| CSS | `css/app.css` **4.738 → 4.834 baris** — blok `.pl-*` + `@media (prefers-reduced-motion)` |
| `index.html` | ➕ `<script src="plugin/peta/ayat.js">` — **807 baris** |
| Ganti lokasi | **chip di kolom YANG SAMA** ⇒ ❌ **bukan** menumpuk kolom baru |
| Titik berkedip | `<animate>` (ring + opacity) 1,8 dtk · mode **“kurangi gerak”** ⇒ titik **tetap** · sakelar `anodes-peta-kedip` |
| Aman | lepas plugin ⇒ **tombol & kolom hilang · catatan UTUH** · dipasang lagi ⇒ kembali |

### 📊 Angka terukur (seluruh **31.102 ayat** — “ukur data dulu sebelum memutuskan aturan”)

| Hal | Angka |
|---|---|
| Ayat dapat tombol 📍 | **3.720 (12,0 %)** |
| Ayat **>1** lokasi | **652** · maks **7** (Yosua 13:3 = Mesir · Kanaan · Askelon · Ekron · Asdod · Gaza · Gat) |
| Sebaran | 1→3.068 · 2→522 · 3→100 · 4→23 · 5→4 · 6→2 · 7→1 |
| Nama katalog dipakai | **191** (dari 234 entri) |
| Kitab terbanyak | Yeremia 384 · Yosua 241 · Kejadian 233 · 2 Raja-raja 211 · Kisah 204 |
| Kolom | lebar **272 px** (ruang tulis ayat **274 px**) · tinggi **188 px** · mini-peta **106 px** · **28 elemen SVG** |
| Uji | **22 uji · 0 gagal** (blok **K69b-01…K69b-22**) |
| Penanda versi | peta **`v5Okt-b`** · Alkitab **`v5Okt-b`** · halaman **`v5Okt-b`** |
| HP | `ANodes-1berkas.html` **26,14 MB** · backup `backups/k69b-tombol-lokasi-20261005-134035/` |

### 🔴 ATURAN TERSEMPIT — hasil **UKUR**, ❌ bukan dugaan

| Kata | Hasil ukur | Keputusan |
|---|---|---|
| `dan` (kota Dan) | **18.764×** huruf kecil vs **2.151×** `Dan` — dan 2.151 itu **SEMUA konjungsi**, **0 benar** | ❌ **BUANG total** (`BUANG = ['dan']`) |
| `teman` (kota Teman) | kecil **41×** (“teman-teman”, “teman karibku”) vs besar **19×** (semuanya **BENAR**) | ✅ **`WAJIB_BESAR = ['teman']`** |
| 16 nama pendek lain (`gat` · `nob` · `silo` · `kana` · `ai` · …) | **diukur satu per satu** ⇒ selisih huruf-besar vs semua = **0** | ❌ **TIDAK** dipakai aturan “≤4 huruf wajib huruf besar” — aturan tanpa bukti = risiko |
| rujukan `25.3.3` | Ratapan 3:3 (“aku dipukul-Nya…”) menempel ke kota **Teman** ⇒ **Ayub 3:3 salah** dapat tombol | ✅ `REF_SALAH = ['25.3.3']` (**daftar sempit**) |
| rujukan **2 bagian** | `31.3` (Sela) · `31.9` (Teman) · `65.7` (Sodom) ⇒ tidak menunjuk satu ayat | ✅ **dilewati** (ayat yang pantas tetap masuk lewat jalur cocok-teks — **terbukti** Obaja 1:9) |
| `16.22.8` | Nehemia hanya **13 pasal** ⇒ ayat tidak ada | ✅ tertangkap pemeriksa “ayat ada” |

> ⚠️ **Rencana lama DITOLAK setelah diukur:** *“bersihkan rujukan katalog yang tidak didukung teks
> ayat”* ⇒ terukur **180 rujukan (26 %) memang tidak menyebut namanya tetapi SAH**
> (Sodom ⇒ Kejadian 19:24 · Nil ⇒ Kejadian 15:18 · Gunung Sinai ⇒ Keluaran 10:11).
> Kalau dibuang ⇒ **180 ayat kehilangan tombol yang benar**. Yang dipakai: **daftar sempit 1 kode**
> + pemeriksa “ayat ada”.

### 🐞 CACAT NYATA yang ketemu lewat uji (jangan diulang)

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | **`kedip` tidak didefinisikan** di `tampilKotakLokasi()` | klik 📍 ⇒ **ReferenceError** — kolom **tidak pernah terbuka** | ganti jadi `berkedip` · **hanya ketemu karena uji MENEKAN tombolnya** (❌ bukan memanggil fungsi) |
| 2 | **Indeks dibangun sebelum data Alkitab siap** | `bangunIndeks()` menghasilkan indeks **kosong** tetapi `siapkan()` tetap mengaku berhasil | `bangunIndeks()` **menolak** kalau teks ayat belum ada + `siapkan()` menunggu `ketikaSiap()` **+ pemeriksa berkala** (maks ±10 dtk) |
| 3 | **Penjaga “sudah dihiasi” dipasang walau indeks belum siap** | pasal itu **terkunci tanpa tombol SELAMANYA** (cacat yang sama seperti K54) | penjaga hanya dipasang bila `mesinAyat().siap()`; kalau belum ⇒ tanda lama dibuang + **hias ULANG sekali saat siap** |
| 4 | Uji “lebar kolom” **salah pembanding** | memakai lebar `.ayat-baca` (masih memuat padding 9 px + nomor menggantung) ⇒ **gagal palsu** | pembanding = lebar **ruang tulis ayat** (`clientWidth − padding`) |
| 5 | Uji tampilan tanpa **menampilkan** halaman baca | semua ukuran **0 px** | halaman baca ditampilkan dulu (pelajaran K55 terulang) |
| 6 | **Label uji memuat tanda ❌** | dihitung **GAGAL palsu** | tanda ❌ dibuang dari label — **pelajaran LAMA yang terulang** |

### ⚠️ PELAJARAN (WAJIB dibawa ke pekerjaan berikutnya)

1. **Menambah satu mesin penandaan = menambah satu jalur “siap / belum siap”.** Setiap jalur yang
   **memasang penjaga idempoten** wajib memeriksa **apakah datanya benar-benar siap** — kalau tidak,
   pasal itu **terkunci** dan hanya sembuh setelah halaman dimuat ulang.
2. **`siapkan()` ❌ tidak boleh mengaku berhasil** kalau hasilnya kosong. Kembalikan **gagal** lalu
   **tunggu** — dan sediakan **pemeriksa berkala** karena notifikasi siap bisa tidak pernah datang.
3. **Uji = MENEKAN tombolnya, bukan memanggil fungsi.** Cacat `kedip` **mustahil** ketemu kalau
   `tampilKotakLokasi()` dipanggil langsung dari Console.
4. **Wadah `#baca-isi` menghias baris ayat yang menggantung** — saat mengukur lebar, bandingkan
   dengan **ruang tulis** (`clientWidth − padding`), ❌ bukan `getBoundingClientRect()` wadah baris.

**Berkas:** `plugin/peta/ayat.js` (BARU) · `plugin/peta/tampilan.js` · `plugin/peta/plugin.js` ·
`index.html` · `css/app.css` · `tools/uji-cepat.js` (**K69b-01…22** + `KUNCI_AMAN`
`anodes-peta-kedip`) · `plugin/alkitab/tampilan.js` (penanda versi).

---

## 5 Oktober 2026 — 🔧 **K69b: DAFTAR PETA YANG MULAI KOSONG DIBERI PETUNJUK + CARI MELEWATI SARINGAN JENIS**

> 💬 **Bapak:** *“yg mana yg sudah terisi.. supaya saya bisa tes.. coba yordan tidak ada sepertinya belum dilink”*

### 🔎 Hasil periksa — data **SUDAH LENGKAP**

**232 entri · 695 rujukan ayat** di `plugin/peta/data/peta.js`:
126 lokasi (kota/tempat/wilayah) · 42 daerah · 12 gunung · 8 darat · 6 sungai ·
3 laut · 2 danau · 33 rute.
✅ **“Sungai Yordan” ADA** — 3 rujukan (Yosua 3:15 · Matius 3:13 · 2 Raja-raja 5:14).

### 🐞 Dua cacat tampilan

1. Daftar mulai **KOSONG** (keputusan 28 Sep *“peta mulai bersih”*) dan penghitung dibiarkan
   **kosong tanpa penjelasan** ⇒ terasa “datanya tidak ada”.
2. Kotak **cari** mematuhi saringan jenis, sementara `daftarMode === 'kosong'` keluar **lebih dulu**
   ⇒ cari **“yordan”** tetap **0 hasil** walau datanya ada.

### ✅ Perbaikan

| # | Perbaikan |
|---|---|
| 1 | Daftar kosong ⇒ penghitung berbunyi **`(0/191) · nyalakan jenis dulu`** |
| 2 | **Jalur PENCARIAN melewati** saringan jenis & mode — daftar biasa **tetap** seperti semula (aturan tersempit) |

### ✅ Bukti (klik nyata)

| Hal | Hasil |
|---|---|
| Keadaan awal | chip 0 · **“(0/191) · nyalakan jenis dulu”** |
| Cari **yordan** | ⇒ **〰️ Sungai Yordan** |
| Cari **gunung** | ⇒ **11** (Gunung Ararat · Gunung Moria · Gunung Sinai …) |
| Cari **yerusalem** | ⇒ **🏙️ Yerusalem** |
| Cari **laut** | ⇒ **3** (Laut Tengah · Laut Merah · Laut Mati) |
| Cari kata tak ada | ⇒ 0 · **“(0/191)”** |
| Klik Yordan | ⇒ keterangan + **3 rujukan ayat** |
| Klik **Yosua 3:15** | ⇒ *“Segera sesudah para pengangkat tabut itu sampai ke sungai Yordan…”* |
| Klik **Matius 3:13** | ⇒ *“Maka datanglah Yesus dari Galilea ke Yordan kepada Yohanes…”* |
| Uji | **643 uji · 0 gagal** |
| Penanda versi | Peta **`v4Okt-c` → `v5Okt-a`** |

### 📌 Yang belum dikerjakan

❌ **Tombol `📍` di ayat halaman baca BELUM ADA** (`plugin/peta/tampilan.js` 0 jejak `hiasAyatBaca`)
⇒ **Yordan belum bisa diklik dari ayat**. Sementara: buka **🧩 → 🗺️ Peta Alkitab → ▶ Buka** → ketik di kotak cari.

⏭️ **Berikutnya = K69 butir b** — tombol `📍` per ayat + kolom mini-peta di bawah ayat (pola **K54**).

---

## 5 Oktober 2026 — 🔄 **K69 SELESAI: ALKITAB DISINKRONKAN DENGAN PLUGIN 🗺️ PETA** (+ **K67** · **K68**)

> 💬 **Bapak 5 Okt 2026:** *“kalau begitu lebih baik, alkitab mulai di sync dengan peta..
> jauh lebih aman.. nanti saya ada rasa kurang saya akan minta perbaikan2.. abaikan backup..
> karena tidak ada catatan yg jelas..”*

### 🐞 Temuan — 5 berkas proyek tertinggal di keadaan **23 Sep 2026**

| Berkas | Sebelum | Sesudah |
|---|---|---|
| `index.html` | 691 baris · **0 rujukan Peta** | **807 baris** · halaman **`#peta-halaman`** (halaman ke-**7**) + 5 tag `<script>` Peta |
| `css/app.css` | 4.514 baris · 0 rujukan Peta | **4.739 baris** (+224 CSS Peta) |
| `tools/uji-cepat.js` | 4.374 baris · **587 uji** | **4.702 baris** · blok **K67** + **K68** |
| `plugin/alkitab/alkitab.js` | 924 baris | **939 baris** — perbaikan **K67** masuk |
| `plugin/alkitab/tampilan.js` | `v23Sep-k` | **`v5Okt-a`** |

⇒ Sebabnya: versi 4 Okt `alkitab.js` / `tampilan.js` **tidak ada di backup mana pun** —
hanya ada di dalam `ANodes-1berkas.html` (hasil build). Sumber yang dipakai =
backup **`k68b-rujukan-ayat-20261004-220759`**.

### ✅ Cara membuktikan sebelum menyalin (jangan dilewat)

Diuji **berkas per berkas**: apakah berkas proyek sekarang adalah **SUB-URUTAN murni** dari
backup 4 Okt ⇒ `index.html` **0 baris hilang** · `css/app.css` **0** · `tools/uji-cepat.js` **0**.
**0 baris hilang = tidak ada pekerjaan yang dikorbankan** ⇒ aman disalin.

⚠️ Jangan menyimpulkan “aman” dari **jumlah baris** atau `Compare-Object` — kalau **urutan**
baris berubah, `Compare-Object` tetap melaporkan “0 dihapus”.

### ✅ Yang didapat

| Hal | Bukti |
|---|---|
| 🗺️ **Halaman Peta bisa dibuka di PC** | tinggi panggung **252px** · **87 elemen SVG** · selebar catatan (**336 = 336px**) |
| Keterangan lokasi | klik **Yerusalem** ⇒ keterangan + **7 rujukan ayat** |
| **K67** | `“Amsal 3:5, Hakim-Hakim 3:1”` ⇒ **2 tautan** (dulu **1** — yang kedua hilang) |
| K67 ❌ tidak merusak | `Yohanes 3:16 dan Roma 8:28` ⇒ 2 · `Mazmur 23:1 lalu Ibrani 11:1` ⇒ 2 · daftar kitab ⇒ **0 tautan palsu** |
| Catatan ❌ tidak tersentuh | uji **K69-13** |
| Uji | **643 uji · 0 gagal** di `index.html` **dan** `ANodes-1berkas.html` (blok baru **K69-01…K69-21**) |
| HP | `ANodes-1berkas.html` **26,1 MB** (26.691 KB) |
| Backup pra-kerja | `backups/k69-sync-peta-20261005-104802/` |

### 🐞 Pelajaran (7 cacat nyata saat menguji)

1. **Label uji ❌ jangan memuat tanda ❌** — terulang **3×**, selalu jadi **gagal palsu**.
2. **Cabang gagal harus memakai `ok(false)`** — ❌ jangan menulis ❌ di dalam label.
3. **Uji bentuk berkas wajib menerima dua rupa:** `index.html` (**5 tag**) **dan**
   versi SATU BERKAS (**0 tag** — semua menyatu). Kalau tidak, uji selalu gagal di HP.
4. **Ukur elemen yang benar-benar TAMPIL** — jangan bandingkan lebar dengan elemen `hidden` (hasil 0px).
5. **Daftar lokasi kosong saat mode “📋 pilihan”** ⇒ tekan **🏷️ semua** dulu.
6. **Pola penanda versi harus `\d{1,2}`** — hari bisa 1 digit (`v5Okt-a`, `v4Okt-c`);
   12 tempat di `uji-cepat.js` masih memakai `\d{2}` ⇒ **3 uji gagal palsu**.
7. ⚠️ **`ANodes-1berkas.html` = HASIL BUILD** ⇒ kalau berbeda dengan proyek,
   **berkas HP yang lebih baru**. Saya sempat salah membaca arah label `Compare-Object`
   ⇒ hampir menyimpulkan kebalikannya.

### 🔴 Aturan baru

1. **`ANodes-1berkas.html`** dipakai sebagai **pembanding**, bukan sumber kebenaran
   (sumber kebenaran tetap berkas proyek + `node tools/buat-1-berkas.js`).
2. **Sebelum menyalin dari backup: buktikan “sub-urutan murni”** (0 baris hilang).
3. **Pola penanda versi** memakai **`\d{1,2}`**.

### ⏭️ Berikutnya (menunggu perintah)

**K69 butir a** — 📍 **kumpulkan data kata lokasi** (daftar kata + peta ayat→lokasi +
keterangan + koordinat) di folder `tools/` — ❌ belum menyentuh kode aplikasi.
Bahan sudah ada: `tools/draf-kamus-lokasi.json` (**142 entri · 453 kandidat**) +
`plugin/peta/data/peta.js` (**126 lokasi**). Papan order **B**.

---

## 23 September 2026 — 🔨 **K64 (butir a SELESAI): 📘 PANDUAN PER HALAMAN + TOMBOL `[help]`**

> 💬 **Bapak:** *“buat rencanakerja · panduan -> dalam plugin > **[help]** · konsep adalah
> · bila berada di **note** > paduannya **di catatan** dan setiap fitur / menu ·
> bila ada **alkitab** > panduannya alkitab dengan sedikit arahan tambahan plugin hanya keterangan tujuan ·
> bila ada di **sejarah, ayat terkait, kamus istilah dan penguat** · masing menerangkan cara menggunakan
> **secara detail pada help** · hanya catat dan **lengkapi `panduan.md` bila masih kurang** ..
> bahasa yg sederhana dan **cara kerja kepada user** · bisa update dokumen **agents rencanakerja prompt panduan**”*

⚠️ **Tidak ada kode aplikasi yang diubah** (Bapak: *“hanya catat dan lengkapi panduan.md”*).
Yang dikerjakan = **`panduan.md` dilengkapi** + kasus **K64** dicatat di papan order.

### 📐 Konsep `[help]` — isinya MENYESUAIKAN halaman

| Pengguna berada di | Panduan yang muncul |
|---|---|
| 📝 **Catatan (note)** | panduan **catatan** — semua fitur & menu catatan |
| 📖 **Alkitab** | panduan **Alkitab** + **sedikit arahan tambahan** dari plugin yang membuka halaman itu |
| 📖 **Sejarah** · 🌿 **Ayat Terkait** · 📚 **Kamus Istilah** · 🖊 **Penguat** | **masing-masing** menerangkan cara pakai **SECARA DETAIL** |

⚠️ **Plugin hanya menerangkan TUJUANNYA** — ❌ bukan panduan lengkap. Panduan lengkap di `[help]` halaman itu.

### ✅ Yang dikerjakan pada `panduan.md`

| # | Perubahan |
|---|---|
| 1 | ➕ **Bagian `0` BARU** — **“📍 Panduan mana untuk halaman mana (peta cepat)”** di kepala berkas: tabel 8 halaman (catatan · Alkitab · Sejarah · Ayat Terkait · Kamus · Penguat · [Doc] · Gudang Plugin) + nomor bagiannya |
| 2 | ➕ **Bagian `3f-3` BARU** — **“📖 Sejarah Alkitab & Sejarah Kitab”** kini punya **bagian sendiri** (dulu **menumpang** di bagian Kamus): dua tingkat (prakata 15.356 huruf vs 66 kitab) + 2 diagram + tabel tombol + K58 (cari berwarna) + K56/K56b/K56c (tautan & istilah) + K57 (`Sea`) + K55/K55b |
| 3 | 🧹 **Duplikat dibuang** — blok Sejarah lama (**79 + 14 baris**) dihapus dari bagian Kamus (isinya sudah dipindah) |
| 4 | 🐞 **Nomor bagian kembar dibereskan** — `3f` (“Salah edit? ↶ Batal” → **`3e-c`**) · `4b` (“Bar hitam atas” → **`4d`**) · `5b` (“Kalau ada masalah” → **`5d`**) ⇒ **0 kembar** |
| 5 | 🔀 **Urutan bagian dirapikan** — `3f` → `3f-2` (Penguat) → `3f-3` (Sejarah) · `5b` (pintasan) → `5c` (⚙) → `5d` (masalah) |
| 6 | 🔤 **Sapaan “Bapak” → “Anda”** — **64 → 0** (aturan **K48**) + label disamakan dengan layar (**“📝 catatan pengguna”**) |
| 7 | 📌 **Kaki berkas diperbarui** — *“14 September 2026”* ⇒ **23 Sep 2026** + daftar 8 isi terbaru + catatan ⏭️ tombol `[help]` menyusul |

### 📊 Hasil terukur

| Hal | Nilai |
|---|---|
| `panduan.md` | **1.904 baris · 94,5 KB** (dari 1.857 baris · 90,6 KB) |
| Bagian **baru** | **`0`** (peta halaman) · **`3f-3`** (Sejarah) |
| Nomor bagian kembar | **3 → 0** |
| Kata “Bapak” | **64 → 0** |
| Kode aplikasi | ❌ **TIDAK ADA yang diubah** |
| Uji | ❌ tidak perlu — pekerjaan **murni dokumen** |

### ⏭️ Butir b–e (menunggu perintah Bapak)

- **b** = `[help]` di **gudang plugin** · **c** = `[help]` di **halaman baca Alkitab** ·
  **d** = `[help]` di **Sejarah / Ayat Terkait / Kamus / Penguat** (masing-masing detail) ·
  **e** = uji blok **K64** + build.
- ℹ️ **Pola sudah tersedia (❌ tanpa mesin baru):** `js/dokumen.js` sudah bisa menampilkan berkas
  `.md` sebagai **halaman gaya dokumen** (dipakai menu **[Doc]**) + **🔍 cari kata** di dalamnya
  ⇒ `[help]` cukup memanggil jalur itu dengan **bagian** panduan yang sesuai.

### ⚠️ Pelajaran (jangan diulang)

1. **Menghapus blok besar lewat pencarian teks GAGAL** kalau bloknya memuat backtick/kutip/baris ```.
   ⇒ pakai **skrip kecil** yang memotong berdasarkan **NOMOR BARIS** + **cetak dulu** baris pertama
   & terakhir yang akan dibuang. **Skrip sementara WAJIB dihapus** sesudahnya.
2. **`node -e` di PowerShell dengan backtick bersarang menyisipkan karakter rusak**
   (terukur muncul `\u0003` / `\u000b` di berkas) ⇒ tulis lewat **berkas `.js` kecil di `tools/`**.
3. **Kalau Bapak bilang “hanya catat dan lengkapi panduan.md”** ⇒ ❌ **jangan** kerjakan kodenya.
   Cukup **catat butir b–e** + kerjakan **butir a** (pola K55d).
4. **Setelah memindah blok besar, cari KEMBARANNYA** dan buktikan **jumlah baris sebelum–sesudah**.

**Berkas:** `panduan.md` · `rencanakerja.md` (papan **A → K64** + **B** butir b–e) ·
`agents.md` (bagian **0a00cc**) · `prompt.md` (**K64**) · `CHANGELOG.md` (entri ini).

## 23 September 2026 — ✅ **K63 SELESAI: 🎛 MENU HALAMAN BACA DIRAPIKAN (2 BARIS · JUDUL DI-FREEZE)**

> 💬 **Bapak (arahan awal):** *“posisi sekarang menu seperti ini `[🏠][Wahyu ▾][22 ▾][◀][▶][↩][📋 PILIH][🔍 Cari][📤][🖊]`
> Panjang harus dirapihkan · ⚙ Pengaturan > pilih model buka alkitab dengan menu **pulldown / Pilih** ·
> hanya **merapihkan menu tidak ada ubah sistem**.”*
>
> 💬 **REVISI BAPAK (sesudah melihat versi pertama — belum sesuai):** *“ternyata **bisa rapih tanpa
> harus diatur pada ⚙ Pengaturan** · **1.** ⚙ Pengaturan untuk pilih **di hilangkan lagi** ·
> **2.** masuk ke alkitab menu di atas adalah `[🏠][ 1 Samuel ▾ ] [📋 PILIH] [🔍 Cari] [📤] [🖊]`
> · `1 Samuel [ 7 ▾ ] [ ◀ ] [ ▶ ] 17 ayat` · jadi **user tetap bisa pilih kitab > pulldown
> `[ 1 Samuel ▾ ]` atau `[📋 PILIH]`** … **tidak ada perubahan metode/konsep.. ini hanya tata letak
> yg efisien**.”*

⚠️ **INI PERAPIAN TAMPILAN — ❌ BUKAN perubahan cara kerja.** Semua fungsi (🏠 · ◀ ▶ · ↩ · 📋 PILIH ·
🔍 Cari · 📤 · 🖊 · ganti kitab dari kotak ▾ · klik angka ayat) **tetap sama**.

### 📐 Bentuk FINAL: 2 baris + judul di-freeze (tanpa pilihan di ⚙)

```text
SEBELUM (1 baris panjang — 8 tombol + 2 kotak pilihan)
[🏠][Wahyu ▾][22 ▾][◀][▶][↩][📋 PILIH][🔍 Cari][📤][🖊]

SESUDAH  ← seluruh navbar + judul DI-FREEZE (tidak ikut menggulir)
[🏠] [ 1 Samuel ▾ ] [📋 PILIH] [🔍 Cari] [📤] [🖊]
1 Samuel   [ 7 ▾ ]  [◀] [▶] [↩]                         17 ayat
1  Lalu orang-orang Kiryat-Yearim datang, mereka mengangkut tabut TUHAN …
```

### ✅ Hasil terukur (klik NYATA di `ANodes-1berkas.html`, 1 Samuel 7)

| Hal | Bukti |
|---|---|
| Navbar **2 baris di SEMUA lebar** | terukur pada **272 · 288 · 307 · 384 px** → baris 1 **38px** + baris 2 **38px** (navbar **85–88px**) |
| Baris 1 | **5 tombol + 1 kotak kitab** |
| Baris 2 | **1 Samuel** · [ 7 ▾ ] · ◀ ▶ ↩ · **17 ayat** |
| Navbar **di-freeze** | `flex-shrink: 0` · di luar `#baca-isi` (yang menggulir = daftar ayat saja) |
| **Ganti kitab dari 2 pintu** | kotak ▾ (pilih Mazmur ⇒ **Mazmur 1**) **dan** 📋 PILIH — dua-duanya hidup |
| ❌ tanpa perubahan cara kerja | 8 tombol + 2 kotak pilihan tetap ada · K20 · ◀ ▶ · ↩ semua hidup |
| Uji | **587 uji, 0 gagal** — 22 uji baru **K63-01…K63-22** |
| Penanda versi | Alkitab **`v23Sep-j` → `v23Sep-k`** · halaman **`v23Sep-k`** |
| HP | `ANodes-1berkas.html` **25,08 MB** |
| Backup | `backups/k63b-kitab-di-baris1-20260923-164850/` |

### 🔴 PELAJARAN BARU (diukur — inilah sebab versi pertama belum rapi)

Kotak `<select>` **TIDAK MAU menyusut** kalau `min-width` masih besar, dan `flex: 1 1 …`
(hanya **tumbuh**) membuatnya **mendorong** 🔍 Cari / 📤 / 🖊 ke baris berikutnya ⇒ navbar jadi
**3 baris** (bukan 2). **Obatnya: `min-width: 0` + lebar tetap (`width`).**
Di layar sangat sempit, **📋 PILIH & 🔍 Cari jadi IKON SAJA** (arti tetap di `title`, pola sama I-15)
⇒ baris 1 tetap **1 baris**.

⚠️ ❌ **JANGAN** memakai `overflow-x: auto` di navbar (pelajaran K18) — anak yang menonjol bisa
**terpotong**. Navbar sekarang `overflow: visible` (diuji **K63-22**).

ℹ️ **Catatan angka:** sketsa Bapak menulis *“1 Samuel [7] **28 ayat**”* — pada data (TB),
**1 Samuel 7 = 17 ayat**; yang 28 ayat adalah **1 Samuel 1**.

**Berkas:** `index.html` (navbar dibelah 2 baris · `#status-tahap` → `v23Sep-k`) ·
`css/app.css` (`.ay-nav-b1` · `.ay-nav-b2` · `.ay-nav-kitab` · `.ay-nav-jml` · `.ay-judul-samar` ·
`.ay-meta-samar` · media query `.ay-lbl`) · `js/setting.js` & `js/editor.js` (**pilihan cara buka DIHAPUS**) ·
`plugin/alkitab/tampilan.js` (`segarkanBaris2` · `VERSI` → **`v23Sep-k`**) ·
`plugin/alkitab/plugin.js` (**versi 1.2**) · `tools/uji-cepat.js` (**K63-01…22**).

## 23 September 2026 — ✅ **K61 SELESAI: 🎛 GARIS VERTIKAL TIDAK LAGI MEMAKAN RUANG TULIS**

> 💬 **Bapak:** *“saya masih menemukan garis vertikal yg mengecilkan ruang tulis bisa di
> hilangkan garis ada warna biru, orange saya tidak terlalu ingat.. tapi tolong cek ulang
> dihilangkan ..untuk dibaca dihp lebih nyaman tidak sempit mengakibatkan tulisan jadi sedikit..
> apalagi setting saya ukuran font besar..karena usia”*

### 🎯 Bentuk yang dipakai: garis **tetap ada**, tetapi **0px ruang**

```css
/* ❌ SEBELUM — garis MEMAKAN ruang tulis (teks tergeser ke kanan) */
.kotak { border-left: 3px solid #1565c0; padding: 7px 9px; }

/* ✅ SESUDAH (K61) — tampilan SAMA, ruang tulis bertambah */
.kotak { border: 0; box-shadow: inset 3px 0 0 #1565c0; padding: 7px 9px; }
```

**11 tempat** yang diperbaiki (garis **biru · hijau · cokelat** — itulah yang terlihat):
blok kaitan · kotak pratinjau kaitan · kotak ayat grup · kotak penguat · judul bagian naskah ·
kutipan (mode baca & menu [Doc]) · judul kelompok plugin · **turunan kaitan** ·
**turunan blok halaman kerja** · kotak daftar kaitan · kotak pratinjau halaman kerja.

➕ **turunan** kini ❌ **tidak lagi memakai `margin-left`/`padding-left`** — dulu 8px & 12px
hilang dari lebar kolom (pelajaran K51: jangan menandai turunan dengan indentasi).

### 🐞 CACAT BESAR yang IKUT KETEMU

Teks ayat di kotak kaitan **tidak membungkus** (1 baris panjang · **TERPOTONG** di kanan).
Sebabnya: `.at-hias` (wadah tombol, dibuat 22 Sep) memaksa **`white-space: nowrap`** — dan
`white-space` **mewarisi** ke seluruh isi wadah, termasuk teks pratinjau.

**Perbaikan:** `nowrap` dibuang dari wadah (hanya tombolnya yang perlu `nowrap`) · teks kotak
kaitan dipaksa `white-space: normal` · `.at-hias` balik **`display: block`** saat daftar terbuka
(kelas `.at-hias-penuh`).

### ✅ Hasil terukur (font besar 20px — setelan Bapak)

| Hal | Bukti |
|---|---|
| Garis tetap terlihat | `box-shadow: rgb(26,115,232) 3px 0 0 0 inset` |
| Garis 0px ruang | `border-left: 0px` |
| Teks membungkus | tinggi teks **165px** vs 1 baris **23,6px** (font normal) · **236px** (font 20px) |
| Tidak ada terpotong | **0** elemen melampaui wadah |
| Halaman baca & catatan | **0** elemen bergaris tebal |
| Uji | **559 uji, 0 gagal** — 11 uji baru **K61-01…11** |
| Versi | halaman **`v23Sep-j`** · Ayat Terkait **`v23Sep-j`** |
| HP | `ANodes-1berkas.html` **25,01 MB** |

**Berkas:** `css/app.css` · `plugin/ayat-terkait/tampilan.js` · `index.html` · `tools/uji-cepat.js`.
**Backup:** `backups/k61-garis-vertikal-20260923-143000/`.

## 23 September 2026 — ✅ **K62 SELESAI: 📖 NAMA KITAB TIDAK LAGI DISEROBOT KAMUS**

> ⚠️ Cacat ini **ketemu sendiri saat verifikasi** (bukan laporan langsung).

**Gejala:** menulis **“Mazmur 23:1”** di catatan ⇒ **tidak menjadi tautan ayat** (tombol 🔗 / 🖊
juga ikut hilang); kata “Mazmur” malah menjadi **istilah kamus**.

### 🔎 Sebab (diukur)

**5 nama kitab juga entri kamus:** `Hakim-Hakim` · `Mazmur` · `Amsal` · `Kisah Para Rasul` · `Ibrani`.
Saat pengguna **masih mengetik**, penandaan istilah lebih dulu mengubah “Mazmur” menjadi
`span.kamus-istilah` ⇒ teks `Mazmur 23:1` **TERPECAH** ⇒ mesin Alkitab tidak lagi menemukan
pola rujukan ⇒ **tautan ayat hilang**.

**Bukti pembanding:** dengan plugin 📚 Kamus **dilepas**, “Mazmur 23:1” **langsung jadi tautan**.

### 📊 Ukur dulu sebelum memutuskan aturan

Dihitung di **seluruh 31.102 ayat**: ke-5 nama kitab itu muncul **0 kali** diikuti pola rujukan
(`angka` `:` / `.`) — sementara kemunculan biasa tetap banyak: **Mazmur 60×** · **Ibrani 48×** ·
**Amsal 4×**. ⇒ Aturan “lewati bila diikuti angka” **0 dampak** pada penandaan yang sah.

### 🔧 Perbaikan (aturan tersempit — dipasang di DUA jalur)

```js
const NAMA_KITAB_KAMUS = ['hakim-hakim','mazmur','amsal','kisah para rasul','ibrani'];
const POLA_RUJUKAN_AYAT = /\s*\d{1,3}\s*[:.]/;
if (NAMA_KITAB_KAMUS.indexOf(tulisan.toLowerCase()) >= 0 &&
    POLA_RUJUKAN_AYAT.test(teks.slice(akhir, akhir + 8))) continue;
```
`plugin/kamus/kamus.js` (kamus bawaan) **dan** `plugin/kamus/tampilan.js` (istilah pribadi).

### ✅ Hasil (mengetik SUNGGUHAN)

| Kalimat | Hasil |
|---|---|
| “Baca **Mazmur 23:1** hari ini.” | tautan **1** · tombol 🖊 **1** · istilah **0** |
| “**Ibrani 11:1** dan **Amsal 3:5** penting.” | tautan **2** · tombol 🖊 **2** |
| “Baca **Kisah Para Rasul 2:1** ya.” | tautan **1** · tombol 🖊 **1** |
| “Kitab **Mazmur** dan surat **Ibrani** indah.” | ✅ **tetap istilah** (tanpa angka) |
| Console | **BERSIH** |
| Uji | **565 uji, 0 gagal** (5 uji baru **K62-01…05**) |
| Kamus | **`v21Sep-h` → `v23Sep-j`** |

**Berkas:** `plugin/kamus/kamus.js` · `plugin/kamus/tampilan.js` · `tools/uji-cepat.js`.
**Backup:** `backups/k62-nama-kitab-disamarkan-kamus-20260923-153000/`.

> 📌 **Cacat LAIN yang masih terbuka:** “Hakim-Hakim 3:1” sebagai rujukan **kedua** dalam satu
> kalimat tidak jadi tautan — terbukti juga gagal **tanpa** plugin Kamus, jadi ini di mesin
> Alkitab (`potongTeks`). Dicatat di papan IDE.

## 23 September 2026 — 🎛 **K61 REVISI: GARIS VERTIKAL DIHAPUS SAMPAI BERSIH (7 halaman)**

> 💬 **Bapak:** *“masih ada terutama di ayat terkait.. bisa dihilangkan”*

⇒ **Garis vertikal DIHAPUS sama sekali** (❌ bukan cuma dijadikan 0px). Pembeda bagian
sekarang = **latar warna tipis** (biru muda / hijau muda / krem) + sudut membulat:
blok kaitan · kotak pratinjau · kotak ayat grup · kotak penguat · judul bagian naskah ·
kutipan · judul kelompok plugin · blok aktif (halaman baca & halaman kerja).

### 🐞 CACAT KEDUA yang ketemu (lebih penting)

**Setelah mengetik, tombol `🖊` tidak menempel** — padahal tautan ayat muncul; tombol baru
muncul kalau catatan dibuka ulang.

**Sebab:** `plugin/alkitab/alkitab.js → pasangOtomatis()` memanggil `tandaiAyat()` **langsung**
pada penandaan susulan (saat `input` & `focus`) ⇒ sambungan resmi
`ANodesEditor.jalanPenghiasTanda()` **tidak ikut jalan**.

**Perbaikan:** penandaan susulan lewat `tandaiSekarang()` = `tandaiAyat()` **lalu**
`ANodesEditor.jalanPenghiasTanda({editor})`.

### ✅ Hasil

| Hal | Bukti |
|---|---|
| **0 garis vertikal** | dipindai di **7 halaman**: catatan · baca · kerja · penguat · kamus · sejarah · [Doc] |
| Tombol 🖊 saat mengetik | **tautan 1 · tombol 1** (uji **K61-12**, klik nyata) |
| Klik 🖊 | kotak krem terbuka (`rgb(250,246,236)`) · **garis TIDAK ADA** · `border-left 0px` |
| Klik lagi | kotak **0** (tertutup) |
| Uji | **560 uji, 0 gagal** |
| Versi | Alkitab **`v23Sep-j`** · Ayat Terkait **`v23Sep-j`** · halaman **`v23Sep-j`** |
| HP | `ANodes-1berkas.html` **25,02 MB** |

**Berkas:** `css/app.css` · `plugin/alkitab/alkitab.js` · `plugin/alkitab/tampilan.js` ·
`plugin/ayat-terkait/tampilan.js` · `index.html` · `tools/uji-cepat.js`.

## 23 September 2026 — ✅ **K45 i SELESAI: 🖊 PENGUAT MENEMPEL DI CATATAN**

> 💬 **Bapak:** *“proses K45 i ..”* — dikerjakan sesudah isi penguat lengkap
> (**66 kitab · 31.102 ayat = 100 %**, selesai 21 Sep 2026).

### 📐 Bentuk yang dipakai

```text
SEBELUM: penguat hanya bisa dibaca di halaman mandiri (K47) / halaman baca Alkitab (K54)
Catatan:  Baca Yohanes 3:16 hari ini.

SESUDAH (K45 i)
Catatan:  Baca Yohanes 3:16 🖊 hari ini.
                        │ diklik
                        ▼
          ┌──────────────────────────────────────┐
          │ 🖊 Perhatikan bahwa begitu besar …   │  ← kotak krem, TIDAK tersimpan
          └──────────────────────────────────────┘
```

⚠️ **BEDA dari dua yang sudah ada** — jangan dicampur:
**K47** = halaman **mandiri** Pembaca Penguat · **K54** = halaman **baca Alkitab** ·
**K45 i** = tombol `🖊` **DI DALAM CATATAN** (menempel pada tiap tautan ayat).

### ⚙️ Yang dikerjakan

| Bagian | Pelaksanaan |
|---|---|
| Sambungan resmi BARU | **`ANodesEditor.tambahPenghiasTanda/lepasPenghiasTanda/jalanPenghiasTanda/segarkanTanda`** — pola SAMA seperti `tambahPenghias()` halaman baca ⇒ editor **tidak perlu tahu** plugin 🖊 ada |
| Kapan jalan | `tandaiSemuaTanda()` memanggil `jalanPenghiasTanda({editor})` **sesudah** ayat & istilah selesai digambar |
| Tombol | `<span class="pg-catatan-sisip">…<button class="pg-catatan-toggle">🖊</button></span>` — disisipkan tepat **setelah** `span.ay-link` yang punya penguat |
| Kotak | `span.pg-catatan-kotak` — latar `#faf6ec`, **huruf = huruf catatan**, `white-space: pre-wrap` |
| Istilah di kotak | kotak memanggil `ANodesKamusTampilan.hiasAyat()` ⇒ kata istilah di dalam penguat **bisa diklik** |
| Tidak tersimpan | `bersihSemuaTanda()` ikut membuang `.pg-catatan-sisip` & `.pg-catatan-kotak` |
| Pilihan cara | halaman keterangan plugin: **🖊 Tombol di catatan (bawaan)** ⇄ **🚫 Matikan tombol 🖊** (`anodes-penguat-catatan`) |
| Pintu halaman mandiri | tombol **📖 Halaman Pembaca Penguat** (`tombolInfo`) — **K47 tetap ada** |
| Aman | plugin dilepas ⇒ tombol & kotak hilang · **catatan & tautan ayat UTUH** |

### 🐞 LIMA CACAT NYATA yang ketemu saat menguji (jangan diulang)

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | Bentuk **`data-ref` ditebak** (`{kitab,pasal,ayat,akhir}`) | `refTautan()` = `null` ⇒ **0 tombol** | bentuk asli `{no,nama,singkatan,pasal,ayat1,ayat2}` |
| 2 | `labelRef()` memakai bentuk SALAH | label jadi **“undefined”** | ambil `nama` dari `data-ref` |
| 3 | `hiasCatatan()` tidak membuang hiasan lama | tombol **4× menumpuk** | `bersihkanCatatan()` di awal `hiasCatatan()` |
| 4 | `saatDipasang()` hanya memuat data | **pasang → lepas → pasang** ⇒ tombol tidak muncul | **`siapkanOtomatis()`** dipanggil dari `saatDipasang()` |
| 5 | `simpanCaraCatatan('tutup')` hanya menyimpan pilihan | tombol lama **tetap tertinggal** (“mati 2 · hidup 2”) | mode `tutup` ⇒ `catatanHidup=false` + `bersihkanCatatan()` |

### ✅ Hasil terukur (klik NYATA di `ANodes-1berkas.html`)

| Hal | Bukti |
|---|---|
| Tombol menempel | **2 tautan ⇒ 2 tombol** · tepat di sebelah nama ayat |
| Terlihat bisa diklik | `cursor: pointer` · latar `rgb(250,246,236)` |
| Klik 🖊 | kotak **TERBUKA** · latar `rgb(250,246,236)` · `display:block` · isi = teks penguat ayat itu |
| Tekan 🖊 lagi | kotak **TERTUTUP** |
| Tidak menumpuk | **2 tombol** walau penandaan diulang |
| **Tidak tersimpan** | `bersihSemuaTanda` ⇒ `"Baca Yohanes 3:16 dan Roma 8:28 hari ini."` |
| Sakelar semua | buka ⇒ **2 kotak** · tutup ⇒ **0** |
| Pilihan “matikan” | `tutup` ⇒ **0 tombol** · balik ⇒ **2** |
| Cabut plugin | tombol **0** · kotak **0** · **tautan 2 tetap** |
| Uji | **547 uji, 0 gagal** — 16 uji baru **K45i-01…16** |
| Penanda versi | Penguat **`v22Sep-b` → `v22Sep-c`** |
| HP | `ANodes-1berkas.html` **24,99 MB** |

**Berkas:** `plugin/penguat/tampilan.js` · `plugin/penguat/plugin.js` · `js/editor.js` ·
`css/app.css` · `tools/uji-cepat.js`.

## 23 September 2026 — 📘 **DOKUMENTASI KONSEP & METODE DIPERLENGKAP**

**Tujuan:** `prompt.md` dan `agents.md` adalah **pintu masuk** bagi siapa pun yang membangun
ulang / melanjutkan ANodes. Sebelumnya **konsep & metode** hanya tersebar di riwayat kasus
(K47…K58), sehingga pembaca baru tidak langsung tahu **cara berpikir** sistemnya.

### Yang ditambahkan

| Dokumen | Tambahan |
|---|---|
| **`prompt.md`** | 🔍 **Bagian 0 — KONSEP & METODE INTI**: (0.1) apa itu ANodes · (0.2) batasan teknis yang tidak bisa dinegosiasi · (0.3) arsitektur **7 halaman** + 3 aturan wajibnya · (0.4) penyimpanan dibagi 3 (localStorage/IndexedDB/dokumen) + pola `meta.sidik` · (0.5) sistem plugin + **tabel sambungan resmi** · (0.6) cara penandaan (penandaan vs pengait klik) · (0.7) aturan kerja · (0.8) **metode menguji** · (0.9) **perkakas `tools/` lengkap** · (0.10) **portofolio angka terukur** |
| **`prompt.md` B** | ditambah **dua metode uji wajib** (getComputedStyle + ukur data dulu) |
| **`agents.md`** | **Kotak 🔴 BACA DULU — 3 metode yang berlaku** di kepala berkas · **bagian 0a. KONSEP INTI** (ringkasan: batasan · 7 halaman · penyimpanan · plugin · penandaan · perkakas · angka sistem) · **bagian 0. Aturan Kerja** ditambah rujukan ke `prompt.md` bagian 0 · **bagian 1b** diperbarui (dulu masih menyebut keadaan 15 Sep 2026 & “365 uji”) |
| **`agents.md` kepala** | penanda HP diperbaiki **24,93 → 24,94 MB** |

### Angka yang dilaporkan (terukur, bukan perkiraan)

| Bagian | Ukuran |
|---|---|
| `index.html` | 668 baris |
| `css/` (2 berkas) | 4.405 baris |
| `js/` (6 berkas) | 5.040 baris |
| `plugin/` (22 berkas JS) | 10.770 baris |
| `tools/` (10 berkas) | 8.509 baris |
| **Total kode** (tanpa data) | **±29.400 baris** |
| Data tanam | **±22,9 MB** (Alkitab 5,08 · kaitan 5,21 · penguat 12,40 · kamus 0,13 · sejarah 0,10) |
| `ANodes-1berkas.html` | **24,96 MB** |
| Uji | **531 uji, 0 gagal** |

**Berkas:** `prompt.md` (144,8 KB) · `agents.md` (337,9 KB) — **tidak menyentuh kode aplikasi**,
sehingga perubahannya murni dokumen.

**⚠️ Catatan aturan:** dokumen tetap memakai **sebutan umum di teks yang tampil di layar**
(K48) — sudah diperiksa: **0** kata “Bapak” pada string yang tampil di plugin. ✅

## 23 September 2026 — ✅ **K58 SELESAI: 🔍 CARI DI HALAMAN SEJARAH — KATA KETEMU DIBERI WARNA + ◀ ▶**

> 💬 **Bapak:** *“masih di sejarah · ada fitur ‘cari’ · misal cari kata **“dead sea”** lewat fitur
> ‘cari’ jika ketemu **di beri tanda** pada tulisan “dead sea” dan **next atau preview**.. selama
> fitur cari masih ada tulisan “dead sea” **tanda atau warna** pada tulisan “dead sea” **masih ada**..
> sampai **ditutup atau diganti** .. atau dihilangkan”*

### 🔎 Keadaan SEBELUM (diukur di Chrome)

| Hal | Keadaan |
|---|---|
| Kata yang ketemu | ❌ **tidak diberi warna** — hanya ada daftar cuplikan kalimat di bawah |
| Pindah temuan | ❌ **tidak ada** tombol ◀ ▶ — hanya bisa klik satu per satu dari daftar |
| Ada/tidak temuan | ❌ tidak ada penghitung “3/5” |
| Sorot | ⚠️ menyorot **seluruh paragraf** (latar kuning) ±2,6 detik lalu **hilang sendiri** |

### ⚙️ Yang dikerjakan

| Bagian | Pelaksanaan |
|---|---|
| **Tanda warna** | setiap kata yang ketemu dibungkus `<mark class="sj-cari-hit">` lewat **POTONGAN TEKS (TreeWalker)** — pola sama seperti cari di catatan (`js/editor.js → bungkusDiEditor`) ⇒ tag HTML tidak tersentuh |
| **Tanda TETAP ada** | tidak pakai waktu habis — bertahan **sampai pencarian ditutup, diganti, atau halaman ditinggalkan** |
| **◀ ▶** | tombol sebelumnya/berikutnya di bar cari · **berputar** (setelah temuan terakhir kembali ke pertama) |
| **Penghitung** | `3/5` (`#sj-cari-info`) — mengikuti temuan yang sedang aktif |
| **Warna temuan aktif** | temuan aktif kuning lebih tua + garis oranye; temuan lain kuning muda |
| **Enter** | = temuan **berikutnya** (pola sama seperti cari di catatan) · **Esc** = bersihkan |
| **✕ / Esc / keluar halaman** | tanda **dibuang semua** — halaman kembali seperti semula |
| **Daftar cuplikan** | tetap ada (pelengkap) · diklik ⇒ lompat ke temuan nomor itu |

### ✅ Hasil terukur (KLIK NYATA di Chrome + versi HP)

| Hal | Hasil |
|---|---|
| Cari **“dead sea”** | **1 tanda** · warna **`rgb(255,213,79)`** · penghitung **1/1** |
| Cari **“kitab”** | **79 tanda** — semua kata “kitab” berwarna · penghitung **1/79** |
| Ganti kata | tanda lama **dibuang**, tanda baru muncul (tidak menumpuk) |
| ▶ | `1/79 → 2/79 → 3/79` · temuan aktif bertambah terang |
| ◀ | `3/79 → 2/79` |
| Tanda bertahan | setelah 0,9 detik masih **79 tanda** (dulu hilang sendiri) |
| **✕** | tanda **0** · baris cari tertutup · penghitung kosong |
| **✕ tidak merusak apa pun** | istilah **175** · tautan ayat **9** · teks **16.142 huruf** — **sama persis** · klik istilah “Taurat” **tetap hidup** |
| Uji | **531 uji, 0 gagal** — **K58-01…K58-13 (13 uji baru)** |
| Penanda versi | Sejarah `v22Sep-h` → **`v22Sep-i`** |
| HP `ANodes-1berkas.html` | 24,92 MB → **24,93 MB** |

**Berkas:** `plugin/sejarah/tampilan.js` (`bungkusTemuan` · `bersihkanTandaCari` · `segarkanInfoCari` ·
`keTemuan` · `lompatTemuan` · `daftarCari`/`urutCari` · pengait ◀ ▶ · `VERSI`) ·
`index.html` (tombol `#sj-cari-prev` · `#sj-cari-next` · `#sj-cari-info`) ·
`css/app.css` (`mark.sj-cari-hit` · `.sj-cari-aktif` · `.pg-cari-info`) ·
`tools/uji-cepat.js` (**K58-01…K58-13**).

**⚠️ Pelajaran:** tanda hanya **TAMPILAN** — tidak masuk data, tidak disimpan, dan **wajib dibereskan**
(diuji: setelah ✕ halaman kembali utuh). Penandaan lewat **potongan teks**, ❌ bukan `innerHTML.replace`.

## 23 September 2026 — ✅ **K57 SELESAI: “SEA” DI DALAM “DEAD SEA SCROLLS” TIDAK LAGI DITANDAI**

> 💬 **Bapak:** *“Dead Sea Scrolls <- di ambil arti **sea** · Takaran untuk bahan kering…
> jadi takaran .. ntah apa bisa bedakan **sea < takaran** dengan **dead sea** tentu bukan takaran”*

**🔎 Diukur dulu (❌ bukan diduga):**

| Hal | Angka |
|---|---|
| Entri **“Sea”** di kamus | ✅ **ADA** — “Takaran untuk bahan kering…” (¹⁄₃ **homer**; ± 7,3 liter) |
| Kata “sea”/“Sea” di **seluruh Alkitab** (31.102 ayat) | **0 kali** |
| Kata Inggris umum lain yang ada di kamus | **0** — dari **53** kata diuji (`land` · `water` · `bread` · `lord` · `king` · `light` · `law` · `sin` · `ark` · `temple` …) **hanya `sea`** |
| Munculnya “Dead Sea” | **1×** — di teks sejarah: *“…penemuan Gulungan Laut Mati / **Dead Sea Scrolls** tahun 1947…”* |

**⚠️ Dua aturan yang DICOBA lalu DITOLAK (karena diukur merusak istilah yang sah):**

| Aturan | Kenapa ditolak |
|---|---|
| **“kata sebelumnya berhuruf besar”** | menghapus **24 istilah sah** di teks sejarah — `Kristen` · `Perjanjian Lama` · `Taurat` · `Mazmur` · `Nabi`; juga `Israel` (Yosua) & `TUHAN` (Imamat) |
| **“kata pendek (≤5 huruf) jangan ditandai”** | `Injil` · `Nabi` · `Roh` · `Imam` · `Puasa` · `Sabat` · `Surat` — semuanya **sah & penting** |

**✅ Perbaikan yang dipakai — daftar SEMPIT (`BENTROK_ASING = ['sea']`):**

```js
// kata yang berbenturan dengan nama asing hanya ditandai bila HURUF KECIL
if (BENTROK_ASING.indexOf(tulisan.toLowerCase()) >= 0 &&
    /^[A-Z]/.test(tulisan)) continue;
```

⇒ **“Sea” (nama Inggris) dilewati** · **“sea” (takaran) tetap ditandai**.
Dipakai di **dua jalur**: `plugin/kamus/kamus.js` (`temukanIstilah`) **dan**
`plugin/kamus/tampilan.js` (istilah pribadi).

**✅ Hasil terukur:**

| Hal | Sebelum | Sesudah |
|---|---|---|
| Istilah ditandai di halaman Sejarah | 176 | **175** (tepat 1 dibuang) |
| “Sea” di “Dead Sea Scrolls” | ❌ ditandai (arti takaran — salah) | ✅ **tidak ditandai** |
| “sea” huruf kecil (takaran) | ✅ | ✅ **tetap ditandai** |
| Istilah sah berhuruf besar (`Israel` · `Injil` · `Kristen` · `Taurat` · `Mazmur`) | ✅ | ✅ **tidak ada yang hilang** |
| Jumlah entri kamus | 392 | **392** (tidak diubah) |
| Uji | 511 uji, 0 gagal | **518 uji, 0 gagal** (**K57-01…K57-07**) |
| Penanda versi | kamus `v21Sep-g` | kamus **`v21Sep-h`** · Sejarah `v22Sep-h` |
| HP | 24,91 MB | **24,92 MB** |

**Berkas:** `plugin/kamus/kamus.js` (`BENTROK_ASING` + penjaga di `temukanIstilah`) ·
`plugin/kamus/tampilan.js` (penjaga sama untuk istilah pribadi + `VERSI`) ·
`tools/uji-cepat.js` (**K57-01…K57-07**; uji versi K51-01 & K53-01 dijadikan rentang supaya tidak rapuh).

**📌 Kalau nanti ditemukan kata bentrok baru:** tambahkan ke `BENTROK_ASING`
(**jangan** mengubah aturan umum) supaya istilah Indonesia tetap aman.

## 23 September 2026 — ✅ **K56c SELESAI: SEBAB SEBENARNYA “TAUTAN TIDAK TERLIHAT” (GAYA CSS)**

> Bapak: *“saya perhatikan **uji itu sepertinya sudah baku**.. walau perbaikan atau revisi dan
> km uji itu **tidak menguji di tempat**.. dan sekarang yg saya katakan **belum ada link kamus
> istilah dan ayat alkitab.. masih sama**.. saya mau km **uji di tempat revisi**.”*

⚠️ **Bapak BENAR.** Uji K56 saya hanya **menghitung jumlah elemen** (`querySelectorAll('span.ay-link')`)
— dan angkanya memang **9 tautan + 176 istilah**. Tetapi yang **Bapak lihat** = teks biasa,
sebab elemennya **tidak punya gaya apa pun**.

### 🔎 SEBAB SEBENARNYA (diperiksa di `css/app.css`, ❌ bukan diduga)

| Aturan CSS | Wadah yang disebut | Akibat |
|---|---|---|
| `span.ay-link` | **hanya `#editor`** | di `#sj-isi` tautan **tidak berwarna**, **tanpa garis** ⇒ tampak teks biasa |
| `span.kamus-istilah` | `#editor` · `#baca-isi` · `#pg-isi` | **`#sj-isi` TIDAK disebut** ⇒ istilah tidak bergaris putus |

⇒ Tautan & istilah itu **ADA** di dalam halaman, tetapi **TIDAK TERLIHAT** sebagai tautan.
Tidak ada yang bisa dikenali pengguna ⇒ wajar Bapak bilang *“masih sama”*.

### 🔧 Perbaikan (`css/app.css`) — gaya SAMA dipakai di keempat wadah

```css
#editor span.ay-link,
#baca-isi span.ay-link,
#pg-isi span.ay-link,
#sj-isi span.ay-link { color:#1565c0; border-bottom:1px dotted #1565c0;
                       cursor:pointer; background:#f2f7ff; }

#sj-isi span.kamus-istilah { border-bottom:1px dashed #0a7b2f; cursor:pointer; }
```

### ✅ Hasil terukur (klik NYATA + `getComputedStyle` — ukuran yang MATA lihat)

| Wadah | Sebelum | Sesudah |
|---|---|---|
| `#sj-isi` tautan ayat | ❌ tidak berwarna · tanpa garis | ✅ **`rgb(21,101,192)`** · **garis** `dotted` · kursor `pointer` |
| `#sj-isi` istilah | ❌ tanpa gaya | ✅ **garis** `dashed` **hijau** `rgb(10,123,47)` · kursor `pointer` |
| `#baca-isi` istilah | ✅ | ✅ **13 istilah** bergaris |
| `#pg-isi` istilah | ✅ | ✅ **46 istilah** bergaris |
| Uji | 506 uji, 0 gagal | **511 uji, 0 gagal** (**K56-14 · 14b · 14c · 15 · 15b = 5 uji baru**) |
| Penanda versi | Sejarah `v22Sep-g` | Sejarah **`v22Sep-h`** |
| HP | 24,9 MB | **24,91 MB** |

**Berkas:** `css/app.css` (aturan `ay-link` & `kamus-istilah` untuk `#baca-isi` · `#pg-isi` · `#sj-isi`) ·
`plugin/sejarah/tampilan.js` (`VERSI`) · `tools/uji-cepat.js` (**K56-14…K56-15b**).

### ⚠️⚠️ PELAJARAN PALING PENTING (untuk semua pekerjaan berikutnya)

> **“Menghitung elemen” ≠ “menguji yang terlihat”.**

Uji yang hanya memakai `querySelectorAll(...).length` akan **LULUS** walau elemennya
**tak terlihat** (tanpa gaya, `hidden`, lebar 0, atau tertutup elemen lain).
**Uji tampilan WAJIB memakai `getComputedStyle`** (`color` · `borderBottomStyle` · `cursor`)
— itulah ukuran yang paling dekat dengan **mata pengguna**.
➕ **Uji juga di WADAH TEMPAT REVISI** (halaman sejarah), bukan hanya di catatan.

## 23 September 2026 — ✅ **K56b SELESAI: MEMBERSIHKAN TAUTAN AYAT PALSU (DAFTAR KITAB)**

> Cacat ini **ketemu sendiri saat memverifikasi K56** di Chrome + versi HP (bukan dilaporkan).

**🐞 Cacat:** kalimat daftar kitab di halaman Sejarah —
*“Kitab: Yosua, Hakim-hakim, **Rut, 1** & **2 Samuel, 1** & **2 Raja-raja, 1** & 2 Tawarikh, …”* —
membuat **3 tautan palsu**: **`Rut, 1`**, **`& 2 Samuel, 1`**, **`& 2 Raja-raja, 1`**.
Semuanya menunjuk **ayat 0** (`Rut 1:0`) — ayat kosong, ❌ bukan rujukan.

**🔎 Sebab (diperiksa, ❌ bukan diduga):** di `plugin/alkitab/alkitab.js → POLA`,
pemisah `:` / `.` dan kelompok ayat **opsional**:
`/\b(\d{1,3})(?:\s*([:.])\s*(\d{1,3})…)?/g`
⇒ **angka apa pun** sesudah nama kitab yang dikenali menjadi tautan.

**⚠️ Yang harus DILINDUNGI:** rujukan **pasal-saja yang sah** — terukur di data hanya **5**:
`Amsal 31` · `Daniel 9` · `Kisah 16` · `Mazmur 2` · `Yesaya 53`
(contoh nyata: *“…ditutup dengan pujian terhadap istri yang cakap **(Amsal 31)**…”*).

**🔧 Perbaikan (1 aturan kecil, ❌ tanpa mesin baru):** rujukan **tanpa** `:`/`.` yang
**dipisahkan KOMA / titik-koma** dari nama kitabnya = **bagian dari DAFTAR**, bukan ayat ⇒ ditolak.

```js
if (!m[2]) {                                  // rujukan tanpa pemisah : atau .
  const antara = teks.slice(mulai, iAngka);   // teks antara nama kitab ⇄ angka
  if (/[,;]/.test(antara)) continue;          // ada koma/titik-koma ⇒ DAFTAR ⇒ tolak
}
```

**✅ Hasil terukur:**

| Hal | Sebelum | Sesudah |
|---|---|---|
| Tautan di halaman Sejarah | **12** | **9** |
| Tautan palsu (`Rut, 1` · `& 2 Samuel, 1` · `& 2 Raja-raja, 1`) | ❌ **3** | ✅ **0** |
| Rujukan menunjuk **ayat 0** | ❌ 3 | ✅ **0** |
| Istilah di teks sejarah | 176 | **176** (tidak terpengaruh) |
| `Amsal 31` · `Daniel 9` · `Yesaya 53` (pasal-saja SAH) | ✅ hidup | ✅ **tetap hidup** |
| Ayat biasa di catatan (`Yohanes 3:16` · `Roma 8:28`) | ✅ | ✅ **tetap hidup** |
| Uji | 500 uji, 0 gagal | **506 uji, 0 gagal** (**K56-12…K56-13c = 6 uji baru**) |
| Penanda versi | Alkitab `v22Sep-e` · Sejarah `v22Sep-f` | Alkitab **`v22Sep-f`** · Sejarah **`v22Sep-g`** |
| HP `ANodes-1berkas.html` | 24,89 MB | **24,9 MB** |
| Backup | — | `backups/k56b-tolak-tautan-palsu-20260923-121500/` |

**Berkas:** `plugin/alkitab/alkitab.js` (`potongTeks` — aturan penolak daftar) ·
`plugin/alkitab/tampilan.js` (`VERSI`) · `plugin/sejarah/tampilan.js` (`VERSI`) ·
`tools/uji-cepat.js` (**K56-12 · 12b · 12c · 13 · 13b · 13c**).

**⚠️ PELAJARAN:** rujukan **pasal-saja** jangan langsung dilarang — periksa dulu apakah
**sah** (`Amsal 31`). Cacatnya bukan pada “tanpa pemisah”, tetapi pada **pemisah koma/titik-koma**
yang menandakan **daftar**.

## 23 September 2026 — ✅ **K56 SELESAI: 🔗 TAUTAN AYAT + ISTILAH DI HALAMAN SEJARAH ALKITAB**

> Bapak: *“Pengantar Sejarah Alkitab: Bagaimana Firman Menjadi Tulisan .. ada **kamus istilah dan
> link alkitab belum berfungsi** .. **ulangan 24:4-6 belum ada link** .. kamus istilah juga belum berfungsi”*

**🔎 Diagnosa (diukur di Chrome, ❌ bukan diduga):** teks halaman sejarah **belum pernah ditandai** —
terukur `span.ay-link` = **0** dan `span.kamus-istilah` = **0**, padahal teksnya memuat
“Ulangan 34:5-6”, “Yesaya 45:1”, “Taurat”, “Tuhan”, “Nabi”. Mesin penandanya sebenarnya **sudah ada
dan bekerja** (bukti: `potongTeks('…Ulangan 34:5-6…')` → 3 tautan benar) — yang kurang hanya
**pintunya belum dibuka** untuk halaman ini.

**⚠️ Catatan ke Bapak:** rujukan **“Ulangan 24:4-6” TIDAK ADA** di teks data (sudah diperiksa di
`plugin/sejarah/data/sejarah.js` **dan** di berkas sumber `cat\Pengantar Sejarah Alkitab…md`).
Yang ada: **Ulangan 34:5-6** (+ **Ulangan 34:10**) — persis kutipan “kematian dan penguburan Musa”
yang Bapak sebutkan. ⇒ kemungkinan Bapak maksud ayat itu.

**Yang dikerjakan (❌ tanpa mesin baru):**

| Bagian | Pelaksanaan |
|---|---|
| **Tautan ayat** | mesin Alkitab dapat pintu baru **`tandaiWadahHalaman(wadah)`** — penandaan untuk **halaman baca-saja** (❌ tanpa kursor, ❌ tanpa `normalize()`, jadi lebih aman: tanda plugin lain tetap utuh) |
| **Klik tautan ayat** | pintu **`pasangKaitAyatHalaman(wadah,'sejarah')`** — pengait klik generik untuk halaman mana pun (sebelumnya hanya `#editor`) |
| **Kembali 🏠** | **`daftarPemulihHalaman(jenis, fn)`** + `ingatAsalAyat()` — tombol 🏠 di halaman baca membawa **kembali ke halaman asal** (pola SAMA seperti K43 untuk kamus) |
| **Istilah** | plugin Kamus dapat pintu **`tandaiHalaman(wadah)`** — sekaligus memasang **pengait klik-nya** (⚠️ penandaan saja TIDAK cukup, pelajaran K52) |
| **Halaman sejarah** | `hiasHalamanSejarah()` dipanggil tiap isi digambar; `bersihkanTandaHalaman()` saat meninggalkan halaman/plugin dilepas |

**Bukti terukur (klik NYATA di Chrome + versi HP):**

| Hal | Hasil |
|---|---|
| Tautan ayat di teks sejarah | **12 tautan** hidup (dulu **0**) |
| Istilah di teks sejarah | **176 istilah** hidup (dulu **0**) |
| **Klik “Ulangan 34:5-6”** | ⇒ halaman baca pindah ke **Ulangan 34:5** (ayatnya disorot) · halaman sejarah **tersembunyi rapi** |
| **🏠 dari halaman baca** | ⇒ **kembali KE HALAMAN SEJARAH** (bukan ke catatan) · **66 chip utuh** |
| **Klik istilah “Taurat”** | ⇒ halaman istilah terbuka (**keterangan 458 huruf**) |
| **🏠 dari kamus** | ⇒ **kembali ke halaman SEJARAH** |
| Catatan (editor) | **tidak terganggu** — 1 tautan + 1 istilah tetap ditandai seperti biasa |
| Uji | **500 uji, 0 gagal** — blok **K56: 16 uji** semuanya LULUS |
| Penanda versi | Tampilan Sejarah **`v22Sep-f`** · Tampilan Alkitab **`v22Sep-e`** |
| HP | `ANodes-1berkas.html` **24,89 MB** |
| Backup | `backups/k56-tautan-halaman-sejarah-20260923-113355/` |

**🐞 2 cacat nyata saat menguji (jangan diulang):**

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | Pengait klik memanggil **pusat perantara yang tidak pernah dipasang** (`window.__anodesAsalAyat.ingat`) | penanda halaman asal tidak terbentuk ⇒ tombol 🏠 kembali ke **catatan**, bukan ke halaman sejarah | panggil **langsung** `ingatAsalAyat()` |
| 2 | Halaman asal **tidak disembunyikan** (halaman baca & sejarah tampil bersamaan) | halaman menumpuk | sembunyikan `wadah.closest('.app')` sebelum pindah (pola `pindahKeBaca()` hanya menutup `#app-utama`) |
| 3 | Istilah ditandai tetapi **pengait klik belum dipasang** di `#sj-isi` | “klik kosong” — tanda bergaya tapi mati | `tandaiHalaman()` **wajib** memanggil `pasangKaitHalaman()` |

⚠️ **PELAJARAN:** “**sudah ditandai**” ≠ “**sudah bisa diklik**” — pelajaran K52 terulang; penandaan
dan pengait klik adalah **dua hal terpisah** dan harus dipasang di wadah yang sama.

**Berkas:** `plugin/alkitab/alkitab.js` (`tandaiWadahHalaman` · `bersihTandaWadah`) ·
`plugin/alkitab/tampilan.js` (`pasangKaitAyatHalaman` · `daftarPemulihHalaman` · `ingatAsalAyat` ·
`adaAsalAyat` · `kembaliKeHalamanAsalAyat` · `kembali()` diperluas · `VERSI` → **`v22Sep-e`**) ·
`plugin/kamus/tampilan.js` (`tandaiHalaman` · `halamanUntukWadah` · pengait `#sj-isi` ·
`tutupHalaman`/`ingatAsalHalaman`/`kembaliKeHalamanAsal` mengenal `sejarah`) ·
`plugin/sejarah/tampilan.js` (`hiasHalamanSejarah` · `bersihkanTandaHalaman` · `pulihDariAlkitab` ·
`VERSI` → **`v22Sep-f`**) · `tools/uji-cepat.js` (**K56-01…K56-11b** · 16 uji).

⏭️ **BERIKUTNYA = K45 i** — sistem plugin penguat **yang menempel di catatan**.

---

## 23 September 2026 — ✅ **K55c SELESAI: 📖 SEJARAH ALKITAB (PRAKATA) DI HALAMAN SENDIRI** (6/6 butir)

> Bapak: *“saya mau ubah konsep dari k55c. Jika klik [🧩▼] <- muncul semua plugin.
> 1. catatan plugin sejarah sudah di tempelkan. 2. sekarang plugin [sejarah] > klik **kosong**.
> 3. disini sejarah **“alkitab” (bukan kitab2)** di tampilkan. apakah arahan ini cukup jelas ?”*
>
> ➕ **PENEGASAN BAPAK (jangan salah catat):** *“saya **tidak mengeluh klik kosong** justru saya mau
> **manfaatkan untuk tempat user bisa baca sejarah alkitab < prakata**.. **sejarah perkitab sudah
> ada disetiap kitab dalam alkitab**”* ⇒ ✅ **pintu plugin DIMANFAATKAN** — bukan memperbaiki kerusakan.

**Pembeda yang penting (jangan dicampur):**

| | Keadaan |
|---|---|
| 📖 **Sejarah PER KITAB** | ✅ **sudah ada** — tombol `📖 sejarah` di pasal 1 tiap kitab (K55/K55b) · ❌ tidak diubah |
| 📜 **Sejarah ALKITAB keseluruhan (PRAKATA)** | ⬅️ **belum ada pintunya** — teks 15.356 huruf masih menempel di halaman baca Alkitab |
| 🔑 **Pintu plugin `[sejarah]`** | ⬅️ **dimanfaatkan** untuk membaca prakata itu di **halaman sendiri** |

**📖 Sebab pintunya belum berisi (diperiksa di kode, ❌ bukan diduga):** plugin 📖 Sejarah Kitab
**belum punya `tombolBuka` & `buka()`**, padahal plugin lain semuanya punya
(📖 Alkitab · 🔗 Ayat Terkait · 📚 Kamus · 🖊 Penguat) ⇒ butir **K55c-a** = tambahkan keduanya.

**Konsep yang dipakai (jawaban Bapak atas 3 pertanyaan):**

| # | Hal | Jawaban Bapak |
|---|---|---|
| 1 | 66 chip kitab di bawah teks pengantar | ✅ **tetap ada** — diklik ⇒ **pindah ke pasal 1 kitab itu** di Alkitab |
| 2 | Tempat tampil | ✅ **HALAMAN BARU SENDIRI (halaman ke-6)** |
| 3 | Tombol `📖 sejarah` di pasal 1 Alkitab | ✅ **tetap dipertahankan** |

```text
SEBELUM (belum ada pintu)          SESUDAH (1 klik ⇒ langsung terbaca)
🧩▼ → 📖 Sejarah Kitab             🧩▼ → 📖 Sejarah Kitab
   ⇒ belum membuka apa pun             ▼
                                   [🏠] 📖 SEJARAH ALKITAB               [🔍]
                                        Bagaimana Firman menjadi tulisan · 66 kitab · v22Sep-e
                                        📚 Taurat (5) [1. Kejadian][2. Keluaran] …
                                        📚 Injil (4)  [40. Matius][41. Markus] …
                                        (chip diklik ⇒ pasal 1 kitab itu di Alkitab)
```

**Yang dikerjakan (6 butir selesai semua):**

| Butir | Hasil |
|---|---|
| **a** | `tombolBuka: '▶ Buka'` + `buka()` di `plugin/sejarah/plugin.js` ⇒ pintu bekerja |
| **b** | Halaman ke-6 `#sejarah-halaman` di `index.html` (anak `body`, `.app` 480px) + navbar `[🏠][judul][🔍]` **1 baris** |
| **c** | `bukaPengantar()` dipindah ke halaman mandiri (❌ tidak lagi di halaman baca Alkitab) · chip kitab ⇒ pasal 1 kitab itu di Alkitab |
| **d** | Tombol halaman keterangan plugin (`tombolInfo[]`) diarahkan ke halaman mandiri (panel gudang ikut tertutup) |
| **e** | Aman (`saatDilepas` ⇒ halaman ditutup & isi dikosongkan) · `VERSI` `v22Sep-d` → **`v22Sep-e`** · **bonus 🔍 cari di dalam teks sejarah** |
| **f** | Uji **K55c-01…K55c-12c (20 uji)** + build sekali + dokumen |

**Bukti terukur (Chrome nyata + versi HP):**

| Hal | Hasil |
|---|---|
| 1 klik pintu `[📖 Sejarah]` | ⇒ halaman terbuka, **catatan tersembunyi** |
| Judul & meta | **📖 Sejarah Alkitab** · “Bagaimana Firman menjadi tulisan · 66 kitab · v22Sep-e” |
| Isi | **16.142 huruf** · **88 paragraf** · **66 chip** · **9 kelompok** |
| ❌ tanpa “pilih kitab dulu” | **0** elemen `select` di navbar (konsep lama dibuang) |
| Chip kitab diklik | ⇒ **Kejadian 1** di halaman baca (tombol `📖 sejarah` hadir) |
| 🔍 cari `kanon` | **4 temuan** (diklik ⇒ gulir + sorot) |
| Tombol 🏠 / Esc / Ctrl+B | ⇒ halaman ditutup, catatan tampil lagi |
| Navbar | **1 baris 43px** · halaman **anak `body`** (❌ bukan di dalam `#app-utama`) |
| Plugin dilepas | ⇒ halaman ditutup & isi dikosongkan · **catatan & isi Alkitab UTUH** |
| Dipasang lagi | ⇒ pintu bekerja kembali (66 chip) |
| Uji | **484 uji, 1 gagal** — yang 1 itu **GAGAL PALSU** (label memuat tanda silang, sudah dibuang) · blok **K55: 38 uji** + **K55c: 20 uji** — **0 gagal** |
| Penanda versi | Tampilan Sejarah **`v22Sep-e`** |
| HP | `ANodes-1berkas.html` **24,86 MB** |
| Backup | `backups/k55c-pintu-plugin-sejarah-20260923-105641/` |

**🐞 CACAT NYATA saat menguji (jangan diulang):**

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | Label uji **K55c-05 memuat tanda silang** | dihitung **GAGAL PALSU** (penyaring kegagalan memakai `includes('❌')`) | tanda silang dibuang dari label — **pelajaran LAMA yang terulang** |
| 2 | Uji dijalankan **dua kali berturut-turut tanpa reload penuh** | suite kedua menggantung (dua proses menulis variabel hasil bersamaan) | cukup **satu kali** + `page.reload()` sebelum menjalankan ulang |

**Berkas:** `plugin/sejarah/plugin.js` (versi **1.2** · `tombolBuka` + `buka()` + keterangan diperbarui) ·
`plugin/sejarah/tampilan.js` (`VERSI` **`v22Sep-e`** · `buka` · `bukaHalaman` · `tutupHalaman` ·
`gambarPengantar` · `bukaKitabDariChip` · `pasangPengait` · `mulaiCari` · `sorotTemuan` · `bersihkan`) ·
`index.html` (`#sejarah-halaman` + navbar + kotak cari) · `css/app.css` (`.halaman-sejarah` · `.sj-nav`) ·
`tools/uji-cepat.js` (**K55c-01…K55c-12c** · K55-16d/17/17b/17c disesuaikan).

⏭️ **BERIKUTNYA = K45 i** — sistem plugin penguat **yang menempel di catatan** (papan **B urut 2**).

---

## 23 September 2026 — 🔄 **KONSEP K55c DIUBAH: 📖 SEJARAH ALKITAB (PRAKATA) DI HALAMAN MANDIRI** (rencana dicatat — belum dikerjakan)

> Bapak: *“saya mau ubah konsep dari k55c. Jika klik [🧩▼] <- muncul semua plugin.
> 1. catatan plugin sejarah sudah di tempelkan. 2. sekarang plugin [sejarah] > klik **kosong**.
> 3. disini sejarah **“alkitab” (bukan kitab2)** di tampilkan. apakah arahan ini cukup jelas ?”*
>
> ➕ **PENEGASAN BAPAK (jangan salah catat):** *“saya **tidak mengeluh klik kosong** justru saya mau
> **manfaatkan untuk tempat user bisa baca sejarah alkitab < prakata**.. **sejarah perkitab sudah
> ada disetiap kitab dalam alkitab**”* ⇒ ✅ **pintu plugin DIMANFAATKAN** — bukan memperbaiki kerusakan.

**Pembeda yang penting (jangan dicampur):**

| | Keadaan |
|---|---|
| 📖 **Sejarah PER KITAB** | ✅ **sudah ada** — tombol `📖 sejarah` di pasal 1 tiap kitab (K55/K55b) |
| 📜 **Sejarah ALKITAB keseluruhan (PRAKATA)** | ⬅️ **belum ada pintunya** — teks 15.356 huruf masih menempel di halaman baca Alkitab |
| 🔑 **Pintu plugin `[sejarah]`** | ⬅️ **dimanfaatkan** untuk membaca prakata itu di **halaman sendiri** |

**📖 Sebab pintunya belum berisi (diperiksa di kode, ❌ bukan diduga):** plugin 📖 Sejarah Kitab
**belum punya `tombolBuka` & `buka()`**, padahal plugin lain semuanya punya
(📖 Alkitab · 🔗 Ayat Terkait · 📚 Kamus · 🖊 Penguat) ⇒ butir **K55c-a** = tambahkan keduanya.

**Konsep yang dipakai (jawaban Bapak atas 3 pertanyaan):**

| # | Hal | Jawaban Bapak |
|---|---|---|
| 1 | 66 chip kitab di bawah teks pengantar | ✅ **tetap ada** — diklik ⇒ **pindah ke pasal 1 kitab itu** di Alkitab |
| 2 | Tempat tampil | ✅ **HALAMAN BARU SENDIRI (halaman ke-6)** |
| 3 | Tombol `📖 sejarah` di pasal 1 Alkitab | ✅ **tetap dipertahankan** |

```text
SEBELUM (belum ada pintu)          SESUDAH (1 klik ⇒ langsung terbaca)
🧩▼ → 📖 Sejarah Kitab             🧩▼ → 📖 Sejarah Kitab
   ⇒ belum membuka apa pun             ▼
                                   [🏠] 📖 SEJARAH ALKITAB (PRAKATA)
                                        Bagaimana Firman menjadi tulisan (15.356 huruf)
                                        📚 Taurat (5) [1. Kejadian][2. Keluaran] …
                                        📚 Injil (4)  [40. Matius][41. Markus] …
                                        (chip diklik ⇒ pasal 1 kitab itu di Alkitab)
```

❌ **Tidak dipakai:** bar atas `[Kitab ▾][◀][▶]` (pilih kitab dulu) — itu konsep LAMA;
yang ditampilkan **sejarah Alkitab keseluruhan**, ❌ bukan panel per kitab.

**6 butir kerja** (satu butir per giliran, ±60 mnt total): **a** pintu plugin (`tombolBuka` + `buka()`) ·
**b** halaman ke-6 `#sejarah-halaman` · **c** prakata pindah ke halaman mandiri ·
**d** tombol halaman keterangan plugin diarahkan ke situ · **e** aman + penanda versi ·
**f** uji **K55c** + build + dokumen. Rincian: `rencanakerja.md` **B urut 1** · `agents.md` **0a00c2**.

---

## 22 September 2026 — ✅ **I-15 SELESAI: 🎛 TOMBOL SEJAJAR (GAYA C) — menu halaman baca LEBIH RAPI**

> Bapak: *“yg penting satu baris / sejajar.. itu lebih rapih terlihat.. icon itu bisa mewakili
> artinya icon tidak bisa dipakai hal lain.. jadi pilihan saya **C** saja.. sejajar dan rapih”*
> ⇒ tombol yang menumpuk di bawah tiap ayat dibuat **SEJAJAR di ujung teks ayat** —
> **konsep TIDAK berubah** (masih per ayat).

```text
SEBELUM (dulu — 58 baris tombol di Kejadian 1)        SESUDAH (gaya C)
1  Pada mulanya Allah menciptakan langit dan bumi.    1  Pada mulanya Allah menciptakan
   [ 🖊 penguat ]                                         langit dan bumi.   🖊  🔗62
   [ ayat terkait (62) ]                              2  Bumi belum berbentuk …  🖊  🔗8
2  Bumi belum berbentuk …                             3  Berfirmanlah Allah …   🖊  🔗21
   [ 🖊 penguat ]
   [ ayat terkait (8) ]
```

**Yang dikerjakan:**

- **Tombol `🖊 penguat` → ikon saja** (`🖊`) — kata “penguat” dibuang; arti lengkap tetap di `title`
  (sentuh-tahan) + `aria-label`.
- **Tombol `ayat terkait (n)` → ikon + angka** (`🔗62`) — kata “ayat terkait” dibuang.
- **Kedua wadah jadi `inline`** (`.pg-sisip` · `.at-hias`) ⇒ tombol **menempel di ujung baris
  teks ayat**, ❌ tidak turun jadi baris sendiri.
- ⚠️ **Mode GRUP (K37) tetap memakai kata** (`ayat terkait (n)`) — saat menyusun beberapa ayat
  pengguna perlu jelas. Hanya bentuk **1 ayat** yang memakai ikon + angka.
- ❌ **Tanpa mesin baru** — hanya **CSS** + **tulisan tombol**. Cara kerja, data, dan catatan
  ❌ tidak disentuh.

**Bukti terukur (Chrome nyata + versi HP — Kejadian 1):**

| Hal | Hasil |
|---|---|
| Tinggi **satu ayat** | **138 px → 72 px** = **hemat 48 %** |
| Tinggi **pasal Kejadian 1** | **6.945 px → 5.139 px** = **hemat 26 %** |
| Tombol di ayat 1 | `🖊` · `🔗62` (sejajar, satu baris bersama teks) |
| Jumlah tombol | 🖊 **31** · 🔗 **27** (tetap per ayat — konsep tidak berubah) |
| Klik 🖊 | ⇒ **SELURUH** penguat pasal tampil · tekan lagi ⇒ hide (persis seperti K54) |
| Klik 🔗 | ⇒ daftar kaitan turun **di bawah ayat itu** (persis seperti K25) |
| Uji | ✅ **465 uji, 0 gagal** (8 uji baru blok **I-15**) |
| Penanda versi | Penguat **`v22Sep-b`** · Ayat Terkait **`v22Sep-d`** |
| HP | `ANodes-1berkas.html` **24,82 MB** |

**🐞 CACAT NYATA yang ketemu saat mengerjakan (jangan diulang):**

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | Menyembunyikan tulisan tombol lewat CSS (`font-size: 0` + `::before`) | emoji **tetap tergambar** ⇒ tulisan jadi **“🖊🖊 penguat”** dan **“🔗 62ayat terkait (62)”** | tulisan diganti lewat **JS** (`textContent`), ❌ bukan CSS |
| 2 | Gaya “menempel di ujung” dibuat dengan `display: flex` pada `.ayat-baca` | ayat justru **makin tinggi** (187 px vs 138 px) — flex membuat tombol jadi **kolom baru** | pakai **`inline`** biasa (72 px) |
| 3 | Blok uji K54 melepas plugin 🖊 di akhir ⇒ blok **I-15** tidak menemukan tombol | gagal **palsu** (3 uji) | pastikan plugin 🖊 terpasang sebelum menguji sejajar |
| 4 | Label uji memuat tanda ❌ | dihitung **GAGAL PALSU** | tanda ❌ dibuang dari label — pelajaran LAMA yang terulang |

⚠️ **PELAJARAN:** perbaikan **tampilan** cukup dengan **CSS + tulisan tombol** — ❌ **tidak perlu** memindahkan tombol / mengubah mekanisme. Inilah yang Bapak minta sejak awal
(*“tujuan saya hanya mau merapihkan menu”*), dan cara ini berhasil **tanpa mengubah konsep**.

---

## 22 September 2026 — ❌ **K55d DIBATALKAN + DIKEMBALIKAN (tombol kembali per ayat)**

> Bapak: *“saya salah menjawab pertanyaan km.. tadi tujuan saya hanya merapihkan menu yg
> mengambil space kebawah terlalu banyak.. **seharusnya perayat ada ayat kaitannya konsep awal
> itu sudah benar seharusnya secara konsep tidak berubah**.. tujuan saya hanya mau merapihkan
> menu.. apakah bisa dikembalikan ke sebelum perubahan”*
> ⇒ **K55d DIBATALKAN.** Seluruh perubahan tombol dikembalikan ke keadaan **K55b**
> (tombol `🖊 penguat` & `ayat terkait (n)` **PER AYAT** kembali hidup).
> **Merapikan menu akan dikerjakan dengan cara lain** — tanpa mengubah konsep.

**Yang dikembalikan (revert):**

| Berkas | Dikembalikan ke | Penanda versi |
|---|---|---|
| `plugin/penguat/tampilan.js` | tombol `🖊 penguat` **per ayat** (`wadahPenguat` · `.pg-sisip` · `.pg-baca-toggle`) · semua tombol bertindak sama (sekali = semua tampil) | **`v22Sep-a`** |
| `plugin/ayat-terkait/tampilan.js` | tombol `ayat terkait (n)` **per ayat** di `.at-hias` · akar rantai kembali dari `.at-hias[data-asal]` | **`v22Sep-c`** |
| `plugin/sejarah/tampilan.js` | tombol `📖 sejarah` di **barisnya sendiri** (`.ay-sejarah-baris`) — tetap **hanya pasal 1** | **`v22Sep-d`** |
| `plugin/alkitab/tampilan.js` | **bar pintasan DIMATIKAN** (`PINTASAN_HIDUP = false`); kodenya tetap ada kalau nanti diperlukan | **`v22Sep-d`** |

**Bukti terukur (Chrome nyata + versi HP — Kejadian 1):**

| Hal | Hasil |
|---|---|
| Bar pintasan | ❌ **tidak ada** (`adaBarPintasan: false`) |
| Tombol `🖊 penguat` per ayat | ✅ **31** |
| Tombol `ayat terkait (n)` per ayat | ✅ **27** |
| Baris `📖 sejarah` | ✅ 1 baris, tepat di bawah **31 ayat** (sebelum ayat 1) |
| Ayat 1 | `🖊 penguat` + `ayat terkait (62)` |
| **Klik 🖊** | sekali tekan ⇒ **seluruh 18/31 penguat tampil** · tekan lagi ⇒ hide (perilaku K54 tetap) |
| Uji | ✅ **457 uji, 0 gagal** |
| HP | `ANodes-1berkas.html` **24,80 MB** |
| Backup keadaan K55d (sebelum dibatalkan) | `backups/k55d-dibatalkan-20260922-211823/` |

⚠️ **PELAJARAN PENTING:** jangan menyimpulkan maksud pengguna dari **satu** kalimat singkat —
waktu ragu, **tanyakan lebih dulu gambaran yang benar** sebelum mengubah **konsep**.
Kali ini tombol yang seharusnya hanya “dirapikan” sempat **dipindah tempat** (mengubah konsep
per-ayat) sehingga harus dikembalikan. Merapikan tampilan **tidak boleh menghilangkan**
cara kerja yang sudah disetujui.

---

## 22 September 2026 — ✅ K55b SELESAI: **📖 SEJARAH KITAB DIJADIKAN PLUGIN SENDIRI**

> Bapak: *“sejarah apakah bisa di buatkan plugin seperti orderan saya tadi”* ⇒ ✅ **bisa — dan lebih rapi.**
> Bapak memilih **bentuk B** = plugin sendiri dengan **tanda di halaman baca** (pola SAMA seperti 🖊 Penguat K54).
> Pilihan halaman mandiri (*“pilih kitab ▾ → langsung panel”*) ✅ **disetujui Bapak** ⇒ dikerjakan berikutnya (**K55c**).

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

**Yang dikerjakan:**

- **Berkas dipindah** ke `plugin/sejarah/` — `plugin.js` (keterangan) · `sejarah.js` (mesin) ·
  `tampilan.js` (tampilan) · `data/sejarah.js` (data 98,1 KB).
- **Plugin 📖 Alkitab dibersihkan** — `pasangSejarah` · `gambarSejarah` · `bukaSejarahAlkitab` ·
  `sejarahBagian` · `pesanAlkitab` serta `tombolInfo[]` **dibuang**; penanda versinya naik
  **`v22Sep-a` → `v22Sep-b`**.
- **Kartu plugin baru** di 🧩 Gudang Plugin: **📖 Sejarah Kitab** (66 kitab · 54.748 huruf sejarah ·
  158 ayat kunci · 1 pengantar) dengan tombol **⬇ Pasang / ▶ Buka**.
- **Tombol `[📖 sejarah]`** pindah ke halaman keterangan **plugin sejarah** sendiri.
- **Tanda di halaman baca** dipasang lewat sambungan resmi **`tambahPenghias()`** —
  ❌ tanpa mesin baru; plugin Alkitab tetap tidak tahu plugin ini ada.
- **Aman:** plugin dilepas ⇒ tombol, panel, & sisa hiasan **ikut hilang**; isi Alkitab & catatan **utuh**.

**Bukti (Chrome nyata + versi HP):**

| Hal | Hasil |
|---|---|
| Plugin terdaftar | `ANodesPlug` memuat **`sejarah`** · kartu **📖 Sejarah Kitab** di gudang (uji **K55-01b**) |
| Alkitab bersih | `gambarPasal` ❌ tidak lagi menyebut sejarah (uji **K55-01d**) |
| Tombol di halaman baca | muncul di **Kejadian 1** lewat plugin baru (uji **K55-08**) |
| Panel + ayat kunci | **📖 SEJARAH — KEJADIAN** · 🔑 **Kejadian 1:1 · 12:3 · 50:20** (uji **K55-09…12**) |
| Klik ayat kunci | ⇒ pindah ke **Kejadian 1:1** (uji **K55-13**) |
| Tombol di halaman keterangan | panel gudang **TERTUTUP** sesudah ditekan (uji **K55-16c0/16c/16d**) |
| **Plugin DILEPAS** | tombol **0** · panel **0** · **isi Alkitab & catatan UTUH** (uji **K55-20/20b**) |
| Dipasang lagi | tombol **muncul kembali** (uji **K55-20c**) |
| Uji | **450 uji, 0 gagal** (blok **K55**: 38 uji) |
| Penanda versi | Alkitab **`v22Sep-b`** · Tampilan Sejarah **`v22Sep-a`** |
| HP | `ANodes-1berkas.html` **24,76 MB** |

**🐞 Cacat nyata yang ketemu saat uji (jangan diulang):** tidak ada **`siapkanOtomatis()`** —
`saatDipasang` hanya jalan saat tombol **Pasang** ditekan. Kalau halaman **dimuat ulang**
(plugin tetap terpasang), pendaftaran penghias **tidak pernah jalan** ⇒ tombol 📖 sejarah
**tidak muncul** & mesin `siap=false`. Diperbaiki: `tampilan.js` kini punya **`siapkanOtomatis()`**
yang dipanggil saat `DOMContentLoaded` (pola SAMA seperti `ANodesAlkitab.siapkanOtomatis()`, K14) ·
uji baru **K55-01e**.

**Backup:** `backups/k55b-plugin-sejarah-20260922-192425/`.

**⚠️ Pelajaran:** plugin bisa **dipindah utuh** tanpa mesin baru karena sambungan resmi
`tambahPenghias()` sudah disiapkan sejak K25. Asas **“plugin bisa dicabut”** dibuktikan dengan
**melepas plugin sungguhan** — yang hilang hanya hiasan kita.

---

## 22 September 2026 — ✅ K55 SELESAI: **📖 SEJARAH KITAB (ARTIKEL PEMANIS BACAAN)**

> Bapak (22 Sep 2026): *“alkitab saya ingin menambahkan penulisan artikel pemanis —
> user hanya membaca **Pengantar Sejarah Alkitab**.. user perlu mengenal masing2 sejarah
> kitab.. contoh **Kej 1:1 ada tombol [sejarah]** diklik ⇒ info sejarah Kejadian
> ditampilkan, dan ini untuk **kesemua kitab hingga Perjanjian Baru** .. untuk **sejarah
> Alkitab keseluruhan** ditempatkan pada **gudang plugin → alkitab ada tombol [sejarah]**
> .. apakah km bisa bantu carikan eBook dan dibantu translate”*

**🔎 Temuan penting (diperiksa, ❌ bukan diduga) — data sejarah SUDAH ADA di komputer.**

`C:\data\bible\data\kitab.json` sudah lengkap **66 dari 66 kitab** — tiap kitab punya
`penulis` · `kategori` · `perjanjian` · `tahun` · **`sejarah`** (692–971 huruf, total
**54.748 huruf**, bahasa Indonesia, **0 kosong**) ⇒ ❌ **tidak perlu eBook / terjemahan**.

**Yang dikerjakan:**

- **TAMBAHAN untuk 66 kitab sekaligus** (disetujui Bapak *“bisa dikombinasikan”*) —
  🎯 **inti kitab** (1 kalimat) · 💡 **tema utama** (3–4 frasa) · 👤 **tokoh utama** (3–5 nama) ·
  🔑 **ayat kunci** (2–3 rujukan — **BISA DIKLIK**).
- **Tombol `📖 sejarah`** di halaman baca Alkitab — **hanya muncul di PASAL 1** tiap kitab
  (persetujuan Bapak). Ditekan ⇒ panel sejarah turun; ditekan lagi ⇒ **tertutup**.
- **Panel Sejarah kitab** — urutan: 🎯 Inti → 🏷️ Penulis/Tahun/Kategori/Perjanjian →
  💡 Tema utama → 👤 Tokoh utama → 📜 Sejarah (teks lengkap) → 🔑 Ayat kunci.
  **Ayat kunci diklik ⇒ langsung pindah ke ayat itu** (memakai `bukaAyatDariLink()` yang sudah ada).
- **Gudang plugin → 📖 Alkitab** kini punya **tombol `📖 sejarah`** (kontrak BARU **`tombolInfo[]`**
  di `js/plugin.js`) ⇒ membuka **“📖 Pengantar Sejarah Alkitab”** sebagai halaman baca:
  **66 chip kitab** dikelompokkan per kategori + teks pengantar **15.356 huruf**.
- **Mesin** `plugin/alkitab/sejarah.js` (BARU) — `window.ANodesSejarah` dengan `kitab(n)` ·
  `semua()` · `ada(n)` · `pengantar()` · `adaPengantar()` · `jumlahKitab()` · `kelompok()`
  + simpanan cepat IndexedDB kunci `sejarah` (gudang sama dengan Alkitab, **kunci beda**).
- **Alat data** `tools/siapkan-data-sejarah.js` + isi tambahan `tools/tambahan-sejarah-kitab.js`
  ⇒ hasil `plugin/alkitab/data/sejarah.js` (**98,1 KB**).
- **Aman:** ❌ tidak mengubah catatan · plugin 📖 Alkitab dilepas ⇒ mesin sejarah ikut dibersihkan.

**🐞 3 cacat nyata yang ketemu saat mengerjakan:**

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | Ekor berkas sumber memuat **pertanyaan mesin obrolan** (“Apakah Anda ingin melanjutkan dengan menyusun Kartu Pertanyaan Kontroversi pertama…”) | kalimat itu **ikut terbaca pengguna** di ujung Pengantar — tampak aneh | alat data membuang kalimat tanya terakhir bergaya obrolan ⇒ pengantar 15.577 → **15.356 huruf** |
| 2 | Label uji memuat tanda **❌** | 2 uji dihitung **GAGAL palsu** | tanda ❌ dibuang dari label |
| 3 | Panel gudang plugin memakai **kelas `.buka`**, ❌ bukan atribut `hidden` | panel gudang menutupi halaman baca ⇒ sempat dikira pengantar tidak terbuka | saat menguji pakai `ANodesPlugin.tutupGudang()` |
| 4 | **Tombol `[📖 sejarah]` di halaman keterangan plugin tidak menutup panel gudang** — ketemu saat **Bapak minta uji Kej 1:1 di `ANodes-1berkas.html`** | halaman pengantar **tertutup panel gudang** ⇒ pengantar tidak terlihat | pengait klik `tombolInfo[]` di `js/plugin.js` ditambah **`tutupGudang()`** (pola SAMA seperti tombol `[▶ Buka]`) · uji baru **K55-16c0/16c/16d** |

**Bukti (Chrome nyata):** tombol **muncul di Kejadian 1** · ❌ **tidak muncul di Kejadian 2** ·
panel terbuka lengkap · **klik ayat kunci ⇒ Kejadian 1:1** · tombol lagi ⇒ **tertutup** ·
gudang plugin punya tombol **📖 sejarah** · pengantar **66 chip + 15.356 huruf** ·
catatan **tidak berubah** · **441 uji, 0 gagal** (blok **K55**: 29 uji) ·
penanda versi Alkitab **`v22Sep-a`** · HP **24,74 MB** ·
backup `backups/k55-sejarah-kitab-20260922-185741/`.

---

## 22 September 2026 — ✅ K54 SELESAI: **PENGUAT DITEMPATKAN PADA ALKITAB** + 🔄 3 revisi Bapak

> Bapak (21 Sep 2026): *"penguat ditempatkan pada alkitab.. apakah arahan singkat ini dipahami ?
> jangan diproses dulu.. saya mau pastikan gambaran km sudah sama"* → **diproses 22 Sep 2026**.

**Jawaban Bapak (3 pertanyaan saya) — ini yang dipakai:**

1. **(b) TOMBOL KECIL `🖊 penguat` per ayat** — diklik baru terbuka ·
   *"semua dan klik lagi tertutup untuk semua"* ⇒ tekan tombol mana pun saat ada yang terbuka
   = **SEMUA kotak penguat tertutup**.
2. *"ya tidak ada tombol penguat.. sejauh saya perhatikan selalu ada"* ⇒ tombol **hanya**
   muncul di ayat yang punya penguat (data sudah 100 %).
3. Halaman **🖊 Pembaca Penguat (K47)** tetap ada seperti sekarang.

**Yang dikerjakan (❌ tanpa mesin baru — pakai sambungan resmi `tambahPenghias()`):**

- **Tombol `🖊 penguat` per ayat** di halaman baca (baris `.ayat-baca`) — hanya pada ayat yang
  punya penguat; disisipkan lewat wadah `.pg-sisip`. Ada juga tombol **`🖊` di navbar** halaman baca.
- **SATU penanda keadaan `semuaTerbuka` untuk SELURUH pasal** — tekan `🖊` **sekali** ⇒
  **SELURUH penguat pasal TAMPIL** · tekan **lagi** ⇒ **SELURUH HIDE**.
  ⚠️ Versi pertama saya SALAH (hanya ayat yang ditekan) — dikoreksi sesudah Bapak menegaskan:
  *“klik penguat.. **semua penguat tampil** dan klik lagi ayat penguat **hide**”*.
- **Kotak penguat** berlatar krem `#faf6ec`, huruf sebesar huruf Alkitab, tanpa garis cokelat.
- **Tombol yang membuka** diberi tanda **aktif**.
- **Pintu balik:** tombol 📖 (`#pg-alkitab`) di halaman Pembaca Penguat → halaman baca Alkitab
  pada pasal yang sama.
- **Aman:** ❌ tidak mengubah catatan · plugin dilepas ⇒ tombol & kotak **ikut hilang**.

### 🔄 KOREKSI PERILAKU 22 Sep 2026 (⚠️ versi pertama saya SALAH)

> Bapak: *“karena klik penguat .. sebelum saya minta klik penguat.. **semua penguat tampil**
> dan klik lagi ayat penguat **hide**.. sekarang belum sesuai”*

| | Bentuk |
|---|---|
| ❌ **SALAH** (versi pertama) | tekan tombol ayat n ⇒ hanya kotak **ayat n** yang terbuka |
| ✅ **BENAR** (dipakai) | tekan `🖊` sekali ⇒ **SELURUH penguat pasal ini TAMPIL** · tekan lagi ⇒ **SELURUH HIDE** |

⇒ satu keadaan **`semuaTerbuka`** untuk **seluruh pasal** — semua tombol melakukan hal yang SAMA.
Tambahan: tombol **`🖊` di navbar halaman baca** (sebelah 📤) lewat `sakelarSemuaPenguat()`
(kontrak baru `tombol[]` di `plugin/alkitab/plugin.js`).

**Bukti klik nyata (Chrome + versi HP):** klik ⇒ **18 kotak tampil** · klik lagi ⇒ **0 (HIDE)** ·
tombol navbar juga jalan (18 ⇄ 0) · **71 tanda istilah** ikut di seluruh kotak ·
klik “Taurat” ⇒ halaman istilah · 🏠 ⇒ balik + sorot kuning · **seluruh penguat masih tampil**.

**Uji:** **418 uji, 0 gagal** — uji **K54-05/06/07/08/11/20** disesuaikan + **K54-15b** baru ·
penanda versi **`v21Sep-e` → `v21Sep-f`** · HP `ANodes-1berkas.html` **24,59 MB**.

### 🔄 REVISI BAPAK 22 Sep 2026 (3 hal) — SUDAH DIKERJAKAN

| # | Permintaan Bapak | Perbaikan |
|---|---|---|
| **1** | *"ukuran font lebih kecil dari pada alkitab, kalau di samakan bisa ?"* | kotak penguat kini memakai **ukuran huruf ayat Alkitab** — dulu **12,5px** vs ayat **16px** ⇒ sekarang **16px** (`.baca-isi .pg-di-baca { font-size: inherit }`) |
| **2** | *"garis vertikal coklat kalau dihilangkan akan lebih besar ruang bacanya"* | **garis cokelat kiri DIHAPUS** (`border: 0`, semua sisi `0px`) · padding dinaikkan 8/10px ⇒ **ruang baca lebih lebar** · pembeda tetap **latar krem** `#faf6ec` (pola SAMA seperti K51) |
| **3** | *"apakah ada kata istilah pada penguat.. kalau ada seharusnya bisa diklik dan pindah halaman istilah saja"* | **ADA** dan dulu **tidak ditandai** ⇒ sekarang ditandai (Yos 1:8 = **5 tanda**, termasuk "Taurat") · diklik ⇒ **halaman istilah** · 🏠 balik ke halaman baca + kata **disorot kuning** · kotak tetap terbuka |

**🐞 Sebab butir 3 (diperiksa, ❌ bukan diduga):** plugin 📚 Kamus mendaftarkan `hiasAyat` ke
**ALKITAB** (halaman baca) — ❌ bukan ke plugin penguat (`hiasPenguat` hanya untuk halaman Pembaca
Penguat). Kotak penguat dibuat **sesudah** penghias Alkitab selesai ⇒ isinya terlewat.
**Perbaikan:** saat kotak dibuka, plugin penguat memanggil **jalur resmi** `jalankanPenghias()`
milik halaman baca ⇒ kamus ikut jalan. **Aman** karena `hiasAyatBaca` punya penjaga idempoten
(baris sudah dihiasi pasal ini ⇒ langsung keluar) ⇒ kotak yang baru dibuka **tidak** terhapus.

**Hasil terukur (Chrome nyata + versi HP):** 18 tombol di Yosua 1 · sebelum diklik **0 kotak** ·
klik ayat 8 ⇒ kotak **ayat 8** terbuka (isi = penguat Yos 1:8) · tekan tombol ayat **lain** ⇒
**0 kotak (SEMUA tertutup)** · tekan lagi ⇒ 1 kotak · pulang-pergi pasal ⇒ tombol **muncul lagi**
dan klik tetap berfungsi · `fontAyat = fontKotak = 16px` · `borderLeft = 0px` · latar tetap
`rgb(250,246,236)` · **5 tanda istilah** di kotak penguat · klik "Taurat" ⇒ halaman istilah
terbuka · 🏠 ⇒ balik ke halaman baca + sorot kuning · kotak tetap terbuka · catatan **tidak
berubah** · plugin dilepas ⇒ semua hilang.

**🐞 CACAT NYATA yang ketemu saat uji (jangan diulang):**

| # | Cacat | Akibat | Perbaikan |
|---|---|---|---|
| 1 | `saatTombolPenguat()` memakai `bersihkanBaca()` yang membuang SELURUH `.pg-sisip` — termasuk **wadah tombol yang sedang diklik** | kotak penguat **tidak pernah bisa dibuat** | pakai **`tutupKotakPenguat()`** — hanya kotak `.pg-komentar.pg-di-baca` yang dibuang |
| 2 | saat membuka kotak, memanggil `jalankanPenghias()` (termasuk diri sendiri) | kotak baru **langsung terhapus** | tambah **`jalankanPenghiasLain()`** |
| 3 | penanda "sudah dihiasi" ditaruh di **wadah** `#baca-isi` | pulang ke pasal yang sama ⇒ tombol **tidak digambar ulang** | penanda dipindah ke **baris ayat** (`dataset.pgHias`) |
| 4 | kotak baru **tidak ikut ditandai istilah** | kata istilah di penguat **tidak bisa diklik** (revisi butir 3) | panggil **`jalankanPenghias()`** milik halaman baca saat kotak dibuka |

⚠️ Keempatnya **hanya ketemu karena uji KLIK NYATA** + pemeriksaan lewat `page.evaluate()`,
❌ bukan karena memanggil fungsi dari Console.

**Berkas yang diubah:** `plugin/penguat/tampilan.js` · `plugin/penguat/plugin.js` (versi 1.1) ·
`plugin/alkitab/plugin.js` (tombol `baca-penguat` di navbar) · `index.html` (tombol `#pg-alkitab`) ·
`css/app.css` (`.pg-sisip` · `.pg-baca-toggle` · `.pg-baca-toggle.aktif` · `.pg-di-baca`) ·
`tools/uji-cepat.js` (**K54-01…K54-20**).

**Uji:** **418 uji, 0 gagal** (blok **K54-01…K54-20** = 30 uji) ·
penanda versi **`v21Sep-e` → `v21Sep-f`** · HP `ANodes-1berkas.html` **24,59 MB** ·
backup `backups/k54-penguat-alkitab-20260922/`.

---

## 21 September 2026 — 📜 K54 (rencana): **PENGUAT DITEMPATKAN PADA ALKITAB** (arahan dipastikan)

> ⚠️ **Bagian ini hanya JEJAK RENCANA** — pekerjaannya **SUDAH SELESAI 22 Sep 2026**
> (lihat entri paling atas). Disimpan supaya keputusan Bapak tidak hilang.

> Bapak: *"penguat ditempatkan pada alkitab.. apakah arahan singkat ini dipahami ? jangan diproses
> dulu.. saya mau pastikan gambaran km sudah sama"*

**Jawaban Bapak (3 pertanyaan saya) — ini yang dipakai:**

1. **(b) TOMBOL KECIL `🖊 penguat` per ayat** — diklik baru terbuka ·
   *"semua dan klik lagi tertutup untuk semua"* ⇒ tekan tombol mana pun saat ada yang terbuka
   = **SEMUA kotak penguat tertutup**.
2. *"ya tidak ada tombol penguat.. sejauh saya perhatikan selalu ada"* ⇒ tombol **hanya**
   muncul di ayat yang punya penguat (data sudah 100 % jadi praktis selalu ada).
3. Halaman **🖊 Pembaca Penguat (K47)** tetap ada seperti sekarang.

**Rencana teknis (❌ tanpa mesin baru):** pakai sambungan resmi **`tambahPenghias()`** milik
halaman baca (sudah dipakai 🔗 Ayat Terkait & 📚 Kamus) · tombol disisipkan di dalam baris
`.ayat-baca` · kotak penguat bergaya `.pg-komentar` · satu penanda keadaan untuk “tutup semua” ·
plugin dilepas ⇒ semua tombol & kotak ikut hilang.

⏭️ **DIPROSES & SELESAI 22 Sep 2026** — rincian hasil ada di entri paling atas dokumen ini.

---

## 21 September 2026 — 📚 K51 butir c+d: **BLOK ISTILAH + `＋ Istilah` ke CATATAN**

> Bapak: *"metode sama seperti ayat terkait .. kebawah terus.. dengan head "suci;kudus" dan
> disimpan bisa dipaste ke catatan"*

| Hal | Hasil |
|---|---|
| Tombol `✓ pilih` di tiap kolom istilah | keterangan jadi **BLOK TETAP** (uji **K53-03/04**) |
| Blok menumpuk berlevel | tingkat `1,2` — blok level 1 tidak terhapus (uji **K53-07b/07c**) |
| Rantai diteruskan dari dalam blok | chip di blok → kolom level berikutnya (uji **K53-06/07**) |
| Kepala (head) rantai | baris pertama = istilah utama, mis. **Ibrani** (uji **K53-08**) |
| Tombol `＋ Istilah` | kirim ke catatan lewat **jalur K40** (uji **K53-10/11**) |
| Tempel ke catatan | **847 huruf** masuk, catatan lama tidak hilang (uji **K53-12/12b**) |

**Cacat nyata yang ketemu & diperbaiki:** (1) turunan ikut terhapus saat `✓ pilih` → blok
berlevel tak pernah bisa disusun · (2) rantai tak bisa diteruskan dari blok ·
(3) `levelDariChip()` tidak mengenal `.kamus-blok`.

**Berkas:** `plugin/kamus/tampilan.js` · `css/app.css` · `tools/uji-cepat.js` (**K53-01…K53-13**).
**Uji:** **388 uji, 0 gagal** · penanda kamus **`v21Sep-g`** · HP **25,12 MB** ·
backup `backups/k51-blok-istilah-20260921/`. ✅ **K51 kini TUNTAS (a+b+c+d).**

---

## 21 September 2026 — 🔗 K52: **TAUTAN ISTILAH DI HALAMAN BACA & PENGUAT (dulu MATI)**

> Laporan Bapak: *"Yos 1:8 ada kata taurat <- kamus istilah sudah ada link tapi di klik tidak
> fungsi.. apakah semua alkitab bila ada kata istilah ada linknya termasuk penguat · jika klik
> link taurat <- pindah halaman tadi istilah sama cara kerjanya"*

| Hal | Sebelum | Sesudah |
|---|---|---|
| Klik kata istilah di halaman BACA | **MATI** (pengait klik hanya di `#editor`) | **halaman istilah terbuka** |
| Chip "📚 Istilah di pasal ini" | belum bisa diklik | **bisa diklik** |
| Halaman 🖊 Pembaca Penguat | **0 link** (tulis `textContent`) | **45 tanda** — teks AYAT + teks PENGUAT |
| Tombol 🏠 | selalu "kembali ke catatan" | **"kembali ke bacaan"** / **"kembali ke penguat"** + **sorot kuning** |

**Bukti Chrome nyata:** klik "Taurat" Yos 1:8 → halaman istilah (448 huruf) → 🏠 → balik ke
**Yos 1:8**, kata "Taurat" disorot `rgb(255,243,205)`.

**Cacat nyata yang ketemu & diperbaiki:** `ingatAsal(null)` bikin `TypeError` → klik tidak
berbuat apa-apa. Ketemu **hanya** karena diuji dengan **klik nyata + `window.onerror`**.

**Berkas:** `plugin/kamus/tampilan.js` (`pasangKaitHalaman` · `ingatAsalHalaman` ·
`kembaliKeHalamanAsal` · `segarkanTombolKembaliKamus` · `hiasPenguat` · penjaga `ingatAsal`) ·
`plugin/penguat/tampilan.js` (`tambahPenghias` / `jalankanPenghias`) · `css/app.css`
(tanda istilah + sorot kuning di `#baca-isi` & `#pg-isi`) · `tools/uji-cepat.js` (**K52-01…K52-12**).

**Uji:** **372 uji, 0 gagal** · **Penanda versi:** kamus **`v21Sep-f`** · penguat **`v21Sep-c`** ·
HP **25,10 MB** · Backup `backups/k52-link-baca-penguat-20260921/`.

---

## 21 September 2026 — 📚 K51: **KOLOM ISTILAH BERLEVEL — klik istilah = kolom BARU di bawah** (butir a+b)

> Permintaan Bapak: *“misal link suci ← klik → tampil seperti pasted image · jika ayat yg berhubungan
> misal kel 28:36 ← klik muncul kolom dibawah isi ayat kel 28:36 · ide ini juga berlaku pada kamus
> istilah … [Yehuwa][Ibrani][Kristen] klik … muncul bergantian pada kolom yg sama”*

**Jawaban Bapak 1–7 (21 Sep 2026) — yang dipakai:**

| # | Jawaban Bapak |
|---|---|
| **1** | ✅ **B. DUA KOLOM TERPISAH** — *“kolom ayat no.1 dan kolom no.2 istilah”* |
| **2** | ✅ Judul/head **tetap** — *“kudus;suci itu “head” harus ada”* |
| **3** | ❌ kotak tanggal/jam & kotak ➤ **bukan bagian revisi** — sudah diperiksa di browser, **tidak ada** di ANodes |
| **4** | ✅ *“metode sama seperti ayat terkait .. kebawah terus.. dengan head “suci;kudus” dan disimpan bisa dipaste ke catatan”* ⇒ butir **c–d** |
| **5** | ✅ 📋 Daftar & 🔍 Cari **tetap** |
| **6** | ✅ [full] **tetap** |
| **7** | ✅ Garis putus-putus **tetap** (supaya pengguna tahu kata bisa diklik) |

### 🔴 REVISI BAPAK (21 Sep 2026) — versi pertama SALAH (menimpa)

> *“masih ada bagian yg kurang tepat.. contoh **penulis;Ahli Taurat** ada 2 istilah -> Ibrani dan
> ahli taurat -> klik Ibrani -> ada 4 istilah didalam ibrani: Yakub Aram Kristus Murid <- klik Yakub
> **sekarang menimpa dikolom Ibrani seharusnya kolom baru dibawahnya** dan seterusnya sama dengan
> ayat .. jadi ada 2 kata istilah dengan **level 0=head level 1-> ibrani Level2= yakub · perlevel per
> kolom · sama dengan ayat** .. jadi **ditimpa pada level yg sama** konsepnya”*

**⇒ Perbaikan:** tiap klik istilah = **KOLOM BARU DI BAWAH** (menumpuk) ·
**hanya level yang SAMA** yang ditimpa · pola **SAMA** dengan 🌿 Ayat Terkait.

```text
LEVEL 0 = head  "Ibrani"
  └─ LEVEL 1  [Yakub]  → kolom Yakub
       └─ LEVEL 2  [Israel] → kolom Israel  (DI BAWAH, bukan menimpa)
            └─ LEVEL 3  … terus ke bawah
  klik [Aram] (level 1) → menimpa kolom LEVEL 1 saja
```

### 🔧 Yang dikerjakan — berkas & fungsi

| Berkas | Perubahan |
|---|---|
| `plugin/kamus/tampilan.js` | ➕ **`buatKolomIstilah(nama)`** — isi satu kolom keterangan · ➕ **`tampilKeteranganIstilah(nama, chip, level)`** — buat kolom di level tertentu · ➕ **`buangKolomDari(tunas, level)`** — buang level ≥ n saja · ➕ **`levelDariChip(el)`** — hitung level dari posisi chip · ➕ **`#kamus-istilah-tunas`** (wadah kolom bertumpuk) · 🐞 **kait klik `span.kamus-ist-link` ditambahkan** (tautan di dalam keterangan **dulu MATI**) · 🔧 `VERSI` → **`v21Sep-c`** |
| `css/app.css` | ➕ `.kamus-istilah-tunas` (flex kolom, gap) · `.kamus-istilah-kolom[data-kamus-level]` **bertingkat** (indent per level) · `.kamus-istilah-baru` (sorot sekejap) · ❌ **`max-height` dihapus** supaya kolom boleh memanjang |
| `tools/uji-cepat.js` | ➕ **K51-01…K51-14 + 11b/11c** · 🔧 uji lama disesuaikan (`K42a-06` · `K42d-08/08b/09/10`) |

### 🔴 REVISI BAPAK ke-2 (21 Sep 2026) — KOLOM JANGAN DIKECILKAN

> *“iya benar seperti itu.. hanya revisi kolom baru **jangan dikecilkan**.. saya tau tujuan untuk
> menandakan turunan.. tapi jika ditampil di HP jadi kecil ruang tulisannya apalagi saya besarkan
> size font.. jadi **ukuran kolom tetap diukuran pas layar**.. **boleh beri tanda saja**”*

⇒ **Perbaikan:** hapus `margin-left` per level (itulah yang mengecilkan kolom) ⇒
**kolom SELALU selebar layar** · turunan ditandai **BADGE “Tingkat n”** + garis kiri makin gelap
(tanda saja, ❌ bukan margin).

### ✅ Hasil terukur

| Hal | Bukti |
|---|---|
| Tunas kolom istilah | `#kamus-istilah-tunas` **terpisah** dari `#kamus-ayat-kolom` (uji **K51-02**) |
| Klik istilah | **KOLOM BARU LEVEL 1** (254 huruf) · judul halaman **TETAP** (uji **K51-06/07/08**) |
| **MENUMPUK** | klik di dalam kolom L1 → **KOLOM BARU L2** · **L1 TETAP ada** (uji **K51-11/11b/11c**) |
| **TIMPA level sama** | klik lain di L1 → tetap **1 kolom** · klik lain di L2 → timpa L2 saja (uji **K51-10/12**) |
| **KOLOM SELEBAR LAYAR** | lv1 = lv2 = wadah (**354px** di PC · **306px** di layar 420px) · `margin-left: 0` (uji **K51-15/15b**) |
| **BADGE tingkat** | “Tingkat 1” · “Tingkat 2” di kepala kolom (uji **K51-16**) |
| **TANPA garis hijau kiri** | `border-left = border-right = 0.8px` · lebar isi **304px** (uji **K51-17/17b**) |
| Kolom ayat tidak rusak | klik chip ayat → **243 huruf** (uji **K51-14**) |
| Head & tombol tetap | “Kudus; Suci” · 📋 Daftar · 🔍 Cari · [full] (uji **K51-03/04/05**) |
| ✅ Terbukti di Chrome | `Ibrani → Yakub (L1) → Israel (L2) → Yakub (L3)` — **3 kolom menumpuk** |
| **Uji** | **354 uji, 0 gagal** — **K51-01…K51-17 + 11b/11c/17b LULUS** |
| Penanda versi | `plugin/kamus/tampilan.js` → **`v21Sep-b` → `v21Sep-c` → `v21Sep-d` → `v21Sep-e`** |
| HP `ANodes-1berkas.html` | **24,49 MB** |
| 💾 Backup | `backups/k51-kolom-istilah-20260921/` → `.../k51-revisi-level-20260921/` → `.../k51-kolom-lebar-20260921/` → **`.../k51-tanpa-garis-hijau-20260921/`** |

⏭️ **Sisa K51:** butir **c** (blok tersendiri + tombol `✓` seperti 🌿 Ayat Terkait) ·
butir **d** (simpan + paste ke catatan — jalur **K40**).

---

## 21 September 2026 — 🎉🎉 **K45 SELESAI TOTAL: 66 KITAB · 31.102 AYAT = 100 % ALKITAB**

> Order Bapak: *“lanjut ke perjanjian baru sampai selesai.. saya akan keluar dengan anjing lagi..”*
> ⇒ **seluruh Perjanjian Baru** (Matius s/d Wahyu) diselesaikan **sampai tuntas** — dan dengan itu
> **SELURUH 66 KITAB ALKITAB sudah punya penguat**. ❌ **tidak ada lagi kitab yang kosong.**

| Hal | Angka |
|---|---|
| Kitab tuntas | **66 dari 66 (100 %)** |
| Ayat penguat | **31.102 dari 31.102 ayat Alkitab (100 %)** |
| Data penguat | `plugin/penguat/data/penguat.js` **12.691,7 KB** |
| Sidik data | **`66-31102-1:1533,…,66:404-11c3e3e5`** (`dibangun 2026-09-21`) |
| HP `ANodes-1berkas.html` | **24,44 MB** |
| Penanda versi | penguat **`v21Sep-b`** · kamus **`v21Sep-a`** |

### 📖 11 kitab penutup (sesi 21 Sep 2026) — semuanya **kitab BARU** ⇒ **3 langkah setup**

| Kitab | bookId | Pasal | Ayat | Kitab | bookId | Pasal | Ayat |
|---|---|---|---|---|---|---|---|
| Titus | 56 | 3 | **46** | 1 Yohanes | 62 | 5 | **105** |
| Filemon | 57 | 1 | **25** | 2 Yohanes | 63 | 1 | **13** |
| Ibrani | 58 | 13 | **303** | 3 Yohanes | 64 | 1 | **14** |
| Yakobus | 59 | 5 | **108** | Yudas | 65 | 1 | **25** |
| 1 Petrus | 60 | 5 | **105** | **Wahyu** | 66 | 22 | **404** |
| 2 Petrus | 61 | 3 | **61** | | | | |

### 📖 Kitab PB lama yang juga diselesaikan 21 Sep 2026 (kitab BARU)

| Kitab | bookId | Ayat | | Kitab | bookId | Ayat |
|---|---|---|---|---|---|---|
| Matius | 40 | **1.071** | | Efesus | 49 | **155** |
| Markus | 41 | **678** | | Filipi | 50 | **104** |
| Lukas | 42 | **1.151** | | Kolose | 51 | **95** |
| Yohanes | 43 | **879** | | 1 Tesalonika | 52 | **89** |
| Kisah Para Rasul | 44 | **1.007** | | 2 Tesalonika | 53 | **47** |
| Roma | 45 | **433** | | 1 Timotius | 54 | **113** |
| 1 Korintus | 46 | **437** | | 2 Timotius | 55 | **83** |
| 2 Korintus | 47 | **257** | | | | |
| Galatia | 48 | **149** | | | | |

### ⚙️ Langkah penutup yang sudah dijalani (urut)

1. `node tools/tambah-komentar.js <batch>` (tiap giliran, dari `c:\data\bible`)
2. `node tools/bersih-dan-dan.js <batch>` + `node tools/cek-hitung-hal.js <batch>` (WAJIB sebelum gabung)
3. `node tools/build-lab3.js`
4. `node tools/cek-penguat.js <bookId>` → **bukti per pasal cocok**
5. `node tools/siapkan-data-penguat.js` → **66 kitab · 31.102 ayat · sidik berubah** ✅
6. `node tools/siapkan-dokumen.js` → `node tools/buat-1-berkas.js` (**SEKALI**) → **24,44 MB**
7. Naikkan penanda versi penguat → **`v21Sep-b`**
8. Arsipkan berkas batch → `bible/backup/komentar-batch-perjanjian-baru/` (112 berkas)
   + `bible/backup/komentar-batch-39-kitab-pl-lain/` (32 berkas sisa) ⇒ **`data/komentar/` bersih**
9. Uji blok **K47** diperbarui untuk **66 kitab · 31.102 ayat** + 7 uji baru (**K47-36…K47-42**)

### ✅ Bukti (diperiksa di Chrome nyata)

- `ANodesPenguat.daftarKitab().length` = **66** · `ANodesPenguat.jumlahAyat(66)` = **404** (Wahyu)
- Teks **`66.22.21`** (Wahyu 22:21) terbaca di `ANodes-1berkas.html`
- Penanda **`v21Sep-b`** (penguat) & **`v21Sep-a`** (kamus) ada di berkas HP
- ⚠️ **Uji K47-08/09/10/11/18** dulu menyebut “14 kitab · 16.996 ayat” → kini **66 kitab · 31.102 ayat**

---

## 21 September 2026 — 🐞 K50: **TAUTAN ISTILAH ADA TAPI ISI “TIDAK DITEMUKAN”** (diperbaiki)

> Laporan Bapak: *“masalah plugin kamus istilah ada link tapi tidak ada isinya contoh kata suci
> ada link di klik -> pesan **”istilah ”Kudus;Suci”tidak ditemukan”** ada beberapa seperti ini..
> untuk file Pengantar Sejarah Alkitab.md yg ada di folder `C:\data\ANodes\cat\exp md\`
> silahkah di debugging · file ini hasil export dari sistem ANodes sendiri..”*

**Sebabnya (diperiksa di Chrome nyata, ❌ bukan diduga):** **isi kamus TIDAK hilang** —
masalahnya di **pengenal kata**.

| Hal | Keadaan |
|---|---|
| Setiap tautan menyimpan | `data-istilah` = **NAMA RESMI entri** (`{nama, alias[]}`), mis. `Kudus; Suci` |
| Aturan pengenal kata (LAMA) | `HANYA_HURUF = /^[A-Za-z ]+$/` → hanya **huruf + spasi** |
| Akibat | nama resmi yang memuat `;` `(` `)` `-` **tidak pernah masuk `petaTulisan`** ⇒ `istilah("Kudus; Suci")` = **`null`** ⇒ halaman arti **tidak bisa dibuka**, padahal artinya **ADA** (756 huruf) |

**Terukur: 23 entri kena** — **17** (tautan ada, klik gagal) + **6** (tidak terdeteksi sama sekali:
`Hakim-hakim` · `Hari-hari terakhir` · `Kapal-kapal Tarsyis` · `Mut-laben` · `Orang-orang suci` · `Sida-sida`).

### 🔧 Perbaikan (3 berkas diselaraskan — ❌ jangan dihapus)

| Bagian | Pelaksanaan |
|---|---|
| **`petaNama`** (BARU, `plugin/kamus/kamus.js`) | peta **NAMA RESMI → entri** (semua nama, walau bertanda baca) · `istilah()` = `petaTulisan.get(k) \|\| petaNama.get(k) \|\| null` ⇒ **tautan tidak pernah mati** |
| **Tanda hubung diperbolehkan** | `const HANYA_HURUF = /^[A-Za-z][A-Za-z -]*$/` — diselaraskan di **`plugin/kamus/kamus.js`** · **`plugin/kamus/tampilan.js`** · **`tools/siapkan-data-kamus.js`** |
| **Kamus pribadi** (`tampilan.js → siapkanPetaPribadi()`) | nama resmi entri **selalu** didaftarkan, tidak lagi bergantung penyaring |
| **`saatDilepas()`** | ikut membersihkan `petaNama` |

### ✅ Hasil terukur

| Ukuran | Sebelum | Sesudah |
|---|---|---|
| Tulisan siap deteksi | 427 | ✅ **437** |
| Entri (tidak berubah) | 392 | **392** |
| Entri yang **tidak bisa diklik** | ❌ **23** | ✅ **0** |
| Berkas Bapak `Pengantar Sejarah Alkitab.md` | banyak gagal | ✅ **44 istilah diuji → 0 gagal · 0 arti kosong** |
| Kalimat Indonesia biasa salah tanda | — | ✅ tidak ada (uji “Rumah-rumah itu besar…” → 0 tanda) |

- **Uji baru:** **K50-01…K50-14** di `tools/uji-cepat.js` → semuanya **OK** di Chrome nyata
  (klik sungguhan pada tautan “suci” → halaman arti terbuka, **756 huruf**, tanpa pesan “tidak ditemukan”).
- 🏷️ **Penanda versi** `plugin/kamus/tampilan.js` → **`v21Sep-a`** + `ANodesKamusTampilan.versi()`.
- 💾 **Backup rollback:** `backups/kamus-link-kosong-20260921-184444/`.
- ➕ `plugin/kamus/plugin.js` — angka keterangan diperbarui **437 tulisan**.
- ⚠️ **PELAJARAN:** kalau ada **DUA sumber nama** (nama resmi vs alias), pencarian **WAJIB** mengenal
  **keduanya** — jangan hanya alias. **Nama resmi itulah yang disimpan di setiap tautan.**

---

## 20 September 2026 — 🐞 K49: **BERKAS `.md` YANG ISINYA HTML TAMPIL JADI KODE** (diperbaiki)

> Laporan Bapak: *“saya buka file .md di hp menggunakan ANodes-1berkas hasilnya ada script html
> terlihat tapi buka di PC bagus rapih.”*

**Sebabnya (diperiksa di Chrome nyata, bukan diduga):** berkas `cat/Pengantar Sejarah Alkitab-…md`
itu **isinya HTML** (`<h3>…</h3>`, `<p>…</p>`) — **bukan markdown**. Terukur:
**110 dari 131 baris (84 %) dimulai dengan tag HTML** · 23× `&nbsp;` · tag: `b/i/p/ul/ol/li/h2/h3/br/hr/span`.
`keHtmlImpor()` menganggapnya markdown → `aman()` meng-escape `<` jadi `&lt;` → **tag TAMPIL SEBAGAI TULISAN**.

> ⚠️ **Hasilnya SEBENARNYA SAMA di HP & PC** — bedanya hanya **keadaan catatan**
> (di HP catatan sudah berisi tag mentah dari percobaan sebelumnya). Sudah dibuktikan:
> panjang hasil & rasio tag **sama persis** di kedua tempat.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Tag tampil sebagai tulisan (`&lt;`) | ❌ **ADA** | ✅ **TIDAK ADA** |
| `&nbsp;` mentah | ❌ 23× terlihat | ✅ hilang |
| Judul | 0 | ✅ **12** |
| Paragraf | 1 blok raksasa | ✅ **24** |
| Daftar (`<li>`) | 0 | ✅ **48** |
| Tebal (`<b>`) | ❌ hilang | ✅ **terpelihara** |
| Miring (`<i>`) | ❌ hilang | ✅ **terpelihara** |

**Perbaikan (`js/editor.js`) — 3 hal:**
1. **`isiHtml(teks)`** — pengenal yang **hati-hati**: (a) SEMUA baris mulai tag + ada tag penutup
   (boleh pendek), ATAU (b) ≥5 baris & ≥35 % mulai tag. Blok kode ```` ``` ```` **selalu dikecualikan**.
2. **`htmlKeMarkdownImpor(html)`** — HTML → markdown lewat penelusuran **TERTULIS**
   (beda dari `htmlKeMarkdown()` yang hanya membaca anak langsung; berkas impor bisa punya
   `<p>` di dalam `<blockquote>`/`<div>`). Membuang `<script>/<style>/<iframe>/<form>`, aman.
3. **`keHtmlImpor()`** memakai keduanya lebih dulu; pengait **paste** juga (tempelan HTML dari AI).

**🐞 BUG NYATA IKUT KETEMU** (dari uji **K49-14**): penanda sementara `%%ANODES_GARIS%%`
**bocor ke tampilan** saat **impor berkas** — sebab `hiaskanNaskah()` (yang mengganti penanda itu)
**hanya dipanggil jalur TEMPEL**, bukan jalur impor. ⇒ dibuat **`gantiTandaGaris()`** +
**`rapikanTandaGarisHtml()`** yang dipanggil **kedua** jalur. ❌ Jangan dihapus.

**Regresi dijaga (5 uji):** markdown biasa · markdown yang MENYEBUT tag di kalimat ·
blok kode ```` ``` ```` berisi HTML · teks pendek · baris tulis `____` — **semuanya tetap seperti dulu**.

**Uji:** blok **K49-01…K49-15** (15 uji baru) → **290 uji, 0 gagal** di Chrome nyata.
**💾 Backup:** `backups/k49-impor-html-20260920-222440/` (editor.js · uji-cepat.js · contoh berkas).

> ✅ **DIKONFIRMASI BAPAK 20 Sep 2026:** *“ok sudah benar”* — berkas
> `cat/Pengantar Sejarah Alkitab- Bagaimana Firman Menjadi Tulisan.md` yang diimpor lewat
> **File → ⤒ Impor…** sekarang tampil **rapi** (judul · paragraf · daftar · tebal · miring),
> dan **tetap rapi** sesudah disimpan lalu dibuka ulang.
>
> 📌 **Catatan penting untuk dipahami:** tombol **📂 Open** di menu File itu bukan pembuka berkas —
> fungsinya **menampilkan panel daftar catatan**. Berkas `.md`/`.txt` dibuka lewat **⤒ Impor…**.
> ⚠️ Catatan LAMA yang isinya masih tag mentah **tidak memperbaiki diri sendiri** — harus **diimpor ulang**
> (File → ⤒ Impor… → pilih berkas yang sama → **OK** = ganti isi).

---

## 20 September 2026 — 🎉 K45: **KITAB KE-22 = PENGKHOTBAH TUNTAS** (12 pasal · 222 ayat · GAYA TAFSIR · KITAB BARU)

> Order Bapak: *“lanjut pengkhotbah”* ⇒ **PENGKHOTBAH**, **kitab BARU** — **kitab ke-22** penguat.
> Kitab **BARU** ⇒ **3 langkah setup** dijalani dulu: kerangka `data/komentar/21.json` ·
> `DATA_FILES` di `tools/build-lab3.js` · `muatData('komentar-21')` + gabung di `lab3.html`.
> Gaya tulisan = **GAYA TAFSIR** (seperti Matius/1–2 Samuel · Amsal).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Berkas `data/komentar/21.json` | ❌ belum ada | ✅ **ada** (94,5 KB) |
| Cakupan Pengkhotbah | 0 ayat | ✅ **pasal 1–12 = 222 ayat (100 %)** |
| `tools/build-lab3.js` | 21 kitab | ➕ `data/komentar/21.json` |
| `lab3.html` | 21 × `muatData` | ➕ `muatData('komentar-21', …)` + gabung `komentarData` |
| `android/lab3-offline.html` | 20,69 MB | **20,78 MB** |
| Gaya (`cek-gaya-penguat.js`) | — (kitab baru) | ✅ **pola “N hal” 0 %** · ulang **37 %** · panjang **325 %** |
| Total penguat | 21.247 ayat (21 kitab) | **21.469 ayat (22 kitab · ±69 % Alkitab)** |
| HP `ANodes-1berkas.html` | 20,8 MB | **20,89 MB** · penanda **`v19Sep-y` → `v19Sep-z`** |
| Data penguat ANodes | 9.004,4 KB · sidik `-e34fcf3d` | **9.095,7 KB** · sidik **`-d25e2a80`** ✅ BERUBAH |

**6 giliran:** 1 (1–2) · 2 (3–4) · 3 (5–6) · 4 (7–8) · 5 (9–10) · 6 (11–12).

✅ **Dibuktikan** `cek-penguat.js 21` → **12 pasal cocok SEMUA**
(**p7=29 terpanjang** · p2=26 · p3=22 · p5=20 · p10=20 · p1=18 · p9=18 · p8=17 · p4=16 ·
p12=14 · p6=12 · **p11=10 terpendek**) · `21.1.1 → ADA` · `21.12.14 → ADA` ·
**berkas terdaftar ADA** · tidak ada kunci kembar · `21.json` tetap **222 ayat**.
✅ **Data ANodes dibuktikan memuat teks BARU:** sidik `-e34fcf3d` → **`-d25e2a80`** ·
teks `21.1.2` (“kesia-siaan belaka”) · `21.3.1` (“ada masanya”) · `21.3.11` (“indah pada waktunya”) ·
`21.12.1` (“mengingat Pencipta”) · `21.12.13` (“takutlah akan Allah”) terbaca di `ANodes-1berkas.html`.
➕ **Uji baru (`tools/uji-cepat.js`):** **K47-15o** (Pengkhotbah baru) · **K47-15p** (bukan gaya RINCIAN) ·
**K47-15q** (panjang > 150 huruf/ayat). Juga diperbarui **K47-08** (21→22 kitab) ·
**K47-09** (21.247→21.469) · **K47-10** (+`PM.kitabAda(21)`) · **K47-11** (+`PM.jumlahAyat(21) === 222`) ·
**K47-18** (`options.length === 22`). Uji blok K47: **275 uji, 0 gagal** di **Chrome nyata**.
🗂️ **12 berkas batch** (94,7 KB) diarsipkan ke `bible/backup/komentar-batch-pengkhotbah/`.

**Hitungan per pasal Pengkhotbah (SUMBER KEBENARAN):**
`1=18 · 2=26 · 3=22 · 4=16 · 5=20 · 6=12 · 7=29 · 8=17 · 9=18 · 10=20 · 11=10 · 12=14` = **222**

### 🆕🔴 PELAJARAN BARU dari Pengkhotbah — “sehingga” DUA KALI dalam satu kalimat (jangan diulang)

⚠️ **Cacat ini muncul di 24 ayat** (paling banyak dari semua kitab): kalimat penutup ditulis
“… **sebab** A **sehingga** B, **sehingga** kita perlu C …”. Bunyinya kaku & tidak enak dibaca.
**Perbaikan:** buang “sehingga” pertama atau ganti dengan **“, dan”**.
**Cara memeriksa (salin tempel):**
```
node -e "const d=require('./data/komentar/NN.json').ayat; let s=[]; for(const k in d){const t=d[k]; const i=t.indexOf('Pelajarannya'); const c=i>=0?t.slice(i):''; if((c.match(/sehingga/g)||[]).length>1)s.push(k);} console.log(s.length,s.join(','));"
```
⚠️ Kalau ayat sudah digabung ke `NN.json` (berkas batch diarsipkan), **perbaiki langsung di `NN.json`**,
lalu jalankan **`bersih-dan-dan.js`** + **`build-lab3.js`** lagi.
⚠️ **Periksa SEBELUM pindah kitab** — jangan sampai cacat ini ikut ke kitab berikutnya.

---

## 20 September 2026 — 🎉 K45: **KITAB KE-21 = AMSAL TUNTAS** (31 pasal · 915 ayat · GAYA TAFSIR · KITAB BARU)

> Order Bapak: *“lanjut amsal”* ⇒ **AMSAL**, **kitab BARU** — **kitab ke-21** penguat.
> Kitab **BARU** ⇒ **3 langkah setup** dijalani dulu: kerangka `data/komentar/20.json` ·
> `DATA_FILES` di `tools/build-lab3.js` · `muatData('komentar-20')` + gabung di `lab3.html`.
> Gaya tulisan = **GAYA TAFSIR** (seperti Matius/1–2 Samuel · 1 Raja-raja…Ester).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Berkas `data/komentar/20.json` | ❌ belum ada | ✅ **ada** (343,2 KB) |
| Cakupan Amsal | 0 ayat | ✅ **pasal 1–31 = 915 ayat (100 %)** |
| `android/lab3-offline.html` | 20,6 MB | **20,69 MB** |
| Gaya (`cek-gaya-penguat.js`) | — (kitab baru) | ✅ **pola “N hal” 0 %** · ulang **33 %** · panjang **398 %** |
| Total penguat | 20.332 ayat (20 kitab) | **21.247 ayat (21 kitab)** |
| HP `ANodes-1berkas.html` | 20,96 MB | **20,8 MB** · penanda **`v19Sep-x` → `v19Sep-y`** |
| Data penguat ANodes | 8.411,2 KB · sidik `-5fb28ef5` | **9.004,4 KB** · sidik **`-e34fcf3d`** ✅ BERUBAH |

**16 giliran:** 1 (1–2) · 2 (3–4) · 3 (5–6) · 4 (7–8) · 5 (9–10) · 6 (11–12) · 7 (13–14) ·
8 (15–17) · 9 (18–19) · 10 (20–21) · 11 (22–23) · 12 (24) · 13 (25–26) · 14 (27–28) ·
15 (29–30) · 16 (31).

✅ **Dibuktikan** `cek-penguat.js 20` → **31 pasal cocok SEMUA**
(**p8=36 terpanjang** · p3=35 · p6=35 · p14=35 · p23=35 · **p9=18 terpendek** · p2=22) ·
`20.1.1 → ADA` · `20.31.31 → ADA` · **berkas terdaftar ADA** · tidak ada kunci kembar.
✅ **Data ANodes dibuktikan memuat teks BARU:** sidik `-5fb28ef5` → **`-e34fcf3d`** ·
teks `20.1.7` (“takut akan TUHAN”) · `20.3.5` (“percaya kepada TUHAN”) · `20.22.6` (“didiklah orang muda”) ·
`20.31.10` (“lebih berharga daripada permata”) · `20.31.30` (“kemolehan adalah bohong”) terbaca
di `ANodes-1berkas.html`.
➕ **Uji baru (`tools/uji-cepat.js`):** **K47-15l** (Amsal baru) · **K47-15m** (bukan gaya RINCIAN) ·
**K47-15n** (panjang > 150 huruf/ayat). Juga diperbarui **K47-08** (20→21 kitab) ·
**K47-09** (20.332→21.247) · **K47-10** (+`PM.kitabAda(20)`) · **K47-11** (+`PM.jumlahAyat(20) === 915`) ·
**K47-18** (`options.length === 21`). Uji blok K47: **272 uji, 0 gagal** di **Chrome nyata**.
🗂️ **31 berkas batch** (344,7 KB) diarsipkan ke `bible/backup/komentar-batch-amsal/`.

**Hitungan per pasal Amsal (SUMBER KEBENARAN):**
`1=33 · 2=22 · 3=35 · 4=27 · 5=23 · 6=35 · 7=27 · 8=36 · 9=18 · 10=32 · 11=31 · 12=28 · 13=25 ·
14=35 · 15=33 · 16=33 · 17=28 · 18=24 · 19=29 · 20=30 · 21=31 · 22=29 · 23=35 · 24=34 · 25=28 ·
26=28 · 27=27 · 28=28 · 29=27 · 30=33 · 31=31` = **915**

### ⚠️ PELAJARAN dari Amsal (jangan diulang)

⚠️ **`bersih-dan-dan.js` memakan kata `dan` yang SAH — POLA BARU:** terjadi di `20.16.29`.
Kata **“teladan”** berakhir dengan **`-dan`**, lalu diikuti kata `dan` ⇒ alat melihat
“…teladan **dan** dengan…” sebagai pola `dan dan` lalu membuangnya.
⇒ **ATURAN:** kalau ada kata berakhiran `-dan` (`teladan` · `Adan` · `badan` …) diikuti kata `dan`,
**periksa hasil pembersihan** — jangan langsung percaya “✅ Bersih”.
**Perbaikan aman:** ubah susunan kalimat (pakai “serta” / tanda koma) supaya alat tidak salah makan.

---

## 20 September 2026 — 🎉 K45: **9 KITAB BARU TUNTAS (2 Raja-raja s/d Ester)** — 4.083 ayat · GAYA TAFSIR

> Sesudah 10 kitab tafsir ulang selesai & 1 Raja-raja tuntas, delapan kitab **BARU** berikutnya
> dikerjakan berurutan. Semua pakai **3 langkah setup** (kerangka `NN.json` dengan `meta` ·
> `DATA_FILES` `tools/build-lab3.js` · `muatData('komentar-NN')` + gabung di `lab3.html`).

| # | Kitab | bookId | Pasal | Ayat | Berkas | pola | ulang | panjang |
|---|---|---|---|---|---|---|---|---|
| 15 | 2 Raja-raja | 12 | 25 | **719** | `12.json` | 0 % | 29 % | 276 % |
| 16 | 1 Tawarikh | 13 | 29 | **942** | `13.json` | 0 % | 29 % | 458 % |
| 17 | 2 Tawarikh | 14 | 36 | **822** | `14.json` | 0 % | 38 % | 298 % |
| 18 | Ezra | 15 | 10 | **280** | `15.json` | 0 % | 35 % | 415 % |
| 19 | Nehemia | 16 | 13 | **406** | `16.json` **178,5 KB** | 0 % | 34 % | 432 % |
| 20 | Ester | 17 | 10 | **167** | `17.json` **81,6 KB** | 0 % | 42 % | 278 % |

**Total sesudah 8 kitab baru: 20.332 ayat (20 kitab).** Penanda versi naik bertahap sampai
**`v19Sep-x`** · HP `ANodes-1berkas.html` **20,96 MB** · uji blok K47 **269 uji, 0 gagal**.
🗂️ Berkas batch diarsipkan per kitab ke `bible/backup/komentar-batch-<kitab>/`
(2raja-raja · 1tawarikh · 2tawarikh · ezra · nehemia · ester).

### ⚠️ 4 PELAJARAN dari rangkaian ini (jangan diulang)

| # | Pelajaran |
|---|---|
| 1 | **`bersih-dan-dan.js` memakan kata `dan` SAH** — 2 Raja-raja `12.6.4` · 1 Tawarikh `13.23.7` · Ezra `15.2.59` (**“Adan dan Imer”**). ⇒ **Setiap laporan “🧹 Dibersihkan: N” WAJIB diperiksa.** |
| 2 | **Pasal panjang wajib lengkap** — **Ezra 2 = 70** · **Ezra 10 = 44** · **Nehemia 7 = 73** · **Nehemia 12 = 47** · **1 Tawarikh 11 = 47**. ⇒ selalu pakai `lihat-pasal.js`, ❌ jangan menebak. |
| 3 | **Kata kunci uji wajib diambil dari data asli** — 2 Tawarikh: `14.6.14` **tidak** memuat “merendahkan diri” (itu di `14.7.14`); Ester: `17.4.14` sebenarnya “untuk saat yang seperti **itu**” & `17.4.16` “biarlah **ia** mati” (tebakan pertama salah). ⇒ pakai `node -e "…includes(…)"`. |
| 4 | **Cacat tulisan ketemu sebelum gabung** — Nehemia `16.7.18` (“called”) · 2 Tawarikh kalimat tergesa. ⇒ jalankan pemeriksa cacat tiap kitab. |

---

## 20 September 2026 — 🎉 K45: **KITAB KE-14 = 1 RAJA-RAJA TUNTAS** (22 pasal · 816 ayat · GAYA TAFSIR · KITAB BARU)

> Order Bapak: *“lanjut 1 raja-raja”* ⇒ **1 RAJA-RAJA**, **kitab BARU** (belum pernah ada) — **kitab ke-14** penguat
> dan kitab **pertama** sesudah 10 kitab tafsir ulang selesai.
> Kitab **BARU** ⇒ **3 langkah setup** dijalani dulu: kerangka `data/komentar/11.json` ·
> `DATA_FILES` di `tools/build-lab3.js` · `muatData('komentar-11')` + gabung di `lab3.html`.
> Gaya tulisan = **GAYA TAFSIR** (seperti Matius/1–2 Samuel).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Berkas `data/komentar/11.json` | ❌ belum ada | ✅ **ada** (129,5 KB) |
| Cakupan 1 Raja-raja | 0 ayat | ✅ **pasal 1–22 = 816 ayat (100 %)** |
| `tools/build-lab3.js` | 13 kitab | ➕ `data/komentar/11.json` |
| `lab3.html` | 13 × `muatData` | ➕ `muatData('komentar-11', …)` + gabung `komentarData` |
| `android/lab3-offline.html` | 18,50 MB | **18,9 MB** |
| Gaya (`cek-gaya-penguat.js`) | — (kitab baru) | ✅ **pola “N hal” 0 %** · ulang **40 %** · panjang **309 %** |
| Total penguat | 16.180 ayat (13 kitab) | **16.996 ayat (14 kitab · ±55 % Alkitab)** |
| HP `ANodes-1berkas.html` | 18,64 MB | **18,9 MB** · penanda **`v19Sep-q` → `v19Sep-r`** |
| Data penguat ANodes | 6.824,8 KB · sidik `-0cbdb8de` | **7.198,4 KB** · sidik **`-c9eaa3cd`** ✅ BERUBAH |

**13 giliran:** 1 (1–2) · 2 (3–4) · 3 (5–6) · 4 (7) · 5 (8a · 1–35) · 6 (8b · 36–66) · 7 (9) ·
8 (10) · 9 (11–12) · 10 (13–14) · 11 (15–16) · 12 (17–18) · 13 (19–22).

✅ **Dibuktikan** `cek-penguat.js 11` → **22 pasal cocok SEMUA**
(**p8=66 terpanjang** · **p1=53** · p22=53 · p7=51 · p2=46 · p18=46 · **p5=18 terpendek** · p19=21) ·
`11.1.1 → ADA` · `11.22.53 → ADA` · **berkas terdaftar ADA** · tidak ada kunci kembar.
✅ **Data ANodes dibuktikan memuat teks BARU:** sidik `-0cbdb8de` → **`-c9eaa3cd`** ·
teks `11.3.9` (“hati yang faham menimbang”) · `11.17.1` (“embun atau hujan”) · `11.18.38` (“api TUHAN”) ·
`11.19.18` (“tujuh ribu”) · `11.22.53` (“beribadah kepada Baal”) terbaca di `ANodes-1berkas.html`.
➕ **Uji baru (`tools/uji-cepat.js`):** **K47-14q** (1 Raja-raja baru) · **K47-14r** (tidak lagi bergaya RINCIAN) ·
**K47-14s** (panjang > 150 huruf/ayat). Juga diperbarui **K47-08** (13→14 kitab) · **K47-09** (16.180→16.996) ·
**K47-10** (+`PM.kitabAda(11)`) · **K47-11** (+`PM.jumlahAyat(11) === 816`) · **K47-18** (`options.length === 14`).
🗂️ **23 berkas batch** (384,2 KB) diarsipkan ke `bible/backup/komentar-batch-1raja-raja/`.
📦 **Sidik data baru (14 kitab · 16.996 ayat):**
`14-16996-1:1533,2:1213,4:1288,5:959,9:810,10:695,11:816,18:1070,19:2461,23:1292,24:1364,26:1273,40:1071,42:1151-c9eaa3cd`.

### ⚠️ PELAJARAN dari 1 Raja-raja (jangan diulang)

| # | Pelajaran |
|---|---|
| 1 | **Pasal panjang wajib dipecah:** **1 Raja-raja 8 = 66 ayat** (TERPANJANG) ⇒ `_batch-11-8a.json` (1–35) + `_batch-11-8b.json` (36–66) = 35+31=66 ✅. |
| 2 | **`bersih-dan-dan.js` memakan kata `dan` yang SAH di `11.2.8`** (laporan “🧹 Dibersihkan: 2 perbaikan”) ⇒ ayat ditulis ulang untuk memulihkan struktur kalimat. **Setiap laporan “🧹 Dibersihkan” WAJIB diperiksa.** |
| 3 | **Cacat tulisan yang ketemu & diperbaiki sebelum gabung:** `11.1.14` “menukik menyokong”→“dan menyokong” · `11.2.17` “Bicarkanlah”→“supaya dibicarakan” · `11.2.40` “melanai”→“memasang pelana” · `11.2.44` “yang kuperbuat”→“yang kauperbuat” · `11.5.18` “bagunan”→“bangunan” · `11.10.27` “Luk 12:15”→“Lukas 12:15” · `11.12.31` “mengubahtatanan”→“mengubah tatanan” · `11.15.15` “dahulumenunggu”→“dahulu menunggu” · `11.16.1` “jala kehancurannya”→“jalannya sendiri menuju kehancuran” · `11.22.44` “pemerintahaannya”→“pemerintahannya” · `11.17.13` “daripadaNya”→“daripadanya” · `11.13.34` baris baru liar di nilai JSON. |
| 4 | **Nama kitab di rujukan silang wajib LENGKAP** (“Lukas”, bukan “Luk”) dan nama ALLAH pakai huruf besar semua (“ALLAH”). |
| 5 | **Atribusi kitab dalam kalimat jangan salah** — 1 Raja-raja bukan “Kitab Tawarikh”; pakai “penulis kitab ini” bila ragu. |

⏭️ **BERIKUTNYA = kitab ke-15 = 2 RAJA-RAJA** (bookId **12** · 25 pasal · 719 ayat) — kitab **BARU** ⇒ **3 langkah setup wajib** · **gaya tetap TAFSIR**.

## 20 September 2026 — 🎉 K45: **TAFSIR ULANG #10 = MAZMUR TUNTAS** (150 pasal · 2.461 ayat · GAYA TAFSIR) · **10 KITAB SELESAI**

> Order Bapak: *“lanjut mazmur”* ⇒ **MAZMUR**, kitab **kesepuluh** — dan **TERAKHIR** — dari
> **10 kitab lama** yang ditulis ulang dari **GAYA RINCIAN** (pola “dinyatakan dengan N hal” **13 %**)
> menjadi **GAYA TAFSIR** seperti Matius/1–2 Samuel/Lukas/Ayub/Keluaran/Ulangan/Yesaya/Yehezkiel/Bilangan/Kejadian/Yeremia.
> Kitab **sudah ada** ⇒ tidak perlu 3 langkah setup; pakai `_batch-19-<pasal>.json` →
> `tambah-komentar.js` **menimpa** (`ditimpa: N` = bukti).
> ⚠️ **Mazmur 119 = 176 ayat (terpanjang di Alkitab)** dipecah 4 berkas; **Mazmur 78 = 72 ayat** dipecah 2.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Gaya Mazmur (`cek-gaya-penguat.js`) | **pola “N hal” 13 %** · ulang 70 % · panjang 123 % | ✅ **pola 0 %** · ulang **28 %** · panjang **414 %** |
| `data/komentar/19.json` | 355,9 KB | **1.009,5 KB** |
| `android/lab3-offline.html` | 17,86 MB | **18,50 MB** |
| HP `ANodes-1berkas.html` | 18,00 MB | **18,64 MB** · penanda **`v19Sep-p` → `v19Sep-q`** |
| Data penguat ANodes | 6.170,9 KB · sidik `-9138a153` | **6.824,8 KB** · sidik **`-0cbdb8de`** ✅ BERUBAH |

**35 giliran:** 1 (1–6) · 2 (7–11) · 3 (12–17, 19–20) · 4 (18) · 5 (21–24) · 6 (25–28) ·
7 (29–34) · 8 (35–36) · 9 (37) · 10 (38–43) · 11 (44–50) · 12 (51–58) · 13 (59–67) ·
14 (68) · 15 (69) · 16 (70–73) · 17 (74–77) · 18 (78 · 2 berkas) · 19 (79–83) ·
20 (84–88) · 21 (89) · 22 (90–95) · 23 (96–102) · 24 (103–104) · 25 (105) · 26 (106) ·
27 (107–108) · 28 (109–114) · 29 (115–118) · **30a–30d (119 · 4 berkas)** · 31 (120–129) ·
32 (130–136) · 33 (137–142) · 34 (143–147) · 35 (148–150).

| Sesudah giliran | Pola “N hal” | Kata ulang | Panjang |
|---|---|---|---|
| 31 (ps 120–129) | 33 % | 33 % | 382 % |
| 32 (ps 130–136) | 31 % | 31 % | 392 % |
| 33 (ps 137–142) | 30 % | 30 % | 400 % |
| 34 (ps 143–147) | 28 % | 28 % | 410 % |
| 35 (ps 148–150) | ✅ **0 %** | **28 %** | **414 %** |

✅ **Dibuktikan** `cek-penguat.js 19` → **150 pasal cocok SEMUA** (p119=176 terpanjang ·
p78=72 · p89=52 · p18=50 · p117=2 terpendek · p150=6) · `19.1.1 → ADA` · `19.150.6 → ADA` ·
**berkas terdaftar ADA** · tidak ada kunci kembar · `19.json` tetap **2.461 ayat** (murni **ditimpa**).
✅ **Data ANodes dibuktikan memuat teks BARU:** sidik `-9138a153` → **`-0cbdb8de`** ·
teks `19.23.1` (“gembalaku”) · `19.119.105` (“pelita bagi kakinya”) · `19.150.6` (“segala yang bernafas”)
terbaca di `ANodes-1berkas.html` (13 kitab · 16.180 ayat · Mazmur **2.461** · versi **`v19Sep-q`**).
➕ **Uji baru (`tools/uji-cepat.js`):** **K47-14n** (Mazmur: “gembalaku” 23:1 · “pelita bagi” 119:105 ·
“segala yang bernafas” 150:6) · **K47-14o** (Mazmur tidak lagi bergaya RINCIAN) ·
**K47-14p** (panjang > 150 huruf/ayat).
🗂️ **39 berkas batch** (1.011,8 KB) diarsipkan ke `bible/backup/komentar-batch-mazmur-tafsirulang/`.

### 🎉 10 KITAB TAFSIR ULANG SELESAI — 13.604 AYAT

| # | Kitab | bookId | Ayat | pola | ulang | panjang | selesai |
|---|---|---|---|---|---|---|---|
| 1 | Lukas | 42 | 1.151 | 100 → **0 %** | 97 → 21 % | 103 → 327 % | 19 Sep |
| 2 | Ayub | 18 | 1.070 | 100 → **0 %** | 98 → 28 % | 103 → 364 % | 19 Sep |
| 3 | Keluaran | 2 | 1.213 | 100 → **0 %** | 93 → 30 % | 100 → 309 % | 19 Sep |
| 4 | Ulangan | 5 | 959 | 100 → **0 %** | 93 → 26 % | 100 → 414 % | 19 Sep |
| 5 | Yesaya | 23 | 1.292 | 77 → **15 %** | 93 → 43 % | 105 → 320 % | 19 Sep |
| 6 | Yehezkiel | 26 | 1.273 | 49 → **0 %** | 92 → 27 % | 118 → 358 % | 20 Sep |
| 7 | Bilangan | 4 | 1.288 | 41 → **0 %** | 84 → 28 % | 123 → 519 % | 20 Sep |
| 8 | Kejadian | 1 | 1.533 | 23 → **0 %** | 79 → 18 % | 102 → 368 % | 20 Sep |
| 9 | Yeremia | 24 | 1.364 | 18 → **0 %** | 84 → 35 % | 117 → 253 % | 20 Sep |
| 10 | **Mazmur** | 19 | **2.461** | 13 → **0 %** | 70 → **28 %** | 123 → **414 %** | **20 Sep** |

⚠️ **MATIUS (0 % · ulang 46 % · 120 %) & 1 SAMUEL (0 % · ulang 33 % · 200 %) = PATOKAN — jangan diubah.**
⏭️ ~~BERIKUTNYA = kitab ke-14 = 1 RAJA-RAJA~~ ⇒ ✅ **SUDAH SELESAI — dan akhirnya SELURUH 66 KITAB TUNTAS 21 Sep 2026** (lihat entri paling atas).
📦 **Sidik data baru (13 kitab · 16.180 ayat):**
`13-16180-1:1533,2:1213,4:1288,5:959,9:810,10:695,18:1070,19:2461,23:1292,24:1364,26:1273,40:1071,42:1151-0cbdb8de`.

## 20 September 2026 — ✅ K45: **TAFSIR ULANG #9 = YEREMIA TUNTAS** (52 pasal · 1.364 ayat · GAYA TAFSIR)

> Order Bapak: *“lanjut yeremia sampai selesai 52 pasal”* ⇒ **YEREMIA**, kitab **kesembilan** dari
> **10 kitab lama** yang ditulis ulang dari **GAYA RINCIAN** (pola “dinyatakan dengan N hal” **18 %**)
> menjadi **GAYA TAFSIR** seperti Matius/1–2 Samuel/Lukas/Ayub/Keluaran/Ulangan/Yesaya/Yehezkiel/Bilangan/Kejadian.
> Kitab **sudah ada** ⇒ tidak perlu 3 langkah setup; pakai `_batch-24-<pasal>.json` →
> `tambah-komentar.js` **menimpa** (`ditimpa: N` = bukti).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Gaya Yeremia (`cek-gaya-penguat.js`) | **pola “N hal” 18 %** · ulang 84 % · panjang 117 % | ✅ **pola 0 %** · ulang **35 %** · panjang **253 %** |
| `data/komentar/24.json` | 305,3 KB | **563,7 KB** |
| `android/lab3-offline.html` | 17,8 MB | **17,86 MB** |
| HP `ANodes-1berkas.html` | 17,73 MB | **18,00 MB** · penanda **`v19Sep-o` → `v19Sep-p`** |
| Data penguat ANodes | 5.912,4 KB · sidik `-70372599` | **6.170,9 KB** · sidik **`-9138a153`** ✅ BERUBAH |

**27 giliran:** 1 (1–2) · 2 (3–4) · 3 (5–6) · 4 (7–8) · 5 (9–10) · 6 (11–12) ·
7 (13–14) · 8 (15–16) · 9 (17–18) · 10 (19–21) · 11 (22–23) · 12 (24–25) ·
13 (26–28) · 14 (29–30) · 15 (31) · 16 (32) · 17 (33–34) · 18 (35–37) · 19 (38–39) ·
20 (40–42) · 21 (43–45) · 22 (46–47) · 23 (48) · 24 (49) · 25 (50) · 26 (51) · 27 (52).

| Sesudah giliran | Pola “N hal” | Kata ulang | Panjang |
|---|---|---|---|
| 22 (ps 46–47) | 0 % | 43 % | 223 % |
| 23 (ps 48) | 0 % | 42 % | 231 % |
| 24 (ps 49) | 0 % | 40 % | 236 % |
| 25 (ps 50) | 0 % | 39 % | 241 % |
| 26 (ps 51) | 0 % | 36 % | 248 % |
| 27 (ps 52) | ✅ **0 %** | **35 %** | **253 %** |

✅ **Dibuktikan** `cek-penguat.js 24` → **52 pasal cocok SEMUA** (p51=64 terpanjang · p48=47 ·
p50=46 · p32=44 · p23=40 · p31=40 · p49=39 · p25=38 · **p45=5 terpendek** · p47=7 · p24=10) ·
`24.1.1 → ADA` · `24.52.34 → ADA` · **berkas terdaftar ADA** · tidak ada kunci kembar ·
`24.json` tetap **1.364 ayat** (murni **ditimpa**).
✅ **Data ANodes dibuktikan memuat teks BARU:** sidik `-70372599` → **`-9138a153`** ·
teks `24.1.5` · `24.29.11` (“damai sejahtera”) · `24.31.33` (“Perjanjian baru”) · `24.52.34` terbaca.
➕ **Uji baru (`tools/uji-cepat.js`):** **K47-14k** (Hilkia 1:1 · damai sejahtera 29:11 ·
Perjanjian baru 31:33 · hari matinya 52:34) · **K47-14l** (tidak lagi bergaya RINCIAN) ·
**K47-14m** (panjang > 150 huruf/ayat). Semuanya **LULUS**.
🗂️ **27 berkas batch** (565,3 KB) diarsipkan ke `bible/backup/komentar-batch-yeremia-tafsirulang/`.
📦 **Sidik data baru (13 kitab · 16.180 ayat):**
`13-16180-1:1533,2:1213,4:1288,5:959,9:810,10:695,18:1070,19:2461,23:1292,24:1364,26:1273,40:1071,42:1151-9138a153`.
🔴 **Sisa 1 kitab: MAZMUR** (bookId 19 · 150 pasal · 2.461 ayat · pola 13 % · ulang 70 %) — kitab TERAKHIR.
ℹ️ **Catatan:** 19 ayat Yeremia memakai frasa **“dinyatakan dengan”** secara WAJAR (bukan pola RINCIAN)
⇒ uji HARUS memakai pola lengkap `dinyatakan dengan (satu..tujuh) hal:` (jangan `indexOf` mentah).
⚠️ Cacat tulisan yang diperbaiki: `24.48.39` “perlakukan”→“perlakuan” · `24.49.17` “permanent”→“tetap” ·
`24.51.61` “diusa hakan”→“diusahakan”.

## 20 September 2026 — ✅ K45: **TAFSIR ULANG #8 = KEJADIAN TUNTAS** (50 pasal · 1.533 ayat · GAYA TAFSIR)

> Order Bapak: *“lanjut kejadian”* ⇒ **KEJADIAN**, kitab **kedelapan** dari **10 kitab lama**
> yang ditulis ulang dari **GAYA RINCIAN** (pola “dinyatakan dengan N hal” **23 %**)
> menjadi **GAYA TAFSIR** seperti Matius/1–2 Samuel/Lukas/Ayub/Keluaran/Ulangan/Yesaya/Yehezkiel/Bilangan.
> Kitab **sudah ada** ⇒ tidak perlu 3 langkah setup; pakai `_batch-1-<pasal>.json` →
> `tambah-komentar.js` **menimpa** (`ditimpa: N` = bukti).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Gaya Kejadian (`cek-gaya-penguat.js`) | **pola “N hal” 23 %** · ulang 79 % · panjang 102 % | ✅ **pola 0 %** · ulang **18 %** (TERENDAH dari 14 kitab) · panjang **368 %** |
| `data/komentar/1.json` | 249,0 KB | **690,3 KB** |
| `android/lab3-offline.html` | 17,18 MB | **17,61 MB** |
| HP `ANodes-1berkas.html` | 17,3 MB | **17,73 MB** · penanda **`v19Sep-n` → `v19Sep-o`** |
| Data penguat ANodes | 5.471,1 KB · sidik `-bac1e563` | **5.912,4 KB** · sidik **`-70372599`** ✅ BERUBAH |

**25 giliran:** 1 (1–2) · 2 (3–4) · 3 (5–6) · 4 (7–8) · 5 (9–10) · 6 (11–12) ·
7 (13–14) · 8 (15–16) · 9 (17–18) · 10 (19–20) · 11 (21–22) · 12 (23–24) ·
13 (25–26) · 14 (27) · 15 (28–29) · 16 (30–31) · 17 (32–33) · 18 (34–35) ·
19 (36–37) · 20 (38–39) · 21 (40–41) · 22 (42–43) · 23 (44–45) · 24 (46–47) · 25 (48–50).

| Sesudah giliran | Pola “N hal” | Kata ulang | Panjang |
|---|---|---|---|
| 19 (ps 36–37) | 7 % | 35 % | 319 % |
| 20 (ps 38–39) | 6 % | 33 % | 328 % |
| 21 (ps 40–41) | 5 % | 29 % | 338 % |
| 22 (ps 42–43) | 3 % | 26 % | 346 % |
| 23 (ps 44–45) | 2 % | 24 % | 351 % |
| 24 (ps 46–47) | 2 % | 21 % | 359 % |
| 25 (ps 48–50) | ✅ **0 %** | **18 %** | **368 %** |

✅ **Dibuktikan** `cek-penguat.js 1` → **50 pasal cocok SEMUA** (p24=67 terpanjang · p41=57 ·
p31=55 · p49=33 · **p16=16 terpendek**) · `1.1.1 → ADA` · `1.50.26 → ADA` · **berkas terdaftar ADA** ·
tidak ada kunci kembar · `1.json` tetap **1.533 ayat** (murni **ditimpa**).
✅ **Data ANodes dibuktikan memuat teks BARU:** sidik `-bac1e563` → **`-70372599`**.
✅ **Diperiksa di Chrome NYATA** (`ANodes-1berkas.html`): 13 kitab · **16.180** ayat · Kejadian **1.533** ·
versi **`v19Sep-o`** · penguat 1:1 · 22:18 · 45:5 · 50:20 terbaca gaya TAFSIR baru.
➕ **Uji baru (`tools/uji-cepat.js`):** **K47-14h** · **K47-14i** · **K47-14j** (Kejadian) — **LULUS**.
🗂️ **25 berkas batch** (691,8 KB) diarsipkan ke `bible/backup/komentar-batch-kejadian-tafsirulang/`.
📦 **Sidik data baru (13 kitab · 16.180 ayat):**
`13-16180-1:1533,2:1213,4:1288,5:959,9:810,10:695,18:1070,19:2461,23:1292,24:1364,26:1273,40:1071,42:1151-70372599`.

### ⚠️ 4 pelajaran dari Kejadian (jangan diulang)

1. **`bersih-dan-dan.js` memakan kata `dan` yang SAH — 4×** (`1.13.12` · `1.47.18` · `1.48.7` · satu lagi
   di awal kitab) ⇒ **setiap laporan “🧹 Dibersihkan: N” WAJIB diperiksa**, lalu kata yang hilang dikembalikan.
2. **Kutip mentah `"` di dalam nilai JSON merusak berkas** (`_batch-1-16.json`) ⇒ jangan dipakai.
3. **Pengulangan kata berlebihan** — draft pertama `_batch-1-21.json` memakai “keadaan” **7×** dalam
   satu ayat (`1.41.1`) ⇒ berkas **dihapus & ditulis ulang**.
4. **Kata kunci uji K47 harus diambil dari data asli**, ❌ bukan dari ingatan (`1.1.1` **tidak** memuat
   “bermula”; yang ada **“bara”**).

⏭️ **BERIKUTNYA = YEREMIA** (bookId 24 · 52 pasal · 1.364 ayat · pola 18 % · **ulang 84 % = paling berat**).

## 20 September 2026 — ✅ K45: **TAFSIR ULANG #7 = BILANGAN TUNTAS** (36 pasal · 1.288 ayat · GAYA TAFSIR)

> Order Bapak: *“bilangan 36 pasal .. kira2 perlu berapa lama .. saya kuatir bisa keluar..
> atau pengerjaannya per 5 pasal”* lalu *“lanjut”* (3×) → *“bisa lanjut sampai selesai ..”*
> ⇒ **BILANGAN**, kitab **ketujuh** dari **10 kitab lama** yang ditulis ulang dari
> **GAYA RINCIAN** (pola “dinyatakan dengan N hal” **41 %**) menjadi **GAYA TAFSIR**.
> Kitab **sudah ada** ⇒ tidak perlu 3 langkah setup; pakai `_batch-4-<pasal>.json` →
> `tambah-komentar.js` **menimpa** (`ditimpa: N` = bukti).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Gaya Bilangan (`cek-gaya-penguat.js`) | **pola “N hal” 41 %** · ulang 84 % · panjang 123 % | ✅ **pola 0 %** · ulang **28 %** · panjang **519 %** (tertinggi dari 13 kitab) |
| `data/komentar/4.json` | 258,4 KB | **752,3 KB** |
| `android/lab3-offline.html` | 17,0 MB | **17,18 MB** |
| HP `ANodes-1berkas.html` | 16,80 MB | **17,3 MB** · penanda **`v19Sep-m` → `v19Sep-n`** |
| Data penguat ANodes | 4.977,2 KB · sidik `-0a23b575` | **5.471,1 KB** · sidik **`-bac1e563`** ✅ BERUBAH |

**18 giliran:** 1 (1–2) · 2 (3–4) · 3 (5–6) · 4 (7) · 5 (8–10) · 6 (11–12) ·
7 (13–14) · 8 (15–16) · 9 (17–18) · 10 (19–20) · 11 (21–22) · 12 (23–25) ·
13 (26) · 14 (27–28) · 15 (29–30) · 16 (31–32) · 17 (33) · 18 (34–36).

| Sesudah giliran | Pola “N hal” | Kata ulang | Panjang |
|---|---|---|---|
| 14 (ps 27–28) | 10 % | 42 % | 429 % |
| 15 (ps 29–30) | 6 % | 39 % | 440 % |
| 16 (ps 31–32) | 4 % | 34 % | 471 % |
| 17 (ps 33) | 4 % | 32 % | 494 % |
| 18 (ps 34–36) | ✅ **0 %** | **28 %** | **519 %** |

✅ **Dibuktikan** `cek-penguat.js 4` → **36 pasal cocok SEMUA** (p1=54 · **p7=89 terpanjang** ·
p26=65 · p33=56 · p31=54 · p3=51 · p16=50 · p4=49 · p14=45 · **p36=13 terpendek** ·
p17=13 · p12=16 · p30=16 · p25=18) · `4.1.1 → ADA` · `4.36.13 → ADA` ·
**berkas terdaftar ADA** · tidak ada kunci kembar · `4.json` tetap **1.288 ayat** (ditimpa).
✅ **Data ANodes memuat teks BARU**: sidik `-0a23b575` → **`-bac1e563`** · teks `4.21.9`
(“ular tembaga”) & `4.22.17` (“emas dan perak seistana penuh”) & `4.33.53` (“untuk diduduki”)
terbaca di `ANodes-1berkas.html` **dan** di Chrome nyata (13 kitab · 16.180 ayat · Bilangan **1.288** · versi **`v19Sep-n`**).
➕ **Uji baru (`tools/uji-cepat.js`)**: **K47-14e** (Bilangan 21:9 “ular tembaga” ·
22:17 “emas dan perak seistana penuh” · 33:53 “untuk diduduki”) · **K47-14f** (Bilangan tidak lagi
bergaya RINCIAN) · **K47-14g** (panjang > 150 huruf/ayat) — semuanya **LULUS**.
Blok K47: **239 uji, 0 gagal** di Chrome nyata.
🗂️ **18 berkas batch** (753,4 KB) diarsipkan ke `C:\data\bible\backup\komentar-batch-bilangan-tafsirulang\`.

⚠️ **PELAJARAN dari Bilangan (jangan diulang):**
1. **`bersih-dan-dan.js` bisa memakan kata `dan` yang SAH — muncul 3×** (`4.21.13` “di seberang
   Yordan **dan** menduduki…” · `4.34.12` “turun ke sungai Yordan **dan** berakhir…” · `4.35.14` 2×
   “…di seberang sungai Yordan **dan** tiga kota…”). **Setiap laporan “🧹 Dibersihkan: N” WAJIB
   diperiksa** lalu kata yang hilang dikembalikan.
2. **Pasal panjang wajib satu giliran sendiri:** **7=89** · **26=65** · **33=56** · **31=54** · **3=51**.
   **Terpendek: 36=13** · 17=13 · 12=16 · 30=16 · 25=18.
3. **Cacat tulisan yang ketemu & diperbaiki sebelum gabung:** `4.3.22` kata asing `hundred` +
   kalimat tanya salah tulis · `4.22.24` kalimat tanya salah tulis (“sebelah-menyebut? Tidak, …”).
4. **Kalimat tanya yang “menjawab sendiri”** (“X? Tidak, Y.”) adalah cacat yang muncul berulang —
   selalu periksa setelah menulis ayat panjang.

🔴 **PRIORITAS SEKARANG = TAFSIR ULANG 4 KITAB LAMA (sisa 5.358 ayat):**
⏭️ **Kejadian (1) 1.533 · Yeremia (24) 1.364 · Mazmur (19) 2.461.**

## 20 September 2026 — ✅ K45: **TAFSIR ULANG #6 = YEHEZKIEL TUNTAS** (48 pasal · 1.273 ayat · GAYA TAFSIR)

> Order Bapak: *“revisi 1. dan langsung proses tafsir Yeh”*
> ⇒ **YEHEZKIEL**, kitab **keenam** dari **10 kitab lama** yang ditulis ulang dari
> **GAYA RINCIAN** (pola “dinyatakan dengan N hal” **49 %**) menjadi **GAYA TAFSIR**.
> Kitab **sudah ada** ⇒ tidak perlu 3 langkah setup; pakai `_batch-26-<pasal>.json` →
> `tambah-komentar.js` **menimpa** (`ditimpa: N` = bukti).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Gaya Yehezkiel (`cek-gaya-penguat.js`) | **pola “N hal” 49 %** · ulang 92 % · panjang 118 % | ✅ **pola 0 %** · ulang **27 %** · panjang **358 %** |
| `data/komentar/26.json` | 313,3 KB | **675,5 KB** |
| `android/lab3-offline.html` | 16,3 MB | **16,7 MB** |
| HP `ANodes-1berkas.html` | 16,42 MB | **16,80 MB** · penanda **`v19Sep-l` → `v19Sep-m`** |
| Data penguat ANodes | 4.603,8 KB · sidik `-f32ef4ca` | **4.977,2 KB** · sidik **`-0a23b575`** ✅ BERUBAH |

**25 giliran:** 1 (1–2) · 2 (3–4) · 3 (5–6) · 4 (7–8) · 5 (9–10) · 6 (11–12) ·
7 (13–14) · 8 (15–16) · 9 (17) · 10 (18–19) · 11 (20) · 12 (21–22) · 13 (23–24) ·
14 (25–26) · 15 (27–28) · 16 (29–30) · 17 (31–32) · 18 (33–34) · 19 (35–36) ·
20 (37–38) · 21 (39–40) · 22 (41–42) · 23 (43–44) · 24 (45–46) · 25 (47–48).

| Sesudah giliran | Pola “N hal” | Kata ulang | Panjang |
|---|---|---|---|
| 19 (ps 35–36) | 11 % | 43 % | 299 % |
| 21 (ps 39–40) | 6 % | 37 % | 321 % |
| 23 (ps 43–44) | 2 % | 32 % | 339 % |
| 25 (ps 47–48) | ✅ **0 %** | **27 %** | **358 %** |

✅ **Dibuktikan** `cek-penguat.js 26` → **48 pasal cocok SEMUA** (p16=63 terpanjang · p20=49 ·
p23=49 · p40=49 · p36=38 · p48=35 · **p15=8 terpendek**) · `26.1.1 → ADA` · `26.48.35 → ADA` ·
**berkas terdaftar ADA** · tidak ada kunci kembar · `26.json` tetap **1.273 ayat** (ditimpa).
✅ **Data ANodes memuat teks BARU**: sidik `-f32ef4ca` → **`-0a23b575`** · teks `26.1.1`
(“penglihatan-penglihatan besar…”) & `26.48.35` (“TUHAN HADIR DI SITU”) terbaca di
`ANodes-1berkas.html` **dan** di Chrome nyata (13 kitab · 16.180 ayat · Yehezkiel **1.273** · versi **`v19Sep-m`**).
➕ **Uji baru (`tools/uji-cepat.js`)**: **K47-14b** (Yehezkiel 1:1 “Kebar” · 37:5 “nafas hidup” ·
48:35 “TUHAN HADIR DI SITU”) · **K47-14c** (Yehezkiel tidak lagi bergaya RINCIAN) ·
**K47-14d** (panjang > 150 huruf/ayat) — semuanya **LULUS**.
🗂️ **49 berkas batch** (677,9 KB) diarsipkan ke `C:\data\bible\backup\komentar-batch-yehezkiel-tafsirulang\`.

⚠️ **PELAJARAN dari Yehezkiel (jangan diulang):**
1. **Pasal 16 = 63 ayat** (terpanjang) → wajib dipecah **2 berkas** (`_batch-26-16a.json` 1–32 + `-16b.json` 33–63).
2. **Pasal 15 hanya 8 ayat** (terpendek) — **jangan menebak** jumlah ayat; pakai `lihat-pasal.js`.
3. **Cacat tulisan yang ketemu & diperbaiki sebelum gabung:** `_batch-26-3.json` **JSON rusak**
   (`"26.3.13"` ditutup `'` bukan `"`) · kata asing `now` · `mantral` · “nabi Kisah Para Rasul” &
   “nabi Imamat” (kitab, bukan nabi) · `batasbatas` · `perlaksana-Nya` · `dihitumg` · `peperanganpun` ·
   kalimat tanya salah tulis di 26.46.4 · karakter tak terlihat di 26.48.26 · `janji janji` di 26.48.29.

🔴 **PRIORITAS SEKARANG = TAFSIR ULANG 5 KITAB LAMA (sisa 6.646 ayat):**
⏭️ **Bilangan (4) 1.288 · Kejadian (1) 1.533 · Yeremia (24) 1.364 · Mazmur (19) 2.461.**

## 19 September 2026 — 🧹 K48: **KATA “BAPAK” DI SISTEM DIGANTI SEBUTAN UMUM** (bukan personal)

> Permintaan Bapak: *“sekilas terbaca ada keterangan pada sistem ANodes ini ada kata bapak ..
> diganti dengan kata yg umum dan jangan personal..”*

Semua teks yang **TAMPIL DI LAYAR** (keterangan plugin · konfirmasi · tombol) yang menyebut
“Bapak” diganti dengan sebutan umum: **pengguna · Anda · pengguna bisa · catatan pengguna**.

| Berkas | Yang diganti |
|---|---|
| `plugin/alkitab/plugin.js` | “yang **Bapak tulis**” → “yang **ditulis**” · “mengembalikan **Bapak**” → “mengembalikan **pengguna**” · “catatan **Bapak** tidak akan hilang” → “catatan **pengguna**” |
| `plugin/ayat-terkait/plugin.js` | “Ketika **Bapak** membaca” → “Ketika **membaca**” · “catatan **pengguna**” |
| `plugin/kamus/plugin.js` | “di dalam tulisan **Bapak**” → “di dalam **tulisan**” · “kamus istilah alkitab (**dari Bapak**)” → tanpa keterangan personal · “catatan **pengguna**” |
| `plugin/kamus/kamus.js` | komentar sumber arti → tanpa “(dari Bapak)” |
| `plugin/kamus/tampilan.js` | **“📝 catatan Bapak”** → **“📝 catatan pengguna”** · placeholder “tambahan **Bapak**” → “tambahan **Anda**” · pesan “💾 Catatan **pengguna** tersimpan” · “🗑 Catatan **pengguna** dikosongkan” · “disimpan di perangkat **ini** saja” |
| `plugin/penguat/plugin.js` | “catatan **pengguna**” · “**pengguna** bisa menilai” · **angka diperbarui** 4 kitab/6.429 ayat → **13 kitab / 16.180 ayat** (sebelumnya usang) · “Untuk sekarang **13 kitab** sudah punya penguat” |
| `plugin/pengingat/plugin.js` | “Ayat yang **ditandai** muncul kembali…” · “Ayat-ayat yang **ditandai** di catatan…” |
| `js/plugin.js` | konfirmasi lepas plugin: “Catatan **pengguna** tidak akan hilang — hanya kemampuan **plugin ini** yang dimatikan” |
| `js/dokumen.js` | “catatan **pengguna** tidak tersentuh” (3 tempat) |
| `js/dokumen.js`, `js/editor.js`, `plugin/*/*.js`, `css/app.css`, `index.html` | ❌ **komentar kode TIDAK diubah** — tidak tampil di layar, tetap berguna sebagai catatan sejarah keputusan |

⚠️ **Dokumen `.md` (rencanakerja/CHANGELOG/panduan/agents/prompt) TETAP memakai kata “Bapak”** —
itu catatan kerja internal, bukan bagian tampilan sistem.
✅ **Diperiksa di Chrome nyata:** semua halaman keterangan plugin (Alkitab · Ayat Terkait ·
Pembaca Penguat · Kamus · Pengingat) + gudang plugin → **tidak ada lagi kata “Bapak”**.
✅ **Ukuran HP** `ANodes-1berkas.html` tetap **16,43 MB** (hanya teks, tidak ada tambahan data).

## 19 September 2026 — ✅ K45: **TAFSIR ULANG #5 = YESAYA TUNTAS** (66 pasal · 1.292 ayat · GAYA TAFSIR)

> Order Bapak: *“sudah liat bagus / lanjut yesaya”* (sesudah Ulangan diperiksa)
> ⇒ **YESAYA**, kitab **kelima** dari **10 kitab lama** yang ditulis ulang dari
> **GAYA RINCIAN** (pola “dinyatakan dengan N hal” **77 %**) menjadi **GAYA TAFSIR**.
> Kitab **sudah ada** ⇒ tidak perlu 3 langkah setup; pakai `_batch-23-<pasal>.json` →
> `tambah-komentar.js` **menimpa** (`ditimpa: N` = bukti).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Gaya Yesaya (`cek-gaya-penguat.js`) | **pola “N hal” 77 %** · ulang 93 % · panjang 105 % | ✅ **pola 15 %** · ulang **43 %** · panjang **320 %** |
| `data/komentar/23.json` | 290,9 KB | **643,3 KB** |
| `android/lab3-offline.html` | 16,0 MB | **15,99 MB** |
| HP `ANodes-1berkas.html` | 16,07 MB | **16,42 MB** · penanda **`v19Sep-k` → `v19Sep-l`** |
| Data penguat ANodes | 4.251,4 KB · sidik `-aa9d4d10` | **4.603,8 KB** · sidik **`-f32ef4ca`** ✅ BERUBAH |

**21 giliran:** 1 (ps 1–3) · 2 (ps 4–6) · 3 (ps 7–9) · 4 (ps 10–12) · 5 (ps 13–15) · 6 (ps 16–18) ·
7 (ps 19–21) · 8 (ps 22–24) · 9 (ps 25–27) · 10 (ps 28–30) · 11 (ps 31–34) · 12 (ps 35–36) ·
13 (ps 37–38) · 14 (ps 39–40) · 15 (ps 41–42) · 16 (ps 43–44) · 17 (ps 45–46) · 18 (ps 47–48) ·
19 (ps 49–50) · 20 (ps 51–52) · 21 (ps 53–54).

✅ **Dibuktikan** `cek-penguat.js 23` → **66 pasal cocok SEMUA** (p37=38 terpanjang · p10=34 ·
p30=33 · p14=32 · p1=31 · p40=31 · **p4/12/20=6 terpendek**) · `23.1.1 → ADA` · `23.66.24 → ADA` ·
**berkas terdaftar ADA** · tidak ada kunci kembar · `23.json` tetap **1.292 ayat** (ditimpa).
✅ **Data ANodes memuat teks BARU**: sidik `-aa9d4d10` → **`-f32ef4ca`** · Yesaya 6:3 (“kudus, kudus, kudus”)
& 40:31 terbaca di `ANodes-1berkas.html` **dan** di Chrome nyata
(13 kitab · 16.180 ayat · Yesaya **1.292** · versi **`v19Sep-l`**).
➕ **Uji baru (`tools/uji-cepat.js`)**: **K47-13y** (Yesaya 6:3 “kudus” · 53:5 “bilur” · 40:31 “rajawali”) ·
**K47-13z** (Yesaya tidak lagi bergaya RINCIAN) · **K47-14a** (panjang > 150 huruf/ayat).
🗂️ **21 berkas batch** (592,1 KB) diarsipkan ke `C:\data\bible\backup\komentar-batch-yesaya-tafsirulang\`.

⚠️ **2 PELAJARAN dari Yesaya (jangan diulang):**
1. **`bersih-dan-dan.js` memakan kata sah 2×** — 23.9.1 (“angin **dan** tempat perlindungan”)
   & 23.34.11 (“burung undan **dan** landak”). **Setiap kali alat melaporkan “🧹 Dibersihkan”,
   PERIKSA ayat yang terkena.**
2. **Frasa “dinyatakan dengan” dipakai wajar** (Yesaya 53:5 “dinyatakan dengan sangat jelas”) ⇒
   uji **jangan** memakai `indexOf('dinyatakan dengan')` mentah — pakai kunci bersih
   (23.1.18 · 23.11.1 · 23.40.31).

🔴 **PRIORITAS SEKARANG = TAFSIR ULANG 5 KITAB LAMA (sisa 7.919 ayat):**
⏭️ **Yehezkiel (26) 1.273 · Bilangan (4) 1.288 · Kejadian (1) 1.533 · Yeremia (24) 1.364 · Mazmur (19) 2.461.**

## 19 September 2026 — ✅ K45: **TAFSIR ULANG #4 = ULANGAN TUNTAS** (34 pasal · 959 ayat · GAYA TAFSIR)

> Order Bapak: *“ulangan saya perhatikan sepertinya sudah ada tafsirannya .. apa masih ada pasal yg belum ?”*
> lalu *“iy benar.. saya tidak cek keseluruhan .. iya silahkan di timpa”*
> ⇒ **ULANGAN**, kitab **keempat** dari **10 kitab lama** yang ditulis ulang dari
> **GAYA RINCIAN** (pola “dinyatakan dengan N hal”) menjadi **GAYA TAFSIR**.
> ⚠️ **Pelajaran:** isi Ulangan **sudah lengkap 34 pasal · 959 ayat** — yang kurang hanya **GAYA**nya.
> Kitab **sudah ada** ⇒ tidak perlu 3 langkah setup; pakai `_batch-5-<pasal>.json` →
> `tambah-komentar.js` **menimpa** (`ditimpa: N` = bukti).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Gaya Ulangan (`cek-gaya-penguat.js`) | **pola “N hal” 100 %** · ulang 93 % · panjang 100 % | ✅ **pola 0 %** · ulang **26 %** · panjang **414 %** |
| `data/komentar/5.json` | 238,2 KB | **571,5 KB** |
| `android/lab3-offline.html` | 15,4 MB | **16,0 MB** |
| HP `ANodes-1berkas.html` | 15,73 MB | **16,07 MB** · penanda **`v19Sep-j` → `v19Sep-k`** |
| Data penguat ANodes | 3.918,1 KB | **4.251,4 KB** · sidik `-8087671f` → **`-aa9d4d10`** ✅ BERUBAH |

**16 giliran:** 1 (ps 1–2) · 2 (ps 3–4) · 3 (ps 5–6) · 4 (ps 7–8) · 5 (ps 9–10) · 6 (ps 11–14) ·
7 (ps 15–16) · 8 (ps 17–18) · 9 (ps 19–20) · 10 (ps 21–22) · 11 (ps 23–24) · 12 (ps 25–26) ·
13 (ps 27–28) · 14 (ps 29–30) · 15 (ps 31–32) · 16 (ps 33–34).

✅ **Dibuktikan** `cek-penguat.js 5` → **34 pasal cocok SEMUA** (p28=68 terpanjang · p32=52 · p4=49 ·
p1=46 · **p34=12 terpendek**) · `5.1.1 → ADA` · `5.34.12 → ADA` · **berkas terdaftar ADA** ·
tidak ada kunci kembar · `5.json` tetap **959 ayat** (ditimpa, bukan ditambah).
✅ **Data ANodes memuat teks BARU**: sidik `-8087671f` → **`-aa9d4d10`** · `Syema` (5.6.4) &
`Akulah Dia` (5.32.39) terbaca di `ANodes-1berkas.html` **dan** di Chrome nyata
(13 kitab · 16.180 ayat · Ulangan **959** · versi **`v19Sep-k`**).
🎉 **Pencapaian:** kitab **keempat** dari 10 kitab tafsir ulang selesai —
**pola “N hal” 100 % → 0 %** · **kata ulang 93 % → 26 %** · **panjang 100 % → 414 %**
⇒ **sisa 6 kitab / 9.211 ayat · berikutnya YESAYA**.
🗂️ 16 berkas batch (572,2 KB) diarsipkan ke `bible/backup/komentar-batch-ulangan-tafsirulang/`.
➕ **Uji baru** `tools/uji-cepat.js`: **K47-13v** (Ulangan: “Syema” 6:4 · “Akulah Dia” 32:39 ·
“Musa mati di sana” 34:5) · **K47-13w** (Ulangan tidak bergaya RINCIAN) · **K47-13x**
(panjang > 150 huruf/ayat: 32:39=663 · 28:3=516 · 34:7=564).

⚠️ **DUA PELAJARAN (jangan diulang):**
1. **`bersih-dan-dan.js` bisa memakan kata yang sah** — muncul 3× (5.3.17 kehilangan “beserta”,
   5.25.2 dua kali). Setiap kali alat melaporkan **“🧹 Dibersihkan”**, **periksa ayat yang terkena**.
2. **Frasa “dinyatakan dengan” TIDAK selalu pola lama** — 15 ayat Ulangan memakainya secara wajar
   (mis. 5.28.3 “dinyatakan dengan pasangan:”, 5.30.11 “dinyatakan dengan jelas”).
   Pola RINCIAN yang diukur alat hanya **`dinyatakan dengan (satu..tujuh) hal:`** ⇒ uji **jangan**
   sekadar `indexOf('dinyatakan dengan')`, kalau tidak **gagal palsu**.

## 19 September 2026 — ✅ K45: **TAFSIR ULANG #3 = KELUARAN TUNTAS** (40 pasal · 1.213 ayat · GAYA TAFSIR)

> Order Bapak: *“lanjut tafsir keluaran .. sampai selesai.. dan masih dalam aturan tampilan
> layar sedang km proses / kerja .. jangan dalam keadan idle tidak ada yg mengerti sedang apa..”*
> ⇒ **KELUARAN**, kitab **ketiga** dari **10 kitab lama** yang ditulis ulang dari
> **GAYA RINCIAN** (pola “dinyatakan dengan N hal”) menjadi **GAYA TAFSIR**.
> Kitab **sudah ada** ⇒ tidak perlu 3 langkah setup; pakai `_batch-2-<pasal>.json` →
> `tambah-komentar.js` **menimpa** (`ditimpa: N` = bukti).
> Bapak minta **selalu tampilkan posisi di layar** (📊 POSISI n dari m) — dilakukan tiap giliran.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Gaya Keluaran (`cek-gaya-penguat.js`) | **pola “N hal” 100 %** · ulang 93 % · panjang 100 % | ✅ **pola 0 %** · ulang **30 %** · panjang **309 %** |
| `data/komentar/2.json` | 258,7 KB | **487,6 KB** |
| `android/lab3-offline.html` | 13,79 MB | **15,7 MB** |
| HP `ANodes-1berkas.html` | 15,87 MB | **15,73 MB** · penanda **`v19Sep-i` → `v19Sep-j`** |
| Data penguat ANodes | 3.689,2 KB | **3.918,1 KB** (13 kitab · 16.180 ayat tetap) |

**20 giliran:** 1 (ps 1–2) · 2 (ps 3–4) · 3 (ps 5–6) · 4 (ps 7–8) · 5 (ps 9–10) · 6 (ps 11–12) ·
7 (ps 13–14) · 8 (ps 15–16) · 9 (ps 17–18) · 10 (ps 19–20) · 11 (ps 21–22) · 12 (ps 23–24) ·
13 (ps 25–26) · 14 (ps 27–28) · 15 (ps 29–30) · 16 (ps 31–32) · 17 (ps 33–34) · 18 (ps 35–36) ·
19 (ps 37–38) · 20 (ps 39–40).

✅ **Dibuktikan** `cek-penguat.js 2` → **40 pasal cocok SEMUA** (p12=51 terpanjang · **p11=10 terpendek** ·
p29=46 · p28=43 · p39=43 · p25=40 · p40=38) · `2.1.1 → ADA` · `2.40.38 → ADA` ·
**berkas terdaftar ADA** · tidak ada kunci kembar · `2.json` tetap **1.213 ayat** (ditimpa, bukan ditambah).
✅ **Data ANodes memuat teks BARU**: sidik `-d2c1c4f4` → **`-8087671f`** (bukti cache IndexedDB lama ditolak).
🎉 **Pencapaian:** kitab **ketiga** dari 10 kitab tafsir ulang selesai —
**pola “N hal” 100 % → 0 %** · **kata ulang 93 % → 30 %** · **panjang 100 % → 309 %** ·
⇒ **sisa 4 kitab / 6.646 ayat** (Bilangan · Kejadian · Yeremia · Mazmur).
🗂️ 20 berkas batch (488,8 KB) diarsipkan ke `bible/backup/komentar-batch-keluaran-tafsirulang/`.
➕ **Uji baru** `tools/uji-cepat.js`: **K47-13s** (Keluaran: “AKU ADALAH AKU” 3:14 · “tanda” 12:13 ·
“puncak kitab Keluaran” 40:34) · **K47-13t** (Keluaran tidak bergaya RINCIAN) · **K47-13u**
(panjang > 150 huruf/ayat: 14:21=348 · 25:40=410 · 39:43=651).

⚠️ **2 cacat nyata ketemu & diperbaiki sebelum gabung:** kata sampah `demo,` di awal `2.7.20` ·
`_batch-2-11.json` JSON rusak (`"2.21.24"` ditutup tanda `'`) → `SyntaxError` → diperbaiki lewat
skrip sementara `tools/_perbaiki-json.js` (dijalankan, lalu dihapus).
⚠️ **Pelajaran PowerShell:** `node -e "…"` dengan kutip ganda bersarang bisa masuk mode lanjutan
(`>>`) dan menggantung → untuk penggantian teks tidak sederhana, tulis skrip `.js` kecil di `tools/`.

## 19 September 2026 — ✅ K45: **TAFSIR ULANG #2 = AYUB TUNTAS** (42 pasal · 1.070 ayat · GAYA TAFSIR)

> Order Bapak: *“lanjut lukas”* (dikirim sesudah Lukas selesai) ⇒ dibaca sebagai
> **lanjut ke kitab berikutnya** = **AYUB**, kitab **kedua** dari **10 kitab lama** yang ditulis ulang
> dari **GAYA RINCIAN** (pola “dinyatakan dengan N hal”) menjadi **GAYA TAFSIR**.
> Kitab **sudah ada** ⇒ tidak perlu 3 langkah setup; pakai `_batch-18-<pasal>.json` →
> `tambah-komentar.js` **menimpa** (`ditimpa: N` = bukti).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Gaya Ayub (`cek-gaya-penguat.js`) | **pola “N hal” 100 %** · ulang 98 % · panjang 103 % | ✅ **pola 0 %** · ulang **28 %** · panjang **364 %** |
| `data/komentar/18.json` | 181,5 KB | **360,5 KB** |
| `android/lab3-offline.html` | 15,3 MB | **15,4 MB** |
| HP `ANodes-1berkas.html` | 15,31 MB | **15,87 MB** · penanda **`v19Sep-h` → `v19Sep-i`** |
| Data penguat ANodes | 3.510,3 KB | **3.689,2 KB** (13 kitab · 16.180 ayat tetap) |

**15 giliran:** 1 (ps 1–2) · 2 (ps 3–5) · 3 (ps 6–8) · 4 (ps 9–11) · 5 (ps 12–14) ·
6 (ps 15–17) · 7 (ps 18–20) · 8 (ps 21–23) · 9 (ps 24–26) · 10 (ps 27–29) · 11 (ps 30–31) ·
12 (ps 32–33) · 13 (ps 34–36) · 14 (ps 37–39) · 15 (ps 40–42).

✅ **Dibuktikan** `cek-penguat.js 18` → **42 pasal cocok SEMUA** (p25=6 terpendek · p38=41 terpanjang ·
p34=37 · p15=35 · p31=40) · `18.1.1 → ADA` · `18.42.17 → ADA` · **berkas terdaftar ADA** ·
tidak ada kunci kembar.
✅ **Sisa frasa “dinyatakan dengan” di SELURUH Ayub = 0**.
✅ **Data ANodes memuat teks BARU**: sidik `-e2fc1de8` → **`-d2c1c4f4`** · rata-rata **325 huruf/ayat**.
🎉 **Pencapaian:** kitab **kedua** dari 10 kitab tafsir ulang selesai —
**pola “N hal” 100 % → 0 %** · **kata ulang 98 % → 28 %** · **panjang 103 % → 364 %**.
🗂️ 15 berkas batch diarsipkan ke `bible/backup/komentar-batch-ayub-tafsirulang/` (360,9 KB).
➕ **Uji baru** `tools/uji-cepat.js`: **K47-13p** (Ayub: “penulis kitab” · “Penebusku hidup” ·
“mataku sendiri memandang”) · **K47-13q** (Ayub tidak bergaya RINCIAN) · **K47-13r** (Ayub > 150 huruf).

⚠️ **Cacat tulisan ketemu & diperbaiki sebelum gabung:** `dan dan` di 18.8.11 (ditangkap
`bersih-dan-dan.js`) · atribusi salah “Lukas” di 18.1.1 (sisa salin-tempel → “penulis kitab ini”) ·
`Jadi Ayat ini menjelaskan` di 18.31.28.

## 19 September 2026 — ✅ K45: **TAFSIR ULANG #1 = LUKAS TUNTAS** (24 pasal · 1.151 ayat · GAYA TAFSIR)

> Order Bapak: *“lanjut lukas”* ⇒ kitab **pertama** dari **10 kitab lama** yang ditulis ulang dari
> **GAYA RINCIAN** (pola “dinyatakan dengan N hal”) menjadi **GAYA TAFSIR** seperti Matius · 1 Samuel · 2 Samuel.
> Kitab **sudah ada** ⇒ tidak perlu 3 langkah setup; pakai `_batch-42-<pasal>.json` →
> `tambah-komentar.js` **menimpa** (`ditimpa: N` = bukti).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Gaya Lukas (`cek-gaya-penguat.js`) | **pola “N hal” 100 %** · ulang 97 % · panjang 103 % | ✅ **pola 0 %** · ulang **21 %** · panjang **327 %** |
| `data/komentar/42.json` | 230,7 KB | **450,3 KB** |
| `android/lab3-offline.html` | 14,91 MB | **15,3 MB** |
| HP `ANodes-1berkas.html` | 15,09 MB | **15,31 MB** · penanda **`v19Sep-g` → `v19Sep-h`** |
| Data penguat ANodes | 3.291,3 KB | **3.510,3 KB** (13 kitab · 16.180 ayat tetap) |

**13 giliran:** 1 (ps 1) · 2 (ps 2–3) · 3 (ps 4–5) · 4 (ps 6–7) · 5 (ps 8–9) · 6 (ps 10–11) ·
7 (ps 12–13) · 8 (ps 14–15) · 9 (ps 16–17) · 10 (ps 18–19) · 11 (ps 20–21) · 12 (ps 22–23) · 13 (ps 24).

✅ **Dibuktikan** `cek-penguat.js 42` → per pasal cocok (p1=80 · **p22=71** · p9=62 · p12=59 · p24=53 · p13=35) ·
`42.1.1 → ADA` · `42.24.53 → ADA` · **berkas terdaftar ADA** · tidak ada kunci kembar.
✅ **Diverifikasi di Chrome NYATA** (`ANodes-1berkas.html`): 13 kitab · 16.180 ayat · Lukas **1.151** ·
penguat 1:1 & 15:20 & 24:32 terbaca gaya TAFSIR · **catatan Bapak aman**.
🎉 **Pencapaian:** Lukas adalah kitab **pertama** dari 10 kitab yang berhasil ditafsir ulang —
**pola “N hal” turun dari 100 % ke 0 %**.

### 🐞🔴 CACAT BESAR KETEMU — SIDIK DATA TIDAK MEMUAT ISI (sudah diperbaiki)

Sesudah Lukas ditafsir ulang, **halaman 🖊 Pembaca Penguat di Chrome MASIH menampilkan teks LAMA**.
**Sebabnya (diperiksa, bukan diduga):** `meta.sidik` dihitung **hanya dari `jumlahKitab-jumlahAyat`** —
angka itu **tidak berubah** walau seluruh isi teks diganti ⇒ IndexedDB lama dianggap **masih sah** ⇒
berkas data baru tidak dipakai.
**Perbaikan:** `tools/siapkan-data-penguat.js` menambahkan **SIDIK-JARI ISI TEKS** (hash 32-bit) ke
`meta.sidik` → sidik sekarang berakhir **`-e2fc1de8`** dan **berubah setiap teks diganti**.
⚠️ **Penting untuk 9 kitab berikutnya:** tafsir ulang tidak mengubah jumlah ayat, jadi tanpa perbaikan ini
hasil tafsir ulang tidak akan pernah terlihat.
➕ **Uji baru:** **K47-13m** (Lukas baru) · **K47-13n** (tidak lagi bergaya RINCIAN) · **K47-13o** (panjang > 150).
🗂️ 15 berkas batch diarsipkan ke `bible/backup/komentar-batch-lukas-tafsirulang/`.
⏭️ **BERIKUTNYA: TAFSIR ULANG #2 = AYUB** (bookId 18 · 42 pasal · 1.070 ayat).

## 19 September 2026 — ✅ K45: **KITAB KE-13 = 2 SAMUEL TUNTAS 100 %** (24 pasal · 695 ayat · GAYA TAFSIR)

> Bapak: *“apakah bisa lanjut 2 sam ? atau ada usulan dari km”* → saya paparkan pilihan;
> Bapak: *“terserah km yg penting dikerja satu kitab satu kitab sampai selesai.. versi ini sangat
> penting.. pokoknya info harus detail karena ini untuk belajar... saya perlu adalah diberi waktu
> selesai.. dan layar jangan hening pada saat km kerja”*

⇒ saya pilih **2 Samuel** — kitab **BELUM ADA** (cakupan naik **12 → 13 kitab**), ukurannya
**kecil (695 ayat)**, dan ini **lanjutan langsung 1 Samuel** = pasangan yang Bapak tetapkan
sebagai **PATOKAN BENAR**. **Gaya = TAFSIR.**

| Hal | Sebelum | Sesudah |
|---|---|---|
| Berkas `data/komentar/10.json` | ❌ belum ada | ✅ **ada** (294,9 KB) |
| Cakupan 2 Samuel | 0 ayat | ✅ **pasal 1–24 = 695 ayat (100 %)** |
| `tools/build-lab3.js` | 12 kitab | ➕ `data/komentar/10.json` |
| `lab3.html` | 12 × `muatData` | ➕ `muatData('komentar-10', …)` + gabung `komentarData` |
| `android/lab3-offline.html` | 14,69 MB | **14,91 MB** |
| **Total penguat** | 15.485 ayat (12 kitab) | **16.180 ayat (13 kitab · ±52 %)** |
| HP `ANodes-1berkas.html` | 14,72 MB | **15,09 MB** · penanda **`v19Sep-g`** |

**13 giliran:** 1–2 · 3–4 · 5–6 · 7–8 · 9–10 · 11–12 · 13–14 · 15 · 16–17 · 18–19 · 20–21 · 22 · 23–24.

✅ **Dibuktikan** `cek-penguat.js 10` → **24 pasal cocok SEMUA** (p22=51 terpanjang · p19=43 ·
p3/13/23=39 · p4=12 terpendek) · `10.1.1 → ADA` · `10.24.25 → ADA` · **berkas terdaftar ADA** ·
tidak ada kunci kembar.
✅ **GAYA TAFSIR terbukti** (`cek-gaya-penguat.js`): **pola “N hal” 0 %** · **kata ulang 22 %**
(TERENDAH dari 13 kitab = paling banyak menafsirkan) · **panjang 372 %**.
✅ **DIVERIFIKASI DI CHROME NYATA** (bukan hanya alat): 13 kitab · 16.180 ayat · 2 Samuel **695** ·
penguat **7:12** & **24:25** terbaca · dropdown **13 opsi** · `v19Sep-g`.
🗂️ **Bukti:** **25 berkas batch** diarsipkan ke `bible/backup/komentar-batch-2samuel/`.
📦 **Sidik data baru:** `13-16180-1:1533,2:1213,4:1288,5:959,9:810,10:695,18:1070,19:2461,23:1292,24:1364,26:1273,40:1071,42:1151`.

### ⚠️ CACAT NYATA yang ketemu di giliran 1 (bukti alat bekerja)

Saya mula-mula menulis **2 Samuel pasal 2 hanya 25 ayat**, padahal **sumber = 32 ayat**.
`cek-hitung-hal.js` langsung menampilkan **`p2=25`** → **ditulis ulang lengkap**.
⇒ **Tanpa hitungan per pasal, penguat akan menempel di nomor ayat yang SALAH** (ayat 26–32 hilang
& seluruh tafsiran bergeser). Pelajaran ini sudah tercatat sejak Matius, dan **tetap terbukti**.

### ℹ️ Hitungan per pasal 2 Samuel (SUMBER KEBENARAN — jangan menebak)

`1=27 · 2=32 · 3=39 · 4=12 · 5=25 · 6=23 · 7=29 · 8=18 · 9=13 · 10=19 · 11=27 · 12=31 ·
13=39 · 14=33 · 15=37 · 16=23 · 17=29 · 18=33 · 19=43 · 20=26 · 21=22 · 22=51 · 23=39 · 24=25` = **695 ayat**

⚠️ **Pasal panjang:** **22=51** · 19=43 · 3/13/23=39 · 15=37 · 14/18=33 · 2=32.
⚠️ **Terpendek:** 4=12 · 9=13 · 8=18 · 10=19.
⚠️ **Kitab BARU ⇒ 3 langkah setup WAJIB lebih dulu** (kerangka `10.json` · `DATA_FILES` · `muatData`).
🧪 Uji K47 diperbarui: **K47-08** 12→**13 kitab** · **K47-09** 15.485→**16.180** · **K47-10** (+2Sam) ·
**K47-11** (+695) · **K47-18** 12→**13** · **K47-13l BARU** (2Sam 7:12–13 · 12:13 · 24:25).
🏷️ Penanda versi `plugin/penguat/tampilan.js` naik **`v19Sep-f` → `v19Sep-g`**.

⏭️ **PRIORITAS BERIKUTNYA = TAFSIR ULANG 5 KITAB LAMA** (sisa 6.646 ayat — ✅ Lukas · ✅ Ayub · ✅ Keluaran · ✅ Ulangan · ✅ Yesaya selesai 19 Sep 2026 · ✅ **Yehezkiel selesai 20 Sep 2026**) — lihat bagian paling atas.
⏭️ ~~Sesudah 10 kitab selesai → kitab ke-14 = 1 RAJA-RAJA~~ ⇒ ✅ **SUDAH SELESAI — dan akhirnya SELURUH 66 KITAB TUNTAS 21 Sep 2026** (lihat entri paling atas).

---
## 19 September 2026 — 🔴🔴 **KEPUTUSAN BAPAK: TAFSIR ULANG 10 KITAB** (13.604 ayat)

> Bapak: *“haaaaa ini sudah benar. versi ini yg saya maksud. yg versi yg sudah dibuat diganti
> dengan versi ini.. mau ganti new chat”*

✅ **1 Samuel + Matius = PATOKAN YANG BENAR** — bergaya **TAFSIR**
(tidak menyalin ayat · memberi keterangan baru · pola “N hal” **0 %** · kata ulang rendah).

🔴 **10 KITAB LAMA WAJIB DIGANTI** (bergaya RINCIAN pola “dinyatakan dengan N hal”):
**Lukas (1.151) · Ayub (1.070) · Keluaran (1.213) · Ulangan (959) · Yesaya (1.292) ·
Yehezkiel (1.273) · Bilangan (1.288) · Kejadian (1.533) · Yeremia (1.364) · Mazmur (2.461)**
= **13.604 ayat** ditulis ulang.

💾 **Backup sebelum penulisan ulang:** `bible\backup\penguat-SEBELUM-tafsir-ulang-20260919-171313`
(12 berkas · 3,03 MB) — **dipakai untuk rollback bila perlu**.

⚠️ **Kitab sudah ADA ⇒ TIDAK perlu 3 langkah setup.** Pakai `data/komentar/_batch-<bookId>-<pasal>.json`;
`tambah-komentar.js` akan **MENIMPA** ayat yang sama (**`ditimpa: N`** = bukti penggantian berhasil).
⚠️ Setiap giliran **WAJIB** diakhiri `node tools/cek-gaya-penguat.js` — buktikan
**pola “N hal” turun** & **kata ulang turun**.
❌ **JANGAN pakai** pola *“X dinyatakan dengan N hal: …”* (itu gaya RINCIAN).

📌 Cara menulis gaya TAFSIR (5 aturan) + urutan 8 langkah: memory `/memories/repo/tafsir-ulang-10-kitab.md`.
⏭️ ~~Sesudah 10 kitab selesai → kitab ke-14 = 1 RAJA-RAJA~~ ⇒ ✅ **SUDAH SELESAI — dan akhirnya SELURUH 66 KITAB TUNTAS 21 Sep 2026** (lihat entri paling atas).

---
## 19 September 2026 — ✅ K45: **KITAB KE-12 = 1 SAMUEL TUNTAS 100 %** (31 pasal · 810 ayat · GAYA TAFSIR)

> ⚠️ **Bapak:** *“dibantu “lanjut” hingga selesai.. karena saya harus keluar bawa anjing jalan..
> dan di masuk ke sistem saya ingin liat hasilnya”* ⇒ dikerjakan **sampai tuntas** dalam satu sesi
> (giliran 1–12). **Gaya TAFSIR** = seperti Matius: TIDAK menyalin ayat, memberi keterangan baru.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan 1 Samuel | 0 ayat | ✅ **pasal 1–31 = 810 ayat (100 %)** |
| Cakupan penguat | 14.675 ayat (11 kitab) | ✅ **15.485 ayat (12 kitab · ±49,8 %)** |
| `data/komentar/9.json` | ❌ belum ada | **267,6 KB** |
| `bible/android/lab3-offline.html` | 14,43 MB | **14,69 MB** |
| `plugin/penguat/data/penguat.js` | 2.669,7 KB | **2.927,5 KB** |
| Versi HP `ANodes-1berkas.html` | 14,46 MB | **±14,72 MB** |

**Giliran 1–12**

| Giliran | Pasal | Ayat | Total |
|---|---|---|---|
| 1 | 1 | 28 | 28 |
| 2 | 2 | 36 | 64 |
| 3 | 3–4 | 43 | 107 |
| 4 | 5–7 | 50 | 157 |
| 5 | 8–10 | 76 | 233 |
| 6 | 11–13 | 63 | 296 |
| 7 | 14–15 | 87 | 383 |
| 8 | 16–18 | 111 | 494 |
| 9 | 19–22 | 104 | 598 |
| 10 | 23–25 | 95 | 693 |
| 11 | 26–28 | 62 | 755 |
| 12 | 29–31 | 55 | **810 ✅** |

**Urutan penutup kitab**
- `node tools/siapkan-data-penguat.js` (ANodes) → **12 kitab · 15.485 ayat**,
  sidik `12-15485-1:1533,2:1213,4:1288,5:959,9:810,18:1070,19:2461,23:1292,24:1364,26:1273,40:1071,42:1151`.
- `node tools/buat-1-berkas.js` → HP diperbarui (data Penguat 2.927,5 KB ikut).
- **Penanda versi naik `v19Sep-e` → `v19Sep-f`** di `plugin/penguat/tampilan.js`.
- Uji K47 diperbarui: **K47-08** 11→**12 kitab** · **K47-09** 14.675→**15.485** ·
  **K47-10** (+1 Samuel) · **K47-11** (+810) · **K47-18** 11→**12** ·
  **K47-13k baru** (penguat 1Sam 3:10 · 17:45 · 31:6).
- 31 berkas batch diarsipkan ke `bible/backup/komentar-batch-1samuel/`.

**Bukti (bukan dugaan)**
- `cek-penguat.js 9` → **semua 31 pasal cocok** (p17=58 · p14=52 · p25=44 · p20=42 · p2=36 ·
  p29=11 terpendek) · **berkas terdaftar → ADA** · `9.1.1 → ADA` · `9.31.13 → ADA` ·
  tidak ada kunci kembar.
- `cek-gaya-penguat.js 9` → **pola “N hal” 0 %** · **kata ulang 33 %** · **panjang 200 %**
  (paling detail dari seluruh 12 kitab) — membuktikan GAYA TAFSIR tercapai.
- `bersih-dan-dan.js` → Bersih tiap batch · `cek-hitung-hal.js` → COCOK SEMUA tiap batch.

⚠️ **4 ayat cacat tulisan ketemu & diperbaiki sebelum gabung:** `9.6.4` · `9.6.5` (kalimat terpotong),
`9.16.16` (kata Inggris terselip), `9.17.11` · `9.20.31` · `9.20.42` (salah tulis).

⏭️ **BERIKUTNYA: kitab ke-13 = 2 SAMUEL** (bookId 10 · 24 pasal · **695 ayat**) —
kitab **BARU** ⇒ 3 langkah setup wajib lebih dulu. **Gaya tetap TAFSIR.**

---

## 19 September 2026 — 🔨 K45: **KITAB KE-12 = 1 SAMUEL DIMULAI — GAYA TAFSIR** (pasal 1–2 · 64 ayat)

> ⚠️ **KEPUTUSAN BAPAK 19 Sep 2026:** *“pokok mau sama seperti versi matius … apanamanya supaya
> saya tidak salah sebut”* + *“boleh 150% mungkin lebih detail.”*
>
> ⇒ **NAMA RESMI DUA GAYA (supaya tidak salah sebut lagi):**
>
> | Nama | Ciri | Bapak minta |
> |---|---|---|
> | **GAYA TAFSIR** (gaya **MATIUS**) | **TIDAK menyalin ayat** — memberi keterangan BARU | ✅ **INI YANG DIMINTA** |
> | **GAYA RINCIAN** (pola **“dinyatakan dengan N hal”**) | Menyalin isi ayat lalu dipecah | ❌ tidak |
>
> ⚠️ **“N hal” BUKAN gaya yang diminta** — itu justru nama gaya RINCIAN. Alat bukti:
> `tools/cek-gaya-penguat.js` (**pola “N hal” 0 % + kata ulang rendah = TAFSIR**).
> Bergaya TAFSIR baru **Matius (1.071)** + **1 Samuel (berjalan)**. Masih RINCIAN: **Yesaya · Keluaran ·
> Ulangan · Ayub · Lukas** (8.246 ayat). ⇒ **data lama TIDAK dihapus** — akan membuang yang sudah benar.

| Hal | Sebelum | Sesudah |
|---|---|---|
| `data/komentar/9.json` (1 Samuel) | ❌ belum ada | ✅ **ada** (44,3 KB) |
| Cakupan 1 Samuel | 0 ayat | **pasal 1–7 = 157 ayat** (dari 810 = 19,4 %) |
| `DATA_FILES` `bible/tools/build-lab3.js` | 11 kitab | ➕ `data/komentar/9.json` |
| `bible/lab3.html` | 11 × `muatData` | ➕ `muatData('komentar-9', …)` + gabung `komentarData` |
| `bible/android/lab3-offline.html` | 14,43 MB | **14,47 MB** |

| Giliran | Pasal | Tambahan | Cakupan |
|---|---|---|---|
| 1 | 1 | 28 | 28 |
| 2 | 2 | 36 | 64 |
| 3 | 3–4 | 43 | 107 |
| 4 | 5–7 | 50 | **157** |

✅ **Dibuktikan gaya TAFSIR tercapai** (`node tools/cek-gaya-penguat.js`):
**pola “N hal” 0 %** · **kata ulang 25 %** (paling rendah dari seluruh kitab) ·
**panjang 172 %** (lebih detail — sesuai permintaan Bapak).
✅ `cek-penguat.js 9` → `p1=28 · p2=36 · p3=21 · p4=22 · p5=12 · p6=21 · p7=17` ·
**berkas terdaftar → ADA** · `9.1.1 → ADA` · `9.7.17 → ADA`.
⚠️ 2 ayat cacat tulisan ketemu & diperbaiki (`9.6.4` · `9.6.5` — kalimat terpotong).

⚠️ **Pasal panjang 1 Samuel wajib lengkap:** **17=58** · **14=52** · 25=44 · 20=42 · 15=35 · 30=31 ·
18=30 · 23=29 · 10=27 · 9=27 · 1=28 · 12=25 · 26=25 · 28=25.
⚠️ **Terpendek: 29=11 · 5=12 · 27=12 · 31=13.**
⏭️ **BERIKUTNYA: 1 Samuel pasal 8–10** (22 + 27 + 27 = **76 ayat**).

---

## 19 September 2026 — ✅ K45: **KITAB KE-11 = ULANGAN SELESAI 100 %** (34 pasal · 959 ayat)

> Lanjutan kebiasaan **“ISI dulu, SISTEM menyusul”** — Ulangan dikerjakan penuh lebih dulu.
> Kitab **BARU** ⇒ 3 langkah setup dikerjakan di awal (kerangka `5.json` · `DATA_FILES` `build-lab3.js` ·
> `muatData('komentar-5')` + gabung `komentarData` di `lab3.html`).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan Ulangan | 0 ayat | ✅ **pasal 1–34 = 959 ayat (100 %)** |
| Cakupan penguat | 13.716 ayat (10 kitab) | ✅ **14.675 ayat (11 kitab)** |
| Kitab tuntas | … + Ayub | ➕ **ULANGAN** (34 ps · 959 ayat) |
| `data/komentar/5.json` | ❌ belum ada | **238,2 KB** |
| `plugin/penguat/data/penguat.js` | 2.441,8 KB | **2.669,7 KB** |
| `android/lab3-offline.html` | 14,23 MB | **14,43 MB** |
| Versi HP `ANodes-1berkas.html` | 14,20 MB | **14,45 MB** |

**Giliran 10–15 (lanjutan sesi ini)**

| Giliran | Pasal | Tambahan | Cakupan |
|---|---|---|---|
| 10 | 22–24 | 77 | 655 |
| 11 | 25–27 | 64 | 719 |
| 12 | 28 | 68 | 787 |
| 13 | 29–31 | 79 | 866 |
| 14 | 32 | 52 | 918 |
| 15 | 33–34 | 41 | **959 ✅** |

**Urutan penutup kitab (dikerjakan sekali)**

- `node tools/siapkan-data-penguat.js` (ANodes) → **11 kitab · 14.675 ayat**,
  sidik `11-14675-1:1533,2:1213,4:1288,5:959,18:1070,19:2461,23:1292,24:1364,26:1273,40:1071,42:1151`.
- `node tools/buat-1-berkas.js` → HP **14,45 MB** (data Penguat 2.669,7 KB ikut).
- **Penanda versi naik `v19Sep-d` → `v19Sep-e`** di `plugin/penguat/tampilan.js`.
- Uji K47 diperbarui: **K47-08** 10→**11 kitab** · **K47-09** 13.716→**14.675** ·
  **K47-10** (+Ulangan) · **K47-11** (+959) · **K47-18** 10→**11** ·
  **K47-13j baru** (penguat Ul 6:4 · 30:19 · 34:5).
- 15 berkas batch diarsipkan ke `bible/backup/komentar-batch-ulangan/`.

**🧪 Uji cepat di `ANodes-1berkas.html` (Chrome nyata):** **216 uji, 1 gagal** (K42g-02 — di luar
cakupan penguat) · **blok K47: 50 uji, 0 gagal** — termasuk **K47-08 → 11 kitab OK** ·
**K47-09 → 14.675 OK** · **K47-11 → Ulangan 959 OK** · **K47-18 → 11 opsi OK**.
Verifikasi langsung: `ANodesPenguatTampilan.versi()` = **`v19Sep-e`** · `daftarKitab().length` = **11** ·
`jumlahSemua()` = **14.675** · `jumlahAyat(5)` = **959** · `5.1.1` & `5.34.12` → **ADA**.
Dropdown kitab = **11 opsi** (termasuk **Ulangan**) · baris posisi = *“Pasal 28 dari 28 pasal … v19Sep-e”*.
Lepas plugin → catatan **utuh** (tidak tersentuh).

**Bukti (bukan dugaan)**

- `cek-penguat.js 5` → **34 pasal cocok semua** (p28=68 terpanjang · p32=52 · p4=49 · p1=46 ·
  p34=12 terpendek) · **berkas terdaftar → ADA** · `5.1.1 → ADA` · `5.34.12 → ADA` ·
  tidak ada kunci kembar.
- `cek-hitung-hal.js` per batch → **COCOK SEMUA** setelah perbaikan.
- Verifikasi langsung ke `plugin/penguat/data/penguat.js`: Ulangan 34 pasal · 959 ayat ·
  `5.1.1 → ADA` · `5.34.12 → ADA`.
- Backup gaya berjalan sebelum sesi: `bible/backup/penguat-gaya-berjalan-20260919-153634` (26 berkas · 2,84 MB).

⚠️ **Salah hitung nyata ditangkap `cek-hitung-hal.js` sebelum gabung — 12 ayat:**
`5.29.7` · `5.30.2` · `5.31.7` · `5.31.12` · `5.32.6` · `5.32.14` · `5.32.22` · `5.32.30` ·
`5.32.36` · `5.32.41` · `5.33.2` · `5.34.2`. Semuanya dirapikan (angka diperbaiki atau
pemisah **`;`** ditambahkan). **Tanpa alat ini, 12 kesalahan masuk ke data akhir.**

⏭️ **BERIKUTNYA: kitab ke-12 = 1 SAMUEL** (bookId 9 · 31 pasal · **810 ayat**) —
kitab **BARU** ⇒ 3 langkah setup wajib lebih dulu.

---

## 19 September 2026 — 🔨 K45: **ULANGAN pasal 22–34** (sisa 381 ayat) — total Ulangan **959 ayat (100 %)**

> Pasal 22–26 = hukum kasih dalam hidup sehari-hari (barang hilang, atap rumah, campuran,
> tali kekang, talak, jaminan, upah, sisa panen) · pasal 27 = upacara berkat & kutuk di Ebal-Gerizim ·
> pasal 28 = **berkat & kutuk** (pasal terpanjang: 68 ayat) · pasal 29–30 = **perjanjian diperbarui
> di Moab** + pilihan hidup & mati · pasal 31 = Yosua dikuatkan + hukum Taurat ditulis ·
> pasal 32 = **nyanyian Musa** (52 ayat) · pasal 33 = **berkat Musa atas suku-suku** ·
> pasal 34 = **kematian Musa di Nebo** (12 ayat, terpendek).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan Ulangan | pasal 1–21 = 578 ayat | **pasal 1–34 = 959 ayat** (100 %) |
| `data/komentar/5.json` | 144,5 KB | **238,2 KB** |
| `android/lab3-offline.html` | 14,33 MB | **14,43 MB** |

| Giliran | Pasal | Tambahan | Cakupan |
|---|---|---|---|
| 10 | 22–24 | 77 | 655 |
| 11 | 25–27 | 64 | 719 |
| 12 | 28 | 68 | 787 |
| 13 | 29–31 | 79 | 866 |
| 14 | 32 | 52 | 918 |
| 15 | 33–34 | 41 | **959 ✅** |

**Bukti (bukan dugaan)**
- `cek-penguat.js 5` → **34 pasal cocok semua** (p28=68 · p32=52 · p31=30 · p29=29 · p33=29 ·
  p34=12) · **berkas terdaftar → ADA** · `5.1.1 → ADA` · `5.34.12 → ADA` · tidak ada kunci kembar.
- `cek-hitung-hal.js` per batch → **COCOK SEMUA** setelah perbaikan.
- `bersih-dan-dan.js` → ✅ **Bersih** tiap batch.

⚠️ **12 salah hitung nyata ketemu & diperbaiki sebelum gabung:**
`5.29.7` · `5.30.2` · `5.31.7` · `5.31.12` · `5.32.6` · `5.32.14` · `5.32.22` · `5.32.30` ·
`5.32.36` · `5.32.41` · `5.33.2` · `5.34.2` — sebagian dirapikan dengan pemisah **`;`**.

---

## 19 September 2026 — 🔨 K45: **ULANGAN pasal 19–21** (64 ayat) — total Ulangan **578 ayat (60,3 %)**

> Pasal 19 = **kota perlindungan** + saksi palsu · pasal 20 = aturan **peperangan** · pasal 21 = pembunuhan tak terpecahkan, tawanan perang, hak kesulungan, anak degil.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan Ulangan | pasal 1–18 = 514 ayat | **pasal 1–21 = 578 ayat** (dari 959 = 60,3 %) |
| `data/komentar/5.json` | 127,4 KB | **144,5 KB** |
| `android/lab3-offline.html` | 14,32 MB | **14,33 MB** |

**Bukti (bukan dugaan)**
- `cek-penguat.js 5` → `p19=21 · p20=20 · p21=23` (21 pasal cocok semua) ·
  **berkas terdaftar → ADA** · `5.1.1 → ADA` · `5.21.23 → ADA` · tidak ada kunci kembar.
- `cek-hitung-hal.js` → ✅ **Hitungan “N hal”: COCOK SEMUA (64 ayat berpola)**.
- `bersih-dan-dan.js` → ✅ **Bersih**.
- `tambah-komentar.js` → cadangan otomatis `backup/komentar-5.json.bak-20260919-152549.json`.

⚠️ **6 salah hitung nyata ketemu & diperbaiki sebelum gabung:** `5.19.9` · `5.20.12` · `5.20.13` ·
`5.20.16` · `5.21.8` · `5.21.10` — sebagian dirapikan dengan pemisah **`;`**.

⏭️ **BERIKUTNYA: Ulangan pasal 22–24** (30 + 25 + 22 = **77 ayat**).

---

## 19 September 2026 — 🔨 K45: **ULANGAN pasal 17–18** (42 ayat) — total Ulangan **514 ayat (53,6 %)**

> Pasal 17 = hukum penyembah berhala & **pengadilan banding** + aturan raja · pasal 18 = **hak imam Lewi**, larangan ramalan, dan **janji nabi besar**.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan Ulangan | pasal 1–16 = 472 ayat | **pasal 1–18 = 514 ayat** (dari 959 = 53,6 %) |
| `data/komentar/5.json` | 116,6 KB | **127,4 KB** |
| `android/lab3-offline.html` | 14,31 MB | **14,32 MB** |

**Bukti (bukan dugaan)**
- `cek-penguat.js 5` → `p17=20 · p18=22` (18 pasal cocok semua) ·
  **berkas terdaftar → ADA** · `5.1.1 → ADA` · `5.18.22 → ADA` · tidak ada kunci kembar.
- `cek-hitung-hal.js` → ✅ **Hitungan “N hal”: COCOK SEMUA (42 ayat berpola)**.
- `bersih-dan-dan.js` → ✅ **Bersih**.
- `tambah-komentar.js` → cadangan otomatis `backup/komentar-5.json.bak-20260919-152155.json`.

⚠️ **4 salah hitung nyata ketemu & diperbaiki sebelum gabung:** `5.17.8` · `5.17.9` · `5.17.14` · `5.18.9`.

⏭️ **BERIKUTNYA: Ulangan pasal 19–21** (21 + 20 + 23 = **64 ayat**).

---

## 19 September 2026 — 🔨 K45: **ULANGAN pasal 15–16** (45 ayat) — total Ulangan **472 ayat (49,2 %)**

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan Ulangan | pasal 1–14 = 427 ayat | **pasal 1–16 = 472 ayat** (dari 959 = 49,2 %) |
| `data/komentar/5.json` | 104,5 KB | **116,6 KB** |
| `android/lab3-offline.html` | 14,30 MB | **14,31 MB** |

**Bukti (bukan dugaan)**
- `cek-penguat.js 5` → `p15=23 · p16=22` (16 pasal cocok semua) ·
  **berkas terdaftar → ADA** · `5.1.1 → ADA` · `5.16.22 → ADA` · tidak ada kunci kembar.
- `cek-hitung-hal.js` → ✅ **Hitungan “N hal”: COCOK SEMUA (45 ayat berpola)**.
- `bersih-dan-dan.js` → ✅ **Bersih**.
- `tambah-komentar.js` → cadangan otomatis `backup/komentar-5.json.bak-20260919-151837.json`.

⚠️ **3 salah hitung nyata ketemu & diperbaiki sebelum gabung:** `5.15.18` · `5.15.20` · `5.15.21`.

⏭️ **BERIKUTNYA: Ulangan pasal 17–18** (20 + 22 = **42 ayat**).

---

## 19 September 2026 — 🔨 K45: **ULANGAN pasal 11–14** (111 ayat) — total Ulangan **427 ayat**

> Permintaan Bapak: *“bisa diproses 4 pasal”* ✅ — dikerjakan dengan **kedua pemeriksa tetap menyala**.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan Ulangan | pasal 1–10 = 316 ayat | **pasal 1–14 = 427 ayat** (dari 959 = 44,5 %) |
| `data/komentar/5.json` | 76,5 KB | **104,5 KB** |
| `android/lab3-offline.html` | 14,27 MB | **14,30 MB** |

| Giliran | Pasal | Tambahan | Cakupan |
|---|---|---|---|
| 6 | **11–12–13–14** | **111** | **427** |

**Bukti (bukan dugaan)**
- `cek-penguat.js 5` → `p11=32 · p12=32 · p13=18 · p14=29` (semua pasal cocok) ·
  **berkas terdaftar → ADA** · `5.1.1 → ADA` · `5.14.29 → ADA` · tidak ada kunci kembar.
- `cek-hitung-hal.js` → ✅ **Hitungan “N hal”: COCOK SEMUA (111 ayat berpola)**.
- `tambah-komentar.js` → cadangan otomatis `backup/komentar-5.json.bak-20260919-151615.json`.

⚠️ **5 salah hitung nyata ketemu & diperbaiki sebelum gabung:** `5.11.22` · `5.12.20` ·
`5.14.23` · `5.14.24` · `5.14.26` — sebagian dirapikan dengan pemisah **`;`** supaya
jumlah rinciannya benar-benar sesuai angka yang tertulis.
➕ **1 cacat `dan dan`** juga ditangkap pembersih (batch 5.12.10) sebelum gabung.

⏭️ **BERIKUTNYA: Ulangan pasal 15–16** (23 + 22 = **45 ayat**).

---

## 19 September 2026 — 🔨 K45: **ULANGAN pasal 9–10** (51 ayat) — total Ulangan **316 ayat**

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan Ulangan | pasal 1–8 = 265 ayat | **pasal 1–10 = 316 ayat** (dari 959 = 33,0 %) |
| `data/komentar/5.json` | 63,6 KB | **76,5 KB** |
| `android/lab3-offline.html` | 14,26 MB | **14,27 MB** |

**Bukti (bukan dugaan)**
- `cek-penguat.js 5` → `p1=46 · p2=37 · p3=29 · p4=49 · p5=33 · p6=25 · p7=26 · p8=20 · p9=29 · p10=22` ·
  **berkas terdaftar → ADA** · `5.1.1 → ADA` · `5.10.22 → ADA` · tidak ada kunci kembar.
- `cek-hitung-hal.js` → ✅ **Hitungan “N hal”: COCOK SEMUA (51 ayat berpola)**.
- `bersih-dan-dan.js` → ✅ **Bersih**.
- `tambah-komentar.js` → cadangan otomatis `backup/komentar-5.json.bak-20260919-151238.json`.

⚠️ **2 salah hitung nyata ketemu & diperbaiki sebelum gabung:** `5.9.9` (tertulis 3, rincian 2) ·
`5.10.20` (tertulis 2, rincian 3).

⏭️ **BERIKUTNYA: Ulangan pasal 11–12** (32 + 32 = **64 ayat**).

---

## 19 September 2026 — 🔨 K45: **ULANGAN pasal 7–8** (46 ayat) — total Ulangan **265 ayat**

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan Ulangan | pasal 1–6 = 219 ayat | **pasal 1–8 = 265 ayat** (dari 959 = 27,6 %) |
| `data/komentar/5.json` | 51,2 KB | **63,6 KB** |
| `android/lab3-offline.html` | 14,24 MB | **14,26 MB** |

**Bukti (bukan dugaan)**
- `cek-penguat.js 5` → `p1=46 · p2=37 · p3=29 · p4=49 · p5=33 · p6=25 · p7=26 · p8=20` ·
  **berkas terdaftar → ADA** · `5.1.1 → ADA` · `5.8.20 → ADA` · tidak ada kunci kembar.
- `cek-hitung-hal.js` → ✅ **Hitungan “N hal”: COCOK SEMUA (46 ayat berpola)**.
- `tambah-komentar.js` → cadangan otomatis `backup/komentar-5.json.bak-20260919-150931.json`.

**🐞 CACAT PALSU yang ketemu — pembersih `dan dan` perlu LOOKAHEAD**
- Ulangan 8:7 memuat *“sungai, mata air **dan dan**au”* — **bahasa Indonesia yang BENAR**
  (`danau` = lake), tetapi pemeriksa lama menganggapnya cacat `dan dan`.
- **Perbaikan `tools/bersih-dan-dan.js`:** polanya kini **`dan dan(?![a-z])`** — cacat sejati selalu
  diikuti **spasi + kata**, bukan huruf. Perbaikan yang sama dipakai pada pemeriksa sisa.
- ⇒ **Pelajaran:** pemeriksa harus melihat **batas kata**, jangan hanya mencari dua kata berurutan.

⏭️ **BERIKUTNYA: Ulangan pasal 9–10** (29 + 22 = **51 ayat**).

---

## 19 September 2026 — 🔨 K45: **ULANGAN pasal 5–6** (58 ayat) — total Ulangan **219 ayat**

> Pasal 5 = **Sepuluh Hukum diulang** · pasal 6 = **Syema (Ul 6:4-9)** + perintah mengasihi TUHAN.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan Ulangan | pasal 1–4 = 161 ayat | **pasal 1–6 = 219 ayat** (dari 959 = 22,8 %) |
| `data/komentar/5.json` | 38,3 KB | **51,2 KB** |
| `android/lab3-offline.html` | 14,23 MB | **14,24 MB** |

**Bukti (bukan dugaan)**
- `cek-penguat.js 5` → `p1=46 · p2=37 · p3=29 · p4=49 · p5=33 · p6=25` · **berkas terdaftar → ADA** ·
  `5.1.1 → ADA` · `5.6.25 → ADA` · tidak ada kunci kembar.
- `cek-hitung-hal.js` → ✅ **Hitungan “N hal”: COCOK SEMUA (58 ayat berpola)**.
- `bersih-dan-dan.js` → ✅ **Bersih** (tidak ada cacat tulisan ganda).
- `tambah-komentar.js` → cadangan otomatis `backup/komentar-5.json.bak-20260919-150655.json`.

⏭️ **BERIKUTNYA: Ulangan pasal 7–8** (26 + 20 = **46 ayat**).

---

## 19 September 2026 — 🔨 K45: **ULANGAN pasal 3–4** (78 ayat) — total Ulangan **161 ayat**

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan Ulangan | pasal 1–2 = 83 ayat | **pasal 1–4 = 161 ayat** (dari 959 = 16,8 %) |
| `data/komentar/5.json` | 19,4 KB | **38,3 KB** |
| `android/lab3-offline.html` | 14,21 MB | **14,23 MB** |

**Perkakas baru — `tools/cek-hitung-hal.js`**
- Pemeriksa hitungan **“dinyatakan dengan N hal”** (gaya tulisan penguat selalu berpola itu).
  Salah hitung paling sering terjadi pada **ayat panjang** (Ayub pernah 5×).
- ⚠️ **Pelajaran:** kata **“serta”** **JANGAN** dihitung sebagai pemisah rincian — kata itu sering
  ada **DI DALAM** sebuah rincian (mis. “tembok tinggi-tinggi **serta** pintu-pintu gerbang”)
  → menimbulkan peringatan palsu (14 ayat). Pemisah sah hanya **“, dan ”** dan **“; ”**.

**Bukti (bukan dugaan)**
- `cek-penguat.js 5` → `p1=46 · p2=37 · p3=29 · p4=49` · **berkas terdaftar → ADA** ·
  `5.1.1 → ADA` · `5.4.49 → ADA` · tidak ada kunci kembar.
- `cek-hitung-hal.js` → ✅ **Hitungan “N hal”: COCOK SEMUA (78 ayat berpola)**.
- `tambah-komentar.js` → cadangan otomatis `backup/komentar-5.json.bak-20260919-145040.json`.

**Urutan langkah (jangan dibalik):**
```
1. node tools/lihat-pasal.js 5 <pasal>
2. tulis data/komentar/_batch-5-<pasal>.json
3. node tools/bersih-dan-dan.js <batch>   ← WAJIB
4. node tools/cek-hitung-hal.js <batch>   ← WAJIB
5. node tools/tambah-komentar.js <batch>
6. node tools/build-lab3.js
7. node tools/cek-penguat.js 5            ← buktikan masuk
```

⏭️ **BERIKUTNYA: Ulangan pasal 5–6** (33 + 25 = **58 ayat**).

---

## 19 September 2026 — 🔨 K45: **KITAB KE-11 = ULANGAN DIMULAI** — setup kitab + pasal 1–2 (83 ayat)

> Kitab **ULANGAN** = **kitab BARU** → 3 langkah tambahan wajib dikerjakan **lebih dulu**
> (kerangka data · daftar di `build-lab3.js` · `muatData` + gabung di `lab3.html`).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Berkas `data/komentar/5.json` | ❌ belum ada | ✅ **ada** (19,4 KB — kerangka + 83 ayat) |
| Cakupan Ulangan | 0 ayat | **pasal 1–2 = 83 ayat** (dari 959 = 8,7 %) |
| `tools/build-lab3.js` | 10 kitab | ➕ `data/komentar/5.json` |
| `lab3.html` | 10 × `muatData` | ➕ `muatData('komentar-5', …)` + gabung `komentarData` |
| `android/lab3-offline.html` | 14,20 MB | **14,21 MB** |

**Perkakas baru — `tools/bersih-dan-dan.js`**
- Pembersih cacat tulisan ganda (`dan dan`, `, ,`, spasi ≥2) yang **wajib** dijalankan
  **SEBELUM** `tambah-komentar.js` — alat itu **tidak** memeriksa cacat ini (pelajaran K45 Ayub).
- ⚠️ **Pelajaran penting:** pembersih **wajib** bekerja pada **nilai JSON** saja.
  Versi pertama saya `replace` pada **seluruh isi berkas** → indenasi 2 spasi ikut dirapatkan
  jadi 1 spasi dan berkas jadi berantakan. Sudah diperbaiki (baca JSON → bersihkan nilai → tulis ulang).

**Bukti (bukan dugaan)**
- `cek-penguat.js 5` → `p1=46 · p2=37` · **berkas terdaftar → ADA** · `5.1.1 → ADA` · `5.2.37 → ADA`.
- `tambah-komentar.js` → cadangan otomatis `backup/komentar-5.json.bak-20260919-143437.json`.

**Urutan tiap langkah (jangan dibalik):**
```
1. node tools/lihat-pasal.js 5 <pasal>
2. tulis data/komentar/_batch-5-<pasal>.json
3. node tools/bersih-dan-dan.js data/komentar/_batch-5-<pasal>.json   ← WAJIB, baru ada
4. node tools/tambah-komentar.js data/komentar/_batch-5-<pasal>.json
5. node tools/build-lab3.js
6. node tools/cek-penguat.js 5                                        ← buktikan masuk
```

⏭️ **BERIKUTNYA: Ulangan pasal 3–4** (29 + 49 = 78 ayat).

---

## 19 September 2026 — ✅ K45: **KITAB KE-10 = AYUB SELESAI 100 %** (42 pasal · 1.070 ayat)

> Lanjutan kebiasaan **“ISI dulu, SISTEM menyusul”** — Ayub dikerjakan penuh lebih dulu
> (42 pasal · **1.070 ayat** · 22 giliran), baru berkas data ANodes disegarkan.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan penguat | 12.646 ayat (9 kitab) | ✅ **13.716 ayat (10 kitab)** |
| Kitab tuntas | Matius · Mazmur · Kejadian · Yeremia · Yesaya · Bilangan · Yehezkiel · Keluaran · Lukas | ➕ **AYUB** (42 ps · 1.070 ayat) |
| `plugin/penguat/data/penguat.js` | 2.272,9 KB | **2.441,8 KB** |
| `ANodes-1berkas.html` | 14,02 MB | **14,23 MB** |

**Perkakas/bagian yang dibangun ulang**
- `tools/siapkan-data-penguat.js` dijalankan ulang → **10 kitab · 13.716 ayat**
  · sidik `10-13716-1:1533,2:1213,4:1288,18:1070,19:2461,23:1292,24:1364,26:1273,40:1071,42:1151`.
- `tools/buat-1-berkas.js` (sekali saja di akhir) → HP **14,20 MB** (data Penguat 2.441,8 KB).
- **Penanda versi naik `v19Sep-c` → `v19Sep-d`** di `plugin/penguat/tampilan.js` — supaya
  Bapak bisa membuktikan berkas yang dibuka memang berkas baru (aturan K47c).
- `tools/uji-cepat.js` blok **K47 disegarkan**: K47-08 `9→10` · K47-09 `12646→13716` ·
  K47-10 `+kitabAda(18)` · K47-11 `+jumlahAyat(18)===1070` · K47-18 `9→10` ·
  **K47-13h baru** (penguat Ayub 1:21 · 19:25 · 42:17).

**Bukti (bukan dugaan)**
- `cek-penguat.js 18` per pasal cocok **semua (42 pasal)** · `18.1.1 → ADA` · `18.42.17 → ADA`
  · tidak ada kunci kembar.
- Uji cepat di `ANodes-1berkas.html`: **215 uji, 1 gagal** (K42g-02 — kamus, di luar cakupan),
  **blok K47: 48 uji, 0 gagal**.

**Berkas:** `plugin/penguat/data/penguat.js` · `plugin/penguat/tampilan.js` · `tools/uji-cepat.js` ·
`ANodes-1berkas.html` · `agents.md` · `prompt.md` · `rencanakerja.md` · `CHANGELOG.md`.

**Cacat yang harus diwaspadai (jangan diulang):** lupa memeriksa `dan dan` sebelum
`tambah-komentar.js` (alat itu **tidak** memeriksanya) — hari ini muncul 2× dan bisa ditangkap
dulu; salah hitung “dinyatakan dengan N hal” muncul 5× pada ayat panjang.

⏭️ **BERIKUTNYA: kitab ke-11 = ULANGAN** (bookId 5 · 34 pasal · **959 ayat**) — `data/komentar/5.json`.

---

## 19 September 2026 — 🐞 K47e: **ISI EKSPOR PDF KELUAR TEKS MENTAH** — ketemu lewat uji Chrome sungguhan

> Bapak: *“apakah km bisa test menggunakan browser chrome .. kalau bisa mungkin lebih terbuka
> masalah selama ini terjadi”* — **Bapak benar**: dengan menguji di browser sungguhan
(bukan hanya memanggil fungsi di Console), **satu bug lama langsung terbuka**.

**Bug yang ketemu:** halaman cetak/PDF berisi **teks mentah** —
`<p>Kalimat saya sebelum ayat</p><p></p><p>Rom 4:3</p>…` tertulis apa adanya di kertas.

| Sebab | Perbaikan |
|---|---|
| `eksporPDF()` menyerahkan hasil `isiMarkdown()` (**sudah HTML**) ke `keHtmlSederhana()` yang mengira masukannya **markdown** → seluruh HTML **di-escape** jadi teks | fungsi baru **`keHtmlCetak(html)`**: HTML dibiarkan HTML, yang berbahaya dibuang, markdown **sisa** (tebal/kode/miring) diubah jadi elemen |
| `span.ay-link` (tautan ayat) ikut tercetak | dibuang di cetakan (hanya teksnya) |
| `contenteditable` / `on…` / `data-ref` ikut | semuanya dibuang |

**Bukti sesudah perbaikan** (dibuka di Chrome lewat klik nyata File → ⤓ Ekspor .pdf):
isi cetak **7 paragraf rapi** · judul `h1` **1** · tebal **1** · miring **1** · daftar **2 item** ·
`code` **1** · kutipan **1** · **tidak ada** tag tertulis sebagai teks.

**Uji baru:** **K47d-01…K47d-07** (wadah cetak · isi rapi · bukan teks mentah · tautan ayat dibuang ·
`window.open` tidak dipakai).
⚠️ **Pelajaran uji:** uji `window.open` WAJIB membuang komentar dulu — komentar peringatan di kode
memuat kata itu sehingga ujinya gagal palsu (K47d-07).

**Berkas:** `js/editor.js` (`eksporPDF` · `keHtmlCetak` baru).
**Uji:** blok **K47: 48 uji, 0 gagal** · uji cepat keseluruhan **214 uji, 1 gagal** (K42g-02). HP **14,03 MB**.

---

## 19 September 2026 — 🐞 K47d: **PESAN “Unsafe attempt to load URL” DI CONSOLE** (ekspor PDF)

> Bapak mengirim tangkapan Console:
> ```
> Unsafe attempt to load URL file:///C:/data/ANodes/ANodes-1berkas.html from frame with URL
> file:///C:/data/ANodes/ANodes-1berkas.html. 'file:' URLs are treated as unique security origins.
> ```

**Sebabnya (diperiksa, bukan diduga):** `eksporPDF()` di `js/editor.js` memakai
`window.open('', '_blank')`. Di Chrome + `file://` jendela kosong itu **mewarisi URL halaman
ANodes** → Chrome menganggap memuat berkas yang sama dari “frame” lain dan menulis
peringatan itu di Console. Fungsi PDF-nya sebenarnya **jalan**, hanya pesannya membingungkan.

| Sebelum | Sesudah |
|---|---|
| `window.open('', '_blank')` + `w.document.write(…)` | **`<iframe id="bingkai-cetak">` tersembunyi** di halaman sendiri → tulis isi cetak ke situ → `contentWindow.print()` |
| `w.print()` | `iframe.contentWindow.print()` |
| muncul peringatan ancaman keamanan di Console | **tidak ada pesan** (tidak ada URL/jendela baru) |

⚠️ **Bentuk iframe penting:** `position:fixed` + lebar/tinggi **1px** + `opacity:0` —
❌ **BUKAN** `display:none` (sebagian browser tidak mencetak isi iframe yang `display:none`).

**Berkas:** `js/editor.js` (`eksporPDF` · `cetakLewatIframe` baru).
**Uji:** ekspor PDF dijalankan → isi cetak terbentuk (424 huruf) · **tidak ada halaman baru** ·
blok **K47: 41 uji, 0 gagal** · uji cepat keseluruhan **207 uji, 1 gagal** (K42g-02). HP **14,03 MB**.
Penanda versi naik → **v19Sep-c**.

---

## 19 September 2026 — 🏷️ K47c: **PENANDA VERSI** — supaya bisa dibuktikan berkas baru sudah termuat

> Bapak: *“cek visual studio sudah terbaru.. sedang dibrowser chome tidak berubah.. sudah F5 masih tetap sama”*
> — **kasus yang sama seperti `rencanakerja.md` dulu.**

**Diperiksa (bukan diduga):** hanya ada **satu** `ANodes-1berkas.html` di komputer ini
(`C:\data\ANodes\`) dan berkas itu **sudah memuat semua perubahan**.
Sebab paling sering: Chrome membuka **`index.html`** (kerangka) — bukan berkas **menyatu**.

| Perbaikan | Isi |
|---|---|
| Penanda versi | baris POSISI pasal → **“… di bar atas · `v19Sep-b`”** |
| API versi | `ANodesPenguatTampilan.versi()` → `“v19Sep-b”` |
| Panduan | `panduan.md` bagian **4a-b** — “sudah diperbaiki di VS Code, Chrome belum berubah” |

**Aturan baru:** setiap perbaikan tampilan **WAJIB** diberi **penanda versi** yang mudah dilihat,
supaya Bapak bisa membuktikan sendiri — ❌ jangan cuma bilang “sudah ada / coba F5”.

**Uji:** blok **K47: 41 uji, 0 gagal** (+ **K47-22c & K47-22d** penanda versi) ·
uji cepat keseluruhan **207 uji, 1 gagal** (K42g-02 di luar cakupan). HP **14,02 MB**.

---

## 19 September 2026 — 🔍 K47b: HALAMAN PENGUAT **DIPERJELAS** (pasal vs ayat tidak lagi tertukar)

> Keluhan Bapak: *“baru sampai 25, seharusnya 28 pasal”* — dikira Matius baru punya 25 pasal.
> **Diperiksa sampai akar (bukan diduga):** datanya **SUDAH LENGKAP** —
> `data/komentar/40.json` = **1.071 ayat** (p26=75 · p27=66 · p28=20) · data penguat ANodes =
> **9 kitab · 12.646 ayat** · halaman penguat memang sudah bisa membuka **Matius 26 · 27 · 28**
> (dibuktikan dengan benar-benar membukanya, bukan menebak).
> **Sebab kebingungan:** judul **“Matius 1”** + deret angka **1–25** di bawahnya —
> angka itu **NOMOR AYAT** (Matius 1 memang 25 ayat), **bukan** jumlah pasal.

| Yang diperjelas | Sesudah |
|---|---|
| Baris baru di bawah judul | **“Pasal 1 dari 28 pasal — ganti pasal lewat daftar ▾ di bar atas”** |
| Deret angka | diberi label **“Ayat — klik untuk menuju penguatnya:”** |
| Dropdown pasal | `title` → “Pilih pasal — Matius punya 28 pasal” |

**Berkas:** `plugin/penguat/tampilan.js` (`.pg-posisi` · `.pg-lbl-ayat`) · `css/app.css` ·
`tools/uji-cepat.js` (**K47-22a & K47-22b BARU**).
**Uji:** **205 uji, 1 gagal** (K42g-02 di luar cakupan) · blok **K47: 39 uji, 0 gagal**. HP **14,02 MB**.

---

## 19 September 2026 — ✅ K45: **KITAB KE-9 = LUKAS SELESAI 100 %** (24 pasal · 1.151 ayat)

> Lanjutan **K45** setelah Keluaran. Dikerjakan **12 giliran** dalam **1 hari** — pasal 1 ·
> 2–3 · 4–5 · 6–7 · 8–9 · 10–11 · 12–13 · 14–15 · 16–17 · 18–19 · 20–21 · 22 · 23–24.
> ⚠️ **Kitab baru** ⇒ 3 langkah tambahan dikerjakan lebih dulu.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan | belum ada | ✅ **Lukas 1–24 = 1.151 ayat** |
| `data/komentar/42.json` | — | **230,7 KB** |
| `android/lab3-offline.html` | 13,79 MB | **14,02 MB** |
| **Total penguat** | 11.495 ayat | **12.646 ayat** (**9 kitab tuntas**, **±40,7 %** Alkitab) |

**✅ Dibuktikan** (`node tools/cek-penguat.js 42`): per pasal **cocok semua**
(p1=80 · p2=52 · p8=56 · p9=62 · p12=59 · **p22=71** · p23=56 · p24=53) ·
`42.1.1 → ADA` · `42.24.53 → ADA` · tidak ada kunci kembar · **tidak ada ayat terlewat**.

⚠️ **Pasal panjang wajib lengkap:** 1=80 · 22=71 · 9=62 · 12=59 · 8=56 · 23=56 · 11=54 · 24=53 · 2=52 ayat.
⚠️ **Lukas 17:36 ada** (ayat dalam kurung) — jangan dilewatkan.
⚠️ **Cacat kecil yang ditangkap alat:** tulisan ganda `dan dan` (35 di batch 42-14 · 33 di 42-15 ·
1 di 42-22) → **wajib dibersihkan dengan skrip sebelum digabung**.

🗂️ **Bukti:** **24 berkas batch** diarsipkan ke `bible/backup/komentar-batch-lukas/`.

### ANodes — plugin 🖊 Pembaca Penguat ikut menyegar
- `node tools/siapkan-data-penguat.js` → **9 kitab · 12.646 ayat · 2.272,9 KB** ·
  sidik `9-12646-1:1533,2:1213,4:1288,19:2461,23:1292,24:1364,26:1273,40:1071,42:1151`
- `node tools/buat-1-berkas.js` → HP **14,01 MB**
- Uji cepat: **203 uji, 1 gagal** (K42g-02 di luar cakupan) · blok **K47: 37 uji, 0 gagal**
  (baru: **K47-13g** Lukas 2:11 · 15:20 · 24:6)

⏭️ **BERIKUTNYA: kitab ke-10 = AYUB** (bookId 18 · 42 pasal · **1.070 ayat**) → `data/komentar/18.json`.


## 19 September 2026 — ✅ K45: **KITAB KE-8 = KELUARAN SELESAI 100 %** (40 pasal · 1.213 ayat)

> Lanjutan **K45** setelah Yehezkiel. Dikerjakan **20 giliran** dalam **1 hari** — pasal 1–2 ·
> 3–4 · 5–6 · 7–8 · 9–10 · 11–12 · 13–14 · 15–16 · 17–18 · 19–20 · 21–22 · 23–24 · 25–26 ·
> 27–28 · 29–30 · 31–32 · 33–34 · 35–36 · 37–38 · 39–40.
> ⚠️ **Kitab baru** ⇒ 3 langkah tambahan dikerjakan lebih dulu.

| Hal | Sebelum | Sesudah |
|---|---|
| Cakupan | belum ada | ✅ **Keluaran 1–40 = 1.213 ayat** |
| `data/komentar/2.json` | — | **258,7 KB** |
| `android/lab3-offline.html` | 13,54 MB | **13,79 MB** |
| **Total penguat** | 10.282 ayat | **11.495 ayat** (**8 kitab tuntas**, **±37,0 %** Alkitab) |

**✅ Dibuktikan** (`node tools/cek-penguat.js 2`): per pasal **cocok semua**
(p11=10 · **p12=51** · p25=40 · p29=46 · p39=43 · p40=38) ·
`2.1.1 → ADA` · `2.40.38 → ADA` · tidak ada kunci kembar · **tidak ada ayat terlewat**.

⚠️ **Pasal panjang wajib lengkap:** 12=51 · 29=46 · 28=43 · 39=43 · 25=40 · 30=38 · 36=38 · 40=38 ayat.
⚠️ **Keluaran 11 hanya 10 ayat** (terpendek) — jangan menebak, pakai `lihat-pasal.js`.

🗂️ **Bukti:** **40 berkas batch** diarsipkan ke `bible/backup/komentar-batch-keluaran/`.

### ANodes — plugin 🖊 Pembaca Penguat ikut menyegar
- `node tools/siapkan-data-penguat.js` → **8 kitab · 11.495 ayat · 2.055,5 KB** ·
  sidik `8-11495-1:1533,2:1213,4:1288,19:2461,23:1292,24:1364,26:1273,40:1071`
- `node tools/buat-1-berkas.js` → HP **13,80 MB**
- Uji cepat: **202 uji, 1 gagal** (K42g-02 di luar cakupan) · blok **K47: 33 uji, 0 gagal**
  (baru: **K47-13f** Keluaran 3:14 · 14:21 · 20:3)

⏭️ **BERIKUTNYA: kitab ke-9 = LUKAS** (bookId 42 · 24 pasal · **1.151 ayat**) → `data/komentar/42.json`.

## 19 September 2026 — ✅ K45: **KITAB KE-7 = YEHEZKIEL SELESAI 100 %** (48 pasal · 1.273 ayat)

> Lanjutan **K45** setelah Bilangan (lihat entri di bawah). Dikerjakan **25 giliran**
> dalam **1 hari** — pasal 1–2 · 3–4 · 5–6 · 7–8 · 9–10 · 11–12 · 13–14 · 15–16 · 17 · 18 ·
> 19–20 · 21–22 · 23–24 · 25–26 · 27–28 · 29–30 · 31–32 · 33–34 · 35–36 · 37–38 · 39–40 ·
> 41–42 · 43–44 · 45–46 · 47–48.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan | belum ada | ✅ **Yehezkiel 1–48 = 1.273 ayat** |
| `data/komentar/26.json` | — | **302,1 KB** |
| `android/lab3-offline.html` | 13,24 MB | **13,54 MB** |
| **Total penguat** | 9.009 ayat | **10.282 ayat** (**7 kitab tuntas**, **±33,1 %** Alkitab) |

**✅ Dibuktikan** (`node tools/cek-penguat.js 26`): per pasal **cocok semua**
(p15=8 · **p16=63** · p20=49 · p23=49 · p40=49 · p48=35) ·
`26.1.1 → ADA` · `26.48.35 → ADA` · tidak ada kunci kembar · **tidak ada ayat terlewat**.

⚠️ **Pasal panjang wajib lengkap:** 16=63 · 20=49 · 23=49 · 40=49 · 36=38 · 27=36 · 48=35 · 33=33 ayat.
⚠️ **Yehezkiel 15 hanya 8 ayat** (terpendek) — jangan menebak, pakai `lihat-pasal.js`.

🗂️ **Bukti:** **25 berkas batch** diarsipkan ke `bible/backup/komentar-batch-yehezkiel/`.

### ANodes — plugin 🖊 Pembaca Penguat ikut menyegar
- `node tools/siapkan-data-penguat.js` → **7 kitab · 10.282 ayat · 1.809,8 KB** ·
  sidik `7-10282-1:1533,4:1288,19:2461,23:1292,24:1364,26:1273,40:1071`
- `node tools/buat-1-berkas.js` → HP **13,55 MB**
- Uji cepat: **201 uji, 1 gagal** (K42g-02 di luar cakupan) · blok **K47: 32 uji, 0 gagal**
  (baru: **K47-13e** Yehezkiel 1:1 · 37:5 · 48:35)

⏭️ **BERIKUTNYA: kitab ke-8 = KELUARAN** (40 pasal · **1.213 ayat**) → `data/komentar/2.json`.

## 19 September 2026 — ✅ K45: **KITAB KE-6 = BILANGAN SELESAI 100 %** (36 pasal · 1.288 ayat)

> Lanjutan **K45** setelah Yesaya (lihat entri di bawah). Dikerjakan **20 giliran**
> dalam **2 hari** — pasal 1–2 · 3–4 · 5–6 · 7 · 8–10 · 11–12 · 13–14 · 15 · 16 · 17–18 ·
> 19–20 · 21 · 22 · 23 · 24 · 25 · 26 · 27 · 28 · 29–30 · 31 · 32 · 33 · 34 · 35–36.

| Hal | Sebelum | Sesudah |
|---|---|---|
| `bible\data\komentar\4.json` | belum ada | ✅ **258,4 KB** |
| Cakupan | — | ✅ **Bilangan 1–36 = 1.288 ayat** |
| Build `bible\android\lab3-offline.html` | 12,99 MB | **13,24 MB** |
| **Total penguat** | 7.721 ayat | **9.009 ayat** (Matius + Mazmur + Kejadian + Yeremia + Yesaya + **Bilangan** = **6 kitab tuntas**, **29,0 % Alkitab**) |
| Data plugin 🖊 Pembaca Penguat (ANodes) | 5 kitab · 7.721 · 1.277,8 KB | **6 kitab · 9.009 ayat · 1.522,7 KB** |
| Versi HP `ANodes-1berkas.html` | 13,03 MB | **13,27 MB** |

✅ **DIBUKTIKAN** — hitungan **per pasal** dari `cek-penguat.js 4` **cocok semua** dengan
sumber Alkitab (p1=54 · p2=34 · p3=51 · p4=49 · p5=31 · p6=27 · **p7=89** · p8=26 · p9=23 ·
p10=36 · p11=35 · p12=16 · p13=33 · p14=45 · p15=41 · **p16=50** · p17=13 · p18=32 · p19=22 ·
p20=29 · p21=35 · p22=41 · p23=30 · p24=25 · p25=18 · **p26=65** · p27=23 · p28=31 · p29=40 ·
p30=16 · **p31=54** · p32=42 · **p33=56** · p34=29 · p35=34 · p36=13) ·
`4.1.1 → ADA` · `4.36.13 → ADA`. **Ayat terlewat: TIDAK ADA** · tidak ada kunci kembar.

⚠️ **Pasal panjang yang wajib lengkap:** 26=65 · 33=56 · 1=54 · 31=54 · 3=51 · 16=50 · 4=49.

🗂️ **Bukti batch:** 25 berkas `_batch-4-*.json` diarsipkan ke
`bible\backup\komentar-batch-bilangan\`.

➕ **Uji diperbarui** (`ANodes\tools\uji-cepat.js`): **K47-08** (5→**6 kitab**) ·
**K47-09** (7.721→**9.009 ayat**) · **K47-10** (+ Bilangan) · **K47-11** (+1288) ·
**K47-18** (`options.length` 5→**6**) · **K47-13d BARU** (Bilangan 1:1 · 6:24–26 · 36:13).
Hasil: **200 uji, 1 gagal** (K42g-02 — di luar cakupan penguat) · blok **K47: 34 uji, 0 gagal**.

⏭️ **BERIKUTNYA: kitab ke-7 = YEHEZKIEL** (48 pasal · 1.273 ayat) → `data/komentar/26.json`.

---

## 19 September 2026 — ✅ K45: **KITAB KE-5 = YESAYA SELESAI 100 %** (66 pasal · 1.292 ayat)

> Lanjutan **K45** setelah Yeremia (lihat entri di bawah). Dikerjakan **18 giliran**
> (pasal 1–3 · 4–6 · 7–9 · 10–12 · 13–15 · 16–18 · 19–21 · 22–24 · 25–27 · 28–30 · 31–34 ·
> 35–38 · 39–42 · 43–46 · 47–50 · 51–54 · 55–58 · 59–62 · 63–66) dalam **1 hari**.

| Hal | Sebelum | Sesudah |
|---|---|---|
| `bible\data\komentar\23.json` | belum ada | ✅ **290,9 KB** |
| Cakupan | — | ✅ **Yesaya 1–66 = 1.292 ayat** |
| Build `bible\android\lab3-offline.html` | 12,71 MB | **12,99 MB** |
| **Total penguat** | 6.429 ayat | **7.721 ayat** (Matius + Mazmur + Kejadian + Yeremia + **Yesaya** = **5 kitab tuntas**, **24,8 %** Alkitab) |
| Data plugin 🖊 Pembaca Penguat (ANodes) | 4 kitab · 6.429 · 1.002 KB | **5 kitab · 7.721 ayat · 1.277,8 KB** |
| Versi HP `ANodes-1berkas.html` | 13,06 MB | **13,03 MB** |

**Kerangka kitab baru (3 langkah, wajib untuk tiap kitab baru):**
1. `bible\data\komentar\23.json` dibuat (`{meta, ayat:{}}`);
2. `'data/komentar/23.json'` ditambahkan ke **`DATA_FILES`** di `bible\tools\build-lab3.js`;
3. `muatData('komentar-23', …)` + gabung ke `komentarData` di `bible\lab3.html` (±baris 3215).

**Urutan tiap langkah:** `node tools/lihat-pasal.js 23 <pasal>` (dari `C:\data\bible`) →
tulis `data/komentar/_batch-23-<pasal>.json` → `node tools/tambah-komentar.js <berkas batch>` →
`node tools/build-lab3.js` → **`node tools/cek-penguat.js 23`** (bukti per pasal) →
di ANodes: `node tools/siapkan-data-penguat.js` → `node tools/buat-1-berkas.js`.

✅ **DIBUKTIKAN** — hitungan **per pasal** dari `cek-penguat.js` **cocok semua** dengan sumber
Alkitab (p1=31 · p2=22 · … · p66=24) · `23.1.1 → ADA` · `23.66.24 → ADA`.
**Ayat terlewat: TIDAK ADA.** Tidak ada kunci kembar (penjaga di `tambah-komentar.js`).

⚠️ **Pelajaran yang dipakai dari pekerjaan sebelumnya:**
1. **Angka diambil dari alat**, jangan menebak ukuran berkas.
2. **Kunci kembar** ditulis 2× akan hilang diam-diam — alat **menolak** dan memeriksa nomor ayat.
3. **Pasal panjang wajib lengkap** (Yesaya 37 = 38 · 10 = 34 · 30 = 33 · 14 = 32) — bandingkan
   **hitungan per pasal**, bukan perasaan.

🗂️ **Bukti:** **19 berkas batch** Yesaya diarsipkan ke `bible\backup\komentar-batch-yesaya\`.

⚠️ **CACAT NYATA YANG KETEMU & DIPERBAIKI (jangan diulang):** sesudah Yesaya ditambahkan,
halaman 🖊 Pembaca Penguat **masih menampilkan 4 kitab** — sebab **simpanan lama di IndexedDB**
(kunci `penguat`, 4 kitab) dipakai lebih dulu dan **menang** atas berkas data yang baru.
**Perbaikan:** alat `tools/siapkan-data-penguat.js` kini menulis **`meta.sidik`**
(`jumlahKitab-jumlahAyat-isi per kitab`, mis. `5-7721-1:1533,19:2461,23:1292,24:1364,40:1071`),
dan `plugin/penguat/penguat.js → muat()` **membaca berkas data lebih dulu**, lalu simpanan
IndexedDB dipakai **hanya kalau sidiknya SAMA**; sidik beda → simpanan **ditimpa**.
⇒ **Setiap menambah kitab penguat, cukup jalankan `siapkan-data-penguat.js`** — simpanan lama
diabaikan sendiri, tidak perlu minta Bapak hapus IndexedDB.

✅ **Uji:** **199 uji, 0 gagal** (`tools/uji-cepat.js`) — blok **K47** diperbarui
(**K47-08/09/10/11/18** → 5 kitab · 7.721 ayat) + **K47-13b** (Yesaya 53:5) ·
**K47-13c** (Yesaya 1:1 & 66:24). Versi HP **13,03 MB**.

⏭️ **BERIKUTNYA: kitab ke-6 = BILANGAN** (36 pasal · **1.288 ayat**).

## 19 September 2026 — ✅ K47: **PLUGIN 🖊 PEMBACA PENGUAT (MANDIRI)** — baca hasil penguat tanpa catatan

> Bapak: *“sebelum lanjut yesaya.. tolong buat plugin sementara.. ingin liat isi.. tapi plugin
> **bukan konek ke catatan**.. ini **mandiri**.. buka liat baca seperti alkitab.. **mandiri saja**..
> mau baca2 hasilnya”*

**⚠️ MANDIRI — tidak menyentuh catatan/editor sama sekali** (bukan tandai kata · bukan panel catatan).
Hanya membuka **halaman sendiri** (seukuran catatan) untuk membaca.

| Hal | Nilai |
|---|---|
| Data | **5 kitab · 7.721 ayat · 1.277,8 KB** (Matius 1.071 · Mazmur 2.461 · Kejadian 1.533 · Yeremia 1.364 · **Yesaya 1.292**) |
| Isi halaman | kitab ▾ · pasal ▾ · ◀ ▶ · deretan nomor ayat · **teks ayat + kotak penguat** (krem + garis cokelat) |
| 🔍 Cari | mencari **di dalam isi penguat** — hasil bisa diklik → langsung ke ayatnya |
| Ingat bacaan | kitab & pasal terakhir diingat (`anodes-penguat-bacaan`) |
| Uji | **199 uji, 0 gagal** (`tools/uji-cepat.js`) — blok **K47-01…K47-31** + Yesaya (**K47-13b/13c**) |
| Versi HP | ✅ **13,03 MB** (data Penguat 1.277,8 KB ikut) |

**Berkas baru:** `tools/siapkan-data-penguat.js` (alat data) · `plugin/penguat/plugin.js` (keterangan) ·
`plugin/penguat/penguat.js` (mesin · IndexedDB kunci `penguat`) · `plugin/penguat/tampilan.js` (halaman baca) ·
`plugin/penguat/data/penguat.js` (hasil alat, ±1 MB).
**Berkas diubah:** `index.html` (halaman `#penguat-halaman` + 3 `<script>`) · `css/app.css` (`.halaman-penguat` & `.pg-*`) ·
`tools/buat-1-berkas.js` (menyatukan data) · `tools/uji-cepat.js` (**K47-01…K47-31** + kunci `anodes-penguat-bacaan`).

❌ **Tidak disentuh:** `js/editor.js` · `js/store.js` · plugin `alkitab`/`ayat-terkait`/`kamus` ·
`alkitab-tb.js`/`silang.js`/`kamus.js` (**hanya dibaca** untuk teks ayat) · folder `bible/**`.

✅ **Dibuktikan “mandiri”:** isi catatan **tidak berubah** · **tidak menambah tanda** · **tidak ada panel** di catatan
(K47-23/24/25) · sesudah ditutup catatan tetap utuh (K47-31).

⏭️ **BERIKUTNYA:** kembali ke **K45 — kitab ke-6 = BILANGAN** (36 pasal · 1.288 ayat).

## 19 September 2026 — ✅ K45: **KITAB KE-4 = YEREMIA SELESAI 100 %** (52 pasal · 1.364 ayat)

> Dikerjakan **12 giliran** dalam **2 hari** (18–19 Sep 2026). Kitab terbesar yang belum dikerjakan.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan | belum ada | ✅ **Yeremia 1–52 = 1.364 ayat** |
| Dari seluruh Alkitab | — | **4,4 %** |
| `bible\data\komentar\24.json` | — | **305,3 KB** |
| `bible\android\lab3-offline.html` | 12,42 MB | **12,71 MB** |
| **Total penguat** | 5.065 ayat | **6.429 ayat** (Matius + Mazmur + Kejadian + **Yeremia** = **4 kitab tuntas**, **20,7 %** Alkitab) |

✅ **Dibuktikan, bukan diduga** — `cek-penguat.js` mencocokkan **hitungan per pasal** dengan sumber:
**semua cocok** · `24.1.1 → ADA` · `24.52.34 → ADA`.

**12 giliran:** 1–3 · 4–6 · 7–11 · 12–16 · 17–21 · 22–26 · 27–31 · 32–36 · 37–41 · 42–46 · **47–52**.

⚠️ **Pelajaran dari Yeremia:**
1. **Pasal panjang wajib lengkap** — Yeremia 23 = 40 · 32 = 44 · 48 = 47 · 50 = 46 · **51 = 64 ayat**.
2. **Jangan menebak jumlah ayat dari ringkasan** — saya dua kali salah (menulis 135 padahal 143 · 62 padahal 98).
   **Selalu ambil angka dari `lihat-pasal.js` / `cek-penguat.js`.**

🗂️ **Bukti:** 11 berkas batch Yeremia diarsipkan ke `bible\backup\komentar-batch-yeremia\`.

⏭️ **BERIKUTNYA: kitab ke-5 = YESAYA** (66 pasal · **1.292 ayat** — kitab terbesar berikutnya).

## 19 September 2026 — K45: **YEREMIA giliran 10** (pasal 42–46 · total 1.127 ayat · 83 %)

| Giliran | Pasal | Tambahan | Cakupan |
|---|---|---|---|
| 10 | 42–46 | 98 | **1.127** |

| Hal | Nilai |
|---|---|
| Berkas | `bible\data\komentar\24.json` — **255,0 KB** |
| Build | `bible\android\lab3-offline.html` — **12,66 MB** |
| Dibuktikan | `24.46.28 → ADA` · per pasal p42=22 · p43=13 · p44=30 · p45=5 · p46=28 ✅ |
| **Total penguat** | **6.192 ayat** |

📖 **Isi penting:** pasal 42 — sisa Yehuda minta didoakan, **berjanji menuruti apa pun**, lalu **tidak menurut** · pasal 44 — umat di Mesir **menolak firman** dan tetap menyembah ratu sorga · pasal 45 — firman penghibur bagi **Barukh**.

⚠️ **Koreksi angka:** ringkasan giliran sebelumnya menyebut **62 ayat** — keliru. Hitungan sebenarnya dari teks: 22+13+30+5+28 = **98 ayat** (per pasal sudah dicocokkan: **semua cocok**).

️ **BERIKUTNYA: Yeremia 47–51** (163 ayat · ±20 menit) — ⚠️ **Yeremia 48 = 47 · 50 = 46 · 51 = 64 ayat**.

## 19 September 2026 — K45: **YEREMIA giliran 9** (pasal 37–41 · total 1.029 ayat · 75 %)

| Giliran | Pasal | Tambahan | Cakupan |
|---|---|---|---|
| 9 | 37–41 | 101 | **1.029** |

| Hal | Nilai |
|---|---|
| Berkas | `bible\data\komentar\24.json` — **231,3 KB** |
| Build | `bible\android\lab3-offline.html` — **12,63 MB** |
| Dibuktikan | `24.41.18 → ADA` · per pasal p37=21 · p38=28 · p39=18 · p40=16 · p41=18 ✅ |
| **Total penguat** | **6.094 ayat** |

📖 **Isi penting:** pasal 38 — Yeremia **dilempar ke perigi berlumpur**, ditolong **Ebed-Melekh orang Etiopia** · pasal 39 — **Yerusalem jatuh**, Zedekia dibutakan · pasal 40–41 — **Gedalya dibunuh Ismael bin Netanya**.

⏭️ **BERIKUTNYA: Yeremia 42–46** (22+5+4+3+28 = 62 ayat · ±10 menit).

## 19 September 2026 — K45: **YEREMIA giliran 8** (pasal 32–36 · total 928 ayat · 68 %)

| Giliran | Pasal | Tambahan | Cakupan |
|---|---|---|---|
| 8 | 32–36 | 143 | **928** |

| Hal | Nilai |
|---|---|
| Berkas | `bible\data\komentar\24.json` — **208,0 KB** |
| Build | `bible\android\lab3-offline.html` — **12,61 MB** |
| Dibuktikan | `24.36.32 → ADA` · per pasal p32=44 · p33=26 · p34=22 · p35=19 · p36=32 ✅ |
| **Total penguat** | **5.993 ayat** |

📖 **Isi penting:** pasal 32 — Yeremia **membeli ladang di tengah pengepungan** (tanda iman bahwa negeri akan dipulihkan) · pasal 33 — janji **Tunas keadilan** & *“berserulah kepada-Ku maka Aku akan menjawab engkau”* (33:3) · pasal 36 — **raja membakar gulungan firman**, lalu firman ditulis ulang **bertambah banyak**.

⚠️ **Catatan angka:** rencana giliran menulis **143 ayat** — benar. (Ringkasan lisan saya sebelumnya sempat menulis 135 — itu kekeliruan; per pasal sudah dicocokkan: **semua cocok**.)

⏭️ **BERIKUTNYA: Yeremia 37–41** (101 ayat · ±15 menit).
## 19 September 2026 —  K45: **YEREMIA giliran 7** (pasal 27–31 · total 785 ayat · 57,6 %)

| Giliran | Pasal | Tambahan | Cakupan |
|---|---|---|---|
| 7 | 27–31 | 135 | **785** |

| Hal | Nilai |
|---|---|
| Berkas | `bible\data\komentar\24.json` — **175,1 KB** |
| Build | `bible\android\lab3-offline.html` — **12,58 MB** |
| Dibuktikan | `24.31.40 → ADA` · per pasal p27=22 · p28=17 · p29=32 · p30=24 · p31=40 ✅ |
| **Total penguat** | **5.850 ayat** |

📖 **Pasal 31 memuat nubuat PERJANJIAN BARU** (31:31–34) dan *“Aku mengasihi engkau dengan kasih yang kekal”* (31:3).

️ **BERIKUTNYA: Yeremia 32–36** (32+34+21+29+19 = 135 ayat · ±20 menit).
## 19 September 2026 — K45: **YEREMIA giliran 6** (pasal 22–26 · total 650 ayat · 48 %)

| Giliran | Pasal | Tambahan | Cakupan |
|---|---|---|---|
| 6 | 22–26 | 142 | **650** |

| Hal | Nilai |
|---|---|
| Berkas | `bible\data\komentar\24.json` — **144,3 KB** |
| Build | `bible\android\lab3-offline.html` — **12,55 MB** |
| Dibuktikan | `24.26.24 → ADA` · per pasal p22=30 · p23=40 · p24=10 · p25=38 · p26=24 ✅ |
| **Total penguat** | **5.715 ayat** (3 kitab tuntas + Yeremia 650) |

⚠️ **Pengingat pasal panjang:** Yeremia 51 = 64 ayat · Yeremia 48 = 47 ayat · Yeremia 50 = 46 ayat.

⏭️ **BERIKUTNYA: Yeremia 27–31** (135 ayat · ±20 menit).

## 18 September 2026 — 🔨 K45: **YEREMIA giliran 3–5** (pasal 7–21 · total 508 ayat · 37 %)

| Giliran | Pasal | Tambahan | Cakupan |
|---|---|---|---|
| 3 | 7–11 | 130 | 303 |
| 4 | 12–16 | 108 | 411 |
| 5 | 17–21 | 97 | **508** |

| Hal | Nilai |
|---|---|
| Berkas | `bible\data\komentar\24.json` — **113,2 KB** |
| Build | `bible\android\lab3-offline.html` — **12,52 MB** |
| Dibuktikan | `24.1.1 → ADA` · `24.21.14 → ADA` · per pasal cocok semua ✅ |
| **Total penguat** | **5.573 ayat** (4 kitab dikerjakan) |

⏭️ **BESOK MULAI DARI SINI: Yeremia 22–26** (142 ayat).

## 18 September 2026 — 🔨 K45: **YEREMIA giliran 2** (pasal 4–6 = 92 ayat)

| Hal | Nilai |
|---|---|
| Giliran 2 | **Yeremia 4–6** = 31 + 31 + 30 = **92 ayat** |
| Berkas | `bible\data\komentar\24.json` — **37,0 KB** (81 → 173 ayat) |
| Build | `bible\android\lab3-offline.html` — **12,44 MB** |
| Dibuktikan | `24.1.1 → ADA` · `24.6.30 → ADA` · per pasal p4=31 · p5=31 · p6=30 ✅ |
| **Total penguat** | **5.238 ayat** (4 kitab dikerjakan) |

⏭️ **Berikutnya: Yeremia 7–9.**

## 18 September 2026 — 🔨 K45: **KITAB KE-4 = YEREMIA dimulai** (giliran 1 · pasal 1–3 = 81 ayat)

> Lanjutan **K45** (isi penguat didahulukan, sistem menyusul). Sesudah 3 kitab tuntas
> (Matius · Mazmur · Kejadian = 5.065 ayat), kitab ke-4 = **YEREMIA**
> (kitab terbesar yang belum dikerjakan: 52 pasal · 1.364 ayat).

| Hal | Nilai |
|---|---|
| Giliran 1 | **Yeremia 1–3** = 19 + 37 + 25 = **81 ayat** |
| Berkas | `bible\data\komentar\24.json` — **17,6 KB** (baru) |
| Build | `bible\android\lab3-offline.html` — **12,42 MB** |
| Dibuktikan | `24.1.1 → ADA` · `24.3.25 → ADA` · per pasal p1=19 · p2=37 · p3=25 ✅ |
| **Total penguat** | **5.146 ayat** (4 kitab dikerjakan) |

**Berkas yang disentuh:** `bible\tools\build-lab3.js` (tambah `data/komentar/24.json` ke `DATA_FILES`) ·
`bible\lab3.html` (muat `komentar-24` + gabung ke `komentarData`).

⏭️ **Berikutnya: Yeremia 4–6.**

## 18 September 2026 — ✅ K45: **KITAB KEJADIAN SELESAI 100 %** (50 pasal · 1.533 ayat)

> Lanjutan **K45** (isi penguat didahulukan, sistem menyusul). Sesudah Mazmur tuntas,
> kitab ke-3 = **KEJADIAN** (kitab terbesar kedua yang belum dikerjakan:
> 50 pasal · 1.533 ayat · 147.411 huruf).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan | belum ada | ✅ **Kejadian 1–50 = 1.533 ayat** |
| Dari seluruh Alkitab | — | **4,9 %** |
| `bible\data\komentar\1.json` | — | **249,0 KB** |
| `bible\android\lab3-offline.html` | 12,16 MB | **12,41 MB** |
| **Total penguat** | 3.532 ayat | **5.065 ayat** (Matius + Mazmur + Kejadian = **3 kitab tuntas**, **16,3 %** Alkitab) |

✅ **Dibuktikan, bukan diduga** — `cek-penguat.js` mencocokkan **hitungan per pasal** dengan sumber
Alkitab: semua cocok · `1.1.1 → ADA` · `1.50.26 → ADA`.

**17 giliran:** p1-3 → p4-6 → p7-9 → p10-12 → p13-15 → p16-18 → p19-21 → p22-24 → p25-27 →
p28-30 → p31-33 → p34-36 → p37-38 → p39-41 → p42-44 → p45-47 → p48-50.

⚠️ **2 pelajaran dari Kejadian:**
1. **Pasal panjang wajib ditulis lengkap** — Kejadian 24 = 67 ayat · Kejadian 31 = 55 ayat.
2. **Ayat terlewat pernah terjadi** (`1.26.24` — saya skip satu ayat). **Ditangkap oleh hitungan
   per pasal di `cek-penguat.js`** — selalu bandingkan hitungan per pasal dengan sumber Alkitab.

🗂️ **Bukti:** 17 berkas batch Kejadian diarsipkan ke `bible\backup\komentar-batch-kejadian\`.

## 18 September 2026 — ✅ K45: **KITAB MAZMUR SELESAI 100 %** (150 pasal · 2.461 ayat)

> Lanjutan **K45** (isi penguat didahulukan, sistem menyusul). Sesudah Matius tuntas,
> Bapak: *“boleh mulai dari kitab terbanyak”* → **MAZMUR** (kitab terpanjang & terbanyak
> dalam Alkitab: 150 pasal · 2.461 ayat · 254.563 huruf).

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan | belum ada | ✅ **Mazmur 1–150 = 2.461 ayat** |
| Dari seluruh Alkitab | — | **7,9 %** |
| `bible\data\komentar\19.json` | — | **355,9 KB** |
| `bible\android\lab3-offline.html` | 11,82 MB | **12,16 MB** |
| **Total penguat** | 1.071 ayat | **3.532 ayat** (Matius + Mazmur = **2 kitab tuntas**, 11,4 % Alkitab) |

✅ **Dibuktikan, bukan diduga** — setiap ayat Mazmur dicocokkan satu per satu:
**ayat terlewat: TIDAK ADA** · **kunci tidak sah: TIDAK ADA**.

**15 giliran:** p1-10 → p11-20 → p21-30 → p31-40 → p41-50 → p51-60 → p61-70 → p71-80 →
p81-90 → p91-100 → p101-110 → p111-120 → p121-130 → p131-140 → p141-150.

⚠️ **2 pelajaran dari Mazmur:**
1. **Mazmur 119 = 176 ayat** (pasal terpanjang di Alkitab) — wajib ditulis lengkap, jangan disingkat.
2. **Kunci kembar muncul lagi** — saya pernah menulis `19.119.120` dua kali (yang kedua
   seharusnya `19.119.160`). **Pemeriksa di `tambah-komentar.js` menangkapnya** — selalu jalankan
   alat itu, jangan gabung berkas manual.

🗂️ **Bukti:** 15 berkas batch Mazmur diarsipkan ke `bible\backup\komentar-batch-mazmur\`.

**⏭️ Berikutnya:** **KEJADIAN** (kitab terbesar kedua yang belum dikerjakan: 50 pasal ·
1.533 ayat · 147.411 huruf) — mulai dari pasal 1–3 → lalu **K45 f** (sistem plugin penguat di ANodes).

## 18 September 2026 — ✅ K45: **KITAB MATIUS SELESAI 100 %** (28 pasal · 1.071 ayat)

> Lanjutan **K45** (isi penguat didahulukan, sistem menyusul) — dikerjakan **satu hari dalam
> 11 giliran**, dimulai dari cakupan 65 ayat (pasal 1–3) pagi ini.

| Hal | Pagi ini | Sekarang |
|---|---|---|
| Cakupan | Matius 1–3 (65 ayat) | ✅ **Matius 1–28 = 1.071 ayat** |
| Dari seluruh Alkitab | 0,2 % | **3,4 %** |
| `bible\data\komentar\40.json` | 13,7 KB | **167,2 KB** |
| `bible\android\lab3-offline.html` | — | **11,82 MB** |

✅ **Dibuktikan, bukan diduga** — setiap ayat Matius dicocokkan satu per satu:
**ayat terlewat: TIDAK ADA** · **salah nomor: TIDAK ADA**.

**11 giliran:** p4-5 → p6-7 → p8-13 → p14-15 → p16-17 → p18-19 → p20-21 → p22-23 → p24-25 → p26-27 → p28.

**3 alat di `C:\data\bible\tools\`:** `lihat-pasal.js` (baca teks pasal) ·
`tambah-komentar.js` (cadangan otomatis + periksa kunci kembar + periksa nomor ayat) ·
`cek-penguat.js` (bukti kunci masuk ke hasil build).

⚠️ **2 pelajaran:** alat `cek-penguat.js` menangkap **angka salah tulis** (`29,5 KB` → sebenarnya
`25,9 KB`) — pakai angka dari alat. Dan **satu kunci tertulis kembar** (`40.19.22` dua kali) —
alat sekarang **menolak** kesalahan seperti itu.

**⏭️ Berikutnya:** pilih **kitab kedua** (usul: Kejadian atau Mazmur) → lalu **K45 f** (sistem plugin penguat di ANodes).

## 18 September 2026 — 🖊 K45 lanjutan: PENGUAT ALKITAB Matius 6 & 7 (cakupan 138 → 201 ayat)

> Lanjutan **K45** (isi penguat didahulukan, sistem menyusul).
> **Matius pasal 6 (34 ayat)** — sedekah · doa · puasa · harta · kekuatiran.
> **Matius pasal 7 (29 ayat)** — menghakimi · minta · pintu sesak · pohon & buah · dua dasar.

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan | Matius 1–5 | **Matius 1–7** |
| Jumlah ayat | 138 | **201** |
| Dari total | 0,44 % | **0,65 %** (31.102 ayat) |
| `bible\data\komentar\40.json` | 25,9 KB | **36,1 KB** |
| `bible\android\lab3-offline.html` | 11,68 MB | **11,69 MB** ✅ 201 kunci ada · 0 ditimpa |

**Alat baru:** `C:\data\bible\tools\cek-penguat.js` — ringkasan cakupan + **bukti** kunci masuk ke hasil build.

**⏭️ Berikutnya:** Matius **pasal 8 & 9** (±72 ayat, ±20 menit).

## 18 September 2026 — 🖊 K45 DIMULAI: LENGKAPI PENGUAT ALKITAB (Matius 4 & 5 · 65 → 138 ayat)

> 💬 **Bapak:** *“saya ingin bagian ini mau dimulai untuk **menyelesaikan penguat kitab**..
> **setelah lengkap baru selesaikan sistem**.. kemarin setelah sistem selesai dan ada contoh
> beberapa.. **saya malas melanjutkan**.. karena tunggu lengkap padahal sistem sudah siap..
> sekarang saya mau **balik penguat alkitab terlebih dahulu dibuat** setelah selesai baru
> selesaikan sistem.”*

⚠️ **URUTAN KERJA DIBALIK:** **ISI penguat dikerjakan lebih dulu**, **SISTEM plugin ANodes menyusul**.
Alasannya masuk akal: kalau mesin selesai tetapi isinya cuma sedikit → **malas melanjutkan**.

### 🔧 Perkakas baru (di `C:\data\bible\tools\`)

| Alat | Guna |
|---|---|
| **`lihat-pasal.js`** | `node tools/lihat-pasal.js 40 6` → teks satu pasal (supaya nomor ayat akurat). Tanpa nomor pasal → daftar pasal + jumlah ayat. |
| **`tambah-komentar.js`** | `node tools/tambah-komentar.js data/komentar/_batch-40-4.json` → **cadangan otomatis** + gabung + urutkan + lapor berapa ditambah/ditimpa. |

**Urutan tiap langkah:** `lihat-pasal.js` → tulis berkas batch → `tambah-komentar.js` →
`build-lab3.js` → perbarui 3 dokumen. **1–2 pasal per giliran.**

### 📊 Hasil

| Hal | Sebelum | Sesudah |
|---|---|---|
| Cakupan | Matius 1–3 | **Matius 1–5** |
| Jumlah ayat | 65 | **138** (+25 pasal 4 · +48 pasal 5) |
| Dari total | 0,20 % | **0,44 %** (31.102 ayat) |
| Berkas `data/komentar/40.json` | 13,7 KB | **25,9 KB** |
| Hasil build `android/lab3-offline.html` | — | **11,68 MB** ✅ diperiksa: 138 kunci ada · **0 ditimpa/rusak** |

**Bukti:** berkas batch `data/komentar/_batch-40-4.json` & `_batch-40-5.json` ·
cadangan otomatis `bible\backup\komentar-40.json.bak-20260918-*`.

**Berkas yang diperbarui:** `bible\data\komentar\40.json` · `bible\android\lab3-offline.html` ·
`bible\prompt.md` · `bible\agents.md` · `bible\CHANGELOG.md` ·
`ANodes\rencanakerja.md` (kasus **K45**) · `ANodes\agents.md` (**bagian 0a00a5**) · `ANodes\CHANGELOG.md` (entri ini).

**⏭️ Berikutnya:** **Matius pasal 6 & 7** (±63 ayat, ±20 menit) — lalu 8, 9, … sampai 28,
baru pindah kitab lain. **Sistem plugin penguat di ANodes (K45 f) menyusul setelah isinya cukup.**

## 18 September 2026 — 🔎 PENGUAT AYAT (I-14) — HASIL TELUSUR: **SUDAH ADA & BERFUNGSI di lab3**

> Bapak: *“di lab3 ada fitur **penguat ayat** alkitab.. apakah km ketahui... **ini beda dengan
> kitab istilah**”* → lalu ditegaskan: *“coba telusuri dalam folder `C:\data\bible` **sudah
> dibuatkan library** atau Amplified Bible **bahkan sudah di terjemahkan dalam bahasa indonesia**..
> karena lab3 **sudah berfungsi** hanya masih **belum lengkap**.. **sudah ada dan sudah berfungsi**”*

⚠️ **Pemeriksaan pertama saya KURANG DALAM dan salah simpul.** Saya hanya melihat
`bible\android\lab3-offline.html` (11,9 MB) → menyimpulkan “belum ada”. **Bapak BENAR.**
Setelah ditelusuri **seluruh `C:\data`**, ternyata: **mesin + CSS + tempat tampil + data
Bahasa Indonesia SUDAH ADA** di **`C:\data\bible\lab3.html` (142,8 KB — lab paling baru)**.

### Yang ditemukan (fakta terukur)

| Hal | Fakta |
|---|---|
| Nama di lab3 | **“Penguat Alkitab”** = **komentar/tafsiran per ayat** — ❌ bukan kamus istilah |
| Letak | `bible\lab3.html` ✅ · `android\lab3-offline.html` ✅ · `tools\build-apk\work\assets\lab3-offline.html` ✅ · ±40 salinan backup ✅ · `lab2.html` & `android\alkitab-offline.html` ❌ |
| Di lab3.html | baris **237/403** CSS (`.ab-komentar` krem `#faf6ec` + garis `#b07d2b`) · **1288** `komentarData` · **1689** panel Gali Ayat · **2495** halaman baca pasal · **3215/3220** muat data |
| Data | `bible\data\komentar\40.json` — **13,7 KB** · **Matius saja** · pasal **1 = 25 · 2 = 23 · 3 = 17** = **65 ayat** |
| Dari total | **65 / 31.102 ayat = 0,2 %** ← inilah “belum lengkap” yang Bapak maksud |
| Sumber isi | *“Ringkasan komentar **public domain** (tradisi **JFB/Matthew Henry**), diterjemahkan ke Indonesia”* — **dikurasi**, ❌ bukan AI menebak |
| ❌ Di ANodes | **BELUM ADA** — pencarian `komentarData`/`ab-komentar`/`p-komentar` di seluruh `C:\data\ANodes` = **0 hasil** |

### Yang telah ditulis (belum ada kode baru)

- `rencanakerja.md` **bagian 16.2** — hasil telusur lengkap + SOP melengkapi isi +
  usul **K45** (butir a–f, ±60 menit untuk a–c).
- Papan **C. IDE → I-14** (permintaan Bapak) — diperbarui sesuai temuan.
- `agents.md` **bagian 0a00a5** + **aturan baru**: kalau Bapak bilang “sudah ada /
  sudah berfungsi” → **telusuri SELURUH `C:\data`** dulu, jangan hanya folder yang
  sedang dipakai, dan jangan berhenti pada berkas `*-offline.html` yang besar.

⚠️ **Catatan teknis penting:** lab3 memakai **`fetch()`** (dijalankan lewat server `start.bat`).
**ANodes murni `file://`** ⇒ data **wajib ditanam `<script src>`** (pola `alkitab-tb.js`) —
❌ jangan salin mentah dari lab3.

💡 **MILT** (versi literal Indonesia berkurung `Tuhan (YAHWEH - 2962)` · © Yayasan Lentera
Bangsa, *not public domain, gratis, non-profit*) = **hal TERPISAH**; datanya **belum ada**
di komputer (sudah diperiksa) — bisa jadi **K46** kalau nanti diperlukan.

## 18 September 2026 — 🧹 K44 SELESAI · TEMPEL NASKAH DARI LUAR → MASUK RAPI

> Bapak: *“ini diskusi karena belum tau apakah bisa di lakukan. misal dari google AI (gemini)
> minta buatkan artikel bla bla .. dibuatkan pada saat di copy paste **kurang keren tampilannya**
> apakah sistem bisa **otomatis merapihkan** ? 2. kalau saya dapat artikel dari website
> `https://sabda.org/....` saya copy paste apakah bisa rapih ..”*
>
> ✅ **PENEGASAN Bapak:** *“halaman sabda itu dijadikan **contoh** mau pakai **copy pelajaran
> alkitab lalu paste di ANodes** apakah bisa rapih.. **bukan maksud minta rapihkan halaman sabda
> itu bukan punya saya**.”* ⇒ **Hanya HASIL TEMPELAN di ANodes yang dirapikan** — halaman web
> sumber **tidak diapa-apakan**.
>
> ✅ **Perintah:** *“proses K44 #2”* → dikerjakan **pilihan 2**.

### Temuan sebelum dikerjakan (diuji di browser, bukan dugaan)

| Yang diperiksa | Hasil |
|---|---|
| Yang dipakai ANodes saat menempel | **`text/plain` saja** → naskah berbaris-baris **digabung jadi SATU blok** |
| Akibatnya | `**SASARAN**` tampil bintang-bintang · tautan tampil mentah `[1Yo 1:1-4](https://…)` · daftar hilang |
| **Pengolah markdown ANodes yang sudah ada** | ✅ **BAGUS** — tebal · daftar · tautan asli |
| Tombol **📖 Rapi** | ❌ tidak menawarkan diri — `bisaMarkdown()` menuntut **≥3 judul `#`**, naskah paket tidak memakai `#` |

⇒ Mesinnya **sudah ada**; yang kurang hanya **pintu paste** & **kata kunci** yang terlalu ketat.

### Hasil (pilihan 2) — semua terukur, uji K44-01…K44-16 lolos

| # | Hasil |
|---|-------|
| 1 | **pintu paste dibuka** — kalau tempelan memang **naskah bergaya** (≥120 huruf · ≥5 baris · ≥2 macam tanda), naskah **langsung dirapikan** memakai pengolah markdown yang sudah ada |
| 2 | baris `**SASARAN**` / `**TEKS**` / `**OBSERVASI**` sendiri → **JUDUL BAGIAN** |
| 3 | `1. MENGENAL SIAPAKAH YESUS` → **JUDUL BAB** |
| 4 | tautan Alkitab diringkas jadi nama ayat (`[1Yohanes 1:3](…)` → **`1Yo 1:3`**) |
| 5 | baris `____` → **tetap garis untuk menulis** (maks 3 baris — ❌ **tidak** jadi `<hr>`) |
| 6 | `**EVALUASI**` **dikecualikan** dari judul — bagian itu memang tempat menulis |
| 7 | kata kunci `bisaMarkdown()` **diluweskan** — naskah tanpa `#` kini diterima |
| 8 | semua penanda **tidak ikut tersimpan** — catatan tetap teks biasa |
| 9 | **tempelan biasa (kalimat pendek) TIDAK diubah** — tetap apa adanya seperti dulu |
| 10 | **salah rasa?** tekan **↶ (Ctrl+Z)** → kembali ke bentuk mentah |

### 🐞 3 cacat nyata yang ketemu saat menguji (sudah diperbaiki)

| # | Cacat | Akibat | Perbaikan |
|---|-------|--------|-----------|
| 1 | baris `____` dibiarkan apa adanya | pengolah markdown membacanya **GARIS PEMISAH (`<hr>`)** → **baris tulisnya HILANG** | diganti penanda sementara **`%%ANODES_GARIS%%`** sebelum diolah, lalu dibuat ulang jadi baris tulis |
| 2 | penanda baris tulis dibuat lewat `<p>` saja | penanda **menyatu** dengan paragraf “EVALUASI” lewat `<br>` → tidak terdeteksi | dicari lewat **TreeWalker text node** → diganti **`span.naskah-garis`** |
| 3 | `span.naskah-garis` belum dibuang saat menyimpan | penanda ikut ke berkas simpanan | ikut dibersihkan di **`bersihSemuaTanda()`** |

### Berkas

`js/editor.js` (`naskahBergaya` · `rapikanNaskah` · `hiaskanNaskah` · `padatkanGaris` ·
`labelAyatDariTeks` · pengait **`paste`** dibuka · `bersihSemuaTanda` diperluas) ·
`js/dokumen.js` (`bisaMarkdown` diluweskan) · `css/app.css` (`.naskah-judul` · `.naskah-bagian` ·
`span.naskah-garis` · `span.kamus-ay-link` di editor) · `tools/uji-cepat.js` (**K44-01…K44-16**).
❌ **Tidak disentuh:** plugin `alkitab` · `ayat-terkait` · `kamus` · data besar · halaman web sumber.

### 🧪 Uji & build

- **Uji cepat:** `tools/uji-cepat.js` → **166 uji, 0 gagal** (termasuk **K44-01…K44-16**).
  Uji penuh 403 uji **belum dijalankan** (menunggu izin Bapak).
- **📱 Versi HP:** ✅ `ANodes-1berkas.html` **11,67 MB**.
- **💾 Backup:** `backups/k44-tempel-rapi-20260918-181532/`.

---

## 18 September 2026 — 📚 K43 SELESAI · REVISI KAMUS ISTILAH (2 hal dari Bapak)

## 18 September 2026 — 📚 K43 SELESAI · REVISI KAMUS ISTILAH (2 hal dari Bapak)

> Bapak: *“ini sudah benar.. **harus ada garis putus2 seperti ini.. garis putus2 penting ..
> jangan di hilangkan**.. lanjut ... **1.** kadang arti kata yg tersedia terbatas / kurang
> lengkap .. **di atas tombol kembali ke catatan** . disediakan kolom user bisa ikut melengkapi
> **hanya terpisah** dengan istilah yg tersedia .. **2.** didalam kamus istilah kadang ada ayat
> yg sekarang sudah benar.. hanya ditambah tombol **[full]** disamping ayat `Kejadian 29:35` `[full]`
> <- fungsi adalah jika diklik **lompat ke alkitab**.. tapi setelah lompat kealkitab **bisa
> lompat kembali**.”*

⚠️ **GARIS PUTUS-PUTUS DIPERTAHANKAN** — Bapak menegaskan itu **penting** dan **jangan dihilangkan**.
Cara tampil bawaan tetap **`'putus'`** (dibuktikan uji **K43-01**).

### a. 📝 KOLOM CATATAN BAPAK (keterangan tambahan)

Kalau keterangan kamus terasa **kurang lengkap**, Bapak bisa menulis tambahan sendiri.

| Hal | Pelaksanaan |
|-----|-------------|
| Letak | **tepat DI ATAS** tombol `[🏠 kembali ke catatan]` (ketentuan Bapak) |
| Sifat | **TERPISAH** dari keterangan kamus — keterangan kamus **tetap utuh & tetap dipakai** |
| Isi | `textarea` + tombol `💾 Simpan catatan` & `🗑 Kosongkan` |
| Penyimpanan | **kamus pribadi** (`anodes-kamus-pribadi`) pada field **`catatan`** — ❌ **BUKAN** `arti` |
| Bertahan | pindah istilah lalu kembali → catatan tetap ada |

⚠️ **Kunci supaya keterangan kamus tidak tertimpa:** kalau entri pribadi hanya punya `catatan`,
halaman arti memakai **keterangan bawaan + catatan Bapak** (`entriUntukHalaman()`). Kalau ada
`arti` sendiri, artinya yang dipakai (perilaku kamus pribadi butir g).

### b. ↗ TOMBOL `[full]` DI SAMPING TIAP AYAT

```text
3️⃣ 📖 AYATNYA (2)
   [Kej 8:20] [↗ full]   [Kel 20:24-26] [↗ full]
       │ klik chip = teks tampil di kolom
       │ klik [full] = LOMPAT ke halaman baca Alkitab pada ayat itu
       ▼
HALAMAN BACA ALKITAB — Kejadian 8
   [📚] ← tombol kembali BERUBAH JADI 📚 (karena datang dari kamus)
       │ ditekan
       ▼
HALAMAN KAMUS lagi — istilah yang SAMA · chip ayat aktif · kolom ayat terisi lagi
```

| Hal | Pelaksanaan |
|-----|-------------|
| Cara lompat | `bukaFull()` → `ANodesAlkitabTampilan.bukaAyatDariLink()` — **jalur K20/K25 yang sudah ada**, ❌ tanpa mesin baru |
| Tombol kembali | berubah **📚** + keterangan *“Kembali ke kamus istilah …”* saat datang dari kamus; **🏠** seperti biasa kalau dari catatan |
| ⚠️ Titik aman | `tutupHalaman()` · `bukaIstilah()` · `bersihkan()` **wajib** membuang penanda → kalau tidak, label tombol bisa tertinggal jadi 📚 |
| Prinsip | **Alkitab tidak perlu tahu plugin Kamus ada** — `kembali()` **bertanya dulu** (`K47.dariKamus()`), baru mendelegasikan |

### Berkas

`plugin/kamus/tampilan.js` (`entriUntukHalaman` · `catatanBapak` · `simpanCatatanBapak` ·
`bukaFull` · `dariKamus` · `pulihDariAlkitab` · `segarkanTombolKembaliBaca` · tombol `[full]`
di `gambarArti`) · `plugin/alkitab/tampilan.js` (`kembali()` mendelegasikan ke Kamus) ·
`css/app.css` (`.kamus-ay-bungkus` · `.kamus-full` · `.kamus-catatan-*` · `.kamus-tanda-kembali`) ·
`tools/uji-cepat.js` (**K43-01…K43-15**).
❌ **Tidak disentuh:** mesin `kamus.js` · data `data/kamus.js` · plugin `ayat-terkait/**` · `silang.js`.

### 🧪 Uji & build

- **Uji cepat:** `tools/uji-cepat.js` → **150 uji, 0 gagal** (±70 detik) — termasuk **K43-01…K43-15**.
  Uji penuh 403 uji **belum dijalankan** (menunggu izin Bapak).
- **📱 Versi HP:** ✅ `ANodes-1berkas.html` **11,64 MB**.
- ⚠️ **Pelajaran uji:** kalau uji tampak “macet”, **pastikan tab browser di DEPAN**
  (`bringToFront()` + CDP `Emulation.setFocusEmulationEnabled`) — kalau tab di latar, Chrome
  menahan timer sehingga uji jalan sangat lambat (bukan bug).

---

## 18 September 2026 — 📚 K42 SELESAI (butir a–g) · PLUGIN **KAMUS ISTILAH** berfungsi penuh

## 18 September 2026 — 📚 K42 SELESAI (butir a–g) · PLUGIN **KAMUS ISTILAH** berfungsi penuh

> Bapak: *“setelah test kamus istilah.. masih belum berfungsi..”*

**Diperiksa dulu (bukan diduga):** yang sudah ada **baru butir a** (mesin + data, 17 Sep).
`plugin/kamus/tampilan.js` masih **kerangka kosong** (`tandaiSekarang()` & `bukaDaftar()`
hanya berisi catatan `⏳ butir …`). Jadi **memang belum berfungsi** — Bapak benar.

> Bapak memilih: *“proses satu2 tapi sampai tuntas.. tapi dilayar tampilkan progressnya sudah
> sampai mana.. berapa persen lagi dan berapa menit lagi selesai”* → dikerjakan
> **b → c → d → e → f → g** berurutan, tiap butir dengan **progress + perkiraan waktu** di layar.

### Yang dibuat (butir b–g)

| Butir | Hasil |
|-------|-------|
| **b** | **HALAMAN KE-4 `#kamus-halaman`** — `.app` **480px** = **sama persis ukuran catatan**, **MENIMPA catatan** · navbar `[🏠][↩] 📚 judul [📋 Daftar][🔍 Cari]` · **daftar 392 istilah** + kotak cari + antrian istilah |
| **c** | **garis putus-putus** `span.kamus-istilah` di catatan → klik = arti · ⚠️ **bagian paling rawan** (dua plugin menandai satu editor) · **kursor tidak lompat** · penanda tidak ikut tersimpan |
| **d** | **HALAMAN ARTI**: **① keterangan → ② istilah lain → ③ 📖 AYATNYA** · **SATU kolom ayat** berganti isi · **`🏠` kembali KE KATA yang diklik (sorot kuning)** · `↩` riwayat istilah 30 langkah |
| **e** | istilah ikut ditandai di **halaman baca Alkitab** (lewat `tambahPenghias`) + daftar “📚 Istilah di pasal ini” (maks 12) |
| **f** | panel **📋 Ayat & Istilah** di catatan (bisa dilipat) |
| **g** | **kamus pribadi + antrian istilah** — arti boleh kosong (`⏳ belum berarti` / `✅ sudah berarti`) + `📋 Salin daftar` |

### Berkas

`plugin/kamus/tampilan.js` (**ditulis ulang — inti pekerjaan**) · `plugin/kamus/plugin.js`
(`siap: true`) · `index.html` (**`#kamus-halaman`**) · `css/app.css` (`.halaman-kamus` · `.kamus-*`) ·
`js/editor.js` (**`tandaiSemuaTanda()`** satu pintu · `bersihSemuaTanda()`) · `js/plugin.js`
(teks “belum siap” jadi generik) · `plugin/alkitab/alkitab.js` (**+3 sebutan `Rm`/`Hos`/`Yl`** ·
**`window.ANodesTandaKelas`** · `diDalamTanda()`) · `tools/uji-cepat.js` (blok **K42a–K42g + K42x**).

### 🐞 4 CACAT NYATA yang ketemu saat menguji (sudah diperbaiki)

| # | Cacat | Akibat |
|---|-------|--------|
| 1 | `bisaTandai()` menuntut penanda `hidup` | setelah `bersihkan()`, istilah **tidak ditandai** walau plugin terpasang & data siap — **inilah sebab “kamus belum berfungsi”** |
| 2 | `tandaiWadah()` memulihkan kursor **hanya** kalau ada istilah baru | kata yang diketik tidak lagi istilah → tanda lama dibongkar → **kursor melompat ke awal baris** |
| 3 | teks bawaan halaman keterangan plugin | menulis *“Isi Alkitab (ayatnya) belum dimasukkan”* juga di plugin Kamus → membingungkan |
| 4 | `plugin/kamus/plugin.js` masih `siap: false` | tombol **⬇ Pasang** tidak muncul di kartu gudang |

### ⚙️ Cara risiko terbesar diselesaikan (butir c)

**DUA plugin menandai editor yang sama** (`span.ay-link` Alkitab + `span.kamus-istilah` Kamus):

```
window.ANodesTandaKelas = ['ay-link', 'kamus-istilah']   ← SATU daftar bersama
   ├─ alkitab.js → diDalamTanda(node)   ← melewati node bertanda MANA PUN
   └─ kamus/tampilan.js → acceptNode()  ← idem
js/editor.js → tandaiSemuaTanda()  ← SATU PINTU: ayat dulu → istilah kemudian
Simpan/Ekspor → bersihSemuaTanda() ← buang SEMUA tanda sekali jalan
```

### 🧪 Uji & build

- **Uji cepat:** `tools/uji-cepat.js` → **135 uji, 0 gagal** (±70 detik) — blok **K42a…K42g + K42x**.
  Uji penuh 403 uji **belum dijalankan** (menunggu izin Bapak).
- ⚠️ **Pelajaran uji (jangan diulang):** (1) label uji **JANGAN memuat `❌`** — teks
  `(❌ bukan di dalam #app-utama)` membuat uji yang LULUS dihitung **gagal palsu**;
  (2) jangan membandingkan lebar dengan `#app-utama` saat halaman kamus terbuka — elemen itu
  `hidden` sehingga lebarnya **0** (gagal palsu) → ukur `.app` sungguhan;
  (3) **jangan membandingkan nama yang diketik** dengan nama entri — `Tebusan` adalah **alias**
  dari entri `Penebusan` (data asli) → ambil nama **entri**;
  (4) `execCommand('insertText')` menggeser kursor **beda antar browser** → untuk uji kursor
  pakai ketikan sungguhan (`beforeinput` + `insertData`);
  (5) beri jeda **> 900 ms** (tunda penandaan otomatis editor) di antara langkah uji kursor —
  kalau tidak, ada penandaan liar yang ikut membongkar tanda.
- **📱 Versi HP:** ✅ `ANodes-1berkas.html` **11,60 MB** (data kamus 133,6 KB ikut).
- **💾 Backup:** `backups/kamus-sampai-tuntas-20260918-151541/`.

---

## 17 September 2026 (malam) — 📚 K42 **butir a SELESAI** · mesin + data Kamus Istilah

## 17 September 2026 (malam) — 📚 K42 **butir a SELESAI** · mesin + data Kamus Istilah

> Bapak: *“di proses butir a.. dan saya belum tau butir b apa rencanakerjanya”*

**Yang dibuat (butir a = pondasi):**

| Berkas | Isi |
|--------|-----|
| `tools/siapkan-data-kamus.js` | **baru** — menggabung 2 berkas JSON → 1 berkas data |
| `plugin/kamus/data/kamus.js` | **baru** — hasil alat (**135 KB**), jangan diedit tangan |
| `plugin/kamus/kamus.js` | **baru** — MESIN (`window.ANodesKamus`) |
| `plugin/kamus/plugin.js` | **baru** — keterangan plugin (gudang 🧩) |
| `plugin/kamus/tampilan.js` | **baru** — kerangka tampilan (kontrak `caraTampil`/`pilihCara`/`simpanCaraTampil`) |
| `index.html` | 3 tag `<script>` baru (sebelum `js/plugin.js`) |
| `tools/buat-1-berkas.js` | menyisipkan `data/kamus.js` ke versi HP |
| `tools/uji-cepat.js` | blok **K42a-01…K42a-21** + `anodes-kamus-cara` ke `KUNCI_AMAN` |

**📊 Hasil terukur:** `kamus.json` **340** + `kamus-tambahan.json` **69** → **17 ditimpa** tambahan →
**392 entri** · **427 tulisan siap deteksi** · **135 KB** · **0 entri dibuang**.
⚠️ Angka rencana (409/426) beda dari hasil (392/427) — sebabnya: **17 nama sama** di kedua berkas
(tambahan menang, jadi tidak dobel) + tulisan dihitung **unik**. **Normal, bukan kesalahan.**

**API mesin:** `muat` · `siap` · `meta` · `istilah(tulisan)` · `adaIstilah` · `semuaIstilah()` ·
`cariIstilah(kata)` · `temukanIstilah(teks)` · `istilahDiTeks(teks,maks)` · `jumlahIstilah` ·
`jumlahTulisan` · `ketikaSiap` · `padaSiap` · `saatSiap` · `dipasang` · `saatDilepas` · `siapkanOtomatis`.

**🧪 Uji:** **K42a-01…K42a-21** → **87 uji, 0 gagal** (`tools/uji-cepat.js`, ±20 detik).
**📱 Versi HP:** ✅ `ANodes-1berkas.html` **11,53 MB** — data kamus (133,6 KB) ikut disatukan;
diuji di berkas itu → 392 entri · 427 tulisan terbaca.
**💾 Backup:** `backups/kamus-butir-a-20260917-221333/`.

⚠️ **2 PELAJARAN UJI (keduanya kesalahan UJI, bukan kode):**
1. **K40-09** bergantung keadaan sebelumnya — `opsiPaketCatatan` dibaca **SEKALI** saat halaman
   dibuka, jadi `localStorage.removeItem('anodes-insert-ayat')` **tidak** mengembalikannya.
   Uji harus memastikan **mulai dari MATI** dulu.
2. **K42a-11** salah harapan — `Bul` **memang** istilah 3 huruf (bulan ke-8 kalender Yahudi),
   jadi harus **tetap** ditandai. Yang dilewati hanya `Ab` (2 huruf). **Jangan menebak isi kamus.**

⚠️ **PELAJARAN KECEPATAN (Bapak menunggu 25 menit):** jangan menunggu uji dengan **menebak waktu**
(`waitForTimeout`) berulang kali — pakai **polling** sekali. Uji cepat kini **87 uji ±20 detik**;
sebut angka itu **di awal**.

---

## 17 September 2026 (malam, lanjutan 2) — ⏸️ K42: **ayat terkait DITANGGUHKAN** + 💡 ide **bookmark** dipisah

> Bapak: *“1. sebenarnya bagus. tapi **sementara ditangguhkan untuk masuk ke ayat terkait**..
> alasannya menjadi **keluar fokus user** dan **sistem jadi kompleks**. harus **sederhana tapi
> canggih** menolong untuk penggalian.. harus ada ide untuk tangani ayat terkait.. ini pemikiran
> sementara: user bisa **beri tanda** untuk nanti dia akan telusuri — jadi dia beri tanda seperti
> **bookmark**.. nanti dia ke **[doc] → ayat terkait → pilih bookmark** ada ayat cuma satu dengan
> keterangan.. disana dia bisa telusuri ayat terkait.. ini baru ide · **jangan masuk dalam proses** ·
> **dipisah**.. harus dipikirkan atau km ada ide lebih baik · 2. sudah ada di no1.. saya mau
> **fokus dulu tangani kamus istilah**. nanti baru dikembangkan .. ide no1”*

**Dua keputusan Bapak:**

| # | Keputusan | Pelaksanaan |
|---|-----------|-------------|
| 1 | **Ayat terkait di halaman kamus = DITANGGUHKAN** | tombol `[📖 ayat terkait (n)]` **dibuang** dari rencana K42 · halaman kamus **tetap ramping**: keterangan + kolom ayat pendukung + 🏠 · bagian baru **`16.1c`** (daftar 3 hal yang ditangguhkan + alasan) |
| 2 | **Ide bookmark = DIPISAH** (❌ bukan bagian K42) | bagian baru **`16.1d`** (gambar alur + tabel nilai + **5 ide tambahan**) · masuk papan **C. IDE → I-13** · ⚠️ **4 hal harus diputuskan dulu** |

**Ide bookmark (dari Bapak):** tandai ayat **1 klik tanpa pindah halaman** (fokus tidak pecah) →
 nanti dibuka lewat **[Doc] → 🌿 Ayat Terkait → 📌 Bookmark** (ayat + keterangan singkat) →
 **dari sana** baru ditelusuri ayat terkaitnya — memakai **K25/K31 yang sudah ada** (❌ tidak ada mesin baru).

**5 ide tambahan dari saya:** (1) keterangan **otomatis** (potongan ayat + asal istilah/catatan) ·
(2) boleh **catatan sendiri** satu baris · (3) bisa menandai **di mana saja** (catatan/Alkitab/kamus) ·
(4) halaman kamus cukup **satu tombol kecil** `[📌 Tandai ayat ini]` ·
(5) bisa **digabung dengan I-09 Pengingat Firman**.

**Berkas:** `rencanakerja.md` (16.1b diperbarui · **16.1c** & **16.1d** baru · butir d · 16.8 ·
C. IDE **I-13**) · `prompt.md` (D-7v3) · `agents.md` (0a00a) · `CHANGELOG.md`.
**🧪 Uji:** tidak perlu (murni tulis berkas) · **build** ✅ 11,36 MB.

---

## 17 September 2026 (malam, lanjutan) — 🖥️ K42 revisi rencana: **TAMPILAN HALAMAN PENUH**

> Bapak: *“dalam kamus istilah dalam keterangannya juga ada ayat .. tentu ayat ada link untuk dibaca ·
> untuk konsep seperti di lab3 tapi **urusan UI tidak sama harus disesuaikan dengan UI ANotes disini** ·
> catatan menemukan kata (istilah) ada link dan diklik → **tampil kata dan keterangannya** ..
> **tampilannya sama ukuran layar** .. atau **menimpa catatan tapi diberi back** .. dan **harus bisa
> kembali ke baris kalimat atau kata** ketika di klik · dan setiap istilah kadang didukung ayat
> posisinya **setelah** pada layar kamus istilah dan keterangan, **dibawah adalah tampilkan ayat
> dengan konsep seperti ayat terkait** .. **ayat diklik tampil dikolom yg sama**”*

**Rencana K42 diperbarui (belum ada kode):**

| Perubahan | Dulu (rencana 1) | Sekarang |
|---|---|---|
| Tampilan arti | **panel/kotak kecil** di bawah catatan | **HALAMAN PENUH** (`.app` 480px — **sama persis ukuran catatan**), **menimpa catatan** |
| Tombol kembali | ✕ tutup panel | **`🏠`** ⇒ catatan + **gulir ke baris & SOROT KATA itu** ±4 detik |
| Susunan isi | tidak ditentukan | **WAJIB berurutan:** 1️⃣ keterangan → 2️⃣ **📖 AYATNYA di bawahnya** |
| Ayat di dalam arti | tautan → buka halaman baca | tautan → **muncul di kolom ayat** (❌ tidak meninggalkan halaman) |
| Kolom ayat | tidak ada | **SATU kolom, ganti-ganti** (klik chip ⇒ isi diganti — ❌ bukan kolom baru) + `[📖 ayat terkait (n)]` **konsep K25** |
| Istilah lain di arti | pindah panel | **pindah halaman** (berantai) + `↩` kembali ke istilah sebelumnya (**riwayat 30 langkah**) |
| Jebakan | 13 | **16** (+ halaman dibuat baru tiap klik · kembali tidak ke kata asal · ayat di kolom baru) |

**Bagian baru di `rencanakerja.md`: `16.1b`** (gambar alur 3 tahap + tabel aturan tetap).
**Butir b, d, e & ringkasan 16.8 ditulis ulang**; perkiraan waktu disesuaikan
(b ±20 mnt · **d ±25–30 mnt** → total **±2,5–3 jam**, tetap dibagi per butir).

⚠️ **2 pertanyaan terbuka untuk Bapak (butir d):** (1) kolom ayat cukup teks saja atau perlu tombol
`ayat terkait (n)`? (2) kalau tombol itu ditekan — **pindah ke halaman kerja K31** atau
**cukup tampil di kolom yang sama**?

**Berkas:** `rencanakerja.md` (bagian 16) · `prompt.md` (D-7v3) · `agents.md` (0a00a) · `CHANGELOG.md`.
**🧪 Uji:** tidak perlu (murni tulis berkas) · **build** ✅ 11,36 MB (21:46).

---

## 17 September 2026 (malam) — 📚 K42 · **Plugin Kamus Istilah** — RENCANA dipaparkan

> Bapak: *“berikut adalah **plugin baru** · **kamus istilah** · bisa pelajari
> `file:///C:/data/bible/android/lab3-offline.html` dan `C:\data\bible\prompt.md` ·
> semoga mencatat dengan baik km bisa pelajari dokumen lain yg menyangkut kamus istilah ·
> setelah km pahami .. **paparkan pada rencana kerja secara mendetail**”*

**Yang dikerjakan giliran ini: MENCATAT RENCANA (belum ada kode apa pun).**
Dokumen yang dipelajari: `lab3-offline.html` (bagian kamus) · `bible/prompt.md` ·
`bible/agents.md` **Ide 8** · `bible/rencanakerja.md` **§12** + **§8 “Gali Ayat”** ·
`bible/tmp-test-term.js` · `kamus.json` + `kamus-tambahan.json`.

**📊 Angka terukur dari data asli (bukan dugaan):**

| Yang diukur | Angka |
|---|---|
| `kamus.json` / `kamus-tambahan.json` | **340** / **69** entri |
| Gabungan → tulisan → istilah siap deteksi | **409** → 466 → **426** (±160 KB) |
| Arti kosong | **0** |
| Arti memuat rujukan ayat | **374 (91 %)** |
| Arti memuat istilah lain | **257 (63 %)** |
| Entri memuat “Lihat X” | **78** (⚠️ `Lihat Lamp.` = lampiran, bukan istilah) |
| Arti terpanjang | **1.324 huruf** → panel wajib bisa digulir |
| Rujukan koma-lanjutan (`Kel 21:29, 30`) | **58 arti** → perlu pengembang |
| Singkatan kitab di dalam arti | **83 macam** → 49 cocok · 26 lewat `SEBUTAN` · **3 belum** (`Rm` `Hos` `Yl`) |
| Entri berupa KATA UMUM (Imam, Korban, Tanda…) | **22 (5 %)** ⚠️ |
| Nama < 5 huruf (Roh, Log, Mil, Undi…) | **47** ⚠️ |

**Rencana butir a–g (satu butir per giliran, tunggu Bapak bilang “proses”):**

a (mesin + data) → b (halaman Daftar Istilah) → **c (garis putus di catatan — paling rawan)** →
d (panel arti + berantai) → e (istilah di halaman Alkitab) → f (halaman Ayat & Istilah) →
g (kamus pribadi + antrian istilah, boleh ditunda).

⚠️ **Risiko terbesar butir c:** Alkitab & Kamus menandai **satu editor yang sama** →
dipilih jalan: daftar kelas bersama + kedua penanda melewati node bertanda **mana pun** +
urut lewat **satu** pintu di `js/editor.js`. Kalau gagal **2×** → **HENTIKAN** & pakai
pilihan cara `'tombol'` (tanpa garis putus) supaya fitur tetap berguna.

**Berkas dokumen:** `rencanakerja.md` (**bagian 16 baru** + PAPAN ORDER + tabel IDE +
CARI CEPAT) · `prompt.md` (**D-7v2** K37–K41 + **D-7v3** K42 + peta tahap) ·
`agents.md` (**bagian 0a00a**) · `CHANGELOG.md` (ini).
**Backup:** `backups/rencana-kamus-20260917-211524/`.
**🧪 Uji:** tidak perlu (murni tulis berkas — sesuai aturan kecepatan).

---

## 17 September 2026 (sore) — 📅 K41b · Penanda build terlihat di dalam dokumen

> Bapak: *“klik [🔄] rencanakerja yg ada tgl 15 sept terakhir.. apa seperti masuk file seperti import”*

**Hasil pemeriksaan (fakta, bukan dugaan):** dokumennya **SUDAH terbaru** — memuat K41/K40/K39.
Yang membuatnya **terasa belum berubah** ada 2 sisa tulisan lama:

| # | Sisa lama | Perbaikan |
|---|-----------|-----------|
| 1 | Kalimat pengarah *“⚡ Mencari K32 / K33 / K34? Ada di tabel TIGA KASUS TERAKHIR”* di kepala berkas | dibuang → diganti *“✅ Kasus terakhir: K41 SELESAI 17 Sep 2026”* |
| 2 | **Penanda 🕒 disembunyikan** dari navbar (K41) → tidak ada cara melihat waktu build | `tools/siapkan-dokumen.js` menulis baris **`📅 Dokumen ini dibangun: 17 Sep 2026 16:00`** ke **header `rencanakerja.md`** |

⇒ Waktu build sekarang **terlihat di dalam dokumen**. Tabel **🔑 CARI CEPAT** juga diperbarui (K41–K34).

**Berkas:** `rencanakerja.md` (header + tabel cari cepat) · `tools/siapkan-dokumen.js`.
**🧪 Uji:** **66 uji, 0 gagal**.

---

## 17 September 2026 (sore, lanjutan) —  K41 · Tombol Segarkan di menu [Doc]

> Bapak: *“[doc] rencanakerja, changelog, panduan, agents, dll .. supaya **terupdate terus
> di [doc]** setiap kali klik [doc] update seluruh .md .. diperbaiki .. atau ada ide lain ?”*

**Kenyataannya (diperiksa, bukan dikira):** isi 5 berkas `.md` ditanam saat halaman dibuka
(`js/dokumen-data.js`). Halaman `file://` **tidak boleh** membaca berkas lain sendiri
(Chrome memblokir) → setelah `.md` diubah, halaman **harus dimuat ulang**.

**Pilihan Bapak: tombol `🔄`** — *“lebih logis .. karena tidak ada update baru tentu tidak
perlu klik [🔄]”*

| Hal | Pelaksanaan |
|-----|-------------|
| Tombol | `🔄` di navbar [Doc], sebelah ` Asli` |
| Fungsi | `segarkanHalaman()` → **muat ulang halaman** |
| Aman | Catatan disimpan dulu (`ANodesEditor.simpanSekarang()`) · editan dokumen belum disimpan → ditanya dulu |
| Tampilan | Ikon saja (navbar tetap 2 baris) — arti lewat `title` |

**Berkas:** `index.html` (`#doc-segarkan`) · `js/dokumen.js` (`segarkanHalaman`) ·
`js/editor.js` (`simpanSekarang`) · `css/app.css`.
** Uji:** **K41-01…K41-05** → digabung di `tools/uji-cepat.js` = **66 uji, 0 gagal**.

---

## 17 September 2026 (sore) — 📥 K40 · Insert hasil ayat terkait ke catatan

> Bapak: *“sekarang proses insert hasil ayat terkait ke catatan · buka **[Doc]** pilih ayat
> terkait berkas tersimpan .. `[🌿 Buka] [insert] [🗑]` ditambah menu `[insert]` untuk copy ke
> catatan .. **user tentukan letak yg dia mau untuk di insert ayat terkait** .. setelah
> ditentukan klik di menu [insert]”*

**4 CARA KERJA:**

```
① [Doc] → 🌿 Ayat Terkait   →  [🌿 Buka]  [ + Ayat ]  [🗑]
② tekan [ + Ayat ]  →  pindah ke CATATAN (ayat dipegang, belum ditempel)
③ klik di tulisan → tentukan LETAK  →  tekan [ + Ayat ] di bar info
④ ayat MASUK di tempat itu + disorot kuning
      [↶ Batalkan] → angkat lagi, cari tempat lain
      [Selesai]    → bar tutup, toolbar tulis kembali
```

- ✅ **Pilihan bentuk** seperti K20: `[💬 Kalimat]` hidup/mati + `[Singkat ⇄ Panjang]` —
  pilihannya **diingat** (localStorage `anodes-insert-ayat`).
- ✅ **Tombol [ + Ayat ] di bar info** hanya muncul **saat ada rantai dipegang**
  (keputusan Bapak) — bar info tetap rapi saat menulis biasa.
- ✅ **Memakai jalur K20 yang sudah ada** (`terimaPaket`/`tempelPaket`/`angkatPaket`/`buangPaket`)
  — ❌ tidak membuat cara menempel baru.
- ✅ **Catatan Bapak tidak pernah rusak** — kalau dibatalkan/dibuang, tulisan lama tetap utuh.

**Berkas:** `plugin/ayat-terkait/kerja.js` (`susunTeksRantai` · `susunDariSimpanan` ·
`kirimKeCatatan`) · `js/dokumen.js` (tombol `.ss-insert` + `opsiInsert()`) ·
`js/editor.js` (`segarkanTombolInsert` · `gambarOpsiPaket` · `susunUlangPaket`) ·
`index.html` (`#info-insert` · `#bp-kalimat` · `#bp-format`) · `css/app.css`.

**🧪 Uji:** **K40-01…K40-18** → digabung di `tools/uji-cepat.js` = **61 uji, 0 gagal**.

🗣️ **DUA pelajaran uji (keduanya sudah menipu saya — dicatat supaya tidak diulang):**
1. **Label uji jangan memuat tanda ❌** — tulisan tombol `[❌ Selesai]` di label membuat uji
   dihitung **gagal palsu** (penyaring kegagalan memakai tanda itu).
2. **Pilihan yang diingat (localStorage) harus dinormalkan di awal uji** — kalau tidak,
   pilihan uji sebelumnya terbawa. Kunci baru wajib masuk `KUNCI_AMAN` (`anodes-insert-ayat`).

---

## 17 September 2026 (siang, lanjutan) — ✂️ K39 · Nama ayat SINGKAT di semua tampilan plugin Ayat Terkait

> Bapak: *“saya perlu oder untuk **semua ayat terkait** gunakan metode **ayat singkat saja**..
> **Matius → Mat** supaya hemat tempat.”*
> + *“1. alkitab tidak perlu karena tidak mengambil space · 2. pakai sistem yg ada.. tidak perlu
> diubah · **plugin saja diproses**”*

| Tempat | Sebelum | Sesudah |
|--------|---------|---------|
| Chip kaitan (halaman baca) | `Matius 24:31` | **`Mat 24:31`** |
| Pratinjau | `Matius 24:31` | **`Mat 24:31`** |
| Kaitan lanjutan (abu-abu) | `Markus 13:27` | **`Mrk 13:27`** |
| Label jejak | `Matius 24:31, Markus 13:27` | **`Mat 24:31, Mrk 13:27`** |
| Blok 📖 (halaman kerja) | `📖 Matius 24:31` | **`📖 Mat 24:31`** |
| Jejak langkah | `2 Korintus 1:2 → Roma 1:7` | **`2Ko 1:2 → Rom 1:7`** |
| Riwayat Jalur | `Matius 24:31` | **`Mat 24:31`** |
| Nama berkas bawaan | `2 Korintus 1:2` | **`2Ko 1:2`** |

- ✅ Memakai **`labelPendek`** yang sudah disediakan `ANodesAlkitab.ambilAyatBanyak()` —
  tidak ada data baru yang perlu dibuat.
- ✅ **Keterangan (title)** saat disorot mouse tetap nama **PANJANG** supaya tidak salah ayat.
- ❌ **Tidak diubah** (keputusan Bapak): judul pasal di **halaman baca Alkitab** (`Matius 5`)
  dan **bar paket K20** (sudah punya tombol panjang ⇄ singkat sendiri).
- ⚠️ Rantai yang **sudah tersimpan** tetap memakai nama lamanya — hanya rantai **baru**
  memakai nama singkat.

**Berkas:** `plugin/ayat-terkait/tampilan.js` (`labelAyat()`) · `plugin/ayat-terkait/kerja.js`
(`labelRef()` = singkat · `labelPanjangRef()` baru untuk title).
**🧪 Uji:** **K39-01…K39-14** → digabung di `tools/uji-cepat.js` = **43 uji, 0 gagal**.
**🛡️ Backup:** `backups/ayat-singkat-20260917-122758/`.

🗣️ **Pelajaran uji (dicatat supaya tidak diulang):** saat **nama tampilan berubah**, assertion
uji lama yang menyebut nama panjang **ikut usang** (K37-17 · K37-21 · K38-06 gagal palsu).
Dan **jangan mencocokkan daftar nama kitab satu per satu** — cukup bandingkan panjang
`title` dengan tulisan chip.

---

## 17 September 2026 (siang) — 🖐 K38 · REVISI MODE GRUP: kalimat ayat tampil + nama kitab disingkat

> Bapak: *“sudah berfungsi tapi ada revisi .. **1.** klik **[2]** tampil isi kalimat ayat **[2]**
> dan klik **[3]** tampilkan isi ayat **[3]** dan dibawah ayat terkait seperti ini
> **2.** untuk menghemat tempat revisi **nama kitab di singkat saja** —
> `[Kej 12:12-13][Kej 12:18]…[Yos 24:2]` jadi tidak perlu panjang, umumnya orang mengerti
> .. selanjutnya proses sama dengan klik 1 ayat.”*

```
SEBELUM — kalimat ayat tidak terlihat, nama kitab panjang:
[2] [3] [4]
[Kejadian 12:12-13] [Kejadian 12:18] [Kejadian 12:20] [Yosua 24:2] …

SESUDAH — kalimat ayat tampil + nama kitab singkat:
[2] [3] [4]
  3  Sebab apakah dikatakan nas Kitab Suci? “Lalu percayalah Abraham …”
[Kej 15:6] [Mzm 106:31] [Yes 8:20] [Mrk 12:10] [Rom 4:5] …
```

| Butir | Hasil |
|-------|-------|
| **a. Kalimat ayat tampil** | klik nomor → **isi kalimat ayat itu** muncul **di atas** deretan kaitan; ganti nomor → kalimat + kaitan ikut berganti |
| **b. Nama kitab disingkat** | chip · pratinjau · kaitan lanjutan memakai **`labelPendek`** (`Kejadian 12:12-13` → **`Kej 12:12-13`**; `1 Korintus 1:31` → `1Ko 1:31`) |
| **c. Uji & dokumen** | uji **K38-01…K38-07** → **29 uji, 0 gagal** · build ulang · dokumen diperbarui |

⚠️ **Proses sesudahnya TIDAK diubah** — chip → pratinjau → `✓ pilih` → ayat turun (sama seperti klik 1 ayat).
⚠️ **Alur 1 ayat (K25) & baris rentang (K34) tetap nama PANJANG** — hanya mode grup yang disingkat
(dibuktikan uji **K38-07**), supaya yang sudah Bapak setujui tidak ikut berubah.

**Berkas:** `plugin/ayat-terkait/kerja.js` (**`labelPendekRef()`** baru · `.rk-grup-ayat` di `kotakGrup()` ·
`chipGrup()`/`kotakPratinjauGrup()` memakai label pendek) · `css/app.css` (`.rk-grup-ayat`).
**🛡️ Backup:** `backups/grup-revisi-20260917-121128/`.

🗣️ **Pelajaran uji (dicatat supaya tidak diulang):** jangan menebak kalimat ayat dari ingatan
— teks TB Roma 4:2 adalah *“Sebab **jikalau** Abraham …”*, dan `ANodesAyatTerkait.kaitan()`
**belum tersortir** (pengurutan urut-kitab ada di `kaitanRef()`), jadi chip pertama bukan yang terkecil.
Pembanding uji harus **diambil dari data asli**, bukan diketik manual.

---

## 17 September 2026 — 🖐 K37 · AYAT TERKAIT **MODE GRUP** (klik beberapa ayat → satu grup di halaman kerja)

> Bapak: *“misal saya menggunakan **Roma 4:2-4** .. klik ayat 2,3 dan 4 semua terseleksi ..
> jika user klik salah satu tombol [ayat terkait(21)] **sistem mengerti user sedang menghidupkan
> sistem ayat terkait dalam GROUP** .. mengikat 3 ayat tersebut pindah ke halaman kerja ..
> ketiga ayat tsb (2,3 dan 4) **bisa ganti2 dalam satu kolom sampai user klik [✓ pilih]**
> ayat mulai turun seperti yg sudah ada.”*

**Jawaban: alur 1 ayat TIDAK berubah** — mode grup hidup hanya kalau **≥2 ayat terpilih**.

```
HALAMAN BACA — Roma 4
 2  3  4  (diklik semua → terpilih)   [ayat terkait (21)] [ayat terkait (15)] [ayat terkait (4)]
                                              │ tekan salah satu ⇒ 3 ayat DIIKAT
                                              ▼
HALAMAN KERJA 🌿   [2] [3] [4]     ← klik nomor → kolom kaitan ayat itu (bisa ganti-ganti)
                   (BELUM ada blok sebelum ✓ pilih)
                        │ chip → PRATINJAU → `✓ pilih`
                        ▼
                   AKAR = ayat grup yang aktif (mis. Roma 4:3) · ayat pilihan TURUN jadi blok
                   → sesudah itu ALUR RANTAI BIASA (telusuri ayat demi ayat)
```

| Bagian | Hasil |
|--------|-------|
| **Pintu masuk grup** | kalau ada ≥2 ayat terpilih, tombol `ayat terkait (n)` berubah tanda 🔗 dan **memindahkan** user ke halaman kerja (❌ bukan membuka daftar di tempat). Dicek **saat tombol diklik** supaya tidak basi |
| **Tanda visual** | kelas `.at-toggle-grup` + 🔗 — diperbarui lewat event `anodes-pilih-berubah` dari plugin Alkitab setiap pilihan berubah |
| **Baris pemilih grup** | `[2][3][4]` di halaman kerja; nomor aktif **biru**; ayat tanpa kaitan **pudar** + keterangan |
| **Ganti-ganti** | klik nomor → kolom kaitan berganti (Roma 4:2 = 21 · 4:3 = 15 · 4:4 = 4 chip) — **bolak-balik selama belum `✓ pilih`** |
| **`✓ pilih`** | akar rantai = **ayat grup yang aktif**, ayat pilihan **turun** jadi blok pertama → baris grup selesai tugasnya |
| **Tidak bentrok K20** | seleksi & bar kirim paket ditutup rapi saat masuk mode grup |
| **[🗑] saat di baris grup** | membatalkan grup & pulang ke halaman baca (belum ada berkas) |
| **Titik aman** | `buka()` · `bukaSimpanan()` · `tutup()` · `bersihkan()` semuanya membuang `grup` |

**📊 Angka terukur (dari `silang.js`):** Roma 4:2 = **21** · 4:3 = **15** · 4:4 = **4**
(persis seperti Bapak sebutkan).

**Berkas:** `plugin/ayat-terkait/kerja.js` (`bukaGrup` · `kotakGrup` · `chipGrup` ·
`kotakPratinjauGrup` · `komitGrup`) · `plugin/ayat-terkait/tampilan.js` (`ayatDipilih` ·
`masukGrup` · `segarkanTandaGrup` · `segarkanSemuaTombolGrup`) ·
`plugin/alkitab/tampilan.js` (`kabariPilihanBerubah`) · `css/app.css` (`.at-toggle-grup` · `.rk-grup*`).

**🧪 Uji:** blok baru **K37-01…K37-22** → **22 uji, 0 gagal**. Uji yang sama juga ditulis di
uji penuh sebagai **RK22–RK28**.

### ⚡ Alat uji baru — supaya revisi TIDAK lambat (permintaan Bapak)

> Bapak: *“tolong jangan pakai terus uji otomatis.. ini makan waktu sangat lama.. uji di bagian
> di revisi atau fitur baru.. itu saja.. besok perbaiki sistem revisi .. saya juga perlu kecepatan..
> tapi juga perlu km uji sebelum saya uji.”*

| Alat | Kegunaan | Waktu |
|------|----------|-------|
| 🆕 **`tools/uji-cepat.js`** | uji **hanya fitur terbaru** (sekarang K37) | **±15 detik** |
| **`tools/uji-toolbar.js`** | 403 uji penuh — kini menerima **`window.__UJI_BLOK = ['K37']`** → hanya blok itu yang **dilaporkan** | ±4 menit |

⚠️ **Uji penuh hanya dijalankan kalau Bapak minta.** Saat merevisi satu fitur, cukup uji cepat.

**🛡️ Backup sebelum revisi:** `backups/ayat-terkait-grup-20260917-114121/` (plugin ayat-terkait ·
`alkitab-tampilan.js` · `app.css` · `uji-toolbar.js` · `rencanakerja.md`) — untuk rollback ke
keadaan 17 Sep 2026 sebelum revisi.

---

> 🕘 **Status akhir 16 Sep 2026 (malam):** semua kode jalan · **403 uji lulus, 0 gagal** di
> `index.html` **dan** `ANodes-1berkas.html`.
> 🌙 **Bapak: “saya sudah mau istirahat.. besok lanjut.”**
> ✏️ Hari ini: **(K36) impor `.md` tampil mudah dibaca + tombol “📖 Rapi”** ·
> **(K35) penanda versi dokumen + tombol “↩ Asli”** · **(K34) ayat terkait satu rentang ayat** ·
> **(K33) bersihkan & buang — uji tuntas** · 🐞 navbar [Doc] bertumpuk + bug `daftar` diperbaiki ·
> 🔑 papan order: tabel “🔔 TIGA KASUS TERAKHIR” + K32 jadi kasus resmi.
> 🧭 **Untuk tahu mana sudah/belum + berikutnya apa: buka `rencanakerja.md`
> bagian 0 (📋 PAPAN ORDER).** Berikutnya: **K32** (memanggil berkas rantai ke catatan).

## 2026-09-16 (K36) — 📥 Impor `.md` → tampil MUDAH DIBACA + tombol “📖 Rapi”

**Permintaan Bapak:** *“di ANodes -> File -> impor -> rencanakerja.md tapi dibuat dalam
**tampil rencanakerja.md mengikuti layar supaya tampil mudah dibaca**”*

**Masalahnya:** pengolah impor lama hanya kenal **judul · daftar · paragraf** →
**tabel** dan **kutipan** ikut jadi paragraf raksasa → tampak berantakan.

| # | Perbaikan | Hasil |
|---|-----------|-------|
| 1 | `keHtmlImpor()` memakai **pengolah markdown milik menu [Doc]** (`ANodesDokumenTampilan.benahiMarkdown`) kalau berkasnya berbentuk dokumen | **54 tabel · 73 kutipan · 28 blok kode · 61 judul** dikenali (dulu **0**) |
| 2 | Tombol **“📖 Rapi”** di bar info catatan (`#info-rapi`) → **mode baca** | isi dirapikan · **tidak bisa diketik** · tombol jadi **“✏️ Tulis”** |
| 3 | `htmlKeMarkdown()` — HTML catatan diubah kembali ke markdown | catatan **lama** pun bisa ditampilkan rapi |

⚠️ **Isi mentah TIDAK pernah tertimpa:** saat mode baca, `simpan()` & `autoSimpan()`
berhenti; keluar mode baca → isi mentah kembali **persis** (uji **Y23e**).

🐞 **Jebakan yang ketemu (jangan diulang):**
1. **`pre` (blok kode) melebar 852px** di layar 186px → **seluruh halaman bisa digeser
   mendatar**. Perbaikan: `#editor.mode-baca pre, table { max-width: 100%; overflow-x: auto }`.
2. **`bisaMarkdown()` sempat menolak dokumen proyek** karena isinya memuat **contoh HTML**
   (`<p>`, `<script>`). Perbaikan: `sudahHtml()` hanya menolak kalau tag ada **di awal baris**,
   dan tanda markdown yang jelas diperiksa **lebih dulu**.
3. **Aturan judul jangan longgar** — `judul >= 2` membuat catatan biasa pun dianggap dokumen
   (tombol Rapi muncul di mana-mana). Sekarang **`judul >= 3`**.

**Berkas:** `js/dokumen.js` · `js/editor.js` · `index.html` (`#info-rapi`) ·
`css/app.css` (`#editor.mode-baca*`) · `tools/uji-toolbar.js` (uji **Y21–Y23e**).

**Uji:** **Y21–Y23e (10 uji baru)** → **403 uji, 0 gagal** di `index.html` **dan**
`ANodes-1berkas.html`.

## 2026-09-16 (K35) — 📄 Menu [Doc]: PENANDA VERSI + tombol “↩ Kembalikan isi asli”

**Laporan Bapak:** *“sudah F5 -> Doc -> rencanakerja isi masih sama tidak ada K32”*

**Pemeriksaan:** isinya **sudah ada** (K32/K33/K34 + tabel “🔔 TIGA KASUS TERAKHIR” terpasang,
terbukti dari `js/dokumen-data.js` maupun berkas `ANodes-1berkas.html`). Yang kurang ada **dua**:

| # | Kekurangan | Akibat | Perbaikan |
|---|-----------|--------|-----------|
| 1 | ❌ tidak ada **penanda versi** dokumen | tidak bisa dibedakan **salinan baru vs lama** → dikira belum diperbarui | `tools/siapkan-dokumen.js` kini menulis **`dibangun`** (waktu build) → tampil **`🕒 16 Sep 2026 19:48`** di navbar [Doc] (`#doc-versi`) |
| 2 | ❌ tombol **pemulihan tidak pernah dibuat** | `kembalikanAsli()` sudah ada sejak K24 (bahkan **disebut** di pesan konfirmasi `simpan()`), tetapi **tidak ada tombolnya** → editan lama di perangkat **tidak bisa dibuang** | tombol **`↩ Asli`** (`#doc-asli`) di navbar [Doc] → memanggil `kembalikanAsli()` |

⚠️ **Kalau isi [Doc] belum berubah padahal berkas sudah diperbarui:** tekan tombol
**`↩ Asli`** dulu (membuang editan lama), baru **F5**.

**Berkas:** `tools/siapkan-dokumen.js` (tulis `dibangun` + cetak penandanya) ·
`js/dokumen.js` (`#doc-versi` + kait `#doc-asli`) · `index.html` (2 elemen baru di navbar) ·
`css/app.css` (`.doc-nama` + sembunyi ≤560px) · `tools/uji-toolbar.js` (uji **Y19–Y20c**).

**Uji:** **Y19–Y20c (6 uji baru)** → **393 uji, 0 gagal** di `index.html` **dan**
`ANodes-1berkas.html`.

## 2026-09-16 (papan order) — 🔔 TIGA KASUS TERAKHIR (K32 · K33 · K34) DITARUH DI PALING ATAS

**Laporan Bapak:** *“belum dimasukkan dalam rencanakerja.md k32 k33 k34 belum ada..”*

Ketiganya **sebenarnya sudah tertulis**, tetapi:

- **K32** hanya muncul sebagai **satu baris di tabel B. ANTREAN** (tidak punya blok kasus);
- **K33 & K34** terselip di **tengah bagian A**, jadi sulit ditemukan saat menggulir.

**Perbaikan pada `rencanakerja.md`:**

| Tambahan | Isi |
|----------|-----|
| ⚡ catatan di kepala berkas | “**Mencari K32 / K33 / K34?** Ada di tabel 🔔 TIGA KASUS TERAKHIR” |
| Tabel **🔔 TIGA KASUS TERAKHIR** (paling atas) | **K32** ⬜ belum (berikutnya) · **K33** ✅ 4/4 · **K34** ✅ 5/5 — lengkap dengan **letak** masing-masing |
| **K32 jadi kasus resmi** | 3 butir: (a) tombol 📥 “Pakai” berfungsi · (b) pilihan bentuk yang dimasukkan (nama saja / +kalimat / panjang ⇄ singkat) · (c) tombol 📥 di daftar [Doc] |
| **K33** | judul diperbarui → **4 dari 4 butir ✅ · SELESAI 16 Sep 2026** (dulu masih tertulis “3 dari 4 butir beres kode”) |

⚠️ **Pelajaran:** kasus yang masih **satu baris di tabel antrean** mudah “hilang” dari
pandangan. Kalau sudah punya butir pekerjaan, **jadikan kasus resmi** di tabel A.

## 2026-09-16 (K34) — 🌿 AYAT TERKAIT UNTUK SATU RENTANG AYAT (mis. Roma 8:6-10)

**Ide Bapak:** *“misal Roma 8:6 ini sudah bisa .. bagaimana roma 8:6-10 .. semua ayat
terkait ayat 6-10 dijadikan satu kolom .. user mau mulai dari ayat mana seperti yg sudah
berjalan sekarang ini.”* + *“tampilkan semua 6,7,8,9,10 **tanpa ayat terkait di bawah
ayat** .. **di bawah ayat 10 baru tampilkan `[6][7][8][9][10]`** .. user pilih 7 ..
baru tampilkan ayat terkaitnya.”*

**Bentuk yang dipakai (bukan satu kolom gabungan besar):**

```
Roma 8:  6 · 7 · 8 · 9 · 10        ← ayat rentang TANPA tombol “ayat terkait” sendiri
         [6] [7] [8] [9] [10]      ← SATU baris pemilih, hanya di bawah ayat terakhir
           │ klik 7
           ▼
         ┌───────────────────────────┐
         │ Ayat terkait Roma 8:7 (25) │ ← kolom kaitan AYAT ITU SAJA (logika lab2)
         └───────────────────────────┘
```

| Hal | Pelaksanaan |
|-----|-------------|
| Rentang dari mana | **tautan berentang di catatan** (`Roma 8:6-10`) → `bukaAyatDariLink()` menyimpan `rentangBuka` → diteruskan lewat `jalankanPenghias({…, rentang})` |
| Ayat dalam rentang | **TIDAK** dipasangi tombol `ayat terkait (n)` (kalau tidak, halaman kembali panjang) |
| Baris pemilih | `.at-rentang` di bawah **ayat terakhir** rentang; nomor aktif ditandai **biru** |
| Klik nomor | kolom kaitan **ayat itu saja** — Roma 8:7 = **25 chip**, Roma 8:6 = **16 chip** |
| `✓ pilih` | akar halaman kerja = **ayat yang dipilih** (mis. `Roma 8:7 → Keluaran 20:5`) |
| Ayat di luar rentang | tetap normal (punya tombol sendiri) |
| Lepas plugin | baris pemilih ikut dibuang |

**Ukuran (dari `silang.js`):** Roma 8:6 = 16 · 8:7 = **25** · 8:8 = 15 · 8:9 = **29** ·
8:10 = **29** · kalau digabung semua = **114**. ⇒ per ayat maks ±29 chip = **ringan**
(batas gambar 60); menggabung jadi 114 juga bisa tapi **asal-usul kaitan hilang**.

**Berkas:** `plugin/alkitab/tampilan.js` (`rentangBuka` + `get rentang`) ·
`plugin/ayat-terkait/tampilan.js` (`barisPemilihRentang()` + `hias()` melewati ayat rentang
+ `kotak._akarRef`) · `css/app.css` (`.at-rentang*`) · `tools/uji-toolbar.js`
(uji **RK18–RK21c**).
❌ Mesin `terkait.js` · data `silang.js` · `ambilAyatBanyak()` **tidak diubah**.

**Uji:** **RK18–RK21c (11 uji baru)** → **387 uji, 0 gagal** di kedua versi berkas.

## 2026-09-16 (K33 tuntas) — 🧹 Halaman kerja: bersihkan & buang + 🐞 bug [Doc] diperbaiki

**Uji otomatis K33 akhirnya dijalankan** (15 Sep sempat menggantung) — dan ternyata
**bukan** karena tab browser: ada **bug nyata**.

🐞 **Bug yang ketemu & diperbaiki:** `js/dokumen.js → gambarRantai()` memakai variabel
`daftar` **sebelum** dideklarasikan (sisa pekerjaan K33). Akibatnya halaman
**[Doc] → 🌿 Ayat Terkait tampil KOSONG** dan uji RK12 **menggantung**
(`ReferenceError: Cannot access 'daftar' before initialization`).
Perbaikan: `const k` & `const daftar` **dipindah ke atas**, sebelum blok tombol
“Bersihkan semua”.

⚠️ **Pelajaran:** kalau uji menggantung di satu langkah, **periksa Console** dulu —
jangan langsung menyalahkan tab browser.

**Uji:** **RK14–RK17** (bersihkan riwayat · buang rantai · bersihkan semua · catatan user
aman) → lulus semua.

## 2026-09-16 (navbar [Doc]) — 🐞 Tombol ✏️ Tulis & 💾 Simpan BERTUMPUK (diperbaiki)

**Laporan Bapak (tangkapan layar):** *“menu doc jadi seperti ini.. ada overlap”* —
tombol **✏️ Tulis** terhimpit jadi **30px** sehingga tulisan “Tulis” **membungkus &
menimpa ikonnya**, dan keterangan “ada editan” ikut tertindih.

**Penyebab:** navbar [Doc] dipaksa **satu baris** (`flex-wrap: nowrap`) padahal lebar
catatan hanya 480px; kotak cari memakai `flex: 0 1 auto` sehingga ikut menyusut dan
tombol kehabisan ruang.

**Perbaikan — navbar [Doc] sekarang SELALU 2 BARIS:**

```
baris 1:  [🏠] [berkas ▾]  …  [✎ ada editan]  [✏️ Tulis]  [💾 Simpan]
baris 2:  [🔍 cari kata / tanggal…] [◀] [▶] [3/22] [✕]
```

| Aturan | Pelaksanaan |
|--------|-------------|
| Navbar | `flex-wrap: wrap` + `row-gap: 10px` (paksa baris ke-2) |
| Kotak cari | `flex: 1 1 100%` — selalu barisnya sendiri, selebar layar |
| Tombol | `.doc-nav button { flex: 0 0 auto; white-space: nowrap }` — **tidak pernah menyusut / membungkus** |
| Berkas | `min-width: 96px` (dulu bisa menyusut sampai 14px) |
| `overflow-x: auto` | **dibuang** (pelajaran K18: satu sumbu `auto` memotong sumbu lain) |
| ❌ Jangan | memakai `order` untuk mengatur baris — pernah dicoba → ✏️ Tulis naik ke baris pertama, 💾 Simpan tertinggal |

**Hasil ukur:** **0 tumpuk** di 320/360/420/480/720/1024/1280px.
≤460px `.doc-tanda` disembunyikan · ≤380px tulisan tombol disembunyikan (ikon tetap) ·
≤340px penghitung temuan disembunyikan.

## 2026-09-16 (rencanakerja) — 🔑 Tabel “CARI CEPAT” supaya nomor kasus mudah ditemukan

**Permintaan Bapak:** *“cari berilah kalau km tulis K34 mudah dicari di rencanakerja
sekarang saya sulit menemukannya”*

- `rencanakerja.md` kini punya **tabel “🔑 CARI CEPAT”** di **paling atas**:
  nomor kasus → topik singkat → **letak di berkas** (A/B/C/D).
- Cara pakai: **Ctrl+F** → ketik nomor (mis. `K34`) → Enter. Di halaman **[Doc]**
  aplikasi: **Ctrl+F** → ketik nomor → **◀ ▶** untuk pindah temuan.
- Terukur: cari **K34** di menu [Doc] → **7 temuan**, bisa maju `1/7 → 2/7`.

## 2026-09-15 (K33 — kode selesai, uji besok) — 🧹 Halaman kerja: BERSIHKAN & BUANG

**Laporan Bapak:** *“saya perlu del **[x] riwayat jalur** .. sekarang tidak bisa diclean ..
belum mau di simpan **masih test** .. **berkas test masih gantung**”*

**Masalahnya:** 🕒 Riwayat Jalur **hanya bisa dibaca** — tidak ada tombol hapus → jalur
tes menumpuk terus. Dan setiap tes **langsung tersimpan** (auto-simpan) → daftar simpanan
penuh **berkas tes** yang tidak diinginkan.

| Tombol baru | Letak | Guna |
|---|---|---|
| **[✕]** | kepala panel 🕒 Riwayat Jalur | **bersihkan riwayat** — ⚠️ ❌ **TIDAK** menghapus ayat/blok/simpanan (riwayat = catatan jalan) |
| **[🗑 Buang]** | kepala halaman kerja (ganti 🆕) | kosongkan meja kerja **DAN hapus dari daftar simpanan** · tanya **inline** (❌ bukan popup) |
| **[🗑 Bersihkan semua]** | menu **[Doc] → 🌿 Ayat Terkait** | buang **semua** berkas tes sekaligus (dengan konfirmasi) |

**Berkas:** `plugin/ayat-terkait/kerja.js` (`buang` · `buangSekarang` · `kumpulkanJalur`
· `pohonUntukSimpan` · `batalkanSimpan` · penanda `_rb`) · `index.html` (tombol
`#kerja-buang`) · `css/app.css` (`.at-riwayat-bersih`, `.rk-buang-tanya`) ·
`js/dokumen.js` (tombol “Bersihkan semua”) · `tools/uji-toolbar.js` (uji **RK14–RK17**).

🐞 **Jebakan yang langsung dijaga (jangan diulang):**
1. **Timer simpan tertunda bisa “menghidupkan kembali” rantai yang baru dibuang** —
   maka sebelum membuang **wajib** `batalkanSimpan()` (clearTimeout).
2. **Riwayat ≠ data** — membersihkan riwayat **tidak boleh** menghapus blok/ayat.
   Supaya tetap kosong setelah halaman dibuka ulang, dipakai penanda `_rb` di puncak
   pohon (`pohonUntukSimpan()`), bukan menyentuh isinya.

⏳ **BELUM DIUJI OTOMATIS.** Run terakhir **menggantung** karena tab browser
**tidak terlihat** (`visibilityState: hidden`) → Chrome menahan timer ±1,6× sehingga uji
tampak “macet”. **Bukan bug kode.** Besok: pastikan tab **di depan**, build dulu, lalu
target **369 uji, 0 gagal** di `index.html` **dan** `ANodes-1berkas.html`.

## 2026-09-15 — 🗄️ DIPERIKSA: Layerbase Cloud & sinkron PC↔HP (⚠️ DITUNDA)

**Pertanyaan Bapak:** *“apakah sqlate bisa digunakan untuk ANotes
https://cloud.layerbase.com/”* + *“saya perlu data di PC = HP .. apakah space cukup 5GB”*

**Hasil pemeriksaan Layerbase (API-nya benar-benar dipanggil, bukan dari brosur):**

| Yang diuji | Hasil |
|-----------|-------|
| Dari `file://` (ANodes) | ❌ **DIBLOKIR** — `Vary: Origin` ada tapi **`Access-Control-Allow-Origin` kosong** |
| Dari `https://contoh.example` | ❌ ditolak |
| Dari `https://layerbase.com` | ✅ diterima |
| Dari server / terminal | ✅ jalan (200) |

⇒ **CORS tertutup secara sengaja** (kunci API tidak boleh ada di halaman web). Kalau
dipaksa tembus, **kunci Bapak bisa dicuri** siapa pun yang membuka berkas di HP. ❌

**Ukuran catatan ANodes (terukur):** 1 catatan kotbah/telaah ±**6 KB** ·
5 catatan/hari × 5 tahun = **49 MB** · **5 GB = ±945.000 catatan** → ruang **sangat cukup**
(terpakai **0,97 %**). Bandingan: **1 foto HP (3 MB) = 500 catatan**.

**Dua jalan yang AMAN (kalau nanti dibutuhkan):**
- **A. Lewat berkas** — Ekspor `.json` di PC → kirim ke HP → Impor. Aman 100%, tanpa
  internet. Perlu ditambah: **“Gabung semua catatan”** + tanda “terakhir diubah” +
  pencegahan dobel (belum ada).
- **B. Server kecil di PC** — PC menyalakan server Node (`start.bat`), HP buka lewat
  wifi rumah → selalu sama otomatis. Perlu PC hidup.

⏸️ **DITUNDA atas permintaan Bapak:** *“catat dulu nanti pada waktunya baru dibahas
kembali.”* Catatan lengkap ada di `rencanakerja.md` bagian C (**I-11** & **I-12**).

## 2026-09-15 (K31) — 🌿 HALAMAN KERJA AYAT TERKAIT (halaman ke-3)

**Order Bapak (2 kali):**

1. *“saya cek masih ada bagian keliru .. sampai klik salah satu ayat → **Roma 1:7** →
   klik → **[✓ pilih]** ← selanjutnya sudah tidak sesuai. seharusnya **pindah halaman
   kerja** pada saat klik **[✓ pilih]** di Roma 1:7”*
2. *“halaman kerja ayat terkait **bukan kembali pada ANodes** .. tapi halaman kerja ayat
   terkait .. ini masih proses membuat **urutan ayat yg diperlukan user** jadi **belum
   dipindahkan ke note utama atau home**”* + *“tetap disana user bisa **menelusuri ayat
   demi ayat** .. ini **disimpan dengan nama → ayat pertama atau judul** .. nanti file ini
   diperlukan di **note home** .. akan **dipanggil** untuk diolah dalam kalimat”*

**Temuan:** bagian K25 h–o (pratinjau → `✓ pilih` → label jejak) **sudah benar**. Yang
kurang = **TEMPATNYA** — blok menumpang di dalam baris ayat pasal, sehingga pasal terburai
penuh. Jawabannya: **halaman kerja tersendiri**.

**Yang dikerjakan:**

| Hal | Pelaksanaan |
|-----|-------------|
| Halaman ke-3 | `#kerja-ayat` (`.app halaman-kerja`) sejajar `#app-utama` & `#baca-alkitab` |
| Pindah | `tampilan.js → komit()` memanggil `ANodesAyatTerkaitKerja.buka(akarRef, ayat)` |
| Isi | **hanya rantai** — akar = ayat tempat mulai (mis. `2 Korintus 1:2`) + blok hasil `✓ pilih` |
| Telusuri | tiap blok menampilkan kaitan **langsung sebagai chip** (❌ tidak perlu tekan tombol lagi) |
| Nama | kotak **inline** di kepala (❌ **bukan popup** — permintaan Bapak); bawaan = ayat utama |
| Simpan | **otomatis** (tertunda 900 ms) + langsung saat kedalaman **> 3 turunan** + saat keluar |
| Daftar | menu **[Doc] → baris 🌿 Ayat Terkait** (di situ nama · jumlah ayat · tanggal + 🌿 Buka / 🗑) |
| Keluar | 🏠/Esc/Ctrl+B → balik ke **halaman baca** (❌ bukan langsung ke catatan) |
| Hapus | **inline** di blok (2 langkah) — ❌ bukan popup |
| Lepas plugin | `saatDilepas` + `bersihkan()` → halaman ditutup, **catatan user utuh** |

**Berkas:** `plugin/ayat-terkait/kerja.js` (**baru**) · `index.html` (halaman + `<script>`)
· `css/app.css` (`.halaman-kerja` / `.kerja-*` / `.rk-*` / `.simpanan-*`) ·
`plugin/ayat-terkait/tampilan.js` · `plugin/ayat-terkait/plugin.js` · `js/dokumen.js`.

**Simpanan:** localStorage **`anodes-rantai-v1`** →
`{daftar:[{id,nama,akar,pohon,jumlahAyat,dibuat,diubah}]}` — **bahan mentah** (urutannya
ayat), **belum** jadi catatan. Dipanggil ke catatan = tahap **K32**.

⚠️ **Yang TIDAK disentuh:** mesin `terkait.js` · data `silang.js` · `ambilAyatBanyak()` ·
sambungan `tambahPenghias()`/`jalankanPenghias()` · pintu masuk 🧩 · plugin Alkitab
(hanya ditambah **1 pintu keluar**).

**Uji:** **RK0–RK13** (14 uji baru) + **AF7/AF8** disesuaikan + **Y5** diperbarui
(5 berkas + 1 baris Ayat Terkait) → **365 uji, 0 gagal** di `index.html` **dan**
`ANodes-1berkas.html`.

🐞 **Jebakan yang ketemu (jangan diulang):**
1. **Label uji JANGAN memuat tanda gagal** — pencarian gagal memakai
   `L.filter(x => x.includes('❌'))`, jadi label seperti *“bukan ke catatan ❌”* ikut
   terhitung **gagal palsu**. Empat uji RK sempat gagal palsu karena ini.
2. **Tab browser harus TERLIHAT** (`document.visibilityState === 'visible'`) —
   kalau tersembunyi, timer ditahan (±1,6×) sehingga uji tampak “macet” di tengah.
   Bukan bug kode.

## 2026-09-15 (K25 h–o) — 🔗 Ayat Terkait: LOGIKA LAB 2 diterapkan (selesai)

**Order Bapak:** *“konsep ayat terkait tidak sama dengan lab2 … saya sepertinya harus urutkan
kerja.. kerjakan satu-satu.. supaya hari ini selesaikan masalah ayat terkait”*

**Kesimpulan penting:** pemahaman saya atas lab2 sebelumnya **benar**, tapi **logikanya belum
diterapkan** — yang sudah dikerjakan baru **bawaan tertutup** (K25 l). Plugin waktu itu dibangun
menurut varian **lab3** (chip → klik = teks langsung terbuka), bukan **lab2**
(pratinjau → `✓ pilih` baru jadi tetap).

**Alur lengkap yang sekarang jalan:**

```
klik chip  →  PRATINJAU  (1 slot, gantian, belum permanen)
              • teks ayatnya ditampilkan dulu
              • kaitan lanjutan di dalamnya ABU-ABU & MATI
                (cegah ayat perantara ter-skip — pelajaran lab2)
           →  `✓ pilih`  =  KOMIT
              • label jejak KUMULATIF (dipisah koma)
              • baris kaitan MENUTUP lagi (rapat)
              • blok permanen muncul DI BAWAH (berurutan)
              • 1 jalur tercatat di 🕒 Riwayat Jalur
   📍 di blok → sorot posisi itu di Riwayat Jalur
   ✕  di blok → hapus ayat + SELURUH cabang (konfirmasi 2 langkah)
```

| Hal | Pelaksanaan |
|-----|-------------|
| Pratinjau | `.at-pratinjau` (kotak biru tipis) · `✓ pilih` · 1 slot gantian |
| Label jejak | `.at-jejak` — kumulatif, tiap nama bisa diklik untuk pratinjau lagi |
| Riwayat Jalur | 🕒 `#at-riwayat` **di dalam halaman baca** (cara A) — panel samping **tidak perlu** |
| Hapus cabang | modal 2 langkah — langkah 2 mendaftar tiap ayat yang ikut terhapus |
| Blok aktif | garis hijau tepi kiri (“posisi sekarang”) |
| Anti-dobel | sudah ada → cukup **disorot kuning** (tidak dobel) |
| Bawaan cara tampil | tetap **`ayat terkait (n)`** (tombol kecil, lihat K25 l) |

**Berkas:** `plugin/ayat-terkait/tampilan.js` (**ditulis ulang**) · `css/app.css` (CSS `.at-*`)
· `plugin/ayat-terkait/plugin.js` (keterangan) · `tools/uji-toolbar.js` (uji **AF3–AF17** diperluas).

⚠️ **Yang TIDAK disentuh (jangan dibongkar):** data `silang.js` (5,21 MB) · mesin `terkait.js`
· `ANodesAlkitab.ambilAyatBanyak()` · sambungan `tambahPenghias()`/`jalankanPenghias()`
· pintu masuk gudang 🧩 + submenu `[🧩 ▼]` · urut urutan kitab · plugin Alkitab.

🐞 **Dua bug yang ketemu saat pengujian sendiri (sudah diperbaiki):**
1. **Pratinjau menumpuk** (bukan bergantian) — kotak pratinjau dicari dengan
   `:scope > .at-pratinjau` pada elemen yang salah; sekarang dicari **di dalam `.at-anak`**.
2. **Blok hilang setelah `✓ pilih`** — blok ditaruh di dalam kotak yang lalu dibuang;
   sekarang ditaruh di **wadah induk** kotak.

**Uji:** **AF3–AF17 (diperluas)** → **352 uji, 0 gagal** di `index.html` **dan**
`ANodes-1berkas.html`.

## 2026-09-15 (K28) — 🔍 USULAN: fitur cari kata/tanggal di menu [Doc] *(belum dikerjakan)*

**Permintaan Bapak:** *“tambahkan fitur cari pada [doc] rencanakerja.md, changelog, panduan.md,
agents dan prompt untuk cari lewat kata atau tanggal .. supaya cepat ke topik”*

- Diusulkan: **satu kotak cari di navbar halaman [Doc]** — ketik **kata** (`K27`, `ayat terkait`)
  **atau tanggal** (`15 Sep`, `15 September 2026`, `2026-09-15`) → **lompat + sorot kuning**.
- Tambahan yang diusulkan: tombol **◀ ▶ + penghitung temuan** (`3/17`), **daftar temuan**
  (judul bagian + sepenggal kalimat), **cari juga di mode ✏️ Tulis**, dan **Ctrl+F** sebagai pintasan.
- Rincian & tahapan (a–f): **`usul-cari-doc.md`** — **menunggu Bapak bilang `proses`**.
- Disentuh nanti: `index.html` · `js/dokumen.js` · `css/app.css` · `tools/uji-toolbar.js`.
  **Tidak disentuh:** `js/editor.js`, `plugin/**`, `js/store.js`, dan **isi berkas `.md`**.

## 2026-09-15 (K27 a) — 🔍 Tombol kepala dipendekkan: `Cari catatan ▼` → `🔍 Cari ▼`

**Order Bapak:** *“di ANodes saya perlu tombol [cari] sudah terlalu banyak.. perlu kata cari ..
rencanakerja diupdate”*

- Tombol kepala **`Cari catatan ▼`** (92px) → **`🔍 Cari ▼`** (69px) — **hemat 23px**.
  Kata “cari” tetap ada; emoji 🔍 dipakai supaya langsung terlihat fungsinya.
- **Judul tombol (title) tetap lengkap:** *“Cari catatan (cari & saring berkas)”* —
  supaya tidak tertukar dengan **🔍 Cari ayat** di halaman Alkitab.
- Isi menunya **tidak berubah**: kotak cari catatan + dropdown saring kategori.
- Hasil ukur: kepala tetap **1 baris 45px** pada lebar 320 · 360 · 412 · 480px,
  dan **semua tombol tetap tampil** (tidak ada yang terpotong).
- **Uji diperbarui:** `AC7` (nama tombol pendek) · `AC7d` **baru** (judul menyebut “catatan”) ·
  **`Y18`/`Y18b` baru** (lebar tombol < 90px & kepala tetap 1 baris di 360px).
  ⚠️ Uji `Q3`–`Q5` (gudang plugin) diperkuat: melepas plugin dulu supaya keadaan awal pasti
  → **307 uji, 0 gagal** di `index.html` **dan** `ANodes-1berkas.html`.
- 📄 Dokumen ikut diperbarui: `agents.md` (0b baru: cara “menjahit” lab2 + riwayat jalur cara A) ·
  `prompt.md` (nama tombol) · `panduan.md` · `rencanakerja.md` (kasus **K27**).

## 2026-09-15 — 🌿 Pelajari konsep LAB 2 + usul revisi plugin Ayat Terkait (K26 & K25 h–o)

**Hari ini TIDAK ada kode yang diubah** — hanya mempelajari, lalu menyusun rencana.

- Bapak minta mempelajari konsep **lab2** (`c:\data\bible\lab2.html`) karena konsepnya
  akan dipakai untuk plugin **🔗 Ayat Terkait** — dengan pesan tegas: **jangan dikerjakan dulu**.
- **Dipelaari:** kode asli `lab2.html` (satu `<script>`, baris 132979–133512) · blueprint
  Lab 2 di `c:\data\bible\prompt.md` (tahap 1–10) · `hasillab2.md` · revisi di
  `bible/agents.md` & `bible/CHANGELOG.md` · **bukti lanjutan** `lab3.html` (logika lab2
  disalin dengan awalan `rt-` = view “🌿 Rantai Ayat”).
- **Berkas baru 1:** `catatan-konsep-lab2.md` — pengertian saya atas konsep lab2
  (10 bagian: ringkasan · 2 langkah wajib · alur bergambar · kamus istilah · aturan
  pelajaran · struktur kode · bukti lab3 · perbandingan dengan plugin ANodes ·
  rumusan 3 baris · pertanyaan).
- **Berkas baru 2:** `usul-revisi-ayat-terkait.md` — daftar **bagian mana yang akan
  direvisi**: ✅ yang tetap (data · mesin · `ambilAyatBanyak` · sambungan penghias ·
  pintu masuk · urut kitab · anti-dobel · berentang) · 🔄 yang direvisi (cara buka →
  pratinjau · kotak `.at-daftar` disederhanakan · hapus → per cabang 2 langkah ·
  bawaan cara tampil → “Cukup tombol kecil” · teks keterangan plugin) ·
  🆕 yang baru (tombol `✓ pilih` · label jejak kumulatif · pratinjau · tanda posisi) ·
  ⛔ yang tidak disentuh (`index.html`, `js/editor.js`, `plugin/alkitab/**`, mesin, data, lab2/lab3).
- **Jawaban Bapak atas 3 pertanyaan saya:** (1) *“sepertinya sudah benar”*, tapi masih ada
  beberapa tempat belum sesuai; (2) *“lab2 belum terhubung ke ANodes — lab2 ini **pola kerja**,
  hasilnya ditempatkan pada ANodes untuk diolah user”*; (3) *“jawabannya ada di no 2”*.
  → **Kesimpulan: pakai LOGIKA lab2, aturan & penempatan tetap ANodes.**
- **Temuan penting (menjawab K25 butir h lama):** dua-duanya benar, tetapi untuk **keadaan
  berbeda** — **tertutup** = sebelum dipilih (chip `ayat terkait (n)`) · **terbuka** =
  sesudah `✓ pilih`. Yang benar-benar **hilang** = **langkah pratinjau** & **label jejak**.
- **Papan order diperbarui:** **K26** dibuka (butir a ✅ · butir b disetujui ⬜) ·
  **K25** diperluas jadi **butir h–o** (diusulkan, menunggu konfirmasi) ·
  antrean **B** disortir ulang (**K25 h–o = no. 1**).
- ⏭ **Belum dikerjakan apa pun.** Menunggu Bapak bilang **`proses`**, lalu saya paparkan
  tahapannya (a, b, c …) dan mengerjakan **satu butir per giliran**.

## 2026-09-14 (malam) — 🌙 Penutup hari + catatan untuk besok (K25 butir h)

- Bapak: *“besok lanjut… mau istirahat… secara konsep masih salah… tapi tidak parah…
  hanya salah saja.”*
- **Semua pekerjaan hari ini SUDAH selesai & terekam** — tidak ada yang menggantung
  setengah jalan. **304 uji, 0 gagal** di kedua versi berkas.
- **Ditulis ke papan order (`rencanakerja.md` bagian 0):**
  - K25 butir **g** → ✅ (uji AF1–AF17b + dokumen).
  - K25 **butir h (BARU)** → ⚠️ **perbaikan konsep** “Ayat Terkait”, **berikutnya besok**.
  - Antrean **B** disortir ulang: **K25 h = no. 1**.
- **Catatan penting untuk besok — JANGAN langsung mengubah kode:**
  1. **Tanyakan lebih dulu** bagian mana yang salah: bentuk tampilan · urutan kaitan ·
     cara membuka · isi/teks ayat di dalam blok?
  2. Kalau maksudnya **bentuk**: buka `C:\data\bible\android\lab3-offline.html`
     (versi offline yang Bapak tunjuk) dan **samakan persis**. Perbedaan yang saya
     curigai: lab3 memakai **baris teks ayat + baris chip tanpa kotak**, sedangkan
     saya membungkusnya dalam kotak `.at-daftar` + `.at-anak`.
     Dugaan lain: **bawaan harus tertutup** (chip saja), bukan terbuka.
  3. ⚠️ **Jangan bongkar ulang dari nol.** Yang sudah benar dan tidak perlu disentuh:
     mesin `plugin/ayat-terkait/terkait.js` · `ANodesAlkitab.ambilAyatBanyak()` ·
     data `silang.js` + IndexedDB · pintu masuk gudang 🧩 · pilihan cara tampil.
     Yang perlu diperiksa **hanya tampilan**: `plugin/ayat-terkait/tampilan.js`
     dan CSS berawalan `.at-`.
- 📌 Berkas yang dibuat hari ini (untuk memudahkan mencari besok):
  `tools/siapkan-data-silang.js` · `plugin/ayat-terkait/data/silang.js` ·
  `plugin/ayat-terkait/terkait.js` · `plugin/ayat-terkait/tampilan.js`
  (diubah: `plugin/ayat-terkait/plugin.js`, `plugin/alkitab/alkitab.js`,
  `plugin/alkitab/tampilan.js`, `js/plugin.js`, `css/app.css`, `index.html`,
  `tools/buat-1-berkas.js`, `tools/uji-toolbar.js`, `start.bat`).
- 📦 Backup hari ini: `backups\ayat-terkait-20260914-204514`.

## 2026-09-14 — 🔗 K25 butir g: UJI AF1–AF17b + dokumen (304 uji, 0 gagal)

- **22 uji baru (AF1–AF17b)** di `tools/uji-toolbar.js`, semuanya memeriksa hal yang
  benar-benar penting:
  - **AF1** plugin dilepas → halaman baca **bersih** (tidak ada tanda ayat terkait).
  - **AF2/AF2b** pasang → 29.363 ayat & 344.100 kaitan siap · keterangan ditandai siap.
  - **AF3–AF5** kaitan muncul **tepat di bawah ayatnya** · ayat 1 = **10 kaitan** ·
    ayat 2 = **25 kaitan** · isi & **urutan sama seperti lab3**.
  - **AF6/AF6b** klik kaitan → ayat terbuka · **ayat berentang dibuka lengkap** (4 ayat).
  - **AF8** klik kaitan yang sama → **tidak dobel**, hanya **berkedip**.
  - **AF9** **hias ulang tidak menghapus kaitan yang sedang dibuka** (jebakan yang
    hari ini ditemukan) — dijaga oleh uji ini supaya tidak terulang.
  - **AF10–AF11** ✕ menutup kaitan · **pindah pasal tidak membawa jejak lama**.
  - **AF12–AF13** cara tampil **chip ⇄ buka** benar-benar berpengaruh.
  - **AF14** data 5 MB **tidak** masuk localStorage (IndexedDB).
  - **AF15** Mazmur 119 (176 ayat berkaitan) terbuka < 3 detik.
  - **AF16/AF16b/AF16c** lepas plugin → tanda kaitan hilang · **catatan user aman** ·
    keterangan tetap ada di gudang.
  - **AF17** pasang lagi → kaitan muncul kembali dengan cepat (dari simpanan).
  - ⚠️ Uji AF **dilewati otomatis** kalau plugin belum terdaftar (`AF0`) — supaya
    tidak menghitung gagal palsu saat berkas plugin belum ada.
- **Uji lama diperbarui:** **Q4b** (Ayat Terkait bukan lagi “rancangan”) → dan karena
  itu jumlah plugin contoh berubah. Kunci localStorage baru
  (`anodes-ayat-terkait-cara`) ditambahkan ke **`KUNCI_AMAN`** supaya ikut
  diamankan & dipulihkan alat uji.
- **Dokumen diperbarui:** papan order · `panduan.md` **13j** (dengan gambar bentuknya) ·
  `agents.md` **7v** (kontrak + jebakan + uji) · `prompt.md` **D-7v** + peta tahap.
- **Hasil:** **304 uji, 0 gagal** di `index.html` **dan** `ANodes-1berkas.html`.
- ⚠️ **Pelajaran uji:** jangan hanya memeriksa “apakah tombol ada” — **periksa isinya
  juga** (jumlah kaitan & urutannya). Kalau tidak, kesalahan urutan/isi bisa lolos.

## 2026-09-14 — 🔗 K25 butir c–f: AYAT TERKAIT TAMPIL di halaman baca (± selesai)

> Permintaan user (lanjutan, disertai tangkapan layar lab3): *“seharusnya di alkitab
> keluar ayat terkait … contoh seperti pasted image … 2 Tesalonika 2 · ayat terkait
> (10) · Kejadian 49:10 · Matius 24:31 …”* dan *“sudah dibuat di lab3 … sistem ayat
> terkait yg dipindahkan konsep ke ANodes … beda versi, tapi secara konsep sama”*.

- **Butir c — `ANodesAlkitab.ambilAyatBanyak(daftarRef)`** (baru di
  `plugin/alkitab/alkitab.js`):
  - Mengambil **banyak ayat sekaligus**: nama kitab panjang & singkat, **teks tiap
    ayat**, penanda **merah** (perkataan Yesus), `label` (“Kejadian 49:10”) &
    `labelPendek` (“Kej 49:10”). Menerima bentuk `{no,pasal,ayat1,ayat2}` **maupun**
    bentuk ringkas `[kitab,pasal,awal,akhir]` (sama seperti data kaitan).
  - ⚠️ **Kenapa penting:** satu ayat bisa punya **97 kaitan**. Kalau diambil satu-satu
    (`ambilAyat()` 97×), tiap panggilan mencari kitab & pasal dari awal → berat.
    Sekarang **satu panggilan** untuk semuanya.
  - Diuji: 2 Tesalonika 2:1 → **10 kaitan persis sama** dengan data lab3
    (Kejadian 49:10 · Matius 24:31 · Matius 25:32 · Markus 13:27 · Roma 12:1 ·
    Efesus 1:10 · 1 Tesalonika 2:19 · 1 Tesalonika 3:13 · 1 Tesalonika 4:14-17 ·
    2 Timotius 4:1) — **urutan sama** dengan tangkapan layar user; ayat 2 → 25 kaitan.
- **Butir d — TAMPILAN** (`plugin/ayat-terkait/tampilan.js`, CSS baru di `app.css`):
  - **Kaitan turun DI BAWAH AYATNYA SENDIRI** (bukan panel terpisah seperti lab3) —
    pasal tetap bersih, tapi bentuk isinya sama: judul **“Ayat terkait (n)”** +
    **baris chip** + ayat terbuka dalam **blok putih**.
  - **Kaitan diurut menurut urutan kitab** (Kejadian → Matius → … → 2 Timotius),
    sama seperti lab3 (`getSilangUrut`) — mudah dicari mata.
  - Klik kaitan → ayatnya **terbuka lengkap**; kaitan berentang (mis. 1 Tes 4:14-17)
    dibuka **keempat ayatnya**.
  - **Anti-dobel seperti lab3:** ayat yang sudah terbuka (map per pasal) **TIDAK**
    dibuka dua kali — hanya **berkedip kuning** (`at-kedip`).
  - **Rantai:** di dalam blok terbuka ada tombol **“ayat terkait (n)”** lagi →
    bisa ditelusuri terus. **✕** menutup satu blok (beserta turunannya) atau satu daftar.
  - **Perkataan Yesus tetap merah** di dalam blok kaitan.
  - **Batas 60 kaitan** digambar serentak + tombol **“＋ n kaitan lagi”** (data ada
    yang 97) supaya halaman tidak berat.
- **Butir e — PINTU MASUK:** kartu di **gudang plugin 🧩** (2 angka: 29.363 ayat ·
  344.100 kaitan · tombol **▶ Buka di Alkitab** · **🗑 Lepas plugin**) + baris
  **🔗 Ayat Terkait** di submenu **[🧩 ▼]** toolbar tulis (otomatis, karena digambar
  dari plugin yang terpasang). Halaman keterangan lengkap: apa ini · yang bisa
  dilakukan · cara pakai · **cara tampil** · yang perlu diketahui.
- **Butir f — PILIHAN CARA TAMPIL** (kontrak baru plugin: `pilihanTampil[]` +
  `caraTampil()` + `pilihCara(id)`; digambar `js/plugin.js`):
  - **✔ Langsung tampil** (bawaan) — seperti lab3.
  - **Cukup tombol kecil** — hanya tombol “ayat terkait (n)”, halaman lebih ringkas.
  - Pilihan **diingat** di `anodes-ayat-terkait-cara`; mengganti pilihan **langsung
    menggambar ulang** halaman baca yang sedang tampil.
- **Cara Alkitab dan plugin ini berhubungan (penting untuk ke depan):**
  `plugin/alkitab/tampilan.js` punya **`tambahPenghias(fn)` / `jalankanPenghias(ctx)`**.
  Setelah selesai menggambar pasal (atau saat halaman baca dibuka lagi), Alkitab
  **memberi tahu**: “gambar selesai, pasal X”. Plugin yang berminat mendaftar.
  Jadi **Alkitab tidak perlu tahu** plugin kaitan ada — plugin bisa dicabut kapan saja.
- 🐞 **JEBAKAN BESAR yang ditemukan & diperbaiki (butir d):**
  1. `hias()` bisa dijalankan **lebih dari sekali** (data baru siap menyusul,
     halaman dibuka lagi, plugin hidup ulang). Dulu di awal `hias()` hiasan lama
     **DIBUANG** dulu — akibatnya **kaitan yang sedang dibuka user ikut hilang**,
     dan kalau diklik lagi jadi **DOBEL**. Sekarang: baris yang **sudah punya hiasan
     dilewati** (`if (baris.querySelector(':scope > .at-hias')) return;`) + ada
     **pengaman anti-dobel** saat membuka kaitan.
  2. Modul `window.ANodesAyatTerkaitTampilan` sempat **tidak ada**: nama itu ditulis
     **di dalam dan di luar** blok fungsi sekaligus → hasil fungsi (`undefined`)
     **menimpa** isinya. Cukup **`return`** objeknya (sudah diperbaiki + dikomentari).
- 🐞 **JEBAKAN di `js/plugin.js`:** penerjemah nama mesin (`namespace`) dulu hanya
  membesarkan huruf pertama → id bertanda hubung `ayat-terkait` menghasilkan nama
  **tidak sah** `window.ANodesAyat-terkait` (tidak pernah ketemu). Sudah diperbaiki
  jadi `window.ANodesAyatTerkait`.
- **Ukuran versi HP:** `ANodes-1berkas.html` kini **±11 MB** (Alkitab 5,08 MB +
  Ayat Terkait 5,21 MB). `tools/buat-1-berkas.js` ikut menyatukan data kaitan.
- **Uji:** **AF1–AF17b (22 uji baru)** — termasuk: plugin dilepas → halaman baca
  bersih · pasal langsung terhias tanpa pindah pasal · 10 & 25 kaitan sesuai data ·
  urut urutan kitab · kaitan berentang dibuka lengkap · anti-dobel (kedip) ·
  hias ulang tidak menghapus kaitan terbuka · ✕ menutup · pindah pasal bersih ·
  cara “chip” ⇄ “buka” · data **tidak** di localStorage · Mazmur 119 (176 ayat)
  tetap < 3 detik · lepas plugin tidak menyentuh catatan.
  Uji lama **Q4b** diperbarui (Ayat Terkait bukan lagi “rancangan”).
  → **304 uji, 0 gagal** di `index.html` **dan** `ANodes-1berkas.html`.
- **Dokumen:** `panduan.md` bagian **13j** (dengan gambar bentuknya) · papan order
  K25 butir c–f ✅ + butir **g** dicatat sebagai berikutnya.

## 2026-09-14 — 🔗 K25 butir b: MESIN plugin Ayat Terkait (IndexedDB)

- **Baru:** `plugin/ayat-terkait/terkait.js` → **`window.ANodesAyatTerkait`** (mesin saja;
  yang menampilkan menyusul pada butir d).
- **Cara memuat data (3 lapis, sama seperti plugin Alkitab):**
  1. sudah ada di halaman? (versi satu berkas) → pakai
  2. sudah tersimpan di **IndexedDB**? → pakai (±136 ms, **tanpa** membaca 5 MB lagi)
  3. belum → baca lewat **`<script src>`** (±550 ms) → lalu simpan
- **Simpanan:** IndexedDB `anodes-plugin-db` / toko `data` / kunci **`silang`**.
  ⚠️ Gudang yang **sama** dengan data Alkitab, tetapi **kunci berbeda** — jadi keduanya
  hidup berdampingan. ❌ Data TIDAK disimpan di localStorage (batas ±5 MB).
- **Jalan masuk untuk tampilan:** `kaitan(noKitab,pasal,ayat)` · `adaKaitan()` ·
  `jumlahKaitanAyat()` · **`petaKaitanPasal(noKitab,pasal)`** → `{16:23, 17:5, …}`
  (sekali panggil untuk satu pasal — ❌ tidak memanggil `kaitan()` puluhan kali) ·
  `jumlahAyat()` (29.363) · `jumlahKaitan()` (344.100) · `meta()` · `kunciAyat()`.
- **Tiga pintu “saat siap”** (meniru pola plugin Alkitab yang sudah terbukti):
  `ketikaSiap(fn)` sekali · `padaSiap(fn)` tiap kali siap (untuk gambar ulang) ·
  **`saatSiap(tugas)`** → kalau plugin belum dipasang: “💡 Pasang plugin 🔗 Ayat Terkait
  dahulu”; kalau belum siap: “⏳ Menyiapkan…” + lapisan memuat terbuka sendiri.
  ❌ Tidak ada `return` diam-diam (pelajaran K9).
- **Muat otomatis** saat halaman dibuka kalau plugin terpasang (`siapkanOtomatis()`).
- **Lepas plugin** (`saatDilepas()`) hanya membuang data dari memori + membersihkan
  tampilan. **Simpanan IndexedDB sengaja dibiarkan** supaya memasang lagi cepat, dan
  ❌ catatan user tidak disentuh sama sekali.
- **Penjaga data masuk akal** (`masukAkal()`): data dianggap sah hanya kalau punya
  > 1.000 ayat. Jadi simpanan kosong/rusak **tidak** dipercaya (pelajaran K24 —
  jangan langsung percaya “isi tersimpan”).
- **Perbaikan penting di `js/plugin.js`:** penerjemah nama mesin (`namespace`)
  dulu hanya membesarkan huruf pertama, sehingga id **`ayat-terkait`** menghasilkan
  `window.ANodesAyat-terkait` — **nama tidak sah** yang tidak akan pernah ketemu.
  Sekarang tiap bagian dipisah tanda hubung dibesarkan: `ayat-terkait` →
  **`window.ANodesAyatTerkait`**. (Ini juga sebabnya plugin ini sebelumnya hanya
  “keterangan”.)
- **`index.html`:** `<script src>` plugin Ayat Terkait dirapikan (keterangan + mesin
  berdampingan); data 5,2 MB **tidak** ikut dimuat saat halaman dibuka (baru dibaca
  kalau plugin dipasang) supaya ANodes tetap cepat.
- **`tools/buat-1-berkas.js`:** data Ayat Terkait **ikut disatukan** untuk versi HP
  → `ANodes-1berkas.html` kini ±**11 MB** (Alkitab 5,08 MB + Ayat Terkait 5,21 MB).
- **`start.bat`:** tidak berubah lama — data tetap dibuat sekali saja.
- **Diuji di browser:** mesin siap · 29.363 ayat · 344.100 kaitan · Kejadian 1:1 →
  62 kaitan (3 terkuat: Kisah 17:24-31 · Ibrani 11:3 · Yesaya 45:18) ·
  Yohanes 3:16 → 23 kaitan · Mazmur 119:176 ayat terpeta dalam 8 ms ·
  simpanan IndexedDB terbukti ada (29.363 kunci) · percobaan ke-2 **136 ms** tanpa unduh 5 MB.
- **Uji lama:** **282 uji, 0 gagal** (tidak ada yang rusak).
- **Berikutnya:** butir **c** — `ANodesAlkitab.ambilAyatBanyak()` (mengambil banyak
  ayat sekaligus, prasyarat untuk menampilkan chip).

## 2026-09-14 — 🔗 K25 butir a: DATA AYAT TERKAIT disiapkan (5,21 MB)

- **Permintaan user:** *“di alkitab ada satu fitur yg tertinggal.. mungkin saya akan
  jadikan plugin saja .. ayat terkait · km bisa akses ke lab3 .. alkitab setiap ayat
  rata2 punya ayat terkait.. ayat di alkitab sekarang tidak tersedia ayat terkait”*
- **Dicatat lebih dulu ke papan order** (`rencanakerja.md` bagian 0) → kasus **K25**
  dengan butir **a–g**; ide lama **I-03** & **I-10** dipindah ke antrean (tidak dobel).
- **Keputusan user (ditanya dulu):** plugin **TERPISAH** · **SEMUA kaitan** ·
  tampil **chip di bawah ayat yang diklik** (cara lab3).
- **Diperiksa di lab3** (`C:\data\bible`): `js/alkitab.js` → `getSilang()`,
  `getSilangUrut()`, `buatBlok()`, `tambahAnak()`, `hapusBlok()`, `tampilGaliAyat()`;
  `js/terkait.js` (daftar jejak); data `data/silang.json`.
- **Butir a (✅ 14 Sep 2026) — alat pembuat data:**
  - **Baru:** `tools/siapkan-data-silang.js` → membaca `C:\data\bible\data\silang.json`
    dan menulis `plugin/ayat-terkait/data/silang.js` (`window.ANodesAyatTerkaitData`).
  - **Hasil:** **5,21 MB** · 29.363 ayat · **344.100 kaitan** (votes −2 … 1268).
    Kaitan terbanyak: **Yesaya 44:24** → 97 kaitan.
  - Bawaan **tanpa saringan** (semua kaitan); bisa disaring: `--min-votes 5`.
  - Urutan tiap ayat **votes terbesar dulu** → yang tampil lebih dulu selalu terkuat.
  - Semua `<` ditulis `\u003c` (pengaman blok `<script>` versi 1 berkas).
  - Nomor kitab **1–66 sama** dengan ANodes → tidak perlu penerjemah.
  - `start.bat`: data dibuat **sekali saja** (dilewati kalau berkasnya sudah ada).
  - Sumber **CC-BY (OpenBible.info)** — disebut di kepala berkas data & halaman plugin.
- **Berikutnya:** butir **b** — mesin plugin `terkait.js` (muat data + simpan IndexedDB).

## 2026-09-14 — ⏸️ K7 butir g DITAHAN (keputusan user)

- User: *“K7 → cari dari kutipan panjang dipending dulu”*.
- **Yang sudah ada dianggap cukup:** mencari **satu kata** — lengkap dengan
  pencocokan **kata dasar** (`penebusan` ↔ `tebus`), saringan **PL/PB**, kata dicari
  **ditebalkan**, dan bisa **cari ulang** dari halaman hasil (semua kasus **K21**),
  serta **satu kotak cari** tanpa popup (kasus **K23**).
- **Yang ditahan:** mencari **satu kalimat penuh** (kutipan panjang) — perlu
  pengolahan kalimat (tanda baca, huruf besar, spasi ganda) sebelum dicocokkan.
- 📌 Tidak ada pekerjaan yang menggantung karena penundaan ini: **topik Alkitab
  dinyatakan TUNTAS untuk sekarang.** Kalau nanti mau dibuka: `kerjakan K7 g`.
- Berikutnya = antrean **B**: **K13** (impor/ekspor `.md` + logo).

## 2026-09-14 — 🐞 K24: menu [Doc] tampil BLANK

> Laporan user: *“[doc] → rencanakerja.md tidak bisa ditampilkan .. blank”*

- **Penyebab (ditiru di browser & terbukti):** isi menu [Doc] disimpan di
  perangkat (`anodes-dokumen-v1`). Kalau untuk `rencanakerja` **tersimpan string
  kosong**, `isiSekarang()` memakainya dan menggantikan berkas aslinya →
  halaman dokumen tampil **kosong** (tanda “✎ ada editan” tetap muncul).
  Terjadi kalau berkas pernah dibuka mode **Tulis**, isinya dikosongkan
  (sengaja atau tidak), lalu disimpan.
- **Perbaikan (`js/dokumen.js`) — 3 lapis:**
  1. `isiSekarang()` — editan yang **hanya spasi** **diabaikan** selama berkas
     aslinya berisi → langsung pakai berkas asli. Jadi halaman tidak pernah blank.
  2. `adaEdit()` — editan kosong **tidak dihitung** sebagai editan, jadi tanda
     “✎ ada editan” tidak menyesatkan.
  3. `simpan()` — menolak menyimpan isi **kosong** tanpa **konfirmasi**; dialognya
     mengingatkan bahwa menu [Doc] akan tampil kosong dan masih bisa dikembalikan
     lewat tombol “Kembalikan isi asli”.
- **Uji:** **Y17 · Y17b · Y17c (3 uji baru)** → total **282 uji, 0 gagal** di
  kedua versi berkas. Uji Y17 sengaja menulis editan kosong ke perangkat lalu
  memastikan `rencanakerja.md` **tetap tampil** (±55.000 huruf).
- Cara memulihkan kalau terjadi lagi di perangkat lain: buka menu [Doc] → tekan
  tombol **“Kembalikan isi asli”** (editan di perangkat dibuang).

## 2026-09-14 — 🔍 K23: cari ayat cukup SATU langkah (popup dibuang)

> Laporan user: *“fitur cari masih lompat 2× proses cari … cari → tebus lalu enter →
> masuk ke kolom cari lagi kata tebus … yg ke-2 ini baru ada pilihan | semua |
> PL | PB”*, lalu ditegaskan: *“saya tambahkan **cari yg benar yg ke 2 bukan pertama**”*.

**Keadaan lama (2 langkah — membuat user bingung):**
```
klik 🔍 Cari  →  POPUP form cari  →  ketik kata  →  TEKAN TOMBOL
              →  baru masuk halaman hasil yang punya kotak cari + [Semua][PL][PB]
```
**Sekarang (1 langkah saja):**
```
klik 🔍 Cari  →  LANGSUNG halaman pencarian
                 [ ketik disini… ] [🔍 Cari]
                 [Semua] [PL] [PB]        ← sudah ada sejak awal
              →  ketik “tebus” → ENTER  →  hasil muncul di halaman yang SAMA
```

- **Perubahan kode (`plugin/alkitab/tampilan.js`):**
  - `bukaKetik()` sekarang memanggil **`bukaHalamanCari()`** — ❌ tidak lagi membuat
    lapisan popup (`#ab-ketik-overlay`). Popup itu **dihapus** (sisa fungsinya
    hanya penutup agar pemanggil lama tidak error).
  - `gambarHasilCari()` kini juga menjadi **halaman awal pencarian**: kata boleh
    **kosong** → halaman tetap digambar dengan kotak cari + `[Semua][PL][PB]`
    + petunjuk singkat. Jadi user bisa langsung mengetik tanpa langkah tambahan.
  - **Nama ayat tetap bisa:** mengetik `yoh 3:16` memunculkan tombol
    **📖 Buka Yohanes 3:16** pada halaman yang sama (`gambarSaran()`) — dulu ini
    yang dilakukan popup.
  - Kalau halaman pencarian **sudah tampil**, tombol 🔍 Cari cukup
    **memfokuskan kotak** (tidak menggambar ulang → isi tetap ada).
  - Tombol wilayah tetap **tanpa ikon** (K22 c) dan kotak cari tetap **satu**
    (K22 b) — jadi tidak ada lagi “cari 2×”.
- **Uji:** uji **AE1–AE9 ditulis ulang** sesuai alur satu langkah; uji lama yang
  menyentuh popup ikut menyesuaikan: **T16i–T16l · T20 · W7 · Z5–Z7**.
  Hasil: **279 uji, 0 gagal** di `index.html` **dan** `ANodes-1berkas.html`.
- Bukti mata: klik 🔍 Cari → halaman “🔍 Cari ayat” dengan kotak + `Semua PL PB` →
  ketik `tebus` + Enter → **6 ayat** tampil di halaman yang sama (uji PB).

## 2026-09-14 — 🔍 K22 b & c: form cari tidak ganda · ikon tombol wilayah

**b · Form cari muncul 2× (laporan user)**

> *“klik [🔍 Cari] → Hasil: "tebus" → keluar lagi cari … tampil 2× cari”*

- **Penyebab:** tombol **🔍 Cari** di navbar selalu membuka form pencarian
  (`bukaKetik()`), walaupun halaman hasil pencarian sedang tampil — padahal di
  halaman hasil **sudah ada kotak cari** (`.ay-cari-lagi`). Jadi user melihat
  dua tempat mencari sekaligus.
- **Perbaikan (`plugin/alkitab/tampilan.js`):** `bukaKetik()` memeriksa dulu —
  kalau `#baca-isi` sudah punya `.ay-cari-input` **dan** ada pencarian berjalan,
  maka **`fokusKotakCari()`**: halaman hasil digulir & kotak isinya difokuskan
  (+ isinya disorot) sehingga bisa langsung diketik. ❌ Form **tidak** dibuka.
- Dari halaman **baca biasa** (bukan hasil), tombol 🔍 Cari **tetap** membuka form.
- Uji **AE1–AE8**: form tidak menggandakan walau ditekan 3× lagi, yang difokuskan
  kotak yang ada, dan masih bisa cari lagi dengan **Enter**.

**c · Ikon pada tombol wilayah dibuang**

> *“3 [📚 Semua ] ← icon ganti jangan berwarna”*

- Tombol wilayah sekarang **bertuliskan saja**: `Semua` · `PL` · `PB` —
  ikon `📚` dibuang (user merasa ikon itu tampak berwarna & mengganggu).
- Yang **aktif** tetap ditandai warna biru (itu memang penanda pilihan, bukan ikon).
- Uji **AC4a** memastikan tombol wilayah tidak lagi memuat ikon.
- **Uji total:** **278 uji, 0 gagal** di `index.html` **dan** `ANodes-1berkas.html`.

## 2026-09-14 — 📖 K22 a: Alkitab ingat bacaan terakhir

> Permintaan user: *“user meninggalkan bacaan terakhir … walau sudah ditutup …
> dibuka kembali Alkitab posisi kitab dan pasal terakhir dia baca — jangan kembali
> ke Kejadian 1:1 terus.”*

- **Sebelumnya** setiap kali Alkitab dibuka lewat 🧩 → 📖 Alkitab, yang tampil
  selalu **Kejadian 1** (kecuali halaman baca masih terisi).
- **Sekarang:** `plugin/alkitab/tampilan.js`
  - `simpanBacaan()` — dipanggil **setiap** `gambarPasal()`, menyimpan
    `{kitab, pasal, ayat}` ke localStorage **`anodes-alkitab-bacaan`**.
  - `bacaBacaanTerakhir()` — dibaca saat `bukaHalamanSekarang()`; kalau ada,
    langsung digambar pasal itu. Kalau **belum pernah** membaca → tetap Kejadian 1.
  - Bacaan yang **sedang tampil tidak digambar ulang** → posisi baca/pilihan ayat
    tidak terganggu.
- Kunci memakai awalan `anodes-` supaya ikut diamankan & dipulihkan oleh alat uji
  (ditambahkan ke `KUNCI_AMAN` di `tools/uji-toolbar.js`).
- **Uji:** **AD1–AD5 (5 uji baru)** → total **269 uji, 0 gagal** di kedua versi berkas.
  Bukti: setelah membaca **Daniel 11**, Alkitab dibuka lagi → tetap **Daniel 11**.
- **Sisa K22:** butir **b** (form cari muncul 2×) dan **c** (ikon tombol 📚 Semua).

## 2026-09-14 — 🔍 Pencarian Alkitab disempurnakan (K21, 5 hal)

> Permintaan user (dicoba setelah K20): *“di alkitab … 1. ada dua ‘cari’ — cari file
> dan cari ayat … 2. saya cari kata **tebus** … a. kata tebus dikasih bold …
> b. … tolong tanya PL atau PB … c. apakah cari kata tebus bisa termasuk penebusan?”*
> ⚠️ Aturan user: **kerjakan satu-satu**, jangan sekaligus — dikerjakan dari yang
> paling mudah (a dikerjakan terakhir karena menyentuh tampilan kepala).

| Butir | Perbaikan | Berkas |
|-------|-----------|--------|
| **a** | Dua tombol “Cari” kini **berbeda nama**: kepala → **`Cari catatan ▼`** (berkas, judulnya “Cari & saring catatan (berkas)”) · halaman Alkitab → **`🔍 Cari`** dengan lapisan berjudul **“🔍 Cari ayat”** | `index.html`, `plugin/alkitab/tampilan.js` |
| **b** | **Kata yang dicari DIBERI TEBAL + latar kuning** di dalam kalimat hasil (`.ay-cari-tebal`) — jadi kelihatan “oh, kata *tebus* ada di situ” | `tampilan.js`, `css/app.css` |
| **c** | **Kotak + tombol Cari LAGI di halaman hasil** (`.ay-cari-lagi`) — tidak perlu kembali ke halaman baca; tombol **Enter** juga bisa. ❌ bukan cari berkas | `tampilan.js`, `css/app.css` |
| **d** | **Saringan 📚 Semua · PL · PB** (`.ay-wilayah-btn`; yang aktif biru). PL = kitab 1–39, PB = kitab **40–66**. Judul hasil menyebut wilayahnya, dan pesan “tidak ditemukan” ikut menyebut wilayah | `tampilan.js`, `css/app.css` |
| **e** | **Pencocokan kata dasar Indonesia**: `penebusan`/`penebus`/`menebus`/`ditebus` **↔** `tebus`; juga `penulis`↔`tulis`, `pembaptisan`↔`baptis`, `keselamatan`↔`selamat` | `tampilan.js` |

**Cara kerja pencocokan kata dasar (penting, jangan disederhanakan):**
- ❌ **JANGAN** memakai satu rantai berurutan (buang akhiran dulu → lalu awalan).
  Sudah dicoba: `penebusan` menghasilkan **`ebus`** (salah), karena awalan `pen-`
  lebih panjang daripada `pe-` lalu huruf `t` ikut terbuang.
- ✅ Yang dipakai: **kumpulkan SEMUA kemungkinan kata dasar** dari tiap awalan +
  akhiran (`kandidatKata()`), termasuk **mengembalikan huruf sengau**
  (`pe-` + `tebus` → `penebus` → `nebus` → **`tebus`**; `me-` + `suci` → `menyuci` → `suci`).
  Lalu ayat dianggap cocok kalau **ada salah satu** bentuk yang ditemukan.
- Bentuk pertama yang ditebalkan minimal **4 huruf**, supaya potongan pendek
  (mis. `kas` dari `kasih`) tidak menebalkan sebagian kata.
- Pencocokan tetap **“termuat”** seperti sebelumnya (sesuai keputusan user:
  cukup sama persis & mirip, belum pakai daftar sinonim).

**Uji:** **AC1–AC7b (16 uji baru)** → total **264 uji, 0 gagal** di `index.html`
**dan** `ANodes-1berkas.html`. Uji baru memeriksa: hasil ada + judul, tebal,
kalimat utuh, tombol/kotak cari lagi, PL/PB benar-benar menyaring kitab,
dan kata dasar (`penebusan` → menemukan ayat berisi `tebus`).
Bukti mata: cari `tebus` → **83 ayat di 21 kitab**, kata `tebus` tersorot.

## 2026-09-14 — 🔧 Revisi K20c: nomor ayat ikut tampil pada kalimat

> Permintaan user: *“misal Filemon 1:3-5 … **tampil ayatnya juga**
> `3 Kasih karunia dan damai sejahtera …`”*

- Dulu kalimat ayat dikirim **tanpa nomor**, jadi kalau beberapa ayat menyatu
  di dalam catatan sulit dibedakan ayat mana yang mana.
- **Sekarang** tiap kalimat didahului nomor ayatnya (`plugin/alkitab/tampilan.js → susunPaket()`):

```
Filemon 1:3-5
3 Kasih karunia dan damai sejahtera dari Allah, Bapa kita dan dari Tuhan Yesus Kristus menyertai kamu.
4 Aku mengucap syukur kepada Allahku, setiap kali aku mengingat engkau dalam doaku,
5 karena aku mendengar tentang kasihmu kepada semua orang kudus dan tentang imanmu kepada Tuhan Yesus.
```

- Tiap paragraf tetap **satu ayat** (mudah dibaca & disunting).
- Ini juga memperbaiki masalah kecil: kalau `rapikanHtml()` menyatukan beberapa
  paragraf kosong saat menyimpan, teksnya **tidak hancur** karena setiap ayat
  tetap punya pembuka nomor.
- ⚠️ **Sengaja TIDAK memakai penanda `[3]`**: kurung siku + angka berisiko
  dibaca plugin Alkitab sebagai **ayat** (pola `\d{1,3}:?\d{1,3}`) → akan muncul
  “tautan ayat” palsu. Kalau nanti mau tampilan `3` bergaya lebih kecil, harus
  dibuat lewat pengolahan kaya (bukan teks biasa) — belum diminta user.
- **Uji:** **AB12b (baru)** → total **248 uji, 0 gagal** di `index.html` **dan**
  `ANodes-1berkas.html`. Bukti manual: Filemon 1:3-5 → tertempel dengan
  `Filemon 1:3-5` / `3 …` / `4 …` / `5 …`.

## 2026-09-14 — 🔧 Revisi K20 (2 hal dari user)

**Revisi 1 — bar paket & toolbar tulis harus bisa BERGANTIAN lewat tombol ▦**

> Laporan user: *“selama belum klik ❌ Selesai .. toolbar editor tidak bisa dibuka ..
> kalau toolbar editor dan menu bar alkitab bergantian lewat tombol [▦]”*

- Dulu: begitu paket dibuat, bar paket **mengunci** baris ke-2 — toolbar tulis tidak
  bisa dibuka sama sekali sampai paket ditutup.
- 🐞 **Penyebab awalnya juga salah tulis logika:** barisnya berbunyi
  `toolbar.hidden = !bar.paketTampil` → artinya saat bar paket tampil, **toolbar tulis
  ikut tampil** juga (bukan disembunyikan). Sudah diperbaiki jadi `bar.paketTampil`.
- Sekarang (`js/plugin.js`):
  - `bar` punya **dua** keadaan terpisah: `paket` (ada paket belum ditutup?) dan
    `paketTampil` (baris ke-2 sedang menampilkan yang mana?).
  - Ada paket → **▦ menggantikan kedua baris**: klik ▦ = bar paket ⇄ toolbar tulis.
    Status dijelaskan lewat `title` tombol: “*Baris ke-2: bar paket ayat — klik untuk
    melihat toolbar tulis*” dan sebaliknya.
  - Bar paket baru hilang kalau user menekan **[❌ Selesai] / [❌ Buang]** → baris ke-2
    kembali seperti pengaturan user semula.
  - Tanpa paket → ▦ tetap seperti dulu (sembunyi/tampilkan toolbar; Alt+klik = seluruh baris).

**Revisi 2 — pilihan panjang/singkat harus BENAR-BENAR ikut ke hasil**

> Laporan user: *“pilih Yeh 39:10-11 output tetap Yehezkiel 39:10-11 — mau pilih panjang
> atau pendek hasilnya tetap versi panjang”*

- 🐞 **Penyebab:** `susunPaket()` menulis `labelPilihan(true)` — **selalu panjang**,
  sedang pilihan user dari tombol 📖 **tidak pernah dipakai** ke hasil.
- **Perbaikan:** `labelPilihan(opsiPaket.panjang)`;
  - tombol 📖 → `Yohanes 4:7` berarti akan mengirim bentuk **panjang**,
  - `Yoh 4:7` berarti akan mengirim bentuk **singkat**.
- Chip pilihan di bar kirim tetap **bentuk singkat** (hemat tempat) — bentuk yang akan
  dikirim terlihat pada tombol 📖 di sebelahnya.
- ⚠️ Kalimat ayat **selalu penuh** (tidak dipendekkan) — sesuai keputusan user.

**Uji:** **AB8b** (panjang/singkat benar-benar ikut ke paket) + **AB16b** (▦ bisa
membuka toolbar tulis selama paket belum ditutup) + **AB16c** → total
**247 uji, 0 gagal** di `index.html` **dan** `ANodes-1berkas.html`.

## 2026-09-14 — 📤 Kirim paket ayat dari Alkitab ke catatan (K20)

> **Permintaan user:** *“dari alkitab kirim paket ke note … klik no. 7 ← yohanes 4:7 …
> keluar menu — Yohanes 4:7 / Yoh 4:7 / Kalimat … apakah memungkinkan?”*
> Dilanjutkan dengan 3 koreksi user: baris ke-2 terpisah (bukan menggantikan bar utama),
> **tidak langsung pindah** ke catatan (kumpulkan dulu seperti clipboard), dan
> **harus kembali ke posisi tadi** (kalau tidak ada posisi → paling bawah).

- **Bentuk akhirnya (sesuai pilihan user):**
  1. Di halaman baca, **angka ayat bisa diklik** (`span.no`) → muncul **BAR KIRIM**
     sebagai **baris ke-2** (bar utama kitab/pasal **tetap ada**, tidak pernah tertutup).
  2. Klik angka lain → jadi **rentang** (7, 8 → “7-8”; 7, 8, 9 → “7-9”; 7, 9 → “7, 9”).
     Klik angka yang sama = **dilepas** lagi.
  3. **Bar kirim:** chip pilihan (bentuk singkat, mis. `Yoh 4:7-9`) · **💬 Kalimat**
     (hidup = kalimat ayat ikut; mati = hanya nama ayat) · **📖 Yohanes 4:7-9**
     (tombol panjang ⇄ singkat — tulisannya berubah sendiri, jadi tidak perlu dijelaskan) ·
     **📋 Simpan** · **✕** batal.
  4. **Simpan paket TIDAK langsung menempel ke catatan.** Paket dipegang dulu
     (seperti clipboard), halaman kembali ke catatan, lalu **baris ke-2 berganti
     menjadi BAR PAKET**: `📋 Yohanes 4:7-9 · [Tempel ⇩] · [❌ Buang]`.
     → user sendiri yang menentukan letak (klik di catatan tempat yang dia mau).
  5. **Satu klik = satu tempel.** Setelah masuk, bar berubah jadi
     `[↶ Batalkan] [❌ Selesai]` — jadi klik nyasar berikutnya tidak menempel lagi.
     Salah tempat? **[↶ Batalkan]** mengangkat paket, lalu klik tempat lain.
     Sudah pas? **[❌ Selesai]** → bar tutup, **toolbar tulis kembali seperti semula**.
- **Tempat kembali (permintaan khusus user):**
  - Saat berangkat ke Alkitab, catatan **mengingat tempat**: `{id catatan,
    posisi kursor (hitungan huruf), gulir}`.
  - Saat 🏠 kembali → kursor & gulir **dipulihkan persis**. Kalau tidak ada
    kenangan (mis. catatan baru dibuka / kursor tidak ada) → kursor ke **PALING BAWAH**.
  - Nomor ayat: `Yohanes 4` = kitab ke-43.
- **Undo:** user bertanya *“kalau salah kan ada undo?”* → diuji di browser.
  Hasil temuan penting:
  - `execCommand('insertHTML')` **SELALU memecah pembungkus** (`<span>`/`<div>`/
    `<p>`) supaya dokumen tetap sah → penanda “paket” tidak bisa dipertahankan.
  - Karena itu paket disisipkan **lewat DOM sendiri** (paragraf di bawah baris
    yang diklik / menggantikan baris kosong), **lalu dicatat ke riwayat tulisan**.
  - ⚠️ Tempelan DOM **tidak ada** di tumpukan undo bawaan browser. Jadi tombol
    **↶ / ↷ memakai riwayat sendiri khusus untuk langkah paket**
    (`langkahPaket()` membandingkan `paket-ayat` pada dua langkah bersebelahan).
    Kalau tidak, tekan ↶ malah membatalkan ketikan lama & paketnya tetap tinggal.
- **Aturan yang dijaga (jangan sampai salah lagi):**
  - **Baris ke-2 hanya SATU baris** → yang mengatur `#toolbar.hidden` **hanya**
    `ANodesPlugin.terapkanBar()` (K17). Editor memanggil `ANodesPlugin.paket(true/false)`;
    keadaan “paket” **tidak disimpan** ke localStorage (sementara saja).
  - `#toolbar-paket[hidden] { display:none !important }` + `.bar-kirim[hidden]` —
    karena `display:flex` menimpa atribut `hidden` bawaan browser.
  - Pengait klik angka dipasang di **wadah bacaan `#baca-isi`**, **BUKAN** `#editor`
    (angka ayat ada di halaman baca; pernah salah & kliknya tidak jalan).
  - Angka ayat punya area klik lebih lebar (HP) tanpa merusak pemilihan teks;
    angka yang terpilih jadi biru (`.no.pilih`), barisnya disorot (`.ikut-pilih`).
- **Berkas yang diubah:** `index.html` (bar kirim + bar paket) · `css/app.css`
  (gaya + rapat ≤430px, kata tombol disembunyikan ≤380px) ·
  `plugin/alkitab/tampilan.js` (pilih rentang, susun paket, kenang posisi, tombol 📤) ·
  `plugin/alkitab/plugin.js` (kontrak tombol di halaman baca) ·
  `plugin/alkitab/alkitab.js` (bersihkan paket saat plugin dilepas) ·
  `js/plugin.js` (`bar.paket` + `ANodesPlugin.paket()`) ·
  `js/editor.js` (`window.ANodesEditor`, tempel/angkat/buang paket, kenang & pulihkan posisi).
- **Uji otomatis:** **AB0–AB19 (20 uji baru)** → total **244 uji, 0 gagal**
  di `index.html` **dan** `ANodes-1berkas.html`.
  Dua uji lama ikut diperbarui karena navbar baca bertambah satu tombol:
  **T16** (urutan navbar + `📤`) dan **Z3** (2 daftar + 7 tombol).
- **Ukuran bar kirim diuji nyata:** 5 tombol **tetap 1 baris** & semuanya terlihat
  pada lebar **230 · 269 · 330 · 349px** (kata pada tombol hilang ≤380px,
  artinya tetap terbaca lewat tooltip).

## 2026-09-14 — 🐞 Submenu [🧩] terpotong di PC (K19)

- **Laporan user (dengan tangkapan layar):** *“submenu [🧩] terpotong”*.
  Gejala di PC: panah ▼ tombol 🧩 dibuka → submenu hanya tampak **separuh**;
  tepi kanannya (nama plugin) **hilang**.
- **Penyebab sebenarnya: bukan toolbar, bukan layar — tapi kotak `.app`.**
  `css/base.css` → `.app { width: 480px; overflow: hidden; }`.
  Di PC `.app` hanya **480px di tengah layar**. Tombol 🧩 ada di **ujung kanan**
  toolbar, jadi submenu-nya menonjol **keluar kotak `.app`** → dipotong
  `overflow: hidden` — **walaupun layarnya masih luas** (mis. 1024px).
  - ⚠️ **Kesalahan logika yang lama:** `pasangSubmenu()` (dibuat beberapa jam
    sebelumnya) membandingkan letak submenu dengan **`window.innerWidth`**.
    Di PC itu **selalu lolos** → submenu dianggap sudah muat, padahal kotak
    `.app` sudah habis. Uji Z16–Z19 juga memakai ukuran layar → **tidak menangkap** bug ini.
- **Perbaikan `js/editor.js → pasangSubmenu()`:**
  1. Ukur **kotak yang benar-benar memotong**: `sm.closest('.app')` →
     batas = irisan kotak `.app` dengan layar (bukan `window.innerWidth`).
  2. Menonjol ke **kanan** → `sm.style.left='auto'; sm.style.right='0'`
     (tempel ke tepi kanan tombolnya).
  3. Kalau setelah digeser menonjol ke **kiri** → `sm.style.left='0'; sm.style.right='auto'`.
  4. Tidak muat ke **bawah** → tambah kelas `.ke-atas` (buka ke atas).
- **Pelajaran penting:** yang memotong sebuah kotak adalah **kotak induk yang
  punya `overflow`**, bukan layar. Selalu ukur induk yang memotong.
- **Uji diperkuat + ditambah:**
  - **Z16** kini juga memastikan **tepi kanan** submenu terlihat
    (`elementFromPoint`) dan `terpotongApp === false`.
  - **Z19** juga memeriksa tepi kanan di layar sempit.
  - **Z20 (baru)** — layar PC: kotak `.app` di tengah (lebar dipaksa kosong)
    → submenu **tidak terpotong** & tepi kanan terlihat.
  - Hasil ukur: **344 · 480 · 720 · 1024px** → semua tidak terpotong,
    tepi kiri & kanan terlihat.
  - Hasil: **224 uji otomatis, 0 gagal** di kedua versi berkas.
- Berkas untuk HP diperbarui: **`ANodes-1berkas.html`**.

## 2026-09-14 — 🧩 Tombol plugin di toolbar tulis + 🐞 submenu hilang (K18)

- **Permintaan user:** *“saya mau tambahan di toolbar editor.. [↶][↷][¶▼][• List▼][B][/]
  [▦▼][▬▼][A▼][✕][✅▼] ini toolbar yg ada sekarang ini mau tambahan [🧩] kalau dipulldown
  dari menu.. keluar yg plugin yg **sudah terinstall saja**.”*
- **Tombol baru:** `[🧩 ▼]` di **ujung kanan** toolbar tulis (jadi 12 tombol).
  Panah ▼ dibuka →
  ```
  📖  Alkitab        ›   ← HANYA plugin yang sudah terinstall
  🧩  Gudang Plugin…     ← jalan ke gudang (pasang/lepas)
  ```
  Kalau belum ada plugin terpasang → **“Belum ada plugin terpasang.”** (bukan submenu
  kosong tanpa penjelasan). Tombol diberi pinggir **hijau** (`.ada-plugin`) kalau ada
  plugin terpasang, dan `title` menyebut jumlah plugin.
- **Isi submenu dijaga segar:** `tandaKepala()` selalu memanggil `renderToolbar()` →
  begitu plugin **dipasang/dilepas**, isi pulldown langsung ikut berubah.
- **Toolbar tetap 1 BARIS** (syarat wajib — sudah dijaga sejak K17). 12 tombol butuh
  ±390px, sedangkan di layar sempit cuma tersedia ±344px. Penyelesaian 3 langkah:
  1. `.toolbar` → `flex-wrap: nowrap`.
  2. Label panjang disingkat di ≤430px: **“• List” → “•”**, **“1. List” → “1.”**
     (dua span: `.lbl-penuh` / `.lbl-pendek`, diisi `setLabelDaftar()` di `js/editor.js`).
  3. Jarak & padding dirapatkan di ≤430px dan ≤360px.
     ⚠️ Media query sempat ditulis **di atas** aturan dasar → **kalah cascade** →
     penghematan tidak jalan. Dipindah ke **bawah** baru berhasil.
     ❌ Di ≤360px yang disembunyikan **titik warna** (hiasan) — **bukan panah ▼**,
     karena tanpa panah pilihan stabilo/warna/icon tidak bisa dibuka.
  - Hasil ukur: **1 baris 32px** di 300 · 320 · 360 · 412 · 430 · 480px, tidak terpotong.
- **🐞 CACAT BESAR yang ketemu & diperbaiki — submenu HILANG.** Saat mengejar 1 baris,
  `.toolbar` sempat diberi **`overflow-x: auto`**. Ternyata itu membuat **SEMUA submenu
  tidak kelihatan**: kelas `.buka` terpasang, ada di DOM, `getBoundingClientRect()`
  melaporkan tinggi 89px — tapi `document.elementFromPoint()` mengembalikan `#editor`.
  Sebabnya aturan CSS: kalau satu sumbu `auto`, **sumbu lain yang `visible` ikut
  dihitung `auto`** → submenu yang menonjol keluar kotak toolbar **dipotong 0 px**.
  Tombol jadi terasa “tidak berfungsi” padahal submenunya terbuka.
  - **Perbaikan 1:** `overflow-x: auto` **dibuang** → `overflow: visible`.
  - **Perbaikan 2:** fungsi baru `pasangSubmenu(sm)` di `js/editor.js` — kalau submenu
    menonjol ke **kanan** → ditempel `right: 0`; kalau tidak muat ke **bawah** → `.ke-atas`.
    Jadi tombol paling kanan pun submenunya tidak keluar layar.
  - **Pelajaran uji:** uji lama hanya memeriksa `classList.contains('buka')` → **lolos
    walau submenu tidak terlihat**. Uji baru **Z16–Z19** memakai
    **`document.elementFromPoint()`** untuk membuktikan submenu benar-benar terlihat
    di meja gambar (bukan hanya ada di DOM).
- **Uji diperbarui:** **N1b–N1d** (toolbar 1 baris di 320/360/412/480px · panah tetap ada ·
  label singkat tersedia) + **Z16–Z19** (submenu plugin terlihat · semua submenu lain
  terlihat · stabilo & ukuran muat layar · di 320px submenu tombol kanan tetap muat layar).
  Hasil: **223 uji otomatis, 0 gagal** di kedua versi berkas (kemudian jadi 224 di K19).
- Berkas untuk HP diperbarui: **`ANodes-1berkas.html`**.

## 2026-09-14 — 🎯 Kepala disederhanakan + gudang plugin 2 kelompok (K17)

- **Permintaan user:** *“saya mau revisi untuk space dan logika mudah mengerti:
  1. [A] huruf pertama dibuang 2. [🧩] muncul 2x jika toolbar diubah → [▦], jadi saya
  mau jadi satu saja. Jadi jika diklik → [🧩] seharusnya berisi daftar plugin —
  katakan ada 3 plugin dan alkitab yg dipasang. Jadi misal alkitab tadinya no 3,
  karena dipasang naik ke atas. Plugin yg terinstall … Plugin yg tersedia (belum
  diinstall) …”*
- **Keputusan user (ditegaskan):** *“[▦] klik toolbar editor · [🧩] klik plugin,
  dan semua kerjaan plugin jadi 1 halaman.”*
- **Bar kepala jadi ringkas:**
  - Kotak logo **`[A]` dibuang** (hemat ruang — tulisan “ANodes” tetap).
  - Tombol `▦` **ikon TETAP** = toolbar tulis · tombol `🧩` **ikon TETAP** = semua
    urusan plugin. Dulu `#btn-toolbar` **berganti ikon sendiri** (🧩 saat ada plugin)
    sehingga **🧩 muncul dua kali berdampingan** dan membingungkan.
  - **Baris “bar plugin” (`#bar-plugin`) DIHAPUS** — cukup satu baris: toolbar tulis.
    Ikut dibersihkan: `renderBar()`, `pluginBerbar()`, `bar.nampak`, gaya `.bar-plugin`.
  - Hasil akhir: `ANodes  Tahap 5  ●  [▦][⚙][🧩][File ▼][Cari ▼][Doc]`
- **Gudang plugin dibagi 2 kelompok** (satu fungsi `kartuPlugin()`):
  - **✔ Plugin yg terinstall** — **selalu di atas**, sehingga plugin yang baru
    dipasang **otomatis naik ke atas** (sesuai permintaan user).
  - **▸ Plugin yg tersedia (belum diinstall)** — sisanya.
  - Tombol cepat di kartu: **▶ Buka** (plugin terpasang) · **⬇ Pasang** (siap dipasang).
    Klik kartu tetap membuka **halaman keterangan** (di dalamnya ada ▶ Buka + 🗑 Lepas).
  - Kontrak plugin bertambah (opsional): `tombolBuka` + `buka()`.
- **Dua plugin contoh baru** (keterangan saja, `siap:false`, belum bisa dipasang):
  `plugin/pengingat/plugin.js` 🕊️ **Pengingat Firman** ·
  `plugin/ayat-terkait/plugin.js` 🔗 **Ayat Terkait** — dicatat sebagai ide **I-09/I-10**
  di papan order.
- **🐞 Dua cacat tampilan yang ketemu & diperbaiki (hasil pemeriksaan tangkapan layar):**
  1. Di panel sempit, **teks kartu jatuh ke bawah ikon** dan badge pindah baris → kartu
     diubah ke **grid kaku** `auto minmax(0,1fr) auto auto` (flex tidak cukup).
  2. **Sintaks salah**: `plugin/alkitab/alkitab.js` masih memanggil `renderBar()` yang
     sudah dihapus → **error tiap halaman dibuka**. Sudah diganti `terapkanBar()`.
     → **Pelajaran: kalau menghapus fungsi, cari dulu semua pemanggilnya.**
- **Uji diperbarui:** blok **P18–P24** dan **Q1–Q11** diganti (baris “bar plugin” sudah
  tidak ada); ditambah uji ikon kepala tidak pernah kembar, kelompok “terinstall”
  didahulukan, tombol ▶ Buka / ⬇ Pasang, 2 plugin contoh, dan `#bar-plugin` benar-benar hilang.
  Uji **T15/T15c** disesuaikan (halaman baca **melanjutkan bacaan terakhir**, bukan
  selalu Kejadian 1). Hasil: **208 uji otomatis, 0 gagal** di kedua versi berkas.
- Berkas untuk HP diperbarui: **`ANodes-1berkas.html`**.

## 2026-09-14 — 📄 MENU [Doc] + bar kepala jadi 1 baris (TAHAP 6)

- **Permintaan user:** *“saya mau minta bar teratas apakah bisa dimasuk menu
  rencanakerja.md changelog panduan.md dimasukan dibar paling atas..”* — dengan
  pilihan: tombol **[Doc]** di **paling kanan**, **kelima berkas**, **bisa diedit**,
  sekaligus **rapikan bar kepala jadi 1 baris**.
- **Berkas baru:**
  - `js/dokumen.js` — mesin menu Doc (tampil rapi + mode tulis + simpan).
  - `tools/siapkan-dokumen.js` — mengumpulkan isi 5 berkas `.md` menjadi
    `js/dokumen-data.js` (`window.ANodesDokumen`).
  - `js/dokumen-data.js` — **dibuat otomatis**, jangan diedit tangan.
- **Kenapa harus ditanam?** Aplikasi dibuka lewat `file://`; Chrome **memblokir
  `fetch()`**, jadi berkas `.md` tidak bisa dibaca langsung. Isinya dibungkus
  jadi `.js` lalu dimuat dengan `<script src>` — sama caranya dengan data Alkitab.
- **⚠️ JEBAKAN BESAR yang ketemu & diatasi:** isi berkas `.md` memuat **contoh HTML**
  (`<!--`, `<script`, `</script>`). Ketika disatukan ke versi 1 berkas, teks penutup
  script itu **mengakhiri blok `<script>` lebih awal** sehingga **seluruh isi
  dokumen bocor jadi tampilan halaman** (terlihat sebagai teks mentah panjang).
  **Penyelesaian:** semua karakter `<` ditulis sebagai **`\u003c`**
  (`JSON.stringify(...).replace(/</g, '\\u003c')`). Isi tetap sama persis.
- **Isi menu [Doc]** — halaman `#doc-alkitab` (anak `body`, sejajar `#app-utama`,
  jadi **selebar catatan**), toolbar: `[🏠] [berkas ▾] [tanda] [✏️ Tulis] [💾 Simpan]`.
  - 5 berkas: 📋 rencanakerja.md · 📜 CHANGELOG.md · 📘 panduan.md ·
    🤖 agents.md · 🧩 prompt.md (**papan order paling atas**).
  - **Bisa diedit**: `#doc-mode` ganti **👁 Lihat** ⇄ **✏️ Tulis**; `💾 Simpan`
    (`Ctrl+S`) menyimpan ke localStorage **`anodes-dokumen-v1`**; ada tanda
    **“belum disimpan”** / **“ada editan”**; bisa **kembalikan ke isi asli**.
  - Markdown diolah sendiri oleh `keHtml()`: judul, daftar, **tabel**, blok kode,
    kutipan, garis, `**tebal**`, `` `kode` `` — tanpa pustaka luar (tetap ringan).
  - `Ctrl+B` / `Esc` = balik ke catatan (sama seperti 🏠).
- **⚠️ Simpan = perangkat ini saja.** Berkas `.md` di disk **tidak berubah** dan
  editan tidak pindah PC ↔ HP. Menulis balik ke berkas asli dicatat sebagai **K16**
  di antrean (butuh penulis Node dari `start.bat`).
- **🎯 Bar kepala jadi 1 BARIS (bonus).** Ternyata kepala **sudah terlipat 2 baris**
  (83px) — sebab `ANodes + Tahap 5 + titik + 5 tombol` (±471px) melebihi ruang (±452px).
  Perbaikan: `flex-wrap: nowrap` · padding `8/10` · gap `6` · `.merk` `flex-shrink: 0` ·
  ≤460px badge “Tahap 5” disembunyikan · ≤400px tulisan “ANodes” + panah ▼
  disembunyikan (logo **A** tetap). Hasil: **1 baris 45px** pada 320/360/412/480px.
  Tombol **tidak ada yang dihapus** — itu yang paling penting dipakai user.
- **`start.bat`** sekarang menjalankan `siapkan-dokumen.js` lebih dulu, lalu
  `buat-1-berkas.js` (yang juga otomatis menyiapkan dokumen + menanam datanya).
- **Debug:** uji baru **Y1–Y16** (klik [Doc] sungguhan, 5 berkas, markdown jadi
  tabel, mode tulis, simpan, kembalikan asli, tutup, kepala 1 baris di 320px).
  Dua uji pertama sempat GAGAL PALSU karena ikut mengukur unsur yang disembunyikan
  (`display:none`, tinggi 0) — uji diperbaiki agar hanya mengukur unsur terlihat.
  Hasil: **203 uji otomatis, 0 gagal** di `index.html` **dan** `ANodes-1berkas.html`.
- Berkas untuk HP diperbarui: **`ANodes-1berkas.html` (5.603 KB)**.

## 2026-09-14 — 🧭 PAPAN ORDER (daftar navigasi kerja)

- **Permintaan user:** butuh **daftar orderan/revisi/ide** yang mudah dilihat —
  mana yang **sudah dikerjakan** (dengan tanggal), mana **antrean** yang harus
  dikerjakan (bersortir), dan mana yang masih **ide**.
  User menyebut dirinya **pelupa**, jadi butuh navigasi visual yang jelas.
- **Keputusan penting:** user **menolak** ide membuat aplikasi rencanakerja
  terpisah — kalau jadi aplikasi, harus buka 2–3 browser sekaligus, takut
  malah **tidak dipakai** (bukan cuma lupa, tapi bisa “malas buka”).
  Papan tetap **di dalam `rencanakerja.md` tiap proyek** — ikut terbuka
  bersama aplikasi yang sedang digarap.
- **Yang dibuat — `rencanakerja.md` bagian 0 (paling atas):**
  - **A. KASUS BELUM SELESAI** — per **kasus** (mis. K7 Plugin Alkitab dengan
    9 butir a–i; ada butir ✅ dan ada ⬜). Kasus ditutup kalau semua butir ✅.
  - **B. ANTREAN KERJA** — sudah disetujui, belum mulai, **bersortir**
    (K12 menu 📚 Dok → K13 impor/ekspor .md + logo → K14 pindah folder `bible`).
  - **C. IDE** — dipisah 3 kelompok: 🟡 **perlu diperdalam** (I-01 gudang plugin
    internet, I-06 sync Supabase, I-07 aplikasi rencanakerja) · ⏸️ **ditahan**
    (I-02 panel Ayat & Istilah, I-03 Rantai Ayat, I-04 deteksi istilah,
    I-05 kamus pribadi — semuanya menunggu pindahnya folder `bible`) ·
    ❌ **dibuang** (I-08 versi Android).
  - **D. SELESAI** — arsip K0–K11 dengan tanggal + ringkas hasilnya.  - **📏 Aturan papan** (5 aturan) + **🗣️ perintah singkat**:
    `kerjakan I-02` · `tunda K12` · `buang I-06` · `selesai K7 g` · `papan`.
- **Bagian lama yang tadinya jadi daftar status kembar kini menunjuk ke papan**:
  bagian 6 (fitur tahap awal), 7 (fitur lab3), 8 (peta tahapan), 9, dan 15 —
  supaya **tidak ada dua daftar yang bisa saling bertentangan**.
- **Ditambahkan catatan asal-usul**: `CHANGELOG.md` memuat 28 judul revisi;
  papan **mengelompokkannya** (mis. K3 menampung 10 revisi kecil tahap 3) —
  jadi tidak ada yang dikira hilang.
- **`agents.md` bagian 0** dan **`prompt.md` bagian B** diberi aturan baru:
  papan order **wajib dibaca lebih dulu** dan **wajib diperbarui setiap selesai
  kerja** — supaya AI lain yang melanjutkan ikut merawatnya.

## 2026-09-14 — 🎨 PERBAIKAN TAMPILAN (5 hal dari user)

Laporan user berisi 5 poin, semuanya dikerjakan sekaligus:

**1. 🧩 Gudang Plugin tidak lagi terbuka terus**
- Setelah tombol **Pasang** ditekan dan plugin berhasil dipasang → gudang
  **menutup sendiri** (`tutupGudang()` di `js/plugin.js`).
- Sesudah data Alkitab benar-benar siap, muncul toast
  “📖 Alkitab (Terjemahan Baru) siap dipakai”.

**2. Tombol kepala berganti ikon sendiri (🧩 ⇄ ▦)**
- **🧩** ＝ saat toolbar tulis tampil **dan** ada plugin → klik = pindah ke bar plugin.
- **▦** ＝ saat bar plugin tampil → klik = balik ke toolbar tulis.
- **▦** ＝ saat baris ke-2 disembunyikan **atau** tidak ada plugin → klik = sembunyi/tampil toolbar.
- **Alt+klik** (ikon apa pun) = sembunyikan/tampilkan seluruh baris ke-2.
- ⚠️ Tanpa plugin ikonnya **▦** (bukan 🧩) supaya **tidak kembar** dengan tombol Gudang Plugin.

**3. Baris bar plugin & toolbar baca Alkitab dirapikan**
- Bar plugin sekarang cukup **`[📖 Alkitab]` + `[🧩]`** (gudang plugin).
  Tombol **📖 Alkitab** → langsung membuka bacaan (dulu terpisah jadi “Baca”).
  Tombol **🔍 Cari** **dipindah** ke toolbar halaman baca.
- Toolbar halaman baca menjadi:
  `[🏠][Kitab ▾][Pasal ▾][◀][▶][↩][📋 PILIH][🔍 Cari]`
  - **`[↑ kembali]` → `🏠`** (tulisan lama terlalu makan ruang).
  - **`⌨ KETIK` + `🔍 Cari` DISATUKAN** menjadi satu tombol **🔍 Cari**:
    ketik nama ayat (mis. `ibr 11:1`) → tawaran “📖 Buka…”;
    ketik kata/kutipan (mis. `kasih`) → tawaran “🔍 Cari ayat yang memuat…”.
  - `Ctrl+B` di halaman baca = kembali ke catatan (sama seperti 🏠).
  - Isi pilihan pasal cukup **angkanya** (“1”), bukan “Pasal 1”, supaya toolbar muat 1 baris.

**4. Daftar 28 icon tidak lagi terpotong**
- `.submenu` diberi **`max-height: min(46vh, 300px)` + `overflow-y: auto`**
  → daftar panjang bisa **digulir**.
- Kalau submenu tidak muat ke bawah, **dibuka ke atas** (kelas `.ke-atas`
  ditambahkan `js/editor.js` saat submenu dibuka) → tidak ada isi yang terpotong layar.

**5. Toolbar halaman baca tidak lagi terpotong di atas (HP)**
- Navbar baca: **`flex-wrap: nowrap`** — selalu **1 baris**; kitab/pasal punya
  lebar minimum supaya namanya tetap terbaca, dan kalau layar sangat sempit
  barisnya bisa digeser mendatar.
- Ada pengaturan rapat untuk layar ≤420px dan ≤360px (tombol & huruf mengecil).
- Tinggi aplikasi memakai **`100dvh`** (bukan hanya `100vh`) → di HP tinggi app
  tidak melebihi layar yang kelihatan, jadi baris atas tidak terpotong.
- `Ctrl+B`, gulir bacaan, dan semua tombol lama tetap berfungsi.

**Debug & uji**
- Uji lama disesuaikan (G1, P11–P13, Q4, S14, T16, T16i, W7) + **uji baru
  P17a–P23 (gudang menutup sendiri & ikon kepala) dan Z1–Z9 (navbar 🏠/🔍 Cari,
  toolbar 1 baris, submenu icon digulir)**.
- Hasil: **184 uji otomatis, 0 gagal** di `index.html` **dan** `ANodes-1berkas.html`.
- Berkas untuk HP diperbarui: **`ANodes-1berkas.html` (5.392 KB)**.

## 2026-09-13 — 🔴 PERBAIKAN: 📋 PILIH & ⌨ KETIK “belum berfungsi”

- **Laporan user:** *“tekan 📋 PILIH atau ⌨ KETIK belum berfungsi.”*
- **Penyebab (ketemu setelah diuji):** data Alkitab **hanya dimuat saat tombol
  “Pasang plugin” ditekan**. Begitu halaman di-**refresh (F5)**, isi halaman hilang
  tetapi plugin **tetap tercatat terpasang** → mesin Alkitab ada, tetapi
  **datanya kosong**. Karena `bukaPilih()`/`bukaKetik()` berbaris
  `if (!m || !m.siap()) return;` → tombol **diam tanpa pesan apa pun**
  (terlihat seperti “tidak berfungsi”).
  Bingkai halaman baca juga tidak terbuka karena hal yang sama.
- **Perbaikan:**
  1. **Muat otomatis saat halaman dibuka** — fungsi baru
     `ANodesAlkitab.siapkanOtomatis()`. Kalau plugin tercatat terpasang,
     data dimuat sendiri (lewat IndexedDB, ±40 ms) dengan lapisan
     “📖 Menyiapkan plugin Alkitab…”; kalau gagal → toast peringatan.
  2. **Tombol jadi tahan-menunggu** — fungsi baru `saatSiap()` di `tampilan.js`:
     kalau data belum siap, tombol **tidak lagi diam** — muncul toast
     “⏳ Menyiapkan data Alkitab…”, lalu lapisannya terbuka sendiri setelah data siap.
     Kalau plugin belum dipasang → “💡 Pasang plugin 📖 Alkitab dahulu”.
  3. **Editor ikut menunggu** — fungsi baru `ANodesAlkitab.ketikaSiap(fn)` dipakai
     `js/editor.js` (`tandaAyatSekarang`), jadi tautan ayat tetap diwarnai
     walau catatan dibuka sebelum data siap (dulu penandaan terlewat/sia-sia).
  4. `gambarPasal()` & `bukaHalaman()` diberi pemeriksaan data yang sama.
- **Debug:** ditambah **7 uji baru (W1–W7)** → sekarang **164 uji otomatis, 0 gagal**
  di `index.html` **dan** `ANodes-1berkas.html`, tanpa error halaman.
  Uji W6/W7 **mengklik tombolnya sungguhan** (bukan memanggil fungsi langsung).
- Berkas untuk HP diperbarui: **`ANodes-1berkas.html` (5.386 KB)**.

## 2026-09-13 — Toolbar baca PERSIS seperti lab3

- Permintaan user: *“di lab3 alkitab toolbar seperti ini
  `[↑ kembali][Lukas][Pasal 10][◀][▶][↩][📋 PILIH][⌨ KETIK]` — dibuat seperti ini.”*
- **Toolbar lama** (bar hitam + menu Kitab + kotak cari) **diganti** dengan navbar lab3:

```
[↑ kembali] [Kitab ▾] [Pasal ▾] [◀] [▶] [↩] [📋 PILIH] [⌨ KETIK]
```

| Tombol | Fungsi |
|--------|--------|
| **↑ kembali** | balik ke catatan + tempat yang tadi diklik disorot kuning |
| **Kitab ▾** | daftar 66 kitab (ganti kitab → mulai dari pasal 1) |
| **Pasal ▾** | daftar pasal kitab yang sedang dibuka |
| **◀ / ▶** | pasal sebelumnya / berikutnya (otomatis non-aktif di ujung) |
| **↩** | kembali ke posisi yang dibuka sebelumnya (riwayat 30 langkah) |
| **📋 PILIH** | grid kitab → pasal → ayat, seperti lab3 |
| **⌨ KETIK** | ketik nama ayat **atau** kata untuk mencari |

- **📋 PILIH** (meniru lab3): grid 66 kitab 6 kolom; buku **Perjanjian Baru berlatar gelap**;
  pilih kitab → grid nomor pasal → grid nomor ayat → langsung terbuka & ayat disorot.
  Ada tombol **← kitab** / **← pasal** untuk naik satu langkah, dan tulisan langkah di bawah.
- **⌨ KETIK** (meniru lab3): satu kotak serba bisa —
  - ketik `ibr 11:1-10` → tombol **📖 Buka Ibrani 11:1-10**
  - ketik `kasih`    → tombol **🔍 Cari ayat yang memuat "kasih"**
  - ditambah keterangan kecil supaya jelas bedanya.
- **Tombol 🔍 Cari di bar plugin** sekarang membuka lapisan **⌨ KETIK**
  (bukan lagi kotak cari di halaman).
- Gaya tombol/select dibuat **sama seperti lab3** (ukuran 30px, border lembut,
  latar `#fafbfc`, sudut 5px) dan ikut skala huruf ⚙ (`--skala`).
- **Debug:** **157 uji otomatis, 0 gagal** (11 uji baru: T16–T16m) dijalankan di
  **dua versi** (`index.html` dan `ANodes-1berkas.html`), tanpa error halaman.
  *(Setelah perbaikan 13 Sep 2026 malam, jumlah uji naik jadi 164 — lihat entri paling atas.)*
  Diuji: urutan toolbar, ◀▶ pindah pasal, ↩ kembali posisi, PILIH kitab→pasal→ayat,
  KETIK nama ayat & kata, hasil cari per kitab, dan klik ayat dari hasil.
- Berkas untuk HP: **`ANodes-1berkas.html` (5.382 KB)**.

## 2026-09-13 — PERBAIKAN PENTING: catatan hilang + halaman baca gaya BUKU

- **Backup dulu** ke `backups/baca-format-20260913-221439/`.
- Keluhan user: *“catatan sudah ada lumayan banyak — hilang ketika [Alkitab][Baca]
  diklik, tidak keluar buku alkitab dan tulisan juga hilang”* + minta format baca
  **seperti lab3 / seperti buku Alkitab cetak**.

### 🐞 BUG UTAMA — catatan “hilang” saat tekan 📖 Baca
Dua sebab, keduanya sudah diperbaiki:

1. **Tag penutup `</div>` wadah aplikasi hilang di `index.html`.**
   Akibatnya halaman baca Alkitab beserta **semua modal & skrip** ikut berada
   **di dalam** `<div class="app" id="app-utama">`. Saat `app-utama` disembunyikan,
   halaman baca **ikut tersembunyi** (tingginya 0) — jadi terlihat seperti
   “tidak keluar apa-apa dan tulisan hilang”.
   → ditambahkan `</div><!-- /wrap -->` + `</div><!-- /app-utama -->`.
2. **`hidden` tidak bekerja karena `.app { display: flex }` menimpanya.**
   → ditambahkan `.app[hidden] { display: none !important; }` di `base.css`
   dan `.halaman-alkitab[hidden] { display: none !important; }` di `app.css`.
   (Ini juga penyebab toolbar catatan tetap terlihat di atas kotak cari Alkitab.)

> ✅ Diuji: setelah tekan 📖 Baca → `app-utama` benar-benar `display:none`,
> halaman baca tinggi **570px** penuh, dan **isi catatan tetap utuh** (uji T9b, T9c).

### 📖 Format baca jadi seperti BUKU (sesuai permintaan — meniru lab3)
- **Baris alat baru:** pilihan **kitab** (66) + pilihan **pasal** (ikut kitab) + kotak cari.
  Jadi tinggal pilih dari daftar — tidak perlu klik-klik menu.
- **Satu ayat = satu blok** dengan **nomor di kiri** (bukan tulisan mengalir rata).
- **Ayat berisi perkataan Yesus ditampilkan MERAH** (`#b3261e`) — seperti
  Alkitab cetak. Data `merah` sudah ada di `alkitab-tb.js` (2.059 ayat, sudah diverifikasi).
- **Kepala buku:** judul “**Matius 5**” + keterangan “**48 ayat**” + garis pemisah.
- **Ayat yang dituju disorot** (latar kuning + garis oranye) saat dibuka dari tautan
  di catatan — supaya langsung ketemu ayatnya.
- Tombol **‹ Pasal sebelumnya / berikutnya ›** pindah ke bawah bacaan.
- Hasil pencarian juga memakai gaya blok yang sama.

### Debug
- **146 uji otomatis, 0 gagal** (9 uji baru: T9b, T9c, T11b, T11c, T15b–T15f)
  dijalankan di **dua versi** (`index.html` dan `ANodes-1berkas.html`), tanpa error halaman.
- Uji baru khusus menjaga bug ini tidak kembali:
  T9b (catatan & halaman baca tidak tampil bersamaan), T9c (halaman baca punya tinggi),
  T15e/T15f (perkataan Yesus benar-benar merah).
- Berkas untuk HP: **`ANodes-1berkas.html` (5.376 KB)**.
- Tahap berikutnya: **g** (cari kutipan panjang) / **i** (uji + dokumen).

## 2026-09-13 — TAHAP 5d+5e+5f ✅: 📖 Ayat di catatan + halaman baca + cari 3 cara

- **Backup dulu** ke `backups/link-ayat-20260913-214714/`.
- Permintaan user: *“test → alkitab belum bisa baca full… bisa diproses lanjut”*.

### 📖 Tautan ayat di catatan (tahap d)
- Nama ayat yang diketik berubah jadi **tautan berwarna biru bergaris putus-putus**.
  Didukung: `ibr 11:1` · `ibrani 11:1-10` · `1 Kor 13:4-5` · `mazmur 23` (seluruh pasal)
  · `Yohanes 3:16` (pemisah titik pun diterima).
- **Toleran salah tulis & sebutan umum**: `ibr`, `ibrani`, `mat`, `mar`, `mas`, `maz`, `mazmur`,
  `1kor`, `kis`, `why`, `kej`, `yoh`, dst.
- Penanda tautan **TIDAK ikut disimpan** ke catatan — dibersihkan saat menyimpan,
  jadi isi catatan tetap teks biasa apa adanya.
- Saat plugin **dilepas**, semua penanda dibersihkan & halaman baca ditutup.

### ↩ Halaman baca sebesar catatan + sorot tempat klik (tahap e)
- Klik tautan → terbuka **halaman sebesar catatan** (lebar sama, satu halaman penuh).
- Tombol **↩** kembali → balik ke catatan, digulir ke tempat tadi, lalu tempat itu
  **disorot kuning + garis oranye ±4 detik**.
- Pencarian tempat asal memakai **nomor urut tautan** (bukan hanya teks) → kalau ada
  dua tautan bertulis sama, sorot tetap tepat pada yang diklik (diuji T14).

### 📖 Baca penuh + 3 cara mencari (tahap f)
- Tombol **📖 Baca** di bar plugin → membuka Alkitab pada Kejadian 1.
- Tombol **📖 Kitab** → **daftar 66 kitab** (dibagi Perjanjian Lama / Perjanjian Baru)
  → pilih kitab → **daftar pasal** → pasal ditampilkan + tombol ‹ pasal sebelumnya/berikutnya ›.
- Kotak **Cari ayat** melayani **dua cara**:
  - **Cara 2 (ketik nama ayat)**: `why 22:21` → langsung tampil.
  - **Cara 3 (kata/kutipan)**: `kasih` → hasil **dikelompokkan per kitab**;
    pencocokan memakai “termuat”, jadi `kasih` cocok dengan `mengasihi`
    (sesuai keputusan user: cukup sama persis & mirip).
- Tombol **🔍 Cari** di bar plugin → langsung membuka halaman baca dengan kotak cari siap.

### 🎯 KURSOR TIDAK LOMPAT (masalah tersulit lab3 — sudah ditutup)
- Kursor disimpan sebagai **hitungan huruf** lalu ditaruh kembali setelah penandaan
  (Ide A). Teks dibangun ulang sekaligus per blok, bukan diubah satu per satu (Ide B).
- **Hanya nama ayat yang sedang diketik** (kursor di tengahnya) yang dilewati sementara (Ide C) —
  sebelumnya seluruh paragraf dilewati sehingga tautan tidak muncul saat mengetik.
- **Hasil uji terukur:** mengetik 33–49 huruf sambil ditandai → **0 kali kursor melompat**,
  isi tulisan tidak berubah, dan tautan tetap muncul (uji T7–T8).

### 🐞 Bug yang ditemukan & diperbaiki saat pengujian
1. Sebutan umum ikut dicocokkan ke **semua** kitab → `ibr` terbaca **Kejadian** (bukan Ibrani).
2. Kata sambung terbaca nama kitab: `dan 1 Yohanes 4:8` → **“Daniel 1”**.
3. Nama kitab ikut termakan kata sebelumnya: `ya. Ibrani 11:1` → judul “ya. Ibrani”.
4. Salah hitung posisi 1 huruf saat jendela pencarian dimulai di spasi →
   nama ayat terakhir dalam satu baris **tidak terdeteksi**.
5. Pemisah titik diubah jadi titik dua: `Yohanes 3.16` tampil sebagai `3:16`.
6. `const` yang tidak ada di `window` (dari tahap c) — sudah diperbaiki sebelumnya.

### Debug
- **137 uji otomatis, 0 gagal** (21 uji baru: T1–T21) — dijalankan di **dua versi**
  (`index.html` dan `ANodes-1berkas.html`), **tanpa error halaman**.
- Sudah ditambahkan **daftar kata umum** (dan, ayat, pasal, ya, …) supaya kalimat biasa
  tidak salah dibaca sebagai nama kitab, dan aturan kemiripan dibuat lebih ketat.
- Berkas untuk HP: **`ANodes-1berkas.html` (5.370 KB)**.
- Tahap berikutnya: **g** sisa (cari lewat kutipan panjang) / **h** (perapian kursor) /
  **i** (uji + dokumen), lalu rencana gudang plugin dari internet.

## 2026-09-13 — 💬 DISKUSI: gudang plugin dari internet (belum dikerjakan)

- User menanyakan: *“Kalau pakai Google Drive berfungsi seperti Google Play? Aplikasi
  ANodes.html + plugin ada di Google Drive, perlu plugin tinggal klik di gudang plugin —
  apakah memungkinkan? Username dan password saya berikan karena tidak saya pakai.”*
- **Tidak ada kode yang diubah** — ini tahap diskusi.
- Jawaban inti (rincian di `rencanakerja.md` bagian 14):
  - ❌ Google Drive **bukan** seperti Google Play. Drive = penyimpanan berkas saja.
  - ✅ Idenya **bisa**: Drive/hosting dijadikan **bank plugin** (daftar + tombol Pasang).
  - ❌ **Username & password TIDAK diperlukan dan jangan diberikan** — tidak ada cara
    aman menyimpan password di aplikasi HTML/JS, berkas bisa dibaca siapapun, akun bisa
    dikuasai orang, dan Google menolak login dari aplikasi seperti ini. Untuk membaca
    berkas publik dari Drive, login memang tidak perlu.
  - ✅ Cara paling andal hari ini tetap: **plugin dikirim sebagai berkas** ke folder `plugin/`.
- Uji teknis (browser uji VS Code, halaman `file://`): `<script src="https://…">`
  **berhasil**; `fetch()` ke https & ke berkas lokal juga berhasil di browser uji, TAPI
  di **Chrome asli** keduanya diblokir CORS → plugin tetap wajib lewat **tag `<script src>`**.
  Perlu diuji langsung di HP sebelum fitur ini dipastikan jalan.

## 2026-09-13 — TAHAP 5c ✅: 💾 Data Alkitab dimuat + disimpan agar cepat

- Permintaan user: setelah perbaikan undo + versi HP, **lanjut proses**.
- **Berkas baru (3):**
  - `tools/siapkan-data-alkitab.js` — menyiapkan data (dijalankan 1× di PC).
  - `plugin/alkitab/data/alkitab-tb.js` — **data ayat 5,08 MB**
    (`window.ANodesAlkitabData`), sumber `C:\data\bible\data\alkitab-tb.json`.
  - `plugin/alkitab/alkitab.js` — **mesin plugin** (`window.ANodesAlkitab`).
- **Kenapa dibungkus jadi `.js`?** Di `file://` Chrome melarang `fetch()`/XHR ke berkas
  lain; yang diizinkan hanya pemuatan lewat tag `<script src>`. Jadi data dibungkus
  jadi berkas `.js`.
- **Simpanan cepat pakai IndexedDB** (bukan localStorage — batasnya hanya ±5 MB):
  - Gudang: `anodes-plugin-db` · toko: `data` · kunci: `alkitab-tb`.
  - Urutan pemuatan: (1) data sudah ada di halaman → pakai; (2) ada di IndexedDB →
    pakai (**terukur ±40 ms**, tidak membaca 5 MB lagi); (3) belum ada → baca berkas,
    lalu simpan ke IndexedDB.
- **Tampilan “📖 Memuat plugin Alkitab…”** — elemen `#memuat-plugin` + batang kemajuan.
  Muncul otomatis saat plugin **Pasang**. Diberi tunda 450 ms supaya tetap terlihat
  walau data sudah tersimpan (pemuatan hanya puluhan milidetik).
- **Tombol bar plugin jadi siap:** setelah data termuat, `siap` berubah `true` →
  tombol Baca & Cari tidak lagi pudar. (Kalau belum siap, tetap aman: hanya pesan.)
- **Versi satu berkas diperbarui:** `tools/buat-1-berkas.js` kini **ikut menyatukan
  data Alkitab** → `ANodes-1berkas.html` menjadi **5.333 KB (5,2 MB)**; di HP datanya
  langsung tersedia tanpa berkas tambahan.
- **🐞 Bug yang ditemukan & diperbaiki (penting):**
  - `ANodesPlugin`, `ANodesSetting`, `ANodesStore` ditulis dengan `const` sehingga
    **tidak otomatis ada di `window`**. Akibatnya berkas plugin (`plugin/alkitab/*`)
    **tidak bisa** memanggil layanan ANodes → lapisan “Memuat plugin Alkitab…”
    tidak pernah muncul dan tombol bar tetap dinyatakan belum siap.
    Diperbaiki: ketiganya kini **dipasang ke `window`** secara eksplisit.
  - Alat uji: (a) nama variable bentrok (`tampilLapis` sudah dipakai) → diubah;
    (b) uji S16 mula-mula salah anggapan (minta lapisan tampil padahal data sudah
    ada di memori → memang tidak perlu tampil) → ujinya diganti memeriksa langsung
    bahwa lapisan bisa tampil + tertutup + tidak menggantung.
- **Debug:** **116 uji otomatis, 0 gagal** (16 uji baru: S1–S17 data Alkitab).
  Dijalankan di **dua versi** (`index.html` dan `ANodes-1berkas.html`) — dua-duanya lolos,
  tanpa error halaman. Isi yang diverifikasi: Kejadian 1:1, Ibrani 11:1, Wahyu 22:21,
  Mazmur = 150 pasal, 66 kitab, 1.189 pasal, 31.102 ayat, data benar-benar tersimpan
  di IndexedDB, dan lapisan “Memuat…” bisa tampil & tertutup.
- Tahap berikutnya: **d** — ayat di catatan jadi tautan berwarna + kotak isi ayat.

## 2026-09-13 — PERBAIKAN: ↶ Batal (undo) + 📱 versi satu berkas untuk HP

- **Backup dulu** ke `backups/undo-hp-20260913-211121/`.
- Keluhan user: (1) salah edit tidak bisa dikembalikan — **harus ada undo**;
  (2) `index.html` dikirim sendiri ke HP → tampilannya **seperti tanpa css**.

### 1) ↶ Batal / ↷ Ulangi (undo / redo)
- **Dua tombol baru di toolbar tulis** (paling kiri): **↶** (batal) dan **↷** (ulangi).
  Diringkas jadi simbol saja supaya toolbar tetap **muat 1 baris** (diuji: 38px, 1 baris).
- **Pintasan keyboard** (selalu aktif, tidak bisa dimatikan):
  - `Ctrl+Z` = **batal** (kembalikan yang tadi salah)
  - `Ctrl+Y` atau `Ctrl+Shift+Z` = **ulangi**
- **Dua cara kerja** (aman di semua browser):
  1. Utama: perintah bawaan browser (`document.execCommand('undo'/'redo')`) —
     ringan, posisi kursor tetap terjaga.
  2. Cadangan: **riwayat sendiri** — 80 langkah terakhir tulisan (`catatRiwayat()`);
     dipakai kalau browser tidak mendukung cara 1.
- Riwayat dicatat **tertunda 450 ms** supaya mengetik tetap lancar, dan **diulang dari
  awal setiap ganti catatan** (jadi tidak salah membatalkan isi catatan lain).
- Kalau memang tidak ada yang bisa dibatalkan → muncul pesan **“Tidak ada yang bisa
  dibatalkan”** (tidak error).

### 2) 📱 Versi SATU BERKAS untuk HP
- **Penyebab masalah:** `index.html` memuat `css/*.css`, `js/*.js`, dan
  `plugin/*/plugin.js`. Kalau hanya `index.html` yang dikirim ke HP, berkas-berkas itu
  **tidak ikut** → tampilan polos seperti tanpa css.
- **Solusi: `tools/buat-1-berkas.js`** → membuat **`ANodes-1berkas.html`**
  (semua css + js + keterangan plugin disatukan jadi satu berkas, ±121 KB).
  Kirim **satu berkas itu saja** ke HP → tampilannya lengkap. Bonus: lebih cepat dibuka.
- **`start.bat`** sekarang otomatis menjalankan pembuatnya sebelum membuka `index.html`.
- **Jebakan penting yang ditemukan & diperbaiki:** di dalam blok `<script>`, teks
  penutup script akan **mengakhiri blok itu walau berada di dalam komentar**.
  Komentar di `plugin/alkitab/plugin.js` memuat teks itu → berkas satu berkas pertama
  rusak (teks bocor ke halaman). Sekarang: (a) komentarnya ditulis ulang, dan
  (b) penggabung **mengamankan** setiap kemunculannya (`amanScript()`).

### Debug
- **99 uji otomatis, 0 gagal** (8 uji baru: R1–R8 untuk Batal/Ulangi).
  Uji dijalankan di **dua versi**: `index.html` dan `ANodes-1berkas.html` — dua-duanya lolos.
- Uji N1 diperbarui: toolbar sekarang **11 tombol** (9 lama + Batal + Ulangi).

## 2026-09-13 — TAHAP 5b ✅: 📖 Baris bar plugin (bergantian dengan toolbar tulis)

- **Backup dulu** ke `backups/bar-plugin-20260913-205551/`.
- Permintaan user: **satu baris di bawah bar hitam**, dipakai **bergantian** dengan
  toolbar tulis — kalau toolbar tulis tampil, bar plugin sembunyi (dan sebaliknya).
  Keduanya tetap bisa disembunyikan/ditampilkan.
- **Baris baru `#bar-plugin`** di `index.html` (di bawah bar info, di atas toolbar)
  + CSS `.bar-plugin` (gaya sama dengan toolbar: latar `--abu-toolbar`).
- **Tombol ▦ di kepala** sekarang punya 3 cara pakai:
  - Klik biasa (ada plugin terpasang) → **ganti** toolbar tulis ⇄ bar plugin.
  - Klik biasa (tanpa plugin) → sembunyi/tampil toolbar tulis (seperti dulu).
  - **Alt+klik** (atau klik-2 pada nama plugin) → sembunyikan seluruh baris ke-2.
- **Status diingat** di localStorage kunci baru **`anodes-bar`**:
  `{nampak:'toolbar'|'plugin', siap:'1'|'0'}`. Kunci lama `anodes-toolbar='0'`
  dimigrasi otomatis.
- **Perapian penting:** dulu `js/editor.js` punya listener `#btn-toolbar` sendiri
  (`terapkanToolbar(toolbar.hidden)`) — bentrok dengan pengendali baru. Listener itu
  **dihapus**; `js/editor.js` kini **tidak lagi** menyentuh `#toolbar.hidden`.
  Satu-satunya pengendali = `ANodesPlugin.terapkanBar()`.
- **Isi bar plugin** ditentukan plugin itu sendiri (kunci `bar[]` di file plugin):
  Alkitab → `📖 Baca` (baca penuh) + `🔍 Cari` (3 cara cari dipilih di panel Cari).
  Dua tombol saja supaya **muat 1 baris** di lebar HP ±480px (sudah diuji: 38px, 1 baris).
  Nama di badge bar pakai `namaBar` (pendek: “Alkitab”), bukan nama panjang.
- Tombol yang belum siap (`siap:false`) tetap tampil (sedikit pudar) dan bila diklik
  hanya memberi pesan **“⏳ … menyusul pada tahap berikutnya”** — bukan error.
- **Plugin Alkitab diperbarui:** ditambah `namaBar`, `bar[]`, dan `caraCari[]`
  (3 cara cari: 1️⃣ Pilih dari daftar · 2️⃣ Ketik nama ayat · 3️⃣ Cari lewat kata/kutipan).
- **Alat uji diperkuat (2 lapis pengaman):**
  1. **Cadangan darurat** `anodes-cadangan-uji` ditulis **sebelum** uji jalan. Kalau
     uji berhenti di tengah (error kode), catatan dipulihkan otomatis pada uji berikutnya.
  2. **Penyeragaman keadaan awal** — plugin dilepas & baris ke-2 diatur dulu, supaya
     hasil uji tidak berubah-ubah tergantung keadaan sebelumnya.
  (Masalah yang sempat terjadi: uji berhenti di tengah karena file plugin sintaksnya
  rusak → catatan contoh tertimpa. Sudah diperbaiki + dipulihkan.)
- **Debug:** **91 uji otomatis, 0 gagal** (12 uji baru: Q1–Q11 baris bar plugin).
- Tahap berikutnya: **c** — memuat data Alkitab ke IndexedDB.

## 2026-09-13 — TAHAP 5a ✅: 🧩 Gudang Plugin + halaman info Alkitab

- **Backup dulu** ke `backups/pra-plugin-20260913-203140/`.
- Permintaan user: plugin pertama = **Alkitab**, gaya **seperti WordPress** —
  sebelum memasang ada **halaman informasi** (apa ini + fitur yang akan terjadi),
  lalu tombol **Pasang / Lepas**. Fokus satu-satu (pilihan 1: plugin Alkitab saja dulu).
- **File baru:**
  - `plugin/alkitab/plugin.js` — keterangan plugin Alkitab
    (nama, versi, ukuran, 66 kitab/1.189 pasal/31.102 ayat/2.059 ayat merah,
    keterangan, 7 butir fitur, 5 langkah cara pakai, 4 butir catatan).
  - `js/plugin.js` — mesin gudang plugin (`ANodesPlugin`):
    `daftar()`, `ambil(id)`, `pasang(id)`, `lepas(id)`, `dipasang(id)`,
    simpan di localStorage **`anodes-plugin-v1`**.
- **Tombol 🧩** di kepala (samping ⚙) → **Gudang Plugin**: daftar plugin →
  klik = halaman keterangan lengkap → tombol **[⬇ Pasang plugin]** /
  **[🗑 Lepas plugin]**. Tombol kepala jadi putih (aktif) + judul “(n terpasang)”
  bila ada plugin terpasang.
- **Aturan penting yang dipegang:**
  - Plugin dimuat lewat **`<script src>`** — ❌ tidak pakai `fetch()`
    (Chrome memblokir fetch di `file://`).
  - **Melepas plugin tidak menyentuh catatan user** (diuji, P16).
  - Setiap plugin baru cukup: buat `plugin/<nama>/plugin.js` +
    satu baris `<script src>` di `index.html` → otomatis muncul di gudang.
- **Tampilan:** gaya daftar plugin WordPress — ikon, nama, ringkasan, badge status,
  kotak angka ringkas, bagian “Yang bisa dilakukan”, “Cara pakai”,
  “Sebelum memasang perlu diketahui”, aksi Pasang/Lepas.
- **Alat uji diperbaiki:** `tools/uji-toolbar.js` sekarang **menyimpan dulu isi
  catatan + pengaturan sebelum diuji, lalu memulihkannya di akhir** — supaya
  catatan asli tidak tertimpa hasil uji (masalah yang sempat terjadi).
- **Debug:** **79 uji otomatis, 0 gagal** (16 uji baru: P1–P16 gudang plugin).
- Tahap berikutnya: **b** — baris bar plugin di bawah bar hitam + tombol ganti.

## 2026-09-13 — RENCANA: 📖 Plugin Alkitab (plugin pertama)

- **Backup dulu** ke `backups/pra-plugin-20260913-203140/`.
- User minta plugin pertama = **Alkitab**, gaya **seperti WordPress**
  (ada halaman informasi pra-pasang + tombol **Pasang/Lepas**).
- **Tanya jawab klarifikasi (5 hal) sudah dijawab user:**
  1. 3 cara cari ayat = **Pilih dari daftar** · **Ketik nama ayat** · **Cari lewat kata/kutipan**.
  2. “Senada” = cukup **kata sama persis & mirip** (`kasih` cocok `mengasihi`) — belum pakai sinonim.
  3. Data dipasang = **ayat saja dulu** (±6 MB).
  4. Cara pasang = **persis WordPress** (daftar plugin + info + Pasang/Lepas).
  5. Letak tombol = **baris ke-2 di bawah bar hitam**, dipakai **bergantian** dgn
     toolbar tulis; keduanya tetap bisa **sembunyi/tampil**.
- **Temuan riset:** lab3 **belum punya** “cari ayat lewat kata/kutipan” → metode ke-3
  dibuat baru. Lab3 hanya punya PILIH (grid kitab→pasal→ayat) + KETIK (alias + fuzzy typo).
- **Rencana ditulis** ke `rencanakerja.md` bagian 13 (tahapan a–i) + `agents.md` bagian 7.
- **Tambah fitur tersendiri (tahap e):** klik link ayat → **halaman sebesar note** →
  tombol **↩ kembali** → balik + **sorot kuning tempat klik tadi** (±4 detik) supaya
  user tahu di mana tadi membaca. Diambil dari lab3 (rincian di `rencanakerja.md` 13.7).
- ⚠️ **Belum ada kode yang diubah** — menunggu perintah **“proses”** dari user.

## 2026-09-13 — FITUR BARU: ⚙ Pengaturan + Pintasan keyboard (bisa dikustom)

- **Backup dulu** ke `backups/setting-20260913-182914/`.
- Permintaan user: (a) pintasan tombol tanpa klik toolbar, (b) pengaturan besar
  huruf keseluruhan, kecerahan layar, dan daftar pintasan yang bisa diganti user.
- **File baru `js/setting.js`** — menyimpan pengaturan di `localStorage`
  (kunci `anodes-setting-v1`): `{font, kecerahan, jenisFont, pintas{}}`.
- **Tombol ⚙** di kepala → modal pengaturan:
  - **Jenis huruf** 4 pilihan (Biasa / Rapi / Klasik / Kode).
  - **Besar huruf keseluruhan 12–24** — seluruh UI ikut (tombol, panel, editor)
    lewat variabel CSS `--skala` (angka polos) + `--font-isi` + `--font-jenis`.
  - **Kecerahan layar 50–100%** — lapisan gelap `#lapis-cahaya` di atas layar.
  - **Contoh tulisan** langsung terlihat.
  - **Daftar pintasan 9 aksi** — bisa direkam ulang (klik kotak → tekan kombinasi),
    `Esc` = batal, `Del` = kosongkan, + tombol **Reset pintasan**.
- **Pintasan bawaan**: H1 `Ctrl+1`, H2 `Ctrl+2`, H3 `Ctrl+3`, ¶ `Ctrl+0`,
  titik `Ctrl+Shift+8`, nomor `Ctrl+Shift+7`, icon `Ctrl+Shift+9`, `Ctrl+B`, `Ctrl+I`.
- Debug: 63 uji otomatis **semua lolos** (14 uji baru: O1–O10 pengaturan +
  C8–C11 daftar dalam sel tabel); skala terbukti 1.000 / 1.500 / 0.750 untuk
  16 / 24 / 12 px; pintasan kustom (Alt+1, Ctrl+Shift+H) bekerja & bertahan
  setelah reload; tanpa error konsol.

## 2026-09-13 — DEBUG: daftar di dalam SEL TABEL (3 bug ditemukan & diperbaiki)

- Permintaan user: cek apakah list (dot/icon/nomor) di dalam **sel tabel** berfungsi baik.
- **Hasil debug: TIDAK berfungsi — 3 bug serius**:
  1. **Tabel hancur**: kursor di sel → klik List → `<table>` hilang, seluruh isi tabel
     digabung jadi 1 item. Sebab: `blokTerpilih()` tidak mengenal `<td>` dan
     mengangkat seluruh tabel sebagai "blok".
  2. **Isi sel hilang saat matikan daftar**: toggle OFF di dalam sel
     mengosongkan isi sel. Sebab: `<div>` pengganti ditaruh *di dalam* `<ul>`
     yang belum dihapus, lalu wadah kosong ikut dibuang.
  3. **Daftar dalam sel tidak terpisah per baris**.
- **Perbaikan** (`js/editor.js`):
  - `blokTerpilih()` → kalau kursor di `TD`/`TH` kembalikan **sel itu** (bukan tabel).
  - `bikinDaftar()` → bila di dalam sel: pecah isi sel per `<br>` jadi daftar di dalam sel.
  - `matikanDaftar()` → bila di dalam sel: ubah `li` jadi `<div>` yang ditaruh
    **sebelum** wadah daftar (supaya tidak ikut terhapus) + bersihkan wadah kosong.
  - Helper baru `taruhKursorAkhir(el)`.
- **Uji baru ditambahkan** ke `tools/uji-toolbar.js`: C8–C11 (dot/nomor/icon/toggle
  di dalam sel tabel). Debug: seluruh 53 uji **lolos**, tabel tetap utuh,
  isi sel tidak hilang, Enter di daftar dalam sel tetap di dalam sel.

## 2026-09-13 — DEBUG MENYELURUH toolbar (49 uji) + 2 perbaikan

- **Backup dulu** ke `backups/debug-20260913-173749/`.
- Permintaan user: AI **debug dulu semua fungsi toolbar** sebelum user tes.
- **Alat uji baru**: `tools/uji-toolbar.js` — 49 pengujian otomatis
  (format blok, bold/italic, daftar, warna, icon, tabel, hide/show, markup cepat,
  auto-save, scroll, menu File, cari, titik status, tampilan).
  Cara pakai: buka ANodes → F12 → Console → tempel isi file → Enter.
- **Perbaikan 1 — `Enter` menghasilkan `<div>`**: saat menekan Enter di akhir
  judul/daftar, browser membuat `<div>`; kini dirapikan jadi `<p>` saat simpan
  (`rapikanHtml()` — hanya `<div>` tingkat atas, isi tabel/list tidak disentuh)
  supaya hasil simpanan seragam dengan Word.
- **Perbaikan 2 — format hilang saat ganti jenis daftar**: dulu `li.textContent = ...`
  membuang tebal/miring/warna di dalam item. Kini diganti `kupasIconNode(li)` yang
  hanya membuang icon/bullet di awal, **format dalam item tetap utuh**.
- Debug: 49 uji otomatis **semua lolos** (termasuk 7 uji daftar, 5 uji tabel,
  5 markup cepat, 6 menu File, scroll, auto-save) + uji keyboard nyata
  (ketik+Enter, Enter di H1/list/icon-list, ketik di sel tabel, bold sebagian kata,
  Tab, paste) — tanpa error konsol.

## 2026-09-13 — Perbaikan: daftar icon tidak bisa diseleksi 3 baris

- **Backup dulu** ke `backups/iconlist-20260913-173508/`.
- Keluhan user: pada daftar **icon**, teks hanya bisa diseleksi 1 baris —
  tidak bisa diseleksi 3 baris sekaligus (padahal di dot bisa).
- **Akar masalah**: `list-style: none` membuat **browser tidak bisa merentangkan
  seleksi** melewati batas item (perilaku Chromium). Terbukti: drag pada dot
  ambil 3 baris, tapi pada icon terjebak 1 item.
- **Perbaikan** (`css/app.css`): buang `list-style: none` — kembali pakai
  `list-style: disc`, lalu **bullet asli disembunyikan** lewat
  `li::marker { color: transparent }`, dan icon ditampilkan oleh
  `li::before { content: attr(data-ico) }` di kolom penanda yang sama
  (`pointer-events: none` supaya tidak mengganggu seleksi).
- Debug: uji browser drag 3 baris pada daftar icon → **3 li terseleksi**;
  ganti ke nomor → tetap 3 li; posisi teks dot & icon **sama (left 48px)**.

## 2026-09-13 — Perbaikan daftar: ganti jenis langsung + format icon disamakan

- **Backup dulu** ke `backups/list-20260913-172727/`.
- Keluhan user: (a) ganti dot→nomor harus hapus dot dulu; (b) format icon tidak
  sama dengan dot.
- **Akar masalah**: `daftarFmt` memakai `execCommand('insertUnorderedList'/'insertOrderedList')
  yang **hanya toggle on/off** — tidak bisa ganti jenis.
- **Perbaikan** (`js/editor.js`): daftar kini diurus **manipulasi DOM sendiri**.
  - Fungsi baru: `liTerpilih()`, `blokTerpilih()`, `listDariLi()`, `jenisLi()`,
    `gantiTag()`, `setJenisWadah()`, `bikinDaftar()`, `matikanDaftar()`, `kupasIcon()`.
  - **Ganti jenis LANGSUNG**: dot→nomor→icon (dan sebaliknya) tanpa perlu hapus dulu;
    `UL`↔`OL` ditukar tag-nya, isi tetap.
  - **Toggle OFF**: klik jenis yang sama lagi → daftar jadi paragraf biasa
    (urutan baris tetap, tidak terbalik).
  - **Format icon disamakan dengan dot**: icon dipasang lewat CSS `::before`
    `attr(data-ico)` di kolom penanda — teks tetap sejajar (terbukti sama 48px).
  - `data-ico` dibersihkan saat ganti ke dot/nomor.
- CSS (`css/app.css`): `#editor ul.anodes-ico` (`list-style:none`, `::before` icon),
  `li` margin, padding list dirapikan.
- Debug: `node --check` lolos; uji browser urutan penuh DOT→NOMOR→ICON→NOMOR→OFF
  semuanya benar (teks tidak hilang, urutan tetap, `ol/ul/data-ico` bersih),
  posisi teks dot & icon sama (left 48px).

## 2026-09-13 — Perbaikan penting: catatan panjang tidak bisa di-scroll

- **Backup dulu** ke `backups/scroll-20260913-171930/`.
- Keluhan user: catatan panjang ke bawah **tidak bisa digulir**.
- **Akar masalah**: `.main` tidak punya `min-height: 0`, sehingga `.area` & `#editor`
  ikut memanjang melebihi layar (editor jadi 1977px) — isi terpotong & tak bisa scroll.
- **Perbaikan** (`css/app.css`):
  - `.main` → tambah `min-height: 0`.
  - `.area` → `flex: 1 1 auto; min-height: 0; overflow: hidden`.
  - `#editor` → `flex: 1 1 auto; min-height: 0; overflow-y: auto;
    -webkit-overflow-scrolling: touch` (enak di HP).
  - `css/base.css` `.app` → tambah `max-height: 100vh`.
- Debug: uji browser 60 baris → editor tinggi 442px, `scrollHeight` 1977,
  bisa digulir (scrollTop 500 berhasil); panel daftar panjang juga bisa digulir;
  status bawah tetap tampil; di layar 346px toolbar turun jadi 2 baris (wajar).

## 2026-09-13 — Revisi: tombol <> Row dihapus

- **Backup dulu** ke `backups/row-20260913-171611/`.
- Permintaan user: `<> Row` (lihat kode markdown) dihapus — hanya untuk dilihat,
  dan user awam jarang membutuhkannya.
- Yang dihapus: tombol `#btn-row`, modal `#modal-kode`, fungsi `lihatKode()`,
  `inlineKeMd()`, `htmlKeMarkdown()`, dan CSS `#kode-isi`.
- Toolbar kini 9 tombol: `Size · List · B · I · Tabel · Stabilo · Huruf · ✕ · Icon`.
- Debug: `node --check` lolos; uji browser — tidak ada `btn-row`/`modal-kode`,
  auto-save jalan, tombol toolbar benar, list & tabel masih berfungsi,
  **File → Open** jalan, tanpa error konsol.

## 2026-09-13 — Revisi: tombol ☰ Catatan dihapus (cukup File → Open)

- **Backup dulu** ke `backups/btncatatan-20260913-171023/`.
- Permintaan user: tombol **☰ Catatan** tidak perlu, karena sudah ada **File → 📂 Open**.
- Belum ada catatan yang dihapus: tombol `#btn-buka-daftar` + CSS `.buka-daftar` dihapus.
- Membuka daftar kini hanya lewat **File ▼ → 📂 Open** (atau tombol `▲` untuk menutup).
- Debug: `node --check` lolos; uji browser — start tersembunyi tanpa tombol,
  **File → Open** tampil, `▲` menyembunyikan lagi, reload tetap tersembunyi
  + isi catatan terakhir, tanpa error konsol.

## 2026-09-13 — Revisi: daftar catatan tersembunyi saat buka + auto-save lebih kuat

- **Backup dulu** ke `backups/open-20260913-170754/`.
- Permintaan user: daftar catatan **tidak tampil** saat aplikasi dibuka;
  hanya muncul bila klik **File ▼ → 📂 Open**. Saat start langsung ke **pekerjaan terakhir**.
- `muatTampilan()`: panel daftar **selalu** disembunyikan saat start
  (status `anodes-daftar` tidak lagi dipakai untuk membuka otomatis).
- **Auto-save lebih kuat**: simpan juga saat pindah tab / aplikasi ke belakang
  (`visibilitychange`) — berguna di HP supaya ketikan tidak hilang kalau user lupa.
- Kalau belum ada catatan sama sekali, ANodes membuat 1 catatan kosong otomatis
  supaya bisa langsung menulis.
- Debug: `node --check` lolos; uji browser — start tanpa daftar (tombol `☰ Catatan`
  muncul), ketik → reload → isi tetap ada, klik **File → Open** → daftar tampil,
  tanpa error konsol.

## 2026-09-13 — Revisi: menu File berisi Open/New/Save/Del/Impor/Ekspor

- **Backup dulu** ke `backups/filemenu-20260913-170330/`.
- Permintaan user: "buka daftar" dimasukkan ke menu **File** saja.
- **Menu `File ▼`** sekarang berisi 6 item:
  **📂 Open · ＋ New · 💾 Save · 🗑 Del · ⤒ Impor · ⤓ Ekspor**.
- **📂 Open** = menampilkan kembali daftar catatan (kalau disembunyikan).
- Tombol **☰ Daftar** berganti label jadi **☰ Catatan** (tetap muncul saat panel disembunyikan).
- Debug: `node --check` lolos; uji browser — menu File berisi 6 item,
  sembunyikan daftar → klik **Open** → daftar tampil lagi, tanpa error konsol.

## 2026-09-13 — Revisi: bar info 1 baris + panel lebih rapi

- **Backup dulu** ke `backups/bar-20260913-165827/`.
- Permintaan user: bar info cukup satu baris `Judul · Kategori: [▾] · n kata`,
  dan panel catatan cukup tombol **▲** saja.
- Panel catatan: tombol **＋ Kategori** dihapus (dulu kembar dengan opsi di dropdown).
  Kini panel kepala = **Catatan (n)** + **▲** saja.
- Bar info: diberi label **"Kategori:"**, dibuat **satu baris** (nama panjang otomatis
  dipotong dengan `…`, tidak meluber).
- Buat kategori tetap bisa dari dropdown info: pilih **`＋ Kategori baru...`**.
- Debug: `node --check` lolos; uji browser — bar info 1 baris (tidak meluber),
  buat kategori "Belajar" dari dropdown berhasil, tanpa error konsol.

## 2026-09-13 — Revisi: bar atas jadi [▦] [File ▼] [Cari ▼] (rapi & hemat)

- **Backup dulu** ke `backups/tahap3-20260913-164857/`.
- Permintaan user: bar atas jadi `[▦] [File] [Cari]` supaya rapi & tidak mubazir.
- **Menu `File ▼`** berisi: **＋ Baru · 💾 Simpan · 🗑 Hapus · ⤒ Impor · ⤓ Ekspor**.
- **Menu `Cari ▼`** berisi: **kotak cari + dropdown kategori** (dulu terpisah di panel).
- Panel catatan **dibersihkan**: `+ Baru` mubazir dihapus, baris cari dihapus.
  Sisa: judul **Catatan (n)** + tombol **＋ Kategori** + tombol **▲** (sembunyikan daftar).
- Tombol **＋ Kategori** dibuat jelas di panel (dulu hanya lewat dropdown tersembunyi).
- Jumlah catatan tampil di judul panel: `(2)` atau `(1/2)` saat disaring.
- Toolbar dirapatkan → kini **muat 1 baris** (ruang tulis lebih luas).
- Debug: `node --check` lolos; uji browser — menu File & Cari buka/tutup benar,
  semua aksi (Baru/Simpan/Hapus/Impor/Ekspor) jalan, cari menyaring (`1/2`),
  kategori baru dibuat, toolbar 1 baris, tanpa error konsol.

## 2026-09-13 — Tahap 3 selesai: toolbar lengkap + hemat ruang + tabel + warna + icon

- **Backup dulu** ke `backups/tahap2-20260913-162109/`.
- **Toolbar lengkap** seperti MarkDown, tapi **hemat ruang** (diminta user):
  - `[Size ▼]` → H1 H2 H3 ¶
  - `[List ▼]` → • Titik / 1. Nomor / ✅ Icon List
  - `B` `I`
  - `[▦ ▼]` → Sisip tabel / ✎ Edit tabel
  - `[▬ ▼]` stabilo (5 warna) · `[A ▼]` warna huruf (6 warna) · `✕` hapus warna
  - `[✅ ▼]` icon (28 buah) · `<> Row`
- **Hide/unhide**: tombol `▦` di kepala menyembunyikan toolbar (ruang tulis luas);
  tombol `✕` di panel catatan menyembunyikan daftar (muncul `☰ Daftar`). Status diingat.
- **Tabel**: sisip 3×3 + **edit tabel ala Excel** (modal tambah/hapus baris-kolom).
- **Stabilo + warna huruf + ✕** (bersihkan) bekerja pada blok terpilih.
- **Icon 28** + **bullet pakai icon** (`✅ List`), icon lama dikupas agar tidak menumpuk.
- **`<> Row`** = modal kode markdown (`#`, `-`, `|`, `**`, `==`) + tombol Copy.
  (Percobaan `window.open` diblokir browser saat uji → diganti modal.)
- **Markup ketik cepat**: `# `, `## `, `### `, `- `, `1. ` otomatis jadi format.
- Paste dibersihkan jadi teks biasa.
- Gaya: kepala hitam **dibiarkan** seperti semula (permintaan user); toolbar jadi baris
  tombol kecil; submenu melayang; modal tabel & modal kode.
- Debug: `node --check` lolos; uji browser — submenu Size/List/Icon buka & ganti label;
  tabel sisip + modal edit (+kolom) berhasil; stabilo/warna/✕ benar; hide toolbar & daftar
  berhasil; `<> Row` menghasilkan markdown tepat; markup `# ` & `1. ` berhasil.

## 2026-09-13 — Tahap 2 selesai: simpan permanen + auto-save + kategori + ekspor/impor

- **Backup dulu** ke `backups/tahap1-20260913-161218/` (index.html, css/, js/).
- `js/store.js` ditulis ulang: data kini **permanen di `localStorage`**
  (kunci `anodes-catatan-v1`), jalan juga di **Chrome Android (HP)** lewat `file://`.
  Bentuk: `{ kategori, catatan[{id,judul,isi,kategori,waktu}], aktifId }`.
- **Auto-save**: tiap ketik → debounce 700 ms → tersimpan sendiri; titik kepala
  kuning = belum, hijau = sudah; simpan juga saat halaman ditutup (`beforeunload`).
- **Kategori catatan** (tiruan \"folder\"): dropdown filter + dropdown kategori di
  info editor + opsi `＋ Kategori baru...`; catatan bisa dipindah kategori.
- **Pencarian** catatan (judul + isi) di panel atas.
- **Toast** \"Tersimpan jam:menit:detik\" (muncul ±2,2 dtk).
- **Ekspor/Impor** `.json` (cadangan + pindah catatan PC ↔ HP); impor menggabung
  & membuang id bentrok.
- Judul catatan kini dari **teks baris pertama** (fungsi `teksPertama` rekursif),
  tidak lagi menggabung seluruh isi.
- Gaya: panel daftar `max-height: 40vh`; dropdown kategori + tombol ekspor/impor
  ditambahkan (`css/app.css`).
- Debug: `node --check` dua JS lolos; uji browser — ketik → auto-save terverifikasi
  di localStorage; judul benar; pencarian menyaring (1 hasil); impor berkas uji
  berhasil (4 catatan, kategori \"Ujian\"); reload tetap tersimpan.

## 2026-09-13 — Revisi: UI selalu gaya HP (ukuran sama di PC & HP)

- Keluhan/minta user: ukuran UI hendaklah sama seperti di smartphone, bukan layout lebar PC.
- Tambah wadah `.app` di `index.html` + `css/base.css`: lebar tetap **480px**
  (`--lebar-app`), dipusatkan di tengah, latar luar abu `#d9dde2`, ada bayangan.
- `css/app.css`: susunan diubah **selalu** pakai layout HP — panel daftar catatan
  **di atas** (bukan di samping), editor di bawah. Ukuran huruf & tombol sama.
- Bila layar ≤ 480px (HP asli) wadah otomatis penuh layar.
- Perbaiki cuplikan teks yang menyambung (mis. "ANodesTulis") — kini diberi
  spasi antar blok (`<p>`, `<h1>`, `<li>`, `<br>`).
- Debug: dibuka di browser lebar PC → tampil kolom HP di tengah, benar; daftar,
  editor, toolbar, status tampil normal.

## 2026-09-13 — Tahap 1 selesai: kerangka + tampilan note gaya markdown

- Buat struktur folder ANodes: `css/`, `js/`, `backups/`.
- Buat `index.html`: satu halaman, kepala hitam (`#1e2733`) + panel kiri daftar
  catatan + panel tengah editor, responsif (layar ≤700px panel kiri ke atas).
- Buat `css/base.css`: variabel warna (kepala hitam, isi putih, aksen) + reset dasar.
- Buat `css/app.css`: gaya kepala, panel kiri, toolbar, area tulis, status bawah.
- Buat `js/store.js`: data catatan (2 contoh awal) — **masih di memori**, siap ganti
  localStorage di Tahap 2.
- Buat `js/editor.js`: render daftar, buka/simpan/hapus/baru, toolbar
  (H1 H2 H3 ¶ • List 1. List B I), hitung kata, status titik simpan.
- Buat `start.bat`: buka `index.html` di browser (tanpa server).
- Buat dokumen wajib: `agents.md`, `prompt.md`, `CHANGELOG.md`, `panduan.md`.
- Debug: cek sintaks JS (`node --check`) lolos, cek id elemen HTML cocok dengan JS.

## 2026-09-13 — Revisi rencana (sebelum pembangunan)

- ❌ Versi Android **dibatalkan** — tidak ada folder `android/`, tidak ada build.
- ✅ Aplikasi **langsung di folder `C:\data\Anodes`** — cukup buka `index.html`.
- ✅ Mulai dari **note/editor gaya markdown** dulu, dikembangkan bertahap.
- ⏸️ Pindah folder `bible` **ditunda** — menunggu arahan user.