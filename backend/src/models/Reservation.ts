/**
 * PATRÓN DECORATOR - Sistema de Reservas
 * Permite agregar servicios adicionales dinámicamente
 */

// ============================================
// INTERFACES
// ============================================

export interface ReservationData {
  id?: number;
  userId: number;
  date: string;
  timeSlot: string;
  basePrice: number;
  totalPrice: number;
  services: string[];
  status: 'active' | 'cancelled';
}

export interface IReservation {
  getPrice(): number;
  getDescription(): string;
  getServices(): string[];
  toJSON(): ReservationData;
}

// ============================================
// RESERVA BÁSICA
// ============================================

export class BasicReservation implements IReservation {
  protected id?: number;
  protected userId: number;
  protected date: string;
  protected timeSlot: string;
  protected basePrice: number;
  protected services: string[];
  protected status: 'active' | 'cancelled';

  constructor(
    userId: number,
    date: string,
    timeSlot: string,
    basePrice: number = 10000
  ) {
    this.userId = userId;
    this.date = date;
    this.timeSlot = timeSlot;
    this.basePrice = basePrice;
    this.services = [];
    this.status = 'active';
  }

  getPrice(): number {
    return this.basePrice;
  }

  getDescription(): string {
    return `Reserva de cancha - ${this.date} ${this.timeSlot}`;
  }

  getServices(): string[] {
    return [...this.services];
  }

  toJSON(): ReservationData {
    return {
      id: this.id,
      userId: this.userId,
      date: this.date,
      timeSlot: this.timeSlot,
      basePrice: this.basePrice,
      totalPrice: this.getPrice(),
      services: this.getServices(),
      status: this.status,
    };
  }

  setId(id: number): void {
    this.id = id;
  }

  cancel(): void {
    this.status = 'cancelled';
  }
}

// ============================================
// DECORADOR BASE
// ============================================

abstract class ReservationDecorator implements IReservation {
  protected reservation: IReservation;

  constructor(reservation: IReservation) {
    this.reservation = reservation;
  }

  getPrice(): number {
    return this.reservation.getPrice();
  }

  getDescription(): string {
    return this.reservation.getDescription();
  }

  getServices(): string[] {
    return this.reservation.getServices();
  }

  toJSON(): ReservationData {
    const base = this.reservation.toJSON();
    return {
      ...base,
      totalPrice: this.getPrice(),
      services: this.getServices(),
    } as ReservationData;
  }
}

// ============================================
// DECORADORES CONCRETOS
// ============================================

export class LightingDecorator extends ReservationDecorator {
  private lightingCost = 2000;

  getPrice(): number {
    return this.reservation.getPrice() + this.lightingCost;
  }

  getDescription(): string {
    return this.reservation.getDescription() + ' + Iluminación';
  }

  getServices(): string[] {
    return [...this.reservation.getServices(), 'Iluminación'];
  }
}

export class RefereeDecorator extends ReservationDecorator {
  private refereeCost = 5000;

  getPrice(): number {
    return this.reservation.getPrice() + this.refereeCost;
  }

  getDescription(): string {
    return this.reservation.getDescription() + ' + Árbitro';
  }

  getServices(): string[] {
    return [...this.reservation.getServices(), 'Árbitro'];
  }
}

export class BallsDecorator extends ReservationDecorator {
  private ballsCost = 1000;

  getPrice(): number {
    return this.reservation.getPrice() + this.ballsCost;
  }

  getDescription(): string {
    return this.reservation.getDescription() + ' + Pelotas';
  }

  getServices(): string[] {
    return [...this.reservation.getServices(), 'Pelotas'];
  }
}