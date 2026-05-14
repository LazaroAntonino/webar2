// server/server.js

const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'https://ar2house.com',
    methods: ['POST'],
}));

// --- Configuración de Autenticación con Google Calendar ---
let serviceAccountKey;

// Opción 1: Leer desde variable de entorno (para producción/Render)
if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
        serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        console.log('✅ Credenciales cargadas desde variable de entorno.');
    } catch (error) {
        console.error('❌ ERROR: No se pudo parsear GOOGLE_SERVICE_ACCOUNT_KEY.');
        console.error('Detalles del error:', error.message);
        process.exit(1);
    }
} 
// Opción 2: Leer desde archivo (para desarrollo local)
else {
    const serviceAccountKeyPath = path.join(__dirname, process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || 'service-account.json');
    try {
        serviceAccountKey = JSON.parse(fs.readFileSync(serviceAccountKeyPath, 'utf8'));
        console.log('✅ Archivo service-account.json cargado correctamente.');
    } catch (error) {
        console.error('❌ ERROR: No se pudo leer o parsear el archivo JSON de la cuenta de servicio.');
        console.error(`Asegúrate de que el archivo existe en: ${serviceAccountKeyPath}`);
        console.error('Detalles del error:', error.message);
        process.exit(1);
    }
}

// Log parcial para confirmar carga sin exponer la clave completa
console.log('DEBUG: client_email loaded:', serviceAccountKey.client_email ? serviceAccountKey.client_email.split('@')[0] + '@...' : 'MISSING');

// --- Inicializar jwtClient ---
const jwtClient = new google.auth.JWT({
email: serviceAccountKey.client_email,
key: serviceAccountKey.private_key,
scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/spreadsheets', // Para escribir en Google Sheets
],
});

const calendar = google.calendar({
version: 'v3',
auth: jwtClient,
});

const sheets = google.sheets({
version: 'v4',
auth: jwtClient,
});

// Config opcional para registrar citas en Sheets
const SHEETS_SPREADSHEET_ID = process.env.SHEETS_SPREADSHEET_ID;
const SHEETS_RANGE = process.env.SHEETS_RANGE || 'Citas!A:Z';

// --- ¡¡¡DEFINICIÓN DE TUS ENDPOINTS!!! ---

app.post('/api/check-availability', async (req, res) => {
try {
    const { startDate, endDate, calendarId } = req.body;
    const targetCalendarId = calendarId || process.env.GOOGLE_CALENDAR_ID;

    if (!startDate || !endDate || !targetCalendarId) {
        return res.status(400).json({ error: 'Faltan parámetros: startDate, endDate o calendarId.' });
    }

    await jwtClient.authorize();
    console.log('✅ jwtClient autorizado para check-availability.');

    const response = await calendar.freebusy.query({
        resource: {
            timeMin: new Date(startDate).toISOString(),
            timeMax: new Date(endDate).toISOString(),
            items: [{ id: targetCalendarId }],
        },
    });

    const busyTimes = response.data.calendars[targetCalendarId].busy || [];
    res.json({ busyTimes });

} catch (error) {
    console.error('❌ Error al verificar disponibilidad:', error.message);
    // --- ¡AÑADIR ESTE LOG PARA EL ERROR COMPLETO! ---
    console.error('DEBUG: Objeto de error completo:', error);
    // --- FIN LOG ---
    if (error.code === 403) {
         console.error('Posible error de permisos de la cuenta de servicio en Google Cloud o Calendar compartido.');
    }
    res.status(500).json({ error: 'Fallo al verificar disponibilidad', details: error.message });
}
});

