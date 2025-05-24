import Shipment from '../models/Shipment.js';

// Obtener todos los envíos (para administradores)
export const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find()
      .populate('client', 'name lastname email phone') // Populate con información completa del cliente
      .populate('transporter', 'name lastname email phone'); // Populate con información completa del transportador
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
      .populate('client', 'name lastname email phone') // Populate con información completa del cliente
      .populate('transporter', 'name lastname email phone'); // Populate con información completa del transportador

    if (!shipments || shipments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron envíos para este usuario' });
    }
    res.status(200).json({ shipments: shipments.map(shipment => ({ shipment })) });
  } catch (err) {
    console.error('Error al obtener envíos del usuario:', err);
    res.status(500).json({ message: 'Error al obtener envíos del usuario', error: err.message });
  }
};

// Obtener detalles de un envío específico para transportador
export const getShipmentDetailsForTransporter = async (req, res) => {
  try {
    const shipmentId = req.params.id;
    const transporterId = req.user.id;
    
    // Buscar el envío por ID
    const shipment = await Shipment.findById(shipmentId)
      .populate('client', 'name lastname email phone') // Información completa del cliente
      .populate('transporter', 'name lastname email phone'); // Información completa del transportador
    
    if (!shipment) {
      return res.status(404).json({ message: 'Envío no encontrado' });
    }
    
    // Verificar si el estado del envío es "activated" (disponible para transportadores)
    // O si el envío ya está asignado a este transportador
    if (shipment.status === 'activated' || 
        (shipment.transporter && shipment.transporter._id.toString() === transporterId)) {
      return res.status(200).json({ shipment });
    } else {
      return res.status(403).json({ 
        message: 'No tienes acceso a este envío o no está disponible para transportadores' 
      });
    }
  } catch (err) {
    console.error('Error al obtener detalles del envío:', err);
    res.status(500).json({ message: 'Error al obtener detalles del envío', error: err.message });
  }
};

// Aceptar un envío como transportador
export const acceptShipment = async (req, res) => {
  try {
    const shipmentId = req.params.id;
    const transporterId = req.user.id;
    
    // Buscar el envío por ID
    const shipment = await Shipment.findById(shipmentId);
    
    if (!shipment) {
      return res.status(404).json({ message: 'Envío no encontrado' });
    }
    
    // Verificar que el envío esté en estado "activated" y disponible para ser aceptado
    if (shipment.status !== 'activated') {
      return res.status(400).json({ 
        message: 'Este envío no está disponible para ser aceptado' 
      });
    }
    
    // Verificar que el envío no tenga ya un transportador asignado
    if (shipment.transporter) {
      return res.status(400).json({ 
        message: 'Este envío ya tiene un transportador asignado' 
      });
    }
    
    // Actualizar el envío: asignar transportador y cambiar estado
    shipment.transporter = transporterId;
    shipment.status = 'accepted';
    
    await shipment.save();
      // Obtener el envío actualizado con información del cliente y transportador
    const updatedShipment = await Shipment.findById(shipmentId)
      .populate('client', 'name lastname email phone')
      .populate('transporter', 'name lastname email phone');
    
    res.status(200).json({ 
      message: 'Envío aceptado exitosamente', 
      shipment: updatedShipment 
    });
  } catch (err) {
    console.error('Error al aceptar el envío:', err);
    res.status(500).json({ message: 'Error al aceptar el envío', error: err.message });
  }
};

export const getAvailableShipments = async (req, res) => {
  try{
    const shipments = await Shipment.find({ status: 'activated' })
    .populate('client', 'name lastname email phone') // Populate con información completa del cliente
    .populate('transporter', 'name lastname email phone'); // Populate con información completa del transportador;

    if (!shipments || shipments.length === 0){
      return res.status(404).json({ message: 'No se encontraron envíos disponibles' });
    }
    res.status(200).json({ shipments: shipments.map(shipment => ({ shipment })) })
  } catch (err) {
    console.error('Error al obtener envíos disponibles:', err);
    res.status(500).json({ message: 'Error al obtener envíos disponibles', error: err.message });
  }
};

