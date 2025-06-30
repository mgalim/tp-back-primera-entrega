import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/validation.middleware.js';
import { updateUserSchema, userSchema } from '../validations/schemas.js';

const router = Router();

// Rutas CRUD básicas
router.get(
  '/',
  authenticate('api'),
  authorize('administrador'),
  userController.getAll.bind(userController)
);
router.get(
  '/discount',
  authenticate('api'),
  userController.getDiscountByEmail.bind(userController)
);
router.get(
  '/:id',
  authenticate('api'),
  authorize('administrador'),
  userController.getById.bind(userController)
);
router.post(
  '/',
  authenticate('api'),
  authorize('administrador'),
  validateSchema(userSchema),
  userController.create.bind(userController)
);
router.put(
  '/:id',
  authenticate('api'),
  authorize('administrador'),
  validateSchema(updateUserSchema),
  userController.update.bind(userController)
);
router.delete(
  '/:id',
  authenticate('api'),
  authorize('administrador'),
  userController.delete.bind(userController)
);

// Rutas específicas para gestión de roles
router.get(
  '/role/:role',
  authenticate('api'),
  authorize('administrador'),
  userController.getByRole.bind(userController)
);
router.patch(
  '/:id/role',
  authenticate('api'),
  authorize('administrador'),
  userController.updateRole.bind(userController)
);

export default router;
