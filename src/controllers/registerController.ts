import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";

const validRoles = ["CLIENT", "DRIVER"] as const;

export async function registerController(req: Request, res: Response) {
  const { name, email, password, role, phone, vehicleType, vehiclePlate } = req.body;

  if (!name || !email || !password || !role || !phone) {
    return res.status(400).json({
      error: "name, email, password, role e phone são obrigatórios",
    });
  }

  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "role deve ser CLIENT ou DRIVER" });
  }

  if (role === "DRIVER" && (!vehicleType || !vehiclePlate)) {
    return res.status(400).json({
      error: "vehicleType e vehiclePlate são obrigatórios para motorista",
    });
  }

  const userExists = await prisma.user.findUnique({
    where: { email },
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
      phone,
      driver:
        role === "DRIVER"
          ? {
              create: {
                vehicleType,
                vehiclePlate,
              },
            }
          : undefined,
    },
    include: {
      driver: true,
    },
  });

  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    driver: user.driver,
    createdAt: user.createdAt,
  });
}
