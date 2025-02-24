const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateUser, validateUserUpdate } = require('../validators/userValidator');
const validateRequest = require('../middlewares/validateRequest');

// Registrar un nuevo usuario
router.post('/register', validateRequest(validateUser), register); // Crear usuario y token (Cualquiera)

// Iniciar sesión
router.post('/login', login); // Crear token (Cualquiera)

module.exports = router;