const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/userController');
const { validateUser } = require('../validators/userValidator');
const validateRequest = require('../middlewares/validateRequest');

router.get('/', getUsers);
router.post('/', validateRequest(validateUser), createUser);

module.exports = router;