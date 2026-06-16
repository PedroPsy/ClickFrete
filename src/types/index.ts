export enum UserRole {
  CLIENT = 'CLIENT',
  DRIVER = 'DRIVER',
}

export enum FreightStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED',
}

export interface TokenPayload {
  id: string;
  role: UserRole;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  vehicleType?: string;
  vehiclePlate?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateFreightRequest {
  pickupAddress: string;
  dropoffAddress: string;
  price: number;
  description?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  createdAt: Date;
}

export interface DriverResponse extends UserResponse {
  driver?: {
    id: string;
    vehicleType: string;
    vehiclePlate: string;
    isOnline: boolean;
  };
}

export interface FreightResponse {
  id: string;
  clientId: string;
  driverId?: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  price: number;
  status: FreightStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewResponse {
  id: string;
  rating: number;
  comment?: string | null;
  freightId: string;
  createdAt: Date;
}
