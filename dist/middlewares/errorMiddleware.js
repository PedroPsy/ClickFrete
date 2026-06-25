"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = require("../utils/AppError");
function errorMiddleware(err, req, res, next) {
    logger_1.default.error('Error occurred', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });
    // AppError - Custom application errors
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            code: err.code,
        });
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Token inválido',
            code: 'INVALID_TOKEN',
        });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expirado',
            code: 'TOKEN_EXPIRED',
        });
    }
    // Prisma errors
    if (err.code === 'P2002') {
        return res.status(409).json({
            error: 'Registro duplicado',
            code: 'DUPLICATE_RECORD',
        });
    }
    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Registro não encontrado',
            code: 'NOT_FOUND',
        });
    }
    // Default error
    return res.status(500).json({
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR',
        ...(process.env.NODE_ENV === 'development' && { message: err.message }),
    });
}
