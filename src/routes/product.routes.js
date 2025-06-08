import express from 'express';
import productController from '../controllers/product.controller.js';
import { validateSchema } from '../middleware/validation.middleware.js';
import { productSchema, updateProductSchema } from '../validations/schemas.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', productController.getAll.bind(productController));
router.get('/catalog', productController.getCatalog.bind(productController));
router.get('/:id', productController.getById.bind(productController));
router.post(
  '/',
  authenticate('api'),
  authorize('administrador'),
  validateSchema(productSchema),
  productController.create.bind(productController)
);
router.put(
  '/:id',
  authenticate('api'),
  authorize('administrador'),
  validateSchema(updateProductSchema),
  productController.update.bind(productController)
);
router.delete(
  '/:id',
  authenticate('api'),
  authorize('administrador'),
  productController.delete.bind(productController)
);
router.get(
  '/category/:category',
  productController.getByCategory.bind(productController)
);
router.put(
  '/:id/stock',
  authenticate('api'),
  authorize('administrador'),
  productController.updateStock.bind(productController)
);

export default router;
