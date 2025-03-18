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
    deleteUser } from '../controllers/userController.js';
import { validateUser, validateUserUpdate } from '../validators/userValidator.js';
import validateRequest from '../middlewares/validateRequest.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/role', authMiddleware, getRoleUser);

router.get('/profile', authMiddleware, getCurrentUser);     // Obtener el usuario propio (usuario)

router.put('/profile',  authMiddleware, validateRequest(validateUserUpdate), updateCurrentUser);      // Actualizar el usuario propio (usuario)

router.delete('/profile', authMiddleware, deleteCurrentUser);    // Borrar su propio usuario (usuario)


export default router;