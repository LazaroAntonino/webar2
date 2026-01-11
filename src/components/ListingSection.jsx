import React from "react";
import "./ListingSection.css";

export const ListingSection = ({ title, subtitle, highlights = [] }) => {
  return (
    <section className="listing-section">
      <div className="listing-section__content">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <div className="chip-row">
          {highlights.map((item) => (
            <span key={item} className="chip">
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="listing-section__panel">
        <div className="panel-card">
          <div className="panel-title">Próxima vista previa</div>
          <div className="panel-body">
            <div className="panel-row">
              <span>Diseño</span>
              <strong>Minimal chic</strong>
            </div>
            <div className="panel-row">
              <span>Superficie</span>
              <strong>132 m²</strong>
            </div>
            <div className="panel-row">
              <span>Ubicación</span>
              <strong>Centro, Madrid</strong>
            </div>
            <div className="panel-row">
              <span>Estado</span>
              <strong>Disponible</strong>
            </div>
          </div>
          <button className="secondary-btn">Agendar tour privado</button>
        </div>
      </div>
    </section>
  );
};
