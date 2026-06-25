import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { FreightService } from '../services/freight.service';
import { PaginationInput } from '../validators';

type PaginatedAuthRequest = AuthRequest & {
  validatedData: PaginationInput;
};

export async function listClientFreightsController(req: PaginatedAuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { page, limit } = req.validatedData;

    const result = await FreightService.getClientFreights(req.user.id, page, limit);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar fretes' });
  }
}
