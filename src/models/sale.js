import mongoose, { Types } from 'mongoose';
// import { Discount } from './discount';

const saleSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'La cantidad debe ser al menos 1'],
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  customer: {
    name: String,
    email: String,
  },
  user: {
    ref: 'User',
    type: Types.ObjectId,
  },
  discount: {
    type: Types.ObjectId,
    ref: 'Discount',
  },
});

export const Sale = mongoose.model('Sale', saleSchema);
