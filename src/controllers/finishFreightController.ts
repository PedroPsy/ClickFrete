import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";

export async function finishFreightController(req: AuthRequest, res: Response) {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  const driver = await prisma.driver.findUnique({
    where: { userId: req.user.id },
  });

  if (!driver) {
    return res.status(404).json({ error: "Motorista não encontrado" });
  }

  const freight = await prisma.freight.findUnique({
    where: { id },
  });

  if (!freight) {
    return res.status(404).json({ error: "Frete não encontrado" });
  }

  if (freight.driverId !== driver.id) {
    return res.status(403).json({ error: "Apenas o motorista que aceitou pode finalizar" });
  }

  const updatedFreight = await prisma.freight.update({
    where: { id },
    data: {
      status: "FINISHED",
    },
  });

  return res.json(updatedFreight);
}
