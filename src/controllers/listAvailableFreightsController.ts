import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { FreightService } from '../services/freight.service';
import { PaginationInput } from '../validators';

type PaginatedAuthRequest = AuthRequest & {
  validatedData: PaginationInput;
};

export async function listAvailableFreightsController(req: PaginatedAuthRequest, res: Response) {
  try {
    const { page, limit } = req.validatedData;

    const result = await FreightService.listAvailableFreights(page, limit);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar fretes' });
  }
}
