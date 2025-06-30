import express from 'express';
import productController from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/validation.middleware.js';
import { productSchema, updateProductSchema } from '../validations/schemas.js';

const router = express.Router();

// Proteger ruta de obtener todos los productos
router.get(
  '/',
  authenticate('api'),
  authorize('administrador'),
  productController.getAll.bind(productController)
);

// Proteger catálogo para usuarios autenticados
router.get(
  '/catalog',
  authenticate('view'),
  productController.getCatalog.bind(productController)
);

// Proteger obtener producto por ID
router.get(
  '/:id',
  authenticate('api'),
  authorize('administrador'),
  productController.getById.bind(productController)
);

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

// Proteger obtener por categoría
router.get(
  '/category/:category',
  authenticate('api'),
  authorize('administrador'),
  productController.getByCategory.bind(productController)
);

router.put(
  '/:id/stock',
  authenticate('api'),
  authorize('administrador'),
  productController.updateStock.bind(productController)
);

export default router;
