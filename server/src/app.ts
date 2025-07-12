import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes';
import productRoutes from "./routes/productRoutes";
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import paymentRoutes from './routes/paymentRoutes';
import vendorRoutes from './routes/vendorRoutes';

const app = express();

// Load env variables


// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json());
app.use(cookieParser()); 

// Routes
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/vendor', vendorRoutes);

// TODO: Add product, cart, order, etc. routes here later

export default app;