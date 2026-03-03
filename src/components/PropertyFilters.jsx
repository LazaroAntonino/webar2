import React, { useState, useEffect } from "react";
import { MagnifyingGlass, SlidersHorizontal, X, CaretDown, House, Buildings, Storefront } from "phosphor-react";
import "./PropertyFilters.css";

const ciudadesDisponibles = [
  "Todas",
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Málaga",
  "Jaén"
];

const rangosPrecios = {
  venta: [
    { label: "Cualquier precio", min: 0, max: Infinity },
    { label: "Hasta 300.000 €", min: 0, max: 300000 },
    { label: "300.000 € - 500.000 €", min: 300000, max: 500000 },
    { label: "500.000 € - 800.000 €", min: 500000, max: 800000 },
    { label: "800.000 € - 1.000.000 €", min: 800000, max: 1000000 },
    { label: "Más de 1.000.000 €", min: 1000000, max: Infinity },
  ],
  alquiler: [
    { label: "Cualquier precio", min: 0, max: Infinity },
    { label: "Hasta 1.000 €/mes", min: 0, max: 1000 },
    { label: "1.000 € - 2.000 €/mes", min: 1000, max: 2000 },
    { label: "2.000 € - 3.500 €/mes", min: 2000, max: 3500 },
    { label: "Más de 3.500 €/mes", min: 3500, max: Infinity },
  ]
};

