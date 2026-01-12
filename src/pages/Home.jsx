import React, { useMemo, useState } from "react";
import "./Home.css";
import { MainNavbar } from "../components/MainNavbar";
import { SectionNavbar } from "../components/SectionNavbar";
import { HeroModal } from "../components/HeroModal";

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

  const renderContent = () => {
    if (!activeSection) return <HeroModal />;

    const current = sections.find((s) => s.key === activeSection);

    return (
      <div className="coming-soon-card">
        <p className="pill">Próximamente</p>
        <h2>{current?.label || "Sección"}</h2>
        <p className="muted">
          Estamos diseñando esta experiencia. Mientras tanto, explora el resto del sitio
          o vuelve al inicio para seguir descubriendo.
        </p>
      </div>
    );
  };

  return (
    <div className="home-shell">
      <MainNavbar onHomeClick={() => setActiveSection(null)} />
      <SectionNavbar
        sections={sections}
        activeSection={activeSection}
        onSelect={setActiveSection}
      />

      <main className="home-content">
        {renderContent()}
      </main>
    </div>
  );
};
