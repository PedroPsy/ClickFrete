import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";

export async function listDriverFreightsController(
  req: AuthRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  const driver = await prisma.driver.findUnique({
    where: {
      userId: req.user.id,
    },
  });

  if (!driver) {
    return res.status(404).json({ error: "Motorista não encontrado" });
  }

  const freights = await prisma.freight.findMany({
    where: {
      driverId: driver.id,
      status: "FINISHED",
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json(freights);
}
