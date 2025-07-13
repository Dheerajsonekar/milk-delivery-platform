import { Request, Response } from 'express'
import Subscription from '../models/Subscription'

export const getAllSubscriptions = async (_req: Request, res: Response) => {
  try {
    const subscriptions = await Subscription.find().populate('vendorId', 'name email')
    res.json(subscriptions)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subscriptions' })
  }
}

export const updateSubscriptionStatus = async (req: Request, res: Response) => {
  const { id } = req.params
  const { isActive } = req.body

  try {
    const sub = await Subscription.findById(id)
    if (!sub) return res.status(404).json({ message: 'Subscription not found' })

    sub.isActive = isActive
    await sub.save()

    res.json({ message: 'Subscription status updated', sub })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update subscription', error: err })
  }
}
