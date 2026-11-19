// Membuat naskah narasi video untuk direkam (suara manusia).
// Jalankan: node tools/buat-naskah.js  →  audio/NASKAH-NARASI.md
const fs = require("fs");
const vm = require("vm");
const path = require("path");
const akar = path.join(__dirname, "..");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(akar, "js/media.js"), "utf8") + "\nthis.M = MEDIA_EKSPEDISI;", ctx);
const M = ctx.M;
let md = "# Naskah Narasi Video Interaktif Ekspedisi\n\n";
md += "Rekam setiap adegan sebagai satu berkas MP3, lalu simpan dengan nama sesuai kolom **Berkas**.\n";
md += "Pemutar akan otomatis memakai rekaman suara manusia bila **semua** berkas untuk satu pos tersedia.\n\n";
md += "Tips merekam: ruangan tenang, jarak mulut ±20 cm dari mikrofon, bicara santai seperti menyapa siswa, beri jeda singkat antarkalimat.\n\n";
for (const [pos, v] of Object.entries(M.video)) {
  md += `## ${pos.toUpperCase()} — ${v.judul}\n\n| Adegan | Berkas | Narasi |\n|---|---|---|\n`;
  v.adegan.forEach((a, i) => {
    md += `| ${i + 1} | \`audio/${pos}/${i + 1}.mp3\` | ${a.narasi.replace(/\|/g, "\\|")} |\n`;
  });
  md += "\n";
}
fs.writeFileSync(path.join(akar, "audio/NASKAH-NARASI.md"), md);
console.log("Naskah dibuat: audio/NASKAH-NARASI.md");
