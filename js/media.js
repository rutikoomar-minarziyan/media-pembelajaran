/* =========================================================
   EKSPEDISI — Isi salindia dan video interaktif tiap pos
   Jenis visual: sampul, poin, banding, contoh, struktur,
   alur, peta, chip. Butir bertanda muncul bertahap.
   ========================================================= */

const MEDIA_EKSPEDISI = {
  /* ===================== SALINDIA ===================== */
  salindia: {
    pos1: [
      { tipe: "sampul", ikon: "🧭", kicker: "Pos 1 · Prapenulisan", judul: "Menemukan Rute", sub: "Topik, tesis, dan ide pendukung" },
      {
        tipe: "poin", judul: "Apa itu teks eksposisi?",
        butir: [
          { ikon: "📄", t: "Teks nonfiksi", d: "Berdasarkan kenyataan, bukan khayalan." },
          { ikon: "💡", t: "Memaparkan gagasan", d: "Berisi pandangan penulis tentang suatu isu." },
          { ikon: "📊", t: "Didukung bukti", d: "Fakta, data, atau pendapat ahli." },
          { ikon: "🎯", t: "Singkat, padat, objektif", d: "Disampaikan secara akurat dan meyakinkan." }
        ]
      },
      {
        tipe: "banding", judul: "Topik eksposisi atau bukan?",
        kiri: { label: "Cocok (isu aktual)", nada: "ok", butir: ["Dampak gawai terhadap tidur remaja", "Sampah plastik di sekolah", "Rendahnya minat baca remaja"] },
        kanan: { label: "Kurang cocok", nada: "bad", butir: ["Pengalamanku berlibur (cerita)", "Cara membuat nasi goreng (prosedur)", "Legenda Situ Gintung (cerita rakyat)"] }
      },
      {
        tipe: "contoh", judul: "Anatomi sebuah tesis",
        bagian: [
          { t: "Penggunaan gawai di kalangan pelajar", label: "Isu", w: 1 },
          { t: "perlu dibatasi", label: "Sikap", w: 2 },
          { t: "karena mengganggu kualitas tidur.", label: "Alasan", w: 3 }
        ],
        ket: "Tesis = pernyataan (bukan pertanyaan) yang memuat sikap jelas dan dapat dibuktikan."
      },
      {
        tipe: "banding", judul: "Fakta atau opini?",
        kiri: { label: "Fakta/data", nada: "ok", butir: ["Hasil PISA 2022 menunjukkan skor literasi membaca Indonesia 359 poin.", "Sampah plastik membutuhkan waktu sangat lama untuk terurai."] },
        kanan: { label: "Opini pribadi", nada: "netral", butir: ["Membaca itu kegiatan paling menyenangkan.", "Menurut saya, pelajar sekarang malas."] }
      },
      {
        tipe: "peta", judul: "Peta gagasan = peta rute tulisan",
        pusat: "Topik",
        cabang: ["Tesis (pendapat)", "Ide pendukung 1", "Ide pendukung 2", "Fakta/data + sumber"]
      },
      {
        tipe: "sampul", ikon: "🎒", kicker: "Siap berangkat?", judul: "Bekal Pos 1",
        sub: "Pilih isu aktual · rumuskan tesis · susun dua ide pendukung · siapkan data"
      }
    ],

    pos2: [
      { tipe: "sampul", ikon: "🧱", kicker: "Pos 2 · Penulisan Draf", judul: "Membangun Argumen", sub: "Struktur teks dan penyajian data" },
      {
        tipe: "struktur", judul: "Tiga balok teks eksposisi",
        blok: [
          { ikon: "🚩", label: "Tesis", t: "Pembuka: memperkenalkan isu dan pendapat penulis." },
          { ikon: "🧱", label: "Argumentasi", t: "Isi: alasan logis + fakta, data, atau pendapat ahli (minimal dua)." },
          { ikon: "🏁", label: "Penegasan ulang", t: "Penutup: merangkum dan menegaskan kembali pendapat." }
        ]
      },
      {
        tipe: "poin", judul: "Resep argumen yang kuat",
        butir: [
          { ikon: "🧠", t: "Alasan logis", d: "Mengapa pendapatmu benar?" },
          { ikon: "📊", t: "Bukti", d: "Data, fakta, hasil survei, atau pendapat ahli." },
          { ikon: "🔗", t: "Sumber jelas", d: "“Menurut …”, “Berdasarkan survei …”." },
          { ikon: "↩️", t: "Kaitkan dengan tesis", d: "“Hal ini menunjukkan bahwa …”." }
        ]
      },
      {
        tipe: "banding", judul: "Argumen lemah vs kuat",
        kiri: { label: "Lemah", nada: "bad", butir: ["Sampah plastik itu jelek dan bikin kotor.", "Semua orang tahu sampah plastik berbahaya."] },
        kanan: { label: "Kuat", nada: "ok", butir: ["Sampah plastik sulit terurai sehingga mencemari tanah dan perairan dalam waktu lama."] }
      },
      {
        tipe: "contoh", judul: "Pola menyajikan data",
        bagian: [
          { t: "Berdasarkan survei OSIS terhadap 120 peserta didik,", label: "Sumber", w: 1 },
          { t: "sebagian besar tidur kurang dari tujuh jam.", label: "Data", w: 2 },
          { t: "Hal ini menunjukkan bahwa gawai mengganggu waktu istirahat.", label: "Kaitan", w: 3 }
        ],
        ket: "Sumber → data → kaitan dengan tesis."
      },
      {
        tipe: "chip", judul: "Ungkapan penanda struktur",
        grup: [
          { label: "Membuka argumen", chips: ["Pertama,", "Kedua,", "Selain itu,", "Di samping itu,"] },
          { label: "Penegasan ulang", chips: ["Dengan demikian,", "Oleh karena itu,", "Jadi,", "Dapat disimpulkan bahwa"] }
        ]
      },
      { tipe: "sampul", ikon: "🌉", kicker: "Siap menyeberang?", judul: "Bekal Pos 2", sub: "Tesis → argumentasi + data → penegasan ulang" }
    ],

    pos3: [
      { tipe: "sampul", ikon: "🔎", kicker: "Pos 3 · Penyuntingan", judul: "Mengasah Bahasa", sub: "Kaidah kebahasaan, kalimat efektif, dan ejaan" },
      {
        tipe: "poin", judul: "Kaidah kebahasaan teks eksposisi",
        butir: [
          { ikon: "🔬", t: "Istilah teknis", d: "ekosistem, literasi, emisi, radiasi" },
          { ikon: "🔗", t: "Konjungsi kausalitas", d: "karena, sehingga, akibatnya" },
          { ikon: "🧠", t: "Kata kerja mental", d: "meyakini, menganggap, menyimpulkan" },
          { ikon: "📣", t: "Persuasif tetapi objektif", d: "Mengajak pembaca dengan dasar data." }
        ]
      },
      {
        tipe: "chip", judul: "Konjungsi kausalitas & kata kerja mental",
        grup: [
          { label: "Sebab-akibat", chips: ["karena", "sebab", "sehingga", "akibatnya", "oleh karena itu", "maka"] },
          { label: "Kata kerja mental", chips: ["meyakini", "menganggap", "berpendapat", "memperkirakan", "menyimpulkan", "menyadari"] }
        ],
        contoh: "Para ahli meyakini bahwa kurang tidur menurunkan konsentrasi sehingga prestasi belajar terganggu."
      },
      {
        tipe: "banding", judul: "Kalimat tidak efektif → efektif",
        kiri: { label: "Tidak efektif", nada: "bad", butir: ["Para siswa-siswa hadir.", "Kami naik ke atas panggung.", "Agar supaya nilai naik …", "Bagi semua peserta didik diharapkan hadir."] },
        kanan: { label: "Efektif", nada: "ok", butir: ["Para siswa hadir.", "Kami naik ke panggung.", "Agar nilai naik …", "Semua peserta didik diharapkan hadir."] }
      },
      {
        tipe: "banding", judul: "Tidak baku → baku (KBBI)",
        kiri: { label: "Tidak baku", nada: "bad", butir: ["analisa · praktek · sistim", "resiko · karna · menghimbau", "bikin · gak · banget"] },
        kanan: { label: "Baku", nada: "ok", butir: ["analisis · praktik · sistem", "risiko · karena · mengimbau", "membuat · tidak · sangat"] }
      },
      {
        tipe: "struktur", judul: "Ejaan penting (EYD Edisi V)",
        blok: [
          { ikon: "🔠", label: "Huruf kapital", t: "Awal kalimat dan nama diri: Indonesia, Depok, Selasa." },
          { ikon: "📍", label: "di sebagai kata depan", t: "Dipisah: di sekolah, di sungai, di Indonesia." },
          { ikon: "🧩", label: "di- sebagai awalan", t: "Disambung: dibuang, digunakan, diterapkan." },
          { ikon: "✒️", label: "Tanda koma", t: "Setelah penghubung antarkalimat: Oleh karena itu, …" }
        ]
      },
      { tipe: "sampul", ikon: "🛠️", kicker: "Siap menyunting?", judul: "Bekal Pos 3", sub: "Baku · efektif · runtut · tepat ejaan" }
    ],

    pos4: [
      { tipe: "sampul", ikon: "🏔️", kicker: "Pos 4 · Penulisan & Revisi", judul: "Puncak Ekspedisi", sub: "Menulis teks eksposisi utuh, menilai diri, dan merevisi" },
      { tipe: "alur", judul: "Lima langkah menuju puncak", langkah: ["Tulis draf", "Periksa", "Nilai diri", "Revisi", "Kirim"] },
      {
        tipe: "struktur", judul: "Kerangka 4 paragraf",
        blok: [
          { ikon: "1️⃣", label: "Tesis", t: "Isu + pendapatmu (± 2–3 kalimat)." },
          { ikon: "2️⃣", label: "Argumentasi 1", t: "Alasan pertama + data/sumber." },
          { ikon: "3️⃣", label: "Argumentasi 2", t: "Alasan kedua + data/sumber." },
          { ikon: "4️⃣", label: "Penegasan ulang", t: "“Dengan demikian, …” + ajakan/saran." }
        ]
      },
      {
        tipe: "poin", judul: "Lima aspek penilaian",
        butir: [
          { ikon: "🏗️", t: "Struktur teks", d: "Lengkap, berurutan, jelas." },
          { ikon: "💬", t: "Gagasan dan argumen", d: "Minimal dua argumen + bukti." },
          { ikon: "🔗", t: "Kaidah kebahasaan", d: "Istilah teknis, konjungsi, kata kerja mental." },
          { ikon: "✍️", t: "Diksi dan kalimat efektif", d: "Baku, tepat, objektif." },
          { ikon: "✒️", t: "Ejaan dan koherensi", d: "Sesuai EYD V dan padu." }
        ]
      },
      {
        tipe: "poin", judul: "Jurus revisi",
        butir: [
          { ikon: "🗣️", t: "Baca nyaring", d: "Kalimat yang janggal akan terdengar." },
          { ikon: "📊", t: "Cek bukti", d: "Apakah setiap argumen punya data?" },
          { ikon: "🔗", t: "Cek penghubung", d: "Apakah logika sebab-akibat terlihat?" },
          { ikon: "🔍", t: "Cek ejaan", d: "Kapital, di-/di, dan tanda baca." }
        ]
      },
      { tipe: "sampul", ikon: "🚩", kicker: "Ayo mendaki!", judul: "Puncak menantimu", sub: "Tulis · periksa · revisi · banggakan karyamu" }
    ]
  },

  /* ===================== VIDEO INTERAKTIF ===================== */
  video: {
    pos1: {
      judul: "Menemukan Rute Tulisan",
      adegan: [
        {
          v: { tipe: "sampul", ikon: "🧭", kicker: "Video interaktif · Pos 1", judul: "Menemukan Rute Tulisan", sub: "Bersama Kak Rani, pemandu ekspedisi" },
          narasi: "Halo, penjelajah! Aku Kak Rani, pemandu ekspedisimu. Hari ini kita belajar menemukan rute tulisan, yaitu langkah pertama menulis teks eksposisi."
        },
        {
          v: MEDIA_REF("pos1", 1),
          narasi: "Teks eksposisi adalah teks nonfiksi yang memaparkan gagasan penulis tentang suatu isu. Gagasan itu harus didukung bukti, seperti fakta, data, atau pendapat ahli, dan disampaikan secara singkat, padat, serta objektif."
        },
        {
          v: MEDIA_REF("pos1", 2),
          narasi: "Langkah pertama adalah memilih topik. Pilihlah isu aktual yang dekat dengan kehidupan dan dapat dibuktikan dengan data. Cerita liburan, resep, atau legenda bukan topik eksposisi."
        },
        {
          v: MEDIA_REF("pos1", 3),
          narasi: "Setelah topik ditemukan, rumuskan tesis. Tesis yang baik memiliki tiga unsur: isu yang dibahas, sikap penulis, dan alasan singkat. Perhatikan, tesis selalu berbentuk pernyataan, bukan pertanyaan."
        },
        {
          v: MEDIA_REF("pos1", 4),
          narasi: "Agar tesis dapat dipercaya, kumpulkan fakta atau data. Fakta dapat diperiksa kebenarannya, misalnya hasil PISA tahun 2022. Sementara itu, opini adalah perasaan pribadi yang belum tentu benar bagi semua orang."
        },
        {
          v: MEDIA_REF("pos1", 5),
          narasi: "Terakhir, susun semuanya dalam peta gagasan: topik di tengah, lalu tesis, ide pendukung, dan data beserta sumbernya. Peta ini akan menjadi peta rute tulisanmu sampai ke puncak. Selamat berlatih!"
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
          setelah: 3,
          soal: {
            t: "Unsur tesis “Sekolah perlu menyediakan tempat sampah terpilah karena sampah sulit didaur ulang.” yang menunjukkan SIKAP penulis adalah …",
            o: ["Sekolah", "perlu menyediakan", "karena sampah sulit didaur ulang"],
            k: 1,
            u: "Benar! “Perlu menyediakan” menunjukkan sikap atau pendapat penulis."
          }
        }
      ]
    },

    pos2: {
      judul: "Membangun Jembatan Argumen",
      adegan: [
        {
          v: { tipe: "sampul", ikon: "🧱", kicker: "Video interaktif · Pos 2", judul: "Membangun Jembatan Argumen", sub: "Struktur teks dan penyajian data" },
          narasi: "Selamat datang di Jembatan Argumen! Kali ini kita akan belajar menyusun struktur teks eksposisi agar tulisan kita kokoh seperti jembatan."
        },
        {
          v: MEDIA_REF("pos2", 1),
          narasi: "Teks eksposisi tersusun dari tiga balok. Tesis sebagai pembuka, argumentasi sebagai isi, dan penegasan ulang sebagai penutup. Jika satu balok hilang, jembatan tulisan kita akan runtuh."
        },
        {
          v: MEDIA_REF("pos2", 2),
          narasi: "Argumen yang kuat memiliki empat bahan: alasan yang logis, bukti berupa data atau pendapat ahli, sumber yang jelas, dan kaitan kembali dengan tesis."
        },
        {
          v: MEDIA_REF("pos2", 3),
          narasi: "Bandingkan dua argumen ini. Argumen lemah hanya berisi perasaan atau anggapan umum. Argumen kuat menjelaskan alasan dan akibatnya secara logis."
        },
        {
          v: MEDIA_REF("pos2", 4),
          narasi: "Gunakan pola sederhana untuk menyajikan data: sebutkan sumbernya, sampaikan datanya, lalu jelaskan kaitannya dengan tesis menggunakan ungkapan seperti, hal ini menunjukkan bahwa."
        },
        {
          v: MEDIA_REF("pos2", 5),
          narasi: "Ungkapan penanda membantu pembaca mengikuti alur. Gunakan pertama, kedua, atau selain itu untuk argumen, serta dengan demikian atau oleh karena itu untuk penegasan ulang. Ayo, bangun jembatanmu!"
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
          narasi: "Selamat datang di Bengkel Bahasa! Di sini kamu akan menjadi penyunting yang memperbaiki batu sandungan dalam kalimat."
        },
        {
          v: MEDIA_REF("pos3", 1),
          narasi: "Teks eksposisi memiliki kaidah kebahasaan khusus, yaitu istilah teknis, konjungsi kausalitas, kata kerja mental, dan gaya bahasa yang persuasif tetapi tetap objektif."
        },
        {
          v: MEDIA_REF("pos3", 2),
          narasi: "Konjungsi kausalitas, seperti karena, sehingga, dan akibatnya, menghubungkan sebab dan akibat. Kata kerja mental, seperti meyakini dan menyimpulkan, menunjukkan aktivitas berpikir."
        },
        {
          v: MEDIA_REF("pos3", 3),
          narasi: "Kalimat efektif tidak boros kata. Jangan menulis naik ke atas atau agar supaya. Pastikan juga kalimat memiliki subjek yang jelas."
        },
        {
          v: MEDIA_REF("pos3", 4),
          narasi: "Gunakan kata baku sesuai KBBI. Tulis analisis, bukan analisa. Praktik, bukan praktek. Mengimbau, bukan menghimbau. Hindari pula bahasa percakapan seperti bikin dan banget."
        },
        {
          v: MEDIA_REF("pos3", 5),
          narasi: "Terakhir, perhatikan ejaan. Di sebagai kata depan ditulis terpisah, sedangkan di sebagai awalan ditulis serangkai. Gunakan huruf kapital untuk nama diri dan tanda koma setelah penghubung antarkalimat."
        }
      ],
      kuis: [
        {
          setelah: 2,
          soal: {
            t: "Hujan turun sangat deras ___ jalan di depan sekolah tergenang. Konjungsi yang tepat adalah …",
            o: ["sehingga", "tetapi", "atau"],
            k: 0,
            u: "Tepat! “Sehingga” menyatakan akibat."
          }
        },
        {
          setelah: 5,
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
          v: MEDIA_REF("pos4", 1),
          narasi: "Ada lima langkah menuju puncak: tulis draf, periksa tulisan, nilai dirimu dengan jujur, revisi berdasarkan umpan balik, lalu kirim tulisan akhirmu."
        },
        {
          v: MEDIA_REF("pos4", 2),
          narasi: "Gunakan kerangka empat paragraf. Paragraf pertama berisi tesis. Paragraf kedua dan ketiga berisi argumen beserta data. Paragraf keempat berisi penegasan ulang."
        },
        {
          v: MEDIA_REF("pos4", 3),
          narasi: "Tulisanmu akan dinilai dari lima aspek: struktur teks, gagasan dan argumen, kaidah kebahasaan, diksi dan kalimat efektif, serta ejaan dan koherensi."
        },
        {
          v: MEDIA_REF("pos4", 4),
          narasi: "Saat merevisi, bacalah tulisanmu dengan nyaring, periksa bukti pada setiap argumen, cek kata penghubung, dan teliti ejaannya. Setiap revisi yang meningkatkan skor memberimu poin bonus. Semangat mendaki!"
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

/* Rujukan ke salindia agar visual video selaras dengan salindia */
function MEDIA_REF(pos, i) {
  return { ref: [pos, i] };
}
