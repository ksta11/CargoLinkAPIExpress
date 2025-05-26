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
    const shipments = await Shipment.find()
      .populate('client', 'name lastname email phone') // Populate con información completa del cliente
      .populate('transporter', 'name lastname email phone'); // Populate con información completa del transportador
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
    })
    .populate('client', 'name lastname email phone') // Populate con información completa del cliente
    .populate('transporter', 'name lastname email phone'); // Populate con información completa del transportador

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

export const getStatistics = async (req, res) => {
  try {
    // Obtener totales generales
    const totalUsers = await User.countDocuments();
    const totalShipments = await Shipment.countDocuments();
    const totalReports = await Report.countDocuments();

    // Calcular los últimos 6 meses
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

    // Generar array de fechas para los últimos 6 meses
    const monthsData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      
      const nextMonth = new Date(date);
      nextMonth.setMonth(date.getMonth() + 1);
      
      monthsData.push({
        date,
        nextMonth,
        label: date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
      });
    }

    // Obtener estadísticas mensuales de usuarios
    const userStats = await Promise.all(
      monthsData.map(async (month) => {
        return await User.countDocuments({
          createdAt: {
            $gte: month.date,
            $lt: month.nextMonth
          }
        });
      })
    );

    // Obtener estadísticas mensuales de envíos
    const shipmentStats = await Promise.all(
      monthsData.map(async (month) => {
        return await Shipment.countDocuments({
          createdAt: {
            $gte: month.date,
            $lt: month.nextMonth
          }
        });
      })
    );

    // Obtener estadísticas mensuales de reportes
    const reportStats = await Promise.all(
      monthsData.map(async (month) => {
        return await Report.countDocuments({
          createdAt: {
            $gte: month.date,
            $lt: month.nextMonth
          }
        });
      })
    );

    // Preparar labels de meses en español
    const monthLabels = monthsData.map(month => month.label);

    res.status(200).json({
      totals: {
        users: totalUsers,
        shipments: totalShipments,
        reports: totalReports
      },
      monthly: {
        labels: monthLabels,
        users: userStats,
        shipments: shipmentStats,
        reports: reportStats
      }
    });
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
    res.status(500).json({ 
      message: 'Error al obtener estadísticas', 
      error: err.message 
    });
  }
};