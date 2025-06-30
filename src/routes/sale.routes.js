import express from 'express';
import saleController from '../controllers/sale.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/validation.middleware.js';
import { saleSchema } from '../validations/schemas.js';

const router = express.Router();

// Rutas CRUD básicas
router.get(
  '/',
  authenticate('api'),
  authorize('administrador'),
  saleController.getAll.bind(saleController)
);
router.get(
  '/:id',
  authenticate('api'),
  authorize('administrador'),
  saleController.getById.bind(saleController)
);
router.post(
  '/',
  authenticate('api'),
  authorize('administrador'),
  validateSchema(saleSchema),
  saleController.create.bind(saleController)
);

// Reportes
router.get(
  '/reports/by-date',
  authenticate('api'),
  authorize('administrador'),
  saleController.getByDate.bind(saleController)
);

router.get(
  '/reports/total',
  authenticate('api'),
  authorize('administrador'),
  saleController.getTotalSales.bind(saleController)
);

router.get(
  '/reports/top-products',
  authenticate('api'),
  authorize('administrador'),
  saleController.getTopProducts.bind(saleController)
);

router.get(
  '/reports/by-period',
  authenticate('api'),
  authorize('administrador'),
  saleController.getSalesByPeriod.bind(saleController)
);

export default router;
