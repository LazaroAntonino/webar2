import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MainNavbar } from "../components/MainNavbar";
import { Footer } from "../components/Footer";
import { PropertyCard } from "../components/PropertyCard";
import {
  CaretLeft,
  CaretRight,
  MapPin,
  Bed,
  Bathtub,
  Ruler,
  Car,
  Drop,
  ArrowCircleUp,
  Snowflake,
  Sun,
  Calendar,
  Phone,
  EnvelopeSimple,
  Share,
  House,
  Buildings,
  Package,
  ArrowsOut,
  Check,
  NavigationArrow,
  X
} from "phosphor-react";
import { useInmuebles, LoadingSpinner, ErrorMessage } from "../hooks/useInmuebles";
import "./PropertyDetail.css";

export const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  // Refs para el swipe
  const galleryRef = useRef(null);
  const lightboxRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);

  // Obtener inmuebles desde Google Sheets
  const { inmuebles, loading, error, refetch } = useInmuebles();

  // Buscar el inmueble
  const inmueble = useMemo(() => {
    return inmuebles.find(item => item.id === id);
  }, [id, inmuebles]);

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
    window.scrollTo({ top: 0 });
    setCurrentImage(0); // Resetear al cambiar de inmueble
    setShowContactForm(false); // También cerrar el formulario de contacto
    setShowLightbox(false); // Cerrar lightbox si está abierto
  }, [id]);

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

  // Cerrar lightbox con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return;
      if (e.key === 'Escape') {
        setShowLightbox(false);
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox]);

  // Funciones de swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Mouse drag para desktop
  const handleMouseDown = (e) => {
    touchStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Abrir lightbox
  const openLightbox = () => {
    setShowLightbox(true);
  };

  // Cerrar lightbox
  const closeLightbox = () => {
    setShowLightbox(false);
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="property-detail-page">
        <MainNavbar />
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
        <MainNavbar />
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
        <MainNavbar />
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
    descripcionCorta,
    imagenes,
    fechaPublicacion,
    agente
  } = inmueble;

  // Formatear precio
  const formatPrecio = (precio, tipo) => {
    const formatted = new Intl.NumberFormat('es-ES').format(precio);
    if (tipo === 'mes') return `${formatted} €/mes`;
    return `${formatted} €`;
  };

  // Formatear fecha
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Navegación de imágenes
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imagenes.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  // Compartir - copiar URL al portapapeles
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
    
    window.location.href = `mailto:${agente.email}?subject=${subject}&body=${body}`;
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
      <MainNavbar />

      {/* LIGHTBOX / MODAL FULLSCREEN */}
      {showLightbox && (
        <div 
          className="lightbox-overlay"
          onClick={closeLightbox}
        >
          <div 
            className="lightbox-container"
            onClick={(e) => e.stopPropagation()}
            ref={lightboxRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
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
                  <img src={img} alt={`Miniatura ${idx + 1}`} draggable="false" />
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

      {/* GALERÍA */}
      <section className="property-gallery">
        <div 
          className="property-gallery__main"
          ref={galleryRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img 
            src={imagenes[currentImage]} 
            alt={`${titulo} - Imagen ${currentImage + 1}`}
            onClick={openLightbox}
            className="gallery-main-image"
            draggable="false"
          />
          
          {/* Navegación */}
          <button className="gallery-nav gallery-nav--prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            <CaretLeft size={24} weight="bold" />
          </button>
          <button className="gallery-nav gallery-nav--next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <CaretRight size={24} weight="bold" />
          </button>

          {/* Contador */}
          <div className="gallery-counter">
            {currentImage + 1} / {imagenes.length}
          </div>

          {/* Badges */}
          <div className="gallery-badges">
            <span className={`badge ${operacion === 'venta' ? 'badge--venta' : 'badge--alquiler'}`}>
              {operacion === 'venta' ? 'En venta' : 'En alquiler'}
            </span>
            {nuevo && <span className="badge badge--nuevo">Nuevo</span>}
            {destacado && <span className="badge badge--destacado">Destacado</span>}
          </div>

          {/* Acción compartir */}
          <div className="gallery-actions">
            <button 
              className={`gallery-action ${copied ? 'gallery-action--copied' : ''}`} 
              title={copied ? "¡Enlace copiado!" : "Compartir enlace"}
              onClick={(e) => { e.stopPropagation(); handleShare(); }}
            >
              {copied ? <Check size={20} weight="bold" /> : <Share size={20} />}
            </button>
          </div>

          {/* Indicador de expandir */}
          <div className="gallery-expand-hint" onClick={openLightbox}>
            <ArrowsOut size={18} weight="bold" />
            <span>Ver en grande</span>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="property-gallery__thumbs">
          {imagenes.map((img, idx) => (
            <button 
              key={idx}
              className={`thumb ${idx === currentImage ? 'active' : ''}`}
              onClick={() => setCurrentImage(idx)}
            >
              <img src={img} alt={`Miniatura ${idx + 1}`} />
            </button>
          ))}
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className="property-content">
        <div className="container">
          <div className="property-layout">
            {/* COLUMNA PRINCIPAL */}
            <div className="property-main">
              {/* Breadcrumb */}
              <nav className="breadcrumb">
                <Link to="/">Inicio</Link>
                <CaretRight size={14} />
                <Link to="/inmuebles">Inmuebles</Link>
                <CaretRight size={14} />
                <span>{titulo}</span>
              </nav>

              {/* Header */}
              <header className="property-header">
                <div className="property-header__type">
                  {tipo === 'casa' ? <House size={18} /> : tipo === 'piso' ? <Buildings size={18} /> : <Package size={18} />}
                  <span>{tipo === 'casa' ? 'Casa' : tipo === 'piso' ? 'Piso' : 'Local'} en {operacion}</span>
                </div>
                <h1>{titulo}</h1>
                <div className="property-header__location">
                  <MapPin size={18} weight="bold" />
                  <span>{ubicacion.direccion}, {ubicacion.barrio}, {ubicacion.ciudad}</span>
                </div>
              </header>

              {/* Precio móvil */}
              <div className="property-price-mobile">
                <span className="property-price">{formatPrecio(precio, precioTipo)}</span>
              </div>

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
              <div className="property-meta">
                <Calendar size={16} />
                <span>Publicado el {formatFecha(fechaPublicacion)}</span>
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="property-sidebar">
              <div className="contact-card">
                <div className="contact-card__price">
                  <span className="price-label">Precio</span>
                  <span className="price-value">{formatPrecio(precio, precioTipo)}</span>
                </div>

                <div className="contact-card__agent">
                  <div className="agent-avatar">
                    {agente.nombre.charAt(0)}
                  </div>
                  <div className="agent-info">
                    <span className="agent-name">{agente.nombre}</span>
                    <span className="agent-role">Asesor inmobiliario</span>
                  </div>
                </div>

                <div className="contact-card__actions">
                  <a href={`tel:${agente.telefono}`} className="contact-btn contact-btn--primary">
                    <Phone size={18} weight="bold" />
                    <span>Llamar ahora</span>
                  </a>
                  <a href={`mailto:${agente.email}?subject=Consulta: ${titulo}`} className="contact-btn contact-btn--secondary">
                    <EnvelopeSimple size={18} weight="bold" />
                    <span>Enviar email</span>
                  </a>
                </div>

                {showContactForm && (
                  <form className="contact-form" onSubmit={handleContactSubmit}>
                    <input type="text" name="nombre" placeholder="Tu nombre" required />
                    <input type="email" name="email" placeholder="Tu email" required />
                    <input type="tel" name="telefono" placeholder="Tu teléfono (opcional)" />
                    <textarea name="mensaje" placeholder="Me interesa este inmueble..." rows={3} required></textarea>
                    <button type="submit" className="contact-form__submit">
                      Enviar consulta por email
                    </button>
                  </form>
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

      <Footer />
    </div>
  );
};
