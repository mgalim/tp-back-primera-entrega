import { Types } from 'mongoose';
import { Product } from '../models/product.js';
import { Supplier } from '../models/supplier.js';
import BaseController from './base.controller.js';

class ProductController extends BaseController {
  constructor() {
    super(Product);
  }

  async create(req, res) {
    try {
      const { name, description, price, stock, category, supplier, isbn } =
        req.body;

      const supplierFound = await Supplier.findById(supplier);
      // Chequear que el supplier exista
      if (!supplierFound) {
        return res.status(404).json({ message: 'Proveedor no encontrado' });
      }
      let productResponse;
      const foundProductBySupplier = await Product.findOne({
        isbn,
      });
      if (foundProductBySupplier) {
        console.log('Producto encontrado');
        foundProductBySupplier.stock += stock;
        await foundProductBySupplier.save();
        productResponse = foundProductBySupplier;
      } else {
        console.log('Producto no encontrado, creando uno nuevo');
        const product = new Product({
          name,
          description,
          price,
          stock,
          category,
          isbn,
        });
        const savedProduct = await product.save();
        productResponse = await Product.findById(savedProduct._id);
      }
      const indexFound = supplierFound.products.findIndex(
        (p) => p._id == productResponse._id
      );
      if (indexFound == -1) {
        supplierFound.products.push(productResponse);
        await supplierFound.save();
      }
      res.status(201).json({
        message: 'Producto creado correctamente',
        data: productResponse,
      });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ message: error.message | 'Error al crear el producto' });
    }
  }

  async getByCategory(req, res) {
    try {
      const products = await this.model.find({ category: req.params.category });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateStock(req, res) {
    try {
      const { quantity } = req.body;
      if (!quantity)
        return res.status(400).json({ message: 'Quantity is required' });
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
