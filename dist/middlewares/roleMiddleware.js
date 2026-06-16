"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
function roleMiddleware(requiredRole) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: "Acesso negado" });
        }
        return next();
    };
}
