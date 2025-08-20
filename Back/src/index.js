import http from 'http';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
import 'dotenv/config';
import userRoute from './routes/info.js';

const app = express();

const PORT = Number(process.env.PORT ?? 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:4200';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Rutas REST
app.use('/api', userRoute);

app.get('/', (_req, res) => {
    res.send('Welcome to my API');
});

// Crear servidor HTTP y montar Socket.IO en el mismo puerto
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: CORS_ORIGIN } });

// --- Socket.IO ---
io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('iot/sensors', async (dato) => {
        console.log('Datos BE:', dato);

        // Reemitir a clientes Angular
        io.emit('iot/sensores', dato);

        // Persistir vía tu propia API
        try {
            const baseUrl = `http://localhost:${PORT}`;
            await fetch(`${baseUrl}/api/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sensor: 'TEMP',
                    value: dato?.data?.[0]?.value,
                    date: new Date().toISOString()
                })
            });

            await fetch(`${baseUrl}/api/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sensor: 'HUM',
                    value: dato?.data?.[1]?.value,
                    date: new Date().toISOString()
                })
            });
        } catch (err) {
            console.error('Error POST /api/info', err);
        }
    });
});

// Arranque HTTP + WebSocket en el MISMO puerto
server.listen(PORT, () => {
    console.log(`HTTP+WS escuchando en http://localhost:${PORT}`);
});

// --- Conexión a Mongo ---
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a base de datos'))
    .catch((error) => console.error(error));
