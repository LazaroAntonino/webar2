import React from "react";
import "./MainNavbar.css";
import logo from "../img/ImagenReferencia1.png";
import { GearSix, MapPin } from "phosphor-react";

export const MainNavbar = () => {
  return (
    <header className="main-navbar">
      <div className="main-navbar__left">
        <img src={logo} alt="MiraHomes" className="main-navbar__logo" />
        <div className="main-navbar__brand">
          <span className="brand-name">MiraHomes</span>
          <span className="brand-tagline">Luxury & Smart Living</span>
        </div>
      </div>

      <div className="main-navbar__actions">
        <button className="ghost-btn" type="button">
          <MapPin size={20} weight="bold" />
          <span>Ubicaciones</span>
        </button>
        <button className="ghost-btn" type="button">
          <GearSix size={20} weight="bold" />
          <span>Ajustes</span>
        </button>
      </div>
    </header>
  );
};
