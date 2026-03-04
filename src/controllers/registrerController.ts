import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../prisma/client";

export async function registerController(req: Request, res: Response) {
  const { name, email, password, role, phone } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email }
  });

  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      phone
    }
  });

  return res.status(201).json(user);
}