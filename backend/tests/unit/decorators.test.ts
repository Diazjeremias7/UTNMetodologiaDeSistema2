import {
  BasicReservation,
  LightingDecorator,
  RefereeDecorator,
  BallsDecorator,
  IReservation,
} from '../../src/models/Reservation';

describe('Patrón Decorator - Reservas', () => {
  test('reserva básica debe tener precio base', () => {
    const reservation = new BasicReservation(1, '2025-01-20', '18:00-19:00');
    expect(reservation.getPrice()).toBe(10000);
    expect(reservation.getServices()).toEqual([]);
  });

  test('agregar iluminación debe aumentar precio', () => {
    let reservation: IReservation = new BasicReservation(1, '2025-01-20', '18:00-19:00');
    reservation = new LightingDecorator(reservation);
    
    expect(reservation.getPrice()).toBe(12000);
    expect(reservation.getServices()).toContain('Iluminación');
  });

  test('agregar múltiples servicios debe acumular precios', () => {
    let reservation: IReservation = new BasicReservation(1, '2025-01-20', '18:00-19:00');
    reservation = new LightingDecorator(reservation);
    reservation = new RefereeDecorator(reservation);
    reservation = new BallsDecorator(reservation);
    
    // Base: 10000 + Luz: 2000 + Árbitro: 5000 + Pelotas: 1000 = 18000
    expect(reservation.getPrice()).toBe(18000);
    expect(reservation.getServices()).toEqual([
      'Iluminación',
      'Árbitro',
      'Pelotas',
    ]);
  });

  test('toJSON debe retornar datos completos', () => {
    let reservation: IReservation = new BasicReservation(1, '2025-01-20', '18:00-19:00');
    reservation = new LightingDecorator(reservation);
    
    const data = reservation.toJSON();
    expect(data.totalPrice).toBe(12000);
    expect(data.services).toContain('Iluminación');
  });
});