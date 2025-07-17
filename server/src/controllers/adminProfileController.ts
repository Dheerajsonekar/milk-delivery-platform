import { Request, Response } from 'express'
import User from '../models/User'

export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const admin = await User.findById(req.user.id).select('-password')
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' })
    }

    res.json(admin)
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch admin profile', error: err.message })
  }
}
