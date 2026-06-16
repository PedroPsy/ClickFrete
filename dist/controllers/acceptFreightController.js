"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptFreightController = acceptFreightController;
const client_1 = require("../prisma/client");
async function acceptFreightController(req, res) {
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
        where: { id },
    });
    if (!freight) {
        return res.status(404).json({ error: "Frete não encontrado" });
    }
    if (freight.status !== "REQUESTED" || freight.driverId) {
        return res.status(400).json({ error: "Frete não está disponível para aceite" });
    }
    const updatedFreight = await client_1.prisma.freight.update({
        where: { id },
        data: {
            driverId: driver.id,
            status: "ACCEPTED",
        },
    });
    return res.json(updatedFreight);
}
