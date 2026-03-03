import React from "react";
import { Link } from "react-router-dom";
import { Phone, EnvelopeSimple, MapPin, InstagramLogo, LinkedinLogo, FacebookLogo } from "phosphor-react";
import logoBlanco from "../img/LogoAR2BlancoSinFondoSinFooter.png";
import "./Footer.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* GRID PRINCIPAL */}
        <div className="footer__grid">
          {/* COLUMNA 1: LOGO Y DESCRIPCIÓN */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img src={logoBlanco} alt="AR2 Consulting Inmobiliario" />
            </Link>
            <p className="footer__description">
              Expertos en consultoría inmobiliaria premium. Te acompañamos en la compra, venta o alquiler de tu propiedad con un servicio personalizado y de máxima confianza.
            </p>
            <div className="footer__social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramLogo size={22} weight="regular" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedinLogo size={22} weight="regular" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookLogo size={22} weight="regular" />
              </a>
            </div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <div className="footer__nav">
            <h4>Navegación</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/inmuebles">Inmuebles</Link></li>
              <li><Link to="/inmuebles?operacion=venta">Comprar</Link></li>
              <li><Link to="/inmuebles?operacion=alquiler">Alquilar</Link></li>
            </ul>
          </div>

          {/* COLUMNA 3: SERVICIOS */}
          <div className="footer__nav">
            <h4>Servicios</h4>
            <ul>
              <li><a href="/#nosotros">Sobre nosotros</a></li>
              <li><a href="/#testimonios">Opiniones</a></li>
              <li><Link to="/">Valoración gratuita</Link></li>
              <li><a href="/#contacto">Contacto</a></li>
            </ul>
          </div>

          {/* COLUMNA 4: CONTACTO */}
          <div className="footer__contact">
            <h4>Contacto</h4>
            <ul>
              <li>
                <Phone size={18} weight="regular" />
                <a href="tel:+34640081599">+34 640 08 15 99</a>
              </li>
              <li>
                <EnvelopeSimple size={18} weight="regular" />
                <a href="mailto:info@ar2.es">info@ar2.es</a>
              </li>
              <li>
                <MapPin size={18} weight="regular" />
                <span>Madrid, Barcelona, Valencia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* LÍNEA DIVISORIA */}
        <div className="footer__divider"></div>

        {/* BOTTOM */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} AR2 Consulting Inmobiliario. Todos los derechos reservados.
          </p>
          <div className="footer__legal">
            <a href="/privacidad">Política de privacidad</a>
            <span>·</span>
            <a href="/aviso-legal">Aviso legal</a>
            <span>·</span>
            <a href="/cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