export const PropertyFilters = ({ onFilter, totalResultados, filtrosActivos }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [operacion, setOperacion] = useState("todas");
  const [tipo, setTipo] = useState("todos");
  const [ciudad, setCiudad] = useState("Todas");
  const [rangoPrecio, setRangoPrecio] = useState(0);
  const [habitaciones, setHabitaciones] = useState("todas");
  
  // Aplicar filtros
  const aplicarFiltros = () => {
    const rangoActual = operacion === 'alquiler' 
      ? rangosPrecios.alquiler[rangoPrecio] 
      : rangosPrecios.venta[rangoPrecio];
    
    onFilter({
      busqueda,
      operacion,
      tipo,
      ciudad,
      precioMin: rangoActual?.min || 0,
      precioMax: rangoActual?.max || Infinity,
      habitaciones
    });
  };

  // Aplicar filtros cuando cambian
  useEffect(() => {
    aplicarFiltros();
  }, [busqueda, operacion, tipo, ciudad, rangoPrecio, habitaciones]);

  // Reset filtros
  const resetFiltros = () => {
    setBusqueda("");
    setOperacion("todas");
    setTipo("todos");
    setCiudad("Todas");
    setRangoPrecio(0);
    setHabitaciones("todas");
  };

  const tienesFiltrosActivos = operacion !== "todas" || tipo !== "todos" || ciudad !== "Todas" || rangoPrecio !== 0 || habitaciones !== "todas" || busqueda !== "";

  return (
    <div className="property-filters">
      {/* BARRA PRINCIPAL */}
      <div className="filters-bar">
        {/* Búsqueda */}
        <div className="search-input">
          <MagnifyingGlass size={20} weight="bold" />
          <input
            type="text"
            placeholder="Buscar por ubicación, título..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button className="search-clear" onClick={() => setBusqueda("")}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Operación - Desktop */}
        <div className="filter-tabs filter-tabs--desktop">
          <button 
            className={`filter-tab ${operacion === 'todas' ? 'active' : ''}`}
            onClick={() => setOperacion('todas')}
          >
            Todas
          </button>
          <button 
            className={`filter-tab ${operacion === 'venta' ? 'active' : ''}`}
            onClick={() => setOperacion('venta')}
          >
            Comprar
          </button>
          <button 
            className={`filter-tab ${operacion === 'alquiler' ? 'active' : ''}`}
            onClick={() => setOperacion('alquiler')}
          >
            Alquilar
          </button>
        </div>

        {/* Botón filtros avanzados */}
        <button 
          className={`filters-toggle ${filtersOpen ? 'active' : ''}`}
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <SlidersHorizontal size={20} weight="bold" />
          <span>Filtros</span>
          {tienesFiltrosActivos && <span className="filter-badge">●</span>}
        </button>
      </div>

      {/* FILTROS EXPANDIBLES */}
      <div className={`filters-expanded ${filtersOpen ? 'is-open' : ''}`}>
        <div className="filters-grid">
          {/* Operación - Móvil */}
          <div className="filter-group filter-group--mobile-only">
            <label>Operación</label>
            <div className="filter-options">
              <button 
                className={`filter-option ${operacion === 'todas' ? 'active' : ''}`}
                onClick={() => setOperacion('todas')}
              >
                Todas
              </button>
              <button 
                className={`filter-option ${operacion === 'venta' ? 'active' : ''}`}
                onClick={() => setOperacion('venta')}
              >
                Comprar
              </button>
              <button 
                className={`filter-option ${operacion === 'alquiler' ? 'active' : ''}`}
                onClick={() => setOperacion('alquiler')}
              >
                Alquilar
              </button>
            </div>
          </div>

          {/* Tipo de inmueble */}
          <div className="filter-group">
            <label>Tipo de inmueble</label>
            <div className="filter-options filter-options--icons">
              <button 
                className={`filter-option ${tipo === 'todos' ? 'active' : ''}`}
                onClick={() => setTipo('todos')}
              >
                Todos
              </button>
              <button 
                className={`filter-option ${tipo === 'piso' ? 'active' : ''}`}
                onClick={() => setTipo('piso')}
              >
                <Buildings size={18} />
                Pisos
              </button>
              <button 
                className={`filter-option ${tipo === 'casa' ? 'active' : ''}`}
                onClick={() => setTipo('casa')}
              >
                <House size={18} />
                Casas
              </button>
              <button 
                className={`filter-option ${tipo === 'local' ? 'active' : ''}`}
                onClick={() => setTipo('local')}
              >
                <Storefront size={18} />
                Locales
              </button>
            </div>
          </div>

          {/* Ciudad */}
          <div className="filter-group">
            <label>Ciudad</label>
            <div className="filter-select-wrapper">
              <select 
                value={ciudad} 
                onChange={(e) => setCiudad(e.target.value)}
                className="filter-select"
              >
                {ciudadesDisponibles.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <CaretDown size={16} className="select-icon" />
            </div>
          </div>

          {/* Precio */}
          <div className="filter-group">
            <label>Precio</label>
            <div className="filter-select-wrapper">
              <select 
                value={rangoPrecio} 
                onChange={(e) => setRangoPrecio(Number(e.target.value))}
                className="filter-select"
              >
                {(operacion === 'alquiler' ? rangosPrecios.alquiler : rangosPrecios.venta).map((rango, idx) => (
                  <option key={idx} value={idx}>{rango.label}</option>
                ))}
              </select>
              <CaretDown size={16} className="select-icon" />
            </div>
          </div>

          {/* Habitaciones */}
          <div className="filter-group">
            <label>Habitaciones</label>
            <div className="filter-options filter-options--compact">
              <button 
                className={`filter-option ${habitaciones === 'todas' ? 'active' : ''}`}
                onClick={() => setHabitaciones('todas')}
              >
                Todas
              </button>
              <button 
                className={`filter-option ${habitaciones === '1' ? 'active' : ''}`}
                onClick={() => setHabitaciones('1')}
              >
                1+
              </button>
              <button 
                className={`filter-option ${habitaciones === '2' ? 'active' : ''}`}
                onClick={() => setHabitaciones('2')}
              >
                2+
              </button>
              <button 
                className={`filter-option ${habitaciones === '3' ? 'active' : ''}`}
                onClick={() => setHabitaciones('3')}
              >
                3+
              </button>
              <button 
                className={`filter-option ${habitaciones === '4' ? 'active' : ''}`}
                onClick={() => setHabitaciones('4')}
              >
                4+
              </button>
            </div>
          </div>
        </div>

        {/* Footer filtros */}
        <div className="filters-footer">
          <span className="results-count">
            {totalResultados} {totalResultados === 1 ? 'inmueble encontrado' : 'inmuebles encontrados'}
          </span>
          {tienesFiltrosActivos && (
            <button className="filters-reset" onClick={resetFiltros}>
              <X size={16} />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
