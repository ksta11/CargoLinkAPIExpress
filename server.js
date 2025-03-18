import connectDB from './src/config/db.js';
import app from './src/app.js';

const PORT = process.env.PORT || 3336;

// Conectar a MongoDB
connectDB();

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});