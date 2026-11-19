/* =========================================================
   EKSPEDISI — Logika aplikasi (tanpa pustaka luar)
   ========================================================= */
(function () {
  "use strict";

  const D = window.EKSPEDISI || EKSPEDISI;
  const A = D.aturan;
  const KUNCI = "ekspedisi.v1";
  const KUNCI_GURU = "ekspedisi.guru.v1";
  const app = document.getElementById("app");

  /* ---------------- Penyimpanan ---------------- */
  function baca(kunci, awal) {
    try {
      const s = localStorage.getItem(kunci);
      return s ? JSON.parse(s) : awal;
    } catch (e) {
      return awal;
    }
  }
  function tulis(kunci, nilai) {
    try {
      localStorage.setItem(kunci, JSON.stringify(nilai));
    } catch (e) { /* mode privat: data hanya bertahan selama sesi */ }
  }

  let store = baca(KUNCI, { profil: {}, aktif: null });
  let guru = baca(KUNCI_GURU, { hasil: {} });
  const simpan = () => tulis(KUNCI, store);
  const simpanGuru = () => tulis(KUNCI_GURU, guru);
  const P = () => (store.aktif ? store.profil[store.aktif] : null);

  function profilBaru(nama, kelas) {
    const id = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    return {
      id, nama, kelas,
      poin: 0,
      lencana: [],
      selesai: {},      // misiId -> true
      soal: {},         // soalKey -> {benar:bool, coba:int}
      peta: null,
      argumen: null,
      media: { salindia: {}, video: {} },
      tulisan: { judul: "", teks: "", versi: [], diri: [0, 0, 0, 0, 0], final: false, bonus: 0 },
      dibuat: Date.now(),
      diperbarui: Date.now()
    };
  }

  /* ---------------- Utilitas ---------------- */
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const hitungKata = (s) => (String(s).trim().match(/[A-Za-zÀ-ÿ0-9%\-]+/g) || []).length;
  const norm = (s) => " " + String(s).toLowerCase().replace(/[^a-z0-9%À-ÿ]+/g, " ").replace(/\s+/g, " ").trim() + " ";
  const ada = (teksNorm, frasa) => teksNorm.indexOf(" " + frasa.toLowerCase() + " ") !== -1 || (frasa === "%" && teksNorm.indexOf("%") !== -1);
  function acak(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function tambahPoin(n, alasan) {
    const p = P();
    if (!p || !n) return;
    p.poin += n;
    p.diperbarui = Date.now();
    simpan();
    toast(`+${n} poin · ${alasan}`);
    perbaruiChip();
  }

  function beriLencana(kode) {
    const p = P();
    if (!p || p.lencana.includes(kode)) return;
    p.lencana.push(kode);
    simpan();
    const l = D.lencana[kode];
    modal(`
      <div class="lencana-raih">
        <div class="lencana-ikon besar" aria-hidden="true">${l.ikon}</div>
        <p class="kicker">Lencana baru!</p>
        <h2>${esc(l.nama)}</h2>
        <p>${esc(l.ket)}</p>
        <button class="btn primer" data-tutup>Lanjutkan ekspedisi</button>
      </div>`);
  }

  function toast(pesan) {
    const t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.textContent = pesan;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add("tampil"));
    setTimeout(() => {
      t.classList.remove("tampil");
      setTimeout(() => t.remove(), 400);
    }, 2400);
  }

  function modal(html, kelas) {
    const m = document.createElement("div");
    m.className = "modal-latar";
    m.innerHTML = `<div class="modal ${kelas || ""}" role="dialog" aria-modal="true">
      <button class="modal-x" data-tutup aria-label="Tutup">×</button>${html}</div>`;
    m.addEventListener("click", (e) => {
      if (e.target === m || e.target.closest("[data-tutup]")) m.remove();
    });
    document.body.appendChild(m);
    const f = m.querySelector("button:not(.modal-x), input, textarea");
    if (f) f.focus();
    return m;
  }

  /* ---------------- Status kemajuan ---------------- */
  const posById = (id) => D.pos.find((x) => x.id === id);
  function posTuntas(pos, p) {
    p = p || P();
    return !!p && pos.misi.every((m) => p.selesai[m.id]);
  }
  function posTerbuka(pos, p) {
    p = p || P();
    const i = D.pos.indexOf(pos);
    return i === 0 || posTuntas(D.pos[i - 1], p);
  }
  function misiTerbuka(pos, idx, p) {
    p = p || P();
    return posTerbuka(pos, p) && (idx === 0 || !!p.selesai[pos.misi[idx - 1].id]);
  }
  function jumlahPosTuntas(p) {
    return D.pos.filter((x) => posTuntas(x, p)).length;
  }

  function selesaikanMisi(pos, misi) {
    const p = P();
    if (p.selesai[misi.id]) return;
    p.selesai[misi.id] = true;
    simpan();
    if (posTuntas(pos)) {
      // Lencana "Langkah Mantap": semua soal kuis pos ini benar pada percobaan pertama
      const kunciSoal = [];
      pos.misi.forEach((m) => {
        if (m.jenis === "kuis") m.soal.forEach((_, i) => kunciSoal.push(m.id + ":" + i));
      });
      if (kunciSoal.length && kunciSoal.every((k) => p.soal[k] && p.soal[k].coba === 1)) {
        setTimeout(() => beriLencana("sempurna"), 50);
      }
      beriLencana(pos.id);
    }
  }

  /* ---------------- Header ---------------- */
  function perbaruiChip() {
    const p = P();
    const chip = $("#chip-pemain");
    if (!chip) return;
    if (!p) {
      chip.innerHTML = "";
      chip.hidden = true;
      return;
    }
    chip.hidden = false;
    chip.innerHTML = `<span class="chip-nama">${esc(p.nama)}</span>
      <span class="chip-poin" title="Poin">🪙 ${p.poin}</span>
      <span class="chip-lencana" title="Lencana">🏅 ${p.lencana.length}</span>`;
  }

  function tandaiNav() {
    const h = location.hash || "#/";
    $$(".nav a").forEach((a) => {
      const href = a.getAttribute("href");
      a.classList.toggle("aktif", href === h || (href !== "#/" && h.startsWith(href)));
    });
  }

  /* ---------------- Router ---------------- */
  function rute() {
    const h = (location.hash || "#/").slice(2);
    const [hal, arg] = h.split("/");
    window.scrollTo(0, 0);
    tandaiNav();
    perbaruiChip();
    if (!P() && !["", "petunjuk", "guru", "materi", "rubrik"].includes(hal)) return halBeranda();
    switch (hal) {
      case "": return P() ? halPeta() : halBeranda();
      case "masuk": return halBeranda();
      case "peta": return halPeta();
      case "pos": return halPos(arg);
      case "papan": return halPapan();
      case "lencana": return halLencana();
      case "petunjuk": return halPetunjuk();
      case "materi": return halMateri();
      case "rubrik": return halRubrik();
      case "hasil": return halHasil();
      case "guru": return halGuru();
      default: return halPeta();
    }
  }

  /* ---------------- Halaman: Beranda / masuk ---------------- */
  function halBeranda() {
    const daftar = Object.values(store.profil).sort((a, b) => b.diperbarui - a.diperbarui);
    app.innerHTML = `
      <section class="hero">
        <div class="hero-teks">
          <p class="kicker">Media pembelajaran gamifikasi · ${esc(D.sasaran)}</p>
          <h1>Ekspedisi <span>Teks Eksposisi</span></h1>
          <p class="lead">Jadilah penjelajah! Tempuh empat pos, dari menemukan gagasan hingga mencapai puncak dengan tulisan eksposisi utuh. Kumpulkan poin dan lencana di setiap langkah.</p>
          <ol class="rute-mini">
            ${D.pos.map((x) => `<li><b>Pos ${x.nomor}</b> ${esc(x.nama)} <small>${esc(x.tahap)}</small></li>`).join("")}
          </ol>
        </div>
        <div class="kartu masuk">
          <h2>Mulai ekspedisi</h2>
          <form id="form-masuk" autocomplete="off">
            <label>Nama lengkap<input name="nama" required maxlength="60" placeholder="Contoh: Aisyah Putri"></label>
            <label>Kelas<input name="kelas" required maxlength="20" placeholder="Contoh: X-2"></label>
            <button class="btn primer lebar" type="submit">Berangkat! →</button>
          </form>
          ${daftar.length ? `
            <div class="lanjut">
              <p class="kecil">Atau lanjutkan sebagai:</p>
              ${daftar.map((p) => `
                <div class="baris-profil">
                  <button class="btn garis" data-pilih="${p.id}">${esc(p.nama)} · ${esc(p.kelas)} <small>🪙 ${p.poin}</small></button>
                  <button class="btn teks kecil" data-hapus="${p.id}" aria-label="Hapus profil ${esc(p.nama)}">Hapus</button>
                </div>`).join("")}
            </div>` : ""}
          <p class="kecil redup">Kemajuanmu tersimpan di peramban perangkat ini.</p>
        </div>
      </section>
      <section class="kartu-grid tiga">
        <a class="kartu tautan" href="#/petunjuk"><h3>📘 Petunjuk penggunaan</h3><p>Cara bermain, aturan poin, dan lencana.</p></a>
        <a class="kartu tautan" href="#/materi"><h3>🗺️ Bekal materi</h3><p>Ringkasan teks eksposisi dari setiap pos.</p></a>
        <a class="kartu tautan" href="#/rubrik"><h3>📋 Rubrik penilaian</h3><p>Lima aspek penilaian tulisan eksposisi.</p></a>
      </section>`;

    $("#form-masuk").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const nama = String(f.get("nama")).trim();
      const kelas = String(f.get("kelas")).trim();
      if (!nama || !kelas) return;
      const p = profilBaru(nama, kelas);
      store.profil[p.id] = p;
      store.aktif = p.id;
      simpan();
      location.hash = "#/peta";
      setTimeout(() => modal(`
        <p class="kicker">Selamat datang, penjelajah!</p>
        <h2>Halo, ${esc(nama)} 👋</h2>
        <p>Ekspedisimu terdiri atas empat pos. Pos berikutnya terbuka setelah semua misi di pos sebelumnya selesai. Jawaban keliru boleh dicoba lagi <strong>tanpa pengurangan poin</strong>.</p>
        <button class="btn primer" data-tutup>Lihat peta ekspedisi</button>`), 60);
    });
    $$("[data-pilih]").forEach((b) => b.addEventListener("click", () => {
      store.aktif = b.dataset.pilih;
      simpan();
      location.hash = "#/peta";
    }));
    $$("[data-hapus]").forEach((b) => b.addEventListener("click", () => {
      const p = store.profil[b.dataset.hapus];
      if (!confirm(`Hapus profil ${p.nama}? Semua kemajuannya di perangkat ini akan hilang.`)) return;
      delete store.profil[b.dataset.hapus];
      if (store.aktif === b.dataset.hapus) store.aktif = null;
      simpan();
      rute();
    }));
  }

  /* ---------------- Halaman: Peta ekspedisi ---------------- */
  function halPeta() {
    const p = P();
    const titik = [
      { x: 90, y: 500 },  // pos 1
      { x: 300, y: 395 }, // pos 2
      { x: 110, y: 270 }, // pos 3
      { x: 270, y: 140 }  // pos 4 (puncak)
    ];
    const tuntas = jumlahPosTuntas(p);
    const posSekarang = D.pos.find((x) => posTerbuka(x) && !posTuntas(x));
    const node = D.pos.map((pos, i) => {
      const t = titik[i];
      const st = posTuntas(pos) ? "tuntas" : posTerbuka(pos) ? "terbuka" : "terkunci";
      const ikon = st === "tuntas" ? "✓" : st === "terkunci" ? "🔒" : pos.nomor;
      return `
        <g class="node ${st}" data-pos="${pos.id}" tabindex="${st === "terkunci" ? -1 : 0}" role="button"
           aria-label="Pos ${pos.nomor}: ${esc(pos.nama)} (${st})" transform="translate(${t.x},${t.y})">
          ${posSekarang === pos ? `<circle class="denyut" r="34"></circle>` : ""}
          <circle class="lingkar" r="28"></circle>
          <text class="nomor" dy="1">${ikon}</text>
          <text class="label" y="${i % 2 ? 50 : 50}">Pos ${pos.nomor}</text>
          <text class="label sub" y="66">${esc(pos.nama)}</text>
        </g>`;
    }).join("");

    app.innerHTML = `
      <section class="peta-wrap">
        <div class="peta-info">
          <p class="kicker">Peta Ekspedisi</p>
          <h1>${tuntas === 4 ? "Puncak telah ditaklukkan! 🏔️" : "Lanjutkan perjalananmu"}</h1>
          <p>${tuntas === 4
            ? "Selamat, kamu telah menuntaskan seluruh pos. Kirim kode hasil kepada gurumu."
            : `Kamu telah menuntaskan <b>${tuntas}</b> dari 4 pos. ${posSekarang ? `Pos aktif: <b>Pos ${posSekarang.nomor} — ${esc(posSekarang.nama)}</b>.` : ""}`}</p>
          <div class="bilah" aria-label="Kemajuan ${tuntas} dari 4 pos"><span style="width:${tuntas * 25}%"></span></div>
          <div class="stat-baris">
            <div class="stat"><b>${p.poin}</b><span>Poin</span></div>
            <div class="stat"><b>${p.lencana.length}</b><span>Lencana</span></div>
            <div class="stat"><b>${Object.keys(p.selesai).length}</b><span>Misi tuntas</span></div>
          </div>
          <div class="aksi">
            ${posSekarang ? `<a class="btn primer" href="#/pos/${posSekarang.id}">Masuk Pos ${posSekarang.nomor} →</a>` : `<a class="btn primer" href="#/hasil">Lihat hasil & kode →</a>`}
            <a class="btn garis" href="#/papan">Papan peringkat</a>
          </div>
          <ul class="daftar-pos">
            ${D.pos.map((pos) => {
              const st = posTuntas(pos) ? "tuntas" : posTerbuka(pos) ? "terbuka" : "terkunci";
              return `<li class="${st}">
                <span class="dot"></span>
                <div><b>Pos ${pos.nomor}: ${esc(pos.nama)}</b><small>${esc(pos.tahap)} · ${esc(pos.fokus)}</small></div>
                ${st !== "terkunci" ? `<a href="#/pos/${pos.id}" class="btn teks kecil">${st === "tuntas" ? "Ulas" : "Buka"}</a>` : `<span class="kecil redup">Terkunci</span>`}
              </li>`;
            }).join("")}
          </ul>
        </div>
        <div class="peta-svg">
          <svg viewBox="0 0 400 600" role="img" aria-label="Peta jalur ekspedisi empat pos menuju puncak">
            <defs>
              <linearGradient id="langit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" class="lg1"/><stop offset="1" class="lg2"/>
              </linearGradient>
            </defs>
            <rect width="400" height="600" rx="24" fill="url(#langit)"/>
            <path class="gunung jauh" d="M0 230 L70 150 L130 200 L200 90 L270 170 L330 120 L400 190 L400 600 L0 600Z"/>
            <path class="gunung dekat" d="M0 330 L90 250 L160 300 L270 60 L360 230 L400 210 L400 600 L0 600Z"/>
            <path class="salju" d="M270 60 L248 108 L262 100 L272 114 L284 100 L296 110Z"/>
            <path class="padang" d="M0 430 Q120 380 220 420 T400 400 L400 600 L0 600Z"/>
            <g class="pohon">
              <path d="M30 560 l12 -30 l12 30z"/><path d="M350 520 l10 -26 l10 26z"/><path d="M200 585 l10 -24 l10 24z"/>
              <path d="M360 330 l9 -22 l9 22z"/><path d="M20 380 l9 -22 l9 22z"/>
            </g>
            <path class="jalur" d="M40 585 C 60 560, 70 530, 90 500 S 260 450, 300 395 S 140 330, 110 270 S 230 190, 270 140"/>
            <path class="jalur-isi" pathLength="100" stroke-dasharray="${tuntas * 25} 100" d="M40 585 C 60 560, 70 530, 90 500 S 260 450, 300 395 S 140 330, 110 270 S 230 190, 270 140"/>
            <g transform="translate(270,62)"><path class="bendera" d="M0 0 v-34 l22 8 l-22 8"/></g>
            <text class="label awal" x="40" y="598" text-anchor="middle">Start</text>
            ${node}
          </svg>
        </div>
      </section>`;

    $$(".node").forEach((n) => {
      const buka = () => {
        if (n.classList.contains("terkunci")) {
          toast("Pos ini masih terkunci. Tuntaskan pos sebelumnya dulu.");
          return;
        }
        location.hash = "#/pos/" + n.dataset.pos;
      };
      n.addEventListener("click", buka);
      n.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); buka(); } });
    });
  }

  /* ---------------- Halaman: Pos ---------------- */
  function halPos(id) {
    const pos = posById(id);
    if (!pos) return halPeta();
    if (!posTerbuka(pos)) {
      toast("Pos ini masih terkunci.");
      location.hash = "#/peta";
      return;
    }
    const p = P();
    const nMisi = pos.misi.filter((m) => p.selesai[m.id]).length;
    app.innerHTML = `
      <nav class="remah"><a href="#/peta">← Peta</a></nav>
      <header class="pos-kepala pos-${pos.nomor}">
        <div>
          <p class="kicker">Pos ${pos.nomor} · ${esc(pos.tahap)}</p>
          <h1>${esc(pos.nama)}</h1>
          <p class="fokus">${esc(pos.fokus)}</p>
        </div>
        <div class="pos-progres"><b>${nMisi}/${pos.misi.length}</b><span>misi</span></div>
      </header>
      <div class="cerita"><span aria-hidden="true">📜</span><p>${esc(pos.cerita)}</p></div>
      <div class="media-baris" data-media="${pos.id}">${kartuMedia(pos)}</div>
      <details class="materi">
        <summary>🎒 Bekal materi Pos ${pos.nomor}</summary>
        <div class="materi-isi">
          ${pos.materi.map((m) => `<article><h3>${esc(m.judul)}</h3><p>${m.isi}</p></article>`).join("")}
        </div>
      </details>
      <div id="daftar-misi"></div>
      ${posTuntas(pos) ? lanjutanPos(pos) : ""}`;

    pasangMedia(app);
    const wadah = $("#daftar-misi");
    pos.misi.forEach((m, i) => {
      const el = document.createElement("section");
      el.className = "misi kartu" + (p.selesai[m.id] ? " tuntas" : "") + (misiTerbuka(pos, i) ? "" : " terkunci");
      el.id = "misi-" + m.id;
      wadah.appendChild(el);
      renderMisi(pos, m, i, el);
    });
  }

  /* ---------- Kartu salindia & video ---------- */
  function kartuMedia(pos) {
    const ME = window.MediaEkspedisi;
    if (!ME) return "";
    const p = P();
    const md = (p && p.media) || { salindia: {}, video: {} };
    const inf = ME.info(pos.id);
    return `
      <button class="kartu-media salindia ${md.salindia[pos.id] ? "sudah" : ""}" data-salindia="${pos.id}">
        <span class="km-ikon" aria-hidden="true">📽️</span>
        <span class="km-teks"><b>Salindia Pos ${pos.nomor}</b><small>${inf.nSalindia} salindia · tampil bertahap</small></span>
        <span class="km-status">${md.salindia[pos.id] ? "✓ Disimak" : `+${D.aturan.poinSalindia} poin`}</span>
      </button>
      <button class="kartu-media video ${md.video[pos.id] ? "sudah" : ""}" data-video="${pos.id}">
        <span class="km-ikon" aria-hidden="true">▶</span>
        <span class="km-teks"><b>Video interaktif</b><small>± ${inf.durVideo} menit · ${inf.nKuis} kuis cepat</small></span>
        <span class="km-status">${md.video[pos.id] ? "✓ Ditonton" : `+${D.aturan.poinVideo} poin`}</span>
      </button>`;
  }
  function pasangMedia(root) {
    $$("[data-salindia]", root).forEach((b) => b.addEventListener("click", () => window.MediaEkspedisi.bukaSalindia(b.dataset.salindia)));
    $$("[data-video]", root).forEach((b) => b.addEventListener("click", () => window.MediaEkspedisi.bukaVideo(b.dataset.video)));
  }
  function segarkanMedia() {
    $$("[data-media]").forEach((w) => {
      w.innerHTML = kartuMedia(posById(w.dataset.media));
      pasangMedia(w);
    });
  }

  function lanjutanPos(pos) {
    const i = D.pos.indexOf(pos);
    const next = D.pos[i + 1];
    const l = D.lencana[pos.id];
    return `<div class="kartu selesai-pos">
      <div class="lencana-ikon" aria-hidden="true">${l.ikon}</div>
      <div><h3>Pos ${pos.nomor} tuntas!</h3><p>Kamu meraih lencana <b>${esc(l.nama)}</b>.</p></div>
      ${next ? `<a class="btn primer" href="#/pos/${next.id}">Lanjut ke Pos ${next.nomor} →</a>` : `<a class="btn primer" href="#/hasil">Lihat hasil ekspedisi →</a>`}
    </div>`;
  }

  function kepalaMisi(m, tuntas) {
    return `<header class="misi-kepala"><h2>${esc(m.judul)}</h2>${tuntas ? `<span class="tag hijau">✓ Tuntas</span>` : ""}</header>
      ${m.petunjuk ? `<p class="petunjuk">${esc(m.petunjuk)}</p>` : ""}`;
  }

  function renderMisi(pos, m, i, el) {
    const p = P();
    if (!misiTerbuka(pos, i)) {
      el.innerHTML = `<header class="misi-kepala"><h2>🔒 ${esc(m.judul)}</h2></header><p class="redup">Selesaikan misi sebelumnya untuk membuka misi ini.</p>`;
      return;
    }
    const segarkan = () => {
      // Setelah sebuah misi tuntas, gambar ulang halaman agar misi berikutnya terbuka
      const y = window.scrollY;
      halPos(pos.id);
      window.scrollTo(0, y);
      const next = pos.misi[i + 1];
      if (next) {
        const t = document.getElementById("misi-" + next.id);
        if (t) setTimeout(() => t.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      } else {
        const s = $(".selesai-pos");
        if (s) setTimeout(() => s.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
      }
    };
    const selesai = () => {
      const sudah = p.selesai[m.id];
      selesaikanMisi(pos, m);
      if (!sudah) segarkan();
    };
    ({
      kuis: misiKuis,
      petaGagasan: misiPetaGagasan,
      urutkan: misiUrutkan,
      tulisArgumen: misiTulisArgumen,
      buruKesalahan: misiBuru,
      tulisAkhir: misiTulisAkhir
    })[m.jenis](m, el, selesai, pos);
  }

  /* ---------- Misi: kuis ---------- */
  function misiKuis(m, el, selesai) {
    const p = P();
    el.innerHTML = kepalaMisi(m, p.selesai[m.id]) + `<ol class="soal-daftar">${m.soal.map((s, si) => {
      const k = m.id + ":" + si;
      const st = p.soal[k] || { benar: false, coba: 0 };
      return `<li class="soal ${st.benar ? "benar" : ""}" data-si="${si}">
        <p class="soal-teks">${esc(s.t)}</p>
        <div class="opsi">${s.o.map((o, oi) => `
          <button class="opsi-btn ${st.benar && oi === s.k ? "benar" : ""}" data-oi="${oi}" ${st.benar ? "disabled" : ""}>
            <span class="huruf">${"ABCD"[oi]}</span><span>${esc(o)}</span></button>`).join("")}</div>
        <div class="umpan" aria-live="polite">${st.benar ? `<p class="ok">✓ ${esc(s.u)}</p>` : ""}</div>
      </li>`;
    }).join("")}</ol>`;

    $$(".soal", el).forEach((li) => {
      const si = +li.dataset.si;
      const s = m.soal[si];
      const k = m.id + ":" + si;
      $$(".opsi-btn", li).forEach((b) => b.addEventListener("click", () => {
        const st = p.soal[k] || { benar: false, coba: 0 };
        if (st.benar) return;
        st.coba++;
        const oi = +b.dataset.oi;
        const umpan = $(".umpan", li);
        if (oi === s.k) {
          st.benar = true;
          p.soal[k] = st;
          simpan();
          b.classList.add("benar");
          li.classList.add("benar");
          $$(".opsi-btn", li).forEach((x) => (x.disabled = true));
          umpan.innerHTML = `<p class="ok">✓ ${esc(s.u)}</p>`;
          tambahPoin(A.poinSoal, st.coba === 1 ? "Tepat pada percobaan pertama!" : "Kamu berhasil kembali ke jalur!");
          if (m.soal.every((_, j) => (p.soal[m.id + ":" + j] || {}).benar)) setTimeout(selesai, 900);
        } else {
          p.soal[k] = st;
          simpan();
          b.classList.add("salah");
          b.disabled = true;
          li.classList.remove("goyang");
          void li.offsetWidth;
          li.classList.add("goyang");
          umpan.innerHTML = `<p class="belum">✗ Belum tepat. Penjelajah boleh salah arah—coba pilihan lain! ${s.h ? esc(s.h) : "Baca kembali bekal materi bila perlu."}</p>`;
        }
      }));
    });
  }

  /* ---------- Misi: peta gagasan ---------- */
  function misiPetaGagasan(m, el, selesai) {
    const p = P();
    const v = p.peta || { topik: "", tesis: "", ide: ["", "", ""], data: "" };
    el.innerHTML = kepalaMisi(m, p.selesai[m.id]) + `
      <form class="peta-gagasan" autocomplete="off">
        <fieldset>
          <legend>1. Topik (isu aktual)</legend>
          <div class="chip-pilih">${m.pilihanTopik.map((t) => `<button type="button" class="chip ${v.topik === t ? "aktif" : ""}" data-topik="${esc(t)}">${esc(t)}</button>`).join("")}</div>
          <input name="topik" required maxlength="120" placeholder="Pilih di atas atau tulis isumu sendiri" value="${esc(v.topik)}">
        </fieldset>
        <fieldset>
          <legend>2. Tesis (pendapatmu tentang isu tersebut)</legend>
          <textarea name="tesis" rows="2" required placeholder="Contoh: Sekolah perlu ... karena ...">${esc(v.tesis)}</textarea>
        </fieldset>
        <fieldset>
          <legend>3. Ide pendukung (minimal dua)</legend>
          ${[0, 1, 2].map((i) => `<input name="ide${i}" maxlength="200" placeholder="Ide pendukung ${i + 1}${i === 2 ? " (opsional)" : ""}" value="${esc(v.ide[i] || "")}">`).join("")}
        </fieldset>
        <fieldset>
          <legend>4. Fakta atau data yang akan kamu gunakan</legend>
          <textarea name="data" rows="2" placeholder="Contoh: survei, hasil penelitian, berita, atau pendapat ahli beserta sumbernya">${esc(v.data)}</textarea>
        </fieldset>
        <div class="aksi"><button class="btn primer" type="submit">Periksa & simpan peta rute</button></div>
        <div class="umpan" aria-live="polite"></div>
      </form>`;
    const f = $("form", el);
    $$("[data-topik]", el).forEach((b) => b.addEventListener("click", () => {
      f.topik.value = b.dataset.topik;
      $$("[data-topik]", el).forEach((x) => x.classList.toggle("aktif", x === b));
    }));
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        topik: f.topik.value.trim(),
        tesis: f.tesis.value.trim(),
        ide: [f.ide0.value.trim(), f.ide1.value.trim(), f.ide2.value.trim()],
        data: f.data.value.trim()
      };
      const catatan = [];
      let lolos = true;
      const nt = norm(data.tesis);
      if (hitungKata(data.tesis) < 6) { lolos = false; catatan.push(["belum", "Tesismu terlalu singkat. Tulis pendapat yang utuh, minimal satu kalimat lengkap (6 kata atau lebih)."]); }
      else catatan.push(["ok", "Tesis sudah berupa kalimat utuh."]);
      if (/\?\s*$/.test(data.tesis)) { lolos = false; catatan.push(["belum", "Tesis tidak boleh berupa pertanyaan. Ubah menjadi pernyataan pendapat."]); }
      if (["perlu", "harus", "sebaiknya", "penting", "seharusnya", "wajib", "hendaknya", "mesti", "patut"].some((w) => ada(nt, w)))
        catatan.push(["ok", "Sikap pendapatmu terlihat jelas (ada kata penanda pendapat)."]);
      else catatan.push(["saran", "Saran: pertegas sikapmu dengan kata seperti “perlu”, “harus”, atau “sebaiknya”."]);
      if (["karena", "sebab", "sehingga", "agar"].some((w) => ada(nt, w))) catatan.push(["ok", "Tesismu sudah memuat alasan singkat. Bagus!"]);
      const nIde = data.ide.filter((x) => hitungKata(x) >= 3).length;
      if (nIde < 2) { lolos = false; catatan.push(["belum", "Tuliskan minimal dua ide pendukung (masing-masing minimal 3 kata)."]); }
      else catatan.push(["ok", `${nIde} ide pendukung siap digunakan.`]);
      if (hitungKata(data.data) < 4) catatan.push(["saran", "Saran: catat fakta atau data beserta sumbernya agar argumenmu kuat di Pos 2."]);
      else catatan.push(["ok", "Kamu sudah menyiapkan fakta atau data pendukung."]);
      if (!data.topik) { lolos = false; catatan.unshift(["belum", "Tentukan topik terlebih dahulu."]); }

      $(".umpan", el).innerHTML = daftarCatatan(catatan) + (lolos ? `<p class="ok"><b>Peta rute tersimpan!</b> Peta ini akan kamu gunakan di pos berikutnya.</p>` : "");
      if (lolos) {
        p.peta = data;
        simpan();
        if (!p.selesai[m.id]) {
          tambahPoin(A.poinMisiTulis, "Peta rute selesai");
          setTimeout(selesai, 1400);
        } else toast("Peta rute diperbarui.");
      }
    });
  }

  function daftarCatatan(c) {
    const ikon = { ok: "✓", belum: "✗", saran: "💡" };
    return `<ul class="catatan">${c.map(([k, t]) => `<li class="${k}"><span>${ikon[k]}</span>${esc(t)}</li>`).join("")}</ul>`;
  }

  /* ---------- Misi: urutkan paragraf ---------- */
  function misiUrutkan(m, el, selesai) {
    const p = P();
    let urut = p.selesai[m.id] ? m.paragraf.map((_, i) => i) : acak(m.paragraf.map((_, i) => i));
    if (!p.selesai[m.id] && urut.every((v, i) => v === i)) urut = [2, 0, 3, 1];
    let diperiksa = !!p.selesai[m.id];

    function gambar() {
      el.innerHTML = kepalaMisi(m, p.selesai[m.id]) + `
        <p class="judul-teks">“${esc(m.judulTeks)}”</p>
        <ol class="urut-daftar">${urut.map((pi, pos) => {
          const benar = diperiksa && pi === pos;
          const salah = diperiksa && pi !== pos;
          return `<li class="urut-item ${benar ? "benar" : ""} ${salah ? "salah" : ""}">
            <div class="urut-tombol">
              <button class="btn ikon" data-naik="${pos}" ${pos === 0 || p.selesai[m.id] ? "disabled" : ""} aria-label="Naikkan">▲</button>
              <button class="btn ikon" data-turun="${pos}" ${pos === urut.length - 1 || p.selesai[m.id] ? "disabled" : ""} aria-label="Turunkan">▼</button>
            </div>
            <div><p>${esc(m.paragraf[pi].t)}</p>${benar ? `<span class="tag hijau">${esc(m.paragraf[pi].bag)}</span>` : ""}</div>
          </li>`;
        }).join("")}</ol>
        ${p.selesai[m.id] ? "" : `<div class="aksi"><button class="btn primer" data-periksa>Periksa susunan</button></div>`}
        <div class="umpan" aria-live="polite">${p.selesai[m.id] ? `<p class="ok">✓ Susunan tepat: tesis → argumentasi 1 → argumentasi 2 → penegasan ulang.</p>` : ""}</div>`;

      $$("[data-naik]", el).forEach((b) => b.addEventListener("click", () => tukar(+b.dataset.naik, -1)));
      $$("[data-turun]", el).forEach((b) => b.addEventListener("click", () => tukar(+b.dataset.turun, 1)));
      const pb = $("[data-periksa]", el);
      if (pb) pb.addEventListener("click", periksa);
    }
    function tukar(i, arah) {
      const j = i + arah;
      [urut[i], urut[j]] = [urut[j], urut[i]];
      diperiksa = false;
      gambar();
      const t = $$(".urut-item", el)[j];
      if (t) $(arah < 0 ? "[data-naik]" : "[data-turun]", t)?.focus();
    }
    function periksa() {
      diperiksa = true;
      const nBenar = urut.filter((v, i) => v === i).length;
      gambar();
      const u = $(".umpan", el);
      if (nBenar === urut.length) {
        u.innerHTML = `<p class="ok">✓ Jembatan kokoh! Susunanmu tepat: tesis → argumentasi → penegasan ulang.</p>`;
        tambahPoin(A.poinSoal * 2, "Struktur teks tersusun");
        setTimeout(selesai, 1200);
      } else {
        u.innerHTML = `<p class="belum">✗ ${nBenar} dari ${urut.length} balok sudah di tempat yang tepat (hijau). Ingat: paragraf pembuka memperkenalkan isu dan pendapat; paragraf penutup diawali ungkapan penegasan seperti “dengan demikian”. Coba lagi!</p>`;
      }
    }
    gambar();
  }

  /* ---------- Misi: tulis dua argumen ---------- */
  function analisisArgumen(t) {
    const n = norm(t);
    const kata = hitungKata(t);
    const bukti = /\d/.test(t) || D.kamus.penanda_data.some((w) => ada(n, w));
    const kaus = D.kamus.kausalitas.filter((w) => ada(n, w));
    const tb = Object.keys(D.kamus.tidakBaku).filter((w) => ada(n, w));
    return { kata, bukti, kaus, tb };
  }
  function misiTulisArgumen(m, el, selesai) {
    const p = P();
    const v = p.argumen || ["", ""];
    const peta = p.peta || {};
    el.innerHTML = kepalaMisi(m, p.selesai[m.id]) + `
      <div class="kutip-tesis"><small>Tesismu (dari Pos 1)</small><p>${esc(peta.tesis || "—")}</p>
        ${peta.ide ? `<small>Ide pendukung</small><ul>${peta.ide.filter(Boolean).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        ${peta.data ? `<small>Fakta/data</small><p>${esc(peta.data)}</p>` : ""}
      </div>
      <form autocomplete="off">
        ${[0, 1].map((i) => `
          <label class="blok">Argumen ${i + 1}
            <textarea name="a${i}" rows="4" placeholder="${i === 0 ? "Pertama, ... Hal ini dibuktikan oleh ..." : "Kedua, ... Menurut ..."}">${esc(v[i])}</textarea>
            <span class="penghitung" data-hit="${i}">0 kata</span>
          </label>`).join("")}
        <div class="aksi"><button class="btn primer" type="submit">Periksa argumen</button></div>
        <div class="umpan" aria-live="polite"></div>
      </form>`;
    const f = $("form", el);
    const hit = () => [0, 1].forEach((i) => ($(`[data-hit="${i}"]`, el).textContent = hitungKata(f["a" + i].value) + " kata"));
    f.addEventListener("input", hit);
    hit();
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const teks = [f.a0.value.trim(), f.a1.value.trim()];
      let lolos = true;
      const c = [];
      teks.forEach((t, i) => {
        const a = analisisArgumen(t);
        const nm = `Argumen ${i + 1}: `;
        if (a.kata < 15) { lolos = false; c.push(["belum", nm + `baru ${a.kata} kata. Kembangkan alasanmu minimal 15 kata.`]); }
        else c.push(["ok", nm + `panjang argumen memadai (${a.kata} kata).`]);
        if (!a.bukti) { lolos = false; c.push(["belum", nm + "belum ada bukti. Tambahkan fakta, angka, atau sumber (misalnya “menurut …”, “berdasarkan survei …”)."]); }
        else c.push(["ok", nm + "sudah didukung fakta/data/sumber."]);
        if (a.kaus.length) c.push(["ok", nm + `memakai konjungsi kausalitas (${a.kaus.join(", ")}).`]);
        else c.push(["saran", nm + "saran: gunakan konjungsi kausalitas seperti “karena”, “sehingga”, atau “akibatnya”."]);
        if (a.tb.length) c.push(["saran", nm + `ada kata tidak baku: ${a.tb.map((w) => `“${w}” → ${D.kamus.tidakBaku[w]}`).join("; ")}.`]);
      });
      if (lolos && norm(teks[0]) === norm(teks[1])) { lolos = false; c.push(["belum", "Kedua argumen tidak boleh sama."]); }
      $(".umpan", el).innerHTML = daftarCatatan(c) + (lolos ? `<p class="ok"><b>Argumen tersimpan!</b> Kamu akan memakainya di Puncak Ekspedisi.</p>` : "");
      if (lolos) {
        p.argumen = teks;
        simpan();
        if (!p.selesai[m.id]) {
          tambahPoin(A.poinMisiTulis, "Dua argumen tersusun");
          setTimeout(selesai, 1600);
        } else toast("Argumen diperbarui.");
      }
    });
  }

  /* ---------- Misi: buru kesalahan ejaan ---------- */
  function misiBuru(m, el, selesai) {
    const p = P();
    const tuntas = !!p.selesai[m.id];
    const total = m.teks.filter((x) => x.f).length;
    const tanda = new Set();
    el.innerHTML = kepalaMisi(m, tuntas) + `
      <div class="buru-teks">${m.teks.map((x, i) =>
        tuntas && x.f
          ? `<span class="kata dibetulkan"><s>${esc(x.t)}</s> <ins>${esc(x.f)}</ins></span>`
          : `<button class="kata" data-i="${i}" ${tuntas ? "disabled" : ""}>${esc(x.t)}</button>`).join(" ")}</div>
      ${tuntas ? "" : `<div class="aksi"><span class="kecil redup" data-jml>0 kata ditandai</span><button class="btn primer" data-periksa>Periksa</button></div>`}
      <div class="umpan" aria-live="polite">${tuntas ? `<p class="ok">✓ Semua ${total} kesalahan telah disunting.</p>` : ""}</div>`;
    if (tuntas) return;
    $$(".kata", el).forEach((b) => b.addEventListener("click", () => {
      const i = +b.dataset.i;
      if (tanda.has(i)) tanda.delete(i); else tanda.add(i);
      b.classList.toggle("ditandai");
      b.classList.remove("keliru-tanda");
      $("[data-jml]", el).textContent = tanda.size + " kata ditandai";
    }));
    $("[data-periksa]", el).addEventListener("click", () => {
      let ketemu = 0;
      const salahTanda = [];
      tanda.forEach((i) => (m.teks[i].f ? ketemu++ : salahTanda.push(i)));
      salahTanda.forEach((i) => $(`[data-i="${i}"]`, el).classList.add("keliru-tanda"));
      const u = $(".umpan", el);
      if (ketemu === total && !salahTanda.length) {
        tambahPoin(A.poinSoal * total, "Penyunting jeli!");
        u.innerHTML = `<p class="ok">✓ Hebat! Kamu menemukan semua kesalahan.</p>`;
        $$(".kata", el).forEach((b) => {
          const x = m.teks[+b.dataset.i];
          if (x.f) b.outerHTML = `<span class="kata dibetulkan"><s>${esc(x.t)}</s> <ins>${esc(x.f)}</ins></span>`;
          else b.disabled = true;
        });
        setTimeout(selesai, 2200);
      } else {
        u.innerHTML = `<p class="belum">Kamu menemukan <b>${ketemu}</b> dari ${total} kesalahan.${salahTanda.length ? ` Ada <b>${salahTanda.length}</b> kata bertanda merah yang sebenarnya sudah benar—ketuk lagi untuk membatalkan.` : ""} Petunjuk: perhatikan huruf kapital nama negara, awalan <i>di-</i>, dan kata baku menurut KBBI.</p>`;
      }
    });
  }

  /* ---------- Pemeriksa otomatis tulisan akhir ---------- */
  function periksaTulisan(judul, teks) {
    const K = D.kamus;
    const par = teks.split(/\n+/).map((x) => x.trim()).filter((x) => x.length);
    const kata = hitungKata(teks);
    const n = norm(teks);
    const hasil = [];
    let skor = 0;
    const tambah = (bobot, status, label, rinci) => {
      if (status === "ok") skor += bobot;
      else if (status === "saran") skor += bobot / 2;
      hasil.push({ status, label, rinci, bobot });
    };

    // A. Struktur
    tambah(5, judul.trim() ? "ok" : "belum", "Judul", judul.trim() ? "Tulisan sudah berjudul." : "Tambahkan judul yang mencerminkan isu.");
    tambah(15, par.length >= 3 && par.length <= 4 ? "ok" : par.length >= 2 ? "saran" : "belum", "Jumlah paragraf",
      `Terdapat ${par.length} paragraf. Ketentuan: 3–4 paragraf (tekan Enter untuk memulai paragraf baru).`);
    tambah(10, kata >= 150 && kata <= 400 ? "ok" : kata >= 100 ? "saran" : "belum", "Panjang tulisan",
      `${kata} kata. Disarankan 150–350 kata.`);

    const p1 = norm(par[0] || "");
    const penandaPendapat = ["perlu", "harus", "sebaiknya", "penting", "seharusnya", "wajib", "hendaknya", "mesti", "patut"];
    tambah(10, penandaPendapat.some((w) => ada(p1, w)) ? "ok" : "saran", "Tesis di paragraf pertama",
      penandaPendapat.some((w) => ada(p1, w)) ? "Paragraf pertama sudah memuat sikap/pendapat penulis." : "Pastikan paragraf pertama memuat pendapat yang tegas (misalnya dengan kata “perlu”, “harus”, “sebaiknya”).");

    const tengah = par.slice(1, -1).join(" ");
    const nt = norm(tengah);
    const nBukti = (tengah.match(/\d+/g) || []).length + K.penanda_data.filter((w) => ada(nt, w)).length;
    tambah(15, nBukti >= 2 ? "ok" : nBukti === 1 ? "saran" : "belum", "Argumen didukung data",
      nBukti >= 2 ? "Paragraf argumentasi memuat fakta, data, atau sumber." : "Tambahkan fakta, angka, atau sumber (misalnya “menurut …”, “berdasarkan survei …”) pada paragraf argumentasi.");

    const pz = norm(par[par.length - 1] || "");
    const adaPenegasan = par.length >= 2 && K.penegasan.some((w) => ada(pz, w));
    tambah(10, adaPenegasan ? "ok" : "saran", "Penegasan ulang di paragraf terakhir",
      adaPenegasan ? "Paragraf terakhir sudah berupa penegasan ulang." : "Awali paragraf terakhir dengan ungkapan penegasan, misalnya “Dengan demikian, …” atau “Oleh karena itu, …”.");

    // B. Kaidah kebahasaan
    const kaus = K.kausalitas.filter((w) => ada(n, w));
    tambah(10, kaus.length >= 2 ? "ok" : kaus.length === 1 ? "saran" : "belum", "Konjungsi kausalitas",
      kaus.length ? `Ditemukan: ${kaus.join(", ")}.` : "Belum ada konjungsi sebab-akibat. Gunakan “karena”, “sehingga”, “akibatnya”, dan sebagainya.");
    const men = K.mental.filter((w) => ada(n, w));
    tambah(5, men.length ? "ok" : "saran", "Kata kerja mental",
      men.length ? `Ditemukan: ${men.join(", ")}.` : "Gunakan kata kerja mental, misalnya “meyakini”, “menganggap”, atau “menyimpulkan”.");

    // C. Diksi dan kalimat efektif
    const tb = Object.keys(K.tidakBaku).filter((w) => ada(n, w));
    const di = [];
    (teks.toLowerCase().match(/\bdi\s+[a-z]+(kan|i)\b/g) || []).forEach((x) => {
      const w = x.split(/\s+/)[1];
      if (!["sini", "situ", "mana", "dalam", "luar", "atas", "bawah", "antara", "tepi", "pinggir", "samping", "sekitar", "kanan", "kiri", "pagi", "hari"].includes(w)) di.push(x);
    });
    const diSambung = (teks.toLowerCase().match(/\bdi(rumah|sekolah|kelas|kota|desa|dalam|luar|atas|bawah|sini|sana|situ|antara|indonesia|jakarta|depok|sekitar|lingkungan|masyarakat)\b/g) || []);
    const salahKata = tb.map((w) => `“${w}” → ${K.tidakBaku[w]}`)
      .concat(di.map((x) => `“${x}” → ${x.replace(/\s+/, "")} (awalan di- disambung)`))
      .concat(diSambung.map((x) => `“${x}” → di ${x.slice(2)} (kata depan di dipisah)`));
    tambah(10, salahKata.length === 0 ? "ok" : salahKata.length <= 2 ? "saran" : "belum", "Diksi baku dan ejaan kata",
      salahKata.length ? `Periksa: ${salahKata.slice(0, 8).join("; ")}${salahKata.length > 8 ? "; …" : ""}.` : "Tidak ditemukan kata tidak baku dari daftar pemeriksa.");

    const pleo = K.pleonasme.filter((w) => n.indexOf(" " + w.replace(/-/g, " ") + " ") !== -1);
    if (/\bsangat\s+\w+\s+sekali\b/i.test(teks)) pleo.push("sangat … sekali");
    const kalimat = teks.split(/[.!?]+/).map((x) => x.trim()).filter(Boolean);
    const panjang = kalimat.filter((k) => hitungKata(k) > 40).length;
    const efektifOk = !pleo.length && !panjang;
    tambah(5, efektifOk ? "ok" : "saran", "Kalimat efektif",
      efektifOk ? "Tidak ditemukan pemborosan kata atau kalimat yang terlalu panjang."
        : [pleo.length ? `Hindari pemborosan kata: ${pleo.join(", ")}.` : "", panjang ? `${panjang} kalimat lebih dari 40 kata; pecah menjadi kalimat yang lebih pendek.` : ""].filter(Boolean).join(" "));

    // D. Tanda baca dan kapital
    const masalahTB = [];
    const awalKecil = kalimat.filter((k) => /^[a-z]/.test(k)).length;
    if (awalKecil) masalahTB.push(`${awalKecil} kalimat diawali huruf kecil`);
    const spasiTB = (teks.match(/\s+[,.;:!?]/g) || []).length;
    if (spasiTB) masalahTB.push(`${spasiTB} spasi sebelum tanda baca`);
    const tanpaSpasi = (teks.match(/[,.;:](?=[A-Za-z])/g) || []).length;
    if (tanpaSpasi) masalahTB.push(`${tanpaSpasi} tanda baca tanpa spasi sesudahnya`);
    const tanpaTitik = par.filter((x) => !/[.!?”"]$/.test(x)).length;
    if (tanpaTitik) masalahTB.push(`${tanpaTitik} paragraf tidak diakhiri tanda titik`);
    tambah(5, masalahTB.length ? "saran" : "ok", "Huruf kapital dan tanda baca",
      masalahTB.length ? `Periksa: ${masalahTB.join("; ")}.` : "Huruf kapital awal kalimat dan tanda baca tampak rapi.");

    return { skor: Math.round(skor), hasil, par: par.length, kata };
  }

  /* ---------- Misi: tulis akhir (Pos 4) ---------- */
  function misiTulisAkhir(m, el, selesai) {
    const p = P();
    const T = p.tulisan;
    const final = T.final;
    const peta = p.peta || {};
    const arg = p.argumen || [];

    el.innerHTML = kepalaMisi(m, p.selesai[m.id]) + `
      <div class="langkah-puncak">
        <span class="${T.versi.length ? "lewat" : "kini"}">1. Tulis draf</span>
        <span class="${T.versi.length ? (T.diri.every(Boolean) ? "lewat" : "kini") : ""}">2. Periksa & nilai diri</span>
        <span class="${T.versi.length > 1 ? "lewat" : T.diri.every(Boolean) ? "kini" : ""}">3. Revisi</span>
        <span class="${final ? "lewat" : ""}">4. Kirim</span>
      </div>
      <div class="tulis-grid">
        <aside class="bekal-tulis">
          <h3>🗺️ Peta rutemu</h3>
          <dl>
            <dt>Topik</dt><dd>${esc(peta.topik || "—")}</dd>
            <dt>Tesis</dt><dd>${esc(peta.tesis || "—")}</dd>
            <dt>Ide pendukung</dt><dd>${(peta.ide || []).filter(Boolean).map(esc).join("<br>") || "—"}</dd>
            <dt>Fakta/data</dt><dd>${esc(peta.data || "—")}</dd>
          </dl>
          ${arg.length ? `<h3>🧱 Argumenmu</h3>${arg.map((a, i) => `<p class="kecil"><b>${i + 1}.</b> ${esc(a)}</p>`).join("")}` : ""}
          ${final ? "" : `<button class="btn garis lebar" data-kerangka>Sisipkan kerangka ke lembar tulis</button>`}
          <details class="kecil"><summary>Ungkapan bantu</summary>
            <p><b>Tesis:</b> Menurut pandangan penulis, …; … perlu … karena …</p>
            <p><b>Argumen:</b> Pertama, …; Kedua, …; Hal ini dibuktikan oleh …; Berdasarkan data …</p>
            <p><b>Penegasan:</b> Dengan demikian, …; Oleh karena itu, …</p>
          </details>
        </aside>
        <div class="lembar">
          <label class="blok">Judul<input name="judul" maxlength="120" value="${esc(T.judul)}" ${final ? "readonly" : ""} placeholder="Judul teks eksposisimu"></label>
          <label class="blok">Teks eksposisi (3–4 paragraf)
            <textarea name="teks" rows="16" ${final ? "readonly" : ""} placeholder="Paragraf 1: tesis…&#10;&#10;Paragraf 2–3: argumentasi beserta data…&#10;&#10;Paragraf 4: penegasan ulang…">${esc(T.teks)}</textarea>
          </label>
          <div class="lembar-bawah"><span class="kecil redup" data-info></span>
            ${final ? "" : `<button class="btn primer" data-periksa>🔍 Periksa tulisan</button>`}</div>
          <div data-hasil aria-live="polite"></div>
          <div data-diri></div>
          <div data-kirim></div>
        </div>
      </div>`;

    const fJudul = $("[name=judul]", el);
    const fTeks = $("[name=teks]", el);
    const info = () => {
      const par = fTeks.value.split(/\n+/).filter((x) => x.trim()).length;
      $("[data-info]", el).textContent = `${hitungKata(fTeks.value)} kata · ${par} paragraf`;
    };
    let tunda;
    const autosimpan = () => {
      info();
      clearTimeout(tunda);
      tunda = setTimeout(() => { T.judul = fJudul.value; T.teks = fTeks.value; simpan(); }, 400);
    };
    fJudul.addEventListener("input", autosimpan);
    fTeks.addEventListener("input", autosimpan);
    info();

    const kb = $("[data-kerangka]", el);
    if (kb) kb.addEventListener("click", () => {
      if (fTeks.value.trim() && !confirm("Lembar tulis sudah berisi. Tambahkan kerangka di bagian akhir?")) return;
      const k = [
        (peta.tesis || "") + " ",
        arg[0] || "Pertama, …",
        arg[1] || "Kedua, …",
        "Dengan demikian, …"
      ].join("\n\n");
      fTeks.value = (fTeks.value.trim() ? fTeks.value.trim() + "\n\n" : "") + k;
      if (!fJudul.value && peta.topik) fJudul.value = peta.topik;
      autosimpan();
      fTeks.focus();
    });

    function tampilHasil(h, sebelum) {
      const naik = sebelum != null ? h.skor - sebelum : null;
      $("[data-hasil]", el).innerHTML = `
        <div class="kartu hasil-periksa">
          <div class="skor-cincin" style="--n:${h.skor}"><b>${h.skor}</b><span>skor periksa</span></div>
          <div>
            <h3>Umpan balik cepat</h3>
            <p class="kecil redup">Skor periksa adalah bantuan otomatis untuk merevisi, bukan nilai akhir. Nilai akhir diberikan guru dengan rubrik.</p>
            ${naik != null ? `<p class="${naik > 0 ? "ok" : "redup"}">${naik > 0 ? `▲ Naik ${naik} poin dari pemeriksaan sebelumnya. Revisi yang bagus!` : naik < 0 ? `▼ Turun ${-naik} poin dari pemeriksaan sebelumnya.` : "Skor sama dengan pemeriksaan sebelumnya."}</p>` : ""}
          </div>
        </div>
        <ul class="catatan rinci">${h.hasil.map((x) => `<li class="${x.status}"><span>${{ ok: "✓", belum: "✗", saran: "💡" }[x.status]}</span><div><b>${esc(x.label)}</b> ${esc(x.rinci)}</div></li>`).join("")}</ul>`;
    }

    function tampilDiri() {
      $("[data-diri]", el).innerHTML = `
        <div class="kartu penilaian-diri">
          <h3>📋 Daftar periksa penilaian diri</h3>
          <p class="kecil">Bacalah tulisanmu, lalu pilih deskripsi yang paling sesuai untuk setiap aspek (skala 1–4).</p>
          ${D.rubrik.map((r, ri) => `
            <fieldset class="aspek">
              <legend>${ri + 1}. ${esc(r.aspek)}</legend>
              <div class="skala">${[4, 3, 2, 1].map((s) => `
                <label class="${T.diri[ri] === s ? "pilih" : ""}"><input type="radio" name="d${ri}" value="${s}" ${T.diri[ri] === s ? "checked" : ""} ${final ? "disabled" : ""}>
                  <b>${s}</b><span>${esc(r.d[s - 1])}</span></label>`).join("")}</div>
            </fieldset>`).join("")}
        </div>`;
      $$("[data-diri] input", el).forEach((r) => r.addEventListener("change", () => {
        const ri = +r.name.slice(1);
        T.diri[ri] = +r.value;
        simpan();
        $$(`[name=d${ri}]`, el).forEach((x) => x.parentElement.classList.toggle("pilih", x.checked));
        tampilKirim();
      }));
    }

    function tampilKirim() {
      const box = $("[data-kirim]", el);
      if (final) {
        box.innerHTML = `<div class="kartu selesai-pos">
          <div class="lencana-ikon" aria-hidden="true">🏔️</div>
          <div><h3>Tulisan akhir terkirim</h3><p>Skor periksa awal ${T.versi[0].skor} → akhir ${T.versi[T.versi.length - 1].skor}. Bonus revisi: ${T.bonus} poin.</p></div>
          <a class="btn primer" href="#/hasil">Lihat hasil & kode →</a></div>`;
        return;
      }
      if (!T.versi.length) { box.innerHTML = ""; return; }
      const siap = T.diri.every(Boolean);
      const nRevisi = T.versi.length - 1;
      box.innerHTML = `<div class="kartu kirim">
        <p>${siap ? "" : "Lengkapi daftar periksa penilaian diri terlebih dahulu. "}${nRevisi ? `Kamu sudah merevisi ${nRevisi} kali.` : "Revisi tulisanmu berdasarkan umpan balik, lalu tekan <b>Periksa tulisan</b> lagi untuk meraih bonus revisi."}</p>
        <button class="btn primer" data-final ${siap ? "" : "disabled"}>Kirim tulisan akhir ✓</button></div>`;
      const b = $("[data-final]", el);
      if (b) b.addEventListener("click", kirim);
    }

    function kirim() {
      T.judul = fJudul.value;
      T.teks = fTeks.value;
      const h = periksaTulisan(T.judul, T.teks);
      if (h.par < 3 || h.kata < 100) {
        toast("Tulisan belum memenuhi syarat minimal: 3 paragraf dan 100 kata.");
        return;
      }
      const akhir = T.versi[T.versi.length - 1];
      if (!akhir || akhir.teks !== T.teks || akhir.judul !== T.judul) {
        T.versi.push({ judul: T.judul, teks: T.teks, skor: h.skor, waktu: Date.now() });
      }
      if (!confirm("Kirim tulisan akhir? Setelah dikirim, tulisan tidak dapat diubah lagi.")) {
        simpan();
        return;
      }
      const awal = T.versi[0].skor;
      const terakhir = T.versi[T.versi.length - 1].skor;
      const naik = terakhir - awal;
      T.bonus = T.versi.length > 1 && naik > 0 ? Math.min(A.poinBonusRevisi, 10 + naik) : 0;
      T.final = true;
      T.waktuKirim = Date.now();
      simpan();
      tambahPoin(A.poinTulisanAkhir + A.poinPenilaianDiri, "Tulisan akhir terkirim");
      if (T.bonus) {
        setTimeout(() => tambahPoin(T.bonus, "Bonus revisi"), 700);
        setTimeout(() => beriLencana("perevisi"), 100);
      }
      selesai();
    }

    const pb = $("[data-periksa]", el);
    if (pb) pb.addEventListener("click", () => {
      T.judul = fJudul.value;
      T.teks = fTeks.value;
      if (hitungKata(T.teks) < 30) {
        $("[data-hasil]", el).innerHTML = `<p class="belum">Tulisanmu masih terlalu singkat untuk diperiksa. Tulislah minimal 30 kata.</p>`;
        return;
      }
      const h = periksaTulisan(T.judul, T.teks);
      const sebelum = T.versi.length ? T.versi[T.versi.length - 1] : null;
      if (!sebelum || sebelum.teks !== T.teks || sebelum.judul !== T.judul) {
        T.versi.push({ judul: T.judul, teks: T.teks, skor: h.skor, waktu: Date.now() });
      }
      simpan();
      tampilHasil(h, sebelum ? sebelum.skor : null);
      tampilDiri();
      tampilKirim();
      const lp = $(".langkah-puncak", el);
      if (lp) {
        const s = lp.children;
        s[0].className = "lewat";
        s[1].className = T.diri.every(Boolean) ? "lewat" : "kini";
        s[2].className = T.versi.length > 1 ? "lewat" : T.diri.every(Boolean) ? "kini" : "";
      }
      $("[data-hasil]", el).scrollIntoView({ behavior: "smooth", block: "start" });
    });

    if (T.versi.length) {
      const h = periksaTulisan(T.judul, T.teks);
      tampilHasil(h, T.versi.length > 1 ? T.versi[T.versi.length - 2].skor : null);
      tampilDiri();
    }
    tampilKirim();
  }

  /* ---------------- Kode hasil ---------------- */
  function b64enc(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin);
  }
  function b64dec(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function ringkasHasil(p) {
    const T = p.tulisan;
    return {
      v: 1,
      id: p.id,
      nama: p.nama,
      kelas: p.kelas,
      poin: p.poin,
      lencana: p.lencana,
      posTuntas: jumlahPosTuntas(p),
      misi: Object.keys(p.selesai),
      soal: p.soal,
      peta: p.peta,
      argumen: p.argumen,
      media: p.media || null,
      tulisan: { judul: T.judul, teks: T.teks, final: T.final, bonus: T.bonus, diri: T.diri, versi: T.versi.map((x) => ({ skor: x.skor, waktu: x.waktu, teks: x.teks, judul: x.judul })) },
      waktu: Date.now()
    };
  }
  const buatKode = (p) => "EKSP1:" + b64enc(JSON.stringify(ringkasHasil(p)));
  function bacaKode(kode) {
    kode = kode.trim();
    if (!kode.startsWith("EKSP1:")) throw new Error("Bukan kode Ekspedisi");
    const o = JSON.parse(b64dec(kode.slice(6)));
    if (!o.nama || !o.id) throw new Error("Kode tidak lengkap");
    return o;
  }

  /* ---------------- Halaman: Hasil ---------------- */
  function halHasil() {
    const p = P();
    const kode = buatKode(p);
    const T = p.tulisan;
    app.innerHTML = `
      <nav class="remah"><a href="#/peta">← Peta</a></nav>
      <header class="judul-hal"><p class="kicker">Catatan perjalanan</p><h1>Hasil Ekspedisi ${esc(p.nama)}</h1></header>
      <div class="kartu-grid tiga">
        <div class="kartu stat-besar"><b>${p.poin}</b><span>Total poin</span></div>
        <div class="kartu stat-besar"><b>${jumlahPosTuntas(p)}/4</b><span>Pos tuntas</span></div>
        <div class="kartu stat-besar"><b>${p.lencana.length}</b><span>Lencana</span></div>
      </div>
      <section class="kartu">
        <h2>Kirim kode hasil ke guru</h2>
        <p>Salin kode di bawah ini dan kirimkan kepada gurumu (misalnya melalui WhatsApp atau Google Classroom). Guru akan memasukkannya ke Panel Guru untuk papan peringkat kelas dan penilaian rubrik.</p>
        <textarea class="kode" readonly rows="4">${esc(kode)}</textarea>
        <div class="aksi">
          <button class="btn primer" data-salin>📋 Salin kode</button>
          <button class="btn garis" data-unduh>⬇️ Unduh berkas hasil</button>
        </div>
      </section>
      ${T.final ? `
      <section class="kartu">
        <h2>${esc(T.judul || "Tulisan akhir")}</h2>
        <div class="teks-baca">${T.teks.split(/\n+/).filter((x) => x.trim()).map((x) => `<p>${esc(x)}</p>`).join("")}</div>
        <p class="kecil redup">Riwayat skor periksa: ${T.versi.map((v) => v.skor).join(" → ")}</p>
      </section>` : `<section class="kartu"><p>Tulisan akhir belum dikirim. <a href="#/peta">Lanjutkan ekspedisi</a>.</p></section>`}`;

    $("[data-salin]").addEventListener("click", async () => {
      const ta = $(".kode");
      try { await navigator.clipboard.writeText(kode); toast("Kode tersalin!"); }
      catch (e) { ta.select(); document.execCommand && document.execCommand("copy"); toast("Kode dipilih—salin secara manual bila perlu."); }
    });
    $("[data-unduh]").addEventListener("click", () => {
      unduh(`ekspedisi-${p.nama.replace(/\W+/g, "_")}-${p.kelas.replace(/\W+/g, "_")}.json`, JSON.stringify(ringkasHasil(p), null, 2), "application/json");
    });
  }

  function unduh(nama, isi, tipe) {
    const blob = new Blob([isi], { type: tipe });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nama;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ---------------- Halaman: Papan peringkat ---------------- */
  function halPapan() {
    const baris = {};
    Object.values(guru.hasil).forEach((h) => (baris[h.id] = { id: h.id, nama: h.nama, kelas: h.kelas, poin: h.poin, lencana: h.lencana.length, pos: h.posTuntas, sumber: "kelas" }));
    Object.values(store.profil).forEach((p) => (baris[p.id] = { id: p.id, nama: p.nama, kelas: p.kelas, poin: p.poin, lencana: p.lencana.length, pos: jumlahPosTuntas(p), sumber: "perangkat" }));
    const kelasList = Array.from(new Set(Object.values(baris).map((b) => b.kelas))).sort();
    let filter = "";
    function gambar() {
      const data = Object.values(baris).filter((b) => !filter || b.kelas === filter).sort((a, b) => b.poin - a.poin || b.pos - a.pos);
      $("#tabel-papan").innerHTML = data.length ? data.map((b, i) => `
        <li class="${store.aktif === b.id ? "saya" : ""} ${i < 3 ? "juara j" + (i + 1) : ""}">
          <span class="peringkat">${i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}</span>
          <span class="nama"><b>${esc(b.nama)}</b><small>${esc(b.kelas)} · ${b.pos}/4 pos · ${b.lencana} lencana</small></span>
          <span class="poin">${b.poin}<small>poin</small></span>
        </li>`).join("") : `<li class="kosong">Belum ada penjelajah.</li>`;
    }
    app.innerHTML = `
      <header class="judul-hal"><p class="kicker">Papan Peringkat</p><h1>Penjelajah Teratas</h1>
        <p class="redup">Urutan berdasarkan akumulasi poin. Data kelas tampil setelah guru memasukkan kode hasil peserta didik di Panel Guru pada perangkat ini.</p></header>
      ${kelasList.length > 1 ? `<div class="chip-pilih"><button class="chip aktif" data-k="">Semua kelas</button>${kelasList.map((k) => `<button class="chip" data-k="${esc(k)}">${esc(k)}</button>`).join("")}</div>` : ""}
      <ol class="papan" id="tabel-papan"></ol>`;
    $$("[data-k]").forEach((b) => b.addEventListener("click", () => {
      filter = b.dataset.k;
      $$("[data-k]").forEach((x) => x.classList.toggle("aktif", x === b));
      gambar();
    }));
    gambar();
  }

  /* ---------------- Halaman: Lencana ---------------- */
  function halLencana() {
    const p = P();
    app.innerHTML = `
      <header class="judul-hal"><p class="kicker">Koleksi</p><h1>Lencana Penjelajah</h1></header>
      <div class="kartu-grid tiga">
        ${Object.entries(D.lencana).map(([k, l]) => {
          const punya = p.lencana.includes(k);
          return `<div class="kartu lencana ${punya ? "punya" : "belum"}">
            <div class="lencana-ikon" aria-hidden="true">${punya ? l.ikon : "?"}</div>
            <h3>${esc(l.nama)}</h3><p class="kecil">${esc(l.ket)}</p>
            <span class="tag ${punya ? "hijau" : ""}">${punya ? "Diraih" : "Belum diraih"}</span>
          </div>`;
        }).join("")}
      </div>`;
  }

  /* ---------------- Halaman: Petunjuk ---------------- */
  function halPetunjuk() {
    app.innerHTML = `
      <header class="judul-hal"><p class="kicker">Petunjuk penggunaan</p><h1>Cara Menjelajah</h1></header>
      <div class="kartu-grid dua">
        <section class="kartu">
          <h2>🚶 Langkah bermain</h2>
          <ol class="langkah">
            <li>Masukkan nama dan kelas pada halaman awal.</li>
            <li>Buka <b>Peta</b>, lalu masuki pos yang aktif. Simak <b>Salindia</b> dan tonton <b>Video interaktif</b> (jawab kuis cepat saat video berhenti), lalu baca <b>Bekal materi</b>.</li>
            <li>Selesaikan setiap misi secara berurutan. Misi berikutnya terbuka setelah misi sebelumnya tuntas.</li>
            <li>Pos berikutnya terbuka setelah semua misi di pos sebelumnya tuntas.</li>
            <li>Di <b>Pos 4</b>, tulis teks eksposisi utuh, periksa, nilai diri, revisi, lalu kirim.</li>
            <li>Buka <b>Hasil</b>, salin <b>kode hasil</b>, dan kirimkan kepada guru.</li>
          </ol>
        </section>
        <section class="kartu">
          <h2>🪙 Aturan poin</h2>
          <table class="tabel">
            <tr><td>Setiap soal terjawab benar (termasuk kuis video)</td><td>+${A.poinSoal}</td></tr>
            <tr><td>Menyimak salindia satu pos sampai akhir</td><td>+${A.poinSalindia}</td></tr>
            <tr><td>Menuntaskan video interaktif satu pos</td><td>+${A.poinVideo}</td></tr>
            <tr><td>Menyusun struktur teks</td><td>+${A.poinSoal * 2}</td></tr>
            <tr><td>Menemukan semua kesalahan ejaan</td><td>+${A.poinSoal * 5}</td></tr>
            <tr><td>Peta gagasan / dua argumen</td><td>+${A.poinMisiTulis} tiap misi</td></tr>
            <tr><td>Mengirim tulisan akhir + penilaian diri</td><td>+${A.poinTulisanAkhir + A.poinPenilaianDiri}</td></tr>
            <tr><td>Bonus revisi (skor periksa meningkat)</td><td>+10 s.d. +${A.poinBonusRevisi}</td></tr>
          </table>
          <p class="kecil"><b>Kebebasan untuk gagal:</b> jawaban keliru boleh dicoba lagi tanpa pengurangan poin.</p>
        </section>
        <section class="kartu">
          <h2>🏅 Lencana</h2>
          <ul class="daftar-lencana">${Object.values(D.lencana).map((l) => `<li><span>${l.ikon}</span><div><b>${esc(l.nama)}</b><small>${esc(l.ket)}</small></div></li>`).join("")}</ul>
        </section>
        <section class="kartu">
          <h2>🎯 Capaian & tujuan pembelajaran</h2>
          <p class="kecil">${esc(D.capaian)}</p>
          <ol class="kecil">${D.tujuan.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
        </section>
      </div>
      <section class="kartu">
        <h2>🗺️ Matriks Ekspedisi</h2>
        <div class="gulir"><table class="tabel matriks">
          <thead><tr><th>Pos (level)</th><th>Tahap menulis</th><th>Fokus keterampilan</th><th>Misi</th><th>Elemen gamifikasi</th></tr></thead>
          <tbody>
            ${D.pos.map((x) => `<tr><td><b>Pos ${x.nomor}</b><br>${esc(x.nama)}</td><td>${esc(x.tahap)}</td><td>${esc(x.fokus)}</td>
              <td>${x.misi.map((m) => esc(m.judul.replace(/^Misi( Puncak)? ?\d* — /, ""))).join("; ")}</td>
              <td>${["Poin tiap misi, umpan balik cepat", "Level terbuka bertahap, poin", "Kebebasan untuk gagal, umpan balik cepat", "Papan peringkat, poin bonus revisi"][x.nomor - 1]}; lencana “${esc(D.lencana[x.id].nama)}”</td></tr>`).join("")}
          </tbody></table></div>
      </section>
      <section class="kartu">
        <h2>💾 Catatan teknis</h2>
        <ul class="kecil">
          <li>Media dibuka melalui peramban (Chrome, Firefox, Safari, Edge) di ponsel, tablet, atau laptop tanpa memasang aplikasi.</li>
          <li>Kemajuan tersimpan otomatis di perangkat. Jangan menghapus data peramban sebelum mengirim kode hasil.</li>
          <li>Satu perangkat dapat digunakan bergantian oleh beberapa peserta didik; pilih nama masing-masing di halaman awal.</li>
        </ul>
      </section>`;
  }

  /* ---------------- Halaman: Materi ---------------- */
  function halMateri() {
    app.innerHTML = `
      <header class="judul-hal"><p class="kicker">Bekal materi</p><h1>Teks Eksposisi</h1></header>
      ${D.pos.map((x) => `
        <section class="kartu">
          <p class="kicker">Pos ${x.nomor} · ${esc(x.tahap)}</p>
          <h2>${esc(x.nama)}</h2>
          <div class="media-baris" data-media="${x.id}">${kartuMedia(x)}</div>
          <div class="materi-isi">${x.materi.map((m) => `<article><h3>${esc(m.judul)}</h3><p>${m.isi}</p></article>`).join("")}</div>
        </section>`).join("")}`;
    pasangMedia(app);
  }

  /* ---------------- Halaman: Rubrik ---------------- */
  function tabelRubrik() {
    return `<div class="gulir"><table class="tabel rubrik">
      <thead><tr><th>Aspek</th><th>Skor 4</th><th>Skor 3</th><th>Skor 2</th><th>Skor 1</th></tr></thead>
      <tbody>${D.rubrik.map((r) => `<tr><td><b>${esc(r.aspek)}</b></td>${[3, 2, 1, 0].map((i) => `<td>${esc(r.d[i])}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>
    <p class="kecil">Nilai akhir = (jumlah skor : 20) × 100.</p>`;
  }
  function halRubrik() {
    app.innerHTML = `
      <header class="judul-hal"><p class="kicker">Rubrik penilaian</p><h1>Keterampilan Menulis Teks Eksposisi</h1></header>
      <section class="kartu">${tabelRubrik()}</section>`;
  }

  /* ---------------- Halaman: Panel guru ---------------- */
  function nilaiGuru(h) {
    return h.nilai && h.nilai.every(Boolean) ? Math.round((h.nilai.reduce((a, b) => a + b, 0) / 20) * 100) : null;
  }
  function halGuru() {
    const data = Object.values(guru.hasil).sort((a, b) => (a.kelas + a.nama).localeCompare(b.kelas + b.nama));
    app.innerHTML = `
      <header class="judul-hal"><p class="kicker">Panel Guru</p><h1>Rekap & Penilaian</h1>
        <p class="redup">Tempelkan kode hasil dari peserta didik (boleh banyak sekaligus, satu kode per baris) atau unggah berkas hasil (.json). Data tersimpan di peramban perangkat ini.</p></header>
      <section class="kartu">
        <textarea id="masuk-kode" rows="4" placeholder="EKSP1:..."></textarea>
        <div class="aksi">
          <button class="btn primer" id="btn-impor">Masukkan kode</button>
          <label class="btn garis">Unggah berkas .json<input type="file" id="unggah" accept=".json,application/json" multiple hidden></label>
          ${data.length ? `<button class="btn garis" id="btn-csv">⬇️ Ekspor CSV</button><a class="btn garis" href="#/papan">Tampilkan papan peringkat</a>` : ""}
        </div>
        <div id="pesan-impor" aria-live="polite"></div>
      </section>
      ${data.length ? `
      <section class="kartu">
        <div class="kartu-grid empat ringkas">
          <div class="stat"><b>${data.length}</b><span>Peserta didik</span></div>
          <div class="stat"><b>${data.filter((h) => h.posTuntas === 4).length}</b><span>Mencapai puncak</span></div>
          <div class="stat"><b>${Math.round(data.reduce((a, h) => a + h.poin, 0) / data.length)}</b><span>Rerata poin</span></div>
          <div class="stat"><b>${(() => { const n = data.map(nilaiGuru).filter((x) => x != null); return n.length ? (n.reduce((a, b) => a + b, 0) / n.length).toFixed(1) : "–"; })()}</b><span>Rerata nilai rubrik</span></div>
        </div>
        <div class="gulir"><table class="tabel guru">
          <thead><tr><th>Nama</th><th>Kelas</th><th>Poin</th><th>Pos</th><th>Skor periksa</th><th>Nilai rubrik</th><th></th></tr></thead>
          <tbody>${data.map((h) => {
            const v = h.tulisan && h.tulisan.versi || [];
            const ng = nilaiGuru(h);
            return `<tr>
              <td>${esc(h.nama)}</td><td>${esc(h.kelas)}</td><td>${h.poin}</td><td>${h.posTuntas}/4</td>
              <td>${v.length ? v.map((x) => x.skor).join(" → ") : "–"}</td>
              <td>${ng != null ? `<b>${ng}</b>` : `<span class="redup">belum</span>`}</td>
              <td class="aksi-sel"><button class="btn teks kecil" data-lihat="${esc(h.id)}">Nilai</button><button class="btn teks kecil" data-buang="${esc(h.id)}">Hapus</button></td>
            </tr>`;
          }).join("")}</tbody></table></div>
      </section>` : ""}
      <section class="kartu"><h2>Rubrik</h2>${tabelRubrik()}</section>`;

    function impor(kodeList) {
      let ok = 0, gagal = 0;
      kodeList.forEach((k) => {
        try {
          const o = typeof k === "string" ? bacaKode(k) : k;
          const lama = guru.hasil[o.id];
          if (lama && lama.nilai) o.nilai = lama.nilai;
          if (lama && lama.catatan) o.catatan = lama.catatan;
          guru.hasil[o.id] = o;
          ok++;
        } catch (e) { gagal++; }
      });
      simpanGuru();
      halGuru();
      $("#pesan-impor").innerHTML = `<p class="${ok ? "ok" : "belum"}">${ok} kode berhasil dimasukkan${gagal ? `, ${gagal} kode tidak terbaca` : ""}.</p>`;
    }
    $("#btn-impor").addEventListener("click", () => {
      const isi = $("#masuk-kode").value.match(/EKSP1:[A-Za-z0-9+/=]+/g) || [];
      if (!isi.length) { $("#pesan-impor").innerHTML = `<p class="belum">Tidak ditemukan kode yang diawali “EKSP1:”.</p>`; return; }
      impor(isi);
    });
    $("#unggah").addEventListener("change", async (e) => {
      const list = [];
      for (const f of e.target.files) {
        try { list.push(JSON.parse(await f.text())); } catch (er) { /* abaikan */ }
      }
      impor(list.filter((o) => o && o.id && o.nama));
    });
    const csv = $("#btn-csv");
    if (csv) csv.addEventListener("click", () => {
      const kepala = ["Nama", "Kelas", "Poin", "Pos tuntas", "Lencana", "Skor periksa awal", "Skor periksa akhir"]
        .concat(D.rubrik.map((r) => r.aspek)).concat(["Nilai rubrik", "Penilaian diri (jumlah)", "Catatan guru"]);
      const q = (s) => `"${String(s == null ? "" : s).replace(/"/g, '""')}"`;
      const rows = data.map((h) => {
        const v = (h.tulisan && h.tulisan.versi) || [];
        const n = h.nilai || [];
        const diri = (h.tulisan && h.tulisan.diri) || [];
        return [h.nama, h.kelas, h.poin, h.posTuntas, h.lencana.length, v[0] ? v[0].skor : "", v.length ? v[v.length - 1].skor : ""]
          .concat(D.rubrik.map((_, i) => n[i] || "")).concat([nilaiGuru(h) ?? "", diri.reduce((a, b) => a + b, 0) || "", h.catatan || ""]).map(q).join(",");
      });
      unduh("rekap-ekspedisi.csv", "﻿" + [kepala.map(q).join(",")].concat(rows).join("\n"), "text/csv");
    });
    $$("[data-buang]").forEach((b) => b.addEventListener("click", () => {
      const h = guru.hasil[b.dataset.buang];
      if (!confirm(`Hapus data ${h.nama}?`)) return;
      delete guru.hasil[b.dataset.buang];
      simpanGuru();
      halGuru();
    }));
    $$("[data-lihat]").forEach((b) => b.addEventListener("click", () => modalNilai(guru.hasil[b.dataset.lihat])));
  }

  function modalNilai(h) {
    const T = h.tulisan || {};
    const n = h.nilai || [0, 0, 0, 0, 0];
    const diri = T.diri || [];
    const v = T.versi || [];
    const m = modal(`
      <p class="kicker">${esc(h.kelas)}</p>
      <h2>${esc(h.nama)}</h2>
      <p class="kecil redup">${h.poin} poin · ${h.posTuntas}/4 pos · ${T.final ? "tulisan akhir terkirim" : "tulisan belum dikirim"} · riwayat skor periksa: ${v.map((x) => x.skor).join(" → ") || "–"}</p>
      ${h.peta ? `<details><summary>Peta gagasan & argumen</summary>
        <p><b>Topik:</b> ${esc(h.peta.topik)}<br><b>Tesis:</b> ${esc(h.peta.tesis)}<br><b>Ide:</b> ${(h.peta.ide || []).filter(Boolean).map(esc).join("; ")}<br><b>Data:</b> ${esc(h.peta.data)}</p>
        ${(h.argumen || []).map((a, i) => `<p><b>Argumen ${i + 1}:</b> ${esc(a)}</p>`).join("")}
      </details>` : ""}
      ${v.length > 1 ? `<details><summary>Draf pertama (sebelum revisi)</summary><div class="teks-baca"><h4>${esc(v[0].judul || "")}</h4>${String(v[0].teks).split(/\n+/).filter((x) => x.trim()).map((x) => `<p>${esc(x)}</p>`).join("")}</div></details>` : ""}
      <h3>${esc(T.judul || "(tanpa judul)")}</h3>
      <div class="teks-baca">${String(T.teks || "").split(/\n+/).filter((x) => x.trim()).map((x) => `<p>${esc(x)}</p>`).join("") || "<p class='redup'>Belum ada tulisan.</p>"}</div>
      <form class="form-nilai">
        ${D.rubrik.map((r, ri) => `
          <fieldset class="aspek">
            <legend>${esc(r.aspek)} ${diri[ri] ? `<small class="redup">(penilaian diri: ${diri[ri]})</small>` : ""}</legend>
            <div class="skala ringkas">${[4, 3, 2, 1].map((s) => `<label class="${n[ri] === s ? "pilih" : ""}" title="${esc(r.d[s - 1])}"><input type="radio" name="n${ri}" value="${s}" ${n[ri] === s ? "checked" : ""}><b>${s}</b><span>${esc(r.d[s - 1])}</span></label>`).join("")}</div>
          </fieldset>`).join("")}
        <label class="blok">Catatan untuk peserta didik<textarea name="catatan" rows="2">${esc(h.catatan || "")}</textarea></label>
        <div class="aksi"><span data-nilai class="nilai-akhir"></span><button class="btn primer" type="submit">Simpan nilai</button></div>
      </form>`, "lebar");
    const f = $(".form-nilai", m);
    const hitung = () => {
      const s = D.rubrik.map((_, i) => +((f["n" + i] && f["n" + i].value) || 0));
      $("[data-nilai]", m).textContent = s.every(Boolean) ? `Nilai: ${Math.round((s.reduce((a, b) => a + b, 0) / 20) * 100)}` : "Lengkapi kelima aspek";
      $$("label", f).forEach((l) => { const r = $("input[type=radio]", l); if (r) l.classList.toggle("pilih", r.checked); });
      return s;
    };
    f.addEventListener("change", hitung);
    hitung();
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      h.nilai = hitung();
      h.catatan = f.catatan.value;
      simpanGuru();
      m.remove();
      halGuru();
      toast("Nilai tersimpan.");
    });
  }

  /* ---------------- Mulai ---------------- */
  window.addEventListener("hashchange", rute);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { const m = $(".modal-latar"); if (m) m.remove(); }
  });
  $("#btn-keluar") && $("#btn-keluar").addEventListener("click", () => {
    store.aktif = null;
    simpan();
    location.hash = "#/masuk";
    rute();
  });
  rute();

  window.__ekspedisiAPI = { P, simpan, tambahPoin, beriLencana, toast, segarkanMedia };
  // Untuk pengujian
  window.__ekspedisi = { periksaTulisan, buatKode, bacaKode };
})();
