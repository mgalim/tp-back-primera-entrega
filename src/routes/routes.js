import express from 'express';
import productRoutes from './product.routes.js';
import saleRoutes from './sale.routes.js';
import supplierRoutes from './supplier.routes.js';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import customerRoutes from './customer.routes.js';

const router = express.Router();

// Ruta principal
router.get('/', (req, res) => {
  res.render('home');
});

// Montar las rutas
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/customer', customerRoutes);
export default router;
