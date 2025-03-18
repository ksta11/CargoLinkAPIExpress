import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

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

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas 
app.use('/api/users', userRoutes);

app.use('/api/shipments', shipmentRoutes);

app.use('/api/admin', adminRoutes);


// Ruta de inicio
app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi API en Express!');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

export default app;