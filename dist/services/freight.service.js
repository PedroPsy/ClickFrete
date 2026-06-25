"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreightService = void 0;
const client_1 = require("../prisma/client");
const AppError_1 = require("../utils/AppError");
const logger_1 = __importDefault(require("../utils/logger"));
const types_1 = require("../types");
class FreightService {
    static async createFreight(clientId, input) {
        try {
            const freight = await client_1.prisma.freight.create({
                data: {
                    pickupAddress: input.pickupAddress,
                    dropoffAddress: input.dropoffAddress,
                    price: input.price,
                    clientId,
                    status: types_1.FreightStatus.REQUESTED,
                },
            });
            logger_1.default.info('Freight created', {
                freightId: freight.id,
                clientId,
                price: freight.price,
            });
            return freight;
        }
        catch (error) {
            logger_1.default.error('Error creating freight', { error, clientId });
            throw new AppError_1.AppError('Erro ao criar frete');
        }
    }
    static async listAvailableFreights(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [freights, total] = await Promise.all([
                client_1.prisma.freight.findMany({
                    where: {
                        status: types_1.FreightStatus.REQUESTED,
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
                client_1.prisma.freight.count({
                    where: {
                        status: types_1.FreightStatus.REQUESTED,
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
        }
        catch (error) {
            logger_1.default.error('Error listing available freights', { error });
            throw new AppError_1.AppError('Erro ao listar fretes disponíveis');
        }
    }
    static async acceptFreight(freightId, driverId) {
        try {
            const freight = await client_1.prisma.freight.findUnique({
                where: { id: freightId },
            });
            if (!freight) {
                throw new AppError_1.NotFoundError('Frete');
            }
            if (freight.status !== types_1.FreightStatus.REQUESTED || freight.driverId) {
                throw new AppError_1.ForbiddenError('Este frete não está disponível para aceite');
            }
            const updatedFreight = await client_1.prisma.freight.update({
                where: { id: freightId },
                data: {
                    driverId,
                    status: types_1.FreightStatus.ACCEPTED,
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
            logger_1.default.info('Freight accepted', {
                freightId,
                driverId,
            });
            return updatedFreight;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            logger_1.default.error('Error accepting freight', { error, freightId, driverId });
            throw new AppError_1.AppError('Erro ao aceitar frete');
        }
    }
    static async startFreight(freightId, driverId) {
        try {
            const freight = await client_1.prisma.freight.findUnique({
                where: { id: freightId },
            });
            if (!freight) {
                throw new AppError_1.NotFoundError('Frete');
            }
            if (freight.driverId !== driverId) {
                throw new AppError_1.ForbiddenError('Você não é o motorista deste frete');
            }
            if (freight.status !== types_1.FreightStatus.ACCEPTED) {
                throw new AppError_1.ForbiddenError('Frete não pode ser iniciado neste estado');
            }
            const updatedFreight = await client_1.prisma.freight.update({
                where: { id: freightId },
                data: {
                    status: types_1.FreightStatus.IN_PROGRESS,
                },
            });
            logger_1.default.info('Freight started', { freightId, driverId });
            return updatedFreight;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            logger_1.default.error('Error starting freight', { error, freightId });
            throw new AppError_1.AppError('Erro ao iniciar frete');
        }
    }
    static async finishFreight(freightId, driverId) {
        try {
            const freight = await client_1.prisma.freight.findUnique({
                where: { id: freightId },
            });
            if (!freight) {
                throw new AppError_1.NotFoundError('Frete');
            }
            if (freight.driverId !== driverId) {
                throw new AppError_1.ForbiddenError('Você não é o motorista deste frete');
            }
            if (freight.status !== types_1.FreightStatus.IN_PROGRESS) {
                throw new AppError_1.ForbiddenError('Frete não pode ser finalizado neste estado');
            }
            const updatedFreight = await client_1.prisma.freight.update({
                where: { id: freightId },
                data: {
                    status: types_1.FreightStatus.FINISHED,
                },
            });
            logger_1.default.info('Freight finished', { freightId, driverId });
            return updatedFreight;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            logger_1.default.error('Error finishing freight', { error, freightId });
            throw new AppError_1.AppError('Erro ao finalizar frete');
        }
    }
    static async cancelFreight(freightId, userId, userRole) {
        try {
            const freight = await client_1.prisma.freight.findUnique({
                where: { id: freightId },
            });
            if (!freight) {
                throw new AppError_1.NotFoundError('Frete');
            }
            // Only client can cancel or driver if not started
            const isClient = freight.clientId === userId;
            const isDriver = freight.driverId === userId;
            if (!isClient && !isDriver) {
                throw new AppError_1.ForbiddenError('Você não tem permissão para cancelar este frete');
            }
            if (freight.status === types_1.FreightStatus.IN_PROGRESS ||
                freight.status === types_1.FreightStatus.FINISHED) {
                throw new AppError_1.ForbiddenError('Frete não pode ser cancelado neste estado');
            }
            const updatedFreight = await client_1.prisma.freight.update({
                where: { id: freightId },
                data: {
                    status: types_1.FreightStatus.CANCELED,
                },
            });
            logger_1.default.info('Freight canceled', { freightId, userId, userRole });
            return updatedFreight;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            logger_1.default.error('Error canceling freight', { error, freightId });
            throw new AppError_1.AppError('Erro ao cancelar frete');
        }
    }
    static async getClientFreights(clientId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [freights, total] = await Promise.all([
                client_1.prisma.freight.findMany({
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
                client_1.prisma.freight.count({ where: { clientId } }),
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
        }
        catch (error) {
            logger_1.default.error('Error listing client freights', { error, clientId });
            throw new AppError_1.AppError('Erro ao listar fretes');
        }
    }
    static async getDriverFreights(driverId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [freights, total] = await Promise.all([
                client_1.prisma.freight.findMany({
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
                client_1.prisma.freight.count({ where: { driverId } }),
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
        }
        catch (error) {
            logger_1.default.error('Error listing driver freights', { error, driverId });
            throw new AppError_1.AppError('Erro ao listar fretes');
        }
    }
    static async createReview(input, userId) {
        try {
            // Check freight exists and is finished
            const freight = await client_1.prisma.freight.findUnique({
                where: { id: input.freightId },
            });
            if (!freight) {
                throw new AppError_1.NotFoundError('Frete');
            }
            if (freight.status !== types_1.FreightStatus.FINISHED) {
                throw new AppError_1.ForbiddenError('Você só pode avaliar um frete finalizado');
            }
            // Check user is the client
            if (freight.clientId !== userId) {
                throw new AppError_1.ForbiddenError('Apenas o cliente pode avaliar o frete');
            }
            // Check review doesn't already exist
            const existingReview = await client_1.prisma.review.findUnique({
                where: { freightId: input.freightId },
            });
            if (existingReview) {
                throw new AppError_1.ForbiddenError('Este frete já foi avaliado');
            }
            const review = await client_1.prisma.review.create({
                data: {
                    rating: input.rating,
                    comment: input.comment,
                    freightId: input.freightId,
                    clientId: freight.clientId,
                    driverId: freight.driverId,
                },
            });
            logger_1.default.info('Review created', {
                reviewId: review.id,
                freightId: input.freightId,
                rating: input.rating,
            });
            return review;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            logger_1.default.error('Error creating review', { error, freightId: input.freightId });
            throw new AppError_1.AppError('Erro ao criar avaliação');
        }
    }
}
exports.FreightService = FreightService;
