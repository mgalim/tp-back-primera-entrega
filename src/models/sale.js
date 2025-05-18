import mongoose from 'mongoose';

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
});

// Método para calcular el total de la venta
saleSchema.pre('save', function (next) {
  this.total = this.products.reduce((sum, item) => {
    return sum + item.quantity * item.price;
  }, 0);
  next();
});

export const Sale = mongoose.model('Sale', saleSchema);
