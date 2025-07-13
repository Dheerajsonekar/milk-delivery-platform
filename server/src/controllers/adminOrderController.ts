import Order from '../models/Order'
import { Request, Response } from 'express'

export const getAllOrdersAdmin = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .populate('vendorId', 'name email')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err })
  }
}
