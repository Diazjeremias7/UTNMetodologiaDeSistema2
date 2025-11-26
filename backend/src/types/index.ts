export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  created_at?: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface CreateReservationDTO {
  userId: number;
  date: string;
  timeSlot: string;
  services: string[];
}

export interface ReservationDTO {
  id: number;
  userId: number;
  date: string;
  timeSlot: string;
  basePrice: number;
  totalPrice: number;
  services: string[];
  status: string;
  created_at: string;
}