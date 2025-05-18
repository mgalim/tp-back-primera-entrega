import express from 'express';
import productController from '../controllers/product.controller.js';
import { validateSchema } from '../middleware/validation.middleware.js';
import { productSchema } from '../validation/schemas.js';

const router = express.Router();

router.get('/', productController.getAll.bind(productController));
router.get('/catalog', productController.getCatalog.bind(productController));
router.get('/:id', productController.getById.bind(productController));
router.post(
  '/',
  validateSchema(productSchema),
  productController.create.bind(productController)
);
router.put(
  '/:id',
  validateSchema(productSchema),
  productController.update.bind(productController)
);
router.delete('/:id', productController.delete.bind(productController));
router.get(
  '/category/:category',
  productController.getByCategory.bind(productController)
);
router.put('/:id/stock', productController.updateStock.bind(productController));

export default router;
