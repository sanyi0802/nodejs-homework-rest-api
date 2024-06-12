const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routes/api/contacts'); 

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger)); // Logger para ver las solicitudes en la consola
app.use(cors()); // Middleware para habilitar CORS
app.use(express.json()); // Middleware para parsear JSON

// Rutas de la API
app.use('/api/contacts', contactsRouter);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
