
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'vendor' | 'customer';
  address: string;
}

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'vendor', 'customer'], default: 'customer' },
  address: { type: String, default: '' },
}, {
  timestamps: true,
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
