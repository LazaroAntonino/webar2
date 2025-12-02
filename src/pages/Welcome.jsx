import { FaHome, FaUser, FaTools, FaFolderOpen, FaEnvelope } from "react-icons/fa";
import "./Welcome.css";
import { useState } from "react";
import { Proyectos } from "./Proyectos";
import { Inicio } from "./Inicio";
import { Skills } from "./Skills";
import { SobreMi } from "./SobreMi";
import { Contacto } from "./Contacto";
import gunter from "../../gunter.webp"

export const Welcome = () => {
    const [contenidoSeleccionado, setContenidoSeleccionado] = useState("Inicio")

    const seleccionarContenido = (contenido) => {
        switch (contenido) {
            case "Inicio":
                return <Inicio/>;
            case "Sobre mí":
                return <SobreMi/>;
            case "Proyectos":
                return <Proyectos/>;
            case "Skills":
                return <Skills/>;
            case "Contacto":
                return <Contacto/>;
            default:
                return <Inicio/>;
        }
    }
            
    return (
        <div className="welcome-layout">

            {/* Sidebar */}
            <aside className="sidebar">
                <div className="profile-box">
                    <img
                        src={gunter}
                        alt="Profile"
                        className="profile-photo"
                    />
                    <h2 className="profile-name">Antonino</h2>
                </div>

                <nav className="nav-links">
                    <a
                        className={contenidoSeleccionado === "Inicio" ? "active" : ""}
                        onClick={() => setContenidoSeleccionado("Inicio")}
                    >
                        <FaHome /> <span>Inicio</span>
                    </a>

                    <a
                        className={contenidoSeleccionado === "Sobre mí" ? "active" : ""}
                        onClick={() => setContenidoSeleccionado("Sobre mí")}
                    >
                        <FaUser /> <span>Sobre mí</span>
                    </a>

                    <a
                        className={contenidoSeleccionado === "Proyectos" ? "active" : ""}
                        onClick={() => setContenidoSeleccionado("Proyectos")}
                    >
                        <FaFolderOpen /> <span>Proyectos</span>
                    </a>

                    <a
                        className={contenidoSeleccionado === "Skills" ? "active" : ""}
                        onClick={() => setContenidoSeleccionado("Skills")}
                    >
                        <FaTools /> <span>Skills</span>
                    </a>

                    <a
                        className={contenidoSeleccionado === "Contacto" ? "active" : ""}
                        onClick={() => setContenidoSeleccionado("Contacto")}
                    >
                        <FaEnvelope /> <span>Contacto</span>
                    </a>
                </nav>


                {/*<div className="bottom-cta">
                    <button className="download-button">Descargar CV</button>
                </div>*/}
            </aside>

            {/* Panel de contenido */}
            {contenidoSeleccionado ? seleccionarContenido(contenidoSeleccionado) : <main className="welcome-content">
                <h1>Bienvenido a mi Portfolio</h1>
                <p>Soy un desarrollador apasionado por crear experiencias
                    digitales limpias, funcionales y eficientes.</p>

                <button className="explore-button" onClick={()=> setContenidoSeleccionado("Proyectos")}> Proyectos </button>
            </main>}
        </div>
    );
};
