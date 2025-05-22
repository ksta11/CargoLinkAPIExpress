import express from 'express';
import { 
    getAllReports, 
    getReportById, 
    createReport, 
    updateReport, 
    deleteReport,
    getUserReports
} from '../controllers/ReportController.js';
import { validateReport, validateReportUpdate } from '../validators/reportValidator.js';
import validateRequest from '../middlewares/validateRequest.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Rutas para administradores (obtener todos, actualizar estado, eliminar)
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllReports);
router.get('/me', authMiddleware, getUserReports); // Nueva ruta para reportes del usuario autenticado
router.get('/:id', authMiddleware, getReportById);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), validateRequest(validateReportUpdate), updateReport);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteReport);

// Rutas para usuarios (crear reportes)
// Cualquier usuario autenticado puede crear reportes
router.post('/', authMiddleware, validateRequest(validateReport), createReport);

export default router;
