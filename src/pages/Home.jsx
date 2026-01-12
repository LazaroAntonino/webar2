import React from "react";
import "./Home.css";
import { MainNavbar } from "../components/MainNavbar";
import { MapPinLine, House, ShieldCheck, Sparkle, Bed, Bathtub, Ruler, Star } from "phosphor-react";

const featured = [
  {
    title: "Ático dúplex con terraza panorámica",
    price: "1.150.000 €",
    location: "Salamanca, Madrid",
    area: "185 m²",
    beds: 3,
    baths: 3,
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Vivienda jardín con piscina privada",
    price: "890.000 €",
    location: "Pedralbes, Barcelona",
    area: "210 m²",
    beds: 4,
    baths: 3,
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Loft industrial con luz natural",
    price: "640.000 €",
    location: "Ruzafa, Valencia",
    area: "140 m²",
    beds: 2,
    baths: 2,
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=80",
  },
];

const reasons = [
  { icon: ShieldCheck, title: "Asesoría experta", desc: "Equipo senior con operaciones premium en capitales y costa." },
  { icon: Sparkle, title: "Marketing selectivo", desc: "Foto y video editorial, audiencias cualificadas, privacidad total." },
  { icon: House, title: "Cierres sin fricción", desc: "Due diligence completa, negociación y acompañamiento legal." },
];

const testimonials = [
  {
    name: "María G.",
    source: "Compradora en Madrid",
    quote: "AR2 convirtió la compra en un proceso claro y rápido. Transparencia total y visitas muy seleccionadas.",
  },
  {
    name: "Jordi R.",
    source: "Vendedor en Barcelona",
    quote: "Vendimos en 30 días con reportes semanales y un pricing realista. Comunicación impecable.",
  },
];

export const Home = () => {
  return (
    <div className="home-shell">
      <MainNavbar onHomeClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />

      <main>
        <section className="hero hero--valuation" id="inicio">
          <div className="hero__overlay"></div>

          <div className="hero__content container hero-center">
            <p className="hero-badge">
              GRATUITO · CONFIDENCIAL · SIN COMPROMISO
            </p>

            <h1 className="hero-title">
              Reciba su valoración al momento
            </h1>

            <p className="hero-subtitle">
              Conozca el valor real de su vivienda en pocos pasos,
              con asesoramiento profesional.
            </p>

            {/* OPCIONES */}
            <div className="valuation-options valuation-options--center">
              <button className="valuation-option">
                <span className="icon">
                  {/* SVG CASA */}
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 10.5L12 3L21 10.5V21H3V10.5Z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                <span className="label">Casa</span>
              </button>

              <button className="valuation-option">
                <span className="icon">
                  {/* SVG PISO */}
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M9 21V15H15V21" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                <span className="label">Piso</span>
              </button>
            </div>

            {/* TRUST */}
            <div className="trust-list">
              <span>✔ Más de 250.000 propiedades vendidas</span>
              <span>✔ Presencia nacional e internacional</span>
              <span>✔ Expertos locales certificados</span>
            </div>
          </div>
        </section>



        {/* DESTACADAS */}
        <section className="section" id="propiedades">
          <div className="section__header container">
            <p className="eyebrow navy">Propiedades destacadas</p>
            <h2>Seleccionadas para ti</h2>
            <p className="section__subtitle">Curamos inmuebles con potencial y cierre ágil.</p>
          </div>
          <div className="properties-grid container">
            {featured.map((item) => (
              <article className="property-card" key={item.title}>
                <div className="property-card__image" style={{ backgroundImage: `url(${item.image})` }}>
                  <span className="pill pill-light">{item.location}</span>
                </div>
                <div className="property-card__body">
                  <h3>{item.title}</h3>
                  <p className="price">{item.price}</p>
                  <div className="stats">
                    <span><Ruler size={18} /> {item.area}</span>
                    <span><Bed size={18} /> {item.beds} hab.</span>
                    <span><Bathtub size={18} /> {item.baths} baños</span>
                  </div>
                  <button className="ghost-btn nav">Ver propiedad</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* POR QUÉ */}
        <section className="section section--blue" id="nosotros">
          <div className="section__header container">
            <p className="eyebrow gold">Por qué elegir AR2</p>
            <h2 className="light">Confianza, método y resultados</h2>
            <p className="section__subtitle light">Operamos con rigor, marketing selectivo y acompañamiento integral.</p>
          </div>
          <div className="reasons-grid container">
            {reasons.map((r) => (
              <div className="reason-card" key={r.title}>
                <div className="reason-icon"><r.icon size={28} weight="bold" /></div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICIOS / CTA intermedia */}
        <section className="section services" id="servicios">
          <div className="container services__content">
            <div>
              <p className="eyebrow navy">Servicios a medida</p>
              <h2>Compra, venta o alquiler con un partner único</h2>
              <p className="section__subtitle">Valoración realista, home staging, marketing premium, negociación y cierre legal.</p>
            </div>
            <div className="services__cta">
              <button className="cta-btn">Agenda una llamada</button>
              <p className="muted">Respuesta en menos de 24h.</p>
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="section" id="testimonios">
          <div className="section__header container">
            <p className="eyebrow navy">Testimonios</p>
            <h2>La experiencia de nuestros clientes</h2>
          </div>
          <div className="testimonials-grid container">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} weight="fill" color="#fab422" />
                  ))}
                </div>
                <p className="quote">“{t.quote}”</p>
                <p className="author">{t.name} · {t.source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="cta-final" id="contacto">
          <div className="cta-final__overlay"></div>
          <div className="cta-final__content container">
            <h2>¿Quieres vender o comprar sin complicaciones?</h2>
            <p>Un asesor senior te acompaña de principio a fin.</p>
            <button className="cta-btn">Contáctanos ahora</button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container footer__grid">
            <div>
              <h3 className="light">AR2 Consulting Inmobiliario</h3>
              <p>Operamos en Madrid, Barcelona, Valencia y destinos prime.</p>
            </div>
            <div className="footer__col">
              <p className="footer__title">Contacto</p>
              <p>+34 123 456 789</p>
              <p>info@ar2consulting.com</p>
            </div>
            <div className="footer__col">
              <p className="footer__title">Legal</p>
              <p>Privacidad</p>
              <p>Aviso legal</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
