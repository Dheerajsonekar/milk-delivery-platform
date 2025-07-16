import { Request, Response } from 'express';
import DeliveryBoy from '../models/DeliveryBoy';
import Order from '../models/Order';

// GET /deliveryboy/orders
export const getDeliveryOrders = async (req: Request, res: Response) => {
  try {
    const deliveryBoyId = req.user.id
    const orders = await Order.find({ deliveryBoyId }).populate('vendorId customerId')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: 'Failed to load assigned orders' })
  }
}

// PATCH /deliveryboy/order/:id/status
export const updateDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const order = await Order.findById(id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    order.deliveryStatus = status

    if (status === 'delivered') {
      const deliveryBoy = await DeliveryBoy.findById(order.deliveryBoyId)
      deliveryBoy.isAvailable = true
      await deliveryBoy.save()
    }

    await order.save()
    res.json({ message: 'Delivery status updated' })
  } catch (err) {
    res.status(500).json({ message: 'Error updating delivery status' })
  }
}
