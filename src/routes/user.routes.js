import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { validateSchema } from '../middleware/validation.middleware.js';
import { updateUserSchema, userSchema } from '../validations/schemas.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Rutas CRUD básicas
router.get(
  '/',
  authenticate,
  authorize('administrador'),
  userController.getAll.bind(userController)
);
router.get(
  '/discount',
  authenticate,
  userController.getDiscountByEmail.bind(userController)
);
router.get(
  '/:id',
  authenticate,
  authorize('administrador'),
  userController.getById.bind(userController)
);
router.post(
  '/',
  authenticate,
  authorize('administrador'),
  validateSchema(userSchema),
  userController.create.bind(userController)
);
router.put(
  '/:id',
  authenticate,
  authorize('administrador'),
  validateSchema(updateUserSchema),
  userController.update.bind(userController)
);
router.delete(
  '/:id',
  authenticate,
  authorize('administrador'),
  userController.delete.bind(userController)
);

// Rutas específicas para gestión de roles
router.get(
  '/role/:role',
  authenticate,
  authorize('administrador'),
  userController.getByRole.bind(userController)
);
router.patch(
  '/:id/role',
  authenticate,
  authorize('administrador'),
  userController.updateRole.bind(userController)
);

export default router;
