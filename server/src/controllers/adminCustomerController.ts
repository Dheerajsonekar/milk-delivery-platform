import User from '../models/User'
import { Request, Response } from 'express'

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password')
    res.json(customers)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers', error: err })
  }
}
