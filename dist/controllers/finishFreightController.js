"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishFreightController = finishFreightController;
const client_1 = require("../prisma/client");
async function finishFreightController(req, res) {
    const { id } = req.params;
    if (!req.user) {
        return res.status(401).json({ error: "Não autenticado" });
    }
    const driver = await client_1.prisma.driver.findUnique({
        where: { userId: req.user.id },
    });
    if (!driver) {
        return res.status(404).json({ error: "Motorista não encontrado" });
    }
    const freight = await client_1.prisma.freight.findUnique({
        where: { id }
    });
    if (!freight) {
        return res.status(404).json({ error: "Frete não encontrado" });
    }
    if (freight.driverId !== driver.id) {
        return res.status(403).json({ error: "Apenas o motorista que aceitou pode finalizar" });
    }
    if (freight.status !== "IN_PROGRESS") {
        return res.status(400).json({ error: "Só é possível finalizar frete com status IN_PROGRESS" });
    }
    const updatedFreight = await client_1.prisma.freight.update({
        where: { id },
        data: {
            status: "FINISHED",
        }
    });
    return res.json(updatedFreight);
}
