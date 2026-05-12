import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { MainNavbar } from "../components/MainNavbar";
import { Footer } from "../components/Footer";
import { PropertyCard } from "../components/PropertyCard";
import {
  CaretLeft,
  CaretRight,
  MapPin,
  Phone,
  Bed,
  Bathtub,
  Ruler,
  Car,
  Drop,
  ArrowCircleUp,
  Snowflake,
  Sun,
  Calendar,
  EnvelopeSimple,
  Buildings,
  Package,
  ArrowsOut,
  NavigationArrow,
  X
} from "phosphor-react";
import { useInmuebles, LoadingSpinner, ErrorMessage } from "../hooks/useInmuebles";
import "./PropertyDetail.css";

export const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showBottomBar, setShowBottomBar] = useState(false);

  // Refs
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  // Refs estables para las funciones de navegación (evita stale closure en useEffect)
  const nextImageRef = useRef(null);
  const prevImageRef = useRef(null);

  // Obtener inmuebles desde Google Sheets
  const { inmuebles, loading, error, refetch } = useInmuebles();

  // Buscar el inmueble
  const inmueble = useMemo(() => {
    return inmuebles.find(item => item.id === id);
  }, [id, inmuebles]);

  // Imágenes del inmueble actual (array vacío si no existe aún)
  const imagenes = inmueble?.imagenes ?? [];
  const imageCount = imagenes.length;

  // Navegación de imágenes — definidas aquí para que los useEffects/handlers puedan usarlas
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % (imageCount || 1));
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + (imageCount || 1)) % (imageCount || 1));

  // Mantener refs siempre actualizadas (evita stale closures)
  nextImageRef.current = nextImage;
  prevImageRef.current = prevImage;

  // Inmuebles relacionados (misma ciudad o tipo)
  const relacionados = useMemo(() => {
    if (!inmueble) return [];
    return inmuebles
      .filter(item => 
        item.id !== id && 
        (item.ubicacion.ciudad === inmueble.ubicacion.ciudad || item.tipo === inmueble.tipo)
      )
      .slice(0, 3);
  }, [inmueble, id, inmuebles]);

  // Reset imagen y scroll cuando cambia el inmueble
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentImage(0); // Resetear al cambiar de inmueble
    setShowContactForm(false); // También cerrar el formulario de contacto
    setShowLightbox(false); // Cerrar lightbox si está abierto
    setFormSent(false); // Resetear estado de formulario enviado
    setShowBottomBar(false); // Resetear barra inferior
  }, [id]);

  // Reset scroll del carrusel al cambiar de inmueble
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'instant' });
    }
    setCurrentSlide(0);
  }, [id]);

  // IntersectionObserver para trackear qué slide está visible
  useEffect(() => {
    if (!carouselRef.current) return;
    const slides = carouselRef.current.querySelectorAll('.gallery-slide');
    if (!slides.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = Number(entry.target.dataset.index);
            if (!Number.isNaN(idx)) setCurrentSlide(idx);
          }
        });
      },
      { root: carouselRef.current, threshold: [0.6, 0.9] }
    );

    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [inmueble?.id]);

  // IntersectionObserver para mostrar la bottom-bar cuando property-intro sale del viewport
  useEffect(() => {
    const intro = document.querySelector('.property-intro');
    if (!intro) return;

    // Resetear la barra al volver a montar
    setShowBottomBar(false);

    const observer = new IntersectionObserver(
      ([entry]) => setShowBottomBar(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );

    observer.observe(intro);
    return () => observer.disconnect();
  }, [inmueble?.id]);

  // Bloquear scroll del body cuando el lightbox está abierto
  useEffect(() => {
    if (showLightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showLightbox]);

  // Cerrar lightbox con tecla Escape — usa refs para evitar stale closure
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return;
      if (e.key === 'Escape') {
        setShowLightbox(false);
      } else if (e.key === 'ArrowRight') {
        nextImageRef.current?.();
      } else if (e.key === 'ArrowLeft') {
        prevImageRef.current?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox]);

  // Funciones de swipe (solo touch — para el lightbox en móvil)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) nextImage();
      else prevImage();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const closeLightbox = () => setShowLightbox(false);

  // Estado de carga
  if (loading) {
    return (
      <div className="property-detail-page">
        <MainNavbar alwaysSolid />
        <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '60vh' }}>
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="property-detail-page">
        <MainNavbar alwaysSolid />
        <div style={{ paddingTop: 'var(--navbar-height)', minHeight: '60vh' }}>
          <ErrorMessage message={error} onRetry={refetch} />
        </div>
        <Footer />
      </div>
    );
  }

  // Si no existe el inmueble
  if (!inmueble) {
    return (
      <div className="property-detail-page">
        <MainNavbar alwaysSolid />
        <div className="not-found">
          <div className="not-found__content">
            <span className="not-found__icon">🏠</span>
            <h1>Inmueble no encontrado</h1>
            <p>Lo sentimos, este inmueble ya no está disponible o no existe.</p>
            <Link to="/inmuebles" className="not-found__btn">
              Ver todos los inmuebles
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    titulo,
    tipo,
    operacion,
    precio,
    precioTipo,
    ubicacion,
    caracteristicas,
    destacado,
    nuevo,
    descripcion,
    fechaPublicacion,
    agente
  } = inmueble;

  // Formatear precio
  const formatPrecio = (precio, tipo) => {
    const formatted = new Intl.NumberFormat('es-ES').format(precio);
    if (tipo === 'mes') return `${formatted} €/mes`;
    return `${formatted} €`;
  };

  // Formatear fecha — guard para strings vacíos o fechas inválidas
  const formatFecha = (fecha) => {
    if (!fecha) return null;
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Abrir ubicación en Google Maps
  const openInMaps = () => {
    const query = encodeURIComponent(`${ubicacion.direccion}, ${ubicacion.ciudad}, España`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // Manejar envío del formulario de contacto
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const telefono = formData.get('telefono');
    const mensaje = formData.get('mensaje');
    
    const subject = encodeURIComponent(`Consulta sobre: ${titulo}`);
    const body = encodeURIComponent(
      `Hola,\n\nMe interesa el inmueble: ${titulo}\n\n` +
      `Mis datos de contacto:\n` +
      `- Nombre: ${nombre}\n` +
      `- Email: ${email}\n` +
      `- Teléfono: ${telefono || 'No proporcionado'}\n\n` +
      `Mensaje:\n${mensaje}\n\n` +
      `Enlace al inmueble: ${window.location.href}`
    );
    
    const recipientEmail = agente.email || 'info@ar2house.com';
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    setFormSent(true);
  };

  // Características para mostrar
  const caracteristicasLista = [
    { icon: Bed, label: "Habitaciones", value: caracteristicas.habitaciones, show: caracteristicas.habitaciones > 0 },
    { icon: Bathtub, label: "Baños", value: caracteristicas.banos, show: true },
    { icon: Ruler, label: "Superficie", value: `${caracteristicas.metrosConstruidos} m²`, show: true },
    { icon: ArrowsOut, label: "M² útiles", value: `${caracteristicas.metrosUtiles} m²`, show: true },
    { icon: Buildings, label: "Planta", value: caracteristicas.planta === 0 ? "Bajo" : `${caracteristicas.planta}ª`, show: tipo !== 'casa' },
    { icon: Sun, label: "Orientación", value: caracteristicas.orientacion?.charAt(0).toUpperCase() + caracteristicas.orientacion?.slice(1), show: !!caracteristicas.orientacion },
    { icon: Car, label: "Garaje", value: `${caracteristicas.plazasGaraje} plaza${caracteristicas.plazasGaraje > 1 ? 's' : ''}`, show: caracteristicas.garaje },
    { icon: Drop, label: "Piscina", value: "Sí", show: caracteristicas.piscina },
    { icon: ArrowCircleUp, label: "Ascensor", value: "Sí", show: caracteristicas.ascensor },
    { icon: Snowflake, label: "Aire acondicionado", value: "Sí", show: caracteristicas.aireAcondicionado },
    { icon: Package, label: "Trastero", value: "Sí", show: caracteristicas.trastero },
    { icon: Calendar, label: "Año construcción", value: caracteristicas.antiguedad, show: !!caracteristicas.antiguedad },
  ].filter(item => item.show);

  return (
    <div className="property-detail-page">
      <MainNavbar alwaysSolid />

      {/* LIGHTBOX / MODAL FULLSCREEN */}
      {showLightbox && (
        <div 
          className="lightbox-overlay"
          onClick={closeLightbox}
        >
          <div 
            className="lightbox-container"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Botón cerrar */}
            <button className="lightbox-close" onClick={closeLightbox}>
              <X size={28} weight="bold" />
            </button>

            {/* Contador */}
            <div className="lightbox-counter">
              {currentImage + 1} / {imagenes.length}
            </div>

            {/* Imagen principal */}
            <div className="lightbox-image-wrapper">
              <img 
                src={imagenes[currentImage]} 
                alt={`${titulo} - Imagen ${currentImage + 1}`}
                draggable="false"
              />
            </div>

            {/* Navegación */}
            <button 
              className="lightbox-nav lightbox-nav--prev" 
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <CaretLeft size={32} weight="bold" />
            </button>
            <button 
              className="lightbox-nav lightbox-nav--next" 
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <CaretRight size={32} weight="bold" />
            </button>

            {/* Thumbnails en lightbox */}
            <div className="lightbox-thumbs">
              {imagenes.map((img, idx) => (
                <button 
                  key={idx}
                  className={`lightbox-thumb ${idx === currentImage ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setCurrentImage(idx); }}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} draggable="false" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>

            {/* Indicador de swipe en móvil */}
            <div className="lightbox-swipe-hint">
              <span>Desliza para navegar</span>
            </div>
          </div>
        </div>
      )}

      {/* INTRO EDITORIAL */}
      <section className="property-intro">
        <div className="container">
          <nav className="breadcrumb breadcrumb--intro" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link>
            <CaretRight size={12} />
            <Link to="/inmuebles">Inmuebles</Link>
            <CaretRight size={12} />
            <span>{titulo}</span>
          </nav>

          <p className="property-eyebrow">
            <span className="property-eyebrow__line" aria-hidden="true" />
            <span className="property-eyebrow__text">
              {tipo === 'casa' ? 'Casa' : tipo === 'piso' ? 'Piso' : 'Local'} en {operacion}
            </span>
            <span className="property-eyebrow__line property-eyebrow__line--right" aria-hidden="true" />
          </p>

          <h1 className="property-headline">{titulo}</h1>

          <p className="property-sublocation">
            <MapPin size={14} weight="duotone" />
            <span>{ubicacion.barrio} · {ubicacion.ciudad}</span>
          </p>

          <div className="property-price-hero">
            <span className="property-price-hero__amount">
              {formatPrecio(precio, precioTipo)}
            </span>
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      {imagenes.length > 0 && (
      <section className="property-gallery">
        <div
          className="property-gallery__carousel"
          ref={carouselRef}
          aria-label="Galería de fotografías"
        >
          {imagenes.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className="gallery-slide"
              data-index={idx}
              onClick={() => { setCurrentImage(idx); setShowLightbox(true); }}
              aria-label={`Abrir fotografía ${idx + 1} de ${imagenes.length} a pantalla completa`}
            >
              <img
                src={img}
                alt={`${titulo} - Fotografía ${idx + 1}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding={idx === 0 ? 'sync' : 'async'}
                draggable="false"
              />
              {idx === 0 && (
                <div className="gallery-badges">
                  <span className={`badge ${operacion === 'venta' ? 'badge--venta' : 'badge--alquiler'}`}>
                    {operacion === 'venta' ? 'En venta' : 'En alquiler'}
                  </span>
                  {nuevo && <span className="badge badge--nuevo">Nuevo</span>}
                  {destacado && <span className="badge badge--destacado">Destacado</span>}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Counter — siempre visible */}
        <div className="gallery-counter" aria-live="polite">
          <span className="gallery-counter__current">{currentSlide + 1}</span>
          <span className="gallery-counter__sep">/</span>
          <span className="gallery-counter__total">{imagenes.length}</span>
        </div>

        {/* Dots — solo si N ≤ 7 */}
        {imagenes.length <= 7 && (
          <div className="gallery-dots" role="tablist" aria-label="Indicadores de fotografía">
            {imagenes.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === currentSlide}
                aria-label={`Ir a la fotografía ${idx + 1}`}
                className={`gallery-dot ${idx === currentSlide ? 'is-active' : ''}`}
                onClick={() => {
                  if (!carouselRef.current) return;
                  const slideWidth = carouselRef.current.offsetWidth;
                  carouselRef.current.scrollTo({ left: idx * slideWidth, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        )}

        {/* Botón "Ver galería" — solo escritorio */}
        <button className="gallery-view-all" onClick={() => setShowLightbox(true)}>
          <ArrowsOut size={16} weight="bold" />
          <span>Ver galería completa</span>
        </button>
      </section>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <section className="property-content">
        <div className="container">
          <div className="property-layout">
            {/* COLUMNA PRINCIPAL */}
            <div className="property-main">
              {/* Stats rápidos */}
              <div className="property-quick-stats">
                {caracteristicas.habitaciones > 0 && (
                  <div className="quick-stat">
                    <Bed size={22} />
                    <div>
                      <span className="quick-stat__value">{caracteristicas.habitaciones}</span>
                      <span className="quick-stat__label">Habitaciones</span>
                    </div>
                  </div>
                )}
                <div className="quick-stat">
                  <Bathtub size={22} />
                  <div>
                    <span className="quick-stat__value">{caracteristicas.banos}</span>
                    <span className="quick-stat__label">Baños</span>
                  </div>
                </div>
                <div className="quick-stat">
                  <Ruler size={22} />
                  <div>
                    <span className="quick-stat__value">{caracteristicas.metrosConstruidos}</span>
                    <span className="quick-stat__label">m² construidos</span>
                  </div>
                </div>
                {caracteristicas.terraza && (
                  <div className="quick-stat">
                    <Sun size={22} />
                    <div>
                      <span className="quick-stat__value">{caracteristicas.metrosTerraza}</span>
                      <span className="quick-stat__label">m² terraza</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div className="property-section">
                <h2>Descripción</h2>
                <p className="property-description">{descripcion}</p>
              </div>

              {/* Características */}
              <div className="property-section">
                <h2>Características</h2>
                <div className="property-features">
                  {caracteristicasLista.map((item, idx) => (
                    <div className="feature-item" key={idx}>
                      <item.icon size={20} />
                      <div>
                        <span className="feature-label">{item.label}</span>
                        <span className="feature-value">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ubicación */}
              <div className="property-section">
                <h2>Ubicación</h2>
                <div className="property-location-details">
                  <div className="location-item">
                    <span className="location-label">Dirección</span>
                    <span className="location-value">{ubicacion.direccion}</span>
                  </div>
                  <div className="location-item">
                    <span className="location-label">Barrio</span>
                    <span className="location-value">{ubicacion.barrio}</span>
                  </div>
                  <div className="location-item">
                    <span className="location-label">Ciudad</span>
                    <span className="location-value">{ubicacion.ciudad}</span>
                  </div>
                  <div className="location-item">
                    <span className="location-label">Código postal</span>
                    <span className="location-value">{ubicacion.cp}</span>
                  </div>
                </div>
                {/* Botón para abrir en Google Maps */}
                <button className="property-map-btn" onClick={openInMaps}>
                  <NavigationArrow size={22} weight="bold" />
                  <span>Ver ubicación en Google Maps</span>
                </button>
              </div>

              {/* Fecha publicación */}
              {formatFecha(fechaPublicacion) && (
                <div className="property-meta">
                  <Calendar size={16} />
                  <span>Publicado el {formatFecha(fechaPublicacion)}</span>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className="property-sidebar">
              <div className="contact-card">
                <div className="contact-card__price">
                  <span className="price-label">Precio</span>
                  <span className="price-value">{formatPrecio(precio, precioTipo)}</span>
                </div>

                <div className="contact-card__agent">
                  {agente.foto ? (
                    <img
                      src={agente.foto}
                      alt={agente.nombre}
                      className="agent-photo"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="agent-photo agent-photo--initial"
                    style={{ display: agente.foto ? 'none' : 'flex' }}
                    aria-hidden={!!agente.foto}
                  >
                    {agente.nombre ? agente.nombre.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="agent-info">
                    <span className="agent-eyebrow">Asesor asignado</span>
                    <span className="agent-name">{agente.nombre}</span>
                    <span className="agent-meta">{agente.idiomas || 'ES · EN'}</span>
                  </div>
                </div>

                <div className="contact-card__actions">
                  {agente.telefono ? (
                    <a href={`tel:${agente.telefono}`} className="contact-btn contact-btn--primary">
                      <Phone size={18} weight="bold" />
                      <span>Agendar visita privada</span>
                    </a>
                  ) : (
                    <a href="tel:+34640081599" className="contact-btn contact-btn--primary">
                      <Phone size={18} weight="bold" />
                      <span>Agendar visita privada</span>
                    </a>
                  )}
                  {agente.email ? (
                    <a href={`mailto:${agente.email}?subject=Solicitud de dossier: ${titulo}`} className="contact-btn contact-btn--secondary">
                      <EnvelopeSimple size={18} weight="bold" />
                      <span>Solicitar dossier completo</span>
                    </a>
                  ) : (
                    <a href="mailto:info@ar2.es?subject=Solicitud de dossier" className="contact-btn contact-btn--secondary">
                      <EnvelopeSimple size={18} weight="bold" />
                      <span>Solicitar dossier completo</span>
                    </a>
                  )}
                  <button
                    className="contact-btn contact-btn--outline"
                    onClick={() => setShowContactForm(v => !v)}
                  >
                    {showContactForm ? 'Cerrar formulario' : 'Enviar mensaje directo'}
                  </button>
                </div>

                {showContactForm && (
                  formSent ? (
                    <div className="contact-form-success">
                      <span className="contact-form-success__icon">✓</span>
                      <p className="contact-form-success__msg">
                        Se ha abierto tu cliente de correo. Si no se abrió, escríbenos a{' '}
                        <a href={`mailto:${agente.email || 'info@ar2house.com'}`}>{agente.email || 'info@ar2house.com'}</a>
                      </p>
                      <button
                        className="contact-form-success__reset"
                        onClick={() => setFormSent(false)}
                      >
                        Enviar otro mensaje
                      </button>
                    </div>
                  ) : (
                    <form className="contact-form" onSubmit={handleContactSubmit}>
                      <input type="text" name="nombre" placeholder="Tu nombre" required />
                      <input type="email" name="email" placeholder="Tu email" required />
                      <input type="tel" name="telefono" placeholder="Tu teléfono (opcional)" />
                      <textarea name="mensaje" placeholder="Me interesa este inmueble..." rows={3} required></textarea>
                      <button type="submit" className="contact-form__submit">
                        Enviar consulta por email
                      </button>
                    </form>
                  )
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* RELACIONADOS */}
      {relacionados.length > 0 && (
        <section className="property-related">
          <div className="container">
            <div className="section-header">
              <h2>Inmuebles similares</h2>
              <Link to="/inmuebles" className="see-all">
                Ver todos
                <CaretRight size={16} />
              </Link>
            </div>
            <div className="related-grid">
              {relacionados.map(item => (
                <PropertyCard key={item.id} inmueble={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {!showLightbox && (
        <div
          className={`property-bottom-bar ${showBottomBar ? 'is-visible' : ''}`}
          role="region"
          aria-label="Precio y contacto"
        >
          <div className="property-bottom-bar__price">
            <span className="property-bottom-bar__label">Desde</span>
            <span className="property-bottom-bar__value">
              {formatPrecio(precio, precioTipo)}
            </span>
          </div>
          <a
            href={agente.telefono ? `tel:${agente.telefono}` : 'tel:+34640081599'}
            className="property-bottom-bar__cta"
            aria-label="Llamar al asesor para agendar visita"
          >
            <Phone size={16} weight="bold" />
            <span>Agendar visita</span>
          </a>
        </div>
      )}

      <Footer />
    </div>
  );
};
