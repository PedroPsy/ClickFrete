import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";

export async function updateDriverStatusController(
  req: AuthRequest,
  res: Response
) {
  const { isOnline } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  if (typeof isOnline !== "boolean") {
    return res.status(400).json({ error: "isOnline deve ser boolean" });
  }

  const driver = await prisma.driver.findUnique({
    where: { userId: req.user.id },
  });

  if (!driver) {
    return res.status(404).json({ error: "Motorista não encontrado" });
  }

  const updatedDriver = await prisma.driver.update({
    where: { id: driver.id },
    data: { isOnline },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return res.json(updatedDriver);
}
