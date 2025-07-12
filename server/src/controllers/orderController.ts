import Order from '../models/Order'
import { Request, Response } from 'express'

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { products, vendorId, totalAmount, deliveryAddress } = req.body
    const customerId = req.user.id

    if (deliveryAddress.street === '' || deliveryAddress.city === '' || deliveryAddress.state === '' || deliveryAddress.zipCode === '') {
      return res.status(400).json({ message: 'Delivery address is incomplete' })
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
    const orders = await Order.find({ customerId }).populate('products.productId')
    return res.json(orders)
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to get orders', error: err.message })
  }
}

export const getVendorOrders = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id
    const orders = await Order.find({ vendorId })
      .populate('products.productId', 'name')
    return res.json(orders)
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to get vendor orders', error: err.message })
  }
}
