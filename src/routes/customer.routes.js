import { Router } from 'express';
import customerController from '../controllers/customer.controller.js';
import saleController from '../controllers/sale.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateSchema } from '../middleware/validation.middleware.js';
import { saleSchema } from '../validations/schemas.js';

const router = Router();

// Dashboard del cliente
router.get(
  '/dashboard',
  authenticate('view'),
  customerController.getDashboard.bind(customerController)
);

// Ruta para crear ventas desde el dashboard cliente
router.post(
  '/purchase',
  authenticate('view'),
  validateSchema(saleSchema),
  saleController.create.bind(saleController)
);

export default router;
