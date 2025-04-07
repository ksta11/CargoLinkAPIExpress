import User from '../models/User.js';
import { createDUser } from '../services/userService.js';
import bcrypt from 'bcryptjs';
import Shipment from '../models/Shipment.js';
import Report from '../models/Report.js';
import { query } from 'express-validator';
import mongoose, { Mongoose } from 'mongoose';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users: users.map(user => ({ user })) });
  } catch (err) {
    res.status(500).send('Error al obtener usuarios');
  }
};

export const getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().select('-password');
    res.status(200).json({ shipments: shipments.map(shipment => ({ shipment })) });
  } catch (err) {
    res.status(500).send('Error al obtener envios');
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id; // Obtener el ID del usuario desde los parámetros de la URL
    const user = await User.findById(userId).select('-password'); // Excluir la contraseña
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).json({ message: 'Error al obtener usuario', error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, lastname, email, phone, role, password } = req.body;

    // Crear el usuario usando la función reutilizable
    const newUser = await createDUser({ name, lastname, email, phone, role, password });

    // Respuesta exitosa con datos directamente
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: newUser
    });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(400).json({ message: err.message });
  }
};

// Actualizar un usuario por ID (solo para administradores)
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // Obtener el ID del usuario desde los parámetros de la URL
    const { name, lastname, email, phone, role, password } = req.body;

    // Buscar el usuario por ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar los campos proporcionados
    if (name) user.name = name;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (password) {
      // Hashear la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Guardar los cambios
    await user.save();

    // Respuesta exitosa
    res.status(200).json({ message: 'Usuario actualizado exitosamente', user });
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ message: 'Error al actualizar usuario', error: err.message });
  }
};

// Eliminar un usuario por ID (solo para administradores)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Obtener el ID del usuario desde los parámetros de la URL

    // Buscar y eliminar el usuario por ID
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Respuesta exitosa
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ message: 'Error al eliminar usuario', error: err.message });
  }
};

// Buscar usuarios por término
export const searchUsers = async (req, res) => {
  try {
    const { term } = req.query;

    const users = await User.find({
      $or: [
        { name: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } },
        { lastname: { $regex: term, $options: 'i' } },
      ],
    }).select('-password');

    res.status(200).json({ users: users.map(user => ({ user })) });
  } catch (err) {
    console.error('Error al buscar usuarios:', err);
    res.status(500).json({ message: 'Error al buscar usuarios', error: err.message });
  }
};

export const searchShipment = async (req, res) => {
  try {
    const { term } = req.query;
    // const { term, userId } = req.query;

    const shipments = await Shipment.find({
      $or: [
        { title: { $regex: term, $options: 'i' } }, 
        { description: { $regex: term, $options: 'i' } },     
      ],
    });

    // Filtrado por usuario (cliente)
    // if (userId) {
    //   query.client = new mongoose.Types.ObjectId(userId);
    // }


    res.status(200).json({ shipments: shipments.map(shipment => ({ shipment })) });
    
  } catch (err) {
    console.error('Error al buscar envíos:', err);
    res.status(500).json({ message: 'Error al buscar envíos', error: err.message });
  }
};

export const getGeneralStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalShipments = await Shipment.countDocuments();
    const totalReports = await Report.countDocuments();

    res.status(200).json({
      totalUsers,
      totalShipments,
      totalReports,
    });
  } catch (err) {
    console.error('Error al obtener estadísticas generales:', err);
    res.status(500).json({ message: 'Error al obtener estadísticas generales', error: err.message });
  }
};