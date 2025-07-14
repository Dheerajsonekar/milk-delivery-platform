import { Request, Response } from 'express'
import Order from '../models/Order'
import Payout from '../models/Payout'


export const getPaymentSummary = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id

    // Calculate pending delivered amount
    const deliveredOrders = await Order.find({ vendorId, status: 'delivered' })
    const totalDeliveredAmount = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0)

    // Sum of all paid payouts
    const paidPayouts = await Payout.findAll({ where: { vendorId, status: 'paid' } })
    const totalPaid = paidPayouts.reduce((sum: number, payout: any) => sum + payout.amount, 0)

    const pendingAmount = totalDeliveredAmount - totalPaid

    res.json({
      pendingAmount,
      paidAmount: totalPaid,
    })
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to get summary', error: err.message })
  }
}


export const requestPayout = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id
    const { amount, bankDetails } = req.body

    const payout = await Payout.create({
      vendorId,
      amount,
      status: 'requested',
      bankDetails,
    })

    res.status(201).json({ message: 'Payout requested', payout })
  } catch (err: any) {
    res.status(500).json({ message: 'Payout request failed', error: err.message })
  }
}
