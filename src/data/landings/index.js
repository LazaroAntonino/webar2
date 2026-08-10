import { landings, landingsMarca } from "./landingsData.js";

const landingMap = new Map(landings.map((landing) => [landing.slug, landing]));

export function getLandingBySlug(slug) {
  return landingMap.get(slug) || null;
}

export function getAllLandingSlugs() {
  return landings.map((landing) => landing.slug);
}

export function getRelatedLandings(slugs) {
  if (!Array.isArray(slugs)) return [];
  return slugs
    .map((slug) => landingMap.get(slug))
    .filter(Boolean)
    .slice(0, 6);
}

export function getLandingsByType(tipo) {
  return landings.filter((landing) => landing.tipo === tipo);
}

export function getLandingsByLocalidad(localidad) {
  return landings.filter((landing) => landing.localidad === localidad);
}

export { landings, landingsMarca };
