# Reto Full-Stack JS (Angular + Express + Socket.IO + MongoDB)

Visualización de datos en tiempo real.

## Requisitos

* Node.js ≥ 20
* Angular CLI (Front en Angular 20)
* MongoDB (Atlas o local)

## Configuración rápida

1. Crea `Back/.env`:

```dotenv
MONGO_URI=mongodb+srv://USUARIO:PASS@HOST/?retryWrites=true&w=majority&appName=APP
PORT=4000
CORS_ORIGIN=http://localhost:4200
```

2. Instala dependencias:

```bash
cd Back && npm install
cd ../Front && npm install
```

## Ejecutar

### Backend (API + WebSocket)

```bash
cd Back
node src/index.js
# → HTTP+WS en http://localhost:4000
```

### Frontend (Angular)

```bash
cd Front
npx ng serve -o
# → http://localhost:4200
```

### Simulador de datos

```bash
cd Back
npm run simulate
# Emite cada 10 s el evento 'iot/sensors'
```

## API mínima

### POST `/api/info`

Crea un registro:

```json
{ "sensor": "TEMP" | "HUM", "value": 25.5, "date": "ISO (opcional)" }
```

### GET `/api/info`

Devuelve lista de registros. Parámetros opcionales:

* `minutes=15` → últimos N minutos
* `sensor=TEMP|HUM&from=ISO&to=ISO` → filtrar por sensor y rango

## Eventos Socket.IO

* Cliente → Servidor: `iot/sensors`

  ```json
  { "data": [ { "value": 23.1 }, { "value": 60.2 } ] }
  ```
* Servidor → Clientes: `iot/sensores`

## Pruebas rápidas (REST)

```bash
curl -X POST http://localhost:4000/api/info \
  -H "Content-Type: application/json" \
  -d '{"sensor":"TEMP","value":25.5}'

curl "http://localhost:4000/api/info?minutes=15"
```


<img src="assets/arquitectura.png" alt="Arquitectura del sistema" width="1000">

<img src="assets/screenshot-app.jpg" alt="Screenshot de la app" width="900">


