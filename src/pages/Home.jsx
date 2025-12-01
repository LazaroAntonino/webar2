import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router";

export const Home = () => {
	const [contador, setContador] = useState(0);
	const [isCounting, setIsCounting] = useState(false);
	const [mensajeCarga, setMensajeCarga] = useState("Cargando talento… esto puede llevar un rato.");
	const navigate = useNavigate();

	const handleEmpezarCuenta = () => {
		setContador(0);
		setIsCounting(true);
	};

	const cambiarMensajeAleatorio = () => {
		const mensajes = [
			"Desbloqueando todo tu potencial...",
			"Preparando algo que no estás listo para ver...",
			"Cargando habilidades ocultas...",
			"Activando modo leyenda...",
			"Desplegando talento en 3… 2… 1…",
			"Renderizando tu futuro...",
			"Compilando líneas de código del destino...",
			"Empaquetando experiencias...",
			"Sincronizando módulos de innovación...",
			"Transfiriendo energía creativa...",
			"Aplicando buff de productividad +50...",
			"Creando ambiente épico...",
			"Transformando ideas en realidad...",
			"Refinando detalles...",
			"Cargando texturas HD de tu carrera...",
			"Optimización crítica en proceso...",
			"La barra se mueve, así que algo estará pasando...",
			"Esto no es magia, es JavaScript.",
			"Últimos retoques maestros...",
			"A punto de revelar algo grande..."
		];

		setMensajeCarga(mensajes[Math.floor(Math.random() * mensajes.length)]);
	};



	useEffect(() => {
		if (!isCounting || contador >= 100) return;

		let intervalSpeed;
		switch (true) {
			case contador < 10: intervalSpeed = 120; break;
			case contador < 25: intervalSpeed = 50; break;
			case contador < 40: intervalSpeed = 90; break;
			case contador < 60: intervalSpeed = 40; break;
			case contador < 75: intervalSpeed = 70; break;
			case contador < 90: intervalSpeed = 45; break;
			default: intervalSpeed = 200;
		}

		const interval = setInterval(() => {
			setContador(prev => prev + 1);
		}, intervalSpeed);

		return () => clearInterval(interval);

	}, [isCounting, contador]);

	useEffect(() => {
		if (!isCounting || contador >= 100) return;

		const interval = setInterval(() => {
			cambiarMensajeAleatorio();
		}, 2000);

		return () => clearInterval(interval);

	}, [isCounting]);

	useEffect(() => {
		if (contador === 100) {
			setIsCounting(false);
			const timeout = setTimeout(() => navigate("/welcome"), 3000);
			return () => clearTimeout(timeout);
		}
	}, [contador, navigate]);


	return (
		<div className="home-container">
			<div className="loader-box">
				<h1 className="home-title">Bienvenido a mi portfolio</h1>
				<h1 className="mb-5">Antonino Lázaro</h1>

				{contador !== 100 && contador !== 0 && (
					<>
						<div className="progress-bar-container">
							<div
								className="progress-bar-fill"
								style={{ width: `${contador}%` }}
							></div>
						</div>

						<p className="contador-text">{contador}%</p>
					</>
				)}
				{isCounting && <p className="loading-text">{mensajeCarga}</p>}
				{!isCounting && contador !== 100 && (
					<button className="start-button" onClick={handleEmpezarCuenta}>
						Empezar
					</button>
				)}

				{contador === 100 && <h2 className="text-success blink">Carga completada. Redirigiendo...</h2>
				}
			</div>
		</div>
	);
};
