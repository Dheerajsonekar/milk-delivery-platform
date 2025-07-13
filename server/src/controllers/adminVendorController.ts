import User from '../models/User'
import { Request, Response } from 'express'

export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('-password')
    res.json(vendors)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vendors', error: err })
  }
}
