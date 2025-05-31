import BaseController from './base.controller.js';
import { Sale } from '../models/sale.js';
import { User } from '../models/user.js';
import { Discount } from '../models/discount.js';
class SaleController extends BaseController {
  constructor() {
    super(Sale, ['products.product']);
  }

  async create(req, res) {
    try {
      const { products, customer, user } = req.body;
      const userFound = await User.findOne({ email: user });
      const sale = new this.model({
        products,
        customer,
        user: userFound._id ? userFound._id : null,
      });
      sale.total = await this.calculateTotal(sale);
      await sale.save();
      res.status(201).json({
        message: 'Venta creada con éxito',
        sale,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
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
