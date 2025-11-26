import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.post('/', UserController.create);
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.delete('/:id', UserController.delete);
// Login: /api/users/login
router.post('/login', UserController.login);

export default router;