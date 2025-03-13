const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { validateShipment, validateShipmentUpdate } = require('../validators/shipmentValidator');
const validateRequest = require('../middlewares/validateRequest');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(['admin']), shipmentController.getAllShipments);

router.get('/me', authMiddleware, shipmentController.getUserShipments);

router.get('/available', authMiddleware, roleMiddleware(['user'])/*Cambiar a transporter*/, shipmentController.getAvailableShipments);

router.get('/:id', authMiddleware, roleMiddleware(['user']), shipmentController.getShipment);

router.post('/', authMiddleware, roleMiddleware(['user']), validateRequest(validateShipment), shipmentController.createShipment);    // Crear un envio (user)

router.put('/:id', authMiddleware, roleMiddleware(['user']), validateRequest(validateShipmentUpdate), shipmentController.updateShipment);     // Actualizar un usuario (user)

router.delete('/:id', authMiddleware, roleMiddleware(['user']), shipmentController.deleteShipment);    // Borrar un usuario (Admin)

module.exports = router;