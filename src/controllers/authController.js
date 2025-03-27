import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import { createDUser } from '../services/userService.js';
import jwt from 'jsonwebtoken';

// Registrar un nuevo usuario
export const register = async (req, res) => {
  try {
    const { name, lastname, email, phone, role, password } = req.body;

    // Crear el usuario usando la función reutilizable
    const newUser = await createDUser({ name, lastname, email, phone, role, password });

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
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
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

// Refrescar token
export const refreshToken = async (req, res) => {
  try {
    // Generar un nuevo token usando los datos del usuario en req.user
    
    const userId = req.user.id;
    const role = req.user.id;
    const newToken = generateToken(userId, role);

    // Respuesta exitosa con el nuevo token
    res.status(200).json({ message: 'Token refrescado exitosamente', token });
  } catch (err) {
    console.error('Error al refrescar token:', err);
    res.status(500).json({ message: 'Error al refrescar token', error: err.message });
  }
};