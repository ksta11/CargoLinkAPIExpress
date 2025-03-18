import User from '../models/User.js';
import { createDUser } from '../services/userService.js';
import bcrypt from 'bcryptjs';

export const getUserWithVehicles = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener el usuario y sus vehículos
    const user = await User.findById(userId).populate('vehicles');

    // Respuesta exitosa
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error al obtener usuario con vehículos:', err);
    res.status(500).json({ message: 'Error al obtener usuario con vehículos', error: err.message });
  }
};