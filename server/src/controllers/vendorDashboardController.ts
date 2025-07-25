import { Request, Response } from 'express';
import { fn, col } from 'sequelize';
import Order from '../models/Order';
import Product from '../models/Product';
import Payout from '../models/Payout';

export const getVendorDashboard = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const vendorId = req.user.id;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const pendingOrdersToday = await Order.countDocuments({
      vendorId,
      status: 'pending',
      createdAt: { $gte: todayStart, $lte: todayEnd }
    });

    const pendingOrders = await Order.find({
      vendorId,
      status: 'pending',
      createdAt: { $gte: todayStart, $lte: todayEnd }
    })
      .populate('customerId', 'email')
      .select('_id customerId createdAt totalAmount')
      .sort({ createdAt: -1 })
      .lean();

    const totalEarnings = await Order.aggregate([
      { $match: { vendorId, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Fix: Use unknown first, then safely access the result
    const pendingPayoutResult = await Payout.findAll({
      where: { vendorId, status: 'requested' },
      attributes: [[fn('SUM', col('amount')), 'total']],
      raw: true
    }) as unknown as Array<{ total: number | null }>;

    const lowStockProducts = await Product.find({
      vendorId,
      quantity: { $lt: 10 }
    }).select('name quantity unit');

    // Loyal customers = customers who ordered > 2 times from this vendor
    const orders = await Order.find({ vendorId }).populate('customerId', 'email');
    const loyaltyMap = new Map();
    orders.forEach(order => {
      const cid = order.customerId.toString();
      loyaltyMap.set(cid, (loyaltyMap.get(cid) || 0) + 1);
    });
    const loyalCustomers = [...loyaltyMap.values()].filter(n => n > 2).length;

    res.json({
      pendingOrdersToday,
      pendingOrders,
      totalEarnings: totalEarnings[0]?.total || 0,
      pendingPayout: pendingPayoutResult[0]?.total || 0,
      loyalCustomers,
      lowStockProducts
    });

  } catch (err) {
    // Fix: Type the error properly
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ 
      message: 'Failed to fetch vendor dashboard', 
      error: errorMessage 
    });
  }
};