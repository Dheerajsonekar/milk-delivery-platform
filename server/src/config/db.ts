
import mongoose from 'mongoose';

import { Sequelize } from 'sequelize';


// MongoDB Connection
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '', {
      dbName: 'milkDelivery',
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
};

// PostgreSQL Connection
export const sequelize = new Sequelize(
  process.env.PG_DB || '',
  process.env.PG_USER || '',
  process.env.PG_PASS || '',
  {
    host: process.env.PG_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

export const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected');
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err);
    process.exit(1);
  }
};
