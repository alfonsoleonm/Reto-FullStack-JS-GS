import { connect } from "mongoose";
import express, { json as _json } from "express";
const app = express();
const server = require('http').Server(app)
import cors from 'cors';
import userRoute from "./routes/info";
import { post } from 'request';
app.use(cors());
const io = require('socket.io')(server, {
    cors: {
        origins: ['http://localhost:4200']
    }
});

app.use(_json());
app.use("/api", userRoute);
app.use(cors());

app.get("/", (req, res) => {
    res.send("Welcome to my API");
});

app.listen(4000, () => console.log("Server listening to", 4000));

//conex a mongo
connect("mongodb+srv://alfonso:admin@cluster3.rppjtme.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Conectado a base de datos"))
    .catch((error) => console.log(error))


var sendData
var sockettt
io.on('connection', (socket) => {
    sockettt = socket
    socket.on('iot/sensors', (dato) => {
        console.log("Datos BE: ", dato);
        sendData = dato;
        sendDataa();
        post(
            'http://localhost:4000/api/info',
            { json: { sensor: "TEMP", value: dato.data[0].value, date: new Date().toLocaleString() } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            }
        );
        post(
            'http://localhost:4000/api/info',
            { json: { sensor: "HUM", value: dato.data[1].value, date: new Date().toLocaleString() } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            }
        );
    })

    console.log('Conectado al server');
});

function sendDataa() {
    sockettt.emit('iot/sensores', sendData);

}

server.listen(3000, () => {
    console.log('escuchando en *:3000');
});


