import { getShipmentById } from '../services/shipmentService.js';

const verifyOwnership = async (req, res, next) => {
    try {
        const shipmentId = req.params.id; // ID del envío desde los parámetros
        const userId = req.user.id; // ID del usuario autenticado (asumimos que está en req.user)

        // Obtener el envío desde el servicio
        const shipment = await getShipmentById(shipmentId);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Verificar si el usuario es el creador o el transportador del envío
        if (shipment.client.toString() !== userId && shipment.transporter?.toString() !== userId) {
            return res.status(403).json({ message: 'You do not have access to this shipment' });
        }

        // Si pasa la verificación, continuar con la solicitud
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default verifyOwnership;
