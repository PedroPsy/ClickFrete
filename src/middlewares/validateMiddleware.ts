import { Request, Response, NextFunction } from "express";

type ValidatorSchema = {
  parse: (data: unknown) => unknown;
};

export function validateMiddleware(schema: ValidatorSchema) {
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
