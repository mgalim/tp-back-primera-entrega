import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { loginSchema } from '../validations/schemas.js';
import { validateSchema } from '../middleware/validation.middleware.js';

const router = Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  validateSchema(loginSchema),
  authController.login.bind(authController)
);

export default router;
