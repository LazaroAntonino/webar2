// Import necessary components and functions from react-router-dom.

import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { Properties } from "./pages/Properties";
import { PropertyDetail } from "./pages/PropertyDetail";

// Componente de error personalizado
const NotFound = () => (
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
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <NotFound />
    },
    {
        path: "/inmuebles",
        element: <Properties />
    },
    {
        path: "/inmuebles/:id",
        element: <PropertyDetail />
    },
    {
        path: "*",
        element: <NotFound />
    }
]);