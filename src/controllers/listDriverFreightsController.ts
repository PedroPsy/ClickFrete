import { Response } from 'express';
import { prisma } from '../prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import { FreightService } from '../services/freight.service';
import { PaginationInput } from '../validators';

type PaginatedAuthRequest = AuthRequest & {
  validatedData: PaginationInput;
};

export async function listDriverFreightsController(req: PaginatedAuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const driver = await prisma.driver.findUnique({
      where: { userId: req.user.id },
    });

    if (!driver) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    const { page, limit } = req.validatedData;

    const result = await FreightService.getDriverFreights(driver.id, page, limit);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar fretes' });
  }
}
