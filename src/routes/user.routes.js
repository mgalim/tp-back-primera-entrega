import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { validateSchema } from '../middleware/validation.middleware.js';
import { userSchema } from '../validation/schemas.js';

const router = Router();

// Rutas CRUD básicas
router.get('/', userController.getAll.bind(userController));
router.get('/:id', userController.getById.bind(userController));
router.post(
  '/',
  validateSchema(userSchema),
  userController.create.bind(userController)
);
router.put(
  '/:id',
  validateSchema(userSchema),
  userController.update.bind(userController)
);
router.delete('/:id', userController.delete.bind(userController));

// Rutas específicas para gestión de roles
router.get('/role/:role', userController.getByRole.bind(userController));
router.patch('/:id/role', userController.updateRole.bind(userController));

export default router;
