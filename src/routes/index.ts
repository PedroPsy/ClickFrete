import { Router } from "express";

import { registerController } from "../controllers/registerController";
import { loginController } from "../controllers/loginController";
import { createFreightController } from "../controllers/createFreightController";
import { acceptFreightController } from "../controllers/acceptFreightController";
import { listAvailableFreightsController } from "../controllers/listAvailableFreightsController";
import { finishFreightController } from "../controllers/finishFreightController";
import { startFreightController } from "../controllers/startFreightController";
import { cancelFreightController } from "../controllers/cancelFreightController";
import { meController } from "../controllers/meController";
import { listClientFreightsController } from "../controllers/listClientFreightsController";
import { listDriverFreightsController } from "../controllers/listDriverFreightsController";
import { createReviewController } from "../controllers/createReviewController";
import { updateDriverStatusController } from "../controllers/updateDriverStatusController";

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
  "/freights/:id/start",
  authMiddleware,
  roleMiddleware("DRIVER"),
  startFreightController
);

router.patch(
  "/freights/:id/finish",
  authMiddleware,
  roleMiddleware("DRIVER"),
  finishFreightController
);

router.patch(
  "/freights/:id/cancel",
  authMiddleware,
  cancelFreightController
);

router.get(
  "/freights/client",
  authMiddleware,
  roleMiddleware("CLIENT"),
  listClientFreightsController
);

router.get(
  "/freights/driver",
  authMiddleware,
  roleMiddleware("DRIVER"),
  listDriverFreightsController
);


router.patch(
  "/drivers/status",
  authMiddleware,
  roleMiddleware("DRIVER"),
  updateDriverStatusController
);

router.post(
  "/reviews",
  authMiddleware,
  roleMiddleware("CLIENT"),
  createReviewController
);

export { router };
