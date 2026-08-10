import { Link, useNavigate } from "react-router-dom";
import { LandingBreadcrumb } from "./LandingBreadcrumb";
import { RelatedLandings } from "./RelatedLandings";
import { ArrowRight, CheckCircle, Phone } from "phosphor-react";
import { navigateToHash } from "../lib/scroll.js";
import { SITE } from "../data/site.js";

const EYEBROW_LABELS = {
  "valor-mercado": "Guía de valoración",
  "vender-casa": "Vender mi casa",
  marca: "Sobre AR2",
  servicio: "Guía y servicios",
};

function isHomeHash(href) {
  return typeof href === "string" && href.startsWith("/#");
}

function CtaLink({ href, className, children }) {
  const navigate = useNavigate();

  if (isHomeHash(href)) {
    return (
      <a
        href={href}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          navigateToHash(navigate, href.replace("/", ""));
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

export function LandingContent({ landing }) {
  const { h1, introduccion, secciones, faqs, cta, relacionadas, tipo } = landing;

  const heroEyebrow = EYEBROW_LABELS[tipo] || "Guía AR2";

  return (
    <div className="landing-page">
      {/* HERO */}
      <section className="landing-hero">
        <div className="landing-hero__overlay" />
        <div className="landing-hero__content container">
          <LandingBreadcrumb landing={landing} />
          <span className="landing-hero__eyebrow">{heroEyebrow}</span>
          <h1 className="landing-hero__title">{h1}</h1>
          <p className="landing-hero__intro">{introduccion}</p>
          <CtaLink href={cta.enlace} className="landing-hero__cta">
            {cta.texto}
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </CtaLink>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <div className="landing-body">
        <div className="container">
          <div className="landing-layout">
            <main className="landing-main">
              {secciones.map((seccion, index) => (
                <section key={index} className="landing-section">
                  <h2 className="landing-section__title">{seccion.titulo}</h2>
                  <p className="landing-section__text">{seccion.contenido}</p>
                  {seccion.items && seccion.items.length > 0 && (
                    <ul className="landing-section__list">
                      {seccion.items.map((item, idx) => (
                        <li key={idx} className="landing-section__item">
                          <CheckCircle size={20} weight="fill" className="landing-section__icon" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {/* FAQ */}
              {faqs && faqs.length > 0 && (
                <section className="landing-faq">
                  <h2 className="landing-section__title">Preguntas frecuentes</h2>
                  <div className="landing-faq__list">
                    {faqs.map((faq, idx) => (
                      <details key={idx} className="landing-faq__item">
                        <summary className="landing-faq__question">{faq.pregunta}</summary>
                        <p className="landing-faq__answer">{faq.respuesta}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* CTA BOX */}
              <section className="landing-cta-box">
                <div className="landing-cta-box__content">
                  <h2 className="landing-cta-box__title">{cta.texto}</h2>
                  <p className="landing-cta-box__text">{cta.descripcion}</p>
                  <div className="landing-cta-box__actions">
                    <CtaLink href={cta.enlace} className="landing-cta-box__btn landing-cta-box__btn--primary">
                      {cta.texto}
                      <ArrowRight size={18} weight="bold" aria-hidden="true" />
                    </CtaLink>
                    <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="landing-cta-box__btn landing-cta-box__btn--secondary">
                      <Phone size={18} weight="bold" aria-hidden="true" />
                      Llamar ahora
                    </a>
                  </div>
                </div>
              </section>
            </main>

            {/* SIDEBAR */}
            <aside className="landing-sidebar">
              <div className="landing-sidebar__box">
                <h3 className="landing-sidebar__title">¿Necesitas ayuda?</h3>
                <p className="landing-sidebar__text">
                  Un asesor senior de AR2 puede resolver tus dudas y darte una valoración personalizada.
                </p>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="landing-sidebar__phone">
                  <Phone size={18} weight="bold" aria-hidden="true" />
                  {SITE.phone}
                </a>
                <CtaLink href="/#contacto" className="landing-sidebar__cta">
                  Solicitar información
                </CtaLink>
              </div>

              <div className="landing-sidebar__box landing-sidebar__box--trust">
                <h3 className="landing-sidebar__title">Por qué confiar en AR2</h3>
                <ul className="landing-sidebar__list">
                  <li>Valoración gratuita y sin compromiso</li>
                  <li>Asesor senior de principio a fin</li>
                  <li>Marketing selectivo y profesional</li>
                  <li>Transparencia total en cada fase</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* RELACIONADAS */}
      <RelatedLandings slugs={relacionadas} />
    </div>
  );
}

export default LandingContent;
