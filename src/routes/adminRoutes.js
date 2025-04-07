import express from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser, searchUsers, getShipments, searchShipment, getGeneralStats } from '../controllers/adminController.js';
import { validateUser, validateUserUpdate } from '../validators/userValidator.js';
import { validateShipmentUpdate } from '../validators/shipmentValidator.js';
import validateRequest from '../middlewares/validateRequest.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import { deleteShipment, getShipment, updateShipment } from '../controllers/shipmentController.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['admin']), getUsers);   // Obtener todos los usuarios (Admin)

router.get('/shipments', authMiddleware, roleMiddleware(['admin']), getShipments);   // Obtener todos los envios (Admin)

router.get('/search', authMiddleware, roleMiddleware(['admin']), searchUsers);

router.get('/shipments/search', authMiddleware, roleMiddleware(['admin']), searchShipment);

router.get('/stats', authMiddleware, roleMiddleware(['admin']), getGeneralStats); // Obtener estadísticas generales (Admin)

router.get('/:id', authMiddleware, roleMiddleware(['admin']), getUser);     // Obtener un usuario (Admin)

router.get('/shipments/:id', authMiddleware, roleMiddleware(['admin']), getShipment);     // Obtener un envio (Admin)

router.post('/', authMiddleware, roleMiddleware(['admin']), validateRequest(validateUser), createUser);    // Crear un usuario (Admin)

router.put('/:id', authMiddleware, validateRequest(validateUserUpdate), roleMiddleware(['admin']), updateUser);     // Actualizar un usuario (Admin)

router.put('/shipments/:id', authMiddleware, roleMiddleware(['admin']),validateRequest(validateShipmentUpdate), updateShipment);     // Actualizar un envio (Admin)

router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);    // Borrar un usuario (Admin)

router.delete('/shipments/:id', authMiddleware, roleMiddleware(['admin']), deleteShipment); // Borrar un envio



export default router;