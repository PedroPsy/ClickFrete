import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";

export async function cancelFreightController(req: AuthRequest, res: Response) {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  const freight = await prisma.freight.findUnique({
    where: { id },
  });

  if (!freight) {
    return res.status(404).json({ error: "Frete não encontrado" });
  }

  const driver = await prisma.driver.findUnique({
    where: { userId: req.user.id },
  });

  const isClientOwner = freight.clientId === req.user.id;
  const isDriverOwner = !!driver && freight.driverId === driver.id;

  if (!isClientOwner && !isDriverOwner) {
    return res.status(403).json({
      error: "Apenas cliente dono do frete ou motorista responsável podem cancelar",
    });
  }

  if (freight.status === "FINISHED" || freight.status === "CANCELED") {
    return res.status(400).json({
      error: "Não é possível cancelar frete finalizado ou já cancelado",
    });
  }

  const updatedFreight = await prisma.freight.update({
    where: { id },
    data: {
      status: "CANCELED",
    },
  });

  return res.json(updatedFreight);
}
