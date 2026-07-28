import { Home } from "./pages/Home";
import { Properties } from "./pages/Properties";
import { PropertyDetail } from "./pages/PropertyDetail";
import { NotFound } from "./pages/NotFound";
import { AppLayout } from "./components/AppLayout";
import { fetchAllInmuebles } from "./lib/fetchInmuebles.js";
import { generateSlug } from "./lib/mapInmueble.js";

export const routes = [
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "inmuebles", element: <Properties /> },
      {
        path: "inmuebles/:slug",
        element: <PropertyDetail />,
        getStaticPaths: async () => {
          try {
            const inmuebles = await fetchAllInmuebles();
            return inmuebles.map((p) => `/inmuebles/${p.slug || generateSlug(p.titulo, p.id)}`);
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
