"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAvailableFreightsController = listAvailableFreightsController;
const freight_service_1 = require("../services/freight.service");
async function listAvailableFreightsController(req, res) {
    try {
        const { page, limit } = req.validatedData;
        const result = await freight_service_1.FreightService.listAvailableFreights(page, limit);
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao listar fretes' });
    }
}
