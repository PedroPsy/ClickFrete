"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAvailableFreightsController = listAvailableFreightsController;
const client_1 = require("../prisma/client");
async function listAvailableFreightsController(req, res) {
    const freights = await client_1.prisma.freight.findMany({
        where: {
            status: "REQUESTED",
            driverId: null,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return res.json(freights);
}
