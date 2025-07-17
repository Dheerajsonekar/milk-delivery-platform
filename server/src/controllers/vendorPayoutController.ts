import { Request, Response } from 'express'
import Payout from '../models/Payout' // Sequelize model
import User from '../models/User' // Mongoose model
import Order from '../models/Order' // Mongoose model

export const getPaymentSummary = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const vendorId = req.user.id

    // Total pending payout - Using Sequelize sum
    const pendingPayoutResult = await Payout.sum('amount', {
      where: { 
        vendorId, 
        status: 'requested' 
      }
    })

    // Fetch all payouts - Using Sequelize findAll
    const payouts = await Payout.findAll({ 
      where: { vendorId },
      order: [['createdAt', 'DESC']]
    })

    // Get bank details from user - Using Mongoose findById
    const vendor = await User.findById(vendorId).select('bankDetails')

    // Handle null/undefined sum result
    const pendingAmount = pendingPayoutResult || 0

    // Get bank details from latest payout OR user
    const latestBank = payouts[0]?.get('bankDetails') || null

    res.json({
      pendingAmount,
      payouts,
      bankDetails: latestBank || vendor?.bankDetails || null,
    })
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to load payment summary', error: err.message })
  }
}

export const requestPayout = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const vendorId = req.user.id

    // Calculate total unpaid amount from orders - Using Mongoose find
    const unpaidOrders = await Order.find({
      vendorId,
      paymentStatus: 'paid',
      vendorPaid: false
    })

    const totalAmount = unpaidOrders.reduce((sum: number, order: any) => {
      return sum + order.totalAmount
    }, 0)

    if (totalAmount === 0) {
      return res.status(400).json({ message: 'No unpaid earnings available for payout' })
    }

    // Fetch bank details from vendor profile - Using Mongoose findById
    const vendor = await User.findById(vendorId)
    const bankDetails = vendor?.bankDetails || {}

    // Save payout - Using Sequelize create
    const payout = await Payout.create({
      vendorId,
      amount: totalAmount,
      status: 'requested',
      bankDetails
    })

    // Update orders to mark vendorPaid = true - Using Mongoose updateMany
    await Order.updateMany(
      { 
        vendorId, 
        paymentStatus: 'paid', 
        vendorPaid: false 
      },
      { vendorPaid: true }
    )

    // Access the id property correctly for Sequelize
    res.status(201).json({ 
      message: 'Payout requested successfully', 
      payoutId: payout.get('id')
    })
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to request payout', error: err.message })
  }
}