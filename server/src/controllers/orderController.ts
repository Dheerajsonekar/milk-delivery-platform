import { Request, Response } from 'express'
import Order from '../models/Order'
import DeliveryBoy from '../models/DeliveryBoy'

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { products, vendorId, totalAmount, deliveryAddress } = req.body
    const customerId = req.user.id

    if (deliveryAddress.street === '' || deliveryAddress.city === '' || deliveryAddress.state === '' || deliveryAddress.zipCode === '') {
      return res.status(400).json({ message: 'Delivery address is incomplete' })
    }

    const availableBoy = await DeliveryBoy.findOne({ isAvailable: true })

    if (availableBoy) {
     Order.deliveryBoyId = availableBoy._id
     Order.deliveryStatus = 'pending'

      availableBoy.assignedOrders.push(Order._id)
      availableBoy.isAvailable = false

      await availableBoy.save()
      await Order.save()
    }

    const order = await Order.create({ products, vendorId, totalAmount, customerId, deliveryAddress })
    return res.status(201).json(order)
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to place order', error: err.message })
  }
}

// Update order status (vendor only)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id
    const { orderId, status } = req.body

    const order = await Order.findOne({ _id: orderId, vendorId })
    if (!order) return res.status(404).json({ message: 'Order not found or unauthorized' })

    order.status = status
    await order.save()

    res.json({ message: 'Order status updated successfully', order })
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update status', error: err.message })
  }
}

export const getCustomerOrders = async (req: Request, res: Response) => {
  try {
    const customerId = req.user.id
    const orders = await Order.find({ customerId })
      .populate('products.productId', 'name price')
      .sort({ createdAt: -1 })

    // Filter out products with null productId (deleted products)
    const filteredOrders = orders.map(order => ({
      ...order.toObject(),
      products: order.products.filter(item => item.productId != null)
    }))

    return res.json(filteredOrders)
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to get orders', error: err.message })
  }
}

export const cancelCustomerOrder = async (req: Request, res: Response) => {
  try {
    const customerId = req.user.id
    const { orderId } = req.params
    const { reason } = req.body

    const order = await Order.findOne({ _id: orderId, customerId })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' })
    }

    order.status = 'cancelled'
    order.cancelReason = reason || 'No reason provided'
    await order.save()

    res.json({ message: 'Order cancelled successfully' })
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to cancel order', error: err.message })
  }
}

export const getVendorOrders = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id
    const orders = await Order.find({ vendorId })
      .populate('products.productId', 'name')

    // Filter out products with null productId
    const filteredOrders = orders.map(order => ({
      ...order.toObject(),
      products: order.products.filter(item => item.productId != null)
    }))

    return res.json(filteredOrders)
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to get vendor orders', error: err.message })
  }
}