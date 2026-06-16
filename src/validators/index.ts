import { z } from 'zod';
import { UserRole } from '../types';

// Auth validators
export const RegisterSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum([UserRole.CLIENT, UserRole.DRIVER]),
  phone: z.string().regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos'),
  vehicleType: z.string().optional(),
  vehiclePlate: z.string().optional(),
}).refine(
  (data) => {
    if (data.role === UserRole.DRIVER) {
      return data.vehicleType && data.vehiclePlate;
    }
    return true;
  },
  { message: 'Motoristas devem informar tipo de veículo e placa' }
);

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Freight validators
export const CreateFreightSchema = z.object({
  pickupAddress: z.string().min(5, 'Endereço de coleta inválido'),
  dropoffAddress: z.string().min(5, 'Endereço de entrega inválido'),
  price: z.number().positive('Preço deve ser positivo'),
  description: z.string().optional(),
}).refine(
  (data) => data.pickupAddress !== data.dropoffAddress,
  { message: 'Endereço de coleta e entrega devem ser diferentes' }
);

export const CreateReviewSchema = z.object({
  rating: z.number().min(1).max(5, 'Avaliação deve ser entre 1 e 5'),
  comment: z.string().max(500, 'Comentário não pode exceder 500 caracteres').optional(),
  freightId: z.string().uuid('ID de frete inválido'),
});

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Export type inference
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateFreightInput = z.infer<typeof CreateFreightSchema>;
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
