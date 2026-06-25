"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = validationMiddleware;
exports.queryValidationMiddleware = queryValidationMiddleware;
const logger_1 = __importDefault(require("../utils/logger"));
function validationMiddleware(schema) {
    return (req, res, next) => {
        try {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                const errors = result.error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                logger_1.default.warn('Validation failed', { errors, body: req.body });
                return res.status(400).json({
                    error: 'Validação falhou',
                    details: errors,
                });
            }
            req.validatedData = result.data;
            next();
        }
        catch (error) {
            logger_1.default.error('Validation middleware error', { error });
            res.status(500).json({ error: 'Erro ao validar dados' });
        }
    };
}
function queryValidationMiddleware(schema) {
    return (req, res, next) => {
        try {
            const result = schema.safeParse(req.query);
            if (!result.success) {
                const errors = result.error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    error: 'Validação falhou',
                    details: errors,
                });
            }
            req.validatedData = result.data;
            next();
        }
        catch (error) {
            logger_1.default.error('Query validation middleware error', { error });
            res.status(500).json({ error: 'Erro ao validar query' });
        }
    };
}
