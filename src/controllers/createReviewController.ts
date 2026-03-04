import { Response } from "express";
import { prisma } from "../prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";

export async function createReviewController(req: AuthRequest, res: Response) {
  const { freightId, rating, comment } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  if (!freightId || rating === undefined) {
    return res.status(400).json({ error: "freightId e rating são obrigatórios" });
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "rating deve ser um número entre 1 e 5" });
  }

  const freight = await prisma.freight.findUnique({
    where: { id: freightId },
  });

  if (!freight) {
    return res.status(404).json({ error: "Frete não encontrado" });
  }

  if (freight.clientId !== req.user.id) {
    return res.status(403).json({ error: "Apenas o cliente do frete pode avaliar" });
  }

  if (freight.status !== "FINISHED") {
    return res.status(400).json({ error: "Review só pode ser criada após o frete ser finalizado" });
  }

  if (!freight.driverId) {
    return res.status(400).json({ error: "Frete sem motorista não pode ser avaliado" });
  }

  const existingReview = await prisma.review.findUnique({
    where: { freightId: freight.id },
  });

  if (existingReview) {
    return res.status(400).json({ error: "Este frete já possui avaliação" });
  }

  const review = await prisma.review.create({
    data: {
      freightId: freight.id,
      rating,
      comment,
      clientId: req.user.id,
      driverId: freight.driverId,
    },
  });

  return res.status(201).json(review);
}
