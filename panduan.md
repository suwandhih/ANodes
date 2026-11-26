# 📘 Panduan Pakai ANodes

## K106 — ZIP impor kode sumber (dikoreksi)

ZIP artifacts/ANodes-server-html-20261124.zip kini hanya berisi kode sumber aplikasi: index.html, css/, js/, dan plugin tanpa data runtime hasil generasi. Ini menyingkirkan HTML satu berkas 40,9 MB yang ditolak oleh safe discovery; ukuran ZIP sumbernya 415.436 byte. ZIP dapat dipakai untuk impor/peninjauan sumber, tetapi **bukan aplikasi lengkap yang langsung berjalan**: data plugin perlu dibangun kembali sebelum seluruh fitur aktif. APK/native, lab, tools, dan backup tidak disertakan.

> **Sinkron Android:** jika jaringan lambat, proses sinkron berjalan tanpa menunggu layar. Catatan tetap disimpan di perangkat; perubahan belum tersedia di perangkat lain sampai sinkron berhasil. Hasil penggunaan pada jaringan 4G masih perlu diuji pada perangkat.

> Panduan singkat, bahasa sederhana. Untuk Anda yang baru membuka ANodes.
>
> 💡 **Bahasa di panduan ini memakai sapaan “Anda”** — supaya enak dibaca siapa saja.

---

## 0. 📍 Panduan mana untuk halaman mana (peta cepat)

ANodes punya **beberapa halaman**, dan **tiap halaman punya caranya sendiri**.
Cari halaman Anda di tabel ini, lalu langsung buka bagiannya:

| Anda sedang berada di… | Panduan yang dibaca | Bagian |
|---|---|---|
| 📝 **Catatan (note)** — tempat menulis | semua fitur & menu catatan | **1–12** · `3b` File · `3c` cari · **4** toolbar · `4b` kirim ayat ke catatan |
| 📖 **Alkitab** — halaman baca | cara baca · ganti kitab/pasal · 3 cara cari · kirim ayat | `13d` · `13e` · `13f` · `4b` · `4c` · **menu 2 baris** *(di bagian 5c)* · 📍 **kata tempat di ayat** ⇒ **`13l`** |
| 🗺️ **Peta Alkitab** | melihat letak tempat · klik nama ⇒ wilayah digaris + keterangan + ayatnya · **peta tetap terlihat saat daftar digulir** | **`13k`** · 📍 **kata tempat di ayat** ⇒ **`13l`** |
| 📖 **Sejarah Alkitab & Sejarah Kitab** | cara membaca prakata & sejarah tiap kitab · 🔍 cari berwarna | **`3f-3`** |
| 🕒 **Linimasa Sejarah** | garis waktu **450 peristiwa** berurutan menurut tahun · 9 zaman · cari · chip ayat bisa diklik | **`13u`** |
| 🌿 **Ayat Terkait** | kaitan antar ayat · pratinjau · `✓ pilih` · mode grup · kirim ke catatan | **`13j`** |
| 📚 **Kamus Istilah** | kata bergaris putus · kolom berlevel · catatan tambahan · `[↗ full]` | **`3f`** |
| 🖊 **Penguat** | penguat di catatan (K45 i) · di halaman baca (K54) · Pembaca Penguat (K47) | **`3f-2`** |
| 🔤 **Interlinear** (bahasa asli + kode Strong) | tabel kata Yunani/Ibrani + nomor Strong · **PB Kisah 26 s/d Wahyu** (bentuk Yunani + cara baca + arti · **100 %** kata isi terjelaskan) | **`13n`** · **`13n-b`** |
| 🖊 **Penjelasan bahasa asli** (Yunani & Ibrani, tanpa angka) | arti mengalir dalam bahasa Indonesia · ✡ kata serapan | **`13o`** |
| 🔖 **Bookmark Ayat** | menandai ayat · daftar bookmark · edit/hapus · copy ke catatan | **`13m`** |
| 🗓️ **Bacaan Alkitab 1 Tahun** | **1 tahun baca selesai seluruh Alkitab** · 3 rencana · kalender 365 hari · tandai sudah dibaca · 🔥 berturut-turut | **`13p`** |
| 🔀 **Paralel Terjemahan** | **TB ⇄ AYT** berdampingan per ayat · tombol 🔀 di navbar Alkitab | **`13q`** |
| 📖 **Judul Perikop** | judul bagian di atas ayatnya · nyala/mati lewat halaman keterangan plugin (❌ tanpa tombol navbar) | **`13r`** |
| 🗂️ **Berkas Tersimpan** | daftar rantai 🌿 Ayat Terkait yang disimpan · buka · kirim ke catatan · hapus | **`13h`** |
| 🧩 **Gudang Plugin** | memasang / melepas plugin | **`13`** |
| ☁️ **Sinkron PC ⇄ HP** | menyamakan catatan di PC & HP | **`10b`** |
| ❓ **Bantuan di dalam aplikasi** | satu tombol `[?]` di kepala, isinya **menyesuaikan halaman yang sedang dibuka** | **`13s`** |
| 👤 **Pemisahan data per email** | email ditanya sekali · data tiap orang terpisah · ganti email | **`13t`** |

> 💡 **Tombol `[?]` (bantuan) — sudah ada sejak 3 Nov 2026.** Tekan tombol **❓ Bantuan** di kepala
> aplikasi; isinya **menyesuaikan halaman yang sedang dibuka** — jadi Anda tidak perlu mencari-cari
> di panduan ini. Rincian: bagian **`13s`**.

---

## 1. Cara membuka

- Dobel klik **`start.bat`**, **atau**
- Buka langsung file **`index.html`** (klik kanan → Open with → browser).
- Tidak perlu internet, tidak perlu install apa pun.

> 💡 Saat dibuka, ANodes **langsung menampilkan catatan terakhir** yang Anda kerjakan.
> Daftar catatan **tidak langsung tampil** — buka lewat **File ▼ → 📂 Open**
> bila perlu pindah catatan.

## 1b. 📱 Menu di HP — 3 tingkat (baru 28 Okt 2026)

Di **HP / tablet** menu sekarang **3 tingkat** dan tombolnya **besar + bertulisan**,
supaya mudah disentuh dan tidak perlu menebak arti ikon.

```
┌──────────────────────────────────────────────┐
│ TINGKAT 1 · kepala                           │
│  ANodes  ●                                   │
│  [⚙ Setelan] [🧩 Plugin] [📂 File]              │
│  [📂 File] [🔍 Cari]  [🗂️ Berkas]            │
├──────────────────────────────────────────────┤
│ TINGKAT 2 · bar info                         │
│  Judul catatan · Kategori ▾ · 6 kata · [🔗]  │
├──────────────────────────────────────────────┤
│ TINGKAT 3 · toolbar tulis (2 baris)          │
│  [↶][↷][¶][•][B][I]                          │
│  [▦][▬][A][✕][✅][🧩]                        │
└──────────────────────────────────────────────┘
```

| Hal | Sebelum | Sesudah |
|---|---|---|
| Tinggi tombol | **31 px** (susah disentuh) | **44 px** |
| Tulisan tombol | ikon saja | **ada tulisan** (Setelan · Plugin · File · Cari · Berkas · Bantuan) |
| Toolbar tulis | 1 baris kecil | **2 baris**, tombol 40 px |
| Kepala di HP ber-kamera | **menempel di kamera** | **turun** — ada ruang aman di atas |
| Judul catatan | terpotong jadi “Catat…” | **terbaca utuh** (bar info 2 baris) |

> 💡 **Di PC tidak berubah** — tetap hemat seperti sebelumnya (tombol kecil, 1 baris).
> Menu besar hanya muncul di layar sentuh.

> ✅ **Sudah diuji di Samsung Z Fold 3 (28 Okt 2026)** — kepala tidak lagi menempel di kamera
> dan tombolnya mudah disentuh.
>
> ⚠️ **Kalau di HP lain kepala masih menempel di kamera:** tutup aplikasi lalu buka lagi
> (ruang aman dibaca saat aplikasi dibuka). Kalau masih, laporkan — berarti HP itu
> tidak melaporkan ruang amannya dan perlu penyesuaian.

### 1b-b. 🐞 Perbaikan 6 Nov 2026 — menu HP yang terpotong (K102)

> 💬 **Laporan:** di **Z Flip 3** menu atas **terpotong**; di **Note 8** tombol **🔗 ON/OFF
> tidak terlihat**; di **PC terlihat semua**.

**Sebabnya (diukur di APK nyata, bukan diduga):**

| # | Sebab | Akibat |
|---|---|---|
| 1 | HP melaporkan layarnya **bukan layar sentuh** (`pointer: coarse` = salah) | menu besar **tidak pernah aktif** di APK — tombol kembali kecil & tanpa tulisan |
| 2 | Bar info **boleh menyusut** | bar info diperas jadi **20,6 px** padahal isinya **29 px** ⇒ **Kategori & 🔗 ON/OFF terpotong** |
| 3 | Toolbar tulis juga **boleh menyusut** | tombol alat tulis bisa terpotong |

**Yang diperbaiki:**

| # | Perbaikan |
|---|---|
| 1 | Menu besar sekarang **selalu aktif di HP** — tidak lagi bergantung pada laporan “layar sentuh” dari HP |
| 2 | Bar info & toolbar **tidak boleh menyusut** ⇒ **Kategori · jumlah kata · 🔗 ON/OFF selalu terlihat** |
| 3 | Penanda versi halaman naik ke **`v6Nov-a`** |

**Hasil terukur di APK (emulator Android 14):**

| Hal | Sebelum | Sesudah |
|---|---|---|
| Tinggi bar info | **20,6 px** (terpotong) | ✅ **54 px** |
| Kategori & 🔗 ON/OFF | ❌ **tidak terlihat** | ✅ **terlihat** (30 px) |
| Tinggi kepala | 47 px | ✅ **70 px** |
| Tinggi tombol kepala | 29 px | ✅ **44 px** |
| Tulisan tombol | ❌ tidak ada | ✅ **ada** |
| Toolbar tulis | 34 px (1 baris) | ✅ **89 px** (2 baris) |
| Ruang tulis | — | ✅ **513 px** |

> ✅ **Uji:** **18 uji K102 · 0 gagal · 4,3 detik** (dan **21 uji · 0 gagal** pada layar 344 px).
> 📦 **APK baru:** `versionCode 29` · `2.0.0-webview-k102` · aset **byte-identik** dengan sumber.
> 📸 Bukti: `artifacts/k102-apk-tata-letak.png` · `artifacts/k102-apk-menu-file.png`.
>
> ⚠️ **Kalau di HP Bapak masih terpotong:** pastikan yang dipasang **APK WebView**
> (`com.anodes.app.webview`), ❌ bukan APK native lama (`com.anodes.app`). Dua APK itu
> **berbeda** dan yang lama tidak punya perbaikan ini.

---

## 2. Bentuk tampilannya

ANodes selalu tampil **seperti di HP** — kolom sempit di tengah layar.
Jadi tampilannya **sama** entah dibuka di PC atau di HP.

```
┌───────────────────────────────┐
│  A ANodes Tahap 2 ●  Hapus    │  ← kepala hitam
│              +Baru   Simpan   │
├───────────────────────────────┤
│  CATATAN           [+ Baru]   │
│  [cari...]        [Semua ▼]   │  ← cari + saring kategori
│  ● Catatan Pertama        ✕   │
│  ● Rencana                ✕   │
│  [⤓ Ekspor]    [⤒ Impor]      │  ← cadangan
├───────────────────────────────┤
│  H1 H2 H3 ¶  • List 1. B  I   │  ← toolbar
├───────────────────────────────┤
│                               │
│  Tulis catatan di sini...     │  ← area tulis (putih)
│                               │
├───────────────────────────────┤
│  Catatan Pertama   ANodes·T2  │  ← status bawah
└───────────────────────────────┘
```

## 3. Tombol di kepala (atas)

Bar atas ANodes hanya **3 tombol** supaya rapi:

| Tombol | Fungsi |
|--------|--------|
| **⚙ Setelan** | Ukuran huruf, jenis huruf, kecerahan, pintasan |
| **🧩 Plugin** | Gudang plugin (pasang / lepas) |
| **File ▼** | Menu berkas: **Open · New · Save · Del · Impor… · Ekspor .md / .txt / .pdf · Cadangan .json** |
| **🔍 Cari** | **Cari kata di catatan yang sedang dibuka** (sama seperti `Ctrl+F`) |
| **🗂️ Berkas** | Daftar rantai 🌿 Ayat Terkait yang tersimpan |
| **❓ Bantuan** | Panduan singkat sesuai halaman yang sedang dibuka |
| **● titik** | 🟡 kuning = belum disimpan · 🟢 hijau = sudah disimpan |

### 3a-b. Toolbar tulis **selalu tampil** (6 Nov 2026)

Toolbar tulis (baris tombol **H1 · B · I · ▬ · ✅** dan seterusnya) sekarang
**selalu tampil** di atas tulisan — **tidak bisa disembunyikan lagi**.

> 💡 **Kenapa diubah?** Dulu toolbar bisa disembunyikan lewat tombol **▦ Tulis** di kepala,
> dan pilihan itu **diingat**. Akibatnya di sebagian HP toolbar **hilang** dan sulit
> ditemukan lagi. Sekarang tombol itu **dihapus** — jadi toolbar **tidak mungkin hilang**.

| Hal | Sekarang |
|---|---|
| Toolbar tulis | ✅ **selalu tampil** |
| Tombol **▦ Tulis** di kepala | ❌ **sudah dihapus** |
| Strip kuning **[Tampilkan]** | ❌ **tidak ada lagi** (tidak diperlukan) |
| Bar paket ayat | muncul **di atas** toolbar — **keduanya tampil bersamaan** |

> ⚠️ **Kalau di HP toolbar tetap tidak terlihat:** pastikan yang dipasang **APK WebView**
> (`com.anodes.app.webview`) versi **terbaru** (`versionCode 31` ke atas), ❌ bukan APK native
> lama (`com.anodes.app`).

## 3b. Menu File

| Item | Guna |
|------|------|
| **📂 Open** | **Menampilkan daftar catatan** (kalau tadi disembunyikan) |
| **＋ New** | Membuat catatan baru |
| **💾 Save** | Menyimpan catatan (bisa juga `Ctrl+S`) |
| **🗑 Del** | Menghapus catatan yang sedang dibuka |
| **⤒ Impor…** | Membuka berkas **`.md` / `.txt`** → masuk ke catatan yang sedang dibuka · **`.json`** = cadangan |
| **⤓ Ekspor .md** | Mengunduh catatan ini sebagai berkas **Markdown** |
| **⤓ Ekspor .txt** | Mengunduh catatan ini sebagai **teks biasa** |
| **⤓ Ekspor .pdf** | Membuat **PDF** lewat jendela cetak (pilih “Simpan sebagai PDF”) |
| **⤓ Cadangan .json** | Mengunduh **semua** catatan jadi 1 berkas cadangan |

## 3c. Cari di dalam catatan (baru 15 Sep 2026)

Klik **🔍 Cari** di kepala (atau tekan **Ctrl+F**) → muncul **bilah cari** di bawah kepala:

```
[ 🔍 cari kata di catatan ini… ]  [◀] [▶]  [3/17]  [✕]
```

| Cara | Hasil |
|------|-------|
| ketik kata + **Enter** | cari · tekan Enter lagi = **temuan berikutnya** |
| **Shift+Enter** atau **◀** | temuan **sebelumnya** |
| **▶** | temuan **berikutnya** |
| angka `3/17` | temuan ke-3 dari 17 |
| **Esc** atau **✕** | tutup pencarian (tulisan kembali bersih) |

- Setiap temuan diberi **latar kuning**; yang sedang dituju **lebih tegas**.
- 🟢 **Catatan tetap aman** — tanda kuning **tidak ikut tersimpan**.
- Pencarian **antar-catatan** (semua judul/isi) sekarang ada di **panel daftar**
  (buka lewat **File → 📂 Open**) — kotak cari + pilihan **Kategori**.

## 3d. Panel daftar catatan

| Bagian | Guna |
|--------|------|
| **Catatan (n)** | Jumlah catatan yang tampil |
| **▲** | Menyembunyikan daftar (buka lagi lewat **File ▼ → 📂 Open**) |
| **Klik baris catatan** | Membuka catatan itu |
| **✕ pada catatan** | Menghapus catatan itu |

## 3e. Bar info di atas editor (satu baris)

```
Catatan Pertama  ·  Kategori: [Umum ▾]  ·  27 kata
```

| Bagian | Arti |
|--------|------|
| **Catatan Pertama** | Judul catatan yang sedang dibuka |
| **Kategori: [Umum ▾]** | Kategori catatan ini — **di sini tempat membuat/ganti kategori** |
| **27 kata** | Jumlah kata catatan ini |

> **Membuat kategori baru:** buka dropdown itu → pilih **「＋ Kategori baru...」** → ketik nama.

## 3e-b. 🧹 Tempel naskah dari luar → langsung rapi (baru 18 Sep 2026)

Kalau Anda **menyalin naskah dari luar** — dari **AI (mis. Gemini)** atau **bahan pelajaran
Alkitab** dari halaman web — lalu **menempel** (`Ctrl+V`) di ANodes, naskah itu **dirapikan
sendiri**. Contohnya naskah pelajaran seperti ini:

```text
SEBELUM DITEMPEL (bentuk mentah)          SESUDAH DITEMPEL DI ANODES
1. MENGENAL SIAPAKAH YESUS                 MENGENAL SIAPAKAH YESUS   ← judul bab
**SASARAN**                                ▎SASARAN                 ← judul bagian
Agar anggota KTBK mengenal Yesus …         Agar anggota KTBK mengenal Yesus …
**TEKS**                                    ▎TEKS
[1Yo 1:1-4](https://alkitab.sabda…)        1Yo 1:1-4                ← nama ayat (rapi)
**OBSERVASI**                               ▎OBSERVASI
- Fakta apakah yang dikatakan …            • Fakta apakah yang dikatakan …
```

| Yang dirapikan | Menjadi |
|---|---|
| baris `**SASARAN**` · `**TEKS**` · `**OBSERVASI**` berdiri sendiri | **judul bagian** (berlatar hijau muda) |
| `1. MENGENAL SIAPAKAH YESUS` | **judul bab** |
| `**tebal**` | tulisan **tebal** biasa (bintang-bintangnya hilang) |
| `[1Yohanes 1:3](https://alkitab…)` | **`1Yo 1:3`** — nama ayat rapi (tautan panjangnya diringkas) |
| daftar `-` / `1.` | **daftar sungguhan** (bulatan / nomor) |
| baris `__________` | **garis untuk menulis** (maksimal 3 baris, tidak memakan tempat) |

**Catatan penting:**
- Kalau yang Anda tempel **cuma kalimat pendek biasa**, isinya **TIDAK diubah** — masuk apa adanya.
- **Salah rasa?** Tekan **↶** (atau **Ctrl+Z**) → kembali ke bentuk mentahnya.
- **Yang diolah hanya hasil tempelan di ANodes.** Halaman web sumbernya **tidak diapa-apakan**.
- Semua penanda rapi itu **tidak ikut tersimpan** — isi catatan tetap teks biasa.

## 3f. 📚 Kamus Istilah (baru 18 Sep 2026 — plugin · diperbarui 30 Okt 2026)
**Apa ini:** **nama orang** (Yesus, Musa, Daud), **nama tempat** (Yerusalem, Mesir, Babel),
**istilah khas Alkitab** (Korban, Mezbah, Tebusan, Sabat), dan **kata ganti** (Aku, Dia, Engkau)
di dalam tulisan Anda diberi **garis bawah putus-putus**. Kata itu **diklik** → muncul
**keterangannya**. Di dalam keterangan itu ada **rujukan ayat** dan **istilah lain** — keduanya
**bisa diklik juga**, jadi bisa ditelusuri **berantai**.

```text
① CATATAN   … ia mempersembahkan KORBAN di MEZBAH itu …
                                 ┆┈┈┈┈┈┆   ┆┈┈┈┈┆   ← garis putus-putus
                                    │ diklik
                                    ▼
② HALAMAN KAMUS 📚 (sebesar catatan — MENIMPA catatan)
   [🏠] [↩]  📚 Korban              [📋 Daftar] [🔍 Cari]
   ────────────────────────────────────────────────────
   1️⃣ KETERANGAN  “Korban ialah persembahan … (Kej 4:4) …”
   2️⃣ 📚 istilah lain:  [Perjanjian] [Taurat] [Kristen]
   3️⃣ 📖 AYATNYA (4)
       [Kej 4:4] [Kej 8:20] [Kel 20:24] [Im 1:2]
       ┌──────────────────────────────────────────┐
       │ 4  Habel juga mempersembahkan korban …   │ ← SATU kolom
       └──────────────────────────────────────────┘   (klik chip lain → isi berganti)
   [🏠 kembali ke catatan]
                                    │ 🏠 ditekan
                                    ▼
③ CATATAN lagi — kata "KORBAN" tadi DISOROT KUNING ±4 detik
```

| Tombol | Fungsi |
|--------|--------|
| **🏠** | Kembali ke catatan — tepat di **baris & kata** yang tadi diklik (kata disorot kuning) |
| **↩** | Kembali ke **istilah sebelumnya** (kalau tadi pindah-pindah istilah) — ingat 30 langkah |
| **📋 Daftar** | Daftar **semua istilah** (1.154) — ada kotak cari, mis. ketik `tebus` → **Tebusan · Penebusan** |
| **🔍 Cari** | Membuka kotak cari istilah |
| **chip ayat** `[Kej 4:4]` | Teks ayatnya muncul **di kolomnya sendiri** (kolom **no.1**) |
| **chip istilah** `[Yehuwa]` | Keterangan istilah itu muncul **di kolomnya sendiri** (kolom **no.2**) — ❌ **tidak** pindah halaman (K51) |
| **tombol `↗ full`** di samping ayat | **Lompat ke halaman baca Alkitab** pada ayat itu · sesudah itu tombol kembali berubah jadi **📚** → tekan itu untuk **lompat balik ke kamus** (istilahnya sama, ayatnya masih tampil) |
| **📝 catatan pengguna** | Kolom **di atas tombol kembali** — untuk **menambah/melengkapi** kalau keterangan kamus terasa kurang. **Terpisah**: keterangan kamus di atasnya **tidak berubah**. Tekan **💾 Simpan catatan** |

> ✅ **BARU 30 Okt 2026 (K83) — KAMUS DIPERLUAS: NAMA ORANG, TEMPAT & KATA GANTI.**
> Kamus tidak lagi hanya istilah khas Alkitab. Sekarang **nama orang** (Yesus · Musa · Daud ·
> Abraham · Paulus · Esau · Elisa · Ruben · Nebukadnezar · Ahab · Daniel · Maria · Pilatus …),
> **nama tempat** (Yerusalem · Mesir · Babel · Yordan · Sion · Tirus · Damsyik · Yerikho ·
> Libanon · Sinai · Efesus …), **nama bangsa** (Amori · Kasdim · Midian · Amalek · Yunani …),
> dan **kata ganti** (Aku · Dia · Engkau · Kamu) juga bergaris putus-putus dan bisa diklik.
> Jumlahnya **392 → 2.978 istilah** (3.142 tulisan · 492 KB).
>
> 📖 **Sekarang hampir SEMUA nama yang muncul di Alkitab ada di kamus** — termasuk nama yang
> hanya muncul **sekali** (mis. *Berotai · Sobakh · Yitra · Baal-Salisa · Asyhur · Netaim · Mirma ·
> Obil · Hodewa · Sargon · Tiberius · Adria · Haarabim · Kezia · Harmagedon · Yemima · Bartimeus ·
> Teofilus · Febe · Nimfa*). Jadi kalau Anda menemukan nama asing saat membaca, **coba klik** —
> kemungkinan besar keterangannya sudah tersedia.
>
> ⚠️ **Kata ganti hanya ditandai bila berawalan HURUF BESAR.** Jadi **“Aku”** (menunjuk Allah
> atau Yesus) bergaris putus-putus, sedangkan **“aku”** huruf kecil (kata biasa) tidak —
> supaya tulisan tidak penuh garis.
> ⚠️ **PENTING — sakelar 🔗 di bar info catatan HANYA berlaku untuk CATATAN.**
> Tombol **`🔗 OFF` / `🔗 ON`** di bar info catatan mengatur penandaan **di dalam catatan**
> (supaya mengetik tetap lancar). Sakelar itu **TIDAK mematikan** penandaan di
> **halaman baca Alkitab**, **halaman Penguat**, maupun **halaman Sejarah** — di halaman-halaman
> itu istilah **selalu** bergaris putus-putus dan bisa diklik.

