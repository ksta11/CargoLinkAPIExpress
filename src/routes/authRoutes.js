import express from 'express';
import { register, login, refreshToken } from '../controllers/authController.js';
import { validateUser, validateUserUpdate } from '../validators/userValidator.js';
import validateRequest from '../middlewares/validateRequest.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Registrar un nuevo usuario
router.post('/register', validateRequest(validateUser), register); // Crear usuario y token (Cualquiera)

// Iniciar sesión
router.post('/login', login); // Crear token (Cualquiera)

// Refrescar Token
router.post('/refresh-token', authMiddleware, refreshToken);
export default router;