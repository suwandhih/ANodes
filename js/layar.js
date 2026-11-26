/* ============================================================
   js/layar.js — K79 (28 Okt 2026)
   RUANG AMAN LAYAR (safe area) + deteksi layar sentuh.

   MASALAH YANG DIPERBAIKI
   -----------------------
   Di HP ber-lubang kamera (mis. Samsung Z Fold 3), kepala aplikasi
   duduk TEPAT di bawah kamera sehingga sulit disentuh. Sebabnya:
   `targetSdk 37` (Android 15+) memaksa WebView tampil edge-to-edge,
   sedangkan CSS ANodes tidak punya `env(safe-area-inset-*)`.

   CARA KERJA
   ----------
   1. Baca `env(safe-area-inset-top)` / `-bottom` lewat elemen ukur.
   2. Kalau hasilnya 0 (WebView lama tidak melaporkan), pakai jembatan
      Android `ANodesAndroid.insetAtas()` — angka px dari WindowInsets.
   3. Tulis hasilnya ke `--sa-top` / `--sa-bottom` di <html>.
      `.app` memakai variabel itu sebagai padding (lihat css/base.css).

   ⚠️ Di PC hasilnya 0px ⇒ tampilan TIDAK berubah sama sekali.
   ============================================================ */
(function () {
  'use strict';

  const AKAR = document.documentElement;

  /* elemen ukur tersembunyi — satu-satunya cara membaca env() dari JS */
  let pengukur = null;
  function siapkanPengukur() {
    if (pengukur && pengukur.isConnected) return pengukur;
    pengukur = document.createElement('div');
    pengukur.setAttribute('aria-hidden', 'true');
    pengukur.style.cssText =
      'position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;' +
      'padding-top:env(safe-area-inset-top,0px);' +
      'padding-bottom:env(safe-area-inset-bottom,0px);';
    document.body.appendChild(pengukur);
    return pengukur;
  }

  function bacaEnv() {
    const el = siapkanPengukur();
    const g = getComputedStyle(el);
    return {
      atas: parseFloat(g.paddingTop) || 0,
      bawah: parseFloat(g.paddingBottom) || 0
    };
  }

  /* jembatan Android — hanya ada di dalam APK WebView */
  function bacaAndroid() {
    try {
      const j = window.ANodesAndroid;
      if (!j) return null;
      const atas = typeof j.insetAtas === 'function' ? Number(j.insetAtas()) : NaN;
      const bawah = typeof j.insetBawah === 'function' ? Number(j.insetBawah()) : NaN;
      if (!isFinite(atas) && !isFinite(bawah)) return null;
      return {
        atas: isFinite(atas) ? Math.max(0, atas) : 0,
        bawah: isFinite(bawah) ? Math.max(0, bawah) : 0
      };
    } catch (e) {
      return null;
    }
  }

  let terakhir = { atas: -1, bawah: -1 };

  function terapkan(paksa) {
    const env = bacaEnv();
    const and = bacaAndroid();

    /* env() menang kalau memang melaporkan angka; kalau 0, pakai jembatan Android */
    let atas = env.atas > 0 ? env.atas : (and ? and.atas : 0);
    let bawah = env.bawah > 0 ? env.bawah : (and ? and.bawah : 0);

    /* pembulatan 0,5px supaya tidak “bergetar” karena pecahan */
    atas = Math.round(atas * 2) / 2;
    bawah = Math.round(bawah * 2) / 2;

    if (!paksa && atas === terakhir.atas && bawah === terakhir.bawah) return terakhir;
    terakhir = { atas: atas, bawah: bawah };

    AKAR.style.setProperty('--sa-top', atas + 'px');
    AKAR.style.setProperty('--sa-bottom', bawah + 'px');
    AKAR.dataset.saAtas = String(atas);
    AKAR.dataset.saBawah = String(bawah);
    return terakhir;
  }

  /* layar sentuh? dipakai CSS `@media (pointer: coarse)` — ini hanya cadangan
     untuk JS yang perlu tahu (mis. uji otomatis) */
  function sentuh() {
    try {
      return window.matchMedia('(pointer: coarse)').matches ||
             (navigator.maxTouchPoints || 0) > 0;
    } catch (e) {
      return false;
    }
  }

  function mulai() {
    terapkan(true);
    /* orientasi berubah / bilah alamat muncul-hilang ⇒ ukur ulang */
    window.addEventListener('resize', () => terapkan(false), { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(() => terapkan(true), 250));
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => terapkan(false), { passive: true });
    }
    /* APK: inset bisa baru dilaporkan setelah WebView selesai dipasang */
    setTimeout(() => terapkan(true), 400);
    setTimeout(() => terapkan(true), 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mulai, { once: true });
  } else {
    mulai();
  }

  window.ANodesLayar = {
    VERSI: 'v28Okt-a',
    terapkan: terapkan,
    sentuh: sentuh,
    ambil: function () { return { atas: terakhir.atas, bawah: terakhir.bawah }; }
  };
})();
