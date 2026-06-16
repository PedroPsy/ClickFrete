import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginSchema } from '../validators';

export async function loginController(req: any, res: Response) {
  try {
    const validatedData = LoginSchema.parse(req.body);
    const result = await AuthService.login(validatedData);
    return res.json(result);
  } catch (error) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
}
