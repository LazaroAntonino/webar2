import { FaCode, FaTools, FaBolt,FaUsers  } from "react-icons/fa";
import "./Inicio.css";

export const Inicio = () => {
    return (
        <div className="inicio-wrapper">

            {/* TITULO */}
            <h1 className="inicio-title">Bienvenido</h1>
            <p className="inicio-sub">
                Desarrollador Full-Stack centrado en crear interfaces funcionales, limpias y orientadas a resultados.
            </p>

            {/* CARDS */}
            <div className="inicio-cards">

                <div className="inicio-card">
                    <FaCode className="inicio-card-icon" />
                    <h3>Full-Stack Developer</h3>
                    <p>React · Flask · Node · PostgreSQL</p>
                </div>

                <div className="inicio-card">
                    <FaBolt className="inicio-card-icon" />
                    <h3>Aprendizaje rápido</h3>
                    <p>Capacidad para adaptarme y dominar nuevas tecnologías</p>
                </div>

                <div className="inicio-card">
                    <FaUsers className="inicio-card-icon" />
                    <h3>Trabajo en equipo</h3>
                    <p>Comunicación clara y colaboración constante</p>
                </div>

                <div className="inicio-card">
                    <FaTools className="inicio-card-icon" />
                    <h3>Habilidades técnicas</h3>
                    <p>JavaScript · Python · APIs · UI/UX funcional</p>
                </div>

            </div>

            {/* HIGHLIGHT */}
            <div className="inicio-highlight">
                <h2>Actualmente</h2>
                <p>
                    Me encuentro mejorando mi portfolio, construyendo herramientas modernas
                    y perfeccionando mis proyectos con un enfoque en:
                </p>

                <ul className="inicio-list">
                    <li>✔️ Código limpio y mantenible</li>
                    <li>✔️ Arquitecturas simples y eficientes</li>
                    <li>✔️ Experiencias visuales claras y modernas</li>
                </ul>
            </div>

        </div>
    );
};
