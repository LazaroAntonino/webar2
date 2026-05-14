// Fetch + parse CSV para Node (SSG build) y navegador.
// Usa fetch nativo (Node 20+ / navegador moderno).
import Papa from "papaparse";
import { GOOGLE_SHEETS_CSV_URL, mapRowToInmueble } from "./mapInmueble.js";

export async function fetchAllInmuebles() {
  const res = await fetch(GOOGLE_SHEETS_CSV_URL);
  if (!res.ok) throw new Error(`CSV fetch error: ${res.status}`);
  const csvText = await res.text();
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: ({ data, errors }) => {
        if (errors.length) console.warn("[fetchInmuebles] warnings:", errors);
        const inmuebles = data
          .filter((row) => row.id && String(row.id).trim() !== "")
          .map(mapRowToInmueble)
          .filter((p) => p.mostrarEnWeb);
        resolve(inmuebles);
      },
      error: (err) => reject(new Error(err.message)),
    });
  });
}
