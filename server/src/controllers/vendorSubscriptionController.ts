import { Request, Response } from 'express'
import Subscription from '../models/Subscription'

export const getVendorSubscription = async (req: Request, res: Response) => {
  try {
    if(!req.user){
      return res.status(401).json({message: 'Unauthorized access, user not found'})
    }
    const vendorId = req.user.id
    const subscription = await Subscription.findOne({ vendorId })

    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' })
    }

    res.json(subscription)
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch subscription', error: err.message })
  }
}
