import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";

export async function createFreightController(req: AuthRequest, res: Response) {
  const { pickupAddress, dropoffAddress, price } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  const freight = await prisma.freight.create({
    data: {
      clientId: req.user.id,
      pickupAddress,
      dropoffAddress,
      price,
      status: "REQUESTED",
    },
  });

  return res.status(201).json(freight);
}
