import express from 'express';
import { getUserWithVehicles, getTransporterStatistics } from '../controllers/transporterController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Ruta existente para obtener usuario con vehículos
router.get('/profile', authMiddleware, roleMiddleware(['transporter']), getUserWithVehicles);

// Nueva ruta para obtener estadísticas del transportador
router.get('/statistics', authMiddleware, roleMiddleware(['transporter']), getTransporterStatistics);

export default router;
