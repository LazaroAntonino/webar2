import { useState, useEffect, createContext } from "react";
import { fetchAllInmuebles } from "../lib/fetchInmuebles.js";
import { getSsgInmuebles } from "../lib/ssgStore.js";

// ================= CONTEXTO GLOBAL =================
const InmueblesContext = createContext(null);

// ================= PROVIDER =================
export const InmueblesProvider = ({ children }) => {
  // SSR: usa el snapshot del ssgStore (módulo, poblado en fn callback de ViteReactSSG)
  // Cliente: usa window.__SSG_INMUEBLES__ inyectado por onPageRendered en vite.config.js como seed
  // (vite-react-ssg 0.9.x NO serializa initialState automáticamente → lo inyectamos manualmente)
  const ssgSeed = typeof window !== "undefined"
    ? (window.__SSG_INMUEBLES__ ?? [])
    : (getSsgInmuebles() ?? []);

  const [inmuebles, setInmuebles] = useState(ssgSeed);
  const [loading, setLoading] = useState(ssgSeed.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    // Si ya tenemos datos SSG, hacer un silent refresh en background sin spinner.
    // Si no hay datos (primer render sin SSG), mostrar loading.
    const hasSeed = ssgSeed.length > 0;

    const loadData = async () => {
      try {
        if (!hasSeed) setLoading(true);
        setError(null);
        const data = await fetchAllInmuebles();
        if (isMounted) {
          setInmuebles(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error cargando inmuebles:", err);
        if (isMounted) {
          // Solo mostrar error si no teníamos datos previos
          if (!hasSeed) setError(err.message || "Error desconocido al cargar los datos");
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllInmuebles();
      setInmuebles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InmueblesContext.Provider value={{ inmuebles, loading, error, refetch }}>
      {children}
    </InmueblesContext.Provider>
  );
};

export { InmueblesContext };
