import express from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser, searchUsers, getGeneralStats } from '../controllers/adminController.js';
import { validateUser, validateUserUpdate } from '../validators/userValidator.js';
import validateRequest from '../middlewares/validateRequest.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['admin']), getUsers);   // Obtener todos los usuarios (Admin)

router.get('/search', authMiddleware, roleMiddleware(['admin']), searchUsers);

router.get('/stats', authMiddleware, roleMiddleware(['admin']), getGeneralStats); // Obtener estadísticas generales (Admin)

router.get('/:id', authMiddleware, roleMiddleware(['admin']), getUser);     // Obtener un usuario (Admin)

router.post('/', authMiddleware, roleMiddleware(['admin']), validateRequest(validateUser), createUser);    // Crear un usuario (Admin)

router.put('/:id', authMiddleware, validateRequest(validateUserUpdate), roleMiddleware(['admin']), updateUser);     // Actualizar un usuario (Admin)

router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);    // Borrar un usuario (Admin)

export default router;