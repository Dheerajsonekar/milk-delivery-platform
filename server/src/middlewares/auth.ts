import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' })
  }

  next()
}

export const verifyVendor = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user || user.role !== 'vendor') {
    return res.status(403).json({ message: 'Access denied. Vendors only.' })
  }

  next()
}
