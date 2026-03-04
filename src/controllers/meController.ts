import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";

export async function meController(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  const user = await prisma.user.findUnique({
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
