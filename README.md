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

## Salindia dan video interaktif
Setiap pos dilengkapi dua materi pendukung yang dibuka dari kartu di atas *Bekal materi* (juga di halaman **Materi**):
- **Salindia** (8–12 salindia per pos): layar penuh, butir muncul bertahap, dan salindia **“Tebak dulu!”** yang meminta siswa menjawab sebelum melanjutkan sehingga tidak satu arah.
- **Video interaktif** (±1–1,5 menit per pos): animasi bernarasi bersama pemandu “Kak Rani”, teks narasi (CC), pengatur kecepatan, dan **kuis cepat** yang menghentikan video sampai dijawab benar.

Isi salindia dan video disusun berdasarkan analisis kebutuhan pada tesis: kesulitan merumuskan tesis, kalimat efektif, dan ejaan (wawancara guru); kesulitan menemukan gagasan, menyusun struktur, memilih kata (angket); pengaruh bahasa media sosial dan AI; rendahnya inisiatif merevisi; serta prinsip kemajuan dari kosakata sehari-hari ke ilmiah. Isinya disunting di `js/media.js`.

### Suara narator
Pemutar memilih suara dengan urutan berikut:
1. **Rekaman suara manusia** — bila berkas `audio/<pos>/<nomor-adegan>.mp3` tersedia lengkap untuk satu pos (contoh `audio/pos1/1.mp3` … `audio/pos1/7.mp3`). Naskahnya ada di [`audio/NASKAH-NARASI.md`](audio/NASKAH-NARASI.md); buat ulang setelah menyunting narasi dengan `node tools/buat-naskah.js`.
2. **Suara alami (neural) perangkat** — misalnya “Microsoft Gadis/Ardi Online (Natural)” di Microsoft Edge atau suara Google di Chrome/Android.
3. Suara bahasa Indonesia lain yang tersedia, atau teks saja.

Siswa dapat mengganti suara melalui tombol 🔊 di pemutar. Narasi dibacakan per kalimat dengan jeda agar terdengar wajar.

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

## Panel Admin (reset peringkat)
Buka **Papan Peringkat → 🔒 Admin: reset peringkat** atau tautan **Admin** di bagian bawah halaman (`#/admin`), lalu masukkan password admin. Pilih kelas (atau semua kelas), kemudian:
- **Reset poin** — poin menjadi 0 untuk putaran baru; kemajuan, lencana, tulisan, dan nilai rubrik tetap tersimpan.
- **Kosongkan data kelas** — menghapus kode hasil yang dimasukkan di Panel Guru (ekspor CSV dahulu bila perlu).
- **Reset total** — menghapus profil penjelajah beserta kemajuannya di perangkat ini.

Panel terkunci kembali saat tab ditutup atau tombol **Kunci panel** ditekan; lima kali salah password mengunci formulir selama 30 detik. Password disimpan sebagai sidik SHA-256 di `js/app.js` (`HASH_ADMIN`). Untuk menggantinya, hitung SHA-256 password baru lalu ganti nilai tersebut.

## Menjalankan
Tidak perlu instalasi atau server. Cukup buka `index.html` di peramban.

**Membagikan tautan ke peserta didik (GitHub Pages):**
Settings → Pages → *Deploy from a branch* → pilih cabang dan folder `/ (root)` → Save. Tautan berbentuk `https://<nama-pengguna>.github.io/media-pembelajaran/`.

## Struktur berkas
```
index.html        kerangka halaman
css/style.css     tampilan (mode terang/gelap, ramah ponsel)
js/media.js       isi salindia, narasi video, dan kuis video
js/media-player.js pemutar salindia & video interaktif
audio/            rekaman narasi (opsional) dan NASKAH-NARASI.md
tools/buat-naskah.js  pembuat naskah narasi dari js/media.js
js/data.js        SELURUH isi materi, soal, misi, lencana, rubrik, dan kamus pemeriksa
js/app.js         logika aplikasi
```
Untuk merevisi materi atau soal berdasarkan masukan validator ahli (tahap Development ADDIE), cukup sunting `js/data.js`.

## Catatan
- Kemajuan disimpan di `localStorage` peramban; jangan menghapus data peramban sebelum mengirim kode hasil.
- Skor periksa di Pos 4 adalah umpan balik otomatis berbasis heuristik (struktur, penanda data, konjungsi, kata kerja mental, kata tidak baku, pleonasme, tanda baca), **bukan** nilai akhir. Nilai akhir tetap diberikan guru melalui rubrik.
