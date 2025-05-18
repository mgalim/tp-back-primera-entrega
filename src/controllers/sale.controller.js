import BaseController from './base.controller.js';
import { Sale } from '../models/sale.js';

/**
 * Controlador para gestionar las ventas
 * @extends BaseController
 */
class SaleController extends BaseController {
  constructor() {
    super(Sale, ['products.product']);
  }

  /**
   * Obtiene ventas por rango de fechas
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Object} req.query - Parámetros de consulta
   * @param {string} [req.query.startDate] - Fecha inicial (YYYY-MM-DD)
   * @param {string} [req.query.endDate] - Fecha final (YYYY-MM-DD)
   * @returns {Promise<Response>} Lista de ventas filtradas por fecha
   */
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

  /**
   * Calcula el total de todas las ventas
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<Response>} Total acumulado de ventas
   */
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

  /**
   * Obtiene los 10 productos más vendidos
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<Response>} Lista de productos top con cantidad y revenue
   */
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

  /**
   * Obtiene ventas agrupadas por período (semana/mes)
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Object} req.query - Parámetros de consulta
   * @param {('week'|'month')} req.query.period - Período de agrupación
   * @returns {Promise<Response>} Ventas agrupadas por período
   */
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
}

export default new SaleController();
