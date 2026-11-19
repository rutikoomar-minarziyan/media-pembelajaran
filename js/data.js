/* =========================================================
   EKSPEDISI — Bank materi, misi, dan soal
   Disusun mengikuti Tabel 1.2 (Rancangan Ringkas Pos),
   Tabel 2.1 (Sintesis Kajian Teori), dan Tabel 3.7 (Rubrik).
   Guru/peneliti dapat menyunting isi berkas ini tanpa
   mengubah logika aplikasi (js/app.js).
   ========================================================= */

const EKSPEDISI = {
  judul: "Ekspedisi",
  subjudul: "Menjelajah Teks Eksposisi",
  sasaran: "Kelas X SMA (Fase E)",

  capaian:
    "Peserta didik mampu menulis gagasan, pikiran, dan pandangan untuk berbagai tujuan secara logis, kritis, dan kreatif (Capaian Pembelajaran Bahasa Indonesia Fase E, elemen menulis).",

  tujuan: [
    "Menentukan topik berupa isu aktual dan merumuskan tesis yang jelas.",
    "Menyusun struktur teks eksposisi (tesis, argumentasi, penegasan ulang) secara runtut.",
    "Mengembangkan argumen yang didukung fakta, data, atau pendapat ahli.",
    "Menggunakan kaidah kebahasaan teks eksposisi: istilah teknis, konjungsi kausalitas, dan kata kerja mental.",
    "Menggunakan diksi baku, kalimat efektif, serta ejaan dan tanda baca sesuai EYD Edisi V.",
    "Menulis, menilai diri, dan merevisi teks eksposisi utuh tiga sampai empat paragraf."
  ],

  /* ---------- Aturan main gamifikasi ---------- */
  aturan: {
    poinSoal: 10,          // poin tiap soal/misi kecil yang tuntas
    poinMisiTulis: 30,     // poin misi menulis (peta gagasan, argumen)
    poinTulisanAkhir: 50,  // poin menyelesaikan tulisan akhir Pos 4
    poinBonusRevisi: 30,   // bonus revisi maksimum
    poinPenilaianDiri: 10, // poin mengisi daftar periksa
    poinSalindia: 5,       // menyimak salindia satu pos hingga akhir
    poinVideo: 10          // menuntaskan video interaktif satu pos
  },

  lencana: {
    pos1: { nama: "Penemu Gagasan", ikon: "🧭", ket: "Menuntaskan Pos 1: Menemukan Rute" },
    pos2: { nama: "Penyusun Argumen", ikon: "🧱", ket: "Menuntaskan Pos 2: Membangun Argumen" },
    pos3: { nama: "Penyunting Andal", ikon: "🔎", ket: "Menuntaskan Pos 3: Mengasah Bahasa" },
    pos4: { nama: "Penjelajah Ulung", ikon: "🏔️", ket: "Mencapai Puncak Ekspedisi" },
    sempurna: { nama: "Langkah Mantap", ikon: "⭐", ket: "Menjawab seluruh soal satu pos tepat pada percobaan pertama" },
    perevisi: { nama: "Pantang Menyerah", ikon: "🔁", ket: "Merevisi tulisan akhir hingga skor periksa meningkat" },
    tekun: { nama: "Pembelajar Tekun", ikon: "🎬", ket: "Menyimak semua salindia dan menuntaskan semua video interaktif" }
  },

  /* ---------- Daftar pos ---------- */
  pos: [
    {
      id: "pos1",
      nomor: 1,
      nama: "Menemukan Rute",
      tahap: "Prapenulisan",
      fokus: "Menentukan topik, tesis (pendapat), dan ide pendukung",
      cerita:
        "Penjelajah, ekspedisimu dimulai di Lembah Gagasan. Sebelum berangkat, kamu harus menentukan tujuan perjalanan: isu apa yang akan kamu bahas dan pendapat apa yang ingin kamu buktikan. Tanpa peta rute, penjelajah mudah tersesat!",
      materi: [
        {
          judul: "Apa itu teks eksposisi?",
          isi:
            "Teks eksposisi adalah teks nonfiksi yang memaparkan gagasan atau pandangan penulis tentang suatu isu, disertai argumentasi berupa fakta, data, atau pendapat ahli agar dapat dipercaya. Teks ini disampaikan secara singkat, padat, objektif, dan akurat."
        },
        {
          judul: "Memilih topik: isu aktual",
          isi:
            "Topik yang baik untuk teks eksposisi adalah isu aktual, yaitu masalah yang sedang hangat, dekat dengan kehidupan, dan dapat dibuktikan dengan data. Contoh: penggunaan gawai pada remaja, sampah plastik, atau minat baca pelajar. Cerita pengalaman, resep, dan dongeng bukan topik eksposisi."
        },
        {
          judul: "Merumuskan tesis",
          isi:
            "Tesis adalah pendapat utama penulis terhadap isu. Tesis berbentuk pernyataan (bukan pertanyaan), memuat sikap yang jelas, dan dapat dibuktikan. Kata seperti <em>perlu</em>, <em>harus</em>, <em>sebaiknya</em>, atau <em>penting</em> sering menandai sikap penulis.<br><span class='contoh'>Contoh: Sekolah perlu membatasi penggunaan gawai saat jam pelajaran karena penggunaan berlebihan menurunkan konsentrasi belajar.</span>"
        },
        {
          judul: "Peta gagasan = peta rute tulisan",
          isi:
            "Sebelum menulis, susunlah peta gagasan: (1) topik, (2) tesis, (3) dua atau tiga ide pendukung, dan (4) fakta atau data yang memperkuat setiap ide. Peta ini akan menuntunmu hingga puncak ekspedisi."
        }
      ],
      misi: [
        {
          id: "p1m1",
          judul: "Misi 1 — Pilih Jalur yang Tepat",
          jenis: "kuis",
          petunjuk: "Pilih jawaban yang paling tepat. Jika keliru, kamu boleh mencoba lagi tanpa pengurangan poin.",
          soal: [
            {
              t: "Manakah topik yang paling tepat dikembangkan menjadi teks eksposisi?",
              o: [
                "Pengalamanku berlibur ke Bandung bersama keluarga",
                "Dampak penggunaan gawai berlebihan terhadap kualitas tidur remaja",
                "Cara membuat nasi goreng yang lezat",
                "Legenda terjadinya Situ Gintung"
              ],
              k: 1,
              u: "Tepat! Isu gawai dan kualitas tidur remaja bersifat aktual dan dapat dibuktikan dengan data. Pilihan lain termasuk teks cerita pengalaman, prosedur, dan cerita rakyat."
            },
            {
              t: "Manakah yang merupakan pernyataan tesis yang baik?",
              o: [
                "Berapa jam kamu menggunakan gawai setiap hari?",
                "Gawai adalah perangkat elektronik yang dapat dibawa ke mana-mana.",
                "Pelajar perlu membatasi waktu layar karena penggunaan gawai berlebihan mengganggu kualitas tidur.",
                "Saya suka bermain gim di gawai."
              ],
              k: 2,
              u: "Benar! Tesis berbentuk pernyataan, memuat sikap yang jelas (perlu membatasi), dan dapat dibuktikan. Pilihan lain berupa pertanyaan, definisi umum, atau kesukaan pribadi."
            },
            {
              t: "Tesis: “Sekolah perlu memperbanyak ruang terbuka hijau.” Ide pendukung yang paling relevan adalah …",
              o: [
                "Kantin sekolah menjual banyak jenis makanan.",
                "Ruang terbuka hijau menurunkan suhu lingkungan dan dapat menjadi tempat belajar di luar kelas.",
                "Saya pernah menanam bunga mawar di rumah.",
                "Lapangan basket sekolah sedang diperbaiki."
              ],
              k: 1,
              u: "Tepat! Ide pendukung harus berkaitan langsung dengan tesis dan menjelaskan alasan mengapa pendapat itu benar."
            },
            {
              t: "Manakah yang berupa fakta atau data, bukan opini?",
              o: [
                "Membaca adalah kegiatan yang paling menyenangkan.",
                "Hasil PISA 2022 menunjukkan skor literasi membaca Indonesia sebesar 359 poin.",
                "Menurut saya, pelajar sekarang malas membaca.",
                "Buku cetak jauh lebih seru daripada buku digital."
              ],
              k: 1,
              u: "Benar! Fakta atau data dapat diperiksa kebenarannya dan biasanya memuat sumber serta angka. Pilihan lain merupakan opini pribadi."
            }
          ]
        },
        {
          id: "p1m2",
          judul: "Misi 2 — Susun Peta Rute (Peta Gagasan)",
          jenis: "petaGagasan",
          petunjuk:
            "Pilih satu isu aktual (atau tulis isumu sendiri), lalu lengkapi peta gagasanmu. Peta ini akan tersimpan dan dipakai kembali di Pos 2 dan Pos 4.",
          pilihanTopik: [
            "Penggunaan gawai pada pelajar",
            "Sampah plastik di lingkungan sekolah",
            "Rendahnya minat baca remaja",
            "Kebiasaan sarapan sebelum berangkat sekolah",
            "Bahaya berita bohong (hoaks) di media sosial",
            "Pemanfaatan kecerdasan buatan dalam belajar"
          ]
        }
      ]
    },

    {
      id: "pos2",
      nomor: 2,
      nama: "Membangun Argumen",
      tahap: "Penulisan Draf",
      fokus: "Struktur teks (tesis, argumentasi, penegasan ulang) dan penyajian fakta atau data",
      cerita:
        "Rute sudah ditemukan! Kini kamu tiba di Jembatan Argumen. Jembatan ini hanya kokoh jika balok-baloknya tersusun berurutan: tesis di awal, argumentasi di tengah, dan penegasan ulang di akhir. Susunlah dengan cermat agar kamu bisa menyeberang.",
      materi: [
        {
          judul: "1. Tesis (pernyataan pendapat)",
          isi:
            "Bagian pembuka yang memperkenalkan isu sekaligus menyampaikan sudut pandang atau pendapat awal penulis terhadap topik."
        },
        {
          judul: "2. Argumentasi",
          isi:
            "Inti tulisan yang memuat alasan logis, data, fakta, atau pendapat ahli untuk memperkuat tesis. Teks yang baik memuat <strong>minimal dua argumen</strong>, masing-masing didukung bukti."
        },
        {
          judul: "3. Penegasan ulang",
          isi:
            "Bagian penutup yang merangkum inti bahasan dan menegaskan kembali pendapat penulis berdasarkan fakta yang telah dipaparkan. Biasanya diawali ungkapan seperti <em>dengan demikian</em>, <em>oleh karena itu</em>, atau <em>jadi</em>."
        },
        {
          judul: "Cara menyajikan data",
          isi:
            "Sebutkan sumbernya agar argumen kredibel.<br><span class='contoh'>Contoh: Berdasarkan survei OSIS terhadap 120 peserta didik, sebagian besar mengaku tidur kurang dari tujuh jam karena bermain gawai.</span>"
        }
      ],
      misi: [
        {
          id: "p2m1",
          judul: "Misi 1 — Susun Balok Jembatan",
          jenis: "urutkan",
          petunjuk:
            "Paragraf berikut diacak. Gunakan tombol ▲ dan ▼ untuk menyusunnya menjadi teks eksposisi yang runtut, lalu tekan Periksa.",
          judulTeks: "Pentingnya Sarapan bagi Pelajar",
          paragraf: [
            {
              bag: "Tesis",
              t: "Sarapan sering dianggap sepele oleh pelajar. Padahal, sarapan merupakan kebiasaan penting yang perlu dibiasakan sebelum berangkat ke sekolah karena berpengaruh langsung terhadap kesiapan belajar."
            },
            {
              bag: "Argumentasi 1",
              t: "Pertama, sarapan menyediakan energi bagi otak setelah tubuh berpuasa sepanjang malam. Para ahli gizi meyakini bahwa asupan karbohidrat dan protein di pagi hari membantu menjaga konsentrasi sehingga pelajar lebih mudah memahami pelajaran."
            },
            {
              bag: "Argumentasi 2",
              t: "Kedua, pelajar yang melewatkan sarapan cenderung mengonsumsi jajanan tidak sehat pada jam istirahat. Kebiasaan tersebut dapat mengakibatkan asupan gula dan garam berlebih yang berdampak buruk bagi kesehatan dalam jangka panjang."
            },
            {
              bag: "Penegasan ulang",
              t: "Dengan demikian, sarapan bukan sekadar kebiasaan, melainkan kebutuhan. Oleh karena itu, pelajar dan orang tua perlu meluangkan waktu untuk sarapan bergizi setiap pagi demi mendukung prestasi belajar."
            }
          ]
        },
        {
          id: "p2m2",
          judul: "Misi 2 — Kenali Balok Bangunan",
          jenis: "kuis",
          petunjuk: "Tentukan bagian struktur teks eksposisi dari setiap kutipan berikut.",
          soal: [
            {
              t: "“Oleh karena itu, penggunaan kantong plastik sekali pakai harus dikurangi mulai dari lingkungan sekolah.” Kutipan ini termasuk bagian …",
              o: ["Tesis", "Argumentasi", "Penegasan ulang"],
              k: 2,
              u: "Tepat! Ungkapan “oleh karena itu” dan isi yang menegaskan kembali sikap penulis menandai penegasan ulang."
            },
            {
              t: "“Hoaks di media sosial kian meresahkan. Masyarakat, terutama pelajar, perlu dibekali kemampuan memeriksa kebenaran informasi.” Kutipan ini termasuk bagian …",
              o: ["Tesis", "Argumentasi", "Penegasan ulang"],
              k: 0,
              u: "Benar! Kutipan ini memperkenalkan isu dan menyatakan pendapat awal penulis, ciri khas tesis."
            },
            {
              t: "“Hasil PISA 2022 menunjukkan skor literasi membaca Indonesia sebesar 359 poin. Angka ini menandakan kemampuan memahami bacaan masih perlu ditingkatkan.” Kutipan ini termasuk bagian …",
              o: ["Tesis", "Argumentasi", "Penegasan ulang"],
              k: 1,
              u: "Tepat! Kutipan ini menyajikan data sebagai bukti pendukung pendapat, ciri khas argumentasi."
            },
            {
              t: "Argumen manakah yang paling kuat?",
              o: [
                "Sampah plastik itu jelek dan bikin kotor.",
                "Semua orang tahu sampah plastik berbahaya.",
                "Sampah plastik sulit terurai dan dapat bertahan ratusan tahun di alam sehingga mencemari tanah dan perairan.",
                "Saya tidak suka melihat sampah plastik."
              ],
              k: 2,
              u: "Benar! Argumen yang kuat menyajikan alasan logis dan fakta, bukan perasaan pribadi atau anggapan umum."
            }
          ]
        },
        {
          id: "p2m3",
          judul: "Misi 3 — Tulis Dua Argumen",
          jenis: "tulisArgumen",
          petunjuk:
            "Berdasarkan tesis pada peta gagasanmu, tulislah dua argumen. Setiap argumen berisi alasan logis dan didukung fakta, data, atau pendapat ahli (sebutkan sumbernya)."
        }
      ]
    },

    {
      id: "pos3",
      nomor: 3,
      nama: "Mengasah Bahasa",
      tahap: "Penyuntingan",
      fokus: "Diksi, kalimat efektif, konjungsi kausalitas, istilah teknis, kata kerja mental, dan ejaan",
      cerita:
        "Jembatan berhasil kamu seberangi! Di Bengkel Bahasa, kamu bertugas sebagai pengoreksi teks. Setiap kalimat yang keliru adalah batu sandungan di jalur ekspedisi. Temukan dan perbaiki sebanyak mungkin. Tenang saja, penjelajah boleh salah arah lalu kembali ke jalur.",
      materi: [
        {
          judul: "Istilah teknis",
          isi:
            "Teks eksposisi memakai istilah sesuai bidang topik, misalnya <em>ekosistem</em>, <em>literasi</em>, <em>emisi</em>, atau <em>radiasi</em>. Gunakan bentuk baku sesuai KBBI."
        },
        {
          judul: "Konjungsi kausalitas",
          isi:
            "Kata hubung sebab-akibat mempererat logika antarargumen: <em>karena, sebab, sehingga, akibatnya, oleh karena itu, oleh sebab itu, maka, dengan demikian</em>."
        },
        {
          judul: "Kata kerja mental",
          isi:
            "Kata kerja yang menunjukkan aktivitas berpikir atau persepsi: <em>meyakini, menganggap, berpendapat, memperkirakan, menyimpulkan, menyadari, memahami</em>."
        },
        {
          judul: "Kalimat efektif dan diksi baku",
          isi:
            "Kalimat efektif memiliki subjek dan predikat yang jelas, tidak boros kata (hindari <em>naik ke atas</em>, <em>para siswa-siswa</em>), dan memakai kata baku. Hindari bahasa percakapan seperti <em>bikin, gak, banget, aja</em>."
        },
        {
          judul: "Ejaan (EYD Edisi V)",
          isi:
            "Perhatikan huruf kapital pada nama diri dan awal kalimat, penulisan <em>di</em> sebagai kata depan (dipisah: <em>di sekolah</em>) dan sebagai awalan (disambung: <em>dibuang</em>), serta tanda baca."
        }
      ],
      misi: [
        {
          id: "p3m1",
          judul: "Misi 1 — Pilih Kalimat yang Efektif",
          jenis: "kuis",
          petunjuk: "Pilih kalimat yang paling efektif dan baku. Percobaan ulang tidak mengurangi poin.",
          soal: [
            {
              t: "Manakah kalimat yang efektif?",
              o: [
                "Para siswa-siswa sedang mengerjakan tugas di perpustakaan.",
                "Bagi semua peserta didik diharapkan hadir tepat waktu.",
                "Semua peserta didik diharapkan hadir tepat waktu.",
                "Kami naik ke atas panggung untuk menerima penghargaan."
              ],
              k: 2,
              u: "Tepat! Pilihan lain mengandung pemborosan kata (para … -siswa, naik ke atas) atau subjek yang tidak jelas karena diawali kata depan “bagi”."
            },
            {
              t: "Kalimat “Gawai bikin pelajar jadi males belajar banget.” paling tepat disunting menjadi …",
              o: [
                "Gawai bikin pelajar malas belajar.",
                "Penggunaan gawai yang berlebihan membuat pelajar malas belajar.",
                "Gawai membuat pelajar jadi males belajar sekali.",
                "Gawai itu bikin pelajar sangat malas sekali belajar."
              ],
              k: 1,
              u: "Benar! Kalimat itu memakai diksi baku (membuat, malas), lebih objektif, dan tidak boros (sangat … sekali)."
            },
            {
              t: "Manakah kalimat yang tidak boros kata?",
              o: [
                "Penelitian itu membuktikan bahwa membaca rutin meningkatkan kosakata.",
                "Agar supaya nilai meningkat, pelajar harus rajin membaca.",
                "Jumlah sampah plastik sangat banyak sekali.",
                "Menurut pendapat saya, sampah harus dipilah."
              ],
              k: 0,
              u: "Tepat! “Agar supaya”, “sangat … sekali”, dan “menurut pendapat saya” merupakan bentuk pleonasme (boros kata)."
            },
            {
              t: "Manakah penulisan istilah yang baku?",
              o: [
                "analisa, praktek, sistim",
                "analisis, praktik, sistem",
                "analisis, praktek, sistim",
                "analisa, praktik, sistem"
              ],
              k: 1,
              u: "Benar! Bentuk baku menurut KBBI adalah analisis, praktik, dan sistem."
            }
          ]
        },
        {
          id: "p3m2",
          judul: "Misi 2 — Sambungkan dengan Konjungsi",
          jenis: "kuis",
          petunjuk: "Lengkapi kalimat dengan konjungsi atau kata kerja mental yang tepat.",
          soal: [
            {
              t: "Banyak pelajar mengantuk di kelas ___ kurang tidur pada malam hari.",
              o: ["tetapi", "karena", "kemudian", "meskipun"],
              k: 1,
              u: "Tepat! “Karena” menyatakan sebab: mengantuk disebabkan kurang tidur."
            },
            {
              t: "Hutan di hulu sungai terus ditebang ___ banjir kerap melanda kawasan hilir.",
              o: ["sehingga", "sedangkan", "lalu", "walaupun"],
              k: 0,
              u: "Benar! “Sehingga” menyatakan akibat dari penebangan hutan."
            },
            {
              t: "Penggunaan kendaraan pribadi terus meningkat. ___, kemacetan di kota besar semakin parah.",
              o: ["Namun", "Selain itu", "Akibatnya", "Sementara itu"],
              k: 2,
              u: "Tepat! “Akibatnya” adalah konjungsi antarkalimat yang menyatakan hubungan sebab-akibat."
            },
            {
              t: "Para ahli ___ bahwa membaca sejak dini dapat meningkatkan kemampuan berpikir kritis. Kata kerja mental yang tepat adalah …",
              o: ["berlari", "meyakini", "menulis", "membeli"],
              k: 1,
              u: "Benar! “Meyakini” merupakan kata kerja mental karena menunjukkan aktivitas berpikir."
            },
            {
              t: "Istilah teknis yang paling tepat untuk topik pencemaran laut adalah …",
              o: ["ekosistem", "kekasih", "liburan", "lezat"],
              k: 0,
              u: "Tepat! “Ekosistem” adalah istilah teknis bidang lingkungan."
            }
          ]
        },
        {
          id: "p3m3",
          judul: "Misi 3 — Buru Batu Sandungan (Ejaan)",
          jenis: "buruKesalahan",
          petunjuk:
            "Ketuk setiap kata yang penulisannya keliru menurut EYD Edisi V dan KBBI, lalu tekan Periksa. Ada 5 kesalahan yang tersembunyi.",
          teks: [
            { t: "Sampah" }, { t: "plastik" }, { t: "merupakan" }, { t: "masalah" }, { t: "serius" }, { t: "di" },
            { t: "indonesia.", f: "Indonesia." },
            { t: "Setiap" }, { t: "hari," }, { t: "ribuan" }, { t: "ton" }, { t: "sampah" }, { t: "plastik" },
            { t: "di buang", f: "dibuang" },
            { t: "ke" }, { t: "sungai" }, { t: "dan" }, { t: "laut." }, { t: "Kondisi" }, { t: "ini" }, { t: "mengakibatkan" },
            { t: "ekosistim", f: "ekosistem" },
            { t: "laut" }, { t: "rusak." }, { t: "Oleh" },
            { t: "karna", f: "karena" },
            { t: "itu," }, { t: "pemerintah" },
            { t: "menghimbau", f: "mengimbau" },
            { t: "masyarakat" }, { t: "untuk" }, { t: "mengurangi" }, { t: "pemakaian" }, { t: "kantong" }, { t: "plastik." }
          ]
        }
      ]
    },

    {
      id: "pos4",
      nomor: 4,
      nama: "Puncak Ekspedisi",
      tahap: "Penulisan & Revisi",
      fokus: "Menulis teks eksposisi utuh, menilai diri, lalu merevisi",
      cerita:
        "Inilah tantangan terakhir: Puncak Ekspedisi! Gunakan peta rute, argumen, dan keterampilan bahasa yang telah kamu kumpulkan untuk menulis teks eksposisi utuh. Periksa tulisanmu, nilai dirimu dengan jujur, lalu revisi. Setiap revisi yang membuat tulisanmu lebih baik memberi poin bonus.",
      materi: [
        {
          judul: "Ketentuan tulisan",
          isi:
            "Tulislah teks eksposisi <strong>tiga sampai empat paragraf</strong> (sekitar 150–350 kata) dengan judul. Paragraf pertama berisi tesis, paragraf tengah berisi argumentasi beserta data, dan paragraf terakhir berisi penegasan ulang. Pisahkan paragraf dengan baris kosong (tekan Enter dua kali)."
        },
        {
          judul: "Langkah di puncak",
          isi:
            "1) Tulis draf → 2) Tekan <em>Periksa Tulisan</em> untuk mendapat umpan balik cepat → 3) Isi daftar periksa penilaian diri → 4) Revisi tulisan sesuai saran → 5) Kirim tulisan akhir."
        }
      ],
      misi: [
        { id: "p4m1", judul: "Misi Puncak — Tulis, Periksa, Revisi", jenis: "tulisAkhir" }
      ]
    }
  ],

  /* ---------- Rubrik (Tabel 3.7) ---------- */
  rubrik: [
    {
      aspek: "Struktur teks",
      d: [
        "Struktur tidak tampak atau hanya satu bagian",
        "Salah satu bagian tidak ada atau tidak dapat dibedakan",
        "Ketiga bagian ada, tetapi satu bagian kurang jelas atau urutan kurang runtut",
        "Tesis, argumentasi, dan penegasan ulang lengkap, berurutan, dan jelas"
      ]
    },
    {
      aspek: "Gagasan dan argumen",
      d: [
        "Tesis dan argumen tidak dapat dikenali",
        "Tesis kurang jelas; argumen tidak didukung fakta",
        "Tesis jelas; argumen logis tetapi dukungan fakta terbatas",
        "Tesis jelas; minimal dua argumen logis didukung fakta, data, atau pendapat ahli"
      ]
    },
    {
      aspek: "Kaidah kebahasaan eksposisi",
      d: [
        "Unsur kaidah kebahasaan hampir tidak tampak",
        "Hanya satu atau dua unsur muncul atau banyak yang tidak tepat",
        "Ketiga unsur muncul, sebagian kurang tepat",
        "Istilah teknis, konjungsi kausalitas, dan kata kerja mental dipakai tepat dan konsisten"
      ]
    },
    {
      aspek: "Diksi dan kalimat efektif",
      d: [
        "Sebagian besar kalimat tidak efektif sehingga makna kabur",
        "Diksi sering tidak tepat atau tidak baku; banyak kalimat tidak efektif",
        "Diksi umumnya tepat; sebagian kecil kalimat tidak efektif",
        "Diksi baku, tepat, dan objektif; hampir semua kalimat efektif"
      ]
    },
    {
      aspek: "Ejaan, tanda baca, dan koherensi",
      d: [
        "Lebih dari 10 kesalahan; tidak padu",
        "6–10 kesalahan; keterpaduan kurang",
        "3–5 kesalahan; keterpaduan umumnya baik",
        "Paling banyak 2 kesalahan ejaan dan tanda baca (EYD Edisi V); antarkalimat dan antarparagraf padu"
      ]
    }
  ],

  /* ---------- Kamus untuk pemeriksa otomatis Pos 4 ---------- */
  kamus: {
    kausalitas: [
      "karena", "sebab", "sehingga", "akibatnya", "oleh karena itu", "oleh sebab itu",
      "maka", "dengan demikian", "akibat", "disebabkan", "menyebabkan", "mengakibatkan", "karenanya"
    ],
    mental: [
      "meyakini", "yakin", "menganggap", "berpendapat", "memperkirakan", "menyimpulkan", "menyadari",
      "memahami", "menduga", "mengira", "menilai", "berasumsi", "mempertimbangkan", "memprediksi",
      "berpikir", "merasa", "mengetahui", "percaya"
    ],
    penanda_data: [
      "menurut", "data", "survei", "penelitian", "hasil", "persen", "%", "riset", "laporan",
      "berdasarkan", "studi", "ahli", "statistik"
    ],
    penegasan: [
      "dengan demikian", "jadi", "oleh karena itu", "oleh sebab itu", "dapat disimpulkan",
      "kesimpulannya", "simpulannya", "pada akhirnya", "dengan kata lain", "maka dari itu"
    ],
    // kata tidak baku/percakapan → saran bentuk baku
    tidakBaku: {
      "gak": "tidak", "nggak": "tidak", "ngga": "tidak", "ga": "tidak", "enggak": "tidak",
      "bikin": "membuat", "aja": "saja", "banget": "sangat", "udah": "sudah", "udh": "sudah",
      "kayak": "seperti", "gimana": "bagaimana", "emang": "memang", "males": "malas",
      "cuma": "hanya", "kalo": "kalau/jika", "pake": "pakai/menggunakan", "tau": "tahu",
      "sih": "(hapus)", "dong": "(hapus)", "deh": "(hapus)", "gue": "saya", "gua": "saya",
      "lo": "Anda/kamu", "lu": "Anda/kamu", "dapet": "dapat", "ngerti": "mengerti",
      "liat": "lihat", "bener": "benar", "pengen": "ingin", "pingin": "ingin", "nyari": "mencari",
      "makin": "semakin", "gitu": "begitu", "gini": "begini", "yg": "yang", "dgn": "dengan",
      "tdk": "tidak", "krn": "karena", "utk": "untuk", "jd": "jadi", "sdh": "sudah", "bgt": "sangat",
      "analisa": "analisis", "praktek": "praktik", "sistim": "sistem", "resiko": "risiko",
      "karna": "karena", "menghimbau": "mengimbau", "himbauan": "imbauan", "aktifitas": "aktivitas",
      "kwalitas": "kualitas", "nasehat": "nasihat", "merubah": "mengubah", "ijin": "izin",
      "jaman": "zaman", "apotik": "apotek", "efektifitas": "efektivitas", "obyek": "objek",
      "subyek": "subjek", "hutang": "utang", "ekosistim": "ekosistem", "kreatifitas": "kreativitas",
      "produktifitas": "produktivitas", "sekedar": "sekadar", "tehnologi": "teknologi",
      "tekhnologi": "teknologi", "telpon": "telepon", "fikir": "pikir", "berfikir": "berpikir",
      "pemikiran2": "pemikiran-pemikiran", "dimana": "di mana", "kemaren": "kemarin",
      "rubah": "ubah", "trampil": "terampil", "ketrampilan": "keterampilan", "propinsi": "provinsi"
    },
    pleonasme: [
      "naik ke atas", "turun ke bawah", "mundur ke belakang", "maju ke depan", "agar supaya",
      "sangat sekali", "demi untuk", "adalah merupakan", "para siswa-siswa", "menurut pendapat saya",
      "sejak dari", "masuk ke dalam", "saling bantu-membantu", "amat sangat"
    ]
  }
};
