import { Router } from 'express';
import ReservationController from '../controllers/ReservationController';

const router = Router();

router.post('/', ReservationController.create);
router.get('/', ReservationController.getAll);
router.get('/user/:userId', ReservationController.getByUser);
router.patch('/:id/cancel', ReservationController.cancel);
router.delete('/:id', ReservationController.delete);

export default router;