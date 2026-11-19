# Ekspedisi — Media Pembelajaran Menulis Teks Eksposisi dengan Gamifikasi

Media pembelajaran interaktif berbasis web untuk penelitian tesis
**“Pengembangan Media Ekspedisi dengan Gamifikasi untuk Meningkatkan Keterampilan Menulis Teks Eksposisi Kelas X SMA Muhammadiyah 4 Depok”**.

Peserta didik berperan sebagai penjelajah yang menempuh empat pos (level) secara berurutan. Setiap pos mewakili satu tahap proses menulis (Tabel 1.2):

| Pos | Tahap | Misi | Lencana |
|---|---|---|---|
| 1. Menemukan Rute | Prapenulisan | Kuis topik/tesis/fakta, menyusun peta gagasan | Penemu Gagasan 🧭 |
| 2. Membangun Argumen | Penulisan draf | Mengurutkan paragraf acak, mengenali struktur, menulis dua argumen beserta data | Penyusun Argumen 🧱 |
| 3. Mengasah Bahasa | Penyuntingan | Kalimat efektif, konjungsi kausalitas, kata kerja mental, istilah teknis, buru kesalahan ejaan | Penyunting Andal 🔎 |
| 4. Puncak Ekspedisi | Penulisan & revisi | Menulis teks eksposisi 3–4 paragraf, pemeriksaan otomatis, penilaian diri (rubrik), revisi | Penjelajah Ulung 🏔️ |

## Elemen gamifikasi
- **Poin** untuk setiap soal dan misi, serta **bonus revisi** di Pos 4.
- **Lencana** tiap pos + lencana tambahan (Langkah Mantap, Pantang Menyerah).
- **Papan peringkat** (per perangkat dan per kelas melalui Panel Guru).
- **Level/misi terkunci bertahap**: pos dan misi berikutnya terbuka setelah yang sebelumnya tuntas.
- **Umpan balik cepat** dan **kebebasan untuk gagal** (percobaan ulang tanpa pengurangan poin).
- **Alur cerita** ekspedisi sebagai pembungkus pembelajaran.

## Fitur untuk guru (Panel Guru)
Buka tautan **Panel Guru** di bagian bawah halaman (`#/guru`):
1. Peserta didik menyalin **kode hasil** dari halaman *Hasil* dan mengirimkannya ke guru (atau mengunduh berkas `.json`).
2. Guru menempelkan kode (boleh banyak sekaligus) atau mengunggah berkas.
3. Guru membaca tulisan (draf pertama dan akhir), melihat penilaian diri, lalu menilai dengan **rubrik lima aspek (Tabel 3.7)**; nilai = (jumlah skor : 20) × 100.
4. Rekap dapat diekspor ke **CSV** (Excel/Google Sheets) untuk analisis pretest–posttest/N-Gain, dan papan peringkat kelas dapat ditampilkan di proyektor.

## Menjalankan
Tidak perlu instalasi atau server. Cukup buka `index.html` di peramban.

**Membagikan tautan ke peserta didik (GitHub Pages):**
Settings → Pages → *Deploy from a branch* → pilih cabang dan folder `/ (root)` → Save. Tautan berbentuk `https://<nama-pengguna>.github.io/media-pembelajaran/`.

## Struktur berkas
```
index.html        kerangka halaman
css/style.css     tampilan (mode terang/gelap, ramah ponsel)
js/data.js        SELURUH isi materi, soal, misi, lencana, rubrik, dan kamus pemeriksa
js/app.js         logika aplikasi
```
Untuk merevisi materi atau soal berdasarkan masukan validator ahli (tahap Development ADDIE), cukup sunting `js/data.js`.

## Catatan
- Kemajuan disimpan di `localStorage` peramban; jangan menghapus data peramban sebelum mengirim kode hasil.
- Skor periksa di Pos 4 adalah umpan balik otomatis berbasis heuristik (struktur, penanda data, konjungsi, kata kerja mental, kata tidak baku, pleonasme, tanda baca), **bukan** nilai akhir. Nilai akhir tetap diberikan guru melalui rubrik.
