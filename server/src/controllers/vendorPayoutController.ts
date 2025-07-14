// src/controllers/vendorPayoutController.ts

import { Request, Response } from 'express'
import Payout from '../models/Payout'
import User from '../models/User'
import Order from '../models/Order'

export const getPaymentSummary = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id

    // Total pending payout
    const pendingPayout = await Payout.aggregate([
      { $match: { vendorId, status: 'requested' } },
      { $group: {  total: { $sum: '$amount' } } }
    ])

    // Fetch all payouts
    const payouts = await Payout.find({ vendorId }).sort({ createdAt: -1 })

    // Get bank details from latest payout OR user
    const latestBank = payouts[0]?.bankDetails || null
    const vendor = await User.findById(vendorId).select('bankDetails')

    res.json({
      pendingAmount: pendingPayout[0]?.total || 0,
      payouts,
      bankDetails: latestBank || vendor?.bankDetails || null,
    })
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to load payment summary', error: err.message })
  }
}


export const requestPayout = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id

    // Calculate total unpaid amount from orders
    const unpaidOrders = await Order.find({
      vendorId,
      paymentStatus: 'paid',
      vendorPaid: false
    })

    const totalAmount = unpaidOrders.reduce((sum, order) => sum + order.totalAmount, 0)

    if (totalAmount === 0) {
      return res.status(400).json({ message: 'No unpaid earnings available for payout' })
    }

    // Optional: Fetch bank details from vendor profile
    const vendor = await User.findById(vendorId)
    const bankDetails = vendor?.bankDetails || {}

    // Save payout
    const payout = new Payout({
      vendorId,
      amount: totalAmount,
      status: 'requested',
      bankDetails
    })

    await payout.save()

    // Update orders to mark vendorPaid = true
    await Order.updateMany(
      { vendorId, paymentStatus: 'paid', vendorPaid: false },
      { $set: { vendorPaid: true } }
    )

    res.status(201).json({ message: 'Payout requested successfully', payoutId: payout._id })
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to request payout', error: err.message })
  }
}
