import { useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { MainNavbar } from "../components/MainNavbar";
import { Footer } from "../components/Footer";
import { LandingContent } from "../components/LandingContent";
import { NotFound } from "./NotFound";
import SEO from "../components/SEO";
import { getLandingBySlug } from "../data/landings";
import { SITE, ORGANIZATION_SCHEMA } from "../data/site.js";
import "./LandingInfo.css";

export function LandingInfo({ basePath, slug: propSlug }) {
  const { localidad } = useParams();
  const { pathname } = useLocation();

  const slug = useMemo(() => {
    if (propSlug) return propSlug;
    if (basePath && localidad) return `${basePath}/${localidad}`;
    return pathname.replace(/^\//, "").replace(/\/$/, "");
  }, [basePath, localidad, pathname, propSlug]);

  const landing = useMemo(() => getLandingBySlug(slug), [slug]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [slug]);

  const jsonLd = useMemo(() => {
    if (!landing) return null;
    const jsonLdGraph = [];

    // Organization
    jsonLdGraph.push(ORGANIZATION_SCHEMA);

    // Article o WebPage según tipo de landing
    const mainEntityType = landing.ogType === "website" ? "WebPage" : "Article";
    const mainEntity = {
      "@type": mainEntityType,
      "@id": `${landing.url}#${mainEntityType.toLowerCase()}`,
      "headline": landing.h1,
      "description": landing.metaDescription,
      "url": landing.url,
      "author": {
        "@type": "Organization",
        "@id": `${SITE.baseUrl}/#organization`,
      },
      "publisher": {
        "@type": "Organization",
        "@id": `${SITE.baseUrl}/#organization`,
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": landing.url,
      },
    };

    if (landing.fechaPublicacion) {
      mainEntity.datePublished = landing.fechaPublicacion;
    }
    if (landing.fechaModificacion) {
      mainEntity.dateModified = landing.fechaModificacion;
    }

    jsonLdGraph.push(mainEntity);

    // BreadcrumbList
    const breadcrumbItems = [{ "@type": "ListItem", position: 1, name: "Inicio", item: SITE.baseUrl }];

    const categoryByTipo = {
      "valor-mercado": { name: "Valoración" },
      "vender-casa": { name: "Vender casa" },
      marca: { name: "AR2" },
      servicio: { name: "Guías" },
    };

    const category = categoryByTipo[landing.tipo];
    if (category) {
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 2,
        name: category.name,
        // No incluimos "item" porque no existe aún una página de índice para estas categorías.
      });
    }

    breadcrumbItems.push({
      "@type": "ListItem",
      position: breadcrumbItems.length + 1,
      name: landing.localidad || landing.h1,
      item: landing.url,
    });

    jsonLdGraph.push({
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems,
    });

    // FAQPage
    if (landing.faqs && landing.faqs.length > 0) {
      jsonLdGraph.push({
        "@type": "FAQPage",
        "mainEntity": landing.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.pregunta,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.respuesta,
          },
        })),
      });
    }

    return {
      "@context": "https://schema.org",
      "@graph": jsonLdGraph,
    };
  }, [landing]);

  if (!landing) {
    return (
      <div className="landing-page-wrapper">
        <MainNavbar alwaysSolid />
        <NotFound />
        <Footer />
      </div>
    );
  }

  return (
    <div className="landing-page-wrapper">
      <SEO
        title={landing.titulo}
        description={landing.metaDescription}
        url={landing.url}
        image={`${SITE.baseUrl}/og-image.png`}
        type={landing.ogType || "article"}
        jsonLd={jsonLd}
      />
      <MainNavbar alwaysSolid />
      <LandingContent landing={landing} />
      <Footer />
    </div>
  );
}

export default LandingInfo;
