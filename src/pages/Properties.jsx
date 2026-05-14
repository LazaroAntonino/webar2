import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MainNavbar } from "../components/MainNavbar";
import { Footer } from "../components/Footer";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyFilters } from "../components/PropertyFilters";
import { House, Buildings, TrendUp, CaretRight } from "phosphor-react";
import { useInmuebles, LoadingSpinner, ErrorMessage } from "../hooks/useInmuebles";
import SEO from "../components/SEO";
import "./Properties.css";

export const Properties = () => {
  const [searchParams] = useSearchParams();
  const [filtros, setFiltros] = useState({
    busqueda: "",
    operacion: searchParams.get("operacion") || "todas",
    tipo: "todos",
    ciudad: "Todas",
    precioMin: 0,
    precioMax: Infinity,
    habitaciones: "todas"
  });

  // Sincronizar operación cuando cambia la URL (sin remount del componente)
  useEffect(() => {
    const op = searchParams.get("operacion") || "todas";
    setFiltros(prev => ({
      ...prev,
      operacion: op,
      precioMin: 0,
      precioMax: Infinity
    }));
  }, [searchParams]);

  // Obtener inmuebles desde Google Sheets
  const { inmuebles, loading, error, refetch } = useInmuebles();

  // Filtrar inmuebles
  const inmueblesFiltrados = useMemo(() => {
    return inmuebles.filter(inmueble => {
      // Búsqueda por texto
      if (filtros.busqueda) {
        const searchLower = filtros.busqueda.toLowerCase();
        const matchesBusqueda = 
          inmueble.titulo.toLowerCase().includes(searchLower) ||
          inmueble.ubicacion.ciudad.toLowerCase().includes(searchLower) ||
          inmueble.ubicacion.barrio.toLowerCase().includes(searchLower) ||
          inmueble.descripcionCorta?.toLowerCase().includes(searchLower);
        if (!matchesBusqueda) return false;
      }

      // Operación
      if (filtros.operacion !== "todas" && inmueble.operacion !== filtros.operacion) {
        return false;
      }

      // Tipo
      if (filtros.tipo !== "todos" && inmueble.tipo !== filtros.tipo) {
        return false;
      }

      // Ciudad
      if (filtros.ciudad !== "Todas" && inmueble.ubicacion.ciudad !== filtros.ciudad) {
        return false;
      }

      // Precio
      if (inmueble.precio < filtros.precioMin || inmueble.precio > filtros.precioMax) {
        return false;
      }

      // Habitaciones
      if (filtros.habitaciones !== "todas") {
        const minHab = parseInt(filtros.habitaciones);
        if (inmueble.caracteristicas.habitaciones < minHab) {
          return false;
        }
      }

      return true;
    });
  }, [filtros, inmuebles]);

  // Ciudades disponibles — derivadas dinámicamente de los datos reales
  const ciudades = useMemo(() => {
    const set = new Set(inmuebles.map(i => i.ubicacion.ciudad).filter(Boolean));
    return ["Todas", ...Array.from(set).sort((a, b) => a.localeCompare(b, "es"))];
  }, [inmuebles]);

  // Estadísticas rápidas
  const stats = useMemo(() => {
    const ventas = inmuebles.filter(i => i.operacion === 'venta').length;
    const alquileres = inmuebles.filter(i => i.operacion === 'alquiler').length;
    const pisos = inmuebles.filter(i => i.tipo === 'piso').length;
    const casas = inmuebles.filter(i => i.tipo === 'casa').length;
    return { ventas, alquileres, pisos, casas, total: inmuebles.length };
  }, [inmuebles]);

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const seoTitle = filtros.operacion === 'venta'
    ? 'Inmuebles en venta | AR2 Consulting'
    : filtros.operacion === 'alquiler'
    ? 'Inmuebles en alquiler | AR2 Consulting'
    : 'Inmuebles en venta y alquiler en España | AR2';

  const seoDesc = `Descubre inmuebles ${filtros.operacion === 'todas' ? 'en venta y alquiler' : filtros.operacion} en Madrid, Barcelona, Valencia, Sevilla, Málaga y Jaén. AR2 Consulting Inmobiliario.`;

  const itemListLd = inmueblesFiltrados.slice(0, 20).map((p, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "url": `https://ar2house.com/inmuebles/${p.id}`,
    "name": p.titulo,
    ...(p.imagenes?.[0] ? { "image": p.imagenes[0] } : {}),
  }));

  return (
    <div className="properties-page">
      <SEO
        title={seoTitle}
        description={seoDesc}
        url="https://ar2house.com/inmuebles"
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ar2house.com/" },
                { "@type": "ListItem", "position": 2, "name": "Inmuebles", "item": "https://ar2house.com/inmuebles" }
              ]
            },
            {
              "@type": "ItemList",
              "name": seoTitle,
              "itemListElement": itemListLd
            }
          ]
        }}
      />
      <MainNavbar onHomeClick={() => {}} />

      {/* HERO COMPACTO */}
      <section className="properties-hero">
        <div className="properties-hero__overlay"></div>
        <div className="properties-hero__content container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <CaretRight size={14} />
            <span>Inmuebles</span>
          </nav>

          <h1>Encuentra tu propiedad ideal</h1>
          <p>
            Explora nuestra selección de inmuebles en las mejores ubicaciones de España
            {!loading && stats.total > 0 && ` — ${stats.total} disponibles`}
          </p>

          {/* Stats rápidos */}
          {!loading && (
          <div className="properties-hero__stats">
            <div className="stat-item">
              <TrendUp size={20} weight="bold" />
              <span><strong>{stats.ventas}</strong> en venta</span>
            </div>
            <div className="stat-item">
              <Buildings size={20} weight="bold" />
              <span><strong>{stats.alquileres}</strong> en alquiler</span>
            </div>
            <div className="stat-item">
              <House size={20} weight="bold" />
              <span><strong>{stats.casas + stats.pisos}</strong> viviendas</span>
            </div>
          </div>
          )}
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className="properties-content">
        <div className="container">
          {/* FILTROS */}
          <PropertyFilters 
            onFilter={setFiltros}
            totalResultados={inmueblesFiltrados.length}
            initialOperacion={searchParams.get("operacion") || "todas"}
            ciudadesDisponibles={ciudades}
          />

          {/* ESTADOS: Loading / Error / Resultados */}
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} onRetry={refetch} />
          ) : inmueblesFiltrados.length > 0 ? (
            <div className="properties-grid">
              {inmueblesFiltrados.map(inmueble => (
                <PropertyCard key={inmueble.id} inmueble={inmueble} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results__icon">🏠</div>
              <h3>No encontramos inmuebles</h3>
              <p>Prueba a modificar los filtros para ver más resultados</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="properties-cta">
        <div className="container">
          <div className="properties-cta__card">
            <div className="properties-cta__content">
              <h2>¿No encuentras lo que buscas?</h2>
              <p>
                Cuéntanos qué estás buscando y te ayudaremos a encontrar la propiedad perfecta para ti.
              </p>
            </div>
            <Link to="/" className="properties-cta__btn">
              Solicitar búsqueda personalizada
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
