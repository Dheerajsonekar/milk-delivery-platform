// src/controllers/vendorReportController.ts
import { Request, Response } from 'express'
import Order from '../models/Order'
import Product from '../models/Product'
import { startOfDay, endOfDay, subDays } from 'date-fns'

export const getVendorReportSummary = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id

    // Revenue calculations
    const paidOrders = await Order.find({ vendorId, paymentStatus: 'paid' })
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0)

    const today = new Date()
    const todayStart = startOfDay(today)
    const todayEnd = endOfDay(today)

    const todayOrders = await Order.find({
      vendorId,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    })
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0)

    // Customer breakdown
    const customerMap = new Map()
    paidOrders.forEach(order => {
      const cid = order.customerId.toString()
      customerMap.set(cid, (customerMap.get(cid) || 0) + 1)
    })
    const totalCustomers = customerMap.size
    let loyal = 0
    let newCustomers = 0
    customerMap.forEach(count => {
      if (count > 2) loyal++
      else newCustomers++
    })

    // Order trend (last 7 days)
    const orderTrends: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i)
      const start = startOfDay(date)
      const end = endOfDay(date)
      const count = await Order.countDocuments({
        vendorId,
        createdAt: { $gte: start, $lte: end },
      })
      orderTrends[start.toISOString().split('T')[0]] = count
    }

    // Top selling products
    const products = await Product.find({ vendorId })
    const productSales: Record<string, number> = {}
    paidOrders.forEach(order => {
      order.products.forEach(item => {
        const key = item.productId.toString()
        productSales[key] = (productSales[key] || 0) + item.quantity
      })
    })

    const populatedProducts = await Product.find({
      _id: { $in: Object.keys(productSales) },
    }).select('name')

    const topProducts = populatedProducts.map(p => ({
      name: p.name,
      sold: productSales[p._id.toString()] || 0,
    }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)

    res.json({
      totalRevenue,
      todayRevenue,
      totalCustomers,
      newCustomers,
      loyalCustomers: loyal,
      orderTrends,
      topProducts,
    })
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to load report', error: err.message })
  }
}
