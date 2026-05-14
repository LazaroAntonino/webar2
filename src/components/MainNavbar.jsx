import { useEffect, useState } from "react";
import "./MainNavbar.css";
import logoSinFondo from "../img/LogoAR2BlancoSinFondoSinFooter.png";
import { Phone, List, X } from "phosphor-react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export const MainNavbar = ({ onHomeClick, alwaysSolid = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detectar si estamos en la página principal
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const goHome = () => {
    onHomeClick?.();
    navigate("/");
    setMenuOpen(false);
  };

  const scrollTo = (id) => {
    // Si no estamos en home, navegar a home primero y luego scrollear
    if (!isHomePage) {
      navigate('/');
      // Pequeño delay para que el componente Home monte antes de scrollear
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const headerClass = `navbar ${(scrolled || alwaysSolid) ? "navbar--solid" : "navbar--transparent"} ${menuOpen ? "navbar--open" : ""}`;

  return (
    <header className={headerClass}>
      <div className="navbar__container">

        {/* LOGO */}
        <button className="navbar__logo-btn" onClick={goHome} aria-label="Inicio">
          <img
            src={logoSinFondo}
            alt="AR2 Consulting Inmobiliario"
            className="navbar__logo"
          />
        </button>

        {/* MENÚ DESKTOP */}
        <nav className="navbar__menu">
          <Link to="/inmuebles" className="navbar__link">Inmuebles</Link>
          <a href="/#nosotros" className="navbar__link" onClick={(e) => { e.preventDefault(); scrollTo("nosotros"); }}>Nosotros</a>
          <a href="/#testimonios" className="navbar__link" onClick={(e) => { e.preventDefault(); scrollTo("testimonios"); }}>Opiniones</a>
          <a href="/#contacto" className="navbar__link" onClick={(e) => { e.preventDefault(); scrollTo("contacto"); }}>Contacto</a>
        </nav>

        {/* ACCIONES */}
        <div className="navbar__actions">
          <a href="tel:+34640081599" className="navbar__phone">
            <Phone size={16} weight="bold" />
            <span>+34 640 08 15 99</span>
          </a>

          <a
            href="/#contacto"
            className="navbar__cta"
            onClick={(e) => { e.preventDefault(); scrollTo("contacto"); }}
            aria-label="Contactar con AR2 Consulting"
          >
            Contáctanos
          </a>

          {/* HAMBURGUESA SOLO MÓVIL */}
          <button
            className="navbar__toggle"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menú"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={26} /> : <List size={26} />}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <div className={`navbar__mobile ${menuOpen ? "is-open" : ""}`}>
        <Link to="/inmuebles" onClick={() => setMenuOpen(false)}>Inmuebles</Link>
        <a href="/#nosotros" onClick={(e) => { e.preventDefault(); scrollTo("nosotros"); }}>Nosotros</a>
        <a href="/#testimonios" onClick={(e) => { e.preventDefault(); scrollTo("testimonios"); }}>Opiniones</a>
        <a href="/#contacto" onClick={(e) => { e.preventDefault(); scrollTo("contacto"); }}>Contacto</a>
        <a href="tel:+34640081599" className="navbar__mobile-phone" onClick={() => setMenuOpen(false)}>
          📞 +34 640 08 15 99
        </a>
      </div>
    </header>
  );
};
