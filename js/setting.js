/* ============================================================
   ANodes — js/setting.js
   Pengaturan aplikasi + pintasan keyboard (bisa dikustom user).
   Semua tersimpan di localStorage (kunci `anodes-setting-v1`).
   ============================================================ */

const ANodesSetting = (() => {
  'use strict';

  const KUNCI = 'anodes-setting-v1';

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


  // --- nilai bawaan ---
  const BAWAAN = {
    font: 16,            // ukuran huruf (px) 12-24
    kecerahan: 100,      // kecerahan layar (%) 50-100
    jenisFont: 'system', // system | serif | mono | rounded
    // pintasan keyboard (bisa diganti user)
    pintas: {
      h1: 'Ctrl+1',
      h2: 'Ctrl+2',
      h3: 'Ctrl+3',
      p: 'Ctrl+0',
      bullet: 'Ctrl+Shift+8',
      number: 'Ctrl+Shift+7',
      icon: 'Ctrl+Shift+9',
      bold: 'Ctrl+B',
      italic: 'Ctrl+I'
    }
  };

  let data = JSON.parse(JSON.stringify(BAWAAN));

  // label yang tampil di daftar pintasan
  const LABEL = {
    h1: 'Judul H1', h2: 'Judul H2', h3: 'Judul H3', p: 'Teks biasa (¶)',
    bullet: 'Daftar titik', number: 'Daftar nomor', icon: 'Daftar icon',
    bold: 'Tebal (Bold)', italic: 'Miring (Italic)'
  };

  const URUT = ['h1', 'h2', 'h3', 'p', 'bullet', 'number', 'icon', 'bold', 'italic'];

  function tulis() {
    try { localStorage.setItem(kunciData(), JSON.stringify(data)); return true; }
    catch (e) { console.warn('ANodes: gagal simpan pengaturan', e); return false; }
  }

  function muat() {
    let mentah = null;
    try { mentah = localStorage.getItem(kunciData()); } catch (e) {}
    if (mentah) {
      try {
        const d = JSON.parse(mentah);
        data = {
          font: angka(d.font, 12, 24, BAWAAN.font),
          kecerahan: angka(d.kecerahan, 50, 100, BAWAAN.kecerahan),
          jenisFont: (d.jenisFont && d.jenisFont !== '') ? d.jenisFont : BAWAAN.jenisFont,
          pintas: Object.assign({}, BAWAAN.pintas, d.pintas || {})
        };
      } catch (e) { /* rusak -> pakai bawaan */ }
    }
    tulis();
  }

  function angka(v, min, max, bawa) {
    const n = parseInt(v, 10);
    if (isNaN(n)) return bawa;
    return Math.max(min, Math.min(max, n));
  }

  muat();

  // ------------------------------------------------------------
  // terapkan ke tampilan
  // ------------------------------------------------------------
  const KELUARGA = {
    system:  'system-ui, -apple-system, "Segoe UI", sans-serif',
    serif:   'Georgia, "Times New Roman", serif',
    mono:    'Consolas, "Courier New", monospace',
    rounded: '"Segoe UI", "Trebuchet MS", Verdana, sans-serif'
  };

  function terapkan() {
    const r = document.documentElement;
    r.style.setProperty('--font-isi', data.font + 'px');
    r.style.setProperty('--font-jenis', KELUARGA[data.jenisFont] || KELUARGA.system);
    // skala = angka polos (16px = 1).  Dipakai CSS untuk ukuran tombol/panel.
    r.style.setProperty('--skala', String((data.font / 16).toFixed(3)));
    // kecerahan: lapisan gelap transparan menutup layar
    let lapis = document.getElementById('lapis-cahaya');
    if (!lapis) {
      lapis = document.createElement('div');
      lapis.id = 'lapis-cahaya';
      document.body.appendChild(lapis);
    }
    const gelap = (100 - data.kecerahan) / 100;
    lapis.style.background = 'rgba(0,0,0,' + gelap.toFixed(2) + ')';
    lapis.style.display = data.kecerahan >= 100 ? 'none' : 'block';

        /* 🔴 K69f (5 Okt 2026) — beri tahu bagian lain bahwa pengaturan berubah.
           Sebab: ukuran huruf di CSS (`calc(Npx * var(--skala))`) ikut sendiri,
           tetapi **ukuran yang dipasang lewat JS** (mis. nama peta di SVG)
           tidak ⇒ peta perlu digambar ulang saat ukuran huruf diganti. */
        try {
          document.dispatchEvent(new CustomEvent('anodes-setting-berubah', { detail: { font: data.font } }));
        } catch (e) {}
      }

  // ------------------------------------------------------------
  // cocokkan pintasan ("Ctrl+Shift+8") dengan event keyboard
  // ------------------------------------------------------------
  function cocokPintas(pintas, e) {
    if (!pintas) return false;
    const bagian = pintas.split('+').map(s => s.trim().toLowerCase()).filter(Boolean);
    const perlu = { ctrl: false, shift: false, alt: false, meta: false, kunci: null };
    bagian.forEach(b => {
      if (b === 'ctrl' || b === 'control') perlu.ctrl = true;
      else if (b === 'shift') perlu.shift = true;
      else if (b === 'alt') perlu.alt = true;
      else if (b === 'meta' || b === 'cmd') perlu.meta = true;
      else perlu.kunci = b;
    });
    if (!perlu.kunci) return false;
    const eKey = (e.key || '').toLowerCase();
    const kunciSama =
      eKey === perlu.kunci ||
      (perlu.kunci === 'space' && eKey === ' ') ||
      (perlu.kunci.length === 1 && eKey === perlu.kunci);
    if (!kunciSama) return false;
    return e.ctrlKey === perlu.ctrl &&
           e.shiftKey === perlu.shift &&
           e.altKey === perlu.alt &&
           e.metaKey === perlu.meta;
  }

  /** cari aksi yang cocok dengan event (atau null) */
  function aksiUntuk(e) {
    for (const k of URUT) {
      if (data.pintas[k] && cocokPintas(data.pintas[k], e)) return k;
    }
    return null;
  }

  // ------------------------------------------------------------
  // NAMA TOMBOL untuk TAMPILAN saja (mis. bagian cetak biru).
  // PINTAS TETAP yang juga bisa memakai nama sendiri:
  //   Ctrl+Z  = batal tulis (undo)
  //   Ctrl+Y / Ctrl+Shift+Z = ulangi (redo)
  //   Batal (Esc) pada bilah tulis.
  // Ini TIDAK ditampilkan di daftar "Pintasan keyboard" biasa karena
  // namanya terlalu panjang; tetap bekerja walau tidak bisa dimatikan.
  // ------------------------------------------------------------

  // ubah event keyboard jadi teks pintasan (untuk tombol "rekam")
  function keTeksPintas(e) {
    const tombol = [];
    if (e.ctrlKey) tombol.push('Ctrl');
    if (e.shiftKey) tombol.push('Shift');
    if (e.altKey) tombol.push('Alt');
    if (e.metaKey) tombol.push('Meta');

    let k = e.key || '';
    // saat user menekan 'Alt+1', laporan pertama bisa hanya 'Alt' (keydown Alt).
    // Kalau belum ada huruf/angka, tunggu tombol berikutnya.
    if (k === 'Control' || k === 'Shift' || k === 'Alt' || k === 'Meta' ||
        k === 'AltGraph' || k === 'CapsLock' || k === 'OS') {
      return '';    // belum lengkap
    }
    if (!tombol.length) return '';   // wajib ada Ctrl/Alt/Meta
    if (k === ' ') k = 'Space';
    if (k.length === 1) k = k.toUpperCase();
    tombol.push(k);
    return tombol.join('+');
  }

  // ------------------------------------------------------------
  return {
    LABEL,
    URUT,
    ambil() { return data; },
    set(ubah) {
      Object.assign(data, ubah);
      data.font = angka(data.font, 12, 24, BAWAAN.font);
      data.kecerahan = angka(data.kecerahan, 50, 100, BAWAAN.kecerahan);
      tulis(); terapkan();
    },
    setPintas(aksi, teks) {
      if (!aksi) return;
      data.pintas[aksi] = teks || '';
      tulis();
    },
    resetPintas() {
      data.pintas = JSON.parse(JSON.stringify(BAWAAN.pintas));
      tulis();
    },
    terapkan,
    aksiUntuk,
    keTeksPintas
  };
})();

// supaya bisa dipanggil dari berkas lain (mis. plugin)
window.ANodesSetting = ANodesSetting;
