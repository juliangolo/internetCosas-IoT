// app.js - Temas 3 y 4: Importación y Escucha de Eventos
const { ThermalSensor } = require('./sensor');

// Añadimos fs y el Stream (Tema 4)
const fs = require('node:fs');
const path = require('node:path');

// Creo la tubería para las alertas(modo 'append')
const alertaPath = path.join(__dirname, 'alertas.log');
const alertaStream = fs.createWriteStream(alertaPath, { flags: 'a' });

// Instancio mi primer sensor para una turbina
const sensorTurbina = new ThermalSensor('Turbina-01');

// Tema 4: Subscribo un oyente al evento de datos regulares
sensorTurbina.on ('data', (info) => {
    console.log(`[Mac M4] 📊 DATO: Sensor ${info.id} a ${info.temp}°C`);
});

sensorTurbina.on ('alert', (info) => {
    console.error(`[Mac M4] ⚠️ ALERTA: Sobrecalentamiento en ${info.id} (${info.temp}°C)`);
})

// Tema 4: Subscribo un oyente especializado en emergencias
sensorTurbina.on ('alert', (info) => {
    const logMsg = `[${new Date().toISOString()}] ⚠️ ALERTA: ${info.id} a ${info.temp}°C\n`
    alertaStream.write(logMsg); // Escribo físicamente trozo a trozo
});

// ¡Arranco el motor!
sensorTurbina.start();
