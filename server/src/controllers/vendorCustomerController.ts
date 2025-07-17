

import Order from '../models/Order'
import User from '../models/User'
import { Request, Response } from 'express'

export const getVendorCustomers = async (req: Request, res: Response) => {
  try {
     if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const vendorId = req.user.id  

    // Find all orders for this vendor
    const orders = await Order.find({ vendorId }).populate('customerId', 'name email')

    const customerMap = new Map()

    orders.forEach(order => {
      const customer = order.customerId as any
      const existing = customerMap.get(customer._id)

      if (existing) {
        existing.totalOrders += 1
        existing.lastOrderDate = order.createdAt > existing.lastOrderDate ? order.createdAt : existing.lastOrderDate
      } else {
        customerMap.set(customer._id, {
          _id: customer._id,
          name: customer.name,
          email: customer.email,
          totalOrders: 1,
          lastOrderDate: order.createdAt,
        })
      }
    })

    const allCustomers = [...customerMap.values()]
    const newCustomers = allCustomers.filter(c => c.totalOrders === 1)
    const loyalCustomers = allCustomers.filter(c => c.totalOrders >= 2)

    res.json({
      totalCustomers: allCustomers.length,
      newCustomers: newCustomers.length,
      loyalCustomers
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vendor customer data' })
  }
}
