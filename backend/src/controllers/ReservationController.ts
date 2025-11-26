import { Request, Response } from 'express';
import ReservationService from '../services/ReservationService';

class ReservationController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      // Si el middleware auth estableció userId, usarla y evitar que el cliente envie otro userId
      const userIdFromToken = (req as any).userId;
      if (userIdFromToken) req.body.userId = userIdFromToken;
      const reservation = await ReservationService.createReservation(req.body);
      res.status(201).json({
        success: true,
        data: reservation,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const reservations = await ReservationService.getAllReservations();
      res.json({
        success: true,
        data: reservations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener reservas',
      });
    }
  }

  async getByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const reservations = await ReservationService.getReservationsByUser(
        userId
      );
      res.json({
        success: true,
        data: reservations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener reservas',
      });
    }
  }

  async cancel(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await ReservationService.cancelReservation(id);
      res.json({
        success: true,
        message: 'Reserva cancelada',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al cancelar reserva',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await ReservationService.deleteReservation(id);
      res.json({
        success: true,
        message: 'Reserva eliminada',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al eliminar reserva',
      });
    }
  }
}

export default new ReservationController();