> ✅ **BARU 22 Sep 2026 (I-15 · gaya C) — TOMBOL DI UJUNG TEKS AYAT (menu LEBIH RAPI).**
> Dulu tiap ayat membawa **dua baris tombol** di bawahnya ⇒ halaman terasa panjang
> (Kejadian 1 = **58 baris tombol**). Sekarang tombolnya **sejajar di ujung teks ayat**:
>
> ```
> 📖 Kejadian 1
> 31 ayat
> [ 📖 sejarah ]
> 1  Pada mulanya Allah menciptakan langit dan bumi.   🖊  🔗62
> 2  Bumi belum berbentuk dan kosong …                 🖊  🔗8
> 3  Berfirmanlah Allah: "Jadilah terang." …          🖊  🔗21
> ```
>
> Arti ikon (sentuh-tahan untuk keterangan lengkap):
> * **🖊** = **Penguat** — tekan ⇒ **seluruh penguat pasal itu tampil** · tekan lagi ⇒ hide.
> * **🔗62** = **Ayat terkait (62)** — tekan ⇒ daftar ayat berkaitan terbuka **di bawah ayat itu**.
>
> Hasilnya tinggi pasal **turun ±26 %** — lebih nyaman dibaca.
> ⚠️ **Cara kerjanya TIDAK berubah** — masih per ayat, seperti sebelumnya.
>
> ✅ **BARU 22 Sep 2026 (K54) — 🖊 PENGUAT DI HALAMAN BACA ALKITAB.**
> Di ujung teks tiap ayat yang punya penguat ada tombol kecil **`🖊`**.
> Tekan **sekali** ⇒ **SELURUH penguat pasal itu TAMPIL** sekaligus (latar krem,
> **huruf sebesar huruf Alkitab**, tanpa garis cokelat supaya ruang baca lebih lebar).
> Tekan **lagi** ⇒ **SEMUA penguat HIDE** (halaman kembali ringkas).
> Di dalam kotak penguat, **kata istilah** (mis. *Taurat*) bergaris putus-putus dan
> **bisa diklik** → **halaman istilahnya terbuka** · tombol 🏠 **membawa kembali** ke ayat tadi
> dengan kata itu **disorot kuning**.
> Halaman **🖊 Pembaca Penguat** yang sekarang tetap ada — di sana ada tombol **📖** untuk
> lompat ke halaman baca pada pasal yang sama.
>
> ✅ **BARU 23 Sep 2026 (K45 i) — 🖊 PENGUAT MENEMPEL DI CATATAN.**
> **Tidak perlu pindah halaman lagi.** Tiap tautan ayat **di dalam catatan** (mis.
> **Yohanes 3:16**) kini punya **tombol kecil `🖊`** tepat di sebelahnya:
>
> ```text
> Catatan:  Baca Yohanes 3:16 🖊 hari ini.
>                                 │ tekan
>                                 ▼
>           Baca Yohanes 3:16 🖊 hari ini.
>           ┌──────────────────────────────────────────┐
>           │ 🖊 Perhatikan bahwa begitu besar kasih … │  ← kotak krem
>           └──────────────────────────────────────────┘
>           tekan 🖊 lagi ⇒ kotak TERTUTUP
> ```
>
> * Kotak penguat berlatar **krem** · **hurufnya sama besar** dengan huruf catatan.
> * **Kata istilah** di dalam kotak (mis. *Taurat*) tetap **bergaris putus-putus & bisa diklik**.
> * Tombol `🖊` dan kotaknya **TIDAK ikut tersimpan** — kalau catatan disimpan/diekspor,
>   isinya tetap teks biasa seperti yang Anda tulis.
> * **Tidak mau tombol ini?** Buka 🧩 → 🖊 Penguat → pilih **🚫 Matikan tombol 🖊**.
>   Catatan langsung bersih dari tombol 🖊 (bisa dihidupkan lagi kapan saja).
> * Tombol **📖 Halaman Pembaca Penguat** tetap ada di halaman keterangan plugin itu
>   (untuk membaca penguat seperti membaca Alkitab — K47).
>
> ✅ **BARU 30 Okt 2026 (K84) — 🔗 RUJUKAN AYAT DI DALAM TEKS PENGUAT BISA DIKLIK.**
> Di dalam teks penguat sering ada rujukan ayat, mis. *“…Bandingkan pernyataan yang sama
> dalam **Mazmur 34:10** dan **Yohanes 10:11**.”* — rujukan itu sekarang **bergaris putus-putus
> biru** dan **bisa diklik**:
>
> ```text
> 🖊 … Bandingkan pernyataan yang sama dalam Mazmur 34:10 dan Yohanes 10:11.
>                                        └──────┬──────┘
>                                          diklik
>                                              ▼
>                        HALAMAN BACA ALKITAB — Mazmur 34 (ayat 10 disorot)
>                                              │ tekan 🏠
>                                              ▼
>                        kembali ke tempat semula (posisi gulir dipulihkan)
> ```
>
> * Berlaku di **tiga tempat**: **halaman 🖊 Pembaca Penguat** · **kotak 🖊 di halaman baca
>   Alkitab** · **kotak 🖊 di catatan**.
> * Tombol **🏠** membawa kembali **ke tempat Anda tadi** — bukan selalu ke catatan:
>   dari halaman Pembaca Penguat ⇒ kembali ke halaman itu (posisi gulir sama) ·
>   dari kotak di halaman baca ⇒ kembali ke **pasal yang tadi dibaca** ·
>   dari kotak di catatan ⇒ kembali ke **catatan**.
> * **8.136 dari 31.102 ayat penguat (26,2 %)** memuat rujukan ayat — semuanya kini bisa diklik.
> * Rujukan ini **hanya tampilan** — tidak ikut tersimpan ke catatan Anda.
>
> ✅ **JUGA (K61, 23 Sep 2026) — GARIS VERTIKAL DIHILANGKAN (tulisan lebih lebar).**
> Di kotak ayat terkait & kotak penguat dulu ada **garis warna di kiri** yang sedikit
> **memakan lebar tulisan** — sekarang **garis itu sudah dihilangkan sama sekali**.
> Bagian tetap mudah dikenali dari **warna latar tipis** (biru muda / hijau muda / krem).
> Turunan (ayat di bawah ayat) juga **tidak lagi menjorok**, sehingga di HP — apalagi kalau
> ukuran huruf diperbesar untuk usia — tulisan tetap panjang dan tidak cepat turun baris.
>
> ✅ **JUGA (K62, 23 Sep 2026) — NAMA KITAB TETAP BISA JADI RUJUKAN AYAT.**
> Dulu, menulis **“Mazmur 23:1”** bisa gagal menjadi tautan (kata “Mazmur” dianggap
> istilah kamus sehingga rujukannya pecah). Sekarang **5 nama kitab** — *Hakim-Hakim ·
> Mazmur · Amsal · Kisah Para Rasul · Ibrani* — **selalu tetap menjadi tautan ayat** bila
> diikuti pasal:ayat. Kalau ditulis tanpa angka (mis. “kitab **Mazmur**”), kata itu
> **tetap** bergaris putus-putus dan bisa diklik ke halaman artinya.
>
> ✅ **JUGA (K25/K37) — 🔗 AYAT TERKAIT DI TIAP AYAT.**
> Di ujung teks tiap ayat yang punya kaitan ada tombol kecil **`🔗n`**.
> Tekan ⇒ daftar ayat yang berkaitan terbuka di bawah ayat itu · klik salah satu ⇒
> **pratinjau** dulu · tekan **`✓ pilih`** ⇒ ayat itu **turun** jadi blok (bisa ditelusuri lagi).
> Kalau **beberapa ayat** diklik angka-nya (mis. Roma 4:2·3·4) lalu salah satu tombolnya
> ditekan ⇒ tombol memakai tulisan **`ayat terkait (n)`** lagi dan ketiga ayat **diikat**
> lalu pindah ke **halaman kerja**.
> 👉 **Rincian lengkap Kamus ada di bagian 3f · dan Ayat Terkait di bagian 13j.**

> ✅ **BARU 21 Sep 2026 (K51 c+d) — BLOK ISTILAH BISA DISIMPAN KE CATATAN.**
> Di halaman istilah, tiap keterangan punya tombol **`✓ pilih`** — ditekan → keterangan itu
> jadi **blok tetap** (menumpuk ke bawah). Dari dalam blok masih bisa klik istilah lain
> → kolom berikutnya (tingkat 2, 3, …). Setelah selesai, tekan tombol **`＋ Istilah`** →
> pindah ke catatan → klik letaknya **`+ Ayat`** → seluruh keterangan (dengan judul kepala
> istilahnya) masuk ke catatan Anda.
>
> ✅ **BARU 21 Sep 2026 (K52) — TAUTAN ISTILAH DI HALAMAN BACA & PENGUAT.**
> Kata seperti **Taurat** di ayat (mis. **Yosua 1:8**) bergaris putus-putus dan **bisa diklik** —
> diklik → **halaman istilahnya terbuka**. Tombol 🏠 di bawah halaman itu **membawa kembali
> ke ayat tadi** dan **kata itu disorot kuning**. Di halaman 🖊 **Pembaca Penguat** pun
> teks ayat dan teks penguatnya ikut bisa diklik. Chip **📚 Istilah di pasal ini** di bawah
> bacaan juga bisa diklik.
>
> ✅ **BARU 21 Sep 2026 (K51) — KOLOM ISTILAH BERLEVEL.** Kolom **selalu selebar layar** (tanpa
> garis hijau tebal, tanpa indent) · turunan ditandai **BADGE “Tingkat n”**.
> Dulu klik `[Yehuwa]` **pindah halaman**
> (keterangan `Kudus; Suci` hilang). Sekarang tiap klik membuka **kolom baru DI BAWAH** —
> jadi judul `Kudus; Suci` **tetap ada** dan keterangan bertingkat bisa dibandingkan.
>
> ```text
> 📚 istilah lain di keterangan (klik: tampil di kolom bawah)
> [Yehuwa] [Ibrani] [Kristen]
>    │ diklik
>    ▼
> ┌──────────────────────────────────────────┐
> │ 📚 Yakub                       LEVEL 1   │
> │ Anak laki-laki Ishak dan Ribka …          │
> │ 📚 istilah lain di keterangan ini         │
> │ [Israel] [Orang Yahudi]                  │
> └──────────────────────────────────────────┘
> ┌──────────────────────────────────────────┐
> │ 📚 Israel                      LEVEL 2   │ ← kolom BARU di bawah
> │ Nama yang Allah berikan kepada Yakub …    │   (❌ bukan menimpa kolom di atas)
> └──────────────────────────────────────────┘
> ```
>
> **Aturannya:** tiap klik = **kolom baru di bawah** (makin ke bawah = makin dalam).
> Kalau mengklik lagi di **tingkat yang sama**, yang berganti hanya kolom **tingkat itu**.
> Klik `[Kel 28:36]` tetap muncul di **kolom ayat** yang terpisah (kolom no.1).
>
> 📐 **Ukuran kolom SELALU selebar layar** — ❌ tidak dikecilkan walau makin dalam.
> Tingkatnya ditandai **badge kecil** di kepala kolom: **“Tingkat 1”**, **“Tingkat 2”**, dst.
> (supaya di HP ruang tulis tetap luas, apalagi kalau ukuran huruf diperbesar)

> ✅ **DIPERBAIKI 21 Sep 2026 (K50) — “tautan ada tapi isinya tidak ditemukan”.**
> Dulu ada kata yang bergaris putus-putus, tetapi saat diklik muncul pesan
> *“⚠️ Istilah … tidak ditemukan”* (mis. kata **suci** → `Kudus; Suci`). **Sekarang sudah beres — 0 entri gagal.**
>
> **Sebabnya:** setiap tautan menyimpan **nama resmi** istilah; nama resmi yang memuat tanda
> `;` `(` `)` `-` (mis. `Kudus; Suci`, `Hakim-hakim`, `Sida-sida`) **tidak dikenali** oleh
> pengenal kata yang hanya menerima huruf + spasi. **Perbaikan:** ditambahkan peta **nama resmi**
> (`petaNama`) + tanda hubung diperbolehkan.
>
> **Hasil terukur:** tulisan siap deteksi **427 → 437** · entri gagal **23 → 0** · penanda versi **`v21Sep-a`**.
> ⚠️ **Catatan lama tidak memperbaiki diri sendiri** → kalau ada catatan dari sebelum perbaikan,
> **impor ulang** berkasnya (File → ⤒ Impor…) atau ketik ulang kata itu.

> 💡 **Kalau keterangan kamus kurang lengkap:** tuliskan tambahan Anda di kolom **📝 catatan pengguna**
> (di atas tombol `🏠 kembali ke catatan`). Tambahan itu **disimpan tersendiri** dan tidak
> menimpa keterangan kamus — jadi keduanya bisa dibaca berdampingan.

**Cara memasang:**
1. Tekan 🧩 di kepala → pilih **📚 Kamus Istilah** → **⬇ Pasang plugin**.
2. Buka/tulis catatan seperti biasa → kata istilah akan bergaris putus-putus.
3. Klik salah satu → bacalah keterangannya. Selesai → tekan **🏠**.

**Ada juga:**
- **📖 Istilah di halaman baca Alkitab** — saat membaca pasal, istilahnya juga bergaris putus,
  dan di bawah pasal ada daftar **“📚 Istilah di pasal ini”**.
- **📋 Panel Ayat & Istilah** di catatan (di bawah catatan) — daftar semua ayat & istilah yang
  muncul di catatan itu; tekan **▾** untuk membuka/menutup.
- **kamus pribadi** — pilih (blok) satu kata di catatan → tekan **＋ Istilah** di panel → kata itu
  masuk daftar **istilah pribadi** (keterangannya boleh diisi nanti). Yang belum berketerangan
  masuk **⏳ antrian**, yang sudah masuk **✅**. Ada tombol **📋 Salin daftar** untuk menyalin
  daftar yang belum berketerangan.
- **Cara tampil** boleh dipilih di halaman keterangan plugin:
  **garis putus-putus** (bawaan) ⇄ **tanpa garis putus** (catatan tetap bersih; istilah dibuka
  lewat 📋 Daftar & halaman baca Alkitab). Pilihan ini **jalan aman** kalau Anda merasa garisnya
  terlalu ramai.

> ⚠️ **Garis putus-putus hanya penanda tampilan** — **tidak ikut tersimpan** ke catatan.
> Tulisan Anda tetap teks biasa. Melepas plugin **tidak menghapus catatan**.

---

## 3f-2. 🖊 Pembaca Penguat (baru 19 Sep 2026 — plugin · **MANDIRI**)

**Apa ini:** halaman untuk **membaca penguat (tafsiran) tiap ayat Alkitab** — seperti membaca
Alkitab, tetapi di bawah ayat ada kotak **krem** berisi keterangannya.

```text
🧩 → 🖊 Pembaca Penguat → ▶ Buka

   [🏠] [Kitab ▾] [Pasal ▾] [◀] [▶] [🔍 cari isi]
   ──────────────────────────────────────────────
   Matius 1
   Pasal 1 dari 28 pasal — ganti pasal lewat daftar ▾ di bar atas  ·  v21Sep-b
   ──────────────────────────────────────────────
   Ayat — klik untuk menuju penguatnya:
   [1][2][3][4] … [25]
   ┌──────────────────────────────────────────┐
   │ 1  Inilah silsilah Yesus Kristus …       │
   │ 🖊 Penulis kitab ini membuka …            │  ← kotak penguat (krem)
   └──────────────────────────────────────────┘
```

> ⚠️ **Halaman ini MANDIRI — tidak menyentuh catatan Anda.** Dibuka/ditutup kapan saja,
> catatan tetap utuh.

| Tombol | Fungsi |
|--------|--------|
| **Kitab ▾ / Pasal ▾** | Pilih kitab & pasal (66 kitab — **seluruh Alkitab**) |
| **◀ ▶** | Pasal sebelum / sesudahnya |
| **deret angka** `[1][2]…` | **Klik nomor ayat** → langsung menuju penguat ayat itu |
| **🔍 cari isi** | Cari kata **di dalam penguat** (mis. `penebusan`) |
| **🔗 rujukan ayat** | Rujukan di dalam teks penguat (mis. *Mazmur 34:10*) **bergaris putus biru & bisa diklik** ⇒ lompat ke ayat itu di halaman baca Alkitab · tekan **🏠** ⇒ **kembali ke halaman ini** (posisi gulir dipulihkan) — K84, 30 Okt 2026 |

**Keadaan datanya (21 Sep 2026):**

| Hal | Angka |
|---|---|
| Kitab | **66 dari 66 (100 %)** |
| Ayat punya penguat | **31.102 dari 31.102 (100 %)** |
| Ukuran data | **12.691,7 KB** |
| Penanda versi | **`v21Sep-b`** (kamus: `v21Sep-a`) |

> 💡 **Cara membuktikan versi yang termuat:** lihat penanda **`v21Sep-b`** di baris biru
> (atau Console: `ANodesPenguatTampilan.versi()` → `"v22Sep-b"` ·
> `ANodesPenguat.daftarKitab().length` → **66** · `ANodesPenguat.jumlahSemua()` → **31102**).

## 3f-3. 📖 Sejarah Alkitab & Sejarah Kitab (plugin **📖 Sejarah Kitab**)

**Apa ini:** bacaan **pemanis** supaya tiap kitab Alkitab tidak terasa “asing”. Ada **dua tingkat**:

| Tingkat | Isi | Pintunya |
|---|---|---|
| 📜 **Sejarah ALKITAB** (prakata) | tulisan **“Bagaimana Firman Menjadi Tulisan”** — 15.356 huruf · 66 chip kitab | **🧩 ▼ → 📖 Sejarah** (1 klik ⇒ **halaman sendiri**) |
| 📖 **Sejarah PER KITAB** (66 kitab) | 🎯 inti 1 kalimat · 🏷️ penulis & tahun · 💡 tema · 👤 tokoh · 📜 cerita · 🔑 **ayat kunci** | tombol kecil **`📖 sejarah`** di **pasal 1** tiap kitab |

```text
① CATATAN / ALKITAB — Kejadian 1  (pasal 1 saja)
   📖 Kejadian 1
   31 ayat
   [ 📖 sejarah ]                ← tombol: tekan ⇒ panel turun
        │
        ▼
   ┌──────────────────────────────────────────────────┐
   │ 📖 SEJARAH — KEJADIAN                            │
   │ 🎯 Kitab permulaan — asal mula dunia, manusia…   │
   │ Penulis   Musa (atribusi tradisional)            │
   │ Tahun     ±1445–1405 SM                          │
   │ Kategori  Taurat · Perjanjian Lama               │
   │ 💡 Tema utama  [Penciptaan] [Kejatuhan…]         │
   │ 👤 Tokoh utama [Adam][Nuh][Abraham]…             │
   │ 📜 Sejarah     …(cerita singkat kitab ini)…      │
   │ 🔑 Ayat kunci — klik untuk membuka               │
   │ [Kejadian 1:1] [Kejadian 12:3] [Kejadian 50:20]  │ ← DIKLIK ⇒ pindah ke ayat
   └──────────────────────────────────────────────────┘
        │ tombol 📖 sejarah ditekan LAGI
        ▼  panel TERTUTUP
```

```text
② SEJARAH ALKITAB KESELURUHAN — halaman SENDIRI (seukuran catatan)

   🧩 ▼ → klik [📖 Sejarah]   (atau 🧩 Gudang Plugin → 📖 Sejarah Kitab → ▶ Buka)

   ┌──────────────────────────────────────────────────┐
   │ [🏠]   📖 SEJARAH ALKITAB                [🔍]    │
   │ ──────────────────────────────────────────────── │
   │ 📖 Sejarah Alkitab                               │
   │ Bagaimana Firman menjadi tulisan · 66 kitab      │
   │                                                  │
   │ 📚 Taurat (5)                                    │
   │ [1. Kejadian][2. Keluaran][3. Imamat] …          │ ← chip DIKLIK
   │ 📚 Injil (4)                                     │    ⇒ pasal 1 kitab itu
   │ [40. Matius][41. Markus][42. Lukas] …            │
   │                                                  │
   │ (teks “Bagaimana Firman menjadi tulisan” —       │
   │  15.356 huruf, 88 paragraf, 9 kelompok)          │
   └──────────────────────────────────────────────────┘
```

| Tombol | Fungsi |
|---|---|
| **chip kitab** `[1. Kejadian]` | pindah ke **pasal 1 kitab itu** di halaman baca Alkitab (di sana ada `📖 sejarah`) |
| **🔍** | cari kata di dalam teks sejarah (mis. `dead sea`, `kanon`) |
| **🏠** (atau **Esc** / **Ctrl+B**) | kembali ke catatan |
| **tautan ayat** di dalam teks | **bisa diklik** (mis. **`Ulangan 34:5-6`** ⇒ langsung ke ayat itu) · 🏠 membawa **balik ke halaman sejarah** |
| **kata istilah** (mis. `Taurat`) | bergaris putus-putus ⇒ diklik ⇒ **keterangan istilahnya** terbuka |

> ✅ **23 Sep 2026 (K58) — 🔍 CARI: kata yang ketemu DIBERI WARNA + ◀ ▶.** Ketik kata
> (mis. `dead sea`) ⇒ setiap kata yang ketemu **disorot kuning** di dalam teks · temuan yang
> sedang dipilih **kuning lebih tua** · **◀ ▶** pindah temuan (berputar) · penghitung **`3/5`** ·
> **Enter** = berikutnya · **Esc** = bersihkan · **tanda tetap ada** selama pencarian belum
> ditutup/diganti · **✕** ⇒ semua tanda hilang, halaman kembali utuh (istilah & tautan tetap hidup).
> Daftar cuplikan kalimat di bawah bar juga ada — diklik ⇒ lompat ke temuan itu.
>
> ✅ **23 Sep 2026 (K56 · K56b · K56c) — tautan & istilah di halaman sejarah.**
> Dulu teks sejarah **belum pernah ditandai** (tautan ayat **0** · istilah **0**) ⇒ sekarang
> **9 tautan ayat + 175 istilah** hidup. **Angka-angka dalam kalimat daftar kitab**
> (mis. *“…Rut, 1 & 2 Samuel, 1…”*) **tidak lagi jadi tautan palsu** (dulu menunjuk *ayat 0*),
> sementara rujukan **pasal-saja yang benar** (`Amsal 31` · `Daniel 9` · `Yesaya 53`) **tetap hidup**.
> ⚠️ **Catatan:** di sketsa pernah disebut **“Ulangan 24:4-6”** — nomor itu **tidak ada** di teks
> data; yang tertulis **`Ulangan 34:5-6`** (kematian & penguburan Musa) dan **`Ulangan 34:10`**.
>
> ✅ **23 Sep 2026 (K57) — kata `Sea` di “Dead Sea Scrolls”.** Dulu kata **`Sea`** di situ
> **salah dianggap istilah** dan diambil arti *takaran untuk bahan kering* — jelas bukan itu
> maksudnya. Sekarang **`Sea`** (huruf besar, di dalam nama asing) **tidak lagi ditandai**.
> Tapi **`sea`** huruf kecil (artinya takaran) **tetap bisa diklik**. Istilah lain yang
> berhuruf besar (`Kristen` · `Injil` · `Taurat` · `Mazmur`) **tidak ada yang hilang**.
>
> ✅ **22 Sep 2026 (K55 · K55b) — plugin sendiri, bisa dipasang/lepas.**
> Sejarah kitab dijadikan **plugin sendiri** (nama **📖 Sejarah Kitab**) supaya bisa Anda
> pasang/lepas tanpa mengubah hal lain. Di gudang plugin: kartu **📖 Sejarah Kitab** →
> **⬇ Pasang** (perlu plugin **📖 Alkitab** juga terpasang).
> **Ada untuk SEMUA 66 kitab** (Taurat sampai Wahyu) — **hanya di pasal 1**.

**⚠️ Yang perlu diketahui:**
- Halaman **Sejarah Alkitab** bisa dibaca **tanpa** plugin Alkitab (chip kitab perlu plugin Alkitab
  supaya bisa melompat ke kitabnya).
- **Plugin dilepas** ⇒ halaman ditutup & tombol `📖 sejarah` hilang; **catatan & isi Alkitab tetap utuh**.
- Sejarah ini **bukan pengganti penguat** — penguat = keterangan **per ayat** (bagian **3f-2**),
  sejarah = latar belakang **per kitab**.

## 4. Toolbar (hemat ruang, seperti MarkDown)

Toolbar ANodes **ringkas** — tombol besar dibuka dengan panah **▼**:

| Tombol | Isinya |
|--------|--------|
| **¶ ▼ Size** | H1 (judul besar) · H2 · H3 · ¶ (teks biasa) |
| **• List ▼** | • Titik · 1. Nomor · ✅ Icon List |
| **B** | Tulisan **tebal** |
| **I** | Tulisan *miring* |
| **▦ ▼** | Sisip tabel · ✎ Edit tabel |
| **▬ ▼** | Stabilo (klik = kuning, ▼ = pilih warna) |
| **A ▼** | Warna huruf (klik = warna terakhir, ▼ = pilih) |
| **✕** | Hapus stabilo/warna pada tulisan yang diblok |
| **✅ ▼** | Sisip icon (28 pilihan) |
| **🧩 ▼** | **Plugin** — panah ▼ menunjukkan plugin yang **sudah dipasang saja**; klik = langsung dibuka (mis. 📖 Alkitab). Di bawahnya ada baris **🧩 Gudang Plugin…** untuk memasang melepas plugin |

**Cara pakai:** blok dulu tulisan → klik tombol. Untuk memilih warna/jenis,
klik **panah kecil ▼** di tombol.

> 📌 **Tombol [🧩 ▼] (plugin).** Kalau belum ada plugin yang dipasang, yang muncul
> tulisan *“Belum ada plugin terpasang.”* — bukan menu kosong. Begitu ada plugin
> dipasang, namanya **langsung muncul** di situ (tidak perlu tutup-buka aplikasi).
> Ingin memasang plugin baru? Pakai tombol **🧩** di kepala — semua urusan
> pasang/lepas plugin ada di satu halaman itu.
> Di layar sempit tombol **• List ▼** berubah jadi **• ▼**, **1. List ▼** jadi **1. ▼** —
> supaya toolbar tetap muat **satu baris** di HP.

### Ketik cepat (seperti MarkDown)
- Ketik `# ` lalu Enter → jadi **judul besar**.
- Ketik `- ` → jadi **titik**; ketik `1. ` → jadi **nomor**.

### Mengubah jenis daftar (dot ↔ nomor ↔ icon)
- Blok daftar → pilih jenis lain di **• List ▼** → **langsung berubah**,
  tidak perlu menghapus daftar lebih dulu.
- Klik jenis yang **sama** lagi → daftar berubah jadi teks biasa (toggle).
- Daftar **icon** tampil **sejajar sama seperti dot** (icon di kolom penanda),
  dan tetap bisa diblok **beberapa baris sekaligus** seperti dot.

## 4b. 📤 Mengirim ayat Alkitab ke catatan (baru 14 Sep 2026)

**Gunanya:** Anda bisa memilih ayat yang sedang dibaca, lalu **memindahkannya
ke catatan** — bukan hanya nama ayatnya, tapi bisa **beserta kalimatnya**.

### Tiga langkah saja

```
1. DI ALKITAB           2. PAKET DIKUNCI           3. DI CATATAN
   klik angka 7            tekan [📋 Simpan]          klik di tempat yang Anda mau
   klik angka 11           halaman pindah            tekan [Tempel ⇩]
   pilih bentuknya         ke catatan
```

### Di halaman Alkitab

```
[🏠][Kitab ▾][Pasal ▾][◀][▶][↩][📋 PILIH][🔍 Cari][📤]   ← bar utama (TETAP ada)
[Yoh 4:7-11]  [💬 Kalimat]  [📖 Yohanes 4:7-11]  [📋 Simpan]  [✕]
                            ↑ ini baris ke-2 (muncul saat angka diklik)
```

| Tombol | Artinya |
|--------|---------|
| `Yoh 4:7-11` | ayat yang Anda pilih (klik angka di kiri tiap ayat) |
| `💬 Kalimat` | **biru = hidup** → kalimat ayatnya ikut dikirim. Putih = hanya nama ayat |
| `📖 Yohanes 4:7-11` | menunjukkan bentuk yang akan dikirim. **Klik** untuk berganti jadi singkat `Yoh 4:7-11` |
| `📋 Simpan` | paketnya dikunci, siap ditempel di catatan |
| `✕` | batal memilih, baris ke-2 hilang |

💡 **Mau beberapa ayat?** Klik angka berturut-turut:

```
klik 7 → [7]        klik 11 → [7-11]        klik 11 lagi → [7]
```

### Di halaman catatan

```
📋 Yohanes 4:7-11   [Tempel ⇩]   [❌ Buang]
     ↑ yang akan ditempel        ↑ klik dulu tempatnya di catatan

sesudah masuk:
📋 Ditempel ✓   [↶ Batalkan]   [❌ Selesai]
                  ↑ salah tempat? paket diangkat, coba tempat lain
```

Ayat yang baru masuk akan **disorot kuning sebentar (±4 detik)** supaya Anda
tahu persis di mana hasilnya mendarat.

### Kalau salah tempat

- **Sebelum** ditempel: tekan **[❌ Buang]** → paket dibatalkan, toolbar tulis kembali.
- **Sesudah** ditempel: tekan **[↶ Batalkan]** → paket diangkat lagi, coba tempat lain.
- Atau tekan tombol **↶** di toolbar tulis (Ctrl+Z) → tempelan dibatalkan.

### Kalau mau kembali ke tempat tadi

Tekan **[🏠]** → Anda kembali ke halaman catatan, dan **kursor + posisi gulir
kembali persis** di tempat Anda tadi menulis. Kalau Anda belum menulis di
catatan itu, kursor ditaruh di **paling bawah**.

### Mau memakai toolbar tulis sambil paket masih dipegang?

Selama paket belum ditutup, baris ke-2 bisa **bergantian**:

```
klik [▦]  →  toolbar tulis muncul (tebal, miring, judul, daftar…)
klik [▦]  →  kembali ke bar paket ([Tempel ⇩])
```

Bar paket baru benar-benar hilang kalau Anda menekan **[❌ Selesai]** atau **[❌ Buang]**.

### Bentuk nama ayat: panjang atau singkat?

Sebelum menekan **[📋 Simpan]**, tombol **📖** menunjukkan bentuk yang akan dikirim:

```
📖 Yohanes 4:7      →  klik  →  📖 Yoh 4:7
   ↑ akan dikirim panjang         ↑ akan dikirim singkat
```

Jadi Anda **langsung melihat** hasil yang akan masuk catatan — tidak perlu menebak.

### Hasilnya di catatan

```
💬 Kalimat MATI                      💬 Kalimat HIDUP
Yohanes 4:7-11                       Yohanes 4:7
                                     7 Maka datanglah seorang perempuan Samaria
                                     hendak menimba air. Kata Yesus kepadanya:
                                     "Berilah Aku minum."
                                     8 Sebab murid-murid-Nya telah pergi ke kota
                                     membeli makanan.
```

> 🔢 **Nomor ayat ikut tampil** di depan tiap kalimat (7, 8, …) — jadi Anda langsung
> tahu kalimat itu ayat berapa, tanpa perlu menghitung sendiri.

> 💡 Nama ayatnya tetap jadi **tautan biru** → bisa Anda klik untuk kembali
> membuka ayat itu kapan saja. Ini berlaku untuk semua catatan, bukan hanya
> yang baru ditempel.

### Hal yang perlu diketahui

- **Hanya satu paket** yang bisa dipegang sekaligus. Paket baru **menggantikan** yang lama.
- Paket **tidak disimpan** kalau aplikasi ditutup — jadi tempelkan sebelum menutup.

## 4c. 🔍 Mencari ayat dengan kata (baru 14 Sep 2026)

Buka Alkitab → tekan **🔍 Cari** → **langsung terbuka halaman pencarian**:
ketik kata (mis. **`tebus`**) → tekan **Enter** → hasilnya muncul di halaman itu juga.

### Satu langkah saja

