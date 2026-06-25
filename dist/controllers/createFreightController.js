"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFreightController = createFreightController;
const freight_service_1 = require("../services/freight.service");
const validators_1 = require("../validators");
async function createFreightController(req, res) {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ error: 'Não autenticado' });
        }
        const validatedData = validators_1.CreateFreightSchema.parse(req.body);
        const freight = await freight_service_1.FreightService.createFreight(req.user.id, validatedData);
        return res.status(201).json(freight);
    }
    catch (error) {
        return res.status(400).json({ error: error.message || 'Erro ao criar frete' });
    }
}
