import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export async function listAvailableFreightsController(
  req: Request,
  res: Response
) {
  const freights = await prisma.freight.findMany({
    where: {
      status: "REQUESTED",
      driverId: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json(freights);
}
