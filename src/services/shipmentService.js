import Shipment from '../models/Shipment.js'; // Modelo de envío

// Obtener un envío por su ID
export const getShipmentById = async (id) => {
    return await Shipment.findById(id); // Asumimos que se usa Mongoose
};
