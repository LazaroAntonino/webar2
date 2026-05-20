import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const dist = "dist";
const inmueblesDist = join(dist, "inmuebles");

// Leer los slugs reales desde el dist construido
let slugs = [];
if (existsSync(inmueblesDist)) {
  slugs = readdirSync(inmueblesDist, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .slice(0, 5); // Solo los primeros 5 para el chequeo
}

if (slugs.length === 0) {
  console.log("No se encontraron páginas de detalle en dist/inmuebles/. ¿Has ejecutado el build?");
  process.exit(0);
}

for (const slug of slugs) {
  const filePath = join(inmueblesDist, slug, "index.html");
  if (!existsSync(filePath)) { console.log(slug + ": FILE NOT FOUND"); continue; }
  const html = readFileSync(filePath, "utf8");
  const startTag = html.indexOf('type="application/ld+json"');
  if (startTag === -1) { console.log(slug + ": NO JSON-LD"); continue; }
  const contentStart = html.indexOf(">", startTag) + 1;
  const contentEnd = html.indexOf("</script>", contentStart);
  const raw = html.slice(contentStart, contentEnd);
  try {
    const ld = JSON.parse(raw);
    const graph = ld["@graph"] || [];
    const listing = graph.find(n => n["@type"] === "RealEstateListing");
    const breadcrumb = graph.find(n => n["@type"] === "BreadcrumbList");
    if (listing) {
      console.log(`inmueble ${slug}: OK`);
      console.log(`  name: ${listing.name?.slice(0,45)}`);
      console.log(`  url: ${listing.url}`);
      console.log(`  price: ${listing.offers?.price} ${listing.offers?.priceCurrency}`);
      console.log(`  businessFunction: ${listing.offers?.businessFunction?.split("#")[1]}`);
      console.log(`  city: ${listing.address?.addressLocality}`);
      console.log(`  images: ${listing.image?.length ?? 0}`);
      console.log(`  floorSize: ${listing.floorSize?.value} ${listing.floorSize?.unitCode}`);
      console.log(`  breadcrumb items: ${breadcrumb?.itemListElement?.length ?? 0}`);
    } else {
      console.log(slug + ": no RealEstateListing, types=" + graph.map(n=>n["@type"]).join(","));
    }
  } catch(e) {
    console.log(slug + ": INVALID JSON-LD — " + e.message);
  }
}

