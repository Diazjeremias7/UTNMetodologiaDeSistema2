import { Router } from 'express';
import ReservationController from '../controllers/ReservationController';
import auth from '../middleware/auth';

const router = Router();

// Crear reserva requiere estar autenticado
router.post('/', auth, ReservationController.create);
router.get('/', ReservationController.getAll);
router.get('/availability', ReservationController.getAvailability);
router.get('/user/:userId', ReservationController.getByUser);
router.patch('/:id/cancel', ReservationController.cancel);
router.delete('/:id', ReservationController.delete);

export default router;