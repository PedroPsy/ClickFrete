"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishFreightController = finishFreightController;
const client_1 = require("../prisma/client");
const freight_service_1 = require("../services/freight.service");
async function finishFreightController(req, res) {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ error: 'Não autenticado' });
        }
        const { id } = req.params;
        const driver = await client_1.prisma.driver.findUnique({
            where: { userId: req.user.id },
        });
        if (!driver) {
            return res.status(404).json({ error: 'Motorista não encontrado' });
        }
        const freight = await freight_service_1.FreightService.finishFreight(id, driver.id);
        return res.json(freight);
    }
    catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ error: error.message });
    }
}
