import { Router } from 'express';
import { registerController } from '../controllers/registerController';
import { loginController } from '../controllers/loginController';
import { createFreightController } from '../controllers/createFreightController';
import { acceptFreightController } from '../controllers/acceptFreightController';
import { listAvailableFreightsController } from '../controllers/listAvailableFreightsController';
import { finishFreightController } from '../controllers/finishFreightController';
import { startFreightController } from '../controllers/startFreightController';
import { cancelFreightController } from '../controllers/cancelFreightController';
import { meController } from '../controllers/meController';
import { listClientFreightsController } from '../controllers/listClientFreightsController';
import { listDriverFreightsController } from '../controllers/listDriverFreightsController';
import { createReviewController } from '../controllers/createReviewController';

import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { queryValidationMiddleware, validationMiddleware } from '../middlewares/validationMiddleware';
import { RegisterSchema, LoginSchema, CreateFreightSchema, CreateReviewSchema, PaginationSchema } from '../validators';
import { UserRole } from '../types';

const router = Router();

// ==================== AUTH ====================
router.post('/register', validationMiddleware(RegisterSchema), registerController);
router.post('/login', validationMiddleware(LoginSchema), loginController);
router.get('/me', authMiddleware, meController);

// ==================== FREIGHTS ====================
// Create freight (CLIENT only)
router.post(
  '/freights',
  authMiddleware,
  roleMiddleware(UserRole.CLIENT),
  validationMiddleware(CreateFreightSchema),
  createFreightController
);

// List available freights (DRIVER only)
router.get(
  '/freights/available',
  authMiddleware,
  roleMiddleware(UserRole.DRIVER),
  queryValidationMiddleware(PaginationSchema),
  listAvailableFreightsController
);

// Accept freight (DRIVER only)
router.patch(
  '/freights/:id/accept',
  authMiddleware,
  roleMiddleware(UserRole.DRIVER),
  acceptFreightController
);

// Start freight (DRIVER only)
router.patch(
  '/freights/:id/start',
  authMiddleware,
  roleMiddleware(UserRole.DRIVER),
  startFreightController
);

// Finish freight (DRIVER only)
router.patch(
  '/freights/:id/finish',
  authMiddleware,
  roleMiddleware(UserRole.DRIVER),
  finishFreightController
);

// Cancel freight (CLIENT or DRIVER)
router.patch(
  '/freights/:id/cancel',
  authMiddleware,
  cancelFreightController
);

// List client freights (CLIENT only)
router.get(
  '/freights/client',
  authMiddleware,
  roleMiddleware(UserRole.CLIENT),
  queryValidationMiddleware(PaginationSchema),
  listClientFreightsController
);

// List driver freights (DRIVER only)
router.get(
  '/freights/driver',
  authMiddleware,
  roleMiddleware(UserRole.DRIVER),
  queryValidationMiddleware(PaginationSchema),
  listDriverFreightsController
);

// ==================== REVIEWS ====================
router.post(
  '/reviews',
  authMiddleware,
  roleMiddleware(UserRole.CLIENT),
  validationMiddleware(CreateReviewSchema),
  createReviewController
);

export { router };
