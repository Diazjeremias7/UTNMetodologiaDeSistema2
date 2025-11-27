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

    // Validar fecha
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1);

    if (reservationDate < today) {
      throw new Error('No se pueden hacer reservas en fechas pasadas');
    }

    if (reservationDate > maxDate) {
      throw new Error('Solo se pueden hacer reservas hasta 1 año adelante');
    }

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

  async getAvailability(date: string): Promise<{ timeSlot: string; available: boolean }[]> {
    const timeSlots = [
      '08:00-09:00',
      '09:00-10:00',
      '10:00-11:00',
      '11:00-12:00',
      '14:00-15:00',
      '15:00-16:00',
      '16:00-17:00',
      '17:00-18:00',
      '18:00-19:00',
      '19:00-20:00',
      '20:00-21:00',
    ];

    const reservedSlots = await this.db.all<{ time_slot: string }>(
      "SELECT time_slot FROM reservations WHERE date = ? AND status = 'active'",
      [date]
    );

    const reservedTimes = new Set(reservedSlots.map((r) => r.time_slot));

    return timeSlots.map((slot) => ({
      timeSlot: slot,
      available: !reservedTimes.has(slot),
    }));
  }
}

export default new ReservationService();