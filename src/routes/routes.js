import express from 'express';
import productRoutes from './product.routes.js';
import saleRoutes from './sale.routes.js';
import supplierRoutes from './supplier.routes.js';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import customerRoutes from './customer.routes.js';

const router = express.Router();

// Ruta principal - DEBE MANTENERSE PÚBLICA
router.get('/', (req, res) => {
  res.render('home');
});

// Rutas de autenticación - PÚBLICAS
router.use('/auth', authRoutes);

// Rutas protegidas
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/users', userRoutes);
router.use('/customer', customerRoutes);

export default router;
