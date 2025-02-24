const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const connectDB = async () => {
  try {
    // Conectar a MongoDB usando la URI del archivo .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado');
  } catch (err) {
    console.error('Error de conexión a MongoDB:', err.message);
    process.exit(1); // Detener la aplicación si hay un error de conexión
  }
};

module.exports = connectDB;