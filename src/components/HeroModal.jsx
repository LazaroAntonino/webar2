import React from "react";
import "./HeroModal.css";

export const HeroModal = () => {
  return (
    <section className="hero-modal">
      <div className="hero-modal__card">
        <div className="hero-modal__header">
          <div className="hero-modal__badge">Inspirado en tu referencia</div>
          <h1>Encuentra tu próximo hogar</h1>
          <p>
            Creamos experiencias inmobiliarias a medida: compra, vende o alquila con
            acompañamiento experto y tecnología que simplifica cada paso.
          </p>
        </div>

        <form className="hero-modal__form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <label>
              Ciudad o zona
              <input type="text" placeholder="Ej. Salamanca, Chamberí, Retiro" />
            </label>
            <label>
              Presupuesto
              <input type="text" placeholder="200.000 - 500.000 €" />
            </label>
            <label>
              Operación
              <select defaultValue="">
                <option value="" disabled>
                  Selecciona
                </option>
                <option value="comprar">Comprar</option>
                <option value="vender">Vender</option>
                <option value="alquilar">Alquilar</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>
              Tipo de inmueble
              <select defaultValue="">
                <option value="" disabled>
                  Selecciona
                </option>
                <option value="piso">Piso</option>
                <option value="chalet">Chalet</option>
                <option value="ático">Ático</option>
                <option value="loft">Loft</option>
              </select>
            </label>
            <label>
              Habitaciones
              <input type="number" min="0" max="10" placeholder="2" />
            </label>
            <label>
              M² mínimos
              <input type="number" min="0" placeholder="75" />
            </label>
          </div>

          <div className="hero-modal__actions">
            <button type="submit" className="primary-btn">
              Ver inmuebles
            </button>
            <button type="button" className="ghost-link">
              Mostrar mapa
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
