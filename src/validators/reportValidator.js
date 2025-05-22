import { body } from 'express-validator';

// Validaciones para crear un reporte
export const validateReport = [
  body('title')
    .notEmpty().withMessage('El título es requerido')
    .trim()
    .isLength({ min: 5, max: 100 }).withMessage('El título debe tener entre 5 y 100 caracteres'),

  body('description')
    .notEmpty().withMessage('La descripción es requerida')
    .trim()
    .isLength({ min: 10, max: 500 }).withMessage('La descripción debe tener entre 10 y 500 caracteres'),

  body('category')
    .notEmpty().withMessage('La categoría es requerida')
    .trim(),
    
  body('reportingUserType')
    .notEmpty().withMessage('El tipo de usuario que reporta es requerido')
    .isIn(['User', 'Transporter']).withMessage('Tipo de usuario inválido'),
    
  body('reportedUserType')
    .optional()
    .isIn(['User', 'Transporter']).withMessage('Tipo de usuario inválido'),
    
  body('reportedShipment')
    .optional()
    .isMongoId().withMessage('ID de envío inválido'),
];

// Validaciones para actualizar un reporte
export const validateReportUpdate = [
  body('status')
    .notEmpty().withMessage('El estado es requerido')
    .isIn(['pending', 'resolved', 'closed']).withMessage('Estado inválido'),
    
  body('solutionExplanation')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 }).withMessage('La explicación debe tener entre 10 y 500 caracteres'),
];
