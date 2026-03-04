import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validateMiddleware(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.errors,
      });
    }
  };
}