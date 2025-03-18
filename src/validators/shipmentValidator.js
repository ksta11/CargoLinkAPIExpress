import { body } from 'express-validator';

// Validaciones para crear un envío
export const validateShipment = [
  body('imageUrl')
    .notEmpty().withMessage('La dirección de la imagen es requerida'),

  body('pickupAddress')
    .notEmpty().withMessage('La dirección de recogida es requerida')
    .trim()
    .isLength({ min: 5, max: 100 }).withMessage('La dirección de recogida debe tener entre 5 y 100 caracteres'),

  body('deliveryAddress')
    .notEmpty().withMessage('La dirección de entrega es requerida')
    .trim()
    .isLength({ min: 5, max: 100 }).withMessage('La dirección de entrega debe tener entre 5 y 100 caracteres'),

  body('description')
    .optional()
    .notEmpty().withMessage('La descripción de la carga es requerida')
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('La descripción debe tener entre 5 y 200 caracteres'),

    body('title')
        .notEmpty().withMessage('El titulo de la carga es requerida')
        .trim()
        .isLength({ min: 5, max: 25 }).withMessage('El titulo debe tener entre 5 y 25 caracteres'),

  body('weight')
    .notEmpty().withMessage('El peso de la carga es requerido')
    .isFloat({ min: 0.1 }).withMessage('El peso debe ser un número mayor que 0'),

  body('dimensions.height')
    .notEmpty().withMessage('La altura de la carga es requerida')
    .isFloat({ min: 0.1 }).withMessage('La altura debe ser un número mayor que 0'),

  body('dimensions.width')
    .notEmpty().withMessage('El ancho de la carga es requerido')
    .isFloat({ min: 0.1 }).withMessage('El ancho debe ser un número mayor que 0'),

  body('dimensions.length')
    .notEmpty().withMessage('El largo de la carga es requerido')
    .isFloat({ min: 0.1 }).withMessage('El largo debe ser un número mayor que 0'),

  body('pickupTime')
    .optional()
    .notEmpty().withMessage('La fecha y hora de recogida son requeridas')
    .isISO8601().withMessage('La fecha y hora deben tener un formato válido (ISO 8601)'),

  // body('cost')
  //   .notEmpty().withMessage('El costo del envío es requerido')
  //   .isFloat({ min: 0 }).withMessage('El costo debe ser un número mayor o igual a 0'),

  body('status')
    .optional() // El estado es opcional al crear un envío
    .isIn(['pending', 'accepted', 'in_transit', 'delivered', 'cancelled']).withMessage('Estado no válido'),
];

// Validaciones para actualizar un envío
export const validateShipmentUpdate = [
  body('pickupAddress')
    .optional() // La dirección de recogida es opcional al actualizar
    .trim()
    .isLength({ min: 5, max: 100 }).withMessage('La dirección de recogida debe tener entre 5 y 100 caracteres'),

  body('deliveryAddress')
    .optional() // La dirección de entrega es opcional al actualizar
    .trim()
    .isLength({ min: 5, max: 100 }).withMessage('La dirección de entrega debe tener entre 5 y 100 caracteres'),

  body('description')
    .optional() // La descripción es opcional al actualizar
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('La descripción debe tener entre 5 y 200 caracteres'),

    body('title')
    .optional() // La titulo es opcional al actualizar
    .trim()
    .isLength({ min: 5, max: 25 }).withMessage('El titulo debe tener entre 5 y 25 caracteres'),

  body('weight')
    .optional() // El peso es opcional al actualizar
    .isFloat({ min: 0.1 }).withMessage('El peso debe ser un número mayor que 0'),

  body('dimensions.height')
    .optional() // La altura es opcional al actualizar
    .isFloat({ min: 0.1 }).withMessage('La altura debe ser un número mayor que 0'),

  body('dimensions.width')
    .optional() // El ancho es opcional al actualizar
    .isFloat({ min: 0.1 }).withMessage('El ancho debe ser un número mayor que 0'),

  body('dimensions.length')
    .optional() // El largo es opcional al actualizar
    .isFloat({ min: 0.1 }).withMessage('El largo debe ser un número mayor que 0'),

  body('pickupTime')
    .optional() // La fecha y hora de recogida son opcionales al actualizar
    .isISO8601().withMessage('La fecha y hora deben tener un formato válido (ISO 8601)'),

  body('cost')
    .optional() // El costo es opcional al actualizar
    .isFloat({ min: 0 }).withMessage('El costo debe ser un número mayor o igual a 0'),

  body('status')
    .optional() // El estado es opcional al actualizar
    .isIn(['pending', 'activated', 'accepted', 'in_transit', 'delivered', 'cancelled']).withMessage('Estado no válido'),

  body('transporter')
    .optional() // El transportador es opcional al actualizar
    .isMongoId().withMessage('El ID del transportador no es válido'),
];