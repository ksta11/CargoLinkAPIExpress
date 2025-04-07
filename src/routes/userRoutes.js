import express from 'express';
import { createUser, 
    getCurrentUser, 
    getRoleUser, 
    getUser, 
    getUserWithVehicles, 
    getUsers, 
    updateCurrentUser, 
    updateUser, 
    deleteCurrentUser, 
    deleteUser, 
    verifyPassword,
    changePassword} from '../controllers/userController.js';
import { validateUser, validateUserUpdate } from '../validators/userValidator.js';
import validateRequest from '../middlewares/validateRequest.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/role', authMiddleware, getRoleUser);

router.get('/profile', authMiddleware, getCurrentUser);     // Obtener el usuario propio (usuario)

router.put('/profile',  authMiddleware, validateRequest(validateUserUpdate), updateCurrentUser);

router.put('/change-password', authMiddleware, changePassword); // Cambiar la contraseña del usuario propio (usuario)      // Actualizar el usuario propio (usuario)

router.delete('/profile', authMiddleware, deleteCurrentUser);    // Borrar su propio usuario (usuario)

router.post('/verify-password', authMiddleware, verifyPassword)

export default router;