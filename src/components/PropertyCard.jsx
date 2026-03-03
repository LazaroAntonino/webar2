import React from "react";
import { Link } from "react-router-dom";
import { Bed, Bathtub, Ruler, MapPin, Heart } from "phosphor-react";
import "./PropertyCard.css";

export const PropertyCard = ({ inmueble, variant = "default" }) => {
  const {
    id,
    titulo,
    slug,
    tipo,
    operacion,
    precio,
    precioTipo,
    ubicacion,
    caracteristicas,
    destacado,
    nuevo,
    imagenes,
    descripcionCorta
  } = inmueble;

  // Formatear precio
  const formatPrecio = (precio, tipo) => {
    const formatted = new Intl.NumberFormat('es-ES').format(precio);
    if (tipo === 'mes') {
      return `${formatted} €/mes`;
    }
    return `${formatted} €`;
  };

  // Clase de operación para badge
  const operacionClass = operacion === 'venta' ? 'badge--venta' : 'badge--alquiler';

  return (
    <article className={`property-card ${variant === 'featured' ? 'property-card--featured' : ''}`}>
      {/* IMAGEN */}
      <Link to={`/inmuebles/${id}`} className="property-card__image-link">
        <div 
          className="property-card__image"
          style={{ backgroundImage: `url(${imagenes[0]})` }}
        >
          {/* Badges */}
          <div className="property-card__badges">
            <span className={`badge ${operacionClass}`}>
              {operacion === 'venta' ? 'En venta' : 'En alquiler'}
            </span>
            {nuevo && <span className="badge badge--nuevo">Nuevo</span>}
            {destacado && <span className="badge badge--destacado">Destacado</span>}
          </div>

          {/* Location pill */}
          <span className="property-card__location-pill">
            <MapPin size={14} weight="bold" />
            {ubicacion.barrio}, {ubicacion.ciudad}
          </span>

          {/* Hover overlay */}
          <div className="property-card__overlay">
            <span>Ver detalles</span>
          </div>
        </div>
      </Link>

      {/* CONTENIDO */}
      <div className="property-card__body">
        {/* Tipo de propiedad */}
        <span className="property-card__type">
          {tipo === 'casa' ? 'Casa' : tipo === 'piso' ? 'Piso' : 'Local'}
        </span>

        {/* Título */}
        <Link to={`/inmuebles/${id}`}>
          <h3 className="property-card__title">{titulo}</h3>
        </Link>

        {/* Precio */}
        <p className="property-card__price">
          {formatPrecio(precio, precioTipo)}
        </p>

        {/* Descripción corta (solo en featured) */}
        {variant === 'featured' && descripcionCorta && (
          <p className="property-card__excerpt">{descripcionCorta}</p>
        )}

        {/* Stats */}
        <div className="property-card__stats">
          {caracteristicas.habitaciones > 0 && (
            <span>
              <Bed size={18} weight="regular" />
              {caracteristicas.habitaciones} hab.
            </span>
          )}
          <span>
            <Bathtub size={18} weight="regular" />
            {caracteristicas.banos} {caracteristicas.banos === 1 ? 'baño' : 'baños'}
          </span>
          <span>
            <Ruler size={18} weight="regular" />
            {caracteristicas.metrosConstruidos} m²
          </span>
        </div>

        {/* CTA */}
        <Link to={`/inmuebles/${id}`} className="property-card__cta">
          Ver propiedad
        </Link>
      </div>
    </article>
  );
};
