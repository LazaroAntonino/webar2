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
			interval = setInterval(() => {
				setContador((prev) => prev + 1);
			}, 50);
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

			<p>{contador}%</p>

			<button onClick={handleEmpezarCuenta} disabled={isCounting}>
				{isCounting ? "Cargando..." : "Empezar"}
			</button>
		</div>
	);
};
