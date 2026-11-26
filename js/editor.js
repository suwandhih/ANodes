/* ============================================================
   ANodes — js/editor.js
   Editor + toolbar lengkap + panel daftar + auto-save.
   TAHAP 3: toolbar hemat ruang (dropdown) + hide + tabel +
            stabilo/warna/icon + <> Row + markup ketik cepat.
   ============================================================ */

(() => {
  'use strict';

  // --- elemen ---
  const editor     = document.getElementById('editor');
  const listEl     = document.getElementById('daftar-catatan');
  const namaEl     = document.getElementById('info-nama');
  const kataEl     = document.getElementById('info-kata');
  const katSelect  = document.getElementById('info-kategori');
  const filterSel  = document.getElementById('filter-kategori');
  const cariEl     = document.getElementById('cari');
  const statusNama = document.getElementById('status-nama');
  const titik      = document.getElementById('titik');
  const toolbar    = document.getElementById('toolbar');
  const toastEl    = document.getElementById('toast');
  const panelDaftar= document.getElementById('panel-daftar');
  const jumlahEl   = document.getElementById('jumlah-catatan');
  const sizeLabel  = document.getElementById('size-label');
  const listLabel  = document.getElementById('list-label');

  // 🔍 bilah cari DI DALAM catatan (K29) — elemen diambil di sini supaya
  //    sudah siap sebelum bagian lain memakainya (kalau di bawah, error TDZ).
  const barCari    = document.getElementById('bar-cari');
  const inpCariIsi = document.getElementById('cari-isi');
  const infoCari   = document.getElementById('cari-isi-info');
  let cariIsi = { kata: '', urut: -1, jumlah: 0, daftar: [] };

  let aktif = ANodesStore.aktifId();
  let kotor = false;
  let timerAuto = null;
  let stabTerakhir = '#fff176';
  let hurufTerakhir = '#d32f2f';
  let iconTerakhir = '✅';

  // ------------------------------------------------------------
  // util
  // ------------------------------------------------------------
  const bersihkanBlok = (html) =>
    (html || '').replace(/<(h[1-6]|p|li|div|br|tr|table|ul|ol)[^>]*>/gi, ' ');

  const teksSaja = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = bersihkanBlok(html);
    return (tmp.textContent || '').replace(/\s+/g, ' ').trim();
  };

  const teksPertama = (node) => {
    for (const ch of node.childNodes) {
      if (ch.nodeType === 3) {
        const t = ch.textContent.replace(/\s+/g, ' ').trim();
        if (t) return t;
      } else if (ch.nodeType === 1) {
        const t = teksPertama(ch);
        if (t) return t;
      }
    }
    return '';
  };

  const judulEditor = () => {
    const t = teksPertama(editor);
    return t ? t.slice(0, 60) : 'Catatan Baru';
  };

  const hitungKata = (html) => {
    const t = teksSaja(html);
    if (!t) return 0;
    return t.split(/\s+/).length;
  };

  const jam = () => {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  };

  const tandai = (kotorBaru) => {
    kotor = kotorBaru;
    titik.classList.toggle('kotor', kotor);
    titik.classList.toggle('ok', !kotor);
    titik.title = kotor ? 'Belum disimpan' : 'Sudah disimpan';
  };

  function toast(pesan) {
    toastEl.textContent = pesan;
    toastEl.classList.add('tampil');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove('tampil'), 2200);
  }

  const simpanLokal = (k, v) => { try { localStorage.setItem('anodes-' + k, v); } catch (e) {} };
  const bacaLokal   = (k) => { try { return localStorage.getItem('anodes-' + k); } catch (e) { return null; } };

  const seleksiKosong = () => {
    const s = window.getSelection();
    return !s || s.isCollapsed;
  };

  // Browser kadang membuat <div> saat Enter di akhir judul/daftar.
  // Dirapikan jadi <p> supaya hasil simpanan seragam (seperti Word).
  // Hanya <div> tingkat atas yang diubah — isi tabel/kode tidak disentuh.
  function rapikanHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    [...tmp.children].forEach(b => {
      if (b.tagName !== 'DIV') return;
      if (b.querySelector('ul,ol,table,h1,h2,h3,li')) {
        // div yang berisi blok: buka isinya ke atas (jangan dibungkus p)
        while (b.firstChild) b.parentNode.insertBefore(b.firstChild, b);
        b.remove();
      } else {
        const p = document.createElement('p');
        while (b.firstChild) p.appendChild(b.firstChild);
        b.replaceWith(p);
      }
    });
    return tmp.innerHTML;
  }

  // ------------------------------------------------------------
  // BATAL / ULANGI (undo / redo)
  // ------------------------------------------------------------
  // Cara 1 (utama): pakai perintah bawaan browser — ringan & posisi
  //                 kursor tetap terjaga.
  // Cara 2 (cadangan): pakai riwayat gambar tulisan sendiri, kalau
  //                 browser tidak mendukung cara 1.
  let riwayat = [];
  let riwayatIdx = -1;
  let timerRiwayat = null;

  function catatRiwayat() {
    const isi = editor.innerHTML;
    if (riwayat[riwayatIdx] === isi) return;
    riwayat = riwayat.slice(0, riwayatIdx + 1);
    riwayat.push(isi);
    if (riwayat.length > 80) { riwayat.shift(); }   // simpan 80 langkah terakhir saja
    riwayatIdx = riwayat.length - 1;
  }

  function riwayatMuat(isi) {
    editor.innerHTML = isi;
    const r = document.createRange();
    r.selectNodeContents(editor);
    r.collapse(false);
    const s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
    autoSimpan();
    syncBarPaket();     // bar paket ikut menyesuaikan isi yang dipulihkan
  }

  // Apakah langkah riwayat terakhir = memasang / mengangkat PAKET AYAT?
  // Paket disisipkan lewat DOM sendiri (bukan ketikan), jadi TIDAK ada di
  // tumpukan undo bawaan browser. Untuk langkah seperti itu, tombol ↶ / ↷
  // WAJIB memakai riwayat sendiri — kalau tidak, tekan ↶ malah membatalkan
  // ketikan lama dan paketnya tetap tinggal.
  function langkahPaket(arah) {
    const ini = riwayat[riwayatIdx] || '';
    const tetangga = riwayat[riwayatIdx + (arah === 'maju' ? 1 : -1)] || '';
    return (ini.indexOf('paket-ayat') >= 0) !== (tetangga.indexOf('paket-ayat') >= 0);
  }

  function batalTulis() {
    editor.focus();
    let bisa = false;
    if (!langkahPaket('mundur')) {
      try { bisa = document.execCommand('undo', false, null); } catch (e) {}
    }
    if (bisa) { autoSimpan(); syncBarPaket(); return; }

    if (riwayatIdx <= 0) { toast('Tidak ada yang bisa dibatalkan'); return; }
    riwayatIdx--;
    riwayatMuat(riwayat[riwayatIdx]);
    toast('Kembali ke tulisan sebelumnya');
  }

  function ulangiTulis() {
    editor.focus();
    let bisa = false;
    if (!langkahPaket('maju')) {
      try { bisa = document.execCommand('redo', false, null); } catch (e) {}
    }
    if (bisa) { autoSimpan(); syncBarPaket(); return; }

    if (riwayatIdx >= riwayat.length - 1) { toast('Tidak ada yang bisa diulangi'); return; }
    riwayatIdx++;
    riwayatMuat(riwayat[riwayatIdx]);
    toast('Diulangi lagi');
  }

  function ulangiTulis() {
    editor.focus();
    let bisa = false;
    try { bisa = document.execCommand('redo', false, null); } catch (e) {}
    if (bisa) { autoSimpan(); return; }

    if (riwayatIdx >= riwayat.length - 1) { toast('Tidak ada yang bisa diulangi'); return; }
    riwayatIdx++;
    riwayatMuat(riwayat[riwayatIdx]);
    toast('Diulangi lagi');
  }

  // ------------------------------------------------------------
  // tampilan toolbar & panel (hide/unhide)
  // ------------------------------------------------------------
  // Tampil/sembunyi toolbar tulis diatur ANodesPlugin.terapkanBar()
  // supaya pengaturannya cuma satu tempat (tidak bentrok).
  function terapkanDaftar(tampil) {
    panelDaftar.hidden = !tampil;
    simpanLokal('daftar', tampil ? '1' : '0');
  }

  function muatTampilan() {
    // status baris ke-2 (toolbar tulis) dibaca sendiri
    // oleh ANodesPlugin dari localStorage (`anodes-bar`).
    ANodesPlugin.terapkanBar();
    // daftar catatan SELALU tersembunyi saat dibuka -
    // hanya tampil bila user klik File -> Open (atau tombol "Catatan").
    terapkanDaftar(false);
  }

  // ------------------------------------------------------------
  // kategori
  // ------------------------------------------------------------
  function isiKategori() {
    const kats = ANodesStore.daftarKategori();

    const fLama = filterSel.value;
    filterSel.innerHTML = '<option value="">Semua</option>';
    kats.forEach(k => {
      const o = document.createElement('option');
      o.value = k; o.textContent = k;
      filterSel.appendChild(o);
    });
    if (kats.includes(fLama)) filterSel.value = fLama;

    const c = ANodesStore.ambil(aktif);
    katSelect.innerHTML = '';
    kats.forEach(k => {
      const o = document.createElement('option');
      o.value = k; o.textContent = k;
      katSelect.appendChild(o);
    });
    const ob = document.createElement('option');
    ob.value = '__baru__';
    ob.textContent = '＋ Kategori baru...';
    katSelect.appendChild(ob);
    if (c) katSelect.value = c.kategori || kats[0];
  }

  // ------------------------------------------------------------
  // render daftar
  // ------------------------------------------------------------
  function renderDaftar() {
    const q = cariEl.value;
    const kat = filterSel.value;
    let arr = ANodesStore.cari(q);
    if (kat) arr = arr.filter(c => c.kategori === kat);

    const total = ANodesStore.daftar().length;
    jumlahEl.textContent = arr.length === total ? '(' + total + ')' : '(' + arr.length + '/' + total + ')';

    listEl.innerHTML = '';

    if (!arr.length) {
      const k = document.createElement('div');
      k.className = 'kosong';
      k.innerHTML = (q || kat)
        ? 'Tidak ada catatan yang cocok.'
        : 'Belum ada catatan.<br>Klik <b>+ Baru</b> untuk membuat.';
      listEl.appendChild(k);
      return;
    }

    arr.forEach(c => {
      const item = document.createElement('div');
      item.className = 'item' + (c.id === aktif ? ' aktif' : '');
      item.dataset.id = c.id;

      const nm = document.createElement('div');
      nm.className = 'nm';
      nm.textContent = c.judul;

      const fd = document.createElement('div');
      fd.className = 'fd';
      const t = teksSaja(c.isi);
      fd.textContent = t ? t.slice(0, 90) : '(kosong)';

      const wk = document.createElement('div');
      wk.className = 'wk';
      const spanKat = document.createElement('span');
      spanKat.className = 'ktg';
      spanKat.textContent = c.kategori || 'Umum';
      const spanKata = document.createElement('span');
      spanKata.textContent = hitungKata(c.isi) + ' kata';
      wk.appendChild(spanKat);
      wk.appendChild(spanKata);

      const buang = document.createElement('button');
      buang.className = 'buang';
      buang.title = 'Hapus catatan';
      buang.textContent = '✕';

      item.appendChild(nm);
      item.appendChild(fd);
      item.appendChild(wk);
      item.appendChild(buang);

      item.addEventListener('click', (e) => {
        if (e.target === buang) return;
        buka(c.id);
      });
      buang.addEventListener('click', (e) => {
        e.stopPropagation();
        hapus(c.id, c.judul);
      });

      listEl.appendChild(item);
    });
  }

  // ------------------------------------------------------------
  // 📖 MODE BACA / RAPI (16 Sep 2026)
  //   Permintaan Bapak: *“di ANodes -> File -> impor -> rencanakerja.md tapi
  //   dibuat dalam tampil rencanakerja.md mengikuti layar supaya tampil mudah
  //   dibaca”*.
  //
  //   Cara kerjanya (aman — isi catatan TIDAK berubah):
  //     1. isi catatan (HTML) diubah balik menjadi TEKS markdown
  //     2. teks itu diolah pengolah markdown milik menu [Doc] (`keHtml`)
  //     3. hasilnya ditampilkan — TIDAK bisa diketik selama mode baca
  //     4. tombol “✏️ Tulis” mengembalikan isi MENTAH yang tadi
  //
  //   Kenapa tidak langsung memakai HTML catatan saja? Sebab catatan lama
  //   menyimpan tanda markdown sebagai TEKS (mis. `<p>&gt; Dibuat: …` dan
  //   `<p>| # | Kasus |`). Teks seperti itu hanya jadi rapi kalau diolah
  //   ulang dari bentuk markdown-nya.
  // ------------------------------------------------------------
  let modeRapi = false;      // sedang menampilkan mode baca?
  let isiMentah = '';        // isi asli (HTML) sebelum dirapikan

  const btnRapi = document.getElementById('info-rapi');

  // HTML catatan → teks markdown (kebalikan dari pengolah markdown)
  function htmlKeMarkdown(html) {
    const akar = document.createElement('div');
    akar.innerHTML = String(html || '').replace(/<br\s*\/?>/gi, '\n');

    // bagian dalam satu baris: <b> → **teks**, <i> → *teks*, <code> → `teks`
    function isiBaris(el) {
      let t = '';
      el.childNodes.forEach(n => {
        if (n.nodeType === 3) { t += n.textContent; return; }
        if (n.nodeType !== 1) return;
        const nm = n.tagName;
        const dalam = isiBaris(n);
        if (nm === 'B' || nm === 'STRONG') t += '**' + dalam + '**';
        else if (nm === 'I' || nm === 'EM') t += '*' + dalam + '*';
        else if (nm === 'CODE') t += '`' + dalam + '`';
        else if (nm === 'A') t += '[' + dalam + '](' + (n.getAttribute('href') || '#') + ')';
        else t += dalam;
      });
      return t;
    }

    function blokDari(el, keluar, sebelum, jenisDaftar) {
      [...el.children].forEach(e => {
        const nm = e.tagName;
        if (/^H[1-6]$/.test(nm)) {
          keluar.push('#'.repeat(Number(nm[1])) + ' ' + isiBaris(e).trim(), '');
        } else if (nm === 'P' || nm === 'DIV') {
          const t = isiBaris(e).trim();
          if (t) keluar.push(t, '');
        } else if (nm === 'UL' || nm === 'OL') {
          const bernomor = nm === 'OL';
          [...e.children].forEach((li, i) => {
            if (li.tagName !== 'LI') return;
            const tanda = bernomor ? (i + 1) + '. ' : '- ';
            keluar.push(tanda + isiBaris(li).trim(), '');
          });
        } else if (nm === 'BLOCKQUOTE') {
          const t = isiBaris(e).trim().split('\n');
          t.forEach(x => keluar.push('> ' + x.trim(), ''));
          // blok di dalam kutipan (mis. <p>) juga ditandai >
          [...e.querySelectorAll('p')].forEach(p => {
            const q = isiBaris(p).trim();
            if (q) keluar.push('> ' + q, '');
          });
        } else if (nm === 'PRE') {
          keluar.push('```', (e.textContent || '').replace(/\n+$/, ''), '```', '');
        } else if (nm === 'HR') {
          keluar.push('---', '');
        } else if (nm === 'TABLE') {
          const baris = [...e.querySelectorAll('tr')];
          baris.forEach((tr, i) => {
            const sel = [...tr.children].map(td => isiBaris(td).trim().replace(/\|/g, '/'));
            keluar.push('| ' + sel.join(' | ') + ' |');
            if (i === 0) keluar.push('|' + sel.map(() => '---').join('|') + '|');
          });
          keluar.push('');
        } else if (nm === 'BR') {
          keluar.push('');
        } else {
          const t = isiBaris(e).trim();
          if (t) keluar.push(t, '');
        }
      });
    }

    const keluar = [];
    blokDari(akar, keluar);
    return keluar.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  // apakah isi catatan ini pantas ditampilkan rapi?
  function pantasRapi(html) {
    const d = window.ANodesMarkdown;
    if (!d || typeof d.bisaMarkdown !== 'function') return false;
    return !!d.bisaMarkdown(htmlKeMarkdown(html));
  }

  // tampilkan / kembalikan mode baca
  function terapkanRapi(nilai) {
    modeRapi = !!nilai;
    if (modeRapi) {
      if (!isiMentah) isiMentah = editor.innerHTML;
      const d = window.ANodesMarkdown;
      const rapi = (d && d.keHtml) ? d.keHtml(htmlKeMarkdown(isiMentah)) : '';
      if (!rapi) { modeRapi = false; return; }
      editor.classList.add('mode-baca');
      editor.setAttribute('contenteditable', 'false');
      editor.innerHTML = rapi;
      toast('📖 Mode baca — tekan tombol “✏️ Tulis” untuk mengubah lagi');
    } else {
      editor.classList.remove('mode-baca');
      editor.setAttribute('contenteditable', 'true');
      if (isiMentah) editor.innerHTML = isiMentah;
      isiMentah = '';
    }
    segarkanTombolRapi();
  }

  function segarkanTombolRapi() {
    if (!btnRapi) return;
    btnRapi.hidden = !modeRapi && !pantasRapi(editor.innerHTML);
    btnRapi.textContent = modeRapi ? '✏️ Tulis' : '📖 Rapi';
    btnRapi.classList.toggle('aktif', modeRapi);
    btnRapi.title = modeRapi
      ? 'Kembali ke tulisan biasa (bisa diedit lagi)'
      : 'Tampilkan catatan ini rapi (judul, tabel, kutipan) — hanya untuk membaca';
  }

  // ------------------------------------------------------------
  // tampilkan / buka
  // ------------------------------------------------------------
  function tampilkan(c) {
    if (!c) {
      aktif = null;
      terapkanRapi(false);
      editor.innerHTML = '';
      namaEl.textContent = '—';
      kataEl.textContent = '0 kata';
      statusNama.textContent = 'belum ada catatan';
      isiKategori();
      segarkanTombolRapi();
      return;
    }
    aktif = c.id;
    terapkanRapi(false);              // ganti catatan → kembali ke tulisan biasa
    editor.innerHTML = c.isi || '';
    namaEl.textContent = c.judul;
    kataEl.textContent = hitungKata(c.isi) + ' kata';
    statusNama.textContent = c.judul;
    tandai(false);
    isiKategori();
    renderDaftar();
    // mulai riwayat baru untuk catatan ini (untuk tombol ↶ Batal)
    riwayat = [editor.innerHTML];
    riwayatIdx = 0;
    // 🔍 ganti catatan → pencarian lama tidak berlaku lagi
    if (cariIsi.kata) cariIsiTutup(true);
    // 📖 tampilkan tombol “Rapi” kalau isinya masih markdown mentah
    segarkanTombolRapi();
    // kalau plugin terpasang, tandai nama ayat + istilah di catatan ini
    tandaiSemuaTanda(0);
  }

  // tandai nama ayat di editor (dilakukan plugin Alkitab; kalau tidak ada = lewati)
  function tandaAyatSekarang() {
    tandaiSemuaTanda(0);
  }

  /* ------------------------------------------------------------
     K45 i (23 Sep 2026) — SAMBUNGAN RESMI “PENGHIAS TANDA”
     ------------------------------------------------------------
     Plug-in 🖊 Penguat memakai pintu ini supaya bisa menaruh tombol `🖊`
     pada tautan ayat DI CATATAN — tanpa editor harus tahu plugin itu ada.

     • Plugin mendaftar  : ANodesEditor.tambahPenghiasTanda(fn)
     • Editor memberi tahu: setiap kali tanda ayat/istilah SELESAI digambar
       (dan saat plugin 🖊 rasanya perlu — mis. setelah tempel/pindah catatan)
     • Plugin melepas    : ANodesEditor.lepasPenghiasTanda(fn)

     ⚠️ Penghias WAJIB idempoten — boleh dipanggil berkali-kali tanpa
        menambah tombol ganda. Plugin 🖊 memakai penanda per tautan.
     ------------------------------------------------------------ */
  const penghiasTanda = [];

  function tambahPenghiasTanda(fn) {
    if (typeof fn === 'function' && penghiasTanda.indexOf(fn) < 0) penghiasTanda.push(fn);
  }

  function lepasPenghiasTanda(fn) {
    const i = penghiasTanda.indexOf(fn);
    if (i >= 0) penghiasTanda.splice(i, 1);
  }

  function jalanPenghiasTanda(ctx) {
    penghiasTanda.forEach(fn => {
      // satu penghias gagal TIDAK boleh merusak penandaan ayat/istilah
      try { fn(ctx || { editor }); } catch (e) { console.warn('ANodes: penghias tanda gagal', e); }
    });
  }

  // tandai nama ayat + istilah di editor.
  //   ⚠️ SATU PINTU (K42 butir c — 18 Sep 2026): DUA plugin menandai editor
  //      yang sama — 📖 Alkitab (`span.ay-link`) dan 📚 Kamus
  //      (`span.kamus-istilah`). Kalau keduanya dipanggil bersamaan dan
  //      masing-masing membangun ulang text node, tanda yang lain bisa hancur.
  //      Karena itu: dijalankan BERURUTAN (ayat dulu → istilah), masing-masing
  //      MELEWATI node yang sudah bertanda (daftar `window.ANodesTandaKelas`),
  //      dan tidak ada yang memanggil normalize() pada node bertanda.
  /* ------------------------------------------------------------
     K70 (5 Okt 2026) — 🔌 SAKELAR ON/OFF PENANDAAN DI CATATAN
     ------------------------------------------------------------
     Order Bapak: *“catatan saya mau semua berhubungan dengan plugin
     diberi tombol on/off karena setelah dicoba ada masalah perlambatan
     pada saat pengetikan..”* + keputusan: **bawaan OFF**.

     ⇒ INILAH **SATU PINTU** yang menyalakan/mematikan SELURUH penandaan
       di `#editor` (ayat · istilah · 🖊 penguat). Saat OFF:
         • `tandaiSemuaTanda()` BERHENTI sebelum menandai apa pun;
         • penandaan **susulan** (saat mengetik / fokus) juga berhenti —
           sebab `ANodesAlkitab.aktif()` & `ANodesKamusTampilan.bisaTandai()`
           ikut membaca pintu ini;
         • bekas tanda yang sudah ada **dibersihkan** supaya catatan benar
           benar kembali jadi teks biasa.

     ⚠️ Halaman plugin (Alkitab · Peta · Kamus · Penguat · Sejarah) ❌ TIDAK
        ikut mati — yang berhenti HANYA penandaan di catatan.
     ⚠️ Kunci `anodes-tandai-note` WAJIB ada di `KUNCI_AMAN` alat uji.
     ------------------------------------------------------------ */
  const KUNCI_TANDAI = 'anodes-tandai-note';
  const tandaiCatatan = { hidup: false };   // bawaan pakai nilai tersimpan di bawah

  function muatTandaiCatatan() {
    try {
      // ⚠️ BAWAAN = OFF (keputusan Bapak 5 Okt 2026) — hanya '1' yang menyalakan.
      tandaiCatatan.hidup = localStorage.getItem(KUNCI_TANDAI) === '1';
    } catch (e) { tandaiCatatan.hidup = false; }
  }
  const catatanDitandai = () => tandaiCatatan.hidup;

  function segarkanTombolTandai() {
    const b = document.getElementById('info-tandai');
    if (!b) return;
    b.classList.toggle('nyala', tandaiCatatan.hidup);
    b.textContent = tandaiCatatan.hidup ? '🔗 ON' : '🔗 OFF';
    b.title = tandaiCatatan.hidup
      ? 'Penandaan catatan NYALA — tautan ayat, istilah & tombol 🖊 hidup. Klik untuk mematikan.'
      : 'Penandaan catatan MATI — menulis lebih cepat (tanpa tautan ayat/istilah). Klik untuk menyalakan.';
  }

  // nyalakan / matikan penandaan catatan. `diam` = jangan tampilkan toast.
  function setTandaiCatatan(hidup, diam) {
    tandaiCatatan.hidup = !!hidup;
    try { localStorage.setItem(KUNCI_TANDAI, tandaiCatatan.hidup ? '1' : '0'); } catch (e) {}
    segarkanTombolTandai();
    if (tandaiCatatan.hidup) {
      // “langsung ditandai saat ON” — sekali proses penandaan langsung jalan
      tandaiSemuaTanda(0);
      if (!diam) toast('🔗 Penandaan catatan NYALA');
    } else {
      // matikan ⇒ BERSIHKAN bekas tanda (ayat + istilah + 🖊) supaya catatan
      // benar-benar kembali jadi teks biasa.
      bersihkanTandaCatatan();
      if (!diam) toast('🔗 Penandaan catatan MATI — menulis lebih lancar');
    }
  }

  // buang SEMUA bekas tanda (tampilan saja) dari editor — ❌ tanpa menyentuh isi
  function bersihkanTandaCatatan() {
    try { if (window.ANodesAlkitab && window.ANodesAlkitab.bersihTandaWadah) window.ANodesAlkitab.bersihTandaWadah(editor); } catch (e) {}
    try { if (window.ANodesKamusTampilan && window.ANodesKamusTampilan.bersihkanTanda) window.ANodesKamusTampilan.bersihkanTanda(); } catch (e) {}
    try { if (window.ANodesPenguatTampilan && window.ANodesPenguatTampilan.bersihkanCatatan) window.ANodesPenguatTampilan.bersihkanCatatan(); } catch (e) {}
    // panel 📋 Ayat & Istilah ikut disembunyikan (datanya sudah tidak berlaku).
    //   `gambarPanel()` membaca keadaan sakelar ⇒ saat OFF ia menyembunyikan.
    try { if (window.ANodesKamusTampilan && window.ANodesKamusTampilan.gambarPanel) window.ANodesKamusTampilan.gambarPanel(); } catch (e) {}
  }

  function tandaiSemuaTanda(langkah) {
    if (langkah > 3) return;                 // pengaman: jangan berputar-putar
    // 🔌 K70 — pintu ON/OFF: saat OFF, penandaan di catatan BERHENTI TOTAL.
    if (!catatanDitandai()) return;
    const A = window.ANodesAlkitab;
    const K = window.ANodesKamusTampilan;
    const punyaA = !!(A && A.tandaiAyat && window.ANodesPlugin &&
                      window.ANodesPlugin.dipasang('alkitab'));
    const punyaK = !!(K && K.tandaiSemua && window.ANodesPlugin &&
                      window.ANodesPlugin.dipasang('kamus'));
    if (!punyaA && !punyaK) return;

    const jalan = () => {
      try { if (punyaA) A.tandaiAyat(editor); } catch (e) { console.warn(e); }
      try { if (punyaK) K.tandaiSemua(); } catch (e) { console.warn(e); }
      /* 🆕 K45 i (23 Sep 2026) — SAMBUNGAN RESMI untuk plugin 🖊 Penguat.
         Plugin 🖊 perlu ikut “diberi tahu” setiap kali tanda di catatan selesai
         digambar, supaya tombol `🖊` (yang menempel di tiap tautan ayat) tidak
         hilang ketika penandaan ayat/istilah membongkar-pasang DOM.

         ⚠️ Kenapa lewat daftar penghias, bukan memanggil langsung?
            Plugin 🖊 **tidak boleh** harus dikenal oleh editor — pola SAMA
            dengan `tambahPenghias()` di halaman baca Alkitab (K25/K54).
            Alkitab & Kamus tidak perlu tahu plugin 🖊 ada; editor cukup
            MEMBERI TAHU, dan plugin yang berminat mendaftar sendiri.

         ⚠️ Penghias WAJIB idempoten (boleh dipanggil berulang) — plugin 🖊
            memakai penanda “sudah dipasang” supaya tombolnya tidak menumpuk. */
      jalanPenghiasTanda({ editor });
    };

    // tunggu data manapun yang belum siap, lalu ulangi supaya keduanya dapat bagian
    let belum = false;
    if (punyaA && A.siap() === false) { belum = true; if (A.ketikaSiap) A.ketikaSiap(jalan); }
    if (punyaK && K._hidup && !K._hidup()) belum = true;
    if (belum && langkah < 2) {
      setTimeout(() => tandaiSemuaTanda(langkah + 1), 400);
      return;
    }
    jalan();
  }

  // buang SEMUA tanda tampilan dari HTML (dipakai saat MENYIMPAN / EKSPOR).
  //   Catatan tetap teks biasa seperti yang diketik user.
  function bersihSemuaTanda(html) {
    let h = (window.ANodesAlkitab && window.ANodesAlkitab.bersihTanda)
      ? window.ANodesAlkitab.bersihTanda(html) : html;
    if (window.ANodesKamusTampilan && window.ANodesKamusTampilan.bersihkanHtml) {
      h = window.ANodesKamusTampilan.bersihkanHtml(h);
    } else {
      const tmp = document.createElement('div');
      tmp.innerHTML = h || '';
      tmp.querySelectorAll('span.kamus-istilah').forEach(sp =>
        sp.parentNode.replaceChild(document.createTextNode(sp.textContent), sp));
      h = tmp.innerHTML;
    }
    // 🆕 K44 — tautan ayat yang DIRAPIKAN saat menempel juga penanda tampilan
    //   (mis. `1Yo 1:1` yang tadinya `[1Yoh 1:1](https://alkitab…)`) → dibuang
    //   dari berkas simpanan supaya catatan tetap teks biasa.
    const tmp2 = document.createElement('div');
    tmp2.innerHTML = h || '';
    tmp2.querySelectorAll('span.kamus-ay-link').forEach(sp =>
      sp.parentNode.replaceChild(document.createTextNode(sp.textContent), sp));
    // judul bab hasil rapikan → kembalikan jadi teks biasa yang masih bergaya
    tmp2.querySelectorAll('h2.naskah-judul').forEach(hh => {
      const h2 = document.createElement('h2');
      h2.textContent = hh.textContent;
      hh.replaceWith(h2);
    });
    // judul bagian hasil rapikan → teks tebal biasa
    tmp2.querySelectorAll('h3.naskah-bagian').forEach(hh => {
      const p = document.createElement('p');
      const b = document.createElement('b');
      b.textContent = hh.textContent;
      p.appendChild(b);
      hh.replaceWith(p);
    });
    // baris tulis → teks garis biasa (hanya penanda tampilan)
    tmp2.querySelectorAll('span.naskah-garis').forEach(sp => {
      const t = document.createElement('span');
      t.textContent = sp.textContent;
      sp.replaceWith(t);
    });
    /* 🆕 K45 i (23 Sep 2026) — hiasan plugin 🖊 Penguat di catatan juga
       penanda TAMPILAN: tombol `🖊` dan kotak penguatnya ❌ TIDAK boleh ikut
       tersimpan ke catatan pengguna (pelajaran “tanda tidak pernah disimpan”).
       Dibuang di sini supaya berlaku untuk SEMUA jalur: simpan · ekspor ·
       cadangan · cetak. */
    tmp2.querySelectorAll('.pg-catatan-sisip, .pg-catatan-kotak').forEach(x => x.remove());
    return tmp2.innerHTML;
  }

  function buka(id) {
    if (kotor) simpan(true);
    ANodesStore.setAktif(id);
    tampilkan(ANodesStore.ambil(id));
    editor.focus();
  }

  // ------------------------------------------------------------
  // simpan / auto-save / baru / hapus
  // ------------------------------------------------------------
  function simpan(diam) {
    if (!aktif) return;
    // � mode baca: isi yang tampil adalah hasil olahan, JANGAN disimpan.
    //    Yang benar adalah isi mentahnya (tersimpan di `isiMentah`).
    if (modeRapi) { return; }
    // �🔍 tanda sorot cari TIDAK ikut disimpan (catatan tetap teks biasa).
    if (cariIsi.kata) cariIsiTutup(false);
    // penanda tautan ayat & istilah TIDAK disimpan ke catatan (dibersihkan
    // dulu), supaya tulisan tetap teks biasa seperti yang diketik user.
    const mentah0 = bersihTandaCari(editor.innerHTML);
    const mentah = bersihSemuaTanda(mentah0);
    const isi = rapikanHtml(mentah);
    const judul = judulEditor();
    const kat = katSelect.value === '__baru__' ? undefined : katSelect.value;
    ANodesStore.simpan(aktif, judul, isi, kat);
    // ☁️ K77: beri tahu sinkron bahwa catatan berubah (kalau sinkron diaktifkan)
    if (window.ANodesSinkron) window.ANodesSinkron.tandaiBerubah('anodes-catatan-v1');
    namaEl.textContent = judul;
    statusNama.textContent = judul;
    kataEl.textContent = hitungKata(isi) + ' kata';
    tandai(false);
    renderDaftar();
    if (!diam) toast('Tersimpan ' + jam());
  }

  function autoSimpan() {
    // 📖 mode baca: tidak ada yang boleh disimpan (isinya hasil olahan)
    if (modeRapi) return;
    tandai(true);
    kataEl.textContent = hitungKata(editor.innerHTML) + ' kata';
    clearTimeout(timerAuto);
    timerAuto = setTimeout(() => simpan(true), 700);
    // catat riwayat (untuk tombol ↶ Batal / ↷ Ulangi) — ditunda
    // sebentar supaya mengetik lancar
    clearTimeout(timerRiwayat);
    timerRiwayat = setTimeout(catatRiwayat, 450);
  }
  function baru() {
    if (kotor) simpan(true);
    const kat = filterSel.value || undefined;
    const c = ANodesStore.baru(kat);
    tampilkan(c);
    editor.focus();
  }

  function hapus(id, judul) {
    if (!confirm('Hapus catatan "' + judul + '"?')) return;
    ANodesStore.buang(id);
    tampilkan(ANodesStore.ambil(ANodesStore.aktifId()));
  }

  function simpanSeleksi() {
    const s = window.getSelection();
    if (!s || s.rangeCount === 0) return null;
    return s.getRangeAt(0);
  }

  // ------------------------------------------------------------
  // blok (H1/H2/H3/¶)
  // ------------------------------------------------------------
  function ubahBlok(tag) {
    editor.focus();
    const kosong = !editor.textContent.trim() && editor.children.length === 0;
    if (kosong && tag !== 'P') {
      // buat blok baru kalau editor masih kosong
      const b = document.createElement(tag.toLowerCase());
      b.innerHTML = '<br>';
      editor.appendChild(b);
      namaiBlok(tag);
      autoSimpan();
      return;
    }
    if (kosong) { namaiBlok('P'); return; }
    document.execCommand('formatBlock', false, tag);
    namaiBlok(tag);
    autoSimpan();
  }

  function namaiBlok(tag) {
    sizeLabel.textContent = tag === 'H1' ? 'H1' : tag === 'H2' ? 'H2' : tag === 'H3' ? 'H3' : '¶';
  }

  // ------------------------------------------------------------
  // DAFTAR (dot / nomor / icon) — bisa GANTI LANGSUNG tanpa hapus dulu
  // ------------------------------------------------------------
  const ICO_CLASS = 'anodes-ico';

  // kupas icon di awal teks (TANPA merusak format tebal/miring/warna)
  function kupasIconNode(li) {
    // 1) buang bullet char & spasi di node teks pertama
    let n = li.firstChild;
    while (n && n.nodeType === 3) {
      const baru = n.textContent.replace(/^[\u2022\u25CF\u25AA\u00B7]\s*/, '');
      if (baru !== n.textContent) n.textContent = baru;
      break;
    }
    // 2) buang icon di awal (bisa di node teks pertama, bisa di dalam <span>/<b>)
    let pertama = li.firstChild;
    let guard = 0;
    while (pertama && guard++ < 12) {
      if (pertama.nodeType === 3) {
        const m = pertama.textContent.match(/^\s*([\u2190-\u2BFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])[\uFE0F\u200D]*\s*/);
        if (!m) break;
        pertama.textContent = pertama.textContent.slice(m[0].length);
        if (!pertama.textContent) { const nxt = pertama.nextSibling; pertama.remove(); pertama = nxt; }
        break;
      } else if (pertama.nodeType === 1) {
        pertama = pertama.firstChild;
      } else {
        break;
      }
    }
  }

  // buang bullet & icon lama di awal teks (untuk teks biasa)
  function kupasIconStr(teks) {
    let t = (teks || '').replace(/^[\u2022\u25CF\u25AA\u00B7]\s*/, '');
    while (t && /^([\u2190-\u2BFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])/.test(t)) {
      const m = t.match(/^([\u2190-\u2BFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])/);
      if (!m) break;
      t = t.slice(m[0].length).replace(/^[\uFE0F\u200D\s]+/, '');
    }
    return t.trim();
  }

  // wadah list dari sebuah li
  function listDariLi(li) {
    let n = li.parentNode;
    while (n && n !== editor) {
      if (n.tagName === 'UL' || n.tagName === 'OL') return n;
      n = n.parentNode;
    }
    return null;
  }

  function jenisLi(li) {
    const p = listDariLi(li);
    if (!p) return null;
    if (p.tagName === 'OL') return 'number';
    return p.classList.contains(ICO_CLASS) ? 'icon' : 'bullet';
  }

  // li yang tersentuh blok seleksi
  function liTerpilih() {
    const s = window.getSelection();
    if (!s || !s.rangeCount) return [];
    const r = s.getRangeAt(0);
    const out = [];
    editor.querySelectorAll('li').forEach(li => {
      try { if (r.intersectsNode(li)) out.push(li); } catch (e) {}
    });
    return out;
  }

  // blok yang tersentuh seleksi — termasuk di dalam sel tabel (<td>/<th>)
  function blokTerpilih() {
    const s = window.getSelection();
    if (!s || !s.rangeCount) return [];
    const r = s.getRangeAt(0);

    // 1) kalau kursor/seleksi di dalam sel tabel, pakai TD/TH-nya
    let n = r.startContainer;
    while (n && n !== editor) {
      if (n.tagName === 'TD' || n.tagName === 'TH') return [n];
      n = n.parentNode;
    }

    // 2) blok tingkat atas yang tersentuh
    const out = [];
    editor.querySelectorAll(':scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > div').forEach(b => {
      try { if (r.intersectsNode(b)) out.push(b); } catch (e) {}
    });
    if (out.length) return out;

    // 3) kalau hanya kursor: pakai blok tempat kursor
    n = r.startContainer;
    while (n && n.parentNode && n.parentNode !== editor) n = n.parentNode;
    if (n && n !== editor && n.nodeType === 1) return [n];
    return [];
  }

  function gantiTag(el, tag) {
    const baru = document.createElement(tag);
    while (el.firstChild) baru.appendChild(el.firstChild);
    el.replaceWith(baru);
    return baru;
  }

  // ubah wadah jadi jenis tertentu (TANPA menghapus daftar & TANPA merusak format)
  function setJenisWadah(wd, jenis) {
    let w = wd;
    if (jenis === 'number') {
      if (w.tagName !== 'OL') w = gantiTag(w, 'OL');
      w.classList.remove(ICO_CLASS);
      w.querySelectorAll('li').forEach(li => { kupasIconNode(li); li.removeAttribute('data-ico'); });
    } else if (jenis === 'icon') {
      if (w.tagName !== 'UL') w = gantiTag(w, 'UL');
      w.classList.add(ICO_CLASS);
      w.querySelectorAll('li').forEach(li => { kupasIconNode(li); li.setAttribute('data-ico', iconTerakhir); });
    } else {
      if (w.tagName !== 'UL') w = gantiTag(w, 'UL');
      w.classList.remove(ICO_CLASS);
      w.querySelectorAll('li').forEach(li => { kupasIconNode(li); li.removeAttribute('data-ico'); });
    }
    return w;
  }

  // buat daftar baru dari blok terpilih (termasuk sel tabel)
  function bikinDaftar(jenis) {
    const blok = blokTerpilih();
    const wadah = document.createElement(jenis === 'number' ? 'OL' : 'UL');
    if (jenis === 'icon') wadah.classList.add(ICO_CLASS);

    // --- di dalam SEL TABEL: buat daftar dari baris <br> di dalam sel ---
    if (blok.length === 1 && (blok[0].tagName === 'TD' || blok[0].tagName === 'TH')) {
      const sel = blok[0];
      const htmlBaris = sel.innerHTML.split(/<br\s*\/?>/i);
      sel.innerHTML = '';
      htmlBaris.forEach(isi => {
        const li = document.createElement('li');
        li.innerHTML = (isi && isi.replace(/&nbsp;/gi, '').trim()) ? isi : '<br>';
        if (jenis === 'icon') li.setAttribute('data-ico', iconTerakhir);
        wadah.appendChild(li);
      });
      sel.appendChild(wadah);
      taruhKursorAkhir(wadah.querySelector('li:last-child') || wadah);
      return wadah;
    }

    if (!blok.length) {
      const li = document.createElement('li');
      li.innerHTML = '<br>';
      if (jenis === 'icon') li.setAttribute('data-ico', iconTerakhir);
      wadah.appendChild(li);
      editor.appendChild(wadah);
    } else {
      blok.forEach(b => {
        const li = document.createElement('li');
        let isi = b.innerHTML;
        if (!isi || !b.textContent.trim()) isi = '<br>';
        li.innerHTML = isi;
        if (jenis === 'icon') li.setAttribute('data-ico', iconTerakhir);
        wadah.appendChild(li);
      });
      blok[0].replaceWith(wadah);
      blok.slice(1).forEach(b => b.remove());
    }

    // taruh kursor di akhir item
    taruhKursorAkhir(wadah.querySelector('li:last-child') || wadah);
    return wadah;
  }

  // letakkan kursor di akhir sebuah elemen
  function taruhKursorAkhir(el) {
    if (!el) return;
    const r = document.createRange();
    r.selectNodeContents(el);
    r.collapse(false);
    const s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }

  // matikan daftar (ubah li jadi paragraf, taruh di luar wadah, urutan tetap)
  function matikanDaftar(lis) {
    const peta = new Map();   // wadah -> [paragraf baru]
    lis.forEach(li => {
      const w = listDariLi(li);
      // kalau daftar ada di dalam SEL TABEL: ubah li jadi <div> di dalam sel
      // (paragraf tidak sah langsung di dalam <td>)
      const diDalamSel = w && (w.closest('td') || w.closest('th'));
      if (diDalamSel) {
        const klon = document.createElement('div');
        const c = li.cloneNode(true);
        c.querySelectorAll('[data-ico]').forEach(x => x.removeAttribute('data-ico'));
        kupasIconNode(c);
        while (c.firstChild) klon.appendChild(c.firstChild);
        if (!klon.textContent.trim() && !klon.querySelector('br')) klon.innerHTML = '<br>';
        // taruh <div> SEBELUM wadah daftar (supaya tidak ikut terhapus)
        w.parentNode.insertBefore(klon, w);
        li.remove();
        if (!w.querySelector('li')) w.remove();
        return;
      }
      const p = document.createElement('P');
      // salin isi li ke paragraf, lalu kupas icon/dot di salinan itu
      const klon = li.cloneNode(true);
      klon.querySelectorAll('[data-ico]').forEach(x => x.removeAttribute('data-ico'));
      kupasIconNode(klon);
      while (klon.firstChild) p.appendChild(klon.firstChild);
      if (!p.textContent.trim() && !p.querySelector('img,br')) p.innerHTML = '<br>';
      if (!peta.has(w)) peta.set(w, []);
      peta.get(w).push(p);
      li.remove();
    });
    peta.forEach((ps, w) => {
      const frag = document.createDocumentFragment();
      ps.forEach(p => frag.appendChild(p));
      if (w && w.parentNode) {
        w.parentNode.insertBefore(frag, w.nextSibling);
        if (!w.querySelector('li')) w.remove();
      } else {
        editor.appendChild(frag);
      }
    });
    // bersihkan wadah daftar kosong di dalam sel tabel
    editor.querySelectorAll('td > ul, td > ol, th > ul, th > ol').forEach(w => {
      if (!w.querySelector('li')) w.remove();
    });
  }

  function labelJenis(j) {
    return j === 'number' ? '1. List' : j === 'icon' ? iconTerakhir + ' List' : '• List';
  }

  /* Tulis label tombol daftar ke DUA tempat:
       .lbl-penuh  → “• List” / “1. List” / “✅ List”  (layar lebar)
       .lbl-pendek → “•” / “1.” / ikonnya saja        (layar sempit)
     Supaya 12 tombol toolbar tetap MUAT 1 BARIS setelah tombol 🧩 ditambah. */
  function setLabelDaftar(teks) {
    const b = listLabel && listLabel.parentNode;
    if (!b) return;
    const penuh = b.querySelector('.lbl-penuh');
    const pendek = b.querySelector('.lbl-pendek');
    if (penuh) penuh.textContent = teks;
    else listLabel.textContent = teks;                 // cadangan (kalau HTML lama)
    if (pendek) pendek.textContent = /^\d/.test(teks) ? '1.' : (teks === '• List' ? '•' : teks.replace(/\s*List$/, ''));
  }

  function daftarFmt(jenis) {
    editor.focus();
    if (jenis === 'icon-list') jenis = 'icon';
    const lis = liTerpilih();

    if (!lis.length) {
      bikinDaftar(jenis);
      setLabelDaftar(labelJenis(jenis));
      autoSimpan();
      return;
    }

    // semua li sudah jenis ini? -> toggle OFF
    const semuaSama = lis.every(li => jenisLi(li) === jenis);
    if (semuaSama) {
      matikanDaftar(lis);
      setLabelDaftar(labelJenis(jenis));
    } else {
      // ganti jenis LANGSUNG (tanpa hapus dulu)
      const wadah = [];
      lis.forEach(li => { const w = listDariLi(li); if (w && !wadah.includes(w)) wadah.push(w); });
      wadah.forEach(w => setJenisWadah(w, jenis));
      setLabelDaftar(labelJenis(jenis));
    }
    autoSimpan();
  }

  // ------------------------------------------------------------
  // warna — stabilo & huruf
  // ------------------------------------------------------------
  function warnai(jenis, warna) {
    if (seleksiKosong()) { toast('Blok dulu tulisan yang mau diberi warna'); return; }
    editor.focus();
    if (jenis === 'stab') {
      document.execCommand('hiliteColor', false, warna);
    } else {
      document.execCommand('styleWithCSS', false, true);
      document.execCommand('foreColor', false, warna);
    }
    autoSimpan();
  }

  function hapusWarna() {
    if (seleksiKosong()) { toast('Blok dulu tulisan yang mau dibersihkan'); return; }
    editor.focus();
    document.execCommand('styleWithCSS', false, true);
    document.execCommand('removeFormat', false, null);
    document.execCommand('hiliteColor', false, 'transparent');
    // bersihkan <mark> / <span> warna manual
    const s = window.getSelection();
    if (s.rangeCount) {
      editor.querySelectorAll('mark, span[style*="color"], span[style*="background"]').forEach(el => {
        if (s.containsNode(el, true)) {
          const frag = document.createDocumentFragment();
          while (el.firstChild) frag.appendChild(el.firstChild);
          el.replaceWith(frag);
        }
      });
    }
    autoSimpan();
  }

  // ------------------------------------------------------------
  // icon
  // ------------------------------------------------------------
  function sisipIcon(ikon) {
    editor.focus();
    document.execCommand('insertText', false, ikon + ' ');
    iconTerakhir = ikon;
    document.getElementById('icon-isi').textContent = ikon;
    autoSimpan();
  }

  // ------------------------------------------------------------
  // TABEL — sisip & edit ala Excel
  // ------------------------------------------------------------
  function sisipTabel() {
    editor.focus();
    const tabel = document.createElement('table');
    for (let r = 0; r < 3; r++) {
      const tr = document.createElement('tr');
      for (let c = 0; c < 3; c++) {
        const td = document.createElement(r === 0 ? 'th' : 'td');
        td.innerHTML = r === 0 ? 'Judul ' + (c + 1) : '&nbsp;';
        tr.appendChild(td);
      }
      tabel.appendChild(tr);
    }
    const p = document.createElement('p');
    p.innerHTML = '<br>';   // baris kosong setelah tabel

    const sel = simpanSeleksi();
    if (sel && editor.contains(sel.startContainer)) {
      sel.deleteContents();
      sel.insertNode(tabel);
      sel.setStartAfter(tabel);
      sel.collapse(true);
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(sel);
    } else {
      editor.appendChild(tabel);
      editor.appendChild(p);
    }
    autoSimpan();
  }

  // modal edit tabel
  const modalTabel = document.getElementById('modal-tabel');
  const gridTabel = document.getElementById('grid-tabel');
  let gridDimensi = { baris: 3, kolom: 3 };

  function bukaModalTabel() {
    let baris = 3, kolom = 3, isi = [];
    // coba baca tabel yang ada di sekitar kursor
    const t = tabelAktif();
    if (t) {
      baris = t.rows.length;
      kolom = t.rows[0].cells.length;
      for (let r = 0; r < baris; r++) {
        const rb = [];
        for (let c = 0; c < kolom; c++) {
          rb.push((t.rows[r].cells[c].textContent || '').trim());
        }
        isi.push(rb);
      }
    }
    gambarGrid(baris, kolom, isi);
    modalTabel.classList.add('buka');
  }

  function tabelAktif() {
    const s = window.getSelection();
    if (!s || !s.rangeCount) return null;
    let n = s.getRangeAt(0).startContainer;
    while (n && n !== editor) {
      if (n.tagName === 'TABLE') return n;
      n = n.parentNode;
    }
    return null;
  }

  function gambarGrid(baris, kolom, isi) {
    gridDimensi = { baris, kolom };
    gridTabel.innerHTML = '';
    const tb = document.createElement('table');
    tb.className = 'grid';
    for (let r = 0; r < baris; r++) {
      const tr = document.createElement('tr');
      for (let c = 0; c < kolom; c++) {
        const td = document.createElement(r === 0 ? 'th' : 'td');
        const inp = document.createElement('input');
        inp.value = (isi && isi[r] && isi[r][c]) ? isi[r][c] : '';
        inp.placeholder = r === 0 ? 'Judul' : '';
        td.appendChild(inp);
        tr.appendChild(td);
      }
      tb.appendChild(tr);
    }
    gridTabel.appendChild(tb);
  }

  function bacaGrid() {
    const isi = [];
    gridTabel.querySelectorAll('tr').forEach(tr => {
      const rb = [];
      tr.querySelectorAll('input').forEach(inp => rb.push(inp.value.replace(/\|/g, '')));
      isi.push(rb);
    });
    return isi;
  }

  function masukkanTabel() {
    const isi = bacaGrid();
    if (!isi.length || !isi[0].length) { modalTabel.classList.remove('buka'); return; }
    const kolom = isi[0].length;
    const tabel = document.createElement('table');
    isi.forEach((rb, r) => {
      const tr = document.createElement('tr');
      for (let c = 0; c < kolom; c++) {
        const td = document.createElement(r === 0 ? 'th' : 'td');
        td.textContent = rb[c] || (r === 0 ? 'Judul ' + (c + 1) : '');
        tr.appendChild(td);
      }
      tabel.appendChild(tr);
    });
    const lama = tabelAktif();
    if (lama) {
      lama.replaceWith(tabel);
    } else {
      editor.focus();
      const sel = simpanSeleksi();
      if (sel && editor.contains(sel.startContainer)) {
        sel.deleteContents();
        sel.insertNode(tabel);
      } else {
        editor.appendChild(tabel);
      }
    }
    modalTabel.classList.remove('buka');
    autoSimpan();
    toast('Tabel dimasukkan');
  }

  document.getElementById('tb-baris').addEventListener('click', () => {
    const g = bacaGrid(); g.push(new Array(gridDimensi.kolom).fill(''));
    gambarGrid(g.length, gridDimensi.kolom, g);
  });
  document.getElementById('tb-baris-hapus').addEventListener('click', () => {
    const g = bacaGrid();
    if (g.length <= 2) { toast('Minimal 2 baris'); return; }
    g.pop(); gambarGrid(g.length, gridDimensi.kolom, g);
  });
  document.getElementById('tk-kolom').addEventListener('click', () => {
    const g = bacaGrid(); g.forEach(rb => rb.push(''));
    gambarGrid(g.length, g[0].length, g);
  });
  document.getElementById('tk-kolom-hapus').addEventListener('click', () => {
    const g = bacaGrid();
    if (g[0].length <= 1) { toast('Minimal 1 kolom'); return; }
    g.forEach(rb => rb.pop()); gambarGrid(g.length, g[0].length, g);
  });
  document.getElementById('m-tt').addEventListener('click', () => modalTabel.classList.remove('buka'));
  document.getElementById('m-batal').addEventListener('click', () => modalTabel.classList.remove('buka'));
  document.getElementById('m-masukkan').addEventListener('click', masukkanTabel);

  // ------------------------------------------------------------
  // markup ketik cepat (# , ## , - , 1. )
  // ------------------------------------------------------------
  function markupCepat(e) {
    if (e.key !== ' ') return;
    const s = window.getSelection();
    if (!s || !s.rangeCount || !s.isCollapsed) return;
    const r = s.getRangeAt(0);
    const node = r.startContainer;
    if (node.nodeType !== 3) return;

    const teks = node.textContent;
    const off = r.startOffset;
    const sebelum = teks.slice(0, off);
    const cocok = sebelum.match(/^(#{1,3}|-|\d+\.)$/);
    if (!cocok) return;
    e.preventDefault();

    const sisa = teks.slice(off);
    let blok;
    if (/^#+$/.test(cocok[1])) {
      blok = document.createElement('h' + cocok[1].length);
      blok.textContent = sisa;
      sizeLabel.textContent = 'H' + cocok[1].length;
    } else if (cocok[1] === '-') {
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      li.textContent = sisa;
      ul.appendChild(li);
      blok = ul;
      setLabelDaftar('• List');
    } else {
      const ol = document.createElement('ol');
      const li = document.createElement('li');
      li.textContent = sisa;
      ol.appendChild(li);
      blok = ol;
      setLabelDaftar('1. List');
    }

    // tentukan elemen yang diganti (blok pembungkus di dalam editor)
    const induk = node.parentNode;
    let target = node;
    let blokInduk = null;
    if (induk && induk !== editor) {
      let n = induk;
      while (n && n.parentNode !== editor) n = n.parentNode;
      if (n && n.parentNode === editor) blokInduk = n;
    }
    if (blokInduk) {
      blokInduk.replaceWith(blok);
    } else if (induk && induk !== editor) {
      induk.replaceChild(blok, node);
    } else {
      editor.replaceChild(blok, node);
    }

    // taruh kursor di akhir blok baru
    const isi = (blok.tagName === 'UL' || blok.tagName === 'OL') ? blok.querySelector('li') : blok;
    const r2 = document.createRange();
    r2.selectNodeContents(isi);
    r2.collapse(false);
    s.removeAllRanges();
    s.addRange(r2);
    autoSimpan();
  }

  // ------------------------------------------------------------
  // toolbar — klik
  // ------------------------------------------------------------
  function tutupSubmenu(kecuali) {
    toolbar.querySelectorAll('.submenu.buka').forEach(sm => {
      if (sm !== kecuali) sm.classList.remove('buka');
    });
    toolbar.querySelectorAll('.dasar.aktif').forEach(b => b.classList.remove('aktif'));
  }

  // ------------------------------------------------------------
  // pasangSubmenu — atur letak submenu supaya selalu TERLIHAT
  // ------------------------------------------------------------
  // Tombol [🧩 ▼] ada di ujung KANAN toolbar. Kalau submenu dibuka dengan
  // `left: 0` (bawaan CSS), sebagian menonjol KELUAR KOTAK APLIKASI.
  // ⚠️ Yang memotong bukan layar, tapi `.app` yang punya `overflow: hidden`
  // (di PC `.app` selebar ±480px di tengah, jadi submenu menonjol keluar
  // kotak → terpotong walau layarnya masih luas — laporan user 14 Sep 2026).
  // Jadi kita ukur kotak yang benar-benar memotong: `.app` terdekat.
  //   • menonjol ke KANAN → submenu ditempel ke TEPI KANAN tombolnya (`right: 0`)
  //   • tidak muat ke BAWAH → submenu dibuka KE ATAS tombolnya (kelas `.ke-atas`)
  function pasangSubmenu(sm) {
    sm.classList.remove('ke-atas');
    sm.style.left = '';
    sm.style.right = '';
    // batas yang benar-benar memotong = kotak `.app` (bukan layar)
    const app = sm.closest('.app') || document.body;
    const batas = app.getBoundingClientRect();
    const kiriBatas = Math.max(batas.left, 0);
    const kananBatas = Math.min(batas.right, window.innerWidth);
    const bawahBatas = Math.min(batas.bottom, window.innerHeight);

    const r = sm.getBoundingClientRect();
    // menonjol ke kanan → tempelkan ke tepi kanan tombol
    if (r.right > kananBatas - 4) {
      sm.style.left = 'auto';
      sm.style.right = '0';
    }
    // setelah digeser, kalau masih menonjol ke kiri → tarik kembali ke kiri kotak
    const r2 = sm.getBoundingClientRect();
    if (r2.left < kiriBatas - 1) {
      sm.style.left = '0';
      sm.style.right = 'auto';
    }
    // tidak muat ke bawah → buka ke atas
    const r3 = sm.getBoundingClientRect();
    if (r3.bottom > bawahBatas - 4) sm.classList.add('ke-atas');
  }

  toolbar.addEventListener('mousedown', (e) => {
    // supaya fokus editor tidak hilang saat klik toolbar
    if (e.target.closest('button')) e.preventDefault();
  });

  toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    // --- tombol dasar (pembuka submenu) ---
    const grup = btn.dataset.grup;
    if (grup) {
      const sm = toolbar.querySelector('.submenu[data-sub="' + grup + '"]');
      const lewatPanah = !!e.target.closest('.panah');

      // size / list / tabel : seluruh tombol membuka submenu
      // stab / huruf / icon : klik badan = pakai terakhir, klik ▼ = pilih
      if (grup === 'stab' || grup === 'huruf' || grup === 'icon') {
        if (!lewatPanah) {
          if (grup === 'stab') warnai('stab', stabTerakhir);
          else if (grup === 'huruf') warnai('huruf', hurufTerakhir);
          else sisipIcon(iconTerakhir);
          tutupSubmenu();
          return;
        }
      }

      const terbuka = sm.classList.contains('buka');
      tutupSubmenu(sm);
      sm.classList.toggle('buka', !terbuka);
      btn.classList.toggle('aktif', !terbuka);
      if (!terbuka) pasangSubmenu(sm);
      return;
    }

    // --- item di dalam submenu ---
    if (btn.closest('.submenu')) {
      const sm = btn.closest('.submenu');
      if (btn.dataset.fmt) {
        const f = btn.dataset.fmt;
        if (f === 'h1' || f === 'h2' || f === 'h3' || f === 'p') ubahBlok(f.toUpperCase());
        else if (f === 'bullet' || f === 'number' || f === 'icon-list') daftarFmt(f);
        else if (f === 'tabel') sisipTabel();
        else if (f === 'edit-tabel') bukaModalTabel();
      } else if (btn.dataset.stab) {
        stabTerakhir = btn.dataset.stab;
        document.getElementById('stab-dot').style.background = stabTerakhir;
        warnai('stab', stabTerakhir);
      } else if (btn.dataset.huruf) {
        hurufTerakhir = btn.dataset.huruf;
        document.getElementById('huruf-dot').style.background = hurufTerakhir;
        warnai('huruf', hurufTerakhir);
      } else if (btn.dataset.icon) {
        sisipIcon(btn.dataset.icon);
      }
      tutupSubmenu();
      return;
    }

    // --- tombol biasa ---
    const f = btn.dataset.fmt;
    const a = btn.dataset.aksi;
    if (a === 'undo') batalTulis();
    else if (a === 'redo') ulangiTulis();
    else if (f === 'bold') { editor.focus(); document.execCommand('bold', false, null); autoSimpan(); }
    else if (f === 'italic') { editor.focus(); document.execCommand('italic', false, null); autoSimpan(); }
    else if (f === 'hapus-warna') hapusWarna();
  });

  // tutup submenu bila klik di luar
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#toolbar')) tutupSubmenu();
  });

  // ------------------------------------------------------------
  // editor
  // ------------------------------------------------------------
  editor.addEventListener('input', autoSimpan);

  // (tombol ▦ dikendalikan ANodesPlugin — sembunyi/tampilkan toolbar tulis,
  //  Alt+klik = sembunyikan baris. Semua urusan plugin lewat tombol 🧩.)
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '    ');
      autoSimpan();
    }
  });
  editor.addEventListener('keydown', markupCepat);

  // Ctrl+S = simpan + toast.
  // Pintasan format (Ctrl+1, Ctrl+B, dst) bisa diganti user di ⚙ Pengaturan.
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      simpan(false);
      return;
    }
    // 🔍 Ctrl+F = cari kata DI DALAM catatan yang sedang dibuka (K29).
    //    ⚠️ ini menggantikan kotak cari bawaan browser — supaya hasilnya
    //    konsisten (lompat + sorot kuning + penghitung), sama seperti menu [Doc].
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      cariIsiBuka();
      return;
    }
    // Esc = tutup bilah cari catatan
    if (e.key === 'Escape' && barCari && !barCari.hidden) {
      cariIsiTutup(true);
      editor.focus();
      return;
    }
    // BATAL / ULANGI tulisan (selalu ada, tidak bisa dimatikan)
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      batalTulis();
      return;
    }
    if ((e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
      e.preventDefault();
      ulangiTulis();
      return;
    }
    // jangan ganggu saat merekam pintasan / mengetik di kolom isian
    if (document.body.dataset.rekamPintas === '1') return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;

    const aksi = ANodesSetting.aksiUntuk(e);
    if (!aksi) return;
    e.preventDefault();
    switch (aksi) {
      case 'h1': ubahBlok('H1'); break;
      case 'h2': ubahBlok('H2'); break;
      case 'h3': ubahBlok('H3'); break;
      case 'p':  ubahBlok('P');  break;
      case 'bullet': daftarFmt('bullet'); break;
      case 'number': daftarFmt('number'); break;
      case 'icon':   daftarFmt('icon');   break;
      case 'bold':   editor.focus(); document.execCommand('bold', false, null); autoSimpan(); break;
      case 'italic': editor.focus(); document.execCommand('italic', false, null); autoSimpan(); break;
    }
  });

  // teks yang di-paste dibersihkan jadi teks biasa
  //   ⚠️ K44 (18 Sep 2026) — DIREVISI. Dulu SEMUA tempelan dipaksa jadi teks biasa
  //      satu blok → naskah dari AI / halaman web (mis. paket pelajaran Alkitab)
  //      masuk sebagai satu paragraf raksasa: `**SASARAN**` tampil bintang-bintang,
  //      tautan tampil mentah `[1Yo 1:1](https://…)`, daftar hilang.
  //   Sekarang: kalau tempelan MEMANG naskah bergaya (banyak baris + penanda
  //      tebal/daftar/tautan), naskah itu DIRAPIKAN dulu memakai pengolah
  //      markdown yang sudah ada (menu [Doc]). Teks pendek / biasa tetap
  //      masuk apa adanya seperti dulu.
  //   ⚠️ Bapak bisa menekan ↶ (Ctrl+Z) untuk kembali ke bentuk mentah.
  editor.addEventListener('paste', (e) => {
    e.preventDefault();
    const cd = e.clipboardData || window.clipboardData;
    const teks = cd.getData('text/plain');
    if (!teks) return;

    // 🆕 K49 (20 Sep 2026) — tempelan yang isinya TAG HTML (mis. disalin dari
    //   Google AI yang memberi kode HTML) TIDAK boleh masuk sebagai tulisan
    //   `&lt;h3&gt;…`. Ubah dulu jadi rapi, sama seperti impor berkas.
    if (isiHtml(teks)) {
      const rapiHtml = rapikanNaskah(htmlKeMarkdownImpor(teks));
      if (rapiHtml) {
        document.execCommand('insertHTML', false, rapiHtml);
        autoSimpan();
        toast('🧹 Naskah HTML dirapikan — tekan ↶ kalau ingin bentuk aslinya');
        segarkanTombolRapi();
        return;
      }
    }

    if (naskahBergaya(teks)) {
      const rapi = rapikanNaskah(teks);
      if (rapi) {
        document.execCommand('insertHTML', false, rapi);
        autoSimpan();
        toast('🧹 Naskah dirapikan — tekan ↶ kalau ingin bentuk aslinya');
        segarkanTombolRapi();
        return;
      }
    }
    document.execCommand('insertText', false, teks);
    autoSimpan();
  });

  // ------------------------------------------------------------
  // pencarian, filter, kategori
  // ------------------------------------------------------------
  cariEl.addEventListener('input', renderDaftar);
  filterSel.addEventListener('change', renderDaftar);

  // ---------- 🔍 bilah cari DI DALAM catatan (K29) ----------
  if (inpCariIsi && !inpCariIsi.dataset.siap) {
    inpCariIsi.dataset.siap = '1';
    inpCariIsi.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const k = String(inpCariIsi.value || '').trim();
        if (!cariIsi.kata || cariIsi.kata !== k) cariIsiMulai(k);
        else cariIsiLompat(e.shiftKey ? -1 : 1, false);
      }
      if (e.key === 'Escape') { e.preventDefault(); cariIsiTutup(true); editor.focus(); }
    });
    inpCariIsi.addEventListener('input', () => {
      // ketikan baru = pencarian lama dibuang supaya tidak menyesatkan
      if (cariIsi.kata && String(inpCariIsi.value || '').trim() !== cariIsi.kata) {
        cariIsiTutup(false);
        inpCariIsi.value = String(inpCariIsi.value || '');
        barCari.hidden = false;
      }
    });
  }
  const btnCariNext = document.getElementById('cari-isi-next');
  const btnCariPrev = document.getElementById('cari-isi-prev');
  const btnCariTutup = document.getElementById('cari-isi-tutup');
  if (btnCariNext) btnCariNext.addEventListener('click', () => {
    if (!cariIsi.kata) cariIsiMulai(); else cariIsiLompat(1, false);
  });
  if (btnCariPrev) btnCariPrev.addEventListener('click', () => cariIsiLompat(-1, false));
  if (btnCariTutup) btnCariTutup.addEventListener('click', () => {
    cariIsiTutup(true);
    editor.focus();
  });

  katSelect.addEventListener('change', () => {
    if (!aktif) return;
    if (katSelect.value === '__baru__') {
      const nama = prompt('Nama kategori baru:');
      if (nama && nama.trim()) {
        ANodesStore.tambahKategori(nama.trim());
        ANodesStore.pindahKategori(aktif, nama.trim());
        isiKategori();
        renderDaftar();
        toast('Kategori "' + nama.trim() + '" dibuat');
      } else isiKategori();
      return;
    }
    ANodesStore.pindahKategori(aktif, katSelect.value);
    renderDaftar();
    toast('Pindah ke kategori "' + katSelect.value + '"');
  });

  // ------------------------------------------------------------
  // 🔍 CARI KATA DI CATATAN YANG SEDANG DIBUKA (K29 — 15 Sep 2026)
  // ------------------------------------------------------------
  //   Order Bapak: *“saya mau ganti fungsi [cari] ini cari kata dalam
  //   tulisan catatan yg sedang dibuka”*.
  //   Jadi tombol [🔍 Cari] di kepala + Ctrl+F = mencari DI DALAM catatan
  //   yang terbuka (lompat + sorot kuning), seperti cari di menu [Doc].
  //   Pencarian ANTAR-catatan pindah ke panel daftar (#cari + #filter-kategori).
  //
  //   ⚠️ Penandaan lewat POTONGAN TEKS (TreeWalker) — tag markup tidak
  //      pernah tersentuh. Tanda sorot TIDAK ikut tersimpan (dibersihkan
  //      sebelum simpan lewat `bersihTandaCari()`).
  // ------------------------------------------------------------
  function bersihTandaCari(html) {
    return String(html == null ? '' : html)
      .replace(/<mark class="cari-hit[^"]*">/g, '')
      .replace(/<\/mark>/g, '');
  }

  function posisiDiTeks(teks, kata) {
    const hasil = [];
    const bawah = String(teks).toLowerCase();
    const cari = String(kata).toLowerCase();
    if (!cari) return hasil;
    let dari = 0, i;
    while ((i = bawah.indexOf(cari, dari)) !== -1) {
      hasil.push({ mulai: i, akhir: i + cari.length });
      dari = i + cari.length;
    }
    return hasil;
  }

  function bungkusDiEditor(kata) {
    const daftar = [];
    if (!kata) return daftar;
    const jalan = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null);
    const semua = [];
    let n;
    while ((n = jalan.nextNode())) semua.push(n);
    semua.forEach(node => {
      const teks = node.nodeValue || '';
      if (!teks.trim()) return;
      const pos = posisiDiTeks(teks, kata);
      if (!pos.length) return;
      const frag = document.createDocumentFragment();
      let dari = 0;
      pos.forEach(p => {
        if (p.mulai > dari) frag.appendChild(document.createTextNode(teks.slice(dari, p.mulai)));
        const m = document.createElement('mark');
        m.className = 'cari-hit';
        m.textContent = teks.slice(p.mulai, p.akhir);
        frag.appendChild(m);
        daftar.push(m);
        dari = p.akhir;
      });
      if (dari < teks.length) frag.appendChild(document.createTextNode(teks.slice(dari)));
      if (node.parentNode) node.parentNode.replaceChild(frag, node);
    });
    return daftar;
  }

  function segarkanInfoCari(gulir) {
    if (infoCari) {
      if (!cariIsi.kata) infoCari.textContent = '';
      else if (!cariIsi.jumlah) infoCari.textContent = '0';
      else infoCari.textContent = (cariIsi.urut + 1) + '/' + cariIsi.jumlah;
    }
    if (inpCariIsi) inpCariIsi.classList.toggle('cari-ada', !!cariIsi.kata && cariIsi.jumlah > 0);
    if (gulir && cariIsi.urut >= 0) {
      const aktif = editor.querySelector('mark.cari-hit.cari-aktif');
      if (aktif && aktif.scrollIntoView) aktif.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  // gambar ulang tanda (dipakai setelah isi editor berubah)
  function gambarTandaCari() {
    cariIsi.daftar = [];
    cariIsi.jumlah = 0;
    if (!cariIsi.kata) return;
    cariIsi.daftar = bungkusDiEditor(cariIsi.kata);
    cariIsi.jumlah = cariIsi.daftar.length;
    if (cariIsi.urut >= cariIsi.jumlah) cariIsi.urut = cariIsi.jumlah - 1;
  }

  function cariIsiMulai(kata) {
    const k = (kata === undefined) ? (inpCariIsi ? inpCariIsi.value : '') : kata;
    if (!String(k || '').trim()) { cariIsiTutup(true); return; }
    cariIsi.kata = String(k).trim();
    cariIsi.urut = -1;
    // buang tanda lama dulu (kalau ada)
    editor.querySelectorAll('mark.cari-hit').forEach(m => {
      const t = document.createTextNode(m.textContent);
      if (m.parentNode) m.parentNode.replaceChild(t, m);
    });
    editor.normalize();
    gambarTandaCari();
    if (!cariIsi.jumlah) {
      segarkanInfoCari(false);
      toast('🔍 tidak ada temuan untuk “' + cariIsi.kata + '”');
      return;
    }
    cariIsiLompat(1, false);
  }

  function cariIsiLompat(arah, dariPencarian) {
    if (!cariIsi.kata) return;
    if (!cariIsi.jumlah) gambarTandaCari();
    if (!cariIsi.jumlah) { segarkanInfoCari(false); return; }
    if (dariPencarian) cariIsi.urut = -1;
    const jml = cariIsi.jumlah;
    cariIsi.urut = ((cariIsi.urut + arah) % jml + jml) % jml;
    cariIsi.daftar.forEach(x => x.classList.remove('cari-aktif'));
    const el = cariIsi.daftar[cariIsi.urut];
    if (el) el.classList.add('cari-aktif');
    segarkanInfoCari(true);
  }

  function cariIsiBuka() {
    if (barCari) barCari.hidden = false;
    if (inpCariIsi) setTimeout(() => inpCariIsi.select(), 30);
  }

  function cariIsiTutup(bersihKotak) {
    // buang semua tanda → catatan kembali teks biasa
    editor.querySelectorAll('mark.cari-hit').forEach(m => {
      const t = document.createTextNode(m.textContent);
      if (m.parentNode) m.parentNode.replaceChild(t, m);
    });
    editor.normalize();
    cariIsi = { kata: '', urut: -1, jumlah: 0, daftar: [] };
    if (bersihKotak && inpCariIsi) inpCariIsi.value = '';
    if (barCari) barCari.hidden = true;
    segarkanInfoCari(false);
  }

  // ------------------------------------------------------------
  // IMPOR / EKSPOR (K30 — 15 Sep 2026)
  // ------------------------------------------------------------
  //   Order Bapak: *“File Impor <- buka file yg berformat .md atau .txt dan
  //   ekpor ke format md/txt/pdf”* + *“Impornya ke catatan yang sedang dibuka”*.
  //
  //   • Impor .md/.txt → masuk ke catatan yang SEDANG DIBUKA (tanya dulu:
  //     ganti isi / tambah di akhir).  .json tetap = cadangan (gabung semua).
  //   • Ekspor .md   = isi catatan apa adanya (sudah markdown) → unduh.
  //   • Ekspor .txt  = teks biasa (penanda markdown dibuang) → unduh.
  //   • Ekspor .pdf  = lewat jendela cetak browser (pilih “Simpan sebagai PDF”).
  //     ❌ tanpa pustaka luar — aplikasi harus tetap jalan di `file://`.
  // ------------------------------------------------------------
  function namaAman(teks) {
    return String(teks || 'catatan')
      .replace(/[\\/:*?"<>|]+/g, '-')
      .replace(/\s+/g, ' ')
      .trim().slice(0, 60) || 'catatan';
  }

  function unduhBerkas(nama, isi, jenis) {
    const blob = new Blob([isi], { type: jenis || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nama;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ubah HTML catatan → teks biasa (markdown ringan sudah tersimpan apa adanya)
  function isiMarkdown() {
    if (cariIsi.kata) cariIsiTutup(false);       // jangan ekspor tanda cari
    // buang SEMUA tanda tampilan (ayat + istilah) dulu — catatan tetap teks biasa
    const mentah = bersihSemuaTanda(editor.innerHTML);
    return rapikanHtml(mentah);
  }

  function isiTeksBiasa() {
    const tmp = document.createElement('div');
    tmp.innerHTML = isiMarkdown();
    // baris baru di akhir setiap blok supaya rapi
    tmp.querySelectorAll('p,div,h1,h2,h3,h4,h5,h6,li,tr,br,blockquote').forEach(b => {
      b.insertAdjacentText('afterend', '\n');   // dipakai hanya untuk pemisah
    });
    let t = tmp.innerText || tmp.textContent || '';
    // buang penanda markdown sederhana supaya benar-benar teks biasa
    t = t.replace(/^\s*#{1,6}\s+/gm, '')
         .replace(/\*\*(.+?)\*\*/g, '$1')
         .replace(/(^|\s)\*(?!\s)(.+?)\*/g, '$1$2')
         .replace(/`([^`]+)`/g, '$1')
         .replace(/^\s*[-*+]\s+/gm, '• ')
         .replace(/\n{3,}/g, '\n\n');
    return t.trim();
  }

  function eksporMD() {
    const c = ANodesStore.ambil(aktif);
    if (!c) { toast('Tidak ada catatan yang dibuka'); return; }
    if (kotor) simpan(true);
    unduhBerkas(namaAman(c.judul) + '.md', isiMarkdown(), 'text/markdown;charset=utf-8');
    toast('⤓ Ekspor .md selesai');
  }

  function eksporTXT() {
    const c = ANodesStore.ambil(aktif);
    if (!c) { toast('Tidak ada catatan yang dibuka'); return; }
    if (kotor) simpan(true);
    unduhBerkas(namaAman(c.judul) + '.txt', isiTeksBiasa(), 'text/plain;charset=utf-8');
    toast('⤓ Ekspor .txt selesai');
  }

  // PDF lewat jendela cetak browser (ciptakan halaman siap-cetak)
  function eksporPDF() {
    const c = ANodesStore.ambil(aktif);
    if (!c) { toast('Tidak ada catatan yang dibuka'); return; }
    if (kotor) simpan(true);
    // ⚠️ JANGAN pakai window.open('', '_blank').
    //    Di Chrome + file://, jendela kosong itu MEWARISI URL halaman ANodes →
    //    Chrome menulis di Console:
    //      “Unsafe attempt to load URL file:///…/ANodes-1berkas.html …
    //       ‘file:’ URLs are treated as unique security origins.”
    //    Jendelanya memang jadi, tetapi pesan itu membingungkan Bapak (19 Sep 2026).
    //    Perbaikan: buat <iframe> tersembunyi di halaman SENDIRI → tulis isi cetak
    //    ke dalamnya → cetak dari situ (tidak ada jendela/URL baru, tidak ada pesan).
    const w = cetakLewatIframe();
    if (!w) { toast('⚠️ Pencetakan diblokir browser — coba lagi'); return; }
    // ⚠️ PENTING: isiMarkdown() SUDAH berbentuk HTML (<p>…</p>).
    //    Dulu hasilnya langsung diserahkan ke keHtmlSederhana(), yang mengira
    //    masukannya MARKDOWN → seluruh HTML di-escape menjadi teks mentah,
    //    sehingga halaman cetak/PDF berisi tulisan “<p>Kalimat saya…</p>”
    //    apa adanya (bug lama, ketemu lewat uji Chrome sungguhan 19 Sep 2026).
    const isiHtml = keHtmlCetak(isiMarkdown());
    // ⚠️ PENTING: teks penutup body & html DITULIS dengan escape \x3c
    //    (mis. '\x3c/body>'). Kalau ditulis mentah, tools/buat-1-berkas.js
    //    akan menganggapnya sebagai PENUTUP BODY berkas dan menyisipkan
    //    data Alkitab (5 MB) ke TENGAH kode ini → versi HP rusak.
    w.document.open();
    w.document.write(
      '<!DOCTYPE html><html lang="id"><head><meta charset="utf-8">' +
      '<title>' + namaAman(c.judul) + '</title>' +
      '<style>' +
      'body{font-family:Georgia,"Times New Roman",serif;max-width:760px;margin:24px auto;' +
      'padding:0 16px;line-height:1.75;color:#111;font-size:12pt;}' +
      'h1{font-size:20pt;} h2{font-size:16pt;} h3{font-size:14pt;}' +
      'pre{background:#f4f6f8;padding:8px;border-radius:4px;white-space:pre-wrap;font-size:10pt;}' +
      'code{font-family:Consolas,monospace;} table{border-collapse:collapse;width:100%;}' +
      'th,td{border:1px solid #ccc;padding:4px 8px;text-align:left;}' +
      'blockquote{border-left:3px solid #999;margin:8px 0;padding:2px 12px;color:#444;}' +
      '@media print{body{margin:0;}}' +
      '\x3c/style>\x3c/head>\x3cbody>' + isiHtml + '\x3c/body>\x3c/html>');
    w.document.close();
    setTimeout(() => { try { w.focus(); w.print(); } catch (e) {} }, 300);
    toast('🖨 Jendela cetak terbuka — pilih “Simpan sebagai PDF”');
  }

  // Wadah cetak: <iframe> tersembunyi (menggantikan window.open kosong).
  // Dibuat sekali, dipakai berulang; isinya diganti tiap kali mencetak.
  let bingkaiCetak = null;
  function cetakLewatIframe() {
    if (!bingkaiCetak) {
      const f = document.createElement('iframe');
      f.id = 'bingkai-cetak';
      f.setAttribute('aria-hidden', 'true');
      f.setAttribute('title', 'wadah cetak');
      // tanpa src → tidak memuat apa pun;  dibiarkan di luar layar (bukan display:none,
      // sebab sebagian browser tidak mencetak isi iframe yang display:none)
      f.style.position = 'fixed';
      f.style.right = '0';
      f.style.bottom = '0';
      f.style.width = '1px';
      f.style.height = '1px';
      f.style.opacity = '0';
      f.style.border = '0';
      f.style.pointerEvents = 'none';
      document.body.appendChild(f);
      bingkaiCetak = f;
    }
    try {
      const d = bingkaiCetak.contentDocument || (bingkaiCetak.contentWindow && bingkaiCetak.contentWindow.document);
      if (!d) return null;
      return bingkaiCetak.contentWindow;
    } catch (e) { return null; }
  }

  // Penyaring untuk halaman CETAK/PDF.
  //   Masukan dari isiMarkdown() = HTML (<p>, <h1>, <ul>, <table>, <span class="ay-link">…)
  //   → HTML itu dibiarkan HTML (yang berbahaya dibuang), TIDAK di-escape.
  //   Markdown yang tersisa di dalam teks (<b>…</b>, `kode`, *miring*, — penanda
  //   **tebal** tidak disimpan editor) diubah supaya rapi saat dicetak.
  function keHtmlCetak(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = String(html == null ? '' : html);

    // 1) buang barang yang membahayakan / tidak perlu di cetak
    [...tmp.querySelectorAll('script,style,iframe,object,embed,link,meta')].forEach(x => x.remove());
    // buang atribut onclick/on… dan contenteditable/title (tidak berguna di kertas)
    [...tmp.querySelectorAll('*')].forEach(el => {
      [...el.attributes].forEach(at => {
        const n = at.name.toLowerCase();
        if (n.startsWith('on') || n === 'contenteditable' || n === 'data-ref') el.removeAttribute(at.name);
      });
    });
    // tautan ayat (span.ay-link) → dibiarkan teksnya saja (tanpa sorot）
    [...tmp.querySelectorAll('span.ay-link')].forEach(sp => {
      sp.replaceWith(document.createTextNode(sp.textContent));
    });

    // 2) markdown sisa di dalam teks → elemen
    const jalan = (node) => {
      [...node.childNodes].forEach(t => {
        if (t.nodeType !== 3) return;                       // hanya text node
        const asli = t.nodeValue;
        if (!/[*`]/.test(asli)) return;                     // tidak ada penanda → lewati
        const bungkus = document.createElement('span');
        bungkus.innerHTML = asli
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          .replace(/\*(?!\s)(.+?)\*/g, '<i>$1</i>');
        const frag = document.createDocumentFragment();
        while (bungkus.firstChild) frag.appendChild(bungkus.firstChild);
        t.replaceWith(frag);
      });
    };
    jalan(tmp);
    // beberapa blok (mis. <li>, <td>) isinya baru terbentuk setelah banyak penanda → ulangi sekali
    jalan(tmp);

    return tmp.innerHTML;
  }

  // olahan markdown sederhana (khusus cetak) — tanpa pustaka luar
  function keHtmlSederhana(md) {
    const aman = (s) => String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const baris = String(md || '').replace(/\r\n?/g, '\n').split('\n');
    const keluar = [];
    let daftar = '';
    let kode = null;
    const tutupDaftar = () => { if (daftar) { keluar.push('</' + daftar + '>'); daftar = ''; } };
    const inline = (t) => aman(t)
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*(?!\s)(.+?)\*/g, '<i>$1</i>');
    baris.forEach(b => {
      if (/^\s*```/.test(b)) {
        if (kode === null) { tutupDaftar(); kode = []; }
        else { keluar.push('<pre>' + aman(kode.join('\n')) + '</pre>'); kode = null; }
        return;
      }
      if (kode !== null) { kode.push(b); return; }
      const jd = /^\s*(#{1,4})\s+(.*)$/.exec(b);
      if (jd) { tutupDaftar(); const n = jd[1].length; keluar.push('<h' + n + '>' + inline(jd[2]) + '</h' + n + '>'); return; }
      const bt = /^(\s*)([-*+])\s+(.*)$/.exec(b);
      if (bt) { if (daftar !== 'ul') { tutupDaftar(); keluar.push('<ul>'); daftar = 'ul'; } keluar.push('<li>' + inline(bt[3]) + '</li>'); return; }
      const nm = /^(\s*)(\d+)[.)]\s+(.*)$/.exec(b);
      if (nm) { if (daftar !== 'ol') { tutupDaftar(); keluar.push('<ol>'); daftar = 'ol'; } keluar.push('<li>' + inline(nm[3]) + '</li>'); return; }
      if (/^\s*>\s?/.test(b)) { tutupDaftar(); keluar.push('<blockquote>' + inline(b.replace(/^\s*>\s?/, '')) + '</blockquote>'); return; }
      if (!b.trim()) { tutupDaftar(); return; }
      tutupDaftar();
      keluar.push('<p>' + inline(b) + '</p>');
    });
    if (kode !== null) keluar.push('<pre>' + aman(kode.join('\n')) + '</pre>');
    if (daftar) keluar.push('</' + daftar + '>');
    return keluar.join('\n');
  }

  // impor .md / .txt (atau .json cadangan) — dari file-impor
  function imporBerkas(f, baca) {
    const nama = (f.name || '').toLowerCase();
    const jenis = nama.endsWith('.md') || nama.endsWith('.markdown') ||
                  nama.endsWith('.txt') ? 'teks' : 'json';

    if (jenis === 'json') {
      const hasil = ANodesStore.impor(String(baca.result));
      fileImpor.value = '';
      if (!hasil.ok) { toast('Gagal: ' + hasil.pesan); return; }
      isiKategori(); renderDaftar();
      toast('Impor cadangan berhasil — ' + hasil.pesan);
      return;
    }

    // .md / .txt → ke catatan yang SEDANG DIBUKA
    const c = ANodesStore.ambil(aktif);
    fileImpor.value = '';
    if (!c) { toast('Buka dulu satu catatan, baru impor'); return; }
    const mentah = String(baca.result || '');
    if (!mentah.trim()) { toast('Berkas kosong'); return; }
    const ganti = confirm(
      'Impor berkas:\n' + f.name + '\n\n' +
      'Klik OK  = GANTI isi catatan “' + c.judul + '”\n' +
      'Klik Cancel = TAMBAHKAN di akhir catatan');
    const htmlBaru = keHtmlImpor(mentah);
    editor.innerHTML = ganti
      ? htmlBaru
      : (editor.innerHTML + '<p><br></p>' + htmlBaru);
    autoSimpan();
    if (cariIsi.kata) gambarTandaCari();
    toast('⤒ Impor ' + (ganti ? 'mengganti' : 'menambahkan') + ' isi dari ' + f.name);
  }

  // .md/.txt → HTML sederhana (aman: escape dulu)
  //
  //   ⚠️ DIPERBARUI 16 Sep 2026 — permintaan Bapak: *“di ANodes -> File -> impor
  //   -> rencanakerja.md tapi dibuat dalam tampil rencanakerja.md mengikuti layar
  //   supaya tampil mudah dibaca”*.
  //   Dulu pengolah ini hanya kenal judul/daftar/paragraf → **tabel** dan
  //   **kutipan** ikut jadi paragraf raksasa, jadi tampak berantakan.
  //   Sekarang: kalau berkasnya besar & pantas dirapikan, pengolahan diserahkan
  //   ke pengolah markdown bersama (`window.ANodesMarkdown.keHtml`) —
  //   hasilnya sama rapi dengan halaman dokumen. Kalau tidak, pakai cara lama.
  //   ⚠️ K28h (3 Nov 2026) — pengolah itu DIPINDAH dari `js/dokumen.js`
  //      ke `js/markdown.js` ketika menu [Doc] dihapus. Nama barunya
  //      `window.ANodesMarkdown` (dulu `window.ANodesDokumenTampilan`).
  // BERKAS yang isinya SUDAH HTML (mis. naskah dari Google AI / hasil salin halaman web)
  //   ⚠️ K49 (20 Sep 2026) — Bapak: *“saya buka file .md di hp menggunakan ANodes-1berkas
  //      hasilnya ada script html terlihat tapi buka di PC bagus rapih”*.
  //   Sebabnya: berkas itu memang **HTML** (`<h3>…</h3>`, `<p>…</p>`), BUKAN markdown.
  //   `keHtmlImpor()` menganggapnya markdown → `<` di-escape jadi `&lt;` → TAG TAMPIL SEBAGAI TULISAN.
  //   ⇒ Kalau isinya jelas HTML, ubah lebih dulu jadi markdown (`htmlKeMarkdownImpor`),
  //     baru diolah pengolah markdown biasa. Hasilnya rapi — sama seperti di [Doc].
  function keHtmlImpor(md) {
    const teks = padatkanGaris(String(md == null ? '' : md));
    // 0) 🆕 K49 — berkas HTML → ubah dulu jadi markdown supaya tidak tampil sebagai tag
    if (isiHtml(teks)) {
      const mdown = htmlKeMarkdownImpor(teks);
      if (mdown && mdown.trim()) return keHtmlImpor(mdown);
    }
    // 1) pakai pengolah markdown bersama kalau berkasnya memang berbentuk dokumen
    let hasil = '';
    const d = window.ANodesMarkdown;
    if (d && typeof d.benahiMarkdown === 'function') hasil = d.benahiMarkdown(teks) || '';
    // 2) cadangan: pengolah sederhana (berkas kecil / teks biasa)
    if (!hasil) hasil = keHtmlImporSederhana(teks);
    // 3) 🆕 K49 — penanda garis tulis JANGAN sampai tampil ke pengguna
    return rapikanTandaGarisHtml(hasil);
  }

  // penanda `%%…GARIS…%%` (hasil padatkanGaris) → span garis untuk menulis
  //   ⚠️ WAJIB dipanggil di SEMUA jalur yang bisa memuat penanda itu
  //      (TEMPEL lewat `hiaskanNaskah`, dan IMPOR lewat `keHtmlImpor`).
  function rapikanTandaGarisHtml(html) {
    const s = String(html == null ? '' : html);
    if (s.indexOf(TANDA_GARIS) < 0) return s;          // tak ada penanda → tidak diapa-apakan
    const tmp = document.createElement('div');
    tmp.innerHTML = s;
    gantiTandaGaris(tmp);
    return tmp.innerHTML;
  }

  // apakah isi sebuah berkas berupa HTML (bukan markdown)?
  //   ⚠️ Aturannya dibuat HATI-HATI supaya tidak salah tangkap:
  //     (1) SEMUA baris berisi dimulai tag (+ ada tag penutup `</…>`) → pasti HTML,
  //         walau berkasnya pendek (mis. 3–4 baris)
  //     (2) ATAU banyak baris (≥5) DAN ≥35 % baris mulai dengan tag → HTML
  //   Berkas markdown biasa tidak pernah memenuhi salah satunya:
  //   kalimat “nilai <b> lebih kecil dari <p>” tidak dimulai dengan tag.
  //   Blok kode (```) SELALU dibiarkan markdown (isinya sering contoh HTML).
  function isiHtml(teks) {
    const t = String(teks == null ? '' : teks);
    if (t.length < 60) return false;
    const baris = t.replace(/\r\n?/g, '\n').split('\n').filter(b => b.trim());
    if (baris.length < 2) return false;
    if (!/<\s*\/?\s*[a-zA-Z][a-zA-Z0-9]*/.test(t)) return false;   // tak ada tag sama sekali
    if (/^\s*```/m.test(t)) return false;                          // blok kode → biarkan markdown
    const mulaiTag = baris.filter(b => /^\s*<\s*\/?\s*[a-zA-Z]/.test(b)).length;
    // (1) semua baris mulai tag — berkas HTML rapat (boleh pendek)
    if (mulaiTag === baris.length) return /<\s*\/\s*[a-zA-Z]/.test(t);
    // (2) banyak baris & mayoritas mulai tag
    return baris.length >= 5 && (mulaiTag / baris.length) >= 0.35;
  }

  // HTML → markdown (versi khusus IMPOR — bertingkat & tahan berkas besar)
  //   Beda dari `htmlKeMarkdown()` (mode 📖 Rapi): fungsi itu HANYA membaca anak
  //   langsung (cocok untuk isi catatan), sedangkan berkas impor bisa punya
  //   <p> di dalam <blockquote>/<div> → dipakai penelusuran TERTULIS di bawah.
  function htmlKeMarkdownImpor(html) {
    const akar = document.createElement('div');
    akar.innerHTML = String(html == null ? '' : html)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/&nbsp;/gi, ' ');

    // buang yang membahayakan / tidak perlu (sama seperti keHtmlCetak)
    [...akar.querySelectorAll('script,style,iframe,object,embed,link,meta,form,input,button')]
      .forEach(x => x.remove());

    // sebaris: <b>→**…** · <i>→*…* · <code>→`…` · <a>→[teks](url)
    function sebaris(el) {
      let t = '';
      el.childNodes.forEach(n => {
        if (n.nodeType === 3) { t += n.textContent; return; }
        if (n.nodeType !== 1) return;
        const nm = n.tagName;
        const dlm = sebaris(n);
        if (nm === 'B' || nm === 'STRONG') t += dlm.trim() ? '**' + dlm + '**' : dlm;
        else if (nm === 'I' || nm === 'EM') t += dlm.trim() ? '*' + dlm + '*' : dlm;
        else if (nm === 'CODE') t += '`' + dlm + '`';
        else if (nm === 'A') t += '[' + dlm + '](' + (n.getAttribute('href') || '#') + ')';
        else if (nm === 'BR') t += '\n';
        else t += dlm;
      });
      return t.replace(/[ \t]+/g, ' ').replace(/\s+\n/g, '\n').trim();
    }

    const blokJudul = /^(H[1-6]|P|DIV|UL|OL|LI|BLOCKQUOTE|PRE|TABLE|TR|TD|TH|HR|SECTION|ARTICLE|FIGURE|FIGCAPTION|DL|DT|DD)$/;

    const keluar = [];
    const dorong = (baris) => {
      const t = String(baris == null ? '' : baris).trim();
      if (!t) return;
      keluar.push(t, '');
    };

    function jalan(node, awalan) {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) { dorong(awalan + n.textContent.replace(/\s+/g, ' ').trim()); return; }
        if (n.nodeType !== 1) return;
        const nm = n.tagName;
        const pre = awalan || '';
        if (/^H[1-6]$/.test(nm)) { dorong(pre + '#'.repeat(Number(nm[1])) + ' ' + sebaris(n)); return; }
        if (nm === 'HR') { keluar.push('---', ''); return; }
        if (nm === 'PRE') { keluar.push('```', (n.textContent || '').replace(/\n+$/, ''), '```', ''); return; }
        if (nm === 'TABLE') {
          const baris = [...n.querySelectorAll('tr')];
          baris.forEach((tr, i) => {
            const sel = [...tr.children].map(td => sebaris(td).replace(/\|/g, '/'));
            keluar.push('| ' + sel.join(' | ') + ' |');
            if (i === 0) keluar.push('|' + sel.map(() => '---').join('|') + '|');
          });
          keluar.push('');
          return;
        }
        if (nm === 'UL' || nm === 'OL') {
          const bernomor = nm === 'OL';
          let no = 0;
          [...n.children].forEach(li => {
            if (li.tagName !== 'LI') {
              // <li> di dalam <li> tetap diolah
              if (blokJudul.test(li.tagName)) jalan(li, pre);
              return;
            }
            // LI yang isinya HANYA <p> tunggal → pakai <p>-nya (hindari baris kosong)
            const anakP = [...li.children].filter(x => blokJudul.test(x.tagName));
            const teksLi = sebaris(li);
            if (anakP.length === 0 || (anakP.length === 1 && anakP[0].tagName === 'P' && teksLi)) {
              no++;
              dorong(pre + (bernomor ? no + '. ' : '- ') + teksLi);
              // kalau <li> punya daftar bersarang → ikut ditelusuri
              [...li.children].forEach(x => {
                if (x.tagName === 'UL' || x.tagName === 'OL') jalan(x, pre + '  ');
              });
            } else {
              anakP.forEach((x, i) => {
                const teks = sebaris(x);
                if (!teks) return;
                if (i === 0) { no++; dorong(pre + (bernomor ? no + '. ' : '- ') + teks); }
                else jalan(x, pre + '  ');
              });
              [...li.children].forEach(x => {
                if (x.tagName === 'UL' || x.tagName === 'OL') jalan(x, pre + '  ');
              });
            }
          });
          return;
        }
        if (nm === 'BLOCKQUOTE') { jalan(n, '> ' + pre); return; }
        if (blokJudul.test(nm)) {
          // kalau di dalamnya masih ada blok (mis. <div><p>…</p></div>) → telusuri
          const adaLangkah = [...n.children].some(x => blokJudul.test(x.tagName));
          if (adaLangkah) { jalan(n, pre); return; }
          const teks = sebaris(n);
          if (teks) dorong(pre + teks);
          return;
        }
        // elemen tidak dikenal (mis. <span>, <font>) → lewati, ambil isinya
        const isi = sebaris(n);
        if (isi) dorong(pre + isi);
      });
    }

    jalan(akar, '');
    return keluar.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  function keHtmlImporSederhana(md) {
    return String(md || '').replace(/\r\n?/g, '\n').split(/\n{2,}/).map(blok => {
      const b = blok.trim();
      if (!b) return '';
      // Satu blok bisa memuat BEBERAPA baris (mis. judul lalu kalimat tanpa baris kosong).
      //   ⚠️ Dulu hanya baris pertama yang diuji, sehingga `# Judul` + kalimat di bawahnya
      //      tampil apa adanya sebagai teks “# Judul”. Sekarang diolah baris demi baris.
      const baris = b.split('\n');
      if (baris.some(x => /^#{1,6}\s+\S/.test(x.trim()))) {
        const keluar = [];
        let sisa = [];
        const tuangSisa = () => {
          if (!sisa.length) return;
          keluar.push(sisa.map(x => '<p>' + esc(x) + '</p>').join(''));
          sisa = [];
        };
        for (const x of baris) {
          const jd = /^(#{1,6})\s+(.*)$/.exec(x.trim());
          if (jd) {
            tuangSisa();
            const n = jd[1].length;
            keluar.push('<h' + n + '>' + esc(jd[2]) + '</h' + n + '>');
          } else {
            sisa.push(x);
          }
        }
        tuangSisa();
        return keluar.join('');
      }
      if (/^[-*+]\s+/m.test(b)) {
        return '<ul>' + b.split('\n').filter(x => /^\s*[-*+]\s+/.test(x))
          .map(x => '<li>' + esc(x.replace(/^\s*[-*+]\s+/, '')) + '</li>').join('') + '</ul>';
      }
      if (/^\d+[.)]\s+/m.test(b)) {
        return '<ol>' + b.split('\n').filter(x => /^\s*\d+[.)]\s+/.test(x))
          .map(x => '<li>' + esc(x.replace(/^\s*\d+[.)]\s+/, '')) + '</li>').join('') + '</ol>';
      }
      return b.split('\n').map(x => '<p>' + esc(x) + '</p>').join('');
    }).join('');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/\*(?!\s)(.+?)\*/g, '<i>$1</i>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  // ============================================================
  // K44 (18 Sep 2026) — TEMPEL NASKAH → MASUK RAPI
  //   Dipakai untuk naskah dari AI (Gemini dll) maupun pelajaran Alkitab
  //   dari halaman web (mis. learning.sabda.org). Yang diolah HANYA hasil
  //   tempelan di ANodes — halaman sumber tidak diapa-apakan.
  // ============================================================

  // apakah tempelan ini memang NASKAH BERGAYA?
  //   (bukan sekadar kalimat/tempelan biasa)
  function naskahBergaya(teks) {
    const t = String(teks || '');
    if (t.length < 120) return false;                 // terlalu pendek → apa adanya
    const baris = t.split(/\r?\n/);
    if (baris.length < 5) return false;               // sedikit baris → apa adanya

    const tebal  = (t.match(/^\s*\*\*[^*\n]{2,80}\*\*\s*$/gm) || []).length;  // **SASARAN** sendiri
    const daftar = (t.match(/^\s*[-*+•]\s+\S/mg) || []).length +
                   (t.match(/^\s*\d+[.)]\s+\S/mg) || []).length;
    const tautan = (t.match(/\[[^\]\n]+\]\([^)\n]+\)/g) || []).length;
    const judul  = (t.match(/^\s*#{1,6}\s+\S/mg) || []).length;

    let tanda = 0;
    if (tebal >= 1) tanda++;
    if (daftar >= 2) tanda++;
    if (tautan >= 1) tanda++;
    if (judul >= 1) tanda++;
    return tanda >= 2;                                // minimal 2 macam tanda → naskah
  }

  // baris garis pengisi (mis. baris "____" untuk menulis jawaban)
  //   ⚠️ JANGAN dibiarkan sebagai baris "____" — pengolah markdown membacanya
  //      sebagai GARIS PEMISAH (`<hr>`) sehingga baris tulisnya hilang.
  //      Karena itu diganti penanda sementara, lalu dibuat ulang sesudah diolah.
  const TANDA_GARIS = '%%ANODES_GARIS%%';

  function padatkanGaris(md) {
    // runtunan baris garis → maksimal 3 baris tulis (supaya tidak memakan tempat)
    return String(md || '').replace(
      /^[ \t]*_{4,}[ \t]*\r?\n(?:[ \t]*_{4,}[ \t]*\r?\n)*/gm,
      function (utuh) {
        const jumlah = (utuh.match(/_{4,}/g) || []).length;
        const pakai = Math.min(Math.max(jumlah, 1), 3);
        return (TANDA_GARIS + '\n').repeat(pakai);
      });
  }

  // rapikan naskah tempelan (pilihan 2)
  function rapikanNaskah(md) {
    const D = window.ANodesMarkdown;
    if (!D || typeof D.keHtml !== 'function') return null;
    const teks = padatkanGaris(String(md == null ? '' : md).replace(/\r\n?/g, '\n'));
    const html = D.keHtml(teks);
    if (!html || !html.trim()) return null;
    return hiaskanNaskah(html);
  }

  // sentuhan “keren”: judul bagian · judul bernomor · tautan diringkas
  //   ⚠️ HANYA di tingkat atas — jangan menyentuh isi daftar/tabel/kutipan.
  // 🆕 K49 — penanda sementara garis tulis → `span.naskah-garis` (46 garis bawah).
  //   Dipakai BAIK oleh jalur TEMPEL (`hiaskanNaskah`) maupun jalur IMPOR
  //   (`keHtmlImpor`). ❌ Jangan biarkan `%%ANODES_GARIS%%` tampil ke pengguna.
  function gantiTandaGaris(tmp) {
    const kumpul = [];
    const jalan = document.createTreeWalker(tmp, NodeFilter.SHOW_TEXT, null);
    let n;
    while ((n = jalan.nextNode())) {
      if ((n.textContent || '').indexOf(TANDA_GARIS) >= 0) kumpul.push(n);
    }
    kumpul.forEach(tn => {
      const frag = document.createDocumentFragment();
      String(tn.textContent).split(TANDA_GARIS).forEach((b, i) => {
        if (i > 0) {
          const s = document.createElement('span');
          s.className = 'naskah-garis';
          s.textContent = '_'.repeat(46);
          frag.appendChild(s);
        }
        if (b) frag.appendChild(document.createTextNode(b));
      });
      tn.parentNode.replaceChild(frag, tn);
    });
    return tmp;
  }

  function hiaskanNaskah(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const tautanAlkitab = [];

    [...tmp.children].forEach((b) => {
      // (a) paragraf "<b>HURUF BESAR</b>" → JUDUL BAGIAN
      //     ⚠️ dikecualikan: EVALUASI (bagian itu memang garis untuk ditulis)
      if (b.tagName === 'P' && b.children.length === 1) {
        const isi = b.firstElementChild;
        const nm = isi.tagName;
        const t = (b.textContent || '').trim();
        if ((nm === 'B' || nm === 'STRONG') &&
            t.length >= 3 && t.length <= 40 &&
            /^[^a-z]+$/.test(t) &&                       // tanpa huruf kecil (HURUF BESAR semua)
            /[A-Z]/.test(t) &&
            !/^evaluasi$/i.test(t)) {
          const h = document.createElement('h3');
          h.className = 'naskah-bagian';
          h.textContent = t;
          b.replaceWith(h);
          return;
        }
      }
      // (b) daftar bernomor TEPAT 1 butir yang isinya HURUF BESAR → JUDUL BAB
      //     (mis. "1. MENGENAL SIAPAKAH YESUS")
      if (b.tagName === 'OL' && b.children.length === 1) {
        const li = b.firstElementChild;
        const t = (li.textContent || '').trim();
        if (t.length >= 3 && t.length <= 90 &&
            /^[^a-z]*[A-Z][^a-z]*$/.test(t) &&
            !/[.!?]$/.test(t)) {
          const h = document.createElement('h2');
          h.className = 'naskah-judul';
          h.textContent = t;
          b.replaceWith(h);
          return;
        }
      }
    });

    // (c) baris tulis (dari baris "____") → tampil sebagai garis untuk menulis.
    //     ⚠️ Diganti lewat TEXT NODE (bukan hanya `<p>`), sebab penanda ini bisa
    //     menyatu dengan paragraf lain lewat `<br>` (mis. di bawah “EVALUASI”).
    //     🆕 K49 (20 Sep 2026): dipindah ke `gantiTandaGaris()` supaya jalur
    //     IMPOR BERKAS ikut memakainya — dulu penanda ini BOCOR ke tampilan
    //     (`%%ANODES_GARIS%%` terlihat sebagai tulisan) karena `hiaskanNaskah()`
    //     hanya dipanggil jalur TEMPEL, bukan jalur impor.
    gantiTandaGaris(tmp);

    // (d) kumpulkan tautan Alkitab (di mana pun, termasuk di dalam daftar)
    [...tmp.children].forEach(b => {
      b.querySelectorAll('a[href*="alkitab.sabda.org"]').forEach(a => tautanAlkitab.push(a));
    });

    // (e) tautan Alkitab → tombol ayat yang RAPI di TEKS yang sama
    //     ❌ BUKAN istilah (supaya tidak ketandai garis putus & tidak bisa diklik-kamus)
    tautanAlkitab.forEach(a => {
      const label = labelAyatDariTeks(a.textContent || '');
      if (!label) return;
      const s = document.createElement('span');
      s.className = 'kamus-ay-link';            // warna tautan, sama seperti di kamus
      s.textContent = label;
      s.title = (a.textContent || '').trim() + ' — ' + (a.getAttribute('href') || '');
      a.replaceWith(s);
    });

    return tmp.innerHTML;
  }

  // "1Yoh 1:1" → "1Yo 1:1" · "1Yohanes 1:3" → "1Yo 1:3"
  //   (menyisipkan "anes" hanya kalau memang ada)
  function labelAyatDariTeks(teks) {
    let t = String(teks || '').replace(/\s+/g, ' ').trim();
    if (!t) return '';
    if (/1\s*Yohanes/i.test(t)) t = t.replace(/1\s*Yohanes/i, '1Yo');
    else if (/1\s*Yoh/i.test(t)) t = t.replace(/1\s*Yoh/i, '1Yo');
    return t.replace(/\s*:\s*/, ':').trim();
  }
  // ------------------------------------------------------------
  function eksporCatatan() {
    if (kotor) simpan(true);
    const isi = ANodesStore.ekspor();
    const blob = new Blob([isi], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    a.href = url;
    a.download = 'anodes-cadangan-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) +
                 '-' + p(d.getHours()) + p(d.getMinutes()) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast('Cadangan diunduh');
  }

  const fileImpor = document.getElementById('file-impor');
  fileImpor.addEventListener('change', () => {
    const f = fileImpor.files && fileImpor.files[0];
    if (!f) return;
    const baca = new FileReader();
    baca.onload = () => imporBerkas(f, baca);
    baca.onerror = () => { fileImpor.value = ''; toast('Gagal membaca berkas'); };
    baca.readAsText(f);
  });

  // ------------------------------------------------------------
  // PENGATURAN ⚙ (jenis huruf, besar huruf, kecerahan, pintasan)
  // ------------------------------------------------------------
  const modalSet = document.getElementById('modal-setting');
  const setFont = document.getElementById('set-font');
  const setCahaya = document.getElementById('set-cahaya');
  const setJenis = document.getElementById('set-jenis');
  const setTabelPintas = document.getElementById('set-pintas-tabel');
  let rekamAksi = null;

  function isiSetelan() {
    const s = ANodesSetting.ambil();
    setFont.value = s.font;
    setCahaya.value = s.kecerahan;
    setJenis.value = s.jenisFont;
    document.getElementById('set-font-nilai').textContent = s.font + ' px';
    document.getElementById('set-cahaya-nilai').textContent = s.kecerahan + '%';
    gambarPintas();
  }

  function gambarPintas() {
    const s = ANodesSetting.ambil();
    setTabelPintas.innerHTML = '';
    ANodesSetting.URUT.forEach(aksi => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      td1.textContent = ANodesSetting.LABEL[aksi];
      const td2 = document.createElement('td');
      const b = document.createElement('button');
      b.className = 'set-tombol-pintas';
      b.dataset.aksi = aksi;
      b.textContent = s.pintas[aksi] || '(kosong)';
      b.title = 'Klik lalu tekan kombinasi baru';
      td2.appendChild(b);
      tr.appendChild(td1); tr.appendChild(td2);
      setTabelPintas.appendChild(tr);
    });
  }

  function bukaSetting() {
    isiSetelan();
    modalSet.classList.add('buka');
  }
  function tutupSetting() {
    rekamAksi = null;
    document.body.dataset.rekamPintas = '0';
    modalSet.classList.remove('buka');
    gambarPintas();
  }

  document.getElementById('btn-setting').addEventListener('click', bukaSetting);
  document.getElementById('s-tt').addEventListener('click', tutupSetting);
  document.getElementById('s-tutup').addEventListener('click', tutupSetting);

  setFont.addEventListener('input', () => {
    ANodesSetting.set({ font: setFont.value });
    isiSetelan();
  });
  setCahaya.addEventListener('input', () => {
    ANodesSetting.set({ kecerahan: setCahaya.value });
    isiSetelan();
  });
  setJenis.addEventListener('change', () => {
    ANodesSetting.set({ jenisFont: setJenis.value });
    isiSetelan();
  });

  document.getElementById('s-pintas-reset').addEventListener('click', () => {
    ANodesSetting.resetPintas();
    gambarPintas();
    toast('Pintasan dikembalikan ke bawaan');
  });

  // klik tombol pintasan -> mode rekam
  setTabelPintas.addEventListener('click', (e) => {
    const b = e.target.closest('.set-tombol-pintas');
    if (!b) return;
    setTabelPintas.querySelectorAll('.set-tombol-pintas').forEach(x => x.classList.remove('rekam'));
    b.classList.add('rekam');
    b.textContent = 'Tekan tombol...';
    rekamAksi = b.dataset.aksi;
    document.body.dataset.rekamPintas = '1';
  });

  // rekam kombinasi tombol
  document.addEventListener('keydown', (e) => {
    if (!rekamAksi) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'Escape') {
      const aksi = rekamAksi;
      rekamAksi = null;
      document.body.dataset.rekamPintas = '0';
      gambarPintas();
      return;
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      ANodesSetting.setPintas(rekamAksi, '');
      rekamAksi = null;
      document.body.dataset.rekamPintas = '0';
      gambarPintas();
      return;
    }
    const teks = ANodesSetting.keTeksPintas(e);
    if (!teks) {
      const b = setTabelPintas.querySelector('.set-tombol-pintas.rekam');
      if (b) b.textContent = 'Butuh Ctrl/Alt...';
      return;
    }
    ANodesSetting.setPintas(rekamAksi, teks);
    rekamAksi = null;
    document.body.dataset.rekamPintas = '0';
    gambarPintas();
    toast('Pintasan: ' + teks);
  }, true);

  // ------------------------------------------------------------
  // tombol kepala & panel
  // ------------------------------------------------------------
  const menuFile = document.getElementById('menu-file');

  function tutupMenuKepala(kecuali) {
    [menuFile].forEach(m => { if (m && m !== kecuali) m.classList.remove('buka'); });
    [document.getElementById('btn-file'), document.getElementById('btn-cari')]
      .forEach(b => { if (b) b.classList.remove('aktif'); });
  }

  document.getElementById('btn-file').addEventListener('click', (e) => {
    e.stopPropagation();
    const terbuka = menuFile.classList.contains('buka');
    tutupMenuKepala(menuFile);
    menuFile.classList.toggle('buka', !terbuka);
    e.currentTarget.classList.toggle('aktif', !terbuka);
  });

  // 🔍 tombol Cari kepala = pencarian DI DALAM catatan yang sedang dibuka (K29)
  document.getElementById('btn-cari').addEventListener('click', (e) => {
    e.stopPropagation();
    tutupMenuKepala();
    cariIsiBuka();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.grup-kepala')) tutupMenuKepala();
  });

  menuFile.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const aksi = b.dataset.aksi;
    tutupMenuKepala();
    if (aksi === 'open') terapkanDaftar(true);
    else if (aksi === 'baru') baru();
    else if (aksi === 'simpan') simpan(false);
    else if (aksi === 'hapus') hapusAktif();
    else if (aksi === 'impor') fileImpor.click();
    else if (aksi === 'ekspor') eksporCatatan();
    else if (aksi === 'ekspor-md') eksporMD();
    else if (aksi === 'ekspor-txt') eksporTXT();
    else if (aksi === 'ekspor-pdf') eksporPDF();
    else if (aksi === 'sinkron') bukaSinkron();
  });

  function hapusAktif() {
    const c = ANodesStore.ambil(aktif);
    if (c) hapus(c.id, c.judul);
    else toast('Tidak ada catatan yang dibuka');
  }

  // ------------------------------------------------------------
  // ☁️ K77 — Sinkron PC ⇄ HP (lewat Cloudflare Worker + Turso)
  // ------------------------------------------------------------
  function bukaSinkron() {
    const S = window.ANodesSinkron;
    const modal = document.getElementById('modal-sinkron');
    if (!modal) return;
    if (!S) { toast('⚠️ Modul sinkron belum termuat'); return; }

    /* ⚠️ K77d (1 Nov 2026) — kolom “Alamat Worker” & “Kunci aplikasi” DIHAPUS
       dari modal. Alamat + kunci sudah DITANAM di `js/sinkron.js` (`BAWAAN`),
       jadi pengguna tidak perlu melihat/mengisinya lagi.
       Kolom boleh tidak ada ⇒ semua akses WAJIB lewat penjaga `if (el)`. */
    const elOtomatis = document.getElementById('sk-otomatis');
    const elStatus = document.getElementById('sk-status');

    const s = S.setel();
    if (elOtomatis) elOtomatis.value = s.otomatis ? '1' : '0';

    const t = S.terakhir();
    if (elStatus) elStatus.textContent = t.pesan
      ? (t.ok ? '✅ ' : '⚠️ ') + t.pesan
      : (S.siap()
          ? '✅ Sudah tersambung — tekan “Sinkron sekarang”.'
          : '⚠️ Sambungan belum siap — periksa internet.');

    // ⚠️ modal ANodes dibuka lewat kelas `.buka` (bukan atribut `hidden`)
    modal.classList.add('buka');
    setTimeout(() => { if (elOtomatis) elOtomatis.focus(); }, 60);
  }

  function tutupSinkron() {
    const modal = document.getElementById('modal-sinkron');
    if (modal) modal.classList.remove('buka');
  }

  function simpanSetelSinkron() {
    const S = window.ANodesSinkron;
    if (!S) return null;
    /* K77d: kolom alamat & kunci sudah dihapus dari modal ⇒ pakai nilai yang
       sedang berlaku (dari `BAWAAN` / localStorage), jangan dibaca dari DOM. */
    const kini = S.setel();
    const elOtomatis = document.getElementById('sk-otomatis');
    const s = S.simpanSetel({
      alamat: kini.alamat,
      kunci: kini.kunci,
      otomatis: elOtomatis ? elOtomatis.value === '1' : kini.otomatis
    });
    S.hentikanOtomatis();
    S.mulaiOtomatis();
    return s;
  }

  (function pasangSinkron() {
    const modal = document.getElementById('modal-sinkron');
    if (!modal) return;
    const elStatus = document.getElementById('sk-status');

    document.getElementById('sk-tt').addEventListener('click', tutupSinkron);
    document.getElementById('sk-tutup').addEventListener('click', tutupSinkron);
    modal.addEventListener('click', (e) => { if (e.target === modal) tutupSinkron(); });

    /* K77d: hanya “Sinkron otomatis” yang tersisa di modal.
       Kolom alamat & kunci DIHAPUS (nilainya sudah ditanam di `BAWAAN`). */
    const elOtomatis = document.getElementById('sk-otomatis');
    if (elOtomatis) {
      const simpan = () => {
        const s = simpanSetelSinkron();
        if (s && elStatus) elStatus.textContent = s.otomatis
          ? '✅ Sinkron otomatis: YA — data dikirim tiap kali menyimpan.'
          : '✅ Sinkron otomatis: TIDAK — hanya lewat tombol.';
      };
      elOtomatis.addEventListener('input', simpan);
      elOtomatis.addEventListener('change', simpan);
    }

    document.getElementById('sk-uji').addEventListener('click', async () => {
      simpanSetelSinkron();
      elStatus.textContent = '⏳ Menguji sambungan…';
      const h = await window.ANodesSinkron.uji();
      elStatus.textContent = (h.ok ? '✅ ' : '⚠️ ') + h.pesan;
    });

    document.getElementById('sk-sekarang').addEventListener('click', async () => {
      simpanSetelSinkron();
      elStatus.textContent = '⏳ Menyinkronkan…';
      const h = await window.ANodesSinkron.sekarang();
      elStatus.textContent = (h.ok ? '✅ ' : '⚠️ ') + h.pesan;
      if (h.ok) {
        // muat ulang tampilan supaya catatan hasil sinkron langsung terlihat
        try {
          const idAktif = ANodesStore.aktifId();
          const c = ANodesStore.ambil(idAktif);
          if (c) tampilkan(c);
          renderDaftar();
        } catch (e) {}
      }
    });
  })();

  document.getElementById('btn-tutup-daftar').addEventListener('click', () => terapkanDaftar(false));

  // 📖 tombol “Rapi” di bar info (16 Sep 2026) — lihat terapkanRapi()
  if (btnRapi) btnRapi.addEventListener('click', () => terapkanRapi(!modeRapi));

  window.addEventListener('beforeunload', () => { if (kotor) simpan(true); });

  // HP: simpan juga saat pindah tab / aplikasi ke belakang
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && kotor) simpan(true);
  });

  // ------------------------------------------------------------
  // K20 · PAKET AYAT — kirim dari halaman Alkitab ke catatan
  // ------------------------------------------------------------
  // Alur (sesuai keputusan user 14 Sep 2026):
  //   1. Di halaman Alkitab user memilih ayat → tekan [📋 Simpan]
  //      → tampilan Alkitab memanggil ANodesEditor.terimaPaket({teks, html}).
  //   2. Baris ke-2 berganti: toolbar tulis → BAR PAKET.
  //      (yang memutuskan = ANodesPlugin.terapkanBar() — SATU pengatur saja)
  //   3. User klik di catatan tempat yang dia mau → tekan [Tempel ⇩].
  //      Paket masuk lewat perintah bawaan browser (bisa dibatalkan).
  //   4. Salah tempat? [↶ Batalkan] mengangkat paket kembali → klik tempat lain.
  //      Sudah pas? [❌ Selesai] → baris ke-2 kembali jadi toolbar tulis.
  let paket = null;            // { teks, nama }
  let paketTerpasang = false;  // sudah ditempel ke catatan?
  let elemenPaket = null;      // <div class="paket-ayat"> yang sedang ditempel

  const barPaketEl = () => document.getElementById('toolbar-paket');

  // gambar isi bar paket: 'siap' (menunggu ditempel) / 'tertempel'
  function gambarBarPaket(jenis) {
    const lbl    = document.getElementById('bp-lbl');
    const tempel = document.getElementById('bp-tempel');
    const ulang  = document.getElementById('bp-ulang');
    const buang  = document.getElementById('bp-buang');
    if (lbl) lbl.textContent = paket ? ('📋 ' + paket.nama) : '📋 —';
    if (tempel) tempel.hidden = (jenis !== 'siap');
    if (ulang)  ulang.hidden  = (jenis !== 'tertempel');
    if (buang)  buang.textContent = (jenis === 'tertempel') ? '❌ Selesai' : '❌ Buang';
    gambarOpsiPaket();
  }

  // ------------------------------------------------------------
  // K40 (17 Sep 2026) — PILIHAN BENTUK MASUKAN (seperti K20)
  //   Bapak memilih: “Ada pilihan seperti K20: [💬 Kalimat hidup/mati] +
  //   [panjang ⇄ singkat]”. Pilihannya diingat (localStorage).
  //   ⚠️ Mengubah pilihan → paket disusun ULANG dari sumbernya.
  // ------------------------------------------------------------
  const KUNCI_OPSI_PAKET = 'anodes-insert-ayat';
  let opsiPaketCatatan = { kalimat: false, panjang: false };
  try {
    const simpanOpsi = JSON.parse(localStorage.getItem(KUNCI_OPSI_PAKET) || 'null');
    if (simpanOpsi) opsiPaketCatatan = Object.assign(opsiPaketCatatan, simpanOpsi);
  } catch (e) {}

  // sumber paket (supaya bisa disusun ulang saat pilihan berubah)
  let sumberPaket = null;      // { jenis:'rantai', id } atau { jenis:'alkitab' }

  function simpanOpsiPaket() {
    try { localStorage.setItem(KUNCI_OPSI_PAKET, JSON.stringify(opsiPaketCatatan)); } catch (e) {}
  }

  function gambarOpsiPaket() {
    const bKal = document.getElementById('bp-kalimat');
    const bFmt = document.getElementById('bp-format');
    if (bKal) {
      bKal.classList.toggle('hidup', !!opsiPaketCatatan.kalimat);
      bKal.title = opsiPaketCatatan.kalimat
        ? 'Kalimat ayat IKUT dimasukkan — klik untuk mematikan'
        : 'Kalimat ayat tidak ikut — klik untuk menghidupkan';
    }
    if (bFmt) {
      bFmt.textContent = opsiPaketCatatan.panjang ? 'Panjang' : 'Singkat';
      bFmt.title = 'Bentuk nama ayat: ' + (opsiPaketCatatan.panjang
        ? 'PANJANG (mis. Roma 4:3) — klik untuk jadi singkat'
        : 'SINGKAT (mis. Rom 4:3) — klik untuk jadi panjang');
    }
  }

  // susun ulang paket dari sumbernya (dipakai saat pilihan bentuk berubah)
  function susunUlangPaket() {
    if (!sumberPaket) return false;
    const k = window.ANodesAyatTerkaitKerja;
    if (sumberPaket.jenis === 'rantai' && k && k.susunDariSimpanan) {
      const p = k.susunDariSimpanan(sumberPaket.id, opsiPaketCatatan);
      if (!p) return false;
      paket = { teks: p.teks, nama: p.nama };
      gambarBarPaket(paketTerpasang ? 'tertempel' : 'siap');
      return true;
    }
    return false;
  }

  function kaitOpsiPaket() {
    const bKal = document.getElementById('bp-kalimat');
    const bFmt = document.getElementById('bp-format');
    if (bKal && !bKal.dataset.siapOpsi) {
      bKal.dataset.siapOpsi = '1';
      bKal.addEventListener('click', () => {
        opsiPaketCatatan.kalimat = !opsiPaketCatatan.kalimat;
        simpanOpsiPaket();
        gambarOpsiPaket();
        susunUlangPaket();
      });
    }
    if (bFmt && !bFmt.dataset.siapOpsi) {
      bFmt.dataset.siapOpsi = '1';
      bFmt.addEventListener('click', () => {
        opsiPaketCatatan.panjang = !opsiPaketCatatan.panjang;
        simpanOpsiPaket();
        gambarOpsiPaket();
        susunUlangPaket();
      });
    }
  }

  // terima paket baru dari plugin Alkitab
  function terimaPaket(opsi) {
    if (!opsi || !opsi.teks) return false;
    paket = { teks: opsi.teks, nama: opsi.nama || opsi.teks.split('\n')[0] };
    paketTerpasang = false;
    elemenPaket = null;
    // K40 — ingat sumbernya supaya pilihan bentuk bisa menyusun ulang
    sumberPaket = opsi.sumber || null;
    kaitOpsiPaket();
    // baris ke-2 berganti jadi bar paket (toolbar tulis disembunyikan)
    if (ANodesPlugin && ANodesPlugin.paket) ANodesPlugin.paket(true);
    gambarBarPaket('siap');
    segarkanTombolInsert();          // K40 — tombol [ + Ayat ] di bar info
    return true;
  }

  // ------------------------------------------------------------
  // K40 (17 Sep 2026) — TOMBOL [ + Ayat ] DI BAR INFO CATATAN
  //   Bapak: *“di pages catatan .. user tentukan letak yg dia mau untuk di insert
  //   ayat terkait .. setelah ditentukan klik di menu [insert]”*
  //   ⇒ tombol muncul HANYA saat ada rantai dipegang (keputusan Bapak).
  //     Menempelnya memakai jalur K20 yang sudah ada (tempelPaket).
  // ------------------------------------------------------------
  const btnInsert = document.getElementById('info-insert');

  function segarkanTombolInsert() {
    if (!btnInsert) return;
    const ada = !!paket && !paketTerpasang;
    btnInsert.hidden = !ada;
    if (ada) {
      btnInsert.title = 'Masukkan “' + paket.nama + '” di tempat kursor ' +
        '(klik dulu di catatan) — ' + paket.teks.split('\n').length + ' baris';
    }
  }

  if (btnInsert && !btnInsert.dataset.siapInsert) {
    btnInsert.dataset.siapInsert = '1';
    btnInsert.addEventListener('click', () => {
      if (!paket) { pesanKecil('⚠️ Belum ada ayat yang dipegang'); return; }
      if (paketTerpasang) { pesanKecil('Ayat sudah dimasukkan — tekan [❌ Selesai]'); return; }
      tempelPaket();
    });
  }

  // ------------------------------------------------------------
  // 🆕 K70 (5 Okt 2026) — tombol 🔗 ON/OFF penandaan catatan
  //   Ditaruh di BAR INFO (ruang lega; kepala sudah penuh — sudah diukur).
  //   Bawaan OFF supaya mengetik tanpa lag.
  // ------------------------------------------------------------
  const btnTandai = document.getElementById('info-tandai');
  if (btnTandai && !btnTandai.dataset.siapTandai) {
    btnTandai.dataset.siapTandai = '1';
    btnTandai.addEventListener('click', () => setTandaiCatatan(!tandaiCatatan.hidup));
  }
  muatTandaiCatatan();
  segarkanTombolTandai();

  // apakah kursor sedang berada di dalam editor?
  function kursorDiEditor() {
    const s = window.getSelection();
    if (!s || !s.rangeCount) return false;
    const r = s.getRangeAt(0);
    return editor.contains(r.startContainer);
  }

  // samakan tampilan bar paket dengan isi catatan
  //   dipakai saat tempelan dibatalkan/dikembalikan dengan ↶ / ↷
  function syncBarPaket() {
    if (!paket) return;
    const masihAda = !!editor.querySelector('div.paket-ayat');
    if (paketTerpasang === masihAda) return;   // sudah sama, tidak perlu apa-apa
    paketTerpasang = masihAda;
    if (masihAda) {
      const semua = editor.querySelectorAll('div.paket-ayat');
      elemenPaket = semua.length ? semua[semua.length - 1] : null;
      gambarBarPaket('tertempel');
    } else {
      elemenPaket = null;
      gambarBarPaket('siap');
    }
  }

  // tempelkan paket di tempat kursor
  function tempelPaket() {
    if (!paket || paketTerpasang) return false;
    // kalau halaman Alkitab masih terbuka, balik dulu ke catatan
    const baca = document.getElementById('baca-alkitab');
    const utama = document.getElementById('app-utama');
    if (baca) baca.hidden = true;
    if (utama) utama.hidden = false;

    // ⚠️ CARA MENEMPEL — jangan diganti tanpa alasan (sudah diuji 14 Sep 2026):
    //    ❌ `execCommand('insertHTML')` TIDAK dipakai. Sudah dicoba: perintah itu
    //       SELALU memecah pembungkus (<span>/<div>/<p>) supaya dokumen tetap
    //       sah, jadi penanda “paket” tidak bisa dipertahankan. Akibatnya isi
    //       paket terbelah dan tidak bisa dibuang bersama.
    //    ✅ Pakai DOM sendiri: paragraf paket disisipkan SETELAH baris tempat
    //       kursor (atau menggantikan baris kosong). Lalu keadaannya dicatat ke
    //       riwayat tulisan (`catatRiwayat`) → tombol ↶ / Ctrl+Z benar-benar
    //       bisa membatalkannya.
    const baris = paket.teks.split('\n').filter(x => x.length);
    const sel = window.getSelection();

    // cari baris (blok) tempat kursor berada
    let blok = null;
    if (sel && sel.rangeCount) {
      const r = sel.getRangeAt(0);
      if (editor.contains(r.startContainer)) {
        let n = r.startContainer;
        while (n && n.parentNode && n.parentNode !== editor) n = n.parentNode;
        if (n && n.parentNode === editor) blok = n;
      }
    }

    const bungkus = document.createElement('div');
    bungkus.className = 'paket-ayat paket-sorot';
    bungkus.setAttribute('data-paket', '1');
    baris.forEach(t => {
      const p = document.createElement('p');
      p.textContent = t;
      bungkus.appendChild(p);
    });

    if (blok && !blok.textContent.trim()) blok.replaceWith(bungkus);          // baris kosong → dipakai
    else if (blok) blok.parentNode.insertBefore(bungkus, blok.nextSibling);   // di bawah baris itu
    else editor.appendChild(bungkus);                                        // tanpa kursor → paling bawah

    // taruh kursor di akhir paket
    const r2 = document.createRange();
    r2.selectNodeContents(bungkus);
    r2.collapse(false);
    if (sel) { sel.removeAllRanges(); sel.addRange(r2); }

    elemenPaket = bungkus;
    paketTerpasang = true;

    // catat ke riwayat supaya ↶ / Ctrl+Z bisa membatalkan tempelan ini
    catatRiwayat();

    setTimeout(() => { if (elemenPaket) elemenPaket.classList.remove('paket-sorot'); }, 4000);
    setTimeout(() => {
      try { bungkus.scrollIntoView({ block: 'center' }); } catch (e) {}
    }, 30);

    autoSimpan();
    gambarBarPaket('tertempel');
    segarkanTombolInsert();          // K40 — tombol bar info ikut menyesuaikan
    return true;
  }

  // angkat kembali paket yang sudah ditempel (untuk dicari tempat yang lebih tepat)
  function angkatPaket() {
    if (!paketTerpasang || !elemenPaket) return false;
    elemenPaket.remove();
    editor.normalize();
    elemenPaket = null;
    paketTerpasang = false;
    catatRiwayat();
    autoSimpan();
    gambarBarPaket('siap');
    segarkanTombolInsert();          // K40 — tombol bar info muncul lagi
    return true;
  }

  // buang paket (belum ditempel) / tandai selesai (sudah ditempel)
  function buangPaket() {
    paket = null;
    paketTerpasang = false;
    elemenPaket = null;
    // baris ke-2 kembali seperti semula (toolbar tulis)
    if (ANodesPlugin && ANodesPlugin.paket) ANodesPlugin.paket(false);
    gambarBarPaket('siap');
    segarkanTombolInsert();          // K40 — tombol bar info ikut hilang
    return true;
  }

  // ------------------------------------------------------------
  // kenangan tempat (supaya 🏠 kembali PERSIS ke tempat tadi diklik)
  // ------------------------------------------------------------
  // Posisi kursor dihitung sebagai JUMLAH HURUF (cara yang sama dipakai
  // plugin Alkitab) — bukan dari node, supaya tahan terhadap perubahan DOM
  // (penanda tautan ayat dibangun ulang saat catatan dibuka).
  let kenang = null;    // { id, offset, gulir }

  function posisiKursor() {
    const s = window.getSelection();
    if (!s || !s.rangeCount) return null;
    const r = s.getRangeAt(0);
    if (!editor.contains(r.startContainer)) return null;
    const h = document.createRange();
    h.selectNodeContents(editor);
    try { h.setEnd(r.startContainer, r.startOffset); } catch (e) { return null; }
    return h.toString().length;
  }

  // taruh kursor dari jumlah huruf (offset null = paling bawah)
  function taruhKursor(offset) {
    const r = document.createRange();
    if (typeof offset !== 'number') {
      r.selectNodeContents(editor);
      r.collapse(false);
    } else {
      const jalan = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null);
      let sisa = offset, n = jalan.nextNode(), pasang = false;
      while (n) {
        const panjang = n.textContent.length;
        if (sisa <= panjang) { r.setStart(n, sisa); r.collapse(true); pasang = true; break; }
        sisa -= panjang;
        n = jalan.nextNode();
      }
      if (!pasang) { r.selectNodeContents(editor); r.collapse(false); }
    }
    const s = window.getSelection();
    if (s) { s.removeAllRanges(); s.addRange(r); }
  }

  function ingatPosisi() {
    kenang = { id: aktif, offset: posisiKursor(), gulir: editor.scrollTop };
    return kenang;
  }

  // kembali ke catatan: pulihkan kenangan tempat (kalau tidak ada → paling bawah)
  function pulihPosisi() {
    const utama = document.getElementById('app-utama');
    const baca  = document.getElementById('baca-alkitab');
    if (baca) baca.hidden = true;
    if (utama) utama.hidden = false;

    // kalau catatannya berganti, buka lagi catatan yang tadi
    if (kenang && kenang.id && kenang.id !== aktif) {
      const c = ANodesStore.ambil(kenang.id);
      if (c) { ANodesStore.setAktif(kenang.id); tampilkan(c); }
    }
    editor.focus();
    if (kenang && typeof kenang.offset === 'number') {
      taruhKursor(kenang.offset);
      editor.scrollTop = kenang.gulir || 0;
      kenang = null;
      return true;
    }
    taruhKursor(null);   // tanpa kenangan → kursor di paling bawah
    kenang = null;
    return false;
  }

  // pengait tombol bar paket
  const bpEl = barPaketEl();
  if (bpEl) {
    // supaya kursor di catatan tidak hilang saat tombol bar diklik
    bpEl.addEventListener('mousedown', (e) => { if (e.target.closest('button')) e.preventDefault(); });
    bpEl.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.id === 'bp-tempel') tempelPaket();
      else if (b.id === 'bp-ulang') angkatPaket();
      else if (b.id === 'bp-buang') buangPaket();
    });
  }

  // pintu masuk untuk plugin (mis. plugin/alkitab/tampilan.js)
  window.ANodesEditor = {
    terimaPaket,
    tempelPaket,
    angkatPaket,
    paketBuang: buangPaket,
    ingatPosisi,
    pulihPosisi,
    // 🔍 cari di catatan (K29) — dipakai alat uji & berkas lain
    cariIsiBuka,
    cariIsiTutup,
    cariIsiMulai,
    cariIsiLompat,
    bersihTandaCari,
    // ⤓⤒ impor/ekspor (K30) — dipakai alat uji
    eksporMD, eksporTXT, eksporPDF, keHtmlImpor, isiTeksBiasa,
    // 🆕 K49 (20 Sep 2026) — berkas/tempelan yang isinya HTML
    isiHtml, htmlKeMarkdownImpor,
    // 📖 mode baca / rapi (16 Sep 2026) — dipakai alat uji
    terapkanRapi, htmlKeMarkdown, pantasRapi, segarkanTombolRapi,
    // K44 — tempel naskah → masuk rapi (dipakai alat uji)
    rapikanNaskah, naskahBergaya, hiaskanNaskah, bersihSemuaTanda,
    // 🆕 K45 i (23 Sep 2026) — sambungan resmi plugin 🖊 Penguat di catatan
    tambahPenghiasTanda, lepasPenghiasTanda, jalanPenghiasTanda,
    // 🆕 K45 i — dipakai plugin 🖊 supaya tanda di catatan digambar ulang
    //   (plugin tidak perlu tahu cara menandai ayat/istilah)
    segarkanTanda: () => tandaiSemuaTanda(0),
    // 🆕 K70 (5 Okt 2026) — 🔌 pintu ON/OFF penandaan catatan
    //   dipakai: (a) tombol `🔗 ON/OFF` di bar info, (b) plugin Alkitab &
    //   Kamus supaya penandaan SUSULAN (saat mengetik/fokus) ikut berhenti,
    //   (c) alat uji.
    catatanDitandai,
    setTandaiCatatan,
    segarkanTombolTandai,
    bersihkanTandaCatatan,
    KUNCI_TANDAI,
    // 📥 K40 — tombol [ + Ayat ] di bar info
    segarkanTombolInsert,
    // 🔄 K41 — simpan catatan SEKARANG (dipakai sebelum halaman dimuat ulang)
    simpanSekarang: () => simpan(false),
    // ☁️ K77 — sinkron PC ⇄ HP (dipakai alat uji & berkas lain)
    toast,
    bukaSinkron,
    tutupSinkron,
    // 🆕 K77i (1 Nov 2026) — gambar ulang catatan sesudah sinkron masuk
    muatUlangCatatan,
    get modeRapi() { return modeRapi; },
    get cariIsi() { return cariIsi; },
    get adaPaket() { return !!paket; },
    get paketTerpasang() { return paketTerpasang; },
    get paketTeks() { return paket ? paket.nama : null; }
  };

  /* ------------------------------------------------------------
     K77i (1 Nov 2026) — TAMPILAN IKUT SEGAR SESUDAH SINKRON MASUK
     ------------------------------------------------------------
     ⚠️ CACAT YANG DIPERBAIKI: `js/sinkron.js → ambil()` sudah menulis hasil
     gabung ke localStorage dan mengirim event `anodes-sinkron-masuk`, TETAPI
     TIDAK ADA yang mendengarkan. Terukur di APK: localStorage berisi 1 catatan
     asli ("Melakukan lebih dari diminta…"), layar tetap menampilkan catatan
     contoh "Selamat datang di ANodes" ⇒ pengguna mengira sinkron GAGAL,
     padahal datanya sudah masuk. Catatan baru hanya muncul setelah app dibuka ulang.

     Aturan: JANGAN menyegarkan kalau pengguna sedang mengetik (`kotor`) —
     simpan dulu, baru gambar ulang, supaya tulisan tidak hilang.
     ------------------------------------------------------------ */
  function muatUlangCatatan() {
    if (kotor) simpan(true);
    // ⚠️ WAJIB: ANodesStore menyimpan salinan di MEMORI (`let data`).
    //    Tanpa muatUlang(), localStorage yang baru ditulis sinkron tidak terbaca.
    if (typeof ANodesStore.muatUlang === 'function') ANodesStore.muatUlang();
    let id = ANodesStore.aktifId();
    if (!ANodesStore.ambil(id)) {
      const semua = ANodesStore.daftar();
      if (!semua.length) return;
      id = semua[0].id;
      ANodesStore.setAktif(id);
    }
    aktif = id;
    tampilkan(ANodesStore.ambil(id));
  }

  window.addEventListener('anodes-sinkron-masuk', () => {
    try { muatUlangCatatan(); } catch (e) {}
  });

  // ------------------------------------------------------------
  // start
  // ------------------------------------------------------------
  ANodesSetting.terapkan();     // ukuran huruf + kecerahan
  muatTampilan();
  isiKategori();

  // kalau belum ada catatan sama sekali, buatkan satu supaya bisa langsung tulis
  if (!ANodesStore.ambil(aktif)) {
    if (!ANodesStore.daftar().length) ANodesStore.baru();
    ANodesStore.setAktif(ANodesStore.daftar()[0].id);
    aktif = ANodesStore.aktifId();
  }
  tampilkan(ANodesStore.ambil(aktif));
})();
