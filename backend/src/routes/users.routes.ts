import { Router } from 'express';
import UserController from '../controllers/UserController';
import auth from '../middleware/auth';

const router = Router();


router.post('/register', UserController.create);
router.post('/', UserController.create);
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.patch('/:id/phone', auth, UserController.updatePhone);
router.delete('/:id', UserController.delete);
// Login: /api/users/login
router.post('/login', UserController.login);

export default router;