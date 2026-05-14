// Mapper puro: convierte una fila CSV a la estructura de inmueble.
// Sin dependencias de React — importable desde Node y desde el navegador.

export const GOOGLE_SHEETS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRCSUzSkt3wS0wR4vJR8EEWF5Kdukn5KmR30n7y5yYKPu_RmsEG8dlMrL_DF1Tu3gPLrbVlO9-yxT3K/pub?output=csv";

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const cleaned = value.trim().toUpperCase();
    return cleaned === "TRUE" || cleaned === "1" || cleaned === "SI" || cleaned === "SÍ";
  }
  return false;
};

const parseNumber = (value, defaultValue = 0) => {
  if (value === "" || value === null || value === undefined) return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

const parseFloat_ = (value, defaultValue = 0) => {
  if (value === "" || value === null || value === undefined) return defaultValue;
  const cleanValue = String(value).replace(",", ".");
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? defaultValue : parsed;
};

const parseImagenes = (value) => {
  if (!value || typeof value !== "string" || value.trim() === "") return [];
  return value.split(",").map((url) => url.trim()).filter((url) => url.length > 0);
};

export const mapRowToInmueble = (row) => ({
  id: String(row.id || ""),
  mostrarEnWeb: parseBoolean(row.mostrarenweb),
  titulo: row.titulo || "",
  slug: row.slug || "",
  tipo: row.tipo || "piso",
  operacion: row.operacion || "venta",
  precio: parseNumber(row.precio),

  ubicacion: {
    direccion: row.direccion || "",
    barrio: row.barrio || "",
    ciudad: row.ciudad || "",
    cp: row.cp || "",
    lat: (() => { const v = parseFloat_(row.lat); return v >= -90 && v <= 90 ? v : 0; })(),
    lng: (() => { const v = parseFloat_(row.lng); return v >= -180 && v <= 180 ? v : 0; })(),
  },

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

  destacado: parseBoolean(row.destacado),
  nuevo: parseBoolean(row.nuevo),
  precioTipo: (row.operacion || "").trim().toLowerCase() === "alquiler" ? "mes" : "venta",

  descripcion: row.descripcion || "",
  descripcionCorta: row.descripcionCorta || "",
  imagenes: parseImagenes(row.imagenes),
  fechaPublicacion: row.fechaPublicacion || "",

  agente: {
    nombre: row.agente_nombre || "",
    telefono: row.agente_telefono || "",
    email: row.agente_email || "",
  },
});
