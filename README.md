# AR2 - Web Inmobiliaria

Aplicación web inmobiliaria premium con sistema de valoración y agendamiento de citas integrado con Google Calendar.

## 🚀 Tecnologías

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **API**: Google Calendar API

## 📁 Estructura

```
├── src/                  # Frontend React
│   ├── components/       # Componentes reutilizables
│   ├── pages/            # Páginas de la app
│   ├── hooks/            # Custom hooks
│   └── img/              # Imágenes
├── server/               # Backend Node.js
│   ├── server.js         # API Express
│   ├── .env              # Variables de entorno
│   └── service-account.json  # Credenciales Google
└── public/               # Archivos estáticos
```

## ⚙️ Instalación

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd server
npm install
npm run dev
```

## 🔐 Variables de Entorno (server/.env)

```env
PORT=3001
GOOGLE_CALENDAR_ID=tu-email@gmail.com
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=service-account.json
APP_TIMEZONE=Europe/Madrid
```

## 📝 Notas

- El servidor debe estar corriendo en el puerto 3001 para que el frontend pueda comunicarse con él.
- Las credenciales de Google Calendar (`service-account.json`) no deben subirse a Git.
