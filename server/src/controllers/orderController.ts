import Order from '../models/Order'
import { Request, Response } from 'express'

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { products, vendorId, totalAmount } = req.body
    const customerId = req.user.id

    const order = await Order.create({ products, vendorId, totalAmount, customerId })
    return res.status(201).json(order)
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to place order', error: err.message })
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
    const orders = await Order.find({ vendorId }).populate('products.productId')
    return res.json(orders)
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to get vendor orders', error: err.message })
  }
}
