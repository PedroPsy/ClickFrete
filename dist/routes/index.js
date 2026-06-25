"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const registerController_1 = require("../controllers/registerController");
const loginController_1 = require("../controllers/loginController");
const createFreightController_1 = require("../controllers/createFreightController");
const acceptFreightController_1 = require("../controllers/acceptFreightController");
const listAvailableFreightsController_1 = require("../controllers/listAvailableFreightsController");
const finishFreightController_1 = require("../controllers/finishFreightController");
const startFreightController_1 = require("../controllers/startFreightController");
const cancelFreightController_1 = require("../controllers/cancelFreightController");
const meController_1 = require("../controllers/meController");
const listClientFreightsController_1 = require("../controllers/listClientFreightsController");
const listDriverFreightsController_1 = require("../controllers/listDriverFreightsController");
const createReviewController_1 = require("../controllers/createReviewController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const validators_1 = require("../validators");
const types_1 = require("../types");
const router = (0, express_1.Router)();
exports.router = router;
// ==================== AUTH ====================
router.post('/register', (0, validationMiddleware_1.validationMiddleware)(validators_1.RegisterSchema), registerController_1.registerController);
router.post('/login', (0, validationMiddleware_1.validationMiddleware)(validators_1.LoginSchema), loginController_1.loginController);
router.get('/me', authMiddleware_1.authMiddleware, meController_1.meController);
// ==================== FREIGHTS ====================
// Create freight (CLIENT only)
router.post('/freights', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(types_1.UserRole.CLIENT), (0, validationMiddleware_1.validationMiddleware)(validators_1.CreateFreightSchema), createFreightController_1.createFreightController);
// List available freights (DRIVER only)
router.get('/freights/available', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(types_1.UserRole.DRIVER), (0, validationMiddleware_1.queryValidationMiddleware)(validators_1.PaginationSchema), listAvailableFreightsController_1.listAvailableFreightsController);
// Accept freight (DRIVER only)
router.patch('/freights/:id/accept', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(types_1.UserRole.DRIVER), acceptFreightController_1.acceptFreightController);
// Start freight (DRIVER only)
router.patch('/freights/:id/start', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(types_1.UserRole.DRIVER), startFreightController_1.startFreightController);
// Finish freight (DRIVER only)
router.patch('/freights/:id/finish', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(types_1.UserRole.DRIVER), finishFreightController_1.finishFreightController);
// Cancel freight (CLIENT or DRIVER)
router.patch('/freights/:id/cancel', authMiddleware_1.authMiddleware, cancelFreightController_1.cancelFreightController);
// List client freights (CLIENT only)
router.get('/freights/client', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(types_1.UserRole.CLIENT), (0, validationMiddleware_1.queryValidationMiddleware)(validators_1.PaginationSchema), listClientFreightsController_1.listClientFreightsController);
// List driver freights (DRIVER only)
router.get('/freights/driver', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(types_1.UserRole.DRIVER), (0, validationMiddleware_1.queryValidationMiddleware)(validators_1.PaginationSchema), listDriverFreightsController_1.listDriverFreightsController);
// ==================== REVIEWS ====================
router.post('/reviews', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(types_1.UserRole.CLIENT), (0, validationMiddleware_1.validationMiddleware)(validators_1.CreateReviewSchema), createReviewController_1.createReviewController);
