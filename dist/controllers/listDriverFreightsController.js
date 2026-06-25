"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDriverFreightsController = listDriverFreightsController;
const client_1 = require("../prisma/client");
const freight_service_1 = require("../services/freight.service");
async function listDriverFreightsController(req, res) {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ error: 'Não autenticado' });
        }
        const driver = await client_1.prisma.driver.findUnique({
            where: { userId: req.user.id },
        });
        if (!driver) {
            return res.status(404).json({ error: 'Motorista não encontrado' });
        }
        const { page, limit } = req.validatedData;
        const result = await freight_service_1.FreightService.getDriverFreights(driver.id, page, limit);
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao listar fretes' });
    }
}
