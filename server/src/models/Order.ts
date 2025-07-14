import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'delivered', 'cancelled'], default: 'pending' },
    cancelReason: {
      type: String,
      default: ''
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },

    paymentStatus: { type: String, enum: ['paid', 'unpaid'], default: 'paid' },
    vendorPaid: { type: Boolean, default: false },


    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String }
    }

  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)
