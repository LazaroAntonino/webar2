import { readFileSync } from "fs";

const html = readFileSync("dist/index.html", "utf8");
const start = html.indexOf("window.__SSG_INMUEBLES__=") + "window.__SSG_INMUEBLES__=".length;
const end = html.indexOf("</script>", start);
const data = JSON.parse(html.slice(start, end));

let issues = [];
for (const p of data) {
  if (!p.id) issues.push("missing id on: " + p.titulo);
  if (!p.titulo) issues.push("id=" + p.id + ": missing titulo");
  if (!p.ubicacion?.ciudad) issues.push("id=" + p.id + ": missing ciudad");
  if (!p.precio || p.precio === 0) issues.push("id=" + p.id + ": precio=0 or missing");
  if (!p.operacion) issues.push("id=" + p.id + ": missing operacion");
  if (!p.tipo) issues.push("id=" + p.id + ": missing tipo");
  if (!p.descripcion) issues.push("id=" + p.id + ": missing descripcion");
  if (!p.agente?.email) issues.push("id=" + p.id + ": missing agente.email");
  if (!p.caracteristicas?.metrosConstruidos) issues.push("id=" + p.id + ": metrosConstruidos=0");
  if (!Array.isArray(p.imagenes) || p.imagenes.length === 0) {
    issues.push("id=" + p.id + " (" + p.titulo?.slice(0,30) + "): NO IMAGES — og:image fallback only");
  } else {
    p.imagenes.forEach((img, i) => {
      if (!img.startsWith("http")) issues.push("id=" + p.id + ": image[" + i + "] invalid: " + img);
    });
  }
  // slug check
  if (!p.slug) issues.push("id=" + p.id + ": missing slug");
  // precioTipo check
  if (p.operacion === "alquiler" && p.precioTipo !== "mes") issues.push("id=" + p.id + ": alquiler but precioTipo=" + p.precioTipo);

  console.log("id=" + p.id + ": " + p.tipo + " | " + p.operacion + " | " + p.precio + "€ | imgs=" + (p.imagenes?.length ?? 0) + " | " + p.titulo?.slice(0, 35));
}

console.log();
if (issues.length) {
  console.log("DATA ISSUES (" + issues.length + "):");
  issues.forEach(i => console.log("  ⚠", i));
} else {
  console.log("✓ All " + data.length + " inmuebles pass data quality checks");
}

// Also check that all detail page HTML files exist for all IDs
import { existsSync } from "fs";
let missingPages = [];
for (const p of data) {
  if (!existsSync("dist/inmuebles/" + p.id + "/index.html")) {
    missingPages.push("dist/inmuebles/" + p.id + "/index.html MISSING");
  }
}
if (missingPages.length) {
  console.log("\nMISSING PAGES:");
  missingPages.forEach(m => console.log("  ✗", m));
} else {
  console.log("✓ All " + data.length + " detail pages exist in dist/");
}
