"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
const AppError_1 = require("../utils/AppError");
const logger_1 = __importDefault(require("../utils/logger"));
function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new AppError_1.UnauthorizedError('Não autenticado');
            }
            if (!allowedRoles.includes(req.user.role)) {
                logger_1.default.warn('Unauthorized role access attempt', {
                    userId: req.user.id,
                    userRole: req.user.role,
                    requiredRoles: allowedRoles,
                    endpoint: req.path,
                });
                throw new AppError_1.ForbiddenError('Seu papel não tem permissão para acessar este recurso');
            }
            next();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                return res.status(error.statusCode).json({
                    error: error.message,
                    code: error.code,
                });
            }
            next(error);
        }
    };
}
