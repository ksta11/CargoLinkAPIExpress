import express from 'express';
import { getAllShipments, 
    getUserShipments, 
    getAvailableShipments, 
    getShipment, 
    createShipment, 
    updateShipment, 
    deleteShipment,
    getShipmentDetailsForTransporter,
    getAcceptedShipmentsForTransporter,
    acceptShipment,
    startTransit,
    confirmDelivery } from '../controllers/shipmentController.js';
import { validateShipment, validateShipmentUpdate } from '../validators/shipmentValidator.js';
import validateRequest from '../middlewares/validateRequest.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import verifyOwnership from '../middlewares/verifyOwnership.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['admin']), getAllShipments);

router.get('/me', authMiddleware, getUserShipments);

router.get('/available', authMiddleware, roleMiddleware(['transporter', 'admin']), getAvailableShipments);

router.get('/accepted', authMiddleware, roleMiddleware(['transporter']), getAcceptedShipmentsForTransporter);

router.get('/transporter/:id', authMiddleware, roleMiddleware(['transporter']), getShipmentDetailsForTransporter);

router.post('/accept/:id', authMiddleware, roleMiddleware(['transporter']), acceptShipment);

router.post('/transit/:id', authMiddleware, roleMiddleware(['transporter']), startTransit);

router.post('/deliver/:id', authMiddleware, roleMiddleware(['transporter']), confirmDelivery);

router.get('/:id', authMiddleware, roleMiddleware(['user', 'transporter']), verifyOwnership, getShipment);

router.post('/', authMiddleware, roleMiddleware(['user']), validateRequest(validateShipment), createShipment);    // Crear un envio (user)

router.put('/:id', authMiddleware, roleMiddleware(['user']), verifyOwnership, validateRequest(validateShipmentUpdate), updateShipment);     // Actualizar un usuario (user)

router.delete('/:id', authMiddleware, roleMiddleware(['user']), verifyOwnership, deleteShipment);    // Borrar un usuario (Admin)

export default router;