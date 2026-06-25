"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = loginController;
const auth_service_1 = require("../services/auth.service");
const validators_1 = require("../validators");
async function loginController(req, res) {
    try {
        const validatedData = validators_1.LoginSchema.parse(req.body);
        const result = await auth_service_1.AuthService.login(validatedData);
        return res.json(result);
    }
    catch (error) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }
}
