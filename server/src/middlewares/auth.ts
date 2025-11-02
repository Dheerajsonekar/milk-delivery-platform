import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined')
    }

    
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload & { id: string; role: string }
    
   
    if (!decoded.id || !decoded.role) {
      throw new Error('Invalid token payload')
    }

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

export const verifyDeliveryBoy = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  if (!user || user.role !== 'deliveryBoy') {
    return res.status(403).json({ message: 'Access denied. Delivery boy only.' })
  }

  next()
}