"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("../prisma/client");
const validRoles = ["CLIENT", "DRIVER"];
async function registerController(req, res) {
    const { name, email, password, role, phone, vehicleType, vehiclePlate } = req.body;
    if (!name || !email || !password || !role || !phone) {
        return res.status(400).json({
            error: "name, email, password, role e phone são obrigatórios",
        });
    }
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: "role deve ser CLIENT ou DRIVER" });
    }
    if (role === "DRIVER" && (!vehicleType || !vehiclePlate)) {
        return res.status(400).json({
            error: "vehicleType e vehiclePlate são obrigatórios para motorista",
        });
    }
    const userExists = await client_1.prisma.user.findUnique({
        where: { email },
    });
    if (userExists) {
        return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await client_1.prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            driver: role === "DRIVER"
                ? {
                    create: {
                        vehicleType,
                        vehiclePlate,
                    },
                }
                : undefined,
        },
        include: {
            driver: true,
        },
    });
    return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        driver: user.driver,
        createdAt: user.createdAt,
    });
}
