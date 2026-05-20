// server.js - Tema 6: Servidor API para el entorno IoT
const express = require('express');
const app = express();
const PUERTO = 3000;

const fs = require('node:fs');
const path = require('node:path');


// Tema 6: Middleware a nivel de aplicación para registrar el tráfico
app.use((req, res, next) => {
    console.log(`[Mac M4] 🌐 Petición API entrante: ${req.method} a ${req.url}`);
    next(); // 'Fundamental para no dejar la petición colgada!
});

// Tema3: Importo mi clase usando CommonJS
const { ThermalSensor } = require('./sensor');

// Creo la tubería para las alertas(modo 'append')
const alertaPath = path.join(__dirname, 'alertas.log');
const alertaStream = fs.createWriteStream(alertaPath, { flags: 'a' });

// Instancio mi primer sensor para una turbina
const sensorTurbina = new ThermalSensor('Turbina-01');

// ¡Arranco el motor asíncrono!
sensorTurbina.start();

sensorTurbina.on ('data', (info) => {
    console.log(`[Mac M4] 📊 DATO: Sensor ${info.id} a ${info.temp}°C`);
});

// Tema 4: Suscribo al servidor Express para escuchar las alertas del sensor
sensorTurbina.on('alert', (info) => {
   console.error(`[Mac M4] ⚠️ ALERTA: Sobrecalentamiento en ${info.id} (${info.temp}°C)`);
});

sensorTurbina.on ('alert', (info) => {
    const logMsg = `[${new Date().toISOString()}] ⚠️ ALERTA: ${info.id} a ${info.temp}°C\n`
    alertaStream.write(logMsg); // Escribo físicamente trozo a trozo
});

// Tema 6: Defino un enrutador para las solicitudes GET
app.get('/api/sensor/status', (req, res) => {
    res.json({
        id: sensorTurbina.id,
        estado: 'Monitorizando',
        temperatura_actual: sensorTurbina.latestTemp, // Leo el dato en tiempo real
        sistema: 'Mac M4'
    });
});

// Arranco el Servidor
app.listen(PUERTO, () => {
    console.log(`[Mac M4] 🚀 Servidor IoT escuchando en el puerto ${PUERTO}`);
});