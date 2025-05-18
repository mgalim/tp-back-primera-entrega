import BaseController from './base.controller.js';
import { Product } from '../models/product.js';
import { Supplier } from '../models/supplier.js';
import { Types } from 'mongoose';

/**
 * Controlador para gestionar productos
 * @extends BaseController
 */
class ProductController extends BaseController {
  constructor() {
    super(Product, ['supplier']);
  }

  async create(req, res) {
    try {
      const { name, description, price, stock, category, supplier } = req.body;

      if (!Types.ObjectId.isValid(supplier)) {
        return res.status(400).json({ message: 'ID de proveedor inválido' });
      }

      const supplierFound = await Supplier.findById(supplier);

      if (!supplierFound) {
        return res.status(404).json({ message: 'Proveedor no encontrado' });
      }
      const product = new Product({
        name,
        description,
        price,
        stock,
        category,
        supplier: supplierFound._id,
      });
      (await product.save()).populate('supplier');
      res.status(201).json({
        message: 'Producto creado correctamente',
        data: product,
      });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ message: error.message | 'Error al crear el producto' });
    }
  }

  /**
   * Obtiene productos por categoría
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Object} req.params - Parámetros de ruta
   * @param {('libro'|'revista'|'articulo')} req.params.category - Categoría del producto
   * @returns {Promise<Response>} Lista de productos de la categoría especificada
   */
  async getByCategory(req, res) {
    try {
      const products = await this.model.find({ category: req.params.category });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Actualiza el stock de un producto
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @param {Object} req.params - Parámetros de ruta
   * @param {string} req.params.id - ID del producto
   * @param {Object} req.body - Datos para actualizar
   * @param {number} req.body.quantity - Cantidad a agregar/restar del stock (positivo para agregar, negativo para restar)
   * @returns {Promise<Response>} Producto actualizado
   */
  async updateStock(req, res) {
    try {
      const { quantity } = req.body;
      const product = await this.model.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      product.stock += quantity;
      await product.save();

      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getCatalog(req, res) {
    const { category } = req.query;
    if (category) {
      Product.find({ category })
        .populate('supplier')
        .then((products) => {
          res.render('catalog', { products, currentCategory: category });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error al obtener los productos');
        });
    } else {
      Product.find()
        .populate('supplier')
        .then((products) => {
          res.render('catalog', { products });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error al obtener los productos');
        });
    }
  }
}

export default new ProductController();