app.post('/api/create-appointment', async (req, res) => {
try {
    const { nombre, email, selectedDateTime, duration, ...otherFormData } = req.body;
    const targetCalendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!email || !selectedDateTime || !duration || !targetCalendarId) {
        return res.status(400).json({ error: 'Faltan campos requeridos: email, selectedDateTime, duration o GOOGLE_CALENDAR_ID.' });
    }

    const startTime = new Date(selectedDateTime);
    const endTime = new Date(startTime.getTime() + parseInt(duration) * 60 * 1000);

    const event = {
        summary: `Cita Valoración - ${nombre || 'Cliente'} - ${otherFormData.tipo || 'Inmueble'} CP ${otherFormData.cp || 'N/A'}`,
        location: otherFormData.cp ? `Código Postal: ${otherFormData.cp}` : 'Ubicación no especificada',
        description: `📋 DATOS DEL CLIENTE\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                     `👤 Nombre: ${nombre || 'N/A'}\n` +
                     `📧 Email: ${email}\n` +
                     `📞 Teléfono: ${otherFormData.telefono || 'N/A'}\n\n` +
                     `🏠 DATOS DEL INMUEBLE\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                     `🏷️ Tipo: ${otherFormData.tipo || 'N/A'}\n` +
                     `📍 Código Postal: ${otherFormData.cp || 'N/A'}\n` +
                     `🔑 Operación: ${otherFormData.operacion || 'N/A'}\n` +
                     `📐 Superficie: ${otherFormData.metros || 'N/A'} m²\n` +
                     `🛏️ Habitaciones: ${otherFormData.habitaciones || 'N/A'}\n` +
                     `🚿 Baños: ${otherFormData.banos || 'N/A'}\n`,
        start: {
            dateTime: startTime.toISOString(),
            timeZone: process.env.APP_TIMEZONE || 'Europe/Madrid',
        },
        end: {
            dateTime: endTime.toISOString(),
            timeZone: process.env.APP_TIMEZONE || 'Europe/Madrid',
        },
        // NOTA: No se incluyen 'attendees' porque las cuentas de servicio
        // no pueden enviar invitaciones sin Domain-Wide Delegation (solo disponible en Google Workspace).
        // El email del cliente se guarda en la descripción del evento.
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'popup', minutes: 15 },
            ],
        },
    };

    await jwtClient.authorize();
    console.log('✅ jwtClient autorizado para create-appointment.');

    const response = await calendar.events.insert({
        calendarId: targetCalendarId,
        resource: event,
    });

    // --- Registro en Google Sheets (histórico) ---
    // Comparte la hoja con el client_email de la cuenta de servicio.
    if (SHEETS_SPREADSHEET_ID) {
        try {
            const row = [
                new Date().toISOString(), // Timestamp de inserción
                nombre || 'N/A',
                email,
                otherFormData.telefono || 'N/A',
                otherFormData.tipo || 'N/A',
                otherFormData.operacion || 'N/A',
                otherFormData.cp || 'N/A',
                otherFormData.metros || 'N/A',
                otherFormData.habitaciones || 'N/A',
                otherFormData.banos || 'N/A',
                startTime.toISOString(), // Fecha/hora cita (UTC)
                startTime.toLocaleString('es-ES', { timeZone: process.env.APP_TIMEZONE || 'Europe/Madrid' }), // Fecha/hora local
                response.data.id || '',
                response.data.htmlLink || '',
            ];

            await sheets.spreadsheets.values.append({
                spreadsheetId: SHEETS_SPREADSHEET_ID,
                range: SHEETS_RANGE,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [row],
                },
            });
        } catch (sheetErr) {
            console.error('⚠️ No se pudo registrar en Google Sheets:', sheetErr.message);
            // No interrumpir la respuesta al cliente si falla Sheets
        }
    }

    res.status(201).json({
        message: 'Cita creada con éxito',
        eventId: response.data.id,
        eventLink: response.data.htmlLink,
        googleMeetLink: response.data.hangoutLink,
    });

} catch (error) {
    console.error('❌ Error al crear la cita:', error.message);
    // --- ¡AÑADIR ESTE LOG PARA EL ERROR COMPLETO! ---
    console.error('DEBUG: Objeto de error completo:', error);
    // --- FIN LOG ---
    if (error.code === 403) {
         console.error('Posible error de permisos de la cuenta de servicio en Google Cloud o Calendar compartido.');
    }
    res.status(500).json({ error: 'Fallo al crear la cita', details: error.message });
}
});

app.listen(PORT, () => {
console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});