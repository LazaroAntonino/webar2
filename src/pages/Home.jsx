import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { MainNavbar } from "../components/MainNavbar";
import { Footer } from "../components/Footer";
import { ValuationModal } from "../components/ValuationModal";
import { PropertyCard } from "../components/PropertyCard";
import inmueblesData from "../data/inmuebles.json";

import {
  MapPinLine,
  House,
  ShieldCheck,
  Sparkle,
  Bed,
  Bathtub,
  Ruler,
  Star,
  ArrowRight,
} from "phosphor-react";

/* ================= DATA ESTÁTICA ================= */

const reasons = [
  {
    icon: ShieldCheck,
    title: "Asesoría experta",
    desc: "Equipo senior con operaciones premium en capitales y costa.",
  },
  {
    icon: Sparkle,
    title: "Marketing selectivo",
    desc: "Foto y video editorial, audiencias cualificadas, privacidad total.",
  },
  {
    icon: House,
    title: "Cierres sin fricción",
    desc: "Due diligence completa, negociación y acompañamiento legal.",
  },
];

const testimonials = [
  {
    name: "María G.",
    source: "Compradora en Madrid",
    quote:
      "AR2 convirtió la compra en un proceso claro y rápido. Transparencia total y visitas muy seleccionadas.",
  },
  {
    name: "Jordi R.",
    source: "Vendedor en Barcelona",
    quote:
      "Vendimos en 30 días con reportes semanales y un pricing realista. Comunicación impecable.",
  },
];

/* ================= COMPONENT ================= */

export const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");

  // Obtener inmuebles destacados del JSON (máximo 3)
  const destacados = inmueblesData
    .filter(inmueble => inmueble.destacado)
    .slice(0, 3);

  return (
    <div className="home-shell">
      <MainNavbar onHomeClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />

      <main>
        {/* ================= HERO VALORACIÓN ================= */}
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
            <div className="hero-options">
              <button
                className="hero-option"
                onClick={() => {
                  setTipoSeleccionado("casa");
                  setModalOpen(true);
                }}
              >
                <span className="icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    {/* Casa: tejado triangular + chimenea + puerta */}
                    <path
                      d="M3 11L12 4L21 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 9.5V20H19V9.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 20V14H14V20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 6V4H18V8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="label">Casa</span>
              </button>

              <button
                className="hero-option"
                onClick={() => {
                  setTipoSeleccionado("piso");
                  setModalOpen(true);
                }}
              >
                <span className="icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    {/* Piso: edificio con ventanas múltiples */}
                    <rect
                      x="4"
                      y="3"
                      width="16"
                      height="18"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    {/* Ventanas fila 1 */}
                    <rect x="7" y="6" width="3" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                    <rect x="14" y="6" width="3" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                    {/* Ventanas fila 2 */}
                    <rect x="7" y="11" width="3" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                    <rect x="14" y="11" width="3" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                    {/* Puerta entrada */}
                    <path
                      d="M10 21V17H14V21"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="label">Piso</span>
              </button>

              <button
                className="hero-option"
                onClick={() => {
                  setTipoSeleccionado("local");
                  setModalOpen(true);
                }}
              >
                <span className="icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    {/* Local: toldo + escaparate */}
                    {/* Toldo */}
                    <path
                      d="M3 7L4.5 4H19.5L21 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 7C3 8.5 4 9.5 5.5 9.5C7 9.5 8 8.5 8 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 7C8 8.5 9 9.5 10.5 9.5C12 9.5 13 8.5 13 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M13 7C13 8.5 14 9.5 15.5 9.5C17 9.5 18 8.5 18 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M18 7C18 8.5 19 9.5 20.5 9.5C22 9.5 21 7 21 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    {/* Estructura */}
                    <path
                      d="M4 9V20H20V9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Escaparate */}
                    <rect x="6" y="12" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
                    {/* Puerta */}
                    <path
                      d="M14 20V13H18V20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="15.5" cy="16.5" r="0.5" fill="currentColor" />
                  </svg>
                </span>
                <span className="label">Local</span>
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

        {/* ================= PROPIEDADES ================= */}
        <section className="section" id="propiedades">
          <div className="section__header container">
            <p className="eyebrow navy">Propiedades destacadas</p>
            <h2>Seleccionadas para ti</h2>
            <p className="section__subtitle">
              Curamos inmuebles con potencial y cierre ágil.
            </p>
          </div>

          <div className="properties-grid container">
            {destacados.map((inmueble) => (
              <PropertyCard 
                key={inmueble.id} 
                inmueble={inmueble} 
                variant="featured"
              />
            ))}
          </div>

          {/* Botón ver todos */}
          <div className="properties-cta-wrapper container">
            <Link to="/inmuebles" className="properties-see-all">
              <span>Ver todos los inmuebles</span>
              <ArrowRight size={18} weight="bold" />
            </Link>
          </div>
        </section>

        {/* ================= POR QUÉ ================= */}
        <section className="section section--blue" id="nosotros">
          <div className="section__header container">
            <p className="eyebrow gold">Por qué elegir AR2</p>
            <h2 className="light">Confianza, método y resultados</h2>
          </div>

          <div className="reasons-grid container">
            {reasons.map((r) => (
              <div className="reason-card" key={r.title}>
                <div className="reason-icon">
                  <r.icon size={26} weight="bold" />
                </div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TESTIMONIOS ================= */}
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
                <p className="author">
                  {t.name} · {t.source}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA FINAL ================= */}
        <section className="cta-final" id="contacto">
          <div className="cta-final__overlay"></div>
          <div className="cta-final__content container">
            <h2>¿Quieres vender o comprar sin complicaciones?</h2>
            <p>Un asesor senior te acompaña de principio a fin.</p>
            <button 
              className="cta-btn"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Contáctanos ahora
            </button>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

      {/* ================= MODAL ================= */}
      <ValuationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tipoInicial={tipoSeleccionado}
      />
    </div>
  );
};
