import { Product } from '../models/product.js';
import { Discount } from '../models/discount.js';

class CustomerController {
  async getDashboard(req, res) {
    try {
      const products = await Product.find().select('name description price stock');
      const discount = await Discount.findOne({
        user: req.user._id.toString(),
      });

      res.render('customer-dashboard', {
        products,
        discount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error loading dashboard' });
    }
  }
}

export default new CustomerController();
