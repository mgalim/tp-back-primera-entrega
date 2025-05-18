import express from 'express';
import supplierController from '../controllers/supplier.controller.js';
import { validateSchema } from '../middleware/validation.middleware.js';
import { supplierSchema } from '../validations/schemas.js';

const router = express.Router();

router.get('/', supplierController.getAll.bind(supplierController));
router.get('/:id', supplierController.getById.bind(supplierController));
router.post(
  '/',
  validateSchema(supplierSchema),
  supplierController.create.bind(supplierController)
);
router.put(
  '/:id',
  validateSchema(supplierSchema),
  supplierController.update.bind(supplierController)
);
router.delete('/:id', supplierController.delete.bind(supplierController));
router.get(
  '/category/:category',
  supplierController.getByCategory.bind(supplierController)
);
router.get(
  '/active',
  supplierController.getActiveSuppliers.bind(supplierController)
);

export default router;
