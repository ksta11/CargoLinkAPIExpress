import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateUser, validateUserUpdate } from '../validators/userValidator.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = express.Router();

// Registrar un nuevo usuario
router.post('/register', validateRequest(validateUser), register); // Crear usuario y token (Cualquiera)

// Iniciar sesión
router.post('/login', login); // Crear token (Cualquiera)

export default router;