```
tekan [🔍 Cari]  →  halaman pencarian terbuka
                    [ kata: tebus · atau nama ayat: yoh 3:16 ]  [🔍 Cari]
                    [Semua] [PL] [PB]
                 →  ketik kata, tekan ENTER  →  hasil muncul di halaman yang sama
```

Kalau Anda menulis **nama ayat** (mis. `yoh 3:16`), muncul tombol
**📖 Buka Yohanes 3:16** — tekan itu untuk membuka pasalnya.

### Yang tampil di halaman hasil

```
Hasil: "tebus"
83 ayat di 21 kitab — klik nama ayat untuk membukanya.

[ tebus                 ]  [🔍 Cari]      ← cari kata lain langsung dari sini
[📚 Semua]  [PL]  [PB]                    ← mau dicari di mana

📖 Keluaran — 8 ayat
Kel 13:13   … terdahulu kau**tebus**lah dengan seekor domba; …
```

| Bagian | Gunanya |
|--------|---------|
| **Kata kuning tebal** | supaya Anda tahu kata yang dicari ada di bagian mana |
| **[🔍 Cari]** | mencari kata lain **tanpa perlu kembali** ke halaman baca (Enter juga bisa) |
| **[📚 Semua] [PL] [PB]** | menyaring hasil — **Semua** = seluruh Alkitab · **PL** = Perjanjian Lama · **PB** = Perjanjian Baru |
| **Kel 13:13** (biru) | diklik → langsung dibuka pasalnya |

### Kata yang mirip ikut ketemu

Anda **tidak perlu** mencoba semua bentuk kata. Sudah dibuat akrab:

```
cari "penebusan"  → juga menemukan ayat yang berisi  tebus, penebus, menebus, ditebus
cari "penulis"    → juga menemukan  tulisan, tulis, menulis
cari "pembaptisan"→ juga menemukan  baptis, membaptis
cari "keselamatan"→ juga menemukan  selamat, menyelamatkan
```

### Tiga “Cari” yang berbeda (jangan tertukar)

| Tombol | Tempatnya | Gunanya |
|--------|-----------|---------|
| **🔍 Cari** | kepala atas (bar hitam) | cari kata **di catatan yang sedang dibuka** (sama seperti Ctrl+F) |
| **🔍 cari di daftar catatan…** | panel daftar (File → 📂 Open) | cari **antar-catatan** (semua judul & isi) + saring kategori |
| **🔍 Cari** | di halaman Alkitab | mencari **ayat** |

### Alkitab melanjutkan dari bacaan terakhir

Kalau Anda menutup Alkitab (atau menutup aplikasi), lalu membukanya lagi —
yang tampil adalah **kitab & pasal terakhir** yang Anda baca. Tidak lagi mulai
dari Kejadian 1 terus.

> Contoh: terakhir membaca **Daniel 11** → dibuka lagi → **Daniel 11** juga.

### Tombol wilayah tanpa ikon

Tombol **Semua · PL · PB** sekarang **tulisan saja** (ikon bukunya dibuang).
Yang sedang dipakai tetap berwarna biru sebagai penanda.

### Tidak ada lagi form cari ganda

Dulu menekan **🔍 Cari** memunculkan **kotak melayang (popup)** dulu, baru setelah
ditekan lagi masuk ke halaman pencarian — jadi terasa “cari 2×”. Sekarang
**popup itu sudah dibuang**: sekali tekan **🔍 Cari** langsung masuk halaman
pencarian, dan kalau ditekan lagi kursor hanya diarahkan ke kotak cari yang
sudah ada.

### 🏠 Kembali ke bacaan sebelum mencari (K91 · 2 Nov 2026)

Dulu: sedang membaca **Keluaran 1**, lalu mencari kata dan membuka hasilnya
(mis. **Kolose 4:9**) — menekan **🏠** langsung melompat ke **catatan**, sehingga
bacaan **Keluaran 1** hilang.

Sekarang **🏠 ingat dari mana Anda datang**:

```
baca Keluaran 1  →  [🔍 Cari] "onesimus"  →  klik hasil  →  Kolose 4:9
                                                              │ tekan 🏠
                                                              ▼
                                                    kembali ke Keluaran 1
                                                              │ tekan 🏠 lagi
                                                              ▼
                                                          catatan
```

Arah tombol **🏠** juga tertulis di keterangannya (tahan/arahkan kursor ke tombol):
*“Kembali ke Keluaran 1 (tekan 🏠 lagi untuk kembali ke catatan)”*.

### 🔤 Salah ketik? Muncul saran kata yang mirip (K91 · 2 Nov 2026)

Dulu pencarian harus **sama persis**. Menulis `omesimus` (kurang satu huruf)
tidak menemukan apa pun.

Sekarang kalau kata **tidak ditemukan**, aplikasi menawarkan **kata yang mirip**:

```
Hasil: "omesimus"
Tidak ada ayat yang memuat "omesimus".

Mungkin maksud Anda:
[ onesimus ]  [ … ]
```

Klik salah satu saran → pencarian dijalankan dengan kata itu.

| Hal | Keterangan |
|-----|------------|
| **Kata yang disarankan** | diambil dari **seluruh kosakata Alkitab** (16.896 kata) |
| **Salah ketik 1 huruf** | selalu ketemu (mis. `allha` → **allah**, `anugrah` → **anugerah**) |
| **Huruf tertukar** | ketemu juga (mis. `oneismus` → **onesimus**) |
| **Kata panjang (≥7 huruf)** | boleh salah sampai **2 huruf** |
| **Kata pendek (<7 huruf)** | hanya **1 huruf** — supaya saran tidak ngawur |
| **Jumlah saran** | maksimal **8**, yang paling dekat di atas |
| **Ikut saringan wilayah** | kalau sedang memilih **PL** atau **PB**, saran juga dari wilayah itu |

### 🕘 Riwayat pencarian (K91 · 2 Nov 2026)

Setiap kata yang Anda cari **dicatat** — jadi bisa dipakai lagi kapan saja,
termasuk **hari-hari berikutnya** (tersimpan di perangkat).

```
tekan [🔍 Cari]  →  halaman pencarian terbuka
                    🕘 Riwayat cari (5)          [🗑 Hapus]
                    [ onesimus ] [ tebus ] [ kasih ] [ penebusan ] [ selamat ]
```

| Hal | Keterangan |
|-----|------------|
| **Kapan tampil** | saat halaman pencarian **masih kosong** (belum ada hasil) |
| **Saat ada hasil** | riwayat **dilipat** — tekan tulisan **🕘 Riwayat cari (n)** untuk membukanya |
| **Isi tiap catatan** | kata + wilayah (Semua/PL/PB) + **kapan** dicari (mis. “2 Nov 14:30”) |
| **Klik catatan** | pencarian itu dijalankan lagi |
| **🗑 Hapus** | menghapus **seluruh** riwayat (ditanya dulu sebelum dihapus) |
| **Jumlah maksimal** | **50** catatan terakhir — yang paling lama otomatis terbuang |
| **Kata yang sama** | tidak menumpuk — dipindah ke paling atas |

## 5. Ruang kerja luas (sembunyikan panel)

Ingin layar lebih lega? Tombol ini membantu:

| Tombol | Guna |
|--------|------|
| **▲** di panel catatan | Sembunyikan **daftar catatan** (muncul **☰ Daftar** untuk membuka lagi) |

> 💡 **Toolbar tulis tidak bisa disembunyikan** — ia **selalu tampil** di atas tulisan.

## 5b. Pintasan keyboard (tanpa klik toolbar)

Tidak perlu klik toolbar lagi — tekan kombinasi tombol saat menulis:

| Pintasan | Fungsi |
|----------|--------|
| `Ctrl+1` | Judul H1 |
| `Ctrl+2` | Judul H2 |
| `Ctrl+3` | Judul H3 |
| `Ctrl+0` | Teks biasa (¶) |
| `Ctrl+Shift+8` | Daftar titik |
| `Ctrl+Shift+7` | Daftar nomor |
| `Ctrl+Shift+9` | Daftar icon |
| `Ctrl+B` | **Tebal** |
| `Ctrl+I` | *Miring* |
| `Ctrl+S` | Simpan |

> 💡 **Semua pintasan bisa diganti** — lihat bagian ⚙ Pengaturan di bawah.

## 5c. Pengaturan ⚙ (huruf, kecerahan, pintasan)

Klik tombol **⚙** di kepala (di sebelah ▦):

| Bagian | Guna |
|--------|------|
| **Jenis huruf** | Pilih 1 dari 4: Biasa, Rapi, Klasik, Kode |
| **Besar huruf keseluruhan** | Geser 12–24 px — **isi catatan & halaman baca ikut besar/kecil** |
| **Kecerahan layar** | Geser 50–100% — meredupkan layar agar mata nyaman |
| **Contoh tulisan** | Melihat hasil sebelum ditutup |
| **Pintasan tombol** | Klik kotak → tekan kombinasi baru |

> 💡 **Menu (kepala · bar info · toolbar) berukuran TETAP** (perbaikan 5 Okt 2026).
> Jadi kalau Anda memperbesar huruf sampai **24 px**, **isi catatan** ikut membesar
> (enak dibaca), tetapi **tombol-tombol menu tidak ikut membesar** — supaya tidak ada
> tombol yang terpotong atau hilang di layar HP. Sebelumnya, pada huruf 22 px tombol
> paling kanan (🧩 plugin) sempat terpotong.

### 📖 Menu halaman Alkitab — 2 baris (baru 23 Sep 2026)

```
[🏠] [ 1 Samuel ▾ ] [📋 PILIH] [🔍 Cari] [📤] [🖊]      ← baris 1
1 Samuel   [ 7 ▾ ]  [◀] [▶] [↩]            17 ayat      ← baris 2 (sekaligus JUDUL)
1  Lalu orang-orang Kiryat-Yearim datang, mereka mengangkut tabut TUHAN …
```

- **Baris 1** = tombol utama + **kotak pilih kitab** (`[ 1 Samuel ▾ ]`).
- **Baris 2** = nama kitab · pilih pasal · ◀ ▶ (pindah pasal) · ↩ (kembali) · jumlah ayat.
  ⇢ **baris 2 ini sekaligus JUDUL pasal** yang sedang dibaca.
- **Kedua baris itu “diam di tempat”** (tidak ikut tergeser) waktu Anda menggulir ayat.

**Ganti kitab bisa dari DUA tempat** (dua-duanya jalan):

| Cara | Caranya |
|---|---|
| **Kotak pilihan** | klik `[ 1 Samuel ▾ ]` di baris 1 → pilih kitab → langsung ke pasal 1 kitab itu |
| **📋 PILIH** | klik 📋 PILIH → grid kitab → pasal → ayat |

⚠️ **Cara kerja SEMUA tombol TIDAK berubah** — hanya susunan menunya yang dirapikan
supaya tidak berdesakan. Di layar sempit, tombol 📋 PILIH & 🔍 Cari otomatis jadi
**ikon saja** (artinya tetap muncul kalau ditahan lama / diarahkan tetikus).

### Cara mengganti pintasan
1. Klik kotak pintasan (mis. yang tertulis `Ctrl+1`).
2. Kotak berubah jadi **"Tekan tombol..."** → tekan kombinasi baru (mis. `Alt+1`).
3. Selesai — pintasan langsung berlaku.
4. Tekan `Esc` saat merekam untuk membatalkan, atau `Del` untuk mengosongkan.
5. Tombol **Reset pintasan** mengembalikan semua ke bawaan.

> Semua pengaturan **diingat** — tidak perlu diatur ulang tiap buka.

## 5d. Kalau ada masalah

| Gejala | Sebab & solusi |
|--------|----------------|
| Tulisan panjang tidak bisa digulir | Sudah diperbaiki (13 Sep 2026). Jika muncul lagi, laporkan. |
| Daftar icon tidak bisa diblok banyak baris | Sudah diperbaiki. |
| Ganti dot→nomor harus hapus dulu | Sudah diperbaiki — sekarang **langsung ganti**. |
| Catatan hilang saat browser dibersihkan | Gunakan **File → ⤓ Cadangan .json** dulu untuk cadangan. |
| Aplikasi terasa lambat dibuka di HP | Sejak **3 Nov 2026** berkas HP **8,81 MB lebih kecil** (44,22 → **35,41 MB** lewat K95b) ⇒ muat **±450 ms lebih cepat** & RAM **±30 MB lebih hemat**. Berkas kini **40,77 MB** karena tambahan **🔀 Paralel AYT** (K86 · +5,0 MB). Kalau masih lambat, tutup tab lain dulu. |

> 💡 **Tips untuk AI/tester:** ada alat uji `tools/uji-toolbar.js` (**338 pengujian**).
> Cara pakai: buka ANodes → tekan `F12` → tab **Console** → salin isi file itu →
> tempel → `Enter`. Hasilnya menampilkan OK / ❌ untuk setiap fungsi toolbar.

## 6. Tabel

- **▦ ▼ → Sisip tabel** = membuat tabel 3×3.
- **Klik sel** langsung ketik (sel pertama baris atas = judul).
- **▦ ▼ → ✎ Edit tabel** = ubah seperti Excel:
  **+ Baris / − Baris / + Kolom / − Kolom**, lalu **Masukkan ke tulisan**.

## 7. Copy, paste, hapus tulisan

- Blok tulisan → klik kanan → Copy / Cut / Paste (atau `Ctrl+C / Ctrl+X / Ctrl+V`).
- `Delete` = hapus blok. Semua cara keyboard normal jalan.

## 8. Tersimpan otomatis (TAHAP 2)

> ✅ Catatan kini **tersimpan sendiri** di browser. Tidak akan hilang saat ditutup.

- Setiap Anda mengetik, ANodes menyimpan otomatis (jeda ±0,7 detik).
- Titik di kepala: 🟡 kuning = belum tersimpan · 🟢 hijau = sudah tersimpan.
- Tersimpan juga otomatis saat Anda pindah aplikasi / pindah tab (berguna di HP).
- Tetap bisa tekan **Save** atau `Ctrl+S` (muncul pesan "Tersimpan jam:menit:detik").

## 9. Kategori catatan

- **「Semua ▼」** di kanan kotak cari = menyaring per kategori.
- Di atas area tulis ada dropdown kategori catatan yang sedang dibuka.
- Pilih **「＋ Kategori baru...」** untuk membuat kategori baru.

## 10. Mencari catatan

**Di dalam catatan yang sedang dibuka:**

- Klik **🔍 Cari** di kepala, atau tekan **Ctrl+F**.
- Ketik kata → **Enter** = temuan berikutnya · **◀ ▶** = pindah temuan · **Esc** = tutup.
- Temuan diberi **latar kuning** supaya mudah dilihat.

**Antar-catatan (semua catatan):**

- Buka **File → 📂 Open** (muncul panel daftar).
- Ketik kata di kotak **「🔍 cari di daftar catatan…」**.
- Pencarian melihat **judul dan isi** catatan.
- Dropdown di sebelahnya = **saring kategori** (“Semua” = seluruhnya).

## 10b. ☁️ Sinkron PC ⇄ HP (baru 30 Okt 2026 · diperbarui 1 Nov 2026)

Supaya catatan di **PC** dan di **HP** **sama** — tulis di mana saja, hasilnya sama.

### ✅ Sudah tersambung — TIDAK ADA YANG PERLU DIISI

Sejak **1 Nov 2026** alamat Worker & kunci aplikasi **sudah tertanam** di dalam ANodes.
**Tidak ada kolom isian sama sekali** — di PC maupun di HP, termasuk di perangkat baru.

**Lakukan ini saja:**

1. Buka ANodes → **File ▼ → ☁️ Sinkron…**
2. Tekan **☁️ Sinkron sekarang** → catatan PC & HP langsung sama

> 🛡 **Aman untuk perangkat baru.** Catatan **contoh** (“Catatan Pertama” & “Rencana”)
> **tidak akan pernah** menimpa catatan asli Anda di server, **tidak akan dikirim** ke server,
> dan **dibuang sendiri** begitu ada catatan asli. Jadi Anda boleh memasang ANodes di HP baru /
> membuka di browser baru — catatan Anda **tetap utuh** dan langsung masuk, tanpa tambahan
> catatan contoh yang mengganggu.
>
> ⚠️ **Kalau perangkat belum punya catatan asli sama sekali**, ANodes **tidak mengirim** daftar
> catatan ke server — supaya catatan asli yang sudah ada di server **tidak tertimpa kosong**.
>
> 🧪 **Alat uji tidak mengganggu data Anda.** Saat ANodes menjalankan pemeriksaan otomatis
> (mis. lewat `tools/uji-cepat.js`), sinkron **dimatikan sementara** — jadi catatan percobaan
> **tidak akan pernah** terkirim ke server atau muncul di HP Anda.
>
> 🗑 **Catatan yang Anda hapus TIDAK akan kembali.** Sejak 1 Nov 2026 ANodes mencatat setiap
> penghapusan, jadi catatan yang sudah dibuang di PC **tidak muncul lagi** di HP (dan sebaliknya).
> Sebelumnya, sinkron hanya bisa **menambah** — catatan yang dihapus selalu kembali dari server.
>
> 🖥 **Layar langsung berubah — tidak perlu menutup aplikasi.** Begitu sinkron selesai, catatan
> yang baru masuk **langsung tampil** di layar. Sebelumnya data sudah masuk tetapi layar masih
> menampilkan catatan lama, sehingga terasa “sinkron gagal”.

### Isi modal ☁️ Sinkron

| Bagian | Gunanya |
|---|---|
| **Sinkron otomatis** | **Ya** = data dikirim tiap kali menyimpan (3 detik) + diambil tiap 1 menit · **Tidak** = hanya lewat tombol |
| **Uji sambungan** | memeriksa apakah server bisa dihubungi |
| **☁️ Sinkron sekarang** | menyamakan catatan PC & HP saat itu juga |

> ℹ️ Kalau suatu saat perlu mengganti server, ubah nilai `BAWAAN` di `js/sinkron.js`
> (bagian `alamat` & `kunci`).
>
> 📱 **Di APK (HP):** sinkron berjalan lewat **jembatan native Android** (OkHttp), karena
> WebView Android memblokir permintaan langsung dari halaman. Anda **tidak perlu** melakukan
> apa pun — cukup tekan **☁️ Sinkron sekarang**.

<details>
<summary>📖 Kalau nanti perlu memasang dari nol (klik untuk membuka)</summary>

1. **Buat database Turso** — dasbor Turso → **Create Database** → beri nama → pilih **Singapore**.
   Catat **alamat database** (bentuknya `libsql://…`). ⚠️ Alamat dasbor (`app.turso.tech/…`)
   **bukan** alamat database.
2. **Buat token** — di halaman database → **Create Token** → **Read & Write** → **Never**.
   ⚠️ Token **hanya ditampilkan sekali** — tekan **Copy** dan simpan.
3. **Deploy Worker** di Cloudflare (gratis) — panduan langkah demi langkah ada di
   **`worker/README.md`**. Isi 3 variabel **sebagai Secret**: `TURSO_URL` · `TURSO_TOKEN` · `KUNCI_APP`.
4. Di ANodes: **File ▼ → ☁️ Sinkron…** → isi **Alamat Worker** + **Kunci aplikasi** →
   tekan **Uji sambungan**.

</details>

### Cara pakai sehari-hari

| Keadaan | Yang terjadi |
|---|---|
| **Sinkron otomatis: Ya** (bawaan) | setiap kali Anda menyimpan catatan, datanya dikirim sendiri (3 detik kemudian). Setiap 1 menit ANodes juga mengambil data terbaru. |
| **Sinkron otomatis: Tidak** | hanya lewat tombol **☁️ Sinkron sekarang** |
| **Tidak ada internet** | ANodes tetap jalan normal. Sinkron menyusul saat internet ada. |

### Yang disamakan

✅ **Catatan** · ✅ **Pengaturan** (huruf, kecerahan, pintasan) · ✅ **Istilah pribadi** ·
✅ **Rantai ayat tersimpan**

❌ **Tidak** disamakan: isi Alkitab (sudah ada di tiap perangkat), posisi baca terakhir,
pilihan tampilan, plugin terpasang, editan berkas proyek.

### Kalau catatan diubah di dua tempat sekaligus

Yang **terakhir diubah** yang dipakai — **per catatan**, bukan seluruh berkas. Jadi kalau Anda
mengubah catatan A di PC dan catatan B di HP, **keduanya** tetap tersimpan.

### Kalau ada masalah

| Pesan | Artinya |
|---|---|
| `Tidak tersambung ke server` | internet mati, atau alamat Worker salah |
| `Kunci aplikasi salah` | kunci di ANodes ≠ `KUNCI_APP` di Worker |
| `Token database ditolak` | token Turso salah/kedaluwarsa → buat token baru |
| `Alamat database salah` | `TURSO_URL` bukan bentuk `libsql://…` |

---

## 11. Simpan ke berkas: Impor & Ekspor

> Ada di menu **File ▼**.
> Kegunaan: menyimpan catatan ke berkas · membuka tulisan dari luar · memindahkan PC ↔ HP.

| Item | Fungsi |
|------|--------|
| **⤒ Impor… (.md / .txt)** | Membuka berkas dari luar → masuk ke **catatan yang sedang dibuka**. Ditanya dulu: **OK = ganti isi**, **Cancel = tambah di akhir** |
| **⤒ Impor… (.json)** | Memuat berkas **cadangan** (semua catatan digabung) |
| **⤓ Ekspor .md** | Menyimpan catatan ini sebagai `.md` — nama berkas = **judul catatan** |
| **⤓ Ekspor .txt** | Menyimpan catatan ini sebagai teks biasa (penanda format dibuang) |
| **⤓ Ekspor .pdf** | Membuka **jendela cetak** → pilih **“Simpan sebagai PDF”** |
| **⤓ Cadangan .json** | Mengunduh **semua** catatan jadi 1 berkas cadangan |

## 12. Catatan penting

> 💾 Data tersimpan **di browser** (localStorage). Bekerja juga di **Chrome Android**.
> Tapi data **terpisah per browser/perangkat** — catatan di HP tidak otomatis muncul
> di PC. Untuk menyamakan, gunakan **Ekspor/Impor** (nanti akan ada Sync).

> ⚠️ Jangan hapus "data browsing" Chrome tanpa **⤓ Cadangan .json** dulu.

---

## 13. 🧩 Gudang Plugin — plugin Alkitab (TAHAP 5a, sudah bisa dipakai)

> Tombol **🧩** di kepala (sebelah ⚙), di baris paling atas.

ANodes punya **plugin** seperti di WordPress: tambahan kemampuan yang bisa
**dipasang** dan **dilepas** sesuka hati. Plugin pertama = **Alkitab**.

**Cara memasang:**

```
1. Klik 🧩  →  gudang plugin terbuka. Isinya DUA kelompok:

     ✔ Plugin yg terinstall                 ← yang sudah dipasang, selalu di ATAS
         📖 Alkitab (Terjemahan Baru)

     ▸ Plugin yg tersedia (belum diinstall) ← yang belum dipasang
         🔖 Bookmark Ayat
         🕊️ Pengingat Firman

2. Klik “Alkitab (Terjemahan Baru)”  →  muncul keterangan lengkap:
      • nama, versi, ukuran
      • 66 kitab · 1.189 pasal · 31.102 ayat · 2.059 ayat merah
      • “Yang bisa dilakukan setelah dipasang”
      • “Cara pakai”
      • “Sebelum memasang, perlu diketahui”
3. Baca dulu  →  lalu klik  [⬇ Pasang plugin]
4. Kalau tidak perlu lagi  →  klik kartunya  →  [🗑 Lepas plugin]
```

> 🔼 **Yang sudah dipasang selalu naik ke kelompok atas.** Jadi kalau Alkitab
> tadinya nomor 3, begitu dipasang ia pindah ke paling atas — mudah dilihat.

> ⚡ **Tombol cepat di kartu:** **⬇ Pasang** (langsung pasang tanpa membuka
> keterangan) dan **▶ Buka Alkitab** (setelah terpasang). Tersedia pada 
> 14 Sep 2026.

> ✔ Setelah dipasang, muncul pesan **“📖 Alkitab … siap dipakai”** dan gudang
> **menutup sendiri** — tidak perlu ditutup manual.

> ⚠️ **Pengingat Firman masih rancangan** — bisa dibaca
> keterangannya, tetapi **belum bisa dipasang** (tombol Pasang belum ada).

> ✔ Setelah dipasang, tombol 🧩 jadi **putih** dan ada tulisan jumlah plugin
> terpasang kalau disentuh (mis. “Gudang Plugin (1 terpasang)”).

> 🛡️ **Melepas plugin TIDAK menghapus catatan Anda.** Yang dimatikan hanya
> kemampuan Alkitabnya.

**Yang bisa dilakukan setelah Alkitab terpasang** (dikerjakan bertahap):

| Fitur | Cara pakai |
|-------|-----------|
| **Ayat jadi link berwarna** | ketik `ibrani 11:1` atau `ibr 11:1` di catatan |
| **Baca beberapa ayat sekaligus** | ketik `ibrani 11:1-10` |
| **Buka halaman ayat sebesar catatan** | klik link ayatnya |
| **↩ Kembali ke tempat tadi** | tekan **🏠** → balik + **disorot kuning** tempat tadi diklik |
| **📖 Alkitab & 🧩** | dibuka dari tombol **🧩** di kepala — baca Alkitab penuh / kelola plugin |
| **Cari ayat dengan 3 cara** | ① pilih dari daftar · ② ketik nama ayat · ③ cari lewat sepenggal kata/kutipan |

> ✅ **Keadaan sekarang:** plugin Alkitab **sudah jadi sepenuhnya** — ayat, halaman baca,
> pencarian, tahun merah, semua jalan. Keterangan di atas hanya alur cara memasangnya.

**Contoh “buka – baca – kembali” (nanti):**

```
Catatan:  … seperti tertulis dalam Ibrani 11:1-10 …
                     ↓ klik
          Halaman ayat terbuka (sebesar catatan) → baca
                     ↓ tekan ↩ kembali
          Balik ke catatan → tempat tadi disorot kuning ±4 detik
          → Anda langsung tahu tadi membaca di bagian mana → lanjut
```

> 📌 **Aturan semua plugin:** setiap plugin yang dibuka harus bisa **kembali dan
> mendarat tepat di tempat yang tadi diklik**. Jadi bukan hanya Alkitab — nanti
> plugin istilah-IT, mesin, dan lainnya berlaku sama.

---

## 13b. Baris toolbar & tombol di kepala

> Di bawah bar hitam ada **satu baris saja**: **toolbar tulis**.

```
ANodes          [▦] [⚙] [🧩] [File ▼] [🔍 Cari ▼] [🗂️ Berkas]   ← bar hitam atas
Judul · Kategori: [Umum ▾] · 27 kata                     ← bar info
┌──────────────────────────────────────────────┐
│  TOOLBAR TULIS                                │
│   ↶ ↷  H1 H2 ¶ • List B I ▦ ▬ A ✕ ✅        │
└──────────────────────────────────────────────┘
```

**Tombol di kepala — dua tombol, dua maksud yang jelas:**

| Tombol | Gunanya |
|--------|---------|
| **▦** | **toolbar tulis**: klik = sembunyikan / tampilkan (kalau disembunyikan, ruang tulis jadi luas) |
| **🧩** | **semua urusan plugin** — pasang, buka, lepas (satu halaman) |

> **Alt+klik** tombol ▦ = sembunyikan seluruh baris toolbar.

> 📌 **Yang berubah 14 Sep 2026:** dulu ikon tombol ini **berganti sendiri**
> (jadi 🧩 saat ada plugin dipasang) sehingga terlihat **dua 🧩 berdampingan** —
> membingungkan. Sekarang ikonnya **tetap**: ▦ = toolbar, 🧩 = plugin.
> Kotak logo **[A]** di depan tulisan ANodes juga dibuang supaya lebih lapang.

---

## 3e-c. ↩ Salah edit? Tekan ↶ Batal

> Dua tombol paling kiri di toolbar: **↶** dan **↷**.

| Tombol | Kegunaan | Pintasan |
|--------|----------|----------|
| **↶** (Batal) | Kembalikan tulisan yang tadi salah diedit | `Ctrl+Z` |
| **↷** (Ulangi) | Munculkan lagi yang tadi dibatalkan | `Ctrl+Y` |

- Bisa dipakai berkali-kali (mundur beberapa langkah sekaligus).
- Kalau sudah tidak ada yang bisa dibatalkan, muncul pesan kecil
  *“Tidak ada yang bisa dibatalkan”* — aman, tidak ada yang rusak.
