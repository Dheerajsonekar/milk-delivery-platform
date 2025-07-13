// controllers/vendorOrderController.ts
import { Request, Response } from 'express'
import Order from '../models/Order'

export const getVendorOrdersStats = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id

    const totalOrders = await Order.countDocuments({ vendorId })

    const ordersDelivered = await Order.countDocuments({
      vendorId,
      status: 'delivered'
    })

    const ordersCancelled = await Order.find({
      vendorId,
      status: 'cancelled'
    }).select('cancelReason')

    const cancelReasonsCount: Record<string, number> = {}

    ordersCancelled.forEach(order => {
      const reason = order.cancelReason || 'Other'
      cancelReasonsCount[reason] = (cancelReasonsCount[reason] || 0) + 1
    })

    const feedbacks = await Order.find({
      vendorId,
      'feedback.rating': { $exists: true }
    }).select('feedback')

    res.json({
      totalOrders,
      ordersDelivered,
      totalCancelled: ordersCancelled.length,
      cancelReasonsCount,
      feedbacks
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order stats', error: err.message })
  }
}
