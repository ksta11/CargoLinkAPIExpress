const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { createUser } = require('../services/userService');

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { name, lastname, email, phone, role, password } = req.body;

    // Crear el usuario usando la función reutilizable
    const newUser = await createUser({ name, lastname, email, phone, role, password });

    // Generar token JWT
    const token = generateToken(newUser._id, newUser.role);

    // Respuesta exitosa
    res.status(201).json({ message: 'Usuario registrado exitosamente', token, user: newUser });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(400).json({ message: err.message });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas correo' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales inválidas contraseña' });
    }

    // Generar token JWT
    const token = generateToken(user._id, user.role);

    // Respuesta exitosa
    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
};