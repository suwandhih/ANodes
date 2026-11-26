/* ============================================================
   ANodes — plugin/pengingat/plugin.js
   KETERANGAN PLUGIN: 🕊️ Pengingat Firman   (BELUM JADI)
   ------------------------------------------------------------
   Hanya KETERANGAN (belum ada mesinnya). Gunanya supaya di
   gudang plugin terlihat rencana plugin berikutnya sehingga pengguna
   bisa membaca keterangannya + menilai dulu sebelum dikerjakan.

   Dimuat lewat <script src="plugin/pengingat/plugin.js"> di index.html
   (BUKAN fetch — Chrome memblokir fetch di file://).
   ============================================================ */

window.ANodesPlug = window.ANodesPlug || [];

window.ANodesPlug.push({
  id: 'pengingat',
  nama: 'Pengingat Firman',
  ikon: '🕊️',
  versi: '0.1',
  penulis: 'ANodes',
  ukuran: '± 1 MB',
  ringkas: 'Ayat yang ditandai muncul kembali sebagai pengingat (belum jadi).',
  siap: false,          // belum bisa dipasang

  angka: [
    { n: '0', l: 'ayat ditandai' },
    { n: '—', l: 'pengingat' }
  ],

  keterangan:
    'Ayat-ayat yang ditandai di catatan akan muncul kembali pada waktu ' +
    'yang bisa ditentukan sendiri — misalnya tiap pagi, atau sesudah beberapa ' +
    'hari. Berguna untuk merenungkan ayat yang sedang dipegang. ' +
    'Fitur ini BELUM dikerjakan; keterangan ini hanya rancangan.',

  fitur: [
    'Tandai ayat di catatan dengan satu ketukan.',
    'Atur jadwal pengingat (tiap hari · tiap minggu · bebas).',
    'Pengingat muncul di kepala ANodes, tidak mengganggu tulisan.',
    'Bisa dimatikan sementara tanpa menghapus daftarnya.'
  ],

  cara: [
    'Tandai ayat yang ingin diingat.',
    'Atur kapan pengingatnya muncul.',
    'Buka ANodes seperti biasa — pengingatnya muncul sendiri.'
  ],

  catatan: [
    'BELUM dikerjakan — masih rancangan.',
    'Butuh izin notifikasi dari browser.',
    'Tidak memerlukan internet.'
  ],

  saatDipasang: function () {},
  saatDilepas:  function () {}
});
