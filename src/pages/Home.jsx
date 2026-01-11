import React, { useMemo, useState } from "react";
import "./Home.css";
import { MainNavbar } from "../components/MainNavbar";
import { SectionNavbar } from "../components/SectionNavbar";
import { HeroModal } from "../components/HeroModal";
import { ListingSection } from "../components/ListingSection";

export const Home = () => {
  const sections = useMemo(
    () => [
      { key: "discover", label: "Descubrir" },
      { key: "comprar", label: "Comprar" },
      { key: "vender", label: "Vender" },
      { key: "alquilar", label: "Alquilar" },
      { key: "premium", label: "Premium" },
    ],
    []
  );

  const [activeSection, setActiveSection] = useState(null);

  const renderSection = () => {
    if (!activeSection) return null;

    switch (activeSection) {
      case "discover":
        return (
          <ListingSection
            title="Descubre espacios únicos"
            subtitle="Explora colecciones curadas de pisos y casas listas para mudarte."
            highlights={["Vistas 360°", "Recomendaciones con IA", "Tours en directo"]}
          />
        );
      case "comprar":
        return (
          <ListingSection
            title="Compra con confianza"
            subtitle="Filtra por barrio, presupuesto y estilo de vida."
            highlights={["Asesor dedicado", "Alertas de precio", "Análisis de mercado"]}
          />
        );
      case "vender":
        return (
          <ListingSection
            title="Vende más rápido"
            subtitle="Publica tu inmueble con fotos premium y valoración profesional."
            highlights={["Home staging virtual", "Campañas en 48h", "Reportes de visitas"]}
          />
        );
      case "alquilar":
        return (
          <ListingSection
            title="Alquila sin estrés"
            subtitle="Gestión completa de reservas y contratos digitales."
            highlights={["Verificación de inquilinos", "Pagos seguros", "Soporte 24/7"]}
          />
        );
      case "premium":
        return (
          <ListingSection
            title="Experiencia premium"
            subtitle="Atención concierge, visitas privadas y acceso prioritario."
            highlights={["Personal shopper inmobiliario", "Análisis fiscal", "Cierres exprés"]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="home-shell">
      <MainNavbar />
      <SectionNavbar
        sections={sections}
        activeSection={activeSection}
        onSelect={setActiveSection}
      />

      <main className="home-content">
        {!activeSection && <HeroModal />}
        {renderSection()}
      </main>
    </div>
  );
};
