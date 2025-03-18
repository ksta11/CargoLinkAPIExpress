import Vehicle from '../models/Vehicle.js';

export const createVehicle = async (req, res) => {
    try {
      const { brand, model, year, plate } = req.body;
      const userId = req.user.id; // Obtener el ID del usuario desde el token (usando authMiddleware)
  
      // Crear un nuevo vehículo asociado al usuario
      const newVehicle = new Vehicle({ brand, model, year, plate, user: userId });
      await newVehicle.save();
  
      // Respuesta exitosa
      res.status(201).json({ message: 'Vehículo creado exitosamente', vehicle: newVehicle });
    } catch (err) {
      console.error('Error al crear vehículo:', err);
      res.status(500).json({ message: 'Error al crear vehículo', error: err.message });
    }
};

export const getUserVehicles = async (req, res) => {
    try {
      const userId = req.user.id; // Obtener el ID del usuario desde el token
  
      // Buscar los vehículos asociados al usuario
      const vehicles = await Vehicle.find({ user: userId });
  
      // Respuesta exitosa
      res.status(200).json({ vehicles });
    } catch (err) {
      console.error('Error al obtener vehículos:', err);
      res.status(500).json({ message: 'Error al obtener vehículos', error: err.message });
    }
};