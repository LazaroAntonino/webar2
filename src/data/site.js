// Datos globales del sitio AR2 Consulting.
// Centraliza contacto, URL base y datos de Organization para JSON-LD.

export const SITE = {
  name: "AR2 Consulting Inmobiliario", // marca comercial (para mostrar)
  legalName: "Promociones Inmobiliarias Citicasa S.L.", // sociedad titular (aviso legal + schema)
  cif: "B83706762",
  address: {
    street: "Calle Flores, 7 (esquina a Calle Esperanza)",
    postalCode: "28231",
    city: "Las Rozas de Madrid",
    region: "Madrid",
    country: "ES",
  },
  baseUrl: "https://ar2house.com",
  phone: "+34 640 08 15 99",
  email: "info@ar2house.com",
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
      ...(SITE.address.postalCode ? { postalCode: SITE.address.postalCode } : {}),
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
