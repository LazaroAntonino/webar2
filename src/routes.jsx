import { Home } from "./pages/Home";
import { Properties } from "./pages/Properties";
import { PropertyDetail } from "./pages/PropertyDetail";
import { LandingInfo } from "./pages/LandingInfo";
import { LegalPage } from "./pages/LegalPage";
import { NotFound } from "./pages/NotFound";
import { AppLayout } from "./components/AppLayout";
import { fetchAllInmuebles } from "./lib/fetchInmuebles.js";
import { generateSlug } from "./lib/mapInmueble.js";
import { localidades } from "./data/landings/localidades.js";

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
      {
        path: "cuanto-vale-una-casa/:localidad",
        element: <LandingInfo basePath="cuanto-vale-una-casa" />,
        getStaticPaths: async () => localidades.map((l) => `/cuanto-vale-una-casa/${l.slug}`),
      },
      {
        path: "vender-casa/:localidad",
        element: <LandingInfo basePath="vender-casa" />,
        getStaticPaths: async () => localidades.map((l) => `/vender-casa/${l.slug}`),
      },
      { path: "que-es-ar2", element: <LandingInfo slug="que-es-ar2" /> },
      { path: "equipo-ar2", element: <LandingInfo slug="equipo-ar2" /> },
      { path: "por-que-elegir-agencia-inmobiliaria-premium", element: <LandingInfo slug="por-que-elegir-agencia-inmobiliaria-premium" /> },
      { path: "opiniones-ar2-consulting", element: <LandingInfo slug="opiniones-ar2-consulting" /> },
      { path: "tasacion-gratuita-vivienda-madrid", element: <LandingInfo slug="tasacion-gratuita-vivienda-madrid" /> },
      { path: "valorar-chalet-madrid", element: <LandingInfo slug="valorar-chalet-madrid" /> },
      { path: "comprar-casa-madrid-extranjeros", element: <LandingInfo slug="comprar-casa-madrid-extranjeros" /> },
      { path: "alquiler-o-compra-madrid", element: <LandingInfo slug="alquiler-o-compra-madrid" /> },
      { path: "aviso-legal", element: <LegalPage page="aviso-legal" /> },
      { path: "privacidad", element: <LegalPage page="privacidad" /> },
      { path: "cookies", element: <LegalPage page="cookies" /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
