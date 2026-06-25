"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
const auth_service_1 = require("../services/auth.service");
const validators_1 = require("../validators");
async function registerController(req, res) {
    try {
        const validatedData = validators_1.RegisterSchema.parse(req.body);
        const result = await auth_service_1.AuthService.register(validatedData);
        return res.status(201).json(result);
    }
    catch (error) {
        return res.status(400).json({ error: 'Erro ao registrar usuário' });
    }
}