- Saat pindah ke catatan lain, hitungannya mulai dari awal untuk catatan itu.

---

## 3g. 📱 Mau test di HP? Kirim berkas ini

> ⚠️ **Jangan kirim `index.html` saja.** Berkas itu memerlukan berkas lain
> (`css/…`, `js/…`) yang **tidak ikut terkirim** → tampilannya jadi polos
> (seperti tanpa css).

**Yang harus dikirim: berkas `ANodes-1berkas.html`**

```
C:\data\Anodes\
   ├── index.html            (dipakai di PC)
   ├── ANodes-1berkas.html   ← INI yang dikirim ke HP (semua sudah menyatu)
   └── start.bat             (membuka index.html + membuat berkas 1-berkas)
```

**Cara pakainya:**

```
PC  : klik start.bat   →  berkas ANodes-1berkas.html diperbarui otomatis
        ↓
HP  : terima ANodes-1berkas.html (WhatsApp/Telegram/kabel/Google Drive)
        ↓
      buka dengan Chrome  →  tampilan lengkap, siap ditulis
```

> 📌 **Perhatikan:** WhatsApp/Telegram kadang mengubah nama berkas menjadi `.txt`.
> Sebelum dibuka, pastikan namanya tetap berakhiran **`.html`**.
>
> 📌 Kalau `start.bat` ditolak atau Node.js belum ada, jalankan sendiri:
> ```
> cd C:\data\Anodes
> node tools\buat-1-berkas.js
> ```
>
> 📌 Berkas `ANodes-1berkas.html` **sudah memuat isi Alkitab + data kaitan + kamus +
> penguat + peta** (jadi ukurannya **±27,7 MB**).
> Itu wajar — sekaligus membuat HP tidak perlu membaca berkas tambahan.

### 📦 Kalau memakai APK (Android)

Ada **dua** berkas APK di folder `artifacts/`. **Keduanya dulu bernama “ANodes” di HP** —
sekarang sudah dibedakan (K78, 27 Okt 2026):

| Berkas | Nama di HP | Isi | Dipakai? |
|---|---|---|---|
| **`ANodes-webview-debug.apk`** | **ANodes WebView** | membungkus `ANodes-1berkas.html` ⇒ **sama persis** dengan PC | ✅ **INI yang dipakai** |
| `ANodes-NATIVE-K74-lama.apk` | ANodes | aplikasi native Kotlin (K74) — **tampilan berbeda** | ❌ hanya arsip pengembangan |

**Cara memastikan mana yang terpasang di HP** (tanpa membuka menu apa pun):

| Yang terlihat | Berarti |
|---|---|
| Kaki halaman: **`ANodes · Tahap 5 · v3Nov-j`** | ✅ versi **WebView** (benar) |
| Kaki halaman: **`ANodes · Native · Sesi 3`** + tulisan **`SQLite lokal · offline`** | ❌ versi **native** (salah — pasang yang WebView) |

> ⚠️ **Memasang APK native di atas APK WebView akan GAGAL** dengan pesan
> *“Update version code 3 is older than current 4”*. Kalau perlu kembali ke native,
> hapus dulu aplikasinya. Sebaliknya (WebView di atas native) **berhasil** sebagai peningkatan.

#### 🔄 Kalau fitur baru “belum ada” di HP — periksa APK-nya dulu

> ⚠️ **Ini kejadian yang sudah **4×** (K78 · K79 · K95e · **K101**).**
> Berkas proyek sudah diperbarui, tetapi **APK belum dibangun ulang** ⇒ HP masih memakai
> tampilan **LAMA** walau di PC sudah benar.

**Cara memeriksa sendiri (1 perintah):**

```bash
node tools/cek-apk.js
```

| Hasil | Artinya |
|---|---|
| ✅ **ASET BYTE-IDENTIK** + semua penanda ada | APK **sejalan** dengan sumber — aman dipasang |
| ❌ **ASET BERBEDA** + daftar penanda hilang | APK **tertinggal** ⇒ **wajib build ulang** |

**Cara build ulang (2 perintah):**

```bat
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
cd android-native && gradlew.bat clean && build-apk.bat
```

> ⚠️ **`JAVA_HOME` wajib diset di proses yang SAMA** — kalau diset di jendela lain,
> `gradlew` tetap berbunyi *“JAVA_HOME is not set”*.
> ⚠️ **`gradlew clean` wajib** — tanpa clean, berkas dex lama tertinggal dan APK membengkak
> **±10 MB**.
> ⚠️ **`versionCode` wajib dinaikkan** setiap build (sekarang **29**) — kalau sama,
> pemasangan di atas versi lama bisa **gagal**.

**Cara memeriksa tanpa alat:** ekstrak `assets/anodes.html` dari APK, lalu bandingkan
**SHA-256**-nya dengan `ANodes-1berkas.html`. Kalau **beda** ⇒ APK tertinggal.

#### 📱 Kalau menu di HP terpotong / tombol tidak terlihat (K102 — 6 Nov 2026)

> 💬 **Laporan:** di **Z Flip 3** menu atas **terpotong**; di **Note 8** tombol **🔗 ON/OFF
> tidak terlihat**; di **PC terlihat semua**.

**Sebabnya (diukur di APK nyata):** HP melaporkan layarnya **bukan layar sentuh**
(`pointer: coarse` = salah) ⇒ menu besar tidak aktif; dan **bar info boleh menyusut**
⇒ diperas jadi **20,6 px** padahal isinya **29 px** ⇒ **Kategori & 🔗 ON/OFF terpotong**.

**Sudah diperbaiki 6 Nov 2026** — lihat **bagian 1b-b** di atas. Ringkasnya:

| Hal | Sebelum | Sesudah |
|---|---|---|
| Tinggi bar info | **20,6 px** (terpotong) | ✅ **54 px** |
| Kategori & 🔗 ON/OFF | ❌ tidak terlihat | ✅ **terlihat** |
| Tombol kepala | 29 px tanpa tulisan | ✅ **44 px bertulisan** |
| Toolbar tulis | 34 px (1 baris) | ✅ **89 px** (2 baris) |

> ⚠️ **Pastikan yang dipasang APK WebView** (`com.anodes.app.webview` · `versionCode 29`),
> ❌ bukan APK native lama (`com.anodes.app` · `versionCode 4`) — yang lama **tidak** punya
> perbaikan ini. Periksa dengan `node tools/cek-apk.js`.

---

## 3h. 💾 Isi Alkitab sudah masuk (TAHAP 5c)

Setelah plugin Alkitab **dipasang**, ANodes menyiapkan isi Alkitab (66 kitab,
1.189 pasal, **31.102 ayat**). Muncul tulisan:

```
📖 Memuat plugin Alkitab…
[██████████░░░░░░░░]
mohon tunggu sebentar
```

> ⚡ **Cuma sekali.** Setelah itu isi Alkitab **disimpan di perangkat Anda** —
> membuka berikutnya hanya **± 0,04 detik** (tidak perlu membaca ulang berkas 5 MB).

| Hal | Keterangan |
|-----|-----------|
| Tempat simpan | gudang besar browser (IndexedDB) — bukan di internet |
| Ukuran | ± 5 MB data ayat |
| Kirim ke internet? | ❌ tidak — semuanya di perangkat sendiri |
| Kalau plugin dilepas | data tetap tersimpan; tinggal dipasang lagi. Catatan juga aman |

> ✅ Setelah ini Anda bisa langsung: **menulis ayat di catatan jadi tautan biru**,
> **klik untuk membaca**, dan **mencari ayat** — lihat bagian 13d, 13e, 13f di bawah.

---

## 13d. 📖 Ayat jadi tautan di catatan (TAHAP 5d)

> Setelah plugin Alkitab dipasang, **nama ayat yang Anda tulis berubah jadi
> tautan biru bergaris putus-putus**. Ini bekerja sendiri — tidak perlu klik apa-apa.

```
Anda tulis:   Seperti tertulis dalam ibr 11:1-10 dan Mat 5:3
Hasil di layar: Seperti tertulis dalam ibr 11:1-10 dan Mat 5:3
                                     └── biru, bisa diklik ──┘
```

**Cara menulis yang dikenali:**

| Anda tulis | Yang dibuka |
|-------------|-------------|
| `ibrani 11:1` | Ibrani 11:1 (1 ayat) |
| `ibr 11:1` | sama — singkatan pun boleh |
| `ibrani 11:1-10` | Ibrani 11:1 sampai 11:10 (10 ayat) |
| `ibr 11` | seluruh pasal 11 |
| `1 Kor 13:4-5` | 1 Korintus 13:4-5 |
| `mazmur 23` · `mas 23` | Mazmur 23 |
| `Yohanes 3.16` · `why 22:21` | titik maupun titik dua sama saja |
| `mat` · `mar` · `mas` · `kis` · `kej` | singkatan yang lazim dipakai |

> ✍️ **Boleh salah tulis sedikit.** `ibrn`, `mazmur`, `1kor` — tetap dikenali.
> Tapi kalimat biasa tidak akan salah dibaca: `dan 3 orang` **bukan** ayat.

> 🔒 **Catatan Anda tetap aman.** Tanda biru itu hanya tampilan — saat disimpan,
> isi catatan tetap tulisan biasa seperti yang Anda ketik.

> ⚡ **Kursor tidak akan lompat.** Anda bisa mengetik terus sambil tanda birunya
> muncul — posisi menulis tetap di tempat (sudah diuji 49 huruf tanpa lompatan).

---

## 13e. 📖 Cara membaca ayat — klik, baca, kembali (TAHAP 5e)

```
1. Klik tautan biru di catatan
      ↓
2. Terbuka HALAMAN AYAT — sebesar catatan (lebar sama, nyaman dibaca)
      ↓
3. Selesai baca → tekan tombol  ↩  di kiri atas
      ↓
4. Balik ke catatan + tempat yang tadi diklik DISOROT KUNING sebentar (±4 detik)
      ↓
5. Anda langsung tahu tadi membaca di bagian mana → lanjut menulis
```

**Halaman bacanya berbentuk seperti buku Alkitab, dengan toolbar SATU BARIS:**

```
┌──────────────────────────────────────────────────┐
│ [🏠] [Matius ▾] [5 ▾] [◀] [▶] [↩] [📋 PILIH]     │
│                                        [🔍 Cari] │
├──────────────────────────────────────────────────┤
│ Matius 5                                         │
│ 48 ayat                                          │
│ ──────────────────────────────────────────────── │
│ 1  Ketika Yesus melihat orang banyak itu…        │
│ 2  Maka Yesuspun mulai berbicara dan mengajar…   │
│ 3  "Berbahagialah orang yang miskin…"   ← MERAH  │
│ …                                                │
└──────────────────────────────────────────────────┘
```

| Tombol | Gunanya |
|--------|---------|
| **🏠** | balik ke catatan + tempat yang tadi diklik **disorot kuning** (dulu tulisan “↑ kembali”) |
| **[Kitab ▾]** | ganti kitab (66 kitab) — otomatis mulai pasal 1 |
| **[Pasal ▾]** | ganti pasal (angkanya saja) |
| **◀ / ▶** | pasal sebelum / sesudahnya (mati sendiri di ujung) |
| **↩** | kembali ke pasal yang tadi dibuka |
| **📋 PILIH** | pilih cepat: kitab → pasal → ayat (kotak-kotak seperti daftar isi) |
| **🔍 Cari** | satu kotak: ketik **nama ayat** atau **kata/kutipan** |

> ⌨ **Dulu ada tombol “↑ kembali” dan “⌨ KETIK”.** Sekarang **“↑ kembali” jadi 🏠**
> (hemat ruang) dan **⌨ KETIK disatukan** ke **🔍 Cari** — satu kotak untuk dua keperluan.
> Tekan **Ctrl+B** juga bisa balik ke catatan.

**📋 PILIH — kotak-kotak seperti daftar isi:**

```
┌── Pilih Kitab ──────────────────────┐
│ [Kej] [Kel] [Im ] [Bil] [Ul ] [Yos] │
│ [Hak] [Rut] [1Sam][2Sam][1Raj][2Raj]│
│ …                                    │
│ [Mat] [Mrk] [Luk] [Yoh] [Kis] [Rom] │  ← Perjanjian Baru berlatar gelap
│ …                                    │
└──────────────────────────────────────┘
   ↓ pilih kitab  → muncul nomor pasal 1,2,3,…
   ↓ pilih pasal  → muncul nomor ayat 1,2,3,…
   ↓ pilih ayat   → ayat itu langsung terbuka & disorot
```

**🔍 Cari — satu kotak untuk dua keperluan:**

```
┌── 🔍 Cari ───────────────────────────┐
│ [ibr 11:1-10                      ]  │
│                                       │
│ 📖 Buka Ibrani 11:1-10               │  ← kalau itu nama ayat
└───────────────────────────────────────┘

┌── 🔍 Cari ───────────────────────────┐
│ [kasih                            ]  │
│                                       │
│ 🔍 Cari ayat yang memuat "kasih"     │  ← kalau itu kata biasa
└───────────────────────────────────────┘
```

> 📌 Kalau ada dua tautan yang tulisannya sama, sorot tetap tepat pada yang tadi
> Anda klik (memakai hitungan urutan, bukan hanya tulisan).

---

## 13f. 📚 Baca Alkitab penuh + 3 cara mencari (TAHAP 5f)

**Dua tombol besar di toolbar halaman baca: 📋 PILIH dan 🔍 Cari.**
(Buka halaman baca lewat tombol **🧩 → ▶ Buka Alkitab**, atau klik nama ayat di catatan.)

### Cara 1 — 📋 PILIH (pilih dari daftar)

> Tekan **📋 PILIH** → muncul kotak-kotak: pilih kitab → pilih pasal → pilih ayat.
> Ayat yang Anda pilih langsung terbuka & disorot.

### Cara 2 — 🔍 Cari: ketik nama ayat

> Tekan **🔍 Cari**, lalu tulis `why 22:21` → muncul tombol
> **📖 Buka Wahyu 22:21** → klik.

### Cara 3 — 🔍 Cari: lewat kata / kutipan

> Di kotak yang **sama**, tulis sepenggal kata: `kasih` · `iman adalah dasar` · `gembala`
> → muncul tombol **🔍 Cari ayat yang memuat "kasih"** → klik.
>
> 💡 Jadi **⌨ KETIK + 🔍 Cari sekarang satu tombol saja** — ANodes sendiri
yang menebak: nama ayat, atau kata biasa.

```
Hasil: “kasih”
   63 kitab · 720 ayat — diurutkan per kitab:
   📖 Kejadian — 12 ayat
      Kej 37:3 Israel lebih mengasihi Yusuf dari semua anaknya…
   📖 Keluaran — 8 ayat
      …
```

- Hasil **dikelompokkan per kitab** — tinggal klik nama ayatnya untuk membuka.
- Pencocokan **“termuat”**: mencari `kasih` juga menemukan **mengasihi**,
  **kasihnya** (sesuai kesepakatan: cukup sama & mirip).
- Ditampilkan **maksimal 40 ayat per kitab** supaya tetap ringan.

> 💡 **Bisa juga lewat dua daftar di toolbar:** ganti **[Kitab ▾]** lalu **[Pasal ▾]** —
> cocok kalau sudah tahu mau baca kitab mana.
---

## 13g. 🔧 Kalau 📋 PILIH atau 🔍 Cari “tidak jalan”

Ini **sudah diperbaiki** (13 Sep 2026). Dulu tombol itu diam saja setelah
halaman di-refresh. Sekarang:

- Saat halaman dibuka, ANodes **menyiapkan sendiri** data Alkitab —
  muncul tulisan **“📖 Menyiapkan plugin Alkitab…”** sebentar.
