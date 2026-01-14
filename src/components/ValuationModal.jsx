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
    selectedDateTime: null, // Campo para almacenar la fecha y hora seleccionada
};

export const ValuationModal = ({ open, onClose, tipoInicial }) => {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(initialForm);
    const [busySlots, setBusySlots] = useState([]); // Slots ocupados del backend
    const [loadingAvailability, setLoadingAvailability] = useState(false); // Estado de carga
    const [selectedDate, setSelectedDate] = useState(new Date()); // Día seleccionado en el calendario (solo la fecha)
    const [errors, setErrors] = useState({}); // Errores de validación

    // --- Efecto: Inicialización y Reseteo al abrir/cerrar ---
    useEffect(() => {
        if (open) {
            setStep(0);
            setForm({
                ...initialForm,
                tipo: tipoInicial || "",
            });
            // Resetear estados del calendario al abrir el modal
            setSelectedDate(new Date());
            setBusySlots([]);
            setErrors({});
        }
    }, [open, tipoInicial]);

    // --- Efecto: Control del scroll del body ---
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = ""; // Limpieza al desmontar el componente
        };
    }, [open]);

    // --- Efecto: Cargar disponibilidad cuando el paso es 5 y la fecha cambia ---
    // Se ejecuta al entrar al paso 5 o al cambiar el día en el calendario
    useEffect(() => {
        if (open && step === 5 && selectedDate) {
            fetchAvailability(selectedDate);
        }
    }, [open, step, selectedDate]); // Dependencias: re-ejecutar si alguna de estas cambia

    if (!open) return null; // No renderizar si el modal no está abierto

    // --- Lógica de navegación entre pasos ---
    const totalSteps = 7; // Ahora el formulario tiene 8 pasos (0 a 7, donde 7 es confirmación final)
    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 0));

    // --- Lógica para obtener disponibilidad del backend ---
    const fetchAvailability = async (date) => {
        setLoadingAvailability(true);
        setBusySlots([]); // Limpiar slots anteriores mientras carga
        setForm(f => ({ ...f, selectedDateTime: null })); // Deseleccionar cualquier hora al cambiar de día

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0); // Establece la hora al inicio del día

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999); // Establece la hora al final del día

        try {
            const response = await fetch('http://localhost:3001/api/check-availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startDate: startOfDay.toISOString(),
                    endDate: endOfDay.toISOString(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Error al obtener disponibilidad');
            }
            const data = await response.json();
            // console.log("Busy times from backend:", data.busyTimes); // Para depuración
            setBusySlots(data.busyTimes || []); // Almacena las franjas ocupadas
        } catch (error) {
            console.error('Error fetching availability:', error);
            alert(`No se pudo cargar la disponibilidad: ${error.message}.`);
        } finally {
            setLoadingAvailability(false);
        }
    };

    // --- Función para generar slots de tiempo disponibles ---
    // ESTA ES UNA IMPLEMENTACIÓN DE EJEMPLO. AJUSTA LOS HORARIOS, DURACIÓN Y LÓGICA
    // SEGÚN TUS NECESIDADES REALES (ej. días de la semana, festivos, etc.).
    const generateTimeSlots = (date, durationMinutes = 30) => {
        const slots = [];
        const startHour = 9; // Hora de inicio de las citas (ej. 9 AM)
        const endHour = 18;  // Hora de fin de las citas (ej. hasta las 5:30 PM para citas de 30 min)

        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        for (let h = startHour; h < endHour; h++) {
            for (let m = 0; m < 60; m += durationMinutes) {
                const slotTime = new Date(date);
                slotTime.setHours(h, m, 0, 0);

                // Asegurarse de que el slot no está en el pasado si es hoy
                if (isToday && slotTime.getTime() < today.getTime() + (5 * 60 * 1000)) { // +5 min de margen
                    continue;
                }

                // Verificar si este slot está ocupado según busySlots (franjas recibidas del backend)
                const isBusy = busySlots.some(busy => {
                    const busyStart = new Date(busy.start);
                    const busyEnd = new Date(busy.end);
                    const slotEnd = new Date(slotTime.getTime() + durationMinutes * 60 * 1000);

                    // Un slot está ocupado si se solapa con una franja ocupada existente
                    return (slotTime < busyEnd && slotEnd > busyStart);
                });

                if (!isBusy) {
                    slots.push(slotTime);
                }
            }
        }
        return slots;
    };

    /* ================= VALIDACIONES ================= */
    
    // Validar formato de email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    // Validar formato de teléfono (mínimo 9 dígitos)
    const isValidPhone = (phone) => {
        const phoneDigits = phone.replace(/\D/g, ''); // Solo dígitos
        return phoneDigits.length >= 9;
    };
    
    // Validar campos y actualizar errores
    const validateContactFields = () => {
        const newErrors = {};
        
        if (form.email && !isValidEmail(form.email)) {
            newErrors.email = 'Introduce un email válido';
        }
        
        if (form.telefono && !isValidPhone(form.telefono)) {
            newErrors.telefono = 'Mínimo 9 dígitos';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ================= VALIDACIONES DE PASOS ================= */
    const canContinue = () => {
        switch (step) {
            case 0: return form.operacion !== "";
            case 1: return form.cp.length === 5;
            case 2: return form.metros !== "";
            case 3: return form.habitaciones !== "" && form.banos !== "";
            case 4: 
                // Validar que los campos no estén vacíos Y que tengan formato válido
                return form.email !== "" && 
                       form.telefono !== "" && 
                       isValidEmail(form.email) && 
                       isValidPhone(form.telefono);
            case 5: return form.selectedDateTime !== null;
            default: return true;
        }
    };

    /* ================= MANEJADOR DE FINALIZACIÓN DEL FORMULARIO ================= */
    const handleFinish = async () => {
        console.log("FORMULARIO FINAL:", form);

        try {
            // Llamada al endpoint del backend para crear la cita
            const response = await fetch('http://localhost:3001/api/create-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: form.email,
                    selectedDateTime: form.selectedDateTime.toISOString(), // Envía la fecha y hora en formato ISO
                    duration: 30, // Duración fija de la cita en minutos (puedes hacerla configurable)
                    // Pasa el resto de los datos del formulario que quieras incluir en la descripción del evento
                    tipo: form.tipo, // Tipo de inmueble: piso, casa, local
                    operacion: form.operacion,
                    cp: form.cp,
                    metros: form.metros,
                    habitaciones: form.habitaciones,
                    banos: form.banos,
                    telefono: form.telefono,
                }),
            });

            if (!response.ok) {
                // Si el backend responde con un error HTTP (ej. 400, 500)
                const errorData = await response.json();
                throw new Error(errorData.details || 'Error desconocido al crear la cita');
            }

            const data = await response.json(); // La respuesta del backend (ej. ID del evento, enlace)
            console.log("Cita creada:", data);
            
            // Avanzar al paso de confirmación exitosa
            setStep(7);

        } catch (error) {
            console.error("Hubo un error al agendar la cita:", error);
            alert(`Hubo un error al agendar la cita: ${error.message}. Por favor, inténtalo de nuevo.`);
        }
    };

    /* ================= CERRAR Y RESETEAR MODAL ================= */
    const handleClose = () => {
        setForm(initialForm);
        setStep(0);
        onClose();
    };

    return (
        <div className="valuation-modal-overlay">
            <div className="valuation-modal">

                {/* HEADER - Solo mostrar indicador de paso si no estamos en el paso final de confirmación */}
                <div className="valuation-modal-header">
                    {step < 7 ? (
                        <span className="step-indicator">
                            Paso {step + 1} de 7
                        </span>
                    ) : (
                        <span />
                    )}
                    <button className="close-btn" onClick={handleClose}>×</button>
                </div>

                {/* BODY */}
                <div className="valuation-modal-body">

                    {/* Paso 0: Vender o Alquilar */}
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

                    {/* Paso 1: Código Postal */}
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

                    {/* Paso 2: Superficie */}
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

                    {/* Paso 3: Distribución */}
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

                    {/* Paso 4: Datos de Contacto */}
                    {step === 4 && (
                        <>
                            <h2>Datos de contacto</h2>
                            <p className="modal-subtitle">Te enviaremos la valoración</p>

                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={form.email}
                                    className={errors.email ? 'input-error' : ''}
                                    onChange={(e) => {
                                        setForm(f => ({ ...f, email: e.target.value }));
                                        if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                                    }}
                                    onBlur={validateContactFields}
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                            
                            <div className="input-group">
                                <input
                                    type="tel"
                                    placeholder="Teléfono"
                                    value={form.telefono}
                                    className={errors.telefono ? 'input-error' : ''}
                                    onChange={(e) => {
                                        setForm(f => ({ ...f, telefono: e.target.value }));
                                        if (errors.telefono) setErrors(prev => ({ ...prev, telefono: null }));
                                    }}
                                    onBlur={validateContactFields}
                                />
                                {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                            </div>
                        </>
                    )}

                    {/* --- NUEVO PASO 5: Selección de Fecha y Hora --- */}
                    {step === 5 && (
                        <>
                            <h2>Agenda una reunión</h2>
                            <p className="modal-subtitle">
                                Selecciona el día y la hora que mejor te convenga.
                            </p>
                            
                            {/* Selector de días - próximos 14 días */}
                            <div className="date-selector">
                                <div className="date-selector-scroll">
                                    {Array.from({ length: 14 }, (_, i) => {
                                        const date = new Date();
                                        date.setDate(date.getDate() + i);
                                        const isSelected = selectedDate.toDateString() === date.toDateString();
                                        const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
                                        const dayNum = date.getDate();
                                        const monthName = date.toLocaleDateString('es-ES', { month: 'short' });
                                        
                                        return (
                                            <button
                                                key={i}
                                                className={`date-pill ${isSelected ? 'active' : ''}`}
                                                onClick={() => {
                                                    setSelectedDate(date);
                                                    setForm(f => ({ ...f, selectedDateTime: null }));
                                                }}
                                            >
                                                <span className="date-pill-day">{dayName}</span>
                                                <span className="date-pill-num">{dayNum}</span>
                                                <span className="date-pill-month">{monthName}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Slots de hora */}
                            {loadingAvailability ? (
                                <div className="loading-message">
                                    <span className="loading-spinner"></span>
                                    Cargando disponibilidad...
                                </div>
                            ) : (
                                <div className="time-section">
                                    {generateTimeSlots(selectedDate).length > 0 ? (
                                        <>
                                            {/* Mañana */}
                                            {generateTimeSlots(selectedDate).filter(slot => slot.getHours() < 14).length > 0 && (
                                                <div className="time-group">
                                                    <span className="time-group-label">☀️ Mañana</span>
                                                    <div className="time-slots-grid">
                                                        {generateTimeSlots(selectedDate)
                                                            .filter(slot => slot.getHours() < 14)
                                                            .map((slot, index) => (
                                                                <button
                                                                    key={index}
                                                                    className={`time-slot ${form.selectedDateTime?.getTime() === slot.getTime() ? "active" : ""}`}
                                                                    onClick={() => setForm(f => ({ ...f, selectedDateTime: slot }))}
                                                                >
                                                                    {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </button>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Tarde */}
                                            {generateTimeSlots(selectedDate).filter(slot => slot.getHours() >= 14).length > 0 && (
                                                <div className="time-group">
                                                    <span className="time-group-label">🌙 Tarde</span>
                                                    <div className="time-slots-grid">
                                                        {generateTimeSlots(selectedDate)
                                                            .filter(slot => slot.getHours() >= 14)
                                                            .map((slot, index) => (
                                                                <button
                                                                    key={index}
                                                                    className={`time-slot ${form.selectedDateTime?.getTime() === slot.getTime() ? "active" : ""}`}
                                                                    onClick={() => setForm(f => ({ ...f, selectedDateTime: slot }))}
                                                                >
                                                                    {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </button>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="no-availability">No hay horas disponibles para este día.</p>
                                    )}
                                </div>
                            )}
                            
                            {/* Resumen de selección */}
                            {form.selectedDateTime && (
                                <div className="selection-preview">
                                    ✓ {form.selectedDateTime.toLocaleDateString('es-ES', { 
                                        weekday: 'long', 
                                        day: 'numeric', 
                                        month: 'long' 
                                    })} a las {form.selectedDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            )}
                        </>
                    )}

                    {/* --- PASO FINAL 6: Confirmación antes de enviar --- */}
                    {step === 6 && (
                        <>
                            <div className="success-icon">📅</div>
                            <h2>¡Todo listo!</h2>
                            <p className="modal-subtitle">
                                Confirma tu cita y un agente se pondrá en contacto contigo en menos de 24 horas.
                            </p>
                            {form.selectedDateTime && (
                                <div className="appointment-summary">
                                    Fecha de tu cita
                                    <strong>
                                        {form.selectedDateTime.toLocaleDateString('es-ES', { 
                                            weekday: 'long', 
                                            day: 'numeric', 
                                            month: 'long' 
                                        })} a las {form.selectedDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </strong>
                                </div>
                            )}
                        </>
                    )}

                    {/* --- PASO 7: Confirmación exitosa después de crear la cita --- */}
                    {step === 7 && (
                        <>
                            <div className="success-icon">✓</div>
                            <h2>¡Cita registrada!</h2>
                            <p className="modal-subtitle">
                                Tu solicitud ha sido enviada correctamente.
                            </p>
                            <div className="success-message">
                                Un agente se pondrá en contacto contigo en menos de 24 horas para la valoración de tu inmueble.
                            </div>
                            {form.selectedDateTime && (
                                <div className="appointment-summary">
                                    📅 Fecha de tu cita
                                    <strong>
                                        {form.selectedDateTime.toLocaleDateString('es-ES', { 
                                            weekday: 'long', 
                                            day: 'numeric', 
                                            month: 'long' 
                                        })} a las {form.selectedDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </strong>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* FOOTER */}
                <div className="valuation-modal-footer">
                    {/* Paso 7 = confirmación exitosa, solo mostrar botón "Entendido" */}
                    {step === 7 ? (
                        <>
                            <span />
                            <button
                                className="modal-cta"
                                onClick={handleClose}
                            >
                                Entendido
                            </button>
                        </>
                    ) : (
                        <>
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
                                onClick={step === 6 ? handleFinish : nextStep}
                            >
                                {step === 6 ? "Confirmar cita" : "Continuar"}
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};