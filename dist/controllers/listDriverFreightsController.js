"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDriverFreightsController = listDriverFreightsController;
const client_1 = require("../prisma/client");
async function listDriverFreightsController(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: "Não autenticado" });
    }
    const driver = await client_1.prisma.driver.findUnique({
        where: {
            userId: req.user.id,
        },
    });
    if (!driver) {
        return res.status(404).json({ error: "Motorista não encontrado" });
    }
    const freights = await client_1.prisma.freight.findMany({
        where: {
            driverId: driver.id,
        },
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                    phone: true,
                },
            },
            review: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return res.json(freights);
}
