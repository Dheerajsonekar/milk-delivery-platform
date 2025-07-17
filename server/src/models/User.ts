
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'vendor' | 'customer' | 'deliveryBoy';
  address: string;
  bankDetails: {
    bankName?: string;
    accountNumber?: string;
    ifsc?: string;
  };
  phone: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'vendor', 'customer', 'deliveryBoy'], default: 'customer' },
  address: { type: String, default: '' },
  bankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    ifsc: { type: String },
  },
  phone: {type: String, required: true, unique: true},
}, {
  timestamps: true,
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
