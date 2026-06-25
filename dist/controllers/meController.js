"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meController = meController;
const auth_service_1 = require("../services/auth.service");
const AppError_1 = require("../utils/AppError");
async function meController(req, res) {
    try {
        if (!req.user?.id) {
            throw new AppError_1.UnauthorizedError('Não autenticado');
        }
        const user = await auth_service_1.AuthService.getUser(req.user.id);
        return res.json(user);
    }
    catch (error) {
        return res.status(401).json({ error: 'Erro ao buscar usuário' });
    }
}
