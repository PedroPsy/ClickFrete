import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterSchema } from '../validators';

export async function registerController(req: any, res: Response) {
  try {
    const validatedData = RegisterSchema.parse(req.body);
    const result = await AuthService.register(validatedData);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao registrar usuário' });
  }
}
