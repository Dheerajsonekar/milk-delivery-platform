import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  unit: string;
  quantity?: number;
  vendorId: mongoose.Types.ObjectId;
  image?: string;
  description: string;
  embedding?: number[];
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, default: 'liter' },
    quantity: Number,
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String },
    description: { type: String, default: '' },
    
    embedding: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
