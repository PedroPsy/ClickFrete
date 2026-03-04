import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { prisma } from "../../prisma/client";

export async function createFreightController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { pickupAddress, dropoffAddress, price } = req.body;

    if (!pickupAddress || !dropoffAddress || !price) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const freight = await prisma.freight.create({
      data: {
        pickupAddress,
        dropoffAddress,
        price: Number(price),
        clientId: req.user.id,
        status: "REQUESTED",
      },
    });

    return res.status(201).json(freight);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao criar frete",
    });
  }
}
