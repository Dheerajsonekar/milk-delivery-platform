import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, default: 'liter' }, 
    quantity: Number,
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String },
    description: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)
