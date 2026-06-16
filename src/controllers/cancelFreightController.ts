import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { FreightService } from '../services/freight.service';

export async function cancelFreightController(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id || !req.user?.role) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { id } = req.params;
    const freight = await FreightService.cancelFreight(id, req.user.id, req.user.role);
    return res.json(freight);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
}
