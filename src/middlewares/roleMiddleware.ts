import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export function roleMiddleware(requiredRole: "CLIENT" | "DRIVER") {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    return next();
  };
}