# Reto Full-Stack JS (Angular + Express + Socket.IO + MongoDB)

Visualización de datos en tiempo real.

## Requisitos
- Node.js ≥ 20
- Angular CLI (Front en Angular 20)
- Una base MongoDB (Atlas o local)

## Configuración rápida
1) Crea `Back/.env`:

MONGO_URI=mongodb+srv://USUARIO:PASS@HOST/?retryWrites=true&w=majority&appName=APP
PORT=4000
CORS_ORIGIN=http://localhost:4200


2) Instala dependencias:
```bash
cd Back && npm install
cd ../Front && npm install

Ejecutar
Backend (API + WebSocket)

cd Back
node src/index.js
# → HTTP+WS en http://localhost:4000


Frontend (Angular)
cd Front
npx ng serve -o
# → http://localhost:4200

API mínima

POST /api/info → { "sensor": "TEMP"|"HUM", "value": number, "date"?: ISO }

GET /api/info → lista de registros

Eventos Socket.IO

Cliente → Servidor: iot/sensors (ej. { data: [{ value: 23.1 }, { value: 60.2 }] })

Servidor → Clientes: iot/sensores



## Prebas rápidas
# REST
curl -X POST http://localhost:4000/api/info \
  -H "Content-Type: application/json" \
  -d '{"sensor":"TEMP","value":25.5}'
curl http://localhost:4000/api/info


![Arquitectura del sistema](assets/arquitectura.png)

![Screenshots](assets/screenshot-app.jpg)


