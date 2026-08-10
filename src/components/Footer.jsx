import { Link } from "react-router-dom";
import { Phone, EnvelopeSimple, MapPin, InstagramLogo, LinkedinLogo, FacebookLogo } from "phosphor-react";
import logoBlanco from "../img/LogoAR2BlancoSinFondoSinFooter.png";
import { SITE } from "../data/site.js";
import "./Footer.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const phoneHref = `tel:${SITE.phone.replace(/\s/g, "")}`;

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
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramLogo size={22} weight="regular" aria-hidden="true" />
              </a>
              <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedinLogo size={22} weight="regular" aria-hidden="true" />
              </a>
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookLogo size={22} weight="regular" aria-hidden="true" />
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

          {/* COLUMNA 3: GUÍAS */}
          <div className="footer__nav">
            <h4>Guías</h4>
            <ul>
              <li><Link to="/tasacion-gratuita-vivienda-madrid">Tasación gratuita</Link></li>
              <li><Link to="/valorar-chalet-madrid">Valorar un chalet</Link></li>
              <li><Link to="/alquiler-o-compra-madrid">¿Alquilar o comprar?</Link></li>
              <li><Link to="/comprar-casa-madrid-extranjeros">Comprar siendo extranjero</Link></li>
            </ul>
          </div>

          {/* COLUMNA 4: ZONAS */}
          <div className="footer__nav">
            <h4>Zonas</h4>
            <ul>
              <li><Link to="/cuanto-vale-una-casa/las-rozas">Las Rozas</Link></li>
              <li><Link to="/cuanto-vale-una-casa/pozuelo-de-alarcon">Pozuelo de Alarcón</Link></li>
              <li><Link to="/cuanto-vale-una-casa/majadahonda">Majadahonda</Link></li>
              <li><Link to="/cuanto-vale-una-casa/chamberi">Chamberí</Link></li>
              <li><Link to="/cuanto-vale-una-casa/salamanca">Salamanca</Link></li>
              <li><Link to="/cuanto-vale-una-casa/el-escorial">El Escorial</Link></li>
            </ul>
          </div>

          {/* COLUMNA 5: CONTACTO */}
          <div className="footer__contact">
            <h4>Contacto</h4>
            <ul>
              <li>
                <Phone size={18} weight="regular" aria-hidden="true" />
                <a href={phoneHref}>{SITE.phone}</a>
              </li>
              <li>
                <EnvelopeSimple size={18} weight="regular" aria-hidden="true" />
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li>
                <MapPin size={18} weight="regular" aria-hidden="true" />
                <span>{SITE.location}</span>
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
            <Link to="/aviso-legal">Aviso legal</Link>
            <span>·</span>
            <Link to="/privacidad">Privacidad</Link>
            <span>·</span>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
