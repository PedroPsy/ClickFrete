import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { AuthService } from '../services/auth.service';
import { UnauthorizedError } from '../utils/AppError';

export async function meController(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      throw new UnauthorizedError('Não autenticado');
    }

    const user = await AuthService.getUser(req.user.id);
    return res.json(user);
  } catch (error) {
    return res.status(401).json({ error: 'Erro ao buscar usuário' });
  }
}
