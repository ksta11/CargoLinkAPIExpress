import User from '../models/User.js';

export const getUserWithVehicles = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('vehicles');
    res.status(200).json({ user: { ...user.toObject(), vehicles: user.vehicles.map(vehicle => ({ vehicle })) } });
  } catch (err) {
    console.error('Error al obtener usuario con vehículos:', err);
    res.status(500).json({ message: 'Error al obtener usuario con vehículos', error: err.message });
  }
};