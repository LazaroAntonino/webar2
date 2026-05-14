import { useState, useEffect, createContext, useContext } from "react";
import Papa from "papaparse";
import { GOOGLE_SHEETS_CSV_URL, mapRowToInmueble } from "../lib/mapInmueble.js";
import { getSsgInmuebles } from "../lib/ssgStore.js";

// ================= CONTEXTO GLOBAL =================
const InmueblesContext = createContext(null);

// ================= FUNCIÓN DE FETCH =================
const fetchInmueblesFromGoogleSheets = async () => {
  const response = await fetch(GOOGLE_SHEETS_CSV_URL);

  if (!response.ok) {
    throw new Error(`Error al cargar datos: ${response.status} ${response.statusText}`);
  }

  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn("Advertencias al parsear CSV:", results.errors);
        }
        const inmuebles = results.data
          .filter((row) => row.id && String(row.id).trim() !== "")
          .map(mapRowToInmueble)
          .filter((inmueble) => inmueble.mostrarEnWeb === true);
        resolve(inmuebles);
      },
      error: (error) => {
        reject(new Error(`Error al parsear CSV: ${error.message}`));
      },
    });
  });
};

// ================= HOOK useInmuebles =================
export const useInmuebles = () => {
  const context = useContext(InmueblesContext);

  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (context !== null) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchInmueblesFromGoogleSheets();
        if (isMounted) {
          setInmuebles(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error cargando inmuebles:", err);
        if (isMounted) {
          setError(err.message || "Error desconocido al cargar los datos");
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  if (context !== null) {
    return context;
  }

  return { inmuebles, loading, error };
};

// ================= PROVIDER =================
export const InmueblesProvider = ({ children }) => {
  // SSR: usa el snapshot del ssgStore (módulo, poblado en fn callback de ViteReactSSG)
  // Cliente: usa window.__INITIAL_STATE__ inyectado por vite-react-ssg como seed
  const ssgSeed = typeof window !== "undefined"
    ? (window.__INITIAL_STATE__?.inmuebles ?? [])
    : (getSsgInmuebles() ?? []);

  const [inmuebles, setInmuebles] = useState(ssgSeed);
  const [loading, setLoading] = useState(ssgSeed.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchInmueblesFromGoogleSheets();
        if (isMounted) {
          setInmuebles(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error cargando inmuebles:", err);
        if (isMounted) {
          setError(err.message || "Error desconocido al cargar los datos");
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInmueblesFromGoogleSheets();
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

// ================= COMPONENTE DE LOADING =================
export const LoadingSpinner = () => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: "16px"
  }}>
    <div style={{
      width: "48px",
      height: "48px",
      border: "4px solid rgba(28, 46, 81, 0.1)",
      borderTopColor: "#1c2e51",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    }} />
    <p style={{
      fontSize: "16px",
      color: "#666",
      margin: 0
    }}>
      Cargando inmuebles...
    </p>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// ================= COMPONENTE DE ERROR =================
export const ErrorMessage = ({ message, onRetry }) => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: "16px",
    textAlign: "center"
  }}>
    <span style={{ fontSize: "48px" }}>⚠️</span>
    <h3 style={{
      fontSize: "20px",
      color: "#1c2e51",
      margin: 0
    }}>
      Error al cargar los datos
    </h3>
    <p style={{
      fontSize: "15px",
      color: "#666",
      margin: 0,
      maxWidth: "400px"
    }}>
      {message}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          padding: "12px 24px",
          background: "#1c2e51",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
          marginTop: "8px"
        }}
      >
        Reintentar
      </button>
    )}
  </div>
);

export default useInmuebles;
