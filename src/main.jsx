import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Global styles for your application
import { RouterProvider } from "react-router-dom";  // Import RouterProvider to use the router
import { router } from "./routes";  // Import the router configuration
import { StoreProvider } from './hooks/useGlobalReducer';  // Import the StoreProvider for global state management
import { InmueblesProvider } from './hooks/useInmuebles';  // Import the InmueblesProvider for real-time property data

const Main = () => {
    return (
        <React.StrictMode>  
            {/* Provide global state to all components */}
            <StoreProvider>
                {/* Provide inmuebles data from Google Sheets to all components */}
                <InmueblesProvider>
                    {/* Set up routing for the application */} 
                    <RouterProvider router={router}>
                    </RouterProvider>
                </InmueblesProvider>
            </StoreProvider>
        </React.StrictMode>
    );
}

// Render the Main component into the root DOM element.
ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
