// scripts/generate-seo.mjs
// Post-build: genera dist/sitemap.xml y dist/robots.txt
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");
const BASE_URL = "https://ar2house.com";
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCSUzSkt3wS0wR4vJR8EEWF5Kdukn5KmR30n7y5yYKPu_RmsEG8dlMrL_DF1Tu3gPLrbVlO9-yxT3K/pub?output=csv";

async function fetchInmuebles() {
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`CSV fetch error: ${res.status}`);
  const csv = await res.text();
  return new Promise((resolve, reject) => {
    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: ({ data }) => {
        const inmuebles = data
          .filter((row) => row.id && String(row.id).trim() !== "")
          .filter((row) => {
            const v = String(row.mostrarenweb || "").trim().toUpperCase();
            return v === "TRUE" || v === "1" || v === "SI" || v === "SÍ";
          });
        resolve(inmuebles);
      },
      error: (err) => reject(new Error(err.message)),
    });
  });
}

function escapeXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function main() {
  let inmuebles = [];
  try {
    inmuebles = await fetchInmuebles();
    console.log(`[seo] ${inmuebles.length} inmuebles cargados`);
  } catch (e) {
    console.warn("[seo] No se pudieron cargar los inmuebles:", e.message);
  }

  const staticUrls = [
    { loc: `${BASE_URL}/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${BASE_URL}/inmuebles`, priority: "0.9", changefreq: "daily" },
  ];

  const propertyUrls = inmuebles.map((row) => ({
    loc: `${BASE_URL}/inmuebles/${escapeXml(String(row.id).trim())}`,
    priority: "0.8",
    changefreq: "weekly",
    lastmod: row.fechaPublicacion ? escapeXml(row.fechaPublicacion) : null,
  }));

  const allUrls = [...staticUrls, ...propertyUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>\n    ` : ""}<changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${BASE_URL}/sitemap.xml
`;

  writeFileSync(resolve(DIST, "sitemap.xml"), sitemap, "utf-8");
  writeFileSync(resolve(DIST, "robots.txt"), robots, "utf-8");

  console.log("[seo] dist/sitemap.xml y dist/robots.txt generados");
}

main().catch((e) => {
  console.error("[seo] Error:", e);
  process.exit(1);
});
