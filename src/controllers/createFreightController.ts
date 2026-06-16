import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { FreightService } from '../services/freight.service';
import { CreateFreightSchema } from '../validators';

export async function createFreightController(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const validatedData = CreateFreightSchema.parse(req.body);
    const freight = await FreightService.createFreight(req.user.id, validatedData);
    return res.status(201).json(freight);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Erro ao criar frete' });
  }
}
