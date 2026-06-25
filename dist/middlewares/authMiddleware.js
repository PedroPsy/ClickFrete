"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                error: 'Token não fornecido',
                code: 'NO_TOKEN',
            });
        }
        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({
                error: 'Formato de token inválido',
                code: 'INVALID_FORMAT',
            });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            logger_1.default.error('JWT_SECRET not configured');
            return res.status(500).json({
                error: 'Erro de configuração do servidor',
                code: 'CONFIG_ERROR',
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_1.default.warn('Auth middleware error', {
            error: error.message,
            statusCode: error.statusCode,
        });
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expirado',
                code: 'TOKEN_EXPIRED',
            });
        }
        return res.status(401).json({
            error: 'Token inválido',
            code: 'INVALID_TOKEN',
        });
    }
}
