"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelFreightController = cancelFreightController;
const freight_service_1 = require("../services/freight.service");
async function cancelFreightController(req, res) {
    try {
        if (!req.user?.id || !req.user?.role) {
            return res.status(401).json({ error: 'Não autenticado' });
        }
        const { id } = req.params;
        const freight = await freight_service_1.FreightService.cancelFreight(id, req.user.id, req.user.role);
        return res.json(freight);
    }
    catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ error: error.message });
    }
}
