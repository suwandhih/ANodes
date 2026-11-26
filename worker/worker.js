/* ============================================================
   ANodes — Cloudflare Worker: perantara sinkron Turso (K77)
   ------------------------------------------------------------
   TUGAS: menyimpan token Turso DI SINI (bukan di berkas ANodes),
          lalu meneruskan permintaan baca/tulis ke Turso.

   KENAPA perlu perantara?
     Berkas ANodes dikirim ke HP. Kalau token ditanam di berkas itu,
     siapa pun yang membuka berkasnya bisa membaca token tersebut.
     Dengan Worker, berkas ANodes hanya tahu ALAMAT Worker.

   CARA DEPLOY (Bapak):
     1. Dasbor Cloudflare -> Workers & Pages -> Create -> Worker
     2. Tempel SELURUH isi berkas ini
     3. Settings -> Variables and Secrets, tambahkan:
          TURSO_URL    = libsql://<db>-<org>.turso.io   (BUKAN app.turso.tech)
          TURSO_TOKEN  = token dari dasbor Turso
          KUNCI_APP    = kata sandi bebas pilihan Bapak (mis. "anodes-suwandhi-2026")
     4. Deploy -> catat alamatnya, mis. https://anodes-sync.<nama>.workers.dev

   CATATAN: tabel dibuat OTOMATIS saat pertama dipakai (tidak perlu SQL manual).
   ============================================================ */

const NAMA_TABEL = 'sinkron';

export default {
  async fetch(permintaan, env) {
    const asal = permintaan.headers.get('Origin') || '*';

    // CORS — berkas ANodes dibuka lewat file:// (origin "null")
    const kepala = {
      'Access-Control-Allow-Origin': asal,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Kunci',
      'Access-Control-Max-Age': '86400'
    };

    if (permintaan.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: kepala });
    }

    // --- penjaga: kunci aplikasi wajib cocok ---
    const kunci = permintaan.headers.get('X-Kunci') || '';
    if (!env.KUNCI_APP || kunci !== env.KUNCI_APP) {
      return jawab({ ok: false, pesan: 'Kunci aplikasi salah' }, 401, kepala);
    }
    if (!env.TURSO_URL || !env.TURSO_TOKEN) {
      return jawab({ ok: false, pesan: 'TURSO_URL / TURSO_TOKEN belum diisi di Worker' }, 500, kepala);
    }

    const url = new URL(permintaan.url);
    const jalur = url.pathname.replace(/\/+$/, '');

    try {
      await pastikanTabel(env);

      // GET /ambil  -> seluruh data sinkron
      if (permintaan.method === 'GET' && (jalur === '/ambil' || jalur === '')) {
        const hasil = await turso(env, `SELECT kunci, isi, waktu FROM ${NAMA_TABEL}`);
        const baris = (hasil.rows || []).map(r => ({
          kunci: r[0].value,
          isi: r[1].value,
          waktu: Number(r[2].value) || 0
        }));
        return jawab({ ok: true, data: baris }, 200, kepala);
      }

      // POST /simpan  { data: [{kunci, isi, waktu}, ...] }
      if (permintaan.method === 'POST' && jalur === '/simpan') {
        const badan = await permintaan.json();
        const daftar = Array.isArray(badan && badan.data) ? badan.data : [];
        if (!daftar.length) return jawab({ ok: true, ditulis: 0 }, 200, kepala);

        // hanya menulis kalau waktu kiriman LEBIH BARU (anti menimpa data baru)
        const pernyataan = daftar.map(d => ({
          sql: `INSERT INTO ${NAMA_TABEL} (kunci, isi, waktu) VALUES (?, ?, ?)
                ON CONFLICT(kunci) DO UPDATE SET isi = excluded.isi, waktu = excluded.waktu
                WHERE excluded.waktu >= ${NAMA_TABEL}.waktu`,
          args: [String(d.kunci), String(d.isi == null ? '' : d.isi), Number(d.waktu) || 0]
        }));

        await turso(env, pernyataan);
        return jawab({ ok: true, ditulis: daftar.length }, 200, kepala);
      }

      return jawab({ ok: false, pesan: 'Jalur tidak dikenal: ' + jalur }, 404, kepala);
    } catch (e) {
      return jawab({ ok: false, pesan: String(e && e.message ? e.message : e) }, 500, kepala);
    }
  }
};

/* ---------- pembantu ---------- */

function jawab(objek, status, kepala) {
  return new Response(JSON.stringify(objek), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, kepala)
  });
}

async function pastikanTabel(env) {
  await turso(env, `CREATE TABLE IF NOT EXISTS ${NAMA_TABEL} (
    kunci TEXT PRIMARY KEY,
    isi   TEXT NOT NULL,
    waktu INTEGER NOT NULL
  )`);
}

/**
 * Kirim pernyataan SQL ke Turso lewat HTTP API (pipeline).
 * Menerima satu string SQL atau array {sql, args}.
 */
async function turso(env, pernyataan) {
  const daftar = Array.isArray(pernyataan) ? pernyataan : [{ sql: pernyataan, args: [] }];
  const alamat = env.TURSO_URL.replace(/^libsql:\/\//, 'https://').replace(/\/+$/, '') + '/v2/pipeline';

  const balasan = await fetch(alamat, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + env.TURSO_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [
        ...daftar.map(d => ({
          type: 'execute',
          stmt: { sql: d.sql, args: (d.args || []).map(nilaiArg) }
        })),
        { type: 'close' }
      ]
    })
  });

  if (!balasan.ok) {
    const teks = await balasan.text();
    throw new Error('Turso menolak (' + balasan.status + '): ' + teks.slice(0, 300));
  }

  const hasil = await balasan.json();
  const pertama = (hasil.results || [])[0];
  if (pertama && pertama.type === 'error') {
    throw new Error('Turso: ' + (pertama.error && pertama.error.message ? pertama.error.message : 'galat'));
  }
  return (pertama && pertama.response && pertama.response.result) || { rows: [] };
}

function nilaiArg(v) {
  if (typeof v === 'number') return { type: 'integer', value: String(v) };
  return { type: 'text', value: String(v == null ? '' : v) };
}
