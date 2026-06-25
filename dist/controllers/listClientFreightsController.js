"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listClientFreightsController = listClientFreightsController;
const freight_service_1 = require("../services/freight.service");
async function listClientFreightsController(req, res) {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ error: 'Não autenticado' });
        }
        const { page, limit } = req.validatedData;
        const result = await freight_service_1.FreightService.getClientFreights(req.user.id, page, limit);
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao listar fretes' });
    }
}
