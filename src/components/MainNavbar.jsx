import React, { useEffect, useState } from "react";
import "./MainNavbar.css";
import logoLight from "../img/LogoParaFondoBlancoaAR2.png";
import logoDark from "../img/LogoFondoAzulAR2.png";
import { Phone, List } from "phosphor-react";
import { useNavigate } from "react-router-dom";

export const MainNavbar = ({ onHomeClick }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goHome = () => {
    onHomeClick?.();
    navigate("/");
    setMenuOpen(false);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const headerClass = `navbar ${scrolled ? "navbar--solid" : "navbar--transparent"} ${menuOpen ? "navbar--open" : ""}`;

  return (
    <header className={headerClass}>
      <div className="navbar__container">

        {/* LOGO */}
        <button className="navbar__logo-btn" onClick={goHome} aria-label="Inicio">
          <img
            src={scrolled ? logoDark : logoLight}
            alt="AR2 Consulting Inmobiliario"
            className="navbar__logo"
          />
        </button>

        {/* MENÚ DESKTOP */}
        <nav className="navbar__menu">
          <button onClick={() => scrollTo("propiedades")}>Propiedades</button>
          <button onClick={() => scrollTo("nosotros")}>Nosotros</button>
          <button onClick={() => scrollTo("servicios")}>Servicios</button>
          <button onClick={() => scrollTo("contacto")}>Contacto</button>
        </nav>

        {/* ACCIONES */}
        <div className="navbar__actions">
          <a href="tel:+34600123456" className="navbar__phone">
            <Phone size={16} weight="bold" />
            <span>+34 600 123 456</span>
          </a>

          <button
            className="navbar__cta"
            onClick={() => scrollTo("contacto")}
          >
            Contáctanos
          </button>

          {/* HAMBURGUESA SOLO MÓVIL */}
          <button
            className="navbar__toggle"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menú"
            aria-expanded={menuOpen}
          >
            <List size={26} />
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <div className={`navbar__mobile ${menuOpen ? "is-open" : ""}`}>
        <button onClick={() => scrollTo("propiedades")}>Propiedades</button>
        <button onClick={() => scrollTo("nosotros")}>Nosotros</button>
        <button onClick={() => scrollTo("servicios")}>Servicios</button>
        <button onClick={() => scrollTo("contacto")}>Contacto</button>
      </div>
    </header>
  );
};
