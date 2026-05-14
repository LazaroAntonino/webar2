import { Outlet } from "react-router-dom";
import { Home } from "./pages/Home";
import { Properties } from "./pages/Properties";
import { PropertyDetail } from "./pages/PropertyDetail";
import { StoreProvider } from "./hooks/useGlobalReducer";
import { InmueblesProvider } from "./hooks/useInmuebles";
import { GOOGLE_SHEETS_CSV_URL, mapRowToInmueble } from "./lib/mapInmueble.js";
import SEO from "./components/SEO";

// Root layout: inyecta los providers globales
const AppLayout = () => (
  <StoreProvider>
    <InmueblesProvider>
      <Outlet />
    </InmueblesProvider>
  </StoreProvider>
);

const NotFound = () => (
  <>
    <SEO
      title="Página no encontrada | AR2 Consulting"
      description="La página que buscas no existe."
      noindex
    />
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f6f8',
      fontFamily: 'Inter, system-ui, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <span style={{ fontSize: '80px', marginBottom: '24px' }}>🏠</span>
      <h1 style={{
        fontSize: '32px',
        color: '#1c2e51',
        marginBottom: '12px',
        fontFamily: 'Playfair Display, Georgia, serif'
      }}>
        Página no encontrada
      </h1>
      <p style={{
        fontSize: '16px',
        color: '#9aa3b2',
        marginBottom: '32px',
        maxWidth: '400px'
      }}>
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <a href="/" style={{
        padding: '16px 32px',
        background: '#1c2e51',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease'
      }}>
        Volver al inicio
      </a>
    </div>
  </>
);

export const routes = [
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "inmuebles", element: <Properties /> },
      {
        path: "inmuebles/:id",
        element: <PropertyDetail />,
        getStaticPaths: async () => {
          try {
            const Papa = (await import("papaparse")).default;
            const res = await fetch(GOOGLE_SHEETS_CSV_URL);
            const csv = await res.text();
            return await new Promise((resolve) => {
              Papa.parse(csv, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (h) => h.trim(),
                complete: ({ data }) => {
                  const paths = data
                    .filter((row) => row.id && String(row.id).trim() !== "")
                    .map(mapRowToInmueble)
                    .filter((p) => p.mostrarEnWeb)
                    .map((p) => `/inmuebles/${p.id}`);
                  resolve(paths);
                },
                error: () => resolve([]),
              });
            });
          } catch (e) {
            console.warn("[SSG] getStaticPaths falló:", e.message);
            return [];
          }
        },
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];