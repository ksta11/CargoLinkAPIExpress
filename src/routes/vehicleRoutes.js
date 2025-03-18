import express from 'express';
import { createVehicle, getUserVehicles } from '../controllers/vehicleController.js';
import { validateUser, validateUserUpdate } from '../validators/userValidator.js';
import validateRequest from '../middlewares/validateRequest.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['transporter']), createVehicle);

router.get('/vehicles', authMiddleware, roleMiddleware(['transporter']), getUserVehicles);     // Obtener los vehiculos propios (usuario)

export default router;