const { body } = require('express-validator');

// Validaciones para crear un usuario
const validateUser = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('lastname').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  body('phone').notEmpty().withMessage('El nombre es requerido'),
  body('role').notEmpty().withMessage('El nombre es requerido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

// Validaciones para actualizar un usuario
const validateUserUpdate = [
  body('name').optional().notEmpty().withMessage('El nombre es requerido'),
  body('email').optional().isEmail().withMessage('El correo electrónico no es válido'),
  body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

module.exports = { validateUser, validateUserUpdate };