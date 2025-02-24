const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send('Error al obtener usuarios');
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, lastname, email, phone, role, password } = req.body;

    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Hashea la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea un nuevo usuario
    const newUser = new User({ name, lastname, email, phone, role, password: hashedPassword });
    await newUser.save();

    // Respuesta exitosa
    res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ message: 'Error al crear usuario', error: err.message });
  }
};