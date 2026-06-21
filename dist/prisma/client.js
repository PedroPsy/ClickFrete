"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const client_1 = require("@prisma/client");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('DATABASE_URL não configurado. Verifique se o arquivo .env existe antes de iniciar a API.');
}
exports.prisma = new client_1.PrismaClient({
    errorFormat: process.env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
});
