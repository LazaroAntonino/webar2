// Datos globales del sitio AR2 Consulting.
// Centraliza contacto, URL base y datos de Organization para JSON-LD.

export const SITE = {
  name: "AR2 Consulting Inmobiliario",
  legalName: "AR2 Consulting Inmobiliario S.L.",
  // TODO legal (LSSI-CE art. 10): rellenar cuando estén disponibles.
  cif: "", // p.ej. "B12345678"
  address: {
    street: "", // calle y número
    postalCode: "",
    city: "",
    region: "Madrid",
    country: "ES",
  },
  baseUrl: "https://ar2house.com",
  phone: "+34 640 08 15 99",
  email: "info@r2house.com",
  location: "Madrid, Barcelona, Valencia",
  social: {
    instagram: "https://instagram.com/ar2consulting",
    linkedin: "https://linkedin.com/company/ar2-consulting",
    facebook: "https://facebook.com/ar2consulting",
  },
};

// Solo se incluye en el schema cuando hay datos reales (evita emitir campos vacíos).
const postalAddress = SITE.address.street
  ? {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    }
  : undefined;

export const ORGANIZATION_SCHEMA = {
  "@type": "Organization",
  "@id": `${SITE.baseUrl}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.baseUrl,
  logo: {
    "@type": "ImageObject",
    url: `${SITE.baseUrl}/og-image.png`,
    width: 1200,
    height: 630,
  },
  telephone: SITE.phone,
  email: SITE.email,
  ...(SITE.cif ? { taxID: SITE.cif, vatID: `ES${SITE.cif}` } : {}),
  ...(postalAddress ? { address: postalAddress } : {}),
  areaServed: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Málaga", "Jaén"],
  sameAs: Object.values(SITE.social).filter(Boolean),
};
