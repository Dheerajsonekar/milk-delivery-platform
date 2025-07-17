
import { Request, Response } from 'express'
import Order from '../models/Order'

export const getVendorOrdersStats = async (req: Request, res: Response) => {
  try {
    if(!req.user){
      return res.status(401).json({ message: 'Unauthorized' })
    }
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
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch order stats', error: err.message })
  }
}




export const markOrderAsDelivered = async (req: Request, res: Response) => {
   if(!req.user){
      return res.status(401).json({ message: 'Unauthorized' })
    }
  const vendorId = req.user.id
  const { orderId } = req.params

  try {
    const order = await Order.findOne({ _id: orderId, vendorId })

    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.status === 'delivered') return res.status(400).json({ message: 'Already delivered' })

    order.status = 'delivered'
    await order.save()

    res.json({ success: true, message: 'Order marked as delivered' })
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to mark order', error: error.message })
  }
}

