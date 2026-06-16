"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFreightController = createFreightController;
const client_1 = require("../prisma/client");
async function createFreightController(req, res) {
    try {
        const { pickupAddress, dropoffAddress, price } = req.body;
        if (!pickupAddress || !dropoffAddress || !price) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios",
            });
        }
        if (!req.user) {
            return res.status(401).json({
                error: "Usuário não autenticado",
            });
        }
        const freight = await client_1.prisma.freight.create({
            data: {
                pickupAddress,
                dropoffAddress,
                price: Number(price),
                clientId: req.user.id,
                status: "REQUESTED",
            },
        });
        return res.status(201).json(freight);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Erro ao criar frete",
        });
    }
}
