// sensor.js - Temas 3 y 4: Módulos y Eventos
const EventEmitter = require('node:events');

class ThermalSensor extends EventEmitter {
    constructor(id) {
        super(); // Inicializo el EventEmitter
        this.id = id;
    }
    // Tema 2: Ciclo de vida asíncrono (Timers)
    start() {
        console.log(`[Mac M4] 🌡️ Sensor IoT ${this.id} encendido.`);

        setInterval(() => {
            // Simulo una temperatura aleatoria entre 20 y 40 grados
            const currentTemp = (Math.random() * 20 +20).toFixed(1);

            // Tema 4: Notifico a los observadores que hay un nuevo dato
            this.emit('data', { id: this.id, temp: parseFloat(currentTemp) });
            if (currentTemp >= 35) {
                // emito un evento llamado 'alert' comunicando que hay sobrecalentamiento
                this.emit('alert', { id: this.id, temp: parseFloat(currentTemp) });
            }
        }, 2000);
    }
}

// Tema 3: Exporto la clase para hacerla pública
module.exports = { ThermalSensor };
