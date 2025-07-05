import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

const app = express();

// Load env variables
dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json());

// Routes
app.use('/api', authRoutes);

// TODO: Add product, cart, order, etc. routes here later

export default app;