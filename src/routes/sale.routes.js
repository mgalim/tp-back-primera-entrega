import express from 'express';
import saleController from '../controllers/sale.controller.js';
import { validateSchema } from '../middleware/validation.middleware.js';
import { saleSchema } from '../validation/schemas.js';

const router = express.Router();

// Rutas CRUD básicas
router.get('/', saleController.getAll.bind(saleController));
router.get('/:id', saleController.getById.bind(saleController));
router.post(
  '/',
  validateSchema(saleSchema),
  saleController.create.bind(saleController)
);

// Reportes
router.get('/reports/by-date', saleController.getByDate.bind(saleController));

router.get('/reports/total', saleController.getTotalSales.bind(saleController));

router.get(
  '/reports/top-products',
  saleController.getTopProducts.bind(saleController)
);

router.get(
  '/reports/by-period',
  saleController.getSalesByPeriod.bind(saleController)
);

export default router;
