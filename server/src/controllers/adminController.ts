import { Request, Response } from 'express'
import User from '../models/User'
import jwt from 'jsonwebtoken'

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const admin = await User.findOne({ email, role: 'admin' })
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ authenticated: false, message: 'Invalid credentials' })
  }

  const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  })

  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
  res.json({ authenticated: true })
}
