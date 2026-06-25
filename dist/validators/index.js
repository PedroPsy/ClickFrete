"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationSchema = exports.CreateReviewSchema = exports.CreateFreightSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
// Auth validators
exports.RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    role: zod_1.z.enum([types_1.UserRole.CLIENT, types_1.UserRole.DRIVER]),
    phone: zod_1.z.string().regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos'),
    vehicleType: zod_1.z.string().optional(),
    vehiclePlate: zod_1.z.string().optional(),
}).refine((data) => {
    if (data.role === types_1.UserRole.DRIVER) {
        return data.vehicleType && data.vehiclePlate;
    }
    return true;
}, { message: 'Motoristas devem informar tipo de veículo e placa' });
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(1, 'Senha é obrigatória'),
});
// Freight validators
exports.CreateFreightSchema = zod_1.z.object({
    pickupAddress: zod_1.z.string().min(5, 'Endereço de coleta inválido'),
    dropoffAddress: zod_1.z.string().min(5, 'Endereço de entrega inválido'),
    price: zod_1.z.number().positive('Preço deve ser positivo'),
    description: zod_1.z.string().optional(),
}).refine((data) => data.pickupAddress !== data.dropoffAddress, { message: 'Endereço de coleta e entrega devem ser diferentes' });
exports.CreateReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5, 'Avaliação deve ser entre 1 e 5'),
    comment: zod_1.z.string().max(500, 'Comentário não pode exceder 500 caracteres').optional(),
    freightId: zod_1.z.string().uuid('ID de frete inválido'),
});
exports.PaginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(10),
});
