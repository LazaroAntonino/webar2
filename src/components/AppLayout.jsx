import { Outlet } from "react-router-dom";
import { StoreProvider } from "./StoreProvider";
import { InmueblesProvider } from "./InmueblesProvider";

// Root layout: inyecta los providers globales
export const AppLayout = () => (
  <StoreProvider>
    <InmueblesProvider>
      <Outlet />
    </InmueblesProvider>
  </StoreProvider>
);
