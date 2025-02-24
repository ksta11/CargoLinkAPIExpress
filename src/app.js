const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware personalizado para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Middleware para parsear JSON y URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/users', userRoutes);

// Ruta de inicio
app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi API en Express!');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

module.exports = app;