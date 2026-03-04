import { Router } from "express";

import { registerController } from "../controllers/registerController";
import { loginController } from "../controllers/loginController";
import { createFreightController } from "../controllers/createFreightController";
import { acceptFreightController } from "../controllers/acceptFreightController";
import { listAvailableFreightsController } from "../controllers/listAvailableFreightsController";
import { finishFreightController } from "../controllers/finishFreightController";
import { meController } from "../controllers/meController";

import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", authMiddleware, meController);

router.post(
  "/freights",
  authMiddleware,
  roleMiddleware("CLIENT"),
  createFreightController
);

router.get(
  "/freights/available",
  authMiddleware,
  roleMiddleware("DRIVER"),
  listAvailableFreightsController
);

router.patch(
  "/freights/:id/accept",
  authMiddleware,
  roleMiddleware("DRIVER"),
  acceptFreightController
);

router.patch(
  "/freights/:id/finish",
  authMiddleware,
  roleMiddleware("DRIVER"),
  finishFreightController
);

export { router };
