const User = require('../models/User');
const { createUser } = require('../services/userService');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send('Error al obtener usuarios');
  }
};

// Obtener la lista de todos los usuarios (solo para administradores)
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('-password'); // Excluir contraseñas
//     res.status(200).json({ users });
//   } catch (err) {
//     console.error('Error al obtener usuarios:', err);
//     res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
//   }
// };

exports.createUser = async (req, res) => {
  try {
    const { name, lastname, email, phone, role, password } = req.body;

    // Crear el usuario usando la función reutilizable
    const newUser = await createUser({ name, lastname, email, phone, role, password });

    // Respuesta exitosa
    res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(400).json({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
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

exports.getCurrentUser = async (req, res) => {
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

exports.getRoleUser = async (req, res) => {
  try {
    const role = req.user.role; // Obtener el rol del del usuario desde req.user

    res.status(200).json({ role });
  } catch (err) {
    console.error('Error al obtener el rol:', err);
    res.status(500).json({ message: 'Error al obtener el rol', error: err.message });
  }
};

exports.getUserWithVehicles = async (req, res) => {
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
exports.updateCurrentUser = async (req, res) => {
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
exports.updateUser = async (req, res) => {
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
exports.deleteCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // Obtener el ID del usuario desde req.user

    // Buscar y eliminar el usuario por ID
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Respuesta exitosa
    res.status(200).json({ message: 'Usuario eliminado exitosamente', user: deletedUser });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ message: 'Error al eliminar usuario', error: err.message });
  }
};

// Eliminar un usuario por ID (solo para administradores)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Obtener el ID del usuario desde los parámetros de la URL

    // Buscar y eliminar el usuario por ID
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Respuesta exitosa
    res.status(200).json({ message: 'Usuario eliminado exitosamente', user: deletedUser });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ message: 'Error al eliminar usuario', error: err.message });
  }
};