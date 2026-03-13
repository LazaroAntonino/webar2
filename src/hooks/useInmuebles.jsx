import { useState, useEffect, createContext, useContext } from "react";
import Papa from "papaparse";

// URL del Google Sheets publicado como CSV
const GOOGLE_SHEETS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCSUzSkt3wS0wR4vJR8EEWF5Kdukn5KmR30n7y5yYKPu_RmsEG8dlMrL_DF1Tu3gPLrbVlO9-yxT3K/pub?output=csv";

// ================= CONTEXTO GLOBAL =================
const InmueblesContext = createContext(null);

// ================= FUNCIÓN DE MAPEO =================
/**
 * Convierte una fila plana del CSV a la estructura de objeto anidada
 * que usa la aplicación.
 * 
 * Campos del CSV:
 * id;mostrarenweb;titulo;slug;tipo;operacion;precio;direccion;barrio;ciudad;cp;lat;lng;
 * m2Construidos;m2Utiles;habitaciones;banos;terraza;m2Terraza;ascensor;garaje;
 * plazasGaraje;trastero;piscina;aireAco;calefaccion;orientacion;planta;antiguedad;
 * parcela;destacado;nuevo;descripcion;descripcionCorta;imagenes;fechaPublicacion;
 * agente_nombre;agente_telefono;agente_email
 */
const mapRowToInmueble = (row) => {
  // Función helper para parsear booleanos
  const parseBoolean = (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const cleaned = value.trim().toUpperCase();
      return cleaned === "TRUE" || cleaned === "1" || cleaned === "SI" || cleaned === "SÍ";
    }
    return false;
  };

  // Función helper para parsear números de forma segura
  const parseNumber = (value, defaultValue = 0) => {
    if (value === "" || value === null || value === undefined) return defaultValue;
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Función helper para parsear floats (coordenadas)
  const parseFloat_ = (value, defaultValue = 0) => {
    if (value === "" || value === null || value === undefined) return defaultValue;
    // Reemplazar coma por punto para coordenadas en formato español
    const cleanValue = String(value).replace(",", ".");
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Parsear imágenes (string de URLs separadas por coma)
  const parseImagenes = (value) => {
    if (!value || typeof value !== "string" || value.trim() === "") {
      return [];
    }
    return value
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);
  };

  return {
    // Campos principales
    id: String(row.id || ""),
    mostrarEnWeb: parseBoolean(row.mostrarenweb),
    titulo: row.titulo || "",
    slug: row.slug || "",
    tipo: row.tipo || "piso",
    operacion: row.operacion || "venta",
    precio: parseNumber(row.precio),
    
    // Ubicación (objeto anidado)
    ubicacion: {
      direccion: row.direccion || "",
      barrio: row.barrio || "",
      ciudad: row.ciudad || "",
      cp: row.cp || "",
      lat: parseFloat_(row.lat),
      lng: parseFloat_(row.lng),
    },
    
    // Características (objeto anidado)
    // Nota: El CSV usa m2Construidos, m2Utiles, m2Terraza, aireAco
    caracteristicas: {
      metrosConstruidos: parseNumber(row.m2Construidos),
      metrosUtiles: parseNumber(row.m2Utiles),
      habitaciones: parseNumber(row.habitaciones),
      banos: parseNumber(row.banos),
      terraza: parseBoolean(row.terraza),
      metrosTerraza: parseNumber(row.m2Terraza),
      ascensor: parseBoolean(row.ascensor),
      garaje: parseBoolean(row.garaje),
      plazasGaraje: parseNumber(row.plazasGaraje),
      trastero: parseBoolean(row.trastero),
      piscina: parseBoolean(row.piscina),
      aireAcondicionado: parseBoolean(row.aireAco),
      calefaccion: row.calefaccion || "",
      orientacion: row.orientacion || "",
      planta: parseNumber(row.planta),
      antiguedad: parseNumber(row.antiguedad),
      parcela: parseNumber(row.parcela),
    },
    
    // Flags
    destacado: parseBoolean(row.destacado),
    nuevo: parseBoolean(row.nuevo),
    
    // Descripciones
    descripcion: row.descripcion || "",
    descripcionCorta: row.descripcionCorta || "",
    
    // Imágenes (convertir string a array)
    imagenes: parseImagenes(row.imagenes),
    
    // Fecha
    fechaPublicacion: row.fechaPublicacion || "",
    
    // Agente (objeto anidado)
    agente: {
      nombre: row.agente_nombre || "",
      telefono: row.agente_telefono || "",
      email: row.agente_email || "",
    },
  };
};

// ================= FUNCIÓN DE FETCH =================
/**
 * Obtiene y parsea los datos del Google Sheets CSV
 */
const fetchInmueblesFromGoogleSheets = async () => {
  const response = await fetch(GOOGLE_SHEETS_CSV_URL);
  
  if (!response.ok) {
    throw new Error(`Error al cargar datos: ${response.status} ${response.statusText}`);
  }
  
  const csvText = await response.text();
  
  console.log("CSV recibido (primeros 500 chars):", csvText.substring(0, 500));
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      // Dejar que papaparse detecte automáticamente el delimitador
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        console.log("Filas parseadas:", results.data.length);
        console.log("Primera fila:", results.data[0]);
        
        if (results.errors.length > 0) {
          console.warn("Advertencias al parsear CSV:", results.errors);
        }
        
        // Mapear cada fila a la estructura de inmueble
        // y filtrar solo los que tienen mostrarEnWeb: true
        const inmuebles = results.data
          .filter((row) => row.id && String(row.id).trim() !== "") // Filtrar filas vacías
          .map(mapRowToInmueble)
          .filter((inmueble) => inmueble.mostrarEnWeb === true); // Solo mostrar inmuebles con mostrarEnWeb: true
        
        console.log("Inmuebles mapeados y filtrados (mostrarEnWeb: true):", inmuebles.length);
        
        resolve(inmuebles);
      },
      error: (error) => {
        reject(new Error(`Error al parsear CSV: ${error.message}`));
      },
    });
  });
};

// ================= HOOK useInmuebles =================
/**
 * Hook personalizado para consumir los datos de inmuebles.
 * Maneja estados de carga, error y caché.
 */
export const useInmuebles = () => {
  const context = useContext(InmueblesContext);
  
  // Si estamos dentro del Provider, usar el contexto compartido
  if (context !== null) {
    return context;
  }
  
  // Fallback: usar estado local (menos eficiente, pero funcional)
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return { inmuebles, loading, error };
};

// ================= PROVIDER =================
/**
 * Provider que comparte los datos de inmuebles entre todos los componentes.
 * Evita múltiples llamadas al API.
 */
export const InmueblesProvider = ({ children }) => {
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Función para recargar los datos manualmente
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
