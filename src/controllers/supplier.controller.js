import { Supplier } from '../models/supplier.js';
import BaseController from './base.controller.js';

class SupplierController extends BaseController {
  constructor() {
    super(Supplier);
  }

  async getByCategory(req, res) {
    try {
      const suppliers = await this.model.find({
        category: req.params.category,
      });
      res.status(200).json(suppliers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getActiveSuppliers(req, res) {
    try {
      const suppliers = await this.model.find({ status: 'activo' });
      res.status(200).json(suppliers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new SupplierController();
