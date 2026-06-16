import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { FreightService } from '../services/freight.service';

export async function listAvailableFreightsController(req: AuthRequest, res: Response) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);

    const result = await FreightService.listAvailableFreights(page, limit);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar fretes' });
  }
}
