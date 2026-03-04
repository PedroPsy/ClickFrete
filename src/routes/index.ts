import { Router } from "express";

import { registerController } from "../controllers/registerController";
import { loginController } from "../controllers/loginController";

//import { createFreightController } from "../controllers/createFreightController";

import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

// 🔓 Rotas públicas
router.post("/register", registerController);
router.post("/login", loginController);

// 🔐 Rotas protegidas
router.post(
  "/freights",
  authMiddleware,
  roleMiddleware("CLIENT"),
  //createFreightController
);

export { router };