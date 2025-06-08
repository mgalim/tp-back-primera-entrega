import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  stock: {
    type: Number,
    required: true,
    min: [0, 'El stock no puede ser negativo'],
  },
  category: {
    type: String,
    enum: ['libro', 'revista', 'articulo'],
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
});

export const Product = mongoose.model('Product', productSchema);