- Kalau Anda menekan **📋 PILIH**/**🔍 Cari** terlalu cepat, muncul pesan
  **“⏳ Menyiapkan data Alkitab…”** — datanya dibuka otomatis, jadi tidak perlu
  menekan tombol “Pasang” lagi.
- Kalau plugin memang belum dipasang, muncul pesan
  **“💡 Pasang plugin 📖 Alkitab dahulu”** (bukan diam).

---

## 13h. 🗂️ Tombol **[Berkas]** — daftar berkas tersimpan (K28h · 3 Nov 2026)

> Tombol **`🗂️ Berkas`** ada di **paling kanan** bar hitam atas.

```
ANodes  Tahap 5  ●   [▦] [⚙] [🧩] [File ▼] [🔍 Cari ▼] [🗂️ Berkas]   ← bar hitam atas
                      ↑    ↑    ↑
              toolbar  setting  semua urusan plugin
```

Klik **Berkas** → terbuka halaman berisi **daftar berkas tersimpan** — yaitu
**rantai 🌿 Ayat Terkait** yang pernah Anda susun di halaman kerja.

```
┌──────────────────────────────────────────────┐
│ [🏠] 🗂️ Berkas Tersimpan  [🌿 Kerja] [🗑]    │  ← toolbar halaman
├──────────────────────────────────────────────┤
│ Roma 4:3                                     │
│ 3 ayat · diubah 17 Sep 12:25                 │
│        [🌿 Buka]  [ + Ayat ]  [🗑]           │
│ Kejadian 1:1                                 │
│ 5 ayat · diubah 18 Sep 09:10                 │
│        [🌿 Buka]  [ + Ayat ]  [🗑]           │
└──────────────────────────────────────────────┘
```

| Tombol | Gunanya |
|--------|---------|
| **🏠** | balik ke catatan (`Esc` / `Ctrl+B` juga bisa) |
| **🌿 Kerja** | buka halaman kerja 🌿 (rantai terakhir) |
| **🗑 Bersihkan** | buang **semua** berkas tersimpan (ditanya dulu) |
| **🌿 Buka** | buka rantai itu di halaman kerja untuk ditelusuri lagi |
| **+ Ayat** | **kirim isi rantai ke catatan** — pindah ke catatan, klik tempat yang diinginkan, lalu tekan **`[ + Ayat ]`** di bar info |
| **🗑** | hapus berkas itu saja |

> 💡 **Dulu daftar ini ada di dalam menu `[Doc]`.** Sejak 3 Nov 2026 menu `[Doc]`
> **dihapus** (aplikasi sudah hampir selesai, berkas kerja proyek tidak perlu dibaca
> dari dalam aplikasi lagi) — dan daftar berkas tersimpan **dipindah ke halaman ini**.
> Berkat itu berkas aplikasi untuk HP **mengecil 2,29 MB**.

> ⚠️ **Yang tetap bekerja seperti biasa:** **Impor `.md`/`.txt`** (File → ⤒ Impor…),
> tombol **“📖 Rapi”** di bar info, dan **rapikan naskah tempelan** — ketiganya memakai
> pengolah markdown yang sama, yang sekarang tinggal di `js/markdown.js`.

---

## 13i. 🧩 Tombol plugin di toolbar tulis (K18)

> Permintaan Anda: *“tambahan di toolbar editor… [🧩] kalau dipulldown dari menu,
> keluar yang plugin yang sudah terinstall saja.”*

Tombol **`🧩 ▼`** sekarang ada di **ujung kanan toolbar tulis**:

```
[↶][↷][¶ ▼][• ▼][B][I][▦ ▼][▬ ▼][A ▼][✕][✅ ▼][🧩 ▼]
                                              ↑ tombol baru
```

**Kalau panah ▼ ditekan:**

```
┌────────────────────────┐
│ 📖  Alkitab         ›  │  ← HANYA plugin yang sudah terinstall
│ 🧩  Gudang Plugin…     │  ← ke gudang (pasang / lepas plugin)
└────────────────────────┘
```

- Klik nama pluginnya (mis. **📖 Alkitab**) → **langsung terbuka** halaman bacanya.
- Belum ada plugin dipasang? Yang muncul tulisan **“Belum ada plugin terpasang.”** —
  jadi jelas, bukan menu kosong.
- Tombol ini **tidak sama** dengan tombol 🧩 di bar hitam atas:
  - **🧩 di toolbar tulis** = jalan pintas ke plugin yang **sudah dipasang**.
  - **🧩 di bar hitam atas** = **gudang plugin** (tempat memasang / melepas).

> 📌 **Toolbar tetap 1 baris.** Walau tombolnya jadi 12, toolbar tetap **satu baris**
> di semua ukuran layar (HP kecil sampai PC). Caranya: di layar sempit tulisan
> **“• List” berubah jadi “•”** dan **“1. List” jadi “1.”** — tombolnya tidak dihapus,
> hanya tulisannya disingkat supaya muat.

---

## 13j. 🔗 Plugin **Ayat Terkait** (K25 — selesai 14 Sep 2026 · **logika lab2 & HALAMAN KERJA selesai 15 Sep 2026**)

> ⚠️ **15 Sep 2026 — PENTING:** sekarang kaitan disusun di **HALAMAN KERJA tersendiri**.
> Anda: *“halaman kerja ayat terkait **bukan kembali pada ANodes** .. belum dipindahkan
> ke note utama atau home”*. Jadi tekan **`✓ pilih`** → **pindah** ke halaman kerja
> (halaman ke-3), ❌ **bukan** ke catatan.
>
> ```
>  ① Catatan          → tempat Anda menulis (note/home)
>  ② Baca pasal       → ada tombol “ayat terkait (n)”
>  ③ KERJA AYAT 🆕    → meja kerja: susun + simpan rantai
> ```
>
> Rantai itu **disimpan dengan nama** (bawaan = **ayat utama**). Hasilnya = **bahan
> mentah** (urutan ayat) yang **belum** jadi catatan — nanti **dipanggil** ke catatan
> untuk diolah jadi kalimat (tahap **K32**).

> Ini fitur yang **tertinggal** dari lab3. Kata Anda: *“di alkitab ada satu fitur
> yg tertinggal… mungkin saya akan jadikan plugin saja… km bisa akses ke lab3…
> alkitab setiap ayat rata2 punya ayat terkait — ayat di alkitab sekarang tidak
> tersedia ayat terkait.”*

Sekarang sudah ada — dan sejak **15 Sep 2026** kaitannya **tertutup dulu** (tombol).

### Bentuknya di halaman baca (✅ diperbarui 15 Sep 2026)

Kaitan **TIDAK langsung terbuka**. Di bawah tiap ayat hanya ada **tombol kecil** —
supaya bacaan **ayat 1 ke ayat 2 tetap rapat** (tidak berjarak jauh karena terselip daftar).
Klik tombolnya → barulah kaitannya terbuka.

```
 1  Tentang kedatangan Tuhan kita Yesus Kristus…
    [ ayat terkait (10) ]        ← TOMBOL (tertutup dulu)

 2  supaya kamu jangan lekas bingung dan gelisah…
    [ ayat terkait (25) ]        ← ditekan?
                  ▼ terbuka:
    ┌────────────────────────────────┐
    │ Ayat terkait (25)            ✕ │
    │ [Ulangan 13:1-5] [Yesaya 7:2]  │
    │ [Yesaya 8:12-13] [Yesaya 26:3] │
    │ … (25 kaitan, urut urutan kitab)
    └────────────────────────────────

 3  Janganlah kamu memberi dirimu disesatkan…
    [ ayat terkait (16) ]
```

- **Terukur:** jarak ayat 1 → ayat 2 = **±6px** saja (dulu terselip chip + blok).
- **Kaitan diurut menurut urutan Alkitab** (Kejadian dulu, lalu Matius, Markus …)
  supaya mudah dicari dengan mata.

### Alur memakai kaitan — ADA 3 LANGKAH (✅ baru 15 Sep 2026)

Kaitan **tidak langsung jadi tetap** saat diklik. Ada langkah **melihat dulu**,
baru **dipilih** — supaya Anda tidak salah pilih:

```
 ① KLIK satu kaitan     →  PRATINJAU
                            • ayatnya ditampilkan dulu (belum jadi tetap)
                            • di bawahnya ada nama kaitan lanjutan ABU-ABU
                              (memang belum bisa diklik — &#34;wajib pilih dulu&#34;)
                            • hanya SATU kotak pratinjau (klik kaitan lain → ganti)

 ② TEKAN `✓ pilih`      →  KOMIT (jadi tetap)
                            • deretan kaitan berubah jadi LABEL JEJAK,
                              dipisah koma:  Markus 13:27, Matius 24:31
                            • baris kaitan MENUTUP lagi (rapat)
                            • ayatnya muncul jadi BLOK PUTIH di bawah
                            • 1 jalur tercatat di 🕒 Riwayat Jalur

 ③ LANJUT (kalau mau)   →  di dalam blok itu ada tombol `ayat terkait (n)` lagi
                            → rantai bisa diteruskan sampai dalam
```

### 🔵 TOMBOL `[Full]` — BACA AYAT ITU DI ALKITAB (baru 30 Okt 2026 · K80)

Di kepala kotak pratinjau sekarang ada **tiga tombol**:

```
┌──────────────────────────────────────────────┐
│ Bil 6:24-26    ✓ pilih    Full    ✕          │
├──────────────────────────────────────────────┤
│ 24 TUHAN memberkati engkau dan melindungi…   │
│ 25 TUHAN menyinari engkau dengan wajah-Nya…  │
│ 26 TUHAN menghadapkan wajah-Nya kepadamu…    │
└──────────────────────────────────────────────┘
```

| Tombol | Gunanya |
|---|---|
| **`✓ pilih`** | jadikan ayat ini **tetap** & lanjutkan rantai (seperti biasa) |
| **`Full`** 🆕 | **lompat ke Alkitab** pada ayat itu — **seluruh pasalnya bisa dibaca** |
| **`✕`** | tutup pratinjau |

**Apa yang terjadi saat `Full` ditekan:**

```
 ① Pindah ke halaman baca Alkitab — mis. BILANGAN 6 (27 ayat, bisa dibaca semua)
 ② Ayat 24-26 DISOROT + BERKEDIP ±5 detik  ← supaya Anda tahu posisinya
 ③ Sesudah kedip selesai, sorotnya TETAP (tidak hilang) selama Anda membaca
 ④ Tekan 🏠  ⇒ kembali ke BACAAN SEBELUMNYA (mis. 2 Petrus 1)
 ⑤ Tekan 🏠 lagi ⇒ kembali ke CATATAN
```

| Yang perlu diketahui | Keterangan |
|---|---|
| **Kedip 5 detik** | 10 kali kedip cepat. Kalau perangkat disetel “kurangi gerak”, sorotnya **langsung tetap** tanpa kedip |
| **🏠 dua tingkat** | pertama ke bacaan sebelumnya, kedua ke catatan — jadi Anda tidak kehilangan tempat |
| **Pindah pasal biasa** | kalau Anda sendiri yang pindah pasal, ingatan “bacaan sebelumnya” **dibuang** (🏠 langsung ke catatan) |
| **Hanya di pratinjau** | tombol `Full` ada di **pratinjau halaman baca** saja — ❌ tidak di halaman kerja 🌿 |
| **Plugin dilepas** | tombol `Full` ikut hilang · **Alkitab & catatan tetap utuh** |

### 🖐 MEMILIH BEBERAPA AYAT SEKALIGUS — “MODE GRUP” (baru 17 Sep 2026 · K37)

Kalau Anda ingin melihat **ayat terkait dari beberapa ayat sekaligus** (misalnya
**Roma 4:2-4**), caranya:

```
HALAMAN BACA — Roma 4

 2  Sebab jika Abraham …              ← klik angka 2 → tersorot
 3  Sebab …                            ← klik angka 3 → tersorot
 4  …                                  ← klik angka 4 → tersorot

    [ayat terkait (21)] [ayat terkait (15)] [ayat terkait (4)]
         ↑ tanda 🔗 = pintu masuk GRUP (muncul kalau ada 2 ayat atau lebih tersorot)
         │ tekan salah satu
         ▼
HALAMAN KERJA 🌿

    [2] [3] [4]        ← baris pemilih grup (nomor yang dipilih berwarna biru)
     │ klik 3 → kolom di bawahnya = ayat terkait ROMA 4:3 saja (15 kaitan)
     │ klik 2 → kolom berganti = Roma 4:2 saja (21 kaitan)   ← bisa bolak-balik
     │ (belum ada blok apa pun selama belum menekan ✓ pilih)
     ▼
    klik satu kaitan → PRATINJAU → `✓ pilih`
     ⇒ Roma 4:3 jadi AKAR rantai · ayat yang dipilih TURUN jadi blok pertama
       ⇒ sesudah itu jalannya sama seperti biasa (telusuri ayat demi ayat)
```

| Yang perlu diketahui | Keterangan |
|---|---|
| **Alur satu ayat TIDAK berubah** | kalau cuma **satu** ayat tersorot, tombol `ayat terkait (n)` tetap membuka daftar **di tempat** seperti biasa |
| **Angka di atas tiap tombol** | jumlah ayat terkaitnya — diukur dari data: Roma 4:2 = **21** · 4:3 = **15** · 4:4 = **4** |
| **Bisa ganti-ganti** | klik nomor lain → kolom kaitan berganti. **Belum tersimpan apa-apa** sampai `✓ pilih` ditekan |
| **Setelah `✓ pilih`** | baris nomor itu **hilang** (tugasnya selesai) — yang tinggal rantai ayat seperti biasa |
| **Batalkan** | tekan **[🗑]** saat masih di baris nomor → grup dibatalkan, kembali ke halaman baca (tidak ada berkas yang dibuat) |
| **Pilih ayatnya** | klik **angka ayat** di halaman baca (angka yang sama diklik dua kali = dilepas) |

> 🆕 **Diperbarui 17 Sep 2026 (K38 · K39):** setelah masuk halaman kerja, **kalimat ayat yang
> dipilih ikut tampil** — jadi Anda tahu ayat 2/3/4 itu bunyinya apa sebelum memilih kaitan.
> Mulai 17 Sep 2026 **seluruh tampilan plugin Ayat Terkait memakai nama kitab SINGKAT**
> supaya hemat tempat:
>
> | Panjang | Singkat |
> |---------|---------|
> | Matius 24:31 | **Mat 24:31** |
> | Markus 13:27 | **Mrk 13:27** |
> | Kejadian 12:12-13 | **Kej 12:12-13** |
> | 2 Korintus 1:2 | **2Ko 1:2** |
>
> Jika Anda menyorot mouse ke tombolnya, muncul **nama panjang** sebagai keterangan —
> jadi tetap bisa dipastikan ayat yang mana.
> ⚠️ Yang **satu ayat** pun sudah singkat (K39). **Halaman baca Alkitab** (judul pasal
> `Matius 5`) dan **bar paket** tetap seperti semula.

### 📥 MEMINDAHKAN HASIL RANTAI KE CATATAN — “insert ayat” (baru 17 Sep 2026 · K40)

Kalau rantai ayat sudah tersimpan di halaman kerja 🌿, isinya bisa **dimasukkan ke catatan**:

```
① 🗂️ Berkas → daftar berkas tersimpan

     Roma 4:3
     3 ayat · diubah 17 Sep 12:25      [🌿 Buka]  [ + Ayat ]  [🗑]
                                                      ↑ tekan ini

② ⇒ otomatis PINDAH ke halaman CATATAN (ayat dipegang dulu, belum dimasukkan)
      bar info:  Catatan Baru · Kategori:[Umum] · 0 kata · [ + Ayat ]

③ KLIK di tulisan → tentukan LETAK ayat mau ditaruh di mana

④ tekan [ + Ayat ] di bar info  ⇒ ayat MASUK di tempat itu (+ disorot kuning)
```

**Kalau salah tempat:**

| Tombol | Guna |
|--------|------|
| **↶ Batalkan** | Ayat **diangkat kembali** — Anda bisa klik tempat lain lalu masukkan lagi |
| **❌ Selesai** | Sudah pas → bar paket tutup, toolbar tulis kembali seperti semula |

**Pilihan bentuk masukan** (ada di bar kuning di atas toolbar):

| Tombol | Guna |
|--------|------|
| **💬 Kalimat** | Hidup = **kalimat ayat ikut** dimasukkan (bukan cuma namanya). Mati = nama ayat saja |
| **Singkat ⇄ Panjang** | Bentuk nama ayat — mis. `Rom 4:3` ⇄ `Roma 4:3`. Pilihannya **diingat** |

> 💡 **Tombol `[ + Ayat ]` di bar info hanya muncul saat ada rantai yang dipegang.**
> Jadi di waktu menulis biasa, bar info tetap sederhana seperti sekarang.
> ⚠️ **Catatan Anda tidak pernah rusak** — kalau dibatalkan, tulisan yang sudah ada tetap utuh.

**Tombol-tombol kecil di blok putih:**

| Tombol | Guna |
|--------|------|
| 📍 | Tunjukkan ayat itu di **🕒 Riwayat Jalur** (disorot kuning) |
| ✕ | **Hapus ayat itu + SEMUA cabang di bawahnya** — ditanya **2 kali** dulu, dan langkah kedua **mendaftar** ayat apa saja yang ikut terhapus. ❌ tidak bisa dibatalkan |
| `kaitan lainnya (n)` | Buka lagi deretan kaitan (kalau mau memilih kaitan lain) — **label jejak tetap** ada |

**🕒 Riwayat Jalur** (kotak kecil di bawah judul pasal): tiap `✓ pilih` = 1 baris
riwayat. Klik salah satu namanya → blok ayat itu **disorot kuning** dan digulir ke layar.

**Garis hijau** di tepi kiri sebuah blok = **posisi sekarang** (ayat yang terakhir Anda pilih).

### Apa ini?

Setiap ayat di Alkitab ternyata punya **kaitan dengan ayat-ayat lain** — seperti
“rantai ayat”. Contohnya **2 Tesalonika 2:1** berkaitan dengan *Kejadian 49:10,
Matius 24:31, Markus 13:27, 1 Tesalonika 4:14-17, 2 Timotius 4:1*, dan lain-lain.

- **Klik satu kaitan** → ayatnya **ditampilkan dulu (pratinjau)**; kaitan yang berupa
  beberapa ayat (mis. **1 Tesalonika 4:14-17**) ditampilkan **keempat ayatnya**.
  Kalau sudah cocok → tekan **`✓ pilih`** supaya jadi **blok tetap** di bawah.
- **Tekan `✓ pilih` → PINDAH ke HALAMAN KERJA** (lihat bagian di bawah).
  Di halaman baca, kaitan lama tidak menumpuk di dalam pasal — pasal tetap **rapi**.
- Perkataan Yesus tetap **merah** di dalam ayat kaitan.

### Cara memasang

1. Tekan **🧩** di bar hitam atas → **Gudang Plugin**.
2. Pilih **🔗 Ayat Terkait** → tekan **⬇ Pasang** (butuh beberapa detik, datanya 5,2 MB).
3. Baca Alkitab seperti biasa — tombol **`ayat terkait (n)`** muncul di bawah ayatnya.

> ⚠️ Plugin ini **menumpang plugin 📖 Alkitab**: teks ayatnya diambil dari sana.
> Jadi **pasang 📖 Alkitab dulu**, baru 🔗 Ayat Terkait.

### Dua cara tampil (bisa Anda pilih)

Buka **🧩 → 🔗 Ayat Terkait** (halaman keterangannya), di situ ada pilihan:

| Pilihan | Bentuknya |
|---------|-----------|
| **✔ Cukup tombol kecil** (**bawaan** 15 Sep 2026) | hanya tombol **“ayat terkait (n)”** — halaman tetap rapi, kaitan dibuka kalau ditekan |
| **Langsung tampil** | daftar kaitan langsung terbuka di bawah setiap ayat — halaman jadi lebih panjang |

> Pilihannya **diingat** — tidak perlu diatur ulang tiap kali membuka ANodes.
> Kalau pilihan dihapus/reset, kembali ke **bawaan: tombol kecil (tertutup)**.

### 📥 IMPOR `.md` → TAMPIL MUDAH DIBACA (baru 16 Sep 2026 — K36)

Kalau Anda mengimpor berkas `.md` besar (mis. `rencanakerja.md`) ke catatan,
sekarang isinya **tampil rapi mengikuti layar** — bukan lagi paragraf raksasa:

```
File → ⤒ Impor… (.md · .txt · .json)  →  pilih rencanakerja.md
   →  OK = ganti isi catatan   /   Cancel = tambah di akhir
   →  isi masuk RAPI: judul · tabel · kutipan · blok kode · daftar
```

**Tombol baru “📖 Rapi” di bar info catatan:**

```
Catatan Pertama · Kategori: [Umum ▾] · 27 kata        [📖 Rapi]
                                                       ↑ muncul kalau isinya masih markdown mentah
```

| Tombol | Guna |
|--------|------|
| **📖 Rapi** | Tampilkan catatan ini **rapi** (judul, tabel, kutipan, blok kode). **Hanya untuk membaca** — tulisan tidak bisa diubah selama mode ini |
| **✏️ Tulis** | Kembali ke tulisan biasa (bisa diedit lagi). Isi aslinya **tidak pernah berubah** |

> ⚠️ **Isi catatan Anda AMAN.** Saat mode baca, penyimpanan otomatis **berhenti**
> (yang tampil adalah hasil olahan). Begitu keluar mode baca, isi aslinya kembali **persis**.
>
> 💡 **Catatan lama juga bisa:** isi catatan lama (yang sudah berbentuk tulisan biasa)
> diubah dulu ke bentuk markdown, baru ditampilkan rapi.
>
> 📌 **Tombol 📖 Rapi hanya muncul** kalau isi catatan memang berbentuk dokumen
> (ada tabel / kutipan / blok kode / banyak judul). Catatan biasa tidak terganggu.

### � BERKAS `.md` YANG ISINYA KODE HTML (diperbaiki 20 Sep 2026 — K49)

**Gejala:** setelah impor, di catatan **terlihat tulisan aneh** seperti
`<h3>Judul</h3>` dan `<p>Alkitab tidak jatuh…</p>` — seolah kode HTML-nya ikut tampil.

```
KAPAN MUNCUL:  berkas .md yang isinya sebenarnya KODE HTML
CONTOH       :  <h3>Pengantar Sejarah Alkitab</h3>
                <p>Alkitab tidak jatuh dari langit…</p>
```

**Sebabnya:** berkas itu **isinya HTML**, bukan markdown. Pengolah ANodes
menganggapnya markdown → tanda `<` diubah jadi `&lt;` supaya aman → **jadi tampil sebagai tulisan**.

**Sekarang sudah diperbaiki** — ANodes **mengenali** bahwa isinya HTML, lalu
**mengubahnya dulu** ke bentuk yang rapi:

| Sebelum | Sesudah |
|---------|---------|
| `<h3>Judul</h3>` tampil sebagai tulisan | ✅ jadi **judul** sungguhan |
| `<p>…</p>` tampil sebagai tulisan | ✅ jadi **paragraf** |
| Semua isi menumpuk jadi 1 blok raksasa | ✅ terbagi rapi |
| `<b>tebal</b>` tampil mentah | ✅ jadi **tebal** sungguhan |
| `<i>miring</i>` tampil mentah | ✅ jadi **miring** sungguhan |
| `&nbsp;` ikut terlihat | ✅ hilang |
| Daftar `<li>` hilang | ✅ jadi daftar |

> ⚠️ **Yang TIDAK berubah:** berkas **markdown biasa** tetap diolah seperti dulu —
> judul `#`, daftar `-`, tebal `**…**`, tabel `| … |`, blok kode ```` ``` ````,
> dan baris tulis `____` semuanya **aman**. Sudah diuji (uji **K49-10…K49-14**).
>
> 💡 **Berlaku juga untuk TEMPEL (Ctrl+V).** Kalau Anda menyalin kode HTML dari
> Google AI lalu menempelkannya di catatan, hasilnya kini **langsung rapi** —
> tidak lagi tampil sebagai kode. Kalau ingin bentuk aslinya, tekan **↶ (Ctrl+Z)**.

### �🌿 AYAT TERKAIT UNTUK SATU RENTANG AYAT (baru 16 Sep 2026 — K34)

Kalau di catatan Anda ada tautan **berentang** (mis. `Roma 8:6-10`), halaman baca
menampilkannya **rapi** — tidak setiap ayat diberi tombol “ayat terkait” sendiri:

```
Roma 8
 6  Karena keinginan daging …          ← TIDAK ada tombol di bawah tiap ayat
 7  sebab keinginan daging …
 8  Mereka yang hidup dalam daging …
 9  Tetapi kamu tidak hidup …
10  Jika Kristus ada di dalam kamu …

    [6] [7] [8] [9] [10]               ← SATU baris pemilih, hanya di bawah ayat terakhir
     │ Anda klik 7
     ▼
    ┌──────────────────────────────────┐
    │ Ayat terkait Roma 8:7 (25)     ✕ │
    │ [Keluaran 20:5] [2 Tawarikh 19:2] … │ ← kaitan ayat 7 saja
    └──────────────────────────────────┘
```

| Hal | Keterangan |
|-----|------------|
| **Baris pemilih** | Hanya **satu baris** `[6][7][8][9][10]` di bawah ayat terakhir rentang |
| **Nomor yang dipilih** | Ditandai **biru** — supaya jelas kolom di bawahnya milik ayat mana |
| **Klik nomor lain** | Kolom kaitan **berganti** ke ayat itu (mis. klik `[6]` → 16 ayat) |
| **Ayat di luar rentang** | Tetap seperti biasa — punya tombol `ayat terkait (n)` sendiri |
| **`✓ pilih`** | Masuk ke **halaman kerja** dengan akar = **ayat yang Anda pilih** (mis. `Roma 8:7`) |
| **Rentang panjang** | `[6]…[20]` tetap **satu baris** — tidak merusak tampilan |

> 💡 **Kenapa tidak digabung jadi satu kolom besar?** Kalau 5 ayat digabung, kaitannya
> jadi **114 chip** dan **asal-usulnya hilang** (tidak tahu itu dari ayat 6 atau 9).
> Dengan cara ini, tiap ayat paling banyak **±29 chip** — ringan dan jelas.

### 🌿 HALAMAN KERJA AYAT TERKAIT (baru 15 Sep 2026)

Ini **halaman ke-3** — **meja kerja** tempat Anda menyusun urutan ayat.

```
① Catatan (tempat menulis)  →  ② Baca pasal  →  [ayat terkait (12)]
   → pilih satu kaitan → [✓ pilih]  →  PINDAH ke ③ HALAMAN KERJA
```

**Bentuk halaman kerja:**

```
 🏠  🌿 Ayat Terkait                    [📥 Pakai] [🆕] [⬆]   💾 tersimpan · 2 ayat
 ───────────────────────────────────────────────────────────────────────────
 📛  [ 2 Korintus 1:2                     ]  [💾 Simpan]
 ───────────────────────────────────────────────────────────────────────────
 🧭  2 Korintus 1:2  →  Roma 1:7        · nama: 2 Korintus 1:2
 ───────────────────────────────────────────────────────────────────────────
 ┌ 🕒 Riwayat Jalur ───────────────────┐
 │ 1. 2 Korintus 1:2 → Roma 1:7        │
 └────────────────────────────────────┘

 📖 2 Korintus 1:2   📍   akar          ← AYAT UTAMA (akar rantai)
    2 Kasih karunia dan damai sejahtera …
    [2 Samuel 15:20] [Roma 1:7] [1 Korintus 1:3] …   ← klik = lihat dulu

   📖 Roma 1:7        📍   ✕             ← hasil ✓ pilih (bertumpuk di bawah)
      7 Kepada kamu sekalian yang tinggal di Roma …
      [Ulangan 33:12] [Mazmur 60:5] [Matius 5:16] …   ← lanjut telusuri
```

| Tombol | Guna |
|--------|------|
| **🏠** | Keluar — kembali ke **halaman baca pasal** (bukan ke catatan). Rantai sudah tersimpan. |
| **📛 nama** | Beri nama rantai. **Bawaan = ayat utama** (`2 Korintus 1:2`); boleh diganti judul sendiri (mis. `Kasih karunia`). |
| **💾 Simpan** | Simpan sekarang. Sebenarnya **tersimpan sendiri** (lihat di bawah). |
| **🆕** | Mulai rantai baru (yang lama tetap tersimpan). |
| **⬆** | Ke atas (akar rantai) — supaya tidak tersesat kalau rantainya panjang. |
| **📍** di blok | Tunjukkan ayat itu di **🕒 Riwayat Jalur**. |
| **✕** di blok | Hapus ayat itu + **semua cabang di bawahnya** — ditanya **langsung di situ** (bukan kotak melayang). |
| **🗑 Buang** | **Kosongkan meja kerja DAN hapus berkasnya** dari daftar simpanan. Guna-nya untuk membuang hasil percobaan/tes yang tidak dipakai. Ditanya **langsung di situ** dulu. |
| **✕ di 🕒 Riwayat Jalur** | **Bersihkan riwayat** (daftar jalan yang sudah dilewati). ⚠️ **Ayat & rantainya TIDAK terhapus** — hanya daftar jalurnya yang dikosongkan. |
| **📥 Pakai** | Pakai rantai ini di catatan — **tahap berikutnya (K32)**, sekarang belum. |

> 🧹 **Kalau banyak berkas tes menumpuk:** buka **🗂️ Berkas** (kepala) →
> tekan **[🗑 Bersihkan semua]** — semua berkas rantai di daftar dibuang sekaligus.
> ⚠️ **Catatan Anda TIDAK tersentuh** — yang dibuang hanya daftar ayat (bahan mentah).

**Tersimpan sendiri — kapan?**
- Setiap perubahan → disimpan **tertunda ±1 detik**.
- Kalau rantai sudah **lebih dari 3 tingkat**, disimpan **langsung**.
- Saat keluar halaman → **disimpan otomatis**.
- Nama bawaan = **ayat utama**; kalau Anda tidak mengisi apa-apa, nama itu tetap dipakai.

**Melihat daftar rantai yang sudah disimpan:**

```
Tombol [🗂️ Berkas] (kepala)  →  tampil daftar berkas tersimpan
   →  nama · jumlah ayat · tanggal
   →  [🌿 Buka] = lanjutkan menyusun   ·   [ + Ayat ] = kirim ke catatan   ·   [🗑] = hapus
```

> 💬 Rantai itu **bahan mentah** (urutan ayat), **belum** jadi catatan — memang belum
> dipindahkan ke catatan/home. Nanti di **K32** baru bisa **dipanggil** ke catatan
> untuk diolah jadi kalimat.

### Yang perlu diketahui

- Data kaitan disimpan **di perangkat ini saja** (tidak dikirim ke internet).
- Rantai yang tersimpan juga **di perangkat ini saja** — belum pindah PC ↔ HP.
- Ukuran datanya **5,2 MB** — memasang butuh beberapa detik, berikutnya cepat.
- Bisa **dilepas kapan saja** — **catatan Anda tidak akan hilang**.
- Sumber kaitan: **OpenBible.info Cross-References** (lisensi CC-BY) —
  **29.363 ayat · 344.100 kaitan**.
- Kalau plugin ini **belum dipasang**, halaman baca Alkitab tampil **biasa saja**
  (tanpa tombol apa pun) — jadi tidak mengganggu kalau tidak dipakai.

---

## 13k. 🗺️ Plugin **Peta Alkitab** (K68 · 4 Okt 2026)

> Peta Alkitab = **halaman sendiri** (halaman ke-7 di ANodes). Isinya gambar peta
> wilayah Alkitab (dasar **citra relief NASA** — bentuk geografi nyata) plus
> **daftar nama tempat**: kota, gunung, sungai, laut, danau, daerah, dan padang gurun.

**Cara membukanya**

- Klik **🧩** di kepala → cari kartu **🗺️ Peta Alkitab** → tekan **▶ Buka**,
- atau lewat **🧩 ▼** di toolbar tulis.

**Cara memakainya**

```
1. Peta mulai **BERSIH** (tanpa nama). Itu memang disengaja — tetapi penghitung di
   bawah kotak cari memberi tahu: **`(0/191) · nyalakan jenis dulu`**.
2. Pilih jenis lewat tombol di bar atas peta:
      [📋 pilihan] [🏙️ titik] [💧 air] [⛰️ relief] [🏜️ gurun] [🗺️ wilayah] [🌿 subur]
      Tombol jenis = SAKELAR: klik = nyala · klik lagi = mati · boleh beberapa nyala sekaligus.
3. Ketik nama di kotak "cari nama…" → chip nama muncul di daftar bawah.
      💡 **Cari langsung jalan** — Anda **tidak perlu** menyalakan jenis dulu.
      Contoh: ketik `yordan` ⇒ **〰️ Sungai Yordan** muncul.
4. Klik nama itu → nama MUNCUL di peta (titik + tulisan + wilayahnya digaris).
      Klik lagi → nama itu hilang dari peta.
5. Klik nama ⇒ muncul juga KETERANGAN di atas peta:
      nama · jenis · penjelasan singkat · daftar AYAT yang menyebut tempat itu.
6. Klik salah satu AYAT di keterangan ⇒ isi ayatnya tampil di kolom bawah keterangan.
      Klik ayat yang sama lagi ⇒ kolomnya TERTUTUP. Tombol [✕] juga menutup.
      Pindah nama lain ⇒ kolom ayat lama ikut tertutup (rapi, tidak menumpuk).
```

**Tombol lain di halaman peta**

| Tombol | Gunanya |
|---|---|
| 🌿 **subur** | menyalakan/mematikan warna tanah subur |
| 🌍 **bumi** | dasar peta memakai citra relief NASA — matikan untuk kembali ke gambar lama |
| 🏷️ **semua** | tampilkan semua nama dalam daftar sebagai label di peta |
| 🧹 | sembunyikan semua nama pilihan dari peta |
| ＋ · − · ⌂ | perbesar · perkecil · tampak penuh |
| 🏠 | kembali ke catatan (bisa juga `Esc` / `Ctrl+B`) |

**Yang perlu diketahui**

- Peta ini **hanya membaca** data yang sudah ada — tidak mengubah catatan Anda.
- ⬆ **Peta tetap terlihat saat daftar digulir** (perbaikan 5 Okt 2026): kalau daftar nama
  tempat panjang (mis. setelah menekan **🏷️ semua**), Anda bisa menggulir daftar ke bawah —
  **kepala dan gambar peta tetap menempel di atas**, jadi Anda tidak kehilangan peta.
- 🔠 **Nama tempat ikut ukuran huruf pengaturan Anda** (perbaikan 5 Okt 2026):
  nama di daftar, nama **di atas peta**, dan nama di **peta kecil pada ayat** semuanya
  mengikuti **⚙ Pengaturan › Besar huruf keseluruhan**. Kalau ukuran huruf diperbesar
  (mis. karena usia), **nama-nama itu ikut membesar** — tidak lagi ketinggalan kecil.
  Ukuran baru langsung berlaku **saat itu juga**, tanpa perlu menutup halaman.
- **Yang sudah terisi (232 entri · 695 rujukan ayat):**

| Isi | Jumlah | Contoh |
|---|---|---|
| Lokasi (kota · tempat · wilayah) | **126** | Yerusalem · Betlehem · Yerikho · Niniwe · Babel · Sikhem |
| Daerah | **42** | Kanaan · Galilea · Moab · Edom · Filistia · Mesir |
| Gunung | **12** | Sinai · Ararat · Karmel · Hermon · Bukit Zaitun |
| Darat/padang | **8** | Gurun Paran · Negev · Tanah Gosen |
| Sungai | **6** | **Yordan** · Efrat · Tigris · Nil |
| Laut | **3** | Laut Tengah · Laut Merah · Teluk Persia |
| Danau | **2** | Laut Mati · Danau Galilea |
| Rute perjalanan | **33** | Keluaran dari Mesir · perjalanan Paulus · pelayanan Yesus |

- 🆕 **Tombol `📍` di ayat — SUDAH ADA (5 Okt 2026).** Tempat sekarang bisa dilihat **dua jalan**:

---

## 13l. 📍 Kata tempat **langsung di ayat** (K69b · K69c · 5 Okt 2026)

> Sekarang Anda **tidak perlu** membuka halaman Peta dulu. Setiap ayat yang menyebut
> nama tempat diberi **tombol kecil `📍`**. Tekan ⇒ muncul **peta kecil + keterangan**
> tepat di bawah ayat itu.

```
HALAMAN BACA ALKITAB — Yosua 3
 1  Yosua bangun pagi-pagi…                         📍   ← hanya ayat yang punya nama tempat
15  Segera sesudah para pengangkat tabut…           📍
       │  Anda tekan 📍
       ▼
   ┌─────────────────────────────────────────────────────────┐
   │ 📍 Sungai Yordan · sungai                               │
   │ [Sungai Yordan] [Sungai Efrat] [Nil] …   ← tekan untuk ganti tempat
   │ ┌─────────────────────────────────────────────────────┐ │
   │ │   (peta kecil — titik tempat itu BERKEDIP-KEDIP)     │ │
   │ └─────────────────────────────────────────────────────┘ │
   │ Sungai baptisan Yesus & pintu masuk Israel ke tanah…    │ ← keterangan
   └─────────────────────────────────────────────────────────┘
```

**Cara memakainya**

```
1. Buka Alkitab dari catatan (klik tautan ayat, atau 🧩 → 📖 Alkitab → ▶ Buka).
2. Lihat tombol 📍 di sebelah kanan ayat — hanya muncul di ayat yang menyebut tempat.
3. Tekan 📍 ⇒ peta kecil + keterangan terbuka di bawah ayat itu.
4. Kalau satu ayat menyebut LEBIH DARI SATU tempat ⇒ ada beberapa chip nama
   ([Sungai Yordan] [Sungai Efrat] …). Tekan chip lain ⇒ isi peta BERGANTI
   di kolom yang sama (tidak menambah kolom baru).
5. Tekan 📍 sekali lagi ⇒ kolomnya TERTUTUP.
   Membuka 📍 di ayat lain ⇒ kolom yang lama ikut tertutup (rapi).
6. Pindah pasal ⇒ semua kolom dibersihkan sendiri.
```

| Hal | Keterangan |
|---|---|
| Berapa banyak ayat punya tombol? | **3.720 ayat** dari 31.102 (12 %) |
| Satu ayat bisa punya berapa tempat? | sampai **7** (contoh: Yosua 13:3) |
| Titik berkedip | bisa dimatikan lewat halaman keterangan plugin (sakelar berkedip) |
| Peta bisa digeser/diperbesar? | ❌ tidak — memang sengaja, supaya ringan di HP |
| Kalau ayat tidak menyebut tempat | ❌ **tidak ada tombol** — tidak mengganggu bacaan |
| Plugin dilepas | tombol & kolom **hilang**, **catatan Anda tetap utuh** |

### 🗺️ Bentuk petanya — **sekarang SAMA dengan halaman Peta** (K69c · 5 Okt 2026)

> Sebelumnya peta kecil ini berbentuk **aneh** — daratan & sungainya sukar dikenali.
> Sekarang **bentuknya mengikuti halaman Peta**: proporsi benar, arahnya jelas.

| Hal | Sebelumnya | Sekarang |
|---|---|---|
| Bentuk kotak | **gepeng & tertarik 5,76×** (tinggi dipaksa) | **2 : 1** — sebentuk citra relief aslinya |
| Proyeksi | tanpa faktor ⇒ miring | **sama seperti halaman Peta** (F = 1,5) |
| Yang tampil | hampir seluruh wilayah (titik di tepi **tanpa relief**) | **rapat sekitar tempat itu** ⇒ citra **penuh** untuk **87 %** tempat |
| Bentuk sungai | gepeng | ✅ **sama** dengan halaman Peta |

**Kalau tempatnya sendiri luas** (mis. **Filistia**, **Sungai Efrat**), kotaknya
**melebar sendiri** supaya seluruh wilayah tetap masuk — jadi tidak ada yang terpotong.

### 🔧 Lebih banyak tempat yang dikenali (K69d · 5 Okt 2026)

> Sebelumnya **banyak** tempat **tidak muncul tombol `📍`**-nya — bukan karena datanya
> hilang, tetapi karena **ejaan di Alkitab berbeda** dari nama di peta.
> Contoh nyata: peta menulis **“Damaskus”**, Alkitab (TB) menulis **“Damsyik”**.

| Yang diperbaiki | Hasil |
|---|---|
| **Ejaan yang berbeda disamakan** — mis. Damaskus→**Damsyik** · Susa→**Susan** · Babilonia→**Babel** · Filistia→**Filistin** · Laut Merah→**laut Teberau** · Tarsyis→**Tarsis** · Kades-Barnea→**Kadesh** · Gosen→**Gosyen** · Negev→**Negeb** · Yehuda→**Yudea** | ayat yang dapat tombol 📍 **3.591 → 4.441** (11,5 % → **14,3 %**) |
| **Nama berkurung ikut dikenali** — mis. `Yope (Jaffa)` ⇒ **“Yope”** | banyak tempat kecil jadi hidup begitu saja |
| **4 rujukan ayat yang salah ditunjuk** dibetulkan (3 di antaranya kurang satu angka; 1 menunjuk **Ratapan 3:3** padahal maksudnya **Ayub 2:11**; 1 menunjuk ayat yang **tidak ada**) | menekan nama ⇒ pindah ke **ayat yang benar** |
| **Kata yang mirip nama tempat tidak ikut ditandai** — mis. kata kerja “**raba**” dan istilah musik “**Sela**” di Mazmur | tidak ada tombol 📍 **palsu** |

⚠️ **Kata umum tetap tidak dipakai** walau mirip nama tempat — mis. **“Israel”** (2.347 ayat,
lebih sering berarti bangsa) dan **“Sela”** (istilah musik). Aturannya dibuat **sempit**
supaya tidak merusak yang sudah benar.

### 🗺️ Peta di **bawah catatan** — panel “🗺️ Peta (n)” (K73 · 5 Okt 2026)

> Sebelumnya peta hanya bisa dibuka dari halaman 🗺️ Peta atau lewat tombol `📍` **di ayat
> Alkitab**. Sekarang **di catatan pun** ada daftar tempat yang Anda sebut — tanpa perlu
> pindah halaman.

```text
CATATAN
  Yesus dibaptis di Sungai Yordan. Lalu Ia pergi ke Yerusalem.
  ┌───────────────────────────────────────────────────────────┐
  │ 📋 Ayat & Istilah — 0 ayat · 3 istilah · 3 tempat         │ ← panel paling bawah catatan
  │ 📚 Istilah (3)   [Baptisan] [Yerusalem] [Betlehem]        │
  │ 📖 Ayat (0)                                               │
  │ 🗺️ Peta (2)      [Sungai Yordan] [Yerusalem]   ← BARU       │
  │     │ diklik                                              │
  │     ▼                                                     │
  │   📍 Sungai Yordan · sungai                               │
  │   ┌─────────────────────────────────────────────────────┐ │
  │   │ peta relief (citra NASA) + titik berkedip           │ │
  │   └─────────────────────────────────────────────────────┘ │
  │   Sungai baptisan Yesus & pintu masuk Israel ke …         │
  │   📖 [Yosua 3:15] [Matius 3:13] [2 Raja-Raja 5:14]        │
  │        └ diklik ⇒ dipindah ke ayat itu di halaman Alkitab  │
  │ [ ＋ Istilah ]                                            │
  └───────────────────────────────────────────────────────────┘
```

**Cara pakai:**

| Langkah | Yang terjadi |
|---|---|
| 1 | Tulis nama tempat di catatan (mis. **Sungai Yordan**) — huruf besar/kecil tidak masalah untuk nama yang jelas |
| 2 | Buka panel **📋 Ayat & Istilah** di bawah catatan (tekan `▾` kalau tertutup) |
| 3 | Lihat bagian **🗺️ Peta (n)** → klik nama tempatnya |
| 4 | **Peta tampil** + keterangan + daftar ayat |
| 5 | Klik nama **lain** ⇒ peta **berganti** (kolom yang sama) · klik nama **yang sama** ⇒ peta **tertutup** |
| 6 | Klik salah satu ayat ⇒ **pindah ke ayat itu** di halaman Alkitab |

⚠️ **Nama pendek yang juga kata biasa tetap dijaga** — mis. kata sambung “**dan**” ❌ tidak
pernah dianggap tempat, dan kata “**teman**” hanya dianggap tempat kalau ditulis dengan
**huruf besar** di awal (`Teman`). Jadi daftar peta tidak dipenuhi nama yang keliru.

---

## 13m. 🔖 Plugin **Bookmark Ayat** (K81 · K82 · 30 Okt 2026 · **K92 + K93 · 2 Nov 2026**)

> **Bookmark** = menandai ayat yang ingin Anda ingat, supaya nanti mudah ditemukan lagi.
> Berbeda dari 🌿 Ayat Terkait (kaitan antar ayat) — bookmark **pilihan Anda sendiri**.

### Cara menandai ayat — DUA JALUR

Saat Anda **mengklik angka ayat**, muncul bar pilihan dengan **DUA tombol tujuan**:

```text
HALAMAN BACA ALKITAB — Matius 4
[🏠] [Matius ▾] [📋 PILIH] [🔍 Cari] [📤] [🖊] [🔖]     ← 🔖 = pintu ke halaman Bookmark
 4  Tetapi Yesus menjawab: "Ada tertulis: …"        🔖   ← tanda ayat SUDAH dibookmark
 5  Kemudian Iblis membawa-Nya ke Kota Suci …       🔖
      │ Anda klik angka 4, lalu 5, lalu 6
      ▼
 [Mat 4:4-6] [💬 Kalimat] [Matius 4:4-6] [📋 Simpan] [🔖 Bookmark] [✕]
                                              │            │
                                        ke CATATAN   ke HALAMAN 🔖
```

| Tombol | Gunanya |
|---|---|
| **📋 Simpan** | mengirim ayat ke **catatan** (muncul bar paket — tinggal tekan Tempel) |
| **🔖 Bookmark** | menyimpan ayat ke **daftar bookmark**, lalu **langsung pindah** ke halaman 🔖 Bookmark |

| Langkah | Yang terjadi |
|---|---|
| 1 | Buka Alkitab, lalu **klik angka ayat** yang mau ditandai — boleh **satu ayat**, boleh **beberapa ayat berurutan** |
| 2 | Ayat yang dipilih **disorot** · bar pilihan muncul dengan **dua tombol tujuan** |
| 3 | Salah pilih? **Klik angka itu lagi** ⇒ pilihannya **dilepas** |
| 4 | Tekan **[🔖 Bookmark]** ⇒ tersimpan dan Anda **langsung pindah** ke halaman 🔖 Bookmark |
| 5 | Tekan **[📋 Simpan]** kalau maksudnya **mengirim ke catatan** (bukan bookmark) |

> 💡 **Tombol 🔖 di bar atas Alkitab** = pintu cepat ke halaman 🔖 Bookmark
> (melihat daftar tanpa harus menandai ayat dulu).

### ⚠️ Ayat yang LOMPAT ⇒ jadi DUA bookmark

```
Anda klik 24, lalu 26 (25 tidak diklik)
   ⇒ bookmark “24” DISIMPAN SENDIRI (terpisah)
   ⇒ pilihan baru mulai dari 26
```

Jadi **satu bookmark selalu berisi ayat yang berurutan**. Kalau Anda mau menandai
ayat 24 **dan** 26 tanpa 25, itu menjadi **dua bookmark** — memang begitu aturannya.

### Tanda 🔖 di ayat

Ayat yang **sudah** Anda bookmark diberi tanda **🔖** di sebelah kanannya.
Kalau Anda menandai ayat itu **lagi** (untuk topik lain), **tidak apa-apa** —
sistem langsung menyimpan tanpa bertanya, karena pasti untuk keperluan berbeda.

### Halaman 🔖 Bookmark — daftar semua bookmark

Buka lewat **🧩 → 🔖 Bookmark Ayat → ▶ Buka**, atau tekan tombol **🔖** di bar atas
halaman Alkitab, atau tekan **[🔖 Bookmark]** di bar pilihan ayat.

```text
┌──────────────────────────────────────────────────────┐
│ [🏠] 🔖 Bookmark Ayat — 2 bookmark                   │
│ ┌──────────────────────────────────────────────────┐ │
│ │ 🔖 Bilangan 6:24-26                              │ │
│ │ 24 TUHAN memberkati engkau dan melindungi…       │ │
│ │ 📝 topik: berkat                                 │ │
│ │ [📋 Copy] [✏️ Edit] [🗑 Hapus]                    │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

| Tombol | Gunanya |
|---|---|
| **🏠** | kembali ke **tempat Anda tadi** — kalau bookmark dibuka dari **halaman baca Alkitab**, 🏠 membawa Anda **kembali ke bacaan itu**; kalau dibuka dari **catatan**, kembali ke catatan. Judul tombolnya ikut berubah supaya jelas (“Kembali ke bacaan Alkitab” / “Kembali ke catatan”) |
| **📋 Copy** | mengirim ayat itu ke **catatan** — muncul bar paket, tinggal tekan **Tempel** di tempat yang Anda mau |
| **✏️ Edit** | mengubah ayat mana saja yang masuk bookmark (lihat di bawah) |
| **🗑 Hapus** | membuang bookmark itu (ditanya dulu) |

### 👆 Klik kartunya ⇒ langsung dibuka di Alkitab (K93 · 2 Nov 2026)

**Klik di mana saja pada kartu bookmark** (bukan pada tombolnya) ⇒ Anda **langsung
dibawa ke Alkitab** pada kitab & ayat bookmark itu, dan **ayatnya disorot**.

```text
HALAMAN 🔖 BOOKMARK
┌──────────────────────────────────────────────────────┐
│ 🔖 Bilangan 6:24-26 ↗                                │  ← klik di sini
│ 24 TUHAN memberkati engkau dan melindungi…           │
│ [📋 Copy] [✏️ Edit] [🗑 Hapus]                        │
└──────────────────────────────────────────────────────┘
        │ klik kartunya
        ▼
HALAMAN BACA — Bilangan 6
 24 TUHAN memberkati engkau …        ┃ DISOROT (berkedip 5 dtk)
 25 TUHAN menyinari engkau …         ┃ lalu sorot tetap
        │ tekan 🏠
        ▼
kembali ke HALAMAN 🔖 BOOKMARK  ← bukan langsung ke catatan
        │ tekan 🏠 lagi
        ▼
catatan
```

| Hal | Keterangan |
|---|---|
| **Tanda bisa diklik** | nama bookmark diberi tanda **↗** dan latar kartu berubah saat disentuh |
| **Ayatnya disorot** | berkedip ±5 detik lalu **sorot tetap** supaya mudah ditemukan |
| **🏠 pertama** | kembali ke **daftar bookmark** (posisi gulir dipulihkan) |
| **🏠 kedua** | baru kembali ke **catatan** |
| **Tombol di kartu** | 📋 Copy · ✏️ Edit · 🗑 Hapus **tidak** ikut membuka Alkitab |

### ✏️ Cara mengedit bookmark

```text
tekan [✏️ Edit]
   ⇒ pindah ke Alkitab · ayat bookmark DISOROT + BERKEDIP (stabilo)
   ⇒ klik angka ayat lain  = TAMBAH
   ⇒ klik ulang angka yang sudah dipilih = HAPUS
   ⇒ tekan [💾 Simpan] = selesai · kembali ke halaman bookmark
```

⚠️ **Selama mengedit, pilihan harus berurutan** — kalau Anda klik ayat yang **lompat**,
pilihan lama disimpan dan pilihan baru dimulai (sama seperti saat menandai).

### Catatan satu baris

Setiap bookmark bisa diberi **catatan singkat satu baris** (mis. “berkat” atau
“untuk renungan besok”). Catatan ini muncul di kartu bookmark.

### Hal yang perlu diketahui

| Hal | Keterangan |
|---|---|
| Bookmark ikut **sinkron PC ⇄ HP**? | ✅ **ya** — ikut tersinkron seperti catatan |
| Bisa dipakai di catatan? | ❌ tidak — tombol 🔖 **hanya di halaman baca Alkitab** |
| Kalau plugin dilepas | tanda 🔖 & tombolnya **hilang**, **Alkitab & catatan Anda tetap utuh** |
| Tombol 🔖 tidak muncul? | ✅ **sudah diperbaiki 2 Nov 2026 (K92)** — dulu tombol 🔖 hilang sesudah aplikasi **dibuka ulang**; sekarang **selalu muncul** selama plugin terpasang |
| Berapa bookmark bisa disimpan? | tidak dibatasi |
| Tombol **🏠** membawa ke mana? | ke **halaman asal** — dari Alkitab ⇒ balik ke Alkitab · dari catatan ⇒ balik ke catatan (K81b, 30 Okt 2026) |

---
## 13n. 🔤 Plugin **Interlinear** — bahasa asli + kode Strong (K85 · 1 Nov 2026)

> **Apa ini?** Alat untuk melihat **kata asli** di balik terjemahan. Tiap ayat di halaman baca
> Alkitab dapat tombol kecil **🔤**; ditekan ⇒ muncul daftar kata beserta **kode Strong**-nya
> dan **arti Indonesia**-nya.

### 📖 Cara pakai (3 langkah)

1. Buka **🧩 Gudang Plugin** → pilih **🔤 Interlinear** → tekan **Pasang**.
2. Buka halaman baca Alkitab (mis. **Yohanes 3**).
3. Tekan tombol **🔤** di ayat mana pun ⇒ **seluruh kolom interlinear pasal itu terbuka**.
   Tekan **🔤** lagi ⇒ semuanya tertutup.

### 📐 Bentuknya

```text
HALAMAN BACA — Yohanes 3
 1  Adalah seorang Farisi yang bernama Nikodemus …            🔤
      │ ditekan
      ▼
 ┌────────────────────────────────────────────────────────────┐
 │ 🔤 Yohanes 3:1 · Yunani → Indonesia                        │
 │ Dan          G1161   tetapi                                │
 │ ada          G2258   adalah                                │
 │ seorang      G444    manusia                               │
 │ dari         G1537   dari                                  │
 │ orang-orang Farisi  G3588 G5330   itu · orang-orang Farisi │ ← chip diklik
 │ ┌────────────────────────────────────────────────────────┐ │   (K98)
 │ │ G1161 · δέ · dé                                        │ │ ← panel TEPAT
 │ │ Arti (dari pemakaian nyata di 4 Injil): tetapi · lalu  │ │   di bawah baris
 │ │ Strong (Inggris, Public Domain): but, and, etc.        │ │   chip-nya
 │ └────────────────────────────────────────────────────────┘ │
 │ …                                                          │
 └────────────────────────────────────────────────────────────┘
```

### 📍 Panel arti muncul TEPAT DI BAWAH baris yang Anda klik (K98 · 3 Nov 2026)

**Dulu** panel arti **selalu** muncul di **dasar kolom**. Kalau ayatnya banyak kata
(mis. 31 kata), Anda harus **menggulir jauh** untuk membaca artinya — dan mudah
kehilangan baris yang tadi diklik.

**Sekarang** panel muncul **tepat di bawah baris chip yang Anda tekan**:

| Yang Anda lakukan | Hasilnya |
|---|---|
| Klik chip **G1127** di baris γρηγοροῦντες | panel arti muncul **tepat di bawah baris itu** |
| Klik chip **lain** | panel **PINDAH** ke bawah baris yang baru (tetap **satu** panel) |
| Klik chip yang **sama** sekali lagi | panel **tertutup** |
| Gulir ke mana pun | panel tetap menempel pada barisnya |

**Terukur:** jarak panel ke baris chip = **3 px** (dulu bisa **511 px** kalau barisnya di tengah).

💡 **Tanda panel:** kotak krem dengan **garis kiri emas** `#d8b96a` — mudah dikenali.

### 🔎 Arti Indonesia-nya dari mana?

**Bukan dari terjemahan mesin.** Arti diambil dari **kata yang benar-benar dipakai penerjemah**
untuk nomor Strong itu. Contoh terukur:

| Kode | Kata Yunani | Arti Indonesia |
|---|---|---|
| **G25** | ἀγαπάω (*agapáō*) | mengasihi |
| **G26** | ἀγάπη (*agápē*) | kasih |
| **G2316** | θεός (*theós*) | Allah |
| **G3056** | λόγος (*lógos*) | perkataan · firman |
| **G4102** | πίστις (*pístis*) | iman |
| **G4151** | πνεῦμα (*pneûma*) | Roh |
| **G2889** | κόσμος (*kósmos*) | dunia |

⚠️ **Kata sandang & kata sambung** (mis. `G3588` = “the”, `G3754` = “that”) diberi **arti tetap**
— kalau diambil dari pemakaian, hasilnya ngawur (mis. `G3588` jadi “Yesus · Allah · murid-murid”).

### 📊 Isi (tahap 1)

| Hal | Angka |
|---|---|
| Kitab | **4 Injil** — Matius · Markus · Lukas · Yohanes |
| Ayat | **3.778** |
| Kata ber-Strong | **56.785** |
| Nomor Strong | **2.833** |
| Ukuran data | **1,71 MB** |

### ❓ Pertanyaan yang sering muncul

| Hal | Keterangan |
|---|---|
| Kenapa hanya 4 Injil? | Tahap 1 = uji dulu. **62 kitab lain menyusul** (tahap 2, ±16,5 jam). |
| Kenapa Lukas 17:36 tidak punya tombol 🔤? | Ayat itu **ayat kurung** dan **tidak ada** di sumber data (idkjv). |
| Apakah catatan saya berubah? | ❌ **tidak** — tombol 🔤 & kolomnya **hanya tampilan**, tidak ikut tersimpan. |
| Kalau plugin dilepas? | tombol & kolom **hilang**, **Alkitab & catatan Anda tetap utuh**. |
| Bisa dipakai di catatan? | ❌ tidak — tombol 🔤 **hanya di halaman baca Alkitab**. |
| Apa itu “Strong”? | **Nomor kamus** untuk tiap kata asli (dibuat James Strong, 1890). Nomor yang sama selalu menunjuk kata yang sama di seluruh Alkitab. |
| Kenapa berguna? | Bisa membedakan kata yang **diterjemahkan sama** tetapi **aslinya beda** — mis. `agápē` (kasih tanpa syarat) vs `philía` (kasih persahabatan). |
| Lisensi? | teks Indonesia + Strong dari **idkjv** (Public Domain) · lemma Yunani & arti Inggris dari **Strong's Dictionary** (Public Domain) + struktur **OpenScriptures** (CC BY 4.0). |

---

## 13n-b. 🔤 **Interlinear Perjanjian Baru** — Kisah 26 s/d Wahyu (K85 tahap 3 · 3 Nov 2026)

> **Apa ini?** Lanjutan plugin 🔤 Interlinear untuk **kitab-kitab yang belum punya**:
> **Kisah Para Rasul 26 s/d Wahyu**. Bentuknya **sedikit berbeda** karena sumbernya berbeda —
> di sini yang ditampilkan adalah **kata Yunani aslinya** beserta **cara membacanya** dan
> **arti Indonesia**-nya.

### 📐 Dua bentuk kolom (dipilih otomatis)

Anda **tidak perlu memilih** — aplikasi memilih sendiri menurut kitab yang sedang dibuka:

| Kitab | Bentuk | Isi kolom |
|---|---|---|
| **Matius · Markus · Lukas · Yohanes** (1–4 Injil) | **A** | kata Indonesia ⇄ kode Strong |
| **Kisah 26 s/d Wahyu** | **B** | **kata Yunani** + cara baca + kode Strong + arti Indonesia |

### 📖 Cara pakai

Sama seperti sebelumnya — tekan tombol **🔤** di ayat mana pun:

```text
HALAMAN BACA — Wahyu 3
20  Lihat, Aku berdiri di muka pintu …                        🔤
      │ ditekan
      ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ 🔤 Wahyu 3:20 — dari bahasa Yunani                            │
 │                                                              │
 │  ἰδοὺ (idou)       G2400   lihatlah                          │
 │  ἕστηκα (hestēka)  G2476   aku berdiri                       │
 │  ἐπὶ (epi)         G1909   di atas                           │
 │  τὴν (tēn)         G3588   —                                 │
 │  θύραν (thuran)    G2374   pintu          ← chip diklik       │
 │ ┌──────────────────────────────────────────────────────────┐ │
 │ │ G2374 · θύρα · thýra                                     │ │ ← panel TEPAT
 │ │ Arti Indonesia: pintu · pintu gerbang                    │ │   di bawahnya
 │ │ Strong (Inggris, Public Domain): a portal or entrance    │ │   (K98)
 │ └──────────────────────────────────────────────────────────┘ │
 │  …                                                           │
 │                                                              │
 │ Strong's Greek · STEPBible TAGNT (CC BY 4.0)                 │
 └──────────────────────────────────────────────────────────────┘
```

💡 **Panel arti selalu muncul TEPAT di bawah baris yang Anda klik** (K98) — tidak lagi
“jatuh jauh di bawah” saat ayatnya panjang. Klik chip lain ⇒ panel **pindah**;
klik chip yang sama ⇒ panel **tertutup**.

### 📊 Isi

| Hal | Angka |
|---|---|
| Kitab | **Kisah 26 s/d Wahyu** (26 kitab) |
| Ayat | **4.170** |
| Nomor Strong | **4.400** |
| Entri arti Indonesia | **5.685** |
| Kata isi terjelaskan | **100 %** |
| Ukuran data | **3,22 MB** |

### ❓ Pertanyaan yang sering muncul

| Hal | Keterangan |
|---|---|
| Kenapa Kisah 1–25 tidak ada? | Sumber lama (`idkjv`) hanya memuat Kisah 1–25. Yang **belum** ada baru **Kisah 26 s/d Wahyu** — itulah yang dikerjakan. |
| Kenapa bentuknya beda dari 4 Injil? | Sumber Yunani untuk kitab-kitab ini **tidak punya teks Indonesia per kata** ⇒ yang ditampilkan **kata Yunani + cara baca + arti**. |
| Ada kata yang artinya kosong (`—`)? | ❌ **tidak ada lagi.** Sejak **3 Nov 2026** seluruh kata isi sudah punya arti Indonesia. Yang tampil `—` hanya **kata fungsi** (kata sandang, kata depan, kata sambung) yang memang tidak perlu diterjemahkan. |
| Apakah catatan saya berubah? | ❌ **tidak** — tombol 🔤 & kolomnya **hanya tampilan**. |
| Lisensi? | teks Yunani + Strong dari **STEPBible TAGNT** (**CC BY 4.0**) · arti Indonesia ditulis dari pemakaian nyata. |

### 🆕 Tambahan 3 Nov 2026 — 1.398 arti baru ⇒ **100 %** (K85 tahap 3)

| Hal | Tahap 1 | Tahap 2 | **Tahap 3** |
|---|---|---|---|
| Entri arti Indonesia | 3.364 | 4.168 | **5.685** |
| Kata isi terjelaskan | 89,6 % | 95,1 % | **100,0 %** |
| Kata isi belum berarti | 3.871 | 1.806 | **0** |

**Contoh arti yang sekarang muncul:** `G5039` bukti · `G0184` Akeldama · `G2957` Kirene ·
`G2493` Yoel · `G4551` Safira · `G2333` Teudas · `G1048` Gaza · `G3194` Malta ·
`G0717` Harmagedon · `G3963` Patmos · `G5402` Febe · `G5060` Tertius · `G3134` Maranata ·
`G0611` menjawab · `G1154` Damsyik · `G2445` Yope · `G2883` Kornelius · `G5344` Feliks ·
`G0116` Atena · `G2882` Korintus · **1 Korintus 16:22** ⇒ *Maranata* kini punya arti Indonesia.

✅ **Selesai:** seluruh kata isi Kisah 26 s/d Wahyu kini punya arti Indonesia — tidak ada lagi
kata yang tampil `—` tanpa keterangan.

---

## 13o. 🔤 Plugin **Penjelasan Yunani** — arti mengalir, TANPA angka (K88 · 1 Nov 2026)

> **Untuk siapa:** Anda yang ingin tahu **arti yang lebih dalam** dari sebuah ayat, tetapi
> **tidak mau menelusuri nomor Strong**.
>
> **Bentuknya:** tombol kecil **🖊** di ayat → kolom krem terbuka berisi **penjelasan dalam
> bahasa Indonesia biasa** — ❌ **tanpa satu pun nomor Strong**.

### 📐 Bedanya dengan 🔤 Interlinear (K85)

| | 🔤 Interlinear (K85) | 🖊 Penjelasan Yunani (K88) |
|---|---|---|
| Isi | **tabel** kata + **nomor Strong** | **kalimat** penjelasan bahasa Indonesia |
| Untuk siapa | yang mau menelusuri kode Strong | yang mau **langsung mengerti** |
| Angka | ✅ ada | ❌ **tidak ada sama sekali** |

### 🚶 Cara pakai

1. Buka **🧩 Gudang Plugin** → pilih **🔤 Interlinear** → tekan **Pasang**.
2. Buka halaman baca Alkitab (mis. **Matius 2**).
3. Tekan tombol **🖊** di ayat mana pun ⇒ **seluruh kolom penjelasan pasal itu terbuka**.
4. Tekan **🖊** lagi ⇒ semua kolom tertutup.

### 📊 Isi (butir a–g · 1 Nov 2026)

| Hal | Angka |
|---|---|
| Kata Yunani di 4 Injil | **2.833** |
| Kata **layak dijelaskan** (bukan kata fungsi) | **1.296** |
| Kata fungsi yang **dilewati** (itu/dan/dia/di/sebab) | **1.537 (36,3 %)** |
| Kata sudah ditulis penjelasannya | **572** |
| Ayat yang sudah dapat penjelasan | **3.723 dari 3.778 = 98,5 %** |
| Ukuran data | **703,1 KB** |

> ℹ️ **Kenapa 572 kata sudah menutup 98,5 % ayat?** Karena penjelasan disusun **per KATA**,
> bukan per ayat. Kata-kata tersering muncul di ribuan ayat. Diukur: **344 kata** (frekuensi
> ≥10×) menutup **97,6 %** ayat; **572 kata** menutup **98,5 %** ayat. Sisa 57 ayat berisi
> nama diri & kata sandang saja (mis. silsilah Lukas 3), sehingga wajar tidak dapat penjelasan.

### ✡ Kata serapan Ibrani / Aram (K89)

Di dalam kolom 🖊 ada bagian tambahan **✡ Kata serapan bahasa Ibrani / Aram** — untuk kata yang
**bukan** bahasa Yunani asli, mis. `Talita kum`, `Golgota`, `Hosana`, `Abba`, `Sabat`.

| Hal | Angka |
|---|---|
| Kata serapan Ibrani/Aram | **29** |
| Ayat Injil yang memuatnya | **203 dari 3.778 = 5,4 %** |
| Contoh | Matius 27:46 ⇒ **Eli · lama · sabakhtani** (3 kata) |

⚠️ Penanda ini **hanya untuk Perjanjian Baru** — di Perjanjian Lama kata Ibraninya sudah
dijelaskan **penuh** (lihat bagian berikut).

### ✡ Penjelasan Ibrani untuk Perjanjian Lama (K90 · 1 Nov 2026 · **dituntaskan K90i 3 Nov 2026**)

Sejak **1 Nov 2026**, **seluruh Perjanjian Lama** juga punya penjelasan bahasa asli.
**Tombolnya tetap 🖊 yang sama** — Anda tidak perlu menghafal tombol baru.

| Hal | Angka |
|---|---|
| Kitab Perjanjian Lama | **39** |
| Ayat Ibrani yang dibaca | **23.213** |
| Kata Ibrani | **306.785** |
| Kata yang sudah dijelaskan | **455** |
| Ayat yang sudah dapat penjelasan | **22.688 dari 23.213 = 97,7 %** |
| Ukuran data | **2.910 KB** |

> ✅ **3 Nov 2026 (K90i) — TAURAT DITUNTASKAN.** **149 kata** baru ditulis ⇒
> **cakupan Taurat 98,5 % → 99,5 %** (Kejadian **99,9 %** · Keluaran **99,6 %** ·
> Imamat **99,2 %** · Bilangan **98,8 %** · Ulangan **99,7 %**).
> **32 ayat Taurat yang masih kosong sudah diperiksa satu per satu** — semuanya hanya memuat
> **kata fungsi** (kata sandang · preposisi · konjungsi) yang memang **sengaja dilewati**
> karena tidak menambah pengertian ⇒ **Taurat efektif 100 %**.

**Cara pakai:** buka kitab Perjanjian Lama mana pun (mis. **Kejadian 1**) → tekan **🖊** di ayat →
kolom terbuka dengan judul **“🖊 Kejadian 1:1 — dari bahasa Ibrani”**.

```text
 1  Pada mulanya Allah menciptakan langit dan bumi.   🖊
     │ diklik
     ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ 🖊 Kejadian 1:1 — dari bahasa Ibrani                          │
 │                                                              │
 │ אֱלֹהִים (ʼĕlôhîym) — TB: Allah · allah                        │
 │  TB menerjemahkan "Allah" (huruf besar) atau "allah" …       │
 │  Kata Ibrani ini berbentuk JAMAK, tetapi ketika menunjuk     │
 │  pada Allah Israel selalu dipakai dengan kata kerja TUNGGAL  │
 │  …                                                           │
 │                                                              │
 │ שָׁמַיִם (shâmayim) — TB: langit · sorga                        │
 │  TB menerjemahkan "langit" atau "sorga". Kata Ibrani ini     │
 │  berbentuk DUAL — sepasang …                                 │
 └──────────────────────────────────────────────────────────────┘
```

**Bagaimana ANodes tahu ini PL atau PB?** Dari **nomor kitab**: **1–39 = Ibrani**,
**40–66 = Yunani**. Anda tidak perlu mengatur apa pun.

⚠️ **Bagian ✡ “kata serapan” hanya muncul di Perjanjian Baru** — di Perjanjian Lama kata
Ibrani sudah dijelaskan penuh, jadi bagian itu tidak perlu diulang.

### ❓ Pertanyaan yang sering muncul

| Hal | Keterangan |
|---|---|
| Apakah catatan saya berubah? | ❌ **tidak** — tombol 🖊 & kolomnya **hanya tampilan**. |
| Kalau plugin dilepas? | tombol & kolom **hilang**, **Alkitab & catatan Anda tetap utuh**. |
| Bisa dipakai di catatan? | ❌ tidak — tombol 🖊 **hanya di halaman baca Alkitab**. |
| Apakah penjelasannya karangan? | ❌ bukan. Semua diturunkan dari **definisi Strong yang sudah ada** (Public Domain / CC BY 4.0) + **teks TB yang nyata**. |
| Kenapa belum semua kata? | Yunani: butir **g** (344 kata) & **h** (190 kata) belum dikerjakan. Ibrani: **455 dari 5.960** kata isi sudah ditulis (menutup **97,7 %** ayat PL) — sisanya menyusul. **Taurat sudah tuntas** (efektif 100 %). |

---


## 4a-b. 🔄 “Sudah diperbaiki di VS Code, tapi di Chrome belum berubah”

> Ini kasus yang **sering terjadi** (dulu juga pada `rencanakerja.md` dan halaman 🖊 Pembaca Penguat).
> **Berkas di komputer sudah baru — Chrome masih menampilkan yang lama.**

### ⚠️ Sebab yang PALING SERING (hampir selalu ini)

**Chrome membuka `index.html`, bukan `ANodes-1berkas.html`.**

| Berkas | Isi | Perubahannya masuk? |
|---|---|---|
| `ANodes-1berkas.html` | semua sudah **menyatu** (HTML + CSS + JS + data) | ✅ **langsung masuk** |
| `index.html` | hanya kerangka — **mengambil** `css/`, `js/`, `plugin/` dari berkas terpisah | lewat berkas terpisah itu |

⇒ **Yang dikirim/dibuka selalu `ANodes-1berkas.html`.** Kalau membuka `index.html`
lalu menaruh di tab yang sama berhari-hari, bisa terasa “tidak berubah”.

### 🔎 Cara MEMBUKTIKAN versi mana yang termuat (bukan menebak)

Di halaman 🖊 Pembaca Penguat (buka 🧩 → 🖊 Pembaca Penguat → ▶ Buka),
di bawah judul ada baris biru:

```
Pasal 1 dari 12 pasal — ganti pasal lewat daftar ▾ di bar atas  ·  v22Sep-b
```

Untuk **plugin 📖 Alkitab** (fitur 📖 sejarah kitab, K55) tanda versinya
**`ANodesAlkitabTampilan.versi()` → `"v22Sep-d"`** · plugin **📖 Sejarah Kitab**
**`ANodesSejarahTampilan.versi()` → `"v22Sep-d"`** · plugin **🔗 Ayat Terkait**
**`ANodesAyatTerkaitTampilan.versi()` → `"v22Sep-d"`** · plugin **🖊 Pembaca Penguat**
**`ANodesPenguatTampilan.versi()` → `"v22Sep-b"`**.

Tanda versi itu = **berkas baru sudah termuat**.
Kalau tanda itu **tidak berubah** → Chrome masih memakai berkas lama.

Cara lain lewat Console (F12 → Console):

```js
ANodesPenguatTampilan.versi()      // harus keluar: "v22Sep-b"
ANodesKamusTampilan.versi()        // harus keluar: "v21Sep-a"
ANodesPenguat.daftarKitab().length // harus keluar: 66
ANodesPenguat.jumlahSemua()        // harus keluar: 31102
```

### ✅ Urutan yang PASTI berhasil (lakukan berurutan)

| # | Langkah | Keterangan |
|---|---------|-----------|
| 1 | **Tutup tab lama seluruhnya** | jangan hanya F5 di tab yang sama |
| 2 | Buka **`ANodes-1berkas.html`** (klik dua kali berkasnya) | **bukan** `index.html` |
| 3 | Kalau masih sama → tekan **Ctrl + Shift + R** | memuat ulang **tanpa** memori sementara |
| 4 | Kalau masih sama → tutup Chrome **seluruhnya**, buka lagi | menghapus memori sementara |
| 5 | Periksa tanda **`v21Sep-b`** di baris biru (atau Console) | kalau muncul = sudah berhasil |

### 🐞 Pesan merah di Console: “Unsafe attempt to load URL”

```
Unsafe attempt to load URL file:///C:/data/ANodes/ANodes-1berkas.html from frame with URL
file:///C:/data/ANodes/ANodes-1berkas.html. 'file:' URLs are treated as unique security origins.
```

**Ini BUKAN kerusakan** — hanya peringatan cara kerja Chrome pada berkas `file://`.
Dulu muncul karena tombol **⤓ Ekspor .pdf** membuka jendela cetak kosong;
Chrome menganggap jendela itu “memuat berkas yang sama”.

**Sudah diperbaiki (19 Sep 2026, penanda `v19Sep-c`):** pencetakan sekarang memakai
wadah tersembunyi di dalam halaman itu sendiri → **tidak ada jendela baru** → pesannya hilang.
Kalau masih terlihat pesan itu, berarti browser masih memuat berkas lama: ikuti urutan
**tutup tab → buka `ANodes-1berkas.html` → Ctrl+Shift+R** di atas.

### ⚠️ Kalau sudah F5 tapi tetap sama — penyebab lain yang mungkin

| Kemungkinan | Cara memastikan |
|---|---|
| Chrome punya **beberapa salinan berkas** di tempat lain (flashdisk, WhatsApp, folder kiriman) | buka Console → tulis `location.href` → lihat **berkas mana** yang benar-benar dibuka |
| Yang dibuka adalah **salinan lama** dari HP/WhatsApp | pastikan berkasnya dari `C:\data\ANodes\ANodes-1berkas.html` yang **paling baru** |
| Halaman 🖊 Pembaca Penguat belum **dipasang** (plugin belum aktif) | buka 🧩 → kartu **🖊 Pembaca Penguat** → tekan **⬇ Pasang** |

### 📌 Aturan untuk saya (AI) — JANGAN diulang

- Setiap kali memperbaiki tampilan, **tulis penanda versi** (mis. `v21Sep-b`) di tempat
  yang mudah dilihat, **supaya Anda bisa membuktikan** berkas barunya sudah termuat.
- ❌ Jangan hanya bilang “sudah ada” / “coba F5” tanpa **cara membuktikan**.

---

## 4c-b. 🧪 Cara uji setelah perbaikan — HANYA bagian yang diperbaiki (K94 · 2 Nov 2026)

Dulu setiap perbaikan diuji dengan **satu berkas uji besar** yang memeriksa
**seluruh aplikasi** ⇒ **±4–7 menit** untuk perubahan satu baris. Itu tidak efektif.

Sekarang uji dibuat **per sasaran**:

| Cara | Perintah | Waktu |
|---|---|---|
| ✅ **Sasaran** (dipakai setiap revisi) | `node tools/uji-sasaran.js K92` | **±10 detik** |
| Beberapa sasaran sekaligus | `node tools/uji-sasaran.js K92,K93` | ±11 detik |
| Berkas HP | `node tools/uji-sasaran.js K92 --berkas ANodes-1berkas.html` | ±10 detik |
| Melihat daftar sasaran | `node tools/uji-sasaran.js --daftar` | sekejap |
| ❌ **Menyeluruh** (hanya bila diminta) | `node tools/uji-chrome.js` | **±4–7 menit** |

**Angka pembandingnya (terukur 2 Nov 2026):**

| | Baris | Ukuran | Waktu |
|---|---|---|---|
| Cara lama | 8.435 | 465 KB | ±4–7 menit |
| Cara sasaran | **156** | **7,2 KB** | **10,9 detik** |

**Membuat sasaran baru** (untuk revisi berikutnya): buat berkas
`tools/uji-blok/<NAMA>.js` yang memeriksa **bagian yang direvisi saja**.

> 🛑 **Pengaman:** `tools/uji-chrome.js --blok …` sekarang **menolak** perintah itu
> (berhenti sendiri) supaya cara lambat **tidak bisa dipakai lagi** untuk satu revisi.

### 📝 Bukti nyata — bisa Anda periksa sendiri (K95 · 2 Nov 2026)

Dulu buktinya hanya **kata AI**. Sekarang ada **catatan otomatis**:

| Hal | Di mana |
|---|---|
| Catatan setiap uji | **`artifacts/uji-log.txt`** — ditulis **otomatis** oleh **kedua** alat uji |
| Ringkasan bukti | jalankan **`node tools/cek-cara-uji.js`** |

Contoh hasilnya:

```
=== 🔍 BUKTI CARA UJI — ANodes ===
  uji dijalankan        : 2 kali
  ✅ cara SASARAN       : 2 kali  · total 21.9 dtk (0.4 mnt)
  ⚠️  cara MENYELURUH   : 0 kali  · total 0.0 dtk (0.0 mnt)
  uji diperiksa         : 70  · gagal: 0

  2026-11-02 23:23:40 | sasaran | index.html | K92,K93 | 11.0 dtk | 35 uji | 0 gagal
  2026-11-02 23:24:31 | sasaran | index.html | K92,K93 | 10.9 dtk | 35 uji | 0 gagal
```

⚠️ Karena **kedua** alat menulis ke catatan yang sama, cara lambat **tidak bisa
disembunyikan** — kalau ada AI memakai cara lama, barisnya **tercatat** di situ.

> 📖 **Aturan ini juga ditulis untuk AI lain** di **`.github/copilot-instructions.md`**
> dan di **kepala `agents.md`** — supaya AI apa pun yang bekerja di proyek ini
> **langsung tahu** dan tidak mengulang cara lama.

## 4d. 🎯 Bar hitam atas muat 1 baris

Dulu bar hitam atas pernah **terbelah 2 baris**. Sekarang sudah rapi **1 baris**:

- Di layar sempit, tulisan kecil **“Tahap 5”** disembunyikan sendiri, dan kalau
  makin sempit tulisan **“ANodes”** juga disembunyikan (kotak logo tidak ada lagi
  sejak K17) — supaya **semua tombol tetap terlihat**.
- Tombol **Doc** tidak pernah terpotong: tulisannya menyusut jadi ikon **📄** di layar sempit.

> 🐞 **Catatan perbaikan 14 Sep 2026 (K18):** saat tombol `[🧩 ▼]` ditambahkan,
> toolbar tulis sempat **tidak bisa membuka pilihan warnanya** — ternyata pilihannya
> terbuka tetapi **terpotong** oleh kotak toolbar. Sebabnya aturan tampilan
> `overflow-x: auto` pada toolbar. Aturan itu sudah dibuang, dan sekarang letak
> pilihan **diatur otomatis** supaya selalu masuk layar.

> 🐞 **Perbaikan berikutnya (K19):** di **PC** pilihan tombol **🧩** (paling kanan)
> sempat tampak **separuh** — bagian kanannya (nama plugin) hilang. Ternyata yang
> memotong bukan layar, tapi **kotak aplikasi** yang lebarnya hanya ±480px di tengah
> layar. Sekarang letak pilihan **otomatis digeser ke kiri** kalau akan keluar kotak.
> Kalau pilihan warna / icon / plugin “terasa tidak jalan” atau terpotong,
> itu tanda cacat ini kembali — **laporkan ke AI**.

---


---

*ANodes · **panduan diperbarui 3 November 2026** (K87 🕒 Linimasa Sejarah · K64 ❓ tombol Bantuan · K100 👤 pemisahan data per email · K28h 🗂️ menu `[Doc]` dihapus → halaman Berkas Tersimpan · K99 📖 Judul Perikop · K86 🔀 Paralel TB ⇄ AYT · K97 📅 tombol di navbar Alkitab · K96 🗓️ Bacaan 1 Tahun · K95b · K85 tahap 3 · K90i).*

**Isi yang terbaru di panduan ini:**

- 🕒 **Linimasa Sejarah** (**13u** · K87 · 3 Nov 2026) — sejarah Alkitab sebagai **garis waktu**: **450 peristiwa** berurutan menurut tahun (**4.003 SM … 57 M**), masing-masing dengan **tahun**, **bagian besar** (mis. *“Kerajaan terpecah”*), dan **chip ayat** yang bisa diklik untuk dibaca di Alkitab. Ada **9 zaman** yang bisa disaring dan **kotak cari**. ⚠️ **Beda** dari 📖 Sejarah Kitab: yang itu menerangkan **satu kitab**, ini menyusun **banyak peristiwa menurut masa** sehingga bisa dibandingkan. ⚠️ Tahunnya **perkiraan** (kronologi sumber), bukan angka pasti.
- ❓ **Tombol Bantuan** (**13s** · K64 · 3 Nov 2026) — tombol **❓ Bantuan** di kepala aplikasi; isinya **menyesuaikan halaman yang sedang dibuka** (12 halaman: catatan · Alkitab · halaman kerja · Kamus · Penguat · Sejarah · Peta · Bookmark · Bacaan 1 Tahun · 🗂️ Berkas · 🕒 Linimasa · halaman keterangan plugin). Ditutup dengan **Tutup** / **✕** / **`Esc`** / klik di luar. Ukuran hurufnya ikut **⚙ Setelan**. ❌ Tidak menyentuh catatan.
- 👤 **Pemisahan data per email** (**13t** · K100 · 3 Nov 2026) — email **ditanya satu kali**, lalu **data tiap orang terpisah**: catatan · pengaturan · istilah pribadi · rantai ayat · bookmark · kemajuan bacaan 1 tahun. Ganti lewat **`File ▼ → 👤 Pengguna…`**. Catatan lama **otomatis menjadi milik email pertama** (tidak ada yang hilang). **Tanpa kata sandi** — ini pemisahan data, bukan pengamanan. **☁️ Sinkron ikut terpisah.** Nyaman sampai **±20 pengguna** per perangkat.
- 🗂️ **Menu `[Doc]` dihapus, diganti halaman 🗂️ Berkas Tersimpan** (**13h** · K28h · 3 Nov 2026) — berkas kerja proyek (rencanakerja, CHANGELOG, panduan, agents, prompt) **tidak lagi dibaca dari dalam aplikasi** karena aplikasi sudah hampir selesai. Yang **dipindah**, bukan dihapus: **daftar berkas tersimpan** (rantai 🌿 Ayat Terkait) kini punya halaman sendiri — tombol **🗂️ Berkas** di kepala. Berkat ini berkas aplikasi untuk HP **mengecil 2,29 MB**. ⚠️ **Impor `.md`/`.txt`**, tombol **“📖 Rapi”**, dan **rapikan naskah tempelan** **tetap bekerja** seperti biasa.
- 📖 **Judul Perikop** (**13r** · K99 · 3 Nov 2026) — **judul bagian** tampil **di atas ayatnya** seperti Alkitab cetak (*“Pelayanan Yohanes Pembaptis”*, *“Yesus dibaptis”*). **66 kitab · 2.573 judul · 1.144/1.189 pasal (96,2 %)** · data hanya **132,5 KB**. ❌ **tanpa tombol navbar** (navbar sudah penuh — 9 tombol · 324 = 324 px) ⇒ nyala/mati lewat **halaman keterangan plugin**. 45 pasal memang tidak berjudul di sumbernya; Mazmur 119 punya **22** judul huruf Ibrani. Sumber **AYT** (CC BY-NC 4.0 · pemakaian pribadi).
- 🔀 **Paralel Terjemahan TB ⇄ AYT** (**13q** · K86 · 3 Nov 2026) — tekan tombol **🔀** di navbar halaman baca ⇒ tiap ayat mendapat **kotak biru muda** berisi ayat yang sama dalam **AYT** (Alkitab Yang Terbuka). **66 kitab · 1.189 pasal · 31.102 ayat** — jumlah ayatnya **persis sama** dengan TB, jadi tiap ayat berpasangan. Tekan 🔀 lagi ⇒ kotak hilang. ⚠️ Rencana awal memakai **TSI**, tetapi paket TSI dari eBible.org ternyata **hanya 48 kitab** (18 kitab PL tidak ada) ⇒ dipakai **AYT** (lisensi **CC BY-NC 4.0**, pemakaian pribadi).
- 🧹 **Berkas HP jadi lebih ringan** (**5d** · K95b · 3 Nov 2026) — **6 berkas data** ternyata masuk **dua kali** ke dalam berkas HP. Sekarang **hanya sekali** ⇒ berkas **44,22 → 35,41 MB** (**−8,81 MB**), aplikasi **muat ±450 ms lebih cepat**, dan RAM **±30 MB lebih hemat**. **Tidak ada satu fitur pun yang hilang** — isinya sama persis.
- 🔤 **Interlinear Perjanjian Baru** (**13n-b** · K85 tahap 3 · 3 Nov 2026) — kitab **Kisah 26 s/d Wahyu** kini punya tombol **🔤** juga. Bentuknya **Bentuk B**: **kata Yunani** + **cara baca** + kode Strong + **arti Indonesia** (4 Injil tetap Bentuk A). **4.170 ayat · 4.400 Strong · 5.685 entri arti · 100 %** kata isi terjelaskan. Aplikasi **memilih bentuk sendiri** menurut kitab — Anda tidak perlu mengatur apa pun.
- ✡ **Penjelasan Ibrani Taurat dituntaskan** (**13o** · K90i · 3 Nov 2026) — **149 kata Ibrani baru** (nama bangsa, nama tempat, warna & bahan, hewan, benda kudus, takaran, kata kerja). Kata dijelaskan **306 → 455** · ayat PL **22.602 → 22.688 (97,7 %)** · **Taurat 98,5 % → 99,5 %** (Kejadian **99,9 %** · Ulangan **99,7 %**). 32 ayat sisa **hanya memuat kata fungsi** ⇒ Taurat **efektif 100 %**.
- 🎯 **Uji sasaran** (**4c-b** · K94 · 2 Nov 2026) — uji sekarang **hanya memeriksa bagian yang diperbaiki** (`node tools/uji-sasaran.js K92` ⇒ **±10 detik**), bukan seluruh aplikasi (±4–7 menit). Cara lama **ditolak** oleh pengaman supaya tidak terulang.
- 🔖 **Kartu bookmark bisa diklik** (**13m** · K93 · 2 Nov 2026) — klik kartu di daftar bookmark ⇒ **langsung dibuka di Alkitab** pada ayat itu + **ayatnya disorot** · **🏠** kembali ke **daftar bookmark** (🏠 kedua baru ke catatan) · nama diberi tanda **↗** supaya terlihat bisa diklik · tombol 📋 Copy / ✏️ Edit / 🗑 Hapus **tidak** ikut membuka Alkitab.
- 🔖 **Tombol bookmark selalu muncul** (**13m** · K92 · 2 Nov 2026) — dulu tombol 🔖 **hilang sesudah aplikasi dibuka ulang** (plugin tetap terpasang, tetapi tombolnya tidak dipasang lagi). Sekarang **selalu muncul**.
- 🔍 **Revisi fitur cari di Alkitab** (**4c** · K91 · 2 Nov 2026) — tiga perbaikan: (1) **🏠 kembali ke bacaan sebelum mencari** (baca Keluaran 1 → cari → buka hasil → 🏠 ⇒ **Keluaran 1**, tekan 🏠 lagi baru ke catatan); (2) **saran kata mirip** kalau kata tidak ditemukan (`omesimus` ⇒ saran **onesimus** · salah ketik 1 huruf selalu ketemu · kata ≥7 huruf boleh 2 huruf · maks 8 saran); (3) **🕘 riwayat pencarian** tersimpan **lintas hari** (maks 50 · kata sama tidak menumpuk · ada tombol **🗑 Hapus**).
- 🔀 **Dua jalur saat klik ayat** (**13m** · K82 · 30 Okt 2026) — bar pilihan ayat kini punya **DUA tombol tujuan**: **[📋 Simpan]** ke catatan dan **[🔖 Bookmark]** ke daftar bookmark (langsung pindah ke halaman). Tombol **🔖** di bar atas Alkitab = pintu cepat ke halaman Bookmark. Ikon **📌 diganti 🔖** (📌 dipakai peta).
- 🏠 **Tombol Home bookmark** (**13m** · K81b · 30 Okt 2026) — tombol **🏠** di halaman 📌 Bookmark kini kembali ke **halaman asal**: dari Alkitab ⇒ balik ke **bacaan Alkitab**, dari catatan ⇒ balik ke **catatan**. Judul tombolnya ikut berubah supaya jelas.
- 🔖 **Plugin Bookmark Ayat** (**13m** · K81 · 30 Okt 2026) — tombol **🔖** di halaman baca · klik angka ayat (boleh beberapa, **harus berurutan**) ⇒ **[🔖 Bookmark]** · ayat yang **lompat** jadi **dua bookmark** · ayat yang sudah dibookmark diberi **tanda 🔖** · **halaman sendiri** berisi daftar bookmark dengan **[📋 Copy] [✏️ Edit] [🗑 Hapus]** · **mode edit** dengan stabilo (klik = tambah · klik ulang = hapus) · catatan **satu baris** per bookmark · ikut **sinkron PC ⇄ HP**.
- 🗺️ **Peta di bawah catatan** (**13l** · K73 · 5 Okt 2026) — panel **📋 Ayat & Istilah** kini punya bagian **🗺️ Peta (n)**: nama tempat yang Anda sebut di catatan muncul sebagai chip ⇒ diklik **peta + keterangan + ayat**; klik nama lain ⇒ peta berganti; klik ayat ⇒ pindah ke Alkitab.
- 🗺️ **Plugin Peta Alkitab** (**13k**) — halaman ke-7 · klik nama ⇒ wilayah digaris + keterangan + ayatnya.
- 📍 **Peta “panduan mana untuk halaman mana”** (bagian **0**) — catatan · Alkitab · Peta · Sejarah · Ayat Terkait · Kamus · Penguat · 🗂️ Berkas · Gudang Plugin.
- 📖 **Bagian Sejarah Alkitab & Sejarah Kitab sendiri** (**3f-3**) — prakata 15.356 huruf · sejarah 66 kitab · 🔍 cari berwarna (K58) · tautan & istilah (K56/K56b/K56c) · `Sea` di “Dead Sea Scrolls” (K57).
- 🖊 **Penguat** (**3f-2**): menempel di catatan (K45 i) · di halaman baca Alkitab (K54) · halaman Pembaca Penguat (K47).
- 📚 **Kamus Istilah** (**3f**): kolom berlevel (K51) · simpan ke catatan (K51 c+d) · `[↗ full]` + catatan pengguna (K43) · tautan di halaman baca (K52) · perbaikan “tidak ditemukan” (K50) · **diperluas dengan nama orang/tempat & kata ganti** (K83 · 30 Okt 2026 · **392 → 432 istilah**).
- 🎛 **Menu halaman Alkitab 2 baris** (K63 · di bagian **5c**) — kotak kitab di baris 1 · ⚙ pilihan cara buka **sudah dihapus** · ganti kitab dari **kotak ▾** atau **📋 PILIH**.
- 🎛 **Garis vertikal dihapus** (K61) — ruang tulis lebih lebar · pembeda = latar warna tipis.
- 🐞 **Perbaikan nomor bagian kembar** (**3f** · **4b** · **5b**) supaya mudah ditunjuk.
- 🔤 **Sapaan diganti “Anda”** (aturan K48) — supaya panduan enak dibaca siapa saja dan siap dipakai di tombol **[help]**.
- 🗺️ **Bentuk peta kecil di ayat disamakan dengan halaman Peta** (K69c) — sebabnya **terukur**:
  kotak dulu **0,42:1** padahal panggungnya **2,4:1** (citra **ditarik 5,76×**) dan proyeksinya
  **tidak memakai faktor** seperti halaman Peta ⇒ gepeng. Sekarang **F = 1,5** + kotak **2:1** +
  lebar bawaan **±8°** (citra penuh untuk **87 %** tempat; dulu ±21° = **0 %**).
- 🧹 **Lebih banyak tempat dikenali tombol 📍** (K69d) — **ejaan TB** disamakan
  (Damaskus→**Damsyik** · Susa→**Susan** · Babilonia→**Babel** · Filistia→**Filistin** ·
  Laut Merah→**laut Teberau** · dll) + **nama berkurung** ikut dikenali (`Yope (Jaffa)`→**Yope**) ·
  **4 rujukan ayat salah** dibetulkan · **kata mirip** (kata kerja “raba”, istilah musik “Sela”)
  ❌ tidak ikut ditandai ⇒ ayat bertombol **3.591 → 4.441** (11,5 % → **14,3 %**).
- 🔠 **Nama tempat ikut ukuran huruf pengaturan** (K69f · 5 Okt 2026) — nama di **daftar lokasi**,
  nama **di atas peta**, dan nama di **peta kecil pada ayat** semuanya mengikuti
  **⚙ Besar huruf keseluruhan**. Dulu ketiganya **tetap** (kecil) walau huruf aplikasi diperbesar.
  Ukuran baru berlaku **saat itu juga** (tanpa menutup halaman). Contoh terukur:
  ukuran **12 px → 16 px → 24 px** menghasilkan nama peta **12,75 → 17 → 25,5**
  dan nama di daftar **8,6 → 11,5 → 17,25 px**.
- 📚 **Kamus diperluas: nama orang, tempat & kata ganti** (K83 · 30 Okt 2026) — **nama orang**
  (Yesus · Musa · Daud · Abraham · Paulus · Esau · Elisa · Ruben · Nebukadnezar · Ahab · Daniel ·
  Maria · Pilatus …), **nama tempat** (Yerusalem · Mesir · Babel · Yordan · Sion · Tirus ·
  Damsyik · Yerikho · Libanon · Sinai · Efesus …), **nama bangsa** (Amori · Kasdim · Midian ·
  Amalek · Yunani …), dan **kata ganti** (Aku · Dia · Engkau · Kamu) kini bergaris putus-putus &
  bisa diklik. Jumlah istilah **392 → 1.154** (1.207 tulisan).
  ⚠️ **Kata ganti hanya ditandai bila berawalan HURUF BESAR** — “Aku” (menunjuk Allah) bergaris,
  “aku” huruf kecil tidak.
  ⚠️ **Sakelar `🔗 OFF`/`🔗 ON` di bar info catatan HANYA berlaku untuk catatan** — di
  **halaman baca Alkitab**, **Penguat**, dan **Sejarah** istilah **selalu** bisa diklik.

- 🔤 **Interlinear Perjanjian Baru — 1.398 arti baru ⇒ 100 %** (K85 tahap 3 · 3 Nov 2026) —
  kolom 🔤 untuk **Kisah 26 s/d Wahyu** kini **lengkap**: **1.398 arti Indonesia** ditambahkan ⇒
  kata isi terjelaskan **95,1 % → 100,0 %** (entri arti **4.168 → 5.685**). Contoh yang sekarang
  muncul: *bukti · Akeldama · Kirene · Yoel · Safira · Teudas · Gaza · Malta · Harmagedon ·
  Patmos · Febe · Tertius · Maranata · menjawab · Damsyik · Yope · Kornelius · Feliks · Atena ·
  Korintus* — dan **1 Korintus 16:22** (*Maranata*) kini punya arti Indonesia.
  ✅ **Tidak ada lagi** kata isi yang tampil `—` tanpa keterangan. Yang tampil `—` hanya
  **kata fungsi** (kata sandang, kata depan, kata sambung) yang memang tidak perlu diterjemahkan.
  🐞 **Cacat yang ikut ketemu & diperbaiki:** **118 nomor Strong** (semuanya kata keterangan)
  **dipakai di ayat tetapi tidak punya keterangan sama sekali** ⇒ kolom menampilkan `—` tanpa
  jenis kata. Sekarang **setiap** nomor Strong yang dipakai di ayat **wajib** punya keterangan +
  jenis kata.

---

## 13p. 🗓️ Plugin **Bacaan Alkitab 1 Tahun** (K96 · 3 Nov 2026 · halaman ke-10)

> **Untuk siapa:** Anda yang ingin **membaca SELURUH Alkitab dalam 1 tahun** — selesai semua,
> tidak ada pasal yang terlewat.
>
> **Bentuknya:** halaman sendiri **🗓️ BACAAN 1 TAHUN**, bisa dibuka dari **Gudang Plugin (🧩)**
> kartu **🗓️ Bacaan Alkitab 1 Tahun** → **[▶ Buka]**.
> Kartu ini **menggantikan 🕊️ Pengingat Firman** yang selama ini kosong.

### Apa yang Anda dapat

| Hal | Isi |
|---|---|
| **Rencana** | **3 pilihan** — pilih sesuai selera (bisa diganti kapan saja, kemajuan **tidak hilang**) |
| **Cakupan** | **100 %** — seluruh **1.189 pasal** dari **66 kitab**, **365 hari** |
| **Setiap hari** | **berapa pasal** sudah ditentukan otomatis (rata-rata **85 ayat/hari**) |
| **Referensi** | setiap pasal **sudah** punya 🖊 penguat · 📚 kamus · 🌿 ayat terkait · 🗺️ peta · 🔤 interlinear ⇒ tinggal klik |
| **Kalender** | **365 kotak** — kotak yang sudah dibaca **berwarna** |
| **🔥 berturut-turut** | jumlah hari beruntun Anda membaca tanpa putus |
| **☁️ Sinkron** | kemajuan ikut tersinkron **PC ⇄ HP** |

### Dua pintu masuk

| Pintu | Caranya | Kapan dipakai |
|---|---|---|
| **📅 di navbar Alkitab** | buka Alkitab mana pun ⇒ tombol **📅** di baris ikon (setelah 🔍 Cari) | **paling cepat** — sedang membaca, langsung lihat bacaan hari ini |
| **🧩 gudang plugin** | **🧩** → kartu **🗓️ Bacaan Alkitab 1 Tahun** → **[▶ Buka]** | dari catatan, tanpa membuka Alkitab |

> 💡 **Ikon tombol 📅 memberi tahu keadaan Anda:**
> **📅** = hari ini **belum** dibaca · **✅** = hari ini **sudah** dibaca.
> Jadi Anda tidak perlu membuka halamannya hanya untuk memeriksa.
>
> Setelah selesai membaca dan menandai, tekan **🏠** ⇒ Anda kembali ke **pasal yang tadi dibaca**
> (bukan ke catatan). Tekan 🏠 sekali lagi baru kembali ke catatan.

### Tiga rencana — pilih mana?

| Tombol | Namanya | Cara bacanya | Ayat/hari |
|---|---|---|---|
| 🅰️ **Berurutan** | Kejadian → Wahyu | satu arah, dari awal sampai akhir | **28–176** (tengah 85) |
| 🅱️ **PL + PB tiap hari** | Perjanjian Lama **dan** Perjanjian Baru | dua bagian dibaca **bersamaan** tiap hari | 26–207 |
| ⭐ **Every Day in the Word** | PL + PB **+ Mazmur + Amsal** | empat bagian tiap hari — paling bervariasi | 22–259 |

> 💡 **Saran:** kalau ini pertama kali, pakai **🅰️ Berurutan** — paling mudah diikuti.
> Kalau ingin **tidak jenuh** karena Kitab Imamat/Bilangan panjang, pakai **⭐ Every Day in the Word**.

### Cara pakai (5 langkah)

1. **Dua pintu masuk** — pilih salah satu:
   - **Dari halaman baca Alkitab:** tekan tombol **📅** di baris ikon (sebelah 🔍 Cari).
     Ikon **📅** = hari ini **belum** dibaca · **✅** = hari ini **sudah** dibaca.
   - **Dari gudang plugin:** **🧩** → kartu **🗓️ Bacaan Alkitab 1 Tahun** → **[▶ Buka]**
2. Halaman terbuka menampilkan **“📖 Hari ini — hari 1”** dengan bacaan hari ini.
3. Tekan **[📖 Buka di Alkitab]** ⇒ langsung pindah ke **Kejadian 1** (halaman baca biasa).
   Di sana semua referensi (🖊 · 📚 · 🌿 · 🗺️ · 🔤) **sudah tersedia** seperti biasa.
4. Selesai membaca ⇒ kembali (**🏠**), lalu tekan **[○ Tandai sudah dibaca]**.
   Tombol berubah jadi **“✓ Sudah dibaca”**, kotak hari itu di kalender **berwarna**,
   dan **🔥 berturut-turut** naik.
5. Besoknya, buka lagi ⇒ otomatis menampilkan **hari 2** (atau hari sesuai tanggal).

### Bacaan lebih dari satu bagian? (🅱️ dan ⭐)

Kalau rencana Anda punya **lebih dari satu bagian per hari** (mis. PL + PB + Mazmur),
setiap bagian punya **tombol 📖 sendiri**:

```text
📖 Hari ini — hari 1
  PL   Kejadian 1–2                    2 pasal · 56 ayat   📖   ← tekan ini: buka Kejadian 1
  PB   Matius 1                        1 pasal · 25 ayat   📖   ← tekan ini: buka Matius 1
  Mzm  Mazmur 1                        1 pasal · 6 ayat    📖   ← tekan ini: buka Mazmur 1
[📖 Buka di Alkitab]  [○ Tandai sudah dibaca]
```

> ⚠️ Tombol besar **[📖 Buka di Alkitab]** hanya membuka bagian **pertama**.
> Untuk bagian lain, tekan **📖 kecil di barisnya masing-masing**.

### Kalender 365 kotak

Gulir ke bawah ⇒ **📅 Kalender — klik satu hari untuk melihat & membuka**.
- Kotak **berwarna** = hari yang sudah Anda tandai selesai.
- **Klik kotak mana pun** ⇒ rincian hari itu muncul **tepat di atas kalender**
  (bacaan apa saja + tombol 📖). Berguna kalau ingin **melihat ke depan** atau
  **mengulang hari yang terlewat**.

### Kalau ketinggalan beberapa hari

**Tidak apa-apa — tidak menumpuk.** Hari dihitung dari **tanggal**, bukan dari berapa kali
Anda membuka aplikasi:

```text
mulai 3 Nov 2026  →  5 Nov 2026 = hari 3      (meski 4 Nov tidak dibaca)
```

⇒ Anda **tidak pernah** disuguhi 3 hari bacaan sekaligus. **🔥 berturut-turut** memang
kembali ke 0, tetapi **kemajuan tidak hilang**.

### Ganti rencana

Tekan tombol rencana lain di bagian atas (🅰️ / 🅱️ / ⭐).
**Kemajuan Anda tetap** — hari yang sudah ditandai tidak hilang, hanya **susunan bacaannya**
yang berubah. Jadi kalau 🅰️ terasa berat, coba ⭐ tanpa takut kehilangan apa pun.

### ⚠️ Yang perlu diketahui

- **Mulai dihitung dari hari Anda memasang/membuka pertama kali** — bukan 1 Januari.
  Jadi Anda bisa mulai kapan saja.
- **Boleh dimatikan kapan saja** — lepas plugin lewat 🧩 ⇒ halaman tertutup, catatan Anda
  **tidak tersentuh**. Kemajuan tersimpan tetap ada dan kembali kalau dipasang lagi.
- **Tidak perlu internet** — daftar bacaannya **sudah ditanam** di aplikasi.
- **Bukan pengingat berbunyi.** ANodes tidak mengirim notifikasi (aplikasi `file://` tanpa
  server). **🔥 berturut-turut** dan **kotak berwarna** itulah pengingatnya.
- **☁️ Sinkron** menyertakan kemajuan ini ⇒ PC dan HP menampilkan **hari yang sama**.

---

## 13q. 🔀 Plugin **Paralel Terjemahan** — TB ⇄ AYT (K86 · 3 Nov 2026)

> **Gunanya:** membaca **dua terjemahan sekaligus** pada ayat yang sama — **TB** (Terjemahan Baru)
> di atas, **AYT** (Alkitab Yang Terbuka) tepat di bawahnya. Berguna kalau ada ayat yang
> kalimatnya terasa sulit: Anda bisa langsung melihat bagaimana terjemahan lain mengatakannya.

### 📖 Cara pakai (3 langkah)

1. Buka **📖 Alkitab** seperti biasa (klik tautan ayat di catatan, atau 🧩 ⇒ 📖 Alkitab).
2. Tekan tombol **🔀** di **navbar** halaman baca (baris pertama, di sebelah 🔖).
   Tombolnya berubah jadi **🔀 nyala** (biru) — itu tandanya sedang aktif.
3. Setiap ayat kini punya **kotak biru muda** di bawahnya berisi ayat yang sama dalam **AYT**.

Tekan **🔀** sekali lagi ⇒ semua kotak hilang, kembali seperti semula.

### 📐 Bentuknya

```text
HALAMAN BACA — Yohanes 3
16  Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah
    mengaruniakan Anak-Nya yang tunggal …                        🔀
    ┌──────────────────────────────────────────────────────────┐
    │ AYT                                                      │
    │ Karena Allah sangat mengasihi dunia ini, Ia memberikan   │
    │ Anak-Nya yang tunggal itu …                              │
    └──────────────────────────────────────────────────────────┘
17  Sebab Allah mengutus Anak-Nya ke dalam dunia bukan untuk …
    ┌──────────────────────────────────────────────────────────┐
    │ AYT                                                      │
    │ Allah mengutus Anak-Nya ke dalam dunia bukan untuk …     │
    └──────────────────────────────────────────────────────────┘
```

⚠️ **Kenapa BERTUMPUK, bukan dua kolom kiri-kanan?** Karena ANodes selalu memakai
**tampilan gaya HP** (lebar ±480px). Kalau dibelah dua, tiap kolom hanya **±220px** —
terlalu sempit untuk dibaca. Jadi AYT diletakkan **di bawah** ayatnya: lebar penuh,
tetap enak dibaca, dan mata mudah membandingkan.

### 📊 Isi

| Hal | Angka |
|---|---|
| Kitab | **66** (seluruh Alkitab) |
| Pasal | **1.189** |
| Ayat | **31.102** — **persis sama** dengan TB, jadi tiap ayat berpasangan |
| Ukuran data | **5.073,4 KB** (±5,0 MB) |
| Sumber | **AYT** — Alkitab Yang Terbuka (eBible.org) |
| Lisensi | **CC BY-NC 4.0** — boleh dipakai **untuk diri sendiri / non-komersial**, wajib menyebut sumber |

### ⚠️ Yang perlu diketahui

- **Pemakaian pribadi.** AYT berlisensi **CC BY-NC 4.0** — **bukan** untuk dijual atau dipakai
  komersial. Nama sumber & lisensi ditulis di **kaki kotak** setiap pasal.
- **3 ayat di Yesaya berbeda penomoran.** Yesaya **22:10 · 22:11 · 22:18** pada AYT **digabung**
  dengan ayat sebelumnya. Di kotak akan tertulis
  *“— (pada AYT ayat ini digabung dengan ayat N)”* — itu **bukan** kerusakan.
- **Boleh dimatikan kapan saja** — tekan 🔀 lagi, atau lepas plugin lewat 🧩. Catatan Anda
  **tidak tersentuh**; pilihan nyala/mati **diingat** untuk lain kali.
- **Tidak perlu internet** — seluruh teks AYT **sudah ditanam** di aplikasi.
- **Tidak memperlambat menulis catatan** — data AYT hanya dibaca saat halaman baca Alkitab
  dibuka dan tombol 🔀 dinyalakan.

### ❓ Pertanyaan yang sering muncul

**Tanya: Kenapa AYT, bukan TSI (Terjemahan Sederhana Indonesia)?**
Rencana awal memang TSI. Tetapi setelah diunduh dan **dihitung**, paket TSI dari eBible.org
ternyata **hanya berisi 48 kitab** — **18 kitab Perjanjian Lama tidak ada** (1 & 2 Tawarikh,
Ayub, Mazmur, Kidung Agung, Yeremia, Ratapan, Yehezkiel, Daniel, Hosea, Yoel, Amos, Obaja,
Mikha, Nahum, Habakuk, Zefanya, Hagai). Jadi TSI **tidak bisa** dipakai untuk paralel
seluruh Alkitab. AYT punya **66 kitab lengkap** dengan jumlah ayat **sama persis** dengan TB.

**Tanya: Bisa menambah terjemahan lain lagi?**
Bisa — mesinnya sudah dibuat umum. Tetapi tiap terjemahan menambah **±5 MB** ke berkas HP,
jadi sebaiknya hanya kalau memang diperlukan.

**Tanya: Apakah kotak AYT ikut tersimpan ke catatan?**
Tidak. Kotak itu **hanya tampilan** di halaman baca. Kalau ingin mengutip AYT ke catatan,
pakai **📤** seperti biasa (yang dikirim adalah ayat TB).

## 13r. 📖 Plugin **Judul Perikop** — judul di atas ayat (K99 · 3 Nov 2026)

> **Gunanya:** menampilkan **judul perikop** (judul bagian) di atas ayat-ayatnya — seperti
> yang biasa Anda lihat di Alkitab cetak. Jadi saat membaca, Anda tahu sedang berada di bagian
> apa: *“Pelayanan Yohanes Pembaptis”*, *“Yesus dibaptis”*, *“Pencobaan di padang gurun”*.

### 📖 Cara pakai (2 langkah)

1. Pasang plugin **📖 Judul Perikop** lewat **🧩** (gudang plugin) — sekali saja.
2. Buka **📖 Alkitab** seperti biasa. Judul perikop **langsung muncul** di atas ayatnya.

**❌ Tidak ada tombol di navbar** — dan itu **sengaja**. Navbar halaman baca sudah penuh
(**9 tombol**, terukur **324 px** dari **324 px** yang tersedia); menambah tombol ke-10 akan
membuatnya **meluber**. Jadi menyalakan/mematikan plugin dilakukan di **halaman keterangan
plugin** (🧩 ⇒ 📖 Judul Perikop ⇒ pilihan **Tampil** ⇄ **Mati**).

### 📐 Bentuknya

```text
HALAMAN BACA — Markus 1
┃ Pelayanan Yohanes Pembaptis            ← JUDUL PERIKOP (cokelat, garis kiri)
1  Inilah permulaan Injil tentang Yesus Kristus, Anak Allah.
2  Seperti ada tertulis dalam kitab nabi Yesaya: …
3  ada suara orang yang berseru-seru di padang gurun: …
┃ Yesus dibaptis
9  Pada waktu itu datanglah Yesus dari Nazaret di tanah Galilea …
```

- **Judul utama** = teks **tebal cokelat** dengan **garis kiri**.
- **Sub-judul** (kalau ada) = lebih kecil, **tanpa** garis kiri.
- Di **kaki pasal** ada baris kecil berisi **nama sumber & lisensi** (syarat CC BY-NC).

### 📊 Isi

| Hal | Angka |
|---|---|
| Kitab | **66** (seluruh Alkitab) |
| Judul | **2.573** |
| Pasal yang punya judul | **1.144 dari 1.189 = 96,2 %** |
| Ukuran data | **132,5 KB** (kecil — tidak menambah berat berarti) |
| Sumber | **AYT** — Alkitab Yang Terbuka (eBible.org) · **sama** dengan plugin 🔀 Paralel |
| Lisensi | **CC BY-NC 4.0** — pemakaian pribadi, wajib menyebut sumber |

### ⚠️ Yang perlu diketahui

- **45 pasal tidak punya judul** — misalnya Imamat 22, Ulangan 24, Yosua 17, dan beberapa
  pasal Ayub (5 · 7 · 10 · 13 · 14 · 17 · 24 · 27 · 30 · 31). Itu **bukan kerusakan**:
  sumbernya memang tidak memberi judul di situ. Ayatnya tetap tampil normal.
- **Mazmur 119 punya 22 judul** — satu untuk tiap huruf Ibrani (Alef · Bet · Gimel … Taw).
  Itu memang susunan Mazmur 119, bukan salah data.
- **Amsal 22–24 tidak menampilkan “—1—” … “—30—”** — sumber AYT memakai penanda itu untuk
  **nomor amsal**, bukan judul. Sudah disaring supaya tidak muncul sebagai judul palsu.
- **Boleh dimatikan kapan saja** — lewat halaman keterangan plugin (Tampil ⇄ Mati) atau dengan
  melepas plugin di 🧩. Catatan Anda **tidak tersentuh**; pilihan **diingat** untuk lain kali.
- **Tidak perlu internet** — seluruh judul **sudah ditanam** di aplikasi.
- **Tidak memperlambat menulis catatan** — data judul hanya dibaca saat halaman baca Alkitab
  dibuka.

### ❓ Pertanyaan yang sering muncul

**Tanya: Kenapa judulnya dari AYT, bukan dari TB?**
Karena **TB tidak menyertakan judul perikop** di dalam teksnya, sedangkan AYT menyertakannya.
Jumlah ayat AYT **sama persis** dengan TB (31.102), jadi judulnya menempel tepat di ayat yang
benar. Yang ditampilkan **hanya judulnya** — teks ayat tetap **TB**.

**Tanya: Apakah judulnya ikut tersimpan ke catatan?**
Tidak. Judul itu **hanya tampilan** di halaman baca Alkitab.

**Tanya: Bisa dicetak / diekspor?**
Judul perikop **tidak** ikut ke 📤 (kirim ke catatan) maupun ekspor — yang dikirim tetap ayat TB.

---

## 13s. ❓ Tombol **Bantuan** — isinya menyesuaikan halaman (K64 · 3 Nov 2026)

Tekan tombol **❓ Bantuan** di kepala aplikasi (sebelah **🗂️ Berkas**). Yang muncul adalah
**bantuan untuk halaman yang sedang Anda buka** — jadi tidak perlu mencari-cari di panduan ini.

```text
KEPALA:  ANodes  ●   [⚙ Setelan] [🧩 Plugin] [📂 File]
                     [🔍 Cari] [🗂️ Berkas] [❓ Bantuan]
                                                │ ditekan
                                                ▼
┌──────────────────────────────────────────────────────────┐
│ 📖 Bantuan — Membaca Alkitab                       ✕     │
├──────────────────────────────────────────────────────────┤
│ Anda sedang di halaman baca Alkitab. Menu terdiri dari 2  │
│ baris yang tidak ikut tergulir.                           │
│                                                           │
│ 🧭 Baris 1 — pindah tempat                                │
│  🏠        kembali ke catatan — tepat di kata yang diklik  │
│  [Kitab▾]  ganti kitab (pintu ke-1)                        │
│  📋 PILIH  pilih kitab → pasal → ayat lewat kisi           │
│  🔍 Cari   cari nama ayat atau kata/kutipan                │
│  …                                                        │
├──────────────────────────────────────────────────────────┤
│                                            [ Tutup ]      │
└──────────────────────────────────────────────────────────┘
```

### Apa saja isinya

| Anda sedang di… | Bantuan yang muncul |
|---|---|
| 📝 **Catatan** | **paling lengkap** — menulis · simpan otomatis · toolbar · menu File · mencari · istilah & tautan ayat · 🔗 ON/OFF · kirim ayat · ⚙ · ☁️ sinkron · bila ada yang aneh |
| 📖 **Alkitab** | 2 baris menu · mengklik ayat · **3 cara mencari** · 3 tujuan tombol 🏠 · apa yang ditambahkan plugin |
| 🌿 **Halaman kerja** | menyusun rantai · `✓ pilih` · menyimpan · menghapus cabang · riwayat jalur · mode grup |
| 📚 **Kamus Istilah** | kolom berlevel · tiga bagian tiap kolom · `[↗ full]` · catatan pribadi |
| 🖊 **Penguat** | tiga tempat penguat muncul · istilah & tautan ayat di dalamnya · mengatur tampilan |
| 📜 **Sejarah** | sejarah Alkitab vs sejarah kitab · 🔍 cari berwarna · istilah & tautan |
| 🗺️ **Peta** | menyaring jenis · membaca peta · kata tempat 📍 di halaman baca |
| 🔖 **Bookmark** | menandai · halaman daftar · mode edit · catatan per bookmark |
| 🗓️ **Bacaan 1 Tahun** | tiga rencana · menandai selesai · kalender |
| 🗂️ **Berkas Tersimpan** | 🌿 Buka · + Ayat · 🗑 · kapan berkas terbentuk |
| 🧩 **Halaman keterangan plugin** | **hanya tujuan plugin** (cara pakainya sudah ada di daftar plugin itu) |

**Cara menutup:** tombol **Tutup** · **✕** · tekan **`Esc`** · klik di luar kotak.
Membuka halaman lain juga **menutup bantuan** supaya isinya tidak tertinggal.

> 💡 **Ukuran huruf bantuan ikut ⚙ Setelan** — kalau kurang besar, naikkan di **⚙ Setelan**.
> Tombol `[?]` **tidak mengubah** catatan Anda sama sekali.

---

## 13t. 👤 Pemisahan data per **email** (K100 · 3 Nov 2026)

ANodes bisa dipakai **beberapa orang di satu perangkat** (atau satu orang dengan beberapa
"profil"). Tiap email mendapat **ruang datanya sendiri**: catatan · pengaturan · istilah pribadi ·
rantai ayat · bookmark · kemajuan bacaan 1 tahun.

### Saat pertama membuka

```text
┌──────────────────────────────────────────────────────┐
│ 👤 Siapa yang memakai ANodes?                  ✕     │
├──────────────────────────────────────────────────────┤
│ Tulis email Anda satu kali. Sejak itu ANodes         │
│ mengingatnya, dan data Anda terpisah dari data       │
│ orang lain di perangkat ini.                         │
│                                                      │
│ Email                                                │
│ ┌──────────────────────────────────────────────────┐ │
│ │ nama@contoh.com                                  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│              [ Lewati dulu ]  [ Pakai email ini ]    │
└──────────────────────────────────────────────────────┘
```

- Tulis email → **Pakai email ini**. Aplikasi **memuat ulang sendiri** sebentar, lalu siap dipakai.
- **Catatan yang sudah ada** (kalau sebelumnya Anda sudah memakai ANodes) **otomatis menjadi milik
  email pertama itu** — **tidak ada yang hilang**.
- **Lewati dulu** = tetap memakai ANodes tanpa email (seperti sebelumnya). Bisa diisi kapan saja
  lewat `File ▼ → 👤 Pengguna…`.

### Mengganti email

`File ▼ → 👤 Pengguna…` → tulis email lain → **Pakai email ini**.

- Kalau email itu **sudah pernah dipakai** di perangkat ini, daftarnya muncul di bawah kotak
  (**“Sudah ada di perangkat ini”**) — klik saja, tidak perlu mengetik.
- Email baru ⇒ ruang **baru yang kosong** (data email lama **tidak** terlihat dan **tidak** terhapus).
- Kembali ke email lama ⇒ datanya **utuh** seperti terakhir dipakai.

### Yang perlu diketahui

| Hal | Keterangan |
|---|---|
| **Tanpa kata sandi** | Pemisahan ini untuk **memisahkan data**, bukan mengamankannya. Siapa pun yang bisa membuka ANodes di perangkat itu bisa memilih email mana pun. |
| **Hanya di perangkat ini** | Daftar email disimpan di perangkat. Di HP lain, tulis email yang sama untuk melihat data yang sama (bila ☁️ Sinkron dipakai). |
| **☁️ Sinkron ikut terpisah** | Tiap email punya datanya sendiri di server, jadi catatan Anda **tidak** bercampur dengan catatan orang lain. |
| **Tidak ada yang dihapus** | Ganti email **tidak pernah** menghapus data. Untuk benar-benar menghapus, hapus catatannya satu per satu. |
| **Batas praktis** | Nyaman sampai **±20 pengguna** per perangkat. |

---

## 13u. 🕒 Plugin **Linimasa Sejarah** — garis waktu 450 peristiwa (K87 · 3 Nov 2026)

ANodes sudah punya **📖 Sejarah Kitab** (panel per kitab). **🕒 Linimasa** itu **BEDA** —
ini menyusun **450 peristiwa** menurut **tahunnya**, dari **Penciptaan (4.003 SM)** sampai
**Paulus di Roma (57 M)**, sehingga bisa **dibandingkan**: nabi mana hidup sezaman dengan
raja mana.

| | 📖 Sejarah Kitab (`3f-3`) | 🕒 Linimasa Sejarah (bagian ini) |
|---|---|---|
| Satuan | **satu kitab** | **satu peristiwa** |
| Isi | penulis · tema · tokoh · ayat kunci | tahun · judul peristiwa · bagian besar · ayat |
| Susunan | per kitab 1–66 | **menurut tahun** |
| Bisa dibandingkan? | ❌ tidak | ✅ ya — “siapa hidup kapan” |

### Cara membuka

**🧩 Gudang Plugin** → **🕒 Linimasa Sejarah** → **▶ Buka Linimasa**.
(Bisa juga lewat **🧩 ▼** di toolbar tulis.) Kalau belum dipasang, tekan **⬇ Pasang** dulu.

```text
┌────────────────────────────────────────────────────────────┐
│ [🏠] 🕒 LINIMASA SEJARAH          450 peristiwa · v3Nov-a  │
├────────────────────────────────────────────────────────────┤
│ [Semua] [Penciptaan & bapa leluhur] [Bapa bangsa & Mesir]  │ ← saring zaman
│ [Hakim-hakim] [Kerajaan bersatu] [Kerajaan terpecah] …     │
│ [🔍 cari peristiwa…                                     ]  │
├────────────────────────────────────────────────────────────┤
│ 🕰️ PENCIPTAAN & BAPA LELUHUR                              │ ← kepala zaman
│  4003 SM  Penciptaan segala sesuatu                        │
│           Kej 1:1  Kej 1:2  Kej 1:3  Kej 1:4  …  +2 lagi   │ ← chip ayat
│  3874 SM  Kain membunuh Habel                              │
│           Kej 4:8                                          │
│  2347 SM  Air bah mulai turun                              │
│           Kej 7:11  Kej 7:12  …                            │
└────────────────────────────────────────────────────────────┘
```

### Tombol & kegunaannya

| Tombol | Gunanya |
|---|---|
| **🏠** | kembali ke halaman sebelumnya (kalau tadi dari Alkitab, kembali ke Alkitab dulu) |
| **Chip zaman** | saring peristiwa menurut masa · tekan **`Semua`** untuk melihat 450 semuanya |
| **🔍 cari** | ketik kata apa pun (mis. `Yerusalem`, `Bait`, `Paskah`, `Yosia`) — 450 judul **dan** bagiannya ikut dicari |
| **Chip ayat** (mis. `Kej 1:1`) | buka ayat itu di **halaman baca Alkitab** · 🏠 membawa Anda **kembali ke Linimasa** dulu |
| **+n lagi** | peristiwa dengan banyak rujukan hanya menampilkan **6 chip** supaya rapi — sisanya tetap ada di data |

### 9 zaman

`Penciptaan & bapa leluhur` (63) · `Bapa bangsa & Mesir` (65) · `Hakim-hakim` (25) ·
`Kerajaan bersatu` (9) · `Kerajaan terpecah` (81) · `Pembuangan & pemulihan` (4) ·
`Yesus` (93) · `Gereja mula-mula` (110) — jumlahnya **450**.

### Yang perlu diketahui

| Hal | Keterangan |
|---|---|
| **Tahun = perkiraan** | Sumber memakai **kronologi konservatif** (Penciptaan ±4003 SM). Alkitab sendiri **tidak** memberi tahun; ini **salah satu tafsiran** yang lazim. ❌ Jangan dipakai sebagai angka pasti. |
| **Judul sudah bahasa Indonesia** | 450 judul diterjemahkan **tangan** dari sumber berbahasa Inggris. |
| **Nama di dalam judul** | Memakai ejaan sumber (mis. *Yeroboam*, *Hizkia*) — **nama orang/tempat** tidak diubah supaya tetap bisa dicocokkan dengan literatur. |
| **Saringan diingat** | Zaman & kata terakhir yang Anda pilih **diingat** saat halaman ditutup. Tekan **`Semua`** + kosongkan kotak cari untuk kembali ke tampilan penuh. |
| **Sumber data** | `robertrouse/theographic-bible-metadata` · **CC-BY-SA-4.0** — nama sumber & lisensi tertulis di **kaki halaman**. |
| **Butuh plugin Alkitab** | Tanpa 📖 Alkitab, halaman tetap bisa dibaca — tetapi **chip ayat tidak bisa dibuka**. |
