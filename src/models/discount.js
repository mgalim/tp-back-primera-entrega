import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  discountPercentage: {
    type: Number,
    required: true,
    min: [0, 'El descuento no puede ser negativo'],
  },
  accumulated: {
    type: Number,
    required: true,
    min: [0, 'El acumulado no puede ser negativo'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const Discount = mongoose.model('Discount', discountSchema);
