import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const createDUser = async (userData) => {
  try {
    const { name, lastname, email, phone, role, password } = userData;

    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('El correo electrónico ya está registrado');
    }

    // AGREGAR VALIDACION PARA TELOFONO UNICO

    // Hashea la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea un nuevo usuario
    const newUser = new User({ name, lastname, email, phone, role, password: hashedPassword });
    await newUser.save();

    return newUser;
  } catch (err) {
    throw new Error(err.message);
  }
};