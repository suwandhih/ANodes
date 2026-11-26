# ANodes

Aplikasi catatan + Alkitab berbasis HTML/CSS/JS murni (tanpa server, tanpa framework).

- Catatan bergaya Markdown (kategori · cari · impor/ekspor · sinkron opsional)
- Alkitab TB 66 kitab · 1.189 pasal · 31.102 ayat
- 13 plugin: penguat ayat · ayat terkait · kamus istilah · sejarah · peta · interlinear
  (Ibrani/Yunani/Perjanjian Baru) · paralel AYT · judul perikop · linimasa · bacaan 1 tahun · bookmark

## Cara menjalankan

Buka `index.html` langsung di browser (`file://`), atau layani sebagai situs statis:

```bash
npx serve .
```

Tidak ada proses build. Semua data di `plugin/*/data/` sudah siap pakai.

## Struktur

```
index.html          kepala aplikasi
css/                base.css + app.css
js/                 10 berkas (editor, store, plugin, setting, sinkron, pengguna, bantuan, …)
plugin/             13 plugin (mesin + tampilan + data)
worker/             Cloudflare Worker untuk sinkron opsional
```

## Sinkron (opsional)

`worker/worker.js` = perantara Cloudflare Worker ke Turso. Token database **tidak**
ada di repo ini — disimpan sebagai Secret di Cloudflare. Lihat `worker/README.md`.

## Lisensi data

- Teks TB dan data pendukung: sesuai sumber masing-masing.
- Alkitab Yang Terbuka (AYT) © YLSA — **CC BY-NC 4.0**, pemakaian non-komersial.
- Ayat terkait: OpenBible.info Cross-References (CC BY).
- Interlinear: STEPBible TAGNT & morphhb (CC BY 4.0).