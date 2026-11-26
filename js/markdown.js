/* ============================================================
   ANodes — js/markdown.js
   Pengolah markdown → HTML (tanpa pustaka luar).

   ⚠️ K28h (3 Nov 2026) — berkas ini DIPINDAH dari `js/dokumen.js`
   ketika menu [Doc] dihapus. Mesinnya TETAP DIPAKAI oleh:
     • `js/editor.js` → Impor `.md` / `.txt`  (`keHtmlImpor`)
     • `js/editor.js` → tombol “📖 Rapi” di bar info catatan
     • `js/editor.js` → rapikan naskah tempelan (K44)
   ⇒ ❌ JANGAN dihapus walau menu [Doc] sudah tidak ada.

   Sengaja SEDERHANA (cukup untuk berkas proyek & naskah tempelan)
   dan tanpa pustaka luar — supaya aplikasi tetap ringan & tanpa server.
   ============================================================ */

const ANodesMarkdown = (() => {
  'use strict';

  // ------------------------------------------------------------
  // OLAH MARKDOWN SEDERHANA → HTML (aman: teks di-escape dulu)
  // ------------------------------------------------------------
  function aman(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // sebaris: **tebal** · *miring* · `kode` · [tautan](url)
  //   ⚠️ Aturan markdown: pembuka * TIDAK boleh diikuti spasi dan penutup
  //   TIDAK boleh didahului spasi. Tanpa aturan itu, teks biasa seperti
  //   “2 * 3 = 6” ikut dianggap miring dan tulisannya jadi rusak.
  function sebaris(t) {
    return aman(t)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/(^|[^*\w])\*([^\s*](?:[^*\n]*?[^\s*])?)\*(?=$|[^*\w])/g, '$1<i>$2</i>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  /* Beberapa baris digabung jadi SATU kesatuan lalu diolah sebaris.
     Penting: penanda **tebal** / *miring* sering TERBELAH dua baris,
     mis.  “**Untuk tahu mana sudah/belum…\n bagian 0 …**” — kalau tiap
     baris diolah sendiri, penandanya tidak pernah ketemu pasangan dan
     tampil mentah (**…**). Jadi gabung dulu, baru olah. */
  function beberapaBaris(arr) {
    return sebaris(arr.join('\n')).replace(/\n/g, '<br>');
  }

  // pisahkan baris tabel: | a | b |  → ['a','b']
  function selTabel(baris) {
    return baris.replace(/^\s*\|/, '').replace(/\|\s*$/, '')
      .split('|').map(x => x.trim());
  }

  // apakah baris pemisah tabel (---|---)?
  function barisPemisahTabel(baris) {
    return /^\s*\|?[\s:-]*-[\s|:-]*\|?\s*$/.test(baris) && baris.indexOf('-') >= 0;
  }

  /* Ubah markdown → HTML. */
  function keHtml(md) {
    const baris = String(md == null ? '' : md).replace(/\r\n?/g, '\n').split('\n');
    const keluar = [];
    let i = 0;

    // daftar yang sedang terbuka: '' | 'ul' | 'ol'
    let daftar = '';
    // penampung blok kode ```...```
    let kode = null;

    const tutupDaftar = () => { if (daftar) { keluar.push('</' + daftar + '>'); daftar = ''; } };

    while (i < baris.length) {
      const b = baris[i];

      // --- blok kode ``` ---
      if (/^\s*```/.test(b)) {
        if (kode === null) {
          tutupDaftar();
          kode = [];
        } else {
          keluar.push('<pre><code>' + aman(kode.join('\n')) + '</code></pre>');
          kode = null;
        }
        i++; continue;
      }
      if (kode !== null) { kode.push(b); i++; continue; }

      // --- tabel ---
      if (/^\s*\|/.test(b) && i + 1 < baris.length && barisPemisahTabel(baris[i + 1])) {
        tutupDaftar();
        const kepala = selTabel(b);
        const barisIsi = [];
        i += 2;
        while (i < baris.length && /^\s*\|/.test(baris[i])) { barisIsi.push(selTabel(baris[i])); i++; }
        let t = '<table><thead><tr>' +
          kepala.map(h => '<th>' + sebaris(h) + '</th>').join('') +
          '</tr></thead><tbody>';
        barisIsi.forEach(r => {
          t += '<tr>' + r.map(c => '<td>' + sebaris(c) + '</td>').join('') + '</tr>';
        });
        keluar.push(t + '</tbody></table>');
        continue;
      }

      // --- judul # ... ###### ---
      const jd = /^\s*(#{1,6})\s+(.*)$/.exec(b);
      if (jd) {
        tutupDaftar();
        const n = jd[1].length;
        keluar.push('<h' + n + '>' + sebaris(jd[2]) + '</h' + n + '>');
        i++; continue;
      }

      // --- garis pemisah ---
      if (/^\s*([-*_])\s*\1\s*\1[\s\-*_]*$/.test(b)) {
        tutupDaftar();
        keluar.push('<hr>');
        i++; continue;
      }

      // --- kutipan (>) — digabung dulu supaya penanda tebal tetap dikenali
      if (/^\s*>\s?/.test(b)) {
        tutupDaftar();
        const isiQ = [];
        while (i < baris.length && /^\s*>\s?/.test(baris[i])) {
          isiQ.push(baris[i].replace(/^\s*>\s?/, ''));
          i++;
        }
        keluar.push('<blockquote><p>' + beberapaBaris(isiQ) + '</p></blockquote>');
        continue;
      }

      // --- daftar berbutir (- / * / +) ---
      const bt = /^(\s*)([-*+])\s+(.*)$/.exec(b);
      if (bt) {
        if (daftar !== 'ul') { tutupDaftar(); keluar.push('<ul>'); daftar = 'ul'; }
        let isiB = bt[3];
        // baris lanjutan (menjorok, bukan penanda apa pun) → ikut ke butir ini
        while (i + 1 < baris.length && /^\s{2,}\S/.test(baris[i + 1]) &&
               !/^\s*([-*+]|\d+[.)]|>|#|\|)/.test(baris[i + 1])) {
          i++; isiB += '\n' + baris[i].trim();
        }
        keluar.push('<li>' + beberapaBaris(isiB.split('\n')) + '</li>');
        i++; continue;
      }

      // --- daftar bernomor (1. ) ---
      const nm = /^(\s*)(\d+)[.)]\s+(.*)$/.exec(b);
      if (nm) {
        if (daftar !== 'ol') { tutupDaftar(); keluar.push('<ol>'); daftar = 'ol'; }
        let isiN = nm[3];
        while (i + 1 < baris.length && /^\s{2,}\S/.test(baris[i + 1]) &&
               !/^\s*([-*+]|\d+[.)]|>|#|\|)/.test(baris[i + 1])) {
          i++; isiN += '\n' + baris[i].trim();
        }
        keluar.push('<li>' + beberapaBaris(isiN.split('\n')) + '</li>');
        i++; continue;
      }

      // --- baris kosong ---
      if (!b.trim()) { tutupDaftar(); i++; continue; }

      // --- paragraf: kumpulkan baris berurutan dulu (supaya penanda
      //     tebal/miring yang terbelah dua baris tetap dikenali) ---
      tutupDaftar();
      const isiP = [b];
      while (i + 1 < baris.length && baris[i + 1].trim() &&
             !/^\s*(#{1,6}\s|[>*+-]\s|\d+[.)]\s|\||```)/.test(baris[i + 1])) {
        i++;
        isiP.push(baris[i]);
      }
      keluar.push('<p>' + beberapaBaris(isiP) + '</p>');
      i++;
    }

    if (kode !== null) keluar.push('<pre><code>' + aman(kode.join('\n')) + '</code></pre>');
    if (daftar) keluar.push('</' + daftar + '>');
    return keluar.join('\n');
  }

  // ------------------------------------------------------------
  // KENALI bentuk teks: markdown atau sudah HTML?
  //   ⚠️ Teks yang SUDAH ada tag HTML (mis. `<p>`, `<b>`, `<div>`) TIDAK boleh
  //      lewat keHtml() lagi — `aman()` akan mengubah `<` jadi `&lt;` sehingga
  //      tag-nya tampil sebagai tulisan. Karena itu `bisaMarkdown()` menolak
  //      teks yang sudah punya tag.
  // ------------------------------------------------------------
  function sudahHtml(teks) {
    // ⚠️ Hanya dianggap HTML kalau tag-nya benar-benar di AWAL BARIS (markup asli).
    //    Kalau hanya "menyebut" tag di dalam kalimat (mis. dokumen proyek yang
    //    memuat contoh `<p>` / `<script>`), itu BUKAN HTML — jangan ditolak.
    return /^\s*<\/?(p|div|h[1-6]|ul|ol|li|table|tr|td|th|pre|code|blockquote|br|span|mark|a)\b[^>]*>/im
      .test(String(teks || ''));
  }

  function bisaMarkdown(teks) {
    const t = String(teks == null ? '' : teks);
    if (t.length < 40) return false;
    // 1) tanda markdown yang JELAS → pasti markdown (walau di dalamnya ada
    //    contoh HTML — dokumen proyek memang begitu)
    if (/^\s*```/m.test(t)) return true;                  // blok kode
    if (/^\s*\|.*\|/m.test(t)) return true;               // tabel
    if (/^\s*>\s?/m.test(t)) return true;                 // kutipan
    // 2) banyak judul → bentuk dokumen (catatan biasa biasanya 0–2 judul)
    const judul = (t.match(/^\s*#{1,6}\s+/gm) || []).length;
    if (judul >= 3) return true;
    // 3) 🆕 K44 (18 Sep 2026) — naskah paket/bahan pelajaran (mis. dari
    //    learning.sabda.org) TIDAK memakai tanda `#`, tetapi jelas bergaya:
    //    ada baris `**SASARAN**` sendiri, daftar `-`, dan tautan `[1Yo 1:1](…)`.
    //    Dulu naskah seperti ini DITOLAK → tombol “📖 Rapi” tidak mau muncul.
    //    Sekarang dikenali: minimal 2 macam tanda gaya.
    const tebal  = (t.match(/^\s*\*\*[^*\n]{2,80}\*\*\s*$/gm) || []).length;
    const daftar = (t.match(/^\s*[-*+•]\s+\S/mg) || []).length +
                   (t.match(/^\s*\d+[.)]\s+\S/mg) || []).length;
    const tautan = (t.match(/\[[^\]\n]+\]\([^)\n]+\)/g) || []).length;
    let tanda = 0;
    if (tebal >= 1) tanda++;
    if (daftar >= 2) tanda++;
    if (tautan >= 1) tanda++;
    if (tanda >= 2) return true;
    // 4) tidak ada tanda markdown, tapi bentuknya HTML asli → JANGAN diolah
    if (sudahHtml(t)) return false;
    return false;
  }

  function benahiMarkdown(teks) {
    if (!bisaMarkdown(teks)) return null;
    const keluar = keHtml(teks);
    return (keluar && keluar.trim()) ? keluar : null;
  }

  return { keHtml, bisaMarkdown, benahiMarkdown, sudahHtml, aman };
})();

window.ANodesMarkdown = ANodesMarkdown;
