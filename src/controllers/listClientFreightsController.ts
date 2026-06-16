import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { FreightService } from '../services/freight.service';

export async function listClientFreightsController(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);

    const result = await FreightService.getClientFreights(req.user.id, page, limit);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar fretes' });
  }
}
