import { readFileSync } from "fs";

for (const id of ["1","2","3","4","5"]) {
  const html = readFileSync(`dist/inmuebles/${id}/index.html`, "utf8");
  const startTag = html.indexOf('type="application/ld+json"');
  if (startTag === -1) { console.log(id + ": NO JSON-LD"); continue; }
  const contentStart = html.indexOf(">", startTag) + 1;
  const contentEnd = html.indexOf("</script>", contentStart);
  const raw = html.slice(contentStart, contentEnd);
  try {
    const ld = JSON.parse(raw);
    const graph = ld["@graph"] || [];
    const listing = graph.find(n => n["@type"] === "RealEstateListing");
    const breadcrumb = graph.find(n => n["@type"] === "BreadcrumbList");
    if (listing) {
      console.log(`inmueble ${id}: OK`);
      console.log(`  name: ${listing.name?.slice(0,45)}`);
      console.log(`  url: ${listing.url}`);
      console.log(`  price: ${listing.offers?.price} ${listing.offers?.priceCurrency}`);
      console.log(`  businessFunction: ${listing.offers?.businessFunction?.split("#")[1]}`);
      console.log(`  city: ${listing.address?.addressLocality}`);
      console.log(`  images: ${listing.image?.length ?? 0}`);
      console.log(`  floorSize: ${listing.floorSize?.value} ${listing.floorSize?.unitCode}`);
      console.log(`  breadcrumb items: ${breadcrumb?.itemListElement?.length ?? 0}`);
    } else {
      console.log(id + ": no RealEstateListing, types=" + graph.map(n=>n["@type"]).join(","));
    }
  } catch(e) {
    console.log(id + ": INVALID JSON-LD — " + e.message);
  }
}
