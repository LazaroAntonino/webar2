// scripts/generate-seo.mjs
// Post-build: genera dist/sitemap.xml y dist/robots.txt
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";
import { generateSlug } from "../src/lib/mapInmueble.js";
import { getAllLandingSlugs } from "../src/data/landings/index.js";

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

function toISODate(value) {
  if (!value) return null;

  // Fecha serial de Google Sheets (número de días desde 30/12/1899)
  if (typeof value === "number" || /^\d+(\.\d+)?$/.test(String(value).trim())) {
    const serial = Number(value);
    const ms = (serial - 25569) * 24 * 60 * 60 * 1000;
    const date = new Date(ms);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
  }

  // Fechas en formato ISO o legible
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return null;
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

  const landingUrls = getAllLandingSlugs().map((slug) => ({
    loc: `${BASE_URL}/${slug}`,
    priority: "0.7",
    changefreq: "monthly",
  }));

  const propertyUrls = inmuebles.map((row) => {
    const id = String(row.id).trim();
    const titulo = String(row.titulo || "").trim();
    const rawSlug = String(row.slug || "").trim();
    const slug = rawSlug || generateSlug(titulo, id);
    return {
      loc: `${BASE_URL}/inmuebles/${escapeXml(slug)}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: toISODate(row.fechaPublicacion),
    };
  });

  const allUrls = [...staticUrls, ...landingUrls, ...propertyUrls];

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
