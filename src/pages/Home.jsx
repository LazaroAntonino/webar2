import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router";


export const Home = () => {
	const [contador, setContador] = useState(0);
	const [isCounting, setIsCounting] = useState(false);
	const navigate = useNavigate();

	const handleEmpezarCuenta = () => {
		setContador(0);
		setIsCounting(true);
	};

	useEffect(() => {
		let interval = null;
		if (isCounting && contador < 100) {
			let intervalSpeed;
			switch (true) {

				// Arranca lento (pero no demasiado)
				case contador < 10:
					intervalSpeed = 120;
					break;

				// Primer acelerón fuerte
				case contador < 25:
					intervalSpeed = 50;
					break;

				// Pequeño frenazo para simular carga real
				case contador < 40:
					intervalSpeed = 90;
					break;

				// Zona central rápida
				case contador < 60:
					intervalSpeed = 40;
					break;

				// Ligera desaceleración (se nota visualmente)
				case contador < 75:
					intervalSpeed = 70;
					break;

				// Último empujón rápido
				case contador < 90:
					intervalSpeed = 45;
					break;

				// Final un poco más lento para que se note
				default:
					intervalSpeed = 200;
			}
			interval = setInterval(() => {
				setContador((prev) => prev + 1);
			}, intervalSpeed);
		} else if (contador === 100) {
			setIsCounting(false);

			// Espera 1 segundo y luego navega
			const timeout = setTimeout(() => {
				navigate("/useeffectpage");
			}, 5000);

			return () => clearTimeout(timeout);
		}

		return () => clearInterval(interval);
	}, [isCounting, contador, navigate]);


	return (
		<div className="text-center mt-5">
			<h1>Pantalla de carga</h1>

			{contador === 100 && (
				<h2 className="text-success blink">Carga completada</h2>
			)}

			{contador !== 100 && <p>{contador}%</p>}

			{(!isCounting && contador !== 100) && <button onClick={handleEmpezarCuenta} disabled={isCounting}>
				{isCounting ? "Cargando..." : "Empezar"}
			</button>}
		</div>
	);
};
