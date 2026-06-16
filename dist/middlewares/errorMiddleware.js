"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
function errorMiddleware(err, req, res, next) {
    console.error(err);
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Token inválido" });
    }
    if (err.code === "P2002") {
        return res.status(400).json({ error: "Registro duplicado" });
    }
    return res.status(500).json({
        error: "Erro interno do servidor",
    });
}
