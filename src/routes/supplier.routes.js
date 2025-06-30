import express from 'express';
import supplierController from '../controllers/supplier.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/validation.middleware.js';
import { supplierSchema } from '../validations/schemas.js';

const router = express.Router();

router.get(
  '/',
  authenticate('api'),
  authorize('administrador'),
  supplierController.getAll.bind(supplierController)
);
router.get(
  '/:id',
  authenticate('api'),
  authorize('administrador'),
  supplierController.getById.bind(supplierController)
);
router.post(
  '/',
  authenticate('api'),
  authorize('administrador'),
  validateSchema(supplierSchema),
  supplierController.create.bind(supplierController)
);
router.put(
  '/:id',
  authenticate('api'),
  authorize('administrador'),
  validateSchema(supplierSchema),
  supplierController.update.bind(supplierController)
);
router.delete(
  '/:id',
  authenticate('api'),
  authorize('administrador'),
  supplierController.delete.bind(supplierController)
);
router.get(
  '/category/:category',
  authenticate('api'),
  authorize('administrador'),
  supplierController.getByCategory.bind(supplierController)
);
router.get(
  '/active',
  authenticate('api'),
  authorize('administrador'),
  supplierController.getActiveSuppliers.bind(supplierController)
);

export default router;
