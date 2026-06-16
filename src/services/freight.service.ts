import { prisma } from '../prisma/client';
import { CreateFreightInput, CreateReviewInput } from '../validators';
import { NotFoundError, ForbiddenError, AppError } from '../utils/AppError';
import logger from '../utils/logger';
import { FreightStatus, UserRole } from '../types';

export class FreightService {
  static async createFreight(clientId: string, input: CreateFreightInput) {
    try {
      const freight = await prisma.freight.create({
        data: {
          pickupAddress: input.pickupAddress,
          dropoffAddress: input.dropoffAddress,
          price: input.price,
          clientId,
          status: FreightStatus.REQUESTED,
        },
      });

      logger.info('Freight created', {
        freightId: freight.id,
        clientId,
        price: freight.price,
      });

      return freight;
    } catch (error) {
      logger.error('Error creating freight', { error, clientId });
      throw new AppError('Erro ao criar frete');
    }
  }

  static async listAvailableFreights(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [freights, total] = await Promise.all([
        prisma.freight.findMany({
          where: {
            status: FreightStatus.REQUESTED,
            driverId: null,
          },
          include: {
            client: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.freight.count({
          where: {
            status: FreightStatus.REQUESTED,
            driverId: null,
          },
        }),
      ]);

      return {
        data: freights,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error listing available freights', { error });
      throw new AppError('Erro ao listar fretes disponíveis');
    }
  }

  static async acceptFreight(freightId: string, driverId: string) {
    try {
      const freight = await prisma.freight.findUnique({
        where: { id: freightId },
      });

      if (!freight) {
        throw new NotFoundError('Frete');
      }

      if (freight.status !== FreightStatus.REQUESTED || freight.driverId) {
        throw new ForbiddenError('Este frete não está disponível para aceite');
      }

      const updatedFreight = await prisma.freight.update({
        where: { id: freightId },
        data: {
          driverId,
          status: FreightStatus.ACCEPTED,
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          driver: true,
        },
      });

      logger.info('Freight accepted', {
        freightId,
        driverId,
      });

      return updatedFreight;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error accepting freight', { error, freightId, driverId });
      throw new AppError('Erro ao aceitar frete');
    }
  }

  static async startFreight(freightId: string, driverId: string) {
    try {
      const freight = await prisma.freight.findUnique({
        where: { id: freightId },
      });

      if (!freight) {
        throw new NotFoundError('Frete');
      }

      if (freight.driverId !== driverId) {
        throw new ForbiddenError('Você não é o motorista deste frete');
      }

      if (freight.status !== FreightStatus.ACCEPTED) {
        throw new ForbiddenError('Frete não pode ser iniciado neste estado');
      }

      const updatedFreight = await prisma.freight.update({
        where: { id: freightId },
        data: {
          status: FreightStatus.IN_PROGRESS,
        },
      });

      logger.info('Freight started', { freightId, driverId });

      return updatedFreight;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error starting freight', { error, freightId });
      throw new AppError('Erro ao iniciar frete');
    }
  }

  static async finishFreight(freightId: string, driverId: string) {
    try {
      const freight = await prisma.freight.findUnique({
        where: { id: freightId },
      });

      if (!freight) {
        throw new NotFoundError('Frete');
      }

      if (freight.driverId !== driverId) {
        throw new ForbiddenError('Você não é o motorista deste frete');
      }

      if (freight.status !== FreightStatus.IN_PROGRESS) {
        throw new ForbiddenError('Frete não pode ser finalizado neste estado');
      }

      const updatedFreight = await prisma.freight.update({
        where: { id: freightId },
        data: {
          status: FreightStatus.FINISHED,
        },
      });

      logger.info('Freight finished', { freightId, driverId });

      return updatedFreight;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error finishing freight', { error, freightId });
      throw new AppError('Erro ao finalizar frete');
    }
  }

  static async cancelFreight(freightId: string, userId: string, userRole: UserRole) {
    try {
      const freight = await prisma.freight.findUnique({
        where: { id: freightId },
      });

      if (!freight) {
        throw new NotFoundError('Frete');
      }

      // Only client can cancel or driver if not started
      const isClient = freight.clientId === userId;
      const isDriver = freight.driverId === userId;

      if (!isClient && !isDriver) {
        throw new ForbiddenError('Você não tem permissão para cancelar este frete');
      }

      if (
        freight.status === FreightStatus.IN_PROGRESS ||
        freight.status === FreightStatus.FINISHED
      ) {
        throw new ForbiddenError('Frete não pode ser cancelado neste estado');
      }

      const updatedFreight = await prisma.freight.update({
        where: { id: freightId },
        data: {
          status: FreightStatus.CANCELED,
        },
      });

      logger.info('Freight canceled', { freightId, userId, userRole });

      return updatedFreight;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error canceling freight', { error, freightId });
      throw new AppError('Erro ao cancelar frete');
    }
  }

  static async getClientFreights(clientId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [freights, total] = await Promise.all([
        prisma.freight.findMany({
          where: { clientId },
          include: {
            driver: {
              select: {
                id: true,
                vehicleType: true,
                vehiclePlate: true,
                user: {
                  select: {
                    name: true,
                    phone: true,
                  },
                },
              },
            },
            review: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.freight.count({ where: { clientId } }),
      ]);

      return {
        data: freights,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error listing client freights', { error, clientId });
      throw new AppError('Erro ao listar fretes');
    }
  }

  static async getDriverFreights(driverId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [freights, total] = await Promise.all([
        prisma.freight.findMany({
          where: { driverId },
          include: {
            client: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
            review: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.freight.count({ where: { driverId } }),
      ]);

      return {
        data: freights,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error listing driver freights', { error, driverId });
      throw new AppError('Erro ao listar fretes');
    }
  }

  static async createReview(input: CreateReviewInput, userId: string) {
    try {
      // Check freight exists and is finished
      const freight = await prisma.freight.findUnique({
        where: { id: input.freightId },
      });

      if (!freight) {
        throw new NotFoundError('Frete');
      }

      if (freight.status !== FreightStatus.FINISHED) {
        throw new ForbiddenError('Você só pode avaliar um frete finalizado');
      }

      // Check user is the client
      if (freight.clientId !== userId) {
        throw new ForbiddenError('Apenas o cliente pode avaliar o frete');
      }

      // Check review doesn't already exist
      const existingReview = await prisma.review.findUnique({
        where: { freightId: input.freightId },
      });

      if (existingReview) {
        throw new ForbiddenError('Este frete já foi avaliado');
      }

      const review = await prisma.review.create({
        data: {
          rating: input.rating,
          comment: input.comment,
          freightId: input.freightId,
          clientId: freight.clientId,
          driverId: freight.driverId!,
        },
      });

      logger.info('Review created', {
        reviewId: review.id,
        freightId: input.freightId,
        rating: input.rating,
      });

      return review;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating review', { error, freightId: input.freightId });
      throw new AppError('Erro ao criar avaliação');
    }
  }
}
