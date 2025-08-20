// Back/scripts/simulator.mjs
import { io } from 'socket.io-client';

const BACK_URL = process.env.BACK_URL || 'http://localhost:4000';
const socket = io(BACK_URL, { transports: ['websocket'] });

const rand = (min, max) => +(min + Math.random() * (max - min)).toFixed(2);

socket.on('connect', () => {
  console.log('Simulator connected:', socket.id);

  const send = () => {
    const payload = {
      date: new Date().toISOString(),
      data: [
        { value: rand(10, 25) }, // TEMP
        { value: rand(30, 70) }, // HUM
      ],
    };
    console.log('emit -> iot/sensors', payload);
    socket.emit('iot/sensors', payload);
  };

  send();                 // primer envío inmediato
  setInterval(send, 10_000); // luego cada 10 s
});

socket.on('connect_error', (e) => console.error('connect_error', e.message));
process.on('SIGINT', () => { console.log('\nbye'); process.exit(0); });
