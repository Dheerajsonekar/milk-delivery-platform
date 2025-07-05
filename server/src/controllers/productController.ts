import Product from '../models/Product'
import { Request, Response } from 'express';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, unit, description, image } = req.body
    const vendorId = req.user.id // from auth middleware

    const product = await Product.create({ name, price, unit, description, image, vendorId })
    return res.status(201).json(product)
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to create product', error: err.message })
  }
}

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('vendorId', 'name')
    return res.json(products)
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to get products', error: err.message })
  }
}

export const getVendorProducts = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user.id
    const products = await Product.find({ vendorId })
    return res.json(products)
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to get vendor products', error: err.message })
  }
}
