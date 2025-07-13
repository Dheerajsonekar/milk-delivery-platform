import { Request, Response } from 'express'
import Order from '../models/Order'
import User from '../models/User'

export const getAdminReport = async (req: Request, res: Response) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const totalRevenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    const totalRevenue = totalRevenueAgg[0]?.total || 0

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    })

    const newVendors = await User.countDocuments({
      role: 'vendor',
      createdAt: { $gte: today }
    })

    const newCustomers = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: today }
    })

    const totalProfit = totalRevenue * 0.1 // assuming 10% profit margin

    res.json({
      totalRevenue,
      todayOrders,
      newVendors,
      newCustomers,
      totalProfit
    })
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to generate report', error: err.message })
  }
}
