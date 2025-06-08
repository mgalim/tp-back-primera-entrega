import mongoose, { Types } from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  products: [
    {
      type: Types.ObjectId,
      ref: 'Product',
    },
  ],
});

export const Supplier = mongoose.model('Supplier', supplierSchema);
