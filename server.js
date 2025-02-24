const connectDB = require('./src/config/db');
const app = require('./src/app');
const PORT = process.env.PORT || 3336;

// Conectar a MongoDB
connectDB();

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});