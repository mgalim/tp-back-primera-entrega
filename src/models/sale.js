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

// saleSchema.pre('save', async function () {
//   let discountF = 0;
//   // Chequear si  la venta tiene un usuario asociado y si tiene un descuento asociado al usuario
//   if (this.user) {
//     try {
//       const discount = await Discount.findOne({ user: this.user });

//       if (discount) {
//         discountF = discount.discountPercentage || 0;
//         discount.isUsed = true;
//         await discount.save();
//       }
//     } catch (error) {
//       throw error;
//     }
//   }
//   // Aplicando el descuento si existe y si el usuario tiene un descuento asociado al usuario y si el descuento no ha sido use
//   this.total = this.products.reduce((sum, item) => {
//     return sum + item.quantity * item.price;
//   }, 0);

//   if (discountF > 0) {
//     this.total = this.total * (1 - discountF / 100);
//   }
// });

export const Sale = mongoose.model('Sale', saleSchema);
