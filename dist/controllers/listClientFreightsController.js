"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listClientFreightsController = listClientFreightsController;
const client_1 = require("../prisma/client");
async function listClientFreightsController(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: "Não autenticado" });
    }
    const freights = await client_1.prisma.freight.findMany({
        where: {
            clientId: req.user.id,
        },
        include: {
            driver: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                        },
                    },
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
