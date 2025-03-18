import User from '../models/User.js';
import { createDUser } from '../services/userService.js';
import bcrypt from 'bcryptjs';


export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send('Error al obtener usuarios');
  }
};

// Obtener la lista de todos los usuarios (solo para administradores)
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('-password'); // Excluir contraseñas
//     res.status(200).json({ users });
//   } catch (err) {
//     console.error('Error al obtener usuarios:', err);
//     res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
//   }
// };

export const createUser = async (req, res) => {
  try {
    const { name, lastname, email, phone, role, password } = req.body;

    // Crear el usuario usando la función reutilizable
    const newUser = await createDUser({ name, lastname, email, phone, role, password });

    // Respuesta exitosa
    res.status(201).json({ message: 'Usuario creado exitosamente', newUser });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(400).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id; // Obtener el ID del usuario desde los parámetros de la URL
    const user = await User.findById(userId)/*.select('-password')*/; // Excluir la contraseña
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).json({ message: 'Error al obtener usuario', error: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // Obtener el ID del usuario desde req.user
    const user = await User.findById(userId)/*.select('-password')*/; // Excluir la contraseña
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).json({ message: 'Error al obtener usuario', error: err.message });
  }
};

export const getRoleUser = async (req, res) => {
  try {
    const role = req.user.role; // Obtener el rol del del usuario desde req.user

    res.status(200).json({ role });
  } catch (err) {
    console.error('Error al obtener el rol:', err);
    res.status(500).json({ message: 'Error al obtener el rol', error: err.message });
  }
};

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

// Actualizar un usuario
export const updateCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // Obtener el ID del usuario desde req.user
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

// Eliminar un usuario
export const deleteCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // Obtener el ID del usuario desde req.user

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
