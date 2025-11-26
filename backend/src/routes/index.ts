import { Router } from 'express';
import usersRoutes from './users.routes';
import reservationsRoutes from './reservations.routes';

const router = Router();

// Rutas de usuarios
router.use('/users', usersRoutes);

// Rutas de reservas
router.use('/reservations', reservationsRoutes);

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({
    message: 'API de Reservas de Canchas',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      reservations: '/api/reservations',
    },
  });
});

export default router;