import Shipment from '../models/Shipment.js';

// Obtener todos los envíos (para administradores)
export const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find()
      .populate('client', 'name email phone') // Populate con información básica del cliente
      .populate('transporter', 'name email phone'); // Populate con información básica del transportador
    res.status(200).json({ shipments: shipments.map(shipment => ({ shipment })) });
  } catch (err) {
    console.error('Error al obtener envíos:', err);
    res.status(500).json({ message: 'Error al obtener envíos', error: err.message });
  }
};

// Obtener envíos del usuario específico (cliente o transportador)
export const getUserShipments = async (req, res) => {
  try {
    const userId = req.user.id; // Obtener el ID del usuario desde los parámetros de la URL
    const shipments = await Shipment.find({
      $or: [{ client: userId }, { transporter: userId }], // Busca envíos donde el usuario sea cliente o transportador
    })
      .populate('client', 'name email phone') // Populate con información básica del cliente
      .populate('transporter', 'name email phone'); // Populate con información básica del transportador

    if (!shipments || shipments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron envíos para este usuario' });
    }
    res.status(200).json({ shipments: shipments.map(shipment => ({ shipment })) });
  } catch (err) {
    console.error('Error al obtener envíos del usuario:', err);
    res.status(500).json({ message: 'Error al obtener envíos del usuario', error: err.message });
  }
};

export const getAvailableShipments = async (req, res) => {
  try{
    const shipments = await Shipment.find({ status: 'activated' })
    .populate('client', 'name email phone') // Populate con información básica del cliente
    .populate('transporter', 'name email phone'); // Populate con información básica del transportador;

    if (!shipments || shipments.length === 0){
      return res.status(404).json({ message: 'No se encontraron envíos disponibles' });
    }
    res.status(200).json({ shipments })
  } catch (err) {
    console.error('Error al obtener envíos disponibles:', err);
    res.status(500).json({ message: 'Error al obtener envíos disponibles', error: err.message });
  }
};

export const getShipment = async (req, res) => {
  try {
    const shipmentId = req.params.id; // Obtener el ID del usuario desde los parámetros de la URL
    const shipment = await Shipment.findById(shipmentId)/*.select('-password')*/; // Excluir la contraseña
    if (!shipment) {
      return res.status(404).json({ message: 'Flete no encontrado' });
    }
    res.status(200).json({ shipment });
  } catch (err) {
    console.error('Error al obtener flete:', err);
    res.status(500).json({ message: 'Error al obtener flete', error: err.message });
  }
};

// Crear un nuevo envío
export const createShipment = async (req, res) => {
  try {
    const { imageUrl, pickupAddress, deliveryAddress, description, title, weight, dimensions, pickupTime } = req.body;
    const userId = req.user.id; // Obtener el ID del usuario desde el token (usando authMiddleware)

    const cost = await calculateCost(pickupAddress, deliveryAddress); // Calcular el costo del envío

    // Crear un nuevo envío
    const newShipment = new Shipment({
      imageUrl,
      pickupAddress,
      deliveryAddress,
      description,
      title,
      weight,
      dimensions,
      pickupTime,
      cost,
      client: userId, // Asignar el cliente que crea el envío
    });
    await newShipment.save();

    // Respuesta exitosa
    res.status(201).json({ message: 'Envío creado exitosamente', shipment: newShipment });
  } catch (err) {
    console.error('Error al crear un envío:', err);
    res.status(400).json({ message: err.message });
  }
};

// Actualizar un envío (por ejemplo, asignar un transportador o cambiar el estado)
export const updateShipment = async (req, res) => {
  try {
    const shipmentId = req.params.id; // Obtener el ID del envío desde los parámetros de la URL
    const updateData = req.body; // Datos para actualizar

    // Verificar si el envío existe
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({ message: 'Envío no encontrado' });
    }

    // Actualizar el envío
    const updatedShipment = await Shipment.findByIdAndUpdate(shipmentId, updateData, { new: true })
      .populate('client', 'name email phone') // Populate con información básica del cliente
      .populate('transporter', 'name email phone'); // Populate con información básica del transportador

    res.status(200).json({ message: 'Envío actualizado exitosamente', updatedShipment });
  } catch (err) {
    console.error('Error al actualizar el envío:', err);
    res.status(500).json({ message: 'Error al actualizar el envío', error: err.message });
  }
};

// Eliminar un envío
export const deleteShipment = async (req, res) => {
  try {
    const shipmentId = req.params.id; // Obtener el ID del envío desde los parámetros de la URL

    // Verificar si el envío existe
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({ message: 'Envío no encontrado' });
    }

    // Eliminar el envío
    await Shipment.findByIdAndDelete(shipmentId);
    res.status(200).json({ message: 'Envío eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar el envío:', err);
    res.status(500).json({ message: 'Error al eliminar el envío', error: err.message });
  }
};

// Función para calcular el costo del envío (simulada)
const calculateCost = async (pickupAddress, deliveryAddress) => {
  // Aquí puedes implementar la lógica para calcular el costo basado en la distancia, tipo de vehículo, etc.
  // Por ahora, devolvemos un valor fijo.
  return 2000;
};