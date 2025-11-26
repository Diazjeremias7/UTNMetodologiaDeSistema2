import Database from '../config/database';
import {
  BasicReservation,
  LightingDecorator,
  RefereeDecorator,
  BallsDecorator,
  IReservation,
} from '../models/Reservation';
import { CreateReservationDTO, ReservationDTO } from '../types';

class ReservationService {
  private db = Database.getInstance();

  async createReservation(data: CreateReservationDTO): Promise<ReservationDTO> {
    const { userId, date, timeSlot, services } = data;

    // Crear reserva básica
    let reservation: IReservation = new BasicReservation(
      userId,
      date,
      timeSlot
    );

    // Aplicar decoradores según servicios solicitados
    services.forEach((service) => {
      switch (service.toLowerCase()) {
        case 'iluminación':
        case 'luz':
          reservation = new LightingDecorator(reservation);
          break;
        case 'árbitro':
        case 'referee':
          reservation = new RefereeDecorator(reservation);
          break;
        case 'pelotas':
        case 'balls':
          reservation = new BallsDecorator(reservation);
          break;
      }
    });

    // Guardar en base de datos
    const resData = reservation.toJSON();
    await this.db.run(
      `INSERT INTO reservations 
       (user_id, date, time_slot, base_price, total_price, services, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        resData.userId,
        resData.date,
        resData.timeSlot,
        resData.basePrice,
        resData.totalPrice,
        JSON.stringify(resData.services),
        resData.status,
      ]
    );

    // Obtener la reserva creada
    const created = await this.db.get<ReservationDTO>(
      'SELECT * FROM reservations WHERE user_id = ? AND date = ? AND time_slot = ? ORDER BY id DESC LIMIT 1',
      [userId, date, timeSlot]
    );

    if (!created) {
      throw new Error('Error al crear reserva');
    }

    return created;
  }

  async getReservationsByUser(userId: number): Promise<ReservationDTO[]> {
    return this.db.all<ReservationDTO>(
      'SELECT * FROM reservations WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );
  }

  async getAllReservations(): Promise<ReservationDTO[]> {
    return this.db.all<ReservationDTO>(
      'SELECT * FROM reservations ORDER BY date DESC'
    );
  }

  async cancelReservation(id: number): Promise<void> {
    await this.db.run(
      "UPDATE reservations SET status = 'cancelled' WHERE id = ?",
      [id]
    );
  }

  async deleteReservation(id: number): Promise<void> {
    await this.db.run('DELETE FROM reservations WHERE id = ?', [id]);
  }
}

export default new ReservationService();