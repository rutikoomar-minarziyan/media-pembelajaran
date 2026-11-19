/* =========================================================
   EKSPEDISI — Isi salindia dan video interaktif tiap pos

   Isi disusun berdasarkan analisis kebutuhan pada tesis:
   - Kesulitan utama menurut guru: merumuskan tesis, menyusun
     kalimat efektif, dan menaati kaidah ejaan.
   - Kesulitan menurut angket: menemukan gagasan, menyusun
     struktur, memilih kata, dan menggunakan ejaan.
   - Pengaruh bahasa media sosial dan kecerdasan buatan (AI)
     terhadap kemandirian memilih kata dan menyusun gagasan.
   - Inisiatif merevisi/menyunting masih rendah.
   - Media sebelumnya (salindia dan video) satu arah sehingga
     siswa pasif → setiap salindia dan video memuat interaksi
     (salindia "Tebak Dulu!" dan kuis cepat di dalam video).
   - Prinsip kemajuan: dari kosakata sehari-hari ke ilmiah.

   Jenis visual: sampul, poin, banding, contoh, struktur, alur,
   peta, chip, tebak (pertanyaan interaktif di salindia).
   Video merujuk salindia dengan REF("posX", "idSalindia").

   SUARA MANUSIA: letakkan rekaman narasi di
   audio/<pos>/<nomor-adegan>.mp3 (contoh audio/pos1/1.mp3).
   Pemutar otomatis memakai rekaman itu bila tersedia.
   Naskahnya ada di audio/NASKAH-NARASI.md.
   ========================================================= */

function REF(pos, id) {
  return { ref: [pos, id] };
}