export const getShipment = async (req, res) => {
  try {
    const shipmentId = req.params.id; // Obtener el ID del usuario desde los parámetros de la URL
    
    // Buscar el envío e incluir información detallada del cliente y transportador (si existe)
    const shipment = await Shipment.findById(shipmentId)
      .populate('client', 'name lastname email phone') // Información detallada del cliente
      .populate('transporter', 'name lastname email phone'); // Información detallada del transportador
    
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
    }    // Actualizar el envío
    const updatedShipment = await Shipment.findByIdAndUpdate(shipmentId, updateData, { new: true })
      .populate('client', 'name lastname email phone') // Populate con información completa del cliente
      .populate('transporter', 'name lastname email phone'); // Populate con información completa del transportador

    res.status(200).json({ message: 'Envío actualizado exitosamente', shipment: updatedShipment });
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

// Obtener envíos aceptados y en tránsito del transportador
export const getAcceptedShipmentsForTransporter = async (req, res) => {
  try {
    const transporterId = req.user.id; // Obtener el ID del transportador desde el token

    // Buscar envíos donde el usuario sea transportador y el estado sea 'accepted' o 'in_transit'
    const shipments = await Shipment.find({
      transporter: transporterId,
      status: { $in: ['accepted', 'in_transit'] }
    })
      .populate('client', 'name lastname email phone') // Información completa del cliente
      .populate('transporter', 'name lastname email phone'); // Información completa del transportador

    if (!shipments || shipments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron envíos aceptados o en tránsito para este transportador' });
    }
    
    res.status(200).json({ shipments: shipments.map(shipment => ({ shipment })) });
  } catch (err) {
    console.error('Error al obtener envíos aceptados/en tránsito del transportador:', err);
    res.status(500).json({ 
      message: 'Error al obtener envíos aceptados/en tránsito del transportador', 
      error: err.message 
    });
  }
};

// Confirmar la entrega de un envío
export const confirmDelivery = async (req, res) => {
  try {
    const shipmentId = req.params.id;
    const transporterId = req.user.id;
    
    // Buscar el envío por ID
    const shipment = await Shipment.findById(shipmentId);
    
    if (!shipment) {
      return res.status(404).json({ message: 'Envío no encontrado' });
    }
    
    // Verificar que el usuario sea el transportador asignado a este envío
    if (!shipment.transporter || shipment.transporter.toString() !== transporterId) {
      return res.status(403).json({ 
        message: 'No tienes permiso para confirmar la entrega de este envío' 
      });
    }
    
    // Verificar que el envío esté en estado "in_transit" o "accepted"
    if (shipment.status !== 'in_transit' && shipment.status !== 'accepted') {
      return res.status(400).json({ 
        message: 'Este envío no puede ser marcado como entregado porque no está en tránsito o aceptado' 
      });
    }
    
    // Actualizar el estado del envío a "delivered"
    shipment.status = 'delivered';
    
    await shipment.save();
    
    // Obtener el envío actualizado con información del cliente y transportador
    const updatedShipment = await Shipment.findById(shipmentId)
      .populate('client', 'name lastname email phone')
      .populate('transporter', 'name lastname email phone');
    
    res.status(200).json({ 
      message: 'Entrega confirmada exitosamente', 
      shipment: updatedShipment 
    });
  } catch (err) {
    console.error('Error al confirmar la entrega:', err);
    res.status(500).json({ message: 'Error al confirmar la entrega', error: err.message });
  }
};

// Marcar el envío como en tránsito
export const startTransit = async (req, res) => {
  try {
    const shipmentId = req.params.id;
    const transporterId = req.user.id;
    
    // Buscar el envío por ID
    const shipment = await Shipment.findById(shipmentId);
    
    if (!shipment) {
      return res.status(404).json({ message: 'Envío no encontrado' });
    }
    
    // Verificar que el usuario sea el transportador asignado a este envío
    if (!shipment.transporter || shipment.transporter.toString() !== transporterId) {
      return res.status(403).json({ 
        message: 'No tienes permiso para modificar el estado de este envío' 
      });
    }
    
    // Verificar que el envío esté en estado "accepted"
    if (shipment.status !== 'accepted') {
      return res.status(400).json({ 
        message: 'Este envío no puede ser marcado como en tránsito porque no ha sido aceptado' 
      });
    }
    
    // Actualizar el estado del envío a "in_transit"
    shipment.status = 'in_transit';
    
    await shipment.save();
    
    // Obtener el envío actualizado con información del cliente y transportador
    const updatedShipment = await Shipment.findById(shipmentId)
      .populate('client', 'name lastname email phone')
      .populate('transporter', 'name lastname email phone');
    
    res.status(200).json({ 
      message: 'Envío marcado como en tránsito exitosamente', 
      shipment: updatedShipment 
    });
  } catch (err) {
    console.error('Error al marcar el envío como en tránsito:', err);
    res.status(500).json({ message: 'Error al marcar el envío como en tránsito', error: err.message });
  }
};

// Función para calcular el costo del envío (simulada)
const calculateCost = async (pickupAddress, deliveryAddress) => {
  // Aquí puedes implementar la lógica para calcular el costo basado en la distancia, tipo de vehículo, etc.
  // Por ahora, devolvemos un valor fijo.
  return 2000;
};