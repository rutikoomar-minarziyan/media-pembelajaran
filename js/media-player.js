/* =========================================================
   EKSPEDISI — Pemutar salindia & video interaktif
   ========================================================= */
(function () {
  "use strict";

  const M = MEDIA_EKSPEDISI;
  const api = () => window.__ekspedisiAPI || {};
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const resolve = (v) => {
    if (!v || !v.ref) return v;
    const s = M.salindia[v.ref[0]] || [];
    return s.find((x) => x.id === v.ref[1]) || (typeof v.ref[1] === "number" ? s[v.ref[1]] : null) || { tipe: "sampul", judul: "" };
  };

  /* ---------------- Renderer visual bersama ---------------- */
  // Setiap elemen .frag muncul bertahap. --i menentukan urutan.
  function visual(v) {
    v = resolve(v);
    let n = 0;
    const f = () => `class="frag" style="--i:${n++}"`;
    const fc = (cls) => `class="frag ${cls}" style="--i:${n++}"`;
    switch (v.tipe) {
      case "sampul":
        return `<div class="sl sl-sampul">
          <div class="sl-ikon-besar" aria-hidden="true">${v.ikon || ""}</div>
          <p class="sl-kicker">${esc(v.kicker || "")}</p>
          <h2 class="sl-judul-besar">${esc(v.judul)}</h2>
          ${v.sub ? `<p class="sl-sub">${esc(v.sub)}</p>` : ""}
        </div>`;
      case "poin":
        return `<div class="sl"><h2 class="sl-judul">${esc(v.judul)}</h2>
          <ul class="sl-poin">${v.butir.map((b) => `<li ${f()}><span class="sl-pi" aria-hidden="true">${b.ikon}</span><div><b>${esc(b.t)}</b><small>${esc(b.d)}</small></div></li>`).join("")}</ul></div>`;
      case "banding": {
        const kol = (k) => `<div ${fc("sl-kol " + k.nada)}><h3>${k.nada === "ok" ? "✓" : k.nada === "bad" ? "✗" : "•"} ${esc(k.label)}</h3>
          <ul>${k.butir.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>`;
        return `<div class="sl"><h2 class="sl-judul">${esc(v.judul)}</h2><div class="sl-banding">${kol(v.kiri)}${kol(v.kanan)}</div></div>`;
      }
      case "contoh":
        return `<div class="sl"><h2 class="sl-judul">${esc(v.judul)}</h2>
          <p class="sl-kalimat">${v.bagian.map((b) => `<span ${fc("sl-tanda w" + b.w)}><span class="sl-lbl">${esc(b.label)}</span>${esc(b.t)}</span>`).join(" ")}</p>
          ${v.ket ? `<p ${fc("sl-ket")}>${esc(v.ket)}</p>` : ""}</div>`;
      case "struktur":
        return `<div class="sl"><h2 class="sl-judul">${esc(v.judul)}</h2>
          <ol class="sl-struktur">${v.blok.map((b) => `<li ${f()}><span class="sl-bi" aria-hidden="true">${b.ikon}</span><div><b>${esc(b.label)}</b><small>${esc(b.t)}</small></div></li>`).join("")}</ol></div>`;
      case "alur":
        return `<div class="sl"><h2 class="sl-judul">${esc(v.judul)}</h2>
          <ol class="sl-alur">${v.langkah.map((l, i) => `<li ${f()}><span>${i + 1}</span>${esc(l)}</li>`).join("")}</ol></div>`;
      case "peta":
        return `<div class="sl"><h2 class="sl-judul">${esc(v.judul)}</h2>
          <div class="sl-peta"><div class="sl-pusat">${esc(v.pusat)}</div>
          ${v.cabang.map((c, i) => `<div ${fc("sl-cabang c" + i)}>${esc(c)}</div>`).join("")}</div></div>`;
      case "chip":
        return `<div class="sl"><h2 class="sl-judul">${esc(v.judul)}</h2>
          ${v.grup.map((g) => `<div ${fc("sl-grup")}><h3>${esc(g.label)}</h3><div class="sl-chips">${g.chips.map((c) => `<span>${esc(c)}</span>`).join("")}</div></div>`).join("")}
          ${v.contoh ? `<p ${fc("sl-ket")}>“${esc(v.contoh)}”</p>` : ""}</div>`;
      case "tebak":
        return `<div class="sl sl-tebak"><p class="sl-kicker gelap">🤔 ${esc(v.judul || "Tebak dulu!")}</p>
          <h2 class="sl-judul">${esc(v.t)}</h2>
          <div class="sl-opsi">${v.o.map((o, j) => `<button class="sl-opsi-btn" data-tebak="${j}"><span>${"ABCD"[j]}</span>${esc(o)}</button>`).join("")}</div>
          <p class="sl-umpan" aria-live="polite"></p></div>`;
      default:
        return `<div class="sl"><h2 class="sl-judul">${esc(v.judul || "")}</h2></div>`;
    }
  }

  /* ---------------- Utilitas layar penuh ---------------- */
  function overlay(kelas) {
    const o = document.createElement("div");
    o.className = "pemutar " + kelas;
    o.setAttribute("role", "dialog");
    o.setAttribute("aria-modal", "true");
    document.body.appendChild(o);
    document.body.classList.add("terkunci-gulir");
    return o;
  }
  function tutupOverlay(o, lepas) {
    if (lepas) lepas();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    o.remove();
    document.body.classList.remove("terkunci-gulir");
  }
  function layarPenuh(el) {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  }
  function catatMedia(jenis, posId) {
    const a = api();
    const p = a.P && a.P();
    if (!p) return false;
    p.media = p.media || { salindia: {}, video: {} };
    if (p.media[jenis][posId]) return false;
    p.media[jenis][posId] = true;
    a.simpan();
    return true;
  }
  function cekTekun() {
    const a = api();
    const p = a.P && a.P();
    if (!p || !p.media) return;
    const semua = Object.keys(M.salindia).every((k) => p.media.salindia[k]) && Object.keys(M.video).every((k) => p.media.video[k]);
    if (semua) a.beriLencana("tekun");
  }

  /* =================== SALINDIA =================== */
  function bukaSalindia(posId, mulai) {
    const daftar = M.salindia[posId];
    if (!daftar) return;
    const pos = (window.EKSPEDISI || EKSPEDISI).pos.find((x) => x.id === posId);
    const o = overlay("salindia-pemutar");
    let i = mulai || 0;
    let langkah = 0; // jumlah frag yang sudah tampak

    o.innerHTML = `
      <div class="pm-atas">
        <span class="pm-judul">📽️ Salindia Pos ${pos.nomor}: ${esc(pos.nama)}</span>
        <span class="pm-hitung" aria-live="polite"></span>
        <button class="pm-btn" data-fs title="Layar penuh" aria-label="Layar penuh">⛶</button>
        <button class="pm-btn" data-x title="Tutup" aria-label="Tutup">✕</button>
      </div>
      <div class="pm-panggung"><div class="pm-slide" tabindex="0"></div></div>
      <div class="pm-bawah">
        <button class="pm-btn besar" data-prev aria-label="Sebelumnya">‹</button>
        <div class="pm-titik">${daftar.map((_, k) => `<button data-ke="${k}" aria-label="Salindia ${k + 1}"></button>`).join("")}</div>
        <button class="pm-btn besar primer" data-next aria-label="Berikutnya">›</button>
      </div>`;
    const slide = o.querySelector(".pm-slide");

    function gambar(arah) {
      slide.innerHTML = visual(daftar[i]);
      pasangTebak(daftar[i]);
      slide.className = "pm-slide masuk-" + (arah || "kanan");
      langkah = 0;
      o.querySelector(".pm-hitung").textContent = `${i + 1} / ${daftar.length}`;
      o.querySelectorAll(".pm-titik button").forEach((b, k) => b.classList.toggle("aktif", k === i));
      o.querySelector("[data-prev]").disabled = i === 0;
      perbaruiTombol();
      if (i === daftar.length - 1) selesaiSalindia();
    }
    function frags() { return slide.querySelectorAll(".frag"); }
    function pasangTebak(s) {
      if (s.tipe !== "tebak") return;
      const um = slide.querySelector(".sl-umpan");
      slide.querySelectorAll("[data-tebak]").forEach((b) => b.addEventListener("click", (e) => {
        e.stopPropagation();
        if (+b.dataset.tebak === s.k) {
          b.classList.add("benar");
          slide.querySelectorAll("[data-tebak]").forEach((x) => (x.disabled = true));
          um.className = "sl-umpan ok";
          um.textContent = "✓ " + s.u;
        } else {
          b.classList.add("salah");
          b.disabled = true;
          um.className = "sl-umpan belum";
          um.textContent = "✗ Belum tepat. Coba lagi!";
        }
      }));
    }
    function perbaruiTombol() {
      const akhir = i === daftar.length - 1 && langkah >= frags().length;
      const nb = o.querySelector("[data-next]");
      nb.textContent = akhir ? "✓" : "›";
      nb.setAttribute("aria-label", akhir ? "Selesai" : "Berikutnya");
    }
    function maju() {
      const fr = frags();
      if (langkah < fr.length) {
        fr[langkah].classList.add("tampak");
        langkah++;
        perbaruiTombol();
        return;
      }
      if (i < daftar.length - 1) { i++; gambar("kanan"); }
      else tutup();
    }
    function mundur() {
      if (i > 0) {
        i--;
        gambar("kiri");
        frags().forEach((x) => x.classList.add("tampak"));
        langkah = frags().length;
        perbaruiTombol();
      }
    }
    function selesaiSalindia() {
      if (catatMedia("salindia", posId)) {
        const a = api();
        a.tambahPoin && a.tambahPoin((window.EKSPEDISI || EKSPEDISI).aturan.poinSalindia, "Salindia selesai disimak");
        cekTekun();
        a.segarkanMedia && a.segarkanMedia();
      }
    }
    const tombol = (e) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); maju(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); mundur(); }
      else if (e.key === "Escape" && !document.fullscreenElement) tutup();
    };
    const tutup = () => tutupOverlay(o, () => document.removeEventListener("keydown", tombol, true));
    document.addEventListener("keydown", tombol, true);

    o.querySelector("[data-next]").addEventListener("click", maju);
    o.querySelector("[data-prev]").addEventListener("click", mundur);
    o.querySelector("[data-x]").addEventListener("click", tutup);
    o.querySelector("[data-fs]").addEventListener("click", () => layarPenuh(o));
    o.querySelectorAll("[data-ke]").forEach((b) => b.addEventListener("click", () => {
      const k = +b.dataset.ke;
      const arah = k < i ? "kiri" : "kanan";
      i = k;
      gambar(arah);
    }));
    o.querySelector(".pm-panggung").addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      const r = e.currentTarget.getBoundingClientRect();
      (e.clientX - r.left < r.width * 0.3 ? mundur : maju)();
    });
    // geser (swipe)
    let x0 = null;
    slide.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    slide.addEventListener("touchend", (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) { e.preventDefault(); (dx < 0 ? maju : mundur)(); }
      x0 = null;
    });
    gambar();
    slide.focus();
  }

  /* =================== VIDEO INTERAKTIF =================== */

  /* ---------- Pemilihan suara: utamakan suara alami (neural) ---------- */
  const KUNCI_SUARA = "ekspedisi.suara";
  const adaTTS = "speechSynthesis" in window;
  function skorSuara(v) {
    let s;
    if (/^id([-_]|$)/i.test(v.lang)) s = 100;
    else if (/indonesia/i.test(v.name)) s = 90;
    else return -1;
    if (/natural|neural|online|premium|enhanced|wavenet/i.test(v.name)) s += 50; // suara neural, paling mirip manusia
    if (/google/i.test(v.name)) s += 30;
    if (!v.localService) s += 5;
    return s;
  }
  function daftarSuara() {
    if (!adaTTS) return [];
    return speechSynthesis.getVoices().filter((v) => skorSuara(v) >= 0).sort((a, b) => skorSuara(b) - skorSuara(a));
  }
  const suaraAlami = (v) => !!v && skorSuara(v) >= 130;
  function suaraTerpilih() {
    const semua = daftarSuara();
    let simpan = null;
    try { simpan = localStorage.getItem(KUNCI_SUARA); } catch (e) { /* abaikan */ }
    return semua.find((v) => v.name === simpan) || semua[0] || null;
  }
  if (adaTTS && speechSynthesis.addEventListener) speechSynthesis.addEventListener("voiceschanged", () => {});
  if (adaTTS) speechSynthesis.getVoices();

  const durasi = (narasi) => Math.max(6, Math.round((narasi.split(/\s+/).length / 2.3) * 10) / 10); // ±140 kata/menit
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const pecahKalimat = (t) => t.match(/[^.!?]+[.!?]*["”’]?\s*/g).map((x) => x.trim()).filter(Boolean);

  /* ---------- Narator: rekaman suara manusia atau suara peramban ---------- */
  function buatNarator(posId, adegan, onSiap) {
    const n = {
      mode: "tts",          // "rekaman" | "tts" | "mati"
      rekamanAda: false,
      suara: suaraTerpilih(),
      kecepatan: 1,
      aktif: false,         // sedang menarasikan adegan
      _token: 0, _k: 0, _kal: [], _ki: 0, _audio: []
    };
    // Rekaman manusia: audio/<pos>/<nomor adegan>.mp3 (dimulai dari 1)
    let sisa = adegan.length, ok = 0;
    adegan.forEach((s, k) => {
      const au = new Audio();
      au.preload = "metadata";
      au.src = s.audio || `audio/${posId}/${k + 1}.mp3`;
      au.addEventListener("loadedmetadata", () => { s.durRekaman = au.duration; ok++; if (--sisa === 0) selesai(); }, { once: true });
      au.addEventListener("error", () => { if (--sisa === 0) selesai(); }, { once: true });
      au.addEventListener("ended", () => { if (n.mode === "rekaman" && n._k === k) n.aktif = false; });
      n._audio[k] = au;
    });
    function selesai() {
      n.rekamanAda = ok === adegan.length;
      if (n.rekamanAda) n.mode = "rekaman";
      else if (!n.suara) n.mode = "mati";
      onSiap(n);
    }
    if (!n.suara && adaTTS) {
      // daftar suara di sebagian peramban baru tersedia beberapa saat kemudian
      setTimeout(() => { if (!n.suara) { n.suara = suaraTerpilih(); if (n.suara && n.mode === "mati") { n.mode = "tts"; onSiap(n); } } }, 700);
    }

    n.berhenti = () => {
      n._token++;
      n.aktif = false;
      n._audio.forEach((a) => { try { a.pause(); } catch (e) { /* abaikan */ } });
      if (adaTTS) speechSynthesis.cancel();
    };
    n.mulai = (k) => {
      n.berhenti();
      n._k = k;
      if (n.mode === "mati") return;
      n.aktif = true;
      if (n.mode === "rekaman") {
        const a = n._audio[k];
        a.currentTime = 0;
        a.playbackRate = n.kecepatan;
        a.play().catch(() => { n.aktif = false; });
        return;
      }
      n._kal = pecahKalimat(adegan[k].narasi);
      n._ki = 0;
      ucap(n._token);
    };
    function ucap(token) {
      if (token !== n._token || !n.suara) { if (token === n._token) n.aktif = false; return; }
      if (n._ki >= n._kal.length) { n.aktif = false; return; }
      const u = new SpeechSynthesisUtterance(n._kal[n._ki]);
      u.voice = n.suara;
      u.lang = n.suara.lang;
      u.rate = 0.95 * n.kecepatan; // sedikit lebih lambat agar terdengar wajar
      u.pitch = 1;
      u.onend = () => {
        if (token !== n._token) return;
        n._ki++;
        // jeda singkat antarkalimat seperti orang bercerita
        setTimeout(() => ucap(token), 260 / n.kecepatan);
      };
      u.onerror = () => { if (token === n._token) n.aktif = false; };
      speechSynthesis.speak(u);
    }
    n.jeda = () => {
      if (n.mode === "rekaman") { n._audio[n._k].pause(); return; }
      // pause() suara peramban tidak andal: hentikan dan ulangi kalimat saat dilanjutkan
      n._token++;
      if (adaTTS) speechSynthesis.cancel();
    };
    n.lanjut = () => {
      if (n.mode === "mati" || !n.aktif) return;
      if (n.mode === "rekaman") { n._audio[n._k].play().catch(() => {}); return; }
      n._token++;
      ucap(n._token);
    };
    n.durasiAdegan = (k) => (n.mode === "rekaman" && adegan[k].durRekaman ? adegan[k].durRekaman + 0.6 : adegan[k].dur);
    return n;
  }

  function bukaVideo(posId) {
    const vid = M.video[posId];
    if (!vid) return;
    const D = window.EKSPEDISI || EKSPEDISI;
    const pos = D.pos.find((x) => x.id === posId);
    const a = api();
    const adegan = vid.adegan.map((s) => ({ ...s, dur: durasi(s.narasi) }));
    let awal = [], tot = 0;

    const o = overlay("video-pemutar");
    let idx = 0, t = 0, main = false, last = 0, raf = 0, cc = true;
    let kuisAktif = false, selesai = false;
    const dijawab = new Set();
    const p = a.P && a.P();
    vid.kuis.forEach((q, qi) => { if (p && p.soal && (p.soal[`vid:${posId}:${qi}`] || {}).benar) dijawab.add(qi); });

    o.innerHTML = `
      <div class="pm-atas">
        <span class="pm-judul">🎬 ${esc(vid.judul)} <small>· Pos ${pos.nomor}</small></span>
        <button class="pm-btn" data-x title="Tutup" aria-label="Tutup">✕</button>
      </div>
      <div class="vd-wadah">
        <div class="vd-panggung">
          <div class="vd-latar" aria-hidden="true"><span class="awan a1"></span><span class="awan a2"></span><span class="gunung-v"></span></div>
          <div class="vd-adegan"></div>
          <div class="vd-pemandu" aria-hidden="true"><span>🧑🏽‍🏫</span></div>
          <div class="vd-cc" aria-live="polite"></div>
          <div class="vd-lapis"></div>
          <div class="vd-panel-suara" hidden></div>
        </div>
        <div class="vd-kontrol">
          <div class="vd-garis" role="slider" aria-label="Linimasa video" tabindex="0"></div>
          <div class="vd-tombol">
            <button class="pm-btn" data-mundur aria-label="Adegan sebelumnya">⏮</button>
            <button class="pm-btn besar primer" data-main aria-label="Putar">▶</button>
            <button class="pm-btn" data-maju aria-label="Adegan berikutnya">⏭</button>
            <span class="vd-waktu"></span>
            <span class="vd-spasi"></span>
            <button class="pm-btn kecil aktif" data-cc aria-pressed="true" title="Teks narasi">CC</button>
            <button class="pm-btn kecil" data-suara title="Pilih suara narator">🔊 <span data-label-suara>…</span></button>
            <button class="pm-btn kecil" data-cepat title="Kecepatan">1×</button>
            <button class="pm-btn kecil" data-fs title="Layar penuh" aria-label="Layar penuh">⛶</button>
          </div>
        </div>
      </div>`;

    const $ = (s) => o.querySelector(s);
    const panggung = $(".vd-panggung");
    const narator = buatNarator(posId, adegan, () => { hitungLinimasa(); labelSuara(); });

    function hitungLinimasa() {
      awal = []; tot = 0;
      adegan.forEach((_, k) => { awal.push(tot); tot += narator.durasiAdegan(k); });
      $(".vd-garis").innerHTML = `<div class="vd-isi"></div>
        ${adegan.map((_, k) => k ? `<span class="vd-sekat" style="left:${(awal[k] / tot) * 100}%"></span>` : "").join("")}
        ${vid.kuis.map((q, qi) => `<span class="vd-penanda" data-q="${qi}" style="left:${((awal[q.setelah] + narator.durasiAdegan(q.setelah)) / tot) * 100}%" title="Kuis ${qi + 1}">?</span>`).join("")}`;
      perbaruiGaris();
    }
    function labelSuara() {
      const l = $("[data-label-suara]");
      if (narator.mode === "rekaman") l.textContent = "Rekaman";
      else if (narator.mode === "tts") l.textContent = suaraAlami(narator.suara) ? "Alami" : "Peramban";
      else l.textContent = "Mati";
      $("[data-suara]").classList.toggle("aktif", narator.mode !== "mati");
    }
    function panelSuara() {
      const pn = $(".vd-panel-suara");
      if (!pn.hidden) { pn.hidden = true; return; }
      const sv = daftarSuara();
      const adaAlami = sv.some(suaraAlami);
      pn.innerHTML = `<p class="vd-ps-judul">Suara narator</p>
        ${narator.rekamanAda ? `<button data-pilih="rekaman" class="${narator.mode === "rekaman" ? "pilih" : ""}">🎙️ Rekaman suara manusia <small>direkomendasikan</small></button>` : ""}
        ${sv.map((v, i) => `<button data-pilih="v${i}" class="${narator.mode === "tts" && narator.suara === v ? "pilih" : ""}">🗣️ ${esc(v.name.replace(/\s*-\s*Indonesian.*$/i, ""))} ${suaraAlami(v) ? "<small>alami</small>" : ""}</button>`).join("")}
        <button data-pilih="mati" class="${narator.mode === "mati" ? "pilih" : ""}">🔇 Tanpa suara (teks saja)</button>
        ${!narator.rekamanAda && !adaAlami ? `<p class="vd-ps-saran">💡 Perangkat ini belum memiliki suara alami bahasa Indonesia. Buka media di <b>Microsoft Edge</b> atau <b>Chrome di Android</b> untuk suara yang lebih mirip manusia.</p>` : ""}`;
      pn.hidden = false;
      pn.querySelectorAll("[data-pilih]").forEach((b) => b.addEventListener("click", () => {
        const v = b.dataset.pilih;
        if (v === "rekaman") narator.mode = "rekaman";
        else if (v === "mati") narator.mode = "mati";
        else {
          narator.mode = "tts";
          narator.suara = sv[+v.slice(1)];
          try { localStorage.setItem(KUNCI_SUARA, narator.suara.name); } catch (e) { /* abaikan */ }
        }
        pn.hidden = true;
        labelSuara();
        const k = idx;
        t = 0;
        hitungLinimasa();
        tampilAdegan(k);
      }));
    }

    function tampilAdegan(k) {
      idx = k;
      $(".vd-adegan").innerHTML = visual(adegan[k].v);
      $(".vd-adegan").className = "vd-adegan main-anim";
      const d = narator.durasiAdegan(k);
      const frs = $(".vd-adegan").querySelectorAll(".frag");
      // butir muncul merata dalam 70% durasi adegan, selaras dengan narasi
      const jeda = frs.length ? Math.min(2.6, (d * 0.7) / (frs.length + 1)) : 0;
      frs.forEach((f, j) => f.style.setProperty("--tunda", ((j + 1) * jeda) / narator.kecepatan + "s"));
      $(".vd-adegan").classList.toggle("jeda", !main);
      $(".vd-cc").textContent = adegan[k].narasi;
      $(".vd-cc").hidden = !cc;
      if (main) narator.mulai(k);
      else narator.berhenti();
    }
    function perbaruiGaris() {
      if (!awal.length) return;
      const el = awal[idx] + t;
      const isi = $(".vd-isi");
      if (isi) isi.style.width = Math.min(100, (el / tot) * 100) + "%";
      $(".vd-waktu").textContent = `${fmt(el)} / ${fmt(tot)}`;
      $(".vd-garis").setAttribute("aria-valuenow", Math.round(el));
    }
    function setMain(v) {
      const sebelumnya = main;
      main = v;
      $("[data-main]").textContent = main ? "⏸" : "▶";
      $("[data-main]").setAttribute("aria-label", main ? "Jeda" : "Putar");
      $(".vd-adegan").classList.toggle("jeda", !main);
      panggung.classList.toggle("diputar", main);
      if (main && !sebelumnya) {
        last = performance.now();
        raf = requestAnimationFrame(detak);
        if (t < 0.3) narator.mulai(idx);
        else narator.lanjut();
      } else if (!main) {
        cancelAnimationFrame(raf);
        narator.jeda();
      }
    }
    function detak(now) {
      if (!main) return;
      const dt = Math.min(0.25, (now - last) / 1000) * narator.kecepatan;
      last = now;
      const d = narator.durasiAdegan(idx);
      t = Math.min(d, t + dt);
      // adegan berpindah setelah waktunya habis DAN narator selesai berbicara
      if (t >= d && !narator.aktif) keAdeganBerikut();
      perbaruiGaris();
      if (main) raf = requestAnimationFrame(detak);
    }
    function keAdeganBerikut() {
      const qi = vid.kuis.findIndex((q, j) => q.setelah === idx && !dijawab.has(j));
      if (qi >= 0) return tampilKuis(qi);
      if (idx < adegan.length - 1) {
        t = 0;
        tampilAdegan(idx + 1);
        perbaruiGaris();
      } else akhir();
    }
    function tampilKuis(qi) {
      setMain(false);
      narator.berhenti();
      kuisAktif = true;
      const q = vid.kuis[qi].soal;
      const kunci = `vid:${posId}:${qi}`;
      $(".vd-lapis").innerHTML = `<div class="vd-kuis" role="group" aria-label="Kuis">
        <p class="vd-kuis-label">⏸ Kuis cepat ${qi + 1}/${vid.kuis.length}</p>
        <p class="vd-kuis-t">${esc(q.t)}</p>
        <div class="vd-kuis-o">${q.o.map((x, j) => `<button data-o="${j}"><span>${"ABCD"[j]}</span>${esc(x)}</button>`).join("")}</div>
        <p class="vd-kuis-u" aria-live="polite"></p>
      </div>`;
      $(".vd-lapis").classList.add("tampil");
      const tombolO = $(".vd-lapis").querySelectorAll("[data-o]");
      tombolO[0].focus();
      let coba = 0;
      tombolO.forEach((b) => b.addEventListener("click", () => {
        coba++;
        const pp = a.P && a.P();
        if (+b.dataset.o === q.k) {
          b.classList.add("benar");
          tombolO.forEach((x) => (x.disabled = true));
          $(".vd-kuis-u").innerHTML = `✓ ${esc(q.u)} <button class="vd-lanjut">Lanjutkan video ▶</button>`;
          $(".vd-kuis-u").className = "vd-kuis-u ok";
          dijawab.add(qi);
          if (pp) {
            pp.soal = pp.soal || {};
            if (!(pp.soal[kunci] || {}).benar) {
              pp.soal[kunci] = { benar: true, coba };
              a.simpan();
              a.tambahPoin(D.aturan.poinSoal, coba === 1 ? "Kuis video tepat!" : "Kuis video tuntas");
            }
          }
          const lanjut = $(".vd-lanjut");
          lanjut.focus();
          lanjut.addEventListener("click", () => {
            $(".vd-lapis").classList.remove("tampil");
            $(".vd-lapis").innerHTML = "";
            kuisAktif = false;
            keAdeganBerikut();
            if (!selesai) setMain(true);
          });
        } else {
          b.classList.add("salah");
          b.disabled = true;
          $(".vd-kuis-u").textContent = "✗ Belum tepat. Coba pilihan lain—tidak ada pengurangan poin!";
          $(".vd-kuis-u").className = "vd-kuis-u belum";
        }
      }));
    }
    function akhir() {
      setMain(false);
      narator.berhenti();
      selesai = true;
      const baru = catatMedia("video", posId);
      $(".vd-lapis").innerHTML = `<div class="vd-kuis vd-akhir">
        <div class="vd-akhir-ikon">🎉</div>
        <p class="vd-kuis-t">Video selesai!</p>
        <p>Kamu menjawab ${dijawab.size} dari ${vid.kuis.length} kuis cepat.</p>
        <div class="vd-akhir-aksi"><button data-ulang>↺ Tonton ulang</button><button data-selesai class="primer">Tutup</button></div>
      </div>`;
      $(".vd-lapis").classList.add("tampil");
      $("[data-ulang]").addEventListener("click", () => { selesai = false; $(".vd-lapis").classList.remove("tampil"); lompat(0); setMain(true); });
      $("[data-selesai]").addEventListener("click", tutup);
      if (baru) {
        a.tambahPoin(D.aturan.poinVideo, "Video interaktif selesai");
        cekTekun();
        a.segarkanMedia && a.segarkanMedia();
      }
    }
    function lompat(k) {
      if (kuisAktif) return;
      // tidak boleh melompati kuis yang belum dijawab
      const bi = vid.kuis.findIndex((q, j) => !dijawab.has(j) && q.setelah < k);
      if (bi >= 0) {
        const blok = vid.kuis[bi];
        // melompat dari adegan yang memiliki kuis: tampilkan kuisnya
        if (blok.setelah === idx) return tampilKuis(bi);
        k = blok.setelah;
        toast("Jawab kuis di titik ini dulu, ya!");
      }
      $(".vd-lapis").classList.remove("tampil");
      selesai = false;
      t = 0;
      tampilAdegan(Math.max(0, Math.min(adegan.length - 1, k)));
      perbaruiGaris();
    }
    function toast(s) { if (a.toast) a.toast(s); }

    $("[data-main]").addEventListener("click", () => {
      if (kuisAktif) return;
      if (selesai) { lompat(0); return setMain(true); }
      setMain(!main);
    });
    $("[data-maju]").addEventListener("click", () => lompat(idx + 1));
    $("[data-mundur]").addEventListener("click", () => lompat(t > 2 ? idx : idx - 1));
    $("[data-cc]").addEventListener("click", (e) => {
      cc = !cc;
      e.currentTarget.classList.toggle("aktif", cc);
      e.currentTarget.setAttribute("aria-pressed", cc);
      $(".vd-cc").hidden = !cc;
    });
    $("[data-suara]").addEventListener("click", panelSuara);
    $("[data-cepat]").addEventListener("click", (e) => {
      narator.kecepatan = narator.kecepatan === 1 ? 1.25 : narator.kecepatan === 1.25 ? 1.5 : narator.kecepatan === 1.5 ? 0.75 : 1;
      e.currentTarget.textContent = narator.kecepatan + "×";
      if (main) { t = 0; narator.mulai(idx); }
    });
    $("[data-fs]").addEventListener("click", () => layarPenuh(o));
    $(".vd-garis").addEventListener("click", (e) => {
      if (e.target.classList.contains("vd-penanda")) return lompat(vid.kuis[+e.target.dataset.q].setelah);
      const r = e.currentTarget.getBoundingClientRect();
      const s = ((e.clientX - r.left) / r.width) * tot;
      let k = 0;
      awal.forEach((v, j) => { if (s >= v) k = j; });
      lompat(k);
    });
    $(".vd-adegan").addEventListener("click", () => !kuisAktif && !selesai && setMain(!main));

    const tombol = (e) => {
      if (e.target.closest(".vd-kuis") || e.target.closest(".vd-panel-suara")) return;
      if (e.key === " " || e.key === "k") { e.preventDefault(); $("[data-main]").click(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); lompat(idx + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); lompat(idx - 1); }
      else if (e.key === "Escape" && !document.fullscreenElement) tutup();
    };
    document.addEventListener("keydown", tombol, true);
    const tutup = () => tutupOverlay(o, () => {
      main = false;
      cancelAnimationFrame(raf);
      narator.berhenti();
      document.removeEventListener("keydown", tombol, true);
    });
    $("[data-x]").addEventListener("click", tutup);

    hitungLinimasa();
    labelSuara();
    tampilAdegan(0);
    $("[data-main]").focus();
  }

  /* ---------------- Ringkasan untuk kartu ---------------- */
  function info(posId) {
    const v = M.video[posId];
    const tot = v ? v.adegan.reduce((s, x) => s + durasi(x.narasi), 0) : 0;
    return {
      nSalindia: (M.salindia[posId] || []).length,
      durVideo: fmt(tot),
      nKuis: v ? v.kuis.length : 0
    };
  }

  window.MediaEkspedisi = { bukaSalindia, bukaVideo, info, visual };
  // Halaman pertama sudah digambar sebelum berkas ini dimuat: isi kartu media sekarang.
  if (api().segarkanMedia) api().segarkanMedia();
})();
