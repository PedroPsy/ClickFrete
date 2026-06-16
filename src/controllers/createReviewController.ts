import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { FreightService } from '../services/freight.service';
import { CreateReviewSchema } from '../validators';

export async function createReviewController(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const validatedData = CreateReviewSchema.parse(req.body);
    const review = await FreightService.createReview(validatedData, req.user.id);
    return res.status(201).json(review);
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({ error: error.message });
  }
}
