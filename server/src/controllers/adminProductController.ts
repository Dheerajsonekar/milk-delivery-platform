import Product from '../models/Product'
import { Request, Response } from 'express'

export const getAllAdminProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('vendorId', 'name email')
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err })
  }
}
