import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";

export async function listClientFreightsController(
  req: AuthRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  const freights = await prisma.freight.findMany({
    where: {
      clientId: req.user.id,
    },
    include: {
      driver: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
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
