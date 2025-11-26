/**
 * Interfaz base para una reserva
 */
export interface IReservation {
  id?: number;
  user_id: number;
  date: string;
  time_slot: string;
  base_price: number;
  total_price: number;
  services?: string;
  status?: string;
  created_at?: string;
}

/**
 * Clase base de Reserva
 * Esta será el componente base para el patrón Decorator
 */
export class Reservation implements IReservation {
  id?: number;
  user_id: number;
  date: string;
  time_slot: string;
  base_price: number;
  total_price: number;
  services?: string;
  status?: string;
  created_at?: string;

  constructor(data: IReservation) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.date = data.date;
    this.time_slot = data.time_slot;
    this.base_price = data.base_price;
    this.total_price = data.base_price; // Inicialmente igual al precio base
    this.services = data.services || '';
    this.status = data.status || 'active';
    this.created_at = data.created_at;
  }