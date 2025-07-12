import app from './app';
import { connectMongoDB, connectPostgres } from './config/db';
import Payout from './models/Payout';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectMongoDB(); 
  await connectPostgres();

  await Payout.sync();
  console.log('PostgreSQL database connected successfully');

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
