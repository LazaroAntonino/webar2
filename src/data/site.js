// Datos globales del sitio AR2 Consulting.
// Centraliza contacto, URL base y datos de Organization para JSON-LD.

export const SITE = {
  name: "AR2 Consulting Inmobiliario",
  baseUrl: "https://ar2house.com",
  phone: "+34 640 08 15 99",
  email: "r.estremera@r2house.com",
  location: "Madrid, Barcelona, Valencia",
  social: {
    instagram: "https://instagram.com/ar2consulting",
    linkedin: "https://linkedin.com/company/ar2-consulting",
    facebook: "https://facebook.com/ar2consulting",
  },
};

export const ORGANIZATION_SCHEMA = {
  "@type": "Organization",
  "@id": `${SITE.baseUrl}/#organization`,
  name: SITE.name,
  url: SITE.baseUrl,
  logo: {
    "@type": "ImageObject",
    url: `${SITE.baseUrl}/og-image.png`,
    width: 1200,
    height: 630,
  },
  telephone: SITE.phone,
  email: SITE.email,
  areaServed: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Málaga", "Jaén"],
  sameAs: Object.values(SITE.social).filter(Boolean),
};
