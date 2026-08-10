import { Link } from "react-router-dom";
import {
  MapPin,
  HouseLine,
  Info,
  Users,
  Star,
  TrendUp,
  House,
  GlobeHemisphereWest,
  Scales,
  ArrowRight,
} from "phosphor-react";
import { landings } from "../data/landings";
import "./LandingGuides.css";

// Slugs de las landings que queremos destacar en la home, en orden.
const GUIDE_SLUGS = [
  "cuanto-vale-una-casa/las-rozas",
  "cuanto-vale-una-casa/pozuelo-de-alarcon",
  "cuanto-vale-una-casa/majadahonda",
  "cuanto-vale-una-casa/chamberi",
  "cuanto-vale-una-casa/salamanca",
  "cuanto-vale-una-casa/el-escorial",
  "vender-casa/las-rozas",
  "tasacion-gratuita-vivienda-madrid",
  "valorar-chalet-madrid",
  "comprar-casa-madrid-extranjeros",
  "alquiler-o-compra-madrid",
  "por-que-elegir-agencia-inmobiliaria-premium",
  "que-es-ar2",
  "equipo-ar2",
  "opiniones-ar2-consulting",
];

const ICONS_BY_TYPE = {
  "valor-mercado": MapPin,
  "vender-casa": HouseLine,
  marca: Info,
  servicio: Scales,
};

const FALLBACK_ICONS = {
  "cuanto-vale-una-casa/pozuelo-de-alarcon": TrendUp,
  "cuanto-vale-una-casa/salamanca": TrendUp,
  "valorar-chalet-madrid": House,
  "comprar-casa-madrid-extranjeros": GlobeHemisphereWest,
  "alquiler-o-compra-madrid": Scales,
  "por-que-elegir-agencia-inmobiliaria-premium": Star,
  "opiniones-ar2-consulting": Star,
  "equipo-ar2": Users,
};

const landingMap = new Map(landings.map((l) => [l.slug, l]));

const guides = GUIDE_SLUGS.map((slug) => {
  const landing = landingMap.get(slug);
  if (!landing) {
    console.warn(`[LandingGuides] No se encontró la landing: ${slug}`);
    return null;
  }
  const Icon = FALLBACK_ICONS[slug] || ICONS_BY_TYPE[landing.tipo] || Info;
  return {
    slug,
    icon: Icon,
    title: landing.h1,
    desc: landing.metaDescription,
  };
}).filter(Boolean);

export function LandingGuides() {
  return (
    <section className="landing-guides section" id="guias">
      <div className="container">
        <div className="section__header">
          <span className="eyebrow navy">Recursos inmobiliarios</span>
          <h2>Guías para comprar, vender y valorar</h2>
          <p className="section__subtitle">
            Contenido práctico y actualizado para ayudarte a tomar mejores decisiones inmobiliarias en las zonas donde AR2 tiene presencia.
          </p>
        </div>

        <div className="landing-guides__grid">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <article key={guide.slug} className="landing-guides__card">
                <Link to={`/${guide.slug}`} className="landing-guides__link">
                  <div className="landing-guides__icon">
                    <Icon size={28} weight="bold" aria-hidden="true" />
                  </div>
                  <h3 className="landing-guides__title">{guide.title}</h3>
                  <p className="landing-guides__desc">{guide.desc}</p>
                  <span className="landing-guides__cta">
                    Leer guía <ArrowRight size={16} weight="bold" aria-hidden="true" />
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LandingGuides;