const MEDIA_EKSPEDISI = {
  /* ===================== SALINDIA ===================== */
  salindia: {
    pos1: [
      { id: "sampul", tipe: "sampul", ikon: "🧭", kicker: "Pos 1 · Prapenulisan", judul: "Menemukan Rute", sub: "Menemukan gagasan, merumuskan tesis, dan menyiapkan data" },
      {
        id: "pengertian", tipe: "poin", judul: "Apa itu teks eksposisi?",
        butir: [
          { ikon: "📄", t: "Teks nonfiksi", d: "Berdasarkan kenyataan, bukan khayalan." },
          { ikon: "💡", t: "Memaparkan gagasan", d: "Berisi pandangan penulis tentang suatu isu." },
          { ikon: "📊", t: "Didukung bukti", d: "Fakta, data, atau pendapat ahli." },
          { ikon: "🎯", t: "Objektif dan akurat", d: "Singkat, padat, dan dapat dipercaya." }
        ]
      },
      {
        id: "topik", tipe: "banding", judul: "Cara menemukan topik: lihat sekitarmu",
        kiri: { label: "Cocok (isu aktual, ada datanya)", nada: "ok", butir: ["Sampah plastik di kantin sekolah", "Kebiasaan begadang karena gawai", "Bahaya hoaks di grup WhatsApp"] },
        kanan: { label: "Kurang cocok", nada: "bad", butir: ["Liburanku ke Puncak (cerita)", "Cara membuat es teh (prosedur)", "Legenda Situ Gintung (cerita rakyat)"] }
      },
      {
        id: "tebakTopik", tipe: "tebak", judul: "Tebak dulu!",
        t: "Manakah yang bisa dikembangkan menjadi teks eksposisi?",
        o: ["Pengalaman seru berkemah bersama teman", "Kebiasaan begadang pelajar dan dampaknya pada prestasi", "Langkah-langkah membuat layang-layang"],
        k: 1, u: "Benar! Isu begadang bersifat aktual, dekat dengan pelajar, dan bisa dibuktikan dengan data."
      },
      {
        id: "rumusTesis", tipe: "contoh", judul: "Rumus tesis: isu + sikap + alasan",
        bagian: [
          { t: "Penggunaan gawai di kalangan pelajar", label: "Isu", w: 1 },
          { t: "perlu dibatasi", label: "Sikap", w: 2 },
          { t: "karena mengganggu kualitas tidur.", label: "Alasan", w: 3 }
        ],
        ket: "Tesis berupa pernyataan (bukan pertanyaan), sikapnya jelas, dan dapat dibuktikan."
      },
      {
        id: "salahTesis", tipe: "banding", judul: "Kesalahan umum saat merumuskan tesis",
        kiri: { label: "Keliru", nada: "bad", butir: ["“Apakah gawai berbahaya?” → pertanyaan", "“Gawai adalah alat elektronik.” → fakta umum", "“Teknologi itu penting.” → terlalu luas"] },
        kanan: { label: "Tepat", nada: "ok", butir: ["“Pelajar perlu membatasi gawai pada malam hari karena mengganggu tidur.”", "“Sekolah sebaiknya menyediakan tempat sampah terpilah agar sampah mudah didaur ulang.”"] }
      },
      {
        id: "tebakTesis", tipe: "tebak", judul: "Tebak dulu!",
        t: "Manakah tesis yang paling tepat?",
        o: ["Bagaimana cara mengurangi sampah plastik?", "Sampah plastik adalah sampah dari plastik.", "Kantin sekolah perlu mengganti kemasan plastik karena sampahnya sulit terurai."],
        k: 2, u: "Tepat! Ada isu (kemasan plastik di kantin), sikap (perlu mengganti), dan alasan (sulit terurai)."
      },
      {
        id: "fakta", tipe: "banding", judul: "Fakta atau opini?",
        kiri: { label: "Fakta/data (bisa diperiksa)", nada: "ok", butir: ["Hasil PISA 2022 menunjukkan skor literasi membaca Indonesia 359 poin.", "Plastik membutuhkan waktu sangat lama untuk terurai."] },
        kanan: { label: "Opini pribadi", nada: "netral", butir: ["Membaca itu kegiatan paling menyenangkan.", "Menurut saya, pelajar sekarang malas."] }
      },
      {
        id: "ai", tipe: "poin", judul: "Gagasanmu, suaramu: bijak memakai internet dan AI",
        butir: [
          { ikon: "🔎", t: "Boleh untuk mencari informasi", d: "Gunakan sebagai bahan, bukan pengganti berpikir." },
          { ikon: "✅", t: "Periksa kebenarannya", d: "Bandingkan dengan sumber tepercaya." },
          { ikon: "📝", t: "Catat sumbernya", d: "Sumber membuat argumenmu kredibel." },
          { ikon: "🗣️", t: "Tulis dengan kata-katamu sendiri", d: "Pendapatmu adalah inti teks eksposisi." }
        ]
      },
      { id: "peta", tipe: "peta", judul: "Peta gagasan = peta rute tulisan", pusat: "Topik", cabang: ["Tesis (pendapat)", "Ide pendukung 1", "Ide pendukung 2", "Fakta/data + sumber"] },
      { id: "penutup", tipe: "sampul", ikon: "🎒", kicker: "Siap berangkat?", judul: "Bekal Pos 1", sub: "Pilih isu aktual · rumuskan tesis · siapkan dua ide pendukung dan datanya" }
    ],

    pos2: [
      { id: "sampul", tipe: "sampul", ikon: "🧱", kicker: "Pos 2 · Penulisan Draf", judul: "Membangun Argumen", sub: "Menyusun struktur dan mendukung pendapat dengan data" },
      {
        id: "struktur", tipe: "struktur", judul: "Tiga balok teks eksposisi",
        blok: [
          { ikon: "🚩", label: "Tesis", t: "Pembuka: memperkenalkan isu dan pendapat penulis." },
          { ikon: "🧱", label: "Argumentasi", t: "Isi: alasan logis + fakta, data, atau pendapat ahli (minimal dua)." },
          { ikon: "🏁", label: "Penegasan ulang", t: "Penutup: merangkum dan menegaskan kembali pendapat." }
        ]
      },
      {
        id: "tebakStruktur", tipe: "tebak", judul: "Tebak dulu!",
        t: "“Oleh karena itu, kantin sekolah perlu beralih ke kemasan ramah lingkungan.” Kalimat ini paling cocok berada di bagian …",
        o: ["Tesis", "Argumentasi", "Penegasan ulang"],
        k: 2, u: "Benar! “Oleh karena itu” dan isi yang menegaskan kembali sikap penulis menandai penegasan ulang."
      },
      {
        id: "resep", tipe: "poin", judul: "Resep argumen yang kuat",
        butir: [
          { ikon: "🧠", t: "Alasan logis", d: "Mengapa pendapatmu benar?" },
          { ikon: "📊", t: "Bukti", d: "Data, fakta, hasil survei, atau pendapat ahli." },
          { ikon: "🔗", t: "Sumber jelas", d: "“Menurut …”, “Berdasarkan survei …”." },
          { ikon: "↩️", t: "Kaitkan dengan tesis", d: "“Hal ini menunjukkan bahwa …”." }
        ]
      },
      {
        id: "lemahKuat", tipe: "banding", judul: "Argumen lemah vs kuat",
        kiri: { label: "Lemah", nada: "bad", butir: ["Sampah plastik itu jelek dan bikin kotor.", "Semua orang tahu sampah plastik berbahaya."] },
        kanan: { label: "Kuat", nada: "ok", butir: ["Sampah plastik sulit terurai sehingga mencemari tanah dan perairan dalam waktu lama."] }
      },
      {
        id: "tebakArgumen", tipe: "tebak", judul: "Tebak dulu!",
        t: "Argumen manakah yang paling kuat untuk tesis “Pelajar perlu sarapan sebelum sekolah”?",
        o: ["Sarapan itu enak dan bikin senang.", "Para ahli gizi meyakini sarapan menyediakan energi bagi otak sehingga konsentrasi belajar terjaga.", "Ibu saya selalu menyuruh sarapan."],
        k: 1, u: "Tepat! Argumen itu memuat alasan logis dan pendapat ahli."
      },
      {
        id: "polaData", tipe: "contoh", judul: "Pola menyajikan data",
        bagian: [
          { t: "Berdasarkan survei OSIS terhadap 120 peserta didik,", label: "Sumber", w: 1 },
          { t: "sebagian besar tidur kurang dari tujuh jam.", label: "Data", w: 2 },
          { t: "Hal ini menunjukkan bahwa gawai mengganggu waktu istirahat.", label: "Kaitan", w: 3 }
        ],
        ket: "Sumber → data → kaitan dengan tesis."
      },
      {
        id: "penanda", tipe: "chip", judul: "Ungkapan penanda struktur",
        grup: [
          { label: "Membuka argumen", chips: ["Pertama,", "Kedua,", "Selain itu,", "Di samping itu,"] },
          { label: "Penegasan ulang", chips: ["Dengan demikian,", "Oleh karena itu,", "Jadi,", "Dapat disimpulkan bahwa"] }
        ]
      },
      { id: "penutup", tipe: "sampul", ikon: "🌉", kicker: "Siap menyeberang?", judul: "Bekal Pos 2", sub: "Tesis → argumentasi + data → penegasan ulang" }
    ],

    pos3: [
      { id: "sampul", tipe: "sampul", ikon: "🔎", kicker: "Pos 3 · Penyuntingan", judul: "Mengasah Bahasa", sub: "Memilih kata, menyusun kalimat efektif, dan menaati ejaan" },
      {
        id: "kaidah", tipe: "poin", judul: "Kaidah kebahasaan teks eksposisi",
        butir: [
          { ikon: "🔬", t: "Istilah teknis", d: "ekosistem, literasi, emisi, radiasi" },
          { ikon: "🔗", t: "Konjungsi kausalitas", d: "karena, sehingga, akibatnya" },
          { ikon: "🧠", t: "Kata kerja mental", d: "meyakini, menganggap, menyimpulkan" },
          { ikon: "📣", t: "Persuasif tetapi objektif", d: "Mengajak pembaca dengan dasar data." }
        ]
      },
      {
        id: "medsos", tipe: "banding", judul: "Bahasa media sosial ≠ bahasa eksposisi",
        kiri: { label: "Gaya chat/media sosial", nada: "bad", butir: ["Sampah di kantin banyak bgt wkwk", "Gara2 HP jadi gak bisa tidur", "Pokoknya hoaks itu bahaya bgt!!!"] },
        kanan: { label: "Gaya teks eksposisi", nada: "ok", butir: ["Jumlah sampah di kantin sekolah cukup banyak.", "Penggunaan gawai pada malam hari mengganggu waktu tidur.", "Hoaks berbahaya karena dapat memicu kesalahpahaman."] }
      },
      {
        id: "naikKelas", tipe: "struktur", judul: "Naik kelas: dari kata sehari-hari ke kata ilmiah",
        blok: [
          { ikon: "1️⃣", label: "HP → gawai", t: "Pilih istilah baku sesuai KBBI." },
          { ikon: "2️⃣", label: "bikin → menyebabkan", t: "Pilih kata kerja yang tepat dan formal." },
          { ikon: "3️⃣", label: "nggak sehat → berdampak buruk bagi kesehatan", t: "Ungkapkan secara lengkap dan objektif." },
          { ikon: "4️⃣", label: "banyak banget → sebagian besar (78%)", t: "Ganti kesan dengan data yang terukur." }
        ]
      },
      {
        id: "konjungsi", tipe: "chip", judul: "Konjungsi kausalitas & kata kerja mental",
        grup: [
          { label: "Sebab-akibat", chips: ["karena", "sebab", "sehingga", "akibatnya", "oleh karena itu", "maka"] },
          { label: "Kata kerja mental", chips: ["meyakini", "menganggap", "berpendapat", "memperkirakan", "menyimpulkan", "menyadari"] }
        ],
        contoh: "Para ahli meyakini bahwa kurang tidur menurunkan konsentrasi sehingga prestasi belajar terganggu."
      },
      {
        id: "tebakKonjungsi", tipe: "tebak", judul: "Tebak dulu!",
        t: "Banyak peserta didik terlambat masuk kelas ___ jalan menuju sekolah macet.",
        o: ["karena", "tetapi", "lalu"],
        k: 0, u: "Benar! “Karena” menyatakan sebab: terlambat disebabkan jalan macet."
      },
      {
        id: "ciriEfektif", tipe: "poin", judul: "Ciri kalimat efektif",
        butir: [
          { ikon: "🧍", t: "Subjek dan predikat jelas", d: "Jangan diawali “bagi”, “di”, atau “dalam” yang mengaburkan subjek." },
          { ikon: "✂️", t: "Hemat kata", d: "Hindari “naik ke atas”, “agar supaya”, “para siswa-siswa”." },
          { ikon: "🎯", t: "Cermat dan tidak ambigu", d: "Makna hanya dapat ditafsirkan satu cara." },
          { ikon: "🧩", t: "Logis dan padu", d: "Hubungan antarbagian masuk akal." }
        ]
      },
      {
        id: "efektif", tipe: "banding", judul: "Kalimat tidak efektif → efektif",
        kiri: { label: "Tidak efektif", nada: "bad", butir: ["Para siswa-siswa hadir.", "Kami naik ke atas panggung.", "Agar supaya nilai naik …", "Bagi semua peserta didik diharapkan hadir."] },
        kanan: { label: "Efektif", nada: "ok", butir: ["Para siswa hadir.", "Kami naik ke panggung.", "Agar nilai naik …", "Semua peserta didik diharapkan hadir."] }
      },
      {
        id: "baku", tipe: "banding", judul: "Tidak baku → baku (KBBI)",
        kiri: { label: "Tidak baku", nada: "bad", butir: ["analisa · praktek · sistim", "resiko · karna · menghimbau", "aktifitas · merubah · sekedar"] },
        kanan: { label: "Baku", nada: "ok", butir: ["analisis · praktik · sistem", "risiko · karena · mengimbau", "aktivitas · mengubah · sekadar"] }
      },
      {
        id: "ejaan", tipe: "struktur", judul: "Ejaan penting (EYD Edisi V)",
        blok: [
          { ikon: "🔠", label: "Huruf kapital", t: "Awal kalimat dan nama diri: Indonesia, Depok, Selasa." },
          { ikon: "📍", label: "di sebagai kata depan", t: "Dipisah: di sekolah, di sungai, di Indonesia." },
          { ikon: "🧩", label: "di- sebagai awalan", t: "Disambung: dibuang, digunakan, diterapkan." },
          { ikon: "✒️", label: "Tanda koma", t: "Setelah penghubung antarkalimat: Oleh karena itu, …" }
        ]
      },
      {
        id: "tebakEjaan", tipe: "tebak", judul: "Tebak dulu!",
        t: "Penulisan manakah yang benar?",
        o: ["Sampah di buang disungai.", "Sampah dibuang di sungai.", "Sampah dibuang disungai."],
        k: 1, u: "Tepat! “Dibuang” (awalan di- disambung) dan “di sungai” (kata depan di dipisah)."
      },
      { id: "penutup", tipe: "sampul", ikon: "🛠️", kicker: "Siap menyunting?", judul: "Bekal Pos 3", sub: "Baku · efektif · runtut · tepat ejaan" }
    ],

    pos4: [
      { id: "sampul", tipe: "sampul", ikon: "🏔️", kicker: "Pos 4 · Penulisan & Revisi", judul: "Puncak Ekspedisi", sub: "Menulis teks eksposisi utuh, menilai diri, dan merevisi" },
      { id: "alur", tipe: "alur", judul: "Lima langkah menuju puncak", langkah: ["Tulis draf", "Periksa", "Nilai diri", "Revisi", "Kirim"] },
      {
        id: "kerangka", tipe: "struktur", judul: "Kerangka 4 paragraf",
        blok: [
          { ikon: "1️⃣", label: "Tesis", t: "Isu + pendapatmu (± 2–3 kalimat)." },
          { ikon: "2️⃣", label: "Argumentasi 1", t: "Alasan pertama + data/sumber." },
          { ikon: "3️⃣", label: "Argumentasi 2", t: "Alasan kedua + data/sumber." },
          { ikon: "4️⃣", label: "Penegasan ulang", t: "“Dengan demikian, …” + ajakan/saran." }
        ]
      },
      {
        id: "rubrik", tipe: "poin", judul: "Lima aspek penilaian",
        butir: [
          { ikon: "🏗️", t: "Struktur teks", d: "Lengkap, berurutan, jelas." },
          { ikon: "💬", t: "Gagasan dan argumen", d: "Minimal dua argumen + bukti." },
          { ikon: "🔗", t: "Kaidah kebahasaan", d: "Istilah teknis, konjungsi, kata kerja mental." },
          { ikon: "✍️", t: "Diksi dan kalimat efektif", d: "Baku, tepat, objektif." },
          { ikon: "✒️", t: "Ejaan dan koherensi", d: "Sesuai EYD V dan padu." }
        ]
      },
      {
        id: "mengapaRevisi", tipe: "banding", judul: "Mengapa harus merevisi?",
        kiri: { label: "Revisi (memperbaiki isi)", nada: "ok", butir: ["Apakah tesisku jelas?", "Apakah setiap argumen punya data?", "Apakah urutannya runtut?"] },
        kanan: { label: "Penyuntingan (memperbaiki bahasa)", nada: "ok", butir: ["Apakah semua kata baku?", "Apakah kalimatnya efektif?", "Apakah ejaannya tepat?"] }
      },
      {
        id: "jurus", tipe: "poin", judul: "Jurus revisi",
        butir: [
          { ikon: "🗣️", t: "Baca nyaring", d: "Kalimat yang janggal akan terdengar." },
          { ikon: "📊", t: "Cek bukti", d: "Apakah setiap argumen punya data?" },
          { ikon: "🔗", t: "Cek penghubung", d: "Apakah logika sebab-akibat terlihat?" },
          { ikon: "🔍", t: "Cek ejaan", d: "Kapital, di-/di, dan tanda baca." }
        ]
      },
      {
        id: "tebakRevisi", tipe: "tebak", judul: "Tebak dulu!",
        t: "Pemeriksa tulisan memberi saran: “Argumen belum didukung data.” Apa yang sebaiknya kamu lakukan?",
        o: ["Langsung mengirim tulisan", "Menambahkan fakta atau data beserta sumbernya, lalu memeriksa lagi", "Menghapus paragraf argumen"],
        k: 1, u: "Benar! Revisi berdasarkan umpan balik membuat tulisanmu lebih kuat dan memberimu bonus poin."
      },
      {
        id: "penutup", tipe: "sampul", ikon: "🤲", kicker: "Q.S. Thaha: 114", judul: "Rabbi zidnī ‘ilmā",
        sub: "“Ya Tuhanku, tambahkanlah kepadaku ilmu.” Menulislah setahap demi setahap, jangan tergesa-gesa."
      }
    ]
  },

  /* ===================== VIDEO INTERAKTIF ===================== */
  video: {
    pos1: {
      judul: "Menemukan Rute Tulisan",
      adegan: [
        {
          v: { tipe: "sampul", ikon: "🧭", kicker: "Video interaktif · Pos 1", judul: "Menemukan Rute Tulisan", sub: "Bersama Kak Rani, pemandu ekspedisi" },
          narasi: "Halo, penjelajah! Aku Kak Rani, pemandu ekspedisimu. Pernah bingung mau menulis apa? Tenang, hari ini kita belajar menemukan rute tulisan, langkah pertama menulis teks eksposisi."
        },
        {
          v: REF("pos1", "pengertian"),
          narasi: "Pertama, kita kenalan dulu dengan teks eksposisi. Teks ini memaparkan pendapat penulis tentang suatu isu. Bedanya dengan curhat, pendapat itu harus didukung bukti, seperti fakta, data, atau pendapat ahli."
        },
        {
          v: REF("pos1", "topik"),
          narasi: "Nah, dari mana kita mendapat topik? Coba lihat sekitarmu. Sampah di kantin, kebiasaan begadang, atau hoaks di grup WhatsApp. Itu semua isu aktual yang bisa dibuktikan dengan data. Cerita liburan atau resep bukan topik eksposisi, ya."
        },
        {
          v: REF("pos1", "rumusTesis"),
          narasi: "Bagian yang sering dianggap sulit adalah merumuskan tesis. Gunakan rumus ini: isu, ditambah sikap, ditambah alasan. Misalnya, penggunaan gawai di kalangan pelajar, perlu dibatasi, karena mengganggu kualitas tidur."
        },
        {
          v: REF("pos1", "salahTesis"),
          narasi: "Hati-hati dengan tiga kesalahan umum. Tesis tidak boleh berupa pertanyaan, tidak boleh hanya berisi fakta umum, dan jangan terlalu luas. Tesis yang tepat menyebutkan sikap yang jelas beserta alasannya."
        },
        {
          v: REF("pos1", "ai"),
          narasi: "Kamu boleh memakai internet atau AI untuk mencari informasi. Namun, periksa kebenarannya, catat sumbernya, dan tulislah dengan kata-katamu sendiri. Ingat, pendapatmulah inti dari teks eksposisi."
        },
        {
          v: REF("pos1", "peta"),
          narasi: "Terakhir, susun semuanya dalam peta gagasan: topik di tengah, lalu tesis, dua ide pendukung, serta data dan sumbernya. Peta inilah yang akan menuntunmu sampai ke puncak. Ayo, mulai misimu!"
        }
      ],
      kuis: [
        {
          setelah: 2,
          soal: {
            t: "Manakah topik yang paling cocok untuk teks eksposisi?",
            o: ["Kisah liburanku ke pantai", "Bahaya hoaks di media sosial bagi pelajar", "Cara menanam cabai di pot"],
            k: 1,
            u: "Tepat! Isu hoaks bersifat aktual dan dapat dibuktikan dengan data."
          }
        },
        {
          setelah: 4,
          soal: {
            t: "Tesis “Sekolah perlu menyediakan tempat sampah terpilah karena sampah sulit didaur ulang.” Bagian yang menunjukkan SIKAP penulis adalah …",
            o: ["Sekolah", "perlu menyediakan", "karena sampah sulit didaur ulang"],
            k: 1,
            u: "Benar! “Perlu menyediakan” menunjukkan sikap atau pendapat penulis."
          }
        },
        {
          setelah: 5,
          soal: {
            t: "Sikap yang tepat saat memakai AI untuk menulis teks eksposisi adalah …",
            o: ["Menyalin seluruh jawaban AI apa adanya", "Memakai AI untuk mencari informasi, memeriksa kebenarannya, lalu menulis dengan kata-kata sendiri", "Tidak perlu mencantumkan sumber data"],
            k: 1,
            u: "Tepat! Informasi boleh dicari, tetapi gagasan dan kalimatnya harus milikmu sendiri."
          }
        }
      ]
    },

    pos2: {
      judul: "Membangun Jembatan Argumen",
      adegan: [
        {
          v: { tipe: "sampul", ikon: "🧱", kicker: "Video interaktif · Pos 2", judul: "Membangun Jembatan Argumen", sub: "Struktur teks dan penyajian data" },
          narasi: "Selamat datang di Jembatan Argumen! Kali ini kita belajar menyusun teks eksposisi supaya kokoh seperti jembatan, sehingga pembaca mau menyeberang ke pendapat kita."
        },
        {
          v: REF("pos2", "struktur"),
          narasi: "Teks eksposisi tersusun dari tiga balok. Tesis sebagai pembuka, argumentasi sebagai isi, dan penegasan ulang sebagai penutup. Kalau satu balok hilang, jembatan tulisan kita bisa runtuh."
        },
        {
          v: REF("pos2", "resep"),
          narasi: "Supaya argumen kuat, siapkan empat bahan: alasan yang logis, bukti berupa data atau pendapat ahli, sumber yang jelas, dan kaitan kembali dengan tesis."
        },
        {
          v: REF("pos2", "lemahKuat"),
          narasi: "Coba bandingkan. Argumen lemah hanya berisi perasaan atau anggapan, seperti, semua orang tahu. Argumen kuat menjelaskan sebab dan akibatnya secara logis."
        },
        {
          v: REF("pos2", "polaData"),
          narasi: "Untuk menyajikan data, pakai pola sederhana ini: sebutkan sumbernya, sampaikan datanya, lalu jelaskan kaitannya dengan tesis, misalnya dengan ungkapan, hal ini menunjukkan bahwa."
        },
        {
          v: REF("pos2", "penanda"),
          narasi: "Terakhir, gunakan ungkapan penanda. Pertama, kedua, atau selain itu untuk argumen. Dengan demikian atau oleh karena itu untuk penegasan ulang. Ayo, bangun jembatanmu!"
        }
      ],
      kuis: [
        {
          setelah: 1,
          soal: {
            t: "Bagian teks eksposisi yang berisi data dan alasan logis disebut …",
            o: ["Tesis", "Argumentasi", "Penegasan ulang"],
            k: 1,
            u: "Tepat! Argumentasi adalah inti tulisan yang memuat alasan dan bukti."
          }
        },
        {
          setelah: 4,
          soal: {
            t: "Kalimat manakah yang menyajikan data dengan sumber yang jelas?",
            o: [
              "Banyak orang bilang membaca itu penting.",
              "Berdasarkan laporan perpustakaan sekolah, peminjaman buku meningkat setelah program literasi pagi.",
              "Membaca membuat kita pintar sekali."
            ],
            k: 1,
            u: "Benar! Kalimat itu menyebutkan sumber (laporan perpustakaan) dan datanya."
          }
        }
      ]
    },

    pos3: {
      judul: "Bengkel Bahasa",
      adegan: [
        {
          v: { tipe: "sampul", ikon: "🔎", kicker: "Video interaktif · Pos 3", judul: "Bengkel Bahasa", sub: "Menjadi penyunting yang andal" },
          narasi: "Selamat datang di Bengkel Bahasa! Di sini kamu menjadi penyunting yang memperbaiki batu sandungan dalam kalimat. Siap?"
        },
        {
          v: REF("pos3", "medsos"),
          narasi: "Kita sering menulis santai di media sosial. Itu wajar. Namun, teks eksposisi memakai bahasa formal. Singkatan seperti bgt, kata seperti gara-gara, dan tanda seru berlebihan sebaiknya diganti dengan kalimat yang baku dan objektif."
        },
        {
          v: REF("pos3", "naikKelas"),
          narasi: "Caranya, naikkan kelas kata-katamu. HP menjadi gawai. Bikin menjadi menyebabkan. Banyak banget sebaiknya diganti dengan data, misalnya sebagian besar atau tujuh puluh delapan persen."
        },
        {
          v: REF("pos3", "konjungsi"),
          narasi: "Teks eksposisi juga memakai konjungsi sebab-akibat, seperti karena, sehingga, dan akibatnya. Ada pula kata kerja mental, seperti meyakini dan menyimpulkan, yang menunjukkan kegiatan berpikir."
        },
        {
          v: REF("pos3", "ciriEfektif"),
          narasi: "Sekarang kalimat efektif. Pastikan subjek dan predikatnya jelas, hemat kata, maknanya tidak ganda, dan logis. Jangan menulis naik ke atas atau agar supaya, karena itu boros kata."
        },
        {
          v: REF("pos3", "baku"),
          narasi: "Gunakan kata baku sesuai KBBI. Tulis analisis, bukan analisa. Praktik, bukan praktek. Mengimbau, bukan menghimbau."
        },
        {
          v: REF("pos3", "ejaan"),
          narasi: "Terakhir, ejaan. Di sebagai kata depan ditulis terpisah, seperti di sekolah. Di sebagai awalan ditulis serangkai, seperti dibuang. Jangan lupa huruf kapital untuk nama diri dan tanda koma setelah oleh karena itu."
        }
      ],
      kuis: [
        {
          setelah: 2,
          soal: {
            t: "Kalimat “Gara2 HP, pelajar jadi gak bisa tidur.” paling tepat disunting menjadi …",
            o: ["Gara-gara HP, pelajar jadi tidak bisa tidur.", "Penggunaan gawai pada malam hari menyebabkan pelajar sulit tidur.", "Karena HP pelajar gak bisa tidur."],
            k: 1,
            u: "Tepat! Kalimat itu memakai kata baku (gawai, menyebabkan) dan bersifat objektif."
          }
        },
        {
          setelah: 3,
          soal: {
            t: "Hujan turun sangat deras ___ jalan di depan sekolah tergenang. Konjungsi yang tepat adalah …",
            o: ["sehingga", "tetapi", "atau"],
            k: 0,
            u: "Tepat! “Sehingga” menyatakan akibat."
          }
        },
        {
          setelah: 6,
          soal: {
            t: "Penulisan manakah yang benar menurut EYD Edisi V?",
            o: ["Sampah di buang disungai.", "Sampah dibuang di sungai.", "Sampah dibuang disungai."],
            k: 1,
            u: "Benar! “Dibuang” (awalan, serangkai) dan “di sungai” (kata depan, terpisah)."
          }
        }
      ]
    },

    pos4: {
      judul: "Mendaki Puncak Tulisan",
      adegan: [
        {
          v: { tipe: "sampul", ikon: "🏔️", kicker: "Video interaktif · Pos 4", judul: "Mendaki Puncak Tulisan", sub: "Menulis, menilai diri, dan merevisi" },
          narasi: "Penjelajah, kamu sudah sampai di kaki puncak! Saatnya menggabungkan semua bekal untuk menulis teks eksposisi utuh."
        },
        {
          v: REF("pos4", "alur"),
          narasi: "Ada lima langkah menuju puncak: tulis draf, periksa tulisan, nilai dirimu dengan jujur, revisi berdasarkan umpan balik, lalu kirim tulisan akhirmu."
        },
        {
          v: REF("pos4", "kerangka"),
          narasi: "Gunakan kerangka empat paragraf. Paragraf pertama berisi tesis. Paragraf kedua dan ketiga berisi argumen beserta data. Paragraf keempat berisi penegasan ulang."
        },
        {
          v: REF("pos4", "mengapaRevisi"),
          narasi: "Banyak penulis berhenti di draf pertama. Padahal, penulis hebat selalu merevisi. Revisi memperbaiki isi, misalnya tesis dan data. Penyuntingan memperbaiki bahasa, misalnya kata baku dan ejaan."
        },
        {
          v: REF("pos4", "jurus"),
          narasi: "Pakai jurus revisi ini: baca tulisanmu dengan nyaring, cek bukti di setiap argumen, cek kata penghubung, dan teliti ejaannya. Setiap revisi yang membuat skormu naik akan memberimu poin bonus."
        },
        {
          v: REF("pos4", "penutup"),
          narasi: "Ingat pesan Al-Qur'an dalam surah Thaha ayat seratus empat belas: Rabbi zidni ilma, ya Tuhanku, tambahkanlah kepadaku ilmu. Belajar menulis memang bertahap. Jangan tergesa-gesa, dan semangat mendaki!"
        }
      ],
      kuis: [
        {
          setelah: 2,
          soal: {
            t: "Paragraf terakhir teks eksposisi sebaiknya diawali dengan …",
            o: ["Pertama,", "Dengan demikian,", "Pada suatu hari,"],
            k: 1,
            u: "Tepat! “Dengan demikian” menandai penegasan ulang."
          }
        },
        {
          setelah: 4,
          soal: {
            t: "Apa yang sebaiknya dilakukan setelah mendapat umpan balik dari pemeriksa tulisan?",
            o: ["Langsung mengirim tanpa perubahan", "Merevisi tulisan sesuai saran, lalu memeriksanya lagi", "Menghapus seluruh tulisan"],
            k: 1,
            u: "Benar! Revisi berdasarkan umpan balik membuat tulisan lebih baik dan memberi bonus poin."
          }
        }
      ]
    }
  }
};
