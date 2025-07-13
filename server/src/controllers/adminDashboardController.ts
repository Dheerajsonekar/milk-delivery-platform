import { Request, Response } from 'express'
import User from '../models/User'
import Product from '../models/Product'
import Order from '../models/Order'
import Payout from '../models/Payout'
import { sequelize } from '../config/db'

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Using Mongoose countDocuments method
    const totalVendors = await User.countDocuments({ role: 'vendor' })
    const totalCustomers = await User.countDocuments({ role: 'customer' })
    const totalOrders = await Order.countDocuments()
    
    // For Sequelize Payout model - using findAll with aggregation
    const pendingPayoutsResult = await Payout.findAll({
      where: { status: 'requested' },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      raw: true
    }) as any[]
    
    const totalProducts = await Product.countDocuments()

    res.json({
      totalVendors,
      totalCustomers,
      totalOrders,
      pendingPayoutAmount: pendingPayoutsResult[0]?.total || 0,
      totalProducts
    })
  } catch (err: unknown) {
    const error = err as Error
    res.status(500).json({ 
      message: 'Failed to fetch dashboard stats', 
      error: error.message 
    })
  }
}