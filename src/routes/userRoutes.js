const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateUserUpdate } = require('../validators/userValidator');
const validateRequest = require('../middlewares/validateRequest');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(['admin']), userController.getUsers);   // Obtener todos los usuarios (Admin)

router.get('/role', authMiddleware, userController.getRoleUser);

router.get('/profile', authMiddleware, userController.getCurrentUser);     // Obtener el usuario propio (usuario)

router.get('/:id', authMiddleware, roleMiddleware(['admin']), userController.getUser);     // Obtener un usuario (Admin)

router.post('/', authMiddleware, roleMiddleware(['admin']), validateRequest(validateUser), userController.createUser);    // Crear un usuario (Admin)

router.put('/profile',  authMiddleware, validateRequest(validateUserUpdate), userController.updateCurrentUser);      // Actualizar el usuario propio (usuario)
router.put('/:id', authMiddleware, validateRequest(validateUserUpdate), roleMiddleware(['admin']), userController.updateUser);     // Actualizar un usuario (Admin)
router.delete('/profile', authMiddleware, userController.deleteCurrentUser);    // Borrar su propio usuario (usuario)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), userController.deleteUser);    // Borrar un usuario (Admin)


module.exports = router;