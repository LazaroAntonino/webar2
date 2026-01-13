import React, { useState, useEffect } from "react";
import "./ValuationModal.css";

const initialForm = {
    tipo: "",
    operacion: "",
    cp: "",
    metros: "",
    habitaciones: "",
    banos: "",
    email: "",
    telefono: "",
    // cita: "" // FUTURO Google Calendar
};

export const ValuationModal = ({ open, onClose, tipoInicial }) => {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (open) {
            setStep(0);
            setForm({
                ...initialForm,
                tipo: tipoInicial || "",
            });
        }
    }, [open, tipoInicial]);

    if (!open) return null;

    const nextStep = () => setStep(s => Math.min(s + 1, 5));
    const prevStep = () => setStep(s => Math.max(s - 1, 0));

    /* ================= VALIDACIONES ================= */
    const canContinue = () => {
        switch (step) {
            case 0: return form.operacion !== "";
            case 1: return form.cp.length === 5;
            case 2: return form.metros !== "";
            case 3: return form.habitaciones !== "" && form.banos !== "";
            case 4: return form.email !== "" && form.telefono !== "";
            default: return true;
        }
    };

    const handleFinish = () => {
        console.log("FORMULARIO FINAL:", form);

        // aquí luego irá el fetch a Google Sheets

        // reset completo
        setForm(initialForm);
        setStep(0);
        onClose();
    };

    return (
        <div className="valuation-modal-overlay">
            <div className="valuation-modal">

                {/* HEADER */}
                <div className="valuation-modal-header">
                    <span className="step-indicator">
                        Paso {step + 1} de 6
                    </span>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {/* BODY */}
                <div className="valuation-modal-body">

                    {step === 0 && (
                        <>
                            <h2>¿Quieres vender o alquilar?</h2>
                            <div className="valuation-options">
                                {["vender", "alquilar"].map(op => (
                                    <button
                                        key={op}
                                        className={`valuation-option ${form.operacion === op ? "active" : ""}`}
                                        onClick={() => setForm(f => ({ ...f, operacion: op }))}
                                    >
                                        {op === "vender" ? "Vender" : "Alquilar"}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <h2>¿Dónde se encuentra el inmueble?</h2>
                            <p className="modal-subtitle">Código postal</p>
                            <input
                                type="text"
                                maxLength="5"
                                placeholder="Ej. 28001"
                                value={form.cp}
                                onChange={(e) => setForm(f => ({ ...f, cp: e.target.value }))}
                            />
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2>Superficie aproximada</h2>
                            <div className="valuation-options valuation-options--grid">
                                {["0-50", "50-100", "100-150", "+150"].map(m => (
                                    <button
                                        key={m}
                                        className={`valuation-option ${form.metros === m ? "active" : ""}`}
                                        onClick={() => setForm(f => ({ ...f, metros: m }))}
                                    >
                                        {m} m²
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2>Distribución</h2>
                            <div className="double-input">
                                <div>
                                    <label>Habitaciones</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.habitaciones}
                                        onChange={(e) => setForm(f => ({ ...f, habitaciones: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label>Baños</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.banos}
                                        onChange={(e) => setForm(f => ({ ...f, banos: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <h2>Datos de contacto</h2>
                            <p className="modal-subtitle">Te enviaremos la valoración</p>

                            <input
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                            />
                            <input
                                type="tel"
                                placeholder="Teléfono"
                                value={form.telefono}
                                onChange={(e) => setForm(f => ({ ...f, telefono: e.target.value }))}
                            />
                        </>
                    )}

                    {step === 5 && (
                        <>
                            <h2>Todo listo</h2>
                            <p className="modal-subtitle">
                                Un asesor revisará tu solicitud y contactará contigo.
                            </p>
                        </>
                    )}
                </div>

                {/* FOOTER */}
                <div className="valuation-modal-footer">
                    {step > 0 ? (
                        <button
                            className="modal-back"
                            onClick={prevStep}
                            aria-label="Volver"
                        >
                            ←
                        </button>
                    ) : (
                        <span />
                    )}

                    <button
                        className="modal-cta"
                        disabled={!canContinue()}
                        onClick={step === 5 ? handleFinish : nextStep}
                    >
                        {step === 5 ? "Finalizar" : "Continuar"}
                    </button>
                </div>

            </div>
        </div>
    );
};
