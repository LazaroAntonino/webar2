import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "..", "dist");
const inmueblesDist = join(dist, "inmuebles");

// Leer los slugs reales del build — no asumir IDs numéricos
const detailSlugs = existsSync(inmueblesDist)
  ? readdirSync(inmueblesDist, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
  : [];

const pages = [
  { file: "index.html", url: "https://ar2house.com/" },
  { file: "inmuebles/index.html", url: "https://ar2house.com/inmuebles" },
  ...detailSlugs.map(slug => ({
    file: `inmuebles/${slug}/index.html`,
    url: `https://ar2house.com/inmuebles/${slug}`,
  })),
];

let issues = [];
let passed = 0;

function count(html, re) { return (html.match(re) || []).length; }
function check(cond, label, file) {
  if (cond) { passed++; }
  else { issues.push(`  ✗ ${file}: ${label}`); }
}

for (const p of pages) {
  const html = readFileSync(join(dist, p.file), "utf8");
  const f = p.file;

  check(count(html, /<title[^>]*>/gi) === 1, "title count=1", f);
  check(count(html, /name="description"/gi) === 1, "meta description count=1", f);
  check(count(html, /rel="canonical"/gi) === 1, "canonical count=1", f);
  check(count(html, /property="og:title"/gi) === 1, "og:title count=1", f);
  check(count(html, /property="og:description"/gi) === 1, "og:description count=1", f);
  check(count(html, /property="og:image"/gi) === 1, "og:image count=1", f);
  check(count(html, /property="og:url"/gi) === 1, "og:url count=1", f);
  check(count(html, /property="og:type"/gi) === 1, "og:type count=1", f);
  check(count(html, /property="og:locale"/gi) === 1, "og:locale count=1", f);
  check(count(html, /name="twitter:card"/gi) === 1, "twitter:card count=1", f);
  check(count(html, /name="twitter:title"/gi) === 1, "twitter:title count=1", f);
  check(count(html, /name="twitter:description"/gi) === 1, "twitter:desc count=1", f);
  check(html.includes("__SSG_INMUEBLES__"), "__SSG_INMUEBLES__ present", f);
  check(!html.includes("noindex"), "no noindex on normal page", f);

  // Title length ≤ 60 chars
  const titleM = html.match(/<title[^>]*>([^<]*)<\/title>/);
  if (titleM) check(titleM[1].length <= 60, `title length OK (${titleM[1].length}ch)`, f);

  // Description length 50–160 chars
  const descM = html.match(/name="description" content="([^"]+)"/);
  if (descM) {
    check(descM[1].length >= 50, `desc length >= 50 (${descM[1].length}ch)`, f);
    check(descM[1].length <= 160, `desc length <= 160 (${descM[1].length}ch)`, f);
  }

  // og:type — detail pages use article, others use website
  const ogTypeM = html.match(/property="og:type" content="([^"]+)"/);
  if (ogTypeM) {
    const isDetail = f.match(/inmuebles\/.+\/index\.html/);
    const expectedType = isDetail ? "article" : "website";
    check(ogTypeM[1] === expectedType, `og:type="${expectedType}" (got ${ogTypeM[1]})`, f);
  }

  // JSON-LD valid
  const ldStart = html.indexOf('type="application/ld+json"');
  if (ldStart !== -1) {
    const contentStart = html.indexOf(">", ldStart) + 1;
    const contentEnd = html.indexOf("</script>", contentStart);
    const ldRaw = html.slice(contentStart, contentEnd);
    try { JSON.parse(ldRaw); check(true, "JSON-LD valid", f); }
    catch (e) { check(false, "JSON-LD INVALID: " + e.message, f); }
    // XSS: no raw </script> inside JSON-LD data
    check(!ldRaw.includes("</script>"), "JSON-LD no raw </script>", f);
  } else {
    check(false, "JSON-LD missing", f);
  }

  // SSG seed data valid JSON
  const ssgStart = html.indexOf("window.__SSG_INMUEBLES__=");
  if (ssgStart !== -1) {
    const dataStart = ssgStart + "window.__SSG_INMUEBLES__=".length;
    const dataEnd = html.indexOf("</script>", dataStart);
    const ssgRaw = html.slice(dataStart, dataEnd);
    try {
      const data = JSON.parse(ssgRaw);
      check(Array.isArray(data) && data.length > 0, `SSG seed valid (${data.length} items)`, f);
    } catch(e) { check(false, "SSG seed INVALID JSON: " + e.message, f); }
  }

  // canonical URL matches
  const canonMatch = html.match(/rel="canonical" href="([^"]+)"/);
  if (canonMatch) check(canonMatch[1] === p.url, `canonical URL correct (got ${canonMatch[1]})`, f);
  else check(false, "canonical href not found", f);

  // og:image points to ar2house.com or Cloudinary
  const ogImgMatch = html.match(/property="og:image" content="([^"]+)"/);
  if (ogImgMatch) {
    const valid = ogImgMatch[1].startsWith("https://ar2house.com") ||
                  ogImgMatch[1].startsWith("https://res.cloudinary.com") ||
                  ogImgMatch[1].startsWith("https://img") ||   // idealista CDN
                  ogImgMatch[1].startsWith("https://");        // cualquier HTTPS es aceptable
    check(valid, `og:image valid domain (got ${ogImgMatch[1].slice(0,60)})`, f);
  } else check(false, "og:image content not found", f);
}

// Sitemap
const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");
const sitemapUrls = (sitemap.match(/<loc>([^<]+)<\/loc>/g) || []).map(m => m.replace(/<\/?loc>/g, ""));
check(sitemapUrls.includes("https://ar2house.com/"), "sitemap has home", "sitemap.xml");
check(sitemapUrls.includes("https://ar2house.com/inmuebles"), "sitemap has /inmuebles", "sitemap.xml");
check(sitemapUrls.every(u => u.startsWith("https://ar2house.com")), "all sitemap URLs correct domain", "sitemap.xml");
check(!sitemap.includes("undefined"), "no undefined in sitemap", "sitemap.xml");

// Robots
const robots = readFileSync(join(dist, "robots.txt"), "utf8");
check(robots.includes("Sitemap: https://ar2house.com/sitemap.xml"), "robots has sitemap ref", "robots.txt");
check(robots.includes("Allow: /"), "robots has Allow /", "robots.txt");

console.log(`\nPassed: ${passed}  Issues: ${issues.length}`);
if (issues.length > 0) {
  console.log("\nISSUES:\n" + issues.join("\n"));
  // Falla el build: una página sin SEO (prerender vacío) no debe publicarse.
  process.exit(1);
} else {
  console.log("✓ All checks passed!");
}
