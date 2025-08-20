import http from 'http';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
import userRoute from './routes/info.js';

const app = express();

// CORS para front en 4200
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Rutas REST
app.use('/api', userRoute);

app.get('/', (_req, res) => {
  res.send('Welcome to my API');
});

// Crear servidor HTTP y montar Socket.IO en el mismo puerto
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: 'http://localhost:4200' }
});

// --- Socket.IO ---
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('iot/sensors', async (dato) => {
    console.log('Datos BE:', dato);

    // Reemite a clientes Angular (evento que ya escuchamos en el front)
    io.emit('iot/sensores', dato);

    // fetch nativo de Node 20
    try {
      const baseUrl = 'http://localhost:4000';
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
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`HTTP+WS escuchando en http://localhost:${PORT}`);
});

// --- Conexión a Mongo ---
// (en prod, mueve la URI a una variable de entorno)
mongoose.set('strictQuery', false);
mongoose
  .connect('mongodb+srv://alfonso:admin@clustertestfullstackgs.m4xlp6y.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTestFullStackGS')
  .then(() => console.log('Conectado a base de datos'))
  .catch((error) => console.error(error));
