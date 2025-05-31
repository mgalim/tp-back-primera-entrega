import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { loginSchema } from '../validations/schemas.js';
import { validateSchema } from '../middleware/validation.middleware.js';

const router = Router();

router.post(
  '/login',
  validateSchema(loginSchema),
  authController.login.bind(authController)
);

export default router;
