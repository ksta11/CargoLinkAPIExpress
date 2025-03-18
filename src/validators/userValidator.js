import { body } from 'express-validator';

// Validaciones para crear un usuario
export const validateUser = [
  body('name')
    .notEmpty().withMessage('El nombre es requerido')
    .trim()
    .isLength({ min: 2, max: 40 }).withMessage('El nombre debe tener al menos 2 y maximo 40 caracteres'),

  body('lastname')
    .notEmpty().withMessage('El apellido es requerido')
    .trim()
    .isLength({ min: 2, max: 40 }).withMessage('El apellido debe tener al menos 2 y maximo 40 caracteres'),

  body('email').isEmail().withMessage('El correo electrónico no es válido')
    .normalizeEmail(),

  // body('phone')
  //   .notEmpty().withMessage('El telefono es requerido')
  //   .matches(/^[0-9]+$/).withMessage('El teléfono solo debe contener números')
  //   .trim()
  //   .isLength({ min: 7, max: 15 }).withMessage('El numero debe tener al menos 7 y maximo 15 caracteres'),

  body('role')
  .notEmpty().withMessage('El rol es requerido')
  .isIn(['user', 'admin', 'transporter']).withMessage('Rol no válido'),

  body('password')
    .isLength({ min: 5, max: 30 }).withMessage('La contraseña debe tener al menos 5 y maximo 30 caracteres')
    .trim(),
];

// Validaciones para actualizar un usuario
export const validateUserUpdate = [
  body('name')
    .notEmpty().withMessage('El nombre es requerido')
    .trim()
    .isLength({ min: 2, max: 40 }).withMessage('El nombre debe tener al menos 2 y maximo 40 caracteres'),

  body('lastname')
    .notEmpty().withMessage('El apellido es requerido')
    .trim()
    .isLength({ min: 2, max: 40 }).withMessage('El apellido debe tener al menos 2 y maximo 40 caracteres'),

  body('email').isEmail().withMessage('El correo electrónico no es válido')
    .normalizeEmail(),

  body('phone')
    .notEmpty().withMessage('El telefono es requerido')
    .matches(/^[0-9]+$/).withMessage('El teléfono solo debe contener números')
    .trim()
    .isLength({ min: 7, max: 15 }).withMessage('El numero debe tener al menos 7 y maximo 15 caracteres'),

  body('role')
  .notEmpty().withMessage('El rol es requerido')
  .isIn(['user', 'admin', 'transporter']).withMessage('Rol no válido'),

  body('password')
    .isLength({ min: 5, max: 30 }).withMessage('La contraseña debe tener al menos 5 y maximo 30 caracteres')
    .trim(),
];
