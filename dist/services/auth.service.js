"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("../prisma/client");
const AppError_1 = require("../utils/AppError");
const logger_1 = __importDefault(require("../utils/logger"));
const types_1 = require("../types");
class AuthService {
    static async register(input) {
        try {
            // Check if user already exists
            const userExists = await client_1.prisma.user.findUnique({
                where: { email: input.email },
            });
            if (userExists) {
                throw new AppError_1.ConflictError('Email já está cadastrado');
            }
            // Hash password
            const hashedPassword = await bcrypt_1.default.hash(input.password, 10);
            // Create user
            const user = await client_1.prisma.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    password: hashedPassword,
                    role: input.role,
                    phone: input.phone,
                    driver: input.role === types_1.UserRole.DRIVER
                        ? {
                            create: {
                                vehicleType: input.vehicleType,
                                vehiclePlate: input.vehiclePlate,
                            },
                        }
                        : undefined,
                },
                include: {
                    driver: true,
                },
            });
            logger_1.default.info('User registered successfully', {
                userId: user.id,
                email: user.email,
                role: user.role,
            });
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                createdAt: user.createdAt,
                driver: user.driver,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            logger_1.default.error('Error registering user', { error });
            throw new AppError_1.AppError('Erro ao cadastrar usuário');
        }
    }
    static async login(input) {
        try {
            const user = await client_1.prisma.user.findUnique({
                where: { email: input.email },
                include: { driver: true },
            });
            if (!user) {
                throw new AppError_1.UnauthorizedError('Credenciais inválidas');
            }
            const passwordMatch = await bcrypt_1.default.compare(input.password, user.password);
            if (!passwordMatch) {
                throw new AppError_1.UnauthorizedError('Credenciais inválidas');
            }
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new AppError_1.AppError('JWT_SECRET não configurado', 500);
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '7d' });
            logger_1.default.info('User logged in successfully', {
                userId: user.id,
                email: user.email,
            });
            return {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    createdAt: user.createdAt,
                    driver: user.driver,
                },
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            logger_1.default.error('Error logging in user', { error });
            throw new AppError_1.AppError('Erro ao fazer login');
        }
    }
    static async getUser(userId) {
        try {
            const user = await client_1.prisma.user.findUnique({
                where: { id: userId },
                include: { driver: true },
            });
            if (!user) {
                throw new AppError_1.NotFoundError('Usuário');
            }
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                createdAt: user.createdAt,
                driver: user.driver,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            logger_1.default.error('Error fetching user', { error, userId });
            throw new AppError_1.AppError('Erro ao buscar usuário');
        }
    }
}
exports.AuthService = AuthService;
