import BaseController from './base.controller.js';
import { Sale } from '../models/sale.js';
import { User } from '../models/user.js';
import { Discount } from '../models/discount.js';
import { Product } from '../models/product.js';

class SaleController extends BaseController {
  constructor() {
    super(Sale, ['products.product', 'user']);
  }

  async create(req, res) {
    try {
      const { products, customer, user } = req.body;

      // Validar que se reciban productos
      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          message: 'Se requiere un array de productos válido',
        });
      }

      // Buscar usuario por email
      const userFound = await User.findOne({ email: user });

      // Validar stock y recopilar errores antes de procesar la venta
      const stockErrors = [];
      const stockValidations = [];

      for (const item of products) {
        const { product: productId, quantity } = item;

        if (!productId || !quantity || quantity <= 0) {
          stockErrors.push({
            productId: productId || 'ID no proporcionado',
            error: 'ID del producto y cantidad válida requeridos',
          });
          continue;
        }

        // Buscar producto y validar stock
        const productFound = await Product.findById(productId);

        if (!productFound) {
          stockErrors.push({
            productId,
            error: 'Producto no encontrado',
          });
          continue;
        }

        if (productFound.stock < quantity) {
          stockErrors.push({
            productId,
            productName: productFound.name,
            error: `Stock insuficiente. Disponible: ${productFound.stock}, Solicitado: ${quantity}`,
            availableStock: productFound.stock,
            requestedQuantity: quantity,
          });
          continue;
        }

        // Agregar a validaciones exitosas
        stockValidations.push({
          product: productFound,
          quantity,
          price: item.price,
        });
      }

      // Si hay errores de stock, devolver errores sin procesar la venta
      if (stockErrors.length > 0) {
        return res.status(400).json({
          message: 'Errores de validación de stock',
          errors: stockErrors,
          summary: {
            totalProducts: products.length,
            validProducts: stockValidations.length,
            invalidProducts: stockErrors.length,
          },
        });
      }

      // Si todo está validado, proceder con la venta y reducir stock
      const updatedProducts = [];

      for (const validation of stockValidations) {
        const { product, quantity, price } = validation;

        // Reducir stock
        product.stock -= quantity;
        await product.save();

        // Preparar producto para la venta
        updatedProducts.push({
          product: product._id,
          quantity,
          price,
          productName: product.name, // Para referencia
          remainingStock: product.stock, // Para logging
        });
      }
      // Crear la venta
      const sale = new this.model({
        products: products, // Usar los productos originales para la venta
        customer,
        user: userFound?._id || null,
      });

      // Calcular total con descuentos
      sale.total = await this.calculateTotal(sale);
      await sale.save();

      // Respuesta exitosa con información de stock actualizado
      res.status(201).json({
        message: 'Venta creada con éxito',
        sale,
        stockUpdates: updatedProducts.map((p) => ({
          productId: p.product,
          productName: p.productName,
          quantitySold: p.quantity,
          remainingStock: p.remainingStock,
        })),
        summary: {
          totalProducts: products.length,
          totalAmount: sale.total,
          stockReduced: true,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: 'Error al procesar la venta',
        error: error.message,
      });
    }
  }

  async getByDate(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const query = {};
      console.log(startDate, endDate);
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
          return res.status(400).json({ message: 'Fechas inválidas' });
        }
        end.setUTCHours(23, 59, 59, 999);
        console.log(end);
        query.date = { $gte: start, $lte: end };
      }

      const sales = await this.model
        .find(query)
        .populate('products.product')
        .populate('customer');
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTotalSales(req, res) {
    try {
      const sales = await this.model.find();
      const total = sales.reduce((acc, sale) => {
        return acc + sale.total;
      }, 0);
      res.status(200).json({ total });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTopProducts(req, res) {
    try {
      const result = await this.model.aggregate([
        { $unwind: '$products' },
        {
          $group: {
            _id: '$products.product',
            totalQuantity: { $sum: '$products.quantity' },
            totalRevenue: {
              $sum: { $multiply: ['$products.quantity', '$products.price'] },
            },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        { $unwind: '$productDetails' },
      ]);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSalesByPeriod(req, res) {
    try {
      const { period } = req.query;
      const now = new Date();
      const startDate = new Date();

      switch (period) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          return res
            .status(400)
            .json({ message: 'Período inválido. Use "week" o "month".' });
      }

      const sales = await this.model.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: now },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: period === 'week' ? '%Y-%m-%d' : '%Y-%m',
                date: '$date',
              },
            },
            totalSales: { $sum: '$total' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async calculateTotal(sale) {
    console.log(sale);
    try {
      let discountF = 0;
      let subtotal = sale.products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (sale.user) {
        const discount = await Discount.findOne({
          user: sale.user,
        });

        if (discount) {
          if (discount.accumulated >= 10000) {
            discountF = discount.discountPercentage || 0;
            discount.accumulated = 0;
            await discount.save();
          } else {
            discount.accumulated += subtotal;
            await discount.save();
          }
        } else {
          const newDiscount = new Discount({
            user: sale.user,
            discountPercentage: 20,
            accumulated: subtotal,
          });
          await newDiscount.save();
        }
      }

      const finalTotal = subtotal - (subtotal * discountF) / 100;
      return finalTotal;
    } catch (error) {
      throw error;
    }
  }
}

export default new SaleController();