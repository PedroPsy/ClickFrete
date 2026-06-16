"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meController = meController;
const client_1 = require("../prisma/client");
async function meController(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: "Não autenticado" });
    }
    const user = await client_1.prisma.user.findUnique({
        where: { id: req.user.id },
        include: { driver: true },
    });
    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }
    return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        driver: user.driver,
        createdAt: user.createdAt,
    });
}
