import express from 'express';
import { getAllShipments, 
    getUserShipments, 
    getAvailableShipments, 
    getShipment, 
    createShipment, 
    updateShipment, 
    deleteShipment } from '../controllers/shipmentController.js';
import { validateShipment, validateShipmentUpdate } from '../validators/shipmentValidator.js';
import validateRequest from '../middlewares/validateRequest.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['admin']), getAllShipments);

router.get('/me', authMiddleware, getUserShipments);

router.get('/available', authMiddleware, roleMiddleware(['user'])/*Cambiar a transporter*/, getAvailableShipments);

router.get('/:id', authMiddleware, roleMiddleware(['user']), getShipment);

router.post('/', authMiddleware, roleMiddleware(['user']), validateRequest(validateShipment), createShipment);    // Crear un envio (user)

router.put('/:id', authMiddleware, roleMiddleware(['user']), validateRequest(validateShipmentUpdate), updateShipment);     // Actualizar un usuario (user)

router.delete('/:id', authMiddleware, roleMiddleware(['user']), deleteShipment);    // Borrar un usuario (Admin)

export default router;