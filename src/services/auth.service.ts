import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
import { RegisterInput, LoginInput } from '../validators';
import { UnauthorizedError, ConflictError, NotFoundError, AppError } from '../utils/AppError';
import logger from '../utils/logger';
import { UserRole } from '../types';

export class AuthService {
  static async register(input: RegisterInput) {
    try {
      // Check if user already exists
      const userExists = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (userExists) {
        throw new ConflictError('Email já está cadastrado');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          role: input.role,
          phone: input.phone,
          driver:
            input.role === UserRole.DRIVER
              ? {
                  create: {
                    vehicleType: input.vehicleType!,
                    vehiclePlate: input.vehiclePlate!,
                  },
                }
              : undefined,
        },
        include: {
          driver: true,
        },
      });

      logger.info('User registered successfully', {
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
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error registering user', { error });
      throw new AppError('Erro ao cadastrar usuário');
    }
  }

  static async login(input: LoginInput) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: { driver: true },
      });

      if (!user) {
        throw new UnauthorizedError('Credenciais inválidas');
      }

      const passwordMatch = await bcrypt.compare(input.password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedError('Credenciais inválidas');
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new AppError('JWT_SECRET não configurado', 500);
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        jwtSecret,
        { expiresIn: '7d' }
      );

      logger.info('User logged in successfully', {
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
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error logging in user', { error });
      throw new AppError('Erro ao fazer login');
    }
  }

  static async getUser(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { driver: true },
      });

      if (!user) {
        throw new NotFoundError('Usuário');
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
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching user', { error, userId });
      throw new AppError('Erro ao buscar usuário');
    }
  }
}
