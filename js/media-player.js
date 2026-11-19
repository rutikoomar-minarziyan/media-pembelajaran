/* =========================================================
   EKSPEDISI — Pemutar salindia & video interaktif
   ========================================================= */
(function () {
  "use strict";

  const M = MEDIA_EKSPEDISI;
  const api = () => window.__ekspedisiAPI || {};
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const resolve = (v) => (v && v.ref ? M.salindia[v.ref[0]][v.ref[1]] : v);

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
      slide.className = "pm-slide masuk-" + (arah || "kanan");
      langkah = 0;
      o.querySelector(".pm-hitung").textContent = `${i + 1} / ${daftar.length}`;
      o.querySelectorAll(".pm-titik button").forEach((b, k) => b.classList.toggle("aktif", k === i));
      o.querySelector("[data-prev]").disabled = i === 0;
      perbaruiTombol();
      if (i === daftar.length - 1) selesaiSalindia();
    }
    function frags() { return slide.querySelectorAll(".frag"); }
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
  let suaraID = null;
  function cariSuara() {
    if (!("speechSynthesis" in window)) return null;
    const v = speechSynthesis.getVoices();
    suaraID = v.find((x) => /^id(-|_)?/i.test(x.lang)) || v.find((x) => /indonesia/i.test(x.name)) || null;
    return suaraID;
  }
  if ("speechSynthesis" in window) {
    cariSuara();
    speechSynthesis.addEventListener && speechSynthesis.addEventListener("voiceschanged", cariSuara);
  }
  const durasi = (narasi) => Math.max(6, Math.round((narasi.split(/\s+/).length / 2.4) * 10) / 10); // ±145 kata/menit
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  function bukaVideo(posId) {
    const vid = M.video[posId];
    if (!vid) return;
    const D = window.EKSPEDISI || EKSPEDISI;
    const pos = D.pos.find((x) => x.id === posId);
    const a = api();
    const adegan = vid.adegan.map((s) => ({ ...s, dur: durasi(s.narasi) }));
    const awal = [];
    let tot = 0;
    adegan.forEach((s) => { awal.push(tot); tot += s.dur; });

    const o = overlay("video-pemutar");
    let idx = 0, t = 0, main = false, last = 0, raf = 0, cc = true, suara = !!suaraID, kecepatan = 1;
    let menungguSuara = false, kuisAktif = false, selesai = false;
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
        </div>
        <div class="vd-kontrol">
          <div class="vd-garis" role="slider" aria-label="Linimasa video" tabindex="0">
            <div class="vd-isi"></div>
            ${adegan.map((_, k) => k ? `<span class="vd-sekat" style="left:${(awal[k] / tot) * 100}%"></span>` : "").join("")}
            ${vid.kuis.map((q, qi) => `<span class="vd-penanda" data-q="${qi}" style="left:${((awal[q.setelah] + adegan[q.setelah].dur) / tot) * 100}%" title="Kuis ${qi + 1}">?</span>`).join("")}
          </div>
          <div class="vd-tombol">
            <button class="pm-btn" data-mundur aria-label="Adegan sebelumnya">⏮</button>
            <button class="pm-btn besar primer" data-main aria-label="Putar">▶</button>
            <button class="pm-btn" data-maju aria-label="Adegan berikutnya">⏭</button>
            <span class="vd-waktu">0:00 / ${fmt(tot)}</span>
            <span class="vd-spasi"></span>
            <button class="pm-btn kecil aktif" data-cc aria-pressed="true" title="Teks narasi">CC</button>
            <button class="pm-btn kecil ${suara ? "aktif" : ""}" data-suara aria-pressed="${suara}" title="${suaraID ? "Suara narator" : "Suara bahasa Indonesia tidak tersedia di perangkat ini"}" ${suaraID ? "" : "disabled"}>🔊</button>
            <button class="pm-btn kecil" data-cepat title="Kecepatan">1×</button>
            <button class="pm-btn kecil" data-fs title="Layar penuh" aria-label="Layar penuh">⛶</button>
          </div>
        </div>
      </div>`;

    const $ = (s) => o.querySelector(s);
    const panggung = $(".vd-panggung");

    function tampilAdegan(k) {
      idx = k;
      $(".vd-adegan").innerHTML = visual(adegan[k].v);
      $(".vd-adegan").className = "vd-adegan main-anim";
      const frs = $(".vd-adegan").querySelectorAll(".frag");
      // atur jeda kemunculan butir merata dalam 70% durasi adegan
      const jeda = frs.length ? Math.min(2.2, (adegan[k].dur * 0.7) / (frs.length + 1)) : 0;
      frs.forEach((f, j) => f.style.setProperty("--tunda", ((j + 1) * jeda) / kecepatan + "s"));
      $(".vd-adegan").classList.toggle("jeda", !main);
      $(".vd-cc").textContent = adegan[k].narasi;
      $(".vd-cc").hidden = !cc;
      bicara();
    }
    function bicara() {
      if (!("speechSynthesis" in window)) return;
      speechSynthesis.cancel();
      if (!suara || !main || !suaraID) return;
      const u = new SpeechSynthesisUtterance(adegan[idx].narasi);
      u.voice = suaraID;
      u.lang = suaraID.lang;
      u.rate = 1.0 * kecepatan;
      u.onend = () => { menungguSuara = false; };
      speechSynthesis.speak(u);
    }
    function perbaruiGaris() {
      const el = awal[idx] + t;
      $(".vd-isi").style.width = Math.min(100, (el / tot) * 100) + "%";
      $(".vd-waktu").textContent = `${fmt(el)} / ${fmt(tot)}`;
      $(".vd-garis").setAttribute("aria-valuenow", Math.round(el));
    }
    function setMain(v) {
      main = v;
      $("[data-main]").textContent = main ? "⏸" : "▶";
      $("[data-main]").setAttribute("aria-label", main ? "Jeda" : "Putar");
      $(".vd-adegan").classList.toggle("jeda", !main);
      panggung.classList.toggle("diputar", main);
      if (main) {
        last = performance.now();
        raf = requestAnimationFrame(detak);
        if ("speechSynthesis" in window) {
          if (speechSynthesis.paused) speechSynthesis.resume();
          if (!speechSynthesis.speaking && suara && t < 0.3) bicara();
        }
      } else {
        cancelAnimationFrame(raf);
        if ("speechSynthesis" in window && speechSynthesis.speaking) speechSynthesis.pause();
      }
    }
    function detak(now) {
      if (!main) return;
      const dt = Math.min(0.25, (now - last) / 1000) * kecepatan;
      last = now;
      if (!menungguSuara) t += dt;
      if (t >= adegan[idx].dur) {
        t = adegan[idx].dur;
        if (suara && "speechSynthesis" in window && speechSynthesis.speaking) menungguSuara = true;
        else { menungguSuara = false; keAdeganBerikut(); }
      }
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
      kuisAktif = true;
      const q = vid.kuis[qi].soal;
      const kunci = `vid:${posId}:${qi}`;
      $(".vd-lapis").innerHTML = `<div class="vd-kuis" role="group" aria-label="Kuis">
        <p class="vd-kuis-label">⏸ Kuis cepat ${qi + 1}/${vid.kuis.length}</p>
        <p class="vd-kuis-t">${esc(q.t)}</p>
        <div class="vd-kuis-o">${q.o.map((x, j) => `<button data-o="${j}"><span>${"ABC"[j]}</span>${esc(x)}</button>`).join("")}</div>
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
            setMain(true);
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
      selesai = true;
      if ("speechSynthesis" in window) speechSynthesis.cancel();
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
      const blok = vid.kuis.find((q, j) => !dijawab.has(j) && q.setelah < k);
      if (blok) { k = blok.setelah; toast("Jawab kuis di titik ini dulu, ya!"); }
      $(".vd-lapis").classList.remove("tampil");
      selesai = false;
      menungguSuara = false;
      t = 0;
      tampilAdegan(Math.max(0, Math.min(adegan.length - 1, k)));
      perbaruiGaris();
    }
    function toast(s) { a.toast ? a.toast(s) : null; }

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
    $("[data-suara]").addEventListener("click", (e) => {
      suara = !suara;
      e.currentTarget.classList.toggle("aktif", suara);
      e.currentTarget.setAttribute("aria-pressed", suara);
      if (!suara) { menungguSuara = false; if ("speechSynthesis" in window) speechSynthesis.cancel(); }
      else if (main) bicara();
    });
    $("[data-cepat]").addEventListener("click", (e) => {
      kecepatan = kecepatan === 1 ? 1.25 : kecepatan === 1.25 ? 1.5 : kecepatan === 1.5 ? 0.75 : 1;
      e.currentTarget.textContent = kecepatan + "×";
      if (main && suara) { t = 0; bicara(); }
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
      if (e.target.closest(".vd-kuis")) return;
      if (e.key === " " || e.key === "k") { e.preventDefault(); $("[data-main]").click(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); lompat(idx + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); lompat(idx - 1); }
      else if (e.key === "Escape" && !document.fullscreenElement) tutup();
    };
    document.addEventListener("keydown", tombol, true);
    const tutup = () => tutupOverlay(o, () => {
      main = false;
      cancelAnimationFrame(raf);
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      document.removeEventListener("keydown", tombol, true);
    });
    $("[data-x]").addEventListener("click", tutup);

    tampilAdegan(0);
    perbaruiGaris();
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
