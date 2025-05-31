import { Router } from 'express';
import customerController from '../controllers/customer.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get(
  '/dashboard',
  authenticate('view'),
  customerController.getDashboard.bind(customerController)
);

export default router;
